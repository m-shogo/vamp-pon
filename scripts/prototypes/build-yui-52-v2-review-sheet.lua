-- build-yui-52-v2-review-sheet.lua
--
-- Compose the v2 review contact sheet for the Yui 52px master prototypes.
-- Prototype review artifact only - never wired to production.
--
-- Shows, for the pixel-art-quality-gate checks:
--   - top strip: OLD A/B/C  vs  NEW V2a/V2b/V2c at 3x (regression compare)
--   - per-variant detail rows for V2a/V2b/V2c:
--       * 1x actual size
--       * 6x on a night-street background
--       * 5x on an ink-blotch heavy patch, with a memory-fragment pickup prop
--         placed nearby AND a small hitCore center dot overlaid, so we can test
--         that the lantern glow is NOT confused with a pickup / the hitCore.
--
-- Usage:
--   aseprite -b \
--     --script-param png=public/assets/prototypes/yui_idle_52_v2_review_sheet.png \
--     --script scripts/prototypes/build-yui-52-v2-review-sheet.lua

local png = app.params["png"]
if png == nil or png == "" then
  png = "public/assets/prototypes/yui_idle_52_v2_review_sheet.png"
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
-- memory-fragment pickup look (cream torn paper w/ ink edge) - must NOT be
-- confused with the lantern. Distinct cool-cream, hard edge.
local FRAG_FILL = C(228, 224, 206)
local FRAG_EDGE = C(64, 58, 78)
-- hitCore center marker (debug overlay) - clearly a UI dot, magenta ring.
local CORE_RING = C(255, 64, 140)
local CORE_DOT  = C(255, 180, 210)

local W = 660
local H = 1210
local sheet = Image(W, H)

-- night-street gradient
for y = 0, H - 1 do
  local t = y / (H - 1)
  local r = math.floor(24 + (13 - 24) * t)
  local g = math.floor(22 + (12 - 22) * t)
  local b = math.floor(36 + (24 - 36) * t)
  for x = 0, W - 1 do
    sheet:drawPixel(x, y, C(r, g, b))
  end
end

local function blotch(cx, cy, rad, col, seedy)
  for y = cy - rad, cy + rad do
    for x = cx - rad, cx + rad do
      if x >= 0 and y >= 0 and x < W and y < H then
        local dx, dy = (x - cx) / rad, (y - cy) / rad
        if dx * dx + dy * dy <= 1 then sheet:drawPixel(x, y, col) end
      end
    end
  end
end

math.randomseed(11)
for _ = 1, 26 do
  blotch(math.random(0, W - 1), math.random(0, H - 1), math.random(8, 24), INK)
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

local function load(name)
  return Image{ fromFile = "public/assets/prototypes/yui_idle_52_" .. name .. ".png" }
end

-- a small torn-paper memory fragment pickup, drawn directly on the sheet
local function fragment(cx, cy, s)
  for y = -3, 3 do
    for x = -3, 3 do
      -- diamond-ish torn shard
      if math.abs(x) + math.abs(y) <= 3 then
        for sy = 0, s - 1 do for sx = 0, s - 1 do
          local px, py = cx + x * s + sx, cy + y * s + sy
          if px >= 0 and py >= 0 and px < W and py < H then
            local edge = math.abs(x) + math.abs(y) >= 3
            sheet:drawPixel(px, py, edge and FRAG_EDGE or FRAG_FILL)
          end
        end end
      end
    end
  end
end

-- hitCore debug center dot at the sprite center (26,26 in 52px space)
local function hitcore(ox, oy, scale)
  local cx = ox + 26 * scale + scale // 2
  local cy = oy + 26 * scale + scale // 2
  for y = -4, 4 do
    for x = -4, 4 do
      local d = x * x + y * y
      if d <= 16 and d >= 6 then sheet:drawPixel(cx + x, cy + y, CORE_RING)
      elseif d < 6 then sheet:drawPixel(cx + x, cy + y, CORE_DOT) end
    end
  end
end

-- ── Top strip: OLD A/B/C  vs  NEW V2a/V2b/V2c at 3x ──────────────────────────
local SC = 3
local cellw = 52 * SC
local gap = 12
local x0 = 18
local oldrow_y = 18
local newrow_y = oldrow_y + 52 * SC + 16
local old = { "A", "B", "C" }
local new = { "v2a", "v2b", "v2c" }
for i = 1, 3 do
  blit(sheet, load(old[i]), x0 + (i - 1) * (cellw + gap), oldrow_y, SC)
  blit(sheet, load(new[i]), x0 + (i - 1) * (cellw + gap), newrow_y, SC)
end
-- a thin divider so old (top) vs new (bottom) is obvious
for x = 0, W - 1 do sheet:drawPixel(x, newrow_y - 8, INK_D) end

-- ── Detail rows for V2a/V2b/V2c ──────────────────────────────────────────────
local row_top = newrow_y + 52 * SC + 24
local ROW_H = 280
local S6, S5 = 6, 5
for i, v in ipairs(new) do
  local src = load(v)
  local oy = row_top + (i - 1) * ROW_H
  -- 1x (vertically centered against the 6x block)
  blit(sheet, src, 22, oy + (52 * S6 - 52) // 2, 1)
  -- 6x on plain night bg
  blit(sheet, src, 86, oy, S6)
  -- 5x on ink-heavy patch + fragment pickup + hitCore overlay
  local cx = 410
  -- extra ink blotches behind this cell (the "ink-blotch background" test)
  blotch(cx + 130, oy + 90, 60, INK)
  blotch(cx + 70,  oy + 200, 46, INK_D)
  blotch(cx + 190, oy + 150, 38, INK)
  blit(sheet, src, cx, oy + (52 * S6 - 52 * S5) // 2, S5)
  -- memory fragments scattered close by (confusion test vs lantern glow)
  fragment(cx + 52 * S5 + 18, oy + 70, 4)
  fragment(cx - 4, oy + 210, 4)
  fragment(cx + 52 * S5 + 4, oy + 200, 3)
  -- hitCore center dot
  hitcore(cx, oy + (52 * S6 - 52 * S5) // 2, S5)
end

local out = Sprite(W, H, ColorMode.RGB)
out.layers[1].name = "sheet"
out:newCel(out.layers[1], out.frames[1], sheet, Point(0, 0))
out:saveCopyAs(png)
print("v2 review sheet written: " .. png)
