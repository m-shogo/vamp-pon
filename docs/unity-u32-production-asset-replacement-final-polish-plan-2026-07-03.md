# Unity U32 Production Asset Replacement Final Polish Plan

## Scope

U32 hardens Stage1 asset boundaries, runtime asset replacement hooks, Sprite Atlas production packing evidence, and final visual consistency evidence. This is not production approval.

## Non-goals

- Do not set `productionApproved=1`.
- Do not treat unmeasured mobile metrics as measured.
- Do not paste generated final images, reference PNGs, or screenshots into Unity runtime.
- Do not reference `docs/design-targets/generated` from runtime assets, prefabs, scenes, or C#.
- Do not introduce Addressables.
- Do not introduce Cloud Save.
- Do not finalize production SE.
- Do not finalize production economy or balance.
- Do not move assets broadly or rewrite the asset pipeline.

## U32 Work

- Create a runtime asset inventory with production status and next action.
- Add asset boundary guard evidence and a U32 checker.
- Add Sprite Atlas production packing evidence without importing generated docs assets.
- Review texture/import safety without mass import setting changes.
- Add a light final visual consistency polish record.
- Add runtime asset replacement hook models for future production asset swaps.
- Re-evaluate `assetReplacementReady` while keeping `productionApproved=false`.

## Mobile Metrics

Mobile FPS, memory, thermal, GC, draw calls, audio latency, and haptic device behavior remain `NOT_MEASURED`. U32 cannot turn performance approval into a pass.

## Sprite Atlas Evidence

U32 will define atlas groups, included/excluded paths, filter/compression intent, and production packing status. If Unity `.spriteatlas` files are not created in this pass, the evidence remains a production packing map and `assetReplacementReady` stays false.

## Asset Replacement Readiness

`assetReplacementReady` can become true only if runtime inventory, boundary guard, and Sprite Atlas evidence are sufficient. Generated docs assets in runtime, final PNG direct paste, incomplete inventory, or incomplete packing evidence keep it false.

## U33 Handoff

U33 should harden Stage1 balance using measured play data and keep U31 tuning honest.

## U34 Handoff

U34 should run the release candidate checklist after mobile metrics, production assets, final SE, and final balance are addressed.
