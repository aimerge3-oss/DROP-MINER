import type { CaseDef } from '../types';
import { ITEMS } from './items';

// ─── DROP MINER case shop definitions ───────────────────────────────────────
// 7 cases with escalating price, rarity odds, and thematic drop tables.

export const CASES: CaseDef[] = [
  {
    id: 'case_scrap', name: 'Scrap Bin Crate', theme: 'Junkyard', price: 60, accent: '#8b9bb4', icon: '🗑️',
    blurb: 'Salvaged parts from a e-waste yard. Mostly Common, occasionally a hidden gem.',
    drops: [
      { defId: 'gpu_nyx_g160', weight: 10 }, { defId: 'gpu_nyx_g310', weight: 8 },
      { defId: 'cpu_cf_q240', weight: 10 }, { defId: 'cpu_cf_q460', weight: 8 },
      { defId: 'mobo_hex_a520', weight: 9 }, { defId: 'mobo_hex_w660', weight: 8 },
      { defId: 'ram_dw8_2666', weight: 12 }, { defId: 'ssd_dv256_sata', weight: 10 },
      { defId: 'psu_vc400', weight: 9 }, { defId: 'psu_vc550', weight: 7 },
      { defId: 'cool_cf_stock', weight: 8 }, { defId: 'fan_af120', weight: 8 },
      { defId: 'case_ib_mini', weight: 6 },
      { defId: 'gpu_nyx_r550', weight: 3 }, { defId: 'cpu_cf_s630', weight: 3 },
      { defId: 'ram_dw16_3200', weight: 2 },
      { defId: 'gpu_nyx_t4070', weight: 0.4 }, { defId: 'cool_cf_tower90', weight: 1.5 },
    ],
  },
  {
    id: 'case_gamer', name: 'Gamer Starter Case', theme: 'Neon Lime', price: 180, accent: '#a3e635', icon: '🎮',
    blurb: 'A curated bundle for first-time builders. Balanced Uncommon-to-Rate odds.',
    drops: [
      { defId: 'gpu_nyx_r550', weight: 12 }, { defId: 'gpu_nyx_r760s', weight: 10 },
      { defId: 'cpu_cf_s630', weight: 12 }, { defId: 'cpu_cf_s660', weight: 10 },
      { defId: 'ram_dw16_3200', weight: 12 }, { defId: 'ssd_dv512_nvme', weight: 10 },
      { defId: 'psu_vc750g', weight: 10 }, { defId: 'cool_cf_tower90', weight: 10 },
      { defId: 'fan_af120p', weight: 8 }, { defId: 'case_ib_flow3', weight: 7 },
      { defId: 'mobo_hex_b760', weight: 8 }, { defId: 'mobo_hex_w660', weight: 5 },
      { defId: 'gpu_nyx_t4070', weight: 4 }, { defId: 'cpu_cf_e870', weight: 3.5 },
      { defId: 'ram_dw16_6000', weight: 3 }, { defId: 'mobo_hex_x670', weight: 2 },
      { defId: 'gpu_nyx_v5090', weight: 0.6 },
      { defId: 'gpu_nyx_p70', weight: 0.12 },
    ],
  },
  {
    id: 'case_ice', name: 'Frostbyte Vault', theme: 'Icy Blue', price: 420, accent: '#38bdf8', icon: '❄️',
    blurb: 'Cold-storage liquidation lot. Strong cooling and Rare-class silicon.',
    drops: [
      { defId: 'cool_cf_auris240', weight: 14 }, { defId: 'cool_cf_auris360', weight: 7 },
      { defId: 'fan_af140storm', weight: 12 }, { defId: 'gpu_nyx_t4070', weight: 12 },
      { defId: 'gpu_nyx_t4080', weight: 10 }, { defId: 'cpu_cf_e870', weight: 10 },
      { defId: 'cpu_cf_e890k', weight: 8 }, { defId: 'ram_dw16_6000', weight: 10 },
      { defId: 'mobo_hex_x670', weight: 8 }, { defId: 'mobo_hex_z790', weight: 8 },
      { defId: 'ssd_dv1t_gen4', weight: 9 }, { defId: 'psu_vc850pg', weight: 8 },
      { defId: 'case_ib_shard', weight: 6 }, { defId: 'gpu_nyx_v5090', weight: 3 },
      { defId: 'cpu_cf_t1200', weight: 2.5 }, { defId: 'ram_dw32_6400', weight: 2 },
      { defId: 'cool_cf_glacier420', weight: 1 }, { defId: 'gpu_nyx_p70', weight: 0.35 },
      { defId: 'cpu_cf_a9000', weight: 0.3 },
    ],
  },
  {
    id: 'case_pro', name: 'Pro Workstation Pod', theme: 'Graphite Gold', price: 900, accent: '#fbbf24', icon: '🏗️',
    blurb: 'Decommissioned studio gear. Epic-heavy with real Legendary shots.', requiresLevel: 5,
    drops: [
      { defId: 'gpu_nyx_v5090', weight: 14 }, { defId: 'gpu_nyx_v5180', weight: 12 },
      { defId: 'cpu_cf_t1200', weight: 12 }, { defId: 'cpu_cf_t1600x', weight: 8 },
      { defId: 'ram_dw32_6400', weight: 12 }, { defId: 'ssd_dv2t_gen5', weight: 10 },
      { defId: 'psu_vc1000t', weight: 10 }, { defId: 'mobo_hex_x880e', weight: 9 },
      { defId: 'cool_cf_auris360', weight: 9 }, { defId: 'case_ib_vault', weight: 7 },
      { defId: 'gpu_nyx_p70', weight: 3 }, { defId: 'cpu_cf_a9000', weight: 2.5 },
      { defId: 'ram_dw32_8000', weight: 2 }, { defId: 'mobo_hex_trx5', weight: 1.5 },
      { defId: 'gpu_nyx_p90x', weight: 0.8 }, { defId: 'cool_cf_glacier420', weight: 1.2 },
      { defId: 'gpu_nyx_singularity', weight: 0.08 },
    ],
  },
  {
    id: 'case_midnight', name: 'Midnight Auction Chest', theme: 'Purple Haze', price: 1600, accent: '#a78bfa', icon: '🌙',
    blurb: 'Anonymous high-roller lots. Every pull could be flagship silicon.', requiresLevel: 8,
    drops: [
      { defId: 'gpu_nyx_v5180', weight: 16 }, { defId: 'cpu_cf_t1600x', weight: 14 },
      { defId: 'ram_dw32_8000', weight: 12 }, { defId: 'ssd_dv4t_photon', weight: 12 },
      { defId: 'psu_vc1300t', weight: 11 }, { defId: 'mobo_hex_trx5', weight: 9 },
      { defId: 'cool_cf_glacier420', weight: 10 }, { defId: 'case_ib_prism', weight: 8 },
      { defId: 'gpu_nyx_p70', weight: 7 }, { defId: 'gpu_nyx_p90x', weight: 4 },
      { defId: 'cpu_cf_a9000', weight: 5 }, { defId: 'cpu_cf_a9000x', weight: 2.5 },
      { defId: 'ram_dw64_quantum', weight: 1.2 }, { defId: 'cool_cf_cascade', weight: 1 },
      { defId: 'gpu_nyx_singularity', weight: 0.35 }, { defId: 'cpu_cf_singularity', weight: 0.25 },
    ],
  },
  {
    id: 'case_mythic', name: 'Singularity Capsule', theme: 'Pink Void', price: 3500, accent: '#f472b6', icon: '🛸',
    blurb: 'Recovered from somewhere that should not exist. Mythic-tier or bust.', requiresLevel: 12,
    drops: [
      { defId: 'gpu_nyx_p90x', weight: 20 }, { defId: 'cpu_cf_a9000x', weight: 18 },
      { defId: 'ram_dw64_quantum', weight: 14 }, { defId: 'ssd_dv8t_void', weight: 14 },
      { defId: 'psu_vc1600reactor', weight: 12 }, { defId: 'mobo_hex_void', weight: 10 },
      { defId: 'cool_cf_cascade', weight: 12 }, { defId: 'case_ib_monolith', weight: 8 },
      { defId: 'gpu_nyx_singularity', weight: 3.5 }, { defId: 'cpu_cf_singularity', weight: 2.5 },
      { defId: 'mobo_hex_trx5', weight: 6 }, { defId: 'gpu_nyx_p70', weight: 8 },
    ],
  },
  {
    id: 'case_random', name: 'Wildcard Drop Box', theme: 'Rainbow Static', price: 300, accent: '#94a3b8', icon: '🎲',
    blurb: 'Fully random part from the entire catalog. Chaos is a ladder.',
    // weight ∝ 1/sqrt(value): cheap junk dominates but anything can drop
    drops: ITEMS.map((i) => ({ defId: i.id, weight: 100 / Math.sqrt(i.value) })),
  },
];
