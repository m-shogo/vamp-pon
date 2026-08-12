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

        public U2EnemyActor(float x, float y, float hp = 100f, bool targetable = true)
        {
            transform.position = new UnityEngine.Vector3(x, y, 5f);
            this.hp = hp;
            IsTargetable = targetable && hp > 0f;
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

    private static EnemyStatusApplicationPolicy Policy(float cooldown = 0f)
        => new(
            durationSeconds: 4f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Refresh,
            maxStacks: 1,
            magnitude: .2f,
            magnitudeMode: EnemyStatusMagnitudeMode.Max,
            maxMagnitude: .2f,
            internalCooldownSeconds: cooldown,
            respectInternalCooldown: true);

    private static void SeedConductive(VampPon.UnitySpike.Runtime.U2EnemyActor target, float cooldown = 0f)
    {
        var result = target.Statuses.Apply(EnemyStatusRuntimeKind.Conductive, Policy(cooldown));
        Require(result == EnemyStatusApplyResult.Applied, "CONDUCTIVE seed should apply");
    }

    private static int Main()
    {
        var runtime = new CopperTuningForkPrototypeRuntime();
        var telemetry = new CopperTuningForkPrototypeTelemetry();
        var origin = new UnityEngine.Vector3(0f, 0f, 9f);

        // A lower-base-score CONDUCTIVE target must win when caller-supplied bonus is sufficient.
        var markedByConductivity = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var higherBaseUnmarked = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        SeedConductive(markedByConductivity);
        var hitCount = runtime.Pulse(
            new[] { markedByConductivity, higherBaseUnmarked },
            new[] { 1f, 4f },
            origin,
            maxFirstRange: 5f,
            maxHopDistance: 5f,
            maxTargets: 1,
            conductivePriorityBonus: 5f,
            damage: 10f,
            damageFlashSeconds: .05f,
            shockPolicy: Policy(),
            conductivePolicy: Policy(),
            telemetry);
        Require(hitCount == 1, "single-target conductive preference pulse should damage exactly one target");
        Require(Near(markedByConductivity.Hp, 90f) && Near(higherBaseUnmarked.Hp, 100f),
            "caller-supplied CONDUCTIVE bonus should beat higher unmarked base score");
        Require(markedByConductivity.Statuses.Has(EnemyStatusRuntimeKind.Shock),
            "surviving selected target must receive SHOCK after damage");
        Require(markedByConductivity.Statuses.Has(EnemyStatusRuntimeKind.Conductive),
            "surviving selected target must retain/apply CONDUCTIVE after SHOCK");
        Require(telemetry.ConductivePreferredSelectionCount == 1,
            "telemetry should record selection that was CONDUCTIVE before pulse");

        // Bonus insufficient: higher base score remains authoritative.
        var lowBonusConductive = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var dominantBase = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        SeedConductive(lowBonusConductive);
        Require(runtime.Pulse(
                new[] { lowBonusConductive, dominantBase },
                new[] { 1f, 6f },
                origin,
                5f,
                5f,
                1,
                conductivePriorityBonus: 2f,
                damage: 10f,
                damageFlashSeconds: 0f,
                shockPolicy: Policy(),
                conductivePolicy: Policy()) == 1,
            "low-bonus pulse should still select one target");
        Require(Near(lowBonusConductive.Hp, 100f) && Near(dominantBase.Hp, 90f),
            "CONDUCTIVE preference must remain a caller bonus, not an absolute override");

        // Multi-hop chain re-anchors locally through the shared selector.
        var hopA = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var hopB = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 0f);
        var farFromHop = new VampPon.UnitySpike.Runtime.U2EnemyActor(8f, 0f);
        Require(runtime.Pulse(
                new[] { hopA, hopB, farFromHop },
                new[] { 3f, 2f, 100f },
                origin,
                maxFirstRange: 3f,
                maxHopDistance: 2.5f,
                maxTargets: 3,
                conductivePriorityBonus: 0f,
                damage: 5f,
                damageFlashSeconds: 0f,
                shockPolicy: Policy(),
                conductivePolicy: Policy()) == 2,
            "chain should select first target then re-anchor to one local hop");
        Require(Near(hopA.Hp, 95f) && Near(hopB.Hp, 95f) && Near(farFromHop.Hp, 100f),
            "chain must preserve local re-anchor range instead of globally selecting unreachable score");

        // Defeated target receives damage but no post-death Status.
        var fragile = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f, hp: 5f);
        Require(runtime.Pulse(
                new[] { fragile }, new[] { 1f }, origin, 3f, 3f, 1, 0f,
                damage: 10f, damageFlashSeconds: 0f,
                shockPolicy: Policy(), conductivePolicy: Policy(), telemetry) == 1,
            "fragile target should still count as one damage hit");
        Require(!fragile.IsTargetable &&
                !fragile.Statuses.Has(EnemyStatusRuntimeKind.Shock) &&
                !fragile.Statuses.Has(EnemyStatusRuntimeKind.Conductive),
            "defeated target must not receive SHOCK or CONDUCTIVE after damage");

        // Existing SHOCK cooldown may block SHOCK while damage and CONDUCTIVE remain independent.
        var cooldownTarget = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        var shockPolicy = Policy(10f);
        Require(cooldownTarget.Statuses.Apply(EnemyStatusRuntimeKind.Shock, shockPolicy) == EnemyStatusApplyResult.Applied,
            "SHOCK cooldown fixture seed failed");
        var beforeShockBlocked = telemetry.ShockBlockedByInternalCooldownCount;
        var beforeConductiveApplied = telemetry.ConductiveAppliedCount;
        Require(runtime.Pulse(
                new[] { cooldownTarget }, new[] { 1f }, origin, 3f, 3f, 1, 0f,
                damage: 7f, damageFlashSeconds: 0f,
                shockPolicy: shockPolicy, conductivePolicy: Policy(), telemetry) == 1,
            "SHOCK cooldown pulse should still damage target");
        Require(Near(cooldownTarget.Hp, 93f), "SHOCK cooldown must not block pulse damage");
        Require(telemetry.ShockBlockedByInternalCooldownCount == beforeShockBlocked + 1,
            "existing SHOCK cooldown should block only SHOCK application");
        Require(telemetry.ConductiveAppliedCount == beforeConductiveApplied + 1 &&
                cooldownTarget.Statuses.Has(EnemyStatusRuntimeKind.Conductive),
            "SHOCK cooldown must not block later CONDUCTIVE application");

        // Selection snapshot happens before newly applied CONDUCTIVE. The high-score second hop wins this pulse.
        var first = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        var secondHighBase = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var thirdLowBase = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 1f);
        Require(runtime.Pulse(
                new[] { first, secondHighBase, thirdLowBase },
                new[] { 10f, 5f, 1f }, origin, 3f, 2f, 2,
                conductivePriorityBonus: 100f,
                damage: 3f, damageFlashSeconds: 0f,
                shockPolicy: Policy(), conductivePolicy: Policy()) == 2,
            "snapshot chain should select two targets");
        Require(Near(first.Hp, 97f) && Near(secondHighBase.Hp, 97f) && Near(thirdLowBase.Hp, 100f),
            "newly applied CONDUCTIVE must not retroactively change selection within the same pulse");

        // Invalid input fails closed and leaves all targets untouched.
        var invalidTarget = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        Require(runtime.Pulse(
                new[] { invalidTarget }, new[] { 1f }, origin,
                maxFirstRange: 0f, maxHopDistance: 2f, maxTargets: 1,
                conductivePriorityBonus: 0f, damage: 1f, damageFlashSeconds: 0f,
                shockPolicy: Policy(), conductivePolicy: Policy()) == 0,
            "invalid first range must fail closed");
        Require(runtime.Pulse(
                new[] { invalidTarget }, Array.Empty<float>(), origin,
                2f, 2f, 1, 0f, 1f, 0f, Policy(), Policy()) == 0,
            "candidate/score length mismatch must fail closed");
        Require(runtime.Pulse(
                new[] { invalidTarget }, new[] { 1f }, origin,
                2f, 2f, 0, 0f, 1f, 0f, Policy(), Policy()) == 0,
            "non-positive maxTargets must fail closed");
        Require(runtime.Pulse(
                new[] { invalidTarget }, new[] { 1f }, origin,
                2f, 2f, 1, 0f, 0f, 0f, Policy(), Policy()) == 0,
            "non-positive damage must fail closed");
        Require(Near(invalidTarget.Hp, 100f), "invalid pulses must not mutate target HP");

        telemetry.Reset();
        runtime.ResetScratch();
        Require(telemetry.PulseAttemptCount == 0 && telemetry.SelectedTargetCount == 0 &&
                telemetry.ShockApplyAttemptCount == 0 && telemetry.ConductiveApplyAttemptCount == 0,
            "Copper Tuning Fork telemetry reset failed");

        Console.WriteLine("PASS Copper Tuning Fork: CONDUCTIVE-priority snapshot chain + damage/SHOCK/CONDUCTIVE order + fail-closed");
        return 0;
    }
}
