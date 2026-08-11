export const SAKUMEI_CANDIDATE_IDENTITY = {
  formalName: '朔盟',
  reading: 'さくめい',
  englishWorkingLabel: 'Sakumei / Pact of the New Moon',
  status: 'USER_APPROVED_DIRECTION_CONTENT_CANDIDATE',
  earlyObserverLabel: '夜綴りの八影',
  earlyObserverShortLabel: '八影',
  taxonomy: 'REVEALED_ANTAGONIST_PACT_CANDIDATE',
  creed: '迷いが人を傷つける。なら、世界から迷いをなくせばいい。',
  protagonistCounterThesis: '傷つく可能性があっても、本人が選び直せる余白を残す。',
  sharedSymbol: '欠円',
  sharedUniformRequired: false,
  commonSpeciesRequired: false,
  commonCreatorRequired: false,
  absoluteLeaderFrozen: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type SakumeiCandidateMember = {
  enemyId: string;
  callName: string;
  fixation: string;
  fear: string;
  violation: string;
  symbolPlacementCandidate: string;
  runtimeAutoPromotionAllowed: false;
};

export const sakumeiCandidateMembers: readonly SakumeiCandidateMember[] = [
  {
    enemyId: 'boss_name_without_owner',
    callName: 'ナシロ',
    fixation: '名前は一つでなければならない',
    fear: '誤った名前が本人より長く残ること',
    violation: '本人より先に正しい名前を固定する',
    symbolPlacementCandidate: '名札の縁 / 空欄を囲む欠円',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'boss_closed_morning_box',
    callName: 'アサトジ',
    fixation: '失うくらいなら閉じればいい',
    fear: '一度開けたことで大切なものを失うこと',
    violation: '保護を永久拘束へ変える',
    symbolPlacementCandidate: '箱の留め具 / 鍵穴周辺の欠円',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'boss_night_without_route',
    callName: 'ミチグレ',
    fixation: '間違う道なら消せばいい',
    fear: '自分の示した道で誰かが迷うこと',
    violation: '選択肢を消し最後には帰路まで奪う',
    symbolPlacementCandidate: '地図線 / 背面route markの欠円',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_black_origami',
    callName: 'オリネ',
    fixation: '危険な意味は隠せばいい',
    fear: '開示した意味が誰かを傷つけること',
    violation: '本人が開く権利まで折り畳む',
    symbolPlacementCandidate: '折り紙の折り目が作る欠円',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_blank_card',
    callName: 'ハクマ',
    fixation: '誤解されるくらいなら意味を消せばいい',
    fear: '間違った説明が記憶を上書きすること',
    violation: '説明と一緒に本人の言葉まで消す',
    symbolPlacementCandidate: '空白カード枠の欠円',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_repair_seam',
    callName: 'ツグリ',
    fixation: '壊れているなら直せばいい',
    fear: '壊れた状態を放置すること',
    violation: '本人が望む前に傷や失敗まで修理する',
    symbolPlacementCandidate: '継ぎ目 / 縫合金具の欠円',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_dream_wave',
    callName: 'ユラネ',
    fixation: '苦しい現実なら眠らせればいい',
    fear: '苦痛を見続けさせること',
    violation: '安らぎを与え戻る理由まで弱くする',
    symbolPlacementCandidate: '夢 / 水面の波紋に現れる欠円',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_nameplate',
    callName: 'ペタ',
    fixation: '間違いなら正しい札を貼ればいい',
    fear: '間違いを認めて剥がすこと',
    violation: '反省せず新しい正解で上書きする',
    symbolPlacementCandidate: '重ね札の隙間に見える欠円',
    runtimeAutoPromotionAllowed: false,
  },
] as const;

export const sakumeiCandidateSummary = {
  memberCount: sakumeiCandidateMembers.length,
  uniqueEnemyIdCount: new Set(sakumeiCandidateMembers.map((entry) => entry.enemyId)).size,
  uniqueCallNameCount: new Set(sakumeiCandidateMembers.map((entry) => entry.callName)).size,
  preservesExistingEnemyIds: true,
  preservesYatsukageAsEarlyObserverLabel: true,
  pairMissionUsesExistingTwentyEightPairAsset: true,
  revealedIdentityHumanReviewRequired: true,
  runtimeAutoPromotionAllowed: false,
} as const;
