import { readFileSync } from 'node:fs';

import { assetFactoryPromptCatalog } from '../../src/game/data/assetFactoryCatalog.ts';
import { assetGenerationContractByKey } from '../../src/game/data/assetGenerationPolicy.ts';
import { commercialProductionProfiles } from '../../src/game/data/commercialProductionProfile.ts';
import { namedObjectVisualSharedSourceEntries } from '../../src/game/data/namedObjectVisualSharedSource.ts';
import { rewardSharedSourceEntries } from '../../src/game/data/progressionRewardSharedSource.ts';
import {
  assetFactorySharedSourceHandoffs,
  namedObjectGenerationHandoffs,
  rewardGenerationHandoffs,
  sharedSourceGenerationHandoffSummary,
  sharedSourceGenerationHandoffs,
  stageKeyArtGenerationHandoffs,
  starBeastGenerationHandoffs,
  toumonGenerationHandoffs,
  weaponGenerationHandoffs,
  webHeroGenerationTemplate,
} from '../../src/game/data/sharedSourceGenerationHandoff.ts';
import { stageVisualSharedSourceEntries } from '../../src/game/data/stageVisualSharedSource.ts';
import { starBeastVisualSharedSourceEntries } from '../../src/game/data/starBeastVisualSharedSource.ts';
import { weaponVisualSharedSourceEntries } from '../../src/game/data/weaponVisualSharedSource.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source Generation Handoffs] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(assetFactorySharedSourceHandoffs.length === assetFactoryPromptCatalog.length, `Asset Factory handoff coverage drift: ${assetFactorySharedSourceHandoffs.length}/${assetFactoryPromptCatalog.length}`);
assert(new Set(sharedSourceGenerationHandoffs.map((entry) => entry.handoffId)).size === sharedSourceGenerationHandoffs.length, 'duplicate generation handoff id');
assert(sharedSourceGenerationHandoffSummary.assetFactoryLinked === assetFactoryPromptCatalog.length, 'summary Asset Factory count drift');
assert(sharedSourceGenerationHandoffSummary.total === sharedSourceGenerationHandoffs.length, 'summary total drift');
assert(sharedSourceGenerationHandoffSummary.readyForCandidate + sharedSourceGenerationHandoffSummary.blocked === sharedSourceGenerationHandoffs.length, 'ready/blocked partition drift');
assert(sharedSourceGenerationHandoffSummary.approvedReferenceDefaultCount === 0, 'reference approval default must remain zero');
assert(sharedSourceGenerationHandoffSummary.approvedWebDefaultCount === 0, 'Web approval default must remain zero');
assert(sharedSourceGenerationHandoffSummary.approvedUnityDefaultCount === 0, 'Unity approval default must remain zero');
assert(sharedSourceGenerationHandoffSummary.productionReadyDefaultCount === 0, 'production-ready default must remain zero');
assert(sharedSourceGenerationHandoffSummary.runtimeApprovedDefaultCount === 0, 'runtime-approved default must remain zero');

for (const [index, handoff] of assetFactorySharedSourceHandoffs.entries()) {
  const record = assetFactoryPromptCatalog[index];
  const contract = assetGenerationContractByKey.get(record.key);
  assert(contract, `${record.key}: missing existing generation contract`);
  assert(handoff.existingAssetFactory?.promptCatalogKey === record.key, `${record.key}: prompt catalog relation drift`);
  assert(handoff.existingAssetFactory?.contractId === contract.contractId, `${record.key}: generation contract relation drift`);
  assert(handoff.sourceId === record.sourceId, `${record.key}: source ID drift`);
  assert(handoff.displayName === record.displayName, `${record.key}: displayName drift`);
  assert(handoff.target.sizeSpec === contract.sizeSpec, `${record.key}: size spec drift`);
  assert(handoff.target.transparentRequirement === contract.outputLock.alphaPolicy, `${record.key}: alpha policy drift`);
  assert(handoff.approval.oneShotFinalForbidden === true, `${record.key}: one-shot final boundary missing`);
  assert(handoff.approval.humanApprovalRequired === true, `${record.key}: human approval requirement missing`);
  assert(handoff.approval.approvedReferenceDefault === false, `${record.key}: reference approval inferred`);
  assert(handoff.approval.approvedUnityDefault === false, `${record.key}: Unity approval inferred`);
  assert(handoff.approval.runtimeApprovedDefault === false, `${record.key}: runtime approval inferred`);
  assert(handoff.requiredFacts.includes(record.prompt), `${record.key}: existing prompt must remain a required fact`);
  assert(handoff.negativeHints.includes(record.negativePrompt), `${record.key}: existing negative prompt must remain linked`);
}

for (const handoff of sharedSourceGenerationHandoffs) {
  assert(handoff.handoffVersion === 1, `${handoff.handoffId}: version drift`);
  assert(handoff.authorityFacts.length > 0, `${handoff.handoffId}: authority facts missing`);
  assert(handoff.requiredFacts.length > 0, `${handoff.handoffId}: required facts missing`);
  assert(handoff.allowedInterpretation.length > 0, `${handoff.handoffId}: allowed interpretation missing`);
  assert(handoff.forbiddenInterpretation.length > 0, `${handoff.handoffId}: forbidden interpretation missing`);
  assert(handoff.negativeHints.length > 0, `${handoff.handoffId}: negative hints missing`);
  assert(handoff.target.sizeSpec.length > 0 && handoff.target.aspectRatio.length > 0, `${handoff.handoffId}: target size/aspect missing`);
  assert(handoff.target.safeCrop.length > 0, `${handoff.handoffId}: safe-crop rule missing`);
  assert(handoff.target.mobileRequirements.length > 0, `${handoff.handoffId}: mobile rule missing`);
  assert(handoff.approval.approvedReferenceDefault === false, `${handoff.handoffId}: reference approval default must be false`);
  assert(handoff.approval.approvedWebDefault === false, `${handoff.handoffId}: Web approval default must be false`);
  assert(handoff.approval.approvedUnityDefault === false, `${handoff.handoffId}: Unity approval default must be false`);
  assert(handoff.approval.productionReadyDefault === false, `${handoff.handoffId}: production approval default must be false`);
  assert(handoff.approval.runtimeApprovedDefault === false, `${handoff.handoffId}: runtime approval default must be false`);
  if (handoff.approval.sourceReadiness === 'READY_FOR_CANDIDATE') {
    assert(handoff.approval.blockedReasons.length === 0, `${handoff.handoffId}: ready handoff has blockers`);
  } else {
    assert(handoff.approval.blockedReasons.length > 0, `${handoff.handoffId}: blocked handoff lacks reason`);
  }
  assert(handoff.forbiddenInterpretation.some((rule) => /one-shot final/i.test(rule)), `${handoff.handoffId}: one-shot final prohibition missing`);
  assert(handoff.forbiddenInterpretation.some((rule) => /Web composition as a Unity runtime asset/i.test(rule)), `${handoff.handoffId}: Web/Unity output separation missing`);
}

assert(starBeastGenerationHandoffs.length === starBeastVisualSharedSourceEntries.length, 'Star Beast handoff coverage drift');
assert(starBeastGenerationHandoffs.length === 21, `Star Beast handoff count drift: ${starBeastGenerationHandoffs.length}`);
const renStarBeast = starBeastGenerationHandoffs.find((entry) => /:star-beast:ren:/.test(entry.handoffId));
assert(renStarBeast?.approval.sourceReadiness === 'BLOCKED', 'Ren Star Beast must remain launch-generation blocked');
assert(renStarBeast.approval.blockedReasons.includes('OFFICIAL_RESERVE_NOT_LAUNCH_ELIGIBLE'), 'Ren Star Beast Reserve blocker missing');
for (const handoff of starBeastGenerationHandoffs.filter((entry) => entry !== renStarBeast)) {
  assert(handoff.approval.sourceReadiness === 'READY_FOR_CANDIDATE', `${handoff.handoffId}: Current20 Star Beast candidate readiness missing`);
}

assert(weaponGenerationHandoffs.length === weaponVisualSharedSourceEntries.length, 'Weapon handoff coverage drift');
assert(weaponGenerationHandoffs.every((entry) => entry.approval.sourceReadiness === 'READY_FOR_CANDIDATE'), 'Weapon reference handoffs should be candidate-ready');
assert(weaponGenerationHandoffs.every((entry) => entry.target.transparentRequirement === 'required'), 'Weapon object masters require transparency');

assert(stageKeyArtGenerationHandoffs.length === stageVisualSharedSourceEntries.length, 'Stage key-art handoff coverage drift');
assert(stageKeyArtGenerationHandoffs.length === 20, `Stage key-art count drift: ${stageKeyArtGenerationHandoffs.length}`);
assert(stageKeyArtGenerationHandoffs.every((entry) => entry.approval.sourceReadiness === 'READY_FOR_CANDIDATE'), 'Stage key art should be candidate-ready');
assert(stageKeyArtGenerationHandoffs.every((entry) => entry.forbiddenInterpretation.some((rule) => /station|railway/i.test(rule)), 'Stage key art must guard unresolved station/railway identity');

assert(namedObjectGenerationHandoffs.length === namedObjectVisualSharedSourceEntries.length, 'Named Object handoff coverage drift');
assert(namedObjectGenerationHandoffs.length === 21, `Named Object handoff count drift: ${namedObjectGenerationHandoffs.length}`);
assert(namedObjectGenerationHandoffs.every((entry) => entry.approval.sourceReadiness === 'BLOCKED'), 'Named Object candidate geometry must remain blocked');
assert(namedObjectGenerationHandoffs.every((entry) => entry.approval.blockedReasons.includes('CANDIDATE_OBJECT_GEOMETRY_REQUIRES_EXPLICIT_VISUAL_APPROVAL')), 'Named Object geometry approval blocker missing');

assert(rewardGenerationHandoffs.length === rewardSharedSourceEntries.length, 'Reward handoff coverage drift');
assert(rewardGenerationHandoffs.length === 40, `Reward handoff count drift: ${rewardGenerationHandoffs.length}`);
assert(rewardGenerationHandoffs.every((entry) => entry.approval.sourceReadiness === 'BLOCKED'), 'Reward icon visual authority must remain blocked');

assert(toumonGenerationHandoffs.length === commercialProductionProfiles.length, 'Toumon handoff coverage drift');
assert(toumonGenerationHandoffs.length === 21, `Toumon handoff count drift: ${toumonGenerationHandoffs.length}`);
assert(toumonGenerationHandoffs.every((entry) => entry.approval.sourceReadiness === 'BLOCKED'), 'Toumon final geometry must remain blocked');
assert(toumonGenerationHandoffs.every((entry) => entry.approval.blockedReasons.includes('FINAL_TOUMON_VECTOR_NOT_DRAWN')), 'Toumon final-vector blocker missing');

assert(webHeroGenerationTemplate.approval.sourceReadiness === 'BLOCKED', 'Web hero template must remain blocked before reference/page authority');
assert(webHeroGenerationTemplate.approval.blockedReasons.includes('REQUIRES_APPROVED_REFERENCE_SET_AND_PAGE_COMPOSITION_AUTHORITY'), 'Web hero blocker missing');
assert(webHeroGenerationTemplate.target.sizeSpec.includes('2560x1440') && webHeroGenerationTemplate.target.sizeSpec.includes('1440x2560'), 'Web hero desktop/mobile target matrix missing');

const serialized = JSON.stringify({ schemaVersion: 1, summary: sharedSourceGenerationHandoffSummary, handoffs: sharedSourceGenerationHandoffs });
assert(serialized.length > 100_000, `serialized handoff manifest unexpectedly small: ${serialized.length}`);
const parsed = JSON.parse(serialized) as { handoffs: unknown[] };
assert(parsed.handoffs.length === sharedSourceGenerationHandoffs.length, 'handoff manifest JSON serialization count drift');

const exporterSource = readFileSync('scripts/export-shared-source-generation-handoffs.ts', 'utf8');
assert(exporterSource.includes('shared-source-generation-handoff-v1.json'), 'CLI default output path missing');
assert(exporterSource.includes('JSON.stringify(document, null, 2)'), 'CLI deterministic JSON writer missing');

console.log(
  `Shared Source Generation Handoffs: PASS (` +
    `assetFactory=${assetFactorySharedSourceHandoffs.length}, starBeast=${starBeastGenerationHandoffs.length}, ` +
    `weapon=${weaponGenerationHandoffs.length}, stageKeyArt=${stageKeyArtGenerationHandoffs.length}, ` +
    `namedObject=${namedObjectGenerationHandoffs.length}, reward=${rewardGenerationHandoffs.length}, ` +
    `toumon=${toumonGenerationHandoffs.length}, total=${sharedSourceGenerationHandoffs.length}, ` +
    `ready=${sharedSourceGenerationHandoffSummary.readyForCandidate}, blocked=${sharedSourceGenerationHandoffSummary.blocked})`,
);
