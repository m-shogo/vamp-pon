# Enemy 48 Production Readiness

## Decision

The enemy roster is now ready for **reference image production**.

It is not automatically ready for direct production export or full runtime registration. Those are separate gates.

## Completed

- 48 exact cells and order
- 25 grunts / 10 midbosses / 3 bosses / 10 boss forms
- Omb / Ombro naming and IDs
- selected Omb / Ombro silhouette and aura-hands direction
- five Stage palettes
- silhouette for every enemy
- body ratio for every enemy
- eye/light placement for every enemy
- signature parts for every enemy
- movement role for every enemy
- attack for every enemy
- attack telegraph for every enemy
- counterplay for every enemy
- required animation set for every enemy
- 180px reference occupancy range
- native target size
- boss form identity rules
- boss timer semantics
- machine validation contract
- runtime migration sequence

## Remaining after reference generation

- generate and inspect the 1440x1080 reference sheet
- reject silhouette collisions
- correct weak or unreadable cells
- create Aseprite native sources
- hand-finish pixel clusters
- export gameplay PNGs
- review 1x / 4x / dark background / combat mock
- implement movement and attack profiles
- balance stats and spawn timing
- integrate boss timer pause with tests

## Production priority

1. Omb / Ombro Stage 1
2. Stage 1 unique grunts
3. Stage 1 midbosses
4. Stage 2 unique grunts and midbosses
5. Nanashino base and forms
6. Stage 3
7. Stage 4 and Michishirube
8. Stage 5 and Asamade

This order produces a playable vertical slice before committing to all boss animation work.
