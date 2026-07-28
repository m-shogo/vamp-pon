# ヨルノシルベ Character Hub

Date: 2026-07-28  
Status: **CURRENT CHARACTER ENTRYPOINT**

> キャラクターに関する質問・設計・画像brief・会話・Bond・関係性を扱う時は、まずこの1ファイルを読む。  
> repo全体から毎回キャラ設定を探し直さない。移行済みlegacyは通常読まない。

---

# 1. 最初に読むCurrent master

| 知りたいこと | Current master |
| --- | --- |
| Current 21をすぐ理解する | `docs/character-book-v3.md` |
| 日常 / 癖 / 怒り / 嘘 / 口調 / 呼び方 | `docs/CHARACTER-LIFE-AND-SPEECH.md` |
| 仲間同行 / Bond / 戦闘連携 / 不安定ペア | `docs/BOND.md` |
| 黒耀化 / 固有呼称 / 歪み | `docs/BLACK-YOUKA.md` |
| 誕生日 / 好物 / 趣味 | `docs/character-personal-profile-canon-v1.md` |
| 星座 / 星獣 / 由来 | `docs/character-star-beast-constellation-canon-v1.md` |
| 体型 / 年齢感 / 眼鏡 | `docs/character-silhouette-diversity-current-canon-v1.md` |
| 時代差 / 別時代の人物接続 | `docs/story-temporal-layer-and-character-connections-v1.md` |
| Current 21の繋がり候補 | `docs/character-connection-web-high-value-candidates-v1.md` |
| 不老の魔女 / 複数世代の弟子 / 恋愛史 | `docs/character-long-lived-witch-arc-v1.md` |
| production combat / art data | `src/game/data/characterCanon.ts` / `docs/180-unified-character-canon.md` |
| Core5灯合わせ | `src/game/data/pairLightArts.ts` |

通常のCurrent 21人物質問は `character-book-v3.md` までで答える。

**Futureの魔女 / 弟子については `character-book-v3.md` 内の旧「恋愛なし」記述を使用しない。`character-long-lived-witch-arc-v1.md` が最新版Candidate。**

---

# 2. Current roster

## Core 5

**ユイ / アサ / ナギ / ミチル / トモリ**

## Circle 10

**セン / リツ / コヨリ / ゲン / ハナ / ユウビ / マドカ / シロ / トバリ / ネム**

## Shadow / Rival 5

**クロオリ / カナメ / カスミ / トキ / ツムギ**

Stable runtime IDs:

```txt
kuroori
kage1 = カナメ
kage2 = カスミ
kage3 = トキ
kage4 = ツムギ
```

## Official Reserve

**レン**

Current character scope: **20 + reserve 1 = 21人**

---

# 3. 人物トーン

世界は暗い。
人物の性格は揃えない。

明るい / ネガティブ / 無口 / 強気 / 怖がり / ギャル / お嬢様 / 子ども / ぽっちゃり / 渋い大人などが同居してよい。

全員に必要なのは「ポジティブ化」ではなく**その人らしい成長**。

```txt
ネガティブ → ポジティブ
```

ではなく、

```txt
ネガティブなまま人を頼れる
```

のような成長を狙う。

---

# 4. 同じ時代の人たちとは限らない

## USER DIRECTION

ヨルノシルベで出会う人物は、現実世界では必ずしも同時代ではない。

- 夜では同じ姿 / 近い年齢感で会える
- 朝へ帰ればそれぞれの時代 / 人生へ戻る
- 長く夜へ関わっている人物もいる
- 夜での滞在時間と現実経過時間は一致しなくてよい
- Exact yearや全員の年代はまだLOCKしない

この設定により、人物の年代差を小物・言葉・星・切符・本・地図などで伏線化できる。

重要:

> **人は別時代でも、物は現実時間を順番に受け継がれる。**

この原理を使うと、トモリが昔修理したランタンを後世のユイが持ち、夜で二人が直接会う、というような接続を作れる。

詳細: `docs/story-temporal-layer-and-character-connections-v1.md`

---

# 5. Gameplay-first Bond

Bondは情報を見るための作業ではない。

```txt
Supportとして一緒に戦う
↓
Bondが育つ
↓
Personal / Support / Pair性能が強くなる
↓
別の組み合わせも試したくなる
```

副作用として呼び方・敬語・戦闘中台詞・リザルト・日常会・人物情報が変わる。

読む人は読む。
読まない人は「性能が上がってラッキー」でよい。

詳細: `docs/BOND.md`

---

# 6. Relationship gameplay

**仲が良い = 強い / 仲が悪い = 弱い**だけにはしない。

- 安定ペア: reliability / utility / timingが安定
- 不安定ペア: 思想差や誤解がありhigh-risk / high-upside候補
- 片寄りペア: 特定条件で強い
- 禁忌ペア: 高難度hidden build候補。強いが明確なrun内cost

数値は未LOCK。

人物成長によって、不仲が全部仲良しになる必要もない。
「嫌いだけど次の動きを信じられる」関係も成立する。

---

# 7. Star Beast

- 誕生日占いではない
- 好き / 共鳴する生物星座
- 星獣という小さなマスコット
- 原則重複なし
- 兄弟 / 親族 / 継承 / shared memory / hidden relation等の理由がある時だけ重複可

重要:

- ユイ = 獅子座
- ユイ × トモリ = 獅子座重複。真相未確定
- リツ × コヨリ = りょうけん座重複。兄妹理由

別時代設定により、星座重複理由は血縁だけでなく**同じ灯り / 技術 / 記憶 / 役目の継承**にもできる。

---

# 8. Silhouette diversity

- ぽっちゃり女性 = ハナ
- ぽっちゃり男性 = カナメ
- 渋い年長男性 = ゲン
- メガネ = シロ / レン
- 作業ゴーグル = トモリ

体型や年齢をギャグ扱いしない。

---

# 9. 黒耀化

共通システム名は **黒耀化**。

全員が固有呼称を持つ方向。

- ユイ `黒灯化` は強く継承
- 他20人はWorking Naming Board
- Human Naming Review前にfinal lockしない

黒耀化は闇落ちでも完全な別人格でもない。

> **本人の中に元からある願い / 力 / 恐怖が極端な形で現れた「もう一つの自分」。**

本人の意識・人格との連続性がある。

後で「あれは別人だった」と消すのではなく、

> 「あれも自分だった。扱い方を知らなかった。」

と受け入れて、自分で制御できる方向へ成長する。

詳細: `docs/BLACK-YOUKA.md`

---

# 10. Strong relationship directions

- **ユイ × アサ** — USER DIRECTION: 主人公級バディ。恋愛なし
- **リツ × コヨリ** — CANON: 兄妹。互いに互いを救う。恋愛なし
- **ユイ × クロオリ** — 取り戻す vs 閉じて守る、思想的ライバル
- **ユイ × トモリ** — 同じ獅子座。親族 / 火の系譜 / ランタン継承 / shared memory / 別時代の同じ灯り等を候補として保持

Core5 × Shadow5の鏡候補:

| Core | Shadow | 問い |
| --- | --- | --- |
| ユイ | クロオリ | 戻す / 閉じる |
| アサ | カスミ | 名前を返す / ぼかして守る |
| ナギ | カナメ | 閉じて守る / 前に立って守る |
| ミチル | トキ | 歩いて選ぶ / 測って正解を求める |
| トモリ | ツムギ | 直して継ぐ / 余白を残す |

詳細: `docs/character-connection-web-high-value-candidates-v1.md`

---

# 11. Future high-priority characters

Current 21へまだ自動追加しない。

- **ヒヨリ** — ギャルマインド / 明るい肯定
- **セリカ** — お嬢様 / 礼儀 / 責任感
- **不老の魔女候補（旧working: クロエ）** — 長い時間・恋愛・家族・弟子・別れを何度も経験した人物
- **弟子候補（旧working: レンジ）** — 魔女の長い人物史の一人になり得るが、現在関係は未LOCK

### 不老の魔女についてのCurrent Candidate理解

長い人生の中で、複数の弟子と異なる関係を経験している。

- 純粋な師弟
- 家族同然
- 親友
- 恋人
- 結婚
- 子ども
- 別離
- 再会

などが混在してよい。

**「弟子との恋愛なし」という旧Candidateは撤回。**

全弟子が恋人なのではなく、何百年もの人物史の中で恋愛も当然経験していることが深みになる。

夜では弟子が老いないため、魔女には「別れを少し先延ばしにできる場所」に見える。
黒耀化ではその願いが「誰も朝へ帰さなければ誰も老いない」へ歪む候補。

詳細: `docs/character-long-lived-witch-arc-v1.md`

---

# 12. Current 21 Connection philosophy

全員を全員の親族 / 昔からの知人にしない。

関係は以下を混ぜる。

1. 兄妹 / 親族 / 師弟 / 恋愛などの直接関係
2. 小物や記録の継承
3. 思想の鏡
4. **ヨルノシルベで初めて会い、ここで仲間になる関係**

4を必ず残す。

過去設定だけで仲間にせず、プレイヤーが実際に一緒に戦い日常を見た時間そのものを関係の根拠にする。

---

# 13. Legacy no-read policy

通常は:

```txt
docs/CANON.md
↓
docs/CHARACTERS.md
↓
Current 21なら character-book-v3.md
Future魔女なら character-long-lived-witch-arc-v1.md
↓
必要なCurrent master 1つ
```

移行済みlegacy一覧:

- `docs/legacy-design-migration-2026-07-28.md`

禁止:

- 毎回repo全体から設定を再発掘する
- migrated legacyをcurrent回答の根拠に戻す
- Current 21とfuture candidateを混ぜる
- `カゲール1`〜`4`を人名として復活
- 誕生日由来の旧zodiacを星獣へ戻す
- 既存設計を確認せず同じ役割の新キャラを増やす
- supersededされた「不老の魔女 × 弟子は恋愛なし」を復活させる
