# ヨルノシルベ Unity Responsive Screen Policy

<!-- CURRENT_STATE_BEGIN -->
```json
{
  "schemaVersion": 1,
  "currentPhase": "U49 actual-device audio/haptic",
  "nextPhase": "U50 performance/touch metrics",
  "thenPhase": "U51 RC",
  "runtimeVisualReady": true,
  "physicalDeviceReady": false,
  "devicePlayableReady": false,
  "audioMixerImplemented": true,
  "audioMixerDeviceVerified": false,
  "audioReady": false,
  "audioLatencyMeasured": false,
  "hapticReady": false,
  "hapticMeasured": false,
  "u50ThresholdsDefined": false,
  "mobileMetricsReady": false,
  "rcReady": false,
  "productionApproved": false
}
```
<!-- CURRENT_STATE_END -->

Last synchronized: 2026-07-25  
Status: current iOS responsive source

## 目的

390x844を固定表示サイズと誤解せず、iOS portrait deviceの実screen、aspect ratio、Safe Area、notch、Dynamic Island、home indicatorへ適応する方針を固定します。

現在のproduction scopeはiOS-onlyです。Android固有のnavigation bar、device matrix、store requirementはこの文書へ混在させません。360x800や412x915等はAndroid対応宣言ではなく、layout破綻を早期検出するsynthetic responsive profileとして使用します。

## Current boundary

```txt
Reference viewport: 390x844 portrait
Runtime UI: uGUI
Responsive tiers: Compact / Standard / Large
Platform scope: iOS first / current iOS-only product scope
Current Phase: U49 actual-device audio/haptic
Next Phase: U50 performance/touch metrics
```

## Core rule

```txt
390x844 = design reference and comparison baseline
actual device = current screen/aspect/Safe Areaに合わせて可変
```

390x844は固定render targetでも、唯一の合格画面でもありません。

## Responsive tiers

```txt
Compact: 360x800 / 375x812
Standard: 390x844 / 393x852
Large: 412x915 / 430x932
```

各tierの目的:

- Compact: narrow width、短いheight、tight Safe Areaでのoverflow検出
- Standard: design comparisonと主要screenshot baseline
- Large: tall/wide portraitでの間延び、bottom reach、world framing検出

全screenで最低限確認:

- TOP
- StageSelect
- Battle HUD
- LevelUp
- Replacement
- Pause/dialog
- Result
- 灯録
- Settings/audio controls

## Canvas policy

```txt
Canvas Scaler: Scale With Screen Size
Reference Resolution: 390 x 844
Screen Match Mode: Match Width Or Height
Match: initial 0.5; measured screen evidenceで調整
```

`Reference Resolution`はlayout座標系の基準です。実deviceを390x844へcrop/letterboxする意味ではありません。

## Safe Area policy

Safe Area内に置くcritical UI:

- title/navigation
- HP/time/level
- pause
- primary CTA
- LevelUp/Replacement choices
- Result actions
- Settings controls
- Ultimate / 黒耀化 control

Safe Area外へ延長可能:

- background
- non-interactive vignette
- decorative ink/paper/light
- world rendering

禁止:

- notch/Dynamic Island/home indicatorへcritical text/controlが重なる
- Safe Area補正をscreenごとに別実装
- insetをmagic numberで重複保持
- decorative full-screen overlayがinput raycastを奪う

## World camera policy

```txt
Projection: Orthographic
Orientation: Portrait
World view: aspect-aware
```

Rules:

- playerのreadable areaを維持
- top/bottom aspect差でspawn visibilityを壊さない
- backgroundは黒帯を作らず自然にcover
- narrow profileでworldを過度にzoomしない
- large profileでbattle entityを小さくしすぎない
- camera framing変更はspawn/attack/gameplay constantを暗黙変更しない

## UI layout policy

- anchors/pivotsを意図的に設定
- fixed pixel位置だけに依存しない
- horizontal/vertical layoutはcontent sizeとoverflowを検証
- card width、gap、padding、font sizeをresponsive profileで調整
- icon ratio、tap target、information hierarchyは維持
- completed screen imageへtext/controlを焼き込まない
- Base -> Variantは最大2階層
- Theme / Visual State / Responsive Layout Profileを使用

## Tap and reach policy

U49/U50 actual-device reviewで確認:

- primary CTA
- StageSelect difficulty/start
- virtual stick
- pause
- LevelUp/Replacement card
- Ultimate/黒耀化
- Result retry/stage/top
- Settings volume/mute/haptic

合格条件:

- Compactでもtap targetが潰れない
- Largeでも重要controlが遠すぎない
- screen edge/controlがhome indicatorと競合しない
- simultaneous movement + actionでinput lossがない
- modal close後にinvisible raycast blockerが残らない
- background/foreground後にstuck touchがない

## Text and localization resilience

- critical textは各tierでtruncate/overflowしない
- small labelsを画像へ焼き込まない
- Japanese textのline breakを確認
- decorative Englishは差替可能
- dynamic valueの桁増加を確認
- font fallback/missing glyphを検出
- accessibility text scalingを将来阻害しない構造にする

## Screen-specific minimums

### TOP / StageSelect

- titleとprimary CTAがSafe Area内
- map/card/descriptionがCompactでoverflowしない
- difficulty stateが文字だけに依存しない

### Battle HUD

- player/enemy/EXPをUIが隠さない
- HP/time/level/pause/Ultimateが各tierで読める
- bottom controlがhome indicatorへ重ならない
- large profileでHUDとworldの間延びを抑える

### LevelUp / Replacement

- card内容とbutton/tap areaがCompactで成立
- scrollが必要なら意図的に設計
- close/decline/replace actionがSafe Area内
- overlay中にbattleが進まない

### Result / 灯録

- reward/action hierarchyが各tierで維持
- bottom actionがSafe Area内
- long list/tab/contentのoverflowを検出
- empty/error stateも同じresponsive policyを使う

## Evidence contract

screen evidenceは最低限次を持ちます。

```txt
screen/route name
responsive tier and exact resolution
Safe Area inset or profile
source commit/build
capture timestamp
runtime assertion result
P0/P1/P2 findings
human review result
```

同じscreenshotをresizeして複数tier evidenceに使いません。各profileを実際にrender/captureします。

## Readiness boundary

Responsive screenshot PASSだけでは次を昇格しません。

```txt
devicePlayableReady
audioMixerReady
audioLatencyMeasured
hapticMeasured
mobileMetricsReady
rcReady
productionApproved
```

- Simulatorはroute/layout/crash確認
- actual deviceはtouch/audio/haptic/Safe Area feel
- U50はperformance/touch metrics
- U51はRC/product review

それぞれ別evidenceとcheckerを必要とします。

## Wording rule

Use:

```txt
390x844 reference
390x844 comparison baseline
Compact / Standard / Large
actual-device Safe Area review
responsive portrait layout
```

Avoid:

```txt
390x844固定
390x844だけで確認
1枚のscreenshotをresizeして全tier PASS
Simulatorで実機touch PASS
```

## Required checks

```sh
pnpm implementation:preflight:check
pnpm unity:ui-design-system:check
pnpm unity:runtime-visual-readiness:check
pnpm implementation:preflight:full
```

GitHub connectorだけで変更した場合、Unity Game View、Simulator、actual-device captureを実行済みと報告しません。

## Final rule

**390x844は設計のものさしであり、製品screenの固定枠ではありません。** 各tierとactual-device Safe Areaで、読める・押せる・worldが自然に見える状態を維持します。
