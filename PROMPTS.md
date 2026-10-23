# DROP MINER — Reusable AI prompts

Copy a prompt, replace ⟨…⟩ placeholders. Always end with the verification line included.

## Add a new component
> Inspect src/data/items.ts and src/types.ts. Add one new ⟨GPU|CPU|…⟩ named ⟨name⟩, rarity ⟨tier⟩, original fictional branding, stats consistent with neighbors of same tier. Register it in the drops of cases ⟨ids⟩ with sensible weights. Run `npx tsc --noEmit && npx vitest run` and report actual output.

## Add a new case
> Read src/data/cases.ts and the item catalog. Create a case ⟨name⟩ priced ⟨X⟩ cr, theme ⟨colors⟩, drop table only referencing existing item ids, optional level gate. Ensure Shop renders it automatically; verify with typecheck+tests.

## Add a benchmark mode
> In src/data/benchmarks.ts add scenario ⟨name⟩ with gpuWeight ⟨w⟩, difficulty ⟨1-5⟩, minVRAM, rewardBase tuned between existing entries, unlockScore progression-consistent. Check predict()/computeRun() handle it unchanged; add a determinism test; run tests.

## Fix a bug
> Reproduce: ⟨steps⟩. Expected ⟨…⟩, actual ⟨…⟩. Locate root cause in engine/state/data layers (follow ARCHITECTURE.md dependency rule). Minimal fix, no behavior changes elsewhere; add a regression test; run `npx tsc --noEmit && npx vitest run`.

## Review architecture
> Audit src/ against CLAUDE.md invariants: engine purity, data single-source-of-truth, store-only mutation, no dead buttons. List violations with file:line and proposed fixes; don't edit yet.

## Improve UI without breaking logic
> Restyle ⟨screen⟩ using tokens from src/ui/glass.css only (glass panels, lime/ice/gold accents, dark theme). Preserve all store actions & routing. Keep responsive down to 380px. After change run typecheck+build; state exactly what was verified.

## Rebalance economy
> Simulate: starting 500cr, case prices in src/data/cases.ts, payouts in benchmark.ts runBenchmark + missions.ts rewards. Propose numeric changes so first upgrade lands in ⟨N⟩ minutes; apply edits only to data files; rerun tests.

## Prepare a release
> Bump package.json version, update CHANGELOG.md & PROGRESS.md with actually-implemented items only, run `npm run build`, summarize dist size. Never claim untested features work.
