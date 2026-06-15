-- One-time bootstrap: build the hand-final candidate source for Yui hurt.
--
-- Input  : public/assets/sprites/player/yui_hurt_32.png (generated-draft seed)
-- Output : assets/source/aseprite/player/yui_hurt.aseprite (hand-final candidate)
--
-- Usage:
--   aseprite -b public/assets/sprites/player/yui_hurt_32.png \
--     --script-param out=assets/source/aseprite/player/yui_hurt.aseprite \
--     --script scripts/aseprite/build-yui-hurt-source.lua
--
-- Design intent: hurt must read as the SAME person, SAME lighting, SAME design as
-- the frozen yui_idle / yui_move hand-finals, showing only a MOMENTARY flinch.
-- The seed already encodes the hit (recoil lean = -1, impact sparks, reddish dress).
-- The seed's heavy solid red band across the eyes is too strong / erases her face,
-- so the hand pass replaces it with a restrained pained expression (winced eyes +
-- soft cheek flush) and unifies lighting (moon rim / hair sheen / lantern / foot
-- shadow) with idle & move. No big deformation, no over-red, no new character.
--
-- Edit scope (hand-final candidate): hurt face / hood / hair / clothes / lantern /
-- edge rim / foot shadow only. No silhouette change, so the inkEdge outline and the
-- runtime hitCore/collision footprint (incl. recoil + spark silhouette) are untouched.

local out = app.params["out"]
if out == nil or out == "" then
  error("missing --script-param out=assets/source/aseprite/player/yui_hurt.aseprite")
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

-- Palette: same shared values as idle/move, plus a restrained pain flush.
local function ink(x, y)       P(x, y, 8, 7, 19) end
local function skin(x, y)      P(x, y, 242, 204, 162) end
local function hair(x, y)      P(x, y, 75, 38, 48) end
local function hairHi(x, y)    P(x, y, 120, 64, 78) end
local function skinShadow(x, y)P(x, y, 212, 170, 128) end
local function painFlush(x, y) P(x, y, 198, 118, 112) end  -- soft, NOT a wound red
local function rim(x, y)       P(x, y, 96, 108, 146) end
local function warm(x, y)      P(x, y, 243, 210, 150) end
local function flameWhite(x, y)P(x, y, 255, 244, 196) end
local function flameHot(x, y)  P(x, y, 255, 214, 120) end
local function softShadow(x, y)P(x, y, 8, 7, 19, 70) end

-- hurt geometry: lean = -1, hood/face centered on col 15.

-- 1) Replace the heavy red eye-band (row 13) with the real face shape + winced eyes.
--    Rebuild row 13 as skin(13-17) / hair(12,18,19), nose at 15.
hair(12, 13); skin(13, 13); skin(15, 13); skin(17, 13); hair(18, 13); hair(19, 13)
--    Pained "><" eyes: each eye is a short downward slash (brow above, inner-bottom).
ink(13, 12); ink(14, 13)        -- left eye  \
ink(17, 12); ink(16, 13)        -- right eye /

-- 2) Hood brim shade (forehead recess). hurt skin row 10 = cols 13..17.
skinShadow(13, 10); skinShadow(14, 10); skinShadow(15, 10)
skinShadow(16, 10); skinShadow(17, 10)

-- 3) Cool moon rim on the upper-left of the hood (idle coords -1 x for recoil lean).
rim(10, 4); rim(11, 4); rim(10, 5); rim(9, 6); rim(9, 7); rim(8, 8); rim(8, 9)

-- 4) Hair sheen on both sides.
hairHi(11, 11); hairHi(11, 12); hairHi(19, 11); hairHi(19, 12)

-- 5) Restrained pain flush on the cheeks (low + outer), keeping the existing wince mouth.
painFlush(13, 15); painFlush(17, 15)

-- 6) Lantern flame: same bright core/hot treatment as idle/move.
flameWhite(20, 19); flameWhite(20, 20); flameHot(22, 20); flameHot(21, 21)

-- 7) Warm lantern spill onto the adjacent apron.
warm(18, 19); warm(18, 20)

-- 8) Soften the outer foot-shadow rim (same ground-contact treatment as idle/move).
softShadow(5, 28); softShadow(26, 28)
softShadow(6, 29); softShadow(25, 29)
softShadow(9, 30); softShadow(23, 30)

cel.image = img
cel.position = Point(0, 0)

sprite:saveAs(out)
print("built yui hurt hand-final candidate source: " .. out)
