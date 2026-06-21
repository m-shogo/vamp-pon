-- build-yui-idle-v6-candidate.lua
--
-- v6 CANDIDATE DRAFT for yui_idle_42 (source-prep only).
--
-- Fixes the v5 "blue mushroom" failure by addressing the structural/visual
-- problems that killed charm:
--   - hood is a proportionate DRAPED hood with a soft peak, framing the face,
--     not a giant blue dome that dominates the sprite
--   - a darker blue CLOAK drapes over the shoulders behind the dress
--   - visible LEGS + small dark BOOTS at the bottom (was a featureless triangle)
--   - the lantern is connected to a visible right ARM/HAND (was floating)
--   - dress is narrower with an apron panel, reddish hem and fold shading
--   - large cute face with clearer eyes/catchlights, brown-red bangs, blush
--   - more tonal steps for a softer painterly read
--
-- This is authored at pixel precision in pixel space (not a downscale, not a
-- single ellipse blob). It is STILL a script-built source-prep DRAFT and is NOT
-- a GUI hand-finished asset. It must NOT be exported to production or committed
-- until a human does the 1px GUI finishing pass and it passes the quality gate
-- with charm/appeal >= 4.
--
-- Output (CANDIDATE, never production):
--   assets/source/aseprite/player/prototypes/yui_idle_v6_candidate.aseprite
--
-- Usage:
--   aseprite -b \
--     --script-param out=.../prototypes/yui_idle_v6_candidate.aseprite \
--     --script scripts/aseprite/build-yui-idle-v6-candidate.lua

local out = app.params["out"]
if out == nil or out == "" then
  out = "assets/source/aseprite/player/prototypes/yui_idle_v6_candidate.aseprite"
end
if string.sub(out, -9) ~= ".aseprite" then
  error("output must end with .aseprite: " .. out)
end

local W, H = 42, 42

-- ─── Palette (soft painterly, extra mid-tones) ───────────────────────────────
local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end
local function A(c) return app.pixelColor.rgbaA(c) end

local OUTLINE  = C(30, 24, 42)

-- Cloak (darker blue, behind dress / shoulders)
local CLOAK_D  = C(34, 44, 80)
local CLOAK_M  = C(48, 62, 104)

-- Hood blues (4 steps, readable on dark bg)
local HOOD_D   = C(46, 60, 104)
local HOOD_M   = C(66, 90, 142)
local HOOD_L   = C(98, 126, 178)
local HOOD_B   = C(140, 166, 212)
local HOOD_IN  = C(38, 48, 84)   -- inner lining shadow ringing the face

-- Hair (brown-red, 3 steps)
local HAIR_D   = C(74, 38, 32)
local HAIR_M   = C(116, 62, 46)
local HAIR_H   = C(166, 100, 74)

-- Skin
local SKIN     = C(252, 220, 178)
local SKIN_M   = C(236, 198, 154)
local SKIN_SH  = C(214, 174, 130)

-- Eyes
local EYE_D    = C(40, 28, 44)
local IRIS     = C(150, 98, 58)
local IRIS_D   = C(104, 62, 38)
local EYE_W    = C(255, 252, 240)

-- Face accents
local BLUSH    = C(236, 156, 144)
local MOUTH    = C(150, 84, 82)

-- Dress (cream / old paper, 3 steps + apron + hem)
local DRESS    = C(224, 206, 162)
local DRESS_K  = C(190, 168, 126)   -- shadow
local DRESS_H  = C(244, 230, 194)   -- highlight (lantern side)
local APRON    = C(236, 222, 186)
local HEM      = C(168, 96, 78)     -- reddish hem band (matches reference)
local HEM_D    = C(128, 70, 58)

-- Boots / legs
local BOOT     = C(58, 44, 54)
local BOOT_H   = C(86, 70, 80)
local LEG       = C(214, 174, 130)

-- Lantern + arm
local SLEEVE   = C(214, 196, 154)   -- arm sleeve (dress fabric)
local SLEEVE_K = C(184, 162, 122)
local HAND     = C(248, 214, 172)
local LAN_C    = C(108, 84, 58)     -- cage / handle
local LAN_C2   = C(140, 112, 78)    -- cage highlight
local LAN_G    = C(250, 196, 92)    -- warm fill
local LAN_GH   = C(255, 232, 150)   -- warm mid
local LAN_CORE = C(255, 252, 220)   -- bright core
local LAN_GLOW = C(250, 184, 84, 70)

local FOOT_SH  = C(14, 10, 26, 120)

-- ─── Canvas / layers ─────────────────────────────────────────────────────────
local sprite = Sprite(W, H, ColorMode.RGB)
local function blank() return Image(W, H) end

local function setpx(img, x, y, c)
  if x >= 0 and y >= 0 and x < W and y < H then img:drawPixel(x, y, c) end
end

-- ellipse fill test (pixel space)
local function inEll(x, y, cx, cy, rx, ry)
  local a = (x + 0.5 - cx) / rx
  local b = (y + 0.5 - cy) / ry
  return a * a + b * b <= 1.0
end

-- Per-layer images
local img_shadow  = blank()
local img_cloak   = blank()
local img_dress   = blank()
local img_legs    = blank()
local img_hood    = blank()
local img_hair    = blank()
local img_face    = blank()
local img_eyes    = blank()
local img_lantern = blank()
local img_outline = blank()
local img_glow    = blank()

-- ─── Geometry constants ──────────────────────────────────────────────────────
local CX = 20.5
local FACE_CX, FACE_CY, FACE_RX, FACE_RY = 20.3, 14.0, 7.6, 6.6

-- ─── 1. Ground shadow ────────────────────────────────────────────────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  if inEll(x, y, CX, 40.0, 11.0, 2.0) then setpx(img_shadow, x, y, FOOT_SH) end
end end

-- ─── 2. Cloak (shoulders + drape, behind dress) ──────────────────────────────
-- Shoulders fan out from under the hood (~y18) and drape down the sides.
for y = 0, H - 1 do for x = 0, W - 1 do
  -- shoulder cape: wide rounded band
  local cape = inEll(x, y, CX, 22.0, 15.5, 8.5) and y >= 17 and y <= 30
  -- side drape down to mid dress
  local drape = (x <= 9 or x >= 32) and y >= 20 and y <= 33
    and inEll(x, y, CX, 26.0, 17.0, 12.0)
  if cape or drape then
    -- lighter toward center-top, darker at edges
    if inEll(x, y, CX, 21.0, 12.0, 6.5) and y <= 24 then
      setpx(img_cloak, x, y, CLOAK_M)
    else
      setpx(img_cloak, x, y, CLOAK_D)
    end
  end
end end

-- ─── 3. Dress body + apron + hem (cream) ─────────────────────────────────────
-- Narrower trapezoid than v5; clear apron + reddish hem + fold shadow.
for y = 0, H - 1 do for x = 0, W - 1 do
  if y >= 21 and y <= 36 then
    local t = (y - 21) / (36 - 21)
    local hw = 5.5 + t * 6.0          -- 5.5 → 11.5 half-width
    local dx = (x + 0.5) - CX
    if math.abs(dx) <= hw then
      local col = DRESS
      if dx < -hw + 2.0 then col = DRESS_K          -- left fold shadow
      elseif dx > hw - 1.6 then col = DRESS_H end   -- right (lantern-lit) edge
      if math.abs(dx) <= 2.4 and y >= 23 and y <= 33 then col = APRON end
      setpx(img_dress, x, y, col)
    end
  end
end end
-- vertical fold lines (soft)
for y = 24, 33 do
  setpx(img_dress, math.floor(CX - 4), y, DRESS_K)
  setpx(img_dress, math.floor(CX + 3), y, DRESS_K)
end
-- reddish hem band
for y = 0, H - 1 do for x = 0, W - 1 do
  if y >= 34 and y <= 36 then
    local t = (y - 21) / 15
    local hw = 5.5 + t * 6.0
    local dx = (x + 0.5) - CX
    if math.abs(dx) <= hw then
      if y == 36 then setpx(img_dress, x, y, HEM_D) else setpx(img_dress, x, y, HEM) end
    end
  end
end end

-- ─── 4. Legs + boots ─────────────────────────────────────────────────────────
-- two little legs peeking below the hem, ending in dark boots.
local function leg(cxL)
  for y = 36, 39 do
    setpx(img_legs, cxL,     y, LEG)
    setpx(img_legs, cxL + 1, y, LEG)
  end
  -- boot
  for y = 38, 40 do
    for x = cxL - 1, cxL + 2 do
      setpx(img_legs, x, y, (y == 38) and BOOT_H or BOOT)
    end
  end
end
leg(17)
leg(23)

-- ─── 5. Hood (draped, peaked, framing the face) ──────────────────────────────
-- Main hood dome but clearly bounded; face will be carved by drawing skin on top.
for y = 0, H - 1 do for x = 0, W - 1 do
  -- dome
  local dome = inEll(x, y, CX, 12.5, 13.0, 11.0) and y <= 21
  -- soft peak at top
  local peak = (math.abs((x + 0.5) - CX) <= (3.0 - (3 - y) * 0.2)) and y >= 1 and y <= 4
  if dome or peak then
    -- tonal steps: bright upper-left, mid base, soft dark lower-right crescent.
    local col = HOOD_M
    -- lower-right crescent shadow: inside dome but outside a center-up offset ellipse
    if not inEll(x, y, 18.5, 10.5, 12.0, 10.5) then col = HOOD_D end
    -- upper-left highlight zone
    if inEll(x, y, 16.5, 8.0, 6.0, 5.2) then col = HOOD_L end
    -- bright specular spot
    if inEll(x, y, 14.5, 6.0, 2.6, 2.4) then col = HOOD_B end
    setpx(img_hood, x, y, col)
  end
end end
-- inner lining shadow ringing the face opening (gives depth)
for y = 0, H - 1 do for x = 0, W - 1 do
  local nearFace = inEll(x, y, FACE_CX, FACE_CY, FACE_RX + 1.4, FACE_RY + 1.4)
  local inFace   = inEll(x, y, FACE_CX, FACE_CY, FACE_RX + 0.2, FACE_RY + 0.2)
  if nearFace and not inFace and A(img_hood:getPixel(x, y)) > 0 then
    setpx(img_hood, x, y, HOOD_IN)
  end
end end

-- ─── 6. Face (drawn over hood = carves the opening) ──────────────────────────
for y = 0, H - 1 do for x = 0, W - 1 do
  if inEll(x, y, FACE_CX, FACE_CY, FACE_RX, FACE_RY) then
    local col = SKIN
    -- jaw/chin shade lower-right
    if ((x + 0.5) - FACE_CX) + ((y + 0.5) - FACE_CY) * 1.1 >= 6.0 then col = SKIN_M end
    if ((y + 0.5) - FACE_CY) >= 4.6 then col = SKIN_SH end
    setpx(img_face, x, y, col)
  end
end end

-- ─── 7. Hair / bangs (brown-red, over forehead + side framing) ───────────────
-- fringe across the top of the face opening with a few strand tips
for y = 0, H - 1 do for x = 0, W - 1 do
  local inFace = inEll(x, y, FACE_CX, FACE_CY, FACE_RX, FACE_RY)
  -- main fringe band
  if inFace and y >= 8 and y <= 12 then
    setpx(img_hair, x, y, HAIR_D)
  end
end end
-- strand tips dipping lower (irregular for hand-drawn feel)
local tips = { {15,13},{18,14},{21,13},{24,14},{26,13},{17,13},{23,13} }
for _, p in ipairs(tips) do
  if inEll(p[1], p[2], FACE_CX, FACE_CY, FACE_RX, FACE_RY) then
    setpx(img_hair, p[1], p[2], HAIR_M)
  end
end
-- mid-tone within fringe + side framing
for y = 0, H - 1 do for x = 0, W - 1 do
  local inFace = inEll(x, y, FACE_CX, FACE_CY, FACE_RX, FACE_RY)
  if inFace and y >= 9 and y <= 11 and math.abs((x+0.5)-FACE_CX) <= 4.0 then
    setpx(img_hair, x, y, HAIR_M)
  end
  -- side hair just inside hood, beside cheeks
  local ring = inEll(x, y, FACE_CX, FACE_CY, FACE_RX, FACE_RY)
    and not inEll(x, y, FACE_CX, FACE_CY, FACE_RX - 1.6, FACE_RY - 1.0)
  if ring and y >= 11 and y <= 17 then setpx(img_hair, x, y, HAIR_D) end
end end
-- highlight on fringe
setpx(img_hair, 16, 9, HAIR_H)
setpx(img_hair, 17, 9, HAIR_H)
setpx(img_hair, 23, 9, HAIR_H)

-- ─── 8. Eyes / blush / mouth ─────────────────────────────────────────────────
local function eye(ex, ey)
  -- dark eye shape
  for y = ey - 2, ey + 2 do for x = ex - 1, ex + 1 do
    if (x-ex)*(x-ex) + ((y-ey)*(y-ey))*0.5 <= 3.2 then setpx(img_eyes, x, y, EYE_D) end
  end end
  -- iris
  setpx(img_eyes, ex, ey, IRIS); setpx(img_eyes, ex, ey + 1, IRIS_D)
  setpx(img_eyes, ex - 1, ey, IRIS); setpx(img_eyes, ex + 1, ey, IRIS)
  -- pupil deep
  setpx(img_eyes, ex, ey + 1, IRIS_D)
  -- catchlight
  setpx(img_eyes, ex - 1, ey - 1, EYE_W)
end
eye(16, 15)
eye(25, 15)
-- blush
for _, b in ipairs({ {13,17},{14,17},{27,17},{28,17} }) do
  setpx(img_eyes, b[1], b[2], BLUSH)
end
-- mouth
setpx(img_eyes, 20, 18, MOUTH)
setpx(img_eyes, 21, 18, MOUTH)

-- ─── 9. Right arm + lantern (connected, not floating) ────────────────────────
-- sleeve from body to hand
for _, p in ipairs({
  {29,24},{30,24},{30,25},{31,25},{31,26},{32,26},{32,27},{33,27}
}) do
  setpx(img_lantern, p[1], p[2], SLEEVE)
end
setpx(img_lantern, 29, 25, SLEEVE_K); setpx(img_lantern, 31, 27, SLEEVE_K)
-- hand
setpx(img_lantern, 33, 28, HAND); setpx(img_lantern, 34, 28, HAND)
-- handle ring
setpx(img_lantern, 34, 29, LAN_C); setpx(img_lantern, 34, 30, LAN_C)
-- cage frame (cols 31..37, rows 30..37)
local lx0, lx1, ly0, ly1 = 31, 37, 30, 37
for y = ly0, ly1 do for x = lx0, lx1 do
  local frame = (x == lx0 or x == lx1 or y == ly0 or y == ly1)
  if frame then
    setpx(img_lantern, x, y, (y == ly0 or x == lx0) and LAN_C2 or LAN_C)
  end
end end
-- top + bottom caps
for x = lx0 - 0, lx1 do setpx(img_lantern, x, ly0, LAN_C2) end
for x = lx0, lx1 do setpx(img_lantern, x, ly1, LAN_C) end
-- warm interior
for y = ly0 + 1, ly1 - 1 do for x = lx0 + 1, lx1 - 1 do
  setpx(img_lantern, x, y, LAN_G)
end end
-- warm mid + bright core
for y = ly0 + 2, ly1 - 2 do for x = lx0 + 2, lx1 - 2 do
  setpx(img_lantern, x, y, LAN_GH)
end end
setpx(img_lantern, 34, 33, LAN_CORE); setpx(img_lantern, 34, 34, LAN_CORE)
setpx(img_lantern, 33, 33, LAN_CORE)
-- vertical cage bar
for y = ly0 + 1, ly1 - 1 do setpx(img_lantern, 34, y, LAN_C) end

-- left hand peeking (small) holding cloak
setpx(img_lantern, 8, 26, HAND); setpx(img_lantern, 8, 27, HAND)

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
  if inEll(x, y, 34.0, 33.5, 6.5, 6.5) and A(img_glow:getPixel(x, y)) == 0 then
    setpx(img_glow, x, y, LAN_GLOW)
  end
end end

-- ─── Assign cels into named layers ───────────────────────────────────────────
local base = sprite.layers[1]; base.name = "shadow"
local function L(name) local l = sprite:newLayer(); l.name = name; return l end
local l_cloak  = L("cloak")
local l_dress  = L("dress")
local l_legs   = L("legs")
local l_hood   = L("hood")
local l_face   = L("face")
local l_hair   = L("hair")
local l_eyes   = L("eyes")
local l_lan    = L("lantern")
local l_out    = L("outline")
local l_glow   = L("glow")

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
print("v6 candidate written: " .. out)
print("STATUS: candidate draft (source-prep) - NOT GUI hand-finished, NOT for production")
