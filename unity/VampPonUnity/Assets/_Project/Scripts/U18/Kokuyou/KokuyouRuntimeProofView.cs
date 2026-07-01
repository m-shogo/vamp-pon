using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U18.Kokuyou
{
    public sealed class KokuyouRuntimeProofView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI stateLabel;
        [SerializeField] private TextMeshProUGUI gaugeLabel;
        [SerializeField] private TextMeshProUGUI buffLabel;

        public void Bind(KokuyouRuntimePrototypeController controller)
        {
            if (controller == null) return;
            if (stateLabel != null) stateLabel.text = $"黒耀化: {controller.State}";
            if (gaugeLabel != null) gaugeLabel.text = $"Gauge {controller.Gauge.Current}/{controller.Gauge.Max}";
            if (buffLabel != null) buffLabel.text = controller.BuffProofActive ? "buff proof active" : controller.RecoilProofActive ? "recoil proof" : "proof standby";
        }
    }
}
