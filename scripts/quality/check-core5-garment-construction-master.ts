import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const masterPath = 'data/visual/core5-garment-construction-master-v1.json';
const worldPath = 'data/visual/world-material-translation-master-v1.json';
const livingPath = 'data/visual/core5-living-visual-profiles-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts';

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
const world = JSON.parse(readFileSync(resolve(root, worldPath), 'utf8'));
const living = JSON.parse(readFileSync(resolve(root, livingPath), 'utf8'));
const exporter = readFileSync(resolve(root, exporterPath), 'utf8');

function fail(message: string): never {
  throw new Error(`[core5-garment-construction] ${message}`);
}

if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('master status is not current');
if (master.doesNotCreateNewStoryCanon !== true) fail('must not create new story canon');
if (master.doesNotPromoteAuthorCandidates !== true) fail('candidate promotion guard weakened');
if (master.unknownGarmentDetailMayBeInventedByImageModel !== false) fail('image-model garment invention must remain disabled');
if (master.sharedRules?.worldbuildingAppearsThroughConstruction !== true) fail('world construction rule missing');
if (master.sharedRules?.garmentMustBeWearable !== true) fail('wearability rule missing');
if (master.sharedRules?.storageMustHaveContents !== true) fail('storage contents rule missing');
if (master.sharedRules?.repairMustHaveCause !== true) fail('repair cause rule missing');
if (master.sharedRules?.hardwareMustHaveFunction !== true) fail('hardware function rule missing');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) fail('generation gate incomplete');
if (!Array.isArray(world.translationChannels) || !world.translationChannels.includes('pocket_storage_logic')) fail('world material storage channel missing');

const ids = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const profiles = new Map((master.characters ?? []).map((entry: any) => [entry.id, entry]));
const livingProfiles = new Map((living.characters ?? []).map((entry: any) => [entry.id, entry]));
if (profiles.size !== 5) fail(`expected 5 profiles, got ${profiles.size}`);

for (const id of ids) {
  const p: any = profiles.get(id);
  const lp: any = livingProfiles.get(id);
  if (!p) fail(`${id}: garment profile missing`);
  if (!lp) fail(`${id}: living visual profile missing`);
  for (const key of ['primaryMaterials','garmentConstruction','closures','storage','footwear','wearLocations','repairLocations','worldTranslation','propInterference','forbidden']) {
    if (!Array.isArray(p[key]) || p[key].length === 0) fail(`${id}: ${key} missing`);
  }
  for (const key of ['weight','stiffness','fold','reflection','repairability']) {
    if (typeof p.materialBehavior?.[key] !== 'string' || !p.materialBehavior[key]) fail(`${id}: materialBehavior.${key} missing`);
  }
  if (!Array.isArray(lp.positivePreference) || lp.positivePreference.length < 5) fail(`${id}: living visual positivePreference weak`);
  if (!Array.isArray(lp.absoluteNever) || lp.absoluteNever.length < 5) fail(`${id}: living visual absoluteNever weak`);
  if (p.forbidden.length < 6) fail(`${id}: garment forbidden list too weak`);
}

for (const marker of [
  'CORE5_GARMENT_DOC',
  'CORE5_GARMENT_JSON',
  'loadCore5GarmentProfile',
  'CORE5 GARMENT CONSTRUCTION MASTER — STRONGER DEDICATED OVERRIDE.',
  'ALL CHARACTER GARMENT PRODUCTION MASTER — REQUIRED FOR EVERY CHARACTER.',
  'unknownGarmentDetailMayBeInventedByImageModel: false',
  'core5GarmentConstructionRequired: CORE5_IDS.has(options.characterId)',
]) {
  if (!exporter.includes(marker)) fail(`production exporter missing marker: ${marker}`);
}

console.log('[core5-garment-construction] OK: Core5 dedicated garment authority preserved inside all-character production exporter');
