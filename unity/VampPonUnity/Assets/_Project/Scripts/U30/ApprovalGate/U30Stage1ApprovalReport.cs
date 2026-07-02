using System.Collections.Generic;
using System.Linq;

namespace VampPon.UnitySpike.U30.ApprovalGate
{
    public sealed class U30Stage1ApprovalReport
    {
        public U30Stage1ApprovalReport(U30ApprovalState state, IReadOnlyList<U30ApprovalGateResult> gates)
        {
            State = state;
            Gates = gates;
        }

        public U30ApprovalState State { get; }
        public IReadOnlyList<U30ApprovalGateResult> Gates { get; }

        public IEnumerable<U30ApprovalGateResult> CriticalBlockers =>
            Gates.Where(gate => gate.Critical && gate.Status != U30ApprovalGateStatus.Pass);
    }
}
