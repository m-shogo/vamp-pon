import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import {
  CHARACTER_REFERENCE_CANDIDATE_POLICY,
  type CharacterReferenceCandidateRecord,
} from '../../src/game/data/characterReferenceCandidateIntake.ts';
import { characterReferenceGenerationHandoff } from '../../src/game/data/characterReferenceGenerationHandoff.ts';

const CANDIDATE_DIR = 'data/asset-factory/character-reference-candidates';
let failed = false;
const fail = (message: string) => {
  failed = true;
  console.error(`FAIL: ${message}`);
};

function sha256(value: Buffer | string): string {
  return createHash('sha256').update(value).digest('hex');
}

function readPngHeader(buffer: Buffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buffer.length < 33 || !buffer.subarray(0, 8).equals(signature)) {
    throw new Error('invalid PNG header');
  }
  if (buffer.subarray(12, 16).toString('ascii') !== 'IHDR') throw new Error('missing IHDR');
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer.readUInt8(24),
    colorType: buffer.readUInt8(25),
  };
}

function currentPromptHash(characterId: string): string | null {
  const entry = characterReferenceGenerationHandoff.find((candidate) => candidate.characterId === characterId);
  if (!entry) return null;
  return sha256([
    entry.characterId,
    entry.outputPath,
    entry.sizeSpec ?? '',
    entry.prompt ?? '',
    entry.negativePrompt ?? '',
    ...entry.reviewChecklist,
  ].join('\n---\n'));
}

const candidateFiles = existsSync(CANDIDATE_DIR)
  ? readdirSync(CANDIDATE_DIR).filter((name) => name.endsWith('.candidate.json')).sort()
  : [];

const seenCharacters = new Set<string>();
for (const filename of candidateFiles) {
  const path = `${CANDIDATE_DIR}/${filename}`;
  let record: CharacterReferenceCandidateRecord;
  try {
    record = JSON.parse(readFileSync(path, 'utf8')) as CharacterReferenceCandidateRecord;
  } catch (error) {
    fail(`${path}: invalid JSON: ${String(error)}`);
    continue;
  }

  if (record.schemaVersion !== 1) fail(`${path}: schemaVersion must be 1`);
  if (seenCharacters.has(record.characterId)) fail(`${path}: duplicate character candidate ${record.characterId}`);
  seenCharacters.add(record.characterId);

  const handoff = characterReferenceGenerationHandoff.find((entry) => entry.characterId === record.characterId);
  if (!handoff) {
    fail(`${path}: unknown Current20 character ${record.characterId}`);
    continue;
  }
  if (record.displayName !== handoff.displayName) fail(`${path}: display name drift`);
  if (record.expectedOutputPath !== handoff.outputPath) fail(`${path}: expected output path drift`);
  if (record.sourceFile !== handoff.outputPath) fail(`${path}: sourceFile must be the Current expected reference path`);
  if (!existsSync(record.sourceFile)) {
    fail(`${path}: referenced PNG is missing: ${record.sourceFile}`);
    continue;
  }

  const bytes = readFileSync(record.sourceFile);
  if (sha256(bytes) !== record.sourceSha256) fail(`${path}: source SHA256 drift`);
  try {
    const header = readPngHeader(bytes);
    if (header.width !== record.sourceWidth || header.height !== record.sourceHeight) fail(`${path}: recorded size drift`);
    if (header.bitDepth !== record.sourceBitDepth || header.colorType !== record.sourcePngColorType) fail(`${path}: recorded PNG format drift`);
    if (header.width !== CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedWidth || header.height !== CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedHeight) {
      fail(`${path}: candidate must remain 1024x1024`);
    }
    if (header.bitDepth !== CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedBitDepth || header.colorType !== CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedPngColorType) {
      fail(`${path}: candidate must remain 8-bit RGBA PNG`);
    }
  } catch (error) {
    fail(`${path}: ${String(error)}`);
  }

  const expectedPromptHash = currentPromptHash(record.characterId);
  if (!expectedPromptHash || record.promptHash !== expectedPromptHash) {
    fail(`${path}: prompt provenance drift; regenerate/re-register from Current handoff`);
  }
  if (record.promptHashAlgorithm !== 'sha256' || record.promptSource !== 'current-character-reference-handoff') {
    fail(`${path}: prompt provenance metadata invalid`);
  }
  if (!record.intakeCommit || !record.registeredAt || Number.isNaN(Date.parse(record.registeredAt))) {
    fail(`${path}: intake provenance incomplete`);
  }

  if (record.approvedForRuntime !== false || record.approvedAsFinal !== false) {
    fail(`${path}: candidate intake must never approve runtime/final art`);
  }

  const reviewValues = CHARACTER_REFERENCE_CANDIDATE_POLICY.requiredManualReviewFields.map(
    (field) => record.manualReview?.[field as keyof typeof record.manualReview],
  );
  const allReviewPassed = reviewValues.every((value) => value === true);

  if (record.decision === 'pending') {
    if (record.approvedForReference) fail(`${path}: pending candidate cannot be approvedForReference`);
  } else if (record.decision === 'approved_reference') {
    if (!record.approvedForReference) fail(`${path}: approved_reference must set approvedForReference=true`);
    if (!allReviewPassed) fail(`${path}: approved_reference requires every manual review field=true`);
    if ((record.characterId === 'hana' || record.characterId === 'kage1') && record.manualReview.bodyRepresentationGuardPassed !== true) {
      fail(`${path}: plus-size hard-lock character requires bodyRepresentationGuardPassed=true`);
    }
  } else if (record.decision === 'needs_regeneration' || record.decision === 'rejected') {
    if (record.approvedForReference) fail(`${path}: rejected/regeneration candidate cannot be approvedForReference`);
  } else {
    fail(`${path}: unknown decision ${(record as { decision?: unknown }).decision}`);
  }
}

console.log(`Character reference candidate provenance OK: ${candidateFiles.length} record(s)`);
if (candidateFiles.length === 0) {
  console.log('  No candidate PNGs registered yet; P0 generation remains the next art step.');
}

if (failed) process.exit(1);
