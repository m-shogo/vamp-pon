import fs from 'node:fs';
import {
  REALITY_ORIGIN_MOBILITY_RULES,
  CURRENT21_REALITY_BACKSTAGE_IDS,
  FUTURE15_REALITY_BACKSTAGE_IDS,
  CROSS_ERA_LINEAGE_MEMORY_RULES,
  realityOriginLineageSummary,
} from '../../src/game/data/realityOriginLineageSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const required = [
  'docs/character-reality-origin-dialect-culture-bible-v1.md',
  'docs/character-reality-origin-mobility-atlas-v1.md',
  'docs/cross-era-lineage-memory-bible-v1.md',
  'docs/global-cultural-satire-localization-bible-v1.md',
  'src/game/data/realityOriginLineageSource.ts',
] as const;
for (const path of required) assert(fs.existsSync(path), `missing reality/lineage authority: ${path}`);

const originBible = read('docs/character-reality-origin-dialect-culture-bible-v1.md');
const atlas = read('docs/character-reality-origin-mobility-atlas-v1.md');
const lineage = read('docs/cross-era-lineage-memory-bible-v1.md');
const global = read('docs/global-cultural-satire-localization-bible-v1.md');

assert(realityOriginLineageSummary.current21Count === 21, 'Current21 backstage origin coverage must be 21/21');
assert(realityOriginLineageSummary.future15Count === 15, 'Future15 backstage origin coverage must be 15/15');
assert(realityOriginLineageSummary.totalBackstageCharacterCount === 36, 'total backstage origin coverage must be 36');
assert(new Set(CURRENT21_REALITY_BACKSTAGE_IDS).size === 21, 'Current21 origin IDs must be unique');
assert(new Set(FUTURE15_REALITY_BACKSTAGE_IDS).size === 15, 'Future15 origin IDs must be unique');
assert(realityOriginLineageSummary.yuiArakawaLocked, 'Yui Arakawa must remain user-decided');

assert(REALITY_ORIGIN_MOBILITY_RULES.yui.originMunicipality === 'ARAKAWA_KU', 'Yui origin must remain Arakawa-ku');
assert(REALITY_ORIGIN_MOBILITY_RULES.yui.currentModernHomeBase === 'ARAKAWA_KU', 'Yui modern home base must remain Arakawa-ku');
assert(!REALITY_ORIGIN_MOBILITY_RULES.yui.shinjukuAssignment, 'Yui must not be assigned to Shinjuku');
assert(REALITY_ORIGIN_MOBILITY_RULES.shinjukuModernCharacterSlot.requiredEventually, 'Shinjuku present-day character slot must remain requested');
assert(REALITY_ORIGIN_MOBILITY_RULES.shinjukuModernCharacterSlot.yuiForbidden, 'Shinjuku slot must forbid Yui');
assert(!REALITY_ORIGIN_MOBILITY_RULES.birthplaceMustEqualIncidentLocation, 'birthplace must not be forced to equal incident location');
assert(REALITY_ORIGIN_MOBILITY_RULES.relocationReasonRequiredWhenDifferent, 'relocation reason must be required when locations differ');
assert(REALITY_ORIGIN_MOBILITY_RULES.validMobilityReasons.length >= 8, 'mobility reason vocabulary too narrow');

assert(REALITY_ORIGIN_MOBILITY_RULES.dialect.dialectMayBeHidden, 'hidden dialect must remain allowed');
assert(!REALITY_ORIGIN_MOBILITY_RULES.dialect.constantDialectRequired, 'constant dialect must not be required');
assert(REALITY_ORIGIN_MOBILITY_RULES.dialect.leakTriggers.includes('FAMILY'), 'family dialect leak trigger missing');
assert(REALITY_ORIGIN_MOBILITY_RULES.dialect.leakTriggers.includes('ANGER'), 'anger dialect leak trigger missing');
assert(REALITY_ORIGIN_MOBILITY_RULES.dialect.leakTriggers.includes('INTIMACY'), 'intimacy dialect leak trigger missing');
assert(!REALITY_ORIGIN_MOBILITY_RULES.dialect.dialectEqualsTruthSerum, 'dialect must not equal truth serum');
assert(!REALITY_ORIGIN_MOBILITY_RULES.dialect.dialectMayBeMockedByNarrative, 'dialect must not be a narrative mock target');

assert(!REALITY_ORIGIN_MOBILITY_RULES.brownSkin.equalsForeignOrigin, 'brown skin must not imply foreign origin');
assert(!REALITY_ORIGIN_MOBILITY_RULES.brownSkin.equalsPersonality, 'brown skin must not imply personality');
assert(REALITY_ORIGIN_MOBILITY_RULES.brownSkin.currentFutureCandidates.length >= 2, 'brown-skin candidate count must remain 2+');

assert(CROSS_ERA_LINEAGE_MEMORY_RULES.relationCanCrossRealityEras, 'cross-era relationships must remain allowed');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.normalWakingExplicitDreamMemoryLost, 'normal Waking must keep explicit Dream memory loss');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.parentChildAutomaticallyRecognizeEachOtherInRealityAfterNormalWaking, 'parent/child must not automatically recognize Dream relation after normal Waking');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.descendantAutomaticallyRemembersAncestorDreamMeeting, 'descendant must not automatically remember ancestor Dream meeting');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.implicitChangesMayRemain, 'implicit Dream changes must remain possible');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.resolutionWakingCanRecoverImportantMemory, 'resolution Waking memory recovery must remain possible');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.physicalMorningRequiredForMemoryReturn, 'physical morning must not be required for memory return');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.highValueRelationTypes.includes('PARENT_CHILD'), 'parent-child relation lane missing');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.highValueRelationTypes.includes('FRIEND_DESCENDANT'), 'friend-descendant relation lane missing');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.highValueRelationTypes.includes('OBJECT_CHAIN'), 'object-chain relation lane missing');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.highValueRelationTypes.includes('PLACE_CHAIN'), 'place-chain relation lane missing');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.bloodlineMustExplainMainMystery, 'bloodline must not explain Main Mystery by default');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.majorityMainCastSecretlyRelatedForbidden, 'majority-secretly-related guard must remain true');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.unrelatedDreamFriendshipsMustRemainAbundant, 'unrelated Dream friendships must remain abundant');
assert(CROSS_ERA_LINEAGE_MEMORY_RULES.medicalCognitiveDeclineMayNotBeAutoInferredFromDreamResidue, 'Dream residue must not auto-imply medical cognitive decline');

assert(originBible.includes('ユイ = 東京都荒川区の下町育ち'), 'origin bible must preserve Yui Arakawa decision');
assert(originBible.includes('新宿には現代Characterを置く。Yuiにはしない'), 'origin bible must preserve non-Yui Shinjuku slot');
assert(atlas.includes('東京都荒川区') && atlas.includes('出身地 = 事件発生地'), 'atlas must preserve Arakawa and birthplace/incident separation');
assert(atlas.includes('進学') && atlas.includes('就職') && atlas.includes('転勤'), 'atlas must include plausible mobility reasons');
assert(lineage.includes('Normal Waking') && lineage.includes('Resolution Waking'), 'lineage bible must preserve both normal and resolution Waking');
assert(lineage.includes('怖い / 変な人') || lineage.includes('怖い / 変な人だと思ってた'), 'lineage bible must preserve child misread pattern');
assert(lineage.includes('physical morningではなくResolution Waking'), 'lineage bible must resolve morning wording through Waking');
assert(lineage.includes('主要castの過半数を互いの親族へしない'), 'lineage bible must forbid genealogy overload');
assert(global.includes('Globalize understanding, not erase Japanese specificity'), 'globalization rule must preserve Japanese specificity');
assert(global.includes('Satire target hierarchy'), 'global satire target hierarchy missing');
assert(global.includes('Dialect localization') || global.includes('dialect'), 'global localization must cover dialect handling');

assert(!REALITY_ORIGIN_MOBILITY_RULES.runtimeAutoPromotionAllowed, 'origin rules may not auto-promote runtime');
assert(!CROSS_ERA_LINEAGE_MEMORY_RULES.runtimeAutoPromotionAllowed, 'lineage rules may not auto-promote runtime');
assert(!realityOriginLineageSummary.runtimeAutoPromotionAllowed, 'origin/lineage summary may not auto-promote runtime');

console.log(JSON.stringify({
  current21: realityOriginLineageSummary.current21Count,
  future15: realityOriginLineageSummary.future15Count,
  total: realityOriginLineageSummary.totalBackstageCharacterCount,
  yuiArakawa: realityOriginLineageSummary.yuiArakawaLocked,
  relationTypes: realityOriginLineageSummary.lineageRelationTypeCount,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
