export type CharacterThemeColor = {
  characterId: string;
  /** Runtime-compatible/legacy-facing name. Shadow IDs keep compatibility here. */
  name: string;
  /** Current story/profile display name. */
  displayName: string;
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
  starBeastTheme: {
    favoriteConstellation: string;
    constellationKey: string;
    starBeast: string;
    hex: `#${string}`;
    paletteFamilyKey: string | null;
    sharedColorReason: string | null;
    note: string;
  };
};

export const characterThemeColors: CharacterThemeColor[] = [
  {
    characterId: 'yui', name: 'ユイ', displayName: 'ユイ',
    themeColor: { hex: '#264A86', japaneseName: '瑠璃色', romaji: 'ruri-iro', note: '夜道と主人公の青。ランタンの暖色を受けても沈まない。' },
    accentColor: { hex: '#F6B44B', japaneseName: '山吹色', romaji: 'yamabuki-iro', note: 'ランタンの芯と記憶片の光。' },
    starBeastTheme: { favoriteConstellation: '獅子座 / Leo', constellationKey: 'leo', starBeast: '子獅子「ルク」仮称', hex: '#D6A541', paletteFamilyKey: 'leo-lantern-lineage', sharedColorReason: 'トモリとの獅子座重複。トモリが前の時代で修理し、後世のユイへ届いた同じ物理ランタンへの共鳴。血縁Canonではない。', note: '獅子の金はトモリと意図的に共有し、人物主色は共有しない。' },
  },
  {
    characterId: 'asa', name: 'アサ', displayName: 'アサ',
    themeColor: { hex: '#F4A7B9', japaneseName: '薄紅', romaji: 'usubeni', note: '名札と朝の薄い赤。名前を結ぶやさしさ。' },
    accentColor: { hex: '#F7D94C', japaneseName: '菜の花色', romaji: 'nanohana-iro', note: '暁綴りの紙片ハイライト。' },
    starBeastTheme: { favoriteConstellation: 'おひつじ座 / Aries', constellationKey: 'aries', starBeast: '若い雄羊', hex: '#E0B75D', paletteFamilyKey: null, sharedColorReason: null, note: '先に走る雄羊を、強い赤ではなく乾いた金の火花として扱う。' },
  },
  {
    characterId: 'nagi', name: 'ナギ', displayName: 'ナギ',
    themeColor: { hex: '#7B90D2', japaneseName: '藤紫', romaji: 'fuji-murasaki', note: '月箱と静かな守り。' },
    accentColor: { hex: '#C7B78B', japaneseName: '白橡', romaji: 'shirotsurubami', note: '鍵と古い箱の縁。' },
    starBeastTheme: { favoriteConstellation: 'かに座 / Cancer', constellationKey: 'cancer', starBeast: '小さな蟹', hex: '#D98B77', paletteFamilyKey: null, sharedColorReason: null, note: '閉じる・挟む小蟹を月色から分離した淡い殻色で読む。' },
  },
  {
    characterId: 'michiru', name: 'ミチル', displayName: 'ミチル',
    themeColor: { hex: '#2E5C6E', japaneseName: '御召御納戸', romaji: 'omeshi-onando', note: '夜の地図線と帰針。青緑寄りでユイと分ける。' },
    accentColor: { hex: '#D7C447', japaneseName: '刈安色', romaji: 'kariyasu-iro', note: 'コンパス針と星図の道糸。' },
    starBeastTheme: { favoriteConstellation: 'こぐま座 / Ursa Minor', constellationKey: 'ursa-minor', starBeast: '小熊', hex: '#9CC8E8', paletteFamilyKey: null, sharedColorReason: null, note: '北極星を含む案内役として、人物の青緑より明るい北天色。' },
  },
  {
    characterId: 'tomori', name: 'トモリ', displayName: 'トモリ',
    themeColor: { hex: '#8F2E14', japaneseName: '弁柄色', romaji: 'bengara-iro', note: '修理ランプ、煤、継火の赤茶。' },
    accentColor: { hex: '#FAD689', japaneseName: '淡香', romaji: 'usukou', note: '直した灯りの柔らかい火。' },
    starBeastTheme: { favoriteConstellation: '獅子座 / Leo', constellationKey: 'leo', starBeast: '少し煤けた若獅子', hex: '#D6A541', paletteFamilyKey: 'leo-lantern-lineage', sharedColorReason: 'ユイとの獅子座重複。トモリが修理した同じ物理ランタンが複数の手を経てユイへ届いたNamed Object lineage。血縁Canonではない。', note: '主色はユイと完全に分け、獅子座の金だけをlineageの伏線として共有する。' },
  },
  {
    characterId: 'sen', name: 'セン', displayName: 'セン',
    themeColor: { hex: '#6E7955', japaneseName: '利休鼠', romaji: 'rikyu-nezumi', note: '黒板と先生の落ち着き。' },
    accentColor: { hex: '#E9E4D4', japaneseName: '鳥の子色', romaji: 'torinoko-iro', note: 'チョーク粉と教室の紙。' },
    starBeastTheme: { favoriteConstellation: 'からす座 / Corvus', constellationKey: 'corvus', starBeast: '小烏', hex: '#596A80', paletteFamilyKey: null, sharedColorReason: null, note: '烏を真黒にせず、伝える役割が夜で読める青灰へ。' },
  },
  {
    characterId: 'ritsu', name: 'リツ', displayName: 'リツ',
    themeColor: { hex: '#D75455', japaneseName: '甚三紅', romaji: 'jinzamomi', note: '半分の飴と兄らしい温かさ。' },
    accentColor: { hex: '#F8C3CD', japaneseName: '退紅', romaji: 'taikou', note: '包み紙の淡い半分。' },
    starBeastTheme: { favoriteConstellation: 'りょうけん座 / Canes Venatici', constellationKey: 'canes-venatici', starBeast: '二頭のうち大きい猟犬', hex: '#B78552', paletteFamilyKey: 'canes-venatici-siblings', sharedColorReason: 'コヨリとの兄妹関係。二頭で描かれる猟犬座を兄妹モチーフとして共有。', note: '人物主色は兄妹で分け、星獣色だけを同一にする。' },
  },
  {
    characterId: 'koyori', name: 'コヨリ', displayName: 'コヨリ',
    themeColor: { hex: '#F7C8D0', japaneseName: '桜色', romaji: 'sakura-iro', note: '小さな名札と子どもらしい軽さ。' },
    accentColor: { hex: '#FFF1CF', japaneseName: '練色', romaji: 'neri-iro', note: '名前を書く紙の明るさ。' },
    starBeastTheme: { favoriteConstellation: 'りょうけん座 / Canes Venatici', constellationKey: 'canes-venatici', starBeast: '二頭のうち小さい猟犬', hex: '#B78552', paletteFamilyKey: 'canes-venatici-siblings', sharedColorReason: 'リツとの兄妹関係。二頭で描かれる猟犬座を兄妹モチーフとして共有。', note: '同じ家族でも別人格なので、主色は兄と重複させない。' },
  },
  {
    characterId: 'gen', name: 'ゲン', displayName: 'ゲン',
    themeColor: { hex: '#867835', japaneseName: '鶯茶', romaji: 'uguisu-cha', note: '古い道、古いコンパス、年季。' },
    accentColor: { hex: '#C0A36E', japaneseName: '桑染', romaji: 'kuwazome', note: '真鍮コンパスの鈍い光。' },
    starBeastTheme: { favoriteConstellation: 'おおぐま座 / Ursa Major', constellationKey: 'ursa-major', starBeast: '大熊', hex: '#7F6A47', paletteFamilyKey: null, sharedColorReason: null, note: '大きな足跡と古い道を土の重い茶でつなぐ。' },
  },
  {
    characterId: 'hana', name: 'ハナ', displayName: 'ハナ',
    themeColor: { hex: '#B5495B', japaneseName: '蘇芳', romaji: 'suou', note: '押し花の深い赤。かわいすぎない花色。' },
    accentColor: { hex: '#86A697', japaneseName: '青磁色', romaji: 'seiji-iro', note: '保存と水気の静かな補色。' },
    starBeastTheme: { favoriteConstellation: 'はくちょう座 / Cygnus', constellationKey: 'cygnus', starBeast: 'ふっくらした白鳥', hex: '#EDE0C8', paletteFamilyKey: null, sharedColorReason: null, note: '白鳥を冷たい白ではなく紙と生活の温かい白で扱う。' },
  },
  {
    characterId: 'yubi', name: 'ユウビ', displayName: 'ユウビ',
    themeColor: { hex: '#C1693C', japaneseName: '代赭', romaji: 'taisha', note: '封筒、消印、配達路の土色。' },
    accentColor: { hex: '#E8D3A2', japaneseName: '蒸栗色', romaji: 'mushikuri-iro', note: '古い手紙の紙色。' },
    starBeastTheme: { favoriteConstellation: 'はと座 / Columba', constellationKey: 'columba', starBeast: '小鳩', hex: '#B9A6C8', paletteFamilyKey: null, sharedColorReason: null, note: '配達の土色から分離し、知らせを持ち帰る鳩へ夕紫を与える。' },
  },
  {
    characterId: 'madoka', name: 'マドカ', displayName: 'マドカ',
    themeColor: { hex: '#89C3EB', japaneseName: '勿忘草色', romaji: 'wasurenagusa-iro', note: '窓の光と見ていた記憶。' },
    accentColor: { hex: '#F3F3F2', japaneseName: '白鼠', romaji: 'shironezumi', note: '紙飛行機と窓辺の淡さ。' },
    starBeastTheme: { favoriteConstellation: 'わし座 / Aquila', constellationKey: 'aquila', starBeast: '小鷲', hex: '#D7B365', paletteFamilyKey: null, sharedColorReason: null, note: '遠くを見る視線の焦点として細い金を使う。' },
  },
  {
    characterId: 'shiro', name: 'シロ', displayName: 'シロ',
    themeColor: { hex: '#E3E5E8', japaneseName: '白練', romaji: 'shironeri', note: '白いしおり、未分類ページの淡い白。' },
    accentColor: { hex: '#5B7E91', japaneseName: '藍鼠', romaji: 'ai-nezumi', note: '本棚と灯録UIに合う青鼠。' },
    starBeastTheme: { favoriteConstellation: 'やまねこ座 / Lynx', constellationKey: 'lynx', starBeast: '山猫', hex: '#8EB7A2', paletteFamilyKey: null, sharedColorReason: null, note: '薄い一行を見抜く鋭さを、強い蛍光色ではなく青緑で表す。' },
  },
  {
    characterId: 'tobari', name: 'トバリ', displayName: 'トバリ',
    themeColor: { hex: '#56564B', japaneseName: '墨色', romaji: 'sumi-iro', note: '駅の境目、改札線、夜の幕。' },
    accentColor: { hex: '#D6C6AF', japaneseName: '砂色', romaji: 'suna-iro', note: '切符と駅灯の紙色。' },
    starBeastTheme: { favoriteConstellation: 'おおいぬ座 / Canis Major', constellationKey: 'canis-major', starBeast: '大きな番犬', hex: '#AEB7CF', paletteFamilyKey: null, sharedColorReason: null, note: '門を守る番犬を、帰ってくる人を覚える夜明け前の青灰で表す。' },
  },
  {
    characterId: 'nemu', name: 'ネム', displayName: 'ネム',
    themeColor: { hex: '#B4A5D4', japaneseName: '薄藤', romaji: 'usufuji', note: '夢日記、眠り、水面。' },
    accentColor: { hex: '#A5DEE4', japaneseName: '水色', romaji: 'mizu-iro', note: '夢が地図になる水面光。' },
    starBeastTheme: { favoriteConstellation: 'いるか座 / Delphinus', constellationKey: 'delphinus', starBeast: '小イルカ', hex: '#79B9C8', paletteFamilyKey: null, sharedColorReason: null, note: '夢から現実へ泳いで戻る小イルカを一段深い海色へ。' },
  },
  {
    characterId: 'kuroori', name: 'クロオリ', displayName: 'クロオリ',
    themeColor: { hex: '#1C1C1C', japaneseName: '黒', romaji: 'kuro', note: '黒折り紙とライバルの芯。' },
    accentColor: { hex: '#4A225D', japaneseName: '深紫', romaji: 'fukamurasaki', note: '折り目の中の歪み。' },
    starBeastTheme: { favoriteConstellation: 'カメレオン座 / Chamaeleon', constellationKey: 'chamaeleon', starBeast: '黒紙カメレオン', hex: '#71956A', paletteFamilyKey: null, sharedColorReason: null, note: '隠す/形を変える行為に、生物側の鈍い緑を足す。' },
  },
  {
    characterId: 'kage1', name: 'カゲール1', displayName: 'カナメ',
    themeColor: { hex: '#2B2B2B', japaneseName: '蝋色', romaji: 'rou-iro', note: '影の折り目と接近戦。' },
    accentColor: { hex: '#B55233', japaneseName: '紅鳶', romaji: 'benitobi', note: '近距離リスクの熱。' },
    starBeastTheme: { favoriteConstellation: 'おおかみ座 / Lupus', constellationKey: 'lupus', starBeast: '大きな灰狼', hex: '#87909A', paletteFamilyKey: null, sharedColorReason: null, note: '大柄な守備役を群れの外周に立つ灰狼で読む。' },
  },
  {
    characterId: 'kage2', name: 'カゲール2', displayName: 'カスミ',
    themeColor: { hex: '#787D7B', japaneseName: '鈍色', romaji: 'nibi-iro', note: '消し跡、弱体化、ぼやけた輪郭。' },
    accentColor: { hex: '#D8D2C0', japaneseName: '灰白色', romaji: 'kaihakushoku', note: '消しゴムの粉と残った名前。' },
    starBeastTheme: { favoriteConstellation: 'こぎつね座 / Vulpecula', constellationKey: 'vulpecula', starBeast: '淡い小狐', hex: '#C8B2A8', paletteFamilyKey: null, sharedColorReason: null, note: '消すのではなく半分だけ姿を見せる小狐の温度を残す。' },
  },
  {
    characterId: 'kage3', name: 'カゲール3', displayName: 'トキ',
    themeColor: { hex: '#2D2D48', japaneseName: '濃藍', romaji: 'koiai', note: '夜読みの定規と角度線。' },
    accentColor: { hex: '#C7A5CC', japaneseName: '薄色', romaji: 'usu-iro', note: '角度クリティカルの細い光。' },
    starBeastTheme: { favoriteConstellation: 'つる座 / Grus', constellationKey: 'grus', starBeast: '細身の鶴', hex: '#BFC7D7', paletteFamilyKey: null, sharedColorReason: null, note: '測る姿勢と細い脚線を銀青で分離する。' },
  },
  {
    characterId: 'kage4', name: 'カゲール4', displayName: 'ツムギ',
    themeColor: { hex: '#F2F2ED', japaneseName: '胡粉色', romaji: 'gofun-iro', note: '空白のカード。白だが不穏さを残す。' },
    accentColor: { hex: '#3C2F41', japaneseName: '黒紅', romaji: 'kurobeni', note: '余白の外側に残る黒耀。' },
    starBeastTheme: { favoriteConstellation: 'うさぎ座 / Lepus', constellationKey: 'lepus', starBeast: '白灰の野兎', hex: '#D6D0C8', paletteFamilyKey: null, sharedColorReason: null, note: '空白と同化しすぎない灰で、次の頁へ跳ぶ足跡を残す。' },
  },
  {
    characterId: 'ren', name: 'レン', displayName: 'レン',
    themeColor: { hex: '#A2D7DD', japaneseName: '瓶覗', romaji: 'kamenozoki', note: '丸メガネのレンズ越しに見える薄い青。マドカの窓色より淡く、焦点キャラとして分ける。' },
    accentColor: { hex: '#A5A5A5', japaneseName: '銀鼠', romaji: 'gin-nezumi', note: 'レンズ縁、反射、焦点メモの金属感。' },
    starBeastTheme: { favoriteConstellation: 'こいぬ座 / Canis Minor', constellationKey: 'canis-minor', starBeast: '小さな観察犬', hex: '#AFBDD0', paletteFamilyKey: null, sharedColorReason: null, note: '少し先に気づいて振り返る観察犬を静かな青灰で表す。' },
  },
];

export const characterThemeColorById = new Map(characterThemeColors.map((entry) => [entry.characterId, entry]));
