using System;
using TMPro;
using UnityEngine;
using UnityEngine.InputSystem;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;

namespace VampPon.UnitySpike.U4
{
    public sealed class U4LevelUpDemoController : MonoBehaviour
    {
        private U4LevelUpOverlay overlay;
        private TMP_FontAsset japaneseFont;
        private int levelUpCount;
        private int expForNextLevel = 5;
        private int currentExp;
        private Stage1GameplayRuntimeCoordinator gameplay;
        private int choiceSeed = 4700;
        private ReplacementInteractionModel replacement;
        private LevelUpChoice replacementOffer;
        public bool DemoTriggered { get; private set; }
        public event Action OverlayOpened;
        public event Action OverlayClosed;

        public int LevelUpCount => levelUpCount;
        public bool IsOverlayActive => overlay != null && overlay.IsActive;

        public void Initialize(TMP_FontAsset font)
        {
            japaneseFont = font;
            overlay = U4LevelUpOverlay.Create(transform, font);
        }

        public void BindGameplayRuntime(Stage1GameplayRuntimeCoordinator runtime)
        {
            if (gameplay != null) gameplay.LevelUpRequested -= TriggerLevelUp;
            gameplay = runtime;
            if (gameplay != null) gameplay.LevelUpRequested += TriggerLevelUp;
        }

        public void NotifyExpCollected(int totalExp)
        {
            currentExp = totalExp;
            if (currentExp >= expForNextLevel && !IsOverlayActive)
            {
                TriggerLevelUp();
            }
        }

        public void TriggerLevelUp()
        {
            if (IsOverlayActive) return;

            var choices = gameplay != null ? BuildRuntimeChoices() : U4LevelUpCandidatePool.PickThree();
            OverlayOpened?.Invoke();
            overlay.Show(choices, OnChoiceConfirmed);
            U43RuntimeFeedbackBridge.Instance?.PlayLevelUp();
        }

        public void TriggerLevelUpWithAwakening()
        {
            if (IsOverlayActive) return;

            var choices = U4LevelUpCandidatePool.PickThree();
            choices[2] = U4LevelUpCandidatePool.GetAwakeningPlaceholder();
            OverlayOpened?.Invoke();
            overlay.Show(choices, OnChoiceConfirmed);
            U43RuntimeFeedbackBridge.Instance?.PlayEvolution();
        }

        private void OnChoiceConfirmed(U4LevelUpChoice choice)
        {
            if (gameplay != null && choice.RuntimeChoice is LevelUpChoice runtimeChoice)
            {
                if (runtimeChoice.RequiresReplacement) { BeginReplacement(runtimeChoice); return; }
                if (!gameplay.AcceptChoice(runtimeChoice)) return;
                FinishRuntimeDecision(); return;
            }
            OverlayClosed?.Invoke();
            levelUpCount++;
            expForNextLevel += 5;
            DemoTriggered = false;
            if (choice.IsAwakeningGate)
            {
                U43RuntimeFeedbackBridge.Instance?.PlayEvolution();
            }
            else if (choice.Rarity == U4ItemRarity.Rare)
            {
                U43RuntimeFeedbackBridge.Instance?.PlayRare();
            }
            else
            {
                U43RuntimeFeedbackBridge.PlayButtonTapIfAvailable();
            }
        }

        private void FinishRuntimeDecision()
        {
            ClearReplacement();
            gameplay.Run.ConsumePendingLevelUp(); OverlayClosed?.Invoke(); levelUpCount++; U43RuntimeFeedbackBridge.PlayButtonTapIfAvailable();
            if (gameplay.Run.PendingLevelUps > 0) Invoke(nameof(TriggerLevelUp), .05f);
        }

        public void DeclineChoice() { if (gameplay == null) return; replacement?.Cancel(); ClearReplacement(); gameplay.DeclineChoice(); OverlayClosed?.Invoke(); if (gameplay.Run.PendingLevelUps > 0) Invoke(nameof(TriggerLevelUp), .05f); }

        private void BeginReplacement(LevelUpChoice offer)
        {
            var result = ReplacementInteractionModel.TryCreate(gameplay.Registry, gameplay.Run, offer, out replacement);
            if (result != ReplacementInteractionResult.Ready) { replacement = null; replacementOffer = null; overlay.Hide(); return; }
            replacementOffer = offer;
            RenderReplacement();
        }

        private void RenderReplacement() => overlay.ShowReplacement(replacement.BuildViewModel(), SelectReplacementSlot, ConfirmReplacement, CancelReplacement);

        private void SelectReplacementSlot(int slotIndex)
        {
            if (replacement?.SelectSlot(slotIndex, gameplay.Run, replacementOffer) == ReplacementInteractionResult.Selected) RenderReplacement();
        }

        private void ConfirmReplacement()
        {
            if (replacement == null) return;
            var result = replacement.Commit(gameplay.Run, replacementOffer, slot => gameplay.ReplaceInventorySlot(replacementOffer, slot));
            if (result != ReplacementInteractionResult.Committed) { RenderReplacement(); return; }
            overlay.Hide();
            FinishRuntimeDecision();
        }

        private void CancelReplacement()
        {
            if (replacement?.Cancel() != ReplacementInteractionResult.Cancelled) return;
            overlay.Hide();
            ClearReplacement();
            gameplay.DeclineChoice();
            OverlayClosed?.Invoke();
            if (gameplay.Run.PendingLevelUps > 0) Invoke(nameof(TriggerLevelUp), .05f);
        }

        private void ClearReplacement()
        {
            replacement?.ClearForClose();
            replacement = null;
            replacementOffer = null;
        }

        internal ReplacementModalViewModel ActiveReplacementViewModel => replacement?.BuildViewModel();
        internal int ReplacementCommitCount => replacement?.CommitCount ?? 0;

        private U4LevelUpChoice[] BuildRuntimeChoices()
        {
            var choices = gameplay.CreateLevelUpChoices(choiceSeed++);
            var result = new U4LevelUpChoice[choices.Count];
            for (var i=0;i<choices.Count;i++) { var choice=choices[i]; string name, description; var rarity=U4ItemRarity.Normal; var type=U4ItemType.Weapon; if (choice.Kind==GameplayChoiceKind.Weapon) { var definition=gameplay.Registry.GetWeapon(choice.DefinitionId); name=definition.DisplayName; description=definition.Description; } else if(choice.Kind==GameplayChoiceKind.Passive) { var definition=gameplay.Registry.GetPassive(choice.DefinitionId); name=definition.DisplayName; description=definition.Description; type=U4ItemType.Passive; } else { var definition=gameplay.Registry.GetEvolution(choice.DefinitionId); name=definition.DisplayName; description=definition.Lore; rarity=U4ItemRarity.Rare; type=U4ItemType.Special; } result[i]=new U4LevelUpChoice { Id=choice.DefinitionId, NameJa=name, DescriptionJa=description, TypeLabelJa=choice.Kind==GameplayChoiceKind.Evolution?"進化":choice.Kind==GameplayChoiceKind.Passive?"パッシブ":"武器", Rarity=rarity, ItemType=type, Level=choice.NextLevel, IsAwakeningGate=choice.Kind==GameplayChoiceKind.Evolution, RequiresReplacement=choice.RequiresReplacement, RuntimeChoice=choice }; }
            return result;
        }

#if VAMPPON_AI_SIMULATOR_SMOKE
        internal void ShowReplacementForVerification(LevelUpChoice choice)
        {
            if (gameplay == null || choice == null || !choice.RequiresReplacement) throw new InvalidOperationException("A registered full-slot replacement choice is required.");
            var definition = choice.Kind == GameplayChoiceKind.Weapon
                ? gameplay.Registry.GetWeapon(choice.DefinitionId).DisplayName
                : gameplay.Registry.GetPassive(choice.DefinitionId).DisplayName;
            OnChoiceConfirmed(new U4LevelUpChoice
            {
                Id = choice.DefinitionId,
                NameJa = definition,
                ItemType = choice.Kind == GameplayChoiceKind.Weapon ? U4ItemType.Weapon : U4ItemType.Passive,
                RuntimeChoice = choice,
                RequiresReplacement = true,
            });
        }
#endif

        private void OnDestroy() { ClearReplacement(); if (gameplay != null) gameplay.LevelUpRequested -= TriggerLevelUp; }

        private void Update()
        {
            if (overlay == null) return;

            var keyboard = Keyboard.current;
            if (keyboard == null) return;

            if (keyboard.lKey.wasPressedThisFrame && !IsOverlayActive)
            {
                TriggerLevelUp();
                DemoTriggered = true;
            }

            if (keyboard.kKey.wasPressedThisFrame && !IsOverlayActive)
            {
                TriggerLevelUpWithAwakening();
                DemoTriggered = true;
            }
        }
    }
}
