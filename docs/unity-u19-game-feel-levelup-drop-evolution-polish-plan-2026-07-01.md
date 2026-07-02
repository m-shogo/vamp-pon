# Unity U19 Game Feel / LevelUp / Drop / Evolution Polish Proof Plan

作成日: 2026-07-01

1. U19は本番完成ではなくGame Feel Proofである。
2. EXP吸引は近いほど強く、取得時に小さくpopし、黒耀化中は少し強くする。
3. Drop / 回復dropはEXPと区別し、回復dropは自動吸引せずプレイヤーが取りに行く。
4. LevelUp演出は紙UI / 黒インク / ランタン光で、3枚カードを読みやすく出す。
5. Rare演出は通常LevelUpより嬉しく、短いslowと暖色flareに留める。
6. Evolution / 合体proofは `黒インク小瓶 Lv5 + 街灯の輪 Lv5 = 夜明けのインク灯` を表示する。
7. 黒耀化中はEXP吸引、hit flash、ink burstの気持ちよさを少し強くする。
8. Hit stop / camera impulse / flash / particleは控えめにし、TimeScaleService経由で扱う。
9. SE / haptic hookはlogだけ作り、将来差し込める名前を固定する。
10. U17 Stage1 Loopへは表示用Game Feel stateとして接続し、Resultへはlabelのみ渡す。
11. save / reward / unlockをまだ確定処理しない。
12. productionApproved=0を維持する。
13. U20以降へ、実機QA、Mobile Feel、本番balance、正式SE/haptic、drop table、evolution DBを残す。

## U18までの残懸念引き継ぎ

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
