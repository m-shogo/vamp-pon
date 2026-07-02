# Unity U25 Stage1 Production Battle Loop Review

## 変更概要

U25では、U22 / U23 / U24のproofをStage1 runtime loopへ接続するproduction-adjacent層を追加した。これはproduction approvalではなく、productionApproved=0のまま。

## Stage1 runtime loopで繋がったもの

StageSelect start、Battle start、enemy wave state、EXP pickup、LevelUp、weapon/passive selection、Rare hook、Evolution hook、Kokuyou Ready / Activation / Active / Ending、clear / defeat、Result、reward draft、stage progress draft、StageSelect return / Retryを1つのstate flowとして辿れる。

## U22 / U23 / U24との接続点

- U22: Battle HUD / player / enemy / pickup / Kokuyou gauge stateをadapterで参照。
- U23: LevelUp cards / Result ledger / StageSelect map stateをtransition presenterで参照。
- U24: Kokuyou / Rare / Evolution climax stateとfeedback hook event名をfacadeで参照。

## proof / draft / production-adjacent

Battle loopはproduction-adjacentだが、save / reward / unlockはdraft。balanceはU26前提。演出はU24 proofを呼べるhookであり、最終演出ではない。

## productionApproved=0の理由

本番balance、実機確認、正式save、SE/haptic、performance最適化、production approval gateが未完了のため。

## generated final画像

generated final画像をruntimeへ貼っていない。U25 screenshotsは確認用artifactでありruntime素材ではない。

## save / reward / unlock残課題

U25では`U25RewardDraftModel`と`U25StageProgressDraftModel`のみ。永続化はproof repositoryで閉じ、正式saveではない。

## SE / haptic残課題

`U25Stage1FeedbackHooks`に呼び出し口をまとめた。SEファイル未実装、haptic実機確認not executed。

## performance / 実機確認

Sprite Atlas / performance最適化とiOS / Android実機確認は次フェーズ。

## 390x844確認結果

`docs/design-targets/generated/unity-u25/screenshots/` にStage1 runtime loop、LevelUp、Kokuyou Ready / Active、Evolution、Result、StageSelect progressの確認画像を出力する。

## 実行したcheck

U25 checker、U24 / U23 / U22 checker、既存Unity verification、term lock / asset intake / meta / design reviewを実行対象にする。

## 残リスク

U25は流れの接続が目的。最初の30秒、敵密度、XP cadence、drop、damage、recovery、Kokuyou reachability、Evolution reachabilityはU26で調整する。
