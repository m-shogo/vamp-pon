# Character Production Generation Entrypoint v9

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

Scope: all 36 characters.

## Purpose

Entrypoint v9 preserves the complete v8 lineage and adds one thin terminal footwear/ground-interface lock.

Official chain:

`v1 resolved chain → v2 dressing → v3 long-wear → v4 operational access → v5 body-adornment topology → v6 accessory/prop inventory → v7 skin coverage/exposure → v8 personal grooming → v9 footwear/ground interface → candidate generation`

Official exporter:

`tools/asset-factory/scripts/export-footwear-ground-interface-locked-character-design-prompt.ts`

Immediate wrapped exporter:

`tools/asset-factory/scripts/export-personal-grooming-locked-character-design-prompt.ts`

Parent policy:

`data/visual/character-production-generation-entrypoint-v8.json`

Terminal authority:

- `docs/visual/all-character-footwear-ground-interface-fidelity-master-v1.md`
- `data/visual/all-character-footwear-ground-interface-fidelity-master-v1.json`

## Hard boundary

- v8 and lower exporters are not final once v9 is active;
- hand-written prompts are not production-ready;
- generated output remains `CANDIDATE_REVIEW_REQUIRED`;
- generated footwear class, heel, tread, closure, orthotic/support detail, seasonal replacement, wear history or barefoot ornament never creates Canon;
- source-backed barefoot/no-footwear remains authoritative and may not be filled with generic footwear;
- the full v8 → v7 → v6 → v5 → v4 → v3 → v2 → v1 authority lineage must survive unchanged into v9 output.

## Extensibility rule

Every new terminal layer wraps the previous official exporter and references the previous official policy through `basePolicy`.

A terminal layer may narrow image-model freedom but may not bypass, duplicate or partially reimplement inherited authority.
