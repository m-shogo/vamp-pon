using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U11.Common
{
    public sealed class PaperButtonProof : MonoBehaviour
    {
        public Image Background { get; private set; }
        public Button Button { get; private set; }
        public TextMeshProUGUI Label { get; private set; }
        public int ProofClickCount { get; private set; }

        private string proofEventId;
        private Action<string> onClickProof;

        public static PaperButtonProof Create(
            Transform parent,
            string name,
            Sprite sprite,
            string text,
            TMP_FontAsset font,
            Color textColor,
            float fontSize,
            string proofEventId = "",
            Action<string> onClickProof = null)
        {
            var root = new GameObject(name, typeof(RectTransform), typeof(Image), typeof(Button), typeof(PaperButtonProof));
            root.transform.SetParent(parent, false);
            var proof = root.GetComponent<PaperButtonProof>();
            proof.Background = root.GetComponent<Image>();
            proof.Background.sprite = sprite;
            proof.Background.color = Color.white;
            proof.Background.preserveAspect = true;
            proof.Background.raycastTarget = true;
            proof.Button = root.GetComponent<Button>();
            proof.Button.transition = Selectable.Transition.ColorTint;
            proof.Button.targetGraphic = proof.Background;
            proof.Button.colors = new ColorBlock
            {
                normalColor = Color.white,
                highlightedColor = new Color(1f, 0.96f, 0.86f, 1f),
                pressedColor = new Color(0.88f, 0.74f, 0.56f, 1f),
                selectedColor = new Color(1f, 0.96f, 0.86f, 1f),
                disabledColor = new Color(0.54f, 0.48f, 0.42f, 0.65f),
                colorMultiplier = 1f,
                fadeDuration = 0.08f
            };
            proof.ConfigureProofHook(proofEventId, onClickProof);
            proof.Button.onClick.AddListener(proof.OnClickProof);

            var label = PaperLabelProof.Create(root.transform, "PaperButtonLabel", text, font, fontSize, textColor);
            var labelRect = label.GetComponent<RectTransform>();
            labelRect.anchorMin = Vector2.zero;
            labelRect.anchorMax = Vector2.one;
            labelRect.offsetMin = new Vector2(10f, 6f);
            labelRect.offsetMax = new Vector2(-10f, -6f);
            proof.Label = label.Label;
            return proof;
        }

        public void ConfigureProofHook(string eventId, Action<string> handler)
        {
            proofEventId = eventId;
            onClickProof = handler;
        }

        public void OnClickProof()
        {
            ProofClickCount++;
            var eventId = string.IsNullOrEmpty(proofEventId) ? gameObject.name : proofEventId;
            Debug.Log($"[U12FunctionalProof] button hook: {eventId}, count={ProofClickCount}");
            onClickProof?.Invoke(eventId);
        }
    }
}
