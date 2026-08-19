import { characterDefinitions } from './characterDatabase.ts';
import { enemyProductionEntries } from './enemyProductionDatabase.ts';
import { itemAssetProductionEntries } from './itemAssetProductionDatabase.ts';
import { SAKUYAZA_CURRENT_IDENTITY, sakumeiCandidateMembers } from './sakumeiCandidateSource.ts';
import { stageProductionEntries } from './stageProductionDatabase.ts';
import { toumonSigils } from './toumonSimpleSigilCanon.ts';

export type VisualPreGameSourceMasterRow = {
  assetId: string;
  familyId:
    | 'character-state-transformation-master'
    | 'enemy-reference-master'
    | 'item-object-design-master-candidate'
    | 'location-environment-setting-master'
    | 'toumon-sigil-vector-master';
  subjectId: string;
  displayName: string;
  artifactType: 'EDITABLE_COMPARISON_BOARD' | 'IMAGE_SETTING_MASTER' | 'OBJECT_LINEAGE_CANDIDATE' | 'ENVIRONMENT_SETTING_MASTER' | 'VECTOR_SVG_MASTER';
  recordType: 'PLANNED_MASTER' | 'LINEAGE_CANDIDATE';
  sourcePath: string;
  sourceOrdinal: number;
  productionStatus: string;
  generationAllowed: false;
  finalApprovalGranted: false;
  runtimeApprovalGranted: false;
  usageTargets: readonly string[];
  metadata: Readonly<Record<string, unknown>>;
};

const sakuyazaEnemyIds = new Set(sakumeiCandidateMembers.map((entry) => entry.enemyId));

export function buildCharacterStateMasterRows(): VisualPreGameSourceMasterRow[] {
  return characterDefinitions.map((character) => ({
    assetId: `char-${character.id}-state-transformation-master-v1`,
    familyId: 'character-state-transformation-master',
    subjectId: character.id,
    displayName: `${character.name} Normal / Kokuyou / Akatsuki State Comparison Master`,
    artifactType: 'EDITABLE_COMPARISON_BOARD',
    recordType: 'PLANNED_MASTER',
    sourcePath: 'src/game/data/characterDatabase.ts',
    sourceOrdinal: character.no,
    productionStatus: 'BLOCKED_BASE_CHARACTER_MASTER_AND_STATE_VISUAL_AUTHORING',
    generationAllowed: false,
    finalApprovalGranted: false,
    runtimeApprovalGranted: false,
    usageTargets: ['setting-book', 'character-state-reference', 'gameplay-derivative-parent-after-approval'],
    metadata: {
      characterGroup: character.group,
      characterStatus: character.status,
      normalIdentityMustRemainSame: true,
      kokuyouLabel: character.kokuyou.label,
      kokuyouSubtitle: character.kokuyou.subtitle,
      akatsukiName: character.combat.akatsukiBiraki,
      stateDoesNotCreateNewCharacterIdentity: true,
    },
  }));
}

export function buildEnemyReferenceMasterRows(): VisualPreGameSourceMasterRow[] {
  return enemyProductionEntries.map((enemy) => {
    const isSakuyazaMember = sakuyazaEnemyIds.has(enemy.id);
    return {
      assetId: `enemy-${enemy.id}-reference-master-v1`,
      familyId: 'enemy-reference-master',
      subjectId: enemy.id,
      displayName: isSakuyazaMember
        ? `${SAKUYAZA_CURRENT_IDENTITY.formalName} / ${enemy.name} Enemy Reference Master`
        : `${enemy.name} Enemy Reference Master`,
      artifactType: 'IMAGE_SETTING_MASTER',
      recordType: 'PLANNED_MASTER',
      sourcePath: 'src/game/data/enemyProductionDatabase.ts',
      sourceOrdinal: enemy.no,
      productionStatus: 'BLOCKED_REFERENCE_MASTER_AUTHORING_AND_REVIEW',
      generationAllowed: false,
      finalApprovalGranted: false,
      runtimeApprovalGranted: false,
      usageTargets: ['setting-book', 'enemy-catalog', 'gameplay-sprite-attack-icon-parent-after-approval'],
      metadata: {
        rank: enemy.rank,
        family: enemy.family,
        silhouette: enemy.silhouette,
        palette: enemy.palette,
        attackCue: enemy.attackCue,
        sakuyazaMember: isSakuyazaMember,
        currentFormalGroupName: isSakuyazaMember ? SAKUYAZA_CURRENT_IDENTITY.formalName : null,
        legacyObserverLabelCreatesSeparateMaster: false,
        countedAsAdditionalSakuyazaMaster: false,
      },
    } satisfies VisualPreGameSourceMasterRow;
  });
}

export function buildItemObjectLineageCandidateRows(): VisualPreGameSourceMasterRow[] {
  return itemAssetProductionEntries.map((item, index) => ({
    assetId: `item-${item.id}-design-master-candidate-v1`,
    familyId: 'item-object-design-master-candidate',
    subjectId: item.id,
    displayName: `${item.name} Object Master Lineage Candidate`,
    artifactType: 'OBJECT_LINEAGE_CANDIDATE',
    recordType: 'LINEAGE_CANDIDATE',
    sourcePath: 'src/game/data/itemAssetProductionDatabase.ts',
    sourceOrdinal: index + 1,
    productionStatus: 'BLOCKED_PHYSICAL_OBJECT_LINEAGE_REVIEW',
    generationAllowed: false,
    finalApprovalGranted: false,
    runtimeApprovalGranted: false,
    usageTargets: ['item-lineage-review', 'future-setting-book-master-after-lineage-resolution'],
    metadata: {
      characterId: item.characterId ?? null,
      itemKind: item.kind,
      role: item.role,
      visualAnchor: item.visualAnchor,
      paletteHint: item.paletteHint,
      rawSourceRowOnly: true,
      sameNameDoesNotProveSamePhysicalObject: true,
      mayCollapseIntoAnotherLineageAfterAuthorityReview: true,
      mayNotParentGameplayBeforeLineageResolution: true,
    },
  }));
}

export function buildLocationEnvironmentMasterRows(): VisualPreGameSourceMasterRow[] {
  return stageProductionEntries.map((stage) => ({
    assetId: `location-${stage.id}-environment-setting-master-v1`,
    familyId: 'location-environment-setting-master',
    subjectId: stage.id,
    displayName: `${stage.name} Environment Setting Master`,
    artifactType: 'ENVIRONMENT_SETTING_MASTER',
    recordType: 'PLANNED_MASTER',
    sourcePath: 'src/game/data/stageProductionDatabase.ts',
    sourceOrdinal: stage.no,
    productionStatus: 'BLOCKED_ENVIRONMENT_MASTER_AUTHORING_AND_STORY_BOUNDARY_REVIEW',
    generationAllowed: false,
    finalApprovalGranted: false,
    runtimeApprovalGranted: false,
    usageTargets: ['setting-book', 'location-guide', 'top-story-reference', 'stage-gameplay-derivative-parent-after-approval'],
    metadata: {
      phase: stage.phase,
      leadCharacterIds: stage.leadCharacterIds,
      backgroundMotifs: stage.backgroundMotifs,
      colorScript: stage.colorScript,
      storySeedIsNotExactSceneCanon: true,
      readableSignageMayNotBeInvented: true,
    },
  }));
}

export function buildToumonVectorMasterRows(): VisualPreGameSourceMasterRow[] {
  return toumonSigils.map((sigil, index) => ({
    assetId: `toumon-${sigil.characterId}-vector-master-v1`,
    familyId: 'toumon-sigil-vector-master',
    subjectId: sigil.characterId,
    displayName: `${sigil.displayName} ${sigil.sigilName} Vector Master`,
    artifactType: 'VECTOR_SVG_MASTER',
    recordType: 'PLANNED_MASTER',
    sourcePath: 'src/game/data/toumonSimpleSigilCanon.ts',
    sourceOrdinal: index + 1,
    productionStatus: 'BLOCKED_VECTOR_AUTHORING_AND_HUMAN_REVIEW',
    generationAllowed: false,
    finalApprovalGranted: false,
    runtimeApprovalGranted: false,
    usageTargets: ['setting-book', 'guide-db', 'top-decoration', 'gameplay-emblem-derivatives', 'merch-reference'],
    metadata: {
      scope: sigil.scope,
      sigilName: sigil.sigilName,
      dominantFamily: sigil.dominantFamily,
      strokeFormula: sigil.strokeFormula,
      primaryGap: sigil.primaryGap,
      dawnChange: sigil.dawnChange,
      kokuyouScar: sigil.kokuyouScar,
      authorityFormat: 'SVG_VECTOR_NOT_RASTER_GENERATION',
    },
  }));
}

export function buildVisualPreGameSourceMasterInventory() {
  const characterStateRows = buildCharacterStateMasterRows();
  const enemyRows = buildEnemyReferenceMasterRows();
  const itemLineageCandidateRows = buildItemObjectLineageCandidateRows();
  const locationRows = buildLocationEnvironmentMasterRows();
  const toumonRows = buildToumonVectorMasterRows();
  const rows = [
    ...characterStateRows,
    ...enemyRows,
    ...itemLineageCandidateRows,
    ...locationRows,
    ...toumonRows,
  ];

  return {
    schemaVersion: 1,
    inventoryId: 'yoruno-shirube-pre-game-source-master-inventory-v1',
    status: 'SOURCE_DERIVED_LIST_ONLY_NO_AUTOMATIC_GENERATION',
    generatedFrom: [
      'src/game/data/characterDatabase.ts',
      'src/game/data/enemyProductionDatabase.ts',
      'src/game/data/itemAssetProductionDatabase.ts',
      'src/game/data/stageProductionDatabase.ts',
      'src/game/data/toumonSimpleSigilCanon.ts',
      'src/game/data/sakumeiCandidateSource.ts',
    ],
    policy: {
      sourceArraysAreAuthoritativeForMembership: true,
      addingOrRemovingSourceRowsAutomaticallyChangesInventory: true,
      imageGenerationAllowed: false,
      rawItemRowsAreLineageCandidatesNotFinalMasterCount: true,
      sakuyazaSubsetIsNotAdditionalToEnemy48: true,
      legacyYatsukageNameMayNotNameCurrentMaster: true,
      currentSeason1AntagonistFormalName: SAKUYAZA_CURRENT_IDENTITY.formalName,
    },
    counts: {
      characterStateRows: characterStateRows.length,
      enemyReferenceRows: enemyRows.length,
      sakuyazaEnemySubsetRows: enemyRows.filter((row) => row.metadata.sakuyazaMember === true).length,
      itemObjectLineageCandidateRows: itemLineageCandidateRows.length,
      locationEnvironmentRows: locationRows.length,
      toumonVectorRows: toumonRows.length,
      totalRows: rows.length,
    },
    rows,
  } as const;
}

export const VISUAL_PRE_GAME_SOURCE_MASTER_INVENTORY = buildVisualPreGameSourceMasterInventory();
