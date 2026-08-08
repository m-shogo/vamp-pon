import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const workflowPath = '.github/workflows/top-art-preproduction.yml';
const diagnosticScriptPath = 'scripts/unity/generate-top-living-night-layer-diagnostics.py';
const gitignorePath = '.gitignore';
const workflow = readFileSync(join(root, workflowPath), 'utf8');
const diagnosticScript = readFileSync(join(root, diagnosticScriptPath), 'utf8');
const gitignore = readFileSync(join(root, gitignorePath), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(join(root, diagnosticScriptPath)), 'TOP layer diagnostic generator is missing');

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
  'generate-top-living-night-layer-diagnostics.py',
  'Generate human-free composition and Core5 layout/reference pack',
  'Remove sprite-sheet debris and rebuild Core5-only references',
  'Generate V2 layer diagnostics separately',
  'Upload regenerated V2 layer diagnostics separately',
  'final-key-art-isolated-prompt.txt',
  'final-identity-brief.md',
  'core5-reference-manifest.json',
  'preproduction/*.png',
  'preproduction/manifest.json',
  'diagnostics/layer-audit-contact-sheet-v1.png',
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

const preproductionUploadStart = workflow.indexOf('- name: Upload TOP preproduction visual pack');
const diagnosticUploadStart = workflow.indexOf('- name: Upload regenerated V2 layer diagnostics separately');
invariant(preproductionUploadStart >= 0, 'TOP preproduction upload step is missing');
invariant(diagnosticUploadStart > preproductionUploadStart, 'TOP diagnostics must upload after the generator-facing preproduction pack');
const preproductionUploadBlock = workflow.slice(preproductionUploadStart, diagnosticUploadStart);
const diagnosticUploadBlock = workflow.slice(diagnosticUploadStart);

for (const forbidden of [
  'top-living-night-layered-candidate-430x932.png',
  'layer-audit-contact-sheet-v1.png',
  'top-art-layer-diagnostics-',
]) {
  invariant(
    !preproductionUploadBlock.includes(forbidden),
    `generator-facing TOP preproduction artifact contains forbidden engineering/diagnostic input: ${forbidden}`,
  );
}
invariant(
  preproductionUploadBlock.includes('preproduction/*.png'),
  'human-free clean plate and Core5-only layout/reference PNGs must be included via preproduction output set',
);
invariant(
  diagnosticUploadBlock.includes('top-art-layer-diagnostics-') &&
    diagnosticUploadBlock.includes('diagnostics/layer-audit-contact-sheet-v1.png'),
  'TOP layer diagnostics must use a separate explicitly named artifact',
);
invariant(
  diagnosticUploadBlock.includes('if-no-files-found: error'),
  'TOP diagnostic artifact must fail if the regenerated sheet is missing',
);

for (const token of [
  'TOP V2 diagnostic expects 17 PNG layers',
  'layer-audit-contact-sheet-v1.png',
  'diagnostic artifact may display old/generic humans',
  'must never be used as a generation reference or approval artifact',
]) {
  invariant(diagnosticScript.includes(token), `TOP layer diagnostic safety contract missing: ${token}`);
}
invariant(
  gitignore.includes('docs/design-targets/generated/top-living-night-v3/diagnostics/'),
  'TOP diagnostic outputs must remain generated-only',
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
  'TOP preproduction workflow must validate before generator-facing upload',
);
invariant(
  workflow.indexOf('Generate V2 layer diagnostics separately') < diagnosticUploadStart,
  'TOP diagnostic sheet must be regenerated before its isolated upload',
);

console.log('TOP Art Preproduction workflow contract: PASS');
console.log('read-only: human-free/Core5-only generator artifact is isolated from regenerated 17-layer diagnostics; raw bridge/old humans cannot enter generator pack; no commit/push/promotion');
