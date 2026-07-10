# Unity U45.1 Character and Enemy Dot Runtime Pass

## 結論

Stage1のproof用Single sprite経路を、`RuntimeVisualAssetProvider`と`Stage1RuntimeVisualAssetRegistry`を使う48フレームMultiple sprite経路へ置換した。ユイはidle / walk / hurt / attack、オンブはidle / move / hurt / deathを実際のSprite差し替えで再生する。

U45.1の最低runtime要件は満たしたため、`characterDotRuntimeReady`、`characterAnimationReady`、`enemyDotRuntimeReady`、`enemyAnimationReady`、`runtimeVisualReady`はtrueとする。ただし、これは候補素材を使うStage1 runtime経路の準備完了であり、最終美術承認ではない。

## Runtime構成

- provider: `RuntimeVisualAssetProvider`
- registry: `RuntimeVisuals/Stage1/Stage1RuntimeVisualAssetRegistry`
- player animator: `YuiSpriteAnimator`
- enemy animator: `OnbuSpriteAnimator`
- player source: `public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png`
- enemy source: `public/assets/prototypes/sprite-sheets/enemies-original/enemy-ombu-small-sheet-v2-1440x1080.png`
- import: Multiple / Point / mipmap off / uncompressed / FullRect
- grid: 8 x 6、180 x 180、48 frames

`U5ProofAssetProvider`はコード上に比較・proof境界として残すが、Stage1 product routeでは使用しない。character/enemy required spriteが欠けた場合は例外にし、procedural fallbackへ黙って戻さない。

## Directionと装備継続

ユイの左右は`flipX`で反転せず、left/right専用frame配列を使用する。既存source manifestのwalk左右ラベルが実画と逆だったため、builderのslice名を実際の向きに合わせて修正した。

- right input: screen-right向きframe
- left input: screen-left向きframe
- input release: 最後のfacingを保ったidle
- lantern: 各方向・各状態で手元に残る
- `SpriteRenderer.flipX=false`

## Enemy lifecycle

オンブはmove、hurt、deathを別frame群で再生する。death開始後はtarget不可とし、death animation完了後にpoolへ返す。再spawn時はidle frame 0、通常色、通常scale、`IsDying=false`へ戻す。

## Deterministic asset path

`U451RuntimeDotAssetBuilder`がsource copy/quantize、48分割、PPU/pivot/import設定、registry、lineage manifestを再生成する。sprite IDはasset pathとframe名のSHA-256由来で固定し、再生成で参照IDが揺れない。

Yuiはsourceをそのまま候補runtimeへ複製する。Onbuは3 x 3 blockのnearest-color量子化を決定的に適用する。sourceは上書きしない。

## Readiness boundary

true:

```txt
characterDotRuntimeReady
characterAnimationReady
enemyDotRuntimeReady
enemyAnimationReady
runtimeVisualReady
```

false:

```txt
playerAssetApprovedAsFinal
playerAssetRuntimeApproved
enemyAssetApprovedAsFinal
enemyAssetRuntimeApproved
productionCharacterAssetReady
productionEnemyAssetReady
devicePlayableReady
mobileMetricsReady
audioMixerReady
audioLatencyMeasured
hapticMeasured
rcReady
productionApproved
```

## Evidence

- `docs/design-targets/generated/unity-u45-1/runtime-dot-readiness.json`
- `docs/design-targets/generated/unity-u45-1/asset-validation.json`
- `docs/design-targets/generated/unity-u45-1/animation-smoke-result.json`
- `docs/design-targets/generated/unity-u45-1/visual-review.json`
- `docs/design-targets/generated/unity-u45-1/screenshots/`
- `unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/runtime-dot-manifest.json`

## Remaining

実機での見え方、touch、実音、haptic、thermal/performance、最終美術品質は未確認。U46ではこのprovider/animation/pause経路を壊さず、Result / Retry / StageSelect / Collectionを進める。
