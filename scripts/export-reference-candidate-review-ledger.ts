import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  referenceCandidateReviewLedger,
  referenceCandidateReviewLedgerSummary,
} from '../src/game/data/referenceCandidateReviewLedger.ts';

const outputPath = process.argv[2] ?? 'docs/design-targets/generated/reference-candidate-review-ledger-v1.json';

const document = {
  schemaVersion: 1,
  generatedBy: 'scripts/export-reference-candidate-review-ledger.ts',
  summary: referenceCandidateReviewLedgerSummary,
  records: referenceCandidateReviewLedger,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Reference candidate review ledger exported: ${outputPath}`);
console.log(`records=${referenceCandidateReviewLedgerSummary.totalRecords}, approved=${referenceCandidateReviewLedgerSummary.approvedReferenceCount}, runtimeQueued=${referenceCandidateReviewLedgerSummary.runtimeDerivativeQueueAllowedCount}`);
