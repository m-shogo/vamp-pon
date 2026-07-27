import { spawnSync } from 'node:child_process';

type Command = {
  label: string;
  executable: string;
  args: string[];
};

const pnpm = (script: string): Command => ({
  label: `pnpm ${script}`,
  executable: 'pnpm',
  args: [script],
});

const commands: Command[] = [
  pnpm('implementation:preflight:check'),
  pnpm('assets:verify'),
  pnpm('unity:ui-design-system:check'),
  pnpm('unity:u43-device-p0-playable-runtime-repair:check'),
  pnpm('unity:u43-predevice-automated-smoke:check'),
  pnpm('unity:u44-web-to-unity-parity-audit:check'),
  pnpm('unity:u45-stage-battle-levelup-app-quality:check'),
  pnpm('unity:u45-settings-repair:check'),
  pnpm('unity:u45-ai-simulator-smoke:check'),
  pnpm('unity:u45-1-runtime-dot-animation:check'),
  pnpm('unity:u46-app-flow-save-result-collection:check'),
  pnpm('unity:u47-capture-catalog:check'),
  pnpm('unity:u47-simulator-manifest:check'),
  pnpm('unity:u47-gameplay-data-runtime:check'),
  pnpm('unity:u48-production-asset-expansion:check'),
  pnpm('unity:u48-production-asset-approval-pack:check'),
  pnpm('unity:u48-candidate-live-preview:check'),
  pnpm('unity:u48-batch-a-contracts:check'),
  pnpm('unity:u48-batch-a-review-ready:check'),
  pnpm('unity:u48-batch-b-review-ready:check'),
  {
    label: 'python3 scripts/unity/refresh-u48-batch-c-policy-hashes.py --check',
    executable: 'python3',
    args: ['scripts/unity/refresh-u48-batch-c-policy-hashes.py', '--check'],
  },
  pnpm('unity:u48-batch-c-contracts:check'),
  pnpm('unity:u48-batch-c-capture-readiness:check'),
  pnpm('unity:u48-batch-c-review-ready:check'),
  pnpm('unity:u48-human-selection:check'),
  pnpm('unity:u48-approved-production-set:check'),
  pnpm('unity:u48-production-visual-connection:check'),
  pnpm('unity:u48-production-visual-verification:check'),
  pnpm('unity:u48-stage-select-runtime:check'),
  pnpm('unity:u48-replacement-interaction:check'),
  pnpm('unity:runtime-visual-readiness:check'),
  pnpm('unity:meta:check'),
  pnpm('test'),
  pnpm('build'),
];

for (const command of commands) {
  console.log(`\n=== ${command.label} ===`);
  const result = spawnSync(command.executable, command.args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    console.error(`Failed to start ${command.label}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Preflight stopped: ${command.label} exited with ${result.status ?? 'unknown status'}`);
    process.exit(result.status ?? 1);
  }
}

console.log('\nUnity big implementation full preflight passed. U48 policy hashes and approval/promotion/connection/verification are covered; device, audio, haptic, performance, RC and production readiness are not promoted by this command.');
