# Character Production Generation Entrypoint v8

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

Scope: all 36 characters.

## Purpose

Entrypoint v8 preserves the complete v7 lineage and adds one thin terminal personal-grooming/cosmetics lock.

Official chain:

`v1 resolved chain → v2 dressing → v3 long-wear → v4 operational access → v5 body-adornment topology → v6 accessory/prop inventory → v7 skin coverage/exposure → v8 personal grooming → candidate generation`

Official exporter:

`tools/asset-factory/scripts/export-personal-grooming-locked-character-design-prompt.ts`

Immediate wrapped exporter:

`tools/asset-factory/scripts/export-skin-coverage-locked-character-design-prompt.ts`

Parent policy:

`data/visual/character-production-generation-entrypoint-v7.json`

Terminal authority:

- `docs/visual/all-character-personal-grooming-cosmetics-fidelity-master-v1.md`
- `data/visual/all-character-personal-grooming-cosmetics-fidelity-master-v1.json`

## Hard boundary

- v7 and lower exporters are not final once v8 is active;
- hand-written prompts are not production-ready;
- generated output remains `CANDIDATE_REVIEW_REQUIRED`;
- generated cosmetics, nail treatment, facial-hair/body-hair state, grooming routine or inferred personal meaning never creates Canon;
- gender, age, ethnicity, role, rarity and exposure do not authorize grooming invention or removal;
- the full v7 → v6 → v5 → v4 → v3 → v2 → v1 lineage must survive unchanged into v8 output.

## Extensibility rule

Every new terminal layer wraps the previous official exporter and references the previous official policy through `basePolicy`.
