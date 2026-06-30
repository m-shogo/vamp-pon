# Unity U7 BattleTimeScaleService / AssetProvider Proof Review 2026-06-30

## 1. Scope

U7は新機能追加なし。新規画像生成なし。新規キャラ、敵、武器、黒耀化runtime、Result、StageSelect、Collection、必殺cut-in runtimeの本実装なし。

U6で設計した `Time.timeScale` 管理とAssetProvider境界を、小さなproof実装として追加した。

## 2. U6.1 real device status remains not executed

iPhone / Android real device verification remains `not executed`.

U7では実機確認、iOS / Android build support導入、Development Build作成、Profiler接続は行っていない。

## 3. BattleTimeScaleService proof内容

追加:

```txt
unity/VampPonUnity/Assets/_Project/Scripts/Runtime/BattleTimeScaleService.cs
```

Minimum proof API:

```txt
RegisterPause(owner)
ReleasePause(owner)
TriggerHitStop(owner, duration, scale)
ForceRestore()
IsPaused
CurrentScale
DebugOwnerReason
```

追加で、U3 hit stop cleanup用に `ReleaseHitStop(owner)` と `Tick(unscaledDeltaTime)` も用意した。U7では全面置換ではなく、既存U3/U4の所有者をserviceへ通すproofに留めている。

## 4. 既存U3/U4との関係

`U3HitStopController`:

- public API and verification counter are kept.
- cooldown and local remaining time are kept.
- direct `Time.timeScale` writes were replaced with `BattleTimeScaleService.TriggerHitStop(...)` / `ReleaseHitStop(...)`.

`U4TimeScaleGuard`:

- `PauseForOverlay()`, `ResumeFromOverlay()`, `ForceRestore()`, and `IsOverlayPaused` are kept.
- overlay pause now registers/releases owner `U4LevelUpOverlay` through `BattleTimeScaleService`.

## 5. ForceRestore / OnDisable / OnDestroy 方針

- `BattleTimeScaleService.ForceRestore()` clears pause owners and hit stop owner, then writes `Time.timeScale = 1`.
- `U4TimeScaleGuard.ForceRestore()` delegates to the service.
- `U4LevelUpOverlay.OnDisable()` and `OnDestroy()` still call `U4TimeScaleGuard.ForceRestore()` when overlay pause remains active.
- `U3HitStopController.OnDisable()` releases only the hit stop owner, so it does not clear an unrelated LevelUp overlay pause.

## 6. AssetProvider proof内容

追加:

```txt
unity/VampPonUnity/Assets/_Project/Scripts/Runtime/IAssetProvider.cs
unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U5ProofAssetProvider.cs
```

`IAssetProvider`:

```txt
BattleVisualAssetSet LoadBattleVisuals()
string ProviderName
bool IsProofOnly
```

`U5ProofAssetProvider` wraps `U5VisualAssetLibrary.LoadBattleVisualSet()` and returns a proof-only `BattleVisualAssetSet`.

## 7. U5ProofAssetProviderがproof-onlyであること

`U5ProofAssetProvider.IsProofOnly` returns `true`.

It does not mark assets as approved, does not read a production manifest, and does not introduce Addressables.

## 8. U5素材がcandidateのままであること

Maintained.

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

## 9. Resources/U5Candidatesがproof-onlyのままであること

Maintained.

- No new runtime images were added.
- `Resources/U5Candidates` remains proof-only.
- `U5VisualAssetLibrary` remains a proof-only loader.

## 10. Addressablesを導入していないこと

Addressables is not introduced in U7.

No Addressables package, catalog, profile, or runtime loading path was added.

## 11. U2BattleControllerにUI生成を混ぜていないこと

Maintained.

U7 does not add card UI generation, LevelUp card generation, UI text, or candidate data to `U2BattleController`.

## 12. U2BattleControllerにasset path/id直書きがないこと

Maintained.

`U2BattleController` still receives `BattleVisualAssetSet` and does not know U5 asset ids or resource paths.

`U1Stage1SceneBootstrap` obtains `BattleVisualAssetSet` through `U5ProofAssetProvider`.

## 13. term lock / asset intake / meta check結果

Initial:

```txt
pnpm unity:term-lock:check
unity term lock check passed: checked 7 file(s)
```

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

```txt
pnpm unity:meta:check
unity meta guid check passed: 127 meta guid(s), 127 unique guid(s)
```

Final:

```txt
pnpm unity:term-lock:check
unity term lock check passed: checked 7 file(s)
```

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

```txt
pnpm unity:meta:check
unity meta guid check passed: 130 meta guid(s), 130 unique guid(s)
```

```txt
git diff --check
PASS: no whitespace errors
```

```txt
pnpm design:review:verify
design review verification passed: checked 7 design review docs
```

## 14. Unity U4/U5 verification結果

U5 Visual Candidate Verification:

```txt
Unity: 6000.5.1f1
RenderPipelineAsset: U1UniversalRenderPipelineAsset
ProjectVersion: OK
AssetsLoaded: yui=True, ombu=True, exp=True, spark=True, ink=True, trail=True, paper=True, iconFrame=True
RuntimeSprites: yui=u5-yui-battle-candidate, firstOmbu=u5-ombu-battle-candidate
Movement: distance=2.297, moved=True
Battle: spawned=7, fired=11, defeated=3, droppedExp=3, collectedExp=3
Feel: hitStop=9, cameraImpulse=3, lanternPulse=14, deathBurst=3, collectTrail=3
VFX: active=0, peak=10, played=37, dropped=0, maxActiveCap=18
LevelUpOverlay: activeBeforeRestore=True
TimeScale: beforeRestore=0, paused=True
390x844: canvas=True, safeHud=True, backgroundCover=True
360x800: canvas=True, safeHud=True, backgroundCover=True
430x932: canvas=True, safeHud=True, backgroundCover=True
TimeScaleAfterRestore: 1, serviceScale=1, serviceReason=force-restore
```

U4 LevelUp UI Verification:

```txt
Unity: 6000.5.1f1
Platform: OSXEditor
ProjectVersion: OK
ZenMaruGothic font: found
Font license: found
Card UI in BattleController: clean
LevelUp data in BattleController: clean
Minimal notifier hook: OK
ForceRestore method: OK
OnDisable restore: OK
OnDestroy restore: OK
dawn_ticket in candidates: clean
```

Confirmed:

- U5 Visual Candidate Verification passes.
- U4 LevelUp UI Verification passes.
- 390x844 / 360x800 / 430x932 remain OK.
- `Time.timeScale` restore path returns to `1`.
- LevelUp overlay pause remains intact.
- hit stop remains intact.

## 15. Console compile/runtime error有無

Unity batchmode verification exited successfully.

No compile error or runtime exception was observed in U4/U5 verification outputs.

Unity licensing log line observed:

```txt
[Licensing::Module] Error: Access token is unavailable; failed to update
```

This did not fail batchmode verification and is not a project compile/runtime error.

## 16. 残る未解決懸念

- iPhone / Android real device verification remains not executed.
- `BattleTimeScaleService` is proof-level, not the final production time system.
- Full pause, Result transition, and 黒耀化 timing are not implemented.
- `U5ProofAssetProvider` is proof-only and still wraps U5 candidate Resources.
- `U5VisualAssetLibrary` remains available for existing U4 UI proof components.
- Addressables is still not introduced.
- BattleController full split is still not done.

## 17. 次にやること

- Add a small editor verification for `BattleTimeScaleService` owner interactions if the proof grows.
- Move more visual loading behind AssetProvider only after approved assets exist.
- Keep U5 assets candidate-only until the intake gate explicitly promotes them.
- Run real device verification after iOS / Android build support modules are installed.
