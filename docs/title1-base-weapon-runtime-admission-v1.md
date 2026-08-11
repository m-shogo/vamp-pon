# ヨルノシルベ1 Base Weapon Runtime Admission v1

## Purpose

Content Masterで選定した**Selected16**を、既存runtimeへ形だけ押し込まないためのAdmission Gate。

Content側では16本ともTitle1採用のまま。
Runtime側では必要primitiveが実装されるまでfail closedする。

## Cross-runtime reality

WebとUnityは同じ「runtime」という言葉でも現在の実装面が異なる。

### Web runtime = 5 effect types

既存Authority:

`src/game/domain/weaponRuntimeCapabilities.ts`

現在のlive effect surface:

1. `projectile`
2. `radial_random_projectile`
3. `bouncing_projectile`
4. `ground_area`
5. `orbit`

この5件は既存Web runtimeの正本をそのまま参照する。Admission側で別リストを二重管理しない。

### Unity runtime = 2 executor types

U47 gameplay runtimeのimport/executorは現在:

- nearest-target **Projectile**
- circular **GroundArea**

つまりUnity側のexecutor分類は **Projectile / GroundArea** の2系統のまま。

ただし内部primitiveはexecutor enumより先に拡張している。
Webに`orbit`や`bouncing_projectile`があることを、Unityでも同じ挙動がproduction-readyだという証拠には使わない。

`webRuntimeSupportEqualsUnityRuntimeSupport = false`

を固定する。

Unityで実装済みprimitiveとしてAdmission Sourceが認めるのは:

1. `NEAREST_TARGET_PROJECTILE`
2. `MULTI_PROJECTILE_LOOP`
3. `CIRCULAR_GROUND_AREA`
4. `MULTI_TARGET_PROJECTILE_SELECTION`

`MULTI_TARGET_PROJECTILE_SELECTION` は reusable scratch / targetable-only / deterministic nearest prefix / caller target cap / canonical target spawnまで実コードとCIで確認済み。

Selected16がまだ必要とする主なprimitive:

- real Selected16 callerからのStatus付与
- tether
- cone query
- knockback vector
- conductive chain
- directional slam
- returning projectile
- trap persistence
- delayed trigger
- priority homing
- sweep/cleanse
- reflect window
- DARK veil tracking friction
- line residue
- orbit link
- spiral control
- lane trigger

はまだUnity admission上の実装済み扱いにしない。

## Current admission result

**admitted=0**

**blocked=16**

これは「Selected16が悪い」という意味ではない。
Contentの設計を古いruntimeに合わせて弱めないための状態。

## Critical shared blocker

`STATUS_APPLICATION`

Selected16の16/16がAttribute/Status gameplayを前提にする。

現在は共通基盤そのものは存在する:

- Status16 runtime state
- duration / stack / magnitude / refresh policy
- independent internal cooldown ledger
- Boss hard-control disposition
- `U2EnemyActor` ownership / pool reset / Tick
- typed `EnemyStatusApplicationRequest`
- Projectile hitからStatusを適用できるoptional transport

しかし **real Selected16 live callerがまだ0**。

Generic hookが存在するだけで`STATUS_APPLICATION=IMPLEMENTED`へ上げると、武器が実際には一度もStatus requestを作っていないのにadmittedできてしまう。
そのためAdmission上は、少なくとも1本のSelected16が実際にtyped requestを生成し、hit→enemy Statusへ到達する証拠ができるまで`MISSING`を維持する。

次の最優先は武器16本を個別hackすることではなく、最小vertical sliceで:

- Candidate runtime definition/policy
- real Selected16 caller
- typed Status request
- multi-target/target primitive
- runtime visual cue
- telemetry / verification

を一続きにすること。

## Never use fake projectile fallback

禁止:

- `bellows_fan` をただのProjectileにする
- `rain_thread` を色違い弾にする
- `pocket_mirror` をdamage弾にする
- `repair_thread_spool` をWebの`orbit`があるという理由だけでUnity実装済みにする
- `sleep_ribbon` を円形GroundAreaとして実装済み扱いする

`fake projectile` fallbackは許可しない。

`contentSelectionMayBeDowngradedToFitRuntime = false`

を守る。

## Implementation waves

Waveは優先順であり、時間見積もりではない。

### Wave A — shared combat primitives

共通土台の現状:

- enemy Status container + expiry: **implemented**
- typed Projectile Status transport: **implemented**
- multi-target query: **implemented**
- `KNOCKBACK_VECTOR`: missing
- delayed trigger/timer primitive: missing
- persistent placement primitive: missing

`STATUS_APPLICATION`自体はgeneric plumbing完成ではなく、**real Selected16 caller evidence**までをAdmission条件とするためMISSINGを維持。

これで最初に進めやすいのは `ember_matchcase`。
Multi-target側はすでに揃っており、残る高位blockerはreal Status application pathだけ。

### Wave B — target selection / path executors

- `MULTI_TARGET_PROJECTILE_SELECTION`: **implemented**
- `TARGET_CHAIN_SELECTION`: missing
- `HOMING_PRIORITY_SELECTION`: missing
- `LINE_PIERCE_RESIDUE`: missing
- `RETURNING_PROJECTILE`: missing
- `CONE_QUERY`: missing

対象例:

- 火種のマッチ箱
- 銅の音叉
- 星図の針
- 灯芯針
- 帰針
- 送り風の扇

### Wave C — advanced interaction executors

- `TWO_TARGET_TETHER`
- `REFLECT_WINDOW`
- `VEIL_TRACKING_FRICTION`
- `ORBIT_LINK`
- `SPIRAL_FIELD`
- `LANE_BOUNDARY_TRIGGER`
- `SWEEP_QUERY`

対象例:

- 雨縫い糸
- ポケット鏡
- 黒折り扇
- 修理糸車
- 眠り紐
- 境界チョーク
- 白消し

## Why not expand WeaponEffectType immediately

enumへ名前だけ20個増やしてもexecutorが動かなければ意味がない。

Admissionは:

- Definitionがある
- importerが通る
- executor / reusable primitiveが存在する
- required Status pathが存在する
- real caller evidenceがある
- verificationがある

まで揃って初めて`IMPLEMENTED`へ上げる。

Web側も同様に、既存5 effect typeのどれかへCandidateを無理に割り当てて「対応済み」としない。

## Existing code evidence

Current source evidence:

- Web Authority = 5 current effect types
- Unity `WeaponEffectType { Projectile, GroundArea }`
- U47 importer accepts only `projectile` / `ground_area`
- `Stage1GameplayRuntimeCoordinator` branches only Projectile vs GroundArea
- Unity nearest-target Projectile API
- Unity deterministic multi-target target-selection primitive
- Unity typed optional Projectile Status request transport
- Unity Enemy Status16 state / lifecycle ownership
- Unity GroundArea uses radius + pooled actor
- Selected16 live multi-target caller = 0
- Selected16 live Status request caller = 0

これらのコードが変わったらAdmission checkerを更新しない限りCIを落とす。

## CONTENT_MASTER boundary

Selected16はContent Master上では確定したTitle1候補。

runtime admissionがblockedでも:

- Hold4へ降格しない
- 名前を消さない
- Character affinityを変えない
- Stage用途を消さない
- Transformation graphを勝手に変えない

Runtime不足をContent不足として処理しない。

## Next implementation gate

Admission Gateの次は、`ember_matchcase`を最初のvertical sliceとして:

- Candidate runtime definition / prototype policy
- deterministic multi-target caller
- typed `BURN` Status request
- actual enemy Status application
- mobile visual cue
- runtime capture / telemetry
- regression CI

まで一続きにする。

ここまで実証して初めて、`STATUS_APPLICATION`と`ember_matchcase`のAdmission昇格を検討する。
数値balanceはprototype tuningとして分離し、Content Canonへ固定しない。
