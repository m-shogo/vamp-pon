import fs from 'node:fs';
import { CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX } from '../../src/game/data/characterOrdinaryLifeReservoir.ts';
import {
  CHARACTER_LIVED_ARTIFACT_RULES,
  CHARACTER_LIVED_ARTIFACT_AXES,
  CHARACTER_LIVED_ARTIFACT_RESERVOIR,
  characterLivedArtifactSummary,
} from '../../src/game/data/characterLivedArtifactReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-ordinary-life-reservoir-v1.md',
  'docs/character-behavior-identity-reservoir-v1.md',
  'docs/character-lived-artifact-reservoir-v1.md',
  'src/game/data/characterOrdinaryLifeReservoir.ts',
  'src/game/data/characterLivedArtifactReservoir.ts',
]) assert(fs.existsSync(path), `missing lived-artifact source: ${path}`);

assert(CHARACTER_LIVED_ARTIFACT_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'artifact layer must remain reservoir');
assert(CHARACTER_LIVED_ARTIFACT_RULES.characterCoverageRequired === 36, 'artifact character target drift');
assert(CHARACTER_LIVED_ARTIFACT_RULES.axesPerCharacterRequired === 6, 'artifact axes target drift');
assert(CHARACTER_LIVED_ARTIFACT_RULES.totalArtifactAnchorCountRequired === 216, 'artifact total target drift');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.physicalIdentityAuthorityOverridden, 'artifact reservoir may not override Physical Identity');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.exactCostumeFrozenHere, 'exact costume may not be frozen here');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.exactBrandFrozenHere, 'exact brand may not be frozen here');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.exactHomeInteriorFrozenHere, 'exact home interior may not be frozen here');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.exactOccupationFrozenHere, 'exact occupation may not be frozen here');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.exactEconomicClassFrozenHere, 'economic class may not be frozen here');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.exactEraProductFrozenHere, 'exact Era product may not be frozen here');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.commercialMerchDesignFrozenHere, 'merch design may not be frozen here');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.damageWearMeansTrauma, 'damage/wear may not equal trauma');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.expensiveItemMeansRich, 'expensive item may not equal rich');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.neatRoomMeansGoodPerson, 'neat room may not equal good person');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.messyRoomMeansBadPerson, 'messy room may not equal bad person');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.skinToneDeterminesPalette, 'skin tone may not determine palette');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.genderDeterminesWardrobe, 'gender may not determine wardrobe');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.animalAccessoryMeansOwnerIdentity, 'animal accessory may not prove owner/identity');
assert(!CHARACTER_LIVED_ARTIFACT_RULES.runtimeAutoPromotionAllowed, 'artifact reservoir may not auto-promote runtime');

assert(CHARACTER_LIVED_ARTIFACT_AXES.length === 6, 'artifact axis vocabulary drift');
assert(new Set(CHARACTER_LIVED_ARTIFACT_AXES).size === 6, 'artifact axes must be unique');
assert(characterLivedArtifactSummary.characterCount === 36, 'artifact reservoir must cover 36/36');
assert(characterLivedArtifactSummary.uniqueCharacterIds === 36, 'artifact character IDs must be unique');
assert(characterLivedArtifactSummary.axesPerCharacter === 6, 'artifact axes-per-character drift');
assert(characterLivedArtifactSummary.totalArtifactAnchors === 216, `artifact anchor total drift: ${characterLivedArtifactSummary.totalArtifactAnchors}`);
assert(characterLivedArtifactSummary.allAnchorsPresent, 'every character must have all artifact anchors');
assert(!characterLivedArtifactSummary.physicalIdentityAuthorityOverridden, 'artifact summary may not override Physical Identity');
assert(!characterLivedArtifactSummary.runtimeAutoPromotionAllowed, 'artifact summary may not auto-promote runtime');

const ordinaryById = new Map(CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.map((entry) => [entry.id, entry.name]));
assert(ordinaryById.size === 36, 'ordinary-life upstream must remain 36');
let anchorCount = 0;
for (const entry of CHARACTER_LIVED_ARTIFACT_RESERVOIR) {
  assert(ordinaryById.get(entry.id) === entry.name, `artifact name/id drift: ${entry.id}`);
  for (const axis of CHARACTER_LIVED_ARTIFACT_AXES) {
    const value = entry.anchors[axis];
    assert(typeof value === 'string' && value.length > 24, `artifact anchor too thin: ${entry.id}/${axis}`);
    anchorCount += 1;
  }
}
assert(anchorCount === 216, `artifact anchor coverage drift: ${anchorCount}`);

const master = fs.readFileSync('docs/00-current-story-world-master.md', 'utf8');
assert(master.includes('Physical Identity Sheet'), 'Physical Identity authority missing from World Master');
assert(master.includes('カナメ') && master.includes('188') && master.includes('112'), 'Kaname physical anchor missing');
assert(master.includes('ハナ') && master.includes('ぽっちゃり'), 'Hana plus-size physical anchor missing');
assert(master.includes('アサ') && master.includes('compact'), 'Asa compact Human physical anchor missing');
assert(master.includes('クウ') && master.includes('犬'), 'Kuu dog boundary missing');
assert(master.includes('ヨモ') && master.includes('猫'), 'Yomo cat boundary missing');
assert(master.includes('ルム') && master.includes('Robot'), 'Rum Robot boundary missing');
assert(master.includes('スズ') && master.includes('feminine'), 'Suzu presentation boundary missing');
assert(master.includes('アマネ') && master.includes('wheelchair'), 'Amane wheelchair boundary missing');

const doc = fs.readFileSync('docs/character-lived-artifact-reservoir-v1.md', 'utf8');
assert(doc.includes('AUTHOR RESERVOIR / NON-CANON / PHYSICAL IDENTITY AUTHORITY PRESERVED / FREE TO OVERWRITE'), 'artifact doc status drift');
assert(doc.includes('36 × 6 = 216 lived-artifact anchors'), '216 artifact formula missing');
assert(doc.includes('高価な物 = 金持ち'), 'price/class guard missing');
assert(doc.includes('壊れた物 = trauma'), 'damage/trauma guard missing');
assert(doc.includes('褐色肌 = 南国palette'), 'skin-tone palette guard missing');
assert(doc.includes('Characterの持ち物は「設定資料に書いてある物」ではなく、使い続けた跡がある物にする。'), 'artifact author principle missing');
assert(doc.includes('sellable acrylic charm shape chosen') || doc.includes('sellable acrylic charm'), 'merch reverse-author guard missing');

console.log(JSON.stringify({
  characters: characterLivedArtifactSummary.characterCount,
  artifactAxes: characterLivedArtifactSummary.axesPerCharacter,
  artifactAnchors: anchorCount,
  exactCostumeFrozen: false,
  exactBrandFrozen: false,
  physicalIdentityOverride: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
