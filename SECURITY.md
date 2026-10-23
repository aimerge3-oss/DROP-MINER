# Security Policy — DROP MINER

## What this app is (and isn't)
A fully client-side, offline game simulation. It performs **no network requests**, stores data only in your browser's `localStorage`, and ships no analytics, trackers, payments or crypto functionality. The profile ID (`FPS######-###AAA`) is a cosmetic game tag — it is *not* a wallet address and must never be presented as one.

## Supported versions
| Version | Supported |
|---|---|
| 1.0.x | ✅ |

## Local trust model & hardening already applied
- **No secrets**: nothing to leak; no `.env` required (example file intentionally absent). Keep it that way.
- **Save import validation** (Settings → Import): JSON is parsed inside try/catch, shape-checked against `GameState`, missing fields merged from defaults; malformed files are rejected with an error toast instead of crashing the store.
- **XSS posture**: React escapes all rendered content; item names/flavor text come from first-party data files. Never introduce `dangerouslySetInnerHTML` for save-derived strings.
- **Dependency hygiene**: runtime deps limited to react/react-dom/zustand; lockfile committed; review any new dependency before adding.
- **DoS-ish inputs**: sliders clamped; RNG loops bounded (player-ID retry cap, level cap 50); localStorage quota errors caught on persist.

## Reporting a vulnerability
Open a private issue/DM to the repository owner with: reproduction steps, affected version, impact. Expect acknowledgment within 7 days. Do not file public issues for exploitable bugs before a fix window.

## If you add features later
Any future online leaderboard/PWA/server adapter must: use HTTPS, validate server payloads like local saves, rate-limit submissions, and keep single-player mode working without network. Update this document when scope changes.
