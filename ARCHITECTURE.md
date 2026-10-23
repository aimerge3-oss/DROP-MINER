# DROP MINER — Architecture

Stack: **Vite + React 18 + TypeScript (strict) + Zustand**. Chosen because it yields a browser-playable Windows-friendly game with zero runtime services, fast iteration, and full static typing.

## Layer diagram
```
┌─────────────────────────────────────────────────────────┐
│ src/screens/*  (15 screens, hash-routed via App.tsx)    │  UI intent only
├─────────────────────────────────────────────────────────┤
│ src/ui/*       glass.css design system + shared widgets │  Presentation
├─────────────────────────────────────────────────────────┤
│ src/state/gameStore.ts  Zustand store, actions,         │  State & persistence
│                        toasts, save/load (localStorage) │
├─────────────────────────────────────────────────────────┤
│ src/engine/*   PURE functions — no React, no storage    │  Simulation
│   rng.ts        mulberry32 + FNV hash + weightedPick    │
│   caseOpening.ts rollCase/buildReel/sellPrice           │
│   compatibility.ts resolve/check/readiness/OC support   │
│   benchmark.ts  estimatePower/coolingCapacity/computeRun│
│   playerId.ts   FPS######-###AAA generator              │
├─────────────────────────────────────────────────────────┤
│ src/data/*     Catalogs: items(63) cases(7) benches(5)  │  Static content
│                missions(8+17) leaderboard(10 bots)      │
└─────────────────────────────────────────────────────────┘
src/types.ts — shared domain types (ItemDef, Build, TuneSettings, GameState…)
```
Dependency rule: screens→state→engine→data/types. Engine never imports React or the store; it takes plain inputs and returns plain outputs, which makes it unit-testable (`src/engine/engine.test.ts`).

## Data flow (benchmark example)
1. Screen calls `runBenchmark(build, bench, uidMap, prevBest)` (engine).
2. Engine resolves uids→defs, computes power/thermals/stability with seed `${bench.id}|${build.id}` → **deterministic**: same rig+tuning ⇒ same numbers.
3. Store's `recordRun` appends the run, pays credits, bumps stats, advances missions/achievements, adds XP, persists JSON to `localStorage["dropminer.save.v1"]`.

## Persistence
Single JSON blob (`GameState`) versioned by `SAVE_VERSION`; loader merges missing fields against `freshState()` defaults (forward-compatible). Settings screen offers export (download .json) / import (file picker, validated) / reset.

## How to extend
- **New component**: add one `ItemDef` object in `src/data/items.ts` (id prefix = type). Add it to any case's `drops` array. Tests validate references.
- **New case**: append `CaseDef` in `src/data/cases.ts` with `{defId, weight}` drops (+optional `requiresLevel`). Shop renders automatically.
- **New benchmark**: append `BenchmarkDef` in `src/data/benchmarks.ts` (weights, minVRAM, difficulty, rewardBase, unlockScore). Selection screen and engine pick it up with no other changes.
- **Online leaderboard later**: `LeaderEntry` shape in `src/data/leaderboard.ts` is transport-ready; swap the bot merge in `screens/Leaderboard.tsx` for an API fetch behind a flag.

## Routing
Hash router in `App.tsx` (`#/shop`, `#/inventory`, …) keeps deep links working when served from `dist/` statically.
