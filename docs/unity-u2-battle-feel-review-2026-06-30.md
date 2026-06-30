# Unity U2 Battle Feel Review

Date: 2026-06-30

## Summary

U2では、Unity上でVamp Ponの戦闘が気持ちよくなりそうかを確認するため、Stage1に30〜60秒触れる最小Battle Feel prototypeを追加した。完成戦闘ではなく、移動、敵スポーン、追跡、自動攻撃、撃破、EXP drop / attract / pickup、pool境界のtechnical spikeである。

判定: U3 Juice / VFX Proofへ進んでよい。

## Environment

- Unity Editor: 6000.5.1f1
- ProjectVersion.txt:
  - `m_EditorVersion: 6000.5.1f1`
  - `m_EditorVersionWithRevision: 6000.5.1f1 (0d9463e84828)`
- Render Pipeline: 2D URP
- URP Asset: `Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset`
- 2D Renderer Data: `Assets/_Project/Settings/U1Renderer2DData.asset`

## Implemented Scope

- Yui keyboard movement with WASD / Arrow keys through an input abstraction.
- Smooth movement using acceleration / deceleration.
- Ombu pooled spawn at screen-edge-near positions.
- Ombu chase toward Yui.
- Pooled auto attack projectile toward nearest active Ombu.
- Damage, hit flash, small burst, death burst.
- Pooled EXP fragment drop on defeat.
- EXP pop, magnet attraction, pickup, collect pulse.
- Pool boundaries for enemies, projectiles, EXP fragments, and hit/collect VFX.
- U2 config values added to `GameFeelConfig`.
- U2 Editor verification script.
- U2 screenshot capture script and 3 review screenshots.

## Verification

Command result from `U2BattleFeelVerification`:

```txt
Movement: distance=2.235, moved=True
Battle: spawned=6, fired=12, defeated=3, droppedExp=3, collectedExp=3
Pools: enemies=3, projectiles=0, exp=0, vfx=0
390x844: canvas=True, safeHud=True, backgroundCover=True
360x800: canvas=True, safeHud=True, backgroundCover=True
430x932: canvas=True, safeHud=True, backgroundCover=True
```

Console notes:

- Compile errors: none after fixes.
- Runtime exceptions: none after switching movement input to Unity Input System Keyboard API.
- Batchmode log still prints Unity Licensing handshake errors; the verification command exits successfully and writes the report.

## Screenshots

保存先: `docs/design-targets/generated/unity-u2/`

| Resolution | File | Result |
| --- | --- | --- |
| 390x844 | `unity-u2-stage1-390x844.png` | OK |
| 360x800 | `unity-u2-stage1-360x800.png` | OK |
| 430x932 | `unity-u2-stage1-430x932.png` | OK |

## Feel Review

| Item | Result |
| --- | --- |
| Yui movement | 軽い加速/減速が入り、verificationでは移動距離が出ている。手触りの最終判断は実Editor操作で継続確認する。 |
| Ombu spawn / chase | 少数が画面端近くから入り、Yuiへ近づく。まだ配置は仮で、密度制御はU3以降。 |
| Auto attack | 最寄りOmbuへ光弾が飛ぶ。方向性は見えるが、発射予兆や軌跡はまだ弱い。 |
| Enemy defeat | hit flashと小さなburstで撃破が分かる。U3でhit stop / ink burstを足す余地が大きい。 |
| EXP drop / attract / pickup | drop、吸引、collect pulseが動く。Webより気持ちよくできそうな余地あり。 |
| Pool boundary | Instantiate/Destroy連打ではなく、prewarmしたpoolをSetActiveで回す境界を作った。 |

## Responsive Review

- 390x844: HUDはSafe Area内。背景cover OK。Yui / Ombu / EXPが読める。
- 360x800: narrow portraitでもHUDは収まる。下HUDに近い戦闘要素はU2でboundsを少し内側へ寄せた。
- 430x932: large portraitでも余白は破綻せず、背景cover OK。

## U2 Remaining Concerns

- 手触りはbatchmodeだけでは完全評価できないため、Editor Game ViewでWASD / Arrow操作を人間が触る確認が必要。
- Input abstractionはキーボード実装のみ。スマホ向けvirtual stick / touch inputは未実装。
- Projectile / hit / collect VFXはprocedural placeholderで、本番素材ではない。
- Japanese TMP fontは未導入。U4 UI demo前に日本語対応font assetが必要。
- PoolはU2境界であり、production向けの汎用pool managerではない。
- Enemy density、spawn pacing、camera impulse、hit stop、particle capはU3で調整する。

## Next: U3

- hit stopと小さなcamera impulseを追加する。
- ink burst / collect trail / lantern pulseを強める。
- EXP吸引の曲線と速度を、複数fragmentで気持ちよく見えるよう調整する。
- Enemy / projectile / VFX poolを少し整理し、particle capを入れる。
- 390x844 / 360x800 / 430x932でVFX追加後の視認性を再確認する。
