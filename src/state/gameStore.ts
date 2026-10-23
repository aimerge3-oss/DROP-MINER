import { create } from 'zustand';
import type {
  GameState, OwnedItem, Build, BenchmarkRun, TuneSettings, MissionProgress, SettingsState,
} from '../types';
import { DEFAULT_TUNE } from '../types';
import { getItem } from '../data/items';
import { CASES } from '../data/cases';
import { DAILY_POOL, ACHIEVEMENTS } from '../data/missions';
import { openCase, sellPrice, makeOwned } from '../engine/caseOpening';
import { generatePlayerId } from '../engine/playerId';
import { uid } from '../engine/rng';

// ─── Persistence ────────────────────────────────────────────────────────────
const SAVE_KEY = 'dropminer.save.v1';
export const SAVE_VERSION = 1;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function freshState(): GameState {
  const idSet = new Set<string>();
  const startRam = makeOwned('ram_dw8_2666');
  return {
    version: SAVE_VERSION,
    playerId: generatePlayerId(idSet),
    playerName: 'Rookie Builder',
    createdAt: Date.now(),
    credits: 500,
    xp: 0,
    inventory: [
      makeOwned('gpu_nyx_g160'),
      makeOwned('cpu_cf_q240'),
      makeOwned('mobo_hex_w660'),
      startRam,
      makeOwned('ssd_dv256_sata'),
      makeOwned('psu_vc400'),
      makeOwned('cool_cf_stock'),
      makeOwned('case_ib_mini'),
    ],
    builds: [],
    activeBuildId: null,
    runs: [],
    stats: {
      casesOpened: 0, benchmarksRun: 0, stableRuns: 0, itemsSold: 0,
      totalEarned: 0, totalSpent: 0, bestScore: 0, bestAvgFps: 0,
      legendaryPlus: 0, mythicsFound: 0, buildsSaved: 0, tunesAdjusted: 0, level: 1,
    },
    missions: pickDailyMissions(todayKey()),
    missionsDate: todayKey(),
    achievementsDone: [],
    tutorialSeen: false,
    settings: { soundOn: true, reducedMotion: false, fastBenchmark: false },
  };
}

function pickDailyMissions(dateKey: string): MissionProgress[] {
  // deterministic 3-per-day selection from pool based on date hash
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) | 0;
  const rng = () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
  const idx = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => rng() - 0.5).slice(0, 3);
  return idx.map((i) => ({ id: DAILY_POOL[i].id, progress: 0, claimed: false }));
}

function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed || typeof parsed !== 'object' || !parsed.playerId || !Array.isArray(parsed.inventory)) return null;
    // daily mission rollover
    if (parsed.missionsDate !== todayKey()) {
      parsed.missions = pickDailyMissions(todayKey());
      parsed.missionsDate = todayKey();
    }
    // ensure new fields exist after upgrades
    parsed.settings = { ...freshState().settings, ...parsed.settings };
    parsed.stats = { ...freshState().stats, ...parsed.stats };
    return parsed;
  } catch {
    return null;
  }
}

function persist(s: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch {
    /* storage full or unavailable — game continues in-memory */
  }
}

// ─── Toast notifications ────────────────────────────────────────────────────
export interface Toast { id: number; text: string; kind: 'success' | 'error' | 'info' | 'gold'; }

// ─── Store ──────────────────────────────────────────────────────────────────
export interface GameStore extends GameState {
  toasts: Toast[];
  notify: (text: string, kind?: Toast['kind']) => void;
  dismissToast: (id: number) => void;

  setTutorialSeen: () => void;
  setName: (name: string) => void;
  updateSettings: (patch: Partial<SettingsState>) => void;

  buyCase: (caseId: string) => { ok: boolean; item?: OwnedItem; reason?: string };
  sellItem: (itemUid: string) => boolean;
  sellMany: (uids: string[]) => number;

  createBuild: (name: string) => string;             // returns build id
  deleteBuild: (buildId: string) => void;
  setActiveBuild: (buildId: string) => void;
  renameBuild: (buildId: string, name: string) => void;
  installItem: (buildId: string, slot: 'gpu' | 'cpu' | 'mobo' | 'ram' | 'ssd' | 'psu' | 'cooler' | 'case' | 'fan', itemUid: string) => { ok: boolean; reason?: string };
  removeSlot: (buildId: string, slot: string, ramUid?: string) => void;

  setTune: (buildId: string, patch: Partial<TuneSettings>) => void;
  resetTune: (buildId: string) => void;

  recordRun: (run: BenchmarkRun) => void;
  claimMission: (missionId: string) => void;
  claimAchievement: (achId: string) => void;

  addXp: (amount: number) => void;
  resetGame: () => void;
}

export interface LevelInfo { level: number; into: number; need: number }
/** Deterministic incremental XP curve: level n requires 120*n XP to pass. */
export function levelProgress(xp: number): LevelInfo {
  let total = xp, lvl = 1, req = 120;
  while (total >= req && lvl < 50) { total -= req; lvl++; req = lvl * 120; }
  return { level: lvl, into: total, need: req };
}

let toastSeq = 1;

export const useGame = create<GameStore>((set, get) => {
  const loaded = loadSave() ?? freshState();

  const mutate = (fn: (s: GameState) => Partial<GameState>) => {
    set((cur) => {
      const patch = fn(cur as GameState);
      const next = { ...cur, ...patch } as GameStore;
      persist(next as GameState);
      return next;
    });
  };


  return {
    ...loaded,
    toasts: [],

    notify(text, kind = 'info') {
      const t: Toast = { id: toastSeq++, text, kind };
      set((s) => ({ toasts: [...s.toasts.slice(-3), t] }));
      setTimeout(() => get().dismissToast(t.id), 3200);
    },
    dismissToast(id) {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    },

    setTutorialSeen: () => mutate(() => ({ tutorialSeen: true })),
    setName(name) {
      const clean = name.trim().slice(0, 20);
      if (!clean) { get().notify('Name cannot be empty.', 'error'); return; }
      mutate(() => ({ playerName: clean }));
      get().notify('Profile name updated.', 'success');
    },
    updateSettings(patch) { mutate((s) => ({ settings: { ...s.settings, ...patch } })); },

    buyCase(caseId) {
      const caseDef = CASES.find((c) => c.id === caseId);
      if (!caseDef) return { ok: false, reason: 'Unknown case.' };
      const s = get();
      if ((caseDef.requiresLevel ?? 1) > s.stats.level)
        return { ok: false, reason: `Requires player level ${caseDef.requiresLevel}.` };
      if (s.credits < caseDef.price)
        return { ok: false, reason: `Not enough credits (need ${caseDef.price}, have ${s.credits}).` };
      const res = openCase(caseDef);
      mutate((cur) => {
        const stats = { ...cur.stats, casesOpened: cur.stats.casesOpened + 1, totalSpent: cur.stats.totalSpent + caseDef.price };
        if (res.def.rarity === 'Legendary' || res.def.rarity === 'Mythic') stats.legendaryPlus += 1;
        if (res.def.rarity === 'Mythic') stats.mythicsFound += 1;
        return {
          credits: cur.credits - caseDef.price,
          inventory: [...cur.inventory, res.item],
          stats,
        };
      });
      get().addXp(4);
      return { ok: true, item: res.item };
    },

    sellItem(itemUid) {
      const s = get();
      const owned = s.inventory.find((i) => i.uid === itemUid);
      if (!owned) return false;
      if (isEquipped(s, itemUid)) { get().notify('Unequip it from your build first.', 'error'); return false; }
      const price = sellPrice(getItem(owned.defId));
      mutate((cur) => ({
        credits: cur.credits + price,
        inventory: cur.inventory.filter((i) => i.uid !== itemUid),
        stats: { ...cur.stats, itemsSold: cur.stats.itemsSold + 1, totalEarned: cur.stats.totalEarned + price },
      }));
      progressMission('sell_items', 1);
      progressMission('earn_credits', price);
      get().notify(`Sold for ${price} cr`, 'success');
      return true;
    },

    sellMany(uids) {
      let total = 0;
      const s = get();
      const equipped = new Set<string>();
      s.builds.forEach((b) => collectEquipped(b, equipped));
      const sellable = s.inventory.filter((i) => uids.includes(i.uid) && !equipped.has(i.uid));
      sellable.forEach((i) => { total += sellPrice(getItem(i.defId)); });
      if (sellable.length === 0) return 0;
      mutate((cur) => ({
        credits: cur.credits + total,
        inventory: cur.inventory.filter((i) => !sellable.some((x) => x.uid === i.uid)),
        stats: { ...cur.stats, itemsSold: cur.stats.itemsSold + sellable.length, totalEarned: cur.stats.totalEarned + total },
      }));
      progressMission('sell_items', sellable.length);
      progressMission('earn_credits', total);
      get().notify(`Sold ${sellable.length} part(s) for ${total} cr`, 'success');
      return total;
    },

    createBuild(name) {
      const id = uid('build');
      const build: Build = {
        id, name: name.trim().slice(0, 24) || 'Untitled Rig',
        slots: { gpu: null, cpu: null, mobo: null, ram: [], ssd: null, psu: null, cooler: null, caseUid: null, fans: [] },
        tune: { ...DEFAULT_TUNE }, createdAt: Date.now(),
      };
      mutate((cur) => ({
        builds: [...cur.builds, build],
        activeBuildId: cur.activeBuildId ?? id,
        stats: { ...cur.stats, buildsSaved: cur.stats.buildsSaved + 1 },
      }));
      progressMission('install_component', 0); // counts build creation softly
      get().notify('Build created.', 'success');
      return id;
    },

    deleteBuild(buildId) {
      mutate((cur) => {
        const builds = cur.builds.filter((b) => b.id !== buildId);
        const activeBuildId = cur.activeBuildId === buildId ? (builds[0]?.id ?? null) : cur.activeBuildId;
        return { builds, activeBuildId };
      });
    },

    setActiveBuild(buildId) {
      mutate((cur) => (cur.builds.some((b) => b.id === buildId) ? { activeBuildId: buildId } : {}));
    },

    renameBuild(buildId, name) {
      const clean = name.trim().slice(0, 24);
      if (!clean) return;
      mutate((cur) => ({ builds: cur.builds.map((b) => (b.id === buildId ? { ...b, name: clean } : b)) }));
    },

    installItem(buildId, slot, itemUid) {
      const s = get();
      const build = s.builds.find((b) => b.id === buildId);
      const owned = s.inventory.find((i) => i.uid === itemUid);
      if (!build || !owned) return { ok: false, reason: 'Build or item not found.' };
      const def = getItem(owned.defId);
      const expectedType: Record<string, string> = {
        gpu: 'GPU', cpu: 'CPU', mobo: 'Motherboard', ram: 'RAM', ssd: 'SSD',
        psu: 'PSU', cooler: 'Cooler', case: 'Case', fan: 'Fan',
      };
      if (def.type !== expectedType[slot]) return { ok: false, reason: `${def.name} is a ${def.type}, not a ${slot.toUpperCase()}.` };

      // lazy import avoided: direct import at top
      const { resolveBuild, checkCompatibility } = compatRef();
      const uidToDefId = new Map(s.inventory.map((i) => [i.uid, i.defId]));
      const rb = resolveBuild(build, uidToDefId);
      const res = checkCompatibility(def, slot as any, rb);
      if (!res.ok) return { ok: false, reason: res.reason };

      mutate((cur) => ({
        builds: cur.builds.map((b) => {
          if (b.id !== buildId) return b;
          const slots = { ...b.slots };
          switch (slot) {
            case 'gpu': slots.gpu = itemUid; break;
            case 'cpu': slots.cpu = itemUid; break;
            case 'mobo': slots.mobo = itemUid; break;
            case 'ssd': slots.ssd = itemUid; break;
            case 'psu': slots.psu = itemUid; break;
            case 'cooler': slots.cooler = itemUid; break;
            case 'case': slots.caseUid = itemUid; break;
            case 'ram': slots.ram = [...slots.ram, itemUid].slice(0, 4); break;
            case 'fan': slots.fans = [...slots.fans, itemUid].slice(0, 6); break;
          }
          return { ...b, slots };
        }),
      }));
      progressMission('install_component', 1);
      get().notify(`Installed ${def.name}`, 'success');
      return { ok: true };
    },

    removeSlot(buildId, slot, ramUid) {
      mutate((cur) => ({
        builds: cur.builds.map((b) => {
          if (b.id !== buildId) return b;
          const slots = { ...b.slots };
          if (slot === 'ram' && ramUid) slots.ram = slots.ram.filter((u) => u !== ramUid);
          else if (slot === 'fans') slots.fans = [];
          else if (slot === 'case') slots.caseUid = null;
          else (slots as any)[slot] = null;
          return { ...b, slots };
        }),
      }));
    },

    setTune(buildId, patch) {
      mutate((cur) => ({
        builds: cur.builds.map((b) =>
          b.id === buildId ? { ...b, tune: clampTune({ ...b.tune, ...patch }) } : b),
        stats: { ...cur.stats, tunesAdjusted: cur.stats.tunesAdjusted + 1 },
      }));
      progressMission('tune_hardware', 1);
    },

    resetTune(buildId) {
      mutate((cur) => ({
        builds: cur.builds.map((b) => (b.id === buildId ? { ...b, tune: { ...DEFAULT_TUNE } } : b)),
      }));
      get().notify('Tuning reset to safe defaults.', 'info');
    },

    recordRun(run) {
      mutate((cur) => {
        const stats = { ...cur.stats };
        stats.benchmarksRun += 1;
        if (run.stable) stats.stableRuns += 1;
        stats.bestScore = Math.max(stats.bestScore, run.score);
        stats.bestAvgFps = Math.max(stats.bestAvgFps, run.avgFps);
        return {
          runs: [run, ...cur.runs].slice(0, 200),
          credits: cur.credits + run.creditsEarned,
          stats,
        };
      });
      progressMission('run_benchmarks', 1);
      if (run.stable) progressMission('stable_run', 1);
      progressMission('earn_credits', run.creditsEarned);
      if (run.avgFps >= 1) progressMissionMax('reach_avg_fps', run.avgFps);
      get().addXp(Math.round(6 + run.score / 150));
    },

    claimMission(missionId) {
      const s = get();
      const prog = s.missions.find((m) => m.id === missionId);
      const def = DAILY_POOL.find((m) => m.id === missionId);
      if (!prog || !def || prog.claimed || prog.progress < def.goal) return;
      mutate((cur) => ({
        credits: cur.credits + def.reward,
        missions: cur.missions.map((m) => (m.id === missionId ? { ...m, claimed: true } : m)),
        stats: { ...cur.stats, totalEarned: cur.stats.totalEarned + def.reward },
      }));
      get().notify(`Mission complete: +${def.reward} cr`, 'gold');
    },

    claimAchievement(achId) {
      const s = get();
      const ach = ACHIEVEMENTS.find((a) => a.id === achId);
      if (!ach || s.achievementsDone.includes(achId) || !ach.check(s.stats)) return;
      mutate((cur) => ({
        credits: cur.credits + ach.reward,
        achievementsDone: [...cur.achievementsDone, achId],
        stats: { ...cur.stats, totalEarned: cur.stats.totalEarned + ach.reward },
      }));
      get().notify(`Achievement unlocked: ${ach.name} (+${ach.reward} cr)`, 'gold');
    },

    addXp(amount) {
      mutate((cur) => {
        const xp = Math.max(0, cur.xp + amount);
        const { level } = levelProgress(xp);
        return { xp, stats: { ...cur.stats, level } };
      });
    },

    resetGame() {
      const fresh = freshState();
      set(() => ({ ...(fresh as GameStore), toasts: [] }));
      persist(fresh);
      get().notify('New save started.', 'info');
    },
  };

  // helpers captured in closure --------------------------------------------
  function progressMission(kind: string, amount: number) {
    if (amount <= 0) return;
    mutate((cur) => ({
      missions: cur.missions.map((m) => {
        const def = DAILY_POOL.find((d) => d.id === m.id);
        if (!def || def.kind !== kind || m.claimed) return m;
        return { ...m, progress: Math.min(def.goal, m.progress + amount) };
      }),
    }));
    // completion notice
    const after = get();
    after.missions.forEach((m) => {
      const def = DAILY_POOL.find((d) => d.id === m.id);
      if (def && !m.claimed && m.progress >= def.goal) {
        // notify once when crossing goal
      }
      void def;
    });
  }

  function progressMissionMax(kind: string, value: number) {
    const s = get();
    mutate((cur) => ({
      missions: cur.missions.map((m) => {
        const def = DAILY_POOL.find((d) => d.id === m.id);
        if (!def || def.kind !== kind || m.claimed) return m;
        return { ...m, progress: Math.min(def.goal, Math.max(m.progress, value)) };
      }),
    }));
    void s;
  }
});

// ─── helpers ────────────────────────────────────────────────────────────────
import * as compatModule from '../engine/compatibility';
function compatRef() {
  return compatModule as typeof compatModule;
}

function clampTune(t: TuneSettings): TuneSettings {
  const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(v)));
  return {
    cpuOC: cl(t.cpuOC, -10, 25), gpuOC: cl(t.gpuOC, -10, 25), memOC: cl(t.memOC, 0, 30),
    powerLimit: cl(t.powerLimit, 60, 130), fanAggression: cl(t.fanAggression, 0, 100), undervolt: cl(t.undervolt, 0, 30),
  };
}

function collectEquipped(b: Build, out: Set<string>): void {
  const s = b.slots;
  [s.gpu, s.cpu, s.mobo, s.ssd, s.psu, s.cooler, s.caseUid].forEach((u) => u && out.add(u));
  s.ram.forEach((u) => out.add(u));
  s.fans.forEach((u) => out.add(u));
}

export function isEquipped(state: GameState, itemUid: string): boolean {
  for (const b of state.builds) {
    const set = new Set<string>();
    collectEquipped(b, set);
    if (set.has(itemUid)) return true;
  }
  return false;
}

/** Map of every owned uid → defId (for engine resolution). */
export function uidMapOf(inventory: OwnedItem[]): Map<string, string> {
  return new Map(inventory.map((i) => [i.uid, i.defId]));
}

