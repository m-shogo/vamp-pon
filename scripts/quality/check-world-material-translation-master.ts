import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const masterPath = 'data/visual/world-material-translation-master-v1.json';
const docPath = 'docs/visual/world-material-translation-master-v1.md';
const exporterPath = 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts';

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
const doc = readFileSync(resolve(root, docPath), 'utf8');
const exporter = readFileSync(resolve(root, exporterPath), 'utf8');

function fail(message: string): never {
  throw new Error(`[world-material-translation] ${message}`);
}

if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('master status is not current');
if (master.doesNotCreateNewStoryCanon !== true) fail('must not create story canon');
if (master.worldbuildingAppearsAsConsequenceNotSticker !== true) fail('consequence-not-sticker rule must remain true');
if (master.personalTasteOverridesWorldDecoration !== true) fail('personal taste must override decorative world shorthand');
if (master.unknownWorldMaterialMayBeInventedByImageModel !== false) fail('image model must not invent unresolved world/material');

const requiredGrammar = [
  'night',
  'route_way_home',
  'paper_record_ledger_label',
  'black_ink',
  'lantern_small_practical_light',
  'old_changing_star_charts',
  'memory_missing_record',
  'repair_binding_folding',
];
for (const key of requiredGrammar) {
  const rule = master.worldGrammar?.[key];
  if (!rule) fail(`missing world grammar: ${key}`);
  if (!Array.isArray(rule.translateAs) || rule.translateAs.length < 2) fail(`${key}: translateAs incomplete`);
  if (!Array.isArray(rule.neverAutomatic) || rule.neverAutomatic.length < 1) fail(`${key}: neverAutomatic missing`);
}

if (!Array.isArray(master.materialQuestionsRequired) || master.materialQuestionsRequired.length < 12) fail('material questions incomplete');
if (!Array.isArray(master.antiGenericWorldDrift) || master.antiGenericWorldDrift.length < 12) fail('anti-generic world drift list incomplete');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) fail('image generation gate incomplete');

const ids = new Set((master.core5 ?? []).map((entry: any) => entry.id));
for (const id of ['yui','asa','nagi','michiru','tomori']) {
  if (!ids.has(id)) fail(`Core5 translation missing: ${id}`);
  const profile = master.core5.find((entry: any) => entry.id === id);
  if (!Array.isArray(profile.materialTranslation) || profile.materialTranslation.length < 4) fail(`${id}: materialTranslation incomplete`);
  if (!Array.isArray(profile.forbiddenWorldDrift) || profile.forbiddenWorldDrift.length < 3) fail(`${id}: forbiddenWorldDrift incomplete`);
}

for (const marker of [
  'Worldbuilding must appear as consequence, not stickers',
  'World grammar never overrides personal taste',
  'OPEN means return to design, not let the model improvise',
]) {
  if (!doc.includes(marker)) fail(`doc marker missing: ${marker}`);
}

for (const marker of [
  'WORLD MATERIAL TRANSLATION MASTER — REQUIRED PRODUCTION VISUAL AUTHORITY.',
  'generationReadyProductionEntrypoint: true',
  'unknownWorldMaterialMayBeInventedByImageModel: false',
  'worldMaterialTranslationMasterPath',
]) {
  if (!exporter.includes(marker)) fail(`production exporter missing marker: ${marker}`);
}

console.log('[world-material-translation] OK: world grammar translated into production material/use rules');
