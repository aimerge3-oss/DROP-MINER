# Update Log — chronological implementation record (real entries only)

## 2026-10-23 — Session 1 (scaffold & engine)
- Environment inspected; Windows path Z:\drop unavailable in sandbox → project created under repo working dir. Stack chosen: Vite+React+TS+Zustand for instant browser playability on Windows.
- Created types.ts, rng.ts (mulberry32+FNV+weightedPick+uid), playerId.ts (FPS######-###AAA, uniqueness loop), items.ts (63 defs), cases.ts (7 defs w/ weights & level gates), benchmarks.ts (5 defs), missions.ts (8 daily + 17 achievements), leaderboard.ts (10 flagged bots).
- Implemented caseOpening.ts, compatibility.ts (all rules incl. mixed-RAM & cooler height heuristic), benchmark.ts (power→heat→throttle→stability→FPS pipeline; deterministic seed key bench|build).

## 2026-10-23 — Session 2 (state & UI)
- gameStore.ts: zustand store, freshState w/ starter kit + 500cr, load/save/version merge, daily rollover, actions for shop/inventory/builder/tuning/bench/missions/achievements/settings/reset, toasts.
- glass.css + components.tsx design system; App.tsx hash router + nav; 15 screens implemented; index.html + SVG assets.

## 2026-10-23 — Session 3 (relocation, fixes, verification, docs)
- **Moved entire project from subfolder to repository root (/workspace)** per owner request; node_modules relocated; folder removed.
- Fixed type errors: removed dead placeholder `rarityOf`/`countRarity`; added real `levelProgress()` helper used by Dashboard/Profile/Welcome; cleaned unused imports across BenchRun/Builder/Missions; simplified addXp via shared curve.
- Wrote src/engine/engine.test.ts (29 tests). One initial failure exposed an invalid test assumption (catalog has one RAM kit) → rewrote the mixed-RAM test against real data instead of weakening engine code.
- **Verified**: `npx tsc --noEmit` exit 0 · `npx vitest run` 29/29 passed · `npm run build` succeeded (JS 238 kB gzip 76 kB).
- Authored documentation suite (README/GDD/ARCHITECTURE/CLAUDE/PROGRESS/TESTING/ROADMAP/CHANGELOG/UPDATE_LOG/PROMPTS/UPDATE_PROMPT_TEMPLATE/CONTRIBUTING/SECURITY/CODE_OF_CONDUCT/LICENSE) and updated .gitignore.
- Known open items: manual browser playthrough QA on the owner's machine; eslint config not installed; sound effects absent.
