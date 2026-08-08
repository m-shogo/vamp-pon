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
  'docs/design-targets/generated/top-living-night-v2/layers/**',
  'generate-top-living-night-core5-layout-proof.py',
  'generate-top-living-night-core5-sprite-pack.py',
  'polish-top-living-night-core5-preproduction.py',
  'generate-top-living-night-preproduction-manifest.py',
  'validate-top-living-night-preproduction-pack.py',
  'generate-top-living-night-crop-review-pack.py',
  'Generate human-free composition and Core5 layout/reference pack',
  'Remove sprite-sheet debris and rebuild Core5-only references',
  'final-key-art-isolated-prompt.txt',
  'final-identity-brief.md',
  'core5-reference-manifest.json',
  'preproduction/*.png',
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

const uploadStart = workflow.indexOf('- name: Upload TOP preproduction visual pack');
invariant(uploadStart >= 0, 'TOP preproduction upload step is missing');
const uploadBlock = workflow.slice(uploadStart);
invariant(
  !uploadBlock.includes('top-living-night-layered-candidate-430x932.png'),
  'raw bridge with generic humans must not be uploaded in the generator-facing preproduction artifact',
);
invariant(
  uploadBlock.includes('preproduction/*.png'),
  'human-free clean plate and Core5-only layout/reference PNGs must be included via preproduction output set',
);

invariant(
  workflow.indexOf('Remove sprite-sheet debris and rebuild Core5-only references') <
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
console.log('read-only workflow: human-free V2 layer plate + locked Core5 -> cleaned/hash-bound generator pack; raw bridge excluded from artifact; no commit/push/promotion capability');
