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
        var state = new U2PersistentTrapState();
        var position = new UnityEngine.Vector3(3f, -2f, 7f);

        Require(state.TryBegin(position, .5f, 1f, 2), "valid delayed trap begin should succeed");
        Require(state.Phase == U2PersistentTrapPhase.Arming && state.IsActive && !state.IsArmed,
            "positive arming delay must enter Arming phase");
        Require(Near(state.Position.x, 3f) && Near(state.Position.y, -2f) && Near(state.Position.z, 7f),
            "trap state must preserve caller placement including z");
        Require(!state.TryConsumeTrigger(out _), "unarmed trap must reject trigger consumption");

        Require(state.TryTick(.2f, out var arming), "arming tick should succeed");
        Require(arming.Phase == U2PersistentTrapPhase.Arming && Near(arming.RemainingArmingSeconds, .3f),
            "arming tick must consume only arming countdown");
        Require(Near(arming.RemainingActiveSeconds, 1f), "active lifetime must not decay before arming completes");

        Require(state.TryTick(.4f, out var crossed), "arming-crossing tick should succeed");
        Require(crossed.ArmedThisTick && crossed.Phase == U2PersistentTrapPhase.Armed,
            "crossing arming boundary must report ArmedThisTick");
        Require(Near(crossed.RemainingArmingSeconds, 0f), "arming countdown must reach zero");
        Require(Near(crossed.RemainingActiveSeconds, .9f),
            "remaining frame time after arming must reduce active lifetime");

        Require(state.TryConsumeTrigger(out var oneLeft) && oneLeft == 1,
            "first trigger should consume one budget and keep trap armed");
        Require(state.IsArmed, "trap with remaining trigger budget should stay armed");
        Require(state.TryConsumeTrigger(out var noneLeft) && noneLeft == 0,
            "second trigger should consume final budget");
        Require(state.Phase == U2PersistentTrapPhase.Exhausted && !state.IsActive,
            "zero trigger budget must end trap as Exhausted");
        Require(!state.TryTick(.1f, out _), "exhausted trap must reject further ticking until reset/reuse");
        Require(!state.TryConsumeTrigger(out _), "exhausted trap must reject extra trigger consumption");

        state.Reset();
        Require(state.Phase == U2PersistentTrapPhase.Inactive && !state.IsActive && state.RemainingTriggerBudget == 0,
            "reset must clear trap state");
        Require(state.TryBegin(new UnityEngine.Vector3(0f, 0f, 2f), 0f, .5f, 1),
            "zero arming delay should create immediately armed trap");
        Require(state.IsArmed, "zero-delay trap must begin Armed");
        Require(state.TryTick(.5f, out var exactExpiry), "exact active-duration tick should succeed");
        Require(exactExpiry.ExpiredThisTick && exactExpiry.Phase == U2PersistentTrapPhase.Expired,
            "exact active-duration budget must expire trap");
        Require(!state.IsActive, "expired trap must not remain active");

        state.Reset();
        Require(state.TryBegin(new UnityEngine.Vector3(0f, 0f, 4f), .2f, .3f, 3),
            "overshoot fixture begin failed");
        Require(state.TryTick(1f, out var overshoot), "overshoot tick should succeed");
        Require(overshoot.ArmedThisTick && overshoot.ExpiredThisTick && overshoot.Phase == U2PersistentTrapPhase.Expired,
            "one large tick must be able to arm and expire without extending lifetime");
        Require(Near(overshoot.RemainingActiveSeconds, 0f), "overshoot expiry must consume active lifetime fully");
        Require(overshoot.RemainingTriggerBudget == 3, "time expiry must not fabricate trigger consumption");

        state.Reset();
        Require(!state.TryBegin(new UnityEngine.Vector3(float.NaN, 0f, 0f), 0f, 1f, 1),
            "non-finite placement must fail closed");
        Require(!state.TryBegin(position, -1f, 1f, 1), "negative arming delay must fail closed");
        Require(!state.TryBegin(position, 0f, 0f, 1), "zero active duration must fail closed");
        Require(!state.TryBegin(position, 0f, 1f, 0), "zero trigger budget must fail closed");
        Require(state.TryBegin(position, .2f, 1f, 1), "valid begin after failures should succeed");
        var stablePhase = state.Phase;
        var stableArming = state.RemainingArmingSeconds;
        Require(!state.TryBegin(position, 0f, 1f, 1), "active trap must reject replacement begin");
        Require(!state.TryTick(0f, out _), "zero delta must fail closed");
        Require(!state.TryTick(float.NaN, out _), "non-finite delta must fail closed");
        Require(state.Phase == stablePhase && Near(state.RemainingArmingSeconds, stableArming),
            "invalid active operations must not mutate valid trap state");

        Console.WriteLine("PASS trap persistence: arming carryover + armed lifetime + trigger budget + exhaustion/expiry + reset/fail-closed");
        return 0;
    }
}
