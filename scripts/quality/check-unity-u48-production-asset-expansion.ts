import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

check(audit.sourceHead === baseline && readiness.sourceHead === baseline, 'baseline source head');
check(audit.auditPassed === true && audit.productionExpansionReady === false, 'audit result and incomplete boundary');
check(audit.summary.productionApproved === 0 && audit.summary.candidateOrPrototype === 14 && audit.summary.missing === 5 && audit.summary.proceduralPlaceholder === 3 && audit.summary.deferredToLaterPhase === 3, 'production/candidate/missing/procedural/deferred counts');
check(audit.items.some((item: { assetKey: string; status: string }) => item.assetKey === 'player-remaining-core5' && item.status === 'missing'), 'remaining Core5 gap');
check(audit.items.some((item: { assetKey: string; status: string }) => item.assetKey === 'enemy-remaining-families' && item.status === 'missing'), 'remaining enemy family gap');
check(runtimeManifest.approvedAsFinal === false && runtimeManifest.runtimeApproved === false, 'candidate manifest approval boundary');
check(provider.includes('ApprovalLevel => AssetApprovalLevel.Candidate') && provider.includes('IsProductionApproved => false'), 'candidate provider boundary');
check(bootstrap.includes('ProceduralSpriteFactory.CreatePaperSprite') && bootstrap.includes('WarmLanternGlowPlaceholder'), 'procedural background/glow detected');
check(battle.includes('collectSprite = ProceduralSpriteFactory.CreateRadialSprite'), 'procedural collect feedback detected');
check(u47.weaponRuntimeSliceReady === true && u47.passiveRuntimeSliceReady === true && u47.u47SimulatorSmokeReady === true && u47.u47GameplayCandidateReady === true && u47.productionApproved === true, 'U47 slice readiness preserved');
check(readiness.productionAssetAuditReady === true && readiness.approvedProductionAssetSetAvailable === false && readiness.productionVisualAssetProviderConnected === false, 'audit ready is separate from production asset completion');
check(readiness.status === 'IN_PROGRESS' && readiness.runtimeVisualReady === false && readiness.simulatorReady === false && readiness.physicalDeviceReady === false, 'U48 visual/device readiness remains false');
check(readiness.audioReady === false && readiness.hapticReady === false && readiness.performanceReady === false && readiness.rcReady === false && readiness.productionApproved === false, 'later-phase and game-wide readiness remains false');
check(completion.auditCheckpointCommitAllowed === true && completion.auditCheckpointPushAllowed === true, 'audit checkpoint may be committed and pushed');
check(completion.u48CompletionCommitAllowed === false && completion.u48CompletionPushAllowed === false, 'U48 completion commit remains blocked');
for (const file of ['device-matrix.json','audio-matrix.json','haptic-matrix.json','performance-metrics.json','completion-summary.json']) check(existsSync(resolve(root, `docs/design-targets/generated/unity-u48/${file}`)), `missing ${file}`);

console.log('Unity U48 startup audit check passed: audit evidence is checkpoint-ready, while production asset completion and all downstream readiness remain false.');
