import { useGame } from '../state/gameStore';
import { DAILY_POOL, ACHIEVEMENTS } from '../data/missions';
import { Panel, Bar, fmt } from '../ui/components';

export default function Missions() {
  const g = useGame();
  return (
    <>
      <div className="screen-title">Missions & Achievements</div>
      <div className="screen-sub">Daily objectives refresh every day (UTC). Achievements are permanent milestones.</div>

      <Panel>
        <h3 style={{ fontSize: 15, marginBottom: 4 }}>🗓 Daily missions — {g.missionsDate}</h3>
        {g.missions.map((m) => {
          const def = DAILY_POOL.find((d) => d.id === m.id)!;
          const done = m.progress >= def.goal;
          return (
            <div key={m.id} style={{ marginTop: 14 }}>
              <div className="stat-row"><span className="muted">{def.name} <span className="tiny">— {def.desc}</span></span>
                <b style={{ color: done && !m.claimed ? 'var(--lime)' : undefined }}>{m.claimed ? 'Claimed ✓' : `${m.progress}/${def.goal}`}</b></div>
              {!m.claimed && <Bar pct={(m.progress / def.goal) * 100} />}
              {!m.claimed && done && (
                <button className="btn gold sm" style={{ marginTop: 8 }} onClick={() => g.claimMission(m.id)}>
                  Claim +{fmt(def.reward)} cr
                </button>
              )}
            </div>
          );
        })}
      </Panel>

      <Panel className="section-gap">
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>🏅 Achievements ({g.achievementsDone.length}/{ACHIEVEMENTS.length})</h3>
        <div className="grid cols-3">
          {ACHIEVEMENTS.map((a) => {
            const earned = g.achievementsDone.includes(a.id);
            const canClaim = !earned && a.check(g.stats);
            return (
              <div key={a.id} className="item-card" style={{ ['--rc' as string]: earned || canClaim ? 'var(--gold)' : '#42506a', opacity: earned ? 1 : canClaim ? 1 : 0.72 }}>
                <span className="icon">{earned ? a.icon : canClaim ? a.icon : '🔒'}</span>
                <div className="name">{a.name}</div>
                <div className="tiny muted" style={{ marginTop: 4 }}>{a.desc}</div>
                <div className="meta"><span className="rarity-tag" style={{ ['--rc' as string]: 'var(--gold)' }}>+{fmt(a.reward)} cr</span></div>
                {canClaim && <button className="btn gold sm block" style={{ marginTop: 8 }} onClick={() => g.claimAchievement(a.id)}>Claim reward</button>}
                {earned && <div className="tiny" style={{ color: 'var(--lime)', marginTop: 6 }}>Unlocked ✓</div>}
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
