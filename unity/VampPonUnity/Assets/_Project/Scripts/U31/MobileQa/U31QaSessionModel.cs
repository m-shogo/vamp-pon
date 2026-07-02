using System.Collections.Generic;
using System.Linq;

namespace VampPon.UnitySpike.U31.MobileQa
{
    public sealed class U31QaSessionModel
    {
        public string Version { get; set; } = "U31-2026-07-03";
        public string GeneratedAt { get; set; } = "generated-by-editor-batchmode";
        public string LinkedApprovalGate { get; set; } = "U30 production approval gate";
        public bool ProductionApproved { get; set; }
        public U31QaDeviceProfile DeviceProfile { get; set; } = new();
        public U31QaMeasurementRecord Measurement { get; set; } = new();
        public IReadOnlyList<U31QaScenarioResult> QaScenarioResults { get; set; } = new List<U31QaScenarioResult>();
        public IReadOnlyList<U31QaFinding> Findings { get; set; } = new List<U31QaFinding>();
        public IReadOnlyList<U31QaTuningAction> TuningActions { get; set; } = new List<U31QaTuningAction>();

        public int BlockerCount => Findings.Count(finding => finding.Severity == U31QaFindingSeverity.Blocker);
        public int CautionCount => Findings.Count(finding => finding.Severity == U31QaFindingSeverity.Caution);
        public int NotMeasuredCount => Findings.Count(finding => finding.Severity == U31QaFindingSeverity.NotMeasured);
    }
}
