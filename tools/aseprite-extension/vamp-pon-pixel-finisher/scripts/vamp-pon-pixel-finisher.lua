-- Vamp Pon Pixel Finisher — Aseprite extension entry (SKELETON).
--
-- This is the GUI/menu entry point skeleton for the script-assisted finisher.
-- It is intentionally a thin shell for now; the canonical finishing logic lives
-- in the repo CLI script:
--   scripts/aseprite/vamp-pon-pixel-finisher.lua
--
-- IMPORTANT (read tools/aseprite-extension/README.md +
--            docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md):
--   - This is NOT a GUI hand-finish. Running it does NOT make a sprite
--     `hand-final`. The result is `script-assisted-candidate` at best.
--   - player / main characters STILL require a human review pass (and, for the
--     player, a real human 1px GUI hand-finish) before any production promotion.
--   - It must never write to production paths. This skeleton does not export.
--
-- When fully implemented, this menu item should:
--   1. confirm an active sprite + ask for a finisher `mode` (recipe-aware),
--   2. run the same finishing passes as the CLI script on a *copy*,
--   3. save the result only under assets/source/prototypes/ +
--      public/assets/prototypes/ (never production),
--   4. clearly tag the output as `script-assisted-candidate`.

local sprite = app.activeSprite

local dlg = Dialog{ title = "Vamp Pon Pixel Finisher (skeleton)" }
dlg:separator{ text = "Script-assisted finish — NOT a hand-finish" }
dlg:label{ text = "This raises baseline quality procedurally." }
dlg:label{ text = "Result = script-assisted-candidate, never hand-final." }
dlg:label{ text = "player / main characters still need human review." }
dlg:separator{ text = "Status" }
if sprite == nil then
  dlg:label{ text = "No active sprite. Open a prototype first." }
else
  dlg:label{ text = string.format("Active sprite: %dx%d", sprite.width, sprite.height) }
end
dlg:separator{ text = "How to run the real finisher (for now)" }
dlg:label{ text = "Use the repo CLI (batch), which has the passes + guards:" }
dlg:label{ text = "  pnpm aseprite:pixel-finisher:yui52" }
dlg:label{ text = "or aseprite -b --script-param mode=… --script \\" }
dlg:label{ text = "  scripts/aseprite/vamp-pon-pixel-finisher.lua" }
dlg:separator()
dlg:label{ text = "This menu entry is a skeleton; it does not export." }
dlg:button{ text = "OK" }
dlg:show{ wait = false }
