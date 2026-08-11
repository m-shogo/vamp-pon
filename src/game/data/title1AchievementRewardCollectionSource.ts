import { ACHIEVEMENT_DEFS } from './achievements.ts';
import { forgottenStreetNightBoard } from './collectionProgress.ts';
import { collectionSections, type CollectionSectionId } from './collectionSections.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';
import { selectedTitle1WeaponTransformations } from './weaponTransformationSelectionSource.ts';
import { combatItemSelectionEntries } from './combatItemSelectionSource.ts';

export type Title1MilestoneKind = 'NATURAL' | 'TARGETED' | 'MASTERY' | 'SECRET';
export type Title1RewardLane = 'RECORD_ONLY' | 'LIGHT_COIN' | 'TRAVEL_PREP' | 'MEMORY_TEXT' | 'COSMETIC' | 'SOUND';

export type Title1AchievementRewardCollectionSeed = {
  stageId: string;
  milestoneKind: Title1MilestoneKind;
  title: string;
  condition: string;
  rewardLane: Title1RewardLane;
  rewardBudget: 'SMALL' | 'MEDIUM' | 'LARGE' | 'NONE';
  collectionReveal: readonly CollectionSectionId[];
  nextRunPrompt: string;
  antiGrindGuard: string;
};

const seeds: readonly Title1AchievementRewardCollectionSeed[] = [
  { stageId: 'forgotten_street', milestoneKind: 'NATURAL', title: '最初の夜明け', condition: 'Stage1を初めて夜明けする', rewardLane: 'LIGHT_COIN', rewardBudget: 'SMALL', collectionReveal: ['dawn_atlas', 'bestiary', 'lost_item_cards'], nextRunPrompt: '未使用Weaponか未確認の夜明け星図セルを一つだけ勧める。', antiGrindGuard: '既存Stage1実績と25セルのrewardを二重claimさせない。' },
  { stageId: 'name_tag_alley', milestoneKind: 'NATURAL', title: '名前を急がない', condition: 'Stage2を初めて夜明けする', rewardLane: 'RECORD_ONLY', rewardBudget: 'NONE', collectionReveal: ['keeper_records'], nextRunPrompt: '別CharacterかWIND系のroute controlを試す。', antiGrindGuard: '初clearを周回通貨farmへしない。' },
  { stageId: 'moon_box_library', milestoneKind: 'TARGETED', title: '書き直しを覚えた', condition: 'rewriteを一度成立させてStage3を夜明けする', rewardLane: 'MEMORY_TEXT', rewardBudget: 'NONE', collectionReveal: ['word_records'], nextRunPrompt: 'Reactionを増やさず、rewriteを使わない別回答も提示する。', antiGrindGuard: 'Reaction発動回数の大量ノルマを置かない。' },
  { stageId: 'return_map_crossing', milestoneKind: 'NATURAL', title: '帰る印', condition: 'Stage4を初めて夜明けする', rewardLane: 'LIGHT_COIN', rewardBudget: 'SMALL', collectionReveal: ['dawn_atlas'], nextRunPrompt: 'STAR/LIGHT以外の遠距離priority回答を一つ示す。', antiGrindGuard: '特定Weapon所持をclear条件にしない。' },
  { stageId: 'repair_lamp_workshop', milestoneKind: 'TARGETED', title: '直しながら進む', condition: 'BURNかBreakのどちらかを使ってStage5を夜明けする', rewardLane: 'TRAVEL_PREP', rewardBudget: 'SMALL', collectionReveal: ['lost_item_cards'], nextRunPrompt: 'FIRE火力以外の工具/設置回答を勧める。', antiGrindGuard: '両方の条件達成を要求しない。' },
  { stageId: 'chalk_classroom', milestoneKind: 'MASTERY', title: '道を一本つくる', condition: 'EXPOSEDを利用してStage6の硬い敵をほどく', rewardLane: 'LIGHT_COIN', rewardBudget: 'MEDIUM', collectionReveal: ['bestiary'], nextRunPrompt: '次runではBreakなしの属性相性回答も試せる。', antiGrindGuard: '敵撃破数1000等の量ノルマへ変えない。' },
  { stageId: 'half_candy_arcade', milestoneKind: 'NATURAL', title: '群れをほどく', condition: 'Stage7を初めて夜明けする', rewardLane: 'RECORD_ONLY', rewardBudget: 'NONE', collectionReveal: ['dawn_atlas'], nextRunPrompt: 'spread/chain/trapの未使用shapeを一つ示す。', antiGrindGuard: '単体DPSだけを評価軸にしない。' },
  { stageId: 'paper_cord_playground', milestoneKind: 'TARGETED', title: '止めて、逃がす', condition: 'ROOTEDを敵か自分のcounterplayとして一度活用する', rewardLane: 'LIGHT_COIN', rewardBudget: 'SMALL', collectionReveal: ['bestiary'], nextRunPrompt: 'Status耐性Itemかroute controlの別回答を示す。', antiGrindGuard: '拘束時間の長さをスコア化しない。' },
  { stageId: 'old_compass_station', milestoneKind: 'NATURAL', title: '帰路を選ぶ', condition: 'Stage9を初めて夜明けする', rewardLane: 'SOUND', rewardBudget: 'NONE', collectionReveal: ['word_records'], nextRunPrompt: '近距離Breakと遠距離returnを入れ替えて試す。', antiGrindGuard: '新System解禁を詰め込まない休息報酬にする。' },
  { stageId: 'pressed_flower_archive', milestoneKind: 'TARGETED', title: '濡れた記録', condition: 'SOAKからregrowthかfrost_bindのどちらかを成立させる', rewardLane: 'MEMORY_TEXT', rewardBudget: 'NONE', collectionReveal: ['lost_item_cards', 'word_records'], nextRunPrompt: '未使用側のWater Reactionを任意で勧める。', antiGrindGuard: '2Reaction同時達成を要求しない。' },
  { stageId: 'unposted_post_office', milestoneKind: 'TARGETED', title: '届かなかった雷', condition: 'arc_chainを一度成立させるか、別counterでStage11を夜明けする', rewardLane: 'LIGHT_COIN', rewardBudget: 'SMALL', collectionReveal: ['dawn_atlas'], nextRunPrompt: 'THUNDERなしでも攻略可能な回答を残す。', antiGrindGuard: '特定Reactionをmandatoryにしない。' },
  { stageId: 'paper_plane_window', milestoneKind: 'MASTERY', title: '返さない選択', condition: 'projectile pressureをreflectか回避routeで越える', rewardLane: 'COSMETIC', rewardBudget: 'NONE', collectionReveal: ['keeper_records'], nextRunPrompt: 'Mirror以外のcontact/lane対策へ広げる。', antiGrindGuard: '反射回数の累積farmにしない。' },
  { stageId: 'white_bookmark_library', milestoneKind: 'TARGETED', title: '消えても組み直す', condition: 'ERASED後にBuildを立て直してStage13を夜明けする', rewardLane: 'LIGHT_COIN', rewardBudget: 'MEDIUM', collectionReveal: ['dawn_atlas'], nextRunPrompt: 'long-stackとshort-cycleの差を次run候補へ出す。', antiGrindGuard: 'ERASED完全無効化を要求しない。' },
  { stageId: 'ticket_gate_station', milestoneKind: 'TARGETED', title: '過負荷の改札', condition: 'metal_overloadか別Break回答でStage14を夜明けする', rewardLane: 'TRAVEL_PREP', rewardBudget: 'SMALL', collectionReveal: ['bestiary'], nextRunPrompt: 'EARTH/METALの既知回答との比較を勧める。', antiGrindGuard: '一つのReactionを正解として固定しない。' },
  { stageId: 'dream_waterway', milestoneKind: 'NATURAL', title: '夢から持ち帰る', condition: 'Stage15を初めて夜明けする', rewardLane: 'MEMORY_TEXT', rewardBudget: 'NONE', collectionReveal: ['keeper_records', 'word_records'], nextRunPrompt: 'DREAM/MEMORYを使わないtempo回答も残す。', antiGrindGuard: 'SLEEP成功回数を周回条件にしない。' },
  { stageId: 'black_origami_roof', milestoneKind: 'MASTERY', title: '黒を選び直す', condition: 'クロオリを含む任意CharacterでStage16を夜明けする', rewardLane: 'COSMETIC', rewardBudget: 'NONE', collectionReveal: ['keeper_records'], nextRunPrompt: 'DARK/LIGHT協力かItem rescueを勧める。', antiGrindGuard: 'DARK不利をCharacter出禁に変換しない。' },
  { stageId: 'erased_name_wall', milestoneKind: 'SECRET', title: '残すか、消すか', condition: 'Stage17でMEMORY/BLANKのどちらか一方に寄せて夜明けする', rewardLane: 'MEMORY_TEXT', rewardBudget: 'NONE', collectionReveal: ['word_records'], nextRunPrompt: '反対側の思想/buildを次runに提案する。', antiGrindGuard: '両ルート回収をHappy End条件にしない。' },
  { stageId: 'ruler_rooftop', milestoneKind: 'MASTERY', title: '温度の境界', condition: 'thermal_crackを一度成立させるか別precision回答でStage18を夜明けする', rewardLane: 'LIGHT_COIN', rewardBudget: 'MEDIUM', collectionReveal: ['dawn_atlas'], nextRunPrompt: '12Reaction全回収ではなく自分の2Reactionを選ばせる。', antiGrindGuard: 'Reaction図鑑100%を進行gateにしない。' },
  { stageId: 'blank_card_room', milestoneKind: 'NATURAL', title: '選ばない余白', condition: 'Stage19を初めて夜明けする', rewardLane: 'TRAVEL_PREP', rewardBudget: 'SMALL', collectionReveal: ['dawn_atlas'], nextRunPrompt: 'reroll/保留/候補絞り込みのcomfortを一つ試す。', antiGrindGuard: '永久stat購入を最適解として誘導しない。' },
  { stageId: 'dawn_return_square', milestoneKind: 'NATURAL', title: '帰ってきた夜明け', condition: 'Stage20を夜明けしTitle1 Happy Endへ到達する', rewardLane: 'COSMETIC', rewardBudget: 'NONE', collectionReveal: ['dawn_atlas', 'achievements'], nextRunPrompt: '未使用Character・別Weapon shape・任意Challengeを並列提案しTitle2を強制しない。', antiGrindGuard: '全属性・全Reaction・全Record・Challenge100%をclear条件にしない。' },
];

const stageById = new Map<string, (typeof series1StageCampaignContentEntries)[number]>(
  series1StageCampaignContentEntries.map((stage) => [stage.stageId, stage]),
);
const sectionIds = new Set<string>(collectionSections.map((section) => section.id));

export const title1AchievementRewardCollectionEntries = seeds.map((seed, index) => {
  const stage = stageById.get(seed.stageId);
  if (!stage) throw new Error(`unknown Series1 stage in reward collection source: ${seed.stageId}`);
  for (const section of seed.collectionReveal) {
    if (!sectionIds.has(section)) throw new Error(`unknown collection section: ${section}`);
  }
  return {
    stageNo: index + 1,
    stageName: stage.stageName,
    ...seed,
    repeatableCurrencyReward: false,
    readingRequiredForPower: false,
    fullCollectionRequiredForClear: false,
    runtimeStatus: 'CONTENT_SOURCE_ONLY' as const,
    runtimeAutoPromotionAllowed: false as const,
  };
});

export const title1AchievementRewardCollectionSummary = {
  stageCount: title1AchievementRewardCollectionEntries.length,
  legacyRuntimeAchievementCount: ACHIEVEMENT_DEFS.length,
  legacyForgottenStreetBoardCellCount: forgottenStreetNightBoard.cells.length,
  collectionSectionCount: collectionSections.length,
  selectedTransformationCount: selectedTitle1WeaponTransformations.length,
  placedCombatItemCount: combatItemSelectionEntries.length,
  rewardLaneCounts: Object.fromEntries(
    ['RECORD_ONLY', 'LIGHT_COIN', 'TRAVEL_PREP', 'MEMORY_TEXT', 'COSMETIC', 'SOUND'].map((lane) => [
      lane,
      title1AchievementRewardCollectionEntries.filter((entry) => entry.rewardLane === lane).length,
    ]),
  ),
  repeatableCurrencyRewards: 0,
  clearRequiresFullCollection: false,
  readingRequiredForPower: false,
  runtimeAutoPromotionAllowed: false,
} as const;
