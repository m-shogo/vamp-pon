# All Character Skin Coverage / Exposure Boundary Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`

Scope: all 36 characters, all 9 production asset kinds.

## Purpose

This Master preserves each character's authored skin-coverage choices across viewpoints, poses, motion, weather, damage, premium art and LOD.

Coverage is not a generic attractiveness dial. Neckline depth, shoulder coverage, sleeve length, back coverage, waist coverage, leg coverage and opening/slit behavior are garment-construction and character-life decisions.

The governing chain is:

**Source-backed Coverage → Garment Opening Topology → Layering → Body / Pose → Motion / Contact → Temporary Occlusion → Visible Exposure → Candidate Review**

## Core rule

**A pose or rendering style may reveal the authorized garment from another angle; it may not create new skin exposure or hide source-backed coverage by redesigning the garment.**

More dramatic art, battle art, wet clothing, damage, premium rarity, summer atmosphere or camera angle are not authorization to expose more skin.

Likewise, an image model may not add arbitrary undershirts, stockings, gloves, scarves or extra panels merely to increase coverage when the source-backed design is more open.

## Unknown-coverage rule

Unknown coverage defaults to:

`SOURCE_CONSTRAINED_BASELINE_COVERAGE_PRESERVATION`

This means:

1. preserve every known garment opening, layer and coverage boundary;
2. preserve known exposure and known non-exposure equally;
3. complete only the minimum mechanically necessary hidden continuation of existing garments/layers;
4. do not infer modesty, exhibitionism, sexuality, gender norms, cultural norms, trauma, body confidence or discomfort from coverage;
5. do not add or remove coverage to make a character prettier, sexier, tougher, younger, older, more premium or more marketable;
6. generated boundary completion remains `CANDIDATE_REVIEW_REQUIRED` and never creates Canon.

## Coverage axes

Production review tracks:

- scalp/head coverage where garment-related
- forehead coverage where garment-related
- ear coverage
- neck front coverage
- neck side coverage
- neck rear coverage
- clavicle coverage
- shoulder top coverage
- shoulder rear coverage
- upper chest coverage
- side chest coverage
- rear upper-back coverage
- mid-back coverage
- lower-back coverage
- upper-arm coverage
- elbow coverage
- forearm coverage
- wrist coverage
- hand coverage
- finger coverage where gloves exist
- upper abdomen coverage
- mid abdomen coverage
- lower abdomen coverage
- waist coverage
- side-waist coverage
- pelvis/front-hip coverage
- side-hip coverage
- rear-hip/seat coverage
- upper-thigh coverage
- mid-thigh coverage
- knee coverage
- calf coverage
- ankle coverage
- foot coverage
- toe coverage
- neckline shape
- neckline depth
- neckline width
- collar opening state
- front closure opening extent
- rear opening extent
- side opening extent
- armhole opening geometry
- sleeve opening geometry
- cuff opening geometry
- hemline landmark
- side-slit existence
- side-slit maximum extent
- front/rear slit existence
- skirt/dress overlap coverage
- trouser/short rise coverage
- sock/stocking top boundary
- glove top boundary
- footwear top boundary
- underlayer existence
- underlayer coverage boundary
- outerlayer overlap
- layer-gap exposure
- seated coverage
- crouched coverage
- reaching coverage
- arm-raised coverage
- twisting coverage
- running/motion coverage
- wind displacement limit
- wetness coverage boundary
- damage coverage boundary
- mobility-equipment interaction
- wheelchair seated coverage
- prosthetic/orthotic interface coverage
- viewpoint continuity
- canonical left/right asymmetry
- crop independence
- lighting independence
- effect independence
- state-variant inheritance
- premium-state inheritance
- seasonal-state inheritance
- LOD preservation class
- chibi preservation class
- sprite preservation class
- temporary authorized exposure delta
- temporary authorized added-coverage delta
- uncertainty class

## Opening topology rule

Exposure follows real openings.

A neckline, armhole, slit, closure, hem or layer gap has authored geometry. The model may not widen, deepen, shorten, lift or open it simply to reveal anatomy.

Do not:

- deepen a neckline for premium art;
- widen an armhole to show side chest;
- shorten a skirt/shorts for leg length;
- raise a hem during action without physical cause;
- add a slit to allow a pose;
- open buttons/zippers for cooling or sex appeal;
- create an open back because the rear design was unknown.

## Pose / motion rule

Motion moves cloth within construction limits.

- raised arms may shift an existing top but may not reveal skin beyond plausible authored ease/layering;
- crouching and sitting preserve seat/hip coverage;
- running does not automatically lift skirts, coats or shirts to maximum exposure;
- twisting does not create new cutouts;
- foreshortening does not change garment length.

If a pose conflicts with the garment, adapt the pose/composition before redesigning coverage.

## Seated / wheelchair rule

Seated design is a first-class coverage state.

Preserve:

- back and waist coverage under torso compression;
- hip/seat coverage;
- thigh coverage;
- layer overlap around lap and seat;
- wheelchair cushion/frame interaction;
- authorized equipment interfaces.

Do not lengthen the torso, slim the body, move the waistband, add a lap cloth, invent shorts/leggings, or delete a layer merely to solve seated exposure.

## Weather / wind / wetness rule

Weather changes material behavior, not authorization.

Wind may displace authored loose cloth only within construction and layering constraints. Wetness may change weight and local cling according to material authority, but may not create transparency, unsupported anatomical reveal or a new exposure boundary.

Summer/heat does not authorize rolled sleeves, open collars, shortened hems, removed layers or new cutouts without a real variant delta.

Cold does not authorize extra scarves, gloves, stockings or layers without authority.

## Damage rule

Damage does not create permission for sexualized or identity-changing exposure.

Source-backed damage may alter coverage only when the damage authority explicitly specifies the affected garment region and state. Generic battle art may not tear clothing to expose chest, waist, thigh, back or underwear.

Generated tears never create Canon.

## Underlayer rule

Underlayers are inventory/construction, not a censorship patch.

Do not invent:

- undershirts;
- camisoles;
- shorts;
- leggings;
- stockings;
- gloves;
- body suits;
- bandages;
- compression garments

to resolve uncertainty or increase coverage.

Likewise, do not delete source-backed underlayers to increase exposure.

## Body-adornment boundary

Existing piercing, tattoo, scar or marking topology remains independent of exposure.

Showing more authorized skin does not authorize a new body marking. Covering a body marking does not delete it. The Body Adornment authority remains stronger for feature existence and placement.

## Character-meaning boundary

Coverage may be an authored character-life decision, but image generation may not infer why.

Do not infer from visible coverage:

- sexual availability;
- modesty level;
- confidence/insecurity;
- religion/culture;
- trauma;
- body shame/pride;
- age appropriateness judgments;
- relationship status.

Meaning requires source authority.

## Child / age boundary

Child and young-character coverage must never be sexualized or adultized. Image generation may not use premium, battle, wetness, pose or damage to increase sexualized exposure or anatomical emphasis.

Adult characters likewise retain their authored coverage rather than being normalized to a generic sexualized body-display template.

## Premium rule

Premium rendering may improve fabric, light and construction clarity. It may not alter exposure topology.

Prohibited premium defaults include:

- deeper neckline;
- open collar;
- exposed shoulders;
- open back;
- cropped top;
- shortened hem;
- thigh-high slit;
- rolled sleeves;
- removed stockings/gloves;
- opened zipper/buttons;
- wet transparency;
- lifted skirt/coat;
- new cutouts;
- lingerie-like underlayer replacement.

## Variant rule

Every state is baseline plus authorized delta.

Dawn, Kokuyou, battle, premium, seasonal or other state labels do not inherently change coverage. If a variant authorizes a coverage change, preserve the exact affected boundary and inherit all unspecified boundaries from baseline.

## LOD / chibi / sprite rule

Small-scale assets simplify folds and edge detail before changing garment opening/coverage topology.

Preserve:

1. major neckline/armhole/hem boundaries;
2. major sleeve/leg coverage;
3. layer presence;
4. side/back coverage;
5. major slit/opening existence;
6. canonical asymmetry.

Do not convert a covered design into a simple leotard/swimsuit-like shape or add full coverage merely because layers are hard to draw.

## Forbidden shortcuts

Hard failures include:

- premiumDeepensNeckline
- premiumWidensNeckline
- premiumOpensCollar
- premiumExposesShoulders
- premiumCreatesOpenBack
- premiumCropsTop
- premiumShortensHem
- premiumAddsThighSlit
- premiumRollsSleeves
- premiumRemovesStockings
- premiumRemovesGloves
- premiumOpensButtonsOrZipper
- premiumAddsCutout
- premiumAddsWetTransparency
- battleTearsClothingForExposure
- damageRevealsUnsupportedChest
- damageRevealsUnsupportedWaist
- damageRevealsUnsupportedThigh
- damageRevealsUnsupportedBack
- windMaximizesExposure
- runningLiftsHemForFanservice
- armRaiseCreatesUnsupportedMidriff
- crouchCreatesUnsupportedRearExposure
- seatedPoseCreatesUnsupportedWaistExposure
- twistCreatesNewCutout
- cameraAngleChangesGarmentLength
- foreshorteningChangesCoverage
- openBackInventedFromUnknownRear
- slitInventedToAllowPose
- underlayerDeletedForExposure
- undershirtInventedForCoverage
- shortsInventedForCoverage
- leggingsInventedForCoverage
- stockingsInventedForCoverage
- bandageInventedForCoverage
- compressionWearInventedForCoverage
- summerRemovesLayerWithoutDelta
- summerRollsSleeveWithoutDelta
- heatOpensClosureWithoutDelta
- coldAddsLayerWithoutDelta
- coldAddsScarfWithoutDelta
- coldAddsGlovesWithoutDelta
- wetnessCreatesTransparency
- wetnessRevealsUnsupportedAnatomy
- exposureInventsTattoo
- exposureInventsPiercing
- coverageDeletesBodyMarking
- childPremiumIncreasesExposure
- childBattleIncreasesExposure
- childWetnessSexualizesBody
- stateChangesCoverageWithoutDelta
- seasonalChangesCoverageWithoutDelta
- lodDeepensNecklineForReadability
- lodShortensHemForSilhouette
- chibiSimplifiesToSwimsuitShape
- spriteDeletesUnderlayer
- cropHidesCoverageMismatch
- hairHidesCoverageMismatch
- effectsHideCoverageMismatch
- generatedExposureCreatesCanon
- generatedCoverageMeaningCreatesCanon

## Production review checklist

Before accepting a candidate, verify:

- neckline, armhole, sleeve, waist, back, hem and leg coverage match source-backed construction;
- pose/motion/weather do not create a new exposure boundary;
- seated/wheelchair states preserve hip/seat/waist/thigh coverage;
- underlayers are neither invented nor deleted to resolve uncertainty;
- wetness and damage do not become exposure shortcuts;
- premium does not deepen/open/shorten/roll/remove garment boundaries;
- state variants change coverage only through explicit delta;
- body markings remain independent of visibility;
- no personality/culture/sexual meaning was inferred from coverage;
- LOD preserves major coverage topology before micro-detail;
- unresolved boundaries remain `CANDIDATE_REVIEW_REQUIRED`.

## Canon boundary

Generated exposure, added coverage, underlayer, rolled/open state, damage reveal, modesty interpretation, sexuality interpretation, cultural meaning or body-confidence meaning never creates Canon by plausibility or repetition.

Human-reviewed authority is required for promotion.
