import type { CollectionProgressSaveV2 } from './collectionProgressSaveV2.ts';
import { allLightsCompletionDesign } from './namedObjectRegistry.ts';

export type FrozenCompletionGroupDefinition = {
  id: string;
  displayName: string;
  requiredIds: string[];
};

export type AllLightsCompletionSpecification = {
  version: string;
  runtimeFrozen: boolean;
  groups: FrozenCompletionGroupDefinition[];
};

export type AllLightsEvaluation = {
  state: 'LOCKED' | 'INCOMPLETE' | 'ELIGIBLE' | 'CLAIMED';
  reason:
    | 'DENOMINATOR_NOT_FROZEN'
    | 'INVALID_FROZEN_SPECIFICATION'
    | 'MISSING_GROUP_STATE'
    | 'REQUIREMENTS_INCOMPLETE'
    | 'ALL_REQUIREMENTS_COMPLETE'
    | 'REWARD_ALREADY_CLAIMED';
  missingByGroup: Record<string, string[]>;
};

export const allLightsCompletionDraftSpecification: AllLightsCompletionSpecification = {
  version: allLightsCompletionDesign.version,
  runtimeFrozen: false,
  groups: allLightsCompletionDesign.groups.map((group) => ({
    id: group.id,
    displayName: group.displayName,
    requiredIds: [],
  })),
};

function uniqueRequiredIds(ids: string[]): string[] {
  return [...new Set(ids.map((id) => id.trim()).filter((id) => id !== ''))];
}

function hasValidFrozenDenominator(specification: AllLightsCompletionSpecification): boolean {
  if (specification.version.trim() === '' || specification.groups.length === 0) {
    return false;
  }

  const groupIds = new Set<string>();
  for (const group of specification.groups) {
    if (
      group.id.trim() === '' ||
      group.displayName.trim() === '' ||
      groupIds.has(group.id) ||
      uniqueRequiredIds(group.requiredIds).length === 0
    ) {
      return false;
    }
    groupIds.add(group.id);
  }
  return true;
}

export function evaluateAllLightsCompletion(
  specification: AllLightsCompletionSpecification,
  save: CollectionProgressSaveV2,
): AllLightsEvaluation {
  if (!specification.runtimeFrozen) {
    return {
      state: 'LOCKED',
      reason: 'DENOMINATOR_NOT_FROZEN',
      missingByGroup: {},
    };
  }

  if (!hasValidFrozenDenominator(specification)) {
    return {
      state: 'LOCKED',
      reason: 'INVALID_FROZEN_SPECIFICATION',
      missingByGroup: {},
    };
  }

  const missingByGroup: Record<string, string[]> = {};
  let missingGroupState = false;

  for (const group of specification.groups) {
    const state = save.completion.groupStates[group.id];
    if (!state) {
      missingGroupState = true;
      missingByGroup[group.id] = uniqueRequiredIds(group.requiredIds);
      continue;
    }

    const completed = new Set(state.completedIds);
    const missing = uniqueRequiredIds(group.requiredIds).filter((id) => !completed.has(id));
    if (missing.length > 0) {
      missingByGroup[group.id] = missing;
    }
  }

  if (missingGroupState) {
    return {
      state: 'INCOMPLETE',
      reason: 'MISSING_GROUP_STATE',
      missingByGroup,
    };
  }

  if (Object.keys(missingByGroup).length > 0) {
    return {
      state: 'INCOMPLETE',
      reason: 'REQUIREMENTS_INCOMPLETE',
      missingByGroup,
    };
  }

  if (
    save.completion.completionRewardClaimed ||
    save.completion.hundredPercentState === 'CLAIMED'
  ) {
    return {
      state: 'CLAIMED',
      reason: 'REWARD_ALREADY_CLAIMED',
      missingByGroup: {},
    };
  }

  return {
    state: 'ELIGIBLE',
    reason: 'ALL_REQUIREMENTS_COMPLETE',
    missingByGroup: {},
  };
}

export type AllLightsClaimResult = {
  claimed: boolean;
  save: CollectionProgressSaveV2;
  evaluation: AllLightsEvaluation;
};

export function claimAllLightsReward(
  specification: AllLightsCompletionSpecification,
  save: CollectionProgressSaveV2,
): AllLightsClaimResult {
  const evaluation = evaluateAllLightsCompletion(specification, save);

  if (evaluation.state === 'CLAIMED') {
    return { claimed: false, save, evaluation };
  }

  if (evaluation.state !== 'ELIGIBLE') {
    return { claimed: false, save, evaluation };
  }

  const nextSave: CollectionProgressSaveV2 = {
    ...save,
    completion: {
      ...save.completion,
      hundredPercentState: 'CLAIMED',
      completionRewardClaimed: true,
    },
  };

  return {
    claimed: true,
    save: nextSave,
    evaluation: {
      state: 'CLAIMED',
      reason: 'REWARD_ALREADY_CLAIMED',
      missingByGroup: {},
    },
  };
}
