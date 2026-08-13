# Character Production Generation Entrypoint v6

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

Scope: all 36 characters.

## Purpose

Entrypoint v6 preserves the complete v5 lineage and adds one thin terminal accessory/prop inventory state-transition lock.

Official chain:

`v1 resolved chain → v2 dressing → v3 long-wear → v4 operational access → v5 body-adornment topology → v6 accessory/prop inventory → candidate generation`

Official exporter:

`tools/asset-factory/scripts/export-accessory-prop-inventory-locked-character-design-prompt.ts`

Immediate wrapped exporter:

`tools/asset-factory/scripts/export-body-adornment-topology-locked-character-design-prompt.ts`

Parent policy:

`data/visual/character-production-generation-entrypoint-v5.json`

Terminal authority:

- `docs/visual/all-character-accessory-prop-inventory-transition-fidelity-master-v1.md`
- `data/visual/all-character-accessory-prop-inventory-transition-fidelity-master-v1.json`

## Hard boundary

- v5 and lower exporters are not final once v6 is active;
- hand-written prompts are not production-ready;
- generated output remains `CANDIDATE_REVIEW_REQUIRED`;
- generated accessory inventory, prop ownership, object state, gift meaning, relationship meaning, storage route or temporary placement never creates Canon;
- unsupported removable objects may not be created by the image model;
- the full v5 → v4 → v3 → v2 → v1 authority lineage must survive unchanged into v6 output.

## Separation rule

Body-attached features remain governed by Body Adornment Topology. v6 governs discrete removable objects and their state/location transitions. A removable object may not be silently converted into a body modification, and a body-attached feature may not be treated as removable inventory without explicit authority.

## Extensibility rule

Every new terminal layer wraps the previous official exporter and references the previous official policy through `basePolicy`.
