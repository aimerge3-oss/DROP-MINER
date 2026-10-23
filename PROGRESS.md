# DROP MINER — Implementation Progress

Status legend: ✅ done & verified · 🟡 implemented, needs playtesting · ⏳ planned

## Milestone 1 — Foundation ✅
- ✅ Project scaffold at repo root (/workspace): Vite + React + TS strict, package.json scripts, tsconfig, vite.config
- ✅ Domain types (`src/types.ts`)
- ✅ Deterministic RNG engine (`src/engine/rng.ts`)
- ✅ Player-ID generator FPS######-###AAA with uniqueness check (`src/engine/playerId.ts`)

## Milestone 2 — Content data ✅
- ✅ 63 components across 9 categories, 6 rarities (`src/data/items.ts`)
- ✅ 7 cases with weighted drop tables & level gates (`src/data/cases.ts`)
- ✅ 5 benchmark scenarios (`src/data/benchmarks.ts`)
- ✅ Daily mission pool (8) + achievements (17) (`src/data/missions.ts`)
- ✅ 10 simulated leaderboard demo players (`src/data/leaderboard.ts`)

## Milestone 3 — Simulation engine ✅
- ✅ Case rolling, reel builder, sell pricing (`caseOpening.ts`)
- ✅ Compatibility: socket, form factor, cooler clearance, mixed RAM, fan slots, OC support (`compatibility.ts`)
- ✅ Power/thermal/stability model + throttling + PSU crash + VRAM gate + diminishing returns (`benchmark.ts`)
- ✅ Deterministic runs & credit rewards incl. improvement bonus

## Milestone 4 — State & persistence ✅
- ✅ Zustand store with all actions (buy/open/sell/build/install/tune/bench/claim/settings/reset)
- ✅ localStorage save/load w/ version merge, daily-mission rollover
- ✅ Credit-spend validation, XP curve, toasts

## Milestone 5 — UI / screens 🟡
- ✅ Liquid Glass design system (`glass.css`, `components.tsx`), SVG logo/favicon
- ✅ Hash router + bottom nav (responsive)
- ✅ All 15 required screens implemented (Welcome, Dashboard, Shop, OpenCase, Inventory, Builder, Build-details-in-builder, Tuning, Bench select/run/results/history, Leaderboard, Missions/Achievements, Profile/Stats, Settings w/ export-import-reset)
- 🟡 Full manual playthrough QA on Windows browser (checklist in TESTING.md)

## Milestone 6 — Verification ✅ (executed in sandbox)
- ✅ `tsc --noEmit` → exit 0
- ✅ `vitest run` → 29/29 passing
- ✅ `vite build` → dist bundle produced
- ⏳ ESLint config (script exists; eslint not installed in sandbox — see TESTING limitations)

## Milestone 7 — Documentation ✅
- ✅ README, GDD, ARCHITECTURE, CLAUDE, TESTING, ROADMAP, CHANGELOG, UPDATE_LOG, PROMPTS, UPDATE_PROMPT_TEMPLATE, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, LICENSE, .gitignore

## Planned (see ROADMAP.md)
- ⏳ Sound effects, more cases, seasonal events, online leaderboard adapter, PWA/offline install
