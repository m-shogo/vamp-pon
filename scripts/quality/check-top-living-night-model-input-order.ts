import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const orderPath = 'docs/design-targets/generated/top-living-night-v3/model-input-order.txt';
const workflowPath = '.github/workflows/top-art-preproduction.yml';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(join(root, orderPath)), 'TOP model visual input-order authority is missing');
invariant(existsSync(join(root, workflowPath)), 'TOP preproduction workflow is missing');

const order = readFileSync(join(root, orderPath), 'utf8');
const workflow = readFileSync(join(root, workflowPath), 'utf8');

const requiredImages = [
  'preproduction/core5-clean-composition-plate-v1.png',
  'preproduction/core5-yui-fullbody-cutout-v1.png',
  'preproduction/core5-asa-fullbody-cutout-v1.png',
  'preproduction/core5-nagi-fullbody-cutout-v1.png',
  'preproduction/core5-michiru-fullbody-cutout-v1.png',
  'preproduction/core5-tomori-fullbody-cutout-v1.png',
];

for (const image of requiredImages) {
  invariant(order.includes(image), `TOP model input order lost required image: ${image}`);
}
for (const name of ['Yui', 'Asa', 'Nagi', 'Michiru', 'Tomori']) {
  invariant(order.includes(`${name} identity only.`), `TOP model input order lost identity-only role: ${name}`);
}
for (const token of [
  'Use only the following six images as visual inputs.',
  'Do not invent any human from this image.',
  'Exactly five foreground humans must appear: Yui, Asa, Nagi, Michiru and Tomori.',
  'No sixth human, no generic substitute, no duplicate identity.',
  'Do not use any other image as a visual reference.',
  'do not use a raw bridge image, old human layers, layout proof, diagnostic contact sheet, removal mask, status screen, dashboard or interface screenshot.',
  'Use final-key-art-isolated-prompt.txt as the text instruction.',
  'Output one continuous portrait illustration only: PNG, 430x932',
  'no typography, no logo, no interface, no panels, no infographic, no watermark.',
]) {
  invariant(order.includes(token), `TOP model input-order visual-only guard missing: ${token}`);
}

for (const forbidden of [
  'm-shogo/vamp-pon',
  'agent/top-living-night-key-art-v1',
  'pull request',
  'CI #',
  'Stage1 #',
  'mergeable',
  'roadmap',
  'runtimeApproved=',
  'candidateGenerated=',
]) {
  invariant(!order.includes(forbidden), `TOP model input order leaked development context: ${forbidden}`);
}

const modelUploadStart = workflow.indexOf('- name: Upload minimal clean TOP model-input bundle');
const engineeringUploadStart = workflow.indexOf('- name: Upload TOP preproduction engineering pack');
invariant(modelUploadStart >= 0 && engineeringUploadStart > modelUploadStart, 'TOP minimal model-input upload block is missing');
const modelUpload = workflow.slice(modelUploadStart, engineeringUploadStart);
invariant(modelUpload.includes('model-input-order.txt'), 'TOP minimal model-input bundle must include visual input-order authority');
for (const image of requiredImages) {
  invariant(modelUpload.includes(image.replace('preproduction/', 'docs/design-targets/generated/top-living-night-v3/preproduction/')), `TOP minimal model-input upload lost required image: ${image}`);
}

console.log('TOP Living Night model visual input order: PASS');
console.log('exact visual set: sanitized composition + Yui/Asa/Nagi/Michiru/Tomori cutouts only; isolated prompt; no development context or extra reference images');
