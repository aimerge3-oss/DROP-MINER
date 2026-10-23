# Changelog
All notable changes to DROP MINER. Format follows Keep a Changelog; versions are game releases.

## [1.0.0] — 2026-10-23 — First complete playable release
### Added
- Full project scaffold at repository root: Vite + React 18 + TypeScript (strict) + Zustand.
- Content data: 63 fictional components (9 categories, 6 rarity tiers), 7 cases with weighted drop tables & level gates, 5 benchmark scenarios, 8-entry daily mission pool, 17 achievements, 10 simulated leaderboard demo players.
- Simulation engine: seeded mulberry32/FNV RNG (deterministic results), case rolling + reel builder + 60% sell pricing, compatibility validation (socket, form factor, cooler clearance, mixed-RAM, fan slots, OC board support), power/thermal/stability model with throttling, PSU overload crash, VRAM gating, diminishing-returns FPS curve, credit rewards with improvement bonus.
- State layer: Zustand store with all gameplay actions; versioned localStorage save (`dropminer.save.v1`) with default-merge loading; daily mission rollover; credit-spend validation; XP/level curve; toast system.
- UI: "Liquid Glass" design system (dark translucent panels, blur, lime/ice/gold accents, responsive bottom nav, hash routing); SVG logo & favicon; explicit empty/locked/error/success states.
- All 15 required screens wired: Welcome/onboarding, Dashboard, Case Shop, Case Opening + reward, Inventory (sort/filter/inspect/sell/equipped flags), PC Builder (+config details panel), Overclock/Cooling tuner with live prediction, Benchmark select → animated run with FPS graph → results vs previous best → history, Leaderboards (bots labelled simulated), Missions & Achievements, Profile & Statistics (copyable unique player ID `FPS######-###AAA`), Settings (toggles, save export/import, reset).
- Tests: 29 vitest unit tests for rng determinism, player-ID format/uniqueness, catalog/drop-table integrity, compatibility rules, benchmark reproducibility & physics behavior. `tsc --noEmit`, `vitest run`, and `vite build` verified passing in the development sandbox.
- Documentation set: README, CLAUDE, GDD, ARCHITECTURE, PROGRESS, TESTING, ROADMAP, CHANGELOG, UPDATE_LOG, PROMPTS, UPDATE_PROMPT_TEMPLATE, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, LICENSE, .gitignore.
