# Unity U21 Stage1 Vertical Slice Integration Review

## 1. Scope

U21はVertical Slice Integrationであり、Stage1本番完成ではない。U16/U17/U18/U19/U20のproofを `StageSelect -> U21 Stage1 -> Result -> StageSelect` で接続した。

## 2. U20までの残懸念引き継ぎ

実機確認、iOS / Android Build Support missing、EXP curve、LevelUp抽選、drop table、evolution recipe、黒耀化Bの緑/黄色粒、SE / haptic / camera shake、Result stats、StageSelect locked node、RewardSummary表示専用、UnlockCandidate候補を継続する。

## 3. U21 Stage1 Vertical Slice State内容

`U21Stage1VerticalSliceState` にStageStartRequest、BattleSessionStatsCollector、U19GameFeelProofState、KokuyouRuntimeState、phase、EXP/Drop/LevelUp/Rare/Evolution/黒耀化/Result/StageSelect returnの状態を保持した。

## 4. U21 Stage1 Vertical Slice Controller内容

`U21Stage1VerticalSliceController` はClear pathとFail pathを分けて実行し、BattleTimeScaleServiceでTimeScaleを戻す。U2/U3/U5の本番Battle系は変更していない。

## 5. U21 scene / view内容

本番Sceneは追加していない。`U21Stage1VerticalSliceView` とEditor batchmode screenshotで、縦スライスの表示証跡を作る。

## 6. StageSelect -> U21 Stage1 -> Result -> StageSelect flow

StageSelectPresentationModelからStageStartRequestを受け、U21 Stage1 proofを実行し、BattleResultSummary、ResultPresentationModel、StageSelectPresentationModelのlast result labelへ戻す。

## 7. Battle Result Hook統合内容

U16のBattleSessionStatsCollectorとBattleResultSummaryBuilderを使用した。ClearはRank A、FailはRank Cのproof結果へ変換する。

## 8. LevelUp / Rare / Evolution統合内容

U19のLevelUp controller、Rare presentation、Evolution controllerを呼び出した。抽選、recipe、演出品質は本番未確定。

## 9. Drop / 回復drop統合内容

EXP fragment、Memory shard、Rare sparkはmagnet target、Heartはmanual collectのまま確認した。

## 10. 黒耀化統合内容

U18のKokuyouRuntimePrototypeControllerでdamage charge、Ready、Active、Idle returnを確認する。黒耀化はprototypeであり本番完成ではない。

## 11. Clear path結果

Proof値はelapsed 480、defeated 128、fragments 12、memories 3、blessing 3、Rank A。

## 12. Fail path結果

Proof値はelapsed 180、defeated 8、fragments 1、memories 0、blessing 0、Rank C。

## 13. Mobile QA基準維持結果

U20の360x800 / 390x844 / 430x932基準を継続し、Safe Area、Touch target、Result stats、黒耀化overlay、particle count、TimeScale final=1を確認対象に残した。

## 14. U21 verification結果

`U21Stage1VerticalSliceVerification` でState初期化、Playing経由、EXP/LevelUp、Rare、Evolution、Healing drop、黒耀化、Clear/Fail、Result変換、StageSelect return、TimeScale final=1、particle budget、productionApproved=0を検証する。

## 15. screenshot結果

Editor batchmode screenshotとして `docs/design-targets/generated/unity-u21/screenshots/` に22枚を出力する。実機スクリーンショットではない。

## 16. 360x800 / 390x844 / 430x932確認

StageSelect entry、Stage1 playing、LevelUp、黒耀化active、Clear resultは3解像度で出力する。Rare、Evolution、黒耀化ready、Fail result、Stage return、contact sheetは390x844で出力する。

## 17. 採用候補 / 再修正候補 / 保留候補 / 却下候補

採用候補はU21 controller/state/checker。再修正候補はResult statsの実機輝度とStageSelect locked node。保留候補は本番balance。却下候補はsave/reward/Stage解放のU21接続。

## 18. Route A採用方針 / Route B animation候補方針

Route Aは静的proofとして採用。Route B animationはU22以降の候補に留める。

## 19. U5/U8/U8.1/U10/U13/U14/U15/U16/U17/U18/U19/U20/U21素材がcandidateのままか

candidateのまま。productionApproved=0。

## 20. productionApproved=0か

productionApproved=0。

## 21. Resources系がproof-onlyか

Resources系はproof-only維持。Addressablesは導入していない。

## 22. text-baked imageがないか

U21はUI要素としてTextMeshProを描画するだけで、runtime assetとしてtext-baked imageは追加していない。

## 23. 正式Result/StageSelect実装をしていないこと

正式Result/StageSelect実装をしていない。U15 presentation modelとEditor proofのみ。

## 24. Battle本番実装をしていないこと

Battle本番実装をしていない。U21はproof controller。

## 25. 報酬/セーブ/Stage解放ロジックを作っていないこと

報酬/セーブ/Stage解放ロジックを作っていない。RewardSummaryは表示用であり、永続反映していない。

## 26. 黒耀化はprototypeであり本番完成ではないこと

黒耀化はprototype。黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。

## 27. Addressablesを導入していないこと

Addressablesを導入していない。

## 28. ZenMaruGothic SDFの状態

ZenMaruGothic SDF assetは存在確認対象。Unity batchmodeによる一時差分は検証後に戻す。

## 29. U21 Stage1 Vertical Slice Verification結果

`U21Stage1VerticalSliceVerification.Run` を実行対象に追加。

## 30. U20 Mobile Feel Verification結果

U20 Mobile Feel Verificationは継続実行対象。

## 31. U19 Game Feel Verification結果

U19 Game Feel Verificationは継続実行対象。

## 32. U18 Kokuyou Runtime Verification結果

U18 Kokuyou Runtime Verificationは継続実行対象。

## 33. U17 Stage1 Loop Verification結果

U17 Stage1 Loop Verificationは継続実行対象。

## 34. U16 Battle Result Hook Verification結果

U16 Battle Result Hook Verificationは継続実行対象。

## 35. U15 Contract Verification結果

U15 Contract Verificationは継続実行対象。

## 36. U14 Flow Proof Verification結果

U14 Flow Proof Verificationは継続実行対象。

## 37. U7.1 TimeScale / AssetProvider verification結果

U7 TimeScale Service VerificationとU7 AssetProvider Verificationは継続実行対象。

## 38. U4/U5 verification結果

U4 LevelUp UI VerificationとU5 Visual Candidate Verificationは継続実行対象。

## 39. term lock / asset intake / meta / design review結果

term lock、asset intake、meta、design reviewを最終チェックに含める。

## 40. Console compile/runtime error有無

Unity batchmode compileとU21 verificationで確認する。

## 41. 実機確認はまだnot executedか

実機確認はまだnot executed。iOS / Android Build Support missing。

## 42. 残る未解決懸念

- U21はVertical Slice Integrationであり、Stage1本番完成ではない。
- 実機確認できなかった項目はnot executed。
- iOS / Android Build Support missing。
- EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。
- 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
- 黒耀化の本番balanceは未確定。
- SE / haptic / camera shakeはhook設計またはproof段階。
- Result stats行は実機輝度と小型端末で継続確認。
- StageSelect locked nodeの明度差と選択誘導は継続確認。
- RewardSummaryは表示用であり、永続反映していない。
- UnlockCandidateは候補であり、Stage解放を確定しない。
- 本番save / reward / unlockは未接続。

## 43. 次にやること

U22: Stage1 Balance / Real Play Loop Pass、またはU20.1: Real Device Build Pass。
