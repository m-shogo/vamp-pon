import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const MASTER_PATH = 'data/visual/all-character-motion-perspective-fidelity-master-v1.json';
const ENTRY_PATH = 'data/visual/character-production-generation-entrypoint-v1.json';
const DOC_PATH = 'docs/visual/all-character-motion-perspective-fidelity-master-v1.md';

const master = JSON.parse(readFileSync(resolve(ROOT, MASTER_PATH), 'utf8'));
const entry = JSON.parse(readFileSync(resolve(ROOT, ENTRY_PATH), 'utf8'));
const doc = readFileSync(resolve(ROOT, DOC_PATH), 'utf8');

const expectedKinds = [
  'sprite_sheet_180','character_reference','normal_cutin','dawn_cutin','kokuyou_cutin',
  'emblem_blank','emblem_normal','emblem_dawn','emblem_kokuyou',
];

const fail = (message: string): never => { throw new Error(message); };

if (master.status !== 'CURRENT_PRODUCTION_VISUAL_FIDELITY_AUTHORITY') fail('motion perspective master status weakened');
if (master.scopeCount !== 36) fail(`scopeCount must remain 36, got ${master.scopeCount}`);
if (JSON.stringify(master.assetKinds) !== JSON.stringify(expectedKinds)) fail('asset kind coverage drifted');
if ((master.identityInvariants ?? []).length < 12) fail('identity invariants must remain >=12');
if ((master.allowedMotionDeformations ?? []).length < 10) fail('allowed motion deformation channels must remain >=10');
if ((master.forbiddenShortcuts ?? []).length < 18) fail('forbidden shortcuts must remain >=18');
if (master.generatedImageCreatesCanon !== false) fail('generated dynamic pose must not create canon');

const guards = master.hardGuards ?? {};
for (const key of [
  'perspectiveMayRedesignBodyType','motionMayChangeBaseHaircut','motionMayCreateGarmentPanels',
  'motionMayIncreaseExposure','motionMayInventStrapsChainsCords','motionMayRescaleNamedPropForSpectacle',
  'motionMayRemoveMobilityEquipment','motionMayHumanoidizeNonHumanCharacter',
  'unknownHandednessMayBeInventedByImageModel','unknownSignatureMotionMayBeInventedByImageModel',
  'generatedDynamicPoseCreatesCanon',
]) {
  if (guards[key] !== false) fail(`hard guard weakened: ${key}`);
}

for (const kind of expectedKinds) {
  if (!master.assetKindPolicy?.[kind]) fail(`missing asset kind policy: ${kind}`);
}
for (const emblem of ['emblem_blank','emblem_normal','emblem_dawn','emblem_kokuyou']) {
  if (master.assetKindPolicy[emblem].appearanceFidelityApplicable !== false) fail(`${emblem} must remain body-perspective N/A`);
}
if (master.assetKindPolicy.sprite_sheet_180.commonChibiNormalizationAllowed !== false) fail('sprite common chibi normalization must stay prohibited');
if (master.assetKindPolicy.dawn_cutin.angelicBodyRedesignAllowed !== false) fail('Dawn body redesign guard weakened');
if (master.assetKindPolicy.kokuyou_cutin.monsterBodyRedesignAllowed !== false) fail('Kokuyou body redesign guard weakened');

for (const required of [DOC_PATH, MASTER_PATH]) {
  if (!(entry.requiredAuthorityPaths ?? []).includes(required)) fail(`production entrypoint missing required authority: ${required}`);
}
if (!doc.includes('Perspective is a camera effect, not a redesign license.')) fail('core perspective doctrine missing from document');
if (!doc.includes('Unknown motion habits')) fail('unknown motion policy missing from document');

console.log('All Character Motion / Perspective Fidelity Master: OK');
