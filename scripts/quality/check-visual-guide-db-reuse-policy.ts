import { readFileSync } from 'node:fs';

const PATH = 'data/character-assets/manifests/visual-guide-db-reuse-policy.v1.json';
const policy = JSON.parse(readFileSync(PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(policy.schemaVersion === 1, 'Guide DB reuse policy schemaVersion must remain 1');
assert(policy.status === 'CURRENT_PRODUCTION_POLICY_FOR_INVENTORY_NO_AUTOMATIC_GENERATION', 'Guide DB reuse policy may not authorize generation');
assert(policy.globalRules?.bakedCardGenerationDefault === false, 'Guide cards must not default to baked generated images');
assert(policy.globalRules?.reuseApprovedMasterBeforeCreatingDerivativeBinary === true, 'approved masters must be reused first');
assert(policy.globalRules?.cropOrMaskDoesNotRequireDuplicateSourceBinary === true, 'crop/mask may not force duplicate source binary');
assert(policy.globalRules?.sameAssetAcrossGuideDbTopUsesUsageTargets === true, 'cross-surface reuse must use usageTargets');
assert(policy.globalRules?.htmlCssSvgOwnsLayoutTextStatusAndRelationshipLines === true, 'HTML/CSS/SVG must own guide layout/status/relationship lines');
assert(policy.globalRules?.longReadableTextMayNotBeBakedIntoGeneratedArt === true, 'long readable guide copy may not be baked into generated art');
assert(policy.globalRules?.candidateOrRejectedAssetMayNotAppearAsApprovedGuidePortrait === true, 'candidate/rejected asset may not masquerade as approved guide portrait');
assert(policy.globalRules?.guideAssetMayNotBecomeGameplayParent === true, 'guide asset may not parent gameplay');

const families = Array.isArray(policy.families) ? policy.families : [];
const familyById = new Map(families.map((entry: any) => [entry.familyId, entry]));
for (const id of [
  'character-profile',
  'character-era',
  'character-reality-root',
  'relationship',
  'foreshadow-mystery',
  'star-beast-profile',
  'named-object-artifact-profile',
  'item-catalog',
  'enemy-catalog',
  'location-stage-guide',
  'constellation',
  'glossary',
  'sakuyaza-group',
  'gunjo-record',
  'timeline-history',
]) {
  assert(familyById.has(id), `Guide DB reuse policy missing family: ${id}`);
}
for (const family of families) {
  assert(family.newBinaryDefault === false, `${family.familyId}: Guide family may not default to new binary generation`);
  assert(typeof family.layoutOwner === 'string' && family.layoutOwner.length > 0, `${family.familyId}: layoutOwner required`);
  assert(typeof family.visualSource === 'string' && family.visualSource.length > 0, `${family.familyId}: visualSource required`);
}

assert(familyById.get('star-beast-profile')?.expectedSourceSubjects === 21, 'Star Beast Guide source subject count drift');
assert(familyById.get('named-object-artifact-profile')?.expectedSourceSubjects === 21, 'Named Object Guide source subject count drift');
assert(familyById.get('enemy-catalog')?.expectedSourceSubjects === 48, 'Enemy Guide source subject count drift');
assert(familyById.get('location-stage-guide')?.expectedSourceSubjects === 20, 'Location Guide source subject count drift');
assert(familyById.get('item-catalog')?.rawSourceRows === 105, 'Item Guide raw source row count drift');
assert(familyById.get('item-catalog')?.finalVisualSubjectCount === 'TBD_AFTER_LINEAGE_REVIEW', 'Item Guide final visual subject count must remain lineage-dependent');

const affectedKinds = new Set(policy.legacyProductionListMigration?.affectedKinds ?? []);
for (const kind of [
  'lorebook-profile',
  'lorebook-era',
  'lorebook-reality-root',
  'lorebook-relationship',
  'lorebook-foreshadow',
]) {
  assert(affectedKinds.has(kind), `legacy Guide baked-image migration missing kind: ${kind}`);
}
assert(policy.legacyProductionListMigration?.generationAllowedBeforeMigration === false, 'old baked Guide rows may not be generated before migration');
assert(policy.imageGenerationImpact?.theseSubjectsRequireNewIndependentGuideBinaryByDefault === 0, 'Guide subject coverage may not inflate independent image binary count');

console.log(JSON.stringify({
  status: 'PASS',
  policyId: policy.policyId,
  guideFamilies: families.length,
  affectedLegacyKinds: [...affectedKinds],
  newIndependentGuideBinariesByDefault: 0,
}, null, 2));
