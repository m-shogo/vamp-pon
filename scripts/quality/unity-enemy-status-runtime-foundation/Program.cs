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
        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, 2f, 1, 3) == EnemyStatusApplyResult.Applied, "First BURN apply should succeed.");
        Assert(state.Has(EnemyStatusRuntimeKind.Burn), "BURN should be active after apply.");
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Burn) == 1, "BURN initial stack mismatch.");
        Assert(Math.Abs(state.GetRemainingSeconds(EnemyStatusRuntimeKind.Burn) - 2f) < 0.001f, "BURN initial duration mismatch.");

        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, 1f, 1, 3) == EnemyStatusApplyResult.Stacked, "BURN reapply should stack within cap.");
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Burn) == 2, "BURN stack increment mismatch.");
        Assert(Math.Abs(state.GetRemainingSeconds(EnemyStatusRuntimeKind.Burn) - 2f) < 0.001f, "Shorter reapply must not shorten remaining duration.");

        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, 3f, 5, 3) == EnemyStatusApplyResult.Stacked, "BURN capped stack apply should still report stack growth.");
        Assert(state.GetStacks(EnemyStatusRuntimeKind.Burn) == 3, "BURN max stack cap must be enforced.");
        Assert(Math.Abs(state.GetRemainingSeconds(EnemyStatusRuntimeKind.Burn) - 3f) < 0.001f, "Longer reapply must refresh duration upward.");
        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, 1f, 1, 3) == EnemyStatusApplyResult.Refreshed, "At max stacks a valid reapply should refresh, not grow stacks.");

        state.Tick(1.25f);
        Assert(Math.Abs(state.GetRemainingSeconds(EnemyStatusRuntimeKind.Burn) - 1.75f) < 0.001f, "Status Tick must decrement duration deterministically.");

        Assert(state.Remove(EnemyStatusRuntimeKind.Burn, 2f), "Removing active BURN should report true.");
        Assert(!state.Has(EnemyStatusRuntimeKind.Burn), "Removed BURN must be inactive.");
        Assert(Math.Abs(state.GetReapplyCooldownSeconds(EnemyStatusRuntimeKind.Burn) - 2f) < 0.001f, "Reapply cooldown start mismatch.");
        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, 2f) == EnemyStatusApplyResult.BlockedByReapplyCooldown, "Reapply cooldown must block immediate loops.");

        state.Tick(1f);
        Assert(Math.Abs(state.GetReapplyCooldownSeconds(EnemyStatusRuntimeKind.Burn) - 1f) < 0.001f, "Reapply cooldown Tick mismatch.");
        state.StartReapplyCooldown(EnemyStatusRuntimeKind.Burn, 0.5f);
        Assert(Math.Abs(state.GetReapplyCooldownSeconds(EnemyStatusRuntimeKind.Burn) - 1f) < 0.001f, "Shorter cooldown restart must not shorten existing cooldown.");
        state.Tick(1f);
        Assert(state.GetReapplyCooldownSeconds(EnemyStatusRuntimeKind.Burn) == 0f, "Cooldown must expire to zero.");
        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, 0f) == EnemyStatusApplyResult.RejectedInvalidArguments, "Zero duration must fail closed.");
        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, 1f, 0, 1) == EnemyStatusApplyResult.RejectedInvalidArguments, "Zero stack delta must fail closed.");
        Assert(state.Apply(EnemyStatusRuntimeKind.Burn, 1f, 1, 0) == EnemyStatusApplyResult.RejectedInvalidArguments, "Zero max stacks must fail closed.");

        Assert(state.Apply(EnemyStatusRuntimeKind.Chill, 0.5f) == EnemyStatusApplyResult.Applied, "CHILL apply failed.");
        state.Tick(0.5f);
        Assert(!state.Has(EnemyStatusRuntimeKind.Chill), "Status must expire at zero remaining duration.");

        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Freeze) == BossStatusDisposition.ConvertToSlow, "Boss FREEZE must convert to slow rather than immunity/full stop.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Rooted) == BossStatusDisposition.ConvertToSlow, "Boss ROOTED must convert to slow.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Sleep) == BossStatusDisposition.ConvertToActionDelay, "Boss SLEEP must convert to action delay.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Chill) == BossStatusDisposition.ReduceMagnitude, "Boss CHILL must reduce magnitude.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Drowsy) == BossStatusDisposition.ReduceMagnitude, "Boss DROWSY must reduce magnitude.");
        Assert(EnemyStatusRuntimeState.GetBossDisposition(EnemyStatusRuntimeKind.Marked) == BossStatusDisposition.Preserve, "Boss MARKED should remain valid.");

        state.Apply(EnemyStatusRuntimeKind.Marked, 2f, 1, 4);
        state.Apply(EnemyStatusRuntimeKind.Soak, 3f, 1, 1);
        var snapshot = state.Snapshot();
        Assert(snapshot.Length == 3, "Snapshot should contain all active Status entries.");
        for (var i = 1; i < snapshot.Length; i++)
        {
            Assert(snapshot[i - 1].Kind.CompareTo(snapshot[i].Kind) < 0, "Snapshot ordering must be deterministic by Status kind.");
        }

        state.Clear();
        Assert(state.ActiveCount == 0, "Clear must remove all active Status entries.");
        Assert(state.ReapplyCooldownCount == 0, "Clear must remove all reapply cooldown entries.");

        Console.WriteLine("EnemyStatusRuntimeState contract: PASS (Status16 round-trip, bounded stacks, refresh, expiry, cooldown, Boss disposition)");
    }
}
