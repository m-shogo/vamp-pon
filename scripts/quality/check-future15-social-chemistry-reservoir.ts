import fs from 'node:fs';
import { FUTURE15_SEASON_ASSIGNMENTS } from '../../src/game/data/seasonArchitecture.ts';
import { CURRENT_RELATIONSHIP_CHARACTER_IDS } from '../../src/game/data/currentRelationshipInventory.ts';
import {
  FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES,
  FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR,
  future15SocialChemistryReservoirSummary,
} from '../../src/game/data/future15SocialChemistryReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/future-cast-relationship-story-reservoir-v1.md',
  'docs/character-ordinary-life-reservoir-v1.md',
  'docs/future15-social-chemistry-reservoir-v1.md',
  'src/game/data/seasonArchitecture.ts',
  'src/game/data/currentRelationshipInventory.ts',
  'src/game/data/future15SocialChemistryReservoir.ts',
]) assert(fs.existsSync(path), `missing Future15 social source: ${path}`);

assert(FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.status === 'FUTURE15_AUTHOR_RESERVOIR_NOT_CURRENT21', 'Future15 social layer status drift');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.reservoirPromotesToCurrent21, 'Future15 social reservoir may not promote Current21');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.reservoirLocksSequelRoster, 'Future15 social reservoir may not lock sequel roster');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactRomanceFrozenHere, 'romance may not be frozen here');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactSexualityFrozenHere, 'sexuality may not be frozen here');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactCountryNationalityFrozenHere, 'country/nationality may not be frozen here');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactFamilyFrozenHere, 'family may not be frozen here');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactCallNameFrozenHere, 'call names may not be frozen here');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactPartySeatFrozenHere, 'party seats may not be frozen here');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.animalBehaviorEqualsTruthDetector, 'animal behavior cannot equal truth detector');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.wheelChairUseIsCureArc, 'wheelchair use may not become cure arc');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.twinSimilarityEqualsSamePerson, 'twins may not collapse into same person');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.robotOrCopyEqualsLessPerson, 'robot/copy may not equal less person');
assert(!FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES.runtimeAutoPromotionAllowed, 'Future15 social reservoir may not auto-promote runtime');

assert(future15SocialChemistryReservoirSummary.count === 15, 'Future15 social chemistry must cover 15/15');
assert(future15SocialChemistryReservoirSummary.uniqueIds === 15, 'Future15 social IDs must be unique');
assert(future15SocialChemistryReservoirSummary.uniquePartyInstincts === 15, 'Future15 party instincts must be distinct');
assert(future15SocialChemistryReservoirSummary.currentBridgeCharacterCount >= 12, 'Future15 needs broad Current21 bridge coverage');
assert(future15SocialChemistryReservoirSummary.futurePeerReferenceCount === 15, 'all Future15 should appear as peer references');
assert(!future15SocialChemistryReservoirSummary.promotedToCurrent21, 'Future15 unexpectedly promoted');
assert(!future15SocialChemistryReservoirSummary.sequelRosterLocked, 'Future15 sequel roster unexpectedly locked');
assert(!future15SocialChemistryReservoirSummary.runtimeAutoPromotionAllowed, 'Future15 summary may not auto-promote runtime');

const futureIds = new Set(FUTURE15_SEASON_ASSIGNMENTS.map((entry) => entry.id));
const futureNames = new Set(FUTURE15_SEASON_ASSIGNMENTS.map((entry) => entry.name));
const currentStableIds = new Set(CURRENT_RELATIONSHIP_CHARACTER_IDS);
const reservoirIds = new Set(FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR.map((entry) => entry.id));
const reservoirNames = new Set(FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR.map((entry) => entry.name));
assert(reservoirIds.size === futureIds.size && [...futureIds].every((id) => reservoirIds.has(id as never)), 'Future15 ID coverage drift');
assert(reservoirNames.size === futureNames.size && [...futureNames].every((name) => reservoirNames.has(name)), 'Future15 name coverage drift');

for (const entry of FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR) {
  assert(new Set(entry.currentBridges).size === 2, `duplicate Current bridge: ${entry.id}`);
  assert(new Set(entry.futurePeers).size === 2, `duplicate Future peer seed: ${entry.id}`);
  assert(new Set(entry.friction).size === 2, `duplicate Future friction seed: ${entry.id}`);
  assert(new Set(entry.laugh).size === 2, `duplicate Future laugh seed: ${entry.id}`);
  for (const ref of entry.currentBridges) assert(currentStableIds.has(ref as never), `unknown stable Current bridge: ${entry.id}->${ref}`);
  for (const ref of [...entry.futurePeers, ...entry.friction, ...entry.laugh]) {
    assert(futureIds.has(ref as never), `unknown Future15 peer: ${entry.id}->${ref}`);
    assert(ref !== entry.id, `self Future15 social ref: ${entry.id}`);
  }
  assert(entry.repair.length > 20, `Future15 repair action too thin: ${entry.id}`);
}

const doc = fs.readFileSync('docs/future15-social-chemistry-reservoir-v1.md', 'utf8');
assert(doc.includes('FUTURE15 AUTHOR RESERVOIR / NOT CURRENT21 / NOT SEQUEL ROSTER LOCK / FREE TO OVERWRITE'), 'Future15 social doc status drift');
assert(doc.includes('Kuu = dog / truth detectorではない'), 'Kuu boundary missing');
assert(doc.includes('Suzu = male / feminine presentation'), 'Suzu presentation boundary missing');
assert(doc.includes('Io = gender undisclosed Candidate'), 'Io gender boundary missing');
assert(doc.includes('Amane = wheelchair use; cure arcにしない'), 'Amane wheelchair boundary missing');
assert(doc.includes('Kai / Nao = twins。similarity != one person'), 'Kai/Nao twin boundary missing');
assert(doc.includes('Makiのbisexual history'), 'Maki bisexuality guard missing');
assert(doc.includes('Toumaのgay relation history Candidate'), 'Touma gay relation guard missing');
assert(doc.includes('Future15にも、本筋へ出る前から「誰と一緒にいるとどんな顔になるか」を持たせる。'), 'Future15 social principle missing');

console.log(JSON.stringify({
  future15: future15SocialChemistryReservoirSummary.count,
  stableCurrentRelationIds: currentStableIds.size,
  currentBridgeCharacters: future15SocialChemistryReservoirSummary.currentBridgeCharacterCount,
  futurePeerCoverage: future15SocialChemistryReservoirSummary.futurePeerReferenceCount,
  uniquePartyInstincts: future15SocialChemistryReservoirSummary.uniquePartyInstincts,
  promotedToCurrent21: false,
  sequelRosterLocked: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
