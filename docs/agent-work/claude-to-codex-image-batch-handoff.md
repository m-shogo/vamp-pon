# Claude → Codex Image Batch Handoff

Use this when the user wants to generate visual assets in one batch with low conversation-context overhead.

## Scope

Repository only:

`/Users/m-shogo/Developer/personal/vamp-pon`

GitHub only:

`m-shogo/vamp-pon`

Never touch another repository or project.

## Preflight before any generation

1. Re-fetch current Git state. The 2026-08-09 cleanup reached `origin/main` only, but this is an observed state, not a permanent assumption. If another remote branch or open PR exists at execution time, inspect it before generating or deleting anything.
2. Use current `main`; do not revive PR #78/#79 integration branches as authority.
3. Read the current queue and task contract before choosing outputs.
4. Do not start a new image pass if the same queue item is already completed or has a newer candidate at current HEAD.
5. Static/Git green does not promote final/runtime/device evidence.

## Authority to read first

Read only what is needed for the active asset task:

1. `AGENTS.md`
2. `docs/visual-production-system.md`
3. `docs/agent-work/visual-asset-generation-queue.json`
4. task-specific contract referenced by the queue item
5. existing canonical character references / existing runtime assets named by that contract

For `ART-P0-TOP-CORE5-V3`, also read:

- `docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json`
- `docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json`
- `docs/design-targets/generated/top-living-night-v3/layered-final-production-contract.md`
- `docs/design-targets/generated/top-living-night-v3/final-effect-companion-brief.md`

Do not ingest the entire documentation tree unless a concrete conflict requires it.

## CLI / model selection rule

Do not leave a large production task on `Auto` by default.

At execution time:

1. inspect the models actually available in the installed Claude/Codex CLI versions
2. explicitly select the strongest suitable reasoning model for identity-sensitive art direction, architecture, conflict resolution, or deep review
3. use faster/lower-context models only for mechanical image post-processing, file validation, naming, or deterministic checks when appropriate
4. do not hard-code a model name from an old handoff; availability changes
5. record the selected model only in the execution log/commit context when useful, not as a permanent project requirement

Avoid one giant `claude -p --max-turns 80` style run. A previous large task stopped with `Reached max turns (80)`.

Split substantial work into bounded phases, for example:

- Phase A — canonical composite + identity review
- Phase B — semantic structural/effect extraction from the locked composite
- Phase C — post-processing / alpha / dimensions / naming
- Phase D — registration / tests / commit

Prefer interactive mode for long work when practical. For long CLI prompts use a here-doc rather than fragile double-quoted inline text.

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

1. generate or edit the required image assets using the available image-generation capability
2. save generated files inside this repository under the task-specific generated/incoming path
3. preserve a canonical composition and required semantic layers
4. validate dimensions/alpha/file integrity as required by the task contract
5. connect assets to Unity only when the contract and runtime path are already defined
6. run relevant local checks/tests
7. commit the coherent unit of work
8. do not mark runtime/device/human-review evidence PASSED unless actually executed

If an asset is visually plausible but identity/crop/layer correctness is uncertain, save it as a candidate and leave approval false.

## P0 TOP completion gate — 17 generated artifacts

`ART-P0-TOP-CORE5-V3` is **not complete** after only the canonical composite or only the six structural runtime layers.

One locked 430x932 generation family must yield **17 artifacts total** before the generation batch itself can be called complete:

### Canonical candidate — 1

- `top-living-night-core5-candidate-430x932.png`

### Structural semantic layers — 6

- `00-environment-base.png`
- `04-distant-town.png`
- `06-core5.png`
- `07-animal-robot.png`
- `09-fire-base.png`
- `15-foreground-accents.png`

### Effect companion assets — 10

- `01-stars.png`
- `02-clouds-far.png`
- `03-clouds-near.png`
- `05-distant-lights-mask.png`
- `08-robot-eye-mask.png`
- `10-fire-flipbook-atlas.png`
- `11-fire-glow-mask.png`
- `12-smoke-atlas.png`
- `13-embers-atlas.png`
- `14-lantern-glow-mask.png`

The six-layer `semanticLayerRuntime.requiredLayers` in `final-generation-bundle.json` is the structural runtime registration subset, **not the full image-generation completion list**. The ten effect companion assets remain mandatory for the P0 generation family.

All 17 outputs must derive from the same locked Core5 identity set and the same canonical composition/material language. Do not independently regenerate the effect assets in a style that merely looks similar.

The 390x844 and 360x800 variants are derived crops/registered crops from the same master family; they are not independent re-generations and do not change the 17-artifact master count above.

## Context-minimizing execution rule

Do not paste the history of PR #78 into each Codex request.

Use a small request such as:

> Read AGENTS.md, docs/visual-production-system.md, and docs/agent-work/visual-asset-generation-queue.json. Process the highest-priority READY_FOR_BATCH_GENERATION item that is not already completed at current HEAD. Read only its referenced contract and required character/art references. Generate the production candidates, save them in-repo, validate them, connect only already-defined runtime paths when safe, run checks, and commit. Do not touch other repos or promote unexecuted evidence. For ART-P0-TOP-CORE5-V3, do not stop before the 1 canonical candidate + 6 structural layers + 10 effect companion assets are present as one registered visual family.

After each completed item, update the queue item status and paths rather than expanding this handoff document.

## First batch order

1. `ART-P0-TOP-CORE5-V3`
2. `ART-P1-STAGESELECT-MAP`
3. `ART-P1-RESULT-MEMORY-REWARD`
4. `ART-P1-COLLECTION-MATERIAL`
5. `ART-P2-LEVELUP-CARDS`
6. `ART-P2-BATTLE-HUD-MATERIAL`
7. `ART-P2-RARE-STATE-VFX`
8. `ART-P2-BATTLE-ENVIRONMENT-BANDS` only after reviewing current stage readability

Loading is not part of the initial regeneration batch because its four seasonal images already exist.

## TOP special boundary

TOP final generation must obey the existing Core5 and semantic-layer contracts. Do not use the current V2 bridge humans as identity references. The composition/mood can be used as a bridge, but final foreground humans must be exactly Yui / Asa / Nagi / Michiru / Tomori, plus the white small animal and small round robot.

The canonical final composite is not sufficient by itself. Generate the six structural semantic layers **and** the effect companion assets from the same locked final composition/material language. Existing V2 clouds/fire/smoke/light masks are temporary fallbacks unless the final comparison explicitly proves they still match. The semantic production layer pack must be registered before final runtime approval can progress.

## Completion reporting

Report only:

- generated candidate paths
- structural/effect layer paths
- checks actually executed and results
- commit SHA
- remaining visual-review blockers

Do not restate the whole project history.