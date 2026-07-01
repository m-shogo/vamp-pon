# Unity U18 Kokuyou Runtime Prototype Review

作成日: 2026-07-01

1. Scope
   - U18では黒耀化runtime prototypeとして、ゲージ、蓄積、発動、overlay / cut-in band、Active、終了、Cooldownをproof実装した。
   - 本番黒耀化完成、本番balance、save、reward反映、Stage解放、Addressables、production approved昇格は行っていない。

2. U17結果の引き継ぎ
   - U17 Stage1 Loop Proofは維持し、黒耀化はResult報酬やStageSelect unlockには反映していない。

3. 黒耀化既存素材 / 候補レビュー
   - `kokuyou_fullscreen_final_candidate_b`: 主軸候補としてoverlay screenshotに使用。
   - `kokuyou_fullscreen_final_candidate_a`: 保留候補。
   - `cutin_black_ink_band_final_candidate`: cut-in band採用候補。
   - `levelup_rare_memory_tear_burst`: 採用候補だがU18 runtimeには未接続。
   - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。

4. KokuyouRuntimeState内容
   - `Idle`, `Charging`, `Ready`, `Activating`, `Active`, `Ending`, `Cooldown`。

5. KokuyouGaugeProof内容
   - Current、Max、Normalized、IsReadyを持つ。
   - Maxは100、Currentは0から開始。

6. KokuyouChargeRuleProof内容
   - proof damage takenで+25。
   - 100でReady。
   - 本番damage計算や永続強化には接続していない。

7. KokuyouRuntimePrototypeController内容
   - Ready時に `TryActivate` で発動。
   - ActiveDurationは5秒proof。
   - 終了時にGaugeを0へ戻し、Cooldown後Idleへ戻す。
   - Pause中は発動しない。

8. full-screen overlay内容
   - U10 candidate Bをoverlay候補として使用。
   - 画像に文字は焼き込まず、TMPを重ねる。

9. cut-in band内容
   - `cutin_black_ink_band_final_candidate` を使用候補とした。
   - 文字はTMPで `黒耀化` を重ねる。

10. U17 Stage1 Loopへの接続内容
    - U18ではU17 loopを壊さず、黒耀化使用回数やbonusをResultへ反映していない。
    - 接続はproof表示とruntime controllerに留めた。

11. TimeScale / Pause安全確認
    - `BattleTimeScaleService.TriggerHitStop` と `ForceRestore` を使う。
    - U18 runtimeは `Time.timeScale` を直接変更しない。
    - Pause中の発動は拒否する。

12. Kokuyou Runtime Verification結果
    - `U18KokuyouRuntimeVerification` を追加した。
    - gauge 0開始、damage charge、Ready、Activate、Active終了、Cooldown、Gauge reset、view show/hide、TimeScale finalを検証する。

13. screenshot結果
    - `docs/design-targets/generated/unity-u18/screenshots/u18-kokuyou-gauge-empty-390x844.png`
    - `docs/design-targets/generated/unity-u18/screenshots/u18-kokuyou-gauge-ready-390x844.png`
    - `docs/design-targets/generated/unity-u18/screenshots/u18-kokuyou-activating-overlay-390x844.png`
    - `docs/design-targets/generated/unity-u18/screenshots/u18-kokuyou-active-proof-390x844.png`
    - `docs/design-targets/generated/unity-u18/screenshots/u18-kokuyou-ending-proof-390x844.png`
    - `docs/design-targets/generated/unity-u18/screenshots/u18-kokuyou-loop-return-390x844.png`
    - `docs/design-targets/generated/unity-u18/screenshots/u18-kokuyou-active-proof-360x800.png`
    - `docs/design-targets/generated/unity-u18/screenshots/u18-kokuyou-active-proof-430x932.png`
    - Contact sheet: `u18-kokuyou-all-contact-sheet.png`

14. 390x844 / 360x800 / 430x932確認
    - Active proofは3解像度で出力する。
    - 主要状態は390x844で出力する。
    - 実機確認はまだnot executed。

15. 採用候補 / 再修正候補 / 保留候補 / 却下候補
    - 採用候補: runtime state、gauge、charge rule、controller、TimeScale verification。
    - 再修正候補: 本番balance、SE、haptic、camera shake、専用cut-in。
    - 保留候補: 黒耀化A、Route B animation候補。
    - 却下候補: なし。

16. Route A採用方針 / Route B animation候補方針
    - Route Aを通常表示の基本方針として維持。
    - Route B glowは通常表示に使わず、将来animation候補として維持。

17. U5/U8/U8.1/U10/U13/U14/U15/U16/U17/U18素材がcandidateのままか
    - すべてcandidate / proof-onlyのまま。

18. productionApproved=0か
    - productionApproved=0を維持。

19. Resources系がproof-onlyか
    - `Resources/U5Candidates`、`Resources/U8Candidates`、`Resources/U8Refined`、`Resources/U10Candidates` はproof-only維持。
    - `Resources/U18Proof` は作成していない。

20. text-baked imageがないか
    - UI文字はTMP。full-screen overlay / cut-in bandに文字を焼き込んでいない。

21. 正式Result/StageSelect実装をしていないこと
    - 正式Result/StageSelect実装はしていない。

22. Battle本番実装をしていないこと
    - Battle本番実装はしていない。

23. 報酬/セーブ/Stage解放ロジックを作っていないこと
    - 報酬/セーブ/Stage解放ロジックを作っていない。

24. 黒耀化はruntime prototypeであり本番完成ではないこと
    - 黒耀化runtime prototypeであり、本番完成ではない。

25. Addressablesを導入していないこと
    - Addressablesを導入していない。

26. ZenMaruGothic SDFの状態
    - `ZenMaruGothic-Medium SDF.asset` を使用する。

27. U18 Kokuyou Runtime Verification結果
    - `U18KokuyouRuntimeVerification` で確認する。

28. U17 Stage1 Loop Verification結果
    - U17 verificationは継続して実行対象。

29. U16 Battle Result Hook Verification結果
    - U16 verificationは継続して実行対象。

30. U15 Contract Verification結果
    - U15 verificationは継続して実行対象。

31. U14 Flow Proof Verification結果
    - U14 verificationは継続して実行対象。

32. U7.1 TimeScale / AssetProvider verification結果
    - U7.1 verificationは継続して実行対象。

33. U4/U5 verification結果
    - U4/U5 verificationは継続して実行対象。

34. term lock / asset intake / meta / design review結果
    - U18 verificationで既存checkerと `git diff --check` を実行する。

35. Console compile/runtime error有無
    - U18 batchmode verificationとscreenshot captureで確認する。

36. 実機確認はまだnot executedか
    - iPhone / Android実機確認はまだnot executed。

37. 残る未解決懸念
    - U18は黒耀化runtime prototypeであり、本番完成ではない。
    - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
    - 黒耀化の本番balanceは未確定。
    - 黒耀化のSE / haptic / camera shakeは本番未実装またはproof段階。
    - Result stats行は実機輝度と小型端末で再確認。
    - StageSelect locked nodeの明度差と選択誘導は実機で確認。
    - RewardSummaryは表示用であり、永続反映していない。
    - UnlockCandidateは候補であり、Stage解放を確定しない。
    - 実機確認はnot executed。

38. 次にやること
    - U19でGame Feel / LevelUp / Drop / Evolution Polishへ進む。
