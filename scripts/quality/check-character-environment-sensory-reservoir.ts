import fs from 'node:fs';
import {
  CHARACTER_ENVIRONMENT_SENSORY_AXES,
  CHARACTER_ENVIRONMENT_SENSORY_RESERVOIR,
  CHARACTER_ENVIRONMENT_SENSORY_RULES,
  characterEnvironmentSensorySummary,
} from '../../src/game/data/characterEnvironmentSensoryReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const requiredPaths = [
  'docs/00-current-story-world-master.md',
  'docs/character-environment-sensory-reservoir-v1.md',
  'src/game/data/characterEnvironmentSensoryReservoir.ts',
  'src/game/data/characterBehaviorIdentityReservoir.ts',
  'src/game/data/characterLivedArtifactReservoir.ts',
  'src/game/data/characterRealityRootRegistry.ts',
] as const;
for (const path of requiredPaths) assert(fs.existsSync(path), `missing environment/sensory prerequisite: ${path}`);

assert(CHARACTER_ENVIRONMENT_SENSORY_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'environment/sensory status drift');
assert(CHARACTER_ENVIRONMENT_SENSORY_RULES.characterCoverageRequired === 36, 'environment/sensory character target drift');
assert(CHARACTER_ENVIRONMENT_SENSORY_RULES.axesPerCharacterRequired === 9, 'environment/sensory axis target drift');
assert(CHARACTER_ENVIRONMENT_SENSORY_RULES.totalAnchorCountRequired === 324, 'environment/sensory anchor target drift');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.exactMedicalConditionFrozenHere, 'sensory reservoir may not freeze diagnosis');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.environmentPreferenceDeterminesDiagnosis, 'environment preference may not determine diagnosis');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.quietPreferenceMeansShy, 'quiet preference may not mean shy');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.crowdPreferenceDeterminesSociability, 'crowd preference may not define sociability');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.weatherPreferenceDeterminesOrigin, 'weather preference may not prove origin');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.sensoryPreferenceDeterminesMorality, 'sensory preference may not define morality');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.wheelchairAccessibilityDeterminesPersonality, 'wheelchair accessibility may not define personality');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.speciesSenseIsSupernaturalTruthDetection, 'animal senses may not become supernatural truth detection');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.artificialBodySensorMeansEmotionless, 'artificial sensor capability may not erase emotion');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.eraOrRegionStereotypeDeterminesPreference, 'Era/region stereotype may not determine sensory preference');
assert(!CHARACTER_ENVIRONMENT_SENSORY_RULES.runtimeAutoPromotionAllowed, 'environment/sensory reservoir may not auto-promote runtime');

const expectedIds = [
  'yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren',
  'hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane',
] as const;

assert(CHARACTER_ENVIRONMENT_SENSORY_AXES.length === 9, `expected 9 environment/sensory axes, got ${CHARACTER_ENVIRONMENT_SENSORY_AXES.length}`);
assert(new Set(CHARACTER_ENVIRONMENT_SENSORY_AXES).size === 9, 'environment/sensory axes must be unique');
assert(CHARACTER_ENVIRONMENT_SENSORY_RESERVOIR.length === 36, `expected 36 characters, got ${CHARACTER_ENVIRONMENT_SENSORY_RESERVOIR.length}`);
assert(characterEnvironmentSensorySummary.characterCount === 36, 'environment/sensory summary character drift');
assert(characterEnvironmentSensorySummary.uniqueIds === 36, 'environment/sensory IDs must be unique');
assert(characterEnvironmentSensorySummary.anchorCount === 324, `expected 324 anchors, got ${characterEnvironmentSensorySummary.anchorCount}`);
assert(characterEnvironmentSensorySummary.fullyCoveredCount === 36, `all 36 require all 9 axes, got ${characterEnvironmentSensorySummary.fullyCoveredCount}`);
assert(!characterEnvironmentSensorySummary.runtimeAutoPromotionAllowed, 'summary may not auto-promote runtime');

const actualIds = new Set(CHARACTER_ENVIRONMENT_SENSORY_RESERVOIR.map((entry) => entry.id));
for (const id of expectedIds) assert(actualIds.has(id), `missing environment/sensory character: ${id}`);

for (const entry of CHARACTER_ENVIRONMENT_SENSORY_RESERVOIR) {
  assert(entry.name.trim().length > 0, `environment/sensory name missing: ${entry.id}`);
  const anchorKeys = Object.keys(entry.anchors);
  assert(anchorKeys.length === 9, `${entry.id} must have exactly 9 environment/sensory anchors`);
  for (const axis of CHARACTER_ENVIRONMENT_SENSORY_AXES) {
    const value = entry.anchors[axis];
    assert(typeof value === 'string' && value.trim().length >= 12, `${entry.id}.${axis} is too thin`);
  }
}

const byId = new Map(CHARACTER_ENVIRONMENT_SENSORY_RESERVOIR.map((entry) => [entry.id, entry]));
assert(byId.get('asa')?.anchors.WEATHER_RESPONSE.includes('HUMAN'), 'Asa environment source must preserve Human framing');
assert(byId.get('kage1')?.anchors.CROWD_DENSITY.includes('CLEARANCE'), 'Kaname must preserve real body-space clearance instead of personality shorthand');
assert(byId.get('hana')?.anchors.TEMPERATURE_HABIT.includes('PLUS_SIZE_OLDER_BODY'), 'Hana environment comfort must preserve plus-size older body identity');
assert(byId.get('gen')?.anchors.CROWD_DENSITY.includes('OLD_PERSON_FRAGILITY_DEFAULT'), 'Gen must reject old-person fragility default');
assert(byId.get('hiyori')?.anchors.LIGHT_LEVEL.includes('SKIN_TONE_DOES_NOT_DICTATE_PALETTE'), 'Hiyori skin tone may not determine environment palette');
assert(byId.get('touma')?.anchors.AMBIENT_SOUND.includes('BROWN_SKIN_DOES_NOT_IMPLY_MUSIC_CODE'), 'Touma skin tone may not determine sound culture');
assert(byId.get('suzu')?.anchors.AMBIENT_SOUND.includes('NOT FEMININE_PRESENTATION'), 'Suzu presentation may not determine sensory preference');
assert(byId.get('io')?.anchors.LIGHT_LEVEL.includes('GENDER_UNDISCLOSED'), 'Io environment preference may not become gender clue');
assert(byId.get('amane')?.anchors.TRAVEL_ENVIRONMENT.includes('REAL_ACCESSIBILITY'), 'Amane must preserve real accessibility as environment design');
assert(byId.get('kuu')?.anchors.SMELL_ASSOCIATION.includes('NOT LIE_DETECTOR'), 'Kuu smell may not become truth detector');
assert(byId.get('yomo')?.anchors.AMBIENT_SOUND.includes('WITHOUT OMNISCIENT_THREAT_DETECTION'), 'Yomo senses may not become omniscient detection');
assert(byId.get('noa')?.anchors.AMBIENT_SOUND.includes('WITHOUT MONOTONE_EMOTIONLESS_RESPONSE'), 'Noa sensor precision may not imply emotionless behavior');
assert(byId.get('rum')?.anchors.TEMPERATURE_HABIT.includes('FUNCTIONAL'), 'Rum thermal behavior must remain functional/personhood-separated');
assert(byId.get('kai')?.anchors.AMBIENT_SOUND !== byId.get('nao')?.anchors.AMBIENT_SOUND, 'Kai/Nao must not be sensory mirror clones');

const doc = fs.readFileSync('docs/character-environment-sensory-reservoir-v1.md', 'utf8');
for (const token of [
  'AUTHOR RESERVOIR / NON-CANON / FREE TO OVERWRITE / NO DIAGNOSIS INFERENCE',
  '36 characters × 9 axes = 324 environment/sensory anchors',
  '環境への好み・癖・反応は、診断名や人格の答えではない。',
  'Accessibility is not personality',
  'sensorCapability != personalPreference',
  'environmentSensory',
  'runtimeAutoPromotionAllowed = false',
]) assert(doc.includes(token), `environment/sensory doc guard missing: ${token}`);

console.log(JSON.stringify({
  characters: characterEnvironmentSensorySummary.characterCount,
  axes: CHARACTER_ENVIRONMENT_SENSORY_AXES.length,
  anchors: characterEnvironmentSensorySummary.anchorCount,
  fullyCovered: characterEnvironmentSensorySummary.fullyCoveredCount,
  diagnosisFrozen: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
