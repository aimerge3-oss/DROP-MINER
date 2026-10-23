# Contributing to DROP MINER
Thanks for keeping the rigs honest (fictional) and the glass shiny.

## Setup
```bash
git clone <your-fork> && cd drop-miner
npm install
npm run dev        # http://localhost:5173
```

## Ground rules
1. One logical change per PR; describe player-visible impact.
2. `npm run typecheck && npm test && npm run build` must pass — include the real terminal output in the PR description.
3. Follow CLAUDE.md invariants (pure engine, data-driven content, store-only mutations). Screens with hardcoded stat values will be rejected.
4. New components/cases/benches go in `src/data/*` with tests kept green (catalog-integrity tests catch typos in references).
5. UI changes must preserve the Liquid Glass language and stay responsive ≥380px wide; no admin-dashboard drift.
6. Keep the simulation disclaimer intact: never present numbers as real-world measurements; never add payments/crypto/network services without an RFC issue first.

## Process
Fork → branch `feat/short-name` or `fix/short-name` → commit (imperative subject, e.g. "Add pity timer to Frostbyte Vault") → PR fills the template: what/why/how-tested/screenshots. Updates to docs (PROGRESS/UPDATE_LOG/CHANGELOG) belong in the same PR.

## Style
TypeScript strict, 2-space indent, single quotes, semicolons. Emoji allowed in data/UI flavor text only.
