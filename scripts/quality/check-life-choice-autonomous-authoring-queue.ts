import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const SOURCE_PATH = 'data/visual/all-character-life-choice-author-decision-packet-v1.json';
const QUEUE_PATH = 'data/visual/all-character-life-choice-autonomous-authoring-queue-v1.json';
const LOG_PATH = 'data/visual/all-character-life-choice-codex-author-decisions-v1.json';
const POLICY_PATH = 'data/character-assets/manifests/visual-autonomous-production-policy.v1.json';

function readJson(path: string): any {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function fail(message: string): never {
  throw new Error(`[life-choice-autonomous-authoring-queue] ${message}`);
}

const source = readJson(SOURCE_PATH);
const queue = readJson(QUEUE_PATH);
const log = readJson(LOG_PATH);
const policy = readJson(POLICY_PATH);

if (policy.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_AUTHORITY') fail('autonomous policy is not Current');
if (queue.status !== 'READY_CODEX_AUTHORING' || queue.authority !== POLICY_PATH || queue.sourcePacket !== SOURCE_PATH || queue.decisionLog !== LOG_PATH) fail('queue authority/lineage invalid');
if (queue.selection?.sourceDecisionState !== 'PENDING_HUMAN_AUTHOR_DECISION' || queue.selection?.currentOperationalState !== 'READY_CODEX_AUTHOR_DECISION') fail('legacy-to-current decision-state adapter invalid');
if (queue.authoringContract?.executor !== 'CODEX' || queue.authoringContract?.intermediateHumanReviewRequired !== false) fail('Codex authoring delegation invalid');
if (queue.authoringContract?.imageOutputMayDecide !== false || queue.authoringContract?.mayInventUnrelatedLore !== false) fail('authoring boundary weakened');

const sourceDecisions = (Array.isArray(source.characters) ? source.characters : []).flatMap((character: any) =>
  (Array.isArray(character.decisions) ? character.decisions : []).map((decision: any) => ({
    ...decision,
    characterId: character.characterId,
  })),
);
const sourceIds = new Set(sourceDecisions.map((decision: any) => decision.id));
if (sourceDecisions.length !== 42 || sourceIds.size !== 42) fail(`source decision count/id uniqueness must be 42, got ${sourceDecisions.length}/${sourceIds.size}`);
for (const decision of sourceDecisions) {
  if (decision.decisionState !== 'PENDING_HUMAN_AUTHOR_DECISION') fail(`${decision.id}: legacy source state changed unexpectedly`);
}

const expectedPartition = {
  bodyAdornment: 16,
  skinCoverage: 5,
  personalGrooming: 6,
  footwearGroundInterface: 5,
  accessoryPropInventory: 5,
  materialWearMaintenance: 5,
};
for (const [domain, expected] of Object.entries(expectedPartition)) {
  const actual = sourceDecisions.filter((decision: any) => decision.domain === domain).length;
  if (actual !== expected) fail(`${domain}: source expected ${expected}, got ${actual}`);
  if (queue.partition?.[domain] !== expected) fail(`${domain}: queue partition drifted`);
}
if (queue.partition?.total !== 42 || queue.selection?.expectedCount !== 42) fail('queue total must remain 42');

if (log.authority !== POLICY_PATH || log.queue !== QUEUE_PATH || log.sourcePacket !== SOURCE_PATH) fail('decision log lineage invalid');
const decisions = Array.isArray(log.decisions) ? log.decisions : [];
if (log.expectedDecisionCount !== 42 || log.materializedDecisionCount !== decisions.length || log.remainingDecisionCount !== 42 - decisions.length) fail('decision log counts invalid');
if (queue.completion?.decisionsRequired !== 42 || queue.completion?.decisionsMaterialized !== decisions.length || queue.completion?.remaining !== 42 - decisions.length) fail('queue completion counts must mirror decision log');

const seen = new Set<string>();
for (const decision of decisions) {
  if (!sourceIds.has(decision.decisionId)) fail(`unknown decisionId in log: ${decision.decisionId}`);
  if (seen.has(decision.decisionId)) fail(`duplicate decisionId in log: ${decision.decisionId}`);
  seen.add(decision.decisionId);
  const sourceDecision = sourceDecisions.find((entry: any) => entry.id === decision.decisionId);
  if (!sourceDecision) fail(`source decision not found: ${decision.decisionId}`);
  if (decision.characterId !== sourceDecision.characterId || decision.domain !== sourceDecision.domain) fail(`${decision.decisionId}: character/domain drifted from source`);
  if (!['CODEX_AUTHOR_DECISION_MATERIALIZED', 'EXPLICIT_NON_REQUIRED_WITH_REASON'].includes(decision.status)) fail(`${decision.decisionId}: invalid status ${decision.status}`);
  for (const key of ['previousState', 'decision', 'reason']) {
    if (typeof decision[key] !== 'string' || decision[key].trim() === '') fail(`${decision.decisionId}: ${key} is required`);
  }
  for (const key of ['evidencePaths', 'conflictsConsidered', 'forbiddenImageInferences', 'authorityUpdates']) {
    if (!Array.isArray(decision[key])) fail(`${decision.decisionId}: ${key} must be an array`);
  }
  if (decision.evidencePaths.length === 0) fail(`${decision.decisionId}: at least one evidence path is required`);
}

const complete = decisions.length === 42;
if (queue.completion?.complete !== complete || log.completion?.complete !== complete) fail('completion flags must match materialized count');
if (complete) {
  if (log.status !== 'AUTHORING_COMPLETE') fail('completed log must be AUTHORING_COMPLETE');
} else if (log.status !== 'AUTHORING_IN_PROGRESS') {
  fail('incomplete log must remain AUTHORING_IN_PROGRESS');
}

console.log(JSON.stringify({
  status: 'PASS',
  sourceDecisionCount: sourceDecisions.length,
  codexDelegatedCount: queue.selection.expectedCount,
  materializedDecisionCount: decisions.length,
  remainingDecisionCount: 42 - decisions.length,
  intermediateHumanReviewRequired: queue.authoringContract.intermediateHumanReviewRequired,
}, null, 2));
