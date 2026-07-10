using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class OnbuSpriteAnimator : MonoBehaviour
    {
        private SpriteRenderer spriteRenderer;
        private RuntimeEnemyAnimationSet animationSet;
        private float frameTimer;
        private float transientTimer;
        private int frameIndex;

        public RuntimeEnemyAnimationState State { get; private set; } = RuntimeEnemyAnimationState.Idle;
        public int FrameIndex => frameIndex;
        public bool DeathComplete { get; private set; }
        public string CurrentFrameName => spriteRenderer != null && spriteRenderer.sprite != null ? spriteRenderer.sprite.name : string.Empty;

        public void Initialize(RuntimeEnemyAnimationSet set)
        {
            animationSet = set;
            spriteRenderer = GetComponent<SpriteRenderer>();
            ResetForPool();
        }

        public void ResetForPool()
        {
            State = RuntimeEnemyAnimationState.Idle;
            frameIndex = 0;
            frameTimer = 0f;
            transientTimer = 0f;
            DeathComplete = false;
            ApplyFrame();
        }

        public void SetMoving(bool moving)
        {
            if (State is RuntimeEnemyAnimationState.Hurt or RuntimeEnemyAnimationState.Death) return;
            var target = moving ? RuntimeEnemyAnimationState.Move : RuntimeEnemyAnimationState.Idle;
            if (target != State) SetState(target, 0f);
        }

        public void PlayHurt(float seconds)
        {
            if (State == RuntimeEnemyAnimationState.Death) return;
            SetState(RuntimeEnemyAnimationState.Hurt, Mathf.Max(seconds, animationSet.FrameDuration));
        }

        public void PlayDeath()
        {
            SetState(RuntimeEnemyAnimationState.Death, 0f);
        }

        public void Tick(float deltaTime)
        {
            if (animationSet == null || deltaTime <= 0f || DeathComplete) return;
            if (State == RuntimeEnemyAnimationState.Hurt)
            {
                transientTimer -= deltaTime;
                if (transientTimer <= 0f) SetState(RuntimeEnemyAnimationState.Move, 0f);
            }

            frameTimer += deltaTime;
            if (frameTimer < animationSet.FrameDuration) return;
            frameTimer -= animationSet.FrameDuration;
            var frames = animationSet.Frames(State);
            if (State == RuntimeEnemyAnimationState.Death && frameIndex >= frames.Length - 1)
            {
                DeathComplete = true;
                return;
            }
            frameIndex = (frameIndex + 1) % frames.Length;
            ApplyFrame();
        }

        private void SetState(RuntimeEnemyAnimationState state, float duration)
        {
            State = state;
            frameIndex = 0;
            frameTimer = 0f;
            transientTimer = duration;
            DeathComplete = false;
            ApplyFrame();
        }

        private void ApplyFrame()
        {
            if (animationSet == null || spriteRenderer == null) return;
            var frames = animationSet.Frames(State);
            spriteRenderer.flipX = false;
            spriteRenderer.sprite = frames[Mathf.Clamp(frameIndex, 0, frames.Length - 1)];
        }
    }
}
