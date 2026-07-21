import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 startup check failed: ${message}`); };

const baseline = '642c87b26ca7713064c8172d2497613597caead9';
const audit = json('docs/design-targets/generated/unity-u48/asset-audit.json');
const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');
const completion = json('docs/design-targets/generated/unity-u48/completion-summary.json');
const u47 = json('docs/design-targets/generated/unity-u47/readiness.json');
const runtimeManifest = json('unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/runtime-dot-manifest.json');
const provider = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs');
const bootstrap = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs');
const battle = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs');
const finalized = readiness.u48Completed === true;

check(audit.sourceHead === baseline, 'asset audit baseline source head');
for (const [label, sourceHead] of [['readiness', readiness.sourceHead], ['completion', completion.sourceHead]] as const) {
  check(/^[0-9a-f]{40}$/.test(sourceHead), `${label} source head format`);
  try { execFileSync('git', ['merge-base', '--is-ancestor', sourceHead, 'HEAD'], { cwd: root, stdio: 'ignore' }); }
  catch { check(false, `${label} source head is an audited ancestor`); }
}
check(audit.auditPassed === true && audit.productionExpansionReady === false, 'audit result and incomplete boundary');
check(audit.summary.productionApproved === 0 && audit.summary.candidateOrPrototype === 14 && audit.summary.missing === 5 && audit.summary.proceduralPlaceholder === 3 && audit.summary.deferredToLaterPhase === 3, 'production/candidate/missing/procedural/deferred counts');
check(audit.items.some((item: { assetKey: string; status: string }) => item.assetKey === 'player-remaining-core5' && item.status === 'missing'), 'remaining Core5 gap');
check(audit.items.some((item: { assetKey: string; status: string }) => item.assetKey === 'enemy-remaining-families' && item.status === 'missing'), 'remaining enemy family gap');
check(runtimeManifest.approvedAsFinal === false && runtimeManifest.runtimeApproved === false, 'candidate manifest approval boundary');
check(finalized ? provider.includes('ApprovalLevel => AssetApprovalLevel.Production') && provider.includes('IsProductionApproved => true') : provider.includes('ApprovalLevel => AssetApprovalLevel.Candidate') && provider.includes('IsProductionApproved => false'), 'provider boundary matches phase state');
check(finalized ? bootstrap.includes('U48ProductionVisualBinder.Attach(gameObject);') : bootstrap.includes('ProceduralSpriteFactory.CreatePaperSprite') && bootstrap.includes('WarmLanternGlowPlaceholder'), 'background production/audit state');
check(finalized ? provider.includes('catalog.SpriteFor("pickup-exp")') : battle.includes('collectSprite = ProceduralSpriteFactory.CreateRadialSprite'), 'collect visual production/audit state');
check(u47.weaponRuntimeSliceReady === true && u47.passiveRuntimeSliceReady === true && u47.u47SimulatorSmokeReady === true && u47.u47GameplayCandidateReady === true && u47.productionApproved === true, 'U47 slice readiness preserved');
check(readiness.productionAssetAuditReady === true && readiness.approvedProductionAssetSetAvailable === finalized && readiness.productionVisualAssetProviderConnected === finalized, 'audit and current production state are explicit');
check(finalized ? readiness.status === 'U48_COMPLETED_PRODUCTION_VISUAL_RUNTIME_READY' && readiness.runtimeVisualReady === true && readiness.simulatorReady === true && readiness.physicalDeviceReady === false : ['IN_PROGRESS_BLOCKED', 'AWAITING_HUMAN_ASSET_APPROVAL'].includes(readiness.status) && readiness.runtimeVisualReady === false && readiness.simulatorReady === false && readiness.physicalDeviceReady === false, 'U48 phase readiness boundary');
check(readiness.audioReady === false && readiness.hapticReady === false && readiness.performanceReady === false && readiness.rcReady === false && readiness.productionApproved === false, 'later-phase and game-wide readiness remains false');
check(completion.auditCheckpointCommitAllowed === true && completion.auditCheckpointPushAllowed === true, 'audit checkpoint may be committed and pushed');
check(completion.approvalPackCheckpointCommitAllowed === true && completion.approvalPackCheckpointPushAllowed === true, 'blocked approval pack checkpoint may be committed and pushed');
check(completion.u48CompletionCommitAllowed === finalized && completion.u48CompletionPushAllowed === finalized, 'U48 completion commit follows verified readiness');
for (const file of ['device-matrix.json','audio-matrix.json','haptic-matrix.json','performance-metrics.json','completion-summary.json']) check(existsSync(resolve(root, `docs/design-targets/generated/unity-u48/${file}`)), `missing ${file}`);

console.log(`Unity U48 startup audit check passed: historical audit preserved; U48 finalized=${finalized}; downstream device/RC/product readiness remains false.`);
