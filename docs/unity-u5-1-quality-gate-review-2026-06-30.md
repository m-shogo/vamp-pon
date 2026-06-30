# Unity U5.1 Quality Gate / Architecture Hardening Review 2026-06-30

## Summary

U5.1は新規画像生成なし。U5 commit `cf56ad25eda5808d22a7457a52c9212b5169c1dd` のvisual candidateを、pro品質へ進める前の品質ゲートとして整備した。

## Added Gate Set

Rule docs:

- `docs/unity-asset-intake-gate-2026-06-30.md`
- `docs/unity-sprite-import-policy-2026-06-30.md`
- `docs/unity-real-device-test-checklist-2026-06-30.md`

Manifest:

- `docs/design-targets/generated/unity-u5/u5-visual-candidate-manifest.json`

Automated checks:

- `scripts/quality/check-unity-asset-intake.ts`
- `scripts/quality/check-unity-meta-guids.ts`
- `pnpm unity:asset-intake:check`
- `pnpm unity:meta:check`

## U5 Commit Review

確認結果:

- small batch: 8点のみでOK
- greenback source / alpha output: 8点すべて対応あり
- alpha report: `greenSpillRemainingPixels=0` / `edgeTouches=false`
- runtime import: `Assets/_Project/Resources/U5Candidates/` 以下に集約
- U4 UI構造: PaperCard / PaperButton / IconFrameの部品素材適用のみ
- text-baked UI貼り付け: なし
- Web素材の単純移植: なし
- U2BattleControllerにカードUI生成: なし

## Meta GUID Check

Initial manual check:

```txt
meta_with_guid=127
duplicate_guid_count=0
```

U5 commitでは `U5Candidates.meta` と `U5Candidates/Battle.meta` が削除済みTMP SDF metaのGUIDを流用していたため、U5.1で新規GUIDへ振り直した。

Final automated result:

```txt
pnpm unity:meta:check
unity meta guid check passed: 127 meta guid(s), 127 unique guid(s)
```

## Asset Intake Manifest

Manifest対象数:

```txt
8
```

Runtime included:

```txt
8
```

Production approved:

```txt
0
```

全素材は `productionStatus: candidate`。

Final automated result:

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

Green spill / edge touch:

- `greenSpillRemainingPixels`: 8点すべて `0`
- `edgeTouches`: 8点すべて `false`

## Resources Policy

`Resources/U5Candidates` はU5 proof-only。

- production approved素材の置き場ではない
- `U5VisualAssetLibrary` は本番asset managerではない
- 今回Addressablesは導入しない
- 将来はAssetProvider / manifest-driven loading / Addressablesを比較検討

## BattleController Dependency

U5では `U2BattleController` が `U5VisualAssetLibrary.Load...` を直接呼んでいた。

U5.1で最小整理:

- `BattleVisualAssetSet` を追加
- `U1Stage1SceneBootstrap` がU5 proof visual setを作成
- `U2BattleController.Initialize(..., BattleVisualAssetSet visualAssets = null)` に渡す
- BattleControllerからU5 asset名の直書きを外した
- UI生成は引き続き混ぜていない

## TMP Font Policy

U5で静的TMP SDF assetがEditor終了時に例外を出していたため、TTFからruntime TMP FontAssetを作るfallbackにしていた。

U5.1で最小整理:

- `LoadJapaneseFont()` にstatic cacheを追加
- runtime generated TMP FontAssetを毎回作らない
- productionではDynamic SDF / static atlas / subset文字 / atlas sizeを再設計する
- 既存Zen Maru Gothic TTFとlicenseは維持

## LevelUp Text Crowding

U5 reviewで残っていたカード説明文の縦詰まりを最小調整。

- card height: `148` -> `156`
- spacing: `12` -> `10`
- icon/type/name/descの縦位置を再配分
- desc font size: `12` -> `11`
- desc area: `48` -> `60`

U4 LevelUp UI構造は維持。

## Verification

実行済み:

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

```txt
pnpm unity:meta:check
unity meta guid check passed: 127 meta guid(s), 127 unique guid(s)
```

```txt
U5 Visual Candidate Verification
Unity: 6000.5.1f1
RenderPipelineAsset: U1UniversalRenderPipelineAsset
AssetsLoaded: yui=True, ombu=True, exp=True, spark=True, ink=True, trail=True, paper=True, iconFrame=True
RuntimeSprites: yui=u5-yui-battle-candidate, firstOmbu=u5-ombu-battle-candidate
Movement: moved=True
Battle: spawned=7, fired=11, defeated=3, droppedExp=3, collectedExp=3
Feel: hitStop=11, cameraImpulse=3, lanternPulse=14, deathBurst=3, collectTrail=3
VFX: peak=10, played=38, dropped=0, maxActiveCap=18
LevelUpOverlay: activeBeforeRestore=True
TimeScale: beforeRestore=0, paused=True
390x844: canvas=True, safeHud=True, backgroundCover=True
360x800: canvas=True, safeHud=True, backgroundCover=True
430x932: canvas=True, safeHud=True, backgroundCover=True
```

```txt
U4 LevelUp UI Verification
Unity: 6000.5.1f1
ProjectVersion: OK
ZenMaruGothic font: found
Font license: found
U4 scripts: OK
Card UI in BattleController: clean
LevelUp data in BattleController: clean
TimeScale guard: OK
dawn_ticket in candidates: clean
```

U5 screenshots were regenerated after the LevelUp spacing adjustment:

- `u5-battle-390x844.png`
- `u5-battle-360x800.png`
- `u5-battle-430x932.png`
- `u5-vfx-proof-390x844.png`
- `u5-levelup-390x844.png`

Console compile/runtime error:

```txt
none observed in the U5/U4 verification logs and screenshot capture log
```

`Time.timeScale` is intentionally paused while the LevelUp overlay is open in the verification report. The verification flow calls `U4TimeScaleGuard.ForceRestore()` after report creation, and subsequent screenshot capture / verification did not show a stuck paused state.

## Remaining Concerns

- U5 assets are still candidate-only.
- Runtime PNGs are not production cropped/optimized.
- Sprite Atlas is planned but not introduced.
- `Resources/U5Candidates` remains proof-only.
- Real device checks are documented but not yet executed.
- LevelUp layout is improved, but final card typography still needs production UI pass.

## Next

- Decide whether U5 candidates are visually worth direct edit, regeneration, or rejection.
- Start production asset provider design before asset scale grows.
- Run real device checklist before U6 production-facing decisions.

## Git

- U5.1 commit hash: final completion reportに記載
- `git status --short`: final completion reportに記載
