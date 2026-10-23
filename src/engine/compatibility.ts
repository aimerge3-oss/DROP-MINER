import type { Build, CompatibilityResult, ItemDef } from '../types';
import { getItem } from '../data/items';

export type SlotUnion = 'gpu' | 'cpu' | 'mobo' | 'ram' | 'ssd' | 'psu' | 'cooler' | 'case' | 'fan';

// ─── Compatibility rules ────────────────────────────────────────────────────
// Resolved defs for a build's slots.

export interface ResolvedBuild {
  gpu?: ItemDef; cpu?: ItemDef; mobo?: ItemDef; ssd?: ItemDef;
  psu?: ItemDef; cooler?: ItemDef; pcCase?: ItemDef;
  ram: ItemDef[]; fans: ItemDef[];
}

export function resolveBuild(build: Build, uidToDefId: Map<string, string>): ResolvedBuild {
  const d = (id: string | null): ItemDef | undefined =>
    id ? getItem(uidToDefId.get(id) ?? '') : undefined;
  return {
    gpu: d(build.slots.gpu),
    cpu: d(build.slots.cpu),
    mobo: d(build.slots.mobo),
    ssd: d(build.slots.ssd),
    psu: d(build.slots.psu),
    cooler: d(build.slots.cooler),
    pcCase: d(build.slots.caseUid),
    ram: build.slots.ram.map((u) => uidToDefId.get(u)).filter(Boolean).map((id) => getItem(id!)),
    fans: build.slots.fans.map((u) => uidToDefId.get(u)).filter(Boolean).map((id) => getItem(id!)),
  };
}

const FORM_RANK: Record<string, number> = { mATX: 0, ATX: 1, 'E-ATX': 2 };

/** Is `part` installable into the given slot of this build? */
export function checkCompatibility(
  part: ItemDef, slot: SlotUnion, rb: ResolvedBuild,
): CompatibilityResult {
  switch (slot) {
    case 'cpu': {
      if (!rb.mobo) return { ok: false, reason: 'Install a motherboard first — CPU socket must match.' };
      if (part.socket !== rb.mobo.socket)
        return { ok: false, reason: `Socket mismatch: ${part.socket} CPU will not fit ${rb.mobo.socket} board (${rb.mobo.name}).` };
      return { ok: true };
    }
    case 'mobo': {
      if (rb.cpu && part.socket !== rb.cpu.socket)
        return { ok: false, reason: `Socket mismatch: board is ${part.socket}, installed CPU needs ${rb.cpu.socket}.` };
      if (rb.pcCase && (FORM_RANK[part.formFactor ?? 'ATX'] ?? 1) > (FORM_RANK[rb.pcCase.caseForm ?? 'ATX'] ?? 1))
        return { ok: false, reason: `${part.name} (${part.formFactor}) is too large for ${rb.pcCase.name} (${rb.pcCase.caseForm}).` };
      return { ok: true };
    }
    case 'cooler': {
      if (rb.pcCase) {
        // AIO coolers are judged by radiator, air towers by height. Use tier heuristic.
        const heightGuess = part.id.includes('stock') ? 30 : part.id.includes('tower90') ? 160 : 60;
        if (heightGuess > (rb.pcCase.maxCoolerMM ?? 999))
          return { ok: false, reason: `${part.name} is taller than ${rb.pcCase.name}'s ${rb.pcCase.maxCoolerMM}mm clearance.` };
      }
      if (rb.cpu && (rb.cpu.perf > 700 && part.coolingPower! < 160))
        return { ok: false, reason: `${part.name} cannot physically mount the heat load of ${rb.cpu.name}. Choose better cooling.` };
      return { ok: true };
    }
    case 'case': {
      if (rb.mobo && (FORM_RANK[rb.mobo.formFactor ?? 'ATX'] ?? 1) > (FORM_RANK[part.caseForm ?? 'ATX'] ?? 1))
        return { ok: false, reason: `${rb.mobo.name} (${rb.mobo.formFactor}) does not fit inside ${part.name} (${part.caseForm}).` };
      if (rb.cooler) {
        const heightGuess = rb.cooler.id.includes('stock') ? 30 : rb.cooler.id.includes('tower90') ? 160 : 60;
        if (heightGuess > (part.maxCoolerMM ?? 999))
          return { ok: false, reason: `Installed ${rb.cooler.name} exceeds ${part.name}'s cooler clearance.` };
      }
      return { ok: true };
    }
    case 'ram': {
      if (rb.ram.length >= 4) return { ok: false, reason: 'All four DIMM slots are populated.' };
      if (rb.ram.some((r) => r.id !== part.id))
        return { ok: false, reason: 'Mixed RAM kits destabilize benchmarks. Fill remaining slots with identical sticks.' };
      return { ok: true };
    }
    case 'psu':
    case 'ssd':
    case 'gpu':
      return { ok: true };
    case 'fan': {
      const cap = rb.pcCase?.fanSlots ?? 2;
      if (rb.fans.length >= Math.min(cap, 6))
        return { ok: false, reason: `No free fan slots (case provides ${cap}).` };
      return { ok: true };
    }
  }
}

/** A build can run benchmarks when all eight core slots are filled. */
export function buildReadiness(rb: ResolvedBuild): { ready: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!rb.gpu) missing.push('GPU');
  if (!rb.cpu) missing.push('CPU');
  if (!rb.mobo) missing.push('Motherboard');
  if (rb.ram.length === 0) missing.push('RAM');
  if (!rb.ssd) missing.push('Storage');
  if (!rb.psu) missing.push('PSU');
  if (!rb.cooler) missing.push('CPU Cooler');
  if (!rb.pcCase) missing.push('PC Case');
  return { ready: missing.length === 0, missing };
}

/** Does the motherboard permit overclocking at all? */
export function supportsOverclock(rb: ResolvedBuild): boolean {
  return rb.mobo?.supportsOC === true;
}
