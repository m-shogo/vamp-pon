using UnityEngine;
using UnityEngine.EventSystems;
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

    public sealed class DevicePointerMoveInputSource : IMoveInputSource
    {
        private const float StickRadiusPixels = 92f;
        private const float DeadZonePixels = 16f;
        private Vector2 anchor;
        private bool dragging;

        public Vector2 ReadMove()
        {
            if (TryReadTouch(out var touchMove))
            {
                return touchMove;
            }

            return TryReadMouse(out var mouseMove) ? mouseMove : Vector2.zero;
        }

        private bool TryReadTouch(out Vector2 move)
        {
            move = Vector2.zero;
            var touchscreen = Touchscreen.current;
            if (touchscreen == null)
            {
                dragging = false;
                return false;
            }

            foreach (var touch in touchscreen.touches)
            {
                if (!touch.press.isPressed)
                {
                    continue;
                }

                var position = touch.position.ReadValue();
                var pointerId = touch.touchId.ReadValue();
                if (IsPointerOverUi(pointerId))
                {
                    dragging = false;
                    continue;
                }

                if (!dragging)
                {
                    if (!IsMovementArea(position))
                    {
                        continue;
                    }

                    anchor = position;
                    dragging = true;
                }

                move = DeltaToMove(position - anchor);
                return true;
            }

            dragging = false;
            return false;
        }

        private bool TryReadMouse(out Vector2 move)
        {
            move = Vector2.zero;
            var mouse = Mouse.current;
            if (mouse == null || !mouse.leftButton.isPressed)
            {
                if (mouse != null && mouse.leftButton.wasReleasedThisFrame)
                {
                    dragging = false;
                }
                return false;
            }

            var position = mouse.position.ReadValue();
            if (IsPointerOverUi())
            {
                dragging = false;
                return false;
            }

            if (!dragging)
            {
                if (!IsMovementArea(position))
                {
                    return false;
                }

                anchor = position;
                dragging = true;
            }

            move = DeltaToMove(position - anchor);
            return true;
        }

        private static bool IsMovementArea(Vector2 position)
        {
            return position.x <= Screen.width * 0.42f && position.y <= Screen.height * 0.34f;
        }

        private static bool IsPointerOverUi(int pointerId = -1)
        {
            if (EventSystem.current == null)
            {
                return false;
            }

            return pointerId >= 0
                ? EventSystem.current.IsPointerOverGameObject(pointerId)
                : EventSystem.current.IsPointerOverGameObject();
        }

        private static Vector2 DeltaToMove(Vector2 delta)
        {
            if (delta.magnitude < DeadZonePixels)
            {
                return Vector2.zero;
            }

            return Vector2.ClampMagnitude(delta / StickRadiusPixels, 1f);
        }
    }

    public sealed class CompositeMoveInputSource : IMoveInputSource
    {
        private readonly DevicePointerMoveInputSource pointerInput = new();
        private readonly KeyboardMoveInputSource keyboardInput = new();

        public Vector2 ReadMove()
        {
            var pointerMove = pointerInput.ReadMove();
            return pointerMove.sqrMagnitude > 0.001f ? pointerMove : keyboardInput.ReadMove();
        }
    }

    public sealed class PlayerController : MonoBehaviour
    {
        private readonly CompositeMoveInputSource defaultInput = new();
        private GameFeelConfig config;
        private IMoveInputSource inputSource;
        private Vector2 verificationInput;
        private bool useVerificationInput;
        private bool runtimeInputBlocked;
        private Vector2 velocity;
        private Rect worldBounds = new(-2.2f, -4.5f, 4.4f, 8.2f);
        private Vector3 baseScale = Vector3.one;

        public bool RuntimeInputBlocked => runtimeInputBlocked;
        public Vector2 CurrentVelocity => velocity;

        private void Awake()
        {
            inputSource = defaultInput;
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

        public void SetRuntimeInputBlocked(bool blocked)
        {
            runtimeInputBlocked = blocked;
            if (blocked)
            {
                velocity = Vector2.zero;
            }
        }

        private void Update()
        {
            if (runtimeInputBlocked)
            {
                return;
            }

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
