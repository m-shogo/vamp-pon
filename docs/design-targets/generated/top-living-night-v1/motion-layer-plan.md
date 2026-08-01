# TOP「生きている夜」Motion Layer Plan

Date: 2026-08-01  
Status: implementation-ready design / runtime not connected  
Target: Unity `6000.5.1f1`, URP `17.5.0`, portrait iPhone

## Core decision

全画面動画、AI動画、1本の短いループは使わない。

採用するのは、still key artを再制作したlayer plateと、Unity runtimeの非同期motion。周期の違う小さな動きを重ね、同じ瞬間がそのまま反復して見えない状態を作る。

```txt
static art quality
+ independent periods
+ bounded randomness
+ rare ambient beats
= a living place without video
```

## Why this is the current best fit

- Unity 6.5はSpriteRendererへRenderer Shader User Valueを渡せる。灯りごとにmaterial instanceを増やさず、seed / phase / amplitude / speedを個別化できる。
- URP 17.5のShader Graphで、雲UV、星、glow、heat shimmerを保守しやすいgraphとして作れる。
- Particle SystemはNoise、Texture Sheet Animation、Sub Emitters、Custom Dataを持ち、火の粉・煙・短いflipbookに十分。
- 2D Animationを追加する場合も、顔を補間せず髪先・袖先・呼吸だけに限定できる。
- current projectはUniversal Renderer assetを使っている可能性がある。Renderer 2D / Light2Dへの全体切替はこの候補作業では行わず、互換性を先に検証する。

Official references:

- https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNewUnity65.html
- https://docs.unity3d.com/6000.5/Documentation/Manual/com.unity.shadergraph.html
- https://docs.unity3d.com/6000.5/Documentation/Manual/ParticleSystemModules.html
- https://docs.unity3d.com/6000.5/Documentation/Manual/2d-game-creation-wokflow.html

## Layer production

推奨Aをflattened PNGのまま無理に切り抜かない。承認後、同じ絵を基準にstill-image editingと手動mask QAで以下を再制作する。

| Order | Layer | Production | Runtime motion |
| --- | --- | --- | --- |
| 00 | sky_base | textless clean plate | static |
| 01 | stars_moon | alpha sprite + twinkle mask | star phase only; moon static |
| 02 | clouds_far | clean alpha strip | 38–62s drift, 2–4px |
| 03 | clouds_near | clean alpha strip | 19–31s drift, 3–7px |
| 04 | station_rails | clean plate | 0.4–1.2px parallax only |
| 05 | distant_lights | grayscale glow masks | independent 7–23s noise |
| 06 | characters_back | 1–2 groups | 1px breathing, 9–14s |
| 07 | characters_front | 2–3 groups | hair/sleeve only, 6–11s |
| 08 | animal_robot | separate sprites | ear OR tail; eye scan only |
| 09 | fire_base | ember bed + logs | static warm base |
| 10 | fire_flipbook | 8–12 painted frames | 9–12fps, frame jitter |
| 11 | fire_glow | grayscale mask | 0.96–1.04 scale, noise |
| 12 | smoke | 3 soft sprites | Particle Noise, low alpha |
| 13 | embers | 4–6 tiny sprites | Particle burst, max 24 |
| 14 | foreground | grass + paper strips | 1–3px wind response |
| 15 | UI | uGUI/TMP runtime only | not baked into art |

Clean plateは、キャラや火を消した背景を新しく描き足す。自動segmentationだけで髪や煙を確定しない。alpha edgeとoccluded backgroundを人間が確認する。

## Motion hierarchy

### P0 — fire and glow

- 8–12 frameの手描き風flipbook。
- Texture Sheet Animationは順送り固定ではなく、隣接frame内だけ軽くjitterする。
- glowはsine点滅を禁止し、2つの低周波noiseを合成する。
- 顔へheat distortionを到達させない。
- 火の粉は常時大量に出さず、平均2–4個、rare burstでも24以下。

### P1 — sky and distance

- 月は動かさない。動く基準が必要なため。
- 星は全点同時に明滅させず、3groupでphaseをずらす。
- 遠雲と近雲の周期を互いに素に近い秒数へ分離する。
- 駅灯はRSUVへ個別seedを渡し、material共有のまま非同期化する。

### P2 — characters

- 顔、目、口を生成補間しない。
- 前景2人まで、胸郭1px、髪先2px、袖先2px。
- ほかの人物は完全静止でもよい。全員を動かすより静けさを優先する。
- 動物は耳か尻尾の片方だけ。ロボットはeye light scanだけ。

### P3 — rare ambient beats

一定間隔ではなく、cooldown付きの乱数eventにする。

| Beat | Interval window | Rule |
| --- | --- | --- |
| ember swell | 18–42s | 1.2s、前回から15s以上 |
| kettle steam | 24–55s | 人物の顔へ重ねない |
| robot eye scan | 35–75s | 0.7s、連続禁止 |
| distant lantern answer | 50–110s | 1灯だけ、brightness +6% |
| paper strip sway | 12–36s | 1–2枚だけ |

同じrare beatを同時に2つ発火させない。最短5分の観察でも完全な同期ループが見えないようにする。

## Unity implementation

### Rendering

- TOP artはuGUIの完成画面画像にせず、uGUIより背面のSpriteRenderer群として扱う。
- Shader Graphは共有graph 3種以内: `Sky`, `Glow`, `FireHeat`。
- Unity 6.5の`SpriteRenderer.SetShaderUserValue`でper-rendererのseed / phase / amplitude / speedを渡す。
- Renderer 2D / Light2Dは別rendererの小さいprototypeで検証し、既存Universal Rendererを直接置き換えない。
- full-screen transparent noise、full-screen distortion、全灯real-time lightは禁止。

### Scheduler

- `AmbientMotionDirector`がsession seedとQA固定seedを分離する。
- productionは起動ごとにseed変更、captureは固定seed。
- `AnimationCurve`は周期を同期させず、durationをレイヤーごとに変える。
- app background時はparticleとschedulerを停止。foreground復帰時はburstを再生せず静かに再開。

### Accessibility

Reduced Motion:

```txt
camera parallax=off
cloud drift=off
rare beats=off
particles=off
fire flipbook=4fps
glow amplitude<=2%
UI transition=250ms crossfade
```

### Performance budget

- master long edge <= 2048 for runtime derivative; source candidate is preserved separately。
- Mipmap OFF、Wrap Clamp、Filter Bilinear、Read/Write OFF。
- iOS ASTC 6x6を第一候補。顔と黒インク細線が崩れる場合だけ4x4比較。
- SpriteRenderer 16以下、shared material 3以下。
- particle steady 24以下、rare peak 48以下。
- full-screen overdrawを増やす半透明layerはsky 2 + atmosphere 1まで。
- 360x800 / 390x844 / 430x932、60fps、memory、background/foregroundを計測する。

## Implementation order

1. 人間がA〜Dから方向を選ぶ。
2. 選択候補のclean platesとalpha layersをstill-image editで制作。
3. fire atlas、glow masks、smoke/ember spritesを制作。
4. static TOP sceneをuGUI下へ接続し、responsive cropだけ検証。
5. P0 fire/glowを実装。
6. P1 sky/distanceを実装。
7. P2 character micro motionを必要な箇所だけ追加。
8. P3 ambient schedulerとReduced Motionを追加。
9. Compact / Standard / Large capture、Simulator、iPhone performance review。
10. 人間承認後だけ`approvedAsFinal`と`runtimeApproved`を検討。

## Explicitly not used

- AI video generation
- full-screen MP4/WebM loop
- face interpolation / lip sync
- all-character idle animation
- fake loading or forced title dwell time
- VFX Graph just for novelty
- Addressables introduction during this visual candidate task

