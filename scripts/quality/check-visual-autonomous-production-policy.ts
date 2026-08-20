import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const POLICY_PATH = 'data/character-assets/manifests/visual-autonomous-production-policy.v1.json';
const STATE_PATH = 'data/character-assets/manifests/visual-autonomous-production-runner-state.v1.json';
const CHECKLIST_PATH = 'docs/visual/visual-autonomous-production-checklist-v1.md';
const LEGACY_PACKET_PATH = 'data/visual/all-character-life-choice-author-decision-packet-v1.json';
const DECISION_LOG_PATH = 'data/visual/all-character-life-choice-codex-author-decisions-v1.json';
const PARTIAL_CLOSURE_PATH = 'data/visual/all-character-life-choice-partial-evidence-autonomous-closure-v1.json';
const PREGEN_PATH = 'data/character-assets/manifests/visual-character-master-pre-generation-readiness.v1.json';

function readJson(path: string): any { return JSON.parse(readFileSync(resolve(root, path), 'utf8')); }
function fail(message: string): never { throw new Error(`[visual-autonomous-production-policy] ${message}`); }

const policy = readJson(POLICY_PATH);
const state = readJson(STATE_PATH);
const legacyPacket = readJson(LEGACY_PACKET_PATH);
const decisionLog = readJson(DECISION_LOG_PATH);
const partialClosure = readJson(PARTIAL_CLOSURE_PATH);
const pregen = readJson(PREGEN_PATH);
const checklist = readFileSync(resolve(root, CHECKLIST_PATH), 'utf8');

if (policy.schemaVersion !== 1 || policy.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_AUTHORITY' || policy.repositoryScope !== 'm-shogo/vamp-pon') fail('Current policy identity/scope invalid');
const delegation = policy.delegation ?? {};
if (delegation.executor !== 'CODEX' || delegation.authorDecisionRole !== 'DELEGATED_AUTHOR') fail('Codex delegated-author role missing');
if (delegation.intermediateHumanReviewRequired !== false || delegation.finalHumanReviewRequired !== true || delegation.finalHumanReviewGate !== 'PROJECT_100_PERCENT_READY') fail('Human review policy invalid');
for (const key of ['mayResolveOpenSettings','mayReviseConflictingSettings','mayMaterializeMasterSpecs','mayGenerateCandidates','mayRejectAndRegenerate','mayPromoteQaPassingMaster','mayMaterializeGuideDbReuse','mayGenerateGameplayDerivativesFromApprovedMasters','mayRunRuntimeVisualQa']) {
  if (delegation[key] !== true) fail(`delegation.${key} must remain true`);
}
const boundary = policy.authoringBoundary ?? {};
if (boundary.codexMayAuthorCharacterFacts !== true || boundary.generatedImageMayInventCharacterFacts !== false || boundary.generatedImageMayCloseOpenSetting !== false || boundary.generatedImageMayCreateStoryCanon !== false || boundary.promptMustConsumeMaterializedAuthoritySnapshot !== true) fail('authoring/image authority boundary invalid');
for (const key of ['codexMustRecordDecisionReason','codexMustRecordSourceEvidence','codexMustRecordPreviousState','codexMustRecordConflictResolution']) if (boundary[key] !== true) fail(`authoringBoundary.${key} missing`);

const expectedOrder = ['SETTINGS','MASTER_SPEC','MASTER_IMAGE','GUIDE_DB','TOP_PROMO','GAMEPLAY','RUNTIME_QA','FINAL_HUMAN_REVIEW'];
if (JSON.stringify(policy.productionOrder) !== JSON.stringify(expectedOrder)) fail('production order drifted');
const quality = policy.qualityLoop ?? {};
if (quality.candidateCountDefault !== 4 || quality.minimumCandidatesWhenGenerationIsUsed !== 4 || quality.repeatUntilPass !== true || quality.maximumRetryCount !== null) fail('quality loop candidate/retry policy invalid');
for (const key of ['automaticQaRequired','structuralHardVetoRequired','semanticQaRequired','rejectReasonRequired','promptRevisionReasonRequired','failedCandidateHistoryMustRemain']) if (quality[key] !== true) fail(`qualityLoop.${key} missing`);
if (quality.rejectedCandidateMayParentDerivative !== false || quality.partialMasterPackMayParentDerivative !== false) fail('rejected/partial parenting boundary weakened');
const lineage = policy.lineage ?? {};
if (lineage.masterBeforeGuideDb !== true || lineage.masterBeforeTopPromo !== true || lineage.masterBeforeGameplay !== true || lineage.guideDbMayParentGameplay !== false || lineage.topPromoMayParentGameplay !== false) fail('Master-first lineage invalid');
if (lineage.stableAssetIdsMustBePreserved !== true || lineage.sha256RequiredForBinaryAssets !== true || lineage.duplicateBinaryDetectionRequired !== true || lineage.overwriteExistingApprovedBinary !== false || lineage.replacementHistoryRequired !== true) fail('asset identity/history boundary invalid');

if (policy.yui?.holdSuperseded !== true || policy.yui?.regenerationAllowed !== true || policy.yui?.oldEightCandidatesRemainRejected !== true || policy.yui?.mustUseRejectedCandidateLearnings !== true || policy.yui?.rejectedCandidatesMayParent !== false || policy.yui?.humanApprovalBeforeSheet02To04 !== false) fail('Yui autonomous/reject boundary invalid');
if (policy.core5SettingBoards?.count !== 10 || policy.core5SettingBoards?.editableSpecsReady !== 10 || policy.core5SettingBoards?.intermediateHumanApprovalRequired !== false) fail('Core5 setting-board policy invalid');
if (policy.logo?.excludedFromThisRunner !== true || policy.logo?.nonLogoPipelineMayContinueWithoutLogo !== true || policy.logo?.logoMayNotBeAutoRegeneratedByThisRunner !== true || policy.logo?.logoIntegrationRequiredBeforeProjectFinal100Percent !== true) fail('logo ownership boundary invalid');

if (Number(legacyPacket.scope?.authorDecisionCount) !== 42 || Number(legacyPacket.scope?.pendingHumanDecisionCount) !== 42) fail('legacy 42-item Human packet must remain immutable audit evidence');
if (decisionLog.status !== 'AUTHORING_COMPLETE' || decisionLog.materializedDecisionCount !== 42 || decisionLog.remainingDecisionCount !== 0 || decisionLog.globalBoundary?.imageOutputMayBeAuthority !== false) fail('Current 42-item Codex decision log incomplete');
if (partialClosure.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_CLOSURE_COMPLETE' || partialClosure.scope?.reviewedForAutonomousAuthoring !== 56 || partialClosure.scope?.remaining !== 0 || partialClosure.resolution?.imageOutputMayFillMissingMeaning !== false) fail('56-item Current partial-evidence closure incomplete');

if (state.schemaVersion !== 2 || state.status !== 'ACTIVE_AUTONOMOUS_PIPELINE' || state.currentStage !== 'MASTER_SPEC') fail('runner must advance to MASTER_SPEC after settings closure');
if (state.settings?.readyForMasterSpec !== true) fail('settingsReady flag missing');
if (state.settings?.lifeChoiceAuthorDecisionQueue?.total !== 42 || state.settings?.lifeChoiceAuthorDecisionQueue?.resolvedByAutonomousRunner !== 42 || state.settings?.lifeChoiceAuthorDecisionQueue?.remaining !== 0) fail('runner 42-decision progress invalid');
if (state.settings?.partialEvidence?.total !== 56 || state.settings?.partialEvidence?.reviewedForAutonomousAuthoring !== 56 || state.settings?.partialEvidence?.remaining !== 0) fail('runner 56-closure progress invalid');
if (state.settings?.schemaReady?.total !== 109 || state.settings?.speciesAdapter?.total !== 9) fail('216-item partition drifted');
if (state.masterProduction?.characterPacks !== 36 || state.masterProduction?.characterSheetSlots !== 144 || state.masterProduction?.yuiPreviousCandidatesRejected !== 8 || state.masterProduction?.yuiRegenerationAuthorized !== true) fail('Character Master counts/Yui state invalid');
if (state.managedExecution?.stableRows !== 480 || state.managedExecution?.imageBearingRows !== 266 || state.managedExecution?.logicalNonImageRows !== 214 || state.managedExecution?.assetFactoryContractsIndexed !== 977 || state.managedExecution?.assetFactoryContractsAdmittedForGeneration !== 0) fail('managed execution/admission counts drifted');
if (state.humanReview?.intermediateRequired !== false || state.humanReview?.finalRequired !== true || state.humanReview?.requestAllowed !== false) fail('runner Human gate invalid');
if (state.logo?.ownedByThisRunner !== false || state.logo?.blocksNonLogoPipeline !== false || state.logo?.requiredBeforeFinal100Percent !== true) fail('runner logo boundary invalid');
if (state.completionGate?.project100PercentReady !== false) fail('project prematurely marked 100%');

if (pregen.status !== 'READY_FOR_IMAGE_GENERATION_WHEN_CURRENT_HEAD_CI_GREEN' || pregen.settings?.productionFacingSettingsReady !== true || pregen.characterMaster?.characterCount !== 36 || pregen.characterMaster?.logicalSheetSlots !== 144) fail('Character Master pre-generation readiness invalid');
if (pregen.imageGeneration?.executed !== false || pregen.imageGeneration?.generatedCandidateCount !== 0 || pregen.imageGeneration?.authorizedByThisPreparationCommit !== false) fail('preparation commit must generate zero images');
if (pregen.generationAdmission?.intermediateHumanReviewRequired !== false || pregen.logo?.ownedByThisLine !== false) fail('pre-generation Human/logo boundary invalid');

for (const required of ['There is no intermediate Human approval gate.','Generated images are never allowed to invent or close setting facts.','Do not generate or alter the logo in this loop.','Only then:']) if (!checklist.includes(required)) fail(`checklist boundary missing: ${required}`);

console.log(JSON.stringify({ status:'PASS', currentStage:state.currentStage, settings:'42/42 + 56/56', characterMasterPromptSlots:144, generatedImagesInPreparation:0, intermediateHumanReviewRequired:false, logoOwnedByRunner:false }, null, 2));
