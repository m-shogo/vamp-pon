using System;
using UnityEditor;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    /// <summary>
    /// Keeps Editor Play Mode on the same TOP V3 source authority as build staging.
    /// A registered final candidate with stale Core5 reference provenance must not
    /// appear valid merely because the developer entered Play Mode without CI.
    /// </summary>
    [InitializeOnLoad]
    public static class TopLivingNightCompositeV3EditorGuard
    {
        static TopLivingNightCompositeV3EditorGuard()
        {
            EditorApplication.playModeStateChanged -= OnPlayModeStateChanged;
            EditorApplication.playModeStateChanged += OnPlayModeStateChanged;
        }

        [MenuItem("Vamp Pon/TOP Living Night/Validate Runtime V3 Source Authority")]
        private static void ValidateFromMenu()
        {
            var selection = ValidateSourceAuthority();
            Debug.Log(
                $"TOP Runtime V3 editor source authority: PASS kind={selection.Kind} " +
                $"path={selection.RelativePath} sha256={selection.ExpectedSha256}");
        }

        private static void OnPlayModeStateChanged(PlayModeStateChange state)
        {
            if (state != PlayModeStateChange.ExitingEditMode)
                return;

            try
            {
                var selection = ValidateSourceAuthority();
                Debug.Log(
                    $"TOP Runtime V3 editor preflight: PASS kind={selection.Kind} " +
                    $"final={selection.IsFinal}");
            }
            catch (Exception exception)
            {
                // ExitingEditMode is still early enough to cancel the transition.
                // Do not permit Play Mode to silently preview stale final-core5 art.
                EditorApplication.isPlaying = false;
                Debug.LogError(
                    "TOP Runtime V3 editor preflight blocked Play Mode because source authority is invalid.\n" +
                    exception);
            }
        }

        private static TopLivingNightCompositeV3BuildAssetSync.CompositeSourceSelection
            ValidateSourceAuthority()
        {
            // This is intentionally the exact resolver used by build staging and
            // the Unity verifier. It validates canonical path, bytes/SHA, current
            // Core5 reference-set fingerprint, and bridge-vs-final promotion.
            return TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource();
        }
    }
}
