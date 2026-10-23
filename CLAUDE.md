# CLAUDE.md — Rules for AI coding agents working on DROP MINER

## What this project is
Browser-playable PC-building/case-opening/FPS-benchmarking **game simulation** (Vite + React 18 + TypeScript strict + Zustand). Fictional hardware brands only. All numbers are simulated; never claim they measure real hardware.

## Architecture invariants (do not break)
1. `src/engine/*` = **pure functions**. No React, no store, no localStorage imports. RNG must be injectable/seeded so results stay deterministic.
2. `src/data/*` = single source of truth for items, cases, benchmarks, missions, leaderboard bots. Never duplicate stat values inside screens or components.
3. `src/state/gameStore.ts` = the only place that mutates & persists `GameState` (key `dropminer.save.v1`, bump `SAVE_VERSION` on shape changes and merge defaults in the loader).
4. Screens (`src/screens/*`) dispatch store actions and render. No game math in JSX.
5. Styling goes through the Liquid Glass system in `src/ui/glass.css` + shared widgets in `src/ui/components.tsx`. Keep dark theme, translucency, lime/ice/gold accents.

## Commands
- `npm run dev` · `npm run typecheck` · `npm test` (vitest) · `npm run build` · `npm run preview`
- After ANY change: `npx tsc --noEmit && npx vitest run` must pass before you report success.

## Coding standards
- TypeScript strict; no `any` except where a generic record is unavoidable (justify in comment).
- New items follow id prefixes: `gpu_ cpu_ mobo_ ram_ ssd_ psu_ fan_ cool_ case_`.
- Every new screen must be registered in the hash router in `App.tsx` and reachable from navigation. No dead buttons.
- Validate player actions against state (credits ≥ price, compatibility, unlock gates) and surface failures via `notify(text,'error')`.
- Rarity colors come from `rarityColor()` in ui/components — don't hardcode hexes per screen.

## Testing requirements
- Engine changes require unit tests in `src/engine/*.test.ts` (existing suite covers rng determinism, drop-table integrity, compatibility rules, benchmark reproducibility).
- Data edits: catalog-integrity tests will catch broken references — keep them green.
- Manual QA checklist lives in TESTING.md; run it for UI changes.

## Honesty rules
- Never write "tests pass" unless you executed them and observed output.
- Never add fake backend/online features; leaderboard bots must stay labelled as simulated.
- Update PROGRESS.md, UPDATE_LOG.md and CHANGELOG.md with what you actually did.

## Restricted areas
- Do not introduce paid APIs, analytics, crypto/wallet code, or network calls. The game is offline-first.
- Do not rename the save key without a migration path.
