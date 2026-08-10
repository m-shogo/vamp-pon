# ヨルノシルベ — Multi-Attribute / Star Beast Combat Source v1

Date: 2026-08-11  
Status: **CONTENT SOURCE / Current star-beast facts preserved / Future cast remains Candidate**

---

# 1. 属性の決め方

属性は「赤い人=火」のような見た目都合で決めない。

```txt
人物の生き方
+ 星獣との関係
+ Named Object / 武器素材
+ その人が夜で何を守るか
+ 黒耀化で何が偏るか
+ Gameplay identity
↓
1〜3属性
```

星獣も「星座に対応した元素」を機械的に配る装置ではない。

同じ獅子系でも:

- ユイ = MEMORY + LIGHT。散った灯りと記憶を集める子獅子。
- トモリ = FIRE + METAL。煤け、傷つき、修理されながら火を継ぐ若獅子。

同じ犬系でも:

- リツ = 守る大犬
- コヨリ = 呼び戻す小犬
- レン = 小さな差へ先に反応するこいぬ

として別個体・別Mechanicにする。

---

# 2. 1 / 2 / 3属性

## 1属性

専門家。

- 初見で理解しやすい
- 属性特化装備の恩恵が大きい
- 苦手面では武器やItemの補完価値が高い

Current例:

- アサ = WIND
- セン = EARTH
- ネム = DREAM
- レン = LIGHT

Future Candidate例:

- トウマ = METAL
- ヨモ = DARK
- イオ = BLANK

## 2属性

標準。

- 人物の核と技術を2方向で表せる
- 属性相性が交差する
- Fusion / Reactionへ自然に入れる

Current21の多くはここ。

## 3属性

少数。

Base Current21では乱用しない。

主な使用先:

- Series2/3の複雑人物
- Elite / Boss
- Awakening
- Fusion

Future Candidate例:

- クロエ = DREAM + DARK + MEMORY
  - 長寿
  - 別れを止めたい夢
  - 夜へ留めたい闇
  - 積み重なった記憶
- ノア = METAL + MEMORY + BLANK
  - 人工body
  - 同一snapshot
  - 別の現在を書ける余白
- ルム = THUNDER + METAL + MEMORY
  - network
  - 機体
  - shared memoryから生まれるprivate self

**4属性以上は禁止。**

---

# 3. 攻撃側多属性

多属性武器は万能化させない。

```txt
1属性: 100%
2属性: 50/50 が基本
3属性: 50/30/20 が基本
```

固有武器だけ70/30等の例外可。

各damage shareを敵の1〜3防御属性に別計算し、最後に合算する。

つまり:

> 2属性武器だから、二つの有利倍率を丸ごと掛けて無料で強くなる

は禁止。

---

# 4. 防御側多属性

敵は1〜3属性を持てる。

防御側は複数属性の相性が重なる。

例:

```txt
FIRE attack
vs BLOOM + WATER
```

- BLOOMには強い
- WATERには弱い

ので、単純な「火弱点」ではなく相殺に近づく。

これによりEnemyの2属性/3属性は、弱点を減らすだけではなく**攻略の読み**になる。

完全無効は原則作らない。

---

# 5. 相性表示

UI表現候補:

- 効果抜群
- 有効
- 等倍
- いまひとつ
- 強い耐性

数値目安:

```txt
SUPER_EFFECTIVE 1.25
EFFECTIVE       1.12
NEUTRAL         1.00
RESISTED        0.85
STRONG_RESIST   0.72
```

複合防御計算後も最終Clamp:

```txt
max 1.45
min 0.72
```

好きなキャラが完全に出禁になる相性にはしない。

---

# 6. Attribute effectiveness と Reaction は別

例:

WATER攻撃がFIRE敵に効果抜群

と、

SOAK状態へTHUNDERを当てて水雷連鎖

は別system。

前者:

> 何を持っていくか

後者:

> どう組み合わせるか

を考えさせる。

---

# 7. ユイ — Strong protagonist rule

ユイを「初心者向けだから弱い平均型」にはしない。

主人公として**明確に強い**。

```txt
Intrinsic: MEMORY + LIGHT
Primary mastery: 1.16
Secondary mastery: 1.08
標準値より上
```

さらに:

- MARKED targetからReactionへ入りやすい
- runで最初に拾った自属性外武器1系統へ小Mastery
- Star Beast 子獅子が散った灯りをまとめる

という**build conductor**能力を持つ。

ただし:

- 全属性強化
- 全status耐性
- 全武器最強

にはしない。

専門家は専門領域でユイを上回る。

例:

- アサは純WIND速度buildで上
- ナギはICE/BLANK controlで上
- トモリはFIRE/METAL設置戦で上
- ミチルはSTAR遠距離誘導で上

ユイは「何でも一番」ではなく、**どんな拾い方をしても強い形へまとめやすい主人公**。

---

# 8. 星獣と黒耀化

星獣属性は人格判定機ではない。

黒耀化でもStar Beastが悪い姿になる、という単純構造は避ける。

候補:

- Star Beastが本人の偏りへ距離を取る
- 逆に近くに残る
- 同じ星獣でも通常と黒耀化で使うattribute orderが変わる
- Series3で「星獣は属性を付与しているのか、元からあるものを読んでいるのか」を伏線にする

この問いは1/2攻略には未回答でもよい。

---

# 9. Series2 / 3での多属性の意味

Series2:

- 長寿者
- Robot
- 双子
- 師弟
- 老い

など、単純な一要素で説明できない人物から3属性を解禁する。

Series3:

> なぜ一人が複数の夜属性を持てるのか

をMain Mysteryへ薄く接続できる。

ただし「3属性=選ばれた人」「1属性=格下」には絶対にしない。

1属性は**純度/専門性**、3属性は**複雑さ/交差**であり、強さtierではない。
