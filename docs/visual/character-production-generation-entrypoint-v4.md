# Character Production Generation Entrypoint v4

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

Scope: all 36 characters.

## Purpose

Entrypoint v4 preserves the complete v3 lineage and adds one thin terminal operational-access/serviceability lock.

Official chain:

`v1 resolved production chain → v2 dressing/wearability → v3 long-wear/lived-use → v4 operational access/serviceability → candidate generation`

Official exporter:

`tools/asset-factory/scripts/export-operational-access-locked-character-design-prompt.ts`

Immediate wrapped exporter:

`tools/asset-factory/scripts/export-long-wear-comfort-locked-character-design-prompt.ts`

Parent policy:

`data/visual/character-production-generation-entrypoint-v3.json`

Terminal authority:

- `docs/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.md`
- `data/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.json`

## Hard boundary

- parent/lower exporters are not final once v4 is active;
- hand-written prompts are not production-ready;
- generated output remains `CANDIDATE_REVIEW_REQUIRED`;
- generated operational methods and service methods never create Canon;
- handedness, dexterity impairment, helper use, adaptive mechanisms, caregiver routines and maintenance personality may not be inferred from operational difficulty;
- the full v3 → v2 → v1 authority lineage must survive unchanged into v4 output.

## Extensibility rule

Every new terminal layer wraps the prior official exporter and references the prior official policy through `basePolicy`.

No terminal layer may fork, copy or partially reimplement the inherited production chain.
