import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const jsonPath = 'data/visual/core5-color-application-master-v1.json';
const themePath = 'src/game/data/characterThemeColors.ts';
const handoffPath = 'src/game/data/characterReferenceGenerationHandoff.ts';
const exporterPath = 'tools/asset-factory/scripts/export-character-asset-prompt.ts';

const master = JSON.parse(readFileSync(resolve(root, jsonPath), 'utf8'));
const themeSource = readFileSync(resolve(root, themePath), 'utf8');
const handoff = readFileSync(resolve(root, handoffPath), 'utf8');
const exporter = readFileSync(resolve(root, exporterPath), 'utf8');

function fail(message: string): never {
  throw new Error(`[core5-color-application] ${message}`);
}

if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('status must be current visual production authority extension');
if (master.doesNotReplaceThemeColorCanon !== true) fail('master must not replace theme color canon');
if (master.sharedRules?.hairEyeSkinUnknownMayBeInvented !== false) fail('unknown hair/eye/skin colors must not be inventable');
if (master.sharedRules?.starBeastColorIsDefaultGarmentColor !== false) fail('Star Beast color must not be a default garment color');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 8) fail('image generation gate incomplete');

const expectedIds = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const profiles = new Map((master.characters ?? []).map((entry: any) => [entry.id, entry]));
if (profiles.size !== expectedIds.length) fail(`expected ${expectedIds.length} Core5 profiles, got ${profiles.size}`);

const expectedCanon: Record<string, { theme: string; accent: string; star: string }> = {
  yui: { theme: '#264A86', accent: '#F6B44B', star: '#D6A541' },
  asa: { theme: '#F4A7B9', accent: '#F7D94C', star: '#E0B75D' },
  nagi: { theme: '#7B90D2', accent: '#C7B78B', star: '#D98B77' },
  michiru: { theme: '#2E5C6E', accent: '#D7C447', star: '#9CC8E8' },
  tomori: { theme: '#8F2E14', accent: '#FAD689', star: '#D6A541' },
};

for (const id of expectedIds) {
  const profile: any = profiles.get(id);
  if (!profile) fail(`missing profile: ${id}`);
  const expected = expectedCanon[id];
  if (profile.canonical?.themeHex !== expected.theme) fail(`${id} themeHex drifted: ${profile.canonical?.themeHex}`);
  if (profile.canonical?.accentHex !== expected.accent) fail(`${id} accentHex drifted: ${profile.canonical?.accentHex}`);
  if (profile.canonical?.starBeastHex !== expected.star) fail(`${id} starBeastHex drifted: ${profile.canonical?.starBeastHex}`);
  if (!profile.readTarget) fail(`${id} readTarget missing`);
  if (!Array.isArray(profile.application?.forbidden) || profile.application.forbidden.length < 2) fail(`${id} forbidden color shortcuts incomplete`);
  if (!Array.isArray(profile.application?.accentUse) || profile.application.accentUse.length < 1) fail(`${id} accent placement missing`);
  for (const hex of [expected.theme, expected.accent, expected.star]) {
    if (!themeSource.includes(hex)) fail(`${id} canonical ${hex} not found in ${themePath}`);
  }
}

for (const required of [
  'core5ColorApplicationMasterRequired: true',
  'core5ColorApplicationRequired: boolean',
  'CORE5_COLOR_APPLICATION_DOC',
  'CORE5_COLOR_APPLICATION_DATA',
]) {
  if (!handoff.includes(required)) fail(`handoff missing required marker: ${required}`);
}

for (const required of [
  'CORE5_COLOR_DOC',
  'CORE5_COLOR_JSON',
  'loadColorApplicationProfile',
  'CORE5 COLOR APPLICATION MASTER — REQUIRED COLOR AUTHORITY.',
  'unknownColorMayBeInventedByImageModel: false',
]) {
  if (!exporter.includes(required)) fail(`exporter missing required marker: ${required}`);
}

console.log(`[core5-color-application] OK: ${expectedIds.length} profiles, canonical HEX locked, generation exporter wired`);
