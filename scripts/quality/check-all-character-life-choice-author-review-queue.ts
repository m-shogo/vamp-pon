import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const auditPath = 'data/visual/all-character-life-choice-visual-gap-audit-v1.json';
const queuePath = 'data/visual/all-character-life-choice-author-review-queue-v1.json';

const auditText = readFileSync(resolve(root, auditPath), 'utf8');
const audit = JSON.parse(auditText);
const queue = JSON.parse(readFileSync(resolve(root, queuePath), 'utf8'));
const auditSha256 = createHash('sha256').update(auditText).digest('hex');

const expectedCore5 = (audit.core5AuthorCandidates ?? []).map((entry: any) => entry.id);
const expectedDomains = audit.domains ?? [];
const expectedPriority: Record<string,string> = {
  bodyAdornment: 'P0',
  skinCoverage: 'P0',
  personalGrooming: 'P1',
  footwearGroundInterface: 'P1',
  accessoryPropInventory: 'P2',
  materialWearMaintenance: 'P2',
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[life-choice-author-review-queue] ${message}`);
}

assert(queue.status === 'DERIVED_AUTHOR_REVIEW_QUEUE_NON_CANON', 'status drift');
assert(queue.sourceAudit === auditPath, 'source audit path drift');
assert(queue.sourceAuditSha256 === auditSha256, 'source audit hash is stale');
assert(queue.scopeCount === 36, 'scope count must remain 36');
assert(queue.safety?.requiresHumanDecision === true, 'human decision must remain required');
assert(queue.safety?.canonPromotionBlocked === true, 'Canon promotion must remain blocked');
assert(queue.safety?.imageModelFreedom === false, 'image model freedom must remain false');
assert(queue.safety?.generatedImageMayCloseItem === false, 'generated images must not close review items');
assert(queue.safety?.candidateGenerationPolicy === 'MAY_USE_DOMAIN_UNRESOLVED_DEFAULT_ONLY', 'candidate generation policy drift');

assert(JSON.stringify(queue.core5) === JSON.stringify(expectedCore5), 'Core5 roster drift');
assert(JSON.stringify(queue.domainPriority) === JSON.stringify(expectedPriority), 'domain priority drift');
assert(expectedDomains.length === 6, 'audit domain count must remain six');
for (const domain of expectedDomains) assert(queue.domainPriority?.[domain] === expectedPriority[domain], `missing priority for ${domain}`);

const expectedReviewCount = expectedCore5.length * expectedDomains.length;
const countsByPriority = { P0: 0, P1: 0, P2: 0 };
for (const domain of expectedDomains) {
  const priority = expectedPriority[domain] as keyof typeof countsByPriority;
  countsByPriority[priority] += expectedCore5.length;
}
assert(queue.summary?.core5ReviewItemCount === expectedReviewCount, 'Core5 review-item count drift');
assert(JSON.stringify(queue.summary?.countsByPriority) === JSON.stringify(countsByPriority), 'priority counts drift');

const unresolvedGroups = audit.sourceConstrainedUnresolvedGroups ?? [];
assert(unresolvedGroups.length === 2, 'expected current and future unresolved groups');
const expectedBacklog = unresolvedGroups.map((group: any, index: number) => ({
  id: index === 0 ? 'PROFILE_GAP_CURRENT_ROSTER' : 'PROFILE_GAP_FUTURE_ROSTER',
  backlogTier: index === 0 ? 'P3_CURRENT_ROSTER_PROFILE_EXPANSION' : 'P4_FUTURE_ROSTER_PROFILE_EXPANSION',
  sourceProfile: group.sourceProfile,
  characterCount: (group.characters ?? []).length,
  unresolvedDecisionCount: (group.characters ?? []).length * expectedDomains.length,
}));
assert(JSON.stringify(queue.profileExpansionBacklog) === JSON.stringify(expectedBacklog), 'profile-expansion backlog is stale');

const expansionCharacters = expectedBacklog.reduce((sum: number, entry: any) => sum + entry.characterCount, 0);
const expansionDecisions = expectedBacklog.reduce((sum: number, entry: any) => sum + entry.unresolvedDecisionCount, 0);
assert(queue.summary?.profileExpansionBacklogCount === expectedBacklog.length, 'backlog count drift');
assert(queue.summary?.profileExpansionCharacterCount === expansionCharacters, 'profile-expansion character count drift');
assert(queue.summary?.profileExpansionDecisionCount === expansionDecisions, 'profile-expansion decision count drift');
assert(expectedReviewCount + expansionDecisions === 216, '36×6 decision accounting must remain 216');

console.log(`[life-choice-author-review-queue] OK: ${expectedReviewCount} Core5 review items + ${expansionDecisions} unresolved profile-expansion decisions`);
