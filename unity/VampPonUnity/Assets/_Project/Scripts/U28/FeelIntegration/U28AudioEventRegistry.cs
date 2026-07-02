using System;
using System.Collections.Generic;

namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28AudioEventRegistry
    {
        public const string DraftSeRoot = "Assets/_Project/Audio/U28DraftSe";
        private readonly Dictionary<U28AudioEventId, U28AudioEventDefinition> definitions = new();

        public U28AudioEventRegistry()
        {
            Add(U28AudioEventId.BattleStart, U28AudioCategory.Battle, U28AudioPriority.Normal, 0.46f, 0.20f, 1, U28HapticEventId.LightTap, "vp_battle_start_soft.wav", "draft placeholder; final battle start SE later");
            Add(U28AudioEventId.PlayerHit, U28AudioCategory.Battle, U28AudioPriority.Low, 0.34f, 0.08f, 3, U28HapticEventId.None, "vp_enemy_hit_soft.wav", "shared soft hit placeholder");
            Add(U28AudioEventId.PlayerDamage, U28AudioCategory.Battle, U28AudioPriority.High, 0.52f, 0.22f, 1, U28HapticEventId.Damage, "vp_player_damage_mute.wav", "muted damage draft");
            Add(U28AudioEventId.EnemyHitSoft, U28AudioCategory.Battle, U28AudioPriority.Low, 0.30f, 0.06f, 4, U28HapticEventId.None, "vp_enemy_hit_soft.wav", "soft hit draft, no constant haptic");
            Add(U28AudioEventId.EnemyDefeatInk, U28AudioCategory.Battle, U28AudioPriority.Normal, 0.42f, 0.12f, 2, U28HapticEventId.LightTap, "vp_enemy_defeat_ink.wav", "ink defeat draft");
            Add(U28AudioEventId.PickupXp, U28AudioCategory.Pickup, U28AudioPriority.Low, 0.28f, 0.05f, 4, U28HapticEventId.None, "vp_pickup_xp_soft.wav", "small pickup draft");
            Add(U28AudioEventId.PickupHeal, U28AudioCategory.Pickup, U28AudioPriority.Normal, 0.38f, 0.12f, 2, U28HapticEventId.SoftPickup, "vp_pickup_heal_warm.wav", "warm pickup draft");
            Add(U28AudioEventId.PickupRare, U28AudioCategory.Pickup, U28AudioPriority.High, 0.54f, 0.32f, 1, U28HapticEventId.RarePulse, "vp_pickup_rare_seal.wav", "rare pickup draft");
            Add(U28AudioEventId.WeaponFireSoft, U28AudioCategory.Battle, U28AudioPriority.Low, 0.22f, 0.05f, 3, U28HapticEventId.None, "vp_weapon_fire_soft.wav", "soft weapon draft");
            Add(U28AudioEventId.LevelupReady, U28AudioCategory.Ui, U28AudioPriority.Normal, 0.42f, 0.22f, 1, U28HapticEventId.LightTap, "vp_levelup_open_paper.wav", "level ready draft");
            Add(U28AudioEventId.LevelupOpen, U28AudioCategory.Ui, U28AudioPriority.High, 0.50f, 0.30f, 1, U28HapticEventId.LightTap, "vp_levelup_open_paper.wav", "paper levelup draft");
            Add(U28AudioEventId.CardHover, U28AudioCategory.Ui, U28AudioPriority.Low, 0.18f, 0.10f, 1, U28HapticEventId.None, "vp_card_select_ink.wav", "optional hover draft");
            Add(U28AudioEventId.CardSelect, U28AudioCategory.Ui, U28AudioPriority.Normal, 0.36f, 0.12f, 1, U28HapticEventId.CardSelect, "vp_card_select_ink.wav", "paper ink card draft");
            Add(U28AudioEventId.CardConfirm, U28AudioCategory.Ui, U28AudioPriority.Normal, 0.42f, 0.20f, 1, U28HapticEventId.CardSelect, "vp_card_confirm.wav", "card confirm draft");
            Add(U28AudioEventId.RareSealPulse, U28AudioCategory.Climax, U28AudioPriority.High, 0.62f, 0.45f, 1, U28HapticEventId.RarePulse, "vp_pickup_rare_seal.wav", "rare seal draft");
            Add(U28AudioEventId.EvolutionConvergence, U28AudioCategory.Climax, U28AudioPriority.High, 0.60f, 0.55f, 1, U28HapticEventId.LightTap, "vp_evolution_convergence.wav", "evolution converge draft");
            Add(U28AudioEventId.EvolutionComplete, U28AudioCategory.Climax, U28AudioPriority.Critical, 0.70f, 0.75f, 1, U28HapticEventId.EvolutionComplete, "vp_evolution_complete.wav", "evolution complete draft");
            Add(U28AudioEventId.KokuyouGaugeReady, U28AudioCategory.Climax, U28AudioPriority.High, 0.58f, 0.60f, 1, U28HapticEventId.KokuyouReady, "vp_kokuyou_ready.wav", "dark ready draft");
            Add(U28AudioEventId.KokuyouActivation, U28AudioCategory.Climax, U28AudioPriority.Critical, 0.74f, 1.00f, 1, U28HapticEventId.KokuyouActivation, "vp_kokuyou_activation.wav", "dark activation draft");
            Add(U28AudioEventId.KokuyouActiveLoop, U28AudioCategory.Climax, U28AudioPriority.Normal, 0.30f, 2.00f, 1, U28HapticEventId.None, "vp_kokuyou_ready.wav", "optional loop placeholder, not final loop");
            Add(U28AudioEventId.KokuyouEnding, U28AudioCategory.Climax, U28AudioPriority.High, 0.56f, 0.60f, 1, U28HapticEventId.LightTap, "vp_kokuyou_ending.wav", "dark ending draft");
            Add(U28AudioEventId.ResultOpen, U28AudioCategory.Result, U28AudioPriority.Normal, 0.34f, 0.20f, 1, U28HapticEventId.None, "vp_reward_card.wav", "result open draft");
            Add(U28AudioEventId.ResultStamp, U28AudioCategory.Result, U28AudioPriority.High, 0.58f, 0.35f, 1, U28HapticEventId.ResultStamp, "vp_result_stamp.wav", "paper stamp draft");
            Add(U28AudioEventId.RewardCard, U28AudioCategory.Result, U28AudioPriority.Normal, 0.42f, 0.14f, 2, U28HapticEventId.LightTap, "vp_reward_card.wav", "reward card draft");
            Add(U28AudioEventId.UnlockReveal, U28AudioCategory.Result, U28AudioPriority.High, 0.54f, 0.30f, 1, U28HapticEventId.UnlockReveal, "vp_unlock_reveal.wav", "warm unlock draft");
            Add(U28AudioEventId.StageSelectLantern, U28AudioCategory.StageSelect, U28AudioPriority.Normal, 0.34f, 0.25f, 1, U28HapticEventId.LightTap, "vp_stage_lantern.wav", "small lantern draft");
            Add(U28AudioEventId.StageRouteUnlock, U28AudioCategory.StageSelect, U28AudioPriority.Normal, 0.42f, 0.35f, 1, U28HapticEventId.UnlockReveal, "vp_stage_route_unlock.wav", "route unlock draft");
            Add(U28AudioEventId.RetryConfirm, U28AudioCategory.Ui, U28AudioPriority.Normal, 0.36f, 0.18f, 1, U28HapticEventId.LightTap, "vp_retry_confirm.wav", "retry confirm draft");
        }

        public IReadOnlyCollection<U28AudioEventDefinition> All => definitions.Values;
        public U28AudioEventDefinition Get(U28AudioEventId id) => definitions.TryGetValue(id, out var definition) ? definition : throw new ArgumentOutOfRangeException(nameof(id), id, "Unknown U28 audio event");

        private void Add(U28AudioEventId id, U28AudioCategory category, U28AudioPriority priority, float volume, float cooldown, int polyphony, U28HapticEventId haptic, string clipFileName, string note)
        {
            definitions[id] = new U28AudioEventDefinition(id, category, priority, volume, cooldown, polyphony, haptic, clipFileName, note);
        }
    }
}
