-- build-yui-idle-v5-candidate.lua
--
-- v5 candidate bootstrap for yui_idle_42.
-- Key improvements over v4:
--   - Hood is much wider (rx 0.30 → 0.44) matching reference's dramatic draping hood
--   - Hood depth extended to cover shoulder/body area
--   - Eyes bigger and more expressive with visible catchlights
--   - Brown-red bangs more prominent
--   - Dress wider trapezoid below hood
--   - Better layered structure for hand-finishing
--
-- STATUS: candidate draft (bootstrap). NOT hand-final.
-- Requires human hand-finish in Aseprite GUI for:
--   - 1px eye detail and catchlight placement
--   - Hood shading transitions
--   - Hair strand detail
--   - Dress fold lines
--   - Final lantern glow adjustment
--
-- Usage:
--   aseprite -b --script-param out=...yui_idle_v5_candidate.aseprite \
--     --script scripts/aseprite/build-yui-idle-v5-candidate.lua

local out = app.params["out"]
if out == nil or out == "" then
  out = "assets/source/aseprite/player/prototypes/yui_idle_v5_candidate.aseprite"
end
if string.sub(out, -9) ~= ".aseprite" then
  error("output must end with .aseprite: " .. out)
end

local SIZE = 42

-- ─── Palette ────────────────────────────────────────────────────────────────
local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end
local function A(col) return app.pixelColor.rgbaA(col) end

-- Outline / deep shadow
local OUTLINE   = C(28, 22, 40)      -- near-black dark purple
-- Hood blues (HOOD_D raised so it reads on dark bg: was 36,48,88)
local HOOD_D    = C(48, 64, 112)     -- deep navy (visible on dark background)
local HOOD_M    = C(70, 96, 150)     -- mid blue
local HOOD_L    = C(106, 134, 186)   -- lighter blue highlight
local HOOD_B    = C(148, 172, 220)   -- bright spot (upper-left)
-- Hair (brown-red)
local HAIR_D    = C(78, 40, 32)      -- dark brown-red
local HAIR_M    = C(120, 64, 48)     -- mid brown-red
local HAIR_H    = C(168, 102, 76)    -- highlight
-- Skin
local SKIN      = C(252, 218, 174)   -- warm peach
local SKIN_SH   = C(222, 185, 138)   -- jaw / chin shadow
-- Eyes
local EYE_D     = C(38, 26, 42)      -- very dark eye outline/pupil
local EYE_W     = C(254, 250, 234)   -- white catchlight
local IRIS      = C(144, 94, 56)     -- warm amber-brown iris
local IRIS_D    = C(102, 60, 36)     -- dark pupil center
-- Face details
local BLUSH     = C(234, 150, 140)   -- soft cheek blush
local MOUTH     = C(142, 76, 76)     -- mouth
-- Dress / body
local DRESS     = C(220, 202, 158)   -- cream old-paper
local DRESS_SH  = C(183, 160, 120)   -- dress shadow (left side)
local DRESS_HI  = C(242, 226, 188)   -- dress highlight (right/lantern-lit)
local APRON     = C(232, 216, 178)   -- center apron panel
local HEM       = C(148, 116, 86)    -- hem band (darker, showing cloth thickness)
local HEM_SH    = C(118, 90, 66)     -- hem shadow
-- Lantern
local LAN_CAGE  = C(116, 92, 64)     -- cage frame / handle
local LAN_WARM  = C(252, 198, 96)    -- warm yellow fill
local LAN_CORE  = C(255, 250, 212)   -- bright center
local LAN_GLOW  = C(250, 180, 80, 90)-- semi-transparent warm glow
-- Shadow
local FOOT_SH   = C(16, 12, 28, 130) -- ground shadow

-- ─── Helpers ────────────────────────────────────────────────────────────────
-- Normalized squared distance from ellipse center
local function d2(nx, ny, cx, cy, rx, ry)
  local a = (nx - cx) / rx
  local b = (ny - cy) / ry
  return a * a + b * b
end

-- Paint region: test(nx,ny) → true → draw col (always overwrite)
local function paint(img, test, col)
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      local nx = (x + 0.5) / SIZE
      local ny = (y + 0.5) / SIZE
      if test(nx, ny) then img:drawPixel(x, y, col) end
    end
  end
end

-- Paint only over transparent pixels
local function paintT(img, test, col)
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      local nx = (x + 0.5) / SIZE
      local ny = (y + 0.5) / SIZE
      if test(nx, ny) and A(img:getPixel(x, y)) == 0 then
        img:drawPixel(x, y, col)
      end
    end
  end
end

-- ─── Sprite / layer setup ───────────────────────────────────────────────────
local sprite = Sprite(SIZE, SIZE, ColorMode.RGB)
-- Remove default layer and create named layers
local base_layer = sprite.layers[1]
base_layer.name = "base"

local function new_layer(name)
  local l = sprite:newLayer()
  l.name = name
  return l
end

-- Layer order (drawn bottom to top in Aseprite stack = last declared is on top)
local L_SHADOW   = base_layer
local L_DRESS    = new_layer("dress")
local L_HOOD     = new_layer("hood")
local L_HAIR     = new_layer("hair")
local L_FACE     = new_layer("face")
local L_EYES     = new_layer("eyes")
local L_CHEEKS   = new_layer("cheeks")
local L_LANTERN  = new_layer("lantern")
local L_OUTLINE  = new_layer("outline")
local L_GLOW     = new_layer("glow")

local function blank() return Image(SIZE, SIZE) end

local img_shadow  = blank()
local img_dress   = blank()
local img_hood    = blank()
local img_hair    = blank()
local img_face    = blank()
local img_eyes    = blank()
local img_cheeks  = blank()
local img_lantern = blank()
local img_outline = blank()
local img_glow    = blank()

-- ─── 1. Ground shadow ───────────────────────────────────────────────────────
paintT(img_shadow, function(nx, ny)
  return d2(nx, ny, 0.50, 0.92, 0.24, 0.050) <= 1
end, FOOT_SH)

-- ─── 2. Dress / body ────────────────────────────────────────────────────────
-- Main body trapezoid (visible below hood)
-- Hood bottom edge at cy=0.28 + ry=0.35 = 0.63  →  dress starts at ~0.60
paint(img_dress, function(nx, ny)
  if ny < 0.59 or ny > 0.89 then return false end
  local t   = (ny - 0.59) / (0.89 - 0.59)
  local hw  = 0.10 + t * 0.16   -- 0.10 at top → 0.26 at bottom
  return math.abs(nx - 0.50) <= hw
end, DRESS)

-- Left shadow strip (cloth fold)
paint(img_dress, function(nx, ny)
  if ny < 0.60 or ny > 0.88 then return false end
  local t  = (ny - 0.59) / 0.30
  local hw = 0.10 + t * 0.16
  return (nx - 0.50) <= -hw + 0.06 and (nx - 0.50) >= -hw
end, DRESS_SH)

-- Right highlight strip (lantern-lit edge)
paint(img_dress, function(nx, ny)
  if ny < 0.60 or ny > 0.88 then return false end
  local t  = (ny - 0.59) / 0.30
  local hw = 0.10 + t * 0.16
  return (nx - 0.50) >= hw - 0.05 and (nx - 0.50) <= hw
end, DRESS_HI)

-- Center apron panel
paint(img_dress, function(nx, ny)
  return ny >= 0.63 and ny <= 0.84 and math.abs(nx - 0.50) <= 0.065
end, APRON)

-- Hem band (shows cloth thickness)
paint(img_dress, function(nx, ny)
  if ny < 0.85 or ny > 0.89 then return false end
  local t  = (ny - 0.59) / 0.30
  local hw = 0.10 + t * 0.16
  return math.abs(nx - 0.50) <= hw
end, HEM)

paint(img_dress, function(nx, ny)
  if ny < 0.85 or ny > 0.86 then return false end
  local t  = (ny - 0.59) / 0.30
  local hw = 0.10 + t * 0.16
  return math.abs(nx - 0.50) <= hw
end, HEM_SH)

-- ─── 3. Hood ─────────────────────────────────────────────────────────────────
-- Hood is the DOMINANT shape. Much wider than v4.
-- cx=0.49, cy=0.27, rx=0.44, ry=0.35
-- Spans: x = 0.49 ± 0.44  = [0.05, 0.93] ≈ pixels 2–39
--        y = 0.27 ± 0.35  = [-0.08, 0.62] ≈ pixels 0–26

-- Deepest / darkest fill (full extent)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.49, 0.27, 0.44, 0.35) <= 1
end, HOOD_D)

-- Mid-blue (inner dome, slightly smaller)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.49, 0.27, 0.41, 0.32) <= 1
end, HOOD_M)

-- Light highlight zone (upper-center and slightly left)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.44, 0.21, 0.22, 0.18) <= 1
end, HOOD_L)

-- Bright specular spot (small, upper-left area)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.39, 0.15, 0.09, 0.08) <= 1
end, HOOD_B)

-- Right side of hood slightly darker (shadow from left-dominant light)
paint(img_hood, function(nx, ny)
  local in_hood = d2(nx, ny, 0.49, 0.27, 0.44, 0.35) <= 1
  local in_mid  = d2(nx, ny, 0.49, 0.27, 0.41, 0.32) <= 1
  return in_hood and not in_mid and nx > 0.55
end, HOOD_D)

-- ─── 4. Hair / bangs (over forehead, below hood front edge) ─────────────────
-- Face oval: cy=0.46, ry=0.195  →  face top at 0.46-0.195=0.265
-- Bangs sit at y=0.27 to 0.38, fringe across top of face opening

-- Main bang mass (dark center + sides)
paint(img_hair, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, 0.46, 0.175, 0.195) <= 1
  local in_fringe = ny >= 0.265 and ny <= 0.37
  local wide = math.abs(nx - 0.49) <= 0.18
  return in_face and in_fringe and wide
end, HAIR_D)

-- Mid-color over center mass (lighter within)
paint(img_hair, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, 0.46, 0.175, 0.195) <= 1
  local in_fringe = ny >= 0.28 and ny <= 0.355
  local center = math.abs(nx - 0.49) <= 0.12
  return in_face and in_fringe and center
end, HAIR_M)

-- Side hair framing (peeking out beside face)
paint(img_hair, function(nx, ny)
  local in_outer = d2(nx, ny, 0.49, 0.47, 0.205, 0.205) <= 1
  local in_inner = d2(nx, ny, 0.49, 0.46, 0.175, 0.195) <= 1
  return in_outer and not in_inner and ny >= 0.30 and ny <= 0.58
end, HAIR_D)

-- Small hair highlight
paint(img_hair, function(nx, ny)
  return d2(nx, ny, 0.42, 0.29, 0.048, 0.042) <= 1
end, HAIR_H)

-- ─── 5. Face ─────────────────────────────────────────────────────────────────
-- Face oval (cuts into hood visually)
-- Center at (0.49, 0.46), slightly lower than v4's (0.49, 0.40)
paint(img_face, function(nx, ny)
  return d2(nx, ny, 0.49, 0.46, 0.175, 0.195) <= 1
end, SKIN)

-- Jaw / lower chin shadow (lower-right of face)
paint(img_face, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, 0.46, 0.175, 0.195) <= 1
  return in_face and (nx - 0.49) + (ny - 0.46) >= 0.18
end, SKIN_SH)

-- ─── 6. Eyes ─────────────────────────────────────────────────────────────────
-- Eyes are larger than v4, positioned for wide face
-- Left eye center: (0.395, 0.445), right eye center: (0.590, 0.445)
local function draw_eye(img, ecx)
  -- Dark oval (outline) - slightly taller than v4
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, 0.445, 0.062, 0.075) <= 1
  end, EYE_D)
  -- Iris fill (warm amber)
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, 0.452, 0.044, 0.058) <= 1
  end, IRIS)
  -- Pupil / darker center
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, 0.462, 0.024, 0.030) <= 1
  end, IRIS_D)
  -- Catchlight (white highlight, upper-left corner, slightly bigger for visibility)
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx - 0.022, 0.424, 0.022, 0.024) <= 1
  end, EYE_W)
end

draw_eye(img_eyes, 0.395)
draw_eye(img_eyes, 0.590)

-- ─── 7. Cheeks ───────────────────────────────────────────────────────────────
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.345, 0.500, 0.038, 0.032) <= 1
end, BLUSH)
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.640, 0.500, 0.038, 0.032) <= 1
end, BLUSH)
-- Mouth
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.49, 0.535, 0.024, 0.018) <= 1
end, MOUTH)

-- ─── 8. Lantern ──────────────────────────────────────────────────────────────
-- Position: right side, well clear of center hitCore.
-- Handle ring (top)
paint(img_lantern, function(nx, ny)
  return d2(nx, ny, 0.815, 0.600, 0.028, 0.032) <= 1 and ny <= 0.61
end, LAN_CAGE)

-- Cage frame (rectangular outline)
paint(img_lantern, function(nx, ny)
  local inb   = nx >= 0.755 and nx <= 0.900 and ny >= 0.615 and ny <= 0.770
  local inner = nx >= 0.785 and nx <= 0.875 and ny >= 0.640 and ny <= 0.745
  return inb and not inner
end, LAN_CAGE)

-- Inner warm fill
paint(img_lantern, function(nx, ny)
  return nx >= 0.785 and nx <= 0.875 and ny >= 0.640 and ny <= 0.745
end, LAN_WARM)

-- Bright core
paint(img_lantern, function(nx, ny)
  return d2(nx, ny, 0.830, 0.692, 0.040, 0.042) <= 1
end, LAN_CORE)

-- ─── 9. Outline ──────────────────────────────────────────────────────────────
-- Composite all visible layers for outline calculation
local composite = blank()
local layers_for_outline = {
  img_dress, img_hood, img_hair, img_face, img_eyes, img_cheeks, img_lantern
}
for _, src in ipairs(layers_for_outline) do
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      local p = src:getPixel(x, y)
      if A(p) >= 200 then
        composite:drawPixel(x, y, p)
      end
    end
  end
end

for y = 0, SIZE - 1 do
  for x = 0, SIZE - 1 do
    if A(composite:getPixel(x, y)) == 0 then
      local touch = false
      for _, d in ipairs({ {1,0},{-1,0},{0,1},{0,-1} }) do
        local nx2, ny2 = x + d[1], y + d[2]
        if nx2 >= 0 and ny2 >= 0 and nx2 < SIZE and ny2 < SIZE then
          if A(composite:getPixel(nx2, ny2)) >= 200 then
            touch = true
          end
        end
      end
      if touch then img_outline:drawPixel(x, y, OUTLINE) end
    end
  end
end

-- ─── 10. Lantern glow (transparent, top layer) ───────────────────────────────
paintT(img_glow, function(nx, ny)
  return d2(nx, ny, 0.832, 0.693, 0.18, 0.18) <= 1
end, LAN_GLOW)

-- ─── Assign images to cels ───────────────────────────────────────────────────
local frame1 = sprite.frames[1]
local function set_cel(layer, img)
  local c = sprite:newCel(layer, frame1, img, Point(0, 0))
end

set_cel(L_SHADOW,  img_shadow)
set_cel(L_DRESS,   img_dress)
set_cel(L_HOOD,    img_hood)
set_cel(L_HAIR,    img_hair)
set_cel(L_FACE,    img_face)
set_cel(L_EYES,    img_eyes)
set_cel(L_CHEEKS,  img_cheeks)
set_cel(L_LANTERN, img_lantern)
set_cel(L_OUTLINE, img_outline)
set_cel(L_GLOW,    img_glow)

sprite:saveAs(out)
print("v5 candidate written: " .. out)
print("STATUS: candidate draft - requires hand-finish in Aseprite GUI")
