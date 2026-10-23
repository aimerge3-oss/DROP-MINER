import type { BenchmarkDef } from '../types';

// ─── DROP MINER benchmark scenarios (all simulated) ─────────────────────────
export const BENCHMARKS: BenchmarkDef[] = [
  {
    id: 'bench_desktop', name: 'Desktop Drift', icon: '🖱️', accent: '#8b9bb4',
    blurb: 'A calm UI-compositing stress test. Warm-up run for new rigs.',
    durationMs: 6000, gpuWeight: 0.35, difficulty: 1, rewardBase: 40, minVRAM: 2, unlockScore: 0,
  },
  {
    id: 'bench_neon_rush', name: 'Neon Rush', icon: '🏙️', accent: '#a3e635',
    blurb: 'Rain-soaked night city flythrough at high frame targets.',
    durationMs: 9000, gpuWeight: 0.7, difficulty: 2, rewardBase: 70, minVRAM: 4, unlockScore: 0,
  },
  {
    id: 'bench_particle_storm', name: 'Particle Storm', icon: '✨', accent: '#38bdf8',
    blurb: 'Millions of physics particles. CPU-bound chaos with GPU sparks.',
    durationMs: 10000, gpuWeight: 0.45, difficulty: 3, rewardBase: 110, minVRAM: 6, unlockScore: 900,
  },
  {
    id: 'bench_ray_cavern', name: 'Ray Cavern', icon: '💎', accent: '#a78bfa',
    blurb: 'Path-traced crystal cavern. VRAM and cooling decide everything.',
    durationMs: 12000, gpuWeight: 0.85, difficulty: 4, rewardBase: 170, minVRAM: 8, unlockScore: 2200,
  },
  {
    id: 'bench_void_engine', name: 'Void Engine Trial', icon: '🌌', accent: '#f472b6',
    blurb: 'The ultimate synthetic gauntlet. Only stable extreme rigs finish it.',
    durationMs: 14000, gpuWeight: 0.6, difficulty: 5, rewardBase: 260, minVRAM: 12, unlockScore: 4800,
  },
];

export const BENCH_MAP = new Map(BENCHMARKS.map((b) => [b.id, b]));
