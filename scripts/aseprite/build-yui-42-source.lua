-- Build 42px native hand-final candidate sources for Yui's four poses.
--
-- Output : assets/source/aseprite/player/yui_<pose>.aseprite
--
-- The shape language is based on the accepted yui_idle_v4_42 prototype:
-- round blue hood, gold moon rim, brown-red bangs, big highlighted eyes, cheeks,
-- old-paper dress, right-side cage lantern separated from the central hitCore,
-- selective 1px outline, and a restrained foot shadow.
--
-- Usage:
--   aseprite -b --script-param out=assets/source/aseprite/player/yui_idle.aseprite \
--     --script-param pose=idle --script scripts/aseprite/build-yui-42-source.lua

local out = app.params["out"]
if out == nil or out == "" then error("missing --script-param out=...aseprite") end
if string.sub(out, -9) ~= ".aseprite" then error("output must be a .aseprite: " .. out) end

local pose = app.params["pose"] or "idle"
local valid = { idle = true, move = true, hurt = true, ultimate = true }
if not valid[pose] then error("unknown pose: " .. pose) end

local size = 42
local sprite = Sprite(size, size, ColorMode.RGB)
local img = Image(size, size)

local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end

local OUTLINE  = C(34, 28, 48)
local HOOD_D   = C(42, 56, 104)
local HOOD_M   = C(72, 102, 166)
local HOOD_L   = C(118, 150, 210)
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
local DRESS_HURT = C(202, 156, 142)
local DRESS_SH = C(188, 168, 130)
local DRESS_HI = C(240, 226, 190)
local APRON    = C(234, 220, 184)
local APRON_SH = C(214, 184, 142)
local BELT     = C(92, 54, 56)
local SKIRT    = C(170, 86, 58)
local SKIRT_D  = C(86, 48, 58)
local BOOT     = C(47, 34, 46)
local HEM      = C(152, 122, 94)
local LAN_CAGE = C(108, 84, 68)
local LAN_GOLD = C(255, 212, 108)
local LAN_CORE = C(255, 250, 214)
local LAN_GLOW = C(255, 198, 98, 78)
local FOOT_SH  = C(18, 14, 34, 110)
local SPARK    = C(255, 238, 168)

local poseCfg = {
  idle = { lean = 0.0, hoodY = 0.0, lampX = 0.82, lampY = 0.67, lampR = 0.0, armLift = 0.0, foot = 0.0 },
  move = { lean = 0.032, hoodY = -0.005, lampX = 0.85, lampY = 0.63, lampR = -0.025, armLift = -0.03, foot = 0.035 },
  hurt = { lean = -0.032, hoodY = 0.015, lampX = 0.80, lampY = 0.68, lampR = 0.0, armLift = 0.02, foot = -0.025 },
  ultimate = { lean = 0.0, hoodY = -0.005, lampX = 0.84, lampY = 0.64, lampR = 0.018, armLift = -0.02, foot = 0.0 },
}
local cfg = poseCfg[pose]
local cx = 0.49 + cfg.lean
local hoodCy = 0.30 + cfg.hoodY
local faceCy = 0.40 + cfg.hoodY

local function d2(nx, ny, cx0, cy0, rx, ry)
  local a = (nx - cx0) / rx
  local b = (ny - cy0) / ry
  return a * a + b * b
end

local function region(test, col)
  for y = 0, size - 1 do
    for x = 0, size - 1 do
      local nx = (x + 0.5) / size
      local ny = (y + 0.5) / size
      if test(nx, ny) then img:drawPixel(x, y, col) end
    end
  end
end

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

local function put(x, y, col)
  if x >= 0 and y >= 0 and x < size and y < size then img:drawPixel(x, y, col) end
end

local function hline(x0, x1, y, col)
  for x = x0, x1 do put(x, y, col) end
end

local function vline(x, y0, y1, col)
  for y = y0, y1 do put(x, y, col) end
end

local function rect(x0, y0, x1, y1, col)
  for y = y0, y1 do
    for x = x0, x1 do put(x, y, col) end
  end
end

-- Body: compact torso, apron, red hem, boots, and a right-side cloak.
region(function(nx, ny) -- dark shape behind the apron so the body is not a flat triangle
  if ny < 0.545 or ny > 0.895 then return false end
  local t = (ny - 0.545) / 0.35
  local left = cx - (0.12 + t * 0.08)
  local right = cx + (0.13 + t * 0.10)
  return nx >= left and nx <= right
end, pose == "hurt" and DRESS_HURT or DRESS_SH)
region(function(nx, ny) -- cream apron, narrower at the waist and rounded wider at the bottom
  if ny < 0.585 or ny > 0.84 then return false end
  local t = (ny - 0.585) / 0.255
  local hw = 0.085 + t * 0.065
  return math.abs(nx - cx) <= hw
end, APRON)
region(function(nx, ny) -- apron lower warmth/shadow
  return ny >= 0.735 and ny <= 0.845 and math.abs(nx - (cx - 0.018)) <= 0.115
end, APRON_SH)
region(function(nx, ny) -- apron highlight
  return ny >= 0.62 and ny <= 0.79 and math.abs(nx - (cx + 0.038)) <= 0.026
end, DRESS_HI)
region(function(nx, ny) -- small vertical seam / clasp, like the reference body center
  return ny >= 0.565 and ny <= 0.735 and math.abs(nx - cx) <= 0.013
end, HEM)
region(function(nx, ny) -- belt separating torso and skirt
  return ny >= 0.775 and ny <= 0.812 and math.abs(nx - cx) <= 0.185
end, BELT)
region(function(nx, ny) -- red skirt peeking under the apron
  if ny < 0.815 or ny > 0.91 then return false end
  local t = (ny - 0.815) / 0.095
  local hw = 0.15 + t * 0.055
  return math.abs(nx - cx) <= hw
end, SKIRT)
region(function(nx, ny) -- shaded skirt edges
  return ny >= 0.825 and ny <= 0.915 and (math.abs(nx - (cx - 0.165)) <= 0.04 or math.abs(nx - (cx + 0.165)) <= 0.04)
end, SKIRT_D)
region(function(nx, ny) -- two small boots
  return ny >= 0.895 and ny <= 0.96 and (math.abs(nx - (cx - 0.08)) <= 0.042 or math.abs(nx - (cx + 0.085)) <= 0.042)
end, BOOT)
region(function(nx, ny) -- right-side cloak hanging over the body, reference-inspired but small
  if ny < 0.55 or ny > 0.875 then return false end
  local t = (ny - 0.54) / 0.32
  local left = cx + 0.09 + t * 0.015
  local right = cx + 0.19 + t * 0.12
  return nx >= left and nx <= right
end, HOOD_D)
region(function(nx, ny) -- cloak lit rim
  if ny < 0.58 or ny > 0.83 then return false end
  local t = (ny - 0.58) / 0.25
  return math.abs(nx - (cx + 0.12 + t * 0.10)) <= 0.018
end, RIM_GOLD)
region(function(nx, ny) -- cloak lower shadow
  return ny >= 0.80 and ny <= 0.89 and nx >= cx + 0.10 and nx <= cx + 0.32
end, HOOD_D)

if pose == "move" then
  region(function(nx, ny) return ny >= 0.88 and ny <= 0.96 and nx >= cx - 0.18 and nx <= cx - 0.08 end, BOOT)
  region(function(nx, ny) return ny >= 0.875 and ny <= 0.95 and nx >= cx + 0.08 and nx <= cx + 0.21 end, BOOT)
elseif pose == "hurt" then
  region(function(nx, ny) return d2(nx, ny, cx - 0.22, 0.58, 0.05, 0.025) <= 1 end, C(255, 224, 150))
  region(function(nx, ny) return d2(nx, ny, cx + 0.24, 0.58, 0.05, 0.025) <= 1 end, C(255, 224, 150))
end

-- Hood dome + gold moon rim.
region(function(nx, ny) return d2(nx, ny, cx, hoodCy + 0.005, 0.315, 0.302) <= 1 end, RIM_GOLD)
region(function(nx, ny) return d2(nx, ny, cx, hoodCy + 0.005, 0.298, 0.286) <= 1 end, HOOD_D)
region(function(nx, ny) return d2(nx, ny, cx, hoodCy - 0.012, 0.276, 0.264) <= 1 end, HOOD_M)
region(function(nx, ny) return d2(nx, ny, cx - 0.055, hoodCy - 0.058, 0.165, 0.145) <= 1 end, HOOD_L)
region(function(nx, ny) return d2(nx, ny, cx + 0.235, hoodCy + 0.07, 0.062, 0.10) <= 1 end, HOOD_D)
region(function(nx, ny) return d2(nx, ny, cx - 0.245, hoodCy + 0.085, 0.055, 0.085) <= 1 end, HOOD_D)
region(function(nx, ny)
  return img:getPixel(math.floor(nx * size), math.floor(ny * size)) == RIM_GOLD
    and not (nx < cx + 0.03 and ny < hoodCy + 0.04)
end, HOOD_D)
region(function(nx, ny) return d2(nx, ny, cx + 0.10, hoodCy - 0.115, 0.065, 0.058) <= 1 end, RIM_GOLD)
region(function(nx, ny) return d2(nx, ny, cx + 0.075, hoodCy - 0.135, 0.055, 0.052) <= 1 end, HOOD_M)

-- Face + hair.
region(function(nx, ny) return d2(nx, ny, cx, faceCy + 0.005, 0.188, 0.193) <= 1 end, SKIN)
region(function(nx, ny)
  return d2(nx, ny, cx, faceCy + 0.005, 0.188, 0.193) <= 1 and (nx - cx) + (ny - faceCy) >= 0.15
end, SKIN_SH)
region(function(nx, ny) return d2(nx, ny, cx, faceCy - 0.066, 0.212, 0.165) <= 1 and ny <= faceCy - 0.035 end, HAIR_D)
region(function(nx, ny)
  return d2(nx, ny, cx, faceCy - 0.035, 0.205, 0.158) <= 1 and ny >= faceCy - 0.07 and ny <= faceCy + 0.005
    and (math.abs(nx - cx) > 0.125 or math.abs(nx - (cx - 0.075)) < 0.026 or math.abs(nx - (cx + 0.07)) < 0.023)
end, HAIR_M)
region(function(nx, ny)
  local din = d2(nx, ny, cx, faceCy + 0.022, 0.186, 0.198)
  local dout = d2(nx, ny, cx, faceCy + 0.004, 0.222, 0.215)
  return dout <= 1 and din > 1 and ny >= faceCy - 0.075 and ny <= faceCy + 0.158
end, HAIR_D)
region(function(nx, ny) return d2(nx, ny, cx - 0.07, faceCy - 0.092, 0.062, 0.052) <= 1 end, HAIR_H)
region(function(nx, ny) return d2(nx, ny, cx + 0.045, faceCy - 0.082, 0.044, 0.036) <= 1 end, HAIR_H)

local function eye(ecx)
  if pose == "hurt" then
    region(function(nx, ny) return math.abs((ny - (faceCy + 0.005)) - (nx - ecx) * 0.55) <= 0.014 and math.abs(nx - ecx) <= 0.045 end, EYE_D)
    region(function(nx, ny) return math.abs((ny - (faceCy + 0.005)) + (nx - ecx) * 0.55) <= 0.014 and math.abs(nx - ecx) <= 0.045 end, EYE_D)
  else
    region(function(nx, ny) return d2(nx, ny, ecx, faceCy + 0.014, 0.058, 0.072) <= 1 end, EYE_D)
    region(function(nx, ny) return d2(nx, ny, ecx, faceCy + 0.024, 0.037, 0.054) <= 1 end, IRIS)
    region(function(nx, ny) return d2(nx, ny, ecx, faceCy + 0.055, 0.032, 0.032) <= 1 end, IRIS_D)
    region(function(nx, ny) return d2(nx, ny, ecx - 0.013, faceCy - 0.014, 0.019, 0.021) <= 1 end, EYE_W)
  end
end
eye(cx - 0.088)
eye(cx + 0.088)

region(function(nx, ny) return d2(nx, ny, cx - 0.132, faceCy + 0.074, 0.038, 0.028) <= 1 end, BLUSH)
region(function(nx, ny) return d2(nx, ny, cx + 0.132, faceCy + 0.074, 0.038, 0.028) <= 1 end, BLUSH)
region(function(nx, ny) return d2(nx, ny, cx, faceCy + 0.11, 0.022, 0.018) <= 1 end, MOUTH)

-- Arm and cage lantern.
region(function(nx, ny)
  local x0, y0 = cx + 0.14, 0.57 + cfg.armLift
  local x1, y1 = cfg.lampX - 0.06, cfg.lampY - 0.08
  local dx, dy = x1 - x0, y1 - y0
  local len2 = dx * dx + dy * dy
  local t = ((nx - x0) * dx + (ny - y0) * dy) / len2
  if t < 0 or t > 1 then return false end
  local px, py = x0 + t * dx, y0 + t * dy
  return d2(nx, ny, px, py, 0.025, 0.018) <= 1
end, LAN_CAGE)
region(function(nx, ny) return d2(nx, ny, cfg.lampX - 0.02, cfg.lampY - 0.11, 0.03, 0.035) <= 1 and ny <= cfg.lampY - 0.09 end, LAN_CAGE)
region(function(nx, ny)
  local inb = nx >= cfg.lampX - 0.078 and nx <= cfg.lampX + 0.078 and ny >= cfg.lampY - 0.082 and ny <= cfg.lampY + 0.082
  local inner = nx >= cfg.lampX - 0.048 and nx <= cfg.lampX + 0.048 and ny >= cfg.lampY - 0.052 and ny <= cfg.lampY + 0.052
  return inb and not inner
end, LAN_CAGE)
region(function(nx, ny) return nx >= cfg.lampX - 0.055 and nx <= cfg.lampX - 0.04 and ny >= cfg.lampY - 0.07 and ny <= cfg.lampY + 0.07 end, LAN_CAGE)
region(function(nx, ny) return nx >= cfg.lampX + 0.04 and nx <= cfg.lampX + 0.055 and ny >= cfg.lampY - 0.07 and ny <= cfg.lampY + 0.07 end, LAN_CAGE)
region(function(nx, ny) return nx >= cfg.lampX - 0.048 and nx <= cfg.lampX + 0.048 and ny >= cfg.lampY - 0.052 and ny <= cfg.lampY + 0.052 end, LAN_GOLD)
region(function(nx, ny) return nx >= cfg.lampX - 0.026 and nx <= cfg.lampX + 0.026 and ny >= cfg.lampY - 0.026 and ny <= cfg.lampY + 0.026 end, LAN_CORE)

if pose == "idle" then
  -- Idle is intentionally hand-finished in pixel coordinates. The other poses
  -- keep the shared generated base until this idle direction is approved.
  local HOOD_XL = C(146, 172, 222)
  local HOOD_S  = C(28, 38, 78)
  local RIM_HI  = C(255, 228, 154)
  local SKIN_HI = C(255, 231, 190)
  local SKIN_R  = C(238, 196, 154)
  local HAIR_S  = C(70, 36, 38)
  local APRON_H = C(248, 234, 198)
  local CLOTH_S = C(150, 132, 104)
  local LAMP_S  = C(83, 60, 54)

  -- Footing and cloak/body mass.
  hline(13, 28, 38, C(22, 17, 36, 180))
  hline(15, 27, 37, C(40, 29, 48))
  rect(12, 25, 29, 34, DRESS_SH)
  rect(25, 24, 32, 35, HOOD_D)
  vline(31, 25, 35, HOOD_S)
  hline(27, 31, 25, HOOD_M)

  -- Painterly hood clusters: keep the generated round silhouette, add cloth depth.
  hline(16, 21, 5, HOOD_XL)
  hline(13, 22, 6, HOOD_XL)
  hline(12, 20, 7, HOOD_L)
  hline(11, 18, 8, HOOD_L)
  hline(12, 17, 9, HOOD_L)
  hline(21, 28, 8, HOOD_M)
  hline(23, 29, 9, HOOD_M)
  hline(25, 30, 10, HOOD_M)
  rect(30, 14, 33, 18, HOOD_D)
  rect(8, 15, 11, 20, HOOD_S)
  put(30, 8, HOOD_L)
  put(31, 9, HOOD_M)
  put(33, 12, HOOD_S)

  -- Gold moon rim and small crescent mark.
  put(9, 16, RIM_HI)
  put(10, 15, RIM_HI)
  put(11, 14, RIM_HI)
  hline(12, 15, 13, RIM_HI)
  hline(16, 21, 12, RIM_GOLD)
  hline(22, 27, 13, RIM_GOLD)
  put(28, 14, RIM_HI)
  put(29, 15, RIM_GOLD)
  put(26, 5, RIM_HI)
  put(27, 6, RIM_HI)
  put(28, 7, RIM_HI)
  put(27, 8, RIM_GOLD)
  put(26, 8, HOOD_M)

  -- Hair mass first, then the rounded face sits inside it.
  hline(13, 28, 12, HAIR_S)
  hline(12, 29, 13, HAIR_D)
  hline(12, 29, 14, HAIR_D)
  vline(12, 15, 24, HAIR_D)
  vline(29, 15, 23, HAIR_D)
  rect(14, 14, 17, 18, HAIR_M)
  rect(18, 13, 21, 17, HAIR_M)
  rect(23, 14, 26, 18, HAIR_M)
  put(17, 15, HAIR_H)
  put(20, 14, HAIR_H)
  put(24, 15, HAIR_H)
  put(26, 16, HAIR_H)

  -- Large cute face, deliberately rounded rather than rectangular.
  hline(16, 25, 15, SKIN)
  hline(14, 27, 16, SKIN)
  hline(14, 27, 17, SKIN)
  hline(14, 27, 18, SKIN)
  hline(14, 27, 19, SKIN)
  hline(14, 27, 20, SKIN)
  hline(15, 26, 21, SKIN)
  hline(16, 25, 22, SKIN)
  hline(17, 24, 23, SKIN_R)
  hline(18, 23, 24, SKIN_R)
  put(15, 19, SKIN_HI)
  put(16, 20, SKIN_HI)
  hline(24, 27, 20, SKIN_SH)
  put(26, 21, SKIN_SH)

  -- Bangs redrawn over the forehead so they fall into the face.
  rect(14, 14, 16, 17, HAIR_M)
  rect(18, 13, 20, 16, HAIR_M)
  rect(23, 14, 25, 17, HAIR_M)
  put(17, 14, HAIR_D)
  put(21, 14, HAIR_D)
  put(22, 15, HAIR_D)
  put(26, 16, HAIR_D)

  -- Big eyes: dark shape, warm lower pixel, single white catchlight.
  rect(16, 18, 18, 21, EYE_D)
  rect(23, 18, 25, 21, EYE_D)
  put(17, 18, EYE_W)
  put(24, 18, EYE_W)
  put(17, 21, IRIS_D)
  put(24, 21, IRIS_D)
  put(16, 23, BLUSH)
  put(25, 23, BLUSH)
  put(20, 24, MOUTH)
  put(21, 24, MOUTH)

  -- Old-paper dress with thickness, sleeve, hem, and boots.
  rect(16, 25, 25, 32, APRON)
  rect(18, 26, 23, 30, APRON_H)
  hline(16, 25, 33, APRON_SH)
  hline(15, 26, 34, BELT)
  hline(14, 27, 35, SKIRT)
  hline(15, 26, 36, SKIRT_D)
  rect(13, 26, 15, 32, DRESS_SH)
  rect(16, 37, 18, 39, BOOT)
  rect(23, 37, 25, 39, BOOT)
  put(20, 26, HEM)
  put(21, 27, HEM)

  -- Right-hand cage lantern: far enough from center hitCore to read as a prop.
  hline(29, 31, 26, CLOTH_S)
  rect(31, 25, 37, 32, LAMP_S)
  rect(32, 26, 36, 31, LAN_GOLD)
  rect(33, 27, 35, 30, LAN_CORE)
  hline(31, 37, 25, LAN_CAGE)
  hline(31, 37, 32, LAN_CAGE)
  vline(31, 26, 31, LAN_CAGE)
  vline(37, 26, 31, LAN_CAGE)
  vline(34, 26, 32, LAN_CAGE)
  hline(32, 36, 24, LAN_CAGE)
  put(34, 23, LAN_CAGE)
  put(38, 29, LAN_GOLD)
end

if pose == "ultimate" then
  region(function(nx, ny) return d2(nx, ny, cx, 0.62, 0.08, 0.08) <= 1 end, C(255, 244, 196, 120))
  region(function(nx, ny) return math.abs((ny - 0.24) - (nx - 0.20) * 0.5) <= 0.014 and nx >= 0.12 and nx <= 0.26 end, SPARK)
  region(function(nx, ny) return math.abs((ny - 0.25) + (nx - 0.78) * 0.5) <= 0.014 and nx >= 0.74 and nx <= 0.90 end, SPARK)
  region(function(nx, ny) return d2(nx, ny, cfg.lampX, cfg.lampY, 0.14, 0.14) <= 1 end, C(255, 228, 138, 72))
end

local cel = sprite.cels[1]
cel.image = img
cel.position = Point(0, 0)

-- Selective 1px outline around solid pixels.
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

regionT(function(nx, ny) return d2(nx, ny, 0.5 + cfg.foot, 0.91, 0.28, 0.055) <= 1 end, FOOT_SH)
regionT(function(nx, ny) return d2(nx, ny, cfg.lampX, cfg.lampY, 0.14 + cfg.lampR, 0.14 + cfg.lampR) <= 1 end, LAN_GLOW)
cel.image = img

sprite:saveAs(out)
print("built yui " .. pose .. " 42px hand-final candidate source: " .. out)
