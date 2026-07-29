# ヨルノシルベ Named Object / Clear Getter Connection Hub

Date: 2026-07-29  
Status: **CURRENT NAMED-OBJECT CONNECTION ENTRYPOINT / EXACT RUNTIME IDS REQUIRE SEPARATE MIGRATION**

> ヨルノシルベでは、名前を与えた物を背景小物や一度きりの設定で終わらせない。
>
> **名前のある物は、誰か・どこか・何かの遊び・何かの記録へ必ずつながる。**

関連正本:

- `docs/CANON.md`
- `docs/CHARACTER-STORY-INTEGRATION.md`
- `docs/PLAY-EXPERIENCE.md`
- `docs/PROGRESSION-ARCHIVE.md`
- `docs/CLEAR-GETTER-AND-100-PERCENT-REWARD.md`
- `docs/character-luminous-personal-item-book-v1.md`
- `src/game/data/characterProductionPlans.ts`
- `src/game/data/itemProductionCanon.ts`
- `src/game/data/stageProductionDatabase.ts`
- `src/game/data/enemyProductionDatabase.ts`

---

# 1. Named Object invariant

固有名を持つ物は最低1つではなく、原則として次のうち**3方向以上**へ接続する。

```txt
Person
Stage / Place
Gameplay verb
Enemy / Kagemono motif
Clear Getter / 記憶のしるし
灯録 entry
Relationship / Bond
黒耀化 distortion
Dawn proof
Evolution / build lineage
```

最重要:

> **名前を付けたのに、誰の物でもなく、どこにも出ず、何にも使わず、記録にも残らない物を作らない。**

---

# 2. Every named object needs a connection card

今後、名前のある物には次のfieldを持たせる。

| Field | 意味 |
| --- | --- |
| stableId | renameしても追える内部ID |
| displayName | 現在の表示名 |
| status | CURRENT / WORKING / CANDIDATE / LEGACY |
| objectType | 灯具 / 持ち物 / 忘れ物 / 落とし物 / 個人所持品 / 鍵物 / Stage prop |
| keeper | 主な持ち主・預かる人物。owner不明も明示 |
| firstAppearance | 最初に見えるStage / scene / run condition |
| gameplayVerb | 何をする物か |
| motifLane | light / paper / road / box / name / repair / memory等 |
| enemyConnection | 反応するKagemono / family |
| clearGetterConnection | 関連する記憶のしるし |
| archiveConnection | 忘れ物絵札 / 灯し手の記録 / 夜の観測記録 |
| relationConnection | 誰との関係を変えるか |
| blackYoukaDistortion | 黒耀化時にどう歪むか |
| dawnState | 夜明け後に何が小さく変わるか |
| lineage | 灯継ぎ / 暁開き / repaired form / inherited form |

全部を画面へ同時表示する必要はない。
しかし制作memoryとしては接続を失わない。

---

# 3. Same name rule

`characterProductionPlans.ts`には、同じ名称が複数categoryへ現れる例がある。

例:

- コヨリ `呼び名の紙縒り`
- ゲン `駅前の道火`
- ハナ `箱底の花`
- シロ `未分類の頁`
- トバリ `片道ではない切符`
- ネム `眠り頁`
- Shadow seedの一部

同名を即renameする必要はない。
ただし必ず次のどちらかへ分類する。

## A. Same object / phase change

```txt
同じ物
→ battleで使い方が変わる
→ 灯継ぎで名前を継承
```

この場合はlineageを明示する。
同名であること自体が「ずっと同じ物を使い続けた」意味になる。

## B. Different objects / accidental collision

別物なのに同名ならHuman Naming Reviewで改名する。

禁止:

> 同じ文字列だから同じ物だろう、と後から勝手に設定を作る。

---

# 4. Character luminous possession

Current21は全員、戦闘アイコンとは別に**画面上で人物を一目で識別できる光る持ち物**を持つ。

役割:

1. silhouette/readability
2. Character identity
3. battle verbのsource
4. 黒耀化での歪み
5. Dawnでの変化
6. 灯し手の記録の中心object
7. merch / emblem / iconへの接続

詳細:

- `docs/character-luminous-personal-item-book-v1.md`

光る持ち物は全員同じランタンにしない。
光源の種類を分ける。

```txt
flame
reflection
edge light
glowing ink
lit thread
lens focus
afterimage
soft pulse
constellation line
contained light
```

---

# 5. Item lineage

Character itemは単発名の横並びではなく、一つの問いが形を変えるlineageにする。

```txt
光る個人所持品
↓
初期灯具
↓
相性のよい持ち物
↓
忘れ物
↓
灯継ぎ
↓
暁開き
↓
黒耀化での間違った形
↓
Dawn proofでの安全な扱い
```

全段階を同一物にする必要はない。
ただし最低1本の因果線を持つ。

例 — トモリ:

```txt
継火の修理ランプ
→ 黒インクの小瓶
→ 白い余白
→ 切れた灯芯
→ ほころび灯し
→ 夜を直す灯
→ 全部元通りに固定する黒耀化
→ 古い修理跡を消さずに残すDawn proof
```

---

# 6. Clear Getter connection

夜明け星図はachievement一覧ではなく、名前のある物・人物・敵・Stageの関係を可視化するmap。

一つの記憶のしるしは可能なら二つ以上を結ぶ。

悪い例:

> 敵を1000体倒す。

良い例:

> `片道ではない切符`を持ち、トバリのgateを一度開き直して夜明けする。

これにより:

```txt
named item
+ Character verb
+ Stage mechanic
+ replay condition
+ archive reward
```

が一つにつながる。

詳細:

- `docs/CLEAR-GETTER-AND-100-PERCENT-REWARD.md`

---

# 7. 100% reward direction

100%報酬は小さい称号一個で終わらせない。

Current direction:

## **全灯の朝**

全てのlaunch-scope記憶のしるしとnamed-object connectionを灯したcompletion celebration。

報酬は複合packとする。

1. all-Current21 ensemble celebration
2. all luminous possessions placed in the Dawn Square
3. playable completion walk / inspection scene
4. full-cast illustration / animated page
5. `全灯の朝` music medley
6. all-character completion cosmetic light
7. postgame remix rule set / celebration challenge
8. title seal / profile emblem
9. one small future-facing anomaly

Main Happy Endを訂正するTrue Endingではない。
**本編のHappy Endを、遊び尽くしたPlayerへ最大級に祝う追加の朝**。

---

# 8. Current gaps found on 2026-07-29

## Runtime / old data gap

- `collectionProgress.ts` はStage1 5x5 / 25札prototypeのみ
- 一部の表示文に旧enemy name / `黒曜化` が残る
- `keeperRecords.ts` はCore5のみでCurrent人物理解と古い差分がある
- `lostItemRecords.ts` は6件のみ
- Nagi / Michiru object connectionに旧役割由来の入替が残る
- `characterProductionPlans.ts` は20人分あるがsame-name lineageが未記録
- Reserve Renは別sourceであり、20人tableへ未統合
- 100% exact runtime rewardは未実装

これらは本書追加だけでruntime修正済みとは扱わない。
Dedicated data migration / checker / test / evidenceが必要。

---

# 9. New-name gate

新しい固有名詞を追加する前に確認する。

```txt
1. 既存objectの別名ではないか
2. 既存motif laneで表現できないか
3. 誰に属するか
4. どこで初めて見えるか
5. 何をするか
6. 何と対になるか
7. 灯録のどこへ残るか
8. 夜明け後に意味が変わるか
```

3項目未満しか答えられない名前は、正式採用を急がない。

---

# 10. 一文

> **ヨルノシルベでは、名前のある物を増やすほど設定表が膨らむのではなく、人物・戦闘・Stage・敵・星図・夜明けの間に新しい線が一本増えるように設計する。**
