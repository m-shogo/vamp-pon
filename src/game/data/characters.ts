import type { CharacterDefinition } from '../domain/types';
import { characterArtById } from './characterArts';

const yuiArts = characterArtById.get('yui')!.arts;
const asaArts = characterArtById.get('asa')!.arts;
const nagiArts = characterArtById.get('nagi')!.arts;
const michiruArts = characterArtById.get('michiru')!.arts;
const tomoriArts = characterArtById.get('tomori')!.arts;

export const characters: CharacterDefinition[] = [
  {
    id: 'yui',
    name: 'ユイ',
    title: '忘れ物係',
    role: '初心者向け / 回収型 / 安定型',
    initialWeaponId: 'night_pencil',
    baseStats: { hp: 110, moveSpeed: 115, might: 1.0, cooldownMultiplier: 1.0, magnetMultiplier: 1.15, xpMultiplier: 1.0 },
    arts: yuiArts,
    ultimate: {
      id: 'unforgotten_name',
      name: yuiArts.dawnLight.name,
      chargeSeconds: 60,
      trigger: 'manual',
      effect: { type: 'pull_and_convert', radius: 260, duration: 2.2, damage: 20, smallEnemyOnly: true, dropBonus: 1 },
      description: '周囲の欠片を吸い寄せ、小さな影を記憶の欠片に戻す。',
      lore: '名前を呼ばれた影は、少しだけ元の形を思い出す。',
    },
    description: '夜のあいだ、忘れられた物を集めてまわる子。',
    lore: '名前を失った物を、もう一度呼び戻している。',
  },
  {
    id: 'asa',
    name: 'アサ',
    title: '名を結ぶ子',
    role: '名づけ / 紙片 / 前方型',
    initialWeaponId: 'postcard_blade',
    baseStats: { hp: 96, moveSpeed: 122, might: 1.04, cooldownMultiplier: 0.98, magnetMultiplier: 1.0, xpMultiplier: 1.05 },
    arts: asaArts,
    ultimate: {
      id: 'name_tied_at_dawn',
      name: asaArts.dawnLight.name,
      chargeSeconds: 62,
      trigger: 'manual',
      effect: { type: 'pull_and_convert', radius: 235, duration: 1.9, damage: 26, smallEnemyOnly: false, dropBonus: 1 },
      description: 'ほどけかけた名前を結び、記憶片へ戻す。',
      lore: '名づけることは、思い出すための約束だった。',
    },
    description: '夜にほどけた名前を、紙片に結び直す子。',
    lore: '名札は、帰る場所を思い出すためにある。',
  },
  {
    id: 'nagi',
    name: 'ナギ',
    title: '月箱の番',
    role: '防御 / 封じる / 近距離安定型',
    initialWeaponId: 'moon_bookmark',
    baseStats: { hp: 124, moveSpeed: 104, might: 0.94, cooldownMultiplier: 0.96, magnetMultiplier: 0.95, xpMultiplier: 1.0 },
    arts: nagiArts,
    ultimate: {
      id: 'box_that_stores_the_night',
      name: nagiArts.dawnLight.name,
      chargeSeconds: 64,
      trigger: 'manual',
      effect: { type: 'pull_and_convert', radius: 220, duration: 2.1, damage: 18, smallEnemyOnly: false, dropBonus: 0 },
      description: '溢れた夜を箱にしまい、周囲を静める。',
      lore: 'しまうことは、捨てることではない。',
    },
    description: '月箱と鍵を持ち、危ない記憶を静かにしまう子。',
    lore: '開けてはいけない箱を、朝まで守る役目を知っている。',
  },
  {
    id: 'michiru',
    name: 'ミチル',
    title: '帰り道の案内人',
    role: '誘導 / 地図線 / 範囲支援型',
    initialWeaponId: 'streetlamp_ring',
    baseStats: { hp: 104, moveSpeed: 118, might: 0.98, cooldownMultiplier: 0.94, magnetMultiplier: 1.05, xpMultiplier: 1.0 },
    arts: michiruArts,
    ultimate: {
      id: 'star_of_the_way_home',
      name: michiruArts.dawnLight.name,
      chargeSeconds: 60,
      trigger: 'manual',
      effect: { type: 'pull_and_convert', radius: 280, duration: 2.0, damage: 18, smallEnemyOnly: false, dropBonus: 1 },
      description: '帰り道の星を灯し、迷ったものを記憶片へ導く。',
      lore: '針は北ではなく、帰るべき場所を向いている。',
    },
    description: '地図線とコンパスで、夜の帰り道を探す子。',
    lore: '道は、失くした人のために引くもの。',
  },
  {
    id: 'tomori',
    name: 'トモリ',
    title: '継火の修理係',
    role: '修理 / 継火 / 継続型',
    initialWeaponId: 'black_ink_bottle',
    baseStats: { hp: 112, moveSpeed: 108, might: 1.02, cooldownMultiplier: 0.95, magnetMultiplier: 1.0, xpMultiplier: 0.98 },
    arts: tomoriArts,
    ultimate: {
      id: 'light_that_repairs_the_night',
      name: tomoriArts.dawnLight.name,
      chargeSeconds: 63,
      trigger: 'manual',
      effect: { type: 'pull_and_convert', radius: 240, duration: 2.0, damage: 24, smallEnemyOnly: false, dropBonus: 1 },
      description: '破れた夜を縫い直し、朝へ送り返す。',
      lore: '直す手は、壊れたものを責めない。',
    },
    description: '修理ランプと道具袋で、壊れた灯りを継ぐ子。',
    lore: '火は新しく作るより、継ぐほうが難しい。',
  },
];

export const characterById = new Map(characters.map((c) => [c.id, c]));

export const DEFAULT_CHARACTER_ID = 'yui';
