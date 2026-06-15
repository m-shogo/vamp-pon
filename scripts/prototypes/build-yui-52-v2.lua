-- build-yui-52-v2.lua
--
-- Yui 52px master PROTOTYPE generator v2 (V2a / V2b / V2c variants).
--
-- This is the *synthesis pass* requested by the A/B/C review
-- (docs/reviews/design-team/yui-52px-master-abc-review.md):
--   take B(charm) face + C(gameplay) readability, then fix the three
--   unsolved problems that kept every A/B/C variant under 80:
--     1. lantern floated in the air        -> add right arm + hand holding it
--     2. face was glued straight onto body  -> add neck / shoulder / collar
--     3. hood read as a mushroom / hat      -> tighten the crown
--   plus: 1x-readable eyes, tight lantern glow, 1px outline everywhere.
--
-- All three v2 variants share the SAME improvements (arm/hand/neck, tight
-- glow, rim, 1px outline, B-face base). They are NOT an A/B/C re-hash; they
-- only differ by a small charm<->gameplay bias so we can still pick a winner.
--
--   V2a: balanced synthesis (recommended baseline)
--   V2b: charm-biased   (bigger eyes / blush, lantern a touch closer)
--   V2c: gameplay-biased (strongest rim + tightest glow + cleanest center read)
--
-- IMPORTANT (per CLAUDE.md / docs/pixel-art-quality-gate.md):
--   - Lua figure generation alone is NEVER final-candidate / hand-final / final.
--   - These outputs are "prototype" status. Final decision stays `iterate`
--     unless a GUI hand-finish pass + 80pt rubric is done afterwards.
--   - Does NOT touch production sprites, production .aseprite source, or
--     gameplay constants (PLAYER_DEFAULTS / visualSize / radius / hitCore...).
--
-- Usage:
--   aseprite -b \
--     --script-param variant=V2a \
--     --script-param out=assets/source/prototypes/yui_idle_52_v2a.aseprite \
--     --script-param png=public/assets/prototypes/yui_idle_52_v2a.png \
--     --script scripts/prototypes/build-yui-52-v2.lua

local variant = app.params["variant"]
if variant ~= "V2a" and variant ~= "V2b" and variant ~= "V2c" then
  error("variant must be one of V2a / V2b / V2c, got: " .. tostring(variant))
end

local out = app.params["out"]
if out == nil or out == "" then
  out = "assets/source/prototypes/yui_idle_52_" .. string.lower(variant) .. ".aseprite"
end
if string.sub(out, 1, #"assets/source/prototypes/") ~= "assets/source/prototypes/" then
  error("refusing to write source outside assets/source/prototypes/: " .. out)
end
if string.sub(out, -9) ~= ".aseprite" then
  error("source out must end with .aseprite: " .. out)
end

local png = app.params["png"]
if png == nil or png == "" then
  png = "public/assets/prototypes/yui_idle_52_" .. string.lower(variant) .. ".png"
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
local HOOD_RIM  = C(182, 206, 244)   -- bright rim (bg separation)
-- Hair (brown-red)
local HAIR_D    = C(78, 40, 32)
local HAIR_M    = C(122, 66, 50)
local HAIR_H    = C(170, 104, 78)
-- Skin
local SKIN      = C(252, 218, 174)
local SKIN_SH   = C(222, 185, 138)
-- Eyes
local EYE_D     = C(30, 20, 34)      -- darker than master for 1x contrast
local EYE_W     = C(255, 252, 240)
local IRIS      = C(156, 102, 60)
local IRIS_D    = C(92, 52, 30)      -- darker pupil for 1x contrast
-- Face details
local BLUSH     = C(238, 152, 142)
local MOUTH     = C(150, 80, 78)
-- Dress / body
local DRESS     = C(222, 204, 160)
local DRESS_SH  = C(184, 161, 121)
local DRESS_HI  = C(244, 228, 190)
local APRON     = C(234, 218, 180)
local COLLAR    = C(168, 146, 110)   -- collar band (neck read)
local HEM       = C(150, 118, 88)
local HEM_SH    = C(120, 92, 68)
-- Lantern
local LAN_CAGE  = C(118, 94, 66)
local LAN_CAGE_D= C(92, 72, 50)
local LAN_WARM  = C(252, 198, 96)
local LAN_CORE  = C(255, 250, 212)
local LAN_GLOW_TIGHT = C(250, 184, 90, 110)
-- Shadow
local FOOT_SH   = C(16, 12, 28, 130)

-- ─── Per-variant config ──────────────────────────────────────────────────────
-- Shared base = B face + C readability + arm/hand/neck.
-- Variants only bias charm <-> gameplay slightly.
local cfg
if variant == "V2a" then        -- balanced synthesis (recommended)
  cfg = {
    hood_rx = 0.41, hood_ry = 0.300, hood_cy = 0.300,
    face_cy = 0.46, face_rx = 0.180, face_ry = 0.205,
    eye_scale = 1.12, double_catchlight = true, blush_scale = 1.20,
    lantern_cx = 0.790, rim = "med", glow_r = 0.105,
    hand_nx = 0.770,
  }
elseif variant == "V2b" then     -- charm-biased
  cfg = {
    hood_rx = 0.42, hood_ry = 0.310, hood_cy = 0.295,
    face_cy = 0.46, face_rx = 0.183, face_ry = 0.208,
    eye_scale = 1.18, double_catchlight = true, blush_scale = 1.32,
    lantern_cx = 0.775, rim = "soft", glow_r = 0.110,
    hand_nx = 0.758,
  }
else                              -- V2c gameplay-biased
  cfg = {
    hood_rx = 0.40, hood_ry = 0.295, hood_cy = 0.305,
    face_cy = 0.46, face_rx = 0.178, face_ry = 0.202,
    eye_scale = 1.10, double_catchlight = false, blush_scale = 1.08,
    lantern_cx = 0.805, rim = "strong", glow_r = 0.098,
    hand_nx = 0.788,
  }
end

-- ─── Helpers ─────────────────────────────────────────────────────────────────
local function d2(nx, ny, cx, cy, rx, ry)
  local a = (nx - cx) / rx
  local b = (ny - cy) / ry
  return a * a + b * b
end

-- distance (normalized) from point to segment p1->p2
local function seg_d(nx, ny, x1, y1, x2, y2)
  local dx, dy = x2 - x1, y2 - y1
  local len2 = dx * dx + dy * dy
  local t = 0
  if len2 > 0 then
    t = ((nx - x1) * dx + (ny - y1) * dy) / len2
    if t < 0 then t = 0 elseif t > 1 then t = 1 end
  end
  local px, py = x1 + t * dx, y1 + t * dy
  local ex, ey = nx - px, ny - py
  return math.sqrt(ex * ex + ey * ey)
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
local L_ARM      = new_layer("arm")      -- NEW v2: right arm/sleeve/hand
local L_NECK     = new_layer("neck")     -- NEW v2: neck + collar
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
local img_arm     = blank()
local img_neck    = blank()
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
local fc_cy, fc_rx, fc_ry = cfg.face_cy, cfg.face_rx, cfg.face_ry
local face_bot = fc_cy + fc_ry
-- shoulders start a touch below the chin so a neck can read between them
local dress_top = face_bot + 0.045
local dress_bot = 0.90
local function dress_hw(ny)
  local t = (ny - dress_top) / (dress_bot - dress_top)
  if t < 0 then t = 0 end
  -- shoulders slightly wider at the very top, then settle to a gentle taper
  return 0.155 + t * 0.130
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
  return ny >= dress_top + 0.05 and ny <= dress_bot - 0.05 and math.abs(nx - 0.50) <= 0.07
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

-- ─── 3. Neck + collar (face no longer glued to the body) ─────────────────────
-- short skin neck column tucked under the chin
paint(img_neck, function(nx, ny)
  return ny >= face_bot - 0.045 and ny <= dress_top + 0.02
     and math.abs(nx - 0.49) <= 0.058
end, SKIN)
-- neck core shadow (under the chin)
paint(img_neck, function(nx, ny)
  return ny >= face_bot - 0.045 and ny <= face_bot + 0.01
     and math.abs(nx - 0.49) <= 0.058
end, SKIN_SH)
-- collar band: a soft V where the dress meets the neck = shoulder/collar read
paint(img_neck, function(nx, ny)
  if ny < dress_top - 0.005 or ny > dress_top + 0.05 then return false end
  local dx = math.abs(nx - 0.50)
  local v = (ny - dress_top) * 1.6           -- widens downward => V neckline
  return dx <= 0.15 and dx >= 0.045 - v and dx <= 0.105 + v
end, COLLAR)

-- ─── 4. Right arm + hand holding the lantern (the key v2 fix) ─────────────────
-- shoulder root on the body, wrist out at the lantern handle.
local sh_x, sh_y = 0.625, dress_top + 0.045      -- shoulder
local wr_x, wr_y = cfg.hand_nx, 0.660            -- wrist / hand
-- sleeve: thick capsule from shoulder to wrist
paint(img_arm, function(nx, ny)
  return seg_d(nx, ny, sh_x, sh_y, wr_x, wr_y) <= 0.052
end, DRESS)
-- sleeve underside shadow
paint(img_arm, function(nx, ny)
  return seg_d(nx, ny, sh_x, sh_y + 0.015, wr_x, wr_y + 0.015) <= 0.030
end, DRESS_SH)
-- cuff at the wrist
paint(img_arm, function(nx, ny)
  return d2(nx, ny, wr_x - 0.01, wr_y - 0.01, 0.040, 0.040) <= 1
end, DRESS_HI)
-- hand (skin) gripping the handle
paint(img_arm, function(nx, ny)
  return d2(nx, ny, wr_x, wr_y + 0.012, 0.034, 0.030) <= 1
end, SKIN)
paint(img_arm, function(nx, ny)
  return d2(nx, ny, wr_x + 0.006, wr_y + 0.022, 0.030, 0.020) <= 1
end, SKIN_SH)

-- ─── 5. Hood (tightened crown: round cloth, NOT a mushroom/hat) ───────────────
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.49, cfg.hood_cy, cfg.hood_rx, cfg.hood_ry) <= 1
end, HOOD_D)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.49, cfg.hood_cy, cfg.hood_rx - 0.03, cfg.hood_ry - 0.03) <= 1
end, HOOD_M)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.45, cfg.hood_cy - 0.04, 0.205, 0.150) <= 1
end, HOOD_L)
-- small soft top sheen (kept low + narrow so it is cloth, not a domed cap)
paint(img_hood, function(nx, ny)
  return d2(nx, ny, 0.42, cfg.hood_cy - 0.075, 0.085, 0.060) <= 1
end, HOOD_B)
-- right side slightly darker (left-dominant light)
paint(img_hood, function(nx, ny)
  local in_hood = d2(nx, ny, 0.49, cfg.hood_cy, cfg.hood_rx, cfg.hood_ry) <= 1
  local in_mid  = d2(nx, ny, 0.49, cfg.hood_cy, cfg.hood_rx - 0.03, cfg.hood_ry - 0.03) <= 1
  return in_hood and not in_mid and nx > 0.56
end, HOOD_D)
-- hood cloth dipping past the cheeks (frames the face, hides the "stalk")
paint(img_hood, function(nx, ny)
  local side = d2(nx, ny, 0.49, cfg.hood_cy + 0.05, cfg.hood_rx, cfg.hood_ry + 0.07) <= 1
  local inner = d2(nx, ny, 0.49, fc_cy, fc_rx + 0.02, fc_ry + 0.02) <= 1
  return side and not inner and ny <= fc_cy + 0.04 and math.abs(nx - 0.49) >= fc_rx
end, HOOD_M)

-- ─── 6. Hair / bangs (pulled up a touch so eyes are not under hair shadow) ────
local face_top = fc_cy - fc_ry
paint(img_hair, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
  local fringe = ny >= face_top - 0.005 and ny <= face_top + 0.095
  return in_face and fringe and math.abs(nx - 0.49) <= 0.19
end, HAIR_D)
paint(img_hair, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
  local fringe = ny >= face_top + 0.010 and ny <= face_top + 0.072
  return in_face and fringe and math.abs(nx - 0.49) <= 0.12
end, HAIR_M)
-- side hair framing
paint(img_hair, function(nx, ny)
  local in_outer = d2(nx, ny, 0.49, fc_cy + 0.01, fc_rx + 0.03, fc_ry + 0.012) <= 1
  local in_inner = d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
  return in_outer and not in_inner and ny >= face_top + 0.04 and ny <= fc_cy + fc_ry - 0.02
end, HAIR_D)
paint(img_hair, function(nx, ny)
  return d2(nx, ny, 0.42, face_top + 0.045, 0.05, 0.038) <= 1
end, HAIR_H)

-- ─── 7. Face ─────────────────────────────────────────────────────────────────
paint(img_face, function(nx, ny)
  return d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
end, SKIN)
paint(img_face, function(nx, ny)
  local in_face = d2(nx, ny, 0.49, fc_cy, fc_rx, fc_ry) <= 1
  return in_face and (nx - 0.49) + (ny - fc_cy) >= 0.18
end, SKIN_SH)

-- ─── 8. Eyes (raised + higher contrast for 1x readability) ───────────────────
local eye_y = fc_cy - 0.024            -- review: raise ~0.01 from master
local eye_dx = fc_rx * 0.58
local function draw_eye(img, ecx)
  local s = cfg.eye_scale
  -- dark eye base (slightly taller for a clear 1x dot)
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, eye_y, 0.062 * s, 0.078 * s) <= 1
  end, EYE_D)
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, eye_y + 0.008, 0.044 * s, 0.058 * s) <= 1
  end, IRIS)
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx, eye_y + 0.017, 0.024 * s, 0.030 * s) <= 1
  end, IRIS_D)
  -- main catchlight (upper-left) - bigger so it survives 1x
  paint(img, function(nx, ny)
    return d2(nx, ny, ecx - 0.020, eye_y - 0.022, 0.023 * s, 0.025 * s) <= 1
  end, EYE_W)
  -- secondary catchlight (lower-right) for charm variants
  if cfg.double_catchlight then
    paint(img, function(nx, ny)
      return d2(nx, ny, ecx + 0.017, eye_y + 0.026, 0.011, 0.012) <= 1
    end, EYE_W)
  end
end
draw_eye(img_eyes, 0.49 - eye_dx)
draw_eye(img_eyes, 0.49 + eye_dx)

-- ─── 9. Cheeks + mouth ───────────────────────────────────────────────────────
local bs = cfg.blush_scale
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.49 - fc_rx * 0.82, fc_cy + 0.055, 0.036 * bs, 0.030 * bs) <= 1
end, BLUSH)
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.49 + fc_rx * 0.82, fc_cy + 0.055, 0.036 * bs, 0.030 * bs) <= 1
end, BLUSH)
paint(img_cheeks, function(nx, ny)
  return d2(nx, ny, 0.49, fc_cy + 0.090, 0.020, 0.015) <= 1
end, MOUTH)

-- ─── 10. Lantern (resting on the hand, clear of center hitCore) ──────────────
local lcx = cfg.lantern_cx
local lcy = wr_y + 0.085               -- body hangs just below the hand
-- handle ring sits at / under the hand
paint(img_lantern, function(nx, ny)
  local ring = d2(nx, ny, lcx, lcy - 0.075, 0.026, 0.030) <= 1
  local hole = d2(nx, ny, lcx, lcy - 0.075, 0.013, 0.016) <= 1
  return ring and not hole and ny <= lcy - 0.060
end, LAN_CAGE)
-- top cap
paint(img_lantern, function(nx, ny)
  return math.abs(nx - lcx) <= 0.050 and ny >= lcy - 0.050 and ny <= lcy - 0.030
end, LAN_CAGE_D)
-- cage frame
paint(img_lantern, function(nx, ny)
  local inb   = math.abs(nx - lcx) <= 0.050 and ny >= lcy - 0.030 and ny <= lcy + 0.085
  local inner = math.abs(nx - lcx) <= 0.034 and ny >= lcy - 0.015 and ny <= lcy + 0.072
  return inb and not inner
end, LAN_CAGE)
-- warm fill
paint(img_lantern, function(nx, ny)
  return math.abs(nx - lcx) <= 0.034 and ny >= lcy - 0.015 and ny <= lcy + 0.072
end, LAN_WARM)
-- bright core
paint(img_lantern, function(nx, ny)
  return d2(nx, ny, lcx, lcy + 0.028, 0.026, 0.032) <= 1
end, LAN_CORE)
-- base foot
paint(img_lantern, function(nx, ny)
  return math.abs(nx - lcx) <= 0.044 and ny >= lcy + 0.085 and ny <= lcy + 0.100
end, LAN_CAGE_D)

-- ─── 11. Rim light (dark-bg separation; strength per variant) ────────────────
-- bright edge on the hood's left/upper side; V2c also rims the left shoulder.
local rim_reach = (cfg.rim == "strong" and 0.62) or (cfg.rim == "med" and 0.56) or 0.50
local function rim_from(src_img)
  for y = 0, SIZE - 1 do
    for x = 0, SIZE - 1 do
      if A(src_img:getPixel(x, y)) >= 200 then
        local lx, ty = x - 1, y - 1
        local left_empty = lx < 0 or A(src_img:getPixel(lx, y)) == 0
        local top_empty  = ty < 0 or A(src_img:getPixel(x, ty)) == 0
        if (left_empty or top_empty) then
          local nx = (x + 0.5) / SIZE
          if nx < rim_reach then img_rim:drawPixel(x, y, HOOD_RIM) end
        end
      end
    end
  end
end
rim_from(img_hood)
if cfg.rim == "strong" then rim_from(img_dress) end

-- ─── 12. Outline (1px everywhere) ────────────────────────────────────────────
local composite = blank()
local layers_for_outline = {
  img_dress, img_arm, img_neck, img_hood, img_hair, img_face,
  img_eyes, img_cheeks, img_lantern,
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

dilate_outline()   -- exactly 1px (A's heavy 2px outline is forbidden)

-- ─── 13. Lantern glow (tight; never reaches center hitCore or pickups) ───────
paintT(img_glow, function(nx, ny)
  return d2(nx, ny, lcx, lcy + 0.028, cfg.glow_r, cfg.glow_r) <= 1
end, LAN_GLOW_TIGHT)

-- ─── Assign cels ─────────────────────────────────────────────────────────────
local frame1 = sprite.frames[1]
local function set_cel(layer, img) sprite:newCel(layer, frame1, img, Point(0, 0)) end
set_cel(L_SHADOW,  img_shadow)
set_cel(L_DRESS,   img_dress)
set_cel(L_ARM,     img_arm)
set_cel(L_NECK,    img_neck)
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
print("yui 52 master prototype v2 written: variant=" .. variant)
print("  source: " .. out)
print("  png:    " .. png)
print("STATUS: prototype (Lua bootstrap; NOT final-candidate / hand-final). Final decision: iterate.")
