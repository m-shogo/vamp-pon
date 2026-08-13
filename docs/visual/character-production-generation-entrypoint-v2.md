# Character Production Generation Entrypoint v2

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

Scope: all 36 characters.

## Purpose

This v2 entrypoint keeps the complete v1 production authority chain intact and adds a thin terminal wearability lock above it.

The v1 exporter remains a required resolved lower chain. It is not a standalone final output once v2 is active.

Official chain:

`v1 full production exporter → Don / Doff / Dressing Workflow terminal wrapper → candidate generation`

Official exporter:

`tools/asset-factory/scripts/export-dressing-workflow-locked-character-design-prompt.ts`

Base exporter:

`tools/asset-factory/scripts/export-face-skull-landmark-locked-character-design-prompt.ts`

Base policy:

`data/visual/character-production-generation-entrypoint-v1.json`

Terminal dressing authority:

- `docs/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.md`
- `data/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.json`

## Hard boundary

- lower exporter output is not final production-ready by itself;
- hand-written prompts are not production-ready;
- generated images do not create Canon;
- generated images do not create feedback rules automatically;
- generated dressing workflow does not create Canon;
- `OPEN` remains source-constrained, not model freedom;
- every final candidate must carry the complete inherited v1 authority order plus the dressing workflow authority.

## Promotion boundary

The entrypoint authorizes candidate generation only.

Generated output remains:

`CANDIDATE_REVIEW_REQUIRED`

Human review remains required for Master/final/runtime promotion.
