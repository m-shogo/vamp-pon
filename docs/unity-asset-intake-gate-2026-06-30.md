# Unity Asset Intake Gate 2026-06-30

## Purpose

Unity runtimeへ画像素材を入れる前に、素材が「候補」「承認済み」「却下」のどれかを明確にし、greenback source、alpha output、runtime import、検証結果を追跡できるようにする。

このgateは読むだけのルールではない。U5以降は以下を揃える。

1. rule doc
2. manifest
3. automated checker

U5 checker:

```sh
pnpm unity:asset-intake:check
```

## Status

Allowed production status:

- `candidate`: runtime proofに入れてよいがproduction approvedではない
- `approved`: production素材として採用済み
- `rejected`: runtimeから外すか、参照だけに戻す

U5Candidatesは全て `candidate`。

## Required Metadata

Manifest item must include:

- `id`
- `type`
- `sourceGreenback`
- `alphaOutput`
- `runtimePath`
- `width`
- `height`
- `opaqueBounds`
- `greenSpillRemainingPixels`
- `edgeTouches`
- `intendedUse`
- `runtimeIncluded`
- `productionStatus`
- `textBakedRuntimeImage`
- `notes`

Design / production notes should also track:

- source prompt or generation note
- PPU plan
- pivot plan
- sorting layer plan
- atlas group
- prefab / runtime owner
- approval reviewer and date when promoted

## File Relationship

For transparent candidates:

```txt
greenback source -> alpha output -> Unity runtime import
```

Example:

```txt
docs/design-targets/generated/unity-u5/greenback/u5-yui-battle-candidate-greenback.png
docs/design-targets/generated/unity-u5/alpha/u5-yui-battle-candidate-greenback-alpha.png
unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png
```

## Required Checks

Before runtime import:

- manifest JSON is valid
- source file exists
- alpha file exists
- runtime file exists when `runtimeIncluded=true`
- `greenSpillRemainingPixels=0`
- `edgeTouches=false`
- real alpha channel
- no green fringe
- no text baked into runtime image
- no watermark
- no use of retired `public/assets/sprites/`
- image is readable at gameplay/UI size
- U5Candidates runtime files are all represented in manifest

## U5 Proof-Only Resources

`Resources/U5Candidates` is proof-only.

It is allowed for U5/U5.1 because:

- the set is small
- the assets are candidate-only
- the goal is runtime proof, not production asset architecture

Production direction:

- do not grow `Resources` into a general asset folder
- do not treat `U5VisualAssetLibrary` as the production asset manager
- later evaluate AssetProvider / manifest-driven loading / Addressables
- do not introduce Addressables during U5.1

## Production Approval Conditions

An asset can become `approved` only after:

- art direction review passes against current visual target
- alpha and edge QA pass
- runtime scale / PPU / pivot are validated in gameplay or UI
- mobile portrait readability passes at 390x844, 360x800, 430x932
- memory/texture size is acceptable
- no text-baked runtime image
- no Web/prototype copy pretending to be Unity production
- asset has a stable runtime owner
- manifest is updated and checker passes

## Candidate Runtime Proof Rules

Candidate assets may be used in runtime proof when:

- manifest marks them as `candidate`
- review doc states they are not production approved
- runtime usage is small and reversible
- no dependency is introduced that blocks future asset provider work

U5 satisfies this as a visual candidate pass only.
