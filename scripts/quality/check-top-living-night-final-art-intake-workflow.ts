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
  'pull_request:',
  'types: [opened, synchronize, reopened]',
  'branches: [main]',
  'github.event.pull_request.head.repo.full_name == \'m-shogo/vamp-pon\'',
  "github.event.pull_request.head.ref == 'art/top-core5-v3-final-intake'",
  'INTAKE_BRANCH: ${{ github.event.pull_request.head.ref }}',
  'ref: ${{ github.event.pull_request.head.ref }}',
  'art/top-core5-v3-final-intake',
  'docs/design-targets/generated/top-living-night-v3/intake-request.json',
  "action: 'REGISTER_CANDIDATE_AND_PACKS'",
  'semanticLayerCount: 6',
  'effectCompanionCount: 10',
  'approvalPromotionAllowed: false',
  'permissions:\n  contents: write',
  'cancel-in-progress: false',
  "github.actor != 'github-actions[bot]'",
  'stage-top-living-night-final-art-intake.py',
  'register-top-living-night-final-art.ts',
  'register-top-living-night-semantic-layer-pack.ts',
  'register-top-living-night-effect-companion-pack.ts',
  'check-top-living-night-final-art-candidate.ts',
  'check-top-living-night-final-art-not-known-bridge.ts',
  'check-top-living-night-core5-candidate-provenance.ts',
  'check-top-living-night-final-identity-boundary.ts',
  'check-top-living-night-semantic-layer-pack.ts',
  'check-top-living-night-effect-companion-pack.ts',
  'check-top-living-night-generation-bundle.ts',
  'check-top-living-night-post-generation-gate-chain.ts',
  'check-top-living-night-approval-consistency.ts',
  'git rm -- docs/design-targets/generated/top-living-night-v3/intake-request.json',
  'git rm -- docs/design-targets/generated/top-living-night-v3/incoming/top-living-night-core5-candidate-430x932.png',
  'docs/design-targets/generated/top-living-night-v3/final/layers',
  'docs/design-targets/generated/top-living-night-v3/final/semantic-layer-pack.json',
  'docs/design-targets/generated/top-living-night-v3/final/effects',
  'docs/design-targets/generated/top-living-night-v3/final/effect-companion-pack.json',
  "git commit -m 'art: register TOP Core5 candidate and production packs'",
  'git pull --rebase origin "$INTAKE_BRANCH"',
  'git push origin "HEAD:$INTAKE_BRANCH"',
]) {
  invariant(workflow.includes(token), `TOP final-art intake workflow contract missing: ${token}`);
}

for (const forbidden of [
  'agent/top-living-night-key-art-v1',
  'promote-top-living-night-final-approval.ts',
  'markpullrequestreadyforreview',
  'git push --force',
  'git push -f',
  'git push origin "HEAD:$GITHUB_REF_NAME"',
]) {
  invariant(!workflow.includes(forbidden), `TOP final-art intake workflow contains obsolete/forbidden behavior: ${forbidden}`);
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

const incoming = 'docs/design-targets/generated/top-living-night-v3/incoming/top-living-night-core5-candidate-430x932.png';
const canonical = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
invariant(workflow.includes(incoming), 'TOP final-art intake must consume the canonical incoming candidate path');
invariant(workflow.includes(canonical), 'TOP final-art intake workflow must stage canonical candidate explicitly');
invariant(
  workflow.indexOf('Validate one-shot intake request') < workflow.indexOf('Stage incoming candidate at canonical path'),
  'one-shot request validation must happen before candidate staging',
);
invariant(
  workflow.indexOf("github.actor != 'github-actions[bot]'") < workflow.indexOf('Stage incoming candidate at canonical path'),
  'TOP final-art intake bot recursion guard must execute before candidate staging',
);
invariant(
  workflow.indexOf('Register exact candidate SHA and reset stale evidence') < workflow.indexOf('Register candidate-bound semantic and effect packs'),
  'candidate registration must precede semantic/effect pack registration',
);
invariant(
  workflow.indexOf('check-top-living-night-final-art-not-known-bridge.ts') < workflow.indexOf('Consume one-shot request and incoming candidate'),
  'known V2 bridge rejection must run before intake cleanup/commit',
);
invariant(
  workflow.indexOf('Reassert non-approval boundary before commit') < workflow.indexOf("git commit -m 'art: register TOP Core5 candidate and production packs'"),
  'non-approval boundary must be reasserted immediately before guarded commit',
);

console.log('TOP final-art intake workflow: PASS');
console.log('same-repo dedicated PR -> one-shot request -> validated 430x932 candidate -> exact-SHA registration -> semantic 6 + effect 10 registration -> provenance/gate checks -> request/candidate consumption; bot recursion blocked; no final/runtime approval; no force push');
