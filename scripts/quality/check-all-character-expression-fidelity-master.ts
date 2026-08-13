import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_ASSET_PROMPT_KINDS } from '../../src/game/data/assetFactoryCharacterPrompts.ts';

const MASTER = 'data/visual/all-character-expression-fidelity-master-v1.json';
const DOC = 'docs/visual/all-character-expression-fidelity-master-v1.md';
const PRODUCTION = 'data/visual/character-production-generation-entrypoint-v1.json';

function fail(message: string): never {
  throw new Error(`[all-character-expression-fidelity] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(process.cwd(), MASTER), 'utf8'));
const doc = readFileSync(resolve(process.cwd(), DOC), 'utf8');
const production = JSON.parse(readFileSync(resolve(process.cwd(), PRODUCTION), 'utf8'));

if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('status weakened');
if (master.scopeCount !== 36) fail('scopeCount must remain 36');
if (master.doesNotCreateNewStoryCanon !== true || master.doesNotCreateSignatureExpressionCanon !== true) fail('canon boundary weakened');
if (master.generatedExpressionCreatesCanon !== false || master.unknownExpressionHabitMayBeInventedByImageModel !== false) fail('image-model expression invention guard weakened');
if (!Array.isArray(master.baseFaceInvariant) || master.baseFaceInvariant.length < 12) fail('base-face invariants incomplete');
if (!Array.isArray(master.allowedDeformation) || master.allowedDeformation.length < 10) fail('allowed deformation model incomplete');
if (!Array.isArray(master.forbiddenExpressionShortcuts) || master.forbiddenExpressionShortcuts.length < 12) fail('forbidden expression shortcuts incomplete');
if (!Array.isArray(master.reviewOrder) || master.reviewOrder.length < 9) fail('expression review order incomplete');
if (!Array.isArray(master.hardBlockers) || master.hardBlockers.length < 8) fail('expression hard blockers incomplete');
if (master.authorityRule?.subordinateToIdentityProductionMaster !== true) fail('must remain subordinate to identity production master');
if (master.authorityRule?.subordinateToAppearanceGenerationContract !== true) fail('must remain subordinate to appearance generation contract');
if (master.authorityRule?.requiredBeforeFaceVisibleProductionRendering !== true) fail('must remain required before face-visible rendering');
if (master.authorityRule?.unknownSignatureExpressionMeansModelFreedom !== false) fail('unknown signature expression cannot mean model freedom');

const sourceKinds = [...CHARACTER_ASSET_PROMPT_KINDS].sort();
const masterKinds = Object.keys(master.assetKinds ?? {}).sort();
if (JSON.stringify(sourceKinds) !== JSON.stringify(masterKinds)) fail(`asset-kind coverage mismatch: source=${sourceKinds.join(',')} master=${masterKinds.join(',')}`);
for (const kind of ['character_reference','sprite_sheet_180','normal_cutin','dawn_cutin','kokuyou_cutin']) {
  if (master.assetKinds[kind]?.faceVisible !== true) fail(`${kind}: faceVisible must remain true`);
}
for (const kind of ['emblem_blank','emblem_normal','emblem_dawn','emblem_kokuyou']) {
  if (master.assetKinds[kind]?.expressionFidelityNotApplicable !== true) fail(`${kind}: expression fidelity must remain not-applicable`);
}

for (const path of [DOC, MASTER]) {
  if (!production.requiredAuthorityPaths?.includes(path)) fail(`production entrypoint missing expression authority: ${path}`);
}
for (const requiredText of ['Base-face invariant', 'Allowed expression deformation', 'Emotion without same-face acting', 'Hard blockers', 'Unknown signature expression']) {
  if (!doc.toLowerCase().includes(requiredText.toLowerCase())) fail(`doc missing concept: ${requiredText}`);
}

console.log(`[all-character-expression-fidelity] OK: scope=${master.scopeCount}, assetKinds=${masterKinds.length}, invariants=${master.baseFaceInvariant.length}`);
