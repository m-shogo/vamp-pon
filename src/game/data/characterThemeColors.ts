export type CharacterThemeColor = {
  characterId: string;
  name: string;
  themeColor: {
    hex: `#${string}`;
    japaneseName: string;
    romaji: string;
    note: string;
  };
  accentColor: {
    hex: `#${string}`;
    japaneseName: string;
    romaji: string;
    note: string;
  };
};

export const characterThemeColors: CharacterThemeColor[] = [
  {
    characterId: 'yui',
    name: 'ユイ',
    themeColor: { hex: '#264A86', japaneseName: '瑠璃色', romaji: 'ruri-iro', note: '夜道と主人公の青。ランタンの暖色を受けても沈まない。' },
    accentColor: { hex: '#F6B44B', japaneseName: '山吹色', romaji: 'yamabuki-iro', note: 'ランタンの芯と記憶片の光。' },
  },
  {
    characterId: 'asa',
    name: 'アサ',
    themeColor: { hex: '#F4A7B9', japaneseName: '薄紅', romaji: 'usubeni', note: '名札と朝の薄い赤。名前を結ぶやさしさ。' },
    accentColor: { hex: '#F7D94C', japaneseName: '菜の花色', romaji: 'nanohana-iro', note: '暁綴りの紙片ハイライト。' },
  },
  {
    characterId: 'nagi',
    name: 'ナギ',
    themeColor: { hex: '#7B90D2', japaneseName: '藤紫', romaji: 'fuji-murasaki', note: '月箱と静かな守り。' },
    accentColor: { hex: '#C7B78B', japaneseName: '白橡', romaji: 'shirotsurubami', note: '鍵と古い箱の縁。' },
  },
  {
    characterId: 'michiru',
    name: 'ミチル',
    themeColor: { hex: '#2E5C6E', japaneseName: '御召御納戸', romaji: 'omeshi-onando', note: '夜の地図線と帰針。青緑寄りでユイと分ける。' },
    accentColor: { hex: '#D7C447', japaneseName: '刈安色', romaji: 'kariyasu-iro', note: 'コンパス針と星図の道糸。' },
  },
  {
    characterId: 'tomori',
    name: 'トモリ',
    themeColor: { hex: '#8F2E14', japaneseName: '弁柄色', romaji: 'bengara-iro', note: '修理ランプ、煤、継火の赤茶。' },
    accentColor: { hex: '#FAD689', japaneseName: '淡香', romaji: 'usukou', note: '直した灯りの柔らかい火。' },
  },
  {
    characterId: 'sen',
    name: 'セン',
    themeColor: { hex: '#6E7955', japaneseName: '利休鼠', romaji: 'rikyu-nezumi', note: '黒板と先生の落ち着き。' },
    accentColor: { hex: '#E9E4D4', japaneseName: '鳥の子色', romaji: 'torinoko-iro', note: 'チョーク粉と教室の紙。' },
  },
  {
    characterId: 'ritsu',
    name: 'リツ',
    themeColor: { hex: '#D75455', japaneseName: '甚三紅', romaji: 'jinzamomi', note: '半分の飴と兄らしい温かさ。' },
    accentColor: { hex: '#F8C3CD', japaneseName: '退紅', romaji: 'taikou', note: '包み紙の淡い半分。' },
  },
  {
    characterId: 'koyori',
    name: 'コヨリ',
    themeColor: { hex: '#F7C8D0', japaneseName: '桜色', romaji: 'sakura-iro', note: '小さな名札と子どもらしい軽さ。' },
    accentColor: { hex: '#FFF1CF', japaneseName: '練色', romaji: 'neri-iro', note: '名前を書く紙の明るさ。' },
  },
  {
    characterId: 'gen',
    name: 'ゲン',
    themeColor: { hex: '#867835', japaneseName: '鶯茶', romaji: 'uguisu-cha', note: '古い道、古いコンパス、年季。' },
    accentColor: { hex: '#C0A36E', japaneseName: '桑染', romaji: 'kuwazome', note: '真鍮コンパスの鈍い光。' },
  },
  {
    characterId: 'hana',
    name: 'ハナ',
    themeColor: { hex: '#B5495B', japaneseName: '蘇芳', romaji: 'suou', note: '押し花の深い赤。かわいすぎない花色。' },
    accentColor: { hex: '#86A697', japaneseName: '青磁色', romaji: 'seiji-iro', note: '保存と水気の静かな補色。' },
  },
  {
    characterId: 'yubi',
    name: 'ユウビ',
    themeColor: { hex: '#C1693C', japaneseName: '代赭', romaji: 'taisha', note: '封筒、消印、配達路の土色。' },
    accentColor: { hex: '#E8D3A2', japaneseName: '蒸栗色', romaji: 'mushikuri-iro', note: '古い手紙の紙色。' },
  },
  {
    characterId: 'madoka',
    name: 'マドカ',
    themeColor: { hex: '#89C3EB', japaneseName: '勿忘草色', romaji: 'wasurenagusa-iro', note: '窓の光と見ていた記憶。' },
    accentColor: { hex: '#F3F3F2', japaneseName: '白鼠', romaji: 'shironezumi', note: '紙飛行機と窓辺の淡さ。' },
  },
  {
    characterId: 'shiro',
    name: 'シロ',
    themeColor: { hex: '#E3E5E8', japaneseName: '白練', romaji: 'shironeri', note: '白いしおり、図書委員、未分類ページの淡い白。' },
    accentColor: { hex: '#5B7E91', japaneseName: '藍鼠', romaji: 'ai-nezumi', note: '本棚と灯録UIに合う青鼠。' },
  },
  {
    characterId: 'tobari',
    name: 'トバリ',
    themeColor: { hex: '#56564B', japaneseName: '墨色', romaji: 'sumi-iro', note: '駅の境目、改札線、夜の幕。' },
    accentColor: { hex: '#D6C6AF', japaneseName: '砂色', romaji: 'suna-iro', note: '切符と駅灯の紙色。' },
  },
  {
    characterId: 'nemu',
    name: 'ネム',
    themeColor: { hex: '#B4A5D4', japaneseName: '薄藤', romaji: 'usufuji', note: '夢日記、眠り、水面。' },
    accentColor: { hex: '#A5DEE4', japaneseName: '水色', romaji: 'mizu-iro', note: '夢が地図になる水面光。' },
  },
  {
    characterId: 'kuroori',
    name: 'クロオリ',
    themeColor: { hex: '#1C1C1C', japaneseName: '黒', romaji: 'kuro', note: '黒折り紙とライバルの芯。' },
    accentColor: { hex: '#4A225D', japaneseName: '深紫', romaji: 'fukamurasaki', note: '折り目の中の歪み。' },
  },
  {
    characterId: 'kage1',
    name: 'カゲール1',
    themeColor: { hex: '#2B2B2B', japaneseName: '蝋色', romaji: 'rou-iro', note: '影の折り目と接近戦。' },
    accentColor: { hex: '#B55233', japaneseName: '紅鳶', romaji: 'benitobi', note: '近距離リスクの熱。' },
  },
  {
    characterId: 'kage2',
    name: 'カゲール2',
    themeColor: { hex: '#787D7B', japaneseName: '鈍色', romaji: 'nibi-iro', note: '消し跡、弱体化、ぼやけた輪郭。' },
    accentColor: { hex: '#D8D2C0', japaneseName: '灰白色', romaji: 'kaihakushoku', note: '消しゴムの粉と残った名前。' },
  },
  {
    characterId: 'kage3',
    name: 'カゲール3',
    themeColor: { hex: '#2D2D48', japaneseName: '濃藍', romaji: 'koiai', note: '夜読みの定規と角度線。' },
    accentColor: { hex: '#C7A5CC', japaneseName: '薄色', romaji: 'usu-iro', note: '角度クリティカルの細い光。' },
  },
  {
    characterId: 'kage4',
    name: 'カゲール4',
    themeColor: { hex: '#F2F2ED', japaneseName: '胡粉色', romaji: 'gofun-iro', note: '空白のカード。白だが不穏さを残す。' },
    accentColor: { hex: '#3C2F41', japaneseName: '黒紅', romaji: 'kurobeni', note: '余白の外側に残る黒耀。' },
  },
  {
    characterId: 'ren',
    name: 'レン',
    themeColor: { hex: '#A2D7DD', japaneseName: '瓶覗', romaji: 'kamenozoki', note: '丸メガネのレンズ越しに見える薄い青。マドカの窓色より淡く、焦点キャラとして分ける。' },
    accentColor: { hex: '#A5A5A5', japaneseName: '銀鼠', romaji: 'gin-nezumi', note: 'レンズ縁、反射、焦点メモの金属感。' },
  },
];

export const characterThemeColorById = new Map(characterThemeColors.map((entry) => [entry.characterId, entry]));
