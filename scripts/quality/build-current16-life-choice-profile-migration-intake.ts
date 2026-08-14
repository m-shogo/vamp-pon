import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const sourceProfile = 'data/visual/current21-extended-living-visual-profiles-v1.json';
const materializedPath = 'data/visual/current16-life-choice-profile-migration-intake-v1.json';
const text = readFileSync(resolve(root, sourceProfile), 'utf8');
const profile = JSON.parse(text);
const sourceProfileSha256 = createHash('sha256').update(text).digest('hex');

const domains = ['bodyAdornment','skinCoverage','personalGrooming','accessoryPropInventory','footwearGroundInterface','materialWearMaintenance'] as const;
const inheritedSource = 'AUTHOR_CANDIDATE_INHERITED_FROM_PROFILE_RULE';

function sourceKinds(value: unknown): string[] {
  const out = new Set<string>();
  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    const obj = node as Record<string,unknown>;
    if (typeof obj.source === 'string') out.add(obj.source);
    for (const child of Object.values(obj)) visit(child);
  };
  visit(value);
  if (!out.size) out.add(inheritedSource);
  return [...out].sort();
}

function markerPaths(value: unknown, kind: 'open'|'pending', prefix = ''): string[] {
  if (typeof value === 'string') {
    const open = /OPEN[\s_-]*AUTHOR[\s_-]*DECISION/i.test(value);
    const pending = /PENDING[\s_-]*REVIEW/i.test(value);
    return (kind === 'open' ? open : pending) ? [prefix] : [];
  }
  if (Array.isArray(value)) return value.flatMap((item,index) => markerPaths(item, kind, `${prefix}[${index}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string,unknown>).flatMap(([key,item]) => markerPaths(item, kind, prefix ? `${prefix}.${key}` : key));
  }
  return [];
}

function hairWearEvidence(wearHabits: unknown): string[] {
  if (!Array.isArray(wearHabits)) return [];
  return wearHabits.filter((item) => typeof item === 'string' && /(hair|fringe|clip|tie|lens|glasses)/i.test(item));
}

function entry(baseState: string, evidence: Record<string,unknown>) {
  const openAuthorDecisionPaths = markerPaths(evidence, 'open');
  const pendingReviewPaths = markerPaths(evidence, 'pending');
  let state = baseState;
  if (baseState !== 'NO_CHARACTER_SPECIFIC_EVIDENCE' && openAuthorDecisionPaths.length) {
    state = baseState.startsWith('PARTIAL_') ? 'PARTIAL_MIGRATION_EVIDENCE_WITH_OPEN_AUTHOR_DECISION' : 'MIGRATION_READY_WITH_OPEN_AUTHOR_DECISION';
  } else if (baseState !== 'NO_CHARACTER_SPECIFIC_EVIDENCE' && pendingReviewPaths.length) {
    state = baseState.startsWith('PARTIAL_') ? 'PARTIAL_MIGRATION_EVIDENCE_WITH_PENDING_REVIEW' : 'MIGRATION_READY_WITH_PENDING_REVIEW';
  }
  return {
    state,
    evidence,
    sourceKinds: sourceKinds(evidence),
    openAuthorDecisionPaths,
    pendingReviewPaths,
    migrationPolicy: 'COPY_SEMANTIC_EVIDENCE_ONLY_AFTER_HUMAN_SCHEMA_REVIEW',
    requiresHumanDecision: true,
    canonPromotionBlocked: true,
    imageModelFreedom: false,
    generatedImageMayCloseItem: false,
  };
}

const characters = (profile.characters ?? []).map((c: any) => {
  const adornment = c.bodyModification ? {
    piercing: c.bodyModification.piercing,
    tattoo: c.bodyModification.tattoo,
    jewelry: c.bodyModification.jewelry,
  } : {};
  const grooming = c.bodyModification ? {
    makeup: c.bodyModification.makeup,
    nails: c.bodyModification.nails,
    hairWearEvidence: hairWearEvidence(c.wearHabits),
  } : {};
  const accessory = {
    storage: c.clothing?.storage,
    relevantWearHabits: Array.isArray(c.wearHabits) ? c.wearHabits : [],
    acquisitionPreference: null,
  };
  const material = {
    materials: c.clothing?.materials,
    maintenance: c.maintenance,
    wearHabits: c.wearHabits,
  };
  const domainEntries = {
    bodyAdornment: entry(Object.keys(adornment).length === 3 ? 'MIGRATION_READY_AUTHOR_CANDIDATE' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', adornment),
    skinCoverage: entry(c.exposure ? 'MIGRATION_READY_AUTHOR_CANDIDATE' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', { exposure: c.exposure }),
    personalGrooming: entry((grooming.makeup !== undefined || grooming.nails !== undefined) ? 'PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', grooming),
    accessoryPropInventory: entry(c.clothing?.storage ? 'PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', accessory),
    footwearGroundInterface: entry(c.clothing?.footwear ? 'MIGRATION_READY_AUTHOR_CANDIDATE' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', { footwear: c.clothing?.footwear }),
    materialWearMaintenance: entry(c.clothing?.materials && c.maintenance ? 'MIGRATION_READY_AUTHOR_CANDIDATE' : 'PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW', material),
  };
  return { id: c.id, name: c.name, domains: domainEntries };
});

const counts: Record<string,number> = {};
for (const c of characters) for (const d of domains) {
  const state = c.domains[d].state;
  counts[state] = (counts[state] ?? 0) + 1;
}

const policy = {
  noNewCharacterFactsAuthored: true,
  genericPolicyIsNotCharacterEvidence: true,
  inheritedProfileValuesRemainAuthorCandidate: true,
  migrationDoesNotEqualCanonPromotion: true,
  openAndPendingMarkersMustRemainUnresolved: true,
  requiresHumanSchemaReview: true,
  imageModelFreedom: false,
  generatedImageMayCloseItem: false,
};

const intake = {
  id: 'yoru-no-shirube-current16-life-choice-profile-migration-intake-v1',
  date: '2026-08-14',
  status: 'DERIVED_SCHEMA_MIGRATION_INTAKE_NON_CANON',
  sourceProfile,
  sourceProfileSha256,
  sourceProfileRule: profile.rule,
  scope: { characterCount: characters.length, domainCount: domains.length, decisionCount: characters.length * domains.length },
  policy,
  stateCounts: counts,
  characters,
};

function mostCommonState(domain: typeof domains[number]): string {
  const domainCounts = new Map<string,number>();
  for (const character of characters) {
    const state = character.domains[domain].state;
    domainCounts.set(state, (domainCounts.get(state) ?? 0) + 1);
  }
  return [...domainCounts.entries()].sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? 'NO_CHARACTER_SPECIFIC_EVIDENCE';
}

const defaultDomainStates = Object.fromEntries(domains.map((domain) => [domain, mostCommonState(domain)]));
const overrides = characters.flatMap((character: any) => domains.flatMap((domain) => {
  const entryValue = character.domains[domain];
  if (entryValue.state === defaultDomainStates[domain] && !entryValue.openAuthorDecisionPaths.length && !entryValue.pendingReviewPaths.length) return [];
  return [{
    characterId: character.id,
    domain,
    state: entryValue.state,
    openAuthorDecisionPaths: entryValue.openAuthorDecisionPaths,
    pendingReviewPaths: entryValue.pendingReviewPaths,
  }];
}));

const compactIntake = {
  id: intake.id,
  date: intake.date,
  status: intake.status,
  sourceProfile,
  sourceProfileSha256,
  scope: intake.scope,
  policy,
  stateCounts: counts,
  characterIds: characters.map((character: any) => character.id),
  defaultDomainStates,
  overrides,
};

if (process.argv.includes('--check-materialized')) {
  const actual = JSON.parse(readFileSync(resolve(root, materializedPath), 'utf8'));
  if (JSON.stringify(actual) !== JSON.stringify(compactIntake)) {
    throw new Error('materialized current16 migration intake is stale');
  }
  console.log('[current16-life-choice-migration-intake] materialized snapshot fresh');
} else if (process.argv.includes('--emit-compact')) {
  console.log(JSON.stringify(compactIntake, null, 2));
} else if (process.argv.includes('--emit')) {
  console.log('P3_INTAKE_JSON_BEGIN');
  console.log(JSON.stringify(intake, null, 2));
  console.log('P3_INTAKE_JSON_END');
} else {
  console.log(`[current16-life-choice-migration-intake] OK: ${intake.scope.decisionCount} decisions`);
  console.log(JSON.stringify(intake.stateCounts));
}
