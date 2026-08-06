# ヨルノシルベ TOP「生きている夜」Production Layer Kit v2

Date: 2026-08-01  
Runtime connection: 2026-08-06  
Status: human-selected composition / runtime-connected candidate / final approval blocked  
Target: Unity `6000.5.1f1`, URP `17.5.0`, portrait iPhone

## 結論

Candidate Aを基準に再制作した17レイヤーを、全画面動画やAI動画へ変換せず、Unity上で独立周期の小さな動きとして接続した。

TOPは通常起動時にStageSelectの前面へ表示される。`夜へ出る`で既存StageSelectへ入り、`灯録`は既存Collectionフローへ接続する。AppFlowの状態・保存・戦闘契約は変更していない。

既存のU46〜U48 Simulator証跡を汚さないため、`VAMPPON_AI_SIMULATOR_SMOKE`ではTOPを生成しない。これは証跡回避ではなく、既存canonical capture denominatorを維持したまま通常起動の新画面を独立検証するための境界である。

## Runtime architecture

```txt
docs/design-targets/generated/top-living-night-v2/layers
  ├─ Editor: 原本をUnityWebRequestTextureで直接読む
  └─ Build: manifestのbytes / SHA-256を検証
             ↓
           Assets/Resources/TopLivingNightへ一時copy
             ↓
           Unity TextureImporterでimport
           - iOS ASTC 6x6
           - Read/Write OFF
           - mipmap OFF
           - Clamp / Bilinear
             ↓
           built playerはResources.Load<Texture2D>で読む
             ↓
           post-buildで生成copyを削除
```

画像の正本はdocs側の1か所だけ。生成ResourcesをGitへ恒久追加しない。TOPを閉じるとRawImage参照を外し、読み込んだResource textureとunused assetsの解放を要求する。

主要実装:

- `unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightView.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightStreamingAssetsSync.cs`
  - legacy filenameを維持しつつ、classは`TopLivingNightBuildAssetSync`
- `unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightUnityVerification.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs`
- `scripts/quality/check-top-living-night-runtime.ts`
- `scripts/quality/check-top-living-night-unity-evidence.ts`
- `scripts/unity/run-top-living-night-unity-verification.sh`

## Layer stack

| Order | File | Role | Runtime motion |
| --- | --- | --- | --- |
| 00 | `00-environment-starless.png` | 人物・火・月・星・雲を除いた完全背景 | fixed clean plate |
| 01 | `01-stars.png` | 星 | low-frequency non-synchronous twinkle |
| 01 | `01-moon.png` | 三日月 | fixed reference point |
| 02 | `02-clouds-far.png` | 遠雲 | slow 2.8px drift |
| 03 | `03-clouds-near.png` | 近雲 | independent 5.2px drift |
| 04 | `04-distant-lights-mask.png` | 駅灯mask | Perlin ±3% brightness |
| 05 | `05-distant-companion.png` | 遠景人物 | static |
| 06 | `06-characters.png` | 主要人物群 | static; face interpolation prohibited |
| 08 | `08-animal-robot.png` | 動物＋ロボット | static body |
| 08 | `08-robot-eye-mask.png` | ロボット眼光mask | rare 47s scan |
| 09 | `09-fire-base.png` | 薪・炭・石輪 | static |
| 10 | `10-fire-flipbook-atlas.png` | 4x3 / 12-frame炎atlas | 8–10fps, adjacent-frame ping-pong + hold |
| 11 | `11-fire-glow-mask.png` | 火の照り返しmask | two-frequency Perlin modulation |
| 12 | `12-smoke-atlas.png` | 3x2 / 6 smoke sprites | low-alpha independent rise/drift |
| 13 | `13-embers-atlas.png` | ember sprites | bounded 10-particle rise/drift |
| 14 | `14-foreground-accents.png` | 前景草・ランタン・紙片 | static source |
| 14 | `14-lantern-glow-mask.png` | 前景ランタンmask | independent low-frequency modulation |

`06-characters.png`は品質とidentityを守るため、全員を無理に動かしていない。焚き火・煙・火の粉・雲・星・遠近の灯りが別周期で動くことで、短い動画ループではない「生きている夜」を作る。

## Reduced Motion

`vamp_pon_reduced_motion=1`または`reduce_motion=1`のとき:

- cloud drift off
- smoke / embers off
- robot eye rare scan off
- fire 4fps
- glow amplitude <= 2%
- titleの小さな浮遊のみ維持

## Preview evidence

- `previews/top-living-night-layered-candidate-360x800.png`
- `previews/top-living-night-layered-candidate-390x844.png`
- `previews/top-living-night-layered-candidate-430x932.png`
- `previews/layer-contact-sheet.png`
- `previews/motion-checkpoints.png`
- `previews/top-living-night-layer-motion-preview.mp4`
- `previews/top-living-night-layer-motion-preview.webp`

MP4/WebPはレビュー証跡のみで、runtimeから参照しない。

## Unity execution evidence

`runtime-unity-verification.json`は、Unity Editorが実際にC#をcompileし、`TopLivingNightUnityVerification.RunBatchmode`を実行できた場合だけ`executed=true / result=PASSED`へ更新される。

未実行時は次を維持する。

```txt
executed=false
result=NOT_RUN
verifiedCommit=""
unityVersion=""
```

実行コマンド:

```bash
bash scripts/unity/run-top-living-night-unity-verification.sh
```

この検証は17素材のbytes / SHA-256 / PNG dimensions、`TopLivingNightView`のcompile surface、pre/post build hookの解決を確認する。画面目視・FPS・実機性能を代替しない。

## Approval boundary

```txt
sourceComposition=candidate-a
humanSelectedCompositionDirection=true
assetStatus=runtime-connected-candidate
layerAssetCount=17
runtimeConnected=true
runtimeUsesVideo=false
videoGenerationUsed=false
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

## Completed in this batch

- 17/17 PNG integrity / dimensions / SHA-256 check
- compact / standard / large static crop preview
- deterministic layered-motion preview
- Unity normal-start TOP connection
- existing StageSelect / Collection navigation reuse
- fire / smoke / ember / cloud / star / light / rare robot-eye motion
- reduced-motion fallback
- Editor source loading
- build-time verified Resources import and cleanup
- iOS ASTC 6x6 / Read-Write OFF / mipmap OFF
- TOP dismissal texture release
- canonical Simulator smoke isolation
- runtime static-contract checker
- Unity execution evidence contract and batchmode runner

## Remaining gates

次は実行環境が必要な確認であり、Git接続だけからPASSへ昇格しない。

- Unity C# compilation evidence (`runtime-unity-verification.json` is currently `NOT_RUN`)
- 360x800 / 390x844 / 430x932 runtime capture
- title / CTA / Safe Area / transparent-edge human review
- 5分の非同期性確認
- Simulator FPS / memory
- physical iPhone FPS / memory / thermal / background-foreground recovery
- formal character identity comparison

PR #76、U49 device evidence、readiness flags、gameplay、balance、save schemaは変更していない。
