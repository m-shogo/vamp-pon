import fs from 'node:fs';
import {
  CHARACTER_ADDRESS_NAMING_REGISTER_RULES,
  CHARACTER_ADDRESS_NAMING_REGISTER_AXES,
  CHARACTER_ADDRESS_NAMING_REGISTER_RESERVOIR,
  characterAddressNamingRegisterSummary,
} from '../../src/game/data/characterAddressNamingRegisterReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(CHARACTER_ADDRESS_NAMING_REGISTER_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'address/register status drift');
assert(CHARACTER_ADDRESS_NAMING_REGISTER_RULES.characterCoverageRequired === 36, 'address/register character target drift');
assert(CHARACTER_ADDRESS_NAMING_REGISTER_RULES.axesPerCharacterRequired === 6, 'address/register axes target drift');
assert(CHARACTER_ADDRESS_NAMING_REGISTER_RULES.totalAnchorCountRequired === 216, 'address/register anchor target drift');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.exactFirstPersonPronounFrozenHere, 'exact first-person pronoun may not freeze here');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.exactHonorificFrozenHere, 'exact honorific may not freeze here');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.exactDialectFrozenHere, 'exact dialect may not freeze here');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.nameFormDefinesAffection, 'name form may not define affection');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.ageOrStatusDefinesSubmission, 'age/status may not define submission');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.genderSexualityPresentationDefinesRegister, 'gender/sexuality/presentation may not define register');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.originDefinesDialectByDefault, 'origin may not define dialect by default');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.misaddressRequiresIdentityDisclosure, 'misaddress repair may not require identity disclosure');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.stableProfileAliasBecomesSpokenName, 'stable profile alias may not become spoken name');
assert(!CHARACTER_ADDRESS_NAMING_REGISTER_RULES.runtimeAutoPromotionAllowed, 'address/register reservoir may not auto-promote runtime');

const expectedAxes = [
  'SELF_REFERENCE',
  'FIRST_MEETING_ADDRESS',
  'DEFAULT_PEER_ADDRESS',
  'AGE_STATUS_SHIFT',
  'CLOSENESS_NAME_SHIFT',
  'MISADDRESS_REPAIR',
] as const;
assert(JSON.stringify(CHARACTER_ADDRESS_NAMING_REGISTER_AXES) === JSON.stringify(expectedAxes), 'address/register axes drift');

const expectedIds = [
  'yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori',
  'kage1','kage2','kage3','kage4','ren','hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane',
] as const;

assert(CHARACTER_ADDRESS_NAMING_REGISTER_RESERVOIR.length === 36, 'address/register reservoir must cover 36 characters');
assert(characterAddressNamingRegisterSummary.characterCount === 36, 'address/register summary character count drift');
assert(characterAddressNamingRegisterSummary.uniqueIds === 36, 'address/register IDs must be unique');
assert(characterAddressNamingRegisterSummary.anchorCount === 216, 'address/register anchor count must be 216');
assert(characterAddressNamingRegisterSummary.fullyCoveredCount === 36, 'all 36 must cover every address/register axis');
assert(!characterAddressNamingRegisterSummary.runtimeAutoPromotionAllowed, 'address/register summary may not auto-promote runtime');
assert(JSON.stringify(CHARACTER_ADDRESS_NAMING_REGISTER_RESERVOIR.map((entry)=>entry.id)) === JSON.stringify(expectedIds), 'address/register roster/stable ID order drift');

for (const entry of CHARACTER_ADDRESS_NAMING_REGISTER_RESERVOIR) {
  assert(Object.keys(entry.anchors).length === 6, `address/register axis count drift: ${entry.id}`);
  for (const axis of CHARACTER_ADDRESS_NAMING_REGISTER_AXES) {
    assert(typeof entry.anchors[axis] === 'string' && entry.anchors[axis].length > 10, `missing address/register anchor: ${entry.id}/${axis}`);
  }
}

const byId = new Map(CHARACTER_ADDRESS_NAMING_REGISTER_RESERVOIR.map((entry)=>[entry.id,entry]));
const includes = (id: string, axis: typeof CHARACTER_ADDRESS_NAMING_REGISTER_AXES[number], token: string) => {
  const entry = byId.get(id);
  assert(entry, `missing address/register guard character: ${id}`);
  assert(entry.anchors[axis].includes(token), `address/register representation guard drift: ${id}/${axis}/${token}`);
};

includes('gen','AGE_STATUS_SHIFT','AGE_DOES_NOT ENTITLE');
includes('hana','SELF_REFERENCE','WITHOUT MATERNAL_OR OLD_WOMAN');
includes('kage1','FIRST_MEETING_ADDRESS','SIZE_DIFFERENCE');
includes('hiyori','SELF_REFERENCE','WITHOUT GYARU_SKIN_OR ORIGIN_STEREOTYPE');
includes('touma','SELF_REFERENCE','WITHOUT MASCULINITY_OR SKIN_ORIGIN_STEREOTYPE');
includes('suzu','MISADDRESS_REPAIR','WITHOUT DEMANDING DISCLOSURE');
includes('io','MISADDRESS_REPAIR','WHAT_ARE_YOU_QUESTION');
includes('amane','FIRST_MEETING_ADDRESS','NOT ACCEPT CAREGIVER_OR COMPANION_AS ADDRESS_PROXY');
includes('noa','DEFAULT_PEER_ADDRESS','DEBUG_NAME_AS SPOKEN_ADDRESS');
includes('rum','CLOSENESS_NAME_SHIFT','DOES_NOT PROPAGATE_TO ALL_INSTANCES');
includes('kuu','SELF_REFERENCE','NOT_APPLICABLE_AS HUMAN_PRONOUN_SYSTEM');
includes('yomo','AGE_STATUS_SHIFT','HUMAN_HONORIFIC_HIERARCHY_IS NOT READ_INTO CAT_BEHAVIOR');
includes('kai','FIRST_MEETING_ADDRESS','DOES_NOT INTRODUCE TWINS_AS ONE_UNIT');
includes('nao','CLOSENESS_NAME_SHIFT','NOT TWIN_PACKAGE');

const doc = fs.readFileSync('docs/character-address-naming-register-reservoir-v1.md','utf8');
for (const token of [
  '36 characters × 6 axes = **216 address/naming/register anchors**',
  'nickname = affection/romance score',
  'origin/skin tone = dialect',
  'stable profile alias = spoken name',
  'misaddress correction = obligation to disclose identity history',
  'Historical characters are not forced into exaggerated archaic speech.',
  '呼び方は好感度メーターではない。相手が今どう呼ばれたいかを覚え、間違えた時に説明を要求せず直せること自体がCharacterになる。',
]) {
  assert(doc.includes(token), `address/register doc guard missing: ${token}`);
}

console.log(JSON.stringify({
  characters: characterAddressNamingRegisterSummary.characterCount,
  axesPerCharacter: CHARACTER_ADDRESS_NAMING_REGISTER_AXES.length,
  anchors: characterAddressNamingRegisterSummary.anchorCount,
  fullyCovered: characterAddressNamingRegisterSummary.fullyCoveredCount,
  exactPronounFrozen: false,
  exactHonorificFrozen: false,
  affectionScoredByNameForm: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
