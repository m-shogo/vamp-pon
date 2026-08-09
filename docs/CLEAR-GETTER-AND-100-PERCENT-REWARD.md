# ヨルノシルベ Clear Getter / 夜明け星図 / 100% Reward

Date: 2026-07-29  
Status: **CURRENT COMPLETION ARCHITECTURE / EXACT NODE COUNTS AND RUNTIME IMPLEMENTATION OPEN**

> 夜明け星図は「作業率を埋める表」ではない。
>
> **名前のある人物・物・敵・場所・技が、別の遊び方によって一本ずつつながり、最後に大きな朝の絵になるClear Getter。**

関連:

- `docs/NAMED-OBJECT-CONNECTIONS.md`
- `docs/PROGRESSION-ARCHIVE.md`
- `docs/POSTGAME-ENDGAME-DESIGN.md`
- `docs/character-luminous-personal-item-book-v1.md`
- `docs/STAGE-ENCOUNTER-DESIGN.md`
- `docs/stage-encounter-expansion-06-20-v1.md`

---

# 1. Terminology

```txt
灯録
└ 夜明け星図        = Clear Getter全体
   └ 星座群          = domain / Character / Stageごとのまとまり
      └ 記憶のしるし = 1つの達成node
```

100% completion reward:

## **全灯の朝**

---

# 2. What 100% means

100%は無限counterの最大化ではない。

対象はlaunch scopeで明示された有限の記録。

```txt
A. 夜路の星座
   Stage / route / boss / special clear

B. 灯し手の星座
   Current21 Character verb / Support / 黒耀化safe return / Dawn proof

C. 灯具の星座
   灯具 / 持ち物 / 忘れ物 / 灯継ぎ / 暁開き / hidden build

D. カゲモノの星座
   Current48 encounter /ほどき /観察 /関連object connection

E. 結びの星座
   Major relationship / Pair Trait /灯合わせ /rescue

F. 夜の余白
   secret routes / optional observation / small series anomaly
```

100%へ不要:

- 全文章を最後まで読む
- 全会話を既読にする
- 全キャラを999回使う
- 全敵を極端な回数倒す
- 全Bond組合せを最大化する
- daily / weekly activity
- 期間限定event

読む行為を作業率へしない。
**unlock / encounter / meaningful play**を数える。

---

# 3. Named-object connection rule

記憶のしるしは可能な限り一つの数値だけで終わらない。

基本形:

```txt
Named object
+ Character verb
+ Stage mechanic
+ optional relation
= one memorable challenge
```

例:

### 持ち主待ちのランタン

> owner不明の落とし物を一つ保留し、Supportに別の物を回収させてStage1を夜明けする。

接続:
- ユイ
- クロオリ
- pickup / hold
- Stage1
- owner ambiguity

### 月箱の銀鍵

> ナギのsealを一度解除し、カナメへguardを交代してStage3を夜明けする。

接続:
- ナギ
- カナメ
- seal / reopen / intercept
- Stage3

### 片道ではない切符

> gateを閉じた後、帰路用に開き直し、ユウビSupportの遅延着弾を通してStage14を夜明けする。

接続:
- トバリ
- ユウビ
- gate / timing
- Stage14

### 余白を縫う糸巻き

> unfinished bonusを維持した後、Dawn前に一つだけ完成させてStage19を夜明けする。

接続:
- ツムギ
- トモリ
- blank / finish
- Stage19

---

# 4. Board architecture

既存Stage1 prototypeは5x5 / 25札。
これは有効なproofだが、20Stageすべてへ25active nodeを複製して500札にすることは自動採用しない。

Current direction:

## Large constellation map

- 全体は一枚の大星図
- domainごとに星座群
- Stage / Character detailから該当星座へzoom
- nodeを灯すと複数domainの線がつながる
- 同じnamed objectが別星座にも淡い線として見える

## Active node density target

Final countは未LOCK。
初期目安:

| Group | Direction |
| --- | ---: |
| Main Stage | 8〜15 active nodes / Stage |
| Current21 Character | 4〜7 signature nodes / Character |
| Item/build family | lineage単位で2〜5 nodes |
| Current48 enemy | 全員に初回node、深掘りはfamily/connection単位 |
| Major relationship | 1〜3 meaningful nodes / strong lane |
| Secret | 全active nodesの約5% |

既存Stage1の25札は、内容を整理して:

- active achievement
- cross-link node
- decorative constellation point

へ再分類できる。

---

# 5. Achievement density

継承する目安:

```txt
自然達成      約50%
少し狙う      約30%
Mastery       約15%
Secret         約5%
```

### Natural

- 初の夜明け
- 初の灯継ぎ
- 初のCharacter verb成功
- 初の敵familyほどき
- 初の忘れ物connection

### Targeted

- specific Support
- route switch
- 黒耀化なし / safe return
- named item lineage
- alternate build

### Mastery

- low hit
- exact recovery timing
- Character weaknessを柔軟に越える
- Stage mechanicを逆利用

### Secret

- world contradiction
- object provenance
- unusual Pair
- old/new time-layer overlap

SecretへMain powerを閉じ込めない。

---

# 6. Completion tiers

```txt
Story Complete
= Main Happy End。作品の感情決着。

Game Complete
= Main Stage / system / core buildを十分遊んだ。

Mastery
= Character / Pair / Challengeを深く遊んだ。

100% / 全灯
= launch scopeの有限な記憶のしるしとnamed-object connectionを全て灯した。
```

100%を達成しないPlayerもヨルノシルベを完走している。
しかし達成したPlayerは、**小さい称号だけでは終わらない最大級の祝福**を受け取る。

---

# 7. Exact 100% reward direction — 全灯の朝

## Reward 1 — Playable celebration: `全灯の朝`

夜明け前の広場を、戦闘ではなく短いfree-walk sceneとして歩ける。

広場には:

- Current21
- 各Characterの星獣
- 21個の光る持ち物
- ほどいたKagemonoを示す48の小さな紙影
- Stage1〜20のmotif
- Playerが灯した星図線

が一枚の場所へ共存する。

全員が順番に長台詞を言うsceneにしない。

- 食事
- 修理
- 手紙を渡す /まだ渡さない
- 地図を広げる
- 星獣が物へ近づく
- 子どもが走る
- 無口な人物が同じ場所にいる

という普通の朝で祝う。

## Reward 2 — Full ensemble animated page

Title:

### **全灯大絵図《朝を選んだ人たち》**

- Current21 full ensemble
- object / star beast / stage motifs included
- 灯録TOPのspecial spread
- title screen backgroundとして選択可能
- static fallback / reduced motion版を持つ

## Reward 3 — Completion music

### **全灯の朝 — Twenty-One Lights Medley**

- Main theme
- Stage1〜5 motifs
- Character light motifs
- Dawn cadence

を一曲へまとめたcompletion medley。

Music gallery / TOP / celebration sceneで選択可能。

## Reward 4 — All-character cosmetic

### **星図継ぎの灯**

全Characterへ装着できるcompletion cosmetic light。

- statsなし
- そのCharacter固有の光る持ち物の色・形を尊重
- 一律rainbow auraにしない
- run開始時とDawn時だけ星図線が一瞬つながる

## Reward 5 — Postgame play option

### **星図継ぎの夜**

全20Stageの既知mechanicから、Playerが2〜3個を選んで組み合わせるcelebration remix mode。

例:

- route reversal + delayed threat
- gate + blank slot
- helper placement + angle critical

目的:

> 100%後にも、取得した最強weaponで作業するのではなく、完成したsystemを自由に組み替えて遊ぶ。

Main Story / power progressionへ必須ではない。

## Reward 6 — Profile proof

- title: **全灯を見届けた人**
- seal: **全灯印**
- 灯録frame: **朝綴り**
- completion date / selected Character / final nodeを記録

## Reward 7 — One small future anomaly

Celebrationの最後、全員が帰った後に:

- 誰の物でもない折り目
- 知らない綴じ糸
- 未登録の小さな足跡

のうち一つだけが残る。

これはTrue Endingではない。
Main Happy Endを否定しない。
続編を作らなくても「まだ世界は広い」で成立する。

---

# 8. Why this is not a hidden True Ending

普通のEnding:

> 人物が救われ、朝へ帰り、関係が少し変わる。

全灯の朝:

> そのHappy Endを、Playerが出会った全ての名前と遊び方を並べて大きく祝う。

新事実で本編を覆さない。
死んでいた、夢だった、救えていなかった、は使わない。

---

# 9. 100% progress presentation

単一の`97.3%`だけを出さない。

```txt
夜路       20 / 20
灯し手     21 / 21
灯具       lineage complete
カゲモノ   48 / 48 connected
結び       major lanes complete
夜の余白   secret constellation complete
```

不足objectを選ぶと:

- related Character
- related Stage
- visible hint
- connected item lineage

へ移動できる。

攻略サイト必須の曖昧さを避ける。
Secretも隣接nodeから段階的なhintを出す。

---

# 10. Runtime audit boundary

現状runtime:

- Stage1 board 25 cells only
- full constellation architecture未実装
- all 20 Stage board未実装
- Current21 mastery node未実装
- named-object stable connection ledger未実装
- 100% reward未実装

本書はCurrent design direction。
実装時はDefinition / Save / Migration / UI / reduced-motion / evidenceが必要。

---

# 11. 一文

> **100%は「本当の結末を見るための宿題」ではなく、すでに受け取ったHappy Endを、21人・48の影・20の夜路・すべての名前ある物と一緒に、作品最大の朝として祝う。**
