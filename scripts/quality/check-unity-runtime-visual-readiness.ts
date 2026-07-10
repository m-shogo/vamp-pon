import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];

function read(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function check(label: string, ok: boolean): void {
  if (!ok) failures.push(label);
}

function countSpriteEntries(meta: string): number {
  const spriteSheetMatch = meta.match(/spriteSheet:\s*[\s\S]*?sprites:\s*([\s\S]*?)\n\s*outline:/);
  if (!spriteSheetMatch) return 0;
  return (spriteSheetMatch[1].match(/\n\s*- serializedVersion:/g) ?? []).length;
}

function spriteMode(meta: string): 'Multiple' | 'Single' | 'Unknown' {
  if (/spriteMode:\s*2/.test(meta)) return 'Multiple';
  if (/spriteMode:\s*1/.test(meta)) return 'Single';
  return 'Unknown';
}

function frameCount(meta: string): number {
  const mode = spriteMode(meta);
  if (mode === 'Multiple') return countSpriteEntries(meta);
  if (mode === 'Single') return 1;
  return 0;
}

function collectCsFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  const result: string[] = [];
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    const stat = statSync(path);
    if (stat.isDirectory()) result.push(...collectCsFiles(path));
    else if (name.endsWith('.cs')) result.push(path);
  }
  return result;
}

function checkOptionalExecutionEvidence(
  label: string,
  executed: unknown,
  result: unknown,
  commit: unknown,
  evidencePath: unknown,
): void {
  check(`${label} executed flag is boolean`, typeof executed === 'boolean');
  if (executed === true) {
    check(`${label} result passed`, result === 'passed' || result === 'Succeeded');
    check(`${label} commit recorded`, typeof commit === 'string' && commit.length >= 7);
    check(`${label} evidence path recorded`, typeof evidencePath === 'string' && evidencePath.length > 0);
    if (typeof evidencePath === 'string' && evidencePath.length > 0) {
      check(`${label} evidence exists: ${evidencePath}`, existsSync(evidencePath));
    }
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
const policy = read(paths.policy);
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
const runtimeScripts = collectCsFiles('unity/VampPonUnity/Assets/_Project/Scripts').map(read).join('\n');

const actualProofProviderActive = stageBootstrap.includes('new U5ProofAssetProvider()')
  || (proofProvider.includes('U5ProofAssetProvider') && proofProvider.includes('IsProofOnly => true'));
const actualProductionProviderConnected = !actualProofProviderActive
  && /ProductionVisualAssetProvider|RuntimeVisualAssetProvider|ProductionBattleAssetProvider/.test(stageBootstrap + runtimeScripts);
const actualProceduralCharacterFallback = stageBootstrap.includes('ProceduralSpriteFactory.CreateCharacterSprite');
const actualProceduralEnemyFallback = battleController.includes('ProceduralSpriteFactory.CreateBlobSprite');
const actualPlayerSourceIsProofCandidate = String(readiness.playerSpriteSource).includes('U5Candidates')
  || (proofLibrary.includes('u5-yui-battle-candidate') && proofLibrary.includes('U5Candidates'));
const actualEnemySourceIsProofCandidate = String(readiness.enemySpriteSource).includes('U5Candidates')
  || (proofLibrary.includes('u5-ombu-battle-candidate') && proofLibrary.includes('U5Candidates'));
const actualPlayerMode = spriteMode(playerMeta);
const actualEnemyMode = spriteMode(enemyMeta);
const actualPlayerFrameCount = frameCount(playerMeta);
const actualEnemyFrameCount = frameCount(enemyMeta);
const actualPlayerPointFilter = /filterMode:\s*0/.test(playerMeta);
const actualEnemyPointFilter = /filterMode:\s*0/.test(enemyMeta);
const actualPlayerMipmapOff = /enableMipMap:\s*0/.test(playerMeta);
const actualEnemyMipmapOff = /enableMipMap:\s*0/.test(enemyMeta);
const actualAnimatorMarker = /PlayerSpriteAnimator|CharacterSpriteAnimator|YuiSpriteAnimator|RuntimeCharacterAnimator/.test(runtimeScripts);
const requiredAnimationMarkers = ['idle', 'walk', 'hurt', 'attack'];
const actualRequiredAnimationMarkers = requiredAnimationMarkers.every((state) =>
  new RegExp(`(?:${state}|${state[0].toUpperCase()}${state.slice(1)})`).test(runtimeScripts),
);

const expectedClassification = actualProofProviderActive && actualPlayerMode === 'Single'
  ? 'proof-static-single-sprite'
  : actualProductionProviderConnected && actualPlayerMode === 'Multiple' && actualAnimatorMarker
    ? (readiness.productionCharacterAssetReady === true ? 'production-approved' : 'production-animated-sprite')
    : actualPlayerMode === 'Multiple' && actualAnimatorMarker
      ? 'candidate-animated-sprite'
      : actualProceduralCharacterFallback && !readiness.playerSpriteSource
        ? 'procedural-placeholder'
        : 'candidate-static-single-sprite';

check('evidence kind exact', readiness.evidenceKind === 'Unity runtime visual readiness gate');
check('runtime classification matches implementation', readiness.runtimeVisualClassification === expectedClassification);
check('object name is not accepted as evidence', readiness.playerRuntimeObjectNameAcceptedAsDotEvidence === false);
check('point filter is not accepted as evidence', readiness.pointFilterAcceptedAsDotEvidence === false);
check('Point filter remains recorded', readiness.pointFilterApplied === actualPlayerPointFilter);
check('proof provider evidence matches runtime', readiness.proofProviderActive === actualProofProviderActive);
check('production provider evidence matches runtime', readiness.productionProviderConnected === actualProductionProviderConnected);
check('procedural character fallback evidence matches runtime', readiness.proceduralCharacterFallbackActive === actualProceduralCharacterFallback);
check('procedural enemy fallback evidence matches runtime', readiness.proceduralEnemyFallbackActive === actualProceduralEnemyFallback);
check('player proof candidate source evidence matches runtime', readiness.playerSpriteSourceIsProofCandidate === actualPlayerSourceIsProofCandidate);
check('enemy proof candidate source evidence matches runtime', readiness.enemySpriteSourceIsProofCandidate === actualEnemySourceIsProofCandidate);
check('player sprite mode Multiple evidence matches importer', readiness.playerSpriteModeMultiple === (actualPlayerMode === 'Multiple'));
check('player sprite mode text matches importer', readiness.playerSpriteMode === actualPlayerMode);
check('player frame count evidence matches importer', readiness.playerSpriteFrameCount === actualPlayerFrameCount);
check('enemy sprite mode Multiple evidence matches importer', readiness.enemySpriteModeMultiple === (actualEnemyMode === 'Multiple'));
check('enemy sprite mode text matches importer', readiness.enemySpriteMode === actualEnemyMode);
check('enemy frame count evidence matches importer', readiness.enemySpriteFrameCount === actualEnemyFrameCount);
check('player animator evidence matches dedicated runtime marker', readiness.playerAnimatorConnected === actualAnimatorMarker);
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

if (actualProofProviderActive || actualPlayerMode !== 'Multiple' || !actualAnimatorMarker) {
  for (const key of [
    'characterDotRuntimeReady',
    'characterAnimationReady',
    'productionCharacterAssetReady',
    'runtimeVisualReady',
    'devicePlayableReady',
    'rcReady',
    'productionApproved',
  ]) {
    check(`${key} remains false while character proof/static runtime is active`, readiness[key] === false);
  }
}

if (actualProofProviderActive || actualEnemyMode !== 'Multiple' || actualProceduralEnemyFallback) {
  for (const key of [
    'enemyDotRuntimeReady',
    'enemyAnimationReady',
    'productionEnemyAssetReady',
    'runtimeVisualReady',
  ]) {
    check(`${key} remains false while enemy proof/static runtime is active`, readiness[key] === false);
  }
}

check('Simulator route evidence remains separately valid', readiness.simulatorRouteEvidenceStillValid === true);
check('Simulator character visual approval is invalidated', readiness.simulatorCharacterVisualApprovalInvalidated === true);
check('next required phase recorded', readiness.nextRequiredPhase === 'U45.1 Character and Enemy Dot Runtime Pass');

const animationStates = readiness.playerAnimationStates ?? {};
if (readiness.characterAnimationReady !== true) {
  for (const state of requiredAnimationMarkers) {
    check(`current ${state} animation remains unready`, Number(animationStates[state]) === 0);
  }
}

if (readiness.characterDotRuntimeReady === true) {
  check('dot-ready cannot use proof provider', !actualProofProviderActive);
  check('dot-ready requires production provider', actualProductionProviderConnected);
  check('dot-ready cannot retain procedural character fallback', !actualProceduralCharacterFallback);
  check('dot-ready requires Sprite Mode Multiple', actualPlayerMode === 'Multiple');
  check('dot-ready requires sliced frames', actualPlayerFrameCount >= 6);
  check('dot-ready requires dedicated animation runtime marker', actualAnimatorMarker);
  check('dot-ready requires animation state markers', actualRequiredAnimationMarkers);
  check('dot-ready requires direction flip verification', readiness.playerDirectionFlipVerified === true);
  check('dot-ready requires gameplay-size review', readiness.playerGameplaySizeVisualReviewPassed === true);
  check('dot-ready requires Golden Identity Reference', readiness.playerGoldenIdentityReferenceRegistered === true);
  check('dot-ready requires Lineage', readiness.playerGenerationLineageReady === true);
}

if (readiness.characterAnimationReady === true) {
  check('animation-ready requires dot runtime ready', readiness.characterDotRuntimeReady === true);
  check('animation-ready requires dedicated runtime marker', actualAnimatorMarker);
  check('animation-ready requires required state markers', actualRequiredAnimationMarkers);
  for (const state of requiredAnimationMarkers) {
    check(`animation-ready requires ${state} frames`, Number(animationStates[state]) > 0);
  }
}

if (readiness.productionCharacterAssetReady === true) {
  check('production character requires final approval', readiness.playerAssetApprovedAsFinal === true);
  check('production character requires runtime approval', readiness.playerAssetRuntimeApproved === true);
  check('production character requires dot runtime ready', readiness.characterDotRuntimeReady === true);
  check('production character requires animation ready', readiness.characterAnimationReady === true);
}

if (readiness.enemyDotRuntimeReady === true) {
  check('enemy dot-ready cannot retain procedural enemy fallback', !actualProceduralEnemyFallback);
  check('enemy dot-ready requires Sprite Mode Multiple', actualEnemyMode === 'Multiple');
  check('enemy dot-ready requires sliced frames', actualEnemyFrameCount >= 4);
  check('enemy dot-ready requires animation states', readiness.enemyAnimationStatesReady === true);
  check('enemy dot-ready requires gameplay-size review', readiness.enemyGameplaySizeVisualReviewPassed === true);
}

if (readiness.productionEnemyAssetReady === true) {
  check('production enemy requires final approval', readiness.enemyAssetApprovedAsFinal === true);
  check('production enemy requires runtime approval', readiness.enemyAssetRuntimeApproved === true);
  check('production enemy requires dot runtime ready', readiness.enemyDotRuntimeReady === true);
  check('production enemy requires animation ready', readiness.enemyAnimationReady === true);
}

if (readiness.runtimeVisualReady === true) {
  check('runtime visual ready requires production character', readiness.productionCharacterAssetReady === true);
  check('runtime visual ready requires production enemy', readiness.productionEnemyAssetReady === true);
}

for (const phrase of [
  'Point Filterは既存画像の補間を止めるだけ',
  'object名もvisual evidenceではない',
  'proof-static-single-sprite',
  'characterDotRuntimeReady=true',
  'U45.1 Character and Enemy Dot Runtime Pass',
]) {
  check(`policy includes: ${phrase}`, policy.includes(phrase));
}

check('foundation records current proof classification', foundation.includes('runtimeVisualClassification=proof-static-single-sprite'));
check('U43 historical doc contains correction boundary', u43Doc.includes('Point Filterだけではドット絵完成を意味しない'));
check('Simulator checker links runtime visual gate', simulatorChecker.includes('unity-runtime-visual-readiness/readiness.json'));
check('README links runtime visual readiness gate', readme.includes('docs/unity-runtime-visual-readiness-gate-v1.md'));
check('README exposes character readiness false', readme.includes('characterDotRuntimeReady=false'));
check('canon links runtime visual readiness gate', canon.includes('docs/unity-runtime-visual-readiness-gate-v1.md'));
check('roadmap places U45.1 before U46', roadmap.includes('U45.1 Character and Enemy Dot Runtime Pass') && roadmap.indexOf('## U45.1') < roadmap.indexOf('## U46'));
check('visual QA contains runtime gate', visualQa.includes('## Gate 11: Runtime Visual Readiness'));
check('visual QA uses correct 黒耀化 term', !visualQa.includes('黒曜化'));
check('docs index exposes runtime gate', docsIndex.includes('unity-runtime-visual-readiness-gate-v1.md'));
check('AGENTS blocks Point Filter false positive', agents.includes('Point Filter only disables texture interpolation'));
check('AGENTS requires runtime visual checker', agents.includes('pnpm unity:runtime-visual-readiness:check'));
check('CLAUDE blocks Point Filter false positive', claude.includes('Point Filter only disables interpolation'));
check('CLAUDE requires runtime visual checker', claude.includes('pnpm unity:runtime-visual-readiness:check'));
check('package script exists', read('package.json').includes('unity:runtime-visual-readiness:check'));
check('assets verify includes runtime visual gate', read('package.json').includes('pnpm unity:runtime-visual-readiness:check'));

if (failures.length > 0) {
  console.error('Unity runtime visual readiness check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Unity runtime visual readiness check passed: ${expectedClassification}; naming, Point Filter and route smoke cannot promote dot/production readiness.`);
