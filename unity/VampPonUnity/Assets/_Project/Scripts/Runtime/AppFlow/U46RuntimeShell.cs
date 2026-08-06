using System;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.TextCore.LowLevel;
using UnityEngine.UI;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime.Collection;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Pause;
using VampPon.UnitySpike.Runtime.Result;
using VampPon.UnitySpike.Runtime.Save;
using VampPon.UnitySpike.Runtime.Visuals;
using VampPon.UnitySpike.U4;
using VampPon.UnitySpike.UI;
using VampPon.UnitySpike.UI.Screens;

namespace VampPon.UnitySpike.Runtime.AppFlow
{
    public sealed class U46RuntimeShell : MonoBehaviour
    {
        private RunPauseCoordinator pause;
        private SaveService save;
        private AppFlowCoordinator flow;
        private U2BattleController battle;
        private PlayerController player;
        private YuiSpriteAnimator animator;
        private TopLivingNightView top;
        private StageSelectView stageSelect;
        private ResultView result;
        private CollectionView collection;
        private U4LevelUpDemoController levelUp;
        private GameObject appFlowCanvas;
        private Vector3 initialPlayerPosition;
        private bool topDismissed;
#if VAMPPON_AI_SIMULATOR_SMOKE
        internal int VerificationLevelUpOpenedCount { get; private set; }
        internal int VerificationLevelUpClosedCount { get; private set; }
        internal int VerificationPauseChangedCount { get; private set; }
        internal int VerificationStateChangedCount { get; private set; }
#endif

        public AppFlowCoordinator Flow => flow;
        public RunPauseCoordinator Pause => pause;
        public SaveService Save => save;

        public void Initialize(U2BattleController battleController, PlayerController playerController, YuiSpriteAnimator yuiAnimator, U4LevelUpDemoController levelUpController)
        {
            DisposeSubscriptions();
            if (appFlowCanvas != null) Destroy(appFlowCanvas);
            top = null;
            topDismissed = false;
            battle = battleController; player = playerController; animator = yuiAnimator; levelUp = levelUpController;
            initialPlayerPosition = player.transform.position;
            pause = new RunPauseCoordinator();
            save = new SaveService();
            flow = new AppFlowCoordinator(pause, save, ResetRun);
            pause.PauseChanged += ApplyPause;
            flow.StateChanged += ApplyState;
            if (levelUp != null)
            {
                levelUp.OverlayOpened += HandleLevelUpOpened;
                levelUp.OverlayClosed += HandleLevelUpClosed;
            }
            BuildViews();
            flow.Initialize();
            ApplyState(flow.State);
        }

#if VAMPPON_AI_SIMULATOR_SMOKE
        internal void ReinitializeForVerification() => Initialize(battle, player, animator, levelUp);

        internal void CompleteVerificationRun(bool clear, bool includeRewards = true, bool failSave = false)
        {
            if (flow.State != AppFlowState.Running) return;
            save.SetVerificationWriteFailure(failSave ? _ => "U46.1 verification write failure." : null);
            var snapshot = new RunResultSnapshot
            {
                runId = Guid.NewGuid().ToString("N"), outcome = clear ? RunOutcome.Clear : RunOutcome.Fail,
                stageId = flow.ActiveStageId ?? "stage_01", characterId = "character_yui", elapsedTime = battle.ElapsedSeconds,
                defeatedEnemyCount = battle.DefeatedEnemyCount, collectedFragments = battle.CollectedExpCount,
                reachedLevel = Math.Max(1, 1 + battle.CollectedExpCount / 5),
                rewardIds = includeRewards ? new System.Collections.Generic.List<string> { "memory_fragment", "night_trace" } : new System.Collections.Generic.List<string>(),
                newlyUnlockedIds = includeRewards ? new System.Collections.Generic.List<string> { "memory_first_return", "enemy_onbu" } : new System.Collections.Generic.List<string>(),
                completedAt = DateTime.UtcNow.ToString("O"),
            };
            var gameplay=FindAnyObjectByType<Stage1GameplayRuntimeCoordinator>();
            if(gameplay!=null)
            {
                snapshot.acquiredItemIds.AddRange(gameplay.Run.Inventory.Weapons.Select(value=>value.Id));
                snapshot.acquiredItemIds.AddRange(gameplay.Run.Inventory.Passives.Select(value=>value.Id));
                snapshot.acquiredItemIds.AddRange(gameplay.Run.Inventory.RareItems.Select(value=>value.Id));
                if(gameplay.Run.Inventory.HasWeapon("dawn_ink_lamp"))snapshot.evolutionIds.Add("dawn_ink_lamp_fusion");
                if(gameplay.Run.Inventory.HasWeapon("unforgotten_name"))snapshot.evolutionIds.Add("unforgotten_name_awakening");
                snapshot.revivalUsedCount=gameplay.Run.RevivalUsedCount;snapshot.kokuyouActivationCount=gameplay.Run.Kokuyou.ActivationCount;
            }
            flow.Execute(AppFlowCommand.CompleteRun(snapshot));
            save.SetVerificationWriteFailure(null);
        }
#endif

        private void HandleLevelUpOpened()
        {
#if VAMPPON_AI_SIMULATOR_SMOKE
            VerificationLevelUpOpenedCount++;
#endif
            flow?.Execute(AppFlowCommand.OpenLevelUp());
        }

        private void HandleLevelUpClosed()
        {
#if VAMPPON_AI_SIMULATOR_SMOKE
            VerificationLevelUpClosedCount++;
#endif
            flow?.Execute(AppFlowCommand.CloseLevelUp());
        }

        private void DisposeSubscriptions()
        {
            if (pause != null) pause.PauseChanged -= ApplyPause;
            if (flow != null) flow.StateChanged -= ApplyState;
            if (levelUp != null)
            {
                levelUp.OverlayOpened -= HandleLevelUpOpened;
                levelUp.OverlayClosed -= HandleLevelUpClosed;
            }
        }

        private void OnDestroy() => DisposeSubscriptions();

        private void BuildViews()
        {
            var canvasObject = new GameObject("U46AppFlowCanvas", typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            appFlowCanvas = canvasObject;
            canvasObject.transform.SetParent(transform, false);
            var canvas = canvasObject.GetComponent<Canvas>(); canvas.renderMode = RenderMode.ScreenSpaceOverlay; canvas.sortingOrder = 90;
            var scaler = canvasObject.GetComponent<CanvasScaler>(); scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize; scaler.referenceResolution = new Vector2(390f, 844f); scaler.matchWidthOrHeight = 0.5f;
            var safe = new GameObject("U46SafeArea", typeof(RectTransform), typeof(SafeAreaFitter)); safe.transform.SetParent(canvasObject.transform, false);
            var safeRect = safe.GetComponent<RectTransform>(); safeRect.anchorMin = Vector2.zero; safeRect.anchorMax = Vector2.one; safeRect.offsetMin = Vector2.zero; safeRect.offsetMax = Vector2.zero;
            var font = LoadFont(); var catalog = new U46UiAssetCatalog();
            stageSelect = new GameObject("U46StageSelectView", typeof(StageSelectView)).GetComponent<StageSelectView>(); stageSelect.Build(safe.transform, font, flow);
            result = new GameObject("U46ResultView", typeof(ResultView)).GetComponent<ResultView>(); result.Build(safe.transform, font, catalog, new ResultPresenter(flow));
            collection = new GameObject("U46CollectionView", typeof(CollectionView)).GetComponent<CollectionView>(); collection.Build(safe.transform, font, catalog, new CollectionPresenter(flow, save));
#if !VAMPPON_AI_SIMULATOR_SMOKE
            top = new GameObject("TopLivingNightView", typeof(TopLivingNightView)).GetComponent<TopLivingNightView>();
            top.Build(canvasObject.transform, font, DismissTop, OpenCollectionFromTop);
#endif
        }

        private void ApplyState(AppFlowState state)
        {
#if VAMPPON_AI_SIMULATOR_SMOKE
            VerificationStateChangedCount++;
#endif
            if (stageSelect != null) stageSelect.gameObject.SetActive(state == AppFlowState.StageSelect);
            if (top != null) top.gameObject.SetActive(state == AppFlowState.StageSelect && !topDismissed);
            if (collection != null && state == AppFlowState.Collection) collection.Show(); else if (collection != null) collection.gameObject.SetActive(false);
            if (result != null && state == AppFlowState.Result) result.Show(flow.LastResult); else if (result != null) result.gameObject.SetActive(false);
        }

        private void DismissTop()
        {
            topDismissed = true;
            if (top != null) top.gameObject.SetActive(false);
        }

        private void OpenCollectionFromTop()
        {
            DismissTop();
            flow?.Execute(AppFlowCommand.OpenCollection());
        }

        private void ApplyPause(bool pausedState)
        {
#if VAMPPON_AI_SIMULATOR_SMOKE
            VerificationPauseChangedCount++;
#endif
            battle?.SetRuntimePaused(pausedState);
            player?.SetRuntimeInputBlocked(pausedState);
            animator?.SetRuntimePaused(pausedState);
        }

        private void ResetRun()
        {
            battle?.ResetRunState();
            if (player != null) player.transform.position = initialPlayerPosition;
            player?.ClearVerificationMoveInput();
            animator?.ResetAnimation();
        }

        private void OnApplicationPause(bool pausedState)
        {
            if (pause == null) return;
            if (pausedState) pause.Acquire(RunPauseReason.ApplicationPause); else pause.Release(RunPauseReason.ApplicationPause);
            if (pausedState && save?.Current != null) save.Save(save.Current, out _);
        }

        private void OnApplicationQuit()
        {
            if (save?.Current != null) save.Save(save.Current, out _);
        }

        private static TMP_FontAsset LoadFont()
        {
            var font = Resources.Load<Font>("ZenMaruGothic-Medium");
            return font != null ? TMP_FontAsset.CreateFontAsset(font, 36, 4, GlyphRenderMode.SDFAA, 1024, 1024) : TMP_Settings.defaultFontAsset;
        }
    }
}
