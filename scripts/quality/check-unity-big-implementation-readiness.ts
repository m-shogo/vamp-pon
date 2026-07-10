import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];

function read(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function check(label: string, ok: boolean): void {
  if (!ok) failures.push(label);
}

function checkExecutionEvidence(
  label: string,
  executed: unknown,
  result: unknown,
  commit: unknown,
): void {
  if (executed === true) {
    check(`${label} executed result is PASSED`, result === 'PASSED');
    check(`${label} executed commit recorded`, typeof commit === 'string' && commit.length >= 7);
    return;
  }

  check(`${label} executed flag false when not run`, executed === false);
  check(`${label} unexecuted result is NOT_RUN`, result === 'NOT_RUN');
  check(`${label} unexecuted commit empty`, commit === '');
}

const paths = {
  controlCenter: 'docs/unity-big-implementation-control-center-v1.md',
  ownership: 'docs/unity-runtime-ownership-contract-v1.md',
  review: 'docs/unity-big-implementation-readiness-review-2026-07-10.md',
  currentIndex: 'docs/unity-current-doc-index-2026-07-10.md',
  oldIndex: 'docs/unity-current-doc-index-2026-06-30.md',
  readiness: 'docs/design-targets/generated/unity-big-implementation/readiness.json',
  runtimeVisual: 'docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json',
  uiDesignSystem: 'docs/unity-ui-design-system-v1.md',
  assetConsistency: 'docs/asset-generation-consistency-system-v1.md',
  roadmap: 'docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md',
  canon: 'docs/181-current-production-canon.md',
  readme: 'README.md',
  docsIndex: 'docs/00-index.md',
  agents: 'AGENTS.md',
  claude: 'CLAUDE.md',
  packageJson: 'package.json',
};

for (const path of Object.values(paths)) check(`required file exists: ${path}`, existsSync(path));

let readiness: Record<string, any> = {};
let runtimeVisual: Record<string, any> = {};
try { readiness = JSON.parse(read(paths.readiness)); } catch { failures.push('big implementation readiness JSON parses'); }
try { runtimeVisual = JSON.parse(read(paths.runtimeVisual)); } catch { failures.push('runtime visual readiness JSON parses'); }

const controlCenter = read(paths.controlCenter);
const ownership = read(paths.ownership);
const review = read(paths.review);
const currentIndex = read(paths.currentIndex);
const oldIndex = read(paths.oldIndex);
const roadmap = read(paths.roadmap);
const canon = read(paths.canon);
const readme = read(paths.readme);
const docsIndex = read(paths.docsIndex);
const agents = read(paths.agents);
const claude = read(paths.claude);
const packageJson = read(paths.packageJson);

check('control center is adopted', controlCenter.includes('Status: adopted'));
check('control center points to ownership contract', controlCenter.includes('docs/unity-runtime-ownership-contract-v1.md'));
check('control center keeps U45.1 before U46', controlCenter.indexOf('### U45.1') >= 0 && controlCenter.indexOf('### U45.1') < controlCenter.indexOf('### U46'));
check('control center blocks bootstrap growth', controlCenter.includes('U1Stage1SceneBootstrap') && controlCenter.includes('U2BattleController'));
check('control center defines definition/runtime/save boundary', controlCenter.includes('Definition / Runtime / Save Boundary'));
check('control center defines stop conditions', controlCenter.includes('## Stop Conditions'));
check('control center exposes static preflight', controlCenter.includes('pnpm implementation:preflight:check'));
check('control center exposes full preflight', controlCenter.includes('pnpm implementation:preflight:full'));
check('control center uses correct 黒耀化 term', !controlCenter.includes('黒曜化'));

for (const phrase of [
  'AppFlow State',
  'Pause Ownership',
  'Command Boundary',
  'Definition Ownership',
  'Runtime State Ownership',
  'Save Ownership',
  'Result Read Model',
  'Collection Read Model',
  'Asset Provider Ownership',
  'Dependency Direction',
]) check(`ownership contract includes: ${phrase}`, ownership.includes(phrase));
check('ownership contract blocks UI direct Time.timeScale', ownership.includes('Time.timeScale'));
check('ownership contract requires schemaVersion', ownership.includes('schemaVersion'));
check('ownership contract saves IDs only', ownership.includes('displayName') && ownership.includes('保存しないもの'));
check('ownership contract keeps proof provider separate', ownership.includes('U5ProofAssetProvider') && ownership.includes('IsProofOnly=true'));
check('ownership contract uses correct 黒耀化 term', !ownership.includes('黒曜化'));

check('review records obsolete index risk', review.includes('Current Unity doc index was obsolete'));
check('review records monolith risk', review.includes('Bootstrap and Battle Controller are transitional monoliths'));
check('review records save not implemented', review.includes('Save architecture is documented but not implemented'));
check('review keeps production readiness false', review.includes('Production readiness: false'));

check('new current index is current', currentIndex.includes('Status: current'));
check('new current index starts from control center', currentIndex.includes('docs/unity-big-implementation-control-center-v1.md'));
check('new current index records U45.1 current', currentIndex.includes('Current: U45.1'));
check('new current index records Unity 6000.5.1f1', currentIndex.includes('6000.5.1f1'));
check('new current index does not claim Unity 6.5.1f1', !currentIndex.includes('Unity 6.5.1f1'));
check('old index is historical', oldIndex.includes('Status: historical / superseded'));
check('old index redirects to current', oldIndex.includes('unity-current-doc-index-2026-07-10.md'));

check('readiness evidence kind exact', readiness.evidenceKind === 'Unity big implementation control-plane readiness');
for (const key of [
  'controlCenterReady',
  'currentDocIndexReady',
  'runtimeOwnershipContractDefined',
  'navigationPauseContractDefined',
  'definitionRuntimeSaveBoundaryDefined',
  'assetApprovalBoundaryDefined',
  'uiDesignSystemBoundaryDefined',
  'runtimeVisualBoundaryDefined',
  'staticPreflightCheckerReady',
  'fullPreflightRunnerReady',
  'implementationFoundationReady',
  'largeImplementationMayStartUnderPhaseOrder',
]) check(`${key} true`, readiness[key] === true);

for (const key of [
  'sceneFlowCoordinatorImplemented',
  'pauseCoordinatorImplemented',
  'versionedSaveServiceImplemented',
  'saveMigrationTestsReady',
  'productionDataRegistryImplemented',
  'resultReadModelImplemented',
  'collectionReadModelImplemented',
  'productionVisualAssetProviderConnected',
  'characterDotRuntimeReady',
  'characterAnimationReady',
  'enemyDotRuntimeReady',
  'enemyAnimationReady',
  'runtimeVisualReady',
  'uiShellReady',
  'actualDeviceSmokeResultProvided',
  'devicePlayableReady',
  'mobileMetricsReady',
  'audioMixerReady',
  'audioLatencyMeasured',
  'hapticMeasured',
  'candidateAssetsApprovedAsFinal',
  'rcReady',
  'productionApproved',
]) check(`${key} remains false`, readiness[key] === false);

checkExecutionEvidence(
  'static preflight',
  readiness.staticPreflightExecutedAfterCommit,
  readiness.staticPreflightResult,
  readiness.staticPreflightCommit,
);
checkExecutionEvidence(
  'full preflight',
  readiness.fullPreflightExecutedAfterCommit,
  readiness.fullPreflightResult,
  readiness.fullPreflightCommit,
);
checkExecutionEvidence(
  'Unity compile after control-plane',
  readiness.unityCompileVerifiedAfterControlPlane,
  readiness.unityCompileResult,
  readiness.unityCompileCommit,
);

check('current required phase exact', readiness.currentRequiredPhase === 'U45.1 Character and Enemy Dot Runtime Pass');
check('actual device remains NOT_PROVIDED', readiness.actualDeviceSmokeResult === 'NOT_PROVIDED');
check('simulator route remains separately true', readiness.simulatorPlayableCandidateReady === true);
check('runtime visual current proof/static', runtimeVisual.runtimeVisualClassification === 'proof-static-single-sprite');
check('runtime visual remains false', runtimeVisual.runtimeVisualReady === false);

check('roadmap keeps U45.1 before U46', roadmap.includes('## U45.1') && roadmap.indexOf('## U45.1') < roadmap.indexOf('## U46'));
check('canon links control center', canon.includes('unity-big-implementation-control-center-v1.md'));
check('canon links ownership contract', canon.includes('unity-runtime-ownership-contract-v1.md'));
check('README links control center', readme.includes('unity-big-implementation-control-center-v1.md'));
check('README exposes current index', readme.includes('unity-current-doc-index-2026-07-10.md'));
check('docs index links control center', docsIndex.includes('unity-big-implementation-control-center-v1.md'));
check('AGENTS requires control center', agents.includes('unity-big-implementation-control-center-v1.md'));
check('AGENTS requires preflight', agents.includes('pnpm implementation:preflight:check'));
check('CLAUDE requires control center', claude.includes('unity-big-implementation-control-center-v1.md'));
check('CLAUDE requires preflight', claude.includes('pnpm implementation:preflight:check'));

check('package has static preflight script', packageJson.includes('implementation:preflight:check'));
check('package has full preflight script', packageJson.includes('implementation:preflight:full'));
check('UI design system remains present', read(paths.uiDesignSystem).includes('Status: adopted foundation'));
check('asset consistency remains present', read(paths.assetConsistency).includes('Asset Generation Contract'));

if (failures.length > 0) {
  console.error('Unity big implementation readiness check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Unity big implementation readiness check passed: control center, ownership, phase order, execution evidence and false product-readiness boundaries are consistent.');
