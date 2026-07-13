using System;
using UnityEngine;
namespace VampPon.UnitySpike.Runtime.Gameplay.Definitions
{
    public enum WeaponEffectType { Projectile, GroundArea }
    public enum PassiveStatType { MoveSpeedMultiplier, MagnetMultiplier, MightMultiplier, CooldownMultiplier }
    public enum RareItemRole { AwakeningMaterial, SurvivalRevival }
    public enum EvolutionKind { Awakening, Fusion }
    public abstract class GameDefinition : ScriptableObject { [SerializeField] private string id; [SerializeField] private string displayName; [SerializeField, TextArea] private string description; public string Id => id; public string DisplayName => displayName; public string Description => description; public void SetIdentity(string value, string label, string detail) { id = value; displayName = label; description = detail; } }
    [Serializable] public sealed class WeaponLevelDefinition { public int level; public string label; public float damage, damagePerSecond; public int projectiles; public float cooldown; public int pierce; public float duration, radius; public int maxAreas; public string targeting; public float damageAdd, damagePerSecondAdd; public int projectilesAdd; public float cooldownMultiplier = 1f; public int pierceAdd; public float durationAdd, durationMultiplier = 1f, radiusAdd; public int maxAreasAdd; }
    [Serializable] public sealed class PassiveLevelDefinition { public int level; public float value; public string label; }
    [Serializable] public sealed class CharacterGameplayDefinition { public string id, displayName, title, initialWeaponId; public float hp, moveSpeed, might, cooldownMultiplier, magnetMultiplier, xpMultiplier; }
}
