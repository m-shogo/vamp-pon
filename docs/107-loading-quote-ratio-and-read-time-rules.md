# Loading Quote Ratio and Read Time Rules

`docs/106-loading-quote-presentation-system.md` の補足・修正版。

ユーザー方針:

```txt
引用も必要。
ちゃんと読ませる時間を取る。
人物の言葉もたまに入れる。
```

この資料では、ロード画面の比率・読了時間・人物/キャラ文の頻度を固定する。

---

## 1. 結論

ロード画面の主役は、引用でよい。

ただし、名言アプリそのものにはしない。
Vamp Ponの夜に合う引用を選び、たまにキャラ自身の言葉が混ざることで、世界観と人物の両方を立てる。

```txt
引用 = 知識供給・世界の奥行き
Vamp Pon文 = 作品固有の余韻
人物/キャラ文 = たまに刺すアクセント
```

---

## 2. 表示比率

### 通常ロード

```txt
Quote / 原文引用: 60%
Vamp Line / Vamp Pon文: 30%
Character Line / 人物・キャラ文: 10%
```

理由:

```txt
引用をちゃんと見せたい。
ただし毎回引用だと名言アプリに寄りすぎる。
キャラ文は連発すると重いので、たまにでよい。
```

### 初回ロード

```txt
Quote: 35%
Vamp Line: 55%
Character Line: 10%
```

理由:

```txt
初回は世界観の説明が必要。
最初から英語/ラテン語ばかりだと置いていかれる。
```

### キャラ選択後ロード

```txt
Quote: 45%
Vamp Line: 25%
Character Line: 30%
```

理由:

```txt
キャラ選択後は、そのキャラの言葉を少し強くしてよい。
ただし毎回キャラポエムだと重い。
```

### ステージ開始

```txt
Quote: 50%
Vamp Line: 40%
Character Line: 10%
```

理由:

```txt
ステージ開始は、名言よりもステージの空気が大事。
```

### 敗北後/リトライ前

```txt
Quote: 45%
Vamp Line: 35%
Character Line: 20%
```

理由:

```txt
敗北後はキャラの言葉が刺さる。
ただし説教臭くしない。
```

---

## 3. 人物の言葉は「たまに」

ここで言う人物の言葉は2種類。

```txt
1. 実在人物/作者の引用
2. Vamp Ponキャラ自身の言葉
```

### 実在人物/作者の引用

出す。
むしろ知識供給として重要。

例:

```txt
We grow accustomed to the Dark.
— Emily Dickinson
```

```txt
Sunt lacrimae rerum.
— Virgil, Aeneid
```

```txt
E quindi uscimmo a riveder le stelle.
— Dante, Inferno
```

### Vamp Ponキャラの言葉

出しすぎない。
1プレイ中に同じキャラ文は1回まで。
通常ロードでは10%程度。

例:

```txt
帰れない人がいるから、私はまだ帰れない。
— ユイ
```

```txt
飛べることと、軽いことは違う。
— クロエ
```

```txt
私の名前は、私より先に迷子になった。
— シノ
```

---

## 4. 読ませる時間ルール

ロードが完了しても、読了時間を優先する。

### 最低表示

```txt
minimumVisibleMs: 3200
```

旧案の2800msは少し短い。
おしゃれに見せるなら、最低3.2秒は残す。

### 文字数ベースの自動計算

```txt
baseMs: 1800
jaMsPerChar: 95
latinMsPerWord: 260
sourceExtraMs: 500
maxVisibleMs: 6500
```

計算例:

```ts
const visibleMs = clamp(
  baseMs + textReadMs + sourceExtraMs,
  3200,
  6500
);
```

### 日本語

```txt
短文 10〜18字: 3.2〜3.8秒
中文 19〜30字: 3.8〜4.8秒
長文 31〜45字: 4.8〜6.5秒
```

### 英語/ラテン語/イタリア語

```txt
1〜5 words: 3.2〜3.8秒
6〜10 words: 3.8〜5.0秒
11〜16 words: 5.0〜6.5秒
```

### 出典表示がある場合

```txt
+0.5秒
```

引用は本文だけでなく、出典も読ませる。

---

## 5. スキップ仕様

読ませたいが、テンポも壊さない。

```txt
初見の文: 2.4秒までスキップ不可
既読の文: 1.2秒後スキップ可能
連続リトライ時: 1.0秒後スキップ可能
```

ただし、初回プレイ中の最初の3回のロードは、雰囲気づくりのため最低3.2秒表示する。

---

## 6. 表示の優先順位

ロード文はランダムだけで選ばない。

```txt
1. 現在のステージタグ
2. 選択キャラタグ
3. 直近表示履歴
4. 引用/Vamp文/キャラ文の比率
5. 商用リスク
```

例:

```txt
Stage 1 / 忘れ物の路地
→ lost-item / road / night を優先
```

```txt
ユイ選択中
→ light / road / name / morning を優先
```

```txt
黒耀ゲージ高め
→ dark / weakness / black を優先
```

---

## 7. 連続表示禁止

### 同一文

```txt
直近10件以内は再表示しない。
```

### 同一作者/同一出典

```txt
直近3件以内は同一作者を避ける。
```

### キャラ文

```txt
同一キャラの文は1プレイ1回まで。
通常ロードでキャラ文が2連続するのは禁止。
```

### 言語

```txt
英語引用が3連続しないようにする。
日本語/漢文/ラテン語/イタリア語を混ぜる。
```

---

## 8. 引用の見せ方

引用は知識供給なので、出典を必ず出す。

```txt
本文

— 作者, 作品
```

例:

```txt
We grow accustomed to the Dark.

— Emily Dickinson
```

```txt
Sunt lacrimae rerum.

— Virgil, Aeneid
```

```txt
春はあけぼの。

— 枕草子
```

出典は本文より薄く、小さく。
ただし読めるサイズにする。

```txt
本文: 18〜22px
出典: 11〜12px
出典 opacity: 0.68〜0.78
```

---

## 9. 初期実装で入れる比率

最初のデータは30件でよい。

```txt
Quote: 18件
Vamp Line: 9件
Character Line: 3件
```

キャラ文を最初から多く入れすぎない。
ロード画面の主役は引用と世界観文。
キャラ文は「たまに出て刺さる」位置にする。

---

## 10. まず入れるQuote 18件

```txt
We grow accustomed to the Dark.
— Emily Dickinson
```

```txt
A Light exists in Spring.
— Emily Dickinson
```

```txt
Hope is the thing with feathers.
— Emily Dickinson
```

```txt
Sunt lacrimae rerum.
— Virgil, Aeneid
```

```txt
Forsan et haec olim meminisse iuvabit.
— Virgil, Aeneid
```

```txt
E quindi uscimmo a riveder le stelle.
— Dante, Inferno
```

```txt
Nel mezzo del cammin di nostra vita.
— Dante, Divina Commedia
```

```txt
To see a World in a Grain of Sand.
— William Blake
```

```txt
Hold Infinity in the palm of your hand.
— William Blake
```

```txt
Music, when soft voices die, vibrates in the memory.
— Percy Bysshe Shelley
```

```txt
Bright star, would I were stedfast as thou art.
— John Keats
```

```txt
The night is long that never finds the day.
— William Shakespeare
```

```txt
What's in a name?
— William Shakespeare
```

```txt
The rest is silence.
— William Shakespeare
```

```txt
行く川のながれは絶えずして、しかももとの水にあらず。
— 方丈記
```

```txt
春はあけぼの。
— 枕草子
```

```txt
月日は百代の過客にして、行かふ年も又旅人也。
— 奥の細道
```

```txt
銀河ステーション、銀河ステーション。
— 銀河鉄道の夜
```

注意:

```txt
宮沢賢治は日本では公有領域候補だが、最終商用前に使用可否を再確認する。
不安ならVamp Lineへ置き換える。
```

---

## 11. まず入れるVamp Line 9件

```txt
見えないものほど、夜に残る。
```

```txt
小さな灯りは、なくしたものから先に照らす。
```

```txt
明けない夜はない。でも、長い夜はある。
```

```txt
夜は、忘れ物で濃くなる。
```

```txt
帰り道には、落としたものが光ることがある。
```

```txt
朝は、暗いところから始まる。
```

```txt
黒耀は、弱さが光に混ざったもの。
```

```txt
星は遠いのに、迷子には近い。
```

```txt
なくしたあとで、光りはじめるものがある。
```

---

## 12. まず入れるCharacter Line 3件

```txt
帰れない人がいるから、私はまだ帰れない。
— ユイ
```

```txt
私の名前は、私より先に迷子になった。
— シノ
```

```txt
飛べることと、軽いことは違う。
— クロエ
```

この3件だけでよい。
キャラ文は強いが、出しすぎると重い。

---

## 13. 最終方針

ロード画面は、ちゃんと引用を読ませる。

```txt
引用を主役にする。
Vamp Pon文で世界観を補強する。
人物/キャラ文はたまに刺す。
読む時間はロード完了より優先する。
```

これが現時点の正本。
