using System;
using System.IO;
using System.Linq;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Pause;
using VampPon.UnitySpike.Runtime.Save;
using VampPon.UnitySpike.Runtime.StageSelect;
using VampPon.UnitySpike.UI.Screens;

namespace VampPon.UnitySpike.Editor
{
    public static class U48StageSelectInteractionVerification
    {
        private static int assertions;
        [MenuItem("VampPon/U48/Verify StageSelect Interaction Model")]
        public static void RunBatchmode()
        {
            assertions = 0; VerifyCatalogAndModel(); VerifyCommandGuard(); VerifyUiInteraction();
            var output = Path.GetFullPath(Path.Combine(Application.dataPath, "../../../docs/design-targets/generated/unity-u48/batch-c/stage-select-runtime-verification.json"));
            Directory.CreateDirectory(Path.GetDirectoryName(output));
            File.WriteAllText(output, "{\n" +
                "  \"schemaVersion\": 1,\n  \"passed\": true,\n" +
                $"  \"assertionCount\": {assertions},\n  \"failureCount\": 0,\n" +
                "  \"uniqueCatalogIds\": true,\n  \"deterministicOrder\": true,\n  \"canonicalContent\": true,\n" +
                "  \"defaultUnlockStage1Only\": true,\n  \"unlockedCardTap\": true,\n  \"lockedCardTap\": true,\n" +
                "  \"selectedUnlockedVisual\": true,\n  \"selectedLockedVisual\": true,\n  \"disabledButton\": true,\n  \"enabledButtonTap\": true,\n" +
                "  \"unknownStageRejected\": true,\n  \"lockedStageRejected\": true,\n  \"unimplementedStageRejected\": true,\n  \"duplicateStartRejected\": true,\n" +
                "  \"invalidFlowRejected\": true,\n  \"saveUnchangedAfterRejectedCommands\": true,\n  \"listenerCleanupPassed\": true,\n  \"exceptionCount\": 0,\n  \"assertionFailureCount\": 0\n}\n");
            Debug.Log($"U48 StageSelect interaction verification passed: {assertions} assertions.");
        }

        private static void VerifyCatalogAndModel()
        {
            Require(StageCatalog.Entries.Count == 20, "catalog count");
            Require(StageCatalog.Entries.Select(value => value.StageId).Distinct().Count() == 20, "unique IDs");
            Require(StageCatalog.Entries.Select(value => value.DisplayOrder).SequenceEqual(Enumerable.Range(1, 20)), "deterministic order");
            Require(StageCatalog.Find("forgotten_street").DisplayName == "忘れられた夜道" && StageCatalog.Find("stage_01").StageId == "forgotten_street", "canonical Stage 1 and compatibility alias");
            Require(StageCatalog.Entries.Count(value => value.RuntimeImplemented) == 1, "implemented count");
            Require(StageCatalog.Entries.Count(value => !value.RuntimeImplemented) == 19, "locked display count");
            Require(StageCatalog.Entries.OrderByDescending(value => value.DisplayName.Length).First().DisplayName == "半分の駄菓子横丁", "longest canonical title");
            Require(StageCatalog.Entries.All(value => value.Metadata.Count == 0 && value.Subtitle == null), "canonical UI metadata remains explicitly missing");
            var save = GameSaveSnapshot.CreateDefault(Now()); var model = new StageSelectModel(); model.Refresh(save);
            Require(model.Items.Count(value => value.IsUnlocked) == 1 && model.Items.Count(value => value.IsStartable) == 1, "default unlock Stage 1 only");
            Require(model.Selected?.StageId == "forgotten_street" && model.Selected.VisualState == StageSelectVisualState.SelectedUnlocked, "default selected unlocked");
            Require(model.Select("name_tag_alley") && model.Selected.VisualState == StageSelectVisualState.SelectedLocked && !model.CanStartSelected, "selected locked");
            Require(model.Select("name_tag_alley") && model.Selected == null, "selection toggle clears");
            Require(model.Select("forgotten_street") && model.CanStartSelected, "selection change");
            model.Refresh(save, false); Require(model.Selected == null && !model.CanStartSelected, "rebuild cleanup no selection");
        }

        private static void VerifyCommandGuard()
        {
            var dir = Temp("guard");
            try
            {
                var save = new SaveService(dir, Now); var flow = new AppFlowCoordinator(new RunPauseCoordinator(), save); flow.Initialize();
                var before = JsonUtility.ToJson(save.Current);
                Require(!flow.Execute(AppFlowCommand.StartStage("unknown_stage")).Succeeded && flow.LastStageStartResult.Code == StageStartResultCode.UnknownStage, "unknown rejected");
                Require(!flow.Execute(AppFlowCommand.StartStage("name_tag_alley")).Succeeded && flow.LastStageStartResult.Code == StageStartResultCode.Locked, "locked rejected");
                Require(JsonUtility.ToJson(save.Current) == before && flow.State == AppFlowState.StageSelect, "rejections preserve save and flow");
                Require(flow.Execute(AppFlowCommand.StartStage("forgotten_street")).Succeeded && flow.LastStageStartResult.Code == StageStartResultCode.Started && flow.ActiveStageId == "forgotten_street", "canonical Stage 1 started");
                Require(!flow.Execute(AppFlowCommand.StartStage("stage_01")).Succeeded && flow.LastStageStartResult.Code == StageStartResultCode.Duplicate, "duplicate rejected");
            }
            finally { Delete(dir); }
            var unimplementedDir = Temp("unimplemented");
            try
            {
                var seed = new SaveService(unimplementedDir, Now); seed.Load(); var candidate = seed.Current.DeepCopy(); candidate.unlockedStageIds.Add("name_tag_alley"); Require(seed.Save(candidate, out _), "verification seed save");
                var flow = new AppFlowCoordinator(new RunPauseCoordinator(), new SaveService(unimplementedDir, Now)); flow.Initialize();
                var before = File.ReadAllText(flowSelectionSavePath(unimplementedDir));
                Require(!flow.Execute(AppFlowCommand.StartStage("name_tag_alley")).Succeeded && flow.LastStageStartResult.Code == StageStartResultCode.NotImplemented, "unimplemented rejected");
                Require(File.ReadAllText(flowSelectionSavePath(unimplementedDir)) == before, "unimplemented preserves save file");
                Require(flow.Execute(AppFlowCommand.OpenCollection()).Succeeded, "open collection");
                Require(!flow.Execute(AppFlowCommand.StartStage("forgotten_street")).Succeeded && flow.LastStageStartResult.Code == StageStartResultCode.InvalidFlowState, "invalid flow rejected");
            }
            finally { Delete(unimplementedDir); }
        }

        private static void VerifyUiInteraction()
        {
            var dir = Temp("ui"); var root = new GameObject("U48StageSelectVerificationRoot", typeof(RectTransform), typeof(EventSystem));
            try
            {
                var flow = new AppFlowCoordinator(new RunPauseCoordinator(), new SaveService(dir, Now)); flow.Initialize();
                var view = new GameObject("StageSelectView", typeof(StageSelectView)).GetComponent<StageSelectView>(); view.Build(root.transform, TMP_Settings.defaultFontAsset, flow);
                var start = FindButton(view, "StartStageButton"); var unlocked = FindButton(view, "Stage1Card"); var locked = FindButton(view, "StageCard_name_tag_alley");
                Require(start != null && unlocked != null && locked != null, "actual buttons exist");
                unlocked.onClick.Invoke(); Require(flow.StageSelection.Selected == null && !start.interactable, "actual selected card tap clears and disables");
                locked.onClick.Invoke(); Require(flow.StageSelection.Selected?.StageId == "name_tag_alley" && flow.StageSelection.Selected.VisualState == StageSelectVisualState.SelectedLocked && !start.interactable, "actual locked card tap");
                var beforeDisabledPress = flow.LastStageStartResult.Code;
                ExecuteEvents.Execute(start.gameObject, new PointerEventData(EventSystem.current), ExecuteEvents.pointerClickHandler);
                Require(flow.LastStageStartResult.Code == beforeDisabledPress && flow.State == AppFlowState.StageSelect, "disabled button dispatches no command");
                unlocked.onClick.Invoke(); Require(flow.StageSelection.Selected?.StageId == "forgotten_street" && start.interactable, "actual unlocked card tap enables");
                start.onClick.Invoke(); Require(flow.State == AppFlowState.Running && flow.LastStageStartResult.Code == StageStartResultCode.Started, "actual enabled start tap");
                UnityEngine.Object.DestroyImmediate(view.gameObject); Require(flow.StageSelection.Select("name_tag_alley"), "view listener cleanup leaves model usable");
            }
            finally { UnityEngine.Object.DestroyImmediate(root); Delete(dir); }
        }

        private static Button FindButton(Component root, string name) => root.GetComponentsInChildren<Button>(true).FirstOrDefault(value => value.name == name);
        private static string flowSelectionSavePath(string dir) => Path.Combine(dir, SaveService.FileName);
        private static string Temp(string name) { var path = Path.Combine(Path.GetTempPath(), "u48-stage-select-" + name + "-" + Guid.NewGuid().ToString("N")); Directory.CreateDirectory(path); return path; }
        private static void Delete(string path) { try { if (Directory.Exists(path)) Directory.Delete(path, true); } catch { } }
        private static string Now() => "2026-07-16T00:00:00.0000000Z";
        private static void Require(bool value, string label) { assertions++; if (!value) throw new InvalidOperationException("U48 StageSelect verification failed: " + label); }
    }
}
