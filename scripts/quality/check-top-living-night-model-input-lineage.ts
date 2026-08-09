import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const workflowPath = '.github/workflows/top-art-preproduction.yml';
const generatorPath = 'scripts/unity/generate-top-living-night-model-input-manifest.py';
const validatorPath = 'scripts/unity/validate-top-living-night-model-input-manifest.py';
const workflow = readFileSync(join(root, workflowPath), 'utf8');
const generator = readFileSync(join(root, generatorPath), 'utf8');
const validator = readFileSync(join(root, validatorPath), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const token of [
  'TOP_SOURCE_HEAD_SHA: ${{ github.event.pull_request.head.sha || github.sha }}',
  'name: top-art-model-inputs-${{ github.event.pull_request.head.sha || github.sha }}',
  'node --experimental-strip-types scripts/quality/check-top-living-night-model-input-lineage.ts',
]) {
  invariant(workflow.includes(token), `TOP model-input workflow lineage contract missing: ${token}`);
}

for (const token of [
  'import os',
  'import subprocess',
  'def resolve_checkout_commit()',
  'def resolve_source_commit(checkout_commit: str)',
  '["git", "rev-parse", "HEAD"]',
  'os.environ.get("TOP_SOURCE_HEAD_SHA", "")',
  '"sourceCommit": source_commit',
  '"checkoutCommit": checkout_commit',
  '"sourcePreproductionManifestSha256": sha256(PREPRODUCTION_MANIFEST)',
  "print(f\"sourceCommit={payload['sourceCommit']}\")",
  "print(f\"checkoutCommit={payload['checkoutCommit']}\")",
]) {
  invariant(generator.includes(token), `TOP model-input lineage generator contract missing: ${token}`);
}

for (const token of [
  'import os',
  'import subprocess',
  'def resolve_checkout_commit()',
  'def resolve_source_commit(checkout_commit: str)',
  '["git", "rev-parse", "HEAD"]',
  'os.environ.get("TOP_SOURCE_HEAD_SHA", "")',
  'manifest.get("sourceCommit") == source_commit',
  'manifest.get("checkoutCommit") == checkout_commit',
  'manifest.get("sourcePreproductionManifestSha256") == sha256(PREPRODUCTION_MANIFEST)',
  'real PR/branch head',
  'exact tree that generated the artifact',
  'exact current preproduction-manifest bytes',
]) {
  invariant(validator.includes(token), `TOP model-input lineage validator contract missing: ${token}`);
}

for (const forbidden of ['HEAD~1', 'git describe', 'git rev-list', 'origin/main']) {
  invariant(!generator.includes(forbidden), `TOP model-input generator must not infer source provenance from history/base refs: ${forbidden}`);
  invariant(!validator.includes(forbidden), `TOP model-input validator must not infer source provenance from history/base refs: ${forbidden}`);
}

invariant(
  generator.indexOf('checkout_commit = resolve_checkout_commit()') < generator.indexOf('source_commit = resolve_source_commit(checkout_commit)'),
  'TOP model-input generator must resolve exact checkout before deriving branch-head fallback',
);
invariant(
  validator.indexOf('checkout_commit = resolve_checkout_commit()') < validator.indexOf('source_commit = resolve_source_commit(checkout_commit)'),
  'TOP model-input validator must resolve exact checkout before branch-head comparison',
);

console.log('TOP model-input lineage contract: PASS');
console.log('artifact name/sourceCommit = real PR head; checkoutCommit = exact synthetic-merge/manual checkout used for pixels; preproduction-manifest bytes are hash-bound; stale or mislabeled reuse is fail-closed');
