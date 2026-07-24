import { spawnSync } from 'node:child_process';

const scripts = [
  'implementation:preflight:check',
  'assets:verify',
  'unity:ui-design-system:check',
  'unity:u43-device-p0-playable-runtime-repair:check',
  'unity:u43-predevice-automated-smoke:check',
  'unity:u44-web-to-unity-parity-audit:check',
  'unity:u45-stage-battle-levelup-app-quality:check',
  'unity:u45-settings-repair:check',
  'unity:u45-ai-simulator-smoke:check',
  'unity:u45-1-runtime-dot-animation:check',
  'unity:u46-app-flow-save-result-collection:check',
  'unity:u47-capture-catalog:check',
  'unity:u47-simulator-manifest:check',
  'unity:u47-gameplay-data-runtime:check',
  'unity:u48-production-asset-expansion:check',
  'unity:u48-production-asset-approval-pack:check',
  'unity:u48-candidate-live-preview:check',
  'unity:u48-batch-a-contracts:check',
  'unity:u48-batch-a-review-ready:check',
  'unity:u48-batch-b-review-ready:check',
  'unity:u48-batch-c-contracts:check',
  'unity:u48-batch-c-capture-readiness:check',
  'unity:u48-batch-c-review-ready:check',
  'unity:u48-human-selection:check',
  'unity:u48-approved-production-set:check',
  'unity:u48-production-visual-connection:check',
  'unity:u48-production-visual-verification:check',
  'unity:u48-stage-select-runtime:check',
  'unity:u48-replacement-interaction:check',
  'unity:runtime-visual-readiness:check',
  'unity:meta:check',
  'test',
  'build',
] as const;

for (const script of scripts) {
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

console.log('\nUnity big implementation full preflight passed. U48 approval/promotion/connection/verification are covered; device, audio, haptic, performance, RC and production readiness are not promoted by this command.');
