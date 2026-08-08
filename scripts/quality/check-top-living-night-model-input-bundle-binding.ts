import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bundlePath = 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json';
const orderPath = 'docs/design-targets/generated/top-living-night-v3/model-input-order.txt';
const workflowPath = '.github/workflows/top-art-preproduction.yml';
const modelManifestArtifactPath = 'preproduction/model-input-manifest.json';
const modelManifestGenerator = 'scripts/unity/generate-top-living-night-model-input-manifest.py';
const modelManifestValidator = 'scripts/unity/validate-top-living-night-model-input-manifest.py';
function invariant(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
const bundle = JSON.parse(readFileSync(join(root, bundlePath), 'utf8')) as any;
for (const path of [orderPath, workflowPath, modelManifestGenerator, modelManifestValidator]) invariant(existsSync(join(root, path)), `TOP model-input authority missing: ${path}`);
const modelInputs = bundle.preproductionModelInputs;
invariant(modelInputs.inputOrderAuthority === orderPath, 'TOP generation bundle must bind isolated model input-order authority');
invariant(modelInputs.workflow === workflowPath, 'TOP generation bundle model-input workflow mismatch');
invariant(modelInputs.manifest === 'preproduction/manifest.json', 'TOP engineering manifest mismatch');
invariant(modelInputs.minimalManifest === modelManifestArtifactPath, 'TOP minimal model manifest mismatch');
invariant(modelInputs.primaryComposition === 'preproduction/core5-clean-composition-plate-v1.png', 'TOP primary composition mismatch');
const expectedRefs = ['yui','asa','nagi','michiru','tomori'].map(id => `preproduction/core5-${id}-identity-reference-v1.png`);
const engineeringCutouts = ['yui','asa','nagi','michiru','tomori'].map(id => `preproduction/core5-${id}-fullbody-cutout-v1.png`);
invariant(JSON.stringify(modelInputs.primaryIdentityCutouts) === JSON.stringify(expectedRefs), 'TOP generation bundle primary clean identity-reference order mismatch');
invariant(modelInputs.identityInputKind === 'single-human-full-body-master-crop', 'TOP identity input kind mismatch');
invariant(modelInputs.engineeringCutoutsGeneratorFacing === false, 'TOP engineering cutouts must remain non-generator-facing');
for (const cutout of engineeringCutouts) invariant(modelInputs.forbiddenModelInputs.includes(cutout), `TOP forbidden model inputs lost engineering cutout: ${cutout}`);
invariant(modelInputs.preproductionDoesNotApprove === true, 'TOP model-input bundle must remain non-approving');

const order = readFileSync(join(root, orderPath), 'utf8');
invariant(order.includes(`1. ${modelInputs.primaryComposition}`), 'TOP order must start with bundle primary composition');
for (let index=0; index<expectedRefs.length; index++) invariant(order.includes(`${index+2}. ${expectedRefs[index]}`), `TOP input order diverged at clean identity index ${index}`);
invariant(order.includes('Use only the following six images as visual inputs.'), 'TOP input order lost six-image boundary');
invariant(order.includes('Do not use engineering fullbody-cutout PNGs'), 'TOP input order must forbid engineering cutouts');

const workflow = readFileSync(join(root, workflowPath), 'utf8');
const start = workflow.indexOf('- name: Upload minimal clean TOP model-input bundle');
const end = workflow.indexOf('- name: Upload TOP preproduction engineering pack');
invariant(start >= 0 && end > start, 'TOP minimal model-input upload block missing');
const block = workflow.slice(start,end);
invariant(block.includes('preproduction/model-input-manifest.json'), 'TOP minimal artifact must include minimal manifest');
invariant(!block.includes('preproduction/manifest.json'), 'TOP minimal artifact must exclude engineering manifest');
for (const ref of expectedRefs) invariant(block.includes(ref.replace('preproduction/','docs/design-targets/generated/top-living-night-v3/preproduction/')), `TOP minimal artifact lost clean identity ref: ${ref}`);
for (const cutout of engineeringCutouts) invariant(!block.includes(cutout), `TOP minimal artifact leaked engineering cutout: ${cutout}`);
console.log('TOP model-input bundle binding: PASS');
console.log('generation bundle -> input-order + minimal manifest -> sanitized composition + five clean single-human identity refs; engineering cutouts forbidden');
