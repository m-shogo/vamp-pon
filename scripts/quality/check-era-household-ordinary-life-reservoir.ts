import fs from 'node:fs';
import { CORE5_ERA_ASSIGNMENTS, CORE5_ERA_CANON } from '../../src/game/data/core5EraCanon.ts';
import {
  ERA_HOUSEHOLD_ORDINARY_LIFE_RULES,
  ERA_HOUSEHOLD_LENS_IDS,
  ERA_HOUSEHOLD_ORDINARY_LIFE_INDEX,
  eraHouseholdOrdinaryLifeSummary,
} from '../../src/game/data/eraHouseholdOrdinaryLifeReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/core5-era-character-master-v1.md',
  'docs/era-family-generation-lens-v1.md',
  'docs/era-major-incident-family-lens-atlas-v1.md',
  'docs/era-satire-cross-generation-dialogue-bible-v1.md',
  'docs/era-household-ordinary-life-reservoir-v1.md',
  'src/game/data/core5EraCanon.ts',
  'src/game/data/eraHouseholdOrdinaryLifeReservoir.ts',
]) assert(fs.existsSync(path), `missing Era household source: ${path}`);

assert(ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'Era household layer must remain reservoir');
assert(ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.eraCountRequired === 5, 'Era household target must remain 5 Eras');
assert(ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.lensCountPerEraRequired === 6, 'Era household lens target must remain 6 per Era');
assert(ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.sceneSeedsPerLensRequired === 4, 'Era household seeds per lens must remain 4');
assert(ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.totalSceneSeedCountRequired === 120, 'Era household seed target must remain 120');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.exactYearFrozenHere, 'exact year may not be frozen by reservoir');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.exactCore5RelativeFrozenHere, 'Core5 relatives may not be frozen by reservoir');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.exactHouseholdTypeFrozenForCore5Here, 'Core5 household type may not be frozen here');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.exactParentOccupationFrozenHere, 'parent occupation may not be frozen here');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.exactDialectVocabularyFrozenHere, 'dialect vocabulary may not be frozen here');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.exactHistoricalEventFrozenHere, 'historical event may not be frozen here');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.currentEraMeansCorrect, 'Present may not equal correct');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.futureEraMeansSuperior, 'Future may not equal superior');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.olderEraMeansIgnorant, 'older Era may not equal ignorant');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.childMeansMoralOracle, 'child may not become moral oracle');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.motherMeansHouseworkOnly, 'mother may not be housework-only');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.fatherMeansWorkOnly, 'father may not be work-only');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.grandparentMeansWisdomOnly, 'grandparent may not be wisdom-only');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.nonparentAdultMeansComicReliefOnly, 'nonparent adult may not be comic-relief-only');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.realTragedyRenameCopyAllowed, 'real tragedy rename-copy must remain forbidden');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.physicalSunriseReturnsToReality, 'physical sunrise may not become Reality return');
assert(!ERA_HOUSEHOLD_ORDINARY_LIFE_RULES.runtimeAutoPromotionAllowed, 'Era household reservoir may not auto-promote runtime');

assert(CORE5_ERA_CANON.allFiveDistinctRealityErasRequired, 'Core5 must retain five distinct Reality Eras');
assert(!CORE5_ERA_CANON.exactYearsFrozen, 'Core5 exact years must remain Open');
assert(!CORE5_ERA_CANON.newerEraMeansSuperiorPerson, 'newer Era may not imply superior person');
assert(!CORE5_ERA_CANON.realHistoricalIncidentMayBeRenamedAndCopied, 'real historical incident rename-copy must remain forbidden');
assert(core5EraAssignmentsAreHumanWhereRequired(), 'Core5 Human boundaries drifted');

function core5EraAssignmentsAreHumanWhereRequired(): boolean {
  const asa = CORE5_ERA_ASSIGNMENTS.find((entry) => entry.characterId === 'asa');
  return Boolean(asa && asa.species === 'HUMAN' && asa.realityEra === 'FAR_FUTURE_HUMAN_ANDROID_ROBOT_AVATAR_SOCIETY');
}

assert(eraHouseholdOrdinaryLifeSummary.eraCount === 5, 'Era household index must cover 5 Eras');
assert(eraHouseholdOrdinaryLifeSummary.uniqueCharacterCount === 5, 'Era household Core5 IDs must be unique');
assert(eraHouseholdOrdinaryLifeSummary.uniqueEraCount === 5, 'Era household Era codes must be unique');
assert(eraHouseholdOrdinaryLifeSummary.lensCountPerEra === 6, 'Era household lens vocabulary drift');
assert(eraHouseholdOrdinaryLifeSummary.totalLensEntries === 30, 'Era household lens entry total must be 30');
assert(eraHouseholdOrdinaryLifeSummary.totalSceneSeeds === 120, `Era household scene seed count drift: ${eraHouseholdOrdinaryLifeSummary.totalSceneSeeds}`);
assert(eraHouseholdOrdinaryLifeSummary.allLensSeedsHaveFour, 'every Era/lens must have four scene seeds');
assert(!eraHouseholdOrdinaryLifeSummary.exactYearFrozenHere, 'summary may not freeze exact years');
assert(!eraHouseholdOrdinaryLifeSummary.exactCore5RelativeFrozenHere, 'summary may not freeze Core5 relatives');
assert(!eraHouseholdOrdinaryLifeSummary.runtimeAutoPromotionAllowed, 'summary may not auto-promote runtime');

const canonByCharacter = new Map(CORE5_ERA_ASSIGNMENTS.map((entry) => [entry.characterId, entry]));
assert(canonByCharacter.size === 5, 'Core5 Era Canon count drift');
for (const era of ERA_HOUSEHOLD_ORDINARY_LIFE_INDEX) {
  const canon = canonByCharacter.get(era.characterId);
  assert(canon, `unknown Core5 Era reservoir character: ${era.characterId}`);
  assert(canon.realityEra === era.eraCode, `Era reservoir code drift: ${era.characterId}`);
  assert(!canon.exactYearFrozen, `exact year unexpectedly frozen: ${era.characterId}`);
  for (const lens of ERA_HOUSEHOLD_LENS_IDS) {
    const seeds = era.lensSeeds[lens];
    assert(Array.isArray(seeds) && seeds.length === 4, `Era/lens seed count drift: ${era.characterId}/${lens}`);
    assert(new Set(seeds).size === 4, `duplicate scene seed within Era/lens: ${era.characterId}/${lens}`);
    assert(seeds.every((seed) => seed.length > 12), `scene seed too thin: ${era.characterId}/${lens}`);
  }
}

const allSeeds = ERA_HOUSEHOLD_ORDINARY_LIFE_INDEX.flatMap((era) => ERA_HOUSEHOLD_LENS_IDS.flatMap((lens) => era.lensSeeds[lens]));
assert(new Set(allSeeds).size === 120, 'all 120 Era household scene seed IDs must be unique');

const doc = fs.readFileSync('docs/era-household-ordinary-life-reservoir-v1.md', 'utf8');
assert(doc.includes('AUTHOR RESERVOIR / NON-CANON / EXACT CORE5 RELATIVES OPEN / FREE TO OVERWRITE'), 'Era household doc status drift');
assert(doc.includes('Core5本人の実親・兄弟・祖父母等を決めるものではない'), 'Core5 relative-open guard missing');
assert(doc.includes('アサ本人はHuman'), 'Asa Human guard missing from Era household doc');
assert(doc.includes('Yui = 東京都荒川区の下町育ち'), 'Yui Arakawa context missing from Present Era reservoir');
assert(doc.includes('5 Era\n× 6 household/generation lenses\n× 4 ordinary-life scene seeds\n= 120 seeds'), '120-seed completion formula missing');
assert(doc.includes('事件がなくても、その時代に住んでいる人が見える状態を作者DBへ作る。'), 'Era household author-DB principle missing');
assert(doc.includes('昔の人 = 無知') && doc.includes('現代人 = 正解') && doc.includes('Future = 上位互換'), 'generation-superiority prohibitions missing');
assert(doc.includes('physical sunriseでRealityへ戻す'), 'physical sunrise prohibition missing');
assert(doc.includes('real tragedyをrename-copy'), 'real tragedy prohibition missing');

const incidentAtlas = fs.readFileSync('docs/era-major-incident-family-lens-atlas-v1.md', 'utf8');
assert(incidentAtlas.includes('全事件は架空。実在の事件・企業・被害者を名前だけ変えて再演しない。'), 'incident atlas fictional-event boundary drift');

console.log(JSON.stringify({
  eras: eraHouseholdOrdinaryLifeSummary.eraCount,
  lensesPerEra: eraHouseholdOrdinaryLifeSummary.lensCountPerEra,
  totalLensEntries: eraHouseholdOrdinaryLifeSummary.totalLensEntries,
  ordinaryLifeSceneSeeds: eraHouseholdOrdinaryLifeSummary.totalSceneSeeds,
  exactYearsFrozen: false,
  exactCore5RelativesFrozen: false,
  asaHuman: true,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
