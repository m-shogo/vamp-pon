import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bundlePath = 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json';
const orderPath = 'docs/design-targets/generated/top-living-night-v3/model-input-order.txt';
const workflowPath = '.github/workflows/top-art-preproduction.yml';
const modelManifestArtifactPath = 'preproduction/model-input-manifest.json';
const modelManifestGenerator = 'scripts/unity/generate-top-living-night-model-input-manifest.py';
const modelManifestValidator = 'scripts/unity/validate-top-living-night-model-input-manifest.py';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const bundle = JSON.parse(readFileSync(join(root, bundlePath), 'utf8')) as any;
invariant(existsSync(join(root, orderPath)), 'TOP model input order authority is missing');
invariant(existsSync(join(root, workflowPath)), 'TOP preproduction workflow authority is missing');
invariant(existsSync(join(root, modelManifestGenerator)), 'TOP minimal model manifest generator is missing');
invariant(existsSync(join(root, modelManifestValidator)), 'TOP minimal model manifest validator is missing');

const modelInputs = bundle.preproductionModelInputs;
invariant(modelInputs, 'TOP generation bundle is missing preproductionModelInputs');
invariant(
  modelInputs.inputOrderAuthority === orderPath,
  'TOP generation bundle must bind the isolated model input-order authority',
);
invariant(
  modelInputs.workflow === workflowPath,
  'TOP generation bundle model-input workflow authority mismatch',
);
invariant(
  modelInputs.manifest === 'preproduction/manifest.json',
  'TOP generation bundle engineering preproduction manifest mismatch',
);
invariant(
  modelInputs.minimalManifest === modelManifestArtifactPath,
  'TOP generation bundle must bind the self-contained minimal model-input manifest',
);
invariant(
  modelInputs.primaryComposition === 'preproduction/core5-clean-composition-plate-v1.png',
  'TOP generation bundle primary composition mismatch',
);
const expectedCutouts = ['yui', 'asa', 'nagi', 'michiru', 'tomori'].map(
  id => `preproduction/core5-${id}-fullbody-cutout-v1.png`,
);
invariant(
  JSON.stringify(modelInputs.primaryIdentityCutouts) === JSON.stringify(expectedCutouts),
  'TOP generation bundle primary Core5 cutout order mismatch',
);
invariant(modelInputs.preproductionDoesNotApprove === true, 'TOP model-input bundle must remain non-approving');

const order = readFileSync(join(root, orderPath), 'utf8');
invariant(order.includes(`1. ${modelInputs.primaryComposition}`), 'TOP input-order authority must start with the bundle primary composition');
for (let index = 0; index < expectedCutouts.length; index += 1) {
  invariant(
    order.includes(`${index + 2}. ${expectedCutouts[index]}`),
    `TOP input-order authority diverged from bundle cutout order at index ${index}`,
  );
}
invariant(
  order.includes('Use only the following six images as visual inputs.'),
  'TOP input-order authority must keep the six-image-only boundary',
);
invariant(
  order.includes('Do not use any other image as a visual reference.'),
  'TOP input-order authority must forbid additional visual references',
);

const workflow = readFileSync(join(root, workflowPath), 'utf8');
const modelUploadStart = workflow.indexOf('- name: Upload minimal clean TOP model-input bundle');
const engineeringUploadStart = workflow.indexOf('- name: Upload TOP preproduction engineering pack');
invariant(modelUploadStart >= 0 && engineeringUploadStart > modelUploadStart, 'TOP minimal model-input upload block is missing');
const modelUpload = workflow.slice(modelUploadStart, engineeringUploadStart);
invariant(
  modelUpload.includes('docs/design-targets/generated/top-living-night-v3/preproduction/model-input-manifest.json'),
  'TOP minimal artifact must physically include the bundle-bound minimal manifest',
);
invariant(
  !modelUpload.includes('docs/design-targets/generated/top-living-night-v3/preproduction/manifest.json'),
  'TOP minimal artifact must not ship the broader engineering manifest',
);

console.log('TOP model-input bundle binding: PASS');
console.log('generation bundle -> isolated input-order authority + self-contained minimal manifest -> sanitized composition + five ordered Core5 cutouts');
