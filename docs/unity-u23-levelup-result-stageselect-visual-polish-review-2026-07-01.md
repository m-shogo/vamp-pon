# Unity U23 LevelUp / Result / StageSelect Visual Polish Review

## 1. Scope

U23はVisual Polish Proofであり、本番UI完成ではない。LevelUp / Result / StageSelectを、generated visual targetの紙UI、黒インク、ランタン光、地図感、報酬感へ寄せた。

## 2. U22までの残懸念引き継ぎ

U22はBattle Visual Polish Proofであり、本番Battle完成ではない。デザインpro化はU22からU24で段階的に行う。Stage1本番完成ではない。実機確認できなかった項目はnot executed。iOS / Android Build Support missing。EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。黒耀化の本番balanceは未確定。SE / haptic / camera shakeはhook設計またはproof段階。Cinemachine / Input System / Sprite Atlas の導入判断は必要に応じて継続。Result stats行は実機輝度と小型端末で継続確認。StageSelect locked nodeの明度差と選択誘導は継続確認。RewardSummaryは表示用であり、永続反映していない。UnlockCandidateは候補であり、Stage解放を確定しない。本番save / reward / unlockは未接続。generated直下のvisual targetとUnity proof screenshotにはまだ大きな差がある。U23 / U24ではvisual targetとの差分を明記して寄せる。

## 3. Visual target alignment結果

final targetの紙の厚み、黒インクのにじみ、ランタン光、地図線、報酬stampをUnity primitiveへ分解した。画像そのものは使っていない。

## 4. final / generated画像をそのままruntimeへ貼っていないこと

貼っていない。U23 screenshotsはEditor batchmodeで作ったreview用画像でありruntime textureではない。

## 5. LevelUp visual polish結果

3枚カードを紙片 / 記憶カードとして構成し、黒インク縁、icon slot、selected glow、title / effect / level階層を入れた。

## 6. Result Clear visual polish結果

記録帳ledger、Rank seal、reward cards、朝焼けの薄い光を追加した。

## 7. Result Fail visual polish結果

暗すぎない夜の余韻、Retry導線、改善hintの紙片を配置した。

## 8. StageSelect visual polish結果

夜の地図、黒インクroute line、active node lantern glow、locked node、Start CTAの出発印を追加した。

## 9. Stage return visual polish結果

previous resultをただの文字ではなく地図上のstamp / paper stripとして表示した。

## 10. 紙UI / 黒インク / ランタン光 / 地図感 / 報酬感の反映結果

紙UIはcard / ledger / map panel、黒インクはborder / route / stamp、ランタン光はselected / active / reward、地図感はroute line、報酬感はreward cardsで反映した。

## 11. Mobile / performance budget結果

360x800 / 390x844 / 430x932でスクリーンショットを作成。追加は静的UI proof中心で、particle / object budgetは大きく増やしていない。TimeScale final=1。

## 12. screenshot結果

`docs/design-targets/generated/unity-u23/screenshots/` に出力。Editor batchmode screenshotであり実機ではない。

## 13. 360x800 / 390x844 / 430x932確認

LevelUp、Result Clear、StageSelectを360x800 / 390x844 / 430x932で確認。実機確認はnot executed。

## 14. Before / After U22 vs U23結果

Beforeは単色proof UI寄り。Afterは紙片、ledger、route、sealを持つUI proof。contact sheetはreview用。

## 15. 採用候補 / 再修正候補 / 保留候補 / 却下候補

採用候補: paper card、rank seal、route line、previous result stamp。再修正候補: paper edge texture、locked node明度、stats小型端末輝度。保留候補: 9-slice prefab、Sprite Atlas、motion。却下候補: final画像貼り付け、ガチャ金ピカ、third-party UI kit。

## 16. Route A採用方針 / Route B animation候補方針

Route Aは軽量UI proofとして採用候補。Route B animationはU24以降のmotion / SE / hapticと一緒に検討する。

## 17. U5〜U23素材がcandidateのままか

candidate / proofのまま。production approvedへ昇格していない。

## 18. productionApproved=0か

productionApproved=0。

## 19. Resources系がproof-onlyか

Resources系はproof-only維持。U23 production Resourcesは追加していない。

## 20. text-baked imageがないか

runtime text-baked imageは追加していない。

## 21. 正式Result/StageSelect実装をしていないこと

正式Result / StageSelect実装はしていない。

## 22. Battle本番実装をしていないこと

Battle本番実装はしていない。

## 23. 報酬/セーブ/Stage解放ロジックを作っていないこと

報酬永続化、save、Stage解放ロジックは作っていない。

## 24. 黒耀化はprototypeであり本番完成ではないこと

黒耀化はprototypeであり本番完成ではない。U24でclimax polishへ送る。

## 25. Addressablesを導入していないこと

Addressablesは導入していない。

## 26. ZenMaruGothic SDFの状態

ZenMaruGothic SDF assetを使用し、存在確認対象。

## 27. U23 Verification結果

U23 Verificationで確認する。

## 28. U22 Battle Visual Polish Verification結果

継続確認対象。

## 29. U21.1 Design Gap Verification結果

継続確認対象。

## 30. U21 Stage1 Vertical Slice Verification結果

継続確認対象。

## 31. U20 Mobile Feel Verification結果

継続確認対象。

## 32. U19 Game Feel Verification結果

継続確認対象。

## 33. U18 Kokuyou Runtime Verification結果

継続確認対象。

## 34. U17 Stage1 Loop Verification結果

継続確認対象。

## 35. U16 Battle Result Hook Verification結果

継続確認対象。

## 36. U15 Contract Verification結果

継続確認対象。

## 37. U14 Flow Proof Verification結果

継続確認対象。

## 38. U7.1 TimeScale / AssetProvider verification結果

継続確認対象。

## 39. U4/U5 verification結果

継続確認対象。

## 40. term lock / asset intake / meta / design review結果

継続確認対象。

## 41. Console compile/runtime error有無

batchmode compile確認対象。Console errorなしを目標とする。

## 42. 実機確認はまだnot executedか

not executed。

## 43. 残る未解決懸念

Stage1本番Battle、本番balance、実機確認、save / reward / unlock、SEファイル実装、haptic実機確認、Sprite Atlas / performance最適化、production approvalは未完了。

## 44. 次にやること

U24で黒耀化 / Rare / Evolution Climax Polish Passへ進む。
