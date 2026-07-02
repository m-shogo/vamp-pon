# Unity U21.1 Design Gap Analysis / Visual Polish Gate Review

## 1. Scope

U21.1はDesign Gap Analysis / Visual Polish Gateであり、本番デザイン完成ではない。U21で1本つながったStage1 Vertical Sliceを対象に、どこが安っぽいか、どこをpro化すべきか、どの順番で磨くべきかを整理した。

## 2. U21までの残懸念引き継ぎ

U21はVertical Slice Integrationであり、Stage1本番完成ではない。実機確認できなかった項目はnot executed。iOS / Android Build Support missing。EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。黒耀化の本番balanceは未確定。SE / haptic / camera shakeはhook設計またはproof段階。Result stats行、StageSelect locked node、RewardSummary表示専用、UnlockCandidate候補、本番save / reward / unlock未接続を継続する。

## 3. U21 screenshots / contact sheet review結果

U21 screenshotsは要素の接続確認としては有効。ただしStage1 playingとcontact sheetは説明UIっぽさが強く、ゲーム画面の手触りよりproofラベルが前に出ている。これをU21.1の最大ギャップとして扱う。

## 4. StageSelect design review

読みやすさはあるが、地図、旅支度、紙片、ルート線の感触が弱い。locked nodeの明度差はU21.1 screenshotで少し強めたが、本命はU23のStageSelect polish。

## 5. Stage1 / Battle design review

現状は仕様説明リストに見え、商品画面として最も弱い。プレイヤー、敵、弾、EXP、HUD、hit feedback、黒インクburstをU22で画面として組む必要がある。

## 6. EXP / Drop / 回復drop design review

Heart manual collectの仕様は見えるが、pickupそのもののscale、軌道、ランタンpulse、Memory shardの見え方が弱い。U22でpickup readabilityを上げる。

## 7. LevelUp design review

3枚カード構造とtouch targetは良い。無地カードで嬉しさが弱いので、U21.1ではspacingとcontrastだけ小修正し、U23でカード素材、seal、motionを磨く。

## 8. Rare design review

Rareは通常より少し強い色になっているが、まだflare panel止まり。gacha風の金ピカへは寄せず、U24でlow alpha pulseとrare sealを足す候補。

## 9. Evolution / 合体 design review

recipe ready / trigger / returnの流れは読めるが、合体のワクワクは弱い。item silhouette、光の収束、合体結果の変化をU24へ送る。

## 10. 黒耀化 design review

Ready / Activeの差はあるが、ゲームの顔としてはまだ弱い。黒インクのにじみ、full-screen cut-in、赤黒の層、ending余韻、SE/hapticをU24でまとめる。

## 11. Clear Result design review

Rank Aと報酬は読める。もう一度遊びたくなる報酬感、rank seal、朝焼け、報酬popが不足。U21.1ではResult背景alphaとfontを小調整したreview screenshotを出す。

## 12. Fail Result design review

FailとRank Cは読めるが、再挑戦への導線が弱い。U23でResult系の再挑戦hintとCTA差分を検討する。

## 13. Stage return design review

last result labelは機能するが、ただのテキストに見える。U23で地図上の紙片、封蝋、次node誘導へ変える候補。

## 14. Design Gap Analysis summary

最大ギャップはStage1 playingがゲーム画面に見えないこと。次点はLevelUp / Result / StageSelectの報酬感不足、黒耀化 / Rare / Evolutionのclimax不足。

## 15. Design Severity Ranking summary

1位はBattle / Stage1でSeverity S。2〜5位はLevelUp、黒耀化、Result、StageSelectでSeverity A。Rare、Evolution、Drop / 回復dropはSeverity B。

## 16. 小さなVisual Polish修正内容

U21.1 screenshot captureで、TMP文言短縮、font size +1、StageSelect locked node contrast強化、LevelUp card spacing微調整、Result ledger alpha強化、黒耀化overlay alpha微調整、contact sheet文言整理を行った。本番runtimeの大規模改修はしていない。

## 17. Visual Polish Candidate Notes summary

U22はBattle HUD / pickup / playing visual、U23はLevelUp / Result / StageSelect、U24は黒耀化 / Rare / Evolutionを磨く方針に整理した。

## 18. screenshot結果

`docs/design-targets/generated/unity-u21-1/screenshots/` にEditor batchmode screenshotを20枚出力する。実機スクリーンショットではない。

## 19. 390x844 / 360x800 / 430x932確認

必須12枚は390x844。追加でStage1 playing、LevelUp、黒耀化active、Resultを360x800 / 430x932でも出力する。

## 20. 採用候補 / 再修正候補 / 保留候補 / 却下候補

採用候補: U21.1 docs、severity ranking、review screenshots、checker。再修正候補: Battle / Stage1、LevelUp、Result、StageSelect、黒耀化。保留候補: Rare / Evolutionのclimax polish。却下候補: U21.1でのsave / reward / Stage解放接続。

## 21. Route A採用方針 / Route B animation候補方針

Route Aは静的proof / review資料として採用。Route B animationはU22〜U24のmotion候補に留める。

## 22. U5/U8/U8.1/U10/U13/U14/U15/U16/U17/U18/U19/U20/U21/U21.1素材がcandidateのままか

すべてcandidate / proof / review段階のまま。productionApproved=0。

## 23. productionApproved=0か

productionApproved=0。

## 24. Resources系がproof-onlyか

Resources系はproof-onlyのまま。U21.1では新規Resources/U21_1Proofを作成していない。

## 25. text-baked imageがないか

U21.1 screenshot内の文字はEditor上のTextMeshProで描画している。runtime用text-baked imageは追加していない。

## 26. 正式Result/StageSelect実装をしていないこと

正式Result/StageSelect実装はしていない。U21.1はreview captureとdocsのみ。

## 27. Battle本番実装をしていないこと

Battle本番実装はしていない。U22以降へ送る。

## 28. 報酬/セーブ/Stage解放ロジックを作っていないこと

報酬/セーブ/Stage解放ロジックは作っていない。

## 29. 黒耀化はprototypeであり本番完成ではないこと

黒耀化はprototypeであり、本番完成ではない。U24でclimax polish候補。

## 30. Addressablesを導入していないこと

Addressablesを導入していない。

## 31. ZenMaruGothic SDFの状態

ZenMaruGothic SDF assetは存在確認対象。Unity batchmodeで一時差分が出た場合は戻す。

## 32. U21.1 Design Gap Verification結果

`U21_1DesignGapVerification` でdocs、screenshots、productionApproved、Addressables、禁止語、TimeScaleを確認する。

## 33. U21 Stage1 Vertical Slice Verification結果

U21 Stage1 Vertical Slice Verificationは継続実行対象。

## 34. U20 Mobile Feel Verification結果

U20 Mobile Feel Verificationは継続実行対象。

## 35. U19 Game Feel Verification結果

U19 Game Feel Verificationは継続実行対象。

## 36. U18 Kokuyou Runtime Verification結果

U18 Kokuyou Runtime Verificationは継続実行対象。

## 37. U17 Stage1 Loop Verification結果

U17 Stage1 Loop Verificationは継続実行対象。

## 38. U16 Battle Result Hook Verification結果

U16 Battle Result Hook Verificationは継続実行対象。

## 39. U15 Contract Verification結果

U15 Contract Verificationは継続実行対象。

## 40. U14 Flow Proof Verification結果

U14 Flow Proof Verificationは継続実行対象。

## 41. U7.1 TimeScale / AssetProvider verification結果

U7 TimeScale Service VerificationとU7 AssetProvider Verificationは継続実行対象。

## 42. U4/U5 verification結果

U4 LevelUp UI VerificationとU5 Visual Candidate Verificationは継続実行対象。

## 43. term lock / asset intake / meta / design review結果

term lock、asset intake、meta、design reviewを最終チェックに含める。

## 44. Console compile/runtime error有無

Unity batchmode compile、U21.1 verification、screenshot captureで確認する。

## 45. 実機確認はまだnot executedか

実機確認はまだnot executed。iOS / Android Build Support missing。

## 46. 残る未解決懸念

- U21.1はDesign Gap Analysis / Visual Polish Gateであり、本番デザイン完成ではない。
- デザインpro化はU22〜U24で段階的に行う。
- Stage1本番完成ではない。
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

## 47. 次にやること

U22: Stage1 Battle / HUD / Playing Visual Polish Pass。U23: LevelUp / Result / StageSelect Visual Polish Pass。U24: 黒耀化 / Rare / Evolution Climax Polish Pass。U20.1: Real Device Build Pass。
