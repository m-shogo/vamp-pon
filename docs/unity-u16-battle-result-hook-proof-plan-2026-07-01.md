# Unity U16 Battle Result Hook Proof Plan

作成日: 2026-07-01

## 1. Scope

U16は本番Battle実装ではなく、Battle Result Hook Proofである。U15で追加した `StageStartRequest` / `BattleResultSummary` / `ResultPresentationModel` を、Battle側で生成できる入口として検証する。

## 2. U15 contractをBattle側へ接続する理由

U15 contractはResult / StageSelectの表示境界を決めたが、本番Battle結果からはまだ生成されていない。U16ではBattle proof内で集められる値を `BattleSessionStats` に集約し、U15 contractへ変換できることだけを確認する。

## 3. BattleSessionStatsの役割

`BattleSessionStats` はStage、難易度、経過時間、討伐数、欠片、記憶、加護、到達Level、clear/failをまとめるproof contractである。保存状態やAnalyticsではない。

## 4. BattleSessionStatsCollectorの役割

`BattleSessionStatsCollector` はBattle中のproof値を増減・設定し、最後に `BattleSessionStats` を返す。static global、save、reward反映、Stage unlockには接続しない。

## 5. BattleResultSummaryBuilderの役割

`BattleResultSummaryBuilder` は `BattleSessionStats` から `BattleResultSummary` / `RewardSummary` / `UnlockCandidate` を作る。Rankはproof計算であり、本番balanceではない。

## 6. Battle proofから拾う値

U16ではU14の `BattleStartRequestProof` からStageと難易度を受け取り、elapsed / defeated / fragments / memories / blessing / reachedLevel はproof fallback値として補う。U2/U3/U5 battle proofは本番Battle結果として扱わない。

## 7. ResultPresentationModelへ変換する流れ

`BattleSessionStats -> BattleResultSummary -> BattleResultToPresentationMapper -> ResultPresentationModel` の順で変換する。表示はResult proofで使える形まで確認する。

## 8. U14 flowへ戻す流れ

U14 flowは壊さず、U16専用adapter/controllerから同じ `BattleResultSummary` と `StageSelectPresentationModel` を生成する。U14 controllerの大改造はしない。

## 9. save / reward / unlock境界

U16ではsave、reward persistence、Stage unlock確定、Collection更新、achievement更新をしない。`RewardSummary` は表示用summaryであり、`UnlockCandidate` は候補であり、Stage解放を確定しない。

## 10. 黒耀化runtime

U16では黒耀化runtime、黒耀化ゲージ、黒耀化ボタン、cut-in runtimeを作らない。U18以降のruntime prototypeへ残す。

## 11. productionApproved

U16のscript、docs、screenshotsはproof段階であり、production approvedへ昇格しない。productionApproved=0を維持する。

## 12. U17以降へ残すこと

Stage1 Loop Proof、clear/failの仮条件、Retry / Home / Back導線、黒耀化runtime prototype、本番Battle balance、本番save/reward/unlockはU17以降に分ける。
