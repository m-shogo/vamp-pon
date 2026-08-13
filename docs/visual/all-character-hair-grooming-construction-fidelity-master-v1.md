# All Character Hair / Grooming Construction Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`
Date: 2026-08-13
Scope: all 36 characters, all 9 production asset kinds

## Purpose

Hair is not a generic attractiveness layer and not a free composition device. It is part of character identity, grooming practice, body presentation, routine, era/world use, weather response, and viewpoint topology.

A hairstyle label such as `short`, `bob`, `long`, `ponytail`, `messy`, or `neat` is insufficient for production. Production must preserve the construction that makes the hair belong to that specific person.

The production question is not:

> What hairstyle would look good here?

It is:

> Given this person's authorized hair and grooming behavior, what exact hair topology remains consistent from this view, state, weather condition, action, and asset scale?

## Core rule

**Hair is a continuous topology attached to one scalp, with authored grooming behavior. Camera, state, rarity, weather, motion, crop, or rendering polish do not create permission to redesign it.**

Unknown hair or grooming information uses:

`SOURCE_CONSTRAINED_MINIMUM_GROOMING_COMPLETION`

This means complete only what is mechanically required by already-authorized hair geometry and grooming behavior. Unknown is not model freedom.

## Required construction axes

Production hair authority must be understood through at least these axes:

1. scalp / skull volume relationship
2. hairline shape
3. part location and part direction
4. crown / whorl behavior when visible or mechanically relevant
5. fringe group count
6. fringe width and forehead coverage
7. fringe length relative to brows / eyes / cheeks
8. side-lock count, length, and face overlap
9. ear exposure policy
10. temple coverage
11. rear mass volume
12. rear length landmark
13. nape behavior
14. tied versus untied sections
15. tie count
16. tie location in 3D space
17. tie height
18. tie side / canonical asymmetry
19. braid / twist / loop topology when authorized
20. fastening method
21. fastener inventory and count
22. loose-strand policy
23. flyaway / frizz tolerance
24. curl / wave / straightness family
25. strand-mass thickness family
26. grooming neatness
27. deliberate versus incidental asymmetry
28. maintenance / trimming behavior
29. weather response limits
30. motion response limits
31. sleep / work / travel adaptation only when source-backed
32. headwear interaction
33. eyewear / ear-device interaction
34. collar / hood / shoulder collision behavior
35. prop / mobility-equipment clearance when relevant

## Hair construction invariants

1. Camera viewpoint may reveal hair topology but may not redesign it.
2. A side profile must inherit the same hairline, part, fringe mass, side locks, ear exposure, rear mass, and tie topology as the authorized design.
3. A rear view may not invent a new braid, bow, ribbon, clasp, decorative pin, jewel, cord, hair ornament, or emblem.
4. Canonical left/right asymmetry may not be mirrored for composition convenience.
5. Hair mass may not be reduced to make the face more conventionally attractive.
6. Hair volume may not be inflated to make a silhouette more dramatic unless source authority requires it.
7. Fringe may not become thinner, airier, more transparent, or more face-revealing merely for premium polish.
8. Fringe may not become heavier or eye-covering merely to make a character look mysterious.
9. Ear exposure may not change to show earrings, devices, or facial contour unless authorized.
10. Unspecified earrings or ear accessories may not be introduced by exposing the ear.
11. Hair length may not drift between asset kinds.
12. Hair length may not be shortened for combat readability without explicit authority.
13. Hair length may not be extended for illustration drama without explicit authority.
14. Tied hair must preserve tie count and 3D anchor location across viewpoints.
15. A ponytail or tied bundle may not migrate to the opposite side through camera mirroring.
16. Hair fasteners must remain the same authorized inventory and count.
17. Unknown fasteners default to functional invisibility / minimum necessary fastening rather than decorative invention.
18. Premium, rare, seasonal, battle, Dawn, Kokuyou, awakening, or alternate-state labels do not authorize a new hairstyle.
19. A state change may alter hair only through an explicitly authorized delta.
20. Weather may alter temporary behavior such as clumping, lift, compression, or dampness, but not core topology.
21. Wet hair may not become an excuse for increased sexualization, added skin exposure, or a new face-framing hairstyle.
22. Wind may move hair but may not create new permanent strand groups or change tie topology.
23. Motion may displace authorized masses but may not change their origin or attachment.
24. Sleep, rest, injury, work, bathing, or private-state hair changes require explicit source-backed authority; scene implication alone is insufficient.
25. Hair grooming must remain compatible with the character's living visual profile and maintenance behavior.
26. A character who does not use decorative accessories may not receive decorative hair accessories as visual filler.
27. A character's gender, sexuality, age, ethnicity, disability, role, rarity, or narrative importance may not be inferred from generic hairstyle stereotypes.
28. Child characters must not receive adult glamour grooming or sexualized wet-hair treatment.
29. Older characters may not be de-aged through thicker glossy hair, altered hairline, softened grey distribution, or youth-coded fringe without authority.
30. Skin tone may not be used to infer hair texture, cultural styling, braiding, ornament, or grooming practices without source authority.
31. Disability or mobility equipment may not be hidden by hair or used as a reason to redesign hair for composition.
32. Non-human animals may not receive human coiffure unless explicitly established.
33. Robots / artificial bodies may not receive human hair semantics unless explicitly established.
34. Crop or LOD simplification must remove non-identity strand detail before changing part, fringe mass, tie location, ear exposure, or silhouette.
35. Chibi / sprite simplification may merge strand groups but must preserve the topology landmarks that carry identity.
36. Rendering gloss may not make all hair share one premium-anime material.
37. Highlight shape may not become a substitute for hair construction.
38. Hair color remains governed by color authority; highlight, weather, night, and effects may not replace identity color.
39. Generated hair accidents do not create canon.
40. Generated grooming solutions remain `CANDIDATE_REVIEW_REQUIRED` until human review.

## Topology preservation priority

When information must be reduced or a collision must be solved, preserve in this order:

1. hairline / scalp attachment
2. part location and direction
3. fringe mass and forehead coverage
4. face-overlap / side-lock topology
5. canonical ear exposure
6. rear silhouette mass
7. tied-section anchor and count
8. canonical asymmetry
9. fastener inventory
10. length landmarks
11. grooming neatness family
12. curl / wave / straightness family
13. loose-strand policy
14. micro-strand detail

Micro-strand detail is expendable before identity topology.

## Allowed neutral completion classes

When a hidden or underspecified hair surface must be completed, only these classes are allowed without stronger authority:

- `SCALP_CONTINUITY_REQUIRED_BY_VISIBLE_PART`
- `REAR_MASS_CONTINUATION_REQUIRED_BY_VISIBLE_LENGTH`
- `TIED_BUNDLE_CONTINUATION_REQUIRED_BY_VISIBLE_ANCHOR`
- `NAPE_CONTINUATION_REQUIRED_BY_VISIBLE_REAR_MASS`
- `HEADWEAR_COMPRESSION_REQUIRED_BY_EXISTING_HEADWEAR`
- `COLLAR_COLLISION_RESOLUTION_WITHOUT_TOPOLOGY_CHANGE`
- `WEATHER_DISPLACEMENT_WITHOUT_TOPOLOGY_CHANGE`
- `LOD_GROUP_MERGE_WITH_IDENTITY_LANDMARK_PRESERVATION`

These neutral completions may not add new decorative or identity-bearing facts.

## Forbidden shortcuts

Never use any of the following as automatic production solutions:

- generic anime bangs
- generic beauty side lock
- generic ahoge
- random flyaway for personality
- extra face-framing strand for attractiveness
- thinner bangs to show eyes
- heavier bangs to signal mystery
- exposing an ear to add jewelry
- hiding an ear to make the silhouette cuter
- moving a ponytail to improve composition
- mirroring a side ponytail
- inventing a second tie
- inventing a braid on the rear view
- inventing a ribbon
- inventing a hairpin
- inventing a jewel clasp
- inventing a floral ornament
- inventing a star ornament
- inventing a glowing hair ornament
- using world motifs as hair filler
- using relationship motifs as matching hair accessories
- adding premium hair jewelry
- adding gold trim to hair accessories
- adding emissive strands
- changing hairstyle for rarity
- changing hairstyle for premium art
- changing hairstyle for combat readability
- changing hairstyle for romance implication
- changing hairstyle for sexuality coding
- changing hairstyle for gender coding
- changing hairstyle for ethnicity coding
- changing hair texture based on skin tone
- smoothing age-related hair traits
- thickening hair to de-age
- shrinking forehead to beautify
- lowering hairline to beautify
- raising hairline to look mature
- adding grey to signal age without authority
- removing grey to beautify
- making wet hair sexualized
- making wind reveal more skin automatically
- converting loose hair into a ponytail for action
- converting tied hair into loose hair for drama
- deleting fasteners at small scale
- changing tie position in chibi
- shortening hair in sprite
- enlarging hair mass to make chibi cute
- using highlight streaks as fake strand topology
- hiding clipping with glow or darkness
- hiding mobility equipment behind hair
- inventing rear detail because the back looks empty
- treating OPEN as permission to improvise

## Living grooming integration

The Character Living Visual Master remains authoritative for lived preference and maintenance behavior. Hair production must read those settings before generation.

Examples of relevant lived facts include, when actually authorized:

- whether the person spends time styling hair
- whether they accept clips, pins, bands, ties, or ornaments
- whether they cut their own hair or rely on another person / service
- how often they trim
- whether they tolerate hair touching eyes, cheeks, neck, or ears
- whether they tuck hair behind an ear
- whether they prioritize practicality over styling
- whether grooming changes for work, weather, sleep, travel, or formal contexts

Absence of such facts does not permit the model to invent them.

## Production gate

Before candidate generation, final production output must prove:

- this authority is loaded
- machine policy is loaded
- unknown hair is not model freedom
- viewpoint does not change topology
- state does not change topology without authorized delta
- weather / motion only displace existing topology
- premium / rarity cannot increase hair ornament
- generated grooming does not create canon
- output remains `CANDIDATE_REVIEW_REQUIRED`

## Review questions

A reviewer should be able to answer all of these:

1. Is this the same hair attached to the same scalp from every visible angle?
2. Did the part, fringe, side lock, ear exposure, rear mass, tie, or fastener move without authority?
3. Did rendering polish beautify the hairline, volume, age read, or forehead coverage?
4. Did premium / state / weather / action invent a new grooming decision?
5. Did a hidden surface receive decorative filler?
6. Could the same construction be redrawn from another angle without contradiction?
7. Does the grooming behavior still feel like a choice this person would actually make?

If not, reject or return to human review. Do not repair identity by adding ornament.
