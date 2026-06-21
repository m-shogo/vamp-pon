# Loading Quotes / Parody Handoff

Vamp Pon / ヴァンサバ改のロード画面・名言・キャラ返信・パロディ方針について、今回の会話で決まったことを次チャットへ引き継ぐための正本メモ。

---

## 1. この資料の目的

```txt
今までのやりとりを覚えておく。
次のチャットで、また同じ議論をやり直さない。
ロード名言・英語ことわざ・キャラ返信・パロディの方向を固定する。
```

対象repo:

```txt
m-shogo/vamp-pon
/Users/m-shogo/Developer/personal/vamp-pon
```

このrepo以外は触らない。

---

## 2. ユーザーの強い希望

```txt
本当の名言も欲しい。
本や物語、漫画、映画、アニメから新しい知識の供給が欲しい。
日本語だけでなく英語も入れたい。
海外受けも考えたい。
英語ことわざ、慣用句、短いフレーズのユニークさが好き。
パロディが好き。
スターウォーズの “I love you / I know” みたいな短い掛け合いが好き。
ただしキモすぎないようにしたい。
キャラ設定に合った返信反応にしたい。
名言は商用可能な範囲から選びたい。
```

重要:

```txt
名言は正解ではない。
捉え方はキャラごとに違う。
プレイヤーもまた違う読み方をしてよい。
```

---

## 3. ロード画面の基本方針

ロード画面は、ただの待ち時間にしない。

```txt
本物の言葉に触れる。
意味が少し分かる。
キャラがたまに返信する。
でも押し付けない。
```

ロード画面の役割:

```txt
引用 = 知識供給
日本語意訳 = 意味への入口
キャラ返信 = その子の価値観
プレイヤー = 自分の受け取り方を持ってよい
```

---

## 4. 表示構造

### A. Quote only

```txt
We grow accustomed to the Dark.

— Emily Dickinson
```

### B. Quote + Japanese rendering

```txt
We grow accustomed to the Dark.

— Emily Dickinson

暗闇にも、人は慣れてしまう。
```

### C. Quote + rendering + character reply

```txt
We grow accustomed to the Dark.

— Emily Dickinson

暗闇にも、人は慣れてしまう。

慣れたくなんか、なかったけど。
— アサ / Asa
```

### D. English idiom/proverb + reply

```txt
Piece of cake.

— English idiom

かんたん、ということにしておく。

If it's cake, why does it have teeth?
— アサ / Asa
```

---

## 5. 読ませる時間

ロードが完了しても、読了時間を優先する。

```txt
Quote only: minimum 3.2秒
Quote + 日本語意訳: minimum 4.6秒
Quote + 意訳 + キャラ返信: minimum 6.2秒
長い引用 + 返信: 6.0〜7.5秒
初見引用: 2.4秒までスキップ不可
既読引用: 1.2秒後スキップ可
```

理由:

```txt
引用本文、作者/出典、日本語意訳、キャラ返信を読むには時間が必要。
おしゃれに出しても、読めなければ意味がない。
```

---

## 6. 名言・ことわざの商用安全ライン

### 使ってよい候補

```txt
公有領域候補の古典原文
著作者没後十分経過した詩・文学の短い原文
一般的な英語ことわざ
一般的な英語慣用句
一般的な挨拶・日常表現
Vamp Ponオリジナル文
```

### 使わない候補

```txt
現代漫画の台詞
現代映画の台詞
現代小説の本文
歌詞
有名ゲーム台詞
既存の日本語翻訳文
出版社訳
字幕訳
SNSで流行った現代コピー
```

### 日本語について

```txt
既存訳は使わない。
日本語は Vamp Pon 用の自前意訳として作る。
UIでは「翻訳」ではなく「意味」または「Vamp Pon用意訳」として扱う。
最終商用前に quote / source / rendering をまとめて確認する。
```

---

## 7. すでに決めた代表Quote

### Emily Dickinson

```txt
We grow accustomed to the Dark.
```

Vamp Pon用意訳:

```txt
暗闇にも、人は慣れてしまう。
```

返信例:

```txt
慣れてしまう前に、灯したい。
— ユイ / Yui
```

```txt
慣れたくなんか、なかったけど。
— アサ / Asa
```

```txt
暗いほうが、羽の重さは見えない。
— クロエ / Chloe
```

---

### Virgil / Aeneid

```txt
Sunt lacrimae rerum.
```

Vamp Pon用意訳:

```txt
ものにも、涙のようなものがある。
```

返信例:

```txt
忘れ物にも、泣き方があるんだね。
— ユイ / Yui
```

```txt
泣けないものほど、重いんだ。
— ミチル / Michiru
```

```txt
届かなかった荷物も、泣いていたのかもしれない。
— セナ / Sena
```

---

### Dante / Inferno

```txt
E quindi uscimmo a riveder le stelle.
```

Vamp Pon用意訳:

```txt
そして私たちは出て、もう一度星を見た。
```

返信例:

```txt
帰り道の上に、星があればいい。
— ユイ / Yui
```

```txt
もう一度、星を見に行こう。
— ナギ / Nagi
```

```txt
外に出ても、羽が軽くなるとは限らない。
— クロエ / Chloe
```

---

### Shakespeare

```txt
What's in a name?
```

Vamp Pon用意訳:

```txt
名前の中には、何があるのだろう。
```

返信例:

```txt
私には、まだ入りきらない。
— シノ / Shino
```

```txt
白紙より先に、名前がほしい。
— ハク / Haku
```

```txt
呼ぶための音が、まだ出ない。
— スズ / Suzu
```

---

### 枕草子

```txt
春はあけぼの。
```

Vamp Pon用意訳:

```txt
春は、夜明けのころがいい。
```

返信例:

```txt
まだ寒くても、芽は知ってる。
— コハル / Koharu
```

```txt
朝は、縫い目から先に明るくなる。
— ヒナタ / Hinata
```

```txt
眠らなくても、朝は来るんだ。
— ネム / Nemu
```

---

## 8. 英語ことわざ・慣用句の方向

古典名言だけだと重い。
海外受けとユーモアのため、一般的な英語ことわざ・慣用句を混ぜる。

### Piece of cake.

```txt
Piece of cake.
— English idiom

かんたん、ということにしておく。
```

返信:

```txt
If it's cake, why does it have teeth?
— アサ / Asa
```

```txt
ケーキなら、どうして歯があるの。
— アサ
```

---

### Bless you.

```txt
Bless you.
— Common expression

小さな声で、無事を祈る言葉。
```

返信:

```txt
Can I say it to a lost item too?
— ユイ / Yui
```

```txt
忘れ物にも、言っていいのかな。
— ユイ
```

---

### Break a leg.

```txt
Break a leg.
— English idiom

うまくいきますように、を少し変に言う言葉。
```

返信:

```txt
Please don't. I need both legs to dance badly.
— ユラ / Yura
```

```txt
やめて。下手に踊るにも両足いる。
— ユラ
```

---

### Still waters run deep.

```txt
Still waters run deep.
— English proverb

静かな水ほど、深いことがある。
```

返信:

```txt
Quiet water keeps the heaviest things.
— ミチル / Michiru
```

```txt
静かな水ほど、重いものを持ってる。
— ミチル
```

---

## 9. パロディ方針

ユーザーはパロディが好き。
ただし、薄い改変や寒いパロは嫌。

重要:

```txt
作品名や台詞をぼかして使うのではなく、ジャンルの感情をVamp Ponの言葉に変換する。
```

### 直接使わない

```txt
I love you.
I know.
```

このセットは有名すぎるので、そのままは使わない。

### 使う構造

```txt
まっすぐな感情
↓
照れ隠し・確信・軽口で返す
↓
短いのに関係性が見える
```

---

## 10. 「I love you / I know」系のVamp Pon変換

### アサ

```txt
You are burning again.

Then I am still here.
— アサ / Asa
```

```txt
また焦げてるよ。

じゃあ、まだここにいる。
— アサ
```

### クロエ

```txt
Come back.

Give me a road first.
— クロエ / Chloe
```

```txt
帰ってきて。

先に道をちょうだい。
— クロエ
```

### シノ

```txt
If I call your name, will you come back?

Call twice. I am far today.
— シノ / Shino
```

```txt
名前を呼んだら、戻ってくる？

今日は遠いから、二回呼んで。
— シノ
```

### セナ

```txt
You do not have to carry it alone.

I know. I am just bad at putting it down.
— セナ / Sena
```

```txt
ひとりで持たなくていいよ。

分かってる。置くのが下手なだけ。
— セナ
```

---

## 11. 月に代わって問題

「月に代わって〜」は世界観に合う。
ただし、有名構文として見える形は避ける。

### 避ける

```txt
月に代わって、忘れ物をほどく。
星に代わって、夜を照らす。
灯りに代わって、おしおき。
```

### 使える方向

```txt
月がいない夜は、私が少しだけ代わる。
— ユイ
```

```txt
月のかわりなんて、荷が重いよ。
— ハク
```

```txt
月が見てないなら、星に聞こう。
— ナギ
```

```txt
月のかわりに鳴るには、少し静かすぎる。
— スズ
```

ポイント:

```txt
「月に代わって」という決め台詞構文を避ける。
月の不在・代理・荷の重さとしてVamp Pon化する。
```

---

## 12. パロの表示比率

パロは多めに持っておく。
ただし、出しすぎると寒くなる。

```txt
Serious literary quote: 40%
English proverb / idiom: 25%
Vamp Pon original line: 20%
Parody dialogue reply: 15%
```

---

## 13. きもすぎない制限

```txt
元ネタを説明しない。
パロディを連発しない。
シリアス直後に寒い軽口を入れすぎない。
キャラをバカにしない。
返信は1〜2行まで。
英語返信は短く、映画の掛け合い程度にする。
日本語返信は翻訳調にしすぎない。
```

---

## 14. 次にユーザーから聞くべきこと

ユーザーは「もっと好きな作品を言いたい」と言っている。
次は、好きな作品をリスト化してもらう。

聞き方:

```txt
作品名だけでもいい。
できれば、好きなキャラ・好きな掛け合い・好きな理由・Vamp Ponに欲しい感じも聞く。
```

テンプレ:

```txt
作品名:
好きなキャラ:
好きな掛け合い:
好きな理由:
Vamp Ponに欲しい感じ:
```

特に欲しいもの:

```txt
映画の短い掛け合い
漫画の巻頭ポエムっぽい余白
アニメの変身/覚醒前のためらい
仲間が迎えに来るシーン
皮肉っぽい英語の返し
子ども向けなのに大人が刺さる言葉
暗いけど救いがある作品
```

---

## 15. 次の作業候補

### 1. 好きな作品ヒアリング

ユーザーから好きな作品を受け取り、以下に分類する。

```txt
作品名
好きな関係性
好きな掛け合い構造
Vamp Pon変換案
商用危険度
使えるキャラ
```

### 2. データ化

```txt
src/data/loadingPhrases.ts
src/data/loadingPhraseReplies.ts
src/data/morningCharacterPoems.ts
```

に落とせる形へ変換する。

### 3. 実装

```txt
ロード画面に原文/意訳/返信を表示。
表示時間制御。
重複防止。
選択キャラに応じた返信。
英日表示切替。
```

---

## 16. 最終まとめ

このロード演出の正本はこれ。

```txt
本物の名言を読む。
意味も少し分かる。
たまにキャラが返信する。
返信はキャラ設定に沿っていて、少しユーモアがある。
名言は正解ではなく、キャラごとに違う読み方をしてよい。
パロディは好きに活かすが、台詞そのものではなく構造と気持ちよさをVamp Pon化する。
```

