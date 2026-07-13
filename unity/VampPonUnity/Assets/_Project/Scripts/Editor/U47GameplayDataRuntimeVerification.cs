#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using VampPon.UnitySpike.Runtime.Gameplay.State;

namespace VampPon.UnitySpike.Editor
{
    public static class U47GameplayDataRuntimeVerification
    {
        [MenuItem("VampPon/U47/Verify Gameplay Data Runtime")]
        public static void Verify()
        {
            var registry = AssetDatabase.LoadAssetAtPath<Stage1GameplayDataRegistry>("Assets/_Project/Resources/GameplayData/Stage1/Stage1GameplayDataRegistry.asset") ?? throw new Exception("Registry missing");
            var run = new RunGameplayState(registry); Check(run.Level == 1 && run.Inventory.Weapons.Single().Id == "night_pencil" && run.Inventory.Weapons[0].Level == 1, "initial state");
            Check(run.Inventory.WeaponLimit == 5 && run.Inventory.PassiveLimit == 5, "production default capacity remains 5/5");
            var verificationOptions = RunGameplayScenarioOptions.SimulatorFullSlotReplacement(registry);
            var verificationRun = new RunGameplayState(registry, verificationOptions);
            Check(verificationRun.Inventory.WeaponLimit == 2 && verificationRun.Inventory.PassiveLimit == 3, "Simulator scenario capacity is isolated 2/3");
            var verificationApplier = new LevelUpChoiceApplier(registry); var verificationCandidates = new LevelUpCandidateService(registry);
            Check(verificationApplier.Accept(verificationRun, new LevelUpChoice { Kind=GameplayChoiceKind.Weapon, DefinitionId="black_ink_bottle", NextLevel=1 }), "fill second distinct weapon");
            var replacementWeapon = FindChoice(verificationCandidates, verificationRun, GameplayChoiceKind.Weapon, "streetlamp_ring");
            Check(replacementWeapon.RequiresReplacement, "third distinct weapon requires replacement");
            Check(verificationApplier.ReplaceInventorySlot(verificationRun, replacementWeapon, 1), "weapon replacement accepted");
            Check(verificationRun.Inventory.Weapons.Select(v=>v.Id).SequenceEqual(new[]{"night_pencil","streetlamp_ring"}), "weapon replacement removes selected slot only");
            foreach(var id in new[]{"old_ticket","gold_compass","travel_badge"}) Check(verificationApplier.Accept(verificationRun,new LevelUpChoice{Kind=GameplayChoiceKind.Passive,DefinitionId=id,NextLevel=1}),"fill distinct passive "+id);
            var replacementPassive=FindChoice(verificationCandidates,verificationRun,GameplayChoiceKind.Passive,"white_margin");
            Check(replacementPassive.RequiresReplacement,"fourth distinct passive requires replacement");
            Check(verificationApplier.ReplaceInventorySlot(verificationRun,replacementPassive,1),"passive replacement accepted");
            Check(verificationRun.Inventory.Passives.Select(v=>v.Id).SequenceEqual(new[]{"old_ticket","travel_badge","white_margin"}),"passive replacement removes selected slot only");
            Check(verificationRun.Inventory.Weapons.Select(v=>v.Id).Distinct().Count()==verificationRun.Inventory.Weapons.Count && verificationRun.Inventory.Passives.Select(v=>v.Id).Distinct().Count()==verificationRun.Inventory.Passives.Count,"no duplicate IDs in scenario");
            Check(verificationRun.Inventory.Weapons.All(v=>registry.Weapons.Any(d=>d.Id==v.Id&&!d.IsEvolved)) && verificationRun.Inventory.Passives.All(v=>registry.Passives.Any(d=>d.Id==v.Id)),"no unknown or evolved direct injection");
            Check(registry.GetWeapon("night_pencil").MaxLevel == 7 && registry.GetWeapon("black_ink_bottle").MaxLevel == 7 && registry.GetWeapon("streetlamp_ring").MaxLevel == 7, "Web max levels");
            var candidateService = new LevelUpCandidateService(registry); var a = candidateService.CreateChoices(run, new SeededRandomSource(47)); var b = candidateService.CreateChoices(run, new SeededRandomSource(47));
            Check(a.Count == 3 && a.Select(v => v.DefinitionId).Distinct().Count() == 3 && string.Join(",", a.Select(v => v.DefinitionId)) == string.Join(",", b.Select(v => v.DefinitionId)), "deterministic unique choices");
            Check(a.All(v => v.DefinitionId != "dawn_ticket" && v.DefinitionId != "name_tag" && v.DefinitionId != "unforgotten_name" && v.DefinitionId != "dawn_ink_lamp"), "rare/evolved excluded");
            var rare = new RareItemAcquisitionService(registry); Check(rare.Acquire(run, "name_tag") == RareAcquisitionResult.Acquired && rare.Acquire(run, "name_tag") == RareAcquisitionResult.Duplicate, "rare duplicate"); Check(rare.Acquire(run, "dawn_ticket") == RareAcquisitionResult.Acquired && run.Inventory.RareItems.Count == 2, "rare limit");
            var evolution = new EvolutionService(registry); Check(!evolution.TryApply(run.Inventory, "unforgotten_name_awakening"), "awakening blocks below max"); run.Inventory.Weapons[0].Level = registry.GetWeapon("night_pencil").MaxLevel; Check(evolution.TryApply(run.Inventory, "unforgotten_name_awakening") && run.Inventory.HasWeapon("unforgotten_name") && !run.Inventory.HasRareItem("name_tag"), "awakening atomic success");
            run.Reset(registry); run.Inventory.Weapons.Add(new WeaponRuntimeState { Id = "black_ink_bottle", Level = 7 }); run.Inventory.Weapons.Add(new WeaponRuntimeState { Id = "streetlamp_ring", Level = 6 }); var before = run.Inventory.DeepCopy(); Check(!evolution.TryApply(run.Inventory, "dawn_ink_lamp_fusion") && run.Inventory.Weapons.Count == before.Weapons.Count, "fusion atomic failure"); run.Inventory.Weapons.Find(v => v.Id == "streetlamp_ring").Level = 7; Check(evolution.TryApply(run.Inventory, "dawn_ink_lamp_fusion") && run.Inventory.HasWeapon("dawn_ink_lamp") && !run.Inventory.HasWeapon("black_ink_bottle") && !run.Inventory.HasWeapon("streetlamp_ring"), "fusion success");
            run.Reset(registry); rare.Acquire(run, "dawn_ticket"); var damage = new PlayerDamageService(); Check(damage.Apply(run, run.Player.MaxHp * 2, false) == DamageOutcome.Revived && run.Player.CurrentHp == 33 && !run.Inventory.HasRareItem("dawn_ticket"), "30 percent revival"); run.Player.RevivalInvulnerabilityRemaining = 0; Check(damage.Apply(run, run.Player.MaxHp * 2, false) == DamageOutcome.Defeated, "second lethal fails");
            run.Reset(registry); Check(run.Kokuyou.Gauge == 0 && run.Kokuyou.Phase == KokuyouPhase.Idle, "kokuyou reset"); damage.Apply(run, 100, false); Check(run.Kokuyou.Phase == KokuyouPhase.Ready, "damage charge ready"); var kokuyou = new KokuyouRuntimeController(); Check(kokuyou.ActivationPolicy == KokuyouActivationPolicy.Manual && kokuyou.Activate(run, false), "manual default"); kokuyou.Tick(run, .2f, false); Check(run.Kokuyou.Phase == KokuyouPhase.Active && kokuyou.DamageMultiplier(run) == 1.5f, "active multiplier"); var remaining = run.Kokuyou.PhaseRemaining; kokuyou.Tick(run, 1f, true); Check(run.Kokuyou.PhaseRemaining == remaining, "pause safe"); kokuyou.Tick(run, 8f, false); kokuyou.Tick(run, .4f, false); Check(run.Kokuyou.Phase == KokuyouPhase.Recovery && run.Player.RecoverySlowRemaining > 0, "recovery slow"); kokuyou.Tick(run, 2f, false); Check(run.Kokuyou.Phase == KokuyouPhase.Idle, "normal return");
            run.AddExperience(100); Check(run.Level > 2 && run.PendingLevelUps > 1, "overflow queued levelups"); run.Reset(registry); Check(run.Level == 1 && run.CurrentExp == 0 && run.Inventory.Weapons.Single().Id == "night_pencil" && !run.RevivalUsed && run.Kokuyou.Gauge == 0, "retry reset");
            var root = Path.GetFullPath(Path.Combine(Application.dataPath, "../../../")); var output = Path.Combine(root, "docs/design-targets/generated/unity-u47"); Directory.CreateDirectory(output); File.WriteAllText(Path.Combine(output, "levelup-runtime-result.json"), Result("levelup", true)); File.WriteAllText(Path.Combine(output, "rare-evolution-result.json"), Result("rare-evolution", true)); File.WriteAllText(Path.Combine(output, "revival-result.json"), Result("revival", true)); File.WriteAllText(Path.Combine(output, "kokuyou-result.json"), Result("kokuyou", true)); File.WriteAllText(Path.Combine(output, "weapon-runtime-result.json"), Result("weapon-runtime-logic", true)); File.WriteAllText(Path.Combine(output, "passive-runtime-result.json"), Result("passive-runtime-logic", true)); AssetDatabase.Refresh(); Debug.Log("U47 gameplay data/runtime verification passed.");
        }
        private static LevelUpChoice FindChoice(LevelUpCandidateService service, RunGameplayState run, GameplayChoiceKind kind, string id) { for(var seed=0;seed<500;seed++){var value=service.CreateChoices(run,new SeededRandomSource(seed)).FirstOrDefault(v=>v.Kind==kind&&v.DefinitionId==id);if(value!=null)return value;}throw new Exception("Candidate not found: "+id); }
        private static string Result(string scope, bool passed) => $"{{\n  \"schemaVersion\": 1,\n  \"scope\": \"{scope}\",\n  \"passed\": {passed.ToString().ToLowerInvariant()}\n}}\n";
        private static void Check(bool condition, string name) { if (!condition) throw new Exception("U47 verification failed: " + name); }
    }
}
#endif
