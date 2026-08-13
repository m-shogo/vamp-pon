# Character Production Generation Entrypoint v1

Status: `TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT`

## Purpose

There is exactly one production entrypoint for character-image prompt export:

`tools/asset-factory/scripts/export-production-character-design-prompt.ts`

Lower exporters remain implementation layers and QA dependencies. They are not the final production entrypoint.

## Required chain

The production exporter must call, in order through its wrapped chain:

1. base Character Asset prompt resolution
2. Professional Master governance
3. Visual Design Production Master
4. Living Visual Profile
5. Appearance / distinction authority
6. Era Life authority when applicable
7. World Material Translation
8. all-character Garment Production
9. all-character Night / Light Rendering
10. Core5 dedicated identity / color / garment authorities when applicable
11. all-character Identity Production
12. all-character Embodied Acting Production
13. Character Image Generation Readiness Master
14. Character Design Feedback Recurrence Master + ledger
15. this final production-entrypoint gate

## Production rule

Direct invocation of lower exporters is allowed for development diagnostics and their own CI only. It must not be labeled `productionImageGenerationEntrypoint=true`.

Only the final exporter may emit:

- `productionImageGenerationEntrypoint: true`
- `productionCharacterPromptReady: true`

## Fail closed

Production export is BLOCKED unless all of these are true:

- `feedbackRecurrenceGenerationEntrypoint === true`
- `imageGenerationReadinessState === READY_FOR_CANDIDATE_GENERATION`
- `imageGenerationReadinessFailures` is empty
- `generatedOutputState === CANDIDATE_REVIEW_REQUIRED`
- all image-model invention guards remain false
- generated image cannot create canon
- generated image cannot create feedback rules
- candidate review cannot automatically change generation

## No bypass by hand prompt

A hand-written prompt, UI text field, copied JSON fragment, or lower-level exporter output is not production-ready merely because it visually resembles the resolved prompt.

The production output must carry the full provenance chain and top-level production flags.

## Candidate boundary

`productionCharacterPromptReady=true` means only:

> the resolved design prompt is ready to request a candidate image.

It does not mean:

- final artwork approved
- Character Master approved
- commercial/legal similarity cleared
- runtime registration approved
- generated image becomes canon

All generated images still begin as `CANDIDATE_REVIEW_REQUIRED`.

## Operational command

```bash
node --experimental-strip-types tools/asset-factory/scripts/export-production-character-design-prompt.ts --character <id> --kind character_reference
```

Image generation tooling should consume this output, not lower exporter outputs.
