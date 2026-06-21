# Loading Quotes Character Fit Spec

ロード画面の引用に添えるキャラ反応を、キャラ設定とずらさないための正本。

目的:

```txt
引用は残す。
ちゃんと読ませる。
キャラ反応はたまに出す。
ただし、キャラ設定に合う引用にしか反応させない。
```

---

## 1. 結論

キャラ反応は、ただの感想ではない。

```txt
引用を読んだ時、そのキャラの弱さ・持ち物・灯名・黒耀・朝明が少しだけ漏れる文。
```

そのため、全キャラに何でも反応させない。

悪い例:

```txt
We grow accustomed to the Dark.
— Emily Dickinson

暗いね。
— ユイ
```

これは浅い。

良い例:

```txt
We grow accustomed to the Dark.
— Emily Dickinson

慣れてしまう前に、灯したい。
— ユイ
```

ユイは「帰灯の少女」で、誰かの帰り道を照らしてしまうキャラだから成立する。

---

## 2. キャラ反応の表示頻度

```txt
引用だけ: 70〜75%
引用 + キャラ反応: 25〜30%
```

キャラ反応は強いので、毎回出さない。
出た時に「その子らしい」と思わせる。

---

## 3. キャラ反応の判定ルール

Quoteには tags を持たせる。
Characterにも reactionTags を持たせる。

```ts
quote.tags ∩ character.reactionTags が2個以上ある時だけ反応候補に入れる。
```

さらに、キャラごとの禁止タグを持たせる。

```ts
quote.tags に character.avoidTags が含まれる場合、原則反応させない。
```

例:

```txt
クロエ: feather / lonely / return / black に反応しやすい
コハル: spring / morning / growth に反応しやすい
ミチル: water / memory / unable-to-let-go に反応しやすい
```

---

## 4. 20人の反応タグ

| キャラ | 反応させるタグ | 反応させすぎないタグ | 反応の芯 |
|---|---|---|---|
| ユイ | light / road / return / lost-item / name | pure-power / glory | 帰れない誰かを照らす。自分の帰りは後回し。 |
| アサ | fire / morning / unable-to-stop / pain / black | calm-only | 止まれない。あたたかさと焦げ跡が同居。 |
| ナギ | star / map / road / guide / lost | brute-force | 正しい道ではなく、帰れる道を探す。 |
| ミチル | water / memory / river / tear / cannot-let-go | dry / triumph | 流したいものほど残る。涙と言い切らない。 |
| トモリ | repair / crack / tool / light / hand | destruction | 直せないものも直そうとする。ひびを捨てない。 |
| シノ | name / called / silence / missing / return | fame / honor | 名前が自分より先に迷子。呼ばれることで戻る。 |
| シオン | book / blank / record / line / silence | loud-emotion | 書けなかった一行。空白は隠れ家。 |
| クロエ | feather / lonely / black / return / distance | cheerful-spring | 飛べるが軽くない。孤独と羽の重さ。 |
| コハル | spring / bud / morning / cold / growth | despair-only | 春を知らない芽。寒くても伸びる。 |
| レン | star / inherit / hand / not-mine / carry | selfish-power | 継いだ星がまだ自分の形にならない。 |
| マヨイ | road / lost / wrong-way / found / lantern | certainty | 迷ったから見つけた灯り。正しい道だけを信じない。 |
| イオリ | needle / direction / north / tremble / truth | vague-only | 針は震えても北を指す。正しさが痛い。 |
| ハク | blank / empty / self / night / first | full-memory | 何もないから失くせないと思っていた。 |
| スズ | bell / sound / silence / call / name | noise | 鳴らない鈴。呼びたい名前の代わり。 |
| リツ | sound / memory / voice / silence / collect | visual-only | 聞こえない声を拾う。音が記憶に残る。 |
| ヒナタ | morning / stitch / torn / light / repair | darkness-only | 破れた朝を縫う。待つより縫う。 |
| カナメ | ring / protect / boundary / together / outside | abandonment | 守る輪が出口を塞ぐことを知っている。 |
| セナ | delivery / star / baggage / destination / sleep | stay-only | 届かない荷物が肩に残る。眠る前に届けたい。 |
| ユラ | tremble / dance / light / presence / weak | fixed / unmoving | 強く光れないから揺れて合図する。 |
| ネム | dream / sleep / awake / morning / child | harsh-reality-only | 眠れない夜にも夢は残る。 |

---

## 5. 引用ごとの適性キャラ

### We grow accustomed to the Dark.

主適性:

```txt
アサ / ユイ / ハク / クロエ / ネム
```

反応例:

```txt
慣れたくなんか、なかったけど。
— アサ
```

```txt
慣れてしまう前に、灯したい。
— ユイ
```

```txt
夜に慣れたら、朝が怖くなるのかな。
— ハク
```

```txt
暗いほうが、羽の重さは見えない。
— クロエ
```

```txt
眠れない夜は、暗さにだけ先に慣れる。
— ネム
```

使わない方がいい:

```txt
コハル: 春/芽吹きの子なので、暗さ慣れだけだと沈みすぎる。
リツ: 音や記憶に寄せた引用の方が合う。
```

---

### Sunt lacrimae rerum.

主適性:

```txt
ユイ / ミチル / トモリ / シノ / セナ
```

反応例:

```txt
忘れ物にも、泣き方があるんだね。
— ユイ
```

```txt
泣けないものほど、重いんだ。
— ミチル
```

```txt
直せないひびにも、残るものはある。
— トモリ
```

```txt
物が泣くなら、名前も迷子になるのかな。
— シノ
```

```txt
届かなかった荷物も、泣いていたのかもしれない。
— セナ
```

---

### E quindi uscimmo a riveder le stelle.

主適性:

```txt
ナギ / レン / ユイ / ネム / セナ
```

反応例:

```txt
もう一度、星を見に行こう。
— ナギ
```

```txt
出られたあとで見る星は、きっと違う。
— レン
```

```txt
帰り道の上に、星があればいい。
— ユイ
```

```txt
朝じゃなくても、星なら見えるんだね。
— ネム
```

```txt
届け先が星なら、迷わない気がする。
— セナ
```

---

### Music, when soft voices die, vibrates in the memory.

主適性:

```txt
リツ / スズ / シオン / シノ / ネム
```

反応例:

```txt
消えた声ほど、よく響くんだ。
— リツ
```

```txt
鳴らない鈴も、どこかで響いてるかな。
— スズ
```

```txt
記録できない音が、一番残ることもある。
— シオン
```

```txt
呼ばれなかった名前も、まだ響いてる？
— シノ
```

```txt
夢の中の声って、起きても少し残る。
— ネム
```

---

### What's in a name?

主適性:

```txt
シノ / ハク / ユイ / シオン / スズ
```

反応例:

```txt
私には、まだ入りきらない。
— シノ
```

```txt
呼ばれたら、戻れる気がする。
— シノ
```

```txt
白紙より先に、名前がほしい。
— ハク
```

```txt
名前って、誰かに持ってもらうものなのかな。
— ユイ
```

```txt
書けない名前ほど、ページを閉じさせない。
— シオン
```

---

### The rest is silence.

主適性:

```txt
スズ / リツ / シオン / クロエ / ハク
```

反応例:

```txt
鳴らないままでも、持っていていい？
— スズ
```

```txt
沈黙にも、まだ音がある。
— リツ
```

```txt
書けないところから、記録は始まる。
— シオン
```

```txt
静かな夜ほど、羽の音が重い。
— クロエ
```

```txt
何もない音が、一番こわい。
— ハク
```

---

### 春はあけぼの。

主適性:

```txt
コハル / ヒナタ / アサ / ユイ / レン
```

反応例:

```txt
まだ寒くても、芽は知ってる。
— コハル
```

```txt
朝は、縫い目から先に明るくなる。
— ヒナタ
```

```txt
明るいところから始まる朝ばかりじゃない。
— アサ
```

```txt
春って、忘れ物にも来るのかな。
— ユイ
```

```txt
継いだ星にも、朝は来るのかな。
— レン
```

---

### 行く川のながれは絶えずして、しかももとの水にあらず。

主適性:

```txt
ミチル / マヨイ / トモリ / シオン / イオリ
```

反応例:

```txt
流したかったものだけ、残るんだね。
— ミチル
```

```txt
同じ道でも、昨日の足跡じゃない。
— マヨイ
```

```txt
変わることを、直すとは呼ばないのかも。
— トモリ
```

```txt
記録は残る。でも、同じ水ではない。
— シオン
```

```txt
流れても、方角は変わらないのかな。
— イオリ
```

---

### Hope is the thing with feathers.

主適性:

```txt
クロエ / コハル / セナ / ユラ / ネム
```

反応例:

```txt
飛べることと、軽いことは違う。
— クロエ
```

```txt
重くても、羽は羽なんだ。
— クロエ
```

```txt
希望って、落としても拾えるのかな。
— セナ
```

```txt
震える羽でも、合図になるかな。
— ユラ
```

```txt
夢にも、羽があったらいい。
— ネム
```

---

### To see a World in a Grain of Sand.

主適性:

```txt
ユイ / ハク / シオン / トモリ / カナメ
```

反応例:

```txt
小さいものに、全部入ってるんだ。
— ユイ
```

```txt
白紙のすみっこにも、世界はある？
— ハク
```

```txt
一行だけでも、世界は閉じられる。
— シオン
```

```txt
小さなひびから、全部見えることがある。
— トモリ
```

```txt
輪の内側だけが、世界じゃない。
— カナメ
```

---

## 6. 朝明ポエムは別枠

ロード中の反応文と、朝明ポエムは別物。

```txt
ロード反応: 引用に対する一瞬の返事。
朝明ポエム: そのキャラの心臓。
```

朝明ポエムは、夜を越えた後にだけ出す。

例:

```txt
帰れない人がいるから、
私はまだ帰れない。

— ユイ
```

```txt
あたたかいふりをして、
私はまだ焦げている。

— アサ
```

```txt
私の名前は、
私より先に迷子になった。

— シノ
```

---

## 7. 実装指示

### データ構造

```ts
export type CharacterReactionProfile = {
  characterId: string;
  reactionTags: string[];
  avoidTags: string[];
};

export type LoadingQuoteReaction = {
  quoteId: string;
  characterId: string;
  text: string;
  weight: number;
};
```

### 選定ロジック

```txt
1. quoteを選ぶ。
2. 選択キャラのreactionTagsとquote.tagsを比較。
3. 一致が2個未満なら反応を出さない。
4. avoidTagsが含まれる場合も出さない。
5. 対応reactionがある場合だけ、25〜30%で表示する。
6. reactionが付く場合は表示時間を最低4.6秒に伸ばす。
```

---

## 8. 最終方針

```txt
キャラ設定に合わない反応は出さない。
キャラ反応は、引用の翻訳ではない。
引用を読んだ時に、そのキャラの傷が少し漏れる文にする。
キャラポエムは、朝が来た時にだけしっかり読ませる。
```
