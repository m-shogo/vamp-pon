import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import {
  ENEMY_FAMILY_VISUAL_RULES,
  enemyVisualSharedSourceEntries,
} from '../../src/game/data/enemyVisualSharedSource.ts';
import {
  ARTWORK_APPROVAL_STATES,
  SHARED_SOURCE_CATEGORY_IDS,
  sharedSourceAuthorityById,
  sharedSourceAuthorityRegistry,
} from '../../src/game/data/sharedSourceContracts.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source Foundation] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function assertPathExists(path: string, owner: string): void {
  assert(existsSync(resolve(path)), `${owner}: missing referenced path ${path}`);
}

assert(ARTWORK_APPROVAL_STATES.length === 7, 'approval-state count drift');
assert(new Set(ARTWORK_APPROVAL_STATES).size === ARTWORK_APPROVAL_STATES.length, 'duplicate artwork approval state');

assert(
  sharedSourceAuthorityRegistry.length === SHARED_SOURCE_CATEGORY_IDS.length,
  `category count drift: registry=${sharedSourceAuthorityRegistry.length}, expected=${SHARED_SOURCE_CATEGORY_IDS.length}`,
);
assert(new Set(sharedSourceAuthorityRegistry.map((record) => record.id)).size === sharedSourceAuthorityRegistry.length, 'duplicate category id');
assert(
  JSON.stringify(sharedSourceAuthorityRegistry.map((record) => record.id)) === JSON.stringify(SHARED_SOURCE_CATEGORY_IDS),
  'category registry order or coverage drift',
);

for (const record of sharedSourceAuthorityRegistry) {
  assert(record.displayName.trim().length > 0, `${record.id}: displayName missing`);
  assert(record.currentAuthoritySources.length > 0, `${record.id}: current authority source missing`);
  assert(record.useCases.length > 0, `${record.id}: use case missing`);
  assert(ARTWORK_APPROVAL_STATES.includes(record.artworkState), `${record.id}: unknown artwork state ${record.artworkState}`);

  const sourceGroups = [
    record.currentAuthoritySources,
    record.machineSources,
    record.runtimeSources,
    record.lorebookSources,
    record.visualSources,
    record.generationBriefSources,
    record.qaSources,
  ];
  for (const group of sourceGroups) {
    for (const path of group) assertPathExists(path, record.id);
  }

  if (record.maturity === 'STRONG') {
    assert(record.machineSources.length > 0, `${record.id}: STRONG source must have machine authority`);
  }
  if (record.maturity === 'DOCS_ONLY' || record.maturity === 'MISSING') {
    assert(record.referenceGenerationReady === false, `${record.id}: docs-only/missing source cannot be generation-ready`);
  }
  if (record.referenceGenerationReady) {
    assert(record.visualSources.length > 0, `${record.id}: generation-ready source needs visual source`);
    assert(record.generationBriefSources.length > 0, `${record.id}: generation-ready source needs generation brief source`);
    assert(record.artworkState !== 'PRODUCTION_READY', `${record.id}: generation readiness must not imply production-ready artwork`);
  }
}

const toumon = sharedSourceAuthorityById.get('toumon');
assert(toumon, 'Toumon registry entry missing');
assert(toumon.referenceGenerationReady === false, 'Toumon image generation hold must remain fail-closed');
assert(toumon.artworkState === 'NOT_GENERATED', 'Toumon artwork must not be implied generated');
assert(toumon.missingFields.some((field) => /vector/i.test(field)), 'Toumon final vector gap must remain explicit');

for (const categoryId of ['enemies', 'bosses'] as const) {
  const record = sharedSourceAuthorityById.get(categoryId);
  assert(record, `${categoryId} registry entry missing`);
  assert(record.referenceGenerationReady === true, `${categoryId} reference generation should be ready after Shared Source adapter`);
  assert(record.artworkState === 'NOT_GENERATED', `${categoryId} artwork must remain NOT_GENERATED`);
}

assert(
  enemyVisualSharedSourceEntries.length === enemyProductionEntries.length,
  `Enemy Shared Source coverage drift: ${enemyVisualSharedSourceEntries.length}/${enemyProductionEntries.length}`,
);
assert(new Set(enemyVisualSharedSourceEntries.map((entry) => entry.id)).size === enemyVisualSharedSourceEntries.length, 'duplicate Enemy Shared Source id');
assert(
  JSON.stringify(enemyVisualSharedSourceEntries.map((entry) => entry.id)) === JSON.stringify(enemyProductionEntries.map((entry) => entry.id)),
  'Enemy Shared Source must preserve existing 48-entry authority ID/order',
);

const productionFamilies = new Set(enemyProductionEntries.map((entry) => entry.family));
for (const family of productionFamilies) {
  const rule = ENEMY_FAMILY_VISUAL_RULES[family];
  assert(rule, `missing family visual rule: ${family}`);
  assert(rule.primaryShapeLanguage.trim().length > 24, `${family}: shape language too weak`);
  assert(rule.iconRule.trim().length > 16, `${family}: icon rule missing`);
  assert(rule.smallScaleReadability.includes('px'), `${family}: small-scale target must be explicit`);
  assert(rule.avoid.length >= 5, `${family}: avoid set too small`);
}

assert(/no arms/i.test(ENEMY_FAMILY_VISUAL_RULES.ombu.limbRule), 'Ombu no-arms family discriminator missing');
assert(/two thick|2 thick/i.test(ENEMY_FAMILY_VISUAL_RULES.omburo.limbRule), 'Omburo thick-arm family discriminator missing');
assert(
  ENEMY_FAMILY_VISUAL_RULES.wrong_reading.avoid.some((rule) => /mimic/i.test(rule)),
  'wrong_reading generic mimic guard missing',
);
assert(
  ENEMY_FAMILY_VISUAL_RULES.great_shadow.avoid.some((rule) => /kaiju/i.test(rule)),
  'great_shadow kaiju normalization guard missing',
);

for (const [index, entry] of enemyVisualSharedSourceEntries.entries()) {
  const production = enemyProductionEntries[index];
  assert(entry.id === production.id, `${entry.id}: source ID drift`);
  assert(entry.displayName === production.name, `${entry.id}: displayName must derive from production authority`);
  assert(entry.enemyClass === production.rank, `${entry.id}: rank drift`);
  assert(entry.enemyFamily === production.family, `${entry.id}: family drift`);
  assert(entry.visualSilhouette === production.silhouette, `${entry.id}: silhouette authority drift`);
  assert(entry.stageAffinity === production.stageAffinity, `${entry.id}: stageAffinity must preserve source reference`);
  assert(entry.authoritySource === 'src/game/data/enemyProductionDatabase.ts', `${entry.id}: authority source drift`);
  assert(entry.runtimeReady === false, `${entry.id}: Shared Source must not imply runtime-ready`);
  assert(entry.artworkReady === false, `${entry.id}: Shared Source must not imply artwork-ready`);
  assert(entry.artworkState === 'NOT_GENERATED', `${entry.id}: generated artwork state inferred without evidence`);
  assert(entry.generationBriefSeed.trim().length > 100, `${entry.id}: generation brief seed too weak`);
  assert(entry.variants.BLACK_INK_VARIANT === 'EXPLICIT_APPROVAL_ONLY', `${entry.id}: black-ink variant must remain opt-in`);
  assert(entry.variants.DAWN_CLEANSED === 'REFERENCE_ONLY', `${entry.id}: Dawn-cleansed form must remain reference-only`);
  assert(entry.avoid.some((rule) => /generic AI monster/i.test(rule)), `${entry.id}: generic AI monster guard missing`);
  assert(entry.negativePromptHints.some((rule) => /neon cyan\/purple/i.test(rule)), `${entry.id}: generic AI palette guard missing`);

  if (entry.enemyClass === 'boss') {
    assert(entry.variants.BOSS === 'PRIMARY', `${entry.id}: boss primary variant missing`);
    assert(entry.variants.NORMAL === 'NOT_APPLICABLE', `${entry.id}: boss must not silently acquire NORMAL variant`);
    assert(entry.spoilerTier === 'GUIDE_SPOILER', `${entry.id}: boss spoiler tier must be gated`);
  } else if (entry.enemyClass === 'elite') {
    assert(entry.variants.ELITE === 'PRIMARY', `${entry.id}: elite primary variant missing`);
  } else {
    assert(entry.variants.NORMAL === 'PRIMARY', `${entry.id}: normal primary variant missing`);
  }
}

const bossCount = enemyVisualSharedSourceEntries.filter((entry) => entry.enemyClass === 'boss').length;
const readyCategories = sharedSourceAuthorityRegistry.filter((entry) => entry.referenceGenerationReady).map((entry) => entry.id);

console.log(
  `Shared Source Foundation: PASS (${sharedSourceAuthorityRegistry.length} categories, ` +
    `${enemyVisualSharedSourceEntries.length} Enemy/Boss entries, bosses=${bossCount}, ` +
    `reference-generation-ready=${readyCategories.join(',')})`,
);
