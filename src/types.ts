// ─── DROP MINER core type definitions ──────────────────────────────────────
// All game data models live here. Data files (src/data) conform to these types.

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export const RARITIES: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

export type ComponentType =
  | 'GPU' | 'CPU' | 'RAM' | 'Motherboard' | 'SSD' | 'PSU' | 'Fan' | 'Cooler' | 'Case';

/** Static definition of a catalogued hardware part. */
export interface ItemDef {
  id: string;                 // unique catalog id, e.g. "gpu_nyx_1080_ti"
  name: string;               // display name (original branding)
  type: ComponentType;
  rarity: Rarity;
  tier: number;               // 1..6 relative power tier
  value: number;              // in-game market value (credits)
  icon: string;               // emoji/glyph used on card
  accent: string;             // css color for card accent
  blurb: string;              // short flavor text
  // performance stats (simulated)
  perf: number;               // raw compute contribution (GPU/CPU), others use small values
  memBandwidth?: number;      // GPU memory / RAM bandwidth factor
  vramGB?: number;            // GPU only
  cores?: number;             // CPU only
  threads?: number;           // CPU only
  ramGB?: number;             // RAM stick capacity
  ramSpeed?: number;          // RAM MT/s
  storageGB?: number;         // SSD capacity
  storageSpeed?: number;      // SSD MB/s (affects load times / stability bonus)
  psuWatts?: number;          // PSU capacity
  coolingPower?: number;      // Cooler/Fan heat removal capacity (W of headroom)
  socket?: string;            // CPU/Motherboard compatibility key, e.g. "AM5x"
  chipset?: string;           // Motherboard generation label
  formFactor?: string;        // Motherboard/Case size, e.g. "ATX", "mATX"
  supportsOC?: boolean;       // motherboard allows overclocking
  caseForm?: string;          // Case form factor support
  maxCoolerMM?: number;       // Case cooler clearance
  fanSlots?: number;          // Case airflow slots
  noiseLevel?: number;        // Coolers/fans aesthetic-only
}

/** A concrete owned instance of an item (supports duplicates). */
export interface OwnedItem {
  uid: string;                // unique instance id
  defId: string;              // references ItemDef.id
  acquiredAt: number;         // timestamp
}

export interface CaseDef {
  id: string;
  name: string;
  theme: string;
  price: number;
  accent: string;
  icon: string;
  blurb: string;
  /** weighted drop table; weights are absolute numbers */
  drops: { defId: string; weight: number }[];
  requiresLevel?: number;     // progression gating for premium cases
}

/** The eight installable slots of a build (fans are optional airflow add-ons). */
export type SlotName = 'gpu' | 'cpu' | 'mobo' | 'ram' | 'ssd' | 'psu' | 'cooler' | 'case';
export const SLOT_NAMES: SlotName[] = ['gpu', 'cpu', 'mobo', 'ram', 'ssd', 'psu', 'cooler', 'case'];

export interface BuildSlots {
  gpu: string | null;   // OwnedItem.uid
  cpu: string | null;
  mobo: string | null;
  ram: string[];        // up to 4 sticks
  ssd: string | null;
  psu: string | null;
  cooler: string | null;
  caseUid: string | null;
  fans: string[];       // up to 6 fans
}

export interface Build {
  id: string;
  name: string;
  slots: BuildSlots;
  tune: TuneSettings;
  createdAt: number;
}

export interface TuneSettings {
  cpuOC: number;        // % offset from stock, -10..+25
  gpuOC: number;        // % offset
  memOC: number;        // % RAM speed offset
  powerLimit: number;   // % power limit 60..130
  fanAggression: number; // 0..100 fan curve aggressiveness
  undervolt: number;    // 0..30 (mV scaled abstraction) reduces heat
}

export const DEFAULT_TUNE: TuneSettings = {
  cpuOC: 0, gpuOC: 0, memOC: 0, powerLimit: 100, fanAggression: 50, undervolt: 0,
};

export interface BenchmarkDef {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  accent: string;
  durationMs: number;      // real-time run length in the UI
  gpuWeight: number;       // 0..1 balance between GPU and CPU demand
  difficulty: number;      // 1..5 — heavier loads stress cooling & stability
  rewardBase: number;      // credits at score 1000
  minVRAM: number;         // GB required to even attempt
  unlockScore: number;     // player best overall score needed to unlock
}

export interface BenchmarkRun {
  id: string;
  benchId: string;
  buildId: string;
  buildName: string;
  score: number;
  avgFps: number;
  low1Fps: number;
  maxTempC: number;
  powerW: number;
  stable: boolean;
  throttled: boolean;
  failed: boolean;
  creditsEarned: number;
  timestamp: number;
  hardwareSummary: string;
}

export interface Mission {
  id: string;
  name: string;
  desc: string;
  goal: number;
  reward: number;
  kind: MissionKind;
  daily: boolean;
}

export type MissionKind =
  | 'open_cases' | 'run_benchmarks' | 'sell_items' | 'earn_credits'
  | 'reach_avg_fps' | 'install_component' | 'tune_hardware' | 'stable_run';

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  check: (s: PlayerStats) => boolean;
  reward: number;
}

export interface PlayerStats {
  casesOpened: number;
  benchmarksRun: number;
  stableRuns: number;
  itemsSold: number;
  totalEarned: number;
  totalSpent: number;
  bestScore: number;
  bestAvgFps: number;
  legendaryPlus: number;
  mythicsFound: number;
  buildsSaved: number;
  tunesAdjusted: number;
  level: number;
}

export interface SettingsState {
  soundOn: boolean;
  reducedMotion: boolean;
  fastBenchmark: boolean;
}

export interface GameState {
  version: number;
  playerId: string;
  playerName: string;
  createdAt: number;
  credits: number;
  xp: number;
  inventory: OwnedItem[];
  builds: Build[];
  activeBuildId: string | null;
  runs: BenchmarkRun[];
  stats: PlayerStats;
  missions: MissionProgress[];
  missionsDate: string;          // YYYY-MM-DD of current daily set
  achievementsDone: string[];
  tutorialSeen: boolean;
  settings: SettingsState;
}

export interface MissionProgress {
  id: string;                    // Mission id
  progress: number;
  claimed: boolean;
}

export interface LeaderEntry {
  rank: number;
  name: string;
  playerId: string;
  score: number;
  avgFps: number;
  low1Fps: number;
  hardware: string;
  simulated: boolean;            // true for demo bots
}

export interface CompatibilityResult {
  ok: boolean;
  reason?: string;
}
