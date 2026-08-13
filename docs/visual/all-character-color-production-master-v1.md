# All Character Color Production Master v1

Status: `CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION`

## Purpose

Lock character color behavior for all 36 production characters without inventing palette canon that does not already exist.

The cast is intentionally split by source certainty:

- **Current21:** exact source-locked `themeColor`, `accentColor`, and `starBeastTheme` from `src/game/data/characterThemeColors.ts`.
- **Future15:** no exact per-character theme HEX source is assumed. Color behavior is conservatively derived from the loaded Living Visual Profile and existing body/species identity. Exact palette values remain unresolved unless another higher authority provides them.
- **Core5:** `data/visual/core5-color-application-master-v1.json` remains the stronger dedicated application authority and overrides generic placement behavior while preserving the same exact source HEX values.

## Core principle

Color supports identity; it does not create identity by itself.

A character must remain recognizable when:

- accent color is removed,
- emitted light is removed,
- Star Beast color is hidden,
- the image is viewed in grayscale,
- night lighting shifts local value/temperature within physically plausible limits.

## Color channels

Keep these channels separate:

1. body identity color — skin / fur / shell / hair / eye where source-backed
2. garment base color
3. garment support/neutral color
4. character theme color
5. accent color
6. Star Beast color
7. prop material color
8. emitted light color
9. reflected environment light
10. dirt / wear / repair coloration

One channel must not silently overwrite another.

## Current21 exact color lock

For a Current21 character, load the exact `CharacterThemeColor` entry.

Do not:

- alter the HEX because another color looks more premium,
- make the theme HEX cover every garment surface,
- use the accent HEX as universal piping/rim/glow,
- turn the Star Beast HEX into an automatic third costume main color,
- recolor skin/hair/body identity to harmonize with the theme,
- infer matching outfits from a shared Star Beast palette family,
- change a shared Star Beast color into shared character main colors.

The source notes are design context. They do not authorize unrelated ornament or story canon.

## Future15 color boundary

Future15 receives `AUTHOR_CANDIDATE_DERIVED` color constraints from Living Visual only.

Allowed derivation:

- preserve explicit skin/fur/shell/body color identity,
- preserve explicit color likes/dislikes if present,
- preserve clothing material/value behavior,
- preserve social-presentation and anti-stereotype boundaries,
- preserve `absoluteNever` color-related prohibitions,
- use ordinary neutrals only where needed to render an unresolved garment without asserting a signature palette.

Forbidden derivation:

- inventing a signature theme HEX,
- assigning a Star Beast palette where none exists,
- making brown skin imply earth/gold/tribal palettes,
- making feminine presentation imply pink/pastel,
- making gender ambiguity imply monochrome/androgynous black,
- making artificial characters cyan/neon by default,
- making dogs/cats fantasy-colored,
- making disability equipment a theme-color accessory,
- treating sexuality as a palette generator.

Any exact Future15 palette proposal remains exploratory or author-candidate until separately approved.

## Star Beast separation

Star Beast color is a separate design channel.

It may appear only when the Star Beast or its source-backed visual relation is actually present. It must not automatically become:

- garment trim,
- jewelry,
- eye glow,
- hair streak,
- weapon glow,
- aura,
- UI-like edge light,
- third main color.

Shared Star Beast palette families represent only the source-backed shared color relation documented in `characterThemeColors.ts`; they do not authorize costume matching or unconfirmed relationship meaning.

## Night / world interaction

The All Character Night / Light Rendering Master remains authoritative for physical light behavior.

Night may change local perceived value, saturation and temperature, but it may not:

- replace the character palette with navy/black,
- bleach skin,
- brighten dark skin for readability,
- turn pale colors self-luminous,
- add cyan/violet rim by default,
- convert reflected color into emitted glow,
- erase subtle theme/accent distinction,
- make all cast members share one cinematic grade.

Use material response and local light source, not a universal mood filter.

## Value hierarchy

Color production must still work in grayscale.

Check:

- face/body remains readable from clothing,
- prop remains locatable without saturation,
- lightest/darkest masses are not identical across the whole cast by template,
- white/gray/black palettes rely on material and value structure rather than added saturated premium accents,
- dark palettes retain internal material separation without glowing outlines.

## Detail density

Higher resolution may reveal:

- weave color variation,
- faded seams,
- actual repair thread,
- soot/dirt/weathering,
- material-specific reflection,
- existing small accent placement.

Higher resolution may not invent:

- new accent colors,
- gradient hair,
- multicolor eyes,
- glowing trim,
- gold edge treatment,
- extra colored straps/belts,
- magical color bloom,
- new symbolic palette layers.

## Color and worldbuilding

Yoru no Shirube world vocabulary should affect color through believable material and light:

- old paper yellows/greys through age and handling,
- ink absorbs and fades according to substrate,
- metal reflects actual nearby sources,
- repaired fabric may differ because replacement material differs,
- soot and dust collect where use supports it.

Do not paste world identity by giving everyone the same midnight-blue + gold palette.

## Generation gate

Before candidate image generation:

- resolve source class: Current21 exact vs Future15 candidate-derived,
- load the Current21 exact color record when one exists,
- load Core5 dedicated Color Application Master when applicable,
- preserve body/species identity colors independently from theme palette,
- keep Star Beast color separate,
- confirm emitted vs reflected light separation,
- confirm no unsupported color concept was added,
- confirm night/world rendering does not overwrite identity palette,
- confirm grayscale/value readability,
- confirm unresolved Future15 exact palette remains unresolved rather than invented.

Generated color accidents never create canon.
