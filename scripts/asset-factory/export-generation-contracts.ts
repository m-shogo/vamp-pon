import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { assetFactoryPromptByKey } from '../../src/game/data/assetFactoryCatalog.ts';
import { assetGenerationContracts } from '../../src/game/data/assetGenerationPolicy.ts';
import {
  GOLDEN_REFERENCE_REGISTRY_SCHEMA_VERSION,
  goldenReferenceSets,
} from '../../src/game/data/goldenReferenceRegistry.ts';

const CONTRACT_OUTPUT = 'data/asset-factory/generation-contracts.json';
const REFERENCE_OUTPUT = 'data/asset-factory/golden-reference-registry.json';

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

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

mkdirSync(dirname(CONTRACT_OUTPUT), { recursive: true });
writeFileSync(
  CONTRACT_OUTPUT,
  `${JSON.stringify({
    schemaVersion: 1,
    generatedBy: 'scripts/asset-factory/export-generation-contracts.ts',
    generatedAt: new Date().toISOString(),
    contractCount: exportedContracts.length,
    contracts: exportedContracts,
  }, null, 2)}\n`,
);

writeFileSync(
  REFERENCE_OUTPUT,
  `${JSON.stringify({
    schemaVersion: GOLDEN_REFERENCE_REGISTRY_SCHEMA_VERSION,
    generatedBy: 'scripts/asset-factory/export-generation-contracts.ts',
    generatedAt: new Date().toISOString(),
    referenceSetCount: goldenReferenceSets.length,
    referenceSets: goldenReferenceSets,
  }, null, 2)}\n`,
);

console.log(`asset generation contracts exported: ${CONTRACT_OUTPUT}`);
console.log(`golden reference registry exported: ${REFERENCE_OUTPUT}`);
console.log(`contract count: ${exportedContracts.length}`);
