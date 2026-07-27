# ヨルノシルベ Mobile Release QA Gates

<!-- CURRENT_STATE_BEGIN -->
```json
{
  "schemaVersion": 1,
  "currentPhase": "U49 actual-device audio/haptic",
  "nextPhase": "U50 performance/touch metrics",
  "thenPhase": "U51 RC",
  "runtimeVisualReady": true,
  "physicalDeviceReady": false,
  "devicePlayableReady": false,
  "audioMixerImplemented": true,
  "audioMixerDeviceVerified": false,
  "audioReady": false,
  "audioLatencyMeasured": false,
  "hapticReady": false,
  "hapticMeasured": false,
  "u50ThresholdsDefined": false,
  "mobileMetricsReady": false,
  "rcReady": false,
  "productionApproved": false
}
```
<!-- CURRENT_STATE_END -->

Last synchronized: 2026-07-25  
Status: current iOS release QA source

ヨルノシルベをiOS向けportrait mobile gameとして安全に仕上げるためのQAゲートです。現在のPhaseはU49 actual-device audio/hapticであり、U50 device performance/touch、U51 RCへ順番に進みます。

この文書は、Editor、Simulator、actual device、RC、production approvalを混同しないための判定基準です。実装・evidence・checkerが揃わないreadiness昇格は禁止します。

## Current boundary

```txt
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Next: U50 device performance/touch metrics
Then: U51 RC

runtimeVisualClassification=production-animated-sprite
runtimeVisualReady=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

`runtimeVisualReady=true` はU48 production visual runtimeの接続・responsive Simulator verificationのみを表します。actual-device、音、振動、性能、RC、store release approvalは別ゲートです。

## Source of truth

```txt
docs/unity-current-doc-index-2026-07-10.md
docs/181-current-production-canon.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-mobile-performance-budget.md
docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
docs/visual-qa-gates.md
```

Official references:

- Unity Profiler: https://docs.unity3d.com/Manual/Profiler.html
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect app privacy: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/
- Apple accessibility guidance: https://developer.apple.com/design/human-interface-guidelines/accessibility/

## Evidence levels

| Level | 認める証拠 | 認めない昇格 |
| --- | --- | --- |
| Static | source、manifest、importer、checker | device/audio/haptic/performance readiness |
| Unity Editor | compile、state transition、request routing | actual-device playability、latency、thermal |
| iOS Simulator | route、responsive layout、crash absence、deterministic automation | physical haptic、speaker feel、touch feel、thermal |
| Actual device | audio/haptic/touch/performance observation | RC/product approvalの自動昇格 |
| RC review | device matrix、P0/P1 closure、privacy/store/known issues | evidenceなしのproduction approval |

## Gate 0: Baseline and worktree safety

合格条件:

- 対象repoが `/Users/m-shogo/Developer/personal/vamp-pon` のみ
- branch、HEAD、`origin/main`、`git status --short`を記録
- uncommitted/untracked/unpushed workを削除、reset、clean、force-pushしない
- build identifier、commit、device、OSをevidenceへ記録
- current source of truth同士が同じPhase/readinessを示す

停止条件:

- baseline不明
- local workとremote branchの重複不明
- current docs/readinessが矛盾
- historical evidenceをcurrent結果として流用

## Gate 1: Responsive readability and Safe Area

対象tier:

```txt
Compact: 360x800 / 375x812
Standard: 390x844 / 393x852
Large: 412x915 / 430x932
```

合格条件:

- TOP、StageSelect、Battle、LevelUp、Replacement、Result、灯録が各tierで読める
- notch、Dynamic Island、home indicatorを避ける
- primary CTA、Ultimate、Pause、入替、戻る操作のtap targetが明確
- player、enemy、EXP、HUD、黒耀化が背景/effectへ埋もれない
- text/controlを画像へ焼き込まない
- orientationはportrait固定方針と一致

停止条件:

- StandardだけPASSしCompact/Largeが破綻
- Safe Area外へcritical controlが出る
- effectや装飾がgameplay entityを隠す
- invisible overlayがinputを奪う

## Gate 2: Stage1 gameplay and state integrity

合格条件:

- StageSelect -> Battle -> LevelUp/Replacement -> Result -> Retry/StageSelectの遷移が成立
- pause/modal中にbattle timeが進まない
- invalid drop、invalid evolution、capacity超過が拒否される
- definition / runtime state / save DTOが分離される
- Result/灯録はread modelを表示し、battle/file I/Oを直接所有しない
- foreground/background復帰後も入力・pause・audio stateが壊れない

停止条件:

- visual/audio変更でbalance、reward、spawn、saveが暗黙変更
- Retry後に前run stateが残る
- background復帰で二重subscription、二重SE、入力不能が起きる
- corrupted saveやmigration failureを黙って上書き

## Gate 3: U49 actual-device audio

U49ではactual deviceで確認します。Editor/Simulatorだけでは次をtrueへ上げません。

```txt
audioMixerReady
audioLatencyMeasured
devicePlayableReady
```

必須evidence:

- device model / iOS version
- app build identifier / commit
- speakerまたは明記したoutput route
- deterministic SE sequenceの全項目
- BGM開始、停止、pause、resume、scene transition
- master/BGM/SE volumeとmute behavior
- foreground/background復帰
- rapid repeat時のlimiter、duplicate、missing cue
- clip load failureやnull routeの扱い
- human review result

合格条件:

- hit、death、collect、LevelUp、rare、黒耀化、Result、button feedbackの意味が聞き分けられる
- 同一SEの過剰重複が抑制される
- mute/volumeが保存・復帰後も契約どおり
- background移行中に意図しない再生が続かない
- resume時にBGM/SEが二重化しない
- observed latencyが操作感を損なわず、測定方法と結果を記録する

停止条件:

- request hookが呼ばれただけでaudio ready扱い
- Simulator speakerだけでfinal判定
- 未定義・missing clipによる意図しない無音をPASS（machine-readableな`INTENTIONALLY_DISABLED` policyに基づくBGM無効は、error・unexpected playback・duplicate sourceがないことを検証する）
- rapid pickupで音が飽和
- background/foreground後に二重BGMまたはmute解除

## Gate 4: U49 actual-device haptic

U49ではactual deviceで確認します。Simulator hookだけでは次をtrueへ上げません。

```txt
hapticMeasured
devicePlayableReady
```

必須evidence:

- deterministic haptic sequenceの全項目
- trigger eventと期待する強度/役割
- rapid repeat suppression
- audioとの同期
- background/foreground復帰
- unsupported/disabled環境のfail-safe
- human review result

合格条件:

- tap、hit、rare、黒耀化、Result等の役割差が過剰でなく理解できる
- continuous spamにならない
- audioと大きくずれない
- haptic無効/非対応でもgameplayが成立
- lifecycle復帰後に重複triggerしない

停止条件:

- every eventへ同じ振動
- pickup/hit連打で不快な連続振動
- haptic失敗で例外または進行停止
- Simulator callbackだけでmeasured扱い

## Gate 5: U50 device performance and touch

U49完了から自動昇格しません。`docs/unity-mobile-performance-budget.md` の測定契約を使います。

必須evidence:

- device / iOS / build / quality setting
- cold launchとwarm launch
- sustained Stage1 run
- FPS、CPU/GPU frame time、frame pacing
- memory、GC allocation、GC spike
- batches/draw calls、UI rebuild
- enemy/EXP/effect peak scenario
- LevelUp、Replacement、Result、黒耀化のtransition spike
- foreground/background recovery
- touch responsiveness、virtual stick、buttons、edge controls
- thermal/battery observation

合格条件:

- measured targetとfloorを満たす
- hitchの場所と原因を説明できる
- memoryがrun中に無制限増加しない
- touch loss、ghost tap、stuck inputがない
- performance低下時もplayer/enemy/readabilityを優先する

停止条件:

- Editor Profilerだけで`mobileMetricsReady=true`
- average FPSだけでframe pacingを無視
- short idle sceneだけでPASS
- thermal throttlingや長時間劣化を未観測
- touch feelを自動testだけでfinal判定

## Gate 6: Accessibility and motion safety

合格条件:

- text、contrast、tap targetが各responsive tierで読める
- critical stateを赤/緑だけで区別しない
- Reduce Motion方針を壊さない
- flash、full-screen white、camera shake、rapid flickerを過剰にしない
- audio/hapticがなくてもcritical informationをUIで理解できる
- screen shakeやstrong feedbackを将来設定可能な構造にする

停止条件:

- flashingやshakeがgameplay理解を妨げる
- soundだけ、hapticだけでcritical stateを伝える
- tiny text、低contrast、Safe Area外control

## Gate 7: Save, lifecycle, and recovery

合格条件:

- versioned save schemaとstable IDを維持
- copy-on-writeまたは同等の失敗安全性を維持
- invalid/corrupted dataを安全に拒否・default/migration処理
- app interruption、background、foreground、process restartの期待挙動を記録
- save failureをUI/evidenceで検出可能
- reset/debug操作はtest build境界を持つ

停止条件:

- asset referenceやdisplayNameをidentityとして保存
- schema変更にmigrationなし
- write failureで既存saveを破壊
- lifecycle復帰でrun/save二重確定

## Gate 8: Privacy, SDK, permissions

合格条件:

- 使用SDKと送信データを一覧化
- 不要なpermissionを要求しない
- app privacy回答が実装および第三者SDKの挙動と一致
- privacy policy URLとsupport URLを準備
- analytics、ads、cloud、accountは必要性とdata contractが確定するまで先行導入しない
- secrets、certificate、provisioning profile、tokenをrepoへ保存しない

初期iOS scopeで原則要求しない:

- location
- contacts
- camera
- microphone
- tracking permission
- account requirement

停止条件:

- SDKの収集内容を説明できない
- disclosureと実装が不一致
- secret/certificate/tokenをcommit
- 不要permissionを追加

## Gate 9: U51 RC and store readiness

U51開始条件:

- U49 actual-device audio/haptic evidence complete
- U50 device performance/touch evidence complete
- P0/P1がcloseまたは明示的NO-GO
- current source of truth/readiness/checkerが一致

RC必須項目:

- release build identity、version、build number、signing
- actual-device smoke matrix
- crash/exception result
- responsive screen evidence
- save migration/recovery evidence
- audio/haptic/performance/accessibility result
- foreground/background/interruption result
- known issues、release notes、rollback/rebuild手順
- app icon、screenshots、description、age rating
- privacy policy、support URL、app privacy disclosure
- third-party asset/license log
- explicit human RC verdict

`rcReady=true` と `productionApproved=true` は別判定です。checker、device evidence、明示的承認なしで上げません。

停止条件:

- placeholder/proof/candidate assetがproduct routeに残る
- P0/P1未解決
- store説明と実機能が不一致
- privacy/support情報が不足
- Simulator結果だけでRC判定

## Required commands

大規模作業前:

```sh
pnpm implementation:preflight:check
```

Phase完了宣言前:

```sh
pnpm implementation:preflight:full
```

関連確認:

```sh
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm assets:verify
pnpm test
pnpm build
```

GitHub connectorだけで変更した場合、ローカルcommand、Unity compile、Simulator、actual-device実行を実行済みと報告しません。

## Final verdict

```txt
COMPLETE
CONDITIONAL
BLOCKED
NO-GO
```

最終レポートは、baseline/end HEAD、branch、worktree、build/device identity、実行項目、evidence paths、P0/P1/P2、known risks、readiness changes、commit/push/CIを含めます。

**読める、押せる、気持ちいい、壊れにくい、測定できる、説明と実装が一致する。** すべて揃うまでproduction approvalとは呼びません。
