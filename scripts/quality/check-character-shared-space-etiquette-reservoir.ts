import fs from 'node:fs';
import {
  CHARACTER_SHARED_SPACE_ETIQUETTE_AXES,
  CHARACTER_SHARED_SPACE_ETIQUETTE_RESERVOIR,
  CHARACTER_SHARED_SPACE_ETIQUETTE_RULES,
  characterSharedSpaceEtiquetteSummary,
} from '../../src/game/data/characterSharedSpaceEtiquetteReservoir.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

for (const path of ['docs/character-shared-space-etiquette-reservoir-v1.md','src/game/data/characterSharedSpaceEtiquetteReservoir.ts'] as const) assert(fs.existsSync(path),`missing shared-space prerequisite: ${path}`);

assert(CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.status==='AUTHOR_RESERVOIR_NON_CANON','shared-space status drift');
assert(CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.characterCoverageRequired===36,'shared-space character target drift');
assert(CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.axesPerCharacterRequired===6,'shared-space axis target drift');
assert(CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.totalAnchorCountRequired===216,'shared-space anchor target drift');
for (const [label,value] of [
  ['hosting wealth',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.hostingDefinesWealth],
  ['domestic gender',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.domesticLaborDefinesGender],
  ['guest morality',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.guestEtiquetteDefinesMorality],
  ['body space burden',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.bodySizeDefinesSpaceBurden],
  ['disability side seat',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.disabilityCreatesSpecialSideSeatByDefault],
  ['age domestic role',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.ageDefinesDomesticRole],
  ['origin etiquette',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.originDefinesEtiquette],
  ['artificial appliance role',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.artificialBodyMeansApplianceRole],
  ['animal mascot host',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.animalBecomesMascotHost],
  ['exact household freeze',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.exactHouseholdOrHomeFrozenHere],
  ['runtime promotion',CHARACTER_SHARED_SPACE_ETIQUETTE_RULES.runtimeAutoPromotionAllowed],
] as const) assert(!value,`${label} must remain false`);

assert(CHARACTER_SHARED_SPACE_ETIQUETTE_AXES.length===6,'shared-space axes must be 6');
assert(new Set(CHARACTER_SHARED_SPACE_ETIQUETTE_AXES).size===6,'shared-space axes unique');
assert(CHARACTER_SHARED_SPACE_ETIQUETTE_RESERVOIR.length===36,'shared-space characters must be 36');
assert(characterSharedSpaceEtiquetteSummary.characterCount===36,'shared-space summary drift');
assert(characterSharedSpaceEtiquetteSummary.uniqueIds===36,'shared-space IDs unique');
assert(characterSharedSpaceEtiquetteSummary.anchorCount===216,`expected 216 anchors, got ${characterSharedSpaceEtiquetteSummary.anchorCount}`);
assert(characterSharedSpaceEtiquetteSummary.fullyCoveredCount===36,'all 36 need 6 shared-space axes');
for(const entry of CHARACTER_SHARED_SPACE_ETIQUETTE_RESERVOIR){
  assert(Object.keys(entry.anchors).length===6,`${entry.id} must have 6 shared-space axes`);
  for(const axis of CHARACTER_SHARED_SPACE_ETIQUETTE_AXES) assert(entry.anchors[axis].trim().length>=12,`${entry.id}.${axis} too thin`);
}

const byId=new Map(CHARACTER_SHARED_SPACE_ETIQUETTE_RESERVOIR.map((entry)=>[entry.id,entry]));
assert(byId.get('hana')?.anchors.SHARED_CHORE.includes('NOT GENDER_AGE_EXPECTATION'),'Hana domestic labor must not derive from gender/age');
assert(byId.get('gen')?.anchors.HOSTING_INSTINCT.includes('WITHOUT OLD_MAN_HEAD_OF_HOUSE_ROLE'),'Gen must not become head-of-house age role');
assert(byId.get('kage1')?.anchors.SEAT_SPACE_CHOICE.includes('WITHOUT AUTOMATICALLY TAKING_WORST_OPTION'),'Kaname body size must not create burden seat');
assert(byId.get('hiyori')?.anchors.PRIVATE_ZONE.includes('DOES NOT TREAT CAMERA_PHONE_STYLE_OR BEDROOM_AS PUBLIC_CONTENT'),'Hiyori private space guard missing');
assert(byId.get('touma')?.anchors.SHARED_CHORE.includes('FREE_WORKSHOP'),'Touma must not become free craft labor');
assert(byId.get('suzu')?.anchors.SHARED_CHORE.includes('WITHOUT GENDERED_DOMESTIC_ASSIGNMENT'),'Suzu must not receive gendered domestic role');
assert(byId.get('io')?.anchors.PRIVATE_ZONE.includes('DOES NOT BECOME CLUE_TO GENDER_IDENTITY'),'Io room/object may not become gender clue');
assert(byId.get('amane')?.anchors.SEAT_SPACE_CHOICE.includes('NOT PARKING_SPOT'),'Amane wheelchair position must be group seat, not parking spot');
assert(byId.get('noa')?.anchors.SHARED_CHORE.includes('NOT PROOF_OF UTILITY_OR PERSONHOOD'),'Noa task contribution may not prove utility/personhood');
assert(byId.get('rum')?.anchors.HOSTING_INSTINCT.includes('WITHOUT BECOMING APPLIANCE_OR SERVICE_STAFF'),'Rum may not become appliance/service staff');
assert(byId.get('kuu')?.anchors.HOSTING_INSTINCT.includes('NOT_APPLICABLE_AS HUMAN_HOST_ROLE'),'Kuu may not become Human host mascot');
assert(byId.get('yomo')?.anchors.HOSTING_INSTINCT.includes('NOT_APPLICABLE_AS HUMAN_HOST_ROLE'),'Yomo may not become Human host mascot');
assert(byId.get('kai')?.anchors.PRIVATE_ZONE!==byId.get('nao')?.anchors.PRIVATE_ZONE,'Kai/Nao private-space habits must not mirror clone');

const doc=fs.readFileSync('docs/character-shared-space-etiquette-reservoir-v1.md','utf8');
for(const token of [
  'AUTHOR RESERVOIR / NON-CANON / NO DOMESTIC-GENDER ROLE / NO ACCESS SIDE-SEAT',
  '36 characters × 6 axes = 216 shared-space anchors',
  'shared space is relationship geometry, not social rank.',
  'visible != public',
  'accessible != permitted',
  'runtimeAutoPromotionAllowed = false',
  '一緒に暮らせるかは、好きかどうかだけでなく「相手の物・身体・時間・場所をどこまで自分のものにしないか」で見える。',
]) assert(doc.includes(token),`shared-space doc guard missing: ${token}`);

console.log(JSON.stringify({characters:36,axes:6,anchors:216,householdFrozen:false,runtimeAutoPromotionAllowed:false},null,2));
