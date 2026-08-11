import {
  combatItemEffectCandidates,
  type CombatItemEffectCandidate,
} from './combatItemEffectSource.ts';
import { title1UnlockLearningProgressionEntries } from './title1UnlockLearningProgressionSource.ts';

export type CombatItemAccessLane = 'LEVEL_UP_POOL' | 'FIELD_DROP' | 'RARE_SUPPORT';

export type CombatItemPlacementSeed = {
  itemId: string;
  stageNo: number;
  accessLane: CombatItemAccessLane;
  learningPurpose: string;
  antiOverloadRule: string;
  mobileReadabilityHook: string;
};

export type Title1CombatItemPlacement = CombatItemPlacementSeed & {
  itemName: string;
  itemKind: CombatItemEffectCandidate['kind'];
  stageId: string;
  stageName: string;
  candidate: CombatItemEffectCandidate;
  selectionStatus: 'TITLE1_SELECTED';
  runtimeStatus: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

const placementSeeds: readonly CombatItemPlacementSeed[] = [
  {
    itemId: 'wind_knot', stageNo: 2, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'WINDとDISORIENTEDを覚えた直後に、移動し続けること自体をBuild条件へ変える最初の非火力Itemとして見せる。',
    antiOverloadRule: 'TAILWINDの数値や全移動補正を一覧表示せず、「走ると締まる」の一文だけで導入する。',
    mobileReadabilityHook: '腰元の小さな結び目が一度だけ締まり、足元へ短い風線を一本出す。',
  },
  {
    itemId: 'amber_lamp_glass', stageNo: 4, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'LIGHTをdamage色だけでなく、ECLIPSEDへの防御と視認支援へ使えることをStage4の観察学習へ接続する。',
    antiOverloadRule: 'ILLUMINATEDと防御bonusを同時に長文解説せず、照らした直後だけ守りが生まれることをResultで一行表示する。',
    mobileReadabilityHook: '飴色の縁取りだけを短く灯し、画面全体を明るくしたりwhite flashを使わない。',
  },
  {
    itemId: 'small_star_needle', stageNo: 4, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'beacon習得と同時に、STARを近距離万能criticalではなく遠距離照準のBuild軸として定着させる。',
    antiOverloadRule: '遠距離hit継続条件だけを見せ、critical率や距離閾値の細かいframe/数値説明は後段へ送る。',
    mobileReadabilityHook: '遠い対象へpaper-goldの一点と細い針線だけを出し、星粒を大量散布しない。',
  },
  {
    itemId: 'tool_magnet', stageNo: 6, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'METALをdamage/armor breakだけでなく、設置物やreturning toolを維持するREPAIR系Buildへ分岐させる。',
    antiOverloadRule: 'projectile数や直接damageは増えないことを明示し、工具Buildの万能補助にしない。',
    mobileReadabilityHook: '戻る工具へ小さな磁力弧を一回だけ表示し、常時sparkや大きな磁場円を出さない。',
  },
  {
    itemId: 'repair_tape_roll', stageNo: 7, accessLane: 'FIELD_DROP',
    learningPurpose: 'Stage6で覚えたEXPOSEDへの即時回答を、LevelUp選択ではなく戦場で拾う一回性判断として初めて分離する。',
    antiOverloadRule: '複数Debuff一括解除にはせず、EXPOSED一段と短いREPAIRだけに限定する。',
    mobileReadabilityHook: '小さなテープ片が一周だけ巻かれ、解除対象iconを一つだけ点滅させる。',
  },
  {
    itemId: 'stone_sole', stageNo: 8, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'ROOTED導入時に、速度を上げる以外の回答としてforced movement軽減と踏ん張りを提示する。',
    antiOverloadRule: 'ROOTED完全無効や移動速度bonusを付けず、位置取りを残す防御Itemとして教える。',
    mobileReadabilityHook: '着地時の小さな石粉ringだけでFORTIFYを示し、地面を常時ひび割れさせない。',
  },
  {
    itemId: 'charred_wick', stageNo: 10, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'FIREをBURN延長へ使いながら、Stage10で理解したCHILL/FREEZEへWARMTHという防御回答も持たせる。',
    antiOverloadRule: '瞬間damageは増やさず、攻撃と防御の二役を一つの長い説明文へ詰め込まない。',
    mobileReadabilityHook: '焦げた灯芯の先に小火を一点だけ灯し、炎trailや大きい赤filterは禁止する。',
  },
  {
    itemId: 'pressed_seed', stageNo: 10, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'regrowth習得と同時に、ROOTED敵撃破を小回復へ変えるBLOOM/WATERの持続Buildを紹介する。',
    antiOverloadRule: '回復chanceと上限を持たせ、Boss単体戦でも必須になる常時回復Itemにはしない。',
    mobileReadabilityHook: '撃破地点へ乾いた種袋から一粒だけ淡い芽光を出し、生花の大爆発を避ける。',
  },
  {
    itemId: 'dew_handkerchief', stageNo: 11, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'arc_chain解禁時にSOAKをReaction起点として扱い、同時にBURN durationを短くするcounterplayを学ばせる。',
    antiOverloadRule: 'THUNDERを使わないBuildでは火力貢献が低いtradeoffを残し、Water万能Itemにしない。',
    mobileReadabilityHook: '布の端に一滴だけ露が走り、濡れ表現をscreen tintではなく対象周辺へ限定する。',
  },
  {
    itemId: 'lost_bell_charm', stageNo: 11, accessLane: 'RARE_SUPPORT',
    learningPurpose: 'DROWSYとDISORIENTEDへの低頻度救済を、通常Passiveとは別のRare Support laneとして初めて見せる。',
    antiOverloadRule: '一定時間に一度・一つだけ軽減し、連続Statusや方向判断を完全自動化しない。',
    mobileReadabilityHook: '鈴が一度だけ揺れ、帰る方向へ細い音輪を一つ出す。常時compass arrowは禁止する。',
  },
  {
    itemId: 'wool_page_scarf', stageNo: 12, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'FREEZEを既に経験した後に、低HP時だけCHILL/FREEZE耐性が上がる条件付き防御Buildを追加する。',
    antiOverloadRule: '高HPではほぼ働かない条件を残し、常時FORTIFYと凍結無効を同時提供しない。',
    mobileReadabilityHook: '低HP時だけ襟巻きの紙繊維が少し温色になり、HP bar周辺を覆わない。',
  },
  {
    itemId: 'warm_tea_flask', stageNo: 12, accessLane: 'FIELD_DROP',
    learningPurpose: 'CHILL解除をfield pickupの即時判断へ置き、FREEZEそのものは即解除できない境界を体験で理解させる。',
    antiOverloadRule: '回復量を主目的にせず、状態対策用pickupとして役割を一つに絞る。',
    mobileReadabilityHook: '湯気を小さな二本線に限定し、回復時の緑flashや大きな飲食animationを使わない。',
  },
  {
    itemId: 'blank_patch', stageNo: 13, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'ERASED導入時にBLANKを万能消去ではなく、広いDebuff durationを少し抑える余白として学ばせる。',
    antiOverloadRule: 'hard control無効化と属性damage補正を持たせず、困った時の保険枠という位置づけに留める。',
    mobileReadabilityHook: '白い当て布の四隅だけを淡く縫い、画面を白く抜いたり文字を消す演出をしない。',
  },
  {
    itemId: 'copper_clip', stageNo: 14, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'metal_overload解禁と同時に、CONDUCTIVE対象への最初のTHUNDER hitを強くする準備型Itemとして接続する。',
    antiOverloadRule: 'chain上限そのものは増やさず、THUNDER連打だけが最適解にならないよう最初のhit条件を守る。',
    mobileReadabilityHook: '留め具の接点だけに短いamber-white枝を一回出し、常時帯電表現を避ける。',
  },
  {
    itemId: 'dream_page_corner', stageNo: 15, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'DREAM/SLEEP導入時に、DROWSYを消すのではなくpenalty軽減と解除後FLOWへ変えるDream系防御を見せる。',
    antiOverloadRule: '平常時の恩恵を小さくし、睡眠完全無効や常時cooldown短縮として使えないようにする。',
    mobileReadabilityHook: '折れた頁角が二重像から一枚へ戻る短いmotionだけで解除後FLOWを示す。',
  },
  {
    itemId: 'old_name_tag', stageNo: 15, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'lucid_recall解禁時に、MARKED最大stackを増やさず「記憶が切れるまでの猶予」を伸ばすMEMORY支援を提示する。',
    antiOverloadRule: '瞬間burstやstack上限を増やさず、長く覚えていることだけを価値にする。',
    mobileReadabilityHook: '擦れた名札の輪郭にgraphite dotを一つ残し、名前文字そのものは描画しない。',
  },
  {
    itemId: 'black_fold_cloth', stageNo: 16, accessLane: 'LEVEL_UP_POOL',
    learningPurpose: 'DARK導入時にILLUMINATEDへの耐性と最初のhit強化を組み合わせ、隠す/間を取るBuildへ誘導する。',
    antiOverloadRule: '連打では伸びない条件を維持し、DARKの欠点を消す常時damage Itemにはしない。',
    mobileReadabilityHook: '黒い包み布を足元へ一度畳み、HUD暗転や黒いfull-screen veilを使わない。',
  },
  {
    itemId: 'dawn_ticket_stub', stageNo: 17, accessLane: 'RARE_SUPPORT',
    learningPurpose: 'ECLIPSED/ERASEDを理解した後に、run中一度だけ強い夜蝕を軽減するRare Supportとして終盤の保険を提示する。',
    antiOverloadRule: '一回性を守り、通常火力・全Debuff解除・Happy End条件には接続しない。',
    mobileReadabilityHook: '朝側半券の端だけが一度暖色に変わり、全画面dawn演出はStage clearまで温存する。',
  },
];

const itemById = new Map<string, CombatItemEffectCandidate>(
  combatItemEffectCandidates.map((item) => [item.id, item]),
);
const learningStageByNo = new Map(title1UnlockLearningProgressionEntries.map((entry) => [entry.stageNo, entry]));

function expectedLane(kind: CombatItemEffectCandidate['kind']): CombatItemAccessLane {
  if (kind === 'FIELD_ITEM') return 'FIELD_DROP';
  if (kind === 'RARE_SUPPORT') return 'RARE_SUPPORT';
  return 'LEVEL_UP_POOL';
}

export const title1CombatItemPlacements: readonly Title1CombatItemPlacement[] = placementSeeds.map((seed) => {
  const candidate = itemById.get(seed.itemId);
  if (!candidate) throw new Error(`unknown Combat Item candidate in Title1 placement: ${seed.itemId}`);
  const stage = learningStageByNo.get(seed.stageNo);
  if (!stage) throw new Error(`unknown Title1 learning stage for Combat Item placement: ${seed.stageNo}`);
  if (seed.accessLane !== expectedLane(candidate.kind)) {
    throw new Error(`Combat Item ${seed.itemId} uses ${seed.accessLane} but ${candidate.kind} requires ${expectedLane(candidate.kind)}`);
  }
  return {
    ...seed,
    itemName: candidate.name,
    itemKind: candidate.kind,
    stageId: stage.stageId,
    stageName: stage.stageName,
    candidate,
    selectionStatus: 'TITLE1_SELECTED',
    runtimeStatus: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  };
});

const placementsByStage = new Map<number, number>();
for (const placement of title1CombatItemPlacements) {
  placementsByStage.set(placement.stageNo, (placementsByStage.get(placement.stageNo) ?? 0) + 1);
}

export const title1CombatItemSelectionSummary = {
  candidateAuthorityCount: combatItemEffectCandidates.length,
  selectedCount: title1CombatItemPlacements.length,
  passiveCount: title1CombatItemPlacements.filter((entry) => entry.itemKind === 'PASSIVE').length,
  fieldDropCount: title1CombatItemPlacements.filter((entry) => entry.itemKind === 'FIELD_ITEM').length,
  rareSupportCount: title1CombatItemPlacements.filter((entry) => entry.itemKind === 'RARE_SUPPORT').length,
  stageCountWithPlacements: placementsByStage.size,
  maxPlacementsOnSingleStage: Math.max(...placementsByStage.values()),
  latestPlacementStage: Math.max(...title1CombatItemPlacements.map((entry) => entry.stageNo)),
  unplacedCandidateIds: combatItemEffectCandidates
    .filter((candidate) => !title1CombatItemPlacements.some((placement) => placement.itemId === candidate.id))
    .map((candidate) => candidate.id),
  runtimeAutoPromotionAllowed: false,
  title1PlacementIsRuntimeInventory: false,
} as const;
