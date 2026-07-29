# ヨルノシルベ Postgame / Endgame Design

Date: 2026-07-29  
Status: **CURRENT POSTGAME DIRECTION / 100% REWARD DIRECTION ADOPTED / CONTENT COUNTS NOT LOCKED**

> Happy End後もヴァンサバ系として遊び続けられる理由を作る。
>
> 100%はTrue Endingを見るための宿題ではない。ただし、遊び尽くしたPlayerへは小さな称号ではなく**作品最大級の祝福**を返す。

Related:

- `docs/game-core-book-v1.md`
- `docs/META-ECONOMY-DESIGN.md`
- `docs/GAMEPLAY-META-PROGRESSION.md`
- `docs/PROGRESSION-ARCHIVE.md`
- `docs/FUN-BALANCE-PLAYTEST.md`
- `docs/NAMED-OBJECT-CONNECTIONS.md`
- `docs/CLEAR-GETTER-AND-100-PERCENT-REWARD.md`

---

# 1. Main ending is complete

最重要:

> **本編Clear時点でHappy Endを受け取れる。**

Postgameは「本当の結末を見せるための宿題」ではない。

Postgameで増える:

- challenge
- build depth
- Character mastery
- optional lore
- re-reading
- sequel seed
- completion celebration

本編の救いを撤回しない。

---

# 2. Postgame pillars

優先5本:

## A. Clear Getter completion

別条件で同じStageを遊ぶ理由。

## B. Character / Support mastery

別Character / Pairでplay feelを変える。

## C. Challenge runs

難しいが読みやすい条件。

## D. Hidden build / evolution discovery

未使用組合せを試す理由。

## E. Completion celebration

遊び尽くしたことを人物・物・音・Stage・星図で大きく祝う。

---

# 3. Clear Getter after ending

夜明け星図は100% checklistだけにしない。

Postgame条件例:

- no-黒耀化 Clear
- 黒耀化を使ってsafe return
- specific Support
- specific Pair Trait
- Evolution count
- low-hit / no-revival
- alternate route
- difficult encounter
- named object + Character verb + Stage mechanic

同じ正解だけを繰り返させない。

Exact architecture:

- `docs/CLEAR-GETTER-AND-100-PERCENT-REWARD.md`

---

# 4. Character mastery

Character masteryは単なる「100回使う」ではない。

候補:

- Character固有verbを使った達成
- その人の弱点を逆に越える条件
- specific Pair synergy
- black-youka safe-use condition
- alternate build
- luminous possession connection

例:

### ユイ

全pickupではなく一部を残してClear。

### アサ

mark targetを固定しすぎずClear。

### ミチル

一度安全だったrouteを捨て、別routeでClear。

Gameplayで人物成長を再演する。

---

# 5. Support mastery

Supportも同行回数だけにしない。

見る:

- assist success
- rescue
- no redundant assist
- pair condition
- black-youka recovery
- named-object handoff / hold / return

高Bondをgrindだけで作らない方針と一致させる。

---

# 6. Challenge stages

Challenge Stageを追加する場合:

- normal Story Stageの単純高HP版にしない
- 1つのmechanicを強くする

例:

- moving safe lane
- pickup scarcity
- high controller density
- route reversal
- black-youka recovery risk

1challenge = 1主要問い。

---

# 7. Endless mode

Candidate。

ヴァンサバ系として相性はあるが、Main coreへ必須ではない。

採用条件:

- 8分Stageの完成を邪魔しない
- performance budgetが成立
- reward economyを壊さない
- leaderboard前提にしない

Endlessでしか取れないMain Storyは置かない。

---

# 8. New Game+

Default必須にしない。

もし採用:

- Storyを全部リセットするだけでは弱い
- enemy mix
- Stage pressure
- alternate dialogue observation
- carryover rule

など明確な違いが必要。

「もう一度同じStoryを見るだけ」なら不要。

---

# 9. Hidden evolution

Postgameと高相性。

良いhidden evolution:

- combination hintが星図 / Collection / gameplayから分かる
- random secret codeではない
-強いだけでなくplay styleが変わる
- named-object lineageとして追える

全hidden evolutionを必須powerにしない。

---

# 10. Optional lore

Postgame loreは:

- Character Mystery
- enemy re-reading
- named-object provenance
- night observation
- sequel seed

へ向く。

禁止:

- 100%で初めて「なぜ戦っていたか」が分かる
- Main villain / 世界説明を全部隠す
- 全文読了をcompletion条件にする

普通のClearでC-grade mysteryは回収する。

---

# 11. 100% completion — 全灯の朝

100% reward exact direction:

## **全灯の朝**

100%はlaunch scopeの有限な記憶のしるしとnamed-object connectionを全て灯した状態。

無限撃破counter、全文章既読、全Pair最大Bondは要求しない。

報酬は複合pack。

### 1. Playable Dawn Square celebration

夜明け前の広場を短いfree-walk sceneとして歩ける。

存在するもの:

- Current21
- 21の星獣
- 21の光る持ち物
- Current48を示す小さな紙影
- Stage1〜20のmotif
- Playerが灯した星図線

全員が順番に長台詞を言うのでなく、食事・修理・手紙・地図・小さな世話・静かな同席で祝う。

### 2. Full ensemble animated page

## **全灯大絵図《朝を選んだ人たち》**

- Current21 full ensemble
- star beasts / objects / Stage motifs
- 灯録special spread
- selectable TOP background
- reduced-motion static fallback

### 3. Completion music

## **全灯の朝 — Twenty-One Lights Medley**

Main theme、Stage1〜5、Character light motif、Dawn cadenceを一曲へまとめる。

### 4. All-character cosmetic

## **星図継ぎの灯**

- statsなし
- Character固有の光り方を尊重
- 一律rainbow auraにしない
- run開始 / Dawnだけ星図線が一瞬つながる

### 5. Postgame play option

## **星図継ぎの夜**

全20Stageの既知mechanicから2〜3個を組み合わせるcelebration remix mode。

100%後も完成systemを自由に組み替えて遊べる。
Main power / Story progressionへ必須ではない。

### 6. Profile proof

- title: **全灯を見届けた人**
- seal: **全灯印**
- 灯録frame: **朝綴り**
- completion date / selected Character / final node記録

### 7. Small future anomaly

最後に、誰の物でもない折り目・知らない綴じ糸・未登録の足跡のうち一つだけが残る。

True Endingではない。
Main Happy Endを否定しない。

詳細:

- `docs/CLEAR-GETTER-AND-100-PERCENT-REWARD.md`

---

# 12. Sequel stinger

Postgame深掘りPlayerだけが追加で違和感を拾ってもよい。

- 知らない折り目
- 見覚えのない綴じ糸
- 未登録の星獣の足跡
- 同一objectの年代差

露骨な`TO BE CONTINUED`にはしない。
続編がなくても世界の広がりとして成立させる。

---

# 13. Reward hierarchy

Postgame reward priority:

1. new play option
2. mastery proof
3. major celebration / expression
4. cosmetic / music / gallery
5. optional information
6. raw permanent power

raw powerを最後にする。

100%だけは単一rewardではなく、上記複数層をまとめて返す。

---

# 14. Anti-compulsion

禁止:

- daily streak
- weekly FOMO
- limited energy
- time-gated upgrade
- repeated notification
- seasonal exclusive power mandatory
- arbitrary 9999-kill requirements

遊びたい時に戻れる作品にする。

---

# 15. Endgame economy

Meta currency余りを理由に無限statを作らない。

late sinks:

- cosmetic
- reroll convenience
- challenge preparation

程度を候補にする。

`全灯の朝`を高額通貨購入へしない。
達成の祝福であり、shop rewardではない。

---

# 16. Completion tiers

```txt
Story Complete
= Happy End

Game Complete
= Main gameplay systems / stagesを十分遊んだ

Mastery
= Character / Pair / Challenge

100% / 全灯
= optional completionist celebration
```

全て違う価値。

---

# 17. Postgame playtest questions

1. Ending後に次に何をすればいいか見えるか
2. 同じStageを別buildで遊ぶ理由があるか
3. Character swapが意味を持つか
4. grindだけの条件がないか
5. 100%しなくても満足できるか
6. 100% rewardが十分豪華か
7. challengeがHP spongeでないか
8. rewardがraw powerだけでないか
9. named objectが孤立していないか
10. sequel seedがHappy Endを壊していないか

---

# 18. Runtime boundary

Current designで採用:

- 100% celebration name `全灯の朝`
- composite reward structure
- remix mode direction `星図継ぎの夜`
- ensemble page / music / cosmetic / profile proof

未LOCK:

- Endless採用
- NG+採用
- challenge Stage数
- hidden evolution数
- mastery tier数
- exact active node count
- exact scene duration
- exact asset composition
- future anomalyの具体object

未実装:

- global completion save
- Stage2〜20 constellation
- Current21 mastery constellation
- celebration scene
- music / illustration / cosmetic
- remix mode

U49/U50/RC readinessは変えない。

---

# 19. 一文

> **ヨルノシルベのPostgameは、終わっていなかった物語を働いて完成させる場所ではなく、ちゃんと終わった夜を別のCharacter・build・条件でもう一度遊び、最後には全ての灯りを作品最大の朝で祝う場所にする。**
