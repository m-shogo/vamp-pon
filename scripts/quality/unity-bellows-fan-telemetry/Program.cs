using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace UnityEngine
{
    public struct Vector2
    {
        public float x;
        public float y;
        public Vector2(float x, float y) { this.x = x; this.y = y; }
    }

    public struct Vector3
    {
        public float x;
        public float y;
        public float z;
        public Vector3(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }
        public static Vector3 operator +(Vector3 left, Vector3 right) => new(left.x + right.x, left.y + right.y, left.z + right.z);
        public static Vector3 operator -(Vector3 left, Vector3 right) => new(left.x - right.x, left.y - right.y, left.z - right.z);
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
        public bool IsTargetable { get; set; } = true;
        public UnityEngine.Transform transform { get; } = new();
        public EnemyStatusRuntimeState Statuses { get; } = new();
    }
}

internal static class Program
{
    private static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static VampPon.UnitySpike.Runtime.U2EnemyActor Enemy(float x, float y)
    {
        var enemy = new VampPon.UnitySpike.Runtime.U2EnemyActor();
        enemy.transform.position = new UnityEngine.Vector3(x, y, 3f);
        return enemy;
    }

    private static EnemyStatusApplicationPolicy CooldownPolicy()
        => new(
            durationSeconds: 4f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Replace,
            maxStacks: 1,
            magnitude: 0.25f,
            magnitudeMode: EnemyStatusMagnitudeMode.Replace,
            maxMagnitude: 1f,
            internalCooldownSeconds: 10f,
            respectInternalCooldown: true);

    private static EnemyStatusApplicationPolicy NoCooldownPolicy()
        => new(
            durationSeconds: 4f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Replace,
            maxStacks: 1,
            magnitude: 0.25f,
            magnitudeMode: EnemyStatusMagnitudeMode.Replace,
            maxMagnitude: 1f,
            internalCooldownSeconds: 0f,
            respectInternalCooldown: false);

    private static int Main()
    {
        var telemetry = new BellowsFanPrototypeTelemetry();
        var near = Enemy(3f, 0f);
        var diagonal = Enemy(4f, 3f);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { diagonal, near };
        var scratch = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>(4);

        var first = BellowsFanPrototypeRuntime.Fire(
            candidates,
            scratch,
            new UnityEngine.Vector3(0f, 0f, 0f),
            new UnityEngine.Vector2(1f, 0f),
            range: 10f,
            halfAngleDegrees: 45f,
            maxTargets: 2,
            knockbackDistance: 1f,
            disorientedPolicy: CooldownPolicy(),
            telemetry: telemetry);

        Require(first == 2, "first Bellows telemetry call should select two targets");
        Require(telemetry.InvocationCount == 1, "valid call must record one invocation");
        Require(telemetry.RequestedTargetCapacityTotal == 2, "requested target capacity mismatch after first call");
        Require(telemetry.SelectedTargetCount == 2, "selected target telemetry mismatch after first call");
        Require(telemetry.StatusApplyAttemptCount == 2, "Status attempt telemetry mismatch after first call");
        Require(telemetry.StatusAppliedCount == 2, "first Status applications should succeed");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 0, "first Status applications must not report cooldown block");
        Require(telemetry.KnockbackAttemptCount == 2, "knockback attempt telemetry mismatch after first call");
        Require(telemetry.KnockbackAppliedCount == 2, "first knockbacks should apply");
        Require(telemetry.KnockbackRejectedCount == 0, "first knockbacks should not be rejected");

        var second = BellowsFanPrototypeRuntime.Fire(
            candidates,
            scratch,
            new UnityEngine.Vector3(0f, 0f, 0f),
            new UnityEngine.Vector2(1f, 0f),
            range: 10f,
            halfAngleDegrees: 45f,
            maxTargets: 2,
            knockbackDistance: 1f,
            disorientedPolicy: CooldownPolicy(),
            telemetry: telemetry);

        Require(second == 2, "second Bellows telemetry call should still select both targets");
        Require(telemetry.InvocationCount == 2, "second valid call must increment invocation telemetry");
        Require(telemetry.RequestedTargetCapacityTotal == 4, "requested capacity must accumulate");
        Require(telemetry.SelectedTargetCount == 4, "selected targets must accumulate");
        Require(telemetry.StatusApplyAttemptCount == 4, "Status attempts must include cooldown-blocked reapplication");
        Require(telemetry.StatusAppliedCount == 2, "cooldown-blocked reapplication must not increase applied count");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 2, "cooldown-blocked results must be counted exactly");
        Require(telemetry.KnockbackAttemptCount == 4, "knockback remains independent from Status cooldown");
        Require(telemetry.KnockbackAppliedCount == 4, "knockback should still apply when Status is cooldown-blocked");
        Require(telemetry.KnockbackRejectedCount == 0, "valid outward knockback should remain accepted");

        var coincident = Enemy(0f, 0f);
        var coincidentCandidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { coincident };
        var coincidentScratch = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>();
        var third = BellowsFanPrototypeRuntime.Fire(
            coincidentCandidates,
            coincidentScratch,
            new UnityEngine.Vector3(0f, 0f, 99f),
            new UnityEngine.Vector2(1f, 0f),
            range: 10f,
            halfAngleDegrees: 45f,
            maxTargets: 1,
            knockbackDistance: 1f,
            disorientedPolicy: NoCooldownPolicy(),
            telemetry: telemetry);

        Require(third == 1, "coincident 2D target should be selected by cone query");
        Require(telemetry.InvocationCount == 3, "third valid call must be recorded");
        Require(telemetry.RequestedTargetCapacityTotal == 5, "third requested capacity must accumulate");
        Require(telemetry.SelectedTargetCount == 5, "third selected target must accumulate");
        Require(telemetry.StatusApplyAttemptCount == 5 && telemetry.StatusAppliedCount == 3, "coincident target should still receive DISORIENTED");
        Require(telemetry.KnockbackAttemptCount == 5, "coincident target should record a knockback attempt");
        Require(telemetry.KnockbackAppliedCount == 4, "coincident target must not increment successful knockback count");
        Require(telemetry.KnockbackRejectedCount == 1, "coincident 2D source must expose one rejected knockback");

        var emptyScratch = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>();
        var noSelection = BellowsFanPrototypeRuntime.Fire(
            candidates,
            emptyScratch,
            new UnityEngine.Vector3(0f, 0f, 0f),
            new UnityEngine.Vector2(0f, 0f),
            range: 10f,
            halfAngleDegrees: 45f,
            maxTargets: 1,
            knockbackDistance: 1f,
            disorientedPolicy: NoCooldownPolicy(),
            telemetry: telemetry);
        Require(noSelection == 0, "zero forward must fail closed");
        Require(telemetry.InvocationCount == 4, "validly configured query invocation should record even when query selects zero");
        Require(telemetry.RequestedTargetCapacityTotal == 6, "zero-selection invocation should retain requested capacity evidence");
        Require(telemetry.SelectedTargetCount == 5, "zero-selection invocation must not inflate selected target count");
        Require(telemetry.StatusApplyAttemptCount == 5 && telemetry.KnockbackAttemptCount == 5, "zero-selection invocation must not create effect attempts");

        var beforeInvalidInvocationCount = telemetry.InvocationCount;
        BellowsFanPrototypeRuntime.Fire(
            candidates,
            emptyScratch,
            new UnityEngine.Vector3(0f, 0f, 0f),
            new UnityEngine.Vector2(1f, 0f),
            range: 10f,
            halfAngleDegrees: 45f,
            maxTargets: 0,
            knockbackDistance: 1f,
            disorientedPolicy: NoCooldownPolicy(),
            telemetry: telemetry);
        Require(telemetry.InvocationCount == beforeInvalidInvocationCount, "invalid precondition must not masquerade as an executed cone query");

        telemetry.Reset();
        Require(telemetry.InvocationCount == 0, "Reset must clear invocation count");
        Require(telemetry.RequestedTargetCapacityTotal == 0, "Reset must clear requested capacity");
        Require(telemetry.SelectedTargetCount == 0, "Reset must clear selected target count");
        Require(telemetry.StatusApplyAttemptCount == 0, "Reset must clear Status attempts");
        Require(telemetry.StatusAppliedCount == 0, "Reset must clear Status applied count");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 0, "Reset must clear Status cooldown blocks");
        Require(telemetry.KnockbackAttemptCount == 0, "Reset must clear knockback attempts");
        Require(telemetry.KnockbackAppliedCount == 0, "Reset must clear successful knockbacks");
        Require(telemetry.KnockbackRejectedCount == 0, "Reset must clear rejected knockbacks");

        Console.WriteLine("PASS Bellows Fan telemetry: invocation/selection/Status outcomes/knockback outcomes/reset");
        return 0;
    }
}
