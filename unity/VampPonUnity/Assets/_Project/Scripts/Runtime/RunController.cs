using UnityEngine;

namespace VampPon.UnitySpike.Runtime
{
    public sealed class RunController : MonoBehaviour
    {
        [SerializeField] private float elapsedSeconds;

        public float ElapsedSeconds => elapsedSeconds;

        private void Update()
        {
            elapsedSeconds += Time.deltaTime;
        }
    }
}
