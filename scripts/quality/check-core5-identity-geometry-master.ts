import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const geometryPath = 'data/visual/core5-identity-geometry-master-v1.json';
const posturePath = 'data/visual/core5-posture-silhouette-master-v1.json';
const appearanceSourcePath = 'src/game/data/characterAppearanceGenerationContracts.ts';
const silhouetteSourcePath = 'src/game/data/current21SilhouetteMatrix.ts';
const handoffPath = 'src/game/data/characterReferenceGenerationHandoff.ts';
const exporterPath = 'tools/asset-factory/scripts/export-character-asset-prompt.ts';

const master = JSON.parse(readFileSync(resolve(root, geometryPath), 'utf8'));
const postureMaster = JSON.parse(readFileSync(resolve(root, posturePath), 'utf8'));
const appearanceSource = readFileSync(resolve(root, appearanceSourcePath), 'utf8');
const silhouetteSource = readFileSync(resolve(root, silhouetteSourcePath), 'utf8');
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
if (master.sharedRules?.genericHeroPoseAllowedAsIdentityBase !== false) fail('generic hero pose must not become identity base');
if (master.sharedRules?.propMayReplaceBodyIdentity !== false) fail('prop must not replace body identity');
if (master.postureSilhouetteAuthority !== posturePath) fail('posture silhouette authority pointer missing');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 16) fail('image generation gate incomplete');

if (postureMaster.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('posture master status invalid');
if (postureMaster.canonicalSource !== silhouetteSourcePath) fail('posture master canonical source mismatch');
if (postureMaster.doesNotInventMeasurements !== true) fail('posture master must not invent measurements');
if (postureMaster.sharedRules?.genericHeroPoseAllowedAsIdentityBase !== false) fail('posture master hero pose guard weakened');

const expected: Record<string, string> = {
  yui: 'YUI-SOFT-DIMPLE',
  asa: 'ASA-SHARP-UPTURN-ASYM',
  nagi: 'NAGI-FINE-HORIZONTAL',
  michiru: 'MICHIRU-CAT-GEJI-FRECKLE',
  tomori: 'TOMORI-HOODED-REPAIR',
};

const profiles = new Map((master.characters ?? []).map((entry: any) => [entry.id, entry]));
const postureProfiles = new Map((postureMaster.characters ?? []).map((entry: any) => [entry.id, entry]));
if (profiles.size !== 5) fail(`expected 5 Core5 geometry profiles, got ${profiles.size}`);
if (postureProfiles.size !== 5) fail(`expected 5 Core5 posture profiles, got ${postureProfiles.size}`);

for (const [id, signature] of Object.entries(expected)) {
  const profile: any = profiles.get(id);
  const posture: any = postureProfiles.get(id);
  if (!profile || !posture) fail(`missing profile: ${id}`);
  if (profile.faceSignatureId !== signature) fail(`${id}: signature mismatch`);
  if (!appearanceSource.includes(`id: '${id}'`) || !appearanceSource.includes(`faceSignatureId: '${signature}'`)) fail(`${id}: source contract signature not found`);

  for (const key of ['faceShape','eyeShape','eyelid','brow','lashes','nose','mouth','hairMass','bodyShape','clothingConstruction','differenceFromNearest','neutralPoseRead']) {
    if (typeof profile[key] !== 'string' || !profile[key].trim()) fail(`${id}: ${key} missing`);
  }
  for (const key of ['silhouetteRead','posture','clothingShape','objectAnchor','motionSignature','ensemblePosition','silhouetteGenerationGuard']) {
    if (typeof profile[key] !== 'string' || !profile[key].trim()) fail(`${id}: integrated ${key} missing`);
  }
  for (const key of ['silhouetteRead','posture','clothingShape','objectAnchor','motionSignature','ensemblePosition','generationGuard']) {
    if (typeof posture[key] !== 'string' || !posture[key].trim()) fail(`${id}: posture master ${key} missing`);
  }
  if (profile.silhouetteRead !== posture.silhouetteRead || profile.posture !== posture.posture || profile.objectAnchor !== posture.objectAnchor || profile.motionSignature !== posture.motionSignature) {
    fail(`${id}: integrated geometry posture values drifted from posture master`);
  }
  if (!silhouetteSource.includes(`characterId: '${id}'`)) fail(`${id}: silhouette source row not found`);
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

console.log('[core5-identity-geometry] OK: face/body geometry + posture/silhouette/object anchors source-backed and exporter-loaded');
