import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const paths = {
  sourceProfile: 'data/visual/future15-living-visual-profiles-v1.json',
  intakeV1: 'data/visual/future15-life-choice-profile-migration-intake-v1.json',
  adapter: 'data/visual/life-choice-species-body-type-schema-adapter-v1.json',
};

function load(path: string) {
  const text = readFileSync(resolve(root, path), 'utf8');
  return {
    text,
    json: JSON.parse(text),
    sha256: createHash('sha256').update(text).digest('hex'),
  };
}

function atPath(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[key];
  }, value);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const sourceProfile = load(paths.sourceProfile);
const intakeV1 = load(paths.intakeV1);
const characters = new Map(
  (sourceProfile.json.characters ?? []).map((character: Record<string, unknown>) => [character.id, character]),
);

assert(
  intakeV1.json.sourceProfileSha256 === sourceProfile.sha256,
  'future15 intake source-profile hash drift',
);
assert(intakeV1.json.scope?.decisionCount === 90, 'future15 intake must retain 90 decisions');
assert(
  intakeV1.json.stateCounts?.SOURCE_MARKED_NOT_APPLICABLE_REQUIRES_SCHEMA_ADAPTER === 9,
  'future15 intake must expose exactly 9 schema-adapter decisions',
);

const familyBySpecies: Record<string, string> = {
  DOG: 'REAL_ANIMAL',
  CAT: 'REAL_ANIMAL',
  MAINTENANCE_ROBOT: 'MAINTENANCE_ROBOT',
};

const markerProfilePathByDomain: Record<string, Record<string, string>> = {
  bodyAdornment: {
    piercing: 'bodyModification.piercing',
    tattoo: 'bodyModification.tattoo',
  },
  skinCoverage: {
    'exposure.policy': 'exposure.policy',
  },
  personalGrooming: {
    makeup: 'bodyModification.makeup',
    nails: 'bodyModification.nails',
  },
  accessoryPropInventory: {
    storage: 'clothing.storage',
  },
};

const axisDefinitions = [
  {
    axisId: 'realAnimal.coatBodyBoundary',
    bodyTypeFamily: 'REAL_ANIMAL',
    allowedSpecies: ['DOG', 'CAT'],
    sourceDomain: 'skinCoverage',
    humanAxisBoundary: 'Human exposure/modesty policy is not applicable to a real-animal body.',
    semanticRead: 'Read coat, anatomy, seasonal condition, and household care only from existing source evidence.',
    sourceEvidencePaths: ['bodyComfort', 'exposure.policy', 'clothing.patterns', 'maintenance'],
  },
  {
    axisId: 'realAnimal.coatClawCare',
    bodyTypeFamily: 'REAL_ANIMAL',
    allowedSpecies: ['DOG', 'CAT'],
    sourceDomain: 'personalGrooming',
    humanAxisBoundary: 'Human makeup is not applicable; animal coat and claw care remain body-specific.',
    semanticRead: 'Read grooming and care without inventing cosmetic styling or human presentation rules.',
    sourceEvidencePaths: ['bodyModification.makeup', 'bodyModification.nails', 'maintenance', 'wearHabits'],
  },
  {
    axisId: 'realAnimal.bodyAttachmentCarryContext',
    bodyTypeFamily: 'REAL_ANIMAL',
    allowedSpecies: ['DOG', 'CAT'],
    sourceDomain: 'accessoryPropInventory',
    humanAxisBoundary: 'Human pocket/storage assumptions are not applicable to a real animal.',
    semanticRead: 'Read only source-supported collar or household attachment context; carried storage is never inferred.',
    sourceEvidencePaths: ['bodyModification.jewelry', 'clothing.storage', 'clothing.materials', 'wearHabits'],
  },
  {
    axisId: 'maintenanceRobot.shellMarkingAttachmentTopology',
    bodyTypeFamily: 'MAINTENANCE_ROBOT',
    allowedSpecies: ['MAINTENANCE_ROBOT'],
    sourceDomain: 'bodyAdornment',
    humanAxisBoundary: 'Human piercing and tattoo topology is not applicable to a maintenance-robot shell.',
    semanticRead: 'Read service markings, repair patches, and attachments only where the source already supports them.',
    sourceEvidencePaths: ['bodyModification.piercing', 'bodyModification.tattoo', 'bodyModification.jewelry', 'clothing.patterns', 'wearHabits'],
  },
  {
    axisId: 'maintenanceRobot.shellPanelServiceBoundary',
    bodyTypeFamily: 'MAINTENANCE_ROBOT',
    allowedSpecies: ['MAINTENANCE_ROBOT'],
    sourceDomain: 'skinCoverage',
    humanAxisBoundary: 'Human skin exposure and modesty policy is not applicable to a robot shell.',
    semanticRead: 'Read shell, panel, contact, and service-access behavior only from existing source evidence.',
    sourceEvidencePaths: ['bodyComfort', 'exposure.policy', 'clothing.silhouette', 'clothing.materials', 'maintenance'],
  },
  {
    axisId: 'maintenanceRobot.surfaceServiceCare',
    bodyTypeFamily: 'MAINTENANCE_ROBOT',
    allowedSpecies: ['MAINTENANCE_ROBOT'],
    sourceDomain: 'personalGrooming',
    humanAxisBoundary: 'Human makeup and nail care are not applicable to robot maintenance.',
    semanticRead: 'Read surface wear, part replacement, and service care without inventing decorative cosmetics.',
    sourceEvidencePaths: ['bodyModification.makeup', 'bodyModification.nails', 'maintenance', 'wearHabits'],
  },
];

const axisByFamilyDomain = new Map(
  axisDefinitions.map((axis) => [`${axis.bodyTypeFamily}:${axis.sourceDomain}`, axis]),
);

const adapterOverrides = (intakeV1.json.overrides ?? []).filter(
  (entry: Record<string, unknown>) =>
    entry.state === 'SOURCE_MARKED_NOT_APPLICABLE_REQUIRES_SCHEMA_ADAPTER',
);

assert(adapterOverrides.length === 9, `expected 9 adapter overrides, got ${adapterOverrides.length}`);

const decisions = adapterOverrides.map((entry: Record<string, unknown>) => {
  const characterId = String(entry.characterId);
  const species = String(entry.species);
  const sourceDomain = String(entry.domain);
  const character = characters.get(characterId);
  const bodyTypeFamily = familyBySpecies[species];
  const axis = axisByFamilyDomain.get(`${bodyTypeFamily}:${sourceDomain}`);
  const intakeMarkerPaths = Array.isArray(entry.notApplicablePaths)
    ? entry.notApplicablePaths.map(String)
    : [];

  assert(character, `missing source character ${characterId}`);
  assert(bodyTypeFamily, `human or unsupported species entered adapter: ${species}`);
  assert(axis, `missing axis for ${bodyTypeFamily}:${sourceDomain}`);
  assert(intakeMarkerPaths.length > 0, `${characterId}.${sourceDomain} has no NOT_APPLICABLE path`);

  const profileMarkers = intakeMarkerPaths.map((intakePath) => {
    const sourceProfilePath = markerProfilePathByDomain[sourceDomain]?.[intakePath];
    assert(sourceProfilePath, `no source-profile path for ${sourceDomain}.${intakePath}`);
    const value = atPath(character, sourceProfilePath);
    assert(
      typeof value === 'string' && /NOT[_ -]?APPLICABLE/i.test(value),
      `${characterId}.${sourceProfilePath} no longer preserves NOT_APPLICABLE`,
    );
    return { intakePath, sourceProfilePath, value };
  });

  const sourceEvidence = axis.sourceEvidencePaths.map((sourceProfilePath) => ({
    sourceProfilePath,
    value: atPath(character, sourceProfilePath),
  }));
  assert(
    sourceEvidence.every((evidence) => evidence.value !== undefined),
    `${characterId}.${sourceDomain} has missing configured source evidence`,
  );

  return {
    id: `${characterId}.${sourceDomain}`,
    characterId,
    characterName: String(character.name),
    species,
    bodyTypeFamily,
    sourceDomain,
    sourceState: entry.state,
    sourceNotApplicable: {
      preserved: true,
      markers: profileMarkers,
    },
    adapter: {
      axisId: axis.axisId,
      mappingState: 'ADAPTER_MAPPING_READY_REQUIRES_HUMAN_SCHEMA_REVIEW',
      sourceEvidence,
      createsCharacterFact: false,
      permitsHumanFallback: false,
    },
    review: {
      requiresHumanSchemaReview: true,
      canonPromotionBlocked: true,
      imageModelFreedom: false,
      generatedImageMayCloseItem: false,
    },
  };
});

const expectedDecisionIds = [
  'kuu.skinCoverage',
  'kuu.personalGrooming',
  'kuu.accessoryPropInventory',
  'yomo.skinCoverage',
  'yomo.personalGrooming',
  'yomo.accessoryPropInventory',
  'rum.bodyAdornment',
  'rum.skinCoverage',
  'rum.personalGrooming',
];

assert(
  JSON.stringify(decisions.map((decision) => decision.id)) === JSON.stringify(expectedDecisionIds),
  'species-adapter decision membership or order drift',
);

const adapter = {
  id: 'yoru-no-shirube-life-choice-species-body-type-schema-adapter-v1',
  date: '2026-08-18',
  status: 'DERIVED_BODY_TYPE_SCHEMA_ADAPTER_NON_CANON_REQUIRES_HUMAN_SCHEMA_REVIEW',
  sources: {
    [paths.sourceProfile]: sourceProfile.sha256,
    [paths.intakeV1]: intakeV1.sha256,
  },
  scope: {
    characterCount: new Set(decisions.map((decision) => decision.characterId)).size,
    speciesCount: new Set(decisions.map((decision) => decision.species)).size,
    axisDefinitionCount: axisDefinitions.length,
    sourceFuture15DecisionCount: intakeV1.json.scope.decisionCount,
    sourceNotApplicableDecisionCount: adapterOverrides.length,
    adapterMappedDecisionCount: decisions.length,
    humanSchemaReviewRequiredCount: decisions.length,
    canonPromotedCount: 0,
    imageResolvedCount: 0,
  },
  safety: {
    noNewCharacterFactsAuthored: true,
    sourceNotApplicableMarkersPreserved: true,
    sourceProfileUnchanged: true,
    sourceIntakeUnchanged: true,
    humanDefaultFallbackForbidden: true,
    adapterMappingDoesNotEqualCanonPromotion: true,
    requiresHumanSchemaReview: true,
    imageModelFreedom: false,
    generatedImageMayCloseItem: false,
  },
  bodyTypeFamilies: [
    { id: 'REAL_ANIMAL', species: ['DOG', 'CAT'], decisionCount: 6 },
    { id: 'MAINTENANCE_ROBOT', species: ['MAINTENANCE_ROBOT'], decisionCount: 3 },
  ],
  axisDefinitions,
  decisions,
  nextActionBoundary: 'HUMAN_SCHEMA_REVIEW_ONLY_NO_CANON_OR_IMAGE_PROMOTION',
};

assert(adapter.scope.adapterMappedDecisionCount === 9, 'adapter coverage must remain 9');
assert(adapter.scope.sourceFuture15DecisionCount === 90, 'Future15 decision total drift');

if (process.argv.includes('--check-materialized')) {
  const actual = JSON.parse(readFileSync(resolve(root, paths.adapter), 'utf8'));
  assert(JSON.stringify(actual) === JSON.stringify(adapter), `${paths.adapter} is stale`);
  console.log('[life-choice-species-schema-adapter] materialized adapter fresh');
} else if (process.argv.includes('--emit-compact')) {
  console.log(JSON.stringify(adapter, null, 2));
} else {
  console.log('[life-choice-species-schema-adapter] OK');
  console.log(JSON.stringify(adapter.scope));
}
