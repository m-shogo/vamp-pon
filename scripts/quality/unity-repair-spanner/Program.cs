using System;
using System.Collections.Generic;
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
        private float hp;

        public U2EnemyActor(float x, float y, float hp)
        {
            transform.position = new UnityEngine.Vector3(x, y, 7f);
            this.hp = hp;
            IsTargetable = hp > 0f;
        }

        public UnityEngine.Transform transform { get; } = new();
        public bool IsTargetable { get; private set; }
        public EnemyStatusRuntimeState Statuses { get; } = new();
        public float Hp => hp;

        public bool TakeDamage(float damage, float damageFlashSeconds)
        {
            if (!IsTargetable) return false;
            hp = Math.Max(0f, hp - damage);
            if (hp > 0f) return false;
            IsTargetable = false;
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

    private static EnemyStatusApplicationPolicy TestExposedPolicy()
        => new(
            durationSeconds: 3f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Refresh,
            maxStacks: 1,
            magnitude: .25f,
            magnitudeMode: EnemyStatusMagnitudeMode.Max,
            maxMagnitude: .25f,
            internalCooldownSeconds: 10f,
            respectInternalCooldown: true);

    private static int Main()
    {
        var first = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f, 100f);
        var second = new VampPon.UnitySpike.Runtime.U2EnemyActor(3f, 0f, 100f);
        var defeatedOnOutbound = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f, 5f);
        var offPath = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 1f, 100f);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            first,
            second,
            defeatedOnOutbound,
            offPath,
        };

        var state = new RepairSpannerPrototypeState();
        var telemetry = new RepairSpannerPrototypeTelemetry();
        var spawn = new UnityEngine.Vector3(0f, 0f, 9f);
        var outboundTarget = new UnityEngine.Vector3(4f, 0f, -5f);
        var returnAnchor = new UnityEngine.Vector3(0f, 0f, 22f);

        Require(state.TryBegin(spawn, outboundTarget, telemetry), "valid Repair Spanner begin should succeed");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2ReturningProjectilePhase.Outbound,
            "begin must enter outbound phase");
        Require(Near(state.Position.z, 9f), "spawn z should be preserved by caller state");

        Require(state.TryStep(
                returnAnchor,
                speed: 2f,
                deltaSeconds: 1f,
                arrivalDistance: .01f,
                candidates,
                hitRadius: .15f,
                damage: 10f,
                damageFlashSeconds: .05f,
                TestExposedPolicy(),
                out var firstStep,
                telemetry),
            "first outbound step should succeed");
        Require(firstStep.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2ReturningProjectilePhase.Outbound,
            "first step should remain outbound");
        Require(Near(state.Position.x, 2f), "first step position mismatch");
        Require(Near(state.Position.z, 9f), "return motion must preserve projectile z");
        Require(Near(first.Hp, 90f), "first outbound target should be hit once");
        Require(!defeatedOnOutbound.IsTargetable, "low-HP target should be defeated on outbound leg");
        Require(!defeatedOnOutbound.Statuses.Has(EnemyStatusRuntimeKind.Exposed),
            "defeated target must not receive EXPOSED after damage");
        Require(Near(offPath.Hp, 100f), "off-path target must not be hit");

        Require(state.TryStep(
                returnAnchor,
                speed: 2f,
                deltaSeconds: 1f,
                arrivalDistance: .01f,
                candidates,
                hitRadius: .15f,
                damage: 10f,
                damageFlashSeconds: .05f,
                TestExposedPolicy(),
                out var turnStep,
                telemetry),
            "turnaround step should succeed");
        Require(turnStep.TurnedAround, "second step must turn around at outbound target");
        Require(state.Phase == VampPon.UnitySpike.Runtime.Gameplay.Primitives.U2ReturningProjectilePhase.Returning,
            "turnaround must enter returning phase");
        Require(Near(first.Hp, 90f), "same target must not hit twice on outbound leg");
        Require(Near(second.Hp, 90f), "second outbound target should be hit once");

        Require(state.TryStep(
                returnAnchor,
                speed: 4f,
                deltaSeconds: 1f,
                arrivalDistance: .01f,
                candidates,
                hitRadius: .15f,
                damage: 10f,
                damageFlashSeconds: .05f,
                TestExposedPolicy(),
                out var returnStep,
                telemetry),
            "return step should succeed");
        Require(returnStep.Completed && state.IsComplete, "return leg should complete at moving return anchor");
        Require(Near(first.Hp, 80f) && Near(second.Hp, 80f),
            "outbound/return ledgers must allow exactly one hit per target per leg");
        Require(state.OutboundUniqueHitCount == 3, "outbound ledger should include both survivors plus defeated target");
        Require(state.ReturnUniqueHitCount == 2, "return ledger should include surviving on-path targets only");
        Require(first.Statuses.Has(EnemyStatusRuntimeKind.Exposed) && second.Statuses.Has(EnemyStatusRuntimeKind.Exposed),
            "surviving outbound targets must receive EXPOSED");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 2,
            "return EXPOSED attempts should be cooldown-blocked independently of damage");
        Require(telemetry.OutboundHitCount == 3 && telemetry.ReturnHitCount == 2,
            "telemetry must preserve separate outbound/return hit counts");
        Require(telemetry.DefeatedCount == 1, "defeat telemetry mismatch");
        Require(telemetry.TurnaroundCount == 1 && telemetry.CompleteCount == 1,
            "turnaround/completion telemetry mismatch");

        state.Reset();
        Require(!state.IsActive && !state.IsComplete && state.OutboundUniqueHitCount == 0 && state.ReturnUniqueHitCount == 0,
            "reset must clear motion phase and both hit ledgers");

        Require(!state.TryBegin(new UnityEngine.Vector3(float.NaN, 0f, 0f), outboundTarget),
            "invalid spawn must fail closed");
        Require(state.TryBegin(spawn, outboundTarget), "state should be reusable after failed begin");
        Require(!state.TryStep(returnAnchor, 0f, 1f, .01f, candidates, .15f, 10f, .05f, TestExposedPolicy(), out _),
            "zero speed must fail closed without hits");
        Require(!state.TryStep(returnAnchor, 2f, 1f, .01f, null, .15f, 10f, .05f, TestExposedPolicy(), out _),
            "null candidates must fail closed");
        Require(!state.TryStep(returnAnchor, 2f, 1f, .01f, candidates, 0f, 10f, .05f, TestExposedPolicy(), out _),
            "zero hit radius must fail closed");

        telemetry.Reset();
        Require(telemetry.BeginCount == 0 && telemetry.OutboundHitCount == 0 && telemetry.StatusApplyAttemptCount == 0,
            "telemetry reset failed");

        Console.WriteLine("PASS Repair Spanner: outbound/return motion + per-leg hit ledger + EXPOSED + death short-circuit + telemetry");
        return 0;
    }
}
