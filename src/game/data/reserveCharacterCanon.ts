export type ReserveCharacterStatus = 'official_reserve';

export type ReserveCharacterCanonEntry = {
  no: number;
  id: string;
  name: string;
  status: ReserveCharacterStatus;
  title: string;
  role: string;
  vessel: string;
  lineage: string;
  firstAction: string;
  linkToYui: string;
  otherLink: string;
  blank: string;
  visual: {
    silhouette: string;
    faceFeature: string;
    outfit: string;
    readableProp: string;
  };
  combat: {
    role: string;
    starter: string;
    playFeel: string;
    strength: string;
    weakness: string;
  };
  arts: {
    lampArt: string;
    inheritedLight: string;
    dawnLight: string;
  };
  cutin: {
    normal: string;
    kokuyou: string;
  };
};

export const reserveCharacterCanon: ReserveCharacterCanonEntry[] = [
  {
    no: 21,
    id: 'ren',
    name: 'レン',
    status: 'official_reserve',
    title: '焦点を合わせる子',
    role: 'メガネ / 焦点 / 見分ける / 弱点補助型',
    vessel: '丸メガネのレンズ灯',
    lineage: '光 / 焦点',
    firstAction: 'ぼやけたものに焦点を合わせる',
    linkToYui: 'ユイが見落とした余白の端を見つけた',
    otherLink: 'マドカの目撃、シロの灯録、カゲール2の消し跡と接続',
    blank: '見えすぎたものを、なぜ黙っていたのか',
    visual: {
      silhouette: '丸メガネが小さく光る、細身で少し前のめりの観察者シルエット',
      faceFeature: '丸メガネ。片レンズだけ淡く光る。目そのものは強く描きすぎない',
      outfit: '短いケープか襟付き上着。図書委員ではなく観察者寄りにする',
      readableProp: '丸メガネ、レンズ拭き、小さな焦点メモ',
    },
    combat: {
      role: '弱点露出 / 命中補助 / ブラー解除型',
      starter: 'レンズのしるし',
      playFeel: '敵のぼやけを晴らし、弱点を浮かび上がらせる。直接火力よりチャンス作りが得意',
      strength: '弱点付与、命中補助、透明/ぼやけ敵への対策',
      weakness: '単独火力と耐久は低い',
    },
    arts: {
      lampArt: '焦点灯し',
      inheritedLight: '硝子の道筋',
      dawnLight: '見落とさない朝',
    },
    cutin: {
      normal: '丸レンズに朝前の光が集まり、ぼやけた紙片の輪郭が合う。文字は焼き込まない',
      kokuyou: 'レンズの片側が黒く曇り、見えてはいけない余白だけが浮く。文字は焼き込まない',
    },
  },
];

export const reserveCharacterCanonById = new Map(reserveCharacterCanon.map((entry) => [entry.id, entry]));
