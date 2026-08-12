import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, normalize, sep } from 'node:path';

import { CHARACTER_AUTHOR_DB_IDENTITIES } from '../../src/game/data/characterAuthorDbCoverageManifest.ts';
import { characterAppearanceGenerationContracts } from '../../src/game/data/characterAppearanceGenerationContracts.ts';

const REGISTRY_PATH = 'data/character-assets/manifests/visual-asset-master-registry.v1.json';
const COVERAGE_PATH = 'data/character-assets/manifests/visual-asset-coverage.v1.json';

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

if (registry.schemaVersion !== 1) fail('registry.schemaVersion must be 1');
if (coverage.schemaVersion !== 1) fail('coverage.schemaVersion must be 1');
requireNonEmptyString(registry, 'registryId', 'registry');
requireNonEmptyString(coverage, 'registryId', 'coverage');
if (!isObject(registry.authorityModel)) fail('registry.authorityModel must be an object');

const canonicalCharacterIds = new Set(CHARACTER_AUTHOR_DB_IDENTITIES.map((entry) => entry.authorId));
if (canonicalCharacterIds.size !== 36) fail(`Character Author DB must expose 36 unique authorIds; got ${canonicalCharacterIds.size}`);

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

if (errors.length > 0) {
  console.error('Visual Asset Master Registry check failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Visual Asset Master Registry: PASS (assets=${assetsById.size}, coverageRows=${coverageRows.length}, authorIds=${canonicalCharacterIds.size}, objective structural guards only)`,
);
