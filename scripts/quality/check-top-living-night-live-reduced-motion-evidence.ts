import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const statusPath = 'docs/design-targets/generated/top-living-night-v3/motion-review-status.json';
const planPath = 'docs/design-targets/generated/top-living-night-v3/motion-review-plan.md';
const registrarPath = 'scripts/unity/register-top-living-night-motion-review.ts';
const templatePath = 'scripts/unity/create-top-living-night-runtime-review-templates.ts';
const status = JSON.parse(readFileSync(join(root, statusPath), 'utf8')) as any;
const plan = readFileSync(join(root, planPath), 'utf8');
const registrar = readFileSync(join(root, registrarPath), 'utf8');
const template = readFileSync(join(root, templatePath), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const fields = [
  'liveToggleToReducedSettled',
  'liveToggleBackToNormalSettled',
  'noToggleVisualPopOrDuplication',
] as const;

invariant(status.schemaVersion === 1, 'TOP live Reduced Motion evidence schema mismatch');
invariant(status.reducedMotion && typeof status.reducedMotion === 'object', 'TOP Reduced Motion evidence block is missing');

for (const field of fields) {
  invariant(typeof status.reducedMotion[field] === 'boolean', `TOP Reduced Motion evidence field is missing: ${field}`);
  invariant(template.includes(`${field}: false`), `TOP runtime review template must default ${field}=false`);
  invariant(registrar.includes(`input.reducedMotion.${field}`), `TOP motion registrar must consume ${field}`);
  invariant(registrar.includes(`${field}: input.reducedMotion.${field}`), `TOP motion registrar must persist ${field}`);
  invariant(plan.includes(`${field}=true`), `TOP motion review plan must document the required passing value for ${field}`);
}

if (!status.reducedMotion.executed) {
  invariant(status.reducedMotion.result === 'NOT_RUN', 'unexecuted Reduced Motion review must remain NOT_RUN');
  for (const field of fields) {
    invariant(status.reducedMotion[field] === false, `NOT_RUN Reduced Motion evidence must keep ${field}=false`);
  }
}

if (status.reducedMotion.result === 'PASSED' || status.motionApproved) {
  for (const field of fields) {
    invariant(status.reducedMotion[field] === true, `passed/approved Reduced Motion evidence requires ${field}=true`);
  }
}

for (const token of [
  'same TOP instance visible',
  'ON → OFF → ON',
  'no white/black flash',
  'duplicated BaseComposite',
  'stuck-zero normal alpha',
  'TOP view reconstruction',
  'All three are mandatory for `motionApproved=true`.',
]) {
  invariant(plan.includes(token), `TOP live Reduced Motion review protocol missing: ${token}`);
}

invariant(
  registrar.includes(
    'input.reducedMotion.liveToggleToReducedSettled &&\n    input.reducedMotion.liveToggleBackToNormalSettled &&\n    input.reducedMotion.noToggleVisualPopOrDuplication',
  ),
  'TOP Reduced Motion PASS derivation must require all three live-toggle observations',
);
invariant(template.includes('liveToggleObservationsRequired: true'), 'TOP review template must disclose live-toggle observations as required');

console.log('TOP live Reduced Motion evidence contract: PASS');
console.log(`review=${status.reducedMotion.result} toggleToReduced=${status.reducedMotion.liveToggleToReducedSettled} toggleBack=${status.reducedMotion.liveToggleBackToNormalSettled} cleanToggle=${status.reducedMotion.noToggleVisualPopOrDuplication}`);
console.log('same-view ON/OFF/ON evidence is fail-closed and cannot be inferred from static CI.');
