import {
  buildRuntimeDerivativeQueue,
  runtimeDerivativeMissingContracts,
  runtimeDerivativeQueue,
  runtimeDerivativeQueueSummary,
} from '../../src/game/data/runtimeDerivativeQueue.ts';
import {
  referenceCandidateReviewLedger,
  type ReferenceCandidateArtifact,
  type ReferenceCandidateReviewRecord,
} from '../../src/game/data/referenceCandidateReviewLedger.ts';
import { assetFactorySharedSourceHandoffs } from '../../src/game/data/sharedSourceGenerationHandoff.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Runtime Derivative Queue] ${message}`);
}

assert(runtimeDerivativeQueueSummary.approvedReferenceCount === 0, 'Current reference approvals must start at zero');
assert(runtimeDerivativeQueue.length === 0, 'Current runtime derivative queue must start empty');
assert(runtimeDerivativeMissingContracts.length === 0, 'No missing-contract record should exist before any reference is approved');
assert(runtimeDerivativeQueueSummary.executionGeneratedCountDefault === 0, 'runtime derivative generation inferred');
assert(runtimeDerivativeQueueSummary.approvedUnityCountDefault === 0, 'Unity approval inferred');
assert(runtimeDerivativeQueueSummary.runtimeApprovedCountDefault === 0, 'runtime approval inferred');
assert(runtimeDerivativeQueueSummary.approvedWebCountDefault === 0, 'Web approval inferred');
assert(runtimeDerivativeQueueSummary.referenceApprovalRequired === true, 'reference approval gate missing');
assert(runtimeDerivativeQueueSummary.WebSurfaceExcluded === true, 'Web surface exclusion missing');
assert(runtimeDerivativeQueueSummary.oneShotFinalForbidden === true, 'one-shot final guard missing');

function fixtureArtifacts(prefix: string): ReferenceCandidateArtifact[] {
  return Array.from({ length: 4 }, (_, index) => ({
    candidateId: `${prefix}:candidate:${index + 1}`,
    filePath: `/tmp/${prefix.replace(/[^a-zA-Z0-9_-]/g, '_')}-${index + 1}.png`,
    sha256: `${prefix}:sha256:${index + 1}`,
    generatorName: 'fixture-generator',
    generatorVersion: '1.0',
    promptHash: `${prefix}:prompt-hash`,
    referenceHashes: [`${prefix}:reference-hash:${index + 1}`],
    sourceCommit: 'fixture-source-commit',
  }));
}

function approvedFixture(base: ReferenceCandidateReviewRecord): ReferenceCandidateReviewRecord {
  const candidates = fixtureArtifacts(base.queueId);
  return {
    ...base,
    reviewState: 'APPROVED_REFERENCE',
    candidates,
    selectedCandidateId: candidates[0].candidateId,
    evidence: {
      comparisonSheetPath: `/tmp/${base.sourceId}-comparison.png`,
      humanReviewer: 'fixture-reviewer',
      identityOrMotifQaPassed: true,
      cropAndAlphaQaPassed: true,
      mobileReadabilityQaPassed: true,
      spoilerBoundaryQaPassed: true,
      sourceLineageQaPassed: true,
    },
    approval: { ...base.approval, approvedReference: true },
  };
}

function firstRecord(category: ReferenceCandidateReviewRecord['sourceCategory']): ReferenceCandidateReviewRecord {
  const record = referenceCandidateReviewLedger.find((entry) => entry.sourceCategory === category);
  if (!record) throw new Error(`fixture base missing for ${category}`);
  return record;
}

function expectedRuntimeHandoffs(record: ReferenceCandidateReviewRecord) {
  const factoryCategory = record.sourceCategory === 'items' ? 'item' : record.sourceCategory === 'weapons' ? null : 'enemy';
  if (factoryCategory === null) return [];
  return assetFactorySharedSourceHandoffs.filter(
    (handoff) =>
      handoff.kind === 'unity-runtime-asset-handoff' &&
      handoff.sourceCategory === factoryCategory &&
      handoff.sourceId === record.sourceId,
  );
}

for (const category of ['enemies', 'bosses', 'items'] as const) {
  const base = firstRecord(category);
  const approved = approvedFixture(base);
  const result = buildRuntimeDerivativeQueue([approved]);
  const expected = expectedRuntimeHandoffs(base);
  assert(result.approvedReferenceCount === 1, `${category}: approved reference count drift`);
  assert(result.missingContracts.length === 0, `${category}: existing runtime contracts unexpectedly missing`);
  assert(result.queue.length === expected.length && expected.length > 0, `${category}: runtime derivative coverage drift ${result.queue.length}/${expected.length}`);
  assert(new Set(result.queue.map((entry) => entry.derivativeHandoffId)).size === result.queue.length, `${category}: duplicate derivative handoff`);
  for (const derivative of result.queue) {
    assert(derivative.referenceQueueId === base.queueId, `${category}: reference queue relation drift`);
    assert(derivative.referenceHandoffId === base.handoffId, `${category}: reference handoff relation drift`);
    assert(derivative.approvedReferenceCandidateId === approved.selectedCandidateId, `${category}: approved candidate relation drift`);
    assert(derivative.sourceId === base.sourceId, `${category}: source ID drift`);
    assert(derivative.sourceCategory === category, `${category}: source category drift`);
    assert(derivative.candidateCount === 4, `${category}: runtime candidate count drift`);
    assert(derivative.executionState === 'QUEUED_NOT_GENERATED', `${category}: runtime generation inferred`);
    assert(derivative.gate.approvedReferenceRequired === true, `${category}: approved-reference gate missing`);
    assert(derivative.gate.approvedReferenceValidated === true, `${category}: approved-reference validation missing`);
    assert(derivative.gate.humanComparisonRequired === true, `${category}: runtime human comparison gate missing`);
    assert(derivative.gate.gameplaySizeQaRequired === true, `${category}: gameplay-size QA missing`);
    assert(derivative.gate.separateUnityApprovalRequired === true, `${category}: Unity approval separation missing`);
    assert(derivative.gate.runtimeApprovalRequiredAfterUnityQa === true, `${category}: runtime approval gate missing`);
    assert(derivative.gate.WebDerivativeAllowedFromThisQueue === false, `${category}: Web derivative leaked into runtime queue`);
    assert(derivative.gate.oneShotFinalForbidden === true, `${category}: one-shot final gate missing`);
    assert(derivative.approval.approvedUnityDefault === false, `${category}: Unity approval inferred`);
    assert(derivative.approval.runtimeApprovedDefault === false, `${category}: runtime approval inferred`);
    assert(derivative.approval.approvedWebDefault === false, `${category}: Web approval inferred`);
    assert(expected.some((handoff) => handoff.handoffId === derivative.derivativeHandoffId), `${category}: unknown runtime derivative handoff`);
  }
}

const weaponBase = firstRecord('weapons');
const weaponResult = buildRuntimeDerivativeQueue([approvedFixture(weaponBase)]);
assert(weaponResult.approvedReferenceCount === 1, 'Weapon approved reference should be recognized');
assert(weaponResult.queue.length === 0, 'Weapon must not invent a runtime derivative contract');
assert(weaponResult.missingContracts.length === 1, 'Weapon missing runtime contract must be surfaced');
assert(weaponResult.missingContracts[0].sourceCategory === 'weapons', 'Weapon missing-contract category drift');
assert(weaponResult.missingContracts[0].sourceId === weaponBase.sourceId, 'Weapon missing-contract source drift');
assert(weaponResult.missingContracts[0].reason === 'NO_DEDICATED_RUNTIME_DERIVATIVE_CONTRACT', 'Weapon missing-contract reason drift');
assert(weaponResult.missingContracts[0].mayInventRuntimeContract === false, 'Weapon runtime contract invention must remain forbidden');

const unapprovedBase = firstRecord('enemies');
const unapprovedResult = buildRuntimeDerivativeQueue([unapprovedBase]);
assert(unapprovedResult.approvedReferenceCount === 0, 'unapproved reference counted as approved');
assert(unapprovedResult.queue.length === 0, 'unapproved reference leaked into runtime queue');
assert(unapprovedResult.missingContracts.length === 0, 'unapproved reference should not create missing-contract work');

const stateOnlyApproved: ReferenceCandidateReviewRecord = {
  ...approvedFixture(unapprovedBase),
  approval: { ...unapprovedBase.approval, approvedReference: false },
};
const invalidApprovalResult = buildRuntimeDerivativeQueue([stateOnlyApproved]);
assert(invalidApprovalResult.approvedReferenceCount === 0, 'APPROVED_REFERENCE state without approval flag leaked into queue');
assert(invalidApprovalResult.queue.length === 0, 'invalid approved-reference record queued runtime derivatives');

const runtimeFactoryHandoffs = assetFactorySharedSourceHandoffs.filter((handoff) => handoff.kind === 'unity-runtime-asset-handoff');
assert(runtimeFactoryHandoffs.length > 0, 'runtime Asset Factory handoffs unexpectedly absent');
assert(runtimeFactoryHandoffs.every((handoff) => handoff.kind !== 'web-hero-handoff'), 'Web handoff classified as runtime derivative');

console.log('Runtime Derivative Queue: PASS (currentApprovedReferences=0, currentQueue=0, weaponMissingContractSurfaced=true, WebExcluded=true)');
