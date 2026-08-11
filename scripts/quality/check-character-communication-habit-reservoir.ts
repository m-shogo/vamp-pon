import fs from 'node:fs';
import {
  CHARACTER_COMMUNICATION_HABIT_AXES,
  CHARACTER_COMMUNICATION_HABIT_RESERVOIR,
  CHARACTER_COMMUNICATION_HABIT_RULES,
  characterCommunicationHabitSummary,
} from '../../src/game/data/characterCommunicationHabitReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-communication-habit-reservoir-v1.md',
  'src/game/data/characterCommunicationHabitReservoir.ts',
  'src/game/data/characterBehaviorIdentityReservoir.ts',
] as const) assert(fs.existsSync(path), `missing communication-habit prerequisite: ${path}`);

assert(CHARACTER_COMMUNICATION_HABIT_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'communication status drift');
assert(CHARACTER_COMMUNICATION_HABIT_RULES.characterCoverageRequired === 36, 'communication character target drift');
assert(CHARACTER_COMMUNICATION_HABIT_RULES.axesPerCharacterRequired === 8, 'communication axis target drift');
assert(CHARACTER_COMMUNICATION_HABIT_RULES.totalAnchorCountRequired === 288, 'communication anchor target drift');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.exactDeviceOrAppFrozenHere, 'exact device/app may not freeze here');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.historicalCharacterGetsModernAppByDefault, 'historical character may not get modern app by default');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.replyDelayDefinesAffection, 'reply delay may not define affection');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.channelChoiceDefinesMorality, 'channel choice may not define morality');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.familyRegisterDefinesBloodline, 'home register may not prove bloodline');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.communicationHabitDefinesDiagnosis, 'communication habit may not infer diagnosis');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.genderOrSexualityDefinesCommunication, 'gender/sexuality may not determine communication habit');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.disabilityDefinesCommunicationPassivity, 'disability may not imply communication passivity');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.artificialBodyMeansInstantResponse, 'artificial body may not imply instant response');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.animalCommunicationBecomesHumanLanguage, 'animal communication may not become Human language');
assert(!CHARACTER_COMMUNICATION_HABIT_RULES.runtimeAutoPromotionAllowed, 'communication reservoir may not auto-promote runtime');

const expectedIds = [
  'yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren',
  'hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane',
] as const;

assert(CHARACTER_COMMUNICATION_HABIT_AXES.length === 8, `expected 8 communication axes, got ${CHARACTER_COMMUNICATION_HABIT_AXES.length}`);
assert(new Set(CHARACTER_COMMUNICATION_HABIT_AXES).size === 8, 'communication axes must be unique');
assert(CHARACTER_COMMUNICATION_HABIT_RESERVOIR.length === 36, `expected 36 characters, got ${CHARACTER_COMMUNICATION_HABIT_RESERVOIR.length}`);
assert(characterCommunicationHabitSummary.characterCount === 36, 'communication summary character drift');
assert(characterCommunicationHabitSummary.uniqueIds === 36, 'communication IDs must be unique');
assert(characterCommunicationHabitSummary.anchorCount === 288, `expected 288 communication anchors, got ${characterCommunicationHabitSummary.anchorCount}`);
assert(characterCommunicationHabitSummary.fullyCoveredCount === 36, `all 36 require 8 communication axes, got ${characterCommunicationHabitSummary.fullyCoveredCount}`);
assert(!characterCommunicationHabitSummary.runtimeAutoPromotionAllowed, 'communication summary may not auto-promote runtime');

const actualIds = new Set(CHARACTER_COMMUNICATION_HABIT_RESERVOIR.map((entry)=>entry.id));
for (const id of expectedIds) assert(actualIds.has(id), `missing communication character: ${id}`);
for (const entry of CHARACTER_COMMUNICATION_HABIT_RESERVOIR) {
  assert(Object.keys(entry.anchors).length === 8, `${entry.id} must have exactly 8 communication anchors`);
  for (const axis of CHARACTER_COMMUNICATION_HABIT_AXES) assert(entry.anchors[axis].trim().length >= 12, `${entry.id}.${axis} is too thin`);
}

const byId = new Map(CHARACTER_COMMUNICATION_HABIT_RESERVOIR.map((entry)=>[entry.id,entry]));
assert(byId.get('asa')?.anchors.INITIATION.includes('WITHOUT SYSTEM_FORMALITY_ERASING_PERSON'), 'Asa communication must preserve Human/person-first framing');
assert(byId.get('koyori')?.anchors.CHANNEL_CHOICE.includes('NO AUTOMATIC_SMARTPHONE_CHILD'), 'Koyori must not receive automatic modern smartphone framing');
assert(byId.get('gen')?.anchors.CHANNEL_CHOICE.includes('CAN_LEARN_NEWER_CHANNEL'), 'Gen age may not imply technology avoidance');
assert(byId.get('hana')?.anchors.CHANNEL_CHOICE.includes('NOT OLD_PERSON_TECH_AVERSION_TROPE'), 'Hana age may not imply tech aversion');
assert(byId.get('kage1')?.anchors.INITIATION.includes('BEFORE MOVING_THING_OR PERSON'), 'Kaname must ask before physical help');
assert(byId.get('hiyori')?.anchors.CHANNEL_CHOICE.includes('NOT GYARU_APP_STEREOTYPE'), 'Hiyori communication may not derive from gyaru stereotype');
assert(byId.get('touma')?.anchors.HOME_REGISTER.includes('SEPARATE_FROM SKIN_OR_SEXUALITY'), 'Touma communication may not derive from skin/sexuality');
assert(byId.get('suzu')?.anchors.CHANNEL_CHOICE.includes('NOT GENDER'), 'Suzu channel choice may not derive from gender presentation');
assert(byId.get('io')?.anchors.ARCHIVE_TRACE.includes('WITHOUT USING_METADATA_TO HINT_GENDER'), 'Io communication metadata may not become gender reveal bait');
assert(byId.get('amane')?.anchors.CHANNEL_CHOICE.includes('WHEELCHAIR_DOES_NOT DEFINE PREFERENCE'), 'Amane wheelchair may not define channel preference');
assert(byId.get('kuu')?.anchors.INITIATION.includes('NOT HUMAN_MESSAGE'), 'Kuu may not initiate Human-language messages');
assert(byId.get('yomo')?.anchors.CHANNEL_CHOICE.includes('NO HUMAN_CHAT_LANGUAGE'), 'Yomo may not use Human chat language');
assert(byId.get('noa')?.anchors.RESPONSE_RHYTHM.includes('PROCESSING_SPEED_DOES_NOT REQUIRE INSTANT_REPLY'), 'Noa processing speed may not force instant reply');
assert(byId.get('rum')?.anchors.RESPONSE_RHYTHM.includes('DOES_NOT_REQUIRE SAME_RESPONSE_TIME'), 'Rum network access may not force identical/instant response');
assert(byId.get('kai')?.anchors.RESPONSE_RHYTHM !== byId.get('nao')?.anchors.RESPONSE_RHYTHM, 'Kai/Nao reply rhythm must remain individual');

const doc = fs.readFileSync('docs/character-communication-habit-reservoir-v1.md','utf8');
for (const token of [
  'AUTHOR RESERVOIR / NON-CANON / ERA-TECH-AWARE / NO AFFECTION SCORING',
  '36 characters × 8 axes = 288 communication anchors',
  'communication habitとcommunication deviceは別。',
  '返信速度 = 好感度',
  'runtimeAutoPromotionAllowed = false',
  'Characterは「何を言うか」だけでなく、いつ返すか、どこで話すか、間違えた時どう直すかでも覚えられる。',
]) assert(doc.includes(token), `communication doc guard missing: ${token}`);

console.log(JSON.stringify({ characters:36, axes:8, anchors:288, exactDeviceFrozen:false, affectionScoredByReply:false, runtimeAutoPromotionAllowed:false }, null, 2));
