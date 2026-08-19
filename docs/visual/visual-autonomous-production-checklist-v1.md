# Visual Autonomous Production Checklist v1

Status: `CURRENT`

Authority: `data/character-assets/manifests/visual-autonomous-production-policy.v1.json`

Scope: `m-shogo/vamp-pon` only.

Logo is excluded from this production loop and is produced separately. The non-logo pipeline continues without waiting for logo delivery. Logo integration is checked only at the final project 100% gate.

## Core operating rule

Codex is the delegated author and production executor. There is no intermediate Human approval gate. Human review occurs only after the full project reaches the 100% readiness gate.

Generated images are never allowed to invent or close setting facts. Codex must resolve the setting first, materialize the authority snapshot, then generate from that snapshot.

## 0. Git and Current Authority

- [ ] Work only in `m-shogo/vamp-pon`.
- [ ] Fetch/recheck latest `main` immediately before each production batch.
- [ ] Keep the active production PR current with `main` using non-force history-preserving integration.
- [ ] Confirm open PRs and avoid duplicate or stacked work for the same authority surface.
- [ ] Preserve stable asset IDs and existing lineage IDs.
- [ ] Preserve rejected candidates, QA records, reject ledgers, and replacement history.
- [ ] Never force-push `main`.
- [ ] Do not delete an unmerged branch merely to make Git look clean.
- [ ] Remove/close only work that is proven merged, superseded, duplicated, or intentionally abandoned with evidence.
- [ ] Confirm the Current Authority points to the autonomous production policy, not an old Human-gated interpretation.

## 1. Settings / Author Decisions

For every unresolved character, world, object, enemy, location, era, household, constellation, or story-relevant visual fact:

- [ ] Read all Current sources before deciding.
- [ ] Separate `CURRENT`, `CANDIDATE`, `OPEN`, `LEGACY`, and rejected evidence.
- [ ] Identify contradictions and stale aliases before authoring a new fact.
- [ ] Prefer the narrowest decision that closes the production blocker without inventing unrelated lore.
- [ ] Record the previous state.
- [ ] Record the selected decision.
- [ ] Record the reason for the decision.
- [ ] Record source/evidence paths.
- [ ] Record conflicting evidence and how it was resolved.
- [ ] Record forbidden inferences that image generation must not make.
- [ ] Update machine-readable data first.
- [ ] Update human-readable Lorebook/setting documentation from the same authority.
- [ ] Run consistency/coverage checks.
- [ ] Mark a setting `NON_REQUIRED` only with an explicit production reason.
- [ ] Do not ask for intermediate Human confirmation.

### 42 life-choice decisions

- [ ] Consume `data/visual/all-character-life-choice-author-decision-packet-v1.json` as the source queue.
- [ ] Replace `PENDING_HUMAN_AUTHOR_DECISION` operationally with delegated Codex authoring work.
- [ ] Resolve adornment/piercing/tattoo/scar policy.
- [ ] Resolve skin coverage/exposure preference.
- [ ] Resolve grooming/hair maintenance.
- [ ] Resolve footwear/ground interface.
- [ ] Resolve accessory/prop inventory.
- [ ] Resolve material wear/repair/maintenance.
- [ ] Keep species/body-type adapter semantics intact.
- [ ] Do not use image output to decide any of the 42 facts.

### 56 partial-evidence items

- [ ] Re-read the partial evidence review packet.
- [ ] Promote only evidence-supported facts.
- [ ] Author the missing production-facing detail where the user delegation permits it.
- [ ] Preserve uncertainty when it has story value and is not a visual blocker.
- [ ] Close production blockers before prompt export.

## 2. Master Specification

For each Master subject:

- [ ] Confirm one stable subject identity and one stable parent lineage.
- [ ] Confirm the exact output family before generating any raster.
- [ ] Confirm required views/panels and their purpose.
- [ ] Confirm face, age coding, body, proportions, silhouette, and distinctive construction.
- [ ] Confirm hair topology and grooming rules.
- [ ] Confirm clothing construction, exposure policy, seams, closures, layering, materials, wear, and repair.
- [ ] Confirm adornment, scars, tattoos, piercings, and explicit absence rules.
- [ ] Confirm dominant-hand state separately from held-object placement.
- [ ] Confirm equipment body-side placement and anti-mirroring rules.
- [ ] Confirm era-appropriate materials and maintenance.
- [ ] Confirm expression/acting range.
- [ ] Confirm motion/silhouette derivation rules.
- [ ] Confirm absolute `DO NOT DRAW` constraints.
- [ ] Confirm differentiation from visually adjacent characters.
- [ ] Export a prompt packet from the materialized Current Authority snapshot.
- [ ] Hash the prompt and authority inputs.

## 3. Character Master Pack

Each of 36 characters has four logical source sheets:

1. Identity / Turnaround
2. Face / Expression / Acting
3. Costume / Equipment / Material
4. Silhouette / Motion / Derivation

For each sheet:

- [ ] Generate four candidates from the same authority snapshot and prompt contract.
- [ ] Run structural hard-veto QA before subjective ranking.
- [ ] Reject identity drift.
- [ ] Reject age drift.
- [ ] Reject body/proportion drift.
- [ ] Reject face/skull landmark drift.
- [ ] Reject hair topology/grooming drift.
- [ ] Reject mirrored asymmetric construction.
- [ ] Reject wrong anatomical-side equipment.
- [ ] Reject costume construction drift.
- [ ] Reject unauthorized exposure/adornment.
- [ ] Reject generic gacha/fantasy beautification that overwrites authored specificity.
- [ ] Reject text/logo/watermark/UI contamination.
- [ ] Record every reject reason.
- [ ] Revise the prompt only from diagnosed failure causes.
- [ ] Regenerate until at least one candidate passes all required QA.
- [ ] Promote the best passing candidate to the current Master sheet.
- [ ] Do not allow a rejected or partial sheet to parent derivatives.
- [ ] Check all four sheets for cross-sheet identity consistency before Pack promotion.

### Yui recovery loop

- [ ] Keep all previous eight Yui candidates rejected.
- [ ] Read both Yui reject ledgers before regeneration.
- [ ] Treat previous failures as mandatory negative training evidence for the next prompt revision.
- [ ] Regenerate Sheet 01 without an intermediate Human gate.
- [ ] Require automatic structural QA pass before Sheet 02-04 begin.
- [ ] Never infer dominant hand from held items.
- [ ] Preserve anatomical right/left equipment rules.
- [ ] Preserve face/age/hair identity anchors across every view.

## 4. Core5 era / ordinary-life setting boards

- [ ] Use the ten existing editable board specs as starting authority.
- [ ] Run Codex professional review instead of Human pre-approval.
- [ ] Ensure era difference is systemic, not clothing-only.
- [ ] Keep population/household boards distinct from literal family portraits.
- [ ] Use all required population lenses.
- [ ] Resolve exact year only when needed and record it as an author decision.
- [ ] Resolve exact family facts only when needed and record them as author decisions.
- [ ] Do not let generated people create family Canon.
- [ ] Generate candidate evidence only after the board spec is production-complete.
- [ ] QA architecture, infrastructure, objects, behavior, materials, wear, and population cues.

## 5. Other Master families

### 朔夜座 8

- [ ] One stable Master identity per member.
- [ ] Preserve Current name `朔夜座`; do not re-promote legacy `八影/Yatsukage` naming.
- [ ] Lock silhouette, role, material language, and cross-member differentiation.
- [ ] Generate/QA/reject/regenerate until all eight Masters pass.

### Star Beasts 21

- [ ] Confirm Character/Star Beast authority before generation.
- [ ] Lock species/body topology before ornament.
- [ ] Keep constellation/history evidence separate from invented anatomy.
- [ ] Generate/QA/reject/regenerate until all 21 pass.

### Named Objects 21

- [ ] Lock object geometry before style/effects.
- [ ] Preserve handedness/body-side relationships where applicable.
- [ ] Record material, aging, repair, and scale.
- [ ] Generate/QA/reject/regenerate until all 21 pass.

### Enemy reference 48

- [ ] Normalize family taxonomy and silhouette grammar.
- [ ] Avoid accidental duplicate identities.
- [ ] Produce reference authority before gameplay variants.

### Locations 20

- [ ] Lock spatial identity and era/system evidence.
- [ ] Distinguish reusable location Master from stage-specific runtime crop/composition.

### 灯紋 21

- [ ] Keep as SVG/vector authority unless a raster derivative is explicitly required.
- [ ] Validate small-size readability and path integrity.

### Items 105 source rows

- [ ] Resolve the 11 same-character label collision groups by authority, not label equality.
- [ ] Determine physical sameness/evolution/replacement before collapsing rows.
- [ ] Preserve distinct IDs when continuity is unproven.

## 6. Guide DB / Lorebook

- [ ] Reuse approved Master references/crops/masks.
- [ ] Do not create independent duplicate Lorebook subject PNGs.
- [ ] Keep readable text as HTML/native text, not baked into raster.
- [ ] Show Current/Candidate/Open state.
- [ ] Show provenance and replacement history.
- [ ] Add Master completion, candidate, reject reason, retry count, current parent, and usage surfaces to the Production Control Center.
- [ ] Add next-Codex-target visibility.
- [ ] Add cross-search for characters, enemies, places, objects, terminology, and foreshadowing.

## 7. TOP / Loading / Key Art

- [ ] Review the four existing seasonal Loading assets before regenerating.
- [ ] Review existing TOP V3 candidate before adding new generation rows.
- [ ] Reuse TOP V2 semantic/layer sources where they remain useful.
- [ ] Treat runtime screenshots as evidence, never source generation rows.
- [ ] Admit a new Key Art only with an explicit asset ID, parent Masters, composition brief, and QA target.
- [ ] For multi-character vertical art, preserve readable face hierarchy and depth separation.
- [ ] Keep the project night/star/memory/travel identity; do not default to generic gacha spectacle.
- [ ] Do not generate or alter the logo in this loop.

## 8. Gameplay derivatives

Only after parent Masters pass:

- [ ] Normalize the 977 indexed contracts against Current authority.
- [ ] Remove duplicates and non-required outputs before generation.
- [ ] Confirm Character 180 contract admissions.
- [ ] Confirm Enemy 192 contract admissions.
- [ ] Confirm Item 525 contract admissions.
- [ ] Confirm Stage 80 contract admissions.
- [ ] Generate only admitted derivatives.
- [ ] Preserve parent Master ID and version in every derivative record.
- [ ] Validate silhouette/readability at actual runtime size.
- [ ] Validate transparency/crop/bleed where applicable.
- [ ] Validate that no derivative silently redesigns identity.

## 9. Runtime QA

- [ ] Build/run from the current head.
- [ ] Capture deterministic runtime screenshots for affected surfaces.
- [ ] Compare against the approved Master and composition target.
- [ ] Check face/silhouette readability at phone size.
- [ ] Check crop, safe area, overlap, text collision, and contrast.
- [ ] Check animation/effect layers do not hide identity-critical construction.
- [ ] Check Reduced Motion behavior where applicable.
- [ ] If runtime QA fails, return to the owning Master/derivative stage; do not patch around a bad source asset.

## 10. Final 100% gate

The final Human review must not be requested until all are true:

- [ ] Required settings are resolved or explicitly non-required with reason.
- [ ] All required Master specs are materialized.
- [ ] All required Master images pass QA.
- [ ] All Guide/Lorebook reuse surfaces are materialized.
- [ ] All admitted TOP/Loading/Key Art assets pass QA.
- [ ] All admitted gameplay derivatives pass QA.
- [ ] Runtime Visual QA passes on the current head.
- [ ] No rejected candidate is used as a parent.
- [ ] No unresolved duplicate/lineage conflict remains.
- [ ] Production registry and Control Center match repository truth.
- [ ] Required CI is green on the current head.
- [ ] The separately produced logo is integrated and passes final placement QA.
- [ ] Git has no duplicate open PR for the same work, no known unmerged work hidden by cleanup, and no stale production branch that still owns unique changes.

Only then:

- [ ] Set project status to `PROJECT_100_PERCENT_READY_FOR_FINAL_HUMAN_REVIEW`.
- [ ] Request the final Human review.
- [ ] If revisions are requested, return only failing items to the autonomous loop and preserve the review record.
