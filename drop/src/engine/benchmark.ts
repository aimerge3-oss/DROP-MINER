import type { BenchmarkDef, BenchmarkRun, Build, TuneSettings } from '../types';
import { DEFAULT_TUNE } from '../types';
import { getItem } from '../data/items';
import { resolveBuild, buildReadiness, supportsOverclock, type ResolvedBuild } from './compatibility';
import { mulberry32, hashSeed, uid } from './rng';

// ─── Simulated benchmark engine ─────────────────────────────────────────────
// All numbers are game-simulation values; they do NOT measure the user's PC.

export interface PowerEstimate {
  gpuW: number; cpuW: number; otherW: number; totalW: number;
}

/** Baseline power draw in watts for installed hardware at stock clocks. */
export function estimatePower(rb: ResolvedBuild, tune: TuneSettings): PowerEstimate {
  const gpuW = rb.gpu ? 45 + rb.gpu.perf * 0.11 : 0;
  const cpuW = rb.cpu ? 35 + rb.cpu.perf * 0.075 : 0;
  const otherW = 55 + (rb.ram.length * 4) + (rb.ssd ? 8 : 0) + (rb.fans.length * 3);
  const ocScale = 1 + Math.max(0, tune.gpuOC) * 0.009 + Math.max(0, tune.cpuOC) * 0.008;
  const plScale = tune.powerLimit / 100;
  const uvScale = 1 - tune.undervolt * 0.006;
  return {
    gpuW: Math.round(gpuW * ocScale * plScale * uvScale),
    cpuW: Math.round(cpuW * (1 + Math.max(0, tune.cpuOC) * 0.01) * plScale * uvScale),
    otherW,
    totalW: 0, // filled below
  } as PowerEstimate & { totalW: number };
}

export function totalPower(p: PowerEstimate): number {
  return p.gpuW + p.cpuW + p.otherW;
}

/** Cooling capacity in "watts removable above ambient baseline". */
export function coolingCapacity(rb: ResolvedBuild, tune: TuneSettings): number {
  const fanBonus = rb.fans.reduce((a, f) => a + (f.coolingPower ?? 0), 0);
  const caseAirflow = rb.pcCase ? (rb.pcCase.fanSlots ?? 0) * 6 : 0;
  const aggro = 0.75 + (tune.fanAggression / 100) * 0.5; // 0.75..1.25
  return Math.round(((rb.cooler?.coolingPower ?? 0) + fanBonus * 0.8 + caseAirflow) * aggro);
}

/** Raw performance points of the machine (before thermals). */
export function rawPerformance(rb: ResolvedBuild, tune: TuneSettings): { gpuPts: number; cpuPts: number; memPts: number } {
  const ocAllowed = supportsOverclock(rb);
  const cpuOC = ocAllowed ? tune.cpuOC : Math.min(tune.cpuOC, 0);
  const gpuOC = ocAllowed ? tune.gpuOC : Math.min(tune.gpuOC, 0);
  const memOC = ocAllowed ? tune.memOC : Math.min(tune.memOC, 0);

  const gpuPts = (rb.gpu?.perf ?? 0) * (1 + gpuOC / 100) * (1 + Math.max(0, tune.memOC) / 400);
  const cpuPts = (rb.cpu?.perf ?? 0) * (1 + cpuOC / 100);
  const ramCount = Math.max(1, rb.ram.length);
  const stickSpeed = rb.ram[0]?.ramSpeed ?? 2400;
  const stickCap = rb.ram[0]?.ramGB ?? 8;
  const dualChannel = ramCount >= 2 ? 1.35 : 1.0;
  const memPts = (stickSpeed / 1000) * Math.min(4, ramCount) * dualChannel * (1 + memOC / 100) * (1 + stickCap / 128);
  return { gpuPts, cpuPts, memPts };
}

export interface Prediction {
  ready: boolean; missing: string[];
  scoreEst: number; avgFpsEst: number; tempEst: number; powerEst: number;
  cooling: number; stable: boolean; throttled: boolean; ocBlocked: boolean;
}

/** Quick prediction used by builder/OC screens — same math as runBenchmark. */
export function predict(build: Build, bench: BenchmarkDef, uidToDefId: Map<string, string>): Prediction {
  const rb = resolveBuild(build, uidToDefId);
  const readiness = buildReadiness(rb);
  if (!readiness.ready) {
    return { ready: false, missing: readiness.missing, scoreEst: 0, avgFpsEst: 0, tempEst: 0, powerEst: 0, cooling: 0, stable: false, throttled: false, ocBlocked: false };
  }
  const r = computeRun(rb, build.tune, bench, 'predict');
  return {
    ready: true, missing: [], ocBlocked: !supportsOverclock(rb) && (build.tune.cpuOC > 0 || build.tune.gpuOC > 0 || build.tune.memOC > 0),
    scoreEst: r.score, avgFpsEst: r.avgFps, tempEst: r.maxTempC, powerEst: r.powerW,
    cooling: coolingCapacity(rb, build.tune), stable: r.stable, throttled: r.throttled,
  };
}

interface RunCore {
  score: number; avgFps: number; low1Fps: number; maxTempC: number; powerW: number;
  stable: boolean; throttled: boolean; failed: boolean; stability: number;
}

/** Deterministic core computation. Same inputs → same outputs. */
export function computeRun(rb: ResolvedBuild, tune: TuneSettings, bench: BenchmarkDef, seedKey: string): RunCore {
  const rng = mulberry32(hashSeed(`${bench.id}|${seedKey}`));
  const { gpuPts, cpuPts, memPts } = rawPerformance(rb, tune);

  // Combined throughput weighted per benchmark profile
  const combined =
    bench.gpuWeight * gpuPts * (1 + memPts / 60) +
    (1 - bench.gpuWeight) * cpuPts * (1 + memPts / 45);

  // VRAM gate: insufficient memory craters results
  const vram = rb.gpu?.vramGB ?? 0;
  let vramFactor = 1;
  if (vram < bench.minVRAM) vramFactor = Math.max(0.15, 1 - (bench.minVRAM - vram) * 0.22);

  // Thermals ---------------------------------------------------------
  const power = estimatePower(rb, tune);
  const powerTotal = totalPower(power);
  const heatLoad = powerTotal * (0.85 + bench.difficulty * 0.09);
  const cooling = coolingCapacity(rb, tune);
  // Temperature model: sustained load temperature from heat vs removal balance
  const maxTempC = Math.round(Math.min(110, Math.max(35, 52 + (heatLoad - cooling) * 0.16 + bench.difficulty * 3)));

  // Thermal throttle: sustained >88°C cuts clocks
  let thermalMult = 1;
  const throttled = maxTempC >= 88;
  if (throttled) thermalMult = Math.max(0.55, 1 - (maxTempC - 88) * 0.018);

  // PSU limit: underpowered supply caps clocks hard
  const psuW = rb.psu?.psuWatts ?? 0;
  let psuMult = 1;
  let failed = false;
  if (powerTotal > psuW) {
    psuMult = Math.max(0.3, psuW / powerTotal);
    if (powerTotal > psuW * 1.25) failed = true; // sudden shutdown under transient load
  }

  // Stability score 0..1 ----------------------------------------------
  // OC beyond what cooling can absorb destabilizes runs.
  const ocHeat = Math.max(0, tune.cpuOC) * 2.2 + Math.max(0, tune.gpuOC) * 2.6 + Math.max(0, tune.memOC) * 1.4;
  const coolMargin = cooling - heatLoad - ocHeat;
  let stability = 0.98;
  stability -= Math.max(0, (maxTempC - 80) * 0.02);
  stability -= Math.max(0, coolMargin < 0 ? Math.min(0.5, -coolMargin / 220) : 0);
  stability -= Math.max(0, (tune.memOC - 15) * 0.012);
  stability = Math.max(0.05, Math.min(0.995, stability));

  // Deterministic jitter scaled by instability (seeded → reproducible)
  const jitter = 1 - (1 - stability) * rng() * 0.9;

  // FPS ----------------------------------------------------------------
  const rawFps = (combined / 9.2) * vramFactor * thermalMult * psuMult * jitter;
  // Diminishing returns so extreme rigs don't print absurd numbers
  const avgFps = Math.round(rawFps <= 60 ? rawFps : 60 + Math.pow(rawFps - 60, 0.92));
  const frameVariance = Math.max(0.25, 1 - stability * 0.75);
  const low1Fps = Math.max(1, Math.round(avgFps * (0.72 - frameVariance * 0.35)));

  const score = failed ? 0 : Math.round(avgFps * 18 + low1Fps * 7 + stability * 400);
  const stable = !failed && stability >= 0.6 && maxTempC < 95;

  return { score, avgFps, low1Fps, maxTempC, powerW: powerTotal, stable, throttled, failed, stability };
}

/** Produce a full recorded run + credits reward. */
export function runBenchmark(
  build: Build, bench: BenchmarkDef, uidToDefId: Map<string, string>, prevBestForBench: number,
): { run: BenchmarkRun; credits: number } {
  const rb = resolveBuild(build, uidToDefId);
  const readiness = buildReadiness(rb);
  if (!readiness.ready) throw new Error(`Build incomplete: missing ${readiness.missing.join(', ')}`);

  const core = computeRun(rb, build.tune, bench, `${build.id}`);
  const improvement = prevBestForBench > 0 ? Math.max(0, core.score - prevBestForBench) : core.score;

  let credits = Math.round(bench.rewardBase * (core.score / 1000) + improvement * 0.05);
  if (core.failed) credits = Math.round(bench.rewardBase * 0.1); // pity payout
  else if (!core.stable) credits = Math.round(credits * 0.5);
  credits = Math.max(5, credits);

  const gpu = rb.gpu?.name ?? '?';
  const cpu = rb.cpu?.name ?? '?';
  const run: BenchmarkRun = {
    id: uid('run'), benchId: bench.id, buildId: build.id, buildName: build.name,
    score: core.score, avgFps: core.avgFps, low1Fps: core.low1Fps,
    maxTempC: core.maxTempC, powerW: core.powerW,
    stable: core.stable, throttled: core.throttled, failed: core.failed,
    creditsEarned: credits, timestamp: Date.now(),
    hardwareSummary: `${gpu} · ${cpu}`,
  };
  return { run, credits };
}

/** Convenience for UI: default tune check. */
export function isDefaultTune(t: TuneSettings): boolean {
  return t.cpuOC === DEFAULT_TUNE.cpuOC && t.gpuOC === DEFAULT_TUNE.gpuOC &&
    t.memOC === DEFAULT_TUNE.memOC && t.powerLimit === DEFAULT_TUNE.powerLimit &&
    t.fanAggression === DEFAULT_TUNE.fanAggression && t.undervolt === DEFAULT_TUNE.undervolt;
}

export { getItem };
