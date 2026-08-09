# ヨルノシルベ Enemy Encounter / Relationship Pressure v1

Date: 2026-07-29  
Status: **CURRENT ENCOUNTER DESIGN GUIDE / EXACT SPAWN & BALANCE VALUES OPEN**

> 目的: カゲモノをLore飾りではなく、Character / Pairが抱える同じ問いを戦闘中にもう一度プレイヤーへ突きつけるgameplay pressureとして設計する。
>
> 敵は「このキャラの心から生まれた専用トラウマ」ではない。同じカゲモノでも、操作Character / Support / buildによって意味が変わる。

Authority:

- `docs/ENEMIES.md`
- `src/game/data/enemyProductionDatabase.ts`
- `docs/character-relationship-arc-book-v1.md`
- `docs/BOND.md`

---

# 0. Encounterの役割

良いEncounterは4つを同時に満たす。

```txt
1. 一目で危険が読める
2. buildの強み / 弱みを試す
3. Character / Pairの戦い方を変える
4. 後から見れば世界Themeと同じ問いになっている
```

Loreのために戦闘を止めない。

Enemy meaning priority:

```txt
combat readability
> counterplay
> build interaction
> character resonance
> optional lore explanation
```

---

# 1. Pressure verbs

現行48体を、名前ではなくplayerへ要求する動詞でも分類する。

| Pressure verb | 代表motif | Playerへ要求すること |
| --- | --- | --- |
| **追う** | 墨 / 犬切符 / 狼火 | positionを変え続ける |
| **塞ぐ** | 改札 / 黒板 / 月箱 | routeを読み直す |
| **固定する** | 名札 / 消印 / 地図ピン | 一度決めたtarget /位置から離れる |
| **遅らせる** | 封筒 / 糸 / 夢波 | timingをずらす |
| **隠す** | レンズ / 古写真 / 烏紙 | silhouette / behaviorを見る |
| **集める** | 鈴 / 墨腕 | crowd densityを管理する |
| **閉じる** | 鍵穴 / 月箱 / 余白枠 | safe spaceとescapeの両方を見る |
| **迷わせる** | 方位 / 迷針 / Boss48 | 一つのrouteへ固執しない |
| **置き換える** | 名札 / Boss46 | label以外で対象を見る |
| **残す** | 継ぎ目 / 古写真 / 押花 | hazard / traceを後の判断へ使う |

一体へ複数動詞を盛りすぎない。
通常敵は**主動詞1つ + 補助1つまで**を基準にする。

---

# 2. Character pressure map — Current21

これは専用enemy割当ではない。
「その人物を使うと、同じ敵がどう面白く見えるか」の設計表。

| Character | 得意なpressure | 苦手として面白いpressure | 成長後に変わる読み |
| --- | --- | --- | --- |
| ユイ | 散ったpickup / ally回収 | 全回収を誘うdecoy / ownerless drop | 拾える = 拾う、ではなくなる |
| アサ | target mark / fast priority | false label / multiple names | 名前を付けるより本人の選択を待てる |
| ナギ | hazard seal / temporary storage | safe areaを閉じすぎるpressure | 閉じる対象を選ぶ |
| ミチル | route adaptation | single-safe-route illusion | 正解routeを途中で捨てられる |
| トモリ | broken state recovery | repairすると別hazardが出る状態 | 完全修理以外を選べる |
| セン | telegraph explanation / guide line | misleading perfect line | guideを強制しない |
| リツ | shared defense / split resource | protect target overload | 守る対象へ役割を返す |
| コヨリ | small clue / hidden pickup | 大型enemy中心で小さいsignalが埋もれる | 小さい情報がparty判断になる |
| ゲン | old pattern recognition | current routeとの差 | 昔のpatternを絶対視しない |
| ハナ | persistent object / archive | saved hazard accumulation | 保存する / 手放すを選ぶ |
| ユウビ | delayed / target delivery | wrong timing reward | 届けない判断も能力になる |
| マドカ | offscreen warning | uncertain telegraph | 未確定warningを共有する |
| シロ | unidentified object | classification trap | 分類しないまま保持する |
| トバリ | gate / return point | one-way forced route | return optionを作る |
| ネム | altered route / dream-like wave | false pattern repetition | 夢を予言でなく観測として扱う |
| クロオリ | temporary seal / conceal | forced-open mechanic | 隠す期限 /本人選択を見る |
| カナメ | intercept / body block | multi-angle simultaneous attacks | 全部受けず役割分担する |
| カスミ | blur / conceal | label exposure / irreversible mark | 隠す /明かす範囲を選ぶ |
| トキ | angle / timing / repeated pattern | nonperiodic route | 測れない領域を残せる |
| ツムギ | lingering state / unfinished object | forced-complete mechanic | 終わらせる時も選べる |
| レン | variant / mimic / delta | meaningless noise differences | 差 = 異常と決めない |

---

# 3. Pair pressure modules

Pair Traitはボーナスだけでなく、**そのPairだから解き方が変わるEncounter**を持てる。

## 3.1 ユイ × アサ — False Owner Module

使用motif:

- オンブ 名札
- オンブ 消印
- オンブロ 名札
- Boss46系

### Situation

複数enemy / dropへ同じlabelが付く。
名前表示だけ追うと誤targetへ誘導される。

### Low Bond

- アサが最初のlabelへmark
- ユイがlabel付きdropを全部吸う
- false labelまで強化してしまう

### High Bond

- アサがbehavior確認までmark確定を遅らせる
- ユイがownerless対象を一時保留できる

Player skill:

> **UI labelではなく、動き / silhouette / contextを見る。**

---

## 3.2 ナギ × カナメ — Double Guard Trap

使用motif:

- オンブロ 月箱
- オンブロ 墨腕
- Boss47系

### Situation

大攻撃の直後に小さい追撃が来る。
最初の攻撃へ二人のdefenseを同時消費すると追撃へ対応できない。

### Low Bond

二重防御。

### High Bond

```txt
カナメ intercept
→ ナギ hazard seal
→ カナメ退避
```

Relationship growthをinput timingで感じさせる。

---

## 3.3 ミチル × トキ — Broken Compass Module

使用motif:

- オンブ 方位
- オンブ 地図ピン
- オンブロ 迷針
- Boss48

### Situation

最初に表示されたsafe routeが途中で危険へ変わる。

### Low Bond

- トキは最初の計測を維持しすぎる
- ミチルは即興でrouteを変えすぎる

### High Bond

- measured segment
- adaptive segment

を交互に使う。

Playerへ「正しい線を覚える」ではなく「線が変わる条件を覚える」ことを要求する。

---

## 3.4 トモリ × ツムギ — Repair Scar Module

使用motif:

- オンブ 糸
- オンブ 片ボタン
- オンブロ 継ぎ目
- オンブロ 余白枠

### Situation

arena objectが壊れる。
完全repairすると通路は戻るが、敵の新routeも開く。
仮repairなら狭いが敵も通りにくい。

### Pair decision

```txt
full repair
temporary stitch
leave scar as blocker
```

の三択Candidate。

単純な「修理ゲージを最大まで溜める」を避ける。

---

## 3.5 リツ × コヨリ — Protect the Wrong Target Module

使用motif:

- オンブ 鈴
- オンブ 犬切符
- 小型clue enemy

### Situation

大きく目立つ危険targetと、小さく重要なsignalが同時に出る。

低Bondのリツはコヨリを安全側へ固定し、small clue処理を失う。
高Bondではコヨリ自身が役割を選ぶ。

Gameplay上「子どもだからEscort対象」だけにしない。

---

## 3.6 マドカ × レン — Uncertain Difference Module

使用motif:

- オンブ レンズ
- オンブ 古写真
- variant enemy

### Situation

複数enemyのうち1体だけattack timingが少し違う。
その差が重要な時と、ただのnoiseの時がある。

High Bondで:

```txt
レン: difference detect
マドカ: threat relevance判断
```

へ分担。

「全部の差を見つければ正解」にはしない。

---

# 4. Encounter rhythm — 1 run内で関係を語りすぎない

Relation pressureは毎wave出さない。

推奨構造Candidate:

```txt
早期:
  Pairの得意な簡単問題

中盤:
  同じ強みが裏目に出る問題

後半:
  相手へ任せないと損する問題

Boss / elite:
  それまでの理解を一度だけ統合
```

これによりNarrative cutsceneなしでも:

```txt
最初: この二人、強い
↓
途中: 強みがぶつかった
↓
最後: 同じ能力なのに使い方が変わった
```

をplayで作れる。

---

# 5. Boss46 — 持ち主のない名前

Current identity:

> 名前だけが残り、誰のものか分からない。

Boss46は「本物を当てるクイズ」だけにしない。

## Phase candidate

### Phase A — Label

- enemy / pickupへname-tagが付く
- labelとsilhouetteが一致する
- playerにlabelを信用させる

### Phase B — Duplicate

- 同じlabelが複数へ付く
- target UIだけでは判断できない

### Phase C — Wrong Ownership

- 正しい名前でも持ち主が違う
- movement / released clue / contextを読む必要

### Phase D — Ownerless Core

- 最後に空白の名札核
- 「空白へ正しい名前を書けば勝ち」にはしない
- core behaviorを読んでattack windowを作る

## Character resonance

### アサ

名前は重要だが、labelを付けるだけでは本人にならない。

### ユイ

持ち主確認なしに全部回収する危険。

### カスミ

名前を隠すことが必ずしも消去ではない。

### ヨモ Future

複数の名前でも一匹の人生。
Boss46のThemeを別角度から反転できる。

---

# 6. Boss47 — 閉じた朝箱

Current identity:

> 朝を箱にしまえば夜は終わらない。

Boss47はtank bossではなく**safe spaceが徐々にprisonへ変わるboss**。

## Phase candidate

### Phase A — Shelter

Bossが外周攻撃を遮る壁を作る。
一見playerに有利。

### Phase B — Narrow

壁が残り続け、移動可能areaが減る。

### Phase C — Lock

安全地帯の入口が閉じ始める。

### Phase D — Open Core

Bossが攻撃のため一部を開く。

Playerは:

> 安全だから中にいる

から:

> **安全でも、自分で出るtimingを選ぶ**

へ切り替える。

## Character resonance

- ナギ: 閉じる対象を選ぶ
- カナメ: 守るため自分が残りすぎない
- トバリ: 出口と帰路はセット
- クロオリ: 預かることと永久封印は違う

---

# 7. Boss48 — 帰路のない夜

Current identity:

> 帰り道が無い夜は、ずっと続く。

Boss48は「迷路」より**正しい一本道への依存**を崩す。

## Phase candidate

### Phase A — One Safe Line

一本だけ明るいroute。
そこへいれば安全。

### Phase B — Return

過去に通った同じ線をattackが逆走する。

### Phase C — Recalculate

Bossが地図線を塗り替える。
さっきの正解routeが危険になる。

### Phase D — Multiple Dawn Routes

最後は巨大な一本の正解routeを出さない。
複数の細いrouteが同時に成立する。

Gameplay payoff:

> **一つの正解を見つけるBossではなく、正解が変わる世界で帰り方を選ぶBoss。**

## Character resonance

- ミチル: 歩いて選ぶ
- トキ: 測定を更新する
- ゲン: 古い道を記録として残す
- マドカ: route変化をwarning
- レン: 前phaseとの差分
- アマネ Future: 「通れる道」と「自分が選ぶ速い道」は違う

---

# 8. Defeat language — 敵を死体にしない

通常撃破:

```txt
hit
→ silhouetteが崩れる
→ 黒インクが外へ散る
→ 一部だけ紙 / 小物 / traceとして残る
→ EXP記憶片へ戻る
```

Boss撃破:

```txt
巨大形状が爆散
```

だけにしない。

最後の数秒は**攻撃的形状が機能を失い、元のordinary motifへ戻る**。

例:

- Boss46: 無数の名札 → blank tag / safe pin / unreadable paper
- Boss47: 巨大箱 → 小さい鍵傷 / 開いた蓋 / 朝色の隙間
- Boss48: tangled route → 複数の細い地図線 / 折れた針

「倒したらかわいそう」を強制せず、後から意味が分かる程度にする。

---

# 9. Kagemono Collection text progression

図鑑を最初からLore説明書にしない。

## First encounter

戦闘情報中心。

```txt
オンブ 方位
一度止まり、向きを変えてから接近する。
針の停止方向を見る。
```

## Repeated encounter

released clueを追加。

```txt
倒れる時、ごく小さな針だけが残ることがある。
```

## Character resonance

特定Character / Pairで遭遇するとoptional observationが増える。

```txt
ミチル:
「道を指してるんじゃなくて、決めようとしてる？」
```

これはpower unlock条件にしない。

## Boss clear

「真実」を断定せず、re-readingを置く。

```txt
正しい方角を知っていたのではない。
方角が一つでなければ困るように見えた。
```

---

# 10. Future cast pressure seeds

Future15をCurrent48専用対応へ固定しない。
相性だけ保持する。

| Future | Existing motifで試せるTheme |
| --- | --- |
| ヒヨリ | 夢波 / 鈴 — 全員を同じtempoへ揃えない |
| セリカ | 墨腕 / 月箱 — costを全部肩代わりしない |
| クロエ | Boss47 — 夜に留めれば時間が止まる誘惑 |
| レンジ | Boss48 — 有限でも進むroute |
| トウマ | 継ぎ目 / 古写真 — 作者名と作品の痕跡 |
| クウ | 名札 / 古写真 — 名前や写真以外のrecognition |
| ヨモ | 名札 / Boss46 — 複数名 / owner identity |
| ノア | レンズ / 古写真 / variant — same origin / different present |
| ルム | 糸 / 継ぎ目 — sync / individual repair trace |
| マキ | 方位 / 迷針 — 決断の速さと選択権 |
| スズ | レンズ / 烏紙 — presentation / concealment |
| イオ | 余白 / 白線 — classificationを急がない |
| カイ | 鈴 / linked swarm — 一緒でいるbonusのrisk |
| ナオ | レンズ / variant — differenceを作りすぎない |
| アマネ | 改札 / 地図ピン / Boss48 — route accessibilityとspeed choice |

---

# 11. Anti-patterns

## 敵を人格説明装置にしない

悪い:

> この敵はユイの罪悪感が具現化したもの。

良い:

> この敵は「全部拾うほど安全」というwrong readingをcombat pressureにする。ユイrunでは特に刺さる。

## 専用敵を増やしすぎない

Characterごとに専用enemyを作ると:

- content量が爆発
- 他runで意味がなくなる
- 既存48が薄くなる

既存48のmechanic interpretationを変える方を優先する。

## Bossを思想演説させない

Boss46〜48は長文を喋らなくてもよい。

- label
- box
- route

のbehaviorで十分に対話できる。

## Loreでtelegraphを隠さない

物語上「曖昧」がThemeでも、attack予兆まで不公平に曖昧にしない。

Theme ambiguity ≠ gameplay unreadability.

---

# 12. Production checklist

Encounterを追加 / 改修する時:

- [ ] 主動詞が1つで言える
- [ ] attack cueが視覚で読める
- [ ] counterplayがある
- [ ] counterが特定Character必須ではない
- [ ] 特定Characterなら別解法 / 強みが出る
- [ ] Pairならrelation growthを操作感でも感じられる
- [ ] enemyを個人トラウマへ固定していない
- [ ] Current48 identityを旧enemy名で置換していない
- [ ] Legacy mechanicを使う場合、name / loreまで復活させていない
- [ ] defeat後のreleased clueがordinary motifへ戻る
- [ ] 図鑑を読まなくても攻略できる
- [ ] exact spawn / damage / cooldownをdocsだけでLOCKしていない

---

# 13. 一文

> **カゲモノはキャラクターへ答えを教える敵ではない。キャラクターが普段うまく使えている長所を、戦闘の圧力で“使いすぎたらどうなるか”まで押し返してくる存在である。**
