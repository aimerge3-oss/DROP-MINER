# DROP MINER — Game Design Document (v1.0)

## 1. High concept
A premium idle/active collecting game about PC building. Players open themed hardware cases, collect components across six rarity tiers, assemble compatible rigs, tune overclocks against a thermal simulation, and compete in **FPS benchmark challenges** (the racing analogue: your lap time is average FPS + 1% lows + stability). Everything is fictional and simulated; no real hardware is measured.

## 2. Core gameplay loop
```
Earn credits → Buy case → Animated opening → New component
   ↑                                              ↓
Benchmark rewards ← Build & tune rig ← Inventory / sell duplicates
```
1. **Open** — spend credits on one of 7 cases; watch the reel; get a rarity-coloured reward with stats and value.
2. **Manage** — inspect/sell in inventory; duplicates stack as separate copies.
3. **Build** — fill 8 slots in a build under compatibility rules; save multiple builds and switch active one.
4. **Tune** — sliders for CPU/GPU/MEM OC, power limit, fan aggression, undervolt. Live prediction shows fps/heat/stability risk.
5. **Benchmark** — run one of 5 scenarios; deterministic result from seeded sim; earn credits scaled to score + improvement over previous best; unlock harder benches by score.
6. **Progress** — XP & levels gate premium cases; daily missions rotate; achievements pay out; leaderboard ranks you vs simulated bots.

## 3. Hardware categories
| Category | Key stats | Role in sim |
|---|---|---|
| GPU | perf, vramGB | dominant weight in most benches; VRAM gates heavy scenes |
| CPU | perf, cores/threads | bottleneck for CPU-weighted benches |
| Motherboard | socket, formFactor, supportsOC | compatibility hub; OC lock on budget boards |
| RAM | ramGB, ramSpeed, count | bandwidth bonus; mixed kits destabilize |
| SSD | storageGB, storageSpeed | load-time/stability flavor bonus |
| PSU | psuWatts | caps total power; overload = throttle or crash |
| Cooler | coolingPower (W headroom) | heat removal; weak cooler ⇒ throttling |
| Fan | coolingPower, noiseLevel | cheap additive airflow, capped by case slots |
| Case | caseForm, maxCoolerMM, fanSlots | size/clearance/airflow envelope |

## 4. Rarity tiers
Common (grey-blue) · Uncommon (green) · Rare (ice blue) · Epic (violet) · Legendary (gold) · Mythic (pink). Rarity drives drop weights, market value, card accent colour, achievement counters (`legendaryPlus`, `mythicsFound`).

## 5. Cases (implemented)
Scrap Bin Crate 60cr · Gamer Starter 180 · Wildcard Drop Box 300 (random pool per open) · Frostbyte Vault 420 · Pro Workstation Pod 900 (lvl 3+) · Midnight Auction Chest 1600 (lvl 5+) · Singularity Capsule 3500 (lvl 8+, Mythic chance). Each has its own theme/accent/drop table; prices & weights balance so ~3–5 early opens fund the next purchase cycle via benching.

## 6. Benchmark scenarios (implemented)
Desktop Drift (easy, unlocked) · Neon Rush (gpu-heavy) · Particle Storm (CPU) · Ray Cavern (VRAM-gated, unlocks at 1200 score) · Void Engine Trial (endgame, unlocks at 4000). Result model: combined throughput × VRAM factor × thermal multiplier × PSU multiplier × stability jitter → avg FPS (diminishing-returns curve), 1% low from frame variance, score = f(avgFps, low1, stability). Failed PSU-overload runs score 0 with pity payout.

## 7. Overclocking & thermals
Heat load = system power × difficulty factor; cooling capacity = cooler + fans × fan curve − case penalty. Sustained ≥88 °C throttles clocks; stability drops with OC beyond cooling margin; extreme memOC destabilizes. Undervolt trades small perf for big heat reduction. Safe defaults provided; reset-to-default button.

## 8. Economy
Start: 500 cr + starter kit. Income: benchmark payouts (`rewardBase × score/1000` + improvement bonus), mission rewards (30–120 cr), achievements (50–500 cr), selling duplicates (60%). Sinks: cases, nothing else — tuning is free. No real money, no crypto. Balance target: first upgraded rig within ~10–15 minutes of play.

## 9. Progression
XP from openings/benches/missions. Level curve: level n needs 120·n XP (cap 50). Levels gate premium cases. Stats screen tracks totals; personal records per benchmark.

## 10. Player identity & leaderboard
Persistent ID `FPS######-###AAA` (uniqueness-checked against local saves; copyable; explicitly *not* a wallet). Local leaderboard merges player's best run with 10 flagged-simulated demo entries; data shape mirrors a future online API (score, avgFps, low1Fps, hardware summary).

## 11. UI/UX direction
"Apple iOS Liquid Glass": dark backdrop, layered translucent blur panels, pill buttons, rarity glow accents (neon lime #a3e635, ice #38bdf8, gold #fbbf24), bottom tab navigation, hash routing, toasts for every action, explicit empty/locked/error/loading states, responsive down to phone width.

## 12. Future expansion
Modding marketplace, seasonal case rotations, weekly challenge modifiers ("no-fan run"), GPU-bios-style risk/reward tuning, ghost-leaderboard import/export, cloud sync behind an optional server adapter (interface already isolated).
