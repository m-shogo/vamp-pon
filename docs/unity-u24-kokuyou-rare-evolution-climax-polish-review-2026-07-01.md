# Unity U24 Kokuyou / Rare / Evolution Climax Polish Review

## 1. Scope

U24はClimax Polish Proofであり、本番climax完成ではない。黒耀化 / Rare / Evolutionを、このゲームの顔になる見せ場へ近づけるproofを追加した。

## 2. U23までの残懸念引き継ぎ

U22はBattle Visual Polish Proofであり、本番Battle完成ではない。U23はVisual Polish Proofであり、本番UI完成ではない。デザインpro化はU22からU24で段階的に行う。Stage1本番完成ではない。実機確認できなかった項目はnot executed。iOS / Android Build Support missing。EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。黒耀化の本番balanceは未確定。SE / haptic / camera shakeはhook設計またはproof段階。Cinemachine / Input System / Sprite Atlas の導入判断は必要に応じて継続。RewardSummaryは表示用であり、永続反映していない。UnlockCandidateは候補であり、Stage解放を確定しない。本番save / reward / unlockは未接続。generated直下のvisual targetとUnity proof screenshotにはまだ差がある。

## 3. Kokuyou visual target alignment結果

`kokuyou-cutin-final.png` の黒インクにじみ、赤黒/紫黒の層、斜めのランタン光、cut-in band、余韻をUnity proof要素へ分解した。

## 4. kokuyou-cutin-final画像をそのままruntimeへ貼っていないこと

貼っていない。U24 screenshotsはEditor batchmode review用であり、runtime textureではない。

## 5. 黒耀化 Ready polish結果

不穏なReady pulse、赤黒の低alpha層、lantern distortionの予兆を追加した。

## 6. 黒耀化 Activation / cut-in polish結果

短いcut-in band、黒インク帯、amber streak、camera impulse hookを追加した。

## 7. 黒耀化 Active polish結果

Active中の赤黒/紫黒layer、ink particles、通常Battleとの差を追加した。

## 8. 黒耀化 Ending polish結果

Ending releaseと余韻のfade proofを追加した。

## 9. Rare presentation polish結果

Rare cardにseal、低alpha pulse、warm flareを追加。ガチャ金ピカには寄せていない。

## 10. Evolution / 合体 climax polish結果

黒インク小瓶と街灯の輪が近づき、夜明けのインク灯へ変化するconvergence / complete proofを追加した。

## 11. Camera / SE / haptic hook設計結果

`docs/unity-u24-climax-se-haptic-camera-hook-design-2026-07-01.md` にevent名、camera impulse強度、haptic強度を定義した。SEファイル実装とhaptic実機確認はnot executed。

## 12. Mobile / performance budget結果

360x800 / 390x844 / 430x932でスクリーンショット作成。U24は静的proof中心で、TimeScale final=1を維持。

## 13. screenshot結果

`docs/design-targets/generated/unity-u24/screenshots/` に出力。Editor batchmode screenshotであり実機ではない。

## 14. 360x800 / 390x844 / 430x932確認

黒耀化Ready / Activeを360x800 / 390x844 / 430x932で確認。実機確認はnot executed。

## 15. Before / After U22/U23 vs U24結果

U22の黒耀化gauge proof、U23のUI polishから、U24ではclimax band / seal / convergenceへ発展。contact sheetはreview用。

## 16. 採用候補 / 再修正候補 / 保留候補 / 却下候補

採用候補: cut-in band、ink layer、rare seal pulse、evolution convergence。再修正候補: particle density、暗さ、green/yellow粒の人間レビュー。保留候補: Cinemachine、SE実装、haptic実機確認。却下候補: final画像貼り付け、金ピカrare、常時強shake。

## 17. Route A採用方針 / Route B animation候補方針

Route Aは軽量Climax Proofとして採用候補。Route B animationはU24.1 / U25でhuman reviewとmotion tuningを行う。

## 18. U5〜U24素材がcandidateのままか

candidate / proofのまま。production approvedへ昇格していない。

## 19. productionApproved=0か

productionApproved=0。

## 20. Resources系がproof-onlyか

Resources系はproof-only維持。U24 production Resourcesは追加していない。

## 21. text-baked imageがないか

runtime text-baked imageは追加していない。

## 22. 正式Result/StageSelect実装をしていないこと

正式Result / StageSelect実装はしていない。

## 23. Battle本番実装をしていないこと

Battle本番実装はしていない。

## 24. 報酬/セーブ/Stage解放ロジックを作っていないこと

報酬永続化、save、Stage解放ロジックは作っていない。

## 25. 黒耀化はprototypeであり本番完成ではないこと

黒耀化はprototypeであり本番完成ではない。

## 26. Addressablesを導入していないこと

Addressablesは導入していない。

## 27. ZenMaruGothic SDFの状態

ZenMaruGothic SDF assetを使用し、存在確認対象。

## 28. U24 Verification結果

U24 Verificationで確認する。

## 29. U23 Verification結果

継続確認対象。

## 30. U22 Battle Visual Polish Verification結果

継続確認対象。

## 31. U21.1 Design Gap Verification結果

継続確認対象。

## 32. U21 Stage1 Vertical Slice Verification結果

継続確認対象。

## 33. U20 Mobile Feel Verification結果

継続確認対象。

## 34. U19 Game Feel Verification結果

継続確認対象。

## 35. U18 Kokuyou Runtime Verification結果

継続確認対象。

## 36. U17 Stage1 Loop Verification結果

継続確認対象。

## 37. U16 Battle Result Hook Verification結果

継続確認対象。

## 38. U15 Contract Verification結果

継続確認対象。

## 39. U14 Flow Proof Verification結果

継続確認対象。

## 40. U7.1 TimeScale / AssetProvider verification結果

継続確認対象。

## 41. U4/U5 verification結果

継続確認対象。

## 42. term lock / asset intake / meta / design review結果

継続確認対象。

## 43. Console compile/runtime error有無

batchmode compile確認対象。Console errorなしを目標とする。

## 44. 実機確認はまだnot executedか

not executed。

## 45. 残る未解決懸念

Stage1本番Battle、本番balance、実機確認、save / reward / unlock、SEファイル実装、haptic実機確認、Sprite Atlas / performance最適化、production approvalは未完了。

## 46. 次にやること

U25 Stage1 Playable Balance / Real Loop Pass、U20.1 Real Device Build Pass、またはU24.1 Climax Human Review Fix。
