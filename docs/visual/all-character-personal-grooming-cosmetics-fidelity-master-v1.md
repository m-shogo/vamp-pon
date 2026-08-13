# All Character Personal Grooming / Cosmetics / Nails / Facial-Hair Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`

Scope: all 36 characters, all 9 production asset kinds.

## Purpose

This Master treats visible personal grooming as authored character-life information rather than automatic beauty styling.

It governs source-backed cosmetics, nail treatment, facial-hair grooming, eyebrow grooming, visible body-hair treatment and related visible grooming states that are not already governed by scalp-hair topology or stable body-marking authority.

The governing chain is:

**Source-backed Grooming Choice → Anatomical Region → Product / Hair / Nail State → Geometry / Coverage → Wear / Removal Boundary → Viewpoint / State / LOD Continuity → Candidate Review**

## Core rule

**Grooming is a character choice only when source authority says it is.**

The image model may preserve a source-backed grooming state. It may not add makeup, nail polish, lashes, facial hair, body hair, shaved patterns or beauty treatment because a character is feminine, masculine, older, younger, premium, glamorous, rough, fashionable, villainous or attractive.

Likewise, it may not erase source-backed grooming to normalize the character toward generic anime beauty.

## Unknown-grooming rule

Unknown grooming defaults to:

`SOURCE_CONSTRAINED_NO_INVENTION_PERSONAL_GROOMING_COMPLETION`

This means:

1. preserve source-backed presence and source-backed absence;
2. do not infer cosmetics, nail treatment, facial-hair pattern or body-hair treatment from gender presentation, sexuality, ethnicity, age, occupation, personality or role;
3. complete only the minimum view-consistent continuation of an already-authorized visible feature;
4. do not invent a beauty routine, hygiene routine, medical condition, cultural practice or relationship meaning;
5. generated grooming detail remains `CANDIDATE_REVIEW_REQUIRED` and never creates Canon.

## Governed axes

Production review tracks:

- cosmetics existence authority
- cosmetics absence authority
- cosmetic region inventory
- eye makeup existence
- eyeliner topology
- eyeshadow region/coverage
- mascara/lash-treatment status
- false-lash status only when source-backed
- brow cosmetic treatment
- cheek cosmetic treatment
- lip cosmetic treatment
- lip color family
- lip finish family
- face-powder/foundation visibility only when source-backed
- decorative cosmetic motif only when source-backed
- temporary cosmetic marking boundary
- nail grooming existence authority
- nail length family
- nail shape family
- nail polish existence
- nail color family
- nail finish family
- nail decoration inventory
- left/right nail treatment consistency
- hand/foot nail distinction where source-backed
- chipped/worn polish status only when source-backed/state-backed
- facial-hair existence authority
- facial-hair absence authority
- moustache region
- beard region
- sideburn region
- chin-hair region
- jaw/cheek-hair region
- stubble existence
- facial-hair density family
- facial-hair length family
- facial-hair edge/topology
- facial-hair color relation
- facial-hair asymmetry where source-backed
- shaved facial-hair boundary
- eyebrow hair density family
- eyebrow grooming shape
- eyebrow shaved/notched detail only when source-backed
- visible body-hair existence authority
- body-hair region
- body-hair density family
- body-hair length family
- body-hair removal boundary only when source-backed
- shaved-pattern boundary only when source-backed
- underarm/limb/chest/other visible region status only when source-backed and visible
- skin-hair transition
- wetness response
- sweat response without routine inference
- age-bearing grooming continuity
- viewpoint continuity
- canonical left/right asymmetry
- expression continuity
- motion continuity
- lighting independence
- crop independence
- occlusion survival
- state-variant inheritance
- premium-state inheritance
- seasonal-state inheritance
- temporary removal/change authority
- battle/damage independence
- LOD survival priority
- chibi preservation class
- sprite preservation class
- grooming uncertainty class

## Cosmetics rule

Cosmetics are not default gender presentation.

Do not add:

- eyeliner;
- eyeshadow;
- blush;
- lipstick/lip gloss;
- false lashes;
- glitter;
- contour/highlight;
- decorative face marks

without source authority.

Do not remove source-backed cosmetics merely to make battle art, casual art or chibi art look simpler. Simplification may reduce micro-detail but preserves the authored grooming family.

## Nail rule

Nails remain anatomically plausible and source-constrained.

Do not:

- add nail polish for femininity/premium styling;
- add black polish for edgy/antagonist shorthand;
- add long nails for glamour;
- add nail art, gems or metallic finishes for rarity;
- change nail length to make hands look elegant;
- hide hand anatomy errors behind long nails;
- infer manicure/pedicure routines.

Source-backed polish/shape/count remains consistent across hands, views and asset kinds unless an explicit state delta changes it.

## Facial-hair rule

Facial hair is identity-bearing when authored.

Do not:

- erase moustache/beard/stubble for youthful beauty;
- add stubble for masculinity, fatigue or toughness;
- add beard density for age/authority;
- sharpen beard edges into generic fashion grooming;
- move facial-hair boundaries between viewpoints;
- turn shadow into stubble;
- turn scar/marking into facial hair.

Expression changes skin deformation but not the underlying facial-hair topology.

## Eyebrow-grooming rule

Face/Skull authority remains stronger for brow placement and structural relation. This layer only governs source-backed hair grooming on that structure.

Do not thin, arch, thicken, notch or shave eyebrows to signal gender, attitude, fashion or premium polish without authority.

## Visible body-hair rule

Visible body hair or source-backed hair removal remains a grooming axis, not a gender stereotype.

Do not infer presence or absence from:

- sex/gender presentation;
- age category alone;
- ethnicity/skin tone;
- athleticism;
- villain/hero role;
- exposure level.

More exposed skin does not authorize new body-hair detail. High resolution does not authorize micro-hair invention.

## Hygiene / routine boundary

Visible grooming state does not establish routine, cleanliness, wealth, discipline, vanity, sexuality, culture or occupation.

Do not infer:

- how often a character shaves;
- how often they apply makeup;
- who helps them;
- whether they enjoy cosmetics;
- whether they can afford products;
- whether a grooming state is culturally or romantically meaningful.

Those require source authority.

## Weather / wear rule

Rain, sweat, wind and long wear may affect source-backed cosmetics or grooming only when material/product behavior is actually authored or mechanically unavoidable.

Unknown cosmetics do not suddenly run, smear or glitter. Unknown polish does not chip. Unknown facial hair does not appear as time passes in one generated scene.

A generated smear, chip or stubble state never becomes Canon.

## Premium rule

Premium art may increase rendering clarity, not grooming inventory.

Prohibited premium defaults include:

- stronger eyeliner;
- longer lashes;
- glossy lips;
- blush;
- nail polish;
- nail gems;
- facial glitter;
- beard cleanup/beautification;
- added stubble;
- eyebrow reshaping;
- skin-hair removal for smoothness;
- removal of source-backed age/grooming cues.

## State / variant rule

Baseline grooming inherits unless an explicit authorized delta changes it.

Battle, premium, seasonal, Dawn, Kokuyou, wet, tired or damaged states do not automatically add/remove cosmetics, facial hair, polish or grooming details.

## LOD / chibi / sprite rule

Simplify micro-detail before changing grooming identity.

Preserve in priority order:

1. source-backed existence/absence;
2. major region and topology;
3. major color/value family where identity-bearing;
4. canonical asymmetry;
5. micro-edge, texture and finish.

Do not enlarge makeup, nail color or facial hair into an icon to survive small scale.

## Forbidden shortcuts

Hard failures include:

- makeupAddedForFemalePresentation
- makeupRemovedForMalePresentation
- eyelinerAddedForPremium
- lashesLengthenedForBeauty
- blushAddedForCuteness
- lipGlossAddedForPremium
- lipstickAddedForGlamour
- contourAddedForBeauty
- faceGlitterAddedForRarity
- cosmeticsRemovedForBattle
- cosmeticsRemovedForChibi
- nailPolishAddedForFemininity
- blackNailPolishAddedForEdginess
- longNailsAddedForElegance
- nailGemsAddedForPremium
- nailArtAddedForRarity
- handAnatomyHiddenByLongNails
- beardRemovedForYouthfulness
- moustacheRemovedForBeauty
- stubbleAddedForMasculinity
- stubbleAddedForFatigue
- beardAddedForAuthority
- beardDensityIncreasedForAge
- facialHairBoundaryMovesByView
- shadowConvertedToStubble
- eyebrowThinnedForFemininity
- eyebrowThickenedForMasculinity
- eyebrowArchAddedForAttitude
- eyebrowNotchAddedForEdginess
- bodyHairRemovedForBeauty
- bodyHairAddedForMasculinity
- bodyHairInferredFromEthnicity
- bodyHairInferredFromAge
- bodyHairInventedFromExposure
- highResolutionInventsBodyHair
- groomingInfersSexuality
- groomingInfersCulture
- groomingInfersWealth
- groomingInfersHygieneRoutine
- groomingInfersVanity
- groomingInfersRelationshipMeaning
- rainInventsMascaraRun
- sweatInventsMakeupSmear
- wearInventsNailChips
- timePassageInventsStubble
- premiumIncreasesGroomingInventory
- premiumSmoothsAwayFacialHair
- premiumSmoothsAwayAgeGroomingCues
- stateChangesGroomingWithoutDelta
- seasonalAddsCosmeticsWithoutDelta
- battleAddsStubbleWithoutDelta
- lodMovesGroomingFeatureForReadability
- chibiEnlargesMakeupIntoIcon
- spriteErasesSourceBackedFacialHair
- generatedGroomingCreatesCanon
- generatedRoutineCreatesCanon

## Production review checklist

Before accepting a candidate, verify:

- cosmetics/nails/facial hair/body hair exist only when source-backed;
- source-backed absence remains absence rather than an empty styling slot;
- gender/age/ethnicity/role did not generate grooming stereotypes;
- facial-hair and brow grooming remain attached to the same anatomy across views;
- nail length/color/finish do not change to beautify hands;
- weather/wear do not invent smears, chips or stubble;
- premium does not add makeup, lashes, gloss, polish, gems or grooming cleanup;
- state variants inherit baseline grooming without explicit delta;
- LOD preserves existence/major topology before micro-detail;
- unsupported grooming remains `CANDIDATE_REVIEW_REQUIRED`.

## Canon boundary

Generated makeup, nail treatment, facial-hair state, body-hair state, grooming routine, cultural meaning, hygiene inference, sexuality inference or relationship meaning never creates Canon by plausibility or repetition.

Human-reviewed authority is required for promotion.
