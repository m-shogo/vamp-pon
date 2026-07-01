using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U11.Common
{
    public sealed class PaperPanelProof : MonoBehaviour
    {
        public Image Image { get; private set; }

        public static PaperPanelProof Create(Transform parent, string name, Sprite sprite, Color color)
        {
            var root = new GameObject(name, typeof(RectTransform), typeof(Image), typeof(PaperPanelProof));
            root.transform.SetParent(parent, false);
            var proof = root.GetComponent<PaperPanelProof>();
            proof.Image = root.GetComponent<Image>();
            proof.Image.sprite = sprite;
            proof.Image.color = color;
            proof.Image.preserveAspect = sprite != null;
            proof.Image.raycastTarget = false;
            return proof;
        }
    }
}
