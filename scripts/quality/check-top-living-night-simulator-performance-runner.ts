import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const runnerPath = join(
  root,
  'scripts/unity/run-top-living-night-simulator-performance-evidence.sh',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(runnerPath), 'TOP Simulator performance runner is missing');
const runner = readFileSync(runnerPath, 'utf8');

// Comments/documentation may legitimately mention readarray/mapfile. Reject only
// actual command lines so the compatibility checker cannot fail on its own prose.
for (const forbiddenCommand of ['readarray', 'mapfile']) {
  const commandPattern = new RegExp(`^\\s*${forbiddenCommand}(?:\\s|$)`, 'm');
  invariant(
    !commandPattern.test(runner),
    `TOP Simulator runner is not stock macOS Bash compatible: ${forbiddenCommand}`,
  );
}

for (const token of [
  '#!/usr/bin/env bash',
  'set -euo pipefail',
  'VAMPPON_IOS_BUNDLE_ID:-com.mshogo.vamppon.u1',
  'VAMPPON_SIMULATOR_UDID:-booted',
  'Bash 3.2 compatible',
  "IFS=$'\\t' read -r SOURCE_COMMIT COMPOSITE_KIND COMPOSITE_PATH COMPOSITE_SHA256",
  "IFS=$'\\t' read -r DEVICE_MODEL OS_VERSION",
  'xcrun simctl list devices -j',
  'xcrun simctl get_app_container',
  '--vamp-pon-top-perf',
  '--vamp-pon-top-perf-target=simulator',
  '--vamp-pon-top-perf-source-commit=',
  '--vamp-pon-top-perf-composite-kind=',
  '--vamp-pon-top-perf-composite-path=',
  '--vamp-pon-top-perf-composite-sha256=',
  'xcrun simctl launch "$UDID" com.apple.Preferences',
  'xcrun simctl launch "$UDID" "$BUNDLE_ID"',
  'top-living-night-simulator-performance.json',
  'simulator-${SOURCE_COMMIT}.json',
  'register-top-living-night-device-performance.ts',
  'check-top-living-night-device-performance-artifact.ts',
  'check-top-living-night-device-performance-policy.ts',
  'check-top-living-night-device-evidence.ts',
  'This runner does not build/install',
  'does not promote runtimeApproved/final approval',
]) {
  invariant(runner.includes(token), `TOP Simulator performance runner contract missing: ${token}`);
}

invariant(
  runner.includes("if (!v3.executed || v3.result !== 'PASSED')"),
  'TOP Simulator runner must require PASSED V3 Unity evidence before measurement',
);
invariant(
  runner.includes("if (!capture.executed || capture.result !== 'PASSED' || capture.captureCount !== 15)"),
  'TOP Simulator runner must require PASSED 15-frame capture evidence before measurement',
);
invariant(
  runner.includes("if (v3.verifiedCommit !== capture.sourceCommit)"),
  'TOP Simulator runner must reject V3/capture commit mismatch',
);
invariant(
  runner.indexOf('rm -f "$RAW_ARTIFACT"') < runner.indexOf('xcrun simctl launch "$UDID" "$BUNDLE_ID"'),
  'TOP Simulator runner must remove stale sandbox artifact before launching measurement',
);
invariant(
  runner.indexOf('cp "$RAW_ARTIFACT" "$DEST_ARTIFACT"') <
    runner.indexOf('register-top-living-night-device-performance.ts'),
  'TOP Simulator runner must copy raw artifact into canonical evidence directory before registration',
);

console.log('TOP Living Night Simulator performance runner contract: PASS');
console.log('guarded: Bash 3.2 compatibility / V3+capture provenance / opt-in launch / background recovery / raw artifact registration');
