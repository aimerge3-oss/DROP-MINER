import { useState } from 'react';
import { useGame, levelProgress } from '../state/gameStore';
import { getItem } from '../data/items';
import { RARITY_ORDER } from '../ui/components';
import { Panel, StatRow, CopyChip, Bar, fmt } from '../ui/components';

export default function Profile() {
  const g = useGame();
  const lvl = levelProgress(g.xp);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(g.playerName);

  const byRarity = RARITY_ORDER.map((r) => ({ r, n: g.inventory.filter((o) => getItem(o.defId).rarity === r).length }));
  const ownedTiers = new Set(g.inventory.map((o) => getItem(o.defId).type));

  return (
    <>
      <div className="screen-title">Profile & Statistics</div>
      <div className="screen-sub">Your builder identity and lifetime record.</div>

      <div className="grid cols-2">
        <Panel>
          <div className="row">
            <div style={{ width: 54, height: 54, borderRadius: 16, display: 'grid', placeItems: 'center', fontSize: 26, background: 'linear-gradient(135deg, var(--lime), var(--ice))' }}>🧑‍🔧</div>
            <div>
              {editing ? (
                <div className="row">
                  <input value={name} maxLength={20} onChange={(e) => setName(e.target.value)} style={{ width: 150 }} />
                  <button className="btn sm primary" onClick={() => { g.setName(name); setEditing(false); }}>Save</button>
                </div>
              ) : (
                <div className="row" style={{ gap: 6 }}>
                  <b style={{ fontSize: 17 }}>{g.playerName}</b>
                  <button className="btn sm" onClick={() => { setName(g.playerName); setEditing(true); }}>✏️</button>
                </div>
              )}
              <div className="tiny muted">Member since {new Date(g.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <StatRow label="Player ID" value={<CopyChip text={g.playerId} />} hint="A local game tag — not a wallet address." />
            <StatRow label="Level" value={`${lvl.level}`} />
            <Bar pct={(lvl.into / lvl.need) * 100} />
            <StatRow label="Total XP" value={fmt(g.xp)} />
            <StatRow label="Credits" value={<span style={{ color: 'var(--gold)' }}>{fmt(g.credits)} cr</span>} />
          </div>
          <p className="tiny muted" style={{ marginTop: 10 }}>The ID format is FPS + 6 digits, then 3 digits + 3 letters. It only identifies your local save.</p>
        </Panel>

        <Panel>
          <h3 style={{ fontSize: 15 }}>📚 Collection by rarity</h3>
          {byRarity.map(({ r, n }) => (
            <div key={r} className={`r-${r}`} style={{ margin: '8px 0' }}>
              <div className="row tiny"><span className="rarity-tag">{r}</span><span className="spacer" /><b>{n}</b></div>
              <Bar pct={Math.min(100, n * 8)} />
            </div>
          ))}
          <StatRow label="Component types owned" value={`${ownedTiers.size}/9`} />
          <StatRow label="Unique catalog items" value={`${new Set(g.inventory.map((i) => i.defId)).size} / 63`} />
        </Panel>

        <Panel>
          <h3 style={{ fontSize: 15 }}>🏆 Records</h3>
          <StatRow label="Best score" value={fmt(g.stats.bestScore)} />
          <StatRow label="Best average FPS" value={g.stats.bestAvgFps} />
          <StatRow label="Stable runs" value={g.stats.stableRuns} />
          <StatRow label="Benchmark runs" value={g.stats.benchmarksRun} />
          <StatRow label="Cases opened" value={g.stats.casesOpened} />
          <StatRow label="Legendary+ pulls" value={g.stats.legendaryPlus} />
          <StatRow label="Mythic finds" value={g.stats.mythicsFound} />
        </Panel>

        <Panel>
          <h3 style={{ fontSize: 15 }}>💰 Economy lifetime</h3>
          <StatRow label="Total earned" value={`${fmt(g.stats.totalEarned)} cr`} />
          <StatRow label="Total spent" value={`${fmt(g.stats.totalSpent)} cr`} />
          <StatRow label="Net flow" value={`${fmt(g.stats.totalEarned - g.stats.totalSpent)} cr`} />
          <StatRow label="Parts sold" value={g.stats.itemsSold} />
          <StatRow label="Builds saved" value={g.stats.buildsSaved} />
          <StatRow label="Tune adjustments" value={g.stats.tunesAdjusted} />
        </Panel>
      </div>
    </>
  );
}
