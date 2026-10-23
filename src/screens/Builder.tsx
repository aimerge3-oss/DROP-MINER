import { useState } from 'react';
import { useGame, isEquipped, uidMapOf } from '../state/gameStore';
import { getItem } from '../data/items';
import { resolveBuild, buildReadiness, checkCompatibility, type SlotUnion } from '../engine/compatibility';
import { estimatePower, totalPower, coolingCapacity, rawPerformance } from '../engine/benchmark';
import { Panel, EmptyState, fmt, StatRow, Bar, rarityColor } from '../ui/components';
import type { Screen } from '../App';
import type { Build, ItemDef, GameState } from '../types';

const SLOTS: { key: SlotUnion; label: string; icon: string }[] = [
  { key: 'gpu', label: 'Graphics Card', icon: '🎛️' },
  { key: 'cpu', label: 'Processor', icon: '🧠' },
  { key: 'mobo', label: 'Motherboard', icon: '🟩' },
  { key: 'ram', label: 'Memory (up to 4)', icon: '📏' },
  { key: 'ssd', label: 'Storage', icon: '💾' },
  { key: 'psu', label: 'Power Supply', icon: '🔌' },
  { key: 'cooler', label: 'CPU Cooler', icon: '❄️' },
  { key: 'case', label: 'PC Case', icon: '📦' },
  { key: 'fan', label: 'Case Fans (optional)', icon: '🌀' },
];

export default function Builder({ go }: { go: (s: Screen) => void }) {
  const g = useGame();
  const build = g.builds.find((b) => b.id === g.activeBuildId) ?? null;
  const [slot, setSlot] = useState<SlotUnion>('gpu');
  const [newName, setNewName] = useState('');

  if (!build) {
    return (
      <>
        <div className="screen-title">PC Builder</div>
        <div className="screen-sub">Create a build profile, then install compatible parts from your inventory.</div>
        <Panel style={{ maxWidth: 520, margin: '0 auto' }}>
          <EmptyState icon="🛠️" title="No builds yet" sub="Each build is a saved PC you can tune and benchmark separately." />
          <div className="row" style={{ justifyContent: 'center' }}>
            <input placeholder="Build name (e.g. First Rig)" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={24} style={{ width: 230 }} />
            <button className="btn primary" onClick={() => { g.createBuild(newName || 'First Rig'); setNewName(''); }}>Create build</button>
          </div>
        </Panel>
      </>
    );
  }

  const uidMap = uidMapOf(g.inventory);
  const rb = resolveBuild(build, uidMap);
  const readiness = buildReadiness(rb);
  const power = estimatePower(rb, build.tune);
  const pTotal = totalPower(power);
  const cooling = coolingCapacity(rb, build.tune);
  const perf = rawPerformance(rb, build.tune);
  const heatPct = Math.min(100, (pTotal * 0.94 / Math.max(1, cooling)) * 100);

  const candidates = g.inventory
    .map((o) => ({ o, def: getItem(o.defId) }))
    .filter(({ def, o }) => {
      const wantType: Record<SlotUnion, string> = { gpu: 'GPU', cpu: 'CPU', mobo: 'Motherboard', ram: 'RAM', ssd: 'SSD', psu: 'PSU', cooler: 'Cooler', case: 'Case', fan: 'Fan' };
      return def.type === wantType[slot] && !isEquipped(g, o.uid);
    });

  return (
    <>
      <div className="screen-title">PC Builder</div>
      <div className="screen-sub row" style={{ gap: 8 }}>
        <select value={build.id} onChange={(e) => g.setActiveBuild(e.target.value)}>
          {g.builds.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button className="btn sm" onClick={() => { const n = prompt('Rename build:', build.name); if (n) g.renameBuild(build.id, n); }}>✏️ Rename</button>
        <button className="btn sm" onClick={() => g.createBuild(`Rig ${g.builds.length + 1}`)}>＋ New build</button>
        <button className="btn sm danger" onClick={() => { if (confirm(`Delete build "${build.name}"? Installed parts return to inventory.`)) g.deleteBuild(build.id); }}>🗑 Delete</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(260px, 340px) 1fr', alignItems: 'start' }}>
        {/* Virtual PC */}
        <Panel className="rgb-on">
          <h3 style={{ fontSize: 15, marginBottom: 10 }}>🖥️ {build.name}</h3>
          <VirtualPC rb={rb} ready={readiness.ready} />
          <div style={{ marginTop: 14 }}>
            <StatRow label="Status" value={readiness.ready ? '✅ Complete' : `Missing ${readiness.missing.length}`} />
            <StatRow label="Est. performance" value={`${Math.round(perf.gpuPts + perf.cpuPts)} pts`} />
            <StatRow label="Est. power draw" value={`${fmt(pTotal)} W`} hint={`PSU capacity: ${rb.psu?.psuWatts ?? 0} W`} />
            <StatRow label="Cooling balance" value={heatPct < 75 ? 'Healthy' : heatPct < 100 ? 'Warm' : 'Overwhelmed'} />
            <Bar pct={heatPct} hot={heatPct >= 85} />
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn ice sm" onClick={() => go('tune')}>🎚 Overclock & cooling</button>
              <button className="btn primary sm" disabled={!readiness.ready} onClick={() => go('bench')}>🏁 Benchmark</button>
            </div>
          </div>
        </Panel>

        {/* Slots */}
        <Panel>
          <h3 style={{ fontSize: 15, marginBottom: 10 }}>Install slots</h3>
          {SLOTS.map((s) => {
            const installed = installedDefs(build, s.key, g);
            const active = slot === s.key;
            return (
              <div key={s.key} style={{ marginBottom: 8 }}>
                <button className={`chip${active ? ' on' : ''}`} onClick={() => setSlot(s.key)} style={{ fontWeight: 800 }}>
                  {s.icon} {s.label}
                </button>
                <div className="row" style={{ marginLeft: 6, marginTop: 6 }}>
                  {installed.length === 0 && <span className="tiny muted">— empty —</span>}
                  {installed.map((def, i) => (
                    <span key={i} className="chip static" style={{ borderColor: rarityColor(def.rarity), color: rarityColor(def.rarity) }}>
                      {def.icon} {def.name}
                      <a style={{ marginLeft: 6, cursor: 'pointer' }} title="Remove"
                        onClick={() => {
                          if (s.key === 'ram') g.removeSlot(build.id, 'ram', build.slots.ram[i]);
                          else if (s.key === 'fan') g.removeSlot(build.id, 'fan', build.slots.fans[i]);
                          else g.removeSlot(build.id, s.key === 'case' ? 'case' : s.key);
                        }}>✕</a>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* Parts picker for selected slot */}
      <Panel className="section-gap">
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>
          {SLOTS.find((x) => x.key === slot)?.icon} Choose a {SLOTS.find((x) => x.key === slot)?.label} from inventory
        </h3>
        {candidates.length === 0 ? (
          <EmptyState icon="🧾" title="No eligible parts owned"
            sub={slot === 'ram' && rb.ram.length >= 4 ? 'All DIMM slots are full.' : 'Open cases in the shop to find more hardware.'}
            action={<button className="btn primary" onClick={() => go('shop')}>Go to Case Shop →</button>} />
        ) : (
          <div className="grid cols-4">
            {candidates.map(({ o, def }) => {
              const compat = checkCompatibility(def, slot, rb);
              return (
                <div key={o.uid} className={`item-card r-${def.rarity}`} style={{ opacity: compat.ok ? 1 : 0.55 }}>
                  <span className="icon">{def.icon}</span>
                  <div className="name">{def.name}</div>
                  <div className="meta"><span className="rarity-tag">{def.rarity}</span></div>
                  {!compat.ok && <div className="tiny" style={{ color: '#ffb1b1', marginTop: 6 }}>⚠ {compat.reason}</div>}
                  <button className="btn sm block" style={{ marginTop: 8 }} disabled={!compat.ok}
                    onClick={() => { const res = g.installItem(build.id, slot, o.uid); if (!res.ok && res.reason) g.notify(res.reason, 'error'); }}>
                    {compat.ok ? 'Install' : 'Incompatible'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </>
  );
}

function installedDefs(build: Build, slot: SlotUnion, g: GameState): ItemDef[] {
  const get = (uid: string | null) => { const o = g.inventory.find((i) => i.uid === uid); return o ? getItem(o.defId) : null; };
  switch (slot) {
    case 'ram': return build.slots.ram.map((u) => get(u)).filter(Boolean) as ItemDef[];
    case 'fan': return build.slots.fans.map((u) => get(u)).filter(Boolean) as ItemDef[];
    case 'case': return build.slots.caseUid ? [get(build.slots.caseUid)!].filter(Boolean) as ItemDef[] : [];
    default: { const u = (build.slots as unknown as Record<string, string | null>)[slot]; const d = u ? get(u) : null; return d ? [d] : []; }
  }
}

function VirtualPC({ rb, ready }: { rb: ReturnType<typeof resolveBuild>; ready: boolean }) {
  const rows: { label: string; def?: ItemDef }[] = [
    { label: 'GPU', def: rb.gpu },
    { label: 'CPU', def: rb.cpu },
    { label: 'Board', def: rb.mobo },
    { label: 'RAM', def: rb.ram[0] },
    { label: 'SSD', def: rb.ssd },
    { label: 'PSU', def: rb.psu },
    { label: 'Cooler', def: rb.cooler },
  ];
  return (
    <div className="pc-preview">
      <div className="glass-side" />
      {rows.map((r) => (
        <div key={r.label} className={`pc-slot${r.def ? ' filled' : ''}`} style={{ ['--rc' as string]: r.def ? rarityColor(r.def.rarity) : undefined }}>
          {r.def ? <span>{r.def.icon}</span> : <span style={{ opacity: 0.35 }}>▢</span>}
          <span style={{ fontWeight: 700 }}>{r.label}</span>
          <span className="spacer" />
          <span className="tiny mono" style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.def ? r.def.name : 'empty'}{r.label === 'RAM' && rb.ram.length > 1 ? ` ×${rb.ram.length}` : ''}
          </span>
        </div>
      ))}
      <div className="pc-slot filled" style={{ ['--rc' as string]: rb.pcCase ? rarityColor(rb.pcCase.rarity) : undefined }}>
        <span className="glow-fan" style={{ ['--rc' as string]: rb.fans[0] ? rarityColor(rb.fans[0].rarity) : 'var(--ice)' }} />
        <span>Case</span><span className="spacer" />
        <span className="tiny mono">{rb.pcCase?.name ?? 'open air'} {rb.fans.length > 0 && `+${rb.fans.length} fans`}</span>
      </div>
      {!ready && <div className="tiny muted" style={{ textAlign: 'center' }}>Chassis incomplete — fill every slot.</div>}
    </div>
  );
}
