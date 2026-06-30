# Unity U7.1 TimeScale / AssetProvider Verification Hardening Review 2026-06-30

## 1. Scope

U7.1 is verification hardening only.

No new image generation, character, enemy, weapon, 黒耀化 runtime, Result, StageSelect, Collection, or ultimate cut-in runtime implementation was added.

U7.1 adds editor verification for:

- `BattleTimeScaleService`
- `IAssetProvider` / `U5ProofAssetProvider`

## 2. U6.1 real device status remains not executed

iPhone / Android real device verification remains `not executed`.

U7.1 does not install iOS / Android build support modules, does not create Development Builds, and does not connect Unity Profiler to a device.

## 3. BattleTimeScaleService verification cases

Added:

```txt
unity/VampPonUnity/Assets/_Project/Scripts/Editor/U7TimeScaleServiceVerification.cs
```

Executed result:

```txt
U7 TimeScale Service Verification
case force restore: OK
case single pause register: OK
case single pause release: OK
case multi pause owner register: OK
case multi pause owner partial release: OK
case multi pause owner full release: OK
case hit stop trigger: OK
case hit stop expiry: OK
case pause over hit stop keeps pause: OK
case pause release returns to active hit stop: OK
case hit stop after pause expiry: OK
case hit stop then pause: OK
case hit stop resumes after pause release: OK
case hit stop release: OK
case force restore from mixed state: OK
TimeScale final: 1
Service final scale: 1
Service final reason: force-restore
```

## 4. multi pause owner結果

Passed.

Confirmed behavior:

- RegisterPause("A") + RegisterPause("B") keeps `Time.timeScale=0`.
- ReleasePause("A") keeps pause active.
- ReleasePause("B") restores `Time.timeScale=1`.

## 5. hit stop expiry結果

Passed.

Confirmed behavior:

- TriggerHitStop("H", duration, 0.18) sets `CurrentScale=0.18`.
- Tick beyond duration restores `Time.timeScale=1`.

## 6. pause + hit stop interaction結果

Passed.

Confirmed behavior:

- Triggering hit stop while pause is active keeps `Time.timeScale=0`.
- Releasing pause while hit stop remains active returns to hit stop scale.
- Expiring or releasing hit stop restores `Time.timeScale=1`.
- Starting pause during hit stop and releasing pause keeps the hit stop scale until hit stop release/expiry.

## 7. ForceRestore結果

Passed.

Confirmed behavior:

- `ForceRestore()` returns `Time.timeScale=1`.
- `BattleTimeScaleService.CurrentScale=1`.
- `BattleTimeScaleService.IsPaused=false`.
- Mixed pause + hit stop state also restores to `1`.

## 8. AssetProvider verification結果

Added:

```txt
unity/VampPonUnity/Assets/_Project/Scripts/Editor/U7AssetProviderVerification.cs
```

Executed result:

```txt
U7 AssetProvider Verification
case provider name: OK
case proof-only flag: OK
case load battle visuals: OK
case player sprite: OK
case enemy sprite: OK
case projectile sprite: OK
case exp sprite: OK
case hit sprite: OK
case ink sprite: OK
case trail sprite: OK
case BattleController has no Resources.Load: OK
case BattleController has no U5Candidates: OK
case BattleController has no U5 asset id: OK
case BattleController has no card UI generation: OK
case addressable loading not referenced: OK
```

## 9. U5ProofAssetProviderがproof-onlyであること

Passed.

`U5ProofAssetProvider.IsProofOnly == true`.

The provider still wraps `U5VisualAssetLibrary` and does not mark assets as approved.

## 10. U2BattleControllerにResources.Load / U5Candidates / U5 asset id直書きがないこと

Passed.

Verified:

- no `Resources.Load`
- no `U5Candidates`
- no `u5-yui`
- no `u5-ombu`
- no other checked U5 proof asset id
- no `PaperCard.Create`, `IconFrame.Create`, or `PaperButton.Create`

## 11. Addressablesを導入していないこと

Passed.

No Addressables loading reference was found in project scripts.

No Addressables package, profile, catalog, or runtime path was added.

## 12. U5素材がcandidateのままであること

Maintained.

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

## 13. Resources/U5Candidatesがproof-onlyのままであること

Maintained.

- No new runtime images were added.
- `Resources/U5Candidates` remains proof-only.
- `U5VisualAssetLibrary` remains a proof-only loader.
- `U5ProofAssetProvider` remains proof-only.

## 14. term lock / asset intake / meta check結果

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
unity meta guid check passed: 130 meta guid(s), 130 unique guid(s)
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
unity meta guid check passed: 132 meta guid(s), 132 unique guid(s)
```

```txt
git diff --check
PASS: no whitespace errors
```

```txt
pnpm design:review:verify
design review verification passed: checked 7 design review docs
```

## 15. Unity U4/U5 verification結果

U5 Visual Candidate Verification:

```txt
Unity: 6000.5.1f1
RenderPipelineAsset: U1UniversalRenderPipelineAsset
ProjectVersion: OK
AssetsLoaded: yui=True, ombu=True, exp=True, spark=True, ink=True, trail=True, paper=True, iconFrame=True
RuntimeSprites: yui=u5-yui-battle-candidate, firstOmbu=u5-ombu-battle-candidate
Movement: distance=2.329, moved=True
Battle: spawned=7, fired=11, defeated=3, droppedExp=3, collectedExp=3
Feel: hitStop=10, cameraImpulse=3, lanternPulse=14, deathBurst=3, collectTrail=3
VFX: active=0, peak=10, played=38, dropped=0, maxActiveCap=18
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

## 16. Console compile/runtime error有無

Unity batchmode verification exited successfully.

No compile error or runtime exception was observed in verification outputs.

Unity licensing log line observed:

```txt
[Licensing::Module] Error: Access token is unavailable; failed to update
```

This did not fail batchmode verification and is not a project compile/runtime error.

## 17. 残る未解決懸念

- iPhone / Android real device verification remains not executed.
- `BattleTimeScaleService` is still proof-level.
- Production pause, Result transition, and 黒耀化 timing are not implemented.
- `U5ProofAssetProvider` still wraps U5 candidate Resources.
- U5 assets remain candidate-only.
- Addressables is still not introduced.

## 18. 次にやること

- Keep these U7.1 editor verifications in the default Unity verification set for future passes.
- Add device verification after iOS / Android build support modules are installed.
- Only move more asset loading behind provider boundaries after approved assets exist.
- Keep U5 assets candidate-only until the intake gate explicitly promotes them.
