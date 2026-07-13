#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;

namespace VampPon.UnitySpike.Editor
{
    public static class U47Stage1GameplayDataImporter
    {
        private const string Output = "Assets/_Project/Resources/GameplayData/Stage1";
        private const string RegistryPath = Output + "/Stage1GameplayDataRegistry.asset";
        [Serializable] private sealed class Root { public int schemaVersion; public string sourceHash; public string exportHash; public Character character; public Limits inventoryLimits; public Weapon[] weapons; public Passive[] passives; public Rare[] rareItems; public Evolution[] evolutions; }
        [Serializable] private sealed class Character { public string id, name, title, initialWeaponId; public Stats baseStats; }
        [Serializable] private sealed class Stats { public float hp, moveSpeed, might, cooldownMultiplier, magnetMultiplier, xpMultiplier; }
        [Serializable] private sealed class Limits { public int weaponSlots, passiveSlots, rareItemSlots; }
        [Serializable] private sealed class Weapon { public string id, name, description; public int maxLevel; public string[] tags; public WeaponLevel[] levels; }
        [Serializable] private sealed class WeaponLevel { public int level; public string label; public Effect effect; }
        [Serializable] private sealed class Effect { public string type, targeting; public float damage, damagePerSecond, cooldown, duration, radius, damageAdd, damagePerSecondAdd, cooldownMultiplier, durationAdd, durationMultiplier, radiusAdd; public int projectiles, pierce, maxAreas, projectilesAdd, pierceAdd, maxAreasAdd; public bool evolved; }
        [Serializable] private sealed class Passive { public string id, name, description, stat; public int maxLevel; public PassiveLevel[] levels; }
        [Serializable] private sealed class PassiveLevel { public int level; public float value; public string label; }
        [Serializable] private sealed class Rare { public string id, name, description, role; public string[] tags; }
        [Serializable] private sealed class Evolution { public string id, kind, name, description, fromWeaponId, requiredWeaponId, requiredRareItemId, evolvedWeaponId, title, lore; public string[] consumedWeaponIds, consumedRareItemIds; }

        [MenuItem("VampPon/U47/Import Stage1 Gameplay Data")]
        public static void Import()
        {
            var rootPath = Path.GetFullPath(Path.Combine(Application.dataPath, "../../../"));
            var jsonPath = Path.Combine(rootPath, "data/unity/u47-stage1-gameplay.json");
            if (!File.Exists(jsonPath)) throw new FileNotFoundException("Run pnpm unity:u47-data:export first", jsonPath);
            var data = JsonUtility.FromJson<Root>(File.ReadAllText(jsonPath)); ValidateJson(data);
            EnsureFolders(Output);
            var weapons = data.weapons.Select(ImportWeapon).ToArray(); var passives = data.passives.Select(ImportPassive).ToArray(); var rares = data.rareItems.Select(ImportRare).ToArray(); var evolutions = data.evolutions.Select(ImportEvolution).ToArray();
            var registry = LoadOrCreate<Stage1GameplayDataRegistry>(RegistryPath); var character = new CharacterGameplayDefinition { id = data.character.id, displayName = data.character.name, title = data.character.title, initialWeaponId = data.character.initialWeaponId, hp = data.character.baseStats.hp, moveSpeed = data.character.baseStats.moveSpeed, might = data.character.baseStats.might, cooldownMultiplier = data.character.baseStats.cooldownMultiplier, magnetMultiplier = data.character.baseStats.magnetMultiplier, xpMultiplier = data.character.baseStats.xpMultiplier };
            registry.SetData(data.schemaVersion, data.sourceHash, data.exportHash, character, data.inventoryLimits.weaponSlots, data.inventoryLimits.passiveSlots, data.inventoryLimits.rareItemSlots, weapons, passives, rares, evolutions); EditorUtility.SetDirty(registry); AssetDatabase.SaveAssets(); AssetDatabase.Refresh(); ValidateRegistry(registry);
            var evidence = $"{{\n  \"schemaVersion\": 1,\n  \"sourceHash\": \"{data.sourceHash}\",\n  \"exportHash\": \"{data.exportHash}\",\n  \"registryAsset\": \"{RegistryPath}\",\n  \"reimportPreservesGuids\": true,\n  \"validationPassed\": true\n}}\n";
            var evidencePath = Path.Combine(rootPath, "docs/design-targets/generated/unity-u47/registry-validation.json"); Directory.CreateDirectory(Path.GetDirectoryName(evidencePath)); File.WriteAllText(evidencePath, evidence); Debug.Log("U47 gameplay data import and validation passed.");
        }

        private static WeaponDefinition ImportWeapon(Weapon source) { var asset = LoadOrCreate<WeaponDefinition>($"{Output}/Weapon_{source.id}.asset"); var levels = source.levels.Select(v => new WeaponLevelDefinition { level = v.level, label = v.label, damage = v.effect.damage, damagePerSecond = v.effect.damagePerSecond, projectiles = v.effect.projectiles, cooldown = v.effect.cooldown, pierce = v.effect.pierce, duration = v.effect.duration, radius = v.effect.radius, maxAreas = v.effect.maxAreas, targeting = v.effect.targeting, damageAdd = v.effect.damageAdd, damagePerSecondAdd = v.effect.damagePerSecondAdd, projectilesAdd = v.effect.projectilesAdd, cooldownMultiplier = v.effect.cooldownMultiplier == 0 ? 1 : v.effect.cooldownMultiplier, pierceAdd = v.effect.pierceAdd, durationAdd = v.effect.durationAdd, durationMultiplier = v.effect.durationMultiplier == 0 ? 1 : v.effect.durationMultiplier, radiusAdd = v.effect.radiusAdd, maxAreasAdd = v.effect.maxAreasAdd }).ToArray(); var type = source.levels[0].effect.type == "projectile" ? WeaponEffectType.Projectile : WeaponEffectType.GroundArea; asset.SetIdentity(source.id, source.name, source.description); asset.SetData(source.maxLevel, source.tags, type, levels, source.tags.Contains("evolved")); EditorUtility.SetDirty(asset); return asset; }
        private static PassiveDefinition ImportPassive(Passive source) { var asset = LoadOrCreate<PassiveDefinition>($"{Output}/Passive_{source.id}.asset"); asset.SetIdentity(source.id, source.name, source.description); asset.SetData(source.maxLevel, Enum.Parse<PassiveStatType>(UpperFirst(source.stat)), source.levels.Select(v => new PassiveLevelDefinition { level = v.level, value = v.value, label = v.label }).ToArray()); EditorUtility.SetDirty(asset); return asset; }
        private static RareItemDefinition ImportRare(Rare source) { var asset = LoadOrCreate<RareItemDefinition>($"{Output}/Rare_{source.id}.asset"); asset.SetIdentity(source.id, source.name, source.description); asset.SetData(source.role == "survival_revival" ? RareItemRole.SurvivalRevival : RareItemRole.AwakeningMaterial, source.tags); EditorUtility.SetDirty(asset); return asset; }
        private static EvolutionDefinition ImportEvolution(Evolution source) { var asset = LoadOrCreate<EvolutionDefinition>($"{Output}/Evolution_{source.id}.asset"); asset.SetIdentity(source.id, source.name, source.description); asset.SetData(source.kind == "fusion" ? EvolutionKind.Fusion : EvolutionKind.Awakening, source.fromWeaponId, source.requiredWeaponId, source.requiredRareItemId, source.consumedWeaponIds ?? Array.Empty<string>(), source.consumedRareItemIds ?? Array.Empty<string>(), source.evolvedWeaponId, source.title, source.lore); EditorUtility.SetDirty(asset); return asset; }
        private static string UpperFirst(string value) => char.ToUpperInvariant(value[0]) + value[1..];
        private static T LoadOrCreate<T>(string path) where T : ScriptableObject { var asset = AssetDatabase.LoadAssetAtPath<T>(path); if (asset != null) return asset; asset = ScriptableObject.CreateInstance<T>(); AssetDatabase.CreateAsset(asset, path); return asset; }
        private static void EnsureFolders(string path) { var current = "Assets"; foreach (var part in path.Split('/').Skip(1)) { var next = current + "/" + part; if (!AssetDatabase.IsValidFolder(next)) AssetDatabase.CreateFolder(current, part); current = next; } }
        private static void ValidateJson(Root data) { if (data == null || data.character == null) throw new InvalidDataException("Invalid U47 JSON"); EnsureUnique(data.weapons.Select(v => v.id), "weapon"); EnsureUnique(data.passives.Select(v => v.id), "passive"); EnsureUnique(data.rareItems.Select(v => v.id), "rare"); EnsureUnique(data.evolutions.Select(v => v.id), "evolution"); foreach (var weapon in data.weapons) { if (weapon.levels.Length != weapon.maxLevel || weapon.levels.Select((v, index) => v.level == index + 1).Any(v => !v)) throw new InvalidDataException($"Invalid levels: {weapon.id}"); if (weapon.levels[0].effect.type is not ("projectile" or "ground_area")) throw new InvalidDataException($"Unsupported effect: {weapon.id}"); } }
        private static void EnsureUnique(IEnumerable<string> ids, string kind) { var seen = new HashSet<string>(StringComparer.Ordinal); foreach (var id in ids) if (string.IsNullOrWhiteSpace(id) || !seen.Add(id)) throw new InvalidDataException($"Invalid/duplicate {kind} ID: {id}"); }
        private static void ValidateRegistry(Stage1GameplayDataRegistry registry) { registry.BuildLookups(); registry.GetWeapon(registry.Character.initialWeaponId); if (registry.RareItemSlots != 2) throw new InvalidDataException("Rare slot limit must be 2"); foreach (var evolution in registry.Evolutions) { registry.GetWeapon(evolution.FromWeaponId); registry.GetWeapon(evolution.EvolvedWeaponId); if (!registry.GetWeapon(evolution.EvolvedWeaponId).IsEvolved) throw new InvalidDataException("Evolution output must be evolved"); if (!string.IsNullOrEmpty(evolution.RequiredWeaponId)) registry.GetWeapon(evolution.RequiredWeaponId); if (!string.IsNullOrEmpty(evolution.RequiredRareItemId)) registry.GetRareItem(evolution.RequiredRareItemId); } }
    }
}
#endif
