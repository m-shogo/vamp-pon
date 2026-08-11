import fs from 'node:fs';
import { CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX } from '../../src/game/data/characterOrdinaryLifeReservoir.ts';
import {
  CHARACTER_BEHAVIOR_IDENTITY_RULES,
  CHARACTER_BEHAVIOR_ANCHOR_KINDS,
  CHARACTER_BEHAVIOR_IDENTITY_RESERVOIR,
  characterBehaviorIdentitySummary,
} from '../../src/game/data/characterBehaviorIdentityReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-ordinary-life-reservoir-v1.md',
  'docs/character-behavior-identity-reservoir-v1.md',
  'src/game/data/characterOrdinaryLifeReservoir.ts',
  'src/game/data/characterBehaviorIdentityReservoir.ts',
]) assert(fs.existsSync(path), `missing behavior identity source: ${path}`);

assert(CHARACTER_BEHAVIOR_IDENTITY_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'behavior identity must remain reservoir');
assert(CHARACTER_BEHAVIOR_IDENTITY_RULES.characterCoverageRequired === 36, 'behavior identity character target drift');
assert(CHARACTER_BEHAVIOR_IDENTITY_RULES.anchorsPerCharacterRequired === 9, 'behavior identity anchor target drift');
assert(CHARACTER_BEHAVIOR_IDENTITY_RULES.totalBehaviorAnchorCountRequired === 324, 'behavior identity total target drift');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.physicalIdentityAuthorityOverridden, 'behavior reservoir may not override Physical Identity authority');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.exactVoiceActorDirectionFrozenHere, 'voice actor direction may not be frozen here');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.exactDialectVocabularyFrozenHere, 'dialect vocabulary may not be frozen here');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.exactGenderIdentityFrozenHere, 'gender identity may not be frozen here');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.exactSexualityFrozenHere, 'sexuality may not be frozen here');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.exactDreamFormFrozenHere, 'Dream form may not be frozen here');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.bodyTypeDeterminesSpeedOrPersonality, 'body type may not determine speed/personality');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.ageDeterminesSlownessOrWisdom, 'age may not determine slowness/wisdom');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.femininePresentationDeterminesVoiceOrSexuality, 'feminine presentation may not determine voice/sexuality');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.wheelchairUseDeterminesPersonality, 'wheelchair use may not determine personality');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.animalBehaviorEqualsTruthDetector, 'animal behavior may not equal truth detector');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.robotBehaviorRequiresMonotone, 'robot behavior may not require monotone');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.stressTellEqualsTrueSelf, 'stress tell may not equal true self');
assert(!CHARACTER_BEHAVIOR_IDENTITY_RULES.runtimeAutoPromotionAllowed, 'behavior reservoir may not auto-promote runtime');

assert(CHARACTER_BEHAVIOR_ANCHOR_KINDS.length === 9, 'behavior anchor kind vocabulary drift');
assert(new Set(CHARACTER_BEHAVIOR_ANCHOR_KINDS).size === 9, 'behavior anchor kinds must be unique');
assert(characterBehaviorIdentitySummary.characterCount === 36, 'behavior reservoir must cover 36/36');
assert(characterBehaviorIdentitySummary.uniqueCharacterIds === 36, 'behavior character IDs must be unique');
assert(characterBehaviorIdentitySummary.anchorsPerCharacter === 9, 'behavior summary anchor count drift');
assert(characterBehaviorIdentitySummary.totalBehaviorAnchors === 324, `behavior anchor total drift: ${characterBehaviorIdentitySummary.totalBehaviorAnchors}`);
assert(characterBehaviorIdentitySummary.allAnchorsPresent, 'every character must have all behavior anchors');
assert(!characterBehaviorIdentitySummary.physicalIdentityAuthorityOverridden, 'summary may not override Physical Identity authority');
assert(!characterBehaviorIdentitySummary.runtimeAutoPromotionAllowed, 'summary may not auto-promote runtime');

const ordinaryById = new Map(CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.map((entry) => [entry.id, entry.name]));
assert(ordinaryById.size === 36, 'ordinary-life upstream must remain 36 characters');
const compositeAnchorIds = new Set<string>();
for (const entry of CHARACTER_BEHAVIOR_IDENTITY_RESERVOIR) {
  assert(ordinaryById.get(entry.id) === entry.name, `behavior identity name/id drift: ${entry.id}`);
  for (const kind of CHARACTER_BEHAVIOR_ANCHOR_KINDS) {
    const value = entry.anchors[kind];
    assert(typeof value === 'string' && value.length > 20, `behavior anchor too thin: ${entry.id}/${kind}`);
    const composite = `${entry.id}/${kind}`;
    assert(!compositeAnchorIds.has(composite), `duplicate behavior anchor composite: ${composite}`);
    compositeAnchorIds.add(composite);
  }
}
assert(compositeAnchorIds.size === 324, 'behavior composite anchor coverage must equal 324');

const master = fs.readFileSync('docs/00-current-story-world-master.md', 'utf8');
assert(master.includes('Physical Identity Sheet'), 'Physical Identity Sheet authority missing from World Master');
assert(master.includes('posture') && master.includes('habitual gesture') && master.includes('gait'), 'Physical Identity movement anchors missing from World Master');
assert(master.includes('カナメ') && master.includes('188') && master.includes('112'), 'Kaname physical anchor missing from World Master');
assert(master.includes('ハナ') && master.includes('ぽっちゃり'), 'Hana plus-size physical anchor missing from World Master');
assert(master.includes('アサ') && master.includes('compact'), 'Asa compact physical anchor missing from World Master');
assert(master.includes('クウ') && master.includes('犬'), 'Kuu dog physical identity missing from World Master');
assert(master.includes('ヨモ') && master.includes('猫'), 'Yomo cat physical identity missing from World Master');
assert(master.includes('ルム') && master.includes('Robot'), 'Rum Robot identity missing from World Master');
assert(master.includes('スズ') && master.includes('feminine'), 'Suzu feminine-presentation physical identity missing from World Master');
assert(master.includes('イオ') && master.includes('gender'), 'Io gender boundary missing from World Master');
assert(master.includes('アマネ') && master.includes('wheelchair'), 'Amane wheelchair boundary missing from World Master');

const doc = fs.readFileSync('docs/character-behavior-identity-reservoir-v1.md', 'utf8');
assert(doc.includes('AUTHOR RESERVOIR / NON-CANON / PHYSICAL IDENTITY AUTHORITY PRESERVED / FREE TO OVERWRITE'), 'behavior doc status drift');
assert(doc.includes('36 characters × 9 axes = 324 behavior anchors'), 'behavior 324-target formula missing');
assert(doc.includes('ぽっちゃり = 遅い / 不器用 / 食いしん坊'), 'body stereotype guard missing');
assert(doc.includes('Robot = monotone / emotionless'), 'Robot monotone guard missing');
assert(doc.includes('wheelchair = 静か / 慎重 / inspirational'), 'wheelchair personality guard missing');
assert(doc.includes('Characterは立ち絵で区別するだけではなく、後ろ姿が歩いただけでも誰か分かるところまで育てる。'), 'behavior identity principle missing');
assert(doc.includes('Generated visual failure never creates Canon.'), 'generated visual Canon guard missing');

console.log(JSON.stringify({
  characters: characterBehaviorIdentitySummary.characterCount,
  behaviorAxes: characterBehaviorIdentitySummary.anchorsPerCharacter,
  behaviorAnchors: characterBehaviorIdentitySummary.totalBehaviorAnchors,
  compositeAnchors: compositeAnchorIds.size,
  physicalIdentityOverride: false,
  bodyTypeDefinesBehavior: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
