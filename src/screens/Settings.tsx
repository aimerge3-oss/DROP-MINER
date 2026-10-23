import { useState } from 'react';
import { useGame } from '../state/gameStore';
import { Panel, StatRow, fmt } from '../ui/components';

export default function Settings() {
  const g = useGame();
  const [confirmReset, setConfirmReset] = useState(false);

  const exportSave = () => {
    const blob = new Blob([JSON.stringify({ version: g.version, playerId: g.playerId, playerName: g.playerName, credits: g.credits, xp: g.xp, inventory: g.inventory, builds: g.builds, activeBuildId: g.activeBuildId, runs: g.runs, stats: g.stats, missions: g.missions, missionsDate: g.missionsDate, achievementsDone: g.achievementsDone, tutorialSeen: g.tutorialSeen, settings: g.settings }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `dropminer-save-${g.playerId}.json`; a.click();
    URL.revokeObjectURL(url);
    g.notify('Save exported as JSON.', 'success');
  };

  const importSave = (file: File) => {
    file.text().then((txt) => {
      try {
        const data = JSON.parse(txt);
        if (!data.playerId || !Array.isArray(data.inventory)) throw new Error('bad');
        localStorage.setItem('dropminer.save.v1', JSON.stringify(data));
        location.reload();
      } catch {
        g.notify('Import failed: file is not a valid DROP MINER save.', 'error');
      }
    });
  };

  return (
    <>
      <div className="screen-title">Settings</div>
      <div className="screen-sub">Preferences and save management. Everything stays on this device.</div>
      <div className="grid cols-2">
        <Panel>
          <h3 style={{ fontSize: 15 }}>🎛 Preferences</h3>
          {[
            { k: 'soundOn' as const, label: 'Sound effects', desc: 'UI blips and case-opening stings (synthesized via WebAudio).' },
            { k: 'reducedMotion' as const, label: 'Reduced motion', desc: 'Shortens reel animation and disables ambient effects.' },
            { k: 'fastBenchmark' as const, label: 'Fast benchmarks', desc: 'Cuts simulated run time to ~2.5 s per pass.' },
          ].map((row) => (
            <label key={row.k} className="row" style={{ marginTop: 14, cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={g.settings[row.k]} onChange={(e) => g.updateSettings({ [row.k]: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--lime)' }} />
              <span><b>{row.label}</b><div className="tiny muted">{row.desc}</div></span>
            </label>
          ))}
        </Panel>

        <Panel>
          <h3 style={{ fontSize: 15 }}>💾 Save data</h3>
          <StatRow label="Storage" value="browser localStorage (offline)" />
          <StatRow label="Current balance" value={`${fmt(g.credits)} cr`} />
          <StatRow label="Inventory size" value={g.inventory.length} />
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn ice" onClick={exportSave}>⬇ Export save</button>
            <label className="btn">⬆ Import save
              <input type="file" accept=".json,application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importSave(f); }} />
            </label>
            <span className="spacer" />
            {!confirmReset
              ? <button className="btn danger" onClick={() => setConfirmReset(true)}>Reset game…</button>
              : <button className="btn danger" onClick={() => { g.resetGame(); setConfirmReset(false); }}>Are you sure? Click again</button>}
          </div>
          <p className="tiny muted" style={{ marginTop: 10 }}>Reset wipes the local save and generates a fresh player ID. This cannot be undone.</p>
        </Panel>

        <Panel>
          <h3 style={{ fontSize: 15 }}>ℹ About</h3>
          <p className="tiny muted">DROP MINER v1.0.0 — an original simulation game. All hardware brands, prices, temperatures and FPS figures are fictional game values. Nothing in this game measures or affects your real computer, and no part of it mines anything or involves cryptocurrency.</p>
        </Panel>
      </div>
    </>
  );
}
