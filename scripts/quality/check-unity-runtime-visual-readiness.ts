import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];

function read(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function check(label: string, ok: boolean): void {
  if (!ok) failures.push(label);
}

function collectCsFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  const files: string[] = [];
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...collectCsFiles(path));
    else if (name.endsWith('.cs')) files.push(path);
  }
  return files;
}

function spriteMode(meta: string): 'Multiple' | 'Single' | 'Unknown' {
  if (/spriteMode:\s*2/.test(meta)) return 'Multiple';
  if (/spriteMode:\s*1/.test(meta)) return 'Single';
  return 'Unknown';
}

function frameCount(meta: string): number {
  const mode = spriteMode(meta);
  if (mode === 'Single') return 1;
  if (mode !== 'Multiple') return 0;
  return (meta.match(/\n\s{6}name:\s/g) ?? []).length;
}

function stateMarkersReady(source: string, states: string[]): boolean {
  return states.every((state) => new RegExp(`(?:${state}|${state[0].toUpperCase()}${state.slice(1)})`).test(source));
}

function checkOptionalExecutionEvidence(
  label: string,
  executed: unknown,
  result: unknown,
  commit: unknown,
  evidencePath: unknown,
): void {
  check(`${label} executed flag is boolean`, typeof executed === 'boolean');
  if (executed !== true) return;
  check(`${label} result passed`, result === 'passed' || result === 'Succeeded');
  check(`${label} commit recorded`, typeof commit === 'string' && commit.length >= 7);
  check(`${label} evidence path recorded`, typeof evidencePath === 'string' && evidencePath.length > 0);
  if (typeof evidencePath === 'string' && evidencePath.length > 0) {
    check(`${label} evidence exists: ${evidencePath}`, existsSync(evidencePath));
  }
}

const paths = {
  readiness: 'docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json',
  policy: 'docs/unity-runtime-visual-readiness-gate-v1.md',
  foundation: 'docs/unity-runtime-visual-readiness-gate-foundation-2026-07-10.md',
  stageBootstrap: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs',
  battleController: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs',
  proofProvider: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U5ProofAssetProvider.cs',
  proofLibrary: 'unity/VampPonUnity/Assets/_Project/Scripts/U5/U5VisualAssetLibrary.cs',
  u43Doc: 'docs/unity-u43-character-runtime-asset-repair-2026-07-05.md',
  simulatorChecker: 'scripts/quality/check-unity-u45-ai-simulator-smoke.ts',
  readme: 'README.md',
  canon: 'docs/181-current-production-canon.md',
  roadmap: 'docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md',
  visualQa: 'docs/visual-qa-gates.md',
  docsIndex: 'docs/00-index.md',
  agents: 'AGENTS.md',
  claude: 'CLAUDE.md',
  packageJson: 'package.json',
  u451Readiness: 'docs/design-targets/generated/unity-u45-1/runtime-dot-readiness.json',
  u451Smoke: 'docs/design-targets/generated/unity-u45-1/animation-smoke-result.json',
  u451Visual: 'docs/design-targets/generated/unity-u45-1/visual-review.json',
  registry: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/Stage1RuntimeVisualAssetRegistry.cs',
  playerAnimator: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/YuiSpriteAnimator.cs',
  enemyAnimator: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/OnbuSpriteAnimator.cs',
};

for (const path of Object.values(paths)) check(`required file exists: ${path}`, existsSync(path));

let readiness: Record<string, any> = {};
try {
  readiness = JSON.parse(read(paths.readiness));
} catch {
  failures.push('runtime visual readiness JSON parses');
}

const playerMetaPath = typeof readiness.playerSpriteMetaPath === 'string' ? readiness.playerSpriteMetaPath : '';
const enemyMetaPath = typeof readiness.enemySpriteMetaPath === 'string' ? readiness.enemySpriteMetaPath : '';
check('player sprite meta path recorded', playerMetaPath.length > 0);
check('enemy sprite meta path recorded', enemyMetaPath.length > 0);
check(`player sprite meta exists: ${playerMetaPath}`, existsSync(playerMetaPath));
check(`enemy sprite meta exists: ${enemyMetaPath}`, existsSync(enemyMetaPath));

const stageBootstrap = read(paths.stageBootstrap);
const battleController = read(paths.battleController);
const proofProvider = read(paths.proofProvider);
const proofLibrary = read(paths.proofLibrary);
const playerMeta = read(playerMetaPath);
const enemyMeta = read(enemyMetaPath);
const runtimeScripts = collectCsFiles('unity/VampPonUnity/Assets/_Project/Scripts').map(read).join('\n');

const providerMatch = stageBootstrap.match(/assetProvider\s*=\s*new\s+([A-Za-z0-9_]+AssetProvider)\s*\(/);
const actualProviderName = providerMatch?.[1] ?? 'UNKNOWN';
const actualProofProviderActive = actualProviderName === 'U5ProofAssetProvider';
const providerClassExists = actualProviderName !== 'UNKNOWN'
  && new RegExp(`class\\s+${actualProviderName}\\b`).test(runtimeScripts);
const providerDeclaresProduction = actualProviderName !== 'UNKNOWN'
  && new RegExp(`class\\s+${actualProviderName}[\\s\\S]*?IsProofOnly\\s*=>\\s*false`).test(runtimeScripts);
const actualProductionProviderConnected = !actualProofProviderActive && providerClassExists && providerDeclaresProduction;

const characterFallbackPresent = stageBootstrap.includes('ProceduralSpriteFactory.CreateCharacterSprite');
const characterFallbackDevelopmentOnly = characterFallbackPresent
  && stageBootstrap.includes('VAMPPON_DEVELOPMENT_VISUAL_FALLBACK');
const actualProceduralCharacterFallback = characterFallbackPresent && !characterFallbackDevelopmentOnly;
const enemyFallbackPresent = battleController.includes('ProceduralSpriteFactory.CreateBlobSprite');
const enemyFallbackDevelopmentOnly = enemyFallbackPresent
  && battleController.includes('VAMPPON_DEVELOPMENT_VISUAL_FALLBACK');
const actualProceduralEnemyFallback = enemyFallbackPresent && !enemyFallbackDevelopmentOnly;

const actualPlayerSourceIsProofCandidate = String(readiness.playerSpriteSource).includes('U5Candidates');
const actualEnemySourceIsProofCandidate = String(readiness.enemySpriteSource).includes('U5Candidates');
const actualPlayerMode = spriteMode(playerMeta);
const actualEnemyMode = spriteMode(enemyMeta);
const actualPlayerFrameCount = frameCount(playerMeta);
const actualEnemyFrameCount = frameCount(enemyMeta);
const actualPlayerPointFilter = /filterMode:\s*0/.test(playerMeta);
const actualEnemyPointFilter = /filterMode:\s*0/.test(enemyMeta);
const actualPlayerMipmapOff = /enableMipMap:\s*0/.test(playerMeta);
const actualEnemyMipmapOff = /enableMipMap:\s*0/.test(enemyMeta);

const actualPlayerAnimator = /PlayerSpriteAnimator|CharacterSpriteAnimator|YuiSpriteAnimator|RuntimeCharacterAnimator/.test(runtimeScripts);
const actualEnemyAnimator = /EnemySpriteAnimator|OnbuSpriteAnimator|RuntimeEnemyAnimator/.test(runtimeScripts);
const playerRequiredStates = ['idle', 'walk', 'hurt', 'attack'];
const enemyRequiredStates = ['idle', 'move', 'hurt', 'death'];
const actualPlayerStateMarkers = stateMarkersReady(runtimeScripts, playerRequiredStates);
const actualEnemyStateMarkers = stateMarkersReady(runtimeScripts, enemyRequiredStates);

const expectedClassification = actualProofProviderActive && actualPlayerMode === 'Single'
  ? 'proof-static-single-sprite'
  : actualProductionProviderConnected && actualPlayerMode === 'Multiple' && actualPlayerAnimator
    ? (readiness.productionCharacterAssetReady === true ? 'production-approved' : 'candidate-animated-multiple-sprite')
    : actualPlayerMode === 'Multiple' && actualPlayerAnimator
      ? 'candidate-animated-sprite'
      : actualProceduralCharacterFallback && !readiness.playerSpriteSource
        ? 'procedural-placeholder'
        : 'candidate-static-single-sprite';

check('evidence kind exact', readiness.evidenceKind === 'Unity runtime visual readiness gate');
check('runtime classification matches implementation', readiness.runtimeVisualClassification === expectedClassification);
check('runtime provider name matches Stage1 assignment', readiness.runtimeAssetProviderName === actualProviderName);
check('proof provider file declares proof-only', proofProvider.includes('IsProofOnly => true'));
check('proof provider evidence matches Stage1 assignment', readiness.proofProviderActive === actualProofProviderActive);
check('production provider evidence matches implementation', readiness.productionProviderConnected === actualProductionProviderConnected);
check('object name is not accepted as evidence', readiness.playerRuntimeObjectNameAcceptedAsDotEvidence === false);
check('point filter is not accepted as evidence', readiness.pointFilterAcceptedAsDotEvidence === false);
check('Point filter remains recorded', readiness.pointFilterApplied === actualPlayerPointFilter);
check('procedural character fallback evidence matches runtime', readiness.proceduralCharacterFallbackActive === actualProceduralCharacterFallback);
check('procedural enemy fallback evidence matches runtime', readiness.proceduralEnemyFallbackActive === actualProceduralEnemyFallback);
check('player proof source evidence matches runtime', readiness.playerSpriteSourceIsProofCandidate === actualPlayerSourceIsProofCandidate);
check('enemy proof source evidence matches runtime', readiness.enemySpriteSourceIsProofCandidate === actualEnemySourceIsProofCandidate);
check('player mode evidence matches importer', readiness.playerSpriteMode === actualPlayerMode);
check('player Multiple evidence matches importer', readiness.playerSpriteModeMultiple === (actualPlayerMode === 'Multiple'));
check('player frame count evidence matches importer', readiness.playerSpriteFrameCount === actualPlayerFrameCount);
check('enemy mode evidence matches importer', readiness.enemySpriteMode === actualEnemyMode);
check('enemy Multiple evidence matches importer', readiness.enemySpriteModeMultiple === (actualEnemyMode === 'Multiple'));
check('enemy frame count evidence matches importer', readiness.enemySpriteFrameCount === actualEnemyFrameCount);
check('player animator evidence matches runtime', readiness.playerAnimatorConnected === actualPlayerAnimator);
check('enemy animator evidence matches runtime', readiness.enemyAnimatorConnected === actualEnemyAnimator);
check('player importer uses Point', actualPlayerPointFilter);
check('enemy importer uses Point', actualEnemyPointFilter);
check('player importer has mipmap off', actualPlayerMipmapOff);
check('enemy importer has mipmap off', actualEnemyMipmapOff);
check('static checker is recorded ready', readiness.staticCheckerReady === true);

checkOptionalExecutionEvidence(
  'static checker',
  readiness.staticCheckerExecutedAfterCommit,
  readiness.staticCheckerResult,
  readiness.staticCheckerCommit,
  readiness.staticCheckerEvidencePath,
);
checkOptionalExecutionEvidence(
  'Unity compile after gate',
  readiness.unityCompileVerifiedAfterGate,
  readiness.unityCompileResult,
  readiness.unityCompileCommit,
  readiness.unityCompileEvidencePath,
);
checkOptionalExecutionEvidence(
  'Simulator rerun after gate',
  readiness.simulatorRegressionRerunAfterGate,
  readiness.simulatorRegressionResult,
  readiness.simulatorRegressionCommit,
  readiness.simulatorRegressionEvidencePath,
);

if (actualProofProviderActive || actualPlayerMode !== 'Multiple' || !actualPlayerAnimator) {
  for (const key of [
    'characterDotRuntimeReady',
    'characterAnimationReady',
    'productionCharacterAssetReady',
    'runtimeVisualReady',
    'devicePlayableReady',
    'rcReady',
    'productionApproved',
  ]) check(`${key} remains false while character proof/static runtime is active`, readiness[key] === false);
}

if (actualProofProviderActive || actualEnemyMode !== 'Multiple' || !actualEnemyAnimator || actualProceduralEnemyFallback) {
  for (const key of [
    'enemyDotRuntimeReady',
    'enemyAnimationReady',
    'productionEnemyAssetReady',
    'runtimeVisualReady',
  ]) check(`${key} remains false while enemy proof/static runtime is active`, readiness[key] === false);
}

check('Simulator route evidence remains separately valid', readiness.simulatorRouteEvidenceStillValid === true);
check('U45.1 Simulator character visual approval is current', readiness.simulatorCharacterVisualApprovalInvalidated === false);
check('next required phase recorded', readiness.nextRequiredPhase === 'U46 Result / Retry / StageSelect / Collection');

const playerStates = readiness.playerAnimationStates ?? {};
const enemyStates = readiness.enemyAnimationStates ?? {};
if (readiness.characterAnimationReady !== true) {
  for (const state of playerRequiredStates) check(`current player ${state} remains unready`, Number(playerStates[state]) === 0);
}
if (readiness.enemyAnimationReady !== true) {
  for (const state of enemyRequiredStates) check(`current enemy ${state} remains unready`, Number(enemyStates[state]) === 0);
}

if (readiness.characterDotRuntimeReady === true) {
  check('character dot-ready cannot use proof provider', !actualProofProviderActive);
  check('character dot-ready requires production provider', actualProductionProviderConnected);
  check('character dot-ready cannot retain active procedural fallback', !actualProceduralCharacterFallback);
  check('character dot-ready requires Multiple', actualPlayerMode === 'Multiple');
  check('character dot-ready requires sliced frames', actualPlayerFrameCount >= 6);
  check('character dot-ready requires animator', actualPlayerAnimator);
  check('character dot-ready requires state markers', actualPlayerStateMarkers);
  check('character dot-ready requires direction flip review', readiness.playerDirectionFlipVerified === true);
  check('character dot-ready uses explicit left/right frames', readiness.playerExplicitLeftRightFrames === true);
  check('character dot-ready does not use flipX', readiness.playerFlipXUsed === false);
  check('character dot-ready requires gameplay-size review', readiness.playerGameplaySizeVisualReviewPassed === true);
  check('character dot-ready requires identity reference', readiness.playerGoldenIdentityReferenceRegistered === true);
  check('character dot-ready requires lineage', readiness.playerGenerationLineageReady === true);
}

if (readiness.characterAnimationReady === true) {
  check('character animation-ready requires dot runtime', readiness.characterDotRuntimeReady === true);
  check('character animation-ready requires animator', actualPlayerAnimator);
  check('character animation-ready requires state markers', actualPlayerStateMarkers);
  for (const state of playerRequiredStates) check(`character animation-ready requires ${state} frames`, Number(playerStates[state]) > 0);
}

if (readiness.productionCharacterAssetReady === true) {
  check('production character requires final approval', readiness.playerAssetApprovedAsFinal === true);
  check('production character requires runtime approval', readiness.playerAssetRuntimeApproved === true);
  check('production character requires dot runtime', readiness.characterDotRuntimeReady === true);
  check('production character requires animation', readiness.characterAnimationReady === true);
}

if (readiness.enemyDotRuntimeReady === true) {
  check('enemy dot-ready cannot use proof provider', !actualProofProviderActive);
  check('enemy dot-ready requires production provider', actualProductionProviderConnected);
  check('enemy dot-ready cannot retain active procedural fallback', !actualProceduralEnemyFallback);
  check('enemy dot-ready requires Multiple', actualEnemyMode === 'Multiple');
  check('enemy dot-ready requires sliced frames', actualEnemyFrameCount >= 4);
  check('enemy dot-ready requires animator', actualEnemyAnimator);
  check('enemy dot-ready requires state markers', actualEnemyStateMarkers);
  check('enemy dot-ready requires state evidence', readiness.enemyAnimationStatesReady === true);
  check('enemy dot-ready requires gameplay-size review', readiness.enemyGameplaySizeVisualReviewPassed === true);
}

if (readiness.enemyAnimationReady === true) {
  check('enemy animation-ready requires dot runtime', readiness.enemyDotRuntimeReady === true);
  check('enemy animation-ready requires animator', actualEnemyAnimator);
  check('enemy animation-ready requires state markers', actualEnemyStateMarkers);
  for (const state of enemyRequiredStates) check(`enemy animation-ready requires ${state} frames`, Number(enemyStates[state]) > 0);
}

if (readiness.productionEnemyAssetReady === true) {
  check('production enemy requires final approval', readiness.enemyAssetApprovedAsFinal === true);
  check('production enemy requires runtime approval', readiness.enemyAssetRuntimeApproved === true);
  check('production enemy requires dot runtime', readiness.enemyDotRuntimeReady === true);
  check('production enemy requires animation', readiness.enemyAnimationReady === true);
}

if (readiness.runtimeVisualReady === true) {
  check('runtime visual requires character dot runtime', readiness.characterDotRuntimeReady === true);
  check('runtime visual requires character animation', readiness.characterAnimationReady === true);
  check('runtime visual requires enemy dot runtime', readiness.enemyDotRuntimeReady === true);
  check('runtime visual requires enemy animation', readiness.enemyAnimationReady === true);
  check('runtime visual requires U45.1 Simulator review', readiness.u451SimulatorVisualReviewPassed === true);
}

let u451: Record<string, any> = {};
let u451Smoke: Record<string, any> = {};
let u451Visual: Record<string, any> = {};
try { u451 = JSON.parse(read(paths.u451Readiness)); } catch { failures.push('U45.1 readiness JSON parses'); }
try { u451Smoke = JSON.parse(read(paths.u451Smoke)); } catch { failures.push('U45.1 smoke JSON parses'); }
try { u451Visual = JSON.parse(read(paths.u451Visual)); } catch { failures.push('U45.1 visual JSON parses'); }
check('U45.1 readiness mirrors runtime candidate', u451.runtimeVisualReady === true && u451.runtimeVisualClassification === expectedClassification);
check('U45.1 smoke has all 13 screenshots', u451Smoke.screenshotsReady === true && u451Smoke.requiredScreenshotCount === 13);
check('U45.1 smoke has no crash or exception', u451Smoke.crashDetected === false && u451Smoke.unhandledExceptionCount === 0);
check('U45.1 visual review has no P0/P1', Array.isArray(u451Visual.p0Issues) && u451Visual.p0Issues.length === 0 && Array.isArray(u451Visual.p1Issues) && u451Visual.p1Issues.length === 0);
check('U45.1 assets remain candidate-only', u451.playerAssetApprovedAsFinal === false && u451.enemyAssetApprovedAsFinal === false);

const registry = read(paths.registry);
const playerAnimator = read(paths.playerAnimator);
const enemyAnimator = read(paths.enemyAnimator);
check('registry contains explicit directional arrays', registry.includes('playerWalkLeft') && registry.includes('playerWalkRight'));
check('player animator disables horizontal flip', playerAnimator.includes('spriteRenderer.flipX = false'));
check('enemy animator disables horizontal flip', enemyAnimator.includes('spriteRenderer.flipX = false'));
check('player animator owns required transitions', playerAnimator.includes('PlayHurt') && playerAnimator.includes('OnAttack') && playerAnimator.includes('CurrentVelocity'));
check('enemy animator owns required transitions', enemyAnimator.includes('PlayHurt') && enemyAnimator.includes('PlayDeath') && enemyAnimator.includes('ResetForPool'));

const policy = read(paths.policy);
for (const phrase of [
  'Point Filterは既存画像の補間を止めるだけ',
  'object名もvisual evidenceではない',
  'candidate-animated-multiple-sprite',
  'characterDotRuntimeReady=true',
  'U45.1 Character and Enemy Dot Runtime Pass',
]) check(`policy includes: ${phrase}`, policy.includes(phrase));

const foundation = read(paths.foundation);
const u43Doc = read(paths.u43Doc);
const simulatorChecker = read(paths.simulatorChecker);
const readme = read(paths.readme);
const canon = read(paths.canon);
const roadmap = read(paths.roadmap);
const visualQa = read(paths.visualQa);
const docsIndex = read(paths.docsIndex);
const agents = read(paths.agents);
const claude = read(paths.claude);
const packageJson = read(paths.packageJson);

check('foundation records proof classification', foundation.includes('runtimeVisualClassification=proof-static-single-sprite'));
check('U43 doc contains correction', u43Doc.includes('Point Filterだけではドット絵完成を意味しない'));
check('Simulator checker links runtime visual gate', simulatorChecker.includes('unity-runtime-visual-readiness/readiness.json'));
check('README links runtime gate', readme.includes('docs/unity-runtime-visual-readiness-gate-v1.md'));
check('README exposes candidate runtime readiness', readme.includes('characterDotRuntimeReady=true'));
check('canon links runtime gate', canon.includes('docs/unity-runtime-visual-readiness-gate-v1.md'));
check('roadmap places U45.1 before U46', roadmap.includes('U45.1 Character and Enemy Dot Runtime Pass') && roadmap.indexOf('## U45.1') < roadmap.indexOf('## U46'));
check('visual QA contains runtime gate', visualQa.includes('## Gate 11: Runtime Visual Readiness'));
check('visual QA uses correct 黒耀化 term', !visualQa.includes('黒曜化'));
check('docs index exposes runtime gate', docsIndex.includes('unity-runtime-visual-readiness-gate-v1.md'));
check('AGENTS blocks Point Filter false positive', agents.includes('Point Filter only disables texture interpolation'));
check('AGENTS requires checker', agents.includes('pnpm unity:runtime-visual-readiness:check'));
check('CLAUDE blocks Point Filter false positive', claude.includes('Point Filter only disables interpolation'));
check('CLAUDE requires checker', claude.includes('pnpm unity:runtime-visual-readiness:check'));
check('package script exists', packageJson.includes('unity:runtime-visual-readiness:check'));
check('assets verify includes runtime visual gate', packageJson.includes('pnpm unity:runtime-visual-readiness:check'));

if (failures.length > 0) {
  console.error('Unity runtime visual readiness check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Unity runtime visual readiness check passed: provider=${actualProviderName}, classification=${expectedClassification}; naming, Point Filter and route smoke cannot promote dot/production readiness.`);
