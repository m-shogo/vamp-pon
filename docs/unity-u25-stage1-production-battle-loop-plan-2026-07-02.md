# Unity U25 Stage1 Production Battle Loop Plan

## Scope

U25はStage1をproduction-adjacent runtime loopへ接続する回であり、production approvalではない。U22 Battle visual polish、U23 LevelUp / Result / StageSelect UI polish、U24 Kokuyou / Rare / Evolution climax polishを、StageSelect -> Battle -> LevelUp -> Rare / Evolution / Kokuyou -> Result -> StageSelect / Retry の流れへ接続する。

## やること

- Stage1 runtime loop stateを明示する。
- U22 Battle visual stateをbattle runtime adapterから参照する。
- U23 LevelUp / Result / StageSelect stateをtransition presenterから参照する。
- U24 Kokuyou / Rare / Evolution hookをloop eventから呼べるfacadeへまとめる。
- Resultへ渡すreward draft modelとStageSelectへ渡すstage progress draft modelを用意する。
- SE / haptic hookの呼び出し口を一箇所にまとめる。
- 390x844確認artifactを作る。

## やらないこと

- production approvalへの昇格。
- generated final画像や参照PNGのruntime直貼り。
- Addressables本導入。
- 本番save / reward / unlock完成。
- 本番balance確定。
- SEファイル実装、haptic実機確認。

## 接続範囲

- U22: `U22BattleVisualPolishState` / `U22BattleVisualPolishPresenter` をBattle表示状態へ接続する。
- U23: `U23LevelUpCardPolishState`、`U23ResultLedgerPolishState`、`U23StageSelectMapPolishState` をloop遷移へ接続する。
- U24: `U24KokuyouClimaxState`、`U24RarePresentationPolishState`、`U24EvolutionClimaxState`、`U24ClimaxFeedbackHook` をイベントhookへ接続する。

## 残課題

Stage1本番化には、U26 balance、U27 save / reward / unlock本接続、U28 SE / haptic、U29 Sprite Atlas / performance / mobile実機FPS、U30 production approval gateが必要。

## U26前提

U25では流れが壊れず通ることを優先し、enemy wave / XP / drop / damage / recovery / kokuyou / evolutionの数値はU26でfirst playable balanceとして詰める。
