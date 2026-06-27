import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { assetFactoryCatalogSummary, assetFactoryPromptCatalog } from '../../src/game/data/assetFactoryCatalog.ts';

const OUTPUT_PATH = 'data/asset-factory/prompt-catalog.json';

type ExportedPromptRecord = {
  key: string;
  contentType: string;
  sourceId: string;
  displayName: string;
  kind: string;
  title: string;
  outputPathHint: string;
  sizeSpec: string;
  prompt: string;
  negativePrompt: string;
  reviewChecklist: string[];
};

const prompts: ExportedPromptRecord[] = assetFactoryPromptCatalog.map((record) => ({
  key: record.key,
  contentType: record.contentType,
  sourceId: record.sourceId,
  displayName: record.displayName,
  kind: record.kind,
  title: record.title,
  outputPathHint: record.outputPathHint,
  sizeSpec: record.sizeSpec,
  prompt: record.prompt,
  negativePrompt: record.negativePrompt,
  reviewChecklist: record.reviewChecklist,
}));

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(
  OUTPUT_PATH,
  `${JSON.stringify(
    {
      schemaVersion: 1,
      generatedBy: 'scripts/asset-factory/export-prompt-catalog.ts',
      summary: assetFactoryCatalogSummary,
      prompts,
    },
    null,
    2,
  )}\n`,
);

console.log(`asset-factory prompt catalog exported: ${OUTPUT_PATH}`);
console.log(`prompt count: ${prompts.length}`);
