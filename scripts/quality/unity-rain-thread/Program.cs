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
        public static Vector3 operator +(Vector3 left, Vector3 right)
            => new(left.x + right.x, left.y + right.y, left.z + right.z);
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
            transform.position = new UnityEngine.Vector3(x, y, 5f);
            IsTargetable = targetable;
        }

        public UnityEngine.Transform transform { get; } = new();
        public bool IsTargetable { get; private set; }
        public EnemyStatusRuntimeState Statuses { get; } = new();

        public void SetTargetable(bool value) => IsTargetable = value;
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

    private static EnemyStatusApplicationPolicy TestSoakPolicy()
        => new(
            durationSeconds: 4f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Refresh,
            maxStacks: 1,
            magnitude: .2f,
            magnitudeMode: EnemyStatusMagnitudeMode.Max,
            maxMagnitude: .2f,
            internalCooldownSeconds: 10f,
            respectInternalCooldown: true);

    private static int Main()
    {
        var first = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        var second = new VampPon.UnitySpike.Runtime.U2EnemyActor(5f, 0f);
        var lowerPriority = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 2f);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { first, second, lowerPriority };
        var scores = new List<float> { 5f, 4f, 1f };
        var state = new RainThreadPrototypeState();
        var telemetry = new RainThreadPrototypeTelemetry();
        var origin = new UnityEngine.Vector3(0f, 0f, -20f);

        Require(state.TryBegin(candidates, scores, origin, 0f, 6f, 0f, 6f, 2f, TestSoakPolicy(), out var selection, telemetry),
            "valid Rain Thread begin should succeed");
        Require(selection.First == first && selection.Second == second,
            "highest combined-priority pair should become Rain Thread endpoints");
        Require(state.IsActive && Near(state.RemainingSeconds, 2f), "begin must activate caller-owned link lifetime");
        Require(first.Statuses.Has(EnemyStatusRuntimeKind.Soak) && second.Statuses.Has(EnemyStatusRuntimeKind.Soak),
            "both Rain Thread endpoints must receive SOAK at begin");
        Require(telemetry.StatusAppliedCount == 2, "initial SOAK telemetry should record two applied endpoints");

        Require(state.TryTick(.5f, 2f, 1f, 6f, out var pulled, telemetry),
            "active Rain Thread tick should succeed");
        Require(pulled.PullApplied && pulled.ActiveAfterTick, "distance above tension threshold should apply symmetric pull");
        Require(Near(pulled.PullDistancePerEndpoint, .5f), "caller-supplied pull rate should scale by effective delta");
        Require(Near(first.transform.position.x, 1.5f) && Near(second.transform.position.x, 4.5f),
            "Rain Thread pull must move both endpoints symmetrically toward the pre-move center");
        Require(Near(first.transform.position.z, 5f) && Near(second.transform.position.z, 5f),
            "shared displacement must preserve endpoint z");

        Require(state.TryTick(.5f, 3f, 1f, 6f, out var calm, telemetry),
            "calm Rain Thread tick should succeed");
        Require(!calm.PullApplied && Near(first.transform.position.x, 1.5f) && Near(second.transform.position.x, 4.5f),
            "pair at tension threshold must not receive extra pull");

        Require(state.TryTick(1f, 3f, 1f, 6f, out var expired, telemetry),
            "expiry tick should succeed");
        Require(expired.EndReason == RainThreadLinkEndReason.Expired && !expired.ActiveAfterTick && !state.IsActive,
            "link duration must expire without leaking active endpoints");
        Require(telemetry.ExpiredCount == 1, "expiry telemetry mismatch");

        Require(state.TryBegin(candidates, scores, origin, 0f, 6f, 0f, 6f, 1f, TestSoakPolicy(), out _, telemetry),
            "Rain Thread should be reusable after expiry");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 2,
            "re-begin SOAK attempts should be cooldown-blocked independently from link activation");
        second.SetTargetable(false);
        Require(state.TryTick(.1f, 2f, 1f, 6f, out var endpointLost, telemetry),
            "endpoint-loss tick should resolve successfully");
        Require(endpointLost.EndReason == RainThreadLinkEndReason.EndpointLost && !state.IsActive,
            "untargetable endpoint must break active Rain Thread link");
        Require(telemetry.EndpointLostCount == 1, "endpoint-loss telemetry mismatch");

        second.SetTargetable(true);
        Require(state.TryBegin(candidates, scores, origin, 0f, 6f, 0f, 6f, 1f, TestSoakPolicy(), out _, telemetry),
            "Rain Thread should restart after endpoint loss");
        second.transform.position = new UnityEngine.Vector3(9f, 0f, 5f);
        Require(state.TryTick(.1f, 2f, 1f, 6f, out var distanceBreak, telemetry),
            "distance-break tick should resolve successfully");
        Require(distanceBreak.EndReason == RainThreadLinkEndReason.BrokeByDistance && !state.IsActive,
            "pair beyond max link distance must break before pull");
        Require(telemetry.DistanceBreakCount == 1, "distance-break telemetry mismatch");

        second.transform.position = new UnityEngine.Vector3(5f, 0f, 5f);
        Require(state.TryBegin(candidates, scores, origin, 0f, 6f, 0f, 6f, 1f, TestSoakPolicy(), out _, telemetry),
            "Rain Thread should restart after distance break");
        Require(!state.TryBegin(candidates, scores, origin, 0f, 6f, 0f, 6f, 1f, TestSoakPolicy(), out _, telemetry),
            "active Rain Thread must reject replacement begin instead of mutating the current link");
        Require(!state.TryTick(0f, 2f, 1f, 6f, out _, telemetry), "zero delta must fail closed");
        Require(!state.TryTick(.1f, 7f, 1f, 6f, out _, telemetry), "tension above max link distance must fail closed");
        Require(state.IsActive, "invalid tick must not destroy the active link");
        state.Reset();
        Require(!state.IsActive && state.First == null && state.Second == null && Near(state.RemainingSeconds, 0f),
            "reset must clear caller-owned endpoints and lifetime");

        telemetry.Reset();
        Require(telemetry.BeginAttemptCount == 0 && telemetry.PullTickCount == 0 && telemetry.StatusApplyAttemptCount == 0,
            "Rain Thread telemetry reset failed");

        Console.WriteLine("PASS Rain Thread: pair selection + SOAK both + symmetric pull + expiry/loss/distance break + fail-closed");
        return 0;
    }
}
