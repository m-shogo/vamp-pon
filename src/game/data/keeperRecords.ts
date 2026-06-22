export type KeeperRecord = {
  id: string;
  characterId: string;
  nameJa: string;
  nameEn: string;
  roleTitle: string;
  lightMotif: string;
  blackFormName: string;
  dawnName: string;
  shortPoem: string;
  unlockHint: string;
  accent: number;
  tags: string[];
};

export const keeperRecords: KeeperRecord[] = [
  {
    id: 'keeper-yui',
    characterId: 'yui',
    nameJa: 'ユイ',
    nameEn: 'Yui',
    roleTitle: '忘れ物を拾う灯し手',
    lightMotif: '小さなランタン',
    blackFormName: '黒耀化：黒灯のユイ',
    dawnName: '朝明：灯を返す子',
    shortPoem: 'なくしたものを照らすより先に、なくしたと言えなかった心を照らす。',
    unlockHint: '最初の夜明けを迎えると、ユイの記録が深まります。',
    accent: 0xf4d69a,
    tags: ['lantern', 'lost-item', 'dawn'],
  },
  {
    id: 'keeper-asa',
    characterId: 'asa',
    nameJa: 'アサ',
    nameEn: 'Asa',
    roleTitle: '朝を急がせる灯し手',
    lightMotif: '朝焼けの火花',
    blackFormName: '黒耀化：焦げ朝のアサ',
    dawnName: '朝明：一番目の光',
    shortPoem: '早く進むほど、置いてきた声が遠くで大きくなる。',
    unlockHint: '時間条件の絵札を灯すと、アサの記録が深まります。',
    accent: 0xffb36b,
    tags: ['morning', 'speed', 'friendship'],
  },
  {
    id: 'keeper-nagi',
    characterId: 'nagi',
    nameJa: 'ナギ',
    nameEn: 'Nagi',
    roleTitle: '帰り道を描く灯し手',
    lightMotif: '星図の針',
    blackFormName: '黒耀化：迷図のナギ',
    dawnName: '朝明：戻る道の星',
    shortPoem: '遠回りは間違いじゃない。帰る場所を書き足すための線だ。',
    unlockHint: '夜明け星図の隣接札を広げると、ナギの記録が深まります。',
    accent: 0x9fd4ff,
    tags: ['map', 'star', 'return'],
  },
  {
    id: 'keeper-michiru',
    characterId: 'michiru',
    nameJa: 'ミチル',
    nameEn: 'Michiru',
    roleTitle: '流れた記憶をすくう灯し手',
    lightMotif: '水面の反射光',
    blackFormName: '黒耀化：沈み水のミチル',
    dawnName: '朝明：流れをほどく手',
    shortPoem: '流したかったものだけが、いつまでも岸辺で待っている。',
    unlockHint: '記憶文を読むと、ミチルの記録が深まります。',
    accent: 0x86bfe0,
    tags: ['water', 'memory', 'quiet'],
  },
  {
    id: 'keeper-tomori',
    characterId: 'tomori',
    nameJa: 'トモリ',
    nameEn: 'Tomori',
    roleTitle: '傷を残して直す灯し手',
    lightMotif: '縫い目の灯り',
    blackFormName: '黒耀化：ほどけ糸のトモリ',
    dawnName: '朝明：直しすぎない光',
    shortPoem: '全部きれいに直したら、痛かったことまで消えてしまうから。',
    unlockHint: '熟練札や秘密札を灯すと、トモリの記録が深まります。',
    accent: 0xe0b0a6,
    tags: ['repair', 'scar', 'thread'],
  },
];
