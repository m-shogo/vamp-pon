import type { RareItemDefinition } from '../domain/types';

export const rareItems: RareItemDefinition[] = [
  {
    id: 'name_tag',
    name: '誰かの名前札',
    category: 'rare_item',
    role: 'awakening_material',
    tags: ['awakening', 'name', 'paper'],
    description: '夜の鉛筆Lv5を覚醒させ、名前を刻む武器に変える。',
    lore: '持ち主の名前だけが、黒く塗りつぶされずに残っている。',
  },
  {
    id: 'cracked_lens',
    name: 'ひび割れたレンズ',
    category: 'rare_item',
    role: 'awakening_material',
    tags: ['awakening', 'glass', 'memory'],
    description: 'ビー玉Lv5を覚醒させ、記憶を映す武器に変える。',
    lore: '割れているのに、失くした景色だけはよく見える。',
  },
  {
    id: 'sealed_letter',
    name: '封のされた手紙',
    category: 'rare_item',
    role: 'awakening_material',
    tags: ['awakening', 'letter', 'paper'],
    description: '絵はがきカッターLv5を覚醒させ、宛先を探す武器に変える。',
    lore: 'まだ開けてはいけない。けれど、もう届いている。',
  },
  {
    id: 'wind_mark',
    name: '風のしるし',
    category: 'rare_item',
    role: 'awakening_material',
    tags: ['awakening', 'wind', 'ticket'],
    description: '紙ひこうきLv5を覚醒させ、夜を巡る武器に変える。',
    lore: '折り目のすきまに、まだ飛べる風が残っている。',
  },
  {
    id: 'dawn_ticket',
    name: '夜明けの切符',
    category: 'rare_item',
    role: 'survival_revival',
    tags: ['revival', 'dawn', 'ticket'],
    description: '倒れた時、一度だけ最大HPの30%で復帰する。',
    lore: '消えかけた切符の端に、帰り道を示す小さな朝が灯っている。',
  },
];

export const rareItemById = new Map(rareItems.map((item) => [item.id, item]));
