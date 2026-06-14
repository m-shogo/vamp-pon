import type { RareItemDefinition } from '../domain/types';

export const rareItems: RareItemDefinition[] = [
  {
    id: 'name_tag',
    name: '誰かの名前札',
    category: 'rare_item',
    tags: ['awakening', 'name', 'paper'],
    description: '夜の鉛筆Lv5を覚醒させ、名前を刻む武器に変える。',
    lore: '持ち主の名前だけが、黒く塗りつぶされずに残っている。',
  },
  {
    id: 'cracked_lens',
    name: 'ひび割れたレンズ',
    category: 'rare_item',
    tags: ['awakening', 'glass', 'memory'],
    description: 'ビー玉Lv5を覚醒させ、記憶を映す武器に変える。',
    lore: '割れているのに、失くした景色だけはよく見える。',
  },
  {
    id: 'sealed_letter',
    name: '封のされた手紙',
    category: 'rare_item',
    tags: ['awakening', 'letter', 'paper'],
    description: '絵はがきカッターLv5を覚醒させ、宛先を探す武器に変える。',
    lore: 'まだ開けてはいけない。けれど、もう届いている。',
  },
  {
    id: 'wind_mark',
    name: '風のしるし',
    category: 'rare_item',
    tags: ['awakening', 'wind', 'ticket'],
    description: '紙ひこうきLv5を覚醒させ、夜を巡る武器に変える。',
    lore: '折り目のすきまに、まだ飛べる風が残っている。',
  },
];

export const rareItemById = new Map(rareItems.map((item) => [item.id, item]));
