// ─── Player identity generation ─────────────────────────────────────────────
// Format: FPS + 6 digits + '-' + 3 digits + 3 uppercase letters.
// Example: FPS777666-MAX → displayed as "FPS777666-MAX".
// This is a local game identifier only — NOT a wallet address of any kind.

const DIGITS = '0123456789';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randChar(set: string): string {
  return set[Math.floor(Math.random() * set.length)];
}

export function generatePlayerId(existing: Set<string>): string {
  for (let attempt = 0; attempt < 10000; attempt++) {
    let id = 'FPS';
    for (let i = 0; i < 6; i++) id += randChar(DIGITS);
    id += '-';
    for (let i = 0; i < 3; i++) id += randChar(DIGITS);
    for (let i = 0; i < 3; i++) id += randChar(LETTERS);
    if (!existing.has(id)) return id;
  }
  // Extremely unlikely fallback: timestamp-derived suffix keeps uniqueness.
  const t = Date.now().toString();
  return `FPS${t.slice(-6)}-${t.slice(0, 3)}DM${t.slice(6, 7)}`;
}

export const PLAYER_ID_PATTERN = /^FPS\d{6}-\d{3}[A-Z]{3}$/;
