import { describe, expect, it } from 'vitest';
import {
  allLightsCompletionDraftSpecification,
  claimAllLightsReward,
  evaluateAllLightsCompletion,
  type AllLightsCompletionSpecification,
} from './allLightsCompletion';
import { migrateCollectionProgressSaveToV2 } from './collectionProgressSaveV2';

const frozenSpecification: AllLightsCompletionSpecification = {
  version: 'launch-v1',
  runtimeFrozen: true,
  groups: [
    { id: 'night_roads', displayName: '夜路', requiredIds: ['stage:1', 'stage:2'] },
    { id: 'keepers', displayName: '灯し手', requiredIds: ['character:yui'] },
  ],
};

describe('all lights completion', () => {
  it('Current draftは見かけ上空配列でもfail-closedでLOCKED', () => {
    const save = migrateCollectionProgressSaveToV2({});
    expect(evaluateAllLightsCompletion(allLightsCompletionDraftSpecification, save)).toEqual({
      state: 'LOCKED',
      reason: 'DENOMINATOR_NOT_FROZEN',
      missingByGroup: {},
    });
  });

  it('frozen specで不足項目をgroup別に返す', () => {
    const save = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      completion: {
        groupStates: {
          night_roads: { completedIds: ['stage:1'], claimed: false },
          keepers: { completedIds: [], claimed: false },
        },
      },
    });

    expect(evaluateAllLightsCompletion(frozenSpecification, save)).toEqual({
      state: 'INCOMPLETE',
      reason: 'REQUIREMENTS_INCOMPLETE',
      missingByGroup: {
        night_roads: ['stage:2'],
        keepers: ['character:yui'],
      },
    });
  });

  it('group state自体が欠けた場合もeligibleにしない', () => {
    const save = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      completion: {
        groupStates: {
          night_roads: { completedIds: ['stage:1', 'stage:2'], claimed: false },
        },
      },
    });
    delete save.completion.groupStates.keepers;

    const result = evaluateAllLightsCompletion(frozenSpecification, save);
    expect(result.state).toBe('INCOMPLETE');
    expect(result.reason).toBe('MISSING_GROUP_STATE');
    expect(result.missingByGroup.keepers).toEqual(['character:yui']);
  });

  it('全required IDが揃った時だけELIGIBLE', () => {
    const save = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      completion: {
        groupStates: {
          night_roads: {
            completedIds: ['stage:2', 'stage:1', 'stage:1'],
            claimed: false,
          },
          keepers: { completedIds: ['character:yui'], claimed: false },
        },
      },
    });

    expect(evaluateAllLightsCompletion(frozenSpecification, save)).toEqual({
      state: 'ELIGIBLE',
      reason: 'ALL_REQUIREMENTS_COMPLETE',
      missingByGroup: {},
    });
  });

  it('claimはeligible時だけ行い元saveを破壊しない', () => {
    const save = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      completion: {
        groupStates: {
          night_roads: { completedIds: ['stage:1', 'stage:2'], claimed: false },
          keepers: { completedIds: ['character:yui'], claimed: false },
        },
      },
    });

    const result = claimAllLightsReward(frozenSpecification, save);
    expect(result.claimed).toBe(true);
    expect(result.save).not.toBe(save);
    expect(save.completion.completionRewardClaimed).toBe(false);
    expect(result.save.completion.completionRewardClaimed).toBe(true);
    expect(result.save.completion.hundredPercentState).toBe('CLAIMED');
  });

  it('claimはidempotentで二重取得しない', () => {
    const claimedSave = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      completion: {
        groupStates: {
          night_roads: { completedIds: ['stage:1', 'stage:2'], claimed: true },
          keepers: { completedIds: ['character:yui'], claimed: true },
        },
        hundredPercentState: 'CLAIMED',
        completionRewardClaimed: true,
      },
    });

    const result = claimAllLightsReward(frozenSpecification, claimedSave);
    expect(result.claimed).toBe(false);
    expect(result.save).toBe(claimedSave);
    expect(result.evaluation.state).toBe('CLAIMED');
  });

  it('claimed flagだけでは不足要件を迂回できない', () => {
    const save = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      completion: {
        groupStates: {
          night_roads: { completedIds: [], claimed: true },
          keepers: { completedIds: [], claimed: true },
        },
        hundredPercentState: 'CLAIMED',
        completionRewardClaimed: true,
      },
    });

    const evaluation = evaluateAllLightsCompletion(frozenSpecification, save);
    expect(evaluation.state).toBe('INCOMPLETE');
    expect(evaluation.reason).toBe('REQUIREMENTS_INCOMPLETE');
  });
});
