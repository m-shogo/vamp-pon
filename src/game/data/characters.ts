import type { CharacterDefinition } from '../domain/types';

export const characters: CharacterDefinition[] = [
  {
    id: 'yui',
    name: 'ユイ',
    title: '忘れ物係',
    role: '初心者向け / 回収型 / 安定型',
    initialWeaponId: 'night_pencil',
    baseStats: {
      hp: 100,
      moveSpeed: 100,
      might: 1.0,
      cooldownMultiplier: 1.0,
      magnetMultiplier: 1.15,
      xpMultiplier: 1.0,
    },
    ultimate: {
      id: 'unforgotten_name',
      name: '消えない名前',
      chargeSeconds: 90,
      trigger: 'manual',
      effect: {
        type: 'pull_and_convert',
        radius: 260,
        duration: 2.2,
        damage: 20,
        smallEnemyOnly: true,
        dropBonus: 1,
      },
      description: '周囲の欠片を吸い寄せ、小さな影を記憶の欠片に戻す。',
      lore: '名前を呼ばれた影は、少しだけ元の形を思い出す。',
    },
    description: '夜のあいだ、忘れられた物を集めてまわる子。',
    lore: '名前を失った物を、もう一度呼び戻している。',
  },
];

export const characterById = new Map(characters.map((c) => [c.id, c]));

export const DEFAULT_CHARACTER_ID = 'yui';
