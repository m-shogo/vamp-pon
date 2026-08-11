using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;

namespace UnityEngine
{
    public struct Vector3
    {
        public float x;
        public float y;
        public float z;
        public Vector3(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }
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
            transform.position = new UnityEngine.Vector3(x, y, 7f);
            IsTargetable = targetable;
        }

        public UnityEngine.Transform transform { get; } = new();
        public bool IsTargetable { get; set; }
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
            U2EnemyHomingPrioritySelectionRuntime.TuningAuthority == "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON",
            "priority selector must remain caller-tuned");

        var near = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var middle = new VampPon.UnitySpike.Runtime.U2EnemyActor(3f, 0f);
        var far = new VampPon.UnitySpike.Runtime.U2EnemyActor(5f, 0f);
        var untargetable = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 0f, targetable: false);
        var outside = new VampPon.UnitySpike.Runtime.U2EnemyActor(9f, 0f);
        var invalidScore = new VampPon.UnitySpike.Runtime.U2EnemyActor(4.5f, 0f);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            near,
            far,
            middle,
            untargetable,
            outside,
            invalidScore,
        };
        var scores = new List<float> { 1f, 1f, 2f, 99f, 100f, float.NaN };
        var origin = new UnityEngine.Vector3(0f, 0f, -12f);

        Require(
            U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                scores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out var highest),
            "valid priority selection should succeed");
        Require(highest.Target == middle, "highest finite in-range targetable priority must win before distance");
        Require(highest.CandidateIndex == 2 && Near(highest.PriorityScore, 2f), "highest priority result metadata mismatch");
        Require(Near(highest.DistanceSquared, 9f), "selector must use 2D distance and ignore z");

        var equalScores = new List<float> { 7f, 7f, 7f, 99f, 100f, float.NaN };
        Require(
            U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                equalScores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out var farther),
            "far tie selection should succeed");
        Require(farther.Target == far && Near(farther.DistanceSquared, 25f), "PreferFarther must choose farthest equal-priority target");

        Require(
            U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                equalScores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferNearer,
                out var nearer),
            "near tie selection should succeed");
        Require(nearer.Target == near && Near(nearer.DistanceSquared, 4f), "PreferNearer must choose nearest equal-priority target");

        Require(
            U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                equalScores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.StableInputOrder,
                out var stable),
            "stable tie selection should succeed");
        Require(stable.Target == near && stable.CandidateIndex == 0, "stable tie must preserve first eligible input");

        var boundaryCandidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            new(2f, 0f),
            new(6f, 0f),
            new(1.99f, 0f),
            new(6.01f, 0f),
        };
        var boundaryScores = new List<float> { -2f, -1f, 100f, 100f };
        Require(
            U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                boundaryCandidates,
                boundaryScores,
                origin,
                2f,
                6f,
                U2EnemyPriorityDistanceTieBreak.StableInputOrder,
                out var boundary),
            "inclusive range-boundary selection should succeed");
        Require(boundary.Target == boundaryCandidates[1] && Near(boundary.PriorityScore, -1f),
            "range boundaries must be inclusive and negative finite priority scores must remain valid");

        Require(
            !U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                new List<float> { 1f },
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out _),
            "parallel priority-score length mismatch must fail closed");
        Require(
            !U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                null,
                scores,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out _),
            "null candidates must fail closed");
        Require(
            !U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                null,
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out _),
            "null priority scores must fail closed");
        Require(
            !U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                scores,
                origin,
                -1f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out _),
            "negative min range must fail closed");
        Require(
            !U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                scores,
                origin,
                7f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out _),
            "min range greater than max range must fail closed");
        Require(
            !U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                scores,
                origin,
                0f,
                float.PositiveInfinity,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out _),
            "non-finite range must fail closed");
        Require(
            !U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                new[] { untargetable, outside, invalidScore },
                new[] { 5f, 6f, float.NaN },
                origin,
                0f,
                6f,
                U2EnemyPriorityDistanceTieBreak.PreferFarther,
                out _),
            "no eligible target must return false without fabricating a result");

        Console.WriteLine("PASS Unity homing priority: caller scores/range/targetability/2D distance/tie-break/stable order/fail-closed inputs");
        return 0;
    }
}
