# ヨルノシルベ Fun / Balance Playtest Framework

Date: 2026-07-29  
Status: **CURRENT OBSERVATION MASTER / PASS THRESHOLDS OPEN**

> 目的: U50のperformance/touch metricsとは別に、「遊んで気持ちいいか」「buildが偏っていないか」「また1runしたいか」を観測するCurrent frameworkを作る。

Related:
- `docs/COMBAT-RUN-DESIGN.md`
- `docs/FIRST-RUN-EXPERIENCE.md`
- `docs/DIFFICULTY-AND-PLAYER-AIDS.md`
- `docs/STAGE-ENCOUNTER-DESIGN.md`

---

# 1. Principle

最初から合格ラインを捏造しない。

```txt
Design intent
→ measure
→ observe distribution
→ find bad experience
→ tune
→ repeat
→ thresholdを採用
```

「平均値が良い」だけでPASSにしない。

---

# 2. Core questions

Playtestごとに最低限確認:

1. すぐ動けたか
2. 最初の撃破は気持ちよかったか
3. 初LevelUpは待たされたか
4. buildの方向はいつ見えたか
5. 明確に強くなった瞬間はあったか
6. 一度押された瞬間はあったか
7. そのpressureへ自分の選択で回答できたか
8. 進化は嬉しかったか
9. 黒耀化は判断になったか
10. 最後に完成buildを使えたか
11. 死因/成功理由を説明できるか
12. もう1runしたいか

---

# 3. Event timestamps

自動または手動で記録:

- runStart
- firstInput
- firstAttack
- firstKill
- firstPickup
- firstDamage
- firstLevelUp
- eachLevelUp
- firstSupportAssist
- evolutionReady
- evolutionComplete
- kokuyouReady
- kokuyouActivate
- kokuyouEnd
- firstElite
- bossStart
- death / clear
- resultOpen
- retry / nextRun

---

# 4. Derived metrics

## Growth
- first LevelUp time
- LevelUp interval distribution
- level by minute
- slots filled by minute
- evolution reach rate/time

## Combat
- kills/min
- damage taken/min
- enemy alive count trend
- player time near danger threshold
- no-enemy-visible periods

## Build
- weapon pick rate
- passive pick rate
- reroll rate
- replacement rate
- evolution combination rate
- build completion rate

## Character / Support
- Character clear rate
- Support adoption
- assist type count
- Pair Trait trigger
- rescue trigger

## 黒耀化
- ready→activation delay
- activation rate
- first-use time
- death during recovery
- no-黒耀化 clear rate

## Meta
- result→growth route
- next-run start rate
- character/support swap rate
- same build repetition

---

# 5. Qualitative markers

Observerは数字だけでなくtimestamp付きで記録:

- `DELIGHT` — 思わず反応
- `CONFUSION` — 何が起きたか不明
- `BOREDOM` — 何も変わらない
- `PANIC_GOOD` — 危険だが読める
- `PANIC_BAD` — 理由不明
- `CHOICE` — 迷うのが楽しい
- `NO_CHOICE` — 一択
- `POWER_SPIKE` — 強くなった体感
- `UI_FRICTION`
- `INPUT_FRICTION`
- `RETRY_DESIRE`

---

# 6. Build diversity audit

人気buildが存在すること自体は問題ではない。

危険:
- 1 weaponが全Characterで最優先
- 1 passiveが実質mandatory
- 1 Supportだけ圧倒的
- 黒耀化使用が100%近く必要
- rerollが同じitem探しにしか使われない

見る:

```txt
pick rate
+
clear contribution
+
player stated reason
```

高pick率でも「楽しいから」なら即nerfしない。

---

# 7. Character identity audit

各Characterで:
- 初期数分のplay feelが違うか
- Support選択理由が変わるか
- 同じbest buildになっていないか
- 黒耀化の使い所が違うか

Character win rateを完全一致させることを目的にしない。

ただし極端な格差はinvestigate。

---

# 8. Stage identity audit

Stage1〜5で最低1つずつ違いを言えるか。

Playerへ聞く:

> 「このStage、前と何が違った？」

Enemy skinの違いだけしか答えられないなら失敗。

---

# 9. Difficulty audit

Normal/Easy/Hard比較:
- kill satisfaction
- danger readability
- clear rate distribution
- HP sponge感
- build diversity
- no-黒耀化 viability

Hardでkill/minが激減し、敵が残るだけならHP過多を疑う。

---

# 10. First-session test cohort

最低でも開発者本人以外の初見観測を持つ。

聞く前に見る:
- 最初にどこを触ったか
- 操作説明を読んだか
- LevelUpで何を選んだか
- Resultから次にどこへ行ったか

終了後質問は短く:
1. 何をするゲームだと思った？
2. 一番気持ちよかった瞬間？
3. 分からなかったもの？
4. もう一回なら何を変える？

最後の質問で回答が出るのが強い。

---

# 11. Session diversity

同一testerでも最低:
- first run
- same Character second run
- different Character
- different Support
- no-黒耀化 attempt
- Stage variation

を見る。

一回のClearだけでbalance確定しない。

---

# 12. Regression watch

改善時に壊しやすいもの:

## Enemy densityを上げる
→ kill satisfaction↑ / readability↓ / performance↓

## pickup radiusを上げる
→ comfort↑ / movement route意味↓

## LevelUpを速くする
→ growth↑ / combat interruption↑

## 黒耀化を強くする
→ delight↑ / mandatory化risk↑

## Supportを強くする
→ attachment↑ / main Character agency↓

必ず副作用を見る。

---

# 13. Evidence format

1 playtest record:

```json
{
  "buildSha": "...",
  "device": "...",
  "stage": "...",
  "character": "...",
  "support": "...",
  "difficulty": "...",
  "result": "clear|defeat",
  "timestamps": {},
  "buildSummary": [],
  "qualitativeMarkers": [],
  "observerNotes": [],
  "playerAnswers": []
}
```

個人情報を不要に保存しない。

---

# 14. When to lock thresholds

次の順で十分なサンプルを見てから:
- first LevelUp target
- acceptable empty-time
- Stage1 clear target
- LevelUp interval band
- Evolution reach target
- Character outlier tolerance

をCurrent thresholdへ昇格する。

一人の成功runだけでlockしない。

---

# 15. Release-level fun gates candidate

最終的に必要なgate候補:

- first-run comprehension
- first-run second-run intent
- Stage1 completion/readability
- no severe dead build path
- no mandatory single Support
- no mandatory 黒耀化
- Stage identity recognition
- Character identity recognition
- defeat reason readability
- input fatigue acceptable

Exact pass numberはOPEN。

---

# 16. U50 separation

U50:
- FPS
- frame time
- memory
- touch latency
- device thermal/performance

本書:
- fun
- growth pacing
- build diversity
- replay desire

両方必要だが同じPASSではない。

---

# 17. 一文

> **ヨルノシルベのbalanceは「数字が規定範囲だから良い」ではなく、Playerが弱さ→選択→成長→危機→回答→完成を一晩の中で体験できているかで決める。**