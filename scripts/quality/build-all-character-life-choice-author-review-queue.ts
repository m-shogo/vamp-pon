import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const auditPath = 'data/visual/all-character-life-choice-visual-gap-audit-v1.json';
const auditText = readFileSync(resolve(root, auditPath), 'utf8');
const audit = JSON.parse(auditText);
const auditSha256 = createHash('sha256').update(auditText).digest('hex');

const domainPriority: Record<string,string> = {
  bodyAdornment: 'P0', skinCoverage: 'P0',
  personalGrooming: 'P1', footwearGroundInterface: 'P1',
  accessoryPropInventory: 'P2', materialWearMaintenance: 'P2',
};
const reviewQuestions: Record<string,string[]> = {
  bodyAdornment: ['Which existing candidate choices are accepted, rejected, or remain open?', 'Are presence/absence, placement, count, left/right and coverage explicitly authorized?'],
  skinCoverage: ['Which baseline coverage/exposure boundaries are accepted?', 'Which pose, weather or state changes are explicitly allowed without changing identity?'],
  personalGrooming: ['Which makeup, nail, facial-hair or grooming choices are accepted or explicitly absent?', 'Which details must remain neutral rather than inferred from gender/age/role?'],
  accessoryPropInventory: ['Which removable objects are baseline inventory versus situational?', 'Where are they worn, held or stored without inventing relationship meaning?'],
  footwearGroundInterface: ['Which footwear/barefoot baseline is accepted?', 'What sole/heel/closure/ground-contact details are identity-bearing versus unresolved construction?'],
  materialWearMaintenance: ['Which material and maintenance habits are accepted?', 'What wear/repair may appear without becoming personality or Canon evidence?'],
};

const items: any[] = [];
for (const character of audit.core5AuthorCandidates ?? []) {
  for (const domain of audit.domains ?? []) {
    items.push({
      id: `${character.id}:${domain}`,
      characterId: character.id,
      characterName: character.name,
      domain,
      sourceState: 'AUTHOR_CANDIDATE_REVIEW_REQUIRED',
      priority: domainPriority[domain],
      sourceAudit: auditPath,
      sourceProfile: 'data/visual/core5-living-visual-profiles-v1.json',
      evidenceSelectors: audit.core5EvidenceSelectors?.[domain] ?? [],
      requiresHumanDecision: true,
      canonPromotionBlocked: true,
      imageModelFreedom: false,
      candidateGenerationPolicy: 'MAY_USE_DOMAIN_UNRESOLVED_DEFAULT_ONLY',
      generatedImageMayCloseItem: false,
      closeOnlyBy: ['SOURCE_BACKED_LOCKED','SOURCE_BACKED_ABSENCE'],
      reviewQuestions: reviewQuestions[domain] ?? [],
    });
  }
}

const profileExpansionBacklog = (audit.sourceConstrainedUnresolvedGroups ?? []).map((group: any, index: number) => ({
  id: index === 0 ? 'PROFILE_GAP_CURRENT_ROSTER' : 'PROFILE_GAP_FUTURE_ROSTER',
  backlogTier: index === 0 ? 'P3_CURRENT_ROSTER_PROFILE_EXPANSION' : 'P4_FUTURE_ROSTER_PROFILE_EXPANSION',
  sourceProfile: group.sourceProfile,
  characterCount: (group.characters ?? []).length,
  characters: group.characters,
  domains: audit.domains,
  unresolvedDecisionCount: (group.characters ?? []).length * (audit.domains ?? []).length,
  requiresHumanDecision: true,
  canonPromotionBlocked: true,
  imageModelFreedom: false,
  candidateGenerationPolicy: 'MAY_USE_DOMAIN_UNRESOLVED_DEFAULT_ONLY',
  generatedImageMayCloseItem: false,
  requiredWork: 'Add character-specific life-choice profile fields from source/author review; do not synthesize values from generic fidelity policy.',
}));

const countsByPriority = { P0:0, P1:0, P2:0 };
for (const item of items) countsByPriority[item.priority as keyof typeof countsByPriority] += 1;

const queue = {
  id: 'yoru-no-shirube-all-character-life-choice-author-review-queue-v1',
  date: '2026-08-14',
  status: 'DERIVED_AUTHOR_REVIEW_QUEUE_NON_CANON',
  sourceAudit: auditPath,
  sourceAuditSha256: auditSha256,
  scopeCount: 36,
  safety: {
    requiresHumanDecision: true,
    canonPromotionBlocked: true,
    imageModelFreedom: false,
    generatedImageMayCloseItem: false,
    candidateGenerationPolicy: 'MAY_USE_DOMAIN_UNRESOLVED_DEFAULT_ONLY',
  },
  summary: {
    core5ReviewItemCount: items.length,
    countsByPriority,
    profileExpansionBacklogCount: profileExpansionBacklog.length,
    profileExpansionCharacterCount: profileExpansionBacklog.reduce((sum:number, entry:any) => sum + entry.characterCount, 0),
    profileExpansionDecisionCount: profileExpansionBacklog.reduce((sum:number, entry:any) => sum + entry.unresolvedDecisionCount, 0),
  },
  items,
  profileExpansionBacklog,
};

const markdown = [
  '# All Character Life-Choice Author Review Queue v1','',
  'Status: `DERIVED_AUTHOR_REVIEW_QUEUE_NON_CANON`','',
  `Core5 review items: ${items.length}. Profile-expansion backlog: ${queue.summary.profileExpansionCharacterCount} characters / ${queue.summary.profileExpansionDecisionCount} decisions.`,'',
  'Generated images cannot close review items. Only explicit source/author review into SOURCE_BACKED_LOCKED or SOURCE_BACKED_ABSENCE closes a domain.','',
  '## Priority','',
  `- P0: ${countsByPriority.P0} — Core5 body adornment and coverage/exposure`,
  `- P1: ${countsByPriority.P1} — Core5 grooming and footwear`,
  `- P2: ${countsByPriority.P2} — Core5 removable inventory and material/maintenance`,
  '- P3_CURRENT_ROSTER_PROFILE_EXPANSION — current roster characters missing dedicated life-choice fields',
  '- P4_FUTURE_ROSTER_PROFILE_EXPANSION — future roster characters missing dedicated life-choice fields','',
  '## Core5 review items','',
  ...items.map((item:any) => `- ${item.priority} — ${item.characterName} / ${item.characterId} — ${item.domain}`),
  '', '## Profile-expansion backlog','',
  ...profileExpansionBacklog.flatMap((entry:any) => [`### ${entry.backlogTier}`,'',`- source: \`${entry.sourceProfile}\``,`- characters: ${entry.characters.map((c:any) => `${c.name}/${c.id}`).join(', ')}`,`- unresolved decisions: ${entry.unresolvedDecisionCount}`,'']),
].join('\n');

if (process.argv.includes('--emit')) {
  console.log('QUEUE_JSON_BEGIN');
  console.log(JSON.stringify(queue, null, 2));
  console.log('QUEUE_JSON_END');
  console.log('QUEUE_MARKDOWN_BEGIN');
  console.log(markdown);
  console.log('QUEUE_MARKDOWN_END');
} else {
  console.log(`[life-choice-review-queue] OK: ${items.length} Core5 review items, ${queue.summary.profileExpansionCharacterCount} profile-expansion characters`);
  console.log(JSON.stringify(queue.summary));
}
