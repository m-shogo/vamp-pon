# ヨルノシルベ ぽっちゃりCharacter Production Pass v1

Date: 2026-08-10  
Status: **CURRENT VISUAL / ASSET / COMMERCIAL PRODUCTION DIRECTION — RUNTIME MIGRATION DEFERRED**

対象:

- **ハナ** — ぽっちゃり女性 / 年長女性
- **カナメ (`kage1`)** — ぽっちゃり男性 / 若い成人

Source:

- `docs/character-silhouette-diversity-current-canon-v1.md`
- `src/game/data/characterSilhouetteCanon.ts`
- `docs/character-personal-profile-canon-v1.md`
- `src/game/data/characterThemeColors.ts`

---

## 1. なぜ2人とも必要か

体型の多様性を一人へ背負わせない。

```txt
ハナ
= 丸さ / 保存 / 生活 / 年長女性 / 布と紙 / 内側の安心

カナメ
= 横幅 / 守備 / 若い成人男性 / 影と腕帯 / 外周の安心
```

同じ「ぽっちゃり」でも、年齢・性別・姿勢・服・戦闘role・関係・色・星獣まで別にする。

- ハナを「優しい太ったおばあちゃん」一語で終わらせない。
- カナメを「大柄なタンク」一語で終わらせない。
- 体型はCharacter Coreの全部ではない。
- ただし集合絵・sprite・cut-inで細身へ戻してはいけないCurrent visual fact。

---

## 2. ハナ — production contract

### Visual core

**ふっくらした年長女性。**

- 丸い胴、腕、頬を保つ。
- 年齢を消して若い美少女体型へ寄せない。
- 胸・腰だけを誇張するpin-up化もしない。
- 丸いショールと布の重なりで輪郭を作るが、巨大な布で体を隠さない。
- Theme primary: **蘇芳 `#B5495B`**。
- Star Beast: **ふっくらした白鳥**。

### Face / expression

- 年齢線を完全に消さない。
- 笑顔固定にしない。
- 人の物を雑に扱われた時は普通に怒る。
- 保存する人だから穏やか、ではなく「残す価値を判断する意志」が顔に出る。

### Pose language

Good:

- 押し花を本へ挟む。
- 箱から必要な物だけ取り出す。
- 誰かへしおりを返す。
- 立って布包みを結ぶ。
- 座る時に自然に場所を使う。

Avoid:

- 常に食べている。
- お腹を叩く。
- 立ち上がれないギャグ。
- 走ると息切れするギャグ。
- 体が揺れること自体を笑いにする。

### Animation language

**Idle**
- ショール端と押し花が小さく動く。
- 手元で紙を整える。

**Walk**
- 通常歩行速度の印象を体型で遅くしない。
- 上下バウンドを過剰にしない。

**Attack / Skill**
- 花脈 / 頁 / 箱を広げる手の動きを大きく見せる。
- 体重を武器にする攻撃へ寄せない。

**Dodge / reposition**
- 短く実用的な一歩。
- comic roll禁止。

**黒耀化**
- 体型を怪物化の理由にしない。
- 「保存する」が極端化し、変化・手放し・受け渡しを拒む方向で怖くする。

**Dawn**
- 体型は変わらない。
- Happy Endで痩せる / 若返るをrewardにしない。

### Commercial hooks

Low / entry:
- 押し花しおり
- 花脈ステッカー
- 蘇芳色の紙物

Core:
- 白鳥Star Beast
- 丸いショールpatternの布小物
- 花脈の保管箱motif pouch

Premium candidate:
- 押し花 / しおり / 小箱をまとめた生活道具set

禁止:
- 体重ネタ商品
- 食べ物だけの商品ライン
- 「ぽっちゃり」文字を商品名の売りにすること

---

## 3. カナメ — production contract

### Visual core

**横幅のある、がっしり＋柔らかい若い成人男性。**

- 広い肩、厚い胴、太い腕・脚。
- bodybuildingの逆三角形へ置換しない。
- 細身のイケメン体型へ戻さない。
- Theme primary: **蝋色 `#2B2B2B`**。
- Accent: 紅鳶。
- Star Beast: **大きな灰狼**。
- 受け灯の腕帯を強い識別点にする。

### Face / expression

- 無口 = 不機嫌固定にしない。
- 守っている時ほど周囲を細かく見ている。
- 荷物・靴紐・風向きへ先に気づく日常の観察力を表情へ出す。

### Pose language

Good:

- 他人と危険の間に一歩入る。
- 風上へ自然に立つ。
- 荷物を後ろへ寄せる。
- 腕帯側の腕で攻撃線を受ける。
- しゃがんでコヨリ等の目線まで下がれる。

Avoid:

- どすどす歩く。
- 常に汗をかく。
- 大食い。
- 「でかいから鈍い」。
- 体型だけで高HP tank扱い。

### Animation language

**Idle**
- 静かな広いstance。
- 腕帯 / 外套の端が動く。

**Walk**
- 歩幅は大きいが重鈍にしない。

**Intercept**
- 一〜二歩だけ非常に速い。
- 普段静かな人が守る時だけ瞬間的に動くcontrastを作る。

**Close attack**
- 体重突進ではなく、間合い・腕・影の折り目で圧を作る。

**黒耀化**
- 「全部自分が受ければよい」が極端化。
- 体格monster化ではなく、守備範囲と影が過剰に広がり本人の選択肢を塞ぐ。

**Dawn**
- 大柄な体型を維持。
- 「痩せて軽くなる」演出は禁止。
- 誰かに任せるため一歩下がれることを成長として見せる。

### Commercial hooks

Low / entry:
- 受け灯の腕帯rubber band / charm
- 影の折り目emblem
- 蝋色のpaper goods

Core:
- 大きな灰狼Star Beast
- 腕帯 / protection motif cloth goods
- relation goods: ナギ / リツ / クロオリ等、守り方の違いを見せるpair

Premium candidate:
- 受け灯の腕帯replica / wearable accessory

禁止:
- XXL等を笑いにした商品名
- 大食いline
- 「重量級」だけをCharacter identityにするコピー

---

## 4. TOP / ensemble composition

ぽっちゃり体型はCharacter Detail画面だけで守っても意味がない。
集合絵・TOP・季節絵で細身に戻る事故を防ぐ。

### ハナ

- 中央〜内側の灯り近く。
- 座り / 立ち両方で丸い輪郭を残す。
- 小物を配る、押し花を扱うなど他者との生活接点を置く。
- 他人物に半分隠されても「ショールの丸い肩線 + 花 / 箱」で識別可能にする。

### カナメ

- 外周 / 風上 / 背面guard。
- 大きな輪郭で構図のedgeを支える。
- 他人物を小さく見せるためではなく、外から内側へ向く姿勢で守備関係を作る。
- 影・腕帯・灰狼のいずれか最低1つを見せる。

### Ensemble acceptance

- 390x844縮小でハナ / カナメを3秒以内に識別できる。
- 顔を隠してもbody + clothing + objectで区別できる。
- ハナとカナメを同じ丸型silhouetteへしない。

---

## 5. Image generation / art brief rule

生成promptで単に `older woman` / `young man` と書かない。

### Hana required language

```txt
plus-size older woman,
soft round torso and arms,
visible age lines,
rounded shawl,
not slim,
not youthful model proportions,
no food-comedy framing
```

### Kaname required language

```txt
plus-size broad young adult man,
wide shoulders with a thick soft torso,
thick arms and legs,
strong but not bodybuilder-shaped,
not slim,
fast protective intercept posture,
no clumsy or overeating comedy
```

生成後check:

1. 体型がCurrent direction通りか。
2. 正面だけでなく横 / 斜めでも量感が維持されるか。
3. clothingが体型を隠して誤魔化していないか。
4. Character Coreではなく体型だけが目立っていないか。
5. 他のCurrent21と並べた時にsilhouette差が増えているか。

---

## 6. Runtime boundary

このpassは:

```txt
visual canon adopted
!= sprite migrated
!= hitbox changed
!= movement stat changed
!= balance changed
```

体型を理由にruntime parameterを変更しない。

必要な後続:

- final sprite / portrait briefへの反映
- TOP final-art intake checkerへのbody silhouette gate
- runtime spriteを差し替える場合のvisual review
- 390x844 / 430x932 ensemble screenshot review

---

## 7. Commercial boundary

体型の多様性は「特殊枠」ではない。

- Character goodsの服飾系は全体としてinclusive size rangeを検討する。
- ハナ / カナメだけに大きいsizeの商品を紐付けて笑いにしない。
- fan popularityが低くても体型Canonを細身へ変更しない。
- 人気が高くても体型をfetish方向へ誇張しない。

> **売りやすくするために同じ体型へ揃えるのではなく、見た瞬間に誰か分かる差そのものをIP資産にする。**
