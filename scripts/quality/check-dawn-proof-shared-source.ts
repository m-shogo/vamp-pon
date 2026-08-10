import { readFileSync } from 'node:fs';

import { forgottenStreetNightBoardCells } from '../../src/game/data/collectionProgress.ts';
import {
  dawnProofRecordBySourceCellId,
  dawnProofRecords,
  dawnProofSharedSourceSummary,
} from '../../src/game/data/dawnProofSharedSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Dawn Proof Shared Source] ${message}`);
}

const expectedSourceCellIds = [
  'fs_006_clear_depth_1',
  'fs_007_clear_depth_1_high_hp',
  'fs_008_clear_depth_1_no_black_form',
  'fs_009_clear_depth_1_fast',
  'fs_018_clear_low_hp',
  'fs_021_clear_single_weapon',
  'fs_022_clear_with_1_hp',
] as const;

assert(forgottenStreetNightBoardCells.length === 25, 'Stage1 Night Board source count drift');
assert(dawnProofRecords.length === expectedSourceCellIds.length, `direct Dawn proof count drift: ${dawnProofRecords.length}`);
assert(JSON.stringify(dawnProofRecords.map((record) => record.sourceCellId)) === JSON.stringify(expectedSourceCellIds), 'direct Dawn proof ID/order drift');
assert(new Set(dawnProofRecords.map((record) => record.id)).size === dawnProofRecords.length, 'duplicate Dawn proof ID');

for (const record of dawnProofRecords) {
  const source = forgottenStreetNightBoardCells.find((cell) => cell.id === record.sourceCellId);
  assert(source, `${record.id}: source cell missing`);
  assert(source.condition.includes('夜明けする'), `${record.id}: non-Dawn condition normalized`);
  assert(record.sourceCondition === source.condition, `${record.id}: condition drift`);
  assert(record.sourceBoardId === source.boardId, `${record.id}: board relation drift`);
  assert(record.sourceCellKind === source.kind, `${record.id}: cell-kind drift`);
  assert(record.sourceRewardType === source.reward.type, `${record.id}: reward relation drift`);
  assert(record.semanticBoundary.provesGameplayDawnCondition === true, `${record.id}: proof semantic missing`);
  assert(record.semanticBoundary.narrativeMorningSceneInferred === false, `${record.id}: narrative scene inferred`);
  assert(record.semanticBoundary.productionStageIdInferred === false, `${record.id}: production Stage inferred`);
  assert(record.semanticBoundary.endingAuthority === false, `${record.id}: ending authority inferred`);
  assert(record.semanticBoundary.trueEndRequirement === false, `${record.id}: True End requirement inferred`);
  assert(record.semanticBoundary.physicalPurchaseRequirement === false, `${record.id}: physical purchase requirement inferred`);
  assert(record.generation.candidatePageArtAllowed === false, `${record.id}: page-art generation inferred`);
  assert(record.generation.generatedNarrativeSceneAllowed === false, `${record.id}: narrative image generation inferred`);
  assert(record.generation.generatedReadableTextAllowed === false, `${record.id}: generated text inferred`);
  assert(record.generation.oneShotFinalForbidden === true, `${record.id}: one-shot-final guard missing`);

  if (source.kind === 'secret') {
    assert(record.display.secretUntilRevealed === true, `${record.id}: secret reveal boundary missing`);
    assert(record.display.titleBeforeReveal === '？？？', `${record.id}: secret title leaked before reveal`);
    assert(record.display.hintBeforeReveal === source.hint, `${record.id}: secret hint drift`);
  } else {
    assert(record.display.secretUntilRevealed === false, `${record.id}: non-secret incorrectly hidden`);
    assert(record.display.titleBeforeReveal === source.title, `${record.id}: public title drift`);
  }
  assert(record.display.titleAfterReveal === source.title, `${record.id}: revealed title drift`);
}

const nonDawnCells = forgottenStreetNightBoardCells.filter((cell) => !cell.condition.includes('夜明けする'));
for (const cell of nonDawnCells) {
  assert(!dawnProofRecordBySourceCellId.has(cell.id), `${cell.id}: non-Dawn board cell leaked into Dawn proof inventory`);
}

assert(dawnProofSharedSourceSummary.sourceBoardCellCount === 25, 'summary board source count drift');
assert(dawnProofSharedSourceSummary.directDawnProofCount === 7, 'summary direct Dawn proof count drift');
assert(dawnProofSharedSourceSummary.standardClearCount === 1, 'standard clear count drift');
assert(dawnProofSharedSourceSummary.constraintClearCount === 3, 'constraint clear count drift');
assert(dawnProofSharedSourceSummary.masteryClearCount === 1, 'mastery clear count drift');
assert(dawnProofSharedSourceSummary.secretClearCount === 2, 'secret clear count drift');
assert(dawnProofSharedSourceSummary.allRecordsNarrativeSceneInferred === false, 'narrative-scene summary drift');
assert(dawnProofSharedSourceSummary.allRecordsEndingAuthority === false, 'ending-authority summary drift');
assert(dawnProofSharedSourceSummary.canGeneratePageArtNow === false, 'Dawn page-art generation inferred');
assert(dawnProofSharedSourceSummary.productionStageRelationFrozen === false, 'production Stage relation inferred');

const allLightsSource = readFileSync('src/game/data/allLightsCompletion.ts', 'utf8');
assert(/runtimeFrozen: false/.test(allLightsSource), 'All Lights runtimeFrozen=false boundary drift');

console.log('Dawn Proof Shared Source: PASS (Stage1 board=25, directDawnProof=7, standard=1, constraint=3, mastery=1, secret=2, pageArt=false)');
