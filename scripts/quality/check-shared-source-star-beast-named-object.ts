import { commercialProductionProfileById, commercialProductionProfiles } from '../../src/game/data/commercialProductionProfile.ts';
import { characterThemeColorById, characterThemeColors } from '../../src/game/data/characterThemeColors.ts';
import { namedObjectRegistry } from '../../src/game/data/namedObjectRegistry.ts';
import {
  NAMED_OBJECT_GEOMETRY_SEEDS,
  namedObjectVisualSharedSourceEntries,
} from '../../src/game/data/namedObjectVisualSharedSource.ts';
import {
  STAR_BEAST_MORPHOLOGY_RULES,
  starBeastVisualSharedSourceEntries,
} from '../../src/game/data/starBeastVisualSharedSource.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source Star Beast Named Object] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

// Star Beast: 21 source assignments, one beast-first entry per Character/Reserve identity.
assert(characterThemeColors.length === 21, `Character theme/Star Beast source count drift: ${characterThemeColors.length}`);
assert(commercialProductionProfiles.length === 21, `commercial profile count drift: ${commercialProductionProfiles.length}`);
assert(starBeastVisualSharedSourceEntries.length === 21, `Star Beast Shared Source count drift: ${starBeastVisualSharedSourceEntries.length}`);
assert(new Set(starBeastVisualSharedSourceEntries.map((entry) => entry.id)).size === 21, 'duplicate Star Beast Shared Source id');
assert(new Set(starBeastVisualSharedSourceEntries.map((entry) => entry.characterId)).size === 21, 'duplicate Star Beast owner');

const sourceConstellationKeys = [...new Set(characterThemeColors.map((entry) => entry.starBeastTheme.constellationKey))].sort();
const morphologyKeys = Object.keys(STAR_BEAST_MORPHOLOGY_RULES).sort();
assert(JSON.stringify(morphologyKeys) === JSON.stringify(sourceConstellationKeys), `Star Beast morphology coverage drift: ${morphologyKeys.join(',')}`);

for (const entry of starBeastVisualSharedSourceEntries) {
  const source = characterThemeColorById.get(entry.characterId);
  const profile = commercialProductionProfileById.get(entry.characterId);
  assert(source, `${entry.id}: missing source theme assignment`);
  assert(profile, `${entry.id}: missing commercial profile`);
  assert(entry.species === source.starBeastTheme.starBeast, `${entry.id}: species authority drift`);
  assert(entry.constellationKey === source.starBeastTheme.constellationKey, `${entry.id}: constellation authority drift`);
  assert(entry.favoriteConstellation === source.starBeastTheme.favoriteConstellation, `${entry.id}: favorite constellation drift`);
  assert(entry.themeHex === source.starBeastTheme.hex, `${entry.id}: Star Beast HEX drift`);
  assert(entry.commercialRecognitionHook === profile.plushReadability.recognitionHook, `${entry.id}: commercial recognition hook drift`);
  assert(entry.referenceGenerationReady === true, `${entry.id}: beast-first Shared Source should be reference-brief ready`);
  assert(entry.runtimeReady === false, `${entry.id}: Star Beast runtime implementation inferred`);
  assert(entry.artworkReady === false && entry.artworkState === 'NOT_GENERATED', `${entry.id}: Star Beast artwork inferred`);
  assert(/separate removable\/embroidered goods tag/i.test(entry.toumonTagPosition), `${entry.id}: Toumon separation/tag boundary missing`);
  assert(entry.negativePromptHints.some((hint) => /Toumon geometry/i.test(hint)), `${entry.id}: unfinished Toumon negative guard missing`);
  assert(entry.frontSilhouette.length > 100 && entry.sideSilhouette.length > 100, `${entry.id}: silhouette source too weak`);
  assert(entry.generationBriefSeed.length > 300, `${entry.id}: generation brief seed too weak`);
  if (entry.scope === 'OFFICIAL_RESERVE') {
    assert(entry.launchEligible === false, `${entry.id}: Reserve Star Beast cannot become launch eligible`);
  } else {
    assert(entry.launchEligible === true, `${entry.id}: Current20 Star Beast launch scope drift`);
  }
}

const duplicates = new Map<string, string[]>();
for (const entry of starBeastVisualSharedSourceEntries) {
  const owners = duplicates.get(entry.constellationKey) ?? [];
  owners.push(entry.characterId);
  duplicates.set(entry.constellationKey, owners);
}
const duplicateKeys = [...duplicates.entries()].filter(([, owners]) => owners.length > 1).map(([key]) => key).sort();
assert(JSON.stringify(duplicateKeys) === JSON.stringify(['canes-venatici', 'leo']), `unexpected duplicated constellations: ${duplicateKeys.join(',')}`);
const yuiBeast = starBeastVisualSharedSourceEntries.find((entry) => entry.characterId === 'yui');
const tomoriBeast = starBeastVisualSharedSourceEntries.find((entry) => entry.characterId === 'tomori');
const ritsuBeast = starBeastVisualSharedSourceEntries.find((entry) => entry.characterId === 'ritsu');
const koyoriBeast = starBeastVisualSharedSourceEntries.find((entry) => entry.characterId === 'koyori');
assert(yuiBeast && /tomori/i.test(yuiBeast.duplicateConstellationDifference), 'Yui Leo duplicate difference missing');
assert(tomoriBeast && /yui/i.test(tomoriBeast.duplicateConstellationDifference), 'Tomori Leo duplicate difference missing');
assert(ritsuBeast && /koyori/i.test(ritsuBeast.duplicateConstellationDifference), 'Ritsu sibling-hound difference missing');
assert(koyoriBeast && /ritsu/i.test(koyoriBeast.duplicateConstellationDifference), 'Koyori sibling-hound difference missing');

const hanaBeast = starBeastVisualSharedSourceEntries.find((entry) => entry.characterId === 'hana');
assert(hanaBeast, 'Hana Star Beast missing');
assert(/plump|full rounded/i.test(`${hanaBeast.sideSilhouette} ${hanaBeast.plushSewingRule}`), 'Hana swan plump-body identity missing');
assert(hanaBeast.avoid.some((rule) => /slimming/i.test(rule)), 'Hana swan no-slimming guard missing');
assert(hanaBeast.avoid.some((rule) => /food\/glutton/i.test(rule)), 'Hana swan no-food/body-comedy guard missing');

const kanameBeast = starBeastVisualSharedSourceEntries.find((entry) => entry.characterId === 'kage1');
assert(kanameBeast, 'Kaname Star Beast missing');
assert(kanameBeast.avoid.some((rule) => /bodybuilder wolf/i.test(rule)), 'Kaname wolf bodybuilder normalization guard missing');
assert(kanameBeast.avoid.some((rule) => /hitbox/i.test(rule)), 'Kaname wolf body-size/gameplay-stat separation missing');

const renBeast = starBeastVisualSharedSourceEntries.find((entry) => entry.characterId === 'ren');
assert(renBeast?.scope === 'OFFICIAL_RESERVE' && renBeast.launchEligible === false, 'Ren Star Beast Reserve boundary missing');
assert(renBeast.avoid.some((rule) => /Current20/i.test(rule)), 'Ren Star Beast commercial boundary warning missing');

// Named Object: only core luminous possession receives this P9 three-view candidate source.
const luminousPossessions = namedObjectRegistry.filter((entry) => entry.phase === 'luminous_possession');
assert(luminousPossessions.length === 21, `luminous possession source count drift: ${luminousPossessions.length}`);
assert(namedObjectVisualSharedSourceEntries.length === luminousPossessions.length, `Named Object visual coverage drift: ${namedObjectVisualSharedSourceEntries.length}/${luminousPossessions.length}`);
assert(new Set(namedObjectVisualSharedSourceEntries.map((entry) => entry.id)).size === 21, 'duplicate Named Object visual adapter id');
assert(new Set(namedObjectVisualSharedSourceEntries.map((entry) => entry.sourceNamedObjectId)).size === 21, 'duplicate core Named Object source relation');
assert(JSON.stringify(Object.keys(NAMED_OBJECT_GEOMETRY_SEEDS).sort()) === JSON.stringify(luminousPossessions.map((entry) => entry.characterId).sort()), 'Named Object geometry seed coverage drift');

for (const entry of namedObjectVisualSharedSourceEntries) {
  const source = luminousPossessions.find((object) => object.id === entry.sourceNamedObjectId);
  const profile = commercialProductionProfileById.get(entry.ownerId);
  assert(source, `${entry.id}: source Named Object missing`);
  assert(profile, `${entry.id}: commercial profile missing`);
  assert(entry.displayName === source.displayName, `${entry.id}: object name authority drift`);
  assert(entry.namingStatus === source.namingStatus, `${entry.id}: naming status authority drift`);
  assert(entry.ownerId === source.characterId, `${entry.id}: owner authority drift`);
  assert(entry.phase === 'luminous_possession', `${entry.id}: only core luminous possession belongs in P9 core source`);
  assert(entry.geometryAuthority === 'CANDIDATE_OBJECT_GEOMETRY', `${entry.id}: candidate geometry silently promoted`);
  assert(entry.referenceGenerationReady === false, `${entry.id}: unapproved candidate geometry must remain generation HOLD`);
  assert(entry.runtimeReady === false, `${entry.id}: Named Object runtime readiness inferred`);
  assert(entry.artworkReady === false && entry.artworkState === 'NOT_GENERATED', `${entry.id}: Named Object artwork inferred`);
  assert(entry.functionalReplicaAllowed === false, `${entry.id}: functional replica approval must be fail-closed`);
  assert(entry.premiumReplicaAllowed === false, `${entry.id}: premium replica approval must be fail-closed`);
  assert(entry.commercialEntryForm === profile.namedObjectReplica.entryForm, `${entry.id}: commercial entry form drift`);
  assert(entry.commercialCollectorForm === profile.namedObjectReplica.collectorForm, `${entry.id}: collector form drift`);
  assert(entry.premiumReplicaCandidate === profile.namedObjectReplica.premiumReplicaCandidate, `${entry.id}: premium candidate drift`);
  assert(entry.frontSilhouette.length > 60 && entry.backSilhouette.length > 50 && entry.sideSilhouette.length > 50, `${entry.id}: three-view candidate source too weak`);
  assert(entry.material.length > 20 && entry.wearMarks.length > 20 && entry.historyMarkRule.length > 25, `${entry.id}: material/history source too weak`);
  assert(entry.generationBriefSeed.length > 350, `${entry.id}: Named Object generation brief seed too weak`);
  assert(entry.avoid.some((rule) => /new backstory/i.test(rule)), `${entry.id}: new-backstory guard missing`);
  if (entry.ownerId === 'ren') {
    assert(entry.entryGoodsAllowed === false && entry.collectorGoodsAllowed === false, 'Ren core object must not become launch goods eligible');
  }
}

const hanaObject = namedObjectVisualSharedSourceEntries.find((entry) => entry.ownerId === 'hana');
assert(hanaObject?.avoid.some((rule) => /body-size joke/i.test(rule)), 'Hana object body-comedy guard missing');
const kanameObject = namedObjectVisualSharedSourceEntries.find((entry) => entry.ownerId === 'kage1');
assert(kanameObject, 'Kaname core Named Object missing');
assert(
  /hitbox|HP|slow/i.test(`${kanameObject.scale} ${kanameObject.historyMarkRule} ${kanameObject.avoid.join(' ')}`),
  'Kaname object body-size/gameplay-stat guard missing',
);

console.log(
  `Shared Source Star Beast Named Object: PASS (` +
    `starBeasts=${starBeastVisualSharedSourceEntries.length}, morphology=${morphologyKeys.length}, ` +
    `namedObjects=${namedObjectVisualSharedSourceEntries.length}, reserve=ren, objectGeometry=candidate-hold)`,
);
