-- Vamp Pon Aseprite export helper.
-- Usage example:
-- aseprite -b assets/source/aseprite/player/yui_idle.aseprite \
--   --script scripts/aseprite/export-vamp-assets.lua \
--   --script-param out=public/assets/sprites/player/yui_idle_32.png

local out = app.params["out"]
if out == nil or out == "" then
  error("missing --script-param out=public/assets/sprites/player/...png")
end

if string.sub(out, 1, string.len("public/assets/sprites/player/")) ~= "public/assets/sprites/player/" then
  error("refusing to export outside public/assets/sprites/player/: " .. out)
end

if string.sub(out, -4) ~= ".png" then
  error("export target must be a .png: " .. out)
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

print("exported player sprite: " .. out)
