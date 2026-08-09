import { existsSync, readFileSync } from 'node:fs';

type JsonObject = Record<string, any>;

type WorkflowState =
  | 'DOCUMENTATION_FOUNDATION'
  | 'WAVE1_GENERATION_APPROVED'
  | 'WAVE1_GENERATION_IN_PROGRESS'
  | 'WAVE1_DIRECTION_SELECTED'
  | 'WAVE1_COMPONENTS_APPROVED'
  | 'IMPLEMENTATION_READY'
  | 'IMPLEMENTATION_IN_PROGRESS'
  | 'REPRESENTATIVE_VISUAL_REVIEW'
  | 'WHOLE_APP_EXPANSION'
  | 'WHOLE_APP_VISUAL_FREEZE';

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
  'docs/design-production-state-machine-v1.md',
  'docs/design-targets/generated/design-production/documentation-readiness.json',
  'docs/design-targets/generated/design-production/workflow-state.json',
  'docs/design-targets/generated/design-production/human-decision-queue.json',
  'docs/design-targets/generated/design-production/generation-request-queue.json',
  'docs/design-targets/generated/design-production/reference-registry.json',
  'docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json',
  'docs/design-targets/generated/design-production/asset-provenance-registry-template.json',
] as const;

const allowedStates: WorkflowState[] = [
  'DOCUMENTATION_FOUNDATION',
  'WAVE1_GENERATION_APPROVED',
  'WAVE1_GENERATION_IN_PROGRESS',
  'WAVE1_DIRECTION_SELECTED',
  'WAVE1_COMPONENTS_APPROVED',
  'IMPLEMENTATION_READY',
  'IMPLEMENTATION_IN_PROGRESS',
  'REPRESENTATIVE_VISUAL_REVIEW',
  'WHOLE_APP_EXPANSION',
  'WHOLE_APP_VISUAL_FREEZE',
];

const transitions: Record<WorkflowState, WorkflowState[]> = {
  DOCUMENTATION_FOUNDATION: ['WAVE1_GENERATION_APPROVED'],
  WAVE1_GENERATION_APPROVED: ['WAVE1_GENERATION_IN_PROGRESS', 'DOCUMENTATION_FOUNDATION'],
  WAVE1_GENERATION_IN_PROGRESS: ['WAVE1_DIRECTION_SELECTED', 'WAVE1_GENERATION_APPROVED'],
  WAVE1_DIRECTION_SELECTED: ['WAVE1_GENERATION_APPROVED', 'WAVE1_COMPONENTS_APPROVED', 'WAVE1_GENERATION_IN_PROGRESS'],
  WAVE1_COMPONENTS_APPROVED: ['IMPLEMENTATION_READY', 'WAVE1_GENERATION_IN_PROGRESS'],
  IMPLEMENTATION_READY: ['IMPLEMENTATION_IN_PROGRESS', 'WAVE1_COMPONENTS_APPROVED'],
  IMPLEMENTATION_IN_PROGRESS: ['REPRESENTATIVE_VISUAL_REVIEW', 'IMPLEMENTATION_READY'],
  REPRESENTATIVE_VISUAL_REVIEW: ['WHOLE_APP_EXPANSION', 'IMPLEMENTATION_IN_PROGRESS'],
  WHOLE_APP_EXPANSION: ['WHOLE_APP_VISUAL_FREEZE', 'IMPLEMENTATION_IN_PROGRESS'],
  WHOLE_APP_VISUAL_FREEZE: [],
};

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
const workflow = readJson('docs/design-targets/generated/design-production/workflow-state.json');
const decisionQueue = readJson('docs/design-targets/generated/design-production/human-decision-queue.json');
const generationQueue = readJson('docs/design-targets/generated/design-production/generation-request-queue.json');
const referenceRegistry = readJson('docs/design-targets/generated/design-production/reference-registry.json');
const runtimeManifest = readJson('docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json');

const currentState = workflow.currentState as WorkflowState;

expect(allowedStates.includes(currentState), `unknown Heavy Design workflow state: ${String(currentState)}`);
expect(workflow.currentStateCode === `HD${allowedStates.indexOf(currentState)}`, 'workflow state code does not match current state');
expect(workflow.stateMachine === 'docs/design-production-state-machine-v1.md', 'workflow state-machine document mismatch');
expect(Array.isArray(workflow.allowedStates) && workflow.allowedStates.join(',') === allowedStates.join(','), 'workflow allowedStates mismatch');
expect(Array.isArray(workflow.allowedNextStates), 'workflow allowedNextStates must be an array');
expect((workflow.allowedNextStates ?? []).every((state: string) => transitions[currentState]?.includes(state as WorkflowState)), 'workflow contains an illegal next state');
expect((workflow.allowedNextStates ?? []).length === transitions[currentState]?.length, 'workflow allowedNextStates must exactly match the state-machine transitions');
expect(Array.isArray(workflow.stateHistory) && workflow.stateHistory.length > 0, 'workflow state history must not be empty');
expect(workflow.stateHistory?.at(-1)?.state === currentState, 'workflow state history must end at currentState');
expect(readiness.workflowState?.currentState === currentState, 'readiness workflow state must match workflow-state.json');

expect(readiness.selectedArtDirection?.optionId === 'A', 'selected Art Direction must remain option A');
expect(readiness.selectedArtDirection?.value === 'QUIET_NIGHT_SMALL_WARMTH', 'selected Art Direction value mismatch');
expect(readiness.selectedArtDirection?.humanSelected === true, 'selected Art Direction must be human-selected');
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

expect(decisionQueue.interactionMode === 'SINGLE_DECISION_CLICK_SELECT', 'decision queue interaction mode mismatch');
expect(decisionQueue.clickSelectPreferred === true, 'click-select must remain preferred');
expect(Array.isArray(decisionQueue.decisions) && decisionQueue.decisions.some((decision: JsonObject) =>
  decision.decisionId === 'HD-ART-DIRECTION-001' &&
  decision.selectedOptionId === 'A' &&
  decision.status === 'HUMAN_SELECTED'), 'Art Direction decision record is missing or inconsistent');

expect(generationQueue.generationAuthority === 'CHATGPT_HUMAN_SUPERVISED', 'generation authority mismatch');
expect(generationQueue.repositoryAgentMayGenerateImages === false, 'repository agent image generation must remain forbidden');
expect(generationQueue.oneBriefAtATime === true, 'generation must remain one brief at a time');

const requests = Array.isArray(generationQueue.requests) ? generationQueue.requests : [];
expect(requests.length === 3, 'generation request count must be 3');
expect(new Set(requests.map((request: JsonObject) => request.requestId)).size === 3, 'generation request IDs must be unique');
expect(requests.map((request: JsonObject) => request.order).join(',') === '1,2,3', 'generation request order must be 1,2,3');

const topRequest = requests.find((request: JsonObject) => request.requestId === 'W1-01-TOP');
expect(topRequest?.requiresCurrentRuntimeCapture === false, 'TOP must not require a nonexistent runtime capture');
expect(topRequest?.requiresRuntimeBaselineEvidence === true, 'TOP must require runtime baseline evidence');
expect(topRequest?.runtimeBaselineMode === 'ABSENCE_EVIDENCE', 'TOP baseline mode must be ABSENCE_EVIDENCE');

for (const requestId of ['W1-02-STAGE-SELECT', 'W1-03-LEVEL-UP']) {
  const request = requests.find((candidate: JsonObject) => candidate.requestId === requestId);
  expect(request?.requiresCurrentRuntimeCapture === true, `${requestId} must require its runtime capture`);
  expect(request?.runtimeBaselineMode === 'CAPTURE', `${requestId} baseline mode must be CAPTURE`);
}

expect(referenceRegistry.status === 'CURRENT_REFERENCE_CLASSIFICATION', 'reference registry status mismatch');
expect(referenceRegistry.rules?.fileNameFinalDoesNotMeanApproved === true, 'final filename must not imply approval');
expect(referenceRegistry.rules?.directWholeScreenRuntimeUseForbidden === true, 'direct whole-screen runtime use must remain forbidden');

expect(runtimeManifest.status === 'CURRENT_RUNTIME_BASELINE_MANIFEST', 'runtime comparison manifest status mismatch');
expect(runtimeManifest.summary?.screenCount === 13, 'runtime comparison manifest screen count must be 13');
expect(runtimeManifest.summary?.capturedScreenCount === 11, 'captured screen count must be 11');
expect(runtimeManifest.summary?.missingRuntimeScreenCount === 2, 'missing runtime screen count must be 2');
expect(runtimeManifest.summary?.comparisonReadyCount === 13, 'all 13 screens must have comparison evidence');

const screens = Array.isArray(runtimeManifest.screens) ? runtimeManifest.screens : [];
expect(new Set(screens.map((screen: JsonObject) => screen.screenId)).size === 13, 'runtime manifest screen IDs must be unique');
const topScreen = screens.find((screen: JsonObject) => screen.screenId === 'TOP');
expect(topScreen?.generationComparisonReady === true, 'TOP baseline evidence must remain comparison-ready');

function expectBoundary(key: string, expected: boolean): void {
  expect(readiness.boundaries?.[key] === expected, `readiness.boundaries.${key} must be ${String(expected)} in ${currentState}`);
}

switch (currentState) {
  case 'DOCUMENTATION_FOUNDATION':
    expect(readiness.status === 'DOCUMENTATION_FOUNDATION_PREPARED', 'documentation state requires DOCUMENTATION_FOUNDATION_PREPARED');
    expect(readiness.selectedArtDirection?.visuallyLocked === false, 'visual lock must remain false before generated comparison');
    expectBoundary('imageGenerationStarted', false);
    expectBoundary('unityDesignImplementationStarted', false);
    expectBoundary('runtimeMutation', false);
    expectBoundary('u49EvidenceMutation', false);
    expectBoundary('u50MayStart', false);
    expectBoundary('wholeAppHumanVisualAccepted', false);
    expectBoundary('pr76MustRemainDraft', true);
    expect(readiness.preGenerationGate?.gatePassed === false, 'pre-generation gate must remain false until an active brief is explicitly approved');
    expect(readiness.preGenerationGate?.activeWave1BriefHumanApproved === false, 'active Wave 1 brief must remain unapproved');
    expect(readiness.implementationGate?.gatePassed === false, 'implementation gate must remain false');
    expect(readiness.implementationGate?.humanImplementationStartApproval === false, 'human implementation start approval must remain false');
    expect(decisionQueue.pendingHumanDecisionCount === 0, 'documentation state must have no pending human decision');
    expect(decisionQueue.activeDecision === null, 'documentation state must have no active human decision');
    expect(generationQueue.queueStatus === 'PLANNED_NOT_STARTED', 'documentation state requires PLANNED_NOT_STARTED generation queue');
    expect(generationQueue.activeRequest === null, 'documentation state must have no active generation request');
    expect(generationQueue.imageGenerationStarted === false, 'documentation state must not have started image generation');
    expect(topRequest?.status === 'PREPARED_NOT_APPROVED', 'TOP request must remain PREPARED_NOT_APPROVED');
    expect(referenceRegistry.summary?.currentApprovedTargetCount === 0, 'documentation state must not claim a current-approved whole-screen target');
    expect(runtimeManifest.summary?.wholeAppHumanVisualAccepted === false, 'documentation state must not claim whole-app human visual acceptance');
    expect(topScreen?.runtimeState === 'MISSING' && topScreen?.capture === null, 'TOP must remain absent before implementation');
    break;

  case 'WAVE1_GENERATION_APPROVED':
    expectBoundary('imageGenerationStarted', false);
    expectBoundary('unityDesignImplementationStarted', false);
    expectBoundary('u49EvidenceMutation', false);
    expect(readiness.preGenerationGate?.gatePassed === true, 'generation-approved state requires pre-generation gate PASS');
    expect(readiness.preGenerationGate?.activeWave1BriefHumanApproved === true, 'generation-approved state requires active brief human approval');
    expect(generationQueue.queueStatus === 'READY_TO_GENERATE', 'generation-approved state requires READY_TO_GENERATE queue');
    expect(typeof generationQueue.activeRequest === 'string' && generationQueue.activeRequest.length > 0, 'generation-approved state requires one active request');
    expect(generationQueue.imageGenerationStarted === false, 'generation-approved state must not claim generation already started');
    break;

  case 'WAVE1_GENERATION_IN_PROGRESS':
    expectBoundary('imageGenerationStarted', true);
    expectBoundary('unityDesignImplementationStarted', false);
    expectBoundary('u49EvidenceMutation', false);
    expect(generationQueue.imageGenerationStarted === true, 'generation-in-progress state requires imageGenerationStarted=true');
    expect(typeof generationQueue.activeRequest === 'string' && generationQueue.activeRequest.length > 0, 'generation-in-progress state requires one active request');
    break;

  case 'WAVE1_DIRECTION_SELECTED':
    expectBoundary('imageGenerationStarted', true);
    expectBoundary('unityDesignImplementationStarted', false);
    expectBoundary('u49EvidenceMutation', false);
    expect(readiness.selectedArtDirection?.visuallyLocked === false, 'single-screen direction selection must not lock the whole visual language');
    break;

  case 'WAVE1_COMPONENTS_APPROVED':
    expectBoundary('imageGenerationStarted', true);
    expectBoundary('unityDesignImplementationStarted', false);
    expectBoundary('u49EvidenceMutation', false);
    expect(readiness.implementationGate?.componentCandidateApproved === true, 'component-approved state requires approved component candidates');
    expect(readiness.implementationGate?.cleanupComplete === true, 'component-approved state requires cleanupComplete=true');
    expect(readiness.implementationGate?.commercialUseReviewed === true, 'component-approved state requires commercialUseReviewed=true');
    expect(readiness.implementationGate?.assetLineageRecorded === true, 'component-approved state requires assetLineageRecorded=true');
    expect(readiness.implementationGate?.fullProductGlyphCoverageComplete === true, 'component-approved state requires full product glyph coverage');
    break;

  case 'IMPLEMENTATION_READY':
    expectBoundary('unityDesignImplementationStarted', false);
    expectBoundary('u49EvidenceMutation', false);
    expect(readiness.implementationGate?.gatePassed === true, 'implementation-ready state requires implementation gate PASS');
    expect(readiness.implementationGate?.humanImplementationStartApproval === true, 'implementation-ready state requires explicit human start approval');
    expect(typeof readiness.implementationGate?.implementationBranch === 'string', 'implementation-ready state requires implementation branch');
    break;

  case 'IMPLEMENTATION_IN_PROGRESS':
    expectBoundary('unityDesignImplementationStarted', true);
    expectBoundary('u49EvidenceMutation', false);
    expectBoundary('wholeAppHumanVisualAccepted', false);
    break;

  case 'REPRESENTATIVE_VISUAL_REVIEW':
    expectBoundary('unityDesignImplementationStarted', true);
    expectBoundary('u49EvidenceMutation', false);
    expectBoundary('wholeAppHumanVisualAccepted', false);
    expect(readiness.representativeReview?.captureSetComplete === true, 'representative review requires its capture set');
    break;

  case 'WHOLE_APP_EXPANSION':
    expectBoundary('unityDesignImplementationStarted', true);
    expectBoundary('u49EvidenceMutation', false);
    expectBoundary('wholeAppHumanVisualAccepted', false);
    expect(readiness.representativeReview?.humanApproved === true, 'whole-app expansion requires representative human approval');
    break;

  case 'WHOLE_APP_VISUAL_FREEZE':
    expectBoundary('unityDesignImplementationStarted', true);
    expectBoundary('u49EvidenceMutation', false);
    expectBoundary('wholeAppHumanVisualAccepted', true);
    expect(runtimeManifest.summary?.wholeAppHumanVisualAccepted === true, 'visual-freeze state requires whole-app human visual acceptance in the runtime manifest');
    expect(readiness.visualFreeze?.deviceHumanApproval === true, 'visual-freeze state requires device human approval');
    expect(readiness.visualFreeze?.unresolvedHumanRejectionCount === 0, 'visual-freeze state requires zero unresolved human rejections');
    break;
}

if (errors.length > 0) {
  throw new Error(`Heavy Design documentation check failed:\n- ${errors.join('\n- ')}`);
}

console.log(`Heavy Design documentation check passed: state=${currentState}, 13 screens, 3 Wave 1 briefs, Art Direction A, legal transitions enforced.`);
