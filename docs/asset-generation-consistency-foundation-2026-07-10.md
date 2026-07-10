# Asset Generation Consistency Foundation

Date: 2026-07-10

## Purpose

生成画像の別人化、別画風化、palette drift、追跡不能、candidateのruntime混入を防ぐため、Prompt Catalogの上にContract / Golden Reference / Lineage / QA / Approval Boundaryを追加した。

## Added

- `src/game/data/assetGenerationPolicy.ts`
- `src/game/data/goldenReferenceRegistry.ts`
- `src/game/data/assetGenerationPolicy.test.ts`
- `scripts/asset-factory/export-generation-contracts.ts`
- `scripts/asset-factory/create-lineage-record.ts`
- `scripts/quality/check-asset-generation-consistency.ts`
- `data/asset-factory/generation-lineage.template.json`
- `data/asset-factory/golden-reference-registry.json`
- `docs/asset-generation-consistency-system-v1.md`
- `docs/design-targets/generated/asset-generation-consistency/readiness.json`

## Updated

- `tools/asset-factory/src/types.ts`
- `package.json`
- `README.md`
- `docs/181-current-production-canon.md`
- `docs/185-asset-factory-catalog.md`

## Safety boundaries

```txt
candidateCount=4
oneShotFinalForbidden=true
approvedAsFinalDefault=false
runtimeApprovedDefault=false
finalRequiresGoldenReference=true
finalRequiresLineageManifest=true
finalRequiresQaPass=true
```

Lineage CLIはfinal/runtime承認を行わない。作成直後は必ずcandidateかつfinal block状態になる。

## Golden Reference

登録済み:

- global visual style v1
- U45 StageSelect candidate reference
- U45 Battle HUD candidate reference
- U45 LevelUp common / rare / evolution candidate references

未完了:

- Core5 identity Golden Reference
- 48敵 identity Golden Reference
- アイテムidentity Golden Reference
- 20ステージidentity Golden Reference

未登録でもcandidate生成は可能だが、final/runtime採用は不可。

## Asset Factory issues

追加した事故分類:

```txt
identity-drift
proportion-drift
palette-drift
reference-missing
prompt-lineage-missing
unapproved-runtime-use
```

Generation tracking fields:

```txt
promptCatalogKey
contractId
contractVersion
promptHash
generator
generatorVersion
referenceSetIds
lineageManifestPath
comparisonSheetPath
automaticQaPassed
humanReviewPassed
approvedAsFinal
runtimeApproved
```

## Commands

```sh
pnpm asset-factory:contracts:export
pnpm asset-factory:lineage:create -- --key <catalog-key> --output <png> --generator <name> --generator-version <version>
pnpm asset-generation:check
pnpm assets:verify
pnpm test
pnpm build
```

## Verification boundary

GitHub上へsource、docs、JSON snapshot、test、checkerを追加済み。

この接続環境ではユーザーのMac上のNode/Unityを実行していないため、以下は未実行のまま記録する。

```txt
staticCheckerExecutedAfterCommit=false
unitTestExecutedAfterCommit=false
contractsExportExecutedAfterCommit=false
```

次回Mac側で上記commandを実行し、結果に応じてreadiness evidenceを更新する。

## Not approved

```txt
allIdentityGoldenReferencesRegistered=false
comparisonSheetAutomationReady=false
visualSimilarityAutomationReady=false
legacyAssetLineageBackfillReady=false
generatedAssetApprovedAsFinal=false
generatedAssetRuntimeApproved=false
candidateAssetsApprovedAsFinal=false
rcReady=false
productionApproved=false
```
