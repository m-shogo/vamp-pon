# Pixel Art Pitfalls

This guide lists weak patterns to avoid when making Vamp Pon pixel art.

It applies to player characters, enemies, pickups, UI icons, props, effects, and background tiles.

## 1. Dominant blob shape

Problem:

- One large mass dominates the whole sprite.
- Secondary parts such as face, body, legs, prop, or readable detail disappear.
- The asset reads as a blob instead of a designed object.

Fix:

- Split the silhouette into main mass, support mass, and accent.
- Keep a clear focal point.
- Add small but readable structural parts.
- Check the asset as a black silhouette before adding color.

## 2. Script-shaped art

Problem:

- The sprite looks like clean geometry, not crafted pixel art.
- Shadows look mechanical.
- Curves look like simple ovals or rectangles.

Fix:

- Add small hand-made asymmetry.
- Use color clusters, not mechanical bands.
- Finish focal points at pixel level.
- Treat script output as setup, not final art.

## 3. Weak focal point

Problem:

- The asset is readable, but not memorable.
- A character has no charming face.
- An enemy has no distinct threat shape.
- A pickup is just a colored dot.

Fix:

- Decide the focal point before polishing.
- Preserve enough pixels for the focal point.
- Use a tiny highlight, cutout, eye, symbol, or silhouette accent.
- Remove secondary noise that competes with it.

## 4. Floating prop or effect

Problem:

- A prop, light, weapon, or glow looks detached.
- It can be confused with gameplay markers.

Fix:

- Connect props to the body or source object.
- Separate decorative glow from hit indicators.
- Keep glow weaker than gameplay-critical markers.
- Check in combat mock.

## 5. Placeholder body

Problem:

- A body, enemy, prop, or icon is just a triangle, circle, or rectangle.
- It works as a blockout but has no character.

Fix:

- Add one readable asymmetry.
- Add a small edge, fold, cut, handle, eye, crack, ribbon, or mark.
- Keep the shape simple, but not generic.

## 6. Pixel noise

Problem:

- Too many isolated pixels make the sprite muddy.
- Texture hides the actual shape.

Fix:

- Use readable color clusters.
- Avoid dithering on tiny faces, icons, and pickups.
- Use texture mostly for background or larger surfaces.
- Remove isolated pixels unless they are intentional highlights.

## 7. Heavy outline

Problem:

- The sprite becomes too hard and loses the soft picture-book feel.
- The outline becomes more visible than the design.

Fix:

- Use dark purple or navy instead of pure black.
- Weaken outline on lit sides.
- Avoid outlining every edge with the same strength.
- Use selective outline where readability needs it.

## 8. Muddy palette

Problem:

- Colors are close in value and blend together.
- The asset disappears on dark background.
- The asset competes with pickups or effects.

Fix:

- Check grayscale value separation.
- Limit each part to base / shadow / highlight.
- Reserve warm bright colors for important lights and pickups.
- Test on the actual gameplay background.

## 9. Good at one scale only

Problem:

- 1x is readable but enlarged view looks rough.
- 4x looks charming but 1x gameplay is muddy.

Fix:

- Check 1x / 4x / 6x / dark background / combat mock.
- Do not promote if any core view fails.

## 10. Report-only improvement

Problem:

- The report sounds good, but before/after does not show real visual improvement.
- The asset claims polish, but the pixels barely changed.

Fix:

- Require before/after review.
- Keep weak work as draft.
- Do not promote assets below the quality gate.

## Final rule

Do not promote the asset if any of these are true:

- script output only.
- no before/after.
- public PNG changed without source/export proof.
- role clarity is weak.
- visual appeal is weak.
- 1x readability is weak.
- review doc is missing.
- status is temporary / draft / rejected.
