export type CharacterReferenceEvidenceState =
  | 'golden_identity_registered'
  | 'core5_master_unregistered'
  | 'reference_generation_required';

export type CharacterReferenceAction =
  | 'keep_and_revalidate'
  | 'review_existing_master_then_register_or_regenerate'
  | 'generate_reference_then_review';

export type CharacterReferenceQueueEntry = {
  characterId: string;
  displayName: string;
  productionGroup: 'core5' | 'circle10' | 'shadow5';
  priority: 'P0' | 'P1' | 'P2';
  evidenceState: CharacterReferenceEvidenceState;
  action: CharacterReferenceAction;
  hardVisualAnchor: boolean;
  plusSizeHardLock: boolean;
  existingMasterPath: string | null;
  expectedReferenceOutput: string;
  reason: string;
  downstreamRule: string;
};

const expectedReferenceOutput = (characterId: string) =>
  `public/assets/prototypes/characters/${characterId}/references/${characterId}-reference-v1.png`;

const core5MasterPath = (characterId: string) =>
  `assets/reference/character-master/core5/${characterId}-character-master-v1.png`;

/**
 * Current20 reference-first production queue.
 *
 * This is an art-production queue, not a playable-roster or runtime-approval list.
 * Reserve Ren stays in Current21 silhouette canon but is intentionally excluded
 * from Current20 Asset Factory production until scope is explicitly expanded.
 */
export const characterReferenceProductionQueue: CharacterReferenceQueueEntry[] = [
  {
    characterId: 'hana', displayName: 'ハナ', productionGroup: 'circle10', priority: 'P0',
    evidenceState: 'reference_generation_required', action: 'generate_reference_then_review',
    hardVisualAnchor: true, plusSizeHardLock: true, existingMasterPath: null,
    expectedReferenceOutput: expectedReferenceOutput('hana'),
    reason: 'ぽっちゃり女性 / 年長女性のhard visual factを持つが、専用character referenceがまだproduction evidenceとして存在しない。細身・若返りdefaultへ崩れるriskが高い。',
    downstreamRule: 'reference reviewでbody / age / shawl / object placementが通るまで、新しいsprite/cutin量産の基準にしない。',
  },
  {
    characterId: 'kage1', displayName: 'カナメ', productionGroup: 'shadow5', priority: 'P0',
    evidenceState: 'reference_generation_required', action: 'generate_reference_then_review',
    hardVisualAnchor: true, plusSizeHardLock: true, existingMasterPath: null,
    expectedReferenceOutput: expectedReferenceOutput('kage1'),
    reason: 'ぽっちゃり男性 / 若い成人のhard visual factを持つが、専用character referenceがまだproduction evidenceとして存在しない。細身化・bodybuilder化riskが高い。',
    downstreamRule: 'reference reviewでplus-size body / intercept posture / arm-band / gray wolf identityが通るまで、新しいsprite/cutin量産の基準にしない。',
  },
  {
    characterId: 'tomori', displayName: 'トモリ', productionGroup: 'core5', priority: 'P1',
    evidenceState: 'core5_master_unregistered', action: 'review_existing_master_then_register_or_regenerate',
    hardVisualAnchor: true, plusSizeHardLock: false, existingMasterPath: core5MasterPath('tomori'),
    expectedReferenceOutput: expectedReferenceOutput('tomori'),
    reason: 'Core5 master fileは存在するが、Golden Reference Registryのidentity approvalへ未登録。work goggles / repair posture hard anchorとの整合を先に審査する。',
    downstreamRule: '既存masterがCurrent silhouette contractを満たすなら再生成せずreference registryへ昇格候補。満たさない場合だけ再生成する。',
  },
  {
    characterId: 'gen', displayName: 'ゲン', productionGroup: 'circle10', priority: 'P1',
    evidenceState: 'reference_generation_required', action: 'generate_reference_then_review',
    hardVisualAnchor: true, plusSizeHardLock: false, existingMasterPath: null,
    expectedReferenceOutput: expectedReferenceOutput('gen'),
    reason: '年長男性hard anchor。若返り・wizard化を防ぐため、年齢/外套/低い重心のreference evidenceが必要。',
    downstreamRule: 'reference review後に後続assetのage/posture authorityとして使う。',
  },
  {
    characterId: 'shiro', displayName: 'シロ', productionGroup: 'circle10', priority: 'P1',
    evidenceState: 'reference_generation_required', action: 'generate_reference_then_review',
    hardVisualAnchor: true, plusSizeHardLock: false, existingMasterPath: null,
    expectedReferenceOutput: expectedReferenceOutput('shiro'),
    reason: '丸メガネ / page posture hard anchor。Reserve Renとの顔・姿勢copy事故を防ぐreference evidenceが必要。',
    downstreamRule: 'reference reviewでpage posture / glasses / white bookmark silhouetteを固定してから後続assetへ使う。',
  },
  {
    characterId: 'asa', displayName: 'アサ', productionGroup: 'core5', priority: 'P1',
    evidenceState: 'core5_master_unregistered', action: 'review_existing_master_then_register_or_regenerate',
    hardVisualAnchor: false, plusSizeHardLock: false, existingMasterPath: core5MasterPath('asa'),
    expectedReferenceOutput: expectedReferenceOutput('asa'),
    reason: 'Core5 master fileは存在する。最新silhouette matrixの名札 / compact action / half-step postureと整合するか再審査する。',
    downstreamRule: '既存masterが通るなら再生成しない。reference approvalとfinal/runtime approvalは分離する。',
  },
  {
    characterId: 'nagi', displayName: 'ナギ', productionGroup: 'core5', priority: 'P1',
    evidenceState: 'core5_master_unregistered', action: 'review_existing_master_then_register_or_regenerate',
    hardVisualAnchor: false, plusSizeHardLock: false, existingMasterPath: core5MasterPath('nagi'),
    expectedReferenceOutput: expectedReferenceOutput('nagi'),
    reason: 'Core5 master fileは存在する。月箱 / inward posture / quiet vertical silhouetteのCurrent matrixで再審査する。',
    downstreamRule: '既存masterが通るなら再生成しない。reference approvalとfinal/runtime approvalは分離する。',
  },
  {
    characterId: 'michiru', displayName: 'ミチル', productionGroup: 'core5', priority: 'P1',
    evidenceState: 'core5_master_unregistered', action: 'review_existing_master_then_register_or_regenerate',
    hardVisualAnchor: false, plusSizeHardLock: false, existingMasterPath: core5MasterPath('michiru'),
    expectedReferenceOutput: expectedReferenceOutput('michiru'),
    reason: 'Core5 master fileは存在する。diagonal map / walking leg / route-reader silhouetteのCurrent matrixで再審査する。',
    downstreamRule: '既存masterが通るなら再生成しない。reference approvalとfinal/runtime approvalは分離する。',
  },
  {
    characterId: 'yui', displayName: 'ユイ', productionGroup: 'core5', priority: 'P1',
    evidenceState: 'golden_identity_registered', action: 'keep_and_revalidate',
    hardVisualAnchor: false, plusSizeHardLock: false, existingMasterPath: core5MasterPath('yui'),
    expectedReferenceOutput: expectedReferenceOutput('yui'),
    reason: 'Golden Reference Registryでidentity referenceが明示承認済み。新matrixとの回帰確認だけ行い、安易に再生成しない。',
    downstreamRule: 'approvedForReferenceのみ。approvedForRuntime / approvedAsFinalへ自動昇格しない。',
  },
  ...[
    ['sen','セン','circle10'],
    ['ritsu','リツ','circle10'],
    ['koyori','コヨリ','circle10'],
    ['yubi','ユウビ','circle10'],
    ['madoka','マドカ','circle10'],
    ['tobari','トバリ','circle10'],
    ['nemu','ネム','circle10'],
    ['kuroori','クロオリ','shadow5'],
    ['kage2','カスミ','shadow5'],
    ['kage3','トキ','shadow5'],
    ['kage4','ツムギ','shadow5'],
  ].map(([characterId, displayName, productionGroup]) => ({
    characterId,
    displayName,
    productionGroup: productionGroup as 'circle10' | 'shadow5',
    priority: 'P2' as const,
    evidenceState: 'reference_generation_required' as const,
    action: 'generate_reference_then_review' as const,
    hardVisualAnchor: false,
    plusSizeHardLock: false,
    existingMasterPath: null,
    expectedReferenceOutput: expectedReferenceOutput(characterId),
    reason: 'Current20 production character。21/21 silhouette matrixはあるが、専用identity reference evidenceを順次作る。',
    downstreamRule: 'character_referenceを先にreviewし、body/posture/object identityを後続sprite/cutinへ引き継ぐ。',
  })),
];

export const CHARACTER_REFERENCE_PRODUCTION_POLICY = {
  scope: 'Current20 Asset Factory production only',
  expectedCount: 20,
  reserveExcluded: ['ren'],
  p0Ids: ['hana', 'kage1'],
  goldenIdentityRegisteredIds: ['yui'],
  core5MasterReviewIds: ['asa', 'nagi', 'michiru', 'tomori'],
  referenceFirst: true,
  noAutomaticRuntimePromotion: true,
  rule: 'Existing masters are reviewed before regeneration. Missing high-risk hard anchors are generated first. Reference approval never implies final/runtime approval.',
} as const;
