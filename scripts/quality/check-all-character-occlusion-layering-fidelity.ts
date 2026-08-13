import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const POLICY_PATH = 'data/visual/all-character-occlusion-layering-fidelity-master-v1.json';
const DOC_PATH = 'docs/visual/all-character-occlusion-layering-fidelity-master-v1.md';
const ENTRYPOINT_PATH = 'data/visual/character-production-generation-entrypoint-v1.json';
const EXPORTER_PATH = 'tools/asset-factory/scripts/export-production-character-design-prompt.ts';

const policy = JSON.parse(readFileSync(resolve(process.cwd(), POLICY_PATH), 'utf8'));
const doc = readFileSync(resolve(process.cwd(), DOC_PATH), 'utf8');
const entrypoint = JSON.parse(readFileSync(resolve(process.cwd(), ENTRYPOINT_PATH), 'utf8'));
const exporter = readFileSync(resolve(process.cwd(), EXPORTER_PATH), 'utf8');

const failures: string[] = [];
const requireValue = (condition: boolean, message: string) => { if (!condition) failures.push(message); };

requireValue(policy.status === 'CURRENT_PRODUCTION_VISUAL_AUTHORITY', 'status must remain CURRENT_PRODUCTION_VISUAL_AUTHORITY');
requireValue(policy.scopeCount === 36, 'scopeCount must remain 36');
requireValue(policy.assetKindCount === 9, 'assetKindCount must remain 9');
requireValue(policy.production?.requiredForCandidateGeneration === true, 'must remain required for candidate generation');
requireValue(policy.production?.generatedOutputState === 'CANDIDATE_REVIEW_REQUIRED', 'generated output must remain candidate-only');
requireValue(Array.isArray(policy.occlusionInvariants) && policy.occlusionInvariants.length >= 18, 'must retain at least 18 occlusion invariants');
requireValue(Array.isArray(policy.repairOrder) && policy.repairOrder.length >= 5, 'must retain at least five repair-order steps');
requireValue(Array.isArray(policy.forbiddenShortcuts) && policy.forbiddenShortcuts.length >= 30, 'must retain at least 30 forbidden shortcuts');
requireValue(policy.unknownLayerDefault === 'SIMPLE_PHYSICALLY_PLAUSIBLE_UNRESOLVED_FOR_HUMAN_REVIEW', 'unknown layer route must remain unresolved for human review');

const expectedRules: Record<string, boolean> = {
  occlusionMayRedesignCharacter: false,
  occlusionMayIncreaseExposure: false,
  occlusionMayInventAttachment: false,
  occlusionMayRemoveMobilityEquipment: false,
  unknownLayerRouteMayBeInventedByImageModel: false,
  generatedOverlapSolutionCreatesCanon: false,
  lightingMayHideClippingAsSolution: false,
  stateTransformMayRerouteGarmentConstruction: false,
};
for (const [field, expected] of Object.entries(expectedRules)) {
  requireValue(policy.rules?.[field] === expected, `${field} must remain ${expected}`);
  requireValue(entrypoint.requiredFlags?.[field] === expected, `production entrypoint must require ${field}=${expected}`);
}
requireValue(entrypoint.requiredFlags?.allCharacterOcclusionLayeringFidelityRequired === true, 'production entrypoint must require occlusion/layering fidelity');
requireValue(entrypoint.requiredAuthorityPaths?.includes(DOC_PATH), 'production entrypoint must load occlusion authority document');
requireValue(entrypoint.requiredAuthorityPaths?.includes(POLICY_PATH), 'production entrypoint must load occlusion machine policy');

for (const marker of [
  'OCCLUSION_POLICY_PATH',
  'Occlusion/layering',
  'allCharacterOcclusionLayeringFidelityRequired',
  'unknownLayerRouteMayBeInventedByImageModel',
  'generatedOverlapSolutionCreatesCanon',
  'occlusionLayeringFidelityPolicyPath',
]) requireValue(exporter.includes(marker), `production exporter missing marker: ${marker}`);

for (const marker of [
  'invented-cutout-solves-overlap',
  'opened-neckline-solves-overlap',
  'wheelchair-frame-intersection',
  'state-transform-reroutes-construction',
  'darkness-fog-ink-hides-clipping',
]) requireValue(policy.forbiddenShortcuts.includes(marker), `forbidden shortcut missing: ${marker}`);

requireValue(doc.includes('Occlusion') || doc.includes('occlusion'), 'authority document must describe occlusion');
requireValue(doc.includes('CANDIDATE_REVIEW_REQUIRED'), 'authority document must preserve candidate-only output');

if (failures.length > 0) {
  throw new Error(`All-character occlusion/layering fidelity blocked:\n- ${failures.join('\n- ')}`);
}
console.log('All-character occlusion/layering fidelity authority: OK');
