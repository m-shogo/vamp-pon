using System.Collections.Generic;
using System.Linq;
using VampPon.UnitySpike.U27.SaveRewardUnlock;

namespace VampPon.UnitySpike.U41.EconomyRewardUnlock
{
    public sealed class U41UnlockDuplicateGuard
    {
        public IReadOnlyList<U27UnlockDraftModel> PrioritizeNewUnlocks(IEnumerable<U27UnlockDraftModel> unlocks)
        {
            var seen = new HashSet<string>();
            return (unlocks ?? Enumerable.Empty<U27UnlockDraftModel>())
                .Where(unlock => !string.IsNullOrWhiteSpace(unlock.UnlockId) && seen.Add(unlock.UnlockId))
                .OrderBy(unlock => PriorityOf(unlock.UnlockType))
                .ToList();
        }

        private static int PriorityOf(U27UnlockType type)
        {
            return type switch
            {
                U27UnlockType.StagePlaceholder => (int)U41UnlockDisplayPriority.StagePlaceholder,
                U27UnlockType.KnowledgePlaceholder => (int)U41UnlockDisplayPriority.Knowledge,
                U27UnlockType.RewardCardPlaceholder => (int)U41UnlockDisplayPriority.RewardCard,
                U27UnlockType.CollectionEntryPlaceholder => (int)U41UnlockDisplayPriority.Collection,
                U27UnlockType.RareMemoryPlaceholder => (int)U41UnlockDisplayPriority.RareMemory,
                _ => 999,
            };
        }
    }
}
