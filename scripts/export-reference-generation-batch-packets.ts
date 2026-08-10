import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  referenceGenerationBatchPackets,
  referenceGenerationBatchPacketSummary,
} from '../src/game/data/referenceGenerationBatchPackets.ts';

const outputPath = process.argv[2] ?? 'docs/design-targets/generated/reference-generation-batch-packets-v1.json';

const document = {
  schemaVersion: 1,
  generatedBy: 'scripts/export-reference-generation-batch-packets.ts',
  summary: referenceGenerationBatchPacketSummary,
  packets: referenceGenerationBatchPackets,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Reference generation batch packets exported: ${outputPath}`);
console.log(`packets=${referenceGenerationBatchPacketSummary.packetCount}, references=${referenceGenerationBatchPacketSummary.totalReferences}, candidates=${referenceGenerationBatchPacketSummary.totalCandidateCapacity}`);
