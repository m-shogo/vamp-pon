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
const YUI_V3_PROMPT_PATH = 'data/character-assets/reviews/yui-full-body-master-v3.prompt.json';

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
const yuiV3Prompt = readJson(YUI_V3_PROMPT_PATH);

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
const allowedReviewStatuses = new Set(['needs-generation', 'generated-unreviewed', 'needs-author-review', 'needs-boundary-review', 'approved-candidate', 'approved-current', 'superseded', 'archived']);
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
  if (reviewStatus !== 'needs-generation' && files.length === 0) fail(`${id}: ${reviewStatus} asset must register at least one file`);
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

if (yuiV3Prompt.packetId !== 'visual-prompt:yui:full-body-master:v3') fail('Yui v3 prompt packet ID drifted');
if (yuiV3Prompt.assetFamilyId !== 'char-yui-full-body-master-v3' || yuiV3Prompt.subjectId !== 'yui') fail('Yui v3 prompt subject/family drifted');
if (yuiV3Prompt.status !== 'AUTHORIZED_FOR_FOUR_CANDIDATE_GENERATION_NOT_APPROVED') fail('Yui v3 prompt must remain generation-authorized but unapproved');
const yuiV3Authority = isObject(yuiV3Prompt.authoritySnapshot) ? yuiV3Prompt.authoritySnapshot : {};
const yuiV3DominantHand = isObject(yuiV3Authority.dominantHand) ? yuiV3Authority.dominantHand : {};
if (yuiV3DominantHand.value !== null || yuiV3DominantHand.status !== 'OPEN_NO_SOURCE') fail('Yui v3 prompt may not infer dominant hand');
if (yuiV3Authority.heldItemHandMayNotInferDominantHand !== true || yuiV3Authority.storyAuthorityPromotedByImage !== false) fail('Yui v3 prompt lost handedness/Story authority boundary');
if (yuiV3Authority.approvedAsFinal !== false || yuiV3Authority.runtimeApproved !== false) fail('Yui v3 prompt may not pre-approve final/runtime');
const yuiV3PromptBody = isObject(yuiV3Prompt.prompt) ? yuiV3Prompt.prompt : {};
const yuiV3Continuity = requireStringArray(yuiV3PromptBody, 'equipmentContinuity', 'yuiV3Prompt.prompt');
for (const required of [
  "Yui's anatomical RIGHT hand holds the lantern.",
  "The strap begins at Yui's anatomical RIGHT shoulder, VIEWER'S LEFT in front view.",
  "The strap crosses the chest and ends at Yui's anatomical LEFT waist, VIEWER'S RIGHT in front view.",
  "The small bag rests at Yui's anatomical LEFT waist, VIEWER'S RIGHT.",
  "Yui's anatomical LEFT hand, VIEWER'S RIGHT, holds or offers the found paper.",
  'Do not mirror, swap, hand-transfer or hide these placements.',
]) if (!yuiV3Continuity.includes(required)) fail(`Yui v3 prompt missing equipment continuity: ${required}`);
const yuiV3Plan = isObject(yuiV3Prompt.candidatePlan) ? yuiV3Prompt.candidatePlan : {};
const yuiV3CandidateIds = requireStringArray(yuiV3Plan, 'candidateIds', 'yuiV3Prompt.candidatePlan');
if (yuiV3Plan.count !== 4 || yuiV3Plan.samePromptAndReferenceStack !== true || yuiV3CandidateIds.length !== 4 || new Set(yuiV3CandidateIds).size !== 4) {
  fail('Yui v3 prompt must reserve exactly four same-prompt candidates');
}
const yuiV3Approval = isObject(yuiV3Prompt.approval) ? yuiV3Prompt.approval : {};
if (yuiV3Approval.automaticQaRequired !== true || yuiV3Approval.humanVisualReviewRequired !== true || yuiV3Approval.approvedAsFinal !== false || yuiV3Approval.runtimeApproved !== false) {
  fail('Yui v3 prompt approval boundary must remain fail-closed');
}
const yuiV3References = Array.isArray(yuiV3Prompt.references) ? yuiV3Prompt.references.filter(isObject) : [];
if (yuiV3References.length !== 2) fail('Yui v3 prompt must preserve exactly two identity/runtime references');
for (const reference of yuiV3References) {
  const path = requireNonEmptyString(reference, 'path', 'yuiV3Prompt.reference');
  const expectedHash = requireNonEmptyString(reference, 'sha256', `yuiV3Prompt.reference:${path}`);
  if (!isSafeRepoPath(path) || !existsSync(path)) fail(`Yui v3 prompt reference is missing or outside the repository: ${path}`);
  else if (createHash('sha256').update(readFileSync(path)).digest('hex') !== expectedHash) fail(`Yui v3 prompt reference hash drifted: ${path}`);
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
  if (plan.count !== 4 || plan.sameContractAndPrompt !== true) fail(`${packetId}: must reserve four comparable candidates`);
  const approval = isObject(packet.approval) ? packet.approval : {};
  if (approval.approvedAsFinal !== false || approval.runtimeApproved !== false || approval.humanVisualReviewRequired !== true) {
    fail(`${packetId}: approval must remain fail-closed before generation`);
  }
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
  if (item.reviewStatus !== 'needs-generation') fail(`${assetId}: list item must remain needs-generation before output exists`);
  const status = requireNonEmptyString(item, 'productionStatus', label);
  if (!['blocked-authoring-required', 'ready-for-prompt-review', 'blocked-parent-master', 'blocked-human-approval'].includes(status)) fail(`${assetId}: invalid production status: ${status}`);
  const candidates = requireStringArray(item, 'candidateIds', label);
  if (candidates.length !== 4 || new Set(candidates).size !== 4) fail(`${assetId}: must reserve four unique candidate IDs`);
  for (const candidateId of candidates) if (!/^[a-z0-9]+(?:-[a-z0-9]+)*-v[1-9][0-9]*$/.test(candidateId)) fail(`${assetId}: invalid candidate ID: ${candidateId}`);
  const outputPath = requireNonEmptyString(item, 'outputPath', label);
  if (!isSafeRepoPath(outputPath)) fail(`${assetId}: outputPath must be repository-relative`);
  const sources = requireStringArray(item, 'sourceOfTruth', label);
  if (sources.length === 0) fail(`${assetId}: sourceOfTruth must not be empty`);
  for (const source of sources) if (!(source in sourceCatalog)) fail(`${assetId}: unknown production source: ${source}`);
  if ((item.subjectType === 'character' && item.layer === 'master') && !sources.includes('character-handedness-equipment')) fail(`${assetId}: Character Master production item must bind handedness/equipment authority`);
  const checklist = requireStringArray(item, 'qaChecklist', label);
  if (checklist.length === 0) fail(`${assetId}: QA checklist must not be empty`);
  requireNonEmptyString(item, 'blocker', label);
  if (typeof item.notes !== 'string') fail(`${assetId}: notes must be a string`);
  const parents = requireStringArray(item, 'parentAssetIds', label);
  if (layer === 'master' && parents.length > 0 && item.kind !== 'character-master') {
    fail(`${assetId}: only a Character Master composite may have Master component parents`);
  }
  if (layer !== 'master' && parents.length === 0) fail(`${assetId}: derivative must reserve direct master parents`);
}
for (const [assetId, item] of productionById) {
  for (const parentId of strings(item.parentAssetIds)) {
    if (rejectedAssetIds.has(parentId)) fail(`${assetId}: rejected/archived asset may not be a production parent: ${parentId}`);
    const parent = productionById.get(parentId);
    if (!parent) fail(`${assetId}: production parent is missing from image list: ${parentId}`);
    else if (parent.layer !== 'master') fail(`${assetId}: parent must be a master production item`);
    if (item.layer === 'master' && item.kind === 'character-master' && !String(parent?.kind).startsWith('character-')) {
      fail(`${assetId}: Character Master composite may only use Character Master component parents`);
    }
    if (item.layer === 'gameplay' && parent?.layer === 'lorebook') fail(`${assetId}: Lorebook may not parent Gameplay`);
  }
  if (item.kind === 'character-master' && !assetsById.has(assetId)) fail(`${assetId}: Character Master reservation missing from central registry`);
  if (item.kind === 'character-master') {
    const parentIds = strings(item.parentAssetIds);
    if (parentIds.length !== 9 || new Set(parentIds).size !== 9) fail(`${assetId}: Character Master composite must have exactly nine unique component parents`);
    for (const parentId of parentIds) {
      const parent = productionById.get(parentId);
      if (!parent || parent.subjectId !== item.subjectId || parent.kind === 'character-master' || !String(parent.kind).startsWith('character-')) {
        fail(`${assetId}: invalid Character Master component parent: ${parentId}`);
      }
    }
  }
  const promptPacketId = typeof item.promptPacketId === 'string' ? item.promptPacketId : null;
  if (item.productionStatus === 'ready-for-prompt-review' && !promptPacketId && item.kind === 'character-master') fail(`${assetId}: ready Character Master needs a prompt packet`);
}
const yuiV3Production = productionById.get('char-yui-full-body-master-v3');
if (!yuiV3Production) fail('Yui v3 full-body production reservation missing');
else {
  if (yuiV3Production.promptPacketId !== yuiV3Prompt.packetId) fail('Yui v3 production reservation is not linked to its prompt packet');
  if (JSON.stringify(yuiV3Production.candidateIds) !== JSON.stringify(yuiV3CandidateIds)) fail('Yui v3 production candidate IDs differ from the prompt packet');
  if (!strings(yuiV3Production.sourceOfTruth).includes('yui-full-body-master-v3-prompt')) fail('Yui v3 production reservation must bind its versioned prompt');
}

const counts = isObject(imageProductionList.counts) ? imageProductionList.counts : {};
if (counts.totalItems !== productionItems.length) fail('image production list totalItems does not match items length');
if (productionItems.length !== 624) fail(`image production list must contain exactly 624 rows; got ${productionItems.length}`);
const characterMasterItems = productionItems.filter((item) => item.kind === 'character-master');
const characterMasterComponentItems = productionItems.filter((item) => item.layer === 'master' && item.subjectType === 'character' && item.kind !== 'character-master');
const sakuyazaItems = productionItems.filter((item) => item.kind === 'sakuyaza-character-master');
if (characterMasterItems.length !== 36) fail(`image production list must contain 36 Character Masters; got ${characterMasterItems.length}`);
if (characterMasterComponentItems.length !== 324) fail(`image production list must contain 324 Character Master components; got ${characterMasterComponentItems.length}`);
if (sakuyazaItems.length !== 8) fail(`image production list must contain 8 朔夜座 Masters; got ${sakuyazaItems.length}`);
if (productionItems.filter((item) => item.kind === 'star-beast-master').length !== 21) fail('image production list must contain 21 Star Beast Masters');
if (productionItems.filter((item) => item.kind === 'named-object-master').length !== 21) fail('image production list must contain 21 named-object Masters');
if (productionItems.filter((item) => item.layer === 'lorebook').length !== 142) fail('image production list must contain 142 Lorebook rows');
if (productionItems.filter((item) => item.layer === 'gameplay').length !== 72) fail('image production list must contain 72 Gameplay rows');

if (errors.length > 0) {
  console.error('Visual Asset Master Registry check failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Visual Asset Master Registry: PASS (assets=${assetsById.size}, imageList=${productionItems.length}, coverageRows=${coverageRows.length}, promptPackets=${promptPackets.length}, batches=${batches.length}, authorIds=${canonicalCharacterIds.size}, source snapshots synchronized, objective structural guards only)`,
);
