using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using System.Linq;

namespace VampPon.UnitySpike.Runtime.Gameplay.State
{
    public sealed class RunGameplayCapacity
    {
        public int WeaponSlots { get; } public int PassiveSlots { get; } public int RareItemSlots { get; }
        public RunGameplayCapacity(int weapons, int passives, int rares) { if (weapons < 1 || passives < 1 || rares < 1) throw new ArgumentOutOfRangeException(); WeaponSlots=weapons; PassiveSlots=passives; RareItemSlots=rares; }
    }
    public sealed class RunGameplayScenarioOptions
    {
        public string ScenarioId { get; } public RunGameplayCapacity Capacity { get; }
        private RunGameplayScenarioOptions(string id, RunGameplayCapacity capacity) { ScenarioId=id; Capacity=capacity; }
        public static RunGameplayScenarioOptions Production(Stage1GameplayDataRegistry registry) => new("production", new RunGameplayCapacity(registry.WeaponSlots, registry.PassiveSlots, registry.RareItemSlots));
        public static RunGameplayScenarioOptions SimulatorFullSlotReplacement(Stage1GameplayDataRegistry registry)
        {
            var eligibleWeapons=registry.Weapons.Count(v=>!v.IsEvolved); var eligiblePassives=registry.Passives.Count;
            return new("u47-simulator-full-slot-replacement", new RunGameplayCapacity(eligibleWeapons-1, eligiblePassives-1, registry.RareItemSlots));
        }
    }
    [Serializable] public sealed class WeaponRuntimeState { public string Id; public int Level; public float CooldownRemaining; public WeaponRuntimeState Copy() => new() { Id = Id, Level = Level, CooldownRemaining = CooldownRemaining }; }
    [Serializable] public sealed class PassiveRuntimeState { public string Id; public int Level; public PassiveRuntimeState Copy() => new() { Id = Id, Level = Level }; }
    [Serializable] public sealed class RareItemRuntimeState { public string Id; public RareItemRuntimeState Copy() => new() { Id = Id }; }

    [Serializable]
    public sealed class InventoryState
    {
        public readonly List<WeaponRuntimeState> Weapons = new(); public readonly List<PassiveRuntimeState> Passives = new(); public readonly List<RareItemRuntimeState> RareItems = new();
        public int WeaponLimit { get; } public int PassiveLimit { get; } public int RareItemLimit { get; }
        public InventoryState(int weapons, int passives, int rares) { WeaponLimit = weapons; PassiveLimit = passives; RareItemLimit = rares; }
        public InventoryState DeepCopy() { var copy = new InventoryState(WeaponLimit, PassiveLimit, RareItemLimit); Weapons.ForEach(v => copy.Weapons.Add(v.Copy())); Passives.ForEach(v => copy.Passives.Add(v.Copy())); RareItems.ForEach(v => copy.RareItems.Add(v.Copy())); return copy; }
        public bool HasWeapon(string id) => Weapons.Exists(v => v.Id == id); public bool HasPassive(string id) => Passives.Exists(v => v.Id == id); public bool HasRareItem(string id) => RareItems.Exists(v => v.Id == id);
        public void ReplaceWith(InventoryState candidate) { Weapons.Clear(); Passives.Clear(); RareItems.Clear(); candidate.Weapons.ForEach(v => Weapons.Add(v.Copy())); candidate.Passives.ForEach(v => Passives.Add(v.Copy())); candidate.RareItems.ForEach(v => RareItems.Add(v.Copy())); }
    }

    [Serializable]
    public sealed class PlayerRuntimeState
    {
        public float CurrentHp, MaxHp, BaseMoveSpeed, BaseMight, BaseCooldownMultiplier, BaseMagnetMultiplier, BaseXpMultiplier;
        public float EffectiveMoveSpeed, EffectiveMight, EffectiveCooldownMultiplier, EffectiveMagnetMultiplier, EffectiveXpMultiplier;
        public float RevivalInvulnerabilityRemaining, RecoverySlowRemaining; public bool IsDefeated;
    }

    public enum KokuyouPhase { Idle, Charging, Ready, Activating, Active, Ending, Recovery }
    public enum KokuyouActivationPolicy { Manual, ForcedWhenReady }
    [Serializable] public sealed class KokuyouRuntimeState { public KokuyouPhase Phase; public float Gauge; public float PhaseRemaining; public int ActivationCount; public void Reset() { Phase = KokuyouPhase.Idle; Gauge = 0; PhaseRemaining = 0; ActivationCount = 0; } }

    public sealed class RunGameplayState
    {
        public int Level { get; private set; } = 1; public int CurrentExp { get; private set; } public int ExpForNextLevel { get; private set; } = 5;
        public InventoryState Inventory { get; private set; } public PlayerRuntimeState Player { get; } = new(); public KokuyouRuntimeState Kokuyou { get; } = new();
        public HashSet<string> AcquiredDefinitionIds { get; } = new(StringComparer.Ordinal); public HashSet<string> NewlyDiscoveredIds { get; } = new(StringComparer.Ordinal);
        public int PendingLevelUps { get; private set; } public bool RevivalUsed { get; set; } public int RevivalUsedCount { get; set; }
        public event Action Changed;
        public RunGameplayState(Stage1GameplayDataRegistry registry, RunGameplayScenarioOptions options = null) { Reset(registry, options); }
        public void Reset(Stage1GameplayDataRegistry registry, RunGameplayScenarioOptions options = null) { var capacity=(options??RunGameplayScenarioOptions.Production(registry)).Capacity; Level = 1; CurrentExp = 0; ExpForNextLevel = 5; PendingLevelUps = 0; RevivalUsed = false; RevivalUsedCount = 0; AcquiredDefinitionIds.Clear(); NewlyDiscoveredIds.Clear(); Inventory = new InventoryState(capacity.WeaponSlots, capacity.PassiveSlots, capacity.RareItemSlots); Inventory.Weapons.Add(new WeaponRuntimeState { Id = registry.Character.initialWeaponId, Level = 1 }); AcquiredDefinitionIds.Add(registry.Character.initialWeaponId); Player.MaxHp = registry.Character.hp; Player.CurrentHp = Player.MaxHp; Player.BaseMoveSpeed = registry.Character.moveSpeed; Player.BaseMight = registry.Character.might; Player.BaseCooldownMultiplier = registry.Character.cooldownMultiplier; Player.BaseMagnetMultiplier = registry.Character.magnetMultiplier; Player.BaseXpMultiplier = registry.Character.xpMultiplier; Player.RevivalInvulnerabilityRemaining = 0; Player.RecoverySlowRemaining = 0; Player.IsDefeated = false; Kokuyou.Reset(); Changed?.Invoke(); }
        public int AddExperience(int amount) { CurrentExp += Math.Max(0, amount); var gained = 0; while (CurrentExp >= ExpForNextLevel) { CurrentExp -= ExpForNextLevel; Level++; gained++; PendingLevelUps++; ExpForNextLevel = 5 + (Level - 1) * 2; } Changed?.Invoke(); return gained; }
        public bool ConsumePendingLevelUp() { if (PendingLevelUps <= 0) return false; PendingLevelUps--; return true; }
        public void NotifyChanged() => Changed?.Invoke();
    }
}
