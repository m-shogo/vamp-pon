using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19GameFeelProofView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI[] labels;

        public void Bind(U19GameFeelProofState state)
        {
            state ??= new U19GameFeelProofState();
            SetLines(
                "U19 Game Feel Proof",
                $"Level {state.CurrentLevel} / EXP {state.CurrentExp}/{state.ExpToNext}",
                $"Fragments {state.CollectedFragments} / Hearts {state.CollectedHearts}",
                $"Combo {state.ComboCount}",
                $"Rare {state.RareTriggered}",
                $"Evolution {state.EvolutionTriggered}",
                $"黒耀化 Active {state.KokuyouActive}",
                $"Last: {state.LastFeelEvent}");
        }

        public void SetLines(params string[] lines)
        {
            if (labels == null || labels.Length == 0)
            {
                labels = GetComponentsInChildren<TextMeshProUGUI>();
            }

            for (var i = 0; i < labels.Length && i < lines.Length; i++)
            {
                labels[i].text = lines[i];
            }
        }
    }
}
