import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type Core5Reference = {
  id: string;
  path: string;
  gitBlobSha1: string;
};

type Core5ReferenceManifest = {
  schemaVersion: number;
  status: string;
  referenceCount: number;
  references: Core5Reference[];
  rules: {
    exactlyFiveReferences: boolean;
    silentMasterReplacementAllowed: boolean;
    manifestUpdateRequiredForIntentionalMasterChange: boolean;
    finalCandidateMustUseTheseReferences: boolean;
  };
  notes: string;
};

const root = process.cwd();
const manifestPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function gitBlobSha1(bytes: Buffer): string {
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return createHash('sha1').update(header).update(bytes).digest('hex');
}

function inspectPng(bytes: Buffer, label: string): { width: number; height: number } {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(bytes.length >= 24, `${label}: PNG is too small/truncated`);
  invariant(bytes.subarray(0, 8).equals(signature), `${label}: invalid PNG signature`);
  invariant(bytes.subarray(12, 16).toString('ascii') === 'IHDR', `${label}: missing IHDR`);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

invariant(existsSync(manifestPath), 'Core5 reference manifest is missing');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Core5ReferenceManifest;

invariant(manifest.schemaVersion === 1, 'Core5 reference manifest schema mismatch');
invariant(manifest.status === 'LOCKED_FOR_FINAL_TOP_GENERATION', 'Core5 references must remain locked for the current final TOP pass');
invariant(manifest.referenceCount === 5, 'Core5 reference manifest must declare exactly five references');
invariant(manifest.references.length === 5, 'Core5 reference manifest must contain exactly five references');
invariant(manifest.rules.exactlyFiveReferences, 'Core5 exact-five rule must remain enabled');
invariant(!manifest.rules.silentMasterReplacementAllowed, 'silent Core5 master replacement must remain prohibited');
invariant(manifest.rules.manifestUpdateRequiredForIntentionalMasterChange, 'intentional Core5 master changes must require manifest update');
invariant(manifest.rules.finalCandidateMustUseTheseReferences, 'final TOP candidate must use the locked Core5 references');
invariant(manifest.notes.length > 0, 'Core5 reference manifest notes are required');

const expected = [
  ['yui', 'assets/reference/character-master/core5/yui-character-master-v1.png'],
  ['asa', 'assets/reference/character-master/core5/asa-character-master-v1.png'],
  ['nagi', 'assets/reference/character-master/core5/nagi-character-master-v1.png'],
  ['michiru', 'assets/reference/character-master/core5/michiru-character-master-v1.png'],
  ['tomori', 'assets/reference/character-master/core5/tomori-character-master-v1.png'],
] as const;

const observedBlobIds = new Set<string>();
const observedPaths = new Set<string>();

for (const [index, [expectedId, expectedPath]] of expected.entries()) {
  const reference = manifest.references[index];
  invariant(reference.id === expectedId, `Core5 reference ${index} id mismatch`);
  invariant(reference.path === expectedPath, `${expectedId}: authoritative master path mismatch`);
  invariant(/^[0-9a-f]{40}$/.test(reference.gitBlobSha1), `${expectedId}: invalid locked Git blob SHA-1`);
  invariant(!observedBlobIds.has(reference.gitBlobSha1), `${expectedId}: duplicate Core5 binary authority detected`);
  invariant(!observedPaths.has(reference.path), `${expectedId}: duplicate Core5 path detected`);

  const absolutePath = join(root, reference.path);
  invariant(existsSync(absolutePath), `${expectedId}: locked Core5 master PNG is missing`);
  const bytes = readFileSync(absolutePath);
  const dimensions = inspectPng(bytes, expectedId);
  invariant(dimensions.width >= 256, `${expectedId}: Core5 master width is unexpectedly small (${dimensions.width})`);
  invariant(dimensions.height >= 256, `${expectedId}: Core5 master height is unexpectedly small (${dimensions.height})`);
  invariant(
    gitBlobSha1(bytes) === reference.gitBlobSha1,
    `${expectedId}: Core5 master bytes changed without an intentional reference-manifest update`,
  );

  observedBlobIds.add(reference.gitBlobSha1);
  observedPaths.add(reference.path);
  console.log(`${expectedId}: ${dimensions.width}x${dimensions.height} blob=${reference.gitBlobSha1}`);
}

invariant(observedBlobIds.size === 5, 'Core5 binary references must remain five distinct files');
invariant(observedPaths.size === 5, 'Core5 reference paths must remain five distinct paths');

console.log('TOP Living Night Core5 reference integrity: PASS');
console.log('authority: Yui / Asa / Nagi / Michiru / Tomori locked as five explicit master binaries');
console.log('change policy: intentional master revisions require manifest + downstream review update; silent replacement fails CI');
