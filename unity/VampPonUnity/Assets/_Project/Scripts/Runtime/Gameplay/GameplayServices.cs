using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using VampPon.UnitySpike.Runtime.Gameplay.State;

namespace VampPon.UnitySpike.Runtime.Gameplay
{
    public interface IRandomSource { int Range(int minInclusive, int maxExclusive); }
    public sealed class SeededRandomSource : IRandomSource { private readonly Random random; public SeededRandomSource(int seed) { random = new Random(seed); } public int Range(int min, int max) => random.Next(min, max); }
    public enum GameplayChoiceKind { Weapon, Passive, Evolution }
    public sealed class LevelUpChoice { public GameplayChoiceKind Kind; public string DefinitionId; public int NextLevel; public bool RequiresReplacement; }

    public sealed class GameplayStatCalculator
    {
        public void Recalculate(RunGameplayState run, Stage1GameplayDataRegistry registry)
        {
            var player = run.Player; var move = 1f; var magnet = 1f; var might = 1f; var cooldown = 1f;
            foreach (var owned in run.Inventory.Passives) { var definition = registry.GetPassive(owned.Id); var value = definition.Levels[Math.Clamp(owned.Level, 1, definition.MaxLevel) - 1].value; switch (definition.StatType) { case PassiveStatType.MoveSpeedMultiplier: move = value; break; case PassiveStatType.MagnetMultiplier: magnet = value; break; case PassiveStatType.MightMultiplier: might = value; break; case PassiveStatType.CooldownMultiplier: cooldown = value; break; } }
            player.EffectiveMoveSpeed = player.BaseMoveSpeed * move * (player.RecoverySlowRemaining > 0 ? U47GameplayCandidateConfig.KokuyouRecoveryMoveMultiplier : 1f); player.EffectiveMagnetMultiplier = player.BaseMagnetMultiplier * magnet; player.EffectiveMight = player.BaseMight * might; player.EffectiveCooldownMultiplier = player.BaseCooldownMultiplier * cooldown; player.EffectiveXpMultiplier = player.BaseXpMultiplier;
        }
    }

    public sealed class EvolutionService
    {
        private readonly Stage1GameplayDataRegistry registry; public EvolutionService(Stage1GameplayDataRegistry value) { registry = value; }
        public bool IsEligible(InventoryState inventory, EvolutionDefinition evolution)
        { var from = inventory.Weapons.Find(v => v.Id == evolution.FromWeaponId); if (from == null || from.Level < registry.GetWeapon(evolution.FromWeaponId).MaxLevel) return false; if (!string.IsNullOrEmpty(evolution.RequiredWeaponId)) { var required = inventory.Weapons.Find(v => v.Id == evolution.RequiredWeaponId); if (required == null || required.Level < registry.GetWeapon(evolution.RequiredWeaponId).MaxLevel) return false; } return string.IsNullOrEmpty(evolution.RequiredRareItemId) || inventory.HasRareItem(evolution.RequiredRareItemId); }
        public bool TryApply(InventoryState inventory, string evolutionId)
        { var evolution = registry.GetEvolution(evolutionId); if (!IsEligible(inventory, evolution)) return false; var candidate = inventory.DeepCopy(); foreach (var id in evolution.ConsumedWeaponIds) candidate.Weapons.RemoveAll(v => v.Id == id); if (evolution.ConsumedWeaponIds.Count == 0) candidate.Weapons.RemoveAll(v => v.Id == evolution.FromWeaponId); foreach (var id in evolution.ConsumedRareItemIds) candidate.RareItems.RemoveAll(v => v.Id == id); if (candidate.Weapons.Count >= candidate.WeaponLimit || candidate.HasWeapon(evolution.EvolvedWeaponId)) return false; candidate.Weapons.Add(new WeaponRuntimeState { Id = evolution.EvolvedWeaponId, Level = 1 }); inventory.ReplaceWith(candidate); return true; }
    }

    public sealed class LevelUpCandidateService
    {
        private readonly Stage1GameplayDataRegistry registry; private readonly EvolutionService evolutions; public LevelUpCandidateService(Stage1GameplayDataRegistry value) { registry = value; evolutions = new EvolutionService(value); }
        public List<LevelUpChoice> CreateChoices(RunGameplayState run, IRandomSource random, int count = 3)
        { var pool = new List<LevelUpChoice>(); foreach (var evolution in registry.Evolutions) if (evolutions.IsEligible(run.Inventory, evolution)) pool.Add(new LevelUpChoice { Kind = GameplayChoiceKind.Evolution, DefinitionId = evolution.Id, NextLevel = 1 }); foreach (var weapon in registry.Weapons) { if (weapon.IsEvolved) continue; var owned = run.Inventory.Weapons.Find(v => v.Id == weapon.Id); if (owned != null && owned.Level < weapon.MaxLevel) pool.Add(new LevelUpChoice { Kind = GameplayChoiceKind.Weapon, DefinitionId = weapon.Id, NextLevel = owned.Level + 1 }); else if (owned == null && !WasConsumed(run, weapon.Id)) pool.Add(new LevelUpChoice { Kind = GameplayChoiceKind.Weapon, DefinitionId = weapon.Id, NextLevel = 1, RequiresReplacement = run.Inventory.Weapons.Count >= run.Inventory.WeaponLimit }); } foreach (var passive in registry.Passives) { var owned = run.Inventory.Passives.Find(v => v.Id == passive.Id); if (owned != null && owned.Level < passive.MaxLevel) pool.Add(new LevelUpChoice { Kind = GameplayChoiceKind.Passive, DefinitionId = passive.Id, NextLevel = owned.Level + 1 }); else if (owned == null) pool.Add(new LevelUpChoice { Kind = GameplayChoiceKind.Passive, DefinitionId = passive.Id, NextLevel = 1, RequiresReplacement = run.Inventory.Passives.Count >= run.Inventory.PassiveLimit }); } var result = new List<LevelUpChoice>(); while (pool.Count > 0 && result.Count < count) { var index = random.Range(0, pool.Count); result.Add(pool[index]); pool.RemoveAt(index); } return result; }
        private static bool WasConsumed(RunGameplayState run, string id) => run.AcquiredDefinitionIds.Contains(id) && !run.Inventory.HasWeapon(id);
    }

    public sealed class LevelUpChoiceApplier
    {
        private readonly Stage1GameplayDataRegistry registry; private readonly EvolutionService evolutions; public LevelUpChoiceApplier(Stage1GameplayDataRegistry value) { registry = value; evolutions = new EvolutionService(value); }
        public bool Accept(RunGameplayState run, LevelUpChoice choice) { if (choice.Kind == GameplayChoiceKind.Evolution) return evolutions.TryApply(run.Inventory, choice.DefinitionId); if (choice.Kind == GameplayChoiceKind.Weapon) { var definition = registry.GetWeapon(choice.DefinitionId); if (definition.IsEvolved) return false; var owned = run.Inventory.Weapons.Find(v => v.Id == definition.Id); if (owned != null) { if (owned.Level >= definition.MaxLevel) return false; owned.Level++; } else { if (run.Inventory.Weapons.Count >= run.Inventory.WeaponLimit) return false; run.Inventory.Weapons.Add(new WeaponRuntimeState { Id = definition.Id, Level = 1 }); } } else { var definition = registry.GetPassive(choice.DefinitionId); var owned = run.Inventory.Passives.Find(v => v.Id == definition.Id); if (owned != null) { if (owned.Level >= definition.MaxLevel) return false; owned.Level++; } else { if (run.Inventory.Passives.Count >= run.Inventory.PassiveLimit) return false; run.Inventory.Passives.Add(new PassiveRuntimeState { Id = definition.Id, Level = 1 }); } } run.AcquiredDefinitionIds.Add(choice.DefinitionId); run.NewlyDiscoveredIds.Add(choice.DefinitionId); return true; }
        public bool ReplaceInventorySlot(RunGameplayState run, LevelUpChoice choice, int slotIndex) { var candidate = run.Inventory.DeepCopy(); if (choice.Kind == GameplayChoiceKind.Weapon) { if (slotIndex < 0 || slotIndex >= candidate.Weapons.Count || registry.GetWeapon(choice.DefinitionId).IsEvolved) return false; candidate.Weapons.RemoveAt(slotIndex); candidate.Weapons.Add(new WeaponRuntimeState { Id = choice.DefinitionId, Level = 1 }); } else if (choice.Kind == GameplayChoiceKind.Passive) { if (slotIndex < 0 || slotIndex >= candidate.Passives.Count) return false; candidate.Passives.RemoveAt(slotIndex); candidate.Passives.Add(new PassiveRuntimeState { Id = choice.DefinitionId, Level = 1 }); } else return false; run.Inventory.ReplaceWith(candidate); run.AcquiredDefinitionIds.Add(choice.DefinitionId); run.NewlyDiscoveredIds.Add(choice.DefinitionId); return true; }
    }

    public enum RareAcquisitionResult { Acquired, Duplicate, Full, Invalid }
    public sealed class RareItemAcquisitionService { private readonly Stage1GameplayDataRegistry registry; public RareItemAcquisitionService(Stage1GameplayDataRegistry value) { registry = value; } public RareAcquisitionResult Acquire(RunGameplayState run, string id) { try { registry.GetRareItem(id); } catch { return RareAcquisitionResult.Invalid; } if (run.Inventory.HasRareItem(id)) return RareAcquisitionResult.Duplicate; if (run.Inventory.RareItems.Count >= run.Inventory.RareItemLimit) return RareAcquisitionResult.Full; run.Inventory.RareItems.Add(new RareItemRuntimeState { Id = id }); run.AcquiredDefinitionIds.Add(id); run.NewlyDiscoveredIds.Add(id); return RareAcquisitionResult.Acquired; } }

    public static class U47GameplayCandidateConfig { public const float RevivalHpRatio = .3f, RevivalInvulnerabilitySeconds = 1.25f, KokuyouMaxGauge = 100f, KokuyouChargePerAppliedDamage = 1f, KokuyouDamageMultiplier = 1.5f, KokuyouActiveSeconds = 8f, KokuyouEndingSeconds = .4f, KokuyouRecoverySeconds = 2f, KokuyouRecoveryMoveMultiplier = .75f; }
    public enum DamageOutcome { Applied, Revived, Defeated, Blocked }
    public sealed class PlayerDamageService
    {
        public DamageOutcome Apply(RunGameplayState run, float damage, bool paused) { if (paused || damage <= 0 || run.Player.RevivalInvulnerabilityRemaining > 0 || run.Player.IsDefeated) return DamageOutcome.Blocked; var applied = Math.Min(run.Player.CurrentHp, damage); run.Player.CurrentHp -= applied; ChargeKokuyou(run, applied); if (run.Player.CurrentHp > 0) return DamageOutcome.Applied; if (!run.RevivalUsed && run.Inventory.HasRareItem("dawn_ticket")) { run.Inventory.RareItems.RemoveAll(v => v.Id == "dawn_ticket"); run.RevivalUsed = true; run.RevivalUsedCount++; run.Player.CurrentHp = Math.Max(1, (float)Math.Floor(run.Player.MaxHp * U47GameplayCandidateConfig.RevivalHpRatio + .0001f)); run.Player.RevivalInvulnerabilityRemaining = U47GameplayCandidateConfig.RevivalInvulnerabilitySeconds; return DamageOutcome.Revived; } run.Player.IsDefeated = true; return DamageOutcome.Defeated; }
        private static void ChargeKokuyou(RunGameplayState run, float applied) { if (run.Kokuyou.Phase is KokuyouPhase.Active or KokuyouPhase.Activating or KokuyouPhase.Ending or KokuyouPhase.Recovery) return; run.Kokuyou.Gauge = Math.Min(U47GameplayCandidateConfig.KokuyouMaxGauge, run.Kokuyou.Gauge + applied * U47GameplayCandidateConfig.KokuyouChargePerAppliedDamage); run.Kokuyou.Phase = run.Kokuyou.Gauge >= U47GameplayCandidateConfig.KokuyouMaxGauge ? KokuyouPhase.Ready : KokuyouPhase.Charging; }
    }

    public sealed class KokuyouRuntimeController
    {
        public KokuyouActivationPolicy ActivationPolicy { get; } public KokuyouRuntimeController(KokuyouActivationPolicy policy = KokuyouActivationPolicy.Manual) { ActivationPolicy = policy; }
        public bool Activate(RunGameplayState run, bool paused) { if (paused || run.Kokuyou.Phase != KokuyouPhase.Ready) return false; run.Kokuyou.Phase = KokuyouPhase.Activating; run.Kokuyou.PhaseRemaining = .2f; run.Kokuyou.ActivationCount++; return true; }
        public void Tick(RunGameplayState run, float deltaTime, bool paused) { if (paused) return; if (ActivationPolicy == KokuyouActivationPolicy.ForcedWhenReady && run.Kokuyou.Phase == KokuyouPhase.Ready) Activate(run, false); if (run.Kokuyou.Phase is KokuyouPhase.Idle or KokuyouPhase.Charging or KokuyouPhase.Ready) return; run.Kokuyou.PhaseRemaining -= deltaTime; if (run.Kokuyou.PhaseRemaining > 0) return; switch (run.Kokuyou.Phase) { case KokuyouPhase.Activating: run.Kokuyou.Phase = KokuyouPhase.Active; run.Kokuyou.PhaseRemaining = U47GameplayCandidateConfig.KokuyouActiveSeconds; break; case KokuyouPhase.Active: run.Kokuyou.Phase = KokuyouPhase.Ending; run.Kokuyou.PhaseRemaining = U47GameplayCandidateConfig.KokuyouEndingSeconds; break; case KokuyouPhase.Ending: run.Kokuyou.Phase = KokuyouPhase.Recovery; run.Kokuyou.PhaseRemaining = U47GameplayCandidateConfig.KokuyouRecoverySeconds; run.Player.RecoverySlowRemaining = U47GameplayCandidateConfig.KokuyouRecoverySeconds; break; case KokuyouPhase.Recovery: run.Kokuyou.Reset(); run.Player.RecoverySlowRemaining = 0; break; } }
        public float DamageMultiplier(RunGameplayState run) => run.Kokuyou.Phase == KokuyouPhase.Active ? U47GameplayCandidateConfig.KokuyouDamageMultiplier : 1f;
    }
}
