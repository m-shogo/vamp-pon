# All Character Face / Skull Landmark Construction Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`
Date: 2026-08-13
Scope: all 36 characters, all 9 production asset kinds

## Purpose

Prevent the production model from returning every human character to one attractive anime-face base and then differentiating only hair, color, expression, or accessories.

Face identity must be carried by stable skull and landmark relationships, not by surface styling.

## Core rule

**The face is one three-dimensional craniofacial construction. Viewpoint, expression, lighting, premium rendering, state, crop, or LOD may reveal or simplify that construction, but may not redesign its landmark ratios.**

Unknown facial geometry uses:

`SOURCE_CONSTRAINED_IDENTITY_NEUTRAL_FACE_COMPLETION`

Unknown is not permission to substitute a generic pretty face.

## Required construction axes

Production must distinguish, when supported by authority:

1. cranial height family
2. cranial width family
3. face height / width relationship
4. forehead height
5. forehead width
6. temple width / recession
7. brow-ridge prominence family
8. brow baseline height
9. eyebrow thickness family
10. eyebrow angle / curvature family
11. inter-brow spacing
12. orbital height family
13. orbital width family
14. inter-eye spacing
15. eye opening height
16. eye horizontal length
17. eye axis / canthal tilt
18. upper-lid shape
19. lower-lid shape
20. eye depth / prominence family
21. nose root height
22. nose bridge length
23. nose bridge width
24. nasal projection family
25. nose tip volume
26. alar / nostril width family
27. cheekbone width
28. cheekbone height
29. cheek soft-tissue volume
30. midface length
31. philtrum length
32. mouth width
33. upper/lower lip volume family
34. mouth resting angle
35. jaw width
36. mandibular angle family
37. chin width
38. chin projection
39. chin vertical length
40. ear vertical position
41. ear size family
42. ear projection family
43. facial asymmetry landmarks when authorized
44. age-bearing structural cues
45. facial soft-tissue distribution
46. neck-to-jaw transition

## Landmark invariants

1. Hair removal must still leave a distinguishable character face.
2. Eye enlargement may not be used as the default readability solution.
3. Jaw narrowing may not be used as an attractiveness correction.
4. Chin sharpening may not be used as an attractiveness correction.
5. Nose shrinking may not be used as an anime-style normalization shortcut.
6. Nose bridge may not disappear in profile or 3/4 if it is structurally identity-bearing.
7. Cheek volume may not be erased to create a generic slim face.
8. Cheek volume may not be inflated to make a character generically cute.
9. Forehead proportion may not be changed by hair styling or crop.
10. Temple width may not be hidden by hair and then reinterpreted as a different skull.
11. Inter-eye spacing remains part of identity across asset kinds.
12. Eye axis / tilt remains part of identity across expressions.
13. Expression may deform lids and brows but may not replace the underlying eye geometry.
14. Eyebrow thickness and baseline may not be beautified into one house style.
15. Nose root, bridge, tip, and alar relationships must agree between front, 3/4, and profile.
16. Mouth width must remain relative to nose, pupils, and jaw rather than drifting by expression style.
17. Lip volume may not be altered to feminize, masculinize, sexualize, de-age, or beautify without authority.
18. Jaw width and mandibular angle must agree between front and profile.
19. Chin projection must agree between front, 3/4, and profile.
20. Ear position must track the same skull rather than float for composition.
21. Canonical facial asymmetry may not be symmetrized automatically.
22. Unspecified facial asymmetry may not be invented as personality shorthand.
23. Premium assets may not smooth distinctive facial geometry.
24. Premium assets may not automatically increase eye sparkle or reduce nose/jaw information as a beauty upgrade.
25. Rarity or protagonist importance may not move the face toward one premium-gacha template.
26. Child faces must remain age-appropriate and may not be adult-beautified.
27. Older faces must retain age-bearing structural cues and may not be de-aged through jaw, cheek, eye, brow, or surface smoothing.
28. Body category and facial soft-tissue relationship may not be normalized independently when source-backed.
29. Skin tone, ethnicity, nationality, gender, sexuality, disability, or role may not be inferred from a generic facial-feature stereotype.
30. Skin tone may not be changed to make facial landmarks easier to render.
31. Expression intensity may not alter skull proportions.
32. Perspective may foreshorten but may not redesign eye spacing, nose length, jaw width, or chin projection.
33. Camera lens drama may not create a new face.
34. Lighting may describe form but may not erase identity-bearing planes.
35. Shadow may not hide a facial mismatch as a solution.
36. Glow, bloom, hair, hands, effects, or props may not obscure face errors as a solution.
37. Makeup may not change underlying facial construction.
38. Unspecified makeup contouring may not be used to reshape nose, jaw, cheek, or eyes.
39. LOD simplification removes micro-lines before landmark ratios.
40. Chibi may simplify landmarks but may not converge every character onto one giant-eye / tiny-nose / pointed-chin base.
41. Sprite reduction may merge small facial marks but must preserve identity-bearing placement and ratio cues.
42. Portrait close-up may not add beautifying facial geometry absent from full-body reference.
43. Full-body art may not simplify the face into another character.
44. State variants inherit baseline face geometry unless an explicit physical transformation authority exists.
45. Injury, fatigue, illness, weather, or emotion may affect temporary surface/soft-tissue presentation only when authorized; they do not silently rewrite skull geometry.
46. Generated facial accidents do not create canon.
47. Generated landmark solutions remain `CANDIDATE_REVIEW_REQUIRED`.

## Preservation priority

When reducing information, preserve in this order:

1. face height / width family
2. forehead / temple proportion
3. inter-eye spacing and eye axis
4. eye opening family
5. brow baseline / thickness family
6. nose root / bridge / projection family
7. cheekbone width / height
8. cheek soft-tissue volume
9. mouth width / rest relationship
10. jaw width / angle
11. chin width / projection / length
12. ear placement family
13. authorized asymmetry
14. age-bearing structural cues
15. micro-lines / eyelashes / tiny surface marks

Micro-detail is expendable before structural identity.

## Ensemble anti-collision rule

For ensemble production, each human character must remain distinguishable when these are removed:

- hair color
- eye color
- costume color
- accessories
- expression exaggeration
- lighting/effects

If two characters collapse to the same craniofacial construction once these are removed, the design is not sufficiently resolved for canon-sensitive generation.

This does not require random ugliness or exaggerated deformity. Difference should come from coherent proportion families and lived identity, not novelty noise.

## Forbidden shortcuts

Never automatically use:

- same pretty face base
- giant eyes for readability
- tiny nose for anime appeal
- pointed chin for beauty
- narrow jaw for beauty
- V-line normalization
- tiny mouth normalization
- identical eyebrow shape across cast
- identical eye tilt across cast
- identical inter-eye spacing across cast
- identical nose bridge across cast
- identical cheek volume across cast
- identical ear placement across cast
- symmetrical-face cleanup
- premium symmetry correction
- skin smoothing as structural correction
- beauty filter face proportions
- de-aging by eye enlargement
- de-aging by cheek smoothing
- de-aging by jaw narrowing
- aging by arbitrary wrinkles without structural support
- masculinity by wider jaw stereotype
- femininity by smaller nose stereotype
- sexuality-coded face shorthand
- ethnicity-coded feature guessing
- disability-coded facial shorthand
- villain-coded hooked nose invention
- innocence-coded round-eye invention
- mystery-coded narrow-eye invention
- protagonist-coded idealized proportions
- premium sparkle replacing eye geometry
- profile nose deletion
- 3/4 jaw shrinkage
- profile chin shrinkage
- hiding mismatch with bangs
- hiding mismatch with shadow
- hiding mismatch with glow
- hiding mismatch with crop
- hiding mismatch with hand/prop overlap
- chibi same-face convergence
- sprite same-face convergence
- expression-based skull redesign
- state-based face beautification
- rarity-based face beautification
- OPEN means generic face freedom

## Production gate

Final candidate-generation output must prove:

- this authority and machine policy are loaded
- unknown face geometry is not model freedom
- viewpoint cannot redesign face geometry
- premium rendering cannot beautify structural ratios
- expression cannot rewrite skull geometry
- LOD/chibi/sprite cannot converge to one generic face base
- state variants inherit baseline face construction
- generated face treatment does not create canon
- output remains `CANDIDATE_REVIEW_REQUIRED`

## Review questions

1. Would this still be the same person with hair and color removed?
2. Do front, 3/4, and profile describe one skull?
3. Did the model enlarge eyes, shrink nose, narrow jaw, or sharpen chin to improve appeal?
4. Did age, body category, or distinctive soft-tissue volume get normalized?
5. Does the face remain distinct from nearby ensemble characters without accessories?
6. Did lighting, hair, crop, or effects hide an unresolved facial mismatch?
7. Is every new facial fact source-backed or clearly candidate-only?

If any answer fails, reject or return to human review. Do not repair identity by adding accessories or hairstyle changes.
