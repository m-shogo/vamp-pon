using System;
using System.Collections.Generic;

namespace VampPon.UnitySpike.Runtime.Save
{
    [Serializable]
    public sealed class PermanentUpgradeSave
    {
        public string id;
        public int level;
    }

    [Serializable]
    public sealed class GameSettingsSave
    {
        public float masterVolume = 1f;
        public bool hapticEnabled = true;
        public string locale = "ja";
    }

    [Serializable]
    public sealed class GameSaveSnapshot
    {
        public const int CurrentSchemaVersion = 1;

        public int schemaVersion = CurrentSchemaVersion;
        public string createdAt;
        public string updatedAt;
        public List<string> unlockedCharacterIds = new();
        public List<string> unlockedStageIds = new();
        public List<PermanentUpgradeSave> permanentUpgrades = new();
        public List<string> collectionUnlockedIds = new();
        public List<string> collectionSeenIds = new();
        public List<string> achievementIds = new();
        public GameSettingsSave settings = new();

        public static GameSaveSnapshot CreateDefault(string now)
        {
            return new GameSaveSnapshot
            {
                createdAt = now,
                updatedAt = now,
                unlockedCharacterIds = new List<string> { "character_yui" },
                unlockedStageIds = new List<string> { "stage_01" },
                collectionUnlockedIds = new List<string> { "character_yui", "stage_01" },
            };
        }
    }
}
