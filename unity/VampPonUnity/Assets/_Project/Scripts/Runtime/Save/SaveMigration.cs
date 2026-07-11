namespace VampPon.UnitySpike.Runtime.Save
{
    public sealed class SaveMigration
    {
        public SaveValidationResult Migrate(GameSaveSnapshot snapshot, string now)
        {
            if (snapshot == null) return new SaveValidationResult { Succeeded = false, Error = "Missing save snapshot." };
            if (snapshot.schemaVersion > GameSaveSnapshot.CurrentSchemaVersion)
                return new SaveValidationResult { Succeeded = false, Error = "Future save schema is not supported." };
            if (snapshot.schemaVersion <= 0) snapshot.schemaVersion = GameSaveSnapshot.CurrentSchemaVersion;
            return new SaveValidator().ValidateAndNormalize(snapshot, now);
        }
    }
}
