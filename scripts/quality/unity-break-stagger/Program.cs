using System;
using System.Collections.Generic;
using System.Reflection;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;

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
        public U2EnemyActor()
        {
            gameObject = new UnityEngine.GameObject();
        }

        public bool IsTargetable { get; set; } = true;
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

    private static void InvokeNonPublic(object target, string method)
    {
        var info = target.GetType().GetMethod(method, BindingFlags.Instance | BindingFlags.NonPublic);
        Require(info != null, $"missing method: {method}");
        info.Invoke(target, null);
    }

    private static int Main()
    {
        Require(
            U2EnemyBreakStaggerRuntime.TuningAuthority == "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON",
            "break/stagger primitive must remain caller-tuned");

        var state = new U2EnemyBreakStaggerState();
        Require(!state.IsStaggered && Near(state.AccumulatedBreak, 0f), "new state must be clear");
        Require(
            !state.TryApply(0f, 100f, .5f, out _),
            "zero break amount must fail closed");
        Require(
            !state.TryApply(40f, 0f, .5f, out _),
            "zero threshold must fail closed");
        Require(
            !state.TryApply(40f, 100f, 0f, out _),
            "zero stagger duration must fail closed");

        Require(state.TryApply(40f, 100f, .5f, out var first), "valid break should apply");
        Require(!first.StaggerTriggered && Near(first.AccumulatedBreak, 40f), "sub-threshold break must accumulate");
        Require(state.TryApply(70f, 100f, .5f, out var second), "threshold crossing should apply");
        Require(second.StaggerTriggered, "threshold crossing must trigger stagger");
        Require(Near(second.AccumulatedBreak, 10f), "threshold crossing must preserve residual break");
        Require(Near(second.StaggerSecondsRemaining, .5f), "caller stagger duration must be used exactly");

        Require(state.Tick(.2f), "valid stagger tick should pass");
        Require(Near(state.StaggerSecondsRemaining, .3f), "stagger tick must reduce remaining time");
        Require(!state.Tick(-.1f), "negative delta must fail closed");
        Require(Near(state.StaggerSecondsRemaining, .3f), "invalid tick must not mutate state");

        Require(state.TryApply(20f, 100f, .1f, out var duringStagger), "break can accumulate during stagger");
        Require(!duringStagger.StaggerTriggered, "sub-threshold apply during stagger must not invent a new stagger");
        Require(Near(duringStagger.StaggerSecondsRemaining, .3f), "non-triggering apply must not shorten active stagger");
        Require(state.TryApply(250f, 100f, .8f, out var oversized), "oversized break should apply");
        Require(oversized.StaggerTriggered, "oversized break must trigger one stagger event");
        Require(Near(oversized.AccumulatedBreak, 80f), "oversized break must preserve residual gauge");
        Require(Near(oversized.StaggerSecondsRemaining, .8f), "new trigger may extend stagger to caller duration");
        state.Clear();
        Require(!state.IsStaggered && Near(state.AccumulatedBreak, 0f), "clear must reset pooled-state data");

        var enemy = new VampPon.UnitySpike.Runtime.U2EnemyActor();
        enemy.transform.position = new UnityEngine.Vector3(0f, 0f, 7f);
        Require(
            U2EnemyBreakStaggerRuntime.TryApply(enemy, 100f, 100f, .5f, out var runtimeResult),
            "targetable enemy should accept runtime break/stagger");
        Require(runtimeResult.StaggerTriggered, "runtime application should trigger stagger");
        Require(
            U2EnemyBreakStaggerRuntime.TryGetSnapshot(enemy, out var snapshot) && snapshot.IsStaggered,
            "runtime snapshot should expose active stagger without exposing driver internals");

        Require(
            U2EnemyKnockbackRuntime.TryApply(enemy, new UnityEngine.Vector2(1f, 0f), 5f),
            "knockback should remain valid while staggered");
        Require(Near(enemy.transform.position.x, 5f), "knockback should move staggered enemy");

        // Simulate U2BattleController pursuit moving the enemy during Update. The stagger
        // driver restores the post-knockback anchor in LateUpdate, then ticks duration.
        enemy.transform.position = new UnityEngine.Vector3(6f, 2f, 7f);
        UnityEngine.Time.deltaTime = .1f;
        var driver = enemy.GetComponent<U2EnemyBreakStaggerDriver>();
        Require(driver != null, "runtime application must attach one reusable stagger driver");
        InvokeNonPublic(driver, "LateUpdate");
        Require(Near(enemy.transform.position.x, 5f) && Near(enemy.transform.position.y, 0f),
            "stagger must suppress voluntary pursuit but preserve knockback displacement");
        Require(Near(enemy.transform.position.z, 7f), "stagger must preserve z");

        enemy.IsTargetable = false;
        InvokeNonPublic(driver, "LateUpdate");
        Require(
            U2EnemyBreakStaggerRuntime.TryGetSnapshot(enemy, out var cleared) &&
            !cleared.IsStaggered && Near(cleared.AccumulatedBreak, 0f),
            "dying/untargetable enemy must clear break/stagger state");
        Require(
            !U2EnemyBreakStaggerRuntime.TryApply(enemy, 10f, 100f, .2f, out _),
            "untargetable enemy must reject new break/stagger");
        Require(
            !U2EnemyBreakStaggerRuntime.TryApply(null, 10f, 100f, .2f, out _),
            "null enemy must fail closed");

        Console.WriteLine("PASS Unity break/stagger: accumulation/threshold/residual/duration/movement suppression/knockback preservation/reset");
        return 0;
    }
}
