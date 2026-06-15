-- Prototype bootstrap: build the 32px high-density redesign of Yui idle (v3).
--
-- Output : assets/source/aseprite/player/prototypes/yui_idle_v3.aseprite
--
-- This is a FROM-SCRATCH 32px redesign (not a downscaled reference image): a cuter,
-- bigger-headed chibi with a round blue hood, gold moon rim, brown/red bangs, big
-- sparkly eyes, an old-paper dress, and a right-side lantern kept away from the
-- center hitCore. Goal: more apparent resolution while staying inside 32px, with
-- selective 1px outline and a few extra tonal steps. It is a PROTOTYPE for
-- comparison only; it does not replace the production yui_idle / yui_move.
--
-- Usage:
--   aseprite -b --script-param out=assets/source/aseprite/player/prototypes/yui_idle_v3.aseprite \
--     --script scripts/aseprite/build-yui-idle-v3-source.lua

local out = app.params["out"]
if out == nil or out == "" then error("missing --script-param out=...aseprite") end
if string.sub(out, -9) ~= ".aseprite" then error("output must be a .aseprite: " .. out) end

local sprite = Sprite(32, 32, ColorMode.RGB)
local img = Image(32, 32)

local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end
local function P(x, y, c) if x >= 0 and y >= 0 and x < 32 and y < 32 then img:drawPixel(x, y, c) end end
local function hline(x0, x1, y, c) for x = x0, x1 do P(x, y, c) end end
local function fillEllipse(cx, cy, rx, ry, c)
  for y = math.floor(cy - ry), math.ceil(cy + ry) do
    for x = math.floor(cx - rx), math.ceil(cx + rx) do
      local nx = (x - cx) / rx
      local ny = (y - cy) / ry
      if nx * nx + ny * ny <= 1.02 then P(x, y, c) end
    end
  end
end
-- transparent-only ellipse fill (for soft glow / shadow that must not erase art)
local function fillEllipseT(cx, cy, rx, ry, c)
  for y = math.floor(cy - ry), math.ceil(cy + ry) do
    for x = math.floor(cx - rx), math.ceil(cx + rx) do
      local nx = (x - cx) / rx
      local ny = (y - cy) / ry
      if nx * nx + ny * ny <= 1.02 and x >= 0 and y >= 0 and x < 32 and y < 32 then
        if app.pixelColor.rgbaA(img:getPixel(x, y)) == 0 then P(x, y, c) end
      end
    end
  end
end

-- Palette (paper-night picture-book tone, a few extra steps vs the current idle).
local OUTLINE  = C(36, 30, 50)
local HOOD_D   = C(46, 60, 104)
local HOOD_M   = C(74, 98, 156)
local HOOD_L   = C(108, 134, 196)
local RIM_GOLD = C(244, 206, 120)
local HAIR_D   = C(96, 50, 42)
local HAIR_M   = C(140, 80, 60)
local HAIR_H   = C(184, 118, 88)
local SKIN     = C(248, 216, 174)
local SKIN_SH  = C(222, 186, 142)
local EYE_D    = C(46, 32, 48)
local EYE_W    = C(250, 246, 230)
local IRIS     = C(156, 100, 62)
local BLUSH    = C(236, 156, 146)
local MOUTH    = C(150, 82, 80)
local DRESS    = C(220, 202, 162)
local DRESS_SH = C(186, 166, 128)
local DRESS_HI = C(238, 224, 188)
local HEM      = C(150, 120, 92)
local LAN_CAGE = C(120, 96, 72)
local LAN_GOLD = C(255, 214, 120)
local LAN_CORE = C(255, 248, 212)
local LAN_GLOW = C(255, 196, 96, 78)
local FOOT_SH  = C(18, 14, 34, 120)

-- 1) Dress / body (trapezoid, rows 18..27), built before the head so the hood overlaps.
for y = 18, 27 do
  local t = (y - 18) / 9
  local xl = math.floor(13 - t * 3 + 0.5)
  local xr = math.floor(18 + t * 3 + 0.5)
  hline(xl, xr, y, DRESS)
  P(xl, y, DRESS_SH); P(xl + 1, y, DRESS_SH)   -- left shadow
  P(xr, y, DRESS_HI)                            -- right (lantern-lit) highlight
end
hline(12, 19, 23, DRESS_SH)   -- apron seam
hline(11, 20, 26, HEM)        -- hem band
hline(12, 19, 27, HEM)

-- 2) Hood (big rounded dome) + gold moon rim + blue tonal steps.
fillEllipse(15, 10, 9, 8, RIM_GOLD)   -- outermost = gold rim
fillEllipse(15, 10, 8, 7, HOOD_D)     -- hood body
fillEllipse(15, 9, 7, 6, HOOD_M)      -- mid blue (offset up = lower stays darker)
fillEllipse(14, 8, 5, 4, HOOD_L)      -- upper-left sheen
-- keep only the upper-left gold as a moon rim: repaint the right/bottom rim to hood.
for y = 2, 18 do
  for x = 16, 25 do
    if img:getPixel(x, y) == RIM_GOLD then P(x, y, HOOD_D) end
  end
end
for y = 12, 18 do
  for x = 6, 15 do
    if img:getPixel(x, y) == RIM_GOLD then P(x, y, HOOD_D) end
  end
end

-- 3) Face opening (skin), framed by the hood.
fillEllipse(15, 12, 5, 5, SKIN)
-- lower-right cheek/jaw shade
for y = 13, 16 do for x = 16, 20 do
  if img:getPixel(x, y) == SKIN then
    if (x - 15) + (y - 12) >= 6 then P(x, y, SKIN_SH) end
  end
end end

-- 4) Bangs (brown-red) over the forehead, with a soft middle parting.
hline(11, 19, 8, HAIR_D)
hline(10, 20, 9, HAIR_D)
hline(10, 20, 10, HAIR_M)
-- fringe tips dipping onto the forehead
P(11, 11, HAIR_M); P(12, 11, HAIR_M); P(15, 11, HAIR_M); P(18, 11, HAIR_M); P(19, 11, HAIR_M)
P(11, 12, HAIR_D); P(19, 12, HAIR_D)
-- side hair framing the cheeks
for y = 11, 15 do P(10, y, HAIR_D); P(20, y, HAIR_D) end
P(10, 16, HAIR_M); P(20, 16, HAIR_M)
-- highlights
P(13, 9, HAIR_H); P(14, 9, HAIR_H); P(16, 10, HAIR_H)

-- 5) Big sparkly eyes (3x3-ish each) + catchlights.
-- left eye cols 12..13, right eye cols 17..18, rows 12..14
P(12, 12, EYE_D); P(13, 12, EYE_D)
P(12, 13, IRIS);  P(13, 13, EYE_D)
P(12, 14, EYE_D); P(13, 14, IRIS)
P(12, 12, EYE_W)                      -- left catchlight (top-out)
P(17, 12, EYE_D); P(18, 12, EYE_D)
P(17, 13, EYE_D); P(18, 13, IRIS)
P(17, 14, IRIS);  P(18, 14, EYE_D)
P(18, 12, EYE_W)                      -- right catchlight

-- 6) Cheeks + mouth.
P(11, 14, BLUSH); P(19, 14, BLUSH)
P(11, 15, BLUSH); P(19, 15, BLUSH)
P(15, 16, MOUTH)

-- 6b) Neck/collar so the head sits on the body (chin -> dress).
hline(14, 16, 17, SKIN_SH)
P(13, 18, DRESS_HI); P(17, 18, DRESS_HI)

-- 6c) Gold crescent-moon accent on the hood crown (reads as the "moon" motif).
P(12, 4, RIM_GOLD); P(11, 5, RIM_GOLD); P(11, 6, RIM_GOLD); P(12, 7, RIM_GOLD)

-- 7) Lantern on the right hand, deliberately offset from the center hitCore.
-- cage at cols 23..26, rows 18..22; handle up to the sleeve.
P(24, 16, LAN_CAGE); P(24, 17, LAN_CAGE)   -- handle/ring
for y = 18, 22 do P(23, y, LAN_CAGE); P(26, y, LAN_CAGE) end
hline(23, 26, 18, LAN_CAGE)
hline(23, 26, 22, LAN_CAGE)
hline(24, 25, 19, LAN_GOLD)
hline(24, 25, 20, LAN_CORE)
hline(24, 25, 21, LAN_GOLD)

-- assign before outline so the body + lantern get a clean dark edge.
local cel = sprite.cels[1]
cel.image = img
cel.position = Point(0, 0)

-- 8) Selective 1px outline: only around solid (alpha>=200) pixels, onto transparent.
local outlined = Image(img)
for y = 0, 31 do for x = 0, 31 do
  if app.pixelColor.rgbaA(img:getPixel(x, y)) == 0 then
    local touch = false
    for _, d in ipairs({ {1,0},{-1,0},{0,1},{0,-1} }) do
      local nx, ny = x + d[1], y + d[2]
      if nx >= 0 and ny >= 0 and nx < 32 and ny < 32 then
        if app.pixelColor.rgbaA(img:getPixel(nx, ny)) >= 200 then touch = true end
      end
    end
    if touch then outlined:drawPixel(x, y, OUTLINE) end
  end
end end
img = outlined
cel.image = img

-- 9) Foot shadow + lantern glow AFTER outline (transparent-only so nothing is erased).
fillEllipseT(16, 29, 8, 2, FOOT_SH)
fillEllipseT(25, 20, 5, 5, LAN_GLOW)
cel.image = img

sprite:saveAs(out)
print("built yui idle v3 prototype source: " .. out)
