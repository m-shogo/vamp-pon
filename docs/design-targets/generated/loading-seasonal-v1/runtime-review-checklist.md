# Loading -> TOP runtime review checklist

## Capture matrix

The automated pack captures all required frames at 360x800, 390x844, and 430x932.

| Frame | Forced index | Required captures |
| --- | ---: | ---: |
| loading-spring | 0 | 3 |
| loading-summer | 1 | 3 |
| loading-autumn | 2 | 3 |
| loading-winter | 3 | 3 |
| top | n/a | 3 |

Total required runtime captures: **15**.

## Automated capture result

- [x] Unity 6000.5.1f1 executed the full capture matrix.
- [x] `runtime-capture-manifest.json` reports `PASSED`.
- [x] Capture count is 15/15.
- [x] PNG dimensions match 360x800 / 390x844 / 430x932.
- [x] SHA-256 is recorded for every PNG.
- [x] Corrected capture pack is committed at `380e966e30637d48684e3f353ba6c723c0b33aa3`.

Captures are stored under:

```txt
docs/design-targets/generated/loading-seasonal-v1/runtime-captures/
```

## Flow

- [x] Normal startup shows Loading before TOP in automated runtime capture.
- [x] Loading completion creates and reveals TOP exactly once in the capture flow.
- [ ] TOP still opens StageSelect through `夜へ出る` in human interaction review.
- [ ] TOP still opens Collection through `灯録` in human interaction review.
- [ ] Reinitialization does not leave duplicate Loading or TOP views in a rendered player run.
- [x] Existing `VAMPPON_AI_SIMULATOR_SMOKE` evidence remains unchanged.

## Four-art rotation

- [x] All four slots resolve in the built player.
- [x] All four slots can be forced for capture.
- [x] Final seasonal binaries replace temporary fallback sources in the manifest.
- [ ] Normal startup chooses a random slot in repeated rendered launches.
- [ ] The same slot does not appear on two consecutive rendered launches.
- [x] Capture override remains Editor-only and does not replace production selection logic.

## Visual review

- [ ] No unsafe crop at 360x800.
- [ ] No unsafe crop at 390x844.
- [ ] No unsafe crop at 430x932.
- [ ] Important faces and silhouettes stay outside the Dynamic Island / notch risk zone.
- [ ] Bottom status and progress UI stay above the home indicator.
- [ ] The Loading progress line reads as a subtle 1-2px light, not a heavy bar.
- [ ] `夜の記憶をひらいています…` remains readable on all four images.
- [ ] No stretched artwork.
- [ ] No black fringe, transparent edge, unintended bar, or white panel.
- [ ] TOP shows the complete layered night artwork rather than the dark fallback alone.
- [ ] Loading and TOP feel like one visual world.
- [ ] The fade does not flash StageSelect between Loading and TOP.

## TOP art direction

Current TOP is a 17-asset layered composition, not a missing single image.

- [x] Environment, stars, moon, clouds, lights, characters, fire, animal/robot, smoke and embers are connected.
- [x] Null-texture white panels are suppressed until readiness.
- [x] The dark night fallback remains behind the artwork.
- [x] TOP capture waits for `LoadingTopVisualPolishCoordinator.IsCurrentTopReady`.
- [ ] Formal character identity master comparison is complete.
- [ ] Human review confirms the current candidate is strong enough, or identifies only the layers that need regeneration.

## Motion and performance

- [x] Loading remains stable during automated capture hold.
- [ ] TOP runs for five minutes without desynchronised visual failure.
- [ ] Simulator FPS and memory are recorded.
- [ ] Physical iPhone FPS, memory, and thermal state are recorded.
- [ ] Background -> foreground recovery returns to the correct screen.
- [ ] Loading and TOP textures are released after dismissal in a rendered player run.

## Approval

- [x] Runtime capture pack is committed.
- [ ] Human visual review result is recorded.
- [x] `seasonalBinariesCommitted=true`.
- [x] `runtimeCaptureComplete=true`.
- [ ] `humanVisualReviewComplete=true` only after reviewing the corrected captures.
- [ ] `runtimeApproved=true` only after Simulator and physical-device gates pass.
- [ ] PR remains Draft until every required gate is complete.
