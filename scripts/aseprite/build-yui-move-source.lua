-- One-time bootstrap: build the hand-final candidate source for Yui move.
--
-- Input  : public/assets/sprites/player/yui_move_32.png (generated-draft seed)
-- Output : assets/source/aseprite/player/yui_move.aseprite (hand-final candidate)
--
-- Usage:
--   aseprite -b public/assets/sprites/player/yui_move_32.png \
--     --script-param out=assets/source/aseprite/player/yui_move.aseprite \
--     --script scripts/aseprite/build-yui-move-source.lua
--
-- Design intent: move must read as the SAME person, SAME lighting, SAME design as
-- the frozen yui_idle hand-final. The pixel edits below mirror build-yui-idle-source.lua
-- exactly (same palette/values), shifted to move's geometry (lean = +1 x, hood at 17,
-- lantern arm extended to the right). Movement is carried by the seed silhouette
-- (stride feet, extended lantern arm, trailing motion streaks); the hand pass only
-- unifies lighting/face/lantern tone with idle.
--
-- Edit scope (hand-final candidate): move face / hood / hair / clothes / lantern /
-- edge rim / foot shadow only. No silhouette change, so the existing inkEdge outline
-- and the runtime hitCore/collision footprint are untouched.

local out = app.params["out"]
if out == nil or out == "" then
  error("missing --script-param out=assets/source/aseprite/player/yui_move.aseprite")
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
local img = Image(sprite.spec)
img:drawImage(cel.image, cel.position)

local function P(x, y, r, g, b, a)
  if a == nil then a = 255 end
  img:drawPixel(x, y, app.pixelColor.rgba(r, g, b, a))
end

-- Palette: IDENTICAL values to build-yui-idle-source.lua (same person / same lighting).
local function ink(x, y)       P(x, y, 8, 7, 19) end
local function hair(x, y)      P(x, y, 75, 38, 48) end
local function hairHi(x, y)    P(x, y, 120, 64, 78) end
local function skinShadow(x, y)P(x, y, 212, 170, 128) end
local function blush(x, y)     P(x, y, 224, 168, 150) end
local function rim(x, y)       P(x, y, 96, 108, 146) end
local function warm(x, y)      P(x, y, 243, 210, 150) end
local function flameWhite(x, y)P(x, y, 255, 244, 196) end
local function flameHot(x, y)  P(x, y, 255, 214, 120) end
local function softShadow(x, y)P(x, y, 8, 7, 19, 70) end

-- 1) Hood brim shade (forehead recess). move skin row 10 = cols 15..19.
skinShadow(15, 10); skinShadow(16, 10); skinShadow(17, 10)
skinShadow(18, 10); skinShadow(19, 10)

-- 2) Cool moon rim on the upper-left of the hood (idle coords +1 x for lean).
rim(12, 4); rim(13, 4); rim(12, 5); rim(11, 6); rim(11, 7); rim(10, 8); rim(10, 9)

-- 3) Hair sheen on both sides.
hairHi(13, 11); hairHi(13, 12); hairHi(21, 11); hairHi(21, 12)

-- 4) Eyes re-centered onto the skin (col 17 = nose bridge), mirroring idle.
hair(14, 13); hair(20, 13); hair(21, 13)
ink(15, 13); ink(16, 13)        -- left eye
ink(18, 13); ink(19, 13)        -- right eye

-- 5) Soft cheeks (low + outer).
blush(15, 15); blush(19, 15)

-- 6) Lantern flame: same bright core/hot treatment as idle, on the extended arm.
flameWhite(24, 19); flameWhite(23, 19); flameHot(25, 18); flameHot(24, 20)

-- 7) Warm lantern spill onto the adjacent apron edge nearest the lantern.
warm(21, 18); warm(21, 19)

-- 8) Soften the outer foot-shadow rim (same ground-contact treatment as idle).
softShadow(5, 28); softShadow(26, 28)
softShadow(6, 29); softShadow(25, 29)
softShadow(9, 30); softShadow(23, 30)

cel.image = img
cel.position = Point(0, 0)

sprite:saveAs(out)
print("built yui move hand-final candidate source: " .. out)
