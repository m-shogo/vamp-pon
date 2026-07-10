import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname } from 'node:path';
import { assetFactoryPromptByKey } from '../../src/game/data/assetFactoryCatalog.ts';
import { assetGenerationContractByKey } from '../../src/game/data/assetGenerationPolicy.ts';
import { goldenReferenceSetById } from '../../src/game/data/goldenReferenceRegistry.ts';

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requiredArg(name: string): string {
  const value = arg(name);
  if (!value) throw new Error(`Missing --${name}`);
  return value;
}

function hashFile(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function hashPrompt(key: string): string {
  const prompt = assetFactoryPromptByKey.get(key);
  if (!prompt) throw new Error(`Unknown prompt key: ${key}`);
  return createHash('sha256')
    .update([prompt.key, prompt.sizeSpec, prompt.prompt, prompt.negativePrompt, ...prompt.reviewChecklist].join('\n---\n'))
    .digest('hex');
}

function currentCommit(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'UNKNOWN';
  }
}

const key = requiredArg('key');
const outputPath = requiredArg('output');
const generator = requiredArg('generator');
const generatorVersion = requiredArg('generator-version');
const referenceSetIds = (arg('reference-sets') ?? 'global:visual-style-v1')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const seed = arg('seed') ?? 'NOT_SUPPORTED_OR_NOT_PROVIDED';
const manifestPath = arg('manifest') ?? `${outputPath}.lineage.json`;
const candidateId = arg('candidate-id') ?? basename(outputPath, extname(outputPath));

const contract = assetGenerationContractByKey.get(key);
if (!contract) throw new Error(`Generation contract missing: ${key}`);
if (!existsSync(outputPath)) throw new Error(`Generated output does not exist: ${outputPath}`);

const references = referenceSetIds.map((referenceSetId) => {
  const set = goldenReferenceSetById.get(referenceSetId);
  if (!set) {
    return { referenceSetId, registered: false, status: 'missing-required-reference', assets: [] };
  }
  return {
    referenceSetId,
    registered: true,
    status: set.status,
    assets: set.assets.map((asset) => ({
      path: asset.path,
      role: asset.role,
      exists: existsSync(asset.path),
      sha256: existsSync(asset.path) ? hashFile(asset.path) : null,
      approvedForReference: asset.approvedForReference,
      approvedForRuntime: false,
    })),
  };
});

const registeredSetIds = new Set(references.filter((reference) => reference.registered).map((reference) => reference.referenceSetId));
const finalApprovalBlockedReasons: string[] = [];
for (const requiredSetId of contract.referencePolicy.requiredReferenceSetIds) {
  if (!registeredSetIds.has(requiredSetId)) finalApprovalBlockedReasons.push(`missing reference set: ${requiredSetId}`);
}
if (!registeredSetIds.has(contract.referencePolicy.identityReferenceSetId)) {
  finalApprovalBlockedReasons.push('identity reference is not registered');
}
if (references.some((reference) => reference.assets.some((asset) => !asset.exists))) {
  finalApprovalBlockedReasons.push('one or more registered reference assets are missing');
}

const lineage = {
  schemaVersion: 1,
  evidenceKind: 'Asset generation lineage',
  assetId: candidateId,
  promptCatalogKey: key,
  contractId: contract.contractId,
  contractVersion: contract.contractVersion,
  policyVersion: contract.policyVersion,
  promptHashAlgorithm: 'sha256',
  promptHash: hashPrompt(key),
  generator,
  generatorVersion,
  seed,
  sourceCommit: currentCommit(),
  generatedAt: new Date().toISOString(),
  output: {
    path: outputPath,
    sha256: hashFile(outputPath),
    sizeSpec: contract.sizeSpec,
    expectedPathHint: contract.outputPathHint,
  },
  referenceSetIds,
  references,
  candidateBatchPolicy: {
    requiredCandidateCount: contract.generationPolicy.candidateCount,
    comparisonSheetRequired: contract.qaPolicy.comparisonSheetRequired,
    oneShotFinalForbidden: contract.generationPolicy.oneShotFinalForbidden,
  },
  review: {
    status: 'candidate',
    automaticQaPassed: false,
    humanReviewPassed: false,
    comparisonSheetPath: null,
    reviewNotes: '',
    issues: [],
  },
  approval: {
    approvedAsFinal: false,
    runtimeApproved: false,
    finalApprovalBlocked: true,
    finalApprovalBlockedReasons,
  },
};

mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, `${JSON.stringify(lineage, null, 2)}\n`);
console.log(`lineage manifest created: ${manifestPath}`);
console.log('approvedAsFinal=false / runtimeApproved=false');
if (finalApprovalBlockedReasons.length > 0) {
  console.log(`final approval blockers: ${finalApprovalBlockedReasons.join('; ')}`);
}
