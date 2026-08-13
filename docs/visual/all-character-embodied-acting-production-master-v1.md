# All Character Embodied Acting Production Master v1

Status: `CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION`

## Purpose

Lock posture, body-use, prop handling, storage relation, and environment distance into the final character-generation entrypoint for all 36 characters. The goal is to prevent a strong face/clothing design from collapsing at generation time into the same front-facing hero stance, floating signature prop, generic hand-on-hip pose, or scenic background pose.

This Master does **not** create story canon. It translates existing visual authorities into production constraints.

## Authority split

### Current21
`src/game/data/current21SilhouetteMatrix.ts` is the exact source for:
- posture
- silhouette read
- clothing shape
- object anchor
- motion signature
- ensemble position
- generation guard

These values are source-locked and must not be rewritten by the image model.

### Future15
Future15 has no equivalent source-locked posture matrix. Production therefore derives only a conservative embodied profile from the existing Living Visual Profile:
- species
- body comfort
- social presentation
- clothing silhouette / fit
- footwear
- storage
- wear habits
- maintenance
- positive preferences
- absolute never

This derived layer is `AUTHOR_CANDIDATE_DERIVED`, not new canon. Missing exact gestures, handedness, prop grip, stance angle, stride length, wheelchair configuration, collar use, robot articulation, or animal breed-specific gait remain unresolved unless another authority supplies them.

## Hard rules

1. **No generic hero stance as identity base.** Neutral body use must still read as the same person after dramatic posing is removed.
2. **No floating prop.** A prop must have a hand relation, body relation, storage relation, support surface, or explicit non-carried reason.
3. **No prop-as-personality substitution.** Removing the prop must not erase face/body identity.
4. **No universal contrapposto / hand-on-hip / crossed-arms pose.** These are pose defaults, not characterization.
5. **No body normalization through posing.** Plus-size bodies, older bodies, child proportions, disability equipment, non-human bodies, and artificial bodies retain their physical logic.
6. **No forced intimacy.** Background distance, proximity, touch, leaning, and shared-object staging may not invent relationship depth.
7. **No scenery-as-costume.** Star/paper/ink/light motifs belong in material consequence and interaction, not pasted floating decoration.
8. **No action pose hiding unresolved design.** If neutral posture cannot be resolved, output is exploratory-only.
9. **No unsupported handedness or precise grip canon.** The model may render a mechanically plausible grip, but it may not turn that choice into canon.
10. **No unsupported accessibility redesign.** Mobility devices and assistive equipment are body/environment interfaces, not removable props.
11. **Animals remain animals.** Dog/cat posture, gaze, distance, and surface choice follow animal anatomy; no human hand-language or mascot posing.
12. **Artificial persons and robots remain distinct.** Artificial-person body language is person-like without requiring robot shorthand; maintenance robots use task/clearance logic rather than humanoid glamour posing.

## Required embodied channels

Every final generation prompt must resolve or explicitly classify:
- neutral posture authority
- center-of-gravity / body-use cue
- gaze relation
- hand / forelimb task relation
- prop relation
- storage relation
- clothing-motion relation
- footwear / ground-contact relation
- environment distance
- support-surface relation when relevant
- ordinary-pose test
- dramatic-pose recovery test
- relationship proximity guard
- species / mobility guard
- unresolved-detail policy

## Environment interaction

Background is not a wallpaper layer. Character staging must answer:
- What are the feet / paws / wheels / body actually supported by?
- What object or surface is within reach?
- Does the clothing construction allow the shown action?
- Where does the carried object go when not in hand?
- Is the character blocking, yielding, approaching, observing, working, sitting, crouching, or passing through based on an existing source?
- Is any interpersonal distance justified by relationship authority rather than composition convenience?

## Ordinary-pose test

Before accepting a dramatic illustration, mentally remove:
- glow
- wind
- floating particles
- weapon-like staging
- extreme camera angle
- hero stance
- signature prop emphasis

The remaining body should still be compatible with the character's age, species, body shape, clothing, ordinary habits, and source posture.

## Prop handling gate

A carried object must satisfy at least one:
- held with plausible grip/contact
- supported against torso/arm/body
- attached through authored strap/holster/pocket/storage
- resting on a plausible nearby support surface
- explicitly not physically carried

Do not invent belt loops, harnesses, extra pockets, magical levitation, straps, sheathes, collars, or jewelry merely to solve composition.

## Relationship guard

Embodied acting may express an existing relationship, but may not create one. Do not infer romance, parent/child coding, hierarchy, touch permission, shared accessory ownership, protectiveness, or familiarity from a visually pleasing pose.

## Generation status

All generated images remain `CANDIDATE_REVIEW_REQUIRED`. A generated pose, grip, handedness, distance, or prop placement never becomes canon merely because it appeared in a successful image.
