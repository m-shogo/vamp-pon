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
            transform.position = new UnityEngine.Vector3(x, y, 8f);
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

    private static int Main()
    {
        var a = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var b = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 0f);
        var c = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 2f);
        var d = new VampPon.UnitySpike.Runtime.U2EnemyActor(7f, 2f);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { a, b, c, d };
        var priorities = new List<float> { 5f, 4f, 10f, 8f };
        var results = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { d };

        var count = U2EnemyTargetChainSelectionRuntime.SelectChain(
            candidates,
            priorities,
            new UnityEngine.Vector3(0f, 0f, -50f),
            maxFirstRange: 2.5f,
            maxHopDistance: 3f,
            maxTargets: 5,
            results);
        Require(count == 3, "chain should stop when no new target is within hop range");
        Require(results.Count == 3 && results[0] == a && results[1] == c && results[2] == d,
            "chain must re-anchor each hop and choose highest caller priority within local range");
        Require(!results.Contains(b), "lower-priority reachable target may be skipped when a higher-priority hop exists");
        Require(new HashSet<VampPon.UnitySpike.Runtime.U2EnemyActor>(results).Count == results.Count,
            "chain must never select the same target twice");

        var nearTie = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        var farTie = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        count = U2EnemyTargetChainSelectionRuntime.SelectChain(
            new[] { farTie, nearTie },
            new[] { 3f, 3f },
            new UnityEngine.Vector3(0f, 0f, 0f),
            3f,
            3f,
            1,
            results);
        Require(count == 1 && results[0] == nearTie,
            "equal priority must prefer nearer candidate at the current hop");

        var exactFirst = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 1f);
        var exactSecond = new VampPon.UnitySpike.Runtime.U2EnemyActor(-1f, 1f);
        count = U2EnemyTargetChainSelectionRuntime.SelectChain(
            new[] { exactFirst, exactSecond },
            new[] { 2f, 2f },
            new UnityEngine.Vector3(0f, 0f, 0f),
            2f,
            2f,
            1,
            results);
        Require(count == 1 && results[0] == exactFirst,
            "exact score/distance tie must preserve stable input order");

        var negativeNear = new VampPon.UnitySpike.Runtime.U2EnemyActor(1f, 0f);
        var negativeFar = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        count = U2EnemyTargetChainSelectionRuntime.SelectChain(
            new[] { negativeNear, negativeFar },
            new[] { -5f, -1f },
            new UnityEngine.Vector3(0f, 0f, 0f),
            3f,
            3f,
            1,
            results);
        Require(count == 1 && results[0] == negativeFar,
            "finite negative priorities must remain valid and higher numeric score must win");

        var untargetable = new VampPon.UnitySpike.Runtime.U2EnemyActor(.5f, 0f, false);
        count = U2EnemyTargetChainSelectionRuntime.SelectChain(
            new[] { untargetable, nearTie },
            new[] { 100f, 1f },
            new UnityEngine.Vector3(0f, 0f, 99f),
            2f,
            2f,
            2,
            results);
        Require(count == 1 && results[0] == nearTie,
            "untargetable high-priority candidate must be ignored");

        count = U2EnemyTargetChainSelectionRuntime.SelectChain(
            new[] { nearTie, farTie },
            new[] { float.NaN, 1f },
            new UnityEngine.Vector3(0f, 0f, 0f),
            3f,
            3f,
            2,
            results);
        Require(count == 1 && results[0] == farTie,
            "non-finite priority must be skipped without poisoning remaining candidates");

        count = U2EnemyTargetChainSelectionRuntime.SelectChain(
            candidates,
            priorities,
            new UnityEngine.Vector3(0f, 0f, 0f),
            10f,
            10f,
            2,
            results);
        Require(count == 2 && results.Count == 2,
            "maxTargets cap must bound caller result length");

        results.Add(a);
        count = U2EnemyTargetChainSelectionRuntime.SelectChain(
            candidates,
            new[] { 1f },
            new UnityEngine.Vector3(0f, 0f, 0f),
            3f,
            3f,
            2,
            results);
        Require(count == 0 && results.Count == 0,
            "priority length mismatch must fail closed and clear stale results");
        Require(U2EnemyTargetChainSelectionRuntime.SelectChain(candidates, priorities, new UnityEngine.Vector3(0f, 0f, 0f), 0f, 3f, 2, results) == 0,
            "zero first range must fail closed");
        Require(U2EnemyTargetChainSelectionRuntime.SelectChain(candidates, priorities, new UnityEngine.Vector3(0f, 0f, 0f), 3f, 0f, 2, results) == 0,
            "zero hop distance must fail closed");
        Require(U2EnemyTargetChainSelectionRuntime.SelectChain(candidates, priorities, new UnityEngine.Vector3(float.NaN, 0f, 0f), 3f, 3f, 2, results) == 0,
            "non-finite origin must fail closed");
        Require(U2EnemyTargetChainSelectionRuntime.SelectChain(candidates, priorities, new UnityEngine.Vector3(0f, 0f, 0f), 3f, 3f, 0, results) == 0,
            "zero maxTargets must fail closed");

        var sameList = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { a, b };
        Require(U2EnemyTargetChainSelectionRuntime.SelectChain(sameList, new[] { 1f, 2f }, new UnityEngine.Vector3(0f, 0f, 0f), 3f, 3f, 2, sameList) == 0,
            "candidate/result alias must fail closed rather than mutate while scanning");
        Require(sameList.Count == 0, "alias failure should clear caller result collection deterministically");

        Console.WriteLine("PASS target chain selection: local re-anchor + caller priority + no duplicates + deterministic ties + fail-closed");
        return 0;
    }
}
