using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;

namespace UnityEngine
{
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
        public static Vector3 operator -(Vector3 left, Vector3 right) => new(left.x - right.x, left.y - right.y, left.z - right.z);
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

    private static VampPon.UnitySpike.Runtime.U2EnemyActor Enemy(float x, float y, bool targetable = true)
    {
        var enemy = new VampPon.UnitySpike.Runtime.U2EnemyActor { IsTargetable = targetable };
        enemy.transform.position = new UnityEngine.Vector3(x, y, 8f);
        return enemy;
    }

    private static int Main()
    {
        Require(U2EnemySlamWaveQueryRuntime.TuningAuthority == "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON", "slam-wave primitive tuning boundary drift");

        var insideFar = Enemy(5f, 1f);
        var boundaryOuter = Enemy(6f, 0f);
        var insideNear = Enemy(3f, 0f);
        var boundaryInner = Enemy(2f, 0f);
        var tooNear = Enemy(1f, 0f);
        var tooFar = Enemy(7f, 0f);
        var outsideAngle = Enemy(3f, 3f);
        var behind = Enemy(-3f, 0f);
        var untargetable = Enemy(4f, 0f, targetable: false);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            insideFar,
            boundaryOuter,
            tooNear,
            outsideAngle,
            insideNear,
            behind,
            untargetable,
            tooFar,
            boundaryInner,
        };
        var results = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>(4);

        var selected = U2EnemySlamWaveQueryRuntime.SelectTargets(
            candidates,
            results,
            origin: new UnityEngine.Vector3(0f, 0f, -100f),
            forward: new UnityEngine.Vector2(2f, 0f),
            innerRadius: 2f,
            outerRadius: 6f,
            halfAngleDegrees: 30f,
            maxTargets: 3);

        Require(selected == 3, "sector band should return capped three targets");
        Require(results.Count == 3, "result scratch count mismatch");
        Require(ReferenceEquals(results[0], boundaryInner), "inner boundary target should be included and sort nearest-first");
        Require(ReferenceEquals(results[1], insideNear), "inside near target should sort second");
        Require(ReferenceEquals(results[2], insideFar), "farther eligible target should fill final capped slot");
        Require(!results.Contains(boundaryOuter), "outer boundary may be eligible but must be capped out by nearer targets");
        Require(!results.Contains(tooNear), "target inside inner radius must be excluded");
        Require(!results.Contains(tooFar), "target outside outer radius must be excluded");
        Require(!results.Contains(outsideAngle), "target outside half-angle must be excluded");
        Require(!results.Contains(behind), "behind target must be excluded");
        Require(!results.Contains(untargetable), "untargetable target must be excluded");

        var tieB = Enemy(4f, -1f);
        var tieA = Enemy(4f, 1f);
        var tieCandidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { tieB, tieA };
        var tieResults = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>();
        var tieCount = U2EnemySlamWaveQueryRuntime.SelectTargets(
            tieCandidates,
            tieResults,
            new UnityEngine.Vector3(0f, 0f, 0f),
            new UnityEngine.Vector2(1f, 0f),
            innerRadius: 0f,
            outerRadius: 6f,
            halfAngleDegrees: 30f,
            maxTargets: 2);
        Require(tieCount == 2, "equal-distance tie scenario should select both targets");
        Require(ReferenceEquals(tieResults[0], tieB) && ReferenceEquals(tieResults[1], tieA), "equal-distance tie must preserve candidate input order");

        var coincident = Enemy(0f, 0f);
        var coincidentResults = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>();
        Require(
            U2EnemySlamWaveQueryRuntime.SelectTargets(
                new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { coincident },
                coincidentResults,
                new UnityEngine.Vector3(0f, 0f, 999f),
                new UnityEngine.Vector2(1f, 0f),
                innerRadius: 0f,
                outerRadius: 1f,
                halfAngleDegrees: 0f,
                maxTargets: 1) == 1,
            "inner=0 one-shot slam should include a coincident 2D target without inventing an angle");

        results.Add(insideNear);
        Require(
            U2EnemySlamWaveQueryRuntime.SelectTargets(
                candidates,
                results,
                new UnityEngine.Vector3(0f, 0f, 0f),
                new UnityEngine.Vector2(0f, 0f),
                innerRadius: 0f,
                outerRadius: 6f,
                halfAngleDegrees: 30f,
                maxTargets: 3) == 0 && results.Count == 0,
            "zero forward must fail closed and clear result scratch");

        results.Add(insideNear);
        Require(
            U2EnemySlamWaveQueryRuntime.SelectTargets(
                candidates,
                results,
                new UnityEngine.Vector3(0f, 0f, 0f),
                new UnityEngine.Vector2(1f, 0f),
                innerRadius: 5f,
                outerRadius: 4f,
                halfAngleDegrees: 30f,
                maxTargets: 3) == 0 && results.Count == 0,
            "innerRadius > outerRadius must fail closed and clear result scratch");

        var alias = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { insideNear };
        var aliasThrew = false;
        try
        {
            U2EnemySlamWaveQueryRuntime.SelectTargets(
                alias,
                alias,
                new UnityEngine.Vector3(0f, 0f, 0f),
                new UnityEngine.Vector2(1f, 0f),
                0f,
                6f,
                30f,
                1);
        }
        catch (ArgumentException)
        {
            aliasThrew = true;
        }
        Require(aliasThrew, "candidate source and result scratch alias must be rejected explicitly");

        Console.WriteLine("PASS Unity slam-wave query: sector band/radius boundaries/angle/cap/stable tie/fail-closed");
        return 0;
    }
}
