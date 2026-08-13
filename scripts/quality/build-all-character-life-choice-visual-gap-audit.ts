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

type AuditState = 'SOURCE_BACKED_LOCKED' | 'SOURCE_BACKED_ABSENCE' | 'SOURCE_CONSTRAINED_UNRESOLVED' | 'AUTHOR_CANDIDATE_REVIEW_REQUIRED';
type Evidence = { path: string; sources: string[]; values: string[] };

const sourceBacked = new Set(['CURRENT_CANON', 'APPEARANCE_SOURCE', 'USER_CONFIRMED']);
const authorCandidate = new Set(['AUTHOR_CANDIDATE']);
const absenceTokens = new Set(['NO_CURRENT_INTEREST','NONE','NO','ABSENT','NO_FOOTWEAR','BAREFOOT','SOURCE_BACKED_ABSENCE','none','no','absent','barefoot','no-footwear']);
const loadText = (path: string) => readFileSync(resolve(root, path), 'utf8');
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');

function collect(node: any): { sources: string[]; values: string[] } {
  const sources: string[] = [];
  const values: string[] = [];
  const visit = (value: any): void => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) { if (!value.length) values.push('[]'); else value.forEach(visit); return; }
    if (typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        if (key === 'source' && typeof child === 'string') sources.push(child); else visit(child);
      }
      return;
    }
    if (['string','number','boolean'].includes(typeof value)) values.push(String(value));
  };
  visit(node);
  return { sources: [...new Set(sources)], values: [...new Set(values)] };
}

function explicitAbsence(values: string[]): boolean {
  const meaningful = values.filter((value) => !['[]','true','false'].includes(value));
  return meaningful.length > 0 && meaningful.every((value) => absenceTokens.has(value) || /^NO[_ -]/i.test(value) || /^(none|absent|barefoot|no-footwear)$/i.test(value));
}

function classify(evidence: Evidence[]): { state: AuditState; requiresHumanDecision: boolean } {
  if (!evidence.length) return { state: 'SOURCE_CONSTRAINED_UNRESOLVED', requiresHumanDecision: true };
  const sources = evidence.flatMap((entry) => entry.sources);
  const values = evidence.flatMap((entry) => entry.values);
  if (sources.some((source) => authorCandidate.has(source)) || values.some((value) => /OPEN_AUTHOR_DECISION|AUTHOR_CANDIDATE/i.test(value))) {
    return { state: 'AUTHOR_CANDIDATE_REVIEW_REQUIRED', requiresHumanDecision: true };
  }
  if (sources.some((source) => sourceBacked.has(source))) {
    return explicitAbsence(values)
      ? { state: 'SOURCE_BACKED_ABSENCE', requiresHumanDecision: false }
      : { state: 'SOURCE_BACKED_LOCKED', requiresHumanDecision: false };
  }
  return { state: 'SOURCE_CONSTRAINED_UNRESOLVED', requiresHumanDecision: true };
}

const sourceProfileHashes: Record<string,string> = {};
const characters: any[] = [];
for (const profilePath of profilePaths) {
  const text = loadText(profilePath);
  sourceProfileHashes[profilePath] = sha256(text);
  const profile = JSON.parse(text);
  for (const character of profile.characters ?? []) {
    const domains: Record<string,any> = {};
    for (const [domain, selectors] of Object.entries(domainSelectors)) {
      const evidence: Evidence[] = [];
      for (const key of selectors) {
        if (!(key in character)) continue;
        const collected = collect(character[key]);
        evidence.push({ path: `${profilePath}#characters/${character.id}/${key}`, sources: collected.sources, values: collected.values });
      }
      const result = classify(evidence);
      domains[domain] = {
        state: result.state,
        requiresHumanDecision: result.requiresHumanDecision,
        imageModelFreedom: false,
        canonPromotionBlocked: result.requiresHumanDecision,
        unresolvedDefault: result.requiresHumanDecision ? 'SOURCE_CONSTRAINED_DOMAIN_DEFAULT_ONLY' : null,
        evidencePaths: evidence.map((entry) => entry.path),
      };
    }
    characters.push({ id: character.id, name: character.name, sourceProfile: profilePath, domains });
  }
}

if (characters.length !== 36 || new Set(characters.map((character) => character.id)).size !== 36) throw new Error('[life-choice-gap-audit] expected 36 unique characters');

const countsByState: Record<AuditState,number> = {
  SOURCE_BACKED_LOCKED: 0,
  SOURCE_BACKED_ABSENCE: 0,
  SOURCE_CONSTRAINED_UNRESOLVED: 0,
  AUTHOR_CANDIDATE_REVIEW_REQUIRED: 0,
};
for (const character of characters) for (const value of Object.values(character.domains) as any[]) countsByState[value.state as AuditState] += 1;
const reviewRequiredCount = countsByState.SOURCE_CONSTRAINED_UNRESOLVED + countsByState.AUTHOR_CANDIDATE_REVIEW_REQUIRED;

const audit = {
  id: 'yoru-no-shirube-all-character-life-choice-visual-gap-audit-v1',
  date: '2026-08-13',
  status: 'DERIVED_REVIEW_ARTIFACT_NON_CANON',
  scopeCount: 36,
  domainCount: 6,
  stateVocabulary: ['SOURCE_BACKED_LOCKED','SOURCE_BACKED_ABSENCE','SOURCE_CONSTRAINED_UNRESOLVED','AUTHOR_CANDIDATE_REVIEW_REQUIRED'],
  sourceProfileHashes,
  safety: { imageModelFreedom:false, generatedImageMayResolveGap:false, missingEvidenceMeansAbsence:false, authorCandidateCreatesCanon:false, genericPolicyMayServeAsCharacterEvidence:false },
  summary: { totalDomainDecisions:216, countsByState, reviewRequiredCount },
  characters,
};

const markdown = [
  '# All Character Life-Choice Visual Gap Audit v1','',
  'Status: `DERIVED_REVIEW_ARTIFACT_NON_CANON`','',
  'Scope: 36 characters × 6 domains = 216 decisions.','',
  'Derived only from character-specific living visual profiles. Missing evidence is unresolved, never absence. Generated images cannot resolve or Canonize a gap.','',
  '## Counts','',
  ...Object.entries(countsByState).map(([state,count]) => `- ${state}: ${count}`),
  `- REVIEW_REQUIRED_TOTAL: ${reviewRequiredCount}`,'',
  '## Per character','',
  ...characters.flatMap((character) => [`### ${character.name} / ${character.id}`,'',...Object.entries(character.domains).map(([domain,value]:[string,any]) => `- ${domain}: ${value.state}${value.requiresHumanDecision ? ' — HUMAN REVIEW REQUIRED' : ''}`),'']),
].join('\n');

if (process.argv.includes('--emit-compact') || process.argv.includes('--emit')) {
  console.log('AUDIT_JSON_BEGIN');
  console.log(JSON.stringify(audit, null, 2));
  console.log('AUDIT_JSON_END');
  console.log('AUDIT_MARKDOWN_BEGIN');
  console.log(markdown);
  console.log('AUDIT_MARKDOWN_END');
} else {
  console.log(`[life-choice-gap-audit] OK: 36/36 characters, 216 domain decisions, ${reviewRequiredCount} require author review`);
  console.log(JSON.stringify(audit.summary));
}
