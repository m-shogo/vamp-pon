import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const POLICY_PATH = 'data/character-assets/manifests/visual-autonomous-production-policy.v1.json';
const STATE_PATH = 'data/character-assets/manifests/visual-autonomous-production-runner-state.v1.json';
const CHECKLIST_PATH = 'docs/visual/visual-autonomous-production-checklist-v1.md';
const LIFE_CHOICE_PACKET_PATH = 'data/visual/all-character-life-choice-author-decision-packet-v1.json';

function readJson(path: string): any {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function fail(message: string): never {
  throw new Error(`[visual-autonomous-production-policy] ${message}`);
}

const policy = readJson(POLICY_PATH);
const state = readJson(STATE_PATH);
const lifeChoicePacket = readJson(LIFE_CHOICE_PACKET_PATH);
const checklist = readFileSync(resolve(root, CHECKLIST_PATH), 'utf8');

if (policy.schemaVersion !== 1) fail('policy schemaVersion must be 1');
if (policy.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_AUTHORITY') fail('policy must be Current autonomous authority');
if (policy.repositoryScope !== 'm-shogo/vamp-pon') fail('repository scope drifted');

const delegation = policy.delegation ?? {};
if (delegation.executor !== 'CODEX') fail('executor must be CODEX');
if (delegation.authorDecisionRole !== 'DELEGATED_AUTHOR') fail('Codex delegated-author role missing');
if (delegation.intermediateHumanReviewRequired !== false) fail('intermediate Human review must be disabled');
if (delegation.finalHumanReviewRequired !== true) fail('final Human review must remain required');
if (delegation.finalHumanReviewGate !== 'PROJECT_100_PERCENT_READY') fail('final Human review gate drifted');
for (const key of [
  'mayResolveOpenSettings',
  'mayReviseConflictingSettings',
  'mayMaterializeMasterSpecs',
  'mayGenerateCandidates',
  'mayRejectAndRegenerate',
  'mayPromoteQaPassingMaster',
  'mayMaterializeGuideDbReuse',
  'mayGenerateGameplayDerivativesFromApprovedMasters',
  'mayRunRuntimeVisualQa',
]) {
  if (delegation[key] !== true) fail(`delegation.${key} must be true`);
}

const authoringBoundary = policy.authoringBoundary ?? {};
if (authoringBoundary.codexMayAuthorCharacterFacts !== true) fail('Codex authoring delegation missing');
if (authoringBoundary.generatedImageMayInventCharacterFacts !== false) fail('image model must not invent character facts');
if (authoringBoundary.generatedImageMayCloseOpenSetting !== false) fail('image output must not close OPEN settings');
if (authoringBoundary.generatedImageMayCreateStoryCanon !== false) fail('image output must not create Story Canon');
if (authoringBoundary.promptMustConsumeMaterializedAuthoritySnapshot !== true) fail('prompt authority snapshot requirement missing');
for (const key of ['codexMustRecordDecisionReason', 'codexMustRecordSourceEvidence', 'codexMustRecordPreviousState', 'codexMustRecordConflictResolution']) {
  if (authoringBoundary[key] !== true) fail(`authoringBoundary.${key} must be true`);
}

const expectedOrder = ['SETTINGS', 'MASTER_SPEC', 'MASTER_IMAGE', 'GUIDE_DB', 'TOP_PROMO', 'GAMEPLAY', 'RUNTIME_QA', 'FINAL_HUMAN_REVIEW'];
if (JSON.stringify(policy.productionOrder) !== JSON.stringify(expectedOrder)) fail(`production order drifted: ${JSON.stringify(policy.productionOrder)}`);

const quality = policy.qualityLoop ?? {};
if (quality.candidateCountDefault !== 4 || quality.minimumCandidatesWhenGenerationIsUsed !== 4) fail('default candidate count must remain four');
if (quality.repeatUntilPass !== true) fail('autonomous retry loop must remain enabled');
if (quality.maximumRetryCount !== null) fail('retry count must not silently cap production quality');
if (quality.stopCondition !== 'PASS_OR_EXPLICIT_NON_REQUIRED_WITH_REASON') fail('quality loop stop condition drifted');
for (const key of ['automaticQaRequired', 'structuralHardVetoRequired', 'semanticQaRequired', 'rejectReasonRequired', 'promptRevisionReasonRequired', 'failedCandidateHistoryMustRemain']) {
  if (quality[key] !== true) fail(`qualityLoop.${key} must be true`);
}
if (quality.rejectedCandidateMayParentDerivative !== false || quality.partialMasterPackMayParentDerivative !== false) fail('rejected/partial Masters may not parent derivatives');

const lineage = policy.lineage ?? {};
if (lineage.masterBeforeGuideDb !== true || lineage.masterBeforeTopPromo !== true || lineage.masterBeforeGameplay !== true) fail('Master-first production order weakened');
if (lineage.guideDbMayParentGameplay !== false || lineage.topPromoMayParentGameplay !== false) fail('non-Master surfaces may not parent gameplay');
if (lineage.stableAssetIdsMustBePreserved !== true || lineage.sha256RequiredForBinaryAssets !== true || lineage.duplicateBinaryDetectionRequired !== true) fail('asset identity/dedupe boundary weakened');
if (lineage.overwriteExistingApprovedBinary !== false || lineage.replacementHistoryRequired !== true) fail('replacement history boundary weakened');

if (!Array.isArray(policy.supersededIntermediateHumanGates) || policy.supersededIntermediateHumanGates.length < 5) fail('legacy intermediate Human gates must be explicitly superseded');
if (typeof policy.supersessionRule !== 'string' || !policy.supersessionRule.includes('Current execution')) fail('Current execution precedence must be explicit');

const yui = policy.yui ?? {};
if (yui.holdSuperseded !== true || yui.regenerationAllowed !== true) fail('Yui autonomous regeneration not authorized');
if (yui.mustUseRejectedCandidateLearnings !== true || yui.oldEightCandidatesRemainRejected !== true) fail('Yui reject learnings/history must remain mandatory');
if (yui.rejectedCandidatesMayParent !== false) fail('Yui rejected candidates may not parent derivatives');
if (yui.sheet02To04MayBeginOnlyAfterSheet01AutomaticQaPass !== true) fail('Yui Sheet01 automatic QA dependency missing');
if (yui.humanApprovalBeforeSheet02To04 !== false) fail('Yui intermediate Human gate must be disabled');

const core5 = policy.core5SettingBoards ?? {};
if (core5.count !== 10 || core5.editableSpecsReady !== 10) fail('Core5 setting board count/readiness drifted');
if (core5.intermediateHumanApprovalRequired !== false || core5.codexProfessionalReviewRequired !== true) fail('Core5 review mode must be Codex professional review without Human pre-approval');
if (core5.generatedCandidateCreatesExactFamilyCanon !== false) fail('generated Core5 boards may not create literal family Canon');

const logo = policy.logo ?? {};
if (logo.excludedFromThisRunner !== true || logo.nonLogoPipelineMayContinueWithoutLogo !== true) fail('logo must remain outside this runner');
if (logo.logoMayNotBeAutoRegeneratedByThisRunner !== true) fail('runner must not regenerate logo');
if (logo.logoIntegrationRequiredBeforeProjectFinal100Percent !== true) fail('logo integration must remain part of final 100% gate');

const finalGate = policy.project100PercentGate ?? {};
for (const key of [
  'allRequiredSettingsResolvedOrExplicitlyNonRequired',
  'allRequiredMasterSpecsMaterialized',
  'allRequiredMasterImagesQaPassing',
  'allGuideDbReferencesMaterialized',
  'allAdmittedTopPromoAssetsQaPassing',
  'allAdmittedGameplayAssetsQaPassing',
  'runtimeVisualQaPassing',
  'noRejectedAssetUsedAsParent',
  'noUnresolvedDuplicateOrLineageConflict',
  'allRequiredCiGreenOnCurrentHead',
  'productionRegistryAndControlCenterCurrent',
  'logoIntegratedFromSeparateLine',
]) {
  if (finalGate[key] !== true) fail(`project100PercentGate.${key} must be true as a required condition`);
}
if (finalGate.humanReviewPerformed !== false) fail('final Human review must not be pre-marked complete');
if (policy.finalHumanReview?.allowedBeforeProject100PercentGate !== false) fail('final Human review must not be requested early');

if (state.schemaVersion !== 1 || state.status !== 'ACTIVE_AUTONOMOUS_PIPELINE') fail('runner state must be active schema v1');
if (state.policy !== POLICY_PATH || state.checklist !== CHECKLIST_PATH) fail('runner state must point to Current policy/checklist');
if (state.currentStage !== 'SETTINGS') fail('initial currentStage must remain SETTINGS until decisions are materialized');
if (state.humanReview?.intermediateRequired !== false || state.humanReview?.finalRequired !== true || state.humanReview?.requestAllowed !== false) fail('runner Human-review state invalid');

const packetCount = Number(lifeChoicePacket.scope?.authorDecisionCount ?? -1);
const packetPending = Number(lifeChoicePacket.scope?.pendingHumanDecisionCount ?? -1);
if (packetCount !== 42 || packetPending !== 42) fail(`legacy life-choice packet drifted from expected 42/42 evidence queue: ${packetCount}/${packetPending}`);
if (state.settings?.lifeChoiceAuthorDecisionQueue?.source !== LIFE_CHOICE_PACKET_PATH) fail('runner life-choice queue source drifted');
if (state.settings?.lifeChoiceAuthorDecisionQueue?.total !== packetCount || state.settings?.lifeChoiceAuthorDecisionQueue?.delegatedToCodex !== packetCount) fail('all 42 life-choice decisions must be delegated to Codex');
if (state.settings?.lifeChoiceAuthorDecisionQueue?.remaining !== 42) fail('initial autonomous runner remaining life-choice count must be 42');
if (state.settings?.partialEvidence?.total !== 56 || state.settings?.schemaReady?.total !== 109 || state.settings?.speciesAdapter?.total !== 9) fail('216-item partition counts drifted');

if (state.masterProduction?.characterPacks !== 36 || state.masterProduction?.characterSheetSlots !== 144) fail('Character Master Pack counts drifted');
if (state.masterProduction?.yuiPreviousCandidatesRejected !== 8 || state.masterProduction?.yuiRegenerationAuthorized !== true) fail('Yui runner state drifted');
if (state.masterProduction?.core5SettingBoards !== 10 || state.masterProduction?.sakuyazaMasters !== 8 || state.masterProduction?.starBeastMasters !== 21 || state.masterProduction?.namedObjectMasters !== 21) fail('Master family counts drifted');
if (state.managedExecution?.stableRows !== 480 || state.managedExecution?.imageBearingRows !== 266 || state.managedExecution?.logicalNonImageRows !== 214) fail('managed execution counts drifted');
if (state.managedExecution?.assetFactoryContractsIndexed !== 977 || state.managedExecution?.assetFactoryContractsAdmittedForGeneration !== 0) fail('Asset Factory admission boundary drifted');
if (state.logo?.ownedByThisRunner !== false || state.logo?.blocksNonLogoPipeline !== false || state.logo?.requiredBeforeFinal100Percent !== true) fail('runner logo boundary drifted');
if (state.completionGate?.project100PercentReady !== false) fail('project must not be marked 100% before production completes');

for (const required of [
  'There is no intermediate Human approval gate.',
  'Generated images are never allowed to invent or close setting facts.',
  'Do not generate or alter the logo in this loop.',
  'Only then:',
]) {
  if (!checklist.includes(required)) fail(`checklist missing required boundary text: ${required}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  authority: policy.status,
  executor: delegation.executor,
  intermediateHumanReviewRequired: delegation.intermediateHumanReviewRequired,
  finalHumanReviewGate: delegation.finalHumanReviewGate,
  lifeChoiceDecisionsDelegated: state.settings.lifeChoiceAuthorDecisionQueue.delegatedToCodex,
  partialEvidenceItems: state.settings.partialEvidence.total,
  characterMasterSheetSlots: state.masterProduction.characterSheetSlots,
  managedImageRows: state.managedExecution.imageBearingRows,
  assetFactoryContractsIndexed: state.managedExecution.assetFactoryContractsIndexed,
  logoOwnedByRunner: state.logo.ownedByThisRunner,
}, null, 2));
