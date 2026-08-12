import { CHARACTER_ERA_SCENE_SEEDS, ERA_SCENE_SEED_COVERAGE, ERA_SCENE_SEED_RULES } from '../../src/game/data/characterEraSceneSeedRegistry.ts';
import { CHARACTER_ERA_FINGERPRINTS } from '../../src/game/data/characterEraFingerprintRegistry.ts';

const fail = (message: string): never => { throw new Error(`[character-era-scene-seeds] ${message}`); };

if (CHARACTER_ERA_SCENE_SEEDS.length !== ERA_SCENE_SEED_RULES.characterCountRequired) {
  fail(`expected ${ERA_SCENE_SEED_RULES.characterCountRequired}, got ${CHARACTER_ERA_SCENE_SEEDS.length}`);
}
const ids = new Set<string>();
for (const entry of CHARACTER_ERA_SCENE_SEEDS) {
  if (ids.has(entry.id)) fail(`duplicate id: ${entry.id}`);
  ids.add(entry.id);
  for (const key of ['ordinaryMismatch','plausibleMisread','materialOrRecordEvidence','reinterpretation','dialogueA','dialogueB','objectOrTrace','forbiddenShortcut'] as const) {
    if (!entry[key].trim()) fail(`${entry.id}: missing ${key}`);
  }
  const joined = Object.values(entry).join(' ');
  if (/\b(19|20|21|22)\d{2}\b/.test(joined)) fail(`${entry.id}: exact year leaked into scene seed`);
  if (/official IAU 88.*different|88星座.*違/.test(joined)) fail(`${entry.id}: unsafe official constellation-list implication`);
}
const fingerprintIds = new Set(CHARACTER_ERA_FINGERPRINTS.map((entry) => entry.id));
for (const id of ids) if (!fingerprintIds.has(id)) fail(`unknown character id: ${id}`);
for (const id of fingerprintIds) if (!ids.has(id)) fail(`missing scene seed for: ${id}`);
if (ERA_SCENE_SEED_COVERAGE.some((entry) => !entry.hasFingerprint)) fail('scene seed without fingerprint');
if (ERA_SCENE_SEED_RULES.future15MeansFutureEra) fail('Future15 must not mean future era');
if (ERA_SCENE_SEED_RULES.oneSceneMayProveEra) fail('one scene must not prove era');
if (ERA_SCENE_SEED_RULES.sceneMayAssignStarBeast || ERA_SCENE_SEED_RULES.sceneMayAssignObsoleteConstellation) fail('scene seed must not assign Star Beast/obsolete constellation');
if (ERA_SCENE_SEED_RULES.runtimeAutoPromotionAllowed) fail('runtime auto-promotion must remain false');

for (const required of ['tomori','michiru','nagi','yui','asa','shiro','chloe','noa','rum','kai','nao']) {
  if (!ids.has(required)) fail(`missing key reveal character: ${required}`);
}

console.log(`[character-era-scene-seeds] OK ${CHARACTER_ERA_SCENE_SEEDS.length}/36`);
