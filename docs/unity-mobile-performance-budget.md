# ヨルノシルベ Unity Mobile Performance Budget

Last synchronized: 2026-07-25  
Status: current U50 performance source

ヨルノシルベをiOS portrait mobile gameとして、見た目・操作感・継続実行の品質を維持するための性能予算です。

この文書はU50 Device Performance / Touch Metricsの正本です。EditorやSimulatorだけで`mobileMetricsReady=true`へ昇格してはいけません。actual device、build identity、測定条件、raw/summary evidence、checkerを揃えます。

## Current boundary

```txt
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Next: U50 device performance/touch metrics
Then: U51 RC

runtimeVisualReady=true
devicePlayableReady=false
mobileMetricsReady=false
rcReady=false
productionApproved=false
```

U49のactual-device audio/haptic成功はU50完了を意味しません。U50の性能測定成功もU51 RCやproduction approvalを自動昇格しません。

## Scope

```txt
Platform: iOS first / iOS-only current product scope
Orientation: portrait
Runtime UI: uGUI
Render Pipeline: 2D URP
Responsive tiers: Compact / Standard / Large
Primary goal: stable 60fps where device capability allows
Hard experience floor: avoid sustained sub-30fps behavior
Priority: frame pacing and input consistency over peak visual density
```

Android固有のtarget API、device class、quality fallbackは現在のproduction scopeへ含めません。将来Android対応を正式決定した場合は、別の測定matrixとbudgetを追加します。

## Performance principles

Premium qualityは高価なeffect数ではなく、**入力に正確、frame pacingが安定、読みやすく、再現可能に測定できること**で判断します。

Prefer:

- pooled enemies/projectiles/pickups/FX
- short and purposeful feedback
- event-driven UI updates
- cached references and preallocated collections
- controlled 2D lights
- sprite glow where real light is unnecessary
- capped particle emission
- separated canvases by update frequency
- deterministic stress scenarios

Avoid:

- combat hot pathでのper-frame allocation
- repeated `Instantiate` / `Destroy`
- repeated `GetComponent`, scene search, `Camera.main`
- full-screen transparent layersの多重overdraw
- every particle / pickupへのreal Light2D
- layout rebuildを毎frame発生させるUI
- unbounded enemies、projectiles、EXP、damage text、audio one-shot
- average FPSだけでPASSする測定

## Frame-time budget

60fpsの1frameは約16.67ms、30fpsは約33.33msです。target値は測定時のdevice/build/quality settingと一緒に記録します。

Initial budget guide:

```txt
Game logic:       2-4ms
Rendering:        5-8ms
UI:               1-3ms
Particles/FX:     1-3ms
Audio/Input/etc:  around 1ms
Headroom:         2-4ms
```

これは各subsystemを独立に足し切れば必ず16.67msになるという保証ではありません。Profiler markerとactual frame-time distributionでbottleneckを特定するための設計予算です。

## U50 measurement matrix

各runで必ず記録:

```txt
device model
iOS version
build version / build number
commit SHA
build channel / configuration
quality setting
screen tier / resolution
run scenario
run duration
cold or warm start
capture tool / Profiler connection
measurement start/end timestamp
foreground/background transitions
known environmental constraints
```

最低scenario:

1. cold launch -> TOP -> StageSelect
2. Stage1 initial minute
3. normal sustained battle
4. enemy peak
5. simultaneous enemy death / EXP burst
6. EXP vacuum
7. LevelUp open/close
8. full inventory / Replacement
9. rare/evolution feedback
10. 黒耀化 charge/ready/active/recovery
11. Result -> Retry
12. background -> foreground recovery
13. sustained run long enough to observe memory and thermal trend

Idle sceneや短い30秒だけでU50を完了しません。

## Required metrics

### Frame pacing

- displayed FPS
- CPU frame time
- GPU frame time where available
- median frame time
- p95 frame time
- p99 frame time
- frames over 16.67ms
- frames over 33.33ms
- longest frame and scenario marker
- repeated hitch clusters

合格判断:

- target deviceで60fpsを基本目標とする
- sustained sub-30fpsを許容しない
- p95/p99とlong frameの原因を説明できる
- LevelUp、Result、黒耀化、EXP burstで反復するhitchがない
- average FPSが高くてもstutter clusterがある場合はHOLD

### Memory

- startup memory
- Stage1開始時
- sustained battle中
- peak scenario後
- Result後
- Retry後
- background/foreground後
- end-of-run memory
- texture/audio/managed/nativeの主要内訳

合格判断:

- repeated run/retryで無制限増加しない
- pooled objectがrelease/reset契約を守る
- duplicate production/prototype textureがruntimeへ混入しない
- screenshot/evidence assetをruntime buildへ誤収録しない

### GC and allocations

- GC allocation per frame in normal battle
- allocation spikes by scenario
- GC collection count/duration
- string/HUD/layout allocation
- pool expansion events

合格判断:

- combat Updateで継続的なallocationを作らない
- known one-off allocationはscenarioと理由を記録
- GC spikeがinput lossやvisible hitchを起こさない
- pool capacity不足を黙って`Instantiate`連打で補わない

### Rendering

- batches / draw calls
- set-pass calls where available
- overdraw-heavy screens
- active SpriteRenderers
- active particle systems
- active 2D lights
- canvas rebuild count/cost
- texture memory and atlas use

合格判断:

- effect追加による増分をbefore/afterで説明できる
- player/enemy/readabilityを保つために背景/effectを先に削る
- UI rebuild spikeが毎frame続かない
- transparent overlayの重なりを制限する

### Touch and input

- touch-downからvisual responseまでの体感/測定
- virtual stick start/move/release
- edge controls
- simultaneous movement + button input
- pause/modal中のinput suppression
- LevelUp/Replacement selection
- background/foreground後のstuck/ghost input
- rapid tap/debounce behavior

合格判断:

- input release後にmovementが残らない
- invisible overlayがinputを奪わない
- tap targetがCompact/Standard/Largeで維持される
- feedback latencyが操作結果を誤認させない
- automation PASSだけでtouch feelをfinal判定しない

### Thermal and sustained behavior

- run duration
- device temperature/thermal observation available to tester
- frame-time degradation over time
- battery drain observation when practical
- brightness/network/background条件

合格判断:

- short burstだけ良く、継続runで急激に劣化しない
- thermal throttling疑いを未記録のままPASSしない
- deviceが熱くなる場合、scenario、時間、quality settingを記録

## Object-count budgets

初期production budget。U50 measured resultで更新します。

```txt
Enemies active:          30-60 baseline; peak must be scenario-defined
Projectiles active:      20-80
EXP fragments active:    30-120
Damage numbers active:   0-30
Particle systems active: 5-20
2D lights active:        1-6
UI canvases active:      minimal and update-frequency separated
Audio one-shots:         rate-limited by event family
```

数値を満たすだけではPASSしません。pool exhaustion、spawn burst、simultaneous death、EXP vacuumで実測します。

## Pooling contract

Pool:

- enemies
- projectiles
- pickups / EXP fragments
- hit / ink / memory effects
- floating text
- short card/rare decals when repeatedly spawned
- audio one-shot sources when needed

Do not pool blindly:

- static backgrounds
- ScriptableObject definitions
- long-lived screen roots unless lifecycle benefit is measured

必須:

- reset method clears runtime state
- listeners/subscriptions are removed or safely reused
- disabled object does not continue audio/animation/tick
- pool expansion is capped or observable
- exhaustion behavior is deterministic

## Allocation contract

Combat hot pathで避ける:

- LINQ
- new list/array per frame
- HUD string concatenation every frame
- `Instantiate` / `Destroy`
- scene-wide search
- repeated component lookup
- closure/delegate allocation in repeated path

Use:

- cached references
- preallocated buffers
- dirty flags
- event-driven updates
- object pools
- reusable formatted text buffers where useful

## 2D lighting and overdraw budget

Lantern lightはidentityですが、real lightは意味がある箇所に限定します。

Recommended:

```txt
Player lantern: real 2D light
Ultimate ready: sprite glow
NEW badge: sprite glow
EXP: sprite/trail glow
Result dawn: controlled gradient/sprite overlay
```

Avoid:

- every particleへのreal light
- every EXP fragmentへのLight2D
- many overlapping full-screen lights
- dynamic shadowの常時多用
- large transparent textureの多層stack

## Particle budget

Normal enemy death:

```txt
ink particles: 8-16
memory particles: 2-4
lifetime: 0.25-0.6s
```

Elite death:

```txt
ink particles: 18-32
memory particles: 5-8
lifetime: 0.4-0.8s
```

Rules:

- emissionをper-frame cap可能にする
- peak death時にeffectをmerge/skipできる
- long-lived full-screen alpha fogを避ける
- hundreds of particles per normal enemyを禁止
- effect reductionはplayer/enemy/HUDより先に行う

## Texture and build-size budget

Guidelines:

```txt
Icons: 32/48/64 px as appropriate
UI decals: 64/128 px
FX sprites: 64/128/256 px
Character/enemy: trimmed, approved production source
Backgrounds: avoid unnecessary huge unique textures
Cutin: limited layers, no baked product text
```

Rules:

- design target screenshotをruntime UI textureへ使わない
- duplicate prototype/production textureを監査
- transparent paddingとcell-edge contactを検査
- Sprite Atlas/import policyを維持
- 4K sourceを理由なくruntimeへ含めない
- generated evidence/contact sheetをplayer buildへ含めない

## UI performance budget

Canvas separation guideline:

```txt
Canvas_StaticBackground
Canvas_HUD
Canvas_Overlay
Canvas_Cutin
Canvas_Debug (development only)
```

Rules:

- update frequencyごとに分離
- value変化時だけtext更新
- layout groupをcombat中毎frame再計算しない
- modal open/close時のrebuild spikeを測定
- debug/verification UIをrelease routeへ残さない
- Base/Variantとresponsive profileを維持

## Audio performance budget

- AudioSource poolingまたはcontrolled one-shot
- event familyごとのcooldown/voice limit
- rapid pickupはgrouping/pitch variationを検討
- every particleから音を出さない
- clip load failureを検出
- background/foregroundで二重BGM/duplicate sourceを作らない

U49 actual-device reviewとU50 profiler observationを分離して両方記録します。

## Dangerous moments

### Enemy wave clear

- pool ink bursts
- cap emissions per frame
- stagger fragment spawn where needed
- record simultaneous death count

### EXP vacuum

- merge close fragments visually if needed
- cap trails and audio voices
- avoid per-fragment allocation

### LevelUp / Replacement open

- battle pause ownershipを維持
- no expensive layout rebuild loop
- existing particles/audio are safely suspended or presented

### 黒耀化

- few strong layers
- controlled edge ink overlay
- one primary light pulse
- no full-screen particle storm
- measure charge/ready/active/recovery separately

### Result / Retry

- reward aggregation does not allocate unbounded data
- screen transition and save completion do not produce a visible hitch
- Retry resets pools/listeners/runtime state

## Quality degradation order

Performance不足時は次の順で削減します。

1. background decoration
2. particle count/lifetime
3. glow/overdraw layers
4. trail density
5. non-critical damage text
6. non-critical camera impulse

最後まで維持:

- player/enemy visibility
- HP/time/level
- EXP and reward readability
- touch response
- critical audio/visual state cue

## Evidence format

U50 evidence familyは最低限次を持ちます。

```txt
manifest.json
raw metrics or profiler capture reference
scenario summary
before/after comparison when optimized
screenshots or video references where useful
human touch/thermal review
known issues
checker result
source commit/build/device identity
```

Summaryはraw captureを捏造・置換しません。capture不能項目は`NOT_MEASURED`と理由を記録し、0やPASSで埋めません。

## Readiness promotion

`mobileMetricsReady=true` の最低条件:

- actual-device measurement matrix complete
- sustained and peak scenarios complete
- frame pacing、memory、GC、rendering、touchを記録
- P0/P1 performance/touch issueがない
- evidence pathとsource build/commitが固定
- checkerがevidenceとcurrent implementationを検証
- explicit human review

禁止:

- Editor Profilerだけで昇格
- Simulator FPSだけで昇格
- average FPSだけで昇格
- historical U29/U35 evidenceをcurrent U50へ流用
- docs/readiness JSONだけの昇格
- one short successful runをsustained evidence扱い

## Required commands

```sh
pnpm implementation:preflight:check
pnpm implementation:preflight:full
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm assets:verify
pnpm test
pnpm build
```

Profiler/device captureはcommand PASSと別に必要です。GitHub connectorだけで変更した場合、local/Unity/device測定を実行済みと報告しません。

## Final rule

Effectがframe pacing、touch response、thermal stability、battle readabilityを損なうならpremiumではありません。

**Premium means controlled, readable, measurable, and responsive on the actual device.**
