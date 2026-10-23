import { useState } from 'react';
import { useGame } from '../state/gameStore';
import { CASES } from '../data/cases';
import { getItem } from '../data/items';
import { Panel, fmt, ItemCard, EmptyState } from '../ui/components';
import type { CaseDef, ItemDef } from '../types';

export default function CaseShop({ onOpen }: { onOpen: (caseId: string) => void }) {
  const g = useGame();
  const [preview, setPreview] = useState<string | null>(null);
  const pv = CASES.find((c) => c.id === preview);

  return (
    <>
      <div className="screen-title">Case Shop</div>
      <div className="screen-sub">Crates of simulated silicon. Tap a case to inspect its drop table before spending credits.</div>

      <div className="grid cols-2">
        {CASES.map((c: CaseDef) => {
          const locked = (c.requiresLevel ?? 1) > g.stats.level;
          const affordable = g.credits >= c.price;
          return (
            <Panel key={c.id} style={{ borderColor: locked ? undefined : `${c.accent}55` }}>
              <div className={`row${locked ? ' locked-state' : ''}`} data-lock={locked ? `🔒 Requires player level ${c.requiresLevel}` : undefined}>
                <div style={{ fontSize: 40 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</div>
                  <div className="tiny muted">{c.theme} · {c.drops.length} possible drops</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 800 }}>{fmt(c.price)} cr</div>
                </div>
              </div>
              <p className="muted tiny" style={{ margin: '10px 0' }}>{c.blurb}</p>
              <div className="row">
                <button className="btn sm" onClick={() => setPreview(c.id)}>👁 Drop table</button>
                <span className="spacer" />
                <button className="btn primary" disabled={locked || !affordable}
                  title={!affordable ? 'Not enough credits' : ''}
                  onClick={() => onOpen(c.id)}>
                  {!affordable && !locked ? '💸 Need ' + fmt(c.price - g.credits) + ' more' : `Open for ${fmt(c.price)} cr`}
                </button>
              </div>
            </Panel>
          );
        })}
      </div>

      {pv && (
        <div onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(3,5,9,0.72)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: 20 }}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: 'min(720px, 94vw)', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: 4 }}>{pv.icon} {pv.name} — drop table</h3>
            <p className="tiny muted" style={{ marginBottom: 14 }}>Weights below determine odds. Rarity tiers: Common → Mythic.</p>
            <DropTable caseDef={pv} />
            <div className="row" style={{ marginTop: 14, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setPreview(null)}>Close</button>
              <button className="btn primary" disabled={g.credits < pv.price || (pv.requiresLevel ?? 1) > g.stats.level}
                onClick={() => { setPreview(null); onOpen(pv.id); }}>Open for {fmt(pv.price)} cr</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DropTable({ caseDef }: { caseDef: CaseDef }) {
  const total = caseDef.drops.reduce((a, d) => a + d.weight, 0);
  const items = [...caseDef.drops]
    .map((d) => ({ def: getItem(d.defId), pct: (d.weight / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);
  if (items.length === 0) return <EmptyState icon="❔" title="No drops configured" />;
  return (
    <div className="grid cols-4">
      {items.map(({ def, pct }) => (
        <ItemCard key={def.id} def={def} footer={<div className="tiny mono" style={{ marginTop: 6, color: 'var(--text-dim)' }}>{pct < 0.1 ? '<0.1%' : pct.toFixed(1)}% chance</div>} />
      ))}
    </div>
  );
}

export function raritySummary(defs: ItemDef[]): string {
  const best = defs.slice().sort((a, b) => b.tier - a.tier)[0];
  return best ? best.rarity : '—';
}
