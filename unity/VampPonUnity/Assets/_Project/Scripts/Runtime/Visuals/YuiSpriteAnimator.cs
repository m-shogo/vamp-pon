using UnityEngine;
using VampPon.UnitySpike.Player;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class YuiSpriteAnimator : MonoBehaviour
    {
        private SpriteRenderer spriteRenderer;
        private PlayerController playerController;
        private RuntimeCharacterAnimationSet animationSet;
        private U2BattleController battleController;
        private float frameTimer;
        private float transientTimer;
        private int frameIndex;
        private bool runtimePaused;

        public RuntimeCharacterAnimationState State { get; private set; } = RuntimeCharacterAnimationState.Idle;
        public RuntimeFacing Facing { get; private set; } = RuntimeFacing.Right;
        public int FrameIndex => frameIndex;
        public bool RuntimePaused => runtimePaused;
        public string CurrentFrameName => spriteRenderer != null && spriteRenderer.sprite != null ? spriteRenderer.sprite.name : string.Empty;

        public void Initialize(RuntimeCharacterAnimationSet set, PlayerController controller, U2BattleController battle)
        {
            animationSet = set;
            playerController = controller;
            spriteRenderer = GetComponent<SpriteRenderer>();
            BindBattle(battle);
            ResetAnimation();
        }

        public void SetRuntimePaused(bool paused)
        {
            runtimePaused = paused;
        }

        public void PlayHurt()
        {
            if (runtimePaused) return;
            SetState(RuntimeCharacterAnimationState.Hurt, animationSet.FrameDuration * 2f);
        }

        public void ResetAnimation()
        {
            Facing = RuntimeFacing.Right;
            State = RuntimeCharacterAnimationState.Idle;
            frameIndex = 0;
            frameTimer = 0f;
            transientTimer = 0f;
            ApplyFrame();
        }

        private void OnDestroy()
        {
            BindBattle(null);
        }

        private void BindBattle(U2BattleController battle)
        {
            if (battleController != null)
            {
                battleController.PlayerAttackFired -= OnAttack;
                battleController.PlayerDamageVisualRequested -= PlayHurt;
            }
            battleController = battle;
            if (battleController != null)
            {
                battleController.PlayerAttackFired += OnAttack;
                battleController.PlayerDamageVisualRequested += PlayHurt;
            }
        }

        private void OnAttack()
        {
            if (runtimePaused) return;
            SetState(RuntimeCharacterAnimationState.Attack, animationSet.FrameDuration * 2f);
        }

        private void Update()
        {
            if (animationSet == null || playerController == null || runtimePaused || Time.deltaTime <= 0f) return;

            var velocity = playerController.CurrentVelocity;
            if (State != RuntimeCharacterAnimationState.Hurt && State != RuntimeCharacterAnimationState.Attack)
            {
                if (velocity.x < -0.02f) Facing = RuntimeFacing.Left;
                else if (velocity.x > 0.02f) Facing = RuntimeFacing.Right;
                var locomotion = velocity.sqrMagnitude > 0.01f
                    ? RuntimeCharacterAnimationState.Walk
                    : RuntimeCharacterAnimationState.Idle;
                if (locomotion != State) SetState(locomotion, 0f);
            }
            else
            {
                transientTimer -= Time.deltaTime;
                if (transientTimer <= 0f)
                {
                    SetState(velocity.sqrMagnitude > 0.01f
                        ? RuntimeCharacterAnimationState.Walk
                        : RuntimeCharacterAnimationState.Idle, 0f);
                }
            }

            frameTimer += Time.deltaTime;
            if (frameTimer >= animationSet.FrameDuration)
            {
                frameTimer -= animationSet.FrameDuration;
                var frames = animationSet.Frames(State, Facing);
                frameIndex = (frameIndex + 1) % frames.Length;
                ApplyFrame();
            }
        }

        private void SetState(RuntimeCharacterAnimationState state, float duration)
        {
            State = state;
            transientTimer = duration;
            frameIndex = 0;
            frameTimer = 0f;
            ApplyFrame();
        }

        private void ApplyFrame()
        {
            if (animationSet == null || spriteRenderer == null) return;
            var frames = animationSet.Frames(State, Facing);
            spriteRenderer.flipX = false;
            spriteRenderer.sprite = frames[Mathf.Clamp(frameIndex, 0, frames.Length - 1)];
        }
    }
}
