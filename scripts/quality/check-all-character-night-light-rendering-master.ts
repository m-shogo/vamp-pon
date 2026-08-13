import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const masterPath = 'data/visual/all-character-night-light-rendering-master-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts';
const livingPaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[all-character-night-light] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('master status must be current');
if (master.scopeCount !== 36) fail('scopeCount must be 36');
if (master.doesNotCreateNewStoryCanon !== true) fail('must not create story canon');
if (master.renderingMayRedesignCharacter !== false) fail('rendering redesign must remain disabled');
if (master.unknownLightSourceMayBeInventedByImageModel !== false) fail('unknown light source invention must remain disabled');
if (master.nightIsPalettePreset !== false) fail('night may not be palette preset');
if (master.sharedRules?.genericBlueNightFilterAllowed !== false) fail('generic blue-night filter guard weakened');
if (master.sharedRules?.skinToneMayShiftForNightMood !== false) fail('skin-tone preservation guard weakened');
if (master.sharedRules?.bodyMayBeSlimmedByShadow !== false) fail('body preservation guard weakened');
if (master.sharedRules?.starBeastColorIsFreeGlow !== false) fail('Star Beast glow guard weakened');
if (!Array.isArray(master.reviewTests) || master.reviewTests.length < 8) fail('review tests incomplete');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) fail('image generation gate incomplete');

const profiles: any[] = [];
for (const path of livingPaths) {
  const doc = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  for (const p of doc.characters ?? []) profiles.push(p);
}
if (profiles.length !== 36 || new Set(profiles.map((p) => p.id)).size !== 36) fail('expected 36 unique Living Visual profiles');

for (const p of profiles) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath),
    '--character', p.id, '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  const light = exported.allCharacterNightLightRenderingProfile;
  if (exported.allCharacterNightLightRenderingRequired !== true) fail(`${p.id}: night/light master not required`);
  if (!light || light.id !== p.id) fail(`${p.id}: resolved night/light profile missing`);
  if (exported.unknownLightSourceMayBeInventedByImageModel !== false) fail(`${p.id}: light-source invention guard weakened`);
  if (exported.renderingMayRedesignCharacter !== false) fail(`${p.id}: rendering redesign guard weakened`);
  if (!exported.authorityOrder.includes('docs/visual/all-character-night-light-rendering-master-v1.md')) fail(`${p.id}: light master missing from authority order`);
  if (!exported.prompt.includes('ALL CHARACTER NIGHT / LIGHT RENDERING MASTER — REQUIRED FOR EVERY CHARACTER.')) fail(`${p.id}: light master prompt block missing`);
  if (!exported.prompt.includes('CHARACTER-SPECIFIC RESOLVED NIGHT/LIGHT PROFILE — REQUIRED.')) fail(`${p.id}: resolved light profile block missing`);
  if (!Array.isArray(light.absoluteNever) || light.absoluteNever.length < 5) fail(`${p.id}: light profile lost absoluteNever`);
  if (!Array.isArray(light.positivePreference) || light.positivePreference.length < 5) fail(`${p.id}: light profile lost positivePreference`);
}

console.log(`[all-character-night-light] OK: ${profiles.length}/36 characters resolve world-grounded night/light rendering profiles`);
