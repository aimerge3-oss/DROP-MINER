import type { Mission, Achievement } from '../types';

// ─── Daily mission pool & achievements ──────────────────────────────────────
export const DAILY_POOL: Mission[] = [
  { id: 'm_open3', name: 'Crack Three', desc: 'Open 3 cases today.', goal: 3, reward: 90, kind: 'open_cases', daily: true },
  { id: 'm_bench4', name: 'Stress Test Shift', desc: 'Run 4 benchmarks today.', goal: 4, reward: 100, kind: 'run_benchmarks', daily: true },
  { id: 'm_stable2', name: 'Rock Solid', desc: 'Complete 2 stable benchmark runs.', goal: 2, reward: 120, kind: 'stable_run', daily: true },
  { id: 'm_sell5', name: 'Garage Sale', desc: 'Sell 5 unwanted parts.', goal: 5, reward: 70, kind: 'sell_items', daily: true },
  { id: 'm_earn500', name: 'Cash Flow', desc: 'Earn 500 credits today.', goal: 500, reward: 110, kind: 'earn_credits', daily: true },
  { id: 'm_fps120', name: 'Triple-A Frames', desc: 'Reach 120 average FPS in any benchmark.', goal: 120, reward: 150, kind: 'reach_avg_fps', daily: true },
  { id: 'm_tune1', name: 'Knob Turner', desc: 'Adjust tuning settings once.', goal: 1, reward: 60, kind: 'tune_hardware', daily: true },
  { id: 'm_install3', name: 'Screwdriver Time', desc: 'Install 3 components into a build.', goal: 3, reward: 80, kind: 'install_component', daily: true },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a_first_case', name: 'First Unboxing', desc: 'Open your very first case.', icon: '📦', reward: 50, check: (s) => s.casesOpened >= 1 },
  { id: 'a_ten_cases', name: 'Case Addict', desc: 'Open 10 cases.', icon: '🗃️', reward: 150, check: (s) => s.casesOpened >= 10 },
  { id: 'a_fifty_cases', name: 'Warehouse Owner', desc: 'Open 50 cases.', icon: '🏬', reward: 500, check: (s) => s.casesOpened >= 50 },
  { id: 'a_first_bench', name: 'Fresh Frames', desc: 'Run your first benchmark.', icon: '▶️', reward: 60, check: (s) => s.benchmarksRun >= 1 },
  { id: 'a_twenty_bench', name: 'Lab Technician', desc: 'Run 20 benchmarks.', icon: '🧪', reward: 250, check: (s) => s.benchmarksRun >= 20 },
  { id: 'a_stable10', name: 'Certified Stable', desc: 'Finish 10 stable runs.', icon: '✅', reward: 300, check: (s) => s.stableRuns >= 10 },
  { id: 'a_score1k', name: 'Kilobench', desc: 'Score 1,000 on any benchmark.', icon: '🔢', reward: 120, check: (s) => s.bestScore >= 1000 },
  { id: 'a_score5k', name: 'Frame Baron', desc: 'Score 5,000 on any benchmark.', icon: '🎖️', reward: 400, check: (s) => s.bestScore >= 5000 },
  { id: 'a_score10k', name: 'Benchmark Royalty', desc: 'Score 10,000 on any benchmark.', icon: '👑', reward: 900, check: (s) => s.bestScore >= 10000 },
  { id: 'a_fps144', name: 'Smooth Operator', desc: 'Average 144+ FPS in a run.', icon: '🧈', reward: 200, check: (s) => s.bestAvgFps >= 144 },
  { id: 'a_fps240', name: 'Hypersonic', desc: 'Average 240+ FPS in a run.', icon: '🚀', reward: 450, check: (s) => s.bestAvgFps >= 240 },
  { id: 'a_legendary', name: 'Golden Silicon', desc: 'Own a Legendary or better part.', icon: '💠', reward: 250, check: (s) => s.legendaryPlus >= 1 },
  { id: 'a_mythic', name: 'Myth Hunter', desc: 'Find a Mythic component.', icon: '🌌', reward: 800, check: (s) => s.mythicsFound >= 1 },
  { id: 'a_saver', name: 'Declutterer', desc: 'Sell 15 parts.', icon: '💸', reward: 130, check: (s) => s.itemsSold >= 15 },
  { id: 'a_builder', name: 'Master Builder', desc: 'Save 3 builds.', icon: '🛠️', reward: 150, check: (s) => s.buildsSaved >= 3 },
  { id: 'a_tuner', name: 'Voltage Jockey', desc: 'Adjust tuning 10 times.', icon: '🎚️', reward: 160, check: (s) => s.tunesAdjusted >= 10 },
  { id: 'a_level10', name: 'Seasoned', desc: 'Reach player level 10.', icon: '📈', reward: 300, check: (s) => s.level >= 10 },
];
