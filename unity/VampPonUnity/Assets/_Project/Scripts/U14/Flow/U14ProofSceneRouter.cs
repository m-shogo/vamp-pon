using UnityEngine;
using UnityEngine.SceneManagement;

namespace VampPon.UnitySpike.U14.Flow
{
    public sealed class U14ProofSceneRouter
    {
        public const string StageSelectSceneName = "U14StageSelectFlowProof";
        public const string BattleSceneName = "U14BattleFlowProof";
        public const string ResultSceneName = "U14ResultFlowProof";

        public U14ProofSceneRouter(bool loadScenes)
        {
            LoadScenes = loadScenes;
        }

        public bool LoadScenes { get; }
        public string LastRoute { get; private set; } = "";

        public void GoToStageSelect()
        {
            U14FlowState.SetStageSelectReturn();
            LastRoute = StageSelectSceneName;
            Debug.Log("U14 router GoToStageSelect");
            LoadProofScene(StageSelectSceneName);
        }

        public void GoToBattle(BattleStartRequestProof request)
        {
            U14FlowState.SetBattleStart(request);
            LastRoute = BattleSceneName;
            Debug.Log($"U14 router GoToBattle: {request.SelectedStageId}");
            LoadProofScene(BattleSceneName);
        }

        public void GoToResult(BattleResultSummaryProof summary)
        {
            U14FlowState.SetResult(summary);
            LastRoute = ResultSceneName;
            Debug.Log($"U14 router GoToResult: {summary.StageId}");
            LoadProofScene(ResultSceneName);
        }

        private void LoadProofScene(string sceneName)
        {
            if (!LoadScenes) return;
            SceneManager.LoadScene(sceneName);
        }
    }
}
