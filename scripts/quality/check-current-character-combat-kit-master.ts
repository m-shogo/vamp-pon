import { readFileSync } from 'node:fs';

import {
  statusDefinitions,
  buffDefinitions,
} from '../../src/game/data/combatAffinitySource.ts';
import {
  currentCharacterStarBeastCombatEntries,
} from '../../src/game/data/characterStarBeastCombatSource.ts';
import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  currentRelationshipInventoryById,
} from '../../src/game/data/currentRelationshipInventory.ts';
import {
  baseWeaponCandidates,
  currentBaseWeaponIds,
} from '../../src/game/data/weaponExpansionSource.ts';
import {
  weaponAwakeningCandidates,
} from '../../src/game/data/weaponTransformationSource.ts';
import {
  currentCharacterCombatKitEntries,
  currentCharacterCombatKitSummary,
} from '../../src/game/data/currentCharacterCombatKitSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const kitIds = currentCharacterCombatKitEntries.map((entry) => entry.characterId);
const starBeastIds = currentCharacterStarBeastCombatEntries.map((entry) => entry.characterId);
const currentBaseIds = new Set(currentBaseWeaponIds);
const candidateById = new Map(baseWeaponCandidates.map((entry) => [entry.id, entry]));
const awakeningById = new Map(weaponAwakeningCandidates.map((entry) => [entry.id, entry]));

assert(CURRENT_RELATIONSHIP_CHARACTER_IDS.length === 21, 'Current relationship authority must remain 21 characters including Reserve Ren');
assert(currentCharacterStarBeastCombatEntries.length === 21, 'Current Star Beast combat authority must remain 21 characters');
assert(currentCharacterCombatKitEntries.length === 21, `expected Current21 combat kits, got ${currentCharacterCombatKitEntries.length}`);
assert(new Set(kitIds).size === 21, 'Current21 combat kit ids must be unique');
assert(sameOrder(kitIds, CURRENT_RELATIONSHIP_CHARACTER_IDS), 'combat kit order must preserve Current21 relationship authority order');
assert(sameOrder(kitIds, starBeastIds), 'combat kit order must preserve Current21 Star Beast authority order');

for (const kit of currentCharacterCombatKitEntries) {
  const identity = currentCharacterStarBeastCombatEntries.find((entry) => entry.characterId === kit.characterId);
  assert(identity, `missing Star Beast identity: ${kit.characterId}`);
  assert(kit.characterName === identity.characterName, `character name drift: ${kit.characterId}`);
  assert(kit.starBeast === identity.starBeast, `Star Beast drift: ${kit.characterId}`);
  assert(sameOrder(kit.intrinsicAttributes, identity.intrinsicAttributes), `intrinsic attribute drift: ${kit.characterId}`);
  assert(sameOrder(kit.proficientAttributes, identity.proficientAttributes), `proficient attribute drift: ${kit.characterId}`);
  assert(kit.resistedStatus === identity.resistedStatus, `status resistance drift: ${kit.characterId}`);
  assert(kit.signature.buff === identity.resonanceBuff, `signature buff must derive from Star Beast source: ${kit.characterId}`);
  assert(kit.signature.status in statusDefinitions, `unknown signature status: ${kit.characterId}`);
  assert(kit.signature.buff in buffDefinitions, `unknown signature buff: ${kit.characterId}`);

  if (kit.startingWeapon.sourceKind === 'CURRENT_BASE') {
    assert(currentBaseIds.has(kit.startingWeapon.weaponId), `unknown Current base starter: ${kit.characterId}`);
    assert(kit.startingWeapon.runtimeStatus === 'CURRENT_RUNTIME', `Current base starter status mismatch: ${kit.characterId}`);
  } else {
    const candidate = candidateById.get(kit.startingWeapon.weaponId);
    assert(candidate, `unknown candidate base starter: ${kit.characterId}`);
    assert(candidate.runtimeStatus === 'CONTENT_SOURCE_ONLY', `candidate starter auto-promotion risk: ${kit.characterId}`);
    assert(kit.startingWeapon.runtimeStatus === 'CONTENT_SOURCE_ONLY', `candidate starter must remain content-only: ${kit.characterId}`);
  }

  for (const [label, value, min] of [
    ['Star Beast mechanic', kit.starBeastMechanic, 35],
    ['special passive', kit.specialPassive, 35],
    ['black-youka change', kit.blackYouka.combatChange, 35],
    ['black-youka tradeoff', kit.blackYouka.tradeoff, 25],
    ['awakening trigger', kit.awakening.triggerMeaning, 25],
    ['awakening gameplay shift', kit.awakening.gameplayShift, 30],
    ['preferred build', kit.preferredBuild, 30],
    ['friction build', kit.frictionBuild, 30],
    ['relation assist', kit.relation.assist, 30],
    ['pair synergy', kit.relation.pairSynergy, 30],
  ] as const) {
    assert(value.length >= min, `${kit.characterId} needs concrete ${label}`);
  }

  assert(kit.preferredBuild !== kit.frictionBuild, `preferred/friction build must differ: ${kit.characterId}`);
  assert(!kit.blackYouka.permanentAttributePromotionAllowed, `black-youka must not permanently promote attributes: ${kit.characterId}`);
  assert(kit.awakening.status === 'CONTENT_SOURCE_ONLY', `awakening must remain content-only: ${kit.characterId}`);
  assert(kit.authority === 'CONTENT_SOURCE_ONLY', `kit must remain content-only: ${kit.characterId}`);
  assert(!kit.runtimeAutoPromotionAllowed, `kit must not auto-promote runtime: ${kit.characterId}`);

  const relation = currentRelationshipInventoryById.get(kit.relation.relationId);
  assert(relation, `unknown Current relation: ${kit.characterId}`);
  assert(relation.participants.includes(kit.characterId), `relation misses owner: ${kit.characterId}`);
  assert(relation.participants.includes(kit.relation.partnerId), `relation misses partner: ${kit.characterId}`);
  assert(kit.relation.partnerId !== kit.characterId, `relation assist cannot self-pair: ${kit.characterId}`);

  if (kit.awakening.linkedCandidateId) {
    const awakening = awakeningById.get(kit.awakening.linkedCandidateId);
    assert(awakening, `unknown linked awakening: ${kit.characterId}`);
    assert(awakening.kind === 'AWAKENING', `linked transformation must be AWAKENING: ${kit.characterId}`);
    assert(awakening.runtimeStatus === 'CONTENT_SOURCE_ONLY', `linked awakening must stay content-only: ${kit.characterId}`);
    assert(awakening.outputAttributes.length <= 3, `linked awakening may not exceed 3 attributes: ${kit.characterId}`);
  }
}

const yui = currentCharacterCombatKitEntries.find((entry) => entry.characterId === 'yui');
assert(yui?.startingWeapon.weaponId === 'night_pencil', 'Yui should preserve Night Pencil as Current starter source');
assert(yui?.specialPassive.includes('Hero Anchor'), 'Yui must remain the strong Hero Anchor, not a weak average starter');
assert(yui?.relation.relationId === 'yui-asa', 'Yui primary combat relation should preserve Yui x Asa buddy authority');

const ritsu = currentCharacterCombatKitEntries.find((entry) => entry.characterId === 'ritsu');
const koyori = currentCharacterCombatKitEntries.find((entry) => entry.characterId === 'koyori');
assert(ritsu?.relation.relationId === 'ritsu-koyori' && koyori?.relation.relationId === 'ritsu-koyori', 'Ritsu/Koyori must have mutual combat relationship support');
assert(koyori?.relation.pairSynergy.includes('一方向連携は禁止'), 'Ritsu/Koyori must not become brother-only protection');

const kuroori = currentCharacterCombatKitEntries.find((entry) => entry.characterId === 'kuroori');
assert(kuroori?.blackYouka.tradeoff.length, 'Kuroori black-youka must retain a real tradeoff');
assert(kuroori?.awakening.linkedCandidateId === 'awake_kuroori_open_fold', 'Kuroori should link existing open-fold Awakening candidate');

const ren = currentCharacterCombatKitEntries.find((entry) => entry.characterId === 'ren');
assert(ren?.authority === 'CONTENT_SOURCE_ONLY', 'Reserve Ren may be designed but not promoted by this source');
assert(ren?.relation.partnerId === 'madoka', 'Reserve Ren should preserve Madoka relation direction');

assert(currentCharacterCombatKitSummary.currentBaseStarterCount === 3, 'starter source should preserve 3 Current base plans and keep other plans candidate-only');
assert(currentCharacterCombatKitSummary.candidateBaseStarterCount === 18, '18 Current21 starter plans should remain candidate-base content source');
assert(currentCharacterCombatKitSummary.linkedExistingAwakeningCount === 6, 'only six Current characters should link existing Current-compatible awakening candidates here');
assert(currentCharacterCombatKitSummary.charactersWithBlackYoukaTradeoff === 21, 'all Current21 need black-youka tradeoffs');
assert(currentCharacterCombatKitSummary.charactersWithRelationAssist === 21, 'all Current21 need relation assist and pair synergy');
assert(!currentCharacterCombatKitSummary.runtimeAutoPromotionAllowed, 'Current21 kit source must not auto-promote runtime');
assert(!currentCharacterCombatKitSummary.futureCastPromotionAllowed, 'Current21 kit source must not promote Future15');

const masterDoc = readFileSync(new URL('../../docs/current21-character-combat-kit-source-v1.md', import.meta.url), 'utf8');
for (const required of [
  'Current21',
  'starting weapon',
  'Star Beast mechanic',
  '黒耀化',
  'Awakening',
  'preferred build / friction build',
  'relation assist / pair synergy',
  'CONTENT_SOURCE_ONLY',
  'Future15',
]) {
  assert(masterDoc.includes(required), `Current21 combat kit doc missing token: ${required}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  currentCharacters: currentCharacterCombatKitEntries.length,
  currentBaseStarters: currentCharacterCombatKitSummary.currentBaseStarterCount,
  candidateBaseStarters: currentCharacterCombatKitSummary.candidateBaseStarterCount,
  linkedExistingAwakenings: currentCharacterCombatKitSummary.linkedExistingAwakeningCount,
  blackYoukaTradeoffs: currentCharacterCombatKitSummary.charactersWithBlackYoukaTradeoff,
  relationAssists: currentCharacterCombatKitSummary.charactersWithRelationAssist,
  runtimeAutoPromotionAllowed: false,
  futureCastPromotionAllowed: false,
}, null, 2));
