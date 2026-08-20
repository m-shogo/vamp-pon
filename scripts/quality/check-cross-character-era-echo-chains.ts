import {
  CHARACTER_CROSS_ERA_ECHO_CHAINS,
  CHARACTER_CROSS_ERA_ECHO_COVERAGE,
  CROSS_ERA_ECHO_CHAIN_INTEGRITY,
  CROSS_ERA_ECHO_RULES,
} from '../../src/game/data/characterCrossEraEchoCurrent.ts';
import { CHARACTER_ERA_SCENE_SEEDS } from '../../src/game/data/characterEraSceneSeedRegistry.ts';

const fail = (message: string): never => {
  throw new Error(`[cross-character-era-echo] ${message}`);
};

if (CHARACTER_CROSS_ERA_ECHO_CHAINS.length !== 16) fail(`expected 16 chains, got ${CHARACTER_CROSS_ERA_ECHO_CHAINS.length}`);
if (new Set(CHARACTER_CROSS_ERA_ECHO_CHAINS.map((chain) => chain.id)).size !== CHARACTER_CROSS_ERA_ECHO_CHAINS.length) fail('duplicate chain ids');

const characterIds = new Set(CHARACTER_ERA_SCENE_SEEDS.map((entry) => entry.id));
for (const chain of CHARACTER_CROSS_ERA_ECHO_CHAINS) {
  if (chain.canonStatus !== 'AUTHOR_CANDIDATE') fail(`${chain.id} must remain AUTHOR_CANDIDATE`);
  const maxParticipants = chain.id === 'record-authority-sen-madoka-io' ? 4 : 3;
  if (chain.participantIds.length < 2 || chain.participantIds.length > maxParticipants) {
    fail(`${chain.id} participant count must be 2-${maxParticipants}`);
  }
  if (new Set(chain.participantIds).size !== chain.participantIds.length) fail(`${chain.id} duplicate participant`);
  if (!chain.participantIds.every((id) => characterIds.has(id))) fail(`${chain.id} has unresolved participant`);
  if (!chain.sourceSceneSeedIds.every((id) => characterIds.has(id))) fail(`${chain.id} has unresolved source scene seed`);
  if (!chain.sourceSceneSeedIds.every((id) => chain.participantIds.includes(id))) fail(`${chain.id} source scene seed must belong to a participant`);
  if (chain.setupDialogue.length < 2) fail(`${chain.id} needs at least two setup dialogue beats`);
  if (chain.payoffDialogue.length < 2) fail(`${chain.id} needs at least two payoff dialogue beats`);
  if (chain.evidenceGate.length < 3) fail(`${chain.id} needs at least three evidence gates before Canon consideration`);
  if (!chain.setupScene || !chain.plausibleMisread || !chain.counterScene || !chain.payoffScene || !chain.storyFunction || !chain.forbiddenShortcut) {
    fail(`${chain.id} incomplete echo grammar`);
  }
}

if (CROSS_ERA_ECHO_CHAIN_INTEGRITY.some((entry) => !entry.participantsResolvable || !entry.sourceSeedsResolvable)) {
  fail('cross-era echo integrity contains unresolved ids');
}

if (CHARACTER_CROSS_ERA_ECHO_COVERAGE.length !== 36) fail(`expected 36 coverage rows, got ${CHARACTER_CROSS_ERA_ECHO_COVERAGE.length}`);
if (CHARACTER_CROSS_ERA_ECHO_COVERAGE.some((entry) => !entry.covered || entry.chainCount < 1)) {
  const uncovered = CHARACTER_CROSS_ERA_ECHO_COVERAGE.filter((entry) => !entry.covered).map((entry) => entry.id).join(', ');
  fail(`every character must participate in at least one cross-character echo chain; uncovered: ${uncovered}`);
}

for (const requiredId of [
  'repair-trace-tomori-yui',
  'quadrantid-name-fossil-shiro-tomori',
  'route-erasure-michiru-tobari-gen',
  'access-consent-nagi-asa',
  'copy-personhood-noa-rum',
  'household-name-ritsu-koyori',
  'twin-same-choice-kai-nao',
  'record-authority-sen-madoka-io',
  'cross-era-chloe-shiro-toki',
  'obsolete-motif-yomo-shiro',
  'care-consent-kaname-nemu',
  'repair-memory-tsumugi-renji-hana',
  'name-context-kasumi-amane-asa',
  'record-silence-hiyori-kuroori-ren',
  'meeting-place-touma-kuu-yuubi',
  'signal-meaning-suzu-maki',
]) if (!CHARACTER_CROSS_ERA_ECHO_CHAINS.some((chain) => chain.id === requiredId)) fail(`required chain missing: ${requiredId}`);

const quadrantid = CHARACTER_CROSS_ERA_ECHO_CHAINS.find((chain) => chain.id === 'quadrantid-name-fossil-shiro-tomori');
if (!quadrantid?.forbiddenShortcut.includes('Tomori official constellation set != Yui official constellation set')) {
  fail('Quadrantid chain must preserve Tomori/Yui official-88 rejection guard');
}
const twin = CHARACTER_CROSS_ERA_ECHO_CHAINS.find((chain) => chain.id === 'twin-same-choice-kai-nao');
if (!twin?.forbiddenShortcut.includes('コピー問題だけに還元')) fail('Kai/Nao chain must preserve twin individuality boundary');
const recordAuthority = CHARACTER_CROSS_ERA_ECHO_CHAINS.find((chain) => chain.id === 'record-authority-sen-madoka-io');
if (!recordAuthority?.participantIds.includes('serika')) fail('Serika must be covered by the record-authority chain');
if (!recordAuthority?.forbiddenShortcut.includes('分類外＝異常・虚偽')) fail('Serika classification boundary missing');
const chloe = CHARACTER_CROSS_ERA_ECHO_CHAINS.find((chain) => chain.id === 'cross-era-chloe-shiro-toki');
if (!chloe?.forbiddenShortcut.includes('正体') || !chloe?.forbiddenShortcut.includes('朔夜座所属')) fail('Chloe chain must remain unresolved');
const yomo = CHARACTER_CROSS_ERA_ECHO_CHAINS.find((chain) => chain.id === 'obsolete-motif-yomo-shiro');
if (!yomo?.forbiddenShortcut.includes('Star Beast') || !yomo?.forbiddenShortcut.includes('朔夜座')) fail('obsolete motif chain must not auto-assign identity/enemy role');

if (CROSS_ERA_ECHO_RULES.exactYearAllowed !== false) fail('exact year must remain Open');
if (CROSS_ERA_ECHO_RULES.relationshipAutoCanonAllowed !== false) fail('scene pairing may not Canonize relationship');
if (CROSS_ERA_ECHO_RULES.groupMembershipAutoCanonAllowed !== false) fail('scene pairing may not Canonize group membership');
if (CROSS_ERA_ECHO_RULES.starBeastAutoAssignmentAllowed !== false) fail('Star Beast auto-assignment must remain forbidden');
if (CROSS_ERA_ECHO_RULES.obsoleteConstellationAutoAssignmentAllowed !== false) fail('obsolete constellation auto-assignment must remain forbidden');
if (CROSS_ERA_ECHO_RULES.tomoriYuiOfficialConstellationSetDifferenceAllowed !== false) fail('Tomori/Yui official constellation difference must remain forbidden');
if (CROSS_ERA_ECHO_RULES.oneClueMayProveEra !== false) fail('one clue may not prove era');
if (CROSS_ERA_ECHO_RULES.oneObjectMayProveIdentity !== false) fail('one object may not prove identity');
if (CROSS_ERA_ECHO_RULES.runtimeAutoPromotionAllowed !== false) fail('runtime auto-promotion must remain false');

console.log('[cross-character-era-echo] OK 16 candidate chains / all 36 characters covered / setup-counterevidence-payoff');
