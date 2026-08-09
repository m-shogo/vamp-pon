# ヨルノシルベ Motion / Screen Transition Specification v1

Date: 2026-07-28
Status: **PROPOSED / DOCUMENTATION-ONLY**
Repository: `m-shogo/vamp-pon`
Art direction: `QUIET_NIGHT_SMALL_WARMTH`

## 1. 目的

画面ごとの場当たりanimationを防ぎ、紙、インク、ランタン、夜、朝の意味に沿ったmotion familyを定義する。

## 2. Motion principles

- 操作feedbackは短く、物語演出は必要な時だけ長くする。
- Bounceやovershootを常用しない。
- Scaleだけで演出を作らない。
- Light、edge、opacity、mask、positionを意味に応じて組み合わせる。
- Motionがなくてもstateと操作結果を理解できる。

## 3. Duration tokens

| Token | Duration | 用途 |
| --- | ---: | --- |
| `motion.tap` | 0.08〜0.12s | press/release |
| `motion.select` | 0.16〜0.24s | selection |
| `motion.smallEnter` | 0.20〜0.32s | chip/small panel |
| `motion.modalEnter` | 0.28〜0.42s | modal/pause/level-up |
| `motion.screen` | 0.40〜0.65s | normal screen transition |
| `motion.rare` | 0.45〜0.80s | rare/restored reveal |
| `motion.climax` | 0.80〜1.60s | evolution/awakening |

## 4. Easing families

| Family | Intent |
| --- | --- |
| `ui.fastOutSettle` | 操作直後に反応し、静かに止まる |
| `paper.arrive` | 少し遅れて収まり、bounceしない |
| `lantern.breathe` | 低振幅、ゆっくり、連続感 |
| `ink.spread` | 不規則、侵食、直線補間に見せない |
| `dawn.open` | 暗部が少しずつほどける |

## 5. Screen transition families

### T1 Night Fade

用途:

- TOP → StageSelect
- Collection → TOP
- 通常navigation

表現:

```txt
current screen darkens 0.18〜0.28s
small lantern/core remains briefly
next night layer appears
paper/content enters 0.20〜0.32s
```

禁止:

- 完全black frameを長く置く
- white flash
- large zoom

### T2 Paper Turn

用途:

- Collection category/detail
- Result detail
- Settings等のpaper中心画面

表現:

- page edgeまたはmaskで短く切り替える。
- 写実的な3D page curlは使わない。
- Content reading orderを変えない。

### T3 Lantern Focus

用途:

- Stage selection
- Primary selection
- New discovery

表現:

- current lanternがL1→L2。
- 周囲を暗くするのではなく、対象edgeを少し持ち上げる。
- 同時に複数対象へ適用しない。

### T4 Ink Seal / Unseal

用途:

- Locked表示
- Evolution unlock
- 黒耀化への移行

表現:

- Locked: sealが閉じた状態で静止。
- Unlock: sealの一部が切れ、paper/lightが現れる。
- 黒耀化: lightをinkが侵食する。

### T5 Battle Modal

用途:

- Pause
- LevelUp
- Replacement

表現:

```txt
battle input lock
background dim 0.12〜0.20s
modal paper enter 0.20〜0.32s
first focus available after visual state stable
```

Battlefieldが完全に消えない。

### T6 Result Rest

用途:

- Battle → Result

表現:

- gameplay activityを止める。
- particleを減衰。
- dark nightを残したままpaper ledgerが現れる。
- rank/reward/new recordを順番にone-shot表示。
- すべての行をstaggerしすぎない。

### T7 Dawn Release

用途:

- Completion
- Memory restored
- 最終的な朝演出

表現:

- Nightを捨てず、dark edgeを残しながらdawn peachを入れる。
- 全画面white化しない。
- Lanternの役目が朝へ引き継がれる。

## 6. Component motion

| Component | Normal motion | Special motion |
| --- | --- | --- |
| Button | tap scale/edge | primary L1 |
| Card | select settle | rare/evolution reveal |
| Stage node | current breathe | unlock seal break |
| HUD slot | short state response | evolution-ready one-shot |
| Result reward | short enter | new record restored light |
| Collection entry | none | first-new one-shot |
| Ink seal | none | unlock/侵食 |
| Lantern marker | L0/L1 | L2〜L4 |

## 7. Reduced motion mapping

| Standard | Reduced motion |
| --- | --- |
| slide 24〜64px | slide 0〜12px |
| scale 0.92→1 | scale省略または0.98→1 |
| lantern pulse | static halo |
| ink spread | final shape fade |
| page turn | opacity + edge change |
| screen zoom | crossfade |
| shake | static danger edge |
| flash | 無効 |

操作可能になるtimingは通常modeと大きく変えない。

## 8. Input ownership

- Transition中に二重tapで複数navigationを発生させない。
- Modal enter完了前の選択を安全に無視またはqueueする。
- Battle modalでは既存pause/input ownerを維持する。
- Animation eventをgameplay logicの唯一の正本にしない。
- Transition失敗時もsafe fallbackで画面を表示できる。

## 9. Performance

- 常時Animatorを大量に動かさない。
- offscreen scroll itemのanimation停止。
- particle、mask、glowの同時使用を制限。
- realtime blurをtransitionに使用しない。
- reduced/performance fallbackを同じstate contractで扱う。

## 10. QA

各transitionで確認する。

```txt
input double-fire=0
navigation ownership conflict=0
focus loss=0
safe area movement=0
clipped content=0
motion-only meaning=0
reduced-motion parity=true
background audio/haptic lifecycle preserved=true
```

## 11. 現在判定

```txt
MotionTokensDefined=true
EasingFamiliesDefined=true
ScreenTransitionFamiliesDefined=7
ReducedMotionMappingDefined=true
UnityImplementationStarted=false
NextAction=DOCUMENTATION_READINESS_CONTROL_CENTER
```
