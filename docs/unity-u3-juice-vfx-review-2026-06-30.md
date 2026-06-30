# Unity U3 Juice / VFX Review

Date: 2026-06-30

## Summary

U3では、U2の「動くBattle Feel prototype」を、Unityで演出を伸ばせる入口が見える状態へ引き上げた。完成戦闘ではなく、hit stop / camera impulse / ink burst / collect trail / lantern pulse / EXP吸引カーブ / VFX pool capのtechnical spikeである。

判定: U4 LevelUp UI Demoへ進んでよい。

## Environment

- Unity Editor: 6000.5.1f1
- ProjectVersion.txt:
  - `m_EditorVersion: 6000.5.1f1`
  - `m_EditorVersionWithRevision: 6000.5.1f1 (0d9463e84828)`
- Render Pipeline: 2D URP
- URP Asset: `Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset`
- 2D Renderer Data: `Assets/_Project/Settings/U1Renderer2DData.asset`

## Phase U3-A: Feel Core

- Enemy hit時に短いhit stopを追加。
  - `hitStopSeconds = 0.028`
  - `hitStopCooldown = 0.22`
  - `Time.timeScale = 0.18` の短い減速で、連続hitで固まりすぎないよう調整。
- Enemy撃破時に小さなcamera impulseを追加。
  - HUDはScreen Space Overlayなので、揺れはworld camera側に限定。
  - `impulseStrength = 0.055`, `impulseDuration = 0.14`
- Damage flashを強化。
  - hit直後に暖色寄りflashとscale pulse。
- Death burstを強化。
  - 黒インクradial + 小さな暖色光 + 小粒のink droplets。
- Lantern pulseを追加。
  - 攻撃時とcollect時にYui周辺へ暖色pulseを出す。

## Phase U3-B: EXP Feel

- EXP drop時のpopを調整。
  - `expPopSpeed = 1.7`, `expPopSeconds = 0.16`
  - ばらけすぎない小さなpopに制限。
- EXP吸引カーブを改善。
  - 近いほど加速。
  - `expFinalSnapRadius = 0.36` 内で最後にスッと入る。
- collect trailを追加。
  - fragment移動中とpickup直前に短いteal trailをpoolから出す。
- collect pulseを強化。
  - collect時にfragment pulse、lantern pulse、HUD EXP label pulseを追加。
- HUD EXP反応を最小追加。
  - 日本語fontは入れず、既存ASCII HUDをscale pulseするだけに留めた。

## Phase U3-C: VFX Guard / Evidence

- VFX poolを整理。
  - hit / death / collect / trail / pulseを同じpool actorで扱う。
  - `Radial` と `Trail` の2形状だけ追加。
- `maxActiveVfx` を追加。
  - `maxActiveVfx = 18`
  - 上限超過時は新規VFXを捨て、reportへ `dropped` を出す。
- camera impulseはstrengthをclamp。
  - 強くなりすぎないよう `0.12` 上限。
- U3 verification reportを追加。
- U3 screenshotsを追加。

## Verification

Command result from `U3JuiceVerification`:

```txt
Movement: distance=1.010, moved=True
Battle: spawned=8, fired=14, defeated=4, droppedExp=4, collectedExp=4
Feel: hitStop=13, cameraImpulse=4, lanternPulse=18, deathBurst=4, collectTrail=4
VFX: active=0, peak=10, played=50, dropped=0, maxActiveCap=18
Pools: enemies=4, projectiles=0, exp=0, vfx=0
390x844: canvas=True, safeHud=True, backgroundCover=True
360x800: canvas=True, safeHud=True, backgroundCover=True
430x932: canvas=True, safeHud=True, backgroundCover=True
```

Console notes:

- Compile errors: none.
- Runtime exceptions: none.
- Batchmode log still prints Unity Licensing handshake errors; verification exits successfully and writes the report.

## Screenshots

保存先: `docs/design-targets/generated/unity-u3/`

| Resolution | File | Result |
| --- | --- | --- |
| 390x844 | `unity-u3-stage1-390x844.png` | OK |
| 360x800 | `unity-u3-stage1-360x800.png` | OK |
| 430x932 | `unity-u3-stage1-430x932.png` | OK |

## Feel Review

| Item | Result |
| --- | --- |
| Hit stop | 短く効く。連続hitでも完全停止しすぎない値に調整済み。 |
| Camera impulse | 撃破時にworld側だけ軽く揺れる。HUDは揺れすぎない。 |
| Damage flash | hit瞬間がU2より読みやすい。白飛びではなく暖色flash。 |
| Death burst | 黒インクと暖色光が入り、Vamp Ponらしい方向性が見えた。 |
| Lantern pulse | 攻撃/collectの両方で暖色の脈動が出る。まだplaceholderだが方向性は良い。 |
| EXP attraction | 近づくほど加速し、最後にsnapする。collect trailで吸われる感覚が増えた。 |
| VFX guard | peak active VFXは10、cap 18内。dropped 0。 |

## Responsive Review

- 390x844: HUDはSafe Area内。背景cover OK。VFX追加後もYui / Ombu / EXPが読める。
- 360x800: narrow portraitでもHUDは収まる。VFXは控えめで窮屈すぎない。
- 430x932: large portraitでも背景cover OK。余白に余裕あり。

## U3 Remaining Concerns

- VFXはすべてprocedural placeholderであり、本番素材ではない。
- スクショは短い瞬間証跡なので、burst/trailの最終判断はEditor Game Viewで人間が触る確認が必要。
- hit stop / impulseは気持ちよさの入口で、production tuningではない。
- Japanese TMP fontは未導入。U4 UI demo前に日本語対応font assetが必要。
- mobile virtual stick / touch inputは未実装。
- poolはU3検証用で、production汎用pool managerではない。

## Next: U4

- LevelUp UI Demoへ進む。
- Japanese TMP font testを入れる。
- PaperCard / PaperButton / IconFrameの方向性を検証する。
- 3-choice card UI、selected feedback、rare / awakening gate placeholderを最小実装する。
- U3のbattle VFXを壊さず、UI overlayとの共存を確認する。
