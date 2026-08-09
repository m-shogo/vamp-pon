# ヨルノシルベ Heavy Design Implementation Execution Plan v1

Date: 2026-07-28
Status: **PLANNED / NO VISUAL IMPLEMENTATION STARTED**
Repository: `m-shogo/vamp-pon`
Art Direction: `QUIET_NIGHT_SMALL_WARMTH`

## 1. 目的

この文書は、画像候補とcomponentが承認された後のUnity実装を、画面ごとの場当たり修正に戻さず、差し戻し・破壊・重複実装を最小化するための実行計画である。

本書の存在は実装開始許可を意味しない。

```txt
imageGenerationStarted=false
unityDesignImplementationStarted=false
humanImplementationStartApproval=false
```

## 2. 実装開始前の必須入力

次が全て揃うまでWave I0へ進まない。

```txt
activeWave1BriefHumanApproved=true
humanDirectionSelected=true
refinedReferenceApproved=true
componentBoardCreated=true
componentCandidateApproved=true
cleanupComplete=true
commercialUseReviewed=true
assetLineageRecorded=true
fullProductGlyphCoverageComplete=true
implementationHandoffPackComplete=true
humanImplementationStartApproval=true
```

## 3. Branchとbaseline

実装時は、Heavy Design専用branchを新規作成し、U49 evidence branchへ直接runtime変更を積まない。

推奨:

```txt
base=<実装開始時に人間承認したclean commit>
branch=feature/heavy-design-wave1-<date>
baselineTagOrCommit=<開始commit SHA>
```

ルール:

- 現在のPR #76を自動的に実装branchとして扱わない。
- U49 Audio/Haptic evidence、U50 threshold、U51 RCを混ぜない。
- merge方式は当該PRの方針に従い、履歴を消すrebase/squashを勝手に選ばない。
- 各screen waveの開始前にbaseline captureとrollback commitを記録する。

## 4. 実装方式

### 4.1 Replace-in-place禁止

承認前の既存screenを一気に削除しない。

```txt
existing runtime screen
+ new Heavy Design presenter/prefab candidate
+ diagnostic/preview route
→ comparison
→ human approval
→ ownership切替
→ old path retirement
```

### 4.2 Dual-path期間

各screenは短期間だけ旧pathと新pathを共存させる。

- production defaultは旧pathのまま開始。
- diagnostic routeまたは明示flagだけで新pathを表示する。
- navigation、save、gameplay data、input ownershipは共通contractを使う。
- human comparison後にのみdefault ownershipを切り替える。
- 切替commitと旧path削除commitを分離する。

### 4.3 Theme移行

全screenを先に新Themeへ一括変更しない。

1. 新tokenを既存Themeと並行定義。
2. Preview Catalogでbutton/card/panel/stateを確認。
3. TOPで実証。
4. StageSelectでscroll/path/stateを実証。
5. LevelUpでcard/rarity/overflowを実証。
6. 3画面承認後にshared tokenを正式化。

TOPだけで決めた値を全画面へ即展開しない。

## 5. Wave構成

### Wave I0 — Guardrail and Preview Foundation

目的:

- production ownershipを変えず、新componentを安全に比較できる基盤を作る。

作業:

- approved asset registry reader。
- Heavy Design Theme candidate。
- Component Catalog／preview scene。
- Standard 390x844、Compact 360x800、Large 430x932 capture route。
- reduced-motion preview。
- state matrix preview。
- full-product glyph checker。

完了条件:

```txt
productionDefaultUnchanged=true
previewRouteReady=true
componentCatalogReady=true
threeViewportCaptureReady=true
glyphCoverageComplete=true
```

### Wave I1 — Shared Component Family

対象:

- PaperPanel
- PaperButton
- MemoryCard
- StateBadge
- InkSeal
- LanternFocus
- IconFrame
- ScreenHeader
- ModalFrame

作業順:

1. normal surface。
2. pressed／selected。
3. disabled／locked。
4. new／completed。
5. rare／evolution。
6. reduced motion。
7. Compact／Standard／Large。

完了条件:

- color-only state difference 0。
- required missing state 0。
- 9-slice stretch failure 0。
- text collision 0。
- direct generated whole-screen image use 0。

### Wave I2 — TOP

TOPは独立runtime screenが存在しないため、新規screen ownershipを追加する。

保持:

- Boot contract。
- StageSelectへの遷移contract。
- Save data initialization。
- Safe Area。

追加:

- TOP presenter/prefab。
- Primary CTA。
- Settings／Collection等のsecondary navigation。
- quiet ambient motion。
- absence baselineとの比較pack。

禁止:

- Boot処理とvisual compositionを密結合する。
- 巨大立ち絵でUIを隠す。
- 画像内文字。

切替条件:

```txt
TOP human visual score >= 36/40
readability=4
interactionClarity=4
brandDistinctiveness=4
primaryActionDiscoverable=true
```

### Wave I3 — StageSelect

保持:

- stage unlock。
- selected stage data。
- difficulty data。
- scroll/input ownership。
- Start action。

置換:

- flat route line。
- generic node。
- temporary info panel surface。
- color-only state。

実装単位:

1. background/night road。
2. route/path。
3. node family。
4. current marker。
5. locked seal。
6. stage information island。
7. start CTA。
8. scroll focus／VoiceOver order。

停止条件:

- flowchartに見える。
- current nodeが光なしで分からない。
- pathとnodeが背景へ埋没する。
- scrollでtap ownershipが壊れる。

### Wave I4 — LevelUp

保持:

- candidate generation。
- selection data。
- replacement／evolution route。
- pause/time ownership。

置換:

- temporary rectangle card。
- placeholder icon frame。
- color-only rarity。
- weak selected state。

実装単位:

1. overlay dim/background。
2. header。
3. card shell。
4. item icon binding。
5. title/body hierarchy。
6. normal／good／rare／evolution states。
7. selected／pressed。
8. overflow and long Japanese text。
9. reduced motion。

停止条件:

- management dashboardに見える。
- card本文が縮小でしか収まらない。
- rarityが色だけ。
- replacement/evolution contractが変わる。

### Wave I5 — Shared Token Freeze for Wave 1

TOP／StageSelect／LevelUpが全て個別PASSした後に実施する。

- 3画面で共通したtokenだけをTheme正式候補へ昇格。
- 画面固有hackはshared tokenへ入れない。
- component variant depthはBase→Variantの最大2層。
- duplicate sprite/material/font assetを除去する。

完了条件:

```txt
Wave1ScreensApproved=3/3
SharedComponentsApproved=true
ThemeCandidateFrozen=true
UnresolvedCrossScreenMismatch=0
```

### Wave I6以降

順序:

```txt
Battle HUD
Result
Pause
Inventory
Replacement
Collection
Evolution
Awakening
黒耀化
Battle Background polish
```

各screenはWave I2〜I4と同じ、baseline→preview→comparison→human approval→ownership切替で進める。

## 6. Commit分割

推奨commit family:

```txt
docs(design): bind approved handoff
feat(design-system): add preview-only theme and catalog
feat(design-assets): import approved component family
feat(top): add Heavy Design preview path
test(top): add three-viewport visual evidence
feat(top): switch approved production ownership
chore(top): retire superseded path
```

ルール:

- candidate importとproduction ownership切替を同じcommitにしない。
- screen実装と全Theme変更を同じcommitにしない。
- evidenceとhuman decisionを実装commitへ埋め込まない。
- rollback可能な粒度を守る。

## 7. 各Waveの必須検証

```txt
term lock
Heavy Design documentation check
font glyph coverage
Unity meta GUID uniqueness
compile
Editor assertions
existing gameplay contract checks
three viewport capture
state matrix capture
reduced motion capture
safe area
minimum tap target
VoiceOver order plan
performance budget review
human visual comparison
```

自動PASSだけでproduction ownershipを切り替えない。

## 8. Rollback

各screenのownership切替前に記録する。

```txt
baselineCommit
baselineCaptureManifest
oldOwner
newOwner
switchCommit
rollbackCommandOrRevertCommit
saveCompatibilityResult
navigationCompatibilityResult
```

Rollbackで戻してはいけないもの:

- unrelated U49 evidence。
- save data schema。
- gameplay data。
- approved character/enemy assets。

## 9. 失敗時の処理

- visual FAIL: 新pathをdefaultにせずpreviewに残すか破棄する。
- structural FAIL: visual調整を止め、contractを先に修復する。
- performance FAIL: effect密度を縮退し、layoutを壊さない。
- accessibility FAIL: stateを色以外のshape/text/markで補う。
- human disagreement: 1問の選択式decisionへ戻し、全実装をやり直さない。

## 10. 実装完了の意味

Screen implementation completeは次の全てを意味する。

```txt
approved visual direction reproduced
approved component assets connected
runtime contract preserved
three viewport PASS
state matrix PASS
accessibility baseline PASS
performance budget PASS
human device approval PASS
rollback evidence recorded
```

「コードを書いた」「buildが通った」「スクリーンショットが出た」だけでは完了ではない。

## 11. 現在判定

```txt
ExecutionPlanDocumented=true
ImageGenerationStarted=false
UnityDesignImplementationStarted=false
ImplementationBranchDefined=false
HumanImplementationStartApproval=false
NextAction=WAIT_FOR_APPROVED_WAVE1_VISUALS_AND_EXPLICIT_IMPLEMENTATION_START
```
