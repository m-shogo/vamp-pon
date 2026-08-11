export const u47SimulatorEvidenceSourceFiles = [
  'scripts/unity/u47-simulator-capture-catalog.ts',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U47AiSimulatorSmokeBridge.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/U47GroundAreaActor.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/GameplayServices.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/State/RunGameplayState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpDemoController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Result/RunResultViewModelBuilder.cs',
] as const;

export function normalizeU47SimulatorEvidenceSource(file: string, source: Buffer): Buffer {
  let normalized = source.toString('utf8');
  if (file.endsWith('Stage1GameplayRuntimeCoordinator.cs')) normalized = normalized
      .replace('public bool ActivateKokuyou() { var activated = kokuyou.Activate(Run, runtimePaused); if (activated) U43RuntimeFeedbackBridge.Instance?.PlayKokuyou(); return activated; }','public bool ActivateKokuyou() => kokuyou.Activate(Run, runtimePaused);')
      .replace('public DamageOutcome ApplyPlayerDamage(float amount) { var before = Run.Kokuyou.Phase; var result = Damage.Apply(Run, amount, runtimePaused); if (result != DamageOutcome.Blocked) U43RuntimeFeedbackBridge.Instance?.PlayPlayerDamage(); if (before != KokuyouPhase.Ready && Run.Kokuyou.Phase == KokuyouPhase.Ready) U43RuntimeFeedbackBridge.Instance?.PlayKokuyouReady(); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); return result; }','public DamageOutcome ApplyPlayerDamage(float amount) { var result = Damage.Apply(Run, amount, runtimePaused); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); return result; }')
      .replace('var previousKokuyouPhase = Run.Kokuyou.Phase; kokuyou.Tick(Run, dt, false); if (previousKokuyouPhase == KokuyouPhase.Active && Run.Kokuyou.Phase == KokuyouPhase.Ending) U43RuntimeFeedbackBridge.Instance?.PlayKokuyouEnding(); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); TickWeapons(dt); TickAreas(dt);','kokuyou.Tick(Run, dt, false); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); TickWeapons(dt); TickAreas(dt);');
  if (file.endsWith('U2BattleController.cs')) normalized = normalized
      .replace('using VampPon.UnitySpike.Runtime.Gameplay.Status;\n', '')
      .replace('        private readonly EnemyStatusRuntimeState statusState = new();\n', '')
      .replace('        public EnemyStatusRuntimeState Statuses => statusState;\n        public int ActiveStatusCount => statusState.ActiveCount;\n', '')
      .replace('        public void Activate(Vector3 position, float maxHp)\n        {\n            statusState.Clear();\n            hp = maxHp;', '        public void Activate(Vector3 position, float maxHp)\n        {\n            hp = maxHp;')
      .replace('        public void Tick(Vector3 playerPosition, float speed, float deltaTime)\n        {\n            statusState.Tick(deltaTime);\n            if (dying)', '        public void Tick(Vector3 playerPosition, float speed, float deltaTime)\n        {\n            if (dying)')
      .replace('        public override void Deactivate()\n        {\n            statusState.Clear();\n            base.Deactivate();\n        }\n\n', '');
  if (file.endsWith('U46RuntimeShell.cs')) normalized = normalized.replace(`            if (result != null && state == AppFlowState.Result)
            {
                result.Show(flow.LastResult);
                U43RuntimeFeedbackBridge.Instance?.PlayResult();
                if (flow.LastResult?.rewardIds?.Count > 0) U43RuntimeFeedbackBridge.Instance?.PlayRewardCard();
                if (flow.LastResult?.newlyUnlockedIds?.Count > 0) U43RuntimeFeedbackBridge.Instance?.PlayUnlockReveal();
            }
            else if (result != null) result.gameObject.SetActive(false);`, '            if (result != null && state == AppFlowState.Result) result.Show(flow.LastResult); else if (result != null) result.gameObject.SetActive(false);');
  return Buffer.from(normalized, 'utf8');
}
