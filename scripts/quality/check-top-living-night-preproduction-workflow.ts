import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const workflowPath = '.github/workflows/top-art-preproduction.yml';
const diagnosticScriptPath = 'scripts/unity/generate-top-living-night-layer-diagnostics.py';
const sanitizerScriptPath = 'scripts/unity/sanitize-top-living-night-composition-plate.py';
const gitignorePath = '.gitignore';
const workflow = readFileSync(join(root, workflowPath), 'utf8');
const diagnosticScript = readFileSync(join(root, diagnosticScriptPath), 'utf8');
const sanitizerScript = readFileSync(join(root, sanitizerScriptPath), 'utf8');
const gitignore = readFileSync(join(root, gitignorePath), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(join(root, diagnosticScriptPath)), 'TOP layer diagnostic generator is missing');
invariant(existsSync(join(root, sanitizerScriptPath)), 'TOP bridge-human sanitizer is missing');

for (const token of [
  'name: TOP Art Preproduction',
  'contents: read',
  'docs/design-targets/generated/top-living-night-v2/layers/**',
  'generate-top-living-night-core5-layout-proof.py',
  'sanitize-top-living-night-composition-plate.py',
  'generate-top-living-night-core5-sprite-pack.py',
  'polish-top-living-night-core5-preproduction.py',
  'generate-top-living-night-preproduction-manifest.py',
  'validate-top-living-night-preproduction-pack.py',
  'generate-top-living-night-crop-review-pack.py',
  'generate-top-living-night-layer-diagnostics.py',
  'Generate base human-free layer composition',
  'Sanitize raw bridge humans while preserving town and rail context',
  'Remove sprite-sheet debris and rebuild Core5-only references',
  'Generate V2 layer diagnostics separately',
  'Upload regenerated V2 layer diagnostics separately',
  'final-key-art-isolated-prompt.txt',
  'final-identity-brief.md',
  'core5-reference-manifest.json',
  'preproduction/*.png',
  'preproduction/manifest.json',
  'diagnostics/*.png',
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
  'diagnostics/',
  'top-art-layer-diagnostics-',
]) {
  invariant(
    !preproductionUploadBlock.includes(forbidden),
    `generator-facing TOP preproduction artifact contains forbidden engineering/diagnostic input: ${forbidden}`,
  );
}
invariant(
  preproductionUploadBlock.includes('preproduction/*.png'),
  'human-sanitized clean plate and Core5-only layout/reference PNGs must be included via preproduction output set',
);
invariant(
  diagnosticUploadBlock.includes('top-art-layer-diagnostics-') &&
    diagnosticUploadBlock.includes('diagnostics/*.png'),
  'TOP layer/mask diagnostics must use a separate explicitly named artifact',
);
invariant(
  diagnosticUploadBlock.includes('if-no-files-found: error'),
  'TOP diagnostic artifact must fail if regenerated diagnostics are missing',
);

for (const token of [
  'TOP V2 diagnostic expects 17 PNG layers',
  'layer-audit-contact-sheet-v1.png',
  'diagnostic artifact may display old/generic humans',
  'must never be used as a generation reference or approval artifact',
]) {
  invariant(diagnosticScript.includes(token), `TOP layer diagnostic safety contract missing: ${token}`);
}

for (const token of [
  'HUMAN_MASK_LAYERS =',
  '"05-distant-companion.png"',
  '"06-characters.png"',
  'MANUAL_HUMAN_REGIONS =',
  '(-55, 300, 145, 610)',
  '(45, 260, 230, 535)',
  '(120, 335, 240, 610)',
  '(195, 340, 320, 615)',
  '(275, 340, 465, 640)',
  '(275, 295, 360, 435)',
  'draw.ellipse(region, fill=255)',
  'MaxFilter(9)',
  'MaxFilter(11)',
  'GaussianBlur(7.0)',
  'GaussianBlur(62.0)',
  'Image.blend(blurred, base_human_free, 0.40)',
  'Image.composite(neutral_fill, bridge, mask)',
  'RESTORE_ALLOWED_LAYERS =',
  '"09-fire-base.png"',
  '"08-animal-robot.png"',
  '"14-foreground-accents.png"',
  '05/06 source pixels are used as alpha alignment aids only, never composited as people.',
]) {
  invariant(sanitizerScript.includes(token), `TOP bridge-human sanitizer contract missing: ${token}`);
}
for (const forbidden of [
  'approvedAsFinal',
  'runtimeApproved',
  'candidateGenerated = True',
  'Image.alpha_composite(sanitized_rgba, resized_rgba(LAYER_ROOT / "06-characters.png"))',
]) {
  invariant(!sanitizerScript.includes(forbidden), `TOP bridge-human sanitizer crossed forbidden authority/content boundary: ${forbidden}`);
}

invariant(
  gitignore.includes('docs/design-targets/generated/top-living-night-v3/diagnostics/'),
  'TOP diagnostic outputs must remain generated-only',
);

const baseStep = workflow.indexOf('Generate base human-free layer composition');
const sanitizeStep = workflow.indexOf('Sanitize raw bridge humans while preserving town and rail context');
const cutoutStep = workflow.indexOf('Generate clean Core5 full-body cutouts');
const polishStep = workflow.indexOf('Remove sprite-sheet debris and rebuild Core5-only references');
invariant(baseStep >= 0 && baseStep < sanitizeStep, 'TOP preproduction must create the human-free fallback plate before bridge sanitization');
invariant(sanitizeStep < cutoutStep, 'TOP bridge humans must be sanitized before Core5 cutout/layout rebuild');
invariant(sanitizeStep < polishStep, 'TOP Core5-only layout proof must consume the sanitized bridge derivative');
invariant(
  polishStep < workflow.indexOf('Hash preproduction visual pack'),
  'TOP preproduction workflow must polish pixels before hashing the manifest',
);
invariant(
  workflow.indexOf('Hash preproduction visual pack') < workflow.indexOf('Validate preproduction visual pack'),
  'TOP preproduction workflow must hash before validation',
);
invariant(
  workflow.indexOf('Validate preproduction visual pack') < preproductionUploadStart,
  'TOP preproduction workflow must validate before generator-facing upload',
);
invariant(
  workflow.indexOf('Generate V2 layer diagnostics separately') < diagnosticUploadStart,
  'TOP diagnostic sheet must be regenerated before its isolated upload',
);

console.log('TOP Art Preproduction workflow contract: PASS');
console.log('read-only: raw bridge -> full-body geometric + 05/06 alpha-aid sanitization -> Core5-only generator artifact; old-human diagnostics isolated; no commit/push/promotion');
