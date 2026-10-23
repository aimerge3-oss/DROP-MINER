# DROP MINER ⚡🖥️

**A PC hardware case-opening, collecting, building, overclocking & FPS-benchmarking game.**
Open cases, pull rare components, assemble a dream rig, tune clocks and cooling — then prove it on simulated FPS benchmarks. Racing is replaced by benchmark competitions: average FPS, 1% lows, stability and efficiency are your lap times.

> **Disclaimer:** DROP MINER is a game simulation. All hardware names, brands, stats and benchmark numbers are fictional and do **not** measure or represent the performance of your real computer.

## ✨ Features
- **7 animated cases** with distinct themes, prices, level gates and weighted drop tables
- **63 original components** across 9 categories (GPU, CPU, RAM, motherboard, SSD, PSU, fan, cooler, case) from fictional brands (Nyx, Coreforge, Hexa, Voltcore, Cryoform, Aeroflux, Datavault, Ironbox…)
- **6 rarity tiers**: Common → Uncommon → Rare → Epic → Legendary → Mythic
- **Inventory** with sorting, filtering, inspection, duplicates and selling (60% payout)
- **PC Builder** with real compatibility rules (CPU sockets, board↔case form factor, cooler clearance, mixed-RAM prevention, fan slots, OC-capable boards), multiple saved builds, live power/cooling/performance estimates
- **Overclocking & cooling panel**: GPU/CPU/memory clocks, power limit, fan curve, undervolt — more speed means more heat; bad tuning throttles, destabilizes or crashes runs
- **5 deterministic benchmark scenarios** with progress animation, live FPS graph, results screen, history, personal records and credit rewards
- **Progression**: XP levels, 8-entry daily mission pool, 17 achievements, player statistics
- **Local leaderboard** vs clearly-labelled simulated demo players (architecture ready for a future online backend)
- **Persistent profile ID** in `FPS777-666MAX` style (unique-checked; *not* a wallet address)
- **Liquid Glass UI**: dark translucent panels, blur, neon-lime / icy-blue / gold accents, responsive layout, toasts, locked/empty/error states
- **Offline-friendly**: single-page app, localStorage saves, export/import save JSON

## 🧰 Requirements
- [Node.js](https://nodejs.org) 18+ (20 LTS recommended) and npm — Windows, macOS or Linux. No other tools, no paid APIs, no accounts.

## 🚀 Install & run
```bash
npm install        # install dependencies
npm run dev        # start dev server → http://localhost:5173
```

## 🎮 Controls & screens
Mouse/touch only. Bottom navigation: **Home · Shop · Build · Tune · Bench · More** (Missions, Leaderboard, Profile, Settings).
1. **Welcome** tutorial walks you through opening your first case.
2. Buy a case in the **Shop**, watch the reel, inspect the reward.
3. In **Builder**, create a build and install compatible parts (reasons shown when incompatible).
4. **Tune** clocks/fans — read the live prediction warnings.
5. Run a **Benchmark**, earn credits, chase records.

## 🛠 Development commands
| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run typecheck` | TypeScript strict check (`tsc --noEmit`) |
| `npm test` | Vitest unit tests (engine: rng, cases, compatibility, benchmark determinism) |
| `npm run test:watch` | Tests in watch mode |
| `npm run build` | Type-check + production bundle into `dist/` |
| `npm run preview` | Serve the built bundle locally |

## 🏗 Architecture overview
See **[ARCHITECTURE.md](ARCHITECTURE.md)**. Short version: `src/data` (catalogs) → `src/engine` (pure simulation: seeded RNG, thermals, compatibility, drops) → `src/state/gameStore.ts` (Zustand store + localStorage persistence) → `src/screens` + `src/ui` (React Liquid Glass interface). Screens never compute game math themselves.

## 📁 Project docs
[README](README.md) · [GDD](GDD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [PROGRESS](PROGRESS.md) · [TESTING](TESTING.md) · [ROADMAP](ROADMAP.md) · [CHANGELOG](CHANGELOG.md) · [UPDATE_LOG](UPDATE_LOG.md) · [PROMPTS](PROMPTS.md) · [UPDATE_PROMPT_TEMPLATE](UPDATE_PROMPT_TEMPLATE.md) · [CONTRIBUTING](CONTRIBUTING.md) · [SECURITY](SECURITY.md) · [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) · [CLAUDE.md](CLAUDE.md) (AI-agent rules)

## ❓ Troubleshooting
- **Blank page after `npm run build` + double-clicking dist/index.html** → use `npm run preview` (the app uses relative paths, but some browsers restrict module loading from `file://`).
- **Port busy** → `npm run dev -- --port 3000`.
- **Corrupted save** → Settings → *Reset game*, or clear `localStorage["dropminer.save.v1"]` in DevTools.
- **Tests fail after editing data files** → run `npm test`; catalog-integrity tests point at the offending item/case id.

## ⚠️ Current limitations
- Leaderboard is local-only (demo bots flagged as simulated).
- Save lives in browser localStorage (export/import provided for backup).
- No sound effects yet (toggle reserved in Settings).
