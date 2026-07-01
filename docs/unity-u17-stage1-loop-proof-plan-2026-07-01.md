# Unity U17 Stage1 Loop Proof Plan

作成日: 2026-07-01

1. U17はStage1完成ではなくStage1 Loop Proofである。
2. `StageStartRequest` からU17 proof controllerを開始し、StageId / StageTitle / Difficultyを受け取る。
3. `BattleSessionStatsCollector` を使い、elapsed / defeated / fragments / memories / blessing / levelを実プレイ風に更新する。
4. clear/fail proof条件は `ElapsedSeconds >= 480` または `DefeatedEnemies >= 100` をclear、force failまたは閾値未満をfailとする。
5. `BattleResultSummaryBuilder` で `BattleResultSummary` を生成する。
6. `BattleResultToPresentationMapper` でResult表示用の `ResultPresentationModel` を生成する。
7. `StageSelectPresentationMapper` でStageSelectへ戻り、LastResultLabelを `前回: Rank A / 欠片 12` として表示できることを確認する。
8. Retry / Home / Back導線はU17では設計とproof labelに留める。
9. save / reward / unlockをまだ確定処理しない。
10. 黒耀化runtimeをまだ作らない。
11. productionApproved=0を維持する。
12. U18以降へ、黒耀化runtime prototype、TimeScale連携、本番Game Feelを残す。
