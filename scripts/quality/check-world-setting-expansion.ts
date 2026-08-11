import fs from 'node:fs';
import { worldSettingExpansionEntries, worldSettingExpansionSummary } from '../../src/game/data/worldSettingExpansionIndex.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(worldSettingExpansionSummary.total === 32, `world setting expansion must keep 32 requested areas, got ${worldSettingExpansionSummary.total}`);
assert(worldSettingExpansionSummary.p0 === 9, `expected 9 P0 areas, got ${worldSettingExpansionSummary.p0}`);
assert(worldSettingExpansionSummary.p1 === 18, `expected 18 P1 areas, got ${worldSettingExpansionSummary.p1}`);
assert(worldSettingExpansionSummary.p2 === 5, `expected 5 P2 areas, got ${worldSettingExpansionSummary.p2}`);
assert(!worldSettingExpansionSummary.runtimeAutoPromotionAllowed, 'world setting expansion may not auto-promote runtime');

const ids = worldSettingExpansionEntries.map((entry) => entry.id);
assert(new Set(ids).size === ids.length, 'world setting expansion IDs must be unique');

for (const entry of worldSettingExpansionEntries) {
  assert(entry.authority === 'WORLD_SETTING_EXPANSION_SOURCE', `unexpected authority for ${entry.id}`);
  assert(!entry.runtimeAutoPromotionAllowed, `runtime auto promotion forbidden: ${entry.id}`);
  assert(entry.primarySource.startsWith('docs/'), `primary source must be a docs path: ${entry.id}`);
  assert(fs.existsSync(entry.primarySource), `missing primary source ${entry.primarySource} for ${entry.id}`);
}

const worldHub = fs.readFileSync('docs/WORLD.md', 'utf8');
const foundation = fs.readFileSync('docs/world-foundation-authority-v1.md', 'utf8');
const lifeDeath = fs.readFileSync('docs/world-life-death-injury-rulebook-v1.md', 'utf8');
const knowledge = fs.readFileSync('docs/world-knowledge-secret-matrix-v1.md', 'utf8');
const mystery = fs.readFileSync('docs/world-mystery-foreshadow-payoff-ledger-v1.md', 'utf8');
const lineup = fs.readFileSync('docs/character-height-age-era-lineup-v1.md', 'utf8');
const sakumei = fs.readFileSync('docs/sakumei-antagonist-organization-candidate-v1.md', 'utf8');

for (const required of [
  '現実では人物が同時代とは限らない',
  'Game Over',
  '黒耀化',
  'Happy End',
  'Main Mystery',
]) {
  assert(worldHub.includes(required) || foundation.includes(required), `missing world invariant wording: ${required}`);
}

assert(lifeDeath.includes('Game Over ≠ 現実肉体の死亡'), 'life/death rule must keep Game Over non-death boundary');
assert(lifeDeath.includes('Retryは蘇生ではない'), 'life/death rule must keep Retry non-resurrection boundary');
assert(knowledge.includes('CONFIRMED_SYSTEMIC'), 'knowledge matrix must distinguish systemic confirmation');
assert(mystery.includes('Aを残すためにCを投げない'), 'mystery ledger must preserve Title1 payoff debt rule');
assert(lineup.includes('exact cmはHuman visual review前にCanon化しない'), 'lineup must keep exact heights unfrozen');
assert(sakumei.includes('CANDIDATE') || sakumei.includes('Candidate'), 'Sakumei redesign must remain a candidate before final migration');

console.log(`world setting expansion OK: ${worldSettingExpansionSummary.total} areas / ${worldSettingExpansionSummary.uniqueSourceCount} primary sources`);
