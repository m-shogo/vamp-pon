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

つまりUnity側の実装面は実質 **Projectile / GroundArea** の2系統。

Webに`orbit`や`bouncing_projectile`があることを、Unityでも同じ挙動がproduction-readyだという証拠には使わない。

`webRuntimeSupportEqualsUnityRuntimeSupport = false`

を固定する。

Unityで実装済みprimitiveとしてAdmission Sourceが認めるのは:

1. `NEAREST_TARGET_PROJECTILE`
2. `MULTI_PROJECTILE_LOOP`
3. `CIRCULAR_GROUND_AREA`

のみ。

Selected16が必要とする:

- Status付与
- multi-target scatter
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

はまだUnity実装済み扱いにしない。

## Current admission result

**admitted=0**

**blocked=16**

これは「Selected16が悪い」という意味ではない。
Contentの設計を古いruntimeに合わせて弱めないための状態。

## Critical shared blocker

`STATUS_APPLICATION`

Selected16の多くがAttribute/Status gameplayを前提にする。

今のUnity Stage1 runtimeはdamage / projectile / circle areaを動かせるが、Content Masterの16StatusをWeapon hitへ接続するgeneric status layerを持っていない。

したがって最優先は、武器16本を個別hackすることではなく:

- enemy Status state
- duration / stack / refresh policy
- Boss conversion policy
- hit → Status apply hook
- Status visual cue
- telemetry / verification

の共通層。

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

最初に複数武器から再利用できる土台を作る。

1. `STATUS_APPLICATION`
2. enemy status container + expiry
3. `KNOCKBACK_VECTOR`
4. multi-target query
5. delayed trigger/timer primitive
6. persistent placement primitive

これで:

- `ember_matchcase`
- `bellows_fan`
- `pavement_hammer`
- `pressed_flower_cards`
- `dream_alarm`

などの実装へ進みやすくなる。

### Wave B — target selection / path executors

- `MULTI_TARGET_PROJECTILE_SELECTION`
- `TARGET_CHAIN_SELECTION`
- `HOMING_PRIORITY_SELECTION`
- `LINE_PIERCE_RESIDUE`
- `RETURNING_PROJECTILE`
- `CONE_QUERY`

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
- executorが存在する
- Status hookが存在する
- verificationがある

まで揃って初めて`IMPLEMENTED`へ上げる。

Web側も同様に、既存5 effect typeのどれかへCandidateを無理に割り当てて「対応済み」としない。

## Existing code evidence

Current source evidence:

- Web Authority = 5 current effect types
- Unity `WeaponEffectType { Projectile, GroundArea }`
- U47 importer accepts only `projectile` / `ground_area`
- `Stage1GameplayRuntimeCoordinator` branches only Projectile vs GroundArea
- Unity projectile API targets nearest enemy
- Unity GroundArea uses radius + pooled actor

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

Admission Gateの次はWave A。

特に`STATUS_APPLICATION`とenemy status containerを共通primitiveとして実装し、少なくとも1本を:

- definition
- runtime executor
- mobile visual cue
- simulator verification
- regression CI

まで通して初めて`admitted`を0→1以上へ上げる。
