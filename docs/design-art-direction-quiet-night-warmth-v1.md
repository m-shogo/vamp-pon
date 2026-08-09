# ヨルノシルベ Art Direction — 静かな夜と小さな温かさ v1

Date: 2026-07-28
Status: **HUMAN DIRECTION SELECTED / DOCUMENTATION-ONLY / NOT VISUALLY LOCKED**
Repository: `m-shogo/vamp-pon`
Human decision: `HD-ART-DIRECTION-001 = A`

## 1. 目的

この文書は、ヨルノシルベの全画面、UI component、背景、演出、画像生成brief、Unity実装判断で共有するアートディレクション正本である。

選択済みの方向は次である。

> 深い夜の中に安心と好奇心を残す。ランタン、小さな光、記憶、朝へ自然につながる「静かな夜と小さな温かさ」。

この方向性は選択済みだが、画像候補比較前のため、最終palette、font composition、component artworkはまだLOCKしない。

現在禁止すること:

- 画像生成
- 既存画像加工
- Unity Scene / Prefab / ScriptableObject / runtime C#変更
- candidateのproduction昇格
- whole-app visual approval

## 2. Product emotion

ヨルノシルベは、恐怖を主目的にした暗いゲームではない。

プレイヤーに残す感情は次の順で設計する。

```txt
1. 夜へ入る静かな好奇心
2. 忘れられたものへ近づく小さな不安
3. 灯りや発見による安心
4. 戦いと黒耀化による一時的な緊張
5. 記憶が戻る手応え
6. 朝へ近づく余韻
```

通常状態では「安心 55 / 好奇心 30 / 寂しさ 15」を目安とする。

黒耀化、Evolution、敗北、深夜stageなど特別状態のみ、一時的に緊張や寂しさを強める。

## 3. Brand pillarsの視覚化

| Pillar | 視覚上の役割 | 禁止される誤解 |
| --- | --- | --- |
| 夜 | 深い余白、静けさ、遠景 | horrorの真っ黒画面 |
| 記憶 | 紙片、記録、断片、復元 | generic magical particles |
| 忘れ物 | 欠落、かすれ、未完成 | ゴミや汚れの乱雑さ |
| 黒インク | locked / forgotten / corrupted / sealed / 黒耀化 | 意味のないsplatter |
| 小さな光 | primary / current / new / rare / restored | 全部を光らせるglow |
| 朝 | 回復、完了、希望、余韻 | 常時明るいpastel化 |

## 4. Visual balance

### 4.1 画面の成分比

通常画面の基準:

```txt
Night / dark negative space: 45〜70%
Paper / information surfaces: 15〜40%
Character / environment image: 10〜35%
Persistent warm light: 2〜8%
Special accent: 0〜5%
```

画面ごとに合計100%へ厳密に合わせる必要はないが、次を守る。

- Paperが画面の大半を占めて白いdocument appに見えないこと。
- Nightが大半でも白文字だけのdeveloper UIに見えないこと。
- 常時glowを画面全体へ広げないこと。
- Character、enemy、background、UIが別作品に見えないこと。

### 4.2 静けさ

通常画面では、常時動く要素を最大3系統までに制限する。

例:

- 背景の極小な浮遊粒子
- ランタンの低振幅揺らぎ
- 現在地や選択の緩い呼吸

全card、全button、全iconを常時動かさない。

## 5. Color direction

以下はA方向に基づくproduction proposalであり、runtimeへの反映は画像・device comparison後とする。

| Token | Baseline | 用途 | 制約 |
| --- | --- | --- | --- |
| `night.deep` | `#08070B` | 最深背景、modal外側 | 完全黒を避ける |
| `night.base` | `#121018` | 通常の夜 | 主背景候補 |
| `night.fog` | `#282431` | 遠景、分離、霧 | 彩度を上げすぎない |
| `night.warm-shadow` | `#211A1A` | ランタン周辺の暖かい暗部 | orange化しない |
| `paper.base` | `#D7C49A` | 通常paper | 黄ばみすぎない |
| `paper.raised` | `#EEE4D2` | selected / primary | 同時2要素まで |
| `paper.shadow` | `#8E704C` | 奥行き | 面ではなくedge中心 |
| `paper.edge` | `#6A4E31` | 紙端、線 | 面積5%未満 |
| `ink.primary` | `#1A1512` | 主要文字 | paper上で使用 |
| `ink.secondary` | `#57483A` | 注釈 | 本文より弱く |
| `lantern.flame` | `#F2A24B` | 火芯、決定瞬間 | 面積1%未満 |
| `lantern.core` | `#FFD39A` | 光の中心 | 白飛び禁止 |
| `lantern.halo` | `#C98243` | halo | opacityで管理 |
| `memory.teal` | `#6E9890` | 記憶、発見 | 通常accent候補 |
| `memory.rose` | `#9B717B` | 人物記憶、感情 | 常用しない |
| `dawn.peach` | `#E5B98A` | 朝、回復、完了 | climax後限定 |
| `rare.gold` | `#D39A4D` | rare | 通常buttonへ流用禁止 |
| `evolution.violet` | `#9C78B5` | evolution | evolution限定 |
| `kokuyou.deep` | `#24152E` | 黒耀化 | phase限定 |
| `danger.muted` | `#A65C53` | 破棄、帰還 | destructive action限定 |
| `success.moss` | `#78966C` | completed | check/stamp併用 |

### 5.1 暖色の使用上限

- 通常画面の暖色発光面積は8%以下。
- L2以上のLantern lightは同時2箇所まで。
- Rare、Evolution、黒耀化の色をNormalへ漏らさない。
- Dawn colorは「戻った」「完了した」「朝へ近づいた」場合だけ使う。

### 5.2 Contrast

- Body textはpaper上で十分なcontrastを確保する。
- Night上の文字は短いheading、status、補助表示に限定する。
- 長文をNight上へ直接置かない。
- 小さい文字を強いstrokeやglowで救済しない。
- device captureで実font・texture込みの可読性を確認する。

## 6. Paper material

Paperは背景装飾ではなく、記憶を保持するUI materialである。

| Level | 意味 | Surface |
| --- | --- | --- |
| Paper 0 / Ghost | 遠い記憶、操作不可 | 半透明、低contrast、edge弱 |
| Paper 1 / Base | 通常情報 | 細かな繊維、静かなedge |
| Paper 2 / Raised | selected / primary | edge、shadow、lightを少し増す |
| Paper 3 / Sealed | locked /重要記録 | ink seal、clip、欠落 |
| Paper 4 / Restored | new / completed / dawn | 内側から柔らかく透ける |

### 6.1 Texture density

- Standard 390x844で、通常閲覧距離ではtextureが最初に見えない程度。
- Textureはsurfaceの均一さを崩すが、文字より強くしない。
- Edgeのvariationはfamily内で3〜5種を用意し、同じ破れを反復しない。
- 写実的なcoffee stain、強い折れ、焦げ、汚れは常用禁止。
- 角丸rectangleへnoiseを貼っただけのpaperを正式componentとしない。

## 7. Ink language

Inkは意味を持つ状態言語である。

| Meaning | 表現 | Motion |
| --- | --- | --- |
| Locked | 封印、交差線、閉じた輪郭 | 原則静止 |
| Forgotten | 欠落、かすれ、読めない端 | 極小の消失のみ |
| Corrupted | 不規則な侵食、広がり | slow irregular |
| Sealed | stamp、結び、閉じたmark | one-shot stamp可 |
| 黒耀化 | 光を侵食する動的ink | gameplay phase内限定 |

禁止:

- 意味のないsplatter
- 全画面へ同じbrush
- text背後の高contrast ink
- Rare、Completed、Primaryへ黒インクを装飾として付ける
- 黒耀化以外でLantern lightを完全に飲み込む表現

## 8. Lantern lighting

Lanternは主feedbackであり、orange glowではない。

| Tier | 意味 | 動き |
| --- | --- | --- |
| L0 | ambient | ほぼ静止、低振幅 |
| L1 | focus / discoverability | 0.8〜1.6sの弱いpulse |
| L2 | selected / current | 0.18〜0.28s反応後に安定 |
| L3 | rare / restored | 0.35〜0.65sの短い広がり |
| L4 | evolution / 黒耀化 / dawn | climax限定 |

ルール:

- Primary action、current、new、rare、restored以外へ使わない。
- L2以上を3箇所以上同時表示しない。
- Glowだけでstateを区別しない。
- Reduced motionではstatic edge、halo、markへ置換する。

## 9. Typography direction

現行`Zen Maru Gothic Medium SDF`をbaselineとして維持する。

### 9.1 印象

- 丸く親しみやすいが、幼児向けにはしない。
- 行間と余白で静けさを作る。
- 太さではなくsize、position、surface、余白でhierarchyを作る。
- 英語subtitleを日本語より強くしない。

### 9.2 Role

| Role | Compact | Standard | Large | 用途 |
| --- | ---: | ---: | ---: | --- |
| Display Title | 28 | 32 | 36 | logo補助、短文 |
| Screen Title | 23 | 26 | 29 | 画面名 |
| Section Heading | 18 | 20 | 22 | 大分類 |
| Card Title | 16 | 18 | 20 | 武器、stage、記憶名 |
| Body | 14 | 15 | 16 | 効果説明 |
| Button Label | 15 | 16 | 17 | 操作 |
| Status Label | 12 | 13 | 14 | rarity、state |
| Caption | 11 | 12 | 13 | 注釈 |
| Numeric Emphasis | 19 | 22 | 24 | timer、rank、重要数値 |
| Lore / Memory | 14 | 15 | 16 | 余韻、記憶文 |

Typographyの最終font compositionは、TOP／StageSelect／LevelUpの同条件comparison後に決定する。

## 10. Character / UI cohesion

- Characterはdot/pixel flavor、UIはsoft paperでよいが、outline密度と色数を接続する。
- UI ornamentを写実的な紙工芸へ寄せすぎない。
- Characterの主要outlineよりUI ornamentを細密にしすぎない。
- Gameplay iconは小サイズで読めるsilhouetteを優先する。
- Character portraitを大きく置くだけで画面品質を作らない。
- 背景、UI、characterに同じLantern light sourceを感じさせる。

## 11. Screen-specific emotional targets

| Screen | 感情 | 強めるもの | 抑えるもの |
| --- | --- | --- | --- |
| TOP | 静かな入口、好奇心 | 夜、遠い光、余白 | menu量、巨大portrait |
| StageSelect | 夜を進む期待 | current lantern、連続する道 | flowchart感 |
| Battle HUD | 集中、守られている感覚 | battlefield、必要feedback | panel量、常時装飾 |
| LevelUp | 記憶を拾う喜び | paper card、選択光 | 管理画面感 |
| Pause | 一息つく安全 | 静かなpaper、resume | 強い演出 |
| Result | 戦いの余韻、回収 | rank seal、restored light | spreadsheet感 |
| Collection | 記憶が蓄積する満足 | page rhythm、completed stamp | inventory grid感 |
| Evolution | 封印が解ける高揚 | violet＋lantern | 通常画面への色漏れ |
| 黒耀化 | 強さと危うさ | lightを侵すink | generic purple aura |

## 12. Forbidden visual outcomes

次に見えた場合はFAILとする。

- generic fantasy mobile UI
- gold frame / jewel / neon中心
- developer tool / dashboard / form UI
- flat rectangleとTMPだけの仮UI
- AI生成一枚絵をそのままruntimeへ貼った画面
- characterだけ高品質でUIが別作品
- すべてが同じ明るさ、同じpanel強度
- 常時particle、常時glow、常時bounce
- paper textureが可読性を下げる
- warm directionがorange/brown一色へ崩れる
- 親しみやすさが幼児向けの丸さへ崩れる

## 13. Approval checklist

Art Directionをvisual lockするには、最低限次が必要である。

```txt
HD-ART-DIRECTION-001 recorded=true
TOP direction comparison complete=true
StageSelect direction comparison complete=true
LevelUp direction comparison complete=true
characterUiCohesionReviewed=true
paletteDeviceCompared=true
typographyDeviceCompared=true
paperDensityDeviceCompared=true
lanternMeaningValidated=true
forbiddenOutcomeCount=0
humanExplicitVisualLock=true
```

## 14. 現在判定

```txt
OverallEmotionalDirectionSelected=true
SelectedDirection=QUIET_NIGHT_SMALL_WARMTH
ArtDirectionDocumented=true
ArtDirectionVisuallyLocked=false
FinalPaletteLocked=false
FinalTypographyLocked=false
ImageGenerationStarted=false
UnityDesignImplementationStarted=false
NextAction=COMPLETE_PRE_GENERATION_DOCUMENTATION
```
