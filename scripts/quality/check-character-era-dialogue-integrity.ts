import { CHARACTER_ERA_SCENE_SEEDS, ERA_SCENE_SEED_RULES } from '../../src/game/data/characterEraSceneSeedRegistry.ts';
import { CHARACTER_ERA_FINGERPRINTS } from '../../src/game/data/characterEraFingerprintRegistry.ts';
import { CHARACTER_ERA_FORESHADOW_DIALOGUE, CHARACTER_ERA_RESERVOIR_RULES } from '../../src/game/data/characterEraForeshadowDialogueReservoir.ts';

const fail = (message: string): never => {
  throw new Error(`[character-era-dialogue-integrity] ${message}`);
};

if (CHARACTER_ERA_SCENE_SEEDS.length !== 36) fail(`expected 36 scene seeds, got ${CHARACTER_ERA_SCENE_SEEDS.length}`);

const ids = CHARACTER_ERA_SCENE_SEEDS.map((entry) => entry.id);
if (new Set(ids).size !== 36) fail('duplicate scene-seed ids');
const fingerprintIds = new Set(CHARACTER_ERA_FINGERPRINTS.map((entry) => entry.id));
const eraIds = new Set(CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => entry.id));
for (const id of ids) {
  if (!fingerprintIds.has(id)) fail(`scene character missing fingerprint row: ${id}`);
  if (!eraIds.has(id)) fail(`scene character missing era row: ${id}`);
}

const sceneFields = [
  'ordinaryMismatch',
  'plausibleMisread',
  'materialOrRecordEvidence',
  'reinterpretation',
  'dialogueA',
  'dialogueB',
  'objectOrTrace',
  'forbiddenShortcut',
] as const;

const normalizeDialogue = (value: string) => value.replace(/[「」『』…。、！？!?\s]/g, '').toLowerCase();
const dialogueSeen = new Map<string, string>();
const sceneSignatures = new Map<string, string>();

for (const entry of CHARACTER_ERA_SCENE_SEEDS) {
  for (const field of sceneFields) {
    if (!entry[field].trim()) fail(`empty ${field}: ${entry.id}`);
  }

  if (entry.dialogueA.trim() === entry.dialogueB.trim()) fail(`dialogue A/B identical: ${entry.id}`);
  for (const [slot, line] of [['A', entry.dialogueA], ['B', entry.dialogueB]] as const) {
    const normalized = normalizeDialogue(line);
    if (normalized.length < 4) fail(`dialogue too thin to identify a voice seed: ${entry.id}/${slot}`);
    const prior = dialogueSeen.get(normalized);
    if (prior) fail(`normalized duplicate dialogue: ${prior} / ${entry.id}/${slot}`);
    dialogueSeen.set(normalized, `${entry.id}/${slot}`);
  }

  const signature = sceneFields.map((field) => entry[field].trim()).join('\u241f');
  const priorScene = sceneSignatures.get(signature);
  if (priorScene) fail(`full scene template duplicated: ${priorScene} / ${entry.id}`);
  sceneSignatures.set(signature, entry.id);
}

const exactChronologyPatterns = [
  /(?:18|19|20)\d{2}年/,
  /(?:18|19|20)\d{2}年代/,
  /昭和\s*\d+年/,
  /平成\s*\d+年/,
  /令和\s*\d+年/,
  /\d{1,3}歳/,
];
const directEraAnnouncementPatterns = [
  /私は.*時代.*(?:生まれ|出身|育ち)/,
  /俺は.*時代.*(?:生まれ|出身|育ち)/,
  /僕は.*時代.*(?:生まれ|出身|育ち)/,
  /私の時代では/,
  /俺の時代では/,
  /僕の時代では/,
];
const placeholderPatterns = [/<TODO>/i, /\bTBD\b/i, /\bFIXME\b/i, /placeholder/i];

for (const entry of CHARACTER_ERA_SCENE_SEEDS) {
  const combined = sceneFields.map((field) => entry[field]).join('\n');
  for (const pattern of exactChronologyPatterns) {
    if (pattern.test(combined)) fail(`exact chronology leaked into scene seed: ${entry.id} / ${pattern}`);
  }
  for (const pattern of directEraAnnouncementPatterns) {
    if (pattern.test(`${entry.dialogueA}\n${entry.dialogueB}`)) fail(`era exposition leaked into dialogue: ${entry.id} / ${pattern}`);
  }
  for (const pattern of placeholderPatterns) {
    if (pattern.test(combined)) fail(`placeholder leaked into scene seed: ${entry.id} / ${pattern}`);
  }
}

const tomori = CHARACTER_ERA_SCENE_SEEDS.find((entry) => entry.id === 'tomori');
if (!tomori) fail('Tomori scene seed missing');
if (!tomori.forbiddenShortcut.includes('現代と異なる公式88星座')) fail('Tomori official-88 shortcut guard missing');

const kai = CHARACTER_ERA_SCENE_SEEDS.find((entry) => entry.id === 'kai');
const nao = CHARACTER_ERA_SCENE_SEEDS.find((entry) => entry.id === 'nao');
if (!kai || !nao) fail('Kai/Nao scene seeds missing');
if (kai.dialogueA === nao.dialogueA || kai.dialogueB === nao.dialogueB || kai.objectOrTrace === nao.objectOrTrace) {
  fail('Kai/Nao twins must remain individually distinguishable in dialogue/trace seeds');
}

if (ERA_SCENE_SEED_RULES.exactYearAllowed !== false || ERA_SCENE_SEED_RULES.exactAgeAllowed !== false) fail('scene exact chronology guards drift');
if (ERA_SCENE_SEED_RULES.oneSceneMayProveEra !== false) fail('one-scene era proof guard drift');
if (ERA_SCENE_SEED_RULES.sceneMayAutoCanonizeRelationship !== false) fail('relationship auto-Canon guard drift');
if (ERA_SCENE_SEED_RULES.sceneMayAssignStarBeast !== false) fail('Star Beast auto-assignment guard drift');
if (ERA_SCENE_SEED_RULES.sceneMayAssignObsoleteConstellation !== false) fail('obsolete constellation auto-assignment guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.tomoriYuiOfficialConstellationListDiffAllowed !== false) fail('Tomori/Yui official-list source guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.future15MeansFutureEra !== false) fail('Future15 era shortcut source guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.oldEraMeansIgnorant !== false) fail('old-era ignorance shortcut source guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.futureEraMeansSuperior !== false) fail('future-era superiority shortcut source guard drift');

console.log(`[character-era-dialogue-integrity] OK 36 scene signatures / ${dialogueSeen.size} unique dialogue lines / no exact chronology exposition`);
