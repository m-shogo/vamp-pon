import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const SOURCE_PATH = 'data/visual/all-character-life-choice-author-decision-packet-v1.json';
const QUEUE_PATH = 'data/visual/all-character-life-choice-autonomous-authoring-queue-v1.json';
const LOG_PATH = 'data/visual/all-character-life-choice-codex-author-decisions-v1.json';
const POLICY_PATH = 'data/character-assets/manifests/visual-autonomous-production-policy.v1.json';

function readJson(path: string): any { return JSON.parse(readFileSync(resolve(root, path), 'utf8')); }
function fail(message: string): never { throw new Error(`[life-choice-autonomous-authoring-queue] ${message}`); }

const source = readJson(SOURCE_PATH);
const queue = readJson(QUEUE_PATH);
const log = readJson(LOG_PATH);
const policy = readJson(POLICY_PATH);

if (policy.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_AUTHORITY') fail('autonomous policy is not Current');
if (queue.status !== 'COMPLETE_CODEX_AUTHORING' || queue.authority !== POLICY_PATH || queue.sourcePacket !== SOURCE_PATH || queue.decisionLog !== LOG_PATH) fail('Current queue authority/lineage invalid');
if (queue.selection?.sourceDecisionState !== 'PENDING_HUMAN_AUTHOR_DECISION' || queue.selection?.currentOperationalState !== 'CODEX_AUTHOR_DECISION_MATERIALIZED') fail('legacy-to-current state adapter invalid');
if (queue.authoringContract?.executor !== 'CODEX' || queue.authoringContract?.intermediateHumanReviewRequired !== false || queue.authoringContract?.imageOutputMayDecide !== false) fail('Codex authoring boundary invalid');

const sourceDecisions = (Array.isArray(source.characters) ? source.characters : []).flatMap((character: any) =>
  (Array.isArray(character.decisions) ? character.decisions : []).map((decision: any) => ({ ...decision, characterId: character.characterId })),
);
const sourceIds = sourceDecisions.map((decision: any) => decision.id);
const sourceIdSet = new Set(sourceIds);
if (sourceIds.length !== 42 || sourceIdSet.size !== 42) fail(`legacy source must remain exact 42-item evidence: ${sourceIds.length}/${sourceIdSet.size}`);
if (sourceDecisions.some((decision: any) => decision.decisionState !== 'PENDING_HUMAN_AUTHOR_DECISION')) fail('legacy Human-pending states must remain unchanged as audit evidence');

const expectedPartition: Record<string, number> = { bodyAdornment: 16, skinCoverage: 5, personalGrooming: 6, footwearGroundInterface: 5, accessoryPropInventory: 5, materialWearMaintenance: 5 };
for (const [domain, expected] of Object.entries(expectedPartition)) {
  const actual = sourceDecisions.filter((decision: any) => decision.domain === domain).length;
  if (actual !== expected || queue.partition?.[domain] !== expected) fail(`${domain}: partition drift ${actual}/${queue.partition?.[domain]}`);
}

if (log.schemaVersion !== 2 || log.status !== 'AUTHORING_COMPLETE') fail('Current Codex decision log must be complete schema v2');
if (log.authority !== POLICY_PATH || log.queue !== QUEUE_PATH || log.sourcePacket !== SOURCE_PATH) fail('decision log lineage invalid');
if (log.expectedDecisionCount !== 42 || log.materializedDecisionCount !== 42 || log.remainingDecisionCount !== 0) fail('Current decision counts must be 42/42/0');
const covered: string[] = Array.isArray(log.coveredDecisionIds) ? log.coveredDecisionIds : [];
if (covered.length !== 42 || new Set(covered).size !== 42) fail('coveredDecisionIds must contain 42 unique ids');
for (const id of sourceIds) if (!covered.includes(id)) fail(`missing Current materialization: ${id}`);
for (const id of covered) if (!sourceIdSet.has(id)) fail(`unknown Current materialization: ${id}`);

const explicit = log.decisionStrategy?.explicitResolutions ?? {};
const explicitIds = Object.keys(explicit);
if (explicitIds.length !== 14) fail(`expected 14 explicit OPEN/pending resolutions, got ${explicitIds.length}`);
for (const [id, decision] of Object.entries(explicit)) {
  if (!sourceIdSet.has(id)) fail(`explicit resolution not in legacy source: ${id}`);
  if (typeof decision !== 'string' || decision.trim() === '') fail(`empty explicit resolution: ${id}`);
}
for (const id of sourceIds.filter((id: string) => !id.startsWith('core5.'))) {
  if (!(id in explicit)) fail(`non-Core5 OPEN decision requires explicit resolution: ${id}`);
}
if (log.decisionStrategy?.core5Default?.decision !== 'ACCEPT_SOURCE_CANDIDATE_AS_CURRENT_PRODUCTION_AUTHORITY') fail('Core5 default production promotion missing');
if (log.globalBoundary?.imageOutputMayBeAuthority !== false || log.globalBoundary?.intermediateHumanReviewRequired !== false) fail('Current image/Human boundary weakened');
if (queue.completion?.decisionsRequired !== 42 || queue.completion?.decisionsMaterialized !== 42 || queue.completion?.remaining !== 0 || queue.completion?.complete !== true) fail('queue completion must be 42/42');
if (log.completion?.complete !== true) fail('decision log completion flag missing');

console.log(JSON.stringify({ status: 'PASS', legacyAuditPending: 42, currentCodexMaterialized: 42, explicitOpenResolutions: explicitIds.length, intermediateHumanReviewRequired: false }, null, 2));
