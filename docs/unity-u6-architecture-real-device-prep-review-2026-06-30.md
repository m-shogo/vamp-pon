# Unity U6 Architecture / Real Device Prep Review 2026-06-30

## 1. Unity Editor version

`6000.5.1f1`

## 2. ProjectVersion.txt

```txt
m_EditorVersion: 6000.5.1f1
m_EditorVersionWithRevision: 6000.5.1f1 (0d9463e84828)
```

## 3. 2D URP維持

既存U5 verificationで `RenderPipelineAsset: U1UniversalRenderPipelineAsset` を確認する。U6ではRender Pipeline設定を変更していない。

## 4. U5.2 term lock check結果

Initial:

```txt
pnpm unity:term-lock:check
unity term lock check passed: checked 4 file(s)
```

Final:

```txt
pnpm unity:term-lock:check
unity term lock check passed: checked 6 file(s)
```

## 5. asset-intake checker結果

Initial:

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

Final:

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

## 6. meta GUID checker結果

Initial:

```txt
pnpm unity:meta:check
unity meta guid check passed: 127 meta guid(s), 127 unique guid(s)
```

Final:

```txt
pnpm unity:meta:check
unity meta guid check passed: 127 meta guid(s), 127 unique guid(s)
```

## 7. Battle architecture plan

追加:

```txt
docs/unity-battle-architecture-plan-2026-06-30.md
```

U6では大規模分割を行わず、`U2BattleController` の責務棚卸し、分割予定、禁止事項、migration orderを固定した。

## 8. TimeScale service plan

追加:

```txt
docs/unity-timescale-service-plan-2026-06-30.md
```

U6ではproof classを追加しない。U3 hit stopとU4 LevelUp overlayの既存挙動を壊さないため、U7以降に `BattleTimeScaleService` へ移行する方針を固定した。

## 9. AssetProvider plan

追加:

```txt
docs/unity-asset-provider-plan-2026-06-30.md
```

`Resources/U5Candidates` はproof-only、`U5VisualAssetLibrary` はproduction asset managerではない。将来のproduction層としてAssetManifest / AssetProvider / BattleVisualAssetSet / UIVisualAssetSet / VfxVisualAssetSet / FullscreenArtAssetSetを定義した。

## 10. Sprite Atlas / Import policy更新内容

更新:

```txt
docs/unity-sprite-import-policy-2026-06-30.md
```

U5 candidateのdraft atlas group案を追加した。分類は `Characters`, `Enemies`, `Pickups`, `VFX`, `UI`, `FullscreenArt`。U6ではSprite Atlas本格導入はしていない。

## 11. Real device checklist更新内容

更新:

```txt
docs/unity-real-device-test-checklist-2026-06-30.md
```

iPhone / Androidの実行手順、Profiler minimum checks、実機未実行statusを追記した。

追加:

```txt
docs/unity-u6-real-device-prep-review-2026-06-30.md
```

## 12. U2BattleControllerにUI処理を混ぜていないこと

U6で追加したのは境界コメントのみ。UI生成、LevelUp card生成、LevelUp候補データ、asset名直書き、TimeScale実装は追加していない。

## 13. Resources/U5Candidatesがproof-onlyのままか

proof-onlyのまま。U6では新規画像生成やruntime画像追加を行っていない。

## 14. U5素材がcandidateのままか

candidateのまま。Initial asset-intake checkerでは `productionApproved=0`。

## 15. 正式タイトル ヨルノシルベ と 黒耀化 が維持されているか

U6 docsでは正式タイトル `ヨルノシルベ` と表記 `黒耀化` を使用する。旧表記は新規docへ追加しない。

## 16. Console compile/runtime error有無

Unity batchmode U5/U4 verification passed. No compile error or runtime exception was observed in the verification outputs.

U5 Visual Candidate Verification:

```txt
Unity: 6000.5.1f1
RenderPipelineAsset: U1UniversalRenderPipelineAsset
ProjectVersion: OK
AssetsLoaded: yui=True, ombu=True, exp=True, spark=True, ink=True, trail=True, paper=True, iconFrame=True
Movement: distance=2.322, moved=True
Battle: spawned=7, fired=11, defeated=3, droppedExp=3, collectedExp=3
Feel: hitStop=10, cameraImpulse=3, lanternPulse=14, deathBurst=3, collectTrail=3
VFX: active=0, peak=10, played=38, dropped=0, maxActiveCap=18
LevelUpOverlay: activeBeforeRestore=True
TimeScale: beforeRestore=0, paused=True
390x844: canvas=True, safeHud=True, backgroundCover=True
360x800: canvas=True, safeHud=True, backgroundCover=True
430x932: canvas=True, safeHud=True, backgroundCover=True
```

U4 LevelUp UI Verification:

```txt
Unity: 6000.5.1f1
Platform: OSXEditor
ProjectVersion: OK
Card UI in BattleController: clean
LevelUp data in BattleController: clean
Minimal notifier hook: OK
ForceRestore method: OK
OnDisable restore: OK
OnDestroy restore: OK
dawn_ticket in candidates: clean
```

## 17. 実行したcheck一覧

- `pnpm unity:term-lock:check`
- `pnpm unity:asset-intake:check`
- `pnpm unity:meta:check`
- `git diff --check`
- `pnpm design:review:verify`
- Unity batchmode U5 Visual Candidate Verification
- Unity batchmode U4 LevelUp UI Verification

Additional results:

```txt
git diff --check
PASS: no whitespace errors
```

```txt
pnpm design:review:verify
design review verification passed: checked 7 design review docs
```

## 18. git status --short

Final resultを完了報告に記録する。

## 19. commit hash

Final commit hashを完了報告に記録する。

## 20. 残る未解決懸念

- U5 assets are still candidate-only
- Real device execution is not done yet
- Resources/U5Candidates remains proof-only
- Sprite Atlas is planned but not introduced
- Addressables is not introduced yet
- BattleController full split is not done yet
- BattleTimeScaleService is design/proof only
- Production UI typography pass is still needed

## 21. 次にやること

- U6.1でiPhone / Android実機確認を実行する。
- `BattleTimeScaleService` の小さな置き換え計画をU7で実装する。
- AssetProvider境界を実装してからproduction素材を増やす。
- Sprite Atlas導入はapproved素材とownerが固まってから判断する。
