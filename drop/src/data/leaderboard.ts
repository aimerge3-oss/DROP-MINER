import type { LeaderEntry } from '../types';

// ─── Local leaderboard seed data ────────────────────────────────────────────
// These entries are SIMULATED DEMO PLAYERS shipped with the game to make the
// board feel alive on first launch. They are clearly labeled in the UI and
// flagged via `simulated: true`. There is NO online backend.

export const DEMO_LEADERBOARD: LeaderEntry[] = [
  { rank: 1, name: 'OverclockOtter', playerId: 'FPS482913-777OTT', score: 14820, avgFps: 312, low1Fps: 244, hardware: 'Nyx Singularity Ω · Coreforge Monolith ∞', simulated: true },
  { rank: 2, name: 'ThermalThrottle', playerId: 'FPS109284-441VRX', score: 12105, avgFps: 268, low1Fps: 197, hardware: 'Nyx Photon P90X · Aurora A9-9000X', simulated: true },
  { rank: 3, name: 'Silicon_Sage', playerId: 'FPS551038-902LUM', score: 9840, avgFps: 231, low1Fps: 168, hardware: 'Nyx Photon P70 · Tempest T16-00X', simulated: true },
  { rank: 4, name: 'RamRaptor', playerId: 'FPS773201-118NEO', score: 8120, avgFps: 198, low1Fps: 142, hardware: 'Vortex V5-180 Ti · Ember E8-90K', simulated: true },
  { rank: 5, name: 'FanCurve_Fiona', playerId: 'FPS264950-335AQL', score: 6490, avgFps: 171, low1Fps: 118, hardware: 'Vortex V5-090 · Stride S6-60X', simulated: true },
  { rank: 6, name: 'VoltVandal', playerId: 'FPS918273-660ZAP', score: 5230, avgFps: 148, low1Fps: 96, hardware: 'Titan T4-080 · Ember E8-70', simulated: true },
  { rank: 7, name: 'BudgetBob', playerId: 'FPS330117-204PRT', score: 3910, avgFps: 119, low1Fps: 74, hardware: 'RX-760S · Quad Q460', simulated: true },
  { rank: 8, name: 'StockCooler', playerId: 'FPS661904-551HYP', score: 2760, avgFps: 94, low1Fps: 55, hardware: 'RX-550 · Stride S6-30', simulated: true },
  { rank: 9, name: 'MoboMoth', playerId: 'FPS409612-773DUS', score: 1850, avgFps: 71, low1Fps: 38, hardware: 'GX-310 · Quad Q240', simulated: true },
  { rank: 10, name: 'FirstBoot_Fred', playerId: 'FPS885120-016NEW', score: 940, avgFps: 48, low1Fps: 21, hardware: 'GTX-160 · Quad Q240', simulated: true },
];
