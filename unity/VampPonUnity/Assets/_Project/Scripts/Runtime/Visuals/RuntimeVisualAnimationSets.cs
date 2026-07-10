using System;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public enum RuntimeFacing
    {
        Left,
        Right,
    }

    public enum RuntimeCharacterAnimationState
    {
        Idle,
        Walk,
        Hurt,
        Attack,
    }

    public enum RuntimeEnemyAnimationState
    {
        Idle,
        Move,
        Hurt,
        Death,
    }

    [Serializable]
    public sealed class RuntimeDirectionalFrames
    {
        public Sprite[] Left { get; }
        public Sprite[] Right { get; }

        public RuntimeDirectionalFrames(Sprite[] left, Sprite[] right)
        {
            Left = Require(left, "left");
            Right = Require(right, "right");
        }

        public Sprite[] For(RuntimeFacing facing) => facing == RuntimeFacing.Left ? Left : Right;

        private static Sprite[] Require(Sprite[] frames, string direction)
        {
            if (frames == null || frames.Length == 0 || Array.Exists(frames, frame => frame == null))
            {
                throw new InvalidOperationException("Runtime directional frames are incomplete: " + direction);
            }
            return frames;
        }
    }

    [Serializable]
    public sealed class RuntimeCharacterAnimationSet
    {
        public RuntimeDirectionalFrames Idle { get; }
        public RuntimeDirectionalFrames Walk { get; }
        public RuntimeDirectionalFrames Hurt { get; }
        public RuntimeDirectionalFrames Attack { get; }
        public float FrameDuration { get; }

        public RuntimeCharacterAnimationSet(
            RuntimeDirectionalFrames idle,
            RuntimeDirectionalFrames walk,
            RuntimeDirectionalFrames hurt,
            RuntimeDirectionalFrames attack,
            float frameDuration)
        {
            Idle = idle ?? throw new ArgumentNullException(nameof(idle));
            Walk = walk ?? throw new ArgumentNullException(nameof(walk));
            Hurt = hurt ?? throw new ArgumentNullException(nameof(hurt));
            Attack = attack ?? throw new ArgumentNullException(nameof(attack));
            FrameDuration = Mathf.Max(0.04f, frameDuration);
        }

        public Sprite[] Frames(RuntimeCharacterAnimationState state, RuntimeFacing facing) => state switch
        {
            RuntimeCharacterAnimationState.Walk => Walk.For(facing),
            RuntimeCharacterAnimationState.Hurt => Hurt.For(facing),
            RuntimeCharacterAnimationState.Attack => Attack.For(facing),
            _ => Idle.For(facing),
        };
    }

    [Serializable]
    public sealed class RuntimeEnemyAnimationSet
    {
        public Sprite[] Idle { get; }
        public Sprite[] Move { get; }
        public Sprite[] Hurt { get; }
        public Sprite[] Death { get; }
        public float FrameDuration { get; }

        public RuntimeEnemyAnimationSet(Sprite[] idle, Sprite[] move, Sprite[] hurt, Sprite[] death, float frameDuration)
        {
            Idle = Require(idle, "idle");
            Move = Require(move, "move");
            Hurt = Require(hurt, "hurt");
            Death = Require(death, "death");
            FrameDuration = Mathf.Max(0.04f, frameDuration);
        }

        public Sprite[] Frames(RuntimeEnemyAnimationState state) => state switch
        {
            RuntimeEnemyAnimationState.Move => Move,
            RuntimeEnemyAnimationState.Hurt => Hurt,
            RuntimeEnemyAnimationState.Death => Death,
            _ => Idle,
        };

        private static Sprite[] Require(Sprite[] frames, string state)
        {
            if (frames == null || frames.Length == 0 || Array.Exists(frames, frame => frame == null))
            {
                throw new InvalidOperationException("Runtime enemy frames are incomplete: " + state);
            }
            return frames;
        }
    }
}
