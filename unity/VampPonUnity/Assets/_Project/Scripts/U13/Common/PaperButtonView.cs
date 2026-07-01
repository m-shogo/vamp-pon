using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U13.Common
{
    public class PaperButtonView : MonoBehaviour
    {
        [SerializeField] private Button button;
        [SerializeField] private TextMeshProUGUI label;
        [SerializeField] private string actionId = "";

        private Action<string> proofHandler;

        public void Configure(string text, string proofActionId, Action<string> handler)
        {
            if (label == null)
            {
                label = GetComponentInChildren<TextMeshProUGUI>();
            }

            if (button == null)
            {
                button = GetComponent<Button>();
            }

            actionId = proofActionId;
            proofHandler = handler;
            if (label != null) label.text = text;
            if (button != null)
            {
                button.onClick.RemoveListener(OnClickProof);
                button.onClick.AddListener(OnClickProof);
            }
        }

        public void OnClickProof()
        {
            Debug.Log($"[U13PrefabFlow] proof button action: {actionId}");
            proofHandler?.Invoke(actionId);
        }
    }
}
