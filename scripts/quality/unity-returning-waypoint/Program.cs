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
        var state = new U2ReturningWaypointMotionState();
        var spawn = new UnityEngine.Vector3(0f, 0f, 9f);
        var outbound = new UnityEngine.Vector3(4f, 0f, -20f);
        var waypoint = new UnityEngine.Vector3(4f, 3f, 40f);
        var finalAnchor = new UnityEngine.Vector3(0f, 0f, 99f);

        Require(state.TryBegin(outbound, true), "valid waypoint return begin should succeed");
        Require(state.UsesReturnWaypoint && state.Phase == U2ReturningWaypointPhase.Outbound,
            "begin should preserve optional waypoint intent");
        Require(state.TryStep(spawn, waypoint, finalAnchor, 10f, 1f, .01f, out var chained),
            "waypoint return step should succeed");
        Require(chained.TurnedAround, "same-frame outbound arrival must report turnaround");
        Require(chained.WaypointReached, "same-frame return leg must report waypoint arrival");
        Require(!chained.Completed && chained.Phase == U2ReturningWaypointPhase.ReturningToAnchor,
            "remaining budget should continue beyond waypoint without completing early");
        Require(Near(chained.Position.x, 1.6f) && Near(chained.Position.y, 1.2f),
            "remaining travel budget should continue from waypoint toward final anchor");
        Require(Near(chained.Position.z, 9f), "waypoint motion must preserve projectile z");
        Require(!state.UsesReturnWaypoint, "waypoint should be consumed exactly once");

        var movedFinalAnchor = new UnityEngine.Vector3(0f, 1f, -500f);
        Require(state.TryStep(chained.Position, waypoint, movedFinalAnchor, 10f, 1f, .01f, out var completed),
            "dynamic final-anchor return step should succeed");
        Require(completed.Completed && completed.Phase == U2ReturningWaypointPhase.Complete && state.IsComplete,
            "final dynamic return anchor should complete only at final leg");
        Require(Near(completed.Position.x, 0f) && Near(completed.Position.y, 1f) && Near(completed.Position.z, 9f),
            "completion should use the latest dynamic final anchor and preserve z");

        state.Reset();
        Require(!state.IsActive && !state.IsComplete && state.Phase == U2ReturningWaypointPhase.Inactive,
            "reset must clear waypoint return state");
        Require(state.TryBegin(new UnityEngine.Vector3(2f, 0f, 0f), false),
            "no-waypoint return begin should succeed");
        Require(state.TryStep(
                new UnityEngine.Vector3(0f, 0f, 3f),
                new UnityEngine.Vector3(100f, 100f, 0f),
                new UnityEngine.Vector3(0f, 0f, 0f),
                10f,
                1f,
                .01f,
                out var direct),
            "direct return step should succeed");
        Require(direct.TurnedAround && !direct.WaypointReached && direct.Completed,
            "no-waypoint path should allow outbound -> final return complete in one frame");
        Require(Near(direct.Position.x, 0f) && Near(direct.Position.y, 0f) && Near(direct.Position.z, 3f),
            "direct return should ignore unused waypoint and preserve z");

        state.Reset();
        Require(state.TryBegin(new UnityEngine.Vector3(4f, 0f, 0f), true), "skip-before-turn begin failed");
        Require(state.SkipReturnWaypoint(), "pending waypoint should be skippable before turnaround");
        Require(!state.UsesReturnWaypoint, "skip-before-turn should clear waypoint intent");
        Require(state.TryStep(spawn, waypoint, finalAnchor, 4f, 1f, .01f, out var turnOnly),
            "turnaround-to-anchor step should succeed after skip");
        Require(turnOnly.TurnedAround && !turnOnly.WaypointReached && turnOnly.Phase == U2ReturningWaypointPhase.ReturningToAnchor,
            "skipped waypoint must not be visited after turnaround");

        state.Reset();
        Require(state.TryBegin(outbound, true), "skip-during-return begin failed");
        Require(state.TryStep(spawn, waypoint, finalAnchor, 4f, 1f, .01f, out var atTurn),
            "turn-only step should succeed");
        Require(atTurn.TurnedAround && atTurn.Phase == U2ReturningWaypointPhase.ReturningViaWaypoint,
            "exact outbound arrival should enter waypoint phase when no budget remains");
        Require(state.SkipReturnWaypoint(), "active return waypoint should be skippable");
        Require(state.Phase == U2ReturningWaypointPhase.ReturningToAnchor && !state.UsesReturnWaypoint,
            "skip during return must redirect to final anchor");

        var stablePhase = state.Phase;
        Require(!state.TryStep(atTurn.Position, waypoint, finalAnchor, 0f, 1f, .01f, out _),
            "zero speed must fail closed");
        Require(state.Phase == stablePhase, "invalid step must not mutate active phase");
        Require(!state.TryStep(atTurn.Position, waypoint, finalAnchor, 1f, 0f, .01f, out _),
            "zero delta must fail closed");
        Require(!state.TryStep(atTurn.Position, waypoint, finalAnchor, 1f, 1f, -1f, out _),
            "negative arrival distance must fail closed");
        Require(!state.TryStep(atTurn.Position, new UnityEngine.Vector3(float.NaN, 0f, 0f), finalAnchor, 1f, 1f, .01f, out _),
            "non-finite waypoint must fail closed");
        Require(!state.TryBegin(new UnityEngine.Vector3(1f, 0f, 0f), false),
            "active motion must reject replacement begin");

        state.Reset();
        Require(!state.TryBegin(new UnityEngine.Vector3(float.NaN, 0f, 0f), true),
            "non-finite outbound target must fail closed");
        Require(!state.SkipReturnWaypoint(), "inactive state must reject waypoint skip");

        Console.WriteLine("PASS returning waypoint motion: outbound/waypoint/final-anchor budget + dynamic anchors + skip + reset/fail-closed");
        return 0;
    }
}
