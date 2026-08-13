# All Character Accessory / Prop Inventory / State-Transition Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`

Scope: all 36 characters, all 9 production asset kinds.

## Purpose

This Master prevents removable accessories, carried objects, bags, eyewear, headwear, gloves, tools and other source-backed props from appearing, disappearing, duplicating or changing identity merely because the viewpoint, pose, state or asset kind changes.

Body-attached features such as source-backed piercings, tattoos, scars and stable skin markings remain governed by the Body Adornment Topology authority. This authority governs **discrete removable objects** and their location/state transitions.

The governing chain is:

**Source-backed Object Existence / Absence → Object Identity → Inventory Count → Attachment / Carry Method → Worn / Held / Stored / Placed State → Transition Path → Viewpoint / LOD Continuity → Candidate Review**

The image model may preserve a known object. It may not invent a new accessory or prop because a character, hand, silhouette or scene feels empty.

## Core rule

**One source-backed object remains one object across views and states unless explicit authority changes its inventory.**

Changing where an object is located does not create a new object. Hiding an object behind clothing or the body does not delete it. Holding an object does not leave a duplicate in its holster, pocket, bag or attachment point.

## Unknown-inventory rule

Unknown inventory treatment defaults to:

`SOURCE_CONSTRAINED_NO_INVENTION_ACCESSORY_INVENTORY_COMPLETION`

This means:

1. preserve source-backed object existence, absence, count, identity and attachment/storage information;
2. do not create a removable accessory or prop from an unspecified slot;
3. complete only mechanically necessary hidden continuation for a known object or known storage route;
4. do not infer gifts, matching items, keepsakes, relationship tokens, rank insignia, luxury goods or faction equipment from role, relationship, rarity or personality;
5. generated object identity, storage state or transition remains `CANDIDATE_REVIEW_REQUIRED` and never creates Canon.

## Governed object classes

Keep these object classes distinct where source-backed:

- eyewear;
- headwear;
- removable hair accessory;
- gloves / removable handwear;
- scarf / removable neckwear;
- removable jewelry already established as an inventory object rather than a body-modification site;
- bag / pouch / case;
- belt-attached removable case or container;
- carried tool;
- carried story prop;
- handheld device;
- book / paper object;
- lantern / light object;
- umbrella or weather prop;
- removable mobility or equipment accessory only when source-backed;
- footwear-adjacent removable item when separately authored;
- other discrete source-backed object.

Object classification never authorizes existence.

## Inventory axes

Production review tracks:

- object existence authority
- object absence authority
- object class
- canonical object identity
- inventory count
- duplicate prohibition status
- left/right paired status
- paired-object identity relationship
- object size family
- object mass family where relevant
- primary material family where source-backed
- color family where source-backed
- major shape topology
- major silhouette topology
- canonical asymmetry
- object-side marking or label continuity
- attachment point
- attachment hardware
- attachment orientation
- worn body region
- carried hand state
- carried left/right hand state only when source-backed
- two-hand carry state where required
- shoulder carry state
- back carry state
- waist carry state
- pocket storage state
- bag storage state
- case/holster storage state
- environment placement state
- resting state
- active-use state
- closed/open object state when source-backed
- folded/unfolded state when mechanically authored
- collapsed/extended state when authored
- packed/unpacked state
- object-to-body contact
- object-to-garment contact
- object-to-hair contact
- object-to-equipment contact
- object-to-other-prop contact
- storage opening compatibility
- storage volume compatibility
- storage depth compatibility
- storage retention method
- retrieval path
- return path
- draw/use/return sequence
- don/remove/store sequence
- handoff status only when source-backed
- temporary placement status
- object visibility by viewpoint
- hidden-side continuation
- occlusion survival
- crop survival priority
- motion survival
- seated-state location
- crouched-state location
- sleep/rest state only when source-backed
- weather-state location
- battle/action state location
- premium-state inheritance
- seasonal-state inheritance
- LOD survival priority
- chibi object identity class
- sprite object identity class
- object omission permission status
- temporary removal authority
- permanent inventory change authority
- breakage/damage authority
- repair/replacement authority
- relationship-evidence boundary
- ownership-meaning boundary
- cultural-meaning boundary
- generated-accident rejection status
- inventory uncertainty class

## Inventory count rule

Count is authoritative.

Do not:

- duplicate an object because both hands are visible;
- leave a stored copy after drawing the same object;
- create a second bag for balance;
- mirror a one-sided pouch or case;
- convert one glove into a pair or a pair into one without authority;
- create extra eyewear, hats, cases or tools for premium detail;
- infer a spare or backup object.

If a paired item is source-backed, preserve its pair logic. If only one item is source-backed, do not assume a pair.

## Object identity rule

The same object preserves its major identity across states.

When a known object moves from storage to hand, preserve:

- size family;
- major silhouette;
- material/color family where known;
- major hardware;
- labels/markings where source-backed;
- wear/repair state;
- opening/closure family.

Do not replace a practical object with a prettier premium variant simply because it is now prominent in frame.

## Worn / held / stored state rule

An object can change location only through a mechanically plausible transition.

Examples:

- eyewear can move from face to hand or storage if a source-backed storage path exists;
- a tool can move from case/pocket/bag to hand through a real opening and retrieval path;
- a hat can be worn, held or placed if the scene requires, but the inventory count remains one;
- gloves can be worn or removed only while preserving pair/count and storage logic where known.

Do not teleport objects between states merely to improve composition.

## Storage rule

A stored object must fit its storage.

Preserve:

- opening size;
- internal volume;
- retention method;
- object orientation when mechanically required;
- retrieval clearance;
- seated/mobility-equipment interference.

Do not shrink an object to fit a pocket, enlarge a pocket to fit an object, or invent an invisible compartment.

## Hand/contact rule

Holding an object requires real contact and removes it from its previous storage location.

Preserve:

- hand scale;
- grip family;
- contact points;
- object orientation;
- weight-bearing plausibility;
- two-hand requirement where mechanically necessary.

Do not float objects near a hand, merge them into the palm, duplicate them in storage, or change hand anatomy to improve grip.

## Headwear / eyewear rule

Source-backed eyewear and headwear remain discrete objects.

Do not:

- merge glasses into facial anatomy;
- change frame shape between views;
- create sunglasses from ordinary glasses for premium styling;
- add a second pair on the head while one is worn;
- change a hat to a different silhouette from rear view;
- add pins, ribbons, chains or badges without source authority.

Hair may occlude parts of an object but may not delete or relocate it.

## Bag / pouch / case rule

A bag, pouch or case retains:

- count;
- attachment side;
- strap/anchor relation;
- major volume;
- opening family;
- storage role;
- wear/repair state.

Do not make a bag flatter when empty in one asset and structurally different in another unless material/load authority explains it. Do not add generic utility pouches to fill the waist.

## Prop / tool rule

A source-backed prop or tool is an object identity, not generic scene dressing.

Do not:

- replace it with a genre-standard fantasy equivalent;
- enlarge it for hero framing;
- ornament it for premium rarity;
- add glowing nodes;
- change material because another style reads better;
- create relationship meaning from shared or matching props without authority.

## Placement rule

Temporary scene placement does not change ownership or inventory.

If an object is placed on a table, seat, floor or nearby surface:

- the worn/stored copy must be absent;
- placement must be spatially plausible;
- return/retrieval remains mechanically possible;
- the object does not become environment Canon merely because it appears in one generated scene.

## State / variant rule

Baseline inventory inherits unless explicit authorized delta changes it.

Premium, battle, seasonal, Dawn, Kokuyou or other state labels do not automatically:

- add a hat;
- remove glasses;
- add gloves;
- create a bag;
- add utility pouches;
- add weapons/tools;
- add matching accessories;
- replace a practical object with an ornate one;
- remove mobility-related accessories.

Temporary removal/addition needs explicit state authority.

## Occlusion / crop rule

Occlusion hides; it does not delete inventory.

Crop may omit an object from the frame only when the crop logically excludes its location. Crop may not be used to avoid resolving an object mismatch.

A hidden object remains part of the candidate state unless explicit scene/state authority says it was removed or placed elsewhere.

## Premium rule

Premium rendering may improve clarity of existing source-backed inventory. It may not inflate inventory or ornament.

Prohibited premium defaults include:

- extra bag/pouch;
- extra hat/head ornament;
- extra glasses;
- extra gloves/accessories;
- spare tools;
- decorative cases;
- gold/jeweled replacement variants;
- matching relationship tokens;
- glowing prop upgrades;
- larger heroic prop scale.

## LOD / chibi / sprite rule

Small-scale conversion simplifies object detail in this order:

1. surface texture;
2. tiny labels;
3. micro hardware;
4. small internal seams;
5. secondary highlights.

Preserve before them:

- object existence;
- inventory count;
- paired/single logic;
- major silhouette;
- body/storage location;
- one-sided attachment;
- object identity;
- major storage transition state.

Do not make a small object disappear if its identity is required for the character read unless explicit LOD authority permits omission.

## Forbidden shortcuts

Hard failures include:

- inventAccessoryBecauseSilhouetteFeelsEmpty
- inventPropBecauseHandsFeelEmpty
- inventBagBecauseWaistFeelsEmpty
- inventUtilityPouchForGenreShorthand
- inventGlovesForCombatRole
- inventHatForSeasonalMood
- inventEyewearForIntelligenceCoding
- inventToolFromOccupationGuess
- inventGiftFromRelationshipGuess
- inventMatchingAccessoryForRelationshipEvidence
- inventLuxuryVariantForPremium
- inventSpareOrBackupObject
- duplicateObjectBetweenHandAndStorage
- duplicateObjectAcrossTwoHands
- duplicateBagForSymmetry
- mirrorOneSidedPouch
- mirrorOneSidedCase
- convertSingleItemToPair
- convertPairToSingle
- objectTeleportsBetweenStates
- objectChangesIdentityWhenDrawn
- objectChangesColorWhenProminent
- objectChangesMaterialWhenProminent
- objectGainsOrnamentWhenProminent
- objectScaleInflatesForHeroFraming
- objectShrinksToFitPocket
- pocketEnlargesToFitObject
- invisibleStorageCompartmentInvented
- storageOpeningInvented
- retentionHardwareInvented
- heldObjectStillVisibleInStorage
- placedObjectStillVisibleOnBody
- removedEyewearStillVisibleOnFace
- glassesMergeIntoFace
- headwearChangesSilhouetteByView
- hairOcclusionDeletesAccessory
- cropHidesInventoryMismatch
- effectsHideInventoryMismatch
- bagStrapChangesSideByView
- pouchMigratesAroundWaist
- toolHolsterMigratesByView
- propFloatsNearHand
- gripChangesHandAnatomy
- objectClipsThroughGarment
- objectClipsThroughMobilityEquipment
- stateAddsAccessoryWithoutDelta
- stateRemovesAccessoryWithoutDelta
- premiumAddsAccessoryCount
- premiumAddsUtilityPouches
- premiumAddsGoldOrGems
- premiumAddsMatchingRelationshipToken
- premiumAddsGlowToProp
- premiumReplacesObjectWithOrnateVariant
- seasonalAddsUnapprovedHeadwear
- battleAddsUnapprovedTool
- weatherAddsUnapprovedUmbrella
- lodDeletesIdentityObjectWithoutPermission
- lodMovesObjectForReadability
- chibiEnlargesObjectIntoIcon
- spriteMirrorsOneSidedAttachment
- generatedPlacementCreatesOwnershipCanon
- generatedPropCreatesRelationshipEvidence
- generatedObjectIdentityCreatesCanon
- generatedInventoryCreatesCanon

## Production review checklist

Before accepting a candidate, verify:

- every removable accessory/prop has source-backed existence authority;
- inventory count is consistent and no held/stored duplicate exists;
- one-sided or paired logic remains correct;
- the same object preserves identity across worn/held/stored/placed states;
- storage volume/opening/retrieval path can actually contain the object;
- held objects have real hand contact and leave their prior storage state;
- viewpoint/crop/occlusion do not relocate or delete inventory;
- state variants inherit baseline inventory without unauthorized additions/removals;
- premium did not add extra objects, ornate replacements, gems, glow or relationship tokens;
- LOD preserves existence/count/location/object identity before micro-detail;
- unsupported transitions remain `CANDIDATE_REVIEW_REQUIRED`.

## Canon boundary

Generated accessory inventory, prop ownership, object state, storage route, handoff, gift meaning, relationship meaning, spare item, replacement object or temporary placement never creates Canon by plausibility or repetition.

Human-reviewed authority is required for promotion.
