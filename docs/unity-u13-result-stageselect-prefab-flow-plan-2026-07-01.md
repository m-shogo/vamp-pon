# Unity U13 Result / StageSelect Prefab Flow Plan

作成日: 2026-07-01

## Scope

U13は正式完成ではなく、formal prefab asset候補 + flow設計passである。

U12のfunctional proofをもとに、Result / StageSelect / Common UIのPrefab候補を `Assets/_Project/Prefabs/UI/` 配下へ作る。まだ正式Scene接続、Battle本番遷移、save、reward反映、Stage解放、difficulty本番計算、Addressables、production approved昇格は行わない。

## Result Formal Prefab Candidates

- `ResultRoot.prefab`
- `ResultPaperLedgerPanel.prefab`
- `ResultRewardCard.prefab`
- `ResultStatsLine.prefab`
- `ResultContinueButton.prefab`
- `ResultRankSeal.prefab`
- `ResultNewBadge.prefab`

対応component候補:

- `ResultRootView`
- `ResultPaperLedgerPanelView`
- `ResultRewardCardView`
- `ResultStatsLineView`
- `ResultContinueButtonView`
- `ResultRankSealView`
- `ResultNewBadgeView`

## StageSelect Formal Prefab Candidates

- `StageSelectRoot.prefab`
- `StageMapPanel.prefab`
- `StageRouteLine.prefab`
- `StageRouteNode.prefab`
- `StageLanternMarker.prefab`
- `StageInfoPanel.prefab`
- `StageStartButton.prefab`

対応component候補:

- `StageSelectRootView`
- `StageMapPanelView`
- `StageRouteLineView`
- `StageRouteNodeView`
- `StageLanternMarkerView`
- `StageInfoPanelView`
- `StageStartButtonView`

## Common UI Prefab Candidates

- `PaperLabel.prefab`
- `PaperButton.prefab`
- `PaperPanel.prefab`
- `MemoryCard.prefab`
- `InkRouteLine.prefab`
- `LanternMarker.prefab`

対応component候補:

- `PaperLabelView`
- `PaperButtonView`
- `PaperPanelView`
- `MemoryCardView`
- `InkRouteLineView`
- `LanternMarkerView`

## Migration Policy

U11 / U12のproof-only componentはEditor proofと比較基準として残し、U13の`View` / `ViewModel`をformal prefab candidateの入口にする。

正式化時は以下を分ける。

- proof-only: screenshot / review / candidate確認
- production candidate: Prefab asset / View / ViewModel / action handler interface
- production runtime: Scene接続 / data source / transition / save / reward / unlock

## Flow Design

理想flowは `StageSelect → Battle → Result → StageSelect`。

U13ではflow map proofとdoc設計だけを作る。実Scene遷移はU14以降。

## Production Data Binding Plan

Result:

- `ResultViewModel`
- `ResultRewardCardViewModel`
- 将来のBattle result summaryからrank、fragments、memories、blessing、elapsed、defeatedEnemies、rewardsを受ける。

StageSelect:

- `StageSelectViewModel`
- `StageNodeViewModel`
- `StageInfoViewModel`
- 将来のstage catalog / unlock state / last result summaryからnode状態とInfoPanelを作る。

## Button Action Plan

- Result「次へ」: 将来StageSelectへ戻る。
- StageSelect「出発」: 将来Battleへ入る。
- U13では `IResultActionHandler`, `IStageSelectActionHandler`, `ProofResultActionHandler`, `ProofStageSelectActionHandler` まで。
- 本番Service、SaveManager、Scene遷移APIには接続しない。

## No Save / Reward / Stage Unlock

U13ではsave、reward反映、Stage解放、difficulty本番計算を作らない。

## Candidate Assets

U5 / U8 / U8.1 / U10 / U13素材はcandidate。`Resources/U5Candidates`, `Resources/U8Candidates`, `Resources/U8Refined`, `Resources/U10Candidates` はproof-only維持。U13で `Resources/U13Proof` は作らない。

## Approval State

productionApproved=0を維持する。U13でapprovedへ昇格しない。

## U14以降へ残すこと

- 仮Scene flow接続。
- production data source接続。
- save / reward / Stage unlock / difficulty計算。
- SE / haptic hook。
- Back / Home / Retry導線。
- 実機Safe Areaと輝度確認。
- 黒耀化runtime / ゲージ / ボタン / 必殺cut-in runtime。
