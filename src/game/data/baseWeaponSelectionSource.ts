import { COMBAT_ATTRIBUTES, existingWeaponCombatProfiles } from './combatAffinitySource.ts';
import {
  baseWeaponCandidates,
  currentBaseWeaponIds,
  type BaseWeaponCandidate,
} from './weaponExpansionSource.ts';
import { currentCharacterCombatKitEntries } from './currentCharacterCombatKitSource.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';

export type BaseWeaponSelectionDecision =
  | 'TITLE1_SELECTED'
  | 'HOLD_TARGET_LINK_READABILITY'
  | 'HOLD_TEMP_TERRAIN_DENSITY'
  | 'HOLD_RETURN_FAMILY_OVERLAP'
  | 'HOLD_TRAIL_PERFORMANCE';

export type BaseWeaponSelectionEntry = {
  weaponId: string;
  weaponName: string;
  archetype: BaseWeaponCandidate['archetype'];
  attributes: BaseWeaponCandidate['attributes'];
  appliesStatuses: BaseWeaponCandidate['appliesStatuses'];
  decision: BaseWeaponSelectionDecision;
  selectedForTitle1: boolean;
  reason: string;
  overlapOrRisk: string;
  keepInCandidateReservoir: true;
  runtimeStatus: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

const decisions: Record<string, Omit<BaseWeaponSelectionEntry, 'weaponId' | 'weaponName' | 'archetype' | 'attributes' | 'appliesStatuses' | 'runtimeStatus'>> = {
  ember_matchcase: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: '短射程scatterでBURNを複数へ配る役。Current projectileの単発処理と違い、群れへReaction起点を薄く撒く用途が明確。',
    overlapOrRisk: '火属性だから採用するのではなくscatter/status-distribution役として採用。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  rain_thread: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: '二体tetherでSOAK共有と位置関係を扱う唯一の候補。Fusion/Reactionの「二体をどうつなぐか」をWeapon側へ持ち込める。',
    overlapOrRisk: 'chain damage化すると銅の音叉と重なるため、damage伝播よりstatus/position共有を守る。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  bellows_fan: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: '広いcone pushでdamageより退路を作る。アサのWIND専門性と好きなCharacter用movement answerの両方に必要。',
    overlapOrRisk: '高火力coneへ寄せず、route controlを主役にする。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  copper_tuning_fork: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'THUNDERの初期build入口として重要。CONDUCTIVE優先の短いpulse chainで、長stunなしにReaction学習を作れる。',
    overlapOrRisk: '一般chain lightning化すると色違い魔法になるため、導電target preferenceと短pulseを固定。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  frost_window: {
    decision: 'HOLD_TEMP_TERRAIN_DENSITY', selectedForTitle1: false,
    reason: 'ICE lane wall自体は良いが、月のしおりcontrol・境界チョーク・Stage terrainと同時に入れるとmobile画面の線情報が飽和する可能性が高い。',
    overlapOrRisk: 'temporary terrainの視認性/経路探索/Enemy pathingを実機検証してから再選定。削除はしない。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  pavement_hammer: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'slow close slam + directional breakで、projectileではないEARTH専門の近距離回答を作る。セン/ゲン/カナメの足場思想とも一致。',
    overlapOrRisk: 'full-circle shockwaveへ広げず、方向を読むslamとして維持。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  repair_spanner: {
    decision: 'HOLD_RETURN_FAMILY_OVERLAP', selectedForTitle1: false,
    reason: 'outbound/return hitは魅力的だが、Current紙ひこうきとSelected帰針のreturn familyを先に差別化した方が学習負荷を抑えられる。',
    overlapOrRisk: 'return角度そのものが独自攻略になるまで保留。Tomoriのstarterは灯芯針で成立する。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  pressed_flower_cards: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'arming delayを持つ小型trap field。ROOTEDを「硬直ボタン」でなく場所を選ぶcontrolへ変え、ハナ/コヨリのidentityも支える。',
    overlapOrRisk: '巨大persistent AoE禁止。trap個数/寿命を抑えmobile readabilityを守る。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  dream_alarm: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'telegraph付きdelayed pulseで「今ではなく少し後」をbuild判断にする。ネムのDREAM tempo identityに直結。',
    overlapOrRisk: 'SLEEP永久拘束ではなくDROWSY/tempo shaping中心。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  name_reel: {
    decision: 'HOLD_TARGET_LINK_READABILITY', selectedForTitle1: false,
    reason: 'MEMORY link-chainは魅力がある一方、ユイのNight Pencil MARKED、relation assist線、Enemy tether表現と同時に出ると接続線の意味が混線しやすい。',
    overlapOrRisk: 'target linkを文字/UIに頼らずmobileで読めるvisual grammarが固まるまでCandidate reservoirへ保持。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  star_map_pin: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'far/high-priority targetを選ぶslow cadence homing snipe。ミチル/マドカ/トキに遠距離priorityという明確な専門軸を与える。',
    overlapOrRisk: '万能homingにせず遠距離/priority条件を維持。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  white_eraser: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'low-damage sweep cleanse/dispelling utility。火力以外でBuild枠を取る価値を作り、BLANKの「消す=攻撃」単純化を避ける。',
    overlapOrRisk: '敵Buff全消去や自己Debuff全解除は禁止しbudget制にする。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  pocket_mirror: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'timed reflect counterでprojectileを読む技量をBuildへ入れる。LIGHTをただのdamage属性にせず観察/返答へ変換。',
    overlapOrRisk: '接触attackはreflect不可。常時反射盾にしない。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  black_folding_fan: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'cone veilでtracking/charge pressureを弱めるDARK utility。DARK=damage/悪の単純化を避け、クロオリの閉じる/開くidentityを支える。',
    overlapOrRisk: '画面暗転や黒fog禁止。追尾frictionを主効果にする。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  morning_dew_dropper: {
    decision: 'HOLD_TRAIL_PERFORMANCE', selectedForTitle1: false,
    reason: 'movement breadcrumbは独自だが、Stage residue・BURN seam・boundary line・trapと同時表示するとmobileの床情報とentity更新量を増やす。',
    overlapOrRisk: 'trail emitter性能と床readabilityを実機で測るまで保留。WATER route utilityは雨縫い糸で先に検証できる。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  wick_needle: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'line pierce後に細いBURN seamを残す二段攻撃。Tomoriの「直す線/継ぐ火」を設置系gameplayへつなげる主武器候補。',
    overlapOrRisk: '巨大fire wall化せず細線・短寿命を守る。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  return_compass_needle: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'outbound自由弾 + return時MARKED homingという二phase。単純boomerangより帰路/目印の意味が強く、ミチル/ゲン/トキへ共有できる。',
    overlapOrRisk: 'Selected return familyはこれ一つに絞り、修理スパナをHoldして役割重複を抑える。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  repair_thread_spool: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'orbit entityが短いroot linkを作る。通常orbit damageではなく「つなぎ、切れる」ことが効果になるためツムギのidentityに必要。',
    overlapOrRisk: 'link本数を制限し、押花trapとhard-control量を同時最大化しない。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  sleep_ribbon: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: 'expanding spiral controlで敵のtempoだけをずらす。Dream Alarmの点的delayと違い、空間を広げるDREAM/WIND control。',
    overlapOrRisk: 'fog/AoE blanketにせず一本のspiral pathを読む。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
  boundary_chalk: {
    decision: 'TITLE1_SELECTED', selectedForTitle1: true,
    reason: '一本だけ保持するcrossing line trigger。Stage laneを読む学習、セン/トバリの境界思想、好きなCharacter用route answerを一つで支える。',
    overlapOrRisk: 'lineを複数常設しない。Frost WindowをHoldしてterrain線の同時増殖を避ける。', keepInCandidateReservoir: true, runtimeAutoPromotionAllowed: false,
  },
};

export const baseWeaponSelectionEntries: readonly BaseWeaponSelectionEntry[] = baseWeaponCandidates.map((weapon) => {
  const decision = decisions[weapon.id];
  if (!decision) throw new Error(`missing Base Weapon selection decision: ${weapon.id}`);
  return {
    weaponId: weapon.id,
    weaponName: weapon.name,
    archetype: weapon.archetype,
    attributes: weapon.attributes,
    appliesStatuses: weapon.appliesStatuses,
    ...decision,
    runtimeStatus: weapon.runtimeStatus,
  };
});

export const selectedTitle1BaseWeaponCandidates = baseWeaponSelectionEntries.filter((entry) => entry.selectedForTitle1);
export const heldBaseWeaponCandidates = baseWeaponSelectionEntries.filter((entry) => !entry.selectedForTitle1);
const selectedCandidateIds = new Set(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
const heldCandidateIds = new Set(heldBaseWeaponCandidates.map((entry) => entry.weaponId));
const candidateStartingWeaponIds = new Set(
  currentCharacterCombatKitEntries
    .filter((entry) => entry.startingWeapon.sourceKind === 'BASE_CANDIDATE')
    .map((entry) => entry.startingWeapon.weaponId),
);

const currentAttributes = existingWeaponCombatProfiles.flatMap((entry) => entry.attributes);
const selectedAttributes = selectedTitle1BaseWeaponCandidates.flatMap((entry) => entry.attributes);
const title1AttributeCoverage = new Set([...currentAttributes, ...selectedAttributes]);
const title1StageIdsWithSelectedCandidate = new Set(
  baseWeaponCandidates
    .filter((candidate) => selectedCandidateIds.has(candidate.id))
    .flatMap((candidate) => candidate.stageAffinityIds),
);
const stagesWithAnySelectedOrCurrentRecommendation = series1StageCampaignContentEntries.filter((stage) =>
  stage.combat.recommendedBaseWeaponIds.some((id) => currentBaseWeaponIds.includes(id) || selectedCandidateIds.has(id)),
).map((stage) => stage.stageId);

export const baseWeaponSelectionSummary = {
  currentBaseFamilyCount: currentBaseWeaponIds.length,
  candidateCount: baseWeaponSelectionEntries.length,
  selectedCandidateCount: selectedTitle1BaseWeaponCandidates.length,
  heldCandidateCount: heldBaseWeaponCandidates.length,
  plannedTitle1BaseFamilyCount: currentBaseWeaponIds.length + selectedTitle1BaseWeaponCandidates.length,
  selectedAttackArchetypeCount: new Set(selectedTitle1BaseWeaponCandidates.map((entry) => entry.archetype)).size,
  heldAttackArchetypeCount: new Set(heldBaseWeaponCandidates.map((entry) => entry.archetype)).size,
  title1AttributeCoverage: COMBAT_ATTRIBUTES.filter((attribute) => attribute === 'NEUTRAL' || title1AttributeCoverage.has(attribute)),
  candidateStarterWeaponCount: candidateStartingWeaponIds.size,
  candidateStartersSelectedCount: [...candidateStartingWeaponIds].filter((id) => selectedCandidateIds.has(id)).length,
  candidateStartersHeldCount: [...candidateStartingWeaponIds].filter((id) => heldCandidateIds.has(id)).length,
  title1StageAffinityCoverageCount: title1StageIdsWithSelectedCandidate.size,
  stagesWithAnySelectedOrCurrentRecommendation,
  runtimeAutoPromotionAllowed: false,
  heldWeaponsDeleted: false,
} as const;
