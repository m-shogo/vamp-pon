# ヨルノシルベ Enemy / Kagemono Master

Date: 2026-07-29  
Status: **CURRENT ENEMY ENTRYPOINT / CURRENT 48 IDENTITY + LEGACY MIGRATION MAP**

> 目的: エネミー / カゲモノについて、現在の48体・オンブ / オンブロ造形・過去のEnemy Bible・Stage別48体詳細案を一本の入口から理解できるようにする。
>  
> 今後、通常の敵設計でrepo全体から古い資料を探し直さない。

---

# 0. Authority / 読む順番

Enemyを扱う時は次の順番。

```txt
1. docs/ENEMIES.md
2. src/game/data/enemyProductionDatabase.ts
3. docs/enemies/omb-ombro-selected-direction.md
4. 必要な場合だけ data/enemy-assets/enemy-design-*.json
5. Legacy資料はmigration理由の監査時だけ
```

## Authority boundary

| Source | Current role | Authority |
| --- | --- | --- |
| `docs/ENEMIES.md` | 世界観 / 敵設計原則 / legacy統合 / current routing | **CURRENT semantic master** |
| `src/game/data/enemyProductionDatabase.ts` | 現行48体のid / No / name / rank / family / wrongReading / movement / cue / silhouette / stageAffinity | **CURRENT production identity** |
| `docs/enemies/omb-ombro-selected-direction.md` | オンブ / オンブロ共通造形 | **CURRENT selected visual direction** |
| `data/enemy-assets/enemy-design-catalog.json` + Stage別JSON | 旧48詳細のvisual / telegraph / counter / phase設計 | **DETAIL RESERVOIR; name identityではない** |
| 旧 `Enemy Design Bible` / 旧50体候補 | 発想履歴 / mechanics reservoir | **LEGACY** |
| generated/reference sheet | 制作参考 | **reference only** |

重要:

> 古い詳細ファイルに魅力的な名前やBossがいても、それだけで現行48体を置換しない。

現行48体の名前・テーマと衝突する場合は `enemyProductionDatabase.ts` を優先する。
旧案からは**動き・予兆・counter・シルエット・演出構造**を回収できる。

---

# 1. 敵とは何か

## CURRENT WORLD DIRECTION

ヨルノシルベの敵は、基本的に「悪い生き物」ではない。

有力な世界原理とGame Coreを接続すると:

```txt
記憶 / 意味 / 関係
↓
一つの読み方へ固まる
↓
別の解釈を拒む
↓
黒インクとして固定される
↓
自分を守る形を取る
↓
カゲモノとして現れる
```

倒す = 殺す、ではない。

> **固まった読みをほどき、再接続可能な記憶片へ戻す。**

これにより:

```txt
combatで敵を倒す
= gameplay上は爽快な撃破
= story上は固定された意味をほどく
= dropした記憶片がEXPになる
```

を同じ原理で説明できる。

## やらない

- 敵を全員「死者の魂」にする
- 敵を全員「誰か一人のトラウマ」にする
- 黒い見た目だから邪悪、とする
- 倒すほど罪悪感を要求する
- 毎雑魚へ長い悲しい過去を付ける
- gameplay readabilityよりLoreを優先する

敵はまず**戦って気持ちいいgame object**である。
意味はその後ろにある。

---

# 2. Enemy design grammar

一体を作る時は最低限この鎖を持つ。

```txt
1. ordinary object / trace
2. wrong reading
3. silhouette
4. gameplay verb
5. telegraph
6. counterplay
7. released clue
8. defeat後のre-reading
```

例:

```txt
切符
↓
「行き先は一つしかない」
↓
切符片を背負う小影
↓
直線突進
↓
切符穴が光る
↓
横へ外す
↓
切符穴 / 白い切符
↓
「道は一つではなかった」へ読み直せる
```

Loreとmechanicを別々に足さない。

---

# 3. Visual family — オンブ / オンブロ

## オンブ

Current selected direction:

- 柔らかい黒インク身体
- 完全な球体にしない
- 頭頂部に一滴状のインク芽
- 古紙色の小さな四角い目2つ
- 口なし
- 腕なし
- 全身を包む暗い影炎モヤ
- 足元 / 後方へ溶ける
- 小さなインク粒2〜4個
- かわいさは顔パーツ追加ではなく、潰れ / 揺れ / ほどけ方で出す

## オンブロ

オンブの単純拡大ではない。

- 低く横長
- 接地面が広い
- インク芽はfamily記号として維持
- 目の間隔を広げる
- 影炎から重い擬手が伸びる
- 擬手に骨 / 筋肉 / 人間の指を作らない
- 遅いが進路を塞ぎ、近距離へ届く

## Shared defeat language

```txt
hurt:
影炎が外へ散る
↓
本体へ吸い戻る

defeat:
本体と影炎の区別がなくなる
↓
紙染み / 小物片 / インク粒へほどける
```

爆散する肉体ではなく、**固定が解ける**見せ方を守る。

---

# 4. 敵の4つの読み方

現行48体を「48個の別設定」として覚えない。

## A. Noise / fragment

小さな不安、濡れた記憶、紙片、鈴など。

役割:

- 数を作る
- combat rhythmを作る
- 基本操作を気持ちよくする

## B. Object-fixed reading

名札 / 切符 / 鍵穴 / 封筒 / 写真 / 定規など。

> 普通の物へ、一つの意味だけが貼り付いている。

## C. Animal-like shadow

蛾 / 烏 / 兎 / 狼火 / 蝙蝠 / ヤモリ / 羊夢 / 犬切符 / 古梟。

動物そのものが邪悪なのではない。
**movement silhouetteを増やすための影の読み**。

Futureの実在動物クウ / ヨモや星獣とは別。

## D. Great Shadow

場所全体のwrong readingが巨大化したBoss。

人格ある悪役コピーではなく:

> **その場所が言い続けている一つの答え**

に近い。

---

# 5. Current Production 48

以下が現在のidentity spine。

`Gameplay verb` はproduction dataから読める設計方向であり、Unity runtimeで全mechanic実装済みという意味ではない。

## Small / Ombu 01–35

| No | Current name | Fixed / wrong reading | Gameplay verb / reading | Main motif |
| ---: | --- | --- | --- | --- |
| 01 | **オンブ 墨** | ただの黒い塊に見える | slow approach / basic swarm | 忘れられた街 |
| 02 | **オンブ 青灰** | 濡れた記憶が乾かない | wavering slow approach | 夢 / 水面 |
| 03 | **オンブ 紫黒** | 強い感情を全部「夜」と読む | faster snake approach | 黒耀化 / 黒折 |
| 04 | **オンブ 紙片** | 紙片そのものが敵に見える | light paper-like approach | 紙 / 折れ角 |
| 05 | **オンブ 切符** | 行き先が全部同じに見える | near-straight charge | 駅 / 道 |
| 06 | **オンブ 名札** | 名前を貼り間違える | target-focused approach | アサ / 名前 |
| 07 | **オンブ 白線** | 道筋が消されたように見える | follows curved line | チョーク / 線 |
| 08 | **オンブ しおり** | 閉じた途中頁は進まない | slow flank | 本 / 中断 |
| 09 | **オンブ 方位** | 帰り道が敵の方向を指す | stop → reorient | 方位 / 地図 |
| 10 | **オンブ 押花** | 枯れたものは戻らない | slow dense group | 保存 / 花 |
| 11 | **オンブ 封筒** | 届かなかったものは意味がない | delayed catch-up | 手紙 / timing |
| 12 | **オンブ 窓** | 見ていただけなら何もしていない | side glide | witness / window |
| 13 | **オンブ 消し跡** | 消したものは最初から無い | fades near target | 消去 / 痕跡 |
| 14 | **オンブ 定規** | 正しい角度以外は間違い | diagonal line | 測定 / 角度 |
| 15 | **オンブ 余白** | 何もないなら価値がない | slow expand | blank / possibility |
| 16 | **オンブ 鈴** | 呼ぶ音が逆に迷わせる | lure / gathering motion | 呼び戻し |
| 17 | **オンブ 朝露** | 朝のものまで夜へ沈む | slow stop / glint | dawn / heal contrast |
| 18 | **オンブ マッチ** | 火をつける前に消える | short fast dash | fire / temporary power |
| 19 | **オンブ 鍵穴** | 閉じたものは守られているだけ | hardens near target | seal / permission |
| 20 | **オンブ 糸** | 継いだ跡は傷でしかない | leaves thin trail | repair / seam |
| 21 | **オンブ 消印** | 押された印がすべてを決める | rhythmic stop | proof / date / finality |
| 22 | **オンブ 地図ピン** | 刺さった場所から動けない | stop → lunge | fixed location |
| 23 | **オンブ 片ボタン** | 片方だけでは留められない | circular approach | everyday repair |
| 24 | **オンブ リボン** | ほどけるなら結んだ意味がない | side sway | bond / knot |
| 25 | **オンブ レンズ** | 歪んで見えたものを本物と思う | thin haze approach | observation |
| 26 | **オンブ 古写真** | 写っていないものは無かった | slides from edge | archive / record |
| 27 | **オンブ 白蛾** | 光に寄るものは燃えるだけ | seeks light | lamp / attraction |
| 28 | **オンブ 烏紙** | 黒い紙は全部隠すもの | fast diagonal | クロオリ / fold |
| 29 | **オンブ 黒兎** | 跳ねた先だけが正解 | hop | blank / route |
| 30 | **オンブ 狼火** | 守るなら近づきすぎてもよい | fast close pressure | protection / risk |
| 31 | **オンブ 蝙蝠** | 夜の角度だけが正しい | zigzag | angle / night |
| 32 | **オンブ ヤモリ** | 残った跡だけを追う | wall-side crawl | trace / erasure |
| 33 | **オンブ 羊夢** | 夢なら何でも変えてよい | floating slow | dream |
| 34 | **オンブ 犬切符** | 待っているだけでは通れない | persistent chase | station / waiting |
| 35 | **オンブ 古梟** | 古い方角だけが安全 | delayed turn | old route / Gen |

## Omburo / Elite 36–45

| No | Current name | Fixed / wrong reading | Gameplay verb / reading |
| ---: | --- | --- | --- |
| 36 | **オンブロ 墨腕** | 抱えたものを離せない | slow pressure + extending arm |
| 37 | **オンブロ 名札** | 貼られた名前を外せない | lateral orbit + nameplate push |
| 38 | **オンブロ 月箱** | しまえば無かったことになる | slow armored push / lid cue |
| 39 | **オンブロ 迷針** | 帰り道が絡まっている | diagonal interception / split needle |
| 40 | **オンブロ 継ぎ目** | 直した跡から夜が漏れる | persistent approach / leaking seam |
| 41 | **オンブロ 改札** | 通れないなら戻るしかない | lane / wall control |
| 42 | **オンブロ 黒板** | 消された答えが正解に見える | line / lane creation |
| 43 | **オンブロ 夢波** | 夢なら進路を変えられる | area ripple / fluctuation |
| 44 | **オンブロ 黒折** | 折れば隠せる | elite transform / fold-blade opening |
| 45 | **オンブロ 余白枠** | 空白は黒で埋めればよい | elite space pressure / expanding black center |

## Great Shadow 46–48

| No | Current name | Core fixed reading | Current visual / behavior spine |
| ---: | --- | --- | --- |
| 46 | **持ち主のない名前** | 名前だけが残り、誰のものか分からない | 巨大影 + 無数の名札 / name adhesion |
| 47 | **閉じた朝箱** | 朝を箱へしまえば夜は終わらない | 巨大箱 + 三日月 / arena closure |
| 48 | **帰路のない夜** | 帰り道がない夜はずっと続く | 巨大compass + tangled map lines / route erasure |

---

# 6. Great Shadowを「敵キャラ」として立たせる

Bossへ人間の悪役台詞を大量に付けなくてもCharacterは作れる。

## Behavioral personality

### 46 持ち主のない名前

動詞:

> **貼る / 取り違える / 増やす / 誰のものか曖昧にする**

Playerが感じる性格:

- しつこい
- 整理しているようで混乱させる
- 名前を「人のため」でなく「分類のため」に使う

人間の口で「名前こそ全てだ」と演説しなくてよい。
名札が次々貼り変わるだけで思想を見せられる。

### 47 閉じた朝箱

動詞:

> **しまう / 覆う / 閉じる / 守るつもりで出口を消す**

Playerが感じる性格:

- 遅い
- 重い
- 攻撃的というより圧迫する
- 「ここにいれば安全」とarenaそのものを狭くする

### 48 帰路のない夜

動詞:

> **迷わせる / 線を絡める / 戻す / 道を一本へ固定する**

Playerが感じる性格:

- 追いかけてくるより、逃げ道を変える
- 過去に通ったrouteそのものを敵へ変える
- 最後まで「正しい帰り道」を一つ提示しようとする

Great Shadowは**悪意よりwrong answerの強さ**で怖くする。

---

# 7. Character × Enemy thematic links

これは「この敵はこの人物の心から生まれた」という1対1設定ではない。

> **同じ問いを別角度から見せやすい組合せ**。

| Character | Enemy motifs | 会話 / gameplayへ返せる問い |
| --- | --- | --- |
| ユイ | 墨 / 紙片 / 鈴 / 持ち主のない名前 | 誰の記憶か / 全部戻すべきか |
| アサ | 名札 / 消印 / オンブロ名札 / Boss46 | 名前を付けることと本人が名乗ることは同じか |
| ナギ | しおり / 鍵穴 / 月箱 / Boss47 | 閉じることは守ることか |
| ミチル | 切符 / 方位 / 地図ピン / 迷針 / 改札 / Boss48 | 正しい道は一つか |
| トモリ | 朝露 / マッチ / 糸 / 片ボタン / 継ぎ目 | 傷の残る修理は失敗か |
| セン | 白線 / 定規 / 黒板 | 正しい線を示すことは助けか |
| リツ | リボン / 犬切符 / 墨腕 | 分ける / 抱える / 待つ |
| コヨリ | 鈴 / リボン / 名札 | 小さな名前や結び目を誰が決めるか |
| ゲン | 古梟 / 方位 / Boss48 | 古い道を残すことと固執することの差 |
| ハナ | 押花 / 古写真 | 保存されていないものは無かったのか |
| ユウビ | 封筒 / 消印 / 改札 | 届くこと / 受け取るtiming |
| マドカ | 窓 / レンズ / 古写真 | 見えたもの / 記録されたもの / 伝える責任 |
| シロ | しおり / 消し跡 / 余白 / 余白枠 | 未分類 / 空白を埋めるべきか |
| トバリ | 切符 / 改札 / Boss48 | 門は出すためか、帰すためか |
| ネム | 青灰 / 羊夢 / 夢波 | 夢で変えられるもの / 現実へ持ち帰るもの |
| クロオリ | 紫黒 / 烏紙 / 黒折 | 折る / 隠す / 預かる |
| カナメ | 狼火 / 墨腕 | 守るため近づきすぎること |
| カスミ | 消し跡 / レンズ | 消す / ぼかす / 見え方を変える |
| トキ | 定規 / 蝙蝠 / 迷針 | 測れる角度 / 正しい方向 |
| ツムギ | 糸 / 余白 / 余白枠 | 続き / 空白 /終わり |
| レン | レンズ / 古写真 / 消し跡 | AとBの差は何を意味するか |

この対応を全員の専用Stageへ固定しない。
横断して出るから、同じ敵の意味が別character runで変わる。

---

# 8. Legacy migration — 過去の何を残し、何をCurrentへ戻さないか

## 8.1 旧Enemy Design Bible

旧Bibleの強い原則は吸収する。

### ADOPTED PRINCIPLES

- 敵は悪ではない
- 倒す = ほどく
- 黒く不穏だがhard horrorではない
- 小物 / 紙 / インクの生活感を持つ
- ただの色違いへしない
- シルエットで役割を読む
- 倒した後に小物 / 紙片へ戻る

### LEGACY ONLY

旧50体リストにあった:

- アト
- ヨミ
- カガミ
- カギリ
- リンネ
- カサネ
- ウツシ
- ホシノ
- その他Current21にいない旧人物名

との専用対応はCurrentへ復活させない。

良いenemy ideaだけを人物名から切り離して回収する。

## 8.2 旧Stage別48 detailed design

`data/enemy-assets/enemy-design-*.json` には非常に良い:

- silhouette ratio
- attack telegraph
- counterplay
- animation list
- boss phase
- arena control

が残っている。

ただし、**Current 48 identityと名前が違う**。

したがって扱いは:

```txt
旧name / old ID
= identity authorityではない

mechanic / telegraph / visual trick
= current enemyへ吸収可能なreservoir
```

---

# 9. Legacy concept → Current absorption map

1対1移植ではない。
「何を残す価値があるか」を先に記録する。

| Legacy detailed concept | Strong part to preserve | Current destination / status |
| --- | --- | --- |
| 紙くずの影 | 紙端が逆へめくれてdashを予告 | **オンブ 紙片** mechanic candidate |
| 夜のもや | 低いswarm / 重なる領域damage | **オンブ 墨 / 青灰** swarm candidate |
| 消し跡虫 | zigzag + 残るslow trace | **オンブ 消し跡 / ヤモリ** candidate |
| 紙墓の大喰らい | 未回収dropを吸って成長 | mid/elite encounter mechanic reservoir |
| にじみの母 | drop-like summon telegraph | summoner mechanic reservoir |
| 名札影 | flat nameplate dash | **オンブ 名札** candidate |
| 名前喰い | 正面bite / resource suppression | **オンブロ 名札** candidate |
| 呼び声コウモリ | arc flight + cone wave | **オンブ 蝙蝠 / 鈴** candidate |
| 名を呼ばぬ司書 | temporary weapon lock + back weakpoint | Boss46 / elite candidate; character-like human faceは使わない |
| 百面ラベル | decoy / 本体だけ違うtiny cue | **Boss46** strong candidate |
| 箱影 | object orbit + lid bite | **オンブ 鍵穴 / オンブロ 月箱** candidate |
| 鍵穴蜘蛛 | thread bind / right-angle escape | **オンブ 鍵穴 / 糸** candidate |
| 封蝋ガニ | frontal guard / back counter | **オンブロ 月箱** or elite mechanic candidate |
| 内鍵の番人 | directional shield + open core | **Boss47** strong candidate |
| 封蝋の女王 | ally shield + slow wax zone | **Boss47** add-phase candidate |
| 迷子の方角 | rotating direction cue → side dash | **オンブ 方位 / 迷針** candidate |
| 逆走ネズミ | 同じ軌道を復路で再利用 | **オンブ 犬切符 / Boss48** strong candidate |
| 改札バサミ | lane forecast → close → reopen | **オンブロ 改札** strong candidate |
| 終着駅の車掌 | multiple lanes / one safe route | **Boss48** phase mechanic candidate |
| 帰らずの機関獣 | screen-cross dash + smoke trail | route encounter reservoir |
| 火消し蛾 | light absorb → straight charge | **オンブ 白蛾** strong candidate |
| 残り火ウサギ | jump landing marker + lingering floor | **オンブ 黒兎 / マッチ** candidate |
| 朝隠しカラス | local dim → dive | **オンブ 烏紙** candidate |
| 灯喰らいの大蛾 | temporary light-radius reduction | Stage / elite mechanic reservoir |
| 朝を縫う魔女影 | two-point stitch shrinks arena | **糸 / 余白系 elite** candidate; literal human witchにしない |

---

# 10. Legacy Bosses — 保持するが勝手にCurrent名へしない

## 三路喰らい《ナナシノ》 — LEGACY HIGH-VALUE RESERVOIR

旧Stage2 boss。

強い部分:

- 三つ首で別attackを読む
- blank name-tag core
- chain break phase
- decoy / name coreへの収束

Currentへの最も自然な吸収先:

> **46 持ち主のない名前**

ただし:

- `ナナシノ` をCurrent正式名へ戻さない
- 三つ首犬形状を必須にしない
- Boss46の「持ち主のない名前」という現在Themeを上位にする

### HIGH-VALUE phase candidate

```txt
Phase 1: 無数の名札が貼り付く
Phase 2: false labels / decoysが増える
Phase 3: 一つだけ「持ち主がない」空白核が露出
```

## 帰路巨鹿《ミチシルベ》 — LEGACY HIGH-VALUE RESERVOIR

旧Stage4 boss。

強い部分:

- rail antler
- station clock
- route field
- same-path reverse
- station core exposure

Currentへの自然な吸収先:

> **48 帰路のない夜**

現在の巨大compass / tangled map silhouetteを優先しつつ:

- rail-like route forecast
- reverse path
- safe line selection
- route core exposure

は非常に相性が良い。

`ミチシルベ` を正式Boss名へ自動復活させない。

## 夜綴じ六翼竜《アサマデ》 — SERIES / FUTURE HIGH-VALUE RESERVOIR

旧Stage5 boss。

強い部分:

- 6枚のnight-page wing
- black thread
- previous-stage memory mixing
- dawn-break final visual
- 最終形でもwhite angel / glowing dragonへしない

しかしCurrent 46–48はすでに別Themeで整理されている。

したがって現時点では:

> **Current48へ無理に押し込まない。**

Future endgame / sequel / special boss candidateとして保管する。

これが「良い案を忘れない」と「早すぎるCanon化」を両立する。

---

# 11. Current Boss deepening candidates

以下は**HIGH-VALUE MECHANIC CANDIDATE**。Human / gameplay review前にruntime CanonへLOCKしない。

## Boss46 持ち主のない名前

### Run feel

- 最初は画面上の敵へ名札が貼られるだけ
- 途中から同じlabelが複数へ付く
- target priorityが読みにくくなる
- 本物 / 偽物という単純推理より「名前だけでは持ち主が決まらない」を体験させる

### Counter

- silhouette / movement / behaviorを見て判断する
- name label以外の情報を使う

### Payoff

アサrun:

> 名前は大切。でも名前だけが本人ではない。

ユイrun:

> 持ち主を確認せず全部拾う危険。

別characterで意味が変わる。

## Boss47 閉じた朝箱

### Run feel

- arena外側から少しずつ蓋が閉じる
- 安全地帯を作っているように見える
- 実際は選択肢 /出口が減っていく
- shield面 / open coreを交互に作る

### Counter

- 「閉じた部分を壊す」だけでなく、開いた瞬間を選ぶ
- defensive bossだが待つだけにならない

### Payoff

ナギ / カナメ / トバリで意味が変わる。

## Boss48 帰路のない夜

### Run feel

- map lineが戦場へ出る
- 同じ道を戻るattack
- safe routeが毎回一本に見える
- phase後、その一本も正解ではなくなる

### Counter

- 過去のrouteを覚える
- telegraphを見る
- 途中で別routeへ切り替える

### Final payoff candidate

Bossを倒して「正しい一本の道」が出るのではなく:

> **複数の細い帰路が朝へつながる。**

Main ThemeとGameplayを同じ絵で回収できる。

---

# 12. Enemy “conversation” — 人間の台詞を喋らせなくても対話できる

Regular enemyへ長い日本語台詞を付けない。

敵との会話は:

```txt
behavior
telegraph
environment
released clue
collection text
```

で作れる。

## 例

### 名札系

戦闘前:
- 空白名札

戦闘中:
- wrong labelが貼られる

撃破:
- 安全ピン / 持ち主不明の名札片

後から:
- 「名前だけは残っていた」

### 箱系

戦闘中:
- 開くと危険
- 閉じると進めない

Playerがmechanicとして「開く / 閉じる」を選ぶこと自体が会話になる。

### Route系

Bossが「帰れない」と言葉で言わなくても、map lineを全部塗り潰せば同じ意味が伝わる。

---

# 13. Kagemono Collection / 灯録

カゲモノ図鑑はLore読了をpower conditionにしない。

## Encounter

まず見える:

- name
- silhouette
- movement clue
- simple gameplay note

## Defeat

追加:

- released clue
- wrong readingの短文

## Repeated / condition clear

任意で追加:

- object history
- character側の短い観測
- 別runで意味が変わる記録

読むplayerは世界を深く理解できる。
読まないplayerは「弱点分かった」で成立する。

---

# 14. Gameplay diversity checklist

現行48を見た目違いだけにしないため、旧案のmechanicsを活かして次を分散する。

- direct chase
- slow swarm
- short dash
- reverse dash
- zigzag
- wall-side crawl
- light seek
- target mark
- lane creation
- lane closure
- flank
- bind / slow trail
- frontal guard
- directional weakpoint
- decoy
- summon
- drop absorb
- arena shrink
- local dim
- route replay
- temporary safe path

ただし同じStageで全部出さない。

> **敵の種類数より、1runの読みやすいcontrastを優先する。**

---

# 15. New enemy rule

新しい敵を足す前に確認:

```txt
既存48と違うwrong readingか？
既存48と違うgameplay verbか？
シルエットだけで役割が分かるか？
Stage / Character Themeを説明するためだけの色違いではないか？
既存enemyへmechanicを足す方が強くないか？
```

skin / palette / 小物だけ違うなら、新ID追加よりexisting 48のvariantとして検討する。

現在は**新規enemy数を増やすより、48体の交換不能性とcombat contrastを上げる**。

---

# 16. Production boundary

この文書の追加・整理だけで:

- U49 readinessを上げない
- Unity runtime実装済みと扱わない
- Boss phase実装済みと扱わない
- asset final承認と扱わない
- gameplay balance PASSと扱わない

企画 / story / content identity と runtime readinessは分離する。

---

# 17. Update rule

Enemyの重要案が出たら:

```txt
ENEMIES.mdでcurrent 48と衝突確認
↓
既存48へ吸収できるか確認
↓
吸収可能ならcandidate mechanicとして記録
↓
新IDが必要なら理由を明示
↓
Human / gameplay review
↓
必要時だけproduction dataへ反映
```

Legacyを再びauthorityへ戻さない。

---

# 18. 一文

> **ヨルノシルベの敵は、倒すためだけの黒い怪物ではない。日常の小物や記憶が一つの意味へ固まり、戦場で読めるmovementとsilhouetteを持ったカゲモノである。Playerはそれを爽快にほどき、別のcharacter・build・runを通して同じ敵の意味まで少しずつ読み直していく。**
