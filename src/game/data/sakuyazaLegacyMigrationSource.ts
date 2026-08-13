import {
  buildYatsukagePartyEncounterPlan,
  current21YatsukageRelationshipEntries,
  current21YatsukageRelationshipSummary,
} from './current21YatsukageRelationshipSource.ts';
import { SAKUYAZA_CURRENT_IDENTITY, sakumeiCandidateMembers } from './sakumeiCandidateSource.ts';
import {
  applyYatsukageEncounterMemoryEvent,
  buildYatsukageRelationPresentation,
  buildYatsukageTrioEncounterPresentationPlan,
  createEmptyYatsukageRelationMemoryState,
  replayYatsukageEncounterMemory,
  yatsukageEncounterMemorySummary,
} from './yatsukageEncounterMemorySource.ts';
import { yatsukageCallNames, YATSUKAGE_GROUP_IDENTITY } from './yatsukageIdentitySource.ts';
import { yatsukagePairDynamics, yatsukagePairDynamicsSummary } from './yatsukagePairDynamicsSource.ts';

/**
 * Current-facing facade over source files whose stable names still contain
 * `Yatsukage`. The legacy names remain for import/API compatibility, but new
 * Story/Visual/Guide code should consume this facade so `八影` cannot regain
 * Current formal-name authority.
 */
export const SAKUYAZA_LEGACY_MIGRATION_POLICY = {
  currentFormalName: SAKUYAZA_CURRENT_IDENTITY.formalName,
  currentSeasonScope: SAKUYAZA_CURRENT_IDENTITY.seasonScope,
  legacyFormalLabel: YATSUKAGE_GROUP_IDENTITY.formalName,
  legacyShortLabel: YATSUKAGE_GROUP_IDENTITY.shortName,
  legacyLabelRole: 'EARLY_OBSERVER_LABEL_ONLY',
  stableLegacyFileNamesMayRemain: true,
  stableEnemyIdsMayRemain: true,
  currentVisualMasterMayUseLegacyGroupName: false,
  currentGuideGroupLabelMayUseLegacyNameOutsideExplicitHistoricalContext: false,
  currentLateRevealFormalLabelMustUseSakuyaza: true,
  runtimeAutoPromotionAllowed: false,
} as const;

export const sakuyazaCallNames = yatsukageCallNames;
export const current21SakuyazaRelationshipEntries = current21YatsukageRelationshipEntries;
export const sakuyazaPairDynamics = yatsukagePairDynamics;

/** Current-name wrapper. Return shape intentionally stays compatible. */
export function buildSakuyazaPartyEncounterPlan(
  ...args: Parameters<typeof buildYatsukagePartyEncounterPlan>
): ReturnType<typeof buildYatsukagePartyEncounterPlan> {
  return buildYatsukagePartyEncounterPlan(...args);
}

export function createEmptySakuyazaRelationMemoryState(
  ...args: Parameters<typeof createEmptyYatsukageRelationMemoryState>
): ReturnType<typeof createEmptyYatsukageRelationMemoryState> {
  return createEmptyYatsukageRelationMemoryState(...args);
}

export function applySakuyazaEncounterMemoryEvent(
  ...args: Parameters<typeof applyYatsukageEncounterMemoryEvent>
): ReturnType<typeof applyYatsukageEncounterMemoryEvent> {
  return applyYatsukageEncounterMemoryEvent(...args);
}

export function replaySakuyazaEncounterMemory(
  ...args: Parameters<typeof replayYatsukageEncounterMemory>
): ReturnType<typeof replayYatsukageEncounterMemory> {
  return replayYatsukageEncounterMemory(...args);
}

/**
 * The legacy encounter-memory source still embeds `八影・` in late display
 * text. Current consumers receive a sanitized formal label here. The early
 * observer label remains available only through explicit historical context.
 */
export function buildSakuyazaRelationPresentation(
  ...args: Parameters<typeof buildYatsukageRelationPresentation>
): ReturnType<typeof buildYatsukageRelationPresentation> {
  const legacy = buildYatsukageRelationPresentation(...args);
  return {
    ...legacy,
    enemyDisplayName: legacy.enemyDisplayName.startsWith('八影・')
      ? legacy.enemyDisplayName.replace(/^八影・/, `${SAKUYAZA_CURRENT_IDENTITY.formalName}・`)
      : legacy.enemyDisplayName,
  };
}

export function buildSakuyazaTrioEncounterPresentationPlan(
  ...args: Parameters<typeof buildYatsukageTrioEncounterPresentationPlan>
): ReturnType<typeof buildYatsukageTrioEncounterPresentationPlan> {
  const legacy = buildYatsukageTrioEncounterPresentationPlan(...args);
  return {
    ...legacy,
    personalPresentations: legacy.personalPresentations.map((presentation) => ({
      ...presentation,
      enemyDisplayName: presentation.enemyDisplayName.startsWith('八影・')
        ? presentation.enemyDisplayName.replace(/^八影・/, `${SAKUYAZA_CURRENT_IDENTITY.formalName}・`)
        : presentation.enemyDisplayName,
    })),
  };
}

const currentEnemyIds = new Set(sakumeiCandidateMembers.map((entry) => entry.enemyId));
const legacyEnemyIds = new Set(yatsukageCallNames.map((entry) => entry.enemyId));

export const sakuyazaLegacyMigrationSummary = {
  currentFormalName: SAKUYAZA_CURRENT_IDENTITY.formalName,
  legacyObserverLabel: YATSUKAGE_GROUP_IDENTITY.shortName,
  currentMemberCount: sakumeiCandidateMembers.length,
  legacyCallNameCount: yatsukageCallNames.length,
  enemyIdSetMatches: currentEnemyIds.size === legacyEnemyIds.size && [...currentEnemyIds].every((id) => legacyEnemyIds.has(id)),
  current21RelationCount: current21YatsukageRelationshipSummary.relationCount,
  pairCount: yatsukagePairDynamicsSummary.authoredPairCount,
  encounterMemoryPhaseCount: yatsukageEncounterMemorySummary.phaseCount,
  currentVisualMasterMayUseLegacyGroupName: false,
  runtimeAutoPromotionAllowed: false,
} as const;
