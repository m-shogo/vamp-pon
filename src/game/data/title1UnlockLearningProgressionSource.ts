import {
  COMBAT_ATTRIBUTES,
  attributeReactions,
  statusDefinitions,
  type CombatAttribute,
  type StatusKind,
} from './combatAffinitySource.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';
import {
  selectedTitle1BaseWeaponCandidates,
} from './baseWeaponSelectionSource.ts';

export type UnlockLearningPhase = 'FOUNDATION' | 'EXPANSION' | 'COUNTERPLAY' | 'SHADOW_MASTERY' | 'DAWN_MASTERY';

export type Title1UnlockLearningSeed = {
  stageId: string;
  phase: UnlockLearningPhase;
  introducedAttributes: readonly CombatAttribute[];
  introducedStatuses: readonly StatusKind[];
  introducedReactionIds: readonly string[];
  candidateWeaponRevealIds: readonly string[];
  resultLesson: string;
  nextRunSuggestion: string;
  failureHint: string;
  overloadGuard: string;
};

const seeds: readonly Title1UnlockLearningSeed[] = [
  {
    stageId: 'forgotten_street', phase: 'FOUNDATION',
    introducedAttributes: ['MEMORY', 'LIGHT'], introducedStatuses: ['MARKED', 'ECLIPSED'], introducedReactionIds: [], candidateWeaponRevealIds: [],
    resultLesson: 'まず「属性でdamageが少し変わる」「Statusは敵を完全停止させるためだけではない」「MARKEDは次の組み合わせへ渡せる」の3点だけを見せる。Reaction名の暗記は要求しない。',
    nextRunSuggestion: '次はMEMORY以外の武器を一本拾い、ユイのHero Anchorで異属性を混ぜる。正解武器を指定しない。',
    failureHint: 'ECLIPSEDで困った場合は、画面が暗いせいではなく回復/認識支援が落ちていることだけを一行で示す。',
    overloadGuard: '14属性表・12Reaction表・16Status一覧を初回Resultへ出さない。NEUTRALは「相性なしの基準」として常時利用可能だがtutorial項目に数えない。',
  },
  {
    stageId: 'name_tag_alley', phase: 'FOUNDATION',
    introducedAttributes: ['WIND'], introducedStatuses: ['DISORIENTED'], introducedReactionIds: [], candidateWeaponRevealIds: ['bellows_fan'],
    resultLesson: 'WINDは火力色ではなくpush/route/追尾崩しにも使えると体験させる。MARKEDを「同じ敵だけ殴る命令」にしない。',
    nextRunSuggestion: '送り風の扇Candidateを次のbuild候補として提示し、移動が遅いCharacterでもroute controlで解けることを示す。',
    failureHint: '追尾に捕まった場合は「速いCharacterへ変更」だけでなく、push/追尾崩し/Status短縮の三方向を提示する。',
    overloadGuard: 'Weapon Candidateは取得済みCurrent扱いにせず、将来のBuild access候補としてだけ記録する。',
  },
  {
    stageId: 'moon_box_library', phase: 'FOUNDATION',
    introducedAttributes: ['ICE', 'BLANK'], introducedStatuses: ['CHILL', 'SEALED'], introducedReactionIds: ['rewrite'], candidateWeaponRevealIds: [],
    resultLesson: '初めて具体Reaction「書き直し」を教える。BLANKは消去属性ではなくMARKEDを別効果へ変換できること、ICEは完全停止よりCHILLで時間を作ることを優先する。',
    nextRunSuggestion: 'Night Pencil + BLANK系、またはMoon Bookmark中心のcontrolのどちらか一方を次runで試す。二つ同時習得を強制しない。',
    failureHint: 'SEALEDは武器使用不能ではなく特殊行動の回転低下。cleanseかsafe-zone再配置で回答できると示す。',
    overloadGuard: 'ここではWater+Iceの凍結Reactionはまだ教えない。未紹介属性をrecipe暗記へ混ぜない。',
  },
  {
    stageId: 'return_map_crossing', phase: 'FOUNDATION',
    introducedAttributes: ['STAR'], introducedStatuses: ['ILLUMINATED'], introducedReactionIds: ['beacon'], candidateWeaponRevealIds: ['star_map_pin'],
    resultLesson: 'STAR+LIGHTの灯星標を遠距離target/追尾補助の最初の明快な二属性成功例にする。属性相性とReactionは別レイヤーだと短く説明する。',
    nextRunSuggestion: 'Star Map Pin Candidateか既存Stardust系で遠距離priority targetを一体だけ先に処理するbuildを試す。',
    failureHint: 'DISORIENTEDは操作反転ではない。追尾精度/route判断を助けるWeaponやItemへ切り替える。',
    overloadGuard: 'LIGHT+STARを万能初心者セットにしない。Stage4で分かりやすいだけで、全Stage正解とは表示しない。',
  },
  {
    stageId: 'repair_lamp_workshop', phase: 'EXPANSION',
    introducedAttributes: ['FIRE', 'METAL'], introducedStatuses: ['BURN'], introducedReactionIds: ['ember_spread'], candidateWeaponRevealIds: ['wick_needle'],
    resultLesson: 'FIREは瞬間火力だけでなくDoT/継火、METALはBreak/repair/工具へ分ける。火送りでWINDを前Stageから再利用させ、新属性を既知知識へ接続する。',
    nextRunSuggestion: 'Wick Needle Candidateのline seamか、既存LIGHT/FIREでBURNを作り、WINDを一本混ぜる。',
    failureHint: '火が抑えられる状況ではFIREを捨てるのでなく、METAL工具/設置/REPAIRへ比重を移す。',
    overloadGuard: 'FIRE+ICEの温度割れはまだ非表示。新規FIREを同時に複数recipeへ分岐させない。',
  },
  {
    stageId: 'chalk_classroom', phase: 'EXPANSION',
    introducedAttributes: ['EARTH'], introducedStatuses: ['EXPOSED'], introducedReactionIds: ['foundation_break'], candidateWeaponRevealIds: ['boundary_chalk'],
    resultLesson: 'EARTH+METALの基礎割りで「弱点倍率」と「Break/EXPOSED」は別の攻略軸だと教える。laneを一本だけ置き換える判断もここで導入。',
    nextRunSuggestion: 'Boundary Chalk CandidateかEARTH/METAL構成で、敵を倒す前に進路を一本作るbuildを試す。',
    failureHint: '重い敵へdamageが通らない時は属性変更だけでなくBreak/EXPOSEDを先に作る回答を示す。',
    overloadGuard: 'permanent stat upgradeの説明を挟まず、Run内Build accessの違いに集中する。',
  },
  {
    stageId: 'half_candy_arcade', phase: 'EXPANSION',
    introducedAttributes: ['BLOOM'], introducedStatuses: [], introducedReactionIds: [], candidateWeaponRevealIds: ['ember_matchcase'],
    resultLesson: 'BLOOMを即「回復属性」と決めず、trap/ROOTED/supportへ広がる属性として紹介。群れ処理では単体damageよりstatus distributionが有効なことを見せる。',
    nextRunSuggestion: 'Ember Matchcase Candidateで薄いBURNを複数へ配るか、BLOOM武器で群れの位置を整える。',
    failureHint: '一体を追い過ぎた場合はspread/chain/trapのどれかを一本だけ足す提案を出す。',
    overloadGuard: 'BLOOM+WATERの芽吹きはWater紹介前なのでrecipe名を先出ししない。',
  },
  {
    stageId: 'paper_cord_playground', phase: 'EXPANSION',
    introducedAttributes: [], introducedStatuses: ['ROOTED'], introducedReactionIds: [], candidateWeaponRevealIds: ['pressed_flower_cards'],
    resultLesson: 'ROOTEDは攻撃まで奪う永久拘束ではないことを体験で固定。support/trapが火力武器と同じBuild枠を取る価値を示す。',
    nextRunSuggestion: 'Pressed Flower Cards Candidateで敵を止め、Character本人の得意武器を主火力として残す二役buildを試す。',
    failureHint: 'ROOTEDを受けた側はStatus resistance Item、敵へROOTEDを使う側は逃走路確保という攻守二つの見方を示す。',
    overloadGuard: '召喚物/補助灯の細かい成長値をtutorialへ出さず、置く場所と消える時だけを教える。',
  },
  {
    stageId: 'old_compass_station', phase: 'EXPANSION',
    introducedAttributes: [], introducedStatuses: [], introducedReactionIds: [], candidateWeaponRevealIds: ['pavement_hammer', 'return_compass_needle'],
    resultLesson: '新属性を増やさず、既知EARTH/STARを「足場を作る」「遠くへ出して戻す」のattack shape差として復習する休息Stageにする。',
    nextRunSuggestion: 'Pavement Hammer Candidateで近距離Break、Return Compass Needle Candidateで遠距離returnのどちらかを試す。',
    failureHint: '移動が崩れる場合は速度だけ上げず、knockback耐性/safe point/return routeを使う回答を示す。',
    overloadGuard: '毎Stage新属性を教えるリズムをやめ、既知概念を別attack shapeで再利用する。',
  },
  {
    stageId: 'pressed_flower_archive', phase: 'COUNTERPLAY',
    introducedAttributes: ['WATER'], introducedStatuses: ['SOAK', 'FREEZE'], introducedReactionIds: ['regrowth', 'frost_bind'], candidateWeaponRevealIds: ['rain_thread'],
    resultLesson: 'WATERを単独damage属性でなく、BLOOMの芽吹きとICEの凍結縛りへ分岐する「既知属性を再接続する新属性」として導入する。FREEZEは雑魚のみ短停止、Bossはslowへ。',
    nextRunSuggestion: 'Rain Thread CandidateでSOAKを作り、BLOOMかICEのどちらか一方を二本目に選ぶ。',
    failureHint: 'ROOTED pressureへはWaterを積めば自動解決ではない。Status resistance/route controlも同格回答として出す。',
    overloadGuard: '同Stageで二Reactionを出す代わり、どちらもWater起点の二択として一画面に収める。',
  },
  {
    stageId: 'unposted_post_office', phase: 'COUNTERPLAY',
    introducedAttributes: ['THUNDER'], introducedStatuses: ['SHOCK', 'CONDUCTIVE', 'DROWSY'], introducedReactionIds: ['arc_chain'], candidateWeaponRevealIds: ['copper_tuning_fork'],
    resultLesson: '前Stageで覚えたSOAKへTHUNDERを重ね、水雷連鎖を教える。THUNDER=機械特効ではなくCONDUCTIVE/chainの準備型として理解させる。',
    nextRunSuggestion: 'Copper Tuning Fork Candidate + Water source、またはWIND/LIGHTで時間差攻撃そのものを避ける二つの回答を提示する。',
    failureHint: 'DROWSYで遅れた場合、入力遅延ではなく敵tempoに追いつけていないことを示し、FLOW/TAILWIND/耐性へ案内する。',
    overloadGuard: 'THUNDER導入時にMetal Overloadまで同時解説せず、まずSOAKとの一つのReactionに固定する。',
  },
  {
    stageId: 'paper_plane_window', phase: 'COUNTERPLAY',
    introducedAttributes: [], introducedStatuses: [], introducedReactionIds: [], candidateWeaponRevealIds: ['pocket_mirror'],
    resultLesson: '新しい属性語彙を休み、LIGHT/STARをreflect/priority/観察へ変形して「同じ属性でもattack shapeで役割が変わる」を教える。',
    nextRunSuggestion: 'Pocket Mirror Candidateでprojectileだけをcounterし、contact pressure用に別Weaponを一本残す。',
    failureHint: '反射できない攻撃へMirrorを使い続けた場合、contact/lane/ground pressureは別回答が必要と示す。',
    overloadGuard: 'counter windowのフレーム数等はResultへ出さず、何がreflect可能かだけをvisual cueで学ばせる。',
  },
  {
    stageId: 'white_bookmark_library', phase: 'COUNTERPLAY',
    introducedAttributes: [], introducedStatuses: ['ERASED'], introducedReactionIds: [], candidateWeaponRevealIds: ['white_eraser'],
    resultLesson: 'ERASEDはBuild消滅ではなく一部蓄積を薄める状態。BLANK utilityは敵Buff/自Debuffを全部消す万能cleanseではないと教える。',
    nextRunSuggestion: 'White Eraser Candidateを低damage utility枠として試し、主火力を別Weaponへ任せる。',
    failureHint: '長stackが崩れた時は同じstackを積み直す以外に、短cycle ReactionへBuildを切替える回答を示す。',
    overloadGuard: 'Stage3で覚えたrewriteを復習するが、新Reaction名は増やさない。',
  },
  {
    stageId: 'ticket_gate_station', phase: 'COUNTERPLAY',
    introducedAttributes: [], introducedStatuses: [], introducedReactionIds: ['metal_overload'], candidateWeaponRevealIds: [],
    resultLesson: 'Stage11で保留したMETAL+THUNDERの過負荷をここで解禁し、導電をstunではなくBreakへ使う第二用途を教える。',
    nextRunSuggestion: 'Copper Tuning Fork + METAL、またはEARTH+METALの既知基礎割りを比較して、同じ硬い敵へ二つの回答を試す。',
    failureHint: '境界pressureへTHUNDER火力だけで押せない時はBreakかlane crossing controlへ戻る。',
    overloadGuard: '新属性なしでReaction一つだけ追加し、midgameの知識を統合するStageにする。',
  },
  {
    stageId: 'dream_waterway', phase: 'SHADOW_MASTERY',
    introducedAttributes: ['DREAM'], introducedStatuses: ['SLEEP'], introducedReactionIds: ['lucid_recall'], candidateWeaponRevealIds: ['dream_alarm', 'sleep_ribbon'],
    resultLesson: 'DREAMを睡眠永久拘束ではなくtempo/記憶との重なりとして導入。DREAM+MEMORYの明晰想起で序盤MARKED知識を再利用する。',
    nextRunSuggestion: 'Dream Alarm Candidateの点的delayかSleep Ribbon Candidateのspiral controlを一方選び、MEMORYを補助に混ぜる。',
    failureHint: 'SLEEPがBossへ効きにくい時もbuildを捨てず、短いaction delayへ変換されていることを明示する。',
    overloadGuard: 'DARKは次Stageまで伏せ、DREAM単体とMEMORY連携を先に理解させる。',
  },
  {
    stageId: 'black_origami_roof', phase: 'SHADOW_MASTERY',
    introducedAttributes: ['DARK'], introducedStatuses: [], introducedReactionIds: ['eclipse_break', 'nightmare'], candidateWeaponRevealIds: ['black_folding_fan'],
    resultLesson: '最後の基礎属性DARKを「悪」ではなくveil/tracking frictionとして導入。LIGHT+DARKが明暗破りで協力し、DARK+DREAMが悪夢へ分岐することで善悪二分を崩す。',
    nextRunSuggestion: 'Black Folding Fan Candidate + LIGHTで明暗破り、またはDREAMで悪夢。クロオリ本人でもStage frictionをItem/Fusionで越えられると示す。',
    failureHint: 'DARK suppressedを「クロオリ出禁」と表示しない。Item counter、LIGHT/DARK Fusion、WIND routeの代替を並列提示する。',
    overloadGuard: 'ここで14基礎属性が出揃うが、全相性表を強制表示しない。発見済み属性だけの図鑑ページを任意で開ける。',
  },
  {
    stageId: 'erased_name_wall', phase: 'SHADOW_MASTERY',
    introducedAttributes: [], introducedStatuses: [], introducedReactionIds: [], candidateWeaponRevealIds: [],
    resultLesson: '新規語彙を増やさずMEMORY/BLANK/ERASEDを思想と攻略の両面で再検証する。残す/消すのどちらかを正解にしない。',
    nextRunSuggestion: 'rewriteを使うbuildと、ERASEDをItemで耐えて純damageへ寄せるbuildを比較する。',
    failureHint: '長期Buffが崩れるならcleanseだけでなく短cycle buildへ切替える「run途中の方向転換」を勧める。',
    overloadGuard: 'Shadow episodeで新Systemを大量解禁せず、既知Systemの意味が変わること自体を報酬にする。',
  },
  {
    stageId: 'ruler_rooftop', phase: 'SHADOW_MASTERY',
    introducedAttributes: [], introducedStatuses: [], introducedReactionIds: ['thermal_crack'], candidateWeaponRevealIds: [],
    resultLesson: '最後の初期Reaction「温度割れ」を解禁。FIREとICEが対立属性でも組み合わせる価値があり、相性表とReaction表が別物だと完成させる。',
    nextRunSuggestion: 'FIRE+ICEでCHILLを解除してEXPOSEDへ変えるか、STAR/METAL precisionで直接Breakする二系統を試す。',
    failureHint: 'Reactionを増やし過ぎたbuildには「狙うReactionを2つまで」程度のnext-run suggestionを出し、全Pair暗記を要求しない。',
    overloadGuard: '12初期Reactionがここで出揃う。未発見recipeのシルエットを並べて作業回収を煽らない。',
  },
  {
    stageId: 'blank_card_room', phase: 'DAWN_MASTERY',
    introducedAttributes: [], introducedStatuses: [], introducedReactionIds: [], candidateWeaponRevealIds: ['repair_thread_spool'],
    resultLesson: 'Unlockの量を増やさず、Build候補を保留する選択を教える。空白slotはランダム罰ではなく「次回候補を残す」comfortへ接続する。',
    nextRunSuggestion: 'Repair Thread Spool CandidateでROOTEDを長くするのでなく、stitchが切れる時のREPAIR/BLANK utilityを試す。',
    failureHint: '選択肢が多過ぎる場合はreroll/保留/候補絞り込みcomfortを提示し、raw damage購入へ誘導しない。',
    overloadGuard: 'Awakening/黒耀化の細かい全Character一覧を開かず、今回使ったCharacterの候補だけを任意表示する。',
  },
  {
    stageId: 'dawn_return_square', phase: 'DAWN_MASTERY',
    introducedAttributes: [], introducedStatuses: [], introducedReactionIds: [], candidateWeaponRevealIds: [],
    resultLesson: '最終Stageでは新しい基礎ルールを出さない。Stage1-19で学んだ属性相性・Status counter・Reaction・Weapon shape・Item救済から自分の2Reaction前後を組む総合試験にする。',
    nextRunSuggestion: 'Clear後は未使用Character/別Weapon shape/夜明け星図Challengeを提案し、Title2を次の強制導線にしない。',
    failureHint: '失敗時は「属性が間違い」ではなく、最も圧を受けたStatus/Enemy pair/routeの一つだけを振り返り、次runの具体変更を一つ提示する。',
    overloadGuard: 'Happy End条件に全Attribute/Reaction/Record回収を要求しない。未読Night Record、未取得Candidate、Challenge残りがあってもTitle1を完結できる。',
  },
] as const;

const stageById = new Map(series1StageCampaignContentEntries.map((stage) => [stage.stageId, stage]));
const reactionById = new Map<string, (typeof attributeReactions)[number]>(
  attributeReactions.map((reaction) => [reaction.id, reaction]),
);
const selectedWeaponIds = new Set(selectedTitle1BaseWeaponCandidates.map((weapon) => weapon.weaponId));

export const title1UnlockLearningProgressionEntries = seeds.map((seed, index) => {
  const stage = stageById.get(seed.stageId);
  if (!stage) throw new Error(`unknown Series1 stage in unlock progression: ${seed.stageId}`);
  for (const reactionId of seed.introducedReactionIds) {
    if (!reactionById.has(reactionId)) throw new Error(`unknown Reaction in unlock progression: ${reactionId}`);
  }
  for (const weaponId of seed.candidateWeaponRevealIds) {
    if (!selectedWeaponIds.has(weaponId)) throw new Error(`unlock progression may reveal Selected Title1 candidate only: ${weaponId}`);
  }
  return {
    stageNo: index + 1,
    stageId: seed.stageId,
    stageName: stage.stageName,
    phase: seed.phase,
    introducedAttributes: seed.introducedAttributes,
    introducedStatuses: seed.introducedStatuses,
    introducedReactionIds: seed.introducedReactionIds,
    candidateWeaponRevealIds: seed.candidateWeaponRevealIds,
    campaignUnlock: stage.progression.unlock,
    resultLesson: seed.resultLesson,
    nextRunSuggestion: seed.nextRunSuggestion,
    failureHint: seed.failureHint,
    overloadGuard: seed.overloadGuard,
    readingRequiredForGameplayPower: false,
    currencyRequiredForKnowledgeUnlock: false,
    candidateRevealMeansRuntimeOwned: false,
    authority: 'CONTENT_SOURCE_ONLY' as const,
    runtimeAutoPromotionAllowed: false as const,
  };
});

const introducedAttributeOrder = title1UnlockLearningProgressionEntries.flatMap((entry) => entry.introducedAttributes);
const introducedStatusOrder = title1UnlockLearningProgressionEntries.flatMap((entry) => entry.introducedStatuses);
const introducedReactionOrder = title1UnlockLearningProgressionEntries.flatMap((entry) => entry.introducedReactionIds);
const revealedCandidateWeaponIds = title1UnlockLearningProgressionEntries.flatMap((entry) => entry.candidateWeaponRevealIds);

export const title1UnlockLearningProgressionSummary = {
  stageCount: title1UnlockLearningProgressionEntries.length,
  neutralAvailableFromStart: true,
  neutralRequiresTutorial: false,
  introducedAttributeOrder,
  introducedAttributeCount: new Set(introducedAttributeOrder).size,
  allBaseAttributes: COMBAT_ATTRIBUTES.filter((attribute) => attribute !== 'NEUTRAL'),
  allBaseAttributesIntroducedByStage: Math.max(
    ...COMBAT_ATTRIBUTES
      .filter((attribute) => attribute !== 'NEUTRAL')
      .map((attribute) => title1UnlockLearningProgressionEntries.find((entry) => entry.introducedAttributes.includes(attribute))?.stageNo ?? 999),
  ),
  introducedStatusCount: new Set(introducedStatusOrder).size,
  availableStatusCount: Object.keys(statusDefinitions).length,
  introducedReactionCount: new Set(introducedReactionOrder).size,
  availableReactionCount: attributeReactions.length,
  allInitialReactionsIntroducedByStage: Math.max(
    ...attributeReactions.map((reaction) => title1UnlockLearningProgressionEntries.find((entry) => entry.introducedReactionIds.includes(reaction.id))?.stageNo ?? 999),
  ),
  revealedCandidateWeaponCount: new Set(revealedCandidateWeaponIds).size,
  selectedCandidateWeaponCount: selectedTitle1BaseWeaponCandidates.length,
  firstStageAttributeCount: title1UnlockLearningProgressionEntries[0]?.introducedAttributes.length ?? 0,
  firstFourStageReactionCount: new Set(title1UnlockLearningProgressionEntries.slice(0, 4).flatMap((entry) => entry.introducedReactionIds)).size,
  stagesWithNoNewAttribute: title1UnlockLearningProgressionEntries.filter((entry) => entry.introducedAttributes.length === 0).length,
  stagesWithNoNewReaction: title1UnlockLearningProgressionEntries.filter((entry) => entry.introducedReactionIds.length === 0).length,
  runtimeAutoPromotionAllowed: false,
  futureCastPromotionAllowed: false,
} as const;
