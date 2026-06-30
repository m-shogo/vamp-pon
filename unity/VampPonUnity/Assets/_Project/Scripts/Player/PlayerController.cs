using UnityEngine;
using UnityEngine.InputSystem;
using VampPon.UnitySpike.Data;

namespace VampPon.UnitySpike.Player
{
    public interface IMoveInputSource
    {
        Vector2 ReadMove();
    }

    public sealed class KeyboardMoveInputSource : IMoveInputSource
    {
        public Vector2 ReadMove()
        {
            var keyboard = Keyboard.current;
            if (keyboard == null)
            {
                return Vector2.zero;
            }

            var x = 0f;
            var y = 0f;

            if (keyboard.aKey.isPressed || keyboard.leftArrowKey.isPressed)
            {
                x -= 1f;
            }

            if (keyboard.dKey.isPressed || keyboard.rightArrowKey.isPressed)
            {
                x += 1f;
            }

            if (keyboard.sKey.isPressed || keyboard.downArrowKey.isPressed)
            {
                y -= 1f;
            }

            if (keyboard.wKey.isPressed || keyboard.upArrowKey.isPressed)
            {
                y += 1f;
            }

            var input = new Vector2(x, y);
            return input.sqrMagnitude > 1f ? input.normalized : input;
        }
    }

    public sealed class PlayerController : MonoBehaviour
    {
        private readonly KeyboardMoveInputSource keyboardInput = new();
        private GameFeelConfig config;
        private IMoveInputSource inputSource;
        private Vector2 verificationInput;
        private bool useVerificationInput;
        private Vector2 velocity;
        private Rect worldBounds = new(-2.2f, -4.5f, 4.4f, 8.2f);
        private Vector3 baseScale = Vector3.one;

        private void Awake()
        {
            inputSource = keyboardInput;
            baseScale = transform.localScale;
        }

        public void Initialize(GameFeelConfig gameFeelConfig, Rect movementBounds)
        {
            config = gameFeelConfig;
            worldBounds = movementBounds;
            baseScale = transform.localScale;
        }

        public void SetVerificationMoveInput(Vector2 input)
        {
            verificationInput = input.sqrMagnitude > 1f ? input.normalized : input;
            useVerificationInput = true;
        }

        public void ClearVerificationMoveInput()
        {
            useVerificationInput = false;
        }

        private void Update()
        {
            var moveInput = useVerificationInput ? verificationInput : inputSource.ReadMove();
            var moveSpeed = config != null ? config.playerMoveSpeed : 3.35f;
            var acceleration = config != null ? config.playerAcceleration : 15f;
            var deceleration = config != null ? config.playerDeceleration : 18f;
            var targetVelocity = moveInput * moveSpeed;
            var rate = moveInput.sqrMagnitude > 0.001f ? acceleration : deceleration;
            velocity = Vector2.MoveTowards(velocity, targetVelocity, rate * Time.deltaTime);

            var next = (Vector2)transform.position + velocity * Time.deltaTime;
            next.x = Mathf.Clamp(next.x, worldBounds.xMin, worldBounds.xMax);
            next.y = Mathf.Clamp(next.y, worldBounds.yMin, worldBounds.yMax);
            transform.position = new Vector3(next.x, next.y, transform.position.z);

            var bob = Mathf.Sin(Time.time * 8.5f) * 0.018f;
            var speedPulse = Mathf.Clamp01(velocity.magnitude / Mathf.Max(0.01f, moveSpeed)) * 0.035f;
            transform.localScale = baseScale * (1f + bob + speedPulse);
        }
    }
}
