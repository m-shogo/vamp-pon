-- build-yui-52-master.lua
--
-- Yui 52px master PROTOTYPE generator (A / B / C variants).
-- This is a *prototype bootstrap*, NOT a production / hand-final asset.
-- It exists only to compare three direction emphases for the 52px master:
--
--   A: silhouette-first  - read "this is Yui" instantly at small size
--   B: charm-first       - cute / lovable face, soft worried-but-kind mood
--   C: gameplay-first    - never lost on dark vertical mobile bg, clean hitCore read
--
-- IMPORTANT (per CLAUDE.md / pixel-art-quality-gate.md):
--   - Lua figure generation alone is NEVER final-candidate / hand-final / final.
--   - These outputs are "prototype" status. Final decision stays `iterate`.
--   - Does NOT touch production sprites, production .aseprite source, or gameplay constants.
--
-- Yui fixed identity (docs/114 + CLAUDE.md sec.5):
--   round large BLUE hood / brown-red bangs / big cute face with white-catchlight eyes /
--   soft blush / cream old-paper dress with cloth thickness / RIGHT-side lantern /
--   lantern is a memory-reading light, must not read as hitCore /
--   soft shading / not-too-strong outline.
--
-- Usage:
--   aseprite -b \
--     --script-param variant=A \
--     --script-param out=assets/source/prototypes/yui_idle_52_A.aseprite \
--     --script-param png=public/assets/prototypes/yui_idle_52_A.png \
--     --script scripts/prototypes/build-yui-52-master.lua

local variant = app.params["variant"]
if variant ~= "A" and variant ~= "B" and variant ~= "C" then
  error("variant must be one of A / B / C, got: " .. tostring(variant))
end

local out = app.params["out"]
if out == nil or out == "" then
  out = "assets/source/prototypes/yui_idle_52_" .. variant .. ".aseprite"
end
if string.sub(out, 1, #"assets/source/prototypes/") ~= "assets/source/prototypes/" then
  error("refusing to write source outside assets/source/prototypes/: " .. out)
end
if string.sub(out, -9) ~= ".aseprite" then
  error("source out must end with .aseprite: " .. out)
end

local png = app.params["png"]
if png == nil or png == "" then
  png = "public/assets/prototypes/yui_idle_52_" .. variant .. ".png"
end
if string.sub(png, 1, #"public/assets/prototypes/") ~= "public/assets/prototypes/" then
  error("refusing to export png outside public/assets/prototypes/: " .. png)
end
if string.sub(png, -4) ~= ".png" then
  error("png out must end with .png: " .. png)
end

local SIZE = 52

-- ─── Palette ────────────────────────────────────────────────────────────────
local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end
local function A(col) return app.pixelColor.rgbaA(col) end

local OUTLINE   = C(28, 22, 40)
-- Hood blues
local HOOD_D    = C(48, 64, 112)
local HOOD_M    = C(72, 100, 156)
local HOOD_L    = C(112, 142, 196)
local HOOD_B    = C(156, 184, 228)
local HOOD_RIM  = C(176, 200, 240)   -- bright rim (C: bg separation)
-- Hair (brown-red)
local HAIR_D    = C(78, 40, 32)
local HAIR_M    = C(122, 66, 50)
local HAIR_H    = C(170, 104, 78)
-- Skin
local SKIN      = C(252, 218, 174)
local SKIN_SH   = C(222, 185, 138)
-- Eyes
local EYE_D     = C(38, 26, 42)
local EYE_W     = C(254, 250, 234)
local IRIS      = C(150, 98, 58)
local IRIS_D    = C(102, 60, 36)
-- Face details
local BLUSH     = C(236, 152, 142)
local MOUTH     = C(150, 80, 78)
-- Dress / body
local DRESS     = C(222, 204, 160)
local DRESS_SH  = C(184, 161, 121)
local DRESS_HI  = C(244, 228, 190)
local APRON     = C(234, 218, 180)
local HEM       = C(150, 118, 88)
local HEM_SH    = C(120, 92, 68)
-- Lantern
local LAN_CAGE  = C(118, 94, 66)
local LAN_WARM  = C(252, 198, 96)
local LAN_CORE  = C(255, 250, 212)
local LAN_GLOW  = C(250, 180, 80, 80)
local LAN_GLOW_TIGHT = C(250, 184, 90, 110)
-- Shadow
local FOOT_SH   = C(16, 12, 28, 130)

-- ─── Per-variant config ──────────────────────────────────────────────────────
-- A: silhouette-first  B: charm-first  C: gameplay-first
local cfg
if variant == "A" then
  cfg = {
    hood_rx = 0.47, hood_ry = 0.36, hood_cy = 0.26,
    face_cy = 0.45, face_rx = 0.165, face_ry = 0.185,
    eye_scale = 1.00, double_catchlight = false, blush_scale = 1.0,
    lantern_cx = 0.815, lantern_cy = 0.605,
    glow = "soft", rim = false, outline_px = 2,
    hood_top = HOOD_B,
  }
elseif variant == "B" then
  cfg = {
    hood_rx = 0.43, hood_ry = 0.35, hood_cy = 0.27,
    face_cy = 0.47, face_rx = 0.180, face_ry = 0.205,
    eye_scale = 1.15, double_catchlight = true, blush_scale = 1.25,
    lantern_cx = 0.775, lantern_cy = 0.575,
    glow = "soft", rim = false, outline_px = 1,
    hood_top = HOOD_B,
  }
else -- C
  cfg = {
    hood_rx = 0.44, hood_ry = 0.34, hood_cy = 0.27,
    face_cy = 0.46, face_rx = 0.170, face_ry = 0.190,
    eye_scale = 1.05, double_catchlight = false, blush_scale = 1.0,
    lantern_cx = 0.845, lantern_cy = 0.610,
    glow = "tight", rim = true, outline_px = 1,
    hood_top = HOOD_RIM,
  }
end

-- ─── Helpers ─────────────────────────────────────────────────────────────────
local function d2(nx, ny, cx, cy, rx, ry)
  local a = (nx - cx) / rx
  local b = (ny - cy) / ry
  return a * a + b * b
end

local function paint(img, test, col)
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      local nx = (x + 0.5) / SIZE
      local ny = (y + 0.5) / SIZE
      if test(nx, ny) then img:drawPixel(x, y, col) end
    end
  end
end

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

-- ─── Sprite / layers ─────────────────────────────────────────────────────────
local sprite = Sprite(SIZE, SIZE, ColorMode.RGB)
local base_layer = sprite.layers[1]
base_layer.name = "shadow"

local function new_layer(name)
  local l = sprite:newLayer()
  l.name = name
  return l
end

local L_SHADOW   = base_layer
local L_DRESS    = new_layer("dress")
local L_HOOD     = new_layer("hood")
local L_HAIR     = new_layer("hair")
local L_FACE     = new_layer("face")
local L_EYES     = new_layer("eyes")
local L_CHEEKS   = new_layer("cheeks")
local L_LANTERN  = new_layer("lantern")
local L_RIM      = new_layer("rim")
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
local img_rim     = blank()
local img_outline = blank()
local img_glow    = blank()

-- ─── 1. Ground shadow ────────────────────────────────────────────────────────
paintT(img_shadow, function(nx, ny)
  return d2(nx, ny, 0.50, 0.93, 0.25, 0.045) <= 1
end, FOOT_SH)

-- ─── 2. Dress / body (trapezoid, NOT a plain triangle) ───────────────────────
local dress_top = cfg.hood_cy + cfg.hood_ry - 0.04
local dress_bot = 0.90
local function dress_hw(ny)
  local t = (ny - dress_top) / (dress_bot - dress_top)
  return 0.12 + t * 0.16
end
paint(img_dress, function(nx, ny)
  if ny < dress_top or ny > dress_bot then return false end
  return math.abs(nx - 0.50) <= dress_hw(ny)
end, DRESS)
-- left fold shadow
paint(img_dress, function(nx, ny)
  if ny < dress_top + 0.01 or ny > dress_bot - 0.01 then return false end
  local hw = dress_hw(ny)
  return (nx - 0.50) <= -hw + 0.06 and (nx - 0.50) >= -hw
end, DRESS_SH)
-- right lantern-lit highlight
paint(img_dress, function(nx, ny)
  if ny < dress_top + 0.01 or ny > dress_bot - 0.01 then return false end
  local hw = dress_hw(ny)
  return (nx - 0.50) >= hw - 0.05 and (nx - 0.50) <= hw
end, DRESS_HI)
-- center apron panel
paint(img_dress, function(nx, ny)
  return ny >= dress_top + 0.04 and ny <= dress_bot - 0.05 and math.abs(nx - 0.50) <= 0.07
end, APRON)
-- hem band (cloth thickness)
paint(img_dress, function(nx, ny)
  if ny < dress_bot - 0.05 or ny > dress_bot then return false end
  return math.abs(nx - 0.50) <= dress_hw(ny)
end, HEM)
paint(img_dress, function(nx, ny)
  if ny < dress_bot - 0.02 or ny > dress_bot - 0.005 then return false end
  return math.abs(nx - 0.50) <= dress_hw(ny)
end, HEM_SH)

-- ─── 3. Hood (dominant round blue shape) ─────────────────────────────────────
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.49, cfg.hood_cy, cfg.hood_rx, cfg.hood_ry) <= 1
end, HOOD_D)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.49, cfg.hood_cy, cfg.hood_rx - 0.03, cfg.hood_ry - 0.03) <= 1
end, HOOD_M)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.44, cfg.hood_cy - 0.06, 0.23, 0.18) <= 1
end, HOOD_L)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.39, cfg.hood_cy - 0.12, 0.10, 0.085) <= 1
end, cfg.hood_top)
-- right side slightly darker (left-dominant light)
paint(img_hood, function(nx, ny)
  local in_hood = d2(nx, ny, 0.49, cfg.hood_cy, cfg.hood_rx, cfg.hood_ry) <= 1
  local in_mid  = d2(nx, ny, 0.49, cfg.hood_cy, cfg.hood_rx - 0.03, cfg.hood_ry - 0.03) <= 1
  return in_hood and not in_mid and nx > 0.56
end, HOOD_D)

-- ─── 4. Hair / bangs ─────────────────────────────────────────────────────────
local fc_cy, fc_rx, fc_ry = cfg.face_cy, cfg.face_rx, cfg.face_ry
local face_top = fc_cy - fc_ry
paint(img_hair, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
  local fringe = ny >= face_top - 0.005 and ny <= face_top + 0.11
  return in_face and fringe and math.abs(nx - 0.49) <= 0.19
end, HAIR_D)
paint(img_hair, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
  local fringe = ny >= face_top + 0.012 and ny <= face_top + 0.085
  return in_face and fringe and math.abs(nx - 0.49) <= 0.12
end, HAIR_M)
-- side hair framing
paint(img_hair, function(nx, ny)
  local in_outer = d2(nx, ny, 0.49, fc_cy + 0.01, fc_rx + 0.03, fc_ry + 0.012) <= 1
  local in_inner = d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
  return in_outer and not in_inner and ny >= face_top + 0.04 and ny <= fc_cy + fc_ry - 0.02
end, HAIR_D)
paint(img_hair, function(nx, ny)
  return d2(nx, ny, 0.42, face_top + 0.05, 0.05, 0.04) <= 1
end, HAIR_H)

-- ─── 5. Face ─────────────────────────────────────────────────────────────────
paint(img_face, function(nx, ny)
  return d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
end, SKIN)
paint(img_face, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
  return in_face and (nx - 0.49) + (ny - fc_cy) >= 0.18
end, SKIN_SH)

-- ─── 6. Eyes ─────────────────────────────────────────────────────────────────
local eye_y = fc_cy - 0.012
local eye_dx = fc_rx * 0.58
local function draw_eye(img, ecx)
  local s = cfg.eye_scale
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, eye_y, 0.060 * s, 0.073 * s) <= 1
  end, EYE_D)
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, eye_y + 0.007, 0.042 * s, 0.056 * s) <= 1
  end, IRIS)
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, eye_y + 0.016, 0.023 * s, 0.029 * s) <= 1
  end, IRIS_D)
  -- main catchlight (upper-left)
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx - 0.020, eye_y - 0.020, 0.020 * s, 0.022 * s) <= 1
  end, EYE_W)
  -- secondary catchlight (lower-right) for charm variant
  if cfg.double_catchlight then
    paint(img, function(nx, ny)
      return d2(nx, ny, ecx + 0.016, eye_y + 0.024, 0.010, 0.011) <= 1
    end, EYE_W)
  end
end
draw_eye(img_eyes, 0.49 - eye_dx)
draw_eye(img_eyes, 0.49 + eye_dx)

-- ─── 7. Cheeks + mouth ───────────────────────────────────────────────────────
local bs = cfg.blush_scale
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.49 - fc_rx * 0.82, fc_cy + 0.05, 0.036 * bs, 0.030 * bs) <= 1
end, BLUSH)
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.49 + fc_rx * 0.82, fc_cy + 0.05, 0.036 * bs, 0.030 * bs) <= 1
end, BLUSH)
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.49, fc_cy + 0.085, 0.022, 0.016) <= 1
end, MOUTH)

-- ─── 8. Lantern (right side, clear of center hitCore) ────────────────────────
local lcx, lcy = cfg.lantern_cx, cfg.lantern_cy
-- handle ring
paint(img_lantern, function(nx, ny)
  return d2(nx, ny, lcx, lcy - 0.055, 0.026, 0.030) <= 1 and ny <= lcy - 0.045
end, LAN_CAGE)
-- cage frame
paint(img_lantern, function(nx, ny)
  local inb   = math.abs(nx - lcx) <= 0.072 and ny >= lcy - 0.02 and ny <= lcy + 0.13
  local inner = math.abs(nx - lcx) <= 0.046 and ny >= lcy + 0.005 and ny <= lcy + 0.108
  return inb and not inner
end, LAN_CAGE)
-- warm fill
paint(img_lantern, function(nx, ny)
  return math.abs(nx - lcx) <= 0.046 and ny >= lcy + 0.005 and ny <= lcy + 0.108
end, LAN_WARM)
-- bright core
paint(img_lantern, function(nx, ny)
  return d2(nx, ny, lcx, lcy + 0.055, 0.034, 0.038) <= 1
end, LAN_CORE)

-- ─── 9. Rim light (gameplay variant only) ────────────────────────────────────
-- bright 1px-ish edge on the hood's left/upper side for dark-bg separation.
if cfg.rim then
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      if A(img_hood:getPixel(x, y)) >= 200 then
        -- left & top neighbours empty => edge facing the light
        local lx, ty = x - 1, y - 1
        local left_empty = lx < 0 or A(img_hood:getPixel(lx, y)) == 0
        local top_empty  = ty < 0 or A(img_hood:getPixel(x, ty)) == 0
        if (left_empty or top_empty) then
          local nx = (x + 0.5) / SIZE
          if nx < 0.58 then img_rim:drawPixel(x, y, HOOD_RIM) end
        end
      end
    end
  end
end

-- ─── 10. Outline ─────────────────────────────────────────────────────────────
local composite = blank()
local layers_for_outline = {
  img_dress, img_hood, img_hair, img_face, img_eyes, img_cheeks, img_lantern,
}
for _, src in ipairs(layers_for_outline) do
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      local p = src:getPixel(x, y)
      if A(p) >= 200 then composite:drawPixel(x, y, p) end
    end
  end
end

local function dilate_outline()
  local added = blank()
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      if A(composite:getPixel(x, y)) == 0 and A(img_outline:getPixel(x, y)) == 0 then
        local touch = false
        for _, d in ipairs({ {1,0},{-1,0},{0,1},{0,-1} }) do
          local nx2, ny2 = x + d[1], y + d[2]
          if nx2 >= 0 and ny2 >= 0 and nx2 < SIZE and ny2 < SIZE then
            if A(composite:getPixel(nx2, ny2)) >= 200 or A(img_outline:getPixel(nx2, ny2)) >= 200 then
              touch = true
            end
          end
        end
        if touch then added:drawPixel(x, y, OUTLINE) end
      end
    end
  end
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      if A(added:getPixel(x, y)) >= 200 then img_outline:drawPixel(x, y, OUTLINE) end
    end
  end
end

for _ = 1, cfg.outline_px do dilate_outline() end

-- ─── 11. Lantern glow (transparent top) ──────────────────────────────────────
if cfg.glow == "tight" then
  paintT(img_glow, function(nx, ny)
    return d2(nx, ny, lcx, lcy + 0.055, 0.12, 0.12) <= 1
  end, LAN_GLOW_TIGHT)
else
  paintT(img_glow, function(nx, ny)
    return d2(nx, ny, lcx, lcy + 0.055, 0.19, 0.19) <= 1
  end, LAN_GLOW)
end

-- ─── Assign cels ─────────────────────────────────────────────────────────────
local frame1 = sprite.frames[1]
local function set_cel(layer, img) sprite:newCel(layer, frame1, img, Point(0, 0)) end
set_cel(L_SHADOW,  img_shadow)
set_cel(L_DRESS,   img_dress)
set_cel(L_HOOD,    img_hood)
set_cel(L_HAIR,    img_hair)
set_cel(L_FACE,    img_face)
set_cel(L_EYES,    img_eyes)
set_cel(L_CHEEKS,  img_cheeks)
set_cel(L_LANTERN, img_lantern)
set_cel(L_RIM,     img_rim)
set_cel(L_OUTLINE, img_outline)
set_cel(L_GLOW,    img_glow)

sprite:saveAs(out)
sprite:saveCopyAs(png)
print("yui 52 master prototype written: variant=" .. variant)
print("  source: " .. out)
print("  png:    " .. png)
print("STATUS: prototype (NOT final-candidate / hand-final). Final decision: iterate.")
