using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U18.Kokuyou
{
    public sealed class KokuyouOverlayProofView : MonoBehaviour
    {
        [SerializeField] private CanvasGroup group;
        [SerializeField] private Image overlayImage;

        public void SetSprite(Sprite sprite)
        {
            if (overlayImage == null) overlayImage = GetComponentInChildren<Image>();
            if (overlayImage != null && sprite != null) overlayImage.sprite = sprite;
        }

        public void SetVisible(bool visible, float alpha = 0.82f)
        {
            if (group == null) group = GetComponent<CanvasGroup>();
            if (group == null) group = gameObject.AddComponent<CanvasGroup>();
            group.alpha = visible ? Mathf.Clamp01(alpha) : 0f;
            group.blocksRaycasts = false;
            group.interactable = false;
        }
    }
}
