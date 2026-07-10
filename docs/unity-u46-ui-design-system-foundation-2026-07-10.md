# U46 UI Design System Foundation

Date: 2026-07-10

## Result

ヨルノシルベのUnity UIへ、9-slice以外の共通デザイン基盤を追加した。
既存runtimeはuGUIのまま維持し、U43 pause/input/tap guardとU45 candidate UIを置き換えていない。

## Added

### Runtime foundation

- `YorunoShirubeUiTheme.cs`
- `UiThemeRuntime.cs`
- `UiVisualState.cs`
- `ResponsiveLayoutProfile.cs`
- `YorunoShirubeUiTheme.asset`
- `YorunoShirubeResponsiveLayout.asset`

### Editor foundation

- `U46UiDesignSystemBootstrap.cs`
- `U46UiComponentCatalogWindow.cs`
- `UiSpriteImportPolicyValidator.cs`

### Existing bridge updates

- `AppQualityStyleTokens.cs`
  - Theme / Responsive runtime bridgeを追加
  - spacing / typography fallbackを追加
- `AppQualityUiFactory.cs`
  - Sprite BorderなしのSliced指定をSimpleへ退避
  - Visual State view接続口を追加

### Repository quality gate

- `scripts/quality/check-unity-ui-design-system.ts`
- `pnpm unity:ui-design-system:check`

### Documentation

- `docs/unity-ui-design-system-v1.md`
- `README.md`
- `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`
- `docs/design-targets/generated/unity-u46/ui-design-system-readiness.json`

## Adopted systems

1. 9-slice / Sprite Border
2. ScriptableObject Theme
3. Visual State
4. Responsive Layout Profile
5. Editor Component Catalog
6. Prefab Variant policy
7. UI Sprite Import Policy
8. existing Sprite Atlas policy

## Prefab boundary

Prefabの設計方針と保存先は固定したが、Base / Variant prefab本体はまだ生成していない。

```txt
Assets/_Project/Prefabs/UI/Base
Assets/_Project/Prefabs/UI/Variants
```

継承はBase → Variantの2階層までとする。
既存runtime生成UIを一度に全面移行せず、U46でResult / Collection / touched componentsから移行する。

## Editor commands

```txt
VampPon > UI > Create or Refresh Design System Assets
VampPon > UI > Open Component Catalog
VampPon > UI > Validate UI Sprite Import Policy
```

## Validation boundary

GitHubへfoundation、asset、docs、checkerを追加した。
この更新後のUnity batchmode compile、Editor Catalog起動、import validator、Simulator regressionはまだ実行証跡を追加していない。

したがって以下はfalseのまま保持する。

```txt
staticCheckerExecutedAfterCommit=false
unityCompileVerifiedAfterCommit=false
editorCatalogOpenedAfterCommit=false
importValidatorExecutedAfterCommit=false
simulatorRegressionRerunAfterCommit=false
```

最初のローカル検証手順:

```sh
pnpm unity:ui-design-system:check
pnpm unity:meta:check
```

Unity 6000.5.1f1:

```txt
VampPon > UI > Validate Design System Assets
VampPon > UI > Open Component Catalog
```

その後、U45 AI-only Simulator smokeを再実行してruntime regressionがないことを確認する。

## Readiness boundary

今回の変更はデザインシステム基盤であり、実機・最終美術・RC承認ではない。

```txt
simulatorPlayableCandidateReady=true
actualDeviceSmokeResult=NOT_PROVIDED
candidateAssetsApprovedAsFinal=false
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```
