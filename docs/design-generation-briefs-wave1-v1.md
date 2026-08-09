# ヨルノシルベ Image Generation Briefs — Wave 1 v1

Date: 2026-07-28
Status: **PREPARED / NOT APPROVED FOR GENERATION / NO IMAGE OUTPUT**
Repository: `m-shogo/vamp-pon`
Generation authority: `CHATGPT_HUMAN_SUPERVISED`
Art direction: `QUIET_NIGHT_SMALL_WARMTH`

## 1. 目的

画像生成開始後のやり直しを減らすため、最初の3画面の目的、構成、禁止事項、technical constraints、候補比較、保存先を事前に固定する。

この文書だけでは画像生成を開始しない。各briefは開始直前に既存referenceと現行captureを並べ、人間が`BRIEF_APPROVED`を明示する必要がある。

## 2. Wave 1 order

```txt
W1-01 TOP
W1-02 StageSelect
W1-03 LevelUp
```

同時生成しない。前の画面でArt Directionとcomponent extractionが成立してから次へ進む。

## 3. 共通出力規則

- Exploration: 明確に異なる3案。
- Refinement: 選択方向を2〜3案。
- Whole-screen reference: 1170x2532、390x844の3倍。
- Text-freeを基本とし、logoやlabelの配置領域だけ空ける。
- AI文字、擬似文字、数字、button labelを含めない。
- Character追加はbriefで明示された場合だけ。
- Runtimeへwhole-screenを直接使用しない。
- Component分解可能なsurface、edge、ornamentを持つ。
- 画面端のsafe area、gesture area、tap areaを示す。

## 4. 共通比較軸

各案を0〜4で評価する。

```txt
brand distinctiveness
composition
visual hierarchy
readability space
interaction clarity
asset cohesion
character/UI cohesion
component extractability
mobile fit
technical feasibility
```

選択条件:

- 全項目3以上。
- brand distinctiveness、interaction clarity、component extractability、mobile fitは4。
- 合計36/40以上。
- forbidden motif 0。
- text baking 0。
- human direction selectionあり。

# W1-01 TOP

## Brief metadata

```txt
briefId=W1-01-TOP
screenId=TOP
assetType=WHOLE_SCREEN_COMPOSITION_REFERENCE
status=PREPARED_NOT_APPROVED
viewport=390x844
master=1170x2532
```

## Goal

プレイヤーが、深い夜の中へ安心して一歩入れるTOPを作る。巨大character portraitやgeneric menuではなく、ヨルノシルベ固有の「夜、記憶、小さな光、朝への予感」を数秒で感じる。

## Player purpose

- ゲームを始める。
- 続きへ戻る。
- secondary navigationを理解する。

## Emotional intent

```txt
静けさ > 好奇心 > 小さな温かさ > 微かな寂しさ
```

## Composition hierarchy

```txt
1. logo / title breathing space
2. small lantern focal point
3. primary action zone
4. secondary actions
5. distant world hints
```

## Required composition

- 上部20〜28%: logo/titleのための静かな余白。
- 中央30〜45%: 小さな灯り、遠い夜路、記憶片などのfocal scene。
- 下部25〜32%: Primary action 1つ、secondary actionsは弱く。
- Safe area内でbutton familyを配置可能。
- Characterを置く場合は小さなsilhouetteまたは遠景。画面を支配しない。

## Required visual materials

- deep night background。
- restrained fog/depth。
- small lantern core/halo。
- subtle paper fragmentsまたは記憶の痕跡。
- warm shadowとcool nightのbalance。

## Forbidden

- 巨大Yui portrait。
- menu buttonの同強度縦積み。
- fantasy gold frame。
- neon、宝石、豪華metal。
- horrorの真っ黒背景。
- 全画面paper。
- AI文字。
- CTAを装飾に埋める。

## Three exploration directions

### A1 — 夜路の入口【推奨探索】

遠くへ続く暗い道、その手前に小さなランタン。余白が多く、logoとPrimary actionが静かに浮く。

### A2 — 記憶の窓

夜背景の中に、薄い紙片や小さな窓のような記憶fragmentが浮かぶ。情報量は抑える。

### A3 — 灯りの停留所

小さなベンチ、標識、忘れ物など、旅の途中の静かな場所。世界観は強いが、背景説明が主役にならないよう管理。

## Component extraction target

- primary button surface。
- secondary button surface。
- lantern focal ornament。
- paper fragment family。
- title support ornament。
- ambient particle shapes。

## Technical constraints

- 常時particle 20以下想定。
- realtime blurなし。
- 2〜3 background layersでparallax可能。
- Primary action zoneに高contrast textureを置かない。

## Reserved paths

```txt
docs/design-targets/generated/design-production/briefs/W1-01-TOP/
docs/design-targets/generated/design-production/candidates/W1-01-TOP/
docs/design-targets/generated/design-production/comparison-packs/W1-01-TOP/
```

## Human acceptance questions

- 5秒で最初に押す場所が分かるか。
- Characterなしでも作品固有性があるか。
- 暗いが怖すぎないか。
- 暖色が多すぎないか。
- StageSelectへつながる夜路の予感があるか。

# W1-02 StageSelect

## Brief metadata

```txt
briefId=W1-02-STAGE-SELECT
screenId=STAGE_SELECT
assetType=WHOLE_SCREEN_COMPOSITION_REFERENCE
status=PREPARED_NOT_APPROVED
viewport=390x844
master=1170x2532
```

## Goal

StageSelectをflowchartではなく、ひと続きの夜路として見せる。current、next、locked、completedを、色だけではなくLantern、Ink、Path、Vignetteで区別する。

## Player purpose

- 現在地を理解する。
- 次のstageを選ぶ。
- locked reasonやstage概要を確認する。
- Startする。

## Emotional intent

```txt
進んできた実感 > 次への期待 > 未知への小さな不安
```

## Composition hierarchy

```txt
1. current lantern node
2. next reachable node
3. continuous path
4. stage info / start action
```

## Required composition

- 縦scroll可能な連続する道。
- CurrentはLantern markerとPaper 2。
- LockedはInk sealと閉じたpath。
- Completedはstampとsoft dawn/moss。
- Stage vignetteは小さく、path continuityを壊さない。
- Stage info panelとStart actionを選択contextへ接続。

## Forbidden

- 丸nodeと直線だけのdiagram。
- 全node同じcard。
- Currentをglowだけで示す。
- Lockedを暗くするだけ。
- 地図装飾がtap targetを隠す。
- 道が途切れて別々のmenuに見える。
- AI文字。

## Three exploration directions

### A1 — 細い夜道【推奨探索】

暗い道が縦に蛇行し、Lantern nodeが小さな休息地点として並ぶ。最も連続感が強い。

### A2 — 紙の旅程

Night background上に、紙のroute fragmentが連なり、InkとLanternでstateを示す。Paper UIとの接続が強い。

### A3 — 忘れられた街の標識

各nodeを小さな標識、窓、停留所として表現。世界観は強いが、tap/readabilityを優先して単純化する。

## Component extraction target

- stage path segments。
- current lantern marker。
- normal/selected/locked/completed node。
- ink lock seal。
- stage vignette frame。
- stage info panel。
- start button。

## Technical constraints

- scroll viewでcull可能。
- node familyは128〜256 runtime。
- pathはtile/slicedまたはsegment family。
- full-screen fogは1層。
- visible node以外のanimationを止める。

## Reserved paths

```txt
docs/design-targets/generated/design-production/briefs/W1-02-STAGE-SELECT/
docs/design-targets/generated/design-production/candidates/W1-02-STAGE-SELECT/
docs/design-targets/generated/design-production/comparison-packs/W1-02-STAGE-SELECT/
```

## Human acceptance questions

- 一枚の道として見えるか。
- Currentを説明なしで指せるか。
- LockedとCompletedを色名なしで説明できるか。
- Start actionがscrollに埋もれないか。
- TOPと同じ夜に見えるか。

# W1-03 LevelUp

## Brief metadata

```txt
briefId=W1-03-LEVEL-UP
screenId=LEVEL_UP
assetType=WHOLE_SCREEN_COMPOSITION_REFERENCE_AND_COMPONENT_BOARD
status=PREPARED_NOT_APPROVED
viewport=390x844
master=1170x2532
```

## Goal

LevelUpを仮cardの管理画面から、3つの記憶を選ぶ体験へ変える。既存のicon-left / info-right構造と3-choice logicを保ち、Common、Rare、Evolutionをformal state familyで分ける。

## Player purpose

- 3候補を比較する。
- weapon/passiveを識別する。
- rarity/evolutionを理解する。
- 1つ選ぶ。

## Emotional intent

```txt
発見の喜び > 選ぶ楽しさ > Rare/Evolutionの驚き
```

## Composition hierarchy

```txt
1. three selectable memory cards
2. icon / name / effect
3. type / rarity / evolution state
4. reroll / secondary action
```

## Required composition

- 3枚のcardが390x844で読める。
- Icon left、name/effect right。
- Card geometryは共通、edge/stateで差を作る。
- Commonは静か。
- Rareはgold edge＋L3 reveal、常時派手にしない。
- Evolutionはviolet seal-break、Rareの色違いにしない。
- Selectedはnotch/thread＋stable L2。

## Forbidden

- 3枚すべてをglow。
- rarityを色だけで表示。
- icon placeholder。
- 長文を小さく縮小。
- Cardがgeneric store商品に見える。
- Weapon/passive差が分からない。
- AI文字。

## Three exploration directions

### A1 — 記憶札【推奨探索】

細いpaper cardに、icon frameと手がかりのようなedge mark。静かな選択体験。

### A2 — 灯りの標本

各cardを小さな標本箱・記録plateのように見せる。Lantern lightをselected/rareへ限定。

### A3 — 綴じられた頁

3枚が一冊の記憶帳から開いたpageのように見える。世界観は強いが、独立tap領域を明確にする。

## Component extraction target

- card base/raised/pressed。
- selected notch/thread。
- weapon/passive type mark。
- common/rare/evolution edge。
- icon frame。
- reroll secondary button。
- modal background/dim。

## Technical constraints

- card surface 1024x1536 master、256〜512 runtime。
- 9-sliceまたは固定aspectを明示。
- Full-screen dim＋paper＋glowのoverdrawを3層以内。
- 3cardのgeometryをstate間で揃える。

## Reserved paths

```txt
docs/design-targets/generated/design-production/briefs/W1-03-LEVEL-UP/
docs/design-targets/generated/design-production/candidates/W1-03-LEVEL-UP/
docs/design-targets/generated/design-production/comparison-packs/W1-03-LEVEL-UP/
```

## Human acceptance questions

- 3候補を迷わず比較できるか。
- Commonでも仮UIに見えないか。
- Rare/Evolutionを色名なしで区別できるか。
- 管理画面ではなく記憶を選ぶ体験か。
- Battle HUDやResultへcomponentを展開できるか。

## 5. Comparison pack specification

各briefの比較packは同じ構成にする。

```txt
00-context.md
01-existing-target.png
02-current-runtime-capture.png
03-candidate-A.png
04-candidate-B.png
05-candidate-C.png
06-side-by-side.png
07-scorecard.json
08-human-decision.json
09-component-extraction-notes.md
```

### Scorecard fields

```txt
candidateId
briefId
brandDistinctiveness
composition
visualHierarchy
readabilitySpace
interactionClarity
assetCohesion
characterUiCohesion
componentExtractability
mobileFit
technicalFeasibility
forbiddenMotifs
humanNotes
selectionStatus
```

### Decision states

```txt
PENDING
DIRECTION_SELECTED
REWORK_REQUIRED
REJECTED
SUPERSEDED
```

## 6. Generation-start checklist

1 briefにつき以下を確認する。

```txt
artDirectionHumanDirectionLocked=true
referenceRegistryReviewed=true
currentRuntimeCaptureAvailable=true
briefApproved=true
candidateCount=3
forbiddenListReviewed=true
technicalBudgetReviewed=true
reservedPathsDefined=true
comparisonPackPrepared=true
imageGenerationAuthority=CHATGPT_HUMAN_SUPERVISED
```

## 7. 現在判定

```txt
Wave1BriefCount=3
Wave1BriefsPrepared=true
Wave1BriefsHumanApproved=false
GenerationQueueStatus=PLANNED_NOT_STARTED
ImageGenerationStarted=false
NextAction=COMPLETE_DOCUMENTATION_READINESS_AND_REVIEW_REMAINING_GAPS
```
