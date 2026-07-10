using System;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    [CreateAssetMenu(menuName = "VampPon/Runtime Visuals/Stage1 Registry", fileName = "Stage1RuntimeVisualAssetRegistry")]
    public sealed class Stage1RuntimeVisualAssetRegistry : ScriptableObject
    {
        [SerializeField] private string playerSourcePath;
        [SerializeField] private string enemySourcePath;
        [SerializeField] private float playerPixelsPerUnit = 150f;
        [SerializeField] private float enemyPixelsPerUnit = 120f;
        [SerializeField] private Vector2 playerPivot = new(0.5f, 0.02f);
        [SerializeField] private Vector2 enemyPivot = new(0.5f, 0.08f);
        [SerializeField] private float playerVisualScale = 0.9f;
        [SerializeField] private float enemyVisualScale = 1.05f;
        [SerializeField] private float playerFrameDuration = 0.12f;
        [SerializeField] private float enemyFrameDuration = 0.1f;

        [SerializeField] private Sprite[] playerIdleLeft;
        [SerializeField] private Sprite[] playerIdleRight;
        [SerializeField] private Sprite[] playerWalkLeft;
        [SerializeField] private Sprite[] playerWalkRight;
        [SerializeField] private Sprite[] playerHurtLeft;
        [SerializeField] private Sprite[] playerHurtRight;
        [SerializeField] private Sprite[] playerAttackLeft;
        [SerializeField] private Sprite[] playerAttackRight;
        [SerializeField] private Sprite[] enemyIdle;
        [SerializeField] private Sprite[] enemyMove;
        [SerializeField] private Sprite[] enemyHurt;
        [SerializeField] private Sprite[] enemyDeath;

        public string PlayerSourcePath => playerSourcePath;
        public string EnemySourcePath => enemySourcePath;
        public float PlayerPixelsPerUnit => playerPixelsPerUnit;
        public float EnemyPixelsPerUnit => enemyPixelsPerUnit;
        public Vector2 PlayerPivot => playerPivot;
        public Vector2 EnemyPivot => enemyPivot;
        public float PlayerVisualScale => playerVisualScale;
        public float EnemyVisualScale => enemyVisualScale;

        public RuntimeCharacterAnimationSet CreatePlayerAnimationSet()
        {
            Validate();
            return new RuntimeCharacterAnimationSet(
                new RuntimeDirectionalFrames(playerIdleLeft, playerIdleRight),
                new RuntimeDirectionalFrames(playerWalkLeft, playerWalkRight),
                new RuntimeDirectionalFrames(playerHurtLeft, playerHurtRight),
                new RuntimeDirectionalFrames(playerAttackLeft, playerAttackRight),
                playerFrameDuration);
        }

        public RuntimeEnemyAnimationSet CreateEnemyAnimationSet()
        {
            Validate();
            return new RuntimeEnemyAnimationSet(enemyIdle, enemyMove, enemyHurt, enemyDeath, enemyFrameDuration);
        }

        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(playerSourcePath) || string.IsNullOrWhiteSpace(enemySourcePath))
                throw new InvalidOperationException("Stage1 runtime visual source paths are missing");
            Require(playerIdleLeft, 2, "player idle left");
            Require(playerIdleRight, 2, "player idle right");
            Require(playerWalkLeft, 2, "player walk left");
            Require(playerWalkRight, 2, "player walk right");
            Require(playerHurtLeft, 1, "player hurt left");
            Require(playerHurtRight, 1, "player hurt right");
            Require(playerAttackLeft, 2, "player attack left");
            Require(playerAttackRight, 2, "player attack right");
            Require(enemyIdle, 2, "enemy idle");
            Require(enemyMove, 2, "enemy move");
            Require(enemyHurt, 1, "enemy hurt");
            Require(enemyDeath, 2, "enemy death");
            if (playerPixelsPerUnit <= 0f || enemyPixelsPerUnit <= 0f || playerVisualScale <= 0f || enemyVisualScale <= 0f)
                throw new InvalidOperationException("Stage1 runtime visual sizing is invalid");
        }

        private static void Require(Sprite[] frames, int minimum, string label)
        {
            if (frames == null || frames.Length < minimum || Array.Exists(frames, frame => frame == null))
                throw new InvalidOperationException($"Stage1 runtime visual frames are incomplete: {label}");
        }

#if UNITY_EDITOR
        public void ConfigureForEditor(
            string playerSource,
            string enemySource,
            Sprite[] idleLeft,
            Sprite[] idleRight,
            Sprite[] walkLeft,
            Sprite[] walkRight,
            Sprite[] hurtLeft,
            Sprite[] hurtRight,
            Sprite[] attackLeft,
            Sprite[] attackRight,
            Sprite[] onbuIdle,
            Sprite[] onbuMove,
            Sprite[] onbuHurt,
            Sprite[] onbuDeath)
        {
            playerSourcePath = playerSource;
            enemySourcePath = enemySource;
            playerIdleLeft = idleLeft;
            playerIdleRight = idleRight;
            playerWalkLeft = walkLeft;
            playerWalkRight = walkRight;
            playerHurtLeft = hurtLeft;
            playerHurtRight = hurtRight;
            playerAttackLeft = attackLeft;
            playerAttackRight = attackRight;
            enemyIdle = onbuIdle;
            enemyMove = onbuMove;
            enemyHurt = onbuHurt;
            enemyDeath = onbuDeath;
            Validate();
        }
#endif
    }
}
