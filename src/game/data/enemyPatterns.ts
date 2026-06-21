import type { EnemyBehavior } from '../domain/types';

export type EnemyPatternRole = 'move' | 'attack' | 'support' | 'death' | 'modifier';

export type EnemyPatternId =
  | 'chase.basic'
  | 'chase.swarm'
  | 'chase.fastLowHp'
  | 'chase.slowHeavy'
  | 'drift.diagonal'
  | 'drift.sideWall'
  | 'zigzag.chase'
  | 'orbit.player'
  | 'ambush.behind'
  | 'retreat.shooter'
  | 'charge.tellLine'
  | 'shoot.slowInk'
  | 'shoot.spread3'
  | 'hazard.inkPuddle'
  | 'hazard.slowMist'
  | 'explode.onNear'
  | 'death.split'
  | 'death.puddle'
  | 'support.guardDrop'
  | 'support.buffSpeed'
  | 'summon.smallOmbu'
  | 'steal.expShard'
  | 'hide.fade'
  | 'rage.lowHp';

export type EnemyPatternDefinition = {
  id: EnemyPatternId;
  label: string;
  role: EnemyPatternRole;
  pressure: number;
  implemented: boolean;
  behavior?: EnemyBehavior;
  summary: string;
  tuningNote: string;
};

/**
 * 敵の動き・攻撃・特殊能力をステージ側から呼び出すための登録表。
 * まずは既存挙動への対応と将来用 stub を同居させる。
 */
export const ENEMY_PATTERNS: Record<EnemyPatternId, EnemyPatternDefinition> = {
  'chase.basic': {
    id: 'chase.basic',
    label: '基本追尾',
    role: 'move',
    pressure: 1,
    implemented: true,
    behavior: 'chase',
    summary: 'プレイヤーへ素直に向かう基本パターン。序盤の気持ちよさ担当。',
    tuningNote: 'HPを盛りすぎず、数と経験値供給でテンポを作る。',
  },
  'chase.swarm': {
    id: 'chase.swarm',
    label: '群れ追尾',
    role: 'move',
    pressure: 1.35,
    implemented: true,
    behavior: 'swarm_chase',
    summary: '少しばらけながら群れで押す。逃げ道を狭める。',
    tuningNote: '2分後以降の密度上げに向くが、最大同時数を必ず制限する。',
  },
  'chase.fastLowHp': {
    id: 'chase.fastLowHp',
    label: '高速低HP追尾',
    role: 'move',
    pressure: 1.25,
    implemented: true,
    behavior: 'charger',
    summary: '低HPで速い敵。既存の走る紙片オンブで代用できる。',
    tuningNote: '大量投入すると理不尽なので少数混入にする。',
  },
  'chase.slowHeavy': {
    id: 'chase.slowHeavy',
    label: '低速重量追尾',
    role: 'move',
    pressure: 1.15,
    implemented: true,
    behavior: 'slow_chase',
    summary: '遅いが壁になる敵。火力差を見せる。',
    tuningNote: '序盤は硬すぎ注意。終盤の壁役にする。',
  },
  'drift.diagonal': {
    id: 'drift.diagonal',
    label: '斜め流れ',
    role: 'move',
    pressure: 1.3,
    implemented: true,
    behavior: 'offset_chase',
    summary: '斜めに寄ってくるような流れで単調な追尾を崩す。',
    tuningNote: 'プレイヤーの進路を軽くずらす程度に留める。',
  },
  'drift.sideWall': {
    id: 'drift.sideWall',
    label: '横壁流れ',
    role: 'move',
    pressure: 1.45,
    implemented: false,
    summary: '左右から薄い壁のように流れてくる。',
    tuningNote: '逃げ道を完全封鎖しない幅で使う。',
  },
  'zigzag.chase': {
    id: 'zigzag.chase',
    label: 'ジグザグ追尾',
    role: 'move',
    pressure: 1.4,
    implemented: false,
    summary: '左右に揺れながら追う。弾や範囲攻撃の当たり方を変える。',
    tuningNote: '揺れ幅を大きくしすぎると読みづらい。',
  },
  'orbit.player': {
    id: 'orbit.player',
    label: '周回接近',
    role: 'move',
    pressure: 1.55,
    implemented: true,
    behavior: 'orbit_chase',
    summary: 'プレイヤー周囲を回り込みながら近づく。包囲感を作る。',
    tuningNote: '近距離で止まりすぎないよう速度を保つ。',
  },
  'ambush.behind': {
    id: 'ambush.behind',
    label: '背後奇襲',
    role: 'move',
    pressure: 1.65,
    implemented: false,
    summary: '進行方向の背後寄りに出る。油断対策。',
    tuningNote: '警告なしの接触事故にならないよう出現距離を取る。',
  },
  'retreat.shooter': {
    id: 'retreat.shooter',
    label: '後退射撃',
    role: 'move',
    pressure: 1.8,
    implemented: false,
    summary: '距離を保って弾を撃つ敵用。',
    tuningNote: '逃げすぎると倒せずストレスになるため寿命や画面戻しが必要。',
  },
  'charge.tellLine': {
    id: 'charge.tellLine',
    label: '予告線突進',
    role: 'attack',
    pressure: 2.2,
    implemented: true,
    behavior: 'charger',
    summary: '予兆後に短く突進する。避ける遊びを作る。',
    tuningNote: '0.5秒以上の予告を維持する。',
  },
  'shoot.slowInk': {
    id: 'shoot.slowInk',
    label: '低速インク弾',
    role: 'attack',
    pressure: 2,
    implemented: false,
    summary: '遅い弾で移動先を制限する。',
    tuningNote: '未来予測はしない。現在位置狙いにする。',
  },
  'shoot.spread3': {
    id: 'shoot.spread3',
    label: '3方向インク弾',
    role: 'attack',
    pressure: 2.4,
    implemented: false,
    summary: '3方向に遅い弾を出す。中盤以降の弾幕入門。',
    tuningNote: '全方向弾幕は避け、スマホ画面で読める密度にする。',
  },
  'hazard.inkPuddle': {
    id: 'hazard.inkPuddle',
    label: 'インク床',
    role: 'attack',
    pressure: 1.85,
    implemented: false,
    summary: '足元に短時間残る鈍足床を作る。',
    tuningNote: 'ダメージより鈍足中心。発生前に薄いにじみ予告を出す。',
  },
  'hazard.slowMist': {
    id: 'hazard.slowMist',
    label: '鈍足もや',
    role: 'attack',
    pressure: 1.7,
    implemented: false,
    summary: '広めの鈍足エリアで進路を変えさせる。',
    tuningNote: '長時間残さない。画面を汚しすぎない。',
  },
  'explode.onNear': {
    id: 'explode.onNear',
    label: '接近爆発',
    role: 'attack',
    pressure: 2.1,
    implemented: false,
    summary: '近づくと予告後に小爆発する。',
    tuningNote: '自爆前に倒す快感を作る。',
  },
  'death.split': {
    id: 'death.split',
    label: '死亡分裂',
    role: 'death',
    pressure: 1.9,
    implemented: false,
    summary: '倒すと小型に分裂する。範囲武器の価値を上げる。',
    tuningNote: '分裂数は2体までから始める。',
  },
  'death.puddle': {
    id: 'death.puddle',
    label: '死亡インク床',
    role: 'death',
    pressure: 1.55,
    implemented: false,
    summary: '死亡地点に短いインク床を残す。',
    tuningNote: '倒した報酬感を邪魔しすぎない短時間にする。',
  },
  'support.guardDrop': {
    id: 'support.guardDrop',
    label: 'ドロップ護衛',
    role: 'support',
    pressure: 1.6,
    implemented: false,
    summary: '回復やカプセル周辺に寄る。取りに行く判断を作る。',
    tuningNote: '完全封鎖しない。少し倒せば取れる密度にする。',
  },
  'support.buffSpeed': {
    id: 'support.buffSpeed',
    label: '周囲加速',
    role: 'support',
    pressure: 2.05,
    implemented: false,
    summary: '周囲の敵を少し速くする支援敵。',
    tuningNote: '効果範囲を見せる。重ねがけは禁止。',
  },
  'summon.smallOmbu': {
    id: 'summon.smallOmbu',
    label: '小オンブ召喚',
    role: 'support',
    pressure: 2.3,
    implemented: false,
    summary: '一定間隔で小オンブを呼ぶ。優先撃破対象を作る。',
    tuningNote: '召喚上限を必ず持つ。',
  },
  'steal.expShard': {
    id: 'steal.expShard',
    label: '欠片吸い',
    role: 'support',
    pressure: 1.75,
    implemented: false,
    summary: '経験値欠片へ寄って回収を邪魔する。',
    tuningNote: '奪われても取り返せる設計にする。',
  },
  'hide.fade': {
    id: 'hide.fade',
    label: '半透明化',
    role: 'modifier',
    pressure: 1.5,
    implemented: false,
    summary: '短時間だけ薄くなる。視認性を壊さない範囲で使う。',
    tuningNote: '完全不可視は禁止。輪郭は残す。',
  },
  'rage.lowHp': {
    id: 'rage.lowHp',
    label: '低HP怒り',
    role: 'modifier',
    pressure: 1.8,
    implemented: false,
    summary: '低HPで短時間強化される。倒し切る快感を作る。',
    tuningNote: '強化中も色/エフェクトで明示する。',
  },
};

export function enemyPatternById(id: EnemyPatternId): EnemyPatternDefinition {
  return ENEMY_PATTERNS[id];
}

export function implementedEnemyPatterns(): EnemyPatternDefinition[] {
  return Object.values(ENEMY_PATTERNS).filter((pattern) => pattern.implemented);
}
