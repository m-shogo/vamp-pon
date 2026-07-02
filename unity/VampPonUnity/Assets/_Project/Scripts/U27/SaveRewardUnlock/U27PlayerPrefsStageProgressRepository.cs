using System;
using System.Collections.Generic;
using UnityEngine;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27PlayerPrefsStageProgressRepository : U27StageProgressRepositoryBase
    {
        private const string Key = "vamp_pon_u27_stage_progress_proof_v1";

        public override U27SaveDataModel Load()
        {
            try
            {
                if (!PlayerPrefs.HasKey(Key)) return U27SaveDataModel.CreateDefault();
                CachedData = Decode(PlayerPrefs.GetString(Key, ""));
                CachedData = FallbackIfInvalid(CachedData);
                return CachedData;
            }
            catch (Exception)
            {
                CachedData = U27SaveDataModel.CreateDefault();
                return CachedData;
            }
        }

        public override void Save(U27SaveDataModel data)
        {
            CachedData = FallbackIfInvalid(data);
            PlayerPrefs.SetString(Key, Encode(CachedData));
            PlayerPrefs.Save();
        }

        public override void ResetProofDebug()
        {
            PlayerPrefs.DeleteKey(Key);
            CachedData = U27SaveDataModel.CreateDefault();
        }

        private static string Encode(U27SaveDataModel data)
        {
            var progress = data.GetStageProgress("stage_01");
            var result = progress.LastResult ?? new U27StageResultRecord();
            return string.Join("|", new[]
            {
                data.Version.ToString(),
                progress.StageId,
                Bool(progress.IsUnlocked),
                Bool(progress.IsCleared),
                progress.BestClearTime.ToString(),
                progress.BestLevel.ToString(),
                progress.BestKillCount.ToString(),
                progress.BestCollectedCount.ToString(),
                progress.BestRank,
                progress.TotalAttempts.ToString(),
                progress.TotalClears.ToString(),
                progress.FirstClearAtIso,
                progress.LastPlayedAtIso,
                string.Join(",", progress.UnlockedRewardIds),
                string.Join(",", progress.UnlockedKnowledgeIds),
                Bool(result.IsClear),
                result.ElapsedSeconds.ToString(),
                result.KillCount.ToString(),
                result.LevelReached.ToString(),
                result.CollectedCount.ToString(),
                result.Rank,
                Bool(result.KokuyouUsed),
                Bool(result.EvolutionAchieved),
                Bool(result.RareAcquired),
            });
        }

        private static U27SaveDataModel Decode(string payload)
        {
            var parts = payload.Split('|');
            if (parts.Length < 24) return U27SaveDataModel.CreateDefault();
            var data = U27SaveDataModel.CreateDefault();
            data.Version = ParseInt(parts[0]);
            var progress = data.GetStageProgress(parts[1]);
            progress.IsUnlocked = ParseBool(parts[2]);
            progress.IsCleared = ParseBool(parts[3]);
            progress.BestClearTime = ParseInt(parts[4]);
            progress.BestLevel = ParseInt(parts[5]);
            progress.BestKillCount = ParseInt(parts[6]);
            progress.BestCollectedCount = ParseInt(parts[7]);
            progress.BestRank = parts[8];
            progress.TotalAttempts = ParseInt(parts[9]);
            progress.TotalClears = ParseInt(parts[10]);
            progress.FirstClearAtIso = parts[11];
            progress.LastPlayedAtIso = parts[12];
            progress.UnlockedRewardIds = SplitIds(parts[13]);
            progress.UnlockedKnowledgeIds = SplitIds(parts[14]);
            progress.LastResult = new U27StageResultRecord
            {
                StageId = progress.StageId,
                IsClear = ParseBool(parts[15]),
                ElapsedSeconds = ParseInt(parts[16]),
                KillCount = ParseInt(parts[17]),
                LevelReached = ParseInt(parts[18]),
                CollectedCount = ParseInt(parts[19]),
                Rank = parts[20],
                KokuyouUsed = ParseBool(parts[21]),
                EvolutionAchieved = ParseBool(parts[22]),
                RareAcquired = ParseBool(parts[23]),
                Version = U27SaveVersion.Current,
            };
            return data;
        }

        private static List<string> SplitIds(string source) => string.IsNullOrEmpty(source) ? new List<string>() : new List<string>(source.Split(','));
        private static string Bool(bool value) => value ? "1" : "0";
        private static bool ParseBool(string value) => value == "1";
        private static int ParseInt(string value) => int.TryParse(value, out var parsed) ? parsed : 0;
    }
}
