import { CHARACTER_AUTHOR_DB_COVERAGE, CHARACTER_AUTHOR_DB_IDENTITIES } from './characterAuthorDbCoverageManifest.ts';
import { characterAppearanceGenerationContracts } from './characterAppearanceGenerationContracts.ts';
import {
  CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY,
  CHARACTER_HANDEDNESS_EQUIPMENT_RULES,
  characterHandednessEquipmentByAuthorId,
} from './characterHandednessEquipmentRegistry.ts';
import { CHARACTER_CROSS_ERA_ECHO_CHAINS } from './characterCrossEraEchoReservoir.ts';
import { CHARACTER_ERA_FORESHADOW_DIALOGUE } from './characterEraForeshadowDialogueReservoir.ts';
import { CHARACTER_RELATIONSHIP_GRAPH_EDGES } from './characterRelationshipGraphReadModel.ts';
import { CHARACTER_REALITY_ROOTS } from './characterRealityRootRegistry.ts';
import { characterReferenceProductionQueue } from './characterReferenceProductionQueue.ts';
import { characterSilhouetteAnchorById } from './characterSilhouetteCanon.ts';
import { CHARACTER_THEME_COLOR_CANDIDATES } from './characterThemeColorReservoir.ts';
import { assetGenerationContracts } from './assetGenerationPolicy.ts';
import { current21SilhouetteMatrixById } from './current21SilhouetteMatrix.ts';
import { CONSTELLATION_STORY_CLUE_CANDIDATES } from './constellationStoryClueReservoir.ts';
import { namedObjectVisualSharedSourceEntries } from './namedObjectVisualSharedSource.ts';
import { starBeastVisualSharedSourceEntries } from './starBeastVisualSharedSource.ts';
import { STORY_WORLD_MASTER_SOURCE } from './storyWorldMasterSource.ts';
import { yatsukageCallNames } from './yatsukageIdentitySource.ts';
import core5ReferenceManifest from '../../../data/character-assets/core5-character-master-assets.json' with { type: 'json' };
import yuiFullBodyMasterV2Qa from '../../../data/character-assets/reviews/yui-full-body-master-v2.qa.json' with { type: 'json' };
import yuiFullBodyMasterV2Rejects from '../../../data/character-assets/reviews/yui-full-body-master-v2.rejects.json' with { type: 'json' };
import yuiSheet01Qa from '../../../data/character-assets/reviews/yui-character-design-sheet-01-v1.qa.json' with { type: 'json' };
import yuiSheet01Rejects from '../../../data/character-assets/reviews/yui-character-design-sheet-01-v1.rejects.json' with { type: 'json' };
// This inventory projection is imported only by Node-based export/check scripts.
// @ts-expect-error The runtime Web tsconfig intentionally excludes Node ambient types.
import { createHash } from 'node:crypto';
// @ts-expect-error The runtime Web tsconfig intentionally excludes Node ambient types.
import { readFileSync } from 'node:fs';

export const VISUAL_ASSET_INVENTORY_PATHS = {
  coverage: 'data/character-assets/manifests/visual-asset-coverage.v1.json',
  registry: 'data/character-assets/manifests/visual-asset-master-registry.v1.json',
  batches: 'data/character-assets/manifests/visual-generation-batches.v1.json',
  characterPromptPackets: 'data/character-assets/manifests/visual-character-prompt-packets.v1.json',
  imageProductionList: 'data/character-assets/manifests/visual-image-production-list.v1.json',
} as const;

export const VISUAL_SOURCE_CATALOG = {
  'character-author-db': 'src/game/data/characterAuthorDbCoverageManifest.ts',
  'character-appearance-contracts': 'src/game/data/characterAppearanceGenerationContracts.ts',
  'character-handedness-equipment': 'src/game/data/characterHandednessEquipmentRegistry.ts',
  'character-living-visual-roster': 'data/visual/character-living-visual-roster-v1.json',
  'visual-design-production-master': 'data/visual/visual-design-production-master-v1.json',
  'character-era-registry': 'src/game/data/characterEraForeshadowDialogueReservoir.ts',
  'character-era-fingerprints': 'src/game/data/characterEraFingerprintRegistry.ts',
  'character-era-scene-seeds': 'src/game/data/characterEraSceneSeedRegistry.ts',
  'character-profile-read-model': 'src/game/data/characterProfileBookReadModel.ts',
  'character-relationship-read-model': 'src/game/data/characterRelationshipGraphReadModel.ts',
  'character-ordinary-life': 'src/game/data/characterOrdinaryLifeReservoir.ts',
  'character-behavior-identity': 'src/game/data/characterBehaviorIdentityReservoir.ts',
  'character-lived-artifact': 'src/game/data/characterLivedArtifactReservoir.ts',
  'character-environment-sensory': 'src/game/data/characterEnvironmentSensoryReservoir.ts',
  'character-competence-learning': 'src/game/data/characterCompetenceLearningReservoir.ts',
  'character-communication-habit': 'src/game/data/characterCommunicationHabitReservoir.ts',
  'character-everyday-economy': 'src/game/data/characterEverydayEconomyReservoir.ts',
  'character-leisure-play': 'src/game/data/characterLeisurePlayReservoir.ts',
  'character-humor-teasing': 'src/game/data/characterHumorTeasingReservoir.ts',
  'character-decision-commitment': 'src/game/data/characterDecisionCommitmentReservoir.ts',
  'character-shared-space-etiquette': 'src/game/data/characterSharedSpaceEtiquetteReservoir.ts',
  'character-rest-daily-rhythm': 'src/game/data/characterRestDailyRhythmReservoir.ts',
  'character-memory-remembering': 'src/game/data/characterMemoryRememberingReservoir.ts',
  'character-address-naming-register': 'src/game/data/characterAddressNamingRegisterReservoir.ts',
  'character-voice-prosody': 'src/game/data/characterVoiceProsodyReservoir.ts',
  'character-reality-roots': 'src/game/data/characterRealityRootRegistry.ts',
  'character-theme-color-reservoir': 'src/game/data/characterThemeColorReservoir.ts',
  'character-reference-production-queue': 'src/game/data/characterReferenceProductionQueue.ts',
  'character-silhouette-canon': 'src/game/data/characterSilhouetteCanon.ts',
  'current21-silhouette-matrix': 'src/game/data/current21SilhouetteMatrix.ts',
  'core5-reference-manifest': 'data/character-assets/core5-character-master-assets.json',
  'named-object-visual-source': 'src/game/data/namedObjectVisualSharedSource.ts',
  'star-beast-visual-source': 'src/game/data/starBeastVisualSharedSource.ts',
  'story-world-master': 'src/game/data/storyWorldMasterSource.ts',
  'sakuyaza-member-source': 'src/game/data/yatsukageIdentitySource.ts',
  'asset-generation-policy': 'src/game/data/assetGenerationPolicy.ts',
  'golden-reference-registry': 'src/game/data/goldenReferenceRegistry.ts',
  'generation-lineage-template': 'data/asset-factory/generation-lineage.template.json',
  'cross-era-echo-chains': 'src/game/data/characterCrossEraEchoReservoir.ts',
  'constellation-story-clues': 'src/game/data/constellationStoryClueReservoir.ts',
  'constellation-history-research': 'src/game/data/constellationHistoryResearch.ts',
  'yui-full-body-master-v2-prompt': 'data/character-assets/reviews/yui-full-body-master-v2.prompt.json',
  'yui-full-body-master-v2-qa': 'data/character-assets/reviews/yui-full-body-master-v2.qa.json',
  'yui-full-body-master-v2-rejects': 'data/character-assets/reviews/yui-full-body-master-v2.rejects.json',
  'yui-character-design-master-pack-v1': 'data/character-assets/reviews/yui-character-design-master-pack-v1.json',
  'yui-character-design-sheet-01-v1-qa': 'data/character-assets/reviews/yui-character-design-sheet-01-v1.qa.json',
  'yui-character-design-sheet-01-v1-rejects': 'data/character-assets/reviews/yui-character-design-sheet-01-v1.rejects.json',
} as const;

export const CHARACTER_AUTHOR_DB_VISUAL_DIMENSION_SOURCES = {
  realityRoot: ['character-reality-roots'],
  seasonArchitecture: ['src/game/data/seasonArchitecture.ts'],
  ordinaryLife: ['character-ordinary-life'],
  socialChemistry: ['src/game/data/current21SocialChemistryReservoir.ts', 'src/game/data/future15SocialChemistryReservoir.ts'],
  behaviorIdentity: ['character-behavior-identity'],
  livedArtifact: ['character-lived-artifact'],
  themeColor: ['character-theme-color-reservoir'],
  livingPlace: ['src/game/data/realityRootLivingPlaceReservoir.ts'],
  environmentSensory: ['character-environment-sensory'],
  competenceLearning: ['character-competence-learning'],
  communicationHabit: ['character-communication-habit'],
  everydayEconomy: ['character-everyday-economy'],
  leisurePlay: ['character-leisure-play'],
  humorTeasing: ['character-humor-teasing'],
  decisionCommitment: ['character-decision-commitment'],
  sharedSpaceEtiquette: ['character-shared-space-etiquette'],
  restDailyRhythm: ['character-rest-daily-rhythm'],
  memoryRemembering: ['character-memory-remembering'],
  addressNamingRegister: ['character-address-naming-register'],
  voiceProsody: ['character-voice-prosody'],
  physicalIdentityAuthority: ['character-appearance-contracts'],
  handednessEquipmentContinuity: ['character-handedness-equipment'],
} as const;

export const VISUAL_COVERAGE_REQUIREMENTS = {
  characterMaster: ['masterPack', 'identityTurnaroundSheet', 'faceExpressionActingSheet', 'costumeEquipmentMaterialSheet', 'silhouetteMotionDerivationSheet', 'overviewReadModel'],
  groupMaster: ['groupMasterAsset'],
  starBeastMaster: ['starBeastMasterAsset', 'starBeastSilhouette', 'starBeastIconReady', 'starBeastLorebookReady'],
  objectMaster: ['objectNamedPossession', 'objectLantern', 'objectRepairMark', 'objectLetter', 'objectDiary', 'objectOldStarAtlas', 'objectPlanisphere', 'objectMechanical', 'objectSchoolOrWork', 'objectRecordingOrArchive'],
  lorebook: ['lorebookProfile', 'lorebookRelationship', 'lorebookEra', 'lorebookRealityRoot', 'lorebookForeshadow', 'lorebookConstellation', 'lorebookGlossary', 'lorebookGroup', 'lorebookStarBeast', 'lorebookArtifact'],
  gameplay: ['gameplayIcon', 'gameplayPortrait', 'gameplayEnemy', 'gameplayWeapon', 'gameplaySkill', 'gameplayItem', 'gameplayCardArt', 'gameplayUi', 'gameplayKeyArt'],
} as const;

type SlotState = 'missing' | 'candidate' | 'current' | 'superseded';
type Priority = 'P0_CORE_MAIN' | 'P0_REFERENCE_RISK' | 'P1_MYSTERY' | 'P2_CURRENT' | 'P3_FUTURE_STORY_GROUP';

const CORE5 = new Set(['yui', 'asa', 'nagi', 'michiru', 'tomori']);
const MYSTERY_PRIORITY = new Set(['shiro', 'chloe', 'noa', 'rum', 'kai', 'nao']);
const allSlots = Object.values(VISUAL_COVERAGE_REQUIREMENTS).flat();
const byId = <T extends { id: string }>(entries: readonly T[]) => new Map(entries.map((entry) => [entry.id, entry]));
const byName = <T extends { displayName: string }>(entries: readonly T[]) => new Map(entries.map((entry) => [entry.displayName, entry]));
const appearanceByName = byName(characterAppearanceGenerationContracts);
const eraById = byId(CHARACTER_ERA_FORESHADOW_DIALOGUE);
const rootById = byId(CHARACTER_REALITY_ROOTS);
const themeById = byId(CHARACTER_THEME_COLOR_CANDIDATES);
const objectByOwnerId = new Map(namedObjectVisualSharedSourceEntries.map((entry) => [entry.ownerId, entry]));
const starBeastByCharacterId = new Map(starBeastVisualSharedSourceEntries.map((entry) => [entry.characterId, entry]));
const referenceQueueById = new Map(characterReferenceProductionQueue.map((entry) => [entry.characterId, entry]));
const authorCoverageById = new Map(CHARACTER_AUTHOR_DB_COVERAGE.map((entry) => [entry.authorId, entry]));
const core5ReferenceById = new Map(core5ReferenceManifest.characters.map((entry) => [entry.id, entry]));

const sha256Json = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const authorityClassFor = (sourceId: string) => sourceId.includes('story-world') || sourceId.includes('visual-design-production') || sourceId.includes('living-visual')
  ? 'UPSTREAM_AUTHORITY'
  : sourceId.includes('reservoir') || sourceId.includes('candidate') ? 'AUTHOR_RESERVOIR' : 'STRUCTURAL_SOURCE';
const consumedFieldsFor = (sourceId: string) => sourceId === 'character-appearance-contracts'
  ? ['species', 'ageCoding', 'faceSignatureId', 'faceShape', 'eyeShape', 'eyelid', 'brow', 'mouth', 'cheekOrSurfaceMark', 'hairOrHeadStructure', 'bodyShape', 'clothingConstruction']
  : sourceId === 'character-handedness-equipment'
    ? ['dominantHand', 'equipmentPlacements', 'mirrorPolicy', 'frontViewProjection']
    : sourceId === 'character-author-db' ? ['authorId', 'stableProfileId', 'name', 'rosterLayer'] : ['record-boundary'];
const authoritySnapshots = (sourceIds: string[]) => sourceIds.map((sourceId) => {
  const path = VISUAL_SOURCE_CATALOG[sourceId as keyof typeof VISUAL_SOURCE_CATALOG];
  if (!path) throw new Error(`Unknown visual authority source: ${sourceId}`);
  return {
    sourceId,
    path,
    contentHash: createHash('sha256').update(readFileSync(path)).digest('hex'),
    authorityClass: authorityClassFor(sourceId),
    consumedFields: consumedFieldsFor(sourceId),
  };
});

function queueEntryFor(authorId: string, stableProfileId: string) {
  return referenceQueueById.get(authorId) ?? referenceQueueById.get(stableProfileId);
}

function priorityFor(authorId: string, stableProfileId: string, rosterLayer: 'CURRENT21' | 'FUTURE15'): Priority {
  if (CORE5.has(authorId)) return 'P0_CORE_MAIN';
  const queue = queueEntryFor(authorId, stableProfileId);
  if (queue?.priority === 'P0') return 'P0_REFERENCE_RISK';
  if (MYSTERY_PRIORITY.has(authorId)) return 'P1_MYSTERY';
  return rosterLayer === 'CURRENT21' ? 'P2_CURRENT' : 'P3_FUTURE_STORY_GROUP';
}

function makeStatusBySlot(authorId: string, stableProfileId: string): Record<string, SlotState> {
  const result = Object.fromEntries(allSlots.map((slot) => [slot, 'missing'])) as Record<string, SlotState>;
  const queue = queueEntryFor(authorId, stableProfileId);
  if (queue?.existingMasterPath) result.identityTurnaroundSheet = 'candidate';
  if (objectByOwnerId.has(stableProfileId)) result.objectNamedPossession = 'candidate';
  if (starBeastByCharacterId.has(stableProfileId)) {
    result.starBeastMasterAsset = 'missing';
    result.starBeastSilhouette = 'candidate';
  }
  return result;
}

function builtInAliases() {
  const aliases: Record<string, string> = {};
  for (const identity of CHARACTER_AUTHOR_DB_IDENTITIES) {
    if (identity.stableProfileId !== identity.authorId) aliases[identity.stableProfileId] = identity.authorId;
    const appearance = appearanceByName.get(identity.name);
    if (appearance && appearance.id !== identity.authorId) aliases[appearance.id] = identity.authorId;
  }
  return Object.fromEntries(Object.entries(aliases).sort(([a], [b]) => a.localeCompare(b)));
}

function core5Assets() {
  return CHARACTER_AUTHOR_DB_IDENTITIES.filter((identity) => CORE5.has(identity.authorId)).map((identity) => {
    const queue = queueEntryFor(identity.authorId, identity.stableProfileId);
    if (!queue?.existingMasterPath) throw new Error(`Core5 existing master path missing for ${identity.authorId}`);
    const isYui = identity.authorId === 'yui';
    return {
      id: `char-${identity.authorId}-master-board-v1`,
      subjectId: identity.authorId,
      subjectType: 'character',
      title: `${identity.name} Character Master Board v1`,
      layer: 'master',
      kind: 'character-master-board',
      authorityStatus: 'CURRENT',
      reviewStatus: isYui ? 'approved-candidate' : 'needs-boundary-review',
      current: false,
      derivedFrom: [],
      sourceOfTruth: [
        'character-author-db',
        'character-appearance-contracts',
        'character-era-registry',
        'character-reality-roots',
        'character-theme-color-reservoir',
        'character-reference-production-queue',
        'core5-reference-manifest',
        ...(isYui ? ['golden-reference-registry'] : []),
      ],
      usageTargets: ['generation-reference'],
      tags: ['core5', 'character', 'master-board', 'reference-only', 'not-final', 'not-runtime'],
      files: [{ role: 'primary', path: queue.existingMasterPath }],
      replacementPolicy: { canReplace: true, replaces: null, supersededBy: null },
      approvalBoundary: {
        approvedForReference: isYui,
        approvedAsFinal: false,
        approvedForRuntime: false,
        existingPrototypeSpriteIsSeparateAsset: true,
      },
      notes: isYui
        ? 'Golden identity referenceとして承認済み。final/runtime/currentではなく、最新36人DBとの回帰確認対象。'
        : '既存Master Board。最新Appearance/Era/Reality Root/Theme Colorとの境界審査前で、再生成より先に再利用可否を判定する。',
    };
  });
}

export function buildVisualAssetCoverage() {
  return {
    schemaVersion: 1,
    registryId: 'yoruno-shirube-visual-asset-coverage-v1',
    generatedFrom: 'src/game/data/visualAssetGenerationInventory.ts',
    measurementPolicy: { coverageIsNotQuality: true, percentageForbidden: true, qualityScoreForbidden: true },
    allowedSlotStates: ['missing', 'candidate', 'current', 'superseded'],
    requirements: VISUAL_COVERAGE_REQUIREMENTS,
    authorDbDimensionCatalog: CHARACTER_AUTHOR_DB_VISUAL_DIMENSION_SOURCES,
    characters: CHARACTER_AUTHOR_DB_IDENTITIES.map((identity) => {
      const appearance = appearanceByName.get(identity.name);
      const era = eraById.get(identity.authorId);
      const root = rootById.get(identity.authorId);
      const theme = themeById.get(identity.stableProfileId);
      const queue = queueEntryFor(identity.authorId, identity.stableProfileId);
      const object = objectByOwnerId.get(identity.stableProfileId);
      const starBeast = starBeastByCharacterId.get(identity.stableProfileId);
      const silhouetteMatrix = current21SilhouetteMatrixById.get(identity.stableProfileId);
      const hardSilhouette = characterSilhouetteAnchorById.get(identity.stableProfileId);
      const authorCoverage = authorCoverageById.get(identity.authorId);
      const handednessEquipment = characterHandednessEquipmentByAuthorId.get(identity.authorId);
      if (!appearance || !era || !root || !theme || !authorCoverage || !handednessEquipment) throw new Error(`Incomplete 36-character visual source binding for ${identity.authorId}`);
      return {
        subjectId: identity.authorId,
        stableProfileId: identity.stableProfileId,
        appearanceContractId: appearance.id,
        displayName: identity.name,
        rosterLayer: identity.rosterLayer,
        priority: priorityFor(identity.authorId, identity.stableProfileId, identity.rosterLayer),
        reviewStatus: queue?.existingMasterPath ? 'needs-boundary-review' : 'needs-generation',
        sourceBindings: {
          authorDbDimensions: { coverage: authorCoverage.coverage, sourceStatus: authorCoverage.sourceStatus },
          appearance: { id: appearance.id, species: appearance.species, ageCoding: appearance.ageCoding, faceSignatureId: appearance.faceSignatureId },
          handednessEquipment: {
            id: handednessEquipment.id,
            dominantHand: handednessEquipment.dominantHand,
            equipmentPlacements: handednessEquipment.equipmentPlacements,
            mirrorPolicy: handednessEquipment.mirrorPolicy,
            frontViewProjection: handednessEquipment.frontViewProjection,
          },
          era: { id: era.id, lane: era.lane, status: era.assignmentStatus },
          realityRoot: { id: root.id, root: root.root, status: root.status, rootIsNotBirthplaceOrIncidentArea: true },
          themeColor: { id: theme.id, status: 'AUTHOR_RESERVOIR_NON_CANON', finalApproved: theme.finalApproved },
          referenceProduction: queue
            ? { queueId: queue.characterId, priority: queue.priority, evidenceState: queue.evidenceState, action: queue.action, existingMasterPath: queue.existingMasterPath }
            : { queueId: null, scope: 'OUTSIDE_CURRENT20_REFERENCE_QUEUE', existingMasterPath: null },
          namedObject: object ? { id: object.id, namingStatus: object.namingStatus, geometryAuthority: object.geometryAuthority, generationReady: object.referenceGenerationReady } : null,
          starBeast: starBeast ? { id: starBeast.id, scope: starBeast.scope, artworkState: starBeast.artworkState, generationReady: starBeast.referenceGenerationReady } : null,
          silhouette: silhouetteMatrix
            ? { id: silhouetteMatrix.characterId, matrixStatus: 'CURRENT21_DESIGN_SOURCE', hardAnchor: hardSilhouette?.runtimeMigrationState ?? null }
            : { id: null, matrixStatus: 'NO_MAIN_SILHOUETTE_SOURCE_ON_MAIN', hardAnchor: null },
        },
        statusBySlot: makeStatusBySlot(identity.authorId, identity.stableProfileId),
        notes: identity.rosterLayer === 'FUTURE15'
          ? 'Future15はFuture Story候補グループであり未来時代ラベルではない。Era lane/statusを別に参照する。'
          : 'Current21所属とvisual review/final/runtime承認は別管理。',
      };
    }),
  };
}

function reservedCharacterMasterAssets() {
  return CHARACTER_AUTHOR_DB_IDENTITIES.map((identity) => {
    const appearance = appearanceByName.get(identity.name);
    const era = eraById.get(identity.authorId);
    const root = rootById.get(identity.authorId);
    const queue = queueEntryFor(identity.authorId, identity.stableProfileId);
    if (!appearance || !era || !root) throw new Error(`Character master reservation source missing for ${identity.authorId}`);
    const packId = `char-${identity.authorId}-design-master-pack-v1`;
    const sheetIds = CHARACTER_DESIGN_SOURCE_SHEETS.map((sheet) => `char-${identity.authorId}-${sheet.idSuffix}-v1`);
    const packHash = sha256Json({ assetId: packId, packVersion: 1, sheetIds });
    return {
      id: packId,
      subjectId: identity.authorId,
      subjectType: 'character',
      title: `${identity.name} Character Design Master Pack v1`,
      layer: 'master',
      kind: 'character-design-master-pack',
      authorityStatus: era.assignmentStatus === 'UPSTREAM_CURRENT' ? 'CURRENT' : era.assignmentStatus === 'OPEN_SPECIAL' ? 'OPEN' : identity.rosterLayer === 'FUTURE15' ? 'Future15' : 'CANDIDATE',
      reviewStatus: 'needs-authoring',
      current: false,
      derivedFrom: [],
      sourceOfTruth: [
        'character-author-db',
        'character-appearance-contracts',
        'character-handedness-equipment',
        'character-living-visual-roster',
        'visual-design-production-master',
        'character-era-registry',
        'character-era-fingerprints',
        'character-era-scene-seeds',
        'character-reality-roots',
        'character-theme-color-reservoir',
        ...(current21SilhouetteMatrixById.has(identity.stableProfileId) ? ['current21-silhouette-matrix'] : []),
        ...(characterSilhouetteAnchorById.has(identity.stableProfileId) ? ['character-silhouette-canon'] : []),
      ],
      usageTargets: ['lorebook-derived', 'gameplay-derived'],
      tags: [identity.authorId, 'character', 'design-master-pack', identity.rosterLayer.toLowerCase(), 'reserved-not-generated', 'not-derivative-parent-until-approved'],
      files: [],
      replacementPolicy: { canReplace: true, replaces: null, supersededBy: null },
      masterPack: {
        packId,
        packVersion: 1,
        packHash,
        requiredSheetRoles: CHARACTER_DESIGN_SOURCE_SHEETS.map((sheet) => sheet.role),
        requiredSheetIds: sheetIds,
        overviewReadModelId: `char-${identity.authorId}-design-master-overview-v1`,
        approvalState: 'partial-not-approved',
        allSheetsHumanApproved: false,
        crossSheetConsistencyApproved: false,
        packHumanApproved: false,
        mayParentDerivatives: false,
      },
      lineage: {
        authoritySnapshotsRequired: true,
        promptReferenceOutputHashesRequired: true,
        generatorVersionSeedRequiredWhenAvailable: true,
        automaticQaRequired: true,
        humanDecisionScopeRequired: true,
        rejectLedgerRequired: true,
      },
      promptPacketId: `visual-prompt:${identity.authorId}:character-design-master-pack:v1`,
      generationReadiness: {
        authoritySourcesConnected: true,
        hasAppearanceContract: true,
        hasEraBoundary: true,
        hasRealityRootBoundary: true,
        hasThemeColorCandidate: true,
        hasHandednessEquipmentBoundary: true,
        hasLivingVisualAuthorityBoundary: true,
        hasMainSilhouetteSource: current21SilhouetteMatrixById.has(identity.stableProfileId),
        existingReferenceAction: queue?.action ?? 'none',
        generationBlockedUntilPromptPacket: identity.authorId !== 'yui',
        turnaroundHumanApprovalRequiredBeforeDependentSheets: true,
      },
      notes: identity.rosterLayer === 'FUTURE15'
        ? 'Future15は時代authorityではない。Era statusを別Sourceから読む。mainにSilhouette sourceがない場合は未merge候補を推論で補わない。'
        : '生成前予約。候補4枚、QA、Human reviewなしにcurrent/final/runtimeへ昇格しない。',
    };
  });
}

function yuiRejectedFullBodyAssets() {
  const rejectedFiles = new Set(yuiFullBodyMasterV2Rejects.files);
  return yuiFullBodyMasterV2Qa.candidates.map((candidate) => {
    if (!rejectedFiles.has(candidate.file)) throw new Error(`Yui rejected candidate is missing from reject ledger: ${candidate.id}`);
    return {
      id: candidate.id,
      subjectId: 'yui',
      subjectType: 'character',
      title: `ユイ Full Body Master rejected candidate ${candidate.id}`,
      layer: 'master',
      kind: 'character-full-body-master-rejected-candidate',
      authorityStatus: 'CANDIDATE',
      reviewStatus: 'archived',
      current: false,
      derivedFrom: [],
      sourceOfTruth: [
        'character-author-db',
        'character-appearance-contracts',
        'character-handedness-equipment',
        'character-living-visual-roster',
        'visual-design-production-master',
        'yui-full-body-master-v2-prompt',
        'yui-full-body-master-v2-qa',
        'yui-full-body-master-v2-rejects',
      ],
      usageTargets: ['prompt-learning-only'],
      tags: ['yui', 'character', 'full-body-master', 'rejected', 'archived', 'learning-only', 'not-parent', 'not-final', 'not-runtime'],
      files: [
        { role: 'primary', path: candidate.file, sha256: candidate.sha256 },
        { role: 'prompt-record', path: VISUAL_SOURCE_CATALOG['yui-full-body-master-v2-prompt'] },
        { role: 'qa-record', path: VISUAL_SOURCE_CATALOG['yui-full-body-master-v2-qa'] },
        { role: 'reject-ledger', path: VISUAL_SOURCE_CATALOG['yui-full-body-master-v2-rejects'] },
      ],
      rejection: {
        attemptId: yuiFullBodyMasterV2Rejects.attemptId,
        decision: yuiFullBodyMasterV2Rejects.decision,
        score: candidate.score,
        hardVeto: candidate.hardVeto,
        reasonCodes: yuiFullBodyMasterV2Rejects.reasonCodes,
        selectedCandidateId: null,
        mayBeParent: false,
        mayBeGoldenReference: false,
      },
      approvalBoundary: {
        approvedForReference: false,
        approvedAsFinal: false,
        approvedForRuntime: false,
        storyAuthorityPromoted: false,
      },
      replacementPolicy: { canReplace: false, replaces: null, supersededBy: null },
      notes: '初回4候補の却下学習記録。採用、親、Canon、final、runtime、Golden Referenceへの利用を禁止する。',
    };
  });
}

function yuiRejectedSheet01Assets() {
  const rejectedFiles = new Set(yuiSheet01Rejects.files);
  return yuiSheet01Qa.candidates.map((candidate) => {
    if (!rejectedFiles.has(candidate.file)) throw new Error(`Yui Sheet 01 rejected candidate missing from ledger: ${candidate.id}`);
    return {
      id: candidate.id, subjectId: 'yui', subjectType: 'character', title: `Yui Sheet 01 rejected candidate ${candidate.id}`,
      layer: 'master', kind: 'character-design-source-sheet-rejected-candidate', authorityStatus: 'CANDIDATE', reviewStatus: 'archived', current: false, derivedFrom: [],
      sourceOfTruth: ['character-author-db', 'character-appearance-contracts', 'character-handedness-equipment', 'yui-character-design-master-pack-v1', 'yui-character-design-sheet-01-v1-qa', 'yui-character-design-sheet-01-v1-rejects'],
      usageTargets: ['prompt-learning-only'], tags: ['yui', 'identity-turnaround', 'rejected', 'archived', 'learning-only', 'not-parent', 'not-final', 'not-runtime'],
      files: [{ role: 'primary', path: candidate.file, sha256: candidate.sha256 }, { role: 'qa-record', path: VISUAL_SOURCE_CATALOG['yui-character-design-sheet-01-v1-qa'] }, { role: 'reject-ledger', path: VISUAL_SOURCE_CATALOG['yui-character-design-sheet-01-v1-rejects'] }],
      rejection: { attemptId: yuiSheet01Rejects.attemptId, decision: 'REJECT_ALL', reasonCodes: yuiSheet01Rejects.reasonCodes, selectedCandidateId: null, mayBeParent: false, mayBeGoldenReference: false },
      approvalBoundary: { approvedForReference: false, approvedAsFinal: false, approvedForRuntime: false, storyAuthorityPromoted: false },
      replacementPolicy: { canReplace: false, replaces: null, supersededBy: null },
      notes: 'Sheet 01 attempt 01 hard-veto reject。Human selection対象、Pack evidence、parent、Golden、Story、final、runtimeに使わない。',
    };
  });
}

export function buildVisualAssetRegistry() {
  return {
    schemaVersion: 1,
    registryId: 'yoruno-shirube-visual-asset-master-registry-v1',
    generatedFrom: 'src/game/data/visualAssetGenerationInventory.ts',
    authorityModel: {
      direction: 'SOURCE_OF_TRUTH -> CHARACTER_DESIGN_MASTER_PACK -> OVERVIEW_READ_MODEL | LOREBOOK_DERIVED | GAMEPLAY_DERIVED',
      storyAuthorityMayNotBePromotedByVisualReview: true,
      lorebookMayNotParentGameplay: true,
      candidateMayNotBecomeCurrentWithoutHumanReview: true,
      existingReferenceIsNotFinalOrRuntime: true,
      rejectedAssetMayNotParentOrBecomeReference: true,
      overviewReadModelIsNeverMasterOrGenerationParent: true,
      partialPackMayNotParentDerivatives: true,
      packApprovalMayNotPromoteChildFinalOrRuntime: true,
      approvedSourceSheetIsImmutableReplacementRequiresVersion: true,
    },
    handednessEquipmentRegistry: {
      source: 'character-handedness-equipment',
      rules: CHARACTER_HANDEDNESS_EQUIPMENT_RULES,
      entries: CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY,
    },
    sourceCatalog: VISUAL_SOURCE_CATALOG,
    subjectAliases: builtInAliases(),
    allowedValues: {
      layers: ['master', 'lorebook', 'gameplay'],
      authorityStatuses: ['CANON', 'CURRENT', 'USER_DIRECTION', 'CANDIDATE', 'AUTHOR_RESERVOIR', 'RESEARCH', 'OPEN', 'Future15'],
      reviewStatuses: ['needs-authoring', 'needs-generation', 'generated-unreviewed', 'needs-author-review', 'needs-boundary-review', 'approved-candidate', 'approved-current', 'superseded', 'archived'],
    },
    assets: [...core5Assets(), ...reservedCharacterMasterAssets(), ...yuiRejectedFullBodyAssets(), ...yuiRejectedSheet01Assets()],
  };
}

const standardBatch = (batchNo: number, title: string, layer: 'master' | 'lorebook' | 'gameplay', subjectSource: string[], dependsOn: string[]) => ({
  batchId: `batch-${String(batchNo).padStart(2, '0')}-${title}-v1`,
  title,
  status: 'planned-not-started',
  layer,
  dependsOn,
  subjectSource,
  exactCandidateCountPerAsset: 4,
  authoritySnapshot: ['visual-asset-master-registry-v1', ...subjectSource],
  assetIds: [],
  promptPacketPaths: [],
  referencePaths: [],
  outputRoot: `assets/import-staging/batch-${String(batchNo).padStart(2, '0')}-${title}-v1/`,
  qaRecordPath: `data/character-assets/reviews/batch-${String(batchNo).padStart(2, '0')}-${title}-v1.qa.json`,
  rejectLedgerPath: `data/character-assets/reviews/batch-${String(batchNo).padStart(2, '0')}-${title}-v1.rejects.json`,
  generationAllowed: false,
});

export function buildVisualGenerationBatches() {
  const sakuyazaNames = STORY_WORLD_MASTER_SOURCE.sakuyaza.memberCallNames;
  const identityNames = yatsukageCallNames.map((entry) => entry.callName);
  if (sakuyazaNames.join('|') !== identityNames.join('|')) throw new Error('朔夜座 member sources disagree');
  return {
    schemaVersion: 1,
    registryId: 'yoruno-shirube-visual-generation-batches-v1',
    generatedFrom: 'src/game/data/visualAssetGenerationInventory.ts',
    executionPolicy: {
      automaticExecutionAllowed: false,
      exactCandidateCount: 4,
      oneShotFinalForbidden: true,
      authorityReviewBeforeGeneration: true,
      visualQaBeforeRegistration: true,
      humanReviewRequiredForCurrent: true,
      runtimeDerivationBeforeMasterApprovalForbidden: true,
    },
    groupBindings: {
      sakuyaza: { formalName: STORY_WORLD_MASTER_SOURCE.sakuyaza.formalName, memberCount: sakuyazaNames.length, members: sakuyazaNames, isConstellationArchiveClassification: false },
      gunjoZankyoroku: { formalName: STORY_WORLD_MASTER_SOURCE.gunjoZankyoroku.formalName, taxonomy: STORY_WORLD_MASTER_SOURCE.gunjoZankyoroku.taxonomy, fixedFaction: false },
    },
    batches: [
      standardBatch(1, 'core-main-character-master', 'master', ['character-author-db', 'character-appearance-contracts', 'character-era-registry', 'character-reality-roots', 'character-theme-color-reservoir', 'character-reference-production-queue', 'core5-reference-manifest'], []),
      standardBatch(2, 'sakuyaza-eight-master', 'master', ['story-world-master', 'sakuyaza-member-source'], []),
      standardBatch(3, 'important-mystery-characters', 'master', ['character-author-db', 'character-appearance-contracts', 'character-era-registry'], []),
      standardBatch(4, 'remaining-character-master', 'master', ['character-author-db', 'character-appearance-contracts', 'character-era-registry', 'character-reality-roots', 'character-theme-color-reservoir'], []),
      standardBatch(5, 'star-beast-master', 'master', ['star-beast-visual-source'], ['batch-01-core-main-character-master-v1']),
      standardBatch(6, 'story-artifact-master', 'master', ['named-object-visual-source', 'cross-era-echo-chains'], []),
      standardBatch(7, 'constellation-historical-archive-master', 'master', ['constellation-story-clues', 'constellation-history-research'], []),
      standardBatch(8, 'lorebook-profile-cards', 'lorebook', ['character-author-db', 'character-appearance-contracts'], ['batch-01-core-main-character-master-v1']),
      standardBatch(9, 'era-reality-root-cards', 'lorebook', ['character-era-registry', 'character-reality-roots'], ['batch-01-core-main-character-master-v1']),
      standardBatch(10, 'foreshadow-mystery-cards', 'lorebook', ['cross-era-echo-chains', 'constellation-story-clues'], ['batch-06-story-artifact-master-v1']),
      standardBatch(11, 'gameplay-icons', 'gameplay', ['asset-generation-policy'], ['batch-01-core-main-character-master-v1']),
      standardBatch(12, 'gameplay-portraits-card-art', 'gameplay', ['asset-generation-policy'], ['batch-01-core-main-character-master-v1']),
      standardBatch(13, 'key-art', 'gameplay', ['story-world-master', 'asset-generation-policy'], ['batch-01-core-main-character-master-v1', 'batch-02-sakuyaza-eight-master-v1']),
      standardBatch(14, 'visual-replacement-qa', 'master', ['asset-generation-policy', 'generation-lineage-template'], []),
    ],
  };
}

const CHARACTER_DESIGN_SOURCE_SHEETS = [
  {
    role: 'identity-turnaround',
    idSuffix: 'design-sheet-01-identity-turnaround',
    title: 'Sheet 01 Identity / Turnaround',
    sources: ['character-author-db', 'character-appearance-contracts', 'character-handedness-equipment'],
    qaChecklist: ['neutral-front', 'anatomical-left', 'anatomical-right', 'back', 'shared-ground-and-proportion-lines', 'same-scale', 'same-identity', 'body-relative-equipment-lock', 'no-mirror-substitution'],
  },
  {
    role: 'face-expression-acting',
    idSuffix: 'design-sheet-02-face-expression-acting',
    title: 'Sheet 02 Face / Expression / Acting',
    sources: ['character-author-db', 'character-appearance-contracts', 'character-behavior-identity', 'character-voice-prosody'],
    qaChecklist: ['neutral-front', 'left-and-right-three-quarter', 'left-and-right-profile', 'eye-brow-mouth-structure', 'identity-landmarks', 'age-impression', 'nearest-face-distinction'],
  },
  {
    role: 'costume-equipment-material',
    idSuffix: 'design-sheet-03-costume-equipment-material',
    title: 'Sheet 03 Costume / Equipment / Material',
    sources: ['character-author-db', 'character-appearance-contracts', 'character-handedness-equipment', 'character-lived-artifact', 'named-object-visual-source'],
    qaChecklist: ['layer-front-back-inside', 'fasteners-storage-footwear-hands', 'palette-material-wear-repair', 'body-relative-anchor', 'hold-stow-use', 'object-master-boundary', 'scale-grip-body-relationship'],
  },
  {
    role: 'silhouette-motion-derivation',
    idSuffix: 'design-sheet-04-silhouette-motion-derivation',
    title: 'Sheet 04 Silhouette / Motion / Derivation',
    sources: ['character-author-db', 'character-appearance-contracts'],
    qaChecklist: ['one-color-silhouette', 'rest', 'locomotion', 'signature-interaction', 'action', 'exertion', 'hurt', 'recovery', 'motion-signature', 'portrait-icon-crop', 'gameplay-size-proof'],
  },
] as const;

export function buildVisualCharacterPromptPackets() {
  return {
    schemaVersion: 1,
    registryId: 'yoruno-shirube-visual-character-prompt-packets-v1',
    generatedFrom: 'src/game/data/visualAssetGenerationInventory.ts',
    status: 'DRAFT_NOT_APPROVED_NOT_GENERATED',
    executionAllowed: false,
    sourceCommit: 'REQUIRED_AT_EXECUTION',
    packetPolicy: {
      primaryRequestRequiresHumanReview: true,
      unresolvedFieldMayNotBeInvented: true,
      exactCandidateCount: 4,
      sameContractAndPromptForComparison: true,
      imageGenerationPerformed: false,
      approvedAsFinal: false,
      runtimeApproved: false,
    },
    packets: CHARACTER_AUTHOR_DB_IDENTITIES.map((identity) => {
      const appearance = appearanceByName.get(identity.name);
      const era = eraById.get(identity.authorId);
      const root = rootById.get(identity.authorId);
      const theme = themeById.get(identity.stableProfileId);
      const object = objectByOwnerId.get(identity.stableProfileId);
      const starBeast = starBeastByCharacterId.get(identity.stableProfileId);
      const queue = queueEntryFor(identity.authorId, identity.stableProfileId);
      const silhouette = current21SilhouetteMatrixById.get(identity.stableProfileId);
      const hardSilhouette = characterSilhouetteAnchorById.get(identity.stableProfileId);
      const existingReference = core5ReferenceById.get(identity.authorId);
      const handednessEquipment = characterHandednessEquipmentByAuthorId.get(identity.authorId);
      if (!appearance || !era || !root || !theme || !handednessEquipment) throw new Error(`Prompt packet source missing for ${identity.authorId}`);
      const forbiddenInferences = [
        era.forbiddenShortcut,
        ...appearance.forbiddenDrift,
        ...(hardSilhouette?.prohibitedShortcuts ?? []),
        ...(silhouette ? [silhouette.generationGuard] : []),
        '画像の出来栄えからStory Canon、relationship、Star Beast、obsolete constellation、Reality birthplaceを推論しない。',
        ...(identity.rosterLayer === 'FUTURE15' ? ['Future15をfuture-era labelとして描かない。'] : []),
        ...(identity.authorId === 'asa' ? ['アサはHuman。Android/Robotとして描かない。'] : []),
        ...(identity.authorId === 'tomori' ? ['戦後世代のトモリにIAU公式88星座差を捏造しない。古星図は継承候補としてのみ扱う。'] : []),
        ...(['kai', 'nao'].includes(identity.authorId) ? ['カイ/ナオを同一人物・色違いcloneへ潰さない。同じ選択も許す。'] : []),
      ];
      const sourceOfTruth = [
        'character-author-db',
        'character-appearance-contracts',
        'character-handedness-equipment',
        'character-living-visual-roster',
        'visual-design-production-master',
        'character-era-registry',
        'character-era-fingerprints',
        'character-era-scene-seeds',
        'character-reality-roots',
        'character-theme-color-reservoir',
        ...(silhouette ? ['current21-silhouette-matrix'] : []),
        ...(hardSilhouette ? ['character-silhouette-canon'] : []),
        ...(object ? ['named-object-visual-source'] : []),
        ...(starBeast ? ['star-beast-visual-source'] : []),
      ];
      return {
        schemaVersion: 1,
        packetId: `visual-prompt:${identity.authorId}:character-design-master-pack:v1`,
        status: 'draft-not-approved-not-generated',
        assetId: `char-${identity.authorId}-design-master-pack-v1`,
        subject: { authorId: identity.authorId, stableProfileId: identity.stableProfileId, displayName: identity.name, rosterLayer: identity.rosterLayer },
        authoritySnapshot: {
          sourceCommit: 'REQUIRED_AT_EXECUTION',
          sourceOfTruth,
          sources: authoritySnapshots(sourceOfTruth),
          storyStatus: era.assignmentStatus,
          era: { lane: era.lane, status: era.assignmentStatus },
          realityRoot: { value: root.root, status: root.status, notBirthplaceOrIncidentArea: true },
          themeColor: { primaryHex: theme.primaryHex, accentHex: theme.accentHex, nightGlowHex: theme.nightGlowHex, status: 'AUTHOR_RESERVOIR_NON_CANON', finalApproved: false },
          openQuestions: [
            ...(silhouette ? [] : ['mainに36人用silhouette/living visual sourceが未接続。未merge PR由来の内容を推論で補完しない。']),
            ...(object?.referenceGenerationReady === false ? ['Named Object geometryはCandidateでreference generation未承認。'] : []),
          ],
          forbiddenInferences,
        },
        identityContract: {
          species: appearance.species,
          ageCoding: appearance.ageCoding,
          faceSignatureId: appearance.faceSignatureId,
          intentionalResemblanceGroup: appearance.intentionalResemblanceGroup,
          faceShape: appearance.faceShape,
          eyeShape: appearance.eyeShape,
          eyelid: appearance.eyelid,
          brow: appearance.brow,
          lashes: appearance.lashes,
          nose: appearance.nose,
          mouth: appearance.mouth,
          cheekOrSurfaceMark: appearance.cheekOrSurfaceMark,
          hairOrHeadStructure: appearance.hairOrHeadStructure,
          bodyShape: appearance.bodyShape,
          bodyModification: appearance.bodyModification,
          accessoryLanguage: appearance.accessoryLanguage,
          clothingConstruction: appearance.clothingConstruction,
          restingExpression: appearance.restingExpression,
          nearestExistingFace: appearance.nearestExistingFace,
          differenceFromNearest: appearance.differenceFromNearest,
        },
        handednessEquipmentContinuity: {
          dominantHand: handednessEquipment.dominantHand,
          heldItemHandMayNotInferDominantHand: true,
          placements: handednessEquipment.equipmentPlacements,
          mirrorPolicy: handednessEquipment.mirrorPolicy,
          frontViewProjection: handednessEquipment.frontViewProjection,
        },
        visualLanguage: silhouette ? {
          status: 'CURRENT21_DESIGN_SOURCE',
          silhouette: silhouette.silhouetteRead,
          posture: silhouette.posture,
          clothingShape: silhouette.clothingShape,
          objectAnchor: silhouette.objectAnchor,
          motionSignature: silhouette.motionSignature,
          ensemblePosition: silhouette.ensemblePosition,
          hardBodyDirection: hardSilhouette?.bodyDirection ?? null,
        } : {
          status: 'UNKNOWN_AUTHORING_REQUIRED',
          silhouette: null,
          posture: null,
          clothingShape: null,
          objectAnchor: object?.displayName ?? null,
          motionSignature: null,
          ensemblePosition: null,
          hardBodyDirection: null,
        },
        namedObject: object ? {
          id: object.id,
          displayName: object.displayName,
          namingStatus: object.namingStatus,
          geometryAuthority: object.geometryAuthority,
          generationReady: object.referenceGenerationReady,
        } : null,
        starBeast: starBeast ? {
          id: starBeast.id,
          scope: starBeast.scope,
          species: starBeast.species,
          authoritySeparateFromCharacterMaster: true,
          artworkState: starBeast.artworkState,
        } : null,
        referenceStack: {
          characterMaster: existingReference ? [existingReference.masterBoardPath] : [],
          currentBestAsset: existingReference ? [existingReference.spriteSheetPath] : [],
          turnaround: [],
          directEditTarget: [],
          rolesMustBeDeclared: true,
          reviewAction: queue?.action ?? 'AUTHORING_REQUIRED_BEFORE_GENERATION',
        },
        promptSpec: {
          useCase: 'stylized-concept',
          assetType: 'character-design-master-pack-plan',
          primaryRequest: identity.authorId === 'yui' ? 'AUTHOR_SHEET_01_IDENTITY_TURNAROUND_ONLY' : 'TO_BE_AUTHORED_AFTER_AUTHORITY_AND_VISUAL_LANGUAGE_REVIEW',
          styleMedium: 'TO_BE_BOUND_TO_APPROVED_PROJECT_REFERENCE_AT_EXECUTION',
          compositionFraming: 'one logical pack with four separately reviewed source sheets; never combine every decision into one generated board',
          constraints: ['no baked readable text', 'no generic anime face', 'no clone body/pose', 'no excessive glow/particles', 'preserve identity and Era boundary', 'use body-relative equipment placement', 'no uncorrected mirroring of asymmetric assets'],
          avoid: forbiddenInferences,
        },
        candidatePlan: { scope: 'per-source-sheet', countPerSheet: 4, sameContractAndPromptWithinSheet: true, packItselfIsNotGenerated: true },
        packPlan: {
          packId: `char-${identity.authorId}-design-master-pack-v1`,
          packVersion: 1,
          requiredSheets: CHARACTER_DESIGN_SOURCE_SHEETS.map((sheet) => ({ role: sheet.role, sheetId: `char-${identity.authorId}-${sheet.idSuffix}-v1` })),
          generationOrder: ['identity-turnaround', 'face-expression-acting', 'costume-equipment-material', 'silhouette-motion-derivation'],
          dependentSheetsBlockedUntilTurnaroundHumanApproval: true,
          overviewIsDeterministicReadModel: true,
        },
        output: { stagingRoot: `assets/import-staging/batch-character-master/${identity.authorId}/`, overwriteExistingForbidden: true },
        approval: { automaticQaRequired: true, humanVisualReviewRequired: true, approvedAsFinal: false, runtimeApproved: false },
      };
    }),
  };
}

type ProductionListItem = {
  assetId: string;
  subjectId: string;
  subjectType: string;
  title: string;
  batchId: string;
  priority: Priority | 'P1_SAKUYAZA' | 'P4_STAR_BEAST' | 'P5_ARTIFACT' | 'P6_LOREBOOK' | 'P7_GAMEPLAY';
  layer: 'master' | 'lorebook' | 'gameplay';
  kind: string;
  authorityStatus: string;
  productionStatus: 'blocked-authoring-required' | 'ready-for-prompt-review' | 'blocked-parent-master' | 'blocked-human-approval' | 'blocked-turnaround-human-approval' | 'blocked-parent-pack';
  reviewStatus: 'needs-authoring' | 'needs-generation' | 'not-materialized';
  sourceOfTruth: string[];
  parentAssetIds: string[];
  promptPacketId: string | null;
  outputPath: string;
  candidateIds: string[];
  qaChecklist: string[];
  blocker: string;
  notes: string;
  recordType?: 'master-pack' | 'source-sheet' | 'overview-read-model';
  sheetRole?: string;
  sheetOrder?: number;
  parentPackId?: string;
  packVersion?: number;
  packHash?: string;
  replaces?: string | null;
  supersededBy?: string | null;
  requiredSheetIds?: string[];
  requiredSheetRoles?: string[];
  authoritySnapshots?: ReturnType<typeof authoritySnapshots>;
  derivationParent?: { parentPackId: string | null; parentPackHash: string | null; usedSheetIds: string[]; plannedParentPackIds: string[] };
};

const candidatesFor = (assetId: string) => {
  const version = assetId.match(/^(.*)-v([1-9][0-9]*)$/);
  if (!version) throw new Error(`Production asset ID must end in -vN: ${assetId}`);
  return ['a', 'b', 'c', 'd'].map((suffix) => `${version[1]}-candidate-${suffix}-v${version[2]}`);
};
const masterOutput = (assetId: string) => `assets/import-staging/master/${assetId}/${assetId}.png`;
const lorebookOutput = (assetId: string) => `assets/import-staging/lorebook/${assetId}/${assetId}.png`;
const gameplayOutput = (assetId: string) => `assets/import-staging/gameplay/${assetId}/${assetId}.png`;

function characterMasterBatchId(authorId: string) {
  return CORE5.has(authorId)
    ? 'batch-01-core-main-character-master-v1'
    : MYSTERY_PRIORITY.has(authorId)
      ? 'batch-03-important-mystery-characters-v1'
      : 'batch-04-remaining-character-master-v1';
}

function characterMasterAuthorityStatus(identity: (typeof CHARACTER_AUTHOR_DB_IDENTITIES)[number]) {
  const era = eraById.get(identity.authorId);
  if (!era) throw new Error(`Era source missing for production item ${identity.authorId}`);
  return era.assignmentStatus;
}

function characterDesignSourceSheetProductionItems(): ProductionListItem[] {
  return CHARACTER_AUTHOR_DB_IDENTITIES.flatMap((identity) => {
    const authorityStatus = characterMasterAuthorityStatus(identity);
    return CHARACTER_DESIGN_SOURCE_SHEETS.map((sheet, index) => {
      const assetId = `char-${identity.authorId}-${sheet.idSuffix}-v1`;
      const isYuiTurnaround = identity.authorId === 'yui' && sheet.role === 'identity-turnaround';
      const isDependentSheet = sheet.role !== 'identity-turnaround';
      const sourceOfTruth = [
        ...sheet.sources,
        ...(!sheet.sources.some((source) => source === 'character-handedness-equipment') ? ['character-handedness-equipment'] : []),
        'character-living-visual-roster',
        'visual-design-production-master',
        ...(isYuiTurnaround ? ['yui-character-design-master-pack-v1'] : []),
      ];
      return {
        assetId,
        subjectId: identity.authorId,
        subjectType: 'character',
        title: `${identity.name} ${sheet.title}`,
        batchId: characterMasterBatchId(identity.authorId),
        priority: priorityFor(identity.authorId, identity.stableProfileId, identity.rosterLayer),
        layer: 'master',
        kind: 'character-design-source-sheet',
        recordType: 'source-sheet',
        sheetRole: sheet.role,
        sheetOrder: index + 1,
        parentPackId: `char-${identity.authorId}-design-master-pack-v1`,
        authorityStatus,
        productionStatus: isYuiTurnaround ? 'blocked-authoring-required' : isDependentSheet ? 'blocked-turnaround-human-approval' : 'blocked-authoring-required',
        reviewStatus: 'needs-generation',
        sourceOfTruth,
        authoritySnapshots: authoritySnapshots(sourceOfTruth),
        parentAssetIds: [],
        promptPacketId: isYuiTurnaround ? 'visual-prompt:yui:identity-turnaround:v1' : null,
        outputPath: masterOutput(assetId),
        candidateIds: candidatesFor(assetId),
        qaChecklist: [...sheet.qaChecklist, 'human-sheet-review', 'cross-sheet-consistency-review', 'story-final-runtime-no-auto-promotion'],
        blocker: isYuiTurnaround
          ? 'attempt 01の4候補はhard vetoで全件reject。学習を反映したversioned prompt revisionが必要。Human approvalを得るまでSheet 02–04を生成しない。'
          : isDependentSheet
            ? 'Sheet 01 Identity / TurnaroundのHuman identity/construction approval待ち。'
            : 'Sheet固有prompt packetとHuman authority reviewが未完了。',
        notes: '4 source sheetは独立したCharacter Masterではなく、1つの論理Packを裏付けるversioned visual evidence。承認済みsheetの差替えはversionを上げる。',
      } as ProductionListItem;
    });
  });
}

function characterDesignMasterPackProductionItems(): ProductionListItem[] {
  return CHARACTER_AUTHOR_DB_IDENTITIES.map((identity) => {
    const assetId = `char-${identity.authorId}-design-master-pack-v1`;
    const sheetIds = CHARACTER_DESIGN_SOURCE_SHEETS.map((sheet) => `char-${identity.authorId}-${sheet.idSuffix}-v1`);
    return {
      assetId,
      subjectId: identity.authorId,
      subjectType: 'character',
      title: `${identity.name} Character Design Master Pack`,
      batchId: characterMasterBatchId(identity.authorId),
      priority: priorityFor(identity.authorId, identity.stableProfileId, identity.rosterLayer),
      layer: 'master',
      kind: 'character-design-master-pack',
      recordType: 'master-pack',
      packVersion: 1,
      packHash: sha256Json({ assetId, packVersion: 1, sheetIds }),
      replaces: null,
      supersededBy: null,
      authorityStatus: characterMasterAuthorityStatus(identity),
      productionStatus: 'blocked-human-approval',
      reviewStatus: 'needs-authoring',
      sourceOfTruth: [
        'character-author-db', 'character-appearance-contracts', 'character-handedness-equipment',
        'character-living-visual-roster', 'visual-design-production-master',
        'character-era-registry', 'character-era-fingerprints',
        'character-era-scene-seeds', 'character-reality-roots', 'character-theme-color-reservoir',
        ...(current21SilhouetteMatrixById.has(identity.stableProfileId) ? ['current21-silhouette-matrix'] : []),
      ],
      parentAssetIds: [],
      requiredSheetIds: sheetIds,
      requiredSheetRoles: CHARACTER_DESIGN_SOURCE_SHEETS.map((sheet) => sheet.role),
      promptPacketId: `visual-prompt:${identity.authorId}:character-design-master-pack:v1`,
      outputPath: `data/character-assets/packs/${identity.authorId}/character-design-master-pack.v1.json`,
      candidateIds: [],
      qaChecklist: ['four-required-roles-unique', 'all-sheet-human-review', 'cross-sheet-same-person', 'body-relative-equipment-consistency', 'pack-human-review', 'lineage-and-hash-consistency'],
      blocker: '4 source sheetの個別Human review、cross-sheet consistency review、Pack reviewが完了するまでpartial packのまま。derivative parent禁止。',
      notes: identity.rosterLayer === 'FUTURE15'
        ? 'Future15 is a story grouping, not a future-era label. Composite coverage and visual quality remain separate.'
        : 'Current21 membership and complete component coverage do not imply visual final/runtime approval.',
    };
  });
}

function characterDesignOverviewProductionItems(): ProductionListItem[] {
  return CHARACTER_AUTHOR_DB_IDENTITIES.map((identity) => {
    const assetId = `char-${identity.authorId}-design-master-overview-v1`;
    return {
      assetId, subjectId: identity.authorId, subjectType: 'character', title: `${identity.name} Character Design Master Overview`,
      batchId: characterMasterBatchId(identity.authorId), priority: priorityFor(identity.authorId, identity.stableProfileId, identity.rosterLayer),
      layer: 'lorebook', kind: 'character-design-master-overview-read-model', recordType: 'overview-read-model', authorityStatus: characterMasterAuthorityStatus(identity),
      productionStatus: 'blocked-parent-pack', reviewStatus: 'not-materialized', sourceOfTruth: ['character-author-db'], parentAssetIds: [],
      derivationParent: { parentPackId: null, parentPackHash: null, usedSheetIds: [], plannedParentPackIds: [`char-${identity.authorId}-design-master-pack-v1`] },
      promptPacketId: null, outputPath: `data/character-assets/overviews/${identity.authorId}/character-design-master-overview.v1.json`, candidateIds: [],
      qaChecklist: ['deterministic-layout-only', 'source-sheet-hashes-preserved', 'never-master', 'never-generation-parent'],
      blocker: 'Approved complete Packが成立するまでOverview read modelをmaterializeしない。',
      notes: 'Layout-only versioning。Overview layout変更はPack versionを上げず、Overview versionだけを上げる。',
    } as ProductionListItem;
  });
}

function sakuyazaProductionItems(): ProductionListItem[] {
  return yatsukageCallNames.map((member) => {
    const slug = member.callName === 'ナシロ' ? 'nashiro'
      : member.callName === 'アサトジ' ? 'asatoji'
      : member.callName === 'ミチグレ' ? 'michigure'
      : member.callName === 'オリネ' ? 'orine'
      : member.callName === 'ハクマ' ? 'hakuma'
      : member.callName === 'ツグリ' ? 'tsuguri'
      : member.callName === 'ユラネ' ? 'yurane' : 'peta';
    const assetId = `sakuyaza-${slug}-master-v1`;
    return {
      assetId,
      subjectId: member.enemyId,
      subjectType: 'sakuyaza-member',
      title: `朔夜座 ${member.callName} Master`,
      batchId: 'batch-02-sakuyaza-eight-master-v1',
      priority: 'P1_SAKUYAZA',
      layer: 'master',
      kind: 'sakuyaza-character-master',
      authorityStatus: 'CURRENT',
      productionStatus: 'blocked-authoring-required',
      reviewStatus: 'needs-generation',
      sourceOfTruth: ['story-world-master', 'sakuyaza-member-source'],
      parentAssetIds: [],
      promptPacketId: null,
      outputPath: masterOutput(assetId),
      candidateIds: candidatesFor(assetId),
      qaChecklist: ['member-identity', 'recognition-gesture', 'individual-silhouette', 'sakuyaza-shared-grammar', 'no-clone-look', 'moon-wane-to-saku-motif', 'mobile-readability'],
      blocker: '朔夜座専用appearance/prompt packetを、既存Enemy visual sourceから作成してHuman reviewする必要がある。',
      notes: '外典星座を正式名にせず、8人の統一感と個別性を両立する。',
    };
  });
}

function starBeastProductionItems(): ProductionListItem[] {
  return starBeastVisualSharedSourceEntries.map((starBeast) => {
    const canonical = aliasesForProduction(starBeast.characterId);
    const assetId = `star-beast-${canonical}-master-v1`;
    return {
      assetId,
      subjectId: starBeast.id,
      subjectType: 'star-beast',
      title: `${starBeast.characterDisplayName} Star Beast Master`,
      batchId: 'batch-05-star-beast-master-v1',
      priority: 'P4_STAR_BEAST',
      layer: 'master',
      kind: 'star-beast-master',
      authorityStatus: starBeast.scope === 'OFFICIAL_RESERVE' ? 'CANDIDATE' : 'CURRENT',
      productionStatus: 'ready-for-prompt-review',
      reviewStatus: 'needs-generation',
      sourceOfTruth: ['star-beast-visual-source'],
      parentAssetIds: [],
      promptPacketId: null,
      outputPath: masterOutput(assetId),
      candidateIds: candidatesFor(assetId),
      qaChecklist: ['species-silhouette', 'front-side-read', 'face-rule', 'pose', 'one-color-read', 'plush-read', 'no-character-costume', 'no-zodiac-glyph'],
      blocker: 'Human prompt/authority review before image generation.',
      notes: 'Historical/obsolete constellation motif may not auto-assign or change Star Beast authority.',
    };
  });
}

function aliasesForProduction(id: string): string {
  const identity = CHARACTER_AUTHOR_DB_IDENTITIES.find((entry) => entry.authorId === id || entry.stableProfileId === id);
  return identity?.authorId ?? id.toLowerCase();
}

function objectProductionItems(): ProductionListItem[] {
  return namedObjectVisualSharedSourceEntries.map((object) => {
    const owner = aliasesForProduction(object.ownerId);
    const assetId = `artifact-${owner}-named-object-master-v1`;
    return {
      assetId,
      subjectId: object.sourceNamedObjectId,
      subjectType: 'artifact',
      title: `${object.ownerDisplayName} ${object.displayName} Master`,
      batchId: 'batch-06-story-artifact-master-v1',
      priority: 'P5_ARTIFACT',
      layer: 'master',
      kind: 'named-object-master',
      authorityStatus: object.namingStatus === 'CURRENT_DIRECTION' ? 'CURRENT' : 'CANDIDATE',
      productionStatus: object.referenceGenerationReady ? 'ready-for-prompt-review' : 'blocked-authoring-required',
      reviewStatus: 'needs-generation',
      sourceOfTruth: ['named-object-visual-source'],
      parentAssetIds: [],
      promptPacketId: null,
      outputPath: masterOutput(assetId),
      candidateIds: candidatesFor(assetId),
      qaChecklist: ['front', 'back', 'side', 'scale', 'material', 'wear', 'repair-marks', 'handling', 'storage', 'no-readable-text'],
      blocker: object.referenceGenerationReady ? 'Human prompt/geometry review before image generation.' : 'Candidate geometry is explicitly not reference-generation-ready.',
      notes: '物が人物より先に時代を渡る可能性を残す。摩耗・修理跡をpremium化で消さない。',
    };
  });
}

function lorebookProductionItems(): ProductionListItem[] {
  const profileItems = CHARACTER_AUTHOR_DB_IDENTITIES.map((identity) => {
    const assetId = `char-${identity.authorId}-lorebook-profile-v1`;
    return {
      assetId, subjectId: identity.authorId, subjectType: 'character', title: `${identity.name} Lorebook Profile`,
      batchId: 'batch-08-lorebook-profile-cards-v1', priority: 'P6_LOREBOOK', layer: 'lorebook', kind: 'lorebook-profile', authorityStatus: 'CURRENT',
      productionStatus: 'blocked-parent-master', reviewStatus: 'needs-generation',
      sourceOfTruth: ['character-profile-read-model', 'character-author-db'], parentAssetIds: [`char-${identity.authorId}-master-v1`], promptPacketId: null,
      outputPath: lorebookOutput(assetId), candidateIds: candidatesFor(assetId),
      qaChecklist: ['readable', 'status-visible', 'no-canon-flattening', 'no-excessive-ui', 'profile-identity'],
      blocker: 'Parent Character Master approval required.', notes: 'Author/read model。Gameplayの親にしない。',
    } as ProductionListItem;
  });
  const eraRootItems = CHARACTER_AUTHOR_DB_IDENTITIES.flatMap((identity) => ['era', 'reality-root'].map((kind) => {
    const assetId = `char-${identity.authorId}-lorebook-${kind}-v1`;
    return {
      assetId, subjectId: identity.authorId, subjectType: 'character', title: `${identity.name} Lorebook ${kind}`,
      batchId: 'batch-09-era-reality-root-cards-v1', priority: 'P6_LOREBOOK', layer: 'lorebook', kind: `lorebook-${kind}`, authorityStatus: 'CURRENT',
      productionStatus: 'blocked-parent-master', reviewStatus: 'needs-generation',
      sourceOfTruth: kind === 'era' ? ['character-era-registry'] : ['character-reality-roots'], parentAssetIds: [`char-${identity.authorId}-master-v1`], promptPacketId: null,
      outputPath: lorebookOutput(assetId), candidateIds: candidatesFor(assetId),
      qaChecklist: kind === 'era' ? ['era-status-visible', 'future15-not-era', 'dream-not-era', 'no-exact-chronology-leak'] : ['root-status-visible', 'root-not-birthplace', 'root-not-incident-area', 'no-region-stereotype'],
      blocker: 'Parent Character Master approval required.', notes: 'Clue/status boundary must stay visible.',
    } as ProductionListItem;
  }));
  const relationshipItems = CHARACTER_RELATIONSHIP_GRAPH_EDGES.map((edge) => {
    const source = aliasesForProduction(edge.sourceNodeId);
    const target = aliasesForProduction(edge.targetNodeId);
    const assetId = `relationship-${source}-${target}-lorebook-card-v1`;
    return {
      assetId, subjectId: edge.edgeId, subjectType: 'relationship-edge', title: `${edge.displayLabel} Lorebook Card`,
      batchId: 'batch-10-foreshadow-mystery-cards-v1', priority: 'P6_LOREBOOK', layer: 'lorebook', kind: 'lorebook-relationship', authorityStatus: edge.detailStatus,
      productionStatus: 'blocked-parent-master', reviewStatus: 'needs-generation', sourceOfTruth: ['character-relationship-read-model'],
      parentAssetIds: [`char-${source}-master-v1`, `char-${target}-master-v1`], promptPacketId: null, outputPath: lorebookOutput(assetId), candidateIds: candidatesFor(assetId),
      qaChecklist: ['edge-status-visible', 'line-not-affection', 'line-not-romance-hate', 'no-line-not-no-relationship'], blocker: 'Both parent Character Masters must be approved.', notes: 'Exact incident/romance/blood relationをedgeから推論しない。',
    } as ProductionListItem;
  });
  const foreshadowItems = CHARACTER_CROSS_ERA_ECHO_CHAINS.map((chain) => {
    const assetId = `foreshadow-${chain.id}-lorebook-card-v1`;
    return {
      assetId, subjectId: chain.id, subjectType: 'foreshadow-chain', title: `${chain.id} Foreshadow Card`, batchId: 'batch-10-foreshadow-mystery-cards-v1',
      priority: 'P6_LOREBOOK', layer: 'lorebook', kind: 'lorebook-foreshadow', authorityStatus: chain.canonStatus, productionStatus: 'blocked-parent-master', reviewStatus: 'needs-generation',
      sourceOfTruth: ['cross-era-echo-chains'], parentAssetIds: chain.participantIds.map((id) => `char-${aliasesForProduction(id)}-master-v1`), promptPacketId: null,
      outputPath: lorebookOutput(assetId), candidateIds: candidatesFor(assetId), qaChecklist: ['setup', 'misread', 'evidence', 'reinterpretation', 'payoff', 'candidate-visible'],
      blocker: 'All participant Character Masters and evidence/artifact parents must be reviewed.', notes: chain.forbiddenShortcut,
    } as ProductionListItem;
  });
  return [...profileItems, ...eraRootItems, ...relationshipItems, ...foreshadowItems];
}

function gameplayProductionItems(): ProductionListItem[] {
  return CHARACTER_AUTHOR_DB_IDENTITIES.flatMap((identity) => ['icon', 'portrait'].map((kind) => {
    const assetId = `char-${identity.authorId}-gameplay-${kind}-v1`;
    return {
      assetId, subjectId: identity.authorId, subjectType: 'character', title: `${identity.name} Gameplay ${kind}`, batchId: kind === 'icon' ? 'batch-11-gameplay-icons-v1' : 'batch-12-gameplay-portraits-card-art-v1',
      priority: 'P7_GAMEPLAY', layer: 'gameplay', kind: `gameplay-${kind}`, authorityStatus: 'CANDIDATE', productionStatus: 'blocked-parent-master', reviewStatus: 'needs-generation',
      sourceOfTruth: ['asset-generation-policy', 'character-appearance-contracts'], parentAssetIds: [`char-${identity.authorId}-master-v1`], promptPacketId: null,
      outputPath: gameplayOutput(assetId), candidateIds: candidatesFor(assetId), qaChecklist: ['small-size-readability', 'silhouette-recognition', 'no-face-drift', 'clean-crop', 'implementation-compatible'],
      blocker: 'Approved parent Character Master required; Lorebook asset may not be parent.', notes: 'Master -> Gameplay direct derivative.',
    } as ProductionListItem;
  }));
}

function existingAssetGenerationContractIndex() {
  return assetGenerationContracts.map((contract) => ({
    contractId: contract.contractId,
    promptCatalogKey: contract.promptCatalogKey,
    contentType: contract.contentType,
    sourceId: contract.sourceId,
    displayName: contract.displayName,
    kind: contract.kind,
    outputPathHint: contract.outputPathHint,
    contractVersion: contract.contractVersion,
    policyVersion: contract.policyVersion,
    registryMode: 'reference-existing-contract-not-production-item',
  }));
}

export function buildVisualImageProductionList() {
  const characterDesignSourceSheets = characterDesignSourceSheetProductionItems();
  const characterDesignMasterPacks = characterDesignMasterPackProductionItems();
  const characterDesignOverviews = characterDesignOverviewProductionItems();
  const detachUnapprovedPackParents = (item: ProductionListItem): ProductionListItem => {
    if (item.layer === 'master' || item.recordType === 'overview-read-model') return item;
    const plannedParentPackIds = item.parentAssetIds.map((id) => id.replace(/-master-v1$/, '-design-master-pack-v1'));
    return {
      ...item,
      parentAssetIds: [],
      derivationParent: { parentPackId: null, parentPackHash: null, usedSheetIds: [], plannedParentPackIds },
      productionStatus: 'blocked-parent-pack',
      blocker: 'Approved complete Character Design Master PackのparentPackId/hash/usedSheetIdsが固定されるまで生成禁止。',
    };
  };
  const items = [
    ...characterDesignMasterPacks,
    ...characterDesignSourceSheets,
    ...characterDesignOverviews,
    ...sakuyazaProductionItems(),
    ...starBeastProductionItems(),
    ...objectProductionItems(),
    ...lorebookProductionItems().map(detachUnapprovedPackParents),
    ...gameplayProductionItems().map(detachUnapprovedPackParents),
  ];
  const existingContractIndex = existingAssetGenerationContractIndex();
  return {
    schemaVersion: 1,
    listId: 'yoruno-shirube-image-production-list-v1',
    generatedFrom: 'src/game/data/visualAssetGenerationInventory.ts',
    goal: 'Materialize logical Pack/Overview records deterministically and generate only image/source-sheet rows through managed batches after blockers are cleared; unlisted images are not authorized for generation.',
    currentMode: 'PRE_GENERATION_NO_IMAGE_OUTPUT',
    executionAllowed: false,
    listPolicy: {
      coverageIsNotQuality: true,
      generationRequiresPromptPacket: true,
      exactCandidateCountPerAsset: 4,
      overwriteExistingForbidden: true,
      masterBeforeLorebookOrGameplay: true,
      lorebookMayNotParentGameplay: true,
      humanReviewRequired: true,
      imageMayNotPromoteStoryAuthority: true,
      sourceSheetCoverageMayNotBeUsedAsQualityOrApproval: true,
      existingAssetFactoryContractsAreIndexedNotDuplicated: true,
      partialPackMayNotParentDerivatives: true,
      overviewReadModelMayNotBeMasterOrParent: true,
      packApprovalMayNotAutoPromoteChildFinalOrRuntime: true,
    },
    sourceCatalog: VISUAL_SOURCE_CATALOG,
    counts: {
      totalItems: items.length,
      characterDesignMasterPacks: characterDesignMasterPacks.length,
      characterDesignSourceSheets: characterDesignSourceSheets.length,
      characterDesignSourceSheetsPerPack: CHARACTER_DESIGN_SOURCE_SHEETS.length,
      characterDesignOverviewReadModels: characterDesignOverviews.length,
      characterMasters: characterDesignMasterPacks.length,
      sakuyazaMasters: items.filter((item) => item.kind === 'sakuyaza-character-master').length,
      starBeastMasters: items.filter((item) => item.kind === 'star-beast-master').length,
      namedObjectMasters: items.filter((item) => item.kind === 'named-object-master').length,
      lorebookItems: items.filter((item) => item.layer === 'lorebook').length,
      gameplayItems: items.filter((item) => item.layer === 'gameplay').length,
      existingAssetGenerationContractsIndexed: existingContractIndex.length,
    },
    characterDesignMasterPackModel: {
      direction: 'SOURCE_OF_TRUTH -> CHARACTER_DESIGN_MASTER_PACK -> OVERVIEW_READ_MODEL | LOREBOOK_DERIVED | GAMEPLAY_DERIVED',
      requiredSheetRoles: CHARACTER_DESIGN_SOURCE_SHEETS.map((sheet) => sheet.role),
      sourceSheetAssetIdSuffixes: CHARACTER_DESIGN_SOURCE_SHEETS.map((sheet) => sheet.idSuffix),
      sourceSheetCountPerPack: CHARACTER_DESIGN_SOURCE_SHEETS.length,
      requiredCharacterCount: CHARACTER_AUTHOR_DB_IDENTITIES.length,
      coverageIsNotQuality: true,
      completeCoverageIsNotApproval: true,
      logicalPackIsTheOnlyMaster: true,
      sourceSheetsAreEvidenceNotIndependentMasters: true,
      overviewIsDeterministicReadModelOnly: true,
      turnaroundHumanApprovalGatesDependentSheets: true,
      approvedSheetReplacementRequiresVersionIncrement: true,
    },
    existingAssetGenerationContractIndex: {
      source: 'asset-generation-policy',
      mode: 'REFERENCE_ONLY_DO_NOT_DUPLICATE_AS_PRODUCTION_ITEMS',
      contractCount: existingContractIndex.length,
      contracts: existingContractIndex,
    },
    omittedUntilAuthorityExists: [
      { category: 'constellation-historical-archive-master', sourceCount: CONSTELLATION_STORY_CLUE_CANDIDATES.length, reason: 'Research/Candidate clues require per-object archive asset definitions before generation.' },
      { category: 'key-art', reason: 'Character/Sakuyaza Masters must be approved first.' },
      { category: 'full-gameplay-catalog', reason: 'Weapon/item/enemy/UI generation remains owned by the indexed existing Asset Factory contracts; those contracts are discoverable here without duplicate production-item registration.' },
    ],
    items,
  };
}
