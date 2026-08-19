import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildVisualProductionExecutionView } from '../../src/game/data/visualProductionExecutionView.ts';
import {
  buildVisualAutonomousProductionExecutionView,
  VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH,
  VISUAL_AUTONOMOUS_RUNNER_STATE_PATH,
  VISUAL_AUTONOMOUS_PRODUCTION_CHECKLIST_PATH,
} from '../../src/game/data/visualAutonomousProductionExecutionView.ts';
import {
  buildCurrentVisualProductionExecutionView,
  CURRENT_VISUAL_PRODUCTION_POLICY_PATH,
} from '../../src/game/data/visualProductionCurrentEntrypoint.ts';

const root = process.cwd();

function fail(message: string): never {
  throw new Error(`[visual-autonomous-execution-view-v3] ${message}`);
}

const policy = JSON.parse(readFileSync(resolve(root, VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH), 'utf8'));
const runner = JSON.parse(readFileSync(resolve(root, VISUAL_AUTONOMOUS_RUNNER_STATE_PATH), 'utf8'));
readFileSync(resolve(root, VISUAL_AUTONOMOUS_PRODUCTION_CHECKLIST_PATH), 'utf8');

const legacy = buildVisualProductionExecutionView() as any;
const current = buildVisualAutonomousProductionExecutionView() as any;
const entrypoint = buildCurrentVisualProductionExecutionView() as any;

if (legacy.schemaVersion !== 2 || legacy.executionAllowed !== false) fail('legacy V2 must remain pre-generation audit evidence');
if (legacy.policy?.humanReviewRequired !== true || legacy.policy?.yuiHoldPreserved !== true) fail('legacy Human/Yui gates changed; preserve them as historical evidence');

if (current.schemaVersion !== 3 || current.status !== 'CURRENT_AUTONOMOUS_NON_LOGO_EXECUTION_VIEW') fail('Current V3 identity invalid');
if (current.currentMode !== 'AUTONOMOUS_NON_LOGO_PRODUCTION' || current.executionAllowed !== true) fail('Current runner must be executable');
if (current.executor !== 'CODEX' || current.delegatedAuthorRole !== 'DELEGATED_AUTHOR') fail('Current delegated executor/author role invalid');
if (current.currentAuthority !== VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH || CURRENT_VISUAL_PRODUCTION_POLICY_PATH !== VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH) fail('Current authority path drifted');
if (current.runnerState !== VISUAL_AUTONOMOUS_RUNNER_STATE_PATH || current.productionChecklist !== VISUAL_AUTONOMOUS_PRODUCTION_CHECKLIST_PATH) fail('Current runner/checklist path drifted');

if (current.legacyAuditView?.retainedAsAuditEvidence !== true || current.legacyAuditView?.mayBlockCurrentExecution !== false) fail('legacy V2 must be preserved but non-blocking');
if (current.legacyAuditView?.executionAllowed !== false) fail('legacy V2 evidence unexpectedly became executable');

if (current.humanReview?.intermediateRequired !== false || current.humanReview?.finalRequired !== true) fail('Human review mode invalid');
if (current.humanReview?.finalGate !== 'PROJECT_100_PERCENT_READY' || current.humanReview?.finalRequestAllowedNow !== false) fail('final Human gate invalid');

if (current.authoring?.settingsAuthoringAllowed !== true || current.authoring?.conflictingSettingResolutionAllowed !== true) fail('Codex setting authoring must be allowed');
if (current.authoring?.machineReadableAuthorityUpdateRequiredBeforePrompt !== true) fail('setting materialization must precede prompt export');
if (current.authoring?.imageOutputMayDecideSetting !== false || current.authoring?.imageOutputMayCreateStoryCanon !== false) fail('image authority boundary weakened');

for (const stage of ['SETTINGS', 'MASTER_SPEC', 'MASTER_IMAGE', 'GUIDE_DB', 'TOP_PROMO', 'GAMEPLAY', 'RUNTIME_QA']) {
  if (current.phaseGates?.[stage]?.allowed !== true) fail(`${stage} runner stage must be allowed`);
}
if (current.phaseGates?.SETTINGS?.current !== true) fail('SETTINGS must remain the current phase until decision log advances');
if (current.phaseGates?.SETTINGS?.intermediateHumanReviewRequired !== false) fail('SETTINGS must not wait for Human review');
if (current.phaseGates?.MASTER_IMAGE?.defaultCandidateCount !== 4) fail('Master image default candidate count must remain four');
if (current.phaseGates?.MASTER_IMAGE?.requiresMaterializedAuthoritySnapshot !== true || current.phaseGates?.MASTER_IMAGE?.requiresExplicitSubjectAdmission !== true) fail('Master image admission boundary missing');
if (current.phaseGates?.MASTER_IMAGE?.automaticQaRequired !== true || current.phaseGates?.MASTER_IMAGE?.rejectRegenerateLoopRequired !== true) fail('Master image autonomous QA loop missing');
if (current.phaseGates?.GAMEPLAY?.bulkGenerationAllowedNow !== false || current.phaseGates?.GAMEPLAY?.requiresApprovedParentMaster !== true || current.phaseGates?.GAMEPLAY?.requiresContractNormalizationAndAdmission !== true) fail('gameplay bulk-generation guard invalid');
if (current.phaseGates?.FINAL_HUMAN_REVIEW?.allowedNow !== false || current.phaseGates?.FINAL_HUMAN_REVIEW?.requiredAtProject100Percent !== true) fail('final Human phase must remain closed now');

for (const key of ['repeatUntilPass', 'structuralHardVetoRequired', 'semanticQaRequired', 'rejectReasonRequired', 'promptRevisionReasonRequired', 'stableAssetIdsRequired', 'sha256ForBinaryAssetsRequired', 'duplicateBinaryDetectionRequired', 'replacementHistoryRequired']) {
  if (current.quality?.[key] !== true) fail(`quality.${key} must remain true`);
}
if (current.quality?.rejectedCandidateMayParent !== false || current.quality?.partialMasterMayParent !== false) fail('rejected/partial parenting boundary weakened');

if (current.logo?.excludedFromRunner !== true || current.logo?.blocksNonLogoProduction !== false || current.logo?.integrationRequiredBeforeFinal100Percent !== true) fail('logo boundary invalid');

if (current.counts?.totalManagedRows !== 480 || current.counts?.currentAnnotatedRows !== 480) fail(`managed row count drifted: ${current.counts?.totalManagedRows}/${current.counts?.currentAnnotatedRows}`);
if (current.counts?.currentImageBearingRows !== 266 || current.counts?.logicalNonImageRows !== 214) fail('266/214 managed partition drifted');
if (current.counts?.indexedAssetFactoryContracts !== 977 || current.counts?.assetFactoryContractsBulkGenerationAuthorizedNow !== 0) fail('977 contract admission boundary drifted');
if (!Array.isArray(current.items) || current.items.length !== 480) fail('Current items must preserve all 480 managed rows');
if (current.items.some((item: any) => item.currentAutonomousExecution?.intermediateHumanReviewRequired !== false)) fail('a Current row still requires intermediate Human review');
if (current.items.some((item: any) => item.currentAutonomousExecution?.bulkGenerationAuthorizedByThisViewAlone !== false)) fail('Current View alone must never bulk-authorize image rows');
if (current.items.some((item: any) => item.currentAutonomousExecution?.imageBearing === true && item.currentAutonomousExecution?.requiresExplicitItemAdmissionBeforeGeneration !== true)) fail('image-bearing row missing explicit admission requirement');

if (policy.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_AUTHORITY' || policy.delegation?.intermediateHumanReviewRequired !== false) fail('JSON policy disagrees with V3 view');
if (policy.logo?.excludedFromThisRunner !== true) fail('JSON policy logo boundary disagrees with V3 view');
if (runner.status !== 'ACTIVE_AUTONOMOUS_PIPELINE' || runner.currentStage !== 'SETTINGS') fail('runner state disagrees with V3 view');
if (runner.humanReview?.intermediateRequired !== false || runner.humanReview?.requestAllowed !== false) fail('runner Human review state disagrees with V3 view');

if (JSON.stringify(entrypoint) !== JSON.stringify(current)) fail('Current entrypoint must expose the V3 view without semantic drift');

console.log(JSON.stringify({
  status: 'PASS',
  legacyExecutionAllowed: legacy.executionAllowed,
  currentExecutionAllowed: current.executionAllowed,
  intermediateHumanReviewRequired: current.humanReview.intermediateRequired,
  currentStage: runner.currentStage,
  managedRows: current.counts.currentAnnotatedRows,
  imageBearingRows: current.counts.currentImageBearingRows,
  indexedAssetFactoryContracts: current.counts.indexedAssetFactoryContracts,
  bulkGameplayGenerationAllowedNow: current.phaseGates.GAMEPLAY.bulkGenerationAllowedNow,
  logoExcluded: current.logo.excludedFromRunner,
}, null, 2));
