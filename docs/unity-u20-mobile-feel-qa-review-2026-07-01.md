# Unity U20 Mobile Feel QA Review

作成日: 2026-07-01

1. Scope
   - U20ではMobile Feel / QA Passとして、U19までのproof群をスマホ画面、Safe Area、touch target、readability、performance budget観点で確認した。
   - 本番Battle、本番balance、save、reward反映、Stage解放、Addressables、production approved昇格は行っていない。

2. U19までの残懸念引き継ぎ
   - U19はGame Feel Proofであり、本番完成ではない。
   - EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。
   - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
   - 黒耀化の本番balanceは未確定。
   - SE / haptic / camera shakeはhook設計またはproof段階。
   - Result stats行は実機輝度と小型端末で再確認。
   - StageSelect locked nodeの明度差と選択誘導は実機で確認。
   - RewardSummaryは表示用であり、永続反映していない。
   - UnlockCandidateは候補であり、Stage解放を確定しない。
   - 実機確認はnot executed。

3. Mobile environment確認結果
   - Unity 6000.5.1f1とProjectVersion 6000.5.1f1を確認。
   - Xcode command line toolsは存在。
   - `adb` / `idevice_id` は見つからない。

4. iOS / Android Build Support module状況
   - iOS Build Support: missing。
   - Android Build Support: missing。
   - Android SDK/NDK/OpenJDK: missing / unknown。

5. 実機確認 executed / not executed
   - iPhone実機確認: not executed。
   - Android実機確認: not executed。
   - 実機FPS / touch / Safe Area: not executed。

6. Safe Area QA結果
   - U20SafeAreaVerificationで基準profileのtop/bottom marginを確認。
   - 実notch / home indicatorはnot executed。

7. Touch target QA結果
   - Start button、route node、Result next、LevelUp card、黒耀化proof targetが44px相当以上のproof基準を満たす。

8. Text readability QA結果
   - ZenMaruGothic SDFあり。
   - Result stats font baseline、LevelUp title、Evolution recipeの短さを確認。
   - 実機glyph視認性はnot executed。

9. StageSelect mobile QA結果
   - 360x800 / 390x844 / 430x932 screenshotを出力。
   - locked nodeの明度差は継続確認候補。

10. Stage1 Loop mobile QA結果
    - Stage1 Loop + Game Feel要素のmobile screenshotを出力。
    - Stage1はproofであり完成ではない。

11. LevelUp / Rare / Evolution mobile QA結果
    - LevelUpは3解像度で出力。
    - Rareは短いslow / warm flareに留める。
    - Evolution recipeは短い文言で表示。

12. EXP / Drop / 回復drop mobile QA結果
    - EXP scale / trail、Heart manual collect、Drop visibilityをverificationで確認。
    - 実機視認性はnot executed。

13. 黒耀化 mobile QA結果
    - Gauge ready、Pause中発動拒否、Active終了後Idle、EXP magnet強化を確認。
    - 黒耀化Bの緑/黄色粒は人間レビュー継続。

14. Performance / Particle / GC / TimeScale QA結果
    - Peak proof particle count: 32。
    - Active proof object count: 86。
    - Screenshot capture count: 20。
    - TimeScale final: 1。
    - Editor上の数値であり、実機FPS / thermalはnot executed。

15. 必要最小限の修正内容
    - 本番UI修正は行っていない。
    - U20 proof用debug screenshotとQA基準を追加した。

16. screenshot結果
    - `docs/design-targets/generated/unity-u20/screenshots/u20-stage-select-mobile-360x800.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-stage-select-mobile-390x844.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-stage-select-mobile-430x932.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-stage1-loop-mobile-360x800.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-stage1-loop-mobile-390x844.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-stage1-loop-mobile-430x932.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-levelup-mobile-360x800.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-levelup-mobile-390x844.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-levelup-mobile-430x932.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-result-mobile-360x800.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-result-mobile-390x844.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-result-mobile-430x932.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-kokuyou-mobile-360x800.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-kokuyou-mobile-390x844.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-kokuyou-mobile-430x932.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-game-feel-mobile-390x844.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-contact-sheet-mobile-core.png`
    - `docs/design-targets/generated/unity-u20/screenshots/u20-contact-sheet-mobile-risk.png`

17. 360x800 / 390x844 / 430x932確認
    - StageSelect、Stage1 Loop、LevelUp、Result、黒耀化を3解像度でEditor batchmode出力した。

18. 実機チェックリスト結果
    - `docs/unity-u20-real-device-checklist-2026-07-01.md` にnot executedを明記。

19. 採用候補 / 再修正候補 / 保留候補 / 却下候補
    - 採用候補: U20 QA baseline、verification、mobile screenshots。
    - 再修正候補: Result stats実機輝度、StageSelect locked node、実機touch。
    - 保留候補: 黒耀化B粒、Route B animation候補。
    - 却下候補: なし。

20. Route A採用方針 / Route B animation候補方針
    - Route Aを通常表示の基本方針として維持。
    - Route B glowは通常表示に使わず、将来animation候補として維持。

21. U5/U8/U8.1/U10/U13/U14/U15/U16/U17/U18/U19/U20素材がcandidateのままか
    - すべてcandidate / proof-onlyのまま。

22. productionApproved=0か
    - productionApproved=0を維持。

23. Resources系がproof-onlyか
    - `Resources/U5Candidates`、`Resources/U8Candidates`、`Resources/U8Refined`、`Resources/U10Candidates` はproof-only維持。
    - `Resources/U20Proof` は作成していない。

24. text-baked imageがないか
    - UI文字はTextMeshPro。text-baked imageは追加していない。

25. 正式Result/StageSelect実装をしていないこと
    - 正式Result/StageSelect実装はしていない。

26. Battle本番実装をしていないこと
    - Battle本番実装はしていない。

27. 報酬/セーブ/Stage解放ロジックを作っていないこと
    - 報酬/セーブ/Stage解放ロジックを作っていない。

28. 黒耀化はprototypeであり本番完成ではないこと
    - 黒耀化はprototypeであり、本番完成ではない。

29. Addressablesを導入していないこと
    - Addressablesを導入していない。

30. ZenMaruGothic SDFの状態
    - `ZenMaruGothic-Medium SDF.asset` を使用する。

31. U20 Mobile Feel Verification結果
    - U20 Mobile Feel Verificationで必須doc / screenshots / TimeScale final / no Addressablesを確認する。

32. U19 Game Feel Verification結果
    - U19 verificationは継続して実行対象。

33. U18 Kokuyou Runtime Verification結果
    - U18 verificationは継続して実行対象。

34. U17 Stage1 Loop Verification結果
    - U17 verificationは継続して実行対象。

35. U16 Battle Result Hook Verification結果
    - U16 verificationは継続して実行対象。

36. U15 Contract Verification結果
    - U15 verificationは継続して実行対象。

37. U14 Flow Proof Verification結果
    - U14 verificationは継続して実行対象。

38. U7.1 TimeScale / AssetProvider verification結果
    - U7.1 verificationは継続して実行対象。

39. U4/U5 verification結果
    - U4/U5 verificationは継続して実行対象。

40. term lock / asset intake / meta / design review結果
    - U20 verificationで既存checkerと `git diff --check` を実行する。

41. Console compile/runtime error有無
    - U20 batchmode verificationとscreenshot captureで確認する。

42. 残る未解決懸念
    - U20はMobile Feel / QA Passであり、本番完成ではない。
    - 実機確認できなかった項目はnot executed。
    - EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。
    - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
    - 黒耀化の本番balanceは未確定。
    - SE / haptic / camera shakeはhook設計またはproof段階。
    - Result stats行は実機輝度と小型端末で継続確認。
    - StageSelect locked nodeの明度差と選択誘導は継続確認。
    - RewardSummaryは表示用であり、永続反映していない。
    - UnlockCandidateは候補であり、Stage解放を確定しない。

43. 次にやること
    - U21 Stage1 Vertical Slice Integration、またはU20.1 Real Device Build Passへ進む。
