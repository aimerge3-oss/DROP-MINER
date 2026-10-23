import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ItemDef, Rarity } from '../types';
import { sellPrice } from '../engine/caseOpening';

export const RARITY_ORDER: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

export function rarityColor(r: Rarity): string {
  return { Common: '#8b9bb4', Uncommon: '#4ade80', Rare: '#38bdf8', Epic: '#a78bfa', Legendary: '#fbbf24', Mythic: '#f472b6' }[r];
}

export function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export function Panel({ children, style, className }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return <div className={`glass-panel${className ? ' ' + className : ''}`} style={style}>{children}</div>;
}

export function StatRow({ label, value, hint }: { label: ReactNode; value: ReactNode; hint?: string }) {
  return (
    <div className="stat-row" title={hint}>
      <span className="muted">{label}</span>
      <b>{value}</b>
    </div>
  );
}

export function Bar({ pct, hot }: { pct: number; hot?: boolean }) {
  return <div className={`bar${hot ? ' hot' : ''}`}><i style={{ width: `${Math.max(2, Math.min(100, pct))}%` }} /></div>;
}

export function EmptyState({ icon, title, sub, action }: { icon: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <div className="big">{icon}</div>
      <div style={{ fontWeight: 750, fontSize: 16, color: 'var(--text)' }}>{title}</div>
      {sub && <div style={{ marginTop: 6, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>{sub}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

/** Compact item card used in inventory/shop results. */
export function ItemCard({ def, equipped, onClick, footer }: {
  def: ItemDef; equipped?: boolean; onClick?: () => void; footer?: ReactNode;
}) {
  return (
    <div
      className={`item-card r-${def.rarity}${equipped ? ' equipped' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      <span className="icon">{def.icon}</span>
      <div className="name">{def.name}</div>
      <div className="meta">
        <span className="rarity-tag">{def.rarity}</span>
        <span>{def.type}</span>
      </div>
      <div className="meta mono tiny">
        <span>⚡ {def.perf} pts</span>
        <span>💰 {fmt(sellPrice(def))} cr sell</span>
      </div>
      {footer}
    </div>
  );
}

/** Detail modal for inspecting a component. */
export function ItemDetailModal({ def, onClose, extra }: { def: ItemDef; onClose: () => void; extra?: ReactNode }) {
  const rows: [string, ReactNode][] = [['Type', def.type], ['Rarity', def.rarity], ['Tier', `${def.tier}/6`],
    ['Market value', `${fmt(def.value)} cr`], ['Sell price', `${fmt(sellPrice(def))} cr`]];
  if (def.vramGB) rows.push(['VRAM', `${def.vramGB} GB`]);
  if (def.cores) rows.push(['Cores / Threads', `${def.cores}C / ${def.threads}T`]);
  if (def.socket) rows.push(['Socket', def.socket]);
  if (def.formFactor) rows.push(['Form factor', def.formFactor]);
  if (def.supportsOC !== undefined) rows.push(['Overclocking', def.supportsOC ? 'Supported ✅' : 'Locked ❌']);
  if (def.ramGB) rows.push(['Capacity / Speed', `${def.ramGB} GB · ${def.ramSpeed} MT/s`]);
  if (def.storageGB) rows.push(['Capacity / Read', `${def.storageGB} GB · ${fmt(def.storageSpeed ?? 0)} MB/s`]);
  if (def.psuWatts) rows.push(['Capacity', `${def.psuWatts} W`]);
  if (def.coolingPower) rows.push(['Cooling capacity', `${def.coolingPower} units`]);
  if (def.caseForm) rows.push(['Supports up to', def.caseForm]);
  if (def.maxCoolerMM) rows.push(['Cooler clearance', `${def.maxCoolerMM} mm`]);
  if (def.fanSlots) rows.push(['Fan slots', def.fanSlots]);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(3,5,9,0.7)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div className={`glass-panel r-${def.rarity}`} onClick={(e) => e.stopPropagation()} style={{ width: 'min(420px, 92vw)', borderColor: rarityColor(def.rarity) }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 52 }}>{def.icon}</div>
          <h3 style={{ fontSize: 18 }}>{def.name}</h3>
          <span className="rarity-tag">{def.rarity}</span>
          <p className="muted tiny" style={{ marginTop: 8 }}>{def.blurb}</p>
        </div>
        {rows.map(([k, v]) => <StatRow key={k} label={k} value={v} />)}
        {extra}
        <div style={{ marginTop: 14 }} className="row">
          <span className="spacer" />
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/** Simple tab switcher */
export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (t: T) => void }) {
  return (
    <div className="row" style={{ marginBottom: 14 }}>
      {tabs.map((t) => (
        <button key={t.id} className={`chip${value === t.id ? ' on' : ''}`} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  );
}

/** Copy-to-clipboard chip with feedback. */
export function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="chip static mono" title="Copy Player ID" onClick={async () => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
      }
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    }}>
      {text} {copied ? '✅' : '📋'}
    </button>
  );
}
