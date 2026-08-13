import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const masterPath = 'data/visual/character-design-feedback-recurrence-master-v1.json';
const ledgerPath = 'data/visual/character-design-feedback-ledger.json';
const exporterPath = 'tools/asset-factory/scripts/export-feedback-aware-character-design-prompt.ts';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[character-design-feedback-recurrence] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
const ledger = JSON.parse(readFileSync(resolve(root, ledgerPath), 'utf8'));
if (master.status !== 'TOP_LEVEL_POST_REVIEW_GENERATION_GOVERNANCE') fail('master status invalid');
if (master.scopeCount !== 36) fail('scopeCount must be 36');
if (master.generatedImageCreatesFeedbackRule !== false) fail('generated image rule guard weakened');
if (master.candidateReviewAutomaticallyChangesGeneration !== false) fail('candidate review auto-learning guard weakened');
if (master.assistantDiagnosisAutomaticallyChangesGeneration !== false) fail('assistant diagnosis auto-learning guard weakened');
if (master.singleReactionCreatesGlobalRule !== false) fail('single reaction global rule guard weakened');
if (ledger.status !== 'DESIGNER_LEARNING_NON_CANON') fail('ledger status invalid');
if (ledger.rules?.onlyActiveRecurrenceDirectivesMayModifyLaterGeneration !== true) fail('ledger ACTIVE-only guard missing');
if (ledger.rules?.generatedImageNeverCreatesRecurrenceDirective !== true) fail('generated image recurrence guard missing');
if (!Array.isArray(ledger.candidateReviews)) fail('candidateReviews must be array');
if (!Array.isArray(ledger.recurrenceDirectives)) fail('recurrenceDirectives must be array');

const ids: string[] = [];
for (const path of profilePaths) {
  const data = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  if (!Array.isArray(data.characters)) fail(`${path}: characters missing`);
  for (const character of data.characters) {
    if (!character.id) fail(`${path}: character id missing`);
    ids.push(character.id);
  }
}
if (ids.length !== 36) fail(`expected 36 production IDs, got ${ids.length}`);
if (new Set(ids).size !== 36) fail('production IDs are not unique');

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.feedbackRecurrenceGenerationEntrypoint !== true) fail(`${id}: feedback-aware final entrypoint missing`);
  if (exported.feedbackRecurrenceRequired !== true) fail(`${id}: feedback recurrence requirement missing`);
  if (exported.characterImageGenerationReadinessRequired !== true) fail(`${id}: lower readiness gate missing`);
  if (exported.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION') fail(`${id}: not READY`);
  if (exported.generatedImageCreatesFeedbackRule !== false) fail(`${id}: generated-image rule guard weakened`);
  if (exported.candidateReviewAutomaticallyChangesGeneration !== false) fail(`${id}: candidate review auto-learning guard weakened`);
  if (exported.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: generated output boundary weakened`);
  if (!Array.isArray(exported.activeFeedbackRecurrenceDirectives)) fail(`${id}: active directives missing`);
  if (exported.activeFeedbackRecurrenceDirectiveCount !== exported.activeFeedbackRecurrenceDirectives.length) fail(`${id}: active directive count mismatch`);
  if (!exported.authorityOrder.includes('docs/visual/character-design-feedback-recurrence-master-v1.md')) fail(`${id}: recurrence master missing from authority order`);
  if (!exported.authorityOrder.includes('data/visual/character-design-feedback-ledger.json')) fail(`${id}: feedback ledger missing from authority order`);
  if (!exported.prompt.includes('CHARACTER DESIGN FEEDBACK RECURRENCE MASTER — REVIEWED LEARNING, LOWER THAN CANON AUTHORITIES.')) fail(`${id}: recurrence prompt block missing`);
}

if (ledger.recurrenceDirectives.length === 0) {
  const probe = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath), '--character', ids[0], '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const exported = JSON.parse(probe);
  if (exported.activeFeedbackRecurrenceDirectiveCount !== 0) fail('empty ledger unexpectedly applied directive');
  if (!exported.prompt.includes('NONE — no ACTIVE reviewed recurrence directive applies to this character.')) fail('empty directive state not explicit');
}

console.log(`[character-design-feedback-recurrence] OK: ${ids.length}/36 feedback-aware READY prompts; active directives=${ledger.recurrenceDirectives.filter((x: any) => x?.state === 'ACTIVE').length}`);
