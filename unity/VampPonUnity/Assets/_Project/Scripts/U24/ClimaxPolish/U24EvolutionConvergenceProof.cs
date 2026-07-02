using UnityEngine;

namespace VampPon.UnitySpike.U24.ClimaxPolish
{
    public sealed class U24EvolutionConvergenceProof : MonoBehaviour
    {
        [SerializeField] private bool convergenceVisible = true;
        [SerializeField] private bool completeVisualVisible = true;
        public bool ConvergenceVisible => convergenceVisible;
        public bool CompleteVisualVisible => completeVisualVisible;
    }
}
