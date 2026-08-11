using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons;
using VampPon.UnitySpike.Runtime.Gameplay.Status;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.Editor
{
    /// <summary>
    /// Unity-batchmode evidence harness for the Selected16 Pavement Hammer prototype.
    /// It creates disposable real U2EnemyActor instances and invokes the real caller/shared
    /// runtime sources. TEST_ONLY values never enter live Stage1 or content/balance authority.
    /// </summary>
    public static class PavementHammerPrototypeRuntimeEvidence
    {
        private const string SourceCommitEnvironment = "VAMPPON_PAVEMENT_HAMMER_EVIDENCE_SOURCE_COMMIT";
        private const string EvidenceRelativePath =
            "docs/design-targets/generated/unity-selected-base-weapons/pavement-hammer/runtime-evidence.json";

        private const string CallerRelativePath =
            "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs";
        private const string SlamRelativePath =
            "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemySlamWaveQueryRuntime.cs";
        private const string KnockbackRelativePath =
            "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs";
        private const string BreakRelativePath =
            "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyBreakStaggerRuntime.cs";
        private const string StatusStateRelativePath =
            "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs";
        private const string StatusRequestRelativePath =
            "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs";

        public static void RunBatchmode()
        {
            var evidence = CreateEmptyEvidence();
            GameObject root = null;
            Texture2D texture = null;
            Sprite sprite = null;
            var exitCode = 1;

            try
            {
                var sourceCommit = Environment.GetEnvironmentVariable(SourceCommitEnvironment)?.Trim() ?? string.Empty;
                Require(IsLowerHex(sourceCommit, 40), $"{SourceCommitEnvironment} must be a lowercase 40-character Git SHA");

                var repoRoot = ResolveRepositoryRoot();
                evidence.sourceCommit = sourceCommit;
                evidence.sourceSha256 = new SourceHashes
                {
                    caller = Sha256(repoRoot, CallerRelativePath),
                    slamWave = Sha256(repoRoot, SlamRelativePath),
                    knockback = Sha256(repoRoot, KnockbackRelativePath),
                    breakStagger = Sha256(repoRoot, BreakRelativePath),
                    statusState = Sha256(repoRoot, StatusStateRelativePath),
                    statusRequest = Sha256(repoRoot, StatusRequestRelativePath),
                };

                root = new GameObject("PavementHammerRuntimeEvidenceRoot");
                texture = CreateTexture();
                sprite = Sprite.Create(
                    texture,
                    new Rect(0f, 0f, texture.width, texture.height),
                    new Vector2(.5f, .5f),
                    2f);
                sprite.name = "PavementHammerRuntimeEvidenceSprite";
                var frames = new[] { sprite };
                var animations = new RuntimeEnemyAnimationSet(frames, frames, frames, frames, .1f);

                var defeated = CreateEnemy("EvidenceDefeated", root.transform, sprite, animations, new Vector3(2f, 0f, 0f), 5f);
                var first = CreateEnemy("EvidenceFirst", root.transform, sprite, animations, new Vector3(3f, 0f, 0f), 100f);
                var second = CreateEnemy("EvidenceSecond", root.transform, sprite, animations, new Vector3(4f, 1f, 0f), 100f);
                var outside = CreateEnemy("EvidenceOutside", root.transform, sprite, animations, new Vector3(-3f, 0f, 0f), 100f);

                var candidates = new List<U2EnemyActor> { second, outside, defeated, first };
                var scratch = new List<U2EnemyActor>(8);
                var telemetry = new PavementHammerPrototypeTelemetry();
                var origin = Vector3.zero;
                var forward = Vector2.right;
                var policy = TestOnlyExposedPolicy();

                var firstSelected = PavementHammerPrototypeRuntime.Fire(
                    candidates,
                    scratch,
                    origin,
                    forward,
                    innerRadius: 0f,
                    outerRadius: 6f,
                    halfAngleDegrees: 30f,
                    maxTargets: 8,
                    damage: 10f,
                    damageFlashSeconds: .1f,
                    knockbackDistance: 1f,
                    breakAmount: 60f,
                    breakThreshold: 100f,
                    staggerDurationSeconds: .6f,
                    exposedPolicy: policy,
                    telemetry: telemetry);

                Require(firstSelected == 3, $"first invocation selected {firstSelected}, expected 3");
                Require(scratch.Count == 3 && scratch[0] == defeated && scratch[1] == first && scratch[2] == second,
                    "first invocation must remain nearest-first and deterministic");

                var defeatedSkipped =
                    !defeated.IsTargetable &&
                    !defeated.Statuses.Has(EnemyStatusRuntimeKind.Exposed) &&
                    !U2EnemyBreakStaggerRuntime.TryGetSnapshot(defeated, out _) &&
                    Nearly(defeated.transform.position.x, 2f) &&
                    Nearly(defeated.transform.position.y, 0f);
                Require(defeatedSkipped, "defeated target received post-damage prototype effects");

                Require(first.Statuses.Has(EnemyStatusRuntimeKind.Exposed), "first survivor did not receive EXPOSED");
                Require(second.Statuses.Has(EnemyStatusRuntimeKind.Exposed), "second survivor did not receive EXPOSED");
                Require(U2EnemyBreakStaggerRuntime.TryGetSnapshot(first, out var firstBreakOne), "first survivor break snapshot missing");
                Require(U2EnemyBreakStaggerRuntime.TryGetSnapshot(second, out var secondBreakOne), "second survivor break snapshot missing");
                Require(Nearly(firstBreakOne.AccumulatedBreak, 60f) && !firstBreakOne.IsStaggered,
                    "first survivor first break state mismatch");
                Require(Nearly(secondBreakOne.AccumulatedBreak, 60f) && !secondBreakOne.IsStaggered,
                    "second survivor first break state mismatch");
                Require(Nearly(first.transform.position.x, 4f) && Nearly(first.transform.position.y, 0f),
                    "first survivor first knockback mismatch");

                var secondSelected = PavementHammerPrototypeRuntime.Fire(
                    candidates,
                    scratch,
                    origin,
                    forward,
                    innerRadius: 0f,
                    outerRadius: 6f,
                    halfAngleDegrees: 30f,
                    maxTargets: 8,
                    damage: 10f,
                    damageFlashSeconds: .1f,
                    knockbackDistance: 1f,
                    breakAmount: 60f,
                    breakThreshold: 100f,
                    staggerDurationSeconds: .6f,
                    exposedPolicy: policy,
                    telemetry: telemetry);

                Require(secondSelected == 2, $"second invocation selected {secondSelected}, expected 2");
                Require(U2EnemyBreakStaggerRuntime.TryGetSnapshot(first, out var firstBreakTwo), "first survivor second break snapshot missing");
                Require(U2EnemyBreakStaggerRuntime.TryGetSnapshot(second, out var secondBreakTwo), "second survivor second break snapshot missing");
                Require(firstBreakTwo.IsStaggered && secondBreakTwo.IsStaggered, "second invocation must trigger both TEST_ONLY staggers");
                Require(Nearly(firstBreakTwo.AccumulatedBreak, 20f) && Nearly(secondBreakTwo.AccumulatedBreak, 20f),
                    "second invocation residual break mismatch");
                Require(Nearly(firstBreakTwo.StaggerSecondsRemaining, .6f) && Nearly(secondBreakTwo.StaggerSecondsRemaining, .6f),
                    "caller stagger duration mismatch");
                Require(Nearly(first.transform.position.x, 5f) && Nearly(first.transform.position.y, 0f),
                    "second knockback must occur before stagger anchor capture");

                // Prove the actual Unity driver captured the post-knockback anchor: simulate a later
                // pursuit displacement and invoke its LateUpdate through reflection. It must restore x=5.
                first.transform.position = new Vector3(6f, 2f, first.transform.position.z);
                InvokeStaggerLateUpdate(first);
                var knockbackBeforeAnchor = Nearly(first.transform.position.x, 5f) && Nearly(first.transform.position.y, 0f);
                Require(knockbackBeforeAnchor, "Unity stagger driver did not preserve post-knockback anchor");

                Require(telemetry.InvocationCount == 2, "telemetry invocation count mismatch");
                Require(telemetry.SelectedTargetCount == 5, "telemetry selected count mismatch");
                Require(telemetry.DamageAttemptCount == 5 && telemetry.DefeatedTargetCount == 1, "damage telemetry mismatch");
                Require(telemetry.StatusApplyAttemptCount == 4 && telemetry.StatusAppliedCount == 2,
                    "Status telemetry applied-count mismatch");
                Require(telemetry.StatusBlockedByInternalCooldownCount == 2,
                    "second EXPOSED applications must be independently cooldown-blocked");
                Require(telemetry.KnockbackAttemptCount == 4 && telemetry.KnockbackAppliedCount == 4,
                    "knockback telemetry mismatch");
                Require(telemetry.BreakStaggerAttemptCount == 4 && telemetry.BreakStaggerAppliedCount == 4,
                    "break/stagger telemetry mismatch");
                Require(telemetry.StaggerTriggeredCount == 2, "stagger-trigger telemetry mismatch");

                evidence.executed = true;
                evidence.result = "PASSED";
                evidence.generatedAtUtc = DateTime.UtcNow.ToString("O");
                evidence.firstInvocationSelected = firstSelected;
                evidence.secondInvocationSelected = secondSelected;
                evidence.defeatedTargetPostDamageEffectsSkipped = defeatedSkipped;
                evidence.survivorsExposedAfterFirstInvocation =
                    first.Statuses.Has(EnemyStatusRuntimeKind.Exposed) && second.Statuses.Has(EnemyStatusRuntimeKind.Exposed);
                evidence.statusCooldownIndependentOnSecondInvocation =
                    telemetry.StatusBlockedByInternalCooldownCount == 2 &&
                    telemetry.KnockbackAppliedCount == 4 &&
                    telemetry.BreakStaggerAppliedCount == 4;
                evidence.firstInvocationBreakAccumulated = firstBreakOne.AccumulatedBreak;
                evidence.secondInvocationResidualBreak = firstBreakTwo.AccumulatedBreak;
                evidence.secondInvocationStaggerSeconds = firstBreakTwo.StaggerSecondsRemaining;
                evidence.knockbackBeforeStaggerAnchor = knockbackBeforeAnchor;
                evidence.telemetry = TelemetryEvidence.From(telemetry);
                evidence.error = string.Empty;
                WriteEvidence(repoRoot, evidence);

                Debug.Log($"PAVEMENT_HAMMER_RUNTIME_EVIDENCE=PASSED sourceCommit={sourceCommit}");
                exitCode = 0;
            }
            catch (Exception exception)
            {
                evidence.executed = true;
                evidence.result = "FAILED";
                evidence.generatedAtUtc = DateTime.UtcNow.ToString("O");
                evidence.error = exception.ToString();
                try
                {
                    WriteEvidence(ResolveRepositoryRoot(), evidence);
                }
                catch (Exception writeException)
                {
                    Debug.LogError($"Could not write Pavement Hammer FAILED evidence: {writeException}");
                }
                Debug.LogException(exception);
            }
            finally
            {
                if (root != null) UnityEngine.Object.DestroyImmediate(root);
                if (sprite != null) UnityEngine.Object.DestroyImmediate(sprite);
                if (texture != null) UnityEngine.Object.DestroyImmediate(texture);
                if (Application.isBatchMode) EditorApplication.Exit(exitCode);
            }
        }

        private static U2EnemyActor CreateEnemy(
            string name,
            Transform parent,
            Sprite sprite,
            RuntimeEnemyAnimationSet animations,
            Vector3 position,
            float hp)
        {
            var enemy = U2EnemyActor.Create(name, parent, sprite, animations, 1f);
            enemy.Activate(position, hp);
            return enemy;
        }

        private static EnemyStatusApplicationPolicy TestOnlyExposedPolicy()
            => new(
                durationSeconds: 4f,
                stacksPerApplication: 1,
                stackMode: EnemyStatusStackMode.Refresh,
                maxStacks: 1,
                magnitude: .25f,
                magnitudeMode: EnemyStatusMagnitudeMode.Max,
                maxMagnitude: .25f,
                internalCooldownSeconds: 2f,
                respectInternalCooldown: true);

        private static Texture2D CreateTexture()
        {
            var texture = new Texture2D(2, 2, TextureFormat.RGBA32, false)
            {
                name = "PavementHammerRuntimeEvidenceTexture",
                filterMode = FilterMode.Point,
                wrapMode = TextureWrapMode.Clamp,
            };
            texture.SetPixels(new[] { Color.white, Color.white, Color.white, Color.white });
            texture.Apply(false, false);
            return texture;
        }

        private static void InvokeStaggerLateUpdate(U2EnemyActor enemy)
        {
            var behaviours = enemy.GetComponents<MonoBehaviour>();
            MonoBehaviour driver = null;
            for (var index = 0; index < behaviours.Length; index++)
            {
                if (behaviours[index] != null && behaviours[index].GetType().Name == "U2EnemyBreakStaggerDriver")
                {
                    driver = behaviours[index];
                    break;
                }
            }
            Require(driver != null, "real Unity U2EnemyBreakStaggerDriver was not attached");
            var lateUpdate = driver.GetType().GetMethod("LateUpdate", BindingFlags.Instance | BindingFlags.NonPublic);
            Require(lateUpdate != null, "real Unity stagger driver LateUpdate method missing");
            lateUpdate.Invoke(driver, null);
        }

        private static string ResolveRepositoryRoot()
        {
            var projectRoot = Directory.GetParent(Application.dataPath)?.FullName;
            Require(!string.IsNullOrWhiteSpace(projectRoot), "could not resolve Unity project root");
            var unityRoot = Directory.GetParent(projectRoot)?.FullName;
            Require(!string.IsNullOrWhiteSpace(unityRoot), "could not resolve repository unity root");
            var repoRoot = Directory.GetParent(unityRoot)?.FullName;
            Require(!string.IsNullOrWhiteSpace(repoRoot), "could not resolve repository root");
            return repoRoot;
        }

        private static string Sha256(string repoRoot, string relativePath)
        {
            var path = Path.Combine(repoRoot, relativePath.Replace('/', Path.DirectorySeparatorChar));
            Require(File.Exists(path), $"runtime evidence source missing: {relativePath}");
            using var stream = File.OpenRead(path);
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(stream);
            var builder = new StringBuilder(bytes.Length * 2);
            for (var index = 0; index < bytes.Length; index++) builder.Append(bytes[index].ToString("x2"));
            return builder.ToString();
        }

        private static bool Nearly(float left, float right)
            => Mathf.Abs(left - right) <= .0001f;

        private static bool IsLowerHex(string value, int length)
        {
            if (value == null || value.Length != length) return false;
            for (var index = 0; index < value.Length; index++)
            {
                var character = value[index];
                if (!((character >= '0' && character <= '9') || (character >= 'a' && character <= 'f'))) return false;
            }
            return true;
        }

        private static void WriteEvidence(string repoRoot, RuntimeEvidence evidence)
        {
            var path = Path.Combine(repoRoot, EvidenceRelativePath.Replace('/', Path.DirectorySeparatorChar));
            Directory.CreateDirectory(Path.GetDirectoryName(path) ?? repoRoot);
            File.WriteAllText(path, JsonUtility.ToJson(evidence, true) + Environment.NewLine);
        }

        private static RuntimeEvidence CreateEmptyEvidence()
            => new()
            {
                schemaVersion = 1,
                executed = false,
                result = "NOT_RUN",
                sourceCommit = string.Empty,
                generatedAtUtc = string.Empty,
                weaponId = PavementHammerPrototypeRuntime.WeaponId,
                runtimeBoundary = PavementHammerPrototypeRuntime.RuntimeBoundary,
                tuningAuthority = "TEST_ONLY_PROTOTYPE_TUNING_NOT_CANON",
                applicationOrder = PavementHammerPrototypeRuntime.ApplicationOrder,
                telemetry = new TelemetryEvidence(),
                sourceSha256 = new SourceHashes(),
                error = string.Empty,
            };

        private static void Require(bool condition, string message)
        {
            if (!condition) throw new InvalidOperationException(message);
        }

        [Serializable]
        private sealed class RuntimeEvidence
        {
            public int schemaVersion;
            public bool executed;
            public string result;
            public string sourceCommit;
            public string generatedAtUtc;
            public string weaponId;
            public string runtimeBoundary;
            public string tuningAuthority;
            public string applicationOrder;
            public int firstInvocationSelected;
            public int secondInvocationSelected;
            public bool defeatedTargetPostDamageEffectsSkipped;
            public bool survivorsExposedAfterFirstInvocation;
            public bool statusCooldownIndependentOnSecondInvocation;
            public float firstInvocationBreakAccumulated;
            public float secondInvocationResidualBreak;
            public float secondInvocationStaggerSeconds;
            public bool knockbackBeforeStaggerAnchor;
            public TelemetryEvidence telemetry;
            public SourceHashes sourceSha256;
            public string error;
        }

        [Serializable]
        private sealed class TelemetryEvidence
        {
            public int invocationCount;
            public int selectedTargetCount;
            public int damageAttemptCount;
            public int defeatedTargetCount;
            public int statusApplyAttemptCount;
            public int statusAppliedCount;
            public int statusBlockedByInternalCooldownCount;
            public int knockbackAttemptCount;
            public int knockbackAppliedCount;
            public int breakStaggerAttemptCount;
            public int breakStaggerAppliedCount;
            public int staggerTriggeredCount;

            public static TelemetryEvidence From(PavementHammerPrototypeTelemetry telemetry)
                => new()
                {
                    invocationCount = telemetry.InvocationCount,
                    selectedTargetCount = telemetry.SelectedTargetCount,
                    damageAttemptCount = telemetry.DamageAttemptCount,
                    defeatedTargetCount = telemetry.DefeatedTargetCount,
                    statusApplyAttemptCount = telemetry.StatusApplyAttemptCount,
                    statusAppliedCount = telemetry.StatusAppliedCount,
                    statusBlockedByInternalCooldownCount = telemetry.StatusBlockedByInternalCooldownCount,
                    knockbackAttemptCount = telemetry.KnockbackAttemptCount,
                    knockbackAppliedCount = telemetry.KnockbackAppliedCount,
                    breakStaggerAttemptCount = telemetry.BreakStaggerAttemptCount,
                    breakStaggerAppliedCount = telemetry.BreakStaggerAppliedCount,
                    staggerTriggeredCount = telemetry.StaggerTriggeredCount,
                };
        }

        [Serializable]
        private sealed class SourceHashes
        {
            public string caller = string.Empty;
            public string slamWave = string.Empty;
            public string knockback = string.Empty;
            public string breakStagger = string.Empty;
            public string statusState = string.Empty;
            public string statusRequest = string.Empty;
        }
    }
}
