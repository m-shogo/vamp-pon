# Unity U21 Stage1 Vertical Slice Integration Plan

## Scope

U21はStage1本番完成ではなく、U16/U17/U18/U19/U20のproofを一本のVertical Slice Integrationとして接続する。到達目標は `StageSelect -> U21 Stage1 -> Result -> StageSelect` の表示用・検証用フローを確認できる状態。

## 統合対象

- U15: `StageStartRequest`, `ResultPresentationModel`, `StageSelectPresentationModel`
- U16: `BattleSessionStatsCollector`, `BattleResultSummaryBuilder`, `BattleResultSummary`
- U17: clear/fail proof rule
- U18: 黒耀化 runtime prototype
- U19: EXP, Drop, 回復drop, LevelUp, Rare, Evolution, feedback hook
- U20: mobile QA baseline, particle/object budget, TimeScale final=1

## 作るもの

- `U21Stage1VerticalSliceState`
- `U21Stage1VerticalSliceController`
- `U21Stage1VerticalSliceRule`
- `U21Stage1VerticalSliceView`
- `U21Stage1VerticalSlicePresenter`
- `U21Stage1VerticalSliceVerification`
- `U21Stage1VerticalSliceScreenshotCapture`
- `unity:u21-stage1-vertical-slice:check`

## Proof値

- StageId: `stage_01`
- StageTitle: `はじまりの路地`
- DifficultyId: `easy`
- DifficultyLabel: `やさしい`
- ProofDurationSeconds: `480`
- ClearDefeatThreshold: `100`
- ExpToLevelUp: `100`
- KokuyouGaugeMax: `100`
- KokuyouDamageCharge: `25`
- productionApproved=0

## Flow

1. StageSelectPresentationModelからStageStartRequestを受ける。
2. U21 controllerでStage1 proofを開始する。
3. EXP collectでLevelUpを開き、選択する。
4. Drop / 回復dropを確認する。Heartはmanual collect。
5. Rare presentationを一度出す。
6. Evolution ready / triggerを確認する。
7. 黒耀化 gauge ready / active / idle returnを確認する。
8. Clear pathとFail pathを別々にBattleResultSummaryへ変換する。
9. ResultPresentationModelへ変換する。
10. StageSelectPresentationModelへlast result labelとして戻す。

## 禁止・保留

- production Battleは実装しない。
- 正式Result/StageSelect runtimeは実装しない。
- save / reward persistence / Stage解放は接続しない。
- Addressablesを導入しない。
- `public/assets/sprites` を参照しない。
- U5/U8/U8.1/U10/U13/U14/U15/U16/U17/U18/U19/U20/U21素材はcandidateのまま。
- Resources系はproof-only維持。
- U22でStage1 Balance / Real Play Loop Passへ進める。
