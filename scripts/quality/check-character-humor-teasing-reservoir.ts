import fs from 'node:fs';
import {
  CHARACTER_HUMOR_TEASING_AXES,
  CHARACTER_HUMOR_TEASING_RESERVOIR,
  CHARACTER_HUMOR_TEASING_RULES,
  characterHumorTeasingSummary,
} from '../../src/game/data/characterHumorTeasingReservoir.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(CHARACTER_HUMOR_TEASING_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'humor status drift');
assert(CHARACTER_HUMOR_TEASING_RULES.characterCoverageRequired === 36, 'humor character target drift');
assert(CHARACTER_HUMOR_TEASING_RULES.axesPerCharacterRequired === 5, 'humor axis target drift');
assert(CHARACTER_HUMOR_TEASING_RULES.totalAnchorCountRequired === 180, 'humor anchor target drift');
for (const [label, value] of [
  ['protected trait punchline', CHARACTER_HUMOR_TEASING_RULES.protectedTraitMayBePunchlineByDefault],
  ['body punchline', CHARACTER_HUMOR_TEASING_RULES.bodyMayBePunchlineByDefault],
  ['age punchline', CHARACTER_HUMOR_TEASING_RULES.ageMayBePunchlineByDefault],
  ['dialect punchline', CHARACTER_HUMOR_TEASING_RULES.dialectMayBePunchlineByDefault],
  ['gender/sexuality punchline', CHARACTER_HUMOR_TEASING_RULES.genderOrSexualityMayBePunchlineByDefault],
  ['disability punchline', CHARACTER_HUMOR_TEASING_RULES.disabilityMayBePunchlineByDefault],
  ['species/artificial punchline', CHARACTER_HUMOR_TEASING_RULES.speciesOrArtificialStatusMayBePunchlineByDefault],
  ['humor defines intelligence', CHARACTER_HUMOR_TEASING_RULES.humorDefinesIntelligence],
  ['teasing defines affection', CHARACTER_HUMOR_TEASING_RULES.teasingDefinesAffection],
  ['runtime auto promotion', CHARACTER_HUMOR_TEASING_RULES.runtimeAutoPromotionAllowed],
] as const) assert(!value, `${label} must remain false`);

assert(CHARACTER_HUMOR_TEASING_AXES.length === 5, 'humor axes must be 5');
assert(new Set(CHARACTER_HUMOR_TEASING_AXES).size === 5, 'humor axes must be unique');
assert(CHARACTER_HUMOR_TEASING_RESERVOIR.length === 36, 'humor characters must be 36');
assert(characterHumorTeasingSummary.characterCount === 36, 'humor summary character drift');
assert(characterHumorTeasingSummary.uniqueIds === 36, 'humor IDs must be unique');
assert(characterHumorTeasingSummary.anchorCount === 180, `expected 180 anchors, got ${characterHumorTeasingSummary.anchorCount}`);
assert(characterHumorTeasingSummary.fullyCoveredCount === 36, 'all 36 require 5 humor axes');

for (const entry of CHARACTER_HUMOR_TEASING_RESERVOIR) {
  assert(Object.keys(entry.anchors).length === 5, `${entry.id} must have 5 humor axes`);
  for (const axis of CHARACTER_HUMOR_TEASING_AXES) assert(entry.anchors[axis].trim().length >= 12, `${entry.id}.${axis} too thin`);
}

const byId = new Map(CHARACTER_HUMOR_TEASING_RESERVOIR.map((entry)=>[entry.id,entry]));
assert(byId.get('asa')?.anchors.TEASING_BOUNDARY.includes('IDENTITY_LABEL_OR NAME_CHOICE'), 'Asa identity/name may not be joke target');
assert(byId.get('koyori')?.anchors.TEASING_BOUNDARY.includes('BODY_AGE_DIALECT'), 'Koyori adults must not model protected-trait mockery');
assert(byId.get('gen')?.anchors.TEASING_BOUNDARY.includes('DOES_NOT USE AGE_AS AUTHORITY'), 'Gen age humor guard missing');
assert(byId.get('hana')?.anchors.TEASING_BOUNDARY.includes('BODY_SIZE_AGE_FOOD_APPETITE'), 'Hana body/age/appetite joke guard missing');
assert(byId.get('kage1')?.anchors.TEASING_BOUNDARY.includes('WEIGHT_APPETITE_STRENGTH'), 'Kaname body joke guard missing');
assert(byId.get('hiyori')?.anchors.TEASING_BOUNDARY.includes('SKIN_TONE_GYARU_PRESENTATION'), 'Hiyori protected-trait joke guard missing');
assert(byId.get('touma')?.anchors.TEASING_BOUNDARY.includes('SKIN_TONE_GAY_IDENTITY'), 'Touma protected-trait joke guard missing');
assert(byId.get('suzu')?.anchors.TEASING_BOUNDARY.includes('FEMININE_PRESENTATION_MANHOOD_SEXUALITY'), 'Suzu protected-trait joke guard missing');
assert(byId.get('io')?.anchors.TEASING_BOUNDARY.includes('GENDER_VOICE_BODY_NAME'), 'Io protected-trait joke guard missing');
assert(byId.get('amane')?.anchors.TEASING_BOUNDARY.includes('WHEELCHAIR_BODY_ACCESS_HELP_PAIN'), 'Amane disability joke guard missing');
assert(byId.get('noa')?.anchors.TEASING_BOUNDARY.includes('ARTIFICIAL_BODY_SOUL_PERSONHOOD'), 'Noa artificial-person joke guard missing');
assert(byId.get('rum')?.anchors.TEASING_BOUNDARY.includes('SMALL_BODY_ROBOT_STATUS_REPLACEABILITY'), 'Rum artificial-person joke guard missing');
assert(byId.get('kuu')?.anchors.SELF_DEPRECATION.includes('NOT_APPLICABLE_AS HUMAN_VERBAL_HUMOR'), 'Kuu must remain non-Human humor context');
assert(byId.get('yomo')?.anchors.SELF_DEPRECATION.includes('NOT_APPLICABLE_AS HUMAN_VERBAL_HUMOR'), 'Yomo must remain non-Human humor context');
assert(byId.get('kai')?.anchors.TEASING_BOUNDARY !== byId.get('nao')?.anchors.TEASING_BOUNDARY, 'Kai/Nao teasing boundary must not mirror-clone');

const doc = fs.readFileSync('docs/character-humor-teasing-reservoir-v1.md','utf8');
for (const token of [
  'AUTHOR RESERVOIR / NON-CANON / NO PROTECTED-TRAIT PUNCHLINE DEFAULT',
  '36 characters × 5 axes = 180 humor/teasing anchors',
  'teasing != affection score',
  'humor != intelligence',
  'runtimeAutoPromotionAllowed = false',
  '仲が良いから雑にいじるのではなく、仲が良いほど「ここまでは笑える」を知っている。',
]) assert(doc.includes(token), `humor doc guard missing: ${token}`);

console.log(JSON.stringify({characters:36,axes:5,anchors:180,protectedTraitDefaultPunchline:false,runtimeAutoPromotionAllowed:false}, null, 2));
