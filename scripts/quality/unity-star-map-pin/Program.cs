using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace UnityEngine
{
    public struct Vector3
    {
        public float x;
        public float y;
        public float z;
        public Vector3(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }
        public static Vector3 operator -(Vector3 left, Vector3 right)
            => new(left.x - right.x, left.y - right.y, left.z - right.z);
    }

    public sealed class Transform
    {
        public Vector3 position;
    }
}

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U2EnemyActor
    {
        public U2EnemyActor(float x, float y, bool targetable = true)
        {
            transform.position = new UnityEngine.Vector3(x, y, 9f);
            IsTargetable = targetable;
        }

        public UnityEngine.Transform transform { get; } = new();
        public bool IsTargetable { get; set; }
        public EnemyStatusRuntimeState Statuses { get; } = new();
    }

    public sealed class U2BattleController
    {
        public bool RejectNextFire { get; set; }
        public U2EnemyActor LastTarget { get; private set; }
        public float LastDamage { get; private set; }
        public int LastPierce { get; private set; }
        public EnemyStatusRuntimeKind LastStatusKind { get; private set; }
        public int FireAttemptCount { get; private set; }

        public bool FireGameplayProjectileAtTarget(
            U2EnemyActor target,
            float damage,
            int pierce,
            EnemyStatusApplicationRequest statusRequest)
        {
            FireAttemptCount++;
            LastTarget = target;
            LastDamage = damage;
            LastPierce = pierce;
            LastStatusKind = statusRequest.Kind;
            if (RejectNextFire)
            {
                RejectNextFire = false;
                return false;
            }
            if (target == null || !target.IsTargetable)
            {
                return false;
            }

            statusRequest.ApplyTo(target.Statuses);
            return true;
        }
    }
}

internal static class Program
{
    private static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static bool Near(float left, float right)
        => Math.Abs(left - right) <= .0001f;

    private static EnemyStatusApplicationPolicy MarkedPolicy()
        => new(
            durationSeconds: 5f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Refresh,
            maxStacks: 1,
            magnitude: .2f,
            magnitudeMode: EnemyStatusMagnitudeMode.Max,
            maxMagnitude: .2f,
            internalCooldownSeconds: 2f,
            respectInternalCooldown: true);

    private static int Main()
    {
        Require(StarMapPinPrototypeRuntime.WeaponId == "star_map_pin", "weapon identity drift");
        Require(StarMapPinPrototypeRuntime.ContentStatusId == "MARKED", "status identity drift");
        Require(
            StarMapPinPrototypeRuntime.TuningAuthority == "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON",
            "Star Map Pin caller must not own Canon tuning");
        Require(
            StarMapPinPrototypeRuntime.RuntimeBoundary == "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE",
            "Star Map Pin caller must remain outside live runtime");
        Require(
            StarMapPinPrototypeRuntime.ApplicationOrder == "PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT",
            "Star Map Pin application order drift");

        var near = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var priority = new VampPon.UnitySpike.Runtime.U2EnemyActor(3f, 0f);
        var far = new VampPon.UnitySpike.Runtime.U2EnemyActor(5f, 0f);
        var untargetable = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 0f, false);
        var outside = new VampPon.UnitySpike.Runtime.U2EnemyActor(9f, 0f);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            near,
            far,
            priority,
            untargetable,
            outside,
        };
        var scores = new List<float> { 1f, 1f, 3f, 99f, 100f };
        var origin = new UnityEngine.Vector3(0f, 0f, -20f);
        var battle = new VampPon.UnitySpike.Runtime.U2BattleController();
        var telemetry = new StarMapPinPrototypeTelemetry();

        Require(
            StarMapPinPrototypeRuntime.Fire(
                battle,
                candidates,
                scores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                damage: 17f,
                pierce: 2,
                markedPolicy: MarkedPolicy(),
                telemetry: telemetry),
            "highest-priority Star Map Pin fire should succeed");
        Require(battle.LastTarget == priority, "highest priority must beat farther equal-score targets");
        Require(Near(battle.LastDamage, 17f) && battle.LastPierce == 2, "caller-supplied projectile tuning transport drift");
        Require(battle.LastStatusKind == EnemyStatusRuntimeKind.Marked, "Star Map Pin must transport typed MARKED request");
        Require(priority.Statuses.Has(EnemyStatusRuntimeKind.Marked), "selected target must receive MARKED on simulated projectile hit");
        Require(telemetry.InvocationCount == 1 && telemetry.SelectionSuccessCount == 1, "selection telemetry mismatch after first fire");
        Require(telemetry.LastSelectedCandidateIndex == 2, "selected candidate index telemetry mismatch");
        Require(Near(telemetry.LastSelectedPriorityScore, 3f) && Near(telemetry.LastSelectedDistanceSquared, 9f), "selected priority/distance telemetry mismatch");
        Require(telemetry.ProjectileFiredCount == 1 && telemetry.StatusAppliedCount == 1, "first projectile/Status telemetry mismatch");

        // Immediate repeat selects the same target. MARKED transport still happens through the
        // projectile hit, but Status runtime independently blocks the reapply via caller policy.
        Require(
            StarMapPinPrototypeRuntime.Fire(
                battle,
                candidates,
                scores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                damage: 17f,
                pierce: 2,
                markedPolicy: MarkedPolicy(),
                telemetry: telemetry),
            "second Star Map Pin projectile should still fire despite Status cooldown");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 1, "second MARKED hit should be cooldown-blocked independently");
        Require(telemetry.ProjectileFiredCount == 2, "Status cooldown must not reject projectile fire");

        var equalScores = new List<float> { 5f, 5f, 5f, 99f, 100f };
        Require(
            StarMapPinPrototypeRuntime.Fire(
                battle,
                candidates,
                equalScores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                damage: 9f,
                pierce: 1,
                markedPolicy: MarkedPolicy(),
                telemetry: telemetry),
            "equal-score far preference fire should succeed");
        Require(battle.LastTarget == far, "PreferFarther must choose far target among equal-priority eligible targets");
        Require(far.Statuses.Has(EnemyStatusRuntimeKind.Marked), "far tie winner must receive MARKED on hit");

        battle.RejectNextFire = true;
        Require(
            !StarMapPinPrototypeRuntime.Fire(
                battle,
                candidates,
                equalScores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferNearer,
                damage: 9f,
                pierce: 1,
                markedPolicy: MarkedPolicy(),
                telemetry: telemetry),
            "projectile pool rejection must propagate as false");
        Require(battle.LastTarget == near, "selection should still choose nearest equal-priority target before projectile rejection");
        Require(!near.Statuses.Has(EnemyStatusRuntimeKind.Marked), "rejected projectile must not fabricate a MARKED hit");
        Require(telemetry.ProjectileRejectedCount == 1, "projectile rejection telemetry mismatch");

        near.IsTargetable = false;
        far.IsTargetable = false;
        priority.IsTargetable = false;
        Require(
            !StarMapPinPrototypeRuntime.Fire(
                battle,
                candidates,
                scores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                damage: 9f,
                pierce: 1,
                markedPolicy: MarkedPolicy(),
                telemetry: telemetry),
            "no eligible priority target must return false");
        Require(telemetry.SelectionFailureCount == 1, "selection failure telemetry mismatch");
        Require(telemetry.ProjectileFireAttemptCount == 4, "selection failure must not fabricate projectile attempt");
        Require(telemetry.StatusApplyAttemptCount == 3, "rejected/no-selection paths must not fabricate Status hit outcomes");

        telemetry.Reset();
        Require(telemetry.InvocationCount == 0 && telemetry.LastSelectedCandidateIndex == -1, "Star Map Pin telemetry reset failed");

        var threw = false;
        try
        {
            StarMapPinPrototypeRuntime.Fire(
                null,
                candidates,
                scores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                1f,
                1,
                MarkedPolicy());
        }
        catch (ArgumentNullException)
        {
            threw = true;
        }
        Require(threw, "null battle must fail loudly rather than fabricate a fire result");

        Console.WriteLine("PASS Star Map Pin prototype: priority selection/explicit target projectile/MARKED hit observer/ties/rejection/telemetry");
        return 0;
    }
}
