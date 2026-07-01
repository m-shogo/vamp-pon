# Unity U17 Stage1 Loop Proof Review

作成日: 2026-07-01

1. Scope
   - U17ではU16のBattle Result Hookを使い、StageSelect -> Stage1 Loop Proof -> Result -> StageSelectへ戻る1ループをproofとして追加した。
   - Stage1完成、本番Battle、本番wave、save、reward反映、Stage unlock、黒耀化runtime、Addressables、production approved昇格は行っていない。

2. U16結果の引き継ぎ
   - `BattleSessionStatsCollector` と `BattleResultSummaryBuilder` を再利用した。
   - `RewardSummary` は表示用であり、`UnlockCandidate` は候補のまま。

3. Stage1 Loop Proof内容
   - `U17Stage1LoopProofController` がStageStartRequestを受け、collector更新、clear/fail判定、summary生成、Result変換、StageSelect戻り表示までを行う。

4. StageStartRequestからBattle開始まで
   - `StageStartRequest.Sample` の `stage_01 / はじまりの路地 / easy / やさしい` を使用する。

5. BattleSessionStats更新内容
   - clear path: 480秒、討伐128、欠片12、記憶3、加護3、Level5。
   - fail path: 120秒、討伐8、欠片1、Level2。
   - 値はproof/fallbackであり、本番Battle実測ではない。

6. clear/fail proof条件
   - clear: `ElapsedSeconds >= 480` または `DefeatedEnemies >= 100`。
   - fail: force failまたは閾値未満。
   - RankはU16 builderに従い、clear + 480秒 + 討伐100以上でA、failでC。

7. BattleResultSummary生成結果
   - clear pathでRank A、Elapsed 08:00、欠片12、記憶3、加護3を生成する。
   - fail pathでRank Cを生成する。

8. ResultPresentationModel変換結果
   - `今夜の記録`、Rank A、欠片12、記憶3、加護+3、時間08:00、討伐128へ変換できる。

9. StageSelectPresentationModel戻り表示結果
   - StageSelectへ戻る表示として `前回: Rank A / 欠片 12` を生成できる。

10. LastResultLabel表示結果
    - LastResultLabelは表示用であり、saveには保存していない。

11. Retry / Home / Back導線設計
    - `docs/unity-u17-loop-navigation-design-2026-07-01.md` に記載した。
    - U17ではproof labelのみで、正式Top Scene、正式Pause Menu、正式Retry flowは作っていない。

12. Stage1 Loop smoke verification結果
    - `U17Stage1LoopVerification` を追加した。
    - StageStartRequest、collector更新、clear/fail、summary、ResultPresentationModel、StageSelectPresentationModel、LastResultLabelを検証する。

13. screenshot結果
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage-select-loop-entry-390x844.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage-select-loop-entry-360x800.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage-select-loop-entry-430x932.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage1-loop-battle-proof-390x844.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage1-loop-battle-proof-360x800.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage1-loop-battle-proof-430x932.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-result-from-loop-proof-390x844.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-result-from-loop-proof-360x800.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-result-from-loop-proof-430x932.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage-return-last-result-proof-390x844.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage-return-last-result-proof-360x800.png`
    - `docs/design-targets/generated/unity-u17/screenshots/u17-stage-return-last-result-proof-430x932.png`
    - Contact sheet: `u17-all-loop-contact-sheet.png`

14. 390x844 / 360x800 / 430x932確認
    - Editor batchmode screenshotで3解像度を出力する。
    - 実機確認はまだnot executed。

15. 採用候補 / 再修正候補 / 保留候補 / 却下候補
    - 採用候補: U17 loop controller、rule proof、verification。
    - 再修正候補: 本番Battle実測値接続、正式Retry / Pause / Home導線。
    - 保留候補: 黒耀化B、Route B glow animation。
    - 却下候補: なし。

16. Route A採用方針 / Route B animation候補方針
    - Route Aを通常表示の基本方針として維持。
    - Route B glowは通常表示に使わず、将来animation候補として維持。

17. U5/U8/U8.1/U10/U13/U14/U15/U16/U17素材がcandidateのままか
    - すべてcandidate / proof-onlyのまま。

18. productionApproved=0か
    - productionApproved=0を維持。

19. Resources系がproof-onlyか
    - `Resources/U5Candidates`、`Resources/U8Candidates`、`Resources/U8Refined`、`Resources/U10Candidates` はproof-only維持。
    - `Resources/U17Proof` は作成していない。

20. text-baked imageがないか
    - UI文字はTextMeshProで載せる。text-baked imageは追加していない。

21. 正式Result/StageSelect実装をしていないこと
    - 正式Result/StageSelect実装はしていない。

22. Battle本番実装をしていないこと
    - Battle本番実装はしていない。

23. 報酬/セーブ/Stage解放ロジックを作っていないこと
    - 報酬/セーブ/Stage解放ロジックを作っていない。

24. 黒耀化runtimeを実装していないこと
    - 黒耀化runtimeを実装していない。

25. Addressablesを導入していないこと
    - Addressablesを導入していない。

26. ZenMaruGothic SDFの状態
    - `ZenMaruGothic-Medium SDF.asset` を使用する。

27. U17 Stage1 Loop Verification結果
    - `U17Stage1LoopVerification` で確認する。

28. U16 Battle Result Hook Verification結果
    - U16 verificationは継続して実行対象。

29. U15 Contract Verification結果
    - U15 verificationは継続して実行対象。

30. U14 Flow Proof Verification結果
    - U14 verificationは継続して実行対象。

31. U7.1 TimeScale / AssetProvider verification結果
    - U7.1 verificationは継続して実行対象。

32. U4/U5 verification結果
    - U4/U5 verificationは継続して実行対象。

33. term lock / asset intake / meta / design review結果
    - U17 verificationで既存checkerと `git diff --check` を実行する。

34. Console compile/runtime error有無
    - U17 batchmode verificationとscreenshot captureで確認する。

35. 実機確認はまだnot executedか
    - iPhone / Android実機確認はまだnot executed。

36. 残る未解決懸念
    - U17はStage1 Loop Proofであり、Stage1完成ではない。
    - Battle statsの一部値はproof/fallback。
    - clear/fail条件は仮。
    - Result stats行は実機輝度と小型端末で再確認。
    - StageSelect locked nodeの明度差と選択誘導は実機で確認。
    - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
    - RewardSummaryは表示用であり、永続反映していない。
    - UnlockCandidateは候補であり、Stage解放を確定しない。

37. 次にやること
    - U18で黒耀化 runtime prototypeを追加する。
