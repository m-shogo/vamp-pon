# Unity U16 Battle Result Hook Proof Review

作成日: 2026-07-01

1. Scope
   - U16ではBattle側からResultへ渡す入口として、Battle Result Hook Proofを追加した。
   - 本番Battle全面実装、save、reward反映、Stage解放、difficulty本番計算、黒耀化runtime、Addressables、production approved昇格は行っていない。

2. U15.1 Contract Risk Cleanup結果
   - U15 contractはproduction-ready namingだが、production data source / save / reward / unlockには未接続であることをU16 plan / reviewへ引き継いだ。
   - `RewardSummary` は表示用summaryであり、永続反映しない。
   - `UnlockCandidate` は候補であり、Stage解放を確定しない。
   - `BattleResultSummary` はU15では本番Battleから生成されておらず、U16でもまだproof値から生成する。

3. BattleSessionStats内容
   - StageId: `stage_01`
   - StageTitle: `はじまりの路地`
   - DifficultyId: `easy`
   - DifficultyLabel: `やさしい`
   - ElapsedSeconds: `480`
   - DefeatedEnemies: `128`
   - CollectedFragments: `12`
   - CollectedMemories: `3`
   - Blessing: `3`
   - ReachedLevel: `5`
   - ClearState: `clear`

4. BattleSessionStatsCollector内容
   - enemy defeated count、fragment count、memory count、blessing、elapsed seconds、clear/fail、reached levelをproof値として集約する。
   - static global、PlayerPrefs、SaveManager、RewardManager、UnlockManagerには接続していない。

5. BattleResultSummaryBuilder内容
   - `BattleSessionStats` から `BattleResultSummary` を生成する。
   - `RewardSummary` は `記憶 / 墨 / 灯` と欠片・記憶・加護の表示値を持つ。
   - `UnlockCandidate` は `HasCandidate=false`、理由は `U16ではStage解放を確定しない`。
   - Rank proofは clear + 480秒以上 + 討伐100以上でA、clearでB、failでC。

6. U2/U3/U5 Battle proofとの接続確認
   - U16では既存BattleController / U2/U3/U5 proofを大改造していない。
   - U14 proof requestからStage / Difficultyを受け、取れないBattle値はU16 proof fallbackで補った。

7. 実測値 / fallback値の区別
   - 実測または既存request由来: StageId、StageTitle、DifficultyId、DifficultyLabel。
   - fallback proof値: ElapsedSeconds、DefeatedEnemies、CollectedFragments、CollectedMemories、Blessing、ReachedLevel、ClearState。

8. U16 Battle Result Hook Proof内容
   - `U16BattleStatsProofAdapter` がU14 requestを `BattleSessionStats` へ変換する。
   - `U16BattleResultHookProofController` がsummary、ResultPresentationModel、StageSelectPresentationModelを生成する。

9. U14 FlowへのU16 Hook接続内容
   - U14 flow本体は従来proofのまま維持した。
   - 理由: U14 scene flowを壊さず、U16の渡し口検証を独立して成立させるため。

10. ResultPresentationModel変換結果
    - `今夜の記録`、Rank A、欠片12、記憶3、加護+3、時間08:00、討伐128、報酬カード `記憶 / 墨 / 灯` へ変換できた。

11. StageSelectPresentationModel戻り表示結果
    - `前回: Rank A / 欠片 12` を生成できた。
    - Stage unlockは確定していない。

12. Battle Result Hook smoke verification結果
    - `U16BattleResultHookVerification` を追加した。
    - collector、builder、RewardSummary、UnlockCandidate、ResultPresentationModel、StageSelectPresentationModel、fail rank、zero fragments、elapsed formattingを検証する。

13. screenshot結果
    - `docs/design-targets/generated/unity-u16/screenshots/u16-battle-result-hook-proof-390x844.png`
    - `docs/design-targets/generated/unity-u16/screenshots/u16-battle-result-hook-proof-360x800.png`
    - `docs/design-targets/generated/unity-u16/screenshots/u16-battle-result-hook-proof-430x932.png`
    - `docs/design-targets/generated/unity-u16/screenshots/u16-result-from-battle-summary-proof-390x844.png`
    - `docs/design-targets/generated/unity-u16/screenshots/u16-result-from-battle-summary-proof-360x800.png`
    - `docs/design-targets/generated/unity-u16/screenshots/u16-result-from-battle-summary-proof-430x932.png`
    - `docs/design-targets/generated/unity-u16/screenshots/u16-stage-return-with-last-result-proof-390x844.png`
    - `docs/design-targets/generated/unity-u16/screenshots/u16-stage-return-with-last-result-proof-360x800.png`
    - `docs/design-targets/generated/unity-u16/screenshots/u16-stage-return-with-last-result-proof-430x932.png`
    - Contact sheet: `u16-all-battle-result-hook-contact-sheet.png`

14. 390x844 / 360x800 / 430x932確認
    - Editor batchmode screenshotとして3解像度を出力する。
    - 実機確認はまだnot executed。

15. 採用候補 / 再修正候補 / 保留候補 / 却下候補
    - 採用候補: U16 stats collector、builder、adapter、verification。
    - 再修正候補: 本番Battleからの実測値接続、小型端末でのResult stats輝度。
    - 保留候補: 黒耀化B、Route B glow animation。
    - 却下候補: なし。

16. Route A採用方針 / Route B animation候補方針
    - Route Aを通常表示の基本方針として維持。
    - Route B glowは通常表示に使わず、将来animation候補として維持。

17. U5/U8/U8.1/U10/U13/U14/U15/U16素材がcandidateのままか
    - U5 / U8 / U8.1 / U10素材はcandidateのまま。
    - U13 prefab assetはformal prefab candidateのまま。
    - U14 proof scene / scripts / screenshotsはproof-only / candidateのまま。
    - U15 contract / mapper / adapterもcontract proof段階。
    - U16 scripts / screenshotsはproof-only / candidate。

18. productionApproved=0か
    - productionApproved=0を維持。

19. Resources系がproof-onlyか
    - `Resources/U5Candidates`、`Resources/U8Candidates`、`Resources/U8Refined`、`Resources/U10Candidates` はproof-only維持。
    - `Resources/U16Proof` は作成していない。

20. text-baked imageがないか
    - U16 screenshotsのUI文字はTextMeshProで載せる。
    - text-baked imageは追加していない。

21. 正式Result/StageSelect実装をしていないこと
    - 正式Result/StageSelect実装はしていない。

22. Battle本番実装をしていないこと
    - U16はBattle Result Hook Proofであり、本番Battle全面実装ではない。

23. 報酬/セーブ/Stage解放ロジックを作っていないこと
    - RewardSummaryは表示用であり、永続反映していない。
    - Save / Stage unlock / achievement / Collection更新は追加していない。

24. 黒耀化runtimeを実装していないこと
    - 黒耀化runtimeを実装していない。

25. Addressablesを導入していないこと
    - Addressablesを導入していない。

26. ZenMaruGothic SDFの状態
    - `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset` を使う。

27. U16 Battle Result Hook Verification結果
    - `U16BattleResultHookVerification` で検証する。

28. U15 Contract Verification結果
    - U15 contract verificationは継続して実行対象。

29. U14 Flow Proof Verification結果
    - U14 flow proof verificationは継続して実行対象。

30. U7.1 TimeScale / AssetProvider verification結果
    - U7.1 verificationは継続して実行対象。

31. U4/U5 verification結果
    - U4/U5 verificationは継続して実行対象。

32. term lock / asset intake / meta / design review結果
    - U16 verificationで既存checkerと `git diff --check` を実行する。

33. Console compile/runtime error有無
    - U16 batchmode verificationとscreenshot captureで確認する。

34. 実機確認はまだnot executedか
    - iPhone / Android実機確認はまだnot executed。

35. 残る未解決懸念
    - Result stats行は実機輝度と小型端末で再確認。
    - StageSelect locked nodeの明度差と選択誘導は実機で確認。
    - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
    - U16はBattle Result Hook Proofであり、本番Battle全面実装ではない。
    - BattleSessionStatsの一部値はfallbackの可能性がある。
    - RewardSummaryは表示用であり、永続反映していない。
    - UnlockCandidateは候補であり、Stage解放を確定しない。

36. 次にやること
    - U17でStageSelect -> Battle -> Result -> StageSelectのStage1 Loop Proofを作る。
    - 本番Battleから実測値を拾う接続は別passで行う。
