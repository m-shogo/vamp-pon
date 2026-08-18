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
  output: 'data/visual/all-character-life-choice-schema-migration-ready-v1.json',
};

const domains = [
  'bodyAdornment',
  'skinCoverage',
  'personalGrooming',
  'accessoryPropInventory',
  'footwearGroundInterface',
  'materialWearMaintenance',
] as const;

function load(path: string) {
  const text = readFileSync(resolve(root, path), 'utf8');
  return {
    text,
    json: JSON.parse(text),
    sha256: createHash('sha256').update(text).digest('hex'),
  };
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

const source = {
  currentProfile: load(paths.currentProfile),
  currentIntake: load(paths.currentIntake),
  futureProfile: load(paths.futureProfile),
  futureIntake: load(paths.futureIntake),
  auditV2: load(paths.auditV2),
  queueV2: load(paths.queueV2),
};

assert(
  source.currentIntake.json.sourceProfileSha256 === source.currentProfile.sha256,
  'Current16 source-profile hash drift',
);
assert(
  source.futureIntake.json.sourceProfileSha256 === source.futureProfile.sha256,
  'Future15 source-profile hash drift',
);
assert(source.currentIntake.json.scope?.decisionCount === 96, 'Current16 decision total must remain 96');
assert(source.futureIntake.json.scope?.decisionCount === 90, 'Future15 decision total must remain 90');
assert(
  source.auditV2.json.summary?.SCHEMA_MIGRATION_READY === 109,
  'migration-aware audit must expose 109 schema-ready decisions',
);
const queueWorkstream = (source.queueV2.json.workstreams ?? []).find(
  (entry: Record<string, unknown>) => entry.id === 'B_SCHEMA_MIGRATION_READY',
);
assert(queueWorkstream?.decisionCount === 109, 'review queue B1 decision total must remain 109');

const evidencePathsByDomain: Record<(typeof domains)[number], string[]> = {
  bodyAdornment: [
    'bodyModification.piercing',
    'bodyModification.tattoo',
    'bodyModification.jewelry',
  ],
  skinCoverage: ['exposure'],
  personalGrooming: [
    'bodyModification.makeup',
    'bodyModification.nails',
    'wearHabits',
    'maintenance',
  ],
  accessoryPropInventory: ['clothing.storage', 'wearHabits'],
  footwearGroundInterface: ['clothing.footwear'],
  materialWearMaintenance: ['clothing.materials', 'maintenance', 'wearHabits'],
};

function stateFor(intake: Record<string, any>, characterId: string, domain: string): string {
  const override = (intake.overrides ?? []).find(
    (entry: Record<string, unknown>) => entry.characterId === characterId && entry.domain === domain,
  );
  return String(override?.state ?? intake.defaultDomainStates?.[domain] ?? 'NO_CHARACTER_SPECIFIC_EVIDENCE');
}

type RosterConfig = {
  id: 'CURRENT16' | 'FUTURE15';
  profilePath: string;
  intakePath: string;
  profile: Record<string, any>;
  intake: Record<string, any>;
  profileSha256: string;
  intakeSha256: string;
};

const rosters: RosterConfig[] = [
  {
    id: 'CURRENT16',
    profilePath: paths.currentProfile,
    intakePath: paths.currentIntake,
    profile: source.currentProfile.json,
    intake: source.currentIntake.json,
    profileSha256: source.currentProfile.sha256,
    intakeSha256: source.currentIntake.sha256,
  },
  {
    id: 'FUTURE15',
    profilePath: paths.futureProfile,
    intakePath: paths.futureIntake,
    profile: source.futureProfile.json,
    intake: source.futureIntake.json,
    profileSha256: source.futureProfile.sha256,
    intakeSha256: source.futureIntake.sha256,
  },
];

const characterGroups = rosters.flatMap((roster) => {
  const characters = new Map(
    (roster.profile.characters ?? []).map((character: Record<string, unknown>) => [character.id, character]),
  );
  return (roster.intake.characterIds ?? []).flatMap((characterIdValue: unknown) => {
    const characterId = String(characterIdValue);
    const character = characters.get(characterId);
    assert(character, `${roster.id} source character missing: ${characterId}`);

    const decisions = domains.flatMap((domain) => {
      const sourceState = stateFor(roster.intake, characterId, domain);
      if (sourceState !== 'MIGRATION_READY_AUTHOR_CANDIDATE') return [];

      const sourceEvidencePaths = evidencePathsByDomain[domain].filter(
        (path) => atPath(character, path) !== undefined,
      );
      assert(sourceEvidencePaths.length > 0, `${roster.id}.${characterId}.${domain} has no source evidence`);
      const sourceEvidence = sourceEvidencePaths.map((path) => atPath(character, path));

      return [{
        id: `${roster.id.toLowerCase()}.${characterId}.${domain}`,
        domain,
        sourceState,
        sourceEvidencePaths,
        sourceEvidenceSha256: hashJson(sourceEvidence),
        mappingState: 'SCHEMA_MAPPING_READY_REQUIRES_HUMAN_SCHEMA_REVIEW',
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
const rosterCounts = Object.fromEntries(
  rosters.map((roster) => [
    roster.id,
    characterGroups
      .filter((character) => character.roster === roster.id)
      .reduce((sum, character) => sum + character.decisions.length, 0),
  ]),
);
const domainCounts = Object.fromEntries(
  domains.map((domain) => [domain, decisions.filter((decision) => decision.domain === domain).length]),
);

assert(rosterCounts.CURRENT16 === 63, `expected Current16 63, got ${rosterCounts.CURRENT16}`);
assert(rosterCounts.FUTURE15 === 46, `expected Future15 46, got ${rosterCounts.FUTURE15}`);
assert(decisions.length === 109, `expected 109 schema-ready decisions, got ${decisions.length}`);
assert(new Set(decisions.map((decision) => decision.id)).size === 109, 'duplicate B1 decision id');

const output = {
  id: 'yoru-no-shirube-all-character-life-choice-schema-migration-ready-v1',
  date: '2026-08-18',
  status: 'DERIVED_SCHEMA_MAPPING_READY_NON_CANON_REQUIRES_HUMAN_SCHEMA_REVIEW',
  sourceHashes: {
    [paths.currentProfile]: source.currentProfile.sha256,
    [paths.currentIntake]: source.currentIntake.sha256,
    [paths.futureProfile]: source.futureProfile.sha256,
    [paths.futureIntake]: source.futureIntake.sha256,
    [paths.auditV2]: source.auditV2.sha256,
    [paths.queueV2]: source.queueV2.sha256,
  },
  scope: {
    rosterCount: rosters.length,
    characterCount: characterGroups.length,
    sourceDecisionCount: 186,
    schemaMigrationReadyDecisionCount: decisions.length,
    humanSchemaReviewRequiredCount: decisions.length,
    canonPromotedCount: 0,
    imageResolvedCount: 0,
  },
  rosterCounts,
  domainCounts,
  migrationContract: {
    readMode: 'SOURCE_PATH_AND_EVIDENCE_HASH_ONLY_NO_VALUE_DUPLICATION',
    sourceValuesRemainAuthorCandidate: true,
    noNewCharacterFactsAuthored: true,
    genericPolicyMaySupplyMissingEvidence: false,
    migrationDoesNotEqualCanonPromotion: true,
    humanSchemaReviewRequired: true,
    imageModelFreedom: false,
    generatedImageMayCloseItem: false,
  },
  characters: characterGroups,
  nextActionBoundary: 'HUMAN_SCHEMA_REVIEW_OF_109_MAPPINGS_NO_CANON_OR_IMAGE_PROMOTION',
};

if (process.argv.includes('--check-materialized')) {
  const actual = JSON.parse(readFileSync(resolve(root, paths.output), 'utf8'));
  assert(JSON.stringify(actual) === JSON.stringify(output), `${paths.output} is stale`);
  console.log('[life-choice-schema-migration-ready-v1] materialized read model fresh');
} else if (process.argv.includes('--emit-compact')) {
  console.log(JSON.stringify(output, null, 2));
} else {
  console.log('[life-choice-schema-migration-ready-v1] OK');
  console.log(JSON.stringify({ rosterCounts, domainCounts, total: decisions.length }));
}
