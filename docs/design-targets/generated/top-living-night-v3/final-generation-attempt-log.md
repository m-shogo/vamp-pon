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

## Rejected failure mode — raw bridge as generator-facing reference

The V2 bridge remains a strong **engineering composition reference**, but visual audit showed that it contains six non-Core5/generic human figures. Passing that raw image into a generative model creates a direct risk of inheriting the elderly bridge man, another generic traveler, duplicated identities, or a sixth foreground human.

An initial attempt to derive a generator-safe plate from the 17 V2 layers also exposed that the layer kit is not a complete clean-background reconstruction: the detailed town/rail depth comes from the source composition rather than from a single fully populated environment layer.

The current remediation therefore keeps the raw bridge out of the model-facing artifact. A preproduction sanitizer uses the bridge only inside CI, removes the full old-human regions using broad geometry plus `05-distant-companion` / `06-characters` alpha as alignment aids, then restores only explicitly allowed non-human fire / animal+robot / foreground accents. The raw 05/06 human pixels are never composited back into the generator-facing result.

## Locked generator-facing remediation

Use the isolated visual-only authority:

`docs/design-targets/generated/top-living-night-v3/final-key-art-isolated-prompt.txt`

Use the **TOP Art Preproduction** artifact from the current candidate branch as the clean visual-input bundle. Preferred visual inputs are:

- `preproduction/core5-clean-composition-plate-v1.png` — primary composition/environment input; human-sanitized derivative, 430x932
- `preproduction/core5-yui-fullbody-cutout-v1.png`
- `preproduction/core5-asa-fullbody-cutout-v1.png`
- `preproduction/core5-nagi-fullbody-cutout-v1.png`
- `preproduction/core5-michiru-fullbody-cutout-v1.png`
- `preproduction/core5-tomori-fullbody-cutout-v1.png`
- `preproduction/core5-clean-generation-reference-pack-v1.png` — convenience combined reference
- `preproduction/core5-layout-proof-v1.png` — blocking/scale/depth guide only, not a final-style target
- `preproduction/manifest.json` — hash/dimension/provenance authority for the generated-only pack

The five locked character masters from `core5-reference-manifest.json` remain the identity authority, but the generated transparent cutouts are preferred when a model accepts image references because they remove surrounding character-board labels/panels.

**Do not use as image-generation inputs:**

- raw V2 bridge `top-living-night-layered-candidate-430x932.png`
- `05-distant-companion.png`
- `06-characters.png`
- any `diagnostics/*` image, including layer contact sheets and human-removal masks
- PR status, CI output, evidence tables, implementation roadmaps, review dashboards, or development screenshots

The raw bridge can still be inspected by engineers when judging composition history, but it is no longer a model-facing visual source.

The full prompt remains useful for engineering/review context, but the isolated prompt is the preferred generator-facing text because it contains no project-status narrative.

### Clean generator-input artifact

The `TOP Art Preproduction` workflow builds the generated-only artifact above and keeps diagnostics in a **separate artifact**. The workflow is read-only and cannot commit, register, approve, or promote final/runtime state.

The generated cutouts/layout/reference pack are **preproduction generator inputs only**. They are not canonical runtime art, cannot set `candidateGenerated`, and cannot satisfy identity/crop/runtime approval by themselves.

The workflow validates PNG dimensions/hashes, the locked Core5 reference set, preproduction-only authority, cutout alpha quality, the sanitized composition source policy, and generator-vs-diagnostic artifact isolation before upload.

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
