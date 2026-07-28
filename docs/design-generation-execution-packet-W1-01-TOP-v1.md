# ヨルノシルベ W1-01 TOP Generation Execution Packet v1

Date: 2026-07-28
State: **PREPARED / NOT HUMAN-APPROVED / NO IMAGE GENERATED**
Workflow state: `HD0 DOCUMENTATION_FOUNDATION`
Next legal state after explicit approval: `HD1 WAVE1_GENERATION_APPROVED`
Generation authority: `CHATGPT_HUMAN_SUPERVISED`

## 1. 目的

ヨルノシルベのTOPを、巨大キャラクター画像や汎用メニューではなく、**深い夜へ安心して一歩入れる静かな入口**としてVisual Developmentする。

このpacketは、画像生成開始時の解釈差、候補間の差不足、AI文字、分解不能な一枚絵、Unity実装時の再設計を減らすための実行正本である。

本書の存在だけでは生成を開始しない。ユーザーがW1-01を明示承認し、workflow stateを`WAVE1_GENERATION_APPROVED`へ正規transitionした後にのみ生成する。

## 2. 固定Art Direction

```txt
Decision=HD-ART-DIRECTION-001
Direction=A
Value=QUIET_NIGHT_SMALL_WARMTH
Label=静かな夜と小さな温かさ
```

感情順序:

```txt
静けさ > 好奇心 > 小さな温かさ > 微かな寂しさ
```

TOPは恐怖、豪華さ、派手な達成感ではなく、**戻ってきたくなる夜の入口**を担う。

## 3. Source of truth

必須入力:

1. `docs/design-art-direction-quiet-night-warmth-v1.md`
2. `docs/design-screen-completion-specifications-v1.md`
3. `docs/design-generation-briefs-wave1-v1.md`
4. 本書
5. `docs/design-targets/generated/design-production/reference-registry.json`
6. `docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json`
7. `docs/design-targets/generated/design-production/generation-request-queue.json`
8. `docs/design-technical-art-asset-pipeline-spec-v1.md`

矛盾時は本書がW1-01 TOPの実行詳細を上書きする。ただし最新の明示的人間判断が最優先である。

## 4. Baseline evidence

TOPは現在、独立runtime screenが存在しない。

```txt
runtimeState=MISSING
runtimeCapture=null
baselineMode=ABSENCE_EVIDENCE
```

したがって、存在しないruntime PNGを生成開始条件にしない。

比較材料:

- `docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/screen-audit.json`
- `docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json`のTOP entry
- 現行Boot→StageSelect直行の監査記録
- `docs/design-targets/final/top-final.png` — `REWORK_SOURCE`
- `docs/design-targets/generated/top-final.png` — historical reference only
- `docs/design-targets/generated/non-battle-ui-helper-2026-06-28.png` — component reference only

既存画像のfile nameや旧current記述は承認を意味しない。

## 5. 出力契約

### Exploration

3方向を**別々の画像**として生成する。1枚のcontact sheet内に3案をまとめない。

```txt
Candidate C01 = 夜路の入口【推奨探索】
Candidate C02 = 記憶の窓
Candidate C03 = 灯りの停留所
```

### Resolution

```txt
Reference master=1170x2532
Runtime comparison viewport=390x844
Aspect ratio=390:844
Color space=sRGB
Background=opaque
Text=none
Logo=none
Pseudo text=none
```

Whole-screen出力はcomposition referenceであり、runtimeへ直接貼らない。

### Candidate IDs

```txt
W1-01-TOP-C01-NIGHT-ROAD-ENTRANCE
W1-01-TOP-C02-MEMORY-WINDOW
W1-01-TOP-C03-LIGHT-STOP
```

### Reserved paths

```txt
docs/design-targets/generated/design-production/briefs/W1-01-TOP/
docs/design-targets/generated/design-production/candidates/W1-01-TOP/
docs/design-targets/generated/design-production/comparison-packs/W1-01-TOP/
```

Actual image path、hash、generation date、prompt summaryは生成後にprovenance registryへ記録する。

## 6. Composition grid

390x844基準。Safe Area insetはruntimeで動的に適用するため、生成画像内に端末固有のnotchやhome indicatorを描かない。

### Horizontal

```txt
Critical-content left boundary=24px
Critical-content right boundary=366px
Preferred text/button content width=310〜342px
Edge atmosphere may extend to full bleed
```

1170 master換算:

```txt
72px / 1098px
930〜1026px
```

### Vertical zones

```txt
Z0 Top atmosphere:         0〜72
Z1 Title breathing space: 72〜220
Z2 Focal night scene:     220〜536
Z3 Transition quiet zone: 536〜596
Z4 Primary action zone:   596〜684
Z5 Secondary actions:     700〜780
Z6 Bottom atmosphere:     780〜844
```

1170x2532 masterでは各値を3倍する。

Rules:

- Z1には文字を生成せず、logoを後から配置できる静かなnegative spaceを残す。
- Z4はPrimary button 1つを置ける低ノイズ領域にする。
- Z5はsecondary actionを2〜3個置けるが、Primaryより弱くする。
- Z6に重要情報を置かない。
- Focal pointとPrimary actionを競合させない。
- 画像内にbutton labelを生成しない。

## 7. 共通visual requirements

- Deep blue-black nightを主面積とする。
- Warm lightは小さなlantern coreと限定haloだけに使う。
- Fogは奥行き用に薄く、白い煙幕にしない。
- Paper fragmentは情報panelではなく、記憶の痕跡として少量。
- Cool nightとwarm shadowを両立する。
- 通常TOPなのでRare／Evolution／黒耀化級の演出強度を使わない。
- Character artに依存しない作品固有性を証明するため、**初回探索3案では人物を配置しない**。
- UI表面は後で9-slice／separate componentへ分解できる単純なedgeを持つ。

## 8. Candidate C01 — 夜路の入口【推奨】

### Concept

遠くへ続く細い夜路。手前寄りに小さなランタンがあり、その灯りだけが進む方向を示す。

### Composition

- Z1は最も広く静かにする。
- 道は中央から少し外し、奥へ緩く蛇行する。
- Lantern coreはZ2下半分、Primary actionの直上に置く。
- 遠景に小さな窓光や朝の予兆を1〜2点だけ置く。
- Paper fragmentは2〜4枚以内。

### Strength

- TOPからStageSelectの夜路へ最も自然につながる。
- Component／parallax分解が容易。
- ヨルノシルベの「小さな光」を最も直接的に表現する。

### Risk

- 単なる暗い道の壁紙に見えないよう、paper／ink／lanternの固有語彙を弱く接続する。

## 9. Candidate C02 — 記憶の窓

### Concept

深い夜の中に、遠い記憶を覗く小さな窓や薄いpaper fragmentが浮かぶ。中央に大きな額縁は作らない。

### Composition

- Z1は静かなまま維持。
- Z2に3〜5個の大小異なるmemory apertureを非対称配置。
- 1つだけwarm lightを持ち、他は低彩度。
- Primary action zoneの背後にはfragmentを置かない。

### Strength

- 記憶という作品テーマを強く出せる。
- Collection／Resultのpaper systemへつながる。

### Risk

- Gallery、写真管理、カード一覧に見えないよう、窓をUI cardとして整列させない。

## 10. Candidate C03 — 灯りの停留所

### Concept

夜道の途中にある小さな休息地点。低い標識、忘れ物、ベンチまたは小さな屋根の気配を限定的に使う。

### Composition

- Z2に停留所のsilhouetteを1つ。
- Lanternは構造物の一部として小さく灯る。
- 忘れ物は1点だけ。物語説明の小道具を増やさない。
- Z4／Z5は必ず低ノイズに保つ。

### Strength

- 世界の存在感と「忘れ物」を最も強く感じられる。
- StageSelectの標識／node familyへ展開できる。

### Risk

- 背景美術が主役になり、ゲーム開始導線が弱くならないようにする。

## 11. Hard negative constraints

以下を一つでも含む案はREWORKまたはREJECTとする。

```txt
AI文字、擬似文字、数字、ロゴ
巨大なユイ／人物portrait
人物の顔、手、体
同強度の縦積みmenu
generic fantasy gold frame
neon cyberpunk
宝石、豪華metal、王冠
明るすぎるstorybook pastel
horrorの完全な黒、血、骸骨
全面paper background
大きな巻物、羊皮紙menu
generic mobile RPG home screen
ゲームパッド、controller icon
CTA背後の高contrast texture
過度なbloom、lens flare
Rare／Evolution級の常時particle
photorealistic environment
3D glossy plastic UI
wallpaper-onlyでUI配置余地がない構図
```

## 12. Layer decomposition target

選択方向をrefineするとき、最低限次へ分解可能であること。

```txt
BG_FAR_NIGHT
BG_MID_WORLD_HINT
BG_NEAR_ROAD_OR_STOP
FOG_DEPTH
LANTERN_CORE
LANTERN_HALO
MEMORY_FRAGMENT_SMALL
TITLE_SUPPORT_ORNAMENT
PRIMARY_BUTTON_SURFACE
SECONDARY_BUTTON_SURFACE
AMBIENT_PARTICLE_SHAPES
INK_EDGE_OR_DIVIDER
```

Whole-screen候補段階で全layerを実ファイル分割する必要はないが、境界が視覚的に分離可能であること。

## 13. Technical budget

```txt
Parallax background layers=2〜3
Full-screen fog layers<=1
Always-on particles<=20
Realtime blur=0
Distinct materials target<=4
Primary action background contrast=low
Full-screen bloom=0
Continuous large animation=0
```

MotionはUnity側で実装し、生成画像にmotion blurを焼き込まない。

## 14. Comparison pack — TOP override

TOPにはruntime captureがないため、Wave共通packの`02-current-runtime-capture.png`を使わない。

```txt
00-context.md
01-existing-target.png
02-current-runtime-absence-evidence.md
03-candidate-C01.png
04-candidate-C02.png
05-candidate-C03.png
06-side-by-side.png
07-scorecard.json
08-human-decision.json
09-component-extraction-notes.md
10-provenance.json
```

`02-current-runtime-absence-evidence.md`には次を記録する。

- Independent TOP runtime state is missing。
- Boot→StageSelect直行。
- TOP capture=null。
- Missing screenは新規実装が必要。

## 15. Score gate

各candidateを0〜4で評価する。

```txt
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
```

Direction selection条件:

- 全項目3以上。
- brandDistinctiveness=4。
- interactionClarity=4。
- componentExtractability=4。
- mobileFit=4。
- 合計36/40以上。
- Forbidden motif=0。
- AI text=0。
- Human selectionあり。

条件未達なら、最も点数の高い案を自動採用せずREWORKする。

## 16. Human review questions

候補比較時は1回1問のクリック式を優先する。

最初の判断:

```txt
C01 夜路の入口
C02 記憶の窓
C03 灯りの停留所
すべて再制作
```

補助確認:

- 5秒で最初に押す場所が分かるか。
- 人物なしでも作品固有性があるか。
- 暗いが怖すぎないか。
- Warm lightが広がりすぎていないか。
- StageSelectへつながる夜路の予感があるか。
- Button／ornament／lanternをcomponentとして取り出せるか。

## 17. Generation-start gate

W1-01では次を満たすまで画像生成toolを呼ばない。

```txt
workflowState=WAVE1_GENERATION_APPROVED
activeRequest=W1-01-TOP
activeWave1BriefHumanApproved=true
runtimeBaselineEvidenceReady=true
runtimeBaselineMode=ABSENCE_EVIDENCE
referenceRegistryReviewed=true
candidateCount=3
forbiddenListReviewed=true
technicalBudgetReviewed=true
reservedPathsDefined=true
comparisonPackPrepared=true
imageGenerationAuthority=CHATGPT_HUMAN_SUPERVISED
repositoryAgentMayGenerateImages=false
unityDesignImplementationStarted=false
```

`currentRuntimeCaptureAvailable=true`はTOPには要求しない。

## 18. 現在判定

```txt
ExecutionPacketPrepared=true
HumanApproved=false
WorkflowState=HD0_DOCUMENTATION_FOUNDATION
GenerationStarted=false
UnityImplementationStarted=false
NextLegalTransition=HD1_WAVE1_GENERATION_APPROVED
```
