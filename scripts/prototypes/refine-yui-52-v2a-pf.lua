-- refine-yui-52-v2a-pf.lua
--
-- Script-assisted REFINEMENT (pass 2) of the Yui 52px V2a procedural finish.
--
-- WHAT THIS IS:
--   A second, conservative script-assisted pass that nudges the seven review
--   focus areas (face/eyes/mouth charm, hood balance, fringe flow, holding
--   hand, lantern metal, cheeks/neck/jaw tidy, 1x background separation) so the
--   candidate is ready to be put in front of a HUMAN reviewer.
--
-- WHAT THIS IS NOT (read docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md):
--   - This is NOT a GUI hand-finish. No human moved 1px by hand here.
--   - It does NOT make the sprite `hand-final`. Deep charm / hand anatomy /
--     metal reflections / true hair flow stay HUMAN GUI work toward hand-final.
--   - It edits the V2a_pf (script-assisted-candidate) and writes a NEW `_hr`
--     artifact (human-review-candidate input). `_pf` is preserved as the
--     script-assisted baseline (provenance: v2a -> _pf -> _hr).
--
-- SAFE SCOPE (hard guards):
--   - input  : assets/source/prototypes/yui_idle_52_v2a_pf.aseprite (read-only)
--   - output : .aseprite under assets/source/prototypes/ only
--   - png    : .png under public/assets/prototypes/ only
--   - refuses production paths; never touches gameplay constants.
--
-- USAGE:
--   aseprite -b \
--     --script-param input=assets/source/prototypes/yui_idle_52_v2a_pf.aseprite \
--     --script-param output=assets/source/prototypes/yui_idle_52_v2a_hr.aseprite \
--     --script-param png=public/assets/prototypes/yui_idle_52_v2a_hr.png \
--     --script scripts/prototypes/refine-yui-52-v2a-pf.lua

local input  = app.params["input"] or "assets/source/prototypes/yui_idle_52_v2a_pf.aseprite"
local output = app.params["output"] or "assets/source/prototypes/yui_idle_52_v2a_hr.aseprite"
local png    = app.params["png"] or "public/assets/prototypes/yui_idle_52_v2a_hr.png"

local function starts_with(s, p) return string.sub(s or "", 1, #p) == p end
local function ends_with(s, p) return p == "" or string.sub(s or "", -#p) == p end

local PRODUCTION = { "public/assets/sprites/player", "assets/source/aseprite/player" }
local function refuse(path, label)
  for _, p in ipairs(PRODUCTION) do
    if starts_with(path, p) then error("refusing to write " .. label .. " to production: " .. path) end
  end
end
if not starts_with(output, "assets/source/prototypes/") or not ends_with(output, ".aseprite") then
  error("output must be a .aseprite under assets/source/prototypes/: " .. output)
end
if not starts_with(png, "public/assets/prototypes/") or not ends_with(png, ".png") then
  error("png must be a .png under public/assets/prototypes/: " .. png)
end
refuse(output, "source"); refuse(png, "png")

local sprite = Sprite{ fromFile = input }
if sprite == nil then error("could not open input: " .. input) end
local SIZE = sprite.width
local frame = sprite.frames[1]

local pc = app.pixelColor
local function C(r, g, b, a) return pc.rgba(r, g, b, a or 255) end
local function R(p) return pc.rgbaR(p) end
local function G(p) return pc.rgbaG(p) end
local function B(p) return pc.rgbaB(p) end
local function A(p) return pc.rgbaA(p) end
local CLEAR = C(0, 0, 0, 0)

local layerByName = {}
for _, l in ipairs(sprite.layers) do layerByName[l.name] = l end
local dirty = {}
local function load_layer(name)
  local layer = layerByName[name]
  if layer == nil then error("missing expected layer '" .. name .. "'") end
  local img = Image(SIZE, SIZE, ColorMode.RGB)
  local cel = layer:cel(frame)
  if cel ~= nil then
    local ci, ox, oy = cel.image, cel.position.x, cel.position.y
    for y = 0, ci.height - 1 do for x = 0, ci.width - 1 do
      local px, py = ox + x, oy + y
      if px >= 0 and py >= 0 and px < SIZE and py < SIZE then img:drawPixel(px, py, ci:getPixel(x, y)) end
    end end
  end
  return { layer = layer, img = img }
end
local function buf(name)
  if dirty[name] == nil then dirty[name] = load_layer(name) end
  return dirty[name].img
end
local function gget(img, x, y)
  if x < 0 or y < 0 or x >= SIZE or y >= SIZE then return CLEAR end
  return img:getPixel(x, y)
end
local function gset(img, x, y, col)
  if x < 0 or y < 0 or x >= SIZE or y >= SIZE then return end
  img:drawPixel(x, y, col)
end

local PAL = {
  HOOD_L  = { 112, 142, 196 },
  HOOD_RIM= { 182, 206, 244 },
  HAIR_D  = { 78, 40, 32 },
  HAIR_M  = { 122, 66, 50 },
  HAIR_H  = { 170, 104, 78 },
  SKIN    = { 252, 218, 174 },
  SKIN_SH = { 222, 185, 138 },
  SKIN_HI = { 255, 234, 198 },   -- new soft skin highlight (knuckle/jaw)
  EYE_W   = { 255, 252, 240 },
  IRIS    = { 156, 102, 60 },
  IRIS_D  = { 92, 52, 30 },
  BLUSH   = { 238, 152, 142 },
  BLUSH_L = { 246, 184, 174 },   -- new softer blush
  MOUTH   = { 150, 80, 78 },
  LAN_CAGE= { 118, 94, 66 },
  LAN_CORE= { 255, 250, 212 },
  OUTLINE = { 28, 22, 40 },
}
local function col(n) local c = PAL[n]; return C(c[1], c[2], c[3]) end
local function is(p, n) local c = PAL[n]; return A(p) >= 250 and R(p) == c[1] and G(p) == c[2] and B(p) == c[3] end

local applied = {}
local function logp(s) applied[#applied + 1] = s end

-- find left/right eye x-ranges from the eyes layer.
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

-- 1. Eyes: add a small secondary catchlight (lower-right) for a livelier, cuter
--    glint. Only over iris pixels, 1px, so it stays clean at 1x.
local function eye_sparkle()
  local eyes = buf("eyes")
  local regions = eye_regions(eyes)
  local added = 0
  for _, r in ipairs(regions) do
    local mx, my
    for y = 14, 30 do for x = r[1], r[2] do
      if is(gget(eyes, x, y), "EYE_W") then mx, my = x, y end  -- last = lower main light
    end end
    if mx then
      local sx, sy = mx + 2, my + 3
      local p = gget(eyes, sx, sy)
      if is(p, "IRIS") or is(p, "IRIS_D") then gset(eyes, sx, sy, col("EYE_W")); added = added + 1 end
    end
  end
  logp("eye secondary catchlight (" .. added .. " px)")
end

-- 2. Mouth: nudge the flat mouth into a gentle smile (ends up, center 1px down).
local function mouth_smile()
  local cheeks = buf("cheeks")
  -- collect mouth pixels
  local xs, ymax = {}, nil
  for y = 14, 34 do for x = 14, 38 do
    if is(gget(cheeks, x, y), "MOUTH") then
      xs[#xs + 1] = { x, y }
      ymax = (ymax == nil or y > ymax) and y or ymax
    end
  end end
  if #xs < 3 then return end
  -- center x of the mouth row
  local minx, maxx = 99, -1
  for _, q in ipairs(xs) do if q[2] == ymax then minx = math.min(minx, q[1]); maxx = math.max(maxx, q[1]) end end
  local cx = (minx + maxx) // 2
  -- drop the center pixel down one row -> concave-up smile
  gset(cheeks, cx, ymax, CLEAR)
  gset(cheeks, cx, ymax + 1, col("MOUTH"))
  logp("mouth softened to a gentle smile (center x=" .. cx .. ")")
end

-- 3. Cheeks: soften + shrink the blush to a tidy compact core per cheek.
local function soften_blush()
  local cheeks = buf("cheeks")
  -- per side, find blush bbox, keep a 2x2 lower-center core as BLUSH_L, clear rest.
  for _, side in ipairs({ { 4, 25 }, { 26, 47 } }) do
    local minx, maxx, miny, maxy
    for y = 18, 32 do for x = side[1], side[2] do
      if is(gget(cheeks, x, y), "BLUSH") then
        minx = (minx == nil or x < minx) and x or minx
        maxx = (maxx == nil or x > maxx) and x or maxx
        miny = (miny == nil or y < miny) and y or miny
        maxy = (maxy == nil or y > maxy) and y or maxy
      end
    end end
    if minx ~= nil then
      for y = miny, maxy do for x = minx, maxx do
        if is(gget(cheeks, x, y), "BLUSH") then gset(cheeks, x, y, CLEAR) end
      end end
      local ccx = (minx + maxx) // 2
      local ccy = maxy - 1
      for _, d in ipairs({ {0,0}, {1,0}, {0,1}, {1,1} }) do
        gset(cheeks, ccx + d[1] - 0, ccy + d[2], col("BLUSH_L"))
      end
    end
  end
  logp("blush softened + compacted (BLUSH_L 2x2 per cheek)")
end

-- 4. Fringe flow: add a HAIR_H highlight to each fringe tuft so it reads as a
--    strand with direction rather than a flat dot. Side tufts lean outward.
local function fringe_flow()
  local fr = buf("hair_fringe_pf")
  local tufts = {}
  for x = 0, SIZE - 1 do for y = 12, 22 do
    if is(gget(fr, x, y), "HAIR_M") then tufts[#tufts + 1] = { x, y } end
  end end
  local mid = SIZE // 2
  local added = 0
  for _, t in ipairs(tufts) do
    local lean = (t[1] < mid - 2 and -1) or (t[1] > mid + 2 and 1) or 0
    local hx, hy = t[1] + lean, t[2] - 1
    if A(gget(fr, hx, hy)) == 0 then gset(fr, hx, hy, col("HAIR_H")); added = added + 1 end
  end
  logp("fringe tuft highlights / lean for flow (" .. added .. " px)")
end

-- 5. Holding hand: add a soft knuckle highlight so the grip reads rounder.
local function hand_knuckle()
  local arm = buf("arm")
  local minx, maxx, miny
  for y = math.floor(SIZE * 0.55), SIZE - 1 do for x = math.floor(SIZE * 0.6), SIZE - 1 do
    if is(gget(arm, x, y), "SKIN") then
      minx = (minx == nil or x < minx) and x or minx
      maxx = (maxx == nil or x > maxx) and x or maxx
      miny = (miny == nil or y < miny) and y or miny
    end
  end end
  if minx ~= nil then
    local kx = (minx + maxx) // 2
    -- topmost skin at that column = the knuckle ridge -> a 1px soft highlight.
    for y = miny, miny + 4 do
      if is(gget(arm, kx, y), "SKIN") then gset(arm, kx, y, col("SKIN_HI")); break end
    end
    logp("hand knuckle highlight (x=" .. kx .. ")")
  end
end

-- 6. Lantern metal: add a 1px bright glint on the cage so it reads as metal.
local function lantern_glint()
  local lantern = buf("lantern")
  -- topmost-left cage pixel = lit metal corner.
  local gx, gy
  for y = 0, SIZE - 1 do for x = 0, SIZE - 1 do
    if is(gget(lantern, x, y), "LAN_CAGE") then
      if gy == nil or y < gy or (y == gy and x < gx) then gx, gy = x, y end
    end
  end end
  if gx then gset(lantern, gx, gy, col("LAN_CORE")); logp("lantern metal glint (" .. gx .. "," .. gy .. ")") end
end

-- 7. Hood balance: gently symmetrize crown width. Measure the hood FILL extent
--    via the hood layer's opacity (NOT the rim, which is left-only and would
--    fake an asymmetry), referenced to the FACE center. Only erode the side
--    that is genuinely >=3px wider, capped to a few rows, so this can correct a
--    lean without carving the silhouette (deep width work stays human GUI).
local function hood_balance()
  local hood = buf("hood")
  local outline = buf("outline")
  local rim = buf("rim")
  local face = buf("face")
  -- face center x = centroid of face-layer skin (the head's true midline).
  local fxs, fn = 0, 0
  for y = 0, SIZE - 1 do for x = 0, SIZE - 1 do
    if A(gget(face, x, y)) >= 250 then fxs = fxs + x; fn = fn + 1 end
  end end
  local cxf = (fn > 0) and (fxs / fn) or ((SIZE - 1) / 2)
  local balanced, cap = 0, 6
  for y = 7, 20 do
    if balanced >= cap then break end
    local xl, xr
    for x = 0, SIZE - 1 do if A(gget(hood, x, y)) >= 250 then xl = x; break end end
    for x = SIZE - 1, 0, -1 do if A(gget(hood, x, y)) >= 250 then xr = x; break end end
    if xl and xr then
      local dl, dr = cxf - xl, xr - cxf
      if dl - dr >= 3 then
        gset(hood, xl, y, CLEAR)
        if is(gget(rim, xl, y), "HOOD_RIM") then gset(rim, xl, y, CLEAR); gset(rim, xl + 1, y, col("HOOD_RIM")) end
        gset(outline, xl, y, col("OUTLINE")); gset(outline, xl - 1, y, CLEAR)
        balanced = balanced + 1
      elseif dr - dl >= 3 then
        gset(hood, xr, y, CLEAR)
        if is(gget(rim, xr, y), "HOOD_RIM") then gset(rim, xr, y, CLEAR); gset(rim, xr - 1, y, col("HOOD_RIM")) end
        gset(outline, xr, y, col("OUTLINE")); gset(outline, xr + 1, y, CLEAR)
        balanced = balanced + 1
      end
    end
  end
  logp("hood left/right balance nudged (" .. balanced .. " rows, fill-based, cap " .. cap .. ")")
end

eye_sparkle()
mouth_smile()
soften_blush()
fringe_flow()
hand_knuckle()
lantern_glint()
hood_balance()

for _, b in pairs(dirty) do
  local cel = b.layer:cel(frame)
  if cel == nil then sprite:newCel(b.layer, frame, b.img, Point(0, 0))
  else cel.position = Point(0, 0); cel.image = b.img end
end

sprite:saveAs(output)
sprite:saveCopyAs(png)
print("refine-yui-52-v2a-pf: script-assisted refinement (pass 2)")
print("  input:  " .. input)
print("  output: " .. output)
print("  png:    " .. png)
print("  refinements:")
for _, s in ipairs(applied) do print("    - " .. s) end
print("STATUS: input for human review (human-review-candidate).")
print("        NOT a GUI hand-finish. NOT hand-final. Deep charm/hand/metal/hair")
print("        flow remain HUMAN GUI work toward hand-final.")
