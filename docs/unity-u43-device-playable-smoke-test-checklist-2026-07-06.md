# Unity U43 Device Playable Smoke Test Checklist

Date: 2026-07-06

Purpose: U43で修復したStage1 actual runtimeを、実機再確認前のdevice playable smoke testにかけるための最終点検リスト。これはmetrics tuningではない。

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
