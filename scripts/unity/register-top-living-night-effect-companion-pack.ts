import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const finalStatusPath =
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const incomingRoot =
  'docs/design-targets/generated/top-living-night-v3/incoming/effects';
const finalRoot =
  'docs/design-targets/generated/top-living-night-v3/final/effects';
const manifestPath =
  'docs/design-targets/generated/top-living-night-v3/final/effect-companion-pack.json';

type EffectSpec = {
  file: string;
  width: number;
  height: number;
  alphaRequired: boolean;
  runtimeRole: 'full-canvas' | 'atlas';
  atlasGrid?: string;
};

const effects: EffectSpec[] = [
  { file: '01-stars.png', width: 430, height: 932, alphaRequired: true, runtimeRole: 'full-canvas' },
  { file: '02-clouds-far.png', width: 430, height: 932, alphaRequired: true, runtimeRole: 'full-canvas' },
  { file: '03-clouds-near.png', width: 430, height: 932, alphaRequired: true, runtimeRole: 'full-canvas' },
  { file: '05-distant-lights-mask.png', width: 430, height: 932, alphaRequired: true, runtimeRole: 'full-canvas' },
  { file: '08-robot-eye-mask.png', width: 430, height: 932, alphaRequired: true, runtimeRole: 'full-canvas' },
  { file: '10-fire-flipbook-atlas.png', width: 1448, height: 1086, alphaRequired: true, runtimeRole: 'atlas', atlasGrid: '4x3' },
  { file: '11-fire-glow-mask.png', width: 430, height: 932, alphaRequired: true, runtimeRole: 'full-canvas' },
  { file: '12-smoke-atlas.png', width: 1536, height: 1024, alphaRequired: true, runtimeRole: 'atlas', atlasGrid: '3x2' },
  { file: '13-embers-atlas.png', width: 256, height: 128, alphaRequired: true, runtimeRole: 'atlas', atlasGrid: '4x2' },
  { file: '14-lantern-glow-mask.png', width: 430, height: 932, alphaRequired: true, runtimeRole: 'full-canvas' },
];

function sha256(bytes: Buffer | string): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function validSha(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

function inspectPng(path: string, spec: EffectSpec) {
  const png = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (png.length < 33 || !png.subarray(0, 8).equals(signature))
    throw new Error(`invalid PNG signature/header: ${path}`);
  if (png.subarray(12, 16).toString('ascii') !== 'IHDR')
    throw new Error(`missing IHDR: ${path}`);

  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  const colorType = png[25];
  if (width !== spec.width || height !== spec.height)
    throw new Error(
      `effect companion dimensions mismatch: ${path} expected=${spec.width}x${spec.height} actual=${width}x${height}`,
    );
  if (spec.alphaRequired && colorType !== 4 && colorType !== 6)
    throw new Error(
      `effect companion must encode alpha (PNG color type 4 or 6): ${path}`,
    );

  return {
    width,
    height,
    colorType,
    bytes: png.length,
    sha256: sha256(png),
  };
}

function main() {
  const finalStatus = JSON.parse(
    readFileSync(join(root, finalStatusPath), 'utf8'),
  ) as {
    schemaVersion: number;
    candidateGenerated: boolean;
    candidatePath: string;
    candidateSha256: string;
    candidateCore5ReferenceSetSha256: string;
  };

  if (finalStatus.schemaVersion !== 1)
    throw new Error('final-art status schema mismatch');
  if (!finalStatus.candidateGenerated) {
    console.log('TOP effect companion pack registration: BLOCKED');
    console.log('reason=final Core5 candidate is not registered yet');
    return;
  }
  if (!validSha(finalStatus.candidateSha256))
    throw new Error('registered final candidate SHA-256 is invalid');
  if (!validSha(finalStatus.candidateCore5ReferenceSetSha256))
    throw new Error('registered Core5 reference-set SHA-256 is invalid');

  const records = effects.map(spec => {
    const incoming = join(root, incomingRoot, spec.file);
    if (!existsSync(incoming))
      throw new Error(`missing incoming effect companion: ${incomingRoot}/${spec.file}`);
    return {
      file: spec.file,
      alphaRequired: spec.alphaRequired,
      runtimeRole: spec.runtimeRole,
      atlasGrid: spec.atlasGrid ?? '',
      ...inspectPng(incoming, spec),
    };
  });

  const packFingerprintSource = [
    `candidate=${finalStatus.candidateSha256}`,
    `core5=${finalStatus.candidateCore5ReferenceSetSha256}`,
    ...records.map(record => `${record.file}:${record.sha256}`),
  ].join('\n');
  const packSha256 = sha256(packFingerprintSource);

  const manifest = {
    schemaVersion: 1,
    candidatePath: finalStatus.candidatePath,
    candidateSha256: finalStatus.candidateSha256,
    core5ReferenceSetSha256: finalStatus.candidateCore5ReferenceSetSha256,
    effectCount: records.length,
    packSha256,
    effects: records,
    registeredAtUtc: new Date().toISOString(),
    runtimePolicy: {
      representation: 'candidate-bound-effect-companion-pack',
      legacyV2FallbackAllowedForFinal: false,
      fullCanvasReference: '430x932',
      atlasContracts: {
        fire: '4x3@362px',
        smoke: '3x2@512px',
        embers: '4x2@64px',
      },
    },
  };

  console.log('TOP effect companion pack registration: READY');
  console.log(`candidateSha256=${finalStatus.candidateSha256}`);
  console.log(`packSha256=${packSha256}`);
  for (const record of records)
    console.log(`${record.file}=${record.sha256}`);

  if (dryRun) {
    console.log('dry-run: no effect companion files or manifest changed');
    return;
  }

  mkdirSync(join(root, finalRoot), { recursive: true });
  for (const record of records) {
    const source = join(root, incomingRoot, record.file);
    const destination = join(root, finalRoot, record.file);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(source, destination);
  }
  writeFileSync(
    join(root, manifestPath),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  console.log('TOP effect companion pack registration: REGISTERED');
  console.log(`manifest=${manifestPath}`);
}

main();
