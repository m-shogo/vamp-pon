export type Core5PrototypeCharacterId = 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori';

export type Core5PrototypeCharacter = {
  id: Core5PrototypeCharacterId;
  name: string;
  role: string;
  motif: string;
  imageId: string;
  normalizedImageId: string;
  originalPath: string;
  normalizedPath: string;
};

const originalBase = 'assets/prototypes/sprite-sheets/core5-52px';
const normalizedBase = 'assets/prototypes/sprite-sheets/core5-52px-normalized';

export const core5PrototypeCharacters: Core5PrototypeCharacter[] = [
  {
    id: 'yui',
    name: 'ユイ',
    role: '主人公 / 灯す',
    motif: 'ランタン・青フード・灯火紋',
    imageId: 'core5_yui_sheet_original',
    normalizedImageId: 'core5_yui_sheet_normalized',
    originalPath: `${originalBase}/yui-52px-sprite-sheet-v1.png`,
    normalizedPath: `${normalizedBase}/yui.png`,
  },
  {
    id: 'asa',
    name: 'アサ',
    role: '名前を守る / 名づける',
    motif: '名札・紙片・名印紋',
    imageId: 'core5_asa_sheet_original',
    normalizedImageId: 'core5_asa_sheet_normalized',
    originalPath: `${originalBase}/asa-52px-sprite-sheet-v1.png`,
    normalizedPath: `${normalizedBase}/asa.png`,
  },
  {
    id: 'nagi',
    name: 'ナギ',
    role: 'しまう / 守る',
    motif: '月箱・鍵・封月紋',
    imageId: 'core5_nagi_sheet_original',
    normalizedImageId: 'core5_nagi_sheet_normalized',
    originalPath: `${originalBase}/nagi-52px-sprite-sheet-v1.png`,
    normalizedPath: `${normalizedBase}/nagi.png`,
  },
  {
    id: 'michiru',
    name: 'ミチル',
    role: '導く / 帰り道',
    motif: 'コンパス・地図線・帰針紋',
    imageId: 'core5_michiru_sheet_original',
    normalizedImageId: 'core5_michiru_sheet_normalized',
    originalPath: `${originalBase}/michiru-52px-sprite-sheet-v1.png`,
    normalizedPath: `${normalizedBase}/michiru.png`,
  },
  {
    id: 'tomori',
    name: 'トモリ',
    role: '直す / 継火',
    motif: '修理ランプ・道具袋・継火紋',
    imageId: 'core5_tomori_sheet_original',
    normalizedImageId: 'core5_tomori_sheet_normalized',
    originalPath: `${originalBase}/tomori-52px-sprite-sheet-v1.png`,
    normalizedPath: `${normalizedBase}/tomori.png`,
  },
];

export const core5PrototypeCharacterById = new Map(core5PrototypeCharacters.map((character) => [character.id, character]));
