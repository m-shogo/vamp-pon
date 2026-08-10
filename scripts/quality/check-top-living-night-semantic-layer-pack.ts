import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bundlePath = 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json';
const statusPath = 'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const core5Path = 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json';
const manifestPath = 'docs/design-targets/generated/top-living-night-v3/final/semantic-layer-pack.json';
const registrarPath = 'scripts/unity/register-top-living-night-semantic-layer-pack.ts';
const controllerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightSemanticLayerPackController.cs';
const buildSyncPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightSemanticLayerPackBuildSync.cs';
const unityVerificationPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightCompositeV3UnityVerification.cs';

const specs = [
  ['00-environment-base.png', false],
  ['04-distant-town.png', true],
  ['06-core5.png', true],
  ['07-animal-robot.png', true],
  ['09-fire-base.png', true],
  ['15-foreground-accents.png', true],
] as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function sha256(bytes: Buffer | string): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function validSha(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

function inspectPng(path: string, alphaRequired: boolean) {
  const bytes = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(bytes.length >= 33 && bytes.subarray(0, 8).equals(signature), `invalid semantic PNG: ${path}`);
  invariant(bytes.subarray(12, 16).toString('ascii') === 'IHDR', `missing semantic IHDR: ${path}`);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  const colorType = bytes[25];
  invariant(width === 430 && height === 932, `semantic dimensions mismatch: ${path} expected=430x932 actual=${width}x${height}`);
  if (alphaRequired)
    invariant(colorType === 4 || colorType === 6, `semantic alpha layer must encode alpha: ${path}`);
  return { sha256: sha256(bytes), width, height, colorType };
}

for (const required of [bundlePath, statusPath, core5Path, registrarPath, controllerPath, buildSyncPath, unityVerificationPath])
  invariant(existsSync(join(root, required)), `semantic authority/source is missing: ${required}`);

const bundle = JSON.parse(readFileSync(join(root, bundlePath), 'utf8')) as any;
const status = JSON.parse(readFileSync(join(root, statusPath), 'utf8')) as any;
const core5 = JSON.parse(readFileSync(join(root, core5Path), 'utf8')) as any;
const structural = bundle.structuralLayers;

invariant(structural, 'TOP generation bundle is missing structuralLayers');
invariant(structural.incomingRoot === 'docs/design-targets/generated/top-living-night-v3/incoming/layers', 'semantic incoming root mismatch');
invariant(structural.finalRoot === 'docs/design-targets/generated/top-living-night-v3/final/layers', 'semantic final root mismatch');
invariant(JSON.stringify(structural.required.map((entry: any) => entry.file)) === JSON.stringify(specs.map(([file]) => file)), 'semantic required file order/set mismatch');
invariant(structural.runtimeRepresentation === 'semantic-2.5d-layer-pack', 'semantic runtime representation mismatch');
invariant(structural.referenceCanvas === '430x932', 'semantic reference canvas mismatch');
invariant(structural.flattenedFallbackAllowedAfterFinal === false, 'final semantic runtime must forbid flattened fallback');

const registrarSource = readFileSync(join(root, registrarPath), 'utf8');
const controllerSource = readFileSync(join(root, controllerPath), 'utf8');
const buildSyncSource = readFileSync(join(root, buildSyncPath), 'utf8');
const unityVerificationSource = readFileSync(join(root, unityVerificationPath), 'utf8');
for (const [file] of specs) {
  invariant(registrarSource.includes(`'${file}'`), `semantic registrar lost ${file}`);
  invariant(controllerSource.includes(`\"${file}\"`), `semantic runtime controller lost ${file}`);
  invariant(buildSyncSource.includes(`\"${file}\"`), `semantic build sync lost ${file}`);
}
invariant(controllerSource.includes('semantic-2.5d-layer-pack'), 'semantic runtime candidate-bound representation guard missing');
invariant(controllerSource.includes('!manifest.runtimePolicy.flattenedFinalFallbackAllowed'), 'semantic runtime must reject flattened final fallback');
invariant(buildSyncSource.includes('final/layers'), 'semantic build sync final-root contract missing');
invariant(buildSyncSource.includes('ASTC_6x6'), 'semantic build sync lost iOS ASTC 6x6 policy');
invariant(buildSyncSource.includes('pack-ready.txt'), 'semantic build ready marker contract missing');
invariant(unityVerificationSource.includes('VerifyFinalSemanticLayerPack'), 'Unity V3 verification must validate final semantic layer pack');
invariant(unityVerificationSource.includes('TopLivingNightSemanticLayerPackBuildSync.StageForVerification()'), 'Unity V3 verification must stage semantic layers');
invariant(unityVerificationSource.includes('bridge verification must not require final semantic layer pack'), 'Unity V3 verification must preserve honest bridge behavior');

if (!status.candidateGenerated) {
  invariant(status.candidateSha256 === '', 'unregistered final candidate must not retain candidate SHA');
  console.log('TOP semantic layer pack: honest NOT_RUN boundary');
  console.log('final semantic pack becomes mandatory only after candidate registration');
  process.exit(0);
}

invariant(validSha(status.candidateSha256), 'registered final candidate SHA is invalid');
invariant(validSha(status.candidateCore5ReferenceSetSha256), 'registered candidate Core5 reference-set SHA is invalid');
invariant(status.candidateCore5ReferenceSetSha256 === core5.referenceSetSha256, 'registered candidate targets stale Core5 reference set');
invariant(existsSync(join(root, manifestPath)), 'registered final candidate requires semantic layer manifest');

const manifest = JSON.parse(readFileSync(join(root, manifestPath), 'utf8')) as any;
invariant(manifest.schemaVersion === 1, 'semantic manifest schema mismatch');
invariant(manifest.candidatePath === status.candidatePath, 'semantic manifest candidate path mismatch');
invariant(manifest.candidateSha256 === status.candidateSha256, 'semantic manifest candidate SHA mismatch');
invariant(manifest.core5ReferenceSetSha256 === core5.referenceSetSha256, 'semantic manifest Core5 reference-set mismatch');
invariant(manifest.layerCount === specs.length && manifest.layers?.length === specs.length, 'semantic manifest count mismatch');
invariant(manifest.runtimePolicy?.representation === 'semantic-2.5d-layer-pack', 'semantic manifest runtime representation mismatch');
invariant(manifest.runtimePolicy?.flattenedFinalFallbackAllowed === false, 'semantic manifest must forbid flattened final fallback');
invariant(manifest.runtimePolicy?.referenceCanvas === '430x932', 'semantic manifest reference canvas mismatch');

const records: Array<{ file: string; sha256: string }> = [];
for (const [file, alphaRequired] of specs) {
  const path = join(root, structural.finalRoot, file);
  invariant(existsSync(path), `registered final candidate is missing semantic layer: ${file}`);
  const inspected = inspectPng(path, alphaRequired);
  const record = manifest.layers.find((entry: any) => entry.file === file);
  invariant(record, `semantic manifest missing record: ${file}`);
  invariant(record.alphaRequired === alphaRequired, `semantic alpha contract mismatch: ${file}`);
  invariant(record.width === 430 && record.height === 932, `semantic manifest dimensions mismatch: ${file}`);
  invariant(record.sha256 === inspected.sha256, `semantic manifest SHA mismatch: ${file}`);
  records.push({ file, sha256: inspected.sha256 });
}

const fingerprint = [
  `candidate=${manifest.candidateSha256}`,
  `core5=${manifest.core5ReferenceSetSha256}`,
  ...records.map(record => `${record.file}:${record.sha256}`),
].join('\n');
invariant(validSha(manifest.packSha256), 'semantic pack SHA is invalid');
invariant(manifest.packSha256 === sha256(fingerprint), 'semantic pack fingerprint is stale');

console.log('TOP semantic layer pack: PASS');
console.log(`candidate=${manifest.candidateSha256}`);
console.log(`layers=${manifest.layerCount}`);
console.log('final semantic pack is candidate/Core5/per-layer SHA bound; flattened fallback forbidden');
