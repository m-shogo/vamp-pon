import fs from 'node:fs';
import {
  STORY_TEMPORAL_MAP_RULES,
  STORY_TEMPORAL_MAP_LANES,
  STORY_TEMPORAL_MAP_DREAM_OVERLAY,
  STORY_TEMPORAL_MAP_SKY_OVERLAY,
  storyTemporalMapSummary,
} from '../../src/game/data/storyTemporalMapReadModel.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(STORY_TEMPORAL_MAP_RULES.status === 'AUTHORING_READ_MODEL_FIVE_REALITY_ERA_LANES_PLUS_DREAM_OVERLAY', 'temporal map status drift');
assert(STORY_TEMPORAL_MAP_RULES.authorFacingOnly, 'temporal map must remain author-facing');
assert(STORY_TEMPORAL_MAP_RULES.laneCountRequired === 5, 'temporal map lane target drift');
assert(STORY_TEMPORAL_MAP_RULES.laneOrderIsChronologicalDirection, 'temporal lane order must remain chronological direction');
assert(!STORY_TEMPORAL_MAP_RULES.exactYearsFrozen, 'exact years must remain Open');
assert(!STORY_TEMPORAL_MAP_RULES.roughHistoricalBandsAreExactAuthority, 'rough historical bands may not become exact date authority');
assert(!STORY_TEMPORAL_MAP_RULES.realHistoricalIncidentMayBeRenamedAndCopied, 'real historical incident may not be renamed/copied');
assert(STORY_TEMPORAL_MAP_RULES.fictionalIncidentsMustRemainEraSpecific, 'fictional incidents must remain era-specific');
assert(!STORY_TEMPORAL_MAP_RULES.presentEraIsDefaultCorrectSide, 'present era may not be default correct side');
assert(!STORY_TEMPORAL_MAP_RULES.futureEraIsHumanUpgrade, 'future era may not be Human upgrade');
assert(!STORY_TEMPORAL_MAP_RULES.dreamLayerIsPhysicalChronologicalEra, 'dream may not become physical chronological era');
assert(!STORY_TEMPORAL_MAP_RULES.dreamExplicitTimeTagsStrong, 'dream explicit time tags must remain weak');
assert(!STORY_TEMPORAL_MAP_RULES.wakingReturnsToSingleSharedPresent, 'waking may not return everyone to one shared present');
assert(!STORY_TEMPORAL_MAP_RULES.constellationSameAcrossErasRequired, 'constellations may differ across eras');
assert(STORY_TEMPORAL_MAP_RULES.skyOverlayMayShowHistoricalConstellationDifference, 'historical constellation overlay must remain allowed');
assert(!STORY_TEMPORAL_MAP_RULES.finalConstellationChangeCauseFrozenHere, 'final constellation-change cause must remain Open');
assert(!STORY_TEMPORAL_MAP_RULES.runtimeAutoPromotionAllowed, 'temporal map may not auto-promote runtime');

const expectedLaneIds = [
  'POSTWAR_RECOVERY_SCARCITY_JAPAN',
  'LATE_HIGH_GROWTH_POLLUTION_ENERGY_TRANSITION_JAPAN',
  'POST_BUBBLE_EARLY_MOBILE_INTERNET_JAPAN',
  'PRESENT_DAY_JAPAN',
  'FAR_FUTURE_HUMAN_ANDROID_ROBOT_AVATAR_SOCIETY',
] as const;
const expectedCharacterIds = ['tomori','michiru','nagi','yui','asa'] as const;

assert(storyTemporalMapSummary.laneCount === 5, 'temporal map lane count drift');
assert(storyTemporalMapSummary.uniqueLaneCount === 5, 'temporal map lanes must be unique');
assert(storyTemporalMapSummary.uniqueLeadCount === 5, 'temporal map Core5 leads must be unique');
assert(storyTemporalMapSummary.exactYearFrozenCount === 0, 'temporal map exact year unexpectedly frozen');
assert(storyTemporalMapSummary.presentLaneCount === 1, 'temporal map present lane count drift');
assert(storyTemporalMapSummary.futureLaneCount === 1, 'temporal map future lane count drift');
assert(storyTemporalMapSummary.humanLeadCount === 5, 'all Core5 temporal leads must remain Human');
assert(storyTemporalMapSummary.core5SourceUniqueEraCount === 5, 'Core5 source unique era count drift');
assert(!storyTemporalMapSummary.core5ExactYearsFrozen, 'Core5 exact years must remain Open');
assert(!storyTemporalMapSummary.dreamIsChronologicalEra, 'dream may not become sixth chronological era');
assert(!storyTemporalMapSummary.constellationSameAcrossErasRequired, 'same constellation set may not be required across eras');
assert(!storyTemporalMapSummary.runtimeAutoPromotionAllowed, 'temporal summary may not auto-promote runtime');

assert(JSON.stringify(STORY_TEMPORAL_MAP_LANES.map((lane) => lane.order)) === JSON.stringify([1,2,3,4,5]), 'temporal map lane order drift');
assert(JSON.stringify(STORY_TEMPORAL_MAP_LANES.map((lane) => lane.laneId)) === JSON.stringify(expectedLaneIds), 'temporal map lane IDs/order drift');
assert(JSON.stringify(STORY_TEMPORAL_MAP_LANES.map((lane) => lane.characterId)) === JSON.stringify(expectedCharacterIds), 'temporal map lead order drift');
for (const lane of STORY_TEMPORAL_MAP_LANES) {
  assert(!lane.exactYearFrozen, `exact year must remain Open: ${lane.characterId}`);
  assert(lane.roughHistoricalBand.length > 0, `rough historical band missing: ${lane.characterId}`);
  assert(lane.fictionalIncidentLane.length > 0, `fictional incident lane missing: ${lane.characterId}`);
  assert(lane.forbiddenAutoCanon.length > 0, `forbiddenAutoCanon missing: ${lane.characterId}`);
  assert(lane.species === 'HUMAN', `Core5 temporal lead species drift: ${lane.characterId}`);
}

assert(STORY_TEMPORAL_MAP_DREAM_OVERLAY.layerType === 'DREAM_WORLD', 'dream layer type drift');
assert(STORY_TEMPORAL_MAP_DREAM_OVERLAY.sharedDreamLike, 'dream shared-dream-like boundary drift');
assert(!STORY_TEMPORAL_MAP_DREAM_OVERLAY.physicalMorningExists, 'physical morning may not exist in dream');
assert(STORY_TEMPORAL_MAP_DREAM_OVERLAY.returnMode === 'WAKING_TO_OWN_REALITY_ERA', 'dream return mode drift');
assert(STORY_TEMPORAL_MAP_DREAM_OVERLAY.normalWakingExplicitMemoryLoss, 'normal waking explicit memory loss drift');
assert(STORY_TEMPORAL_MAP_DREAM_OVERLAY.normalWakingImplicitLearningCanRemain, 'implicit learning retention drift');
assert(STORY_TEMPORAL_MAP_DREAM_OVERLAY.resolutionWakingMemoryRecoveryDirection, 'resolution memory recovery direction drift');
assert(STORY_TEMPORAL_MAP_DREAM_OVERLAY.explicitTimeTagsWeakInDream, 'dream explicit time tags must remain weak');
assert(!STORY_TEMPORAL_MAP_DREAM_OVERLAY.isPhysicalChronologicalEra, 'dream overlay may not become physical chronological era');

assert(STORY_TEMPORAL_MAP_SKY_OVERLAY.starsVisible, 'stars must remain visible');
assert(STORY_TEMPORAL_MAP_SKY_OVERLAY.starsCoreVisualIdentity, 'stars must remain core visual identity');
assert(!STORY_TEMPORAL_MAP_SKY_OVERLAY.constellationSameAcrossErasRequired, 'constellations may differ across eras');
assert(STORY_TEMPORAL_MAP_SKY_OVERLAY.lostOldConstellationsAllowed, 'lost historical constellations must remain allowed');
assert(STORY_TEMPORAL_MAP_SKY_OVERLAY.newlyCreatedLaterConstellationsAllowed, 'later-created constellations must remain allowed');
assert(!STORY_TEMPORAL_MAP_SKY_OVERLAY.finalConstellationChangeCauseFrozen, 'final constellation-change cause must remain Open');
assert(!STORY_TEMPORAL_MAP_SKY_OVERLAY.realAstronomyIsDreamAbsoluteConstraint, 'real astronomy may not be absolute dream constraint');

const doc = fs.readFileSync('docs/story-temporal-map-read-model-v1.md', 'utf8');
for (const token of [
  'CURRENT AUTHORING TEMPORAL MAP / 5 REALITY ERA LANES + DREAM OVERLAY / EXACT YEARS OPEN',
  'The rough historical bands are authoring/display reference bands, not exact date authority.',
  'Dream World is not a sixth physical era.',
  'their own reality era',
  'the same constellation set is **not required across eras**',
  'real incident != renamed fictional incident',
  '「年表」は年号を埋めるためではなく、同じ星空の下で何が違い、夢の中で何が交差するかを見せる地図にする。',
]) assert(doc.includes(token), `temporal map doc guard missing: ${token}`);

console.log(JSON.stringify({lanes:5,uniqueEras:5,exactYearsFrozen:0,dreamIsSixthEra:false,returnsToOwnRealityEra:true,constellationsMayDifferAcrossEras:true,runtimeAutoPromotionAllowed:false}, null, 2));
