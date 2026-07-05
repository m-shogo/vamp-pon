# Unity U43 Mobile Touch Movement Repair

## 症状

実機で移動できない。

## 原因

`PlayerController` の通常入力がKeyboard専用だった。Editor keyboard verificationでは動くが、iOS touchがPlayerへ届かない。

## 修正内容

- `DevicePointerMoveInputSource` を追加。
- 左下寄りのtouch / mouse dragをvirtual stickとして扱う。
- deadzoneとstick radiusを入れ、既存の加減速 smoothingを維持。
- `CompositeMoveInputSource` でtouch / mouse dragを優先し、keyboard互換も維持。

## 未確認

iOS実機touch movementは未再確認。`mobileTouchMovementReady=true`はruntime実装上のhook readinessであり、devicePlayableReadyは実機再確認までfalse。
