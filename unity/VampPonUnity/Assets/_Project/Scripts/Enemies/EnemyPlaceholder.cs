using UnityEngine;

namespace VampPon.UnitySpike.Enemies
{
    public sealed class EnemyPlaceholder : MonoBehaviour
    {
        private Vector3 origin;

        private void Awake()
        {
            origin = transform.position;
        }

        private void Update()
        {
            var wobble = Mathf.Sin(Time.time * 2.4f) * 0.05f;
            transform.position = origin + new Vector3(Mathf.Cos(Time.time * 1.6f) * 0.025f, wobble, 0f);
        }
    }
}
