# Unity Asset Provider Plan 2026-06-30

## Purpose

`Resources/U5Candidates` proofからproduction asset loadingへ移れるように、U6ではAssetProvider層の責務を固定する。U6ではAddressablesを導入しない。

## Current State

- `Resources/U5Candidates` はproof-only。
- `U5VisualAssetLibrary` はproduction asset managerではない。
- U5素材8点はすべて `candidate`。
- `productionApproved=0`。
- `BattleVisualAssetSet` はBattleControllerへasset名を直書きしないための小さな受け渡し境界。

## Productionで必要な層

- AssetManifest
- AssetProvider
- BattleVisualAssetSet
- UIVisualAssetSet
- VfxVisualAssetSet
- FullscreenArtAssetSet

## Layer Responsibilities

`AssetManifest`:

- asset id, type, source, runtime path, approval status, atlas group, owner, QA resultを保持する。
- candidate / approved / rejectedを明確にする。

`AssetProvider`:

- runtime codeへSpriteやPrefabを渡す唯一の読み込み入口。
- `Resources`, Addressables, direct referencesの実装差を隠す。
- missing asset時はfallbackとdiagnosticを返す。

`BattleVisualAssetSet`:

- Battle gameplayが必要とする最小Sprite群だけを持つ。
- asset idやloading pathは持たない。

`UIVisualAssetSet`:

- Paper panel, button, icon frame, badgesなどUI Prefab向け素材を持つ。
- text-baked imageを許可しない。TMP前提。

`VfxVisualAssetSet`:

- hit, ink burst, collect trail, charge, rare pulseなどのeffect素材を持つ。
- pool cap and gameplay readabilityとセットで扱う。

`FullscreenArtAssetSet`:

- 黒耀化 / ultimate / Collection artをbattle spritesから分離する。
- UI text is layered in Unity, not baked into images.

## Candidate / Approved / Rejected

- `candidate`: runtime proofに使えるがproduction approvedではない。
- `approved`: visual art direction, alpha/edge QA, mobile readability, scale, owner, performanceを確認済み。
- `rejected`: runtimeから外すかreference専用へ戻す。

Candidate素材をproduction approved扱いしない。U5 assets remain candidate-only until the intake gate explicitly promotes them.

## Visual Art Direction Lockとの関係

AssetProviderは読み込みの入口であって、美術承認の代わりではない。`docs/unity-visual-art-direction-lock-2026-06-30.md` に対する人間レビューとmanifest statusが一致している素材だけをproduction setへ入れる。

## Addressablesを今すぐ導入しない理由

- U5Candidatesは8点だけで、proofとしては小さい。
- U6の目的はloading framework導入ではなく境界設計。
- Addressables導入はbuild profile, catalog, remote/local policy, QA手順を増やす。
- 今導入すると、candidate proofとproduction approvalの問題が混ざる。

## いつAddressables導入を検討するか

- approved assetsが増え、Resources管理がbuild sizeやmemoryで問題になった時。
- FullscreenArt / Collection / character sheets / enemies / UI atlasesの分類が固まった時。
- platform別texture compressionとdelivery policyを決める時。
- AssetProvider経由の呼び出しに揃ってから。

## Resourcesを増やしすぎないルール

- `Resources/U5Candidates` はproof-onlyのままにする。
- candidate proof以外のproduction素材を安易にResourcesへ追加しない。
- new runtime art must have manifest status, owner, atlas group, import plan, and review note.
- `U5VisualAssetLibrary` を拡張してgeneral loaderにしない。

## U6 Decision

U6ではAssetProviderを設計するだけで、本格実装、Addressables導入、production approval昇格、新規画像生成は行わない。
