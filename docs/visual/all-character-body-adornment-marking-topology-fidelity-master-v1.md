# All Character Body Adornment / Piercing / Jewelry / Skin-Marking Topology Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`

Scope: all 36 characters, all 9 production asset kinds.

## Purpose

This Master prevents image generation from treating piercing, jewelry, tattoo, scar, birthmark, painted marking or other body-attached visual information as free decorative filler or as disposable styling.

This authority does **not** decide who has a piercing, tattoo, scar, birthmark, cosmetic mark or jewelry item. Existence, absence and meaning remain source-authoritative character decisions.

The governing chain is:

**Source-backed Existence / Absence → Feature Class → Anatomical Anchor → Side / Count / Geometry → Occlusion / Contact → Viewpoint Continuity → LOD Simplification → Candidate Review**

The image model may preserve an authorized feature. It may not create one because a design feels empty, premium, edgy, mature, attractive, villainous, fashionable or culturally coded.

## Core rule

**Body-attached features are topology, not decoration.**

If source authority establishes a feature, the same feature must remain attached to the same anatomical region, with the same left/right logic, count family, major geometry and coverage boundary across viewpoints and asset kinds.

If source authority does not establish a feature, image generation may not invent it.

## Unknown-feature rule

Unknown treatment defaults to:

`SOURCE_CONSTRAINED_NO_INVENTION_BODY_ADORNMENT_COMPLETION`

This means:

1. preserve every source-backed feature and every source-backed absence constraint;
2. do not treat an unspecified axis as permission to add a feature;
3. complete only mechanically necessary hidden continuation for an already-authorized feature;
4. do not infer piercing, tattoo, scar, birthmark, cosmetic marking, jewelry, body paint or cultural adornment from age, gender presentation, sexuality, skin tone, ethnicity, role, rarity, personality or faction;
5. generated placement or hidden continuation remains `CANDIDATE_REVIEW_REQUIRED` and never creates Canon.

## Feature classes

Keep these classes distinct:

- removable jewelry/accessory attached to the body;
- piercing jewelry passing through authorized anatomical tissue;
- tattoo/ink marking;
- scar;
- birthmark/nevus-like source-backed marking;
- cosmetic/body-paint marking;
- medical/assistive body-attached item only when separately source-backed;
- nonhuman surface marking when governed by species/shell/fur authority.

Do not convert one class into another. A seam is not a scar. A clothing stain is not a birthmark. A tattoo is not body paint. A decorative earring is not proof of additional piercings.

## Topology axes

Production review tracks:

- feature existence authority
- feature absence authority
- feature class
- anatomical region
- anatomical subregion
- left/right/bilateral status
- count family
- ordering when multiple
- spacing between repeated elements
- primary anchor point
- secondary anchor point
- tissue-through vs surface-attached status
- attachment direction
- front/back surface relation
- radial orientation around ear/limb where applicable
- vertical position
- horizontal position
- distance from anatomical landmark
- major size family
- major shape family
- thickness family
- projection from body
- contact pressure where physically relevant
- dangling length where source-backed
- chain/connector length where source-backed
- closure type where visible/source-backed
- material class where source-backed
- color family where source-backed
- reflective/emissive status only when authorized
- symmetry/asymmetry status
- canonical asymmetry direction
- tattoo/mark outline topology
- tattoo/mark interior fill topology
- tattoo/mark coverage boundary
- tattoo/mark wrap around curved anatomy
- scar path topology
- scar width family
- scar depth/raised family only when source-backed
- birthmark outline topology
- body-paint edge topology
- overlap with hair
- overlap with clothing
- overlap with eyewear/headwear
- overlap with mobility/assistive equipment
- overlap with other body adornments
- hidden-side continuation
- partial-occlusion survival
- front-view visibility expectation
- three-quarter visibility expectation
- profile visibility expectation
- rear-view visibility expectation
- seated visibility expectation
- motion visibility expectation
- expression interaction for facial features
- ear deformation interaction
- neck/shoulder movement interaction
- hand/arm flex interaction
- skin stretch interaction only where material/pose requires
- wetness response boundary
- lighting independence
- crop independence
- LOD survival priority
- chibi preservation class
- sprite preservation class
- state-variant inheritance
- authorized temporary removal status
- authorized permanent change status
- maintenance/cleaning implication boundary
- injury-event implication boundary
- relationship-evidence implication boundary
- cultural-meaning implication boundary
- generated-accident rejection status
- topology uncertainty class

## Piercing rule

A piercing requires a source-backed piercing site. Jewelry does not create a new piercing site merely by appearing close to the body.

Preserve:

- anatomical anchor;
- side;
- number of authorized piercing sites;
- major spacing;
- jewelry class where known;
- tissue-through geometry where visible;
- occlusion by hair/clothing without relocation.

Do not:

- add extra ear piercings for premium detail;
- mirror a one-sided piercing;
- migrate an ear piercing between lobe/helix/tragus-like regions;
- add facial piercings for edginess;
- infer body piercings from clothing exposure;
- replace a source-backed simple stud with elaborate dangling jewelry without authority;
- hide a placement mismatch by hair, glow or crop.

## Jewelry rule

Removable jewelry is still part of authorized character design when present in a given baseline/state.

Preserve source-backed:

- inventory/count;
- body location;
- side;
- size hierarchy;
- attachment method;
- contact/clearance with hair, clothing and equipment.

Do not add necklaces, rings, earrings, bracelets, anklets, chains, chokers or gems because the character appears important, feminine, masculine, wealthy, magical or premium.

Unknown jewelry budget remains zero for candidate generation.

## Tattoo / ink rule

Tattoo topology is a body-surface map.

Preserve:

- anatomical region;
- side;
- outline family;
- major motif geometry if source-backed;
- coverage boundary;
- wrap direction across curved surfaces;
- relative scale to landmarks;
- occluded continuation only to the minimum needed for continuity.

Do not:

- enlarge a tattoo when more skin is visible;
- extend a partial tattoo into a sleeve/back piece without authority;
- invent symbolic meaning;
- convert an abstract mark into a readable emblem;
- make the tattoo glow because the world is magical;
- change color by state unless authorized;
- use tattoo placement to sexualize exposed anatomy.

## Scar rule

Scar existence and placement require source authority.

A generated injury, damage event, rough lifestyle, antagonist role, battle scene or dramatic lighting does not authorize a new scar.

Preserve source-backed scar path and anatomical relation. Do not beautify it away, enlarge it for drama, mirror it, move it, or turn it into a glowing magical mark.

Scar treatment remains distinct from wrinkle, seam, shadow, dirt and tattoo.

## Birthmark / skin-marking rule

Source-backed birthmarks and stable skin markings are identity-bearing surface topology.

Do not:

- smooth them away for beauty;
- convert them into freckles or makeup;
- change side or scale;
- invent additional marks because high resolution allows it;
- infer personality or heritage from them.

Unknown skin micro-markings remain uncommitted unless separate surface authority explicitly resolves them.

## Body paint / temporary marking rule

Temporary markings require explicit state or scene authority.

Do not infer ritual paint, festival marks, team markings, cosmetics, war paint or faction paint from costume or world setting.

Temporary state does not make placement arbitrary: authorized geometry still persists consistently through that state.

## Anatomical anchoring rule

A body-attached feature moves with its anatomical anchor.

- earrings follow ear orientation rather than floating in world space;
- bracelets follow wrist/forearm orientation;
- rings follow the authorized finger/hand when source-backed;
- necklaces/chokers respect neck circumference and clothing contact;
- tattoos/scars deform with the body surface rather than sliding across it;
- body markings do not jump around to remain visible to the camera.

Camera composition must adapt before topology is changed.

## Left/right rule

Canonical sidedness is identity-critical.

Do not mirror source-backed asymmetry merely because an image model internally mirrors composition. If a candidate reverses a one-sided piercing, tattoo, scar, ring, bracelet or marking, reject it unless the source authority itself defines viewpoint-relative rather than anatomical sidedness.

## Occlusion rule

Occlusion hides visibility; it does not delete or relocate the feature.

Valid:

- hair temporarily covering an earring;
- collar covering part of a neck mark;
- sleeve covering an arm tattoo;
- pose hiding a ring.

Invalid:

- moving the feature to the visible side;
- enlarging it so it remains visible;
- adding a duplicate on the opposite side;
- deleting it from the design because one view hides it.

## Exposure boundary

More exposed skin is not permission to fill empty skin with tattoos, scars, jewelry or markings.

Less exposed skin is not permission to forget an existing feature permanently.

Exposure and body-adornment authorities are independent.

## State / variant rule

Baseline features inherit into variants unless an explicit authorized delta changes them.

A battle, premium, seasonal, Dawn, Kokuyou or other state does not automatically:

- add piercings;
- remove jewelry;
- add tattoos;
- reveal hidden scars;
- make markings glow;
- create ceremonial paint;
- increase ornament count.

Temporary removal or addition needs explicit authority.

## Material / physics rule

Authorized jewelry has finite mass, thickness and contact.

- dangling jewelry reacts to gravity/motion;
- chains have attachment endpoints;
- chokers/necklaces interact with collars and neck geometry;
- bracelets do not pass through wrists or sleeves;
- earrings do not clip through ears/hair without physical cause.

Physics may move a hanging element; it may not change its anatomical anchor.

## Premium rule

Premium rendering may clarify source-backed adornments. It may not add or upscale them for rarity signaling.

Prohibited premium defaults:

- extra earrings;
- multiple ear stacks;
- gemstones;
- gold chains;
- chokers;
- decorative rings;
- body chains;
- glowing tattoos;
- magical scars;
- elaborate piercings;
- symmetric duplicates of canonical asymmetry.

## LOD / chibi / sprite rule

Small-scale conversion may simplify micro-geometry but must preserve identity-bearing topology.

Priority:

1. preserve existence/absence;
2. preserve anatomical region and side;
3. preserve count family when readable;
4. preserve major size/shape hierarchy;
5. simplify material shine and micro-detail last.

Do not compensate for small scale by enlarging jewelry until it changes silhouette or by turning subtle markings into oversized icons.

## Forbidden shortcuts

Hard failures include:

- inventPiercingBecauseDesignFeelsEmpty
- inventTattooBecauseDesignFeelsEmpty
- inventScarBecauseCharacterLooksBattleWorn
- inventJewelryBecauseCharacterIsPremium
- inferPiercingFromGenderPresentation
- inferPiercingFromSexuality
- inferTattooFromPersonality
- inferTattooFromAntagonistRole
- inferScarFromCombatRole
- inferAdornmentFromSkinToneOrEthnicity
- inferCulturalMarkingWithoutAuthority
- mirrorOneSidedPiercing
- mirrorOneSidedTattoo
- mirrorOneSidedScar
- movePiercingForVisibility
- moveTattooForVisibility
- moveScarForVisibility
- duplicateFeatureOnVisibleSide
- enlargeFeatureForVisibility
- shrinkFeatureForBeauty
- relocateEarPiercingRegion
- addExtraEarStackForPremium
- addFacialPiercingForEdginess
- addBodyPiercingFromExposure
- addNecklaceForImportance
- addChokerForSexualization
- addRingForRomanceEvidence
- addMatchingJewelryForRelationshipEvidence
- addGemstoneForRarity
- addGoldChainForPremium
- extendTattooBeyondSourceBoundary
- completePartialTattooIntoFullSleeve
- inventTattooMeaning
- turnTattooIntoFactionEmblem
- makeTattooGlowWithoutAuthority
- makeScarGlowWithoutAuthority
- enlargeScarForDrama
- eraseScarForBeauty
- eraseBirthmarkForBeauty
- convertBirthmarkToFreckles
- inventFrecklesAsHighResDetail
- inventBeautyMarkAsHighResDetail
- inventBodyPaintFromFestivalScene
- inventWarPaintFromBattleScene
- inventRitualMarkFromWorldSetting
- generatedDamageCreatesScar
- clothingSeamCreatesScar
- shadowCreatesTattoo
- dirtCreatesBirthmark
- hairOcclusionDeletesEarring
- sleeveOcclusionDeletesTattoo
- collarOcclusionDeletesNeckMark
- cropHidesPlacementMismatch
- glowHidesPlacementMismatch
- premiumAddsAdornmentCount
- premiumSymmetrizesAdornment
- premiumEnlargesJewelry
- premiumMakesMarkingEmissive
- stateAddsBodyModificationWithoutDelta
- stateRemovesAdornmentWithoutDelta
- wetnessRevealsInventedTattoo
- exposureRevealsInventedScar
- lodMovesFeatureToReadableArea
- chibiEnlargesAdornmentToIcon
- spriteMirrorsCanonicalAsymmetry
- generatedAdornmentCreatesCanon
- generatedMarkingCreatesCanon

## Production review checklist

Before accepting a candidate, verify:

- every visible piercing/jewelry/tattoo/scar/mark has source authority;
- no unsupported body-attached feature was added to fill negative space or signal rarity;
- side, count, anatomical anchor and major geometry match the source-backed design;
- viewpoint and occlusion hide rather than relocate features;
- tattoos/marks wrap the same body surface rather than sliding toward the camera;
- jewelry respects hair/clothing/equipment contact;
- state variants inherit baseline features unless a real delta exists;
- premium did not increase adornment count, scale, gems, glow or symmetry;
- LOD preserves existence, side and anatomical region before micro-detail;
- unsupported hidden continuation remains `CANDIDATE_REVIEW_REQUIRED`.

## Canon boundary

Generated piercing sites, jewelry inventory, tattoo extension, scar, birthmark, body paint, symbolic meaning, cultural association, relationship evidence or hidden continuation never creates Canon by plausibility or repetition.

Human-reviewed authority is required for promotion.
