# ヨルノシルベ Base Weapon Selection Source v1

## Status / Authority

- Scope: Title1 Base Weapon family selection
- Source: `src/game/data/baseWeaponSelectionSource.ts`
- Gameplay detail: `src/game/data/baseWeaponSelectionGameplaySource.ts`
- Authority: **CONTENT_SOURCE_ONLY**
- 目的母体: **24-28** Base Weapon families
- Current runtime weaponをこの選定だけで置換しない。
- Holdは削除ではなくCandidate reservoir維持。

## 結論

**Current8 + Selected16 = 24** familyをTitle1の第一選定とする。

Candidate20を全部採用しない。
4本は具体的なreadability / control density / return-family overlap / mobile performance riskがあるためHoldする。

これは24という数字への**数合わせ**ではない。

Current21のstarting plan、Stage用途、属性入口、attack shape、Fusion用途を残したうえで、「今入れるより一段検証した方が良い4本」が結果としてHoldになった。

## Selected 16

- `ember_matchcase` — scatter/status distribution
- `rain_thread` — two-target tether
- `bellows_fan` — cone push / route control
- `copper_tuning_fork` — conductive pulse chain
- `pavement_hammer` — directional slam / Break
- `pressed_flower_cards` — armed trap field
- `dream_alarm` — delayed pulse
- `star_map_pin` — far-priority homing snipe
- `white_eraser` — bounded sweep cleanse
- `pocket_mirror` — reflect counter
- `black_folding_fan` — tracking-friction veil
- `wick_needle` — line pierce + BURN seam
- `return_compass_needle` — outbound + return homing
- `repair_thread_spool` — orbit stitch
- `sleep_ribbon` — spiral control
- `boundary_chalk` — single crossing boundary

Selected16は16 archetypeを保つ。
色違いprojectileを16本追加する設計ではない。

## Hold 4

### `frost_window`

Decision: `HOLD_TEMP_TERRAIN_DENSITY`

ICE lane wallは良いが、

- Current月のしおりcontrol
- 境界チョーク
- Stage lane / hazard

と同時に入れると、スマホ画面上の「線」が増えすぎる可能性がある。

Enemy pathingとmobile readabilityを実機確認してから再評価する。

### `repair_spanner`

Decision: `HOLD_RETURN_FAMILY_OVERLAP`

returning weaponとしては面白いが、

- Current紙ひこうき
- Selected帰針

を先に差別化する。

帰り道の角度そのものが独自Build判断になるまでHold。

### `name_reel`

Decision: `HOLD_TARGET_LINK_READABILITY`

MEMORY link chainは魅力的だが、

- ユイのNight Pencil MARKED
- relation assistの接続線
- Enemy tether / route line

と視覚的に競合しやすい。

文字UIへ逃げずにlinkを読めるvisual grammarが固まるまでHold。

### `morning_dew_dropper`

Decision: `HOLD_TRAIL_PERFORMANCE`

movement trailは独自だが、

- BURN seam
- Stage residue
- trap
- boundary line

と床情報を競合する。

trail emitter performanceとmobile floor readabilityを測ってから再評価する。

## Current21 starter boundary

Current21 Combat KitでCandidate starting weaponに使うfamilyは、Title1 Selected側に残す。

つまり、Character原本で「starter候補」とした武器が、この選定でいきなりHoldへ落ちる矛盾を作らない。

Hold4はCurrent21 starter planに使っていないCandidateから選ぶ。

ただしSelectedもruntime実装済みという意味ではない。
すべてCandidateのまま `CONTENT_SOURCE_ONLY`。

## Attribute coverage

Current Base Weapon + Selected16で14属性Vocabularyを扱える状態を維持する。

武器1本で全属性を埋める必要はない。

- MEMORY / ICE等はCurrent Base Weapon側も活用
- THUNDERは銅の音叉を重要なbuild入口として残す
- LIGHT / DARKはdamage善悪ではなくreflect / veil等のutilityにも使う

NEUTRALは無属性枠であり、専用「無属性Candidateを数合わせで追加」しない。

## Selected gameplay spec

Selected16は選定理由だけで終わらない。

`baseWeaponSelectionGameplaySource.ts` で、各武器について最低限:

- attack archetype
- attributes
- Status
- **scaling** intent
- **weakness**
- build compensation / counterplay
- Character affinity
- Stage affinity
- required runtime hook
- VFX safety
- audio cue
- runtime evolution boundary
- **Fusion / Synthesis / Awakening** hooks

を接続する。

## Scaling rule

scalingは「projectile count +100%」の共通強化にしない。

例:

- scatter: BURN distribution / scatter角 / capped pierce
- tether: status共有 / reconnect tempo / line count cap
- cone push: route control / push安定性
- slam: Break / directional crack length
- trap: arming / placement / status buildup
- delayed pulse: prediction reward
- reflect: counter window / return precision
- veil: tracking friction
- line stitch: pierce + seam
- boundary: crossing effect / relocate tempo

attack shapeそのものの面白さを伸ばす。

## Weakness / compensation

全Selected Weaponに明確なweaknessを持たせる。

単体で全Stage・全Enemyへ最適にはしない。

例:

- Homing snipe → swarmに弱い → scatter/trapで補う
- Trap → fast/rangedに弱い → push/tetherで誘導
- Reflect → contactに弱い → Break/route weaponを混ぜる
- Slam → windup/背面に弱い → mobility/far weaponで補う
- Veil → lane/ground pressureには弱い → EARTH/BLANKで回答

「弱いから使えない」ではなく、二本目・Reaction・Itemを考える弱点にする。

## Transformation boundary

Candidate Base Weaponへruntime evolutionを勝手に生やさない。

`runtimeEvolutionId = null`

のまま、既存Candidateの:

- Fusion
- Synthesis
- Awakening

だけをinput IDから自動接続する。

これによりTransformation Sourceとの二重管理を避ける。

既存Fusion例:

- 火種のマッチ箱 + 送り風の扇
- 雨縫い糸 + 銅の音叉
- ひび鏡 + 黒折り扇
- 星図のピン + ひび鏡
- 継ぎ糸車 + 火種のマッチ箱
- 眠りのリボン + 月のしおり
- 境界チョーク + 街灯の輪

## Runtime promotion boundary

Selectedは「Title1で優先して実装検証するCandidate」。Production Readyではない。

次工程:

1. runtime hook implementation
2. base damage / interval / status buildup scaling
3. mobile readability
4. Stage20 playtest
5. Character starter validation
6. Fusion/Synthesis interaction test
7. VFX/audio budget
8. Current promotion review

を通してからCurrent runtimeへ昇格する。
