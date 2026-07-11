# ヨルノシルベ Unity Runtime Ownership Contract v1

U46は`AppFlowCoordinator`、`RunPauseCoordinator`、`SaveService`、Result/Collection read modelでこの境界を実装した。UIはcommand forwardingのみを行う。

Date: 2026-07-10
Status: adopted architecture boundary / implementation follows incrementally

## 目的

大きな実装で`U1Stage1SceneBootstrap`、`U2BattleController`、各UI componentへ責務が集中しないよう、所有者と通信方向を固定する。

これは全面refactor命令ではない。触る機能から段階的に移行するための契約である。

## 原則

1. Definitionは不変データ。
2. Runtime Stateは1run内の変化。
3. Save DTOは永続化専用。
4. Presentationはcommandを送るが、gameplay/saveを直接実装しない。
5. pause/navigationは単一ownerを通す。
6. asset providerはasset取得だけを担当し、承認判定をruntimeへ持ち込まない。
7. evidence/readinessはruntime stateではない。

## Target Runtime Layers

```txt
GameApp
├─ BootCoordinator
├─ AppFlowCoordinator
├─ DataRegistry
├─ SaveService
└─ RuntimeVisualAssetProvider

Run
├─ RunCoordinator
├─ RunState
├─ PlayerState
├─ InventoryState
├─ WaveRuntimeState
└─ RewardState

Combat
├─ PlayerController
├─ EnemySystem
├─ WeaponSystem
├─ ProjectileSystem
├─ PickupSystem
└─ DamageSystem

Presentation
├─ StageSelectPresenter
├─ BattleHudPresenter
├─ LevelUpPresenter
├─ ResultPresenter
├─ CollectionPresenter
├─ CameraFeedback
├─ VfxFeedback
└─ AudioHapticBridge
```

実クラス名は段階実装で調整可能だが、責務の混在は禁止する。

## AppFlow State

最低限の状態:

```txt
Boot
StageSelect
Running
LevelUpModal
Result
Collection
```

許可する主な遷移:

```txt
Boot -> StageSelect
StageSelect -> Running
Running -> LevelUpModal -> Running
Running -> Result
Result -> Running        // Retry
Result -> StageSelect
StageSelect -> Collection
Collection -> StageSelect
```

禁止:

- UI Buttonがscene objectを直接探索して複数ownerへ命令する
- ResultからBattleの内部fieldを直接初期化する
- Collectionをbattle overlayとして常時生成する
- 画面ごとに別々のpause実装を持つ

## Pause Ownership

pauseは`AppFlowCoordinator`または専用`RunPauseCoordinator`のみが所有する。

推奨reason:

```txt
StageSelect
LevelUp
Result
SystemMenu
ApplicationPause
```

複数reasonがある場合、最後の1つが解除されるまでrunを再開しない。

UI componentは`Time.timeScale`を直接変更しない。
既存の`SetOverlayBattlePaused`は移行中のadapterとして維持できるが、新規overlayは単一pause ownerへcommandを送る。

pause時に止めるもの:

- enemy spawn
- enemy movement
- projectile movement
- pickup movement/collection
- run timer
- player movement
- combat input

pause時も許可するもの:

- overlay UI animation
- button interaction
- accessibility focus
-必要最小限のUI feedback

## Command Boundary

Presentationから送るcommand例:

```txt
StartStage(stageId)
SelectLevelUpChoice(choiceId)
CompleteRun(result)
RetryRun()
ReturnToStageSelect()
OpenCollection()
CloseCollection()
MarkCollectionSeen(entryId)
```

Presentationはcommand結果を受け、表示更新する。
Presentationが直接行わないもの:

- enemy生成
- inventory mutation
- save file write
- asset approval
- definition rewrite

## Definition Ownership

`DataRegistry`はimmutable definitionの検索入口。

必要なlookup例:

```txt
GetCharacter(id)
GetWeapon(id)
GetPassive(id)
GetRareItem(id)
GetEvolution(id)
GetEnemy(id)
GetStage(id)
GetCollectionEntry(id)
```

IDが見つからない場合は、黙って別IDへfallbackせず、明示的なerror/evidenceを残す。

Definitionはruntime中に書き換えない。

## Runtime State Ownership

`RunCoordinator`がrun lifecycleを所有する。

```txt
CreateRun(stageId, characterId)
StartRun()
PauseRun(reason)
ResumeRun(reason)
CompleteRun(outcome)
ResetRunForRetry()
DisposeRun()
```

`RunState`は最低限以下を持つ。

```txt
runId
stageId
characterId
elapsedTime
level
experience
hp
inventory state
wave state
reward state
outcome
```

ScriptableObject definitionをruntime stateとして使わない。

## Save Ownership

`SaveService`だけが永続化を所有する。

最低契約:

```txt
Load()
Save(snapshot)
CreateDefault()
Migrate(fromVersion, payload)
Validate(snapshot)
```

Save DTO:

```txt
schemaVersion
createdAt
updatedAt
unlockedCharacterIds
unlockedStageIds
permanentUpgrades
collectionSeenIds
achievementIds
settings
```

保存しないもの:

- Sprite
- GameObject
- Component
- ScriptableObject instance
- prefab path
- displayName
- runtime Transform

save timing:

- stage clear/fail確定後
- permanent upgrade確定後
- Collection seen更新時はdebounceまたは画面終了時
- settings変更時
- application pause/quit時はbest effort

戦闘Updateごとにsaveしない。

初期MVPではcloud saveを導入しない。

## Result Read Model

Result画面へbattle objectを直接渡さず、immutable read modelへ変換する。

例:

```txt
RunResultViewModel
├─ outcome
├─ stageId
├─ elapsedTime
├─ defeatedEnemyCount
├─ collectedFragments
├─ reachedLevel
├─ rewards[]
└─ unlocks[]
```

Result presenterはViewModelを描画するだけで、報酬計算やsave migrationを実装しない。

## Collection Read Model

Collectionはdefinitionとsave snapshotからread modelを生成する。

例:

```txt
CollectionEntryViewModel
├─ id
├─ category
├─ title
├─ description
├─ iconKey
├─ unlocked
├─ seen
├─ newIndicator
└─ progress
```

Collection UIはWeb dataやUnity asset pathを直接解析しない。

## Asset Provider Ownership

proof:

```txt
U5ProofAssetProvider
IsProofOnly=true
```

candidate runtimeは別classを使用し、approval levelを明示する。

candidate provider条件:

- `IsProofOnly=false`
- `ApprovalLevel=Candidate`
- `IsProductionApproved=false`
- proof pathを返さず、candidate sourceであることを隠さない
- candidate runtime asset registryを参照する
- missing required assetをprocedural production表示へ黙ってfallbackしない
- development fallbackはcompile defineまたは明示debug設定で限定する

production provider条件:

- `ApprovalLevel=Production`
- `IsProductionApproved=true`
- registry内assetが`approvedAsFinal=true`かつ`runtimeApproved=true`
- device gameplay-size visual review済み

Asset Providerは`approvedAsFinal`を決めない。承認結果をregistryから読むだけにする。

## UI Ownership

Presenter/Viewは以下を所有する。

- label/icon/state binding
- Visual State
- Theme token
- responsive metrics
- user command forwarding
- local animation

所有しないもの:

- battle rule
- reward calculation
- save migration
- asset import
- definition mutation

## Existing Transitional Classes

### U1Stage1SceneBootstrap

現状:

- camera
- roots
- player
- HUD
- battle
- StageSelect
- Result
- LevelUp接続

を作成する移行bootstrap。

方針:

- 今すぐ全面rewriteしない
- U45.1でvisual provider/animatorを分離済み
- U46でAppFlow/Result/Collection presenterを分離
- U47でdata/runtime state ownerを分離
- 新規機能を直接追加し続けない

### U2BattleController

現状:

- spawn
- projectile
- EXP
- VFX
- HUD update
- LevelUp notifier

を持つprototype controller。

方針:

- U45.1でvisual animation ownerを分離済み
- U46でResult/Collectionを追加しない
- U47でWeapon/Inventory/Progressionをsubsystemへ分離
- SaveServiceを参照させない

## Dependency Direction

許可:

```txt
Presentation -> Command Interface -> AppFlow/Run
Run -> Definition Registry
Save -> DTO / migration
Asset Provider -> approved asset registry
```

禁止:

```txt
Definition -> runtime scene object
UI -> JSON file
Battle -> Collection screen
Save -> Sprite/Prefab
Asset Provider -> gameplay state
```

## Testing Boundary

最低限unit/static test可能にするもの:

- AppFlow transition
- pause reason stack
- run create/reset/complete
- save default/load/migrate/validate
- Result view model generation
- Collection view model generation
- ID lookup failure
- proof provider rejection

Simulator/PlayModeで確認するもの:

- actual button route
- overlay pause
- retry
- StageSelect return
- input collision
- visual binding

## Completion Rule

architecture docがあるだけでは実装済みではない。
各ownerは、実class、test、evidence、checkerが揃ったPhaseでimplementedへ上げる。
