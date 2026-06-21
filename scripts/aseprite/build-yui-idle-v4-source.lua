-- Prototype bootstrap: bigger Yui idle (v4) for the 40/42/44px visual-size test.
--
-- Output : assets/source/aseprite/player/prototypes/yui_idle_v4_<size>.aseprite
--
-- This keeps the v3 cute direction (round blue hood, gold moon rim, brown bangs, big
-- eyes, old-paper dress, right-side lantern away from the center hitCore) but is
-- DRAWN NATIVELY at the target size (not a 32px upscale): everything is defined in
-- normalized [0,1] space and rasterized at the native canvas, so 40/42/44 each get a
-- crisp own-resolution sprite with a bit more face/hood/lantern detail than 32px.
--
-- PROTOTYPE only. Does not touch the production yui_idle / yui_move / yui_hurt.
--
-- Usage:
--   aseprite -b --script-param out=...yui_idle_v4_42.aseprite \
--     --script-param size=42 --script scripts/aseprite/build-yui-idle-v4-source.lua

local out = app.params["out"]
if out == nil or out == "" then error("missing --script-param out=...aseprite") end
if string.sub(out, -9) ~= ".aseprite" then error("output must be a .aseprite: " .. out) end
local size = tonumber(app.params["size"]) or 42
if size < 32 or size > 64 then error("size out of range: " .. size) end

local sprite = Sprite(size, size, ColorMode.RGB)
local img = Image(size, size)

local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end

-- Palette (same family as v3, one extra step on iris/dress).
local OUTLINE  = C(36, 30, 50)
local HOOD_D   = C(44, 58, 102)
local HOOD_M   = C(72, 98, 156)
local HOOD_L   = C(110, 138, 200)
local RIM_GOLD = C(246, 208, 122)
local HAIR_D   = C(94, 48, 40)
local HAIR_M   = C(138, 78, 58)
local HAIR_H   = C(186, 120, 90)
local SKIN     = C(250, 218, 176)
local SKIN_SH  = C(224, 188, 144)
local EYE_D    = C(44, 30, 46)
local EYE_W    = C(252, 248, 232)
local IRIS     = C(158, 102, 64)
local IRIS_D   = C(110, 66, 42)
local BLUSH    = C(238, 158, 148)
local MOUTH    = C(152, 84, 82)
local DRESS    = C(222, 204, 164)
local DRESS_SH = C(188, 168, 130)
local DRESS_HI = C(240, 226, 190)
local APRON    = C(234, 220, 184)
local HEM      = C(152, 122, 94)
local LAN_CAGE = C(122, 98, 74)
local LAN_GOLD = C(255, 216, 122)
local LAN_CORE = C(255, 250, 214)
local LAN_GLOW = C(255, 198, 98, 78)
local FOOT_SH  = C(18, 14, 34, 110)

-- normalized helpers ---------------------------------------------------------
local function d2(nx, ny, cx, cy, rx, ry)
  local a = (nx - cx) / rx
  local b = (ny - cy) / ry
  return a * a + b * b
end
-- paint a region: test(nx,ny) -> bool. opaque only (replace).
local function region(test, col)
  for y = 0, size - 1 do
    for x = 0, size - 1 do
      local nx = (x + 0.5) / size
      local ny = (y + 0.5) / size
      if test(nx, ny) then img:drawPixel(x, y, col) end
    end
  end
end
-- paint only where currently transparent (for soft glow / shadow).
local function regionT(test, col)
  for y = 0, size - 1 do
    for x = 0, size - 1 do
      local nx = (x + 0.5) / size
      local ny = (y + 0.5) / size
      if test(nx, ny) and app.pixelColor.rgbaA(img:getPixel(x, y)) == 0 then
        img:drawPixel(x, y, col)
      end
    end
  end
end

-- 1) Dress / body (trapezoid widening downward).
region(function(nx, ny)
  if ny < 0.57 or ny > 0.88 then return false end
  local t = (ny - 0.57) / (0.88 - 0.57)
  local hw = 0.12 + t * 0.13
  return math.abs(nx - 0.5) <= hw
end, DRESS)
region(function(nx, ny)              -- left shadow side
  if ny < 0.58 or ny > 0.88 then return false end
  local t = (ny - 0.57) / 0.31
  local hw = 0.12 + t * 0.13
  return (nx - 0.5) <= -hw + 0.05 and (nx - 0.5) >= -hw
end, DRESS_SH)
region(function(nx, ny)              -- center apron panel
  return ny >= 0.62 and ny <= 0.85 and math.abs(nx - 0.5) <= 0.07
end, APRON)
region(function(nx, ny)              -- right (lantern-lit) edge
  if ny < 0.6 or ny > 0.86 then return false end
  local t = (ny - 0.57) / 0.31
  local hw = 0.12 + t * 0.13
  return (nx - 0.5) >= hw - 0.04 and (nx - 0.5) <= hw
end, DRESS_HI)
region(function(nx, ny)              -- hem band
  return ny >= 0.84 and ny <= 0.88 and math.abs(nx - 0.5) <= 0.25
end, HEM)

-- 2) Hood dome + gold moon rim + blue tonal steps.
region(function(nx, ny) return d2(nx, ny, 0.49, 0.30, 0.30, 0.29) <= 1 end, RIM_GOLD)
region(function(nx, ny) return d2(nx, ny, 0.49, 0.30, 0.285, 0.275) <= 1 end, HOOD_D)
region(function(nx, ny) return d2(nx, ny, 0.49, 0.285, 0.265, 0.255) <= 1 end, HOOD_M)
region(function(nx, ny) return d2(nx, ny, 0.45, 0.25, 0.17, 0.15) <= 1 end, HOOD_L)
-- keep gold only on the upper-left arc (+ a short crescent); repaint the rest dark.
region(function(nx, ny)
  return img:getPixel(math.floor(nx * size), math.floor(ny * size)) == RIM_GOLD
    and not (nx < 0.52 and ny < 0.34)
end, HOOD_D)

-- 3) Face opening (skin) + lower-right jaw shade.
region(function(nx, ny) return d2(nx, ny, 0.49, 0.40, 0.175, 0.185) <= 1 end, SKIN)
region(function(nx, ny)
  return d2(nx, ny, 0.49, 0.40, 0.175, 0.185) <= 1 and (nx - 0.49) + (ny - 0.40) >= 0.14
end, SKIN_SH)

-- 4) Bangs (brown-red) over the forehead + side framing.
region(function(nx, ny)
  return d2(nx, ny, 0.49, 0.34, 0.20, 0.16) <= 1 and ny <= 0.36
end, HAIR_D)
region(function(nx, ny)              -- fringe dipping onto the forehead
  return d2(nx, ny, 0.49, 0.37, 0.19, 0.16) <= 1 and ny >= 0.34 and ny <= 0.40
    and (math.abs(nx - 0.49) > 0.13 or (math.abs(nx - 0.42) < 0.02) or (math.abs(nx - 0.56) < 0.02))
end, HAIR_M)
region(function(nx, ny)              -- side hair framing cheeks
  local din = d2(nx, ny, 0.49, 0.42, 0.175, 0.19)
  local dout = d2(nx, ny, 0.49, 0.40, 0.205, 0.20)
  return dout <= 1 and din > 1 and ny >= 0.33 and ny <= 0.55
end, HAIR_D)
region(function(nx, ny)              -- hair highlight
  return d2(nx, ny, 0.43, 0.31, 0.06, 0.05) <= 1
end, HAIR_H)

-- 5) Big eyes (left/right) with iris + catchlight.
local function eye(ecx)
  region(function(nx, ny) return d2(nx, ny, ecx, 0.41, 0.052, 0.066) <= 1 end, EYE_D)
  region(function(nx, ny) return d2(nx, ny, ecx, 0.42, 0.034, 0.05) <= 1 end, IRIS)
  region(function(nx, ny) return d2(nx, ny, ecx, 0.45, 0.03, 0.03) <= 1 end, IRIS_D)
  region(function(nx, ny) return d2(nx, ny, ecx - 0.01, 0.39, 0.018, 0.02) <= 1 end, EYE_W)
end
eye(0.405)
eye(0.575)

-- 6) Cheeks + mouth.
region(function(nx, ny) return d2(nx, ny, 0.36, 0.47, 0.035, 0.03) <= 1 end, BLUSH)
region(function(nx, ny) return d2(nx, ny, 0.62, 0.47, 0.035, 0.03) <= 1 end, BLUSH)
region(function(nx, ny) return d2(nx, ny, 0.49, 0.51, 0.022, 0.018) <= 1 end, MOUTH)

-- 7) Lantern on the right hand, offset far from the center hitCore.
region(function(nx, ny)              -- handle ring up to the sleeve
  return d2(nx, ny, 0.80, 0.55, 0.03, 0.035) <= 1 and ny <= 0.57
end, LAN_CAGE)
region(function(nx, ny)              -- cage frame
  local inb = nx >= 0.74 and nx <= 0.90 and ny >= 0.58 and ny <= 0.74
  local inner = nx >= 0.77 and nx <= 0.87 and ny >= 0.61 and ny <= 0.71
  return inb and not inner
end, LAN_CAGE)
region(function(nx, ny) return nx >= 0.77 and nx <= 0.87 and ny >= 0.61 and ny <= 0.71 end, LAN_GOLD)
region(function(nx, ny) return nx >= 0.79 and nx <= 0.85 and ny >= 0.63 and ny <= 0.69 end, LAN_CORE)

-- assign before outline so body + lantern get a clean dark edge.
local cel = sprite.cels[1]
cel.image = img
cel.position = Point(0, 0)

-- 8) Selective 1px outline around solid (alpha>=200) pixels.
local outlined = Image(img)
for y = 0, size - 1 do for x = 0, size - 1 do
  if app.pixelColor.rgbaA(img:getPixel(x, y)) == 0 then
    local touch = false
    for _, d in ipairs({ {1,0},{-1,0},{0,1},{0,-1} }) do
      local nx, ny = x + d[1], y + d[2]
      if nx >= 0 and ny >= 0 and nx < size and ny < size then
        if app.pixelColor.rgbaA(img:getPixel(nx, ny)) >= 200 then touch = true end
      end
    end
    if touch then outlined:drawPixel(x, y, OUTLINE) end
  end
end end
img = outlined
cel.image = img

-- 9) Foot shadow + lantern glow (transparent-only, kept soft / not outlined).
regionT(function(nx, ny) return d2(nx, ny, 0.5, 0.91, 0.28, 0.055) <= 1 end, FOOT_SH)
regionT(function(nx, ny) return d2(nx, ny, 0.82, 0.66, 0.14, 0.14) <= 1 end, LAN_GLOW)
cel.image = img

sprite:saveAs(out)
print("built yui idle v4 prototype source (" .. size .. "px): " .. out)
