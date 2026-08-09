using System;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime
{
    [Serializable]
    public sealed class AppPreferenceSnapshot
    {
        public const int CurrentSchemaVersion = 1;

        public int schemaVersion = CurrentSchemaVersion;
        public float bgmVolume = 1f;
        public float seVolume = 1f;
        public bool hapticsEnabled = true;
        public bool reducedMotion;

        public AppPreferenceSnapshot DeepCopy() => new()
        {
            schemaVersion = CurrentSchemaVersion,
            bgmVolume = bgmVolume,
            seVolume = seVolume,
            hapticsEnabled = hapticsEnabled,
            reducedMotion = reducedMotion,
        };
    }

    public sealed class AppPreferenceService
    {
        public const string PlayerPrefsKey = "yorunoShirube.app-preferences.v1";

        public static AppPreferenceService Active { get; private set; }
        public static bool ReducedMotionEnabled => Active?.Current?.reducedMotion == true;

        public AppPreferenceSnapshot Current { get; private set; }
        public event Action<AppPreferenceSnapshot> Changed;

        public AppPreferenceService()
        {
            Active = this;
            Current = Load();
        }

        public void SetBgmVolume(float value) => Update(snapshot => snapshot.bgmVolume = Mathf.Clamp01(value));
        public void SetSeVolume(float value) => Update(snapshot => snapshot.seVolume = Mathf.Clamp01(value));
        public void SetHapticsEnabled(bool value) => Update(snapshot => snapshot.hapticsEnabled = value);
        public void SetReducedMotion(bool value) => Update(snapshot => snapshot.reducedMotion = value);

        private void Update(Action<AppPreferenceSnapshot> mutation)
        {
            var candidate = Current.DeepCopy();
            mutation(candidate);
            Current = Normalize(candidate);
            PlayerPrefs.SetString(PlayerPrefsKey, JsonUtility.ToJson(Current));
            PlayerPrefs.Save();
            Changed?.Invoke(Current.DeepCopy());
        }

        private static AppPreferenceSnapshot Load()
        {
            if (!PlayerPrefs.HasKey(PlayerPrefsKey)) return new AppPreferenceSnapshot();
            try
            {
                return Normalize(JsonUtility.FromJson<AppPreferenceSnapshot>(PlayerPrefs.GetString(PlayerPrefsKey)));
            }
            catch
            {
                return new AppPreferenceSnapshot();
            }
        }

        private static AppPreferenceSnapshot Normalize(AppPreferenceSnapshot source)
        {
            source ??= new AppPreferenceSnapshot();
            source.schemaVersion = AppPreferenceSnapshot.CurrentSchemaVersion;
            source.bgmVolume = Mathf.Clamp01(source.bgmVolume);
            source.seVolume = Mathf.Clamp01(source.seVolume);
            return source;
        }
    }
}
