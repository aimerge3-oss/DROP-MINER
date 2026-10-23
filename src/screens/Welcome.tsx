import { useState } from 'react';
import { useGame, levelProgress } from '../state/gameStore';
import { Panel, CopyChip } from '../ui/components';

const STEPS = [
  { icon: '📦', title: 'Open cases', body: 'Spend credits on hardware crates. Rarity runs from Common junk to Mythic legend-silicon.' },
  { icon: '🛠️', title: 'Build a rig', body: 'Install compatible GPU, CPU, board, RAM, storage, PSU, cooling and case into a saved build.' },
  { icon: '🎚️', title: 'Tune it', body: 'Push clocks and power limits — but watch heat. Unstable rigs throttle or crash the run.' },
  { icon: '🏁', title: 'Benchmark', body: 'Run simulated FPS challenges, earn credits and XP, chase records and climb the local leaderboard.' },
];

export default function Welcome() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const g = useGame();
  const lvl = levelProgress(g.xp);
  const s = STEPS[step];

  return (
    <div className="welcome">
      <Panel style={{ width: 'min(560px, 94vw)', textAlign: 'center', padding: '40px 32px' }}>
        <div className="logo-big" style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(100deg, var(--lime), var(--ice) 55%, var(--violet))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          DROP MINER
        </div>
        <p className="muted" style={{ marginTop: 6 }}>Case-opening · PC building · Overclocking · FPS benchmarking</p>
        <p className="tiny muted" style={{ marginTop: 8 }}>All performance numbers are a game simulation — nothing here measures your real computer.</p>

        <div className="steps">
          {STEPS.map((_, i) => <span key={i} className={`step-dot${i === step ? ' on' : ''}`} />)}
        </div>

        {step < STEPS.length ? (
          <>
            <div style={{ fontSize: 46, marginBottom: 8 }}>{s.icon}</div>
            <h2 style={{ fontSize: 20 }}>{s.title}</h2>
            <p className="muted" style={{ margin: '10px auto 22px', maxWidth: 380, minHeight: 58 }}>{s.body}</p>
            <div className="row" style={{ justifyContent: 'center' }}>
              {step > 0 && <button className="btn" onClick={() => setStep(step - 1)}>← Back</button>}
              <button className="btn primary lg" onClick={() => setStep(step + 1)}>
                {step === STEPS.length - 1 ? 'Almost there →' : 'Next →'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 46, marginBottom: 8 }}>🪪</div>
            <h2 style={{ fontSize: 20 }}>Your builder identity</h2>
            <p className="muted" style={{ margin: '8px auto 14px', maxWidth: 380 }}>
              Every save gets a unique ID. It is just a game tag — not a wallet address.
            </p>
            <div style={{ marginBottom: 16 }}><CopyChip text={g.playerId} /></div>
            <p className="tiny muted">Level {lvl.level} · Starting balance: {g.credits} credits · A starter kit waits in your inventory.</p>
            <div className="row" style={{ justifyContent: 'center', marginTop: 18 }}>
              <input type="text" placeholder={`${g.playerName}`} value={name} maxLength={20}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { if (name.trim()) g.setName(name); g.setTutorialSeen(); } }}
                style={{ width: 210 }} />
              <button className="btn primary lg" onClick={() => { if (name.trim()) g.setName(name); g.setTutorialSeen(); }}>
                Start Building 🚀
              </button>
            </div>
            <button className="btn sm" style={{ marginTop: 14 }} onClick={() => g.setTutorialSeen()}>Skip tutorial</button>
          </>
        )}
      </Panel>
    </div>
  );
}
