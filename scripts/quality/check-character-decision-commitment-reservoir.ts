import fs from 'node:fs';
import {
  CHARACTER_DECISION_COMMITMENT_AXES,
  CHARACTER_DECISION_COMMITMENT_RESERVOIR,
  CHARACTER_DECISION_COMMITMENT_RULES,
  characterDecisionCommitmentSummary,
} from '../../src/game/data/characterDecisionCommitmentReservoir.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

for (const path of ['docs/character-decision-commitment-reservoir-v1.md','src/game/data/characterDecisionCommitmentReservoir.ts'] as const) {
  assert(fs.existsSync(path), `missing decision/commitment prerequisite: ${path}`);
}

assert(CHARACTER_DECISION_COMMITMENT_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'decision/commitment status drift');
assert(CHARACTER_DECISION_COMMITMENT_RULES.characterCoverageRequired === 36, 'decision character target drift');
assert(CHARACTER_DECISION_COMMITMENT_RULES.axesPerCharacterRequired === 6, 'decision axis target drift');
assert(CHARACTER_DECISION_COMMITMENT_RULES.totalAnchorCountRequired === 216, 'decision anchor target drift');
for (const [label, value] of [
  ['indecision weakness', CHARACTER_DECISION_COMMITMENT_RULES.indecisionDefinesWeakness],
  ['decisiveness leadership', CHARACTER_DECISION_COMMITMENT_RULES.decisivenessDefinesLeadership],
  ['promise morality', CHARACTER_DECISION_COMMITMENT_RULES.promiseKeepingDefinesMorality],
  ['broken promise betrayal', CHARACTER_DECISION_COMMITMENT_RULES.brokenPromiseDefinesBetrayal],
  ['deadline affection', CHARACTER_DECISION_COMMITMENT_RULES.replyOrDeadlineDefinesAffection],
  ['identity determines commitment', CHARACTER_DECISION_COMMITMENT_RULES.ageGenderOriginBodyDisabilityDetermineCommitment],
  ['artificial perfect commitment', CHARACTER_DECISION_COMMITMENT_RULES.artificialBodyMeansPerfectCommitment],
  ['animal Human promise', CHARACTER_DECISION_COMMITMENT_RULES.animalBehaviorBecomesHumanPromise],
  ['major Canon promise freeze', CHARACTER_DECISION_COMMITMENT_RULES.exactMajorCanonPromiseFrozenHere],
  ['runtime auto promotion', CHARACTER_DECISION_COMMITMENT_RULES.runtimeAutoPromotionAllowed],
] as const) assert(!value, `${label} must remain false`);

const expectedIds=['yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren','hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane'] as const;
assert(CHARACTER_DECISION_COMMITMENT_AXES.length===6,'decision axes must be 6');
assert(new Set(CHARACTER_DECISION_COMMITMENT_AXES).size===6,'decision axes must be unique');
assert(CHARACTER_DECISION_COMMITMENT_RESERVOIR.length===36,'decision characters must be 36');
assert(characterDecisionCommitmentSummary.characterCount===36,'decision summary character drift');
assert(characterDecisionCommitmentSummary.uniqueIds===36,'decision IDs must be unique');
assert(characterDecisionCommitmentSummary.anchorCount===216,`expected 216 decision anchors, got ${characterDecisionCommitmentSummary.anchorCount}`);
assert(characterDecisionCommitmentSummary.fullyCoveredCount===36,'all 36 need 6 decision axes');
const actual=new Set(CHARACTER_DECISION_COMMITMENT_RESERVOIR.map((entry)=>entry.id));
for(const id of expectedIds) assert(actual.has(id),`missing decision character: ${id}`);
for(const entry of CHARACTER_DECISION_COMMITMENT_RESERVOIR){
  assert(Object.keys(entry.anchors).length===6,`${entry.id} must have 6 decision axes`);
  for(const axis of CHARACTER_DECISION_COMMITMENT_AXES) assert(entry.anchors[axis].trim().length>=12,`${entry.id}.${axis} too thin`);
}

const byId=new Map(CHARACTER_DECISION_COMMITMENT_RESERVOIR.map((entry)=>[entry.id,entry]));
assert(byId.get('koyori')?.anchors.COMMITMENT_THRESHOLD.includes('ADULT_SUPPORT_NOT ADULT_DUTY'),'Koyori must not bear adult promise duty');
assert(byId.get('gen')?.anchors.CHANGE_MIND.includes('WITHOUT HUMILIATION'),'Gen must be allowed to update without age humiliation');
assert(byId.get('hana')?.anchors.BROKEN_PROMISE_REPAIR.includes('WITHOUT FORCING_FOOD_GIFT_OR EXTRA_CARE'),'Hana apology must not default to care labor');
assert(byId.get('kage1')?.anchors.COMMITMENT_THRESHOLD.includes('OWN_FATIGUE'),'Kaname commitment must include own capacity');
assert(byId.get('hiyori')?.anchors.SHARED_AGREEMENT.includes('BUDGET_TIME_VISIBILITY'),'Hiyori shared agreement guard missing');
assert(byId.get('touma')?.anchors.BROKEN_PROMISE_REPAIR.includes('WITHOUT USING BLUNTNESS_SKIN_OR_SEXUALITY'),'Touma identity must not excuse commitment repair');
assert(byId.get('suzu')?.anchors.CHANGE_MIND.includes('WITHOUT INVALIDATING PRIOR_SELF'),'Suzu change of presentation/plan may not invalidate prior self');
assert(byId.get('io')?.anchors.COMMITMENT_THRESHOLD.includes('IDENTITY_CATEGORY_STILL_OPEN'),'Io can commit while identity category remains open');
assert(byId.get('amane')?.anchors.COMMITMENT_THRESHOLD.includes('WITHOUT MAKING INDEPENDENCE_A_TEST'),'Amane commitment must not become independence test');
assert(byId.get('noa')?.anchors.DEADLINE_HANDLING.includes('DOES_NOT CREATE INSTANT_DECISION'),'Noa processing speed may not force instant decision');
assert(byId.get('rum')?.anchors.SHARED_AGREEMENT.includes('DOES_NOT MEAN ALL_INSTANCES_CONSENT'),'Rum shared memory may not equal shared consent');
assert(byId.get('kuu')?.anchors.BROKEN_PROMISE_REPAIR.includes('NOT_APPLICABLE_AS HUMAN_PROMISE'),'Kuu may not receive Human promise morality');
assert(byId.get('yomo')?.anchors.BROKEN_PROMISE_REPAIR.includes('NOT_APPLICABLE_AS HUMAN_PROMISE'),'Yomo may not receive Human promise morality');
assert(byId.get('kai')?.anchors.SHARED_AGREEMENT !== byId.get('nao')?.anchors.SHARED_AGREEMENT,'Kai/Nao must not share twin consent model');

const doc=fs.readFileSync('docs/character-decision-commitment-reservoir-v1.md','utf8');
for(const token of [
  'AUTHOR RESERVOIR / NON-CANON / NO LOYALTY-MORALITY SCORE / FREE TO OVERWRITE',
  '36 characters × 6 axes = 216 decision/commitment anchors',
  'commitment != morality != affection != obedience',
  'Broken promise is not automatic betrayal',
  'runtimeAutoPromotionAllowed = false',
  '信頼は「一度も約束を破らないこと」だけではなく、約束を変えざるを得ない時に相手を置き去りにしないことでも育つ。',
]) assert(doc.includes(token),`decision doc guard missing: ${token}`);

console.log(JSON.stringify({characters:36,axes:6,anchors:216,majorCanonPromiseFrozen:false,runtimeAutoPromotionAllowed:false},null,2));
