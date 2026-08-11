using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace UnityEngine
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class DefaultExecutionOrder : Attribute
    {
        public DefaultExecutionOrder(int order) { }
    }

    public static class Time
    {
        public static float deltaTime;
    }

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

    public class Component
    {
        public GameObject gameObject { get; internal set; }
        public Transform transform => gameObject.transform;
        public T GetComponent<T>() where T : Component => gameObject.GetComponent<T>();
    }

    public class MonoBehaviour : Component { }

    public sealed class GameObject
    {
        private readonly Dictionary<Type, Component> components = new();
        public Transform transform { get; } = new();

        public T AddComponent<T>() where T : Component
        {
            var component = (T)Activator.CreateInstance(typeof(T), nonPublic: true);
            component.gameObject = this;
            components[typeof(T)] = component;
            return component;
        }

        public T GetComponent<T>() where T : Component
            => components.TryGetValue(typeof(T), out var component) ? (T)component : null;
    }
}

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U2EnemyActor : UnityEngine.MonoBehaviour
    {
        private float hp;

        public U2EnemyActor(float hp = 100f)
        {
            this.hp = hp;
            gameObject = new UnityEngine.GameObject();
        }

        public bool IsTargetable { get; private set; } = true;
        public EnemyStatusRuntimeState Statuses { get; } = new();
        public float CurrentHp => hp;

        public bool TakeDamage(float damage, float damageFlashSeconds)
        {
            if (!IsTargetable) return false;
            hp -= damage;
            if (hp <= 0f)
            {
                IsTargetable = false;
                return true;
            }
            return false;
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
        => Math.Abs(left - right) <= 0.0001f;

    private static EnemyStatusApplicationPolicy ExposedPolicy()
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

    private static int Main()
    {
        Require(PavementHammerPrototypeRuntime.WeaponId == "pavement_hammer", "weapon identity drift");
        Require(PavementHammerPrototypeRuntime.ContentStatusId == "EXPOSED", "status identity drift");
        Require(
            PavementHammerPrototypeRuntime.TuningAuthority == "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON",
            "prototype caller must not own Canon tuning");
        Require(
            PavementHammerPrototypeRuntime.RuntimeBoundary == "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE",
            "prototype caller must remain outside live runtime");
        Require(
            PavementHammerPrototypeRuntime.ApplicationOrder == "QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER",
            "application order drift");

        var defeated = new VampPon.UnitySpike.Runtime.U2EnemyActor(5f);
        defeated.transform.position = new UnityEngine.Vector3(2f, 0f, 0f);
        var first = new VampPon.UnitySpike.Runtime.U2EnemyActor(100f);
        first.transform.position = new UnityEngine.Vector3(3f, 0f, 0f);
        var second = new VampPon.UnitySpike.Runtime.U2EnemyActor(100f);
        second.transform.position = new UnityEngine.Vector3(4f, 1f, 0f);
        var outside = new VampPon.UnitySpike.Runtime.U2EnemyActor(100f);
        outside.transform.position = new UnityEngine.Vector3(-3f, 0f, 0f);

        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            second,
            outside,
            defeated,
            first,
        };
        var scratch = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>();
        var telemetry = new PavementHammerPrototypeTelemetry();
        var origin = new UnityEngine.Vector3(0f, 0f, 0f);
        var forward = new UnityEngine.Vector2(1f, 0f);

        var selected = PavementHammerPrototypeRuntime.Fire(
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
            exposedPolicy: ExposedPolicy(),
            telemetry: telemetry);

        Require(selected == 3, $"expected three first-wave targets, got {selected}");
        Require(scratch[0] == defeated && scratch[1] == first && scratch[2] == second, "slam query ordering must remain nearest-first");
        Require(!defeated.IsTargetable, "low-HP target should be defeated by damage phase");
        Require(!defeated.Statuses.Has(EnemyStatusRuntimeKind.Exposed), "defeated target must not receive EXPOSED after damage");
        Require(!U2EnemyBreakStaggerRuntime.TryGetSnapshot(defeated, out _), "defeated target must not receive break/stagger driver");
        Require(Near(defeated.transform.position.x, 2f), "defeated target must not be knocked back after damage");

        for (var index = 0; index < 2; index++)
        {
            var target = index == 0 ? first : second;
            Require(target.Statuses.Has(EnemyStatusRuntimeKind.Exposed), "surviving target must receive EXPOSED");
            Require(U2EnemyBreakStaggerRuntime.TryGetSnapshot(target, out var breakState), "surviving target must receive break state");
            Require(Near(breakState.AccumulatedBreak, 60f) && !breakState.IsStaggered, "first slam should accumulate sub-threshold break");
        }
        Require(Near(first.transform.position.x, 4f), "first survivor should receive outward knockback before break anchor is captured");

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
            exposedPolicy: ExposedPolicy(),
            telemetry: telemetry);

        Require(secondSelected == 2, $"defeated enemy must be excluded from second query, got {secondSelected}");
        Require(Near(first.CurrentHp, 80f) && Near(second.CurrentHp, 80f), "survivors must take damage on both slams");
        for (var index = 0; index < 2; index++)
        {
            var target = index == 0 ? first : second;
            Require(U2EnemyBreakStaggerRuntime.TryGetSnapshot(target, out var breakState), "break snapshot missing after second slam");
            Require(breakState.IsStaggered, "second 60-point slam should cross 100-point TEST_ONLY threshold");
            Require(Near(breakState.AccumulatedBreak, 20f), "threshold crossing should preserve 20 residual break");
            Require(Near(breakState.StaggerSecondsRemaining, .6f), "caller stagger duration must remain exact");
        }
        Require(Near(first.transform.position.x, 5f), "second knockback must apply before stagger anchor");

        Require(telemetry.InvocationCount == 2, "telemetry invocation count mismatch");
        Require(telemetry.SelectedTargetCount == 5, "telemetry selected count mismatch");
        Require(telemetry.DamageAttemptCount == 5 && telemetry.DefeatedTargetCount == 1, "damage telemetry mismatch");
        Require(telemetry.StatusApplyAttemptCount == 4, "only surviving hits should attempt Status");
        Require(telemetry.StatusAppliedCount == 2, "first surviving hits should apply EXPOSED");
        Require(telemetry.StatusBlockedByInternalCooldownCount == 2, "second EXPOSED attempts should hit independent cooldown");
        Require(telemetry.KnockbackAttemptCount == 4 && telemetry.KnockbackAppliedCount == 4, "knockback telemetry mismatch");
        Require(telemetry.BreakStaggerAttemptCount == 4 && telemetry.BreakStaggerAppliedCount == 4, "break telemetry mismatch");
        Require(telemetry.StaggerTriggeredCount == 2, "second surviving hits should trigger two staggers");

        var invalidScratch = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { first };
        var invalid = PavementHammerPrototypeRuntime.Fire(
            candidates,
            invalidScratch,
            origin,
            forward,
            0f,
            6f,
            30f,
            8,
            damage: 0f,
            damageFlashSeconds: .1f,
            knockbackDistance: 1f,
            breakAmount: 60f,
            breakThreshold: 100f,
            staggerDurationSeconds: .6f,
            exposedPolicy: ExposedPolicy(),
            telemetry: telemetry);
        Require(invalid == 0 && invalidScratch.Count == 0, "invalid caller tuning must fail closed and clear scratch");
        Require(telemetry.InvocationCount == 2, "rejected caller tuning must not fabricate an invocation");

        telemetry.Reset();
        Require(telemetry.InvocationCount == 0 && telemetry.StaggerTriggeredCount == 0, "telemetry reset failed");

        Console.WriteLine("PASS Pavement Hammer prototype: query/damage/survivor Status/knockback/break-stagger order + telemetry + fail-closed tuning");
        return 0;
    }
}
