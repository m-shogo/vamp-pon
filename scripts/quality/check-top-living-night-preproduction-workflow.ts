import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const workflowPath = '.github/workflows/top-art-preproduction.yml';
const diagnosticScriptPath = 'scripts/unity/generate-top-living-night-layer-diagnostics.py';
const sanitizerScriptPath = 'scripts/unity/sanitize-top-living-night-composition-plate.py';
const identityReferenceGeneratorPath = 'scripts/unity/generate-top-living-night-core5-identity-references.py';
const modelManifestGeneratorPath = 'scripts/unity/generate-top-living-night-model-input-manifest.py';
const modelManifestValidatorPath = 'scripts/unity/validate-top-living-night-model-input-manifest.py';
const gitignorePath = '.gitignore';
const workflow = readFileSync(join(root, workflowPath), 'utf8');
const diagnosticScript = readFileSync(join(root, diagnosticScriptPath), 'utf8');
const sanitizerScript = readFileSync(join(root, sanitizerScriptPath), 'utf8');
const identityReferenceGenerator = readFileSync(join(root, identityReferenceGeneratorPath), 'utf8');
const modelManifestGenerator = readFileSync(join(root, modelManifestGeneratorPath), 'utf8');
const modelManifestValidator = readFileSync(join(root, modelManifestValidatorPath), 'utf8');
const gitignore = readFileSync(join(root, gitignorePath), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [diagnosticScriptPath, sanitizerScriptPath, identityReferenceGeneratorPath, modelManifestGeneratorPath, modelManifestValidatorPath]) {
  invariant(existsSync(join(root, path)), `TOP preproduction helper is missing: ${path}`);
}

for (const token of [
  'name: TOP Art Preproduction',
  'contents: read',
  'generate-top-living-night-core5-identity-references.py',
  'Generate clean single-human Core5 identity references',
  'Generate minimal model-input manifest',
  'Validate minimal model-input manifest',
  'Upload minimal clean TOP model-input bundle',
  'preproduction/model-input-manifest.json',
  'model-input-order.txt',
  'retention-days: 7',
]) {
  invariant(workflow.includes(token), `TOP Art Preproduction workflow contract missing: ${token}`);
}

for (const forbidden of [
  'contents: write', 'git push', 'git commit', 'gh pr merge', 'mark_pull_request_ready_for_review',
  'approvedAsFinal=true', 'runtimeApproved=true',
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
  'core5-yui-identity-reference-v1.png',
  'core5-asa-identity-reference-v1.png',
  'core5-nagi-identity-reference-v1.png',
  'core5-michiru-identity-reference-v1.png',
  'core5-tomori-identity-reference-v1.png',
  'preproduction/model-input-manifest.json',
  'final-key-art-isolated-prompt.txt',
  'model-input-order.txt',
  'if-no-files-found: error',
]) {
  invariant(modelUploadBlock.includes(required), `TOP minimal model-input artifact lost required clean input: ${required}`);
}
for (const forbidden of [
  'fullbody-cutout-v1.png',
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

for (const token of [
  'IDENTITY_CROP_BOXES',
  '"yui": (0.15, 0.15, 0.37, 0.70)',
  '"asa": (0.15, 0.15, 0.36, 0.70)',
  '"nagi": (0.15, 0.15, 0.36, 0.70)',
  '"michiru": (0.16, 0.15, 0.36, 0.69)',
  '"tomori": (0.20, 0.15, 0.38, 0.70)',
  'single-human full-body crops from locked masters',
  'no duplicate face panel, black-evolution panel, dashboard or approval authority',
]) {
  invariant(identityReferenceGenerator.includes(token), `TOP clean identity-reference generator contract missing: ${token}`);
}
for (const forbidden of ['approvedAsFinal', 'runtimeApproved', 'candidateGenerated = True']) {
  invariant(!identityReferenceGenerator.includes(forbidden), `TOP identity-reference generator crossed approval boundary: ${forbidden}`);
}

invariant(
  engineeringUploadBlock.includes('top-art-preproduction-') && engineeringUploadBlock.includes('preproduction/*.png'),
  'TOP engineering artifact must retain the broader preproduction review pack',
);
invariant(
  diagnosticUploadBlock.includes('top-art-layer-diagnostics-') && diagnosticUploadBlock.includes('diagnostics/*.png') &&
    diagnosticUploadBlock.includes('if-no-files-found: error'),
  'TOP layer/mask diagnostics must remain a separate required artifact',
);

for (const token of [
  'HUMAN_MASK_LAYERS =', '"05-distant-companion.png"', '"06-characters.png"',
  'RESTORE_ALLOWED_LAYERS =', '"09-fire-base.png"', '"08-animal-robot.png"', '"14-foreground-accents.png"',
  '05/06 source pixels are used as alpha alignment aids only, never composited as people.',
]) {
  invariant(sanitizerScript.includes(token), `TOP bridge-human sanitizer contract missing: ${token}`);
}

for (const token of [
  'MODEL_INPUTS_ONLY_NOT_FINAL_ART',
  '"schemaVersion": 2',
  '"visualInputCount": 6',
  '"identityInputsAreSingleHumanCrops": True',
  '"engineeringCutoutsAllowed": False',
  'this manifest describes only the six visual inputs physically shipped in the minimal model-input artifact',
]) {
  invariant(modelManifestGenerator.includes(token), `TOP minimal model manifest generator contract missing: ${token}`);
}
for (const token of [
  'EXPECTED_VISUALS =',
  'core5-yui-identity-reference-v1.png',
  'fullbody-cutout-v1.png',
  'identityInputsAreSingleHumanCrops',
  'engineeringCutoutsAllowed',
]) {
  invariant(modelManifestValidator.includes(token), `TOP minimal model manifest validator contract missing: ${token}`);
}

invariant(gitignore.includes('docs/design-targets/generated/top-living-night-v3/diagnostics/'), 'TOP diagnostic outputs must remain generated-only');

const baseStep = workflow.indexOf('Generate base human-free layer composition');
const sanitizeStep = workflow.indexOf('Sanitize raw bridge humans while preserving town and rail context');
const cutoutStep = workflow.indexOf('Generate clean Core5 full-body cutouts');
const polishStep = workflow.indexOf('Remove sprite-sheet debris and rebuild Core5-only references');
const identityStep = workflow.indexOf('Generate clean single-human Core5 identity references');
const hashStep = workflow.indexOf('Hash preproduction visual pack');
const validateStep = workflow.indexOf('Validate preproduction visual pack');
const modelManifestStep = workflow.indexOf('Generate minimal model-input manifest');
const modelManifestValidateStep = workflow.indexOf('Validate minimal model-input manifest');
invariant(baseStep >= 0 && baseStep < sanitizeStep, 'TOP preproduction must create the human-free plate before sanitization');
invariant(sanitizeStep < cutoutStep && cutoutStep < polishStep, 'TOP engineering cutout/layout order mismatch');
invariant(polishStep < identityStep && identityStep < hashStep, 'TOP clean identity references must be generated after engineering layout polish and before manifest hashing');
invariant(hashStep < validateStep && validateStep < modelManifestStep, 'TOP engineering pack must hash+validate before minimal model manifest');
invariant(modelManifestStep < modelManifestValidateStep && modelManifestValidateStep < modelUploadStart, 'TOP minimal manifest must generate+validate before upload');

console.log('TOP Art Preproduction workflow contract: PASS');
console.log('minimal model inputs = sanitized composition + five clean single-human identity refs + two text authorities + self-contained manifest; engineering cutouts/layout and old-human diagnostics physically excluded; no promotion');
