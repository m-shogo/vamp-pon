-- Vamp Pon / Yui 52px V2a hand-finish assistant.
--
-- This is a GUI guide layer helper, not an auto-finalizer.
-- It marks the exact edit zones for the V2a hand-finish pass so the artist can
-- work inside Aseprite without hunting coordinates in a markdown doc.
--
-- Usage:
--   Open assets/source/prototypes/yui_idle_52_v2a.aseprite in Aseprite.
--   File > Scripts > scripts/aseprite/yui-52-v2a-handfinish-assistant.lua
--
-- Safe scope:
--   - Requires a 52x52 active sprite.
--   - Adds only a temporary guide layer named HF_GUIDE_DO_NOT_EXPORT.
--   - Does not export PNGs.
--   - Does not touch production paths.

local GUIDE_LAYER_NAME = "HF_GUIDE_DO_NOT_EXPORT"

local function rgba(r, g, b, a)
  return app.pixelColor.rgba(r, g, b, a)
end

local COLORS = {
  hood = rgba(80, 170, 255, 190),
  sheen = rgba(180, 230, 255, 220),
  hand = rgba(255, 210, 120, 220),
  arm = rgba(255, 150, 90, 200),
  eyes = rgba(255, 255, 255, 230),
  hair = rgba(190, 90, 55, 210),
  neck = rgba(255, 175, 150, 220),
  lantern = rgba(255, 220, 70, 220),
  rim = rgba(120, 235, 255, 200),
}

local function draw_rect(img, x0, y0, x1, y1, color)
  for x = x0, x1 do
    img:drawPixel(x, y0, color)
    img:drawPixel(x, y1, color)
  end
  for y = y0, y1 do
    img:drawPixel(x0, y, color)
    img:drawPixel(x1, y, color)
  end
end

local function draw_cross(img, x, y, color)
  img:drawPixel(x, y, color)
  if x > 0 then img:drawPixel(x - 1, y, color) end
  if x < img.width - 1 then img:drawPixel(x + 1, y, color) end
  if y > 0 then img:drawPixel(x, y - 1, color) end
  if y < img.height - 1 then img:drawPixel(x, y + 1, color) end
end

local function remove_old_guide(sprite)
  for _, layer in ipairs(sprite.layers) do
    if layer.name == GUIDE_LAYER_NAME then
      pcall(function()
        sprite:deleteLayer(layer)
      end)
      return
    end
  end
end

local sprite = app.activeSprite
if sprite == nil then
  error("No active sprite. Open assets/source/prototypes/yui_idle_52_v2a.aseprite first.")
end

if sprite.width ~= 52 or sprite.height ~= 52 then
  error("Yui V2a hand-finish assistant expects a 52x52 sprite. Active sprite is " .. sprite.width .. "x" .. sprite.height .. ".")
end

local frame = app.activeFrame or sprite.frames[1]

app.transaction("Add Yui V2a hand-finish guide layer", function()
  remove_old_guide(sprite)

  local guide = sprite:newLayer()
  guide.name = GUIDE_LAYER_NAME
  guide.opacity = 150
  guide.isVisible = true

  local img = Image(sprite.width, sprite.height)

  -- A. silhouette / hood
  draw_rect(img, 3, 5, 46, 26, COLORS.hood)      -- current wide hood area: tighten sides by hand
  draw_rect(img, 19, 10, 21, 11, COLORS.sheen)   -- desired compact top-sheen target

  -- B. contact / holding read
  draw_rect(img, 22, 29, 26, 30, COLORS.neck)    -- neck shadow line
  draw_rect(img, 30, 32, 39, 37, COLORS.arm)     -- sleeve highlight/shadow pass
  draw_rect(img, 32, 32, 40, 36, COLORS.hand)    -- fingers + grip shadow

  -- C. charm core
  draw_rect(img, 16, 20, 20, 25, COLORS.eyes)    -- left eye catchlight/lower lid
  draw_rect(img, 27, 20, 31, 25, COLORS.eyes)    -- right eye catchlight/lower lid
  draw_rect(img, 17, 14, 32, 17, COLORS.hair)    -- split fringe into 3 clusters

  -- D. visibility / separation
  draw_rect(img, 38, 32, 48, 43, COLORS.lantern) -- lantern rim + outer glow trim check
  draw_rect(img, 4, 7, 10, 24, COLORS.rim)       -- left hood rim smoothing
  draw_rect(img, 16, 35, 23, 43, COLORS.rim)     -- left shoulder rim, modest only

  -- hitCore avoidance reminder: lantern glow must not reach center.
  draw_cross(img, 26, 26, rgba(255, 0, 180, 230))

  sprite:newCel(guide, frame, img, Point(0, 0))
end)

app.refresh()

local dlg = Dialog{ title = "Yui 52px V2a HF Assistant" }
dlg:label{ text = "Guide layer added: HF_GUIDE_DO_NOT_EXPORT" }
dlg:label{ text = "Save As first: assets/source/prototypes/yui_idle_52_v2a_hf.aseprite" }
dlg:separator{ text = "Edit order" }
dlg:label{ text = "1 hood width / top sheen" }
dlg:label{ text = "2 neck shadow / hand fingers / sleeve shading" }
dlg:label{ text = "3 eye clean dots / lower lids / 3-cluster fringe" }
dlg:label{ text = "4 lantern rim / glow trim / shoulder rim" }
dlg:separator{ text = "Important" }
dlg:label{ text = "Hide or delete the guide layer before PNG export." }
dlg:label{ text = "This script is not hand-final evidence by itself." }
dlg:button{ text = "OK" }
dlg:show{ wait = false }
