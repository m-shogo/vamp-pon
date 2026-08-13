# All Character Crop / Silhouette Readability Master v1

Status: CURRENT_PRODUCTION_VISUAL_AUTHORITY
Scope: all 36 characters and all 9 production character asset kinds.

## Purpose

Preserve recognizability when framing, cropping, foreground occlusion, effects and small-display requirements reduce how much of a character is visible. A composition may be dramatic, but it may not hide the identity evidence required to recognize the same person, species, body, clothing construction, prop relationship or mobility equipment.

## Core rule

**Adapt composition before sacrificing identity-bearing silhouette information.**

A crop is not neutral. Cutting the frame at the wrong place can erase body proportion, posture, garment construction, a defining prop, a wheelchair, an animal body, or the relation between hand and tool. Production framing therefore has the same authority discipline as face, body, clothing and motion.

Generated crop decisions remain `CANDIDATE_REVIEW_REQUIRED` and never create canon.

## Readability invariants

1. **head-body continuity** — crop may not imply a different head-to-body ratio.
2. **shoulder-width continuity** — close framing may not visually narrow or broaden the established torso.
3. **posture continuity** — camera crop must retain enough body evidence to read the authorized stance when stance is identity-bearing.
4. **body-mass continuity** — foreground and crop may not erase broadness, softness, age, disability or non-human body category.
5. **silhouette-anchor continuity** — at least the relevant identity anchors for the asset must remain readable.
6. **garment-construction continuity** — crop may hide detail but must not imply a different neckline, closure, hem route or layering system.
7. **prop-relation continuity** — a defining prop may leave frame only if its hand/storage relation is not falsely implied.
8. **mobility-equipment continuity** — crop may not make required mobility equipment appear absent.
9. **species continuity** — dog/cat/robot body category may not be cropped into a generic human bust or mascot head unless the asset contract explicitly requires such a crop.
10. **hand-contact continuity** — cutting at wrist/prop contact may not create an impossible floating object or detached hand.
11. **leg-foot-ground continuity** — full/three-quarter framing must keep believable support and ground contact.
12. **hair-volume continuity** — crop/effects may not use missing hair volume to produce a different skull/face silhouette.
13. **outerwear-volume continuity** — coats, skirts and layers may not be cropped so aggressively that established body/garment volume is rewritten.
14. **foreground-occluder honesty** — foreground objects may hide information temporarily but may not conceal known structural contradictions.
15. **effect-opacity budget** — light, ink, fog, particles and motion effects may not obscure identity anchors merely to increase spectacle.
16. **small-scale survival** — sprite/chibi/small UI forms must retain prioritized anchors without inventing new accessories.
17. **cross-asset framing continuity** — framing differences may change emphasis but not imply a different person/body/species.
18. **crop-boundary honesty** — limbs, props, clothing and equipment cut by frame must have a physically plausible continuation.
19. **face-not-sufficient rule** — a recognizable face alone does not excuse loss of body, silhouette or equipment identity when those are relevant.
20. **premium-asset restraint** — premium/cut-in assets may not zoom tighter or add effects until identity-bearing construction is lost.

## Identity-bearing crop priorities

When framing must simplify, preserve in this order unless a stronger source says otherwise:
1. face/head identity
2. body category and posture
3. major silhouette/outerwear shape
4. mobility/species geometry
5. defining prop relation
6. garment construction anchors
7. secondary accessories
8. micro-detail

This is a preservation order, not a license to invent missing lower-priority details.

## Safe framing strategies

Prefer:
- move camera back slightly
- shift framing instead of deleting clothing/equipment
- reduce foreground obstruction
- reduce effect opacity
- reposition already-authorized prop within its allowed relation
- simplify hidden micro-detail
- use a less extreme lens or pose
- preserve a clear negative-space break around major silhouette anchors

## Forbidden shortcuts

- crop hides wheelchair or mobility equipment
- crop turns a broad/soft body into a generic slim bust
- child/adult distinction erased by face-only crop
- dog/cat reduced to floating mascot head to avoid body anatomy
- robot body cropped away so scale/species becomes ambiguous
- prop cut exactly at hand so grip error is hidden
- feet cut to hide impossible ground contact
- hem cut to hide cloth-leg intersection
- foreground object hides missing limb
- hair/effects cover incorrect face geometry
- cloak/coat fills frame to hide body inconsistency
- cut-in zoom changes head-to-body ratio
- low-angle crop makes shoulders/body mass heroic beyond authority
- high-angle crop infantilizes an adult
- premium asset uses extreme close-up because full construction is unresolved
- glow/ink/fog obscures garment closures
- effect opacity hides mobility controls
- crop implies nonexistent pocket/storage
- crop removes one of two required props and implies only one exists
- frame edge severs strap without readable continuation
- frame edge severs tail/wheel/limb and changes species/body read
- silhouette merged with background because palette contrast was ignored
- outline glow invented solely to recover poor silhouette
- accessory enlarged solely for readability
- new ribbon/cape/weapon added as crop-readable identity marker
- chest/thigh exposure increased to create a crop focal point
- face-only crop used as universal solution for all characters
- all Core5 given same bust-crop template
- Dawn/Kokuyou crop used to age-shift or beautify
- sprite/chibi crop invents simplified jewelry or emblem
- hidden clipping treated as acceptable because it is outside frame

## Unknown crop rule

If the exact framing requirement is unknown, use a neutral composition that preserves face, body category, main silhouette and any required mobility/species geometry. Do not assume a cinematic close-up. Unknown crop requirements are not image-model freedom.

## Review rule

If a requested crop cannot preserve the relevant identity anchors without implying unsupported body, garment, prop or equipment structure, mark the candidate for human review rather than redesigning the character.

## Production rule

Production candidate generation must load this Master. Generated framing, crop and effect visibility choices remain `CANDIDATE_REVIEW_REQUIRED` and do not establish canonical body proportion, silhouette, equipment presence, prop count or wearing state.
