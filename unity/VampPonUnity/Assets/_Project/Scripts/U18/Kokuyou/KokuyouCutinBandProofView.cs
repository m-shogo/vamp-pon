using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U18.Kokuyou
{
    public sealed class KokuyouCutinBandProofView : MonoBehaviour
    {
        [SerializeField] private CanvasGroup group;
        [SerializeField] private Image bandImage;

        public void SetSprite(Sprite sprite)
        {
            if (bandImage == null) bandImage = GetComponentInChildren<Image>();
            if (bandImage != null && sprite != null) bandImage.sprite = sprite;
        }

        public void SetVisible(bool visible, float alpha = 0.9f)
        {
            if (group == null) group = GetComponent<CanvasGroup>();
            if (group == null) group = gameObject.AddComponent<CanvasGroup>();
            group.alpha = visible ? Mathf.Clamp01(alpha) : 0f;
            group.blocksRaycasts = false;
            group.interactable = false;
        }
    }
}
