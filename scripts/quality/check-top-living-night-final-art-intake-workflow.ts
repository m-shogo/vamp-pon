import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const workflowPath = '.github/workflows/top-final-art-intake.yml';
const stagingPath = 'scripts/unity/stage-top-living-night-final-art-intake.py';
const workflowAbsolute = join(root, workflowPath);
const stagingAbsolute = join(root, stagingPath);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(workflowAbsolute), 'TOP final-art intake workflow is missing');
invariant(existsSync(stagingAbsolute), 'TOP final-art intake staging script is missing');

const workflow = readFileSync(workflowAbsolute, 'utf8');
const staging = readFileSync(stagingAbsolute, 'utf8');

for (const token of [
  'agent/top-living-night-key-art-v1',
  'incoming/top-living-night-core5-candidate-430x932.png',
  'permissions:\n  contents: write',
  'cancel-in-progress: false',
  "if: ${{ github.actor != 'github-actions[bot]' }}",
  'stage-top-living-night-final-art-intake.py',
  'register-top-living-night-final-art.ts',
  'check-top-living-night-final-art-candidate.ts',
  'check-top-living-night-final-art-not-known-bridge.ts',
  'check-top-living-night-core5-candidate-provenance.ts',
  'check-top-living-night-final-identity-boundary.ts',
  'check-top-living-night-approval-consistency.ts',
  'git rm -- docs/design-targets/generated/top-living-night-v3/incoming/top-living-night-core5-candidate-430x932.png',
  "git commit -m 'art: register TOP Core5 final candidate'",
  'git pull --rebase origin "$GITHUB_REF_NAME"',
  'git push origin "HEAD:$GITHUB_REF_NAME"',
]) {
  invariant(workflow.includes(token), `TOP final-art intake workflow contract missing: ${token}`);
}

for (const forbidden of [
  'promote-top-living-night-final-approval.ts',
  'markpullrequestreadyforreview',
  'git push --force',
  'git push -f',
]) {
  invariant(!workflow.includes(forbidden), `TOP final-art intake workflow contains forbidden promotion/force behavior: ${forbidden}`);
}

for (const token of [
  'EXPECTED_SIZE = (430, 932)',
  'incoming TOP candidate must be 430x932',
  'incoming TOP PNG must be 8-bit',
  'incoming TOP PNG must be RGB/RGBA',
  'incoming TOP PNG must be non-interlaced',
  'shutil.copyfile(INCOMING, CANONICAL)',
  'canonical TOP candidate copy differs from intake bytes',
  'staging copies bytes only; registration/review/runtime approval are separate guarded steps',
]) {
  invariant(staging.includes(token), `TOP final-art intake staging contract missing: ${token}`);
}

for (const forbidden of [
  'candidateGenerated = True',
  'approvedAsFinal = True',
  'runtimeApproved = True',
  'core5IdentityReviewed = True',
]) {
  invariant(!staging.includes(forbidden), `TOP final-art intake staging script must not promote authority: ${forbidden}`);
}

const canonical = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
invariant(workflow.includes(canonical), 'TOP final-art intake workflow must stage canonical candidate explicitly');
invariant(
  workflow.indexOf('incoming/top-living-night-core5-candidate-430x932.png') < workflow.indexOf(canonical),
  'TOP final-art intake must be triggered by the incoming path rather than canonical path',
);
invariant(
  workflow.indexOf("github.actor != 'github-actions[bot]'") < workflow.indexOf('Stage incoming candidate at canonical path'),
  'TOP final-art intake bot recursion guard must execute before candidate staging',
);
invariant(
  workflow.indexOf('check-top-living-night-final-art-not-known-bridge.ts') < workflow.indexOf('Remove one-shot incoming file'),
  'known V2 bridge rejection must run before intake cleanup/commit',
);

console.log('TOP final-art intake workflow: PASS');
console.log('incoming PNG -> validated canonical copy -> exact-SHA registration -> known-bridge rejection -> stale evidence reset; bot recursion blocked; no approval; no force push');
