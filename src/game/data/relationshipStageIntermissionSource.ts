import { currentGroupInteractionEntries } from './currentGroupInteractionSource.ts';
import type { RelationshipSpeechMoment } from './relationshipSpeechProgressionSource.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';

export type RelationshipStageIntermissionEntry = {
  sceneId: string;
  firstAfterStageId: string;
  firstEligibleMoment: Extract<RelationshipSpeechMoment, 'ALLY' | 'TRUST'>;
  repeatAfterStageId: string;
  repeatEligibleMoment: Extract<RelationshipSpeechMoment, 'TRUST' | 'DEEP_TRUST' | 'DAWN'>;
  firstPurpose: string;
  repeatPurpose: string;
  choiceOrReadRequiredForPower: false;
  requiredForStoryComplete: false;
  scriptCanon: false;
  authority: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

const seeds: readonly Omit<RelationshipStageIntermissionEntry,
  'choiceOrReadRequiredForPower' | 'requiredForStoryComplete' | 'scriptCanon' | 'authority' | 'runtimeAutoPromotionAllowed'
>[] = [
  {
    sceneId: 'lost-button-table',
    firstAfterStageId: 'forgotten_street',
    firstEligibleMoment: 'ALLY',
    repeatAfterStageId: 'name_tag_alley',
    repeatEligibleMoment: 'TRUST',
    firstPurpose: '持ち主不明の物へ全員が違う反射をすることで、Core/Circleの日常距離を早期に作る。',
    repeatPurpose: 'アサとユイが「名前を付ける/拾う」を先回りせず、本人待ちの余白を作れる変化を見せる。',
  },
  {
    sceneId: 'rain-window-four',
    firstAfterStageId: 'moon_box_library',
    firstEligibleMoment: 'ALLY',
    repeatAfterStageId: 'dream_waterway',
    repeatEligibleMoment: 'DEEP_TRUST',
    firstPurpose: 'ナギ/カスミ/マドカ/ネムを静かな同居人として先に見せ、夢やprivacyを事件だけの属性にしない。',
    repeatPurpose: '夢の発言を事実化せず、見たこと/隠すこと/保護することと並列で扱える関係へ変える。',
  },
  {
    sceneId: 'repair-table-four',
    firstAfterStageId: 'repair_lamp_workshop',
    firstEligibleMoment: 'ALLY',
    repeatAfterStageId: 'pressed_flower_archive',
    repeatEligibleMoment: 'TRUST',
    firstPurpose: '直す/傷を残す/分類する/保存するの違いを生活作業で衝突させる。',
    repeatPurpose: 'トモリが最初に工具を取らず、他三人へ「何を残すか」を聞けるようになったことを見せる。',
  },
  {
    sceneId: 'five-different-maps',
    firstAfterStageId: 'return_map_crossing',
    firstEligibleMoment: 'ALLY',
    repeatAfterStageId: 'ruler_rooftop',
    repeatEligibleMoment: 'DEEP_TRUST',
    firstPurpose: '勘/測定/古い記憶/現在観察/差分という五つの読み方を同じ机へ置く。',
    repeatPurpose: '誰も一枚を正解にせず、五枚の差そのものを判断材料として共有できる状態へ進める。',
  },
  {
    sceneId: 'name-privacy-post-office',
    firstAfterStageId: 'name_tag_alley',
    firstEligibleMoment: 'TRUST',
    repeatAfterStageId: 'unposted_post_office',
    repeatEligibleMoment: 'DEEP_TRUST',
    firstPurpose: 'アサ/カスミの思想差へユウビの実務責任を足し、「名前を出す/隠す」の二択を壊す。',
    repeatPurpose: 'sealed address / recipient confirmation / delayed revealを三人が役割分担できる関係へ育てる。',
  },
  {
    sceneId: 'protector-heavy-luggage',
    firstAfterStageId: 'paper_cord_playground',
    firstEligibleMoment: 'ALLY',
    repeatAfterStageId: 'black_origami_roof',
    repeatEligibleMoment: 'DEEP_TRUST',
    firstPurpose: '守る人同士の自己犠牲競争を先にコメディとして見せ、後の戦闘失敗を説教にしない。',
    repeatPurpose: '「次、お前」「それは私」だけで役割を渡せることを日常の荷物運びへ返す。',
  },
  {
    sceneId: 'gate-route-delivery',
    firstAfterStageId: 'unposted_post_office',
    firstEligibleMoment: 'TRUST',
    repeatAfterStageId: 'ticket_gate_station',
    repeatEligibleMoment: 'DEEP_TRUST',
    firstPurpose: '閉じる/開ける/進む/届けるの全てが善意でも衝突することを見せる。',
    repeatPurpose: '帰路の有無を先に確認してから門と配達を決める共通手順が自然に生まれる。',
  },
  {
    sceneId: 'shadow-tea-without-agreement',
    firstAfterStageId: 'black_origami_roof',
    firstEligibleMoment: 'ALLY',
    repeatAfterStageId: 'blank_card_room',
    repeatEligibleMoment: 'DEEP_TRUST',
    firstPurpose: 'Shadow五人を一枚岩の敵陣営にせず、同席しながら意見が一致しない個人として見せる。',
    repeatPurpose: '思想は一致しなくても危険な記録の預け先だけは迷わず分担できるChosen Trustを示す。',
  },
  {
    sceneId: 'classroom-unclassified-rule',
    firstAfterStageId: 'chalk_classroom',
    firstEligibleMoment: 'ALLY',
    repeatAfterStageId: 'white_bookmark_library',
    repeatEligibleMoment: 'DEEP_TRUST',
    firstPurpose: 'セン/シロ/コヨリ/アサの分類・名前・保留の違いを軽い授業で出す。',
    repeatPurpose: '仮説/confidence/未分類/本人の名前を別欄に分ける運用が自然に定着する。',
  },
  {
    sceneId: 'dream-measurement-breakfast',
    firstAfterStageId: 'dream_waterway',
    firstEligibleMoment: 'TRUST',
    repeatAfterStageId: 'dawn_return_square',
    repeatEligibleMoment: 'DAWN',
    firstPurpose: '夢/観察/測定/差分を競わせず、同じ朝食卓で別の記録として扱う。',
    repeatPurpose: 'ED後も誰かが夢を特別扱いせず、ネムを起こさないまま必要な時刻だけ記録する生活へ返す。',
  },
  {
    sceneId: 'repair-old-road',
    firstAfterStageId: 'old_compass_station',
    firstEligibleMoment: 'ALLY',
    repeatAfterStageId: 'blank_card_room',
    repeatEligibleMoment: 'DEEP_TRUST',
    firstPurpose: '古い正解と今の正解を上書き関係にせず、トモリ/ゲン/ミチル/ツムギの役割を分ける。',
    repeatPurpose: '古い矢印を残したまま新しい方向板を隣へ増設し、「更新=消去」にしない。',
  },
  {
    sceneId: 'lantern-after-rain',
    firstAfterStageId: 'pressed_flower_archive',
    firstEligibleMoment: 'TRUST',
    repeatAfterStageId: 'dawn_return_square',
    repeatEligibleMoment: 'DAWN',
    firstPurpose: 'ランタンMysteryへ答えを出さず、開く/直す/閉じる/保存するの違いだけ生活で積む。',
    repeatPurpose: 'ユイが最初にランタンをトモリへ渡せる一方、クロオリの紙は開かず、ハナの古い台紙も残す。',
  },
] as const;

const sceneById = new Map(currentGroupInteractionEntries.map((entry) => [entry.id, entry]));
const stageNoById = new Map(series1StageCampaignContentEntries.map((stage) => [stage.stageId, stage.stageNo]));

export const relationshipStageIntermissionEntries: readonly RelationshipStageIntermissionEntry[] = seeds.map((seed) => {
  if (!sceneById.has(seed.sceneId)) throw new Error(`unknown group interaction scene: ${seed.sceneId}`);
  const firstStageNo = stageNoById.get(seed.firstAfterStageId);
  const repeatStageNo = stageNoById.get(seed.repeatAfterStageId);
  if (!firstStageNo || !repeatStageNo) throw new Error(`unknown intermission Stage for ${seed.sceneId}`);
  if (firstStageNo >= repeatStageNo) throw new Error(`repeat intermission must occur later: ${seed.sceneId}`);
  return {
    ...seed,
    choiceOrReadRequiredForPower: false,
    requiredForStoryComplete: false,
    scriptCanon: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  };
});

export const relationshipStageIntermissionSummary = {
  sceneLaneCount: relationshipStageIntermissionEntries.length,
  placementCount: relationshipStageIntermissionEntries.length * 2,
  currentGroupSceneCount: currentGroupInteractionEntries.length,
  allGroupScenesPlaced: relationshipStageIntermissionEntries.length === currentGroupInteractionEntries.length,
  dawnRepeatCount: relationshipStageIntermissionEntries.filter((entry) => entry.repeatEligibleMoment === 'DAWN').length,
  choiceOrReadRequiredForPower: false,
  requiredForStoryComplete: false,
  scriptCanon: false,
  runtimeAutoPromotionAllowed: false,
} as const;
