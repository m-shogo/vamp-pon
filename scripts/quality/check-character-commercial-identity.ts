import {
  CHARACTER_COMMERCIAL_IDENTITY_POLICY,
  characterCommercialIdentities,
} from '../../src/game/data/characterCommercialIdentity.ts';
import { CURRENT21_SILHOUETTE_IDS } from '../../src/game/data/current21SilhouetteMatrix.ts';

let failed = false;
const fail = (message: string) => {
  failed = true;
  console.error(`FAIL: ${message}`);
};

const ids = characterCommercialIdentities.map((entry) => entry.characterId).sort();
const expectedIds = [...CURRENT21_SILHOUETTE_IDS].sort();
if (characterCommercialIdentities.length !== CHARACTER_COMMERCIAL_IDENTITY_POLICY.expectedCount) {
  fail(`commercial identity count must be ${CHARACTER_COMMERCIAL_IDENTITY_POLICY.expectedCount}; got ${characterCommercialIdentities.length}`);
}
if (new Set(ids).size !== ids.length) fail('duplicate commercial character id');
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) {
  fail(`Current21 commercial coverage drift: ${ids.join(',')}`);
}

const current20 = characterCommercialIdentities.filter((entry) => entry.scope === 'current20');
const reserve = characterCommercialIdentities.filter((entry) => entry.scope === 'official_reserve');
if (current20.length !== CHARACTER_COMMERCIAL_IDENTITY_POLICY.current20Count) {
  fail(`Current20 commercial identity count must be ${CHARACTER_COMMERCIAL_IDENTITY_POLICY.current20Count}; got ${current20.length}`);
}
if (reserve.length !== 1 || reserve[0]?.characterId !== 'ren') fail('Ren must remain the only official_reserve commercial identity');
if (reserve[0]?.status !== 'RESERVE_COMMERCIAL_CANDIDATE') fail('Ren commercial status must remain candidate-only');

for (const entry of characterCommercialIdentities) {
  for (const key of ['displayName','characterHook','themeHex','starBeast','namedObject','silhouetteLane','premiumCandidate'] as const) {
    if (!entry[key]) fail(`${entry.characterId}: missing ${key}`);
  }
  if (!/^#[0-9A-F]{6}$/.test(entry.themeHex)) fail(`${entry.characterId}: invalid uppercase theme HEX ${entry.themeHex}`);
  if (entry.relationshipHooks.length < 2) fail(`${entry.characterId}: requires 2+ relationship hooks`);
  if (entry.entryGoods.length < 2) fail(`${entry.characterId}: requires 2+ entry goods`);
  if (entry.coreGoods.length < 2) fail(`${entry.characterId}: requires 2+ core goods`);
  if (entry.sceneHooks.length < 2) fail(`${entry.characterId}: requires 2+ scene hooks`);
  if (entry.commercialAvoid.length < 2) fail(`${entry.characterId}: commercial guardrails too weak`);
  if (JSON.stringify(entry.popularityAxes) !== JSON.stringify(CHARACTER_COMMERCIAL_IDENTITY_POLICY.popularityAxes)) {
    fail(`${entry.characterId}: popularity axes drift`);
  }
}

const themeHexes = characterCommercialIdentities.map((entry) => entry.themeHex);
if (new Set(themeHexes).size !== themeHexes.length) fail('Current21 primary commercial Theme HEX must remain unique');

const hana = characterCommercialIdentities.find((entry) => entry.characterId === 'hana');
const kaname = characterCommercialIdentities.find((entry) => entry.characterId === 'kage1');
if (!hana || !kaname) fail('Hana/Kaname commercial identities missing');
if (!hana?.characterHook.includes('ぽっちゃり年長女性')) fail('Hana body identity commercial framing drift');
if (!kaname?.characterHook.includes('ぽっちゃり若年男性')) fail('Kaname body identity commercial framing drift');
for (const token of ['体重/XXL joke', '人気都合の細身化', 'fetish方向の誇張']) {
  if (!hana?.commercialAvoid.some((item) => item.includes(token))) fail(`Hana commercial body guard missing: ${token}`);
}
for (const token of ['重量級/XXL joke', '人気都合の細身化/bodybuilder化', 'fetish方向の誇張']) {
  if (!kaname?.commercialAvoid.some((item) => item.includes(token))) fail(`Kaname commercial body guard missing: ${token}`);
}
for (const relation of ['ツムギ', 'シロ']) if (!hana?.relationshipHooks.includes(relation)) fail(`Hana relationship hook missing: ${relation}`);
for (const relation of ['ナギ', 'リツ']) if (!kaname?.relationshipHooks.includes(relation)) fail(`Kaname relationship hook missing: ${relation}`);
if (!hana?.premiumCandidate.includes('生活道具')) fail('Hana premium should remain life-object based, not body-size based');
if (!kaname?.premiumCandidate.includes('受け灯の腕帯')) fail('Kaname premium should remain Named Object based');

const forbiddenPolicyTokens = ['body shape', 'relationship type', 'Main Mystery truth', 'Named Object truth'];
for (const token of forbiddenPolicyTokens) {
  if (!CHARACTER_COMMERCIAL_IDENTITY_POLICY.popularityMustNotChange.includes(token)) {
    fail(`commercial popularity firewall missing: ${token}`);
  }
}

console.log('Character commercial identity OK');
console.log(`  Current21: ${characterCommercialIdentities.length}/21`);
console.log(`  Current20: ${current20.length}/20`);
console.log(`  Reserve: ${reserve.map((entry) => entry.displayName).join(', ')}`);
console.log('  Popularity axes: character / star beast / relationship / collect / story / scene');
console.log('  Hana/Kaname body identity remains a visual fact, never a sales-retcon lever.');

if (failed) process.exit(1);
