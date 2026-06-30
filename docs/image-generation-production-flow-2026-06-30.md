# Image Generation Production Flow 2026-06-30

This is the single entry point for AI image generation, transparency processing, QA, and Unity handoff.

## Scope

Use this flow for:

- character candidates
- enemy candidates
- item / weapon / passive / rare candidates
- pickup candidates
- VFX source images
- character climax cut-in source art
- 黒耀化 full-screen / collection art source
- TOP / UI visual target candidates

Do not use this flow as permission to bulk-generate every asset at once.

## Required read order

Before any image generation or image finishing work, read:

```txt
docs/title-and-term-lock-2026-06-30.md
docs/design-source-of-truth-2026-06-30.md
docs/current-visual-targets-2026-06-30.md
docs/ai-image-greenback-transparency-rule-2026-06-30.md
docs/greenback-to-alpha-tool.md
```

## Fixed project rules

```txt
Official title: ヨルノシルベ
Term: 黒耀化
Code names only: Vamp Pon / vanp pon / ヴァンサバ改
```

Do not use `黒曜化` in new work.

## Unity asset creation rule

Unity work is not a simple migration of Web / Phaser assets.

Existing Web assets, prototype sprites, generated references, and screenshots are reference material only unless a task explicitly says they are temporary placeholders.

Use existing Web/prototype assets only for:

```txt
checking character identity
checking silhouette
checking color/world direction
comparing against the previous baseline
avoiding a regression from the existing design
```

Do not treat them as production Unity runtime assets.

Unity runtime candidates must be created or finished for Unity use:

```txt
SpriteRenderer / UI Image / Particle / VFX source ready
PPU / scale / pivot / sorting layer considered
readable at gameplay size
readable on 390x844 / 360x800 / 430x932
correct alpha
clean bounds
no green fringe
no edge touch
atlas / prefab use considered
```

Forbidden:

```txt
copying Web PNGs into Unity and calling them production assets
matching old Web assets only because they already exist
being constrained by old 52px-only assumptions
using text-baked screenshots as runtime UI
pasting a finished screen image into Unity as UI
calling an image Unity-ready only because it displays in the Editor
```

Correct direction:

```txt
Web assets = reference and comparison baseline
Codex image generation = Unity-oriented candidate creation
greenback-to-alpha = transparency finishing
Unity import = sprite / UI part / VFX source proof
review doc = why it is Unity-ready, what changed from Web, and what remains unfinished
```

If an output is just a Web/prototype copy or not suitable for Unity gameplay readability, revise it. Do not approve it.

Yui / Ombu / VFX / UI material do not need to be identical to the Web version. Improve shape, proportion, texture, margin, and scale when that makes the Unity version more readable, more flexible, or more production-like.

Still preserve:

```txt
Yui identity
Ombu identity
night / memory / black ink / small warm light / paper feeling
ヨルノシルベ title and term rules
mobile portrait readability
```

## Current visual references

Use these as current visual targets:

```txt
docs/design-targets/generated/top-final.png
docs/design-targets/generated/kokuyou-cutin-final.png
```

For character reference:

```txt
public/assets/prototypes/sprite-sheets/core5-original-frames/
assets/reference/character-master/core5/
```

For enemy reference:

```txt
public/assets/prototypes/sprite-sheets/enemies-original/
```

For screen/UI direction:

```txt
docs/final-screen-comparison-review-2026-06-29.md
docs/non-battle-final-design-implementation-plan.md
docs/design-targets/generated/
```

## Generation prompt defaults

Prefer:

```txt
night
memory
forgotten things
black ink
small warm light
paper fragments
storybook paper texture
soft matte look
morning after darkness
```

Avoid:

```txt
generic Unity prototype
hard sci-fi laser look
excessive neon
excessive rainbow color
shiny mobile-gacha gold look
glossy 3D plastic look
plain circle-only effects
text inside image
white background / checkerboard / watermark
```

## Transparency rule

Do not rely on direct transparent background generation.

When a transparent asset is needed, prompt for:

```txt
solid chroma key green background
no white background
no checkerboard background
no text
no watermark
```

Avoid green colors on the subject itself. Green clothing, green light, green glow, or green effects can be removed during chroma-key processing.

## Greenback to alpha process

Use the shared script. Do not create one-off conversion scripts.

Setup once:

```sh
cd /Users/m-shogo/Developer/personal/vamp-pon
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Single file:

```sh
source .venv/bin/activate
pnpm greenback:alpha -- --input path/to/input.png --output path/to/output.png --json
```

Batch:

```sh
source .venv/bin/activate
pnpm greenback:alpha -- --dir path/to/greenback-images --out-dir path/to/alpha-images
```

If the generated green is not exact:

```sh
pnpm greenback:alpha -- --input input.png --output output.png --tolerance 88 --soft-edge 32 --json
```

## QA checklist before approval

A generated / processed image is not approved just because it looks transparent in preview.

Check:

```txt
real alpha channel
clean edges
no green fringe
no green spill remains
subject does not touch canvas edge
readable at gameplay size
consistent silhouette
consistent scale with related assets
no text baked into image unless explicitly approved
no watermark
```

For 180x180 asset cells:

```txt
canvas/cell is 180 x 180 px
subject does not fill all 180 px
transparent room remains for silhouette, motion, glow, and effects
no opaque pixel, glow, shadow, accessory, or effect touches the cell edge
```

For cut-in / collection art:

```txt
full-screen illustration / full-screen cut-in source
also usable as Collection/archive art
no UI text baked into the image
Unity/TMP layers handle UI text
```

## Unity handoff rule

Existing web/prototype assets may be used as reference, but production Unity runtime assets need Unity-ready finishing.

Before Unity import, verify:

```txt
correct alpha
clean bounds
correct PPU / scale plan
pivot plan
sorting/layer plan
readability at actual gameplay size
safe margins for UI or cut-in use
```

Do not import or commit massive batches without QA.

## Commit rules

Do commit:

```txt
approved source image candidates
processed transparent PNGs only when needed
QA docs / review docs
script improvements to scripts/assets/greenback_to_alpha.py
manifest or import notes
```

Do not commit:

```txt
.venv/
tmp/
one-off scripts
failed generations unless explicitly needed for comparison
Library/
Temp/
Obj/
Build/
Builds/
Logs/
UserSettings/
*.sln
*.csproj
```

## Current verified tooling

The shared greenback tool has been locally verified.

```txt
script: scripts/assets/greenback_to_alpha.py
command: pnpm greenback:alpha
python dependency: Pillow from requirements.txt
verified dummy input: 180x180 greenback PNG
verified output: RGBA transparent PNG
greenSpillRemainingPixels: 0
edgeTouches: false
```

## Recommended next asset order

Generate and finish in small batches:

```txt
1. Yui Unity candidate
2. Ombu Unity candidate
3. EXP fragment / lantern spark / ink burst / collect trail
4. 黒耀化 full-screen / collection art
5. character climax full-screen / collection art
```

Do not generate every character, every enemy, every item, or every stage at once.
