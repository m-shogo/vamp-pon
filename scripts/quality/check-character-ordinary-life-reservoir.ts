import fs from 'node:fs';
import { CURRENT21_SEASON_ASSIGNMENTS, FUTURE15_SEASON_ASSIGNMENTS } from '../../src/game/data/seasonArchitecture.ts';
import {
  CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES,
  CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX,
  characterOrdinaryLifeReservoirSummary,
} from '../../src/game/data/characterOrdinaryLifeReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-personal-profile-canon-v1.md',
  'docs/character-reality-root-registry-v1.md',
  'docs/character-ordinary-life-reservoir-v1.md',
  'src/game/data/seasonArchitecture.ts',
  'src/game/data/characterOrdinaryLifeReservoir.ts',
]) assert(fs.existsSync(path), `missing ordinary-life source: ${path}`);

assert(CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'ordinary-life data must remain reservoir');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.reservoirInclusionEqualsCanon, 'reservoir inclusion cannot equal Canon');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.reservoirInclusionEqualsRuntimePlayable, 'reservoir inclusion cannot equal playable');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.future15ReservoirInclusionPromotesRoster, 'Future15 reservoir inclusion cannot promote roster');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.exactDialectVocabularyFrozenHere, 'dialect vocabulary must remain unfrozen here');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.exactRealityOriginFrozenHere, 'Reality origin cannot be frozen by reservoir');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.exactFamilyRelationFrozenHere, 'family relation cannot be frozen by reservoir');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.exactRomanceRelationFrozenHere, 'romance relation cannot be frozen by reservoir');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.animalBehaviorEqualsTruthDetector, 'animal behavior cannot become truth detector');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.angerRevealEqualsTrueSelf, 'anger/dialect leak cannot equal true-self proof');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.apologyEqualsForgiveness, 'apology cannot equal forgiveness');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.partyAttendanceEqualsAbsolution, 'Party attendance cannot equal absolution');
assert(!CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES.runtimeAutoPromotionAllowed, 'ordinary-life reservoir may not auto-promote runtime');

assert(characterOrdinaryLifeReservoirSummary.total === 36, 'ordinary-life reservoir must cover 36 characters');
assert(characterOrdinaryLifeReservoirSummary.current21 === 21, 'ordinary-life reservoir must cover Current21 21/21');
assert(characterOrdinaryLifeReservoirSummary.future15 === 15, 'ordinary-life reservoir must cover Future15 15/15');
assert(characterOrdinaryLifeReservoirSummary.uniqueIds === 36, 'ordinary-life reservoir profile IDs must be unique');
assert(characterOrdinaryLifeReservoirSummary.uniqueNames === 36, 'ordinary-life reservoir names must be unique');
assert(!characterOrdinaryLifeReservoirSummary.future15Promoted, 'Future15 may not be promoted');
assert(!characterOrdinaryLifeReservoirSummary.runtimeAutoPromotionAllowed, 'summary may not auto-promote runtime');

const currentNames = new Set(CURRENT21_SEASON_ASSIGNMENTS.map((entry) => entry.name));
const futureNames = new Set(FUTURE15_SEASON_ASSIGNMENTS.map((entry) => entry.name));
const indexedCurrentNames = new Set(CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.filter((entry) => entry.roster === 'CURRENT21').map((entry) => entry.name));
const indexedFutureNames = new Set(CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.filter((entry) => entry.roster === 'FUTURE15').map((entry) => entry.name));
assert(indexedCurrentNames.size === currentNames.size && [...currentNames].every((name) => indexedCurrentNames.has(name)), 'Current21 name coverage drift');
assert(indexedFutureNames.size === futureNames.size && [...futureNames].every((name) => indexedFutureNames.has(name)), 'Future15 name coverage drift');

const doc = fs.readFileSync('docs/character-ordinary-life-reservoir-v1.md', 'utf8');
assert(doc.includes('AUTHOR RESERVOIR / NON-CANON EXCEPT EXPLICIT UPSTREAM FACTS / FREE TO OVERWRITE'), 'ordinary-life doc must remain overwrite-friendly reservoir');
assert(doc.includes('作者DBには多く持つ。本編では必要な1〜2割だけ見せる。'), 'ordinary-life author DB principle missing');

const headings = [...doc.matchAll(/^## (\d{2}) (.+?) `[^`]+`$/gm)];
assert(headings.length === 36, `ordinary-life character heading count drift: ${headings.length}`);

for (let i = 0; i < CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.length; i += 1) {
  const entry = CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX[i];
  const heading = `## ${String(i + 1).padStart(2, '0')} ${entry.name} \`${entry.id}\``;
  assert(doc.includes(heading), `missing ordinary-life section: ${entry.name}/${entry.id}`);
  const start = doc.indexOf(heading);
  const next = i + 1 < CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.length
    ? doc.indexOf(`## ${String(i + 2).padStart(2, '0')} `, start + heading.length)
    : doc.indexOf('# 3. Cross-era comedy reservoir', start + heading.length);
  const section = doc.slice(start, next > start ? next : undefined).toLowerCase();
  for (const keyword of ['food', 'anger', 'kindness', 'fatigue', 'object', 'apology']) {
    assert(section.includes(keyword), `ordinary-life section missing ${keyword}: ${entry.name}`);
  }
}

const master = fs.readFileSync('docs/00-current-story-world-master.md', 'utf8');
assert(master.includes('ユイのReality rootを荒川区以外へ勝手に移す'), 'Yui Arakawa boundary missing from World Master');
assert(master.includes('ユイの代表Foodを焼きおにぎりへ戻す'), 'Yui superseded food guard missing from World Master');
assert(master.includes('S1キャストを「事件が日本だから全員日本生まれ / 日本国籍」に限定する'), 'foreign-origin cast guard missing');
assert(doc.includes('Reality root = 東京都荒川区'), 'ordinary-life reservoir must preserve Yui Arakawa root');
assert(doc.includes('1990年代生まれ世代'), 'ordinary-life reservoir must preserve Yui generation');
assert(doc.includes('もんじゃ焼き / たい焼き / 大判焼き'), 'ordinary-life reservoir must preserve Yui current representative foods');
assert(doc.includes('- **Human**'), 'ordinary-life reservoir must preserve Asa as Human');
assert(doc.includes('## 27 クウ `kuu`') && doc.includes('- dog'), 'Kuu dog boundary missing');
assert(doc.includes('## 28 ヨモ `yomo`') && doc.includes('- animal / likely cat household lane'), 'Yomo animal lane missing');
assert(doc.includes('Future15へ追加するmicro scenesは**Current21昇格を意味しない**'), 'Future15 non-promotion prose guard missing');

console.log(JSON.stringify({
  current21: characterOrdinaryLifeReservoirSummary.current21,
  future15: characterOrdinaryLifeReservoirSummary.future15,
  total: characterOrdinaryLifeReservoirSummary.total,
  uniqueNames: characterOrdinaryLifeReservoirSummary.uniqueNames,
  headings: headings.length,
  future15Promoted: false,
  canonPromotion: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
