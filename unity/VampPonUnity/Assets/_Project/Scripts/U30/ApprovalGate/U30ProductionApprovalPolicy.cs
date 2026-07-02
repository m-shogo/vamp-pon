using System.Collections.Generic;
using System.Linq;

namespace VampPon.UnitySpike.U30.ApprovalGate
{
    public sealed class U30ProductionApprovalPolicy
    {
        public U30Stage1ApprovalReport BuildCurrentStage1Report()
        {
            var gates = BuildCurrentGates();
            var state = BuildState(gates);
            return new U30Stage1ApprovalReport(state, gates);
        }

        public bool CanApproveProduction(IReadOnlyList<U30ApprovalGateResult> gates)
        {
            return gates.Count > 0 && gates.All(gate => gate.Status == U30ApprovalGateStatus.Pass);
        }

        private static IReadOnlyList<U30ApprovalGateResult> BuildCurrentGates()
        {
            return new[]
            {
                Gate("runtime-loop", "Stage1 runtime loop", U30ApprovalGateStatus.Pass, false, "U25 runtime loop and screenshots", "StageSelect to Battle to Result flow exists."),
                Gate("battle-feel", "Battle feel", U30ApprovalGateStatus.Caution, false, "U22-U25 Editor proof", "Playable in Editor proof, but not final device feel."),
                Gate("levelup-choice", "LevelUp choice", U30ApprovalGateStatus.Pass, false, "U25/U26 proof", "First choice and multi-choice proof exist."),
                Gate("rare-evolution-kokuyou", "Rare / evolution / Kokuyou moments", U30ApprovalGateStatus.Caution, false, "U24-U26 proof", "Moments exist, final art and device feel are not final approved."),
                Gate("result-reward-unlock", "Result reward unlock", U30ApprovalGateStatus.Caution, false, "U27 proof", "Draft reward economy and unlock proof exist."),
                Gate("stageselect-retry", "StageSelect retry", U30ApprovalGateStatus.Pass, false, "U25/U27 proof", "Retry and cleared state proof exist."),
                Gate("save-safety", "Save safety", U30ApprovalGateStatus.Caution, false, "U27 PlayerPrefs repository", "Local save proof exists; Cloud Save is not introduced."),
                Gate("se-haptic", "SE and haptic feel", U30ApprovalGateStatus.Caution, false, "U28 routing proof", "Draft SE routing exists; mobile haptic device behavior is unmeasured."),
                Gate("mobile-performance", "Mobile FPS performance", U30ApprovalGateStatus.NotMeasured, true, "U29 budget and checklist", "Real device FPS, memory, thermal, draw calls, GC are not measured."),
                Gate("sprite-atlas", "Sprite Atlas packing", U30ApprovalGateStatus.Fail, true, "U29 policy and U30 draft map", "Production .spriteatlas packing evidence is incomplete."),
                Gate("visual-consistency", "Visual consistency", U30ApprovalGateStatus.Caution, false, "U22-U29 screenshots", "Editor visual proof exists, final asset replacement remains."),
                Gate("viewport-readability", "390x844 readability", U30ApprovalGateStatus.Pass, false, "U25-U30 generated screenshots", "Portrait proof remains readable in Editor screenshots."),
                Gate("asset-boundary", "Production asset boundary", U30ApprovalGateStatus.Pass, false, "Boundary checker", "Generated proof images stay outside Unity runtime."),
                Gate("generated-final-safety", "Generated final image safety", U30ApprovalGateStatus.Pass, false, "Runtime scan", "Generated final PNGs are not used as runtime pasted screens."),
                Gate("regression-suite", "Regression suite", U30ApprovalGateStatus.Pass, false, "U22-U29 checkers", "Regression targets are defined and re-run by U30."),
            };
        }

        private static U30ApprovalState BuildState(IReadOnlyList<U30ApprovalGateResult> gates)
        {
            var pass = gates.Count(gate => gate.Status == U30ApprovalGateStatus.Pass);
            var caution = gates.Count(gate => gate.Status == U30ApprovalGateStatus.Caution);
            var fail = gates.Count(gate => gate.Status == U30ApprovalGateStatus.Fail);
            var notMeasured = gates.Count(gate => gate.Status == U30ApprovalGateStatus.NotMeasured);
            var blockers = gates.Count(gate => gate.Critical && gate.Status != U30ApprovalGateStatus.Pass);

            return new U30ApprovalState
            {
                ProductionApproved = false,
                InternalPreviewReady = true,
                MobileQaReady = true,
                AssetReplacementReady = false,
                PerformanceQaReady = true,
                GateCount = gates.Count,
                PassCount = pass,
                CautionCount = caution,
                FailCount = fail,
                NotMeasuredCount = notMeasured,
                CriticalBlockerCount = blockers,
            };
        }

        private static U30ApprovalGateResult Gate(
            string id,
            string label,
            U30ApprovalGateStatus status,
            bool critical,
            string evidence,
            string note)
        {
            return new U30ApprovalGateResult(id, label, status, critical, evidence, note);
        }
    }
}
