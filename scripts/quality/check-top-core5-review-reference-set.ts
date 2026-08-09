import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const identity = JSON.parse(readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json'), 'utf8')) as any;
const finalArt = JSON.parse(readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'), 'utf8')) as any;
const references = JSON.parse(readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json'), 'utf8')) as any;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(references.schemaVersion === 1, 'Core5 reference manifest schema mismatch');
invariant(references.referenceCount === 5, 'Core5 review must use exactly five locked references');
invariant(/^[0-9a-f]{64}$/.test(references.referenceSetSha256), 'Core5 reference-set fingerprint is invalid');
invariant(identity.candidateGenerated === finalArt.candidateGenerated, 'Core5 review candidate state diverges from final-art authority');

if (!finalArt.candidateGenerated) {
  invariant(identity.referenceSetSha256 === '', 'NOT_RUN Core5 review must not retain a stale reference-set fingerprint');
  invariant(finalArt.candidateCore5ReferenceSetSha256 === '', 'missing candidate must not retain candidate reference-set provenance');
  console.log('TOP Core5 review reference-set binding: honest NOT_RUN boundary');
  process.exit(0);
}

invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateCore5ReferenceSetSha256), 'generated candidate requires locked Core5 reference-set provenance');
invariant(finalArt.candidateCore5ReferenceSetSha256 === references.referenceSetSha256, 'final candidate Core5 reference-set provenance is stale');
invariant(identity.referenceSetSha256 === references.referenceSetSha256, 'Core5 review must target the current locked reference set');
invariant(identity.referenceSetSha256 === finalArt.candidateCore5ReferenceSetSha256, 'Core5 review and candidate must share one reference-set fingerprint');

console.log('TOP Core5 review reference-set binding: PASS');
console.log(`referenceSet=${references.referenceSetSha256}`);
