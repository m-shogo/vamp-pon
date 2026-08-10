import {
  currentCharacterStarBeastCombatEntries,
} from './characterStarBeastCombatSource.ts';
import {
  currentRelationshipInventory,
  type CurrentRelationCharacterId,
} from './currentRelationshipInventory.ts';
import {
  baseWeaponCandidates,
  currentBaseWeaponIds,
} from './weaponExpansionSource.ts';
import {
  weaponAwakeningCandidates,
} from './weaponTransformationSource.ts';
import type { BuffKind, StatusKind } from './combatAffinitySource.ts';
import type { CombatAttribute } from './combatAffinitySource.ts';
import { currentCharacterCombatKitSeedsA } from './currentCharacterCombatKitSeedsA.ts';
import { currentCharacterCombatKitSeedsB } from './currentCharacterCombatKitSeedsB.ts';
import { currentCharacterCombatKitSeedsC } from './currentCharacterCombatKitSeedsC.ts';

export type CurrentCharacterCombatKitSeed = {
  characterId: CurrentRelationCharacterId;
  startingWeaponId: string;
  signatureStatus: StatusKind;
  starBeastMechanic: string;
  specialPassive: string;
  blackYoukaChange: string;
  blackYoukaTradeoff: string;
  awakeningConceptId: string;
  awakeningName: string;
  awakeningTriggerMeaning: string;
  awakeningGameplayShift: string;
  preferredBuild: string;
  frictionBuild: string;
  relationId: string;
  partnerId: CurrentRelationCharacterId;
  relationAssist: string;
  pairSynergy: string;
  linkedAwakeningCandidateId?: string;
};

export type CurrentCharacterCombatKitEntry = {
  characterId: CurrentRelationCharacterId;
  characterName: string;
  starBeast: string;
  intrinsicAttributes: readonly CombatAttribute[];
  proficientAttributes: readonly CombatAttribute[];
  resistedStatus: StatusKind;
  startingWeapon: {
    weaponId: string;
    sourceKind: 'CURRENT_BASE' | 'BASE_CANDIDATE';
    runtimeStatus: 'CURRENT_RUNTIME' | 'CONTENT_SOURCE_ONLY';
  };
  starBeastMechanic: string;
  signature: {
    buff: BuffKind;
    status: StatusKind;
  };
  specialPassive: string;
  blackYouka: {
    combatChange: string;
    tradeoff: string;
    permanentAttributePromotionAllowed: false;
  };
  awakening: {
    conceptId: string;
    name: string;
    triggerMeaning: string;
    gameplayShift: string;
    linkedCandidateId?: string;
    linkedCandidateOutputAttributes?: readonly CombatAttribute[];
    linkedCandidateStoryMeaning?: string;
    status: 'CONTENT_SOURCE_ONLY';
  };
  preferredBuild: string;
  frictionBuild: string;
  relation: {
    relationId: string;
    partnerId: CurrentRelationCharacterId;
    displayLabel: string;
    assist: string;
    pairSynergy: string;
  };
  authority: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

export const currentCharacterCombatKitSeeds: readonly CurrentCharacterCombatKitSeed[] = [
  ...currentCharacterCombatKitSeedsA,
  ...currentCharacterCombatKitSeedsB,
  ...currentCharacterCombatKitSeedsC,
];

const starBeastByCharacterId = new Map(
  currentCharacterStarBeastCombatEntries.map((entry) => [entry.characterId, entry]),
);
const relationById = new Map(currentRelationshipInventory.map((entry) => [entry.id, entry]));
const currentBaseWeaponIdSet = new Set(currentBaseWeaponIds);
const candidateWeaponById = new Map(baseWeaponCandidates.map((entry) => [entry.id, entry]));
const awakeningCandidateById = new Map(weaponAwakeningCandidates.map((entry) => [entry.id, entry]));

export const currentCharacterCombatKitEntries: readonly CurrentCharacterCombatKitEntry[] =
  currentCharacterCombatKitSeeds.map((seed) => {
    const identity = starBeastByCharacterId.get(seed.characterId);
    if (!identity) throw new Error(`missing Current21 star-beast combat identity: ${seed.characterId}`);

    const relation = relationById.get(seed.relationId);
    if (!relation) throw new Error(`missing Current relationship: ${seed.relationId}`);
    if (!relation.participants.includes(seed.characterId) || !relation.participants.includes(seed.partnerId)) {
      throw new Error(`relation ${seed.relationId} does not connect ${seed.characterId} and ${seed.partnerId}`);
    }

    const candidateWeapon = candidateWeaponById.get(seed.startingWeaponId);
    const isCurrentBase = currentBaseWeaponIdSet.has(seed.startingWeaponId);
    if (!isCurrentBase && !candidateWeapon) {
      throw new Error(`unknown starting Base Weapon: ${seed.startingWeaponId}`);
    }

    const linkedAwakening = seed.linkedAwakeningCandidateId
      ? awakeningCandidateById.get(seed.linkedAwakeningCandidateId)
      : undefined;
    if (seed.linkedAwakeningCandidateId && !linkedAwakening) {
      throw new Error(`unknown linked awakening candidate: ${seed.linkedAwakeningCandidateId}`);
    }

    return {
      characterId: seed.characterId,
      characterName: identity.characterName,
      starBeast: identity.starBeast,
      intrinsicAttributes: identity.intrinsicAttributes,
      proficientAttributes: identity.proficientAttributes,
      resistedStatus: identity.resistedStatus,
      startingWeapon: {
        weaponId: seed.startingWeaponId,
        sourceKind: isCurrentBase ? 'CURRENT_BASE' : 'BASE_CANDIDATE',
        runtimeStatus: isCurrentBase ? 'CURRENT_RUNTIME' : 'CONTENT_SOURCE_ONLY',
      },
      starBeastMechanic: seed.starBeastMechanic,
      signature: {
        buff: identity.resonanceBuff,
        status: seed.signatureStatus,
      },
      specialPassive: seed.specialPassive,
      blackYouka: {
        combatChange: seed.blackYoukaChange,
        tradeoff: seed.blackYoukaTradeoff,
        permanentAttributePromotionAllowed: false,
      },
      awakening: {
        conceptId: seed.awakeningConceptId,
        name: seed.awakeningName,
        triggerMeaning: seed.awakeningTriggerMeaning,
        gameplayShift: seed.awakeningGameplayShift,
        linkedCandidateId: linkedAwakening?.id,
        linkedCandidateOutputAttributes: linkedAwakening?.outputAttributes,
        linkedCandidateStoryMeaning: linkedAwakening?.storyMeaning,
        status: 'CONTENT_SOURCE_ONLY',
      },
      preferredBuild: seed.preferredBuild,
      frictionBuild: seed.frictionBuild,
      relation: {
        relationId: seed.relationId,
        partnerId: seed.partnerId,
        displayLabel: relation.displayLabel,
        assist: seed.relationAssist,
        pairSynergy: seed.pairSynergy,
      },
      authority: 'CONTENT_SOURCE_ONLY',
      runtimeAutoPromotionAllowed: false,
    };
  });

export const currentCharacterCombatKitSummary = {
  characterCount: currentCharacterCombatKitEntries.length,
  currentBaseStarterCount: currentCharacterCombatKitEntries.filter(
    (entry) => entry.startingWeapon.sourceKind === 'CURRENT_BASE',
  ).length,
  candidateBaseStarterCount: currentCharacterCombatKitEntries.filter(
    (entry) => entry.startingWeapon.sourceKind === 'BASE_CANDIDATE',
  ).length,
  linkedExistingAwakeningCount: currentCharacterCombatKitEntries.filter(
    (entry) => Boolean(entry.awakening.linkedCandidateId),
  ).length,
  charactersWithBlackYoukaTradeoff: currentCharacterCombatKitEntries.filter(
    (entry) => entry.blackYouka.tradeoff.length > 0,
  ).length,
  charactersWithRelationAssist: currentCharacterCombatKitEntries.filter(
    (entry) => entry.relation.assist.length > 0 && entry.relation.pairSynergy.length > 0,
  ).length,
  runtimeAutoPromotionAllowed: false,
  futureCastPromotionAllowed: false,
} as const;
