import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { isAbsolute, normalize, sep } from 'node:path';

import { CHARACTER_AUTHOR_DB_IDENTITIES } from '../../src/game/data/characterAuthorDbCoverageManifest.ts';
import { characterAppearanceGenerationContracts } from '../../src/game/data/characterAppearanceGenerationContracts.ts';
import {
  CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY,
  CHARACTER_HANDEDNESS_EQUIPMENT_RULES,
} from '../../src/game/data/characterHandednessEquipmentRegistry.ts';
import {
  buildVisualAssetCoverage,
  buildVisualAssetRegistry,
  buildVisualCharacterPromptPackets,
  buildVisualImageProductionList,
  buildVisualGenerationBatches,
} from '../../src/game/data/visualAssetGenerationInventory.ts';

const REGISTRY_PATH = 'data/character-assets/manifests/visual-asset-master-registry.v1.json';
const COVERAGE_PATH = 'data/character-assets/manifests/visual-asset-coverage.v1.json';
const BATCHES_PATH = 'data/character-assets/manifests/visual-generation-batches.v1.json';
const CHARACTER_PROMPT_PACKETS_PATH = 'data/character-assets/manifests/visual-character-prompt-packets.v1.json';
const IMAGE_PRODUCTION_LIST_PATH = 'data/character-assets/manifests/visual-image-production-list.v1.json';
const YUI_REJECT_QA_PATH = 'data/character-assets/reviews/yui-full-body-master-v2.qa.json';
const YUI_REJECT_LEDGER_PATH = 'data/character-assets/reviews/yui-full-body-master-v2.rejects.json';
const YUI_PACK_PROMPT_PATH = 'data/character-assets/reviews/yui-character-design-master-pack-v1.json';
const ASSET_TEMPLATE_PATH = 'data/character-assets/templates/visual-asset-record.template.json';
const PROMPT_TEMPLATE_PATH = 'data/character-assets/templates/visual-prompt-packet.template.json';
const QA_TEMPLATE_PATH = 'data/character-assets/templates/visual-qa-record.template.json';
const YUI_SHEET01_QA_PATH = 'data/character-assets/reviews/yui-character-design-sheet-01-v1.qa.json';
const YUI_SHEET01_REJECTS_PATH = 'data/character-assets/reviews/yui-character-design-sheet-01-v1.rejects.json';

type JsonObject = Record<string, unknown>;

const errors: string[] = [];
const fail = (message: string) => errors.push(message);
const isObject = (value: unknown): value is JsonObject => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const strings = (value: unknown): string[] => Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : [];

function readJson(path: string): JsonObject {
  if (!existsSync(path)) {
    fail(`missing required file: ${path}`);
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
    if (!isObject(parsed)) throw new Error('root must be an object');
    return parsed;
  } catch (error) {
    fail(`invalid JSON: ${path}: ${String(error)}`);
    return {};
  }
}

function requireNonEmptyString(owner: JsonObject, field: string, label: string): string {
  const value = owner[field];
  if (typeof value !== 'string' || !value.trim()) {
    fail(`${label}.${field} must be a non-empty string`);
    return '';
  }
  return value;
}

function requireStringArray(owner: JsonObject, field: string, label: string): string[] {
  const value = owner[field];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    fail(`${label}.${field} must be an array of non-empty strings`);
    return [];
  }
  return value as string[];
}

function isSafeRepoPath(path: string): boolean {
  if (!path || isAbsolute(path)) return false;
  const normalized = normalize(path);
  return normalized !== '..' && !normalized.startsWith(`..${sep}`);
}

const registry = readJson(REGISTRY_PATH);
const coverage = readJson(COVERAGE_PATH);
const batchesManifest = readJson(BATCHES_PATH);
const promptPacketsManifest = readJson(CHARACTER_PROMPT_PACKETS_PATH);
const imageProductionList = readJson(IMAGE_PRODUCTION_LIST_PATH);
const yuiRejectQa = readJson(YUI_REJECT_QA_PATH);
const yuiRejectLedger = readJson(YUI_REJECT_LEDGER_PATH);
const yuiPackPrompt = readJson(YUI_PACK_PROMPT_PATH);
const assetTemplate = readJson(ASSET_TEMPLATE_PATH);
const promptTemplate = readJson(PROMPT_TEMPLATE_PATH);
const qaTemplate = readJson(QA_TEMPLATE_PATH);
const yuiSheet01Qa = readJson(YUI_SHEET01_QA_PATH);
const yuiSheet01Rejects = readJson(YUI_SHEET01_REJECTS_PATH);

function requireGeneratedSnapshot(actual: JsonObject, expected: unknown, path: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${path} is stale or hand-edited; run pnpm visual-assets:inventory:export`);
  }
}

requireGeneratedSnapshot(registry, buildVisualAssetRegistry(), REGISTRY_PATH);
requireGeneratedSnapshot(coverage, buildVisualAssetCoverage(), COVERAGE_PATH);
requireGeneratedSnapshot(batchesManifest, buildVisualGenerationBatches(), BATCHES_PATH);
requireGeneratedSnapshot(promptPacketsManifest, buildVisualCharacterPromptPackets(), CHARACTER_PROMPT_PACKETS_PATH);
requireGeneratedSnapshot(imageProductionList, buildVisualImageProductionList(), IMAGE_PRODUCTION_LIST_PATH);

if (registry.schemaVersion !== 1) fail('registry.schemaVersion must be 1');
if (coverage.schemaVersion !== 1) fail('coverage.schemaVersion must be 1');
if (batchesManifest.schemaVersion !== 1) fail('batches.schemaVersion must be 1');
if (promptPacketsManifest.schemaVersion !== 1) fail('promptPackets.schemaVersion must be 1');
if (imageProductionList.schemaVersion !== 1) fail('imageProductionList.schemaVersion must be 1');
if (assetTemplate.kind !== 'character-design-master-pack' || !isObject(assetTemplate.masterPack)) fail('visual asset template must model one logical Character Design Master Pack');
if (promptTemplate.sheetRole !== 'identity-turnaround' || !isObject(promptTemplate.dependencyGate)) fail('visual prompt template must model the Turnaround dependency gate');
if (qaTemplate.sheetRole !== 'identity-turnaround' || !isObject(qaTemplate.hashes)) fail('visual QA template must be sheet-scoped and hash-aware');
requireNonEmptyString(registry, 'registryId', 'registry');
requireNonEmptyString(coverage, 'registryId', 'coverage');
requireNonEmptyString(batchesManifest, 'registryId', 'batches');
requireNonEmptyString(promptPacketsManifest, 'registryId', 'promptPackets');
requireNonEmptyString(imageProductionList, 'listId', 'imageProductionList');
if (!isObject(registry.authorityModel)) fail('registry.authorityModel must be an object');

const canonicalCharacterIds = new Set(CHARACTER_AUTHOR_DB_IDENTITIES.map((entry) => entry.authorId));
if (canonicalCharacterIds.size !== 36) fail(`Character Author DB must expose 36 unique authorIds; got ${canonicalCharacterIds.size}`);

const handednessEntries = CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY;
const handednessByAuthorId = new Map(handednessEntries.map((entry) => [entry.authorId, entry]));
if (handednessEntries.length !== canonicalCharacterIds.size || handednessByAuthorId.size !== canonicalCharacterIds.size) {
  fail(`handedness/equipment registry must cover exactly 36 unique Author DB characters; got ${handednessEntries.length}/${handednessByAuthorId.size}`);
}
for (const authorId of canonicalCharacterIds) if (!handednessByAuthorId.has(authorId)) fail(`handedness/equipment registry missing Author DB character: ${authorId}`);
if (CHARACTER_HANDEDNESS_EQUIPMENT_RULES.heldItemHandMayNotInferDominantHand !== true) fail('held item hand may never infer dominant hand');
if (CHARACTER_HANDEDNESS_EQUIPMENT_RULES.asymmetricAssetMayNotBeMirroredWithoutCorrection !== true) fail('asymmetric asset mirror correction guard must remain active');
for (const entry of handednessEntries) {
  if (entry.dominantHand.value !== null || entry.dominantHand.status !== 'OPEN_NO_SOURCE') fail(`${entry.authorId}: dominant hand must remain OPEN_NO_SOURCE until sourced`);
  if (entry.mirrorPolicy !== 'NO_UNCORRECTED_MIRROR_FOR_ASYMMETRIC_ASSETS') fail(`${entry.authorId}: invalid mirror policy`);
}
const yuiHandedness = handednessByAuthorId.get('yui');
if (!yuiHandedness) fail('Yui handedness/equipment entry missing');
else {
  const placements = new Map(yuiHandedness.equipmentPlacements.map((entry) => [entry.itemId, entry]));
  if (placements.get('yui-lantern')?.bodySide !== 'BODY_RIGHT' || placements.get('yui-lantern')?.anchor !== 'HAND') fail('Yui lantern must remain in body-right hand');
  if (placements.get('yui-bag-strap')?.fromBodySide !== 'BODY_RIGHT' || placements.get('yui-bag-strap')?.toBodySide !== 'BODY_LEFT') fail('Yui bag strap must remain body-right shoulder to body-left hip');
  if (placements.get('yui-bag')?.bodySide !== 'BODY_LEFT' || placements.get('yui-bag')?.anchor !== 'HIP') fail('Yui bag must remain at body-left hip');
  if (placements.get('yui-paper')?.bodySide !== 'BODY_LEFT' || placements.get('yui-paper')?.anchor !== 'HAND') fail('Yui paper must remain in body-left hand');
}

// Stable profile/runtime IDs and the historical F01..F15 appearance IDs are aliases,
// never replacement authorities for the Author DB IDs.
const aliases = new Map<string, string>();
for (const identity of CHARACTER_AUTHOR_DB_IDENTITIES) {
  aliases.set(identity.authorId, identity.authorId);
  aliases.set(identity.stableProfileId, identity.authorId);
}
for (const appearance of characterAppearanceGenerationContracts) {
  const identity = CHARACTER_AUTHOR_DB_IDENTITIES.find((entry) => entry.name === appearance.displayName);
  if (!identity) {
    fail(`appearance contract cannot resolve to Character Author DB: ${appearance.id}/${appearance.displayName}`);
    continue;
  }
  const existing = aliases.get(appearance.id);
  if (existing && existing !== identity.authorId) fail(`ambiguous built-in character alias: ${appearance.id}`);
  aliases.set(appearance.id, identity.authorId);
}

function registerDeclaredAlias(alias: string, canonical: string, label: string): void {
  if (!alias.trim() || !canonical.trim()) return fail(`${label} must contain non-empty alias and canonical IDs`);
  if (!canonicalCharacterIds.has(canonical)) return fail(`${label} targets unknown Character Author DB authorId: ${canonical}`);
  const existing = aliases.get(alias);
  if (existing && existing !== canonical) return fail(`${label} conflicts with existing alias resolution: ${alias} -> ${existing}/${canonical}`);
  aliases.set(alias, canonical);
}

if (registry.subjectAliases === undefined) {
  fail('registry.subjectAliases is required (use an empty object in the generic foundation state)');
} else {
  if (isObject(registry.subjectAliases)) {
    for (const [alias, target] of Object.entries(registry.subjectAliases)) {
      if (typeof target === 'string') registerDeclaredAlias(alias, target, `registry.subjectAliases.${alias}`);
      else if (Array.isArray(target) && target.every((item) => typeof item === 'string')) {
        // Also accept canonical -> aliases for a human-editable manifest.
        if (!canonicalCharacterIds.has(alias)) fail(`registry.subjectAliases.${alias} canonical key is unknown`);
        for (const value of target) registerDeclaredAlias(value, alias, `registry.subjectAliases.${alias}`);
      } else fail(`registry.subjectAliases.${alias} must be a canonical ID or alias array`);
    }
  } else if (Array.isArray(registry.subjectAliases)) {
    for (const [index, raw] of registry.subjectAliases.entries()) {
      if (!isObject(raw)) {
        fail(`registry.subjectAliases[${index}] must be an object`);
        continue;
      }
      registerDeclaredAlias(
        requireNonEmptyString(raw, 'alias', `registry.subjectAliases[${index}]`),
        requireNonEmptyString(raw, 'subjectId', `registry.subjectAliases[${index}]`),
        `registry.subjectAliases[${index}]`,
      );
    }
  } else fail('registry.subjectAliases must be an object or array when present');
}

const allowedLayers = new Set(['master', 'lorebook', 'gameplay']);
const allowedAuthorityStatuses = new Set(['CANON', 'CURRENT', 'USER_DIRECTION', 'CANDIDATE', 'AUTHOR_RESERVOIR', 'RESEARCH', 'OPEN', 'Future15']);
const allowedReviewStatuses = new Set(['needs-authoring', 'needs-generation', 'generated-unreviewed', 'needs-author-review', 'needs-boundary-review', 'approved-candidate', 'approved-current', 'superseded', 'archived']);
const sourceCatalog = isObject(registry.sourceCatalog) ? registry.sourceCatalog : {};
const rawAssets = registry.assets;
if (!Array.isArray(rawAssets)) fail('registry.assets must be an array');
const assets = Array.isArray(rawAssets) ? rawAssets.filter(isObject) : [];
if (Array.isArray(rawAssets) && assets.length !== rawAssets.length) fail('every registry.assets entry must be an object');

const assetsById = new Map<string, JsonObject>();
const rejectedAssetIds = new Set<string>();
for (const [index, asset] of assets.entries()) {
  const label = `registry.assets[${index}]`;
  const id = requireNonEmptyString(asset, 'id', label);
  if (id && !/^[a-z0-9]+(?:-[a-z0-9]+)*-v[1-9][0-9]*$/.test(id)) fail(`${label}.id must end in a positive -vN version: ${id}`);
  if (assetsById.has(id)) fail(`duplicate asset id: ${id}`);
  else if (id) assetsById.set(id, asset);

  const subjectId = requireNonEmptyString(asset, 'subjectId', label);
  const subjectType = requireNonEmptyString(asset, 'subjectType', label);
  requireNonEmptyString(asset, 'title', label);
  const layer = requireNonEmptyString(asset, 'layer', label);
  const kind = requireNonEmptyString(asset, 'kind', label);
  const authorityStatus = requireNonEmptyString(asset, 'authorityStatus', label);
  const reviewStatus = requireNonEmptyString(asset, 'reviewStatus', label);
  if (!allowedLayers.has(layer)) fail(`${id}: invalid layer: ${layer}`);
  if (!allowedAuthorityStatuses.has(authorityStatus)) fail(`${id}: invalid authorityStatus: ${authorityStatus}`);
  if (!allowedReviewStatuses.has(reviewStatus)) fail(`${id}: invalid reviewStatus: ${reviewStatus}`);
  if (subjectType === 'character' && !aliases.has(subjectId)) fail(`${id}: unknown character subjectId/alias: ${subjectId}`);
  if (typeof asset.current !== 'boolean') fail(`${id}: current must be boolean`);

  const parents = requireStringArray(asset, 'derivedFrom', label);
  const sources = requireStringArray(asset, 'sourceOfTruth', label);
  requireStringArray(asset, 'usageTargets', label);
  requireStringArray(asset, 'tags', label);
  if (sources.length === 0) fail(`${id}: sourceOfTruth must not be empty`);
  for (const source of sources) {
    if (!(source in sourceCatalog) && !(isSafeRepoPath(source) && existsSync(source))) {
      fail(`${id}: sourceOfTruth does not resolve through sourceCatalog or a repository file: ${source}`);
    }
  }
  if (typeof asset.notes !== 'string') fail(`${id}: notes must be a string`);

  if (!Array.isArray(asset.files)) fail(`${id}: files must be an array`);
  const files = Array.isArray(asset.files) ? asset.files : [];
  if (!['needs-authoring', 'needs-generation'].includes(reviewStatus) && files.length === 0) fail(`${id}: ${reviewStatus} asset must register at least one file`);
  const fileRoles = new Set<string>();
  for (const [fileIndex, rawFile] of files.entries()) {
    if (!isObject(rawFile)) {
      fail(`${id}.files[${fileIndex}] must be an object`);
      continue;
    }
    const role = requireNonEmptyString(rawFile, 'role', `${id}.files[${fileIndex}]`);
    const path = requireNonEmptyString(rawFile, 'path', `${id}.files[${fileIndex}]`);
    if (fileRoles.has(role)) fail(`${id}: duplicate file role: ${role}`);
    fileRoles.add(role);
    if (!isSafeRepoPath(path)) fail(`${id}: file path must be repository-relative: ${path}`);
    else if (!existsSync(path)) fail(`${id}: registered file is missing: ${path}`);
  }

  if (!isObject(asset.replacementPolicy)) fail(`${id}: replacementPolicy must be an object`);
  else {
    if (typeof asset.replacementPolicy.canReplace !== 'boolean') fail(`${id}: replacementPolicy.canReplace must be boolean`);
    for (const field of ['replaces', 'supersededBy']) {
      const value = asset.replacementPolicy[field];
      if (value !== null && typeof value !== 'string') fail(`${id}: replacementPolicy.${field} must be an asset ID or null`);
    }
  }

  if (kind === 'character-design-master-pack') {
    const pack = isObject(asset.masterPack) ? asset.masterPack : {};
    const roles = requireStringArray(pack, 'requiredSheetRoles', `${id}.masterPack`);
    const sheetIds = requireStringArray(pack, 'requiredSheetIds', `${id}.masterPack`);
    const requiredRoles = ['identity-turnaround', 'face-expression-acting', 'costume-equipment-material', 'silhouette-motion-derivation'];
    if (JSON.stringify(roles) !== JSON.stringify(requiredRoles) || new Set(roles).size !== 4) fail(`${id}: Pack must declare four unique required sheet roles`);
    if (sheetIds.length !== 4 || new Set(sheetIds).size !== 4) fail(`${id}: Pack must declare four unique source sheet IDs`);
    if (pack.packId !== id || pack.packVersion !== 1 || !/^[a-f0-9]{64}$/.test(String(pack.packHash))) fail(`${id}: Pack identity/version/hash invalid`);
    if (pack.approvalState !== 'partial-not-approved' || pack.mayParentDerivatives !== false || pack.packHumanApproved !== false || pack.allSheetsHumanApproved !== false || pack.crossSheetConsistencyApproved !== false) fail(`${id}: partial Pack may not parent derivatives`);
    if (asset.current !== false || reviewStatus !== 'needs-authoring') fail(`${id}: unapproved Pack may not be current`);
  }

  if (authorityStatus === 'CANDIDATE' && (reviewStatus === 'approved-current' || asset.current === true)) {
    fail(`${id}: CANDIDATE authority may not be promoted to approved-current/current by visual review`);
  }
  if (reviewStatus === 'approved-current' && asset.current !== true) fail(`${id}: approved-current requires current=true`);
  if (asset.current === true && reviewStatus !== 'approved-current') fail(`${id}: current=true requires approved-current reviewStatus`);
  if (reviewStatus === 'superseded' && asset.current === true) fail(`${id}: superseded asset cannot be current`);
  if (reviewStatus === 'archived' || strings(asset.tags).includes('rejected')) rejectedAssetIds.add(id);

  // A missing/template derivative may reserve its parent later. Once generated,
  // every read-model/gameplay asset must point directly to one or more masters.
  if (layer !== 'master' && reviewStatus !== 'needs-generation' && parents.length === 0) {
    fail(`${id}: generated ${layer} derivative must have a master parent`);
  }
  if (layer === 'master' && parents.length > 0) fail(`${id}: master must keep derivedFrom empty`);
  void kind;
}

for (const [id, asset] of assetsById) {
  const layer = String(asset.layer);
  for (const parentId of strings(asset.derivedFrom)) {
    if (rejectedAssetIds.has(parentId)) fail(`${id}: rejected/archived asset may not be a parent: ${parentId}`);
    const parent = assetsById.get(parentId);
    if (!parent) {
      fail(`${id}: missing parent asset: ${parentId}`);
      continue;
    }
    const parentLayer = String(parent.layer);
    if (layer === 'master' && parentLayer !== 'master') fail(`${id}: master may not derive from ${parentLayer}`);
    if ((layer === 'lorebook' || layer === 'gameplay') && parentLayer !== 'master') {
      fail(`${id}: ${layer} must derive directly from master, not ${parentLayer}`);
    }
  }
  const replacement = isObject(asset.replacementPolicy) ? asset.replacementPolicy : {};
  const replaces = typeof replacement.replaces === 'string' ? replacement.replaces : null;
  const supersededBy = typeof replacement.supersededBy === 'string' ? replacement.supersededBy : null;
  if (replaces === id || supersededBy === id) fail(`${id}: replacement link cannot reference itself`);
  if (replaces) {
    const old = assetsById.get(replaces);
    if (!old) fail(`${id}: replaces missing asset: ${replaces}`);
    else if (!isObject(old.replacementPolicy) || old.replacementPolicy.supersededBy !== id) fail(`${id}/${replaces}: replacement links must be bidirectional`);
    if (replacement.canReplace !== true) fail(`${id}: replacementPolicy.canReplace must be true when replaces is set`);
  }
  if (supersededBy) {
    const newer = assetsById.get(supersededBy);
    if (!newer) fail(`${id}: supersededBy missing asset: ${supersededBy}`);
    else if (!isObject(newer.replacementPolicy) || newer.replacementPolicy.replaces !== id) fail(`${id}/${supersededBy}: replacement links must be bidirectional`);
  }
}

const registryHandedness = isObject(registry.handednessEquipmentRegistry) ? registry.handednessEquipmentRegistry : {};
if (registryHandedness.source !== 'character-handedness-equipment') fail('central registry must expose the handedness/equipment source');
if (JSON.stringify(registryHandedness.rules) !== JSON.stringify(CHARACTER_HANDEDNESS_EQUIPMENT_RULES)) fail('central registry handedness/equipment rules are stale');
if (JSON.stringify(registryHandedness.entries) !== JSON.stringify(CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY)) fail('central registry handedness/equipment entries are stale');

const yuiQaCandidates = Array.isArray(yuiRejectQa.candidates) ? yuiRejectQa.candidates.filter(isObject) : [];
const yuiRejectedFiles = new Set(strings(yuiRejectLedger.files));
if (yuiRejectLedger.decision !== 'REJECT_ALL' || yuiRejectLedger.selectedCandidateId !== null) fail('Yui v2 reject ledger must remain REJECT_ALL with no selected candidate');
if (yuiRejectLedger.storyAuthorityPromoted !== false || yuiRejectLedger.approvedAsFinal !== false || yuiRejectLedger.runtimeApproved !== false) fail('Yui v2 rejects may not promote Story/final/runtime authority');
if (yuiQaCandidates.length !== 4 || yuiRejectedFiles.size !== 4) fail('Yui v2 reject attempt must preserve exactly four candidates');
for (const candidate of yuiQaCandidates) {
  const candidateId = requireNonEmptyString(candidate, 'id', 'yuiRejectQa.candidate');
  const path = requireNonEmptyString(candidate, 'file', candidateId);
  const expectedHash = requireNonEmptyString(candidate, 'sha256', candidateId);
  const asset = assetsById.get(candidateId);
  if (!asset) {
    fail(`${candidateId}: rejected Yui candidate missing from central registry`);
    continue;
  }
  if (!yuiRejectedFiles.has(path)) fail(`${candidateId}: rejected file missing from reject ledger`);
  if (asset.reviewStatus !== 'archived' || asset.current !== false || asset.kind !== 'character-full-body-master-rejected-candidate') fail(`${candidateId}: rejected candidate must remain archived/non-current`);
  if (JSON.stringify(asset.usageTargets) !== JSON.stringify(['prompt-learning-only'])) fail(`${candidateId}: rejected candidate is learning-only`);
  const approval = isObject(asset.approvalBoundary) ? asset.approvalBoundary : {};
  if (approval.approvedForReference !== false || approval.approvedAsFinal !== false || approval.approvedForRuntime !== false || approval.storyAuthorityPromoted !== false) fail(`${candidateId}: rejected approval boundary must remain all false`);
  const rejection = isObject(asset.rejection) ? asset.rejection : {};
  if (rejection.mayBeParent !== false || rejection.mayBeGoldenReference !== false || rejection.selectedCandidateId !== null) fail(`${candidateId}: rejected candidate may not be parent/reference/selected`);
  if (existsSync(path)) {
    const actualHash = createHash('sha256').update(readFileSync(path)).digest('hex');
    if (actualHash !== expectedHash) fail(`${candidateId}: output hash differs from QA record`);
  }
}

if (yuiPackPrompt.packetId !== 'visual-prompt:yui:identity-turnaround:v1' || yuiPackPrompt.packId !== 'char-yui-design-master-pack-v1') fail('Yui Pack/Sheet 01 prompt identity drifted');
if (yuiPackPrompt.sheetId !== 'char-yui-design-sheet-01-identity-turnaround-v1' || yuiPackPrompt.sheetRole !== 'identity-turnaround') fail('Yui prompt must target Sheet 01 Identity / Turnaround only');
if (yuiPackPrompt.status !== 'FOUR_CANDIDATES_GENERATED_REJECTED_NOT_APPROVED') fail('Yui Sheet 01 attempt must remain generated/rejected/unapproved');
const yuiAuthority = isObject(yuiPackPrompt.authoritySnapshot) ? yuiPackPrompt.authoritySnapshot : {};
const yuiDominantHand = isObject(yuiAuthority.dominantHand) ? yuiAuthority.dominantHand : {};
if (yuiDominantHand.value !== null || yuiDominantHand.status !== 'OPEN_NO_SOURCE') fail('Yui dominant hand must remain OPEN_NO_SOURCE');
if (yuiAuthority.heldItemHandMayNotInferDominantHand !== true || yuiAuthority.storyAuthorityPromotedByImage !== false) fail('Yui prompt lost handedness/Story authority boundary');
if (yuiAuthority.approvedAsFinal !== false || yuiAuthority.runtimeApproved !== false) fail('Yui prompt may not pre-approve final/runtime');
const authoritySources = Array.isArray(yuiAuthority.sources) ? yuiAuthority.sources.filter(isObject) : [];
if (authoritySources.length < 5) fail('Yui prompt requires structured upstream authority snapshots');
for (const source of authoritySources) {
  const sourceId = requireNonEmptyString(source, 'sourceId', 'yuiAuthority.source');
  const path = requireNonEmptyString(source, 'path', `yuiAuthority.source:${sourceId}`);
  const expectedHash = requireNonEmptyString(source, 'contentHash', `yuiAuthority.source:${sourceId}`);
  requireNonEmptyString(source, 'authorityClass', `yuiAuthority.source:${sourceId}`);
  if (requireStringArray(source, 'consumedFields', `yuiAuthority.source:${sourceId}`).length === 0) fail(`${sourceId}: consumedFields required`);
  if (!isSafeRepoPath(path) || !existsSync(path)) fail(`${sourceId}: authority source missing`);
  else if (createHash('sha256').update(readFileSync(path)).digest('hex') !== expectedHash) fail(`${sourceId}: authority content hash drifted`);
}
const yuiPromptBody = isObject(yuiPackPrompt.prompt) ? yuiPackPrompt.prompt : {};
const promptHash = createHash('sha256').update(JSON.stringify(yuiPromptBody)).digest('hex');
if (yuiPackPrompt.promptHash !== promptHash) fail('Yui Sheet 01 promptHash mismatch');
const continuity = requireStringArray(yuiPromptBody, 'equipmentContinuity', 'yuiPackPrompt.prompt');
for (const phrase of ['OPEN_NO_SOURCE', 'anatomical RIGHT hand', 'anatomical RIGHT shoulder', 'anatomical LEFT waist', 'anatomical LEFT hand', 'back view', 'never mirror']) {
  if (!continuity.some((line) => line.includes(phrase))) fail(`Yui Sheet 01 equipment lock missing: ${phrase}`);
}
const identityAnchors = requireStringArray(yuiPromptBody, 'identityAnchors', 'yuiPackPrompt.prompt');
for (const phrase of ['YOUNG_ADULT', 'soft oval face', 'rounded cheeks', 'non-pointed chin', 'smaller almost-level almond-round brown eyes', 'tapered double eyelids', 'soft straight brows', 'warm-dark asymmetric bob with one ear tuck', 'bilateral smile dimples mandatory']) {
  if (!identityAnchors.some((line) => line.includes(phrase))) fail(`Yui identity anchor missing: ${phrase}`);
}
const yuiPlan = isObject(yuiPackPrompt.candidatePlan) ? yuiPackPrompt.candidatePlan : {};
const yuiCandidateIds = requireStringArray(yuiPlan, 'candidateIds', 'yuiPackPrompt.candidatePlan');
if (yuiPlan.count !== 4 || yuiPlan.sameContractAndPrompt !== true || yuiCandidateIds.length !== 4 || new Set(yuiCandidateIds).size !== 4) fail('Yui Sheet 01 must reserve exactly four same-contract candidates');
const dependencyGate = isObject(yuiPackPrompt.dependencyGate) ? yuiPackPrompt.dependencyGate : {};
if (dependencyGate.turnaroundHumanApproval !== 'PENDING' || dependencyGate.sheet02GenerationAllowed !== false || dependencyGate.sheet03GenerationAllowed !== false || dependencyGate.sheet04GenerationAllowed !== false || dependencyGate.partialPackMayParentDerivatives !== false) fail('Yui dependent-sheet/partial-pack gate drifted');
const yuiApproval = isObject(yuiPackPrompt.approval) ? yuiPackPrompt.approval : {};
if (yuiApproval.automaticQaRequired !== true || yuiApproval.sheetHumanReviewRequired !== true || yuiApproval.crossSheetConsistencyReviewRequired !== true || yuiApproval.packHumanReviewRequired !== true || yuiApproval.approvedAsFinal !== false || yuiApproval.runtimeApproved !== false) fail('Yui Pack review boundary must remain fail-closed');
const yuiReferences = Array.isArray(yuiPackPrompt.references) ? yuiPackPrompt.references.filter(isObject) : [];
if (yuiReferences.length !== 2) fail('Yui prompt must preserve exactly two identity/runtime references');
for (const reference of yuiReferences) {
  const path = requireNonEmptyString(reference, 'path', 'yuiPackPrompt.reference');
  const expectedHash = requireNonEmptyString(reference, 'sha256', `yuiPackPrompt.reference:${path}`);
  if (!isSafeRepoPath(path) || !existsSync(path)) fail(`Yui prompt reference missing: ${path}`);
  else if (createHash('sha256').update(readFileSync(path)).digest('hex') !== expectedHash) fail(`Yui prompt reference hash drifted: ${path}`);
}
const yuiSheetCandidates = Array.isArray(yuiSheet01Qa.candidates) ? yuiSheet01Qa.candidates.filter(isObject) : [];
const yuiSheetRejectedFiles = new Set(strings(yuiSheet01Rejects.files));
if (yuiSheet01Rejects.decision !== 'REJECT_ALL' || yuiSheet01Rejects.selectedCandidateId !== null || yuiSheet01Rejects.humanDecisionProvided !== false) fail('Yui Sheet 01 reject ledger must remain REJECT_ALL without Human selection');
if (yuiSheet01Rejects.mayBeParent !== false || yuiSheet01Rejects.mayBeGoldenReference !== false || yuiSheet01Rejects.storyAuthorityPromoted !== false || yuiSheet01Rejects.approvedAsFinal !== false || yuiSheet01Rejects.runtimeApproved !== false || yuiSheet01Rejects.dependentSheetsRemainBlocked !== true) fail('Yui Sheet 01 rejects lost fail-closed boundaries');
const yuiPackLineage = isObject(yuiPackPrompt.lineage) ? yuiPackPrompt.lineage : {};
if (yuiPackLineage.generator !== yuiSheet01Qa.generator || yuiPackLineage.generatorVersion !== yuiSheet01Qa.generatorVersion || yuiPackLineage.seed !== yuiSheet01Qa.seed) fail('Yui Sheet 01 generator lineage drifted from QA record');
if (yuiSheetCandidates.length !== 4 || yuiSheetRejectedFiles.size !== 4) fail('Yui Sheet 01 attempt must preserve four rejected candidates');
for (const candidate of yuiSheetCandidates) {
  const candidateId = requireNonEmptyString(candidate, 'id', 'yuiSheet01Qa.candidate');
  const path = requireNonEmptyString(candidate, 'file', candidateId);
  const expectedHash = requireNonEmptyString(candidate, 'sha256', candidateId);
  const asset = assetsById.get(candidateId);
  if (!asset || asset.reviewStatus !== 'archived' || asset.kind !== 'character-design-source-sheet-rejected-candidate') fail(`${candidateId}: rejected Sheet 01 asset registration invalid`);
  if (!yuiSheetRejectedFiles.has(path) || !existsSync(path)) fail(`${candidateId}: rejected Sheet 01 file missing`);
  else if (createHash('sha256').update(readFileSync(path)).digest('hex') !== expectedHash) fail(`${candidateId}: rejected Sheet 01 hash mismatch`);
}

function checkCycles(label: string, edges: (asset: JsonObject) => string[]): void {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string) => {
    if (visiting.has(id)) return fail(`${label} cycle detected at ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    const asset = assetsById.get(id);
    if (asset) for (const next of edges(asset)) if (assetsById.has(next)) visit(next);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of assetsById.keys()) visit(id);
}
checkCycles('derivedFrom', (asset) => strings(asset.derivedFrom));
checkCycles('replacement', (asset) => {
  const policy = isObject(asset.replacementPolicy) ? asset.replacementPolicy : {};
  return typeof policy.supersededBy === 'string' ? [policy.supersededBy] : [];
});

const currentKeys = new Set<string>();
for (const [id, asset] of assetsById) {
  if (asset.current !== true) continue;
  const subject = String(asset.subjectType) === 'character' ? aliases.get(String(asset.subjectId)) ?? String(asset.subjectId) : String(asset.subjectId);
  const key = `${asset.subjectType}:${subject}:${asset.kind}`;
  if (currentKeys.has(key)) fail(`duplicate current asset for ${key}`);
  currentKeys.add(key);
  void id;
}

if (!isObject(coverage.requirements)) fail('coverage.requirements must be an object');
const requirements = isObject(coverage.requirements) ? coverage.requirements : {};
const requiredGroups = ['characterMaster', 'groupMaster', 'starBeastMaster', 'objectMaster', 'lorebook', 'gameplay'];
const knownSlots = new Set<string>();
for (const group of requiredGroups) {
  const slots = requireStringArray(requirements, group, 'coverage.requirements');
  if (slots.length === 0) fail(`coverage.requirements.${group} must not be empty`);
  for (const slot of slots) {
    if (knownSlots.has(slot)) fail(`coverage slot name must be globally unique: ${slot}`);
    knownSlots.add(slot);
  }
}
const allowedSlotStates = new Set(['missing', 'candidate', 'current', 'superseded']);
if (!Array.isArray(coverage.characters)) fail('coverage.characters must be an array');
const coverageRows = Array.isArray(coverage.characters) ? coverage.characters : [];
// An empty list is the explicit foundation/template state. Once inventory work
// starts, partial roster snapshots are forbidden because they look complete while
// silently dropping characters.
if (coverageRows.length !== 0 && coverageRows.length !== canonicalCharacterIds.size) {
  fail(`coverage.characters must be empty for foundation state or contain all 36 Author DB characters; got ${coverageRows.length}`);
}
const coverageSubjects = new Set<string>();
for (const [index, raw] of coverageRows.entries()) {
  if (!isObject(raw)) {
    fail(`coverage.characters[${index}] must be an object`);
    continue;
  }
  const label = `coverage.characters[${index}]`;
  const subjectId = requireNonEmptyString(raw, 'subjectId', label);
  const canonical = aliases.get(subjectId);
  if (!canonical) fail(`${label}: unknown Character Author DB subjectId/alias: ${subjectId}`);
  else if (coverageSubjects.has(canonical)) fail(`duplicate coverage character after alias resolution: ${canonical}`);
  else coverageSubjects.add(canonical);
  requireNonEmptyString(raw, 'displayName', label);
  requireNonEmptyString(raw, 'priority', label);
  requireNonEmptyString(raw, 'reviewStatus', label);
  if (typeof raw.notes !== 'string') fail(`${label}.notes must be a string`);
  const sourceBindings = isObject(raw.sourceBindings) ? raw.sourceBindings : {};
  const handednessBinding = isObject(sourceBindings.handednessEquipment) ? sourceBindings.handednessEquipment : {};
  const expectedHandedness = canonical ? handednessByAuthorId.get(canonical) : undefined;
  if (!expectedHandedness || JSON.stringify(handednessBinding) !== JSON.stringify({
    id: expectedHandedness.id,
    dominantHand: expectedHandedness.dominantHand,
    equipmentPlacements: expectedHandedness.equipmentPlacements,
    mirrorPolicy: expectedHandedness.mirrorPolicy,
    frontViewProjection: expectedHandedness.frontViewProjection,
  })) fail(`${label}: handedness/equipment coverage binding is missing or stale`);
  if (!isObject(raw.statusBySlot)) {
    fail(`${label}.statusBySlot must be an object`);
    continue;
  }
  for (const [slot, state] of Object.entries(raw.statusBySlot)) {
    if (!knownSlots.has(slot)) fail(`${label}: unknown coverage slot: ${slot}`);
    if (typeof state !== 'string' || !allowedSlotStates.has(state)) fail(`${label}.${slot}: invalid slot state: ${String(state)}`);
  }
  for (const slot of knownSlots) {
    if (!(slot in raw.statusBySlot)) fail(`${label}: missing required coverage slot: ${slot}`);
  }
}
if (coverageRows.length > 0 && coverageSubjects.size !== canonicalCharacterIds.size) {
  fail(`coverage.characters must resolve to exactly 36 unique Author DB characters; got ${coverageSubjects.size}`);
}

if (!isObject(batchesManifest.executionPolicy)) fail('batches.executionPolicy must be an object');
else {
  if (batchesManifest.executionPolicy.automaticExecutionAllowed !== false) fail('batch generation must remain opt-in');
  if (batchesManifest.executionPolicy.exactCandidateCount !== 4) fail('batch candidate comparison count must remain exactly 4');
  if (batchesManifest.executionPolicy.humanReviewRequiredForCurrent !== true) fail('current promotion must require human review');
}

if (!isObject(batchesManifest.groupBindings)) fail('batches.groupBindings must be an object');
else {
  const sakuyaza = isObject(batchesManifest.groupBindings.sakuyaza) ? batchesManifest.groupBindings.sakuyaza : {};
  const gunjo = isObject(batchesManifest.groupBindings.gunjoZankyoroku) ? batchesManifest.groupBindings.gunjoZankyoroku : {};
  if (sakuyaza.formalName !== '朔夜座' || sakuyaza.memberCount !== 8) fail('朔夜座 must remain the formal S1 eight-member group');
  if (sakuyaza.isConstellationArchiveClassification !== false) fail('外典星座/constellation classification may not replace 朔夜座');
  if (gunjo.formalName !== '群青残響録' || gunjo.fixedFaction !== false) fail('群青残響録 must remain a record taxonomy, not an organization');
}

const rawBatches = batchesManifest.batches;
if (!Array.isArray(rawBatches)) fail('batches.batches must be an array');
const batches = Array.isArray(rawBatches) ? rawBatches.filter(isObject) : [];
if (batches.length !== 14) fail(`generation plan must contain Batch 01-14 exactly; got ${batches.length}`);
const batchIds = new Set<string>();
for (const [index, batch] of batches.entries()) {
  const label = `batches.batches[${index}]`;
  const batchId = requireNonEmptyString(batch, 'batchId', label);
  if (batchIds.has(batchId)) fail(`duplicate batch id: ${batchId}`);
  batchIds.add(batchId);
  if (batch.status !== 'planned-not-started') fail(`${batchId}: pre-generation batch must remain planned-not-started`);
  if (batch.generationAllowed !== false) fail(`${batchId}: image generation must remain stopped`);
  if (batch.exactCandidateCountPerAsset !== 4) fail(`${batchId}: must reserve exactly four candidates per asset`);
  const layer = requireNonEmptyString(batch, 'layer', label);
  if (!allowedLayers.has(layer)) fail(`${batchId}: invalid batch layer: ${layer}`);
  const sources = requireStringArray(batch, 'subjectSource', label);
  for (const source of sources) if (!(source in sourceCatalog)) fail(`${batchId}: unknown subject source: ${source}`);
  for (const pathField of ['outputRoot', 'qaRecordPath', 'rejectLedgerPath']) {
    const path = requireNonEmptyString(batch, pathField, label);
    if (!isSafeRepoPath(path)) fail(`${batchId}: ${pathField} must be repository-relative`);
  }
}
for (const batch of batches) {
  const batchId = String(batch.batchId);
  for (const dependency of requireStringArray(batch, 'dependsOn', batchId)) {
    if (!batchIds.has(dependency)) fail(`${batchId}: missing batch dependency: ${dependency}`);
    if (dependency === batchId) fail(`${batchId}: batch may not depend on itself`);
  }
}

if (promptPacketsManifest.executionAllowed !== false) fail('character prompt packets must remain generation-disabled');
if (promptPacketsManifest.status !== 'DRAFT_NOT_APPROVED_NOT_GENERATED') fail('character prompt packet status may not imply generation or approval');
const rawPromptPackets = promptPacketsManifest.packets;
if (!Array.isArray(rawPromptPackets)) fail('promptPackets.packets must be an array');
const promptPackets = Array.isArray(rawPromptPackets) ? rawPromptPackets.filter(isObject) : [];
if (promptPackets.length !== canonicalCharacterIds.size) fail(`prompt packets must cover exactly 36 Author DB characters; got ${promptPackets.length}`);
const packetSubjectIds = new Set<string>();
for (const [index, packet] of promptPackets.entries()) {
  const label = `promptPackets.packets[${index}]`;
  const packetId = requireNonEmptyString(packet, 'packetId', label);
  const assetId = requireNonEmptyString(packet, 'assetId', label);
  if (packet.status !== 'draft-not-approved-not-generated') fail(`${packetId}: invalid pre-generation status`);
  if (!assetsById.has(assetId)) fail(`${packetId}: reserved asset is missing from registry: ${assetId}`);
  const subject = isObject(packet.subject) ? packet.subject : {};
  const authorId = requireNonEmptyString(subject, 'authorId', `${packetId}.subject`);
  if (!canonicalCharacterIds.has(authorId)) fail(`${packetId}: unknown Author DB subject: ${authorId}`);
  if (packetSubjectIds.has(authorId)) fail(`duplicate prompt packet subject: ${authorId}`);
  packetSubjectIds.add(authorId);
  const authority = isObject(packet.authoritySnapshot) ? packet.authoritySnapshot : {};
  const sources = requireStringArray(authority, 'sourceOfTruth', `${packetId}.authoritySnapshot`);
  if (sources.length < 7) fail(`${packetId}: incomplete authority source stack`);
  for (const source of sources) if (!(source in sourceCatalog)) fail(`${packetId}: unknown authority source: ${source}`);
  for (const requiredSource of ['character-handedness-equipment', 'character-living-visual-roster', 'visual-design-production-master']) {
    if (!sources.includes(requiredSource)) fail(`${packetId}: missing current Visual authority source: ${requiredSource}`);
  }
  const snapshots = Array.isArray(authority.sources) ? authority.sources.filter(isObject) : [];
  if (snapshots.length !== sources.length) fail(`${packetId}: every authority source requires a structured snapshot`);
  for (const snapshot of snapshots) {
    const sourceId = requireNonEmptyString(snapshot, 'sourceId', `${packetId}.authoritySource`);
    const path = requireNonEmptyString(snapshot, 'path', `${packetId}.authoritySource:${sourceId}`);
    const hash = requireNonEmptyString(snapshot, 'contentHash', `${packetId}.authoritySource:${sourceId}`);
    requireNonEmptyString(snapshot, 'authorityClass', `${packetId}.authoritySource:${sourceId}`);
    if (requireStringArray(snapshot, 'consumedFields', `${packetId}.authoritySource:${sourceId}`).length === 0) fail(`${packetId}:${sourceId}: consumedFields required`);
    if (!sources.includes(sourceId) || !isSafeRepoPath(path) || !existsSync(path)) fail(`${packetId}:${sourceId}: authority snapshot path invalid`);
    else if (createHash('sha256').update(readFileSync(path)).digest('hex') !== hash) fail(`${packetId}:${sourceId}: authority snapshot hash mismatch`);
  }
  const continuity = isObject(packet.handednessEquipmentContinuity) ? packet.handednessEquipmentContinuity : {};
  const expectedContinuity = handednessByAuthorId.get(authorId);
  if (!expectedContinuity || JSON.stringify(continuity) !== JSON.stringify({
    dominantHand: expectedContinuity.dominantHand,
    heldItemHandMayNotInferDominantHand: true,
    placements: expectedContinuity.equipmentPlacements,
    mirrorPolicy: expectedContinuity.mirrorPolicy,
    frontViewProjection: expectedContinuity.frontViewProjection,
  })) fail(`${packetId}: handedness/equipment prompt continuity is missing or stale`);
  const plan = isObject(packet.candidatePlan) ? packet.candidatePlan : {};
  if (plan.scope !== 'per-source-sheet' || plan.countPerSheet !== 4 || plan.sameContractAndPromptWithinSheet !== true || plan.packItselfIsNotGenerated !== true) fail(`${packetId}: must reserve four comparable candidates per source sheet without generating the logical Pack`);
  const approval = isObject(packet.approval) ? packet.approval : {};
  if (approval.approvedAsFinal !== false || approval.runtimeApproved !== false || approval.humanVisualReviewRequired !== true) {
    fail(`${packetId}: approval must remain fail-closed before generation`);
  }
  const packPlan = isObject(packet.packPlan) ? packet.packPlan : {};
  const requiredSheets = Array.isArray(packPlan.requiredSheets) ? packPlan.requiredSheets.filter(isObject) : [];
  const roles = requiredSheets.map((sheet) => String(sheet.role));
  if (requiredSheets.length !== 4 || new Set(roles).size !== 4 || packPlan.dependentSheetsBlockedUntilTurnaroundHumanApproval !== true || packPlan.overviewIsDeterministicReadModel !== true) fail(`${packetId}: invalid Character Design Master Pack plan`);
}
if (packetSubjectIds.size !== canonicalCharacterIds.size) fail(`prompt packets must resolve to 36 unique Author DB subjects; got ${packetSubjectIds.size}`);

if (imageProductionList.executionAllowed !== false || imageProductionList.currentMode !== 'PRE_GENERATION_NO_IMAGE_OUTPUT') {
  fail('image production list must remain pre-generation and execution-disabled');
}
const rawProductionItems = imageProductionList.items;
if (!Array.isArray(rawProductionItems)) fail('imageProductionList.items must be an array');
const productionItems = Array.isArray(rawProductionItems) ? rawProductionItems.filter(isObject) : [];
const productionIds = new Set<string>();
const productionById = new Map<string, JsonObject>();
for (const [index, item] of productionItems.entries()) {
  const label = `imageProductionList.items[${index}]`;
  const assetId = requireNonEmptyString(item, 'assetId', label);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*-v[1-9][0-9]*$/.test(assetId)) fail(`${assetId}: invalid production asset ID`);
  if (productionIds.has(assetId)) fail(`duplicate production asset ID: ${assetId}`);
  productionIds.add(assetId);
  productionById.set(assetId, item);
  const batchId = requireNonEmptyString(item, 'batchId', label);
  if (!batchIds.has(batchId)) fail(`${assetId}: unknown production batch: ${batchId}`);
  const layer = requireNonEmptyString(item, 'layer', label);
  if (!allowedLayers.has(layer)) fail(`${assetId}: invalid production layer: ${layer}`);
  const expectedReviewStatus = item.recordType === 'master-pack' ? 'needs-authoring' : item.recordType === 'overview-read-model' ? 'not-materialized' : 'needs-generation';
  if (item.reviewStatus !== expectedReviewStatus) fail(`${assetId}: invalid pre-output reviewStatus; expected ${expectedReviewStatus}`);
  const status = requireNonEmptyString(item, 'productionStatus', label);
  if (!['blocked-authoring-required', 'ready-for-prompt-review', 'blocked-parent-master', 'blocked-human-approval', 'blocked-turnaround-human-approval', 'blocked-parent-pack'].includes(status)) fail(`${assetId}: invalid production status: ${status}`);
  const candidates = requireStringArray(item, 'candidateIds', label);
  const isLogicalRecord = item.recordType === 'master-pack' || item.recordType === 'overview-read-model';
  if (isLogicalRecord ? candidates.length !== 0 : candidates.length !== 4 || new Set(candidates).size !== 4) fail(`${assetId}: image rows require four candidates; logical Pack/Overview rows require none`);
  for (const candidateId of candidates) if (!/^[a-z0-9]+(?:-[a-z0-9]+)*-v[1-9][0-9]*$/.test(candidateId)) fail(`${assetId}: invalid candidate ID: ${candidateId}`);
  const outputPath = requireNonEmptyString(item, 'outputPath', label);
  if (!isSafeRepoPath(outputPath)) fail(`${assetId}: outputPath must be repository-relative`);
  const sources = requireStringArray(item, 'sourceOfTruth', label);
  if (sources.length === 0) fail(`${assetId}: sourceOfTruth must not be empty`);
  for (const source of sources) if (!(source in sourceCatalog)) fail(`${assetId}: unknown production source: ${source}`);
  if ((item.subjectType === 'character' && item.layer === 'master') && !sources.includes('character-handedness-equipment')) fail(`${assetId}: Character Master Pack/source sheet must bind handedness/equipment authority`);
  const checklist = requireStringArray(item, 'qaChecklist', label);
  if (checklist.length === 0) fail(`${assetId}: QA checklist must not be empty`);
  requireNonEmptyString(item, 'blocker', label);
  if (typeof item.notes !== 'string') fail(`${assetId}: notes must be a string`);
  const parents = requireStringArray(item, 'parentAssetIds', label);
  if (parents.length > 0) fail(`${assetId}: unapproved/partial Pack may not be an active parent; use an empty actual parent plus plannedParentPackIds`);
  if (item.recordType === 'source-sheet') {
    const snapshots = Array.isArray(item.authoritySnapshots) ? item.authoritySnapshots.filter(isObject) : [];
    if (snapshots.length !== sources.length) fail(`${assetId}: source sheet authority snapshot count mismatch`);
  }
}
for (const [assetId, item] of productionById) {
  if (item.kind === 'character-design-master-pack' && !assetsById.has(assetId)) fail(`${assetId}: logical Pack reservation missing from central registry`);
  if (item.recordType === 'master-pack') {
    const roles = strings(item.requiredSheetRoles);
    const sheetIds = strings(item.requiredSheetIds);
    if (roles.length !== 4 || new Set(roles).size !== 4 || sheetIds.length !== 4 || new Set(sheetIds).size !== 4) fail(`${assetId}: Pack must bind four unique roles/sheets`);
    const expectedPackHash = createHash('sha256').update(JSON.stringify({ assetId, packVersion: item.packVersion, sheetIds })).digest('hex');
    if (item.packVersion !== 1 || item.packHash !== expectedPackHash || item.replaces !== null || item.supersededBy !== null) fail(`${assetId}: Pack version/hash/replacement linkage invalid`);
    for (const sheetId of sheetIds) {
      const sheet = productionById.get(sheetId);
      if (!sheet || sheet.recordType !== 'source-sheet' || sheet.parentPackId !== assetId || sheet.subjectId !== item.subjectId) fail(`${assetId}: invalid source sheet evidence ${sheetId}`);
    }
  }
  if (item.recordType === 'overview-read-model' && (item.layer === 'master' || item.kind !== 'character-design-master-overview-read-model')) fail(`${assetId}: Overview is a read model only, never a Master`);
  if (item.recordType === 'source-sheet' && item.subjectId === 'yui') {
    if (item.sheetRole === 'identity-turnaround' && item.productionStatus !== 'blocked-authoring-required') fail('Yui Sheet 01 attempt 01 is rejected and requires versioned re-authoring');
    if (item.sheetRole !== 'identity-turnaround' && item.productionStatus !== 'blocked-turnaround-human-approval') fail(`${assetId}: Yui Sheet 02–04 must wait for Turnaround Human approval`);
  }
  if (item.recordType === 'overview-read-model' || item.layer === 'lorebook' || item.layer === 'gameplay') {
    const parent = isObject(item.derivationParent) ? item.derivationParent : {};
    if (parent.parentPackId !== null || parent.parentPackHash !== null || strings(parent.usedSheetIds).length !== 0) fail(`${assetId}: partial Pack cannot populate derivative parent fields`);
    const planned = strings(parent.plannedParentPackIds);
    if (planned.length === 0) fail(`${assetId}: blocked derivative requires plannedParentPackIds`);
    for (const plannedId of planned) {
      const pack = productionById.get(plannedId);
      if (!pack || pack.recordType !== 'master-pack') fail(`${assetId}: planned derivative parent must be a logical Pack: ${plannedId}`);
    }
  }
  const promptPacketId = typeof item.promptPacketId === 'string' ? item.promptPacketId : null;
  if (item.productionStatus === 'ready-for-prompt-review' && !promptPacketId && item.recordType === 'source-sheet') fail(`${assetId}: ready source sheet needs a prompt packet`);
}
const yuiTurnaroundProduction = productionById.get('char-yui-design-sheet-01-identity-turnaround-v1');
if (!yuiTurnaroundProduction) fail('Yui Sheet 01 production reservation missing');
else {
  if (yuiTurnaroundProduction.promptPacketId !== yuiPackPrompt.packetId) fail('Yui Sheet 01 reservation is not linked to its prompt packet');
  if (JSON.stringify(yuiTurnaroundProduction.candidateIds) !== JSON.stringify(yuiCandidateIds)) fail('Yui Sheet 01 candidate IDs differ from the prompt packet');
  if (!strings(yuiTurnaroundProduction.sourceOfTruth).includes('yui-character-design-master-pack-v1')) fail('Yui Sheet 01 must bind its versioned prompt');
}

const counts = isObject(imageProductionList.counts) ? imageProductionList.counts : {};
if (counts.totalItems !== productionItems.length) fail('image production list totalItems does not match items length');
if (productionItems.length !== 486) fail(`production plan must contain exactly 486 rows; got ${productionItems.length}`);
const characterMasterItems = productionItems.filter((item) => item.recordType === 'master-pack');
const characterSourceSheetItems = productionItems.filter((item) => item.recordType === 'source-sheet');
const characterOverviewItems = productionItems.filter((item) => item.recordType === 'overview-read-model');
const sakuyazaItems = productionItems.filter((item) => item.kind === 'sakuyaza-character-master');
if (characterMasterItems.length !== 36) fail(`production plan must contain 36 logical Character Design Master Packs; got ${characterMasterItems.length}`);
if (characterSourceSheetItems.length !== 144) fail(`production plan must contain 144 source-sheet evidence rows; got ${characterSourceSheetItems.length}`);
if (characterOverviewItems.length !== 36) fail(`production plan must contain 36 deterministic Overview read models; got ${characterOverviewItems.length}`);
if (sakuyazaItems.length !== 8) fail(`image production list must contain 8 朔夜座 Masters; got ${sakuyazaItems.length}`);
if (productionItems.filter((item) => item.kind === 'star-beast-master').length !== 21) fail('image production list must contain 21 Star Beast Masters');
if (productionItems.filter((item) => item.kind === 'named-object-master').length !== 21) fail('image production list must contain 21 named-object Masters');
if (productionItems.filter((item) => item.layer === 'lorebook' && item.recordType !== 'overview-read-model').length !== 148) fail('production plan must contain 148 Lorebook derivative rows');
if (productionItems.filter((item) => item.layer === 'gameplay').length !== 72) fail('image production list must contain 72 Gameplay rows');

if (errors.length > 0) {
  console.error('Visual Asset Master Registry check failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Visual Asset Master Registry: PASS (assets=${assetsById.size}, imageList=${productionItems.length}, coverageRows=${coverageRows.length}, promptPackets=${promptPackets.length}, batches=${batches.length}, authorIds=${canonicalCharacterIds.size}, source snapshots synchronized, objective structural guards only)`,
);
