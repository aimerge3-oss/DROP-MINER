import type { ItemDef } from '../types';

// ─── DROP MINER hardware catalog (original fictional branding) ──────────────
// Brands: Nyx (GPU), Coreforge (CPU), Hexa (motherboards), Voltcore (PSU),
// Cryoform (cooling), Aeroflux (fans), Datavault (SSD), DRAMworks (RAM),
// Ironbox (cases). All stats are simulated game values.

export const ITEMS: ItemDef[] = [
  // ── GPUs ──────────────────────────────────────────────────────────────
  { id: 'gpu_nyx_g160', name: 'Nyx GTX-160', type: 'GPU', rarity: 'Common', tier: 1, value: 90, icon: '🎛️', accent: '#8b9bb4', blurb: 'Entry-level display adapter. Handles light workloads.', perf: 120, vramGB: 2, memBandwidth: 100 },
  { id: 'gpu_nyx_g310', name: 'Nyx GX-310', type: 'GPU', rarity: 'Common', tier: 1, value: 130, icon: '🎛️', accent: '#8b9bb4', blurb: 'Budget card with modest VRAM.', perf: 180, vramGB: 3, memBandwidth: 130 },
  { id: 'gpu_nyx_r550', name: 'Nyx RX-550', type: 'GPU', rarity: 'Uncommon', tier: 2, value: 260, icon: '🖥️', accent: '#4ade80', blurb: 'Solid 1080p-class performer.', perf: 320, vramGB: 4, memBandwidth: 180 },
  { id: 'gpu_nyx_r760s', name: 'Nyx RX-760S', type: 'GPU', rarity: 'Uncommon', tier: 2, value: 340, icon: '🖥️', accent: '#4ade80', blurb: 'Efficient mid-range with good cooling design.', perf: 430, vramGB: 6, memBandwidth: 220 },
  { id: 'gpu_nyx_t4070', name: 'Nyx Titan T4-070', type: 'GPU', rarity: 'Rare', tier: 3, value: 700, icon: '⚡', accent: '#38bdf8', blurb: 'High-frame-rate champion for demanding scenes.', perf: 640, vramGB: 8, memBandwidth: 320 },
  { id: 'gpu_nyx_t4080', name: 'Nyx Titan T4-080', type: 'GPU', rarity: 'Rare', tier: 3, value: 950, icon: '⚡', accent: '#38bdf8', blurb: 'The T4 series refined. Runs hot when pushed.', perf: 780, vramGB: 10, memBandwidth: 380 },
  { id: 'gpu_nyx_v5090', name: 'Nyx Vortex V5-090', type: 'GPU', rarity: 'Epic', tier: 4, value: 1800, icon: '🌀', accent: '#a78bfa', blurb: 'Vortex-class compute monster with triple fans.', perf: 1050, vramGB: 14, memBandwidth: 520 },
  { id: 'gpu_nyx_v5180', name: 'Nyx Vortex V5-180 Ti', type: 'GPU', rarity: 'Epic', tier: 4, value: 2400, icon: '🌀', accent: '#a78bfa', blurb: 'Enthusiast flagship. Hungry for watts.', perf: 1280, vramGB: 16, memBandwidth: 620 },
  { id: 'gpu_nyx_p70', name: 'Nyx Photon P70', type: 'GPU', rarity: 'Legendary', tier: 5, value: 4200, icon: '💠', accent: '#fbbf24', blurb: 'Photon architecture. Benchmark royalty.', perf: 1650, vramGB: 20, memBandwidth: 800 },
  { id: 'gpu_nyx_p90x', name: 'Nyx Photon P90X', type: 'GPU', rarity: 'Legendary', tier: 5, value: 5600, icon: '💠', accent: '#fbbf24', blurb: 'The definitive 4K-class accelerator.', perf: 1950, vramGB: 24, memBandwidth: 950 },
  { id: 'gpu_nyx_singularity', name: 'Nyx Singularity Ω', type: 'GPU', rarity: 'Mythic', tier: 6, value: 12000, icon: '🌌', accent: '#f472b6', blurb: 'One-of-a-kind silicon legend. Pure frame force.', perf: 2600, vramGB: 32, memBandwidth: 1300 },

  // ── CPUs ──────────────────────────────────────────────────────────────
  { id: 'cpu_cf_q240', name: 'Coreforge Quad Q240', type: 'CPU', rarity: 'Common', tier: 1, value: 80, icon: '🧠', accent: '#8b9bb4', blurb: 'Four honest cores for everyday tasks.', perf: 100, cores: 4, threads: 4, socket: 'LGA-1700c' },
  { id: 'cpu_cf_q460', name: 'Coreforge Quad Q460', type: 'CPU', rarity: 'Common', tier: 1, value: 120, icon: '🧠', accent: '#8b9bb4', blurb: 'A budget chip that tries its best.', perf: 150, cores: 4, threads: 8, socket: 'LGA-1700c' },
  { id: 'cpu_cf_s630', name: 'Coreforge Stride S6-30', type: 'CPU', rarity: 'Uncommon', tier: 2, value: 250, icon: '🧩', accent: '#4ade80', blurb: 'Six performance cores, dependable clocks.', perf: 260, cores: 6, threads: 12, socket: 'AM5x' },
  { id: 'cpu_cf_s660', name: 'Coreforge Stride S6-60X', type: 'CPU', rarity: 'Uncommon', tier: 2, value: 360, icon: '🧩', accent: '#4ade80', blurb: 'Overclock-friendly mid-range stride.', perf: 340, cores: 6, threads: 12, socket: 'AM5x' },
  { id: 'cpu_cf_e870', name: 'Coreforge Ember E8-70', type: 'CPU', rarity: 'Rare', tier: 3, value: 650, icon: '🔥', accent: '#38bdf8', blurb: 'Eight big cores. Runs warm, hits hard.', perf: 520, cores: 8, threads: 16, socket: 'LGA-1700c' },
  { id: 'cpu_cf_e890k', name: 'Coreforge Ember E8-90K', type: 'CPU', rarity: 'Rare', tier: 3, value: 880, icon: '🔥', accent: '#38bdf8', blurb: 'Unlocked multiplier, thirsty appetite.', perf: 640, cores: 8, threads: 16, socket: 'LGA-1700c' },
  { id: 'cpu_cf_t1200', name: 'Coreforge Tempest T12-00', type: 'CPU', rarity: 'Epic', tier: 4, value: 1600, icon: '🌪️', accent: '#a78bfa', blurb: 'Twelve cores of storm-grade throughput.', perf: 900, cores: 12, threads: 24, socket: 'AM5x' },
  { id: 'cpu_cf_t1600x', name: 'Coreforge Tempest T16-00X', type: 'CPU', rarity: 'Epic', tier: 4, value: 2200, icon: '🌪️', accent: '#a78bfa', blurb: 'Hexadeca-core behemoth for streamers.', perf: 1100, cores: 16, threads: 32, socket: 'TRX-5000' },
  { id: 'cpu_cf_a9000', name: 'Coreforge Aurora A9-9000', type: 'CPU', rarity: 'Legendary', tier: 5, value: 3800, icon: '☀️', accent: '#fbbf24', blurb: 'Aurora-class clocks out of the box.', perf: 1450, cores: 12, threads: 24, socket: 'AM5x' },
  { id: 'cpu_cf_a9000x', name: 'Coreforge Aurora A9-9000X', type: 'CPU', rarity: 'Legendary', tier: 5, value: 5000, icon: '☀️', accent: '#fbbf24', blurb: 'The X-factor: binned golden silicon.', perf: 1700, cores: 16, threads: 32, socket: 'AM5x' },
  { id: 'cpu_cf_singularity', name: 'Coreforge Monolith ∞', type: 'CPU', rarity: 'Mythic', tier: 6, value: 11000, icon: '🗿', accent: '#f472b6', blurb: 'A computational monolith. Temperature is a suggestion.', perf: 2300, cores: 24, threads: 48, socket: 'TRX-5000' },

  // ── Motherboards ──────────────────────────────────────────────────────
  { id: 'mobo_hex_a520', name: 'Hexa Foundation A520', type: 'Motherboard', rarity: 'Common', tier: 1, value: 70, icon: '🟩', accent: '#8b9bb4', blurb: 'Basic AM5x board. No OC support.', socket: 'AM5x', formFactor: 'mATX', supportsOC: false, perf: 20 },
  { id: 'mobo_hex_w660', name: 'Hexa Workhorse W660', type: 'Motherboard', rarity: 'Common', tier: 1, value: 95, icon: '🟩', accent: '#8b9bb4', blurb: 'Dependable LGA-1700c board.', socket: 'LGA-1700c', formFactor: 'ATX', supportsOC: false, perf: 22 },
  { id: 'mobo_hex_b760', name: 'Hexa Bridge B760', type: 'Motherboard', rarity: 'Uncommon', tier: 2, value: 180, icon: '🟢', accent: '#4ade80', blurb: 'Better VRMs and dual M.2 slots.', socket: 'LGA-1700c', formFactor: 'ATX', supportsOC: false, perf: 30 },
  { id: 'mobo_hex_x670', name: 'Hexa Nexus X670', type: 'Motherboard', rarity: 'Rare', tier: 3, value: 420, icon: '🔷', accent: '#38bdf8', blurb: 'AM5x enthusiast board with OC support.', socket: 'AM5x', formFactor: 'ATX', supportsOC: true, perf: 45 },
  { id: 'mobo_hex_z790', name: 'Hexa Nexus Z790', type: 'Motherboard', rarity: 'Rare', tier: 3, value: 480, icon: '🔷', accent: '#38bdf8', blurb: 'LGA-1700c flagship. Overclock ready.', socket: 'LGA-1700c', formFactor: 'ATX', supportsOC: true, perf: 48 },
  { id: 'mobo_hex_x880e', name: 'Hexa Halo X880E', type: 'Motherboard', rarity: 'Epic', tier: 4, value: 950, icon: '💜', accent: '#a78bfa', blurb: 'Premium power delivery for extreme tuning.', socket: 'AM5x', formFactor: 'ATX', supportsOC: true, perf: 70 },
  { id: 'mobo_hex_trx5', name: 'Hexa Titan TRX5', type: 'Motherboard', rarity: 'Legendary', tier: 5, value: 1900, icon: '👑', accent: '#fbbf24', blurb: 'HEDT platform for monolith-class CPUs.', socket: 'TRX-5000', formFactor: 'E-ATX', supportsOC: true, perf: 100 },
  { id: 'mobo_hex_void', name: 'Hexa Void Circuit', type: 'Motherboard', rarity: 'Mythic', tier: 6, value: 4500, icon: '🕳️', accent: '#f472b6', blurb: 'Experimental board. Whispers say it overclocks itself.', socket: 'TRX-5000', formFactor: 'E-ATX', supportsOC: true, perf: 140 },

  // ── RAM ───────────────────────────────────────────────────────────────
  { id: 'ram_dw8_2666', name: 'DRAMworks 8GB DDR4-2666', type: 'RAM', rarity: 'Common', tier: 1, value: 45, icon: '📏', accent: '#8b9bb4', blurb: 'A single honest stick.', ramGB: 8, ramSpeed: 2666, perf: 15 },
  { id: 'ram_dw16_3200', name: 'DRAMworks 16GB DDR4-3200', type: 'RAM', rarity: 'Uncommon', tier: 2, value: 110, icon: '📏', accent: '#4ade80', blurb: 'The sweet-spot kit stick.', ramGB: 16, ramSpeed: 3200, perf: 28 },
  { id: 'ram_dw16_6000', name: 'DRAMworks 16GB DDR5-6000', type: 'RAM', rarity: 'Rare', tier: 3, value: 240, icon: '📐', accent: '#38bdf8', blurb: 'DDR5 latency-crusher.', ramGB: 16, ramSpeed: 6000, perf: 46 },
  { id: 'ram_dw32_6400', name: 'DRAMworks 32GB DDR5-6400', type: 'RAM', rarity: 'Epic', tier: 4, value: 520, icon: '📐', accent: '#a78bfa', blurb: 'Big capacity, bigger clocks.', ramGB: 32, ramSpeed: 6400, perf: 70 },
  { id: 'ram_dw32_8000', name: 'DRAMworks Neon 32GB DDR5-8000', type: 'RAM', rarity: 'Legendary', tier: 5, value: 980, icon: '✨', accent: '#fbbf24', blurb: 'Neon-lit silicon that refuses to slow down.', ramGB: 32, ramSpeed: 8000, perf: 100 },
  { id: 'ram_dw64_quantum', name: 'DRAMworks Quantum 64GB', type: 'RAM', rarity: 'Mythic', tier: 6, value: 2600, icon: '⚛️', accent: '#f472b6', blurb: 'Quantum-stacked modules. Rated beyond the scale.', ramGB: 64, ramSpeed: 9600, perf: 150 },

  // ── SSDs ──────────────────────────────────────────────────────────────
  { id: 'ssd_dv256_sata', name: 'Datavault 256GB SATA', type: 'SSD', rarity: 'Common', tier: 1, value: 40, icon: '💾', accent: '#8b9bb4', blurb: 'Slow but sincere.', storageGB: 256, storageSpeed: 520, perf: 10 },
  { id: 'ssd_dv512_nvme', name: 'Datavault 512GB NVMe', type: 'SSD', rarity: 'Uncommon', tier: 2, value: 95, icon: '💾', accent: '#4ade80', blurb: 'Snappy Gen3 drive.', storageGB: 512, storageSpeed: 2400, perf: 22 },
  { id: 'ssd_dv1t_gen4', name: 'Datavault 1TB Gen4', type: 'SSD', rarity: 'Rare', tier: 3, value: 210, icon: '🗄️', accent: '#38bdf8', blurb: 'Gen4 speed for fast scene loads.', storageGB: 1000, storageSpeed: 5200, perf: 36 },
  { id: 'ssd_dv2t_gen5', name: 'Datavault 2TB Gen5', type: 'SSD', rarity: 'Epic', tier: 4, value: 460, icon: '🗄️', accent: '#a78bfa', blurb: 'Absurd bandwidth. Needs airflow.', storageGB: 2000, storageSpeed: 10000, perf: 55 },
  { id: 'ssd_dv4t_photon', name: 'Datavault 4TB Photonic', type: 'SSD', rarity: 'Legendary', tier: 5, value: 900, icon: '🔆', accent: '#fbbf24', blurb: 'Optical-linked storage array.', storageGB: 4000, storageSpeed: 14000, perf: 80 },
  { id: 'ssd_dv8t_void', name: 'Datavault 8TB Void Drive', type: 'SSD', rarity: 'Mythic', tier: 6, value: 2400, icon: '🌑', accent: '#f472b6', blurb: 'Stores data in folded space.', storageGB: 8000, storageSpeed: 20000, perf: 120 },

  // ── PSUs ──────────────────────────────────────────────────────────────
  { id: 'psu_vc400', name: 'Voltcore 400W Bronze', type: 'PSU', rarity: 'Common', tier: 1, value: 50, icon: '🔌', accent: '#8b9bb4', blurb: 'It powers things. Mostly.', psuWatts: 400, perf: 8 },
  { id: 'psu_vc550', name: 'Voltcore 550W Silver', type: 'PSU', rarity: 'Common', tier: 1, value: 75, icon: '🔌', accent: '#8b9bb4', blurb: 'Reliable budget wattage.', psuWatts: 550, perf: 10 },
  { id: 'psu_vc750g', name: 'Voltcore 750W Gold', type: 'PSU', rarity: 'Uncommon', tier: 2, value: 140, icon: '🔋', accent: '#4ade80', blurb: 'Efficient mid-range staple.', psuWatts: 750, perf: 14 },
  { id: 'psu_vc850pg', name: 'Voltcore 850W Platinum', type: 'PSU', rarity: 'Rare', tier: 3, value: 260, icon: '🔋', accent: '#38bdf8', blurb: 'Platinum efficiency, quiet coils.', psuWatts: 850, perf: 18 },
  { id: 'psu_vc1000t', name: 'Voltcore 1000W Titanium', type: 'PSU', rarity: 'Epic', tier: 4, value: 480, icon: '⚙️', accent: '#a78bfa', blurb: 'Titanium-grade headroom.', psuWatts: 1000, perf: 24 },
  { id: 'psu_vc1300t', name: 'Voltcore 1300W Titanium Pro', type: 'PSU', rarity: 'Legendary', tier: 5, value: 850, icon: '⚙️', accent: '#fbbf24', blurb: 'Feed a monolith without blinking.', psuWatts: 1300, perf: 30 },
  { id: 'psu_vc1600reactor', name: 'Voltcore 1600W Reactor', type: 'PSU', rarity: 'Mythic', tier: 6, value: 2000, icon: '☢️', accent: '#f472b6', blurb: 'A miniature power plant, allegedly safe.', psuWatts: 1600, perf: 40 },

  // ── Coolers ───────────────────────────────────────────────────────────
  { id: 'cool_cf_stock', name: 'Cryoform Stock Pad', type: 'Cooler', rarity: 'Common', tier: 1, value: 20, icon: '❄️', accent: '#8b9bb4', blurb: 'Barely counts as cooling.', coolingPower: 90, noiseLevel: 3, perf: 5 },
  { id: 'cool_cf_tower90', name: 'Cryoform Tower-90 Air', type: 'Cooler', rarity: 'Uncommon', tier: 2, value: 70, icon: '🗼', accent: '#4ade80', blurb: 'Classic dual-fin air tower.', coolingPower: 160, noiseLevel: 3, perf: 8 },
  { id: 'cool_cf_auris240', name: 'Cryoform Auris 240 AIO', type: 'Cooler', rarity: 'Rare', tier: 3, value: 170, icon: '🌬️', accent: '#38bdf8', blurb: '240mm liquid loop.', coolingPower: 250, noiseLevel: 2, perf: 12 },
  { id: 'cool_cf_auris360', name: 'Cryoform Auris 360 AIO', type: 'Cooler', rarity: 'Epic', tier: 4, value: 320, icon: '🌬️', accent: '#a78bfa', blurb: '360mm loop with vapor chamber.', coolingPower: 360, noiseLevel: 2, perf: 16 },
  { id: 'cool_cf_glacier420', name: 'Cryoform Glacier 420', type: 'Cooler', rarity: 'Legendary', tier: 5, value: 640, icon: '🏔️', accent: '#fbbf24', blurb: 'Quad-radiator absurdity.', coolingPower: 480, noiseLevel: 1, perf: 22 },
  { id: 'cool_cf_cascade', name: 'Cryoform Cascade Custom Loop', type: 'Cooler', rarity: 'Mythic', tier: 6, value: 1700, icon: '🌊', accent: '#f472b6', blurb: 'Distilled arctic ambition in glass tubes.', coolingPower: 650, noiseLevel: 1, perf: 30 },

  // ── Fans ──────────────────────────────────────────────────────────────
  { id: 'fan_af120', name: 'Aeroflux 120 Standard', type: 'Fan', rarity: 'Common', tier: 1, value: 15, icon: '🌀', accent: '#8b9bb4', blurb: 'Moves air. That is the job.', coolingPower: 25, noiseLevel: 3, perf: 3 },
  { id: 'fan_af120p', name: 'Aeroflux 120 Prestige', type: 'Fan', rarity: 'Uncommon', tier: 2, value: 40, icon: '🌀', accent: '#4ade80', blurb: 'Fluid-dynamic bearing, RGB-free dignity.', coolingPower: 40, noiseLevel: 2, perf: 5 },
  { id: 'fan_af140storm', name: 'Aeroflux 140 Stormwing', type: 'Fan', rarity: 'Rare', tier: 3, value: 85, icon: '🍃', accent: '#38bdf8', blurb: 'Nine curved blades of focused gale.', coolingPower: 60, noiseLevel: 2, perf: 7 },
  { id: 'fan_af_vortex', name: 'Aeroflux Vortex Jet', type: 'Fan', rarity: 'Epic', tier: 4, value: 160, icon: '🌪️', accent: '#a78bfa', blurb: 'Technically a small hurricane.', coolingPower: 85, noiseLevel: 1, perf: 9 },

  // ── Cases ─────────────────────────────────────────────────────────────
  { id: 'case_ib_mini', name: 'Ironbox Mini Cube', type: 'Case', rarity: 'Common', tier: 1, value: 60, icon: '📦', accent: '#8b9bb4', blurb: 'Tiny chassis, tiny airflow.', caseForm: 'mATX', maxCoolerMM: 120, fanSlots: 2, perf: 5 },
  { id: 'case_ib_flow3', name: 'Ironbox Flow-3', type: 'Case', rarity: 'Uncommon', tier: 2, value: 130, icon: '🗃️', accent: '#4ade80', blurb: 'Mesh front, honest thermals.', caseForm: 'ATX', maxCoolerMM: 170, fanSlots: 4, perf: 8 },
  { id: 'case_ib_shard', name: 'Ironbox Glass Shard', type: 'Case', rarity: 'Rare', tier: 3, value: 260, icon: '🪟', accent: '#38bdf8', blurb: 'Tempered everything. Show it off.', caseForm: 'ATX', maxCoolerMM: 180, fanSlots: 5, perf: 10 },
  { id: 'case_ib_vault', name: 'Ironbox Vault XL', type: 'Case', rarity: 'Epic', tier: 4, value: 480, icon: '🏦', accent: '#a78bfa', blurb: 'E-ATX capable fortress.', caseForm: 'E-ATX', maxCoolerMM: 190, fanSlots: 7, perf: 14 },
  { id: 'case_ib_prism', name: 'Ironbox Prism Infinite', type: 'Case', rarity: 'Legendary', tier: 5, value: 900, icon: '🔮', accent: '#fbbf24', blurb: 'Refracts your RGB into other dimensions.', caseForm: 'E-ATX', maxCoolerMM: 200, fanSlots: 9, perf: 18 },
  { id: 'case_ib_monolith', name: 'Ironbox Open Monolith', type: 'Case', rarity: 'Mythic', tier: 6, value: 2200, icon: '🗿', accent: '#f472b6', blurb: 'Test-bench royalty. Airflow unbound.', caseForm: 'E-ATX', maxCoolerMM: 240, fanSlots: 12, perf: 24 },
];

export const ITEM_MAP: Map<string, ItemDef> = new Map(ITEMS.map((i) => [i.id, i]));

export function getItem(defId: string): ItemDef {
  const def = ITEM_MAP.get(defId);
  if (!def) throw new Error(`Unknown item def: ${defId}`);
  return def;
}
