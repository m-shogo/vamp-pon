import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import {
  assertFullPreflightManifest,
  requiredFullPreflightChecks,
} from './unity-full-preflight-manifest.ts';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts?: Record<string, unknown>;
};
assertFullPreflightManifest(packageJson.scripts ?? {});

const directChecks = [
  'scripts/quality/check-top-living-night-layer-kit.ts',
  'scripts/quality/check-top-living-night-runtime.ts',
  'scripts/quality/check-top-living-night-unity-evidence.ts',
  'scripts/quality/check-loading-top-runtime.ts',
  'scripts/quality/check-top-v3-final-approval-capture-runner.ts',
  'scripts/quality/check-top-v3-device-build-provenance.ts',
  'scripts/quality/check-top-v3-final-ios-export.ts',
] as const;

for (const check of directChecks) {
  console.log(`\n=== node --experimental-strip-types ${check} ===`);
  const result = spawnSync(process.execPath, ['--experimental-strip-types', check], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    console.error(`Failed to start ${check}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Preflight stopped: ${check} exited with ${result.status ?? 'unknown status'}`);
    process.exit(result.status ?? 1);
  }
}

for (const script of requiredFullPreflightChecks) {
  console.log(`\n=== pnpm ${script} ===`);
  const result = spawnSync('pnpm', [script], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    console.error(`Failed to start pnpm ${script}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Preflight stopped: pnpm ${script} exited with ${result.status ?? 'unknown status'}`);
    process.exit(result.status ?? 1);
  }
}

console.log('\nUnity big implementation full preflight passed. U48 provenance/approval/promotion/connection/verification and U49 static/evidence checks are covered; actual-device, performance, RC and production readiness are not promoted by this command.');
