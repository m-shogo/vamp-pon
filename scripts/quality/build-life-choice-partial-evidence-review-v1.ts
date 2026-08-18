import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const paths = {
  currentProfile: 'data/visual/current21-extended-living-visual-profiles-v1.json',
  currentIntake: 'data/visual/current16-life-choice-profile-migration-intake-v1.json',
  futureProfile: 'data/visual/future15-living-visual-profiles-v1.json',
  futureIntake: 'data/visual/future15-life-choice-profile-migration-intake-v1.json',
  auditV2: 'data/visual/all-character-life-choice-migration-aware-audit-v2.json',
  queueV2: 'data/visual/all-character-life-choice-review-queue-v2.json',
  schemaReadyV1: 'data/visual/all-character-life-choice-schema-migration-ready-v1.json',
  speciesAdapterV1: 'data/visual/life-choice-species-body-type-schema-adapter-v1.json',
  entryV6: 'data/visual/character-production-generation-entrypoint-v6.json',
  entryV7: 'data/visual/character-production-generation-entrypoint-v7.json',
  entryV8: 'data/visual/character-production-generation-entrypoint-v8.json',
  entryV9: 'data/visual/character-production-generation-entrypoint-v9.json',
  entryV6Doc: 'docs/visual/character-production-generation-entrypoint-v6.md',
  entryV8Doc: 'docs/visual/character-production-generation-entrypoint-v8.md',
  output: 'data/visual/all-character-life-choice-partial-evidence-review-v1.json',
};

function load(path: string) {
  const text = readFileSync(resolve(root, path), 'utf8');
  return { text, json: JSON.parse(text), sha256: createHash('sha256').update(text).digest('hex') };
}

function loadText(path: string) {
  const text = readFileSync(resolve(root, path), 'utf8');
  return { text, sha256: createHash('sha256').update(text).digest('hex') };
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function atPath(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[key];
  }, value);
}

function hashJson(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function stateFor(intake: Record<string, any>, characterId: string, domain: string): string {
  const override = (intake.overrides ?? []).find(
    (entry: Record<string, unknown>) => entry.characterId === characterId && entry.domain === domain,
  );
  return String(override?.state ?? intake.defaultDomainStates?.[domain] ?? 'NO_CHARACTER_SPECIFIC_EVIDENCE');
}

const source = {
  currentProfile: load(paths.currentProfile),
  currentIntake: load(paths.currentIntake),
  futureProfile: load(paths.futureProfile),
  futureIntake: load(paths.futureIntake),
  auditV2: load(paths.auditV2),
  queueV2: load(paths.queueV2),
  schemaReadyV1: load(paths.schemaReadyV1),
  speciesAdapterV1: load(paths.speciesAdapterV1),
  entryV6: load(paths.entryV6),
  entryV7: load(paths.entryV7),
  entryV8: load(paths.entryV8),
  entryV9: load(paths.entryV9),
  entryV6Doc: loadText(paths.entryV6Doc),
  entryV8Doc: loadText(paths.entryV8Doc),
};

assert(source.currentIntake.json.sourceProfileSha256 === source.currentProfile.sha256, 'Current16 profile hash drift');
assert(source.futureIntake.json.sourceProfileSha256 === source.futureProfile.sha256, 'Future15 profile hash drift');
assert(source.currentIntake.json.scope?.decisionCount === 96, 'Current16 total must remain 96');
assert(source.futureIntake.json.scope?.decisionCount === 90, 'Future15 total must remain 90');
assert(source.auditV2.json.summary?.PARTIAL_SCHEMA_MIGRATION_REVIEW === 56, 'audit C2 total must remain 56');
const c2Queue = (source.queueV2.json.workstreams ?? []).find(
  (entry: Record<string, unknown>) => entry.id === 'C_PARTIAL_EVIDENCE_REVIEW',
);
assert(c2Queue?.decisionCount === 56, 'queue C2 total must remain 56');
assert(source.schemaReadyV1.json.scope?.schemaMigrationReadyDecisionCount === 109, 'B1 read model total drift');
assert(source.speciesAdapterV1.json.scope?.adapterMappedDecisionCount === 9, 'D0 adapter total drift');

assert(source.entryV7.json.basePolicy === paths.entryV6, 'v7 must preserve v6 accessory inventory');
assert(source.entryV8.json.basePolicy === paths.entryV7, 'v8 must preserve v7/v6 lineage');
assert(source.entryV9.json.basePolicy === paths.entryV8, 'v9 must preserve v8 grooming lineage');
assert(source.entryV6.json.requiredOutputFlags?.generatedInventoryCreatesCanon === false, 'v6 Canon guard weakened');
assert(source.entryV8.json.requiredOutputFlags?.generatedGroomingCreatesCanon === false, 'v8 Canon guard weakened');
assert(source.entryV6Doc.text.includes('unsupported removable objects may not be created by the image model'), 'v6 authority boundary missing');
assert(source.entryV8Doc.text.includes('grooming routine or inferred personal meaning never creates Canon'), 'v8 authority boundary missing');

const reviewDimensionSets = [
  {
    id: 'PERSONAL_GROOMING_V8_PARTIAL_REVIEW',
    sourceDomain: 'personalGrooming',
    authorityEntrypoint: paths.entryV8,
    authorityDocument: paths.entryV8Doc,
    dimensions: [
      'cosmeticsState',
      'nailTreatmentState',
      'facialHairAndBodyHairState',
      'hairWearAndGroomingState',
      'groomingRoutine',
      'personalMeaning',
    ],
    rule: 'Preserve present evidence and ask Human review only about unsupported grooming semantics; never infer from gender, age, ethnicity, role, rarity, or exposure.',
  },
  {
    id: 'ACCESSORY_PROP_V6_PARTIAL_REVIEW',
    sourceDomain: 'accessoryPropInventory',
    authorityEntrypoint: paths.entryV6,
    authorityDocument: paths.entryV6Doc,
    dimensions: [
      'discreteObjectIdentity',
      'ownership',
      'stateAndLocationTransition',
      'storageRoute',
      'temporaryPlacement',
      'giftMeaning',
      'relationshipMeaning',
    ],
    rule: 'Preserve present storage and wear evidence; unsupported removable objects, ownership, transitions, or meaning remain unresolved.',
  },
];

const dimensionSetByDomain = new Map(reviewDimensionSets.map((set) => [set.sourceDomain, set]));

type RosterConfig = {
  id: 'CURRENT16' | 'FUTURE15';
  profilePath: string;
  intakePath: string;
  profile: Record<string, any>;
  intake: Record<string, any>;
  profileSha256: string;
  intakeSha256: string;
  hairPattern: RegExp;
  includeGroomingMaintenance: boolean;
};

const rosters: RosterConfig[] = [
  {
    id: 'CURRENT16', profilePath: paths.currentProfile, intakePath: paths.currentIntake,
    profile: source.currentProfile.json, intake: source.currentIntake.json,
    profileSha256: source.currentProfile.sha256, intakeSha256: source.currentIntake.sha256,
    hairPattern: /(hair|fringe|clip|tie|lens|glasses)/i, includeGroomingMaintenance: false,
  },
  {
    id: 'FUTURE15', profilePath: paths.futureProfile, intakePath: paths.futureIntake,
    profile: source.futureProfile.json, intake: source.futureIntake.json,
    profileSha256: source.futureProfile.sha256, intakeSha256: source.futureIntake.sha256,
    hairPattern: /(hair|fringe|clip|tie|fur|coat|groom|lens|glasses)/i, includeGroomingMaintenance: true,
  },
];

function partialEvidence(character: Record<string, any>, roster: RosterConfig, domain: string) {
  if (domain === 'personalGrooming') {
    const hairWearEvidence = Array.isArray(character.wearHabits)
      ? character.wearHabits.filter((item: unknown) => typeof item === 'string' && roster.hairPattern.test(item))
      : [];
    const selectors = [
      { path: 'bodyModification.makeup', mode: 'DIRECT' },
      { path: 'bodyModification.nails', mode: 'DIRECT' },
      { path: 'wearHabits', mode: 'FILTERED_STRING_ARRAY', pattern: roster.hairPattern.source },
      ...(roster.includeGroomingMaintenance ? [{ path: 'maintenance', mode: 'DIRECT' }] : []),
    ];
    const values = [
      atPath(character, 'bodyModification.makeup'),
      atPath(character, 'bodyModification.nails'),
      hairWearEvidence,
      ...(roster.includeGroomingMaintenance ? [atPath(character, 'maintenance')] : []),
    ];
    return { selectors, values };
  }
  if (domain === 'accessoryPropInventory') {
    return {
      selectors: [
        { path: 'clothing.storage', mode: 'DIRECT' },
        { path: 'wearHabits', mode: 'DIRECT' },
      ],
      values: [atPath(character, 'clothing.storage'), atPath(character, 'wearHabits')],
    };
  }
  throw new Error(`unsupported C2 domain: ${domain}`);
}

const characterGroups = rosters.flatMap((roster) => {
  const characters = new Map(
    (roster.profile.characters ?? []).map((character: Record<string, unknown>) => [character.id, character]),
  );
  return (roster.intake.characterIds ?? []).flatMap((characterIdValue: unknown) => {
    const characterId = String(characterIdValue);
    const character = characters.get(characterId);
    assert(character, `${roster.id} source character missing: ${characterId}`);
    const decisions = ['personalGrooming', 'accessoryPropInventory'].flatMap((domain) => {
      const sourceState = stateFor(roster.intake, characterId, domain);
      if (sourceState !== 'PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW') return [];
      const dimensionSet = dimensionSetByDomain.get(domain);
      assert(dimensionSet, `review dimension set missing: ${domain}`);
      const evidence = partialEvidence(character, roster, domain);
      assert(evidence.values.some((value) => value !== undefined), `${roster.id}.${characterId}.${domain} evidence missing`);
      return [{
        id: `${roster.id.toLowerCase()}.${characterId}.${domain}`,
        domain,
        sourceState,
        sourceEvidenceSelectors: evidence.selectors,
        sourceEvidenceSha256: hashJson(evidence.values),
        reviewDimensionSetId: dimensionSet.id,
        reviewState: 'PARTIAL_EVIDENCE_PRESERVED_REVIEW_ONLY_MISSING_SEMANTICS',
        specificMissingMeaningMachineAuthored: false,
        schemaReviewStatus: 'PENDING_HUMAN_SCHEMA_REVIEW',
      }];
    });
    if (!decisions.length) return [];
    return [{
      roster: roster.id,
      characterId,
      characterName: String(character.name),
      species: typeof character.species === 'string' ? character.species : null,
      sourceProfile: roster.profilePath,
      sourceProfileSha256: roster.profileSha256,
      sourceIntake: roster.intakePath,
      sourceIntakeSha256: roster.intakeSha256,
      decisions,
    }];
  });
});

const decisions = characterGroups.flatMap((character) => character.decisions);
const rosterCounts = Object.fromEntries(rosters.map((roster) => [
  roster.id,
  characterGroups.filter((character) => character.roster === roster.id).reduce((sum, character) => sum + character.decisions.length, 0),
]));
const domainCounts = Object.fromEntries(
  ['personalGrooming', 'accessoryPropInventory'].map((domain) => [domain, decisions.filter((decision) => decision.domain === domain).length]),
);

assert(rosterCounts.CURRENT16 === 31, `expected Current16 C2 31, got ${rosterCounts.CURRENT16}`);
assert(rosterCounts.FUTURE15 === 25, `expected Future15 C2 25, got ${rosterCounts.FUTURE15}`);
assert(domainCounts.personalGrooming === 27, `expected grooming C2 27, got ${domainCounts.personalGrooming}`);
assert(domainCounts.accessoryPropInventory === 29, `expected inventory C2 29, got ${domainCounts.accessoryPropInventory}`);
assert(decisions.length === 56, `expected C2 56, got ${decisions.length}`);
assert(new Set(decisions.map((decision) => decision.id)).size === 56, 'duplicate C2 decision id');

const b1Ids = new Set(
  (source.schemaReadyV1.json.characters ?? []).flatMap((character: Record<string, any>) =>
    (character.decisions ?? []).map((decision: Record<string, unknown>) => String(decision.id)),
  ),
);
const d0Ids = new Set(
  (source.speciesAdapterV1.json.decisions ?? []).map((decision: Record<string, unknown>) => `future15.${decision.id}`),
);
assert(decisions.every((decision) => !b1Ids.has(decision.id)), 'C2 overlaps B1');
assert(decisions.every((decision) => !d0Ids.has(decision.id)), 'C2 overlaps D0');

const currentOpen = Number(source.currentIntake.json.stateCounts?.MIGRATION_READY_WITH_OPEN_AUTHOR_DECISION ?? 0)
  + Number(source.currentIntake.json.stateCounts?.PARTIAL_MIGRATION_EVIDENCE_WITH_OPEN_AUTHOR_DECISION ?? 0);
const futureOpen = Number(source.futureIntake.json.stateCounts?.MIGRATION_READY_WITH_OPEN_AUTHOR_DECISION ?? 0)
  + Number(source.futureIntake.json.stateCounts?.PARTIAL_MIGRATION_EVIDENCE_WITH_OPEN_AUTHOR_DECISION ?? 0);
assert(109 + 56 + 9 + currentOpen + futureOpen === 186, 'Current16/Future15 migration partition drift');

const output = {
  id: 'yoru-no-shirube-all-character-life-choice-partial-evidence-review-v1',
  date: '2026-08-18',
  status: 'DERIVED_PARTIAL_EVIDENCE_REVIEW_PACKET_NON_CANON',
  sourceHashes: Object.fromEntries([
    [paths.currentProfile, source.currentProfile.sha256], [paths.currentIntake, source.currentIntake.sha256],
    [paths.futureProfile, source.futureProfile.sha256], [paths.futureIntake, source.futureIntake.sha256],
    [paths.auditV2, source.auditV2.sha256], [paths.queueV2, source.queueV2.sha256],
    [paths.schemaReadyV1, source.schemaReadyV1.sha256], [paths.speciesAdapterV1, source.speciesAdapterV1.sha256],
    [paths.entryV6, source.entryV6.sha256], [paths.entryV7, source.entryV7.sha256],
    [paths.entryV8, source.entryV8.sha256], [paths.entryV9, source.entryV9.sha256],
    [paths.entryV6Doc, source.entryV6Doc.sha256], [paths.entryV8Doc, source.entryV8Doc.sha256],
  ]),
  scope: {
    rosterCount: rosters.length,
    characterCount: characterGroups.length,
    sourceDecisionCount: 186,
    partialEvidenceReviewDecisionCount: decisions.length,
    humanSchemaReviewRequiredCount: decisions.length,
    canonPromotedCount: 0,
    imageResolvedCount: 0,
  },
  partition: {
    schemaMigrationReady: 109,
    partialEvidenceReview: 56,
    speciesSchemaAdapter: 9,
    currentAndFutureOpenAuthorDecisions: currentOpen + futureOpen,
    total: 186,
  },
  rosterCounts,
  domainCounts,
  reviewContract: {
    preserveExistingEvidence: true,
    machineMayDeclareSpecificMissingMeaning: false,
    genericPolicyMaySupplyMissingEvidence: false,
    sourceValuesRemainAuthorCandidate: true,
    reviewDoesNotEqualCanonPromotion: true,
    imageModelFreedom: false,
    generatedImageMayCloseItem: false,
  },
  reviewDimensionSets,
  characters: characterGroups,
  nextActionBoundary: 'HUMAN_REVIEW_ONLY_PRESERVE_EVIDENCE_NO_GENERIC_FILL_OR_IMAGE_PROMOTION',
};

if (process.argv.includes('--check-materialized')) {
  const actual = JSON.parse(readFileSync(resolve(root, paths.output), 'utf8'));
  assert(JSON.stringify(actual) === JSON.stringify(output), `${paths.output} is stale`);
  console.log('[life-choice-partial-evidence-review-v1] materialized review packet fresh');
} else if (process.argv.includes('--emit-compact')) {
  console.log(JSON.stringify(output, null, 2));
} else {
  console.log('[life-choice-partial-evidence-review-v1] OK');
  console.log(JSON.stringify({ rosterCounts, domainCounts, total: decisions.length }));
}
