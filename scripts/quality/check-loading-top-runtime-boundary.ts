import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const generatedRoot = join(root, 'docs/design-targets/generated/loading-seasonal-v1');
const manifest = JSON.parse(readFileSync(join(generatedRoot, 'manifest.json'), 'utf8')) as {
  schemaVersion: string;
  flow: string;
  assetStatus: string;
  runtimeConnected: boolean;
  randomRotation: boolean;
  consecutiveRepeatPrevented: boolean;
  usesFallbackSources: boolean;
  assets: Array<{
    id: string;
    sourceStatus: string;
    sourcePath: string;
    resourceFile: string;
    width: number;
    height: number;
    sha256: string;
  }>;
  capture: {
    targetResolutions: string[];
    requiredFrames: string[];
  };
  approval: {
    runtimeFlowImplemented: boolean;
    seasonalBinariesCommitted: boolean;
    runtimeCaptureComplete: boolean;
    humanVisualReviewComplete: boolean;
    approvedAsFinal: boolean;
    runtimeApproved: boolean;
    finalApprovalBlocked: boolean;
  };
};
const capture = JSON.parse(
  readFileSync(join(generatedRoot, 'runtime-capture-manifest.json'), 'utf8'),
) as {
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
  generatedAtUtc: string;
  error: string;
  captures: unknown[];
};
const evidence = JSON.parse(
  readFileSync(join(generatedRoot, 'runtime-unity-verification.json'), 'utf8'),
) as {
  executed: boolean;
  result: string;
  failureCount: number;
  sourceAssetCount: number;
  resourceTextureCount: number;
};
const finalArt = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'),
    'utf8',
  ),
) as {
  candidateGenerated: boolean;
  core5IdentityReviewed: boolean;
  cropReviewComplete: boolean;
  motionSeparationReviewed: boolean;
  humanVisualReviewComplete: boolean;
  approvedAsFinal: boolean;
  runtimeCaptureComplete: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
};
const loadingView = readFileSync(
  join(root, 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingSeasonalView.cs'),
  'utf8',
);
const shell = readFileSync(
  join(root, 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs'),
  'utf8',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function pngDimensions(bytes: Buffer): [number, number] {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(bytes.subarray(0, 8).equals(signature), 'invalid seasonal PNG signature');
  invariant(bytes.subarray(12, 16).toString('ascii') === 'IHDR', 'seasonal PNG IHDR missing');
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

invariant(manifest.schemaVersion === 'loading-seasonal.0.1', 'unexpected Loading schema');
invariant(manifest.flow === 'Loading -> TOP -> StageSelect/Collection', 'startup flow mismatch');
invariant(manifest.assetStatus === 'runtime-connected-seasonal-binaries', 'seasonal asset status mismatch');
invariant(manifest.runtimeConnected, 'Loading runtime must remain connected');
invariant(manifest.randomRotation, 'random Loading rotation must remain enabled');
invariant(manifest.consecutiveRepeatPrevented, 'consecutive repeat prevention missing');
invariant(!manifest.usesFallbackSources, 'seasonal Loading must not use fallback sources');
invariant(manifest.assets.length === 4, 'exactly four seasonal Loading assets are required');
invariant(manifest.approval.runtimeFlowImplemented, 'runtime flow flag missing');
invariant(manifest.approval.seasonalBinariesCommitted, 'seasonal binary flag missing');
invariant(!manifest.approval.humanVisualReviewComplete, 'human review must remain pending');
invariant(!manifest.approval.approvedAsFinal, 'final approval must remain false');
invariant(!manifest.approval.runtimeApproved, 'runtime approval must remain false');
invariant(manifest.approval.finalApprovalBlocked, 'final approval block must remain true');
invariant(
  JSON.stringify(manifest.capture.targetResolutions) ===
    JSON.stringify(['360x800', '390x844', '430x932']),
  'capture resolution matrix mismatch',
);
invariant(manifest.capture.requiredFrames.length === 5, 'capture frame family count mismatch');

invariant(!finalArt.approvedAsFinal, 'TOP final art must remain unapproved while startup approval is blocked');
invariant(!finalArt.runtimeApproved, 'TOP final art runtime approval must remain false');
invariant(finalArt.finalApprovalBlocked, 'TOP final art approval block must remain true');
if (!finalArt.candidateGenerated) {
  invariant(!finalArt.core5IdentityReviewed, 'missing final TOP candidate cannot have identity approval');
  invariant(!finalArt.cropReviewComplete, 'missing final TOP candidate cannot have crop approval');
  invariant(!finalArt.motionSeparationReviewed, 'missing final TOP candidate cannot have motion approval');
  invariant(!finalArt.humanVisualReviewComplete, 'missing final TOP candidate cannot have human approval');
  invariant(!finalArt.runtimeCaptureComplete, 'missing final TOP candidate cannot have final runtime capture approval');
}

const expected = [
  ['spring', 'loading-01-spring.png'],
  ['summer', 'loading-02-summer.png'],
  ['autumn', 'loading-03-autumn.png'],
  ['winter', 'loading-04-winter.png'],
] as const;

for (const [index, [id, file]] of expected.entries()) {
  const asset = manifest.assets[index];
  invariant(asset.id === id, `season slot ${index} mismatch`);
  invariant(asset.resourceFile === file, `${id}: resource filename mismatch`);
  invariant(asset.sourceStatus === 'seasonal-source', `${id}: source status mismatch`);
  invariant(
    asset.sourcePath === `docs/design-targets/generated/loading-seasonal-v1/sources/${file}`,
    `${id}: source path mismatch`,
  );

  const bytes = readFileSync(join(root, asset.sourcePath));
  const [width, height] = pngDimensions(bytes);
  invariant(width === asset.width && height === asset.height, `${id}: PNG dimensions mismatch`);
  invariant(height > width, `${id}: source must remain portrait`);
  invariant(
    createHash('sha256').update(bytes).digest('hex') === asset.sha256,
    `${id}: SHA-256 mismatch`,
  );
}

for (const token of [
  'SelectNonRepeatingIndex',
  'UnityEngine.Random.Range',
  'MinimumVisibleSeconds = 1.35f',
  'AspectRatioFitter.AspectMode.EnvelopeParent',
  'LoadingStatusCopy',
  '夜の記憶をひらいています…',
  'CaptureHoldKey',
  'ReleaseTexture',
]) {
  invariant(loadingView.includes(token), `Loading runtime contract missing: ${token}`);
}
invariant(!loadingView.includes('capture hold ·'), 'development capture text must never enter rendered Loading UI');

for (const token of [
  'LoadingSeasonalView loading',
  'loading.Build(canvasObject.transform, appFont, CompleteLoading)',
  'private void CompleteLoading()',
  'private void BuildTopIfNeeded()',
  'top.Build(appFlowCanvas.transform, appFont, DismissTop, OpenCollectionFromTop)',
  '#if !VAMPPON_AI_SIMULATOR_SMOKE',
]) {
  invariant(shell.includes(token), `Loading -> TOP shell contract missing: ${token}`);
}

invariant(capture.expectedCaptureCount === 15, 'capture matrix must remain 15 frames');
if (!capture.executed) {
  invariant(capture.result === 'NOT_RUN', 'unexecuted capture must be NOT_RUN');
  invariant(capture.captureCount === 0, 'unexecuted capture count must be zero');
  invariant(capture.captures.length === 0, 'unexecuted capture records must be empty');
  invariant(capture.generatedAtUtc === '', 'unexecuted capture timestamp must be empty');
  invariant(capture.error === '', 'unexecuted capture error must be empty');
  invariant(!manifest.approval.runtimeCaptureComplete, 'stale runtime capture must not remain promoted');
} else {
  invariant(capture.result === 'PASSED', 'executed capture must be PASSED');
  invariant(capture.captureCount === 15, 'executed capture count must be 15');
  invariant(capture.captures.length === 15, 'executed capture records must contain 15 entries');
  invariant(capture.generatedAtUtc.length > 0, 'executed capture timestamp missing');
  invariant(capture.error === '', 'passed capture must not contain an error');
  if (manifest.approval.runtimeCaptureComplete)
    invariant(capture.result === 'PASSED', 'promoted runtime capture requires PASSED evidence');
}

invariant(evidence.executed, 'Loading Unity evidence must remain executed');
invariant(evidence.result === 'PASSED', 'Loading Unity evidence must remain PASSED');
invariant(evidence.failureCount === 0, 'Loading Unity evidence failure count must be zero');
invariant(evidence.sourceAssetCount === 4, 'Loading Unity source count mismatch');
invariant(evidence.resourceTextureCount === 4, 'Loading Unity Resources count mismatch');

console.log('Loading -> TOP runtime boundary: PASS');
console.log(`capture: ${capture.executed ? '15/15 PASSED; promotion may remain pending' : 'honest NOT_RUN after visual implementation changed'}`);
console.log(`final art: ${finalArt.candidateGenerated ? 'candidate exists; final approval remains blocked' : 'honest NOT_RUN Core5 final candidate boundary'}`);
console.log('approval: human/device review and final approval remain blocked');
