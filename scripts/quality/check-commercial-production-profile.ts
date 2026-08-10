import { characterCommercialIdentityById } from '../../src/game/data/characterCommercialIdentity.ts';
import {
  COMMERCIAL_PRODUCTION_PROFILE_POLICY,
  commercialProductionProfileById,
  commercialProductionProfiles,
} from '../../src/game/data/commercialProductionProfile.ts';
import { toumonSigilById } from '../../src/game/data/toumonSimpleSigilCanon.ts';

const EXPECTED_IDS = [
  'yui', 'asa', 'nagi', 'michiru', 'tomori',
  'sen', 'ritsu', 'koyori', 'gen', 'hana',
  'yubi', 'madoka', 'shiro', 'tobari', 'nemu',
  'kuroori', 'kage1', 'kage2', 'kage3', 'kage4',
  'ren',
] as const;

function fail(message: string): never {
  throw new Error(`[Commercial Production Profile] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(COMMERCIAL_PRODUCTION_PROFILE_POLICY.authority === 'CURRENT_COMMERCIAL_PRODUCTION_DIRECTION', 'authority drift');
assert(COMMERCIAL_PRODUCTION_PROFILE_POLICY.expectedCount === 21, 'expected count policy drift');
assert(COMMERCIAL_PRODUCTION_PROFILE_POLICY.imageGenerationRequired === false, 'image generation must remain optional/held');
assert(COMMERCIAL_PRODUCTION_PROFILE_POLICY.toumonVectorStatus === 'NOT_YET_DRAWN', 'Toumon vector status must remain honest');
assert(COMMERCIAL_PRODUCTION_PROFILE_POLICY.collectionHub === '夜の記録帳', 'collection hub drift');

assert(commercialProductionProfiles.length === 21, `expected 21 profiles, got ${commercialProductionProfiles.length}`);
assert(new Set(commercialProductionProfiles.map((profile) => profile.characterId)).size === 21, 'duplicate characterId');
assert(
  JSON.stringify(commercialProductionProfiles.map((profile) => profile.characterId)) === JSON.stringify(EXPECTED_IDS),
  'Current21 order drift',
);

const knownIds = new Set(EXPECTED_IDS);
const current20 = commercialProductionProfiles.filter((profile) => profile.scope === 'current20');
const reserve = commercialProductionProfiles.filter((profile) => profile.scope === 'official_reserve');
assert(current20.length === 20, `expected Current20=20, got ${current20.length}`);
assert(reserve.length === 1 && reserve[0]?.characterId === 'ren', 'Ren must remain sole official reserve');

for (const profile of commercialProductionProfiles) {
  const identity = characterCommercialIdentityById.get(profile.characterId);
  const toumon = toumonSigilById.get(profile.characterId);
  assert(identity, `${profile.characterId}: commercial identity missing`);
  assert(toumon, `${profile.characterId}: Toumon missing`);

  assert(profile.displayName === identity.displayName, `${profile.characterId}: display name drift`);
  assert(profile.scope === identity.scope, `${profile.characterId}: scope drift`);
  assert(profile.launchEligible === (identity.scope === 'current20'), `${profile.characterId}: launch eligibility drift`);
  assert(profile.oneColorSymbol.authority === 'TOUMON', `${profile.characterId}: oneColorSymbol authority drift`);
  assert(profile.oneColorSymbol.sigilName === toumon.sigilName, `${profile.characterId}: Toumon name drift`);
  assert(profile.oneColorSymbol.singleInkTarget === true, `${profile.characterId}: single-ink target missing`);
  assert(profile.oneColorSymbol.masterVectorStatus === 'NOT_YET_DRAWN', `${profile.characterId}: vector approval invented`);

  assert(profile.repeatPattern.primary !== profile.repeatPattern.secondary, `${profile.characterId}: pattern families must differ`);
  assert(profile.repeatPattern.rule.trim().length >= 20, `${profile.characterId}: repeat pattern rule too thin`);

  assert(profile.plushReadability.starBeast === identity.starBeast, `${profile.characterId}: Star Beast drift`);
  assert(profile.plushReadability.recognitionHook.trim().length >= 20, `${profile.characterId}: plush recognition hook too thin`);
  assert(profile.plushReadability.posePriority.length >= 3, `${profile.characterId}: plush pose set incomplete`);
  assert(profile.plushReadability.avoid.length >= 3, `${profile.characterId}: plush avoid set incomplete`);

  assert(profile.embroiderySafe.target === true, `${profile.characterId}: embroidery target missing`);
  assert(profile.embroiderySafe.productionApproved === false, `${profile.characterId}: embroidery cannot be production approved before vector/sample review`);
  assert(profile.smallScaleReadability.targetPx === 16, `${profile.characterId}: small-scale target must stay 16px`);
  assert(profile.smallScaleReadability.productionApproved === false, `${profile.characterId}: 16px production approval invented`);

  assert(profile.namedObjectReplica.objectName === identity.namedObject, `${profile.characterId}: Named Object drift`);
  assert(profile.namedObjectReplica.entryForm.trim().length >= 8, `${profile.characterId}: replica entry form too thin`);
  assert(profile.namedObjectReplica.collectorForm.trim().length >= 8, `${profile.characterId}: collector form too thin`);
  assert(profile.namedObjectReplica.premiumReplicaCandidate === identity.premiumCandidate, `${profile.characterId}: premium candidate drift`);
  assert(profile.namedObjectReplica.spoilerRule.trim().length >= 15, `${profile.characterId}: spoiler rule too thin`);

  assert(profile.pairGoodsPartnerIds.length >= 2, `${profile.characterId}: pair goods partners too thin`);
  assert(new Set(profile.pairGoodsPartnerIds).size === profile.pairGoodsPartnerIds.length, `${profile.characterId}: duplicate pair partner`);
  for (const partnerId of profile.pairGoodsPartnerIds) {
    assert(knownIds.has(partnerId as typeof EXPECTED_IDS[number]), `${profile.characterId}: unknown pair partner ${partnerId}`);
    assert(partnerId !== profile.characterId, `${profile.characterId}: self pair is invalid`);
  }
  assert(profile.pairGoodsGrammar.trim().length >= 20, `${profile.characterId}: pair grammar too thin`);
  assert(profile.displayGoodsHook.trim().length >= 20, `${profile.characterId}: display hook too thin`);
  assert(profile.carryGoodsHook.trim().length >= 20, `${profile.characterId}: carry hook too thin`);

  for (const immutable of ['Toumon master geometry', 'Character body identity', 'relationship type', 'Named Object ownership/truth', 'Star Beast species/identity']) {
    assert(profile.seasonalVariantRules.immutable.includes(immutable), `${profile.characterId}: seasonal immutable missing ${immutable}`);
  }
  assert(profile.seasonalVariantRules.characterAccent.trim().length >= 15, `${profile.characterId}: seasonal accent too thin`);
  assert(profile.commercialNoGo.length >= identity.commercialAvoid.length, `${profile.characterId}: commercial no-go lost identity guards`);
  assert(profile.productionArtworkReady === false, `${profile.characterId}: production artwork cannot be ready`);
  assert(profile.realSkuApproved === false, `${profile.characterId}: real SKU approval cannot be implied`);
}

const hana = commercialProductionProfileById.get('hana');
const kaname = commercialProductionProfileById.get('kage1');
const ren = commercialProductionProfileById.get('ren');
assert(hana?.commercialNoGo.some((rule) => rule.includes('body size')), 'Hana body-size commercial guard missing');
assert(kaname?.commercialNoGo.some((rule) => rule.includes('body size')), 'Kaname body-size commercial guard missing');
assert(hana?.embroiderySafe.rule.includes('線を増やさない'), 'Hana body must not be encoded by thicker/more Toumon lines');
assert(kaname?.embroiderySafe.rule.includes('線を増やさない'), 'Kaname body must not be encoded by thicker/more Toumon lines');
assert(ren?.launchEligible === false, 'Ren reserve cannot be launch eligible');
assert(ren?.commercialNoGo.some((rule) => rule.includes('Current20 trading')), 'Ren Current20 trading guard missing');

console.log(`Commercial Production Profile: PASS (${commercialProductionProfiles.length}/21; Current20=${current20.length}; Reserve=${reserve[0]?.displayName})`);
