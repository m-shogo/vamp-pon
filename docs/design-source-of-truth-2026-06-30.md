# Design Source of Truth 2026-06-30

Codex / Claude Code must read this file before any design-related work.

## Read order

1. Title / term lock
2. Current visual targets
3. AI image greenback transparency rule
4. Character reference
5. Opponent reference
6. Screen / UI design reference
7. Unity verification screenshots

## Title / term lock

Use:

```txt
docs/title-and-term-lock-2026-06-30.md
```

Current title:

```txt
ヨルノシルベ
```

## Current visual targets

Use:

```txt
docs/current-visual-targets-2026-06-30.md
```

Current key images:

```txt
docs/design-targets/generated/top-final.png
docs/design-targets/generated/kokuyou-cutin-final.png
```

## AI image greenback transparency rule

Use:

```txt
docs/ai-image-greenback-transparency-rule-2026-06-30.md
```

Current default:

```txt
solid chroma key green background
then remove green background
then export transparent PNG
then inspect alpha and edge fringe
```

Do not rely on direct transparent background generation for new asset candidates.

## Character reference

Use this path:

```txt
public/assets/prototypes/sprite-sheets/core5-original-frames/
```

Purpose:

- Check the Core5 silhouettes.
- Use as reference for Yui / Asa / Nagi / Michiru / Tomori.
- Do not approve these files as final Unity production assets.

## Opponent reference

Use this path:

```txt
public/assets/prototypes/sprite-sheets/enemies-original/
```

Purpose:

- Check Ombu / Omburo direction.
- Use as reference for soft black-ink shadow shapes.
- Do not approve these files as final Unity production assets.

## Screen / UI design reference

Read in this order:

```txt
docs/final-screen-comparison-review-2026-06-29.md
docs/non-battle-final-design-implementation-plan.md
docs/design-targets/generated/
```

Purpose:

- Check TOP / StageSelect / Result / Collection / LevelUp / Cutin / Battle HUD direction.
- Use these as screen direction references.
- Do not paste text-baked screenshots directly as Unity runtime UI.

## Unity verification screenshots

Use only as technical evidence:

```txt
docs/design-targets/generated/unity-u1-2/
docs/design-targets/generated/unity-u2/
docs/design-targets/generated/unity-u3/
```

These screenshots are not final visual design.

## Retired / old source rule

Do not use these as the latest design source unless explicitly instructed:

```txt
public/assets/sprites/
old runtime sprite references
old 52px-only screen decisions
rejected or temporary reference images
text-baked UI screenshots as runtime UI
```

`public/assets/sprites/` is retired for Unity work.

## Full-screen collection art rule

Character climax art and 黒耀化 art must be treated as full-screen illustrations / full-screen cut-ins.

They must also be collectible art for Collection / archive pages.

Expected types:

```txt
climax_cutin
kokuyou_fullscreen
collection_art
```

Text must not be baked into these images. UI text should be layered in Unity with TMP.

## Generation priority

1. Battle visual target
2. HUD / UI kit
3. Yui Unity candidate
4. Ombu Unity candidate
5. EXP fragment / lantern spark / ink burst / collect trail candidate
6. Character climax full-screen art candidate
7. 黒耀化 full-screen art candidate

Do not generate every character, every opponent, or every stage at once.

## Style direction

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
