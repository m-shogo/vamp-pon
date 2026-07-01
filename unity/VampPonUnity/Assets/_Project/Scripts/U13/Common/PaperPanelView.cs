using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U13.Common
{
    public sealed class PaperPanelView : MonoBehaviour
    {
        [SerializeField] private Image image;

        public void SetTint(Color color)
        {
            if (image == null)
            {
                image = GetComponent<Image>();
            }

            if (image != null)
            {
                image.color = color;
            }
        }
    }
}
