import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { assetFactoryPromptByKey } from '../../src/game/data/assetFactoryCatalog.ts';
import { assetGenerationContracts } from '../../src/game/data/assetGenerationPolicy.ts';
import {
  GOLDEN_REFERENCE_REGISTRY_SCHEMA_VERSION,
  goldenReferenceSets,
} from '../../src/game/data/goldenReferenceRegistry.ts';

const DEFAULT_CONTRACT_OUTPUT = 'data/asset-factory/generation-contracts.json';
const SUMMARY_OUTPUT = 'data/asset-factory/generation-contracts.summary.json';
const REFERENCE_OUTPUT = 'data/asset-factory/golden-reference-registry.json';

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function parseArgs(args: string[]): { summaryOnly: boolean; contractOutput: string } {
  let summaryOnly = false;
  let contractOutput = DEFAULT_CONTRACT_OUTPUT;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--') continue;
    if (arg === '--summary-only') {
      summaryOnly = true;
      continue;
    }
    if (arg === '--output') {
      const value = args[index + 1];
      if (!value) throw new Error('--output requires a path');
      contractOutput = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return { summaryOnly, contractOutput };
}

function currentCommit(): string {
  return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

function writeSnapshot(
  path: string,
  value: Record<string, unknown>,
  stableHashField?: string,
): void {
  const next = { ...value };
  if (stableHashField && existsSync(path)) {
    try {
      const previous = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
      if (previous[stableHashField] === next[stableHashField]) {
        next.generatedAt = previous.generatedAt ?? next.generatedAt;
        next.sourceCommit = previous.sourceCommit ?? next.sourceCommit;
      }
    } catch {
      // Invalid snapshots are replaced by the regenerated source-derived value.
    }
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
}

const { summaryOnly, contractOutput } = parseArgs(process.argv.slice(2));
const generatedAt = new Date().toISOString();

const exportedContracts = assetGenerationContracts.map((contract) => {
  const prompt = assetFactoryPromptByKey.get(contract.promptCatalogKey);
  if (!prompt) throw new Error(`Prompt catalog entry missing: ${contract.promptCatalogKey}`);
  const promptMaterial = [
    prompt.key,
    prompt.sizeSpec,
    prompt.prompt,
    prompt.negativePrompt,
    ...prompt.reviewChecklist,
  ].join('\n---\n');
  return {
    ...contract,
    promptHashAlgorithm: 'sha256',
    promptHash: sha256(promptMaterial),
  };
});

const contractSetHash = sha256(JSON.stringify(exportedContracts));
const contractCountsByContentType = Object.fromEntries(
  [...new Set(exportedContracts.map((contract) => contract.contentType))]
    .sort()
    .map((contentType) => [
      contentType,
      exportedContracts.filter((contract) => contract.contentType === contentType).length,
    ]),
);

if (!summaryOnly) {
  writeSnapshot(contractOutput, {
    schemaVersion: 1,
    generatedBy: 'scripts/asset-factory/export-generation-contracts.ts',
    generatedAt,
    contractCount: exportedContracts.length,
    contracts: exportedContracts,
  });
}

writeSnapshot(SUMMARY_OUTPUT, {
  schemaVersion: 1,
  generatedBy: 'scripts/asset-factory/export-generation-contracts.ts',
  generatedAt,
  sourceCommit: currentCommit(),
  contractCount: exportedContracts.length,
  contractCountsByContentType,
  policyVersions: [...new Set(exportedContracts.map((contract) => contract.policyVersion))].sort(),
  contractSetHash,
}, 'contractSetHash');

const referenceSetHash = sha256(JSON.stringify(goldenReferenceSets));
writeSnapshot(REFERENCE_OUTPUT, {
    schemaVersion: GOLDEN_REFERENCE_REGISTRY_SCHEMA_VERSION,
    generatedBy: 'scripts/asset-factory/export-generation-contracts.ts',
    generatedAt,
    sourceCommit: currentCommit(),
    referenceSetHash,
    referenceSetCount: goldenReferenceSets.length,
    referenceSets: goldenReferenceSets,
}, 'referenceSetHash');

console.log(summaryOnly ? 'asset generation full contract export skipped' : `asset generation contracts exported: ${contractOutput}`);
console.log(`asset generation contract summary exported: ${SUMMARY_OUTPUT}`);
console.log(`golden reference registry exported: ${REFERENCE_OUTPUT}`);
console.log(`contract count: ${exportedContracts.length}`);
console.log(`contract set hash: ${contractSetHash}`);
