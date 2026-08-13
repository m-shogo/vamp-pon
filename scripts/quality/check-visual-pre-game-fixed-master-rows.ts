import { existsSync, readFileSync } from 'node:fs';

const PATH = 'data/character-assets/manifests/visual-pre-game-fixed-master-rows.v1.json';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(existsSync(PATH), `missing fixed pre-game registry: ${PATH}`);
const registry = JSON.parse(readFileSync(PATH, 'utf8'));

assert(registry.schemaVersion === 1, 'fixed pre-game registry schemaVersion must remain 1');
assert(registry.status === 'PLANNED_NOT_AUTHORIZED_FOR_GENERATION', 'fixed pre-game registry may not become generation-authorized');
assert(registry.globalRules?.generationAllowed === false, 'global generationAllowed must remain false');
assert(registry.globalRules?.humanReviewRequired === true, 'human review must remain required');
assert(registry.globalRules?.openFieldsMayNotBeInvented === true, 'OPEN fields may not become model freedom');
assert(registry.globalRules?.duplicatePhysicalOrBinaryAssetsForbidden === true, 'duplicate physical/binary assets must remain forbidden');
assert(registry.globalRules?.reuseThroughUsageTargetsInsteadOfCopy === true, 'reuse must remain usageTargets-based');
assert(registry.globalRules?.legacyYatsukageMayNotNameCurrentMaster === true, 'legacy 八影 may not name Current masters');
assert(registry.globalRules?.currentSeason1AntagonistFormalName === '朔夜座', 'Current S1 formal name must remain 朔夜座');
assert(registry.globalRules?.gunjoIsRecordTaxonomyNotFaction === true, 'Gunjo must remain record taxonomy, not faction');

const masters = Array.isArray(registry.masters) ? registry.masters : [];
const policies = Array.isArray(registry.policies) ? registry.policies : [];
assert(registry.counts?.visualOrEditableMasterRows === 16, 'fixed visual/editable master count must be 16');
assert(registry.counts?.governancePolicyRows === 2, 'fixed governance policy count must be 2');
assert(registry.counts?.totalRows === 18, 'fixed total row count must be 18');
assert(masters.length === 16, `expected 16 master rows, got ${masters.length}`);
assert(policies.length === 2, `expected 2 policy rows, got ${policies.length}`);

const ids = masters.map((entry: any) => entry.assetId);
assert(new Set(ids).size === ids.length, 'fixed master assetIds must be unique');
const policyIds = policies.map((entry: any) => entry.policyId);
assert(new Set(policyIds).size === policyIds.length, 'fixed policyIds must be unique');
assert(!ids.some((id: string) => /yatsukage|八影/i.test(id)), 'Current master assetId may not use legacy Yatsukage/八影 naming');
assert(!masters.some((entry: any) => /夜綴りの八影/.test(entry.displayName ?? '')), 'Current master displayName may not use legacy formal label');

for (const entry of masters) {
  assert(typeof entry.assetId === 'string' && entry.assetId.length > 8, `invalid master assetId: ${String(entry.assetId)}`);
  assert(typeof entry.familyId === 'string' && entry.familyId.length > 4, `${entry.assetId}: missing familyId`);
  assert(typeof entry.artifactType === 'string' && entry.artifactType.length > 3, `${entry.assetId}: missing artifactType`);
  assert(entry.generationAllowed === false, `${entry.assetId}: generationAllowed must remain false`);
  assert(Array.isArray(entry.sourceOfTruth) && entry.sourceOfTruth.length > 0, `${entry.assetId}: sourceOfTruth required`);
  assert(Array.isArray(entry.usageTargets) && entry.usageTargets.length > 0, `${entry.assetId}: usageTargets required`);
}

for (const policy of policies) {
  assert(typeof policy.policyId === 'string' && policy.policyId.endsWith('-v1'), `invalid policyId: ${String(policy.policyId)}`);
  assert(policy.artifactType === 'ADMISSION_POLICY_NOT_IMAGE', `${policy.policyId}: policies may not masquerade as image masters`);
  assert(policy.generationAllowed === false, `${policy.policyId}: generationAllowed must remain false`);
  assert(Array.isArray(policy.requires) && policy.requires.length >= 5, `${policy.policyId}: admission requirements are incomplete`);
  assert(Array.isArray(policy.forbids) && policy.forbids.length >= 3, `${policy.policyId}: forbidden shortcuts are incomplete`);
}

const familyCounts = new Map<string, number>();
for (const entry of masters) familyCounts.set(entry.familyId, (familyCounts.get(entry.familyId) ?? 0) + 1);
const expectedFamilyCounts: Record<string, number> = {
  'sakuyaza-team-comparison-master': 1,
  'gunjo-record-foundation-masters': 2,
  'core5-reality-era-environment-reference-master': 5,
  'core5-era-population-household-reference-master': 5,
  'dream-common-daily-life-infrastructure-master': 1,
  'sky-moon-resolution-color-script-master': 1,
  'modern-iau88-constellation-line-art-vector-master': 1,
};
for (const [familyId, expected] of Object.entries(expectedFamilyCounts)) {
  assert(familyCounts.get(familyId) === expected, `${familyId}: expected ${expected}, got ${familyCounts.get(familyId) ?? 0}`);
}
assert([...familyCounts.keys()].length === Object.keys(expectedFamilyCounts).length, 'unexpected fixed master family entered registry without checker update');

const eraMasters = masters.filter((entry: any) => entry.familyId === 'core5-reality-era-environment-reference-master');
const eraSubjects = new Set(eraMasters.map((entry: any) => entry.subjectId));
for (const subject of ['tomori-era', 'michiru-era', 'nagi-era', 'yui-era', 'asa-era']) {
  assert(eraSubjects.has(subject), `missing Core5 Reality Era environment master: ${subject}`);
}

const householdMasters = masters.filter((entry: any) => entry.familyId === 'core5-era-population-household-reference-master');
const requiredLenses = new Set(['child', 'teen-or-young-adult', 'parent-age-adult', 'older-adult', 'non-parent-adult', 'non-nuclear-household']);
for (const entry of householdMasters) {
  assert(entry.namedCastCreated === false, `${entry.assetId}: background population reference may not create named cast`);
  assert(entry.canonRelativesCreated === false, `${entry.assetId}: background reference may not create Canon relatives`);
  const lenses = new Set(entry.requiredLenses ?? []);
  for (const lens of requiredLenses) assert(lenses.has(lens), `${entry.assetId}: missing population lens ${lens}`);
}

const gunjo = masters.filter((entry: any) => entry.familyId === 'gunjo-record-foundation-masters');
for (const entry of gunjo) {
  const forbidden = new Set(entry.forbidden ?? []);
  if (entry.assetId === 'gunjo-record-taxonomy-system-master-v1') {
    for (const token of ['fixed-member-roster', 'uniform', 'headquarters', 'faction-emblem', 'fixed-boss-count']) {
      assert(forbidden.has(token), `${entry.assetId}: missing anti-faction guard ${token}`);
    }
  }
}

const sky = masters.find((entry: any) => entry.assetId === 'world-sky-moon-resolution-color-script-master-v1');
assert(sky, 'missing sky/moon/resolution master');
for (const token of ['saku-moonless-stars-remain', 'post-resolution-sky-brightening', 'no-physical-sunrise-required']) {
  assert((sky.contains ?? []).includes(token), `sky master missing rule: ${token}`);
}

const constellation = masters.find((entry: any) => entry.assetId === 'modern-iau88-project-line-art-vector-master-v1');
assert(constellation?.artifactType === 'VECTOR_SVG_SYSTEM', 'modern IAU88 master must be vector system');
assert((constellation?.contains ?? []).includes('explicit-not-official-iau-line-art-label'), 'IAU88 master must not claim project line art is official IAU line art');

const sakuyaza = masters.find((entry: any) => entry.assetId === 'sakuyaza-s1-team-comparison-master-v1');
assert(sakuyaza?.displayName?.includes('朔夜座'), 'Sakuyaza comparison master must use Current formal name');
assert((sakuyaza?.dependsOn ?? []).length === 8, 'Sakuyaza comparison master must depend on eight individual master lineages');

console.log(JSON.stringify({
  status: 'PASS',
  registryId: registry.registryId,
  masterRows: masters.length,
  policyRows: policies.length,
  families: Object.fromEntries([...familyCounts.entries()].sort(([a], [b]) => a.localeCompare(b))),
  generationAllowed: false,
}, null, 2));
