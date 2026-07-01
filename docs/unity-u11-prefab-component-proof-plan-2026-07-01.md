# Unity U11 Prefab Component Proof Plan

作成日: 2026-07-01

## Scope

U11は正式Sceneではなく、Prefab-like component proofである。

Result / StageSelectの正式Prefab asset化、正式Scene化、報酬ロジック、セーブ処理、Stage解放処理、difficulty処理、黒耀化runtime、必殺cut-in runtime、Addressables導入、production approved昇格は行わない。

## Result Components

- `ResultRootProof`: Result画面全体のproof root。
- `ResultPaperLedgerPanelProof`: 紙台帳パネル、rank seal、new badgeの配置候補。
- `ResultRewardCardProof`: 報酬カード1枚の表示候補。
- `ResultStatsLineProof`: stats行の背景とTMP表示候補。
- `ResultContinueButtonProof`: 「次へ」CTA候補。

## StageSelect Components

- `StageSelectRootProof`: StageSelect画面全体のproof root。
- `StageMapPanelProof`: 紙地図パネル候補。
- `StageRouteLineProof`: Route A向けインク線候補。
- `StageRouteNodeProof`: active / locked node状態候補。
- `StageLanternMarkerProof`: 起点ランタン候補。
- `StageInfoPanelProof`: 下部情報パネル候補。
- `StageStartButtonProof`: 「出発」CTA候補。

## Common Components

- `PaperLabelProof`: ZenMaruGothic TMP SDFを使うlabel候補。
- `PaperButtonProof`: 紙CTA button候補。
- `PaperPanelProof`: 紙panel / dark panel候補。

## Data Binding Plan

U11では仮データだけを表示する。正式実装時は以下をdata binding対象にする。

- Result: rank、拾った記憶数、拾った欠片数、朝の加護、報酬カード一覧、button action。
- StageSelect: stage id、stage name、difficulty label、route node状態、start button availability。

## TMP SDF Font Asset

U11 proofは `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset` をEditor screenshot scriptから読み込む。

画像にUI文字は焼き込まない。タイトル、数字、説明、button label、状態labelはTextMeshProで重ねる。

## Candidate Asset Sources

- U8: `Resources/U8Candidates`
- U8.1: `Resources/U8Refined`
- U10: `Resources/U10Candidates`

使用する素材はすべてcandidateであり、production approvedではない。

## Proof-only Boundary

- U11 componentはPrefab-like structureの確認用。
- 正式Sceneから参照しない。
- Result / StageSelectの正式runtime hookを追加しない。
- `Resources/U5Candidates`, `Resources/U8Candidates`, `Resources/U8Refined`, `Resources/U10Candidates` はproof-onlyのまま維持する。

## Approval State

- `productionApproved=0` を維持する。
- U11ではapprovedへ昇格しない。
- U11で新規画像生成は行わない。U10素材の明確な欠陥がないため、追加manifestは作らない。

## Before Formal Implementation

- Result stats行の実機可読性を確認する。
- StageSelect active / locked nodeの状態差を実機輝度で確認する。
- 黒耀化candidate Bを主軸候補にするか人間レビューで決める。
- TMP subsetの正式文字範囲を決める。
- Safe Area、data binding、Prefab asset化、transition、SE / haptic hookを別passで設計する。
