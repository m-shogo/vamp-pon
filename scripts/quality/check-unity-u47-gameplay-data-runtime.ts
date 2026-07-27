import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const check = (condition: unknown, message: string) => { if (!condition) throw new Error(`U47 check failed: ${message}`); };
const runtimeResult = (captureId: string) => JSON.parse(read(`docs/design-targets/generated/unity-u47/simulator-smoke/runtime-results/${captureId}.json`));
const data = JSON.parse(read('data/unity/u47-stage1-gameplay.json'));
const expected = ['night_pencil','black_ink_bottle','streetlamp_ring','unforgotten_name','dawn_ink_lamp'];
check(JSON.stringify(data.weapons.map((v: {id:string}) => v.id)) === JSON.stringify(expected), 'exact weapon slice');
check(data.character.id === 'yui' && data.character.initialWeaponId === 'night_pencil', 'Yui initial weapon');
check(data.inventoryLimits.weaponSlots === 5 && data.inventoryLimits.passiveSlots === 5 && data.inventoryLimits.rareItemSlots === 2, 'shared slot limits');
check(data.weapons.filter((v: {id:string}) => ['night_pencil','black_ink_bottle','streetlamp_ring'].includes(v.id)).every((v: {maxLevel:number}) => v.maxLevel === 7), 'Web max levels');
check(data.evolutions.every((v: {requiredWeaponLevel:number}) => v.requiredWeaponLevel === 7), 'evolution derives definition max');
for (const path of ['scripts/unity/export-u47-stage1-gameplay-data.ts','data/unity/u47-stage1-gameplay.summary.json','unity/VampPonUnity/Assets/_Project/Scripts/Editor/U47Stage1GameplayDataImporter.cs','unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Definitions/Stage1GameplayDataRegistry.cs','unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/State/RunGameplayState.cs','unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs']) check(existsSync(resolve(root,path)), `missing ${path}`);
const services = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/GameplayServices.cs');
check(services.includes('SeededRandomSource') && services.includes('DeepCopy') && services.includes('KokuyouActivationPolicy.Manual'), 'deterministic/atomic/manual policies');
check(services.includes('U47GameplayCandidateConfig.RevivalHpRatio') && services.includes('RemoveAll(v => v.Id == "dawn_ticket")'), 'revival consumes ticket');
check(services.includes('KokuyouChargePerAppliedDamage') && services.includes('KokuyouDamageMultiplier = 1.5f'), 'damage charge and multiplier');
const state = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/State/RunGameplayState.cs');
check(state.includes('RunGameplayScenarioOptions.Production(registry)') && state.includes('eligibleWeapons-1') && state.includes('eligiblePassives-1'), 'production default and explicit Simulator capacity');
check(state.includes('registry.Weapons.Count(v=>!v.IsEvolved)') && !state.includes('Math.Min(5'), 'evolved weapons excluded without deriving production limit from Registry count');
const capacityEvidence = JSON.parse(read('docs/design-targets/generated/unity-u47/simulator-capacity-result.json'));
check(capacityEvidence.passed === true && capacityEvidence.productionCapacity.weapon === 5 && capacityEvidence.productionCapacity.passive === 5, 'Simulator production capacity proof');
check(capacityEvidence.verificationCapacity.weapon === 2 && capacityEvidence.verificationCapacity.passive === 3 && capacityEvidence.registeredDistinctOnly === true, 'Simulator isolated valid replacement proof');
const validateReplacement = (value: Record<string, unknown>, before: string[], offered: string, removed: string, after: string[], capacity: number) => {
  check(JSON.stringify(value.beforeSlotIds) === JSON.stringify(before), `${offered} before slots`);
  check(value.offeredCandidateId === offered && value.replacementRequired === true, `${offered} replacement offer`);
  check(JSON.stringify(value.displayedReplacementSlotIds) === JSON.stringify(before), `${offered} displayed slots`);
  check(value.selectedReplacementSlotIndex === 1 && value.removedDefinitionId === removed && value.addedDefinitionId === offered, `${offered} selected transition`);
  check(JSON.stringify(value.afterSlotIds) === JSON.stringify(after), `${offered} after slots`);
  check(value.capacityBefore === capacity && value.capacityAfter === capacity, `${offered} capacity preserved`);
  check(value.registryValidation === true && value.duplicateCount === 0 && value.unknownDefinitionCount === 0, `${offered} registered distinct ids`);
};
validateReplacement(capacityEvidence.weaponReplacement, ['night_pencil','black_ink_bottle'], 'streetlamp_ring', 'black_ink_bottle', ['night_pencil','streetlamp_ring'], 2);
validateReplacement(capacityEvidence.passiveReplacement, ['old_ticket','gold_compass','travel_badge'], 'white_margin', 'gold_compass', ['old_ticket','travel_badge','white_margin'], 3);
for (const file of ['02-weapon-replacement-ui.png','03-weapon-slot-1-selected.png','06-passive-replacement-ui.png','07-passive-slot-1-selected.png']) check(existsSync(resolve(root, `docs/design-targets/generated/unity-u47/simulator-smoke/replacement-screenshots/${file}`)), `missing replacement screenshot ${file}`);
const u2 = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs');
check(!u2.includes('SaveService') && !u2.includes('LevelUpCandidateService'), 'U2 ownership boundary');
check(u2.includes('MaxWorldSize = 0.34f') && u2.includes('MaxWorldSize / largestBound') && u2.includes('float.IsFinite') && u2.includes('Mathf.Clamp'), 'candidate crystal finite/clamped world occupancy cap');
for (const id of ['22-compact-gameplay', '23-large-gameplay']) {
  const bounds = runtimeResult(id).details;
  check(bounds.sourceSpriteWidthPx === 1254 && bounds.pixelsPerUnit === 180, `${id} source sprite facts`);
  check(bounds.calculatedPreClampScale === 0.048804 && bounds.appliedScale === 0.048804 && bounds.scaleFinite === true, `${id} finite scale evidence`);
  check(bounds.finalWorldWidth <= 0.34 && bounds.finalWorldHeight <= 0.34 && bounds.maxWorldDimension <= 0.34, `${id} final bounds`);
  check(bounds.colliderBefore === bounds.colliderAfter && bounds.pickupRadiusChanged === false, `${id} collider/pickup unchanged`);
}

const bridge = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U47AiSimulatorSmokeBridge.cs');
check(bridge.startsWith('#if VAMPPON_AI_SIMULATOR_SMOKE') && bridge.trimEnd().endsWith('#endif'), 'Simulator bridge compile isolation');
check(bridge.includes('VAMPPON_U47_AI_SIMULATOR_SMOKE') && bridge.includes('Application.platform != RuntimePlatform.IPhonePlayer'), 'explicit environment/platform launch gate');
check(bridge.includes('StopAllCoroutines(); RestoreProduction()') && bridge.includes('Application.logMessageReceived -= OnLog') && bridge.includes('Destroy(gameObject)'), 'failure/success cleanup');
check(bridge.includes('ResetScenario') && bridge.includes('RestoreProduction(); shell.ReinitializeForVerification()'), 'route state cleanup');
check(!bridge.includes('unknown_') && !bridge.includes('duplicate_') && !bridge.includes('Add(new WeaponRuntimeState'), 'no unknown/duplicate/direct runtime injection');

const overlay = read('unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs');
const levelUpController = read('unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpDemoController.cs');
const replacementModel = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/ReplacementInteractionModel.cs');
check(overlay.includes('SafeAreaFitter') && overlay.includes('ClearCards()') && overlay.includes('Destroy(cardContainer.GetChild(i).gameObject)'), 'replacement overlay safe area/listener cleanup');
check(replacementModel.includes('registry.GetWeapon(id).DisplayName') && replacementModel.includes('registry.GetPassive(id).DisplayName'), 'replacement Registry display names');
check(overlay.includes('ReplacementConfirmButton') && overlay.includes('SetInteractable(model.ConfirmEnabled)') && levelUpController.includes('ReplacementInteractionModel.TryCreate'), 'replacement two-step interaction');
check(levelUpController.includes('gameplay.LevelUpRequested -= TriggerLevelUp') && levelUpController.includes('gameplay.LevelUpRequested += TriggerLevelUp'), 'level-up event subscription replacement');

const bootstrap = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs');
check(bootstrap.includes('sortingOrder = -100') && bootstrap.includes('sortingOrder = -20') && bootstrap.includes('sortingOrder = 20') && bootstrap.includes('sortingOrder = 90'), 'background/player/HUD sorting contract');
check(u2.includes('sortingOrder = 15'), 'enemy sorting contract');
const playerController = read('unity/VampPonUnity/Assets/_Project/Scripts/Player/PlayerController.cs');
const yuiAnimator = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/YuiSpriteAnimator.cs');
const visualProvider = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs');
const inventoryHud = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/U47InventoryHudPresenter.cs');
check(playerController.includes('activeTouchId') && playerController.includes('touch.press.wasPressedThisFrame') &&
  playerController.includes('StickRadiusScreenRatio') && playerController.includes('DeadZoneScreenRatio'), 'physical-device touch owns one finger and scales by screen');
check(!playerController.includes('Mathf.Sin(Time.time * 8.5f)') && yuiAnimator.includes('RuntimeCharacterAnimationState.Idle') &&
  yuiAnimator.includes('animationSet.FrameDuration * 4f'), 'player has no perpetual scale bob and keeps a calmer explicit idle animation');
check(visualProvider.includes('R("yui_idle_l_00","yui_idle_l_01"),R("yui_idle_r_01")') &&
  !visualProvider.includes('R("yui_idle_r_00","yui_idle_r_01")'), 'known left-facing frame is excluded from the production right-idle route');
check(inventoryHud.includes('"KokuyouActivationButton"') && inventoryHud.includes('kokuyouButton.onClick.AddListener(ActivateKokuyou)') &&
  inventoryHud.includes('gameplay?.ActivateKokuyou()') && inventoryHud.includes('KokuyouPhase.Ready'), 'normal gameplay exposes the manual Kokuyou command');
for (const id of ['08-black-ink-area', '09-streetlamp-area', '11-dawn-ink-lamp']) {
  const area = runtimeResult(id);
  check(area.details.executorType === 'GroundArea' && area.details.actorSortingOrder === 8, `${id} executor/sorting`);
  check(area.details.actorSortingOrder > -20 && area.details.actorSortingOrder < 15 && area.details.hudBehind === true, `${id} background/actor/HUD order`);
  check(area.details.effectRadius > 0 && area.details.damagePerSecond > 0 && area.details.damageTickCountFinal > 0 && area.details.tickInterval === 0.25, `${id} DoT values`);
  check(area.details.duration > 0 && area.details.durationEndedAndDespawned === true, `${id} duration/despawn`);
  check(area.details.pickupProcessing === false && area.details.duplicateExecutorCount === 0 && area.checks.inventoryUnchanged === true, `${id} no pickup/duplicate/inventory mutation`);
  check(area.unhandledExceptionCount === 0 && area.assertionFailureCount === 0 && area.passed === true, `${id} runtime pass`);
}

const revival = runtimeResult('15-revival-30-percent');
check(revival.details.ticketDefinitionId === 'dawn_ticket' && revival.details.ticketCountBefore === 1 && revival.details.ticketCountAfter === 0, 'dawn ticket consumption');
check(revival.details.beforeHp === 110 && revival.details.maxHp === 110 && revival.details.incomingLethalDamage === 220, 'revival input evidence');
check(revival.details.expectedRevivedHp === 33 && revival.details.actualRevivedHp === 33 && revival.details.roundingRule.includes('floor'), '30 percent revival result');
check(revival.details.revivalTriggered === true && revival.details.gameOverSuppressed === true && revival.details.gameplayContinued === true && revival.details.secondRevivalPrevented === true, 'revival state transition');
check(!services.includes('Snapshot') && !services.includes('SaveService') && !services.includes('Resume'), 'no snapshot resume/save-load implementation');

const captureSummary = JSON.parse(read('docs/design-targets/generated/unity-u47/simulator-smoke/summary.json'));
const manifest = JSON.parse(read('docs/design-targets/generated/unity-u47/simulator-smoke/manifest.json'));
check(captureSummary.expectedCaptureCount === 23 && captureSummary.completedCaptureCount === 23 && captureSummary.unhandledExceptionCount === 0 && captureSummary.assertionFailureCount === 0 && captureSummary.passed === true, '23-capture runtime summary');
check(manifest.expectedCaptureCount === 23 && manifest.entries.length === 23 && manifest.semanticRouteCount === 11 && manifest.semanticRouteCount !== 23, 'capture/semantic route separation');
const result = runtimeResult('20-result-u47-summary');
check(result.checks.resultSnapshotBuilt === true && result.checks.resultViewModelBuilt === true && result.checks.finalInventoryMatches === true && result.checks.registryDisplayNames === true, 'Result summary and replacement inventory reflection');
check(JSON.stringify(result.details.finalInventoryIds) === JSON.stringify(['night_pencil','streetlamp_ring','old_ticket','travel_badge','white_margin','dawn_ticket']), 'Result final inventory ids');
for (const file of ['contact-sheet-01-captures-01-12.png', 'contact-sheet-02-captures-13-23.png']) check(statSync(resolve(root, `docs/design-targets/generated/unity-u47/simulator-smoke/${file}`)).size > 0, `contact sheet ${file}`);
const visualReview = JSON.parse(read('docs/design-targets/generated/unity-u47/simulator-smoke/visual-review.json'));
check(visualReview.reviewedCaptureCount === 23 && visualReview.result === 'PASS' && Object.values(visualReview.checks).every(Boolean), '23-capture visual review');

const readiness = JSON.parse(read('docs/design-targets/generated/unity-u47/readiness.json'));
for (const key of ['weaponRuntimeSliceReady','passiveRuntimeSliceReady','u47SimulatorSmokeReady','u47GameplayCandidateReady','productionApproved']) check(readiness[key] === true, `${key} completion readiness`);
check(readiness.runtimeVisualReady === false && readiness.productionCharacterAssetReady === false && readiness.productionEnemyAssetReady === false && readiness.candidateAssetsApprovedAsFinal === false, 'candidate/final visual boundaries');
check(readiness.u48Status === 'U48_BLOCKED', 'U48 remains blocked');
console.log('Unity U47 gameplay data/runtime completion check passed: production 5/5/2, Simulator 2/3/2, 23 captures, DoT/revival/replacement/Result evidence PASS.');
