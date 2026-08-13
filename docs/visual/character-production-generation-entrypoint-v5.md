# Character Production Generation Entrypoint v5

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

Scope: all 36 characters.

## Purpose

Entrypoint v5 preserves the complete v4 lineage and adds one thin terminal body-adornment/marking topology lock.

Official chain:

`v1 resolved chain → v2 dressing → v3 long-wear → v4 operational access → v5 body-adornment topology → candidate generation`

Official exporter:

`tools/asset-factory/scripts/export-body-adornment-topology-locked-character-design-prompt.ts`

Immediate wrapped exporter:

`tools/asset-factory/scripts/export-operational-access-locked-character-design-prompt.ts`

Parent policy:

`data/visual/character-production-generation-entrypoint-v4.json`

Terminal authority:

- `docs/visual/all-character-body-adornment-marking-topology-fidelity-master-v1.md`
- `data/visual/all-character-body-adornment-marking-topology-fidelity-master-v1.json`

## Hard boundary

- v4 and lower exporters are not final once v5 is active;
- hand-written prompts are not production-ready;
- generated output remains `CANDIDATE_REVIEW_REQUIRED`;
- generated piercing sites, jewelry inventory, tattoos, scars, birthmarks, body paint, symbolic meaning, cultural meaning or relationship evidence never create Canon;
- unsupported body-attached features may not be added by the image model;
- the full v4 → v3 → v2 → v1 authority lineage must survive unchanged into v5 output.

## Extensibility rule

Every new terminal layer wraps the previous official exporter and references the previous official policy through `basePolicy`.

A new layer may narrow model freedom but may not rewrite or bypass inherited authority.
