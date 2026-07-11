using System;
using TMPro;
using UnityEngine;
using UnityEngine.TextCore.LowLevel;
using UnityEngine.UI;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime.Collection;
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
        private StageSelectView stageSelect;
        private ResultView result;
        private CollectionView collection;
        private U4LevelUpDemoController levelUp;
        private Vector3 initialPlayerPosition;

        public AppFlowCoordinator Flow => flow;
        public RunPauseCoordinator Pause => pause;
        public SaveService Save => save;

        public void Initialize(U2BattleController battleController, PlayerController playerController, YuiSpriteAnimator yuiAnimator, U4LevelUpDemoController levelUpController)
        {
            battle = battleController; player = playerController; animator = yuiAnimator; levelUp = levelUpController;
            initialPlayerPosition = player.transform.position;
            pause = new RunPauseCoordinator();
            save = new SaveService();
            flow = new AppFlowCoordinator(pause, save, ResetRun);
            pause.PauseChanged += ApplyPause;
            flow.StateChanged += ApplyState;
            if (levelUp != null)
            {
                levelUp.OverlayOpened += () => flow.Execute(AppFlowCommand.OpenLevelUp());
                levelUp.OverlayClosed += () => flow.Execute(AppFlowCommand.CloseLevelUp());
            }
            BuildViews();
            flow.Initialize();
            ApplyState(flow.State);
        }

        public void OpenVerificationResult(bool clear)
        {
            if (flow.State != AppFlowState.Running) return;
            var snapshot = new RunResultSnapshot
            {
                runId = Guid.NewGuid().ToString("N"), outcome = clear ? RunOutcome.Clear : RunOutcome.Fail,
                stageId = flow.ActiveStageId ?? "stage_01", characterId = "character_yui", elapsedTime = battle.ElapsedSeconds,
                defeatedEnemyCount = battle.DefeatedEnemyCount, collectedFragments = battle.CollectedExpCount,
                reachedLevel = Math.Max(1, 1 + battle.CollectedExpCount / 5),
                rewardIds = new System.Collections.Generic.List<string> { "記憶の欠片", "夜の足跡" },
                newlyUnlockedIds = new System.Collections.Generic.List<string> { "memory_first_return", "enemy_onbu" },
                completedAt = DateTime.UtcNow.ToString("O"),
            };
            flow.Execute(AppFlowCommand.CompleteRun(snapshot));
        }

        private void BuildViews()
        {
            var canvasObject = new GameObject("U46AppFlowCanvas", typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            canvasObject.transform.SetParent(transform, false);
            var canvas = canvasObject.GetComponent<Canvas>(); canvas.renderMode = RenderMode.ScreenSpaceOverlay; canvas.sortingOrder = 90;
            var scaler = canvasObject.GetComponent<CanvasScaler>(); scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize; scaler.referenceResolution = new Vector2(390f, 844f); scaler.matchWidthOrHeight = 0.5f;
            var safe = new GameObject("U46SafeArea", typeof(RectTransform), typeof(SafeAreaFitter)); safe.transform.SetParent(canvasObject.transform, false);
            var safeRect = safe.GetComponent<RectTransform>(); safeRect.anchorMin = Vector2.zero; safeRect.anchorMax = Vector2.one; safeRect.offsetMin = Vector2.zero; safeRect.offsetMax = Vector2.zero;
            var font = LoadFont(); var catalog = new U46UiAssetCatalog();
            stageSelect = new GameObject("U46StageSelectView", typeof(StageSelectView)).GetComponent<StageSelectView>(); stageSelect.Build(safe.transform, font, flow);
            result = new GameObject("U46ResultView", typeof(ResultView)).GetComponent<ResultView>(); result.Build(safe.transform, font, catalog, new ResultPresenter(flow));
            collection = new GameObject("U46CollectionView", typeof(CollectionView)).GetComponent<CollectionView>(); collection.Build(safe.transform, font, catalog, new CollectionPresenter(flow, save));
        }

        private void ApplyState(AppFlowState state)
        {
            if (stageSelect != null) stageSelect.gameObject.SetActive(state == AppFlowState.StageSelect);
            if (collection != null && state == AppFlowState.Collection) collection.Show(); else if (collection != null) collection.gameObject.SetActive(false);
            if (result != null && state == AppFlowState.Result) result.Show(flow.LastResult); else if (result != null) result.gameObject.SetActive(false);
        }

        private void ApplyPause(bool pausedState)
        {
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
