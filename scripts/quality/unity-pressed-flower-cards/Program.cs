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
            transform.position = new UnityEngine.Vector3(x, y, 6f);
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

    private static EnemyStatusApplicationPolicy RootPolicy(float cooldown = 0f)
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
        var state = new PressedFlowerCardsPrototypeState();
        var telemetry = new PressedFlowerCardsPrototypeTelemetry();
        var placement = new UnityEngine.Vector3(2f, 3f, 9f);
        var first = new VampPon.UnitySpike.Runtime.U2EnemyActor(2.5f, 3f);
        var second = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 3.5f);
        var outside = new VampPon.UnitySpike.Runtime.U2EnemyActor(5f, 3f);

        Require(state.TryBegin(placement, armingDelaySeconds: 1f, activeDurationSeconds: 4f, triggerBudget: 2, telemetry),
            "Pressed Flower Card begin should succeed with caller-supplied trap tuning");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2PersistentTrapPhase.Arming,
            "positive arming delay must begin in Arming phase");
        Require(state.Position.x == 2f && state.Position.y == 3f && state.Position.z == 9f,
            "trap placement must preserve caller-supplied position including z");

        Require(!state.TryTrigger(first, 1f, RootPolicy(), out _, telemetry),
            "arming card must reject trigger before it becomes armed");
        Require(state.RemainingTriggerBudget == 2,
            "rejected pre-arm trigger must not consume trigger budget");

        Require(state.TryTick(.5f, out var halfArm, telemetry) && !halfArm.ArmedThisTick,
            "partial arming tick must remain unarmed");
        Require(state.TryTick(.6f, out var armed, telemetry) && armed.ArmedThisTick && state.IsArmed,
            "arming overshoot must arm card and carry leftover time into active lifetime");
        Require(telemetry.ArmedTransitionCount == 1,
            "arming transition telemetry should occur exactly once");

        Require(!state.TryTrigger(outside, 1f, RootPolicy(), out _, telemetry),
            "target outside caller trigger radius must not consume the card");
        Require(state.RemainingTriggerBudget == 2,
            "out-of-range target must not consume trigger budget");

        Require(state.TryTrigger(first, 1f, RootPolicy(), out var firstTrigger, telemetry),
            "first in-range target should trigger armed card");
        Require(firstTrigger.Triggered && !firstTrigger.Exhausted && firstTrigger.RemainingTriggerBudget == 1,
            "first trigger should consume one budget without exhausting two-use card");
        Require(firstTrigger.RootedResult == EnemyStatusApplyResult.Applied && first.Statuses.Has(EnemyStatusRuntimeKind.Rooted),
            "successful card trigger must apply typed ROOTED");
        Require(state.UniqueTriggeredTargetCount == 1,
            "card should remember unique triggered target for this placement");

        Require(!state.TryTrigger(first, 1f, RootPolicy(), out _, telemetry),
            "same target must not consume the same placed card twice");
        Require(state.RemainingTriggerBudget == 1,
            "duplicate target rejection must preserve remaining budget");

        Require(state.TryTrigger(second, 1f, RootPolicy(), out var secondTrigger, telemetry),
            "second unique in-range target should consume final card budget");
        Require(secondTrigger.Exhausted && secondTrigger.RemainingTriggerBudget == 0,
            "final trigger should exhaust shared trap budget");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2PersistentTrapPhase.Exhausted,
            "zero remaining trigger budget must move card to Exhausted");
        Require(!state.TryTrigger(outside, 10f, RootPolicy(), out _, telemetry),
            "exhausted card must reject later targets even with permissive radius");

        // ROOTED cooldown may block Status but an eligible trap trigger still consumes one physical trigger.
        state.Reset();
        var cooldownTarget = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 3f);
        var cooldownPolicy = RootPolicy(10f);
        Require(cooldownTarget.Statuses.Apply(EnemyStatusRuntimeKind.Rooted, cooldownPolicy) == EnemyStatusApplyResult.Applied,
            "ROOTED cooldown fixture seed failed");
        Require(state.TryBegin(placement, 0f, 3f, 1, telemetry) && state.IsArmed,
            "zero arming delay should create immediately armed card");
        Require(state.TryTrigger(cooldownTarget, 1f, cooldownPolicy, out var blockedRoot, telemetry),
            "eligible target should physically trigger card even when ROOTED is on cooldown");
        Require(blockedRoot.RootedResult == EnemyStatusApplyResult.BlockedByInternalCooldown,
            "ROOTED internal cooldown should block only Status application");
        Require(blockedRoot.Exhausted && state.RemainingTriggerBudget == 0,
            "ROOTED cooldown must not refund consumed trap trigger budget");

        // Time expiry terminates a still-unused card.
        state.Reset();
        Require(state.TryBegin(placement, .5f, 1f, 3, telemetry),
            "expiry fixture begin failed");
        Require(state.TryTick(2f, out var expired, telemetry),
            "large tick should be allowed to arm and expire in one call");
        Require(expired.ArmedThisTick && expired.ExpiredThisTick &&
                state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2PersistentTrapPhase.Expired,
            "arming carryover should consume active lifetime and expire without frame-rate extension");
        Require(!state.TryTrigger(first, 1f, RootPolicy(), out _, telemetry),
            "expired card must reject triggers");

        // Invalid operations fail closed.
        state.Reset();
        Require(!state.TryBegin(placement, -1f, 2f, 1, telemetry),
            "negative arming delay must fail closed");
        Require(state.TryBegin(placement, 0f, 2f, 1, telemetry),
            "valid begin after failed begin should still work");
        var budgetBeforeInvalidRadius = state.RemainingTriggerBudget;
        Require(!state.TryTrigger(first, 0f, RootPolicy(), out _, telemetry),
            "non-positive trigger radius must fail closed");
        Require(state.RemainingTriggerBudget == budgetBeforeInvalidRadius,
            "invalid trigger radius must not consume trigger budget");

        state.Reset();
        telemetry.Reset();
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2PersistentTrapPhase.Inactive &&
                state.UniqueTriggeredTargetCount == 0,
            "Pressed Flower Card reset must clear trap state and target ledger");
        Require(telemetry.BeginAttemptCount == 0 && telemetry.TriggerAttemptCount == 0 && telemetry.RootedApplyAttemptCount == 0,
            "Pressed Flower Card telemetry reset failed");

        Console.WriteLine("PASS Pressed Flower Cards: arm/expiry + radius + unique target + trigger budget + ROOTED cooldown independence");
        return 0;
    }
}
