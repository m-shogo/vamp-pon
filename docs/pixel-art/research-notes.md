# Pixel Art Research Notes

Research notes used to adapt general pixel-art practices to Vamp Pon.

## Sources consulted

- Lospec Pixel Art Beginner Tutorials
  - Useful because it indexes beginner topics including lines, colors, anti-aliasing, dithering, clusters, selective outlining, character sprites, and animation.
  - URL: https://lospec.com/pixel-art-tutorials/tags/beginner

- Pixel art overview
  - Useful for the principle that pixel art depends on deliberate pixel placement, limited color use, clusters, anti-aliasing, dithering, and individual pixel control.
  - URL: https://en.wikipedia.org/wiki/Pixel_art

- Aseprite overview
  - Useful for confirming Aseprite's role as a pixel-art and animation editor with layers, frames, palette tools, preview, CLI, and Lua scripting.
  - URL: https://en.wikipedia.org/wiki/Aseprite

- Dithering overview
  - Useful for understanding that dithering can reduce banding, but may add pattern/noise artifacts.
  - URL: https://en.wikipedia.org/wiki/Dither

- Jaggies overview
  - Useful for understanding stair-step artifacts on raster curves and lines.
  - URL: https://en.wikipedia.org/wiki/Jaggies

- Research on generated character sprite sheets
  - Useful as a caution: sprite sheet creation is iterative and consistency across poses is hard, so automated generation should remain draft/reference until reviewed.
  - URL: https://arxiv.org/abs/2208.06413

## Vamp Pon interpretation

General pixel-art guidance is not enough. Vamp Pon needs a narrower rule set:

- Yui is not just a game asset; she is the player-facing identity.
- 1x gameplay readability and 4x/6x character appeal must both pass.
- Script output is acceptable for setup, but not for final character charm.
- Use clusters and clean silhouettes before adding small details.
- Avoid noisy dithering on tiny faces and costumes.
- Keep lantern, hood, face, and costume as repeatable identity anchors.

## Practical takeaways

1. Start with silhouette and proportion.
2. Build the face early.
3. Use clusters instead of scattered pixels.
4. Use a limited palette with clear value separation.
5. Use manual AA sparingly.
6. Avoid dithering on tiny player faces.
7. Use Aseprite GUI for final pixel-level decisions.
8. Use scripts only for setup, export, sprite sheets, previews, or review automation.
9. Always require before/after images.
10. Never promote a draft just because it exists.
