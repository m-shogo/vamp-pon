# Unity U6.1 Real Device Verification Review 2026-06-30

## 1. Scope

U6.1は新機能追加なし。新規画像生成なし。新規キャラ、敵、武器、黒耀化runtime、Result、StageSelect、Collectionの本実装なし。

目的は、Unity版ヨルノシルベの実機確認結果を記録し、実機で確認できなかった項目を `not executed` として明確に残すこと。

## 2. Unity Editor version

```txt
6000.5.1f1
```

## 3. ProjectVersion.txt

```txt
m_EditorVersion: 6000.5.1f1
m_EditorVersionWithRevision: 6000.5.1f1 (0d9463e84828)
```

## 4. 2D URP維持

Maintained.

Evidence:

```txt
U5 Visual Candidate Verification
RenderPipelineAsset: U1UniversalRenderPipelineAsset
```

Settings evidence:

```txt
Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset
Assets/_Project/Settings/U1Renderer2DData.asset
```

## 5. term lock check結果

Initial:

```txt
pnpm unity:term-lock:check
unity term lock check passed: checked 6 file(s)
```

Final:

```txt
pnpm unity:term-lock:check
unity term lock check passed: checked 7 file(s)
```

## 6. asset-intake checker結果

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

## 7. meta GUID checker結果

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

## 8. iPhone実機確認結果

iPhone real device: not executed

Reason:

- No physical iPhone install, launch, screen inspection, or Profiler session was available from this Codex execution context.
- No iOS Development Build was produced in U6.1.
- Installed Unity modules in this environment did not include iOS support under `PlaybackEngines`.

Result fields:

```txt
device name: not executed
iOS version: not executed
build type: not executed
Profiler connected: no, not executed
fps rough result: not executed
memory rough result: not executed
safe area result: not executed on device
touch result: not executed on device
pause/resume result: not executed on device
crash/error result: not executed on device
```

Not executed items:

- Development Build launch
- portrait固定 on device
- notch / Dynamic Island / home indicator inspection
- 390x844相当の見え方 on device
- touch input on device
- enemy spawn on device
- projectile hit on device
- EXP collection on device
- LevelUp overlay on device
- pause / resume by backgrounding
- audio one-shot latency
- thermal signs after repeated short play
- memory behavior on device
- Unity Profiler connection
- crash log collection

## 9. Android実機確認結果

Android real device: not executed

Reason:

- No physical Android install, launch, screen inspection, or Profiler session was available from this Codex execution context.
- No Android Development Build was produced in U6.1.
- Installed Unity modules in this environment did not include Android support under `PlaybackEngines`.

Result fields:

```txt
device name: not executed
Android version: not executed
build type: not executed
Profiler connected: no, not executed
fps rough result: not executed
memory rough result: not executed
safe area / navigation result: not executed on device
touch result: not executed on device
pause/resume result: not executed on device
crash/ANR result: not executed on device
```

Not executed items:

- Development Build launch
- portrait固定 on device
- punch-hole / navigation bar inspection
- 360x800 / 393x852 / 412x915相当の見え方 on device
- touch input on device
- back gesture conflict
- enemy spawn on device
- projectile hit on device
- EXP collection on device
- LevelUp overlay on device
- app switch / lock unlock
- audio focus
- thermal signs
- memory behavior on device
- Unity Profiler connection
- crash / ANR log collection

## 10. Profiler接続結果

Device Profiler connection: not executed.

Editor/batchmode fallback only:

- U5 Visual Candidate Verification passed.
- U4 LevelUp UI Verification passed.
- No device CPU/GPU/memory profiler capture was collected.

## 11. Safe Area結果

Device Safe Area: not executed.

Editor/batchmode fallback:

```txt
390x844: canvas=True, safeHud=True, backgroundCover=True
360x800: canvas=True, safeHud=True, backgroundCover=True
430x932: canvas=True, safeHud=True, backgroundCover=True
```

Project/runtime evidence:

- `SafeAreaCanvas` is created in `U1Stage1SceneBootstrap`.
- `SafeAreaFitter` remains present.
- `CanvasScaler` reference resolution remains `390 x 844`.

## 12. touch input結果

Device touch input: not executed.

Editor/code evidence:

- Input System remains enabled by ProjectSettings.
- `PlayerController` uses `UnityEngine.InputSystem`.
- `PaperCard` and `PaperButton` implement pointer click handlers.
- U4 verification confirms BattleController does not own card UI.

This does not replace real device touch verification.

## 13. pause/resume結果

Device background pause/resume: not executed.

Editor fallback:

- U5 verification triggered LevelUp overlay pause.
- `TimeScale: beforeRestore=0, paused=True` was recorded before restore.
- Verification then calls the restore path.
- U4 verification confirms `ForceRestore`, `OnDisable`, and `OnDestroy` restore hooks exist.

This does not replace app background/foreground testing on device.

## 14. FPS / memory / thermalの所感

Device FPS: not executed.

Device memory: not executed.

Device thermal: not executed.

Editor/batchmode fallback:

- No compile/runtime exception was observed in verification output.
- No device performance conclusion is claimed.

## 15. crash / ANR / runtime error有無

Device crash log: not executed.

Device ANR log: not executed.

Editor/batchmode:

- U5 Visual Candidate Verification exited successfully.
- U4 LevelUp UI Verification exited successfully.
- No compile error or runtime exception was observed in the verification outputs.

## 16. U5素材がcandidateのままか

Maintained.

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

U5素材8点はcandidateのまま。Production approved昇格なし。

## 17. Resources/U5Candidatesがproof-onlyのままか

Maintained.

- No new runtime images were added.
- `Resources/U5Candidates` remains proof-only.
- `U5VisualAssetLibrary` remains proof-only and is not treated as a production asset manager.

## 18. Console compile/runtime error有無

Editor/batchmode verification:

```txt
U5 Visual Candidate Verification: passed
U4 LevelUp UI Verification: passed
```

No compile error or runtime exception was observed in the verification outputs.

## 19. not executed項目

- iPhone Development Build
- iPhone install / launch
- iPhone Safe Area / Dynamic Island / home indicator inspection
- iPhone touch input
- iPhone pause/resume by backgrounding
- iPhone audio latency
- iPhone thermal / memory / Profiler / crash log
- Android Development Build
- Android install / launch
- Android punch-hole / navigation bar inspection
- Android touch input / back gesture conflict
- Android app switch / lock unlock
- Android audio focus
- Android thermal / memory / Profiler / crash / ANR log
- Device FPS measurement
- Device memory measurement
- Device thermal measurement

## 20. git status --short

Final result is recorded in the completion report.

## 21. commit hash

Base commit before U6.1:

```txt
92ab101f504b5084ebe1899fdff0185ce28dba18
```

U6.1 commit hash is recorded in the completion report after commit creation.

## 22. 残る未解決懸念

- iPhone real device execution is not done yet.
- Android real device execution is not done yet.
- Device Profiler connection is not done yet.
- Device FPS, memory, and thermal behavior are unknown.
- iOS and Android Unity build support modules were not present in this local Unity installation.
- Development Build / Autoconnect Profiler / Script Debugging options still need a manual build pass.
- Store-facing bundle id, product name, signing, and final Player Settings are not finalized.
- U5 assets are still candidate-only.
- `Resources/U5Candidates` remains proof-only.

## 23. 次にやること

1. Install iOS and Android Unity build support modules for `6000.5.1f1`.
2. Create Development Builds with Autoconnect Profiler enabled.
3. Run at least one iPhone device pass and one Android device pass.
4. Record device name, OS version, FPS/memory rough result, Safe Area result, touch result, pause/resume result, and crash/error result.
5. Keep U5 assets as candidate until the asset intake gate explicitly promotes them.

## Unity Build Settings / Player Settings確認

Confirmed from repository files:

- ProjectVersion.txt = `6000.5.1f1`
- Scene list includes `Assets/_Project/Scenes/Boot/Boot.unity`
- Scene list includes `Assets/_Project/Scenes/Stage1/Stage1.unity`
- 2D URP settings remain present
- portrait orientation policy is present: portrait allowed, landscape disabled
- Safe Area Canvas remains in runtime bootstrap
- Input System remains enabled

Manual/device build confirmation still required:

- Development Build setting
- Autoconnect Profiler setting
- Script Debugging setting
- iOS build target support
- Android build target support
- signing, bundle id, and store-facing Player Settings

Installed build-support observation:

```txt
PlaybackEngines present: MacStandaloneSupport, WebGLSupport
iOS support: not installed in this local Unity installation
Android support: not installed in this local Unity installation
```

## Editor fallback verification

U5 Visual Candidate Verification:

```txt
Unity: 6000.5.1f1
RenderPipelineAsset: U1UniversalRenderPipelineAsset
ProjectVersion: OK
AssetsLoaded: yui=True, ombu=True, exp=True, spark=True, ink=True, trail=True, paper=True, iconFrame=True
RuntimeSprites: yui=u5-yui-battle-candidate, firstOmbu=u5-ombu-battle-candidate
Movement: distance=2.278, moved=True
Battle: spawned=6, fired=10, defeated=2, droppedExp=2, collectedExp=2
Feel: hitStop=10, cameraImpulse=2, lanternPulse=12, deathBurst=2, collectTrail=2
VFX: active=0, peak=10, played=28, dropped=0, maxActiveCap=18
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
