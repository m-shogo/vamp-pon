# All Character Occlusion / Layering Fidelity Master v1

Status: CURRENT_PRODUCTION_VISUAL_AUTHORITY
Scope: all 36 characters and all production character asset kinds where body, hair/fur/shell, clothing, props or mobility equipment overlap.

## Purpose

Keep front/back relationships physically coherent when the image model renders layered character design. Hair, collars, hoods, straps, sleeves, pockets, props, hands, legs, furniture and mobility equipment must occupy compatible depth and attachment relationships instead of clipping, teleporting or silently redesigning the costume.

## Authority boundary

This Master is subordinate to source-backed body, hair/head, garment construction, exposure, hand/contact, mobility, prop and spatial authorities. It may solve visible overlap conservatively; it may not invent a new slit, strap, cutout, fastening route, hairstyle, tucked state or body exposure to avoid difficult geometry.

Unknown overlap details use the least redesigning physically plausible route. `OPEN` does not allow the image model to add a hidden fastener, hole, strap or exposed skin patch.

## Occlusion invariants

1. **attachment continuity** — straps, sleeves, collars, hoods, pockets and equipment must connect to authorized anchor points.
2. **front/back continuity** — an element may pass behind another only if its path remains physically possible before and after the occlusion.
3. **hair / collar relation** — hair cannot teleport between inside/outside collar or hood across views without an authorized wearing-state change.
4. **hair / strap relation** — shoulder/chest straps cannot pass through hair mass; hair displacement must respect existing hair volume.
5. **garment layer order** — inner/outer layers retain coherent order at neckline, cuffs, hem, openings and closures.
6. **closure continuity** — buttons, ties, hooks, zips or folds cannot disappear behind the body and reappear on a different construction line.
7. **pocket continuity** — hand/prop insertion must align with the actual pocket opening and volume.
8. **hand / sleeve continuity** — sleeve openings, gloves and hands maintain plausible depth; cuffs cannot fuse into fingers or vanish to hide hand errors.
9. **prop / body clearance** — held or stored objects cannot intersect torso, limbs or face to solve composition.
10. **prop / garment clearance** — tools, keys, lamps, boxes and bags cannot pass through cloth without a real opening or external attachment.
11. **leg / hem continuity** — skirts, coats, trousers and long hems must wrap around legs with plausible near/far ordering during stance and motion.
12. **seat / body / garment continuity** — seated poses must account for compressed cloth, body mass, prop placement and seat surfaces without clipping.
13. **mobility-equipment continuity** — body, garments, bags and props cannot intersect wheels, frames, supports or controls; equipment stays functionally accessible.
14. **species continuity** — dog/cat fur, tails/paws and robot shells/manipulators use their actual geometry rather than human clothing shortcuts.
15. **exposure continuity** — occlusion problems may not be solved by deleting cloth or opening closures beyond the Living Visual exposure boundary.
16. **silhouette continuity** — simplifying overlaps may not create a new cape, missing limb, detached prop or altered body silhouette.
17. **cross-view continuity** — reference, sprite and cut-in should imply compatible attachment/layer routes even when not all details are visible.
18. **crop honesty** — crop may hide an unresolved overlap but may not imply an impossible continuation immediately outside frame.

## Allowed conservative resolutions

When exact overlap is not specified, prefer:
- shift a loose secondary element slightly while keeping its anchor
- place hair consistently in front of or behind a garment edge based on local geometry
- simplify a hidden micro-detail rather than invent a new construction feature
- reduce cloth flare while preserving garment pattern
- reposition a prop within the already-authorized hand/storage relation
- use ordinary compression/folding where body meets seat, belt, sleeve or pocket

These are rendering solutions, not canonized wearing habits.

## Forbidden shortcuts

- strap passes through hair or body
- hair passes through collar/hood without displacement
- collar disappears behind neck and returns with different shape
- hood exists front view but has no rear volume
- bag strap starts/ends nowhere
- belt or harness clips through torso
- sleeve fuses into hand
- cuff hides missing fingers by becoming a mitten without authority
- pocket has no opening but hand/prop enters it
- prop stored inside body silhouette with no container
- weapon/tool floats beside hand to avoid grip/clearance
- long hair clips through backpack/bag/shoulder prop
- coat/skirt passes through legs
- thigh/waist cutout invented to avoid cloth-leg overlap
- neckline opened to avoid hair/cloth intersection
- cleavage/midriff exposed because upper layers are difficult to resolve
- coat panel deleted between frames to expose leg silhouette
- scarf/ribbon/strap invented to mask a seam error
- extra cape panel invented to cover missing rear construction
- duplicate prop used when one instance is occluded
- hidden hand or foot omitted even when body continuity requires it
- limb detached by foreground cloth with no readable continuation
- wheelchair frame intersects body or clothes
- bag/pouch intersects wheel or mobility control
- mobility equipment moved behind body contrary to actual contact geometry
- animal tail/paw clipped through furniture as mascot shorthand
- robot manipulator/body panels interpenetrate like soft cloth
- seated body floats above chair to avoid compression
- furniture penetrates body/garment
- front/back layering flips randomly between assets
- state transformation re-routes garment construction
- high resolution invents extra straps/closures to explain overlap
- dark lighting/ink/fog hides unresolved clipping and is treated as solved

## Review hierarchy

When an overlap conflict appears, repair in this order:
1. camera/crop or secondary pose adjustment
2. prop placement within existing relation
3. physically plausible cloth/hair deformation
4. omission of nonessential hidden micro-detail
5. candidate-only escalation if the actual construction is unresolved

Do **not** repair by changing body identity, garment pattern, exposure, hairstyle, mobility equipment or canon prop count.

## Unknown-layer rule

If exact layer order cannot be inferred safely, keep the contested area visually simple and mark the construction as unresolved for human review. Do not use decorative straps, skin gaps, shadows, smoke or glow to fake a solution.

## Production rule

Production candidate generation must load this Master. A generated tuck, strap path, rear garment construction, pocket route or overlap solution remains candidate rendering evidence only and never creates canon by itself.
