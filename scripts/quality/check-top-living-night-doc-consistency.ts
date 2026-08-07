import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type UnityEvidence = {
  executed: boolean;
  result: string;
  verifiedCommit: string;
  unityVersion: string;
  assertionCount: number;
  failureCount: number;
  sourceAssetCount?: number;
  sourceCompositeKind?: string;
  sourceCompositePath?: string;
  sourceCompositeSha256?: string;
  resourceTextureCount: number;
  resourceMaterialCount?: number;
  buildImportPolicyPassed: boolean;
};

type FinalArtStatus = {
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
  core5IdentityReviewed: boolean;
  cropReviewComplete: boolean;
  motionSeparationReviewed: boolean;
  humanVisualReviewComplete: boolean;
  approvedAsFinal: boolean;
  runtimeCaptureComplete: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
};

const root = process.cwd();
const v2Readme = readFileSync(
  join(root, 'docs/design-targets/generated/top-living-night-v2/README.md'),
  'utf8',
);
const v3Readme = readFileSync(
  join(root, 'docs/design-targets/generated/top-living-night-v3/README.md'),
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

const canonicalFinalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

// V2 is historical supporting evidence and must remain immutable/valid.
invariant(v2.executed, 'V2 layer-kit Unity evidence must remain executed');
invariant(v2.result === 'PASSED', 'V2 layer-kit Unity evidence must remain PASSED');
invariant(v2.failureCount === 0, 'V2 layer-kit Unity evidence must have zero failures');
invariant(v2.assertionCount === 270, 'V2 layer-kit Unity evidence assertion count must remain 270');
invariant(v2.sourceAssetCount === 17, 'V2 layer-kit Unity evidence must cover 17 source assets');
invariant(v2.resourceTextureCount === 17, 'V2 layer-kit Unity evidence must cover 17 Resources textures');
invariant(v2.buildImportPolicyPassed, 'V2 layer-kit Unity import policy must remain PASSED');
invariant(v2.verifiedCommit.length === 40, 'V2 layer-kit verified commit must remain recorded');

// V3 may legitimately move from NOT_RUN -> PASSED. This checker follows the
// evidence state instead of hard-coding a permanent NOT_RUN assumption.
if (!v3.executed) {
  invariant(v3.result === 'NOT_RUN', 'unexecuted V3 Unity evidence must be NOT_RUN');
  invariant(v3.verifiedCommit === '', 'unexecuted V3 Unity evidence commit must be empty');
  invariant(v3.unityVersion === '', 'unexecuted V3 Unity version must be empty');
  invariant(v3.assertionCount === 0, 'unexecuted V3 Unity evidence must have zero assertions');
  invariant(v3.resourceTextureCount === 0, 'unexecuted V3 Unity evidence must have zero resource textures');
  invariant(v3.resourceMaterialCount === 0, 'unexecuted V3 Unity evidence must have zero resource materials');
  invariant((v3.sourceCompositeKind ?? '') === '', 'unexecuted V3 Unity evidence must not retain source kind');
  invariant((v3.sourceCompositePath ?? '') === '', 'unexecuted V3 Unity evidence must not retain source path');
  invariant((v3.sourceCompositeSha256 ?? '') === '', 'unexecuted V3 Unity evidence must not retain source SHA-256');
} else {
  invariant(v3.result === 'PASSED', 'executed V3 Unity evidence must be PASSED');
  invariant(/^[0-9a-f]{40}$/.test(v3.verifiedCommit), 'executed V3 Unity evidence commit is invalid');
  invariant(/^6000\.5\./.test(v3.unityVersion), 'executed V3 Unity version must remain 6000.5.x');
  invariant(v3.assertionCount > 0, 'executed V3 Unity evidence must have assertions');
  invariant(v3.failureCount === 0, 'executed V3 Unity evidence must have zero failures');
  invariant(v3.resourceTextureCount === 1, 'executed V3 Unity evidence must resolve one composite texture');
  invariant(v3.resourceMaterialCount === 1, 'executed V3 Unity evidence must resolve one additive material');
  invariant(v3.buildImportPolicyPassed, 'executed V3 Unity import policy must pass');
  invariant(['bridge', 'final-core5'].includes(v3.sourceCompositeKind ?? ''), 'executed V3 Unity evidence source kind is invalid');
  invariant(/^[0-9a-f]{64}$/.test(v3.sourceCompositeSha256 ?? ''), 'executed V3 Unity evidence source SHA-256 is invalid');
}

invariant(finalArt.candidatePath === canonicalFinalPath, 'final Core5 candidate path must remain canonical');
if (!finalArt.candidateGenerated) {
  invariant(finalArt.candidateSha256 === '', 'ungenerated final candidate must not retain SHA-256');
  invariant(!finalArt.core5IdentityReviewed, 'ungenerated final candidate cannot have Core5 identity approval');
  invariant(!finalArt.cropReviewComplete, 'ungenerated final candidate cannot have crop approval');
  invariant(!finalArt.motionSeparationReviewed, 'ungenerated final candidate cannot have motion separation approval');
  invariant(!finalArt.humanVisualReviewComplete, 'ungenerated final candidate cannot have human review approval');
  invariant(!finalArt.runtimeCaptureComplete, 'ungenerated final candidate cannot have runtime capture approval');
  invariant(!finalArt.approvedAsFinal, 'ungenerated final candidate cannot be final-approved');
  invariant(!finalArt.runtimeApproved, 'ungenerated final candidate cannot be runtime-approved');
  invariant(finalArt.finalApprovalBlocked, 'ungenerated final candidate must remain blocked');
} else {
  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateSha256), 'generated final candidate SHA-256 is invalid');
}

for (const token of [
  'V2_LAYER_KIT_VERIFIED / V3_RUNTIME_RECAPTURE_REQUIRED / FINAL_ART_BLOCKED',
  'verified 17-asset production layer kit and motion-source authority',
  'V2 layer-kit Unity evidence — PASSED',
  'executed=true',
  'result=PASSED',
  'assertionCount=270',
  'resourceTextureCount=17',
  'visual-recovery bridge',
  'not final Core5 key art',
]) {
  invariant(v2Readme.includes(token), `TOP V2 supporting-authority README boundary missing: ${token}`);
}

for (const stale of [
  'runtime-unity-verification.json` is currently `NOT_RUN`',
  'formal character identity comparison',
]) {
  invariant(!v2Readme.includes(stale), `TOP V2 README contains stale pre-V3 wording: ${stale}`);
}

for (const token of [
  'CURRENT_AUTHORITY / FINAL_ART_AND_RUNTIME_APPROVAL_BLOCKED',
  'Composite source promotion',
  'candidateGenerated=false',
  'candidateGenerated=true',
  'sourceCompositeKind=bridge | final-core5',
  'sourceCompositePath=<verified source path>',
  'sourceCompositeSha256=<verified source bytes>',
  'A previous V3 Unity PASS against `bridge` is **not** valid final-art Unity evidence',
  'This source promotion changes only which approved base composite is presented.',
  canonicalFinalPath,
]) {
  invariant(v3Readme.includes(token), `TOP V3 current-authority README boundary missing: ${token}`);
}

// The human-readable snapshot must track the JSON authority without embedding
// HEAD-specific CI numbers.
for (const token of [
  `v3UnityExecuted=${v3.executed}`,
  `v3UnityResult=${v3.result}`,
  `finalCandidateGenerated=${finalArt.candidateGenerated}`,
  `core5IdentityReviewed=${finalArt.core5IdentityReviewed}`,
  `cropReviewComplete=${finalArt.cropReviewComplete}`,
  `humanVisualReviewComplete=${finalArt.humanVisualReviewComplete}`,
  `approvedAsFinal=${finalArt.approvedAsFinal}`,
  `runtimeApproved=${finalArt.runtimeApproved}`,
  `finalApprovalBlocked=${finalArt.finalApprovalBlocked}`,
]) {
  invariant(v3Readme.includes(token), `TOP V3 README snapshot diverged from structured authority: ${token}`);
}

invariant(
  !/CI\s+#\d+|Stage1\s+#\d+|latest HEAD\s*[:=]\s*[0-9a-f]{7,40}/i.test(v3Readme),
  'TOP V3 README must not embed self-staling HEAD-specific CI/run snapshots',
);

console.log('TOP Living Night documentation consistency: PASS');
console.log('V2: historical Unity layer-kit evidence remains PASSED / 270 assertions / 17 textures');
console.log(`V3: ${v3.executed ? `PASSED/${v3.sourceCompositeKind}` : 'honest NOT_RUN'}; source promotion is state-aware`);
console.log(`final art: generated=${finalArt.candidateGenerated} runtimeApproved=${finalArt.runtimeApproved} finalBlocked=${finalArt.finalApprovalBlocked}`);
