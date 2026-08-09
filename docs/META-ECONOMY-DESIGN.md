# ヨルノシルベ Meta Economy Design

Date: 2026-07-29  
Status: **CURRENT ECONOMY SHAPE / NUMBERS AND PRICES NOT LOCKED**

> 目的: 通貨・永続強化・unlockを増築する前に、「何のためのMetaか」「通貨を何種類まで許すか」「どこでrefundできるか」をCurrentとして固定する。

Related:
- `docs/game-core-book-v1.md`
- `docs/GAMEPLAY-META-PROGRESSION.md`
- `docs/PROGRESSION-ARCHIVE.md`
- `docs/FIRST-RUN-EXPERIENCE.md`
- `docs/POSTGAME-ENDGAME-DESIGN.md`

---

# 1. Meta promise

Metaの目的はPlayerを毎日ログインさせることではない。

> **次のrunで違う遊び方を試したくする。**

Priority:
1. play variety
2. comfort
3. small survivability
4. completion / collection
5. raw power

raw damageだけを最上位にしない。

---

# 2. Currency family cap

Default:

> **Core meta currencyは原則1種類。**

追加通貨を作る条件:
- sourceが明確に違う
- sinkも明確に違う
- Playerが用途を一言で説明できる
- 既存currencyへ統合すると意味が壊れる

禁止:
- Characterごとの専用currency乱立
- Stageごとのtoken
- event tokenを恒常化
- upgrade menuごとに別通貨

Collection / achievementの進捗値はcurrency扱いしない。

---

# 3. Source design

Core currency source候補:
- run completion
- partial fail-forward
- special Clear Getter
- first-time discoveries

Clearの方がDefeatより明確に高価値。

Defeat farmingが最効率にならない。

---

# 4. Sink families

Meta sinkは4family以内を目安にする。

## A. Comfort
- pickup comfort
- reroll
- choice quality
- minor movement / recovery comfort

## B. Build access
- weapon unlock
- passive unlock
- evolution route
- support option

## C. Character / Support growth
- small persistent trait
- Bond-adjacent gameplay unlock where appropriate

## D. Challenge / postgame
- optional advanced systems
- not required for first ending

---

# 5. Power budget

Permanent upgradesでStage1が無意味になるほど強くしない。

Desired:

```txt
new player:
skill + buildでClear可能

experienced player:
comfortと選択肢が増え、失敗の幅が減る

late player:
別条件 / high difficulty / weird buildを試せる
```

raw stat inflationは小さくする。

---

# 6. Unlock philosophy

良いunlock:
- 新しい武器
- 新しい進化
- 新Character
- 新Support
- reroll / choice option
- 黒耀化variation
- Stage variation

悪いunlock:
- 最初から必要だった基本操作
- 「+1% damage」を大量に並べるだけ
- UIページを埋めるための微差upgrade

---

# 7. Respec / refund

Playerが試行錯誤を恐れないよう、永続upgradeは原則refund可能方向。

候補:
- free full respec
- small friction respec

避ける:
- irreversible trap build
- premium-like resource要求
- rare item消費でしか戻せない

Character identity unlockなど、取得した事実自体はrefund対象にしない。

---

# 8. Economy pacing

First Session:
- 少なくとも1つ meaningful choice

Early:
- runごとに何か変わる

Mid:
- unlock頻度は下がってもbuild幅が増える

Late:
- raw statsを延々買うのではなくchallenge / masteryへ移る

Exact cost curveはplaytest後。

---

# 9. Anti-grind

禁止:
- daily quest mandatory
- energy/stamina
- login streak power
- same weak stage 100周が最適
- Bond item大量投与だけ
- currency capで毎日消化を迫る

欲しい:
- 普通にplayしていれば自然に伸びる
- challenge達成で少し加速
- 好きなCharacterを使っても損しない

---

# 10. Clear Getter connection

夜明け星図はcurrency dispenserではない。

役割:
- next play suggestion
- challenge proof
- unlock trigger
- collection / mastery

一部conditionでunlockしてもよいが、盤面を埋めるためにcurrency farmを要求しない。

---

# 11. Bond economy separation

Bondを通常currencyで直接購入しない。

Bond:
- 一緒に戦う
- assist
- rescue
- story gate

から育つ。

Meta currencyでできるなら:
- Support slot access
- training/comfort

程度。

Relationship progressそのものを金で買わせない。

---

# 12. Character unlock

Character unlockは複数経路候補を持てる:
- Story progression
- Clear Getter
- special Stage condition
- collection milestone

ただし主要Characterを長時間grindの奥へ隠さない。

---

# 13. Fail-forward economy

Defeatでも小さく残る。

Rule:

```txt
Clear reward > Defeat reward
```

ただしDefeat reward = 0にはしない。

Fail-forwardは慰めではなく:

> 次runで一つ変えられる

程度の価値。

---

# 14. Overflow / late currency

全unlock後にcurrencyが余る場合、最初から無限sinkを大量設計しない。

候補:
- cosmetic sink
- challenge reroll
- convenience
- capped conversion

避ける:
- endless damage scaling
- 1000段階upgrade

---

# 15. Economy review questions

1. 通貨の用途を一文で説明できるか
2. 似たcurrencyが2つないか
3. first run後にmeaningful upgradeできるか
4. raw damage以外を選ぶ理由があるか
5. refundできるか
6. weak stage farmingが最適にならないか
7. ClearがDefeatより嬉しいか
8. late gameでcurrencyが苦痛にならないか
9. Story/Bondをcurrencyで買っていないか
10. unlockが次のrunを変えるか

---

# 16. Runtime boundary

未LOCK:
- currency name
- exact reward quantity
- cost curve
- cap
- refund cost
- exact persistent stat caps

Currentで固定するのは**shapeとanti-pattern**。

---

# 17. 一文

> **ヨルノシルベのMetaは、数字を積み上げて古いStageを踏み潰すためではなく、次の夜に別の組み合わせを持ち込めるようにするためにある。**