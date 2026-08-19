import fs from 'node:fs';
import {
  CHARACTER_CROSS_ERA_ECHO_CHAINS,
  CROSS_ERA_ECHO_RULES,
} from '../../src/game/data/characterCrossEraEchoReservoir.ts';

const projection = JSON.parse(fs.readFileSync('public/lorebook/data/cross-era-echo-chains.v1.json', 'utf8'));
const js = fs.readFileSync('public/lorebook/cross-era-echo-enhancement.js', 'utf8');
const css = fs.readFileSync('public/lorebook/cross-era-echo.css', 'utf8');
const enhancements = fs.readFileSync('public/lorebook/enhancements.js', 'utf8');

const fail = (message: string): never => {
  throw new Error(`[lorebook-cross-era-echo-desk] ${message}`);
};

if (projection.schemaVersion !== 1) fail('schema version drift');
if (projection.authority !== 'src/game/data/characterCrossEraEchoReservoir.ts') fail('authority drift');
if (projection.chainCount !== CHARACTER_CROSS_ERA_ECHO_CHAINS.length) fail('chain count drift');
if (projection.coreCount !== CHARACTER_CROSS_ERA_ECHO_CHAINS.filter((chain) => chain.storyUsefulness === 'CORE').length) fail('CORE count drift');
if (projection.strongCount !== CHARACTER_CROSS_ERA_ECHO_CHAINS.filter((chain) => chain.storyUsefulness === 'STRONG').length) fail('STRONG count drift');
if (projection.supportCount !== CHARACTER_CROSS_ERA_ECHO_CHAINS.filter((chain) => chain.storyUsefulness === 'SUPPORT').length) fail('SUPPORT count drift');
if (projection.chainCount !== 16 || projection.coreCount !== 6 || projection.strongCount !== 7 || projection.supportCount !== 3) {
  fail('expected 16 chains / 6 CORE / 7 STRONG / 3 SUPPORT');
}

const selectSource = (chain: any) => ({
  id: chain.id,
  storyUsefulness: chain.storyUsefulness,
  participantIds: [...chain.participantIds],
  setupDialogue: [...chain.setupDialogue],
  payoffDialogue: [...chain.payoffDialogue],
  storyFunction: chain.storyFunction,
  evidenceGateCount: chain.evidenceGate.length,
  canonStatus: chain.canonStatus,
  forbiddenShortcut: chain.forbiddenShortcut,
});
const selectProjection = (entry: any) => ({
  id: entry.id,
  storyUsefulness: entry.storyUsefulness,
  participantIds: entry.participantIds,
  setupDialogue: entry.setupDialogue,
  payoffDialogue: entry.payoffDialogue,
  storyFunction: entry.storyFunction,
  evidenceGateCount: entry.evidenceGateCount,
  canonStatus: entry.canonStatus,
  forbiddenShortcut: entry.forbiddenShortcut,
});

if (JSON.stringify(projection.entries.map(selectProjection)) !== JSON.stringify(CHARACTER_CROSS_ERA_ECHO_CHAINS.map(selectSource))) {
  fail('Web projection drift from cross-era echo reservoir');
}

if (projection.entries.some((entry: any) => entry.canonStatus !== 'AUTHOR_CANDIDATE')) fail('all projected chains must remain AUTHOR_CANDIDATE');
if (projection.entries.some((entry: any) => entry.evidenceGateCount < 3)) fail('all projected chains require 3+ evidence gates');
if (projection.runtimeAutoPromotionAllowed !== false) fail('runtime auto-promotion must remain false');
if (projection.relationshipAutoCanonAllowed !== false) fail('relationship auto-Canon must remain false');
if (projection.groupMembershipAutoCanonAllowed !== false) fail('group membership auto-Canon must remain false');

for (const token of [
  'FORESHADOW DESK / CROSS-CHARACTER ECHO',
  'SETUP / FIRST READ',
  'PAYOFF / REINTERPRETED',
  'EVIDENCE GATE',
  'Candidate != Canon',
  'dialogue pairing != relationship or group Canon',
]) if (!js.includes(token)) fail(`UI contract missing: ${token}`);

for (const token of ['.cross-era-echo-desk', '.echo-chain-grid', '.echo-chain-card', '.echo-dialogue-grid', '.echo-forbidden']) {
  if (!css.includes(token)) fail(`CSS contract missing: ${token}`);
}
if (!enhancements.includes("'./cross-era-echo-enhancement.js'")) fail('cross-era echo enhancement is not registered');

const quadrantid = projection.entries.find((entry: any) => entry.id === 'quadrantid-name-fossil-shiro-tomori');
if (!quadrantid?.forbiddenShortcut.includes('Tomori official constellation set != Yui official constellation set')) fail('Quadrantid rejection guard missing in projection');
const chloe = projection.entries.find((entry: any) => entry.id === 'cross-era-chloe-shiro-toki');
if (!chloe?.forbiddenShortcut.includes('朔夜座所属') || !chloe?.forbiddenShortcut.includes('群青残響録所属')) fail('Chloe group-membership Open boundary missing');
const yomo = projection.entries.find((entry: any) => entry.id === 'obsolete-motif-yomo-shiro');
if (!yomo?.forbiddenShortcut.includes('Star Beast') || !yomo?.forbiddenShortcut.includes('朔夜座')) fail('obsolete motif assignment boundary missing');

if (CROSS_ERA_ECHO_RULES.relationshipAutoCanonAllowed !== false) fail('upstream relationship guard drift');
if (CROSS_ERA_ECHO_RULES.groupMembershipAutoCanonAllowed !== false) fail('upstream group-membership guard drift');
if (CROSS_ERA_ECHO_RULES.starBeastAutoAssignmentAllowed !== false) fail('upstream Star Beast guard drift');
if (CROSS_ERA_ECHO_RULES.obsoleteConstellationAutoAssignmentAllowed !== false) fail('upstream obsolete constellation guard drift');

console.log('[lorebook-cross-era-echo-desk] OK 16 checked Candidate chains / 6 core / 7 strong / 3 support');