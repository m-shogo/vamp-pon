import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const geometryPath = 'data/visual/core5-identity-geometry-master-v1.json';
const sourcePath = 'src/game/data/characterAppearanceGenerationContracts.ts';
const handoffPath = 'src/game/data/characterReferenceGenerationHandoff.ts';
const exporterPath = 'tools/asset-factory/scripts/export-character-asset-prompt.ts';

const master = JSON.parse(readFileSync(resolve(root, geometryPath), 'utf8'));
const source = readFileSync(resolve(root, sourcePath), 'utf8');
const handoff = readFileSync(resolve(root, handoffPath), 'utf8');
const exporter = readFileSync(resolve(root, exporterPath), 'utf8');

function fail(message: string): never {
  throw new Error(`[core5-identity-geometry] ${message}`);
}

if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('status must be current visual production authority extension');
if (master.doesNotPromoteCandidates !== true) fail('candidate promotion guard must remain true');
if (master.sharedRules?.sameFaceBaseAllowed !== false) fail('same-face base must remain forbidden');
if (master.sharedRules?.hairColorAsPrimaryIdentityDifferenceAllowed !== false) fail('hair-color-only identity must remain forbidden');
if (master.sharedRules?.renderingMayChangeGeometry !== false) fail('rendering must not change geometry');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 10) fail('image generation gate incomplete');

const expected: Record<string, string> = {
  yui: 'YUI-SOFT-DIMPLE',
  asa: 'ASA-SHARP-UPTURN-ASYM',
  nagi: 'NAGI-FINE-HORIZONTAL',
  michiru: 'MICHIRU-CAT-GEJI-FRECKLE',
  tomori: 'TOMORI-HOODED-REPAIR',
};

const profiles = new Map((master.characters ?? []).map((entry: any) => [entry.id, entry]));
if (profiles.size !== 5) fail(`expected 5 Core5 profiles, got ${profiles.size}`);

for (const [id, signature] of Object.entries(expected)) {
  const profile: any = profiles.get(id);
  if (!profile) fail(`missing profile: ${id}`);
  if (profile.faceSignatureId !== signature) fail(`${id}: signature mismatch`);
  if (!source.includes(`id: '${id}'`) || !source.includes(`faceSignatureId: '${signature}'`)) fail(`${id}: source contract signature not found`);
  for (const key of ['faceShape','eyeShape','eyelid','brow','lashes','nose','mouth','hairMass','bodyShape','clothingConstruction','differenceFromNearest','neutralPoseRead']) {
    if (typeof profile[key] !== 'string' || !profile[key].trim()) fail(`${id}: ${key} missing`);
  }
  if (!Array.isArray(profile.forbiddenDrift) || profile.forbiddenDrift.length < 3) fail(`${id}: forbiddenDrift incomplete`);
}

for (const marker of [
  'core5IdentityGeometryMasterRequired: true',
  'core5IdentityGeometryRequired: boolean',
  'CORE5_IDENTITY_GEOMETRY_DOC',
  'CORE5_IDENTITY_GEOMETRY_DATA',
]) {
  if (!handoff.includes(marker)) fail(`handoff missing marker: ${marker}`);
}

for (const marker of [
  'CORE5_GEOMETRY_DOC',
  'CORE5_GEOMETRY_JSON',
  'loadIdentityGeometryProfile',
  'CORE5 IDENTITY GEOMETRY MASTER — REQUIRED FACE/BODY AUTHORITY.',
  'unknownIdentityGeometryMayBeInventedByImageModel: false',
]) {
  if (!exporter.includes(marker)) fail(`exporter missing marker: ${marker}`);
}

console.log('[core5-identity-geometry] OK: Core5 source-backed geometry locked and exporter wired');
