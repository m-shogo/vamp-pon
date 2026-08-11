import fs from 'node:fs';
import {
  CHARACTER_MEMORY_REMEMBERING_RULES,
  CHARACTER_MEMORY_REMEMBERING_AXES,
  CHARACTER_MEMORY_REMEMBERING_RESERVOIR,
  characterMemoryRememberingSummary,
} from '../../src/game/data/characterMemoryRememberingReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(CHARACTER_MEMORY_REMEMBERING_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'memory reservoir status drift');
assert(CHARACTER_MEMORY_REMEMBERING_RULES.characterCoverageRequired === 36, 'memory character target drift');
assert(CHARACTER_MEMORY_REMEMBERING_RULES.axesPerCharacterRequired === 6, 'memory axes target drift');
assert(CHARACTER_MEMORY_REMEMBERING_RULES.totalAnchorCountRequired === 216, 'memory anchor target drift');
assert(!CHARACTER_MEMORY_REMEMBERING_RULES.memoryAccuracyDefinesMorality, 'memory accuracy may not define morality');
assert(!CHARACTER_MEMORY_REMEMBERING_RULES.memoryStyleDefinesIntelligence, 'memory style may not define intelligence');
assert(!CHARACTER_MEMORY_REMEMBERING_RULES.ageDefinesMemoryDecline, 'age may not define memory decline');
assert(!CHARACTER_MEMORY_REMEMBERING_RULES.traumaOrDiagnosisInferredFromForgetting, 'forgetting may not infer trauma/diagnosis');
assert(!CHARACTER_MEMORY_REMEMBERING_RULES.artificialMemoryMeansPerfectRecallOrLessPersonhood, 'artificial memory may not imply perfect recall/personhood rank');
assert(!CHARACTER_MEMORY_REMEMBERING_RULES.animalMemoryBecomesHumanTestimony, 'animal memory may not become Human testimony');
assert(!CHARACTER_MEMORY_REMEMBERING_RULES.exactCanonMemoryFrozenHere, 'reservoir may not freeze Canon memories');
assert(!CHARACTER_MEMORY_REMEMBERING_RULES.runtimeAutoPromotionAllowed, 'memory reservoir may not auto-promote runtime');

const expectedAxes = [
  'REMEMBERING_ENTRY',
  'EXTERNAL_MEMORY_AID',
  'FORGETTING_RESPONSE',
  'DISAGREED_MEMORY',
  'MEMORY_SHARING_BOUNDARY',
  'LETTING_GO',
] as const;
assert(JSON.stringify(CHARACTER_MEMORY_REMEMBERING_AXES) === JSON.stringify(expectedAxes), 'memory axes drift');

const expectedIds = [
  'yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori',
  'kage1','kage2','kage3','kage4','ren','hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane',
] as const;

assert(CHARACTER_MEMORY_REMEMBERING_RESERVOIR.length === 36, 'memory reservoir must cover 36 characters');
assert(characterMemoryRememberingSummary.characterCount === 36, 'memory summary character count drift');
assert(characterMemoryRememberingSummary.uniqueIds === 36, 'memory IDs must be unique');
assert(characterMemoryRememberingSummary.anchorCount === 216, 'memory anchor count must be 216');
assert(characterMemoryRememberingSummary.fullyCoveredCount === 36, 'all 36 must cover every memory axis');
assert(!characterMemoryRememberingSummary.runtimeAutoPromotionAllowed, 'memory summary may not auto-promote runtime');
assert(JSON.stringify(CHARACTER_MEMORY_REMEMBERING_RESERVOIR.map((entry)=>entry.id)) === JSON.stringify(expectedIds), 'memory roster/stable ID order drift');

for (const entry of CHARACTER_MEMORY_REMEMBERING_RESERVOIR) {
  assert(Object.keys(entry.anchors).length === 6, `memory axis count drift: ${entry.id}`);
  for (const axis of CHARACTER_MEMORY_REMEMBERING_AXES) {
    assert(typeof entry.anchors[axis] === 'string' && entry.anchors[axis].length > 10, `missing memory anchor: ${entry.id}/${axis}`);
  }
}

const byId = new Map(CHARACTER_MEMORY_REMEMBERING_RESERVOIR.map((entry)=>[entry.id,entry]));
const includes = (id: string, axis: typeof CHARACTER_MEMORY_REMEMBERING_AXES[number], token: string) => {
  const entry = byId.get(id);
  assert(entry, `missing memory guard character: ${id}`);
  assert(entry.anchors[axis].includes(token), `memory representation guard drift: ${id}/${axis}/${token}`);
};

includes('gen','FORGETTING_RESPONSE','WITHOUT AGE_SHAME');
includes('hana','FORGETTING_RESPONSE','WITHOUT AGE_JOKE');
includes('kage1','MEMORY_SHARING_BOUNDARY','BODY_SIZE');
includes('hiyori','REMEMBERING_ENTRY','WITHOUT SKIN_OR GYARU_STEREOTYPE');
includes('touma','REMEMBERING_ENTRY','WITHOUT SKIN_OR MASCULINITY_CODE');
includes('suzu','DISAGREED_MEMORY','CURRENT_SELF_DESCRIPTION');
includes('io','DISAGREED_MEMORY','GENDER');
includes('amane','MEMORY_SHARING_BOUNDARY','NOT INSPIRATION_STORY');
includes('noa','DISAGREED_MEMORY','MACHINE_RECORD_IS EVIDENCE_WITH SCOPE');
includes('rum','MEMORY_SHARING_BOUNDARY','INSTANCE_PRIVACY');
includes('kuu','DISAGREED_MEMORY','FORENSIC_PROOF');
includes('yomo','DISAGREED_MEMORY','NOT PROOF_OF HUMAN_STORY_ACCURACY');
includes('kai','DISAGREED_MEMORY','TWIN_DIFFERENCE_IS NORMAL');
includes('nao','EXTERNAL_MEMORY_AID','NOT TWIN_AS EXTERNAL_MEMORY_DEVICE');

const doc = fs.readFileSync('docs/character-memory-remembering-reservoir-v1.md','utf8');
for (const token of [
  '36 characters × 6 axes = **216 memory/remembering anchors**',
  'accurate memory = good person',
  'older character = declining memory',
  'Robot/AI = perfect objective memory',
  'animal reaction = Human testimony',
  'dream representation and factual recollection must remain distinguishable at authority level',
  '「何を覚えているか」だけでなく、覚えていない時にどう振る舞い、他人の記憶をどこまで自分の物語にしないかでCharacterが見える。',
]) {
  assert(doc.includes(token), `memory doc guard missing: ${token}`);
}

console.log(JSON.stringify({
  characters: characterMemoryRememberingSummary.characterCount,
  axesPerCharacter: CHARACTER_MEMORY_REMEMBERING_AXES.length,
  anchors: characterMemoryRememberingSummary.anchorCount,
  fullyCovered: characterMemoryRememberingSummary.fullyCoveredCount,
  canonMemoryFrozen: false,
  diagnosisInferred: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
