import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const workflowPath = '.github/workflows/top-art-preproduction.yml';
const diagnosticScriptPath = 'scripts/unity/generate-top-living-night-layer-diagnostics.py';
const sanitizerScriptPath = 'scripts/unity/sanitize-top-living-night-composition-plate.py';
const modelManifestGeneratorPath = 'scripts/unity/generate-top-living-night-model-input-manifest.py';
const modelManifestValidatorPath = 'scripts/unity/validate-top-living-night-model-input-manifest.py';
const gitignorePath = '.gitignore';
const workflow = readFileSync(join(root, workflowPath), 'utf8');
const diagnosticScript = readFileSync(join(root, diagnosticScriptPath), 'utf8');
const sanitizerScript = readFileSync(join(root, sanitizerScriptPath), 'utf8');
const modelManifestGenerator = readFileSync(join(root, modelManifestGeneratorPath), 'utf8');
const modelManifestValidator = readFileSync(join(root, modelManifestValidatorPath), 'utf8');
const gitignore = readFileSync(join(root, gitignorePath), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [diagnosticScriptPath, sanitizerScriptPath, modelManifestGeneratorPath, modelManifestValidatorPath]) {
  invariant(existsSync(join(root, path)), `TOP preproduction helper is missing: ${path}`);
}

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
  'generate-top-living-night-model-input-manifest.py',
  'validate-top-living-night-model-input-manifest.py',
  'generate-top-living-night-crop-review-pack.py',
  'generate-top-living-night-layer-diagnostics.py',
  'Generate base human-free layer composition',
  'Sanitize raw bridge humans while preserving town and rail context',
  'Remove sprite-sheet debris and rebuild Core5-only references',
  'Generate minimal model-input manifest',
  'Validate minimal model-input manifest',
  'Generate V2 layer diagnostics separately',
  'Upload minimal clean TOP model-input bundle',
  'Upload TOP preproduction engineering pack',
  'Upload regenerated V2 layer diagnostics separately',
  'final-key-art-isolated-prompt.txt',
  'model-input-order.txt',
  'final-identity-brief.md',
  'core5-reference-manifest.json',
  'preproduction/manifest.json',
  'preproduction/model-input-manifest.json',
  'diagnostics/*.png',
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

const modelUploadStart = workflow.indexOf('- name: Upload minimal clean TOP model-input bundle');
const engineeringUploadStart = workflow.indexOf('- name: Upload TOP preproduction engineering pack');
const diagnosticUploadStart = workflow.indexOf('- name: Upload regenerated V2 layer diagnostics separately');
invariant(modelUploadStart >= 0, 'TOP minimal model-input upload step is missing');
invariant(engineeringUploadStart > modelUploadStart, 'TOP engineering pack must upload after the minimal model-input bundle');
invariant(diagnosticUploadStart > engineeringUploadStart, 'TOP diagnostics must upload after the engineering pack');

const modelUploadBlock = workflow.slice(modelUploadStart, engineeringUploadStart);
const engineeringUploadBlock = workflow.slice(engineeringUploadStart, diagnosticUploadStart);
const diagnosticUploadBlock = workflow.slice(diagnosticUploadStart);

for (const required of [
  'top-art-model-inputs-',
  'core5-clean-composition-plate-v1.png',
  'core5-yui-fullbody-cutout-v1.png',
  'core5-asa-fullbody-cutout-v1.png',
  'core5-nagi-fullbody-cutout-v1.png',
  'core5-michiru-fullbody-cutout-v1.png',
  'core5-tomori-fullbody-cutout-v1.png',
  'preproduction/model-input-manifest.json',
  'final-key-art-isolated-prompt.txt',
  'model-input-order.txt',
  'if-no-files-found: error',
]) {
  invariant(modelUploadBlock.includes(required), `TOP minimal model-input artifact lost required clean input: ${required}`);
}
for (const forbidden of [
  'preproduction/manifest.json',
  'core5-layout-proof-v1.png',
  'core5-clean-generation-reference-pack-v1.png',
  'top-living-night-layered-candidate-430x932.png',
  '05-distant-companion.png',
  '06-characters.png',
  'diagnostics/',
  'final-identity-brief.md',
  'core5-reference-manifest.json',
  'crop-review-previews',
  'top-art-layer-diagnostics-',
]) {
  invariant(!modelUploadBlock.includes(forbidden), `TOP minimal model-input artifact contains forbidden extra/context input: ${forbidden}`);
}

invariant(
  engineeringUploadBlock.includes('top-art-preproduction-') && engineeringUploadBlock.includes('preproduction/*.png'),
  'TOP engineering artifact must retain the broader preproduction review pack',
);
invariant(
  engineeringUploadBlock.includes('preproduction/manifest.json') && engineeringUploadBlock.includes('preproduction/model-input-manifest.json'),
  'TOP engineering artifact must retain both engineering and minimal model manifests',
);
invariant(
  engineeringUploadBlock.includes('final-identity-brief.md') && engineeringUploadBlock.includes('core5-reference-manifest.json'),
  'TOP engineering artifact must retain identity/provenance review documents',
);
for (const forbidden of [
  'top-living-night-layered-candidate-430x932.png',
  'diagnostics/',
  'top-art-layer-diagnostics-',
]) {
  invariant(
    !engineeringUploadBlock.includes(forbidden),
    `TOP engineering preproduction artifact contains forbidden raw/diagnostic input: ${forbidden}`,
  );
}

invariant(
  diagnosticUploadBlock.includes('top-art-layer-diagnostics-') && diagnosticUploadBlock.includes('diagnostics/*.png'),
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

for (const token of [
  'MODEL_INPUTS_ONLY_NOT_FINAL_ART',
  '"visualInputCount": 6',
  '"useOnlyListedVisualInputs": True',
  '"layoutProofAllowed": False',
  '"diagnosticsAllowed": False',
  'this manifest describes only the six visual inputs physically shipped in the minimal model-input artifact',
]) {
  invariant(modelManifestGenerator.includes(token), `TOP minimal model manifest generator contract missing: ${token}`);
}
for (const token of [
  'EXPECTED_VISUALS =',
  'visualInputCount") == 6',
  'exactly 6 visual inputs + 2 hashed text instructions',
  'core5-layout-proof-v1.png',
  'core5-clean-generation-reference-pack-v1.png',
  'diagnostics/',
]) {
  invariant(modelManifestValidator.includes(token), `TOP minimal model manifest validator contract missing: ${token}`);
}

invariant(
  gitignore.includes('docs/design-targets/generated/top-living-night-v3/diagnostics/'),
  'TOP diagnostic outputs must remain generated-only',
);

const baseStep = workflow.indexOf('Generate base human-free layer composition');
const sanitizeStep = workflow.indexOf('Sanitize raw bridge humans while preserving town and rail context');
const cutoutStep = workflow.indexOf('Generate clean Core5 full-body cutouts');
const polishStep = workflow.indexOf('Remove sprite-sheet debris and rebuild Core5-only references');
const hashStep = workflow.indexOf('Hash preproduction visual pack');
const validateStep = workflow.indexOf('Validate preproduction visual pack');
const modelManifestStep = workflow.indexOf('Generate minimal model-input manifest');
const modelManifestValidateStep = workflow.indexOf('Validate minimal model-input manifest');
invariant(baseStep >= 0 && baseStep < sanitizeStep, 'TOP preproduction must create the human-free fallback plate before bridge sanitization');
invariant(sanitizeStep < cutoutStep, 'TOP bridge humans must be sanitized before Core5 cutout/layout rebuild');
invariant(sanitizeStep < polishStep, 'TOP Core5-only layout proof must consume the sanitized bridge derivative');
invariant(polishStep < hashStep, 'TOP preproduction workflow must polish pixels before hashing the engineering manifest');
invariant(hashStep < validateStep, 'TOP preproduction workflow must hash before engineering-pack validation');
invariant(validateStep < modelManifestStep, 'TOP minimal model manifest must be derived only after the engineering pack validates');
invariant(modelManifestStep < modelManifestValidateStep, 'TOP minimal model manifest must be generated before validation');
invariant(modelManifestValidateStep < modelUploadStart, 'TOP minimal model manifest must validate before minimal bundle upload');
invariant(modelUploadStart < engineeringUploadStart, 'TOP clean model-input bundle must be emitted before broader engineering pack');
invariant(workflow.indexOf('Generate V2 layer diagnostics separately') < diagnosticUploadStart, 'TOP diagnostic sheet must be regenerated before isolated upload');

console.log('TOP Art Preproduction workflow contract: PASS');
console.log('read-only artifacts: minimal model inputs = exactly six visuals + two text authorities + self-contained model manifest; engineering and old-human diagnostics physically separate; no commit/push/promotion');
