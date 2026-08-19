import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

function readJson(path: string): any {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function fail(message: string): never {
  throw new Error(`[visual-autonomous-execution-adapters] ${message}`);
}

const POLICY_PATH = 'data/character-assets/manifests/visual-autonomous-production-policy.v1.json';
const LEGACY_CORE5_PATH = 'data/character-assets/manifests/core5-era-setting-board-execution-queue.v1.json';
const CORE5_PATH = 'data/character-assets/manifests/core5-era-setting-board-autonomous-queue.v2.json';
const OLD_YUI_PACK_PATH = 'data/character-assets/reviews/yui-character-design-master-pack-v1.json';
const YUI_PATH = 'data/character-assets/reviews/yui-character-design-master-pack-autonomous-v2.json';
const YUI_SHEET_REJECTS_PATH = 'data/character-assets/reviews/yui-character-design-sheet-01-v1.rejects.json';
const YUI_FULL_BODY_REJECTS_PATH = 'data/character-assets/reviews/yui-full-body-master-v2.rejects.json';

const policy = readJson(POLICY_PATH);
const legacyCore5 = readJson(LEGACY_CORE5_PATH);
const core5 = readJson(CORE5_PATH);
const oldYui = readJson(OLD_YUI_PACK_PATH);
const yui = readJson(YUI_PATH);
const yuiSheetRejects = readJson(YUI_SHEET_REJECTS_PATH);
const yuiFullBodyRejects = readJson(YUI_FULL_BODY_REJECTS_PATH);

if (policy.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_AUTHORITY') fail('Current autonomous policy missing');

if (legacyCore5.globalRules?.humanReviewRequired !== true || legacyCore5.globalRules?.imageGenerationAuthorized !== false) {
  fail('legacy Core5 queue changed unexpectedly; it must remain preserved audit evidence');
}
if (core5.schemaVersion !== 2 || core5.status !== 'READY_FOR_CODEX_PROFESSIONAL_REVIEW_AND_CANDIDATE_EVIDENCE') fail('Core5 autonomous queue status invalid');
if (core5.authority !== POLICY_PATH || core5.legacyHumanQueue !== LEGACY_CORE5_PATH) fail('Core5 autonomous queue lineage invalid');
if (core5.counts?.total !== 10 || core5.counts?.editableSpecsReady !== 10 || core5.counts?.codexReviewReady !== 10) fail('Core5 ten-board readiness drifted');
if (core5.counts?.intermediateHumanReviewRequired !== 0 || core5.counts?.candidateEvidenceGenerationAuthorized !== 10) fail('Core5 autonomous authorization counts invalid');
if (core5.rules?.legacyHumanReviewStatusDoesNotBlockCurrentExecution !== true) fail('legacy Core5 Human gate must not block Current execution');
if (core5.rules?.codexProfessionalReviewRequired !== true || core5.rules?.automaticQaRequired !== true || core5.rules?.regenerateOnFailure !== true) fail('Core5 autonomous QA loop incomplete');
if (core5.rules?.intermediateHumanReviewRequired !== false || core5.rules?.finalHumanReviewOnlyAtProject100Percent !== true) fail('Core5 Human review mode invalid');
if (core5.rules?.generatedImageCreatesStoryCanon !== false || core5.rules?.generatedImageCreatesLiteralFamilyCanon !== false) fail('Core5 image authority boundary weakened');
if (core5.rules?.imageMayNotResolveExactYear !== true || core5.rules?.imageMayNotResolveExactFamilyMembers !== true) fail('Core5 image must not author exact year/family facts');
if (core5.rules?.codexMayResolveExactYearWhenProductionRequiresIt !== true || core5.rules?.codexMayResolveExactFamilyFactsWhenProductionRequiresIt !== true) fail('Codex delegated setting authority missing for Core5 blockers');

const legacyIds = new Set((legacyCore5.entries ?? []).map((entry: any) => entry.assetId));
const currentEntries = Array.isArray(core5.entries) ? core5.entries : [];
const currentIds = new Set(currentEntries.map((entry: any) => entry.assetId));
if (legacyIds.size !== 10 || currentIds.size !== 10) fail(`Core5 asset-id count must remain 10/10, got ${legacyIds.size}/${currentIds.size}`);
for (const assetId of legacyIds) if (!currentIds.has(assetId)) fail(`Core5 autonomous queue lost stable assetId ${assetId}`);
for (const entry of currentEntries) {
  if (entry.currentState !== 'READY_CODEX_REVIEW' || entry.candidateGenerationAllowed !== true) fail(`${entry.assetId}: not ready for autonomous review/generation`);
  if (typeof entry.specPath !== 'string' || !entry.specPath.startsWith('data/visual/setting-boards/')) fail(`${entry.assetId}: invalid setting-board spec path`);
  if (entry.characterId === 'yui') {
    if (entry.exactYearState !== '2026_CURRENT') fail(`${entry.assetId}: Yui must preserve 2026 Current`);
  } else if (entry.exactYearState !== 'OPEN') {
    fail(`${entry.assetId}: non-Yui exact year should remain OPEN until Codex author decision resolves it`);
  }
  if (entry.boardType === 'POPULATION_HOUSEHOLD' && entry.literalFamilyCanonCreated !== false) fail(`${entry.assetId}: population/household board may not create literal family Canon`);
}
if (core5.nextGate?.humanReviewRequiredBeforeGeneration !== false || core5.nextGate?.humanReviewRequiredBeforeAutomaticMasterPromotion !== false) fail('Core5 next gate still contains intermediate Human approval');
if (core5.nextGate?.automaticQaMustPassBeforeMasterPromotion !== true || core5.nextGate?.finalHumanReviewDeferredToProject100Percent !== true) fail('Core5 automatic/final review gate invalid');

if (oldYui.status !== 'FOUR_CANDIDATES_GENERATED_REJECTED_NOT_APPROVED') fail('old Yui pack must remain rejected evidence');
if (oldYui.dependencyGate?.sheet02GenerationAllowed !== false || oldYui.approval?.sheetHumanReviewRequired !== true) fail('old Yui pack changed unexpectedly; historical gate must remain as evidence');
if (yui.schemaVersion !== 2 || yui.status !== 'READY_FOR_AUTONOMOUS_REGENERATION') fail('Yui autonomous pack status invalid');
if (yui.authority !== POLICY_PATH || yui.previousRejectedPack !== OLD_YUI_PACK_PATH) fail('Yui autonomous pack lineage invalid');
if (yui.historyBoundary?.previousEightCandidatesRemainRejected !== true || yui.historyBoundary?.previousRejectedBinaryMayParentDerivative !== false) fail('Yui rejected history boundary invalid');
if (yui.historyBoundary?.previousRejectReasonsMustBeConsumedBeforePromptRevision !== true || yui.historyBoundary?.previousPromptMayBeReusedUnchanged !== false) fail('Yui learning loop invalid');
if (yui.regeneration?.candidateCount !== 4 || yui.regeneration?.generationAllowed !== true) fail('Yui regeneration must create four candidates');
if (yui.regeneration?.intermediateHumanReviewRequired !== false || yui.regeneration?.automaticQaRequired !== true || yui.regeneration?.structuralHardVetoRequired !== true || yui.regeneration?.retryUntilPass !== true) fail('Yui autonomous QA loop invalid');
if (yui.sheetUnlock?.humanApprovalRequiredBeforeUnlock !== false) fail('Yui Sheet02-04 Human pre-approval must be disabled');
if (yui.sheetUnlock?.sheet02GenerationAllowedAfterSheet01AutomaticQaPass !== true || yui.sheetUnlock?.sheet03GenerationAllowedAfterSheet01AutomaticQaPass !== true || yui.sheetUnlock?.sheet04GenerationAllowedAfterSheet01AutomaticQaPass !== true) fail('Yui Sheet01 automatic QA unlock contract incomplete');
if (yui.sheetUnlock?.partialPackMayParentDerivatives !== false || yui.sheetUnlock?.fullPackCrossSheetConsistencyRequiredBeforeDerivativeParenting !== true) fail('Yui derivative parenting boundary invalid');
if (yui.promotion?.automaticMasterPromotionAllowedAfterRequiredQaPass !== true || yui.promotion?.humanApprovalRequiredForIntermediatePromotion !== false || yui.promotion?.finalHumanReviewDeferredToProject100Percent !== true) fail('Yui autonomous promotion boundary invalid');

const sheetRejectFiles = Array.isArray(yuiSheetRejects.files) ? yuiSheetRejects.files : [];
const fullBodyRejectFiles = Array.isArray(yuiFullBodyRejects.files) ? yuiFullBodyRejects.files : [];
if (yuiSheetRejects.decision !== 'REJECT_ALL' || yuiFullBodyRejects.decision !== 'REJECT_ALL') fail('Yui reject ledgers must remain REJECT_ALL');
if (sheetRejectFiles.length !== 4 || fullBodyRejectFiles.length !== 4 || sheetRejectFiles.length + fullBodyRejectFiles.length !== 8) fail('Yui rejected-candidate evidence must remain 4 + 4 = 8');
if (yuiSheetRejects.mayBeParent !== false || yuiFullBodyRejects.preservationPolicy !== 'KEEP_IN_GIT_FOR_PROMPT_LEARNING_DO_NOT_USE_AS_PARENT') fail('Yui rejected candidates may not regain parent authority');

console.log(JSON.stringify({
  status: 'PASS',
  core5StableAssetIds: currentIds.size,
  core5CandidateGenerationAuthorized: core5.counts.candidateEvidenceGenerationAuthorized,
  core5IntermediateHumanReviewRequired: core5.rules.intermediateHumanReviewRequired,
  yuiAutonomousRegeneration: yui.regeneration.generationAllowed,
  yuiRejectedCandidatesPreserved: sheetRejectFiles.length + fullBodyRejectFiles.length,
  yuiIntermediateHumanReviewRequired: yui.regeneration.intermediateHumanReviewRequired,
}, null, 2));
