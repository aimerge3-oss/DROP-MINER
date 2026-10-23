# DROP MINER — Testing

## Automated
```bash
npm test              # vitest run — engine unit tests
npm run test:watch    # watch mode
npm run typecheck     # tsc --noEmit (strict)
npm run build         # typecheck + production build
```

### What the suite covers (`src/engine/engine.test.ts`, 29 tests)
- **rng**: mulberry32 determinism, [0,1) range, FNV seed stability, weighted-pick edge cases, uid uniqueness.
- **playerId**: format regex `FPS\d{6}-\d{3}[A-Z]{3}`, collision avoidance.
- **catalog integrity**: every item has value/name/id convention; every case drop resolves via `getItem`; unknown ids throw.
- **caseOpening**: seeded rolls reproducible; drops confined to case pool; reel places winner near end; sell price = round(60% value); owned-uid uniqueness.
- **compatibility**: starter build ready; socket mismatch rejected with reason; mixed-RAM rejection; same-kit acceptance; empty build lists all 8 missing slots; OC-support mirrors board flag.
- **benchmark**: identical inputs ⇒ identical RunCore (determinism); OC raises heat; extreme OC+dead fans hotter than stock; run payload well-formed (low1 ≤ avgFps, credits ≥ 5); incomplete builds throw; heavier bench penalizes low-VRAM GPU.

### Verified in the development sandbox (Linux, Node)
- `npx tsc --noEmit` → **exit 0**
- `npx vitest run` → **29 passed / 29**
- `npm run build` → **✓ built** (dist/assets JS ≈ 238 kB)
These should be re-run on your machine after `npm install`.

## Known testing limitations
- No jsdom/React Testing Library setup yet → screens are covered by the **manual checklist below**, not automated UI tests.
- ESLint script exists but eslint isn't part of the offline sandbox install; `npm i -D eslint @typescript-eslint/*` enables it.
- Save-corruption recovery is exercised manually only.

## Manual QA checklist (run after UI changes)
1. Fresh profile → Welcome tutorial steps advance; skip works.
2. Dashboard shows credits/level/active build; every card navigates.
3. Shop: cannot buy unaffordable/level-locked case (button disabled + toast); purchase deducts credits exactly.
4. OpenCase: reel animates, stops on reward; reward stats & rarity shown; item lands in inventory.
5. Inventory: filter by category & sort by value; select → sell adds 60% value; equipped items flagged and unsellable while equipped.
6. Builder: create/rename/delete/switch builds; incompatible part shows reason; readiness list shrinks as slots fill; estimates update live.
7. Tuning: sliders clamp to ranges; prediction warns on instability/throttle; reset restores defaults; non-OC board disables CPU/GPU OC.
8. Benchmark: locked benches show requirement; run shows progress + fps graph; results compare vs previous best; credits & XP awarded; history grows; same rig+tune ⇒ same score twice.
9. Missions: daily set matches date; claiming pays once; rollover next day.
10. Achievements: trigger & claim exactly once each.
11. Leaderboard: player entry ranks among clearly-labelled bots; refreshes after records.
12. Profile: ID copies to clipboard; stats match activity.
13. Settings: toggles persist; export downloads JSON; import restores; reset wipes to fresh state.
14. Reload page mid-session → everything persists. Resize to phone width → layout/nav usable. Console error-free (DevTools).
