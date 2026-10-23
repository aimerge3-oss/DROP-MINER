import { useEffect, useState } from 'react';
import { useGame } from './state/gameStore';
import Welcome from './screens/Welcome';
import Dashboard from './screens/Dashboard';
import CaseShop from './screens/CaseShop';
import OpenCase from './screens/OpenCase';
import Inventory from './screens/Inventory';
import Builder from './screens/Builder';
import Tuning from './screens/Tuning';
import BenchRun from './screens/BenchRun';
import Leaderboard from './screens/Leaderboard';
import Missions from './screens/Missions';
import Profile from './screens/Profile';
import Settings from './screens/Settings';

export type Screen =
  | 'dashboard' | 'shop' | 'inventory' | 'builder' | 'tune' | 'bench'
  | 'leaderboard' | 'missions' | 'profile' | 'settings';

const NAV: { id: Screen; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'shop', label: 'Cases', icon: '📦' },
  { id: 'inventory', label: 'Parts', icon: '🗄️' },
  { id: 'builder', label: 'Build', icon: '🛠️' },
  { id: 'tune', label: 'Tune', icon: '🎚️' },
  { id: 'bench', label: 'Bench', icon: '🏁' },
  { id: 'leaderboard', label: 'Ranks', icon: '🏆' },
  { id: 'missions', label: 'Tasks', icon: '🎯' },
  { id: 'profile', label: 'Profile', icon: '🪪' },
  { id: 'settings', label: 'Config', icon: '⚙️' },
];

export default function App() {
  const g = useGame();
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [openingCase, setOpeningCase] = useState<string | null>(null);

  // hash routing so back/forward and refresh work
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace('#/', '') as Screen;
      if (NAV.some((n) => n.id === h)) setScreen(h);
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
  const go = (s: Screen) => { window.location.hash = `#/${s}`; setScreen(s); };

  if (!g.tutorialSeen) return <><div className="app-bg" /><Welcome /></>;

  return (
    <>
      <div className={`app-bg${g.settings.reducedMotion ? ' reduced-motion' : ''}`} />
      <div className={g.settings.reducedMotion ? 'reduced-motion' : ''}>
        <div className="shell">
          <header className="topbar">
            <div className="brand">
              <span className="logo-dot">⛏</span>
              <span>DROP MINER<small>SIM · v1.0</small></span>
            </div>
            <div className="credit-chip">
              🪙 {g.credits.toLocaleString()} cr
              <span className="lvl">Lv {g.stats.level}</span>
            </div>
            <button className="btn sm" title="Settings" onClick={() => go('settings')}>⚙️</button>
          </header>

          {screen === 'dashboard' && <Dashboard go={go} />}
          {screen === 'shop' && <CaseShop onOpen={(id) => setOpeningCase(id)} />}
          {screen === 'inventory' && <Inventory />}
          {screen === 'builder' && <Builder go={go} />}
          {screen === 'tune' && <Tuning />}
          {screen === 'bench' && <BenchRun />}
          {screen === 'leaderboard' && <Leaderboard />}
          {screen === 'missions' && <Missions />}
          {screen === 'profile' && <Profile />}
          {screen === 'settings' && <Settings />}

          <nav className="bottom-nav" aria-label="Main navigation">
            {NAV.map((n) => (
              <button key={n.id} className={`nav-btn${screen === n.id ? ' active' : ''}`} onClick={() => go(n.id)}>
                <span className="ico">{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>
        </div>

        {openingCase && <OpenCase caseId={openingCase} onClose={() => setOpeningCase(null)} />}

        <div className="toast-stack" aria-live="polite">
          {g.toasts.map((t) => (
            <div key={t.id} className={`toast ${t.kind}`} onClick={() => g.dismissToast(t.id)}>{t.text}</div>
          ))}
        </div>
      </div>
    </>
  );
}
