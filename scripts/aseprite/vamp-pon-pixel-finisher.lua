-- vamp-pon-pixel-finisher.lua
--
-- Vamp Pon shared *procedural finisher* pass for Aseprite (CLI / batch).
--
-- WHAT THIS IS:
--   A script-assisted finishing pass that takes an existing PROTOTYPE
--   .aseprite (e.g. the Yui 52px V2a master prototype) and applies a set of
--   small, repeatable pixel cleanups (silhouette tighten, sheen clustering,
--   eye catchlight cleanup, fringe clusters, hand/handle read, lantern rim,
--   glow trim, neck shadow, rim-light tidy). It writes a NEW `_pf` source+PNG.
--
--   For Yui it edits the build's NAMED LAYERS (hood / hair / eyes / lantern /
--   glow / ...) directly, so each pass works on clean, un-composited pixels.
--
-- WHAT THIS IS NOT (read docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md):
--   - This is NOT a GUI hand-finish. A human did not move pixels by hand.
--   - The output is `script-assisted-candidate` status, never `hand-final`,
--     never `final`, never `production-candidate` by itself.
--   - player / main characters STILL require a human review pass before any
--     promotion. This pass only raises the baseline so review starts higher.
--
-- SAFE SCOPE (hard guards below):
--   - input  : an existing .aseprite (any path; opened read-only, never saved).
--   - output : .aseprite, MUST live under assets/source/prototypes/.
--   - png    : .png,      MUST live under public/assets/prototypes/.
--   - Refuses to write to production paths
--     (public/assets/sprites/player, assets/source/aseprite/player).
--   - Does not touch gameplay constants; it only edits an image.
--
-- MODES (--script-param mode=...):
--   yui52-v2a            implemented (52x52 Yui idle V2a, layer-aware pass).
--   generic-character-52 stub (see notes) - future shared 52px char pass.
--   item-small           stub (see notes) - future small pickup/fragment pass.
--   enemy-shadow         stub (see notes) - future ink-family enemy pass.
--
-- USAGE:
--   aseprite -b \
--     --script-param input=assets/source/prototypes/yui_idle_52_v2a.aseprite \
--     --script-param output=assets/source/prototypes/yui_idle_52_v2a_pf.aseprite \
--     --script-param png=public/assets/prototypes/yui_idle_52_v2a_pf.png \
--     --script-param recipe=data/pixel-art/character-recipes/yui.json \
--     --script-param mode=yui52-v2a \
--     --script scripts/aseprite/vamp-pon-pixel-finisher.lua

-- ─── Params + guards ─────────────────────────────────────────────────────────
local input  = app.params["input"]
local output = app.params["output"]
local png    = app.params["png"]
local recipe = app.params["recipe"]   -- optional; recorded only (recipe-driven
                                       -- modes are future work, see stubs).
local mode   = app.params["mode"] or "yui52-v2a"

local function starts_with(s, prefix) return string.sub(s or "", 1, #prefix) == prefix end
local function ends_with(s, suffix) return suffix == "" or string.sub(s or "", -#suffix) == suffix end

if input == nil or input == "" then
  error("missing --script-param input=<prototype .aseprite>")
end
if not ends_with(input, ".aseprite") then
  error("input must be a .aseprite file: " .. tostring(input))
end

-- production write protection (defense in depth; node runner also guards).
local PRODUCTION_PREFIXES = {
  "public/assets/sprites/player",
  "assets/source/aseprite/player",
}
local function refuse_production(path, label)
  for _, p in ipairs(PRODUCTION_PREFIXES) do
    if starts_with(path, p) then
      error("refusing to write " .. label .. " to production path: " .. path)
    end
  end
end

if output == nil or output == "" then
  error("missing --script-param output=<_pf .aseprite under assets/source/prototypes/>")
end
if not starts_with(output, "assets/source/prototypes/") then
  error("refusing to write source outside assets/source/prototypes/: " .. output)
end
if not ends_with(output, ".aseprite") then
  error("output must end with .aseprite: " .. output)
end
refuse_production(output, "source")

if png == nil or png == "" then
  error("missing --script-param png=<.png under public/assets/prototypes/>")
end
if not starts_with(png, "public/assets/prototypes/") then
  error("refusing to export png outside public/assets/prototypes/: " .. png)
end
if not ends_with(png, ".png") then
  error("png must end with .png: " .. png)
end
refuse_production(png, "png")

-- ─── Load the prototype (layers preserved; never flattened before edits) ─────
local sprite = Sprite{ fromFile = input }
if sprite == nil then
  error("could not open input sprite: " .. input)
end
local SIZE = sprite.width
local frame = sprite.frames[1]

-- ─── pixel helpers ───────────────────────────────────────────────────────────
local pc = app.pixelColor
local function C(r, g, b, a) return pc.rgba(r, g, b, a or 255) end
local function R(p) return pc.rgbaR(p) end
local function G(p) return pc.rgbaG(p) end
local function B(p) return pc.rgbaB(p) end
local function A(p) return pc.rgbaA(p) end
local CLEAR = C(0, 0, 0, 0)

-- A LayerBuf is a full-canvas editable copy of a named layer's cel, plus the
-- layer + a setter that writes the buffer back as a fresh full-size cel.
local layerByName = {}
for _, l in ipairs(sprite.layers) do layerByName[l.name] = l end

local function load_layer(name)
  local layer = layerByName[name]
  if layer == nil then error("yui52-v2a: missing expected layer '" .. name .. "'") end
  local img = Image(SIZE, SIZE, ColorMode.RGB)
  local cel = layer:cel(frame)
  if cel ~= nil then
    local ci, ox, oy = cel.image, cel.position.x, cel.position.y
    for y = 0, ci.height - 1 do
      for x = 0, ci.width - 1 do
        local px, py = ox + x, oy + y
        if px >= 0 and py >= 0 and px < SIZE and py < SIZE then
          img:drawPixel(px, py, ci:getPixel(x, y))
        end
      end
    end
  end
  return { layer = layer, img = img }
end

local dirty = {}   -- buffers to write back at the end
local function buf(name)
  if dirty[name] == nil then dirty[name] = load_layer(name) end
  return dirty[name].img
end
local function add_layer_above(name, base_layer)
  local l = sprite:newLayer()
  l.name = name
  -- move directly above base_layer
  l.stackIndex = base_layer.stackIndex + 1
  local img = Image(SIZE, SIZE, ColorMode.RGB)
  dirty[name] = { layer = l, img = img, fresh = true }
  return img
end

local function gget(img, x, y)
  if x < 0 or y < 0 or x >= SIZE or y >= SIZE then return CLEAR end
  return img:getPixel(x, y)
end
local function gset(img, x, y, col)
  if x < 0 or y < 0 or x >= SIZE or y >= SIZE then return end
  img:drawPixel(x, y, col)
end
local function gempty(img, x, y) return A(gget(img, x, y)) == 0 end

-- ─── V2a palette (mirrors scripts/prototypes/build-yui-52-v2.lua) ────────────
local PAL = {
  OUTLINE   = { 28, 22, 40 },
  HOOD_D    = { 48, 64, 112 },
  HOOD_M    = { 72, 100, 156 },
  HOOD_L    = { 112, 142, 196 },
  HOOD_B    = { 156, 184, 228 },   -- top sheen / brightest hood
  HOOD_RIM  = { 182, 206, 244 },
  HAIR_D    = { 78, 40, 32 },
  HAIR_M    = { 122, 66, 50 },
  HAIR_H    = { 170, 104, 78 },
  SKIN      = { 252, 218, 174 },
  SKIN_SH   = { 222, 185, 138 },
  EYE_D     = { 30, 20, 34 },
  EYE_W     = { 255, 252, 240 },
  IRIS      = { 156, 102, 60 },
  IRIS_D    = { 92, 52, 30 },
  DRESS     = { 222, 204, 160 },
  DRESS_SH  = { 184, 161, 121 },
  DRESS_HI  = { 244, 228, 190 },
  LAN_CAGE  = { 118, 94, 66 },
  LAN_CAGE_D= { 92, 72, 50 },
  LAN_WARM  = { 252, 198, 96 },
  LAN_CORE  = { 255, 250, 212 },
  LAN_RIM   = { 255, 226, 150 },   -- new warm rim accent (between warm + core)
}
local function col(name) local c = PAL[name]; return C(c[1], c[2], c[3]) end
local function is(p, name) local c = PAL[name]; return A(p) >= 250 and R(p) == c[1] and G(p) == c[2] and B(p) == c[3] end
local function isHood(p)
  return is(p, "HOOD_D") or is(p, "HOOD_M") or is(p, "HOOD_L") or is(p, "HOOD_B") or is(p, "HOOD_RIM")
end
local function isSkin(p) return is(p, "SKIN") or is(p, "SKIN_SH") end

-- ─── Finishing passes (yui52-v2a; one named-layer focus each) ────────────────
local applied = {}
local function logpass(s) applied[#applied + 1] = s end

-- 1. Tighten hood sides by 1px in the upper crown. Erode the hood-fill outer
--    column and move the 1px outline inward, so the hood reads as round cloth.
local function tighten_hood_sides()
  local hood = buf("hood")
  local outline = buf("outline")
  local rim = buf("rim")   -- rim light rides the silhouette edge; move it in too.
  local y0, y1 = 6, 22     -- skip the crown apex (rows 0-5) to avoid corner gaps
  local rows = 0
  -- shift any rim pixel from the old edge column to the new (1px inner) column
  -- so the bright hood rim is preserved instead of being hidden by the outline.
  local function shift_rim(x_old, x_new, y)
    if is(gget(rim, x_old, y), "HOOD_RIM") then
      gset(rim, x_old, y, CLEAR)
      if A(gget(rim, x_new, y)) == 0 then gset(rim, x_new, y, col("HOOD_RIM")) end
    end
  end
  for y = y0, y1 do
    -- leftmost hood-fill pixel in this row
    local xl
    for x = 0, SIZE - 1 do if isHood(gget(hood, x, y)) then xl = x; break end end
    if xl ~= nil and xl >= 1 then
      gset(hood, xl, y, CLEAR)             -- erode 1px of hood fill
      gset(outline, xl, y, col("OUTLINE")) -- new silhouette edge
      gset(outline, xl - 1, y, CLEAR)      -- drop old outer outline
      shift_rim(xl, xl + 1, y)
      rows = rows + 1
    end
    -- rightmost hood-fill pixel in this row
    local xr
    for x = SIZE - 1, 0, -1 do if isHood(gget(hood, x, y)) then xr = x; break end end
    if xr ~= nil and xr <= SIZE - 2 then
      gset(hood, xr, y, CLEAR)
      gset(outline, xr, y, col("OUTLINE"))
      gset(outline, xr + 1, y, CLEAR)
      shift_rim(xr, xr - 1, y)
    end
  end
  logpass("hood sides tightened 1px (crown rows " .. y0 .. "-" .. y1 .. ")")
end

-- 2. Cluster the top sheen into a compact 3px blob (HOOD_B); scattered bright
--    hood pixels drop to HOOD_L so the sheen reads as one soft highlight.
local function cluster_top_sheen()
  local hood = buf("hood")
  local xs, ys, n = 0, 0, 0
  for y = 0, 22 do for x = 0, SIZE - 1 do
    if is(gget(hood, x, y), "HOOD_B") then xs = xs + x; ys = ys + y; n = n + 1 end
  end end
  if n == 0 then return end
  local cx, cy = math.floor(xs / n + 0.5), math.floor(ys / n + 0.5)
  for y = 0, 22 do for x = 0, SIZE - 1 do
    if is(gget(hood, x, y), "HOOD_B") then gset(hood, x, y, col("HOOD_L")) end
  end end
  for _, d in ipairs({ {0,0}, {1,0}, {0,1} }) do
    local x, y = cx + d[1], cy + d[2]
    if A(gget(hood, x, y)) >= 250 then gset(hood, x, y, col("HOOD_B")) end
  end
  logpass("top sheen clustered to 3px at (" .. cx .. "," .. cy .. ")")
end

-- find left/right eye x-ranges from the eyes layer (clearly split in x).
local function eye_regions(eyes)
  local cols = {}
  for x = 0, SIZE - 1 do
    local hit = false
    for y = 14, 30 do if A(gget(eyes, x, y)) >= 250 then hit = true; break end end
    cols[x] = hit
  end
  local regions, run = {}, nil
  for x = 0, SIZE - 1 do
    if cols[x] then run = run or { x, x }; run[2] = x
    elseif run then regions[#regions + 1] = run; run = nil end
  end
  if run then regions[#regions + 1] = run end
  return regions
end

-- 3 + 4. Clean each eye catchlight to a single 1px dot, add a 1px lower lid.
local function clean_eyes()
  local eyes = buf("eyes")
  local regions = eye_regions(eyes)
  for _, r in ipairs(regions) do
    local x0, x1 = r[1], r[2]
    local bestx, besty
    for y = 14, 30 do for x = x0, x1 do
      if is(gget(eyes, x, y), "EYE_W") then
        if besty == nil or y < besty or (y == besty and x < bestx) then bestx, besty = x, y end
      end
    end end
    for y = 14, 30 do for x = x0, x1 do
      if is(gget(eyes, x, y), "EYE_W") then gset(eyes, x, y, col("IRIS")) end
    end end
    if bestx ~= nil then gset(eyes, bestx, besty, col("EYE_W")) end
    -- lower lid: 1px EYE_D under the eye dark mass.
    local lidy
    for y = 30, 14, -1 do
      local found = false
      for x = x0, x1 do if A(gget(eyes, x, y)) >= 250 then found = true; break end end
      if found then lidy = y; break end
    end
    if lidy then
      for x = x0, x1 do
        if A(gget(eyes, x, lidy)) >= 250 and A(gget(eyes, x, lidy + 1)) == 0 then
          gset(eyes, x, lidy + 1, col("EYE_D"))
        end
      end
    end
  end
  logpass("eye catchlights cleaned to 1px + 1px lower lids (" .. #regions .. " eyes)")
end

-- 5. 3-cluster fringe: add three small hair tufts hanging from the hairline
--    over the forehead. Drawn on a NEW layer just above 'face' so the tufts
--    read over the skin (the build pulled the bangs up off the brow).
local function add_fringe_clusters()
  local face = buf("face")
  -- forehead = topmost skin band on the face layer.
  local topy
  for y = 10, 28 do
    local has = false
    for x = math.floor(SIZE * 0.30), math.floor(SIZE * 0.70) do
      if isSkin(gget(face, x, y)) then has = true; break end
    end
    if has then topy = y; break end
  end
  if topy == nil then return end
  -- use the WIDEST forehead skin row in the brow band so the three tufts spread.
  local browy, minx, maxx, bestw = topy, nil, nil, -1
  for y = topy, math.min(topy + 4, SIZE - 1) do
    local lo, hi
    for x = 0, SIZE - 1 do
      if isSkin(gget(face, x, y)) then lo = (lo == nil) and x or lo; hi = x end
    end
    if lo ~= nil and (hi - lo) > bestw then bestw = hi - lo; browy = y; minx = lo; maxx = hi end
  end
  if minx == nil or maxx - minx < 4 then return end
  local fringe = add_layer_above("hair_fringe_pf", layerByName["face"])
  local span = maxx - minx
  local tufts = { minx + math.floor(span * 0.20), minx + math.floor(span * 0.5), minx + math.ceil(span * 0.80) }
  local placed = {}
  for _, tx in ipairs(tufts) do
    -- only place where the forehead is skin (don't poke into hood/hair).
    if isSkin(gget(face, tx, browy)) then
      gset(fringe, tx, browy, col("HAIR_M"))
      gset(fringe, tx, browy + 1, col("HAIR_D"))
      placed[#placed + 1] = tx
    end
  end
  logpass("3-cluster fringe tufts added on new layer (browy=" .. browy .. ", x=" .. table.concat(placed, ",") .. ")")
end

-- 6 + 7. Hand: finger grooves on the arm layer; connect the lantern handle.
local function hand_and_handle()
  local arm = buf("arm")
  local minx, maxx, miny, maxy
  for y = math.floor(SIZE * 0.55), SIZE - 1 do
    for x = math.floor(SIZE * 0.6), SIZE - 1 do
      if isSkin(gget(arm, x, y)) then
        minx = (minx == nil or x < minx) and x or minx
        maxx = (maxx == nil or x > maxx) and x or maxx
        miny = (miny == nil or y < miny) and y or miny
        maxy = (maxy == nil or y > maxy) and y or maxy
      end
    end
  end
  if minx ~= nil and maxx - minx >= 2 then
    local f1 = minx + math.floor((maxx - minx) / 3)
    local f2 = minx + math.floor(2 * (maxx - minx) / 3)
    for _, fx in ipairs({ f1, f2 }) do
      for y = miny, maxy do
        if is(gget(arm, fx, y), "SKIN") then gset(arm, fx, y, col("SKIN_SH")) end
      end
    end
    logpass("hand finger grooves added (x=" .. f1 .. "," .. f2 .. ")")
    -- handle connect: bridge hand -> lantern handle on the lantern layer.
    local lantern = buf("lantern")
    local hx = math.floor((minx + maxx) / 2)
    local bridged = 0
    for y = miny - 1, math.max(miny - 4, 0), -1 do
      if A(gget(lantern, hx, y)) >= 250 then break end
      gset(lantern, hx, y, col("LAN_CAGE")); bridged = bridged + 1
    end
    if bridged > 0 then logpass("lantern handle connected to hand (" .. bridged .. " px)") end
  end
end

-- 8. Sleeve shading: 1px DRESS_SH underside along the arm-layer sleeve.
local function sleeve_shading()
  local arm = buf("arm")
  local added = 0
  for y = math.floor(SIZE * 0.5), SIZE - 2 do
    for x = math.floor(SIZE * 0.58), SIZE - 1 do
      if is(gget(arm, x, y), "DRESS") and is(gget(arm, x, y - 1), "DRESS")
         and not is(gget(arm, x, y + 1), "DRESS") then
        gset(arm, x, y, col("DRESS_SH")); added = added + 1
      end
    end
  end
  logpass("sleeve underside shading (" .. added .. " px)")
end

-- 9. Lantern warm rim: brighten the lit (left) edge of the warm fill.
local function lantern_rim()
  local lantern = buf("lantern")
  local added = 0
  for y = 0, SIZE - 1 do
    -- leftmost LAN_WARM pixel in the row = lit edge of the body.
    for x = 0, SIZE - 1 do
      if is(gget(lantern, x, y), "LAN_WARM") then
        gset(lantern, x, y, col("LAN_RIM")); added = added + 1; break
      end
    end
  end
  logpass("lantern warm rim on lit edge (" .. added .. " px)")
end

-- soft warm glow on the glow layer: semi-transparent + reddish-warm.
local function isGlow(p)
  local a = A(p)
  return a > 0 and a < 240 and R(p) > G(p) and G(p) >= B(p) and R(p) > 120
end

-- 10. Glow trim: halve alpha on outer-ring glow pixels (border transparent) so
--     the glow stays tight and never reads as a pickup or bleeds to center.
local function trim_glow()
  local glow = buf("glow")
  local edges = {}
  for y = 0, SIZE - 1 do for x = 0, SIZE - 1 do
    local p = gget(glow, x, y)
    if isGlow(p) then
      if gempty(glow, x - 1, y) or gempty(glow, x + 1, y) or gempty(glow, x, y - 1) or gempty(glow, x, y + 1) then
        edges[#edges + 1] = { x, y, p }
      end
    end
  end end
  for _, e in ipairs(edges) do
    local p = e[3]
    gset(glow, e[1], e[2], C(R(p), G(p), B(p), math.floor(A(p) * 0.5)))
  end
  logpass("glow outer ring weakened (" .. #edges .. " px @ 50% alpha)")
end

-- 11. Under-chin neck shadow: 1px SKIN_SH at the bottom of the neck-layer skin.
local function neck_shadow()
  local neck = buf("neck")
  local added = 0
  -- the topmost neck-skin pixel per column sits right under the chin -> shade it.
  for x = math.floor(SIZE * 0.34), math.floor(SIZE * 0.64) do
    local topy
    for y = 14, math.floor(SIZE * 0.7) do
      if is(gget(neck, x, y), "SKIN") then topy = y; break end
    end
    if topy then gset(neck, x, topy, col("SKIN_SH")); added = added + 1 end
  end
  logpass("under-chin neck shadow (" .. added .. " px)")
end

-- 12. Rim-light tidy: keep the hood rim a clean 1px edge. Only remove rim pixels
--     that are FULLY BURIED (all 4 rim-layer neighbors are also HOOD_RIM) -> a
--     truly redundant inner pixel. This never erases the visible 1px edge line
--     (whose pixels always border the empty interior in the rim layer).
local function tidy_rim()
  local rim = buf("rim")
  local hood = buf("hood")
  local thinned = 0
  for y = 1, SIZE - 2 do for x = 1, SIZE - 2 do
    if is(gget(rim, x, y), "HOOD_RIM")
       and is(gget(rim, x - 1, y), "HOOD_RIM") and is(gget(rim, x + 1, y), "HOOD_RIM")
       and is(gget(rim, x, y - 1), "HOOD_RIM") and is(gget(rim, x, y + 1), "HOOD_RIM") then
      gset(rim, x, y, CLEAR)
      if A(gget(hood, x, y)) == 0 then gset(hood, x, y, col("HOOD_L")) end
      thinned = thinned + 1
    end
  end end
  logpass("rim-light tidy: buried inner rim pixels removed (" .. thinned .. " px)")
end

-- ─── Mode dispatch ───────────────────────────────────────────────────────────
if mode == "yui52-v2a" then
  if SIZE ~= 52 then
    error("yui52-v2a mode expects a 52x52 sprite, got " .. SIZE .. "x" .. sprite.height)
  end
  -- 52px-specific finishing is intentionally confined to this branch.
  tighten_hood_sides()
  cluster_top_sheen()
  clean_eyes()
  add_fringe_clusters()
  hand_and_handle()
  sleeve_shading()
  lantern_rim()
  trim_glow()
  neck_shadow()
  tidy_rim()
elseif mode == "generic-character-52" then
  -- STUB. Future: a recipe-driven 52px character pass. It should read the
  -- character recipe (--script-param recipe=...) for palette / silhouette /
  -- glow rules, then run the size-agnostic subset of the passes above
  -- (sheen cluster, eye cleanup, rim tidy, glow trim, outline normalize).
  -- Until implemented, fail loudly so no one mistakes an unprocessed copy for
  -- a finished candidate.
  error("mode 'generic-character-52' is not implemented yet (stub). Use yui52-v2a.")
elseif mode == "item-small" then
  -- STUB. Future: small pickup / memory-fragment finishing (torn-paper edge
  -- cleanup, 1px ink rim, single highlight dot, drop-shadow trim). Must keep
  -- items visually distinct from the lantern glow.
  error("mode 'item-small' is not implemented yet (stub). Use yui52-v2a.")
elseif mode == "enemy-shadow" then
  -- STUB. Future: ink-family enemy finishing (silhouette read, glowing-eye
  -- cleanup to clean dots, ink-edge tidy, background separation rim). Must keep
  -- enemies from merging with the player or the dark background.
  error("mode 'enemy-shadow' is not implemented yet (stub). Use yui52-v2a.")
else
  error("unknown mode: " .. tostring(mode) .. " (yui52-v2a | generic-character-52 | item-small | enemy-shadow)")
end

-- ─── Write edited buffers back, then save ────────────────────────────────────
for name, b in pairs(dirty) do
  if b.fresh then
    sprite:newCel(b.layer, frame, b.img, Point(0, 0))
  else
    local cel = b.layer:cel(frame)
    if cel == nil then
      sprite:newCel(b.layer, frame, b.img, Point(0, 0))
    else
      cel.position = Point(0, 0)
      cel.image = b.img
    end
  end
end

sprite:saveAs(output)
sprite:saveCopyAs(png)   -- PNG export flattens the layered sprite for us.

print("vamp-pon-pixel-finisher: mode=" .. mode)
print("  input:  " .. input)
print("  output: " .. output)
print("  png:    " .. png)
if recipe ~= nil and recipe ~= "" then print("  recipe: " .. recipe) end
print("  passes applied:")
for _, s in ipairs(applied) do print("    - " .. s) end
print("STATUS: script-assisted-candidate (NOT hand-final / NOT GUI hand-finish / NOT production-candidate).")
print("        player / main characters still require a human review pass.")
