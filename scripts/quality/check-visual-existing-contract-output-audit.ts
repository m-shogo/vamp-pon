import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { assetGenerationContracts } from '../../src/game/data/assetGenerationPolicy.ts';

const POLICY_PATH = 'data/character-assets/manifests/visual-existing-contract-output-audit-policy.v1.json';
const policy = JSON.parse(readFileSync(POLICY_PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(policy.schemaVersion === 1, 'existing-contract output audit policy schemaVersion must remain 1');
assert(policy.status === 'ACTIVE_AUDIT_POLICY_NO_AUTOMATIC_GENERATION', 'output audit may not authorize generation');
assert(policy.rules?.contractMembershipComesFromSource === true, 'contract membership must remain source-derived');
assert(policy.rules?.existenceDoesNotEqualApproval === true, 'file existence may not imply approval');
assert(policy.rules?.absenceDoesNotEqualGenerationPermission === true, 'file absence may not imply generation permission');
assert(policy.rules?.fileHashRecordedWhenExisting === true, 'existing outputs must be hashable in audit');
assert(policy.rules?.gameplayRemainsAfterMasterGuideTopPhases === true, 'gameplay phase order must remain last');
assert(policy.rules?.itemGameplayGenerationBlockedUntilPhysicalLineageResolution === true, 'Item gameplay must remain lineage-gated');

const expected = policy.expectedCurrentContractBreakdown;
const typeCounts = new Map<string, number>();
const contractIds = new Set<string>();
const outputPaths = new Map<string, string[]>();
const hashToPaths = new Map<string, Set<string>>();

let existingCount = 0;
let missingCount = 0;
const existingByType = new Map<string, number>();
const missingByType = new Map<string, number>();
const sampleExisting: Array<Record<string, unknown>> = [];
const sampleMissing: Array<Record<string, unknown>> = [];

for (const contract of assetGenerationContracts) {
  assert(!contractIds.has(contract.contractId), `duplicate Asset Factory contractId: ${contract.contractId}`);
  contractIds.add(contract.contractId);
  typeCounts.set(contract.contentType, (typeCounts.get(contract.contentType) ?? 0) + 1);

  const pathOwners = outputPaths.get(contract.outputPathHint) ?? [];
  pathOwners.push(contract.contractId);
  outputPaths.set(contract.outputPathHint, pathOwners);

  if (existsSync(contract.outputPathHint)) {
    existingCount += 1;
    existingByType.set(contract.contentType, (existingByType.get(contract.contentType) ?? 0) + 1);
    const bytes = readFileSync(contract.outputPathHint);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const paths = hashToPaths.get(sha256) ?? new Set<string>();
    paths.add(contract.outputPathHint);
    hashToPaths.set(sha256, paths);
    if (sampleExisting.length < 8) {
      sampleExisting.push({
        contractId: contract.contractId,
        contentType: contract.contentType,
        outputPathHint: contract.outputPathHint,
        sha256,
        classification: 'EXISTS_REVIEW_REUSE_OR_REPLACE',
      });
    }
  } else {
    missingCount += 1;
    missingByType.set(contract.contentType, (missingByType.get(contract.contentType) ?? 0) + 1);
    if (sampleMissing.length < 8) {
      sampleMissing.push({
        contractId: contract.contractId,
        contentType: contract.contentType,
        outputPathHint: contract.outputPathHint,
        classification: 'MISSING_OUTPUT_REQUIRES_AUTHORITY_ADMISSION',
      });
    }
  }
}

assert(assetGenerationContracts.length === expected.total, `Asset Factory total contract count drift: expected ${expected.total}, got ${assetGenerationContracts.length}`);
for (const type of ['character', 'enemy', 'item', 'stage']) {
  assert(typeCounts.get(type) === expected[type], `${type} contract count drift: expected ${expected[type]}, got ${typeCounts.get(type) ?? 0}`);
}
assert(existingCount + missingCount === assetGenerationContracts.length, 'existence classification must cover every contract exactly once');

const duplicateOutputPaths = [...outputPaths.entries()]
  .filter(([, owners]) => owners.length > 1)
  .map(([path, owners]) => ({ path, contractIds: owners }));
const duplicateExistingBinaries = [...hashToPaths.entries()]
  .filter(([, paths]) => paths.size > 1)
  .map(([sha256, paths]) => ({ sha256, paths: [...paths].sort() }));

// Surface duplicates rather than silently treating them as distinct missing work.
// Do not fail only because the historical catalog already contains a deliberate
// shared path/hash; registry/replacement policy decides whether it is valid.
const summary = {
  status: 'PASS',
  policyId: policy.policyId,
  totalContracts: assetGenerationContracts.length,
  byType: Object.fromEntries([...typeCounts.entries()].sort(([a], [b]) => a.localeCompare(b))),
  existingCount,
  missingCount,
  existingByType: Object.fromEntries([...existingByType.entries()].sort(([a], [b]) => a.localeCompare(b))),
  missingByType: Object.fromEntries([...missingByType.entries()].sort(([a], [b]) => a.localeCompare(b))),
  duplicateOutputPathCount: duplicateOutputPaths.length,
  duplicateExistingBinaryHashCount: duplicateExistingBinaries.length,
  duplicateOutputPaths: duplicateOutputPaths.slice(0, 20),
  duplicateExistingBinaries: duplicateExistingBinaries.slice(0, 20),
  sampleExisting,
  sampleMissing,
  classifications: {
    existing: 'EXISTS_REVIEW_REUSE_OR_REPLACE',
    missing: 'MISSING_OUTPUT_REQUIRES_AUTHORITY_ADMISSION',
  },
  automaticGenerationAuthorized: false,
};

console.log(JSON.stringify(summary, null, 2));
