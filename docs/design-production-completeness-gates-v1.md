# ヨルノシルベ Design Production Completeness Gates v1

Date: 2026-07-27
Status: **HOLD / documentation-only / mandatory reference before image generation**
Repository: `m-shogo/vamp-pon`

## 1. 目的

この文書は、Heavy Designを本物の販売品質へ到達させるために、既存ロードマップだけでは不足していた完成条件を補う必読ゲートである。

現在は画像生成、画像加工、Unity実装、runtime変更を開始しない。

次のいずれかを始める前に、本書の全項目を画面・asset family・技術仕様へ落とし込み、人間が明示承認する必要がある。

- ChatGPT上での画像生成
- generated candidateのGit登録
- component asset制作
- Unity統合
- Simulator visual review
- physical-device visual review
- whole-app visual freeze

## 2. 現在の固定状態

```txt
heavyDesignStatus=HOLD
wholeAppHumanVisualAccepted=false
artDirection=PROPOSED_NOT_LOCKED
designLanguage=INCOMPLETE
imageGenerationStarted=false
repositoryAgentMayGenerateImages=false
imageGenerationAuthority=CHATGPT_HUMAN_SUPERVISED
unityDesignImplementationStarted=false
runtimeMutationAllowed=false
u49EvidenceMutationAllowed=false
u50MayStart=false
pr76MustRemainDraft=true
```

CI、Stage1 Quality、自動capture、formal PNG、`final`というファイル名は、この状態を上書きしない。

## 3. Source of Truth

Heavy Design再開時は次の順で読む。

1. `docs/unity-current-doc-index-2026-07-10.md`
2. `docs/design-heavy-production-future-roadmap-2026-07-27.md`
3. `docs/design-heavy-production-next-chat-handoff-2026-07-27.md`
4. 本書 `docs/design-production-completeness-gates-v1.md`
5. `docs/unity-whole-app-heavy-design-audit-2026-07-27.md`
6. 画面監査JSONとhuman visual rejection JSON
7. `docs/unity-ui-design-system-v1.md`
8. `docs/asset-generation-consistency-system-v1.md`

矛盾時は、最新の明示的人間判断を最優先する。

## 4. 完成品質へ進むための追加必須ゲート

### G1. Technical Art Budget

見た目を確定する前に、各画面とasset familyの技術予算を定義する。

必須項目:

- texture atlas最大サイズ
- UI texture memory目安
- 画面ごとのatlas分割方針
- draw call目安
- material数
- shader variant数
- overdraw許容範囲
- mask、blur、glow、distortion使用上限
- 常時particle数と瞬間最大数
- animation同時実行数
-低性能・発熱時の縮退表現
- reduced-motion時の代替表現

ルール:

- 綺麗な案を作った後で重すぎると判明する進め方を禁止する。
- TOP、StageSelect、LevelUp、Battle HUD、Resultのbriefには技術予算を含める。
- U50で初めて性能問題を発見する設計にしない。

ゲート完了条件:

```txt
technicalArtBudgetDefined=true
screenPerformanceRiskReviewed=true
fallbackPresentationDefined=true
```

### G2. Asset Export and Import Specification

生成後に担当者ごとに設定が変わらないよう、masterからUnity importまで固定する。

必須項目:

- source master dimensions
- runtime dimensions
- aspect ratio
- color space / color profile
- alpha形式
- premultiplied alphaの扱い
- PNG保存方針
- atlas padding
- transparent edge padding
- 9-slice border
- PPU
- pivot
- filter mode
- compression
- mipmap
- wrap mode
- naming convention
- state suffix
- source、candidate、approved component、runtime derivativeの保存場所

命名例:

```txt
<family>_<role>_<state>_<size>_v<revision>.png
```

`final`という名称は承認状態を表さない。承認状態はregistryとhuman decisionのみで管理する。

ゲート完了条件:

```txt
exportSpecificationDefined=true
importPolicyMapped=true
namingConventionDefined=true
derivativeLineageDefined=true
```

### G3. Component State Coverage Matrix

Normal状態だけ綺麗なcomponentを完成扱いにしない。

対象状態:

```txt
Normal
Pressed
Selected
Disabled
Locked
New
Completed
Rare
Evolution
Kokuyou
Loading
Empty
Error
Fallback
ReducedMotion
```

全component familyについて必要／不要／未定義をmatrix化する。

対象例:

- button family
- card family
- StageNode
- StagePath
- InkLockSeal
- LevelUp card family
- inventory slot
- replacement slot
- Result reward card
- Collection entry
- modal
- Pause menu item

ゲート完了条件:

```txt
componentStateMatrixComplete=true
requiredMissingStates=0
colorOnlyStateDifferences=0
```

### G4. First-Time User Experience and Tutorial Clarity

完成画面は、既存ユーザーだけでなく初見ユーザーが操作できる必要がある。

定義対象:

- TOPで最初に押す場所
- 初回StageSelectの現在地
- 初回Battle開始導線
- LevelUpで何を選ぶか
- 武器／passive／rare／evolutionの識別
- 黒耀化の認知と使用経路
- Pauseへの入口
- Resultから次へ進む導線
- Collectionの意味
- 説明を表示しすぎない条件
- 再訪時にtutorialを邪魔にしない条件

ルール:

- visual polishで操作の発見可能性を下げない。
- primary actionは、光・位置・形・文言の複数手段で判別できること。
- tutorial専用の場当たりoverlayを量産しない。

ゲート完了条件:

```txt
firstTimeFlowDefined=true
primaryActionDiscoverable=true
tutorialDependencyMinimized=true
```

### G5. Accessibility Completeness

可読性だけではなく、視覚・聴覚・振動・motionの代替を定義する。

必須項目:

- 色だけに依存しないstate差
- minimum contrast
- 日本語本文のminimum font size
- 数値のminimum font size
- VoiceOver labelとreading order
- iconの補助label
- 音なしでも理解できるfeedback
- 振動なしでも理解できるfeedback
- reduced-motion時の代替演出
- flashing／強い明滅の禁止基準
- tap target minimum
- safe area
- text truncation／overflow方針

ゲート完了条件:

```txt
accessibilityRolesDefined=true
colorOnlyMeaning=0
audioOnlyMeaning=0
hapticOnlyMeaning=0
reducedMotionAlternativeDefined=true
```

### G6. Asset Rights, Provenance, and Commercial Use Gate

販売アプリへ入れるassetは、生成品質だけでなく利用根拠を追跡できる必要がある。

候補ごとに記録する。

```txt
candidateId
briefId
generationAuthority
generationDate
promptSummary
referencePaths
referenceHashes
outputPath
outputHash
intendedUse
humanEdits
cleanupProcess
commercialUseReviewed
licenseOrTermsNote
humanDecision
approvalLevel
supersedes
sourceCommit
```

ルール:

- 権利状態が不明な外部画像をreference inputへ混ぜない。
- characterやブランド素材を無断で別画風へ変換しない。
- `DIRECTION_SELECTED`をcommercial production approvalにしない。
- commercialUseReviewedがtrueになるまでproduction昇格しない。

ゲート完了条件:

```txt
provenanceComplete=true
commercialUseReviewed=true
unknownReferenceRights=0
```

### G7. Store and Marketing Surface Reservation

ゲーム内完成後に、App Store素材だけ別作品になることを防ぐ。

将来制作としてroadmapへ予約する。

- App icon
- Launch screen
- App Store screenshots
- App Store preview video
- title logo
- key visual
- social share image
- promotional capture route

ルール:

- ゲーム内Art Direction lock後に制作する。
- ストア画像のためにruntime画面を偽装しない。
- 実際のgameplay readabilityを保つ。
- ストア用文字とruntime文字を混同しない。

ゲート完了条件はD10以降に評価する。

```txt
storeSurfaceRoadmapReserved=true
marketingArtDirectionBoundToProduct=true
```

### G8. External Fresh-Eyes Review

制作者と既存プレイヤーの慣れだけで承認しない。

代表画面5枚と主要操作flowについて、プロジェクトを詳しく知らない第三者視点で確認する。

確認事項:

- 最初に押す場所が分かるか
- 何のゲームに見えるか
- ヨルノシルベ固有の印象があるか
- 読みにくい箇所はどこか
- 安っぽく見えるcomponentはどこか
- キャラ、敵、背景、UIが同じ作品に見えるか
- rare／locked／selectedを誤認しないか
- 操作説明なしで基本flowを理解できるか

評価は意見集計ではなく、観察結果と再現性を記録する。

ゲート完了条件:

```txt
freshEyesReviewCompleted=true
criticalDiscoverabilityFailures=0
criticalCohesionFailures=0
```

## 5. 既存15項目との統合

画像生成前に、次の既存未確定項目も完了する。

1. Color tokenと画面内面積比率
2. 日本語Typography roleとfont asset
3. Paper textureの密度、明度、edge
4. Ink stateの意味と禁止例
5. Lantern lightingの意味、強度、animation
6. UIとdot characterの質感接続
7. Icon familyの線幅、形状、色数、plate
8. Motion duration、easing、reduced motion
9. Screen transition family
10. TOP／StageSelect／LevelUpのgeneration brief
11. Existing final targetの再利用条件
12. Componentのmaster／runtime dimensions
13. 画像生成後のcleanup手順
14. Human comparison pack仕様
15. Visual freeze後の変更範囲

本書のG1〜G8を加え、合計23領域を画像生成前のcompleteness review対象とする。

## 6. 画像生成開始ゲート

以下の全条件がtrueになるまで、画像生成toolを呼ばない。

```txt
artDirectionHumanLocked
colorSystemDefined
typographyDefined
paperSystemDefined
inkSystemDefined
lanternSystemDefined
iconSystemDefined
motionSystemDefined
technicalArtBudgetDefined
exportSpecificationDefined
componentStateMatrixComplete
firstTimeFlowDefined
accessibilityRolesDefined
referenceRightsReviewed
generationBriefApproved
comparisonPackDefined
reservedOutputPathsDefined
```

画像生成はChatGPT上で、1 briefずつ、人間確認を挟んで行う。

## 7. Unity実装開始ゲート

画像生成後も、以下の全条件がtrueになるまでUnityへ入れない。

```txt
directionSelected
componentCandidateApproved
cleanupComplete
commercialUseReviewed
assetLineageRecorded
responsiveBehaviorDefined
stateVariantsDefined
accessibilityBehaviorDefined
runtimeStructureToPreserveDefined
safeAreaDefined
tapContractDefined
performanceRiskReviewed
implementationBranchDefined
rollbackPlanDefined
```

「とりあえず実装して確認」は禁止する。

## 8. Whole-App Visual Freeze Gate

画面単体PASSだけではD10へ進まない。

必須条件:

- 代表画面5枚が同一productに見える
- 全主要画面が0〜4評価で36/40以上
- brand distinctiveness=4
- readability=4
- interaction clarity=4
- asset cohesion=4
- placeholder=0
- missing formal icon=0
- clipped text=0
- broken safe area=0
- unresolved human rejection=0
- critical accessibility failure=0
- critical performance failure=0
- fresh-eyes critical failure=0
- device human approval=true

Visual freeze後の変更は、影響範囲を記録し必要な画面だけ再承認する。

## 9. 次チャットでの扱い

次のチャットでも、ユーザーが開始を明示するまでは次を禁止する。

- 画像生成
- 画像加工
- candidate asset追加
- Unity実装
- Design LanguageのLOCK
- whole-app visual approval
- U49／U50／U51 readiness変更

推奨開始タスク:

```txt
Heavy DesignのHOLD境界を確認する。
本書のG1〜G8と既存15項目を、Color、Typography、Paper、Ink、Lantern、Icon、Motion、technical art、accessibility、rightsの具体設定へ落とす。
画像生成・Unity実装は行わない。
```

## 10. 現在判定

```txt
Heavy Design roadmap=DOCUMENTED
Professional production method=DOCUMENTED
Completeness gates=DOCUMENTED
Art Direction=PROPOSED_NOT_LOCKED
Design Language=INCOMPLETE
Technical art budget=NOT_DEFINED
Export specification=NOT_DEFINED
State coverage matrix=NOT_DEFINED
First-time flow=NOT_DEFINED
Accessibility completeness=NOT_DEFINED
Commercial rights gate=NOT_COMPLETED
Store surface roadmap=RESERVED_BY_THIS_DOCUMENT
Fresh-eyes review=NOT_STARTED
Image generation=NOT_STARTED
Unity design implementation=NOT_STARTED
Whole-app visual approval=false
Next action=DOCUMENTATION_REFINEMENT
```
