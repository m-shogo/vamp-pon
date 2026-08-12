using System;
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
            transform.position = new UnityEngine.Vector3(x, y, 7f);
            IsTargetable = targetable;
        }

        public UnityEngine.Transform transform { get; } = new();
        public bool IsTargetable { get; set; }
        public EnemyStatusRuntimeState Statuses { get; } = new();
    }
}

internal static class Program
{
    private static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static EnemyStatusApplicationPolicy DrowsyPolicy(float cooldown = 0f)
        => new(
            durationSeconds: 3f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Refresh,
            maxStacks: 1,
            magnitude: .2f,
            magnitudeMode: EnemyStatusMagnitudeMode.Max,
            maxMagnitude: .2f,
            internalCooldownSeconds: cooldown,
            respectInternalCooldown: true);

    private static int Main()
    {
        var state = new DreamAlarmPrototypeState();
        var telemetry = new DreamAlarmPrototypeTelemetry();
        var position = new UnityEngine.Vector3(2f, 3f, 9f);
        var inside = new VampPon.UnitySpike.Runtime.U2EnemyActor(2.5f, 3f);
        var boundary = new VampPon.UnitySpike.Runtime.U2EnemyActor(3f, 3f);
        var outside = new VampPon.UnitySpike.Runtime.U2EnemyActor(3.01f, 3f);
        var untargetable = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 3f, false);

        Require(state.TryBegin(position, 1f, telemetry), "Dream Alarm begin should accept caller-supplied positive delay");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2DelayedTriggerPhase.Waiting,
            "positive delay must begin Waiting");
        Require(state.Position.x == 2f && state.Position.y == 3f && state.Position.z == 9f,
            "Dream Alarm must preserve placement position including z");
        Require(!state.TryFire(new[] { inside }, 1f, DrowsyPolicy(), out _, telemetry),
            "Dream Alarm must not fire before Ready");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2DelayedTriggerPhase.Waiting,
            "rejected early fire must not consume delay gate");

        Require(state.TryTick(.4f, out var waiting, telemetry) && !waiting.BecameReadyThisTick,
            "partial delay tick must remain Waiting");
        Require(state.TryTick(.7f, out var ready, telemetry) && ready.BecameReadyThisTick && state.IsReady,
            "delay overshoot must transition to Ready exactly once");
        Require(telemetry.ReadyTransitionCount == 1, "Ready transition telemetry must occur once");
        Require(state.TryTick(.2f, out var stillReady, telemetry) && !stillReady.BecameReadyThisTick && state.IsReady,
            "Ready tick must not auto-fire or re-emit readiness");

        Require(state.TryFire(
                new[] { inside, boundary, outside, untargetable },
                pulseRadius: 1f,
                DrowsyPolicy(),
                out var pulse,
                telemetry),
            "Ready Dream Alarm should explicitly consume and fire once");
        Require(pulse.Fired && pulse.TargetCount == 2 && pulse.StatusAppliedCount == 2 && pulse.StatusBlockedCount == 0,
            "pulse must include targetable XY boundary and exclude outside/untargetable candidates");
        Require(inside.Statuses.Has(EnemyStatusRuntimeKind.Drowsy) && boundary.Statuses.Has(EnemyStatusRuntimeKind.Drowsy),
            "in-range Dream Alarm targets must receive typed DROWSY");
        Require(!outside.Statuses.Has(EnemyStatusRuntimeKind.Drowsy) && !untargetable.Statuses.Has(EnemyStatusRuntimeKind.Drowsy),
            "outside/untargetable targets must not receive DROWSY");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2DelayedTriggerPhase.Fired,
            "explicit fire must consume Ready into Fired");
        Require(!state.TryFire(new[] { inside }, 1f, DrowsyPolicy(), out _, telemetry),
            "Fired Dream Alarm must not fire twice");

        // Empty area is still a real one-shot pulse and consumes the Ready trigger.
        state.Reset();
        Require(state.TryBegin(position, 0f, telemetry) && state.IsReady,
            "zero delay must begin immediately Ready without auto-fire");
        Require(state.TryFire(Array.Empty<VampPon.UnitySpike.Runtime.U2EnemyActor>(), 1f, DrowsyPolicy(), out var emptyPulse, telemetry),
            "Ready Dream Alarm may fire into an empty area");
        Require(emptyPulse.Fired && emptyPulse.TargetCount == 0 && state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2DelayedTriggerPhase.Fired,
            "empty pulse must still consume the one-shot alarm exactly once");

        // DROWSY cooldown blocks only Status; the one-shot pulse still fires and includes the target.
        state.Reset();
        var cooldownTarget = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 3f);
        var cooldownPolicy = DrowsyPolicy(10f);
        Require(cooldownTarget.Statuses.Apply(EnemyStatusRuntimeKind.Drowsy, cooldownPolicy) == EnemyStatusApplyResult.Applied,
            "DROWSY cooldown fixture seed failed");
        Require(state.TryBegin(position, 0f, telemetry), "cooldown fixture begin failed");
        Require(state.TryFire(new[] { cooldownTarget }, 1f, cooldownPolicy, out var blockedPulse, telemetry),
            "DROWSY cooldown must not prevent physical pulse consumption");
        Require(blockedPulse.TargetCount == 1 && blockedPulse.StatusAppliedCount == 0 && blockedPulse.StatusBlockedCount == 1,
            "DROWSY cooldown must block only Status application");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2DelayedTriggerPhase.Fired,
            "Status cooldown must not refund the one-shot delayed pulse");

        // Cancel prevents a pending or ready alarm from firing.
        state.Reset();
        Require(state.TryBegin(position, 2f, telemetry) && state.TryCancel(),
            "Waiting Dream Alarm should support caller cancellation");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2DelayedTriggerPhase.Cancelled &&
                !state.TryFire(new[] { inside }, 1f, DrowsyPolicy(), out _, telemetry),
            "cancelled alarm must reject fire");
        state.Reset();
        Require(state.TryBegin(position, 0f, telemetry) && state.TryCancel(),
            "Ready Dream Alarm should support cancellation before explicit consume");
        Require(!state.TryFire(new[] { inside }, 1f, DrowsyPolicy(), out _, telemetry),
            "cancelled Ready alarm must not fire");

        // Invalid inputs fail closed without consuming a valid Ready state.
        state.Reset();
        Require(!state.TryBegin(new UnityEngine.Vector3(float.NaN, 0f, 0f), 1f, telemetry),
            "non-finite placement must fail closed");
        Require(state.TryBegin(position, 0f, telemetry), "valid begin after failed begin should work");
        Require(!state.TryFire(new[] { inside }, 0f, DrowsyPolicy(), out _, telemetry),
            "non-positive pulse radius must fail closed");
        Require(state.IsReady, "invalid fire input must not consume a valid Ready alarm");
        Require(!state.TryFire(null, 1f, DrowsyPolicy(), out _, telemetry),
            "null candidate list must fail closed");
        Require(state.IsReady, "null candidates must not consume a valid Ready alarm");

        state.Reset();
        telemetry.Reset();
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2DelayedTriggerPhase.Inactive,
            "Dream Alarm reset must return trigger to Inactive");
        Require(telemetry.BeginAttemptCount == 0 && telemetry.FireAttemptCount == 0 && telemetry.StatusApplyAttemptCount == 0,
            "Dream Alarm telemetry reset failed");

        Console.WriteLine("PASS Dream Alarm: delayed Ready gate + explicit one-shot area DROWSY + cooldown/cancel/fail-closed");
        return 0;
    }
}
