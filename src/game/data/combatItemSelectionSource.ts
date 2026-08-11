import { passives } from './passives.ts';
import { characterProductionPlans } from './characterProductionPlans.ts';
import type { StatusKind } from './combatAffinitySource.ts';

export type CombatItemEffectAxis =
  | 'PICKUP'
  | 'POWER'
  | 'GROWTH'
  | 'MOBILITY'
  | 'TEMPO'
  | 'STATUS_GUARD'
  | 'ROUTE'
  | 'SUPPORT'
  | 'BUILD_COMFORT'
  | 'OBSERVATION'
  | 'DREAM_CONTROL'
  | 'DARK_RISK';

export type CurrentCombatItemFamily = {
  sourceKind: 'CURRENT_RUNTIME';
  itemId: string;
  displayName: string;
  effectAxis: CombatItemEffectAxis;
  runtimeStatus: 'CURRENT_RUNTIME';
};

export type CandidateCombatItemFamily = {
  sourceKind: 'CHARACTER_PASSIVE_CANDIDATE';
  itemId: string;
  characterId: string;
  displayName: string;
  effectAxis: CombatItemEffectAxis;
  statusInteractions: readonly StatusKind[];
  buildRoles: readonly string[];
  effectConcept: string;
  whySelected: string;
  tradeoff: string;
  mobileReadabilityHook: string;
  runtimeStatus: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

const currentAxisById: Readonly<Record<string, CombatItemEffectAxis>> = {
  gold_compass: 'PICKUP',
  travel_badge: 'POWER',
  moonlight_bookmark: 'GROWTH',
  old_ticket: 'MOBILITY',
  white_margin: 'TEMPO',
  pressed_flower: 'POWER',
  loose_map_pin: 'GROWTH',
  small_alarm_clock: 'TEMPO',
};

export const currentCombatItemFamilies: readonly CurrentCombatItemFamily[] = passives.map((passive) => ({
  sourceKind: 'CURRENT_RUNTIME',
  itemId: passive.id,
  displayName: passive.name,
  effectAxis: currentAxisById[passive.id] ?? 'BUILD_COMFORT',
  runtimeStatus: 'CURRENT_RUNTIME',
}));

const candidateSeeds: readonly Omit<CandidateCombatItemFamily, 'sourceKind' | 'displayName' | 'runtimeStatus' | 'runtimeAutoPromotionAllowed'>[] = [
  {
    itemId: 'sen_small_blackboard_eraser',
    characterId: 'sen',
    effectAxis: 'STATUS_GUARD',
    statusInteractions: ['ERASED', 'SEALED'],
    buildRoles: ['debuff recovery', 'short-cycle build support'],
    effectConcept: '一定間隔で直近の弱いDebuff蓄積を一段だけ薄める。Boss固有効果やStage gimmickそのものは消さない。',
    whySelected: 'BLANK系を万能cleanseにせず、ERASED/SEALEDでBuildが崩れた時の戻り道をItem側にも用意できる。',
    tradeoff: '直接damageも成長速度も増やさず、Debuffが来ない面では枠効率が落ちる。',
    mobileReadabilityHook: '小さな黒板消しと白い粉の一往復だけで発動を読ませ、全画面白flashは禁止。',
  },
  {
    itemId: 'ritsu_half_wrapper',
    characterId: 'ritsu',
    effectAxis: 'SUPPORT',
    statusInteractions: ['BURN', 'SOAK'],
    buildRoles: ['pickup distribution', 'relation assist'],
    effectConcept: '一定数のpickupを取るたび次の小回復または短時間buffを二つに分け、本人と補助枠へ低倍率で配る。',
    whySelected: 'リツの「分ける」を単純な火力倍率にせず、継続damageや濡れでテンポを失ったrunの立て直しへ変換できる。',
    tradeoff: '単独で受け取る量は少し下がり、瞬間回復やburst目的ではCurrent回復手段に劣る。',
    mobileReadabilityHook: '半分に裂けた包み紙が左右へ短く飛ぶ二分割motionで効果を示す。',
  },
  {
    itemId: 'koyori_name_paper_cord',
    characterId: 'koyori',
    effectAxis: 'SUPPORT',
    statusInteractions: ['MARKED', 'ILLUMINATED'],
    buildRoles: ['helper targeting', 'marked-target support'],
    effectConcept: '補助灯やrelation assistがMARKED/ILLUMINATED対象を優先し、主火力とは別の小さな追撃や回収補助を行う。',
    whySelected: '召喚・補助を火力コピーにせず、記名と照明の情報を使う役へ分離してコヨリらしさを残せる。',
    tradeoff: '印のない群れへの平均damageは上がらず、単独で完結するBuildには価値が低い。',
    mobileReadabilityHook: '細い紙縒り一本が対象へつながるだけにして、複数線を常時表示しない。',
  },
  {
    itemId: 'gen_station_wayfire',
    characterId: 'gen',
    effectAxis: 'ROUTE',
    statusInteractions: ['ROOTED', 'CHILL', 'FREEZE'],
    buildRoles: ['safe-zone recovery', 'movement rescue'],
    effectConcept: '一定距離を歩くと短寿命の道火を残し、その周囲では移動低下とknockbackの影響を少し抑える。完全拘束無効にはしない。',
    whySelected: '低速Characterでも速度盛りを強制せず、ROOTED/CHILL pressureを「戻れる場所を作る」攻略へ変えられる。',
    tradeoff: '道火の外では恩恵がなく、立ち止まり続けるBuildでは新しい道火を増やせない。',
    mobileReadabilityHook: '足元の小さな駅灯円だけで安全域を示し、床全面を塗りつぶさない。',
  },
  {
    itemId: 'hana_box_bottom_flower',
    characterId: 'hana',
    effectAxis: 'STATUS_GUARD',
    statusInteractions: ['ROOTED', 'SOAK', 'CHILL'],
    buildRoles: ['slow-control sustain', 'trap recovery'],
    effectConcept: '自分が強い移動低下を受けた時、次に置くtrap/supportの持続を少し伸ばし、逃げる以外の立て直しを作る。',
    whySelected: '「保存する」能力を永久拘束へ寄せず、遅い状況ほど設置物の価値が上がる逆転余地として使える。',
    tradeoff: '通常時のdamage倍率は増えず、移動低下を受けない完璧なrunでは発動頻度が低い。',
    mobileReadabilityHook: '押し花が一枚だけ開いて設置物へ移る短いanimationに限定する。',
  },
  {
    itemId: 'yubi_old_postmark',
    characterId: 'yubi',
    effectAxis: 'TEMPO',
    statusInteractions: ['DROWSY', 'SLEEP'],
    buildRoles: ['delayed-action recovery', 'tempo insurance'],
    effectConcept: '長めの行動遅延を受けた後、次の自動発動一回だけを予約し、解除後に遅れて届ける。stun無効化にはしない。',
    whySelected: '微睡/睡眠に対して単なる耐性%ではなく、ユウビの「遅れて届く」をそのままfail-forwardへできる。',
    tradeoff: '予約中は追加発動せず、通常時のcooldown短縮としては白い余白や目覚まし時計に劣る。',
    mobileReadabilityHook: '小さな消印が一度だけ点灯し、予約弾に細い郵便線を付ける。',
  },
  {
    itemId: 'madoka_fogged_window_paper',
    characterId: 'madoka',
    effectAxis: 'OBSERVATION',
    statusInteractions: ['ECLIPSED', 'DISORIENTED'],
    buildRoles: ['target readability', 'route observation'],
    effectConcept: '視認支援や追尾精度が落ちた時、危険度の高い敵一体と安全方向一つだけを短く強調する。自動回避はしない。',
    whySelected: 'ECLIPSEDを画面暗転で苦しませず、DISORIENTEDを操作反転にせず、観察情報そのものをItem回答にできる。',
    tradeoff: '表示された情報を使う操作はPlayerに残り、純damageや移動速度は上がらない。',
    mobileReadabilityHook: '敵一体の輪郭線と小さな方向マーカーだけを出し、常時outlineや大量矢印を禁止する。',
  },
  {
    itemId: 'shiro_unclassified_page',
    characterId: 'shiro',
    effectAxis: 'BUILD_COMFORT',
    statusInteractions: ['ERASED', 'SEALED'],
    buildRoles: ['offer hold', 'short-cycle rebuild'],
    effectConcept: 'LevelUp候補を一枠だけ「未分類」として保留し、次回候補へ持ち越す。消えたstackを同じBuildで積み直す以外の方向転換を助ける。',
    whySelected: '選択肢過多とERASED後の立て直しをraw power購入ではなく、保留というcomfortで解ける。',
    tradeoff: '保留中はその枠から即時powerを得られず、何でも保存できる無限倉庫にはしない。',
    mobileReadabilityHook: '白い頁一枚と「保留」状態の静かな折り目だけで表現し、カードUIを増殖させない。',
  },
  {
    itemId: 'nemu_sleep_page',
    characterId: 'nemu',
    effectAxis: 'DREAM_CONTROL',
    statusInteractions: ['DROWSY', 'SLEEP'],
    buildRoles: ['dream tempo', 'sleep recovery'],
    effectConcept: 'SLEEP解除時に短いFLOW相当の回復tempoを得る。睡眠そのものを無効にせず、起きた後の一手を強くする。',
    whySelected: 'Dream系Statusを「耐性で消す」だけにせず、ネムの揺らぎを受け入れて次行動へつなぐ選択肢になる。',
    tradeoff: '眠らなければ発動せず、Boss戦で安定火力を直接伸ばすItemではない。',
    mobileReadabilityHook: '頁の波紋が一回だけ閉じて朝色の小リングへ変わる短い演出にする。',
  },
  {
    itemId: 'kuroori_fourfold_shadow',
    characterId: 'kuroori',
    effectAxis: 'DARK_RISK',
    statusInteractions: ['ECLIPSED', 'EXPOSED'],
    buildRoles: ['dark-risk tradeoff', 'recovery concealment'],
    effectConcept: 'ECLIPSED中は被damage軽減を少し得る代わりにpickup/route補助情報も弱まり、解除時に短いEXPOSED回答windowを作る。',
    whySelected: 'DARKを悪属性や単純強化にせず、「隠すほど情報も失う」というクロオリのtradeoffをItemでも体験できる。',
    tradeoff: '安全性と情報量を同時に最大化できず、LIGHT/観察Itemとの組み合わせで欠点を補う前提になる。',
    mobileReadabilityHook: '四つ折りの影がHUDを覆わず足元へ畳まれ、解除時だけ細い白縁を出す。',
  },
];

const planByCharacterId = new Map(characterProductionPlans.map((plan) => [plan.characterId, plan]));

export const selectedCandidateCombatItemFamilies: readonly CandidateCombatItemFamily[] = candidateSeeds.map((seed) => {
  const plan = planByCharacterId.get(seed.characterId);
  if (!plan) throw new Error(`missing character production plan for Combat Item candidate: ${seed.characterId}`);
  return {
    sourceKind: 'CHARACTER_PASSIVE_CANDIDATE',
    ...seed,
    displayName: plan.passiveItem,
    runtimeStatus: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  };
});

export const title1CombatItemFamilies = [
  ...currentCombatItemFamilies,
  ...selectedCandidateCombatItemFamilies,
] as const;

const statusInteractionCoverage = new Set<StatusKind>(
  selectedCandidateCombatItemFamilies.flatMap((entry) => entry.statusInteractions),
);
const effectAxisCoverage = new Set(title1CombatItemFamilies.map((entry) => entry.effectAxis));

export const title1CombatItemSelectionSummary = {
  title1TargetCount: 18,
  currentRuntimeCount: currentCombatItemFamilies.length,
  selectedCandidateCount: selectedCandidateCombatItemFamilies.length,
  totalFamilyCount: title1CombatItemFamilies.length,
  selectedCandidateCharacterCount: new Set(selectedCandidateCombatItemFamilies.map((entry) => entry.characterId)).size,
  statusInteractionCoverage: [...statusInteractionCoverage],
  statusInteractionCoverageCount: statusInteractionCoverage.size,
  effectAxisCoverage: [...effectAxisCoverage],
  effectAxisCoverageCount: effectAxisCoverage.size,
  runtimeAutoPromotionAllowed: false,
  title1SelectionIsRuntimeInventory: false,
} as const;
