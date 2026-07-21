import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const read = (path: string) => existsSync(path) ? readFileSync(path, 'utf8') : '';
const json = (path: string): Record<string, any> => { try { return JSON.parse(read(path)); } catch { failures.push(`JSON: ${path}`); return {}; } };
const check = (label: string, value: boolean) => { if (!value) failures.push(label); };
const root = 'unity/VampPonUnity/Assets/_Project';
const generated = 'docs/design-targets/generated/unity-u46';
const hardening = 'docs/design-targets/generated/unity-u46-1';

const files = {
  flow: `${root}/Scripts/Runtime/AppFlow/AppFlowCoordinator.cs`, command: `${root}/Scripts/Runtime/AppFlow/AppFlowCommand.cs`,
  pause: `${root}/Scripts/Runtime/Pause/RunPauseCoordinator.cs`, save: `${root}/Scripts/Runtime/Save/SaveService.cs`,
  snapshot: `${root}/Scripts/Runtime/Save/GameSaveSnapshot.cs`, migration: `${root}/Scripts/Runtime/Save/SaveMigration.cs`,
  validator: `${root}/Scripts/Runtime/Save/SaveValidator.cs`, result: `${root}/Scripts/Runtime/Result/RunResultSnapshot.cs`,
  resultBuilder: `${root}/Scripts/Runtime/Result/RunResultViewModelBuilder.cs`, resultPresenter: `${root}/Scripts/Runtime/Result/ResultPresenter.cs`,
  collection: `${root}/Scripts/Runtime/Collection/CollectionReadModelBuilder.cs`, collectionPresenter: `${root}/Scripts/Runtime/Collection/CollectionPresenter.cs`,
  catalog: `${root}/Scripts/UI/U46UiAssetCatalog.cs`, shell: `${root}/Scripts/Runtime/AppFlow/U46RuntimeShell.cs`,
  bootstrap: `${root}/Scripts/Runtime/U1Stage1SceneBootstrap.cs`, resultView: `${root}/Scripts/UI/Screens/ResultView.cs`,
  verification: `${root}/Scripts/Editor/U46ProductionCandidateVerification.cs`, bridge: `${root}/Scripts/Runtime/Diagnostics/U46AiSimulatorSmokeBridge.cs`,
  readiness: `${generated}/readiness.json`, appFlowEvidence: `${generated}/app-flow-result.json`, saveEvidence: `${generated}/save-service-result.json`,
  collectionEvidence: `${generated}/collection-result.json`, smokeEvidence: `${generated}/simulator-smoke-result.json`, visual: `${generated}/visual-review.json`,
  lineage: `${generated}/ui-generation/lineage.json`, runtimeReadiness: 'docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json',
};
for (const path of Object.values(files)) check(`exists ${path}`, existsSync(path));

const flow = read(files.flow), pause = read(files.pause), save = read(files.save), snapshot = read(files.snapshot);
const result = read(files.result), resultBuilder = read(files.resultBuilder), collection = read(files.collection);
const catalog = read(files.catalog), shell = read(files.shell), verification = read(files.verification), bridge = read(files.bridge);
const bootstrap = read(files.bootstrap), resultView = read(files.resultView);
const readiness = json(files.readiness), smoke = json(files.smokeEvidence), visual = json(files.visual), lineage = json(files.lineage), runtime = json(files.runtimeReadiness);
const hardeningReadiness = json(`${hardening}/readiness.json`), hardeningSmoke = json(`${hardening}/simulator-smoke-result.json`), hardeningVisual = json(`${hardening}/visual-review.json`);

for (const state of ['Boot', 'StageSelect', 'Running', 'LevelUpModal', 'Result', 'Collection']) check(`state ${state}`, flow.includes(`AppFlowState.${state}`) || read(`${root}/Scripts/Runtime/AppFlow/AppFlowState.cs`).includes(state));
check('transition validation', flow.includes('ValidTransitions') && flow.includes('Invalid app-flow transition'));
for (const command of ['StartStage', 'OpenLevelUp', 'CloseLevelUp', 'CompleteRun', 'RetryRun', 'ReturnToStageSelect', 'OpenCollection', 'CloseCollection', 'MarkCollectionSeen']) check(`command ${command}`, read(files.command).includes(command));
for (const reason of ['StageSelect', 'LevelUp', 'Result', 'Collection', 'SystemMenu', 'ApplicationPause']) check(`pause ${reason}`, read(`${root}/Scripts/Runtime/Pause/RunPauseReason.cs`).includes(reason));
check('pause set ownership', pause.includes('HashSet<RunPauseReason>') && pause.includes('ResetForRetry') && pause.includes('ResetToStageSelect'));

const views = ['StageSelectView.cs', 'ResultView.cs', 'CollectionView.cs'].map(x => read(`${root}/Scripts/UI/Screens/${x}`)).join('\n');
check('UI direct SceneManager forbidden', !views.includes('SceneManager'));
check('UI direct timeScale forbidden', !views.includes('Time.timeScale'));
check('UI direct file IO forbidden', !views.includes('System.IO') && !views.includes('File.'));
check('shell connects pause to battle/input/animation', shell.includes('SetRuntimePaused') && shell.includes('SetRuntimeInputBlocked') && shell.includes('SetRuntimePaused(pausedState)'));
check('normal HUD verification Result button removed', !bootstrap.includes('OpenVerificationResult') && !bootstrap.includes('CompleteVerificationRun') && !bootstrap.includes('PaperButton.Create(parent, "結果"'));
check('verification completion is Simulator guarded', shell.includes('#if VAMPPON_AI_SIMULATOR_SMOKE') && shell.includes('internal void CompleteVerificationRun'));
check('Simulator bridge drives Clear and Fail', bridge.includes('CompleteVerificationRun(true') && bridge.includes('CompleteVerificationRun(false'));

check('schema v1', snapshot.includes('CurrentSchemaVersion = 1'));
check('save persistent path', save.includes('Application.persistentDataPath'));
check('atomic temp and backup', save.includes('.tmp') && save.includes('.bak') && save.includes('File.Replace'));
check('corrupt recovery', save.includes('TryLoad(backupPath)'));
check('future migration guarded', read(files.validator).includes('Future save schema') && read(files.migration).includes('Future save schema'));
check('save snapshot explicit deep copy', snapshot.includes('GameSaveSnapshot DeepCopy()') && snapshot.includes('settings?.DeepCopy()'));
check('Result save is copy-on-write', flow.includes('save.Current.DeepCopy()') && !flow.includes('var current = save.Current;'));
check('Result save failure retained', flow.includes('LastPersistenceSucceeded') && flow.includes('LastPersistenceError') && flow.includes('save.Save(candidate, out error)'));
check('Result save outcome is not discarded', !flow.includes('save.Save(current, out _)') && !flow.includes('save.Save(candidate, out _)'));
for (const forbidden of ['Sprite', 'GameObject', 'Component', 'ScriptableObject', 'Transform', 'Prefab']) check(`save omits ${forbidden}`, !snapshot.includes(forbidden));

for (const key of ['runId', 'outcome', 'stageId', 'characterId', 'elapsedTime', 'defeatedEnemyCount', 'collectedFragments', 'reachedLevel', 'acquiredItemIds', 'rewardIds', 'newlyUnlockedIds', 'completedAt']) check(`result ${key}`, result.includes(key));
check('clear/fail models', resultBuilder.includes('RunOutcome.Clear') && resultBuilder.includes('RunOutcome.Fail'));
check('Result presenter command forwarding', read(files.resultPresenter).includes('AppFlowCommand.RetryRun') && read(files.resultPresenter).includes('ReturnToStageSelect'));
check('Result View does not invent reward fallbacks', !resultView.includes('new[] { "記憶の欠片", "夜の足跡" }') && !resultView.includes('"最初の帰還" : "今夜の記録を保存"'));
check('Result empty reward state', resultView.includes('持ち帰った記憶はありません'));
check('Result empty record state', resultView.includes('新しい記録はありません'));
check('Result persistence status visible', resultView.includes('SaveStatusLabel') && resultBuilder.includes('記録を保存できませんでした'));
check('Collection spoiler boundary', collection.includes('"???"') && collection.includes('まだ記憶は灯っていない'));
check('Collection seen/new/progress', collection.includes('NewIndicator') && collection.includes('collectionSeenIds') && collection.includes('Progress('));
check('Collection presenter command forwarding', read(files.collectionPresenter).includes('MarkCollectionSeen') && read(files.collectionPresenter).includes('CloseCollection'));

check('typed U46 catalog', catalog.includes('U46ResultUiAssetSet') && catalog.includes('U46CollectionUiAssetSet') && catalog.includes('U46CommonUiAssetSet'));
check('candidate catalog boundary', catalog.includes('AssetApprovalLevel.Candidate') && catalog.includes('ApprovedAsFinal => false') && catalog.includes('RuntimeApproved => false'));
check('U46 candidate path', catalog.includes('U46Candidates/UI/'));
for (const token of ['memory-page', 'rank-seal', 'stat-chip', 'reward-card', 'new-record-row', 'divider', 'primary-button', 'secondary-button', 'collection-page', 'tab-active', 'tab-inactive', 'entry-card', 'entry-locked', 'paper-clip', 'progress-track', 'progress-fill', 'new-badge', 'bottom-nav', 'paper-shadow', 'warm-lantern-accent', 'ink-corner', 'page-edge']) check(`asset ${token}`, catalog.includes(token));
check('9-slice verification', verification.includes('spriteBorder') && verification.includes('9-slice border'));
check('U46 filter rule explicit', verification.includes('importer.filterMode = FilterMode.Bilinear;'));
check('same-value filter ternary removed', !verification.includes('? FilterMode.Bilinear : FilterMode.Bilinear'));
check('shell subscriptions released', shell.includes('DisposeSubscriptions()') && shell.includes('PauseChanged -= ApplyPause') && shell.includes('StateChanged -= ApplyState') && shell.includes('OverlayOpened -= HandleLevelUpOpened') && shell.includes('OverlayClosed -= HandleLevelUpClosed') && shell.includes('OnDestroy() => DisposeSubscriptions()'));
check('reinitialize disposes before subscribe', shell.indexOf('DisposeSubscriptions();') < shell.indexOf('pause.PauseChanged += ApplyPause'));
check('four candidates and lineage', lineage.candidateCount === 4 && lineage.selectedCandidate === '02' && lineage.approvedAsFinal === false && lineage.runtimeApproved === false);

for (const screenshot of ['01-stage-select.png','02-collection-index.png','03-collection-locked.png','04-collection-detail.png','05-collection-seen.png','06-battle-return.png','07-result-clear.png','08-result-clear-compact.png','09-retry.png','10-result-fail.png','11-result-stage-select-return.png','12-large-result.png','13-large-collection.png']) check(`screenshot ${screenshot}`, existsSync(`${generated}/simulator-smoke/screenshots/${screenshot}`));
check('Simulator smoke passed', smoke.u46SimulatorSmokeReady === true && smoke.unhandledExceptionCount === 0 && smoke.crashDetected === false);
check('bridge define guarded', bridge.startsWith('#if VAMPPON_AI_SIMULATOR_SMOKE') && bridge.trimEnd().endsWith('#endif'));
check('visual P0/P1 zero', visual.p0Issues?.length === 0 && visual.p1Issues?.length === 0);
for (const screenshot of ['01-stage-select.png','02-result-clear-rewards.png','03-result-clear-empty.png','04-result-fail-rewards.png','05-result-fail-empty.png','06-result-save-failed.png','07-result-save-failed-retry.png','08-stage-select-return.png','09-collection-index.png','10-large-result.png','11-compact-result.png','12-no-verification-button.png']) check(`hardening screenshot ${screenshot}`, existsSync(`${hardening}/simulator-smoke/screenshots/${screenshot}`));
for (const key of ['verificationResultUiRemovedFromNormalBuild','resultEmptyStateUsesOnlyReadModelData','resultSaveCopyOnWriteReady','resultSaveFailureVisible','resultSaveFailurePreservesCurrent','eventSubscriptionsReleased','u46UiImportRuleSimplified','u46RegressionPassed','u46HardeningReady','u47Ready']) check(`hardening ${key} true`, hardeningReadiness[key] === true);
check('hardening Simulator smoke passed', hardeningSmoke.result === 'passed' && hardeningSmoke.unhandledExceptionCount === 0 && hardeningSmoke.crashDetected === false && hardeningSmoke.verificationButtonAbsent === true);
check('hardening visual P0/P1 zero', hardeningVisual.p0Issues?.length === 0 && hardeningVisual.p1Issues?.length === 0);

for (const key of ['sceneFlowCoordinatorImplemented','pauseCoordinatorImplemented','versionedSaveServiceImplemented','saveMigrationTestsReady','resultReadModelImplemented','collectionReadModelImplemented','u46ResultCandidateReady','u46CollectionCandidateReady','u46SimulatorSmokeReady','uiShellReady']) check(`${key} true`, readiness[key] === true);
for (const key of ['runtimeVisualReady','productionVisualAssetProviderConnected','productionCharacterAssetReady','productionEnemyAssetReady','candidateAssetsApprovedAsFinal','actualDeviceSmokeResultProvided','devicePlayableReady','mobileMetricsReady','audioMixerReady','audioLatencyMeasured','hapticMeasured','rcReady','productionApproved','u46UiAssetsApprovedAsFinal','u46UiAssetsRuntimeApproved']) check(`${key} false`, readiness[key] === false);
check('U46 candidate boundary remains historical after U48 production supersession', readiness.runtimeVisualCandidateReady === true && runtime.runtimeVisualCandidateReady === false && runtime.runtimeVisualReady === true);

const newText = Object.values(files).filter(x => x.endsWith('.cs') || x.endsWith('.json')).map(read).join('\n');
check('forbidden term absent', !newText.includes('黒曜化'));

if (failures.length) {
  console.error('Unity U46 app-flow/save/result/collection check failed');
  failures.forEach(x => console.error(`- ${x}`));
  process.exit(1);
}
console.log('Unity U46 app-flow/save/result/collection check passed: candidate shell and Simulator routes ready; device, final visual, audio, haptic, RC and production remain false.');
