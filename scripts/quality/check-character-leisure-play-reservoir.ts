import fs from 'node:fs';
import {
  CHARACTER_LEISURE_PLAY_AXES,
  CHARACTER_LEISURE_PLAY_RESERVOIR,
  CHARACTER_LEISURE_PLAY_RULES,
  characterLeisurePlaySummary,
} from '../../src/game/data/characterLeisurePlayReservoir.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

for (const path of [
  'docs/character-leisure-play-reservoir-v1.md',
  'src/game/data/characterLeisurePlayReservoir.ts',
] as const) assert(fs.existsSync(path), `missing leisure/play prerequisite: ${path}`);

assert(CHARACTER_LEISURE_PLAY_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'leisure status drift');
assert(CHARACTER_LEISURE_PLAY_RULES.characterCoverageRequired === 36, 'leisure character target drift');
assert(CHARACTER_LEISURE_PLAY_RULES.axesPerCharacterRequired === 6, 'leisure axis target drift');
assert(CHARACTER_LEISURE_PLAY_RULES.totalAnchorCountRequired === 216, 'leisure anchor target drift');
for (const [label, value] of [
  ['exact hobby freeze', CHARACTER_LEISURE_PLAY_RULES.exactHobbyFrozenHere],
  ['hobby defines occupation', CHARACTER_LEISURE_PLAY_RULES.hobbyDefinesOccupation],
  ['boredom defines laziness', CHARACTER_LEISURE_PLAY_RULES.boredomDefinesLaziness],
  ['competition defines aggression', CHARACTER_LEISURE_PLAY_RULES.competitionDefinesAggression],
  ['age defines leisure', CHARACTER_LEISURE_PLAY_RULES.ageDefinesLeisure],
  ['gender/sexuality defines leisure', CHARACTER_LEISURE_PLAY_RULES.genderOrSexualityDefinesLeisure],
  ['origin defines leisure', CHARACTER_LEISURE_PLAY_RULES.originDefinesLeisure],
  ['disability defines passive leisure', CHARACTER_LEISURE_PLAY_RULES.disabilityDefinesPassiveLeisure],
  ['historical gets modern media', CHARACTER_LEISURE_PLAY_RULES.historicalCharacterGetsModernMediaByDefault],
  ['future gets unlimited media', CHARACTER_LEISURE_PLAY_RULES.futureCharacterGetsUnlimitedMediaByDefault],
  ['artificial body cannot play', CHARACTER_LEISURE_PLAY_RULES.artificialBodyCannotPlay],
  ['animal play becomes Human hobby', CHARACTER_LEISURE_PLAY_RULES.animalPlayBecomesHumanHobby],
  ['runtime auto promotion', CHARACTER_LEISURE_PLAY_RULES.runtimeAutoPromotionAllowed],
] as const) assert(!value, `${label} must remain false`);

const expectedIds = ['yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren','hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane'] as const;
assert(CHARACTER_LEISURE_PLAY_AXES.length === 6, 'leisure axes must be 6');
assert(new Set(CHARACTER_LEISURE_PLAY_AXES).size === 6, 'leisure axes must be unique');
assert(CHARACTER_LEISURE_PLAY_RESERVOIR.length === 36, 'leisure characters must be 36');
assert(characterLeisurePlaySummary.characterCount === 36, 'leisure summary character drift');
assert(characterLeisurePlaySummary.uniqueIds === 36, 'leisure IDs must be unique');
assert(characterLeisurePlaySummary.anchorCount === 216, `expected 216 leisure anchors, got ${characterLeisurePlaySummary.anchorCount}`);
assert(characterLeisurePlaySummary.fullyCoveredCount === 36, 'all 36 need 6 leisure axes');
const actual = new Set(CHARACTER_LEISURE_PLAY_RESERVOIR.map((entry)=>entry.id));
for (const id of expectedIds) assert(actual.has(id), `missing leisure character: ${id}`);
for (const entry of CHARACTER_LEISURE_PLAY_RESERVOIR) {
  assert(Object.keys(entry.anchors).length === 6, `${entry.id} must have exactly 6 leisure axes`);
  for (const axis of CHARACTER_LEISURE_PLAY_AXES) assert(entry.anchors[axis].trim().length >= 12, `${entry.id}.${axis} too thin`);
}
const byId = new Map(CHARACTER_LEISURE_PLAY_RESERVOIR.map((entry)=>[entry.id,entry]));
assert(byId.get('koyori')?.anchors.ERA_MEDIA_PASTIME.includes('NO AUTOMATIC_PHONE_TABLET'), 'Koyori must not get automatic modern device');
assert(byId.get('gen')?.anchors.ERA_MEDIA_PASTIME.includes('AGE_DOES_NOT FIX ONE_PASTIME'), 'Gen age may not define leisure');
assert(byId.get('kage1')?.anchors.ERA_MEDIA_PASTIME.includes('PLUS_SIZE_BODY_DOES_NOT DEFINE'), 'Kaname body may not define leisure');
assert(byId.get('hiyori')?.anchors.SOLO_LEISURE.includes('NOT GYARU_CHECKLIST'), 'Hiyori leisure may not become gyaru checklist');
assert(byId.get('touma')?.anchors.ERA_MEDIA_PASTIME.includes('NOT BROWN_SKIN_SEXUALITY'), 'Touma leisure may not derive from skin/sexuality');
assert(byId.get('suzu')?.anchors.SOCIAL_PLAY.includes('WITHOUT GENDER_ESSENTIALISM'), 'Suzu leisure may not derive from gender presentation');
assert(byId.get('io')?.anchors.ERA_MEDIA_PASTIME.includes('GENDER_REVEAL_CLUE'), 'Io media taste may not reveal gender');
assert(byId.get('amane')?.anchors.ERA_MEDIA_PASTIME.includes('WHEELCHAIR_DOES_NOT MEAN PASSIVE_SCREEN_LEISURE'), 'Amane wheelchair may not define passive leisure');
assert(byId.get('noa')?.anchors.SOLO_LEISURE.includes('NO_EFFICIENCY_REQUIREMENT'), 'Noa must be allowed non-efficient leisure');
assert(byId.get('rum')?.anchors.SOCIAL_PLAY.includes('WITHOUT HUMAN_CHIBI_COSPLAY'), 'Rum play may not become Human chibi cosplay');
assert(byId.get('kuu')?.anchors.ERA_MEDIA_PASTIME.includes('NO HUMAN_MEDIA_HOBBY_BY_DEFAULT'), 'Kuu must remain species-appropriate');
assert(byId.get('yomo')?.anchors.ERA_MEDIA_PASTIME.includes('NO HUMAN_MEDIA_HOBBY_BY_DEFAULT'), 'Yomo must remain species-appropriate');
assert(byId.get('kai')?.anchors.ERA_MEDIA_PASTIME !== byId.get('nao')?.anchors.ERA_MEDIA_PASTIME, 'Kai/Nao leisure must remain individual');

const doc = fs.readFileSync('docs/character-leisure-play-reservoir-v1.md','utf8');
for (const token of [
  'AUTHOR RESERVOIR / NON-CANON / ERA-TECH-AWARE / NO HOBBY STEREOTYPE',
  '36 characters × 6 axes = 216 leisure/play anchors',
  'leisure is not a personality quiz answer.',
  '退屈 = Characterが薄い時間ではない。',
  'runtimeAutoPromotionAllowed = false',
  '事件がない夜でも、一緒に遊べるCharacterは強い。',
]) assert(doc.includes(token), `leisure doc guard missing: ${token}`);

console.log(JSON.stringify({characters:36,axes:6,anchors:216,exactHobbyFrozen:false,runtimeAutoPromotionAllowed:false}, null, 2));
