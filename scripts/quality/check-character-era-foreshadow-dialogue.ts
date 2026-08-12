import fs from 'node:fs';
import {
  CHARACTER_ERA_RESERVOIR_RULES,
  CHARACTER_ERA_FORESHADOW_DIALOGUE,
  characterEraReservoirSummary,
} from '../../src/game/data/characterEraForeshadowDialogueReservoir.ts';
import { CHARACTER_REALITY_ROOTS } from '../../src/game/data/characterRealityRootRegistry.ts';
import { CURRENT21_SEASON_ASSIGNMENTS, FUTURE15_SEASON_ASSIGNMENTS } from '../../src/game/data/seasonArchitecture.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(CHARACTER_ERA_RESERVOIR_RULES.status === 'AUTHOR_CANDIDATE_NON_CANON_EXCEPT_UPSTREAM_LOCKS', 'era reservoir status drift');
assert(!CHARACTER_ERA_RESERVOIR_RULES.exactYearFrozen, 'exact year must remain open');
assert(!CHARACTER_ERA_RESERVOIR_RULES.exactAgeFrozen, 'exact age must remain open');
assert(!CHARACTER_ERA_RESERVOIR_RULES.dreamAppearanceEqualsRealityGeneration, 'Dream appearance may not equal Reality generation');
assert(!CHARACTER_ERA_RESERVOIR_RULES.future15MeansFutureEra, 'Future15 must not be treated as future-era label');
assert(!CHARACTER_ERA_RESERVOIR_RULES.tomoriYuiOfficialConstellationListDiffAllowed, 'Tomori/Yui false official-list difference returned');
assert(!CHARACTER_ERA_RESERVOIR_RULES.obsoleteConstellationMeansEvil, 'obsolete constellation may not mean evil');
assert(!CHARACTER_ERA_RESERVOIR_RULES.runtimeAutoPromotionAllowed, 'era reservoir may not auto-promote runtime');

assert(characterEraReservoirSummary.total === 36, `expected 36 era entries, got ${characterEraReservoirSummary.total}`);
assert(characterEraReservoirSummary.uniqueIds === 36, 'era IDs must be unique');
assert(characterEraReservoirSummary.current21 === 21, 'Current21 era coverage drift');
assert(characterEraReservoirSummary.future15 === 15, 'Future15 era coverage drift');
assert(characterEraReservoirSummary.future15FarFutureCount === 2, 'Future15 must not collapse into future era; only upstream Noa/Rum are far-future here');

const eraIds = new Set(CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => entry.id));
const rootIds = new Set(CHARACTER_REALITY_ROOTS.map((entry) => entry.id));
const seasonIds = new Set([...CURRENT21_SEASON_ASSIGNMENTS, ...FUTURE15_SEASON_ASSIGNMENTS].map((entry) => entry.id));
assert([...eraIds].every((id) => rootIds.has(id)), 'era reservoir contains ID missing from Reality Root registry');
assert([...rootIds].every((id) => eraIds.has(id)), 'Reality Root registry contains ID missing from era reservoir');
assert([...seasonIds].every((id) => eraIds.has(id)), 'season architecture contains ID missing from era reservoir');

const byId = new Map(CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => [entry.id, entry]));
for (const id of ['tomori','michiru','nagi','yui','asa','noa','rum']) {
  assert(byId.get(id)?.assignmentStatus === 'UPSTREAM_CURRENT', `upstream Current era must be preserved: ${id}`);
}
assert(byId.get('asa')?.lane === 'FAR_FUTURE_IDENTITY_COEXISTENCE', 'Asa far-future Current drift');
assert(byId.get('noa')?.lane === 'FAR_FUTURE_IDENTITY_COEXISTENCE', 'Noa far-future derived drift');
assert(byId.get('rum')?.lane === 'FAR_FUTURE_IDENTITY_COEXISTENCE', 'Rum far-future derived drift');
assert(byId.get('chloe')?.lane === 'CROSS_ERA_LONG_LIVED', 'Chloe cross-era OPEN boundary drift');
assert(byId.get('chloe')?.assignmentStatus === 'OPEN_SPECIAL', 'Chloe exact chronology must remain special/open');
assert(byId.get('ritsu')?.lane === byId.get('koyori')?.lane, 'Ritsu/Koyori household-era lane mismatch');
assert(byId.get('kai')?.lane === byId.get('nao')?.lane, 'Kai/Nao twin-era lane mismatch');
assert(byId.get('shiro')?.foreshadowSeeds.some((seed) => seed.includes('Quadrans Muralis')), 'Shiro Quadrans clue missing');
assert(byId.get('tomori')?.forbiddenShortcut.includes('official IAU 88'), 'Tomori constellation-history guard missing');
assert(byId.get('yomo')?.forbiddenShortcut.includes('Felis'), 'Yomo/Felis ownership guard missing');

for (const entry of CHARACTER_ERA_FORESHADOW_DIALOGUE) {
  assert(entry.reason.length > 20, `era reason too thin: ${entry.id}`);
  assert(entry.evidenceSeeds.length >= 1, `era evidence missing: ${entry.id}`);
  assert(entry.foreshadowSeeds.length >= 1, `foreshadow seed missing: ${entry.id}`);
  assert(entry.dialogueSeeds.length >= 1, `dialogue seed missing: ${entry.id}`);
  assert(entry.forbiddenShortcut.length > 20, `forbidden shortcut too thin: ${entry.id}`);
}

const doc = fs.readFileSync('docs/character-era-foreshadow-dialogue-reservoir-v1.md', 'utf8');
for (const token of [
  'Future15` ≠ 未来時代の15人',
  'Dreamの見た目年齢 ≠ Reality同世代',
  'TomoriとPresent Yuiの公式IAU 88星座一覧が年代だけで違う、は引き続き禁止',
  '朔夜座 / 群青残響録の意味をEra配置から変更しない',
  'Quadrantid name fossil',
  'Tomori repair mark → Yui object',
  'Nagi privacy → Asa name/personhood',
]) assert(doc.includes(token), `era reservoir doc guard missing: ${token}`);

console.log(JSON.stringify({
  characters: 36,
  current21: 21,
  future15: 15,
  farFutureFuture15: 2,
  chloe: 'CROSS_ERA_LONG_LIVED_OPEN',
  exactYearsFrozen: false,
  canonAutoPromotion: false,
}, null, 2));
