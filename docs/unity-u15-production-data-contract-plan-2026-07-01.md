# Unity U15 Production Data Contract Plan

作成日: 2026-07-01

## Scope

1. U15は本番実装ではなく、production data sourceへ進む前のcontract proofである。
2. U14の仮Scene Flowで画面接続は見えたため、U15ではBattle / Result / StageSelect間のデータ契約と表示モデル変換を固める。
3. production-ready namingを使うが、production data source、save、reward反映、Stage unlock確定、difficulty本番計算には接続しない。

## U14 FlowからU15 Contractへ進める理由

U14の `BattleStartRequestProof` と `BattleResultSummaryProof` は画面flow確認用の固定データだった。U15では、次に本番Battle結果をResultへ渡す前に、以下を分離する。

- Battle開始要求
- Battle結果summary
- reward表示summary
- unlock候補
- Result表示モデル
- StageSelect戻り表示モデル

この分離により、本番Battle、save、reward、unlockを後続passで別々に接続できる。

## StageStartRequest Contract

`StageStartRequest` はStageSelectからBattleへ渡す開始要求である。

- `StageId`
- `StageTitle`
- `DifficultyId`
- `DifficultyLabel`
- `RequestedAt`
- `Source`

U15では `stage_01 / はじまりの路地 / easy / やさしい / proof-start / stage_select` をsampleとする。Stage unlock確認、difficulty本番計算、saveはしない。

## BattleResultSummary Contract

`BattleResultSummary` はBattleからResultへ渡す結果summaryである。

- `ClearState`
- `StageId`
- `StageTitle`
- `DifficultyId`
- `DifficultyLabel`
- `ElapsedSeconds`
- `ElapsedLabel`
- `DefeatedEnemies`
- `Fragments`
- `Memories`
- `Blessing`
- `Rank`
- `RewardSummary`
- `UnlockCandidate`

U15ではU14 proof dataから変換する。本番Battle結果からはまだ生成しない。

## RewardSummary Contract

`RewardSummary` は表示用summaryに留める。

- `RewardCards`
- `Fragments`
- `Memories`
- `Blessing`
- `DisplayLabels`

永続反映、Collection更新、実績更新は行わない。

## UnlockCandidate Contract

`UnlockCandidate` はStage解放の候補だけを表す。

- `HasCandidate`
- `StageId`
- `StageTitle`
- `Reason`

U15では `UnlockCandidate.None` を基本にし、Stage解放を確定しない。

## ResultPresentationModel Contract

`ResultPresentationModel` はResult画面向けの表示モデルである。

- `Title`
- `Rank`
- `FragmentLabel`
- `MemoryLabel`
- `BlessingLabel`
- `ElapsedLabel`
- `DefeatedEnemiesLabel`
- `RewardCardLabels`
- `ContinueLabel`

U13 `ResultViewModel` へ変換しやすい形にする。

## StageSelectPresentationModel Contract

`StageSelectPresentationModel` はStageSelect画面向けの表示モデルである。

- `Title`
- `Nodes`
- `Info`
- `StartLabel`
- `LastResultLabel`

`StageNodePresentationModel` と `StageInfoPresentationModel` を分け、node上の小さいlabelは復活させない。

## Contract Mapper / Adapter方針

U15では以下のpure C#寄りmapperを置く。

- `U14ToU15ContractMapper`
- `BattleResultToPresentationMapper`
- `StageSelectPresentationMapper`

mapperはUnity scene、SaveManager、RewardManager、UnlockManagerへ依存しない。U13 ViewModelへのadapterは表示互換のためだけに使い、production data sourceには接続しない。

## Not Included

U15では以下を行わない。

- save / reward / unlock確定処理
- difficulty本番計算
- 永続強化
- 実績 / 図鑑更新
- 本番Battle全面接続
- 黒耀化runtime / 黒耀化ゲージ / 黒耀化ボタン / 必殺cut-in runtime
- Addressables

## Approval State

productionApproved=0を維持する。U15で作るcontract / mapper / adapter / screenshotはproof段階であり、production approvedではない。

## U16以降へ残すこと

- 本番Battle resultから `BattleResultSummary` を生成する。
- production stage catalog / unlock stateから `StageSelectPresentationModel` を作る。
- save / reward反映 / unlock確定 / difficulty計算を別passで接続する。
- Back / Home / Retry、SE / haptic hookを設計する。
- 実機Safe Area、輝度、小型端末確認を実行する。
