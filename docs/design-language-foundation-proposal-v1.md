# ヨルノシルベ Design Language Foundation Proposal v1

Date: 2026-07-28
Status: **PROPOSED / AWAITING HUMAN DIRECTION SELECTION**
Scope: documentation only
Repository: `m-shogo/vamp-pon`
Runtime source inspected: `integration/u49-pr75-integrity-20260727`

## 1. 目的

この文書は、画像生成やUnity実装を始める前に、ヨルノシルベの最終Design Languageを具体化するための提案正本である。

今回は次を行わない。

- 画像生成。
- 既存画像の加工。
- Unity runtime、Scene、Prefab、ScriptableObjectの変更。
- Design LanguageのLOCK。
- Whole-app visual approval。

既存コードの現在値と、最終品質へ向けた提案値を分離し、人間判断が必要な箇所だけを明示する。

## 2. 読み取り元

- `unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityStyleTokens.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/UI/YorunoShirubeUiTheme.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/UI/ResponsiveLayoutProfile.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/UI/UiVisualState.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/Editor/U4FontSetup.cs`
- `docs/unity-ui-design-system-v1.md`
- `docs/design-heavy-production-future-roadmap-2026-07-27.md`
- `docs/design-heavy-production-next-chat-handoff-2026-07-27.md`
- `docs/design-production-completeness-gates-v1.md`

## 3. 現行実装から確認できた基礎

### 3.1 現行token

| 領域 | 現行値 |
| --- | --- |
| Reference | 390x844 |
| Tap target | minimum 44 / comfortable 56 |
| Spacing | 4 / 8 / 16 / 24 / 32 |
| Typography | Caption 12 / Body 14 / Button 16 / Heading 22 / Title 28 |
| Motion | Fast 0.12s / Standard 0.20s / Pressed scale 0.96 |
| Responsive | Compact / Standard / Large |
| Font asset | Zen Maru Gothic Medium SDF |
| State | Normal / Pressed / Selected / Disabled / Locked / New / Rare / Completed / Kokuyou |

### 3.2 現行palette概算

| Token | Current hex equivalent | 現在の役割 |
| --- | --- | --- |
| PaperBase | `#D6C294` | 通常紙面 |
| PaperRaised | `#F0E3CC` | 選択・浮いた紙面 |
| PaperEdge | `#785733` | 紙端・border |
| InkText | `#17120F` | 本文ink |
| SecondaryText | `#4D3B2E` | 注釈 |
| WarmLantern | `#FFA13D` | 暖色accent |
| QuietNight | `#080707` | 夜背景 |
| Rare | `#D19447` | Rare |
| Evolution | `#A673C7` | Evolution |
| Disabled | `#57504A` | Disabled |
| Completed | `#80AD75` | Completed |
| Kokuyou | `#1C1224` | 黒耀化 |

### 3.3 現行基礎の評価

残すべき点:

- 390x844を基準にしたresponsive設計。
- 44 / 56のtap contract。
- 4 / 8基準のspacing。
- Theme、Visual State、Responsive Layoutを分離した構造。
- Zen Maru Gothicの日本語font assetが既に存在すること。
- 生成画面画像をreferenceに限定するruntime boundary。

不足している点:

- Colorが用途名ではなくsurface色中心で、面積比・使用上限がない。
- State差が主に色、alpha、scaleだけで、正式asset・形・光・ink意味へ接続されていない。
- Typographyが5段階だけで、数字、lore、status、card titleなどのroleが足りない。
- Paper、Ink、Lanternの意味・密度・禁止条件が実装値になっていない。
- Motionが2 durationだけで、画面遷移、rare、黒耀化、reduced motionが未定義。
- Icon familyの線幅、色数、plate、silhouetteが未定義。

## 4. 人間判断が必要な最初の一点

最初に選ぶのは、全画面へ共通する**感情の基調**だけとする。

### A. 静かな夜と小さな温かさ — 推奨

- 夜は深いが、怖さより安心と好奇心を残す。
- 紙は落ち着いた古紙だが、汚れすぎない。
- ランタン光を重要箇所だけに置く。
- ヨルノシルベの「小さな光」「朝」へ自然につながる。
- 長時間遊んでも疲れにくく、mobile商品として展開しやすい。

### B. 寂しく幻想的な夜

- 青紫・霧・遠い光を強める。
- 記憶喪失や忘れ物の寂しさを前面に出す。
- 固有性は強いが、文字可読性と親しみやすさの管理が難しい。

### C. 親しみやすい夜の絵本

- 紙の明るさと丸みを少し増やす。
- 暗さを抑え、初見の入りやすさを優先する。
- 幅広い層へ伝わりやすいが、幼く見える危険を管理する必要がある。

この判断が未回答の間は、以下を`PROPOSED_SHARED_BASE`として深められるが、最終Color、Paper、Lantern、Typographyの印象はLOCKしない。

## 5. 全方向共通の非交渉ルール

どの方向を選んでも次は固定する。

1. 通常画面は静か、特別演出だけ強くする。
2. Night / Paper / Inkを1画面の主成分にする。
3. 常時使うaccentは原則1〜2色まで。
4. LanternはPrimary、Current、New、Rare、Restoredの意味に限定する。
5. 黒インクはLocked、Forgotten、Corrupted、Sealed、黒耀化侵食に限定する。
6. 色だけでstateを区別しない。
7. AI文字、固定label、説明文を画像へ焼き込まない。
8. Character、Enemy、UI、Backgroundの描線密度を接続する。
9. Generic fantasy gold frame、宝石、neonを禁止する。
10. 390x844で可読性を確認するまで承認しない。

## 6. Proposed Shared Color Architecture

以下は色そのものの最終承認ではなく、**token構造と役割**の提案である。

| Token | Proposed baseline | 使用目的 | 面積／使用制限 |
| --- | --- | --- | --- |
| night.deep | `#08070B` | 最深背景、modal外側 | 画面25〜70% |
| night.base | `#121018` | 通常夜背景 | 画面20〜65% |
| night.fog | `#282431` | 遠景、霧、分離 | 画面0〜20% |
| paper.base | `#D7C49A` | 標準paper surface | 画面0〜45% |
| paper.raised | `#EEE4D2` | 選択、重要paper | 同時2要素まで |
| paper.shadow | `#8E704C` | 紙の奥行き | border／shadow限定 |
| paper.edge | `#6A4E31` | 破れ、edge、line | 面積5%未満 |
| ink.primary | `#1A1512` | 本文・主要ink | paper上のみ |
| ink.secondary | `#57483A` | 補助文・注釈 | 本文より弱く |
| lantern.flame | `#F2A24B` | 火芯、決定瞬間 | 面積1%未満 |
| lantern.core | `#FFD39A` | 光の中心 | 面積2%未満 |
| memory.teal | `#6E9890` | 記憶・発見の補助 | 通常accent候補 |
| memory.rose | `#9B717B` | 感情・人物記憶 | 常用しない |
| dawn.peach | `#E5B98A` | 朝、回復、完了 | climax後限定 |
| rare.gold | `#D39A4D` | Rare | rare時のみ |
| evolution.violet | `#9C78B5` | Evolution | evolution時のみ |
| kokuyou.deep | `#24152E` | 黒耀化surface | phase限定 |
| danger.muted | `#A65C53` | 破棄、帰還 | danger action限定 |
| success.moss | `#78966C` | Completed | completed state限定 |
| disabled.neutral | `#5B5651` | Disabled | low contrastだが判読可能 |
| locked.neutral | `#2D2A31` | Locked base | ink sealと併用 |

### Color使用ルール

- 通常画面の暖色発光面積は画面全体の8%以下を目安にする。
- Rare、Evolution、黒耀化の色を通常stateへ漏らさない。
- Paper面積が大きい画面はNightの縁・奥行きを残し、白いdocument appに見せない。
- Nightが大きい画面ではPaperを情報島として使い、白文字だけのdeveloper UIにしない。
- Contrastは実際のfont asset、outline、background textureを含めてdevice captureで確認する。

## 7. Typography Architecture

### 7.1 Font方針

現行の`Zen Maru Gothic Medium SDF`を、互換性と日本語glyph coverageのある**baseline候補**として維持する。

ただし、最終判断前に次を比較する。

- 全roleをZen Maru Gothicで統一する案。
- Display／Screen Titleだけ別の作品fontへ分ける案。
- 数字だけtabular readabilityを優先した補助fontへ分ける案。

Font fileやfont assetを新規追加するのは、人間方向選択とライセンス確認後とする。

### 7.2 Role proposal

| Role | Compact | Standard | Large | Weight／用途 | Max lines |
| --- | ---: | ---: | ---: | --- | ---: |
| Display Title | 28 | 32 | 36 | タイトルロゴ補助、短文 | 1 |
| Screen Title | 23 | 26 | 29 | 画面名 | 1 |
| Section Heading | 18 | 20 | 22 | 大分類 | 1 |
| Card Title | 16 | 18 | 20 | 武器、stage、記憶名 | 1〜2 |
| Body | 14 | 15 | 16 | 効果説明 | 2〜4 |
| Button Label | 15 | 16 | 17 | 操作 | 1 |
| Status Label | 12 | 13 | 14 | rarity、状態 | 1 |
| Caption | 11 | 12 | 13 | 注釈 | 1〜2 |
| Numeric Emphasis | 19 | 22 | 24 | timer、rank、重要数値 | 1 |
| Lore / Memory | 14 | 15 | 16 | 余韻、記憶文 | 3〜6 |

### 7.3 Typography禁止

- Bodyへの強いoutline。
- 全文bold。
- Auto Sizeだけに依存するlayout。
- Screenごとの独自font size。
- 日本語より英語subtitleを強くすること。
- 小さい文字をglowやstrokeで読ませること。
- 1行へ情報を詰め込み、縮小して収めること。

## 8. Paper System

Paperは写真の紙ではなく、**記憶を保持するUI material**として扱う。

### Surface levels

| Level | 用途 | 質感 |
| --- | --- | --- |
| Paper 0 / Ghost | 背景の薄い記憶片 | 低contrast、操作不可 |
| Paper 1 / Base | 通常panel、card | 細かな繊維、静か |
| Paper 2 / Raised | Selected、Primary | edgeとshadowを少し強める |
| Paper 3 / Sealed | Locked、重要記録 | ink seal、破れ、clip |
| Paper 4 / Restored | New、Completed、朝 | 光が透けるが白飛びしない |

### Paper禁止

- 全画面を同じpaper textureで覆う。
- 写実的な汚れ、coffee stain、強い折れ目を常用する。
- 角丸rectangleへtextureを貼っただけで完成とする。
- Text周辺へ強いnoiseを置く。
- 同じ破れ形状を大量に反復する。

## 9. Ink System

Inkは装飾ではなくstate languageとする。

| Ink meaning | 表現 |
| --- | --- |
| Locked | 封印、交差線、読めない部分 |
| Forgotten | かすれ、欠落、薄いにじみ |
| Corrupted | 不規則な侵食、広がり |
| Sealed | stamp、結び目、閉じた輪郭 |
| 黒耀化 | Lantern lightを侵食する動的ink |

禁止:

- 意味のないsplatter。
- 全画面へ同じink brushを配置。
- Textの背後へ読みにくいinkを置く。
- RareやCompletedへ黒インクを使う。

## 10. Lantern Lighting System

Lanternはヨルノシルベの主feedbackであり、単なるorange glowではない。

### 許可された意味

- Primary action。
- Current stage／current selection。
- New discovery。
- Rare choice。
- Memory restored。
- 朝へつながる回復。

### Intensity tiers

| Tier | 用途 | 動き |
| --- | --- | --- |
| L0 | ambient | 原則静止、極小の揺らぎ |
| L1 | focus | 0.8〜1.6sの低振幅pulse |
| L2 | selected | 0.18〜0.28sの反応＋安定光 |
| L3 | rare / restored | 0.35〜0.65sの短い広がり |
| L4 | climax | Evolution、黒耀化、朝だけ |

同時にL2以上を3箇所以上表示しない。

## 11. Icon System

### Proposed style

- 24〜48px runtimeでsilhouetteが読める。
- 1〜2px相当の一定線幅、または輪郭主体の小さなpixel-like shape。
- 1 iconあたり基本2〜4色。
- Generic outline icon libraryをそのまま使わない。
- 武器、passive、rare、system actionをshape familyで分離する。
- Paper plateは必要な時だけ使用し、全iconを同じ丸plateへ入れない。

### Family distinction

| Family | Shape language |
| --- | --- |
| Weapon | 方向、衝撃、道具silhouette |
| Passive | 守り、身体、環境、補助symbol |
| Rare | 記憶片、seal、lantern反応 |
| Navigation | 単純、即読、低装飾 |
| Status | 小型、色だけに依存しないmark |

## 12. Motion System

### Duration proposal

| Motion | Duration |
| --- | ---: |
| Tap press | 0.08〜0.12s |
| Selection response | 0.16〜0.24s |
| Small panel enter | 0.20〜0.32s |
| Modal enter | 0.28〜0.42s |
| Screen transition | 0.40〜0.65s |
| Rare reveal | 0.45〜0.80s |
| Evolution / Awakening | 0.80〜1.60s |
| 黒耀化 activation | gameplay contract内で別定義 |

### Easing intent

- UI操作: fast-out、settle。
- 紙: 少し遅れて止まるがbounceしすぎない。
- Ink: 線形ではなく滲み・侵食。
- Lantern: 呼吸のような低振幅。
- Climax: scaleだけでなくlight、mask、particleを意味づけて組み合わせる。

### Reduced motion

- 移動距離を50%以上縮小。
- Flash、shake、large zoomを削除。
- State変化はopacity、edge、static lightで代替。
- 情報の表示順と操作時間は通常modeと同じにする。

## 13. Responsive and Density Rules

既存の3tierを維持する。

| Tier | Width | Horizontal padding | Card baseline | HUD baseline |
| --- | --- | ---: | ---: | ---: |
| Compact | <=379 | 12 | 96 | 68 |
| Standard | 380〜409 | 16 | 108 | 72 |
| Large | >=410 | 20 | 118 | 76 |

追加ルール:

- Compactで装飾を縮小する際、tap targetとBody可読性を削らない。
- Largeで情報量を増やさず、余白と絵の呼吸へ使う。
- Safe Area、gesture area、virtual stick ownershipを装飾より優先する。
- Paper edgeやornamentを画面外へ切る場合も、情報・tap領域は切らない。

## 14. State Systemの拡張方針

現行stateは維持しつつ、色だけでなく次の層を組み合わせる。

| State | Color | Shape／asset | Light／ink | Motion |
| --- | --- | --- | --- | --- |
| Normal | base | standard edge | L0 | none |
| Pressed | slight raised | inward edge | brief L1 | 0.08〜0.12s |
| Selected | raised | selection notch／thread | L2 | settle |
| Disabled | neutral | reduced detail | none | none |
| Locked | dark | seal／cross mark | ink | none |
| New | base＋accent | small new mark | brief L1 | one-shot |
| Rare | rare accent | rarity-specific edge | L3 | reveal |
| Completed | moss／dawn | stamp／check shape | soft restored light | one-shot |
| Kokuyou | deep violet-black | invasion edge | ink consumes light | phase-based |

将来、`Loading`、`Empty`、`Error`はcomponent state matrixで別管理し、既存enumへ無計画に追加しない。

## 15. 実装へ渡す前のGate

以下が揃うまでUnityのTheme値を変更しない。

```txt
overallEmotionalDirectionSelected=true
colorArchitectureReviewed=true
typographyRolesReviewed=true
paperSystemReviewed=true
inkSystemReviewed=true
lanternSystemReviewed=true
iconSystemReviewed=true
motionSystemReviewed=true
existingTargetComparisonComplete=true
humanExplicitApproval=true
```

## 16. 現在のReadiness

```txt
DesignLanguageFoundationDocumented=true
CurrentRuntimeTokensInspected=true
SharedTokenArchitectureProposed=true
OverallEmotionalDirectionSelected=false
FinalPaletteLocked=false
FinalTypographyLocked=false
ImageGenerationStarted=false
UnityDesignImplementationStarted=false
NextAction=WAIT_FOR_SINGLE_HUMAN_DIRECTION_DECISION
```
