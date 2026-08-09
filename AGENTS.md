# AGENTS.md

Repository scope:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

Do not modify any other repository.

## Mandatory current entry

Before any large Unity implementation, read:

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/181-current-production-canon.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
docs/visual-production-system.md
```

Historical U0-U43 documents are evidence/history, not standalone current instructions.

Required static preflight before a large phase:

```sh
pnpm implementation:preflight:check
```

Required full preflight before declaring a large phase complete:

```sh
pnpm implementation:preflight:full
```

Do not claim these commands ran when working only through GitHub connector access.

## Current phase order

```txt
Completed: U45.1 Character and Enemy Dot Runtime Pass
Completed: U45.1 Hardening
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Current: U47 gameplay data/runtime
```

Preserve the completed U45.1 provider, animation, pause, and candidate/final boundaries during U46 work.

## Engineering

- Keep Stage1 playable on portrait mobile.
- Preserve gameplay constants unless the task explicitly changes gameplay.
- Prefer the smallest coherent change.
- Do not mass-rewrite transitional classes without a phase need.
- Run relevant checks, commit, and push completed work.
- Never call an image or implementation final without comparison to current in-repo baseline.
- Never promote readiness by editing evidence alone.

## Professional visual production rule

Source of truth:

```txt
docs/visual-production-system.md
```

This applies to TOP and every other player-facing screen. Do not wait for the user to repeat it.

- choose the rendering/animation technique from the screen's purpose, not from whatever older implementation already exists
- before a substantial visual pass, verify current Unity/mobile production guidance when the technique or performance tradeoff may have changed
- prefer semantic scene layers, registered alpha assets, local shaders/VFX, and event-driven motion over a flattened full-screen image when independent depth/light/motion matters
- do not force the TOP solution onto every screen: Battle prioritizes readability, Result prioritizes staged reward reveal, Collection prioritizes material/paper tactility, Loading prioritizes fast lightweight transition
- preserve an approved composite as art-direction authority while runtime uses a small meaningful layer pack when depth or local motion is required
- do not explode scenes into dozens of textures; atlas/share materials where practical and measure mobile cost
- Reduced Motion is a live runtime behavior, not a separate rebuilt screen
- a final visual may not silently fall back to a weaker flattened representation when its production contract requires semantic layers

### Visual continuation with low context

For the current visual implementation direction, read this compact entrypoint before pulling in more historical documents:

```txt
docs/agent-work/CURRENT_VISUAL_GOAL.md
```

### Deferred image-generation batch

When image generation is intentionally deferred while runtime implementation continues, record required assets here instead of relying on conversation memory:

```txt
docs/agent-work/visual-asset-generation-queue.json
docs/agent-work/claude-to-codex-image-batch-handoff.md
```

The queue is the priority/source-of-truth for which visually weak screens should receive generated assets. Do not regenerate screens listed under `doNotGenerateYet` without a new visual review. Claude may direct the batch, while Codex is the production worker that generates/saves assets and connects already-defined runtime paths. Keep requests small by reading only the active queue item, its referenced production contract, and required visual/character references.
