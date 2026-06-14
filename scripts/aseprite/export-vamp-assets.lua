-- Vamp Pon Aseprite export helper.
-- Usage example:
-- aseprite -b assets/source/aseprite/yui_idle.aseprite \
--   --script scripts/aseprite/export-vamp-assets.lua \
--   --script-param out=public/assets/sprites/player/yui_idle_32.png

local out = app.params["out"]
if out == nil or out == "" then
  error("missing --script-param out=public/assets/sprites/...png")
end

local sprite = app.activeSprite
if sprite == nil then
  error("no active sprite; run aseprite -b <source.aseprite> first")
end

app.command.ExportSpriteSheet {
  ui = false,
  askOverwrite = false,
  type = SpriteSheetType.HORIZONTAL,
  textureFilename = out,
  dataFormat = SpriteSheetDataFormat.JSON_HASH,
  filenameFormat = "{title}_{frame}",
  borderPadding = 0,
  shapePadding = 0,
  innerPadding = 0,
  trimSprite = false,
  trim = false,
}
