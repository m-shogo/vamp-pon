# ヨルノシルベ1 Content Master Integrity v1

## Purpose

Title1の主要Content Authorityを一枚で確認し、個別Sourceが増えた結果の矛盾を防ぐためのintegrity map。

この資料は各詳細Sourceを置換しない。
正本の場所と現在の確定境界をまとめる。

## Current integrated picture

- **Stage20**
- **Current21** Character
- **Enemy48**
- **14属性 + NEUTRAL**
- **16Status**
- **12Reaction**
- **Base24** = Current8 + Selected16 / Hold4
- **Combat Item18** = PASSIVE14 + FIELD_ITEM2 + RARE_SUPPORT2
- **Transformation38** = **Selected29 / Hold9**
- Current relationship inventory = 24 arcs / Current21全員coverage
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

### Enemy48

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

### Relationship

`src/game/data/currentRelationshipInventory.ts`

Current24 arc / Current21全員coverage。

Inventoryは:

- romance Canon
- blood relation Canon
- Main Mystery Canon

を勝手にfreezeしない。

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

## Runtime versus Content Master

次のSource群は**CONTENT_SOURCE_ONLY**境界を持つ:

- Base Weapon Candidate
- Combat Item Candidate placement
- Transformation Candidate selection
- Unlock learning content
- Ending/completion content policy

Content Masterで決まったからといって自動で:

- inventoryへ追加
- saveへ保存
- numerical tuning確定
- Production Ready
- credits condition変更
- 100% denominator freeze

を行わない。

## Cross-master invariants

### 1. Character

Current21は:

- Kitあり
- Relation laneあり
- starting planあり
- Star Beast mechanicあり

Future15をCurrent21へ混ぜない。

### 2. Base Weapon / Transformation

Base Hold4を入力に含むTransformationはHoldへ連鎖。

Baseが未採用なのに進化だけ採用される状態は禁止。

### 3. Learning / Item

Combat Itemは、そのStageまでにPlayerが知らない:

- Attribute
- Status
- Reaction

を説明に使わない。

### 4. Learning / Ending

Stage20で突然新しい基礎Systemを出さない。

Story endingを全Vocabulary暗記テストにしない。

### 5. Completion

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
4. exact Story Complete runtime trigger
5. finite All Lights denominator + save migration
6. Stage20-scale Achievement editorial expansion / migration
7. mobile visual QA / performance / playtest

これらが残っているため、Content Masterが揃ったことを「全runtime完成」とは呼ばない。

## Integrity CI

`title1-content-master-integrity` workflowは、新しいmeta checkerだけでなく既存checkerもまとめて再実行する。

対象:

- Combat Content Master
- Stage Campaign Master
- Current21 Character Kit
- Enemy48 Encounter Synergy
- Base Weapon Selection
- Unlock Learning Progression
- Combat Item Placement
- Transformation Selection
- Ending / Completion Boundary
- final Cross-master Integrity

一つのSourceだけ直して他の正本を壊した場合、統合checkで検出する。
