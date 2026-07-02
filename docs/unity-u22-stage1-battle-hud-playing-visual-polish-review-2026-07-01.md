# Unity U22 Stage1 Battle / HUD / Playing Visual Polish Review

## 1. Scope

U22はBattle Visual Polish Proofであり、本番Battle完成ではない。目的はU21.1でSeverity SだったStage1 playingの「仕様説明リストに見える」問題を減らし、スマホゲーム画面として見え始める状態へ寄せること。

## 2. U21.1までの残懸念引き継ぎ

U21.1はDesign Gap Analysis / Visual Polish Gateであり、本番デザイン完成ではない。デザインpro化はU22からU24で段階的に行う。Stage1本番完成ではない。実機確認できなかった項目はnot executed。iOS / Android Build Support missing。EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。黒耀化の本番balanceは未確定。SE / haptic / camera shakeはhook設計またはproof段階。Result stats行は実機輝度と小型端末で継続確認。StageSelect locked nodeの明度差と選択誘導は継続確認。RewardSummaryは表示用であり、永続反映していない。UnlockCandidateは候補であり、Stage解放を確定しない。本番save / reward / unlockは未接続。Battle / Stage1がSeverity S。Stage1 playingは仕様説明リストに見える。U22でBattle / HUD / playing visualを最優先にpro化する。

## 3. Library / package evaluation結果

既存URP / 2D URP、TMP、TimeScaleService、U19 feedback hooksで実施。Cinemachineは未導入のため使わない。Input Systemは既にmanifestにあるがU22ではtouch本格化に使わない。Sprite Atlasは後回し。third-partyは導入しない。

## 4. 新規package導入有無

新規package導入なし。manifest / package-lock差分なし。

## 5. Stage1 playing visual polish結果

U22State / Presenter / Controllerを追加し、プレイヤー、敵、攻撃、EXP、Heart、Memory、黒インクburst、lantern pulseを画面上のproof stateとして組んだ。Stage1 playingは大きな説明カード列ではなく、Battle fieldを中心にしたスクリーンショットへ変更した。

## 6. Battle HUD polish結果

Time / HP / Lv / EXP / Fragment / Memory / Kokuyou gaugeを上部HUDと右側gaugeに整理した。HP / EXPは細いbar、欠片 / 記憶は小chip、Ready状態はgaugeと短いlabelで表示する。

## 7. Player / enemy / attack visual結果

プレイヤーは中央やや下、敵は3体以上を外周に配置。攻撃arc、projectile、hit flashで命中点を示す。敵撃破位置に黒インク残り香を置いた。

## 8. Pickup / Drop readability polish結果

EXP fragmentを3個以上、Heart dropを1個、Memory shardを1個表示。Heartはnot magnet targetとして扱い、EXP吸引trailと区別した。

## 9. Hit feedback / ink burst / lantern pulse結果

通常hit flash、敵撃破時のink burst、プレイヤー周辺のlantern pulse、pickup pulse、黒耀化Ready pulseを追加した。camera impulseはlightweight proofとして扱い、Cinemachineは導入していない。

## 10. 黒耀化 HUD / battle visual結果

黒耀化gaugeをBattle HUD内に置き、Ready / Activeの差分を視認できるようにした。黒耀化はprototypeであり本番完成ではない。

## 11. Proof label reduction結果

大きな説明リストを避け、`U22 Battle Visual Proof`、Phase、particle / object / TimeScale、Kokuyou stateの小さいdebug labelに限定した。

## 12. U21 Vertical Slice接続維持結果

U21Stage1VerticalSliceControllerのclear pathからU22BattleVisualPolishStateを作る。U21 clear/fail path、BattleResultSummary、ResultPresentationModel、StageSelectPresentationModelは変更していない。

## 13. Mobile / performance budget結果

360x800 / 390x844 / 430x932を対象にスクリーンショットを作成。Peak proof particle countは32以下、Active proof object countはU20 baseline以下、TimeScale final=1。

## 14. screenshot結果

`docs/design-targets/generated/unity-u22/screenshots/` にU22 screenshotsを出力する。Editor batchmode screenshotであり、実機スクリーンショットではない。

## 15. 360x800 / 390x844 / 430x932確認

360x800、390x844、430x932のStage1 playing / HUD screenshotsを作成。mobile破綻はEditor screenshot上で確認。実機確認はnot executed。

## 16. Before / After U21 vs U22結果

BeforeはU21の説明カード列。AfterはU22のBattle field、HUD、player / enemy / pickup / feedback配置。U22 before-after contact sheetはreview用であり本番画面ではない。

## 17. 採用候補 / 再修正候補 / 保留候補 / 却下候補

採用候補: Battle HUD整理、pickup readability、ink burst、lantern pulse。再修正候補: 実機輝度、敵silhouette、pickup scale。保留候補: Cinemachine Impulse、Sprite Atlas、2D lighting本格化。却下候補: third-party tween / VFX package、text-baked UI image。

## 18. Route A採用方針 / Route B animation候補方針

Route Aは軽量UI proofとして採用候補。Route B animationはU23 / U24でmotion、SE、haptic、camera impulseと一緒に検討する。

## 19. candidate状態

U5/U8/U8.1/U10/U13/U14/U15/U16/U17/U18/U19/U20/U21/U21.1/U22素材はcandidate / proofのまま。production approvedへ昇格していない。

## 20. productionApproved=0か

productionApproved=0。

## 21. Resources系がproof-onlyか

Resources系はproof-only維持。U22でproduction Resourcesを追加していない。

## 22. text-baked imageがないか

runtime text-baked imageは追加していない。スクリーンショットはreview用。

## 23. 正式Result/StageSelect実装をしていないこと

正式Result / StageSelect実装はしていない。

## 24. Battle本番実装をしていないこと

Battle本番実装はしていない。U22はBattle Visual Polish Proof。

## 25. 報酬/セーブ/Stage解放ロジックを作っていないこと

報酬永続化、save、Stage解放ロジックは作っていない。

## 26. 黒耀化はprototype

黒耀化はprototypeであり本番完成ではない。

## 27. Addressables

Addressablesを導入していない。

## 28. ZenMaruGothic SDFの状態

`Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset` を使用。存在確認対象。

## 29. U22 Battle Visual Polish Verification結果

U22 Battle Visual Polish Verificationで確認する。

## 30. U21.1 Design Gap Verification結果

既存checkerとUnity verificationで継続確認する。

## 31. U21 Stage1 Vertical Slice Verification結果

既存checkerとUnity verificationで継続確認する。

## 32. U20 Mobile Feel Verification結果

既存checkerとUnity verificationで継続確認する。

## 33. U19 Game Feel Verification結果

既存checkerとUnity verificationで継続確認する。

## 34. U18 Kokuyou Runtime Verification結果

既存checkerとUnity verificationで継続確認する。

## 35. U17 Stage1 Loop Verification結果

既存checkerとUnity verificationで継続確認する。

## 36. U16 Battle Result Hook Verification結果

既存checkerとUnity verificationで継続確認する。

## 37. U15 Contract Verification結果

既存checkerで継続確認する。

## 38. U14 Flow Proof Verification結果

既存checkerで継続確認する。

## 39. U7.1 TimeScale / AssetProvider verification結果

TimeScale final=1を継続確認する。AssetProviderはproduction昇格なし。

## 40. U4/U5 verification結果

既存素材candidateとasset intake gateで継続確認する。

## 41. term lock / asset intake / meta / design review結果

term lock、asset intake、meta、design review checkerで継続確認する。

## 42. Console compile/runtime error有無

batchmode compile確認対象。Console errorなしを目標とする。

## 43. 実機確認

実機確認はまだnot executed。

## 44. 残る未解決懸念

U22はBattle Visual Polish Proofであり、本番Battle完成ではない。デザインpro化はU22からU24で段階的に行う。Stage1本番完成ではない。実機確認できなかった項目はnot executed。iOS / Android Build Support missing。EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。黒耀化の本番balanceは未確定。SE / haptic / camera shakeはhook設計またはproof段階。Cinemachine / Input System / Sprite Atlas の導入判断は必要に応じて継続。Result stats行は実機輝度と小型端末で継続確認。StageSelect locked nodeの明度差と選択誘導は継続確認。RewardSummaryは表示用であり、永続反映していない。UnlockCandidateは候補であり、Stage解放を確定しない。本番save / reward / unlockは未接続。

## 45. 次にやること

U23でLevelUp / Result / StageSelect Visual Polish Pass。U24で黒耀化 / Rare / Evolution Climax Polish Pass。U20.1でReal Device Build Pass。
