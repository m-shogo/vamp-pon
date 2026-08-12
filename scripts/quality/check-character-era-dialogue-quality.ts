import { CHARACTER_ERA_SCENE_SEEDS, ERA_SCENE_SEED_RULES } from '../../src/game/data/characterEraSceneSeedRegistry.ts';
import { CHARACTER_ERA_FINGERPRINTS } from '../../src/game/data/characterEraFingerprintRegistry.ts';
import { CHARACTER_ERA_FORESHADOW_DIALOGUE } from '../../src/game/data/characterEraForeshadowDialogueReservoir.ts';

const fail = (message: string): never => {
  throw new Error(`[character-era-dialogue-quality] ${message}`);
};

const mode = process.env.ERA_DIALOGUE_QUALITY_MODE ?? 'all';
const runs = (target: 'duplicates' | 'substance' | 'chronology' | 'boundaries') => mode === 'all' || mode === target;

if (CHARACTER_ERA_SCENE_SEEDS.length !== 36) fail(`expected 36 scene seeds, got ${CHARACTER_ERA_SCENE_SEEDS.length}`);
const ids = CHARACTER_ERA_SCENE_SEEDS.map((entry) => entry.id);
if (new Set(ids).size !== 36) fail('duplicate scene-seed ids');
const fingerprintIds = new Set(CHARACTER_ERA_FINGERPRINTS.map((entry) => entry.id));
const eraIds = new Set(CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => entry.id));
for (const id of ids) {
  if (!fingerprintIds.has(id)) fail(`scene character missing fingerprint row: ${id}`);
  if (!eraIds.has(id)) fail(`scene character missing era row: ${id}`);
}

const fields = [
  'ordinaryMismatch',
  'plausibleMisread',
  'materialOrRecordEvidence',
  'reinterpretation',
  'dialogueA',
  'dialogueB',
  'objectOrTrace',
  'forbiddenShortcut',
] as const;

let dialogueLineCount = 0;

if (runs('duplicates')) {
  for (const field of fields) {
    const seen = new Map<string, string>();
    for (const entry of CHARACTER_ERA_SCENE_SEEDS) {
      const value = entry[field].trim();
      if (!value) fail(`empty ${field}: ${entry.id}`);
      const prior = seen.get(value);
      if (prior) fail(`exact duplicate ${field}: ${prior} / ${entry.id} -> ${value}`);
      seen.set(value, entry.id);
    }
  }

  const dialogueSeen = new Map<string, string>();
  for (const entry of CHARACTER_ERA_SCENE_SEEDS) {
    for (const [slot, value] of [['A', entry.dialogueA], ['B', entry.dialogueB]] as const) {
      const normalized = value.replace(/[「」『』…。、！？!?\s]/g, '').toLowerCase();
      if (normalized.length < 4) fail(`dialogue too thin for duplicate comparison: ${entry.id}/${slot}`);
      const prior = dialogueSeen.get(normalized);
      if (prior) fail(`normalized duplicate dialogue: ${prior} / ${entry.id}/${slot}`);
      dialogueSeen.set(normalized, `${entry.id}/${slot}`);
    }
    if (entry.dialogueA.trim() === entry.dialogueB.trim()) fail(`dialogue A/B identical: ${entry.id}`);
  }
  dialogueLineCount = dialogueSeen.size;

  const allObjects = CHARACTER_ERA_SCENE_SEEDS.map((entry) => entry.objectOrTrace.trim());
  if (new Set(allObjects).size !== 36) fail('object/trace layer must stay individually distinguishable across all 36 characters');
}

if (runs('substance')) {
  for (const entry of CHARACTER_ERA_SCENE_SEEDS) {
    if (entry.dialogueA.replace(/[「」『』…。、！？!?\s]/g, '').length < 4) fail(`dialogueA too thin: ${entry.id}`);
    if (entry.dialogueB.replace(/[「」『』…。、！？!?\s]/g, '').length < 4) fail(`dialogueB too thin: ${entry.id}`);
    if (entry.ordinaryMismatch.length < 12) fail(`ordinary mismatch too thin: ${entry.id}`);
    if (entry.plausibleMisread.length < 10) fail(`plausible misread too thin: ${entry.id}`);
    if (entry.materialOrRecordEvidence.length < 12) fail(`material/record evidence too thin: ${entry.id}`);
    if (entry.reinterpretation.length < 12) fail(`reinterpretation too thin: ${entry.id}`);
    if (entry.objectOrTrace.length < 5) fail(`object/trace too thin: ${entry.id}`);
    if (entry.forbiddenShortcut.length < 8) fail(`forbidden shortcut too thin: ${entry.id}`);
  }
}

if (runs('chronology')) {
  const exactChronologyPatterns = [
    /(?:18|19|20)\d{2}年/,
    /(?:18|19|20)\d{2}年代/,
    /昭和\s*\d+年/,
    /平成\s*\d+年/,
    /令和\s*\d+年/,
    /\d{1,3}歳/,
  ];
  for (const entry of CHARACTER_ERA_SCENE_SEEDS) {
    const combined = fields.map((field) => entry[field]).join('\n');
    for (const pattern of exactChronologyPatterns) {
      if (pattern.test(combined)) fail(`exact chronology leaked into scene seed: ${entry.id} / ${pattern}`);
    }
  }

  const directEraAnnouncementPatterns = [
    /私は.*時代.*(?:生まれ|出身|育ち)/,
    /俺は.*時代.*(?:生まれ|出身|育ち)/,
    /僕は.*時代.*(?:生まれ|出身|育ち)/,
    /私の時代では/,
    /俺の時代では/,
    /僕の時代では/,
  ];
  for (const entry of CHARACTER_ERA_SCENE_SEEDS) {
    const dialogue = `${entry.dialogueA}\n${entry.dialogueB}`;
    for (const pattern of directEraAnnouncementPatterns) {
      if (pattern.test(dialogue)) fail(`era exposition leaked into dialogue: ${entry.id} / ${pattern}`);
    }
  }
}

if (runs('boundaries')) {
  const candidateTomori = CHARACTER_ERA_SCENE_SEEDS.find((entry) => entry.id === 'tomori');
  if (!candidateTomori) fail('Tomori scene seed missing');
  if (!candidateTomori.forbiddenShortcut.includes('現代と異なる公式88星座')) fail('Tomori official-88 shortcut guard missing');

  const yomo = CHARACTER_ERA_SCENE_SEEDS.find((entry) => entry.id === 'yomo');
  if (!yomo) fail('Yomo scene seed missing');
  if (yomo.objectOrTrace.toLowerCase().includes('felis') && !yomo.forbiddenShortcut.includes('星獣')) {
    fail('Yomo/Felis motif must not lose Star Beast assignment guard');
  }

  const kai = CHARACTER_ERA_SCENE_SEEDS.find((entry) => entry.id === 'kai');
  const nao = CHARACTER_ERA_SCENE_SEEDS.find((entry) => entry.id === 'nao');
  if (!kai || !nao) fail('Kai/Nao scene seeds missing');
  if (kai.dialogueA === nao.dialogueA || kai.dialogueB === nao.dialogueB || kai.objectOrTrace === nao.objectOrTrace) {
    fail('Kai/Nao twins must not collapse into identical dialogue/trace seeds');
  }

  if (ERA_SCENE_SEED_RULES.exactYearAllowed !== false || ERA_SCENE_SEED_RULES.exactAgeAllowed !== false) fail('scene exact chronology guards drift');
  if (ERA_SCENE_SEED_RULES.oneSceneMayProveEra !== false) fail('one-scene era proof guard drift');
  if (ERA_SCENE_SEED_RULES.sceneMayAutoCanonizeRelationship !== false) fail('relationship auto-Canon guard drift');
  if (ERA_SCENE_SEED_RULES.sceneMayAssignStarBeast !== false) fail('Star Beast auto-assignment guard drift');
  if (ERA_SCENE_SEED_RULES.sceneMayAssignObsoleteConstellation !== false) fail('obsolete constellation auto-assignment guard drift');
}

console.log(`[character-era-dialogue-quality] OK mode=${mode}${dialogueLineCount ? ` / ${dialogueLineCount} unique dialogue lines` : ''}`);
