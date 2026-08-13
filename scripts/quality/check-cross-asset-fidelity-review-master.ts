import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_ASSET_PROMPT_KINDS } from '../../src/game/data/assetFactoryCharacterPrompts.ts';

const MASTER = 'data/visual/cross-asset-fidelity-review-master-v1.json';
const DOC = 'docs/visual/cross-asset-fidelity-review-master-v1.md';
const LEDGER = 'data/visual/character-design-feedback-ledger.json';

function fail(message: string): never {
  throw new Error(`[cross-asset-fidelity-review] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(process.cwd(), MASTER), 'utf8'));
const doc = readFileSync(resolve(process.cwd(), DOC), 'utf8');
const ledger = JSON.parse(readFileSync(resolve(process.cwd(), LEDGER), 'utf8'));

if (master.status !== 'CURRENT_POST_GENERATION_VISUAL_REVIEW_AUTHORITY') fail('status weakened');
if (master.scopeCount !== 36) fail('scopeCount must remain 36');
if (master.doesNotCreateNewCanon !== true || master.generatedImageIsNotAuthority !== true) fail('provenance boundary weakened');
if (master.weightedScoreMayOverrideHardGate !== false) fail('weighted score must never override hard gate');
if (!Array.isArray(master.identityCriticalAxes) || master.identityCriticalAxes.length !== 6) fail('identity-critical axes must remain exactly 6');
if (!Array.isArray(master.supportAxes) || master.supportAxes.length !== 6) fail('support axes must remain exactly 6');
const weightTotal = [...master.identityCriticalAxes, ...master.supportAxes].reduce((sum: number, axis: any) => sum + Number(axis.weight ?? 0), 0);
if (weightTotal !== 100) fail(`weights must total 100, got ${weightTotal}`);
for (const axis of master.identityCriticalAxes) {
  if (axis.referenceMin !== 90) fail(`${axis.id}: referenceMin must remain 90`);
  if (axis.spriteMin !== 85) fail(`${axis.id}: spriteMin must remain 85`);
}
if (master.hardGateFailureState !== 'BLOCK_IDENTITY_DRIFT') fail('hard gate failure state changed');

const sourceKinds = [...CHARACTER_ASSET_PROMPT_KINDS].sort();
const masterKinds = Object.keys(master.assetKinds ?? {}).sort();
if (JSON.stringify(sourceKinds) !== JSON.stringify(masterKinds)) fail(`asset-kind coverage mismatch: source=${sourceKinds.join(',')} master=${masterKinds.join(',')}`);
if (master.assetKinds.character_reference?.hardGateMin !== 90) fail('character_reference hard gate must remain 90');
if (master.assetKinds.sprite_sheet_180?.hardGateMin !== 85) fail('sprite hard gate must remain 85');
for (const kind of ['normal_cutin','dawn_cutin','kokuyou_cutin']) {
  if (master.assetKinds[kind]?.hardGateMin !== 90) fail(`${kind} hard gate must remain 90`);
}
for (const kind of ['emblem_blank','emblem_normal','emblem_dawn','emblem_kokuyou']) {
  if (master.assetKinds[kind]?.appearanceFidelityNotApplicable !== true) fail(`${kind}: appearance fidelity must remain not-applicable`);
  if (master.assetKinds[kind]?.emblemCanonRequired !== true) fail(`${kind}: emblem canon must remain required`);
}
if (!Array.isArray(master.absoluteBlockers) || master.absoluteBlockers.length < 10) fail('absolute blockers incomplete');
if (!Array.isArray(master.reviewEvidenceRequired) || master.reviewEvidenceRequired.length < 10) fail('review evidence incomplete');

const fidelitySchema = ledger?.candidateReviewSchema?.crossAssetFidelityReview;
if (!fidelitySchema) fail('feedback ledger missing crossAssetFidelityReview schema');
if (fidelitySchema.master !== MASTER) fail('feedback ledger points to wrong fidelity master');
if (ledger.rules?.weightedFidelityScoreNeverOverridesIdentityHardGate !== true) fail('ledger hard-gate rule missing');
if (ledger.rules?.generatedImageNeverBecomesFidelityAuthorityByItself !== true) fail('ledger generated-image authority guard missing');

for (const requiredText of ['hard minimum gate', 'Weighted score', 'Asset-kind tolerance', 'Absolute blockers', 'generated image']) {
  if (!doc.toLowerCase().includes(requiredText.toLowerCase())) fail(`doc missing required concept: ${requiredText}`);
}

console.log(`[cross-asset-fidelity-review] OK: scope=${master.scopeCount}, assetKinds=${masterKinds.length}, weights=${weightTotal}`);
