-- build-yui-52-review-sheet.lua
--
-- Compose a review contact sheet for the Yui 52px master prototypes (A/B/C).
-- Shows each variant at 1x and 6x on a dark night-street background, so the
-- pixel-art-quality-gate checks (1x readability / dark-bg separation / charm)
-- can be judged at a glance. Prototype review artifact only.
--
-- Usage:
--   aseprite -b \
--     --script-param png=public/assets/prototypes/yui_idle_52_review_sheet.png \
--     --script scripts/prototypes/build-yui-52-review-sheet.lua

local png = app.params["png"]
if png == nil or png == "" then
  png = "public/assets/prototypes/yui_idle_52_review_sheet.png"
end
if string.sub(png, 1, #"public/assets/prototypes/") ~= "public/assets/prototypes/" then
  error("refusing to export png outside public/assets/prototypes/: " .. png)
end

local function C(r, g, b, a) return app.pixelColor.rgba(r, g, b, a or 255) end
local function A(col) return app.pixelColor.rgbaA(col) end

local SRC = 52
local SCALE = 6
local CELL_W = 52 + SCALE * 52 + 36   -- 1x col + 6x col + padding
local CELL_H = SCALE * 52 + 40
local COLS = 1
local ROWS = 3
local W = CELL_W
local H = CELL_H * ROWS

-- night street background (dark, low-contrast, slight vertical gradient + ink blotch)
local BG_TOP = C(22, 20, 34)
local BG_BOT = C(14, 13, 24)
local INK    = C(30, 26, 44)

local sheet = Image(W, H)
for y = 0, H - 1 do
  local t = y / (H - 1)
  local r = math.floor(22 + (14 - 22) * t)
  local g = math.floor(20 + (13 - 20) * t)
  local b = math.floor(34 + (24 - 34) * t)
  for x = 0, W - 1 do
    sheet:drawPixel(x, y, C(r, g, b))
  end
end
-- faint ink blotches so we test separation against busy darks
math.randomseed(7)
for _ = 1, 14 do
  local bx = math.random(0, W - 1)
  local by = math.random(0, H - 1)
  local br = math.random(8, 22)
  for y = by - br, by + br do
    for x = bx - br, bx + br do
      if x >= 0 and y >= 0 and x < W and y < H then
        local dx, dy = (x - bx) / br, (y - by) / br
        if dx * dx + dy * dy <= 1 then sheet:drawPixel(x, y, INK) end
      end
    end
  end
end

local variants = { "A", "B", "C" }

local function blit(dst, src, ox, oy, scale)
  for y = 0, src.height - 1 do
    for x = 0, src.width - 1 do
      local p = src:getPixel(x, y)
      if A(p) > 0 then
        for sy = 0, scale - 1 do
          for sx = 0, scale - 1 do
            local px = ox + x * scale + sx
            local py = oy + y * scale + sy
            if px >= 0 and py >= 0 and px < dst.width and py < dst.height then
              -- simple alpha-over
              local d = dst:getPixel(px, py)
              local a = A(p)
              if a >= 250 then
                dst:drawPixel(px, py, p)
              else
                local dr = app.pixelColor.rgbaR(d)
                local dg = app.pixelColor.rgbaG(d)
                local db = app.pixelColor.rgbaB(d)
                local sr = app.pixelColor.rgbaR(p)
                local sg = app.pixelColor.rgbaG(p)
                local sb = app.pixelColor.rgbaB(p)
                local f = a / 255
                dst:drawPixel(px, py, C(
                  math.floor(sr * f + dr * (1 - f)),
                  math.floor(sg * f + dg * (1 - f)),
                  math.floor(sb * f + db * (1 - f))))
              end
            end
          end
        end
      end
    end
  end
end

for i, v in ipairs(variants) do
  local src = Image{ fromFile = "public/assets/prototypes/yui_idle_52_" .. v .. ".png" }
  local oy = (i - 1) * CELL_H + 20
  -- 1x
  blit(sheet, src, 16, oy + (SCALE * 52 - 52) / 2, 1)
  -- 6x
  blit(sheet, src, 16 + 52 + 16, oy, SCALE)
end

local out = Sprite(W, H, ColorMode.RGB)
out.layers[1].name = "sheet"
out:newCel(out.layers[1], out.frames[1], sheet, Point(0, 0))
out:saveCopyAs(png)
print("review sheet written: " .. png)
