# Character Production Generation Entrypoint v7

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

Scope: all 36 characters.

## Purpose

Entrypoint v7 preserves the complete v6 lineage and adds one thin terminal skin-coverage/exposure-boundary lock.

Official chain:

`v1 resolved chain → v2 dressing → v3 long-wear → v4 operational access → v5 body-adornment topology → v6 accessory/prop inventory → v7 skin coverage/exposure → candidate generation`

Official exporter:

`tools/asset-factory/scripts/export-skin-coverage-locked-character-design-prompt.ts`

Immediate wrapped exporter:

`tools/asset-factory/scripts/export-accessory-prop-inventory-locked-character-design-prompt.ts`

Parent policy:

`data/visual/character-production-generation-entrypoint-v6.json`

Terminal authority:

- `docs/visual/all-character-skin-coverage-exposure-boundary-fidelity-master-v1.md`
- `data/visual/all-character-skin-coverage-exposure-boundary-fidelity-master-v1.json`

## Hard boundary

- v6 and lower exporters are not final once v7 is active;
- hand-written prompts are not production-ready;
- generated output remains `CANDIDATE_REVIEW_REQUIRED`;
- generated exposure, added coverage, underlayers, opened/rolled states and inferred coverage meaning never create Canon;
- pose, weather, damage, premium status and image composition may not alter authored coverage without explicit delta;
- the full v6 → v5 → v4 → v3 → v2 → v1 authority lineage must survive unchanged into v7 output.

## Extensibility rule

Every new terminal layer wraps the previous official exporter and references the previous official policy through `basePolicy`.
