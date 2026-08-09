# Claude → Codex Image Batch Handoff

Use this when the user is back at the Mac and wants to generate visual assets in one batch with low conversation-context overhead.

## Scope

Repository only:

`/Users/m-shogo/Developer/personal/vamp-pon`

GitHub only:

`m-shogo/vamp-pon`

Never touch another repository or project.

## Authority to read first

Read only what is needed for the active asset task:

1. `AGENTS.md`
2. `docs/visual-production-system.md`
3. `docs/agent-work/visual-asset-generation-queue.json`
4. task-specific contract referenced by the queue item
5. existing canonical character references / existing runtime assets named by that contract

Do not ingest the entire documentation tree unless a concrete conflict requires it.

## Claude role

Claude is the batch director/reviewer, not a second implementation owner.

For each queue item in priority order:

- confirm the queue item is still relevant against current HEAD
- turn its constraints into a compact generation brief
- tell Codex which existing repo references to load
- reject identity drift, generic AI composition, over-decoration, baked UI text, or a flattened-image-only solution
- keep feedback concise and asset-specific

Do not ask Codex to redesign unrelated screens while processing one item.

## Codex role

Codex is the production worker.

For each approved queue item:

1. generate or edit the required image assets using the image-generation skill
2. save generated files inside this repository under the task-specific generated/incoming path
3. preserve a canonical composition and required semantic layers
4. validate dimensions/alpha/file integrity as required by the task contract
5. connect assets to Unity only when the contract and runtime path are already defined
6. run relevant local checks/tests
7. commit the coherent unit of work
8. do not mark runtime/device/human-review evidence PASSED unless actually executed

If an asset is visually plausible but identity/crop/layer correctness is uncertain, save it as a candidate and leave approval false.

## Context-minimizing execution rule

Do not paste the history of PR #78 into each Codex request.

Use a small request such as:

> Read AGENTS.md, docs/visual-production-system.md, and docs/agent-work/visual-asset-generation-queue.json. Process the highest-priority READY_FOR_BATCH_GENERATION item that is not already completed at current HEAD. Read only its referenced contract and required character/art references. Generate the production assets, save them in-repo, validate them, connect the already-defined runtime path when safe, run checks, and commit. Do not touch other repos or promote unexecuted evidence.

After each completed item, update the queue item status and paths rather than expanding this handoff document.

## First batch order

1. `ART-P0-TOP-CORE5-V3`
2. `ART-P1-STAGESELECT-MAP`
3. `ART-P1-RESULT-MEMORY-REWARD`
4. `ART-P1-COLLECTION-MATERIAL`
5. `ART-P2-LEVELUP-CARDS`
6. `ART-P2-RARE-STATE-VFX`
7. `ART-P2-BATTLE-ENVIRONMENT-BANDS` only after reviewing current stage readability

Loading is not part of the initial regeneration batch because its four seasonal images already exist.

## TOP special boundary

TOP final generation must obey the existing Core5 and semantic-layer contracts. Do not use the current V2 bridge humans as identity references. The composition/mood can be used as a bridge, but final foreground humans must be exactly Yui / Asa / Nagi / Michiru / Tomori, plus the white small animal and small round robot.

The canonical final composite is not sufficient by itself. The semantic production layer pack must be generated and registered before final runtime approval can progress.

## Completion reporting

Report only:

- generated candidate paths
- semantic layer paths
- checks actually executed and results
- commit SHA
- remaining visual-review blockers

Do not restate the whole project history.
