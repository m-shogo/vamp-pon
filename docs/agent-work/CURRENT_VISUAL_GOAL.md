# Current Visual Goal

Scope: `m-shogo/vamp-pon` only.

Current PR: `#78` / `agent/top-living-night-key-art-v1` / keep Draft.

## Goal

Finish the player-facing visual system as a coherent mobile game, not as isolated generated screenshots.

- TOP = quiet living night / semantic 2.5D / long-lived asynchronous atmosphere
- Loading = seasonal travel / lightweight transition
- StageSelect = destination anticipation / selected-state focus
- Collection = tactile archive / quiet scanability
- Result = staged payoff / no permanent celebration loop
- LevelUp = fast choice clarity / selected + rarity response
- Battle = gameplay readability / short event-driven VFX
- rare states = bounded high-impact shader/VFX

Authority: `docs/visual-production-system.md`.

## Implement now without waiting for images

- runtime motion and Reduced Motion
- UI hierarchy and readability
- lifecycle / re-entry / cleanup
- transition behavior
- event-driven reveal/focus
- optional asset-provider fallback boundaries
- code defects discovered while polishing visuals

Do not spend cycles adding static checkers unless they protect an actual production boundary.

## Deferred image generation

Generate in one local batch later. Authority/order:

`docs/agent-work/visual-asset-generation-queue.json`

Claude → Codex low-context handoff:

`docs/agent-work/claude-to-codex-image-batch-handoff.md`

TOP is P0. StageSelect / Result / Collection are P1. LevelUp / rare-state VFX are P2. Battle art requires readability review first. Loading is not currently scheduled for regeneration.

Optional next-batch runtime sprites land under:

`Assets/Resources/VisualBatchV1/UI/`

via `VisualBatchAssetProvider`; missing sprites must preserve current fallback visuals.

## Honesty boundary

Do not promote current final TOP, V3 Unity, 15-frame capture, motion review, Simulator, or physical iPhone evidence unless actually executed. GitHub/static green is not runtime proof.

Do not touch PR #76, U49 readiness, gameplay balance, save schema, or unrelated canon.
