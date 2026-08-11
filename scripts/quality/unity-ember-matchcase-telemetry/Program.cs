using System;
using VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U2BattleController
    {
        public EnemyStatusRuntimeState TargetStatuses { get; } = new EnemyStatusRuntimeState();
        public int CallCount { get; private set; }
        public int LastMaxTargets { get; private set; }
        public float LastDamage { get; private set; }
        public int LastPierce { get; private set; }

        public int FireGameplayProjectilesAtNearestTargets(
            float damage,
            int pierce,
            int maxTargets,
            EnemyStatusApplicationRequest? statusApplicationRequest = null)
        {
            CallCount++;
            LastDamage = damage;
            LastPierce = pierce;
            LastMaxTargets = maxTargets;
            if (maxTargets <= 0) return 0;
            if (statusApplicationRequest.HasValue)
            {
                statusApplicationRequest.Value.ApplyTo(TargetStatuses);
            }
            return 1;
        }
    }
}

internal static class Program
{
    private static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static int Main()
    {
        var battle = new VampPon.UnitySpike.Runtime.U2BattleController();
        var telemetry = new EmberMatchcasePrototypeTelemetry();

        // TEST_ONLY numbers: production prototype source owns no BURN or damage defaults.
        var policy = new EnemyStatusApplicationPolicy(
            durationSeconds: 2f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Replace,
            maxStacks: 1,
            magnitude: 0.25f,
            magnitudeMode: EnemyStatusMagnitudeMode.Replace,
            maxMagnitude: 1f,
            internalCooldownSeconds: 3f,
            respectInternalCooldown: true);

        var compatibilityRequest = EmberMatchcasePrototypeRuntime.CreateBurnRequest(policy);
        Require(!compatibilityRequest.HasResultObserver, "legacy prototype overload must remain observer-free");

        var first = EmberMatchcasePrototypeRuntime.Fire(
            battle,
            damage: 11f,
            pierce: 0,
            maxTargets: 3,
            burnPolicy: policy,
            telemetry: telemetry);

        Require(first == 1, "first prototype invocation should fire one stub projectile");
        Require(battle.CallCount == 1, "battle multi-target primitive should be invoked once");
        Require(battle.LastMaxTargets == 3, "prototype must pass caller target capacity unchanged");
        Require(Math.Abs(battle.LastDamage - 11f) < 0.0001f, "prototype must pass caller damage unchanged");
        Require(battle.LastPierce == 0, "prototype must pass caller pierce unchanged");
        Require(battle.TargetStatuses.Has(EnemyStatusRuntimeKind.Burn), "first hit must apply BURN to target Status state");
        Require(telemetry.InvocationCount == 1, "first invocation count mismatch");
        Require(telemetry.RequestedTargetCapacityTotal == 3, "first requested-target telemetry mismatch");
        Require(telemetry.FiredProjectileCount == 1, "first fired-projectile telemetry mismatch");
        Require(telemetry.StatusApplyAttemptCount == 1, "first Status apply attempt mismatch");
        Require(telemetry.StatusAppliedCount == 1, "first Status Applied count mismatch");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 0, "first Status call must not be blocked");

        var second = EmberMatchcasePrototypeRuntime.Fire(
            battle,
            damage: 7f,
            pierce: 1,
            maxTargets: 2,
            burnPolicy: policy,
            telemetry: telemetry);

        Require(second == 1, "second prototype invocation should still fire a projectile");
        Require(telemetry.InvocationCount == 2, "second invocation count mismatch");
        Require(telemetry.RequestedTargetCapacityTotal == 5, "requested-target telemetry must accumulate caller capacity");
        Require(telemetry.FiredProjectileCount == 2, "fired-projectile telemetry must accumulate actual fires");
        Require(telemetry.StatusApplyAttemptCount == 2, "second Status attempt must be observed");
        Require(telemetry.StatusAppliedCount == 1, "internal cooldown must prevent second Applied count");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 1, "second BURN must report internal-cooldown block");

        var beforeInvalid = telemetry.InvocationCount;
        var invalid = EmberMatchcasePrototypeRuntime.Fire(
            battle,
            damage: 99f,
            pierce: 9,
            maxTargets: 0,
            burnPolicy: policy,
            telemetry: telemetry);
        Require(invalid == 0, "non-positive target capacity must fail closed");
        Require(telemetry.InvocationCount == beforeInvalid, "failed-closed invocation must not pollute telemetry");

        telemetry.Reset();
        Require(telemetry.InvocationCount == 0, "telemetry Reset must clear invocation count");
        Require(telemetry.RequestedTargetCapacityTotal == 0, "telemetry Reset must clear requested targets");
        Require(telemetry.FiredProjectileCount == 0, "telemetry Reset must clear fired projectiles");
        Require(telemetry.StatusApplyAttemptCount == 0, "telemetry Reset must clear Status attempts");
        Require(telemetry.StatusAppliedCount == 0, "telemetry Reset must clear Applied count");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 0, "telemetry Reset must clear blocked count");

        Console.WriteLine("PASS Ember Matchcase telemetry: invocation/fired/applied/internal-CD blocked/reset");
        return 0;
    }
}
