# ヨルノシルベ TOP「生きている夜」Production Layer Kit v2

Date: 2026-08-01  
Status: human-selected composition direction / production-layer candidate / runtime not connected  
Target: Unity `6000.5.1f1`, URP `17.5.0`, portrait iPhone

## 結論

Candidate Aをflattened画像のまま切り刻まず、同じ構図を基準に隠れた背景と各motion sourceを再制作した。

動画生成、全画面動画、顔の補間は使用していない。`top-living-night-layer-motion-preview.mp4`は、下記の静止レイヤーを決定的な規則で合成した実装前プレビューである。

## Layer stack

| Order | File | Role | Runtime motion |
| --- | --- | --- | --- |
| 00 | `00-environment-starless.png` | 人物・火・月・星・雲を除いた完全背景 | 0.4–1.2px camera parallax only |
| 01 | `01-stars.png` | 星 | UV hashで3群、非同期twinkle |
| 01 | `01-moon.png` | 三日月 | fixed reference point |
| 02 | `02-clouds-far.png` | 遠雲 | 38–62s、2–4px drift |
| 03 | `03-clouds-near.png` | 近雲 | 19–31s、3–7px drift |
| 04 | `04-distant-lights-mask.png` | 駅灯mask | RSUV seed、7–23s noise |
| 05 | `05-distant-companion.png` | 遠景人物 | static |
| 06 | `06-characters.png` | 主要人物群 | v2ではstatic。顔補間禁止 |
| 08 | `08-animal-robot.png` | 動物＋ロボット | 将来、耳または眼光のみ |
| 08 | `08-robot-eye-mask.png` | ロボット眼光mask | 35–75s rare scan |
| 09 | `09-fire-base.png` | 薪・炭・石輪 | static |
| 10 | `10-fire-flipbook-atlas.png` | 4x3 / 12-frame炎atlas | 8–10fps、隣接frame jitter |
| 11 | `11-fire-glow-mask.png` | 火の照り返しmask | 2 noise、sine単独禁止 |
| 12 | `12-smoke-atlas.png` | 3x2 / 6 smoke sprites | low-alpha Particle Noise |
| 13 | `13-embers-atlas.png` | ember sprites | steady 2–4、rare max 24 |
| 14 | `14-foreground-accents.png` | 前景草・ランタン・紙片 | edge-only微風 |
| 14 | `14-lantern-glow-mask.png` | 前景ランタンmask | independent low-frequency noise |

`06-characters.png`は品質維持のため、生成段階で前後人物へ無理に再分割していない。キャラmicro-motionは、正式identity照合後に主要2人だけ手動maskを作る。全員を動かすことは完成条件ではない。

## Preview

- `previews/top-living-night-layered-candidate-390x844.png`: standard device static composite
- `previews/top-living-night-layered-candidate-360x800.png`: compact crop
- `previews/top-living-night-layered-candidate-430x932.png`: large crop
- `previews/layer-contact-sheet.png`: layer separation review
- `previews/motion-checkpoints.png`: 4 fire/cloud states
- `previews/top-living-night-layer-motion-preview.mp4`: 48 frames / 8fps / 6s deterministic composite
- `previews/top-living-night-layer-motion-preview.webp`: loopable review derivative

## Approval boundary

```txt
sourceComposition=candidate-a
humanSelectedCompositionDirection=true
assetStatus=production-layer-candidate
alphaQa=automatic-pass-human-pending
approvedAsFinal=false
runtimeApproved=false
runtimeConnected=false
finalApprovalBlocked=true
videoGenerationUsed=false
```

これは「Aの方向でレイヤー制作へ進める」という選択を記録する。正式キャラクターidentity比較、alpha edge人間確認、Unity import、responsive crop、Simulator、物理iPhone、性能計測が終わるまでfinalやproduction readyへ昇格しない。

## Explicit non-scope

- PR #76 / U49 readiness・証跡・flagsの変更
- Unity `Assets` / `Packages` / `ProjectSettings`へのruntime接続
- CANON人物としての早期固定
- AI動画、MP4をruntime sourceとして使用
- 顔、目、口の生成補間

