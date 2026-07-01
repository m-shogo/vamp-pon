using System;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.Result
{
    public sealed class ResultContinueButtonProof : MonoBehaviour
    {
        public PaperButtonProof PaperButton { get; private set; }

        public static ResultContinueButtonProof Create(
            Transform parent,
            Sprite buttonSprite,
            TMP_FontAsset font,
            Action<string> onClickProof = null)
        {
            var button = PaperButtonProof.Create(parent, "ResultContinueButtonProof", buttonSprite, "次へ", font, new Color32(38, 25, 18, 255), 18f, "result_continue", onClickProof);
            var proof = button.gameObject.AddComponent<ResultContinueButtonProof>();
            proof.PaperButton = button;
            return proof;
        }

        public void OnClickProof()
        {
            PaperButton?.OnClickProof();
        }
    }
}
