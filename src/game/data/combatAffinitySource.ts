import { characterAppearanceGenerationContracts } from './characterAppearanceGenerationContracts.ts';
import { enemyProductionEntries } from './enemyProductionDatabase.ts';
import { stageProductionEntries } from './stageProductionDatabase.ts';
import { weapons } from './weapons.ts';

/**
 * Story-first combat attributes.
 * These are not a hard Pokemon-like rock-paper-scissors table: character affinity,
 * enemy resistance and stage weather layer softly so favorite characters remain viable.
 */
export const COMBAT_ATTRIBUTES = [
  'NEUTRAL',
  'LIGHT',
  'DARK',
  'FIRE',
  'WATER',
  'WIND',
  'THUNDER',
  'ICE',
  'EARTH',
  'METAL',
  'BLOOM',
  'DREAM',
  'MEMORY',
  'STAR',
  'BLANK',
] as const;
export type CombatAttribute = (typeof COMBAT_ATTRIBUTES)[number];

export type StatusKind =
  | 'BURN'
  | 'SOAK'
  | 'CHILL'
  | 'FREEZE'
  | 'SHOCK'
  | 'CONDUCTIVE'
  | 'EXPOSED'
  | 'ROOTED'
  | 'DROWSY'
  | 'SLEEP'
  | 'MARKED'
  | 'ILLUMINATED'
  | 'ECLIPSED'
  | 'ERASED'
  | 'SEALED'
  | 'DISORIENTED';

export type BuffKind =
  | 'WARMTH'
  | 'FLOW'
  | 'TAILWIND'
  | 'OVERCHARGE'
  | 'FOCUS'
  | 'FORTIFY'
  | 'REPAIR'
  | 'REMEMBER'
  | 'STAR_GUIDE'
  | 'DAWN_GUARD';

export const attributeDefinitions: Readonly<Record<CombatAttribute, {
  label: string;
  fantasy: string;
  vfx: string;
  commonStatuses: readonly StatusKind[];
}>> = {
  NEUTRAL: { label: '無', fantasy: '属性へ寄せず物理軌道・手数・位置取りで戦う。', vfx: 'paper dust / impact line / physical motion', commonStatuses: [] },
  LIGHT: { label: '光', fantasy: '照らす・暴く・守る。闇を単純な悪として消す属性ではない。', vfx: 'warm lamp edge / dawn rim / restrained rays', commonStatuses: ['ILLUMINATED', 'EXPOSED'] },
  DARK: { label: '闇', fantasy: '隠す・沈める・影へ潜る。高火力と代償、視界・回復阻害。', vfx: 'matte ink / purple-black fold / negative silhouette', commonStatuses: ['ECLIPSED', 'DROWSY'] },
  FIRE: { label: '火', fantasy: '継火・燃焼・再点火。瞬間火力と継続ダメージ。', vfx: 'small ember / wick flame / charred paper edge', commonStatuses: ['BURN'] },
  WATER: { label: '水', fantasy: '流す・濡らす・つなぐ。連携の起点になりやすい。', vfx: 'night water ripple / dew / thin reflective trail', commonStatuses: ['SOAK'] },
  WIND: { label: '風', fantasy: '押す・運ぶ・軌道を変える。群れ制御と移動支援。', vfx: 'paper flutter / curved air line / cloth motion', commonStatuses: ['DISORIENTED'] },
  THUNDER: { label: '雷', fantasy: '連鎖・瞬断・起動。濡れや金属と強く反応する。', vfx: 'short amber-white branch / no full-screen flash', commonStatuses: ['SHOCK', 'CONDUCTIVE'] },
  ICE: { label: '氷', fantasy: '冷やす・止める・時間を稼ぐ。硬直はBossで短縮される。', vfx: 'frosted glass edge / pale crystal dust / cold breath', commonStatuses: ['CHILL', 'FREEZE'] },
  EARTH: { label: '地', fantasy: '重さ・足場・衝撃。押し返し耐性とBreakを担う。', vfx: 'stone chip / pavement crack / dust ring', commonStatuses: ['EXPOSED'] },
  METAL: { label: '鉄', fantasy: '刃・針・工具・機械。貫通、装甲破り、導電。', vfx: 'dull brass / iron spark / thin edge glint', commonStatuses: ['CONDUCTIVE', 'EXPOSED'] },
  BLOOM: { label: '花', fantasy: '植物・押花・糸・根。拘束、回復、時間をかける強さ。', vfx: 'pressed petal / thread root / dry pollen', commonStatuses: ['ROOTED'] },
  DREAM: { label: '夢', fantasy: '眠り・揺らぎ・予測外。行動遅延と高振れ。', vfx: 'soft violet ripple / double image / page-wave', commonStatuses: ['DROWSY', 'SLEEP'] },
  MEMORY: { label: '記憶', fantasy: '名前・記録・反復。繰り返し当てるほど意味が増す。', vfx: 'graphite record line / tiny tag point / persistent trace', commonStatuses: ['MARKED', 'SEALED'] },
  STAR: { label: '星', fantasy: '導き・照準・軌道。クリティカル、追尾、遠距離支援。', vfx: 'paper-gold fleck / pinprick light / constellation-free arc', commonStatuses: ['MARKED', 'ILLUMINATED'] },
  BLANK: { label: '余白', fantasy: '消去ではなく書き直せる空間。Buff/Debuffの解除・変換。', vfx: 'white paper gap / erased dust / quiet gold rim', commonStatuses: ['ERASED', 'SEALED'] },
};

export const statusDefinitions: Readonly<Record<StatusKind, { label: string; rule: string; bossRule: string }>> = {
  BURN: { label: '燃焼', rule: '短時間DoT。再付与で残り時間更新、無限stack禁止。', bossRule: 'DoTは有効、最大HP割合化は禁止。' },
  SOAK: { label: '濡れ', rule: '単体では弱い。雷/氷Reactionの起点。', bossRule: '有効。Reaction硬直だけ短縮。' },
  CHILL: { label: '冷え', rule: '移動速度を段階低下。', bossRule: '効果量を約半分。' },
  FREEZE: { label: '凍結', rule: '短時間停止。連続凍結に内部CD。', bossRule: '完全停止ではなく短い鈍化/硬直へ変換。' },
  SHOCK: { label: '感電', rule: '小さな瞬断と連鎖damage。', bossRule: '長いstun禁止、追加damage中心。' },
  CONDUCTIVE: { label: '導電', rule: '次の雷hitのReaction効率を上げる。', bossRule: '有効。' },
  EXPOSED: { label: '露出', rule: '短時間、属性耐性/装甲を少し下げる。', bossRule: '上限を低くする。' },
  ROOTED: { label: '根留め', rule: '移動を止める/強く鈍化。攻撃行動までは奪わない。', bossRule: '鈍化へ変換。' },
  DROWSY: { label: '微睡', rule: '移動/攻撃テンポを低下。', bossRule: '効果量半減。' },
  SLEEP: { label: '睡眠', rule: '短時間停止し、強いhitで解除。', bossRule: '短い行動遅延へ変換。' },
  MARKED: { label: '記名', rule: '同一対象への連続hit/特定Reactionを強化。', bossRule: '有効、stack上限あり。' },
  ILLUMINATED: { label: '照明', rule: '隠密/暗幕を剥がし、Light系連携を通しやすくする。', bossRule: '有効。' },
  ECLIPSED: { label: '夜蝕', rule: '回復/視認支援を少し弱める。', bossRule: 'Player側に使う場合も過剰な画面暗転禁止。' },
  ERASED: { label: '薄れ', rule: '一時Buffや蓄積の一部を弱める。完全消去しない。', bossRule: 'Boss固有行動そのものは消さない。' },
  SEALED: { label: '封じ', rule: 'Enemy特殊行動の頻度を一時低下。', bossRule: '無効化ではなく再使用間隔増加。' },
  DISORIENTED: { label: '迷い', rule: '追尾/突進の精度を落とす。', bossRule: '方向補正を小さくする。' },
};

export const buffDefinitions: Readonly<Record<BuffKind, { label: string; rule: string }>> = {
  WARMTH: { label: 'ぬくもり', rule: '小回復/燃焼耐性/凍結耐性を少し上げる。' },
  FLOW: { label: '流れ', rule: '移動とcooldownを少し改善。' },
  TAILWIND: { label: '追い風', rule: '移動/弾速/knockbackを少し改善。' },
  OVERCHARGE: { label: '過充電', rule: '雷status buildupとchain数を一時強化。' },
  FOCUS: { label: '集中', rule: 'critical/狙い/弱点命中を少し改善。' },
  FORTIFY: { label: '踏ん張り', rule: '被damage/knockback/staggerを少し軽減。' },
  REPAIR: { label: '修復', rule: 'shield/HP/設置物の維持をゆっくり回復。' },
  REMEMBER: { label: '想起', rule: 'MARKED対象と記憶dropに小さなbonus。' },
  STAR_GUIDE: { label: '星導', rule: '弾道補正/遠距離精度/criticalを少し上げる。' },
  DAWN_GUARD: { label: '暁守', rule: '光/闇系Debuffのdurationを抑える。' },
};

export const attributeReactions = [
  { id: 'arc_chain', requires: ['WATER', 'THUNDER'] as const, statuses: ['SOAK'] as const, name: '水雷連鎖', rule: '濡れた対象へ雷が入り周囲へ小連鎖。Bossはstun短縮。' },
  { id: 'frost_bind', requires: ['WATER', 'ICE'] as const, statuses: ['SOAK', 'CHILL'] as const, name: '凍結縛り', rule: '濡れ+冷えで強い鈍化、雑魚のみ短い凍結。' },
  { id: 'ember_spread', requires: ['FIRE', 'WIND'] as const, statuses: ['BURN'] as const, name: '火送り', rule: '燃焼を近隣へ薄く拡散。無限chain禁止。' },
  { id: 'eclipse_break', requires: ['LIGHT', 'DARK'] as const, statuses: [] as const, name: '明暗破り', rule: '光と闇が同一対象へ入ると一時EXPOSED。どちらかを悪属性扱いしない。' },
  { id: 'metal_overload', requires: ['METAL', 'THUNDER'] as const, statuses: ['CONDUCTIVE'] as const, name: '過負荷', rule: '導電対象へ雷でBreak値増加。機械系にも万能特効にはしない。' },
  { id: 'regrowth', requires: ['BLOOM', 'WATER'] as const, statuses: ['ROOTED'] as const, name: '芽吹き', rule: '拘束時間を少し伸ばし、撃破時に小回復候補。' },
  { id: 'lucid_recall', requires: ['DREAM', 'MEMORY'] as const, statuses: ['MARKED'] as const, name: '明晰想起', rule: 'MARKED対象への夢hitで記憶drop/追撃chanceを小強化。' },
  { id: 'rewrite', requires: ['BLANK', 'MEMORY'] as const, statuses: ['MARKED'] as const, name: '書き直し', rule: 'MARKEDを一部消費してburst/SEALEDへ変換。' },
  { id: 'foundation_break', requires: ['EARTH', 'METAL'] as const, statuses: ['EXPOSED'] as const, name: '基礎割り', rule: '重いhitでarmor/stagger耐性を短時間低下。' },
  { id: 'beacon', requires: ['STAR', 'LIGHT'] as const, statuses: ['ILLUMINATED'] as const, name: '灯星標', rule: '照らされた対象へ星弾の追尾/criticalを小強化。' },
  { id: 'nightmare', requires: ['DARK', 'DREAM'] as const, statuses: ['DROWSY'] as const, name: '悪夢', rule: '微睡対象へ闇hitで追加damage、睡眠loopは禁止。' },
  { id: 'thermal_crack', requires: ['FIRE', 'ICE'] as const, statuses: ['CHILL'] as const, name: '温度割れ', rule: '冷えた対象へ火でEXPOSED、凍結は解除。' },
] as const;

export const combatBalanceCaps = {
  characterPrimaryDamageMultiplier: 1.12,
  characterSecondaryDamageMultiplier: 1.06,
  characterFrictionDamageMultiplier: 0.92,
  enemyWeaknessMultiplier: 1.20,
  enemyResistanceMultiplier: 0.85,
  stageFavoredMultiplier: 1.10,
  stageSuppressedMultiplier: 0.92,
  finalAdvantageCap: 1.45,
  finalDisadvantageFloor: 0.75,
  noStageHardCharacterLock: true,
} as const;

type AffinitySeed = {
  primary: CombatAttribute;
  secondary: CombatAttribute;
  friction: CombatAttribute;
  resistStatus: StatusKind;
  combatIdentity: string;
};

const characterAffinitySeeds: Readonly<Record<string, AffinitySeed>> = {
  yui: { primary: 'MEMORY', secondary: 'LIGHT', friction: 'DARK', resistStatus: 'ERASED', combatIdentity: '記名と回収。長く当て続けるほど対象を読み解く。' },
  asa: { primary: 'WIND', secondary: 'MEMORY', friction: 'EARTH', resistStatus: 'DISORIENTED', combatIdentity: '速い紙刃と名札。先に印を付けて走り抜ける。' },
  nagi: { primary: 'ICE', secondary: 'BLANK', friction: 'FIRE', resistStatus: 'ECLIPSED', combatIdentity: '封じと時間稼ぎ。近距離を安全へ変える。' },
  michiru: { primary: 'STAR', secondary: 'WIND', friction: 'DARK', resistStatus: 'DISORIENTED', combatIdentity: '位置取りと導き。遠距離/誘導buildの精度が高い。' },
  tomori: { primary: 'FIRE', secondary: 'METAL', friction: 'ICE', resistStatus: 'BURN', combatIdentity: '継火と修理。設置物・継続damage・再点火が得意。' },
  sen: { primary: 'EARTH', secondary: 'BLANK', friction: 'DREAM', resistStatus: 'DISORIENTED', combatIdentity: '線を引き足場を作る。lane controlとBreak。' },
  ritsu: { primary: 'METAL', secondary: 'FIRE', friction: 'DREAM', resistStatus: 'EXPOSED', combatIdentity: '割る・分ける・守る。近中距離の物理pressure。' },
  koyori: { primary: 'BLOOM', secondary: 'LIGHT', friction: 'DARK', resistStatus: 'ECLIPSED', combatIdentity: '小さな補助灯と結び。support/召喚寄り。' },
  gen: { primary: 'EARTH', secondary: 'STAR', friction: 'THUNDER', resistStatus: 'DISORIENTED', combatIdentity: '重い足取りと古い針。低速だが位置が崩れにくい。' },
  hana: { primary: 'BLOOM', secondary: 'WATER', friction: 'FIRE', resistStatus: 'ROOTED', combatIdentity: '保存と持続。回復・鈍化・長期戦。' },
  yubi: { primary: 'WIND', secondary: 'LIGHT', friction: 'EARTH', resistStatus: 'DROWSY', combatIdentity: '遅れて届く軌道。time-delay projectileと追い風。' },
  madoka: { primary: 'LIGHT', secondary: 'STAR', friction: 'DARK', resistStatus: 'ECLIPSED', combatIdentity: '観測と先読み。敵を暴き弱点へ通す。' },
  shiro: { primary: 'BLANK', secondary: 'MEMORY', friction: 'FIRE', resistStatus: 'ERASED', combatIdentity: '分類と変換。Buff/Debuffを書き換える。' },
  tobari: { primary: 'EARTH', secondary: 'METAL', friction: 'WIND', resistStatus: 'DISORIENTED', combatIdentity: '境界と門。knockback耐性と通路制御。' },
  nemu: { primary: 'DREAM', secondary: 'WATER', friction: 'THUNDER', resistStatus: 'DROWSY', combatIdentity: '微睡と揺らぎ。controlと高振れ。' },
  kuroori: { primary: 'DARK', secondary: 'BLANK', friction: 'LIGHT', resistStatus: 'ILLUMINATED', combatIdentity: '折る・隠す・畳む。高riskの影control。' },
  kage1: { primary: 'EARTH', secondary: 'DARK', friction: 'WIND', resistStatus: 'EXPOSED', combatIdentity: '大きな体で受け止める。防御/反撃。' },
  kage2: { primary: 'DARK', secondary: 'DREAM', friction: 'LIGHT', resistStatus: 'ILLUMINATED', combatIdentity: '隠す/遅らせる/外す。debuff utility。' },
  kage3: { primary: 'METAL', secondary: 'STAR', friction: 'DREAM', resistStatus: 'DISORIENTED', combatIdentity: '角度と精密射線。弱点へ正確に通す。' },
  kage4: { primary: 'BLOOM', secondary: 'BLANK', friction: 'FIRE', resistStatus: 'ERASED', combatIdentity: '縫う・継ぐ・未完成を残す。拘束とsupport。' },
  ren: { primary: 'LIGHT', secondary: 'METAL', friction: 'DREAM', resistStatus: 'DISORIENTED', combatIdentity: '比較と焦点。単体解析/critical寄り。' },

  F01: { primary: 'FIRE', secondary: 'LIGHT', friction: 'ICE', resistStatus: 'DROWSY', combatIdentity: '場を温めるsocial fighter。連撃/鼓舞。' },
  F02: { primary: 'WATER', secondary: 'STAR', friction: 'FIRE', resistStatus: 'ECLIPSED', combatIdentity: '静かな流れと精密支援。' },
  F03: { primary: 'DREAM', secondary: 'DARK', friction: 'LIGHT', resistStatus: 'SLEEP', combatIdentity: '長い時間の魔術。時間差/蓄積control。' },
  F04: { primary: 'FIRE', secondary: 'MEMORY', friction: 'ICE', resistStatus: 'ERASED', combatIdentity: '有限の時間を燃やす弟子。高い継続成長。' },
  F05: { primary: 'METAL', secondary: 'FIRE', friction: 'WATER', resistStatus: 'EXPOSED', combatIdentity: '職人。工具/設置/修理から火力を作る。' },
  F06: { primary: 'WIND', secondary: 'EARTH', friction: 'THUNDER', resistStatus: 'DISORIENTED', combatIdentity: '嗅覚と走路。索敵/回収/接近離脱。' },
  F07: { primary: 'DARK', secondary: 'DREAM', friction: 'WATER', resistStatus: 'DROWSY', combatIdentity: '気配と間合い。回避/奇襲/mark。' },
  F08: { primary: 'METAL', secondary: 'MEMORY', friction: 'THUNDER', resistStatus: 'ERASED', combatIdentity: '同じ記憶から別buildへ分岐する人工人格。' },
  F09: { primary: 'THUNDER', secondary: 'METAL', friction: 'WATER', resistStatus: 'SHOCK', combatIdentity: 'maintenance network。chain/repair/overload。' },
  F10: { primary: 'EARTH', secondary: 'FIRE', friction: 'DREAM', resistStatus: 'EXPOSED', combatIdentity: '大きな身体で押す/守る/崩す。' },
  F11: { primary: 'LIGHT', secondary: 'BLOOM', friction: 'DARK', resistStatus: 'ILLUMINATED', combatIdentity: '装いと自己表現をBuff変換へつなぐsupport。' },
  F12: { primary: 'WIND', secondary: 'BLANK', friction: 'EARTH', resistStatus: 'DISORIENTED', combatIdentity: '分類しない余白。位置/音/flow control。' },
  F13: { primary: 'WATER', secondary: 'MEMORY', friction: 'THUNDER', resistStatus: 'SOAK', combatIdentity: '双子の共有基盤を長期連携へ使う。' },
  F14: { primary: 'THUNDER', secondary: 'STAR', friction: 'EARTH', resistStatus: 'SHOCK', combatIdentity: '双子の差異を瞬発/照準へ使う。' },
  F15: { primary: 'WIND', secondary: 'METAL', friction: 'EARTH', resistStatus: 'DISORIENTED', combatIdentity: '車椅子と一体の速度/route attack。' },
};

export const characterCombatProfiles = characterAppearanceGenerationContracts.map((character) => ({
  characterId: character.id,
  characterName: character.displayName,
  ...characterAffinitySeeds[character.id],
  primaryDamageMultiplier: combatBalanceCaps.characterPrimaryDamageMultiplier,
  secondaryDamageMultiplier: combatBalanceCaps.characterSecondaryDamageMultiplier,
  frictionDamageMultiplier: combatBalanceCaps.characterFrictionDamageMultiplier,
  incomingDamageWeakness: false as const,
  note: '不得意は主に出力/状態蓄積の差。被damage弱点にはしないため、好きなキャラをstage出禁にしない。',
}));

export const existingWeaponCombatProfiles = [
  { weaponId: 'night_pencil', attributes: ['MEMORY'] as const, statuses: ['MARKED'] as const, vfx: 'graphite line + tiny record point' },
  { weaponId: 'marble', attributes: ['WATER', 'MEMORY'] as const, statuses: ['SOAK'] as const, vfx: 'cloudy glass reflection + wet arc' },
  { weaponId: 'moon_bookmark', attributes: ['ICE', 'BLANK'] as const, statuses: ['CHILL'] as const, vfx: 'cold paper arc + pale moon edge' },
  { weaponId: 'black_ink_bottle', attributes: ['DARK'] as const, statuses: ['ECLIPSED'] as const, vfx: 'matte ink bloom + capillary edge' },
  { weaponId: 'stardust_shot', attributes: ['STAR', 'LIGHT'] as const, statuses: ['ILLUMINATED'] as const, vfx: 'paper-gold flecks + pinprick trail' },
  { weaponId: 'postcard_blade', attributes: ['WIND', 'METAL'] as const, statuses: ['EXPOSED'] as const, vfx: 'paper-cut line + perforation rhythm' },
  { weaponId: 'paper_airplane', attributes: ['WIND'] as const, statuses: ['DISORIENTED'] as const, vfx: 'banking paper trail + fold dust' },
  { weaponId: 'streetlamp_ring', attributes: ['LIGHT', 'FIRE'] as const, statuses: ['ILLUMINATED'] as const, vfx: 'warm streetlight pool + restrained dust' },
  { weaponId: 'unfinished_line', attributes: ['MEMORY', 'METAL'] as const, statuses: ['MARKED', 'EXPOSED'] as const, vfx: 'dense graphite pressure line' },
  { weaponId: 'north_star_lantern', attributes: ['STAR', 'LIGHT'] as const, statuses: ['ILLUMINATED', 'MARKED'] as const, vfx: 'warm lantern + radial paper stars' },
  { weaponId: 'dawn_ink_lamp', attributes: ['LIGHT', 'DARK'] as const, statuses: ['ILLUMINATED', 'ECLIPSED'] as const, vfx: 'black-to-dawn ground transition' },
  { weaponId: 'unforgotten_name', attributes: ['MEMORY', 'LIGHT'] as const, statuses: ['MARKED', 'SEALED'] as const, vfx: 'persistent graphite name-line without text' },
  { weaponId: 'memory_marble', attributes: ['WATER', 'MEMORY'] as const, statuses: ['SOAK', 'MARKED'] as const, vfx: 'memory reflection inside old glass' },
  { weaponId: 'addressless_blade', attributes: ['WIND', 'METAL'] as const, statuses: ['EXPOSED'] as const, vfx: 'sealed-paper cut streak' },
  { weaponId: 'tailwind_plane', attributes: ['WIND', 'LIGHT'] as const, statuses: ['DISORIENTED'] as const, vfx: 'long warm wind arc + folded paper' },
] as const;

export type StageCombatProfile = {
  stageId: string;
  favored: readonly CombatAttribute[];
  suppressed: CombatAttribute;
  hazardStatus: StatusKind;
  buildQuestion: string;
};

const stageCombatSeeds: readonly StageCombatProfile[] = [
  { stageId: 'forgotten_street', favored: ['LIGHT', 'MEMORY'], suppressed: 'DARK', hazardStatus: 'ECLIPSED', buildQuestion: '基準面。照らす/記名するか、物理手数で押すか。' },
  { stageId: 'name_tag_alley', favored: ['MEMORY', 'WIND'], suppressed: 'EARTH', hazardStatus: 'MARKED', buildQuestion: '高速の貼り間違いを追う。mark管理と移動が楽。' },
  { stageId: 'moon_box_library', favored: ['ICE', 'BLANK'], suppressed: 'FIRE', hazardStatus: 'SEALED', buildQuestion: '狭い安全圏を守る。control/defenseが強い。' },
  { stageId: 'return_map_crossing', favored: ['STAR', 'WIND'], suppressed: 'DARK', hazardStatus: 'DISORIENTED', buildQuestion: '方向を失う面。追尾/route/移動補助が価値を持つ。' },
  { stageId: 'repair_lamp_workshop', favored: ['FIRE', 'METAL'], suppressed: 'ICE', hazardStatus: 'BURN', buildQuestion: '設置と再点火。repair/DoT/工具武器が伸びる。' },
  { stageId: 'chalk_classroom', favored: ['EARTH', 'BLANK'], suppressed: 'DREAM', hazardStatus: 'DISORIENTED', buildQuestion: '白線laneを読む。重さと書き直しが安定。' },
  { stageId: 'half_candy_arcade', favored: ['FIRE', 'BLOOM'], suppressed: 'ICE', hazardStatus: 'MARKED', buildQuestion: '分裂群れ。spread/chain/分配damageが強い。' },
  { stageId: 'paper_cord_playground', favored: ['BLOOM', 'LIGHT'], suppressed: 'DARK', hazardStatus: 'ROOTED', buildQuestion: '小さな補助を守る。support/召喚/拘束解除。' },
  { stageId: 'old_compass_station', favored: ['EARTH', 'STAR'], suppressed: 'THUNDER', hazardStatus: 'DISORIENTED', buildQuestion: '低速重圧。位置を崩されないbuildが楽。' },
  { stageId: 'pressed_flower_archive', favored: ['BLOOM', 'WATER'], suppressed: 'FIRE', hazardStatus: 'ROOTED', buildQuestion: '保存罠と持続戦。水花Reactionが活きる。' },
  { stageId: 'unposted_post_office', favored: ['WIND', 'LIGHT'], suppressed: 'EARTH', hazardStatus: 'DROWSY', buildQuestion: '時間差着弾。速度/先読み/遠隔処理。' },
  { stageId: 'paper_plane_window', favored: ['LIGHT', 'STAR'], suppressed: 'DARK', hazardStatus: 'ILLUMINATED', buildQuestion: '視線/可視化。遠距離criticalと先制が伸びる。' },
  { stageId: 'white_bookmark_library', favored: ['BLANK', 'MEMORY'], suppressed: 'FIRE', hazardStatus: 'ERASED', buildQuestion: '未分類Buff/Debuffを変換して戦う。' },
  { stageId: 'ticket_gate_station', favored: ['EARTH', 'METAL'], suppressed: 'WIND', hazardStatus: 'SEALED', buildQuestion: '通す/止める。knockbackより境界control。' },
  { stageId: 'dream_waterway', favored: ['DREAM', 'WATER'], suppressed: 'THUNDER', hazardStatus: 'DROWSY', buildQuestion: '揺らぐ水路。夢の高振れか雷Reactionで崩すか。' },
  { stageId: 'black_origami_roof', favored: ['LIGHT', 'WIND'], suppressed: 'DARK', hazardStatus: 'ECLIPSED', buildQuestion: '闇耐性敵が多い。光で暴くか風で折りを崩す。' },
  { stageId: 'erased_name_wall', favored: ['MEMORY', 'BLANK'], suppressed: 'DARK', hazardStatus: 'ERASED', buildQuestion: 'Buff/名前を薄くされる。記名と書き直し。' },
  { stageId: 'ruler_rooftop', favored: ['STAR', 'METAL'], suppressed: 'DREAM', hazardStatus: 'EXPOSED', buildQuestion: '角度/射線。精密projectileとBreakが強い。' },
  { stageId: 'blank_card_room', favored: ['BLANK', 'MEMORY'], suppressed: 'FIRE', hazardStatus: 'SEALED', buildQuestion: '空白を埋めすぎない。変換/再構築build。' },
  { stageId: 'dawn_return_square', favored: ['LIGHT', 'DARK', 'MEMORY', 'STAR'], suppressed: 'NEUTRAL', hazardStatus: 'MARKED', buildQuestion: '総合面。単属性正解ではなくReactionを2つ以上組む。' },
];
export const stageCombatProfiles = stageCombatSeeds;

const stageProfileById = new Map(stageCombatProfiles.map((stage) => [stage.stageId, stage]));

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function deriveEnemyAttributes(enemy: (typeof enemyProductionEntries)[number]) {
  const stageProfiles = enemy.stageAffinity.map((id) => stageProfileById.get(id)).filter(Boolean) as StageCombatProfile[];
  const weaknesses: CombatAttribute[] = stageProfiles.flatMap((stage) => stage.favored);
  const resistances: CombatAttribute[] = stageProfiles.map((stage) => stage.suppressed).filter((attribute) => attribute !== 'NEUTRAL');

  const id = enemy.id;
  if (/violet|black_origami|great_shadow/.test(id)) { weaknesses.push('LIGHT'); resistances.push('DARK'); }
  if (/blue|dew|water|dream_wave/.test(id)) { weaknesses.push('THUNDER'); resistances.push('WATER'); }
  if (/match|ember|lamp/.test(id)) { weaknesses.push('WATER'); resistances.push('FIRE'); }
  if (/ruler|needle|metal|key/.test(id)) { weaknesses.push('THUNDER'); resistances.push('METAL'); }
  if (/flower|thread|vine/.test(id)) { weaknesses.push('FIRE'); resistances.push('BLOOM'); }
  if (/blank|eraser/.test(id)) { weaknesses.push('MEMORY'); resistances.push('BLANK'); }
  if (/name|label/.test(id)) { weaknesses.push('BLANK'); resistances.push('MEMORY'); }
  if (/window|lens/.test(id)) { weaknesses.push('DARK'); resistances.push('LIGHT'); }

  if (weaknesses.length === 0) weaknesses.push('LIGHT');
  if (resistances.length === 0) resistances.push('DARK');

  return {
    enemyId: enemy.id,
    enemyName: enemy.name,
    rank: enemy.rank,
    weaknesses: unique(weaknesses).slice(0, enemy.rank === 'boss' ? 2 : 3),
    resistances: unique(resistances).slice(0, enemy.rank === 'boss' ? 3 : 2),
    weaknessMultiplier: enemy.rank === 'boss' ? 1.15 : combatBalanceCaps.enemyWeaknessMultiplier,
    resistanceMultiplier: enemy.rank === 'boss' ? 0.80 : combatBalanceCaps.enemyResistanceMultiplier,
    hardControlDurationMultiplier: enemy.rank === 'boss' ? 0.30 : enemy.rank === 'elite' ? 0.60 : 1,
    noAttributeImmunity: true as const,
  };
}

export const enemyCombatProfiles = enemyProductionEntries.map(deriveEnemyAttributes);

export const combatAffinitySummary = {
  attributeCount: COMBAT_ATTRIBUTES.length - 1,
  totalAttributesIncludingNeutral: COMBAT_ATTRIBUTES.length,
  statusCount: Object.keys(statusDefinitions).length,
  buffCount: Object.keys(buffDefinitions).length,
  reactionCount: attributeReactions.length,
  characterProfileCount: characterCombatProfiles.length,
  existingWeaponProfileCount: existingWeaponCombatProfiles.length,
  runtimeWeaponCount: weapons.length,
  enemyProfileCount: enemyCombatProfiles.length,
  stageProfileCount: stageCombatProfiles.length,
  sourceStageCount: stageProductionEntries.length,
  favoriteCharacterViabilityProtected: true,
} as const;
