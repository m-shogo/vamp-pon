using System;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.StageSelect
{
    public sealed class StageStartButtonProof : MonoBehaviour
    {
        public PaperButtonProof PaperButton { get; private set; }

        public static StageStartButtonProof Create(
            Transform parent,
            Sprite buttonSprite,
            TMP_FontAsset font,
            Action<string> onClickProof = null)
        {
            var button = PaperButtonProof.Create(parent, "StageStartButtonProof", buttonSprite, "出発", font, new Color32(32, 22, 16, 255), 17f, "stage_start", onClickProof);
            var proof = button.gameObject.AddComponent<StageStartButtonProof>();
            proof.PaperButton = button;
            return proof;
        }

        public void OnClickProof()
        {
            PaperButton?.OnClickProof();
        }
    }
}
