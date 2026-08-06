# Loading -> TOP runtime review checklist

## Capture matrix

Capture each row at 360x800, 390x844, and 430x932.

| Frame | Forced index | Required |
| --- | ---: | --- |
| loading-spring | 0 | yes |
| loading-summer | 1 | yes |
| loading-autumn | 2 | yes |
| loading-winter | 3 | yes |
| top | n/a | yes |

## Editor capture procedure

For each seasonal slot:

1. Use `Vamp Pon > Loading Seasonal > Capture > Force <Season> + Hold`.
2. Enter Play Mode.
3. Set the Game view to the target resolution.
4. Use `Capture Current Game View`.
5. Use `Release Loading To TOP`.
6. Capture TOP at the same resolution.
7. Exit Play Mode, choose the next season, and repeat.
8. Clear the override after the pack is complete.

Captures are written under:

```txt
docs/design-targets/generated/loading-seasonal-v1/runtime-captures/
```

## Flow

- [ ] Normal startup shows Loading before TOP.
- [ ] Loading completion creates and reveals TOP exactly once.
- [ ] TOP still opens StageSelect through `夜へ出る`.
- [ ] TOP still opens Collection through `灯録`.
- [ ] Reinitialization does not leave duplicate Loading or TOP views.
- [ ] Existing `VAMPPON_AI_SIMULATOR_SMOKE` evidence remains unchanged.

## Four-art rotation

- [ ] All four slots resolve in the built player.
- [ ] All four slots can be forced for capture.
- [ ] Normal startup chooses a random slot.
- [ ] The same slot does not appear on two consecutive normal launches.
- [ ] Capture override does not modify production selection logic.
- [ ] Final seasonal binaries replace all temporary fallback sources before approval.

## Visual review

- [ ] No unsafe crop at 360x800.
- [ ] No unsafe crop at 390x844.
- [ ] No unsafe crop at 430x932.
- [ ] Important faces and silhouettes stay outside the Dynamic Island / notch risk zone.
- [ ] Bottom status and progress UI stay above the home indicator.
- [ ] Text remains readable on all four images.
- [ ] No stretched artwork.
- [ ] No black fringe, transparent edge, or unintended bar.
- [ ] Loading and TOP feel like one visual world.
- [ ] The fade does not flash StageSelect between Loading and TOP.

## Motion and performance

- [ ] Loading remains stable for an editor capture hold.
- [ ] TOP runs for five minutes without desynchronised visual failure.
- [ ] Simulator FPS and memory are recorded.
- [ ] Physical iPhone FPS, memory, and thermal state are recorded.
- [ ] Background -> foreground recovery returns to the correct screen.
- [ ] Loading and TOP textures are released after dismissal.

## Approval

- [ ] Runtime capture pack is committed.
- [ ] Human review result is recorded.
- [ ] `seasonalBinariesCommitted=true` only after the four approved seasonal PNGs are in Git.
- [ ] `runtimeApproved=true` only after Simulator and physical-device gates pass.
- [ ] PR remains Draft until every required gate is complete.
