-- build-pixel-finisher-review-sheet.lua
--
-- Compose the procedural-finish (PF) review contact sheet for Yui 52px V2a.
-- Prototype review artifact only - never wired to production.
--
-- Compares the BEFORE prototype (V2a) against the AFTER procedural finish
-- (V2a_pf) so the design team can judge the script-assisted pass:
--   - top row : before V2a 1x  vs  after PF 1x  (true pixel size)
--   - mid row : before 6x  vs  after 6x         (zoom; overall read)
--   - context : after PF on a night-street bg, on an ink-blotch bg with a
--               memory-fragment pickup nearby, and a hitCore center dot, so we
--               can confirm the lantern glow is not confused with a pickup or
--               the hitCore.
--   - detail  : 6x crops of hood / eyes / hand+lantern / fringe with the
--               before(left) vs after(right) split, so each finishing pass is
--               visible (hood tighten, sheen cluster, eye dot+lid, 3-cluster
--               fringe, finger grooves, handle connect, lantern rim).
--
-- This sheet does NOT make the sprite hand-final. PF = script-assisted-candidate.
--
-- Usage:
--   aseprite -b \
--     --script-param png=public/assets/prototypes/yui_idle_52_v2a_pf_review_sheet.png \
--     --script scripts/prototypes/build-pixel-finisher-review-sheet.lua

local png = app.params["png"]
if png == nil or png == "" then
  png = "public/assets/prototypes/yui_idle_52_v2a_pf_review_sheet.png"
end
if string.sub(png, 1, #"public/assets/prototypes/") ~= "public/assets/prototypes/" then
  error("refusing to export png outside public/assets/prototypes/: " .. png)
end

local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end
local function A(col) return app.pixelColor.rgbaA(col) end
local function R(col) return app.pixelColor.rgbaR(col) end
local function G(col) return app.pixelColor.rgbaG(col) end
local function B(col) return app.pixelColor.rgbaB(col) end

local INK     = C(30, 26, 44)
local INK_D   = C(20, 17, 32)
local FRAG_FILL = C(228, 224, 206)   -- memory-fragment pickup (cream torn paper)
local FRAG_EDGE = C(64, 58, 78)
local CORE_RING = C(255, 64, 140)    -- hitCore debug overlay
local CORE_DOT  = C(255, 180, 210)
local LABEL     = C(150, 150, 170)   -- faint tick markers between panels

local W = 660
local H = 980
local sheet = Image(W, H)

-- night-street gradient background
for y = 0, H - 1 do
  local t = y / (H - 1)
  local r = math.floor(24 + (13 - 24) * t)
  local g = math.floor(22 + (12 - 22) * t)
  local b = math.floor(36 + (24 - 36) * t)
  for x = 0, W - 1 do sheet:drawPixel(x, y, C(r, g, b)) end
end

local function blotch(cx, cy, rad, color)
  for y = cy - rad, cy + rad do
    for x = cx - rad, cx + rad do
      if x >= 0 and y >= 0 and x < W and y < H then
        local dx, dy = (x - cx) / rad, (y - cy) / rad
        if dx * dx + dy * dy <= 1 then sheet:drawPixel(x, y, color) end
      end
    end
  end
end

math.randomseed(23)
for _ = 1, 22 do
  blotch(math.random(0, W - 1), math.random(0, H - 1), math.random(8, 22), INK)
end

local function blit(dst, src, ox, oy, scale)
  for y = 0, src.height - 1 do
    for x = 0, src.width - 1 do
      local p = src:getPixel(x, y)
      local a = A(p)
      if a > 0 then
        for sy = 0, scale - 1 do
          for sx = 0, scale - 1 do
            local px, py = ox + x * scale + sx, oy + y * scale + sy
            if px >= 0 and py >= 0 and px < dst.width and py < dst.height then
              if a >= 250 then
                dst:drawPixel(px, py, p)
              else
                local d = dst:getPixel(px, py)
                local f = a / 255
                dst:drawPixel(px, py, C(
                  math.floor(R(p) * f + R(d) * (1 - f)),
                  math.floor(G(p) * f + G(d) * (1 - f)),
                  math.floor(B(p) * f + B(d) * (1 - f))))
              end
            end
          end
        end
      end
    end
  end
end

-- blit a sub-rectangle of src (for before/after detail crops)
local function blit_crop(dst, src, sx0, sy0, sw, sh, ox, oy, scale)
  for y = 0, sh - 1 do
    for x = 0, sw - 1 do
      local p = src:getPixel(sx0 + x, sy0 + y)
      if A(p) > 0 then
        for yy = 0, scale - 1 do for xx = 0, scale - 1 do
          local px, py = ox + x * scale + xx, oy + y * scale + yy
          if px >= 0 and py >= 0 and px < dst.width and py < dst.height then
            dst:drawPixel(px, py, p)
          end
        end end
      end
    end
  end
end

local function load(file)
  return Image{ fromFile = file }
end

local before = load("public/assets/prototypes/yui_idle_52_v2a.png")
local after  = load("public/assets/prototypes/yui_idle_52_v2a_pf.png")

local function fragment(cx, cy, s)
  for y = -3, 3 do for x = -3, 3 do
    if math.abs(x) + math.abs(y) <= 3 then
      for sy = 0, s - 1 do for sx = 0, s - 1 do
        local px, py = cx + x * s + sx, cy + y * s + sy
        if px >= 0 and py >= 0 and px < W and py < H then
          local edge = math.abs(x) + math.abs(y) >= 3
          sheet:drawPixel(px, py, edge and FRAG_EDGE or FRAG_FILL)
        end
      end end
    end
  end end
end

local function hitcore(ox, oy, scale)
  local cx = ox + 26 * scale + scale // 2
  local cy = oy + 26 * scale + scale // 2
  for y = -4, 4 do for x = -4, 4 do
    local d = x * x + y * y
    if d <= 16 and d >= 6 then sheet:drawPixel(cx + x, cy + y, CORE_RING)
    elseif d < 6 then sheet:drawPixel(cx + x, cy + y, CORE_DOT) end
  end end
end

local function vline(x, y0, y1, color)
  for y = y0, y1 do if x >= 0 and x < W then sheet:drawPixel(x, y, color) end end
end

-- ── Row 1: before 1x vs after 1x (true size), then 6x before vs 6x after ─────
local y = 18
-- 1x pair (small, true pixel size)
blit(sheet, before, 24, y + 60, 1)
blit(sheet, after,  24, y + 130, 1)
-- 6x before / after
local S6 = 6
blit(sheet, before, 100, y, S6)
blit(sheet, after,  100 + 52 * S6 + 26, y, S6)
vline(100 + 52 * S6 + 12, y, y + 52 * S6, LABEL)

-- ── Row 2: after PF in context (night bg / ink + fragment + hitCore) ─────────
y = y + 52 * S6 + 34
local S5 = 5
-- plain night bg
blit(sheet, after, 30, y, S6)
-- ink-heavy patch + fragments + hitCore
local cx = 360
blotch(cx + 120, y + 80, 56, INK)
blotch(cx + 60,  y + 190, 42, INK_D)
blotch(cx + 180, y + 150, 34, INK)
blit(sheet, after, cx, y + (52 * S6 - 52 * S5) // 2, S5)
fragment(cx + 52 * S5 + 16, y + 60, 4)
fragment(cx - 4, y + 200, 4)
fragment(cx + 52 * S5 + 2, y + 190, 3)
hitcore(cx, y + (52 * S6 - 52 * S5) // 2, S5)

-- ── Row 3: detail crops, before(left) vs after(right) at 6x ──────────────────
y = y + 52 * S6 + 34
local SD = 6
-- crops: {label-ish, x0,y0,w,h}
local crops = {
  { 6, 0, 26, 16 },    -- hood crown / sheen / left rim
  { 14, 16, 24, 14 },  -- eyes + fringe band
  { 30, 28, 22, 20 },  -- hand + lantern + handle
}
local colx = 18
for _, c in ipairs(crops) do
  local cw, ch = c[3], c[4]
  blit_crop(sheet, before, c[1], c[2], cw, ch, colx, y, SD)
  blit_crop(sheet, after,  c[1], c[2], cw, ch, colx + cw * SD + 12, y, SD)
  vline(colx + cw * SD + 6, y, y + ch * SD, LABEL)
  colx = colx + cw * SD * 2 + 40
end

local out = Sprite(W, H, ColorMode.RGB)
out.layers[1].name = "sheet"
out:newCel(out.layers[1], out.frames[1], sheet, Point(0, 0))
out:saveCopyAs(png)
print("pixel finisher review sheet written: " .. png)
print("  before: public/assets/prototypes/yui_idle_52_v2a.png")
print("  after:  public/assets/prototypes/yui_idle_52_v2a_pf.png")
print("NOTE: PF = script-assisted-candidate. NOT hand-final / NOT GUI hand-finish.")
