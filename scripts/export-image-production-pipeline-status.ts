import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  imageProductionPipelineStages,
  imageProductionPipelineSummary,
} from '../src/game/data/imageProductionPipelineStatus.ts';

const outputPath = process.argv[2] ?? 'docs/design-targets/generated/image-production-pipeline-status-v1.json';

const document = {
  schemaVersion: 1,
  generatedBy: 'scripts/export-image-production-pipeline-status.ts',
  summary: imageProductionPipelineSummary,
  stages: imageProductionPipelineStages,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Image production pipeline status exported: ${outputPath}`);
console.log(`stages=${imageProductionPipelineSummary.stageCount}, references=${imageProductionPipelineSummary.referenceQueueTotal}, approved=${imageProductionPipelineSummary.referenceApprovedCount}, runtime=${imageProductionPipelineSummary.runtimeDerivativeQueuedCount}`);
