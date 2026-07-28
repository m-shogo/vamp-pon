# ヨルノシルベ Stage / Encounter Design Master

Date: 2026-07-29  
Status: **CURRENT STAGE1–5 ENCOUNTER DIRECTION / EXACT WAVE VALUES NOT LOCKED**

> 目的: Enemy DB・Story・Character relationを「設定上つながっている」で終わらせず、Stageを遊んだ時に違う判断を要求するEncounterとして一本化する。
>
> 本書はStage1〜5のNarrative Spineを対象にする。20-stage production DB全体の数値wave master完了を意味しない。

関連:

- `docs/story-stage-character-relationship-placement-v1.md`
- `docs/ENEMIES.md`
- `docs/enemy-ecology-and-encounter-recipes-v1.md`
- `docs/enemy-encounter-relationship-pressure-v1.md`
- `docs/kagemono-collection-entry-book-v1.md`
- `src/game/data/enemyProductionDatabase.ts`

---

# 1. Encounterの基本単位

一度に多くの新mechanicを重ねない。

基本recipe:

```txt
movement pressure 1
+ controller / rule-changer 0〜1
+ small modifier 0〜1
```

例:

```txt
直線で寄る小影
+ 名札を貼り替える敵
+ 稀に鈴の誘導
```

Playerが死んだ時:

> 「何が起きたか分からない」

ではなく:

> 「名札を見すぎた / 戻り道を塞がれた」

と一言で原因を言えること。

---

# 2. Stage内のpressure arc

exact秒数はPlaytestで決める。

```txt
I. Read
   主役mechanicを単独で読む

II. Mix
   既知enemyと一つだけ組合せる

III. Tempt
   Characterの得意playを強く使いたくする

IV. Punish excess
   得意playを一択で使うと崩れる

V. Alternate answer
   Support / build / routeで別解が見える

VI. Climax
   chapter questionをmechanicとして再提示

VII. Release
   少し静かな区間 / dawnへ
```

Story台詞より先にmechanicで問いを出す。

---

# 3. Stage1 — Owner / Pickup

## Player feeling

> **拾うのが気持ちいい。でも、全部へ突っ込むと危ない。**

## Primary verbs

- approach
- scatter
- lure
- pickup pressure
- owner ambiguity

## Early encounters

- オンブ 墨などbasic swarm
- 紙片系の軽いmovement
- 記憶片を安全な位置へ落とす

まずVampire Survivors系の基本快感を優先。

## Mid pressure

- pickupを敵群の奥へ置く
- 鈴 / lureで敵とpickup方向をずらす
- 名札 / owner motifを少量混ぜる

## Character temptation

ユイは全部拾うと強い。
アサは先にmarkすると処理が速い。

その強みを**ちゃんと気持ちよく**使わせてから、過剰化だけを崩す。

## Punish excess

- 全pickupを追うと包囲される
- owner不明objectを即処理すると一時risk

罰はLoreクイズではない。
画面のtelegraphで分かること。

## Alternate answer

- 一部を後回し
- Supportへ拾わせる
- safe routeへ誘導してから回収

## Special Clear Getter seeds

- 一定数のpickupを残したままClear
- Support回収を一定回数成功
- 黒耀化なし / 黒耀化からsafe return

---

# 4. Stage2 — Name / Visibility

## Player feeling

> **名前は便利。でもlabelだけを信じると間違える。**

## Primary verbs

- mark
- label swap
- decoy
- visibility
- target priority

## Early encounters

- 名札系単独
- target markが読みやすい敵
- blank labelを一つだけ提示

## Mid pressure

- 同じlabelが複数へ付く
- silhouetteは違うが名前が同じ
- 名前は違うがmovementが同じ

Playerへ「文字だけではなく敵を見る」を自然に要求。

## Character temptation

アサmarkで処理効率を高める。

## Punish excess

labelを固定しすぎるとdecoyへ火力が吸われる。

## Alternate answer

- silhouette
- movement
- owner confirm
- conceal / private state

## Boss affinity

**46 持ち主のない名前**と高相性。
ただしStage2正式Boss lockではない。

## Special Clear Getter seeds

- blank / unknown targetを誤攻撃せずClear
- カスミSupportでvisibility切替
- mark targetを途中変更してClear

---

# 5. Stage3 — Seal / Guard / Exit

## Player feeling

> **安全地帯が増えるほど、逃げ道が減っていくことがある。**

## Primary verbs

- block
- seal
- intercept
- lane close
- reopen

## Early encounters

- 鍵穴 / 箱系
- 一方向だけ塞ぐ
- close telegraphを明瞭にする

## Mid pressure

- safe areaを作る敵 + approach enemy
- shield front / vulnerable back
- lane close後に短いreopen window

## Character temptation

ナギのseal / カナメのinterceptが非常に強い。

## Punish excess

- sealしすぎると自分のroute消失
- interceptしすぎるとguard resource枯渇

## Alternate answer

- hazardだけ閉じる
- guardを交代
- reopen windowを使う

## Boss affinity

**47 閉じた朝箱**と高相性。正式Stage3 lockはまだしない。

## Special Clear Getter seeds

- gateを一度再開してClear
- self-damage肩代わりを一定以上使わずClear
- ナギ×カナメ交互guard条件

---

# 6. Stage4 — Route / Measurement / Time-layer

## Player feeling

> **さっき安全だった道が、次も安全とは限らない。**

## Primary verbs

- route line
- reverse path
- measurement
- old/new map
- dynamic reroute

## Early encounters

- 切符 / 方位
- 直線 /斜め移動を読む
- telegraphを見てroute変更

## Mid pressure

- 一度通ったrouteを敵が再利用
- old route markerとcurrent hazardが重なる
- safe lineが更新される

## Character temptation

ミチルroute buff / トキperfect timingが強い。

## Punish excess

一本のperfect routeへ固執するとphase changeで閉じ込められる。

## Alternate answer

- route switch
- uncertain warning
- old map overlay
- delta detection

## Story delivery

このStageでは説明cutsceneより:

- 建物規格
- 地図差分
- 星 / 時計の不一致
- ゲンの昔話
- ネムの夢

を重ねて、**夜が一つの現実年代ではない**ことをPlayerが先に感じる。

## Boss affinity

**48 帰路のない夜**と非常に高相性。Stage4 / later climaxのどちらかは未LOCK。

## Special Clear Getter seeds

- safe routeを途中で捨ててClear
- old/new route両方通過
- perfect timing外のrouteを利用

---

# 7. Stage5 — Repair / Scar / Dawn

## Player feeling

> **壊れたものを直す。でも全部を元へ戻す必要はない。**

## Primary verbs

- repair
- lingering trace
- stitch
- finish
- release / dawn

## Early encounters

- 糸 /片ボタン /マッチ
- 攻撃後にtraceが残る
- traceが次の動きを予告する

## Mid pressure

- repairすると別性能になるobject
- broken stateにも利点がある
- 完全restoreするとscar bonusが消える

## Character temptation

トモリは全部repairすると安定する。
ツムギはunfinishedを残すほどpotentialが増える。

## Punish excess

- 全restore = build個性が消える
- 全unfinished = 実効果へ届かない

## Alternate answer

- scarをtrait化
- 一部だけfinish
- completed object + open slot

## Endgame visual reservoir

旧アサマデの:

- night-page wing
- black thread
- dawn-break

は高価値だが、Current Bossへ自動復活させない。

## Special Clear Getter seeds

- repairしないscar itemを持ってClear
- unfinished stackを途中でfinish
- dawn直前にSupport repair成功

---

# 8. Enemy family rotation

同じStageでも一つのfamilyだけ連打しない。

```txt
base movement
↓
Stage motif
↓
別familyで呼吸を変える
↓
Stage motif + known family
↓
climax
```

目的:

- 視覚単調化を防ぐ
- mechanic学習を定着
- 同じ敵が別Stageで違って見える

---

# 9. Build relationship

Stageが特定buildを強制しない。

各Stageで:

- strong build 2方向以上
- risky but viable build
- Supportで弱点を補えるroute

を用意する。

例:

Stage3:

- high mobility = 閉鎖前に抜ける
- seal build = hazardを消す
- guard Support = 一度受けて進む

一つの正解buildだけにするとStage4のThemeと設計そのものが矛盾する。

---

# 10. Difficulty boundary

Easy / Normal / Hardで新Loreを分けない。

難易度差は将来:

- telegraph duration
- pressure overlap
- spawn direction
- recovery window
- controller enemy頻度

などを候補とし、単純HP spongeを避ける。

exact valuesは `DIFFICULTY-AND-PLAYER-AIDS.md` で後決定。

---

# 11. Runtime / evidence boundary

本書はEncounter design master。

以下を意味しない:

- 現行Unityへ全mechanic実装済み
- wave timing決定済み
- boss assignment決定済み
- balance検証済み
- 20 stage全設計完了

実装時は:

```txt
Definition
→ Runtime
→ UI telegraph
→ automated verification
→ human playtest
→ tuning
```

を通す。

---

# 12. 一文

> **Stageごとの差は背景色や専用敵だけで作らず、その章の人物が得意な一択を一度気持ちよく使わせ、やがてその一択だけでは抜けられないEncounterを出し、別build・別Support・別routeを試したくさせることで作る。**
