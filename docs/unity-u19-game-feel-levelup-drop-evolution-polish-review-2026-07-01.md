# Unity U19 Game Feel / LevelUp / Drop / Evolution Polish Proof Review

作成日: 2026-07-01

1. Scope
   - U19ではGame Feel Proofとして、EXP吸引、Drop / 回復drop、LevelUp、Rare、Evolution / 合体、黒耀化中の気持ちよさ差分を追加した。
   - 本番Battle、本番balance、save、reward反映、Stage解放、Addressables、production approved昇格は行っていない。

2. U18までの残懸念引き継ぎ
   - U17はStage1 Loop Proofであり、Stage1完成ではない。
   - Battle statsの一部値はproof/fallback。
   - clear/fail条件は仮。
   - U18は黒耀化runtime prototypeであり、本番完成ではない。
   - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
   - 黒耀化の本番balanceは未確定。
   - 黒耀化のSE / haptic / camera shakeは本番未実装またはproof段階。
   - Result stats行は実機輝度と小型端末で再確認。
   - StageSelect locked nodeの明度差と選択誘導は実機で確認。
   - RewardSummaryは表示用であり、永続反映していない。
   - UnlockCandidateは候補であり、Stage解放を確定しない。
   - 実機確認はnot executed。

3. U19 GameFeelProofState内容
   - CurrentLevel、CurrentExp、ExpToNext、CollectedFragments、CollectedHearts、DroppedItems、RareTriggered、EvolutionReady、EvolutionTriggered、KokuyouActive、ComboCount、LastFeelEventを持つ。

4. EXP吸引proof内容
   - 距離が近いほど強くなる `U19ExpMagnetProof` を追加。
   - 黒耀化Active中は吸引強度を1.35倍にするproof。
   - collect trail / pop proofを追加。

5. Drop / 回復drop proof内容
   - EXP fragment、Heart、Memory shard、Rare sparkを区別。
   - Heart / 回復dropはmagnet対象外で、手動取得として扱う。

6. LevelUp演出proof内容
   - 3枚カード: 夜の鉛筆 Lv+1、紙飛行機 Lv+1、街灯の輪 Lv+1。
   - Exp 100到達で開き、選択でproof levelを上げる。

7. Rare演出proof内容
   - rare card 1枚、short slow、warm flare proof。
   - ★★★やガチャ風表現は使っていない。

8. Evolution / 合体proof内容
   - `黒インク小瓶 Lv5 + 街灯の輪 Lv5 = 夜明けのインク灯`。
   - ready / trigger / presentation proofを追加。

9. 黒耀化中の気持ちよさ差分proof内容
   - EXP吸引、hit flash、trailを通常より強くするproof。
   - 終了後は通常intensityへ戻す。

10. Hit stop / camera impulse / flash / particle整理
    - Rare / Evolution / 黒耀化向けの軽いpulse値とparticle budgetを追加。
    - `Time.timeScale` は直接変更せず、TimeScaleServiceを使う。

11. SE / haptic hook設計
    - `docs/unity-u19-se-haptic-hook-design-2026-07-01.md` にhook名と強弱を記載。
    - U19ではlogのみ。

12. U17 Stage1 Loopへの接続内容
    - `U19GameFeelProofController` がU17 loop bridgeを呼び、Resultへは `Feel: Lv2 / Combo 4 / Kokuyou` のような表示用labelだけを持つ。
    - save / reward / unlockには接続していない。

13. U19 Game Feel Verification結果
    - `U19GameFeelVerification` を追加した。
    - EXP、drop、LevelUp、Rare、Evolution、黒耀化強度差分、feedback hook、particle budget、U17/U18 bridge、TimeScale finalを検証する。

14. screenshot結果
    - `docs/design-targets/generated/unity-u19/screenshots/u19-exp-magnet-proof-390x844.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-drop-healing-proof-390x844.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-levelup-proof-390x844.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-rare-proof-390x844.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-evolution-proof-390x844.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-kokuyou-feel-proof-390x844.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-stage1-loop-feel-proof-390x844.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-levelup-proof-360x800.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-levelup-proof-430x932.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-stage1-loop-feel-proof-360x800.png`
    - `docs/design-targets/generated/unity-u19/screenshots/u19-stage1-loop-feel-proof-430x932.png`
    - Contact sheet: `u19-all-game-feel-contact-sheet.png`

15. 390x844 / 360x800 / 430x932確認
    - LevelUpとStage1 Loop Feelは3解像度で出力する。
    - 実機確認はまだnot executed。

16. 採用候補 / 再修正候補 / 保留候補 / 却下候補
    - 採用候補: U19 proof state、feedback hooks、EXP magnet、LevelUp/Rare/Evolution proof。
    - 再修正候補: 本番EXP curve、drop table、Evolution DB、SE/haptic、camera shake。
    - 保留候補: 黒耀化B、Route B animation候補。
    - 却下候補: なし。

17. Route A採用方針 / Route B animation候補方針
    - Route Aを通常表示の基本方針として維持。
    - Route B glowは通常表示に使わず、将来animation候補として維持。

18. U5/U8/U8.1/U10/U13/U14/U15/U16/U17/U18/U19素材がcandidateのままか
    - すべてcandidate / proof-onlyのまま。

19. productionApproved=0か
    - productionApproved=0を維持。

20. Resources系がproof-onlyか
    - `Resources/U5Candidates`、`Resources/U8Candidates`、`Resources/U8Refined`、`Resources/U10Candidates` はproof-only維持。
    - `Resources/U19Proof` は作成していない。

21. text-baked imageがないか
    - UI文字はTextMeshPro。text-baked imageは追加していない。

22. 正式Result/StageSelect実装をしていないこと
    - 正式Result/StageSelect実装はしていない。

23. Battle本番実装をしていないこと
    - Battle本番実装はしていない。

24. 報酬/セーブ/Stage解放ロジックを作っていないこと
    - 報酬/セーブ/Stage解放ロジックを作っていない。

25. 黒耀化はprototypeであり本番完成ではないこと
    - 黒耀化はprototypeであり、本番完成ではない。

26. Addressablesを導入していないこと
    - Addressablesを導入していない。

27. ZenMaruGothic SDFの状態
    - `ZenMaruGothic-Medium SDF.asset` を使用する。

28. U19 Game Feel Verification結果
    - `U19GameFeelVerification` で確認する。

29. U18 Kokuyou Runtime Verification結果
    - U18 verificationは継続して実行対象。

30. U17 Stage1 Loop Verification結果
    - U17 verificationは継続して実行対象。

31. U16 Battle Result Hook Verification結果
    - U16 verificationは継続して実行対象。

32. U15 Contract Verification結果
    - U15 verificationは継続して実行対象。

33. U14 Flow Proof Verification結果
    - U14 verificationは継続して実行対象。

34. U7.1 TimeScale / AssetProvider verification結果
    - U7.1 verificationは継続して実行対象。

35. U4/U5 verification結果
    - U4/U5 verificationは継続して実行対象。

36. term lock / asset intake / meta / design review結果
    - U19 verificationで既存checkerと `git diff --check` を実行する。

37. Console compile/runtime error有無
    - U19 batchmode verificationとscreenshot captureで確認する。

38. 実機確認はまだnot executedか
    - iPhone / Android実機確認はまだnot executed。

39. 残る未解決懸念
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

40. 次にやること
    - U20 実機QA / Mobile Feel Passへ進む。
