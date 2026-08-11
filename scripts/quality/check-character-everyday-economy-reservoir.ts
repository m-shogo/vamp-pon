import fs from 'node:fs';
import {
  CHARACTER_EVERYDAY_ECONOMY_AXES,
  CHARACTER_EVERYDAY_ECONOMY_RESERVOIR,
  CHARACTER_EVERYDAY_ECONOMY_RULES,
  characterEverydayEconomySummary,
} from '../../src/game/data/characterEverydayEconomyReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-everyday-economy-reservoir-v1.md',
  'src/game/data/characterEverydayEconomyReservoir.ts',
  'src/game/data/characterLivedArtifactReservoir.ts',
] as const) assert(fs.existsSync(path), `missing everyday-economy prerequisite: ${path}`);

assert(CHARACTER_EVERYDAY_ECONOMY_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'economy status drift');
assert(CHARACTER_EVERYDAY_ECONOMY_RULES.characterCoverageRequired === 36, 'economy character target drift');
assert(CHARACTER_EVERYDAY_ECONOMY_RULES.axesPerCharacterRequired === 7, 'economy axis target drift');
assert(CHARACTER_EVERYDAY_ECONOMY_RULES.totalAnchorCountRequired === 252, 'economy anchor target drift');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.exactIncomeOrClassFrozenHere, 'income/class may not freeze here');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.generosityDefinesMorality, 'generosity may not define morality');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.frugalityDefinesPoverty, 'frugality may not define poverty');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.spendingDefinesClass, 'spending may not define class');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.eraDeterminesScarcityPersonality, 'Era may not define scarcity personality');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.originDeterminesMoneyHabit, 'origin may not define money habit');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.genderOrSexualityDeterminesShoppingHabit, 'gender/sexuality may not define shopping habit');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.disabilityDeterminesDependency, 'disability may not define dependency');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.animalOwnsHumanCurrencyByDefault, 'animals may not own Human currency by default');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.futureEconomyModelFrozenHere, 'Future economy model may not freeze here');
assert(!CHARACTER_EVERYDAY_ECONOMY_RULES.runtimeCurrencyBehaviorAutoPromoted, 'economy may not auto-promote runtime currency behavior');

const expectedIds = [
  'yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren',
  'hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane',
] as const;

assert(CHARACTER_EVERYDAY_ECONOMY_AXES.length === 7, `expected 7 economy axes, got ${CHARACTER_EVERYDAY_ECONOMY_AXES.length}`);
assert(new Set(CHARACTER_EVERYDAY_ECONOMY_AXES).size === 7, 'economy axes must be unique');
assert(CHARACTER_EVERYDAY_ECONOMY_RESERVOIR.length === 36, `expected 36 economy characters, got ${CHARACTER_EVERYDAY_ECONOMY_RESERVOIR.length}`);
assert(characterEverydayEconomySummary.characterCount === 36, 'economy summary character drift');
assert(characterEverydayEconomySummary.uniqueIds === 36, 'economy IDs must be unique');
assert(characterEverydayEconomySummary.anchorCount === 252, `expected 252 economy anchors, got ${characterEverydayEconomySummary.anchorCount}`);
assert(characterEverydayEconomySummary.fullyCoveredCount === 36, `all 36 require all 7 economy axes, got ${characterEverydayEconomySummary.fullyCoveredCount}`);
assert(!characterEverydayEconomySummary.runtimeCurrencyBehaviorAutoPromoted, 'economy summary may not auto-promote runtime');

const actualIds = new Set(CHARACTER_EVERYDAY_ECONOMY_RESERVOIR.map((entry)=>entry.id));
for (const id of expectedIds) assert(actualIds.has(id), `missing economy character: ${id}`);
for (const entry of CHARACTER_EVERYDAY_ECONOMY_RESERVOIR) {
  assert(Object.keys(entry.anchors).length === 7, `${entry.id} must have exactly 7 economy anchors`);
  for (const axis of CHARACTER_EVERYDAY_ECONOMY_AXES) assert(entry.anchors[axis].trim().length >= 12, `${entry.id}.${axis} is too thin`);
}

const byId = new Map(CHARACTER_EVERYDAY_ECONOMY_RESERVOIR.map((entry)=>[entry.id,entry]));
assert(byId.get('tomori')?.anchors.PURCHASE_DECISION.includes('OWNER_PREFERENCE_SAFETY_AND LABOR'), 'Tomori repair economy must not become poverty shorthand');
assert(byId.get('koyori')?.anchors.SHARED_EXPENSE.includes('WITHOUT FORCING ADULT_FINANCIAL_RESPONSIBILITY'), 'Koyori may not bear adult financial responsibility');
assert(byId.get('gen')?.anchors.PRICE_ATTENTION.includes('WITHOUT USING_IT_AS PROOF_CURRENT_PRICE_IS_WRONG'), 'Gen old price memory may not invalidate current price by age authority');
assert(byId.get('hana')?.anchors.SHARED_EXPENSE.includes('WITHOUT MOTHERLY_UNPAID_LABOR_DEFAULT'), 'Hana may not receive motherly unpaid-labor default');
assert(byId.get('kage1')?.anchors.PRICE_ATTENTION.includes('WITHOUT BODY_SHAME'), 'Kaname body fit costs may not become body shame');
assert(byId.get('hiyori')?.anchors.PURCHASE_DECISION.includes('WITHOUT IMPULSIVE_GYARU_STEREOTYPE'), 'Hiyori spending may not become gyaru stereotype');
assert(byId.get('touma')?.anchors.PRICE_ATTENTION.includes('WITHOUT SKIN_OR_SEXUALITY_CODE'), 'Touma money habit may not derive from skin/sexuality');
assert(byId.get('suzu')?.anchors.PRICE_ATTENTION.includes('WITHOUT FEMININE_SPENDING_STEREOTYPE'), 'Suzu money habit may not derive from feminine presentation');
assert(byId.get('io')?.anchors.BORROW_LEND.includes('WITHOUT USING_OBJECT_CHOICE_AS GENDER_CLUE'), 'Io object/economy choices may not become gender clue');
assert(byId.get('amane')?.anchors.SHARED_EXPENSE.includes('SHOULD_NOT AUTOMATICALLY BE CHARGED_ONLY_TO DISABLED_PERSON'), 'Amane accessibility cost may not be assigned only to disabled person');
assert(byId.get('kuu')?.anchors.PRICE_ATTENTION.includes('DOG_DOES_NOT UNDERSTAND HUMAN_PRICE'), 'Kuu may not understand Human currency by default');
assert(byId.get('yomo')?.anchors.PRICE_ATTENTION.includes('CAT_DOES_NOT UNDERSTAND HUMAN_PRICE'), 'Yomo may not understand Human currency by default');
assert(byId.get('noa')?.anchors.PURCHASE_DECISION.includes('FUTURE_RESOURCE_ACCESS_MODEL_REMAINS_OPEN'), 'Noa future economy must remain open');
assert(byId.get('rum')?.anchors.SHARED_EXPENSE.includes('CANNOT DEFINE WHICH_INSTANCE_DESERVES_EXISTENCE'), 'Rum maintenance cost may not define worth of existence');
assert(byId.get('kai')?.anchors.PURCHASE_DECISION !== byId.get('nao')?.anchors.PURCHASE_DECISION, 'Kai/Nao economy habits must remain individual');

const doc = fs.readFileSync('docs/character-everyday-economy-reservoir-v1.md','utf8');
for (const token of [
  'AUTHOR RESERVOIR / NON-CANON / NO INCOME-CLASS FREEZE / NO MORAL MONEY SCORE',
  '36 characters × 7 axes = 252 everyday-economy anchors',
  'money habit != morality != class != intelligence',
  '平等なsplitと公平なsplitは同じとは限らない。',
  'repair culture != poverty personality',
  'runtimeCurrencyBehaviorAutoPromoted = false',
  '何を買うかより、「何を価値だと思い、誰とどう分け、間違えた時どう払い直すか」にCharacterが出る。',
]) assert(doc.includes(token), `economy doc guard missing: ${token}`);

console.log(JSON.stringify({ characters:36, axes:7, anchors:252, exactIncomeFrozen:false, moralityScoredByMoney:false, futureEconomyFrozen:false, runtimeCurrencyBehaviorAutoPromoted:false }, null, 2));
