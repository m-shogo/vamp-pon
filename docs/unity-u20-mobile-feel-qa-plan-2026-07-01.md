# Unity U20 Mobile Feel QA Plan

作成日: 2026-07-01

1. U20は本番完成ではなくMobile Feel / QA Passである。
2. 実機確認できる環境か、Unity module、端末検出、CLIを確認する。
3. iOS / Android Build Support module有無を記録する。
4. Safe Area QAは360x800 / 390x844 / 430x932を中心に、重要UIが端へ寄りすぎないかを見る。
5. Touch target QAはprimary button、LevelUp card、StageSelect node、黒耀化proof inputが44px相当以上かを見る。
6. Text readability QAは360x800でタイトル、stats、カード説明、日本語glyphを確認する。
7. LevelUp / Rare / Evolution QAはカードサイズ、読みやすさ、派手すぎなさを確認する。
8. EXP / Drop / 回復drop QAは見つけやすさ、trailのうるささ、回復dropが自動吸引されないことを見る。
9. 黒耀化 overlay / cut-in / gauge QAは暗さ、文字干渉、ready視認性、緑/黄色粒の人間レビュー継続を確認する。
10. StageSelect / Result QAはlocked nodeの明度差、Result stats contrast、next button位置を見る。
11. Performance / Particle / GC / TimeScale QAはparticle cap、object count、TimeScale final=1、明らかなUpdate allocation危険がないことを見る。
12. U20では必要最小限の修正だけ入れる。
13. save / reward / unlockをまだ確定処理しない。
14. productionApproved=0を維持する。
15. U21以降へ、実測寄りBattle stats、実機build、実機FPS/touch/safe area確認を残す。

## Carryover

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
