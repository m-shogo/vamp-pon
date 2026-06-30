using UnityEngine;

namespace VampPon.UnitySpike.Player
{
    public sealed class PlayerController : MonoBehaviour
    {
        private Vector3 origin;

        private void Awake()
        {
            origin = transform.position;
        }

        private void Update()
        {
            var bob = Mathf.Sin(Time.time * 3.2f) * 0.035f;
            transform.position = origin + new Vector3(0f, bob, 0f);
        }
    }
}
