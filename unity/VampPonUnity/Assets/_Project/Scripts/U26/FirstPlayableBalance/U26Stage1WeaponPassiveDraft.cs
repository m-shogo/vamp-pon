using System.Collections.Generic;

namespace VampPon.UnitySpike.U26.FirstPlayableBalance
{
    public sealed class U26Stage1WeaponPassiveDraft
    {
        public string InitialWeapon => "spirit_lantern";
        public IReadOnlyList<string> WeaponChoices { get; } = new[] { "spirit_lantern", "paper_fan", "seal_orbit" };
        public IReadOnlyList<string> PassiveChoices { get; } = new[] { "move_speed", "pickup_range", "damage_guard" };
        public int EvolutionRequiredWeaponLevel => 5;
        public string EvolutionRequiredPassive => "pickup_range";

        public bool CanDraftEvolution(int elapsedSecond, int weaponLevel, bool hasPassive, bool hasMaterial)
        {
            return elapsedSecond >= U26Stage1BalanceConstants.EvolutionEarliestSeconds
                && weaponLevel >= EvolutionRequiredWeaponLevel
                && hasPassive
                && hasMaterial;
        }
    }
}
