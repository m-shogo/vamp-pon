export const requiredFullPreflightChecks = [
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
  'unity:u48-policy-provenance:check',
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
  'unity:u49-actual-device-audio-haptic:check',
  'unity:u50-thresholds:check',
  'unity:meta:check',
  'test',
  'build',
] as const;

const criticalChecks = [
  'implementation:preflight:check',
  'assets:verify',
  'unity:ui-design-system:check',
  'unity:u47-gameplay-data-runtime:check',
  'unity:u48-production-asset-expansion:check',
  'unity:u48-human-selection:check',
  'unity:u48-approved-production-set:check',
  'unity:u48-production-visual-connection:check',
  'unity:u48-production-visual-verification:check',
  'unity:u48-stage-select-runtime:check',
  'unity:u48-replacement-interaction:check',
  'unity:runtime-visual-readiness:check',
  'unity:u49-actual-device-audio-haptic:check',
  'unity:u50-thresholds:check',
  'unity:meta:check',
  'test',
  'build',
] as const;

const orderDependencies = [
  ['implementation:preflight:check', 'assets:verify'],
  ['unity:u47-gameplay-data-runtime:check', 'unity:u48-production-asset-expansion:check'],
  ['unity:u48-production-asset-expansion:check', 'unity:u48-human-selection:check'],
  ['unity:u48-human-selection:check', 'unity:u48-approved-production-set:check'],
  ['unity:u48-approved-production-set:check', 'unity:u48-production-visual-connection:check'],
  ['unity:u48-production-visual-connection:check', 'unity:u48-production-visual-verification:check'],
  ['unity:u48-production-visual-verification:check', 'unity:runtime-visual-readiness:check'],
  ['unity:runtime-visual-readiness:check', 'unity:u49-actual-device-audio-haptic:check'],
  ['unity:u49-actual-device-audio-haptic:check', 'unity:u50-thresholds:check'],
  ['unity:u50-thresholds:check', 'unity:meta:check'],
  ['unity:meta:check', 'test'],
  ['test', 'build'],
] as const;

export function assertFullPreflightManifest(packageScripts: Record<string, unknown>): void {
  const checks = [...requiredFullPreflightChecks];
  const duplicates = [...new Set(checks.filter((script, index) => checks.indexOf(script) !== index))];
  if (duplicates.length > 0) throw new Error(`full preflight has duplicate check(s): ${duplicates.join(', ')}`);

  for (const script of checks) {
    if (typeof packageScripts[script] !== 'string') {
      throw new Error(`full preflight references unknown package script: ${script}`);
    }
  }
  for (const script of criticalChecks) {
    if (!checks.includes(script)) throw new Error(`full preflight is missing critical check: ${script}`);
  }
  for (const [before, after] of orderDependencies) {
    if (checks.indexOf(before) >= checks.indexOf(after)) {
      throw new Error(`full preflight order invalid: ${before} must run before ${after}`);
    }
  }
}
