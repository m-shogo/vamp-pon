import fs from 'node:fs';
import {
  REALITY_ROOT_RULES,
  CHARACTER_REALITY_ROOTS,
  characterRealityRootSummary,
} from '../../src/game/data/characterRealityRootRegistry.ts';
import {
  CROSS_ERA_LINEAGE_MEMORY_RULES,
  CROSS_ERA_RELATION_CLASSES,
  CROSS_ERA_RECOGNITION_STAGES,
  CROSS_ERA_REQUIRED_SERIES_SLOTS,
  crossEraLineageMemorySummary,
} from '../../src/game/data/crossEraLineageMemory.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const required = [
  'docs/character-reality-origin-dialect-culture-bible-v1.md',
  'docs/character-reality-root-registry-v1.md',
  'docs/cross-era-lineage-memory-bible-v1.md',
  'docs/global-cultural-satire-localization-bible-v1.md',
  'src/game/data/characterRealityRootRegistry.ts',
  'src/game/data/crossEraLineageMemory.ts',
] as const;
for (const path of required) assert(fs.existsSync(path), `missing reality/lineage authority: ${path}`);

const originBible = read('docs/character-reality-origin-dialect-culture-bible-v1.md');
const rootRegistry = read('docs/character-reality-root-registry-v1.md');
const lineage = read('docs/cross-era-lineage-memory-bible-v1.md');
const global = read('docs/global-cultural-satire-localization-bible-v1.md');

assert(characterRealityRootSummary.total === 36, 'Reality root registry must cover all 36 characters');
assert(characterRealityRootSummary.current21 === 21, 'Reality root registry must cover Current21 21/21');
assert(characterRealityRootSummary.future15 === 15, 'Reality root registry must cover Future15 15/15');
assert(characterRealityRootSummary.uniqueIds === 36, 'Reality root registry IDs must be 36/36 unique');
assert(characterRealityRootSummary.yuiArakawaCount === 1, 'Yui must remain Arakawa-ku');
assert(characterRealityRootSummary.yuiShinjukuCount === 0, 'Yui must not be Shinjuku character');
assert(characterRealityRootSummary.shinjukuPresentCandidateCount >= 1, 'a present-day Shinjuku character must exist');
assert(characterRealityRootSummary.hiddenDialectCandidateCount >= 1, 'at least one hidden-dialect candidate must exist');

assert(REALITY_ROOT_RULES.originMayDifferFromIncidentArea, 'origin may differ from incident area');
assert(REALITY_ROOT_RULES.incidentParticipationRequiresEraPlausibleMobilityReason, 'mobility reason must be era-plausible');
assert(!REALITY_ROOT_RULES.coincidentalTourismIsDefaultIncidentReason, 'coincidental tourism must not be default incident reason');
assert(!REALITY_ROOT_RULES.exactHomeAddressPublic, 'exact home address must remain private');
assert(!REALITY_ROOT_RULES.prefectureStereotypeDefinesPersonality, 'prefecture stereotype must not define personality');
assert(!REALITY_ROOT_RULES.dialectRequiredEveryLine, 'dialect may not be required every line');
assert(!REALITY_ROOT_RULES.skinToneDeterminesNationalityOrOrigin, 'skin tone must not determine nationality/origin');
assert(REALITY_ROOT_RULES.yuiArakawaCurrent, 'Yui Arakawa rule must remain Current');
assert(!REALITY_ROOT_RULES.yuiShinjukuAllowed, 'Yui Shinjuku assignment must remain forbidden');
assert(REALITY_ROOT_RULES.shinjukuPresentCharacterRequired, 'Shinjuku present-day character remains required');
assert(REALITY_ROOT_RULES.pilgrimageValueMustFollowStoryFit, 'pilgrimage value must follow Story fit');

const yui = CHARACTER_REALITY_ROOTS.find((entry) => entry.id === 'yui');
const tobari = CHARACTER_REALITY_ROOTS.find((entry) => entry.id === 'tobari');
assert(yui?.root === '東京都荒川区', 'Yui root drifted from Arakawa-ku');
assert(!yui?.root.includes('新宿'), 'Yui unexpectedly became Shinjuku-rooted');
assert(tobari?.root.includes('新宿'), 'Tobari should retain the high-value Shinjuku current-derived root');
assert(tobari?.status === 'HIGH_VALUE_CURRENT_DERIVED', 'Tobari Shinjuku status must remain high-value current-derived');

assert(CROSS_ERA_LINEAGE_MEMORY_RULES.physicalMorningUsedForRecovery === false, 'physical morning must never drive memory recovery');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.normalWakingLosesExplicitDreamMemory, 'normal Waking must lose explicit Dream memory');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.normalWakingMayKeepImplicitSkillEmotionChoice, 'implicit skill/emotion/choice must be able to remain');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.resolutionWakingMayRestoreExplicitDreamMemory, 'resolution Waking must be able to restore explicit Dream memory');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.relationRevealRequiresRealityEvidence, 'relation reveal must require Reality evidence');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.bloodRelationIsOnlyInheritanceType, 'blood must not be the only inheritance type');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.majorityOfMainCastMayBecomeOneFamily, 'main-cast genealogy overload must remain forbidden');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.descendantInheritsAncestorGuilt, 'descendants may not inherit ancestor guilt');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.dementiaExplainsDreamMemoryLoss, 'dementia may not explain Dream memory loss');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.cognitiveImpairmentUsedAsDreamJoke, 'cognitive impairment may not be a Dream joke');
assert(CROSS_ERA_RELATION_CLASSES.includes('PARENT_CHILD_ACROSS_ERAS'), 'parent-child cross-era relation class missing');
assert(CROSS_ERA_RELATION_CLASSES.includes('FRIEND_DESCENDANT'), 'friend-descendant relation class missing');
assert(CROSS_ERA_RELATION_CLASSES.includes('OBJECT_INHERITANCE'), 'object inheritance relation class missing');
assert(CROSS_ERA_RELATION_CLASSES.includes('PLACE_INHERITANCE'), 'place inheritance relation class missing');
assert(CROSS_ERA_RECOGNITION_STAGES.includes('NORMAL_WAKING_MEMORY_LOSS'), 'normal Waking recognition stage missing');
assert(CROSS_ERA_RECOGNITION_STAGES.includes('RESOLUTION_WAKING_RECONTEXTUALIZATION'), 'resolution Waking recontextualization stage missing');
assert(CROSS_ERA_REQUIRED_SERIES_SLOTS.trueParentChildRevealMinimum >= 1, 'at least one parent-child reveal lane required');
assert(CROSS_ERA_REQUIRED_SERIES_SLOTS.trueAncestorDescendantRevealMinimum >= 1, 'at least one ancestor-descendant reveal lane required');
assert(CROSS_ERA_REQUIRED_SERIES_SLOTS.nonBloodInheritanceMustRemainPlural, 'non-blood inheritance must remain plural');
assert(!CROSS_ERA_REQUIRED_SERIES_SLOTS.exactParentChildPairFrozen, 'exact parent-child pair must remain Open');
assert(!CROSS_ERA_REQUIRED_SERIES_SLOTS.exactAncestorDescendantPairFrozen, 'exact ancestor-descendant pair must remain Open');
assert(crossEraLineageMemorySummary.relationClassCount >= 10, 'cross-era relation vocabulary too narrow');

assert(originBible.includes('ユイ = 東京都荒川区の下町育ち'), 'origin bible must preserve Yui Arakawa decision');
assert(originBible.includes('新宿には現代Characterを置く。Yuiにはしない'), 'origin bible must preserve non-Yui Shinjuku direction');
assert(rootRegistry.includes('origin != incident location'), 'root registry must preserve origin/incident separation');
assert(rootRegistry.includes('東京都荒川区') && rootRegistry.includes('東京都新宿区'), 'root registry must retain Arakawa and Shinjuku anchors');
assert(lineage.includes('physical morningではなくResolution Waking'), 'lineage bible must preserve Waking rather than physical morning');
assert(lineage.includes('主要castの過半数を互いの親族へしない'), 'lineage bible must forbid genealogy overload');
assert(lineage.includes('怖い / 変な人'), 'lineage bible must preserve child misreading of Dream residue');
assert(global.includes('Globalize understanding, not erase Japanese specificity'), 'globalization rule must preserve Japanese specificity');
assert(global.includes('Satire target hierarchy'), 'global satire target hierarchy missing');
assert(global.includes('Dialect localization'), 'global localization must preserve dialect/register strategy');

assert(!REALITY_ROOT_RULES.runtimeAutoPromotionAllowed, 'Reality root rules may not auto-promote runtime');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.runtimeAutoPromotionAllowed, 'lineage rules may not auto-promote runtime');
assert(!characterRealityRootSummary.runtimeAutoPromotionAllowed, 'Reality root summary may not auto-promote runtime');
assert(!crossEraLineageMemorySummary.runtimeAutoPromotionAllowed, 'lineage summary may not auto-promote runtime');

console.log(JSON.stringify({
  realityRoots: characterRealityRootSummary.total,
  current21: characterRealityRootSummary.current21,
  future15: characterRealityRootSummary.future15,
  yuiArakawa: characterRealityRootSummary.yuiArakawaCount,
  shinjukuCandidates: characterRealityRootSummary.shinjukuPresentCandidateCount,
  relationClasses: crossEraLineageMemorySummary.relationClassCount,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
