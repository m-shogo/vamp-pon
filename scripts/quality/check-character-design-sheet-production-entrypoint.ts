import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT, CHARACTER_DESIGN_SHEET_ROLES } from '../../src/game/data/characterDesignSheetProductionEntrypoint.ts';

const root = process.cwd();
const bridgePath = CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.bridgePolicy;
const parentPolicyPath = CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.parentPolicy;
const adapterPath = CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.exporter;
const parentEntrypointSource = 'src/game/data/characterReferenceProductionEntrypoint.ts';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[character-design-sheet-entrypoint] ${message}`);
}

function declaredRequiredFlagGroups(policy: Record<string, unknown>): Array<[string, Record<string, unknown>]> {
  return Object.entries(policy).filter(([key, value]) => (
    key.endsWith('RequiredFlags')
    && value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
  )) as Array<[string, Record<string, unknown>]>;
}

const bridge = JSON.parse(readFileSync(resolve(root, bridgePath), 'utf8'));
const parentPolicy = JSON.parse(readFileSync(resolve(root, parentPolicyPath), 'utf8'));
const requiredFlagGroups = declaredRequiredFlagGroups(parentPolicy);

if (bridge.schemaVersion !== 3) fail(`bridge schemaVersion must be 3, got ${bridge.schemaVersion}`);
if (bridge.status !== 'ACTIVE_LATEST_MAIN_SHEET_ADAPTER_NO_IMAGE_GENERATION') fail(`bridge status invalid: ${bridge.status}`);
if (bridge.parentProductionEntrypointSource !== parentEntrypointSource) fail('parent production entrypoint source drift');
if (bridge.parentExporterResolution !== 'LIVE_FROM_CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT') fail('parent exporter must resolve live from Character Reference Production Entrypoint');
if (bridge.parentPolicyResolution !== 'LIVE_FROM_CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT') fail('parent policy must resolve live from Character Reference Production Entrypoint');
if (bridge.sheetAdapter !== adapterPath) fail('sheet adapter code/bridge mismatch');
if (bridge.directLegacyPacketProductionAllowed !== false) fail('legacy packet production bypass enabled');
if (bridge.handWrittenSheetPromptProductionAllowed !== false) fail('hand-written sheet prompt bypass enabled');
if (bridge.generatedSheetMayCreateCanon !== false) fail('generated sheet canon guard weakened');
if (bridge.humanReviewRequired !== true) fail('Human review gate weakened');
if (bridge.validationGate?.imageGenerationAuthorizedByThisBridge !== false) fail('bridge may not authorize image generation');
if (bridge.validationGate?.parentExporterMustResolveLive !== true) fail('live parent exporter validation gate missing');
if (bridge.validationGate?.allParentRequiredAuthorityPathsMustPass !== true) fail('parent authority path validation gate weakened');
if (bridge.validationGate?.allParentDeclaredRequiredFlagGroupsMustPass !== true) fail('dynamic parent required-flag-group validation gate missing');
if (bridge.roster?.totalCharacters !== 36 || bridge.roster?.totalLogicalSheetSlots !== 144) fail('bridge roster/sheet slot count drift');
if (bridge.roster?.activeLiveAdapterSheetPrompts !== 140 || bridge.roster?.heldSheetSlots !== 4) fail('bridge active/held sheet counts drift');

if (parentPolicy.productionExporter !== CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.parentExporter) {
  fail(`code/policy parent exporter drift: code=${CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.parentExporter}, policy=${parentPolicy.productionExporter}`);
}
if (parentPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || parentPolicy.scopeCount !== 36) fail('parent production policy top-level scope/status drift');
if (requiredFlagGroups.length < 1) fail('parent policy declares no *RequiredFlags groups');

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  if (!Array.isArray(json.characters)) fail(`${path}: characters missing`);
  for (const character of json.characters) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique production IDs, got ${ids.length}/${new Set(ids).size}`);

const heldIds = new Set<string>(bridge.hold?.characterIds ?? []);
if (heldIds.size !== 1 || !heldIds.has('yui')) fail(`expected only Yui hold, got ${[...heldIds].join(', ')}`);

const expectedSheetNumbers = Object.keys(CHARACTER_DESIGN_SHEET_ROLES).sort();
let activeSheetPromptCount = 0;
let heldSheetSlotCount = 0;

for (const id of ids) {
  if (heldIds.has(id)) {
    const inspected = execFileSync(process.execPath, [
      '--experimental-strip-types', resolve(root, adapterPath),
      '--character', id,
      '--sheet', 'all',
      '--inspection',
    ], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    const blocked = JSON.parse(inspected);
    if (blocked.productionReady !== false || blocked.state !== 'BLOCKED_BY_EXPLICIT_CHARACTER_HOLD') fail(`${id}: inspection did not preserve HOLD`);
    if (blocked.imageGenerationAuthorized !== false || blocked.holdMustNotBeBypassedByAdapter !== true) fail(`${id}: HOLD generation guard weakened`);
    if (blocked.parentProductionEntrypointSource !== parentEntrypointSource) fail(`${id}: held inspection parent entrypoint source drift`);
    if (blocked.parentProductionExporter !== CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.parentExporter) fail(`${id}: held inspection did not resolve current parent exporter`);
    if ('prompt' in blocked) fail(`${id}: held inspection payload must not emit a production prompt`);

    const direct = spawnSync(process.execPath, [
      '--experimental-strip-types', resolve(root, adapterPath),
      '--character', id,
      '--sheet', '01',
    ], { cwd: root, encoding: 'utf8' });
    if (direct.status === 0) fail(`${id}: direct production adapter invocation must fail while HOLD is active`);
    if (!`${direct.stderr}\n${direct.stdout}`.includes('explicit HOLD')) fail(`${id}: direct HOLD failure reason missing`);
    heldSheetSlotCount += 4;
    continue;
  }

  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, adapterPath),
    '--character', id,
    '--sheet', 'all',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.productionReady !== true) fail(`${id}: adapter aggregate is not production-ready for candidate prompt export`);
  if (exported.parentProductionEntrypointSource !== parentEntrypointSource) fail(`${id}: parent entrypoint source drift`);
  if (exported.parentProductionExporter !== CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.parentExporter) fail(`${id}: parent exporter drift`);
  if (exported.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);

  const sheetNumbers = Object.keys(exported.sheets ?? {}).sort();
  if (JSON.stringify(sheetNumbers) !== JSON.stringify(expectedSheetNumbers)) fail(`${id}: expected Sheet 01-04, got ${sheetNumbers.join(', ')}`);

  for (const sheetNumber of expectedSheetNumbers) {
    const sheet = exported.sheets[sheetNumber];
    const expectedRole = CHARACTER_DESIGN_SHEET_ROLES[sheetNumber as keyof typeof CHARACTER_DESIGN_SHEET_ROLES];
    if (sheet.sheetRole !== expectedRole) fail(`${id}/${sheetNumber}: role mismatch`);
    if (sheet.characterDesignSheetAdapterEntrypoint !== true) fail(`${id}/${sheetNumber}: adapter flag missing`);
    if (sheet.parentProductionEntrypointSource !== parentEntrypointSource) fail(`${id}/${sheetNumber}: live parent entrypoint source missing`);
    if (sheet.parentProductionExporter !== CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.parentExporter) fail(`${id}/${sheetNumber}: live parent exporter not preserved`);
    if (sheet.productionImageGenerationEntrypoint !== true || sheet.productionCharacterPromptReady !== true || sheet.productionPromptAuthorityLocked !== true) fail(`${id}/${sheetNumber}: parent production flags missing`);
    if (sheet.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION') fail(`${id}/${sheetNumber}: parent readiness not READY`);
    if (Array.isArray(sheet.imageGenerationReadinessFailures) && sheet.imageGenerationReadinessFailures.length > 0) fail(`${id}/${sheetNumber}: readiness failures present`);
    if (sheet.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}/${sheetNumber}: generated output state drift`);
    if (sheet.directLegacyPromptPacketProductionAllowed !== false || sheet.handWrittenSheetPromptProductionAllowed !== false) fail(`${id}/${sheetNumber}: prompt bypass guard weakened`);
    if (sheet.sheetSpecificPromptMayCreateCanon !== false || sheet.generatedSheetMayCreateCharacterMasterApproval !== false || sheet.generatedSheetMayCreateRuntimeApproval !== false || sheet.generatedSheetMayCreateFeedbackRule !== false) fail(`${id}/${sheetNumber}: promotion/canon guard weakened`);
    if (sheet.humanReviewRequired !== true) fail(`${id}/${sheetNumber}: Human review flag missing`);
    if (!String(sheet.prompt).includes('CHARACTER PRODUCTION GENERATION ENTRYPOINT — FINAL AUTHORITY LOCK.')) fail(`${id}/${sheetNumber}: lower parent final authority block missing`);
    if (!String(sheet.prompt).includes('CHARACTER DESIGN SHEET ADAPTER — ROLE-SPECIFIC PRODUCTION CONSTRAINTS.')) fail(`${id}/${sheetNumber}: Sheet adapter block missing`);
    if (!String(sheet.prompt).includes(`Sheet ${sheetNumber}: ${expectedRole}.`)) fail(`${id}/${sheetNumber}: Sheet role prompt marker missing`);
    for (const path of parentPolicy.requiredAuthorityPaths ?? []) {
      if (!Array.isArray(sheet.authorityOrder) || !sheet.authorityOrder.includes(path)) fail(`${id}/${sheetNumber}: required parent authority missing: ${path}`);
    }
    for (const [groupName, fields] of requiredFlagGroups) {
      for (const [field, expected] of Object.entries(fields)) {
        if (sheet[field] !== expected) fail(`${id}/${sheetNumber}: inherited ${groupName}.${field} expected ${String(expected)}, got ${String(sheet[field])}`);
      }
    }
    activeSheetPromptCount += 1;
  }
}

if (activeSheetPromptCount !== CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.activeSheetPromptCount) fail(`active sheet export count expected 140, got ${activeSheetPromptCount}`);
if (heldSheetSlotCount !== CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.heldSheetPromptCount) fail(`held sheet slot count expected 4, got ${heldSheetSlotCount}`);
if (activeSheetPromptCount + heldSheetSlotCount !== 144) fail('total Sheet 01-04 slots must remain 144');

console.log(JSON.stringify({
  status: 'PASS',
  rosterCount: ids.length,
  activeCharacterCount: ids.length - heldIds.size,
  activeLiveSheetPrompts: activeSheetPromptCount,
  heldCharacterIds: [...heldIds],
  heldSheetSlots: heldSheetSlotCount,
  parentProductionEntrypointSource: parentEntrypointSource,
  parentProductionExporter: CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT.parentExporter,
  declaredRequiredFlagGroups: Object.fromEntries(requiredFlagGroups.map(([name, fields]) => [name, Object.keys(fields).length])),
  parentAuthorityPaths: (parentPolicy.requiredAuthorityPaths ?? []).length,
  adapter: adapterPath,
  generatedImageCount: 0,
}, null, 2));
