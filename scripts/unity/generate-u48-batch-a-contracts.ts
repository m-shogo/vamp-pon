import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { assetFactoryPromptByKey } from '../../src/game/data/assetFactoryCatalog.ts';
import { assetGenerationContractByKey } from '../../src/game/data/assetGenerationPolicy.ts';

const root = resolve(import.meta.dirname, '../..');
const outputRoot = resolve(root, 'docs/design-targets/generated/unity-u48/batch-a');
const candidateRoot = 'unity/VampPonUnity/Assets/_Project/Art/Candidates/U48/BatchA';
const sourceHead = '192471e044124885e432d6ecc4166ccfdf8134e8';
const sha256 = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const buildManifestPath = resolve(outputRoot, 'candidate-build-manifest.json');
const buildManifest = existsSync(buildManifestPath) ? JSON.parse(readFileSync(buildManifestPath, 'utf8')) : null;
const recordedGroups = process.env.U48_BATCH_A_GENERATED_GROUPS
  ? new Set(process.env.U48_BATCH_A_GENERATED_GROUPS.split(',').filter(Boolean))
  : null;

type GoldenSpec = {
  status: 'complete' | 'composite' | 'missing';
  references: Array<[string, string]>;
  inherit: string[];
  doNotInherit: string[];
  runtimeReadabilityContract: string[];
  prohibitedExpressions: string[];
};

const sharedReferences: Array<[string, string]> = [
  ['docs/88-adopted-visual-direction.md', 'worldbuilding'],
  ['docs/181-current-production-canon.md', 'worldbuilding'],
  ['docs/design-targets/generated/top-final.png', 'color'],
];

const golden: Record<string, GoldenSpec> = {
  'player-yui': {
    status: 'composite',
    references: [...sharedReferences, ['assets/reference/character-master/core5/yui-character-master-v1.png', 'shape'], ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet.png', 'animation'], ['docs/design-targets/generated/unity-u45-1/screenshots/02-yui-idle.png', 'runtime-size']],
    inherit: ['ユイの髪型と小さな旅人の頭身', '右手ランタン', '右肩から左腰へのバッグ紐と左腰バッグ', '紙・黒インク・暖色灯の質感', '8x6・180px cell animation contract'],
    doNotInherit: ['title screen baked text/control', 'runtime sheetの候補承認状態', '背景やUI'],
    runtimeReadabilityContract: ['頭・身体・ランタン・進行方向を390x844で識別できる', 'Onbuと夜背景からsilhouetteが分離する', '左右移動でランタンとバッグのbody-relative ownershipを維持する'],
    prohibitedExpressions: ['baby-like', '過剰な萌え表現', 'glossy plastic', '別人物化', '左手ランタン', '右腰バッグ'],
  },
  'enemy-onbu': {
    status: 'composite',
    references: [...sharedReferences, ['assets/reference/enemies/ink_enemy_family_reference.png', 'shape'], ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet.png', 'animation'], ['docs/design-targets/generated/unity-u45-1/screenshots/07-onbu-move.png', 'runtime-size'], ['docs/design/world/the-truth-of-onbu.md', 'worldbuilding']],
    inherit: ['腕なしの小型silhouette', '短い1本のインク芽', '短く丸い影炎', '薄い顔前モヤ', '口なし', '8x6・180px cell animation contract'],
    doNotInherit: ['enemy family reference内の他個体', '強い恐怖表現', 'player proportions'],
    runtimeReadabilityContract: ['Yuiと明確に区別できる', '小型でも敵として認識できる', 'move・hurt・deathの輪郭が連続する'],
    prohibitedExpressions: ['腕', '口', '複数の長い芽', '長く尖った影炎', '過度に可愛い表情', '強いホラー表現'],
  },
  'stage1-background': {
    status: 'composite',
    references: [...sharedReferences, ['public/assets/prototypes/backgrounds/stage-01/environment-master.png', 'shape'], ['assets/reference/backgrounds/stage1_night_tile_reference.png', 'texture'], ['assets/concept-design/01_world/world_night-town_01.png', 'worldbuilding'], ['docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/02-initial-night-pencil.png', 'runtime-size']],
    inherit: ['夜の街', '紙地図・旅の記録', '静かな低彩度', '限定された暖色灯'],
    doNotInherit: ['中央の大型装飾', 'baked character', 'baked pickup', 'prototypeの未調整コントラスト'],
    runtimeReadabilityContract: ['player・enemy・pickup・projectileの輪郭を埋没させない', 'CompactからLargeまで中央戦闘領域を空ける', '縦scrollで急な継ぎ目を作らない'],
    prohibitedExpressions: ['真っ黒な面', '高彩度ネオン', '中央の巨大建造物', '読める看板文字', '強い反復tile seam'],
  },
  'exp-pickup': {
    status: 'composite',
    references: [...sharedReferences, ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-exp-fragment.png', 'shape'], ['docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/02-initial-night-pencil.png', 'runtime-size']],
    inherit: ['小さな記憶片', '淡い青白光', '紙片または小水晶の単一object'],
    doNotInherit: ['候補水晶の大きな輪郭', 'healingの暖色朝光', '過剰なspark'],
    runtimeReadabilityContract: ['大量出現でも画面を埋めない', '吸い寄せ方向が輪郭で読める', 'healingと同時表示で識別できる'],
    prohibitedExpressions: ['赤いハート', '大きな宝石', '強い点滅', 'UI frame', 'text'],
  },
  'healing-pickup': {
    status: 'missing',
    references: [...sharedReferences, ['src/game/data/itemAssetProductionDatabase.ts', 'worldbuilding'], ['docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/15-revival-30-percent.png', 'runtime-size']],
    inherit: ['夜・紙・朝の光', '落とし物としての小型単一object', '手動取得で見失わない暖色輪郭'],
    doNotInherit: ['revival gameplay仕様', 'EXPの青白水晶', 'generic red heart'],
    runtimeReadabilityContract: ['EXPおよび候補水晶と同時表示で識別できる', 'player近傍で輪郭を維持する', '過剰発光なしで回復用途を示す'],
    prohibitedExpressions: ['赤いハート単体', '医療十字', '大型potion', 'neon green', 'text'],
  },
  'common-projectile': {
    status: 'composite',
    references: [...sharedReferences, ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-lantern-spark.png', 'shape'], ['docs/design-targets/generated/unity-u45-1/screenshots/06-yui-attack.png', 'runtime-size']],
    inherit: ['進行方向が読める短い軸', '紙・鉛筆・黒インク・小さな灯のmotif', '静かな通常攻撃'],
    doNotInherit: ['hit effect', 'death burst', 'ground-area ring', 'EXP crystal'],
    runtimeReadabilityContract: ['高密度でもYuiとOnbuを隠さない', 'hit位置へ向く', '白面積を抑える'],
    prohibitedExpressions: ['大きな火球', '全白beam', '円形ground area', '長い常時trail'],
  },
  'hit-effect': {
    status: 'composite',
    references: [...sharedReferences, ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-lantern-spark.png', 'color'], ['docs/design-targets/generated/unity-u45-1/screenshots/08-onbu-hurt.png', 'runtime-size']],
    inherit: ['瞬間的で小さい接触mark', '紙傷・小インク点・暖色spark'],
    doNotInherit: ['projectile本体の長い軸', 'death effectの広い散り', '白flash'],
    runtimeReadabilityContract: ['enemy被弾点だけを短く示す', '高密度でenemy silhouetteを覆わない'],
    prohibitedExpressions: ['画面flash', '大きな爆発', '長寿命ring', 'deathと同じ散布範囲'],
  },
  'enemy-death-effect': {
    status: 'composite',
    references: [...sharedReferences, ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-ink-burst.png', 'shape'], ['docs/design-targets/generated/unity-u45-1/screenshots/09-onbu-death.png', 'runtime-size']],
    inherit: ['紙片と黒インクの散り', 'hitより一段広い消滅輪郭'],
    doNotInherit: ['rare演出の全画面性', 'hit effectの小ささ', '長く残るdead sprite mask'],
    runtimeReadabilityContract: ['enemy消滅を認識できる', '高密度でも戦闘中央を覆い続けない'],
    prohibitedExpressions: ['全画面burst', '大量の白光', '長寿命煙', 'gore'],
  },
  'movement-trail': {
    status: 'composite',
    references: [...sharedReferences, ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-collect-trail.png', 'shape'], ['docs/design-targets/generated/unity-u45-1/screenshots/03-yui-walk-right.png', 'runtime-size']],
    inherit: ['短く静かな移動方向cue', '紙粉・小インク・弱い灯粒'],
    doNotInherit: ['damage area', '黒耀化専用強表現', 'projectileの鋭い軸'],
    runtimeReadabilityContract: ['player本体とjoystickを隠さない', 'enemy・projectile・pickupと識別できる'],
    prohibitedExpressions: ['長いbeam', 'damage判定を示すring', '強い発光', '常時画面残留'],
  },
};

type CandidateSeed = {
  id: string;
  role: string;
  sourceType: 'existing' | 'generated-from-master' | 'procedural-authored' | 'reconstructed';
  parentPaths: string[];
  recipe: string;
};

const candidates: Record<string, CandidateSeed[]> = {
  'player-yui': [
    { id: 'player-yui-a-runtime-baseline', role: 'runtime-baseline', sourceType: 'existing', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet.png'], recipe: 'copy-sheet' },
    { id: 'player-yui-b-silhouette', role: 'silhouette-improvement', sourceType: 'generated-from-master', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet.png'], recipe: 'sheet-outline' },
    { id: 'player-yui-c-lantern-bag', role: 'readability-improvement', sourceType: 'generated-from-master', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet.png'], recipe: 'sheet-lantern-bag-contrast' },
    { id: 'player-yui-d-paper-ink', role: 'lineage-rebuild', sourceType: 'generated-from-master', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet.png'], recipe: 'sheet-paper-ink-texture' },
  ],
  'enemy-onbu': [
    { id: 'enemy-onbu-a-runtime-baseline', role: 'runtime-baseline', sourceType: 'existing', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet.png'], recipe: 'copy-sheet' },
    { id: 'enemy-onbu-b-silhouette', role: 'silhouette-improvement', sourceType: 'generated-from-master', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet.png'], recipe: 'sheet-outline' },
    { id: 'enemy-onbu-c-sprout-mist', role: 'readability-improvement', sourceType: 'generated-from-master', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet.png'], recipe: 'sheet-sprout-mist-contrast' },
    { id: 'enemy-onbu-d-ink-death', role: 'lineage-rebuild', sourceType: 'generated-from-master', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet.png'], recipe: 'sheet-ink-death-texture' },
  ],
  'stage1-background': [
    { id: 'stage1-background-a-procedural-baseline', role: 'runtime-baseline', sourceType: 'reconstructed', parentPaths: ['unity/VampPonUnity/Assets/_Project/Scripts/Runtime/ProceduralSpriteFactory.cs'], recipe: 'procedural-paper-baseline' },
    { id: 'stage1-background-b-paper-map', role: 'paper-map-priority', sourceType: 'generated-from-master', parentPaths: ['assets/reference/backgrounds/stage1_night_tile_reference.png'], recipe: 'background-paper-map' },
    { id: 'stage1-background-c-night-street', role: 'night-street-priority', sourceType: 'generated-from-master', parentPaths: ['assets/concept-design/01_world/world_night-town_01.png'], recipe: 'background-night-street' },
    { id: 'stage1-background-d-balanced', role: 'readability-improvement', sourceType: 'generated-from-master', parentPaths: ['public/assets/prototypes/backgrounds/stage-01/environment-master.png'], recipe: 'background-balanced' },
  ],
  'exp-pickup': [
    { id: 'exp-pickup-a-runtime-baseline', role: 'runtime-baseline', sourceType: 'existing', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-exp-fragment.png'], recipe: 'fit-single-sprite' },
    { id: 'exp-pickup-b-paper-fragment', role: 'paper-fragment', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-exp-paper-fragment' },
    { id: 'exp-pickup-c-small-crystal', role: 'small-crystal', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-exp-small-crystal' },
    { id: 'exp-pickup-d-ink-light-hybrid', role: 'readability-improvement', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-exp-ink-light-hybrid' },
  ],
  'healing-pickup': [
    { id: 'healing-pickup-a-dawn-drop', role: 'dawn-drop', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-healing-dawn-drop' },
    { id: 'healing-pickup-b-bandaged-paper-charm', role: 'bandaged-paper-charm', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-healing-paper-charm' },
    { id: 'healing-pickup-c-warm-lantern-dew', role: 'warm-lantern-dew', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-healing-lantern-dew' },
    { id: 'healing-pickup-d-restorative-bottle', role: 'small-restorative-bottle', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-healing-restorative-bottle' },
  ],
  'common-projectile': [
    { id: 'common-projectile-a-lantern-spark', role: 'runtime-baseline', sourceType: 'existing', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-lantern-spark.png'], recipe: 'fit-projectile-baseline' },
    { id: 'common-projectile-b-pencil-slash', role: 'pencil-slash', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-projectile-pencil' },
    { id: 'common-projectile-c-paper-streak', role: 'paper-streak', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-projectile-paper' },
    { id: 'common-projectile-d-ink-line', role: 'ink-line', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-projectile-ink' },
  ],
  'hit-effect': [
    { id: 'hit-effect-a-runtime-baseline', role: 'runtime-baseline', sourceType: 'reconstructed', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-lantern-spark.png'], recipe: 'derive-hit-baseline' },
    { id: 'hit-effect-b-paper-nick', role: 'paper-nick', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-hit-paper-nick' },
    { id: 'hit-effect-c-ink-pinprick', role: 'ink-pinprick', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-hit-ink-pinprick' },
    { id: 'hit-effect-d-lantern-cross', role: 'readability-improvement', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-hit-lantern-cross' },
  ],
  'enemy-death-effect': [
    { id: 'enemy-death-effect-a-runtime-baseline', role: 'runtime-baseline', sourceType: 'existing', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-ink-burst.png'], recipe: 'fit-death-baseline' },
    { id: 'enemy-death-effect-b-paper-scatter', role: 'paper-scatter', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-death-paper-scatter' },
    { id: 'enemy-death-effect-c-ink-dissolve', role: 'ink-dissolve', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-death-ink-dissolve' },
    { id: 'enemy-death-effect-d-paper-ink-burst', role: 'readability-improvement', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-death-paper-ink' },
  ],
  'movement-trail': [
    { id: 'movement-trail-a-runtime-baseline', role: 'runtime-baseline', sourceType: 'existing', parentPaths: ['unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-collect-trail.png'], recipe: 'fit-trail-baseline' },
    { id: 'movement-trail-b-pencil-dust', role: 'pencil-dust', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-trail-pencil-dust' },
    { id: 'movement-trail-c-paper-flecks', role: 'paper-flecks', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-trail-paper-flecks' },
    { id: 'movement-trail-d-lantern-motes', role: 'readability-improvement', sourceType: 'procedural-authored', parentPaths: ['docs/design-targets/generated/top-final.png'], recipe: 'draw-trail-lantern-motes' },
  ],
};

const canonicalKeys: Record<string, string | null> = {
  'player-yui': 'character:yui:sprite_sheet_180',
  'enemy-onbu': 'enemy:ombu_small_ink:sprite_sheet_180',
  'stage1-background': 'stage:forgotten_street:background_390x844',
  'exp-pickup': 'item:field_drop_memory_fragment:pickup_32',
  'healing-pickup': 'item:field_drop_morning_dew:pickup_32',
  'common-projectile': null,
  'hit-effect': null,
  'enemy-death-effect': null,
  'movement-trail': null,
};

const groupPrompts: Record<string, string> = {
  'player-yui': 'Preserve the existing 8x6 animation frames and Yui identity; compare silhouette, lantern/bag readability, and paper/ink integration only.',
  'enemy-onbu': 'Preserve the existing 8x6 Onbu animation and arm-less small-enemy identity; compare silhouette, sprout/mist readability, and ink/death compatibility only.',
  'stage1-background': 'Create a quiet portrait Stage1 night-street paper-map background with an unobstructed low-detail combat center and limited warm lantern accents.',
  'exp-pickup': 'Create a small memory-fragment pickup that stays distinct from healing and candidate crystals at gameplay size.',
  'healing-pickup': 'Create a small manual healing pickup in the night-paper-dawn-light world; do not use a generic red heart or medical cross.',
  'common-projectile': 'Create a short directional normal-attack projectile; keep it distinct from hit, death, trail, pickup, and ground-area visuals.',
  'hit-effect': 'Create a very small instantaneous enemy-hit mark that remains distinct from projectile and death visuals at high density.',
  'enemy-death-effect': 'Create a restrained paper-and-black-ink enemy disappearance effect, stronger than hit but below rare effects.',
  'movement-trail': 'Create a short quiet movement-direction cue that never implies damage and does not cover Yui or joystick space.',
};

const goldenOutput = Object.entries(golden).map(([assetGroup, value]) => ({
  assetGroup,
  goldenReferenceStatus: value.status,
  references: value.references.map(([path, role]) => ({ path, sha256: sha256(path), role })),
  inherit: value.inherit,
  doNotInherit: value.doNotInherit,
  runtimeReadabilityContract: value.runtimeReadabilityContract,
  prohibitedExpressions: value.prohibitedExpressions,
  approvedForReference: value.status !== 'missing',
  approvedForRuntime: false,
  humanApprovedGoldenReference: false,
}));

const recipes = Object.entries(candidates).flatMap(([assetGroup, values]) => values.map((candidate) => ({
  recipeId: candidate.id,
  assetGroup,
  operation: candidate.recipe,
  toolPath: 'scripts/unity/build-u48-batch-a-candidates.py',
  toolVersion: '1',
  deterministic: true,
  parameters: { outputCellSize: 180, quantization: 'nearest-neighbor', seed: 4801 },
})));

const generationContracts = Object.entries(candidates).flatMap(([assetGroup, values]) => {
  const reference = goldenOutput.find((entry) => entry.assetGroup === assetGroup)!;
  const canonicalKey = canonicalKeys[assetGroup];
  const canonicalContract = canonicalKey ? assetGenerationContractByKey.get(canonicalKey) : undefined;
  const canonicalPrompt = canonicalKey ? assetFactoryPromptByKey.get(canonicalKey) : undefined;
  return values.map((candidate) => {
    const outputPath = `${candidateRoot}/${assetGroup}/${candidate.id}.png`;
    const outputExists = (recordedGroups === null || recordedGroups.has(assetGroup)) && existsSync(resolve(root, outputPath));
    const builtOutput = buildManifest?.outputs?.find((value: { path: string }) => value.path === outputPath);
    const lineageStatus = outputExists
      ? candidate.sourceType === 'existing' || candidate.sourceType === 'reconstructed' ? 'reconstructed-partial' : 'complete'
      : 'unknown';
    return {
      schemaVersion: 1,
      assetGroup,
      candidateId: candidate.id,
      candidateRole: candidate.role,
      sourceType: candidate.sourceType,
      goldenReferenceStatus: reference.goldenReferenceStatus,
      goldenReferencePaths: reference.references.map((value) => value.path),
      goldenReferenceSha256: reference.references.map((value) => value.sha256),
      parentSourcePaths: candidate.parentPaths,
      parentSourceSha256: candidate.parentPaths.map(sha256),
      canonicalPromptCatalogKey: canonicalKey,
      canonicalContractId: canonicalContract?.contractId ?? null,
      generationTool: 'scripts/unity/build-u48-batch-a-candidates.py',
      generationToolVersion: '1',
      recipePath: 'docs/design-targets/generated/unity-u48/batch-a/generation-recipes.json',
      recipeId: candidate.id,
      promptPath: `docs/design-targets/generated/unity-u48/batch-a/prompts/${candidate.id}.txt`,
      promptSha256: null,
      createdAtUtc: outputExists ? buildManifest?.generatedAtUtc ?? null : null,
      outputPath,
      outputSha256: outputExists ? builtOutput?.sha256 ?? sha256(outputPath) : null,
      targetImportContract: {
        format: 'PNG RGBA', filterMode: 'Point', compression: 'None', mipmap: false,
        spriteMode: assetGroup === 'player-yui' || assetGroup === 'enemy-onbu' ? 'Multiple' : 'Single',
        ppu: assetGroup === 'player-yui' ? 150 : assetGroup === 'enemy-onbu' ? 120 : assetGroup === 'stage1-background' ? 64 : 100,
        pivot: assetGroup === 'player-yui' ? [0.5, 0.02] : assetGroup === 'enemy-onbu' ? [0.5, 0.08] : [0.5, 0.5],
      },
      runtimeContract: {
        viewportReference: '390x844 portrait',
        worldSizeUnchanged: true,
        gameplayValuesUnchanged: true,
        frameGrid: assetGroup === 'player-yui' || assetGroup === 'enemy-onbu' ? { columns: 8, rows: 6, cellWidth: 180, cellHeight: 180 } : null,
      },
      automaticQaContract: [
        'file exists and PNG is RGBA', 'source/output SHA-256 match', 'duplicate content hash excluded', '.meta exists and GUID is unique',
        'Point filter, no compression, mipmap off', 'finite non-empty bounds and edge-contact review', 'gameplay-size contrast review',
      ],
      canonicalPrompt: canonicalPrompt?.prompt ?? groupPrompts[assetGroup],
      lineageStatus,
      humanReviewStatus: 'pending',
      approvedAsFinal: false,
      runtimeApproved: false,
    };
  });
});

mkdirSync(outputRoot, { recursive: true });
mkdirSync(resolve(outputRoot, 'prompts'), { recursive: true });
for (const contract of generationContracts) {
  const prompt = `${groupPrompts[contract.assetGroup]}\nCandidate role: ${contract.candidateRole}.\nInherit: ${golden[contract.assetGroup].inherit.join('; ')}.\nAvoid: ${golden[contract.assetGroup].prohibitedExpressions.join('; ')}.\n`;
  writeFileSync(resolve(root, contract.promptPath), prompt);
  contract.promptSha256 = sha256(contract.promptPath);
}
writeFileSync(resolve(outputRoot, 'golden-references.json'), `${JSON.stringify({ schemaVersion: 1, sourceHead, batch: 'A', assetGroupCount: goldenOutput.length, entries: goldenOutput }, null, 2)}\n`);
writeFileSync(resolve(outputRoot, 'generation-recipes.json'), `${JSON.stringify({ schemaVersion: 1, sourceHead, toolVersion: '1', recipes }, null, 2)}\n`);
writeFileSync(resolve(outputRoot, 'generation-contracts.json'), `${JSON.stringify({ schemaVersion: 1, sourceHead, batch: 'A', assetGroupCount: 9, candidateCount: generationContracts.length, contracts: generationContracts }, null, 2)}\n`);
console.log(`U48 Batch A contracts generated: ${goldenOutput.length} groups, ${generationContracts.length} candidate contracts.`);
