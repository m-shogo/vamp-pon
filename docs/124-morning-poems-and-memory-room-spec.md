# Morning Poems and Memory Room Spec

Vamp Pon / ヴァンサバ改における、ロード名言・キャラ返信・朝明ポエム・記録室/用語帳・音楽演出をゲーム内体験へ接続するための実装前仕様。

---

## 1. この資料の目的

これまで決めたロード名言/格言/英語表現/パロディ/宗教観/文字演出を、単なる文芸資料で終わらせない。

```txt
ロード = 知識と入口
キャラ返信 = 価値観の露出
朝明 = キャラの心が少し進む瞬間
記録室 = 調べたい/見返したい欲求の受け皿
音楽/鈴 = 未練と記憶をほどく演出
```

この5つをゲーム体験としてつなぐ。

---

## 2. 大前提

```txt
名言は名言として扱う。
原文は原文。
訳は訳。
Vamp Ponらしさはキャラ返信で出す。
```

```txt
朝明ポエムはロード名言とは別物。
ロードでは知識や言葉に触れる。
朝明ではキャラ本人の心を読む。
```

---

# 3. 役割分担

## 3.1 Loading Quote / ロード名言

役割:

```txt
世界中の言葉に触れる。
プレイヤーの知識欲を刺激する。
原文の雰囲気を残す。
短い日本語訳/意味で入口を作る。
```

例:

```txt
反者道之動。
— 道徳経 第四十章

戻ること、反転することが、道の動きである。
```

---

## 3.2 Character Reply / キャラ返信

役割:

```txt
キャラがその言葉をどう受け取るかを見せる。
解説ではない。
正解でもない。
その子の価値観が漏れる返事。
```

例:

```txt
戻る道も、地図に描いていいんだ。
— ナギ / Nagi
```

---

## 3.3 Morning Poem / 朝明ポエム

役割:

```txt
そのキャラが夜を少し越えた証。
勝利演出ではなく、納得して進む演出。
```

例:

```txt
朝は、終わりじゃなくて縫い目かもしれない。
— ヒナタ
```

---

## 3.4 Memory Room / 記録室・用語帳

役割:

```txt
ロードで出会った言葉を見返す場所。
詳しく知りたい時の入口。
キャラ返信も記録して、キャラ理解を深める。
```

---

## 3.5 Music / Sound Memory

役割:

```txt
リツ/スズを中心に、音が記憶や未練をほどく。
音楽はBGMではなく、言葉と記憶をつなぐ演出になる。
```

---

# 4. 朝明ポエム仕様

## 4.1 表示タイミング

```txt
ステージ初回クリア
キャラ初回クリア
黒耀状態からクリア
キャラレベル節目
重要な忘れ物を回収した後
```

## 4.2 表示時間

```txt
minimumVisibleMs: 6500
recommendedVisibleMs: 7200
maxVisibleMs: 8500
skipEnableMs: 2600
readableHoldMs: 2000
```

## 4.3 UI

```txt
背景はロードより明るいが、完全な白ではない。
朝焼け、紙片、灯りの残光。
キャラ名は小さく。
本文を主役にする。
```

## 4.4 文体

```txt
1〜3行。
説明しない。
ポエムに寄せるが、意味は分かる。
キャラの成長や納得を一滴だけ見せる。
```

---

# 5. 20キャラ朝明ポエム初期案

## 5.1 ユイ / Yui

```txt
拾ったものを全部、持って帰れなくても。
灯りは、帰り道を覚えてくれる。
```

用途:

```txt
主人公初回クリア / 忘れ物回収後
```

## 5.2 アサ / Asa

```txt
焦げたままでも、朝は来た。
痛いところが、まだ私の形をしている。
```

用途:

```txt
黒耀からのクリア / 被ダメ多めクリア
```

## 5.3 ナギ / Nagi

```txt
迷った線も、消さなくていい。
遠回りだった道が、地図になる日もある。
```

用途:

```txt
探索深度更新 / ステージ踏破
```

## 5.4 ミチル / Michiru

```txt
流れたものを、忘れたとは呼ばない。
水は、触れたものの重さを知っている。
```

用途:

```txt
回復/耐久系クリア / 水辺ステージ
```

## 5.5 トモリ / Tomori

```txt
直せないひびにも、残る光がある。
今日は、それを壊さずに持てた。
```

用途:

```txt
低HPクリア / 修理系アイテム取得後
```

## 5.6 シノ / Shino

```txt
呼ばれた名前が、少し遅れて戻ってきた。
今日は、こぼれずに返事ができた。
```

用途:

```txt
名前/呼称系イベント後
```

## 5.7 シオン / Shion

```txt
書けなかった一行が、朝の余白に残った。
閉じなくていいページも、あるのかもしれない。
```

用途:

```txt
記録室解放 / 本・紙片回収後
```

## 5.8 クロエ / Chloe

```txt
羽が軽くなったわけじゃない。
それでも、影の外まで運べた。
```

用途:

```txt
高移動/回避系クリア / 孤独系イベント後
```

## 5.9 コハル / Koharu

```txt
芽は、春を知らなくても伸びる。
こわい朝にも、少しだけ顔を出せる。
```

用途:

```txt
成長/初クリア / 低レベル開始後の成功
```

## 5.10 レン / Ren

```txt
継いだ星は、まだ手の形に合わない。
それでも今日は、落とさずに帰れた。
```

用途:

```txt
継承/星系ステージ / 強化節目
```

## 5.11 マヨイ / Mayoi

```txt
間違えた道にも、朝はあった。
迷子は、ときどき近道のふりをする。
```

用途:

```txt
探索ミス後のクリア / ランダムイベント後
```

## 5.12 イオリ / Iori

```txt
針は震えても、北を忘れなかった。
私も、少しだけ同じだった。
```

用途:

```txt
方位/真偽系イベント / デバフ克服後
```

## 5.13 ハク / Haku

```txt
白紙は、空っぽじゃなかった。
朝の色を、まだ知らなかっただけ。
```

用途:

```txt
黒耀浄化 / 初期化/リセット系イベント後
```

## 5.14 スズ / Suzu

```txt
鳴らなかった鈴にも、返事は残る。
今日は、それを少しだけ聞けた。
```

用途:

```txt
音/沈黙系ステージ / ノーダメージ寄りクリア
```

## 5.15 リツ / Ritsu

```txt
歌えなかった歌ほど、指が覚えている。
朝は、音になる前の返事だった。
```

用途:

```txt
音楽/記憶系イベント / BGM変化後
```

## 5.16 ヒナタ / Hinata

```txt
破れた夜を、全部は縫えなかった。
でも朝は、縫い目から先に明るくなった。
```

用途:

```txt
朝明基本演出 / 修復系クリア
```

## 5.17 カナメ / Kaname

```txt
守るための輪が、閉じすぎる日もある。
今日は、少しだけ開けたまま帰れた。
```

用途:

```txt
防御/境界系クリア / 仲間保護イベント
```

## 5.18 セナ / Sena

```txt
届けたあとまで、背負わなくていい。
それを知るまで、ずいぶん遠くへ来た。
```

用途:

```txt
届け物/手紙/港系ステージ
```

## 5.19 ユラ / Yura

```txt
下手な踊りでも、朝までは転ばなかった。
震えた足にも、拍手は届くらしい。
```

用途:

```txt
舞台/パロディ/回避失敗からのクリア
```

## 5.20 ネム / Nemu

```txt
眠れない夜にも、夢は残っていた。
朝は、起きることだけじゃないみたい。
```

用途:

```txt
夢/眠り/夜更け系ステージ
```

---

# 6. 記録室/用語帳仕様

## 6.1 解放条件

```txt
ロード文を1回見ると「未確認」で登録。
ロード文を最後まで読むと「読了」登録。
キャラ返信つきで見ると、その返信も登録。
朝明ポエムを見ると、キャラページに保存。
```

## 6.2 一覧カテゴリ

```txt
名言
格言/ことわざ
日常英語
難語/文章語
地域別の言葉
キャラ返信
朝明ポエム
```

## 6.3 詳細画面

表示項目:

```txt
Original / 語句
Source / 出典
Language / 言語
日本語訳/意味
関連タグ
見た回数
初めて見たステージ
関連キャラ返信
調べるためのキーワード
```

例:

```txt
Original:
反者道之動。

Source:
道徳経 第四十章

日本語訳/意味:
戻ること、反転することが、道の動きである。

Character reply:
戻る道も、地図に描いていいんだ。
— ナギ / Nagi

Research hooks:
道徳経 第四十章
反者道之動
Dao De Jing 40
```

## 6.4 UI方針

```txt
図鑑ではなく「記録室」。
知識を集める場所であり、キャラの心を見返す場所。
重すぎない。
紙片、カード、栞、封筒、地図ピンのUIを使う。
```

---

# 7. 既読管理仕様

## 7.1 保存データ

```ts
export type SeenKnowledgeEntry = {
  id: string;
  firstSeenAt: number;
  lastSeenAt: number;
  seenCount: number;
  completedReadCount: number;
  stagesSeenIn: string[];
  replyIdsSeen: string[];
};

export type SeenMorningPoem = {
  poemId: string;
  characterId: string;
  firstSeenAt: number;
  condition: 'stageClear' | 'firstClear' | 'blackPurified' | 'characterLevelUp' | 'memoryItem';
};
```

## 7.2 ロード選定への影響

```txt
未読は少し出やすい。
直近3回に出た文は出さない。
難語は2連続禁止。
同じ地域は3連続禁止。
同じキャラ返信は5ロード以内に再表示しない。
朝明ポエムは同条件で1回目を優先し、以降は低確率再表示。
```

---

# 8. ギャグ → 泣きの比率

Angel Beats! 的な取れ高を活かすなら、常に重くしない。
軽口を挟んでから刺す。

## 8.1 ロード全体比率

```txt
Serious quote: 30%
Regional quote/proverb: 20%
Everyday English phrase: 15%
Rare Japanese/literary phrase: 15%
Vamp Pon original line: 10%
Parody dialogue prompt: 10%
```

## 8.2 1プレイ内の感情波形

```txt
開始: 軽め/知識系
中盤: 格言/地域系
黒耀が近い: 重め/執着系
クリア直前: 帰り道/朝系
クリア後: 朝明ポエム
敗北後: 救済ではなく再出発系
```

## 8.3 例

軽口:

```txt
Piece of cake.
— English idiom

ケーキなら、どうして歯があるの。
— アサ
```

中間:

```txt
無用之用
— 荘子

役に立たないと思われるものにこそ、別の用い方がある。

白紙も、まだ使い道がないだけかもしれない。
— ハク
```

刺す:

```txt
消えることと、忘れられることは違う。

鳴らない鈴にも、返事は残る。
— スズ
```

---

# 9. 音楽・鈴・記憶演出

## 9.1 リツ/スズの重要度

Angel Beats! 的な構造をVamp Pon化するなら、リツ/スズは重要。

```txt
音楽 = 未練をほどくもの
鈴 = 鳴らなかった返事
沈黙 = 空白ではなく、まだ聞こえていない音
```

## 9.2 ロード演出

```txt
リツ/スズ返信時は Bell Ripple / waveform を使う。
BGMをほんの少し下げて、短い単音を入れる。
音は鳴りすぎない。
イヤホンで気づく程度の小ささでよい。
```

## 9.3 朝明演出

```txt
ステージクリア直後、BGMを一瞬だけ薄くする。
鈴/弦/ピアノ単音/小さなハミング風の音を一回だけ入れる。
朝明ポエム表示中は環境音を少し残す。
```

## 9.4 記録室

```txt
音関連の言葉は、詳細画面で小さな波形演出を表示。
再生ボタンは不要。
音を鳴らすなら短いUI音だけ。
```

---

# 10. 実装データ案

```ts
export type KnowledgeCategory =
  | 'quote'
  | 'regional_quote'
  | 'proverb'
  | 'everyday_phrase'
  | 'rare_word'
  | 'literary_transition'
  | 'vamp_original'
  | 'parody_prompt';

export type KnowledgeLine = {
  id: string;
  category: KnowledgeCategory;
  originalText: string;
  sourceLabel: string;
  languageLabel?: string;
  meaningJa: string;
  researchHooks: string[];
  region?: 'india' | 'europe' | 'east_asia' | 'japan' | 'america_caribbean';
  tags: string[];
  commercialStatus: 'safe-candidate' | 'public-domain-candidate' | 'common-expression-candidate' | 'original' | 'final-check-required' | 'do-not-display';
  presentationPattern?: string;
  minVisibleMs: number;
};

export type CharacterKnowledgeReply = {
  id: string;
  knowledgeLineId: string;
  characterId: string;
  replyJa: string;
  replyEn?: string;
  tone: 'serious' | 'small-joke' | 'sad-funny' | 'dry' | 'gentle' | 'quiet' | 'soft-parody';
  tags: string[];
  minVisibleMs?: number;
};

export type MorningPoem = {
  id: string;
  characterId: string;
  textJa: string;
  textEn?: string;
  condition: 'stageClear' | 'firstClear' | 'blackPurified' | 'characterLevelUp' | 'memoryItem';
  presentationPattern: 'lantern-reveal' | 'thread-stitch' | 'water-memory' | 'bell-ripple' | 'black-glitch' | 'postcard-stamp' | 'page-turn';
  minVisibleMs: number;
  skipEnableMs: number;
  tags: string[];
};
```

---

# 11. 実装ハンドオフ

Claude Code / Codex に渡す時の要件:

```txt
1. src/data/knowledgeLines.ts を作る。
2. src/data/characterKnowledgeReplies.ts を作る。
3. src/data/morningPoems.ts を作る。
4. KnowledgeLine commercialStatus === 'do-not-display' は出さない。
5. LoadingTextRenderer で原文/出典/意味/返信を段階表示する。
6. MemoryRoomScene または DictionaryPanel を追加する。
7. localStorage に seenKnowledgeEntries / seenMorningPoems を保存する。
8. quote selection は未読優先、直近重複回避、難語連続禁止にする。
9. 朝明ポエムはステージクリア後に表示し、ロード名言とは混ぜない。
10. リツ/スズ関連は音量を控えめにした専用UI音を使う。
```

---

# 12. 最終方針

```txt
ロード名言は、知識欲と世界観の入口。
キャラ返信は、その子の価値観。
朝明ポエムは、その子が少し進んだ証。
記録室は、プレイヤーが調べたい/見返したい欲求の受け皿。
音楽と鈴は、未練をほどく鍵。
```

この構造で、Vamp Ponは

```txt
言葉を知る
意味を知る
キャラの受け取り方を知る
朝明でその子の変化を見る
あとで記録室で思い出す
```

という体験を持てる。
