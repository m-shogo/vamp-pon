-- Exports review-only previews from the active Aseprite source.
-- This script must never write to production sprite paths.
--
-- Usage:
-- aseprite -b source.aseprite \
--   --script-param outDir=public/assets/sprites/player/prototypes/reviews/example \
--   --script scripts/aseprite/export-character-previews.lua

local params = app.params or {}
local outDir = params["outDir"] or "public/assets/sprites/player/prototypes/reviews/character"

local forbidden = {
  "public/assets/sprites/player/yui_idle_42.png",
  "public/assets/sprites/player/yui_move_42.png",
  "public/assets/sprites/player/yui_hurt_42.png",
  "public/assets/sprites/player/yui_ultimate_42.png"
}

for _, path in ipairs(forbidden) do
  if outDir == path then
    error("Preview export cannot target production path: " .. outDir)
  end
end

local sprite = app.activeSprite
if not sprite then
  error("No active sprite. Open a .aseprite source before running preview export.")
end

local originalPath = outDir .. "/original.png"
local sheetPath = outDir .. "/sheet.png"
local gifPath = outDir .. "/preview.gif"

-- Ensure hidden check layers do not leak into default preview if their names match bg/notes.
local hidden = {}
for _, layer in ipairs(sprite.layers) do
  if layer.name == "bg_check" or layer.name == "notes" then
    hidden[layer] = layer.isVisible
    layer.isVisible = false
  end
end

sprite:saveCopyAs(originalPath)

-- Best-effort sheet / gif export. Different Aseprite builds can vary, so keep this review-only.
pcall(function()
  app.command.ExportSpriteSheet {
    ui = false,
    type = SpriteSheetType.HORIZONTAL,
    textureFilename = sheetPath,
    dataFormat = SpriteSheetDataFormat.JSON_HASH,
    dataFilename = outDir .. "/sheet.json",
    trimSprite = false,
    trim = false,
    ignoreEmpty = false,
  }
end)

pcall(function()
  app.command.SaveFileCopyAs { filename = gifPath }
end)

for layer, wasVisible in pairs(hidden) do
  layer.isVisible = wasVisible
end

app.alert("Exported review previews to: " .. outDir)
