import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  runtimeDerivativeMissingContracts,
  runtimeDerivativeQueue,
  runtimeDerivativeQueueSummary,
} from '../src/game/data/runtimeDerivativeQueue.ts';

const outputPath = process.argv[2] ?? 'docs/design-targets/generated/runtime-derivative-queue-v1.json';

const document = {
  schemaVersion: 1,
  generatedBy: 'scripts/export-runtime-derivative-queue.ts',
  summary: runtimeDerivativeQueueSummary,
  queue: runtimeDerivativeQueue,
  missingContracts: runtimeDerivativeMissingContracts,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Runtime derivative queue exported: ${outputPath}`);
console.log(`approvedReferences=${runtimeDerivativeQueueSummary.approvedReferenceCount}, queued=${runtimeDerivativeQueueSummary.queuedDerivativeCount}, missingContracts=${runtimeDerivativeQueueSummary.missingRuntimeContractCount}`);
