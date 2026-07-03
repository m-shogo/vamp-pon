# Unity U36 Runtime Reference Safety Check

## Checks

- `docs/design-targets/generated` is not referenced from runtime scripts.
- generated final PNG is not pasted into runtime.
- Atlas targets are limited to Unity project resource candidates under `Assets/_Project/Resources`.
- `public/assets/prototypes` is excluded from Atlas.
- fullscreen review art is excluded from Atlas.
- draft SE remains draft and is not final SE.
- Addressables not introduced.
- Cloud Save not introduced.
- productionApproved remains false.

## assetReplacementReady Basis

Sprite Atlas production packing is complete for U36 candidate groups, but final production art replacement and mobile metrics are not complete. Therefore `assetReplacementReady=false` remains the conservative verdict.
