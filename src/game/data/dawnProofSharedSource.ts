import {
  forgottenStreetNightBoardCells,
  type NightBoardCell,
  type NightBoardCellKind,
} from './collectionProgress.ts';

export type DawnProofClass =
  | 'STANDARD_CLEAR'
  | 'CONSTRAINT_CLEAR'
  | 'MASTERY_CLEAR'
  | 'SECRET_CLEAR';

export type DawnProofRecord = {
  id: string;
  sourceAuthority: 'src/game/data/collectionProgress.ts';
  sourceBoardId: string;
  sourceCellId: string;
  sourceCellKind: NightBoardCellKind;
  proofClass: DawnProofClass;
  sourceCondition: string;
  sourceRewardType: NightBoardCell['reward']['type'];
  display: {
    titleBeforeReveal: string;
    titleAfterReveal: string;
    hintBeforeReveal: string | null;
    secretUntilRevealed: boolean;
  };
  semanticBoundary: {
    provesGameplayDawnCondition: true;
    narrativeMorningSceneInferred: false;
    productionStageIdInferred: false;
    endingAuthority: false;
    trueEndRequirement: false;
    physicalPurchaseRequirement: false;
  };
  generation: {
    candidatePageArtAllowed: false;
    generatedNarrativeSceneAllowed: false;
    generatedReadableTextAllowed: false;
    oneShotFinalForbidden: true;
  };
};

function proofClass(cell: NightBoardCell): DawnProofClass {
  if (cell.kind === 'secret') return 'SECRET_CLEAR';
  if (cell.kind === 'mastery') return 'MASTERY_CLEAR';
  if (cell.id === 'fs_006_clear_depth_1') return 'STANDARD_CLEAR';
  return 'CONSTRAINT_CLEAR';
}

function isDirectDawnProof(cell: NightBoardCell): boolean {
  return cell.condition.includes('夜明けする');
}

function normalizeDawnProof(cell: NightBoardCell): DawnProofRecord {
  const secret = cell.kind === 'secret';
  return {
    id: `dawn-proof:${cell.id}`,
    sourceAuthority: 'src/game/data/collectionProgress.ts',
    sourceBoardId: cell.boardId,
    sourceCellId: cell.id,
    sourceCellKind: cell.kind,
    proofClass: proofClass(cell),
    sourceCondition: cell.condition,
    sourceRewardType: cell.reward.type,
    display: {
      titleBeforeReveal: secret ? (cell.hiddenTitle ?? '？？？') : cell.title,
      titleAfterReveal: cell.title,
      hintBeforeReveal: secret ? (cell.hint ?? null) : null,
      secretUntilRevealed: secret,
    },
    semanticBoundary: {
      provesGameplayDawnCondition: true,
      narrativeMorningSceneInferred: false,
      productionStageIdInferred: false,
      endingAuthority: false,
      trueEndRequirement: false,
      physicalPurchaseRequirement: false,
    },
    generation: {
      candidatePageArtAllowed: false,
      generatedNarrativeSceneAllowed: false,
      generatedReadableTextAllowed: false,
      oneShotFinalForbidden: true,
    },
  };
}

/**
 * Stage1 Current source only.
 *
 * This intentionally selects direct `夜明けする` gameplay conditions rather than
 * converting all 25 Night Board cells into Dawn records. These records are proof
 * of a clear condition, not narrative morning scenes, endings, or Stage Canon.
 */
export const dawnProofRecords: readonly DawnProofRecord[] = forgottenStreetNightBoardCells
  .filter(isDirectDawnProof)
  .map(normalizeDawnProof);

export const dawnProofRecordById = new Map(dawnProofRecords.map((record) => [record.id, record]));
export const dawnProofRecordBySourceCellId = new Map(dawnProofRecords.map((record) => [record.sourceCellId, record]));

export const dawnProofSharedSourceSummary = {
  sourceBoardCellCount: forgottenStreetNightBoardCells.length,
  directDawnProofCount: dawnProofRecords.length,
  standardClearCount: dawnProofRecords.filter((record) => record.proofClass === 'STANDARD_CLEAR').length,
  constraintClearCount: dawnProofRecords.filter((record) => record.proofClass === 'CONSTRAINT_CLEAR').length,
  masteryClearCount: dawnProofRecords.filter((record) => record.proofClass === 'MASTERY_CLEAR').length,
  secretClearCount: dawnProofRecords.filter((record) => record.proofClass === 'SECRET_CLEAR').length,
  allRecordsNarrativeSceneInferred: dawnProofRecords.every((record) => record.semanticBoundary.narrativeMorningSceneInferred),
  allRecordsEndingAuthority: dawnProofRecords.every((record) => record.semanticBoundary.endingAuthority),
  canGeneratePageArtNow: false,
  productionStageRelationFrozen: false,
} as const;
