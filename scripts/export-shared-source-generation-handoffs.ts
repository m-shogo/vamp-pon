import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import {
  sharedSourceGenerationHandoffSummary,
  sharedSourceGenerationHandoffs,
} from '../src/game/data/sharedSourceGenerationHandoff.ts';

const DEFAULT_OUTPUT = 'docs/design-targets/generated/shared-source-generation-handoff-v1.json';
const outputPath = resolve(process.argv[2] ?? DEFAULT_OUTPUT);

const document = {
  schemaVersion: 1,
  kind: 'YORUNOSHIRUBE_SHARED_SOURCE_GENERATION_HANDOFF_V1',
  authorityRule: 'Shared Source facts -> candidate generation -> human approval -> surface-specific approval. This file never promotes artwork/runtime state by itself.',
  summary: sharedSourceGenerationHandoffSummary,
  handoffs: sharedSourceGenerationHandoffs,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');

console.log(`Shared Source generation handoffs exported: ${sharedSourceGenerationHandoffs.length} -> ${outputPath}`);
console.log(`ready=${sharedSourceGenerationHandoffSummary.readyForCandidate}, blocked=${sharedSourceGenerationHandoffSummary.blocked}`);
