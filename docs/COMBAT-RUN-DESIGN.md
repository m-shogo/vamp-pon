# ヨルノシルベ Combat / Run Design Master

Date: 2026-07-29  
Status: **CURRENT DESIGN DIRECTION / PLAYTEST TARGETS NOT FINAL BALANCE LOCK**

> 目的: 「ヴァンサバ系として1runが単体で気持ちいい」を、Storyや設定と独立して検証できるCurrent masterにする。
>
> 数値はHuman playtest前の最終balance値ではない。既存U33/U47実装・Game Feelを壊さず、何を測りどう調整するかを固定する。

Related:
- `docs/game-core-book-v1.md`
- `docs/STAGE-ENCOUNTER-DESIGN.md`
- `docs/unity-u33-stage1-8min-timeline-2026-07-03.md`
- `docs/unity-game-feel-cookbook.md`
- `docs/FUN-BALANCE-PLAYTEST.md`

---

# 1. Run promise

1runで最低限ほしい感情:

```txt
弱い
→ 最初の選択
→ buildの方向が見える
→ 敵を溶かせる瞬間が増える
→ 一度pressureに押される
→ build / Support / routeで回答する
→ 進化または黒耀化という明確なpower spike
→ 終盤を押し返す
→ 朝へ届く
```

禁止:
- 序盤2分ずっと同じ攻撃
- enemy HPだけ上げて時間を伸ばす
- LevelUpで毎回同じ選択
- 終盤までbuildの完成感がない
- 黒耀化が使い得
- 黒耀化を使わないと通常Clear不能
- 進化成立前にrunが終わる
- 長い演出でcombat rhythmを止める

---

# 2. Stage1 8分のCurrent target bands

U33 8min timelineを**final balanceではなく現行baseline**として継承する。

| Time | Player feeling | Existing baseline | Current design target |
| --- | --- | --- | --- |
| 0:00–0:30 | すぐ敵を倒せる / 自動攻撃を理解 | pack1 / cap8 | 何も起きない時間を作らない。最初の撃破を早く見せる |
| 0:30–2:00 | 初LevelUp / 初build選択 | pack2 / cap13 | 「次の選択が欲しい」が途切れない |
| 2:00–4:00 | buildの方向が見える | pack2 / cap20 | 単体武器より組合せの意味を見せる |
| 4:00–6:00 | 一度押される / 進化準備 | pack3 / cap27 | 難化はHP spongeより密度・方向・役割mix |
| 6:00–7:30 | power spike判断 | pack3 / cap34 | Evolution / Rare / 黒耀化の少なくとも1つがrunの主役になる |
| 7:30–8:00 | clear push | pack4 / cap38 | 最後30秒は生存作業ではなく「完成buildを使う時間」 |

Existing U33 target:
- Evolution testable from about 195s
- 黒耀化 testable from about 330s

これらは**reachability baseline**として保持するが、exact timingはplaytestで調整する。

---

# 3. LevelUp cadence

## Desired feeling

LevelUpはreward interruption。
頻繁すぎるとcombatを壊し、遅すぎると成長感が消える。

### Target questions
- 初LevelUp前に「何をすればいいか」は理解できるか
- 初LevelUpが来る前に退屈しないか
- 連続LevelUpでbattleへ戻れない時間が長くないか
- 中盤でも次の完成へ一歩進んだ感覚があるか

### Current tuning principle

```txt
Opening:
早め

Early build:
比較的短い間隔

Mid build:
選択の重さが増えるため少し間隔を取れる

Late build:
LevelUp数より Evolution / Rare / 黒耀化 / enemy pressureの質を重視
```

Exact secondsは`FUN-BALANCE-PLAYTEST.md`で観測して決める。

---

# 4. Enemy pressure curve

Enemy difficultyは次の順で増やす。

```txt
1. 数
2. 入ってくる方向
3. movement pattern
4. controllerとの組合せ
5. spatial restriction
6. speed / contact threat
7. HP
```

HPは最後の調整手段。

## 理由

ヨルノシルベは「敵をほどく気持ちよさ」がCore。
敵が硬すぎると:
- weapon growthが感じにくい
- pickupが減る
- LevelUp cadenceも崩れる
- buildの違いよりDPSだけが重要になる

したがってHardでも原則:

> **倒せない敵を増やすより、倒せる敵をどう捌くかを難しくする。**

---

# 5. Kill / pickup rhythm

Combat heartbeat:

```txt
撃つ
→ ほどける
→ 記憶片が散る
→ 移動で拾う
→ lantern pulse
→ 次の敵へ
```

Game Feel timing masterは`unity-game-feel-cookbook.md`。

特に:
- normal enemyへ毎hit camera shakeを入れない
- normal killを長いhit stopで止めない
- pickup animationでenemy silhouetteを隠さない
- fragment magnetはcombat route判断を邪魔しない

Playerはenemyだけでなく**落ちたfragmentの配置を見て移動routeを選べる**ことが重要。

---

# 6. Build progression

## Phase A — seed

Playerが最初の2〜3選択で:

> 「今回はこの方向かな」

と思える。

## Phase B — confirmation

同系統だけを引かせるのではなく:
- main weapon growth
- support synergy
- defensive / utility choice
- evolution requirement

が混ざる。

## Phase C — identity

中盤までにrunを一言で説明できる状態がほしい。

例:
- 範囲制圧
- 高速projectile
- pickup / lantern
- close-range survival
- Support coordination
- 黒耀化 burst

## Phase D — completion

終盤30〜90秒は「まだ弱いbuildを完成させる」より、**完成したものを振り回す時間**を作る。

---

# 7. Evolution

Evolutionは単なる数字アップにしない。

最低1つ変える:
- attack shape
- target rule
- timing
- movement interaction
- pickup interaction
- Support interaction
- visual silhouette

良いEvolution:

```txt
before:
扱い方が分かる

→ evolution

after:
同じ武器だと分かるが、戦場の読み方が変わる
```

Stage1では初Clear付近までにEvolutionが十分狙えることを優先。

---

# 8. 黒耀化 pressure point

黒耀化はpanic buttonではなく**Playerがriskを読んで使うpower spike**。

良い誘因:
- 一時的な高密度
- boss / elite phase
- routeが狭くなる
- build完成前の危険な谷
- special Clear Getterを狙う時

悪い誘因:
- cooldownが溜まったから押すだけ
-押さないと必ず死ぬ
- 反動が見えない
- 強さの違いが体感できない

Current requirement:
- 発動前に「今切るか」の判断がある
- 発動中は圧倒的に強い
- 終了後の煤返り/costが読める
- 高Bond / Supportで戻り方が変わる余地を残す

---

# 9. Empty-time budget

「何も起きない時間」は完全禁止ではない。
移動・pickup・route選択の呼吸は必要。

ただしStage1では次が長く連続しないよう監視する:
- enemyが画面にいない
- attackが当たらない
- pickupがない
- LevelUp / build decisionがない
- stage mechanicも変化しない

Playtestでは**退屈を感じたtimestamp**を記録する。
最終秒数thresholdは観測後に決める。

---

# 10. Clear / Defeat satisfaction

## Clear

欲しい:

```txt
最後のpressure
→ 押し返す
→ battle音数が少し抜ける
→ dawn transition
→ Result
→ reward / unlock
→ 次に試したい条件
```

Clear直前に長いdialogueを挟まない。

## Defeat

欲しい:

```txt
負けた
→ 何で負けたか大体分かる
→ 少量の進捗は残る
→ 次の改善候補が見える
→ Retry / Growthへすぐ行ける
```

Defeatを暗転罰ゲームにしない。

---

# 11. Support / Bond in combat pacing

Supportは「たまに画面外から攻撃してDPS追加」だけにしない。

価値:
- 危機救援
- route補助
- enemy control
- pickup保留/回収
- guard
- debuff / weakpoint
- 黒耀化の戻り

低Bond→高Bondで変えるのはraw damageだけでなく:
- trigger判断
- timing
- positioning
- redundancy回避
- player intentとの一致

を優先。

---

# 12. Stage1 acceptance questions

数値PASS/FAILより先にHuman playtestで答える。

1. 10秒以内に「動けばいい」と理解できたか
2. 最初の30秒で敵を倒すのが気持ちいいか
3. 初LevelUpは遅く感じなかったか
4. 2分時点でbuildの方向が見えたか
5. 4分時点で最初より明確に強いか
6. 6分時点でEvolution / Rare / 黒耀化の狙いがあるか
7. 最後30秒は完成buildを使えているか
8. 敵が硬いせいで気持ちよさが消えていないか
9. pickupがroute decisionになっているか
10. Game Overしたら理由が分かり、もう1回と思えるか
11. Clearしたら別buildを試したいか
12. Supportを変える理由があるか

---

# 13. Metrics to collect

Exact thresholds are not locked.

Minimum observation:
- first movement latency
- first kill time
- first pickup time
- first LevelUp time
- LevelUp interval distribution
- kills/min
- pickup/min
- damage taken timeline
- player death time
- build slots by time
- evolution reached time
- 黒耀化 first-use time
- no-黒耀化 clear
- support assist count/type
- boss / climax damage source
- clear time
- retry selected or not

Technical U50 metricsと混同しない。
これは**fun/balance metrics**。

---

# 14. Runtime boundary

この文書はDesign master。

これだけで:
- U47 data変更済み
- wave runtime変更済み
- balance final
- U49/U50 ready

とは扱わない。

数値変更は:

```txt
Design target
→ prototype/runtime parameter
→ playtest
→ evidence
→ compare
→ accepted tuning
```

の順で行う。

---

# 15. 一文

> **ヨルノシルベの1runは、耐える8分ではなく、小さな攻撃から始まり、選択で形ができ、圧力へ回答し、最後には自分で作ったbuildが戦場を押し返す8分にする。**