using TMPro;
using UnityEngine;

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
        }

        public void TriggerLevelUpWithAwakening()
        {
            if (IsOverlayActive) return;

            var choices = U4LevelUpCandidatePool.PickThree();
            choices[2] = U4LevelUpCandidatePool.GetAwakeningPlaceholder();
            overlay.Show(choices, OnChoiceConfirmed);
        }

        private void OnChoiceConfirmed(U4LevelUpChoice choice)
        {
            levelUpCount++;
            expForNextLevel += 5;
            DemoTriggered = false;
        }

        private void Update()
        {
            if (overlay == null) return;

            if (Input.GetKeyDown(KeyCode.L) && !IsOverlayActive)
            {
                TriggerLevelUp();
                DemoTriggered = true;
            }

            if (Input.GetKeyDown(KeyCode.K) && !IsOverlayActive)
            {
                TriggerLevelUpWithAwakening();
                DemoTriggered = true;
            }
        }
    }
}
