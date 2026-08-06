# Loading -> TOP runtime review checklist

## Current recapture boundary

The first automated 15-frame pack completed technically, but visual review found two defects:

- the Loading progress bar was visually too heavy,
- TOP was captured before its layered artwork was ready, leaving a white field.

That pack is invalidated as visual evidence. `runtime-capture-manifest.json` remains `NOT_RUN` until the corrected pack is generated.

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

## Automated capture procedure

No Unity menu clicking or manual Game View resizing is required.

Run the repository bootstrap from the normal `vamp-pon` worktree. It will:

1. create or refresh an isolated capture worktree,
2. replace any stale Editor-only fallback paths with the final seasonal PNG paths,
3. open Unity 6000.5.1f1,
4. select each required Game View resolution,
5. force and hold each seasonal Loading image,
6. capture all 12 Loading frames,
7. transition into TOP and capture all 3 TOP frames,
8. validate PNG dimensions and SHA-256,
9. write `runtime-capture-manifest.json`,
10. commit and push the completed capture pack to PR #78.

Unity opens and closes automatically. Runtime rendering still has to execute on the local Mac because GitHub Actions does not provide this project's licensed Unity Editor and graphical Game View environment.

Captures are written under:

```txt
docs/design-targets/generated/loading-seasonal-v1/runtime-captures/
```

The capture result is recorded in:

```txt
docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json
```

## Flow

- [ ] Normal startup shows Loading before TOP.
- [ ] Loading completion creates and reveals TOP exactly once.
- [ ] TOP layered art and UI appear only after the required base textures are ready.
- [ ] TOP still opens StageSelect through `夜へ出る`.
- [ ] TOP still opens Collection through `灯録`.
- [ ] Reinitialization does not leave duplicate Loading or TOP views.
- [ ] Existing `VAMPPON_AI_SIMULATOR_SMOKE` evidence remains unchanged.

## Four-art rotation

- [x] All four slots resolve in the built player.
- [x] All four slots can be forced for capture.
- [x] Final seasonal binaries replace temporary fallback sources in the manifest.
- [ ] Normal startup chooses a random slot in a rendered player run.
- [ ] The same slot does not appear on two consecutive rendered launches.
- [ ] Capture override does not modify production selection logic.

## Loading visual acceptance

- [ ] Progress is shown as a quiet 1–2 px equivalent line, not a thick bar.
- [ ] The line uses a pale light tone rather than saturated gold.
- [ ] The line still communicates progress through left-to-right fill and a subtle pulse.
- [ ] The canonical copy remains `夜の記憶をひらいています…` during capture hold.
- [ ] Progress UI remains above the home indicator at all three resolutions.
- [ ] The seasonal illustration remains the visual focus.

## TOP blank-screen acceptance

- [ ] No white rectangle or white first-frame flash is visible.
- [ ] Null-texture RawImages remain transparent.
- [ ] A dark night-color fallback remains visible while textures prepare.
- [ ] Final layered artwork is present in all three TOP captures.
- [ ] Title, subtitle, ambient copy, and both buttons appear after readiness fade.
- [ ] Missing-layer timeout still reveals a dark, non-white fallback with an honest warning.

## General visual review

- [ ] No unsafe crop at 360x800.
- [ ] No unsafe crop at 390x844.
- [ ] No unsafe crop at 430x932.
- [ ] Important faces and silhouettes stay outside the Dynamic Island / notch risk zone.
- [ ] Text remains readable on all four images.
- [ ] No stretched artwork.
- [ ] No black fringe, transparent edge, or unintended bar.
- [ ] Loading and TOP feel like one visual world.
- [ ] The fade does not flash StageSelect between Loading and TOP.

## Motion and performance

- [ ] Loading remains stable during automated capture hold.
- [ ] TOP runs for five minutes without desynchronised visual failure.
- [ ] Simulator FPS and memory are recorded.
- [ ] Physical iPhone FPS, memory, and thermal state are recorded.
- [ ] Background -> foreground recovery returns to the correct screen.
- [ ] Loading and TOP textures are released after dismissal.

## Approval

- [ ] `runtime-capture-manifest.json` reports `PASSED` with 15/15 corrected captures.
- [ ] Corrected runtime capture pack is committed.
- [ ] Human review result is recorded.
- [x] `seasonalBinariesCommitted=true` after the four approved seasonal PNGs entered Git.
- [ ] `runtimeApproved=true` only after Simulator and physical-device gates pass.
- [ ] PR remains Draft until every required gate is complete.
