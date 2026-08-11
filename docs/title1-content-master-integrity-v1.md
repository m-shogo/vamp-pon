# ヨルノシルベ1 Content Master Integrity v1

## Purpose

Title1の主要Content Authorityを一枚で確認し、個別Sourceが増えた結果の矛盾を防ぐためのintegrity map。

この資料は各詳細Sourceを置換しない。
正本の場所と現在の確定境界をまとめる。

## Current integrated picture

- **Stage20**
- **Current21** Character
- **Enemy48**
- **Spotlight8** = Enemy48から人物級へ深掘りした看板敵8体
- Current relationship inventory = 24 arcs / Current21全員coverage
- Relationship speech = 24 relation × 双方向 = **48 directional** track
- Group interaction = 12 small-group lanes / first+repeat = 24 intermission placements
- Spotlight Enemy story = 8 enemies × 3段階 = **24 fragment**
- **14属性 + NEUTRAL**
- **16Status**
- **12Reaction**
- **Base24** = Current8 + Selected16 / Hold4
- **Combat Item18** = PASSIVE14 + FIELD_ITEM2 + RARE_SUPPORT2
- **Transformation38** = **Selected29 / Hold9**
- Runtime **Achievement14** = legacy catalog
- All Lights 132 = design target only / runtime denominator未freeze
- Story Complete = 100% collectionとは別

## Authority map

### Combat vocabulary

`src/game/data/combatAffinitySource.ts`

- Attribute
- Status
- initial Reaction
- Current Weapon combat profile
- Enemy affinity

Current vocabulary:

- 14 base Attribute
- NEUTRAL
- 16Status
- 12Reaction

### Stage20

`src/game/data/series1StageCampaignContentSource.ts`

Stage1〜20を:

- Story beat
- Character meaning
- Star Beast meaning
- Enemy composition
- Attribute pressure
- Status pressure
- recommended Base Weapon
- Fusion / Item counter
- Clear Getter
- Night Record
- unlock seed
- transition

へ接続するContent Master。

Final content anchor:

`dawn_return_square`

### Current21 Character Kit

`src/game/data/currentCharacterCombatKitSource.ts`

Current21全員に:

- starting weapon plan
- Star Beast mechanic
- passive
- 黒耀化 tradeoff
- Awakening candidate link
- preferred build
- friction build
- relation assist

を持たせる。

Candidate weapon / Awakeningはruntime ownedを意味しない。

### Relationship depth

Base inventory:

`src/game/data/currentRelationshipInventory.ts`

Current24 arc / Current21全員coverage。

Directional speech:

`src/game/data/relationshipSpeechProgressionSource.ts`

- Current24を双方向に書く = **48 directional track**
- FIRST_READ / ALLY / TRUST / DEEP_TRUST / CRISIS / DAWN
- 呼び方と口調を別管理
- 全員を最終的に呼び捨てにしない
- 敬語が残っても深い信頼は成立する
- CRISISはBondの上位tierではなく、一時的に本人の長所が狭くなる状態
- numeric Bond thresholdはまだfreezeしない

Small-group life:

`src/game/data/currentGroupInteractionSource.ts`

- 12 scene lanes
- 3〜5人
- Current21全員を最低1laneへ含める
- all-cast sceneを基本にしない

Stage placement:

`src/game/data/relationshipStageIntermissionSource.ts`

- 12 group lanesをfirst / repeatの2回ずつ配置
- 24 intermission placements
- 前半と後半で同じ生活場面を反復し、呼称・任せ方・沈黙の変化を比較できる
- dialogueを読むことをcombat power条件にしない
- final script Canonではない

Relationship Inventoryは:

- romance Canon
- blood relation Canon
- Main Mystery Canon

を勝手にfreezeしない。

特に:

- ユイ × アサ = non-romance buddy
- リツ × コヨリ = sibling / non-romance

を維持する。

### Enemy48 / Spotlight8

Base identity:

`src/game/data/enemyAttributeIdentitySource.ts`

Encounter combination:

`src/game/data/enemyEncounterSynergySource.ts`

Current48は単体プロフィールだけでなく、Stage内pairingで:

- tracking
- route pressure
- seal
- pin + charge
- tempo
- build erosion

などを作る。

新しい49体目をStage Contentだけで勝手に作らない。

Spotlight Enemy character depth:

`src/game/data/spotlightEnemyCharacterSource.ts`

Enemy48から既存8体だけを選び:

- current want
- deepest fear
- contradiction
- recurring ritual
- communication style
- past story
- multiple Current21 mirrors
- defeat aftertaste

を持たせる。

Spotlight8:

1. 持ち主のない名前
2. 閉じた朝箱
3. 帰路のない夜
4. オンブロ 黒折
5. オンブロ 余白枠
6. オンブロ 継ぎ目
7. オンブロ 夢波
8. オンブロ 名札

全員を喋る元人間・改心敵へ揃えない。
過去の悲しさは現在の被害の免罪符ではない。

Story fragment progression:

`src/game/data/spotlightEnemyStoryFragmentSource.ts`

8 enemies ×:

1. THREAT_TRACE
2. PAST_FRAGMENT
3. REINTERPRETATION

= **24 fragment**。

順番は「可哀想な過去 → 戦う」ではなく:

```txt
まず現在の怖さ
↓
戦闘後に小さな痕跡
↓
後Stageで過去の一部
↓
Characterの日常 / Relationで同じ問いを見る
↓
最初の敵行動の意味が変わる
```

とする。

24 fragmentは`bestiary`へ置くContent設計だが:

- optional reading
- combat powerを与えない
- Story Completeに不要
- All Lights必須にもまだしない
- Main Mysteryの答えをfreezeしない
- runtimeへ自動昇格しない

### Base Weapon

`src/game/data/baseWeaponSelectionSource.ts`

Current8 + Candidate Selected16 = **Base24**。

Hold4:

- `frost_window`
- `repair_spanner`
- `name_reel`
- `morning_dew_dropper`

Holdは削除ではない。
mobile readability / overlap / performance検証後の再評価reservoir。

Current21 Candidate starterがHold4へ依存する状態は禁止。

### Combat Item

`src/game/data/combatItemSelectionSource.ts`

既存Candidate18をStage2〜17へ配置。

- PASSIVE 14
- FIELD_ITEM 2
- RARE_SUPPORT 2

未学習Attribute / Status / ReactionをItem説明から先バレしない。

Stage18〜20では新Combat Itemを追加せずmasteryへ集中する。

Combat Item18はlive runtime inventoryではない。

### Transformation

`src/game/data/weaponTransformationSelectionSource.ts`

Existing **Transformation38**:

- Fusion18
- Synthesis12
- Awakening8

Base24を上流Authorityとして:

- Selected29
- Hold9

へ整理。

Selected29:

- Fusion11
- Synthesis11
- Awakening7

Hold9:

- Fusion7
- Synthesis1
- Awakening1

Base Hold4を材料にするTransformationだけ先にTitle1へ入れない。
Current21が既にlinkしているAwakeningがHoldへ落ちる状態も禁止。

### Unlock / learning

`src/game/data/title1UnlockLearningProgressionSource.ts`

- Stage1: Attribute 2つから開始
- all 14 base Attribute: Stage16まで
- all 16Status: 段階導入
- all 12Reaction: Stage18まで
- Stage19〜20: mastery

Stage1で14属性一覧や12Reaction表を全部見せない。

### Ending / Collection

`src/game/data/title1EndingCompletionBoundarySource.ts`

4層を分離:

1. Story Complete
2. Game Complete
3. Mastery
4. 100% / All Lights

Story Complete / Happy Endに:

- All Lights
- Achievement全取得
- Combat Item18全取得
- Transformation29全取得
- Night Record全読了
- Spotlight Enemy story fragment全読了
- Future15

を要求しない。

All Lights Current design:

- Stage 20
- Keeper 21
- Character named-object lineage 21
- Kagemono 48
- Bond proof 21
- Night margin 1

= **All Lights 132** design target。

ただし `runtimeFrozen=false`。

`item_lineages=21` はCombat Item18ではない。
`bonds=21` はRelationship Arc24をそのまま意味しない。
Spotlight8の24 fragmentもAll Lights denominatorへ自動加算しない。

## Runtime versus Content Master

次のSource群は**CONTENT_SOURCE_ONLY**境界を持つ:

- Base Weapon Candidate
- Combat Item Candidate placement
- Transformation Candidate selection
- Unlock learning content
- Ending/completion content policy
- Relationship Speech progression
- Group interaction / intermission placement
- Spotlight Enemy character depth / story fragment

Content Masterで決まったからといって自動で:

- inventoryへ追加
- saveへ保存
- numerical tuning確定
- Production Ready
- credits condition変更
- 100% denominator freeze
- runtime voiceを差し替え
- enemy spawnを増やす

を行わない。

## Cross-master invariants

### 1. Character

Current21は:

- Kitあり
- Relation laneあり
- starting planあり
- Star Beast mechanicあり
- group interaction laneあり

Future15をCurrent21へ混ぜない。

### 2. Relationship speech

- Relation24すべて双方向を書く
- 呼称変化がないtrackも有効
- 高Bond=呼び捨て / タメ口 / 恋愛、にしない
- Crisisを高Bond rewardにしない
- numeric thresholdをContent文書だけでfreezeしない

### 3. Enemy story

- Enemy48を維持
- Spotlight8を49体目以降として追加しない
- 過去話は脅威提示より先に同情を要求しない
- sympathy does not erase harm
- 全員をredemption routeへ入れない
- Spotlight fragmentをMain Mystery解答装置にしない

### 4. Base Weapon / Transformation

Base Hold4を入力に含むTransformationはHoldへ連鎖。

Baseが未採用なのに進化だけ採用される状態は禁止。

### 5. Learning / Item

Combat Itemは、そのStageまでにPlayerが知らない:

- Attribute
- Status
- Reaction

を説明に使わない。

### 6. Learning / Ending

Stage20で突然新しい基礎Systemを出さない。

Story endingを全Vocabulary暗記テストにしない。

### 7. Completion

Story CompleteとAll Lightsを分離する。

100%未達でも作品を完走している。
All Lightsはpostgame最大祝福。

## Runtime Achievement14

現在の`src/game/data/achievements.ts`は14件。

これは既存runtime catalogとして正しいが、Stage20全体のAchievement Content Masterではない。

Title1 Content Masterは:

`Achievement14 = LEGACY_RUNTIME_CATALOG_NOT_STAGE20_COMPLETION_AUTHORITY`

として扱う。

今後Achievementを拡張する場合は:

- current14とのID collision
- reward inflation
- save migration
- hidden spoiler
- Clear Getterとの重複

を別PRで解決する。

## Open implementation gates

1. selected Base Weapon runtime hooks + numerical tuning
2. Combat Item PASSIVE / FIELD_ITEM / RARE_SUPPORT runtime schema + spawn/offer rules
3. Fusion / Synthesis / Awakening runtime triggers + inventory mutation
4. achievement/reward one-shot claim ledger + duplicate reward migration
5. exact Story Complete runtime trigger
6. finite All Lights denominator + save migration
7. Stage20-scale Achievement editorial expansion / migration
8. relationship speech semantic-to-runtime Bond gates + support/result voice selection
9. spotlight enemy bestiary fragment unlock/presentation + visual recognition validation
10. mobile visual QA / performance / playtest

これらが残っているため、Content Masterが揃ったことを「全runtime完成」とは呼ばない。

## Integrity CI

`title1-content-master-integrity` workflowは、新しいmeta checkerだけでなく既存checkerもまとめて再実行する。

対象:

- Combat Content Master
- Stage Campaign Master
- Current21 Character Kit
- Current24 Relationship Inventory
- Relationship Speech / Group Interaction / Intermission
- Enemy48 Encounter Synergy
- Spotlight8 Character / 24 fragment story progression
- Base Weapon Selection
- Unlock Learning Progression
- Combat Item Placement
- Transformation Selection
- Ending / Completion Boundary
- final Cross-master Integrity

一つのSourceだけ直して他の正本を壊した場合、統合checkで検出する。
