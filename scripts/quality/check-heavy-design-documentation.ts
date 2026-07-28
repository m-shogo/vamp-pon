import { existsSync, readFileSync } from 'node:fs';

type JsonObject = Record<string, any>;

const requiredFiles = [
  'docs/design-documentation-readiness-control-center-v1.md',
  'docs/design-art-direction-quiet-night-warmth-v1.md',
  'docs/design-screen-completion-specifications-v1.md',
  'docs/design-component-state-accessibility-matrix-v1.md',
  'docs/design-motion-transition-spec-v1.md',
  'docs/design-technical-art-asset-pipeline-spec-v1.md',
  'docs/design-generation-briefs-wave1-v1.md',
  'docs/design-implementation-execution-plan-v1.md',
  'docs/design-implementation-handoff-template-v1.md',
  'docs/design-production-completeness-gates-v1.md',
  'docs/design-human-decision-interaction-protocol-v1.md',
  'docs/design-documentation-contradiction-register-v1.md',
  'docs/design-font-license-glyph-audit-v1.md',
  'docs/design-reference-rights-boundary-v1.md',
  'docs/design-targets/generated/design-production/documentation-readiness.json',
  'docs/design-targets/generated/design-production/human-decision-queue.json',
  'docs/design-targets/generated/design-production/generation-request-queue.json',
  'docs/design-targets/generated/design-production/reference-registry.json',
  'docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json',
  'docs/design-targets/generated/design-production/asset-provenance-registry-template.json',
] as const;

const errors: string[] = [];

for (const path of requiredFiles) {
  if (!existsSync(path)) errors.push(`missing required file: ${path}`);
}

function readJson(path: string): JsonObject {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as JsonObject;
  } catch (error) {
    errors.push(`invalid JSON: ${path}: ${String(error)}`);
    return {};
  }
}

function expect(condition: unknown, message: string): void {
  if (!condition) errors.push(message);
}

const readiness = readJson('docs/design-targets/generated/design-production/documentation-readiness.json');
const decisionQueue = readJson('docs/design-targets/generated/design-production/human-decision-queue.json');
const generationQueue = readJson('docs/design-targets/generated/design-production/generation-request-queue.json');
const referenceRegistry = readJson('docs/design-targets/generated/design-production/reference-registry.json');
const runtimeManifest = readJson('docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json');

expect(readiness.status === 'DOCUMENTATION_FOUNDATION_PREPARED', 'readiness.status must remain DOCUMENTATION_FOUNDATION_PREPARED');
expect(readiness.selectedArtDirection?.optionId === 'A', 'selected Art Direction must remain option A');
expect(readiness.selectedArtDirection?.value === 'QUIET_NIGHT_SMALL_WARMTH', 'selected Art Direction value mismatch');
expect(readiness.selectedArtDirection?.humanSelected === true, 'selected Art Direction must be human-selected');
expect(readiness.selectedArtDirection?.visuallyLocked === false, 'visual lock must remain false before generated comparison');

expect(readiness.documentation?.screenSpecifications?.screenCount === 13, 'screen specification count must be 13');
expect(readiness.documentation?.motionTransitions?.familyCount === 7, 'motion transition family count must be 7');
expect(readiness.documentation?.wave1GenerationBriefs?.briefCount === 3, 'Wave 1 brief count must be 3');
expect(readiness.documentation?.implementationExecutionPlan === 'DOCUMENTED_LOW_REWORK_SEQUENCE', 'implementation execution plan must be documented');
expect(readiness.documentation?.automatedDocumentationCheck === 'ACTIVE_IN_STAGE1_QUALITY', 'automated documentation check must be active in Stage1 Quality');
expect(readiness.documentation?.contradictionScan?.activeContradictions === 0, 'active documentation contradictions must be 0');
expect(readiness.documentationGate?.implementationExecutionPlanDefined === true, 'documentation gate must require the implementation execution plan');
expect(readiness.documentationGate?.automatedCheckerRegistered === true, 'documentation gate must register the automated checker');
expect(readiness.documentationGate?.gatePassed === true, 'documentation foundation gate must pass');
expect(Array.isArray(readiness.remainingDocumentationTasks) && readiness.remainingDocumentationTasks.length === 0, 'remainingDocumentationTasks must be empty');

for (const [key, expected] of Object.entries({
  imageGenerationStarted: false,
  repositoryAgentMayGenerateImages: false,
  unityDesignImplementationStarted: false,
  runtimeMutation: false,
  u49EvidenceMutation: false,
  u50MayStart: false,
  wholeAppHumanVisualAccepted: false,
  pr76MustRemainDraft: true,
})) {
  expect(readiness.boundaries?.[key] === expected, `readiness.boundaries.${key} must be ${String(expected)}`);
}

expect(readiness.preGenerationGate?.gatePassed === false, 'pre-generation gate must remain false until an active brief is explicitly approved');
expect(readiness.preGenerationGate?.activeWave1BriefHumanApproved === false, 'active Wave 1 brief must remain unapproved');
expect(readiness.implementationGate?.implementationExecutionPlanDefined === true, 'implementation gate must require the execution plan');
expect(readiness.implementationGate?.gatePassed === false, 'implementation gate must remain false');
expect(readiness.implementationGate?.humanImplementationStartApproval === false, 'human implementation start approval must remain false');

expect(decisionQueue.interactionMode === 'SINGLE_DECISION_CLICK_SELECT', 'decision queue interaction mode mismatch');
expect(decisionQueue.clickSelectPreferred === true, 'click-select must remain preferred');
expect(decisionQueue.pendingHumanDecisionCount === 0, 'pending human decision count must be 0');
expect(decisionQueue.activeDecision === null, 'active human decision must be null');
expect(Array.isArray(decisionQueue.decisions) && decisionQueue.decisions.some((decision: JsonObject) =>
  decision.decisionId === 'HD-ART-DIRECTION-001' &&
  decision.selectedOptionId === 'A' &&
  decision.status === 'HUMAN_SELECTED'), 'Art Direction decision record is missing or inconsistent');

expect(generationQueue.queueStatus === 'PLANNED_NOT_STARTED', 'generation queue must remain PLANNED_NOT_STARTED');
expect(generationQueue.generationAuthority === 'CHATGPT_HUMAN_SUPERVISED', 'generation authority mismatch');
expect(generationQueue.repositoryAgentMayGenerateImages === false, 'repository agent image generation must remain forbidden');
expect(generationQueue.oneBriefAtATime === true, 'generation must remain one brief at a time');
expect(generationQueue.activeRequest === null, 'active generation request must remain null');
expect(generationQueue.imageGenerationStarted === false, 'image generation must remain false');
expect(generationQueue.generationStartRequirements?.runtimeBaselineEvidenceReady === true, 'runtime baseline evidence must be ready');
expect(generationQueue.generationStartRequirements?.activeBriefHumanApproved === false, 'active brief approval must remain false');

const requests = Array.isArray(generationQueue.requests) ? generationQueue.requests : [];
expect(requests.length === 3, 'generation request count must be 3');
expect(new Set(requests.map((request: JsonObject) => request.requestId)).size === 3, 'generation request IDs must be unique');
expect(requests.map((request: JsonObject) => request.order).join(',') === '1,2,3', 'generation request order must be 1,2,3');

const topRequest = requests.find((request: JsonObject) => request.requestId === 'W1-01-TOP');
expect(topRequest?.status === 'PREPARED_NOT_APPROVED', 'TOP request must remain PREPARED_NOT_APPROVED');
expect(topRequest?.requiresCurrentRuntimeCapture === false, 'TOP must not require a nonexistent runtime capture');
expect(topRequest?.requiresRuntimeBaselineEvidence === true, 'TOP must require runtime baseline evidence');
expect(topRequest?.runtimeBaselineMode === 'ABSENCE_EVIDENCE', 'TOP baseline mode must be ABSENCE_EVIDENCE');

for (const requestId of ['W1-02-STAGE-SELECT', 'W1-03-LEVEL-UP']) {
  const request = requests.find((candidate: JsonObject) => candidate.requestId === requestId);
  expect(request?.status === 'BLOCKED_BY_PREVIOUS_REQUEST', `${requestId} must remain blocked by the previous request`);
  expect(request?.requiresCurrentRuntimeCapture === true, `${requestId} must require its runtime capture`);
  expect(request?.runtimeBaselineMode === 'CAPTURE', `${requestId} baseline mode must be CAPTURE`);
}

expect(referenceRegistry.status === 'CURRENT_REFERENCE_CLASSIFICATION', 'reference registry status mismatch');
expect(referenceRegistry.rules?.fileNameFinalDoesNotMeanApproved === true, 'final filename must not imply approval');
expect(referenceRegistry.rules?.directWholeScreenRuntimeUseForbidden === true, 'direct whole-screen runtime use must remain forbidden');
expect(referenceRegistry.summary?.currentApprovedTargetCount === 0, 'current approved whole-screen target count must be 0');
expect(referenceRegistry.summary?.requiresNewHumanComparison === true, 'new human comparison must remain required');
expect(Array.isArray(referenceRegistry.references) && referenceRegistry.references.every((reference: JsonObject) => reference.currentHumanApproved === false), 'historical references must not be marked currentHumanApproved');

expect(runtimeManifest.status === 'CURRENT_RUNTIME_BASELINE_MANIFEST', 'runtime comparison manifest status mismatch');
expect(runtimeManifest.summary?.screenCount === 13, 'runtime comparison manifest screen count must be 13');
expect(runtimeManifest.summary?.capturedScreenCount === 11, 'captured screen count must be 11');
expect(runtimeManifest.summary?.missingRuntimeScreenCount === 2, 'missing runtime screen count must be 2');
expect(runtimeManifest.summary?.comparisonReadyCount === 13, 'all 13 screens must have comparison evidence');
expect(runtimeManifest.summary?.wholeAppHumanVisualAccepted === false, 'whole-app human visual acceptance must remain false');

const screens = Array.isArray(runtimeManifest.screens) ? runtimeManifest.screens : [];
expect(new Set(screens.map((screen: JsonObject) => screen.screenId)).size === 13, 'runtime manifest screen IDs must be unique');
const topScreen = screens.find((screen: JsonObject) => screen.screenId === 'TOP');
expect(topScreen?.runtimeState === 'MISSING' && topScreen?.capture === null, 'TOP must remain a missing runtime screen with no capture');
expect(topScreen?.generationComparisonReady === true, 'TOP absence evidence must be comparison-ready');
for (const screenId of ['STAGE_SELECT', 'LEVEL_UP']) {
  const screen = screens.find((candidate: JsonObject) => candidate.screenId === screenId);
  expect(typeof screen?.capture === 'string' && screen.capture.length > 0, `${screenId} must retain a runtime comparison capture`);
  expect(screen?.generationComparisonReady === true, `${screenId} must remain comparison-ready`);
}

if (errors.length > 0) {
  throw new Error(`Heavy Design documentation check failed:\n- ${errors.join('\n- ')}`);
}

console.log('Heavy Design documentation check passed: 13 screens, 3 Wave 1 briefs, execution plan documented, Art Direction A, no active generation or Unity implementation.');
