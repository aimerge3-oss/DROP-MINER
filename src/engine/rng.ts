// ─── Deterministic RNG utilities ────────────────────────────────────────────
// mulberry32: small, fast, seedable PRNG. Used to make benchmark results
// reproducible for identical hardware + settings (seed derived from state).

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a string hash → 32-bit seed */
export function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Weighted pick using a supplied rng. Returns index. */
export function weightedPick(weights: number[], rng: () => number): number {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) throw new Error('weightedPick: non-positive total weight');
  let r = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r < 0) return i;
  }
  return weights.length - 1;
}

/** Generate a random-ish unique id for owned items / runs / builds. */
let counter = 0;
export function uid(prefix: string): string {
  counter += 1;
  const rand = Math.floor(Math.random() * 0xffffff).toString(36);
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${rand}`;
}
