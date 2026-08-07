import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type UnityEvidence = {
  executed: boolean;
  result: string;
  verifiedCommit: string;
  assertionCount: number;
  failureCount: number;
  sourceAssetCount?: number;
  resourceTextureCount: number;
  resourceMaterialCount?: number;
  buildImportPolicyPassed: boolean;
};

type FinalArtStatus = {
  candidateGenerated: boolean;
  core5IdentityReviewed: boolean;
  cropReviewComplete: boolean;
  approvedAsFinal: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
};

const root = process.cwd();
const readme = readFileSync(
  join(root, 'docs/design-targets/generated/top-living-night-v2/README.md'),
  'utf8',
);
const v2 = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v2/runtime-unity-verification.json'),
    'utf8',
  ),
) as UnityEvidence;
const v3 = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json'),
    'utf8',
  ),
) as UnityEvidence;
const finalArt = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'),
    'utf8',
  ),
) as FinalArtStatus;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(v2.executed, 'V2 layer-kit Unity evidence must remain executed');
invariant(v2.result === 'PASSED', 'V2 layer-kit Unity evidence must remain PASSED');
invariant(v2.failureCount === 0, 'V2 layer-kit Unity evidence must have zero failures');
invariant(v2.assertionCount === 270, 'V2 layer-kit Unity evidence assertion count must remain 270');
invariant(v2.sourceAssetCount === 17, 'V2 layer-kit Unity evidence must cover 17 source assets');
invariant(v2.resourceTextureCount === 17, 'V2 layer-kit Unity evidence must cover 17 Resources textures');
invariant(v2.buildImportPolicyPassed, 'V2 layer-kit Unity import policy must remain PASSED');
invariant(v2.verifiedCommit.length === 40, 'V2 layer-kit verified commit must remain recorded');

invariant(!v3.executed, 'current V3 Unity evidence must remain NOT_RUN until current execution occurs');
invariant(v3.result === 'NOT_RUN', 'current V3 Unity evidence must be NOT_RUN');
invariant(v3.assertionCount === 0, 'unexecuted V3 Unity evidence must have zero assertions');
invariant(v3.resourceTextureCount === 0, 'unexecuted V3 Unity evidence must have zero resource textures');
invariant(v3.resourceMaterialCount === 0, 'unexecuted V3 Unity evidence must have zero resource materials');

invariant(!finalArt.candidateGenerated, 'final Core5 candidate must remain ungenerated until canonical PNG exists');
invariant(!finalArt.core5IdentityReviewed, 'final Core5 identity review must remain pending');
invariant(!finalArt.cropReviewComplete, 'final crop review must remain pending');
invariant(!finalArt.approvedAsFinal, 'TOP final approval must remain false');
invariant(!finalArt.runtimeApproved, 'TOP runtime approval must remain false');
invariant(finalArt.finalApprovalBlocked, 'TOP final approval must remain blocked');

for (const token of [
  'V2_LAYER_KIT_VERIFIED / V3_RUNTIME_RECAPTURE_REQUIRED / FINAL_ART_BLOCKED',
  'verified 17-asset production layer kit and motion-source authority',
  'V2 layer-kit Unity evidence — PASSED',
  'executed=true',
  'result=PASSED',
  'assertionCount=270',
  'resourceTextureCount=17',
  'Current V3 Unity evidence — NOT_RUN',
  'executed=false',
  'result=NOT_RUN',
  'finalCandidateGenerated=false',
  'core5IdentityReviewed=false',
  'cropReviewComplete=false',
  'approvedAsFinal=false',
  'runtimeApproved=false',
  'finalApprovalBlocked=true',
  'visual-recovery bridge',
  'not final Core5 key art',
]) {
  invariant(readme.includes(token), `TOP V2/V3 README boundary missing: ${token}`);
}

for (const stale of [
  'runtime-unity-verification.json` is currently `NOT_RUN`',
  'formal character identity comparison',
]) {
  invariant(!readme.includes(stale), `TOP V2 README contains stale pre-V3 wording: ${stale}`);
}

console.log('TOP Living Night documentation consistency: PASS');
console.log('V2: real Unity layer-kit evidence PASSED / 270 assertions / 17 textures');
console.log('V3: current composite/shader Unity evidence honestly NOT_RUN');
console.log('final art: Core5 candidate/review/runtime approval remain blocked');
