using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.Result
{
    public sealed class ResultContinueButtonProof : MonoBehaviour
    {
        public static ResultContinueButtonProof Create(Transform parent, Sprite buttonSprite, TMP_FontAsset font)
        {
            var button = PaperButtonProof.Create(parent, "ResultContinueButtonProof", buttonSprite, "次へ", font, new Color32(38, 25, 18, 255), 18f);
            return button.gameObject.AddComponent<ResultContinueButtonProof>();
        }
    }
}
