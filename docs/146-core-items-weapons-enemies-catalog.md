# Core Items / Weapons / Enemies Catalog

## 目的

Vamp Ponの武器・パッシブ・ピックアップ・敵・ボス・進化を、現行正史とゲーム実装に合わせて整理する。

この文書は、ただのアイデア集ではなく、実装データへ落とせる内容カタログ。

---

# 0. 設計原則

P1では、少なく作る。

```txt
1キャラ
1武器
1敵
1ピックアップ
1分ループ
```

P2以降で増やす。

ただし、今の段階で以下は決めておく。

```txt
武器の役割
パッシブの役割
敵の意味と挙動
小物の裏意味
進化条件
どれがP1で必須か
```

---

# 1. ピックアップアイテム

## 1. 記憶の欠片

```txt
id: memory_fragment
name: 記憶の欠片
category: pickup
P1: 必須
```

表の効果:

```txt
XPを得る
ユイへ吸い込まれる
```

裏の意味:

```txt
黒インクの固定から剥がれた意味片
```

見た目:

```txt
淡く光る小さな紙片
中心だけ白く光る
金色/白/薄い水色
```

実装メモ:

```txt
P1はXPとして扱う
memoryFragmentsCollectedにも加算する
```

---

## 2. 小さな星型の紙片

```txt
id: star_fragment
name: 星型の紙片
category: pickup
P1: 保留
```

表の効果:

```txt
XP多め
```

裏の意味:

```txt
強く剥がれた意味片
```

使い方:

```txt
エリート敵/箱/リザルト報酬で落とす
```

---

## 3. 記憶カプセル

```txt
id: memory_capsule
name: 記憶カプセル
category: pickup
P1: 入れない
P2: 候補
```

表の効果:

```txt
進化/武器強化/通貨報酬
```

裏の意味:

```txt
忘れ物の中に守られていた強い意味
```

注意:

```txt
P1で入れると実装が重い
P2以降でelite_dropとして導入
```

---

## 4. 朝のしずく

```txt
id: morning_drop
name: 朝のしずく
category: pickup
P1: 入れない
```

表の効果:

```txt
HP回復
```

裏の意味:

```txt
朝まで残りかけた意味の余熱
```

使い方:

```txt
回復アイテムとしてP2以降
```

---

# 2. P1武器

## 1. 夜の鉛筆

```txt
id: night_pencil
name: 夜の鉛筆
category: weapon
P1: 必須
```

役割:

```txt
ユイの初期武器
単発直線弾
一番分かりやすい自動攻撃
```

裏の意味:

```txt
誰の意味かを仮に書き留めるための道具
```

見た目:

```txt
短い鉛筆線
薄い白/淡い金色
紙に書くような軌跡
```

レベル案:

```txt
Lv1: 鉛筆線を1本飛ばす
Lv2: ダメージ少し上昇
Lv3: クールダウン短縮
Lv4: 弾速上昇
Lv5: 2本目を追加
Lv6: 貫通+1
Lv7: ダメージ上昇
Lv8: 書き残しの線が一瞬残る
```

タグ:

```txt
projectile
starter
yui
meaning_owner
```

P1実装:

```txt
projectileのみでOK
貫通や残り線は後回し可
```

---

# 3. P2以降の武器候補

## 2. 名前のラベル

```txt
id: name_label
name: 名前のラベル
category: weapon
P1: 入れない
P2: 候補
```

役割:

```txt
敵に印をつける
印がついた敵へ追加ダメージ/ドロップ補正
```

裏の意味:

```txt
持ち主と名前を接続する道具
```

ゲーム効果:

```txt
マーキング
被ダメージ増加
欠片ドロップ増加
```

進化候補:

```txt
消えない名前
```

---

## 3. 月の箱

```txt
id: moon_box
name: 月の箱
category: weapon
P2: 候補
```

役割:

```txt
周囲の欠片を一時保存
一定時間後にまとめて取得/爆発
```

裏の意味:

```txt
読まれると壊れる理由を一時隔離する箱
```

ゲーム効果:

```txt
防御
欠片保存
範囲吸引
遅延発動
```

進化候補:

```txt
月の箱舟
```

---

## 4. 金のコンパス

```txt
id: gold_compass
name: 金のコンパス
category: weapon
P2: 候補
```

役割:

```txt
近い敵/欠片/安全地帯へ線を引く
一定方向へ貫通攻撃
```

裏の意味:

```txt
返すべき場所を読む道具
```

ゲーム効果:

```txt
方向指定補助
誘導弾
安全地帯表示
```

進化候補:

```txt
帰り道のしるし
```

---

## 5. 直されたランタン

```txt
id: repaired_lantern
name: 直されたランタン
category: weapon
P2: 候補
```

役割:

```txt
周囲の影を払う範囲光
瀕死時に一度だけ残り火
```

裏の意味:

```txt
仮接続した意味を朝まで保持する灯り
```

ゲーム効果:

```txt
範囲ダメージ
安全地帯
瀕死救済
```

進化候補:

```txt
朝まで残る灯り
```

---

## 6. 未配達の封筒

```txt
id: undelivered_envelope
name: 未配達の封筒
category: weapon
P2以降
```

役割:

```txt
遅れて敵へ届く追尾弾
着弾が遅いが強い
```

裏の意味:

```txt
届かなかった言葉
届けないことで守られた可能性
```

ゲーム効果:

```txt
遅延追尾弾
上振れ/下振れ向き
```

---

## 7. 片目のボタン

```txt
id: one_eye_button
name: 片目のボタン
category: weapon
P2以降
```

役割:

```txt
身代わり/耐久/反撃
```

裏の意味:

```txt
作られたものにも本当の持ち主がある
```

ゲーム効果:

```txt
被弾時反撃
一度だけダメージ肩代わり
```

---

# 4. パッシブ候補

## 1. 紙片のしおり

```txt
id: paper_bookmark
name: 紙片のしおり
stat: xpMultiplier
P1: 候補
```

効果:

```txt
XP取得量上昇
```

裏意味:

```txt
拾った意味を見失わないためのしおり
```

---

## 2. 小さな磁石

```txt
id: small_magnet
name: 小さな磁石
stat: magnetMultiplier
P1: 候補
```

効果:

```txt
欠片吸引範囲上昇
```

裏意味:

```txt
持ち主へ戻ろうとする力
```

---

## 3. 軽い靴

```txt
id: light_shoes
name: 軽い靴
stat: moveSpeedMultiplier
P1: 候補
```

効果:

```txt
移動速度上昇
```

裏意味:

```txt
夜の道をもう少し長く歩ける
```

---

## 4. 濃いインク避け

```txt
id: ink_ward
name: インクよけの紙
stat: mightMultiplier
P2候補
```

効果:

```txt
攻撃力上昇
```

裏意味:

```txt
固定された誤解に線を入れる紙
```

---

## 5. 乾いた消しゴム

```txt
id: dry_eraser
name: 乾いた消しゴム
stat: cooldownMultiplier
P2候補
```

効果:

```txt
クールダウン短縮
```

裏意味:

```txt
余計な黒いにじみを少しだけ薄める
```

---

# 5. 敵カタログ

## 1. 基本影

```txt
id: ink_shadow
name: 黒インクの影
behavior: chase
P1: 必須
```

意味:

```txt
名前のない不安
固定された誤解の最小単位
```

見た目:

```txt
丸い黒インク
白い小さな目
怖すぎない
スマホでシルエットが読める
```

挙動:

```txt
ユイへまっすぐ寄る
```

---

## 2. 名札影

```txt
id: name_tag_shadow
name: 名札影
behavior: offset_chase
P1.5候補
```

意味:

```txt
名前を呼ばれなかった誤解
```

見た目:

```txt
小さな黒影に白い名札の跡
名札部分だけ空白
```

挙動:

```txt
ユイだけでなく名札Seedへ寄る
名札を踏みそうで踏まない
```

ドロップ:

```txt
memory_fragment多め
```

---

## 3. 箱影

```txt
id: box_shadow
name: 箱影
behavior: slow_chase
P2候補
```

意味:

```txt
閉じ込めた/閉じ込められた誤解
```

見た目:

```txt
角ばった黒影
箱のふたのような輪郭
目が低い位置にある
```

挙動:

```txt
遅いが硬い
箱Seed周辺で強くなる
```

---

## 4. 切符影

```txt
id: ticket_shadow
name: 切符影
behavior: fast
P2候補
```

現在の型にはfastがないため、実装前に EnemyBehavior 追加が必要。

意味:

```txt
帰れなかった誤解
```

挙動:

```txt
直線突進
時々逆走
```

足りない実装:

```txt
EnemyBehaviorに dash / line_charge を追加
```

---

## 5. ランタン影

```txt
id: lantern_shadow
name: ランタン影
behavior: offset_chase
P2候補
```

意味:

```txt
自分だけが待っていた誤解
```

挙動:

```txt
灯りを避ける
暗がりから湧く
ランタン範囲で鈍る
```

足りない実装:

```txt
lightRadius / avoidLight 的な挙動
```

---

## 6. 紙くず影

```txt
id: scrap_shadow
name: 紙くず影
behavior: swarm_chase
P2候補
```

意味:

```txt
細かく破れた誤解
```

挙動:

```txt
群れで来る
HP低め
数で圧迫する
```

---

## 7. 黒ラベルの強敵

```txt
id: black_label_elite
name: 黒ラベルの強敵
behavior: elite_chase
P2候補
```

意味:

```txt
強く固定された誤解
```

挙動:

```txt
硬い
倒すとmemory_capsuleを落とす可能性
```

---

# 6. ボス候補

## Page 1 Boss: 名前のない影

```txt
id: unnamed_shadow_boss
name: 名前のない影
P2以降
```

意味:

```txt
誰のものか分からなくなった意味の集合
```

挙動:

```txt
基本影を呼ぶ
欠片を吸い寄せる
一定時間ごとに画面を少し暗くする
```

回収:

```txt
倒すと、空白の名札Seedが開く
```

---

## Page 2 Boss: 白い名札の影

```txt
id: blank_name_boss
name: 白い名札の影
P2以降
```

意味:

```txt
名前を呼ばれなかった誤解の固定
```

挙動:

```txt
名前のラベルを剥がす
印のついていない敵を強化する
```

---

# 7. 進化候補

## 夜の鉛筆 + 紙片のしおり

```txt
id: night_pencil_to_unfading_line
name: 消えない線
fromWeaponId: night_pencil
requiredPassiveId: paper_bookmark
```

効果:

```txt
鉛筆弾が通った後に短い線が残り、後続の敵へ小ダメージ
```

意味:

```txt
仮に書いた意味が、少しだけ朝まで残る
```

---

## 名前のラベル + 小さな磁石

```txt
id: name_label_to_unfading_name
name: 消えない名前
fromWeaponId: name_label
requiredPassiveId: small_magnet
```

効果:

```txt
印をつけた敵から欠片が引き寄せられる
```

意味:

```txt
名前と持ち主の接続が安定する
```

---

## 月の箱 + 紙片のしおり

```txt
id: moon_box_to_moon_ark
name: 月の箱舟
fromWeaponId: moon_box
requiredPassiveId: paper_bookmark
```

効果:

```txt
一定範囲の欠片を保存し、被弾時に一部回復/爆発
```

意味:

```txt
壊れる理由を、朝まで運ぶ箱
```

---

## ランタン + インクよけの紙

```txt
id: repaired_lantern_to_until_morning_light
name: 朝まで残る灯り
fromWeaponId: repaired_lantern
requiredPassiveId: ink_ward
```

効果:

```txt
範囲光が周期的に広がる
瀕死時に一度だけ残り火が発動
```

意味:

```txt
仮接続を朝まで保持する
```

---

# 8. 今足りないもの

## 型の不足

現在の `EnemyBehavior` には以下が足りない。

```txt
dash / line_charge
avoid_light
guard_object
orbit_object
```

P1では不要。

P2以降で追加。

---

## データの不足

必要な初期データ:

```txt
weapons.ts
passives.ts
enemies.ts
waves.ts
evolutions.ts
```

P1最小:

```txt
weapons.ts: night_pencil
passives.ts: small_magnet / paper_bookmark / light_shoes
 enemies.ts: ink_shadow
waves.ts: 60秒〜180秒の簡易wave
```

---

## UIの不足

```txt
LevelUpカード
GameOver文
リトライボタン
Fragments表示
夜明けまで表示
```

---

## 敵デザインの不足

```txt
基本影
名札影
箱影
切符影
ランタン影
紙くず影
黒ラベル強敵
```

コンセプト画像置き場:

```txt
assets/concept-design/03_enemies/
```

---

## アイテムデザインの不足

```txt
記憶の欠片
空白の名札
月の箱
片方だけの切符
直されたランタン
未配達の封筒
片目のボタン
```

コンセプト画像置き場:

```txt
assets/concept-design/04_items/
```

---

# 9. 実装順

## P1

```txt
night_pencil
ink_shadow
memory_fragment
small_magnet
paper_bookmark
light_shoes
60〜180秒簡易wave
levelUp 3択
```

## P1.5

```txt
name_tag_shadow
blank_name_tag Seed
リザルト文差分
消えない線 進化
```

## P2

```txt
name_label
moon_box
gold_compass
repaired_lantern
box_shadow
ticket_shadow
lantern_shadow
memory_capsule
進化4種
```

## P3

```txt
きずな
2人選択
不安定コンビ
ボス
ページ束
```

---

# 10. 最重要

武器・敵・アイテムは、ただ種類を増やすために増やさない。

```txt
武器 = 意味をほどく方法
敵 = 固定された誤解の動き
アイテム = 誤解が反転する小物
パッシブ = 夜の読み方を安定させる補助
進化 = 小物の意味が反転して、本来の役割を取り戻すこと
```

この形で増やす。
