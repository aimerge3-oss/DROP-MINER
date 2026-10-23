import { useGame, uidMapOf } from '../state/gameStore';
import { resolveBuild, buildReadiness, supportsOverclock } from '../engine/compatibility';
import { predict, estimatePower, totalPower, coolingCapacity } from '../engine/benchmark';
import { BENCHMARKS } from '../data/benchmarks';
import { Panel, StatRow, Bar, EmptyState, fmt } from '../ui/components';
import type { TuneSettings } from '../types';

const SLIDERS: { key: keyof TuneSettings; label: string; min: number; max: number; step: number; unit: string; desc: string }[] = [
  { key: 'cpuOC', label: 'CPU overclock', min: -10, max: 25, step: 1, unit: '%', desc: '+% clock speed. More FPS, more heat & watts.' },
  { key: 'gpuOC', label: 'GPU overclock', min: -10, max: 25, step: 1, unit: '%', desc: '+% core clock. Biggest FPS lever, hottest chip.' },
  { key: 'memOC', label: 'Memory tuning', min: 0, max: 30, step: 1, unit: '%', desc: 'RAM/GPU memory frequency boost. Past +15% risks instability.' },
  { key: 'powerLimit', label: 'Power limit', min: 60, max: 130, step: 5, unit: '%', desc: 'Cap or boost wattage. Lower = cooler but slower.' },
  { key: 'fanAggression', label: 'Fan curve', min: 0, max: 100, step: 5, unit: '%', desc: 'Silent (0) → Max blast (100). Raises cooling capacity.' },
  { key: 'undervolt', label: 'Undervolt', min: 0, max: 30, step: 1, unit: 'pt', desc: 'Trades a little peak performance for much less heat.' },
];

export default function Tuning() {
  const g = useGame();
  const build = g.builds.find((b) => b.id === g.activeBuildId) ?? null;
  if (!build) return <EmptyState icon="🎚️" title="No active build" sub="Create a build first." />;
  const rb = resolveBuild(build, uidMapOf(g.inventory));
  const ready = buildReadiness(rb).ready;
  const ocAllowed = supportsOverclock(rb);
  const pred = ready ? predict(build, BENCHMARKS[1], uidMapOf(g.inventory)) : null;
  const power = estimatePower(rb, build.tune);
  const cooling = coolingCapacity(rb, build.tune);
  const heatRatio = Math.min(100, (totalPower(power) * 0.94 / Math.max(1, cooling)) * 100);

  const warn = !ocAllowed && (build.tune.cpuOC > 0 || build.tune.gpuOC > 0 || build.tune.memOC > 0);

  return (
    <>
      <div className="screen-title">Overclocking & Cooling</div>
      <div className="screen-sub">Tune <b>{build.name}</b>. Everything here is simulated — push too far and the benchmark will throttle, destabilize, or crash.</div>

      {!ready && <Panel style={{ marginBottom: 14 }}><span style={{ color: 'var(--gold)' }}>⚠ Build incomplete — finish installing parts in the Builder to see live predictions.</span></Panel>}
      {!ocAllowed && (
        <Panel style={{ marginBottom: 14 }}>
          <span className="chip static" style={{ color: 'var(--ice)', borderColor: 'var(--ice)' }}>ℹ Locked board</span>
          <p className="tiny muted" style={{ marginTop: 8 }}>Your motherboard ({rb.mobo?.name ?? 'none installed'}) does not support positive overclocks. Negative offsets (underclocking) still work. Upgrade to an OC-capable board like Hexa Nexus X670/Z790 or better.</p>
        </Panel>
      )}
      {warn && <Panel style={{ marginBottom: 14 }}><span style={{ color: '#ffb1b1' }}>⚠ Positive OC values are being ignored by this motherboard.</span></Panel>}

      <div className="grid cols-2">
        <Panel>
          <h3 style={{ fontSize: 15 }}>🎛 Tuning sliders</h3>
          {SLIDERS.map((s) => (
            <div key={s.key} style={{ marginTop: 16 }}>
              <div className="row tiny"><b>{s.label}</b><span className="spacer" /><span className="mono" style={{ color: s.key === 'fanAggression' ? 'var(--ice)' : 'var(--lime)' }}>{build.tune[s.key]}{s.unit}</span></div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={build.tune[s.key]}
                onChange={(e) => g.setTune(build.id, { [s.key]: Number(e.target.value) } as Partial<TuneSettings>)} />
              <div className="tiny muted">{s.desc}</div>
            </div>
          ))}
          <div className="row" style={{ marginTop: 18 }}>
            <button className="btn" onClick={() => g.resetTune(build.id)}>↺ Safe defaults</button>
            <span className="spacer" />
            <button className="btn sm danger" title="Push everything to the edge"
              onClick={() => g.setTune(build.id, { cpuOC: 25, gpuOC: 25, memOC: 30, powerLimit: 130, fanAggression: 100, undervolt: 0 })}>
              🌋 YOLO preset
            </button>
          </div>
        </Panel>

        <Panel>
          <h3 style={{ fontSize: 15 }}>📊 Live simulation (Neon Rush)</h3>
          {pred?.ready ? (
            <>
              <StatRow label="Predicted avg FPS" value={<b style={{ color: 'var(--lime)' }}>{pred.avgFpsEst}</b>} />
              <StatRow label="Predicted score" value={fmt(pred.scoreEst)} />
              <StatRow label="Predicted temp" value={<span style={{ color: pred.tempEst >= 88 ? '#ff9b9b' : pred.tempEst >= 80 ? 'var(--gold)' : 'var(--ice)' }}>{pred.tempEst}°C {pred.throttled && '🔥 throttling'}</span>} />
              <StatRow label="Power draw" value={`${fmt(pred.powerEst)} W`} hint={`Cooling capacity ${cooling}`} />
              <StatRow label="Stability" value={pred.stable ? '✅ Stable' : '❌ Unstable'} />
              <div style={{ margin: '10px 0 4px' }} className="tiny muted">Thermal load vs cooling</div>
              <Bar pct={heatRatio} hot={heatRatio >= 85} />
              {pred.tempEst >= 85 && <p className="tiny" style={{ color: '#ffb1b1', marginTop: 10 }}>💡 Too hot: raise fan curve, add case fans/cooler tier, lower clocks, or use undervolt.</p>}
              {!pred.stable && pred.tempEst < 85 && <p className="tiny" style={{ color: 'var(--gold)', marginTop: 10 }}>💡 Memory/clock instability detected — back off OC values slightly.</p>}
            </>
          ) : (
            <EmptyState icon="🧮" title="Nothing to simulate" sub="Complete the build to preview results." />
          )}
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn ice sm" disabled={!ready} onClick={() => g.notify('Cooling hardware note: better coolers, cases with more fan slots, and aggressive fan curves all raise capacity.', 'info')}>❄️ Cooling tips</button>
          </div>
        </Panel>
      </div>
    </>
  );
}
