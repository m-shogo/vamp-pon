# ヨルノシルベ Technical Art / Asset Pipeline Specification v1

Date: 2026-07-28
Status: **PROPOSED / DOCUMENTATION-ONLY / IMPLEMENTATION BLOCKED**
Repository: `m-shogo/vamp-pon`
Art direction: `QUIET_NIGHT_SMALL_WARMTH`

## 1. 目的

画像生成後の作り直しを減らすため、master制作、candidate管理、cleanup、Unity import、atlas、performance、rollbackまでを実装前に固定する。

この文書は画像生成やUnity変更を許可するものではない。

## 2. Asset classes

| Class | 用途 | 例 |
| --- | --- | --- |
| Composition reference | whole-screenの構成と雰囲気 | TOP完成見本 |
| Component board | family全体の形とstate | LevelUp card family |
| Runtime component | Unityで直接使用 | 9-slice panel、icon |
| Background layer | scene background | StageSelect night road |
| Ornament | 装飾・seal・ink edge | lantern marker |
| Motion reference | animationのkey pose | paper enter、ink spread |
| Store surface | App Store等 | icon、screenshots |

Composition referenceはruntimeへ一枚貼りしない。

## 3. Directory policy

```txt
docs/design-targets/generated/design-production/briefs/
docs/design-targets/generated/design-production/references/
docs/design-targets/generated/design-production/candidates/
docs/design-targets/generated/design-production/comparison-packs/
docs/design-targets/generated/design-production/decisions/
docs/design-targets/generated/design-production/registries/

unity/VampPonUnity/Assets/_Project/Art/UI/Source/
unity/VampPonUnity/Assets/_Project/Art/UI/Approved/
unity/VampPonUnity/Assets/_Project/Art/UI/Runtime/
unity/VampPonUnity/Assets/_Project/Art/UI/Atlases/
```

Unity側directoryは実装開始後に既存構造を確認して最小差分で確定する。現時点では予約名であり作成しない。

## 4. Naming

```txt
<family>_<role>_<state>_<size>_v<revision>.<ext>
```

例:

```txt
paper_card_normal_512_v01.png
paper_card_selected_512_v01.png
stage_node_locked_256_v02.png
icon_weapon_lantern_180_v03.png
```

禁止:

- `final.png`だけで承認を表す
- `new2`、`fix-final`、`latest`
- 日本語と英語の無秩序な混在
- stateをfilenameから判断できないasset

承認状態はregistryで管理する。

## 5. Master dimensions

| Asset family | Source master | Runtime target | 備考 |
| --- | ---: | ---: | --- |
| Whole-screen reference | 1170x2532 | reference only | 390x844の3倍 |
| Full background | 1170x2532 | device tier別 | crop safe zone必須 |
| Large panel | 1536px long edge | 512〜1024 | 9-slice前提 |
| Card surface | 1024x1536 | 256〜512 | aspect固定 |
| Button surface | 1024x384 | 256〜512 | 9-slice |
| Stage node | 768x768 | 128〜256 | state差を含む |
| UI icon | 512x512 | 24〜180 | silhouette確認 |
| Seal / ornament | 512〜1024 | 64〜256 | alpha edge確認 |
| Particle sprite | 256〜512 | 32〜128 | atlas優先 |

既存inventory original 180px運用など、既存契約があるfamilyは既存値を優先する。

## 6. Image format

- Source master: lossless PNG、必要に応じてlayered sourceをGit外または許可されたsource領域で管理。
- Runtime: PNG RGBA、sRGB。
- Alpha: straight alphaを標準とし、premultiplied alphaを使うshaderでは明示記録する。
- Transparent edge: 最低4px、atlas/scaleを考慮して8px推奨。
- Color profile: sRGB IEC61966-2.1相当。
- Mipmap: UIは原則OFF。背景で縮小表示が多い場合のみ検証後ON。
- Filter: UI soft surfaceはBilinear、gameplay pixel spriteはPoint。
- Wrap: UIはClamp。
- Compression: readable text edgeやink edgeを壊さない設定。iOS実機比較で決める。

## 7. 9-slice

対象:

- panel
- button
- card
- modal frame
- HUD plate
- stage info panel

必須記録:

```txt
source dimensions
runtime dimensions
border left/right/top/bottom
minimum supported size
maximum recommended size
corner distortion review
center tile/stretch policy
```

角や破れが伸びるassetは不合格。

## 8. Pivot / PPU

- UI RectTransform中心基準を基本とする。
- Directional ornamentやroute nodeは用途別pivotをregistryへ記録する。
- PPUは既存UI contractへ合わせ、family内で統一する。
- Pixel gameplay assetとsoft UI assetのPPUを混同しない。
- PPU変更で見た目を合わせる場当たり修正は禁止。

## 9. Atlas policy

### 9.1 Atlas separation

```txt
UI_Core
UI_Navigation
UI_Cards
UI_HUD
UI_ResultCollection
UI_SpecialStates
VFX_UI
Backgrounds
```

実際の分割は使用頻度、scene residency、memory計測で確定する。

### 9.2 Budget proposal

| 項目 | 初期上限 |
| --- | ---: |
| 1 atlas最大 | 2048x2048を基本、4096は要根拠 |
| 常駐UI atlas | 2〜3枚目安 |
| 画面固有atlas | 1枚目安 |
| atlas padding | 4px minimum / 8px preferred |
| 同一画面UI material | 3以下目安 |
| mask nesting | 2階層以下 |
| blur | realtime多用禁止 |
| distortion | 黒耀化等special限定 |

## 10. Technical art budget

### 10.1 Screen budget proposal

| Screen | UI draw calls目安 | 常時particle | 瞬間particle | 特記事項 |
| --- | ---: | ---: | ---: | --- |
| TOP | 12以下 | 20以下 | 60以下 | 背景静止寄り |
| StageSelect | 18以下 | 30以下 | 80以下 | scroll中のoverdraw注意 |
| Battle HUD | 16以下 | HUD側10以下 | gameplay側契約優先 | battlefieldを隠さない |
| LevelUp | 18以下 | 15以下 | 80以下 | modal dimとcard重なり |
| Result | 18以下 | 20以下 | 100以下 | one-shot reveal中心 |
| Collection | 20以下 | 10以下 | 40以下 | scrollとmask注意 |

数値はU50計測前の設計上限であり、device測定で校正する。

### 10.2 Overdraw

- 半透明paperを重ねすぎない。
- Full-screen dim、fog、glowの重複を最大3層までに制限する。
- scroll view内の見えない装飾はdisableまたはcullする。
- Battleでは画面中央のoverdrawを最優先で抑える。

### 10.3 Shader / material

- UI共通shaderを優先する。
- special shaderはEvolution、黒耀化、dawn等へ限定。
- 画面固有material instance乱立を禁止。
- Mask、soft clip、glowを1componentへ重ねすぎない。

## 11. Performance fallback

低性能、発熱、reduced-motion時:

```txt
particle amount 50%以下
lantern pulseをstatic haloへ
paper parallax停止
ink animationをstatic stateへ
background drift停止
rare revealの移動距離縮小
blurをflat dimへ
```

情報、state、操作結果は失わない。

## 12. Candidate lifecycle

```txt
BRIEF_DRAFT
BRIEF_APPROVED
DIRECTION_CANDIDATE
DIRECTION_SELECTED
COMPONENT_CANDIDATE
CLEANUP_REQUIRED
COMPONENT_APPROVED
COMMERCIAL_USE_REVIEWED
RUNTIME_READY
RUNTIME_INTEGRATED
SIMULATOR_PASS
DEVICE_PASS
PRODUCTION_APPROVED
REJECTED
SUPERSEDED
```

途中状態を飛ばさない。

## 13. Cleanup checklist

生成candidateをcomponentへする前に確認する。

- AI文字、数字、擬似labelを除去
- 不自然な左右非対称を意図確認
- border thicknessをfamily内統一
- transparent edgeのhalo除去
- alpha fringe除去
- color profile確認
- repeated artifact除去
- corner/edgeを9-slice用に再構成
- state variant間のgeometryを揃える
- small-size silhouette確認
- 390x844での実寸確認
- Compact/Largeでのstretch確認
- source/output hash記録
- human edits記録
- commercial use review記録

## 14. Import checklist

- Texture Type
- Sprite Mode
- PPU
- Mesh Type
- Pivot
- Border
- Filter Mode
- Compression
- Mipmap
- Wrap Mode
- Alpha handling
- Atlas assignment
- Addressable/Resources ownership
- scene residency
- duplicate check
- GUID/meta check

Import設定を見た目合わせのために個別変更せず、family policyへ戻す。

## 15. Rollback

実装単位ごとに以下を残す。

```txt
baseline commit
asset registry revision
prefab/theme files touched
screens affected
before captures
after captures
rollback commit or revert scope
save/runtime contract impact
```

Visual差し替えでgameplay、save、navigation、U49 evidenceを変更しない。

## 16. Gate

画像生成開始前:

```txt
technicalArtBudgetDefined=true
exportSpecificationDefined=true
namingConventionDefined=true
atlasPolicyDefined=true
fallbackPresentationDefined=true
cleanupProcessDefined=true
```

Unity実装開始前:

```txt
componentCandidateApproved=true
cleanupComplete=true
commercialUseReviewed=true
assetLineageRecorded=true
importPolicyMapped=true
performanceRiskReviewed=true
rollbackPlanDefined=true
```

## 17. 現在判定

```txt
TechnicalArtBudget=PROPOSED
ExportSpecification=PROPOSED
AtlasPolicy=PROPOSED
CleanupProcess=DEFINED
ImageGenerationStarted=false
UnityImplementationStarted=false
HumanTechnicalApproval=NOT_REQUIRED_YET
NextAction=COMPLETE_STATE_SCREEN_ACCESSIBILITY_DOCUMENTS
```
