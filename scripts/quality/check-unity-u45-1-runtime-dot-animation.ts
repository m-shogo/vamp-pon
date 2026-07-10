import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];

function read(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function json(path: string): Record<string, any> {
  try { return JSON.parse(read(path)); } catch { failures.push(`JSON parses: ${path}`); return {}; }
}

function check(label: string, ok: boolean): void {
  if (!ok) failures.push(label);
}

const root = 'docs/design-targets/generated/unity-u45-1';
const paths = {
  readiness: `${root}/runtime-dot-readiness.json`,
  smoke: `${root}/animation-smoke-result.json`,
  visual: `${root}/visual-review.json`,
  validation: `${root}/asset-validation.json`,
  playerMeta: 'unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet.png.meta',
  enemyMeta: 'unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet.png.meta',
  registryAsset: 'unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Stage1RuntimeVisualAssetRegistry.asset',
  manifest: 'unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/runtime-dot-manifest.json',
  provider: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs',
  registry: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/Stage1RuntimeVisualAssetRegistry.cs',
  playerAnimator: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/YuiSpriteAnimator.cs',
  enemyAnimator: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/OnbuSpriteAnimator.cs',
  builder: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U451RuntimeDotAssetBuilder.cs',
  stage: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs',
  battle: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs',
  bridge: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U45AiSimulatorSmokeBridge.cs',
  canonical: 'docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json',
  golden: 'data/asset-factory/golden-reference-registry.json',
  implementationDoc: 'docs/unity-u45-1-character-enemy-dot-runtime-pass-2026-07-10.md',
  smokeDoc: 'docs/unity-u45-1-ios-simulator-animation-smoke-2026-07-10.md',
};

for (const path of Object.values(paths)) check(`exists: ${path}`, existsSync(path));

const screenshots = [
  '01-stage-select.png', '02-yui-idle.png', '03-yui-walk-right.png', '04-yui-walk-left.png',
  '05-yui-hurt.png', '06-yui-attack.png', '07-onbu-move.png', '08-onbu-hurt.png',
  '09-onbu-death.png', '10-levelup-paused-animation.png', '11-result-paused-animation.png',
  '12-retry-reset.png', '13-stage-select-return.png',
];
for (const screenshot of screenshots) check(`screenshot exists: ${screenshot}`, existsSync(`${root}/screenshots/${screenshot}`));

const readiness = json(paths.readiness);
const smoke = json(paths.smoke);
const visual = json(paths.visual);
const validation = json(paths.validation);
const canonical = json(paths.canonical);
const manifest = json(paths.manifest);
const playerMeta = read(paths.playerMeta);
const enemyMeta = read(paths.enemyMeta);
const provider = read(paths.provider);
const registry = read(paths.registry);
const playerAnimator = read(paths.playerAnimator);
const enemyAnimator = read(paths.enemyAnimator);
const builder = read(paths.builder);
const stage = read(paths.stage);
const battle = read(paths.battle);
const bridge = read(paths.bridge);
const golden = read(paths.golden);

check('classification is candidate animated Multiple', readiness.runtimeVisualClassification === 'candidate-animated-multiple-sprite');
check('Stage1 uses runtime provider', stage.includes('new RuntimeVisualAssetProvider'));
check('provider is non-proof', provider.includes('IsProofOnly => false'));
check('provider loads typed registry', provider.includes('Stage1RuntimeVisualAssetRegistry') && provider.includes('Resources.Load'));
check('required visuals do not silently fallback', provider.includes('throw new InvalidOperationException'));
check('procedural character fallback absent', !stage.includes('ProceduralSpriteFactory.CreateCharacterSprite'));
check('procedural enemy fallback absent', !battle.includes('ProceduralSpriteFactory.CreateBlobSprite'));

for (const [label, meta] of [['player', playerMeta], ['enemy', enemyMeta]] as const) {
  check(`${label} Sprite Mode Multiple`, /spriteMode:\s*2/.test(meta));
  check(`${label} frame count 48`, (meta.match(/\n\s{6}name:\s/g) ?? []).length === 48);
  check(`${label} Point filter`, /filterMode:\s*0/.test(meta));
  check(`${label} mipmap off`, /enableMipMap:\s*0/.test(meta));
}

check('registry has player left/right arrays', registry.includes('playerIdleLeft') && registry.includes('playerWalkRight') && registry.includes('playerAttackLeft'));
check('registry has enemy state arrays', registry.includes('enemyIdle') && registry.includes('enemyMove') && registry.includes('enemyHurt') && registry.includes('enemyDeath'));
check('player uses explicit frames without flipX', playerAnimator.includes('RuntimeFacing.Left') && playerAnimator.includes('RuntimeFacing.Right') && playerAnimator.includes('spriteRenderer.flipX = false'));
check('player owns idle/walk/hurt/attack transitions', playerAnimator.includes('RuntimeCharacterAnimationState.Idle') && playerAnimator.includes('RuntimeCharacterAnimationState.Walk') && playerAnimator.includes('PlayHurt') && playerAnimator.includes('OnAttack'));
check('player respects runtime pause', playerAnimator.includes('runtimePaused') && playerAnimator.includes('Time.deltaTime <= 0f'));
check('enemy owns idle/move/hurt/death transitions', enemyAnimator.includes('RuntimeEnemyAnimationState.Idle') && enemyAnimator.includes('RuntimeEnemyAnimationState.Move') && enemyAnimator.includes('PlayHurt') && enemyAnimator.includes('PlayDeath'));
check('enemy pool reset exists', enemyAnimator.includes('ResetForPool') && battle.includes('spriteAnimator.ResetForPool'));
check('death disables target and returns to pool', battle.includes('!dying') && battle.includes('DeathComplete') && battle.includes('Deactivate()'));

check('builder uses stable sprite IDs', builder.includes('StableSpriteId') && builder.includes('SHA256.Create'));
check('builder uses deterministic Onbu quantize', builder.includes('Pixelate') && builder.includes('OnbuAsset, 3'));
check('manifest has source/output hashes', typeof manifest.playerSourceHash === 'string' && manifest.playerSourceHash.length === 64 && typeof manifest.enemyOutputHash === 'string' && manifest.enemyOutputHash.length === 64);
check('manifest preserves candidate boundary', manifest.approvedAsFinal === false && manifest.runtimeApproved === false);
check('golden identities registered', golden.includes('character:yui:identity-v1') && golden.includes('enemy:onbu:identity-v1'));
check('golden entries remain non-final', golden.includes('"approvedAsFinal": false') && golden.includes('"approvedForRuntime": false'));

for (const key of [
  'productionVisualProviderReady', 'proofProviderUnused', 'runtimeVisualSourcesReady', 'proceduralFallbackUnused',
  'yuiIdleReady', 'yuiWalkRightReady', 'yuiWalkLeftReady', 'yuiReleaseIdleReady', 'yuiFacingHeldOnRelease',
  'yuiHurtReady', 'yuiAttackReady', 'yuiPauseReady', 'yuiRetryResetReady', 'onbuMoveReady',
  'onbuHurtReady', 'onbuDeathReady', 'onbuPoolReturnReady', 'onbuRespawnResetReady',
  'stageSelectPauseReady', 'resultPauseReady', 'uiMovementCollisionGuardReady', 'screenshotsReady',
]) check(`smoke ${key} true`, smoke[key] === true);
check('smoke is crash-free', smoke.crashDetected === false && smoke.unhandledExceptionCount === 0);
check('bridge checks all animation states', bridge.includes('yuiWalkRightReady') && bridge.includes('onbuRespawnResetReady'));
check('bridge remains Simulator-only', bridge.startsWith('#if VAMPPON_AI_SIMULATOR_SMOKE') && bridge.trimEnd().endsWith('#endif'));
check('asset validation passed', validation.result === 'passed' && validation.playerFrameCount === 48 && validation.enemyFrameCount === 48);
check('visual review has no P0/P1', Array.isArray(visual.p0Issues) && visual.p0Issues.length === 0 && Array.isArray(visual.p1Issues) && visual.p1Issues.length === 0);

for (const key of ['characterDotRuntimeReady', 'characterAnimationReady', 'enemyDotRuntimeReady', 'enemyAnimationReady', 'runtimeVisualReady']) {
  check(`${key} promoted by U45.1`, readiness[key] === true && canonical[key] === true);
}
for (const key of [
  'productionCharacterAssetReady', 'productionEnemyAssetReady', 'devicePlayableReady', 'mobileMetricsReady',
  'rcReady', 'productionApproved',
]) check(`${key} remains false`, readiness[key] === false && canonical[key] === false);
for (const key of ['audioMixerReady', 'audioLatencyMeasured', 'hapticMeasured']) check(`${key} remains false`, canonical[key] === false);
check('next phase is U46', readiness.nextRequiredPhase === 'U46 Result / Retry / StageSelect / Collection' && canonical.nextRequiredPhase === readiness.nextRequiredPhase);

if (failures.length > 0) {
  console.error('Unity U45.1 runtime dot animation check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Unity U45.1 runtime dot animation check passed: Yui/Onbu Multiple animation candidate runtime ready; final art, device, RC and production gates remain false.');
