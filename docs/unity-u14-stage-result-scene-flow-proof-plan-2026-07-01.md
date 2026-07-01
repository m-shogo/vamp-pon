# Unity U14 Stage / Result Scene Flow Proof Plan

作成日: 2026-07-01

## Scope

1. U14は正式実装ではなく、U13 formal prefab candidateを使った仮Scene Flow Proofである。
2. 目的は `StageSelect -> Battle -> Result -> StageSelect` が画面として繋がって見えることをEditor proofで確認すること。
3. 正式Result Scene、正式StageSelect Scene、本番Battle、production data binding、save、reward反映、Stage unlock、difficulty本番計算、黒耀化runtime、Addressables、production approved昇格は行わない。

## Temporary Flow

仮flowは次の順に限定する。

1. `U14StageSelectFlowProof`
2. `U14BattleFlowProof`
3. `U14ResultFlowProof`
4. `U14StageSelectFlowProof`

StageSelectでは `stage_01 / やさしい` を選択中として扱う。Battleは本番戦闘ではなく、固定の仮結果を作る軽量proof画面にする。

## Proof Scenes

U14で作るproof sceneは以下に置く。

- `unity/VampPonUnity/Assets/_Project/Scenes/Proof/U14StageSelectFlowProof.unity`
- `unity/VampPonUnity/Assets/_Project/Scenes/Proof/U14BattleFlowProof.unity`
- `unity/VampPonUnity/Assets/_Project/Scenes/Proof/U14ResultFlowProof.unity`

Build Settingsへ正式Sceneとして追加しない。既存Boot / Stage1本体は変更しない。

## FlowState

`U14FlowState` はproof-onlyの一時状態だけを持つ。

- `SelectedStageId`
- `SelectedDifficulty`
- `LastPlayedStageId`
- `LastResultSummary`
- `FlowStep`

PlayerPrefs、local file、SaveManager、production save serviceへ保存しない。domain reloadや再起動対応はU14の対象外。

## BattleResultSummaryProof

`BattleResultSummaryProof` はBattleからResultへ渡す固定の仮結果である。

- `ClearState`: `clear`
- `StageId`: `stage_01`
- `StageTitle`: `はじまりの路地`
- `Difficulty`: `やさしい`
- `ElapsedTime`: `08:00`
- `DefeatedEnemies`: `128`
- `Fragments`: `12`
- `Memories`: `3`
- `Blessing`: `3`
- `Rank`: `A`
- `RewardCards`: `記憶 / 墨 / 灯`

この値はproduction battle resultではない。

## Button Actions

- StageSelect `出発`: `BattleStartRequestProof` を作り、`U14ProofSceneRouter.GoToBattle` へ渡す。
- Battle `Resultへ`: `BattleResultSummaryProof` を作り、`U14ProofSceneRouter.GoToResult` へ渡す。
- Result `次へ`: `U14ProofSceneRouter.GoToStageSelect` へ戻す。

`SceneManager.LoadScene` を使う場合は `U14ProofSceneRouter` だけに閉じる。本番Scene transition serviceは作らない。

## Not Included

U14では以下を作らない。

- save / reward persistence
- Stage unlock runtime
- difficulty production calculator
- permanent upgrade
- achievement / Collection update
- Battle本番実装
- 黒耀化runtime / 黒耀化ゲージ / 黒耀化ボタン / 必殺cut-in runtime
- Addressables

## Candidate Assets

U5 / U8 / U8.1 / U10素材はcandidateのまま。U13 prefab assetはformal prefab candidateのまま。U14 proof scene / scripts / screenshotsもproof-only / candidateとして扱う。

`Resources/U5Candidates`, `Resources/U8Candidates`, `Resources/U8Refined`, `Resources/U10Candidates` はproof-onlyを維持し、U14では `Resources/U14Proof` を作らない。

## Approval State

productionApproved=0を維持する。U14ではapprovedへ昇格しない。

## U15以降へ残すこと

- production data source接続
- save / reward / Stage unlock / difficulty計算
- Battle本番結果からResultへ渡す契約
- Back / Home / Retry導線
- SE / haptic hook
- 実機Safe Area、輝度、小型端末確認
- 黒耀化runtime / gauge / button / cut-in runtime
