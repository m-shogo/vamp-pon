using UnityEngine;
using VampPon.UnitySpike.Data;

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U3HitStopController : MonoBehaviour
    {
        private const string HitStopOwner = "U3HitStop";
        private GameFeelConfig config;
        private float remaining;
        private float cooldownRemaining;

        public int TriggerCount { get; private set; }

        public void Initialize(GameFeelConfig gameFeelConfig)
        {
            config = gameFeelConfig;
        }

        public void Request()
        {
            if (config == null || cooldownRemaining > 0f || remaining > 0f)
            {
                return;
            }

            remaining = config.hitStopSeconds;
            cooldownRemaining = config.hitStopCooldown;
            BattleTimeScaleService.TriggerHitStop(HitStopOwner, config.hitStopSeconds, 0.18f);
            TriggerCount++;
        }

        private void Update()
        {
            var delta = Time.unscaledDeltaTime;
            if (cooldownRemaining > 0f)
            {
                cooldownRemaining -= delta;
            }

            if (remaining <= 0f)
            {
                return;
            }

            remaining -= delta;
            if (remaining <= 0f)
            {
                BattleTimeScaleService.ReleaseHitStop(HitStopOwner);
            }
        }

        private void OnDisable()
        {
            BattleTimeScaleService.ReleaseHitStop(HitStopOwner);
        }
    }

    public sealed class U3CameraImpulseController : MonoBehaviour
    {
        private GameFeelConfig config;
        private Transform target;
        private Vector3 basePosition;
        private float remaining;
        private float duration;
        private float strength;
        private Vector2 direction = Vector2.right;

        public int TriggerCount { get; private set; }

        public void Initialize(GameFeelConfig gameFeelConfig, Camera camera)
        {
            config = gameFeelConfig;
            target = camera != null ? camera.transform : null;
            if (target != null)
            {
                basePosition = target.position;
            }
        }

        public void Request(Vector2 impulseDirection)
        {
            if (config == null || target == null)
            {
                return;
            }

            duration = Mathf.Max(0.01f, config.impulseDuration);
            remaining = duration;
            strength = Mathf.Min(0.12f, config.impulseStrength);
            direction = impulseDirection.sqrMagnitude > 0.0001f ? impulseDirection.normalized : Random.insideUnitCircle.normalized;
            TriggerCount++;
        }

        private void LateUpdate()
        {
            if (target == null)
            {
                return;
            }

            if (remaining <= 0f)
            {
                target.position = basePosition;
                return;
            }

            remaining -= Time.unscaledDeltaTime;
            var t = Mathf.Clamp01(remaining / duration);
            var wave = Mathf.Sin(t * Mathf.PI * 5f);
            var offset = direction * (wave * strength * t);
            target.position = basePosition + new Vector3(offset.x, offset.y, 0f);
        }
    }

    public sealed class U3LanternPulseController : MonoBehaviour
    {
        private GameFeelConfig config;
        private Transform player;
        private SpriteRenderer pulseRenderer;
        private float remaining;
        private float duration;

        public int TriggerCount { get; private set; }

        public void Initialize(GameFeelConfig gameFeelConfig, Transform playerTransform, Transform parent, Sprite sprite)
        {
            config = gameFeelConfig;
            player = playerTransform;
            var pulseObject = new GameObject("U3PlayerLanternPulse", typeof(SpriteRenderer));
            pulseObject.transform.SetParent(parent, false);
            pulseRenderer = pulseObject.GetComponent<SpriteRenderer>();
            pulseRenderer.sprite = sprite;
            pulseRenderer.sortingOrder = 18;
            pulseRenderer.color = new Color(1f, 0.62f, 0.22f, 0f);
            pulseObject.SetActive(true);
        }

        public void Request()
        {
            if (config == null || pulseRenderer == null)
            {
                return;
            }

            duration = Mathf.Max(0.01f, config.lanternPulseDuration);
            remaining = duration;
            TriggerCount++;
        }

        private void LateUpdate()
        {
            if (pulseRenderer == null || player == null)
            {
                return;
            }

            pulseRenderer.transform.position = player.position + new Vector3(0f, 0.08f, 0f);
            if (remaining <= 0f)
            {
                pulseRenderer.color = new Color(1f, 0.62f, 0.22f, 0f);
                return;
            }

            remaining -= Time.unscaledDeltaTime;
            var t = 1f - Mathf.Clamp01(remaining / duration);
            var alpha = Mathf.Sin((1f - t) * Mathf.PI) * 0.36f;
            var scale = 0.95f + t * (config.lanternPulseScale + 0.3f);
            pulseRenderer.transform.localScale = Vector3.one * scale;
            pulseRenderer.color = new Color(1f, 0.62f, 0.22f, alpha);
        }
    }
}
