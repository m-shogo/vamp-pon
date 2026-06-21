-- build-yui-idle-52-draft.lua
--
-- Yui idle MASTER DRAFT at 52px (prototype / draft only).
--
-- Goal: design Yui as a long-loved mascot/protagonist, not just fix 42px.
-- 52px gives room for: bigger readable cute face, bang strand detail, rounder
-- hood, thicker old-paper dress with a red hem + bookmark cord, a lantern that
-- clearly connects to the right arm/hand and holds a small "memory light", and
-- a strong protagonist silhouette (hood / face / body / lantern proportion).
--
-- This is authored at pixel precision in 52px space. It is a SCRIPT source-prep
-- DRAFT, NOT a GUI hand-finished asset, and must NOT touch production.
--
-- Output (DRAFT, never production):
--   assets/source/aseprite/player/prototypes/yui_idle_52_draft.aseprite
--
-- Usage:
--   aseprite -b \
--     --script-param out=.../prototypes/yui_idle_52_draft.aseprite \
--     --script scripts/aseprite/build-yui-idle-52-draft.lua

local out = app.params["out"]
if out == nil or out == "" then
  out = "assets/source/aseprite/player/prototypes/yui_idle_52_draft.aseprite"
end
if string.sub(out, -9) ~= ".aseprite" then
  error("output must end with .aseprite: " .. out)
end

local W, H = 52, 52

-- ─── Palette (soft painterly) ────────────────────────────────────────────────
local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end
local function A(c) return app.pixelColor.rgbaA(c) end

local OUTLINE  = C(30, 24, 42)

local CLOAK_D  = C(34, 44, 80)
local CLOAK_M  = C(48, 62, 104)

local HOOD_D   = C(46, 60, 104)
local HOOD_M   = C(66, 90, 142)
local HOOD_L   = C(98, 126, 178)
local HOOD_B   = C(142, 168, 214)
local HOOD_IN  = C(38, 48, 84)

local HAIR_D   = C(74, 38, 32)
local HAIR_M   = C(116, 62, 46)
local HAIR_H   = C(168, 102, 76)

local SKIN     = C(252, 220, 178)
local SKIN_M   = C(238, 200, 156)
local SKIN_SH  = C(216, 176, 132)

local EYE_D    = C(40, 28, 44)
local IRIS     = C(150, 98, 58)
local IRIS_M   = C(186, 130, 84)
local IRIS_D   = C(102, 60, 38)
local EYE_W    = C(255, 252, 240)

local BLUSH    = C(236, 156, 144)
local BROW     = C(96, 54, 44)
local MOUTH    = C(150, 84, 82)

local DRESS    = C(224, 206, 162)
local DRESS_K  = C(190, 168, 126)
local DRESS_H  = C(244, 230, 194)
local APRON    = C(236, 222, 186)
local COLLAR   = C(246, 234, 200)
local HEM      = C(168, 96, 78)
local HEM_D    = C(128, 70, 58)
local CORD     = C(176, 84, 70)    -- bookmark cord (red)
local CORD_T   = C(214, 120, 96)   -- cord tassel highlight

local LEG      = C(214, 174, 130)
local BOOT     = C(58, 44, 54)
local BOOT_H   = C(90, 74, 84)

local SLEEVE   = C(214, 196, 154)
local SLEEVE_K = C(184, 162, 122)
local HAND     = C(248, 214, 172)
local LAN_C    = C(108, 84, 58)
local LAN_C2   = C(142, 114, 80)
local LAN_G    = C(250, 196, 92)
local LAN_GH   = C(255, 232, 150)
local LAN_CORE = C(255, 252, 224)
local LAN_SPK  = C(255, 246, 236)  -- tiny memory-light spark
local LAN_GLOW = C(250, 184, 84, 70)

local FOOT_SH  = C(14, 10, 26, 120)

-- ─── Canvas helpers ──────────────────────────────────────────────────────────
local sprite = Sprite(W, H, ColorMode.RGB)
local function blank() return Image(W, H) end
local function setpx(img, x, y, c)
  if x >= 0 and y >= 0 and x < W and y < H then img:drawPixel(x, y, c) end
end
local function inEll(x, y, cx, cy, rx, ry)
  local a = (x + 0.5 - cx) / rx
  local b = (y + 0.5 - cy) / ry
  return a * a + b * b <= 1.0
end

local img_shadow  = blank()
local img_cloak   = blank()
local img_dress   = blank()
local img_legs    = blank()
local img_hood    = blank()
local img_face    = blank()
local img_hair    = blank()
local img_eyes    = blank()
local img_lantern = blank()
local img_outline = blank()
local img_glow    = blank()

-- ─── Geometry ────────────────────────────────────────────────────────────────
local CX = 25.5
local FACE_CX, FACE_CY, FACE_RX, FACE_RY = 25.0, 17.5, 9.6, 8.6

-- ─── 1. Ground shadow ────────────────────────────────────────────────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  if inEll(x, y, CX, 50.0, 14.0, 2.4) then setpx(img_shadow, x, y, FOOT_SH) end
end end

-- ─── 2. Cloak (shoulders + side drape behind dress) ──────────────────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  local cape  = inEll(x, y, CX, 29.0, 19.5, 11.0) and y >= 22 and y <= 39
  local drape = (x <= 12 or x >= 39) and y >= 26 and y <= 43
    and inEll(x, y, CX, 34.0, 21.0, 15.0)
  if cape or drape then
    if inEll(x, y, CX, 27.0, 15.0, 8.5) and y <= 31 then
      setpx(img_cloak, x, y, CLOAK_M)
    else
      setpx(img_cloak, x, y, CLOAK_D)
    end
  end
end end

-- ─── 3. Dress + collar + apron + hem + bookmark cord ─────────────────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  if y >= 27 and y <= 46 then
    local t = (y - 27) / (46 - 27)
    local hw = 7.0 + t * 7.5            -- 7.0 → 14.5 half-width
    local dx = (x + 0.5) - CX
    if math.abs(dx) <= hw then
      local col = DRESS
      if dx < -hw + 2.6 then col = DRESS_K
      elseif dx > hw - 2.0 then col = DRESS_H end
      if math.abs(dx) <= 3.0 and y >= 30 and y <= 43 then col = APRON end
      setpx(img_dress, x, y, col)
    end
  end
end end
-- collar under chin
for y = 26, 28 do for x = 0, W - 1 do
  local dx = (x + 0.5) - CX
  if math.abs(dx) <= 5.0 then setpx(img_dress, x, y, COLLAR) end
end end
-- soft vertical fold lines
for y = 31, 43 do
  setpx(img_dress, math.floor(CX - 5), y, DRESS_K)
  setpx(img_dress, math.floor(CX + 4), y, DRESS_K)
end
-- red hem band
for y = 0, H - 1 do for x = 0, W - 1 do
  if y >= 44 and y <= 46 then
    local t = (y - 27) / 19
    local hw = 7.0 + t * 7.5
    local dx = (x + 0.5) - CX
    if math.abs(dx) <= hw then
      setpx(img_dress, x, y, (y == 46) and HEM_D or HEM)
    end
  end
end end
-- bookmark cord (red) hanging from collar/waist on the left of apron
for y = 29, 41 do setpx(img_dress, math.floor(CX - 2), y, CORD) end
setpx(img_dress, math.floor(CX - 2), 42, CORD_T)
setpx(img_dress, math.floor(CX - 3), 42, CORD_T)
setpx(img_dress, math.floor(CX - 2), 43, CORD)

-- ─── 4. Legs + boots ─────────────────────────────────────────────────────────
local function leg(cxL)
  for y = 46, 49 do setpx(img_legs, cxL, y, LEG); setpx(img_legs, cxL + 1, y, LEG) end
  for y = 48, 50 do for x = cxL - 1, cxL + 2 do
    setpx(img_legs, x, y, (y == 48) and BOOT_H or BOOT)
  end end
end
leg(21)
leg(28)

-- ─── 5. Hood (round, peaked, framing face; soft crescent shade) ──────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  local dome = inEll(x, y, CX, 16.0, 16.5, 14.0) and y <= 27
  local peak = (math.abs((x + 0.5) - CX) <= (3.6 - (4 - y) * 0.25)) and y >= 1 and y <= 5
  if dome or peak then
    local col = HOOD_M
    if not inEll(x, y, 22.5, 13.5, 15.0, 13.0) then col = HOOD_D end  -- lower-right crescent
    if inEll(x, y, 20.0, 10.0, 7.5, 6.5) then col = HOOD_L end        -- upper-left light
    if inEll(x, y, 17.5, 7.5, 3.2, 3.0) then col = HOOD_B end         -- bright spec
    setpx(img_hood, x, y, col)
  end
end end
-- inner lining shadow ringing the face opening
for y = 0, H - 1 do for x = 0, W - 1 do
  local near = inEll(x, y, FACE_CX, FACE_CY, FACE_RX + 1.8, FACE_RY + 1.8)
  local face = inEll(x, y, FACE_CX, FACE_CY, FACE_RX + 0.3, FACE_RY + 0.3)
  if near and not face and A(img_hood:getPixel(x, y)) > 0 then
    setpx(img_hood, x, y, HOOD_IN)
  end
end end

-- ─── 6. Face ─────────────────────────────────────────────────────────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  if inEll(x, y, FACE_CX, FACE_CY, FACE_RX, FACE_RY) then
    local col = SKIN
    if ((x + 0.5) - FACE_CX) + ((y + 0.5) - FACE_CY) * 1.1 >= 7.5 then col = SKIN_M end
    if ((y + 0.5) - FACE_CY) >= 6.0 then col = SKIN_SH end
    setpx(img_face, x, y, col)
  end
end end

-- ─── 7. Hair / bangs (fringe + strand tips + side framing) ───────────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  if inEll(x, y, FACE_CX, FACE_CY, FACE_RX, FACE_RY) and y >= 10 and y <= 15 then
    setpx(img_hair, x, y, HAIR_D)
  end
end end
-- strand tips dipping irregularly onto the forehead (hand-drawn feel);
-- kept to the sides + a small central part so the eye area stays clean.
local tips = { {18,16},{19,16},{21,16},{30,16},{32,16},{31,16},
               {25,15},{26,15} }
for _, p in ipairs(tips) do
  if inEll(p[1], p[2], FACE_CX, FACE_CY, FACE_RX, FACE_RY) then
    setpx(img_hair, p[1], p[2], HAIR_M)
  end
end
-- mid-tone within fringe
for y = 0, H - 1 do for x = 0, W - 1 do
  if inEll(x, y, FACE_CX, FACE_CY, FACE_RX, FACE_RY)
     and y >= 11 and y <= 14 and math.abs((x+0.5)-FACE_CX) <= 5.0 then
    setpx(img_hair, x, y, HAIR_M)
  end
  -- side hair beside cheeks
  local ring = inEll(x, y, FACE_CX, FACE_CY, FACE_RX, FACE_RY)
    and not inEll(x, y, FACE_CX, FACE_CY, FACE_RX - 2.0, FACE_RY - 1.2)
  if ring and y >= 14 and y <= 22 then setpx(img_hair, x, y, HAIR_D) end
end end
-- fringe highlights
for _, p in ipairs({ {19,11},{20,11},{29,11},{30,11} }) do
  setpx(img_hair, p[1], p[2], HAIR_H)
end

-- ─── 8. Eyes / brows / blush / mouth (gentle, slightly worried-but-kind) ──────
local function eye(ex, ey)
  -- dark eye shape (rounded, tall)
  for y = ey - 3, ey + 3 do for x = ex - 2, ex + 2 do
    if (x-ex)*(x-ex)*1.0 + (y-ey)*(y-ey)*0.55 <= 5.0 then setpx(img_eyes, x, y, EYE_D) end
  end end
  -- iris (warm, layered)
  for y = ey - 1, ey + 2 do for x = ex - 1, ex + 1 do
    if (x-ex)*(x-ex) + (y-ey)*(y-ey) <= 3 then setpx(img_eyes, x, y, IRIS) end
  end end
  setpx(img_eyes, ex, ey, IRIS_M)
  setpx(img_eyes, ex, ey + 1, IRIS_D)
  setpx(img_eyes, ex - 1, ey + 1, IRIS_D)
  -- big catchlight + tiny secondary
  setpx(img_eyes, ex - 1, ey - 1, EYE_W)
  setpx(img_eyes, ex - 2, ey - 1, EYE_W)
  setpx(img_eyes, ex + 1, ey + 1, EYE_W)
end
eye(20, 18)
eye(31, 18)
-- soft brows just above the eyes (slightly raised inner = gentle worry).
-- placed at y15 so they sit below the bang fringe instead of hiding in the hair.
setpx(img_eyes, 19, 15, BROW); setpx(img_eyes, 20, 15, BROW); setpx(img_eyes, 21, 15, BROW)
setpx(img_eyes, 30, 15, BROW); setpx(img_eyes, 31, 15, BROW); setpx(img_eyes, 32, 15, BROW)
-- blush
for _, b in ipairs({ {16,21},{17,21},{18,21},{33,21},{34,21},{35,21} }) do
  setpx(img_eyes, b[1], b[2], BLUSH)
end
-- small soft mouth
setpx(img_eyes, 25, 22, MOUTH); setpx(img_eyes, 26, 22, MOUTH)
setpx(img_eyes, 25, 23, MOUTH)

-- ─── 9. Right arm + lantern (connected; memory light inside) ─────────────────
-- sleeve from body down to hand
for _, p in ipairs({
  {35,30},{36,30},{37,30},{37,31},{38,31},{38,32},{39,32},{39,33},{40,33},{40,34},
  {36,31},{37,32},{38,33},{39,34}
}) do setpx(img_lantern, p[1], p[2], SLEEVE) end
setpx(img_lantern, 35, 31, SLEEVE_K); setpx(img_lantern, 37, 33, SLEEVE_K)
setpx(img_lantern, 39, 35, SLEEVE_K)
-- hand
setpx(img_lantern, 40, 35, HAND); setpx(img_lantern, 41, 35, HAND)
setpx(img_lantern, 41, 36, HAND)
-- handle ring
setpx(img_lantern, 41, 37, LAN_C); setpx(img_lantern, 41, 38, LAN_C)
-- cage (cols 38..46, rows 38..47)
local lx0, lx1, ly0, ly1 = 38, 46, 38, 47
for y = ly0, ly1 do for x = lx0, lx1 do
  if (x == lx0 or x == lx1 or y == ly0 or y == ly1) then
    setpx(img_lantern, x, y, (y == ly0 or x == lx0) and LAN_C2 or LAN_C)
  end
end end
-- warm interior
for y = ly0 + 1, ly1 - 1 do for x = lx0 + 1, lx1 - 1 do
  setpx(img_lantern, x, y, LAN_G)
end end
for y = ly0 + 2, ly1 - 2 do for x = lx0 + 2, lx1 - 2 do
  setpx(img_lantern, x, y, LAN_GH)
end end
-- bright core + memory-light spark
setpx(img_lantern, 42, 43, LAN_CORE); setpx(img_lantern, 42, 42, LAN_CORE)
setpx(img_lantern, 41, 43, LAN_CORE); setpx(img_lantern, 42, 44, LAN_CORE)
setpx(img_lantern, 42, 42, LAN_SPK)
-- vertical cage bar
for y = ly0 + 1, ly1 - 1 do setpx(img_lantern, 42, y, LAN_C) end
-- left hand peeking (small)
setpx(img_lantern, 11, 32, HAND); setpx(img_lantern, 11, 33, HAND)

-- ─── 10. Outline (auto, 1px around composite silhouette) ──────────────────────
local comp = blank()
for _, src in ipairs({ img_cloak, img_dress, img_legs, img_hood, img_face,
                       img_hair, img_eyes, img_lantern }) do
  for y = 0, H - 1 do for x = 0, W - 1 do
    local p = src:getPixel(x, y)
    if A(p) >= 200 then comp:drawPixel(x, y, p) end
  end end
end
for y = 0, H - 1 do for x = 0, W - 1 do
  if A(comp:getPixel(x, y)) == 0 then
    local touch = false
    for _, d in ipairs({ {1,0},{-1,0},{0,1},{0,-1} }) do
      local nx, ny = x + d[1], y + d[2]
      if nx >= 0 and ny >= 0 and nx < W and ny < H then
        if A(comp:getPixel(nx, ny)) >= 200 then touch = true end
      end
    end
    if touch then setpx(img_outline, x, y, OUTLINE) end
  end
end end

-- ─── 11. Lantern glow (semi-transparent, top) ────────────────────────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  if inEll(x, y, 42.0, 43.0, 8.0, 8.0) and A(img_glow:getPixel(x, y)) == 0 then
    setpx(img_glow, x, y, LAN_GLOW)
  end
end end

-- ─── Assign cels into named layers ───────────────────────────────────────────
local base = sprite.layers[1]; base.name = "shadow"
local function L(name) local l = sprite:newLayer(); l.name = name; return l end
local l_cloak = L("cloak")
local l_dress = L("dress")
local l_legs  = L("legs")
local l_hood  = L("hood")
local l_face  = L("face")
local l_hair  = L("hair")
local l_eyes  = L("eyes")
local l_lan   = L("lantern")
local l_out   = L("outline")
local l_glow  = L("glow")

local f1 = sprite.frames[1]
local function cel(layer, img) sprite:newCel(layer, f1, img, Point(0, 0)) end
cel(base,    img_shadow)
cel(l_cloak, img_cloak)
cel(l_dress, img_dress)
cel(l_legs,  img_legs)
cel(l_hood,  img_hood)
cel(l_face,  img_face)
cel(l_hair,  img_hair)
cel(l_eyes,  img_eyes)
cel(l_lan,   img_lantern)
cel(l_out,   img_outline)
cel(l_glow,  img_glow)

sprite:saveAs(out)
print("yui_idle_52 draft written: " .. out)
print("STATUS: draft (source-prep) - NOT GUI hand-finished, NOT for production")
