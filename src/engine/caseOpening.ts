import type { CaseDef, ItemDef, OwnedItem } from '../types';
import { getItem } from '../data/items';
import { weightedPick, uid } from './rng';

// ─── Case opening logic (pure; RNG injectable for tests) ───────────────────

export interface OpenResult {
  item: OwnedItem;
  def: ItemDef;
}

/** Roll a single case drop. rng returns [0,1). */
export function rollCase(caseDef: CaseDef, rng: () => number): ItemDef {
  if (caseDef.drops.length === 0) throw new Error(`Case ${caseDef.id} has no drops`);
  const weights = caseDef.drops.map((d) => d.weight);
  const idx = weightedPick(weights, rng);
  return getItem(caseDef.drops[idx].defId);
}

export function makeOwned(defId: string): OwnedItem {
  return { uid: uid('own'), defId, acquiredAt: Date.now() };
}

/** Open a case end-to-end with Math.random. */
export function openCase(caseDef: CaseDef): OpenResult {
  const def = rollCase(caseDef, Math.random);
  return { item: makeOwned(def.id), def };
}

/** Build a reel of candidate items for the spinning animation (winner at index `stopAt`). */
export function buildReel(caseDef: CaseDef, winner: ItemDef, length: number, rng: () => number): ItemDef[] {
  const pool = caseDef.drops.map((d) => getItem(d.defId));
  const reel: ItemDef[] = [];
  for (let i = 0; i < length; i++) reel.push(pool[Math.floor(rng() * pool.length)]);
  reel[length - 5] = winner; // near the end so it decelerates onto the prize
  return reel;
}

/** Sell price: 60% of market value, rounded. */
export function sellPrice(def: ItemDef): number {
  return Math.round(def.value * 0.6);
}
