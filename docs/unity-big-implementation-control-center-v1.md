# ヨルノシルベ Unity Big Implementation Control Center v1

Original adoption date: 2026-07-10
Last synchronized: 2026-07-25
Status: adopted / 大規模実装の単一入口

## 目的

キャラクター、敵、UI、保存、gameplay、asset、audio/haptic、performance、release作業を始める前に、仕様・責務・Phase・readiness・evidence・checkerの入口を1つへ固定します。

この文書は「製品が完成した」という宣言ではありません。古いPhase資料、historical readiness、proof/candidate asset、部分的なSimulator成功を現在のproduction/device/release状態として誤用しないためのcontrol planeです。

## Repository scope

```txt
/Users/m-shogo/Developer/personal/vamp-pon
https://github.com/m-shogo/vamp-pon.git
```

他repo、他project、他worktreeを変更しません。uncommitted/untracked/unpushed workを勝手にreset、clean、stash、force-pushしません。

## 読む順番

1. `docs/unity-big-implementation-control-center-v1.md`
2. `docs/unity-current-doc-index-2026-07-10.md`
3. `docs/181-current-production-canon.md`
4. `docs/unity-runtime-ownership-contract-v1.md`
5. `docs/unity-runtime-visual-readiness-gate-v1.md`
6. `docs/unity-ui-design-system-v1.md`
7. `docs/asset-generation-consistency-system-v1.md`
8. `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`
9. `docs/mobile-release-qa-gates.md`
10. `docs/unity-mobile-performance-budget.md`
11. 対象Phaseの個別doc / evidence / checker

古い資料と矛盾した場合は、current index、production canon、現行runtime、current readiness、最新evidence/checkerを優先します。active source of truth同士が矛盾する場合はfeature workを停止し、先に整合性を修復します。

## 現在の事実

```txt
Unity Editor: 6000.5.1f1
Render Pipeline: 2D URP
Runtime UI: uGUI
Reference viewport: 390x844 portrait
Responsive tiers: Compact / Standard / Large
Platform scope: iOS first / current iOS-only product scope
Bundle Identifier: com.mshogo.vamppon.u1
```

```txt
Completed: U45.1 Character and Enemy Dot Runtime Pass
Completed: U45.1 candidate/production readiness hardening
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Next: U50 performance/touch metrics
Then: U51 RC
```

```txt
implementationFoundationReady=true
runtimeVisualClassification=production-animated-sprite
simulatorPlayableCandidateReady=true
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
candidateAssetsApprovedAsFinal=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

`runtimeVisualReady=true` はU48 production visual runtime scopeのみを表します。actual-device playability、audio/haptic、performance、RC、store release approvalを意味しません。

## 現在の実装順

### Foundation Gate

大規模Phaseへ入る前に、source of truth、runtime ownership、UI Design System、Asset Generation Contract、readiness checker、mobile QA/performance contractを維持します。

必須:

```sh
pnpm implementation:preflight:check
```

### U45.1 Character and Enemy Dot Runtime Pass

Status: completed historical prerequisite.

維持するもの:

- proof providerをproduct routeへ戻さない
- player/enemy Sprite Mode Multiple
- required animation state
- explicit direction/equipment continuity
- procedural fallback development-only
- Golden Reference / Lineage / gameplay-size review

U45.1 candidate evidenceは歴史的証跡です。current U48 production readinessを上書きしません。

### U46 AppFlow / Save / Result / 灯録

Status: completed candidate shell and hardening.

維持するもの:

- navigation/pauseは単一owner
- UIはcommandを送る
- Result/灯録はread modelを描画
- Saveはversioned JSONとstable ID
- copy-on-writeまたは同等のfailure safety
- UIからfile I/Oや`Time.timeScale`を直接操作しない

### U47 Gameplay Data Runtime: Completed

Status: completed.

維持するもの:

- definition / runtime state / save DTOを分離
- Web正本からのstable ID互換
- production DataRegistry
- drop、進化、復帰、黒耀化のtest可能なstate transition
- invalid drop/evolution/capacityをfail-closed
- battle controllerへscreen/save責務を追加しない

### U48 Production Asset Expansion: Completed

人間承認46件を安定production pathへ昇格し、固定production catalogからruntime接続しました。Preview defineなしのiOS Simulator buildで46 group / 138 capture（Compact / Standard / Large）を検証済みです。

Current production chain:

```txt
human decision
-> approved production set
-> production provider/registry connection
-> runtime verification manifest
-> current readiness
-> checker
```

U48完了を新規assetへ自動継承しません。新しい生成物はcandidateから開始します。

### U49 Actual-device Audio / Haptic: Current

Scopeはactual-device audio/haptic verificationのみです。U48で完了したvisual production workをU49へ再混入させません。

U28/U39のrequest hook、final-candidate SE、routing draftを棚卸しし、production AudioMixer、platform haptic adapter、development-only device verification harnessを実装済みです。実機測定と人間判断が揃うまで`audioLatencyMeasured`、`hapticMeasured`、`devicePlayableReady`を上げません。

必須:

- device/build identity
- deterministic SE/BGM sequence
- deterministic haptic sequence
- mixer/volume/mute behavior
- duplicate/missing feedback確認
- foreground/background recovery
- unsupported/disabled fail-safe
- human review
- evidence/checker/readiness同期

禁止:

- Editor/Simulator hookだけでactual-device readinessを上げる
- U49から`mobileMetricsReady`、`rcReady`、`productionApproved`を自動昇格
- launch blockerを偽PASSにする
- visual asset replacementを無関係に追加する

### U50 Device Performance / Touch Metrics

Status: not started.

`docs/unity-mobile-performance-budget.md` に従い、actual deviceでframe pacing、memory、GC、rendering、UI rebuild、touch、thermal/sustained behaviorを測定します。

`mobileMetricsReady=true` はactual-device matrix、raw/summary evidence、checker、human reviewが揃った時だけ昇格します。

### U51 RC

Status: not started.

U49/U50完了、P0/P1 closure、actual-device smoke、save/recovery、accessibility、privacy/store/known issues、explicit human verdictを揃えます。

`rcReady=true` と `productionApproved=true` は別判定です。docs-only、Simulator-only、historical evidenceでは昇格しません。

## 変更禁止ではなく責務禁止

既存の`U1Stage1SceneBootstrap`と`U2BattleController`は移行途中の大きなクラスです。全面rewriteを目的化せず、触る機能から正しいownerへ移します。

### `U1Stage1SceneBootstrap`へ追加しないもの

- 新規画面固有の保存ロジック
- Collectionデータ集計
- 武器・進化・黒耀化のルール
- asset承認判定
- 画面ごとの独自theme値
- AudioMixer/haptic policy
- performance/RC判定
- 複数Phaseにまたがるnavigation分岐

### `U2BattleController`へ追加しないもの

- Result UI構築
- Collection UI構築
- JSON save/migration
- 永続強化
- asset path直書き
- AudioMixer/haptic policy
- presentation専用animation state
- performance evidence生成
- release/production approval

## Source of Truth Matrix

| Area | Source of truth |
| --- | --- |
| title / terms | `docs/title-and-term-lock-2026-06-30.md` / `docs/181-current-production-canon.md` |
| current Phase | `docs/unity-current-doc-index-2026-07-10.md` / current readiness |
| character / enemy / item / stage | `src/game/data/*` / production canon |
| runtime ownership / navigation / save | `docs/unity-runtime-ownership-contract-v1.md` |
| UI / tokens / responsive | `docs/unity-ui-design-system-v1.md` |
| generated asset contract / lineage | `docs/asset-generation-consistency-system-v1.md` |
| runtime visual approval | `docs/unity-runtime-visual-readiness-gate-v1.md` |
| current roadmap | `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md` |
| mobile/device/release QA | `docs/mobile-release-qa-gates.md` |
| performance/touch | `docs/unity-mobile-performance-budget.md` |
| readiness evidence | `docs/design-targets/generated/**/readiness.json` |
| repository automation | `scripts/quality/*` / `package.json` / `.github/workflows/*` |

## Screen Ownership Matrix

| Screen/state | Owns | Must not own |
| --- | --- | --- |
| Boot | app initialization、registry/save load | gameplay rule、art approval、release verdict |
| StageSelect | stage choice presentation、start command | battle tick、direct save mutation |
| Battle | run simulation、presentation binding | permanent save migration、Result/Collection construction |
| LevelUp/Replacement | choice presentation、selection command | inventory rule duplication、direct save |
| Result | run summary presentation、action commands | battle simulation、direct file I/O |
| Collection / 灯録 | read model、seen/new command | runtime enemy/player state |
| Settings | volume/haptic preference command | AudioMixer/device readiness verdict |

## Definition / Runtime / Save Boundary

### Definition

Immutable authoring data:

- CharacterDefinition
- WeaponDefinition
- PassiveDefinition
- RareItemDefinition
- EvolutionDefinition
- EnemyDefinition
- StageDefinition
- WaveDefinition
- CollectionEntryDefinition

### Runtime State

1run内で変化し、run終了で破棄可能:

- RunState
- PlayerState
- InventoryState
- WaveRuntimeState
- EnemyInstanceState
- RewardState

### Save DTO

versioned JSONへ保存する永続データ:

- schemaVersion
- stable unlock IDs
- permanent upgrades
- collection seen/new IDs
- achievements
- settings

禁止:

- ScriptableObject、Sprite、Prefab、AssetReferenceをsave
- displayNameをidentityとしてsave
- UI componentから直接file I/O
- ID renameをmigrationなしで実施
- write failureで既存saveを破壊

## UI Implementation Lock

新規・変更画面は次を必須にします。

1. Theme token
2. Visual State
3. 9-slice / Sprite Border
4. Responsive Layout Profile
5. Base -> Variant最大2階層
6. UI import policy
7. Component Catalog
8. Compact / Standard / Large evidence
9. pause / tap / navigation regression
10. proof / candidate / production / product approval分離

生成された完成画面画像へtext/controlを焼き込み、runtime UIとして直貼りしません。

## Asset Implementation Lock

新しい生成assetは次を揃えるまでproductionへ接続しません。

- Asset Generation Contract
- Golden Reference
- 4候補比較またはdocumented existing-source lineage
- prompt / reference / output hash
- Generation Lineage
- automatic QA
- human review
- `approvedAsFinal=true`
- `runtimeApproved=true`
- gameplay-size review
- production provider/registry connection
- runtime verification evidence

Point Filter、file名、object名、透過、指定寸法だけではvisual承認になりません。

## Device / Release Lock

- Simulatorをactual-device evidenceとして扱わない
- request hookをaudio/haptic measurementとして扱わない
- average FPSだけでperformance readyにしない
- short runだけでsustained evidenceにしない
- privacy/store説明と実装を一致させる
- secrets、certificate、provisioning profile、tokenをrepoへ保存しない

## Readiness Rule

readiness flagは実装、証跡、checkerの3つが揃った時だけtrueへ上げます。

```txt
code/runtime implementation
+ evidence or measured result
+ checker verifying both
= readiness promotion
```

禁止:

- docsだけ変更してREADYを上げる
- checker文字列だけ満たす
- Simulator結果を実機結果へ流用
- candidate referenceをruntime finalへ流用
- 旧Phaseの成功を現在Phaseの成功として使う
- 1つのPhase成功から次Phaseを自動昇格

## 大規模実装の標準単位

1 Phase / 1 responsibility / 1 evidence familyを基本にします。

各Phaseに必要:

- baseline HEAD / branch / worktree
- goal / non-goals
- changed runtime owners
- migration / save impact
- visual / audio / performance impact
- tests / checker
- screenshots / logs / raw evidence
- readiness changes
- P0/P1/P2
- known issues
- commit / push / CI

## Stop Conditions

次の場合は次Phaseへ進まず修正します。

- source of truthが2つあり現在値が違う
- proof/candidate assetがproduction経路に入る
- U48 visual workが理由なくU49へ再混入する
- navigation/pause ownerが複数になる
- overlay中にbattleが進む
- save schema変更にmigrationがない
- new UIがTheme/responsive policyを無視する
- Sprite Mode Singleをanimated spriteとして扱う
- procedural fallbackをproduction evidenceとして承認する
- Editor/Simulatorだけでdevice/audio/haptic/performanceを昇格する
- P0/P1が残る
- checkerが実装ではなく文言だけを見る
- local unpushed workを破壊する統合方法しかない

## Preflight

静的control-plane確認:

```sh
pnpm implementation:preflight:check
```

既存checker、asset、test、buildを含む完全確認:

```sh
pnpm implementation:preflight:full
```

GitHub connectorだけで編集した場合、local command、Unity compile、Simulator、actual-deviceを実行済みと記録しません。GitHub Actions結果はlocal/device evidenceとは分離して報告します。

## Final rule

大きな差分より、次の実装者が現在地を誤認せず、同じevidence/checkerで再検証できる変更を優先します。
