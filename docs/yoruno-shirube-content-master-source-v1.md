# ヨルノシルベ — Content Master Source v1

Date: 2026-08-11  
Status: **USER-DIRECTION MASTER SOURCE / CURRENT AUTHORITY PRESERVED / NEW DETAILS ARE CANDIDATE UNTIL PROMOTED**

> 目的: 1作目と2作目をそれぞれ一作品として満足できる密度へ仕上げ、3作目は後から意味が変わる伏線だけを残す。その物語と、キャラクター・敵・武器・属性・状態異常・Buff・耐性・ステージ攻略を同じ原本からつなぐ。
>
> 本書は既存CANONを乱暴に置換しない。既存Current事実は維持し、新規Series2/3詳細・追加武器・新規Combat ruleはHuman Review前はCandidateとして扱う。

---

# 1. Authority stack

```txt
CANON / Current machine data
+ docs/series-1-2-3-content-master-v1.md
+ docs/creative-taste-relationship-story-source-v1.md
+ docs/character-appearance-source-book-v1.md
+ src/game/data/combatAffinitySource.ts
+ src/game/data/weaponExpansionSource.ts
+ src/game/data/weaponTransformationSource.ts
+ src/game/data/enemyStatusTraitSource.ts
+ src/game/data/combatItemEffectSource.ts
+ src/game/data/combatVfxLanguageSource.ts
↓
この Content Master Source
↓
Human Review / staged promotion
↓
Current runtime / visual production
```

画像やruntime都合から原本を逆算しない。

---

# 2. Series promise

## 1作目

中心の問い:

> **忘れたら、大切だったことまで消えるのか。**

中心感情:

- 友情
- 兄妹
- 擬似家族
- 青春
- 仲間
- 信頼
- 離反
- 裏切りに見える選択
- 再会
- 卒業の予感

作品としての着地:

- Current21を「主人公+脇役」にせず、主人公不在でも人間関係が動く。
- Core5は同じ仲良し集団ではなく、やり方の違いで本気で衝突する。
- Shadow側にも正しい局面を持たせる。
- 忘却・黒耀化・星獣・灯りの全真相を説明し切らなくても、1作目の人物感情は完結する。
- Happy Endを成立させ、3作目の真相で無効化しない。

## 2作目

中心の問い:

> **終わったら、愛した時間まで失敗になるのか。**

中心感情:

- 師弟
- 恋愛
- 片想い
- 嫉妬
- 離反
- 死別
- 再会
- 双子 / 三つ子Candidate
- 人間 / 動物 / Robot
- 老い
- 不老
- 卒業
- 擬似家族の解散と継続

作品としての着地:

- 老いを弱体化や死亡flagだけにしない。
- 恋愛を成就/失恋の二択にしない。
- 師弟は「先生を超える」だけでなく、離れて別の人生を作れることを卒業とする。
- Robotの人格は人間らしさ獲得競争にしない。
- 双子は「同じ顔であること」から人生が差を作る。
- 2作目もそれ自体で幸福な終わりを持つ。

## 3作目への伏線

残してよい問い:

- 記録と現実が一部一致しない理由
- 星獣の説明と実際の行動が一致しない場面
- 黒耀化を「悪化」とだけ説明できない例
- 夜明けが救済 / 消去 / 変化のどれなのか
- 同じ記憶を持つ二者を同一人物と言えるのか
- 長寿者が過去に見た「似た夜」は本当に同じ現象か

禁止:

- 1・2のHappy Endを「全部偽物でした」で消す
- All Lights = True End と断定
- 3作目を遊ばないと1・2が未完になる設計

---

# 3. Combat philosophy

戦闘は物語と別の数字表ではない。

```txt
Character personality / history
→ 得意属性 / 不得意属性
→ 初期武器 / build傾向
→ Enemy弱点・耐性・status pressure
→ Stage環境
→ Item対策
→ Fusion / Synthesis / Awakening
→ Runごとの攻略差
```

目的:

> **ステージを見てキャラを変える意味を作る。**
>
> 同時に、好きなキャラを使い続けたい人は装備・属性Reaction・耐性で突破できる。

ハードな属性じゃんけんにはしない。

---

# 4. Attribute master

実戦属性は14種 + NEUTRAL。

| 属性 | 戦闘の意味 | 主な状態 |
|---|---|---|
| LIGHT 光 | 照らす / 暴く / 守る | ILLUMINATED / EXPOSED |
| DARK 闇 | 隠す / 沈める / 高risk | ECLIPSED / DROWSY |
| FIRE 火 | 継火 / 燃焼 / 再点火 | BURN |
| WATER 水 | 流す / 濡らす / Reaction起点 | SOAK |
| WIND 風 | 押す / 運ぶ / 軌道変更 | DISORIENTED |
| THUNDER 雷 | 連鎖 / 起動 / 瞬断 | SHOCK / CONDUCTIVE |
| ICE 氷 | 冷やす / 止める / 時間稼ぎ | CHILL / FREEZE |
| EARTH 地 | 重さ / 足場 / Break | EXPOSED |
| METAL 鉄 | 刃 / 工具 / 貫通 / 導電 | CONDUCTIVE / EXPOSED |
| BLOOM 花 | 拘束 / 保存 / 回復 / 根 | ROOTED |
| DREAM 夢 | 遅延 / 揺らぎ / 高振れ | DROWSY / SLEEP |
| MEMORY 記憶 | 記名 / 反復 / 記録 | MARKED / SEALED |
| STAR 星 | 導き / 照準 / critical | MARKED / ILLUMINATED |
| BLANK 余白 | 解除 / 変換 / 書き直し | ERASED / SEALED |

LIGHT = 善、DARK = 悪にはしない。

---

# 5. Character affinity

Current21 + Future15 = **36人物すべて**に:

```txt
primary attribute
secondary attribute
friction attribute
status resistance
combat identity
```

を持たせる。

倍率の基本:

- Primary: 約 +12%
- Secondary: 約 +6%
- Friction: 約 -8%
- 不得意は主に出力 / status buildup差
- 「弱点属性を受けたら被damage増加」は人物側には基本入れない

このため:

- キャラ変更 = 楽な攻略
- 武器変更 = 好きなキャラの弱点補完
- Item耐性 = 特定stage対策
- Fusion = 苦手を別の属性へ変換

が成立する。

---

# 6. Enemy master

Enemy Production DB **48体すべて**に以下を付与する。

```txt
weaknesses
resistances
weakness multiplier
resistance multiplier
hard-control duration multiplier
inflicted statuses
self buffs
resisted statuses
cleanse priority
```

設計原則:

- 完全属性無効は基本禁止。
- BossもFREEZE / SLEEP / ROOTEDを完全immuneにせず、短いslow / delayへ変換。
- Small enemyは1つの明確な圧。
- Mediumはmovement + statusの組み合わせ。
- Eliteはstatus + self Buff。
- Bossは複数pressureを持つが、解除不能の長時間拘束は禁止。

Enemyに属性を付ける意味は「色違い」ではなく、攻略手順を変えること。

例:

- SOAKを撒く群れ → THUNDER敵との同時出現が危険
- ECLIPSEDを撒くShadow → LIGHTだけでなくDAWN_GUARD Itemでも対策可能
- ROOTEDを撒く敵 → WINDキャラ / stone sole / cleanse itemで回答が変わる
- METAL resistant敵 → 雷ReactionのCONDUCTIVEで直接damage以外から崩せる

---

# 7. Status / Debuff master

16種を原本化:

```txt
BURN
SOAK
CHILL
FREEZE
SHOCK
CONDUCTIVE
EXPOSED
ROOTED
DROWSY
SLEEP
MARKED
ILLUMINATED
ECLIPSED
ERASED
SEALED
DISORIENTED
```

重要:

- 無限stack禁止。
- Bossのhard controlは変換。
- 暗闇Debuffで画面を読めなくしない。
- status iconだけでなく敵motion / residueでも読める。
- 同じstatusを複数属性から作れる余地を残す。

---

# 8. Buff master

10種:

```txt
WARMTH
FLOW
TAILWIND
OVERCHARGE
FOCUS
FORTIFY
REPAIR
REMEMBER
STAR_GUIDE
DAWN_GUARD
```

Buffは単純な攻撃力+20%一覧にしない。

- WARMTH = freeze系対策 / 小回復
- FLOW = movement / cadence
- TAILWIND = 弾道 / knockback / 移動
- OVERCHARGE = THUNDER reaction
- FOCUS = critical / weakpoint
- FORTIFY = damage / stagger resistance
- REPAIR = HP / shield / placed object sustain
- REMEMBER = MARKED / memory drop
- STAR_GUIDE = homing / ranged precision
- DAWN_GUARD = LIGHT/DARK Debuff duration guard

---

# 9. Attribute Reaction master

初期12Reaction:

- WATER + THUNDER = 水雷連鎖
- WATER + ICE = 凍結縛り
- FIRE + WIND = 火送り
- LIGHT + DARK = 明暗破り
- METAL + THUNDER = 過負荷
- BLOOM + WATER = 芽吹き
- DREAM + MEMORY = 明晰想起
- BLANK + MEMORY = 書き直し
- EARTH + METAL = 基礎割り
- STAR + LIGHT = 灯星標
- DARK + DREAM = 悪夢
- FIRE + ICE = 温度割れ

Reactionの目的:

> 属性の弱点を覚えるゲームではなく、**2つの武器をどう一緒に使うか覚えるゲーム**にする。

---

# 10. Base Weapon master

既存の非進化基本武器は8系統。

追加Candidateを20系統作り、**基本武器28系統**を目標母体とする。

ターゲット範囲:

> **24〜28 basic weapon families**

これ以上は数だけを目標にしない。

追加武器は20種すべてAttack Archetypeを重複させない:

- scatter
- tether
- cone push
- pulse chain
- lane wall
- slam wave
- returning throw
- trap field
- delayed pulse
- link chain
- homing snipe
- sweep cleanse
- reflect counter
- cone veil
- trail drop
- line stitch
- return homing
- orbit stitch
- spiral control
- lane boundary

「同じ弾を色だけ変える」水増しは禁止。

---

# 11. Fusion / Synthesis / Awakening

基本武器数を増やしすぎず、組み合わせで総攻撃形態を増やす。

Candidate母体:

- **Fusion 18**
- **Synthesis 12**
- **Awakening Candidate 8**
- 合計 **38 transformation candidates**

既存runtime進化7件は別に維持。

## Fusion

2武器が一枠へまとまり、属性Reactionを武器そのものへ変える。

例:

- 火種のマッチ箱 + 送り風の扇 → 火送りの夜扇
- 雨縫い糸 + 銅の音叉 → 雨鳴りの音叉
- ひび鏡 + 黒折り扇 → 薄明の黒扇
- 夜の鉛筆 + 白い消しゴム → 書き直された一行

## Synthesis

武器 + 素材で「同じ武器の別build」へ枝分かれ。

目的:

- 火力型 / control型
- 長時間型 / burst型
- reaction型 / self-buff型

をrun中に選び直せる。

## Awakening

人物の物語進行と結びつく。

単にSSR進化にしない。

- ナギ: しまう / 忘れるを分ける
- ミチル: 正しい道より帰りたい道
- トモリ: 燃やす火と直す火
- ハナ: 枯れたことと無くなったことを分ける
- クロオリ: 隠すだけでなく開く
- ゲン: 北を失っても帰る
- ノア: 同じ過去から別の現在
- ルム: shared memoryの中のprivate one

---

# 12. Item / Passive counterplay

Combat Item Candidate 18種。

役割:

- 属性補助
- Debuff耐性
- cleanse
- Reaction assist
- situational Buff

重要:

> Itemを「攻撃+◯%」「移動+◯%」だけにしない。

例:

- 朝露のハンカチ → BURN対策 + SOAK補助
- 石畳の靴底 → forced movement / ROOTED対策
- 夢頁の折れ角 → DROWSY/SLEEP対策
- 擦れた名前札 → ERASED対策 + REMEMBER
- 白い当て布 → ERASED/SEALED duration対策
- 朝側の半券 → ECLIPSED対策

これによって「不得意キャラでも装備で行く」が成立する。

---

# 13. Stage combat identity

20Stageすべてに:

```txt
favored attributes
suppressed attribute
hazard status
build question
```

を持つ。

Stageは単なる背景違いにしない。

例:

- 忘れられた夜道 → LIGHT / MEMORYが読みやすい基準面
- 月箱の書庫 → ICE / BLANK、control/defense
- 帰り道の交差点 → STAR / WIND、方向/誘導
- 継火の修理工房 → FIRE / METAL、設置/repair
- 押花の保管庫 → BLOOM / WATER、root / sustain
- 夢頁の水路 → DREAM / WATER、高振れ/control
- 黒折り紙の屋根 → DARK / BLANK、高risk shadow
- 消し跡の壁 → BLANK / MEMORY、Debuff処理
- 夜測りの屋上 → METAL / STAR、angle/precision
- 夜明け前の広場 → Core5総合、single-answer禁止

---

# 14. Why switch characters

キャラを変える意味は4層で作る。

1. **Primary/Secondary属性**
2. **status resistance**
3. **初期武器のattack archetype**
4. **stage mechanicとの操作感相性**

例:

同じROOTEDの多いstageでも:

- WIND人物 → positionで避けやすい
- EARTH人物 → forced movementに強い
- BLOOM人物 → rootを逆利用するbuild
- 好きなDARK人物 → ItemでROOTED対策し火力を通す

誰か一人が完全上位互換にならない。

---

# 15. VFX master

属性ごとに:

```txt
primary material
motion language
hit language
residue language
color role
audio texture
forbidden
```

を別に持つ。

禁止:

- 同じparticleを14色にrecolor
- full-screen flash
- neon cyan/purple default
- giant bloom
- hit effectで敵silhouetteを消す
- LIGHT = 白レーザーだけ
- DARK = 紫煙だけ
- ICE = 巨大氷柱だけ
- STAR = galaxy nebula

Reactionは「第三の謎エフェクト」にせず、**2属性の素材が相互作用していることが見える**ようにする。

---

# 16. Balance caps

基本上限:

- character Primary: 1.12x
- Secondary: 1.06x
- Friction: 0.92x
- Enemy weakness: おおむね1.20x
- Enemy resistance: おおむね0.85x
- Boss weaknessはさらに穏やか
- Stage favored: おおむね1.10x
- Stage suppressed: おおむね0.92x
- favorable stacking cap: 約1.45x
- unfavorable floor: 約0.75x

目的:

> 強い相性は感じる。しかし、キャラ選択画面で答えが決まらない。

---

# 17. Series 1 completion gate

1作目を「完成」に近づけるために必要:

- Current21の主要人物arcがStage / Night Record / combat identityへつながる
- 20StageがそれぞれStory Question + Combat Questionを持つ
- 28基本武器母体から1作目採用分を選抜
- Core5各自に複数の得意buildがある
- 48Enemyがcombat/status役割を持つ
- Bossが属性immuneではなくbuild testになる
- Fusion / Synthesisをrun中に最低複数体験できる
- 物語上の黒耀化とcombat上のDARKを同義にしない
- Endingが「全属性を集めたら真End」にならない

---

# 18. Series 2 completion gate

2作目で増やすもの:

- Future15のcombat identityを本実装候補へ
- Robot / animal / long-lived人物専用のmechanical interaction
- 師弟 / 双子 / agingをAwakeningへ接続
- 1作目武器を捨てず、Synthesis branchで新鮮さを作る
- 新Enemyは属性数ではなくstatus interactionで差を作る
- 「1で強かったbuild」が2で完全死しない

---

# 19. Series 3 foreshadow through combat

3への伏線はStory cutsceneだけに置かない。

候補:

- 同じ属性なのに一部EnemyだけReaction挙動が違う
- 星獣付近だけstatus durationが微妙に異なる
- 一部記録に存在しないEnemyがMEMORYへ反応する
- LIGHT + DARK reactionが「相殺」でなく第三の状態を生む
- BLANKがERASEではなくREWRITEとして働く理由が後で効く
- Robotの同snapshot二bodyで同じ武器のSynthesis候補が分岐する

ただし1/2攻略に必要な説明は各作品内で完結させる。

---

# 20. Final rule

> **ヨルノシルベの戦闘は、弱点色を当てるゲームではない。誰で行くか、何を持つか、何を組み合わせるか、何を耐えるかで、その夜の歩き方が変わるゲームにする。**
