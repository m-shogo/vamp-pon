# ヨルノシルベ — 灯紋 Simple Sigil Canon v2

Date: 2026-08-10  
Status: **CURRENT VISUAL / IP DESIGN CANON — MASTER VECTOR SHAPES NOT YET DRAWN**

> キャラクターの灯紋は、家紋・盾・動物絵・持ち物アイコンを豪華に描いたものではない。
> **人物の「選び方の癖」を、数本の線・点・空白へ圧縮した抽象記号**として設計する。
>
> 目標は「一瞬で覚えられる」「一色で成立する」「グッズへ無限に転用できる」「ゲーム内で小さくても読める」。
>
> 参考にするのは“単純な抽象紋章が人物や力を象徴する”という設計思想だけであり、既存作品の具体的な紋章形状・線構成・配置は模倣しない。

---

## 0. 採用語

| 用途 | 採用語 |
| --- | --- |
| Character固有の抽象記号 | **灯紋（とうもん）** |
| 未解放 | 無紋 |
| 通常 | 灯紋 |
| 暁灯 / 暁開き後 | 暁紋 |
| 黒耀化中 | 黒紋 |
| 2人の灯合わせ | 双灯紋 |
| 物へ付く所有・履歴用の小さな印 | 履歴刻（りれきこく） |
| 夜の駅・路線側の共通記号 | 夜路印（やろいん） |

`灯紋具` は既存名称を維持できるが、灯紋そのものとは別物。

---

# 1. 灯紋とは何か

灯紋は人物を職業・血筋・善悪へ分類する家紋ではない。

```txt
灯紋
= その人物が何を大切にするか
+ 迷った時にどちらへ動くか
+ 何を開け、何を残し、何を渡すか
を最小限の線へ圧縮した visual identity
```

### In-world presentation rule

- 作中では「その人の選び方が残した印」として扱える。
- 生まれつき身体に刻まれた魔法タトゥーとはLOCKしない。
- 血統証明ではない。
- 星座占い記号ではない。
- 星獣そのものの姿でもない。
- Named Objectそのものの絵でもない。
- Nightの起源や万能システム説明の証拠には使わない。

**正確な発生原理はMain Mysteryへ勝手に追加しない。**

---

# 2. 最重要造形ルール

## 2.1 Primitive budget

1灯紋につき原則:

- dominant stroke: **1本**
- secondary stroke: **0〜2本**
- detached node / 点: **0〜2個**
- intentional gap / 切れ目: **最低1箇所**
- enclosed region / 完全に閉じた領域: **最大1**、できれば0

**線を増やして個性を出さない。意味の違いで個性を出す。**

## 2.2 禁止

灯紋本体には入れない:

- shield / 盾
- crown / 王冠
- laurel / 月桂冠
- 翼を左右対称に広げた豪華装飾
- literal animal silhouette
- literal weapon silhouette
- literal lantern drawing
- literal flower drawing
- constellation glyph
- zodiac glyph
- alphabet / initial
- Japanese kanji
- number
- frame / badge border
- tiny decorative stars
- unnecessary symmetry

### 理由

灯紋本体を飾り始めると、

```txt
キャラ記号
→ 豪華な紋章カード
→ どれも盾・金縁・星
→ 小サイズで潰れる
→ 商品ごとに描き直す
```

となり、IP assetとして弱くなる。

---

# 3. 形の文法

全灯紋は次の4概念から作る。

## A. LINE — 選択

人物が動く方向。

- straight = 決める
- curve = 受け止めながら変える
- broken = 継ぐ / 保留する
- return hook = 戻す / 戻れる

## B. GAP — 余白

ヨルノシルベらしさの中心。

**全灯紋に最低1つ、閉じ切らない場所を残す。**

意味:

- 答えを一つに固定しない
- 誰かが後から選び直せる
- まだ渡さないことも選べる
- 朝へ戻れる

## C. NODE — 人 / 物 / 約束

小さな点。

- 0 = 自分の中で完結する形
- 1 = 一つの相手 / 焦点 / 物
- 2 = 分ける / 関係 / 往復

3点以上は基本禁止。

## D. SCAR — 黒耀化で歪む場所

通常灯紋には見えない設計上の弱点。

- どの線が「長所の過剰」になりやすいかを1箇所だけ指定する。
- 黒紋で全体を禍々しく作り直さない。

---

# 4. サイズ / 商品適性

灯紋のMasterはvector前提。

### Internal design targets

- 16px UIで人物差が読める
- 24px UIで線構造が明瞭
- 12〜15mm程度の刺繍でも大意が残る
- 小型メタルチャームで抜き形にできる
- 箔押し1版で成立
- emboss / deboss 1色で成立
- laser engravingで成立

実製造時の最小線幅・最小gapは各vendor仕様を優先する。

### Color

灯紋Master自体は**1色**。

Character Theme HEXは商品・UI側で着色するが、形を読むために色へ依存しない。

---

# 5. Phase rules

## 無紋

- dominant strokeの一部だけ。
- Character固有形を完全には読ませない。

## 通常灯紋

- canonical base geometry。
- 2〜4 stroke groups程度。

## 暁紋

新しい羽・星・王冠を足さない。

**変更は1操作だけ。**

例:
- 切れていた線を一箇所だけつなぐ
- nodeを一つ外へ動かす
- inward hookをoutwardへ開く
- 行き止まりだった線を少し延長する

意味は「強くなった」ではなく**選び直せるようになった**。

## 黒紋

新しい悪魔装飾を足さない。

**その人の長所を示す1本だけが過剰になる。**

例:
- 開いていたgapを無理に閉じる
- lineがnodeを囲い込む
- return hookが自分へ巻き込みすぎる
- measurement tickが線を切断する

形の80%以上は通常灯紋と同一。

## 双灯紋

2人の灯紋を完全合体ロゴへしない。

```txt
Aの灯紋 + Bの灯紋
→ 1個のshared node / shared gapだけ共有
→ 両方の原型が読める
```

恋愛専用ではない。

buddy / siblings / ideological mirror / mentor / trust / handoffにも使用する。

---

# 6. Current21 灯紋設計

> **ここでLOCKするのは意味・stroke grammar・特徴。最終Bezier/path座標は未LOCK。**
> Art Directorが後でvector化しても、この不変条件を守る。

---

## 01 ユイ — 帰火の灯紋

**Core verb:** 戻す / 相手へ向ける

```txt
縦の主線
→ 上部で内側へ戻る短いhook
→ hookの先と少し離れた1点
```

- dominant: 下から上へ伸びる1本
- signature: inward return hook
- node: 1
- gap: hookとnodeの間
- Named Object echo: 持ち主待ちのランタンの「返す」
- Star Beast echo: Leo。動物絵は入れず、少し前へ張る弧だけで気配を残す。
- Dawn: hookがnodeを囲わず、外へ開く
- Kokuyou scar: hookがnodeを抱え込むほど巻く
- Merch strength: **S** — 縦長 / 丸チャーム / 小ピンすべて強い

**絶対禁止:** ランタンそのもの、獅子顔、炎アイコン。

---

## 02 アサ — 結名の灯紋

**Core verb:** 聞く / 書く / 結ぶ

```txt
斜め主線
+ 逆斜めの短線
ただし交点は接触させず、小さなgapを残す
+ 上側に1点
```

- signature: 「結ぶ直前」の非接触交差
- node: 1
- gap: crossing center
- Named Object echo: 名結びの小鋏
- Star Beast echo: Ariesの前へ出る勢いを主線の上向きで表す
- Dawn: 2線が交差するのではなく、同じ方向へ並ぶ
- Kokuyou scar: gapが消え、一方が他方を固定する
- Merch strength: **S** — 箔押し / 小さなタグに強い

**意味:** 名前を結ぶが、本人の許可なしに縛らない。

---

## 03 ナギ — 守間の灯紋

**Core verb:** 閉じる / 守る / 開ける時を決める

```txt
左右から向かい合う2つの短いchevron
中央に1点
上下は完全に閉じない
```

- signature: protected center without enclosure
- node: 1
- gap: top / bottom
- Named Object echo: 月箱の銀鍵
- Star Beast echo: Cancerの「挟む」を抽象化。ただし蟹爪は描かない。
- Dawn: 片側chevronが一歩外へ開く
- Kokuyou scar: 2chevronが中央nodeを完全に囲む
- Merch strength: **S** — 左右対称に近く、刻印向き

---

## 04 ミチル — 帰針の灯紋

**Core verb:** 道を探す / 帰路を作る

```txt
長い斜めline
+ lineを横切らず支える浅いopen arc
+ lineの延長上から少し外れた1点
```

- signature: needle that does not point exactly at the node
- node: 1
- gap: arc opening
- Named Object echo: 帰り針のコンパス
- Star Beast echo: Ursa Minor / 北天の案内性。星図は描かない。
- Dawn: lineがnodeへ直進せず、nodeの横へ帰路を作る
- Kokuyou scar: lineがnodeだけを唯一の正解として貫く
- Merch strength: **S** — アクセサリー / 路線グラフィックへ展開しやすい

---

## 05 トモリ — 継火の灯紋

**Core verb:** 直す / 傷を残して継ぐ

```txt
上下に切れた1本の縦線
+ 切れ目を斜めに渡す短いstitch line
+ 上端に小さな1点
```

- signature: repaired break
- node: 1
- gap: 主線の断裂
- Named Object echo: 継火の修理ランプ
- Star Beast echo: Leo。ユイと同じくdetached light-nodeを1個持つが、形は共有しない。
- Dawn: stitchが増えるのではなく、切れ目が少し狭くなる
- Kokuyou scar: stitchが断裂部を締めすぎて主線を曲げる
- Merch strength: **S** — 刺繍 / 縫い目 / repair motifとの相性が非常に高い

**Yuiとの共有ルール:** Leo重複の視覚伏線として「離れた1点」の寸法familyだけ共有可。関係の真相を形だけで確定しない。

---

## 06 セン — 問枝の灯紋

**Core verb:** 説明する / 問いを残す

```txt
短いstem
→ 上下2方向へ非対称にbranch
→ 片方だけ1点
```

- signature: one answered / one open branch
- node: 1
- gap: nodeのないbranch end
- Named Object echo: 白線のチョーク灯
- Star Beast echo: Corvus。くちばしや翼は描かない。
- Dawn: nodeのない枝がさらに伸びるが点は付けない
- Kokuyou scar: 2枝が同じ方向へ固定される
- Merch strength: **A** — 学用品 / ノート / routing UIに強い

---

## 07 リツ — 半灯の灯紋

**Core verb:** 分ける / 任せる

```txt
左右に離れた2つのmirror arc
+ 内側に2つの小node
中央は空ける
```

- signature: two equal halves that do not fuse
- node: 2
- gap: center
- Named Object echo: 半灯りの飴缶
- Star Beast echo: Canes Venatici / 大きい猟犬。犬は描かない。
- Dawn: 左右arcが同じ明るさ / 同じ太さになる想定
- Kokuyou scar: 片側arcだけが中央を越えて侵入する
- Merch strength: **S** — 2-piece goodsの核

---

## 08 コヨリ — 細縒の灯紋

**Core verb:** 小さなものを繋ぐ / 助ける

```txt
細いS-curve 1本
+ 中央付近に短いparallel tick
+ 下端近くに1点
```

- signature: paper-twist movement
- node: 1
- gap: S先端とnode
- Named Object echo: 呼び名の紙縒り札
- Star Beast echo: Canes Venatici / 小さい猟犬。
- Dawn: nodeが少し外側へ移動し、自分で動く余白を増やす
- Kokuyou scar: S-curveがnodeへ何重にも巻く印象にしない。1回だけ強く内側へ寄る。
- Merch strength: **S** — 細長いチャーム / 子ども向けsmall goodsにも強い

**Ritsuとの兄妹rule:** central gapの向きと2者間距離の基準だけ共有。図形自体は似せすぎない。

---

## 09 ゲン — 古針の灯紋

**Core verb:** 経験を渡す / 古い道を残す

```txt
少し傾いた長いline
+ lineの途中を包むopen U-arc
+ 後方へ短いtick
```

- signature: old needle passing through history
- node: 0
- gap: U-arc top
- Named Object echo: 古針の駅灯
- Star Beast echo: Ursa Majorの大きな安定感を低い重心で表す
- Dawn: long lineが少しだけ前へ抜ける
- Kokuyou scar: U-arcがlineを固定して動けなくする
- Merch strength: **A** — 真鍮刻印 / 文房具 / leather goodsに強い

---

## 10 ハナ — 留花の灯紋

**Core verb:** 保存する / 分からないものも残す

```txt
広いrounded U-arc
+ 左右から内側へ向く2つの短いvein line
中央は接触させない
```

- signature: soft container without lid
- node: 0
- gap: top / center
- Named Object echo: 花脈の保管箱
- Star Beast echo: Cygnus。白鳥の首や羽をliteralに描かない。
- Dawn: inward linesが外へ少し向く
- Kokuyou scar: U-arc上部が閉じて「保存=閉じ込める」になる
- Merch strength: **S** — 布 / 刺繍 / 箔 / 箱のワンポイントに強い

**Body rule:** ぽっちゃり体型の記号化として丸くするのではない。rounded geometryは「保存の器」の意味。

---

## 11 ユウビ — 待封の灯紋

**Core verb:** 渡す / 今は渡さない / 返事を待つ

```txt
斜めのlong line
→ 1点の手前で止まる
+ nodeの反対側に短いfollow-up line
```

- signature: delayed delivery gap
- node: 1
- gap: long lineとnode
- Named Object echo: 返事待ちの郵便灯
- Star Beast echo: Columba。鳩アイコンは禁止。
- Dawn: follow-up lineが伸び、往復の存在が読める
- Kokuyou scar: long lineがnodeを突き抜ける = 相手の時を待たない
- Merch strength: **S** — 封筒 / 切符 / postal graphicへ強い

---

## 12 マドカ — 遠点の灯紋

**Core verb:** 観る / 差に気づく / 不完全でも伝える

```txt
open C-arc
+ opening付近のoff-center node
+ arc外側へ接する短いtangent line
```

- signature: focus outside center
- node: 1
- gap: C opening
- Named Object echo: 見送り窓の観測レンズ
- Star Beast echo: Aquila。鷲の翼は描かない。
- Dawn: nodeがCの外へ出る
- Kokuyou scar: Cがnodeを中心へ強制する
- Merch strength: **S** — lens / transparent goods / camera-like framingに強い

---

## 13 シロ — 余頁の灯紋

**Core verb:** 分からないまま残す / 分類しない

```txt
長短2本のparallel vertical line
+ 短いlineの外側に1点
```

- signature: margin + out-of-category point
- node: 1
- gap: 2本のline間
- Named Object echo: 未分類の白栞灯
- Star Beast echo: Lynx。目や猫耳を描かない。
- Dawn: short lineが伸びるがlong lineと揃えない
- Kokuyou scar: 2本が1本へ重なり、分類を一つに潰す
- Merch strength: **S** — しおり / book spine / index tabに極めて強い

---

## 14 トバリ — 往還の灯紋

**Core verb:** 通す / 帰れる門を空ける

```txt
open inverted-U 1本
+ 下から入り、内側で折り返すsingle route line
+ return endに1点
```

- signature: gate with visible return
- node: 1
- gap: gate bottom
- Named Object echo: 往復穴の改札鋏
- Star Beast echo: Canis Major。番犬の姿は禁止。
- Dawn: return lineが門の外へ出る
- Kokuyou scar: gate bottomが閉じ、routeが片道になる
- Merch strength: **S** — 駅印 / ticket / travel goodsの中心

---

## 15 ネム — 夢波の灯紋

**Core verb:** 夢を持ち帰る / 起きて決める

```txt
上下にずれた浅いwave arc 2本
+ 2本の間に1点
```

- signature: suspended point between two surfaces
- node: 1
- gap: wave ends
- Named Object echo: 夢頁の水面日記
- Star Beast echo: Delphinus。イルカ形は禁止。
- Dawn: nodeが上側waveを抜ける
- Kokuyou scar: waveがnodeを完全に挟む
- Merch strength: **S** — fabric pattern / sleep goods / audio jacketにも強い

---

## 16 クロオリ — 留折の灯紋

**Core verb:** 預かる / 本人の時まで開かない

```txt
1本のangular lineを3回だけ折る
open diamondに近いが完全には閉じない
内側のnotch近くに1点
```

- signature: almost-folded enclosure with consent gap
- node: 1
- gap: diamond closing point
- Named Object echo: 折り目だけ光る黒紙
- Star Beast echo: Chamaeleon。動物シルエットは禁止。
- Dawn: outer foldが開き、nodeが見える側へ出る
- Kokuyou scar: final gapが閉じ、本人の意思より「保管」を優先する
- Merch strength: **S+** — 最もlogo-like。黒1色 / 箔 / seal / folding goodsに非常に強い

---

## 17 カナメ — 受線の灯紋

**Core verb:** 守る / 受ける / 必要な時だけ一歩出る

```txt
外から入るshort diagonal line
+ その手前を受け止めるwide angle-bracket
+ bracket内側に1点
```

- signature: intercept before impact
- node: 1
- gap: bracket opening
- Named Object echo: 受け灯の腕帯
- Star Beast echo: Lupus。狼頭は禁止。
- Dawn: bracketが少し横へずれ、nodeへ自力の出口を作る
- Kokuyou scar: bracketがnodeとincoming lineを全部抱え込む
- Merch strength: **S** — 腕帯 / sport-like geometry / patchへ強い

**Body rule:** 大きい体格を「太い線」に置換しない。線幅は全Character共通。

---

## 18 カスミ — 残霞の灯紋

**Core verb:** ぼかす / 戻せる痕跡を残す

```txt
方向の違うopen arc 2本
片方は途中で一度だけ切れる
切れ目の近くに1点
```

- signature: reversible trace
- node: 1
- gap: broken arc
- Named Object echo: 消し跡の白灯
- Star Beast echo: Vulpecula。狐尾は禁止。
- Dawn: broken arcの片側が外へずれる = 消す/戻す選択が見える
- Kokuyou scar: 2arcが重なり、痕跡を完全に隠す
- Merch strength: **A** — transparent print / tracing paperに強い

---

## 19 トキ — 星尺の灯紋

**Core verb:** 測る / 測定外を残す

```txt
acute angle 1組
+ 片側lineの途中に短いcalibration tick
+ vertexから少し離れた1点
```

- signature: measurable angle with unmeasured point
- node: 1
- gap: vertex-node
- Named Object echo: 星目盛りの夜定規
- Star Beast echo: Grus。鶴・翼は描かない。
- Dawn: tickが消えるのではなく、node側に2本目の短いmeasure lineが出る
- Kokuyou scar: tickが長くなり主線を切断する
- Merch strength: **S** — 定規 / metal / technical stationeryへ極めて強い

---

## 20 ツムギ — 継間の灯紋

**Core verb:** 縫う / 傷を残して直す / 最後を空ける

```txt
左右に離れたcurve 2本
+ gapを完全に塞がず跨ぐshort stitch 1本
```

- signature: repaired gap kept visible
- node: 0
- gap: center
- Named Object echo: 余白を縫う糸巻き
- Star Beast echo: Lepus。兎耳は禁止。
- Dawn: stitchがgap中央から少し外へ移動し、空白が戻る
- Kokuyou scar: stitchが長くなって2curveを固定する
- Merch strength: **S+** — embroidery / seam / fashion goodsに非常に強い

**Tomoriとの差:** Tomori = broken one lineを継ぐ。Tsumugi = two separate surfacesの間を縫う。

---

## 21 レン — 片焦の灯紋

Status: **OFFICIAL RESERVE / VISUAL IDENTITY DEFINED, CURRENT20 PRODUCTION NOT AUTO-OPENED**

**Core verb:** 差分を見る / 一点へ焦点を合わせる

```txt
parallel crescent 2本
+ inner crescentから外れた位置に1点
```

- signature: focus that is intentionally off-center
- node: 1
- gap: crescents opening
- Named Object echo: 片焦点のレンズ灯
- Star Beast echo: Canis Minor。観察犬そのものは描かない。
- Dawn: 2crescentの間隔が広がり、周辺を見る余白を増やす
- Kokuyou scar: crescentsがnodeだけへ狭まり、他の差を捨てる
- Merch strength: **A candidate**

**Reserve rule:** 灯紋設定の存在はPlayable / Current20 / 商品発売承認を意味しない。

---

# 7. Current21 visual uniqueness matrix

| Character | Dominant family | Node | Primary gap | Main asymmetry |
| --- | --- | ---: | --- | --- |
| ユイ | stem + return hook | 1 | hook end | inward return |
| アサ | non-touching cross | 1 | crossing | upper rise |
| ナギ | opposed chevrons | 1 | vertical | protected center |
| ミチル | needle + arc | 1 | arc | off-target point |
| トモリ | broken stem + stitch | 1 | stem break | repair offset |
| セン | branch | 1 | unanswered end | uneven fork |
| リツ | mirror arcs | 2 | center | two equal halves |
| コヨリ | S curve | 1 | tail | tiny parallel tick |
| ゲン | needle + U arc | 0 | U top | backward tick |
| ハナ | rounded U + veins | 0 | top | soft open vessel |
| ユウビ | delayed diagonal | 1 | before node | after-line |
| マドカ | C arc + tangent | 1 | C opening | off-center focus |
| シロ | parallel margins | 1 | between lines | outside node |
| トバリ | gate + return path | 1 | gate bottom | foldback route |
| ネム | two waves | 1 | wave ends | suspended node |
| クロオリ | angular fold | 1 | final fold | hidden notch |
| カナメ | intercept bracket | 1 | bracket | incoming stroke |
| カスミ | two open arcs | 1 | broken arc | offset trace |
| トキ | acute angle + tick | 1 | vertex | calibration tick |
| ツムギ | two curves + stitch | 0 | center | off-center stitch |
| レン | parallel crescents | 1 | crescent opening | focal point |

### Collision rule

新しい灯紋を追加する場合、上表の

- dominant family
- node count
- gap orientation
- signature asymmetry

のうち**最低2項目は既存全員と異なる**こと。

---

# 8. 星獣との関係

灯紋に星獣を描かない。

Star Beastは別IP asset。

```txt
Character face
Character 灯紋
Star Beast
Named Object
```

の4つを独立して認識できることが強い。

### Current Star Beast authority

- ユイ — Leo / 子獅子
- アサ — Aries / 若い雄羊
- ナギ — Cancer / 小さな蟹
- ミチル — Ursa Minor / 小熊
- トモリ — Leo / 少し煤けた若獅子
- セン — Corvus / 小烏
- リツ — Canes Venatici / 大きい猟犬
- コヨリ — Canes Venatici / 小さい猟犬
- ゲン — Ursa Major / 大熊
- ハナ — Cygnus / ふっくらした白鳥
- ユウビ — Columba / 小鳩
- マドカ — Aquila / 小鷲
- シロ — Lynx / 山猫
- トバリ — Canis Major / 大きな番犬
- ネム — Delphinus / 小イルカ
- クロオリ — Chamaeleon / 黒紙カメレオン
- カナメ — Lupus / 大きな灰狼
- カスミ — Vulpecula / 淡い小狐
- トキ — Grus / 細身の鶴
- ツムギ — Lepus / 白灰の野兎
- レン — Canis Minor / 小さな観察犬

古い `小鹿 / 燕 / 亀 / 狐 / 蛍 ...` 等を灯紋authorityへ戻さない。

---

# 9. Named Objectとの関係

灯紋はNamed Objectの絵ではない。

ただしObject goodsへ**履歴刻**として小さく入れられる。

Example:

```txt
ユイのランタン replica
→ ランタン本体はObject shape
→ 底面 / タグ / 箱へユイの灯紋
→ 商品説明でCharacterへ戻れる
```

### 履歴刻 rule

- Objectの所有・継承を勝手に変更しない。
- Candidate lineageを商品刻印でCanon化しない。
- 同じObjectが複数人物とCurrent relationを持つ場合のみ、複数灯紋を履歴として並べる。
- 人気だけで所有者の灯紋を追加しない。

---

# 10. 商品への使い方

## 灯紋だけで成立

- metal pin
- enamel pin
- foil sticker
- wax-like seal sticker
- embroidery patch
- woven tag
- key cap / charm
- ring / pendant engraving
- notebook emboss
- phone case one-point
- socks / cuff embroidery
- glass etching

## Character + 灯紋

- acrylic stand base
- profile card reverse
- clear file corner
- portrait mat
- trading card back

## Star Beast + 灯紋

- mascot collar tag
- plush foot embroidery
- small charm pair
- blind-box identifier

## Named Object + 灯紋

- replica underside
- product certificate
- collector box seal
- archival card

---

# 11. 商品グレードで形を変えない

```txt
cheap sticker
premium jewelry
limited replica
```

すべて**同じMaster geometry**を使う。

Premiumだから王冠・羽・外枠を追加するのは禁止。

高級感は:

- material
- size
- engraving depth
- foil
- packaging
- negative space

で出す。

---

# 12. 最終Master vector承認条件

各灯紋の最終vector化時にHuman reviewする。

### 必須

- [ ] 1色で読める
- [ ] 16pxで他Characterと区別できる
- [ ] literal object iconになっていない
- [ ] literal animal iconになっていない
- [ ] letter / numberがない
- [ ] 主要stroke 2〜4程度
- [ ] intentional gapがある
- [ ] Character Core verbを説明できる
- [ ] Named ObjectなしでもCharacterへ戻れる
- [ ] Star BeastなしでもCharacterへ戻れる
- [ ] Dawn changeが1操作で説明できる
- [ ] Kokuyou scarが1箇所で説明できる
- [ ] pin / embroidery / foil / UIへ同一geometryで使える

### Reject

- 「かっこいいけど誰の紋か説明できない」
- 「Characterの顔・動物・武器を縮小しただけ」
- 「星・羽・盾を盛って豪華にしただけ」
- 「小さいと全部同じ円形ロゴ」

---

# 13. 一文

> **灯紋は“キャラクターの絵を描かなくても、その人を思い出せる最小の線”である。**
