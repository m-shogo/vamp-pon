import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const MASTER_PATH = 'data/visual/all-character-hand-contact-fidelity-master-v1.json';
const ENTRY_PATH = 'data/visual/character-production-generation-entrypoint-v1.json';
const DOC_PATH = 'docs/visual/all-character-hand-contact-fidelity-master-v1.md';

const master = JSON.parse(readFileSync(resolve(ROOT, MASTER_PATH), 'utf8'));
const entry = JSON.parse(readFileSync(resolve(ROOT, ENTRY_PATH), 'utf8'));
const doc = readFileSync(resolve(ROOT, DOC_PATH), 'utf8');
const expectedKinds = [
  'sprite_sheet_180','character_reference','normal_cutin','dawn_cutin','kokuyou_cutin',
  'emblem_blank','emblem_normal','emblem_dawn','emblem_kokuyou',
];
const fail = (message: string): never => { throw new Error(message); };

if (master.status !== 'CURRENT_PRODUCTION_VISUAL_FIDELITY_AUTHORITY') fail('hand contact master status weakened');
if (master.scopeCount !== 36) fail(`scopeCount must remain 36, got ${master.scopeCount}`);
if (JSON.stringify(master.assetKinds) !== JSON.stringify(expectedKinds)) fail('asset kind coverage drifted');
if ((master.contactInvariants ?? []).length < 12) fail('contact invariants must remain >=12');
if ((master.forbiddenShortcuts ?? []).length < 15) fail('contact failure bans must remain >=15');
if ((master.storageRouteRequired ?? []).length !== 6) fail('storage route must remain six-stage');
if (master.generatedImageCreatesCanon !== false) fail('generated contact must not create canon');

for (const key of [
  'unknownDominantHandMayBeInventedByImageModel','unknownSignatureGripMayBeInventedByImageModel',
  'propMayFloatNearHandWithoutContact','storageMayBeInventedToFitProp','strapCordHolsterMayBeInventedForComposition',
  'propScaleMayChangeBetweenAssets','mobilityEquipmentMayBeRemovedForPose',
  'nonHumanMayGainHumanHandsToSolvePropUse','generatedGripCreatesCanon','generatedHandednessCreatesCanon',
]) {
  if (master.hardGuards?.[key] !== false) fail(`hard guard weakened: ${key}`);
}

for (const kind of expectedKinds) if (!master.assetKindPolicy?.[kind]) fail(`missing asset kind policy: ${kind}`);
for (const emblem of ['emblem_blank','emblem_normal','emblem_dawn','emblem_kokuyou']) {
  if (master.assetKindPolicy[emblem].appearanceFidelityApplicable !== false) fail(`${emblem} must remain hand/contact N/A`);
}
if (master.assetKindPolicy.sprite_sheet_180.contactLogicMayChange !== false) fail('sprite contact logic must remain locked');
if (master.assetKindPolicy.dawn_cutin.effectsMayReplaceGripWithLevitation !== false) fail('Dawn grip/levitation guard weakened');
if (master.assetKindPolicy.kokuyou_cutin.effectsMayReplaceGripWithLevitation !== false) fail('Kokuyou grip/levitation guard weakened');

for (const required of [DOC_PATH, MASTER_PATH]) {
  if (!(entry.requiredAuthorityPaths ?? []).includes(required)) fail(`production entrypoint missing required authority: ${required}`);
}
if (!doc.includes('If an object is being used, the image must explain how force travels from body to object.')) fail('core force-transfer doctrine missing');
if (!doc.includes('Unknown dominant hand')) fail('handedness unknown policy missing');

console.log('All Character Hand / Contact Fidelity Master: OK');
