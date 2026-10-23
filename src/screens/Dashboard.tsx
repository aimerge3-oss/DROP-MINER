import { useGame, levelProgress } from '../state/gameStore';
import { getItem } from '../data/items';
import { BENCHMARKS } from '../data/benchmarks';
import { DAILY_POOL } from '../data/missions';
import { resolveBuild, buildReadiness } from '../engine/compatibility';
import { uidMapOf } from '../state/gameStore';
import { predict } from '../engine/benchmark';
import { Panel, StatRow, Bar, EmptyState, fmt, ItemCard } from '../ui/components';
import { useState } from 'react';
import type { Screen } from '../App';
import type { ItemDef } from '../types';
import { ItemDetailModal } from '../ui/components';

export default function Dashboard({ go }: { go: (s: Screen) => void }) {
  const g = useGame();
  const lvl = levelProgress(g.xp);
  const active = g.builds.find((b) => b.id === g.activeBuildId) ?? null;
  const [inspect, setInspect] = useState<ItemDef | null>(null);
  const readiness = active ? buildReadiness(resolveBuild(active, uidMapOf(g.inventory))) : null;
  const bestBench = active ? predict(active, BENCHMARKS[1], uidMapOf(g.inventory)) : null;
  const newest = [...g.inventory].slice(-4).reverse().map((o) => ({ o, def: getItem(o.defId) }));
  const claimableMissions = g.missions.filter((m) => {
    const def = DAILY_POOL.find((d) => d.id === m.id);
    return def && !m.claimed && m.progress >= def.goal;
  });

  return (
    <>
      <div className="screen-title">Dashboard</div>
      <div className="screen-sub">Welcome back, <b>{g.playerName}</b>. Here is your workshop at a glance.</div>

      <div className="grid cols-2">
        <Panel>
          <div className="row"><h3 style={{ fontSize: 16 }}>🧪 Active Build</h3><span className="spacer" />
            {active && <button className="btn sm" onClick={() => go('builder')}>Manage →</button>}</div>
          {active && readiness ? (
            <>
              <div style={{ margin: '10px 0 6px', fontWeight: 700 }}>{active.name}</div>
              <StatRow label="Status" value={readiness.ready ? <span style={{ color: 'var(--lime)' }}>Ready to benchmark ✅</span>
                : <span style={{ color: 'var(--gold)' }}>Missing: {readiness.missing.join(', ')}</span>} />
              {readiness.ready && bestBench?.ready && (
                <>
                  <StatRow label="Est. avg FPS (Neon Rush)" value={`${bestBench.avgFpsEst}`} />
                  <StatRow label="Est. temp / draw" value={`${bestBench.tempEst}°C · ${fmt(bestBench.powerEst)} W`} />
                  <div style={{ marginTop: 10 }} className="row">
                    <button className="btn primary" onClick={() => go('bench')}>Run Benchmark</button>
                    <button className="btn" onClick={() => go('tune')}>Overclock</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <EmptyState icon="🖥️" title="No PC yet" sub="Create your first build from the starter kit in your inventory."
              action={<button className="btn primary" onClick={() => go('builder')}>Open PC Builder</button>} />
          )}
        </Panel>

        <Panel>
          <h3 style={{ fontSize: 16 }}>📈 Progression</h3>
          <StatRow label="Player ID" value={<span className="mono">{g.playerId}</span>} />
          <StatRow label="Credits" value={<span style={{ color: 'var(--gold)' }}>{fmt(g.credits)} cr</span>} />
          <StatRow label="Level" value={`${lvl.level} (${lvl.into}/${lvl.need} XP)`} />
          <Bar pct={(lvl.into / lvl.need) * 100} />
          <StatRow label="Best score" value={fmt(g.stats.bestScore)} />
          <StatRow label="Best avg FPS" value={g.stats.bestAvgFps ? `${g.stats.bestAvgFps} fps` : '—'} />
          <div style={{ marginTop: 12 }} className="row">
            <button className="btn sm ice" onClick={() => go('missions')}>
              Missions {claimableMissions.length > 0 && <span className="pulse-dot" />}
            </button>
            <button className="btn sm" onClick={() => go('leaderboard')}>Leaderboard</button>
            <button className="btn sm" onClick={() => go('profile')}>Profile</button>
          </div>
        </Panel>

        <Panel>
          <div className="row"><h3 style={{ fontSize: 16 }}>📦 Latest loot</h3><span className="spacer" />
            <button className="btn sm" onClick={() => go('shop')}>Buy cases →</button></div>
          {newest.length === 0 ? <EmptyState icon="🕳️" title="Inventory empty" /> : (
            <div className="grid cols-4" style={{ marginTop: 12 }}>
              {newest.map(({ def }) => <ItemCard key={def.id} def={def} onClick={() => setInspect(def)} />)}
            </div>
          )}
        </Panel>

        <Panel>
          <h3 style={{ fontSize: 16 }}>⚡ Quick stats</h3>
          <StatRow label="Cases opened" value={g.stats.casesOpened} />
          <StatRow label="Benchmarks run" value={g.stats.benchmarksRun} />
          <StatRow label="Stable runs" value={g.stats.stableRuns} />
          <StatRow label="Parts sold" value={g.stats.itemsSold} />
          <StatRow label="Lifetime earned" value={`${fmt(g.stats.totalEarned)} cr`} />
          <StatRow label="Lifetime spent" value={`${fmt(g.stats.totalSpent)} cr`} />
        </Panel>
      </div>

      {inspect && <ItemDetailModal def={inspect} onClose={() => setInspect(null)} />}
    </>
  );
}
