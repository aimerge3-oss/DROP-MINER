import { useMemo, useState } from 'react';
import { useGame, isEquipped } from '../state/gameStore';
import { getItem } from '../data/items';
import { sellPrice } from '../engine/caseOpening';
import { Panel, ItemCard, ItemDetailModal, EmptyState, fmt, RARITY_ORDER } from '../ui/components';
import type { ComponentType, ItemDef } from '../types';

type SortKey = 'rarity' | 'value' | 'name' | 'newest';
const TYPES: (ComponentType | 'All')[] = ['All', 'GPU', 'CPU', 'Motherboard', 'RAM', 'SSD', 'PSU', 'Cooler', 'Fan', 'Case'];

export default function Inventory() {
  const g = useGame();
  const [type, setType] = useState<ComponentType | 'All'>('All');
  const [rarity, setRarity] = useState<string>('All');
  const [sort, setSort] = useState<SortKey>('rarity');
  const [detail, setDetail] = useState<{ def: ItemDef; uid: string } | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const list = g.inventory.map((o) => ({ o, def: getItem(o.defId) }))
      .filter(({ def }) => (type === 'All' || def.type === type) && (rarity === 'All' || def.rarity === rarity));
    list.sort((a, b) => {
      switch (sort) {
        case 'rarity': return b.def.tier - a.def.tier || b.def.value - a.def.value;
        case 'value': return b.def.value - a.def.value;
        case 'name': return a.def.name.localeCompare(b.def.name);
        case 'newest': return b.o.acquiredAt - a.o.acquiredAt;
      }
    });
    return list;
  }, [g.inventory, type, rarity, sort]);

  // duplicate detection for "sell junk" helper
  const dupJunk = useMemo(() => {
    const seen = new Map<string, number>();
    rows.forEach(({ o, def }) => {
      if (def.tier <= 2 && !isEquipped(g, o.uid)) seen.set(def.id, (seen.get(def.id) ?? 0) + 1);
    });
    return rows.filter(({ o, def }) => def.tier <= 2 && !isEquipped(g, o.uid) && (seen.get(def.id) ?? 0) > 1).map(({ o }) => o.uid);
  }, [rows, g]);

  const totalValue = rows.reduce((a, { def }) => a + def.value, 0);
  const selValue = [...selected].reduce((a, u) => { const o = g.inventory.find((i) => i.uid === u); return o ? a + sellPrice(getItem(o.defId)) : a; }, 0);

  return (
    <>
      <div className="screen-title">Hardware Inventory</div>
      <div className="screen-sub">{g.inventory.length} parts · catalog value {fmt(totalValue)} cr. Duplicates are fine — sell what you don't need.</div>

      <Panel style={{ marginBottom: 16 }}>
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="tiny muted">Type</span><span className="spacer" />
          <button className="btn sm" onClick={() => setSort(sort === 'rarity' ? 'value' : sort === 'value' ? 'name' : sort === 'name' ? 'newest' : 'rarity')}>Sort: {sort} ↻</button>
        </div>
        <div className="row" style={{ gap: 6 }}>
          {TYPES.map((t) => <button key={t} className={`chip${type === t ? ' on' : ''}`} onClick={() => setType(t)}>{t}</button>)}
        </div>
        <div className="row" style={{ gap: 6, marginTop: 8 }}>
          {['All', ...RARITY_ORDER].map((r) => <button key={r} className={`chip${rarity === r ? ' on' : ''}`} onClick={() => setRarity(r)}>{r}</button>)}
          <span className="spacer" />
          {dupJunk.length > 1 && !selectMode && (
            <button className="btn sm gold" onClick={() => { setSelected(new Set(dupJunk)); setSelectMode(true); }}>
              🧹 Select {dupJunk.length} duplicate low-tier parts
            </button>
          )}
          <button className={`btn sm${selectMode ? ' danger' : ''}`} onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); }}>{selectMode ? 'Exit select' : '☑ Select'}</button>
        </div>
      </Panel>

      {rows.length === 0 ? (
        <EmptyState icon="🗄️" title="Nothing matches" sub="Try different filters — or open a case in the shop." />
      ) : (
        <div className="grid cols-4">
          {rows.map(({ o, def }) => {
            const eq = isEquipped(g, o.uid);
            const isSel = selected.has(o.uid);
            return (
              <div key={o.uid} style={{ outline: isSel ? '2px solid var(--lime)' : undefined, borderRadius: 16 }}
                onClick={() => selectMode && !eq ? setSelected((s) => { const n = new Set(s); if (n.has(o.uid)) n.delete(o.uid); else n.add(o.uid); return n; }) : undefined}>
                <ItemCard def={def} equipped={eq} onClick={selectMode ? undefined : () => setDetail({ def, uid: o.uid })} />
              </div>
            );
          })}
        </div>
      )}

      {selectMode && selected.size > 0 && (
        <div className="glass-panel" style={{ position: 'fixed', bottom: 78, left: '50%', transform: 'translateX(-50%)', zIndex: 60, padding: '10px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <b>{selected.size} selected</b>
          <span className="muted tiny">≈ {fmt(selValue)} cr</span>
          <button className="btn primary sm" onClick={() => { g.sellMany([...selected]); setSelected(new Set()); setSelectMode(false); }}>Sell selected</button>
        </div>
      )}

      {detail && (
        <ItemDetailModal def={detail.def} onClose={() => setDetail(null)}
          extra={
            <div className="row" style={{ marginTop: 12 }}>
              {isEquipped(g, detail.uid)
                ? <span className="chip static" style={{ color: 'var(--lime)' }}>Installed in a build</span>
                : <button className="btn danger block" onClick={() => { if (g.sellItem(detail.uid)) setDetail(null); }}>
                    Sell for {fmt(sellPrice(detail.def))} cr
                  </button>}
            </div>
          } />
      )}
    </>
  );
}
