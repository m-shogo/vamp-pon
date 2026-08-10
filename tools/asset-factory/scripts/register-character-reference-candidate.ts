import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, normalize } from 'node:path';
import {
  CHARACTER_REFERENCE_CANDIDATE_POLICY,
  EMPTY_CHARACTER_REFERENCE_MANUAL_REVIEW,
  type CharacterReferenceCandidateRecord,
} from '../../../src/game/data/characterReferenceCandidateIntake.ts';
import { characterReferenceGenerationHandoff } from '../../../src/game/data/characterReferenceGenerationHandoff.ts';

type CliOptions = {
  characterId: string;
  sourceFile: string;
  output: string | null;
};

function parseArgs(args: string[]): CliOptions {
  let characterId = '';
  let sourceFile = '';
  let output: string | null = null;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--') continue;
    if (arg === '--character') {
      characterId = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--source-file') {
      sourceFile = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--output') {
      output = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!characterId) throw new Error('--character is required');
  if (!sourceFile) throw new Error('--source-file is required');
  if (output === '') throw new Error('--output requires a path');

  return { characterId, sourceFile, output };
}

function sha256(value: Buffer | string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function readPngHeader(buffer: Buffer): {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
} {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buffer.length < 33 || !buffer.subarray(0, 8).equals(signature)) {
    throw new Error('source file is not a valid PNG header');
  }
  const chunkType = buffer.subarray(12, 16).toString('ascii');
  if (chunkType !== 'IHDR') throw new Error('PNG must begin with IHDR chunk');
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer.readUInt8(24),
    colorType: buffer.readUInt8(25),
  };
}

function currentCommit(): string {
  return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

function promptHash(entry: (typeof characterReferenceGenerationHandoff)[number]): string {
  return sha256([
    entry.characterId,
    entry.outputPath,
    entry.sizeSpec ?? '',
    entry.prompt ?? '',
    entry.negativePrompt ?? '',
    ...entry.reviewChecklist,
  ].join('\n---\n'));
}

const options = parseArgs(process.argv.slice(2));
const handoff = characterReferenceGenerationHandoff.find((entry) => entry.characterId === options.characterId);
if (!handoff) throw new Error(`Unknown Current20 character handoff: ${options.characterId}`);
if (handoff.mode !== 'generate') {
  throw new Error(`${options.characterId} is not in generate mode; review/revalidate the existing master instead`);
}

const sourcePath = normalize(options.sourceFile);
const expectedPath = normalize(handoff.outputPath);
if (sourcePath !== expectedPath) {
  throw new Error(`source file must match Current expected output path: ${handoff.outputPath}`);
}
if (!existsSync(sourcePath)) throw new Error(`source file does not exist: ${sourcePath}`);

const bytes = readFileSync(sourcePath);
const header = readPngHeader(bytes);
if (header.width !== CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedWidth || header.height !== CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedHeight) {
  throw new Error(`reference must be ${CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedWidth}x${CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedHeight}; got ${header.width}x${header.height}`);
}
if (header.bitDepth !== CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedBitDepth) {
  throw new Error(`reference PNG bit depth must be ${CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedBitDepth}; got ${header.bitDepth}`);
}
if (header.colorType !== CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedPngColorType) {
  throw new Error(`reference PNG color type must be RGBA (${CHARACTER_REFERENCE_CANDIDATE_POLICY.expectedPngColorType}); got ${header.colorType}`);
}

const output = options.output ?? `data/asset-factory/character-reference-candidates/${options.characterId}.candidate.json`;
if (existsSync(output)) {
  throw new Error(`candidate record already exists: ${output}; review/update it instead of silently replacing provenance`);
}

const record: CharacterReferenceCandidateRecord = {
  schemaVersion: 1,
  characterId: handoff.characterId,
  displayName: handoff.displayName,
  sourceFile: sourcePath,
  sourceSha256: sha256(bytes),
  sourceWidth: header.width,
  sourceHeight: header.height,
  sourceBitDepth: header.bitDepth,
  sourcePngColorType: header.colorType,
  expectedOutputPath: handoff.outputPath,
  promptHashAlgorithm: 'sha256',
  promptHash: promptHash(handoff),
  promptSource: 'current-character-reference-handoff',
  intakeCommit: currentCommit(),
  registeredAt: new Date().toISOString(),
  decision: 'pending',
  approvedForReference: false,
  approvedForRuntime: false,
  approvedAsFinal: false,
  manualReview: { ...EMPTY_CHARACTER_REFERENCE_MANUAL_REVIEW },
};

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`);

console.log(`character reference candidate registered: ${output}`);
console.log(`  character: ${record.displayName} (${record.characterId})`);
console.log(`  source: ${record.sourceFile}`);
console.log(`  sha256: ${record.sourceSha256}`);
console.log(`  size: ${record.sourceWidth}x${record.sourceHeight} RGBA`);
console.log(`  decision: ${record.decision}`);
console.log('  approvedForReference: false');
console.log('  approvedForRuntime: false');
console.log('  approvedAsFinal: false');
