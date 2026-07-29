import { enemyById as currentEnemyById } from './enemyProductionDatabase.ts';

export type Stage1LegacyRuntimeKind = 'ENEMY' | 'BOSS' | 'STORY_RECORD';

export type Stage1SuccessorRelation =
  | 'EXACT_STAGE1_SUCCESSOR'
  | 'ROLE_STAGE1_SUCCESSOR'
  | 'MOVED_TO_OTHER_STAGE'
  | 'NO_CURRENT_SUCCESSOR';

export type Stage1LegacyRuntimeCompatibilityEntry = {
  legacyRuntimeId: string;
  legacyDisplayName: string;
  legacyKind: Stage1LegacyRuntimeKind;
  boardCellIds: string[];
  successorRelation: Stage1SuccessorRelation;
  currentProductionId?: string;
  acceptedCurrentIdForStage1Progress: boolean;
  preserveLegacyId: true;
  autoRenameDisplay: false;
  notes: string;
};

export const stage1LegacyRuntimeCompatibilityEntries: Stage1LegacyRuntimeCompatibilityEntry[] = [
  {
    legacyRuntimeId: 'ink_shadow',
    legacyDisplayName: 'しずくオンブラ',
    legacyKind: 'ENEMY',
    boardCellIds: ['fs_001_release_ink_shadow'],
    successorRelation: 'EXACT_STAGE1_SUCCESSOR',
    currentProductionId: 'ombu_small_ink',
    acceptedCurrentIdForStage1Progress: true,
    preserveLegacyId: true,
    autoRenameDisplay: false,
    notes: 'Stage1の基準となる黒インク小型影。旧IDを保存しつつCurrent IDも同じ達成へ読める。',
  },
  {
    legacyRuntimeId: 'paper_scrap_shadow',
    legacyDisplayName: 'せかしオンブラ',
    legacyKind: 'ENEMY',
    boardCellIds: ['fs_002_release_paper_scrap_shadow'],
    successorRelation: 'MOVED_TO_OTHER_STAGE',
    currentProductionId: 'ombu_small_paper',
    acceptedCurrentIdForStage1Progress: false,
    preserveLegacyId: true,
    autoRenameDisplay: false,
    notes: '紙片モチーフはCurrent48に残るが、Current Stage1 affinityではないためStage1達成へ自動流用しない。',
  },
  {
    legacyRuntimeId: 'lost_direction',
    legacyDisplayName: 'まどいオンブラ',
    legacyKind: 'ENEMY',
    boardCellIds: [],
    successorRelation: 'MOVED_TO_OTHER_STAGE',
    currentProductionId: 'ombu_small_compass',
    acceptedCurrentIdForStage1Progress: false,
    preserveLegacyId: true,
    autoRenameDisplay: false,
    notes: '方位モチーフはCurrent Stage4へ移動している。旧Stage1 runtime履歴としてのみ保持する。',
  },
  {
    legacyRuntimeId: 'black_capsule',
    legacyDisplayName: 'かぎオンブラ',
    legacyKind: 'ENEMY',
    boardCellIds: [],
    successorRelation: 'MOVED_TO_OTHER_STAGE',
    currentProductionId: 'ombu_small_keyhole',
    acceptedCurrentIdForStage1Progress: false,
    preserveLegacyId: true,
    autoRenameDisplay: false,
    notes: '鍵穴モチーフはCurrent Stage3へ移動している。旧Stage1 runtime履歴としてのみ保持する。',
  },
  {
    legacyRuntimeId: 'night_haze',
    legacyDisplayName: 'にじみオンブラ',
    legacyKind: 'ENEMY',
    boardCellIds: ['fs_003_release_night_haze'],
    successorRelation: 'NO_CURRENT_SUCCESSOR',
    acceptedCurrentIdForStage1Progress: false,
    preserveLegacyId: true,
    autoRenameDisplay: false,
    notes: 'Current48に同一または明確な役割後継を確認できない。推測で別Enemyへ結ばない。',
  },
  {
    legacyRuntimeId: 'black_label_shadow',
    legacyDisplayName: 'くろよオンブロ',
    legacyKind: 'ENEMY',
    boardCellIds: ['fs_004_release_black_label_shadow', 'fs_024_release_onbro_fast'],
    successorRelation: 'ROLE_STAGE1_SUCCESSOR',
    currentProductionId: 'omburo_ink_arm',
    acceptedCurrentIdForStage1Progress: true,
    preserveLegacyId: true,
    autoRenameDisplay: false,
    notes: '同一の名前・物体ではないが、Current Stage1の中型重量圧力役を継ぐ。表示名はruntime移行まで自動変更しない。',
  },
  {
    legacyRuntimeId: 'bag_yorishiro',
    legacyDisplayName: 'かばんヨリシロ',
    legacyKind: 'BOSS',
    boardCellIds: ['fs_005_calm_bag_yorishiro', 'fs_023_calm_yorishiro_with_ultimate'],
    successorRelation: 'ROLE_STAGE1_SUCCESSOR',
    currentProductionId: 'boss_name_without_owner',
    acceptedCurrentIdForStage1Progress: true,
    preserveLegacyId: true,
    autoRenameDisplay: false,
    notes: 'Current Stage1 boss役は「持ち主のない名前」。旧boss IDの完了を失わず、新IDも同じ達成へ読める。',
  },
  {
    legacyRuntimeId: 'yanushi_nemori',
    legacyDisplayName: '夜主 ネモリ',
    legacyKind: 'STORY_RECORD',
    boardCellIds: ['fs_025_view_nemori_record'],
    successorRelation: 'NO_CURRENT_SUCCESSOR',
    acceptedCurrentIdForStage1Progress: false,
    preserveLegacyId: true,
    autoRenameDisplay: false,
    notes: 'Current21・Current48・Current Stage1 spineに後継がない。旧記録を消さず、Current分母へ自動採用しない。',
  },
];

export const stage1LegacyRuntimeCompatibilityById = new Map(
  stage1LegacyRuntimeCompatibilityEntries.map((entry) => [entry.legacyRuntimeId, entry]),
);

export const stage1LegacyRuntimeCompatibilityByBoardCellId = new Map(
  stage1LegacyRuntimeCompatibilityEntries.flatMap((entry) =>
    entry.boardCellIds.map((cellId) => [cellId, entry] as const),
  ),
);

export function getAcceptedStage1ProgressIds(legacyRuntimeId: string): string[] {
  const entry = stage1LegacyRuntimeCompatibilityById.get(legacyRuntimeId);
  if (!entry) return [legacyRuntimeId];
  if (!entry.acceptedCurrentIdForStage1Progress || !entry.currentProductionId) {
    return [legacyRuntimeId];
  }
  return [legacyRuntimeId, entry.currentProductionId];
}

export function hasReleasedStage1LegacyTarget(
  legacyRuntimeId: string,
  cumulativeDefeats: Record<string, number>,
  runDefeats: Record<string, number>,
): boolean {
  return getAcceptedStage1ProgressIds(legacyRuntimeId).some(
    (id) => (cumulativeDefeats[id] ?? 0) > 0 || (runDefeats[id] ?? 0) > 0,
  );
}

export function hasCalmedStage1LegacyTarget(
  legacyRuntimeId: string,
  calmedIds: readonly string[],
): boolean {
  const calmed = new Set(calmedIds);
  return getAcceptedStage1ProgressIds(legacyRuntimeId).some((id) => calmed.has(id));
}

export type Stage1LegacyRuntimeCompatibilityValidationResult = {
  errors: string[];
  warnings: string[];
};

export function validateStage1LegacyRuntimeCompatibility(): Stage1LegacyRuntimeCompatibilityValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const legacyIds = new Set<string>();
  const boardCellIds = new Set<string>();

  for (const entry of stage1LegacyRuntimeCompatibilityEntries) {
    if (legacyIds.has(entry.legacyRuntimeId)) {
      errors.push(`duplicate legacy runtime id: ${entry.legacyRuntimeId}`);
    }
    legacyIds.add(entry.legacyRuntimeId);

    for (const cellId of entry.boardCellIds) {
      if (boardCellIds.has(cellId)) {
        errors.push(`duplicate legacy board-cell binding: ${cellId}`);
      }
      boardCellIds.add(cellId);
    }

    const current = entry.currentProductionId
      ? currentEnemyById.get(entry.currentProductionId)
      : undefined;

    if (entry.currentProductionId && !current) {
      errors.push(`${entry.legacyRuntimeId} references missing Current48 id ${entry.currentProductionId}`);
      continue;
    }

    if (entry.successorRelation === 'NO_CURRENT_SUCCESSOR' && entry.currentProductionId) {
      errors.push(`${entry.legacyRuntimeId} cannot have a Current48 id with NO_CURRENT_SUCCESSOR`);
    }
    if (entry.successorRelation !== 'NO_CURRENT_SUCCESSOR' && !entry.currentProductionId) {
      errors.push(`${entry.legacyRuntimeId} requires a Current48 id for ${entry.successorRelation}`);
    }

    const acceptsCurrent = entry.acceptedCurrentIdForStage1Progress;
    const stage1Successor =
      entry.successorRelation === 'EXACT_STAGE1_SUCCESSOR' ||
      entry.successorRelation === 'ROLE_STAGE1_SUCCESSOR';
    if (acceptsCurrent !== stage1Successor) {
      errors.push(`${entry.legacyRuntimeId} acceptedCurrentIdForStage1Progress does not match successor relation`);
    }

    if (current) {
      const isStage1Affinity = current.stageAffinity.includes('forgotten_street');
      if (stage1Successor && !isStage1Affinity) {
        errors.push(`${entry.legacyRuntimeId} successor ${current.id} is not a Current Stage1 affinity`);
      }
      if (entry.successorRelation === 'MOVED_TO_OTHER_STAGE' && isStage1Affinity) {
        errors.push(`${entry.legacyRuntimeId} is marked moved but ${current.id} still has Current Stage1 affinity`);
      }
      if (entry.legacyKind === 'BOSS' && current.rank !== 'boss') {
        errors.push(`${entry.legacyRuntimeId} boss successor ${current.id} must have boss rank`);
      }
      if (entry.legacyKind === 'ENEMY' && current.rank === 'boss') {
        errors.push(`${entry.legacyRuntimeId} enemy successor ${current.id} must not have boss rank`);
      }
    }

    if (entry.autoRenameDisplay) {
      errors.push(`${entry.legacyRuntimeId} must not auto-rename display before runtime migration evidence`);
    }
    if (entry.successorRelation === 'ROLE_STAGE1_SUCCESSOR') {
      warnings.push(`${entry.legacyRuntimeId} uses a role successor rather than identical object continuity`);
    }
  }

  return { errors, warnings };
}
