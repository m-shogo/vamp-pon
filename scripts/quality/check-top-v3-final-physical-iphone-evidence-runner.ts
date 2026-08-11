import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const runnerPath = 'scripts/unity/run-top-v3-final-approval-physical-iphone-evidence.sh';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(runnerPath), `TOP final physical-iPhone evidence runner is missing: ${runnerPath}`);
const runner = readFileSync(runnerPath, 'utf8');

for (const token of [
  'VAMPPON_PHYSICAL_IPHONE_DEVICE is required',
  'VAMPPON_APPLE_DEVELOPMENT_TEAM is required; signing identity must never be guessed',
  'VAMPPON_IOS_BUNDLE_ID',
  'VAMPPON_ALLOW_PROVISIONING_UPDATES',
  'VAMPPON_PROVISIONING_PROFILE_SPECIFIER',
  "v3.verifiedCommit !== capture.sourceCommit",
  "v3.sourceCompositeKind !== 'final-core5'",
  'run-top-v3-final-approval-ios-export.sh device',
  'PRODUCT_BUNDLE_IDENTIFIER',
  'generated Xcode project has no exact app bundle setting',
  '-configuration Release',
  '-sdk iphoneos',
  '-destination "id=$DEVICE"',
  'DEVELOPMENT_TEAM=$TEAM',
  'CODE_SIGN_STYLE=Automatic',
  '-allowProvisioningUpdates',
  "glob('*.app')",
  "bundle == expected",
  'embedded.mobileprovision',
  'codesign --verify --deep --strict',
  'xcrun devicectl device install app',
  'run-top-v3-physical-iphone-performance-evidence.sh',
]) {
  invariant(runner.includes(token), `TOP final physical-iPhone runner missing contract: ${token}`);
}

for (const forbidden of [
  'VAMPPON_PHYSICAL_IPHONE_DEVICE:-000',
  'VAMPPON_APPLE_DEVELOPMENT_TEAM:-',
  'git reset --hard origin/main',
  'BuildOptions.Development',
  'extraScriptingDefines',
  'security find-identity',
  'PROVISIONING_PROFILE_SPECIFIER=',
]) {
  if (forbidden === 'VAMPPON_APPLE_DEVELOPMENT_TEAM:-') {
    invariant(
      !/VAMPPON_APPLE_DEVELOPMENT_TEAM:-[^}]+/.test(runner),
      'physical-iPhone runner must not default/guess an Apple Team ID',
    );
    continue;
  }
  if (forbidden === 'PROVISIONING_PROFILE_SPECIFIER=') {
    invariant(
      runner.includes('if [[ -n "$PROFILE_SPECIFIER" ]]') && runner.includes('XCODE_ARGS+=("PROVISIONING_PROFILE_SPECIFIER=$PROFILE_SPECIFIER")'),
      'provisioning profile specifier may only be applied from explicit caller input',
    );
    continue;
  }
  invariant(!runner.includes(forbidden), `TOP final physical-iPhone runner contains stale/unsafe behavior: ${forbidden}`);
}

const exportIndex = runner.indexOf('run-top-v3-final-approval-ios-export.sh device');
const xcodeIndex = runner.indexOf('xcodebuild "${XCODE_ARGS[@]}" build');
const codesignIndex = runner.indexOf('codesign --verify --deep --strict');
const installIndex = runner.indexOf('xcrun devicectl device install app');
const performanceIndex = runner.indexOf('bash scripts/unity/run-top-v3-physical-iphone-performance-evidence.sh');
invariant(
  [exportIndex, xcodeIndex, codesignIndex, installIndex, performanceIndex].every(index => index >= 0) &&
    exportIndex < xcodeIndex && xcodeIndex < codesignIndex && codesignIndex < installIndex && installIndex < performanceIndex,
  'physical-iPhone order must remain exact-source export -> explicit signing -> signature verify -> install -> same-launch measured evidence',
);

const syntax = spawnSync('bash', ['-n', runnerPath], { encoding: 'utf8' });
invariant(!syntax.error, `bash -n could not start: ${syntax.error?.message ?? 'unknown error'}`);
invariant(
  syntax.status === 0,
  `TOP final physical-iPhone evidence shell syntax failed:\n${syntax.stdout}\n${syntax.stderr}`,
);

console.log('TOP V3 final physical-iPhone evidence runner: PASS');
console.log('exact-source device export -> explicit caller-owned signing -> signature/profile validation -> devicectl install -> same-launch provenance-gated 300s thermal/performance evidence');
