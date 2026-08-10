import { readFileSync } from 'node:fs';

import {
  UI_ICON_MASTER_SIZES,
  UI_ICON_SIZE_RULES,
  uiSymbolSharedSourceById,
  uiSymbolSharedSourceEntries,
} from '../../src/game/data/uiSymbolSharedSource.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source VFX UI Language] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const effectSource = readFileSync('src/game/data/worldEffectSharedSource.ts', 'utf8');
const visualDesignSource = readFileSync('src/game/ui/visualDesign.ts', 'utf8');
const audioHapticSource = readFileSync('docs/AUDIO-HAPTIC-DIRECTION.md', 'utf8');

const expectedEffectIds = [
  'NORMAL_ATTACK',
  'CRITICAL',
  'LEVEL_UP',
  'WEAPON_EVOLUTION',
  'TOUMON',
  'KOKUYOU',
  'DAWN',
  'HEAL',
  'PICKUP',
  'BOSS_ENTRY',
  'BOSS_DEATH',
  'CLEAR',
  'REWARD_UNLOCK',
] as const;

for (const id of expectedEffectIds) {
  const matches = effectSource.match(new RegExp(`id: '${id}'`, 'g')) ?? [];
  assert(matches.length === 1, `${id}: expected exactly one semantic VFX entry, got ${matches.length}`);
}
assert((effectSource.match(/runtimeReady: true/g) ?? []).length === 0, 'VFX Shared Source must not imply runtime-ready');
assert((effectSource.match(/artworkReady: true/g) ?? []).length === 0, 'VFX Shared Source must not imply artwork-ready');
assert(effectSource.includes('const PHOTOSENSITIVE_BASE'), 'shared photosensitive-safety contract missing');
assert(effectSource.includes('REDUCED_MOTION_BASE') && effectSource.includes('REDUCED_FLASH_BASE'), 'reduced-motion/flash shared rules missing');
assert(effectSource.includes('critical information communicated only by audio or haptic'), 'multimodal critical-information guard missing');
assert(effectSource.includes("id: 'NORMAL_ATTACK'") && effectSource.includes("hapticHook: 'H0_NONE'"), 'normal attack H0 direction missing');
assert(effectSource.includes("id: 'PICKUP'") && /PICKUP[\s\S]*hapticHook: 'H0_NONE'/.test(effectSource), 'normal pickup H0 direction missing');
assert(/LEVEL_UP[\s\S]*H2_LIGHT_MEDIUM_CURRENT_DIRECTION/.test(effectSource), 'LevelUp H2 direction missing');
assert(/WEAPON_EVOLUTION[\s\S]*H3_STRONG_CURRENT_DIRECTION/.test(effectSource), 'Evolution H3 direction missing');
assert(/KOKUYOU[\s\S]*H3_STRONG_CURRENT_DIRECTION/.test(effectSource), 'Kokuyou H3 direction missing');
assert(/DAWN[\s\S]*H4_SPECIAL_CURRENT_DIRECTION/.test(effectSource), 'Dawn H4 direction missing');
assert(/BOSS_ENTRY[\s\S]*NO_DEFAULT_UNTIL_DEVICE_REVIEW/.test(effectSource), 'Boss entry device-review haptic boundary missing');
assert(/CRITICAL[\s\S]*NO_DEFAULT_UNTIL_DEVICE_REVIEW/.test(effectSource), 'Critical haptic must remain device-review gated');
assert(/TOUMON[\s\S]*AI-generated final Toumon geometry/.test(effectSource), 'Toumon final-geometry hold missing from VFX source');
assert(/DAWN[\s\S]*NO WHITEOUT/.test(effectSource), 'Dawn no-whiteout rule missing');
assert(/BOSS_DEATH[\s\S]*not explosion/.test(effectSource), 'Boss death unbinding/not-explosion audio direction missing');
assert(/PICKUP[\s\S]*never default coin sound/.test(effectSource), 'Pickup no-coin-sound direction missing');
assert(effectSource.includes("import { GLOW_ALPHA_MAX } from '../ui/visualDesign.ts'"), 'VFX source must reference existing glow cap instead of inventing a parallel value');
assert(/export const GLOW_ALPHA_MAX = 0\.35/.test(visualDesignSource), 'existing glow alpha cap drifted from 0.35');
assert(/Normal hitへ毎回強hapticを付けない/.test(audioHapticSource), 'audio/haptic Current normal-hit boundary missing');
assert(/H4 special[\s\S]*Dawn \/ major completion/.test(audioHapticSource), 'audio/haptic Current Dawn H4 boundary missing');
assert(/音だけでdangerを伝えない/.test(audioHapticSource) && /Hapticだけでcritical informationを伝えない/.test(audioHapticSource), 'accessibility multimodal source boundary missing');

const expectedUiIds = [
  'CHARACTER', 'WEAPON', 'ITEM', 'ENEMY', 'BOSS', 'STAGE', 'ACHIEVEMENT', 'REWARD', 'COLLECTION',
  'ROUTE_STAMP', 'TICKET_PUNCH', 'TOUMON', 'WARNING', 'LOCKED', 'UNLOCKED', 'NEW', 'RARE', 'CLEAR', 'DAWN', 'BLACK_INK',
];
assert(uiSymbolSharedSourceEntries.length === expectedUiIds.length, `UI symbol count drift: ${uiSymbolSharedSourceEntries.length}/${expectedUiIds.length}`);
assert(JSON.stringify(uiSymbolSharedSourceEntries.map((entry) => entry.id)) === JSON.stringify(expectedUiIds), 'UI symbol ID/order drift');
assert(new Set(uiSymbolSharedSourceEntries.map((entry) => entry.id)).size === expectedUiIds.length, 'duplicate UI symbol id');
assert(JSON.stringify(UI_ICON_MASTER_SIZES) === JSON.stringify([16, 24, 32, 48, 64, 96]), 'UI master size matrix drift');
assert(UI_ICON_SIZE_RULES.length === UI_ICON_MASTER_SIZES.length, 'UI size rule coverage drift');

for (const entry of uiSymbolSharedSourceEntries) {
  assert(entry.referenceGenerationReady === false, `${entry.id}: unapproved UI geometry promoted to generation-ready`);
  assert(entry.runtimeReady === false, `${entry.id}: UI Shared Source inferred runtime-ready`);
  assert(entry.artworkReady === false && entry.artworkState === 'NOT_GENERATED', `${entry.id}: UI artwork inferred`);
  assert(/native/i.test(entry.nativeTextRule), `${entry.id}: native-text rule missing`);
  assert(/color/i.test(entry.accessibilityRule), `${entry.id}: non-color-only accessibility guard missing`);
  assert(entry.avoid.some((rule) => /baked readable text/i.test(rule)), `${entry.id}: baked-text guard missing`);
  assert(entry.avoid.some((rule) => /neon cyan\/purple/i.test(rule)), `${entry.id}: generic AI palette guard missing`);
}

for (const sizeRule of UI_ICON_SIZE_RULES) {
  assert(sizeRule.semanticBudget.length > 20 && sizeRule.detailRule.length > 25, `${sizeRule.size}px: size rule too weak`);
  assert(/native|accessible/i.test(sizeRule.labelRule), `${sizeRule.size}px: separate label/accessibility rule missing`);
}

const character = uiSymbolSharedSourceById.get('CHARACTER');
assert(character && /Hana\/Kaname/i.test(character.smallScaleRule), 'Character icon must preserve Hana/Kaname body identity at small scale');
const toumon = uiSymbolSharedSourceById.get('TOUMON');
assert(toumon?.authority === 'FINAL_VECTOR_PENDING' && /FINAL VECTOR PENDING/.test(toumon.shapeRule), 'Toumon UI final-vector hold missing');
const warning = uiSymbolSharedSourceById.get('WARNING');
assert(warning?.authority === 'WORLD_AUTHORITY_PENDING', 'Warning icon authority must remain pending');
const routeStamp = uiSymbolSharedSourceById.get('ROUTE_STAMP');
const ticketPunch = uiSymbolSharedSourceById.get('TICKET_PUNCH');
assert(routeStamp?.authority === 'WORLD_AUTHORITY_PENDING', 'Route stamp exact geometry promoted');
assert(ticketPunch?.authority === 'WORLD_AUTHORITY_PENDING', 'Ticket punch exact geometry promoted');
const dawn = uiSymbolSharedSourceById.get('DAWN');
assert(dawn?.authority === 'FINAL_VECTOR_PENDING' && /open arc/.test(dawn.shapeRule), 'Dawn UI must preserve world abstract grammar while final vector stays pending');
const clear = uiSymbolSharedSourceById.get('CLEAR');
assert(clear?.authority === 'CANDIDATE_SEMANTIC_GRAMMAR' && /distinct from the DAWN/.test(clear.shapeRule), 'Clear and Dawn semantic icons collapsed together');
const blackInk = uiSymbolSharedSourceById.get('BLACK_INK');
assert(blackInk?.avoid.some((rule) => /skull/i.test(rule)), 'Black Ink skull/demon shorthand guard missing');

console.log(
  `Shared Source VFX UI Language: PASS (` +
    `effects=${expectedEffectIds.length}, uiSymbols=${uiSymbolSharedSourceEntries.length}, ` +
    `sizes=${UI_ICON_MASTER_SIZES.join('/')}, runtimeReady=false, finalGeometry=hold)`,
);
