# Unity Runtime Visual Readiness Gate Foundation

Date: 2026-07-10  
Phase: U45.1 gate

## Purpose

U43で発生した「GameObject名とPoint Filterの変更をドットキャラクター完成に近い証跡として扱った」誤判定を再発させない。

## Current runtime finding

```txt
runtimeVisualClassification=proof-static-single-sprite
provider=U5ProofAssetProvider
player sprite=u5-yui-battle-candidate.png
player Sprite Mode=Single
player frame count=1
player animation states=0
procedural character fallback=true
enemy Sprite Mode=Single
enemy frame count=1
procedural enemy fallback=true
```

現在のStage1は操作・route確認用としては有効だが、character/enemy visual完成証跡ではない。

## Added

- `docs/unity-runtime-visual-readiness-gate-v1.md`
- `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json`
- `scripts/quality/check-unity-runtime-visual-readiness.ts`
- `pnpm unity:runtime-visual-readiness:check`
- `assets:verify`へのgate追加
- U45 Simulator checkerからruntime visual readinessを参照
- U43 character repair文書への訂正注記
- README / Current Production Canon / U44-U51 roadmap更新

## Guarded false positives

以下はドットruntime完成の証拠として認めない。

```txt
GameObject名にDotが含まれる
Point Filter
Mipmap OFF
静止画表示
操作可能
Simulator route smoke成功
proof providerの名称変更
```

## Promotion requirements

`characterDotRuntimeReady=true`には最低限、次が必要。

```txt
production provider
Sprite Mode Multiple
sliced frames
idle / walk / hurt / attack
左右反転確認
Golden Identity Reference
Generation Lineage
gameplay-size visual review
```

`productionCharacterAssetReady=true`には追加で次が必要。

```txt
approvedAsFinal=true
runtimeApproved=true
characterAnimationReady=true
```

敵も同様に、Multiple sprite、idle / move / hurt / death、visual review、final/runtime承認を分離する。

## Current readiness

```txt
simulatorPlayableCandidateReady=true
simulatorRouteEvidenceStillValid=true
simulatorCharacterVisualApprovalInvalidated=true
characterDotRuntimeReady=false
characterAnimationReady=false
enemyDotRuntimeReady=false
enemyAnimationReady=false
productionCharacterAssetReady=false
productionEnemyAssetReady=false
runtimeVisualReady=false
```

## Verification boundary

GitHubへsource/docs/checkerは追加済み。

このGitHub接続からMac上のNode/Unity/Simulatorは実行していないため、以下は未実行のまま保持する。

```txt
staticCheckerExecutedAfterCommit=false
unityCompileVerifiedAfterGate=false
simulatorRegressionRerunAfterGate=false
```

Mac側で実行する。

```sh
pnpm unity:runtime-visual-readiness:check
pnpm unity:u45-ai-simulator-smoke:check
pnpm assets:verify
pnpm test
pnpm build
```

## Next phase

U46より先に以下を実施する。

```txt
U45.1 Character and Enemy Dot Runtime Pass
```

ユイとオンブの最低animation、production provider、proof/procedural経路除外、Simulator visual再確認まで完了してからResult / 灯録へ進む。
