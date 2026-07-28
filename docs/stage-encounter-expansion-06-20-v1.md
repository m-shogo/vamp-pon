# ヨルノシルベ Stage Encounter Expansion 06–20 v1

Date: 2026-07-29  
Status: **CURRENT STAGE6–20 ENCOUNTER DIRECTION / EXACT WAVES, BOSS LOCKS, SHADOW ID MAPPING OPEN**

> 目的: `src/game/data/stageProductionDatabase.ts` のStage6〜20を、背景/Story seedの一覧から「遊ぶとどう違うか」へ落とす。
>
> Stage1〜5の基礎masterは `docs/STAGE-ENCOUNTER-DESIGN.md`。本書はそのcompanion。

Authority:
- Stage identity / name / lead ids / coreQuestion / stageMechanicSeed = `src/game/data/stageProductionDatabase.ts`
- Enemy identity = `src/game/data/enemyProductionDatabase.ts`
- Enemy semantic = `docs/ENEMIES.md`

重要:
- `kage1`〜`kage4` をCurrent Shadow名へ勝手に対応付けない。
- Stage6〜20 directionがCurrentでもexact wave/balance/runtime実装済みとは扱わない。

---

# 1. Shared recipe

Stage6〜20もStage1〜5と同じpressure arcを使う。

```txt
Read
→ Mix
→ Tempt
→ Punish excess
→ Alternate answer
→ Climax
→ Release
```

1Stageに新ruleを3つ以上同時投入しない。

---

# 2. Stage6 — 白線の教室 / Sen

Production seed:
- question: 消された答えではなく進む線を見つける
- mechanic: レーン攻撃 / 安全線

## Player feeling

> **線は答えではなく、今だけ使える手掛かり。**

## Encounter grammar
- chalk line telegraph
- lane sweep
- safe line that moves
- blackboard/controller enemy

## Tempt
白線上にいるとbuff / safety / pickup効率が良い。

## Punish excess
同じ白線へ居続けると:
- lineが消える
- enemyがlineを使って突進
- safe sideが反転

## Alternate answers
- lineを跨ぐtiming build
- mobility
- ranged control
- Sen Supportで次lineを早く読む

## Clear Getter seeds
- 1本のsafe lineへ一定時間以上固執せずClear
- line reversalを無被弾で越える

---

# 3. Stage7 — 半分の駄菓子横丁 / Ritsu

Production seed:
- mechanic: 分裂弾 / 分配報酬

## Player feeling

> **半分にすることは、失うことではなく配ること。**

## Encounter grammar
- split projectile
- paired enemy packs
- reward split choice
- two-side pressure

## Tempt
片側へ火力を集中すると処理が速い。

## Punish excess
片側だけ処理すると反対側が育つ/集まる。

## Alternate answers
- balanced area build
- delayed split attack
- Supportへ片側を任せる

## Special condition seeds
- left/right双方のrewardを回収
- 一方へ過集中せずClear

---

# 4. Stage8 — 紙縒りの遊び場 / Koyori

Production seed:
- mechanic: 補助灯 / 召喚系

## Player feeling

> **小さい助けでも、位置が合えば戦場を変える。**

## Encounter grammar
- helper lamp nodes
- temporary summon
- tether / ribbon
- protect-the-helper moment

## Tempt
補助灯を増やすと画面制圧しやすい。

## Punish excess
全部を一か所へ繋ぐと:
- chain break
- enemy lure
- route congestion

## Alternate answers
- distributed helpers
- rotating summon
- Player本体で一部を処理

## Clear Getter seeds
- helperを複数位置へ維持
- summonなしClear / summon-focused Clearの両方

---

# 5. Stage9 — 古針の駅前 / Gen

Production seed:
- mechanic: 低速高耐久 / 安全地帯

## Player feeling

> **動かないことが安全な時もある。でも昔の安全地帯は永遠ではない。**

## Encounter grammar
- slow heavy pressure
- old safe station zones
- periodic route opening
- compass misalignment

## Tempt
安全地帯で戦えば安定。

## Punish excess
同じ安全地帯へ居座るとheavy packが集まる。

## Alternate answers
- leave-before-collapse
- kite slow enemy
- burst build
- Gen/route support

## Clear Getter seeds
- 全safe zonesを一度ずつ使う
- safe zone滞在を短くしてClear

---

# 6. Stage10 — 押花の保管庫 / Hana

Production seed:
- mechanic: 鈍足 / 持続damage / 保存罠

## Player feeling

> **残すものが増えるほど、足場が少しずつ変わる。**

## Encounter grammar
- preserved hazard patch
- slow field
- lingering damage
- flower/archive zones

## Tempt
hazardを残すbuildで敵を削る。

## Punish excess
fieldを残しすぎると自分のrouteも狭い。

## Alternate answers
- timed cleanup
- mobile burst
- safe archival zones

## Clear Getter seeds
- persistent fieldを一定数以下でClear
- fieldを活用してelite撃破

---

# 7. Stage11 — 未配達の郵便局 / Yubi

Production seed:
- mechanic: 遅延攻撃 / 時間差着弾

## Player feeling

> **今見えている危険より、少し後に届くものを覚える。**

## Encounter grammar
- delayed projectile
- postmark timer
- path-following delivery attack
- delayed reward

## Tempt
目の前のenemyだけ処理すると速い。

## Punish excess
過去に置かれたdelayed attackが後から重なる。

## Alternate answers
- memory route
- delayed shield
- timed movement
- Yubi Support warning

## Clear Getter seeds
- delayed hitを一定回数無傷回避
- pending deliveryを残さずphase突破

---

# 8. Stage12 — 窓際の紙翼 / Madoka

Production seed:
- mechanic: 索敵 / 可視化 / 先制

## Player feeling

> **見えているだけでは足りない。見えた時に動く。**

## Encounter grammar
- offscreen cue
- shadow reveal
- line-of-sight window
- pre-attack glimpse

## Tempt
敵を全部見える状態にすると安全。

## Punish excess
観察に寄りすぎると攻撃機会を逃す / waveが重なる。

## Alternate answers
- act on partial info
- weakpoint burst
- scout Support

## Clear Getter seeds
- reveal前にtelegraphだけで回避
- marked threatへ先制撃破

---

# 9. Stage13 — 白栞の未分類棚 / Shiro

Production seed:
- mechanic: 図鑑 / 変換 / 長期報酬

## Player feeling

> **分からないものを即変換しなくてもいい。**

## Encounter grammar
- unknown-state pickup
- classify later
- temporary blank effect
- transform-on-observation

## Tempt
unknownをすぐ既知rewardへ変換すると安定。

## Punish excess
即分類するとrare variation / alternate effectを失う。

## Alternate answers
- hold unknown
- delayed classify
- run-end conversion

## Clear Getter seeds
- unknown itemを保持してClear
- all classify run / no classify runの両方

---

# 10. Stage14 — 片道ではない改札 / Tobari

Production seed:
- mechanic: 通す / 止める二面性

## Player feeling

> **門は閉じるためだけではなく、戻ってくるためにもある。**

## Encounter grammar
- gate lanes
- one-way temporary passage
- return window
- ticket pressure

## Tempt
敵をgateで止めると楽。

## Punish excess
閉じ続けると自分のescape routeも消える。

## Alternate answers
- timed open
- let one pack through then close
- return loop

## Clear Getter seeds
- gateを開閉両方使ってClear
- 一度通ったgateを帰路として再利用

---

# 11. Stage15 — 夢頁の水路 / Nemu

Production seed:
- mechanic: ランダム高振れ / 書き換え

## Player feeling

> **夢は変わる。でも完全な運任せではない。**

## Encounter grammar
- forecasted state shuffle
- water/page route rewrite
- dream variant enemy
- temporary rule mutation

## Critical rule
ランダムは事前予兆あり。

悪い:
- warningなし即死

良い:
- 次phase候補が2〜3種見える
- Playerがposition/buildで備える

## Tempt
高振れbonusを追う。

## Punish excess
bonus位置へ固執するとrule rewriteに巻き込まれる。

## Alternate answers
- safe variance route
- flexible build
- Nemu cue

## Clear Getter seeds
- 2種類以上のdream stateを利用
- high-roll rewardを取らずClear

---

# 12. Stage16 — 黒折り紙の屋根 / Kuroori + unresolved shadow seed

Production lead ids:
- `kuroori`
- `kage1` (mapping OPEN)

Production seed:
-変形 /近接risk /黒耀化導線

## Player feeling

> **閉じた形と開いた形で、同じ敵の意味が変わる。**

## Encounter grammar
- folded/unfolded enemy stance
- close-range opening
- temporary hidden weakpoint
- black-youka pressure

## Tempt
folded stateへ近づくとhigh reward。

## Punish excess
close-range greedでunfold burstへ巻き込まれる。

## Alternate answers
- ranged patience
- bait unfold
- black-youka timed burst
- Kuroori hold/release support

## Boundary
`kage1`の正体はここで決めない。

---

# 13. Stage17 — 消し跡の壁 / unresolved shadow seed

Production lead id:
- `kage2` (mapping OPEN)

Production seed:
-弱体化 /debuff /視界薄れ

## Player feeling

> **見えなくなっても、無かったことにはならない。**

## Encounter grammar
- fading telegraph
- temporary debuff
- erased trail remains faintly
- visibility reduction

## Tempt
visible targetだけを追う。

## Punish excess
消えたenemy/pathを忘れると再出現に挟まれる。

## Alternate answers
- trace memory
- area damage
- reveal Support

## Clear Getter seeds
- faded enemyを再出現前に処理
- debuff stack低維持

---

# 14. Stage18 — 夜測りの屋上 / unresolved shadow seed

Production lead id:
- `kage3` (mapping OPEN)

Production seed:
-角度critical /方向制御

## Player feeling

> **完璧な角度は強い。でも戦場全体は止まらない。**

## Encounter grammar
- diagonal telegraph
- angle bonus
- rotating line
- directional crit window

## Tempt
perfect angleを狙うと火力が高い。

## Punish excess
角度合わせへ集中しすぎると別方向pressureへ弱い。

## Alternate answers
- broad coverage
- moving angle
- imperfect but safe shot

## Clear Getter seeds
- multiple angle windows利用
- perfect critなしClear

---

# 15. Stage19 — 余白の部屋 / unresolved shadow seed

Production lead id:
- `kage4` (mapping OPEN)

Production seed:
-終盤成長 /選択記録

## Player feeling

> **空いているslotは失敗ではなく、まだ選べる余地。**

## Encounter grammar
- blank slot modifier
- choice history reacts
- unfilled state bonus
- late commit decision

## Tempt
slotを早く全部埋めると即戦力。

## Punish excess
早期full buildでlate transformationを取りにくい。

## Alternate answers
- keep one slot open
- late replacement
- blank trait build

## Clear Getter seeds
- 1slot空けてclimax到達
- early full buildをreplacementしてClear

---

# 16. Stage20 — 夜明け前の広場 / Core5

Production seed:
- Core5総合
- enemy affinity includes Boss46–48

## Player feeling

> **全部の問いに一つの答えを出すのではなく、今まで覚えた複数の解き方を使う。**

## Encounter grammar

Stage1〜5のverbを順に短く再提示:

```txt
pickup / owner
→ label / visibility
→ seal / reopen
→ route / reroute
→ repair / scar
```

Finalは全部同時に重ねない。

### Recommended structure
1. short recall phase
2. mixed pair phase
3. Core5 Support choice payoff
4. Boss-affinity climax
5. Dawn release

## Boss rule
Boss46–48全部を連続フルボスで出すことは未LOCK。

候補:
- one main Boss + two mechanic echoes
- boss order depends on prior route
- 3 bosses as postgame/challenge

Main Storyでは長すぎるboss rushを避ける。

## Clear Getter seeds
- Core5それぞれのverbを1回以上利用
- no-black-youka
- Pair Trait chain
- one blank/unknownを残してDawn

---

# 17. 20Stage differentiation map

| Stage | Primary gameplay identity |
| ---: | --- |
| 1 | pickup / owner |
| 2 | label / visibility |
| 3 | seal / reopen |
| 4 | route / reroute |
| 5 | repair / scar |
| 6 | lane / guide line |
| 7 | split / distribute |
| 8 | helper / summon placement |
| 9 | slow pressure / safe zone |
| 10 | persistent field / preserve |
| 11 | delayed threat |
| 12 | scout / reveal / act |
| 13 | unknown / classify later |
| 14 | gate open/close |
| 15 | forecasted variance / rewrite |
| 16 | fold/unfold / close-range risk |
| 17 | fade / trace / debuff |
| 18 | angle / directional control |
| 19 | blank slot / late commitment |
| 20 | Core5 integrated recall |

1秒でStage motifが違い、1runで判断も違うことを目標にする。

---

# 18. Build diversity requirement

各Stageで最低:
- strong approach >=2
- risky viable >=1
- Support compensation >=1

をdesign reviewする。

Stage gimmick専用weapon必須にはしない。

---

# 19. Difficulty scaling

Hardは各Stage identityを強める。

例:
- Stage11: delayed threatのoverlap増
- Stage14: gate open window短縮
- Stage15: state candidate増加
- Stage18: angle rotation速化

HP multiplierだけで差を作らない。

---

# 20. Production boundaries

Currentになったもの:
- 20Stageそれぞれのprimary gameplay identity
- pressure/tempt/punish/alternate answer direction

OPEN:
- exact wave seconds
- exact spawn count
- final boss per stage
- stage unlock order
- Easy/Normal/Hard exact values
- Shadow `kage1..4` current identity mapping
- runtime implementation/evidence

---

# 21. 一文

> **20Stageは背景を20枚用意するのではなく、同じ移動・自動攻撃・buildというCoreを使いながら、毎Stageひとつ違う判断を覚え、その判断が次のStageでも別の形で役に立つ20の夜にする。**