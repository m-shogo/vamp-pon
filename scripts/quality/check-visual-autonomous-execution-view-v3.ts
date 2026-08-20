import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildVisualProductionExecutionView } from '../../src/game/data/visualProductionExecutionView.ts';
import {
  buildVisualAutonomousProductionExecutionView,
  VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH,
  VISUAL_AUTONOMOUS_RUNNER_STATE_PATH,
  VISUAL_AUTONOMOUS_PRODUCTION_CHECKLIST_PATH,
  VISUAL_AUTONOMOUS_CHARACTER_SHEET_ENTRYPOINT_PATH,
  VISUAL_AUTONOMOUS_CHARACTER_PREGEN_READINESS_PATH,
} from '../../src/game/data/visualAutonomousProductionExecutionView.ts';
import { buildCurrentVisualProductionExecutionView, CURRENT_VISUAL_PRODUCTION_POLICY_PATH } from '../../src/game/data/visualProductionCurrentEntrypoint.ts';

const root = process.cwd();
function fail(message: string): never { throw new Error(`[visual-autonomous-execution-view-v3] ${message}`); }

const policy = JSON.parse(readFileSync(resolve(root, VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH), 'utf8'));
const runner = JSON.parse(readFileSync(resolve(root, VISUAL_AUTONOMOUS_RUNNER_STATE_PATH), 'utf8'));
readFileSync(resolve(root, VISUAL_AUTONOMOUS_PRODUCTION_CHECKLIST_PATH), 'utf8');
const legacy = buildVisualProductionExecutionView() as any;
const current = buildVisualAutonomousProductionExecutionView() as any;
const entrypoint = buildCurrentVisualProductionExecutionView() as any;

if (legacy.schemaVersion !== 2 || legacy.executionAllowed !== false || legacy.policy?.humanReviewRequired !== true || legacy.policy?.yuiHoldPreserved !== true) fail('legacy V2 must remain immutable Human-gated audit evidence');
if (current.schemaVersion !== 3 || current.status !== 'CURRENT_AUTONOMOUS_NON_LOGO_EXECUTION_VIEW' || current.executionAllowed !== true) fail('Current V3 execution identity invalid');
if (current.executor !== 'CODEX' || current.delegatedAuthorRole !== 'DELEGATED_AUTHOR') fail('Current executor/author role invalid');
if (current.currentAuthority !== VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH || CURRENT_VISUAL_PRODUCTION_POLICY_PATH !== VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH) fail('Current authority path drifted');
if (current.legacyAuditView?.retainedAsAuditEvidence !== true || current.legacyAuditView?.mayBlockCurrentExecution !== false || current.legacyAuditView?.executionAllowed !== false) fail('legacy audit view boundary invalid');
if (current.humanReview?.intermediateRequired !== false || current.humanReview?.finalRequired !== true || current.humanReview?.finalGate !== 'PROJECT_100_PERCENT_READY' || current.humanReview?.finalRequestAllowedNow !== false) fail('Human review mode invalid');
if (current.authoring?.settingsReadyForMasterSpec !== true || current.authoring?.machineReadableAuthorityUpdateRequiredBeforePrompt !== true || current.authoring?.imageOutputMayDecideSetting !== false || current.authoring?.imageOutputMayCreateStoryCanon !== false) fail('Current settings/image authority invalid');

for (const stage of ['SETTINGS','MASTER_SPEC','MASTER_IMAGE','GUIDE_DB','TOP_PROMO','GAMEPLAY','RUNTIME_QA']) if (current.phaseGates?.[stage]?.allowed !== true) fail(`${stage} must remain allowed`);
if (current.phaseGates?.SETTINGS?.current !== false || current.phaseGates?.SETTINGS?.complete !== true) fail('SETTINGS must be complete/non-current');
if (current.phaseGates?.MASTER_SPEC?.current !== true || current.phaseGates?.MASTER_SPEC?.requiresSettingsReady !== true) fail('MASTER_SPEC must be current');
if (current.phaseGates?.MASTER_SPEC?.characterSheetEntrypoint !== VISUAL_AUTONOMOUS_CHARACTER_SHEET_ENTRYPOINT_PATH || current.phaseGates?.MASTER_SPEC?.preGenerationReadiness !== VISUAL_AUTONOMOUS_CHARACTER_PREGEN_READINESS_PATH) fail('Current Character Master preparation path missing');
if (current.phaseGates?.MASTER_IMAGE?.current !== false || current.phaseGates?.MASTER_IMAGE?.defaultCandidateCount !== 4 || current.phaseGates?.MASTER_IMAGE?.requiresMaterializedAuthoritySnapshot !== true || current.phaseGates?.MASTER_IMAGE?.requiresExplicitSubjectAdmission !== true || current.phaseGates?.MASTER_IMAGE?.automaticQaRequired !== true || current.phaseGates?.MASTER_IMAGE?.rejectRegenerateLoopRequired !== true) fail('MASTER_IMAGE pre-admission/QA boundary invalid');
if (current.phaseGates?.GAMEPLAY?.bulkGenerationAllowedNow !== false || current.phaseGates?.GAMEPLAY?.requiresApprovedParentMaster !== true || current.phaseGates?.GAMEPLAY?.requiresContractNormalizationAndAdmission !== true) fail('Gameplay bulk-generation guard invalid');
if (current.phaseGates?.FINAL_HUMAN_REVIEW?.allowedNow !== false || current.phaseGates?.FINAL_HUMAN_REVIEW?.requiredAtProject100Percent !== true) fail('final Human phase must remain closed');

for (const key of ['repeatUntilPass','structuralHardVetoRequired','semanticQaRequired','rejectReasonRequired','promptRevisionReasonRequired','stableAssetIdsRequired','sha256ForBinaryAssetsRequired','duplicateBinaryDetectionRequired','replacementHistoryRequired']) if (current.quality?.[key] !== true) fail(`quality.${key} missing`);
if (current.quality?.rejectedCandidateMayParent !== false || current.quality?.partialMasterMayParent !== false) fail('rejected/partial parenting boundary weakened');
if (current.logo?.excludedFromRunner !== true || current.logo?.blocksNonLogoProduction !== false || current.logo?.integrationRequiredBeforeFinal100Percent !== true) fail('logo boundary invalid');

if (current.counts?.totalManagedRows !== 480 || current.counts?.currentAnnotatedRows !== 480 || current.counts?.currentImageBearingRows !== 266 || current.counts?.logicalNonImageRows !== 214) fail('managed execution partition drifted');
if (current.counts?.indexedAssetFactoryContracts !== 977 || current.counts?.assetFactoryContractsBulkGenerationAuthorizedNow !== 0) fail('977 contract admission boundary drifted');
if (current.counts?.materializedLifeChoiceDecisions !== 42 || current.counts?.closedPartialEvidenceItems !== 56 || current.counts?.characterMasterPromptSlots !== 144) fail('pre-generation progress counts invalid');
if (!Array.isArray(current.items) || current.items.length !== 480) fail('Current items must preserve 480 rows');
if (current.items.some((item: any) => item.currentAutonomousExecution?.intermediateHumanReviewRequired !== false)) fail('Current row still requires Human review');
if (current.items.some((item: any) => item.currentAutonomousExecution?.bulkGenerationAuthorizedByThisViewAlone !== false)) fail('V3 view alone may not bulk-authorize images');

if (policy.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_AUTHORITY' || policy.delegation?.intermediateHumanReviewRequired !== false) fail('JSON policy disagrees with V3');
if (runner.status !== 'ACTIVE_AUTONOMOUS_PIPELINE' || runner.currentStage !== 'MASTER_SPEC' || runner.settings?.readyForMasterSpec !== true) fail('runner state disagrees with V3');
if (runner.humanReview?.intermediateRequired !== false || runner.humanReview?.requestAllowed !== false) fail('runner Human state invalid');
if (JSON.stringify(entrypoint) !== JSON.stringify(current)) fail('Current entrypoint must expose V3 without drift');

console.log(JSON.stringify({ status:'PASS', legacyExecutionAllowed:false, currentExecutionAllowed:true, currentStage:runner.currentStage, settingsReady:true, characterMasterPromptSlots:144, bulkGameplayGenerationAllowedNow:false, logoExcluded:true }, null, 2));
