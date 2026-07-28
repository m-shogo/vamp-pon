import { existsSync, readFileSync } from 'node:fs';

type JsonObject = Record<string, any>;

const packetDocumentPath = 'docs/design-generation-execution-packet-W1-01-TOP-v1.md';
const packetPath = 'docs/design-targets/generated/design-production/W1-01-TOP-execution-packet.json';
const queuePath = 'docs/design-targets/generated/design-production/generation-request-queue.json';
const workflowPath = 'docs/design-targets/generated/design-production/workflow-state.json';

const errors: string[] = [];

function expect(condition: unknown, message: string): void {
  if (!condition) errors.push(message);
}

function readJson(path: string): JsonObject {
  if (!existsSync(path)) {
    errors.push(`missing file: ${path}`);
    return {};
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as JsonObject;
  } catch (error) {
    errors.push(`invalid JSON: ${path}: ${String(error)}`);
    return {};
  }
}

expect(existsSync(packetDocumentPath), `missing packet document: ${packetDocumentPath}`);

const packet = readJson(packetPath);
const queue = readJson(queuePath);
const workflow = readJson(workflowPath);

expect(packet.schemaVersion === 1, 'packet schemaVersion must be 1');
expect(packet.requestId === 'W1-01-TOP', 'packet requestId mismatch');
expect(packet.document === packetDocumentPath, 'packet document path mismatch');
expect(packet.generationAuthority === 'CHATGPT_HUMAN_SUPERVISED', 'packet generation authority mismatch');
expect(packet.repositoryAgentMayGenerateImages === false, 'repository agent image generation must remain forbidden');
expect(packet.artDirection?.decisionId === 'HD-ART-DIRECTION-001', 'packet Art Direction decision mismatch');
expect(packet.artDirection?.optionId === 'A', 'packet Art Direction option must be A');
expect(packet.artDirection?.value === 'QUIET_NIGHT_SMALL_WARMTH', 'packet Art Direction value mismatch');

expect(packet.output?.candidateCount === 3, 'W1-01 must define exactly 3 candidates');
expect(packet.output?.separateImagesRequired === true, 'W1-01 candidates must be separate images');
expect(packet.output?.contactSheetAsPrimaryOutputForbidden === true, 'contact sheet must not be the primary generation output');
expect(packet.output?.masterWidth === 1170 && packet.output?.masterHeight === 2532, 'W1-01 master resolution must be 1170x2532');
expect(packet.output?.comparisonWidth === 390 && packet.output?.comparisonHeight === 844, 'W1-01 comparison viewport must be 390x844');
expect(packet.output?.textFree === true, 'W1-01 output must be text-free');
expect(packet.output?.logoFree === true, 'W1-01 output must be logo-free');
expect(packet.output?.pseudoTextForbidden === true, 'W1-01 pseudo text must be forbidden');
expect(packet.output?.wholeScreenRuntimeUseForbidden === true, 'whole-screen runtime use must remain forbidden');

expect(packet.baseline?.runtimeState === 'MISSING', 'TOP baseline runtimeState must be MISSING');
expect(packet.baseline?.runtimeCapture === null, 'TOP baseline runtime capture must be null');
expect(packet.baseline?.mode === 'ABSENCE_EVIDENCE', 'TOP baseline mode must be ABSENCE_EVIDENCE');
expect(Array.isArray(packet.baseline?.sources) && packet.baseline.sources.length >= 4, 'TOP baseline must have at least four evidence sources');

const candidates = Array.isArray(packet.candidates) ? packet.candidates : [];
expect(candidates.length === 3, 'packet candidate array must contain 3 candidates');
expect(new Set(candidates.map((candidate: JsonObject) => candidate.candidateId)).size === 3, 'packet candidate IDs must be unique');
expect(candidates.map((candidate: JsonObject) => candidate.order).join(',') === '1,2,3', 'packet candidate order must be 1,2,3');
expect(candidates.every((candidate: JsonObject) => candidate.characterAllowed === false), 'first TOP exploration must remain character-free');
expect(candidates.filter((candidate: JsonObject) => candidate.recommendedExploration === true).length === 1, 'exactly one TOP exploration should be recommended');

const bounds = packet.criticalContentBounds390x844;
expect(bounds?.left === 24 && bounds?.right === 366, 'critical horizontal bounds must be 24..366 at 390x844');
const zones = Array.isArray(bounds?.zones) ? bounds.zones : [];
expect(zones.length === 7, 'TOP packet must define 7 vertical zones');
expect(zones[0]?.yMin === 0, 'TOP zones must start at y=0');
expect(zones.at(-1)?.yMax === 844, 'TOP zones must end at y=844');
for (const zone of zones) {
  expect(Number.isInteger(zone.yMin) && Number.isInteger(zone.yMax) && zone.yMin >= 0 && zone.yMax <= 844 && zone.yMin < zone.yMax, `invalid TOP zone: ${JSON.stringify(zone)}`);
}
for (let index = 1; index < zones.length; index += 1) {
  expect(zones[index].yMin >= zones[index - 1].yMax, `TOP zones overlap: ${zones[index - 1].id} / ${zones[index].id}`);
}

const components = Array.isArray(packet.componentExtractionTargets) ? packet.componentExtractionTargets : [];
expect(components.length >= 10, 'TOP packet must define at least 10 component extraction targets');
expect(new Set(components).size === components.length, 'TOP component extraction targets must be unique');

expect(packet.technicalBudget?.parallaxBackgroundLayerMinimum === 2, 'TOP parallax minimum must be 2');
expect(packet.technicalBudget?.parallaxBackgroundLayerMaximum === 3, 'TOP parallax maximum must be 3');
expect(packet.technicalBudget?.fullScreenFogLayerMaximum === 1, 'TOP full-screen fog maximum must be 1');
expect(packet.technicalBudget?.alwaysOnParticleMaximum === 20, 'TOP always-on particle maximum must be 20');
expect(packet.technicalBudget?.realtimeBlurMaximum === 0, 'TOP realtime blur must remain 0');
expect(packet.technicalBudget?.fullScreenBloomMaximum === 0, 'TOP full-screen bloom must remain 0');

const comparisonFiles = Array.isArray(packet.comparisonPack?.requiredFiles) ? packet.comparisonPack.requiredFiles : [];
expect(packet.comparisonPack?.topAbsenceOverride === true, 'TOP comparison pack must use absence override');
expect(comparisonFiles.includes('02-current-runtime-absence-evidence.md'), 'TOP comparison pack must include runtime absence evidence');
expect(!comparisonFiles.includes('02-current-runtime-capture.png'), 'TOP comparison pack must not require a nonexistent runtime capture');
expect(comparisonFiles.includes('10-provenance.json'), 'TOP comparison pack must include provenance');

expect(packet.scoreGate?.dimensionCount === 10, 'TOP score gate must contain 10 dimensions');
expect(packet.scoreGate?.minimumPerDimension === 3, 'TOP minimum score per dimension must be 3');
expect(packet.scoreGate?.minimumTotal === 36, 'TOP minimum score total must be 36');
expect(packet.scoreGate?.forbiddenMotifMaximum === 0, 'TOP forbidden motif maximum must be 0');
expect(packet.scoreGate?.aiTextMaximum === 0, 'TOP AI text maximum must be 0');
expect(packet.scoreGate?.humanDirectionSelectionRequired === true, 'TOP requires human direction selection');

const requests = Array.isArray(queue.requests) ? queue.requests : [];
const topRequest = requests.find((request: JsonObject) => request.requestId === 'W1-01-TOP');
expect(topRequest?.executionPacket === packetDocumentPath, 'generation queue packet document mismatch');
expect(topRequest?.machineReadableExecutionPacket === packetPath, 'generation queue machine packet mismatch');
expect(topRequest?.executionPacketPrepared === true, 'generation queue must mark the TOP packet prepared');
expect(topRequest?.candidateCount === 3, 'generation queue TOP candidateCount must be 3');
expect(Array.isArray(topRequest?.candidateIds) && topRequest.candidateIds.join(',') === candidates.map((candidate: JsonObject) => candidate.candidateId).join(','), 'generation queue candidate IDs must match packet');
expect(topRequest?.runtimeBaselineMode === 'ABSENCE_EVIDENCE', 'generation queue TOP baseline mode mismatch');
expect(queue.generationStartRequirements?.activeExecutionPacketPrepared === true, 'generation queue must require the active execution packet');

const currentState = workflow.currentState;
expect(packet.currentWorkflowState === 'DOCUMENTATION_FOUNDATION', 'prepared packet currentWorkflowState must record HD0');
expect(packet.workflowStateRequired === 'WAVE1_GENERATION_APPROVED', 'packet required workflow state mismatch');
expect(packet.nextLegalTransition === 'WAVE1_GENERATION_APPROVED', 'packet next legal transition mismatch');

if (currentState === 'DOCUMENTATION_FOUNDATION') {
  expect(packet.status === 'PREPARED_NOT_HUMAN_APPROVED', 'HD0 packet status must be PREPARED_NOT_HUMAN_APPROVED');
  expect(packet.humanApproved === false, 'HD0 packet must not be human-approved');
  expect(packet.generationStarted === false, 'HD0 packet must not have started generation');
  expect(queue.activeRequest === null, 'HD0 generation queue must have no active request');
  expect(queue.imageGenerationStarted === false, 'HD0 generation queue must not have started image generation');
  expect(topRequest?.status === 'PREPARED_NOT_APPROVED', 'HD0 TOP queue status must be PREPARED_NOT_APPROVED');
}

if (errors.length > 0) {
  throw new Error(`W1-01 TOP execution packet check failed:\n- ${errors.join('\n- ')}`);
}

console.log(`W1-01 TOP execution packet check passed: state=${currentState}, candidates=3, baseline=ABSENCE_EVIDENCE, humanApproved=${String(packet.humanApproved)}.`);
