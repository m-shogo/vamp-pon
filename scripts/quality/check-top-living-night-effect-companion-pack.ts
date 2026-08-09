import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bundlePath =
  'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json';
const statusPath =
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const core5Path =
  'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json';
const manifestPath =
  'docs/design-targets/generated/top-living-night-v3/final/effect-companion-pack.json';
const controllerPath =
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightEffectCompanionPackController.cs';
const buildSyncPath =
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightEffectCompanionPackBuildSync.cs';
const registrarPath =
  'scripts/unity/register-top-living-night-effect-companion-pack.ts';
const effectWorkflowPath = '.github/workflows/top-final-effect-companion.yml';

const specs = [
  ['01-stars.png', 430, 932],
  ['02-clouds-far.png', 430, 932],
  ['03-clouds-near.png', 430, 932],
  ['05-distant-lights-mask.png', 430, 932],
  ['08-robot-eye-mask.png', 430, 932],
  ['10-fire-flipbook-atlas.png', 1448, 1086],
  ['11-fire-glow-mask.png', 430, 932],
  ['12-smoke-atlas.png', 1536, 1024],
  ['13-embers-atlas.png', 256, 128],
  ['14-lantern-glow-mask.png', 430, 932],
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

function inspectPng(path: string, expectedWidth: number, expectedHeight: number) {
  const bytes = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(bytes.length >= 33 && bytes.subarray(0, 8).equals(signature), `invalid effect PNG: ${path}`);
  invariant(bytes.subarray(12, 16).toString('ascii') === 'IHDR', `missing effect IHDR: ${path}`);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  const colorType = bytes[25];
  invariant(width === expectedWidth && height === expectedHeight, `effect dimensions mismatch: ${path} expected=${expectedWidth}x${expectedHeight} actual=${width}x${height}`);
  invariant(colorType === 4 || colorType === 6, `effect PNG must encode alpha: ${path}`);
  return { width, height, colorType, bytes: bytes.length, sha256: sha256(bytes) };
}

const bundle = JSON.parse(readFileSync(join(root, bundlePath), 'utf8')) as any;
const status = JSON.parse(readFileSync(join(root, statusPath), 'utf8')) as any;
const core5 = JSON.parse(readFileSync(join(root, core5Path), 'utf8')) as any;
const effect = bundle.effectCompanionRuntime;

invariant(effect, 'TOP generation bundle is missing effectCompanionRuntime');
invariant(effect.productionBrief === 'docs/design-targets/generated/top-living-night-v3/final-effect-companion-brief.md', 'effect companion brief authority mismatch');
invariant(effect.incomingRoot === 'docs/design-targets/generated/top-living-night-v3/incoming/effects', 'effect incoming root mismatch');
invariant(effect.finalRoot === 'docs/design-targets/generated/top-living-night-v3/final/effects', 'effect final root mismatch');
invariant(effect.manifest === manifestPath, 'effect manifest path mismatch');
invariant(effect.registrar === registrarPath, 'effect registrar path mismatch');
invariant(JSON.stringify(effect.requiredEffects) === JSON.stringify(specs.map(([file]) => file)), 'effect required file order/set mismatch');
invariant(effect.dimensionContracts.fullCanvas === '430x932', 'effect full-canvas dimension contract mismatch');
invariant(effect.dimensionContracts['10-fire-flipbook-atlas.png'] === '1448x1086 / 4x3', 'fire atlas contract mismatch');
invariant(effect.dimensionContracts['12-smoke-atlas.png'] === '1536x1024 / 3x2', 'smoke atlas contract mismatch');
invariant(effect.dimensionContracts['13-embers-atlas.png'] === '256x128 / 4x2', 'embers atlas contract mismatch');
invariant(effect.candidateShaBound && effect.core5ReferenceSetBound && effect.perEffectShaBound, 'effect pack must bind candidate/Core5/per-effect SHA');
invariant(effect.legacyV2FallbackAllowedForFinal === false, 'final effect runtime must forbid V2 fallback');
invariant(effect.bridgeMayUseExistingV2Effects === true, 'V2 effect fallback may remain only for bridge/non-final TOP');

for (const path of [effect.productionBrief, registrarPath, controllerPath, buildSyncPath, effectWorkflowPath])
  invariant(existsSync(join(root, path)), `effect production authority/source is missing: ${path}`);

const registrarSource = readFileSync(join(root, registrarPath), 'utf8');
const controllerSource = readFileSync(join(root, controllerPath), 'utf8');
const buildSyncSource = readFileSync(join(root, buildSyncPath), 'utf8');
const workflowSource = readFileSync(join(root, effectWorkflowPath), 'utf8');

for (const [file] of specs) {
  invariant(registrarSource.includes(`'${file}'`), `effect registrar lost ${file}`);
  invariant(controllerSource.includes(`\"${file}\"`), `effect runtime controller lost ${file}`);
  invariant(buildSyncSource.includes(`\"${file}\"`), `effect build sync lost ${file}`);
}
invariant(controllerSource.includes('TopLivingNightV3EffectsGenerated'), 'effect runtime resource root mismatch');
invariant(controllerSource.includes('final/effects'), 'effect runtime editor final-root guard missing');
invariant(controllerSource.includes('candidate-bound-effect-companion-pack'), 'effect runtime candidate-bound policy missing');
invariant(controllerSource.includes('!manifest.runtimePolicy.legacyV2FallbackAllowedForFinal'), 'effect runtime must reject final V2 fallback');
invariant(buildSyncSource.includes('Final runtime may not silently reuse the V2 effect family.'), 'effect build sync must fail closed for final candidates');
invariant(buildSyncSource.includes('ASTC_6x6'), 'effect build sync lost iOS ASTC 6x6 policy');
invariant(buildSyncSource.includes('pack-ready.txt'), 'effect build ready marker contract missing');
invariant(workflowSource.includes('check-top-living-night-effect-companion-pack.ts'), 'effect workflow must execute effect pack checker');
invariant(workflowSource.includes('register-top-living-night-effect-companion-pack.ts --dry-run'), 'effect workflow must execute registrar dry-run');

if (!status.candidateGenerated) {
  invariant(status.candidateSha256 === '', 'unregistered final candidate must not retain candidate SHA');
  console.log('TOP effect companion pack: honest NOT_RUN boundary');
  console.log('runtime bridge may continue using V2 effects; final Core5 runtime cannot');
  process.exit(0);
}

invariant(validSha(status.candidateSha256), 'registered final candidate SHA is invalid');
invariant(validSha(status.candidateCore5ReferenceSetSha256), 'registered candidate Core5 reference-set SHA is invalid');
invariant(status.candidateCore5ReferenceSetSha256 === core5.referenceSetSha256, 'registered candidate targets stale Core5 reference set');
invariant(existsSync(join(root, manifestPath)), 'registered final candidate requires effect companion manifest');

const manifest = JSON.parse(readFileSync(join(root, manifestPath), 'utf8')) as any;
invariant(manifest.schemaVersion === 1, 'effect manifest schema mismatch');
invariant(manifest.candidateSha256 === status.candidateSha256, 'effect manifest candidate SHA mismatch');
invariant(manifest.core5ReferenceSetSha256 === core5.referenceSetSha256, 'effect manifest Core5 reference-set mismatch');
invariant(manifest.effectCount === specs.length && manifest.effects?.length === specs.length, 'effect manifest count mismatch');
invariant(manifest.runtimePolicy?.representation === 'candidate-bound-effect-companion-pack', 'effect manifest runtime representation mismatch');
invariant(manifest.runtimePolicy?.legacyV2FallbackAllowedForFinal === false, 'effect manifest must forbid final V2 fallback');

const records: Array<{ file: string; sha256: string }> = [];
for (const [file, width, height] of specs) {
  const path = join(root, effect.finalRoot, file);
  invariant(existsSync(path), `registered final candidate is missing effect companion: ${file}`);
  const inspected = inspectPng(path, width, height);
  const record = manifest.effects.find((entry: any) => entry.file === file);
  invariant(record, `effect manifest missing record: ${file}`);
  invariant(record.alphaRequired === true, `effect manifest alpha contract missing: ${file}`);
  invariant(record.sha256 === inspected.sha256, `effect manifest SHA mismatch: ${file}`);
  records.push({ file, sha256: inspected.sha256 });
}

const fingerprint = [
  `candidate=${manifest.candidateSha256}`,
  `core5=${manifest.core5ReferenceSetSha256}`,
  ...records.map(record => `${record.file}:${record.sha256}`),
].join('\n');
invariant(validSha(manifest.packSha256), 'effect pack SHA is invalid');
invariant(manifest.packSha256 === sha256(fingerprint), 'effect pack fingerprint is stale');

console.log('TOP effect companion pack: PASS');
console.log(`candidate=${manifest.candidateSha256}`);
console.log(`effects=${manifest.effectCount}`);
console.log('final runtime effect family is candidate/Core5/per-effect SHA bound; V2 fallback forbidden');
