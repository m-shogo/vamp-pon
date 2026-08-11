import fs from 'node:fs';
import {
  CHARACTER_COMPETENCE_LEARNING_AXES,
  CHARACTER_COMPETENCE_LEARNING_RESERVOIR,
  CHARACTER_COMPETENCE_LEARNING_RULES,
  characterCompetenceLearningSummary,
} from '../../src/game/data/characterCompetenceLearningReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-competence-learning-reservoir-v1.md',
  'src/game/data/characterCompetenceLearningReservoir.ts',
  'src/game/data/characterBehaviorIdentityReservoir.ts',
  'src/game/data/characterLivedArtifactReservoir.ts',
] as const) assert(fs.existsSync(path), `missing competence/learning prerequisite: ${path}`);

assert(CHARACTER_COMPETENCE_LEARNING_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'competence/learning status drift');
assert(CHARACTER_COMPETENCE_LEARNING_RULES.characterCoverageRequired === 36, 'competence/learning character target drift');
assert(CHARACTER_COMPETENCE_LEARNING_RULES.axesPerCharacterRequired === 8, 'competence/learning axis target drift');
assert(CHARACTER_COMPETENCE_LEARNING_RULES.totalAnchorCountRequired === 288, 'competence/learning anchor target drift');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.competenceIsRuntimeStat, 'competence may not become runtime stat');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.competenceDefinesIntelligence, 'competence may not define intelligence');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.learningStyleIsDiagnosis, 'learning style may not become diagnosis');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.ageDeterminesCompetence, 'age may not determine competence');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.bodyDeterminesCompetence, 'body may not determine competence');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.genderOrSexualityDeterminesCompetence, 'gender/sexuality may not determine competence');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.originDeterminesCompetence, 'origin may not determine competence');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.disabilityDeterminesHelplessness, 'disability may not determine helplessness');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.futureTechnologyMeansAutomaticCompetence, 'Future tech may not mean automatic competence');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.artificialBodyMeansPerfectExecution, 'artificial body may not mean perfect execution');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.animalSenseMeansHumanReasoning, 'animal senses may not mean Human reasoning');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.exactJobOrEducationFrozenHere, 'exact job/education may not freeze here');
assert(!CHARACTER_COMPETENCE_LEARNING_RULES.runtimeAutoPromotionAllowed, 'competence/learning may not auto-promote runtime');

const expectedIds = [
  'yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren',
  'hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane',
] as const;

assert(CHARACTER_COMPETENCE_LEARNING_AXES.length === 8, `expected 8 axes, got ${CHARACTER_COMPETENCE_LEARNING_AXES.length}`);
assert(new Set(CHARACTER_COMPETENCE_LEARNING_AXES).size === 8, 'competence/learning axes must be unique');
assert(CHARACTER_COMPETENCE_LEARNING_RESERVOIR.length === 36, `expected 36 characters, got ${CHARACTER_COMPETENCE_LEARNING_RESERVOIR.length}`);
assert(characterCompetenceLearningSummary.characterCount === 36, 'competence/learning summary character drift');
assert(characterCompetenceLearningSummary.uniqueIds === 36, 'competence/learning IDs must be unique');
assert(characterCompetenceLearningSummary.anchorCount === 288, `expected 288 anchors, got ${characterCompetenceLearningSummary.anchorCount}`);
assert(characterCompetenceLearningSummary.fullyCoveredCount === 36, `all 36 require all 8 axes, got ${characterCompetenceLearningSummary.fullyCoveredCount}`);
assert(!characterCompetenceLearningSummary.runtimeAutoPromotionAllowed, 'competence/learning summary may not auto-promote runtime');

const actualIds = new Set(CHARACTER_COMPETENCE_LEARNING_RESERVOIR.map((entry) => entry.id));
for (const id of expectedIds) assert(actualIds.has(id), `missing competence/learning character: ${id}`);
for (const entry of CHARACTER_COMPETENCE_LEARNING_RESERVOIR) {
  assert(Object.keys(entry.anchors).length === 8, `${entry.id} must have exactly 8 competence/learning anchors`);
  for (const axis of CHARACTER_COMPETENCE_LEARNING_AXES) assert(entry.anchors[axis].trim().length >= 12, `${entry.id}.${axis} is too thin`);
}

const byId = new Map(CHARACTER_COMPETENCE_LEARNING_RESERVOIR.map((entry) => [entry.id, entry]));
assert(byId.get('asa')?.anchors.PRACTICAL_COMPETENCE.includes('HUMAN_NAME_CONTEXT'), 'Asa competence must preserve Human context');
assert(byId.get('kage1')?.anchors.ASKING_HELP.includes('BETTER_TOOL'), 'Kaname must ask for tool/help rather than body-size strength shorthand');
assert(byId.get('hana')?.anchors.ASKING_HELP.includes('NOT FRAILTY'), 'Hana asking help must reject age fragility shorthand');
assert(byId.get('gen')?.anchors.ASKING_HELP.includes('YOUNGER_PERSON'), 'Gen must be allowed to learn from younger people');
assert(byId.get('hiyori')?.anchors.PRACTICAL_COMPETENCE.includes('WITHOUT GYARU_MAGIC'), 'Hiyori competence may not become presentation magic');
assert(byId.get('touma')?.anchors.PRACTICAL_COMPETENCE.includes('WITHOUT SKIN_OR_SEXUALITY_CODE'), 'Touma competence may not derive from skin/sexuality');
assert(byId.get('suzu')?.anchors.PRACTICAL_COMPETENCE.includes('WITHOUT GENDER_ESSENTIALISM'), 'Suzu competence may not derive from presentation/gender essentialism');
assert(byId.get('io')?.anchors.PRACTICAL_COMPETENCE.includes('WITHOUT MYSTERY_GENIUS'), 'Io may not become mystery-genius trope');
assert(byId.get('amane')?.anchors.ASKING_HELP.includes('NOT HELPLESSNESS'), 'Amane help request must not imply helplessness');
assert(byId.get('kuu')?.anchors.PRACTICAL_COMPETENCE.includes('WITHOUT HUMAN_REASONING'), 'Kuu may not gain Human reasoning');
assert(byId.get('yomo')?.anchors.PRACTICAL_COMPETENCE.includes('WITHOUT HUMAN_REASONING'), 'Yomo may not gain Human reasoning');
assert(byId.get('noa')?.anchors.PRACTICAL_COMPETENCE.includes('WITHOUT PERFECT_PERSON_TROPE'), 'Noa precision may not imply perfection');
assert(byId.get('rum')?.anchors.PRACTICAL_COMPETENCE.includes('WITHOUT AUTOMATIC_GENIUS'), 'Rum shared memory may not imply genius');
assert(byId.get('kai')?.anchors.LEARNING_ENTRY !== byId.get('nao')?.anchors.LEARNING_ENTRY, 'Kai/Nao learning entries must remain individual');

const doc = fs.readFileSync('docs/character-competence-learning-reservoir-v1.md', 'utf8');
for (const token of [
  'AUTHOR RESERVOIR / NON-CANON / NO INTELLIGENCE RANKING / NO RUNTIME STAT',
  '36 characters × 8 axes = 288 competence/learning anchors',
  'competence != intelligence != morality != gameplay power',
  'Failure should be ordinary too',
  'Asking for help is character material',
  'runtimeAutoPromotionAllowed = false',
  '何ができるかより、「できるようになる途中」と「間違えた後」にCharacterが出る。',
]) assert(doc.includes(token), `competence/learning doc guard missing: ${token}`);

console.log(JSON.stringify({ characters:36, axes:8, anchors:288, fullyCovered:36, intelligenceRanked:false, runtimeAutoPromotionAllowed:false }, null, 2));
