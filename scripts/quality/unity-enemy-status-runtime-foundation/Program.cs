using System;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

internal static class Program
{
    private static void Assert(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static EnemyStatusApplicationPolicy Policy(
        float durationSeconds = 2f,
        int stacksPerApplication = 1,
        EnemyStatusStackMode stackMode = EnemyStatusStackMode.Replace,
        int maxStacks = 1,
        float magnitude = 0.25f,
        EnemyStatusMagnitudeMode magnitudeMode = EnemyStatusMagnitudeMode.Replace,
        float maxMagnitude = 1f,
        float internalCooldownSeconds = 0f,
        bool respectInternalCooldown = false)
    {
        return new EnemyStatusApplicationPolicy(
            durationSeconds,
            stacksPerApplication,
            stackMode,
            maxStacks,
            magnitude,
            magnitudeMode,
            maxMagnitude,
            internalCooldownSeconds,
            respectInternalCooldown);
    }

    private static void ExpectThrows(Action action, string message)
    {
        try
        {
            action();
        }
        catch (ArgumentOutOfRangeException)
        {
            return;
        }
        throw new InvalidOperationException(message);
    }

    private static void Main()
    {
        var contentIds = new[]
        {
            "BURN", "SOAK", "CHILL", "FREEZE", "SHOCK", "CONDUCTIVE", "EXPOSED", "ROOTED",
            "DROWSY", "SLEEP", "MARKED", "ILLUMINATED", "ECLIPSED", "ERASED", "SEALED", "DISORIENTED",
        };

        Assert(Enum.GetValues(typeof(EnemyStatusRuntimeKind)).Length == 16, "Unity Status runtime must expose exact Status16.");
        foreach (var contentId in contentIds)
        {
            Assert(EnemyStatusRuntimeState.TryParseContentStatusId(contentId, out var kind), $"Status parse failed: {contentId}");
            Assert(EnemyStatusRuntimeState.ToContentStatusId(kind) == contentId, $"Status round-trip failed: {contentId}");
        }
        Assert(!EnemyStatusRuntimeState.TryParseContentStatusId("UNKNOWN_STATUS", out _), "Unknown Status must fail closed.");
        Assert(!EnemyStatusRuntimeState.TryParseContentStatusId("burn", out _), "Status IDs must remain exact/case-sensitive.");

        var state = new EnemyStatusRuntimeState();
        Assert(state.ActiveCount == 0, "Fresh Status state must be empty.");
        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, Policy()) == EnemyStatusApplyResult.Applied, "First BURN apply should succeed.");
        Assert(state.Has(EnemyStatusRuntimeKind.Burn), "BURN should be active after apply.");
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Burn) == 1, "BURN initial stack mismatch.");
        Assert(Math.Abs(state.GetRemainingSeconds(EnemyStatusRuntimeKind.Burn) - 2f) < 0.001f, "BURN initial duration mismatch.");
        Assert(Math.Abs(state.GetMagnitude(EnemyStatusRuntimeKind.Burn) - 0.25f) < 0.001f, "BURN initial magnitude mismatch.");

        // ADD_CAPPED stacks mirror RuntimeStatusApplicationPolicy semantics.
        var markedAdd = Policy(durationSeconds: 3f, stackMode: EnemyStatusStackMode.AddCapped, maxStacks: 3);
        state.Apply(EnemyStatusRuntimeKind.Marked, markedAdd);
        state.Apply(EnemyStatusRuntimeKind.Marked, markedAdd);
        state.Apply(EnemyStatusRuntimeKind.Marked, markedAdd);
        state.Apply(EnemyStatusRuntimeKind.Marked, markedAdd);
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Marked) == 3, "MARKED ADD_CAPPED must enforce maxStacks.");

        // REFRESH keeps stacks but restarts duration from caller policy, even after elapsed time.
        state.Tick(2f);
        var markedRefresh = Policy(durationSeconds: 5f, stackMode: EnemyStatusStackMode.Refresh, maxStacks: 3);
        state.Apply(EnemyStatusRuntimeKind.Marked, markedRefresh);
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Marked) == 3, "REFRESH must preserve current stacks.");
        Assert(Math.Abs(state.GetRemainingSeconds(EnemyStatusRuntimeKind.Marked) - 5f) < 0.001f, "REFRESH must restart duration from caller policy.");

        // REPLACE resets stack count from caller policy.
        var markedReplace = Policy(durationSeconds: 1f, stacksPerApplication: 1, stackMode: EnemyStatusStackMode.Replace, maxStacks: 4);
        state.Apply(EnemyStatusRuntimeKind.Marked, markedReplace);
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Marked) == 1, "REPLACE must reset stacks to stacksPerApplication.");
        Assert(Math.Abs(state.GetRemainingSeconds(EnemyStatusRuntimeKind.Marked) - 1f) < 0.001f, "Successful application must use exact caller duration, not max(old,new).");

        // ADD_CAPPED magnitude mirrors the domain kernel.
        var conductiveAdd = Policy(
            stackMode: EnemyStatusStackMode.AddCapped,
            maxStacks: 3,
            magnitude: 0.2f,
            magnitudeMode: EnemyStatusMagnitudeMode.AddCapped,
            maxMagnitude: 0.5f);
        state.Apply(EnemyStatusRuntimeKind.Conductive, conductiveAdd);
        state.Apply(EnemyStatusRuntimeKind.Conductive, conductiveAdd);
        state.Apply(EnemyStatusRuntimeKind.Conductive, conductiveAdd);
        state.Apply(EnemyStatusRuntimeKind.Conductive, conductiveAdd);
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Conductive) == 3, "CONDUCTIVE stack cap mismatch.");
        Assert(Math.Abs(state.GetMagnitude(EnemyStatusRuntimeKind.Conductive) - 0.5f) < 0.001f, "CONDUCTIVE magnitude cap mismatch.");

        // MAX magnitude never lowers an existing stronger value.
        state.Apply(EnemyStatusRuntimeKind.Exposed, Policy(magnitude: 0.4f, magnitudeMode: EnemyStatusMagnitudeMode.Replace));
        state.Apply(EnemyStatusRuntimeKind.Exposed, Policy(magnitude: 0.2f, magnitudeMode: EnemyStatusMagnitudeMode.Max));
        Assert(Math.Abs(state.GetMagnitude(EnemyStatusRuntimeKind.Exposed) - 0.4f) < 0.001f, "MAX magnitude must preserve stronger existing magnitude.");

        // Internal cooldown ledger is independent from active duration.
        var freezePolicy = Policy(durationSeconds: 1f, internalCooldownSeconds: 3f, respectInternalCooldown: true);
        state.Apply(EnemyStatusRuntimeKind.Freeze, freezePolicy);
        state.Tick(1.25f);
        Assert(!state.Has(EnemyStatusRuntimeKind.Freeze), "FREEZE should expire independently of internal cooldown.");
        Assert(Math.Abs(state.GetInternalCooldownSeconds(EnemyStatusRuntimeKind.Freeze) - 1.75f) < 0.001f, "FREEZE internal cooldown should persist after active expiry.");
        Assert(state.Apply(EnemyStatusRuntimeKind.Freeze, freezePolicy) == EnemyStatusApplyResult.BlockedByInternalCooldown, "FREEZE reapply must respect internal cooldown when policy requires it.");

        // ClearStatus removes active state but preserves independent cooldown ledger.
        var sleepPolicy = Policy(internalCooldownSeconds: 2f);
        state.Apply(EnemyStatusRuntimeKind.Sleep, sleepPolicy);
        Assert(state.ClearStatus(EnemyStatusRuntimeKind.Sleep), "ClearStatus should remove active SLEEP.");
        Assert(!state.Has(EnemyStatusRuntimeKind.Sleep), "Cleared SLEEP must be inactive.");
        Assert(Math.Abs(state.GetInternalCooldownSeconds(EnemyStatusRuntimeKind.Sleep) - 2f) < 0.001f, "ClearStatus must preserve internal cooldown ledger.");

        // Invalid caller policy fails closed instead of inventing tuning fallbacks.
        ExpectThrows(() => state.Apply(EnemyStatusRuntimeKind.Burn, Policy(durationSeconds: 0f)), "Zero duration must throw.");
        ExpectThrows(() => state.Apply(EnemyStatusRuntimeKind.Burn, Policy(stacksPerApplication: 2, maxStacks: 1)), "stacksPerApplication > maxStacks must throw.");
        ExpectThrows(() => state.Apply(EnemyStatusRuntimeKind.Burn, Policy(magnitude: 2f, maxMagnitude: 1f)), "magnitude > maxMagnitude must throw.");
        ExpectThrows(() => state.Apply(EnemyStatusRuntimeKind.Burn, Policy(internalCooldownSeconds: -1f)), "negative cooldown must throw.");
        ExpectThrows(() => state.Tick(-0.1f), "negative Tick delta must throw.");

        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Freeze) == BossStatusDisposition.ConvertToSlow, "Boss FREEZE must convert to slow rather than immunity/full stop.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Rooted) == BossStatusDisposition.ConvertToSlow, "Boss ROOTED must convert to slow.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Sleep) == BossStatusDisposition.ConvertToActionDelay, "Boss SLEEP must convert to action delay.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Chill) == BossStatusDisposition.ReduceMagnitude, "Boss CHILL must reduce magnitude.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Drowsy) == BossStatusDisposition.ReduceMagnitude, "Boss DROWSY must reduce magnitude.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Marked) == BossStatusDisposition.Preserve, "Boss MARKED should remain valid.");

        state.Apply(EnemyStatusRuntimeKind.Soak, Policy(durationSeconds: 3f, magnitude: 0.1f));
        var snapshot = state.Snapshot();
        Assert(snapshot.Length >= 1, "Snapshot should contain active Status entries.");
        for (var i = 1; i < snapshot.Length; i++)
        {
            Assert(snapshot[i - 1].Kind.CompareTo(snapshot[i].Kind) < 0, "Snapshot ordering must be deterministic by Status kind.");
        }
        var soakSnapshot = Array.Find(snapshot, entry => entry.Kind == EnemyStatusRuntimeKind.Soak);
        Assert(Math.Abs(soakSnapshot.Magnitude - 0.1f) < 0.001f, "Snapshot must expose magnitude for runtime effect layers.");

        // Entity lifecycle reset intentionally clears both active state and cooldown ledger.
        state.Clear();
        Assert(state.ActiveCount == 0, "Entity Clear must remove all active Status entries.");
        Assert(state.InternalCooldownCount == 0, "Entity Clear must remove all internal cooldown entries.");

        Console.WriteLine("EnemyStatusRuntimeState contract: PASS (Status16 + stack/magnitude modes + duration + independent cooldown parity)");
    }
}
