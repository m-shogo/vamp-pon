import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const finalStatusPath = 'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const bridgePath = 'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const expectedBridgeSha256 = 'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d';
const canonicalCandidatePath = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function sha256(relativePath: string): string {
  return createHash('sha256').update(readFileSync(join(root, relativePath))).digest('hex');
}

invariant(existsSync(join(root, finalStatusPath)), 'TOP final-art status is missing');
invariant(existsSync(join(root, bridgePath)), 'TOP known V2 bridge is missing');
invariant(sha256(bridgePath) === expectedBridgeSha256, 'TOP known V2 bridge SHA changed without explicit boundary update');

const status = JSON.parse(readFileSync(join(root, finalStatusPath), 'utf8')) as {
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
  approvedAsFinal: boolean;
  runtimeApproved: boolean;
};

invariant(status.candidatePath === canonicalCandidatePath, 'TOP final candidate path is not canonical');

if (!status.candidateGenerated) {
  invariant(status.candidateSha256 === '', 'uncreated TOP final candidate must not retain a SHA-256');
  invariant(!status.approvedAsFinal && !status.runtimeApproved, 'uncreated TOP final candidate cannot be approved');
  console.log('TOP final-art known-bridge exclusion: honest NOT_RUN boundary');
  process.exit(0);
}

invariant(/^[0-9a-f]{64}$/.test(status.candidateSha256), 'generated TOP final candidate requires a SHA-256');
invariant(
  status.candidateSha256 !== expectedBridgeSha256,
  'known V2 visual-recovery bridge cannot be registered as the final Core5 TOP candidate',
);
invariant(existsSync(join(root, canonicalCandidatePath)), 'registered TOP final candidate PNG is missing');
invariant(
  sha256(canonicalCandidatePath) !== expectedBridgeSha256,
  'canonical final Core5 TOP bytes are identical to the known V2 visual-recovery bridge',
);

console.log('TOP final-art known-bridge exclusion: PASS');
console.log(`bridgeSha256=${expectedBridgeSha256}`);
console.log(`candidateSha256=${status.candidateSha256}`);
