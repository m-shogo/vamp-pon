# All Character Variant Delta / State Transformation Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`
Scope: all 36 characters / all 9 production asset kinds
Output boundary: `CANDIDATE_REVIEW_REQUIRED`

## Core rule

A state or variant is a controlled delta from an authorized baseline, not permission to redesign the character. Every changed visual axis must have explicit authority. Everything else inherits baseline.

Unknown state treatment defaults to `BASELINE_PRESERVING_MINIMUM_AUTHORIZED_DELTA`.

## Delta authority order

1. explicit user-decided state change
2. existing state/variant canon
3. source-backed character/world/state Master
4. approved asset-specific transformation rule
5. author candidate
6. generation prompt
7. generated image

Generated images never create new state canon.

## Baseline-locked axes

Unless a stronger state authority explicitly changes them, preserve:
- species and identity
- age read
- face geometry and landmark ratios
- body category and proportion family
- skin tone / fur / shell identity
- disability and mobility equipment
- posture family and habitual center of gravity
- exposure policy
- piercing policy
- tattoo/body-modification policy
- clothing preference and refusal rules
- garment construction and closure logic
- material identity
- storage and pocket logic
- prop ownership, handling and storage relationship
- maintenance / repair / wear history
- relationship evidence limits
- world/era material logic
- ornament budget
- negative-space and silhouette identity

## Allowed delta classes

A variant may alter only explicitly authorized classes:
- lighting / environment response
- palette emphasis within established identity limits
- material state such as wet/dry/dust/soot when scene-supported
- pose / expression within character behavior authority
- effect treatment when source-backed
- temporary damage when source-backed and maintenance continuity is preserved
- explicitly authored costume layer swap
- explicitly authored equipment configuration
- explicitly authored state-specific hair/grooming change
- explicitly authored transformation anatomy

Absence of authority means no change.

## Invariants

- Dawn/Kokuyou names do not automatically imply white/gold versus black/neon redesign.
- Premium does not imply more exposed skin, more jewelry, more gems or more floating cloth.
- Battle does not imply torn clothing or permanent damage.
- Seasonal does not imply costume genre stereotypes.
- State transform may not change body category as power signaling.
- State transform may not de-age or beautify a face.
- State transform may not add piercings, tattoos, scars or markings without authority.
- State transform may not remove disability or mobility equipment.
- Mobility equipment may change configuration only when explicitly authorized and function remains credible.
- Clothing refusal rules remain active in every state.
- Exposure preference remains active in every state.
- Garment closure and attachment logic cannot be rerouted merely for dramatic silhouette.
- Existing repair and wear history survives the state unless a replacement garment/equipment item is explicitly sourced.
- A transformed garment is not automatically a new garment.
- A palette shift may not erase established skin/fur/shell identity.
- An effect may not substitute for an unauthorized anatomy change.
- Hair may not grow, shorten, float or change texture automatically because a state is magical.
- Eyes may not change color, size, pupil form or glow without authority.
- Props may not disappear because the transformed pose is inconvenient.
- New props may not appear as state shorthand without authority.
- Relationship-linked accessories may not appear merely because a state is emotionally important.
- World motifs may not multiply across every surface in transformed states.
- Ornament density stays within the same authorized budget unless a state-specific budget exists.
- Negative space remains identity-preserving; effects cannot fill every gap to signal power.
- LOD rules remain active inside every state.
- Material aging continuity remains active across entering and leaving a state.
- Returning to baseline restores only state-authorized temporary changes, not unrelated generated accidents.
- Cross-asset state depictions must share the same delta definition.
- State-specific changes must be reviewable as an explicit before/after axis list.
- Unknown axis changes are `BLOCK`, not model freedom.
- Generated state deltas remain `CANDIDATE_REVIEW_REQUIRED`.
- If a state cannot look distinct without violating baseline identity, strengthen lighting, pose, effect or source-backed material response before redesigning anatomy or clothing.

## Forbidden shortcuts

Do not use: automatic gold trim, automatic black trim, white/gold Dawn template, black/neon Kokuyou template, rarity gems, extra belts, decorative harnesses, floating cloth, random cape, extra jewelry, new piercing, new tattoo, new scar, glowing body markings, eye-color swap, eye enlargement, pupil mutation, hair-length mutation, floating hair, exposed chest, exposed abdomen, thigh cutout, torn clothing, battle-damage skin exposure, body slimming, muscle inflation, leg lengthening, waist narrowing, de-aging, beauty smoothing, disability removal, wheelchair shrinking, prop deletion, prop multiplication, unexplained weapon upgrade, relationship accessory invention, motif repetition, universal aura, universal rim light, full-palette replacement, state-driven species drift, mascotification, robot humanization, maintenance reset, random clean/new replacement, random permanent grime, state-specific face redesign, state-specific personality stereotype, costume-genre stereotype, or generated-image canon promotion.

## Review gate

Every variant candidate must expose a delta ledger with: `axis`, `baseline`, `authorizedChange`, `authority`, `temporaryOrPersistent`, and `reviewResult`. If an axis changed but has no authority, reject or revert that axis. Human approval is required before any generated delta is promoted.