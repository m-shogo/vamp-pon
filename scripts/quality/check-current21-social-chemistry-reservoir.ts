import fs from 'node:fs';
import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  currentRelationshipInventorySummary,
} from '../../src/game/data/currentRelationshipInventory.ts';
import { allPairDirectedSpeechPresentationSummary } from '../../src/game/data/allPairDirectedSpeechPresentationSource.ts';
import {
  CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES,
  CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR,
  current21SocialChemistryReservoirSummary,
} from '../../src/game/data/current21SocialChemistryReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/RELATIONSHIPS.md',
  'docs/title1-character-relationship-villain-deepening-v1.md',
  'docs/character-ordinary-life-reservoir-v1.md',
  'docs/current21-social-chemistry-reservoir-v1.md',
  'src/game/data/currentRelationshipInventory.ts',
  'src/game/data/allPairDirectedSpeechPresentationSource.ts',
  'src/game/data/current21SocialChemistryReservoir.ts',
]) assert(fs.existsSync(path), `missing social chemistry source: ${path}`);

assert(CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'social chemistry must remain reservoir');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactAddressTermsFrozenHere, 'exact address terms may not be frozen here');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactNicknameProgressionFrozenHere, 'nickname progression may not be frozen here');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactPartySeatFrozenHere, 'party seats may not be frozen');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactRomanceRelationFrozenHere, 'romance may not be frozen');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactBloodRelationFrozenHere, 'blood relation may not be frozen');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.exactConflictOutcomeFrozenHere, 'conflict outcomes may not be frozen');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.existingDirectedSpeechAuthorityOverridden, 'existing directed speech authority must remain intact');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.existingCurrentRelationshipInventoryOverridden, 'current relationship inventory must remain intact');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.friendshipRequiresCallNameChange, 'friendship cannot require call-name change');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.politenessMeansLowTrust, 'politeness cannot equal low trust');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.conflictResetsGrowth, 'conflict may not reset growth');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.partySeatEqualsRelationshipRank, 'party seating cannot equal relationship rank');
assert(!CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES.runtimeAutoPromotionAllowed, 'social reservoir may not auto-promote runtime');

assert(allPairDirectedSpeechPresentationSummary.pairCount === 210, 'existing Current21 all-pair count drift');
assert(allPairDirectedSpeechPresentationSummary.directedLaneCount === 420, 'existing directed speech lane count drift');
assert(allPairDirectedSpeechPresentationSummary.featuredDirectedLaneCount === 48, 'Featured speech lane count drift');
assert(!allPairDirectedSpeechPresentationSummary.romanceAutoPromotionAllowed, 'speech system may not auto-promote romance');
assert(!allPairDirectedSpeechPresentationSummary.runtimeAutoPromotionAllowed, 'speech system may not auto-promote runtime');
assert(currentRelationshipInventorySummary.total === 24, 'Current relationship inventory count drift');
assert(currentRelationshipInventorySummary.characterCount === 21, 'Current relationship inventory character count drift');
assert(currentRelationshipInventorySummary.romanceFrozenByInventoryCount === 0, 'relationship inventory unexpectedly froze romance');
assert(currentRelationshipInventorySummary.bloodRelationFrozenByInventoryCount === 0, 'relationship inventory unexpectedly froze blood relation');
assert(currentRelationshipInventorySummary.mainMysteryFrozenByInventoryCount === 0, 'relationship inventory unexpectedly froze Main Mystery');

assert(current21SocialChemistryReservoirSummary.characterCount === 21, 'social chemistry must cover Current21 21/21');
assert(current21SocialChemistryReservoirSummary.uniqueCharacterCount === 21, 'social chemistry IDs must be unique');
assert(current21SocialChemistryReservoirSummary.uniqueSeatInstinctCount >= 18, 'party seat instincts are too repetitive');
assert(current21SocialChemistryReservoirSummary.uniqueFirstNoticeCount >= 18, 'first-notice instincts are too repetitive');
assert(current21SocialChemistryReservoirSummary.allHaveTwoCheckOnSeeds, 'each character needs two check-on seeds');
assert(current21SocialChemistryReservoirSummary.allHaveTwoFrictionSeeds, 'each character needs two friction seeds');
assert(current21SocialChemistryReservoirSummary.allHaveTwoLaughSeeds, 'each character needs two laugh seeds');
assert(!current21SocialChemistryReservoirSummary.exactAddressTermsFrozenHere, 'summary may not freeze address terms');
assert(!current21SocialChemistryReservoirSummary.runtimeAutoPromotionAllowed, 'summary may not auto-promote runtime');

const currentIds = new Set(CURRENT_RELATIONSHIP_CHARACTER_IDS);
const reservoirIds = new Set(CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR.map((entry) => entry.id));
assert(reservoirIds.size === currentIds.size, 'social reservoir current ID coverage size drift');
for (const id of currentIds) assert(reservoirIds.has(id), `missing Current21 social chemistry: ${id}`);

for (const entry of CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR) {
  for (const ref of [...entry.checksOn, ...entry.easyFrictionWith, ...entry.laughTriggerWith, entry.receivesCareBadlyFrom]) {
    assert(currentIds.has(ref), `unknown social chemistry relation reference: ${entry.id} -> ${ref}`);
    assert(ref !== entry.id, `self social chemistry reference: ${entry.id}`);
  }
  assert(new Set(entry.checksOn).size === 2, `duplicate check-on seed: ${entry.id}`);
  assert(new Set(entry.easyFrictionWith).size === 2, `duplicate friction seed: ${entry.id}`);
  assert(new Set(entry.laughTriggerWith).size === 2, `duplicate laugh seed: ${entry.id}`);
  assert(entry.silenceMode.length > 12, `silence mode too thin: ${entry.id}`);
  assert(entry.conflictRepairAction.length > 12, `conflict repair action too thin: ${entry.id}`);
  assert(entry.sharedChoreLane.length > 12, `shared chore lane too thin: ${entry.id}`);
  assert(!entry.exactSeatFrozen && !entry.exactAddressFrozen && !entry.exactRelationshipOutcomeFrozen, `social candidate frozen prematurely: ${entry.id}`);
}

const doc = fs.readFileSync('docs/current21-social-chemistry-reservoir-v1.md', 'utf8');
assert(doc.includes('AUTHOR RESERVOIR / NON-CANON / EXISTING SPEECH AUTHORITY PRESERVED / FREE TO OVERWRITE'), 'social chemistry doc status drift');
assert(doc.includes('Current21 all-pair 210組 / directed speech 420方向'), 'existing all-pair authority reference missing');
assert(doc.includes('Yui → Asa: `アサちゃん → アサ`'), 'Yui/Asa authored speech example must remain acknowledged');
assert(doc.includes('Koyori → Ritsu: `お兄ちゃん`'), 'sibling address preservation example missing');
assert(doc.includes('Toki may retain honorific / politeness at high Bond'), 'Toki politeness preservation missing');
assert(doc.includes('関係性は「誰と仲良し」だけでなく、同じ空間で何をしてしまうかまで持つ。'), 'social chemistry reservoir principle missing');

console.log(JSON.stringify({
  current21: current21SocialChemistryReservoirSummary.characterCount,
  existingPairs: allPairDirectedSpeechPresentationSummary.pairCount,
  existingDirectedSpeech: allPairDirectedSpeechPresentationSummary.directedLaneCount,
  currentRelationshipInventory: currentRelationshipInventorySummary.total,
  uniqueSeatInstincts: current21SocialChemistryReservoirSummary.uniqueSeatInstinctCount,
  uniqueFirstNotice: current21SocialChemistryReservoirSummary.uniqueFirstNoticeCount,
  exactAddressFrozen: false,
  romanceFrozen: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
