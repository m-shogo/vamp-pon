import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  referenceFirstBulkGenerationQueue,
  referenceFirstBulkGenerationQueueSummary,
} from '../src/game/data/referenceFirstBulkGenerationQueue.ts';

const outputPath = process.argv[2] ?? 'docs/design-targets/generated/reference-first-bulk-generation-queue-v1.json';

const document = {
  schemaVersion: 1,
  generatedBy: 'scripts/export-reference-first-bulk-generation-queue.ts',
  summary: referenceFirstBulkGenerationQueueSummary,
  queue: referenceFirstBulkGenerationQueue,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Reference-first bulk generation queue exported: ${outputPath}`);
console.log(`total=${referenceFirstBulkGenerationQueueSummary.totalQueuedReferences}, enemy=${referenceFirstBulkGenerationQueueSummary.enemyReferences}, boss=${referenceFirstBulkGenerationQueueSummary.bossReferences}, weapon=${referenceFirstBulkGenerationQueueSummary.weaponReferences}, item=${referenceFirstBulkGenerationQueueSummary.itemReferences}`);
