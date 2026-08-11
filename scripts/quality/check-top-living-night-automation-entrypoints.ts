import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bundle = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json'), 'utf8'),
) as any;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const expected = {
  prepareReviewPack: 'scripts/unity/prepare-top-living-night-final-review-pack.sh',
  semanticLayerRegistrar: 'scripts/unity/register-top-living-night-semantic-layer-pack.ts',
  effectCompanionRegistrar: 'scripts/unity/register-top-living-night-effect-companion-pack.ts',
  unityV3Verification: 'scripts/unity/run-top-living-night-v3-unity-verification.sh',
  capturePack: 'scripts/unity/run-top-v3-final-approval-capture.sh',
  iosFinalEvidenceExport: 'scripts/unity/run-top-v3-final-approval-ios-export.sh',
  simulatorPerformance: 'scripts/unity/run-top-v3-simulator-performance-evidence.sh',
  physicalIphonePerformance: 'scripts/unity/run-top-v3-physical-iphone-performance-evidence.sh',
  staticReviewRegistrar: 'scripts/unity/register-top-living-night-static-review.ts',
  motionReviewRegistrar: 'scripts/unity/register-top-living-night-motion-review.ts',
  humanReviewRegistrar: 'scripts/unity/register-top-living-night-human-review.ts',
  finalPromotion: 'scripts/unity/promote-top-living-night-final-approval.ts',
} as const;

invariant(bundle.schemaVersion === 1, 'TOP automation entrypoint bundle schema mismatch');
invariant(bundle.automation && typeof bundle.automation === 'object', 'TOP generation bundle is missing automation entrypoints');
invariant(
  JSON.stringify(bundle.automation) === JSON.stringify(expected),
  'TOP generation automation entrypoints diverged from canonical scripts',
);

for (const [name, path] of Object.entries(expected)) {
  invariant(existsSync(join(root, path)), `TOP automation entrypoint is missing: ${name} -> ${path}`);
}

const iosExport = readFileSync(join(root, expected.iosFinalEvidenceExport), 'utf8');
invariant(
  iosExport.includes('git worktree add --detach "$WORKTREE" "$SOURCE_COMMIT"') &&
    iosExport.includes('VAMPPON_BUILD_SOURCE_COMMIT="$SOURCE_COMMIT"'),
  'canonical final iOS export must build from the exact V3/capture source commit in an isolated worktree',
);

const simulatorWrapper = readFileSync(join(root, expected.simulatorPerformance), 'utf8');
const physicalWrapper = readFileSync(join(root, expected.physicalIphonePerformance), 'utf8');
for (const [name, wrapper, target] of [
  ['Simulator', simulatorWrapper, 'simulator'],
  ['physical-iPhone', physicalWrapper, 'physical-iphone'],
] as const) {
  invariant(
    wrapper.includes('verify-top-v3-same-launch-build-provenance.sh') &&
      wrapper.includes(`prepare ${target}`) &&
      wrapper.includes(`wait ${target}`) &&
      wrapper.includes('wait "$PERF_PID"'),
    `canonical ${name} evidence must validate build provenance from the same measured process`,
  );
  invariant(
    !wrapper.includes('verify-top-living-night-installed-build-provenance.sh'),
    `canonical ${name} evidence must not use a separate pre-measurement app launch for provenance`,
  );
}

const promotion = readFileSync(join(root, expected.finalPromotion), 'utf8');
for (const registrarPath of [
  expected.semanticLayerRegistrar,
  expected.effectCompanionRegistrar,
  expected.staticReviewRegistrar,
  expected.motionReviewRegistrar,
  expected.humanReviewRegistrar,
]) {
  const registrar = readFileSync(join(root, registrarPath), 'utf8');
  invariant(!registrar.includes('approvedAsFinal = true'), `${registrarPath} must not bypass final promotion`);
  invariant(!registrar.includes('runtimeApproved = true'), `${registrarPath} must not bypass runtime promotion`);
}
invariant(promotion.includes('finalArt.approvedAsFinal = true'), 'canonical final promoter lost final approval write');
invariant(promotion.includes('finalArt.runtimeApproved = true'), 'canonical final promoter lost runtime approval write');

console.log('TOP Living Night automation entrypoints: PASS');
console.log('review prep / semantic + effect registration / V3 Unity / main-safe capture / exact-source iOS export / same-launch build-provenance-gated Simulator + physical iPhone / review registrars / final promoter are bundle-bound');
