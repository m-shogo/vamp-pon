# All Character Fastener / Operational Access / Serviceability Fidelity Master v1

Status: `CURRENT_PRODUCTION_VISUAL_AUTHORITY`

Scope: all 36 characters, all 9 production asset kinds.

## Purpose

This Master prevents garments, pockets, closures and wearable equipment from being visually plausible yet practically unusable by the character wearing them.

The preceding authorities establish body, garment construction, material mechanics, don/doff workflow and long-wear behavior. This layer asks a more operational question:

**Can the existing closure, pocket, strap, buckle, zipper, button, snap, drawcord or service point actually be reached, gripped, operated, inspected and maintained without inventing a different body or mechanism?**

The governing chain is:

**Authorized Body / Mobility → Existing Garment & Hardware → Reach Envelope → Hand / Grip / Tool Access → Operation Force / Travel → Feedback / Verification → Adjustment / Storage → Service / Replacement Access**

Operational plausibility does not authorize a new closure, accessibility aid, handedness, disability accommodation, caregiver relationship or habitual gesture.

## Core rule

**Existing functional hardware must remain operable within the authorized construction and body context.**

A fastener is not merely a graphic icon. It has finite size, thickness, grip area, travel, receiving geometry, load and access clearance.

A pocket is not merely a rectangle. Its opening must admit a plausible hand or intended object, and its contents must be retrievable through that same opening.

A serviceable component must have a mechanically plausible route for inspection, repair or replacement if the design already implies replaceability.

## Unknown-operation rule

Unknown operational details default to:

`SOURCE_CONSTRAINED_NEUTRAL_OPERATIONAL_ACCESS_COMPLETION`

This means:

1. preserve the existing body, mobility, garment, fastener, pocket, hardware and equipment topology;
2. complete only the minimum ordinary access geometry necessary for known function;
3. do not invent larger pulls, tabs, loops, magnetic closures, Velcro-like systems, elastic, quick-release buckles, assistive grips, tool-free mechanisms or hidden access panels;
4. do not infer dominant hand, reduced dexterity, tremor, weakness, pain, caregiver use, occupational skill or accessibility need;
5. generated operational details remain `CANDIDATE_REVIEW_REQUIRED` and never create Canon.

## Operational axes

Production review tracks these connected axes:

- closure operation family
- operation direction
- operation travel distance
- operation force family
- grip surface size
- pinch surface size
- pull-tab size
- pull-tab thickness
- button diameter family
- button projection
- buttonhole clearance
- snap diameter and seating depth
- hook/eye access clearance
- buckle frame size
- buckle tongue access
- buckle strap threading clearance
- lacing eyelet spacing
- lace end access
- drawcord end access
- drawcord channel resistance
- knot access where source-backed
- zipper pull access
- zipper slider clearance
- zipper start alignment
- zipper end-stop visibility
- two-sided closure alignment
- closure verification visibility
- closure tactile verification plausibility
- front torso reach envelope
- side torso reach envelope
- rear torso reach envelope
- shoulder reach envelope
- neck reach envelope
- waist reach envelope
- hip reach envelope
- thigh reach envelope
- ankle reach envelope
- footwear reach envelope
- seated reach envelope
- standing reach envelope
- crouched reach envelope
- one-hand stabilization need
- two-hand stabilization need
- opposite-hand stabilization need
- hand insertion clearance
- finger insertion clearance
- thumb opposition clearance
- wrist angle clearance
- forearm approach clearance
- sleeve/cuff interference
- glove interference when gloves are authorized
- nail/jewelry interference only where source-backed
- hair interference
- headwear interference
- bag/strap interference
- layer interference
- mobility-equipment interference
- wheelchair armrest/frame interference
- prosthetic/orthotic interference
- assistive-device interference
- pocket opening width
- pocket opening orientation
- pocket depth vs retrieval path
- pocket object-scale compatibility
- pocket hand-access clearance
- pocket seated-access clearance
- pocket load retention
- storage return path
- strap adjustment access
- belt adjustment access
- harness adjustment access
- closure emergency-release status only where authorized
- inspection visibility
- cleaning access
- repair access
- stitch/seam repair access
- fastener replacement access
- button replacement access
- zipper replacement access
- buckle replacement access
- strap replacement access
- hardware attachment exposure
- tool access where source-backed
- part removal path
- replacement-part insertion path
- service clearance
- reassembly verification
- operational uncertainty class

## Grip rule

The visible control surface must be compatible with the operation it implies.

Examples:

- a zipper slider needs a pull or grip surface if the authored design shows one;
- a button must have enough exposed perimeter or projection to be manipulated through its authored buttonhole;
- a buckle tongue and strap need finite clearance;
- a snap must have a plausible press/separate direction;
- drawcord ends cannot disappear inside the channel while still being depicted as user-adjustable;
- tiny ornamental objects do not automatically become functional controls.

Do not enlarge or redesign hardware merely because operation would otherwise be difficult. If the source-backed design is unresolved, keep it unresolved for human review rather than inventing a solution.

## Reach rule

Operation must occur inside a plausible reach envelope for the authorized body and pose.

Reach may be affected by:

- body proportion;
- shoulder and elbow range implied by the scene;
- garment bulk;
- seated posture;
- wheelchair frame/armrest;
- carried bags;
- authorized mobility or assistive equipment.

Do not:

- lengthen arms;
- shrink the torso;
- move a closure;
- rotate a pocket around the body;
- delete equipment;
- assume an impossible behind-back reach;
- invent helper use.

## One-hand / two-hand rule

A mechanism may mechanically require stabilization.

Examples:

- starting some zippers may require the opposite side to be held;
- threading a buckle may require two hands;
- tightening a strap may require one hand to hold the buckle and another to pull;
- opening a loaded pocket may require stabilization.

This is a mechanical requirement only. It does not establish handedness, dexterity, disability or habitual technique.

## Gloves and layers

If gloves or thick sleeves are already authorized in an asset, they affect access geometry.

Do not respond by inventing larger tabs, new loops or different closures unless an authorized variant delta provides them.

If operation becomes unresolved, preserve the design and mark the candidate for review.

## Pocket access rule

A pocket must function as storage through a real opening.

Preserve:

- opening width and orientation;
- hand/finger access where intended;
- object-size compatibility;
- depth and retrieval path;
- flap/zipper/button obstruction;
- seated access;
- neighboring strap/equipment interference;
- return path after use.

Do not:

- enlarge the opening to show contents;
- move the pocket to a more convenient location;
- shrink the stored object;
- make the hand smaller;
- turn a decorative patch into a pocket;
- add an invisible opening.

## Strap / buckle adjustment

Adjustment hardware needs real access and a load path.

- strap tails must exist if depicted as adjustable;
- buckles must admit the strap thickness;
- adjustment travel must not pass through solid hardware or body geometry;
- loaded straps may require tension to be reduced before adjustment;
- adjustment must not reshape the authorized body for beauty.

## Seated / wheelchair operation

Seated operation is a first-class use case where applicable.

Preserve:

- reach around body and seat geometry;
- armrest/frame interference;
- lap and thigh clearance;
- pocket access relative to seat pressure;
- closure access relative to layered bulk;
- equipment controls and straps already authorized.

Do not move pockets or closures, shrink the wheelchair, flatten the body, remove armrests or invent special accessibility hardware to make access convenient.

## Prosthetic / orthotic / assistive-equipment boundary

Operational access around existing equipment remains source-constrained.

The model may preserve known clearances. It may not infer:

- reduced dexterity;
- grip weakness;
- device-removal routine;
- one-handed use;
- helper use;
- adaptive fasteners;
- enlarged pulls;
- magnetic closures;
- occupational therapy strategies.

These require explicit authority.

## Serviceability rule

Serviceability describes whether an existing component can be inspected, cleaned, repaired or replaced without redesigning the entire object.

When the design already implies replaceability, preserve:

- attachment access;
- removal direction;
- tool clearance where source-backed;
- replacement-part route;
- reassembly alignment;
- verification of secure attachment.

Do not invent screws, snaps, access panels, removable linings, modular parts or tool-free releases solely to make the design serviceable.

Unknown repair construction remains unresolved for human review.

## Cleaning access boundary

Cleaning access may be mechanically relevant for pockets, linings, footwear and equipment interfaces, but it does not establish the character's cleanliness habits or domestic routine.

Do not infer:

- how often they wash clothing;
- whether they are neat or messy;
- who performs maintenance;
- financial ability to replace items;
- sentimental attachment.

## Force and feedback rule

Operation requires finite force and a way to know whether the action succeeded.

The image model must not imply:

- a buckle closes with no strap engagement;
- a zipper is closed while teeth/edges are misaligned;
- a snap is engaged while visibly separated;
- a button is secure without passing through the receiving structure;
- a closure is both open and load-bearing at the same time.

Do not exaggerate finger strain or pain. Force is a mechanical property, not an emotional cue.

## Premium rule

Premium rendering may improve legibility of existing hardware. It may not add:

- tiny jeweled clasps;
- decorative but unusable buckles;
- extra zipper pulls;
- ornamental lacing;
- micro-buttons;
- gold hardware proliferation;
- invisible magnetic closures;
- elegant but inaccessible rear fasteners;
- extra straps/harness controls;
- decorative quick-release mechanisms.

Premium may not reduce control size below plausible operability simply for refinement.

## LOD / chibi / sprite rule

Small-scale assets may simplify hardware depiction, but functional topology remains.

Preserve before micro-detail:

- closure location and type;
- major control/grip position;
- pocket opening location;
- strap/buckle relation;
- major access route;
- footwear closure logic;
- seated/equipment interference.

A small button may become a simple mark, but the garment must not become a closureless pullover if the full design requires that button route.

## Forbidden shortcuts

Hard failures include:

- enlargeHandsToOperateHardware
- shrinkHandsToEnterPocket
- lengthenArmsForReach
- shrinkTorsoForReach
- moveClosureForReach
- movePocketForReach
- rotatePocketAroundBody
- removeWheelchairArmrestForReach
- shrinkWheelchairForReach
- removeAssistiveDeviceForReach
- hiddenHelperAssumed
- handednessInvented
- reducedDexterityInvented
- tremorInvented
- gripWeaknessInvented
- painInventedFromOperation
- adaptiveFastenerInvented
- enlargedPullInvented
- magneticClosureInvented
- velcroLikeClosureInvented
- quickReleaseInvented
- elasticLoopInvented
- hiddenAccessPanelInvented
- toolFreeReleaseInvented
- zipperPullTooSmallToGrip
- zipperStartImpossibleToAlign
- zipperClosedWhileMisaligned
- buttonWithoutManipulationClearance
- buttonSecureWithoutReceivingHole
- snapEngagedWhileSeparated
- buckleWithoutStrapThreadingClearance
- buckleTongueInaccessible
- lacingWithoutFingerAccess
- drawcordAdjustableWithoutAccessibleEnds
- pocketOpeningTooSmallForIntendedObject
- pocketOpeningTooSmallForIntendedHandAccess
- invisiblePocketOpening
- decorativePatchBecomesPocket
- pocketObjectShrunkForRetrieval
- pocketHandShrunkForRetrieval
- strapTailMissingDespiteAdjustment
- adjustmentTravelPassesThroughBody
- adjustmentTravelPassesThroughSolidHardware
- loadedStrapAdjustedWithoutLoadLogic
- gloveIgnoredDuringOperation
- sleeveBulkIgnoredDuringOperation
- hairClipsThroughFastenerOperation
- seatedReachIgnoresSeatGeometry
- wheelchairFrameIgnoredDuringOperation
- prostheticOrthoticRoutineInvented
- serviceScrewInvented
- removableLiningInvented
- modularPartInvented
- replacementPanelInvented
- cleaningHabitInvented
- maintenancePersonalityInvented
- premiumAddsMicroJewelledClasp
- premiumAddsDecorativeBuckles
- premiumAddsExtraZipperPull
- premiumShrinksControlsForElegance
- premiumMovesFastenerToBackForElegance
- lodErasesClosureType
- chibiErasesPocketOpening
- spriteErasesStrapBuckleRelation
- effectGlowHidesInoperableHardware
- generatedOperationMethodCreatesCanon
- generatedServiceabilityCreatesCanon

## Production review checklist

Before accepting a candidate, verify:

- every functional closure has finite, reachable control geometry;
- reach does not require body resizing, closure migration or equipment deletion;
- one-hand/two-hand stabilization needs are mechanically plausible without inferring handedness or disability;
- authorized gloves/layers do not magically disappear during operation;
- pockets admit the intended hand/object through their real openings;
- strap/buckle adjustment has accessible tails, clearance and load logic;
- seated/wheelchair access preserves actual seat/frame/body geometry;
- serviceability does not invent removable panels or hardware;
- premium did not add unusable micro-controls or decorative fastener clutter;
- LOD preserves functional topology before micro-detail;
- unsupported operational details remain `CANDIDATE_REVIEW_REQUIRED`.

## Canon boundary

Generated hand-use method, handedness, dexterity, adaptive mechanism, helper use, fastener operation, pocket-access technique, service procedure, cleaning routine or replacement method never creates Canon by plausibility or repetition.

Human-reviewed authority is required for promotion.
