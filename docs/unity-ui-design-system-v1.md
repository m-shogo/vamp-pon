# ヨルノシルベ Unity UI Design System v1

<!-- CURRENT_STATE_BEGIN -->
```json
{
  "schemaVersion": 1,
  "currentPhase": "U49 actual-device audio/haptic",
  "nextPhase": "U50 performance/touch metrics",
  "thenPhase": "U51 RC",
  "runtimeVisualReady": true,
  "physicalDeviceReady": false,
  "devicePlayableReady": false,
  "audioMixerImplemented": true,
  "audioMixerDeviceVerified": false,
  "audioReady": false,
  "audioLatencyMeasured": false,
  "hapticReady": false,
  "hapticMeasured": false,
  "u50ThresholdsDefined": false,
  "mobileMetricsReady": false,
  "rcReady": false,
  "productionApproved": false
}
```
<!-- CURRENT_STATE_END -->

U46 Result/灯録は`Resources/U46Candidates/UI`のtyped Candidate catalog、9-slice、Safe Area、Compact/Standard/Large reviewを採用した。final/runtime承認ではない。

Date: 2026-07-10
Status: adopted foundation / U46 onward source of truth

## 目的

画面追加のたびに色、余白、文字サイズ、ボタン、カード、画像import設定を作り直さない。
Codexや人間が新しい画面を実装しても、既存画面と同じ品質・操作性・世界観を再利用できる状態を作る。

この文書はUnity UIの正本であり、古いproofや個別画面のローカル値と矛盾する場合は本書を優先する。

## 採用方針

- runtime UIはuGUIを維持する。
- UI ToolkitはEditor専用のComponent Catalogや検査UIに限定する。
- 既存のU43 pause/input/tap guardとU45 candidate UIを壊さない。
- 生成画像はcandidateであり、final承認前に画面全体へ直貼りしない。
- 9-slice、Theme、Visual State、Responsive Layout、Prefab Variant、Import Policyを組み合わせる。
- 深い抽象化や外部UIフレームワークは導入しない。

## Source of truth

| Layer | Source |
| --- | --- |
| Static fallback tokens | `Assets/_Project/Scripts/UI/AppQualityStyleTokens.cs` |
| ScriptableObject Theme | `Assets/_Project/Scripts/UI/YorunoShirubeUiTheme.cs` |
| Runtime theme loader | `Assets/_Project/Scripts/UI/UiThemeRuntime.cs` |
| Visual State | `Assets/_Project/Scripts/UI/UiVisualState.cs` |
| Responsive Layout | `Assets/_Project/Scripts/UI/ResponsiveLayoutProfile.cs` |
| Shared uGUI factory | `Assets/_Project/Scripts/UI/AppQualityUiFactory.cs` |
| Component Catalog | `Assets/_Project/Scripts/Editor/U46UiComponentCatalogWindow.cs` |
| Asset/bootstrap | `Assets/_Project/Scripts/Editor/U46UiDesignSystemBootstrap.cs` |
| Import validation | `Assets/_Project/Scripts/Editor/UiSpriteImportPolicyValidator.cs` |
| Static repository checker | `scripts/quality/check-unity-ui-design-system.ts` |

Unity paths above are relative to `unity/VampPonUnity/`。

## 1. 9-slice

紙パネル、ボタン、カード、HUD枠、inventory slotはSprite Borderを設定し、uGUI `Image.Type.Sliced`で伸縮する。

Stretchable対象:

- StageSelect map panel
- Stage card
- Battle HUD top frame
- Inventory slot
- LevelUp common / rare / evolution card
- Paper button

禁止:

- Borderが0のSpriteをSliced扱いする
- 角や紙の破れを中央領域へ含める
- 画面サイズ別に同じ枠画像を複製する
- 1枚の完成画面画像へ文字やボタンを焼き込む

`AppQualityUiFactory.ResolveImageType`はBorderなしSpriteを`Simple`へ退避し、壊れた9-slice表示を防ぐ。

## 2. ScriptableObject Theme

`YorunoShirubeUiTheme`が以下を一括管理する。

- 紙、インク、ランタン、夜、レア、進化、黒耀化の色
- XS / S / M / L / XLの余白
- Caption / Body / Button / Heading / Titleの文字サイズ
- 最小・快適タップ領域
- Pressed scale
- transition時間

既存UIは`AppQualityStyleTokens`をfallbackとして維持する。
新規画面は`UiThemeRuntime.Current`を優先し、Theme assetが未生成でも安全にfallbackする。

Theme asset生成:

```txt
VampPon > UI > Create or Refresh Design System Assets
```

生成先:

```txt
Assets/_Project/Resources/UI/YorunoShirubeUiTheme.asset
```

初期はDefault Theme 1個のみとする。Rare、Morning、黒耀化のTheme assetを大量に分けず、必要になった段階で追加する。

## 3. Visual State

共通状態:

```txt
Normal
Pressed
Selected
Disabled
Locked
New
Rare
Completed
Kokuyou
```

状態は各画面が独自色を直接指定するのではなく、`UiVisualState`からTheme styleへ解決する。

状態で統一するもの:

- background
- border
- text
- alpha
- scale
- interactable
- blocksRaycasts

StageSelect、LevelUp、Collection、Resultで同じ状態名を使用する。

## 4. Responsive Layout

対応tier:

| Tier | 基準 |
| --- | --- |
| Compact | 360x800 / 375x812 |
| Standard | 390x844 / 393x852 |
| Large | 412x915 / 430x932 |

固定するもの:

- Safe Area
- tap target minimum
- HUDの役割と最大占有率
- virtual stickの左下位置
- icon aspect ratio
- 読める最小font size

可変にするもの:

- horizontal padding
- card width
- card gap
- panel width
- description height
- secondary spacing

`ResponsiveLayoutProfile`はCompact / Standard / Largeの3段階だけを持つ。端末ごとの個別座標表は作らない。

## 5. Component Catalog

Unityメニュー:

```txt
VampPon > UI > Open Component Catalog
```

Catalogで確認するもの:

- Theme color swatches
- Visual State一覧
- Compact / Standard / Large metrics
- component coverage
- Theme / Responsive assetの存在
- Prefab folderの存在

CatalogはEditor専用。production runtimeへ依存させない。
今後、実Prefab previewとスクリーンショット比較を段階追加する。

## 6. Prefab Variant

採用する基本構造:

```txt
BasePaperButton.prefab
├─ PrimaryButton.prefab
├─ SecondaryButton.prefab
└─ DangerButton.prefab

BasePaperCard.prefab
├─ LevelUpCommon.prefab
├─ LevelUpRare.prefab
└─ LevelUpEvolution.prefab
```

継承は必ずBase → Variantの2階層までにする。
VariantのVariantを連鎖させない。

保存先:

```txt
Assets/_Project/Prefabs/UI/Base
Assets/_Project/Prefabs/UI/Variants
```

Prefab化の対象:

- PaperButton
- PaperCard
- StageCard
- Weapon / Passive / Rare slot
- Result action button
- Collection entry
- Boss warning

既存のruntime生成UIを一度に全面Prefab化しない。U46以降、新規画面と触る画面から移行する。

## 7. Import Policy

UI candidate:

- Texture Type: Sprite
- Mipmap: OFF
- Alpha Is Transparency: ON
- Wrap: Clamp
- Filter: Bilinear
- stretchable parts: Sprite Border必須

Pixel gameplay sprite:

- Texture Type: Sprite
- Mipmap: OFF
- Filter: Point
- Compression: Noneまたは品質確認済み設定
- PPUと表示scaleを正本化

UIとpixel gameplay spriteのimport設定を混ぜない。

Unity検査:

```txt
VampPon > UI > Validate UI Sprite Import Policy
```

repository検査:

```sh
pnpm unity:ui-design-system:check
```

## 8. Sprite Atlas

既存のU36 Sprite Atlas基盤を継続使用する。

推奨group:

```txt
UI-Core
UI-Items
Characters-Stage1
Enemies-Stage1
VFX-Stage1
```

同じ画面・同じ読み込み単位で使うSpriteをまとめる。
全素材を1つの巨大Atlasへ入れない。

## 9. 後で採用するもの

### Pseudo-localization

U46以降、Result・Collectionなど長文が増えた段階で導入する。
翻訳そのものより、文字列を膨らませてclippingと改行崩れを検査する目的を優先する。

### Addressables

Stage1 Vertical Sliceでは導入しない。
キャラ・ステージ・大量assetの読み込み単位が確定した後に再評価する。

### SVG

閉じる、戻る、設定など単純iconだけ候補。
紙、黒インク、ドット質感の主要assetはPNG/Spriteを維持する。

## 10. U46以降の必須workflow

1. Theme tokenを確認する
2. 既存Base componentを選ぶ
3. 差分だけPrefab Variantへ持たせる
4. stretchable assetは9-sliceにする
5. Responsive tierでCompact / Standard / Largeを確認する
6. Component Catalogで状態を確認する
7. Import validatorを通す
8. Editor / Simulator screenshotを比較する
9. candidateをfinal扱いしない
10. checkerを通してcommitする

## 11. 現在の境界

U45 AI-only iOS Simulator smokeとU46 UI Design System readinessは履歴証跡であり、そこで使ったUI candidateはfinal未承認のまま維持する。一方、current全体ではU48で承認された46 production visual assetがruntimeへ接続済みであり、`runtimeVisualReady=true`。この2つを混同しない。

```txt
actualDeviceSmokeResult=NOT_PROVIDED
runtimeVisualReady=true
audioMixerImplemented=true
audioMixerDeviceVerified=false
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
U45UiCandidateAssetsApprovedAsFinal=false
rcReady=false
productionApproved=false
```

このDesign System導入は見た目と開発効率の基盤であり、実機証跡や美術最終承認の代替ではない。
