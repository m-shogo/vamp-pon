import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const workflowPath = '.github/workflows/top-art-preproduction.yml';
const workflow = readFileSync(join(root, workflowPath), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const token of [
  'name: TOP Art Preproduction',
  'contents: read',
  'generate-top-living-night-core5-layout-proof.py',
  'generate-top-living-night-core5-sprite-pack.py',
  'polish-top-living-night-core5-preproduction.py',
  'generate-top-living-night-preproduction-manifest.py',
  'validate-top-living-night-preproduction-pack.py',
  'generate-top-living-night-crop-review-pack.py',
  'final-key-art-isolated-prompt.txt',
  'final-identity-brief.md',
  'core5-reference-manifest.json',
  'top-living-night-layered-candidate-430x932.png',
  'preproduction/manifest.json',
  'if-no-files-found: warn',
  'retention-days: 7',
]) {
  invariant(workflow.includes(token), `TOP Art Preproduction workflow contract missing: ${token}`);
}

for (const forbidden of [
  'contents: write',
  'git push',
  'git commit',
  'gh pr merge',
  'mark_pull_request_ready_for_review',
  'approvedAsFinal=true',
  'runtimeApproved=true',
]) {
  invariant(!workflow.includes(forbidden), `TOP Art Preproduction workflow must remain read-only/generated-only: ${forbidden}`);
}

invariant(
  workflow.indexOf('Remove sprite-sheet debris and rebuild layout proof') <
    workflow.indexOf('Hash preproduction visual pack'),
  'TOP preproduction workflow must polish pixels before hashing the manifest',
);
invariant(
  workflow.indexOf('Hash preproduction visual pack') <
    workflow.indexOf('Validate preproduction visual pack'),
  'TOP preproduction workflow must hash before validation',
);
invariant(
  workflow.indexOf('Validate preproduction visual pack') <
    workflow.indexOf('Upload TOP preproduction visual pack'),
  'TOP preproduction workflow must validate before upload',
);

console.log('TOP Art Preproduction workflow contract: PASS');
console.log('read-only workflow: locked Core5/bridge -> cleaned/hash-bound visual generator pack; no commit/push/promotion capability');
