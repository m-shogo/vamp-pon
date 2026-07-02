# Unity U22 Stage1 Battle / HUD / Playing Visual Polish Plan

## Scope

U22は本番Battle完成ではなく、Battle Visual Polish Proofである。U21.1でBattle / Stage1はSeverity Sとなり、最大問題はStage1 playingが仕様説明リストに見えることだった。

U22では、Stage1 playingをプレイヤー、敵、攻撃、EXP、Drop、hit feedback、黒耀化gaugeを持つゲーム画面として組む。save / reward / unlockは確定処理しない。productionApproved=0を維持する。

## 方針

- Battle HUD / player / enemy / attack / EXP / Drop / hit feedbackを画面として配置する。
- proof labelを減らし、状態はHUD、icon、gauge、effectで伝える。
- 文字ではなく絵と動きで伝える。
- 390x844を中心に、360x800と430x932のmobile readabilityを維持する。
- performance / particle budgetを守り、TimeScale final=1を維持する。
- 必要なUnity公式packageは検討するが、導入は厳格に判断する。
- U22では新規packageを導入しない方針を優先する。
- U22で作るものはBattle Visual Polish Proofであり、本番Battle logicではない。

## 画面構成

- 背景: 暗い紙、路地、地図のニュアンス。
- プレイヤー: 中央からやや下。ランタン光で主役にする。
- 敵: 外周から近づくように3体以上。
- 攻撃: 1から3種類の簡易visualを配置し、命中点が分かるようにする。
- EXP fragment: 3個以上。吸引される軌道を示す。
- Heart / 回復drop: 1個。自動吸引されない差を出す。
- Memory shard: 1個。EXPと区別する。
- 黒インクburst: 敵撃破位置に置く。
- Lantern pulse: プレイヤー周辺に置く。
- HUD: Time / HP / Lv / EXP / Fragments / Memories / Kokuyou gauge。
- Debug proof label: 小さく下部または隅にまとめる。

## U21.1からの引き継ぎ

- U21.1はDesign Gap Analysis / Visual Polish Gateであり、本番デザイン完成ではない。
- デザインpro化はU22からU24で段階的に行う。
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
- Battle / Stage1がSeverity S。
- Stage1 playingは仕様説明リストに見える。
- U22でBattle / HUD / playing visualを最優先にpro化する。

## 禁止・保留

- Stage1本番完成、本番10分wave、enemy / weapon balance確定はしない。
- 本番EXP curve、LevelUp抽選、drop table、evolution recipe DBを確定しない。
- 本番save、reward反映、Stage解放、永続強化は接続しない。
- Addressablesを導入しない。
- third-party packageを導入しない。
- Web/Phaser assetを本番runtimeへ直接移植しない。
- text-baked runtime imageを追加しない。
- productionApproved=0を維持する。

## U23 / U24へ残すこと

- U23: LevelUp / Result / StageSelect Visual Polish Pass。
- U24: 黒耀化 / Rare / Evolution Climax Polish Pass。
- U20.1: Real Device Build Pass、実機FPS / touch / safe area確認。
