-- One-time bootstrap: build the hand-final candidate source for Yui idle.
--
-- Input  : public/assets/sprites/player/yui_idle_32.png (generated-draft seed)
-- Output : assets/source/aseprite/player/yui_idle.aseprite (hand-final candidate)
--
-- Usage:
--   aseprite -b public/assets/sprites/player/yui_idle_32.png \
--     --script scripts/aseprite/build-yui-idle-source.lua \
--     --script-param out=assets/source/aseprite/player/yui_idle.aseprite
--
-- After this runs once, the .aseprite is the source of truth. Re-running it on an
-- already-exported (improved) PNG would re-apply edits on top of edits, so treat
-- this as a documented bootstrap, not a repeatable build step.
--
-- Edit scope (hand-final candidate): idle face / hood / hair / clothes / lantern /
-- edge rim / foot shadow only. No silhouette change, so the existing inkEdge
-- outline and the runtime hitCore/collision footprint are untouched.

local out = app.params["out"]
if out == nil or out == "" then
  error("missing --script-param out=assets/source/aseprite/player/yui_idle.aseprite")
end
if string.sub(out, -9) ~= ".aseprite" then
  error("output must be a .aseprite: " .. out)
end

local sprite = app.activeSprite
if sprite == nil then
  error("no active sprite; run aseprite -b <seed.png> first")
end
if sprite.width ~= 32 or sprite.height ~= 32 then
  error("expected 32x32 seed, got " .. sprite.width .. "x" .. sprite.height)
end

sprite:flatten()
local cel = sprite.cels[1]

-- Composite the seed onto a full-canvas image so edits use absolute coordinates.
local img = Image(sprite.spec)
img:drawImage(cel.image, cel.position)

local function P(x, y, r, g, b, a)
  if a == nil then a = 255 end
  img:drawPixel(x, y, app.pixelColor.rgba(r, g, b, a))
end

-- Palette extensions (kept close to the existing Yui paper-night palette).
local function ink(x, y)       P(x, y, 8, 7, 19) end       -- eye ink
local function hair(x, y)      P(x, y, 75, 38, 48) end     -- base hair
local function hairHi(x, y)    P(x, y, 120, 64, 78) end    -- hair sheen
local function skinShadow(x, y)P(x, y, 212, 170, 128) end  -- under-brim shade
local function blush(x, y)     P(x, y, 224, 168, 150) end  -- soft cheek
local function rim(x, y)       P(x, y, 96, 108, 146) end   -- cool moon rim
local function warm(x, y)      P(x, y, 243, 210, 150) end  -- lantern spill on apron
local function flameWhite(x, y)P(x, y, 255, 244, 196) end  -- lantern core
local function flameHot(x, y)  P(x, y, 255, 214, 120) end  -- lantern hot
local function softShadow(x, y)P(x, y, 8, 7, 19, 70) end   -- faded foot-shadow rim

-- 1) Hood brim shade: recess the forehead under the hood opening.
skinShadow(14, 10); skinShadow(15, 10); skinShadow(16, 10)
skinShadow(17, 10); skinShadow(18, 10)

-- 2) Cool moon rim on the upper-left of the hood (separates her from night bg).
rim(11, 4); rim(12, 4); rim(11, 5); rim(10, 6); rim(10, 7); rim(9, 8); rim(9, 9)

-- 3) Hair sheen on both sides.
hairHi(12, 11); hairHi(12, 12); hairHi(20, 11); hairHi(20, 12)

-- 4) Eyes re-centered onto the skin (was sitting on the hair edge).
hair(13, 13); hair(19, 13); hair(20, 13)
ink(14, 13); ink(15, 13)        -- left eye
ink(17, 13); ink(18, 13)        -- right eye  (col 16 stays skin = nose bridge)

-- 5) Soft cheeks (kept low and outer, away from eyes/mouth).
blush(14, 15); blush(18, 15)

-- 6) Lantern flame: brighter core + a couple of hot pixels (her signature light).
flameWhite(20, 19); flameWhite(21, 19); flameWhite(20, 20)
flameHot(22, 20); flameHot(21, 21)

-- 7) Warm lantern spill onto the adjacent apron (lower-right under-light).
warm(18, 20); warm(18, 21)

-- 8) Soften the outer foot-shadow rim so it reads as ground contact, not a puddle.
softShadow(5, 28); softShadow(26, 28)
softShadow(6, 29); softShadow(25, 29)
softShadow(9, 30); softShadow(23, 30)

cel.image = img
cel.position = Point(0, 0)

sprite:saveAs(out)
print("built yui idle hand-final candidate source: " .. out)
