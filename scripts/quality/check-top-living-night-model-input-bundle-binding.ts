import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bundlePath = 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json';
const orderPath = 'docs/design-targets/generated/top-living-night-v3/model-input-order.txt';
const workflowPath = '.github/workflows/top-art-preproduction.yml';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const bundle = JSON.parse(readFileSync(join(root, bundlePath), 'utf8')) as any;
invariant(existsSync(join(root, orderPath)), 'TOP model input order authority is missing');
invariant(existsSync(join(root, workflowPath)), 'TOP preproduction workflow authority is missing');

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

console.log('TOP model-input bundle binding: PASS');
console.log('generation bundle -> isolated input-order authority -> sanitized composition + five ordered Core5 cutouts');
