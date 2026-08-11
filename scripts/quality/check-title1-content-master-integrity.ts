import { readFileSync } from 'node:fs';

import {
  title1ContentMasterAuthorities,
  title1ContentMasterIntegritySnapshot,
  title1ContentMasterOpenImplementationGates,
} from '../../src/game/data/title1ContentMasterIntegritySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const snapshot = title1ContentMasterIntegritySnapshot;

assert(snapshot.authorityStatus === 'CONTENT_MASTER_INTEGRATED_RUNTIME_PROMOTION_GATED', 'Title1 Content Master authority status drift');
assert(snapshot.stages.count === 20, `Stage count must remain 20, got ${snapshot.stages.count}`);
assert(snapshot.stages.firstStageId === 'forgotten_street', `unexpected first Stage: ${snapshot.stages.firstStageId}`);
assert(snapshot.stages.finalStageId === 'dawn_return_square', `unexpected final Stage: ${snapshot.stages.finalStageId}`);

assert(snapshot.characters.currentCount === 21, `Current Character count must remain 21, got ${snapshot.characters.currentCount}`);
assert(snapshot.characters.relationshipArcCount === 24, `Current relationship arc count must remain 24, got ${snapshot.characters.relationshipArcCount}`);
assert(snapshot.enemies.currentCount === 48, `Current Enemy count must remain 48, got ${snapshot.enemies.currentCount}`);

assert(snapshot.combatVocabulary.attributeCountIncludingNeutral === 15, `Combat Attribute vocabulary should be 14 + NEUTRAL, got ${snapshot.combatVocabulary.attributeCountIncludingNeutral}`);
assert(snapshot.combatVocabulary.baseAttributeCount === 14, `base Attribute count must remain 14, got ${snapshot.combatVocabulary.baseAttributeCount}`);
assert(snapshot.combatVocabulary.statusCount === 16, `Status vocabulary must remain 16, got ${snapshot.combatVocabulary.statusCount}`);
assert(snapshot.combatVocabulary.initialReactionCount === 12, `initial Reaction vocabulary must remain 12, got ${snapshot.combatVocabulary.initialReactionCount}`);

assert(snapshot.baseWeapons.currentCount === 8, `Current Base Weapon count must remain 8, got ${snapshot.baseWeapons.currentCount}`);
assert(snapshot.baseWeapons.selectedCandidateCount === 16, `Selected Base candidate count must remain 16, got ${snapshot.baseWeapons.selectedCandidateCount}`);
assert(snapshot.baseWeapons.heldCandidateCount === 4, `Base Hold count must remain 4, got ${snapshot.baseWeapons.heldCandidateCount}`);
assert(snapshot.baseWeapons.plannedTitle1FamilyCount === 24, `Title1 Base family plan must remain 24, got ${snapshot.baseWeapons.plannedTitle1FamilyCount}`);
assert(snapshot.baseWeapons.candidateStarterHeldCount === 0, 'Current21 Candidate starting plans may not depend on Base Hold4');

assert(snapshot.combatItems.candidateAuthorityCount === 18, `Combat Item authority must remain 18, got ${snapshot.combatItems.candidateAuthorityCount}`);
assert(snapshot.combatItems.selectedPlacementCount === 18, 'all Combat Item18 candidates must remain placed');
assert(snapshot.combatItems.passiveCount === 14, 'Combat Item PASSIVE count must remain 14');
assert(snapshot.combatItems.fieldItemCount === 2, 'Combat Item FIELD_ITEM count must remain 2');
assert(snapshot.combatItems.rareSupportCount === 2, 'Combat Item RARE_SUPPORT count must remain 2');
assert(snapshot.combatItems.latestIntroductionStage === 17, 'new Combat Item introductions must stop by Stage17');

assert(snapshot.transformations.authorityCount === 38, `Transformation authority must remain 38, got ${snapshot.transformations.authorityCount}`);
assert(snapshot.transformations.selectedCount === 29, `Transformation selected count must remain 29, got ${snapshot.transformations.selectedCount}`);
assert(snapshot.transformations.heldCount === 9, `Transformation hold count must remain 9, got ${snapshot.transformations.heldCount}`);
assert(snapshot.transformations.selectedFusionCount === 11, 'Selected Fusion count must remain 11');
assert(snapshot.transformations.selectedSynthesisCount === 11, 'Selected Synthesis count must remain 11');
assert(snapshot.transformations.selectedAwakeningCount === 7, 'Selected Awakening count must remain 7');
assert(snapshot.transformations.currentKitLinkedAwakeningHeldCount === 0, 'Current21 linked Awakening may not fall into Transformation Hold9');

assert(snapshot.learning.stageCount === 20, 'Unlock learning must remain Stage20-aligned');
assert(snapshot.learning.firstStageAttributeCount === 2, 'Stage1 learning must remain MEMORY/LIGHT only');
assert(snapshot.learning.allBaseAttributesByStage === 16, 'all 14 base Attributes must be introduced by Stage16');
assert(snapshot.learning.allInitialReactionsByStage === 18, 'all 12 initial Reactions must be introduced by Stage18');

assert(snapshot.ending.contentEndAnchorStageId === 'dawn_return_square', 'Story Complete content anchor drift');
assert(!snapshot.ending.runtimeGateFrozen, 'Content Master must not pretend exact runtime ending trigger is frozen');
assert(!snapshot.ending.allLightsRequiredForStoryComplete, 'All Lights may not gate Story Complete');
assert(!snapshot.ending.allAchievementsRequiredForStoryComplete, 'Achievements may not gate Story Complete');
assert(!snapshot.ending.allCombatItemsRequiredForStoryComplete, 'Combat Item18 may not gate Story Complete');
assert(!snapshot.ending.allTransformationsRequiredForStoryComplete, 'Transformation29 may not gate Story Complete');
assert(!snapshot.ending.futureContentRequiredForStoryComplete, 'Future content may not gate Title1 Story Complete');

assert(snapshot.completion.allLightsGroupCount === 6, 'All Lights group count must remain six');
assert(snapshot.completion.allLightsDesignTargetTotal === 132, 'All Lights design target total must remain 132 until redesigned explicitly');
assert(!snapshot.completion.allLightsRuntimeFrozen, 'All Lights runtime denominator must remain unfrozen');
assert(snapshot.completion.allLightsOptionalPostgame, 'All Lights must remain optional postgame celebration');
assert(snapshot.completion.runtimeAchievementCount === 14, 'legacy runtime Achievement count must remain acknowledged as 14');
assert(!snapshot.completion.legacyAchievementCatalogClaimsStage20Coverage, 'Achievement14 must not claim Stage20 editorial coverage');

assert(!snapshot.promotionBoundary.baseWeaponRuntimeAutoPromotionAllowed, 'Base candidate Content Master must not auto-promote runtime');
assert(!snapshot.promotionBoundary.combatItemRuntimeAutoPromotionAllowed, 'Combat Item Content Master must not auto-promote runtime');
assert(!snapshot.promotionBoundary.transformationRuntimeAutoPromotionAllowed, 'Transformation Content Master must not auto-promote runtime');
assert(!snapshot.promotionBoundary.contentMasterMayFreezeRuntimeCompletionByItself, 'Content Master must not freeze runtime completion automatically');

const authorityPaths = Object.values(title1ContentMasterAuthorities);
assert(authorityPaths.length === 11, `Title1 Content Master should expose 11 authority lanes, got ${authorityPaths.length}`);
assert(new Set(authorityPaths).size === authorityPaths.length, 'Title1 Content Master authority paths must be unique');
assert(authorityPaths.every((path) => path.startsWith('src/game/data/')), 'machine authority paths must remain in src/game/data');

assert(title1ContentMasterOpenImplementationGates.length === 7, `expected seven explicit runtime/open gates, got ${title1ContentMasterOpenImplementationGates.length}`);
for (const gate of title1ContentMasterOpenImplementationGates) {
  assert(gate.length >= 25, `open implementation gate needs explicit wording: ${gate}`);
}

const doc = readFileSync(new URL('../../docs/title1-content-master-integrity-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Stage20',
  'Current21',
  'Enemy48',
  'Base24',
  'Combat Item18',
  'Transformation38',
  'Selected29 / Hold9',
  '14属性',
  '16Status',
  '12Reaction',
  'Achievement14',
  'All Lights 132',
  'CONTENT_SOURCE_ONLY',
  'Runtime',
  'Open implementation gates',
]) {
  assert(doc.includes(token), `Title1 Content Master integrity doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  title: snapshot.title,
  stages: snapshot.stages.count,
  characters: snapshot.characters.currentCount,
  enemies: snapshot.enemies.currentCount,
  combatVocabulary: snapshot.combatVocabulary,
  baseWeapons: snapshot.baseWeapons,
  combatItems: snapshot.combatItems,
  transformations: snapshot.transformations,
  learning: snapshot.learning,
  completion: snapshot.completion,
  openImplementationGates: title1ContentMasterOpenImplementationGates.length,
}, null, 2));
