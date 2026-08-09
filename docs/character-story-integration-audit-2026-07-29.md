# ヨルノシルベ Character / Story / Enemy Integration Audit — 2026-07-29

Status: **DESIGN INTEGRATION REVIEW / NOT RUNTIME VERIFICATION**

> 今回のCharacter・Relation・Enemy一本化後に、設定量だけ増えて矛盾や重複が増えていないかを確認する監査。

---

# 1. Coverage summary

| Area | Coverage | Result |
| --- | ---: | --- |
| Current21 profile / core | 21/21 | covered |
| Current21 distinctive relation lanes >=2 | 21/21 | covered |
| Current21 voice direction | 21/21 | covered |
| Current21 black-youka wrong arrival | 21/21 | covered |
| Current21 rescue choice design | 21/21 | covered |
| Current21 dawn proof | 21/21 | covered |
| Current21 story/gameplay payoff mapping | 21/21 | covered |
| Future15 profile | 15/15 | covered as Future only |
| Future15 relationship/story reservoir | 15/15 | covered as Candidate |
| Current enemy identity | 48/48 | current production identity exists |
| Kagemono collection writing | 48/48 | encounter/re-reading layer exists |
| Stage1–5 character spine | 5/5 | production direction exists |
| Stage1–5 encounter grammar | 5/5 | direction exists, exact wave values open |

**36人物候補 = Current21 + Future15 の設計memoryは分離したまま全員に到達可能。**

---

# 2. Current21 / Future15 separation

PASS方向:

- Current21へFuture人物を自動追加していない
- Future15をヨルノシルベ2の確定castにしていない
- Future bridgeはCurrent人物の問いを深める候補に留めた
- Future人物がCurrent人物の設定補助だけで存在しないよう独立relation / daily payoffを追加した

注意継続:

- ノア / 双子 / レンの接続が強いため、将来レンをCurrent1へ無理に前倒ししない
- クロエの魅力が強いため、ヨルノシルベ1のMain emotional climaxを奪わせない

---

# 3. Similar-character collision audit

## マドカ / レン / トキ

現在の差:

```txt
マドカ = witness / 何を伝えるか
レン = delta / 何が違うか
トキ = measurement / どれくらいか
```

Result: **separable**

## ナギ / クロオリ / トバリ

```txt
ナギ = hazardを閉じる
クロオリ = information / memoryを預かる
トバリ = 出入口 / return timingを管理
```

Result: **separable**

## トモリ / ツムギ / ハナ / シロ

```txt
トモリ = repair / 完成
ツムギ = continuation / intentional blank
ハナ = preservation / life meaning
シロ = classification / unknown preservation
```

Result: **separable**, group sceneで強い

## リツ / カナメ

両方自己犠牲guardへ寄るriskあり。

差:

```txt
リツ = 分配する人が全部自分へ寄せる
カナメ = interceptする人が全部自分で受ける
```

Gameplayも:

- リツ = distribution
- カナメ = interception

へ分離維持。

Result: **watch but acceptable**

## ユウビ / アマネ

courier重複risk。

```txt
ユウビ = recipient / timing / deliver-or-hold
アマネ = physical route / speed / mobility autonomy
```

Result: **separable**

---

# 4. Repeated tragedy audit

避けられている:

- 全員親死亡
- 全員記憶喪失
- 全員過去の裏切り
- 全員秘密の血統
- 全員恋人死別

Current depthは主に:

- 日常の癖
- same-root weakness
- relationship friction
- 選択の偏り

から作っている。

Futureでもクロエだけに長寿喪失を集中させ、全員へ同じ悲劇を配っていない。

Result: **good direction**

---

# 5. Romance / representation audit

## Current

- ユイ × アサ = non-romance fixed direction
- リツ × コヨリ = sibling / non-romance

## Future

- Gay = トウマ
- Lesbian Candidate = セリカ
- Bisexual = マキ
- feminine-presenting man / 男の娘 = スズ
- gender undisclosed Candidate = イオ

Guardrails maintained:

- sexualityをCharacter Coreそのものにしない
- bisexualityをindecisionへ結びつけない
- feminine presentationを嘘 /矯正対象にしない
- イオの性別を大オチにしない
- 同性恋愛だけを差別悲劇として扱わない

Result: **maintained**

---

# 6. Animal / Star Beast audit

- クウ / ヨモ = 現実に生きた個体
- 星獣 = 人物の共鳴 / 自己像 / 記憶的存在

分離維持。

動物を:

- 真相を知る賢者
- 人間より魂に近い存在
- 星獣の正体説明役

にはしていない。

Robotに星獣が出るかもOPEN。

Result: **maintained**

---

# 7. Black-youka audit

全Current21で:

```txt
strength
→ same-root excess
→ wrong arrival
→ gameplay power
→ allies create more options
→ character chooses
→ safe mastery
```

が通る。

危険:

21人全員のfull黒耀化episodeをMain Storyでやると反復感が強い。

対策:

- Main Spine中心だけ大きく描く
- Major rotatingはshort arc / character run
- Supportingはoptional / Clear Getter /灯録

Result: **system coherent; narrative density must be protected**

---

# 8. Enemy integration audit

Current48 identityは `src/game/data/enemyProductionDatabase.ts` を優先。

旧Enemy detailed designから:

- telegraph
- counterplay
- silhouette
- boss phase mechanic

だけをreservoirとして吸収。

旧name / old character bindingを復活させていない。

Enemyを全員individual tragedyにしていない。

Current enemy semantic chain:

```txt
ordinary trace/object
→ wrong reading
→ gameplay verb
→ telegraph
→ counter
→ released clue
→ re-reading
```

Result: **coherent**

---

# 9. Stage / Story audit

Stage1〜5はCore5の順に:

```txt
戻す
名前
守る
道
直す
```

へ整理。

各Stageは:

- Characterの得意playをまず気持ちよく使う
- 同じ一択の過剰だけをEncounterで崩す
- 別Support /別build /別routeを回答にする

ためMain Gameのreplay loopと衝突しにくい。

重要:

Stage1〜5 story/encounter directionができても、20-stage production DB全体のencounter master完了ではない。

Result: **Stage1–5 strong direction / full stage system still PARTIAL**

---

# 10. Mystery debt audit

## C-grade required in 1

- Core5 emotional answers
- クロオリが単純悪ではない
- 黒耀化が本人の一部
- 同時代でない人が夜で会えること
- Happy End /朝へ帰ること

## B-grade

- ランタン継承
- ユイ /トモリ獅子共鳴
- クロオリの預かり物

## A-grade open

- 夜の完全な正体
- 星獣の完全原理
- 夜を作った存在 /理由

Result: **healthy if C-grade is actually paid in scenario implementation**

---

# 11. Main risks remaining

## R1. Document-to-runtime gap

今回の進捗はdesign。
Unity story / enemy mechanic / Bond / mastery runtimeへは未接続。

## R2. Main Story information density

人物が豊富なので、良い設定を全部本編へ出すと破綻する。
Spine6 / Major7 / Optional8を守る。

## R3. Exact Boss assignment

Boss46–48とStage2–4のTheme相性は強いが正式配置未LOCK。

## R4. Main Mystery final answer

「間違った意味」Engineは非常に強いがまだHIGH-VALUE Candidate。
最終回答として勝手にCanon化しない。

## R5. Future cast temptation

クロエ / ノア / ルムは非常に強い。
1作目へ全部入れる誘惑を抑える。

## R6. Full 20-stage encounter design

Stage1〜5は方向を作ったが、production DB全体の20 stage差別化は別作業。

---

# 12. Current conclusion

設定の「量」は十分以上。

今後Character/Story領域で優先するのは新設定追加ではなく:

1. existing sceneの繰り返しとPayoff精度
2. Main Storyへ何を出さないか
3. Gameplay prototypeでCharacter verbが本当に楽しいか
4. Boss46–48の配置Human decision
5. C-grade mysteryが1で理解できるかのscenario review

新キャラ追加は引き続き停止でよい。

---

# 13. 一文

> **36人・48敵を一本の作品へつなぐ設計骨格はかなり揃った。次の危険は設定不足ではなく、良い設定を全部見せたくなって本編を重くすることなので、今後は“何を残し、何を遊びの中だけで見せ、何を後作へ送るか”の編集精度が重要。**
