using System;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

internal static class Program
{
    private static void Assert(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static void Main()
    {
        var policy = new EnemyStatusApplicationPolicy(
            durationSeconds: 2f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.AddCapped,
            maxStacks: 3,
            magnitude: 0.2f,
            magnitudeMode: EnemyStatusMagnitudeMode.Max,
            maxMagnitude: 1f,
            internalCooldownSeconds: 1f,
            respectInternalCooldown: true);

        var request = new EnemyStatusApplicationRequest(EnemyStatusRuntimeKind.Marked, policy);
        var state = new EnemyStatusRuntimeState();

        Assert(request.Kind == EnemyStatusRuntimeKind.Marked, "Request must preserve typed Status kind.");
        Assert(request.Policy.DurationSeconds == 2f, "Request must preserve caller policy without defaults.");
        Assert(request.ApplyTo(state) == EnemyStatusApplyResult.Applied, "Typed request should apply to enemy Status state.");
        Assert(state.Has(EnemyStatusRuntimeKind.Marked), "MARKED should be active after request ApplyTo.");
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Marked) == 1, "Request stack application mismatch.");
        Assert(Math.Abs(state.GetMagnitude(EnemyStatusRuntimeKind.Marked) - 0.2f) < 0.001f, "Request magnitude application mismatch.");
        Assert(Math.Abs(state.GetInternalCooldownSeconds(EnemyStatusRuntimeKind.Marked) - 1f) < 0.001f, "Request cooldown application mismatch.");
        Assert(request.ApplyTo(state) == EnemyStatusApplyResult.BlockedByInternalCooldown, "Repeated request must respect caller internal cooldown policy.");

        var nullRejected = false;
        try
        {
            request.ApplyTo(null);
        }
        catch (ArgumentNullException)
        {
            nullRejected = true;
        }
        Assert(nullRejected, "Typed request must reject a null Status state.");

        Console.WriteLine("EnemyStatusApplicationRequest contract: PASS (typed kind + exact policy + ApplyTo + cooldown + null guard)");
    }
}
