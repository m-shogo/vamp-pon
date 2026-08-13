# All Character Feature Scale / Proportion / LOD Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`
Scope: all 36 characters / all 9 production asset kinds
Output boundary: `CANDIDATE_REVIEW_REQUIRED`

## Core rule

LOD is information reduction, not character redesign. When resolution, framing, asset size, or stylization changes, remove lower-priority detail before changing identity-defining proportions.

Unknown LOD treatment defaults to `PROPORTION_PRESERVING_MINIMUM_SUFFICIENT_LOD`.

## Preservation order

1. species / human-nonhuman category
2. age read and face proportion family
3. body category and center-of-mass read
4. head-to-body proportion and limb-length family
5. shoulder / torso / hip width relations
6. face landmark ratios: eye spacing, eye size family, brow-eye distance, nose-mouth-chin relation
7. posture and stance identity
8. mobility equipment relative scale and contact geometry
9. garment silhouette and major construction
10. main prop scale and hand-use relationship
11. hair mass and major shape
12. secondary seams, trims and microdetail

## Invariants

- Small assets may simplify detail, never enlarge eyes merely for readability.
- Nose detail may simplify, but nose placement and face-plane proportion may not vanish into a generic button-face template.
- Mouth detail may simplify, but mouth-to-chin and mouth-to-nose proportions remain character-specific.
- Jaw and chin may not be narrowed, shortened or beautified by LOD.
- Head size may not increase automatically for chibi/sprite unless an explicitly authorized asset grammar requires it.
- Leg length may not increase to make a silhouette elegant.
- Torso may not be shortened to create generic youthful proportions.
- Shoulder width may not be reduced to feminize or beautify.
- Broad, soft, plus-size, older, child, animal, robot and wheelchair-using bodies must retain their category read.
- Mobility equipment may not be shrunk to fit the frame.
- Wheel / seat / frame scale must remain believable relative to the body.
- Hands may simplify, but hand size may not collapse into tiny decorative hands.
- Feet may simplify, but grounding and foot-to-body scale remain coherent.
- Hair mass may simplify but may not become the primary compensation for lost facial identity.
- Animal head/body ratios may not drift toward mascot proportions unless authorized.
- Robot shell/body ratios may not drift toward human or mascot conventions unless authorized.
- Premium art may add rendering fidelity, not taller proportions, smaller head, thinner jaw, longer legs or narrower waist.
- High resolution may restore approved detail, not invent finer anatomy or beauty-standard corrections.
- Chibi may compress depth and detail, but must preserve distinguishing proportion relationships.
- Sprite readability must come from silhouette, value, edge and pose before anatomy changes.
- Portrait crops may not use face-only beautification that contradicts full-body proportion authority.
- Cross-asset comparison must read as the same person at different LODs, not siblings or alternate redesigns.
- State transforms may not reset age/body/proportion identity.
- Dawn/Kokuyou/premium variants may not modify body proportions as rarity signaling.
- Reduced detail may be asymmetric only where the authorized design is asymmetric.
- LOD simplification must preserve exposure and body-modification policy.
- Generated proportion accidents never create canon.
- If identity cannot survive without proportion edits, the asset is `BLOCK` or `CANDIDATE_REVIEW_REQUIRED`, not silently redesigned.
- Any unresolved exact simplification route stays neutral rather than model-authored.
- Human review compares at least face ratio, body ratio, silhouette, stance, equipment scale and prop relation against the highest-authority reference.

## Forbidden shortcuts

Do not use any of the following as automatic LOD fixes: eye enlargement, eye roundening, nose deletion, chin shrinking, jaw sharpening, jaw softening, head enlargement, head shrinking, leg lengthening, torso shortening, waist narrowing, shoulder narrowing, hip reshaping, hand shrinking, foot shrinking, neck lengthening, neck thinning, child de-aging, adult youthification, older-character smoothing, plus-size slimming, broad-body narrowing, wheelchair shrinking, wheelchair cropping, animal mascotification, robot humanization, generic chibi proportions, generic anime face ratios, premium-fashion proportions, rarity-driven body edits, state-transform proportion resets, extra hair volume to replace face identity, exposure increase for limb separation, garment cutouts for readability, white outline compensation, ornament compensation, prop scale inflation, prop scale shrinkage, floating props to avoid contact, perspective distortion used as permanent proportion authority, or generated output promoted to canon without human review.

## Review rule

The image model has zero authority to decide canon-sensitive proportions. Generated LOD solutions remain `CANDIDATE_REVIEW_REQUIRED`. If a small asset cannot retain identity while preserving proportions, simplify rendering/detail further or escalate to human review; do not redesign the character.