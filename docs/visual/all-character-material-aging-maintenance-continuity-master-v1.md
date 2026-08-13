# All Character Material Aging / Maintenance Continuity Master v1

Status: CURRENT_PRODUCTION_VISUAL_AUTHORITY
Scope: all 36 characters and all production character asset kinds where clothing, props, equipment or mobility hardware are visible.

## Purpose

Keep the same character's belongings temporally coherent across reference art, sprites and cut-ins. Wear, cleaning, repair, replacement and patina must follow material, use and already-authorized maintenance behavior rather than resetting every asset to a pristine costume or adding generic battle damage for drama.

## Authority boundary

This Master is subordinate to Living Visual maintenance/acquisition rules, garment construction, world material, era life, prop, hand/contact, environment and source-backed appearance authorities.

It may preserve known wear/repair logic. It may not infer that a person is tidy, dirty, careless, obsessive, poor, wealthy, sentimental or wasteful from an unresolved maintenance field.

`OPEN` means preserve a neutral maintained state with no invented signature damage, stain, patch or replacement history.

## Continuity invariants

1. **material-specific aging** — cloth, leather, paper, wood, metal, fur, shell, rubber and painted surfaces age differently.
2. **stress-location causality** — wear appears where bending, friction, grip, load, ground contact or closure use explains it.
3. **repair-cause continuity** — every patch, stitch, replaced fastener or reinforced edge must answer what failed or was stressed.
4. **cleaning continuity** — dirt may be removed while abrasion, fading, creasing or repaired structure remains where appropriate.
5. **replacement continuity** — a replaced component must have a plausible replaceable boundary; generated art may not silently replace whole garments or props.
6. **asset-to-asset continuity** — reference, sprite and cut-in variants should not alternate between pristine and heavily aged versions without authority.
7. **prop-use continuity** — handled surfaces, grips, hinges, lids, straps and storage contact may show use where the Hand/Contact and World-Use Masters support it.
8. **footwear / mobility continuity** — soles, wheels, contact hardware and ground-facing surfaces age according to actual use and terrain.
9. **closure continuity** — frequently operated buttons, ties, hooks, zips or fasteners may show localized wear but cannot mutate into decorative hardware.
10. **color continuity** — fading, darkening, oxidation or dirt may locally affect value/chroma but cannot replace source-backed palette identity.
11. **repair-material plausibility** — repair thread, patch material, fastener or replacement part must be physically compatible and era/world plausible.
12. **maintenance-access plausibility** — repaired/replaced areas should be accessible enough for the implied maintenance method.
13. **body-contact continuity** — cuffs, collar, knees, elbows, seat, handles and carried-object contact may age differently where use supports it.
14. **environment-response memory** — wetness or mud is temporary unless it creates plausible lasting stain, deformation or damage; one rainy image does not permanently rewrite the asset.
15. **non-human continuity** — dog/cat fur, robot shell/hardware and other non-human surfaces retain their own maintenance logic rather than receiving human clothing grime conventions.
16. **mobility-equipment dignity** — wear on a wheelchair or mobility device follows real contact/use; it is neither erased for beauty nor exaggerated as disability shorthand.
17. **detail-density restraint** — higher-resolution/premium art may reveal existing wear more clearly but may not invent more damage because more pixels are available.
18. **canon boundary** — a generated scratch, stain, patch or replacement is candidate evidence only unless supported/promoted by authority.

## State model

Allowed descriptive states are relative, not exact chronology:
- `NEUTRAL_MAINTAINED`
- `USED_BUT_SERVICEABLE`
- `SOURCE_BACKED_REPAIRED`
- `TEMPORARILY_SOILED_OR_WET`
- `SOURCE_BACKED_DAMAGED`

The image model may not move an item to a stronger state without authority or explicit candidate-generation instruction that remains non-canon.

## Wear map logic

Prefer causal zones:
- grip/handle contact
- pocket opening
- closure edge
- cuff and hem
- elbow/knee articulation
- shoulder/strap load
- seat/back contact
- sole/wheel/ground contact
- tool impact/work surface
- fold/hinge line

Do not distribute scratches, tears, stains or patches uniformly for texture.

## Forbidden shortcuts

- premium cut-in automatically adds battle damage
- every asset resets repaired clothing to factory-new
- every asset adds different random patches
- random scratches evenly distributed for realism
- generic dirty-face treatment to signal hardship
- soot/grime used to make a character look more serious
- torn clothing used to increase exposure
- damage opening neckline, thigh, waist or chest
- invented bandages used to hide anatomy/generation errors
- invented stitches/scars transferred from clothing to skin
- gold replacement fasteners because a repair should look premium
- random mismatched patchwork used as project-world shorthand
- pristine handle with heavily worn unrelated surface
- heavy wear on surfaces never touched or loaded
- rust on materials/finishes that do not support it
- paper magically pristine despite established exposed wear history
- leather/cloth/metal sharing one identical edge-wear shader
- wheelchair wear exaggerated to imply tragedy or neglect
- disability equipment polished away to make the image elegant
- dog/cat fur dirt patterns treated like distressed fabric
- robot scratches used as a substitute for personality
- aging used to infer poverty, carelessness or personality without source
- cleaning used to erase structural repair evidence automatically
- weather event permanently changing clothing without causal damage
- high resolution authorizing extra scratches, seams, patches or fasteners
- state transformations (Dawn/Kokuyou) resetting or multiplying maintenance history
- generated damage becoming canon because it appeared consistently twice

## World-fit rule

Yoru-no-Shirube's lived quality should come from believable continuity: paper edges repeatedly handled, closures used, repaired seams carrying load again, tools showing contact at grips, storage protecting some surfaces while exposing others, and maintenance choices matching era/world capability.

Do not create atmosphere by adding universal distressing, black ink stains, paper patches, glowing repairs or star-shaped mending.

## Unknown maintenance rule

When maintenance behavior or item age is unresolved, choose `NEUTRAL_MAINTAINED`: functional, not showroom-perfect, with only minimal material-appropriate use evidence. Do not invent a signature patch, stain, cherished old item, replacement habit or cleanliness personality.

## Production rule

Production candidate generation must load this Master. Generated wear/repair states remain candidate rendering evidence. They do not establish age, poverty, personality, event history, damage history, repair history or canon without higher authority/human promotion.
