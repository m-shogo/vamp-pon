# Unity U43 Device Playable Smoke Test Checklist

Date: 2026-07-06

Purpose: U43で修復したStage1 actual runtimeを、実機再確認前のdevice playable smoke testにかけるための最終点検リスト。これはmetrics tuningではない。

## submitted device result

Status: `NOT_PROVIDED`

2026-07-06時点で実機確認結果の各項目は空欄で提供された。確認済みのpass/failとして扱わず、すべてhuman-check-neededのまま維持する。失敗項目も特定できないため、追加runtime修正は行わない。

Pre-device automated smokeを追加しても、actual device smoke result remains NOT_PROVIDED. Editor evidenceは実機pass/failではない。

| item | submitted result | current evidence status |
| --- | --- | --- |
| StageSelect表示 | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| StageSelect中に裏でBattleが進まない | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| Stage1へtap | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| touch movement | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| UI tapとmovement衝突 | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| enemy hit | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| pickup | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| LevelUp card tap | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| Result open | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| Result中に裏でBattleが進まない | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| Retry | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| StageSelect return | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| SE | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| haptic | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| crash/freeze | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| キャラのドット見た目 | NOT_PROVIDED | HUMAN_CHECK_NEEDED |
| その他気になった点 | NOT_PROVIDED | HUMAN_CHECK_NEEDED |

## pre-device automated smoke

Evidence:

```txt
docs/unity-u43-predevice-automated-smoke-2026-07-06.md
docs/design-targets/generated/unity-u43/predevice-automated-smoke-readiness.json
```

This is Editor automated pre-device smoke only. It can confirm compile / scene / runtime gate / hook breakages before device work, but cannot mark device playable ready.

2026-07-06 pre-device automated smoke result: completed in Unity batchmode. See `predevice-automated-smoke-readiness.json`. Actual device smoke remains `NOT_PROVIDED`.

## smoke test items

- StageSelect tap: Stage1へボタンが反応する。
- Battle start: StageSelect tap後にBattle timer、enemy spawn、weapon fireが始まる。
- touch movement: 左下virtual stick領域だけで移動できる。
- enemy hit: projectile hitでenemy hit feedbackが出る。
- pickup: exp pickupが吸い寄せ、回収、HUD反映、feedback hookを通る。
- LevelUp card tap: LevelUp card tapがmovementに吸われず選択できる。
- Result open: Result overlayが開く。
- Retry: Retry tapでStage1に戻る。
- StageSelect return: ResultからStageSelectへ戻れる。
- SE: runtime hook確認用toneが端末で鳴る。
- haptic: device hook確認用 `Handheld.Vibrate()` が端末で呼ばれる。
- crash/freezeなし: Smoke test中にcrash、freeze、操作不能がない。
- overlay pause: StageSelect overlay中にenemy spawn、projectile、pickup、timer、damage、player movementが進まない。
- result pause: Result overlay中にenemy、projectile、pickup、SE loop、player movementが裏で進まない。

## runtime gate expectations

- StageSelect表示中は `U2BattleController.SetRuntimePaused(true)` と `PlayerController.SetRuntimeInputBlocked(true)` を維持する。
- Stage1へtap後だけ `SetRuntimePaused(false)` と `SetRuntimeInputBlocked(false)` にする。
- Result表示中は `SetRuntimePaused(true)` と `SetRuntimeInputBlocked(true)` に戻す。
- Result中はRetry / StageSelect tapのみ確認対象にする。
- UI上のtap / dragはmovementとして扱わない。
- virtual stickは左下領域だけに限定する。

## feedback bridge boundary

- `AudioClip.Create` toneはruntime hook確認用であり、final SEではない。
- `audioMixerReady=false` と `audioLatencyMeasured=false` を維持する。
- `Handheld.Vibrate()` はdevice hook確認用であり、本番haptic設計ではない。
- `hapticMeasured=false` を維持する。

## READY flags

Keep false until device evidence and metrics exist:

- `devicePlayableReady=false`
- `mobileMetricsReady=false`
- `audioMixerReady=false`
- `audioLatencyMeasured=false`
- `hapticMeasured=false`
- `rcReady=false`
- `productionApproved=false`
