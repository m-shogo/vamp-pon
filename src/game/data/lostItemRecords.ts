export type LostItemRecord = {
  id: string;
  nameJa: string;
  nameEn: string;
  ownerHint: string;
  itemType: 'bag' | 'paper' | 'lamp' | 'thread' | 'coin' | 'key';
  memoryText: string;
  unlockHint: string;
  accent: number;
  tags: string[];
};

export const lostItemRecords: LostItemRecord[] = [
  {
    id: 'lost-small-bag-tag',
    nameJa: '名前の消えた荷札',
    nameEn: 'Nameless Bag Tag',
    ownerHint: '誰かが帰り道を忘れないよう、かばんにつけていた札。',
    itemType: 'bag',
    memoryText: '名前が消えても、帰りたかった気持ちはまだ残っている。',
    unlockHint: 'かばんヨリシロを鎮めると、輪郭が濃くなります。',
    accent: 0xd7a65b,
    tags: ['bag', 'name', 'return'],
  },
  {
    id: 'lost-folded-map-corner',
    nameJa: '折れた地図の角',
    nameEn: 'Folded Map Corner',
    ownerHint: '目的地ではなく、迷った場所ばかりに印がついた地図片。',
    itemType: 'paper',
    memoryText: '迷った場所にも、誰かにとっては大事な印がある。',
    unlockHint: '夜明け星図の絵札を広げると、読める文字が増えます。',
    accent: 0x9fd4ff,
    tags: ['map', 'lost', 'nagi'],
  },
  {
    id: 'lost-cold-lantern-glass',
    nameJa: '冷めたランタン硝子',
    nameEn: 'Cold Lantern Glass',
    ownerHint: '火は消えているのに、手で包むと少しだけ温かい。',
    itemType: 'lamp',
    memoryText: '灯りは消えたあとも、持っていた人の形を覚えている。',
    unlockHint: 'ランタン系の記録を灯すと、硝子の内側が見えます。',
    accent: 0xf4d69a,
    tags: ['lantern', 'yui', 'warmth'],
  },
  {
    id: 'lost-red-thread-knot',
    nameJa: 'ほどけない赤い糸',
    nameEn: 'Uncut Red Thread',
    ownerHint: '結び目だけが固く、ほどくより先に理由を聞きたくなる糸。',
    itemType: 'thread',
    memoryText: '直せない結び目が、直さなくていい記憶を守っている。',
    unlockHint: '熟練札や秘密札を灯すと、結び目の記録が開きます。',
    accent: 0xe0b0a6,
    tags: ['thread', 'tomori', 'scar'],
  },
  {
    id: 'lost-dull-light-coin',
    nameJa: 'くすんだ灯貨',
    nameEn: 'Dulled Light Coin',
    ownerHint: '価値よりも、渡せなかった約束の重さが残っている小さな貨幣。',
    itemType: 'coin',
    memoryText: '使わなかったものにも、使えなかった理由がある。',
    unlockHint: '灯貨を集める記録を灯すと、刻印が読めます。',
    accent: 0xcaa25a,
    tags: ['coin', 'promise', 'trade'],
  },
  {
    id: 'lost-rusted-room-key',
    nameJa: '錆びた部屋の鍵',
    nameEn: 'Rusted Room Key',
    ownerHint: 'どの扉にも合わないのに、誰かがずっと握っていた鍵。',
    itemType: 'key',
    memoryText: '開かない鍵は、閉じたかった心の形をしている。',
    unlockHint: '記憶文を読むと、この鍵の部屋に近づきます。',
    accent: 0x79bea9,
    tags: ['key', 'room', 'memory'],
  },
];
