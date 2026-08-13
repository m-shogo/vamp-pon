import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const POLICY_PATH = 'data/visual/all-character-crop-silhouette-readability-master-v1.json';
const DOC_PATH = 'docs/visual/all-character-crop-silhouette-readability-master-v1.md';
const ENTRYPOINT_PATH = 'data/visual/character-production-generation-entrypoint-v1.json';
const EXPORTER_PATH = 'tools/asset-factory/scripts/export-production-character-design-prompt.ts';

const policy = JSON.parse(readFileSync(resolve(process.cwd(), POLICY_PATH), 'utf8'));
const doc = readFileSync(resolve(process.cwd(), DOC_PATH), 'utf8');
const entrypoint = JSON.parse(readFileSync(resolve(process.cwd(), ENTRYPOINT_PATH), 'utf8'));
const exporter = readFileSync(resolve(process.cwd(), EXPORTER_PATH), 'utf8');

const failures: string[] = [];
const req = (ok: boolean, message: string) => { if (!ok) failures.push(message); };

req(policy.status === 'CURRENT_PRODUCTION_VISUAL_AUTHORITY', 'status weakened');
req(policy.scopeCount === 36, 'scopeCount must be 36');
req(policy.assetKindCount === 9, 'assetKindCount must be 9');
req(policy.production?.requiredForCandidateGeneration === true, 'must remain production-required');
req(policy.production?.generatedOutputState === 'CANDIDATE_REVIEW_REQUIRED', 'candidate boundary weakened');
req(Array.isArray(policy.readabilityInvariants) && policy.readabilityInvariants.length >= 20, 'need at least 20 readability invariants');
req(Array.isArray(policy.preservationPriority) && policy.preservationPriority.length >= 8, 'need eight-step preservation priority');
req(Array.isArray(policy.forbiddenShortcuts) && policy.forbiddenShortcuts.length >= 30, 'need at least 30 forbidden shortcuts');
req(policy.unknownCropDefault === 'NEUTRAL_IDENTITY_PRESERVING_COMPOSITION', 'unknown crop must remain neutral identity-preserving');

const expected: Record<string, boolean> = {
  unknownCropMayBeInventedByImageModel: false,
  cropMayRedesignCharacter: false,
  cropMayHideMobilityEquipmentAsSolution: false,
  cropMayHideBodyCategoryAsSolution: false,
  effectsMayObscureIdentityAnchorsAsSolution: false,
  premiumAssetMaySacrificeIdentityReadability: false,
  readabilityMayInventAccessory: false,
  generatedCropChoiceCreatesCanon: false,
};
for (const [field, value] of Object.entries(expected)) {
  req(policy.rules?.[field] === value, `${field} must remain ${value}`);
  req(entrypoint.requiredFlags?.[field] === value, `entrypoint must require ${field}=${value}`);
}
req(entrypoint.requiredFlags?.allCharacterCropSilhouetteReadabilityRequired === true, 'entrypoint must require crop/silhouette readability');
req(entrypoint.requiredAuthorityPaths?.includes(DOC_PATH), 'entrypoint missing crop authority doc');
req(entrypoint.requiredAuthorityPaths?.includes(POLICY_PATH), 'entrypoint missing crop authority data');

for (const marker of ['CROP_POLICY_PATH','Crop/silhouette-readability','allCharacterCropSilhouetteReadabilityRequired','unknownCropMayBeInventedByImageModel','generatedCropChoiceCreatesCanon','cropSilhouetteReadabilityPolicyPath']) req(exporter.includes(marker), `exporter missing marker: ${marker}`);
for (const marker of ['crop-hides-wheelchair-or-mobility-equipment','crop-slims-broad-soft-body','prop-cut-at-hand-hides-grip-error','premium-closeup-hides-unresolved-construction','face-only-crop-universal-solution','outside-frame-clipping-treated-as-solved']) req(policy.forbiddenShortcuts.includes(marker), `forbidden shortcut missing: ${marker}`);
req(doc.includes('CANDIDATE_REVIEW_REQUIRED'), 'doc must preserve candidate-only status');
req(doc.includes('Adapt composition before sacrificing identity-bearing silhouette information'), 'doc must preserve core composition rule');

if (failures.length) throw new Error(`All-character crop/silhouette readability blocked:\n- ${failures.join('\n- ')}`);
console.log('All-character crop/silhouette readability authority: OK');
