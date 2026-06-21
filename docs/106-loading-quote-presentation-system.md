# Loading Quote Presentation System

Vamp Pon / ヴァンサバ改のローディング・ステージ開始に表示する「名言/詩的テキスト」の演出仕様。

この資料は、夜読片のような収集システムではなく、ロード中に一瞬だけ気持ちよく読ませるためのUI/UX仕様。

---

## 1. 目的

ロード画面を、待ち時間ではなく世界観に入る入口にする。

```txt
古典・名言・詩・Vamp Ponオリジナル文を、
短く、静かに、おしゃれに見せる。
```

重視すること:

```txt
読める
飽きない
押し付けない
知識が少し増える
Vamp Ponの夜に合う
キャラやステージの気分に合う
```

やらないこと:

```txt
名言アプリ化しすぎない
コレクション演出にしすぎない
レア演出にしない
SSR名言みたいにしない
長文を読ませない
翻訳を勝手に載せない
```

---

## 2. 表示する文の種類

ロードに出す文は3系統に分ける。

### A. Quote / 原文引用

公有領域・古典・ことわざ候補の原文。
翻訳なし。

例:

```txt
We grow accustomed to the Dark.
```

```txt
Sunt lacrimae rerum.
```

```txt
春はあけぼの。
```

用途:

```txt
通常ロード
ステージ開始前
朝明後のリザルト前
```

### B. Vamp Line / Vamp Ponオリジナル文

Vamp Ponの世界観から作る短文。

例:

```txt
見えないものほど、夜に残る。
```

```txt
小さな灯りは、なくしたものから先に照らす。
```

```txt
明けない夜はない。でも、長い夜はある。
```

用途:

```txt
初回プレイ
日本語で確実に刺したい場面
ステージ開始
PV的な場面
```

### C. Character Line / キャラ連動文

選択キャラに合わせて出す短文。

例:

```txt
帰れない人がいるから、私はまだ帰れない。
```

```txt
飛べることと、軽いことは違う。
```

```txt
私の名前は、私より先に迷子になった。
```

用途:

```txt
キャラ選択後のロード
黒耀前後
朝明後
```

---

## 3. ロード画面の基本レイアウト

スマホ縦持ち 390×844 想定。

```txt
[上部 10%] ほぼ空白。星粒だけ。
[中央 55%] 背景イラスト/暗い紙テクスチャ/小さな灯り。
[下部 25%] quote text + source。
[最下部] loading indicator。
```

### 文字配置

```txt
本文: 画面下から180〜220px付近
出典: 本文の下 12〜18px
ローディング表示: 最下部 32〜48px
```

### 文字サイズ

```txt
日本語本文: 18〜22px
英語/ラテン語本文: 17〜21px
出典: 10〜12px
Loading: 10〜12px
```

### 行数

```txt
本文は最大2行。
引用は長くても3行まで。
1行あたり日本語16〜18字、英語24〜32字程度。
```

---

## 4. 演出トーン

Vamp Ponのロード演出は、派手にしない。

良い:

```txt
紙が少しだけ浮く
文字がインクのように滲んで現れる
星粒が1〜3個だけ流れる
灯りが呼吸するように明滅する
背景がゆっくり0.5〜1.5px動く
```

悪い:

```txt
文字がバンと出る
キラキラしすぎる
SSR演出
派手なSE
画面全体が白く光る
長いタイプライター演出
```

---

## 5. 読む前に消えないルール

ロードが速すぎても、最低限読めるようにする。

```txt
minimumVisibleMs: 2800
recommendedVisibleMs: 3500
longTextVisibleMs: 5000
skipEnableMs: 1200
fadeInMs: 280
fadeOutMs: 350
```

ロード処理が先に終わっても、`minimumVisibleMs` までは画面を維持する。

ただし、2回目以降のテンポも重要なので、タップ/クリックでスキップ可能にする。

```txt
初回表示: 2.8秒保証
2回目以降: 1.2秒後スキップ可能
連続プレイ時: ユーザー操作で即テンポ寄せ
```

---

## 6. 飽きさせないルール

### 重複制御

```txt
直近5件と同じ文は出さない。
同じ作者/同じ出典は2連続で出さない。
同じキャラ文は1プレイ中1回まで。
```

### 状況連動

```txt
初回: Vamp Lineを優先
通常ロード: Quote / Vamp Lineを混ぜる
キャラ選択後: Character Lineを優先
黒耀ゲージが高い: dark / weakness 系を優先
ステージクリア後: morning / star 系を優先
敗北後: lost / memory / retry 系を優先
```

### 比率

```txt
通常時: Quote 40% / Vamp Line 45% / Character Line 15%
初回: Quote 10% / Vamp Line 80% / Character Line 10%
キャラ選択後: Quote 20% / Vamp Line 30% / Character Line 50%
```

---

## 7. 出典の見せ方

引用は知識供給になるので、出典は小さく出す。

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

出典は主張しすぎない。
画面の主役はあくまで夜と灯り。

---

## 8. 星の王子さま系の扱い

星の王子さまは世界観サンプルとして非常に合う。

ただし画面引用はしない。

ロード画面には、Vamp Ponオリジナル文として出す。

```txt
見えないものほど、夜に残る。
```

```txt
小さな星にも、帰れない夜がある。
```

```txt
なくしたあとで、光りはじめるものがある。
```

この3つは、星の王子さま的な「小ささ/見えなさ/孤独」を受け取りつつ、Vamp Ponの言葉にする。

---

## 9. まず使うべきロード文 第一候補

### Quote候補

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

```txt
Music, when soft voices die, vibrates in the memory.
— Percy Bysshe Shelley
```

```txt
春はあけぼの。
— 枕草子
```

```txt
行く川のながれは絶えずして、しかももとの水にあらず。
— 方丈記
```

### Vamp Line候補

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

### Character Line候補

```txt
帰れない人がいるから、私はまだ帰れない。
```

```txt
止まれないのは、前を向いているからじゃない。
```

```txt
星は正しい。でも、人は正しさだけでは帰れない。
```

```txt
私の名前は、私より先に迷子になった。
```

```txt
飛べることと、軽いことは違う。
```

```txt
白紙にも、夜は積もる。
```

---

## 10. UIモックの方向

### Pattern A: Paper Quote

```txt
暗い紙背景
中央に小さな星標器
下部に引用
文字は古紙色
出典は薄く
```

向いている:

```txt
通常ロード
図鑑遷移
ステージ選択から開始
```

### Pattern B: Lantern Breath

```txt
黒い背景
下部にランタンの光
光の中に本文
星粒がゆっくり落ちる
```

向いている:

```txt
ユイ
夜ステージ
初回ロード
```

### Pattern C: Stage Card

```txt
ステージ名を大きく表示
その下に短文
背景にステージシルエット
2.8秒で自然に開始
```

例:

```txt
Stage 1 / 忘れ物の路地

夜は、忘れ物で濃くなる。
```

向いている:

```txt
ステージ開始
PVっぽい演出
```

---

## 11. 実装データ案

```ts
export type LoadingQuoteKind = 'quote' | 'vamp' | 'character';

export type LoadingQuote = {
  id: string;
  kind: LoadingQuoteKind;
  text: string;
  source?: string;
  characterId?: string;
  tags: Array<
    | 'night'
    | 'star'
    | 'light'
    | 'morning'
    | 'memory'
    | 'lost-item'
    | 'road'
    | 'black'
    | 'weakness'
  >;
  minVisibleMs: number;
  commercialRisk: 'safe-candidate' | 'original' | 'check-before-commercial' | 'do-not-display';
};
```

実装では `commercialRisk === 'do-not-display'` は絶対に出さない。

---

## 12. 実装指示

1. `src/data/loadingQuotes.ts` を作る。
2. Quote / Vamp Line / Character Lineを最低30件入れる。
3. ロード画面で `LoadingQuote` をランダム表示する。
4. 直近5件の重複を避ける。
5. 選択キャラがいる場合は `characterId` 一致を優先する。
6. `minimumVisibleMs` を守る。
7. 出典は小さく表示する。
8. 危険な引用・現代作品はデータに入れない。

---

## 13. 最終方針

Vamp Ponのロード画面は、重い収集要素ではなく、静かな名言アプリのように気持ちよく見せる。

ただし、名言アプリそのものにはしない。

```txt
本物の言葉で少し知識が増える。
Vamp Ponの言葉で少し夜が近くなる。
キャラの言葉で少し刺さる。
```

このバランスを守る。
