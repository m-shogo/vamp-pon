# Loading Knowledge System Production Plan

Vamp Pon / ヴァンサバ改のロード名言・格言・日常英語・難語・キャラ返信・朝明ポエム・記録室を、実装順と品質基準まで落とすための制作計画。

---

## 1. 目的

これまでの資料は方向性として強い。
ただし、このままだと実装時に散る。

この資料では、次を決める。

```txt
最初に実装する最小構成
商用品質に見える条件
初期収録すべき文の比率
NG演出
キャラ返信の品質チェック
記録室のMVP
後回しにしてよいもの
```

---

## 2. この機能の本質

ロード名言システムは、単なる待ち時間演出ではない。

```txt
言葉を知る
意味を知る
キャラの受け取り方を知る
朝明でその子の変化を見る
あとで記録室で思い出す
```

この流れを作るIP育成装置。

---

## 3. 商用品質に見える条件

最低条件:

```txt
文字が読める
表示時間が短すぎない
原文/出典/意味/返信の階層が明確
同じ文が連続しない
キャラ返信が説明ではない
画面が静かに美しい
```

商用品質ライン:

```txt
文の種類で演出が変わる
選択キャラに合う返信が出る
初見と既読でスキップ体験が違う
記録室であとから見返せる
朝明ポエムがロード名言とは別演出で出る
音/鈴/水/紙/灯りなど、キャラ固有の微演出がある
```

やってはいけないこと:

```txt
毎回同じフェード
全部ポエムで重い
名言をVamp Pon風に改変してしまう
出典不明な言葉を本物っぽく出す
キャラが名言の意味を解説する
難語を連続で出す
宗教圏の言葉を軽口でいじる
```

---

# 4. MVP実装範囲

最初から全部やらない。
まずは以下だけで十分。

## 4.1 初期収録数

```txt
KnowledgeLine: 40件
CharacterReply: 60件
MorningPoem: 20件
PresentationPattern: 5種類
MemoryRoom: 一覧 + 詳細のみ
```

内訳:

```txt
Serious literary quote: 8件
Regional quote/proverb: 10件
Everyday English phrase: 8件
Rare Japanese/literary phrase: 8件
Vamp Pon original line: 4件
Parody dialogue prompt: 2件
```

理由:

```txt
最初から100件入れるより、40件を高品質にした方が印象が良い。
同じ文の再表示は既読管理で抑える。
```

## 4.2 初期PresentationPattern

最初に実装すべき5つ:

```txt
Lantern Reveal
Ink Bloom
Page Turn
Bell Ripple
Postcard Stamp
```

後回し:

```txt
Water Memory
Thread Stitch
Star Pin
Black Glitch
Curtain Whisper
```

理由:

```txt
最初の5つで、ユイ/古典/記録/音/手紙を表現できる。
水・縫い目・地図・黒耀・舞台は次フェーズでよい。
```

---

# 5. 初期収録セット方針

## 5.1 Serious literary quote 8件

選定条件:

```txt
短い
世界観に合う
出典確認しやすい
日本語で意味が伝わる
キャラ返信が複数作れる
```

優先候補:

```txt
We grow accustomed to the Dark.
Sunt lacrimae rerum.
E quindi uscimmo a riveder le stelle.
Music, when soft voices die, vibrates in the memory.
What's in a name?
The rest is silence.
春はあけぼの。
行く川のながれは絶えずして、しかももとの水にあらず。
```

## 5.2 Regional quote/proverb 10件

地域比率:

```txt
インド: 2
ヨーロッパ: 2
東アジア: 2
日本: 2
アメリカ/カリブ: 2
```

目的:

```txt
各地域の言葉の質感を見せる。
詳しく知りたい人が調べるフックを作る。
```

## 5.3 Everyday English phrase 8件

優先候補:

```txt
Bless you.
Take care.
Good night.
See you.
No worries.
Hang in there.
Fingers crossed.
Knock on wood.
```

目的:

```txt
英語圏の日常表現の知識欲を満たす。
重い名言の間に生活感とユーモアを挟む。
```

## 5.4 Rare Japanese/literary phrase 8件

優先候補:

```txt
閑話休題
余談ながら
序破急
蛇足
画竜点睛
有耶無耶
曖昧模糊
薄明
```

目的:

```txt
日本語の知識欲を満たす。
本を読んでいる時の、知らない語に出会う感覚を作る。
```

## 5.5 Vamp Pon original line 4件

用途:

```txt
名言ではないが、世界観を短く刺す文。
```

候補:

```txt
救いはいらない。帰り道だけ、少し照らして。
忘れ物は、帰れなかった理由の形をしている。
消えることと、忘れられることは違う。
朝は、勝った人だけに来るわけじゃない。
```

## 5.6 Parody dialogue prompt 2件

初期は少なめ。

候補:

```txt
Come back.

Give me a road first.
— クロエ
```

```txt
You are burning again.

Then I am still here.
— アサ
```

理由:

```txt
パロ会話は強いが、出しすぎると寒い。
まずは少数で刺さるものだけ入れる。
```

---

# 6. キャラ返信品質チェック

キャラ返信はこの機能の核。
次のチェックを通す。

## 6.1 OK条件

```txt
そのキャラにしか言えない
名言の解説ではない
短い
少し価値観が見える
言い切りすぎない
日本語だけでも刺さる
英語版があっても翻訳調すぎない
```

## 6.2 NG条件

```txt
「なるほど」「いい言葉だね」で終わる
名言を説明しているだけ
キャラ設定と関係ない
全部のキャラが言えそう
長すぎる
ポエムに酔いすぎる
軽口が寒い
```

## 6.3 採用ランク

### Sランク

```txt
名言を読んだ瞬間、そのキャラの傷/価値観が見える。
```

例:

```txt
What's in a name?
— William Shakespeare

私には、まだ入りきらない。
— シノ
```

### Aランク

```txt
キャラらしいが、もう少し固有の傷が欲しい。
```

### Bランク

```txt
悪くないが汎用的。実装前に再考。
```

### Cランク

```txt
説明/凡庸/寒い。削除。
```

---

# 7. 既読・選定アルゴリズム

## 7.1 基本

```txt
未読を優先
直近3ロードの文は除外
同じ地域は3連続禁止
同じカテゴリは3連続禁止
難語は2連続禁止
同じキャラ返信は5ロード以内禁止
```

## 7.2 状況別重み

### ステージ開始

```txt
Everyday English phrase: +20
Regional quote: +10
Parody dialogue: +5
Heavy quote: -10
```

### 黒耀ゲージ高め

```txt
India / handoff / attachment tags: +20
Black / burden / memory tags: +20
Parody dialogue: -10
```

### 敗北後

```txt
Retry / return / not-final tags: +30
No harsh line
No guilt-heavy line
```

### クリア後

```txt
MorningPoem 優先
LoadingQuote は出さない
```

### キャラ選択後

```txt
selectedCharacterId に対応する reply を優先
ただしタグ一致2以上が必要
```

---

# 8. Memory Room MVP

最初は凝りすぎない。

## 8.1 一覧

```txt
カテゴリタブ
未読/読了フィルタ
地域フィルタ
キャラフィルタ
```

## 8.2 詳細

```txt
原文
出典
日本語訳/意味
キャラ返信
見た回数
初めて見たステージ
調べるキーワード
```

## 8.3 後回し

```txt
検索機能
外部リンク
音声再生
高度なアニメーション
SNS共有
```

理由:

```txt
まずは見返せることが重要。
```

---

# 9. UI品質基準

## 9.1 スマホ縦画面

想定:

```txt
390x844
片手操作
暗め背景
文字は中央〜下部
```

## 9.2 文字サイズ

```txt
Original: 18〜22px
Source: 10〜12px
Meaning: 16〜20px
Reply: 16〜20px
Character name: 11〜13px
```

## 9.3 行数制限

```txt
Original: 最大3行
Meaning: 最大3行
Reply: 最大2行
全体: 最大9行程度
```

超える場合:

```txt
記録室向けに回す
ロードには短縮版だけ出す
```

## 9.4 余白

```txt
左右24px以上
下部safe area 32px以上
本文ブロック高さは画面の45%以内
```

---

# 10. 音と文字の連携

## 10.1 必須

```txt
文字表示時のSEは控えめ
出典表示時は鳴らさない
キャラ返信時だけ小さなアクセント音
```

## 10.2 キャラ別アクセント

```txt
ユイ: 小さな灯火音
スズ: 鈴の余韻
リツ: 細い波形音
セナ: 紙/封筒の音
トモリ: 糸/修理音
ミチル: 水滴
ナギ: 星ピン/紙地図音
```

## 10.3 NG

```txt
毎回派手なSE
読書体験を邪魔する音
宗教/古典引用に軽すぎる音
```

---

# 11. 実装優先順位

## Phase 1: データと表示

```txt
knowledgeLines.ts
characterKnowledgeReplies.ts
morningPoems.ts
LoadingTextRenderer
localStorage seen state
```

## Phase 2: Memory Room MVP

```txt
MemoryRoomScene
カテゴリ/地域/キャラフィルタ
詳細表示
```

## Phase 3: 演出強化

```txt
Ink Bloom
Lantern Reveal
Page Turn
Bell Ripple
Postcard Stamp
```

## Phase 4: 朝明統合

```txt
Stage clear後にMorningPoem表示
黒耀浄化/初回クリア条件
専用BGM/SE
```

## Phase 5: 拡張

```txt
地域別文追加
パロ会話追加
Water Memory / Thread Stitch / Black Glitch
SNS用カード
```

---

# 12. 実装前に削るべきもの

以下は最初から入れすぎない。

```txt
宗教圏の重い解説
カリブ/先住民/ディアスポラの固有儀式名
現代作品パロの強い文
長文ポエム
マニアックすぎる難語
翻訳確認が怪しい古典
```

理由:

```txt
MVPで炎上リスク/品質低下/実装負荷を増やす必要はない。
```

---

# 13. 追加ブラッシュアップ候補

次に詰めるなら、以下。

## 13.1 40件の初期KnowledgeLine確定

```txt
実装投入する最初の40件を完全に決める。
sourceLabel / meaningJa / tags / region / presentationPattern まで固定。
```

## 13.2 60件の初期CharacterReply確定

```txt
S/A/B/C評価をつけ、B以下は作り直す。
```

## 13.3 朝明ポエム英語版

```txt
海外向けに textEn を作る。
ただし日本語の情緒を直訳しない。
```

## 13.4 記録室UIモック

```txt
スマホ縦画面の具体レイアウトを作る。
紙片カード/栞/地図ピンを使う。
```

## 13.5 実装プロンプト化

```txt
Claude Code/Codexに渡す重めプロンプトを作る。
```

---

# 14. 最終方針

```txt
最初から大ボリュームにしない。
少数精鋭で、読めて、刺さって、見返せる状態を作る。
```

この機能の成功条件:

```txt
プレイヤーがロードで一瞬止まる。
意味を読む。
キャラ返信で少し笑う/刺さる。
後で記録室を開く。
そのキャラを少し好きになる。
```
