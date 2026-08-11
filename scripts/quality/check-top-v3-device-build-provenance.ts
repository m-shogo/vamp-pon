import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const paths = {
  buildSync: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/VampPonBuildProvenanceSync.cs',
  buildSyncMeta: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/VampPonBuildProvenanceSync.cs.meta',
  probe: 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/VampPonBuildProvenanceProbe.cs',
  probeMeta: 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/VampPonBuildProvenanceProbe.cs.meta',
  verifier: 'scripts/unity/verify-top-living-night-installed-build-provenance.sh',
  simulatorWrapper: 'scripts/unity/run-top-v3-simulator-performance-evidence.sh',
  physicalWrapper: 'scripts/unity/run-top-v3-physical-iphone-performance-evidence.sh',
} as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of Object.values(paths)) {
  invariant(existsSync(path), `TOP build-provenance contract file is missing: ${path}`);
}

const buildSync = readFileSync(paths.buildSync, 'utf8');
for (const token of [
  'IPreprocessBuildWithReport',
  'IPostprocessBuildWithReport',
  'Assets/Resources/VampPonBuildProvenance',
  'source-commit.txt',
  'VAMPPON_BUILD_SOURCE_COMMIT',
  'RunGit(repositoryRoot, "rev-parse HEAD")',
  'status --porcelain --untracked-files=no',
  'require a clean tracked working tree',
  'does not match clean Git HEAD',
  'IsLowerHexCommit',
  'CleanupGeneratedProvenance',
]) {
  invariant(buildSync.includes(token), `Unity build provenance sync missing contract: ${token}`);
}

const probe = readFileSync(paths.probe, 'utf8');
for (const token of [
  '--vamp-pon-build-provenance-probe',
  'VampPonBuildProvenance/source-commit',
  'vamp-pon-build-provenance.json',
  'Resources.Load<TextAsset>',
  'artifact.result = "PASSED"',
  'artifact.sourceCommit = sourceCommit',
]) {
  invariant(probe.includes(token), `installed-build provenance probe missing contract: ${token}`);
}

const verifier = readFileSync(paths.verifier, 'utf8');
for (const token of [
  'V3/capture source commit mismatch',
  "v3.sourceCompositeKind !== 'final-core5'",
  'artifact.sourceCommit === expectedCommit',
  'artifact.bundleIdentifier === expectedBundle',
  'simctl launch',
  '--vamp-pon-build-provenance-probe',
  'devicectl device process launch',
  'installed-build provenance did not match source commit',
]) {
  invariant(verifier.includes(token), `installed-build provenance verifier missing contract: ${token}`);
}

const simulatorWrapper = readFileSync(paths.simulatorWrapper, 'utf8');
invariant(
  simulatorWrapper.includes('verify-top-living-night-installed-build-provenance.sh simulator'),
  'Simulator wrapper must verify installed build before performance sampling',
);
invariant(
  simulatorWrapper.includes('run-top-living-night-simulator-performance-evidence.sh'),
  'Simulator wrapper must delegate to measured performance runner after provenance verification',
);

const physicalWrapper = readFileSync(paths.physicalWrapper, 'utf8');
invariant(
  physicalWrapper.includes('verify-top-living-night-installed-build-provenance.sh physical-iphone'),
  'physical-iPhone wrapper must verify installed build before performance sampling',
);
invariant(
  physicalWrapper.includes('run-top-living-night-physical-iphone-performance-evidence.sh'),
  'physical-iPhone wrapper must delegate to measured performance runner after provenance verification',
);

for (const shell of [paths.verifier, paths.simulatorWrapper, paths.physicalWrapper]) {
  const syntax = spawnSync('bash', ['-n', shell], { encoding: 'utf8' });
  invariant(!syntax.error, `${shell}: bash -n could not start: ${syntax.error?.message ?? 'unknown error'}`);
  invariant(syntax.status === 0, `${shell}: shell syntax failed:\n${syntax.stdout}\n${syntax.stderr}`);
}

console.log('TOP V3 installed-build provenance: PASS');
console.log('Unity player embeds exact clean Git HEAD; Simulator/iPhone evidence probes the installed build and rejects source-commit drift before measurement.');
