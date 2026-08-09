# ヨルノシルベ Heavy Design Production State Machine v1

Date: 2026-07-28
Status: ACTIVE / REQUIRED FOR ALL HEAVY DESIGN TRANSITIONS
Repository: `m-shogo/vamp-pon`

## 1. 目的

Heavy Designのcheckerを「画像生成もUnity実装も永遠に未開始であること」へ固定しない。

この文書は、documentation、画像生成、人間選択、component制作、Unity実装、実機review、whole-app visual freezeを、明示的な段階遷移として管理する。

各遷移は次を満たす必要がある。

- 現在stateの必須条件を満たす。
- 許可された次stateだけへ進む。
- human approvalが必要な遷移を自動処理しない。
- source of truth JSON、decision queue、generation queue、reference registry、implementation evidenceを同じcommit系列で同期する。
- U49 evidence、U50 readiness、gameplay/save contractをHeavy Design遷移で変更しない。

## 2. Machine-readable source

```txt
docs/design-targets/generated/design-production/workflow-state.json
```

自動checker:

```txt
pnpm design:heavy-documentation:check
```

## 3. State一覧

### HD0 `DOCUMENTATION_FOUNDATION`

現在state。

条件:

- Art Direction Aが人間選択済み。
- 13 screen specsが存在する。
- Wave 1 briefが3件準備済み。
- image generation未開始。
- Unity design implementation未開始。
- documentation foundation gateがPASS。

許可される次state:

- `WAVE1_GENERATION_APPROVED`

### HD1 `WAVE1_GENERATION_APPROVED`

W1-01 TOP briefを人間が明示承認し、ChatGPTで候補生成を始められる状態。

条件:

- active requestはW1-01 TOP。
- active brief human approval=true。
- pre-generation gate=true。
- image generation started=false。
- Unity implementation started=false。

許可される次state:

- `WAVE1_GENERATION_IN_PROGRESS`
- `DOCUMENTATION_FOUNDATION`（承認取消・brief再設計）

### HD2 `WAVE1_GENERATION_IN_PROGRESS`

ChatGPT会話上で1 briefの候補を生成・比較している状態。

条件:

- image generation started=true。
- active requestが1件だけ存在する。
- repository agent image generation=false。
- Unity implementation started=false。
- candidateはproduction approvalではない。

許可される次state:

- `WAVE1_DIRECTION_SELECTED`
- `WAVE1_GENERATION_APPROVED`（候補全破棄・再生成）

### HD3 `WAVE1_DIRECTION_SELECTED`

TOP、StageSelect、LevelUpのうちactive briefについて、人間が方向性を選択した状態。

条件:

- direction selection decisionがappend-onlyで存在する。
- selected candidateまたはrefined referenceのhashが記録される。
- current approved production assetにはまだ昇格しない。
- 次briefへ進む場合は前briefのselectionが記録済み。

許可される次state:

- `WAVE1_GENERATION_APPROVED`（次brief承認）
- `WAVE1_COMPONENTS_APPROVED`（3画面の方向選択後）
- `WAVE1_GENERATION_IN_PROGRESS`（選択案のrefinement）

### HD4 `WAVE1_COMPONENTS_APPROVED`

代表3画面から抽出したshared component familyが人間承認された状態。

条件:

- Button、Card、Panel、Icon plate、Paper、Ink、Lanternのcomponent boardが存在する。
- state variantsが定義される。
- cleanup、rights、provenanceが完了する。
- full product glyph coverageが完了する。
- Unity implementationはまだ未開始。

許可される次state:

- `IMPLEMENTATION_READY`
- `WAVE1_GENERATION_IN_PROGRESS`（component再制作）

### HD5 `IMPLEMENTATION_READY`

Unityへ入れるapproved assetsとhandoff packが揃い、開始判断だけを待つ状態。

条件:

- implementation handoff pack complete=true。
- exact runtime owners、prefab、Theme mapping、responsive、rollbackが確定する。
- implementation branchが確定する。
- human implementation start approval=true。
- Unity implementation started=false。

許可される次state:

- `IMPLEMENTATION_IN_PROGRESS`
- `WAVE1_COMPONENTS_APPROVED`（handoff差戻し）

### HD6 `IMPLEMENTATION_IN_PROGRESS`

preview routeとapproved componentを使ってUnity実装している状態。

条件:

- unity design implementation started=true。
- production ownershipは人間承認まで切り替えない。
- TOP → StageSelect → LevelUpの順を維持する。
- screenごとのrollback baselineが存在する。
- U49 evidence mutation=false。

許可される次state:

- `REPRESENTATIVE_VISUAL_REVIEW`
- `IMPLEMENTATION_READY`（実装差戻し）

### HD7 `REPRESENTATIVE_VISUAL_REVIEW`

TOP、StageSelect、LevelUpをSimulator／物理iPhoneで比較する状態。

条件:

- 390×844、Compact、Large captureが存在する。
- runtime contract、safe area、tap、VoiceOver、reduced motionを検査する。
- 3画面が同一productに見えるか人間reviewする。

許可される次state:

- `WHOLE_APP_EXPANSION`
- `IMPLEMENTATION_IN_PROGRESS`（修正）

### HD8 `WHOLE_APP_EXPANSION`

Wave 1で確定したsystemを残り10画面へ展開する状態。

条件:

- shared token／componentを画面ごとに再発明しない。
- Battle HUD、Result、Pause以降のpriority順を守る。
- 各screenは個別承認・rollback可能である。

許可される次state:

- `WHOLE_APP_VISUAL_FREEZE`
- `IMPLEMENTATION_IN_PROGRESS`（代表画面system修正が必要な場合）

### HD9 `WHOLE_APP_VISUAL_FREEZE`

全主要画面が販売候補品質で人間承認された状態。

条件:

- 13画面のrequired captureとhuman decisionが存在する。
- unresolved human rejection=0。
- placeholder=0、missing formal icon=0、clipped text=0、broken safe area=0。
- critical accessibility／performance／fresh-eyes failure=0。
- device human approval=true。

このstateは自動昇格しない。

## 4. Transition共通ルール

- 1 commitで2段階以上進めない。
- state変更commitには、理由、入力evidence、human decision、前state、次stateを記録する。
- stateを戻すことは失敗ではなく、再制作理由を記録した正規transitionとする。
- `final` filename、自動capture、CI successだけでstateを進めない。
- image candidate追加、human selection、production promotion、Unity ownership切替は別commitとする。
- current stateと各JSONが矛盾した場合、checkerはfail-closedする。

## 5. 現在地

```txt
currentState=DOCUMENTATION_FOUNDATION
stateCode=HD0
imageGenerationStarted=false
unityDesignImplementationStarted=false
pendingHumanDecisionCount=0
nextTransitionRequiresHumanApproval=true
nextAllowedState=WAVE1_GENERATION_APPROVED
```

## 6. 現在の禁止事項

- state JSONだけ先へ進めること。
- repository agentが画像を生成すること。
- Wave 1の選択前にUnity実装すること。
- U49／U50 readinessをHeavy Design stateへ連動させること。
- production ownershipをpreview比較前に切り替えること。
