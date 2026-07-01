using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.StageSelect
{
    public sealed class StageStartButtonProof : MonoBehaviour
    {
        public static StageStartButtonProof Create(Transform parent, Sprite buttonSprite, TMP_FontAsset font)
        {
            var button = PaperButtonProof.Create(parent, "StageStartButtonProof", buttonSprite, "出発", font, new Color32(32, 22, 16, 255), 17f);
            return button.gameObject.AddComponent<StageStartButtonProof>();
        }
    }
}
