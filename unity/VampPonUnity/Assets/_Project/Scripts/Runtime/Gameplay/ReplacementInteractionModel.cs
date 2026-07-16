using System;
using System.Collections.Generic;
using System.Linq;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using VampPon.UnitySpike.Runtime.Gameplay.State;

namespace VampPon.UnitySpike.Runtime.Gameplay
{
    public enum ReplacementInteractionPhase { ChoosingSlot, SlotSelected, Committing, Completed, Cancelled }
    public enum ReplacementInteractionResult { Ready, Selected, Committed, Cancelled, NoSelection, StaleOffer, StaleInventory, InvalidSlot, UnknownOwnedId, UnknownIncomingId, DuplicateCommit, WrongPhase, CommitRejected }

    public sealed class ReplacementIncomingViewModel
    {
        public string DefinitionId { get; set; }
        public string DisplayName { get; set; }
        public GameplayChoiceKind Kind { get; set; }
    }

    public sealed class ReplacementOwnedSlotViewModel
    {
        public int SlotIndex { get; set; }
        public string OwnedId { get; set; }
        public string DisplayName { get; set; }
        public string IconId { get; set; }
        public bool IsSelected { get; set; }
        public bool IsReplaceable { get; set; }
    }

    public sealed class ReplacementModalViewModel
    {
        public ReplacementIncomingViewModel IncomingCandidate { get; set; }
        public IReadOnlyList<ReplacementOwnedSlotViewModel> OwnedSlots { get; set; }
        public int? SelectedSlotIndex { get; set; }
        public bool ConfirmEnabled { get; set; }
        public bool CancelEnabled { get; set; }
        public ReplacementInteractionPhase Phase { get; set; }
    }

    public sealed class ReplacementInteractionModel
    {
        private readonly Stage1GameplayDataRegistry registry;
        private readonly RunGameplayState run;
        private readonly LevelUpChoice incoming;
        private readonly string[] ownedIds;
        private readonly int capacity;
        private readonly string inventorySignature;
        private int? selectedSlotIndex;

        private ReplacementInteractionModel(Stage1GameplayDataRegistry registry, RunGameplayState run, LevelUpChoice incoming, string[] ownedIds, int capacity)
        {
            this.registry = registry;
            this.run = run;
            this.incoming = incoming;
            this.ownedIds = ownedIds;
            this.capacity = capacity;
            inventorySignature = Signature(run, incoming.Kind);
            Phase = ReplacementInteractionPhase.ChoosingSlot;
        }

        public ReplacementInteractionPhase Phase { get; private set; }
        public int? SelectedSlotIndex => selectedSlotIndex;
        public int CommitCount { get; private set; }

        public static ReplacementInteractionResult TryCreate(Stage1GameplayDataRegistry registry, RunGameplayState run, LevelUpChoice incoming, out ReplacementInteractionModel model)
        {
            model = null;
            if (registry == null || run == null || incoming == null || !incoming.RequiresReplacement || incoming.Kind is not (GameplayChoiceKind.Weapon or GameplayChoiceKind.Passive)) return ReplacementInteractionResult.StaleOffer;
            if (!IsKnownIncoming(registry, incoming)) return ReplacementInteractionResult.UnknownIncomingId;
            var ids = Ids(run, incoming.Kind).ToArray();
            var limit = Capacity(run, incoming.Kind);
            if (ids.Length != limit || ids.Contains(incoming.DefinitionId, StringComparer.Ordinal)) return ReplacementInteractionResult.StaleOffer;
            if (ids.Any(id => !IsKnownOwned(registry, incoming.Kind, id))) return ReplacementInteractionResult.UnknownOwnedId;
            model = new ReplacementInteractionModel(registry, run, incoming, ids, limit);
            return ReplacementInteractionResult.Ready;
        }

        public ReplacementInteractionResult SelectSlot(int slotIndex, RunGameplayState currentRun, LevelUpChoice currentOffer)
        {
            var guard = ValidateCurrent(currentRun, currentOffer);
            if (guard != ReplacementInteractionResult.Ready) return guard;
            if (Phase is not (ReplacementInteractionPhase.ChoosingSlot or ReplacementInteractionPhase.SlotSelected)) return ReplacementInteractionResult.WrongPhase;
            if (slotIndex < 0 || slotIndex >= ownedIds.Length) return ReplacementInteractionResult.InvalidSlot;
            if (!IsKnownOwned(registry, incoming.Kind, ownedIds[slotIndex])) return ReplacementInteractionResult.UnknownOwnedId;
            selectedSlotIndex = slotIndex;
            Phase = ReplacementInteractionPhase.SlotSelected;
            return ReplacementInteractionResult.Selected;
        }

        public ReplacementInteractionResult Commit(RunGameplayState currentRun, LevelUpChoice currentOffer, Func<int, bool> commit)
        {
            if (Phase is ReplacementInteractionPhase.Completed or ReplacementInteractionPhase.Committing) return ReplacementInteractionResult.DuplicateCommit;
            if (Phase != ReplacementInteractionPhase.SlotSelected) return selectedSlotIndex.HasValue ? ReplacementInteractionResult.WrongPhase : ReplacementInteractionResult.NoSelection;
            var guard = ValidateCurrent(currentRun, currentOffer);
            if (guard != ReplacementInteractionResult.Ready) return guard;
            if (!selectedSlotIndex.HasValue || selectedSlotIndex.Value < 0 || selectedSlotIndex.Value >= ownedIds.Length) return ReplacementInteractionResult.InvalidSlot;
            Phase = ReplacementInteractionPhase.Committing;
            if (commit == null || !commit(selectedSlotIndex.Value)) { Phase = ReplacementInteractionPhase.SlotSelected; return ReplacementInteractionResult.CommitRejected; }
            CommitCount++;
            Phase = ReplacementInteractionPhase.Completed;
            selectedSlotIndex = null;
            return ReplacementInteractionResult.Committed;
        }

        public ReplacementInteractionResult Cancel()
        {
            if (Phase is ReplacementInteractionPhase.Completed or ReplacementInteractionPhase.Committing) return ReplacementInteractionResult.DuplicateCommit;
            if (Phase == ReplacementInteractionPhase.Cancelled) return ReplacementInteractionResult.WrongPhase;
            Phase = ReplacementInteractionPhase.Cancelled;
            selectedSlotIndex = null;
            return ReplacementInteractionResult.Cancelled;
        }

        public void ClearForClose() => selectedSlotIndex = null;

        public ReplacementModalViewModel BuildViewModel()
        {
            var slots = ownedIds.Select((id, index) => new ReplacementOwnedSlotViewModel
            {
                SlotIndex = index,
                OwnedId = id,
                DisplayName = DisplayName(registry, incoming.Kind, id),
                IconId = id,
                IsSelected = selectedSlotIndex == index,
                IsReplaceable = IsKnownOwned(registry, incoming.Kind, id),
            }).ToArray();
            return new ReplacementModalViewModel
            {
                IncomingCandidate = new ReplacementIncomingViewModel { DefinitionId = incoming.DefinitionId, DisplayName = DisplayName(registry, incoming.Kind, incoming.DefinitionId), Kind = incoming.Kind },
                OwnedSlots = slots,
                SelectedSlotIndex = selectedSlotIndex,
                ConfirmEnabled = Phase == ReplacementInteractionPhase.SlotSelected && selectedSlotIndex.HasValue,
                CancelEnabled = Phase is ReplacementInteractionPhase.ChoosingSlot or ReplacementInteractionPhase.SlotSelected,
                Phase = Phase,
            };
        }

        private ReplacementInteractionResult ValidateCurrent(RunGameplayState currentRun, LevelUpChoice currentOffer)
        {
            if (!ReferenceEquals(run, currentRun) || currentRun == null || !ReferenceEquals(run.Inventory, currentRun.Inventory)) return ReplacementInteractionResult.StaleInventory;
            if (currentOffer == null || currentOffer.Kind != incoming.Kind || currentOffer.DefinitionId != incoming.DefinitionId || currentOffer.NextLevel != incoming.NextLevel || !currentOffer.RequiresReplacement) return ReplacementInteractionResult.StaleOffer;
            if (!IsKnownIncoming(registry, currentOffer)) return ReplacementInteractionResult.UnknownIncomingId;
            if (Ids(currentRun, incoming.Kind).Any(id => !IsKnownOwned(registry, incoming.Kind, id))) return ReplacementInteractionResult.UnknownOwnedId;
            if (Capacity(currentRun, incoming.Kind) != capacity || Signature(currentRun, incoming.Kind) != inventorySignature) return ReplacementInteractionResult.StaleInventory;
            return ReplacementInteractionResult.Ready;
        }

        private static IEnumerable<string> Ids(RunGameplayState run, GameplayChoiceKind kind) => kind == GameplayChoiceKind.Weapon ? run.Inventory.Weapons.Select(value => value.Id) : run.Inventory.Passives.Select(value => value.Id);
        private static int Capacity(RunGameplayState run, GameplayChoiceKind kind) => kind == GameplayChoiceKind.Weapon ? run.Inventory.WeaponLimit : run.Inventory.PassiveLimit;
        private static string Signature(RunGameplayState run, GameplayChoiceKind kind) => kind == GameplayChoiceKind.Weapon
            ? run.Inventory.WeaponLimit + ":" + string.Join("|", run.Inventory.Weapons.Select(value => value.Id + "@" + value.Level))
            : run.Inventory.PassiveLimit + ":" + string.Join("|", run.Inventory.Passives.Select(value => value.Id + "@" + value.Level));
        private static bool IsKnownIncoming(Stage1GameplayDataRegistry registry, LevelUpChoice value)
        {
            try { return value.Kind == GameplayChoiceKind.Weapon ? !registry.GetWeapon(value.DefinitionId).IsEvolved : value.Kind == GameplayChoiceKind.Passive && registry.GetPassive(value.DefinitionId) != null; }
            catch { return false; }
        }
        private static bool IsKnownOwned(Stage1GameplayDataRegistry registry, GameplayChoiceKind kind, string id)
        {
            try { return kind == GameplayChoiceKind.Weapon ? !registry.GetWeapon(id).IsEvolved : registry.GetPassive(id) != null; }
            catch { return false; }
        }
        private static string DisplayName(Stage1GameplayDataRegistry registry, GameplayChoiceKind kind, string id) => kind == GameplayChoiceKind.Weapon ? registry.GetWeapon(id).DisplayName : registry.GetPassive(id).DisplayName;
    }
}
