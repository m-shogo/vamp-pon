import fs from 'node:fs';
import {
  CHARACTER_REST_DAILY_RHYTHM_AXES,
  CHARACTER_REST_DAILY_RHYTHM_RESERVOIR,
  CHARACTER_REST_DAILY_RHYTHM_RULES,
  characterRestDailyRhythmSummary,
} from '../../src/game/data/characterRestDailyRhythmReservoir.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

for (const path of ['docs/character-rest-daily-rhythm-reservoir-v1.md','src/game/data/characterRestDailyRhythmReservoir.ts'] as const) assert(fs.existsSync(path),`missing rest/rhythm prerequisite: ${path}`);

assert(CHARACTER_REST_DAILY_RHYTHM_RULES.status==='AUTHOR_RESERVOIR_NON_CANON','rest status drift');
assert(CHARACTER_REST_DAILY_RHYTHM_RULES.characterCoverageRequired===36,'rest character target drift');
assert(CHARACTER_REST_DAILY_RHYTHM_RULES.axesPerCharacterRequired===6,'rest axis target drift');
assert(CHARACTER_REST_DAILY_RHYTHM_RULES.totalAnchorCountRequired===216,'rest anchor target drift');
for(const [label,value] of [
  ['chronotype freeze',CHARACTER_REST_DAILY_RHYTHM_RULES.exactChronotypeFrozenHere],
  ['sleep diagnosis',CHARACTER_REST_DAILY_RHYTHM_RULES.sleepHabitDefinesDiagnosis],
  ['rest weakness',CHARACTER_REST_DAILY_RHYTHM_RULES.restNeedDefinesWeakness],
  ['productivity worth',CHARACTER_REST_DAILY_RHYTHM_RULES.productivityDefinesWorth],
  ['age sleep/energy',CHARACTER_REST_DAILY_RHYTHM_RULES.ageDefinesSleepOrEnergy],
  ['body stamina',CHARACTER_REST_DAILY_RHYTHM_RULES.bodyDefinesStamina],
  ['disability fatigue',CHARACTER_REST_DAILY_RHYTHM_RULES.disabilityDefinesFatigue],
  ['gender rhythm',CHARACTER_REST_DAILY_RHYTHM_RULES.genderOrSexualityDefinesRhythm],
  ['origin rhythm',CHARACTER_REST_DAILY_RHYTHM_RULES.originDefinesRhythm],
  ['artificial no rest',CHARACTER_REST_DAILY_RHYTHM_RULES.artificialBodyMeansNoRestNeed],
  ['animal Human schedule',CHARACTER_REST_DAILY_RHYTHM_RULES.animalRhythmBecomesHumanSchedule],
  ['runtime promotion',CHARACTER_REST_DAILY_RHYTHM_RULES.runtimeAutoPromotionAllowed],
] as const) assert(!value,`${label} must remain false`);

assert(CHARACTER_REST_DAILY_RHYTHM_AXES.length===6,'rest axes must be 6');
assert(new Set(CHARACTER_REST_DAILY_RHYTHM_AXES).size===6,'rest axes unique');
assert(CHARACTER_REST_DAILY_RHYTHM_RESERVOIR.length===36,'rest characters must be 36');
assert(characterRestDailyRhythmSummary.characterCount===36,'rest summary character drift');
assert(characterRestDailyRhythmSummary.uniqueIds===36,'rest IDs unique');
assert(characterRestDailyRhythmSummary.anchorCount===216,`expected 216 anchors, got ${characterRestDailyRhythmSummary.anchorCount}`);
assert(characterRestDailyRhythmSummary.fullyCoveredCount===36,'all 36 need 6 rest axes');
for(const entry of CHARACTER_REST_DAILY_RHYTHM_RESERVOIR){
  assert(Object.keys(entry.anchors).length===6,`${entry.id} must have 6 rest axes`);
  for(const axis of CHARACTER_REST_DAILY_RHYTHM_AXES) assert(entry.anchors[axis].trim().length>=12,`${entry.id}.${axis} too thin`);
}

const byId=new Map(CHARACTER_REST_DAILY_RHYTHM_RESERVOIR.map((entry)=>[entry.id,entry]));
assert(byId.get('asa')?.anchors.START_OF_DAY.includes('NOT SYSTEM_PRIORITY_ONLY'),'Asa rest rhythm must preserve personal Human choice');
assert(byId.get('koyori')?.anchors.END_OF_DAY.includes('ADULTS_CARRY_REMAINING_RESPONSIBILITY'),'Koyori must not carry adult schedule responsibility');
assert(byId.get('gen')?.anchors.START_OF_DAY.includes('WITHOUT AGE_MAKING_EVERY_DAY_SLOW'),'Gen age may not define daily rhythm');
assert(byId.get('hana')?.anchors.MIDTASK_PAUSE.includes('DOES NOT TURN_PAUSE_INTO PREP_FOR_OTHERS'),'Hana rest may not become unpaid care labor');
assert(byId.get('kage1')?.anchors.START_OF_DAY.includes('WITHOUT TURNING_SIZE_INTO STAMINA_SCORE'),'Kaname body may not define stamina');
assert(byId.get('hiyori')?.anchors.START_OF_DAY.includes('NOT GYARU_ALWAYS_ON_EXPECTATION'),'Hiyori may not be always-on gyaru stereotype');
assert(byId.get('suzu')?.anchors.START_OF_DAY.includes('NOT DAILY_GENDER_PERFORMANCE'),'Suzu daily rhythm may not be gender performance duty');
assert(byId.get('io')?.anchors.END_OF_DAY.includes('DOES NOT TURN MEDIA_BODY_VOICE_OR DAY_PATTERN_INTO GENDER_EVIDENCE'),'Io rhythm may not become gender clue');
assert(byId.get('amane')?.anchors.END_OF_DAY.includes('DOES NOT TURN ACCESS_WORK_OR FATIGUE_INTO INSPIRATION_SUMMARY'),'Amane fatigue/access must not become inspiration trope');
assert(byId.get('noa')?.anchors.END_OF_DAY.includes('NOT DEATH_SLEEP_OR EMOTIONAL_PROOF'),'Noa maintenance/shutdown may not become Human sleep proof');
assert(byId.get('rum')?.anchors.RECOVERY_RITUAL.includes('WITHOUT APPLIANCE_FRAME'),'Rum rest may not become appliance frame');
assert(byId.get('kuu')?.anchors.START_OF_DAY.includes('NOT HUMAN_MORNING_PRODUCTIVITY'),'Kuu rhythm must remain species-appropriate');
assert(byId.get('yomo')?.anchors.START_OF_DAY.includes('NOT HUMAN_SCHEDULE'),'Yomo rhythm must remain species-appropriate');
assert(byId.get('kai')?.anchors.CONTEXT_TRANSITION!==byId.get('nao')?.anchors.CONTEXT_TRANSITION,'Kai/Nao daily transition must remain individual');

const doc=fs.readFileSync('docs/character-rest-daily-rhythm-reservoir-v1.md','utf8');
for(const token of [
  'AUTHOR RESERVOIR / NON-CANON / NO DIAGNOSIS / NO PRODUCTIVITY-WORTH SCORE',
  '36 characters × 6 axes = 216 rest/daily-rhythm anchors',
  'rest need != weakness; productivity != worth.',
  'fatigue signal != medical diagnosis',
  'runtimeAutoPromotionAllowed = false',
  'Characterは忙しい時だけでなく、止まった時にもその人らしい。',
]) assert(doc.includes(token),`rest doc guard missing: ${token}`);

console.log(JSON.stringify({characters:36,axes:6,anchors:216,chronotypeFrozen:false,diagnosisInferred:false,runtimeAutoPromotionAllowed:false},null,2));
