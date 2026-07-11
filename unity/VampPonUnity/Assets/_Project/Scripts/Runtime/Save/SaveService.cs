using System;
using System.IO;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Save
{
    public sealed class SaveLoadResult
    {
        public bool Succeeded { get; set; }
        public bool RecoveredFromBackup { get; set; }
        public bool CreatedDefault { get; set; }
        public string Error { get; set; }
        public GameSaveSnapshot Snapshot { get; set; }
    }

    public sealed class SaveService
    {
        public const string FileName = "yoru-no-shirube-save-v1.json";
        private readonly string savePath;
        private readonly string backupPath;
        private readonly string temporaryPath;
        private readonly Func<string> now;
        private readonly SaveMigration migration = new();

        public GameSaveSnapshot Current { get; private set; }
        public string SavePath => savePath;

        public SaveService(string directory = null, Func<string> nowProvider = null)
        {
            var root = directory ?? Application.persistentDataPath;
            savePath = Path.Combine(root, FileName);
            backupPath = savePath + ".bak";
            temporaryPath = savePath + ".tmp";
            now = nowProvider ?? (() => DateTime.UtcNow.ToString("O"));
        }

        public SaveLoadResult Load()
        {
            Directory.CreateDirectory(Path.GetDirectoryName(savePath) ?? string.Empty);
            if (!File.Exists(savePath)) return CreateDefault();
            var primary = TryLoad(savePath);
            if (primary.Succeeded) return Accept(primary, false, false);
            var backup = TryLoad(backupPath);
            if (backup.Succeeded)
            {
                var accepted = Accept(backup, true, false);
                Save(Current, out _);
                return accepted;
            }
            return CreateDefault($"Primary and backup save were unreadable. {primary.Error} {backup.Error}");
        }

        public bool Save(GameSaveSnapshot candidate, out string error)
        {
            error = string.Empty;
            var valid = migration.Migrate(candidate, now());
            if (!valid.Succeeded) { error = valid.Error; return false; }
            valid.Snapshot.updatedAt = now();
            Directory.CreateDirectory(Path.GetDirectoryName(savePath) ?? string.Empty);
            try
            {
                File.WriteAllText(temporaryPath, JsonUtility.ToJson(valid.Snapshot, true));
                if (File.Exists(savePath))
                {
                    File.Replace(temporaryPath, savePath, backupPath);
                }
                else
                {
                    File.Move(temporaryPath, savePath);
                    File.Copy(savePath, backupPath, true);
                }
                Current = valid.Snapshot;
                return true;
            }
            catch (Exception exception)
            {
                error = exception.Message;
                TryDeleteTemporary();
                return false;
            }
        }

        public bool MarkCollectionSeen(string entryId, out string error)
        {
            if (Current == null) Load();
            if (string.IsNullOrWhiteSpace(entryId) || !Current.collectionUnlockedIds.Contains(entryId))
            {
                error = "Only an unlocked stable entry ID can be marked seen.";
                return false;
            }
            if (!Current.collectionSeenIds.Contains(entryId)) Current.collectionSeenIds.Add(entryId);
            return Save(Current, out error);
        }

        private SaveLoadResult TryLoad(string path)
        {
            if (!File.Exists(path)) return new SaveLoadResult { Error = "File missing." };
            try
            {
                var parsed = JsonUtility.FromJson<GameSaveSnapshot>(File.ReadAllText(path));
                var valid = migration.Migrate(parsed, now());
                return new SaveLoadResult { Succeeded = valid.Succeeded, Error = valid.Error, Snapshot = valid.Snapshot };
            }
            catch (Exception exception) { return new SaveLoadResult { Error = exception.Message }; }
        }

        private SaveLoadResult Accept(SaveLoadResult source, bool backup, bool created)
        {
            Current = source.Snapshot;
            return new SaveLoadResult { Succeeded = true, RecoveredFromBackup = backup, CreatedDefault = created, Snapshot = Current, Error = source.Error ?? string.Empty };
        }

        private SaveLoadResult CreateDefault(string warning = "")
        {
            var snapshot = GameSaveSnapshot.CreateDefault(now());
            var saved = Save(snapshot, out var error);
            return new SaveLoadResult { Succeeded = saved, CreatedDefault = true, Snapshot = Current ?? snapshot, Error = string.IsNullOrEmpty(error) ? warning : error };
        }

        private void TryDeleteTemporary()
        {
            try { if (File.Exists(temporaryPath)) File.Delete(temporaryPath); }
            catch { }
        }
    }
}
