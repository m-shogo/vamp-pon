import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
] as const;

const domainSelectors = {
  bodyAdornment: ['piercingPolicy', 'tattooPolicy', 'jewelryPolicy'],
  skinCoverage: ['exposurePreference'],
  personalGrooming: ['makeupPolicy', 'nailPolicy', 'hairGroomingBehavior'],
  accessoryPropInventory: ['bagPocketBehavior', 'acquisitionPreference'],
  footwearGroundInterface: ['footwearPreference'],
  materialWearMaintenance: ['materialPreference', 'maintenanceBehavior', 'clothingWearHabits'],
} as const;

type AuditState =
  | 'SOURCE_BACKED_LOCKED'
  | 'SOURCE_BACKED_ABSENCE'
  | 'SOURCE_CONSTRAINED_UNRESOLVED'
  | 'AUTHOR_CANDIDATE_REVIEW_REQUIRED';

type Evidence = { path: string; source: string[]; values: string[] };
const sourceBacked = new Set(['CURRENT_CANON', 'APPEARANCE_SOURCE', 'USER_CONFIRMED']);
const authorCandidate = new Set(['AUTHOR_CANDIDATE']);
const absenceTokens = new Set([
  'NO_CURRENT_INTEREST', 'NONE', 'NO', 'ABSENT', 'NO_FOOTWEAR', 'BAREFOOT',
  'SOURCE_BACKED_ABSENCE', 'none', 'no', 'absent', 'barefoot', 'no-footwear',
]);

const loadText = (path: string) => readFileSync(resolve(root, path), 'utf8');
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');

function collect(node: any, path = ''): { sources: string[]; values: string[]; paths: string[] } {
  const sources: string[] = [];
  const values: string[] = [];
  const paths: string[] = [];
  const visit = (value: any, cursor: string): void => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      if (value.length === 0) values.push('[]');
      value.forEach((entry, index) => visit(entry, `${cursor}[${index}]`));
      return;
    }
    if (typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        const next = cursor ? `${cursor}.${key}` : key;
        if (key === 'source' && typeof child === 'string') {
          sources.push(child);
          paths.push(next);
        } else {
          visit(child, next);
        }
      }
      return;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      values.push(String(value));
      paths.push(cursor);
    }
  };
  visit(node, path);
  return { sources: [...new Set(sources)], values: [...new Set(values)], paths: [...new Set(paths)] };
}

function isExplicitAbsence(values: string[]): boolean {
  const meaningful = values.filter((value) => value !== '[]' && value !== 'true' && value !== 'false');
  if (!meaningful.length) return false;
  return meaningful.every((value) => absenceTokens.has(value) || /^NO[_ -]/i.test(value) || /^(none|absent|barefoot|no-footwear)$/i.test(value));
}

function classify(evidence: Evidence[]): { state: AuditState; requiresHumanDecision: boolean; reason: string } {
  if (!evidence.length) return {
    state: 'SOURCE_CONSTRAINED_UNRESOLVED', requiresHumanDecision: true,
    reason: 'No character-specific profile field exists for this domain; missing evidence is not absence.',
  };
  const sources = evidence.flatMap((entry) => entry.source);
  const values = evidence.flatMap((entry) => entry.values);
  if (sources.some((source) => authorCandidate.has(source)) || values.some((value) => /OPEN_AUTHOR_DECISION|AUTHOR_CANDIDATE/i.test(value))) {
    return {
      state: 'AUTHOR_CANDIDATE_REVIEW_REQUIRED', requiresHumanDecision: true,
      reason: 'At least one character-specific value is AUTHOR_CANDIDATE or explicitly open for author decision.',
    };
  }
  if (sources.some((source) => sourceBacked.has(source))) {
    if (isExplicitAbsence(values)) return {
      state: 'SOURCE_BACKED_ABSENCE', requiresHumanDecision: false,
      reason: 'Character-specific source evidence explicitly records absence/non-adoption.',
    };
    return {
      state: 'SOURCE_BACKED_LOCKED', requiresHumanDecision: false,
      reason: 'Character-specific CURRENT_CANON/APPEARANCE_SOURCE/USER_CONFIRMED evidence exists without unresolved author-candidate values.',
    };
  }
  return {
    state: 'SOURCE_CONSTRAINED_UNRESOLVED', requiresHumanDecision: true,
    reason: 'Fields exist but do not carry a recognized character-specific authoritative source class.',
  };
}

const characters: any[] = [];
const sourceProfileHashes: Record<string, string> = {};
for (const profilePath of profilePaths) {
  const text = loadText(profilePath);
  sourceProfileHashes[profilePath] = sha256(text);
  const profile = JSON.parse(text);
  for (const character of profile.characters ?? []) {
    const domains: Record<string, any> = {};
    for (const [domain, selectors] of Object.entries(domainSelectors)) {
      const evidence: Evidence[] = [];
      for (const key of selectors) {
        if (!(key in character)) continue;
        const collected = collect(character[key], key);
        evidence.push({ path: `${profilePath}#characters/${character.id}/${key}`, source: collected.sources, values: collected.values });
      }
      const classification = classify(evidence);
      domains[domain] = {
        state: classification.state,
        requiresHumanDecision: classification.requiresHumanDecision,
        imageModelFreedom: false,
        canonPromotionBlocked: classification.requiresHumanDecision,
        unresolvedDefault: classification.requiresHumanDecision ? 'SOURCE_CONSTRAINED_DOMAIN_DEFAULT_ONLY' : null,
        reason: classification.reason,
        evidence,
      };
    }
    characters.push({ id: character.id, name: character.name, sourceProfile: profilePath, domains });
  }
}

if (characters.length !== 36 || new Set(characters.map((character) => character.id)).size !== 36) {
  throw new Error(`[life-choice-gap-audit] expected 36 unique characters, got ${characters.length}/${new Set(characters.map((character) => character.id)).size}`);
}

const countsByState: Record<AuditState, number> = {
  SOURCE_BACKED_LOCKED: 0,
  SOURCE_BACKED_ABSENCE: 0,
  SOURCE_CONSTRAINED_UNRESOLVED: 0,
  AUTHOR_CANDIDATE_REVIEW_REQUIRED: 0,
};
for (const character of characters) for (const domain of Object.values(character.domains) as any[]) countsByState[domain.state as AuditState] += 1;
const reviewRequiredCount = countsByState.SOURCE_CONSTRAINED_UNRESOLVED + countsByState.AUTHOR_CANDIDATE_REVIEW_REQUIRED;

const audit = {
  id: 'yoru-no-shirube-all-character-life-choice-visual-gap-audit-v1',
  date: '2026-08-13',
  status: 'DERIVED_REVIEW_ARTIFACT_NON_CANON',
  scopeCount: 36,
  domainCount: Object.keys(domainSelectors).length,
  stateVocabulary: ['SOURCE_BACKED_LOCKED','SOURCE_BACKED_ABSENCE','SOURCE_CONSTRAINED_UNRESOLVED','AUTHOR_CANDIDATE_REVIEW_REQUIRED'],
  sourceProfileHashes,
  safety: {
    imageModelFreedom: false,
    generatedImageMayResolveGap: false,
    missingEvidenceMeansAbsence: false,
    authorCandidateCreatesCanon: false,
    genericPolicyMayServeAsCharacterEvidence: false,
  },
  summary: { totalDomainDecisions: characters.length * Object.keys(domainSelectors).length, countsByState, reviewRequiredCount },
  characters,
};

const markdown = [
  '# All Character Life-Choice Visual Gap Audit v1',
  '',
  'Status: `DERIVED_REVIEW_ARTIFACT_NON_CANON`',
  '',
  `Scope: ${characters.length} characters × ${Object.keys(domainSelectors).length} domains = ${characters.length * Object.keys(domainSelectors).length} decisions.`,
  '',
  'This audit is derived only from character-specific living visual profiles. Generic production/policy files are never accepted as character evidence. Missing evidence is unresolved, never absence. Generated images cannot resolve or Canonize a gap.',
  '',
  '## Counts',
  '',
  ...Object.entries(countsByState).map(([state, count]) => `- ${state}: ${count}`),
  `- REVIEW_REQUIRED_TOTAL: ${reviewRequiredCount}`,
  '',
  '## Per character',
  '',
  ...characters.flatMap((character) => [
    `### ${character.name} / ${character.id}`,
    '',
    ...Object.entries(character.domains).map(([domain, value]: [string, any]) => `- ${domain}: ${value.state}${value.requiresHumanDecision ? ' — HUMAN REVIEW REQUIRED' : ''}`),
    '',
  ]),
].join('\n');

if (process.argv.includes('--emit')) {
  console.log('AUDIT_JSON_BEGIN');
  console.log(JSON.stringify(audit, null, 2));
  console.log('AUDIT_JSON_END');
  console.log('AUDIT_MARKDOWN_BEGIN');
  console.log(markdown);
  console.log('AUDIT_MARKDOWN_END');
} else {
  console.log(`[life-choice-gap-audit] OK: ${characters.length}/36 characters, ${audit.summary.totalDomainDecisions} domain decisions, ${reviewRequiredCount} require author review`);
  console.log(JSON.stringify(audit.summary));
}
