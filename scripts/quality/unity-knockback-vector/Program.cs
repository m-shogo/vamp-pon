using System;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;

namespace UnityEngine
{
    public struct Vector2
    {
        public float x;
        public float y;

        public Vector2(float x, float y)
        {
            this.x = x;
            this.y = y;
        }
    }

    public struct Vector3
    {
        public float x;
        public float y;
        public float z;

        public Vector3(float x, float y, float z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }

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
        public bool IsTargetable { get; set; } = true;
        public UnityEngine.Transform transform { get; } = new();
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

    private static int Main()
    {
        Require(
            U2EnemyKnockbackRuntime.TuningAuthority == "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON",
            "knockback primitive must not own canonical tuning");

        var enemy = new VampPon.UnitySpike.Runtime.U2EnemyActor();
        enemy.transform.position = new UnityEngine.Vector3(10f, 20f, 7f);

        var applied = U2EnemyKnockbackRuntime.TryApply(
            enemy,
            new UnityEngine.Vector2(3f, 4f),
            distance: 10f);
        Require(applied, "valid knockback vector should apply");
        Require(Near(enemy.transform.position.x, 16f), "direction must be normalized before distance is applied (x)");
        Require(Near(enemy.transform.position.y, 28f), "direction must be normalized before distance is applied (y)");
        Require(Near(enemy.transform.position.z, 7f), "2D knockback must preserve enemy z");

        var beforeZero = enemy.transform.position;
        Require(
            !U2EnemyKnockbackRuntime.TryApply(enemy, new UnityEngine.Vector2(0f, 0f), 5f),
            "zero direction must fail closed");
        Require(Near(enemy.transform.position.x, beforeZero.x) && Near(enemy.transform.position.y, beforeZero.y), "zero direction must not move enemy");

        var beforeDistance = enemy.transform.position;
        Require(
            !U2EnemyKnockbackRuntime.TryApply(enemy, new UnityEngine.Vector2(1f, 0f), 0f),
            "non-positive distance must fail closed");
        Require(Near(enemy.transform.position.x, beforeDistance.x), "non-positive distance must not move enemy");

        enemy.IsTargetable = false;
        var beforeUntargetable = enemy.transform.position;
        Require(
            !U2EnemyKnockbackRuntime.TryApply(enemy, new UnityEngine.Vector2(1f, 0f), 4f),
            "untargetable/dying enemy must reject knockback");
        Require(Near(enemy.transform.position.x, beforeUntargetable.x), "untargetable enemy must not move");

        Require(
            !U2EnemyKnockbackRuntime.TryApply(null, new UnityEngine.Vector2(1f, 0f), 4f),
            "null enemy must fail closed");

        enemy.IsTargetable = true;
        enemy.transform.position = new UnityEngine.Vector3(2f, 0f, -3f);
        Require(
            U2EnemyKnockbackRuntime.TryApplyFromPoint(
                enemy,
                new UnityEngine.Vector3(0f, 0f, 99f),
                distance: 3f),
            "source-point helper should derive an outward 2D vector");
        Require(Near(enemy.transform.position.x, 5f), "source-point helper should push away from source");
        Require(Near(enemy.transform.position.y, 0f), "source-point helper should preserve perpendicular axis");
        Require(Near(enemy.transform.position.z, -3f), "source-point helper must ignore source z and preserve enemy z");

        var coincident = new VampPon.UnitySpike.Runtime.U2EnemyActor();
        coincident.transform.position = new UnityEngine.Vector3(4f, 4f, 0f);
        Require(
            !U2EnemyKnockbackRuntime.TryApplyFromPoint(
                coincident,
                new UnityEngine.Vector3(4f, 4f, 100f),
                distance: 2f),
            "coincident 2D source must fail closed instead of inventing a direction");

        Console.WriteLine("PASS Unity knockback vector: normalized displacement/fail-closed/targetability/z preservation");
        return 0;
    }
}
