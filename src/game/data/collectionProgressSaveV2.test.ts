import { describe, expect, it } from 'vitest';
import { migrateCollectionProgressSaveToV2 } from './collectionProgressSaveV2';

describe('collection progress save v2 migration', () => {
  it('v1 saveを保持してv2 draftへ包む', () => {
    const migrated = migrateCollectionProgressSaveToV2({
      seenEnemyIds: ['enemy-a'],
      defeatedEnemyCounts: { 'enemy-a': 12 },
      calmedBossIds: ['boss-a'],
      discoveredLostItemIds: ['lost-small-bag-tag'],
      unlockedMemoryTextIds: ['memory-a'],
      nightBoard: {
        completedCellIds: ['fs_001_release_ink_shadow'],
        claimedCellIds: ['fs_001_release_ink_shadow'],
        revealedCellIds: ['fs_001_release_ink_shadow', 'fs_002_release_paper_scrap_shadow'],
        hintedCellIds: [],
      },
    });

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.seenEnemyIds).toEqual(['enemy-a']);
    expect(migrated.defeatedEnemyCounts).toEqual({ 'enemy-a': 12 });
    expect(migrated.nightBoard.completedCellIds).toEqual(['fs_001_release_ink_shadow']);
    expect(migrated.nightBoard.nodeDefinitionVersion).toBe('stage1-compat-v2');
    expect(migrated.migration).toEqual({
      sourceSchemaVersion: 1,
      runtimeConnectionState: 'DRAFT_NOT_CONNECTED',
    });
  });

  it('壊れた値を安全に正規化し重複を除く', () => {
    const migrated = migrateCollectionProgressSaveToV2({
      schemaVersion: 1,
      seenEnemyIds: ['enemy-a', ' enemy-a ', 4, '', 'enemy-b'],
      defeatedEnemyCounts: {
        'enemy-a': 2.9,
        'enemy-b': -4,
        'enemy-c': Number.NaN,
        '': 10,
      },
      nightBoard: {
        completedCellIds: ['fs_006_clear_depth_1', 'fs_006_clear_depth_1', null],
        claimedCellIds: 'not-an-array',
      },
    });

    expect(migrated.seenEnemyIds).toEqual(['enemy-a', 'enemy-b']);
    expect(migrated.defeatedEnemyCounts).toEqual({ 'enemy-a': 2, 'enemy-b': 0 });
    expect(migrated.nightBoard.completedCellIds).toEqual(['fs_006_clear_depth_1']);
    expect(migrated.nightBoard.claimedCellIds).toEqual([]);
  });

  it('未知の旧cell IDを元配列から消さず隔離一覧にも残す', () => {
    const migrated = migrateCollectionProgressSaveToV2({
      nightBoard: {
        completedCellIds: ['fs_006_clear_depth_1', 'legacy-cell-x'],
        claimedCellIds: ['legacy-cell-x'],
        revealedCellIds: ['legacy-cell-y'],
        hintedCellIds: ['legacy-cell-z'],
      },
    });

    expect(migrated.nightBoard.completedCellIds).toContain('legacy-cell-x');
    expect(migrated.nightBoard.claimedCellIds).toContain('legacy-cell-x');
    expect(migrated.nightBoard.revealedCellIds).toContain('legacy-cell-y');
    expect(migrated.nightBoard.hintedCellIds).toContain('legacy-cell-z');
    expect(migrated.nightBoard.unknownLegacyCellIds).toEqual([
      'legacy-cell-x',
      'legacy-cell-y',
      'legacy-cell-z',
    ]);
  });

  it('未知のcompletion groupも失わず保存する', () => {
    const migrated = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      completion: {
        groupStates: {
          night_roads: { completedIds: ['stage:1'], claimed: false },
          'legacy-group-x': { completedIds: ['legacy-a'], claimed: true },
        },
      },
    });

    expect(migrated.completion.groupStates.night_roads).toEqual({
      completedIds: ['stage:1'],
      claimed: false,
    });
    expect(migrated.completion.groupStates['legacy-group-x']).toEqual({
      completedIds: ['legacy-a'],
      claimed: true,
    });
    expect(migrated.completion.unknownLegacyGroupIds).toEqual(['legacy-group-x']);
  });

  it('stateがまだ無い明示的unknownLegacyGroupIdsも消さない', () => {
    const migrated = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      completion: {
        groupStates: {
          night_roads: { completedIds: ['stage:1'], claimed: false },
          'legacy-group-x': { completedIds: ['legacy-a'], claimed: true },
        },
        unknownLegacyGroupIds: [
          'legacy-group-without-state',
          ' legacy-group-x ',
          'legacy-group-without-state',
        ],
      },
    });

    expect(migrated.completion.unknownLegacyGroupIds).toEqual([
      'legacy-group-without-state',
      'legacy-group-x',
    ]);
    expect(migrated.completion.groupStates['legacy-group-without-state']).toBeUndefined();
  });

  it('v1から100%や報酬を自動解放しない', () => {
    const migrated = migrateCollectionProgressSaveToV2({
      completion: {
        hundredPercentState: 'CLAIMED',
        completionRewardClaimed: true,
      },
    });

    expect(migrated.completion.hundredPercentState).toBe('LOCKED');
    expect(migrated.completion.completionRewardClaimed).toBe(false);
  });

  it('既存v2 saveは有効な状態を保ち再移行しても同じになる', () => {
    const initial = migrateCollectionProgressSaveToV2({
      schemaVersion: 2,
      seenEnemyIds: ['enemy-a'],
      nightBoard: {
        completedCellIds: ['fs_006_clear_depth_1', 'legacy-cell-x'],
        claimedCellIds: [],
        revealedCellIds: [],
        hintedCellIds: [],
        boardVersion: 'forgotten-street-v1',
        nodeDefinitionVersion: 'stage1-compat-v1',
        connectedObjectIds: ['named-object:yui:luminous_possession'],
        unknownLegacyCellIds: ['legacy-cell-x'],
      },
      completion: {
        definitionVersion: 'design-v1',
        groupStates: {
          night_roads: { completedIds: ['stage:1'], claimed: true },
        },
        unknownLegacyGroupIds: ['legacy-group-without-state'],
        hundredPercentState: 'ELIGIBLE',
        completionRewardClaimed: false,
      },
    });
    const migratedAgain = migrateCollectionProgressSaveToV2(initial);

    expect(migratedAgain).toEqual(initial);
    expect(migratedAgain.completion.hundredPercentState).toBe('ELIGIBLE');
    expect(migratedAgain.completion.completionRewardClaimed).toBe(false);
    expect(migratedAgain.completion.unknownLegacyGroupIds).toEqual([
      'legacy-group-without-state',
    ]);
  });

  it('全known completion groupを空state付きで用意する', () => {
    const migrated = migrateCollectionProgressSaveToV2({});
    expect(Object.keys(migrated.completion.groupStates)).toEqual([
      'night_roads',
      'keepers',
      'item_lineages',
      'kagemono',
      'bonds',
      'night_margin',
    ]);
    for (const state of Object.values(migrated.completion.groupStates)) {
      expect(state).toEqual({ completedIds: [], claimed: false });
    }
  });
});
