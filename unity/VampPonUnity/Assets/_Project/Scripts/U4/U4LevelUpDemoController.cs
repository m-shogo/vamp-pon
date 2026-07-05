using TMPro;
using UnityEngine;
using UnityEngine.InputSystem;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.U4
{
    public sealed class U4LevelUpDemoController : MonoBehaviour
    {
        private U4LevelUpOverlay overlay;
        private TMP_FontAsset japaneseFont;
        private int levelUpCount;
        private int expForNextLevel = 5;
        private int currentExp;
        public bool DemoTriggered { get; private set; }

        public int LevelUpCount => levelUpCount;
        public bool IsOverlayActive => overlay != null && overlay.IsActive;

        public void Initialize(TMP_FontAsset font)
        {
            japaneseFont = font;
            overlay = U4LevelUpOverlay.Create(transform, font);
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

            var choices = U4LevelUpCandidatePool.PickThree();
            overlay.Show(choices, OnChoiceConfirmed);
            U43RuntimeFeedbackBridge.Instance?.PlayLevelUp();
        }

        public void TriggerLevelUpWithAwakening()
        {
            if (IsOverlayActive) return;

            var choices = U4LevelUpCandidatePool.PickThree();
            choices[2] = U4LevelUpCandidatePool.GetAwakeningPlaceholder();
            overlay.Show(choices, OnChoiceConfirmed);
            U43RuntimeFeedbackBridge.Instance?.PlayEvolution();
        }

        private void OnChoiceConfirmed(U4LevelUpChoice choice)
        {
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
