# ヨルノシルベ Character Hub

Date: 2026-07-28  
Status: **CURRENT CHARACTER ENTRYPOINT**

> キャラクターに関する質問・設計・画像brief・会話・好感度・関係性を扱う時は、まずこの1ファイルを読む。  
> repo全体から毎回キャラ設定を探し直さない。

---

# 1. 最初に読むもの

## 人物理解

- `docs/character-book-v2.md`
  - 21人一覧
  - 一言説明
  - 星獣
  - 外見記号
  - 成長方向
  - メイン関係
  - 謎 / 伏線
  - future candidate

## 戦闘と好感度

- `docs/character-bond-support-system-v1.md`
  - 仲間を戦闘へ呼ぶ
  - Bond / 好感度
  - 呼び方 / 敬語変化
  - キャラ固有Support
  - Pair Trait
  - 灯合わせ

この2冊で通常のキャラ質問の大半を答える。

---

# 2. 詳細が必要な時だけ読む正本

| 知りたいこと | 正本 |
| --- | --- |
| 20人の戦闘・関係・art名 | `src/game/data/characterCanon.ts` |
| 20人+レンの日常profile | `docs/character-personal-profile-canon-v1.md` |
| 星座 / 星獣 / 由来 | `docs/character-star-beast-constellation-canon-v1.md` |
| 体型 / 年齢感 / 眼鏡 / silhouette | `docs/character-silhouette-diversity-current-canon-v1.md` |
| Core5灯合わせ | `src/game/data/pairLightArts.ts` |
| 黒耀化 | `src/game/data/kokuyouForms.ts` |
| 日常会 | `docs/design/daily-life/daily-life-intermission-bible.md` |
| 呼び方 / 口調 / 好感度変化 | `docs/design/characters/relationship-speech-evolution.md` |
| 会話 / 相関 / お嬢様候補 | `docs/design/characters/dialogue-relationship-bible-and-ojousama.md` |
| ED / キャライベント / ペア相性 | `docs/design/characters/character-event-ending-affinity-bible.md` |

---

# 3. Current roster

## Core 5

ユイ / アサ / ナギ / ミチル / トモリ

## Circle 10

セン / リツ / コヨリ / ゲン / ハナ / ユウビ / マドカ / シロ / トバリ / ネム

## Shadow / Rival 5

クロオリ / カナメ / カスミ / トキ / ツムギ

Stable runtime IDs:

```txt
kuroori
kage1 = カナメ
kage2 = カスミ
kage3 = トキ
kage4 = ツムギ
```

## Official Reserve

レン

Current character scope: **20 + reserve 1 = 21人**

---

# 4. 今回追加された重要方向

## Character tone

- 世界は暗い
- 人物の明暗は揃えない
- ネガティブな人もいる
- 明るい人もいる
- ギャルもいる
- 無口もいる
- 暗いキャラを無理に明るくしない
- ただし全員それぞれに成長がある

成長は性格変更ではない。

例:

```txt
ネガティブ → ポジティブ
```

ではなく、

```txt
ネガティブなまま一人で抱え込まなくなる
```

のように、その人らしさを残す。

## Bond / Support

```txt
一緒に戦う
↓
Bondが上がる
↓
日常会 / 戦闘後会話が変わる
↓
呼び方 / 敬語 / 弱音 / 冗談がキャラ別に変化
↓
Pair Trait / Assist / 灯合わせが育つ
```

Bondは恋愛値ではない。

兄妹・師弟・親族・友情・ライバル・恋愛で共通して使える関係経験値。

## Star Beast

- 誕生日占いではない
- 好き / 共鳴する生物星座
- 星獣という小さなマスコットになる
- 原則重複なし
- 兄弟 / 親族 / 継承 / hidden relationなど理由がある時だけ重複可
- ユイ = 獅子座
- ユイ × トモリの獅子座重複は伏線
- リツ × コヨリのりょうけん座重複は兄妹理由

## Silhouette diversity

- ぽっちゃり女性 = ハナ
- ぽっちゃり男性 = カナメ
- 渋い年長男性 = ゲン
- メガネ = シロ / レン
- 作業ゴーグル = トモリ

---

# 5. Strong relationship directions

## ユイ × アサ

USER DIRECTION: 主人公級バディ。恋愛なし。

## リツ × コヨリ

CANON: 兄妹。互いに互いを救う。

## ユイ × クロオリ

取り戻す vs 閉じて守る。思想的ライバル。

## ユイ × トモリ

同じ獅子座。関係の正体は未確定。親族 / 火の系譜 / 継承 / 記憶火などを候補として保持。

## 年を取らない魔女 × 年を取る弟子

USER DIRECTION / CANDIDATE:

- クロエ = 年を取らない魔女候補
- レンジ = 年を取る弟子候補
- 師弟
- 恋愛なし
- 時間の進み方が違っても関係が続くエモさ

---

# 6. Future candidate directions

まだCurrent 21へ自動追加しない。

- ヒヨリ: ギャルマインド / 明るい肯定
- セリカ: お嬢様 / 礼儀 / 責任感
- クロエ: 年を取らない魔女
- レンジ: 年を取る弟子 / 渋い大人

候補資料に既存設計がある場合、**新しく0から作る前に必ず既存候補を読む。**

---

# 7. AI / Agent運用ルール

キャラ質問が来た時:

```txt
1. docs/CHARACTERS.md を読む
2. docs/character-book-v2.md を読む
3. 詳細が必要な項目だけ表の正本へ降りる
4. repo-wide searchは最後の手段
```

禁止:

- 毎回repo全体から設定を再発掘する
- 古い候補をcurrent canonとして回答する
- Current 21とfuture candidateを混ぜる
- `カゲール1`〜`4`を人名として復活させる
- 誕生日由来の旧zodiacを星獣設定として復活させる
- 既存設計を確認せず同じ役割の新キャラを増やす

---

# 8. 情報を追加した時の更新先

新しいキャラ情報を決めたら、散らばったdocだけ更新して終わらせない。

最低限:

```txt
A. 詳細正本
B. character-book-v2.md の人物カード / 関係性
C. 必要なら docs/CHARACTERS.md の概要
```

の順で同期する。

これにより、次回は詳細ファイル名を覚えていなくてもCharacter Hubから到達できる。

---

# 9. このHubが解決する問題

Before:

```txt
質問
→ repo検索
→ 昔の候補を発見
→ currentか判断
→ 別資料を発見
→ ようやく回答
```

After:

```txt
質問
→ CHARACTERS.md
→ character-book-v2.md
→ 必要なら1つだけ詳細正本
→ 回答
```

**過去に積み上げた設計を「覚えていないように見える状態」に戻さないための入口。**
