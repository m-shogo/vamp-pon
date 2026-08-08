import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const orderPath = 'docs/design-targets/generated/top-living-night-v3/model-input-order.txt';
const workflowPath = '.github/workflows/top-art-preproduction.yml';
function invariant(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
invariant(existsSync(join(root, orderPath)), 'TOP model visual input-order authority is missing');
invariant(existsSync(join(root, workflowPath)), 'TOP preproduction workflow is missing');
const order = readFileSync(join(root, orderPath), 'utf8');
const workflow = readFileSync(join(root, workflowPath), 'utf8');
const requiredImages = [
  'preproduction/core5-clean-composition-plate-v1.png',
  'preproduction/core5-yui-identity-reference-v1.png',
  'preproduction/core5-asa-identity-reference-v1.png',
  'preproduction/core5-nagi-identity-reference-v1.png',
  'preproduction/core5-michiru-identity-reference-v1.png',
  'preproduction/core5-tomori-identity-reference-v1.png',
];
for (const image of requiredImages) invariant(order.includes(image), `TOP model input order lost required image: ${image}`);
for (const name of ['Yui','Asa','Nagi','Michiru','Tomori']) invariant(order.includes(`${name} identity only.`), `TOP model input order lost identity-only role: ${name}`);
for (const token of [
  'Use only the following six images as visual inputs.',
  'single-human full-body crop from the locked master',
  'not its paper/ground background',
  'Exactly five foreground humans must appear: Yui, Asa, Nagi, Michiru and Tomori.',
  'No sixth human, no generic substitute, no duplicate identity.',
  'Mobile portrait depth is mandatory: do not make all five humans small',
  'One or two Core5 characters must read clearly nearer and larger',
  'Do not use engineering fullbody-cutout PNGs',
  'Do not use any other image as a visual reference.',
  'Use final-key-art-isolated-prompt.txt as the text instruction.',
  'Output one continuous portrait illustration only: PNG, 430x932',
]) invariant(order.includes(token), `TOP model input-order guard missing: ${token}`);
for (const forbidden of ['m-shogo/vamp-pon','agent/top-living-night-key-art-v1','pull request','CI #','Stage1 #','mergeable','runtimeApproved=','candidateGenerated=','preproduction/core5-yui-fullbody-cutout-v1.png']) invariant(!order.includes(forbidden), `TOP model input order leaked forbidden context/reference: ${forbidden}`);
const start = workflow.indexOf('- name: Upload minimal clean TOP model-input bundle');
const end = workflow.indexOf('- name: Upload TOP preproduction engineering pack');
invariant(start >= 0 && end > start, 'TOP minimal model-input upload block is missing');
const block = workflow.slice(start, end);
invariant(block.includes('model-input-order.txt') && block.includes('preproduction/model-input-manifest.json'), 'TOP minimal model-input bundle must include order + self-contained manifest');
invariant(!block.includes('preproduction/manifest.json') && !block.includes('fullbody-cutout-v1.png'), 'TOP minimal model-input bundle must exclude engineering manifest/cutouts');
for (const image of requiredImages) invariant(block.includes(image.replace('preproduction/', 'docs/design-targets/generated/top-living-night-v3/preproduction/')), `TOP minimal upload lost clean image: ${image}`);
console.log('TOP Living Night model visual input order: PASS');
console.log('exact visual set: sanitized composition + five clean single-human Core5 identity references; engineering cutouts/backgrounds explicitly non-authoritative');
