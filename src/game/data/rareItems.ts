import type { RareItemDefinition } from '../domain/types';

export const rareItems: RareItemDefinition[] = [
  {
    id: 'name_tag',
    name: '誰かの名前札',
    category: 'rare_item',
    tags: ['fusion', 'name', 'paper'],
    description: '夜の鉛筆Lv5と合体して、名前を刻む進化武器になる。',
    lore: '持ち主の名前だけが、黒く塗りつぶされずに残っている。',
  },
  {
    id: 'cracked_lens',
    name: 'ひび割れたレンズ',
    category: 'rare_item',
    tags: ['fusion', 'glass', 'memory'],
    description: 'ビー玉Lv5と合体して、記憶を映す進化武器になる。',
    lore: '割れているのに、失くした景色だけはよく見える。',
  },
  {
    id: 'sealed_letter',
    name: '封のされた手紙',
    category: 'rare_item',
    tags: ['fusion', 'letter', 'paper'],
    description: '絵はがきカッターLv5と合体して、宛先を探す進化武器になる。',
    lore: 'まだ開けてはいけない。けれど、もう届いている。',
  },
  {
    id: 'wind_mark',
    name: '風のしるし',
    category: 'rare_item',
    tags: ['fusion', 'wind', 'ticket'],
    description: '紙ひこうきLv5と合体して、夜を巡る進化武器になる。',
    lore: '折り目のすきまに、まだ飛べる風が残っている。',
  },
];

export const rareItemById = new Map(rareItems.map((item) => [item.id, item]));
