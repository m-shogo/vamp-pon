using System;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;

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
        var state = new U2DelayedTriggerState();

        Require(state.TryBegin(.5f), "positive delay begin should succeed");
        Require(state.Phase == U2DelayedTriggerPhase.Waiting && state.IsActive && !state.IsReady,
            "positive delay must enter Waiting");
        Require(!state.TryConsume(), "waiting trigger must reject early consume");
        Require(state.TryTick(.2f, out var partial), "partial waiting tick should succeed");
        Require(partial.Phase == U2DelayedTriggerPhase.Waiting && !partial.BecameReadyThisTick && Near(partial.RemainingDelaySeconds, .3f),
            "partial tick must decrement delay without becoming ready");
        Require(state.TryTick(.4f, out var crossed), "overshoot waiting tick should succeed");
        Require(crossed.BecameReadyThisTick && crossed.Phase == U2DelayedTriggerPhase.Ready && Near(crossed.RemainingDelaySeconds, 0f),
            "overshoot tick must become ready exactly once and clamp remaining delay to zero");
        Require(state.IsReady, "ready state flag mismatch");
        Require(state.TryTick(.1f, out var readyTick) && !readyTick.BecameReadyThisTick && readyTick.Phase == U2DelayedTriggerPhase.Ready,
            "ready trigger may wait without re-emitting BecameReadyThisTick");
        Require(state.TryConsume(), "ready trigger must consume exactly once");
        Require(state.Phase == U2DelayedTriggerPhase.Fired && !state.IsActive,
            "consumed trigger must become terminal Fired");
        Require(!state.TryConsume(), "fired trigger must reject duplicate consume");
        Require(!state.TryTick(.1f, out _), "fired trigger must reject ticking until reset");
        Require(!state.TryCancel(), "fired trigger must reject cancellation");

        state.Reset();
        Require(state.Phase == U2DelayedTriggerPhase.Inactive && !state.IsActive && Near(state.RemainingDelaySeconds, 0f),
            "reset must clear delayed trigger state");
        Require(state.TryBegin(0f), "zero delay begin should succeed");
        Require(state.Phase == U2DelayedTriggerPhase.Ready && state.IsReady,
            "zero delay must begin immediately Ready");
        Require(state.TryConsume() && state.Phase == U2DelayedTriggerPhase.Fired,
            "immediate Ready trigger must still require one explicit consume");

        state.Reset();
        Require(state.TryBegin(1f), "cancel fixture begin failed");
        Require(state.TryTick(.25f, out _), "cancel fixture partial tick failed");
        Require(state.TryCancel(), "active waiting trigger must support cancellation");
        Require(state.Phase == U2DelayedTriggerPhase.Cancelled && Near(state.RemainingDelaySeconds, 0f),
            "cancel must clear remaining delay and enter terminal Cancelled");
        Require(!state.TryConsume(), "cancelled trigger must never fire");

        state.Reset();
        Require(state.TryBegin(.1f), "ready-cancel fixture begin failed");
        Require(state.TryTick(.1f, out var exactReady) && exactReady.BecameReadyThisTick,
            "exact delay tick must enter Ready");
        Require(state.TryCancel() && state.Phase == U2DelayedTriggerPhase.Cancelled,
            "caller may cancel a Ready trigger before effect consume");

        state.Reset();
        Require(!state.TryBegin(-1f), "negative delay must fail closed");
        Require(!state.TryBegin(float.NaN), "non-finite delay must fail closed");
        Require(state.TryBegin(.5f), "valid begin after invalid attempts should succeed");
        var stablePhase = state.Phase;
        var stableRemaining = state.RemainingDelaySeconds;
        Require(!state.TryBegin(.2f), "active trigger must reject replacement begin");
        Require(!state.TryTick(0f, out _), "zero delta must fail closed");
        Require(!state.TryTick(float.PositiveInfinity, out _), "non-finite delta must fail closed");
        Require(state.Phase == stablePhase && Near(state.RemainingDelaySeconds, stableRemaining),
            "invalid active operations must not mutate valid delay state");

        Console.WriteLine("PASS delayed trigger: wait/ready/consume + cancel + zero-delay + overshoot + fail-closed");
        return 0;
    }
}
