# Initial Knowledge Lines Integration Spec

Vamp Pon / ヴァンサバ改のロード知識システムに投入する初期KnowledgeLine統合仕様。

この資料は、以下の確定候補を実装へ落とすための橋渡しである。

- `docs/127-everyday-english-phrase-final-candidates.md`
- `docs/128-rare-japanese-literary-phrase-final-candidates.md`
- `docs/129-serious-literary-quote-final-candidates.md`
- `docs/130-regional-quote-proverb-final-candidates.md`

---

## 1. 目的

これまでの候補を、実装時に破綻しないよう統合する。

```txt
新しい文を増やさない。
確定済み候補を整理する。
初期投入と状況制御を分ける。
ID/カテゴリ/タグ/表示演出の規則を固定する。
```

---

## 2. 初期KnowledgeLine総数

確定候補の総数:

```txt
Everyday English phrase: 8
Rare Japanese / literary phrase: 8
Serious literary quote: 8
Regional quote / proverb: 10
Total: 34
```

Production Plan では KnowledgeLine 40件をMVP目安にしていたが、まずは34件で止める。

理由:

```txt
少数精鋭を優先する。
初期34件でカテゴリの幅は十分に出る。
残り6件は実装後の表示頻度/読了率を見て追加する。
```

---

# 3. 初期投入 / 状況制御 / 保留の分類

## 3.1 初期投入 / Launch Core

最初からロードに出してよいもの。

```txt
Everyday English: 5
Rare Japanese: 5
Serious Literary: 7
Regional: 5
Total: 22
```

### Everyday English / Launch Core

```txt
Bless you.
Take care.
Good night.
See you.
Fingers crossed.
```

### Rare Japanese / Launch Core

```txt
閑話休題
曖昧模糊
有耶無耶
薄明
画竜点睛
```

### Serious Literary / Launch Core

```txt
We grow accustomed to the Dark.
Sunt lacrimae rerum.
E quindi uscimmo a riveder le stelle.
Music, when soft voices die, vibrates in the memory.
What's in a name?
春はあけぼの。
行く川のながれは絶えずして、しかももとの水にあらず。
```

### Regional / Launch Core

```txt
Per aspera ad astra.
反者道之動。
無用之用
すべて何も皆事のととのほりたるはあしき事なり。
Cat luck ain't dog luck.
```

---

## 3.2 状況制御 / Context Gated

出してよいが、文脈を選ぶもの。

```txt
Everyday English: 3
Rare Japanese: 3
Serious Literary: 1
Regional: 5
Total: 12
```

### Everyday English / Context Gated

```txt
No worries.
Hang in there.
Knock on wood.
```

表示条件:

```txt
No worries: 黒耀高め/シオン/アサ/心配タグ
Hang in there: 敗北後/リトライ前/低HPクリア後
Knock on wood: 森/迷信/幸運/トモリ/クロエ関連
```

### Rare Japanese / Context Gated

```txt
余談ながら
序破急
蛇足
```

表示条件:

```txt
余談ながら: 記録室/シオン/セナ寄り
序破急: ボス前/ステージ演出/リツ/コハル寄り
蛇足: 軽口回/ユラ/ナギ寄り
```

### Serious Literary / Context Gated

```txt
The rest is silence.
```

表示条件:

```txt
敗北後
黒耀高め
スズ/リツ/沈黙タグ
初回ロードでは出さない
```

### Regional / Context Gated

```txt
tasmād asaktaḥ satataṁ kāryaṁ karma samācara
phandanaṁ capalaṁ cittaṁ dūrakkhaṁ dunnivārayaṁ...
Sit in thy cell and thy cell will teach thee all.
すべて、何も皆、始め終りこそをかしけれ。
Wuh ain't miss you, ain't pass you.
```

表示条件:

```txt
インド/宗教哲学系: 黒耀/手放し/記録室寄り
Dhammapada 33: ロード短縮版必須
Desert Fathers: シオン/内省/記録室寄り
徒然草 始め終り: 朝明前後
Bajan Wuh ain't miss you: 敗北/リトライ/クロエ/セナ寄り
```

---

# 4. ID規則

## 4.1 KnowledgeLine ID

```txt
カテゴリ-地域/言語-短いslug
```

例:

```txt
everyday-bless-you
rare-jp-kanwa-kyudai
quote-dickinson-dark
regional-east-asia-daodejing-40
```

禁止:

```txt
日本語ID
空白
大文字始まり
作品名だけの曖昧ID
```

---

## 4.2 CharacterReply ID

```txt
reply-{knowledgeSlug}-{characterId}
```

例:

```txt
reply-bless-you-yui
reply-kanwa-kyudai-nagi
reply-dickinson-dark-asa
reply-daodejing40-mayoi
```

---

# 5. TypeScript型の正本

```ts
export type KnowledgeCategory =
  | 'quote'
  | 'regional_quote'
  | 'everyday_phrase'
  | 'rare_word'
  | 'vamp_original'
  | 'parody_prompt';

export type KnowledgeRegion =
  | 'india'
  | 'europe'
  | 'east_asia'
  | 'japan'
  | 'america_caribbean';

export type CommercialStatus =
  | 'safe-candidate'
  | 'common-expression-candidate'
  | 'public-domain-candidate'
  | 'final-check-required'
  | 'original'
  | 'do-not-display';

export type PresentationPattern =
  | 'ink-bloom'
  | 'lantern-reveal'
  | 'page-turn'
  | 'bell-ripple'
  | 'postcard-stamp'
  | 'star-pin'
  | 'water-memory'
  | 'thread-stitch'
  | 'black-glitch'
  | 'curtain-whisper';

export type KnowledgeLine = {
  id: string;
  category: KnowledgeCategory;
  originalText: string;
  sourceLabel: string;
  languageLabel: string;
  meaningJa: string;
  researchHooks: string[];
  region?: KnowledgeRegion;
  tags: string[];
  commercialStatus: CommercialStatus;
  presentationPattern: PresentationPattern;
  minVisibleMs: number;
  launchTier: 'launch-core' | 'context-gated' | 'hold';
  gateTags?: string[];
};

export type CharacterKnowledgeReply = {
  id: string;
  knowledgeLineId: string;
  characterId: string;
  replyJa: string;
  replyEn?: string;
  tone: 'serious' | 'small-joke' | 'sad-funny' | 'dry' | 'gentle' | 'quiet' | 'soft-parody';
  tags: string[];
  rank: 'S' | 'A' | 'B' | 'C';
};
```

---

# 6. 表示比率の初期値

## 6.1 通常ロード

```txt
Everyday English: 25%
Rare Japanese: 20%
Serious Literary: 30%
Regional: 20%
Vamp Original / Parody: 5%
```

理由:

```txt
Seriousで格を出す。
Everydayで軽さを出す。
Rare Japaneseで知識欲を出す。
Regionalは濃いので20%に抑える。
```

## 6.2 初回起動直後

```txt
Everyday English: 35%
Rare Japanese: 15%
Serious Literary: 25%
Regional: 15%
Vamp Original: 10%
```

理由:

```txt
最初から重すぎる古典/宗教哲学に寄せない。
日常英語とVamp Originalで入りやすくする。
```

## 6.3 黒耀ゲージ高め

```txt
Everyday English: 10%
Rare Japanese: 20%
Serious Literary: 35%
Regional: 30%
Vamp Original: 5%
```

理由:

```txt
執着、記憶、沈黙、手放しに寄せる。
軽口は減らす。
```

## 6.4 敗北後

```txt
Everyday English: 25%
Rare Japanese: 15%
Serious Literary: 20%
Regional: 20%
Vamp Original: 20%
```

理由:

```txt
責めない。
再出発、戻る道、またね、持ちこたえる系を優先する。
```

---

# 7. 重複回避ルール

```txt
直近3ロードで同じKnowledgeLineを出さない。
直近5ロードで同じCharacterReplyを出さない。
同じcategoryは3連続禁止。
同じregionは3連続禁止。
rare_wordは2連続禁止。
context-gatedは条件一致時のみ候補に入れる。
do-not-displayは絶対に出さない。
```

---

# 8. 初期データ投入順

## Step 1

```txt
Launch Core 22件だけをsrc/data/knowledgeLines.tsに入れる。
```

## Step 2

```txt
各KnowledgeLineにつき返信1件だけ入れる。
合計22返信。
```

## Step 3

```txt
初期ロードで表示できるか確認。
読める時間、改行、演出を確認。
```

## Step 4

```txt
Context Gated 12件を追加。
ただし条件判定ができるまでlaunchTierはcontext-gatedのまま。
```

## Step 5

```txt
返信を各KnowledgeLine 2件に増やす。
合計68返信を目標にする。
```

---

# 9. 初期22件の優先返信

最初は各KnowledgeLineに返信1件だけでよい。

```txt
Bless you. → ユイ
Take care. → セナ
Good night. → ネム
See you. → クロエ
Fingers crossed. → イオリ

閑話休題 → ナギ
曖昧模糊 → シノ
有耶無耶 → ユイ
薄明 → ヒナタ
画竜点睛 → ハク

We grow accustomed to the Dark. → ユイ
Sunt lacrimae rerum. → ユイ
E quindi uscimmo a riveder le stelle. → ナギ
Music, when soft voices die... → リツ
What's in a name? → シノ
春はあけぼの。 → コハル
行く川のながれは絶えずして... → ミチル

Per aspera ad astra. → ナギ
反者道之動。 → ナギ
無用之用 → ハク
徒然草 不完全 → トモリ
Cat luck ain't dog luck. → ナギ
```

この時点では、返信を増やしすぎない。
まず「見せ方」と「読める時間」を検証する。

---

# 10. 実装プロンプトへ渡す時の要約

```txt
確定済みKnowledgeLine 34件のうち、まずLaunch Core 22件だけを実装する。
各行に1返信だけ紐づける。
Context Gated 12件はデータには置いてよいが、条件判定ができるまで通常ロード候補から除外する。
重複回避・カテゴリ連続禁止・rare_word連続禁止を入れる。
Memory Roomには見たものだけを登録する。
```

---

# 11. 最終方針

```txt
いきなり40件フル投入しない。
Launch Core 22件で、まずロード体験の芯を作る。
```

成功条件:

```txt
ロードで言葉が読める。
出典と意味が分かる。
キャラ返信でその子の価値観が見える。
同じ文がしつこく出ない。
あとで記録室に残る。
```
