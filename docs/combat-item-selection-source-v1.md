# ヨルノシルベ1 Combat Item Placement Source v1

## Status / Authority

- Scope: `combatItemEffectSource.ts` の **既存18** Candidate
- PASSIVE 14 / FIELD_ITEM 2 / RARE_SUPPORT 2
- Placement source: `src/game/data/combatItemSelectionSource.ts`
- Authority: **CONTENT_SOURCE_ONLY**
- 新しいCombat Itemを増やさない。
- Current runtime `passives.ts` を置換しない。
- Placementされたからといってimplemented / owned / balanced / production-readyにはしない。

## 今回やること

既にCombat Content Masterには18個のItem候補がある。

必要なのは別の18個を作ることではなく、既存18を:

1. どのStageで初めて見せるか
2. LevelUp pool / Field Drop / Rare Supportのどこから入るか
3. その時点でPlayerが理解済みのAttribute / Status / Reactionだけで説明できるか
4. 一度に見せ過ぎないか
5. mobileで何が起きたか読めるか

へ接続すること。

18/18をTitle1に配置するが、runtimeへ自動promotionしない。

## Access lane

### PASSIVE 14

`LEVEL_UP_POOL`

通常のBuild候補。ただし既存runtime Passiveへ即追加する意味ではない。

### FIELD_ITEM 2

`FIELD_DROP`

- 継ぎ目テープ
- ぬるいお茶

LevelUp候補ではなく、戦場で拾う一回性の判断として分離する。

### RARE_SUPPORT 2

`RARE_SUPPORT`

- 迷子の鈴守り
- 朝側の半券

通常poolへ常駐させず、低頻度の保険・特殊支援として扱う。

## Placement

### Stage2

- 追い風結び

WIND / DISORIENTEDを覚えた直後に、移動そのものを条件にするBuildを見せる。

### Stage4

- 飴色のランタンガラス
- 星留めの針

LIGHT / STAR / ILLUMINATED / beaconまで理解した後に、照明防御と遠距離照準へ分岐する。

### Stage6

- 工具箱の磁石

METALをdamageだけでなくREPAIR・設置維持へ広げる。

### Stage7

- 継ぎ目テープ — FIELD_ITEM

Stage6で学んだEXPOSEDへの一回性counterplay。

### Stage8

- 石畳の靴底

ROOTED導入時に「速度を盛る」以外の踏ん張り回答を置く。

### Stage10

- 焦げた長灯芯
- 押花の種袋

FREEZE / ROOTED / regrowthまで既知になってから、WARMTHと撃破時回復へ広げる。

### Stage11

- 朝露のハンカチ
- 迷子の鈴守り — RARE_SUPPORT

arc_chain / DROWSYまで学んだ後にWater Reaction補助と方向・眠り系救済を置く。

### Stage12

- 頁織りの襟巻き
- ぬるいお茶 — FIELD_ITEM

FREEZEを一度経験した後に、条件付き耐性と即時CHILL解除の違いを比較させる。

### Stage13

- 白い当て布

ERASED導入後。BLANKを万能cleanseではなく広いduration軽減として使う。

### Stage14

- 銅の留め具

metal_overloadと同時。THUNDER/METALの準備型Buildへ接続する。

### Stage15

- 夢頁の折れ角
- 擦れた名前札

DREAM / SLEEP / lucid_recallを学んでからDream defenseとMEMORY sustainへ分ける。

### Stage16

- 黒折りの包み布

DARKを覚えた後。連打ではなく「間を取る」DARK Buildへ接続する。

### Stage17

- 朝側の半券 — RARE_SUPPORT

ECLIPSED / ERASEDを理解した終盤に、一回性の夜蝕保険として置く。

## Stage18-20

**新しいCombat Itemを追加しない。**

Stage18は最後の初期Reaction `thermal_crack`、Stage19はBuild候補を保留するcomfort、Stage20は総合masteryへ集中させる。

Itemを最後まで小出しし続けて「また新ルールか」と感じさせない。

## 先バレ防止

CIで各Itemのplacement Stageまでに以下が既知かを確認する。

- `attributeBias`
- `resistsStatuses`
- `cleansesStatuses`
- `reactionAssist`

未学習のAttribute / Status / ReactionをItem説明から**先バレ**させない。

例えば:

- `charred_wick` はFREEZE耐性を持つためStage10より前へ置かない
- `copper_clip` は `metal_overload` を使うためStage14より前へ置かない
- `old_name_tag` は `lucid_recall` を使うためStage15より前へ置かない
- `black_fold_cloth` はDARK導入後のStage16

## Cognitive overload

1Stageの新Combat Itemは最大2つ。

禁止:

- 18個一覧をStage1で開く
- PASSIVE / FIELD_ITEM / RARE_SUPPORTを同じpoolへ混ぜる
- 未学習Reactionを説明文へ出す
- Status完全無効を初心者救済にする
- Item取得をHappy End条件へする

## Counterplay boundary

既存18は、Player操作を壊しやすいStatusに対する複数の回答を持つ。

特に:

- ROOTED
- CHILL
- FREEZE
- DROWSY
- SLEEP
- ECLIPSED
- ERASED
- SEALED
- DISORIENTED

はItem側にもresist / cleanse / tempo recoveryのいずれかを残す。

ただし「Itemを持てばStatus無効」にはしない。

## mobile readability

mobileではItem効果の説明にfull-screen演出を使わない。

- 追い風結び → 足元の短い風線
- ランタンガラス → 暖色の縁だけ
- 星留めの針 → 遠距離targetへ一点
- 継ぎ目テープ → icon一つだけ点滅
- 石畳の靴底 → 小さな石粉ring
- 朝露のハンカチ → 一滴
- 迷子の鈴守り → 音輪一つ
- ぬるいお茶 → 湯気二本
- 黒折りの包み布 → 足元へ畳む
- 朝側の半券 → 半券の端だけ暖色

大量particle、screen tint、常時arrow、長いfloating textを避ける。

## Runtime boundary

このPlacement Masterはlive runtime inventoryではない。

runtime接続には別途:

1. Passive / Field Item / Rare Supportのschema
2. numerical tuning
3. save migration
4. level-up offer / field spawn / rare access rules
5. duplicate handling
6. Status runtime hook
7. icon / pickup art
8. mobile screenshot QA
9. playtest

が必要。

`runtimeAutoPromotionAllowed = false`。
