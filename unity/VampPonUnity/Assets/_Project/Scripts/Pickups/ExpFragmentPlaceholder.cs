using UnityEngine;

namespace VampPon.UnitySpike.Pickups
{
    public sealed class ExpFragmentPlaceholder : MonoBehaviour
    {
        [SerializeField] private float cycleSeconds = 2.4f;
        [SerializeField] private float arcHeight = 1.05f;
        private Vector3 startPosition;
        private Vector3 targetPosition;
        private float elapsed;

        public void Initialize(Vector3 target)
        {
            startPosition = transform.position;
            targetPosition = target;
        }

        private void Awake()
        {
            startPosition = transform.position;
            targetPosition = new Vector3(0f, -1.25f, 0f);
        }

        private void Update()
        {
            elapsed += Time.deltaTime;
            var t = Mathf.Clamp01(elapsed / cycleSeconds);
            var eased = 1f - Mathf.Pow(1f - t, 3f);
            var arc = Mathf.Sin(t * Mathf.PI) * arcHeight;
            transform.position = Vector3.Lerp(startPosition, targetPosition, eased) + new Vector3(0f, arc, 0f);
            transform.localScale = Vector3.one * Mathf.Lerp(1f, 0.35f, t);

            if (t >= 1f)
            {
                elapsed = 0f;
                transform.position = startPosition;
                transform.localScale = Vector3.one;
            }
        }
    }
}
