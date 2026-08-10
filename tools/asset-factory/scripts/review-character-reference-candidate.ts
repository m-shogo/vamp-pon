import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import {
  CHARACTER_REFERENCE_CANDIDATE_POLICY,
  type CharacterReferenceCandidateDecision,
  type CharacterReferenceCandidateRecord,
  type CharacterReferenceManualReview,
} from '../../../src/game/data/characterReferenceCandidateIntake.ts';

type ReviewField = Exclude<keyof CharacterReferenceManualReview, 'notes'>;

type CliOptions = {
  characterId: string;
  candidateFile: string | null;
  decision: CharacterReferenceCandidateDecision | null;
  notes: string | null;
  sets: Array<{ field: ReviewField; value: boolean | null }>;
};

const allowedReviewFields = new Set<ReviewField>(
  CHARACTER_REFERENCE_CANDIDATE_POLICY.requiredManualReviewFields as readonly ReviewField[],
);

function parseBooleanOrNull(value: string): boolean | null {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  throw new Error(`review value must be true, false, or null: ${value}`);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    characterId: '',
    candidateFile: null,
    decision: null,
    notes: null,
    sets: [],
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--') continue;
    if (arg === '--character') {
      options.characterId = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--candidate-file') {
      options.candidateFile = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--decision') {
      const value = args[index + 1] as CharacterReferenceCandidateDecision | undefined;
      if (!value || !['pending', 'approved_reference', 'needs_regeneration', 'rejected'].includes(value)) {
        throw new Error('--decision requires pending, approved_reference, needs_regeneration, or rejected');
      }
      options.decision = value;
      index += 1;
      continue;
    }
    if (arg === '--notes') {
      options.notes = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--set') {
      const expression = args[index + 1] ?? '';
      const equals = expression.indexOf('=');
      if (equals <= 0) throw new Error('--set requires field=true|false|null');
      const field = expression.slice(0, equals) as ReviewField;
      const rawValue = expression.slice(equals + 1);
      if (!allowedReviewFields.has(field)) throw new Error(`unknown manual review field: ${field}`);
      options.sets.push({ field, value: parseBooleanOrNull(rawValue) });
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.characterId) throw new Error('--character is required');
  if (options.candidateFile === '') throw new Error('--candidate-file requires a path');
  if (options.sets.length === 0 && options.decision === null && options.notes === null) {
    throw new Error('nothing to update; provide --set, --decision, or --notes');
  }
  return options;
}

function allChecksTrue(review: CharacterReferenceManualReview): boolean {
  return CHARACTER_REFERENCE_CANDIDATE_POLICY.requiredManualReviewFields.every(
    (field) => review[field as ReviewField] === true,
  );
}

const options = parseArgs(process.argv.slice(2));
const candidateFile = options.candidateFile
  ?? `data/asset-factory/character-reference-candidates/${options.characterId}.candidate.json`;
if (!existsSync(candidateFile)) throw new Error(`candidate file does not exist: ${candidateFile}`);

const record = JSON.parse(readFileSync(candidateFile, 'utf8')) as CharacterReferenceCandidateRecord;
if (record.schemaVersion !== 1) throw new Error(`unsupported candidate schemaVersion: ${record.schemaVersion}`);
if (record.characterId !== options.characterId) {
  throw new Error(`candidate character mismatch: expected ${options.characterId}, got ${record.characterId}`);
}
if (record.approvedForRuntime !== false || record.approvedAsFinal !== false) {
  throw new Error('candidate file already violates runtime/final approval boundary');
}

for (const patch of options.sets) record.manualReview[patch.field] = patch.value;
if (options.notes !== null) record.manualReview.notes = options.notes;

const nextDecision = options.decision ?? record.decision;
if (nextDecision === 'approved_reference') {
  if (!allChecksTrue(record.manualReview)) {
    throw new Error('approved_reference requires every manual review field=true');
  }
  if ((record.characterId === 'hana' || record.characterId === 'kage1') && record.manualReview.bodyRepresentationGuardPassed !== true) {
    throw new Error('plus-size hard-lock character requires bodyRepresentationGuardPassed=true');
  }
  record.approvedForReference = true;
} else {
  record.approvedForReference = false;
}

record.decision = nextDecision;
record.approvedForRuntime = false;
record.approvedAsFinal = false;

writeFileSync(candidateFile, `${JSON.stringify(record, null, 2)}\n`);

console.log(`character reference candidate review updated: ${candidateFile}`);
console.log(`  character: ${record.displayName} (${record.characterId})`);
console.log(`  decision: ${record.decision}`);
console.log(`  approvedForReference: ${record.approvedForReference}`);
console.log('  approvedForRuntime: false');
console.log('  approvedAsFinal: false');
console.log(`  checks passed: ${CHARACTER_REFERENCE_CANDIDATE_POLICY.requiredManualReviewFields.filter((field) => record.manualReview[field as ReviewField] === true).length}/${CHARACTER_REFERENCE_CANDIDATE_POLICY.requiredManualReviewFields.length}`);
