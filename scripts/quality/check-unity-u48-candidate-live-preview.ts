import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 candidate live preview check failed: ${message}`); };

const providerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/U48AssetPreviewProvider.cs';
const binderPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/U48AssetPreviewSceneBinder.cs';
const bridgePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U48AssetPreviewVerificationBridge.cs';
const buildPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U48AssetPreviewIosSimulatorBuild.cs';
const uiBinderPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/U48BatchCUiPreviewBinder.cs';
const bootstrapPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs';
for (const path of [providerPath, binderPath, bridgePath, buildPath, uiBinderPath]) check(existsSync(resolve(root, path)), `missing ${path}`);

const provider = read(providerPath);
const binder = read(binderPath);
const bridge = read(bridgePath);
const build = read(buildPath);
const uiBinder = read(uiBinderPath);
const bootstrap = read(bootstrapPath);
const contracts = json('docs/design-targets/generated/unity-u48/approval-pack/ui-comparison-contracts.json');
const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');
const verification = json('docs/design-targets/generated/unity-u48/preview-foundation/verification-summary.json');
const runtimeCases = json('docs/design-targets/generated/unity-u48/preview-foundation/runtime-cases.json');

for (const [name, value] of [['provider', provider], ['binder', binder], ['bridge', bridge], ['uiBinder', uiBinder]]) {
  check(value.startsWith('#if VAMPPON_U48_ASSET_PREVIEW') && value.trimEnd().endsWith('#endif'), `${name} compile define isolation`);
  check(!value.includes('PlayerPrefs'), `${name} does not persist PlayerPrefs`);
}
check(provider.includes('VAMPPON_U48_PREVIEW_ENABLED') && provider.includes('VAMPPON_U48_ASSET_GROUP') && provider.includes('VAMPPON_U48_CANDIDATE_ID'), 'explicit environment gates');
check(provider.includes('matches.Length != 1') && provider.includes('candidate resolution failed'), 'unknown and duplicate candidates fail explicitly');
check(provider.includes('return normalProvider') && provider.includes('Environment.GetEnvironmentVariable(EnabledEnvironmentVariable) != "1"'), 'environment disabled uses normal provider');
check(provider.includes('IsProductionApproved => false') && provider.includes('ApprovalLevel => AssetApprovalLevel.Candidate'), 'preview cannot claim production approval');
check(provider.includes('Dispose()') && provider.includes('active = null'), 'static preview state cleanup');
check(binder.includes('StopAllCoroutines()') && binder.includes('Restore()') && binder.includes('OnDestroy'), 'coroutine and scene binding cleanup');
check(bridge.includes('VAMPPON_U48_PREVIEW_EXPECT_ACTIVE') && bridge.includes('Application.logMessageReceived -= OnLog') && bridge.includes('cleanupPassed'), 'verification expectation and event cleanup');
check(bootstrap.includes('#if VAMPPON_U48_ASSET_PREVIEW') && bootstrap.includes('U48AssetPreviewProvider.CreateOrDefault(normalProvider)') && bootstrap.includes('(assetProvider as System.IDisposable)?.Dispose()'), 'bootstrap guarded activation and cleanup');
check(build.includes('extraScriptingDefines = preview ? new[] { PreviewDefine, "VAMPPON_AI_SIMULATOR_SMOKE" }') && build.includes('CreateTemporaryCatalog') && build.includes('AssetDatabase.DeleteAsset(TempCatalogDirectory)'), 'build-local preview/U47 verification defines and temporary catalog cleanup');
check(build.includes('batchACount != 36 || batchBCount != 28 || batchCCount != 120') && build.includes('AssetDatabase.CopyAsset(sourceAssetPath, destinationAssetPath)'), 'Batch A 36, Batch B 28 and Batch C 120 candidates are copied only into the temporary preview build catalog');
check(uiBinder.includes('image.sprite = candidate') && uiBinder.includes('image.type = candidate.border') && uiBinder.includes('original.Image.raycastTarget = original.RaycastTarget'), 'UI binder changes only candidate presentation and restores interaction state');
check(uiBinder.includes('BindDynamicTargets') && uiBinder.includes('StopAllCoroutines()') && uiBinder.includes('Restore()'), 'dynamic UI binding and cleanup');
check(bridge.includes('VAMPPON_U48_PREVIEW_CAPTURE') && bridge.includes('standardFileResizeReuse') && bridge.includes('verificationPresentationOnly'), 'candidate-specific live capture is explicit and verification-only');
check(!existsSync(resolve(root, 'unity/VampPonUnity/Assets/_Project/Resources/U48Preview')), 'temporary preview catalog is not committed');

check(contracts.schemaVersion === 1 && contracts.activeComparisonGroupCount === 30 && contracts.comparisonGroups.length === 30, '30 active UI comparison units');
check(contracts.deprecatedGroups.length === 5 && contracts.deprecatedGroups.every((value: { historyStatus: string; splitInto: string[] }) => value.historyStatus === 'split-required-resolved' && value.splitInto.length > 0), 'five non-equivalent legacy groups retained as split-required-resolved history');
const groupIds = new Set<string>();
for (const value of contracts.comparisonGroups) {
  check(!groupIds.has(value.assetGroup), `duplicate comparison group ${value.assetGroup}`);
  groupIds.add(value.assetGroup);
  check(value.comparisonContract.samePurpose === true && value.comparisonContract.sameLogicalSize === true && value.comparisonContract.sameTextSafeArea === true && value.comparisonContract.sameRuntimePosition === true, `${value.assetGroup} equivalent comparison contract`);
  check(value.comparisonContract.sameInteractionOwner === true && value.comparisonContract.sameContentContract === true && value.comparisonContract.sameTapTargetContract === true, `${value.assetGroup} ownership/content/tap contract`);
  check(Array.isArray(value.comparisonContract.sameRequiredStates) && value.comparisonContract.sameRequiredStates.length > 0, `${value.assetGroup} required states`);
  check(value.approvalReviewReady === false, `${value.assetGroup} remains unready`);
}
check(contracts.approvedAsFinal === false && contracts.runtimeApproved === false && contracts.humanReviewStatus === 'pending', 'UI split approval remains pending');
check(verification.results.normalBatchmodeCompile === 'PASS' && verification.results.normalIosSimulatorExport === 'PASS' && verification.results.previewDefineCompileAndIosSimulatorExport === 'PASS' && verification.results.previewDefineXcodeReleaseSimulatorBuild === 'PASS', 'normal/define compile and Simulator builds verified');
check(verification.successfulRuntime.unhandledExceptionCount === 0 && verification.successfulRuntime.assertionFailureCount === 0 && verification.successfulRuntime.staleEvidenceCount === 0, 'successful runtime is clean');
check(verification.productionIsolation.temporaryBuildCatalogCommitted === false && verification.productionIsolation.productionProviderChanged === false && verification.productionIsolation.productionReadinessPromoted === false, 'production isolation evidence');
check(runtimeCases.cases.length === 4 && runtimeCases.cases.every((value: { casePassed: boolean; cleanupPassed: boolean }) => value.casePassed === true && value.cleanupPassed === true), 'four runtime cases and cleanup evidence');
check(runtimeCases.cases.some((value: { caseId: string; applicationResultPassed: boolean; failure?: string }) => value.caseId === 'unregistered-candidate' && value.applicationResultPassed === false && value.failure?.includes('matches=0')), 'unknown candidate explicitly fails');
check(runtimeCases.cases.some((value: { caseId: string; applicationResultPassed: boolean; failure?: string }) => value.caseId === 'registered-missing-resource' && value.applicationResultPassed === false && value.failure?.includes('preview sprite missing')), 'load exception cleanup case');
check(readiness.uiComparisonContractsReady === true && readiness.candidateLivePreviewFoundationReady === true, 'preview sub-foundation readiness recorded');
check(typeof readiness.productionAssetApprovalPackReady === 'boolean' && typeof readiness.approvedProductionAssetSetAvailable === 'boolean' && typeof readiness.runtimeVisualReady === 'boolean', 'preview foundation remains a separately recorded boundary');

console.log('Unity U48 candidate live preview foundation check passed: historical preview provider is compile/env gated, temporary-catalog only, cleanup guarded, and remains isolated from the fixed production catalog.');
