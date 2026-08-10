import {
  CHARACTER_REFERENCE_HANDOFF_POLICY,
  characterReferenceGenerationHandoff,
  p0CharacterReferenceGenerationHandoff,
} from '../../src/game/data/characterReferenceGenerationHandoff.ts';

let failed = false;
const fail = (message: string) => {
  failed = true;
  console.error(`FAIL: ${message}`);
};

const p0Ids = p0CharacterReferenceGenerationHandoff.map((entry) => entry.characterId).sort();
const expectedP0Ids = [...CHARACTER_REFERENCE_HANDOFF_POLICY.expectedP0Ids].sort();

if (JSON.stringify(p0Ids) !== JSON.stringify(expectedP0Ids)) {
  fail(`P0 handoff IDs drift: expected ${expectedP0Ids.join(',')} got ${p0Ids.join(',')}`);
}
if (characterReferenceGenerationHandoff.length !== 20) {
  fail(`Current20 handoff coverage must remain 20; got ${characterReferenceGenerationHandoff.length}`);
}
if (new Set(characterReferenceGenerationHandoff.map((entry) => entry.characterId)).size !== 20) {
  fail('duplicate character in reference handoff');
}
if (characterReferenceGenerationHandoff.some((entry) => entry.characterId === 'ren')) {
  fail('Reserve Ren must not auto-enter Current20 reference handoff');
}

for (const entry of p0CharacterReferenceGenerationHandoff) {
  if (entry.mode !== 'generate') fail(`${entry.characterId}: P0 must be generate mode`);
  if (entry.approvalStateAfterGeneration !== 'CANDIDATE_REVIEW_REQUIRED') {
    fail(`${entry.characterId}: generated art must remain candidate review required`);
  }
  if (!entry.prompt || !entry.negativePrompt || entry.reviewChecklist.length === 0) {
    fail(`${entry.characterId}: P0 generation payload incomplete`);
  }
  if (!entry.prompt?.includes('PLUS-SIZE HARD LOCK')) {
    fail(`${entry.characterId}: prompt lost PLUS-SIZE HARD LOCK`);
  }
  if (!entry.negativePrompt?.includes('PLUS-SIZE HARD LOCK')) {
    fail(`${entry.characterId}: negative prompt lost PLUS-SIZE HARD LOCK`);
  }
  if (!entry.reviewChecklist.some((item) => item.includes('PLUS-SIZE HARD LOCK'))) {
    fail(`${entry.characterId}: review checklist lost PLUS-SIZE HARD LOCK`);
  }
  if (!entry.sizeSpec?.includes('1024x1024')) fail(`${entry.characterId}: reference size spec drift`);
  if (!entry.outputPath.endsWith(`${entry.characterId}-reference-v1.png`)) {
    fail(`${entry.characterId}: output path drift: ${entry.outputPath}`);
  }
}

const hana = p0CharacterReferenceGenerationHandoff.find((entry) => entry.characterId === 'hana');
const kaname = p0CharacterReferenceGenerationHandoff.find((entry) => entry.characterId === 'kage1');

for (const token of ['ふっくらした年長女性', '#B5495B', 'ふっくらした白鳥', '細腰']) {
  if (!hana?.prompt?.includes(token)) fail(`Hana prompt missing current visual token: ${token}`);
}
for (const token of ['横幅のあるがっしり＋柔らかい若い成人男性', '#2B2B2B', '大きな灰狼', '細身']) {
  if (!kaname?.prompt?.includes(token)) fail(`Kaname prompt missing current visual token: ${token}`);
}

if (!CHARACTER_REFERENCE_HANDOFF_POLICY.referenceFirst) fail('reference-first policy lost');
if (!CHARACTER_REFERENCE_HANDOFF_POLICY.noAutomaticRuntimePromotion) fail('runtime approval firewall lost');
if (!CHARACTER_REFERENCE_HANDOFF_POLICY.noAutomaticFinalApproval) fail('final approval firewall lost');

console.log('Character reference handoff OK');
console.log(`  Current20 handoff: ${characterReferenceGenerationHandoff.length}/20`);
console.log(`  P0 generate: ${p0Ids.join(', ')}`);
console.log(`  Hana output: ${hana?.outputPath}`);
console.log(`  Kaname output: ${kaname?.outputPath}`);
console.log('  Generated references remain CANDIDATE_REVIEW_REQUIRED.');

if (failed) process.exit(1);
