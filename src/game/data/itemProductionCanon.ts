import { WORLD_TERMS } from './worldTerms';

export type ItemCanonCategory = {
  id: string;
  label: string;
  role: string;
  namingRule: string;
  productionRule: string;
};

export type ItemMotifLane = {
  id: string;
  label: string;
  verbs: string[];
  objectWords: string[];
  avoidWords: string[];
};

export type CharacterProductionRequirement = {
  id: string;
  label: string;
  required: string[];
};

export const ITEM_CANON_CATEGORIES: ItemCanonCategory[] = [
  {
    id: 'weapon',
    label: WORLD_TERMS.inventory.weapon,
    role: '戦闘中に自動発動する主力アイテム。旧weapon。',
    namingRule: '物として持てる名詞を先に置き、最後に灯り・紙・道・名・箱などの世界観語を足す。',
    productionRule: 'キャラを1人増やすたびに、そのキャラの初期灯具を1つ作る。既存灯具と攻撃形を被せない。',
  },
  {
    id: 'passive',
    label: WORLD_TERMS.inventory.passive,
    role: 'ステータスを伸ばす持ち物。旧passive。',
    namingRule: '強さそのものではなく、旅や忘れ物として自然な名にする。',
    productionRule: '回収/灯力/成長/足取り/手数の5系統へ割り当て、数値役割を明確にする。',
  },
  {
    id: 'rare_item',
    label: WORLD_TERMS.inventory.rareItem,
    role: '暁開きや特殊進化の鍵になる一回性の重要アイテム。',
    namingRule: '誰のものか分からない私物名にする。強化素材っぽい名前は禁止。',
    productionRule: '初期灯具1つにつき、対応する忘れ物を1つ以上用意する。',
  },
  {
    id: 'field_drop',
    label: WORLD_TERMS.inventory.fieldDrop,
    role: '戦闘中に拾う短期効果アイテム。',
    namingRule: '落ちていて不自然ではない小物名にする。',
    productionRule: '回復、吸い寄せ、一時強化、画面整理の4系統まで。序盤から読みやすい見た目にする。',
  },
  {
    id: 'currency',
    label: WORLD_TERMS.inventory.currency,
    role: '通貨・欠片。永続強化や灯録解放に使う。',
    namingRule: '必ず記憶片で統一する。コイン、ゴールド、石は使わない。',
    productionRule: '拾う体験、リザルト、ショップ、強化画面で同じ名称を使う。',
  },
];

export const ITEM_MOTIF_LANES: ItemMotifLane[] = [
  { id: 'light', label: '灯り', verbs: ['灯す', '継ぐ', '照らす', 'にじむ'], objectWords: ['ランタン', '街灯', '火花', '灯芯', '朝露'], avoidWords: ['魔法', '爆炎', '聖剣'] },
  { id: 'paper', label: '紙', verbs: ['綴る', '折る', '貼る', '封じる'], objectWords: ['紙片', 'しおり', '手紙', '切符', '名札'], avoidWords: ['巻物', '魔導書', 'スクロール'] },
  { id: 'road', label: '道', verbs: ['導く', '戻す', '通す', '結ぶ'], objectWords: ['コンパス', '地図線', '駅灯', '道糸', '改札'], avoidWords: ['ワープ', 'ポータル', '瞬間移動'] },
  { id: 'box', label: '箱', verbs: ['しまう', '閉じる', '守る', '開く'], objectWords: ['月箱', '鍵', '引き出し', '小箱', '封'], avoidWords: ['牢獄', '監禁', '封印魔法'] },
  { id: 'name', label: '名', verbs: ['呼ぶ', '結ぶ', '刻む', 'ほどく'], objectWords: ['名札', '消し跡', '呼び名', '一文字', '印'], avoidWords: ['呪い', '支配', '契約魔術'] },
  { id: 'repair', label: '修理', verbs: ['直す', '縫う', '継ぐ', '留める'], objectWords: ['修理ランプ', '道具袋', '継ぎ目', '糸', '針'], avoidWords: ['鍛冶', '錬成', '改造手術'] },
  { id: 'memory', label: '記憶', verbs: ['拾う', '戻す', '映す', '残す'], objectWords: ['記憶片', 'レンズ', 'ビー玉', '古写真', '余白'], avoidWords: ['魂', '霊核', 'クリスタル'] },
];

export const FIELD_DROP_CANON = [
  { id: 'memory_fragment', label: WORLD_TERMS.records.fragment, role: '経験と通貨の中間。拾う気持ちよさの中心。' },
  { id: 'morning_dew', label: WORLD_TERMS.inventory.recovery, role: '回復。吸い寄せず、プレイヤーが取りに行く判断を残す。' },
  { id: 'lost_bell', label: '迷子の鈴', role: '短時間だけ記憶片を呼ぶ吸い寄せ系。' },
  { id: 'dawn_match', label: '夜明けマッチ', role: '短時間だけ灯力を上げる一時強化。' },
  { id: 'blank_ticket', label: '白い切符', role: '安全な方向へ抜ける移動補助。' },
];

export const CHARACTER_PRODUCTION_REQUIREMENTS: CharacterProductionRequirement[] = [
  { id: 'identity', label: 'キャラ核', required: ['持ち物', '髪型', '頭装備', '光の種類', '戦う理由', '得意', '不得意'] },
  { id: 'battle', label: '戦闘核', required: ['初期灯具', '灯技', '継灯', '暁灯', '黒耀化副題', '黒耀化の歪み'] },
  { id: 'items', label: 'アイテム核', required: ['対応する忘れ物', '相性の良い持ち物', '灯継ぎ先', '暁開き先', '灯合わせ候補2つ以上'] },
  { id: 'assets', label: '素材核', required: ['正面シルエット', '通常スプライト', '黒耀化差分', '暁灯カットイン指示', '黒耀化カットイン指示'] },
  { id: 'story', label: '物語核', required: ['ユイとの接点', '他キャラとの接点', '隠された空白', 'ステージ/背景候補'] },
];
