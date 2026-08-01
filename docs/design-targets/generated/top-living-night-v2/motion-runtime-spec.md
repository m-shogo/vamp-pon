# TOP Living Night v2 — Unity Runtime Spec

## Render order

`SpriteRenderer`を16以下に保ち、uGUI/TMPは全artより前面へ置く。

```txt
environment
stars
moon
far clouds
near clouds
distant lights
distant companion
characters
fire base
animal + robot
fire flipbook
fire glow
smoke + embers
foreground accents
lantern glow
runtime UI
```

## P0 fire

- Atlas slice: 4 columns x 3 rows, 12 frames.
- Base playback: 8–10fps.
- 完全なrandom frame jumpは禁止。現在frameの前後1枚だけを候補にする。
- 4回に1回までframe holdを許可し、周期の見え方を崩す。
- `fire_glow`はlow-frequency noiseを2本合成。単独sine点滅は禁止。
- heat distortionは火の周囲だけにclipし、顔、地図、UIへ到達させない。

## P1 sky and lights

- 月は固定。
- 星はUV position hashで3群に分け、phase・speed・amplitudeをRSUVで渡す。
- 近雲と遠雲は別のshared material instanceを使わず、renderer user valueで速度差を作る。
- camera parallaxは最大1.2px。端の透明露出を防ぐため、雲だけ4–8pxのoverscanをUnity import後に確認する。
- 駅灯と前景灯は同時に明滅させない。brightness振幅は通常±3%、rare beatでも+6%以下。

## P2 living details

- v2の人物群は静止が正本。
- identity照合後、中央2人のみ呼吸1px、髪先2px、袖先2pxのmanual mesh/maskを検討する。
- 犬は耳か呼吸の片方だけ。ロボットは眼光scanだけ。
- 18–110秒のrare beatは同時に2つ発火させない。

## Reduced Motion

```txt
cloud drift=off
camera parallax=off
rare beats=off
particles=off
fire fps=4
glow amplitude<=2%
robot eye scan=off
UI transition=250ms crossfade
```

## Import budget

- Full-canvas source: 852x1846, long edge 1846.
- Mipmap OFF / Wrap Clamp / Filter Bilinear / Read-Write OFF.
- iOS ASTC 6x6を第一候補。顔と細い黒インク線が破綻した場合だけ4x4を比較する。
- Shared Shader Graph: `Sky`, `Glow`, `FireHeat`の3種以内。
- steady particle <=24 / rare peak <=48.
- 360x800 / 390x844 / 430x932でsafe crop。
- backgroundでschedulerとparticleを停止。foreground復帰時の自動burstは禁止。

## Preview caveat

6秒previewはレイヤー登録と動作方向を検証するための短縮版。runtimeに動画として組み込まない。5分非同期性、60fps、memory、thermal、background/foregroundはUnity実装後の別gateで確認する。

