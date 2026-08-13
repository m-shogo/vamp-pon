# Character Production Generation Entrypoint v3

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

Scope: all 36 characters.

## Purpose

Entrypoint v3 preserves the full v2 production chain and adds one thin terminal long-wear/lived-use lock.

Official chain:

`v1 resolved production chain → v2 dressing/wearability wrapper → v3 long-wear comfort wrapper → candidate generation`

Official exporter:

`tools/asset-factory/scripts/export-long-wear-comfort-locked-character-design-prompt.ts`

Immediate wrapped exporter:

`tools/asset-factory/scripts/export-dressing-workflow-locked-character-design-prompt.ts`

Parent policy:

`data/visual/character-production-generation-entrypoint-v2.json`

Terminal long-wear authority:

- `docs/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.md`
- `data/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.json`

## Hard boundary

- parent/lower exporter output is not final once v3 is active;
- hand-written prompts are not production-ready;
- generated output remains `CANDIDATE_REVIEW_REQUIRED`;
- generated art, generated dressing workflow and generated long-wear behavior do not create Canon;
- no medical, sensory, pain, thermal-sensitivity or accommodation facts may be created from clothing mechanics;
- the complete parent authority order must survive into the v3 output.

## Extensibility rule

Entrypoint versions are thin terminal wrappers. A new terminal layer must wrap the previous official exporter instead of duplicating or rewriting the complete lower production chain.

The checker must validate the full parent-policy lineage before accepting a new official entrypoint.
