import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  worldEffectGenerationHandoffs,
  worldEffectGenerationHandoffSummary,
} from '../src/game/data/worldEffectGenerationHandoff.ts';

const outputPath = process.argv[2] ?? 'docs/design-targets/generated/world-effect-generation-handoff-v1.json';

const document = {
  schemaVersion: 1,
  generatedBy: 'scripts/export-world-effect-generation-handoffs.ts',
  authority: 'src/game/data/worldEffectSharedSource.ts',
  summary: worldEffectGenerationHandoffSummary,
  handoffs: worldEffectGenerationHandoffs,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`World Effect generation handoffs exported: ${outputPath}`);
console.log(`events=${worldEffectGenerationHandoffSummary.total}`);
