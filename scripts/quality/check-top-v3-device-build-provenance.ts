import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const paths = {
  buildSync: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/VampPonBuildProvenanceSync.cs',
  buildSyncMeta: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/VampPonBuildProvenanceSync.cs.meta',
  runtimeVerifier: 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/VampPonBuildProvenanceRuntime.cs',
  runtimeVerifierMeta: 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/VampPonBuildProvenanceRuntime.cs.meta',
  probe: 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/VampPonBuildProvenanceProbe.cs',
  probeMeta: 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/VampPonBuildProvenanceProbe.cs.meta',
  standaloneVerifier: 'scripts/unity/verify-top-living-night-installed-build-provenance.sh',
  sameLaunchVerifier: 'scripts/unity/verify-top-v3-same-launch-build-provenance.sh',
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
  'private const string DirtyPrefix = "DIRTY:"',
  'valid for development but final Simulator/iPhone evidence will reject it',
  'does not match Git HEAD',
  'IsLowerHexCommit',
  'CleanupGeneratedProvenance',
]) {
  invariant(buildSync.includes(token), `Unity build provenance sync missing contract: ${token}`);
}

const runtimeVerifier = readFileSync(paths.runtimeVerifier, 'utf8');
for (const token of [
  'VampPonBuildProvenance/source-commit',
  'MatchesCleanSourceCommit',
  'TryReadCleanSourceCommit',
  'dirty/development builds are ineligible for final device evidence',
  'installed player source commit mismatch',
]) {
  invariant(runtimeVerifier.includes(token), `runtime build provenance verifier missing contract: ${token}`);
}

const probe = readFileSync(paths.probe, 'utf8');
for (const token of [
  '--vamp-pon-build-provenance-probe',
  '--vamp-pon-top-perf',
  '--vamp-pon-top-physical-perf',
  'VampPonBuildProvenanceRuntime.TryReadCleanSourceCommit',
  'vamp-pon-build-provenance.json',
  'artifact.result = "PASSED"',
  'artifact.sourceCommit = sourceCommit',
]) {
  invariant(probe.includes(token), `same-launch installed-build provenance probe missing contract: ${token}`);
}

const standaloneVerifier = readFileSync(paths.standaloneVerifier, 'utf8');
for (const token of [
  'V3/capture source commit mismatch',
  "v3.sourceCompositeKind !== 'final-core5'",
  'artifact.sourceCommit === expectedCommit',
  'artifact.bundleIdentifier === expectedBundle',
]) {
  invariant(standaloneVerifier.includes(token), `standalone build provenance verifier missing contract: ${token}`);
}

const sameLaunchVerifier = readFileSync(paths.sameLaunchVerifier, 'utf8');
for (const token of [
  'prepare|wait simulator|physical-iphone',
  'V3/capture source commit mismatch',
  "v3.sourceCompositeKind !== 'final-core5'",
  'artifact.sourceCommit === expectedCommit',
  'artifact.bundleIdentifier === expectedBundle',
  'measured Simulator process did not produce matching build provenance',
  'measured physical-iPhone process did not produce matching build provenance',
]) {
  invariant(sameLaunchVerifier.includes(token), `same-launch build provenance verifier missing contract: ${token}`);
}

const simulatorWrapper = readFileSync(paths.simulatorWrapper, 'utf8');
for (const token of [
  'verify-top-v3-same-launch-build-provenance.sh',
  'prepare simulator',
  'run-top-living-night-simulator-performance-evidence.sh',
  'wait simulator',
  'wait "$PERF_PID"',
]) {
  invariant(simulatorWrapper.includes(token), `Simulator same-launch wrapper missing contract: ${token}`);
}
invariant(
  !simulatorWrapper.includes('verify-top-living-night-installed-build-provenance.sh'),
  'Simulator canonical wrapper must not launch a separate provenance probe before measurement',
);

const physicalWrapper = readFileSync(paths.physicalWrapper, 'utf8');
for (const token of [
  'verify-top-v3-same-launch-build-provenance.sh',
  'prepare physical-iphone',
  'run-top-living-night-physical-iphone-performance-evidence.sh',
  'wait physical-iphone',
  'wait "$PERF_PID"',
]) {
  invariant(physicalWrapper.includes(token), `physical-iPhone same-launch wrapper missing contract: ${token}`);
}
invariant(
  !physicalWrapper.includes('verify-top-living-night-installed-build-provenance.sh'),
  'physical-iPhone canonical wrapper must not launch a separate provenance probe before measurement',
);

for (const shell of [
  paths.standaloneVerifier,
  paths.sameLaunchVerifier,
  paths.simulatorWrapper,
  paths.physicalWrapper,
]) {
  const syntax = spawnSync('bash', ['-n', shell], { encoding: 'utf8' });
  invariant(!syntax.error, `${shell}: bash -n could not start: ${syntax.error?.message ?? 'unknown error'}`);
  invariant(syntax.status === 0, `${shell}: shell syntax failed:\n${syntax.stdout}\n${syntax.stderr}`);
}

console.log('TOP V3 installed-build provenance: PASS');
console.log('Unity player embeds clean HEAD or DIRTY marker; canonical Simulator/iPhone wrappers validate the embedded SHA emitted by the same measured process before accepting 300s evidence.');
