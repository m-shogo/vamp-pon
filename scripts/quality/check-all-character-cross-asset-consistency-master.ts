import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_ASSET_PROMPT_KINDS } from '../../src/game/data/assetFactoryCharacterPrompts.ts';

const root = process.cwd();
const masterPath = 'data/visual/all-character-cross-asset-consistency-master-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-cross-asset-consistent-character-design-prompt.ts';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[all-character-cross-asset] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('master status invalid');
if (master.scopeCount !== 36) fail('scopeCount must be 36');
if (master.unknownSimplificationMayRedesignCharacter !== false) fail('simplification redesign guard weakened');
if (master.smallScaleMayInventReadabilityAccessory !== false) fail('small-scale invention guard weakened');
if (master.effectsMayRedesignCharacter !== false) fail('effect redesign guard weakened');
if (master.emblemMayCreateAppearanceCanon !== false) fail('emblem appearance guard weakened');
if (master.generatedCrossAssetDetailCreatesCanon !== false) fail('generated cross-asset canon guard weakened');
if (!Array.isArray(master.identityPreservationOrder) || master.identityPreservationOrder.length < 12) fail('identity preservation order incomplete');
if (!Array.isArray(master.crossAssetReviewGate) || master.crossAssetReviewGate.length < 10) fail('cross-asset review gate incomplete');

const expectedKinds = [...CHARACTER_ASSET_PROMPT_KINDS].sort();
const masterKinds = [...master.assetKinds].sort();
if (expectedKinds.length !== 9 || JSON.stringify(expectedKinds) !== JSON.stringify(masterKinds)) fail(`asset kind coverage mismatch: source=${expectedKinds.join(',')} master=${masterKinds.join(',')}`);
for (const kind of expectedKinds) if (!master.assetKindRules?.[kind]) fail(`asset kind rule missing: ${kind}`);

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  if (!Array.isArray(json.characters)) fail(`${path}: characters missing`);
  ids.push(...json.characters.map((x: any) => x.id));
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique production IDs, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath), '--character', id, '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.allCharacterCrossAssetConsistencyRequired !== true) fail(`${id}: cross-asset master not required`);
  if (exported.crossAssetKind !== 'character_reference') fail(`${id}: reference kind mismatch`);
  if (exported.unknownSimplificationMayRedesignCharacter !== false) fail(`${id}: simplification guard weakened`);
  if (exported.smallScaleMayInventReadabilityAccessory !== false) fail(`${id}: readability invention guard weakened`);
  if (exported.effectsMayRedesignCharacter !== false) fail(`${id}: effect redesign guard weakened`);
  if (exported.emblemMayCreateAppearanceCanon !== false) fail(`${id}: emblem canon guard weakened`);
  if (exported.generatedCrossAssetDetailCreatesCanon !== false) fail(`${id}: cross-asset generated canon guard weakened`);
  if (!exported.authorityOrder.includes('docs/visual/all-character-cross-asset-consistency-master-v1.md')) fail(`${id}: cross-asset authority missing`);
  if (!exported.prompt.includes('ALL CHARACTER CROSS-ASSET CONSISTENCY MASTER — REQUIRED TRANSFORMATION/SIMPLIFICATION AUTHORITY.')) fail(`${id}: cross-asset prompt block missing`);
}

for (const kind of CHARACTER_ASSET_PROMPT_KINDS) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath), '--character', 'yui', '--kind', kind,
  ], { cwd: root, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.crossAssetKind !== kind) fail(`yui/${kind}: cross-asset kind mismatch`);
  if (!exported.crossAssetKindRule || exported.crossAssetKindRule.mode !== master.assetKindRules[kind].mode) fail(`yui/${kind}: rule mismatch`);
  if (exported.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`yui/${kind}: candidate boundary weakened`);
}

console.log(`[all-character-cross-asset] OK: 36/36 references + ${CHARACTER_ASSET_PROMPT_KINDS.length}/9 Yui asset kinds preserve cross-asset authority`);
