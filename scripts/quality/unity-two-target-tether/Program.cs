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
            transform.position = new UnityEngine.Vector3(x, y, 42f);
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
        => Math.Abs(left - right) <= .0001f;

    private static int Main()
    {
        var a = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var b = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 0f);
        var c = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 3f);
        var d = new VampPon.UnitySpike.Runtime.U2EnemyActor(8f, 0f);
        var blocked = new VampPon.UnitySpike.Runtime.U2EnemyActor(3f, 0f, false);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { a, b, c, d, blocked };
        var scores = new List<float> { 2f, 4f, 3f, 100f, 100f };
        var origin = new UnityEngine.Vector3(0f, 0f, -99f);

        Require(
            U2EnemyTetherPairSelectionRuntime.TrySelectPair(
                candidates,
                scores,
                origin,
                0f,
                6f,
                0f,
                5f,
                out var best),
            "valid tether pair selection should succeed");
        Require(best.First == b && best.Second == c, "highest eligible combined-priority pair should win");
        Require(best.FirstCandidateIndex == 1 && best.SecondCandidateIndex == 2, "selected input indices mismatch");
        Require(Near(best.CombinedPriorityScore, 7f), "combined priority score mismatch");
        Require(Near(best.PairDistanceSquared, 9f), "pair distance must use XY only");

        // Equal combined score: shorter pair wins.
        var tieScores = new List<float> { 3f, 3f, 3f, -100f, -100f };
        Require(
            U2EnemyTetherPairSelectionRuntime.TrySelectPair(
                candidates,
                tieScores,
                origin,
                0f,
                6f,
                0f,
                5f,
                out var shorter),
            "equal-score tether selection should succeed");
        Require(shorter.First == a && shorter.Second == b, "equal combined priority must prefer shorter pair");
        Require(Near(shorter.PairDistanceSquared, 4f), "shorter-pair distance mismatch");

        // Exact score + exact pair-distance tie: nested input iteration must stay stable.
        var squareA = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        var squareB = new VampPon.UnitySpike.Runtime.U2EnemyActor(0f, 1f);
        var squareC = new VampPon.UnitySpike.Runtime.U2EnemyActor(-1f, 0f);
        var squareCandidates = new[] { squareA, squareB, squareC };
        var squareScores = new[] { 5f, 5f, 5f };
        Require(
            U2EnemyTetherPairSelectionRuntime.TrySelectPair(
                squareCandidates,
                squareScores,
                origin,
                0f,
                2f,
                0f,
                2f,
                out var stable),
            "stable exact tie selection should succeed");
        Require(stable.FirstCandidateIndex == 0 && stable.SecondCandidateIndex == 1,
            "exact pair tie must preserve first eligible input pair");

        // Pair-distance band excludes a-b (2 units) but accepts b-c (3 units).
        Require(
            U2EnemyTetherPairSelectionRuntime.TrySelectPair(
                candidates,
                tieScores,
                origin,
                0f,
                6f,
                2.5f,
                3.5f,
                out var pairBand),
            "pair-distance band selection should succeed");
        Require(pairBand.First == b && pairBand.Second == c, "pair-distance band must be inclusive and caller-controlled");

        // Negative finite priorities are valid and do not imply zero-based semantics.
        Require(
            U2EnemyTetherPairSelectionRuntime.TrySelectPair(
                new[] { a, b, c },
                new[] { -5f, -2f, -1f },
                origin,
                0f,
                6f,
                0f,
                5f,
                out var negative),
            "negative finite priority selection should succeed");
        Require(negative.First == b && negative.Second == c && Near(negative.CombinedPriorityScore, -3f),
            "highest combined negative priority pair mismatch");

        Require(!U2EnemyTetherPairSelectionRuntime.TrySelectPair(null, scores, origin, 0f, 6f, 0f, 5f, out _),
            "null candidates must fail closed");
        Require(!U2EnemyTetherPairSelectionRuntime.TrySelectPair(candidates, new[] { 1f }, origin, 0f, 6f, 0f, 5f, out _),
            "score length mismatch must fail closed");
        Require(!U2EnemyTetherPairSelectionRuntime.TrySelectPair(candidates, scores, origin, -1f, 6f, 0f, 5f, out _),
            "negative origin range must fail closed");
        Require(!U2EnemyTetherPairSelectionRuntime.TrySelectPair(candidates, scores, origin, 0f, 6f, 6f, 5f, out _),
            "invalid pair-distance band must fail closed");
        Require(!U2EnemyTetherPairSelectionRuntime.TrySelectPair(new[] { a }, new[] { 1f }, origin, 0f, 6f, 0f, 5f, out _),
            "fewer than two candidates must fail closed");
        Require(!U2EnemyTetherPairSelectionRuntime.TrySelectPair(
                new[] { blocked, d }, new[] { 99f, 99f }, origin, 0f, 6f, 0f, 5f, out _),
            "no eligible pair must return false without fabricating a result");

        Console.WriteLine("PASS Unity two-target tether: combined-priority/pair-distance/stable-tie/range/targetability/fail-closed");
        return 0;
    }
}
