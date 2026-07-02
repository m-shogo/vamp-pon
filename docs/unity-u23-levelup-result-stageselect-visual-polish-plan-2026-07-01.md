# Unity U23 LevelUp / Result / StageSelect Visual Polish Plan

## Scope

U23は本番UI完成ではなくVisual Polish Proofである。対象はLevelUp、Result Clear、Result Fail、StageSelect、Stage return。U22まででBattle画面はゲーム画面らしくなったが、繰り返し見るUIはgenerated visual targetとUnity proof screenshotの質感差がまだ大きい。

## 方針

- generated visual targetとUnity proof screenshotの差を比較する。
- final画像をそのままruntimeへ貼らない。
- 紙UI、黒インク、ランタン光、地図感、報酬感をUnity UI部品へ分解する。
- UI文字はTextMeshProで載せる。
- productionApproved=0を維持する。
- save / reward / unlockは接続しない。
- 黒耀化 / Rare / EvolutionはU24へ渡す。

## U23で取り込む要素

- LevelUp: 紙片カード、黒インク縁、icon slot、selected glow、短いtitle / effect / level階層。
- Result: 記録帳ledger、Rank seal、reward card、Clearの朝焼け、Failの再挑戦導線。
- StageSelect: 夜の地図、黒インクroute line、active nodeのランタン光、locked nodeの暗い読める状態、previous result stamp。

## U22までの残懸念引き継ぎ

U22はBattle Visual Polish Proofであり、本番Battle完成ではない。デザインpro化はU22からU24で段階的に行う。Stage1本番完成ではない。実機確認できなかった項目はnot executed。iOS / Android Build Support missing。EXP curve / LevelUp抽選 / drop table / evolution recipeは本番未確定。黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。黒耀化の本番balanceは未確定。SE / haptic / camera shakeはhook設計またはproof段階。Cinemachine / Input System / Sprite Atlas の導入判断は必要に応じて継続。Result stats行は実機輝度と小型端末で継続確認。StageSelect locked nodeの明度差と選択誘導は継続確認。RewardSummaryは表示用であり、永続反映していない。UnlockCandidateは候補であり、Stage解放を確定しない。本番save / reward / unlockは未接続。generated直下のvisual targetとUnity proof screenshotにはまだ大きな差がある。U23 / U24ではvisual targetとの差分を明記して寄せる。

## 禁止

- final画像をそのままruntimeへ貼らない。
- UI文字を画像に焼き込まない。
- reward永続反映、save接続、Stage解放確定をしない。
- StageSelect本番map完成扱いにしない。
- 本番LevelUp抽選、本番報酬balanceを確定しない。
- productionApprovedを上げない。
