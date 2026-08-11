using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

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
        public static Vector3 operator +(Vector3 left, Vector3 right) => new(left.x + right.x, left.y + right.y, left.z + right.z);
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
        public EnemyStatusRuntimeState Statuses { get; } = new();
    }
}

internal static class Program
{
    private static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static bool Near(float left, float right) => Math.Abs(left - right) <= 0.0001f;

    private static VampPon.UnitySpike.Runtime.U2EnemyActor Enemy(float x, float y, bool targetable = true)
    {
        var enemy = new VampPon.UnitySpike.Runtime.U2EnemyActor { IsTargetable = targetable };
        enemy.transform.position = new UnityEngine.Vector3(x, y, 7f);
        return enemy;
    }

    private static EnemyStatusApplicationPolicy TestPolicy()
        => new(
            durationSeconds: 2f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Replace,
            maxStacks: 1,
            magnitude: 0.2f,
            magnitudeMode: EnemyStatusMagnitudeMode.Replace,
            maxMagnitude: 1f,
            internalCooldownSeconds: 0f,
            respectInternalCooldown: false);

    private static int Main()
    {
        Require(BellowsFanPrototypeRuntime.WeaponId == "bellows_fan", "prototype must bind exact Selected16 ID");
        Require(BellowsFanPrototypeRuntime.ContentStatusId == "DISORIENTED", "prototype must bind exact Status ID");
        Require(BellowsFanPrototypeRuntime.TuningAuthority == "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON", "prototype tuning boundary drift");
        Require(BellowsFanPrototypeRuntime.RuntimeBoundary == "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE", "prototype live boundary drift");

        var diagonal = Enemy(4f, 3f);
        var outsideAngle = Enemy(1f, 3f);
        var near = Enemy(3f, 0f);
        var behind = Enemy(-2f, 0f);
        var far = Enemy(11f, 0f);
        var untargetable = Enemy(1f, 0f, targetable: false);
        var candidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            diagonal,
            outsideAngle,
            near,
            behind,
            far,
            untargetable,
        };
        var scratch = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>(4);

        var affected = BellowsFanPrototypeRuntime.Fire(
            candidates,
            scratch,
            origin: new UnityEngine.Vector3(0f, 0f, -20f),
            forward: new UnityEngine.Vector2(2f, 0f),
            range: 10f,
            halfAngleDegrees: 45f,
            maxTargets: 2,
            knockbackDistance: 2f,
            disorientedPolicy: TestPolicy());

        Require(affected == 2, "cone push should affect two valid capped targets");
        Require(scratch.Count == 2 && ReferenceEquals(scratch[0], near) && ReferenceEquals(scratch[1], diagonal), "cone query must return nearest-first with deterministic order");
        Require(near.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "near target must receive DISORIENTED");
        Require(diagonal.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "diagonal in-cone target must receive DISORIENTED");
        Require(!outsideAngle.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "out-of-angle target must remain untouched");
        Require(!behind.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "behind target must remain untouched");
        Require(!far.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "out-of-range target must remain untouched");
        Require(!untargetable.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "untargetable target must remain untouched");
        Require(Near(near.transform.position.x, 5f) && Near(near.transform.position.y, 0f), "near target knockback displacement mismatch");
        Require(Near(diagonal.transform.position.x, 5.6f) && Near(diagonal.transform.position.y, 4.2f), "diagonal target knockback must use normalized outward direction");
        Require(Near(near.transform.position.z, 7f) && Near(diagonal.transform.position.z, 7f), "cone push must preserve target z");

        var maxOneNear = Enemy(2f, 0f);
        var maxOneFar = Enemy(5f, 0f);
        var maxOneCandidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { maxOneFar, maxOneNear };
        var maxOneScratch = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>();
        var maxOneAffected = BellowsFanPrototypeRuntime.Fire(
            maxOneCandidates,
            maxOneScratch,
            new UnityEngine.Vector3(0f, 0f, 0f),
            new UnityEngine.Vector2(1f, 0f),
            range: 8f,
            halfAngleDegrees: 30f,
            maxTargets: 1,
            knockbackDistance: 1f,
            disorientedPolicy: TestPolicy());
        Require(maxOneAffected == 1 && ReferenceEquals(maxOneScratch[0], maxOneNear), "caller target cap must keep nearest in-cone target");
        Require(maxOneNear.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "capped selected target must receive Status");
        Require(!maxOneFar.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "capped-out target must not receive Status");

        var invalidTarget = Enemy(2f, 0f);
        var invalidScratch = new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { invalidTarget };
        var invalid = BellowsFanPrototypeRuntime.Fire(
            new List<VampPon.UnitySpike.Runtime.U2EnemyActor> { invalidTarget },
            invalidScratch,
            new UnityEngine.Vector3(0f, 0f, 0f),
            new UnityEngine.Vector2(0f, 0f),
            range: 8f,
            halfAngleDegrees: 30f,
            maxTargets: 1,
            knockbackDistance: 1f,
            disorientedPolicy: TestPolicy());
        Require(invalid == 0 && invalidScratch.Count == 0, "zero forward must fail closed and clear scratch");
        Require(!invalidTarget.Statuses.Has(EnemyStatusRuntimeKind.Disoriented), "failed-closed query must not apply Status");
        Require(Near(invalidTarget.transform.position.x, 2f), "failed-closed query must not move target");

        Console.WriteLine("PASS Bellows Fan prototype: cone filtering/nearest cap/DISORIENTED/knockback/fail-closed");
        return 0;
    }
}
