import {
  CHARACTER_ERA_FORESHADOW_DIALOGUE,
  CHARACTER_ERA_RESERVOIR_RULES,
} from '../../src/game/data/characterEraForeshadowDialogueReservoir.ts';
import {
  CHARACTER_ERA_FINGERPRINTS,
  ERA_FINGERPRINT_RULES,
} from '../../src/game/data/characterEraFingerprintRegistry.ts';
import {
  CHARACTER_ERA_SCENE_SEEDS,
  ERA_SCENE_SEED_RULES,
} from '../../src/game/data/characterEraSceneSeedRegistry.ts';
import {
  CHARACTER_REALITY_ROOT_MAP_ENTRIES,
  CHARACTER_REALITY_ROOT_MAP_RULES,
} from '../../src/game/data/characterRealityRootMapReadModel.ts';

const fail = (message: string): never => {
  throw new Error(`[character-era-continuity] ${message}`);
};

const uniqueIds = (rows: readonly { id?: string; authorId?: string }[], label: string) => {
  const ids = rows.map((row) => row.id ?? row.authorId ?? '');
  if (ids.length !== 36) fail(`${label} must contain 36 characters, got ${ids.length}`);
  if (new Set(ids).size !== 36) fail(`${label} contains duplicate ids`);
  return ids;
};

const eraIds = uniqueIds(CHARACTER_ERA_FORESHADOW_DIALOGUE, 'era reservoir');
const fingerprintIds = uniqueIds(CHARACTER_ERA_FINGERPRINTS, 'fingerprint registry');
const sceneIds = uniqueIds(CHARACTER_ERA_SCENE_SEEDS, 'scene seed registry');
const rootIds = uniqueIds(CHARACTER_REALITY_ROOT_MAP_ENTRIES, 'Reality Root read-model');

const sorted = (ids: readonly string[]) => [...ids].sort().join('|');
if (sorted(eraIds) !== sorted(fingerprintIds)) fail('era/fingerprint id set drift');
if (sorted(eraIds) !== sorted(sceneIds)) fail('era/scene id set drift');
if (sorted(eraIds) !== sorted(rootIds)) fail('era/Reality Root id set drift');

const eraById = new Map(CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => [entry.id, entry]));
const fingerprintById = new Map(CHARACTER_ERA_FINGERPRINTS.map((entry) => [entry.id, entry]));
const sceneById = new Map(CHARACTER_ERA_SCENE_SEEDS.map((entry) => [entry.id, entry]));
const rootById = new Map(CHARACTER_REALITY_ROOT_MAP_ENTRIES.map((entry) => [entry.authorId, entry]));

for (const [id, era] of eraById) {
  const fingerprint = fingerprintById.get(id);
  const scene = sceneById.get(id);
  const root = rootById.get(id);
  if (!fingerprint || !scene || !root) fail(`cross-layer row missing for ${id}`);
  if (fingerprint.lane !== era.lane) fail(`fingerprint lane drift for ${id}`);
  if (fingerprint.assignmentStatus !== era.assignmentStatus) fail(`fingerprint status drift for ${id}`);
  if (root.rosterLayer !== era.pool) fail(`roster layer / era pool drift for ${id}: ${root.rosterLayer} vs ${era.pool}`);
  if (!scene.ordinaryMismatch || !scene.plausibleMisread || !scene.materialOrRecordEvidence || !scene.reinterpretation) {
    fail(`incomplete reveal chain for ${id}`);
  }
  if (!scene.dialogueA || !scene.dialogueB || !scene.objectOrTrace || !scene.forbiddenShortcut) {
    fail(`incomplete dialogue/object boundary for ${id}`);
  }
}

const currentLocks = new Map([
  ['tomori', 'POSTWAR_RECOVERY_SCARCITY'],
  ['michiru', 'GROWTH_POLLUTION_ENERGY_TRANSITION'],
  ['nagi', 'POST_BUBBLE_EARLY_MOBILE_INTERNET'],
  ['yui', 'PRESENT_INFORMATION_ABUNDANCE'],
  ['asa', 'FAR_FUTURE_IDENTITY_COEXISTENCE'],
]);
for (const [id, lane] of currentLocks) {
  const entry = eraById.get(id);
  if (!entry) fail(`missing upstream-current era lock: ${id}`);
  if (entry.assignmentStatus !== 'UPSTREAM_CURRENT') fail(`${id} must remain UPSTREAM_CURRENT`);
  if (entry.lane !== lane) fail(`${id} upstream lane drift: expected ${lane}, got ${entry.lane}`);
}

const asaRoot = rootById.get('asa');
if (!asaRoot || asaRoot.rosterLayer !== 'CURRENT21' || asaRoot.placementKind !== 'FUTURE_ABSTRACT') {
  fail('Asa must prove that Current21 roster layer and Far Future Reality origin are separate concepts');
}

const future15 = CHARACTER_ERA_FORESHADOW_DIALOGUE.filter((entry) => entry.pool === 'FUTURE15');
if (future15.length !== 15) fail(`Future15 era coverage drift: ${future15.length}`);
if (future15.every((entry) => entry.lane === 'FAR_FUTURE_IDENTITY_COEXISTENCE')) {
  fail('Future15 must not collapse into a future-era label');
}

const chloeEra = eraById.get('chloe');
const chloeRoot = rootById.get('chloe');
if (!chloeEra || chloeEra.assignmentStatus !== 'OPEN_SPECIAL' || chloeEra.lane !== 'CROSS_ERA_LONG_LIVED') {
  fail('Chloe cross-era OPEN_SPECIAL boundary drift');
}
if (!chloeRoot || chloeRoot.placementKind !== 'OPEN_UNMAPPED' || chloeRoot.exactCoordinates !== null) {
  fail('Chloe Reality Root must remain Open/unmapped without exact coordinates');
}

const ritsuEra = eraById.get('ritsu');
const koyoriEra = eraById.get('koyori');
const ritsuRoot = rootById.get('ritsu');
const koyoriRoot = rootById.get('koyori');
if (!ritsuEra || !koyoriEra || !ritsuRoot || !koyoriRoot) fail('Ritsu/Koyori continuity rows missing');
if (ritsuEra.lane !== koyoriEra.lane) fail('Ritsu/Koyori household-era lanes must stay aligned unless upstream authority changes');
if (ritsuRoot.root !== koyoriRoot.root) fail('Ritsu/Koyori household Reality Root must stay aligned unless upstream authority changes');

const kaiEra = eraById.get('kai');
const naoEra = eraById.get('nao');
const kaiRoot = rootById.get('kai');
const naoRoot = rootById.get('nao');
const kaiScene = sceneById.get('kai');
const naoScene = sceneById.get('nao');
if (!kaiEra || !naoEra || !kaiRoot || !naoRoot || !kaiScene || !naoScene) fail('Kai/Nao continuity rows missing');
if (kaiEra.lane !== naoEra.lane) fail('Kai/Nao twin-era lanes must stay aligned unless upstream authority changes');
for (const field of ['root', 'incidentArea', 'mobility', 'dialectVisibility'] as const) {
  if (kaiRoot[field] !== naoRoot[field]) fail(`Kai/Nao twin Reality continuity drift in ${field}`);
}
if (kaiScene.dialogueA === naoScene.dialogueA && kaiScene.dialogueB === naoScene.dialogueB && kaiScene.objectOrTrace === naoScene.objectOrTrace) {
  fail('Kai/Nao twin scene seeds must preserve individual reactions instead of collapsing into one personality');
}

if (CHARACTER_ERA_RESERVOIR_RULES.tomoriYuiOfficialConstellationListDiffAllowed !== false) {
  fail('Tomori/Yui official IAU 88 difference must remain forbidden');
}
if (CHARACTER_ERA_RESERVOIR_RULES.future15MeansFutureEra !== false) fail('Future15 era shortcut must remain forbidden');
if (ERA_FINGERPRINT_RULES.oneFingerprintMayProveEra !== false) fail('one fingerprint may not prove era');
if (ERA_SCENE_SEED_RULES.oneSceneMayProveEra !== false) fail('one scene may not prove era');
if (ERA_SCENE_SEED_RULES.sceneMayAutoCanonizeRelationship !== false) fail('dialogue pairing may not canonize a relationship');
if (ERA_SCENE_SEED_RULES.sceneMayAssignStarBeast !== false) fail('scene seed may not assign Star Beast');
if (ERA_SCENE_SEED_RULES.sceneMayAssignObsoleteConstellation !== false) fail('scene seed may not assign obsolete constellation');
if (CHARACTER_REALITY_ROOT_MAP_RULES.rootMayDefinePersonality !== false) fail('Reality Root may not define personality');
if (CHARACTER_REALITY_ROOT_MAP_RULES.exactHomePinAllowed !== false) fail('exact home pin must remain forbidden');

console.log('[character-era-continuity] OK 36 characters across era / fingerprints / scenes / Reality Root');
