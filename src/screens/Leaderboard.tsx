import { useMemo } from 'react';
import { useGame } from '../state/gameStore';
import { DEMO_LEADERBOARD } from '../data/leaderboard';
import { BENCH_MAP } from '../data/benchmarks';
import { Panel, EmptyState, fmt } from '../ui/components';
import type { LeaderEntry } from '../types';

export default function Leaderboard() {
  const g = useGame();

  const rows = useMemo(() => {
    const bestByPlayer = new Map<string, LeaderEntry>();
    // demo bots
    DEMO_LEADERBOARD.forEach((d) => bestByPlayer.set(d.playerId, d));
    // real player's best run
    if (g.runs.length > 0) {
      const best = [...g.runs].sort((a, b) => b.score - a.score)[0];
      bestByPlayer.set(g.playerId, {
        rank: 0, name: `${g.playerName} (you)`, playerId: g.playerId, score: best.score,
        avgFps: best.avgFps, low1Fps: best.low1Fps, hardware: best.hardwareSummary, simulated: false,
      });
    }
    return [...bestByPlayer.values()].sort((a, b) => b.score - a.score).map((e, i) => ({ ...e, rank: i + 1 }));
  }, [g.runs, g.playerId, g.playerName]);

  return (
    <>
      <div className="screen-title">Leaderboards</div>
      <div className="screen-sub">Local board — your save vs shipped demo profiles. No online backend exists yet; entries marked 🤖 are simulated sample players.</div>

      <Panel>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>🌐 Overall best score</h3>
        {rows.length === 0 ? <EmptyState icon="🏁" title="No scores yet" sub="Run a benchmark to appear here." /> : (
          rows.slice(0, 15).map((r) => (
            <div key={r.playerId} className={`lb-row${!r.simulated ? ' me' : ''}`} style={{ marginBottom: 8 }}>
              <div className="rank">{r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : `#${r.rank}`}</div>
              <div>
                <b>{r.name}</b> {r.simulated && <span title="Simulated demo player">🤖</span>}
                <div className="tiny mono muted">{r.playerId} · {r.hardware}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <b style={{ color: r.simulated ? 'var(--text)' : 'var(--lime)' }}>{fmt(r.score)}</b>
                <div className="tiny muted mono">{r.avgFps} fps avg · {r.low1Fps} 1% low</div>
              </div>
            </div>
          ))
        )}
        <p className="tiny muted" style={{ marginTop: 10 }}>Per-benchmark filtering is reserved for the future online leaderboard (see ROADMAP.md).</p>
      </Panel>

      <Panel className="section-gap">
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>Your records per scenario</h3>
        {BENCH_MAP.size && g.runs.length === 0 && <EmptyState icon="📊" title="No runs recorded" />}
        {[...BENCH_MAP.values()].map((b) => {
          const best = g.runs.filter((r) => r.benchId === b.id).reduce((a, r) => Math.max(a, r.score), 0);
          return best > 0 ? <StatLine key={b.id} label={`${b.icon} ${b.name}`} value={fmt(best)} /> : null;
        })}
      </Panel>
    </>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return <div className="stat-row"><span className="muted">{label}</span><b>{value}</b></div>;
}
