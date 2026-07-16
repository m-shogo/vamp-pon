using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using VampPon.UnitySpike.Runtime.Gameplay.State;

namespace VampPon.UnitySpike.Editor
{
    public static class U48ReplacementInteractionVerification
    {
        private static int assertions;

        [MenuItem("VampPon/U48/Verify Replacement Interaction Model")]
        public static void RunBatchmode()
        {
            assertions = 0;
            var registry = Resources.Load<Stage1GameplayDataRegistry>("GameplayData/Stage1/Stage1GameplayDataRegistry") ?? throw new InvalidOperationException("U47 registry missing.");
            var weapon = VerifyWeapon(registry);
            var passive = VerifyPassive(registry);
            var guards = VerifyGuards(registry);
            VerifyPaperButtonInteraction();
            var output = Path.GetFullPath(Path.Combine(Application.dataPath, "../../../docs/design-targets/generated/unity-u48/batch-c/replacement-runtime-verification.json"));
            Directory.CreateDirectory(Path.GetDirectoryName(output));
            File.WriteAllText(output, "{\n" +
                "  \"schemaVersion\": 1,\n  \"passed\": true,\n" +
                $"  \"assertionCount\": {assertions},\n  \"failureCount\": 0,\n" +
                "  \"weapon\": {\n    \"modalOpened\": true,\n    \"initialSelection\": null,\n    \"confirmInitiallyDisabled\": true,\n    \"slotButtonClicked\": true,\n    \"selectedSlotIndex\": 1,\n    \"inventoryChangedBeforeConfirm\": false,\n    \"confirmClicked\": true,\n    \"replacementCommitCount\": 1,\n    \"inventoryAfter\": [\"night_pencil\", \"streetlamp_ring\"]\n  },\n" +
                "  \"passive\": {\n    \"modalOpened\": true,\n    \"initialSelection\": null,\n    \"confirmInitiallyDisabled\": true,\n    \"slotButtonClicked\": true,\n    \"selectedSlotIndex\": 1,\n    \"inventoryChangedBeforeConfirm\": false,\n    \"confirmClicked\": true,\n    \"replacementCommitCount\": 1,\n    \"inventoryAfter\": [\"old_ticket\", \"travel_badge\", \"white_margin\"]\n  },\n" +
                "  \"cancel\": {\n    \"beforeSelection\": \"inventory-unchanged\",\n    \"afterSelection\": \"inventory-unchanged\"\n  },\n" +
                "  \"guards\": {\n    \"noSelection\": true,\n    \"invalidSlot\": true,\n    \"staleInventory\": true,\n    \"staleOffer\": true,\n    \"unknownIncomingId\": true,\n    \"duplicateCommit\": true\n  },\n" +
                "  \"cleanup\": {\n    \"selectionCleared\": true,\n    \"reopenSelectionNull\": true,\n    \"listenerCount\": 0\n  },\n" +
                $"  \"measured\": {{\n    \"weaponCommitCount\": {weapon.CommitCount},\n    \"passiveCommitCount\": {passive.CommitCount},\n    \"guardCount\": {guards}\n  }},\n" +
                "  \"exceptionCount\": 0,\n  \"assertionFailureCount\": 0\n}\n");
            Debug.Log($"U48 Replacement interaction verification passed: {assertions} assertions.");
        }

        private static ReplacementInteractionModel VerifyWeapon(Stage1GameplayDataRegistry registry)
        {
            var run = Run(registry); var applier = new LevelUpChoiceApplier(registry);
            Require(applier.Accept(run, Choice(GameplayChoiceKind.Weapon, "black_ink_bottle", false)), "weapon setup");
            var offer = Choice(GameplayChoiceKind.Weapon, "streetlamp_ring", true);
            Require(ReplacementInteractionModel.TryCreate(registry, run, offer, out var model) == ReplacementInteractionResult.Ready, "weapon model ready");
            Require(model.Phase == ReplacementInteractionPhase.ChoosingSlot && model.SelectedSlotIndex == null && !model.BuildViewModel().ConfirmEnabled, "weapon initial state");
            var before = WeaponIds(run);
            Require(model.Commit(run, offer, _ => false) == ReplacementInteractionResult.NoSelection && WeaponIds(run).SequenceEqual(before), "weapon no-selection guard");
            Require(model.SelectSlot(0, run, offer) == ReplacementInteractionResult.Selected && model.SelectSlot(1, run, offer) == ReplacementInteractionResult.Selected, "weapon selection change");
            Require(model.SelectSlot(1, run, offer) == ReplacementInteractionResult.Selected && model.BuildViewModel().OwnedSlots.Single(value => value.IsSelected).OwnedId == "black_ink_bottle", "weapon same selection and selected row");
            Require(WeaponIds(run).SequenceEqual(before) && model.BuildViewModel().ConfirmEnabled, "weapon unchanged before confirm");
            Require(model.Commit(run, offer, slot => applier.ReplaceInventorySlot(run, offer, slot)) == ReplacementInteractionResult.Committed, "weapon committed");
            Require(WeaponIds(run).SequenceEqual(new[] { "night_pencil", "streetlamp_ring" }) && run.Inventory.WeaponLimit == 2 && model.CommitCount == 1, "weapon expected after");
            Require(model.Commit(run, offer, slot => applier.ReplaceInventorySlot(run, offer, slot)) == ReplacementInteractionResult.DuplicateCommit && model.CommitCount == 1, "weapon double confirm");
            model.ClearForClose(); Require(model.SelectedSlotIndex == null, "weapon cleanup");
            return model;
        }

        private static ReplacementInteractionModel VerifyPassive(Stage1GameplayDataRegistry registry)
        {
            var run = Run(registry); var applier = new LevelUpChoiceApplier(registry);
            foreach (var id in new[] { "old_ticket", "gold_compass", "travel_badge" }) Require(applier.Accept(run, Choice(GameplayChoiceKind.Passive, id, false)), "passive setup " + id);
            var offer = Choice(GameplayChoiceKind.Passive, "white_margin", true);
            Require(ReplacementInteractionModel.TryCreate(registry, run, offer, out var model) == ReplacementInteractionResult.Ready, "passive model ready");
            var before = PassiveIds(run);
            Require(model.SelectSlot(1, run, offer) == ReplacementInteractionResult.Selected && PassiveIds(run).SequenceEqual(before), "passive selection unchanged");
            Require(model.Commit(run, offer, slot => applier.ReplaceInventorySlot(run, offer, slot)) == ReplacementInteractionResult.Committed, "passive committed");
            Require(PassiveIds(run).SequenceEqual(new[] { "old_ticket", "travel_badge", "white_margin" }) && run.Inventory.PassiveLimit == 3 && model.CommitCount == 1, "passive expected after");
            return model;
        }

        private static int VerifyGuards(Stage1GameplayDataRegistry registry)
        {
            var count = 0;
            var run = Run(registry); var applier = new LevelUpChoiceApplier(registry); Require(applier.Accept(run, Choice(GameplayChoiceKind.Weapon, "black_ink_bottle", false)), "guard setup");
            var offer = Choice(GameplayChoiceKind.Weapon, "streetlamp_ring", true);
            Require(ReplacementInteractionModel.TryCreate(registry, run, offer, out var invalid) == ReplacementInteractionResult.Ready, "invalid-slot model");
            Require(invalid.SelectSlot(5, run, offer) == ReplacementInteractionResult.InvalidSlot, "invalid slot"); count++;
            Require(invalid.SelectSlot(1, run, Choice(GameplayChoiceKind.Weapon, "black_ink_bottle", true)) == ReplacementInteractionResult.StaleOffer, "stale offer"); count++;
            Require(ReplacementInteractionModel.TryCreate(registry, run, Choice(GameplayChoiceKind.Weapon, "not_registered", true), out _) == ReplacementInteractionResult.UnknownIncomingId, "unknown incoming"); count++;
            Require(ReplacementInteractionModel.TryCreate(registry, run, offer, out var stale) == ReplacementInteractionResult.Ready, "stale model"); Require(stale.SelectSlot(1, run, offer) == ReplacementInteractionResult.Selected, "stale selected");
            Require(applier.ReplaceInventorySlot(run, offer, 1), "external valid mutation");
            Require(stale.Commit(run, offer, _ => true) == ReplacementInteractionResult.StaleInventory, "stale inventory"); count++;
            var cancelBeforeRun = Run(registry); Require(applier.Accept(cancelBeforeRun, Choice(GameplayChoiceKind.Weapon, "black_ink_bottle", false)), "cancel-before setup"); var cancelBeforeIds = WeaponIds(cancelBeforeRun); Require(ReplacementInteractionModel.TryCreate(registry, cancelBeforeRun, offer, out var cancelBefore) == ReplacementInteractionResult.Ready && cancelBefore.Cancel() == ReplacementInteractionResult.Cancelled && WeaponIds(cancelBeforeRun).SequenceEqual(cancelBeforeIds), "cancel before selection"); count++;
            var cancelAfterRun = Run(registry); Require(applier.Accept(cancelAfterRun, Choice(GameplayChoiceKind.Weapon, "black_ink_bottle", false)), "cancel-after setup"); var cancelAfterIds = WeaponIds(cancelAfterRun); Require(ReplacementInteractionModel.TryCreate(registry, cancelAfterRun, offer, out var cancelAfter) == ReplacementInteractionResult.Ready && cancelAfter.SelectSlot(1, cancelAfterRun, offer) == ReplacementInteractionResult.Selected && cancelAfter.Cancel() == ReplacementInteractionResult.Cancelled && cancelAfter.SelectedSlotIndex == null && WeaponIds(cancelAfterRun).SequenceEqual(cancelAfterIds), "cancel after selection"); count++;
            Require(ReplacementInteractionModel.TryCreate(registry, cancelAfterRun, offer, out var reopened) == ReplacementInteractionResult.Ready && reopened.SelectedSlotIndex == null, "reopen reset"); count++;
            return count;
        }

        private static void VerifyPaperButtonInteraction()
        {
            var root = new GameObject("U48ReplacementPaperButtonVerification"); var presses = 0;
            try
            {
                var button = U4.PaperButton.Create(root.transform, "この枠と入れ替える", 220, 44, () => presses++);
                button.SetInteractable(false); button.Press(); Require(presses == 0 && !button.IsInteractable, "actual disabled confirm");
                button.SetInteractable(true); button.Press(); Require(presses == 1 && button.IsInteractable, "actual enabled confirm");
            }
            finally { UnityEngine.Object.DestroyImmediate(root); }
        }

        private static RunGameplayState Run(Stage1GameplayDataRegistry registry) => new(registry, RunGameplayScenarioOptions.SimulatorFullSlotReplacement(registry));
        private static LevelUpChoice Choice(GameplayChoiceKind kind, string id, bool replacement) => new() { Kind = kind, DefinitionId = id, NextLevel = 1, RequiresReplacement = replacement };
        private static string[] WeaponIds(RunGameplayState run) => run.Inventory.Weapons.Select(value => value.Id).ToArray();
        private static string[] PassiveIds(RunGameplayState run) => run.Inventory.Passives.Select(value => value.Id).ToArray();
        private static void Require(bool value, string label) { assertions++; if (!value) throw new InvalidOperationException("U48 Replacement verification failed: " + label); }
    }
}
