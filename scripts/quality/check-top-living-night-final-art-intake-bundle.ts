import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bundlePath = 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json';
const bundle = JSON.parse(readFileSync(join(root, bundlePath), 'utf8')) as any;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const incoming = 'docs/design-targets/generated/top-living-night-v3/incoming/top-living-night-core5-candidate-430x932.png';
const canonical = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const workflow = '.github/workflows/top-final-art-intake.yml';
const staging = 'scripts/unity/stage-top-living-night-final-art-intake.py';

invariant(bundle.intake, 'TOP generation bundle is missing guarded intake authority');
invariant(bundle.intake.incomingPath === incoming, 'TOP intake incoming path mismatch');
invariant(bundle.intake.canonicalPath === canonical, 'TOP intake canonical path mismatch');
invariant(bundle.target.path === canonical, 'TOP intake canonical path must equal generation target path');
invariant(bundle.intake.workflow === workflow, 'TOP intake workflow authority mismatch');
invariant(bundle.intake.stagingScript === staging, 'TOP intake staging authority mismatch');
invariant(bundle.intake.atomicCanonicalRegistration === true, 'TOP intake must atomically register canonical candidate');
invariant(bundle.intake.incomingIsOneShot === true, 'TOP intake source must be one-shot');
invariant(bundle.intake.intakeDoesNotApprove === true, 'TOP intake must never imply approval');
invariant(bundle.intake.forcePushAllowed === false, 'TOP intake must forbid force push');
invariant(existsSync(join(root, workflow)), 'TOP intake workflow file is missing');
invariant(existsSync(join(root, staging)), 'TOP intake staging script is missing');
invariant(existsSync(join(root, bundle.registration.script)), 'TOP intake registration script is missing');
invariant(bundle.registration.registrationDoesNotApprove === true, 'TOP intake registration must remain non-approving');
invariant(bundle.registration.resetsCandidateSensitiveEvidence === true, 'TOP intake registration must reset stale candidate-sensitive evidence');

console.log('TOP final-art intake bundle: PASS');
console.log('incoming one-shot path -> canonical target + exact registration; force-push/approval forbidden');
