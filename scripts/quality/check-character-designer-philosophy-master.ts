import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const philosophyPath = path.join(root, 'data/visual/character-designer-philosophy-master-v1.json');
const handoffPath = path.join(root, 'src/game/data/characterReferenceGenerationHandoff.ts');

function fail(message: string): never {
  throw new Error(`[character-designer-philosophy-master] ${message}`);
}

const philosophy = JSON.parse(fs.readFileSync(philosophyPath, 'utf8'));
const handoff = fs.readFileSync(handoffPath, 'utf8');

if (philosophy.status !== 'PROJECT_DESIGNER_PHILOSOPHY') fail('status must remain PROJECT_DESIGNER_PHILOSOPHY');
if (!Array.isArray(philosophy.creed) || philosophy.creed.length < 20) fail('creed must contain at least 20 durable principles');
if (!Array.isArray(philosophy.designerLikes) || philosophy.designerLikes.length < 10) fail('designerLikes must contain at least 10 preferences');
if (!Array.isArray(philosophy.designerDislikes) || philosophy.designerDislikes.length < 8) fail('designerDislikes must contain at least 8 aversions');
if (!Array.isArray(philosophy.decisionLadder) || philosophy.decisionLadder[0] !== 'canon-fidelity') fail('decision ladder must begin with canon fidelity');
if (philosophy.decisionLadder.at(-1) !== 'beauty-coolness-cuteness') fail('beauty/coolness/cuteness must remain below character truth in the decision ladder');
if (!Array.isArray(philosophy.preCandidateExplanationRequired) || philosophy.preCandidateExplanationRequired.length < 10) fail('pre-candidate explanation requirements incomplete');
if (philosophy.researchTranslation?.copySourceSpecificFaceCostumeLineRenderingMotif !== false) fail('source-specific visual copying must remain disabled');
if (!Array.isArray(philosophy.sourceProvenance) || philosophy.sourceProvenance.length < 4) fail('research provenance must remain explicit');

for (const required of [
  'docs/visual/character-designer-philosophy-master-v1.md',
  'data/visual/character-designer-philosophy-master-v1.json',
  'designerPhilosophyRequired: true',
]) {
  if (!handoff.includes(required)) fail(`generation handoff missing required philosophy authority: ${required}`);
}

console.log(`[character-designer-philosophy-master] OK: creed=${philosophy.creed.length}, likes=${philosophy.designerLikes.length}, dislikes=${philosophy.designerDislikes.length}`);
