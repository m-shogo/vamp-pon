# All Character Hand / Contact Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_FIDELITY_AUTHORITY`
Scope: all 36 characters, all 9 character asset kinds.

## Purpose

Keep hands, paws, manipulators, mobility interfaces, tools, props, pockets, straps, handles and surfaces physically believable and character-consistent.

The image model may render anatomy. It may not invent handedness, grip habits, extra straps, floating props, impossible pockets, or contact relationships that contradict Living Visual / Garment / Embodied Acting / World Material authorities.

## Core rule

**If an object is being used, the image must explain how force travels from body to object.**

A prop cannot merely hover near a hand. A hand cannot penetrate a handle. A bag cannot hang from an unmodeled strap. A wheelchair contact cannot be replaced by a generic standing pose.

## Contact invariants

1. anatomically plausible digit count / paw / manipulator form
2. hand/paw/manipulator scale remains identity-compatible
3. contact point exists for held objects
4. grip matches object geometry
5. object weight is supported somewhere
6. wrist/forearm alignment is plausible for the load
7. storage access matches garment construction
8. straps/cords/handles must already be authorized
9. two-handed actions assign a real job to each hand
10. mobility equipment contact remains physically coherent
11. gloves/sleeves do not erase required grasp mechanics
12. named props keep their source-backed scale and orientation family

## Handedness

Unknown dominant hand is `OPEN_DO_NOT_INVENT`.

- Do not infer handedness from personality, gender, profession, combat role, UI layout, or one generated image.
- When a composition does not require dominance, use a neutral handling arrangement.
- When dominance materially changes design, mark the pose exploratory-only until an authority resolves it.

## Grip families

Use only grips physically appropriate to the authorized object:

- pinch: thin paper, tab, small key when scale permits
- precision grip: small tool / fastener
- power grip: handle / tool / lantern handle where appropriate
- cradle/support: box, book, fragile object
- two-point stabilize: compass/map/tool combinations when physically needed
- push/pull contact: door, wheelchair rim, cart, drawer, similar surface

These are physical families, not character canon. Do not turn one generated grip into a signature habit.

## Storage interaction

A stored prop must have a believable route:

`storage location -> opening/closure -> hand access -> extraction angle -> usable position -> return path`

Do not:
- place a large object in a smaller pocket
- draw a pocket only when the prop is needed
- teleport a prop between hand and belt
- invent a thigh strap/holster because the object needs somewhere to go
- hide impossible storage behind a cape or crop

## Tool-use realism

For tools:
- the working end points toward the task
- the grip does not block the working end
- force direction matches wrist/arm posture
- hot/sharp/dirty surfaces are not casually grasped unless source-authorized protection exists
- maintenance wear should occur at actual contact/load points

## Paper / map / book interaction

Paper bends where fingers support or pinch it. Books have thickness and hinge behavior. Maps do not float flat in one hand without support unless the material authority explicitly permits it.

## Lantern / light-source interaction

A lantern/light object has mass and a handle/contact point. Light emission does not eliminate object handling. Do not replace the prop with a floating orb for readability.

## Mobility equipment

Mobility aids are part of body interaction design.

- hands/contact surfaces must respect actual equipment geometry
- do not remove equipment to simplify a pose
- do not stage impossible limb positions through wheels/frames
- clothing and bags must not clip through structural elements

## Non-human characters

Dogs/cats use paws/body/mouth only when source-consistent; do not give human hands to solve a prop problem. Robots/artificial forms keep their authorized manipulator logic; do not silently humanize joints/digits.

## Contact failure bans

- floating prop near open palm
- fused fingers around handle
- hand through object
- object through sleeve/body
- missing load support
- impossible wrist bend for weight
- random finger pointing to add expressiveness
- beauty-hand pose replacing practical grip
- invented rings/nails/gloves to hide anatomy
- invented strap/holster/pocket
- duplicate prop in storage and hand
- scale-changing prop between frames
- impossible wheelchair contact
- human hands added to non-human character
- unexplained object levitation

## Asset-kind behavior

### character_reference
Show at least one calm, legible contact relationship for the primary named prop when that prop is part of the authority.

### sprite_sheet_180
Simplify fingers before changing contact logic. A mitten-like pixel cluster may represent a grip, but the object must still connect at the correct place and scale.

### normal/dawn/kokuyou cut-ins
Crop may hide some contact evidence, but visible contact cannot contradict the reference. Effects may not replace a physical grip with levitation.

### emblems
Hand/contact fidelity is not applicable unless the emblem itself depicts a literal hand/object relationship, in which case emblem canon controls symbolism rather than character anatomy.

## Unknown policy

Unknown dominant hand, finger habit, signature grip, tool flourish, nail condition, callus pattern, exact dexterity style, and contact choreography are not image-model freedom.

## Generation boundary

Generated hand pose, grip, handedness, callus, nail state, glove choice, or prop-contact habit never creates canon by itself.
