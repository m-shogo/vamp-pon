import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const runnerPath = 'scripts/unity/run-top-v3-final-approval-simulator-evidence.sh';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(runnerPath), `TOP final Simulator evidence runner is missing: ${runnerPath}`);
const runner = readFileSync(runnerPath, 'utf8');

for (const token of [
  "v3.verifiedCommit !== capture.sourceCommit",
  "v3.sourceCompositeKind !== 'final-core5'",
  'run-top-v3-final-approval-ios-export.sh simulator',
  '-configuration Release',
  '-sdk iphonesimulator',
  '-destination "id=$UDID"',
  'CODE_SIGNING_ALLOWED=NO',
  "glob('*.app')",
  "bundle == expected",
  'xcrun simctl terminate',
  'xcrun simctl install',
  'xcrun simctl get_app_container',
  'run-top-v3-simulator-performance-evidence.sh',
]) {
  invariant(runner.includes(token), `TOP final Simulator evidence runner missing contract: ${token}`);
}

for (const forbidden of [
  'BuildOptions.Development',
  'extraScriptingDefines',
  'git reset --hard origin/main',
  'verify-top-living-night-installed-build-provenance.sh',
]) {
  invariant(!runner.includes(forbidden), `TOP final Simulator evidence runner contains stale/unsafe behavior: ${forbidden}`);
}

const exportIndex = runner.indexOf('run-top-v3-final-approval-ios-export.sh simulator');
const xcodeIndex = runner.indexOf('xcodebuild \\');
const installIndex = runner.indexOf('xcrun simctl install');
const performanceIndex = runner.indexOf('run-top-v3-simulator-performance-evidence.sh');
invariant(
  exportIndex >= 0 && xcodeIndex >= 0 && installIndex >= 0 && performanceIndex >= 0 &&
    exportIndex < xcodeIndex && xcodeIndex < installIndex && installIndex < performanceIndex,
  'TOP final Simulator evidence order must remain exact-source export -> Release Xcode build -> install -> measured evidence',
);

const syntax = spawnSync('bash', ['-n', runnerPath], { encoding: 'utf8' });
invariant(!syntax.error, `bash -n could not start: ${syntax.error?.message ?? 'unknown error'}`);
invariant(
  syntax.status === 0,
  `TOP final Simulator evidence shell syntax failed:\n${syntax.stdout}\n${syntax.stderr}`,
);

console.log('TOP V3 final Simulator evidence runner: PASS');
console.log('exact-source Unity export -> Release iphonesimulator Xcode build -> bundle-checked install -> same-launch provenance-gated 300s performance evidence');
