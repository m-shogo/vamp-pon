import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Reference = { id: string; path: string; gitBlobSha1: string };
type ReferenceManifest = {
  schemaVersion: number;
  referenceCount: number;
  referenceSetSha256: string;
  references: Reference[];
};
type FinalArtStatus = {
  candidateGenerated: boolean;
  candidateSha256: string;
  candidateCore5ReferenceSetSha256: string;
  approvedAsFinal: boolean;
};
type IdentityStatus = {
  candidateGenerated: boolean;
  sourceSha256: string;
  referenceSetSha256: string;
  allIdentitiesApproved: boolean;
};

const root = process.cwd();
const manifest = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json'), 'utf8'),
) as ReferenceManifest;
const finalArt = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'), 'utf8'),
) as FinalArtStatus;
const identity = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json'), 'utf8'),
) as IdentityStatus;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function referenceSetDigest(references: Reference[]): string {
  const payload = references
    .map(reference => `${reference.id}\0${reference.path}\0${reference.gitBlobSha1}\n`)
    .join('');
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

invariant(manifest.schemaVersion === 1, 'Core5 reference manifest schema mismatch');
invariant(manifest.referenceCount === 5 && manifest.references.length === 5, 'Core5 provenance requires exactly five references');
const currentReferenceSetSha256 = referenceSetDigest(manifest.references);
invariant(/^[0-9a-f]{64}$/.test(manifest.referenceSetSha256), 'Core5 reference-set SHA-256 is invalid');
invariant(
  manifest.referenceSetSha256 === currentReferenceSetSha256,
  'Core5 reference-set fingerprint does not match the locked reference entries',
);
invariant(finalArt.candidateGenerated === identity.candidateGenerated, 'final-art/Core5 candidate flags diverged');

if (!finalArt.candidateGenerated) {
  invariant(finalArt.candidateSha256 === '', 'missing final candidate must not retain candidate SHA-256');
  invariant(
    finalArt.candidateCore5ReferenceSetSha256 === '',
    'missing final candidate must not retain a Core5 reference-set fingerprint',
  );
  invariant(identity.sourceSha256 === '', 'missing final candidate must not retain Core5 review source SHA-256');
  invariant(identity.referenceSetSha256 === '', 'missing final candidate must not retain Core5 review reference-set fingerprint');
  invariant(!identity.allIdentitiesApproved, 'missing final candidate cannot retain Core5 identity approval');
  invariant(!finalArt.approvedAsFinal, 'missing final candidate cannot be final-approved');
  console.log('TOP Core5 candidate provenance: honest NOT_RUN boundary');
  console.log(`lockedReferenceSet=${currentReferenceSetSha256}`);
  process.exit(0);
}

invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateSha256), 'generated final candidate requires candidate SHA-256');
invariant(
  finalArt.candidateCore5ReferenceSetSha256 === currentReferenceSetSha256,
  'final TOP candidate was generated against a stale Core5 reference set; regenerate/re-register candidate',
);
invariant(
  identity.referenceSetSha256 === currentReferenceSetSha256,
  'Core5 identity review targets a stale Core5 reference set; reset and re-review',
);
invariant(identity.sourceSha256 === finalArt.candidateSha256, 'Core5 review must target current final candidate bytes');

if (identity.allIdentitiesApproved || finalArt.approvedAsFinal) {
  invariant(
    identity.referenceSetSha256 === finalArt.candidateCore5ReferenceSetSha256,
    'approved Core5 review and final candidate must share one locked reference-set fingerprint',
  );
}

console.log('TOP Core5 candidate provenance: PASS');
console.log(`candidate=${finalArt.candidateSha256}`);
console.log(`referenceSet=${currentReferenceSetSha256}`);
