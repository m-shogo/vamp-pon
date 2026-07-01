using System;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.StageSelect;

namespace VampPon.UnitySpike.U12.StageSelect
{
    public sealed class StageSelectFunctionalProofController : MonoBehaviour
    {
        public StageProofData[] Stages { get; private set; }
        public StageProofData SelectedStage { get; private set; }
        public string LastProofHookEvent { get; private set; } = "";

        public static StageSelectFunctionalProofController Create(
            Transform parent,
            StageSelectProofAssets assets,
            TMP_FontAsset font,
            StageProofData[] stages,
            Action<string> onStartProof = null)
        {
            var selected = FindSelected(stages);
            StageSelectFunctionalProofController controller = null;
            var root = StageSelectRootProof.Create(parent, assets, font, ToContent(stages, selected), eventId =>
            {
                controller?.RecordProofHook(eventId);
                onStartProof?.Invoke(eventId);
            });
            controller = root.gameObject.AddComponent<StageSelectFunctionalProofController>();
            controller.Stages = stages;
            controller.SelectedStage = selected;
            return controller;
        }

        public void RecordProofHook(string eventId)
        {
            LastProofHookEvent = eventId;
            Debug.Log($"[U12FunctionalProof] stage proof hook recorded: {eventId}, stage={SelectedStage.Id}");
        }

        private static StageProofData FindSelected(StageProofData[] stages)
        {
            foreach (var stage in stages)
            {
                if (stage.State == StageProofState.Selected)
                {
                    return stage;
                }
            }

            return stages[0];
        }

        private static StageSelectProofContent ToContent(StageProofData[] stages, StageProofData selected)
        {
            var nodeStates = new StageRouteNodeProofState[5];
            for (var i = 0; i < nodeStates.Length; i++)
            {
                nodeStates[i] = i < stages.Length ? stages[i].RouteNodeState : StageRouteNodeProofState.Locked;
            }

            return new StageSelectProofContent(
                "今夜の行き先",
                selected.Title,
                selected.Difficulty,
                selected.StateLabel,
                nodeStates);
        }
    }
}
