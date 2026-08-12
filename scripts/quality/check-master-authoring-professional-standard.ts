import fs from 'node:fs';
import path from 'node:path';
import { CHARACTER_REFERENCE_HANDOFF_POLICY, characterReferenceGenerationHandoff } from '../../src/game/data/characterReferenceGenerationHandoff.ts';

const root = process.cwd();
const docPath = path.join(root, 'docs/visual/master-authoring-professional-standard-v1.md');
const jsonPath = path.join(root, 'data/visual/master-authoring-professional-standard-v1.json');
const councilPath = path.join(root, 'data/visual/world-character-scenario-design-council-master-v1.json');

function fail(message: string): never {
  throw new Error(`[master-authoring-professional-standard] ${message}`);
}

if (!fs.existsSync(docPath)) fail('professional master document missing');
if (!fs.existsSync(jsonPath)) fail('professional master JSON missing');

const doc = fs.readFileSync(docPath, 'utf8');
const standard = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const council = JSON.parse(fs.readFileSync(councilPath, 'utf8'));

if (standard.status !== 'TOP_LEVEL_AUTHORING_GOVERNANCE') fail('status must remain TOP_LEVEL_AUTHORING_GOVERNANCE');
for (const authority of ['USER_DECIDED','EXISTING_CANON','RESEARCH_BACKED_CURRENT','AUTHOR_CANDIDATE','OPEN']) {
  if (!standard.authorityClasses?.includes(authority)) fail(`missing authority class: ${authority}`);
}
if (!Array.isArray(standard.masterRuleRequiredFields) || standard.masterRuleRequiredFields.length < 10) fail('professional master rule schema incomplete');
if (!Array.isArray(standard.imageGenerationReadinessGate) || standard.imageGenerationReadinessGate.length < 10) fail('image-generation readiness gate incomplete');
if (standard.generationPolicy?.openMeansModelFreedom !== false) fail('OPEN must never mean model freedom');
if (standard.generationPolicy?.generatedImageCreatesCanon !== false) fail('generated image must not create canon');
if (standard.generationPolicy?.humanReviewRequiredForPromotion !== true) fail('human review must be required for promotion');
if (council.professionalGovernance?.required !== true) fail('design council must require professional governance');
if (council.professionalGovernance?.document !== 'docs/visual/master-authoring-professional-standard-v1.md') fail('council professional document path mismatch');

for (const requiredText of [
  'Master is authority, not brainstorming',
  'Canon certainty must remain visible',
  'Image-generation readiness gate',
  'generated image',
  'Professional review questions',
]) {
  if (!doc.includes(requiredText)) fail(`professional master doc missing: ${requiredText}`);
}

if (CHARACTER_REFERENCE_HANDOFF_POLICY.professionalMasterRequired !== true) fail('character handoff policy must require professional master');
if (CHARACTER_REFERENCE_HANDOFF_POLICY.openMeansImageModelFreedom !== false) fail('character handoff policy must block OPEN model freedom');
if (CHARACTER_REFERENCE_HANDOFF_POLICY.generatedImageCreatesCanon !== false) fail('character handoff policy must block generated-image canon creation');

for (const entry of characterReferenceGenerationHandoff) {
  if (entry.professionalMasterRequired !== true) fail(`${entry.characterId}: professionalMasterRequired must be true`);
  for (const authority of [
    'docs/visual/master-authoring-professional-standard-v1.md',
    'data/visual/master-authoring-professional-standard-v1.json',
  ]) {
    if (!entry.visualAuthorityPaths.includes(authority)) fail(`${entry.characterId}: missing professional authority ${authority}`);
  }
}

console.log(`[master-authoring-professional-standard] OK: top-level governance active; handoff entries=${characterReferenceGenerationHandoff.length}`);
