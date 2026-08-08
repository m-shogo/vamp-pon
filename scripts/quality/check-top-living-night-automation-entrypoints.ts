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
  unityV3Verification: 'scripts/unity/run-top-living-night-v3-unity-verification.sh',
  capturePack: 'scripts/unity/run-loading-top-capture-pack.sh',
  simulatorPerformance: 'scripts/unity/run-top-living-night-simulator-performance-evidence.sh',
  physicalIphonePerformance: 'scripts/unity/run-top-living-night-physical-iphone-performance-evidence.sh',
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

const promotion = readFileSync(join(root, expected.finalPromotion), 'utf8');
for (const registrarPath of [
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
console.log('review prep / V3 Unity / capture / Simulator / physical iPhone / review registrars / final promoter are bundle-bound');
