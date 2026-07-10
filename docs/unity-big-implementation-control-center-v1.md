# ヨルノシルベ Unity Big Implementation Control Center v1

Date: 2026-07-10
Status: adopted / 大規模実装の単一入口

## 目的

U45.1以降のキャラクター、敵、Result、灯録、保存、武器、進化、黒耀化、音、モバイル最適化を追加する前に、仕様・責務・デザイン・素材・readinessの入口を1つへ整理する。

この文書は「全部完成した」という宣言ではない。
今後の実装者が古いU1資料、proof用asset、画面ごとのローカル値、静的checkerの一部だけを根拠に進めないための制御面である。

## 読む順番

1. `docs/unity-big-implementation-control-center-v1.md`
2. `docs/181-current-production-canon.md`
3. `docs/unity-runtime-ownership-contract-v1.md`
4. `docs/unity-runtime-visual-readiness-gate-v1.md`
5. `docs/unity-ui-design-system-v1.md`
6. `docs/asset-generation-consistency-system-v1.md`
7. `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`
8. 対象Phaseの個別doc / evidence / checker

古い資料と矛盾した場合は、上記、`src/game/data/*`、現行Unity runtime、最新evidence/checkerを優先する。

## 現在の事実

```txt
Unity Editor: 6000.5.1f1
Render Pipeline: 2D URP
Runtime UI: uGUI
Reference viewport: 390x844 portrait
Responsive tiers: Compact / Standard / Large
Bundle Identifier: com.mshogo.vamppon.u1
```

```txt
simulatorPlayableCandidateReady=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
runtimeVisualReady=true
productionCharacterAssetReady=false
productionEnemyAssetReady=false
candidateAssetsApprovedAsFinal=false
rcReady=false
productionApproved=false
```

Simulator smokeはroute、pause、input、hit、pickup、LevelUp、Result、Retry、crash有無の証跡であり、キャラクター美術、実機操作感、音、振動、性能、production承認の証跡ではない。

## 現在の実装順

### Foundation Gate

大規模Phaseへ入る前に本書、runtime ownership contract、現行readiness、Design System、Asset Generation Contract、umbrella preflightを維持する。

### U45.1 Character and Enemy Dot Runtime Pass

完了。U46以降でprovider、animation、pause、candidate/final境界を壊さない。

必須:

- `U5ProofAssetProvider`をproduction経路から外す
- production visual providerを接続する
- ユイをSprite Mode Multipleへ移行する
- idle / walk / hurt / attackを実装する
- 左右向き、ランタン、バッグ、装備位置を検証する
- オンブをSprite Mode Multipleへ移行する
- idle / move / hurt / deathを実装する
- procedural fallbackを通常production経路から外す
- Golden Identity Reference / Lineage / gameplay-size reviewを揃える
- Simulator regressionを再実行する

### U46 Result / Retry / StageSelect / 灯録

U45.1とFoundation Gateを壊さず、非戦闘shellを製品品質化する。

必須:

- Resultと灯録の画面責務をbattle controllerへ入れない
- navigationとpauseは単一coordinatorを通す
- save DTOとdefinitionをUIから直接変更しない
- Theme / Visual State / Responsive Profile / Base→Variantを使用する
- Compact / Standard / Largeを確認する

### U47 Gameplay Data Runtime

武器、持ち物、忘れ物、進化、黒耀化を段階接続する。

必須:

- definition / runtime state / save DTOを分離する
- Web正本からのID互換を維持する
- battle controllerへ画面生成や保存処理を追加しない
- drop、進化、復帰、黒耀化のstate transitionをtest可能にする

### U48以降

残りの背景、VFX、全asset replacement、音、振動、性能、RCを証跡付きで進める。

## 変更禁止ではなく責務禁止

既存の`U1Stage1SceneBootstrap`と`U2BattleController`は移行途中の大きなクラスである。
今すぐ全面rewriteはしないが、次を追加しない。

### `U1Stage1SceneBootstrap`へ追加しないもの

- 新規画面固有の保存ロジック
- Collectionデータ集計
- 武器・進化・黒耀化のルール
- asset承認判定
- 画面ごとの独自theme値
- 複数Phaseにまたがるnavigation分岐

### `U2BattleController`へ追加しないもの

- Result UI構築
- Collection UI構築
- JSON save
- 永続強化
- asset path直書き
- AudioMixer設定
- presentation専用animation state

触る機能から、`docs/unity-runtime-ownership-contract-v1.md`に定義したownerへ移す。

## Source of Truth Matrix

| Area | Source of truth |
| --- | --- |
| title / terms | `docs/title-and-term-lock-2026-06-30.md` / `docs/181-current-production-canon.md` |
| character / enemy / item / stage | `src/game/data/*` / `docs/181-current-production-canon.md` |
| runtime ownership / navigation / save boundary | `docs/unity-runtime-ownership-contract-v1.md` |
| UI components / tokens / responsive | `docs/unity-ui-design-system-v1.md` |
| generated asset contract / lineage | `docs/asset-generation-consistency-system-v1.md` |
| runtime visual approval | `docs/unity-runtime-visual-readiness-gate-v1.md` |
| current phase order | `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md` |
| mobile performance | `docs/unity-mobile-performance-budget.md` |
| mobile release QA | `docs/mobile-release-qa-gates.md` |
| readiness evidence | `docs/design-targets/generated/**/readiness.json` |
| repository automation | `scripts/quality/*` / `package.json` |

## Screen Ownership Matrix

| Screen/state | Owns | Must not own |
| --- | --- | --- |
| Boot | app initialization, registry load, save load | gameplay rules, screen art approval |
| StageSelect | stage choice presentation, start command | battle ticking, direct save mutation |
| Battle | run simulation and presentation binding | permanent save migration, Collection UI |
| LevelUp | choice presentation and selection command | direct inventory implementation details |
| Result | run summary presentation and action commands | battle simulation, direct file I/O |
| Collection / 灯録 | read model and seen/new commands | runtime enemy/player state |

## Definition / Runtime / Save Boundary

### Definition

Immutable authoring data. ScriptableObjectまたは生成済みregistry。

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

1run内で変化し、run終了で破棄可能。

- RunState
- PlayerState
- InventoryState
- WaveRuntimeState
- EnemyInstanceState
- RewardState

### Save DTO

versioned JSONへ保存する永続データ。

- schemaVersion
- permanent upgrades
- unlock IDs
- collection seen/new IDs
- achievements
- settings

禁止:

- ScriptableObjectそのものをsaveする
- Sprite、Prefab、AssetReferenceをsaveする
- displayNameをidentityとしてsaveする
- UI componentから直接file I/Oする
- ID renameをmigrationなしで行う

## UI Implementation Lock

新規画面は次を必須にする。

1. Theme token
2. Visual State
3. 9-slice / Sprite Border
4. Responsive Layout Profile
5. Base→Variant最大2階層
6. UI import policy
7. Component Catalog確認
8. 390x844 + Compact + Large screenshot
9. pause / tap / navigation regression
10. candidate/final/runtime承認分離

## Asset Implementation Lock

生成assetは次を揃えるまでproductionへ接続しない。

- Asset Generation Contract
- Golden Reference
- 4候補比較
- prompt / reference / output hash
- Generation Lineage
- automatic QA
- human review
- approvedAsFinal=true
- runtimeApproved=true
- gameplay-size visual review

Point Filter、ファイル名、object名、透過、指定寸法だけではvisual承認にならない。

## Readiness Rule

readiness flagは実装、証跡、checkerの3つが揃った時だけtrueへ上げる。

```txt
code/runtime implementation
+ evidence or measured result
+ checker verifying both
= readiness promotion
```

禁止:

- docsだけ変更してREADYを上げる
- checker文字列だけ満たす
- Simulator結果を実機結果へ流用する
- candidate referenceをruntime finalへ流用する
- 旧Phaseの成功を現在Phaseの成功として使う

## 大規模実装の標準単位

1 Phase / 1責務 / 1evidence familyを基本にする。

各Phaseに必要:

- goal
- changed runtime owners
- non-goals
- migration impact
- visual impact
- save impact
- performance impact
- test/checker
- screenshots/logs
- readiness changes
- known issues
- commit/push

## Stop Conditions

次の場合は次Phaseへ進まず修正する。

- source of truthが2つあり値が違う
- proof/candidate assetがproduction経路に入る
- navigationの戻り先が不明
- overlay中にbattleが進む
- save schema変更にmigrationがない
- new UIがThemeを無視する
- Sprite Mode Singleをanimated spriteとして扱う
- procedural fallbackをproduction画面として承認する
- P0/P1 visual issueが残る
- checkerが実装ではなく文言だけを見ている

## Preflight

静的control-plane確認:

```sh
pnpm implementation:preflight:check
```

既存checker、test、buildを含む完全確認:

```sh
pnpm implementation:preflight:full
```

GitHub接続だけで編集した場合、ローカル実行済みと記録しない。

## 現在の結論

大規模実装の設計整理とU45.1 candidate animation runtimeは完了したが、最終美術・実機・製品承認がreadyという意味ではない。
次はU46でnavigation/save/read modelを契約どおり実装する。
