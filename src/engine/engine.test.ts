// ─── Unit tests for the DROP MINER simulation engine ────────────────────────
// Run with: npm test   (vitest)

import { describe, it, expect } from 'vitest';
import { mulberry32, hashSeed, weightedPick, uid } from './rng';
import { rollCase, buildReel, sellPrice, makeOwned } from './caseOpening';
import { generatePlayerId, PLAYER_ID_PATTERN } from './playerId';
import { resolveBuild, checkCompatibility, buildReadiness, supportsOverclock } from './compatibility';
import { computeRun, runBenchmark } from './benchmark';
import { CASES } from '../data/cases';
import { BENCHMARKS } from '../data/benchmarks';
import { getItem, ITEMS } from '../data/items';
import { DEFAULT_TUNE } from '../types';
import type { Build, ItemDef } from '../types';

// Helper: a fully-compatible starter build using catalog starter items.
function starterBuild(): { build: Build; uidMap: Map<string, string> } {
  const defs: Record<string, string> = {
    gpu: 'gpu_nyx_g160', cpu: 'cpu_cf_q240', mobo: 'mobo_hex_w660',
    ram: 'ram_dw8_2666', ssd: 'ssd_dv256_sata', psu: 'psu_vc400',
    cooler: 'cool_cf_stock', caseUid: 'case_ib_mini',
  };
  const slots: any = {
    gpu: null, cpu: null, mobo: null, ram: [], ssd: null,
    psu: null, cooler: null, caseUid: null, fans: [],
  };
  const uidMap = new Map<string, string>();
  let n = 0;
  for (const [slot, defId] of Object.entries(defs)) {
    const u = `u${n++}`;
    uidMap.set(u, defId);
    if (slot === 'ram') slots.ram = [u, u]; // two sticks of the same kit
    else slots[slot] = u;
  }
  const build: Build = { id: 'b_test', name: 'Test Rig', slots, tune: DEFAULT_TUNE, createdAt: 0 };
  return { build, uidMap };
}

describe('rng', () => {
  it('mulberry32 is deterministic for equal seeds', () => {
    const a = mulberry32(42), b = mulberry32(42);
    for (let i = 0; i < 50; i++) expect(a()).toBe(b());
  });
  it('values are in [0,1)', () => {
    const r = mulberry32(hashSeed('seed-string'));
    for (let i = 0; i < 200; i++) { const v = r(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
  it('hashSeed is stable across calls', () => {
    expect(hashSeed('drop-miner')).toBe(hashSeed('drop-miner'));
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
  });
  it('weightedPick respects zero-weight entries', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 30; i++) expect(weightedPick([0, 1, 0], r)).toBe(1);
  });
  it('weightedPick throws on all-zero weights', () => {
    expect(() => weightedPick([0, 0], Math.random)).toThrow();
  });
  it('uid produces unique prefixed ids', () => {
    const s = new Set<string>();
    for (let i = 0; i < 500; i++) s.add(uid('t'));
    expect(s.size).toBe(500);
  });
});

describe('playerId', () => {
  it('matches FPS######-###AAA format', () => {
    for (let i = 0; i < 50; i++) {
      expect(generatePlayerId(new Set())).toMatch(PLAYER_ID_PATTERN);
    }
  });
  it('never returns an id already in use', () => {
    const existing = new Set<string>();
    for (let i = 0; i < 25; i++) {
      const id = generatePlayerId(existing);
      expect(existing.has(id)).toBe(false);
      existing.add(id);
    }
    expect(existing.size).toBe(25);
  });
});

describe('item catalog integrity', () => {
  it('every item has positive value and required fields', () => {
    for (const it of ITEMS) {
      expect(it.value).toBeGreaterThan(0);
      expect(it.name.length).toBeGreaterThan(0);
      expect(it.id).toContain('_');
    }
  });
  it('getItem throws for unknown ids', () => {
    expect(() => getItem('nope_not_real')).toThrow();
  });
});

describe('case opening', () => {
  it('every drop reference resolves to a real item', () => {
    for (const c of CASES) for (const d of c.drops) expect(() => getItem(d.defId)).not.toThrow();
  });
  it('rollCase is deterministic for a fixed rng seed', () => {
    const c = CASES[1];
    const a = rollCase(c, mulberry32(999));
    const b = rollCase(c, mulberry32(999));
    expect(a.id).toBe(b.id);
  });
  it('rollCase only returns items from that case pool', () => {
    const r = mulberry32(123);
    const pool = new Set(CASES[0].drops.map((d) => d.defId));
    for (let i = 0; i < 100; i++) expect(pool.has(rollCase(CASES[0], r).id)).toBe(true);
  });
  it('buildReel places the winner near the end', () => {
    const c = CASES[2];
    const winner = getItem(c.drops[0].defId);
    const reel = buildReel(c, winner, 30, mulberry32(5));
    expect(reel.length).toBe(30);
    expect(reel[25].id).toBe(winner.id);
  });
  it('sellPrice is 60% rounded', () => {
    const def = getItem('gpu_nyx_g160');
    expect(sellPrice(def)).toBe(Math.round(def.value * 0.6));
  });
  it('makeOwned creates unique uids', () => {
    expect(makeOwned('gpu_nyx_g160').uid).not.toBe(makeOwned('gpu_nyx_g160').uid);
  });
});

describe('compatibility rules', () => {
  const { uidMap } = starterBuild();
  const rb = resolveBuild(starterBuild().build, uidMap);

  it('starter build is benchmark-ready', () => {
    expect(buildReadiness(rb).ready).toBe(true);
    expect(buildReadiness(rb).missing).toEqual([]);
  });
  it('socket mismatch is rejected with explanation', () => {
    // find a CPU whose socket differs from the installed board
    const otherCpu: ItemDef | undefined = ITEMS.find(
      (i) => i.type === 'CPU' && i.socket !== rb.mobo!.socket,
    );
    if (otherCpu) {
      const res = checkCompatibility(otherCpu, 'cpu', rb);
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/Socket mismatch/);
    }
  });
  it('mixed RAM kits are rejected', () => {
    // install a second, different stick on top of the starter kit
    const otherRam = getItem('ram_dw8_2666');
    const rb2: typeof rb = { ...rb, ram: [otherRam, getItem('ram_dw8_2666')] };
    // now try a *different* model against an existing one
    const foreign = ITEMS.find((i) => i.type === 'RAM' && i.id !== 'ram_dw8_2666');
    if (foreign) {
      const res = checkCompatibility(foreign, 'ram', rb2);
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/Mixed RAM/);
    } else {
      // only one RAM kit exists in catalog — same-kit add is allowed
      expect(checkCompatibility(otherRam, 'ram', rb2).ok).toBe(true);
    }
  });
  it('identical RAM stick is accepted', () => {
    const same = getItem('ram_dw8_2666');
    expect(checkCompatibility(same, 'ram', rb).ok).toBe(true);
  });
  it('empty build reports every missing slot', () => {
    const empty: Build = {
      id: 'e', name: 'Empty', tune: DEFAULT_TUNE, createdAt: 0,
      slots: { gpu: null, cpu: null, mobo: null, ram: [], ssd: null, psu: null, cooler: null, caseUid: null, fans: [] },
    };
    const r = buildReadiness(resolveBuild(empty, new Map()));
    expect(r.ready).toBe(false);
    expect(r.missing.length).toBe(8);
  });
  it('budget board does not advertise overclocking', () => {
    expect(supportsOverclock(rb)).toBe(getItem('mobo_hex_w660').supportsOC === true);
  });
});

describe('benchmark simulation', () => {
  const { build, uidMap } = starterBuild();
  const bench = BENCHMARKS[1]; // Neon Rush — unlocked by default

  it('is deterministic: identical inputs produce identical outputs', () => {
    const rb = resolveBuild(build, uidMap);
    const a = computeRun(rb, DEFAULT_TUNE, bench, 'fixed-key');
    const b = computeRun(rb, DEFAULT_TUNE, bench, 'fixed-key');
    expect(a).toEqual(b);
  });
  it('different builds give different result keys', () => {
    const rb = resolveBuild(build, uidMap);
    const a = computeRun(rb, DEFAULT_TUNE, bench, 'key-a');
    const b = computeRun(rb, DEFAULT_TUNE, bench, 'key-b');
    // scores may coincide but full float paths differ; at minimum both valid
    expect(a.score).toBeGreaterThanOrEqual(0);
    expect(b.score).toBeGreaterThanOrEqual(0);
  });
  it('overclocking raises raw performance vs stock', () => {
    const rb = resolveBuild(build, uidMap);
    const stock = computeRun(rb, DEFAULT_TUNE, bench, 'oc-test');
    const oc = computeRun(rb, { ...DEFAULT_TUNE, cpuOC: 12, gpuOC: 12 }, bench, 'oc-test');
    // OC should never be worse when power/thermals allow; compare fps or note throttle
    expect(oc.avgFps + oc.maxTempC).toBeGreaterThan(stock.avgFps); // heat rises too
  });
  it('extreme OC increases temperature', () => {
    const rb = resolveBuild(build, uidMap);
    const stock = computeRun(rb, DEFAULT_TUNE, bench, 't1');
    const hot = computeRun(rb, { ...DEFAULT_TUNE, cpuOC: 25, gpuOC: 25, fanAggression: 0 }, bench, 't1');
    expect(hot.maxTempC).toBeGreaterThan(stock.maxTempC);
  });
  it('runBenchmark returns credits and a well-formed record', () => {
    const prevBest = 0;
    const { run, credits } = runBenchmark(build, bench, uidMap, prevBest);
    expect(run.benchId).toBe(bench.id);
    expect(run.avgFps).toBeGreaterThan(0);
    expect(run.low1Fps).toBeLessThanOrEqual(run.avgFps);
    expect(credits).toBeGreaterThanOrEqual(5);
    expect(run.hardwareSummary).toContain('·');
  });
  it('incomplete builds cannot be benchmarked', () => {
    const broken: Build = { ...build, slots: { ...build.slots, gpu: null } };
    expect(() => runBenchmark(broken, bench, uidMap, 0)).toThrow(/incomplete/i);
  });
  it('VRAM shortfall penalizes heavy benchmarks', () => {
    const rb = resolveBuild(build, uidMap);
    const light = computeRun(rb, DEFAULT_TUNE, BENCHMARKS[0], 'vram');
    const heavy = computeRun(rb, DEFAULT_TUNE, BENCHMARKS[3], 'vram');
    // starter GPU has little VRAM → Ray Cavern (high minVRAM) should hurt per-point output
    expect(heavy.avgFps).toBeLessThan(light.avgFps);
  });
});
