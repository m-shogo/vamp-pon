import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const masterPath = 'data/visual/all-character-garment-production-master-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts';
const livingPaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[all-character-garment-production] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('master status must be current');
if (master.scopeCount !== 36) fail('scopeCount must be 36');
if (master.doesNotCreateNewStoryCanon !== true || master.doesNotPromoteAuthorCandidates !== true) fail('provenance guards weakened');
if (master.unknownGarmentDetailMayBeInventedByImageModel !== false) fail('image-model garment invention must remain disabled');
if (master.sharedRules?.genericHumanGarmentTemplateForNonHumansAllowed !== false) fail('non-human humanization guard weakened');
if (master.sharedRules?.representationTraitMayGenerateCostumeShorthand !== false) fail('representation shorthand guard weakened');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 14) fail('image generation gate incomplete');

const allProfiles: any[] = [];
for (const path of livingPaths) {
  const doc = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  if (!Array.isArray(doc.characters)) fail(`${path}: characters missing`);
  for (const profile of doc.characters) {
    profile.__sourcePath = path;
    profile.__sourceStatus = doc.status ?? null;
    allProfiles.push(profile);
  }
}

if (allProfiles.length !== 36) fail(`expected 36 Living Visual profiles, got ${allProfiles.length}`);
const ids = allProfiles.map((x) => x.id);
if (new Set(ids).size !== 36) fail('Living Visual profile IDs are not unique');

for (const profile of allProfiles) {
  if (!profile.id) fail('profile missing id');
  if (!Array.isArray(profile.absoluteNever) || profile.absoluteNever.length < 5) fail(`${profile.id}: absoluteNever incomplete`);
  if (!Array.isArray(profile.positivePreference) || profile.positivePreference.length < 5) fail(`${profile.id}: positivePreference incomplete`);

  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types',
    resolve(root, exporterPath),
    '--character', profile.id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const exported = JSON.parse(stdout);

  if (exported.generationReadyProductionEntrypoint !== true) fail(`${profile.id}: not generation-ready entrypoint`);
  if (exported.allCharacterGarmentProductionRequired !== true) fail(`${profile.id}: all-character garment master not required`);
  if (!exported.allCharacterGarmentProductionProfile) fail(`${profile.id}: resolved garment profile missing`);
  if (exported.allCharacterGarmentProductionProfile.id !== profile.id) fail(`${profile.id}: resolved garment profile mismatch`);
  if (exported.allCharacterGarmentProductionProfile.sourceProfilePath !== profile.__sourcePath) fail(`${profile.id}: source path mismatch`);
  if (exported.unknownGarmentDetailMayBeInventedByImageModel !== false) fail(`${profile.id}: garment invention guard weakened`);
  if (!exported.authorityOrder.includes('docs/visual/all-character-garment-production-master-v1.md')) fail(`${profile.id}: master missing from authority order`);
  if (!exported.prompt.includes('ALL CHARACTER GARMENT PRODUCTION MASTER — REQUIRED FOR EVERY CHARACTER.')) fail(`${profile.id}: master prompt block missing`);
  if (!exported.prompt.includes('CHARACTER-SPECIFIC RESOLVED GARMENT PRODUCTION PROFILE — REQUIRED.')) fail(`${profile.id}: resolved profile prompt block missing`);
}

console.log(`[all-character-garment-production] OK: ${allProfiles.length}/36 characters resolve source-preserving garment production profiles`);
