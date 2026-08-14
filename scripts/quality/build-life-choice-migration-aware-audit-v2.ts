import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const paths = {
  queueV1: 'data/visual/all-character-life-choice-author-review-queue-v1.json',
  p0: 'data/visual/core5-p0-life-choice-review-contract-v1.json',
  p1: 'data/visual/core5-p1-life-choice-review-contract-v1.json',
  p2: 'data/visual/core5-p2-life-choice-review-contract-v1.json',
  current16: 'data/visual/current16-life-choice-profile-migration-intake-v1.json',
  future15: 'data/visual/future15-life-choice-profile-migration-intake-v1.json',
  auditV2: 'data/visual/all-character-life-choice-migration-aware-audit-v2.json',
  queueV2: 'data/visual/all-character-life-choice-review-queue-v2.json',
};

function load(path: string) {
  const text = readFileSync(resolve(root, path), 'utf8');
  return { text, json: JSON.parse(text), sha256: createHash('sha256').update(text).digest('hex') };
}

const queueV1 = load(paths.queueV1);
const p0 = load(paths.p0);
const p1 = load(paths.p1);
const p2 = load(paths.p2);
const current16 = load(paths.current16);
const future15 = load(paths.future15);

const sourceHashes = Object.fromEntries([
  [paths.queueV1, queueV1.sha256], [paths.p0, p0.sha256], [paths.p1, p1.sha256], [paths.p2, p2.sha256],
  [paths.current16, current16.sha256], [paths.future15, future15.sha256],
]);

const core5ReviewCount = [p0.json, p1.json, p2.json].reduce((sum, contract) => sum + Number(contract.scope?.reviewItemCount ?? 0), 0);
const currentStates = current16.json.stateCounts ?? {};
const futureStates = future15.json.stateCounts ?? {};
const currentOpen = Number(currentStates.MIGRATION_READY_WITH_OPEN_AUTHOR_DECISION ?? 0) + Number(currentStates.PARTIAL_MIGRATION_EVIDENCE_WITH_OPEN_AUTHOR_DECISION ?? 0);
const futureOpen = Number(futureStates.MIGRATION_READY_WITH_OPEN_AUTHOR_DECISION ?? 0) + Number(futureStates.PARTIAL_MIGRATION_EVIDENCE_WITH_OPEN_AUTHOR_DECISION ?? 0);
const migrationReady = Number(currentStates.MIGRATION_READY_AUTHOR_CANDIDATE ?? 0) + Number(futureStates.MIGRATION_READY_AUTHOR_CANDIDATE ?? 0);
const partialMigration = Number(currentStates.PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW ?? 0) + Number(futureStates.PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW ?? 0);
const speciesAdapter = Number(currentStates.SOURCE_MARKED_NOT_APPLICABLE_REQUIRES_SCHEMA_ADAPTER ?? 0) + Number(futureStates.SOURCE_MARKED_NOT_APPLICABLE_REQUIRES_SCHEMA_ADAPTER ?? 0);
const authorContentReview = core5ReviewCount + currentOpen + futureOpen;
const total = authorContentReview + migrationReady + partialMigration + speciesAdapter;

if (core5ReviewCount !== 30) throw new Error(`expected 30 Core5 review items, got ${core5ReviewCount}`);
if (current16.json.scope?.decisionCount !== 96 || future15.json.scope?.decisionCount !== 90) throw new Error('migration intake scope drift');
if (total !== 216) throw new Error(`expected 216 decisions, got ${total}`);

const safety = {
  noNewCharacterFactsAuthored: true,
  migrationDoesNotEqualCanonPromotion: true,
  openAuthorDecisionRequiresHumanDecision: true,
  partialEvidenceRequiresHumanReview: true,
  notApplicableRequiresSchemaAdapterNotHumanFallback: true,
  genericPolicyMayServeAsCharacterEvidence: false,
  imageModelFreedom: false,
  generatedImageMayCloseItem: false,
};

const audit = {
  id: 'yoru-no-shirube-all-character-life-choice-migration-aware-audit-v2',
  date: '2026-08-14',
  status: 'DERIVED_MIGRATION_AWARE_REVIEW_ARTIFACT_NON_CANON',
  sourceHashes,
  scope: { characterCount: 36, domainCount: 6, decisionCount: 216 },
  safety,
  summary: {
    AUTHOR_CONTENT_REVIEW_REQUIRED: authorContentReview,
    SCHEMA_MIGRATION_READY: migrationReady,
    PARTIAL_SCHEMA_MIGRATION_REVIEW: partialMigration,
    SPECIES_SCHEMA_ADAPTER_REQUIRED: speciesAdapter,
  },
  provenance: {
    core5: { characterCount: 5, reviewItemCount: core5ReviewCount, contracts: [paths.p0, paths.p1, paths.p2] },
    current16: { characterCount: 16, decisionCount: 96, stateCounts: currentStates, intake: paths.current16 },
    future15: { characterCount: 15, decisionCount: 90, stateCounts: futureStates, intake: paths.future15 },
  },
};

const reviewQueue = {
  id: 'yoru-no-shirube-all-character-life-choice-review-queue-v2',
  date: '2026-08-14',
  status: 'DERIVED_MIGRATION_AWARE_AUTHOR_REVIEW_QUEUE_NON_CANON',
  sourceAudit: paths.auditV2,
  sourceHashes,
  scope: audit.scope,
  safety,
  workstreams: [
    {
      id: 'A_AUTHOR_CONTENT_DECISIONS', priority: 'A0', decisionCount: authorContentReview,
      rule: 'Human author decides content. OPEN remains unresolved until explicit author action.',
      components: {
        core5P0: p0.json.scope?.reviewItemCount ?? 0,
        core5P1: p1.json.scope?.reviewItemCount ?? 0,
        core5P2: p2.json.scope?.reviewItemCount ?? 0,
        current16OpenDomains: currentOpen,
        future15OpenDomains: futureOpen,
      },
    },
    {
      id: 'B_SCHEMA_MIGRATION_READY', priority: 'B1', decisionCount: migrationReady,
      rule: 'Existing character-specific candidate evidence may be mapped to the six-domain schema after human schema review; mapping is not Canon promotion.',
    },
    {
      id: 'C_PARTIAL_EVIDENCE_REVIEW', priority: 'C2', decisionCount: partialMigration,
      rule: 'Preserve existing evidence and review only the missing semantic portion; never infer the missing part from generic fidelity policy.',
    },
    {
      id: 'D_SPECIES_SCHEMA_ADAPTER', priority: 'D0_SCHEMA', decisionCount: speciesAdapter,
      rule: 'Create species/body-type-aware schema handling for source-marked NOT_APPLICABLE values. Never replace them with human defaults.',
    },
  ],
  core5PriorityMap: queueV1.json.domainPriority,
  nextActionBoundary: 'SCHEMA_OR_AUTHOR_REVIEW_ONLY_NO_IMAGE_RESOLUTION',
};

function exactCheck(path: string, expected: unknown) {
  const actual = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${path} is stale`);
}

if (process.argv.includes('--check-materialized')) {
  exactCheck(paths.auditV2, audit);
  exactCheck(paths.queueV2, reviewQueue);
  console.log('[life-choice-migration-aware-v2] materialized audit and queue fresh');
} else if (process.argv.includes('--emit-compact')) {
  console.log('AUDIT_V2_BEGIN');
  console.log(JSON.stringify(audit, null, 2));
  console.log('AUDIT_V2_END');
  console.log('QUEUE_V2_BEGIN');
  console.log(JSON.stringify(reviewQueue, null, 2));
  console.log('QUEUE_V2_END');
} else {
  console.log('[life-choice-migration-aware-v2] OK');
  console.log(JSON.stringify(audit.summary));
}
