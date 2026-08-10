# ヨルノシルベ Current Character Silhouette Diversity Canon v1

Date: 2026-08-10  
Status: **ADOPTED FOR CHARACTER DESIGN / ASSET BRIEFS; RUNTIME VISUAL MIGRATION DEFERRED**

## 目的

現在の20-character canon + official reserve レンの範囲で、体型・年齢感・眼鏡などの見た目の役割を重複なく持たせる。
古い追加候補をむやみに増やさず、今いる人物の輪郭を強くする。

Production source:

- `src/game/data/characterSilhouetteCanon.ts`
- `docs/chubby-character-production-pass-v1.md`
- `docs/character-personal-profile-canon-v1.md`
- `src/game/data/characterThemeColors.ts`

---

## 現在の必須多様性

| 役割 | 正式担当 | 方針 |
| --- | --- | --- |
| ぽっちゃり女性 | **ハナ** | ふっくらした年長女性。丸いショールと押し花。包容力はあるが体型を笑いにしない。 |
| ぽっちゃり男性 | **カナメ** (`kage1`) | 横幅のあるがっしり＋柔らかい体型の若い成人。影側の前衛・風よけ・荷物守り。鈍重ギャグにしない。 |
| 渋い大人男性 | **ゲン** | 初老〜シニア寄りの渋い案内人。古い帽子、使い込んだコンパス、皺、落ち着いた姿勢。老人ギャグにしない。 |
| 若い男性/中性メガネ | **シロ** | 丸メガネ＋白いしおり。記録・灯録・読めない頁。 |
| 観察者メガネ | **レン** | 丸メガネだが片レンズの焦点光でシロと差別化。reserve。 |
| 作業ゴーグル | **トモリ** | 眼鏡枠とは別。修理作業の道具としてゴーグルを使う。 |

---

## ぽっちゃり体型のCurrent contract

### ハナ

```txt
ぽっちゃり女性
+ 年長女性
+ 保存 / 押し花 / 布
+ 内側に安心感を作る丸い輪郭
```

- 丸い胴・腕・頬を保つ。
- 年齢線を消して若いモデル体型へ寄せない。
- 丸いショールを使うが、巨大な服で身体を隠して誤魔化さない。
- 手元の作業は素早く正確。
- 「保存する人」であり、「食べる人」をCharacter Coreにしない。
- Happy Endで痩せる / 若返るをrewardにしない。

### カナメ

```txt
ぽっちゃり男性
+ 若い成人
+ 守る / intercept / 腕帯
+ 外周を支える大きな輪郭
```

- 広い肩、厚い胴、太い腕・脚。
- bodybuilder型へ置換しない。
- 細身のShadow男性へ戻さない。
- 普段は静かだが、守る瞬間だけ一〜二歩を速く詰める。
- 大柄だから鈍い / 遅い / hitboxが大きい、にはしない。
- Happy Endで痩せる / 軽くなるを成長表現にしない。

詳細: `docs/chubby-character-production-pass-v1.md`

---

## デザイン上の固定ルール

- ぽっちゃり体型を食いしん坊・のろま・笑いの記号にしない。
- 体格は当たり判定へ直接連動させない。
- 体型だけを理由にmovement speed / stamina / defense / intelligenceを決めない。
- ハナは「柔らかい保存」、カナメは「大きな影で守る」で役割を分ける。
- ハナとカナメを同じ丸型silhouetteへしない。
- ゲンはコミカルな老人ではなく、古い道を知る渋い案内人。
- シロとレンは同じ丸メガネでも、シロ=頁/記録、レン=焦点/見分けるで輪郭を分ける。
- トモリのゴーグルはfashion眼鏡ではなくrepair actionの道具。
- 集合絵では身長・肩幅・姿勢・髪型・小物で3秒以内に識別できること。

### Body shape affects

- silhouette
- clothing drape
- pose
- animation language
- ensemble composition
- merchandise shape language

### Body shape does NOT affect by default

- hitbox
- movement speed
- stamina
- intelligence
- comic relief status
- moral alignment

---

## Animation rule

### ハナ

- idle: ショール端 / 押し花 / 紙を小さく整える。
- walk: 過剰な上下bounceを入れない。
- skill: 花脈・頁・箱を広げる手の動きを主役にする。
- dodge: 短く実用的。comic roll禁止。
- 黒耀化: 体型ではなく「保存する」が極端化する。

### カナメ

- idle: 広い静かなstance。
- walk: 大きい歩幅だが重鈍にしない。
- intercept: 一〜二歩だけ非常に速い。
- attack: 体重突進ではなく、間合い・腕・影の折り目を使う。
- 黒耀化: 「全部自分が受ける」が極端化し、影の守備範囲が過剰に広がる。

---

## Historical candidateの扱い

以下は過去のデザイン研究として残すが、現在の21人へ自動追加しない。

- マユ: ぽっちゃり女性候補
- ダイチ: ぽっちゃり男性候補
- レンジ: 渋い大人候補

これらの良い設計意図はハナ / カナメ / ゲンへ吸収する。
将来、新キャラとして復活させる場合は名前だけ追加せず、Character Production Contractを全て満たす。

---

## 集合絵 / TOPでの使い方

- ハナ: 座って押し花や小物を分ける。丸い輪郭で灯りの近くに安心感を作る。
- カナメ: 輪の外側または風上に座る / 立つ。荷物・ランタン・仲間を守る大きな輪郭。
- ゲン: 少し離れて古い道や空を眺める。カップやコンパスを持つ。
- シロ: メガネ越しに頁を読む。
- レン: 写真・地図・星空の小さな違いを見つける。
- トモリ: 会話の横で工具やランタンを直す。

### TOP acceptance

- 390x844縮小でハナ / カナメを3秒以内に区別できる。
- 顔を隠してもbody + clothing + Named Objectで識別できる。
- ハナが細身の年長女性になっていない。
- カナメが筋肉質な細腰tankになっていない。
- 体型がギャグposeの理由になっていない。

---

## Image generation rule

画像生成・外部artist briefではbody directionを明示する。

ハナ:

```txt
plus-size older woman,
soft round torso and arms,
visible age lines,
rounded shawl,
not slim,
not youthful model proportions,
no food-comedy framing
```

カナメ:

```txt
plus-size broad young adult man,
wide shoulders with a thick soft torso,
thick arms and legs,
strong but not bodybuilder-shaped,
not slim,
fast protective intercept posture,
no clumsy or overeating comedy
```

Generic promptだけで生成し、モデルdefaultの細身体型へ戻ることを禁止する。

---

## Commercial / goods rule

体型そのものを商品ギャグにしない。

### ハナ

- 押し花しおり
- 丸いショール柄の布小物
- 花脈の保管箱motif
- ふっくらした白鳥Star Beast
- 蘇芳 `#B5495B`

### カナメ

- 受け灯の腕帯
- 影の折り目emblem
- 大きな灰狼Star Beast
- protection motif cloth goods
- 蝋色 `#2B2B2B`

Character apparelはハナ / カナメだけ特殊size扱いにせず、IP全体としてinclusive size rangeを検討する。

禁止:

- 体重数字goods
- XXL等を笑いにした商品名
- 大食い専用line
- 体型をfetish方向へ過剰強調
- 人気を理由に細身へ変更

---

## Data / runtime boundary

Current production data:

- `src/game/data/characterSilhouetteCanon.ts`

この文書 / dataは:

```txt
visual canon adopted
!= runtime sprite migrated
!= hitbox changed
!= movement stat changed
!= balance changed
```

Heavy Designのhuman visual approval前にproduction assetへ昇格しない。

既存runtime spriteを自動差し替えしない。
