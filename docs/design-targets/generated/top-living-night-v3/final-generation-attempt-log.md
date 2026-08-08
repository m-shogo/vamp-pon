# TOP Living Night V3 — Final Generation Attempt Log

Status: `FINAL_CANDIDATE_STILL_MISSING`

This log records failed generation modes so a later agent does not repeat them or accidentally promote their outputs.

## Rejected failure mode — development dashboard leakage

Multiple image-generation attempts in the development conversation produced wide project-status dashboards / infographics instead of a 430x932 game TOP key visual. Those outputs contained GitHub/PR/CI/evidence/roadmap text and sometimes a generic five-person campfire illustration embedded inside the dashboard.

They are **not project art**, are **not final-art candidates**, and must never be copied to the canonical final path or used as Core5 evidence.

Observed failure pattern:

- development/status context overpowered the visual-art request
- output became landscape dashboard/infographic rather than portrait illustration
- text/UI/CI/roadmap content was baked into the image
- humans were generic and not reliable Core5 identity matches
- aesthetically useful campfire fragments do not make the whole output eligible

## Locked remediation

Use the isolated visual-only authority:

`docs/design-targets/generated/top-living-night-v3/final-key-art-isolated-prompt.txt`

Use only these visual sources in a clean generation context:

- five locked Core5 masters from `core5-reference-manifest.json`
- composition-only bridge `top-living-night-layered-candidate-430x932.png`

Do not supply PR status, CI output, evidence tables, implementation roadmaps, review dashboards, or development screenshots to the image generator.

The full prompt remains useful for engineering/review context, but the isolated prompt is the preferred generator-facing text because it contains no project-status narrative.

### Clean generator-input artifact

The `TOP Art Preproduction` workflow now builds a generated-only artifact that is safe to hand to a clean image-generation context without carrying PR/CI/dashboard screenshots.

It contains:

- the isolated visual-only prompt
- `final-identity-brief.md`
- the locked Core5 reference manifest
- the composition-only 430x932 bridge
- five generated transparent full-body Core5 cutouts
- a clean bridge + five-master reference pack
- a 430x932 Core5 placement/layout proof
- a hash-bound `preproduction/manifest.json`

The cutouts/layout/reference pack are **preproduction generator inputs only**. They are not canonical runtime art, cannot set `candidateGenerated`, and cannot satisfy identity/crop/runtime approval by themselves.

The workflow also validates the generated pack and removes disconnected design-board/sprite-sheet debris before upload. This reduces the risk that a generator sees surrounding character-sheet panels or project-status material as part of the desired final composition.

## Acceptance remains unchanged

A later result is not accepted merely because it looks good. It must still be:

- exactly 430x932 PNG at canonical final path
- exactly five foreground humans: Yui / Asa / Nagi / Michiru / Tomori
- identity-matched to locked masters
- no sixth/generic/duplicate human
- no text, logo, UI, dashboard, infographic, watermark, or development label
- title-safe top and button-safe bottom
- crop-reviewed at 360x800 / 390x844 / 430x932
- registered by exact SHA before any Unity/capture/device evidence

`candidateGenerated=false` remains the honest state until such a file is actually committed and registered.
