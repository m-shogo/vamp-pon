import {
  forgottenStreetNightBoard,
  type NightBoardCell,
} from './collectionProgress';
import { normalizeLegacyDisplayTerm } from './namedObjectReadModels';
import {
  stage1LegacyRuntimeCompatibilityByBoardCellId,
  type Stage1LegacyRuntimeCompatibilityEntry,
} from './stage1LegacyRuntimeCompatibility';

export type NightBoardCellMigrationClass =
  | 'KEEP'
  | 'RENAME_DISPLAY_ONLY'
  | 'REVIEW_ENEMY_REBIND'
  | 'REVIEW_LEGACY_STORY_BINDING';

const DISPLAY_ONLY_CELL_IDS = new Set([
  'fs_008_clear_depth_1_no_black_form',
]);

const LEGACY_DISPLAY_OVERRIDES: Record<string, Partial<Pick<NightBoardCell, 'title' | 'condition'>>> = {
  fs_008_clear_depth_1_no_black_form: {
    condition: '忘れ物通り 深度1を黒曜化なしで夜明けする',
  },
};

export type CompatibleNightBoardCell = NightBoardCell & {
  originalTitle: string;
  originalCondition: string;
  migrationClass: NightBoardCellMigrationClass;
  currentDisplayTitle: string;
  currentDisplayCondition: string;
  legacyRuntimeBinding?: Stage1LegacyRuntimeCompatibilityEntry;
};

function classifyCell(cell: NightBoardCell): NightBoardCellMigrationClass {
  const legacyBinding = stage1LegacyRuntimeCompatibilityByBoardCellId.get(cell.id);
  if (legacyBinding?.legacyKind === 'STORY_RECORD') {
    return 'REVIEW_LEGACY_STORY_BINDING';
  }
  if (legacyBinding) {
    return 'REVIEW_ENEMY_REBIND';
  }
  if (DISPLAY_ONLY_CELL_IDS.has(cell.id)) {
    return 'RENAME_DISPLAY_ONLY';
  }
  return 'KEEP';
}

export const forgottenStreetCompatibleCells: CompatibleNightBoardCell[] =
  forgottenStreetNightBoard.cells.map((cell) => {
    const legacy = LEGACY_DISPLAY_OVERRIDES[cell.id];
    const originalTitle = legacy?.title ?? cell.title;
    const originalCondition = legacy?.condition ?? cell.condition;
    const legacyRuntimeBinding = stage1LegacyRuntimeCompatibilityByBoardCellId.get(cell.id);
    return {
      ...cell,
      originalTitle,
      originalCondition,
      migrationClass: classifyCell(cell),
      currentDisplayTitle: normalizeLegacyDisplayTerm(cell.title),
      currentDisplayCondition: normalizeLegacyDisplayTerm(cell.condition),
      legacyRuntimeBinding,
    };
  });

export const forgottenStreetNightBoardCompatibility = {
  id: forgottenStreetNightBoard.id,
  name: forgottenStreetNightBoard.name,
  width: forgottenStreetNightBoard.width,
  height: forgottenStreetNightBoard.height,
  definitionVersion: 'stage1-compat-v2',
  saveMigrationApplied: false,
  cells: forgottenStreetCompatibleCells,
} as const;

export const forgottenStreetCompatibilitySummary = {
  total: forgottenStreetCompatibleCells.length,
  keep: forgottenStreetCompatibleCells.filter((cell) => cell.migrationClass === 'KEEP').length,
  renameDisplayOnly: forgottenStreetCompatibleCells.filter(
    (cell) => cell.migrationClass === 'RENAME_DISPLAY_ONLY',
  ).length,
  reviewEnemyRebind: forgottenStreetCompatibleCells.filter(
    (cell) => cell.migrationClass === 'REVIEW_ENEMY_REBIND',
  ).length,
  reviewLegacyStoryBinding: forgottenStreetCompatibleCells.filter(
    (cell) => cell.migrationClass === 'REVIEW_LEGACY_STORY_BINDING',
  ).length,
  exactStage1SuccessorCells: forgottenStreetCompatibleCells.filter(
    (cell) => cell.legacyRuntimeBinding?.successorRelation === 'EXACT_STAGE1_SUCCESSOR',
  ).length,
  roleStage1SuccessorCells: forgottenStreetCompatibleCells.filter(
    (cell) => cell.legacyRuntimeBinding?.successorRelation === 'ROLE_STAGE1_SUCCESSOR',
  ).length,
  movedToOtherStageCells: forgottenStreetCompatibleCells.filter(
    (cell) => cell.legacyRuntimeBinding?.successorRelation === 'MOVED_TO_OTHER_STAGE',
  ).length,
  noCurrentSuccessorCells: forgottenStreetCompatibleCells.filter(
    (cell) => cell.legacyRuntimeBinding?.successorRelation === 'NO_CURRENT_SUCCESSOR',
  ).length,
} as const;
