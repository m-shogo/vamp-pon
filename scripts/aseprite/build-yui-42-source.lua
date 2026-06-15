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
local DRESS_HURT = C(202, 156, 142)
local DRESS_SH = C(188, 168, 130)
local DRESS_HI = C(240, 226, 190)
local APRON    = C(234, 220, 184)
local HEM      = C(152, 122, 94)
local LAN_CAGE = C(122, 98, 74)
local LAN_GOLD = C(255, 216, 122)
local LAN_CORE = C(255, 250, 214)
local LAN_GLOW = C(255, 198, 98, 78)
local FOOT_SH  = C(18, 14, 34, 110)
local SPARK    = C(255, 238, 168)

local poseCfg = {
  idle = { lean = 0.0, hoodY = 0.0, lampX = 0.80, lampY = 0.66, lampR = 0.0, armLift = 0.0, foot = 0.0 },
  move = { lean = 0.035, hoodY = -0.005, lampX = 0.84, lampY = 0.62, lampR = -0.03, armLift = -0.03, foot = 0.035 },
  hurt = { lean = -0.035, hoodY = 0.015, lampX = 0.78, lampY = 0.67, lampR = 0.0, armLift = 0.02, foot = -0.025 },
  ultimate = { lean = 0.0, hoodY = -0.005, lampX = 0.82, lampY = 0.64, lampR = 0.018, armLift = -0.02, foot = 0.0 },
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

-- Dress / body.
region(function(nx, ny)
  if ny < 0.57 or ny > 0.88 then return false end
  local t = (ny - 0.57) / 0.31
  local hw = 0.12 + t * 0.13
  return math.abs(nx - cx) <= hw
end, pose == "hurt" and DRESS_HURT or DRESS)
region(function(nx, ny)
  if ny < 0.58 or ny > 0.88 then return false end
  local t = (ny - 0.57) / 0.31
  local hw = 0.12 + t * 0.13
  return (nx - cx) <= -hw + 0.05 and (nx - cx) >= -hw
end, DRESS_SH)
region(function(nx, ny) return ny >= 0.62 and ny <= 0.85 and math.abs(nx - cx) <= 0.07 end, APRON)
region(function(nx, ny)
  if ny < 0.6 or ny > 0.86 then return false end
  local t = (ny - 0.57) / 0.31
  local hw = 0.12 + t * 0.13
  return (nx - cx) >= hw - 0.04 and (nx - cx) <= hw
end, DRESS_HI)
region(function(nx, ny) return ny >= 0.84 and ny <= 0.88 and math.abs(nx - cx) <= 0.25 end, HEM)

if pose == "move" then
  region(function(nx, ny) return ny >= 0.855 and ny <= 0.91 and nx >= cx - 0.28 and nx <= cx - 0.10 end, DRESS_SH)
  region(function(nx, ny) return ny >= 0.855 and ny <= 0.91 and nx >= cx + 0.10 and nx <= cx + 0.28 end, DRESS_HI)
elseif pose == "hurt" then
  region(function(nx, ny) return d2(nx, ny, cx - 0.22, 0.58, 0.05, 0.025) <= 1 end, C(255, 224, 150))
  region(function(nx, ny) return d2(nx, ny, cx + 0.24, 0.58, 0.05, 0.025) <= 1 end, C(255, 224, 150))
end

-- Hood dome + gold moon rim.
region(function(nx, ny) return d2(nx, ny, cx, hoodCy, 0.30, 0.29) <= 1 end, RIM_GOLD)
region(function(nx, ny) return d2(nx, ny, cx, hoodCy, 0.285, 0.275) <= 1 end, HOOD_D)
region(function(nx, ny) return d2(nx, ny, cx, hoodCy - 0.015, 0.265, 0.255) <= 1 end, HOOD_M)
region(function(nx, ny) return d2(nx, ny, cx - 0.04, hoodCy - 0.05, 0.17, 0.15) <= 1 end, HOOD_L)
region(function(nx, ny)
  return img:getPixel(math.floor(nx * size), math.floor(ny * size)) == RIM_GOLD
    and not (nx < cx + 0.03 and ny < hoodCy + 0.04)
end, HOOD_D)

-- Face + hair.
region(function(nx, ny) return d2(nx, ny, cx, faceCy, 0.175, 0.185) <= 1 end, SKIN)
region(function(nx, ny)
  return d2(nx, ny, cx, faceCy, 0.175, 0.185) <= 1 and (nx - cx) + (ny - faceCy) >= 0.14
end, SKIN_SH)
region(function(nx, ny) return d2(nx, ny, cx, faceCy - 0.06, 0.20, 0.16) <= 1 and ny <= faceCy - 0.04 end, HAIR_D)
region(function(nx, ny)
  return d2(nx, ny, cx, faceCy - 0.03, 0.19, 0.16) <= 1 and ny >= faceCy - 0.06 and ny <= faceCy
    and (math.abs(nx - cx) > 0.13 or math.abs(nx - (cx - 0.07)) < 0.02 or math.abs(nx - (cx + 0.07)) < 0.02)
end, HAIR_M)
region(function(nx, ny)
  local din = d2(nx, ny, cx, faceCy + 0.02, 0.175, 0.19)
  local dout = d2(nx, ny, cx, faceCy, 0.205, 0.20)
  return dout <= 1 and din > 1 and ny >= faceCy - 0.07 and ny <= faceCy + 0.15
end, HAIR_D)
region(function(nx, ny) return d2(nx, ny, cx - 0.06, faceCy - 0.09, 0.06, 0.05) <= 1 end, HAIR_H)

local function eye(ecx)
  if pose == "hurt" then
    region(function(nx, ny) return math.abs((ny - (faceCy + 0.005)) - (nx - ecx) * 0.55) <= 0.014 and math.abs(nx - ecx) <= 0.045 end, EYE_D)
    region(function(nx, ny) return math.abs((ny - (faceCy + 0.005)) + (nx - ecx) * 0.55) <= 0.014 and math.abs(nx - ecx) <= 0.045 end, EYE_D)
  else
    region(function(nx, ny) return d2(nx, ny, ecx, faceCy + 0.01, 0.052, 0.066) <= 1 end, EYE_D)
    region(function(nx, ny) return d2(nx, ny, ecx, faceCy + 0.02, 0.034, 0.05) <= 1 end, IRIS)
    region(function(nx, ny) return d2(nx, ny, ecx, faceCy + 0.05, 0.03, 0.03) <= 1 end, IRIS_D)
    region(function(nx, ny) return d2(nx, ny, ecx - 0.01, faceCy - 0.01, 0.018, 0.02) <= 1 end, EYE_W)
  end
end
eye(cx - 0.085)
eye(cx + 0.085)

region(function(nx, ny) return d2(nx, ny, cx - 0.13, faceCy + 0.07, 0.035, 0.03) <= 1 end, BLUSH)
region(function(nx, ny) return d2(nx, ny, cx + 0.13, faceCy + 0.07, 0.035, 0.03) <= 1 end, BLUSH)
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
  local inb = nx >= cfg.lampX - 0.08 and nx <= cfg.lampX + 0.08 and ny >= cfg.lampY - 0.08 and ny <= cfg.lampY + 0.08
  local inner = nx >= cfg.lampX - 0.05 and nx <= cfg.lampX + 0.05 and ny >= cfg.lampY - 0.05 and ny <= cfg.lampY + 0.05
  return inb and not inner
end, LAN_CAGE)
region(function(nx, ny) return nx >= cfg.lampX - 0.05 and nx <= cfg.lampX + 0.05 and ny >= cfg.lampY - 0.05 and ny <= cfg.lampY + 0.05 end, LAN_GOLD)
region(function(nx, ny) return nx >= cfg.lampX - 0.03 and nx <= cfg.lampX + 0.03 and ny >= cfg.lampY - 0.03 and ny <= cfg.lampY + 0.03 end, LAN_CORE)

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
