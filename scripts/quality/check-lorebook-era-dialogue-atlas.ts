import fs from 'node:fs';
import {
  buildEraDialogueAtlasProjection,
  writeEraDialogueAtlasProjection,
} from '../lorebook/generate-era-dialogue-atlas.ts';
import {
  CHARACTER_ERA_FORESHADOW_DIALOGUE,
  CHARACTER_ERA_RESERVOIR_RULES,
  characterEraReservoirSummary,
} from '../../src/game/data/characterEraForeshadowDialogueReservoir.ts';
import {
  CHARACTER_ERA_FINGERPRINTS,
  ERA_FINGERPRINT_RULES,
} from '../../src/game/data/characterEraFingerprintRegistry.ts';
import {
  CHARACTER_ERA_SCENE_SEEDS,
  ERA_SCENE_SEED_RULES,
} from '../../src/game/data/characterEraSceneSeedRegistry.ts';

const fail = (message: string): never => {
  throw new Error(`[lorebook-era-dialogue-atlas] ${message}`);
};

const outputPath = writeEraDialogueAtlasProjection();
const generated = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
const expected = buildEraDialogueAtlasProjection();
const ui = fs.readFileSync('public/lorebook/era-dialogue-atlas-enhancement.js', 'utf8');
const css = fs.readFileSync('public/lorebook/era-dialogue-atlas.css', 'utf8');
const enhancements = fs.readFileSync('public/lorebook/enhancements.js', 'utf8');
const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
const gitignore = fs.readFileSync('.gitignore', 'utf8');

if (JSON.stringify(generated) !== JSON.stringify(expected)) fail('generated file drift from projection builder');
if (generated.schemaVersion !== 1) fail('schema version drift');
if (generated.status !== 'AUTHOR_READ_MODEL_GENERATED_NON_CANON') fail('generated projection status drift');
if (generated.generationPolicy !== 'GENERATED_FROM_TYPESCRIPT_DO_NOT_HAND_EDIT') fail('generation policy drift');
if (generated.characterCount !== 36 || generated.characterCount !== characterEraReservoirSummary.total) fail(`character count drift: ${generated.characterCount}`);
if (generated.current21Count !== 21 || generated.current21Count !== characterEraReservoirSummary.current21) fail(`Current21 count drift: ${generated.current21Count}`);
if (generated.future15Count !== 15 || generated.future15Count !== characterEraReservoirSummary.future15) fail(`Future15 count drift: ${generated.future15Count}`);
if (generated.exactYearIncluded !== false || generated.exactAgeIncluded !== false) fail('exact year/age must not be projected');
if (!Array.isArray(generated.entries) || generated.entries.length !== 36) fail('projection must contain 36 entries');

const sourceIds = CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => entry.id);
const generatedIds = generated.entries.map((entry: any) => entry.id);
if (JSON.stringify(generatedIds) !== JSON.stringify(sourceIds)) fail('generated author order/id set drift');
if (new Set(generatedIds).size !== 36) fail('duplicate generated character ids');
if (CHARACTER_ERA_FINGERPRINTS.length !== 36 || CHARACTER_ERA_SCENE_SEEDS.length !== 36) fail('upstream 36-character coverage drift');

for (const entry of generated.entries) {
  const era = CHARACTER_ERA_FORESHADOW_DIALOGUE.find((item) => item.id === entry.id);
  const fingerprint = CHARACTER_ERA_FINGERPRINTS.find((item) => item.id === entry.id);
  const scene = CHARACTER_ERA_SCENE_SEEDS.find((item) => item.id === entry.id);
  if (!era || !fingerprint || !scene) fail(`unresolved generated source row: ${entry.id}`);
  if (entry.name !== era.name || entry.rosterLayer !== era.pool || entry.lane !== era.lane || entry.assignmentStatus !== era.assignmentStatus) fail(`era identity drift: ${entry.id}`);
  if (JSON.stringify(entry.personalAnchors) !== JSON.stringify(fingerprint.personalAnchors)) fail(`personal anchor drift: ${entry.id}`);
  if (JSON.stringify(entry.fingerprints) !== JSON.stringify(fingerprint.fingerprints)) fail(`fingerprint drift: ${entry.id}`);
  if (Object.keys(entry.fingerprints).length !== ERA_FINGERPRINT_RULES.categoriesRequired) fail(`fingerprint dimension count drift: ${entry.id}`);
  for (const category of ERA_FINGERPRINT_RULES.categories) {
    if (!Array.isArray(entry.fingerprints[category]) || entry.fingerprints[category].length < 2) fail(`thin fingerprint category ${entry.id}/${category}`);
  }
  for (const key of ['ordinaryMismatch','plausibleMisread','materialOrRecordEvidence','reinterpretation','dialogueA','dialogueB','objectOrTrace','forbiddenShortcut']) {
    if (entry[key] !== scene[key]) fail(`scene projection drift: ${entry.id}/${key}`);
  }
  for (const forbiddenField of ['exactYear','birthYear','exactAge','age']) {
    if (forbiddenField in entry) fail(`forbidden exact chronology field projected: ${entry.id}/${forbiddenField}`);
  }
}

const derivedLaneCounts = Object.fromEntries([...new Set(CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => entry.lane))].map((lane) => [lane, CHARACTER_ERA_FORESHADOW_DIALOGUE.filter((entry) => entry.lane === lane).length]));
if (JSON.stringify(generated.laneCounts) !== JSON.stringify(derivedLaneCounts)) fail('lane count drift');

if (CHARACTER_ERA_RESERVOIR_RULES.exactYearFrozen !== false) fail('source exact-year guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.future15MeansFutureEra !== false) fail('source Future15 guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.oneEvidenceMayRevealEra !== false) fail('source one-evidence guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.tomoriYuiOfficialConstellationListDiffAllowed !== false) fail('source Tomori/Yui official-list guard drift');
if (ERA_FINGERPRINT_RULES.oneFingerprintMayProveEra !== false) fail('fingerprint one-clue guard drift');
if (ERA_SCENE_SEED_RULES.oneSceneMayProveEra !== false) fail('scene one-clue guard drift');
if (ERA_SCENE_SEED_RULES.sceneMayAutoCanonizeRelationship !== false) fail('scene relationship guard drift');
if (ERA_SCENE_SEED_RULES.sceneMayAssignStarBeast !== false) fail('scene Star Beast guard drift');
if (ERA_SCENE_SEED_RULES.sceneMayAssignObsoleteConstellation !== false) fail('scene obsolete-constellation guard drift');

for (const token of [
  '36 CHARACTER / ERA DIALOGUE ATLAS',
  'ORDINARY MISMATCH',
  'PLAUSIBLE MISREAD',
  'MATERIAL OR RECORD',
  'REINTERPRETATION',
  '9 ERA FINGERPRINT DIMENSIONS',
  'one clue != era proof',
  'Future15 != future era',
]) if (!ui.includes(token)) fail(`Era Dialogue UI contract missing: ${token}`);

for (const token of ['.era-dialogue-atlas','.era-dialogue-grid','.era-dialogue-card','.era-reveal-sequence','.era-dialogue-pair','.era-fingerprint-details']) {
  if (!css.includes(token)) fail(`Era Dialogue CSS contract missing: ${token}`);
}
if (!enhancements.includes("'./era-dialogue-atlas-enhancement.js'")) fail('Era Dialogue Atlas module not registered');
if (!viteConfig.includes("writeEraDialogueAtlasProjection();")) fail('Vite startup must generate Era Dialogue projection');
if (!viteConfig.includes("./scripts/lorebook/generate-era-dialogue-atlas.ts")) fail('Vite generator import missing');
if (!gitignore.includes('public/lorebook/data/era-dialogue-atlas.v1.json')) fail('generated projection must stay out of Git authority');

console.log(`[lorebook-era-dialogue-atlas] OK ${generated.characterCount} characters / ${generated.current21Count} Current21 / ${generated.future15Count} Future15 / generated from TS`);
