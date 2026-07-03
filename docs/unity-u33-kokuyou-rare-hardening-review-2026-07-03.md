# Unity U33 Kokuyou / Rare Hardening Review

## Kokuyou

- KokuyouReadySeconds: `360` から `330`。
- active duration 12s、cooldown 45sは維持。
- Readyまで遠すぎないようにしつつ、連発できすぎない状態を維持する。

## Rare

- RareDropDraftChance: `0.035` から `0.04`。
- 通常報酬との差を残しつつ、Stage1で薄すぎないようにする。

## Presentation boundary

通常画面は静か、Rare / Evolution / Kokuyouだけ派手にする。generated final画像はruntimeへ貼らない。docs/design-targets/generated runtime参照なし。haptic device behaviorはNOT_MEASURED。

## U35確認

Kokuyou ready率、activation効果の体感、endingの分かりやすさ、Rare出現率、Rare SE / hapticの実機挙動。
