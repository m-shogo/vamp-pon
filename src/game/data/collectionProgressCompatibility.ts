import {
  forgottenStreetNightBoard,
  type NightBoardCell,
} from './collectionProgress';
import { normalizeLegacyDisplayTerm } from './namedObjectReadModels';

export type NightBoardCellMigrationClass =
  | 'KEEP'
  | 'RENAME_DISPLAY_ONLY'
  | 'REVIEW_ENEMY_REBIND';

const LEGACY_ENEMY_CELL_IDS = new Set([
  'fs_001_release_ink_shadow',
  'fs_002_release_paper_scrap_shadow',
  'fs_003_release_night_haze',
  'fs_004_release_black_label_shadow',
  'fs_005_calm_bag_yorishiro',
  'fs_024_release_onbro_fast',
]);

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
};

function classifyCell(cell: NightBoardCell): NightBoardCellMigrationClass {
  if (LEGACY_ENEMY_CELL_IDS.has(cell.id)) {
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
    return {
      ...cell,
      originalTitle,
      originalCondition,
      migrationClass: classifyCell(cell),
      currentDisplayTitle: normalizeLegacyDisplayTerm(cell.title),
      currentDisplayCondition: normalizeLegacyDisplayTerm(cell.condition),
    };
  });

export const forgottenStreetNightBoardCompatibility = {
  id: forgottenStreetNightBoard.id,
  name: forgottenStreetNightBoard.name,
  width: forgottenStreetNightBoard.width,
  height: forgottenStreetNightBoard.height,
  definitionVersion: 'stage1-compat-v1',
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
} as const;
