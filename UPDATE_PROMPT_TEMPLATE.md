# UPDATE PROMPT TEMPLATE (fill in and send to the next developer/AI agent)

```
TASK: ⟨one sentence goal⟩
TYPE: feature | bugfix | content | ui | balance | infra

BEFORE WRITING CODE:
1. Read README.md, ARCHITECTURE.md, CLAUDE.md, GDD.md.
2. Inspect the CURRENT source tree (do not trust this prompt's assumptions):
   src/types.ts, src/data/*, src/engine/*, src/state/gameStore.ts, src/screens/*, src/ui/*.
3. Summarize in 5 bullets how the affected subsystem works today.

IMPLEMENTATION RULES:
- Respect layering: screens→store→engine→data. Engine stays pure & deterministic.
- All new content lives in src/data files; never hardcode stats in components.
- Validate every player action; surface failures via notify(); no dead buttons.
- Preserve backward-compatible saves or bump SAVE_VERSION + merge defaults.
- Do not remove or degrade existing working features.

AFTER CODING (report real outputs, never fabricated):
- `npx tsc --noEmit`
- `npx vitest run` (add/extend tests for changed engine/data)
- `npm run build`
- Manual check of the touched screen(s) from the TESTING.md checklist.

DOCUMENTATION: append dated entries to UPDATE_LOG.md, update PROGRESS.md status,
add CHANGELOG.md bullet if user-visible, adjust GDD/ARCHITECTURE if design changed.

DELIVERABLE: diff summary + verification transcript + known limitations.
```
