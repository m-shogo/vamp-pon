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

const paths = {
  readiness: 'docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json',
  policy: 'docs/unity-runtime-visual-readiness-gate-v1.md',
  stageBootstrap: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs',
  battleController: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs',
  proofProvider: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U5ProofAssetProvider.cs',
  proofLibrary: 'unity/VampPonUnity/Assets/_Project/Scripts/U5/U5VisualAssetLibrary.cs',
  playerMeta: 'unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png.meta',
  u43Doc: 'docs/unity-u43-character-runtime-asset-repair-2026-07-05.md',
  simulatorChecker: 'scripts/quality/check-unity-u45-ai-simulator-smoke.ts',
  readme: 'README.md',
  canon: 'docs/181-current-production-canon.md',
};

for (const path of Object.values(paths)) check(`required file exists: ${path}`, existsSync(path));

let readiness: Record<string, any> = {};
try {
  readiness = JSON.parse(read(paths.readiness));
} catch {
  failures.push('runtime visual readiness JSON parses');
}

const stageBootstrap = read(paths.stageBootstrap);
const battleController = read(paths.battleController);
const proofProvider = read(paths.proofProvider);
const proofLibrary = read(paths.proofLibrary);
const playerMeta = read(paths.playerMeta);
const policy = read(paths.policy);
const u43Doc = read(paths.u43Doc);
const simulatorChecker = read(paths.simulatorChecker);
const readme = read(paths.readme);
const canon = read(paths.canon);
const runtimeScripts = collectCsFiles('unity/VampPonUnity/Assets/_Project/Scripts').map(read).join('\n');

const actualProofProviderActive = stageBootstrap.includes('new U5ProofAssetProvider()')
  || (proofProvider.includes('U5ProofAssetProvider') && proofProvider.includes('IsProofOnly => true'));
const actualProductionProviderConnected = !actualProofProviderActive
  && /Production.*AssetProvider|RuntimeVisualAssetProvider/.test(stageBootstrap + runtimeScripts);
const actualProceduralCharacterFallback = stageBootstrap.includes('ProceduralSpriteFactory.CreateCharacterSprite');
const actualProceduralEnemyFallback = battleController.includes('ProceduralSpriteFactory.CreateBlobSprite');
const actualPlayerSourceIsProofCandidate = proofLibrary.includes('u5-yui-battle-candidate')
  && proofLibrary.includes('U5Candidates');
const actualSpriteModeMultiple = /spriteMode:\s*2/.test(playerMeta);
const actualSpriteModeSingle = /spriteMode:\s*1/.test(playerMeta);
const actualFrameCount = actualSpriteModeMultiple ? countSpriteEntries(playerMeta) : (actualSpriteModeSingle ? 1 : 0);
const actualPointFilter = /filterMode:\s*0/.test(playerMeta);
const actualMipmapOff = /enableMipMap:\s*0/.test(playerMeta);
const actualAnimatorMarker = /PlayerSpriteAnimator|CharacterSpriteAnimator|Animator/.test(runtimeScripts);
const requiredAnimationMarkers = ['idle', 'walk', 'hurt', 'attack'];
const actualRequiredAnimationMarkers = requiredAnimationMarkers.every((state) =>
  new RegExp(`(?:${state}|${state[0].toUpperCase()}${state.slice(1)})`).test(runtimeScripts),
);

check('evidence kind exact', readiness.evidenceKind === 'Unity runtime visual readiness gate');
check('current classification is proof static', readiness.runtimeVisualClassification === 'proof-static-single-sprite');
check('object name is not accepted as evidence', readiness.playerRuntimeObjectNameAcceptedAsDotEvidence === false);
check('point filter is not accepted as evidence', readiness.pointFilterAcceptedAsDotEvidence === false);
check('Point filter remains recorded', readiness.pointFilterApplied === actualPointFilter);
check('proof provider evidence matches runtime', readiness.proofProviderActive === actualProofProviderActive);
check('production provider evidence matches runtime', readiness.productionProviderConnected === actualProductionProviderConnected);
check('procedural character fallback evidence matches runtime', readiness.proceduralCharacterFallbackActive === actualProceduralCharacterFallback);
check('procedural enemy fallback evidence matches runtime', readiness.proceduralEnemyFallbackActive === actualProceduralEnemyFallback);
check('proof candidate source evidence matches runtime', readiness.playerSpriteSourceIsProofCandidate === actualPlayerSourceIsProofCandidate);
check('sprite mode Multiple evidence matches importer', readiness.playerSpriteModeMultiple === actualSpriteModeMultiple);
check('sprite mode text matches importer', readiness.playerSpriteMode === (actualSpriteModeMultiple ? 'Multiple' : actualSpriteModeSingle ? 'Single' : 'Unknown'));
check('frame count evidence matches importer', readiness.playerSpriteFrameCount === actualFrameCount);
check('current player has no runtime animator claim', readiness.playerAnimatorConnected === actualAnimatorMarker);
check('current importer uses Point', actualPointFilter);
check('current importer has mipmap off', actualMipmapOff);

for (const key of [
  'characterDotRuntimeReady',
  'characterAnimationReady',
  'enemyDotRuntimeReady',
  'enemyAnimationReady',
  'productionCharacterAssetReady',
  'productionEnemyAssetReady',
  'runtimeVisualReady',
  'devicePlayableReady',
  'rcReady',
  'productionApproved',
]) {
  check(`${key} remains false while proof/static runtime is active`, readiness[key] === false);
}

check('Simulator route evidence remains separately valid', readiness.simulatorRouteEvidenceStillValid === true);
check('Simulator character visual approval is invalidated', readiness.simulatorCharacterVisualApprovalInvalidated === true);
check('next required phase recorded', readiness.nextRequiredPhase === 'U45.1 Character and Enemy Dot Runtime Pass');

const animationStates = readiness.playerAnimationStates ?? {};
for (const state of requiredAnimationMarkers) {
  check(`current ${state} animation remains unready`, animationStates[state] === 0);
}

if (readiness.characterDotRuntimeReady === true) {
  check('dot-ready cannot use proof provider', !actualProofProviderActive);
  check('dot-ready requires production provider', actualProductionProviderConnected);
  check('dot-ready cannot retain procedural character fallback', !actualProceduralCharacterFallback);
  check('dot-ready requires Sprite Mode Multiple', actualSpriteModeMultiple);
  check('dot-ready requires sliced frames', actualFrameCount >= 6);
  check('dot-ready requires animation runtime marker', actualAnimatorMarker);
  check('dot-ready requires animation state markers', actualRequiredAnimationMarkers);
  check('dot-ready requires direction flip verification', readiness.playerDirectionFlipVerified === true);
  check('dot-ready requires gameplay-size review', readiness.playerGameplaySizeVisualReviewPassed === true);
  check('dot-ready requires Golden Identity Reference', readiness.playerGoldenIdentityReferenceRegistered === true);
  check('dot-ready requires Lineage', readiness.playerGenerationLineageReady === true);
}

if (readiness.productionCharacterAssetReady === true) {
  check('production character requires final approval', readiness.playerAssetApprovedAsFinal === true);
  check('production character requires runtime approval', readiness.playerAssetRuntimeApproved === true);
  check('production character requires dot runtime ready', readiness.characterDotRuntimeReady === true);
  check('production character requires animation ready', readiness.characterAnimationReady === true);
}

if (readiness.enemyDotRuntimeReady === true) {
  check('enemy dot-ready cannot retain procedural enemy fallback', !actualProceduralEnemyFallback);
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

check('U43 historical doc contains correction boundary', u43Doc.includes('Point Filterだけではドット絵完成を意味しない'));
check('Simulator checker links runtime visual gate', simulatorChecker.includes('unity-runtime-visual-readiness/readiness.json'));
check('README links runtime visual readiness gate', readme.includes('docs/unity-runtime-visual-readiness-gate-v1.md'));
check('README exposes character readiness false', readme.includes('characterDotRuntimeReady=false'));
check('canon links runtime visual readiness gate', canon.includes('docs/unity-runtime-visual-readiness-gate-v1.md'));
check('package script exists', read('package.json').includes('unity:runtime-visual-readiness:check'));

if (failures.length > 0) {
  console.error('Unity runtime visual readiness check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Unity runtime visual readiness check passed: current proof/static state is reported honestly; naming, Point Filter and route smoke cannot promote dot/production readiness.');
