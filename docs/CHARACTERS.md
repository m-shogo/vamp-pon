# ヨルノシルベ Character Hub

Date: 2026-07-28  
Status: **CURRENT CHARACTER ENTRYPOINT**

> キャラクターに関する質問・設計・画像brief・会話・好感度・関係性を扱う時は、まずこの1ファイルを読む。  
> repo全体から毎回キャラ設定を探し直さない。移行済みlegacyは通常読まない。

---

# 1. 最初に読むCurrent master

| 知りたいこと | Current master |
| --- | --- |
| 21人をすぐ理解する | `docs/character-book-v2.md` |
| 日常 / 癖 / 怒り / 嘘 / 口調 / 呼び方 | `docs/CHARACTER-LIFE-AND-SPEECH.md` |
| 仲間同行 / Bond / 戦闘連携 / 不安定ペア | `docs/BOND.md` |
| 黒耀化 / 21人の固有呼称 / 歪み | `docs/BLACK-YOUKA.md` |
| 誕生日 / 好物 / 趣味 | `docs/character-personal-profile-canon-v1.md` |
| 星座 / 星獣 / 由来 | `docs/character-star-beast-constellation-canon-v1.md` |
| 体型 / 年齢感 / 眼鏡 | `docs/character-silhouette-diversity-current-canon-v1.md` |
| production combat / art data | `src/game/data/characterCanon.ts` / `docs/180-unified-character-canon.md` |
| Core5灯合わせ | `src/game/data/pairLightArts.ts` |

通常の人物質問は `character-book-v2.md` までで答え、必要な時だけ1つdetail masterへ降りる。

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

- 明るい
- ネガティブ
- 無口
- 強気
- 怖がり
- ギャル
- お嬢様
- 子ども
- ぽっちゃり
- 渋い大人

などが同居してよい。

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

# 4. Gameplay-first Bond

好感度 / Bondは情報を見るための作業ではない。

```txt
Supportとして一緒に戦う
↓
Bondが育つ
↓
Personal / Support / Pair性能が強くなる
↓
別の組み合わせも試したくなる
```

副作用として:

- 呼び方
- 敬語
- 戦闘中台詞
- リザルト
- 日常会
- 人物情報

が変わる。

読む人は読む。
読まない人は「性能が上がってラッキー」でよい。

詳細: `docs/BOND.md`

---

# 5. Relationship gameplay

**仲が良い = 強い / 仲が悪い = 弱い**だけにはしない。

- 安定ペア: 可靠性 / utility / timingが安定
- 不安定ペア: 思想差や誤解があり、high-risk / high-upside候補
- 片寄りペア: 特定条件で強い
- 禁忌ペア: 高難度hidden build候補。強いが明確なrun内cost

数値は未LOCK。

人物成長によって、不仲が全部仲良しになる必要もない。
「嫌いだけど次の動きを信じられる」関係も成立する。

---

# 6. Star Beast

- 誕生日占いではない
- 好き / 共鳴する生物星座
- 星獣という小さなマスコット
- 原則重複なし
- 兄弟 / 親族 / 継承 / shared memory / hidden relation等の理由がある時だけ重複可

重要:

- ユイ = 獅子座
- ユイ × トモリ = 獅子座重複。関係の正体は未確定
- リツ × コヨリ = りょうけん座重複。兄妹理由

---

# 7. Silhouette diversity

Current:

- ぽっちゃり女性 = ハナ
- ぽっちゃり男性 = カナメ
- 渋い年長男性 = ゲン
- メガネ = シロ / レン
- 作業ゴーグル = トモリ

体型や年齢をギャグ扱いしない。

---

# 8. 黒耀化

共通システム名は **黒耀化**。

さらに21人それぞれに**キャラ固有呼称**がある。

例:

- ユイ — 黒灯化
- アサ — 黒銘化
- ナギ — 黒箱化
- ミチル — 黒針化
- トモリ — 黒継化

全21人: `docs/BLACK-YOUKA.md`

黒耀化は闇落ちではなく、本人の長所 / 願い / 守り方の過剰化。
星獣もその危うさへ反応する。

---

# 9. Strong relationship directions

## ユイ × アサ

**USER DIRECTION: 主人公級バディ。恋愛なし。**

片方が付属品にならない。思想差や喧嘩もあるが、違いを残したまま背中を預けられる関係へ成長する。

## リツ × コヨリ

**CANON: 兄妹。恋愛なし。**

兄だけが妹を救うのではなく、互いに互いを救う。

## ユイ × クロオリ

「取り戻す」vs「閉じて守る」の思想的ライバル。

## ユイ × トモリ

同じ獅子座。

候補:

- 親族
- 遠い血縁
- 火の系譜
- 継承
- shared memory fire

真相は未LOCK。

## 年を取らない魔女 × 年を取る弟子

Future high-priority candidate:

- クロエ = 年を取らない魔女候補
- レンジ = 年を取る弟子候補
- 師弟
- 恋愛なし

---

# 10. Future candidate directions

Current 21へまだ自動追加しない。

- **ヒヨリ** — ギャルマインド / 人を肯定する明るさ
- **セリカ** — お嬢様 / 礼儀 / 責任感。語尾だけで作らない
- **クロエ** — 年を取らない魔女
- **レンジ** — 年を取る弟子 / 大人

既存候補をCurrentへ昇格する時は、旧候補資料を直接読むのではなく、`character-book-v2.md` に保存された方向から再開する。

---

# 11. Legacy no-read policy

日常・口調・Bond・黒耀化などの旧資料から有効要素はCurrent masterへ移植済み。

通常は以下の順だけで読む:

```txt
docs/CANON.md
↓
docs/CHARACTERS.md
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
