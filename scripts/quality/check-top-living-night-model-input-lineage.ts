import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const generatorPath = 'scripts/unity/generate-top-living-night-model-input-manifest.py';
const validatorPath = 'scripts/unity/validate-top-living-night-model-input-manifest.py';
const generator = readFileSync(join(root, generatorPath), 'utf8');
const validator = readFileSync(join(root, validatorPath), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const token of [
  'import subprocess',
  'def resolve_source_commit()',
  '["git", "rev-parse", "HEAD"]',
  '"sourceCommit": resolve_source_commit()',
  '"sourcePreproductionManifestSha256": sha256(PREPRODUCTION_MANIFEST)',
  "print(f\"sourceCommit={payload['sourceCommit']}\")",
  "print(f\"sourcePreproductionManifestSha256={payload['sourcePreproductionManifestSha256']}\")",
]) {
  invariant(generator.includes(token), `TOP model-input lineage generator contract missing: ${token}`);
}

for (const token of [
  'import subprocess',
  'def resolve_source_commit()',
  '["git", "rev-parse", "HEAD"]',
  'manifest.get("sourceCommit") == resolve_source_commit()',
  'manifest.get("sourcePreproductionManifestSha256") == sha256(PREPRODUCTION_MANIFEST)',
  'generated from a different source commit',
  'exact current preproduction-manifest bytes',
]) {
  invariant(validator.includes(token), `TOP model-input lineage validator contract missing: ${token}`);
}

for (const forbidden of [
  'GITHUB_SHA',
  'github.event.pull_request.head.sha',
  'HEAD~1',
  'git describe',
]) {
  invariant(!generator.includes(forbidden), `TOP model-input lineage generator must derive provenance from exact checkout HEAD, not CI aliases/history: ${forbidden}`);
  invariant(!validator.includes(forbidden), `TOP model-input lineage validator must compare against exact checkout HEAD, not CI aliases/history: ${forbidden}`);
}

console.log('TOP model-input lineage contract: PASS');
console.log('minimal generation artifact is bound to exact git HEAD + exact preproduction-manifest bytes; stale artifact reuse is fail-closed');
