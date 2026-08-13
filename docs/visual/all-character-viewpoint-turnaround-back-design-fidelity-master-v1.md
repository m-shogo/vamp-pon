# All Character Viewpoint / Turnaround / Back-Design Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`
Scope: all 36 characters / all 9 production asset kinds
Output boundary: `CANDIDATE_REVIEW_REQUIRED`

## Core rule

A viewpoint reveals the same authorized object from another side; it does not create a new design surface. Front, 3/4, profile, rear, high/low angle and seated views must resolve one coherent character, garment and equipment topology.

Unknown hidden-surface treatment defaults to `SOURCE_CONSTRAINED_NEUTRAL_COMPLETION`.

## Viewpoint continuity order

1. identity / species / age / body category
2. face and skull volume across rotation
3. hair mass, parting, length and attachment continuity
4. neck / shoulder / torso / pelvis / limb proportion continuity
5. garment panel topology, seams, closures and layering
6. exposure and body-modification policy
7. strap / harness / bag / pocket routing that already has functional authority
8. prop storage, draw/access route and hand relationship
9. mobility-equipment geometry, contact and clearance
10. asymmetry side assignment
11. material transitions, repair and wear placement
12. silhouette and negative-space continuity
13. approved world/era construction logic
14. optional secondary detail

## Turnaround invariants

- A profile view must preserve the same face volume rather than becoming a generic anime profile.
- Nose, lips, chin, forehead and back-of-skull relations may simplify but may not be replaced by a shared profile template.
- Ear placement may not move to repair a hairstyle or accessory conflict.
- Hair length must connect across front, side and rear views.
- Hair parting, tied sections, braids or gathered mass cannot change side without authority.
- Hidden hair volume may be completed minimally, not decorated.
- Front garment openings must have a physically coherent continuation or termination on side/rear views.
- Seams cannot vanish simply because a view is difficult.
- Rear panels may not gain decorative cutouts, corset lacing, belts or symbols because the surface is empty.
- Strap routes must connect origin to destination; no strap may disappear behind the body and reappear elsewhere without topology.
- Bags and pouches must occupy one coherent body-relative location across views.
- Pockets may not appear on a side/rear view unless authorized by construction or storage logic.
- Prop storage must remain reachable and believable from all views.
- Main props may not migrate to the opposite side merely to improve composition.
- Established left/right asymmetry remains stable across mirrored-looking poses and camera rotations.
- Camera mirroring must not silently swap canonical asymmetry.
- Garment layer order remains the same from every view.
- Exposure policy remains the same from rear and side views; backless or side cutouts cannot be invented.
- Piercings, tattoos, scars and body markings cannot be invented on newly visible skin.
- Body category and age read must survive rear/profile views.
- Shoulder, waist, hip and limb proportions cannot be beautified from the back.
- Wheelchair and other mobility equipment must remain dimensionally coherent around the body.
- Seat, backrest, wheel, footrest and body contact cannot be rearranged for a cleaner silhouette without authority.
- Garment/equipment clearance around mobility hardware must remain physically plausible.
- Animal fur silhouette must remain species-consistent through rotation; rear view is not permission for mascot simplification.
- Robot shell panels and joints must form one coherent shell, not different front/rear designs.
- Repair patches, wear zones and material transitions retain spatial continuity across views.
- A repair patch cannot jump side or duplicate because it becomes visible from another angle.
- World motifs do not appear on hidden surfaces unless already constructionally or source-backed.
- High/low camera angles may reveal hidden construction but may not invent it.
- Foreshortening is temporary projection, never new canonical anatomy.
- Cropping does not excuse unresolved rear/side topology in a reference asset.
- Premium art may render hidden surfaces more clearly but may not enrich them with extra ornament.
- LOD simplification preserves left/right assignment and major topology.
- State variants inherit baseline turnaround topology unless their delta ledger explicitly changes an axis.
- Generated hidden-surface completion remains `CANDIDATE_REVIEW_REQUIRED`.
- If front authority cannot determine a hidden route safely, mark it unresolved or candidate-only rather than letting the model improvise.

## Hidden-surface completion policy

When source material does not explicitly show a hidden side, infer only what is mechanically necessary from stronger authorities. Allowed neutral completion includes continuation of an existing cloth panel, closure backing, strap route, hair volume, bag body, shoe/sole continuation, wheelchair frame segment or tool attachment whose existence is already required.

Neutral completion may not introduce a new identity motif, ornament, pocket, closure family, exposed body region, body modification, relationship token, prop, logo, emblem, luminous element, repair event or state-specific marking.

## Forbidden shortcuts

Do not use: generic anime side profile, generic V-jaw profile, nose deletion, chin beautification, back-of-head flattening, random extra hair, random braid, random ponytail extension, hairstyle-side swap, mirrored asymmetry, left-right prop swap, strap teleportation, disappearing bag strap, invented rear belt, invented corset lacing, invented back cutout, invented side cutout, invented rear pocket, invented rear pouch, invented emblem, invented logo, invented gem, invented glow node, invented tattoo, invented scar, invented piercing, invented back jewelry, decorative spine motif, premium back ornament, rear cape addition, floating cloth to hide topology, rear hair used to hide garment construction, dark shadow used to hide unresolved geometry, fog/effect used to hide equipment, wheelchair simplification, wheelchair side swap, mobility-equipment crop as solution, animal mascot rear, robot humanized rear, repair-patch duplication, repair-patch side jump, material-transition side jump, state-based topology reset, LOD-based topology reset, or generated image promoted as hidden-surface canon.

## Review gate

Reference/turnaround review compares at minimum: front-to-profile face volume, hair route, garment panel topology, closure route, strap route, storage location, left/right asymmetry, prop relation, mobility-equipment geometry, repair/wear placement and silhouette. Any unsupported newly visible design element is removed or kept candidate-only.