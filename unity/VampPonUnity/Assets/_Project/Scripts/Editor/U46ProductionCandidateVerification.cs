using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Collection;
using VampPon.UnitySpike.Runtime.Pause;
using VampPon.UnitySpike.Runtime.Result;
using VampPon.UnitySpike.Runtime.Save;

namespace VampPon.UnitySpike.Editor
{
    public static class U46ProductionCandidateVerification
    {
        private const string AssetRoot = "Assets/_Project/Resources/U46Candidates/UI";
        private static readonly string[] SlicedTokens = { "page", "chip", "card", "row", "button", "tab", "track", "fill", "bottom-nav", "shadow", "edge" };

        [MenuItem("VampPon/U46/Validate Production Candidate")]
        public static void ValidateProductionCandidate()
        {
            ConfigureUiImports();
            VerifyAppFlowAndPause();
            VerifySaveService();
            VerifyReadModels();
            Debug.Log("U46 production candidate verification passed: app-flow, pause, save v1, Result, 灯録 and candidate UI imports.");
        }

        private static void ConfigureUiImports()
        {
            foreach (var guid in AssetDatabase.FindAssets("t:Texture2D", new[] { AssetRoot }))
            {
                var path = AssetDatabase.GUIDToAssetPath(guid);
                var importer = AssetImporter.GetAtPath(path) as TextureImporter;
                Require(importer != null, $"texture importer: {path}");
                importer.textureType = TextureImporterType.Sprite;
                importer.spriteImportMode = SpriteImportMode.Single;
                importer.mipmapEnabled = false;
                importer.alphaIsTransparency = true;
                importer.wrapMode = TextureWrapMode.Clamp;
                importer.textureCompression = TextureImporterCompression.Uncompressed;
                importer.filterMode = path.Contains("divider", StringComparison.Ordinal) ? FilterMode.Bilinear : FilterMode.Bilinear;
                importer.spritePixelsPerUnit = 100f;
                importer.spriteBorder = SlicedTokens.Any(path.Contains) ? new Vector4(16f, 16f, 16f, 16f) : Vector4.zero;
                importer.SaveAndReimport();
                var sprite = AssetDatabase.LoadAssetAtPath<Sprite>(path);
                Require(sprite != null, $"sprite import: {path}");
                if (SlicedTokens.Any(path.Contains)) Require(sprite.border.sqrMagnitude > 0f, $"9-slice border: {path}");
            }
            AssetDatabase.SaveAssets();
        }

        private static void VerifyAppFlowAndPause()
        {
            var dir = TempDirectory("flow");
            try
            {
                var pause = new RunPauseCoordinator();
                var save = new SaveService(dir, FixedNow);
                var resetCount = 0;
                var flow = new AppFlowCoordinator(pause, save, () => resetCount++);
                Require(flow.Initialize().Succeeded && flow.State == AppFlowState.StageSelect && pause.Contains(RunPauseReason.StageSelect), "Boot -> StageSelect");
                Require(!flow.Execute(AppFlowCommand.OpenLevelUp()).Succeeded, "invalid StageSelect -> LevelUp rejected");
                Require(flow.Execute(AppFlowCommand.OpenCollection()).Succeeded && flow.State == AppFlowState.Collection && pause.Contains(RunPauseReason.Collection), "Collection open");
                Require(flow.Execute(AppFlowCommand.CloseCollection()).Succeeded && flow.State == AppFlowState.StageSelect, "Collection close");
                Require(flow.Execute(AppFlowCommand.StartStage("stage_01")).Succeeded && flow.State == AppFlowState.Running && !pause.IsPaused, "Stage start");
                Require(flow.Execute(AppFlowCommand.OpenLevelUp()).Succeeded && pause.Contains(RunPauseReason.LevelUp), "LevelUp open");
                Require(flow.Execute(AppFlowCommand.CloseLevelUp()).Succeeded && !pause.IsPaused, "LevelUp close");
                var snapshot = Result(RunOutcome.Clear);
                Require(flow.Execute(AppFlowCommand.CompleteRun(snapshot)).Succeeded && pause.Contains(RunPauseReason.Result), "Result open");
                Require(flow.Execute(AppFlowCommand.RetryRun()).Succeeded && !pause.IsPaused && resetCount == 2, "Retry clears pause and resets run");
                Require(flow.Execute(AppFlowCommand.CompleteRun(Result(RunOutcome.Fail))).Succeeded, "Fail result");
                Require(flow.Execute(AppFlowCommand.ReturnToStageSelect()).Succeeded && pause.Contains(RunPauseReason.StageSelect), "Result -> StageSelect stays paused");
                Require(pause.Acquire(RunPauseReason.SystemMenu), "single reason acquired");
                Require(!pause.Acquire(RunPauseReason.SystemMenu), "duplicate reason idempotent");
                Require(!pause.Release(RunPauseReason.ApplicationPause), "unknown release idempotent");
                Require(pause.Release(RunPauseReason.SystemMenu) && pause.IsPaused, "multiple reasons retain pause");
                pause.Release(RunPauseReason.StageSelect);
                Require(!pause.IsPaused, "last reason resumes");
            }
            finally { DeleteDirectory(dir); }
        }

        private static void VerifySaveService()
        {
            var dir = TempDirectory("save");
            try
            {
                var service = new SaveService(dir, FixedNow);
                var created = service.Load();
                Require(created.Succeeded && created.CreatedDefault && created.Snapshot.schemaVersion == 1, "default schema v1 create");
                created.Snapshot.collectionUnlockedIds.Add("enemy_onbu");
                created.Snapshot.collectionUnlockedIds.Add("enemy_onbu");
                created.Snapshot.collectionSeenIds.Add("unknown-entry");
                Require(service.Save(created.Snapshot, out _), "atomic save");
                var roundTrip = new SaveService(dir, FixedNow).Load();
                Require(roundTrip.Succeeded && roundTrip.Snapshot.collectionUnlockedIds.Count(x => x == "enemy_onbu") == 1, "round trip and duplicate IDs");
                Require(!roundTrip.Snapshot.collectionSeenIds.Contains("unknown-entry"), "unknown seen ID not substituted");
                File.WriteAllText(service.SavePath, "{corrupt json");
                var recovered = new SaveService(dir, FixedNow).Load();
                Require(recovered.Succeeded && recovered.RecoveredFromBackup, "corrupt JSON backup recovery");
                File.WriteAllText(service.SavePath, "{\"schemaVersion\":99}");
                File.WriteAllText(service.SavePath + ".bak", "{\"schemaVersion\":99}");
                var future = new SaveService(dir, FixedNow).Load();
                Require(future.CreatedDefault && future.Error.Contains("Future save schema"), "future schema explicit error and recovery");
                var blockedPath = Path.Combine(dir, "blocked"); Directory.CreateDirectory(blockedPath);
                var blocked = new SaveService(blockedPath, FixedNow); blocked.Load();
                Directory.CreateDirectory(blocked.SavePath + ".tmp");
                var before = blocked.Current;
                Require(!blocked.Save(before, out _) && ReferenceEquals(before, blocked.Current), "atomic write failure preserves memory state");
            }
            finally { DeleteDirectory(dir); }
        }

        private static void VerifyReadModels()
        {
            var builder = new RunResultViewModelBuilder();
            var clear = builder.Build(Result(RunOutcome.Clear));
            var fail = builder.Build(Result(RunOutcome.Fail));
            Require(clear.OutcomeLabel == "踏破" && fail.OutcomeLabel == "帰還", "Clear and Fail view models");
            Require(clear.ElapsedTimeLabel == "01:05" && clear.RewardCards.Count == 2 && clear.NewRecordRows.Count == 2, "result formatting/rewards/new records");
            var empty = builder.Build(new RunResultSnapshot { outcome = RunOutcome.Fail, stageId = "stage_01" });
            Require(empty.RewardCards.Count == 0, "empty rewards");
            var save = GameSaveSnapshot.CreateDefault(FixedNow());
            var collection = new CollectionReadModelBuilder();
            var locked = collection.Build(save, CollectionCategory.Enemies).Single();
            Require(!locked.Unlocked && locked.Title == "???" && !locked.Description.Contains("オンブ"), "locked spoiler boundary");
            save.collectionUnlockedIds.Add("enemy_onbu");
            var unlocked = collection.Build(save, CollectionCategory.Enemies).Single();
            Require(unlocked.Unlocked && unlocked.NewIndicator && unlocked.Title == "オンブ", "unlocked unseen entry");
            save.collectionSeenIds.Add("enemy_onbu");
            Require(!collection.Build(save, CollectionCategory.Enemies).Single().NewIndicator, "seen update");
            var progress = collection.Progress(save);
            Require(progress.Current >= 3 && progress.Max >= progress.Current, "collection progress");
            Require(collection.Find(save, "unknown-definition") == null, "unknown definition ID ignored");
            var emptyBuilder = new CollectionReadModelBuilder(Array.Empty<CollectionDefinition>());
            Require(emptyBuilder.Build(save, CollectionCategory.Items).Count == 0, "empty category");
        }

        private static RunResultSnapshot Result(RunOutcome outcome) => new()
        {
            runId = "verification-run", outcome = outcome, stageId = "stage_01", characterId = "character_yui", elapsedTime = 65,
            defeatedEnemyCount = 72, collectedFragments = 18, reachedLevel = 4,
            rewardIds = new List<string> { "memory_fragment", "night_trace" }, newlyUnlockedIds = new List<string> { "enemy_onbu", "memory_first_return" }, completedAt = FixedNow(),
        };

        private static string TempDirectory(string name)
        {
            var path = Path.Combine(Path.GetTempPath(), "yoru-no-shirube-u46-" + name + "-" + Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(path); return path;
        }

        private static string FixedNow() => "2026-07-11T00:00:00.0000000Z";
        private static void DeleteDirectory(string path) { try { if (Directory.Exists(path)) Directory.Delete(path, true); } catch { } }
        private static void Require(bool condition, string label) { if (!condition) throw new InvalidOperationException("U46 verification failed: " + label); }
    }
}
