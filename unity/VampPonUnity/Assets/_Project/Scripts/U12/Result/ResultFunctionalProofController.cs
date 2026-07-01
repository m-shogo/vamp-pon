using System;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Result;

namespace VampPon.UnitySpike.U12.Result
{
    public sealed class ResultFunctionalProofController : MonoBehaviour
    {
        public ResultProofData Data { get; private set; }
        public string LastProofHookEvent { get; private set; } = "";

        public static ResultFunctionalProofController Create(
            Transform parent,
            ResultProofAssets assets,
            TMP_FontAsset font,
            ResultProofData data,
            Action<string> onContinueProof = null)
        {
            ResultFunctionalProofController controller = null;
            var root = ResultRootProof.Create(parent, assets, font, ToContent(data), eventId =>
            {
                controller?.RecordProofHook(eventId);
                onContinueProof?.Invoke(eventId);
            });
            controller = root.gameObject.AddComponent<ResultFunctionalProofController>();
            controller.Data = data;
            return controller;
        }

        public void RecordProofHook(string eventId)
        {
            LastProofHookEvent = eventId;
            Debug.Log($"[U12FunctionalProof] result proof hook recorded: {eventId}");
        }

        private static ResultProofContent ToContent(ResultProofData data)
        {
            return new ResultProofContent(
                "今夜の記録",
                data.Rank,
                data.MemoryCountLabel,
                data.RewardCards,
                data.StatsLabels);
        }
    }
}
