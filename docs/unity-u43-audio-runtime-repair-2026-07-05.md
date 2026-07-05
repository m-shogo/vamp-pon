# Unity U43 Audio Runtime Repair

## 症状

実機で音が鳴らない。

## 原因

U28 / U39のAudioRouterはevent readinessやclip存在確認を持つが、Stage1 runtimeでAudioSource再生に接続されていなかった。SceneにもAudioListener保証がなかった。

## 修正内容

- MainCameraにAudioListenerを追加。
- `U43RuntimeFeedbackBridge` を追加し、AudioSourceでbutton tap、pickup、hit、level up、rare、evolution、Kokuyou、result、retry、stage selectのhookを鳴らす。
- U39 final-candidate SE rootを参照情報として保持するが、AudioMixer final扱いにはしない。

## 維持する未確定

`audioMixerReady=false`、`audioLatencyMeasured=false`、device speaker clipping未測定。実機で音が鳴るかは再確認が必要。
