import fs from 'node:fs';
import {
  CHARACTER_VOICE_PROSODY_RULES,
  CHARACTER_VOICE_PROSODY_AXES,
  CHARACTER_VOICE_PROSODY_RESERVOIR,
  characterVoiceProsodySummary,
} from '../../src/game/data/characterVoiceProsodyReservoir.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(CHARACTER_VOICE_PROSODY_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'voice/prosody status drift');
assert(CHARACTER_VOICE_PROSODY_RULES.characterCoverageRequired === 36, 'voice/prosody character target drift');
assert(CHARACTER_VOICE_PROSODY_RULES.axesPerCharacterRequired === 6, 'voice/prosody axes target drift');
assert(CHARACTER_VOICE_PROSODY_RULES.totalAnchorCountRequired === 216, 'voice/prosody anchor target drift');
assert(!CHARACTER_VOICE_PROSODY_RULES.exactPitchFrozenHere, 'exact pitch may not freeze here');
assert(!CHARACTER_VOICE_PROSODY_RULES.exactAccentDialectFrozenHere, 'exact accent/dialect may not freeze here');
assert(!CHARACTER_VOICE_PROSODY_RULES.voiceActorCastingFrozenHere, 'voice actor casting may not freeze here');
assert(!CHARACTER_VOICE_PROSODY_RULES.genderSexualityPresentationDefinesVoice, 'gender/sexuality/presentation may not define voice');
assert(!CHARACTER_VOICE_PROSODY_RULES.bodySizeDefinesPitchOrLoudness, 'body size may not define pitch/loudness');
assert(!CHARACTER_VOICE_PROSODY_RULES.ageDefinesWeakOrSlowVoice, 'age may not define weak/slow voice');
assert(!CHARACTER_VOICE_PROSODY_RULES.skinOrOriginDefinesAccent, 'skin/origin may not define accent');
assert(!CHARACTER_VOICE_PROSODY_RULES.disabilityDefinesVoiceQuality, 'disability may not define voice quality');
assert(!CHARACTER_VOICE_PROSODY_RULES.artificialBodyMeansFlatVoice, 'artificial body may not imply flat voice');
assert(!CHARACTER_VOICE_PROSODY_RULES.runtimeAudioPromotionAllowed, 'voice/prosody reservoir may not auto-promote runtime audio');

const expectedAxes=['BASE_PACE','VOLUME_RANGE','PAUSE_PATTERN','EMOTION_SHIFT','SILENCE_USE','NONVERBAL_SOUND'] as const;
assert(JSON.stringify(CHARACTER_VOICE_PROSODY_AXES)===JSON.stringify(expectedAxes), 'voice/prosody axes drift');

const expectedIds=[
  'yui','asa','nagi','michiru','tomori','sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori',
  'kage1','kage2','kage3','kage4','ren','hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane',
] as const;
assert(CHARACTER_VOICE_PROSODY_RESERVOIR.length===36,'voice/prosody reservoir must cover 36');
assert(characterVoiceProsodySummary.characterCount===36,'voice/prosody summary character count drift');
assert(characterVoiceProsodySummary.uniqueIds===36,'voice/prosody IDs must be unique');
assert(characterVoiceProsodySummary.anchorCount===216,'voice/prosody anchor count must be 216');
assert(characterVoiceProsodySummary.fullyCoveredCount===36,'all 36 must cover every voice/prosody axis');
assert(!characterVoiceProsodySummary.runtimeAudioPromotionAllowed,'voice/prosody summary may not auto-promote runtime audio');
assert(JSON.stringify(CHARACTER_VOICE_PROSODY_RESERVOIR.map((entry)=>entry.id))===JSON.stringify(expectedIds),'voice/prosody roster/stable ID order drift');

for (const entry of CHARACTER_VOICE_PROSODY_RESERVOIR) {
  assert(Object.keys(entry.anchors).length===6,`voice/prosody axis count drift: ${entry.id}`);
  for (const axis of CHARACTER_VOICE_PROSODY_AXES) assert(typeof entry.anchors[axis]==='string'&&entry.anchors[axis].length>10,`missing voice/prosody anchor: ${entry.id}/${axis}`);
}

const byId=new Map(CHARACTER_VOICE_PROSODY_RESERVOIR.map((entry)=>[entry.id,entry]));
const includes=(id:string,axis:typeof CHARACTER_VOICE_PROSODY_AXES[number],token:string)=>{
  const entry=byId.get(id); assert(entry,`missing voice/prosody guard character: ${id}`);
  assert(entry.anchors[axis].includes(token),`voice/prosody representation guard drift: ${id}/${axis}/${token}`);
};
includes('gen','BASE_PACE','NOT AUTOMATICALLY SLOW_BECAUSE_OLDER');
includes('hana','VOLUME_RANGE','NOT TIED_TO AGE_OR BODY_SIZE');
includes('kage1','VOLUME_RANGE','NOT BODY_SIZE_EQUALS_LOUDNESS');
includes('hiyori','BASE_PACE','WITHOUT GYARU_OR SKIN_TONE_SPEECH_STEREOTYPE');
includes('touma','BASE_PACE','WITHOUT SKIN_TONE_OR MASCULINITY_VOICE_STEREOTYPE');
includes('suzu','BASE_PACE','NOT GENDER_PRESENTATION_DIAGNOSTIC');
includes('io','EMOTION_SHIFT','WITHOUT SOLVING_GENDER');
includes('amane','NONVERBAL_SOUND','NOT MEDICAL_NARRATION_BY_DEFAULT');
includes('noa','BASE_PACE','NOT CPU_SPEED');
includes('rum','BASE_PACE','NOT UNIVERSAL_FLEET_SYNCHRONY');
includes('kuu','BASE_PACE','NOT HUMAN_SPEECH_PROSODY');
includes('yomo','NONVERBAL_SOUND','NOT MASCOT_SOUND_BUTTON');
includes('kai','BASE_PACE','NOT TWIN_PAIR_RHYTHM');
includes('nao','BASE_PACE','WITHOUT FORCED_OPPOSITE_OF_KAI');

const doc=fs.readFileSync('docs/character-voice-prosody-reservoir-v1.md','utf8');
for (const token of [
  '36 characters × 6 axes = **216 voice/prosody anchors**',
  'large body = deep/loud voice',
  'older age = frail/slow voice',
  'Robot/AI = flat or emotionless voice',
  'twins = matched or opposite voice by default',
  'runtime audio is not promoted automatically',
  '声の個性は「高い・低い」より、どこで急ぎ、どこで止まり、何を言わずに残せるかで作る。',
]) assert(doc.includes(token),`voice/prosody doc guard missing: ${token}`);

console.log(JSON.stringify({characters:36,axesPerCharacter:6,anchors:216,fullyCovered:36,castingFrozen:false,exactPitchFrozen:false,runtimeAudioPromotionAllowed:false},null,2));
