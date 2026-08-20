import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_DESIGN_SHEET_AUTONOMOUS_PRODUCTION_ENTRYPOINT, AUTONOMOUS_CHARACTER_DESIGN_SHEET_ROLES } from '../../src/game/data/characterDesignSheetAutonomousProductionEntrypoint.ts';

const root = process.cwd();
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];
function readJson(path: string): any { return JSON.parse(readFileSync(resolve(root, path), 'utf8')); }
function fail(message: string): never { throw new Error(`[character-master-pre-generation-readiness] ${message}`); }

const entrypoint = CHARACTER_DESIGN_SHEET_AUTONOMOUS_PRODUCTION_ENTRYPOINT;
const bridge = readJson(entrypoint.bridgePolicy);
const legacyBridge = readJson(entrypoint.legacyAuditBridgePolicy);
const decisions = readJson(entrypoint.settingsDecisionLog);
const partial = readJson(entrypoint.partialEvidenceClosure);
const readiness = readJson(entrypoint.preGenerationReadiness);

if (bridge.schemaVersion !== 2 || bridge.status !== 'CURRENT_AUTONOMOUS_PRE_GENERATION_READY') fail('Current bridge identity invalid');
if (legacyBridge.humanReviewRequired !== true || legacyBridge.hold?.characterIds?.includes('yui') !== true) fail('legacy Human/Yui bridge must remain audit evidence');
if (bridge.legacyAuditBridge !== entrypoint.legacyAuditBridgePolicy) fail('legacy bridge lineage missing');
if (bridge.productionBoundary?.humanReviewRequired !== false || bridge.productionBoundary?.automaticQaRequired !== true) fail('Current review mode invalid');
if (bridge.productionBoundary?.imageGenerationAuthorizedByThisBridge !== false || bridge.productionBoundary?.imageGenerationExecutedByThisBridge !== false) fail('prompt bridge must generate zero images');
if (bridge.roster?.totalCharacters !== 36 || bridge.roster?.totalLogicalSheetSlots !== 144 || bridge.roster?.activeCharacters !== 36 || bridge.roster?.heldCharacters !== 0 || bridge.roster?.activeLiveAdapterSheetPrompts !== 144 || bridge.roster?.heldSheetSlots !== 0) fail('Current 36/144 roster boundary invalid');
if (bridge.yui?.legacyHoldSupersededForCurrentExecution !== true || bridge.yui?.previousRejectedCandidates !== 8 || bridge.yui?.previousRejectEvidenceMustBeConsumed !== true) fail('Yui Current reject-history boundary invalid');

if (decisions.status !== 'AUTHORING_COMPLETE' || decisions.materializedDecisionCount !== 42 || decisions.remainingDecisionCount !== 0) fail('42/42 Current author decisions incomplete');
if (partial.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_CLOSURE_COMPLETE' || partial.scope?.reviewedForAutonomousAuthoring !== 56 || partial.scope?.remaining !== 0) fail('56/56 partial-evidence closure incomplete');
if (readiness.status !== 'READY_FOR_IMAGE_GENERATION_WHEN_CURRENT_HEAD_CI_GREEN' || readiness.settings?.productionFacingSettingsReady !== true) fail('pre-generation readiness identity invalid');
if (readiness.characterMaster?.characterCount !== 36 || readiness.characterMaster?.logicalSheetSlots !== 144 || readiness.characterMaster?.candidateCountPerGeneratedSheet !== 4) fail('Character Master readiness counts invalid');
if (readiness.imageGeneration?.executed !== false || readiness.imageGeneration?.generatedCandidateCount !== 0 || readiness.imageGeneration?.authorizedByThisPreparationCommit !== false) fail('readiness stage must contain zero generated images');
if (readiness.logo?.ownedByThisLine !== false || readiness.logo?.excludedFromCharacterMasterPromptExport !== true) fail('logo boundary invalid');

const ids: string[] = [];
for (const path of profilePaths) {
  const profile = readJson(path);
  for (const character of profile.characters ?? []) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique character IDs, got ${ids.length}/${new Set(ids).size}`);

const expectedSheets = Object.keys(AUTONOMOUS_CHARACTER_DESIGN_SHEET_ROLES).sort();
let promptSlots = 0;
for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, entrypoint.exporter),
    '--character', id,
    '--sheet', 'all',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.productionReadyForPromptExport !== true || exported.imageGenerationExecuted !== false || exported.humanReviewRequired !== false || exported.automaticQaRequired !== true) fail(`${id}: aggregate readiness/review boundary invalid`);
  const snapshot = exported.authoritySnapshot;
  if (snapshot?.materialized !== true || snapshot?.characterId !== id || snapshot?.imageOutputMayAuthorFacts !== false) fail(`${id}: JIT authority snapshot invalid`);
  for (const key of ['decisionLogSha256','partialEvidenceClosureSha256','bridgeSha256']) if (!/^[0-9a-f]{64}$/.test(String(snapshot?.[key] ?? ''))) fail(`${id}: ${key} missing`);
  const sheetIds = Object.keys(exported.sheets ?? {}).sort();
  if (JSON.stringify(sheetIds) !== JSON.stringify(expectedSheets)) fail(`${id}: expected Sheet 01-04`);
  for (const sheetNumber of expectedSheets) {
    const sheet = exported.sheets[sheetNumber];
    const expectedRole = AUTONOMOUS_CHARACTER_DESIGN_SHEET_ROLES[sheetNumber as keyof typeof AUTONOMOUS_CHARACTER_DESIGN_SHEET_ROLES];
    if (sheet.sheetRole !== expectedRole || sheet.currentAutonomousCharacterSheetEntrypoint !== true) fail(`${id}/${sheetNumber}: Current Sheet role/entrypoint invalid`);
    if (sheet.productionReadyForPromptExport !== true || sheet.imageGenerationExecuted !== false || sheet.imageGenerationAuthorizedByPromptExport !== false) fail(`${id}/${sheetNumber}: prompt/image execution boundary invalid`);
    if (sheet.humanReviewRequired !== false || sheet.automaticQaRequired !== true || sheet.structuralHardVetoRequired !== true || sheet.semanticQaRequired !== true) fail(`${id}/${sheetNumber}: automatic QA boundary invalid`);
    if (sheet.generatedSheetMayCreateCanon !== false || sheet.generatedSheetMayCreateCharacterMasterApproval !== false || sheet.generatedSheetMayCreateRuntimeApproval !== false) fail(`${id}/${sheetNumber}: generated output authority weakened`);
    if (!String(sheet.prompt).includes('CURRENT AUTONOMOUS AUTHOR AUTHORITY — MUST BE CONSUMED BEFORE IMAGE GENERATION.')) fail(`${id}/${sheetNumber}: Current authority block missing`);
    if (!String(sheet.prompt).includes('PARTIAL-EVIDENCE CLOSURE:')) fail(`${id}/${sheetNumber}: partial-evidence boundary missing`);
    if (!String(sheet.prompt).includes(`Sheet ${sheetNumber}: ${expectedRole}`)) fail(`${id}/${sheetNumber}: role prompt marker missing`);
    promptSlots += 1;
  }
}

if (promptSlots !== 144 || promptSlots !== entrypoint.activeSheetPromptCount) fail(`expected 144 live prompt slots, got ${promptSlots}`);
const yui = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, entrypoint.exporter), '--character', 'yui', '--sheet', '01'], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const yuiSheet = JSON.parse(yui);
if (yuiSheet.productionReadyForPromptExport !== true || yuiSheet.humanReviewRequired !== false) fail('Yui must no longer be Current-HOLD blocked');

console.log(JSON.stringify({ status:'PASS', characters:36, livePromptSlots:promptSlots, settings:'42/42 + 56/56', yuiCurrentHold:false, previousYuiRejectedCandidates:8, generatedImages:0, intermediateHumanReviewRequired:false }, null, 2));
