-- Creates a structured Aseprite source template for Vamp Pon character/pickup/enemy work.
-- This is setup only. It does not create final art.
--
-- Usage:
-- aseprite -b \
--   --script-param out=assets/source/aseprite/player/prototypes/example.aseprite \
--   --script-param size=52 \
--   --script-param name=example \
--   --script scripts/aseprite/create-character-template.lua

local params = app.params or {}
local out = params["out"] or "assets/source/aseprite/player/prototypes/character_template.aseprite"
local size = tonumber(params["size"] or "52") or 52
local name = params["name"] or "character_template"

if size < 8 or size > 256 then
  error("size must be between 8 and 256")
end

local sprite = Sprite(size, size, ColorMode.RGB)
sprite.filename = out

-- Palette: functional slots, not final colors.
local palette = Palette(32)
palette:setColor(0, Color { r = 0, g = 0, b = 0, a = 0 })
palette:setColor(1, Color { r = 23, g = 20, b = 34 }) -- ink outline
palette:setColor(2, Color { r = 39, g = 35, b = 58 }) -- ink shadow
palette:setColor(3, Color { r = 54, g = 61, b = 88 }) -- night blue dark
palette:setColor(4, Color { r = 80, g = 92, b = 124 }) -- night blue mid
palette:setColor(5, Color { r = 124, g = 150, b = 184 }) -- soft blue
palette:setColor(6, Color { r = 228, g = 212, b = 174 }) -- old paper
palette:setColor(7, Color { r = 246, g = 231, b = 190 }) -- paper highlight
palette:setColor(8, Color { r = 196, g = 142, b = 73 }) -- amber shadow
palette:setColor(9, Color { r = 241, g = 184, b = 78 }) -- memory amber
palette:setColor(10, Color { r = 131, g = 72, b = 61 }) -- red brown
palette:setColor(11, Color { r = 176, g = 95, b = 72 }) -- warm accent
palette:setColor(12, Color { r = 232, g = 180, b = 151 }) -- skin
palette:setColor(13, Color { r = 255, g = 222, b = 197 }) -- skin highlight
palette:setColor(14, Color { r = 235, g = 123, b = 128 }) -- cheek / warning accent
palette:setColor(15, Color { r = 255, g = 255, b = 232 }) -- eye/glow highlight
sprite:setPalette(palette)

local names = {
  "bg_check",
  "shadow",
  "outline",
  "feet_or_contact",
  "body_or_support_mass",
  "head_or_main_mass",
  "hair_or_detail",
  "face_detail",
  "prop",
  "fx_glow",
  "notes"
}

-- Rename default layer and append remaining layers.
sprite.layers[1].name = names[1]
for i = 2, #names do
  local layer = sprite:newLayer()
  layer.name = names[i]
end

-- Put simple non-final guide marks on notes/bg layers only.
local bgLayer = sprite.layers[1]
local notesLayer = sprite.layers[#sprite.layers]
local celBg = sprite:newCel(bgLayer, 1)
local bgImage = Image(size, size, ColorMode.RGB)
bgImage:clear(Color { r = 20, g = 22, b = 34, a = 255 })
celBg.image = bgImage
bgLayer.isVisible = false

local celNotes = sprite:newCel(notesLayer, 1)
local noteImage = Image(size, size, ColorMode.RGB)
noteImage:clear(Color { r = 0, g = 0, b = 0, a = 0 })
local center = math.floor(size / 2)
for x = 0, size - 1 do
  if x % 4 == 0 then
    noteImage:putPixel(x, center, Color { r = 255, g = 255, b = 232, a = 160 })
  end
end
for y = 0, size - 1 do
  if y % 4 == 0 then
    noteImage:putPixel(center, y, Color { r = 255, g = 255, b = 232, a = 160 })
  end
end
celNotes.image = noteImage
notesLayer.isVisible = false

-- Tags are organizational hints for future animation work.
local tag = sprite:newTag(1, 1)
tag.name = name .. "_master"
tag.color = Color { r = 124, g = 150, b = 184 }

sprite:saveAs(out)
app.alert("Created Vamp Pon Aseprite template: " .. out)
