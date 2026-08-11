using System;
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
        var state = new U2ReturningProjectileMotionState();
        Require(state.Phase == U2ReturningProjectilePhase.Inactive && !state.IsActive, "new state must be inactive");
        Require(!state.TryBegin(new UnityEngine.Vector3(float.NaN, 0f, 0f)), "non-finite outbound target must fail closed");
        Require(state.TryBegin(new UnityEngine.Vector3(10f, 0f, 99f)), "valid outbound target must begin");
        Require(state.Phase == U2ReturningProjectilePhase.Outbound, "begin must enter outbound phase");

        var current = new UnityEngine.Vector3(0f, 0f, 7f);
        Require(state.TryStep(current, new UnityEngine.Vector3(0f, 0f, -100f), 4f, 1f, 0f, out var first), "first outbound step failed");
        Require(first.Phase == U2ReturningProjectilePhase.Outbound && !first.TurnedAround && !first.Completed, "first step phase mismatch");
        Require(Near(first.Position.x, 4f) && Near(first.Position.y, 0f) && Near(first.Position.z, 7f), "outbound step must move 4 units in XY and preserve z");

        // 8 units of travel from x=4 reaches turnaround at x=10 using 6, then consumes the
        // remaining 2 units toward the caller-supplied return anchor at x=2.
        Require(state.TryStep(first.Position, new UnityEngine.Vector3(2f, 0f, -50f), 8f, 1f, 0f, out var crossed), "turnaround crossing step failed");
        Require(crossed.TurnedAround && crossed.Phase == U2ReturningProjectilePhase.Returning, "cross-frame travel must enter returning phase");
        Require(!crossed.Completed && Near(crossed.Position.x, 8f) && Near(crossed.Position.z, 7f), "remaining travel budget must continue on return leg and preserve z");

        // Return anchor moves after turnaround; state must follow the latest caller anchor rather than
        // a frozen origin captured at begin time.
        Require(state.TryStep(crossed.Position, new UnityEngine.Vector3(1f, 3f, 123f), 5f, 1f, 0f, out var dynamicReturn), "dynamic return step failed");
        Require(dynamicReturn.Phase == U2ReturningProjectilePhase.Returning && !dynamicReturn.Completed, "dynamic anchor step should remain returning");
        Require(dynamicReturn.Position.x < 8f && dynamicReturn.Position.y > 0f && Near(dynamicReturn.Position.z, 7f), "return path must chase current XY anchor and preserve projectile z");

        Require(state.TryStep(dynamicReturn.Position, new UnityEngine.Vector3(1f, 3f, -999f), 100f, .1f, .01f, out var completed), "completion step failed");
        Require(completed.Completed && completed.Phase == U2ReturningProjectilePhase.Complete, "return arrival must complete motion");
        Require(Near(completed.Position.x, 1f) && Near(completed.Position.y, 3f) && Near(completed.Position.z, 7f), "completion must snap to return XY and preserve z");
        Require(!state.TryStep(completed.Position, new UnityEngine.Vector3(0f, 0f, 0f), 1f, 1f, 0f, out _), "complete state must reject further steps until reset/begin");

        state.Reset();
        Require(state.Phase == U2ReturningProjectilePhase.Inactive && !state.IsActive && !state.IsComplete, "reset must clear reusable motion state");
        Require(state.TryBegin(new UnityEngine.Vector3(0.05f, 0f, 0f)), "second begin failed");
        Require(state.TryStep(new UnityEngine.Vector3(0f, 0f, 3f), new UnityEngine.Vector3(0f, 0f, 10f), 1f, 0f, .1f, out var epsilon), "epsilon transition failed");
        Require(epsilon.TurnedAround && epsilon.Completed, "arrival epsilon may transition both legs when both anchors are already within tolerance");
        Require(Near(epsilon.Position.z, 3f), "epsilon transition must preserve z");

        state.Reset();
        Require(state.TryBegin(new UnityEngine.Vector3(5f, 0f, 0f)), "third begin failed");
        Require(!state.TryStep(new UnityEngine.Vector3(0f, 0f, 0f), new UnityEngine.Vector3(0f, 0f, 0f), 0f, 1f, 0f, out _), "zero speed must fail closed");
        Require(!state.TryStep(new UnityEngine.Vector3(0f, 0f, 0f), new UnityEngine.Vector3(0f, 0f, 0f), 1f, -1f, 0f, out _), "negative delta must fail closed");
        Require(!state.TryStep(new UnityEngine.Vector3(0f, 0f, 0f), new UnityEngine.Vector3(float.PositiveInfinity, 0f, 0f), 1f, 1f, 0f, out _), "non-finite return anchor must fail closed");
        Require(!state.TryStep(new UnityEngine.Vector3(0f, 0f, 0f), new UnityEngine.Vector3(0f, 0f, 0f), 1f, 1f, -1f, out _), "negative arrival distance must fail closed");

        Console.WriteLine("PASS Unity returning projectile: outbound/turnaround/travel-budget/dynamic-return/z-preserve/complete/reset/fail-closed");
        return 0;
    }
}
