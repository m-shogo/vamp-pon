# Cross-Asset Fidelity Review Master v1

Status: CURRENT_POST_GENERATION_VISUAL_REVIEW_AUTHORITY
Scope: all 36 characters; all character asset kinds.

## Purpose

A character may simplify across reference art, 180px sprites, cut-ins, transformation states and emblem-adjacent assets, but must not become a different person, body, clothing system or color identity. This Master governs post-generation comparison. It does not create new character canon.

## Review model

Review compares a candidate asset against the highest-authority available reference/design contract for the same character. Do not compare only against the immediately previous generated image if that image is itself unapproved.

### Identity-critical axes — hard minimum gate

Each axis is scored 0–100. Any hard-gate failure blocks promotion regardless of total score.

1. species / age / body state
2. face geometry and age coding
3. body mass, proportion and mobility equipment
4. head / hair mass
5. silhouette and posture identity
6. clothing construction and exposure boundary

Hard gate: every identity-critical axis must be >= 90 for reference/cutin candidates and >= 85 for deliberately simplified sprite assets. A score below the threshold is `BLOCK_IDENTITY_DRIFT`.

### Production-support axes

7. source-backed color role fidelity
8. prop relation / storage / handling
9. material hierarchy and wear logic
10. state-effect containment
11. small-scale readability
12. micro-detail discipline

Support axes may simplify by asset kind. They may not compensate for an identity-critical failure.

## Weighted score

A weighted score is useful for ranking revisions, not for overriding hard gates.

- face geometry: 18
- body mass/proportion/mobility: 16
- species/age/body state: 12
- silhouette/posture: 12
- clothing construction/exposure: 12
- head/hair mass: 8
- color role fidelity: 7
- prop relation: 5
- material hierarchy: 4
- state-effect containment: 3
- small-scale readability: 2
- micro-detail discipline: 1

Total: 100.

Promotion guidance after all hard gates pass:
- 95–100: `FIDELITY_PASS_STRONG`
- 90–94.99: `FIDELITY_PASS`
- 85–89.99: `REWORK_SUPPORTING_AXES`
- below 85: `REWORK_MAJOR`

The weighted score never promotes a candidate with a failed hard gate.

## Asset-kind tolerance

### character_reference
No identity simplification budget. Geometry, body, construction and color roles must remain direct design authority evidence.

### sprite_sheet_180
Micro-detail, secondary seams, tiny fasteners and subtle material variation may be omitted first. The sprite may exaggerate spacing for pixel readability, but may not use a common chibi head/body template, enlarge eyes until face identity changes, slim bodies, remove disability equipment, humanoidize animals/robots, or replace handled props with floating icons.

### normal_cutin
Crop and gesture may intensify. Face/body/clothing design may not be rebuilt for heroism.

### dawn_cutin
Light, crop, motion and state effects may intensify. Dawn state may not whiten skin, recolor body identity, add angelic white/gold costume redesign, change exposure, add jewelry, or alter face/body geometry.

### kokuyou_cutin
Ink, soot, broken-edge and darkness effects may intensify. Kokuyou state may not become a black-neon armor redesign, de-age, slim, sexualize, recolor skin/fur/shell, or create new tattoos/scars/piercings.

### emblem variants
Emblems are symbolic assets. They are reviewed for emblem canon and cross-state symbolic continuity, not for human face/body fidelity. They never create character appearance canon.

## Comparison procedure

For every non-emblem candidate, review in this order:

1. neutral identity: hide effects, labels and background mentally or physically;
2. face: compare proportions, feature placement, eye construction, jaw/cheek mass, age coding;
3. body: compare height impression, width, softness/muscle/fat distribution, limb proportion and equipment;
4. black-fill silhouette: compare head mass, shoulder/torso/hip mass, garment mass and prop location;
5. clothing: compare opening, closure, layer count, hem/sleeve mass, exposure and plausible wearability;
6. color: separate body identity, garment base, theme, accent, Star Beast, prop, emitted light and reflected light;
7. prop: confirm grip/contact/storage/support relationship;
8. state effects: confirm effects sit on top of the design rather than redesigning it;
9. small-scale test: reduce to intended display size and confirm identity survives without invented ornaments.

## Absolute blockers

- different species, age band or body state;
- face normalized toward a common attractive anime base;
- plus-size/soft body made thin or athletic without authority;
- child adultified;
- disability equipment removed, hidden or cosmetically replaced;
- gender ambiguity resolved by generation;
- animal/robot humanoidized for readability;
- exposure, piercing, tattoo, scar or jewelry added without authority;
- clothing construction replaced by generic gacha/fantasy shorthand;
- night/state lighting used to recolor identity;
- Star Beast color promoted into automatic costume color;
- generated-image accident treated as reference authority.

## Review evidence

A fidelity review record must preserve:
- candidate asset path/id;
- authoritative comparison source(s);
- asset kind;
- per-axis scores;
- hard-gate failures;
- weighted score;
- reviewer verdict;
- KEEP / REMOVE / REPLACE / BAN notes;
- whether any recurrence directive was separately approved.

`REJECT` or `REWORK` alone does not automatically create a generation rule. Recurrence promotion remains governed by the Character Design Feedback Recurrence Master.
