import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type V2Evidence = {
  schemaVersion: number;
  executed: boolean;
  result: string;
  verifiedCommit: string;
  unityVersion: string;
  assertionCount: number;
  failureCount: number;
  sourceAssetCount: number;
  resourceTextureCount: number;
  viewTypeResolved: boolean;
  buildHookResolved: boolean;
  manifestProvenancePassed: boolean;
  buildImportPolicyPassed: boolean;
  generatedAtUtc: string;
  error: string;
};

type V3Evidence = {
  schemaVersion: number;
  executed: boolean;
  result: string;
  verifiedCommit: string;
  unityVersion: string;
  assertionCount: number;
  failureCount: number;
  sourceCompositeCount: number;
  sourceCompositeKind: string;
  sourceCompositePath: string;
  sourceCompositeSha256: string;
  resourceTextureCount: number;
  resourceMaterialCount: number;
  controllerResolved: boolean;
  shaderResolved: boolean;
  buildHookResolved: boolean;
  buildImportPolicyPassed: boolean;
  generatedAtUtc: string;
  error: string;
};

type FinalArtStatus = {
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
};

const root = process.cwd();
const v2 = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v2/runtime-unity-verification.json'),
    'utf8',
  ),
) as V2Evidence;
const v3 = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json'),
    'utf8',
  ),
) as V3Evidence;
const finalArt = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'),
    'utf8',
  ),
) as FinalArtStatus;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const bridgePath =
  'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const bridgeSha256 =
  'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d';
const finalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

// V2 is historical-but-valid execution evidence for the verified 17-layer kit.
invariant(v2.schemaVersion === 1, 'unexpected V2 TOP Unity evidence schema');
invariant(v2.executed, 'V2 layer-kit Unity evidence must remain executed');
invariant(v2.result === 'PASSED', 'V2 layer-kit Unity evidence must remain PASSED');
invariant(/^[0-9a-f]{40}$/.test(v2.verifiedCommit), 'V2 executed evidence commit is missing');
invariant(/^6000\.5\./.test(v2.unityVersion), 'V2 executed evidence Unity version mismatch');
invariant(v2.assertionCount === 270, 'V2 executed evidence assertion count must remain 270');
invariant(v2.failureCount === 0, 'V2 executed evidence must have no failures');
invariant(v2.sourceAssetCount === 17, 'V2 Unity evidence asset count mismatch');
invariant(v2.resourceTextureCount === 17, 'V2 Resources import must resolve 17 textures');
invariant(v2.viewTypeResolved, 'V2 TOP view type was not resolved');
invariant(v2.buildHookResolved, 'V2 TOP build hook was not resolved');
invariant(v2.manifestProvenancePassed, 'V2 TOP manifest provenance did not pass');
invariant(v2.buildImportPolicyPassed, 'V2 TOP build import policy did not pass');
invariant(Boolean(v2.generatedAtUtc), 'V2 executed evidence timestamp is missing');
invariant(v2.error === '', 'V2 passing evidence must not contain an error');

// V3 is the current runtime composition authority. Do not let the V2 PASS imply
// that the current composite/shader/Resources path has been executed.
invariant(v3.schemaVersion === 1, 'unexpected V3 TOP Unity evidence schema');
invariant(v3.sourceCompositeCount === 1, 'V3 must retain one base-composite source');
invariant(finalArt.candidatePath === finalPath, 'final TOP candidate path must remain canonical');

if (!v3.executed) {
  invariant(v3.result === 'NOT_RUN', 'unexecuted V3 evidence result must be NOT_RUN');
  invariant(v3.verifiedCommit === '', 'unexecuted V3 evidence commit must be empty');
  invariant(v3.unityVersion === '', 'unexecuted V3 Unity version must be empty');
  invariant(v3.assertionCount === 0, 'unexecuted V3 assertion count must be zero');
  invariant(v3.failureCount === 0, 'unexecuted V3 failure count must be zero');
  invariant(v3.sourceCompositeKind === '', 'unexecuted V3 source kind must be empty');
  invariant(v3.sourceCompositePath === '', 'unexecuted V3 source path must be empty');
  invariant(v3.sourceCompositeSha256 === '', 'unexecuted V3 source SHA-256 must be empty');
  invariant(v3.resourceTextureCount === 0, 'unexecuted V3 Resources texture count must be zero');
  invariant(v3.resourceMaterialCount === 0, 'unexecuted V3 Resources material count must be zero');
  invariant(!v3.controllerResolved, 'unexecuted V3 controller flag must remain false');
  invariant(!v3.shaderResolved, 'unexecuted V3 shader flag must remain false');
  invariant(!v3.buildHookResolved, 'unexecuted V3 build-hook flag must remain false');
  invariant(!v3.buildImportPolicyPassed, 'unexecuted V3 import-policy flag must remain false');
  invariant(v3.generatedAtUtc === '', 'unexecuted V3 timestamp must be empty');
  invariant(v3.error === '', 'unexecuted V3 error must be empty');
} else {
  invariant(v3.result === 'PASSED', 'executed V3 Unity verification must pass');
  invariant(/^[0-9a-f]{40}$/.test(v3.verifiedCommit), 'executed V3 evidence commit is missing');
  invariant(/^6000\.5\./.test(v3.unityVersion), 'executed V3 Unity version mismatch');
  invariant(v3.assertionCount > 0, 'executed V3 assertion count must be positive');
  invariant(v3.failureCount === 0, 'executed V3 evidence must have no failures');
  invariant(v3.resourceTextureCount === 1, 'executed V3 must resolve one base-composite Resources texture');
  invariant(v3.resourceMaterialCount === 1, 'executed V3 must resolve one additive Resources material');
  invariant(v3.controllerResolved, 'executed V3 controller must resolve');
  invariant(v3.shaderResolved, 'executed V3 shader must resolve');
  invariant(v3.buildHookResolved, 'executed V3 build hook must resolve');
  invariant(v3.buildImportPolicyPassed, 'executed V3 import policy must pass');
  invariant(Boolean(v3.generatedAtUtc), 'executed V3 timestamp is missing');
  invariant(v3.error === '', 'executed passing V3 evidence must not contain an error');
  invariant(/^[0-9a-f]{64}$/.test(v3.sourceCompositeSha256), 'executed V3 source SHA-256 is invalid');

  if (finalArt.candidateGenerated) {
    invariant(v3.sourceCompositeKind === 'final-core5', 'final TOP candidate requires V3 evidence from final-core5 source');
    invariant(v3.sourceCompositePath === finalPath, 'final TOP candidate requires V3 evidence from canonical final source');
    invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateSha256), 'generated final TOP candidate SHA-256 is invalid');
    invariant(
      v3.sourceCompositeSha256 === finalArt.candidateSha256,
      'V3 Unity evidence must target the exact current final TOP candidate SHA-256',
    );
  } else {
    invariant(v3.sourceCompositeKind === 'bridge', 'pre-final V3 evidence must identify the bridge source');
    invariant(v3.sourceCompositePath === bridgePath, 'pre-final V3 evidence must target the canonical bridge path');
    invariant(v3.sourceCompositeSha256 === bridgeSha256, 'pre-final V3 bridge evidence SHA-256 mismatch');
  }
}

console.log('TOP Living Night Unity evidence boundary: PASS');
console.log(`V2 layer kit: PASSED at ${v2.verifiedCommit.slice(0, 12)} / 270 assertions / 17 textures`);
console.log(
  `current V3 composite/shader: ${v3.executed ? `PASSED at ${v3.verifiedCommit.slice(0, 12)} / ${v3.sourceCompositeKind}` : 'honest NOT_RUN'}`,
);
console.log('V2 execution evidence and stale bridge V3 evidence cannot promote current final Core5 runtime approval.');
