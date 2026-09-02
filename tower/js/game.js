/* ============================================================
   黄昏塔 · 熙叆救出聆淅
   一个像《杀戮尖塔》的卡牌策略肉鸽游戏
   ============================================================ */
'use strict';

/* ---------- 工具 ---------- */
const $ = id => document.getElementById(id);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

let audioCtx = null;
function ensureAudio() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playAttackSound() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(720, t);
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.1);
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.13);
}
function playHitSound() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.12);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.17);
}
function playBlockSound() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320, t);
  osc.frequency.exponentialRampToValueAtTime(520, t + 0.08);
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.11);
}
function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

/* ---------- 卡牌库 ---------- */
const CARD_LIB = {
  strike: {
    name: '阳光射线', type: 'attack', rarity: 'basic', cost: 1,
    desc: '造成 6 点伤害。', descUp: '造成 9 点伤害。', target: 'enemy'
  },
  defend: {
    name: '雨露护盾', type: 'skill', rarity: 'basic', cost: 1,
    desc: '获得 5 点格挡。', descUp: '获得 8 点格挡。', target: 'self'
  },
  dream_shard: {
    name: '梦境碎片', type: 'skill', rarity: 'common', cost: 0,
    desc: '抽 1 张牌。', descUp: '抽 2 张牌。', target: 'self'
  },
  dusk_light: {
    name: '黄昏之光', type: 'attack', rarity: 'common', cost: 2,
    desc: '造成 13 点伤害。', descUp: '造成 17 点伤害。', target: 'enemy'
  },
  sunflower_armor: {
    name: '向日葵护甲', type: 'skill', rarity: 'common', cost: 1,
    desc: '获得 8 点格挡。', descUp: '获得 11 点格挡。', target: 'self'
  },
  galaxy_train: {
    name: '银河列车', type: 'skill', rarity: 'common', cost: 1,
    desc: '抽 2 张牌，获得 1 点能量。', descUp: '抽 3 张牌，获得 1 点能量。', target: 'self'
  },
  flower_combo: {
    name: '花影连击', type: 'attack', rarity: 'common', cost: 1,
    desc: '造成 4 点伤害 2 次。', descUp: '造成 5 点伤害 2 次。', target: 'enemy'
  },
  rain_curtain: {
    name: '雨幕', type: 'skill', rarity: 'common', cost: 1,
    desc: '获得 6 点格挡，施加 1 层虚弱。', descUp: '获得 8 点格挡，施加 1 层虚弱。', target: 'enemy'
  },
  tyrant_press: {
    name: '暴君压制', type: 'attack', rarity: 'common', cost: 1,
    desc: '造成 5 点伤害，施加 1 层易伤。', descUp: '造成 7 点伤害，施加 1 层易伤。', target: 'enemy'
  },
  dictator_order: {
    name: '独裁指令', type: 'skill', rarity: 'uncommon', cost: 1,
    desc: '对所有敌人施加 2 层易伤。', descUp: '对所有敌人施加 3 层易伤。', target: 'all-enemy'
  },
  golden_wreath: {
    name: '金色花环', type: 'power', rarity: 'uncommon', cost: 1,
    desc: '获得 1 点力量。', descUp: '获得 2 点力量。', target: 'self', exhaust: true
  },
  dew_blessing: {
    name: '雨露祝福', type: 'power', rarity: 'uncommon', cost: 1,
    desc: '获得 1 点敏捷。', descUp: '获得 2 点敏捷。', target: 'self', exhaust: true
  },
  time_shard: {
    name: '时光碎片', type: 'skill', rarity: 'rare', cost: 0,
    desc: '抽 1 张牌，获得 1 点能量。', descUp: '抽 2 张牌，获得 1 点能量。', target: 'self'
  },
  dusk_oath: {
    name: '黄昏誓约', type: 'attack', rarity: 'uncommon', cost: 2,
    desc: '造成 8 点伤害，回复 4 点生命。', descUp: '造成 11 点伤害，回复 6 点生命。', target: 'enemy'
  },
  sunflower_miracle: {
    name: '向日葵奇迹', type: 'power', rarity: 'rare', cost: 2,
    desc: '获得 2 点力量与 2 点敏捷。', descUp: '获得 3 点力量与 3 点敏捷。', target: 'self', exhaust: true
  },
  galaxy_wedding: {
    name: '银河婚礼', type: 'skill', rarity: 'rare', cost: 3,
    desc: '回复 18 点生命，获得 10 点格挡。', descUp: '回复 24 点生命，获得 14 点格挡。', target: 'self'
  },
  final_light: {
    name: '终末之光', type: 'attack', rarity: 'rare', cost: 3,
    desc: '造成 24 点伤害。', descUp: '造成 30 点伤害。', target: 'enemy'
    },
    sun_prayer: {
      name: '向光祈祷', type: 'skill', rarity: 'common', cost: 0,
      desc: '获得 1 点阳光，抽 1 张牌。', descUp: '获得 2 点阳光，抽 1 张牌。', target: 'self'
    },
    sun_beam: {
      name: '阳光束', type: 'attack', rarity: 'common', cost: 1,
      desc: '造成 5 点伤害，获得 1 点阳光。', descUp: '造成 7 点伤害，获得 1 点阳光。', target: 'enemy'
    },
    solar_flare: {
      name: '日珥爆发', type: 'attack', rarity: 'uncommon', cost: 2,
      desc: '对所有敌人造成 8 点伤害，获得 2 点阳光。', descUp: '对所有敌人造成 11 点伤害，获得 2 点阳光。', target: 'all-enemy'
    },
    blazing_ray: {
      name: '烈阳射线', type: 'attack', rarity: 'uncommon', cost: 1,
      desc: '造成 4 点伤害；消耗 2 点阳光则额外造成 10 点伤害。', descUp: '造成 6 点伤害；消耗 2 点阳光则额外造成 12 点伤害。', target: 'enemy'
    },
    sun_shield: {
      name: '日轮护壁', type: 'skill', rarity: 'common', cost: 1,
      desc: '获得 6 点格挡，获得 1 点阳光。', descUp: '获得 9 点格挡，获得 1 点阳光。', target: 'self'
    },
    sunrise: {
      name: '破晓', type: 'power', rarity: 'uncommon', cost: 1,
      desc: '每回合开始时获得 1 点阳光。', descUp: '每回合开始时获得 2 点阳光。', target: 'self', exhaust: true
    },
    binding_vow: {
      name: '向日葵誓约', type: 'power', rarity: 'rare', cost: 1,
      desc: '获得 1 点力量；每回合开始获得 1 点阳光。', descUp: '获得 2 点力量；每回合开始获得 2 点阳光。', target: 'self', exhaust: true
    },
    comet_strike: {
      name: '彗星连击', type: 'attack', rarity: 'uncommon', cost: 2,
      desc: '造成 6 点伤害 3 次。', descUp: '造成 8 点伤害 3 次。', target: 'enemy'
    },
    dream_loop: {
      name: '梦境回环', type: 'skill', rarity: 'uncommon', cost: 1,
      desc: '抽 2 张牌，从弃牌堆随机取 1 张回到手牌。', descUp: '抽 3 张牌，从弃牌堆随机取 1 张回到手牌。', target: 'self'
    },
    petal_armor: {
      name: '花瓣重铠', type: 'skill', rarity: 'common', cost: 1,
      desc: '获得 5 点格挡 2 次。', descUp: '获得 7 点格挡 2 次。', target: 'self'
    },
    gentle_rain: {
      name: '细雨', type: 'skill', rarity: 'common', cost: 1,
      desc: '回复 3 点生命，获得 4 点格挡。', descUp: '回复 5 点生命，获得 6 点格挡。', target: 'self'
    },
    twilight_ritual: {
      name: '黄昏仪式', type: 'skill', rarity: 'rare', cost: 2,
      desc: '消耗。获得 2 点能量，抽 2 张牌，失去 3 点生命。', descUp: '获得 3 点能量，抽 3 张牌，失去 3 点生命。', target: 'self', exhaust: true
    },
    last_sunlight: {
      name: '最后一缕阳光', type: 'attack', rarity: 'rare', cost: 2,
      desc: '造成 10 点伤害；若目标易伤，额外造成 8 点伤害。', descUp: '造成 14 点伤害；若目标易伤，额外造成 10 点伤害。', target: 'enemy'
    },
    queen_order: {
      name: '女王敕令', type: 'attack', rarity: 'uncommon', cost: 2,
      desc: '对所有敌人造成 6 点伤害，施加 1 层易伤。', descUp: '对所有敌人造成 9 点伤害，施加 1 层易伤。', target: 'all-enemy'
    },
    star_fall: {
      name: '星陨', type: 'attack', rarity: 'rare', cost: 3,
      desc: '造成 14 点伤害；每点阳光额外造成 1 点伤害，然后失去所有阳光。', descUp: '造成 18 点伤害；每点阳光额外造成 2 点伤害，然后失去所有阳光。', target: 'enemy'
    }
};

const COMMON_POOL = ['dream_shard', 'dusk_light', 'sunflower_armor', 'galaxy_train', 'flower_combo', 'rain_curtain', 'tyrant_press', 'sun_prayer', 'sun_beam', 'sun_shield', 'petal_armor', 'gentle_rain'];
const UNCOMMON_POOL = ['dictator_order', 'golden_wreath', 'dew_blessing', 'dusk_oath', 'solar_flare', 'blazing_ray', 'sunrise', 'comet_strike', 'dream_loop', 'queen_order'];
const RARE_POOL = ['time_shard', 'sunflower_miracle', 'galaxy_wedding', 'final_light', 'binding_vow', 'twilight_ritual', 'last_sunlight', 'star_fall'];

const EXTRA_CARDS = {
  petal_slash: { name: '花瓣斩', type: 'attack', rarity: 'common', cost: 1, desc: '造成 5 点伤害。', descUp: '造成 7 点伤害。', target: 'enemy', effectType: 'damage', value: 5, valueUp: 7 },
  sun_slash: { name: '日芒斩', type: 'attack', rarity: 'common', cost: 1, desc: '造成 4 点伤害，获得 1 点阳光。', descUp: '造成 6 点伤害，获得 1 点阳光。', target: 'enemy', effectType: 'damage_sun', value: 4, valueUp: 6, value2: 1 },
  dawn_guard: { name: '晨曦护壁', type: 'skill', rarity: 'common', cost: 1, desc: '获得 7 点格挡。', descUp: '获得 10 点格挡。', target: 'self', effectType: 'block', value: 7, valueUp: 10 },
  dream_step: { name: '梦步', type: 'skill', rarity: 'common', cost: 0, desc: '抽 1 张牌。', descUp: '抽 2 张牌。', target: 'self', effectType: 'draw', value: 1, valueUp: 2 },
  rain_blade: { name: '雨刃', type: 'attack', rarity: 'common', cost: 1, desc: '造成 4 点伤害，获得 3 点格挡。', descUp: '造成 6 点伤害，获得 4 点格挡。', target: 'enemy', effectType: 'damage_block', value: 4, valueUp: 6, value2: 3, value2Up: 4 },
  light_shield: { name: '光之盾', type: 'skill', rarity: 'common', cost: 1, desc: '获得 6 点格挡，获得 1 点阳光。', descUp: '获得 9 点格挡，获得 1 点阳光。', target: 'self', effectType: 'block_sun', value: 6, valueUp: 9, value2: 1 },
  star_dust: { name: '星尘', type: 'skill', rarity: 'common', cost: 0, desc: '获得 1 点阳光。', descUp: '获得 2 点阳光。', target: 'self', effectType: 'sun', value: 1, valueUp: 2 },
  moon_bless: { name: '月祝福', type: 'skill', rarity: 'common', cost: 1, desc: '获得 5 点格挡，抽 1 张牌。', descUp: '获得 7 点格挡，抽 1 张牌。', target: 'self', effectType: 'block_draw', value: 5, valueUp: 7, value2: 1 },
  twilight_edge: { name: '暮光刃', type: 'attack', rarity: 'common', cost: 1, desc: '造成 6 点伤害。', descUp: '造成 9 点伤害。', target: 'enemy', effectType: 'damage', value: 6, valueUp: 9 },
  flower_guard: { name: '花盾', type: 'skill', rarity: 'common', cost: 1, desc: '获得 7 点格挡。', descUp: '获得 10 点格挡。', target: 'self', effectType: 'block', value: 7, valueUp: 10 },
  dew_strike: { name: '露击', type: 'attack', rarity: 'common', cost: 1, desc: '造成 4 点伤害，施加 1 层虚弱。', descUp: '造成 6 点伤害，施加 1 层虚弱。', target: 'enemy', effectType: 'damage_weak', value: 4, valueUp: 6, value2: 1 },
  sky_slash: { name: '天光斩', type: 'attack', rarity: 'common', cost: 1, desc: '造成 5 点伤害，抽 1 张牌。', descUp: '造成 7 点伤害，抽 1 张牌。', target: 'enemy', effectType: 'damage_draw', value: 5, valueUp: 7, value2: 1 },
  petal_veil: { name: '花瓣帷幕', type: 'skill', rarity: 'common', cost: 1, desc: '获得 6 点格挡，施加 1 层虚弱。', descUp: '获得 8 点格挡，施加 1 层虚弱。', target: 'enemy', effectType: 'block_weak', value: 6, valueUp: 8, value2: 1 },
  sun_drop: { name: '阳滴', type: 'skill', rarity: 'common', cost: 0, desc: '获得 1 点阳光，抽 1 张牌。', descUp: '获得 2 点阳光，抽 1 张牌。', target: 'self', effectType: 'sun_draw', value: 1, valueUp: 2, value2: 1 },
  dream_bubble: { name: '梦泡', type: 'skill', rarity: 'common', cost: 1, desc: '获得 6 点格挡，抽 1 张牌。', descUp: '获得 8 点格挡，抽 1 张牌。', target: 'self', effectType: 'block_draw', value: 6, valueUp: 8, value2: 1 },
  morning_ray: { name: '晨光射线', type: 'attack', rarity: 'common', cost: 2, desc: '造成 10 点伤害。', descUp: '造成 14 点伤害。', target: 'enemy', effectType: 'damage', value: 10, valueUp: 14 },
  night_guard: { name: '夜守', type: 'skill', rarity: 'common', cost: 1, desc: '获得 8 点格挡。', descUp: '获得 11 点格挡。', target: 'self', effectType: 'block', value: 8, valueUp: 11 },
  comet_shard: { name: '彗星碎片', type: 'attack', rarity: 'common', cost: 1, desc: '造成 3 点伤害 2 次。', descUp: '造成 4 点伤害 2 次。', target: 'enemy', effectType: 'damage_twice', value: 3, valueUp: 4 },
  galaxy_echo: { name: '银河回响', type: 'skill', rarity: 'common', cost: 1, desc: '抽 2 张牌。', descUp: '抽 3 张牌。', target: 'self', effectType: 'draw', value: 2, valueUp: 3 },
  dawn_prayer: { name: '晨祷', type: 'skill', rarity: 'common', cost: 1, desc: '获得 2 点阳光，回复 2 点生命。', descUp: '获得 3 点阳光，回复 3 点生命。', target: 'self', effectType: 'sun_heal', value: 2, valueUp: 3, value2: 2, value2Up: 3 },
  solar_blade: { name: '烈阳刃', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 9 点伤害，获得 2 点阳光。', descUp: '造成 12 点伤害，获得 2 点阳光。', target: 'enemy', effectType: 'damage_sun', value: 9, valueUp: 12, value2: 2 },
  lunar_cut: { name: '月华斩', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 12 点伤害。', descUp: '造成 16 点伤害。', target: 'enemy', effectType: 'damage', value: 12, valueUp: 16 },
  rain_dance: { name: '雨舞', type: 'skill', rarity: 'uncommon', cost: 1, desc: '获得 5 点格挡，抽 1 张牌。', descUp: '获得 7 点格挡，抽 1 张牌。', target: 'self', effectType: 'block_draw', value: 5, valueUp: 7, value2: 1 },
  flower_storm: { name: '花风暴', type: 'attack', rarity: 'uncommon', cost: 2, desc: '对所有敌人造成 7 点伤害。', descUp: '对所有敌人造成 10 点伤害。', target: 'all-enemy', effectType: 'aoe_damage', value: 7, valueUp: 10 },
  star_rain: { name: '星雨', type: 'attack', rarity: 'uncommon', cost: 2, desc: '对所有敌人造成 6 点伤害并施加 1 层虚弱。', descUp: '对所有敌人造成 8 点伤害并施加 1 层虚弱。', target: 'all-enemy', effectType: 'aoe_weak', value: 6, valueUp: 8, value2: 1 },
  dawn_chorus: { name: '晨光合唱', type: 'skill', rarity: 'uncommon', cost: 2, desc: '对所有敌人施加 2 层易伤。', descUp: '对所有敌人施加 3 层易伤。', target: 'all-enemy', effectType: 'all_vuln', value: 2, valueUp: 3 },
  sun_empower: { name: '阳能灌注', type: 'power', rarity: 'uncommon', cost: 1, desc: '获得 1 点力量。消耗。', descUp: '获得 2 点力量。消耗。', target: 'self', effectType: 'power_strength', value: 1, valueUp: 2, exhaust: true },
  dew_empower: { name: '露能灌注', type: 'power', rarity: 'uncommon', cost: 1, desc: '获得 1 点敏捷。消耗。', descUp: '获得 2 点敏捷。消耗。', target: 'self', effectType: 'power_dexterity', value: 1, valueUp: 2, exhaust: true },
  dream_gate: { name: '梦门', type: 'skill', rarity: 'uncommon', cost: 1, desc: '抽 2 张牌，获得 1 点能量。', descUp: '抽 3 张牌，获得 1 点能量。', target: 'self', effectType: 'draw_energy', value: 2, valueUp: 3, value2: 1 },
  time_ripple: { name: '时光涟漪', type: 'skill', rarity: 'uncommon', cost: 1, desc: '抽 1 张牌，获得 1 点能量。', descUp: '抽 2 张牌，获得 1 点能量。', target: 'self', effectType: 'draw_energy', value: 1, valueUp: 2, value2: 1 },
  twilight_slash: { name: '黄昏连斩', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 6 点伤害 2 次。', descUp: '造成 8 点伤害 2 次。', target: 'enemy', effectType: 'damage_twice', value: 6, valueUp: 8 },
  petal_dance: { name: '花瓣乱舞', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 4 点伤害 3 次。', descUp: '造成 5 点伤害 3 次。', target: 'enemy', effectType: 'damage_thrice', value: 4, valueUp: 5 },
  sun_guardian: { name: '日之守护', type: 'skill', rarity: 'uncommon', cost: 2, desc: '获得 12 点格挡。消耗。', descUp: '获得 16 点格挡。消耗。', target: 'self', effectType: 'exhaust_block', value: 12, valueUp: 16, exhaust: true },
  moon_veil: { name: '月纱', type: 'skill', rarity: 'uncommon', cost: 1, desc: '获得 5 点格挡，施加 1 层虚弱。', descUp: '获得 7 点格挡，施加 1 层虚弱。', target: 'enemy', effectType: 'block_weak', value: 5, valueUp: 7, value2: 1 },
  star_guard: { name: '星之守护', type: 'skill', rarity: 'uncommon', cost: 2, desc: '获得 10 点格挡，抽 1 张牌。', descUp: '获得 13 点格挡，抽 1 张牌。', target: 'self', effectType: 'block_draw', value: 10, valueUp: 13, value2: 1 },
  galaxy_veil: { name: '银河纱幕', type: 'skill', rarity: 'uncommon', cost: 2, desc: '获得 12 点格挡。消耗。', descUp: '获得 16 点格挡。消耗。', target: 'self', effectType: 'exhaust_block', value: 12, valueUp: 16, exhaust: true },
  solar_wind: { name: '太阳风', type: 'attack', rarity: 'uncommon', cost: 1, desc: '造成 4 点伤害，抽 1 张牌。', descUp: '造成 6 点伤害，抽 1 张牌。', target: 'enemy', effectType: 'damage_draw', value: 4, valueUp: 6, value2: 1 },
  blazing_palm: { name: '灼热掌', type: 'attack', rarity: 'uncommon', cost: 1, desc: '造成 6 点伤害，施加 1 层易伤。', descUp: '造成 8 点伤害，施加 1 层易伤。', target: 'enemy', effectType: 'damage_vuln', value: 6, valueUp: 8, value2: 1 },
  frost_dew: { name: '寒露', type: 'attack', rarity: 'uncommon', cost: 1, desc: '造成 6 点伤害，施加 1 层虚弱。', descUp: '造成 8 点伤害，施加 1 层虚弱。', target: 'enemy', effectType: 'damage_weak', value: 6, valueUp: 8, value2: 1 },
  dream_prison: { name: '梦之牢', type: 'skill', rarity: 'uncommon', cost: 1, desc: '对所有敌人施加 1 层虚弱。', descUp: '对所有敌人施加 2 层虚弱。', target: 'all-enemy', effectType: 'all_weak', value: 1, valueUp: 2 },
  queen_edict: { name: '女王法令', type: 'attack', rarity: 'uncommon', cost: 2, desc: '对所有敌人造成 6 点伤害并施加 1 层易伤。', descUp: '对所有敌人造成 8 点伤害并施加 1 层易伤。', target: 'all-enemy', effectType: 'aoe_vuln', value: 6, valueUp: 8, value2: 1 },
  tyrant_order: { name: '暴君命令', type: 'attack', rarity: 'uncommon', cost: 2, desc: '对所有敌人造成 7 点伤害并施加 1 层易伤。', descUp: '对所有敌人造成 9 点伤害并施加 1 层易伤。', target: 'all-enemy', effectType: 'aoe_vuln', value: 7, valueUp: 9, value2: 1 },
  sunrise_blade: { name: '破晓之刃', type: 'attack', rarity: 'uncommon', cost: 1, desc: '造成 5 点伤害，获得 1 点阳光。', descUp: '造成 7 点伤害，获得 1 点阳光。', target: 'enemy', effectType: 'damage_sun', value: 5, valueUp: 7, value2: 1 },
  twilight_armor: { name: '暮光重铠', type: 'skill', rarity: 'uncommon', cost: 2, desc: '获得 14 点格挡。消耗。', descUp: '获得 18 点格挡。消耗。', target: 'self', effectType: 'exhaust_block', value: 14, valueUp: 18, exhaust: true },
  star_crown: { name: '星冠', type: 'power', rarity: 'uncommon', cost: 2, desc: '获得 2 点力量。消耗。', descUp: '获得 3 点力量。消耗。', target: 'self', effectType: 'power_strength', value: 2, valueUp: 3, exhaust: true },
  rain_crown: { name: '雨冠', type: 'power', rarity: 'uncommon', cost: 2, desc: '获得 2 点敏捷。消耗。', descUp: '获得 3 点敏捷。消耗。', target: 'self', effectType: 'power_dexterity', value: 2, valueUp: 3, exhaust: true },
  galaxy_core: { name: '银河核心', type: 'skill', rarity: 'uncommon', cost: 2, desc: '抽 2 张牌，获得 2 点能量。', descUp: '抽 3 张牌，获得 2 点能量。', target: 'self', effectType: 'draw_energy', value: 2, valueUp: 3, value2: 2 },
  dream_anchor: { name: '梦锚', type: 'skill', rarity: 'uncommon', cost: 1, desc: '获得 8 点格挡，抽 1 张牌。', descUp: '获得 10 点格挡，抽 1 张牌。', target: 'self', effectType: 'block_draw', value: 8, valueUp: 10, value2: 1 },
  sun_well: { name: '日井', type: 'skill', rarity: 'uncommon', cost: 1, desc: '获得 3 点阳光。', descUp: '获得 4 点阳光。', target: 'self', effectType: 'sun', value: 3, valueUp: 4 },
  dew_well: { name: '露井', type: 'skill', rarity: 'uncommon', cost: 1, desc: '回复 4 点生命。', descUp: '回复 6 点生命。', target: 'self', effectType: 'heal', value: 4, valueUp: 6 },
  supernova: { name: '超新星', type: 'attack', rarity: 'rare', cost: 3, desc: '对所有敌人造成 15 点伤害。', descUp: '对所有敌人造成 20 点伤害。', target: 'all-enemy', effectType: 'aoe_damage', value: 15, valueUp: 20 },
  galaxy_collapse: { name: '银河坍缩', type: 'attack', rarity: 'rare', cost: 3, desc: '造成 25 点伤害。消耗。', descUp: '造成 32 点伤害。消耗。', target: 'enemy', effectType: 'exhaust_damage', value: 25, valueUp: 32, exhaust: true },
  sun_god_blade: { name: '日神剑', type: 'attack', rarity: 'rare', cost: 3, desc: '造成 18 点伤害，获得 3 点阳光。', descUp: '造成 22 点伤害，获得 3 点阳光。', target: 'enemy', effectType: 'damage_sun', value: 18, valueUp: 22, value2: 3 },
  eternal_sun: { name: '永恒之日', type: 'power', rarity: 'rare', cost: 2, desc: '每回合开始时获得 2 点阳光。消耗。', descUp: '每回合开始时获得 3 点阳光。消耗。', target: 'self', effectType: 'power_sunrise', value: 2, valueUp: 3, exhaust: true },
  eternal_rain: { name: '永恒之雨', type: 'power', rarity: 'rare', cost: 2, desc: '获得 3 点敏捷，回复 8 点生命。消耗。', descUp: '获得 4 点敏捷，回复 12 点生命。消耗。', target: 'self', effectType: 'power_dex_heal', value: 3, valueUp: 4, value2: 8, value2Up: 12, exhaust: true },
  dream_weaver: { name: '梦织者', type: 'skill', rarity: 'rare', cost: 2, desc: '抽 3 张牌，获得 2 点能量。消耗。', descUp: '抽 4 张牌，获得 3 点能量。消耗。', target: 'self', effectType: 'exhaust_draw_energy', value: 3, valueUp: 4, value2: 2, value2Up: 3, exhaust: true },
  final_dawn: { name: '终焉黎明', type: 'attack', rarity: 'rare', cost: 3, desc: '造成 20 点伤害，回复 8 点生命。', descUp: '造成 26 点伤害，回复 12 点生命。', target: 'enemy', effectType: 'damage_heal', value: 20, valueUp: 26, value2: 8, value2Up: 12 },
  twilight_judgement: { name: '黄昏审判', type: 'attack', rarity: 'rare', cost: 3, desc: '对所有敌人造成 12 点伤害并施加 2 层易伤。', descUp: '对所有敌人造成 16 点伤害并施加 3 层易伤。', target: 'all-enemy', effectType: 'aoe_vuln', value: 12, valueUp: 16, value2: 2, value2Up: 3 },
  star_empress: { name: '星之女帝', type: 'power', rarity: 'rare', cost: 3, desc: '获得 2 点力量与 2 点敏捷。消耗。', descUp: '获得 3 点力量与 3 点敏捷。消耗。', target: 'self', effectType: 'power_strength_dex', value: 2, valueUp: 3, value2: 2, value2Up: 3, exhaust: true },
  sunflower_king: { name: '向日葵王', type: 'power', rarity: 'rare', cost: 3, desc: '获得 3 点力量；每回合开始获得 1 点阳光。消耗。', descUp: '获得 4 点力量；每回合开始获得 2 点阳光。消耗。', target: 'self', effectType: 'power_strength_sun', value: 3, valueUp: 4, exhaust: true },
  rain_queen: { name: '雨之女王', type: 'power', rarity: 'rare', cost: 3, desc: '获得 3 点敏捷，回复 12 点生命。消耗。', descUp: '获得 4 点敏捷，回复 18 点生命。消耗。', target: 'self', effectType: 'power_dex_heal', value: 3, valueUp: 4, value2: 12, value2Up: 18, exhaust: true },
  galaxy_bride: { name: '银河新娘', type: 'skill', rarity: 'rare', cost: 3, desc: '回复 20 点生命，获得 15 点格挡。消耗。', descUp: '回复 26 点生命，获得 20 点格挡。消耗。', target: 'self', effectType: 'block_heal', value: 15, valueUp: 20, value2: 20, value2Up: 26, exhaust: true },
  light_of_vow: { name: '誓约之光', type: 'attack', rarity: 'rare', cost: 2, desc: '造成 12 点伤害，获得 10 点格挡。', descUp: '造成 16 点伤害，获得 14 点格挡。', target: 'enemy', effectType: 'damage_block', value: 12, valueUp: 16, value2: 10, value2Up: 14 },
  zero_chain: { name: '零之锁链', type: 'skill', rarity: 'rare', cost: 2, desc: '对所有敌人施加 2 层易伤与 1 层虚弱。', descUp: '对所有敌人施加 3 层易伤与 2 层虚弱。', target: 'all-enemy', effectType: 'all_vuln_weak', value: 2, valueUp: 3, value2: 1, value2Up: 2 },
  ling_song: { name: '灵之歌', type: 'skill', rarity: 'rare', cost: 2, desc: '回复 12 点生命，抽 2 张牌。', descUp: '回复 16 点生命，抽 3 张牌。', target: 'self', effectType: 'heal_draw', value: 12, valueUp: 16, value2: 2, value2Up: 3 },
  dream_marriage: { name: '梦之婚礼', type: 'skill', rarity: 'rare', cost: 3, desc: '回复 30 点生命。消耗。', descUp: '回复 40 点生命。消耗。', target: 'self', effectType: 'heal', value: 30, valueUp: 40, exhaust: true },
  hundred_bloom: { name: '百花绽放', type: 'attack', rarity: 'rare', cost: 3, desc: '造成 10 点伤害 3 次。', descUp: '造成 13 点伤害 3 次。', target: 'enemy', effectType: 'damage_thrice', value: 10, valueUp: 13 },
  cosmic_ray: { name: '宇宙射线', type: 'attack', rarity: 'rare', cost: 3, desc: '造成 22 点伤害，抽 2 张牌。', descUp: '造成 28 点伤害，抽 3 张牌。', target: 'enemy', effectType: 'damage_draw', value: 22, valueUp: 28, value2: 2, value2Up: 3 },
  last_petal: { name: '最后花瓣', type: 'attack', rarity: 'rare', cost: 1, desc: '造成 4 点伤害，获得 4 点格挡，抽 1 张牌。', descUp: '造成 6 点伤害，获得 6 点格挡，抽 2 张牌。', target: 'enemy', effectType: 'damage_block_draw', value: 4, valueUp: 6, value2: 4, value2Up: 6, value3: 1, value3Up: 2 },
  honeymoon_light: { name: '蜜月之光', type: 'skill', rarity: 'rare', cost: 2, desc: '获得 10 点格挡，回复 10 点生命。消耗。', descUp: '获得 14 点格挡，回复 14 点生命。消耗。', target: 'self', effectType: 'block_heal', value: 10, valueUp: 14, value2: 10, value2Up: 14, exhaust: true },
  petal_shot: { name: '花瓣射击', type: 'attack', rarity: 'common', cost: 0, desc: '造成 3 点伤害。', descUp: '造成 5 点伤害。', target: 'enemy', effectType: 'damage', value: 3, valueUp: 5 },
  sunrise_blessing: { name: '破晓祝福', type: 'skill', rarity: 'common', cost: 1, desc: '获得 2 点阳光，抽 1 张牌。', descUp: '获得 3 点阳光，抽 1 张牌。', target: 'self', effectType: 'sun_draw', value: 2, valueUp: 3, value2: 1 },
  dream_slash: { name: '梦噬斩', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 14 点伤害，抽 1 张牌。', descUp: '造成 18 点伤害，抽 1 张牌。', target: 'enemy', effectType: 'damage_draw', value: 14, valueUp: 18, value2: 1 },
  galaxy_guard: { name: '银河卫士', type: 'skill', rarity: 'uncommon', cost: 1, desc: '获得 10 点格挡。消耗。', descUp: '获得 14 点格挡。消耗。', target: 'self', effectType: 'exhaust_block', value: 10, valueUp: 14, exhaust: true },
  eternal_vow: { name: '永恒誓约', type: 'power', rarity: 'rare', cost: 3, desc: '获得 2 点力量；每回合开始获得 1 点阳光。消耗。', descUp: '获得 3 点力量；每回合开始获得 2 点阳光。消耗。', target: 'self', effectType: 'power_strength_sun', value: 2, valueUp: 3, exhaust: true }
};
Object.assign(CARD_LIB, EXTRA_CARDS);
COMMON_POOL.push('petal_slash','sun_slash','dawn_guard','dream_step','rain_blade','light_shield','star_dust','moon_bless','twilight_edge','flower_guard','dew_strike','sky_slash','petal_veil','sun_drop','dream_bubble','morning_ray','night_guard','comet_shard','galaxy_echo','dawn_prayer','petal_shot','sunrise_blessing');
UNCOMMON_POOL.push('solar_blade','lunar_cut','rain_dance','flower_storm','star_rain','dawn_chorus','sun_empower','dew_empower','dream_gate','time_ripple','twilight_slash','petal_dance','sun_guardian','moon_veil','star_guard','galaxy_veil','solar_wind','blazing_palm','frost_dew','dream_prison','queen_edict','tyrant_order','sunrise_blade','twilight_armor','star_crown','rain_crown','galaxy_core','dream_anchor','sun_well','dew_well','dream_slash','galaxy_guard');
RARE_POOL.push('supernova','galaxy_collapse','sun_god_blade','eternal_sun','eternal_rain','dream_weaver','final_dawn','twilight_judgement','star_empress','sunflower_king','rain_queen','galaxy_bride','light_of_vow','zero_chain','ling_song','dream_marriage','hundred_bloom','cosmic_ray','last_petal','honeymoon_light','eternal_vow');
const MASS_PREFIXES = ['晨光','暮色','星辉','月光','阳光','雨露','花瓣','银河','梦境','黄昏','烈日','清风','花影','露水','流星','晨曦','夜幕','霞光','云海','琉璃'];
const MASS_CORES = [
  { name: '斩', type: 'attack', rarity: 'common', cost: 1, desc: '造成 5 点伤害。', descUp: '造成 7 点伤害。', target: 'enemy', effectType: 'damage', value: 5, valueUp: 7 },
  { name: '连斩', type: 'attack', rarity: 'common', cost: 1, desc: '造成 3 点伤害 2 次。', descUp: '造成 4 点伤害 2 次。', target: 'enemy', effectType: 'damage_twice', value: 3, valueUp: 4 },
  { name: '三连斩', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 4 点伤害 3 次。', descUp: '造成 5 点伤害 3 次。', target: 'enemy', effectType: 'damage_thrice', value: 4, valueUp: 5 },
  { name: '重斩', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 12 点伤害。', descUp: '造成 16 点伤害。', target: 'enemy', effectType: 'damage', value: 12, valueUp: 16 },
  { name: '巨斩', type: 'attack', rarity: 'rare', cost: 3, desc: '造成 20 点伤害。', descUp: '造成 26 点伤害。', target: 'enemy', effectType: 'damage', value: 20, valueUp: 26 },
  { name: '刺', type: 'attack', rarity: 'common', cost: 0, desc: '造成 3 点伤害。', descUp: '造成 5 点伤害。', target: 'enemy', effectType: 'damage', value: 3, valueUp: 5 },
  { name: '光刃', type: 'attack', rarity: 'common', cost: 1, desc: '造成 4 点伤害，获得 1 点阳光。', descUp: '造成 6 点伤害，获得 1 点阳光。', target: 'enemy', effectType: 'damage_sun', value: 4, valueUp: 6, value2: 1 },
  { name: '烈刃', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 9 点伤害，获得 2 点阳光。', descUp: '造成 12 点伤害，获得 2 点阳光。', target: 'enemy', effectType: 'damage_sun', value: 9, valueUp: 12, value2: 2 },
  { name: '盾', type: 'skill', rarity: 'common', cost: 1, desc: '获得 7 点格挡。', descUp: '获得 10 点格挡。', target: 'self', effectType: 'block', value: 7, valueUp: 10 },
  { name: '重盾', type: 'skill', rarity: 'uncommon', cost: 2, desc: '获得 14 点格挡。', descUp: '获得 18 点格挡。', target: 'self', effectType: 'block', value: 14, valueUp: 18 },
  { name: '圣盾', type: 'skill', rarity: 'rare', cost: 2, desc: '获得 12 点格挡。消耗。', descUp: '获得 16 点格挡。消耗。', target: 'self', effectType: 'exhaust_block', value: 12, valueUp: 16, exhaust: true },
  { name: '壁', type: 'skill', rarity: 'common', cost: 1, desc: '获得 8 点格挡。', descUp: '获得 11 点格挡。', target: 'self', effectType: 'block', value: 8, valueUp: 11 },
  { name: '雨盾', type: 'skill', rarity: 'common', cost: 1, desc: '获得 6 点格挡，获得 1 点阳光。', descUp: '获得 9 点格挡，获得 1 点阳光。', target: 'self', effectType: 'block_sun', value: 6, valueUp: 9, value2: 1 },
  { name: '抽牌', type: 'skill', rarity: 'common', cost: 1, desc: '抽 1 张牌。', descUp: '抽 2 张牌。', target: 'self', effectType: 'draw', value: 1, valueUp: 2 },
  { name: '连抽', type: 'skill', rarity: 'uncommon', cost: 1, desc: '抽 2 张牌。', descUp: '抽 3 张牌。', target: 'self', effectType: 'draw', value: 2, valueUp: 3 },
  { name: '能量', type: 'skill', rarity: 'rare', cost: 0, desc: '获得 1 点能量。', descUp: '获得 2 点能量。', target: 'self', effectType: 'energy', value: 1, valueUp: 2 },
  { name: '梦抽', type: 'skill', rarity: 'uncommon', cost: 1, desc: '抽 1 张牌，获得 1 点能量。', descUp: '抽 2 张牌，获得 1 点能量。', target: 'self', effectType: 'draw_energy', value: 1, valueUp: 2, value2: 1 },
  { name: '大梦抽', type: 'skill', rarity: 'rare', cost: 2, desc: '抽 2 张牌，获得 2 点能量。', descUp: '抽 3 张牌，获得 2 点能量。', target: 'self', effectType: 'draw_energy', value: 2, valueUp: 3, value2: 2 },
  { name: '阳光', type: 'skill', rarity: 'common', cost: 0, desc: '获得 1 点阳光。', descUp: '获得 2 点阳光。', target: 'self', effectType: 'sun', value: 1, valueUp: 2 },
  { name: '烈阳', type: 'skill', rarity: 'uncommon', cost: 1, desc: '获得 3 点阳光。', descUp: '获得 4 点阳光。', target: 'self', effectType: 'sun', value: 3, valueUp: 4 },
  { name: '弱斩', type: 'attack', rarity: 'common', cost: 1, desc: '造成 4 点伤害，施加 1 层虚弱。', descUp: '造成 6 点伤害，施加 1 层虚弱。', target: 'enemy', effectType: 'damage_weak', value: 4, valueUp: 6, value2: 1 },
  { name: '易伤斩', type: 'attack', rarity: 'uncommon', cost: 1, desc: '造成 6 点伤害，施加 1 层易伤。', descUp: '造成 8 点伤害，施加 1 层易伤。', target: 'enemy', effectType: 'damage_vuln', value: 6, valueUp: 8, value2: 1 },
  { name: '群攻', type: 'attack', rarity: 'uncommon', cost: 2, desc: '对所有敌人造成 7 点伤害。', descUp: '对所有敌人造成 10 点伤害。', target: 'all-enemy', effectType: 'aoe_damage', value: 7, valueUp: 10 },
  { name: '大群攻', type: 'attack', rarity: 'rare', cost: 3, desc: '对所有敌人造成 14 点伤害。', descUp: '对所有敌人造成 18 点伤害。', target: 'all-enemy', effectType: 'aoe_damage', value: 14, valueUp: 18 },
  { name: '群弱', type: 'attack', rarity: 'uncommon', cost: 2, desc: '对所有敌人造成 6 点伤害并施加 1 层虚弱。', descUp: '对所有敌人造成 8 点伤害并施加 1 层虚弱。', target: 'all-enemy', effectType: 'aoe_weak', value: 6, valueUp: 8, value2: 1 },
  { name: '群易伤', type: 'attack', rarity: 'uncommon', cost: 2, desc: '对所有敌人造成 7 点伤害并施加 1 层易伤。', descUp: '对所有敌人造成 9 点伤害并施加 1 层易伤。', target: 'all-enemy', effectType: 'aoe_vuln', value: 7, valueUp: 9, value2: 1 },
  { name: '全体易伤', type: 'skill', rarity: 'uncommon', cost: 2, desc: '对所有敌人施加 2 层易伤。', descUp: '对所有敌人施加 3 层易伤。', target: 'all-enemy', effectType: 'all_vuln', value: 2, valueUp: 3 },
  { name: '全体虚弱', type: 'skill', rarity: 'common', cost: 1, desc: '对所有敌人施加 1 层虚弱。', descUp: '对所有敌人施加 2 层虚弱。', target: 'all-enemy', effectType: 'all_weak', value: 1, valueUp: 2 },
  { name: '攻守', type: 'attack', rarity: 'common', cost: 1, desc: '造成 4 点伤害，获得 3 点格挡。', descUp: '造成 6 点伤害，获得 4 点格挡。', target: 'enemy', effectType: 'damage_block', value: 4, valueUp: 6, value2: 3, value2Up: 4 },
  { name: '大攻守', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 10 点伤害，获得 8 点格挡。', descUp: '造成 14 点伤害，获得 12 点格挡。', target: 'enemy', effectType: 'damage_block', value: 10, valueUp: 14, value2: 8, value2Up: 12 },
  { name: '攻抽', type: 'attack', rarity: 'common', cost: 1, desc: '造成 5 点伤害，抽 1 张牌。', descUp: '造成 7 点伤害，抽 1 张牌。', target: 'enemy', effectType: 'damage_draw', value: 5, valueUp: 7, value2: 1 },
  { name: '攻回', type: 'attack', rarity: 'uncommon', cost: 2, desc: '造成 8 点伤害，回复 4 点生命。', descUp: '造成 12 点伤害，回复 6 点生命。', target: 'enemy', effectType: 'damage_heal', value: 8, valueUp: 12, value2: 4, value2Up: 6 },
  { name: '治愈', type: 'skill', rarity: 'common', cost: 1, desc: '回复 4 点生命。', descUp: '回复 6 点生命。', target: 'self', effectType: 'heal', value: 4, valueUp: 6 },
  { name: '大治愈', type: 'skill', rarity: 'uncommon', cost: 2, desc: '回复 12 点生命。', descUp: '回复 16 点生命。', target: 'self', effectType: 'heal', value: 12, valueUp: 16 },
  { name: '婚约', type: 'skill', rarity: 'rare', cost: 2, desc: '获得 10 点格挡，回复 10 点生命。消耗。', descUp: '获得 14 点格挡，回复 14 点生命。消耗。', target: 'self', effectType: 'block_heal', value: 10, valueUp: 14, value2: 10, value2Up: 14, exhaust: true },
  { name: '力', type: 'power', rarity: 'uncommon', cost: 1, desc: '获得 1 点力量。消耗。', descUp: '获得 2 点力量。消耗。', target: 'self', effectType: 'power_strength', value: 1, valueUp: 2, exhaust: true },
  { name: '大力量', type: 'power', rarity: 'rare', cost: 2, desc: '获得 2 点力量。消耗。', descUp: '获得 3 点力量。消耗。', target: 'self', effectType: 'power_strength', value: 2, valueUp: 3, exhaust: true },
  { name: '敏', type: 'power', rarity: 'uncommon', cost: 1, desc: '获得 1 点敏捷。消耗。', descUp: '获得 2 点敏捷。消耗。', target: 'self', effectType: 'power_dexterity', value: 1, valueUp: 2, exhaust: true },
  { name: '大敏捷', type: 'power', rarity: 'rare', cost: 2, desc: '获得 2 点敏捷。消耗。', descUp: '获得 3 点敏捷。消耗。', target: 'self', effectType: 'power_dexterity', value: 2, valueUp: 3, exhaust: true },
  { name: '力敏', type: 'power', rarity: 'rare', cost: 3, desc: '获得 2 点力量与 2 点敏捷。消耗。', descUp: '获得 3 点力量与 3 点敏捷。消耗。', target: 'self', effectType: 'power_strength_dex', value: 2, valueUp: 3, value2: 2, value2Up: 3, exhaust: true },
  { name: '破晓', type: 'power', rarity: 'rare', cost: 2, desc: '每回合开始时获得 2 点阳光。消耗。', descUp: '每回合开始时获得 3 点阳光。消耗。', target: 'self', effectType: 'power_sunrise', value: 2, valueUp: 3, exhaust: true },
  { name: '日誓', type: 'power', rarity: 'rare', cost: 3, desc: '获得 3 点力量；每回合开始获得 1 点阳光。消耗。', descUp: '获得 4 点力量；每回合开始获得 2 点阳光。消耗。', target: 'self', effectType: 'power_strength_sun', value: 3, valueUp: 4, exhaust: true },
  { name: '雨后', type: 'power', rarity: 'rare', cost: 2, desc: '获得 3 点敏捷，回复 8 点生命。消耗。', descUp: '获得 4 点敏捷，回复 12 点生命。消耗。', target: 'self', effectType: 'power_dex_heal', value: 3, valueUp: 4, value2: 8, value2Up: 12, exhaust: true },
  { name: '梦回', type: 'skill', rarity: 'uncommon', cost: 1, desc: '从弃牌堆随机取 1 张回到手牌。', descUp: '从弃牌堆随机取 2 张回到手牌。', target: 'self', effectType: 'random_discard_to_hand' },
  { name: '仪式', type: 'skill', rarity: 'rare', cost: 2, desc: '失去 3 点生命，抽 2 张牌，获得 1 点能量。消耗。', descUp: '失去 3 点生命，抽 3 张牌，获得 2 点能量。消耗。', target: 'self', effectType: 'lose_hp_draw_energy', value: 3, value2: 2, value2Up: 3, value3: 1, value3Up: 2, exhaust: true },
  { name: '星陨', type: 'attack', rarity: 'rare', cost: 3, desc: '造成 25 点伤害。消耗。', descUp: '造成 32 点伤害。消耗。', target: 'enemy', effectType: 'exhaust_damage', value: 25, valueUp: 32, exhaust: true },
  { name: '星守', type: 'skill', rarity: 'rare', cost: 2, desc: '获得 14 点格挡。消耗。', descUp: '获得 18 点格挡。消耗。', target: 'self', effectType: 'exhaust_block', value: 14, valueUp: 18, exhaust: true },
  { name: '女王', type: 'attack', rarity: 'uncommon', cost: 2, desc: '对所有敌人造成 6 点伤害并施加 1 层易伤。', descUp: '对所有敌人造成 8 点伤害并施加 1 层易伤。', target: 'all-enemy', effectType: 'aoe_vuln', value: 6, valueUp: 8, value2: 1 },
  { name: '控制', type: 'skill', rarity: 'rare', cost: 2, desc: '对所有敌人施加 2 层易伤与 1 层虚弱。', descUp: '对所有敌人施加 3 层易伤与 2 层虚弱。', target: 'all-enemy', effectType: 'all_vuln_weak', value: 2, valueUp: 3, value2: 1, value2Up: 2 },
  { name: '终末', type: 'attack', rarity: 'rare', cost: 3, desc: '造成 22 点伤害。', descUp: '造成 28 点伤害。', target: 'enemy', effectType: 'damage', value: 22, valueUp: 28 }
];
const GENERATED_CARD_IDS = [];
MASS_PREFIXES.forEach((prefix, pi) => {
  MASS_CORES.forEach((core, ci) => {
    const id = 'gen_' + pi + '_' + ci;
    CARD_LIB[id] = {
      name: prefix + core.name,
      type: core.type,
      rarity: core.rarity,
      cost: core.cost,
      desc: core.desc,
      descUp: core.descUp,
      target: core.target,
      effectType: core.effectType,
      value: core.value,
      valueUp: core.valueUp,
      value2: core.value2,
      value2Up: core.value2Up,
      value3: core.value3,
      value3Up: core.value3Up,
      exhaust: !!core.exhaust
    };
    GENERATED_CARD_IDS.push(id);
  });
});
function createCard(id, upgraded = false) {
  const lib = CARD_LIB[id];
  return {
    id,
    name: lib.name,
    type: lib.type,
    cost: lib.cost,
    desc: upgraded ? lib.descUp : lib.desc,
    upgraded,
    target: lib.target,
    exhaust: !!lib.exhaust
  };
}

function startingDeck() {
  const deck = [];
  for (let i = 0; i < 4; i++) deck.push(createCard('strike'));
  for (let i = 0; i < 4; i++) deck.push(createCard('defend'));
  deck.push(createCard('dream_shard'));
  deck.push(createCard('sun_prayer'));
  return deck;
}

/* ---------- 遗物 ---------- */
const RELIC_LIB = {
  sunflower_ribbon: { name: '向日葵发带', desc: '每场战斗开始时获得 1 点力量。' },
  twilight_ticket: { name: '黄昏车票', desc: '每场战斗开始时额外抽 1 张牌。' },
  dream_bell: { name: '梦之铃', desc: '每回合开始时获得 1 点格挡。' },
  rain_pendant: { name: '雨露挂坠', desc: '战斗胜利后回复 3 点生命。' }
};

/* ---------- 敌人 ---------- */
const ENEMY_LIB = {
  shadow: {
    name: '梦魇列车员', emoji: '👻', maxHp: 24,
    pattern: ['attack1', 'defend', 'attack2', 'buff']
  },
  thug: {
    name: '黄昏魔像', emoji: '🗿', maxHp: 30,
    pattern: ['attack2', 'defend', 'attack1', 'buff']
  },
  elite1: {
    name: '零的使魔', emoji: '😈', maxHp: 42,
    pattern: ['attack2', 'defend', 'buff', 'attack2']
  },
  elite2: {
    name: '灵的傀儡', emoji: '🃏', maxHp: 46,
    pattern: ['attack2', 'buff', 'attack3', 'defend']
  },
  elite3: {
    name: '塔顶守卫', emoji: '⚔️', maxHp: 52,
    pattern: ['attack3', 'defend', 'buff', 'attack2']
  },
  boss_zero: {
    name: '零 · 暴君', emoji: '👑', maxHp: 70,
    pattern: ['attack3', 'buff', 'attack2', 'defend']
  },
  boss_ling: {
    name: '灵 · 独裁者', emoji: '🕊️', maxHp: 58,
    pattern: ['attack2', 'debuff', 'defend', 'buff']
    },
    thorn: {
      name: '尖刺花妖', emoji: '🌵', maxHp: 26, thorns: 3,
      pattern: ['attack1', 'defend', 'attack1', 'buff']
    },
    healer: {
      name: '治愈人偶', emoji: '💉', maxHp: 30,
      pattern: ['heal', 'attack1', 'defend', 'heal']
    },
    curser: {
      name: '诅咒魔女', emoji: '🧙', maxHp: 28,
      pattern: ['curse', 'attack1', 'defend', 'curse']
    },
    timekeeper: {
      name: '时停看守', emoji: '⏳', maxHp: 32,
      pattern: ['time', 'attack2', 'defend', 'time']
    },
    armor: {
      name: '铁壁守卫', emoji: '🛡️', maxHp: 38,
      pattern: ['defend', 'attack1', 'big_defend', 'defend']
    }
};

function makeEnemy(id, floor = 0) {
  const lib = ENEMY_LIB[id];
    const effLevel = Math.min(floor, 180);
    const scale = 1 + Math.floor(effLevel / 5) * 0.12;
    const maxHp = Math.max(10, Math.floor(lib.maxHp * scale));
  return {
    id,
    name: lib.name,
    emoji: lib.emoji,
    maxHp,
    hp: maxHp,
      block: 0,
    strength: 0,
      thorns: lib.thorns || 0,
    level: floor,
    turnIndex: 0,
    statuses: { weak: 0, vulnerable: 0 },
    pattern: lib.pattern.slice()
  };
}

function intentOf(enemy) {
  const key = enemy.pattern[enemy.turnIndex % enemy.pattern.length];
  const table = {
    attack1: { type: '攻击', value: 7, text: '攻击 7' },
    attack2: { type: '攻击', value: 11, text: '攻击 11' },
    attack3: { type: '攻击', value: 15, text: '攻击 15' },
    defend: { type: '防御', value: 8, text: '格挡 8' },
    buff: { type: '强化', value: 0, text: '力量 +2' },
    debuff: { type: '弱化', value: 0, text: '施加易伤' },
      heal: { type: '治疗', value: 8, text: '治疗 8' },
      curse: { type: '诅咒', value: 0, text: '虚弱+易伤' },
      time: { type: '时停', value: 0, text: '时间紊乱' },
      big_defend: { type: '防御', value: 14, text: '格挡 14' },
  };
  const base = table[key];
  const effLevel = Math.min(enemy.level, 180);
  if (base.type === '攻击') {
    const value = Math.floor((base.value + effLevel * 0.08) * (1 + effLevel * 0.008));
    return { type: '攻击', value, text: `攻击 ${value}` };
  }
  if (base.type === '防御') {
    const value = Math.floor((base.value + effLevel * 0.08) * (1 + effLevel * 0.008));
    return { type: '防御', value, text: `格挡 ${value}` };
  }
  return base;
}

/* ---------- 事件 ---------- */
const EVENT_LIB = {
  dream: {
    title: '梦的低语',
    story: '空气中传来梦愧疚的声音：“对不起……是我把聆淅送上了那列银河铁道。我本想带你们一起看星星的。”',
    choices: [
      { text: '“没关系，我去带她回来。”——回复 8 点生命', effect: () => { healPlayer(8); } },
      { text: '触碰漂浮的梦境碎片——获得【时光碎片】', effect: () => { addCardToDeck('time_shard'); } },
      { text: '继续赶路，不做停留', effect: () => {} }
    ]
  },
  note: {
    title: '零与灵的纸条',
    story: '桌上压着一张纸条，字迹华丽却冰冷：“想要回你的小妹妹，就来黄昏塔顶。我们缺一个听话的仆人。——零 & 灵”',
    choices: [
      { text: '收下纸条作为决意——获得遗物【黄昏车票】', effect: () => { addRelic('twilight_ticket'); } },
      { text: '撕碎纸条，头也不回地出发——回复 5 点生命', effect: () => { healPlayer(5); } },
      { text: '把纸条折成纸飞机——无事发生', effect: () => {} }
    ]
  },
  letter: {
    title: '聆淅的雨声',
    story: '你在塔中听到极轻的雨声。那是聆淅留下的气息，像在说：姐姐，我在这里。',
    choices: [
      { text: '循着雨声静听——回复 12 点生命', effect: () => { healPlayer(12); } },
      { text: '把雨声记在心里——升级一张随机卡牌', effect: () => { upgradeRandomCard(); } },
      { text: '保持冷静，继续攀登——获得 1 点最大生命', effect: () => { state.maxHp += 4; state.hp = Math.min(state.hp + 4, state.maxHp); } }
    ]
  }
};
const EVENT_PREFIXES = ['晨光','暮色','星辉','月光','阳光','雨露','花瓣','银河','梦境','黄昏','烈日','清风','花影','露水','流星','晨曦','夜幕','霞光','云海','琉璃'];
const EVENT_CORE_NAMES = ['回廊','祭坛','花园','车站','图书馆','钟楼','镜屋','喷泉','高台','密室','画廊','温室','天台','地下河','星象台','旧书房','花房','月台','列车厢','瞭望塔','遗迹','神龛','迷宫','井边','桥头','林间','沙地','雪原','洞窟','瀑布','石阵','王座厅','宴会厅','武器库','藏宝室','牢房','厨房','酒窖','钟表店','唱片行','电影院','学校','医院','教堂','灯塔','码头','集市','熔炉','冰窖','星空庭院'];
const EVENT_EFFECTS = [
  { text: '回复 8 点生命', fn: () => { healPlayer(8); } },
  { text: '获得 2 点力量', fn: () => { state.strength = (state.strength || 0) + 2; } },
  { text: '获得 2 点敏捷', fn: () => { state.dexterity = (state.dexterity || 0) + 2; } },
  { text: '获得 5 点格挡', fn: () => { state.block = (state.block || 0) + 5; } },
  { text: '获得 4 点阳光', fn: () => { state.sun = Math.min(20, (state.sun || 0) + 4); } },
  { text: '升级一张随机卡牌', fn: () => { upgradeRandomCard(); } },
  { text: '获得一张随机卡牌', fn: () => { addRandomCardToDeck('common'); } },
  { text: '获得一张稀有卡牌', fn: () => { addRandomCardToDeck('rare'); } },
  { text: '失去 5 点生命，获得一张稀有卡牌', fn: () => { state.hp = Math.max(1, state.hp - 5); addRandomCardToDeck('rare'); } },
  { text: '无事发生', fn: () => {} }
];
EVENT_PREFIXES.forEach((prefix, pi) => {
  EVENT_CORE_NAMES.forEach((coreName, ci) => {
    const id = 'evt_' + pi + '_' + ci;
    const e1 = EVENT_EFFECTS[(pi + ci) % EVENT_EFFECTS.length];
    const e2 = EVENT_EFFECTS[(pi * 2 + ci + 3) % EVENT_EFFECTS.length];
    const choices = [];
    choices.push({ text: `接受${prefix}的祝福${e1.text}`, effect: e1.fn });
    if (e1.text !== e2.text) {
      choices.push({ text: `挑战${prefix}的试炼${e2.text}`, effect: e2.fn });
    }
    choices.push({ text: '继续赶路', effect: () => {} });
    EVENT_LIB[id] = {
      title: `${prefix}${coreName}`,
      story: `在黄昏塔的深处，你遇到了${prefix}笼罩的${coreName}。这里弥漫着${prefix}的余韵，空气中飘浮着细碎的光尘。`,
      choices
    };
  });
});

/* ---------- 地图 ---------- */
const TOTAL_FLOORS = 1200;

function pickEnemyForFloor(floor, elite = false) {
  if (!elite && floor > 5 && Math.random() < 0.15) {
    const mech = ['thorn', 'healer', 'curser', 'timekeeper', 'armor'];
    return mech[Math.floor(Math.random() * mech.length)];
  }
  if (elite) {
    const pool = ['elite1', 'elite2', 'elite3'];
    return pool[Math.floor(floor / 30) % pool.length] || 'elite1';
  }
  if (floor < 20) return Math.random() < 0.5 ? 'shadow' : 'thug';
  if (floor < 50) return Math.random() < 0.5 ? 'thug' : 'elite1';
  if (floor < 80) return Math.random() < 0.5 ? 'elite1' : 'elite2';
  return Math.random() < 0.5 ? 'elite2' : 'elite3';
}

function pickEventForFloor() {
    const pool = Object.keys(EVENT_LIB);
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateFloorNodes(floor, count, forceElite = false) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    let type;
    const r = Math.random();
    if (forceElite) {
      type = 'elite';
    } else if (floor > 0 && floor % 10 === 0 && i === 1) {
      type = 'elite';
    } else if (r < 0.55) {
      type = 'battle';
    } else if (r < 0.75) {
      type = 'event';
    } else if (r < 0.9) {
      type = 'rest';
    } else {
      type = 'battle';
    }
    const node = { type, floor, index: i, visited: false };
    if (type === 'battle' || type === 'elite') node.enemyId = pickEnemyForFloor(floor, type === 'elite');
    if (type === 'event') node.eventId = pickEventForFloor();
    nodes.push(node);
  }
  return nodes;
}

function buildMap() {
  const floors = [];
  floors.push({ label: '入口', nodes: generateFloorNodes(0, 3, false) });
  for (let f = 1; f < TOTAL_FLOORS; f++) {
    if (f === TOTAL_FLOORS - 1) {
      floors.push({
        label: '黄昏塔顶',
        nodes: [{ type: 'boss', enemyId: 'boss', eventId: null, floor: f, index: 0, visited: false }]
      });
    } else {
      floors.push({ label: `第 ${f} 层`, nodes: generateFloorNodes(f, 3, false) });
    }
  }
  return floors;
}

/* ---------- 全局状态 ---------- */
let state = null;
let B = null;
let currentNode = null; // {floor, index}
let selectedCard = null;
let rewardCards = [];

function newGame() {
  state = {
    hp: 100,
    maxHp: 100,
      block: 0,
      strength: 0,
      dexterity: 0,
      sun: 0,
      statuses: { weak: 0, vulnerable: 0, timeLock: 0 },
    deck: startingDeck(),
    relics: ['sunflower_ribbon'],
    map: buildMap(),
    floor: 0,
    prevIndex: null,
    nodeIndex: null
  };
  B = null;
  selectedCard = null;
  currentNode = null;
  showScreen('screen-title');
}




/* ---------- 地图 ---------- */
function renderMap() {
  const container = $('map-container');
  container.innerHTML = '';
  const map = state.map;
  state.map.forEach((floor, fi) => {
    const col = document.createElement('div');
    col.className = 'map-column';
    const title = document.createElement('div');
    title.className = 'map-floor-title';
    title.textContent = floor.label;
    col.appendChild(title);

    floor.nodes.forEach((node, ni) => {
      const btn = document.createElement('div');
      btn.className = 'map-node';
      btn.dataset.floor = fi;
      btn.dataset.index = ni;
      const icon = nodeIcon(node);
      btn.textContent = icon.emoji;
      const label = document.createElement('span');
      label.className = 'node-label';
      label.textContent = icon.label;
      btn.appendChild(label);

      if (node.visited) {
        btn.classList.add('done');
      } else if (fi === state.floor && isReachable(fi, ni)) {
        btn.classList.add('reachable');
      } else if (fi < state.floor || fi > state.floor) {
        btn.classList.add('locked');
      } else {
        btn.classList.add('locked');
      }

      if (node.type === 'boss') btn.classList.add('boss');
      if (!node.visited && fi === state.floor && isReachable(fi, ni)) {
        btn.addEventListener('click', () => enterNode(fi, ni));
      }
      col.appendChild(btn);
    });

    container.appendChild(col);
  });

  $('map-floor-label').textContent = (state.floor < map.length ? map[state.floor].label : '塔顶') + (state.block > 0 ? `  格挡 ${state.block}` : '');
    const currentCol = container.children[state.floor];
    if (currentCol && currentCol.offsetLeft !== undefined) {
      container.scrollLeft = Math.max(0, currentCol.offsetLeft - container.clientWidth / 2);
    }
}

function nodeIcon(node) {
  switch (node.type) {
    case 'battle': return { emoji: '⚔️', label: '战斗' };
    case 'elite': return { emoji: '💀', label: '精英' };
    case 'event': return { emoji: '✨', label: '事件' };
    case 'rest': return { emoji: '🔥', label: '篝火' };
    case 'boss': return { emoji: '🏰', label: 'Boss' };
    default: return { emoji: '❓', label: '未知' };
  }
}

function isReachable(floor, index) {
  if (floor !== state.floor) return false;
  return true;
}

function enterNode(floor, index) {
  const node = state.map[floor].nodes[index];
  currentNode = { floor, index };
  if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
    const enemyIds = node.type === 'boss' ? ['boss_zero', 'boss_ling'] : [node.enemyId];
      startCombat(enemyIds, node.type === 'elite' || node.type === 'boss', floor);
  } else if (node.type === 'event') {
    startEvent(node.eventId);
  } else if (node.type === 'rest') {
    showRest();
  }
}

function completeNode() {
  if (!currentNode) return;
  const { floor, index } = currentNode;
  state.map[floor].nodes[index].visited = true;
  if (floor === state.map.length - 1) {
    showScreen('screen-victory');
    return;
  }
  state.prevIndex = index;
  state.floor = floor + 1;
  state.nodeIndex = null;
  currentNode = null;
  showScreen('screen-map');
  renderMap();
}

/* ---------- 战斗 ---------- */

function startCombat(enemyIds, isElite = false, floor = 0) {
  B = {
    player: {
      hp: state.hp,
      maxHp: state.maxHp,
        block: state.block || 0,
      energy: 3,
      maxEnergy: 3,
        strength: state.strength || 0,
        dexterity: state.dexterity || 0,
        sun: state.sun || 0,
      maxSun: 20,
      powers: {},
      hand: [],
      draw: [],
      discard: [],
      exhaust: [],
        statuses: { weak: state.statuses?.weak || 0, vulnerable: state.statuses?.vulnerable || 0, timeLock: state.statuses?.timeLock || 0 }
    },
    enemies: enemyIds.map(id => makeEnemy(id, floor)),
    turn: 0,
    isElite,
    floor,
    ended: false,
      enemyResolving: false,
    rewardGiven: false
  };

  B.player.draw = shuffle(state.deck.map(c => ({ ...c })));

  // 遗物：向日葵发带
    if (state.relics.includes('sunflower_ribbon') && state.strength === 0) B.player.strength += 1;

  startPlayerTurn();

  // 遗物：黄昏车票
  if (state.relics.includes('twilight_ticket')) drawCards(1);

  showScreen('screen-combat');
  updateCombatUI();
}


function startPlayerTurn() {
  if (B.ended) return;
  B.turn++;
  B.player.energy = B.player.maxEnergy;
    if (B.player.statuses.timeLock > 0) {
      B.player.energy = Math.max(0, B.player.energy - 1);
      B.player.statuses.timeLock--;
    }
  drawCards(5);
  if (state.relics.includes('dream_bell')) B.player.block += 1;
    if (B.player.powers.sunrise) B.player.sun = Math.min(B.player.maxSun, B.player.sun + B.player.powers.sunrise);
    if (B.player.powers.binding_vow) B.player.sun = Math.min(B.player.maxSun, B.player.sun + B.player.powers.binding_vow);
  selectedCard = null;
  B.enemies.forEach(e => {
    e.turnIndex = B.turn - 1;
  });
  updateCombatUI();
}

function drawCards(n) {
  const p = B.player;
  for (let i = 0; i < n; i++) {
    if (p.hand.length >= 10) break;
    if (p.draw.length === 0) {
      if (p.discard.length === 0) break;
      p.draw = shuffle(p.discard);
      p.discard = [];
    }
    p.hand.push(p.draw.pop());
  }
}

function endPlayerTurn() {
  if (B.ended || B.enemyResolving) return;
  ensureAudio();
  const p = B.player;
  p.discard.push(...p.hand);
  p.hand = [];
  selectedCard = null;
  p.statuses.weak = Math.max(0, p.statuses.weak - 1);
  p.statuses.vulnerable = Math.max(0, p.statuses.vulnerable - 1);
  B.enemyResolving = true;
  $('btn-end-turn').disabled = true;
  updateCombatUI();
  $('combat-state').textContent = '敌方回合';
  setTimeout(() => {
    enemyTurn();
    if (B.ended) return;
    updateCombatUI();
      $('combat-state').textContent = '敌方回合';
    setTimeout(() => {
      startPlayerTurn();
      B.enemyResolving = false;
      $('btn-end-turn').disabled = false;
    }, 700);
  }, 500);
}

function enemyTurn() {
  if (B.ended) return;
  B.enemies.forEach(enemy => {
    if (enemy.hp <= 0) return;
      enemy.block = 0;
    const intent = intentOf(enemy);
    if (intent.type === '攻击') {
        playAttackSound();
      let dmg = intent.value + enemy.strength;
      if (enemy.statuses.weak > 0) dmg = Math.max(0, Math.floor(dmg * 0.75));
      if (B.player.statuses.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
      const absorbed = Math.min(B.player.block, dmg);
      B.player.block -= absorbed;
      dmg -= absorbed;
      B.player.hp -= dmg;
        if (dmg > 0) playHitSound();
    } else if (intent.type === '防御') {
      enemy.block += intent.value;
    } else if (intent.type === '强化') {
      enemy.strength += 2;
    } else if (intent.type === '弱化') {
      B.player.statuses.vulnerable = (B.player.statuses.vulnerable || 0) + 1;
      } else if (intent.type === '治疗') {
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + 8 + Math.floor(enemy.level * 0.05));
      } else if (intent.type === '诅咒') {
        B.player.statuses.weak = (B.player.statuses.weak || 0) + 1;
        B.player.statuses.vulnerable = (B.player.statuses.vulnerable || 0) + 1;
      } else if (intent.type === '时停') {
        B.player.statuses.timeLock = (B.player.statuses.timeLock || 0) + 1;
    }

    // 敌人状态持续回合结束
    enemy.statuses.weak = Math.max(0, enemy.statuses.weak - 1);
    enemy.statuses.vulnerable = Math.max(0, enemy.statuses.vulnerable - 1);
    enemy.turnIndex++;
  });

  if (B.player.hp <= 0) {
    B.player.hp = 0;
    B.ended = true;
    showGameOver();
    return;
  }

  updateCombatUI();
}

function updateCombatUI() {
  if (!B) return;
  const p = B.player;
  $('player-hp').style.width = Math.max(0, p.hp / p.maxHp * 100) + '%';
  $('player-hp').textContent = `${p.hp}/${p.maxHp}`;
  $('player-block').style.width = Math.max(0, Math.min(100, p.block / 20 * 100)) + '%';
  $('player-block').textContent = p.block > 0 ? `格挡 ${p.block}` : '';
  $('energy-num').textContent = p.energy;
  $('draw-count').textContent = p.draw.length;
  $('discard-count').textContent = p.discard.length;
  $('exhaust-count').textContent = p.exhaust.length;

  const statusChips = [];
  if (p.block > 0) statusChips.push(`<span class="stat-chip block">格挡 ${p.block}</span>`);
    if (p.strength > 0) statusChips.push(`<span class="stat-chip buff">力量 ${p.strength}（永久）</span>`);
    if (p.dexterity > 0) statusChips.push(`<span class="stat-chip buff">敏捷 ${p.dexterity}（永久）</span>`);
    if (p.sun > 0) statusChips.push(`<span class="stat-chip sun">阳光 ${p.sun}/${p.maxSun}</span>`);
    if (p.statuses.weak > 0) statusChips.push(`<span class="stat-chip debuff">虚弱 ${p.statuses.weak} 回合</span>`);
    if (p.statuses.vulnerable > 0) statusChips.push(`<span class="stat-chip debuff">易伤 ${p.statuses.vulnerable} 回合</span>`);
    if (p.statuses.timeLock > 0) statusChips.push(`<span class="stat-chip debuff">时间紊乱 ${p.statuses.timeLock} 回合</span>`);
  $('player-status').innerHTML = statusChips.join('') || '<span class="stat-chip">状态良好</span>';

  const enemyArea = $('enemy-area');
  enemyArea.innerHTML = '';
  B.enemies.forEach((enemy, i) => {
    if (enemy.hp <= 0) return;
    const card = document.createElement('div');
    card.className = 'enemy-card';
    card.dataset.index = i;
    if (selectedCard && selectedCard.target === 'enemy') {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => playCardOnEnemy(selectedCard, i));
    }
    const intent = intentOf(enemy);
      const statusChips = [];
        if (enemy.strength > 0) statusChips.push(`<span class="stat-chip buff">力量 ${enemy.strength}（永久）</span>`);
        if (enemy.block > 0) statusChips.push(`<span class="stat-chip block">格挡 ${enemy.block}</span>`);
        if (enemy.thorns > 0) statusChips.push(`<span class="stat-chip debuff">反伤 ${enemy.thorns}</span>`);
        if (enemy.statuses.weak > 0) statusChips.push(`<span class="stat-chip debuff">虚弱 ${enemy.statuses.weak} 回合</span>`);
        if (enemy.statuses.vulnerable > 0) statusChips.push(`<span class="stat-chip debuff">易伤 ${enemy.statuses.vulnerable} 回合</span>`);

      card.innerHTML = `
        <div class="enemy-avatar">${enemy.emoji}</div>
        <div class="enemy-name">${enemy.name}</div>
        <div class="enemy-hp">HP ${Math.max(0, enemy.hp)}/${enemy.maxHp}</div>
        <div class="bar hp-bar"><span style="width:${Math.max(0, enemy.hp / enemy.maxHp * 100)}%"></span></div>
        <div class="enemy-intent">${intent.text}</div>
        <div class="enemy-status">${statusChips.join('')}</div>
      `;
    enemyArea.appendChild(card);
  });
  enemyArea.onclick = (ev) => {
    if (!selectedCard || selectedCard.target !== 'enemy') return;
    const targetEl = ev.target.closest ? ev.target.closest('.enemy-card') : null;
    if (!targetEl) return;
    const idx = parseInt(targetEl.dataset.index, 10);
    if (!isNaN(idx) && B.enemies[idx] && B.enemies[idx].hp > 0) {
      playCardOnEnemy(selectedCard, idx);
    }
  };

  $('combat-state').textContent = selectedCard && selectedCard.target === 'enemy' ? '请选择目标' : '战斗';
  renderHand();
  $('combat-floor').textContent = `黄昏塔 · ${state.map[currentNode ? currentNode.floor : state.floor].label}`;
}

function renderHand() {
  const area = $('hand-area');
  area.innerHTML = '';
  B.player.hand.forEach((card, idx) => {
    const el = document.createElement('div');
    el.className = `card ${card.type}${card.upgraded ? ' upgraded' : ''}`;
    el.innerHTML = `
      <div class="card-cost">${card.cost}</div>
      <div class="card-type">${card.type === 'attack' ? '攻击' : card.type === 'skill' ? '技能' : '能力'}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-desc">${card.desc}</div>
    `;
    const canAfford = B.player.energy >= card.cost;
    if (!canAfford) el.classList.add('disabled');
    if (canAfford) {
      el.addEventListener('click', () => {
        if (B.ended) return;
        if (card.target === 'enemy' && B.enemies.filter(e => e.hp > 0).length > 1) {
          selectedCard = card;
          updateCombatUI();
          return;
        }
        if (card.target === 'enemy') {
          const targetIndex = B.enemies.findIndex(e => e.hp > 0);
          playCardOnEnemy(card, targetIndex);
        } else {
          playCard(card, null);
        }
      });
    }
    area.appendChild(el);
  });
}

function playCardOnEnemy(card, enemyIndex) {
  if (!B || B.ended) return;
  if (B.player.energy < card.cost) return;
  const enemy = B.enemies[enemyIndex];
  if (!enemy || enemy.hp <= 0) return;
  B.player.energy -= card.cost;
    if (card.type === 'attack') playAttackSound();
  applyCard(card, enemyIndex);
  const idx = B.player.hand.indexOf(card);
  if (idx >= 0) B.player.hand.splice(idx, 1);
    if (card.exhaust) B.player.exhaust.push(card); else B.player.discard.push(card);
  selectedCard = null;
  checkCombatEnd();
  updateCombatUI();
}

function playCard(card, enemyIndex) {
  if (!B || B.ended) return;
  if (B.player.energy < card.cost) return;
  B.player.energy -= card.cost;
    if (card.type === 'attack') playAttackSound();
  applyCard(card, enemyIndex);
  const idx = B.player.hand.indexOf(card);
  if (idx >= 0) B.player.hand.splice(idx, 1);
    if (card.exhaust) B.player.exhaust.push(card); else B.player.discard.push(card);
  selectedCard = null;
  checkCombatEnd();
  updateCombatUI();
}

function checkCombatEnd() {
  if (!B || B.ended) return;
  if (B.enemies.every(e => e.hp <= 0)) {
    B.ended = true;
    state.hp = B.player.hp;
      state.block = B.player.block;
      state.strength = B.player.strength;
      state.dexterity = B.player.dexterity;
      state.sun = B.player.sun;
      state.statuses = { weak: B.player.statuses.weak, vulnerable: B.player.statuses.vulnerable, timeLock: B.player.statuses.timeLock };
    if (state.relics.includes('rain_pendant')) healPlayer(3);

    const isBoss = currentNode && state.map[currentNode.floor].nodes[currentNode.index].type === 'boss';
    if (isBoss) {
      completeNode();
      return;
    }

    if (B.isElite) {
      const newRelic = rollRelic();
      if (newRelic) {
        addRelic(newRelic);
        showReward(`精英胜利！获得遗物【${RELIC_LIB[newRelic].name}】`, 3);
      } else {
        showReward('精英胜利！遗物已经集齐，选择一张卡牌加入卡组。', 3);
      }
    } else {
      showReward('战斗胜利！选择一张卡牌加入卡组。', 3);
    }
  }
}

function applyEffectType(card, lib, target) {
  const p = B.player;
  const val = card.upgraded && lib.valueUp != null ? lib.valueUp : lib.value;
  const val2 = card.upgraded && lib.value2Up != null ? lib.value2Up : (lib.value2 || 0);
  const val3 = card.upgraded && lib.value3Up != null ? lib.value3Up : (lib.value3 || 0);
  const dmg = (base) => Math.max(0, base + p.strength);
  const block = (base) => base + p.dexterity;
  switch (lib.effectType) {
    case 'damage': damageEnemy(target, dmg(val)); break;
    case 'block': p.block += block(val); break;
    case 'draw': drawCards(val); break;
    case 'energy': p.energy += val; break;
    case 'sun': p.sun = Math.min(p.maxSun, p.sun + val); break;
    case 'weak': if (target) target.statuses.weak = (target.statuses.weak || 0) + val; break;
    case 'vuln': if (target) target.statuses.vulnerable = (target.statuses.vulnerable || 0) + val; break;
    case 'strength': p.strength += val; break;
    case 'dexterity': p.dexterity += val; break;
    case 'heal': healPlayer(val); break;
    case 'aoe_damage': B.enemies.forEach(e => { if (e.hp > 0) damageEnemy(e, dmg(val)); }); break;
    case 'damage_twice': damageEnemy(target, dmg(val)); damageEnemy(target, dmg(val)); break;
    case 'damage_thrice': damageEnemy(target, dmg(val)); damageEnemy(target, dmg(val)); damageEnemy(target, dmg(val)); break;
    case 'block_twice': p.block += block(val); p.block += block(val); break;
    case 'damage_block': damageEnemy(target, dmg(val)); p.block += block(val2); break;
    case 'damage_draw': damageEnemy(target, dmg(val)); drawCards(val2); break;
    case 'damage_sun': damageEnemy(target, dmg(val)); p.sun = Math.min(p.maxSun, p.sun + val2); break;
    case 'block_sun': p.block += block(val); p.sun = Math.min(p.maxSun, p.sun + val2); break;
    case 'draw_energy': drawCards(val); p.energy += val2; break;
    case 'all_vuln': B.enemies.forEach(e => { if (e.hp > 0) e.statuses.vulnerable = (e.statuses.vulnerable || 0) + val; }); break;
    case 'all_weak': B.enemies.forEach(e => { if (e.hp > 0) e.statuses.weak = (e.statuses.weak || 0) + val; }); break;
    case 'damage_vuln': damageEnemy(target, dmg(val)); if (target) target.statuses.vulnerable = (target.statuses.vulnerable || 0) + val2; break;
    case 'damage_weak': damageEnemy(target, dmg(val)); if (target) target.statuses.weak = (target.statuses.weak || 0) + val2; break;
    case 'block_draw': p.block += block(val); drawCards(val2); break;
    case 'sun_draw': p.sun = Math.min(p.maxSun, p.sun + val); drawCards(val2); break;
    case 'block_weak': p.block += block(val); if (target) target.statuses.weak = (target.statuses.weak || 0) + val2; break;
    case 'aoe_weak': B.enemies.forEach(e => { if (e.hp > 0) { damageEnemy(e, dmg(val)); e.statuses.weak = (e.statuses.weak || 0) + val2; } }); break;
    case 'aoe_vuln': B.enemies.forEach(e => { if (e.hp > 0) { damageEnemy(e, dmg(val)); e.statuses.vulnerable = (e.statuses.vulnerable || 0) + val2; } }); break;
    case 'damage_heal': damageEnemy(target, dmg(val)); healPlayer(val2); break;
    case 'damage_block_draw': damageEnemy(target, dmg(val)); p.block += block(val2); drawCards(val3); break;
    case 'power_strength': p.strength += val; break;
    case 'power_dexterity': p.dexterity += val; break;
    case 'power_sunrise': p.powers.sunrise = val; break;
    case 'power_strength_sun': p.strength += val; p.powers.binding_vow = card.upgraded ? 2 : 1; break;
    case 'power_dex_heal': p.dexterity += val; healPlayer(val2); break;
    case 'random_discard_to_hand':
      if (B.player.discard.length > 0) {
        const ri = Math.floor(Math.random() * B.player.discard.length);
        const c = B.player.discard.splice(ri, 1)[0];
        if (B.player.hand.length < 10) B.player.hand.push(c); else B.player.discard.push(c);
      }
      break;
    case 'lose_hp_draw_energy': B.player.hp = Math.max(1, B.player.hp - val); drawCards(val2); p.energy += val3; break;
    case 'exhaust_damage': damageEnemy(target, dmg(val)); break;
    case 'exhaust_block': p.block += block(val); break;
    case 'exhaust_draw_energy': drawCards(val); p.energy += val2; break;
    case 'power_strength_dex': p.strength += val; p.dexterity += val2; break;
    case 'all_vuln_weak': B.enemies.forEach(e => { if (e.hp > 0) { e.statuses.vulnerable = (e.statuses.vulnerable || 0) + val; e.statuses.weak = (e.statuses.weak || 0) + val2; } }); break;
    case 'heal_draw': healPlayer(val); drawCards(val2); break;
    case 'block_heal': p.block += block(val); healPlayer(val2); break;
    case 'sun_heal': p.sun = Math.min(p.maxSun, p.sun + val); healPlayer(val2); break;
    case 'damage_block_sun': damageEnemy(target, dmg(val)); p.block += block(val2); p.sun = Math.min(p.maxSun, p.sun + val3); break;
    default: break;
  }
}

function applyCard(card, enemyIndex) {
  const p = B.player;
  const target = enemyIndex != null ? B.enemies[enemyIndex] : null;
  const dmg = (base) => Math.max(0, base + p.strength);
  const block = (base) => base + p.dexterity;

  const libCard = CARD_LIB[card.id];
  if (libCard.effectType) {
    applyEffectType(card, libCard, target);
    return;
  }

  switch (card.id) {
    case 'strike':
      damageEnemy(target, dmg(card.upgraded ? 9 : 6));
      break;
    case 'defend':
      p.block += block(card.upgraded ? 8 : 5);
      break;
    case 'dream_shard':
      drawCards(card.upgraded ? 2 : 1);
      break;
    case 'dusk_light':
      damageEnemy(target, dmg(card.upgraded ? 17 : 13));
      break;
    case 'sunflower_armor':
      p.block += block(card.upgraded ? 11 : 8);
      break;
    case 'galaxy_train':
      drawCards(card.upgraded ? 3 : 2);
      p.energy += 1;
      break;
    case 'flower_combo': {
      const n = card.upgraded ? 5 : 4;
      damageEnemy(target, dmg(n));
      damageEnemy(target, dmg(n));
      break;
    }
    case 'rain_curtain':
      p.block += block(card.upgraded ? 8 : 6);
      if (target) target.statuses.weak = (target.statuses.weak || 0) + 1;
      break;
    case 'tyrant_press':
      damageEnemy(target, dmg(card.upgraded ? 7 : 5));
      if (target) target.statuses.vulnerable = (target.statuses.vulnerable || 0) + 1;
      break;
    case 'dictator_order':
      B.enemies.forEach(e => {
        if (e.hp > 0) e.statuses.vulnerable = (e.statuses.vulnerable || 0) + (card.upgraded ? 3 : 2);
      });
      break;
    case 'golden_wreath':
      p.strength += card.upgraded ? 2 : 1;
      break;
    case 'dew_blessing':
      p.dexterity += card.upgraded ? 2 : 1;
      break;
    case 'time_shard':
      drawCards(card.upgraded ? 2 : 1);
      p.energy += 1;
      break;
    case 'dusk_oath':
      damageEnemy(target, dmg(card.upgraded ? 11 : 8));
      healPlayer(card.upgraded ? 6 : 4);
      break;
    case 'sunflower_miracle':
      p.strength += card.upgraded ? 3 : 2;
      p.dexterity += card.upgraded ? 3 : 2;
      break;
    case 'galaxy_wedding':
      healPlayer(card.upgraded ? 24 : 18);
      p.block += block(card.upgraded ? 14 : 10);
      break;
    case 'final_light':
      damageEnemy(target, dmg(card.upgraded ? 30 : 24));
      break;
      case 'sun_prayer':
        p.sun = Math.min(p.maxSun, p.sun + (card.upgraded ? 2 : 1));
        drawCards(1);
        break;
      case 'sun_beam':
        damageEnemy(target, dmg(card.upgraded ? 7 : 5));
        p.sun = Math.min(p.maxSun, p.sun + 1);
        break;
      case 'solar_flare':
        B.enemies.forEach(e => { if (e.hp > 0) damageEnemy(e, dmg(card.upgraded ? 11 : 8)); });
        p.sun = Math.min(p.maxSun, p.sun + 2);
        break;
      case 'blazing_ray': {
        damageEnemy(target, dmg(card.upgraded ? 6 : 4));
        if (p.sun >= 2) {
          p.sun -= 2;
          damageEnemy(target, dmg(card.upgraded ? 12 : 10));
        }
        break;
      }
      case 'sun_shield':
        p.block += block(card.upgraded ? 9 : 6);
        p.sun = Math.min(p.maxSun, p.sun + 1);
        break;
      case 'sunrise':
        p.powers.sunrise = card.upgraded ? 2 : 1;
        break;
      case 'binding_vow':
        p.strength += card.upgraded ? 2 : 1;
        p.powers.binding_vow = card.upgraded ? 2 : 1;
        break;
      case 'comet_strike': {
        const n = card.upgraded ? 8 : 6;
        damageEnemy(target, dmg(n));
        damageEnemy(target, dmg(n));
        damageEnemy(target, dmg(n));
        break;
      }
      case 'dream_loop':
        drawCards(card.upgraded ? 3 : 2);
        if (B.player.discard.length > 0) {
          const ri = Math.floor(Math.random() * B.player.discard.length);
          const c = B.player.discard.splice(ri, 1)[0];
          if (B.player.hand.length < 10) B.player.hand.push(c); else B.player.discard.push(c);
        }
        break;
      case 'petal_armor':
        p.block += block(card.upgraded ? 7 : 5);
        p.block += block(card.upgraded ? 7 : 5);
        break;
      case 'gentle_rain':
        healPlayer(card.upgraded ? 5 : 3);
        p.block += block(card.upgraded ? 6 : 4);
        break;
      case 'twilight_ritual':
        p.energy += card.upgraded ? 3 : 2;
        drawCards(card.upgraded ? 3 : 2);
        B.player.hp = Math.max(1, B.player.hp - 3);
        break;
      case 'last_sunlight': {
        damageEnemy(target, dmg(card.upgraded ? 14 : 10));
        if (target && target.statuses.vulnerable > 0) damageEnemy(target, dmg(card.upgraded ? 10 : 8));
        break;
      }
      case 'queen_order':
        B.enemies.forEach(e => {
          if (e.hp > 0) {
            damageEnemy(e, dmg(card.upgraded ? 9 : 6));
            e.statuses.vulnerable = (e.statuses.vulnerable || 0) + 1;
          }
        });
        break;
      case 'star_fall': {
        const bonus = p.sun * (card.upgraded ? 2 : 1);
        damageEnemy(target, dmg((card.upgraded ? 18 : 14) + bonus));
        p.sun = 0;
        break;
      }
  }
}

function damageEnemy(enemy, dmg) {
  if (!enemy || enemy.hp <= 0) return;
  if (enemy.statuses.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
    if (B.player.statuses.weak > 0) dmg = Math.max(0, Math.floor(dmg * 0.75));
  const absorbed = Math.min(enemy.block, dmg);
  enemy.block -= absorbed;
  dmg -= absorbed;
  enemy.hp -= dmg;
    if (dmg > 0) playHitSound();
  if (enemy.thorns > 0 && dmg > 0) {
    B.player.hp -= enemy.thorns;
      playHitSound();
    if (B.player.hp <= 0) { B.player.hp = 0; B.ended = true; showGameOver(); }
  }
  if (enemy.hp <= 0) enemy.hp = 0;
}

function healPlayer(amount) {
  state.hp = Math.min(state.maxHp, state.hp + amount);
  if (B) B.player.hp = state.hp;
}



function rollRelic() {
  const pool = ['twilight_ticket', 'dream_bell', 'rain_pendant'];
  const available = pool.filter(r => !state.relics.includes(r));
  return available.length ? rand(available) : null;
}

/* ---------- 奖励 ---------- */
function showReward(desc, count) {
  rewardCards = [];
  const commonIds = Object.keys(CARD_LIB).filter(id => CARD_LIB[id].rarity === 'common');
  const uncommonIds = Object.keys(CARD_LIB).filter(id => CARD_LIB[id].rarity === 'uncommon');
  const rareIds = Object.keys(CARD_LIB).filter(id => CARD_LIB[id].rarity === 'rare');
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let id;
    if (roll < 0.6) id = rand(commonIds);
    else if (roll < 0.88) id = rand(uncommonIds);
    else id = rand(rareIds);
    rewardCards.push(createCard(id, false));
  }
  $('reward-desc').textContent = desc;
  const area = $('reward-cards');
  area.innerHTML = '';
  rewardCards.forEach(card => {
    const el = document.createElement('div');
    el.className = `card ${card.type}`;
    el.innerHTML = `
      <div class="card-cost">${card.cost}</div>
      <div class="card-type">${card.type === 'attack' ? '攻击' : card.type === 'skill' ? '技能' : '能力'}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-desc">${card.desc}</div>
    `;
    el.addEventListener('click', () => {
      state.deck.push(card);
      completeNode();
    });
    area.appendChild(el);
  });
  showScreen('screen-reward');
}

/* ---------- 事件 ---------- */
function startEvent(eventId) {
  const ev = EVENT_LIB[eventId];
  $('event-title').textContent = ev.title;
  $('event-story').textContent = ev.story;
  const area = $('event-choices');
  area.innerHTML = '';
  ev.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = choice.text;
    btn.addEventListener('click', () => {
      choice.effect();
      completeNode();
    });
    area.appendChild(btn);
  });
  $('btn-event-continue').style.display = 'none';
  showScreen('screen-event');
}

/* ---------- 休息 ---------- */
function showRest() {
  $('rest-heal-info')?.remove();
  $('btn-rest-heal').style.display = '';
  $('btn-rest-upgrade').style.display = '';
  $('upgrade-panel').style.display = 'none';
  $('btn-rest-continue').style.display = 'none';
  showScreen('screen-rest');
}

function bindRest() {
  $('btn-rest-heal').addEventListener('click', () => {
    const amount = Math.max(1, Math.floor(state.maxHp * 0.3));
    healPlayer(amount);
    $('btn-rest-heal').style.display = 'none';
    $('btn-rest-upgrade').style.display = 'none';
    $('btn-rest-continue').style.display = '';
    $('rest-inner').insertAdjacentHTML('beforeend', `<p id="rest-heal-info" style="text-align:center;color:var(--leaf);margin-top:14px;">回复了 ${amount} 点生命。</p>`);
  });

  $('btn-rest-upgrade').addEventListener('click', () => {
    const panel = $('upgrade-panel');
    panel.innerHTML = '';
    panel.style.display = 'flex';
    const upgradable = state.deck.filter(c => !c.upgraded);
    if (!upgradable.length) {
      panel.style.display = 'none';
      $('btn-rest-heal').style.display = 'none';
      $('btn-rest-upgrade').style.display = 'none';
      $('btn-rest-continue').style.display = '';
      $('rest-inner').insertAdjacentHTML('beforeend', '<p id="rest-heal-info" style="text-align:center;color:var(--leaf);margin-top:14px;">没有可升级的卡牌。</p>');
      return;
    }
    state.deck.forEach((card, idx) => {
      const el = document.createElement('div');
      el.className = `card ${card.type}${card.upgraded ? ' upgraded' : ''}`;
      el.innerHTML = `
        <div class="card-cost">${card.cost}</div>
        <div class="card-type">${card.type === 'attack' ? '攻击' : card.type === 'skill' ? '技能' : '能力'}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-desc">${card.desc}</div>
      `;
      if (card.upgraded) {
        el.classList.add('disabled');
      } else {
        el.addEventListener('click', () => {
          const upgraded = createCard(card.id, true);
          state.deck[idx] = upgraded;
          panel.innerHTML = '';
          panel.style.display = 'none';
          $('btn-rest-heal').style.display = 'none';
          $('btn-rest-upgrade').style.display = 'none';
          $('btn-rest-continue').style.display = '';
          $('rest-inner').insertAdjacentHTML('beforeend', `<p id="rest-heal-info" style="text-align:center;color:var(--leaf);margin-top:14px;">${upgraded.name} 已升级！</p>`);
        });
      }
      panel.appendChild(el);
    });
  });

  $('btn-rest-continue').addEventListener('click', () => {
    completeNode();
  });
}




/* ---------- 卡组查看 ---------- */
function showDeckView(backTo) {
  const list = $('deck-list');
  list.innerHTML = '';
  state.deck.forEach((card, idx) => {
    const el = document.createElement('div');
    el.className = `card ${card.type}${card.upgraded ? ' upgraded' : ''}`;
    el.innerHTML = `
      <div class="card-cost">${card.cost}</div>
      <div class="card-type">${card.type === 'attack' ? '攻击' : card.type === 'skill' ? '技能' : '能力'}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-desc">${card.desc}</div>
    `;
    list.appendChild(el);
  });
  $('btn-deck-close').dataset.back = backTo || 'screen-map';
  showScreen('screen-deck');
}

/* ---------- 卡牌操作辅助 ---------- */
function addCardToDeck(id) {
  state.deck.push(createCard(id, false));
}

function addRandomCardToDeck(rarity) {
  const pool = Object.keys(CARD_LIB).filter(id => CARD_LIB[id].rarity === (rarity || 'common'));
  if (!pool.length) return;
  state.deck.push(createCard(rand(pool), false));
}

function addRelic(id) {
  if (!state.relics.includes(id)) state.relics.push(id);
}

function upgradeRandomCard() {
  const upgradable = state.deck.map((c, i) => ({ c, i })).filter(x => !x.c.upgraded);
  if (!upgradable.length) return;
  const pick = rand(upgradable);
  state.deck[pick.i] = createCard(pick.c.id, true);
}

/* ---------- 结算 ---------- */
function showGameOver() {
  $('gameover-text').textContent = `熙叆倒在了${state.map[currentNode ? currentNode.floor : state.floor].label}。但她的执念不会消失……`;
  showScreen('screen-gameover');
}

/* ---------- 初始化装饰 ---------- */
function initStars() {
  const container = $('stars');
  for (let i = 0; i < 22; i++) {
    const d = document.createElement('div');
    d.className = Math.random() < 0.35 ? 'petal' : 'dust';
    d.style.left = Math.random() * 100 + '%';
    d.style.top = Math.random() * 100 + '%';
    d.style.width = (Math.random() * 8 + 4) + 'px';
    d.style.height = d.style.width;
    d.style.setProperty('--dur', (Math.random() * 14 + 8) + 's');
    if (d.className === 'petal') {
      d.style.width = (Math.random() * 8 + 10) + 'px';
      d.style.height = (Math.random() * 12 + 14) + 'px';
    }
    container.appendChild(d);
  }
}

/* ---------- 事件绑定 ---------- */
function bindButtons() {
  $('btn-start').addEventListener('click', () => {
    newGame();
    showScreen('screen-map');
    renderMap();
  });

  $('btn-help').addEventListener('click', () => showScreen('screen-help'));

  $('btn-help-back').addEventListener('click', () => showScreen('screen-title'));

  $('btn-reward-continue').addEventListener('click', () => {
    completeNode();
  });

  $('btn-end-turn').addEventListener('click', () => {
    if (B && !B.ended) endPlayerTurn();
  });



  $('btn-view-deck').addEventListener('click', () => {
    if (B) showDeckView('screen-combat');
  });

  $('btn-deck-close').addEventListener('click', () => {
    const back = $('btn-deck-close').dataset.back || 'screen-map';
    if (back === 'screen-combat' && B && !B.ended) {
      showScreen('screen-combat');
      updateCombatUI();
    } else {
      showScreen(back);
      if (back === 'screen-map') renderMap();
    }
  });

  $('btn-map-debug').addEventListener('click', () => showDeckView('screen-map'));

  $('btn-gameover-retry').addEventListener('click', () => {
    newGame();
    showScreen('screen-map');
    renderMap();
  });

  $('btn-victory-retry').addEventListener('click', () => {
    newGame();
    showScreen('screen-map');
    renderMap();
  });

  bindRest();
}

/* ---------- 启动 ---------- */
initStars();
bindButtons();
newGame();
