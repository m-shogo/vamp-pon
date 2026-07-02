# Unity U21.1 Design Gap Analysis / Visual Polish Gate Plan

## 1. Scope

U21.1は本番デザイン完成ではなく、U21 Stage1 Vertical Sliceを対象にしたDesign Gap Analysis / Visual Polish Gateである。目的は、安っぽく見える箇所、世界観から浮く箇所、スマホで読みにくい箇所を洗い出し、U22 / U23 / U24へ優先順位付きで渡すこと。

## 2. Review source

`docs/design-targets/generated/unity-u21/screenshots/` のU21 screenshots / contact sheetをレビューする。実機確認ではなくEditor batchmode screenshotである。

## 3. Screen evaluation target

StageSelect / Stage1 / LevelUp / Rare / Evolution / 黒耀化 / Resultを画面別に評価する。EXP / Drop / 回復drop、Clear / Fail、Stage return、contact sheetも含める。

## 4. Gap focus

Web版 / 生成proofより弱い箇所は、説明UIっぽさ、紙UI素材感の薄さ、ランタン光の使いどころ、黒インクの不在、カードやResultの報酬感不足として明記する。

## 5. Cheapness breakdown

安っぽく見える原因を、文字、余白、色、光、紙UI、黒インク、ランタン光、演出強弱に分解する。

## 6. Polish scope

U21.1で許可するのは必要最小限のpolishだけ。TMP文言短縮、proof label整理、font size +1、contrast chip強化、LevelUp card spacing、Result alpha、StageSelect locked node明度差、黒耀化overlay alpha、contact sheet改善に留める。

## 7. Production boundary

productionApproved=0を維持する。正式Result/StageSelect、Battle本番実装、save、reward反映、Stage解放、Addressables、本番黒耀化runtimeは作らない。

## 8. Carryover

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
- デザインはまだpro完成ではない。
- U21.1は本番デザイン完成回ではない。

## 9. Next phase handoff

U22: Stage1 Battle / HUD / Playing Visual Polish Pass。
U23: LevelUp / Result / StageSelect Visual Polish Pass。
U24: 黒耀化 / Rare / Evolution Climax Polish Pass。
