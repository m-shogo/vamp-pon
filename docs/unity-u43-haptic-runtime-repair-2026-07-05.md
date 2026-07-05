# Unity U43 Haptic Runtime Repair

## 症状

実機で振動がない。

## 原因

U28 hapticはproof router / placeholder adapter中心で、Stage1 actual runtime eventからdevice haptic APIへ接続されていなかった。

## 修正内容

- `U43RuntimeFeedbackBridge` にhaptic runtime hookを追加。
- iOS / Android buildでは重要eventで `Handheld.Vibrate()` を呼ぶ。
- button、level up、rare、evolution、Kokuyou、result、retry、stage selectでhaptic requestを出す。

## 維持する未確定

実機挙動は未確認のため `hapticMeasured=false`。実装hookは `hapticRuntimeHookReady=true` とするが、device haptic readyとは扱わない。
