# Unity U45.1 iOS Simulator Animation Smoke

## Environment

- device: iPhone 17 Pro
- runtime: iOS 26.5 (23F77)
- architecture: arm64
- bundle identifier: `com.mshogo.vamppon.u1`
- Unity Simulator build: Succeeded、errors 0、warnings 4
- Xcode Release build: Succeeded、errors 0、warnings 20
- install / launch: passed

`VAMPPON_AI_SIMULATOR_SMOKE`はbuild-local defineで、通常device/production buildには含めない。撮影専用の敵分離、一時停止、一時VFX除去も同define内だけで有効になる。

## Automated result

13枚の必須状態を撮影し、次を確認した。

1. StageSelect pause
2. Yui idle
3. Yui walk right
4. Yui walk left
5. Yui hurt
6. Yui attack
7. Onbu move
8. Onbu hurt
9. Onbu death
10. LevelUp animation pause
11. Result animation pause
12. Retry animation reset
13. StageSelect return

追加確認:

- production provider active
- proof provider unused
- RuntimeVisuals source active
- procedural character/enemy fallback unused
- release後にidleへ戻り、最後の向きを保持
- Onbu death後pool return、respawn reset
- StageSelect / LevelUp / Resultでbattleまたはanimationが進まない
- duplicate EventSystem / AudioListenerなし
- unhandled exception 0、crash/freezeなし

## Visual review

P0/P1は0。右入力と左入力の実画向き、ランタン継続、hurt/attack差、Onbuのmove/hurt/death差をgameplay sizeで確認した。

既存Stage1の暗い背景/HUD、Result placeholder、候補素材の最終承認不足はP2または後続gateとして残す。U45.1のcharacter/enemy runtime state証跡を妨げないが、製品美術完成とは扱わない。

## Device boundary

Simulatorは実機touch品質、実音量/遅延、haptic、thermal/performance、safe area実機差、最終美術品質を承認できない。したがって`devicePlayableReady`、`mobileMetricsReady`、`audioMixerReady`、`audioLatencyMeasured`、`hapticMeasured`、`rcReady`、`productionApproved`はfalseを維持する。
