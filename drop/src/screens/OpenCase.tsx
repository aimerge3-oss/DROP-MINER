import { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../state/gameStore';
import { CASES } from '../data/cases';
import { getItem } from '../data/items';
import { buildReel } from '../engine/caseOpening';
import type { ItemDef } from '../types';
import { StatRow, fmt, rarityColor, ItemDetailModal } from '../ui/components';

type Phase = 'spinning' | 'reveal' | 'done';

export default function OpenCase({ caseId, onClose }: { caseId: string; onClose: () => void }) {
  const g = useGame();
  const caseDef = CASES.find((c) => c.id === caseId)!;
  const [phase, setPhase] = useState<Phase>('spinning');
  const [offset, setOffset] = useState(0);
  const [detail, setDetail] = useState<ItemDef | null>(null);
  const boughtRef = useRef(false);
  const [winner, setWinner] = useState<ItemDef | null>(null);

  // Buy once on mount
  const fail = useMemo(() => {
    if (boughtRef.current) return null;
    boughtRef.current = true;
    const res = g.buyCase(caseId);
    if (!res.ok || !res.item) return res.reason ?? 'Purchase failed.';
    setWinner(getItem(res.item.defId));
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reel: ItemDef[] = useMemo(() => {
    if (!winner) return [];
    return buildReel(caseDef, winner, 34, Math.random);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const ITEM_W = 142; // 130 + gap 12
  const target = reel.length ? (reel.length - 5) * ITEM_W - 180 + (Math.random() * 80 - 40) : 0;

  useEffect(() => {
    if (fail || !winner) return;
    const dur = g.settings.reducedMotion ? 300 : 4200;
    const t0 = performance.now();
    let raf = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4); // quartic ease-out
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setOffset(target * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setPhase('reveal'), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, fail]);

  if (fail) {
    return (
      <ModalShell>
        <div className="empty-state">
          <div className="big">🚫</div>
          <div style={{ fontWeight: 800, color: '#ff9b9b' }}>Cannot open case</div>
          <p style={{ marginTop: 8 }}>{fail}</p>
          <button className="btn primary" style={{ marginTop: 14 }} onClick={onClose}>Back to shop</button>
        </div>
      </ModalShell>
    );
  }
  if (!winner) return <ModalShell><div className="empty-state"><div className="big">⏳</div>Loading…</div></ModalShell>;

  return (
    <ModalShell>
      <div className="row" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 26 }}>{caseDef.icon}</div>
        <div><b>{caseDef.name}</b><div className="tiny muted">Opening simulation… results are game-random, not real measurements.</div></div>
        <span className="spacer" />
        {phase !== 'spinning' && <button className="btn sm" onClick={onClose}>✕</button>}
      </div>

      {/* Reel */}
      <div className="reel-window">
        <div className="reel-marker" />
        <div className="reel-strip" style={{ transform: `translateX(${-offset}px)` }}>
          {reel.map((it, i) => (
            <div key={i} className={`reel-item r-${it.rarity}`}>
              <span className="icon">{it.icon}</span>
              <span className="name">{it.name}</span>
              <span className="rarity-tag" style={{ fontSize: 8 }}>{it.rarity}</span>
            </div>
          ))}
        </div>
      </div>

      {(phase === 'reveal' || phase === 'done') && winner && (
        <div key="reward" className={`glass-panel r-${winner.rarity}${winner.rarity === 'Mythic' || winner.rarity === 'Legendary' ? ' confetti-mythic' : ''}`}
          style={{ marginTop: 16, textAlign: 'center', borderColor: rarityColor(winner.rarity) }}>
          <div className="reward-hero">
            <span className="icon" style={{ cursor: 'pointer' }} title="Inspect" onClick={() => setDetail(winner)}>{winner.icon}</span>
            <span className="rarity-tag">{winner.rarity} {winner.type}</span>
            <h2 style={{ marginTop: 8 }}>{winner.name}</h2>
            <p className="muted tiny" style={{ margin: '6px auto 12px', maxWidth: 320 }}>{winner.blurb}</p>
            <div style={{ textAlign: 'left', maxWidth: 300, margin: '0 auto' }}>
              <StatRow label="Performance points" value={winner.perf} />
              <StatRow label="Tier" value={`${winner.tier}/6`} />
              <StatRow label="Estimated value" value={`${fmt(winner.value)} cr`} />
            </div>
            <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
              <button className="btn ice" onClick={() => setDetail(winner)}>🔍 Inspect stats</button>
              <button className="btn primary" onClick={() => { setPhase('done'); onClose(); }}>Add to inventory ✓</button>
              {phase === 'done' && null}
            </div>
            <div className="tiny muted" style={{ marginTop: 10 }}>The item is already in your inventory — keep opening or close.</div>
          </div>
        </div>
      )}
      {detail && <ItemDetailModal def={detail} onClose={() => setDetail(null)} />}
    </ModalShell>
  );
}

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(3,5,9,0.78)', backdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center', padding: 18 }}>
      <div className="glass-panel" style={{ width: 'min(680px, 96vw)' }}>{children}</div>
    </div>
  );
}
