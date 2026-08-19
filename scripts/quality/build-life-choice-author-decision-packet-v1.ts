import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const paths = {
  coreProfile: 'data/visual/core5-living-visual-profiles-v1.json',
  queueV1: 'data/visual/all-character-life-choice-author-review-queue-v1.json',
  coreP0: 'data/visual/core5-p0-life-choice-review-contract-v1.json',
  coreP1: 'data/visual/core5-p1-life-choice-review-contract-v1.json',
  coreP2: 'data/visual/core5-p2-life-choice-review-contract-v1.json',
  currentProfile: 'data/visual/current21-extended-living-visual-profiles-v1.json',
  currentIntake: 'data/visual/current16-life-choice-profile-migration-intake-v1.json',
  futureProfile: 'data/visual/future15-living-visual-profiles-v1.json',
  futureIntake: 'data/visual/future15-life-choice-profile-migration-intake-v1.json',
  auditV2: 'data/visual/all-character-life-choice-migration-aware-audit-v2.json',
  queueV2: 'data/visual/all-character-life-choice-review-queue-v2.json',
  schemaReadyV1: 'data/visual/all-character-life-choice-schema-migration-ready-v1.json',
  partialReviewV1: 'data/visual/all-character-life-choice-partial-evidence-review-v1.json',
  speciesAdapterV1: 'data/visual/life-choice-species-body-type-schema-adapter-v1.json',
  output: 'data/visual/all-character-life-choice-author-decision-packet-v1.json',
};

function load(path: string) {
  const text = readFileSync(resolve(root, path), 'utf8');
  return { text, json: JSON.parse(text), sha256: createHash('sha256').update(text).digest('hex') };
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
  coreProfile: load(paths.coreProfile), queueV1: load(paths.queueV1),
  coreP0: load(paths.coreP0), coreP1: load(paths.coreP1), coreP2: load(paths.coreP2),
  currentProfile: load(paths.currentProfile), currentIntake: load(paths.currentIntake),
  futureProfile: load(paths.futureProfile), futureIntake: load(paths.futureIntake),
  auditV2: load(paths.auditV2), queueV2: load(paths.queueV2),
  schemaReadyV1: load(paths.schemaReadyV1), partialReviewV1: load(paths.partialReviewV1),
  speciesAdapterV1: load(paths.speciesAdapterV1),
};

for (const contract of [source.coreP0, source.coreP1, source.coreP2]) {
  assert(contract.json.sourceProfileSha256 === source.coreProfile.sha256, `${contract.json.id} Core5 profile hash drift`);
  assert(contract.json.scope?.reviewItemCount === 10, `${contract.json.id} must retain 10 review items`);
  assert(contract.json.policy?.noNewCharacterFactsAuthored === true, `${contract.json.id} invention guard weakened`);
  assert(contract.json.policy?.requiresHumanDecision === true, `${contract.json.id} Human decision guard weakened`);
  assert(contract.json.policy?.canonPromotionBlocked === true, `${contract.json.id} Canon guard weakened`);
}
assert(source.currentIntake.json.sourceProfileSha256 === source.currentProfile.sha256, 'Current16 profile hash drift');
assert(source.futureIntake.json.sourceProfileSha256 === source.futureProfile.sha256, 'Future15 profile hash drift');
assert(source.auditV2.json.summary?.AUTHOR_CONTENT_REVIEW_REQUIRED === 42, 'audit A0 total must remain 42');
const a0Queue = (source.queueV2.json.workstreams ?? []).find(
  (entry: Record<string, unknown>) => entry.id === 'A_AUTHOR_CONTENT_DECISIONS',
);
assert(a0Queue?.decisionCount === 42, 'queue A0 total must remain 42');
assert(source.schemaReadyV1.json.scope?.schemaMigrationReadyDecisionCount === 109, 'B1 total drift');
assert(source.partialReviewV1.json.scope?.partialEvidenceReviewDecisionCount === 56, 'C2 total drift');
assert(source.speciesAdapterV1.json.scope?.adapterMappedDecisionCount === 9, 'D0 total drift');

const coreContractConfigs = [
  { priority: 'P0', path: paths.coreP0, source: source.coreP0, domains: ['bodyAdornment', 'skinCoverage'] },
  { priority: 'P1', path: paths.coreP1, source: source.coreP1, domains: ['personalGrooming', 'footwearGroundInterface'] },
  { priority: 'P2', path: paths.coreP2, source: source.coreP2, domains: ['accessoryPropInventory', 'materialWearMaintenance'] },
];

const core5Groups = new Map<string, Record<string, any>>();
for (const contract of coreContractConfigs) {
  for (const character of contract.source.json.characters ?? []) {
    const key = `core5.${character.id}`;
    const group = core5Groups.get(key) ?? {
      roster: 'CORE5',
      characterId: character.id,
      characterName: character.name,
      decisions: [],
    };
    for (const domain of contract.domains) {
      const value = character[domain];
      assert(value !== undefined, `${contract.path}.${character.id}.${domain} missing`);
      const routesMarkers = domain === 'bodyAdornment';
      const openAuthorDecisionPaths = routesMarkers ? (character.openAuthorDecisionPaths ?? []) : [];
      const pendingReviewPaths = routesMarkers ? (character.pendingReviewPaths ?? []) : [];
      group.decisions.push({
        id: `core5.${character.id}.${domain}`,
        domain,
        priority: contract.priority,
        reviewMode: openAuthorDecisionPaths.length || pendingReviewPaths.length
          ? 'EXISTING_CONTRACT_WITH_OPEN_OR_PENDING_MARKER'
          : 'EXISTING_CANDIDATE_REVIEW',
        sourceContract: contract.path,
        sourceSelector: `characters[id=${character.id}].${domain}`,
        sourceEvidenceSha256: hashJson(value),
        openAuthorDecisionPaths,
        pendingReviewPaths,
        decisionState: 'PENDING_HUMAN_AUTHOR_DECISION',
      });
    }
    core5Groups.set(key, group);
  }
}

const markerProfilePathByDomain: Record<string, Record<string, string>> = {
  bodyAdornment: {
    piercing: 'bodyModification.piercing',
    tattoo: 'bodyModification.tattoo',
  },
  personalGrooming: {
    makeup: 'bodyModification.makeup',
    nails: 'bodyModification.nails',
  },
};

function stateFor(intake: Record<string, any>, characterId: string, domain: string): Record<string, any> {
  const override = (intake.overrides ?? []).find(
    (entry: Record<string, unknown>) => entry.characterId === characterId && entry.domain === domain,
  );
  return override ?? {
    state: intake.defaultDomainStates?.[domain],
    openAuthorDecisionPaths: [],
    pendingReviewPaths: [],
  };
}

type OpenRoster = {
  id: 'CURRENT16' | 'FUTURE15';
  profilePath: string;
  intakePath: string;
  profile: Record<string, any>;
  intake: Record<string, any>;
  profileSha256: string;
  intakeSha256: string;
};

const openRosters: OpenRoster[] = [
  {
    id: 'CURRENT16', profilePath: paths.currentProfile, intakePath: paths.currentIntake,
    profile: source.currentProfile.json, intake: source.currentIntake.json,
    profileSha256: source.currentProfile.sha256, intakeSha256: source.currentIntake.sha256,
  },
  {
    id: 'FUTURE15', profilePath: paths.futureProfile, intakePath: paths.futureIntake,
    profile: source.futureProfile.json, intake: source.futureIntake.json,
    profileSha256: source.futureProfile.sha256, intakeSha256: source.futureIntake.sha256,
  },
];

const openCharacterGroups = openRosters.flatMap((roster) => {
  const characters = new Map(
    (roster.profile.characters ?? []).map((character: Record<string, unknown>) => [character.id, character]),
  );
  return (roster.intake.characterIds ?? []).flatMap((characterIdValue: unknown) => {
    const characterId = String(characterIdValue);
    const character = characters.get(characterId);
    assert(character, `${roster.id} source character missing: ${characterId}`);
    const decisions = ['bodyAdornment', 'personalGrooming'].flatMap((domain) => {
      const intakeEntry = stateFor(roster.intake, characterId, domain);
      if (!String(intakeEntry.state).includes('WITH_OPEN_AUTHOR_DECISION')) return [];
      const openAuthorDecisionPaths = (intakeEntry.openAuthorDecisionPaths ?? []).map(String);
      assert(openAuthorDecisionPaths.length > 0, `${roster.id}.${characterId}.${domain} open state has no paths`);
      const profileMarkerPaths = openAuthorDecisionPaths.map((intakePath: string) => {
        const sourceProfilePath = markerProfilePathByDomain[domain]?.[intakePath];
        assert(sourceProfilePath, `missing source marker route for ${domain}.${intakePath}`);
        const value = atPath(character, sourceProfilePath);
        assert(typeof value === 'string' && /OPEN/i.test(value), `${roster.id}.${characterId}.${sourceProfilePath} OPEN marker drift`);
        return { intakePath, sourceProfilePath, sourceMarkerSha256: hashJson(value) };
      });
      const domainEvidence = domain === 'bodyAdornment'
        ? [atPath(character, 'bodyModification.piercing'), atPath(character, 'bodyModification.tattoo'), atPath(character, 'bodyModification.jewelry')]
        : [atPath(character, 'bodyModification.makeup'), atPath(character, 'bodyModification.nails'), atPath(character, 'wearHabits')];
      return [{
        id: `${roster.id.toLowerCase()}.${characterId}.${domain}`,
        domain,
        priority: 'A0',
        reviewMode: 'OPEN_AUTHOR_CONTENT_SELECTION_REQUIRED',
        sourceIntakeState: intakeEntry.state,
        sourceProfile: roster.profilePath,
        sourceIntake: roster.intakePath,
        sourceEvidenceSha256: hashJson(domainEvidence),
        openAuthorDecisionPaths,
        sourceProfileOpenMarkers: profileMarkerPaths,
        pendingReviewPaths: intakeEntry.pendingReviewPaths ?? [],
        decisionState: 'PENDING_HUMAN_AUTHOR_DECISION',
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

const characters = [...core5Groups.values(), ...openCharacterGroups];
const decisions = characters.flatMap((character) => character.decisions);
const rosterCounts = Object.fromEntries(['CORE5', 'CURRENT16', 'FUTURE15'].map((roster) => [
  roster,
  characters.filter((character) => character.roster === roster).reduce((sum, character) => sum + character.decisions.length, 0),
]));
const domainNames = ['bodyAdornment', 'skinCoverage', 'personalGrooming', 'footwearGroundInterface', 'accessoryPropInventory', 'materialWearMaintenance'];
const domainCounts = Object.fromEntries(domainNames.map((domain) => [
  domain,
  decisions.filter((decision) => decision.domain === domain).length,
]));

assert(rosterCounts.CORE5 === 30, `expected Core5 30, got ${rosterCounts.CORE5}`);
assert(rosterCounts.CURRENT16 === 2, `expected Current16 OPEN 2, got ${rosterCounts.CURRENT16}`);
assert(rosterCounts.FUTURE15 === 10, `expected Future15 OPEN 10, got ${rosterCounts.FUTURE15}`);
assert(decisions.length === 42, `expected A0 42, got ${decisions.length}`);
assert(new Set(decisions.map((decision) => decision.id)).size === 42, 'duplicate A0 decision id');
assert(domainCounts.bodyAdornment === 16, 'A0 bodyAdornment count drift');
assert(domainCounts.skinCoverage === 5, 'A0 skinCoverage count drift');
assert(domainCounts.personalGrooming === 6, 'A0 personalGrooming count drift');
assert(domainCounts.footwearGroundInterface === 5, 'A0 footwear count drift');
assert(domainCounts.accessoryPropInventory === 5, 'A0 accessory count drift');
assert(domainCounts.materialWearMaintenance === 5, 'A0 material count drift');

const b1Ids = new Set((source.schemaReadyV1.json.characters ?? []).flatMap((character: Record<string, any>) =>
  (character.decisions ?? []).map((decision: Record<string, unknown>) => String(decision.id))));
const c2Ids = new Set((source.partialReviewV1.json.characters ?? []).flatMap((character: Record<string, any>) =>
  (character.decisions ?? []).map((decision: Record<string, unknown>) => String(decision.id))));
const d0Ids = new Set((source.speciesAdapterV1.json.decisions ?? []).map((decision: Record<string, unknown>) => `future15.${decision.id}`));
assert(decisions.every((decision) => !b1Ids.has(decision.id)), 'A0 overlaps B1');
assert(decisions.every((decision) => !c2Ids.has(decision.id)), 'A0 overlaps C2');
assert(decisions.every((decision) => !d0Ids.has(decision.id)), 'A0 overlaps D0');
assert(42 + 109 + 56 + 9 === 216, 'all-character 216-decision partition drift');

const output = {
  id: 'yoru-no-shirube-all-character-life-choice-author-decision-packet-v1',
  date: '2026-08-18',
  status: 'AUTHOR_DECISION_PACKET_NON_CANON_PENDING_HUMAN_ACTION',
  sourceHashes: Object.fromEntries([
    [paths.coreProfile, source.coreProfile.sha256], [paths.queueV1, source.queueV1.sha256],
    [paths.coreP0, source.coreP0.sha256], [paths.coreP1, source.coreP1.sha256], [paths.coreP2, source.coreP2.sha256],
    [paths.currentProfile, source.currentProfile.sha256], [paths.currentIntake, source.currentIntake.sha256],
    [paths.futureProfile, source.futureProfile.sha256], [paths.futureIntake, source.futureIntake.sha256],
    [paths.auditV2, source.auditV2.sha256], [paths.queueV2, source.queueV2.sha256],
    [paths.schemaReadyV1, source.schemaReadyV1.sha256], [paths.partialReviewV1, source.partialReviewV1.sha256],
    [paths.speciesAdapterV1, source.speciesAdapterV1.sha256],
  ]),
  scope: {
    rosterCount: 3,
    characterCount: characters.length,
    authorDecisionCount: decisions.length,
    pendingHumanDecisionCount: decisions.length,
    canonPromotedCount: 0,
    imageResolvedCount: 0,
  },
  partition: {
    authorContentReview: 42,
    schemaMigrationReady: 109,
    partialEvidenceReview: 56,
    speciesSchemaAdapter: 9,
    total: 216,
  },
  rosterCounts,
  domainCounts,
  decisionContract: {
    core5ReviewOutcomes: ['ACCEPT_CANDIDATE_FOR_SCHEMA_REVIEW', 'REVISE_CANDIDATE', 'HOLD'],
    openContentOutcomes: ['AUTHOR_SUPPLIES_DECISION', 'KEEP_OPEN', 'HOLD'],
    acceptedOutcomeDoesNotPromoteCanon: true,
    noNewCharacterFactsAuthoredByPacket: true,
    alternativesAuthoredByPacket: false,
    explicitHumanActionRequired: true,
    imageModelFreedom: false,
    generatedImageMayCloseItem: false,
  },
  characters,
  nextActionBoundary: 'HUMAN_AUTHOR_ACTION_REQUIRED_NO_AUTOMATIC_CANON_OR_IMAGE_PROMOTION',
};

if (process.argv.includes('--check-materialized')) {
  const actual = JSON.parse(readFileSync(resolve(root, paths.output), 'utf8'));
  assert(JSON.stringify(actual) === JSON.stringify(output), `${paths.output} is stale`);
  console.log('[life-choice-author-decision-packet-v1] materialized packet fresh');
} else if (process.argv.includes('--emit-compact')) {
  console.log(JSON.stringify(output, null, 2));
} else {
  console.log('[life-choice-author-decision-packet-v1] OK');
  console.log(JSON.stringify({ rosterCounts, domainCounts, total: decisions.length }));
}
