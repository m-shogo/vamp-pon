# ヨルノシルベ — Season Antagonist Return Policy v1

Date: 2026-08-11  
Status: **USER-DECIDED RETURN RULE / INDIVIDUAL RETURN DETAILS CANDIDATE**

Upstream:

1. `docs/00-current-story-world-master.md`
2. `docs/season-architecture-cast-matrix-v1.md`
3. `docs/sakuyaza-current-identity-v1.md`

> Seasonごとにprimary antagonist team名 / primary rosterは交代する。
> ただし前Seasonの敵Characterは消えない。
> **再登場は、前Seasonを知っているPlayerへの「嬉しい物語報酬」にする。**

---

# 1. Return alignment is not permanent

Later role options:

- `ENEMY_RETURN` — 再び敵対
- `ALLY_RETURN` — 味方として再登場
- `TEMPORARY_ALLY` — その問題だけ目的一致
- `RIVAL_RETURN` — 敵味方どちらとも言い切れない競争相手
- `NEUTRAL_HELPER` — 情報 / 技術 /道案内等だけ助ける
- `CIVILIAN_RETURN` — 戦闘外の日常で再会
- `PARTY_GUEST` — Party /食事 /酒席等で顔を出す
- `REFUSES_TO_HELP` — 関係があっても助けない
- `ABSENT_BUT_FELT` — 本人不在でも手紙 /痕跡 /技 /噂が残る

Hard:

- S1 enemyだからS2もenemy、には固定しない。
- 一度allyになったら永久ally、にも固定しない。
- `敵 -> 一時共闘 -> 再び対立`も可能。
- 立場変更はtwistのためでなく、**Characterの価値観とSeason問題の組み合わせ**から起こす。

---

# 2. Player reward goal

狙う感情:

- 「来た！」
- 「ここで助けてくれるのか」
- 「まだそこは譲らないんだ」
- 「前の戦いのことが残ってる」
- 「この二人がまた会うのを待ってた」

再登場時は、前Seasonで覚えた:

- combat habit
- speech rhythm
- favorite food / drink
- nickname
- fear
- object
- joke
- relationship distance

等の少なくとも一つをcallback候補にする。

ただし新規Playerにもそのscene自体の意味が分かるようにする。

---

# 3. No forced redemption

禁止:

- Boss撃破 = 即改心
- 朔夜座8人全員が順番に仲間になる
- ally化 = 過去の加害が帳消し
- apology一言でrelationship reset
- protagonist側に入ることだけを成長の証明にする
- Character人気が出たから思想を無かったことにする

Possible growth:

- 主人公を助けるが思想は変えない
- 一点だけ考えを変える
- 借りを返すだけ
- 共通の問題だけ協力
- 主人公と敵対しながら第三者を助ける
- 自分の方法で以前より少し良い選択をする

`understanding != absolution`

---

# 4. Individual return, not team revival

Current:

```txt
S1 primary team = 朔夜座 / 8
S2 primary team = new team / new primary cast
```

Therefore:

- Sakuyaza 1〜数名return可。
- 8人全員returnを義務化しない。
- 8人全員をS2 primary teamとして復活させない。
- 一人だけ戻るから嬉しいepisodeも作る。
- 意外な2人だけ戻るepisodeも作れる。

Return countはSeasonごとに固定しない。

---

# 5. Relationship memory carries forward

再登場Characterは前Seasonの関係性を持ち越す。

Carry candidates:

- 呼び方
- 距離感
- 苦手意識
- 借り /貸し
- combatで見抜かれた癖
- Partyで知った好物
- 一度だけ見せた弱さ
- 約束
- 誤解
- 言えなかったこと
- shared joke

Hard:

> Character growth resets between Seasons = false.

---

# 6. Enemy ↔ Ally transition examples

Allowed shapes:

```txt
S1: ENEMY
S2: TEMPORARY_ALLY
S3: RIVAL_RETURN
Final: NEUTRAL_HELPER
```

```txt
S1: ENEMY
S2: CIVILIAN_RETURN
S3: ALLY_RETURN
```

```txt
S1: ENEMY
S2: ENEMY_RETURN
S3: one crucial rescue only
```

```txt
S1: ENEMY
S2: ALLY_RETURN
S3: ideological disagreement makes them oppose one plan again
```

これはbetrayal乱発ではなく、Seasonごとに違う問題へCharacterの価値観を当てた結果。

---

# 7. Sakuyaza later-return lanes

Status: **CANDIDATE / NOT CANON ROLE ASSIGNMENT**

| S1 member | Enemy-side return Candidate | Ally-side return Candidate |
|---|---|---|
| ナシロ | identityを一つへ固定する制度で再衝突 | 誤った本人認証 /なりすましを暴く局面で協力 |
| アサトジ | 「守るため閉じる」でcare /避難を固定しすぎる | 本当に一時封鎖が必要な危機では最も頼れる |
| ミチグレ | 最短route以外を消そうとして再敵対 | 誰も通れない場所から帰路を一本作るguideになる |
| オリネ | 情報を隠し過ぎてagencyを奪う | victim privacyを守るため必要な部分だけ隠す |
| ハクマ | ambiguityを消すため重要情報までblank | false dataを限定的に除去する局面で協力 |
| ツグリ | 同意なしに街 /身体 /recordを直す | repair skillそのものは圧倒的に頼れる |
| ユラネ | 苦痛から逃がすことを永久化する | 疲弊した仲間を休ませ、再び選べる状態へ戻す |
| ペタ | priority /safe /failed等のlabelで扱いを固定 | 混乱時にtemporary labelを正しく使い、後で自分から剥がす |

Important:

> 同じCharacterにenemy-side / ally-side両方の自然なreturn laneを持たせる。

---

# 8. S1 ↔ S2 high-value reunion candidates

S2 working new-cast candidatesとの対比:

- **ツグリ × カンナ** — `全部直す` vs `何を直さないか選ぶ`
- **ミチグレ × ナナセ** — `wrong routeを消す` vs `limited budgetで残すrouteを選ぶ`
- **ユラネ × サエ** — `休ませる` vs `care burdenを配る`
- **ペタ × ケイ** — visible label vs invisible priority score
- **ナシロ × イサナ** — one correct identity vs one coherent city plan
- **アサトジ × ヨシノ** — temporary protection vs future reserve / current sacrifice
- **オリネ × ミノリ** — hidden context vs logistics visibility
- **ハクマ × ハルマ** — blank ambiguity vs schedule every gap

Status:

`REUNION CANDIDATE / NOT APPEARANCE LOCK`

全組を実際に出す必要はない。

---

# 9. Party return

敵Characterの再登場を戦闘だけにしない。

High-value forms:

- 前SeasonではBossだった人が食糧庫を先に開けている
- Partyに呼ばれてないのに手伝いだけして帰る
- 炭酸だけ飲む
- adult-confirmed Characterなら酒席で距離感が少し変わる
- 前に嫌っていた料理を覚えている
- cleanupだけ参加
- protagonistと同じ席には座らない

Hard:

- Party参加 = forgivenessではない。
- alcohol = truth serumではない。
- non-drinkerも同等にsceneへ参加できる。

---

# 10. Return frequency guard

再登場が多すぎると新teamの価値が落ちる。

Therefore:

- S2のprimary antagonist sceneはS2 new castを主役にする。
- old enemy returnは**special event**として扱う。
- one episodeにprevious Season fan-serviceを詰め込みすぎない。
- return Characterがnew Characterのarcを奪わない。

No fixed numeric quota is Canon。

---

# 11. Death / disappearance guard

再登場余地を作るために:

- S1 antagonistを全員kill offしない。
- permanent deathをdefault catharsisにしない。
- defeat = deathにしない。
- disappearanceをdeath confirmationとして扱わない。

ただし全員生存をplot armorとして台詞で宣言する必要もない。

---

# 12. Canon boundary

DECIDED:

- previous Season antagonist individuals may return later。
- later return may be enemy or ally-side。
- alignment is not permanently frozen by one Season。
- past harm / relationship history carries forward。
- full previous team does not become next Season primary team。

OPEN / CANDIDATE:

- who returns in S2
- how many return
- exact alignment of each return
- exact reunion pair
- exact Party appearance
- final redemption / reconciliation state

---

# 13. Completion definition

- individual return allowed = true
- enemy return allowed = true
- ally return allowed = true
- temporary alliance allowed = true
- later re-opposition allowed = true
- forced redemption = false
- past harm erased by ally return = false
- relationship continuity = true
- previous full team as next primary team = false
- new Season cast remains primary
- all 8 Sakuyaza have both enemy-side and ally-side Candidate lanes
- exact S2 return assignments remain Open
- runtime auto-promotion forbidden
