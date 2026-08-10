import { evolutions } from '../../src/game/data/evolutions.ts';
import { enemyById } from '../../src/game/data/enemyProductionDatabase.ts';
import { itemAssetProductionEntries } from '../../src/game/data/itemAssetProductionDatabase.ts';
import {
  ITEM_KIND_VISUAL_RULES,
  itemVisualSharedSourceEntries,
} from '../../src/game/data/itemVisualSharedSource.ts';
import { namedObjectById } from '../../src/game/data/namedObjectRegistry.ts';
import { stageProductionEntries } from '../../src/game/data/stageProductionDatabase.ts';
import {
  STAGE_DERIVED_TARGET_RULES,
  stageVisualSharedSourceEntries,
} from '../../src/game/data/stageVisualSharedSource.ts';
import {
  WEAPON_VISUAL_OVERRIDES,
  weaponVisualSharedSourceById,
  weaponVisualSharedSourceEntries,
} from '../../src/game/data/weaponVisualSharedSource.ts';
import { weapons } from '../../src/game/data/weapons.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source Production Adapters] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

// Weapon coverage and lineage.
assert(weaponVisualSharedSourceEntries.length === weapons.length, `Weapon coverage drift: ${weaponVisualSharedSourceEntries.length}/${weapons.length}`);
assert(new Set(weaponVisualSharedSourceEntries.map((entry) => entry.id)).size === weapons.length, 'duplicate Weapon Shared Source id');
assert(
  JSON.stringify(weaponVisualSharedSourceEntries.map((entry) => entry.id)) === JSON.stringify(weapons.map((entry) => entry.id)),
  'Weapon Shared Source must preserve runtime weapon ID/order',
);
const overrideIds = Object.keys(WEAPON_VISUAL_OVERRIDES).sort();
const weaponIds = weapons.map((entry) => entry.id).sort();
assert(JSON.stringify(overrideIds) === JSON.stringify(weaponIds), `Weapon visual override coverage drift: ${overrideIds.join(',')}`);

for (const weapon of weaponVisualSharedSourceEntries) {
  assert(weapon.runtimeReady === true, `${weapon.id}: runtime-backed weapon should remain runtimeReady`);
  assert(weapon.artworkReady === false && weapon.artworkState === 'NOT_GENERATED', `${weapon.id}: artwork approval inferred without evidence`);
  assert(weapon.kokuyouVariantRule === 'NO_AUTOMATIC_VARIANT', `${weapon.id}: automatic Kokuyou weapon variant forbidden`);
  assert(weapon.dawnVariantRule === 'EVOLUTION_AUTHORITY_ONLY', `${weapon.id}: Dawn form must be driven by evolution authority`);
  assert(/^#[0-9A-F]{6}$/.test(weapon.themeHex), `${weapon.id}: invalid themeHex ${weapon.themeHex}`);
  assert(/^#[0-9A-F]{6}$/.test(weapon.accentHex), `${weapon.id}: invalid accentHex ${weapon.accentHex}`);
  assert(weapon.generationBriefSeed.length > 180, `${weapon.id}: generation brief too weak`);
  assert(/px/.test(weapon.smallScaleReadability), `${weapon.id}: small-scale target missing`);
  assert(weapon.avoid.some((rule) => /generic/i.test(rule)), `${weapon.id}: generic-normalization guard missing`);
  for (const objectId of weapon.namedObjectRelationIds) {
    assert(namedObjectById.has(objectId), `${weapon.id}: missing Named Object relation ${objectId}`);
  }
}

for (const evolution of evolutions) {
  const base = weaponVisualSharedSourceById.get(evolution.fromWeaponId);
  const target = weaponVisualSharedSourceById.get(evolution.evolvedWeaponId);
  assert(base, `${evolution.id}: base weapon missing from Shared Source: ${evolution.fromWeaponId}`);
  assert(target, `${evolution.id}: evolved weapon missing from Shared Source: ${evolution.evolvedWeaponId}`);
  assert(target.baseFormId === evolution.fromWeaponId, `${evolution.id}: evolved baseFormId drift`);
  assert(base.evolutionIds.includes(evolution.id), `${evolution.id}: base evolutionIds missing`);
  assert(base.evolutionTargetIds.includes(evolution.evolvedWeaponId), `${evolution.id}: base evolution target missing`);
  const expectedKind = evolution.kind === 'fusion' ? 'FUSION' : evolution.kind === 'awakening' ? 'AWAKENING' : 'UPGRADE';
  assert(target.formKind === expectedKind, `${evolution.id}: form kind drift ${target.formKind}/${expectedKind}`);
}

// Item coverage and Named Object linkage.
assert(itemVisualSharedSourceEntries.length === itemAssetProductionEntries.length, `Item coverage drift: ${itemVisualSharedSourceEntries.length}/${itemAssetProductionEntries.length}`);
assert(new Set(itemVisualSharedSourceEntries.map((entry) => entry.id)).size === itemAssetProductionEntries.length, 'duplicate Item Shared Source id');
assert(
  JSON.stringify(itemVisualSharedSourceEntries.map((entry) => entry.id)) === JSON.stringify(itemAssetProductionEntries.map((entry) => entry.id)),
  'Item Shared Source must preserve production ID/order',
);
assert(Object.keys(ITEM_KIND_VISUAL_RULES).length === 6, 'Item kind visual rule coverage drift');

for (const [index, item] of itemVisualSharedSourceEntries.entries()) {
  const source = itemAssetProductionEntries[index];
  assert(item.displayName === source.name, `${item.id}: displayName authority drift`);
  assert(item.itemClass === source.kind, `${item.id}: item kind drift`);
  assert(item.artworkReady === false && item.artworkState === 'NOT_GENERATED', `${item.id}: artwork approval inferred without evidence`);
  assert(item.runtimeReady === false, `${item.id}: item production DB must not imply runtime-ready`);
  assert(/^#[0-9A-F]{6}$/.test(item.themeHex), `${item.id}: invalid themeHex`);
  assert(/^#[0-9A-F]{6}$/.test(item.accentHex), `${item.id}: invalid accentHex`);
  assert(item.generationBriefSeed.length > 180, `${item.id}: generation brief too weak`);
  assert(/px/.test(item.smallScaleReadability), `${item.id}: small scale rule missing`);
  assert(item.avoid.some((rule) => /generic RPG crystal/i.test(rule)), `${item.id}: generic RPG loot guard missing`);
  for (const objectId of item.namedObjectRelationIds) {
    assert(namedObjectById.has(objectId), `${item.id}: missing Named Object relation ${objectId}`);
  }
  if (source.kind === 'field_drop') {
    assert(item.dropSource === 'FIELD_DROP', `${item.id}: field drop source drift`);
    assert(item.characterRelationIds.length === 0, `${item.id}: field drop must not invent Character owner`);
  } else {
    assert(item.dropSource === 'CHARACTER_LINEAGE', `${item.id}: Character item source drift`);
    assert(item.characterRelationIds.length === 1, `${item.id}: Character lineage relation missing`);
    assert(item.namedObjectRelationIds.length >= 1, `${item.id}: Character item must connect to Named Object registry`);
  }
}

// Stage coverage, source relations and output separation.
assert(stageVisualSharedSourceEntries.length === stageProductionEntries.length, `Stage coverage drift: ${stageVisualSharedSourceEntries.length}/${stageProductionEntries.length}`);
assert(new Set(stageVisualSharedSourceEntries.map((entry) => entry.id)).size === stageProductionEntries.length, 'duplicate Stage Shared Source id');
assert(
  JSON.stringify(stageVisualSharedSourceEntries.map((entry) => entry.id)) === JSON.stringify(stageProductionEntries.map((entry) => entry.id)),
  'Stage Shared Source must preserve production ID/order',
);
assert(STAGE_DERIVED_TARGET_RULES.length === 8, 'Stage derived target count drift');
assert(new Set(STAGE_DERIVED_TARGET_RULES.map((entry) => entry.kind)).size === STAGE_DERIVED_TARGET_RULES.length, 'duplicate Stage derived target kind');
for (const required of ['UNITY_BACKGROUND_SOURCE', 'LOADING_ART', 'WEB_HEADER', 'OGP'] as const) {
  assert(STAGE_DERIVED_TARGET_RULES.some((entry) => entry.kind === required), `missing Stage target ${required}`);
}

for (const [index, stage] of stageVisualSharedSourceEntries.entries()) {
  const source = stageProductionEntries[index];
  assert(stage.displayName === source.name, `${stage.id}: displayName authority drift`);
  assert(stage.colorScript === source.colorScript, `${stage.id}: colorScript must preserve source reference`);
  assert(stage.routeRelation === 'PENDING_P10_ROUTE_AUTHORITY', `${stage.id}: route authority invented before P10`);
  assert(stage.stationRelation === 'PENDING_P10_STATION_AUTHORITY', `${stage.id}: station authority invented before P10`);
  assert(stage.routeStamp === 'PENDING_P10_ORIGINAL_ROUTE_STAMP', `${stage.id}: final route stamp invented before P10`);
  assert(stage.runtimeReady === false && stage.artworkReady === false && stage.artworkState === 'NOT_GENERATED', `${stage.id}: Stage readiness inferred without evidence`);
  assert(stage.generationBriefSeed.length > 220, `${stage.id}: generation brief too weak`);
  assert(stage.derivedTargets === STAGE_DERIVED_TARGET_RULES, `${stage.id}: derived target matrix must stay shared rather than fork per stage`);
  assert(stage.avoid.some((rule) => /real railway/i.test(rule)), `${stage.id}: real-railway imitation guard missing`);
  for (const enemyId of source.enemyAffinity) {
    assert(enemyById.has(enemyId), `${stage.id}: enemyAffinity points to missing Enemy ${enemyId}`);
  }
  for (const bossId of stage.bossRelationIds) {
    assert(enemyById.get(bossId)?.rank === 'boss', `${stage.id}: boss relation ${bossId} is not boss authority`);
  }
}

console.log(
  `Shared Source Production Adapters: PASS (` +
    `weapons=${weaponVisualSharedSourceEntries.length}, evolutions=${evolutions.length}, ` +
    `items=${itemVisualSharedSourceEntries.length}, stages=${stageVisualSharedSourceEntries.length}, ` +
    `stageTargets=${STAGE_DERIVED_TARGET_RULES.length})`,
);
