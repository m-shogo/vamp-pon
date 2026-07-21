using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using VampPon.UnitySpike.Runtime.Gameplay.State;

namespace VampPon.UnitySpike.Runtime.Gameplay
{
    public sealed class Stage1GameplayRuntimeCoordinator : MonoBehaviour
    {
        private sealed class Area { public Vector3 Center; public float Radius, DamagePerSecond, Remaining, Duration, Tick; public int TickCount, HitCount; public string WeaponId; public U47GroundAreaActor Actor; }
        private readonly List<Area> areas = new(); private readonly List<U47GroundAreaActor> areaPool = new(); private Stage1GameplayDataRegistry registry; private U2BattleController battle; private PlayerController player;
        private GameplayStatCalculator statCalculator; private KokuyouRuntimeController kokuyou; private bool runtimePaused = true;
        private RunGameplayScenarioOptions scenarioOptions;
        public RunGameplayState Run { get; private set; } public LevelUpCandidateService CandidateService { get; private set; } public LevelUpChoiceApplier ChoiceApplier { get; private set; }
        public RareItemAcquisitionService RareItems { get; private set; } public PlayerDamageService Damage { get; private set; }
        public Stage1GameplayDataRegistry Registry => registry;
        public event Action RuntimeChanged;
        public event Action LevelUpRequested;

        public void Initialize(U2BattleController battleController, PlayerController playerController)
        {
            registry = Resources.Load<Stage1GameplayDataRegistry>("GameplayData/Stage1/Stage1GameplayDataRegistry") ?? throw new InvalidOperationException("U47 Stage1GameplayDataRegistry is required. Run the U47 importer.");
            battle = battleController; player = playerController; statCalculator = new GameplayStatCalculator(); kokuyou = new KokuyouRuntimeController(); CandidateService = new LevelUpCandidateService(registry); ChoiceApplier = new LevelUpChoiceApplier(registry); RareItems = new RareItemAcquisitionService(registry); Damage = new PlayerDamageService();
            scenarioOptions=RunGameplayScenarioOptions.Production(registry); Run = new RunGameplayState(registry, scenarioOptions); Run.Changed += OnRunChanged; statCalculator.Recalculate(Run, registry); battle.SetGameplayRuntimeConnected(true); battle.ExperienceCollected += OnExperienceCollected; for (var i=0;i<10;i++) areaPool.Add(U47GroundAreaActor.Create(battle.transform, battle.ExistingInkCandidateSprite, i)); ApplyPlayerStats();
        }

        public void SetRuntimePaused(bool paused) => runtimePaused = paused;
        public void ResetRun() { foreach (var area in areaPool) area.Deactivate(); areas.Clear();
#if VAMPPON_AI_SIMULATOR_SMOKE
            lastCompletedArea=null;verificationArea=null;verificationSuppressWeaponSpawns=false;
#endif
            Run.Reset(registry, scenarioOptions); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); RuntimeChanged?.Invoke(); }
        public bool ActivateKokuyou() { var activated = kokuyou.Activate(Run, runtimePaused); if (activated) U43RuntimeFeedbackBridge.Instance?.PlayKokuyou(); return activated; }
        public DamageOutcome ApplyPlayerDamage(float amount) { var before = Run.Kokuyou.Phase; var result = Damage.Apply(Run, amount, runtimePaused); if (result != DamageOutcome.Blocked) U43RuntimeFeedbackBridge.Instance?.PlayPlayerDamage(); if (before != KokuyouPhase.Ready && Run.Kokuyou.Phase == KokuyouPhase.Ready) U43RuntimeFeedbackBridge.Instance?.PlayKokuyouReady(); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); return result; }
        private void OnDestroy() { if (battle != null) battle.ExperienceCollected -= OnExperienceCollected; if (Run != null) Run.Changed -= OnRunChanged; }
        private void OnRunChanged() => RuntimeChanged?.Invoke();
        public List<LevelUpChoice> CreateLevelUpChoices(int seed) => CandidateService.CreateChoices(Run, new SeededRandomSource(seed));
        public bool AcceptChoice(LevelUpChoice choice) { var accepted = ChoiceApplier.Accept(Run, choice); if (accepted) { statCalculator.Recalculate(Run, registry); Run.NotifyChanged(); } return accepted; }
        public bool ReplaceInventorySlot(LevelUpChoice choice, int slot) { var accepted = ChoiceApplier.ReplaceInventorySlot(Run, choice, slot); if (accepted) { statCalculator.Recalculate(Run, registry); Run.NotifyChanged(); } return accepted; }
        public void DeclineChoice() { Run.ConsumePendingLevelUp(); Run.NotifyChanged(); }
#if VAMPPON_AI_SIMULATOR_SMOKE
        internal void BeginVerificationScenario(RunGameplayScenarioOptions options) { scenarioOptions=options??throw new ArgumentNullException(nameof(options)); ResetRun(); }
        internal void EndVerificationScenario() { scenarioOptions=RunGameplayScenarioOptions.Production(registry); ResetRun(); }
        internal GroundAreaVerificationState BeginGroundAreaVerification(string weaponId, Vector3 center)
        {
            verificationSuppressWeaponSpawns=true;
            var owned=Run.Inventory.Weapons.Find(v=>v.Id==weaponId)??throw new InvalidOperationException("Owned ground-area weapon required: "+weaponId);
            var definition=registry.GetWeapon(weaponId);if(definition.EffectType!=WeaponEffectType.GroundArea)throw new InvalidOperationException("GroundArea executor required: "+weaponId);
            var effect=ResolveEffect(definition,owned.Level);var actor=areaPool.Find(v=>!v.IsActive)??throw new InvalidOperationException("Ground-area pool exhausted.");var radius=effect.radius/100f;actor.Activate(weaponId,center,radius);
            var area=new Area{Center=center,Radius=radius,DamagePerSecond=effect.damagePerSecond,Remaining=effect.duration,Duration=effect.duration,Tick=0,WeaponId=weaponId,Actor=actor};areas.Add(area);verificationArea=area;return Snapshot(area,false);
        }
        internal GroundAreaVerificationState GetGroundAreaVerification(string weaponId)
        {
            var area=verificationArea?.WeaponId==weaponId?verificationArea:null;return area!=null&&areas.Contains(area)?Snapshot(area,false):lastCompletedArea?.WeaponId==weaponId?Snapshot(lastCompletedArea,true):null;
        }
        private Area lastCompletedArea,verificationArea;private bool verificationSuppressWeaponSpawns;
        private static GroundAreaVerificationState Snapshot(Area area,bool despawned)=>new(){DefinitionId=area.WeaponId,ExecutorType="GroundArea",WorldPosition=area.Center,Radius=area.Radius,DamagePerSecond=area.DamagePerSecond,Duration=area.Duration,TickInterval=.25f,TickCount=area.TickCount,HitCount=area.HitCount,ActorVisible=!despawned&&area.Actor!=null&&area.Actor.RendererVisible,ActorSortingOrder=area.Actor!=null?area.Actor.SortingOrder:0,ActorWorldBounds=area.Actor!=null?area.Actor.WorldBounds:new Bounds(),Despawned=despawned};
#endif
        private void OnExperienceCollected(int amount) { if (Run.AddExperience((int)Math.Ceiling(amount * Run.Player.EffectiveXpMultiplier)) > 0) LevelUpRequested?.Invoke(); }

        private void Update()
        {
            if (Run == null || runtimePaused) return; var dt = Time.deltaTime; if (Run.Player.RevivalInvulnerabilityRemaining > 0) Run.Player.RevivalInvulnerabilityRemaining = Mathf.Max(0, Run.Player.RevivalInvulnerabilityRemaining - dt); if (Run.Player.RecoverySlowRemaining > 0) Run.Player.RecoverySlowRemaining = Mathf.Max(0, Run.Player.RecoverySlowRemaining - dt);
            var previousKokuyouPhase = Run.Kokuyou.Phase; kokuyou.Tick(Run, dt, false); if (previousKokuyouPhase == KokuyouPhase.Active && Run.Kokuyou.Phase == KokuyouPhase.Ending) U43RuntimeFeedbackBridge.Instance?.PlayKokuyouEnding(); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); TickWeapons(dt); TickAreas(dt);
        }

        private void TickWeapons(float dt)
        {
#if VAMPPON_AI_SIMULATOR_SMOKE
            if(verificationSuppressWeaponSpawns)return;
#endif
            foreach (var owned in Run.Inventory.Weapons) { owned.CooldownRemaining -= dt; if (owned.CooldownRemaining > 0) continue; var definition = registry.GetWeapon(owned.Id); var effect = ResolveEffect(definition, owned.Level); var cooldown = Mathf.Max(.05f, effect.cooldown * Run.Player.EffectiveCooldownMultiplier); owned.CooldownRemaining = cooldown; var damageMultiplier = Run.Player.EffectiveMight * kokuyou.DamageMultiplier(Run); if (definition.EffectType == WeaponEffectType.Projectile) { for (var i = 0; i < Math.Max(1, effect.projectiles); i++) battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce); } else if (battle.TryGetNearestEnemyPosition(out var center) && CountAreas(owned.Id) < Math.Max(1, effect.maxAreas)) { var actor = areaPool.Find(v => !v.IsActive); if (actor == null) continue; var radius = effect.radius / 100f; actor.Activate(owned.Id, center, radius); areas.Add(new Area { Center = center, Radius = radius, DamagePerSecond = effect.damagePerSecond * damageMultiplier, Remaining = effect.duration, Tick = 0, WeaponId = owned.Id, Actor = actor }); } }
        }

        private void TickAreas(float dt) { for (var i = areas.Count - 1; i >= 0; i--) { var area = areas[i]; area.Remaining -= dt; area.Tick -= dt; if (area.Tick <= 0) { const float interval = .25f; area.HitCount+=battle.DamageEnemiesInRadius(area.Center, area.Radius, area.DamagePerSecond * interval);area.TickCount++; area.Tick = interval; } if (area.Remaining <= 0) { area.Actor?.Deactivate();
#if VAMPPON_AI_SIMULATOR_SMOKE
                    lastCompletedArea=area;
#endif
                    areas.RemoveAt(i); } } }
        private int CountAreas(string id) => areas.FindAll(v => v.WeaponId == id).Count;
        private void ApplyPlayerStats() => player.SetGameplayMoveSpeedMultiplier(Run.Player.EffectiveMoveSpeed / Mathf.Max(.01f, Run.Player.BaseMoveSpeed));
        private static WeaponLevelDefinition ResolveEffect(WeaponDefinition definition, int level) { var result = new WeaponLevelDefinition(); for (var i = 0; i < Math.Clamp(level, 1, definition.MaxLevel); i++) { var value = definition.Levels[i]; if (i == 0) { result.damage = value.damage; result.damagePerSecond = value.damagePerSecond; result.projectiles = value.projectiles; result.cooldown = value.cooldown; result.pierce = value.pierce; result.duration = value.duration; result.radius = value.radius; result.maxAreas = value.maxAreas; result.targeting = value.targeting; } result.damage += value.damageAdd; result.damagePerSecond += value.damagePerSecondAdd; result.projectiles += value.projectilesAdd; result.pierce += value.pierceAdd; result.duration += value.durationAdd; result.radius += value.radiusAdd; result.maxAreas += value.maxAreasAdd; result.cooldown *= value.cooldownMultiplier == 0 ? 1 : value.cooldownMultiplier; result.duration *= value.durationMultiplier == 0 ? 1 : value.durationMultiplier; } return result; }
    }

#if VAMPPON_AI_SIMULATOR_SMOKE
    public sealed class GroundAreaVerificationState { public string DefinitionId,ExecutorType;public Vector3 WorldPosition;public float Radius,DamagePerSecond,Duration,TickInterval;public int TickCount,HitCount,ActorSortingOrder;public bool ActorVisible,Despawned;public Bounds ActorWorldBounds; }
#endif
}
