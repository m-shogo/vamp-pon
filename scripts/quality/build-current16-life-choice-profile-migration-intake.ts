import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const sourceProfile = 'data/visual/current21-extended-living-visual-profiles-v1.json';
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

function hairWearEvidence(wearHabits: unknown): string[] {
  if (!Array.isArray(wearHabits)) return [];
  return wearHabits.filter((item) => typeof item === 'string' && /(hair|fringe|clip|tie|lens|glasses)/i.test(item));
}

function entry(state: string, evidence: Record<string,unknown>) {
  return {
    state,
    evidence,
    sourceKinds: sourceKinds(evidence),
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

const intake = {
  id: 'yoru-no-shirube-current16-life-choice-profile-migration-intake-v1',
  date: '2026-08-14',
  status: 'DERIVED_SCHEMA_MIGRATION_INTAKE_NON_CANON',
  sourceProfile,
  sourceProfileSha256,
  sourceProfileRule: profile.rule,
  scope: { characterCount: characters.length, domainCount: domains.length, decisionCount: characters.length * domains.length },
  policy: {
    noNewCharacterFactsAuthored: true,
    genericPolicyIsNotCharacterEvidence: true,
    inheritedProfileValuesRemainAuthorCandidate: true,
    migrationDoesNotEqualCanonPromotion: true,
    requiresHumanSchemaReview: true,
    imageModelFreedom: false,
    generatedImageMayCloseItem: false,
  },
  stateCounts: counts,
  characters,
};

if (process.argv.includes('--emit')) {
  console.log('P3_INTAKE_JSON_BEGIN');
  console.log(JSON.stringify(intake, null, 2));
  console.log('P3_INTAKE_JSON_END');
} else {
  console.log(`[current16-life-choice-migration-intake] OK: ${intake.scope.decisionCount} decisions`);
  console.log(JSON.stringify(intake.stateCounts));
}
