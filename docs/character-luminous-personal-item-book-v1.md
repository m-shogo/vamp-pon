# ヨルノシルベ Current21 光る持ち物 Book v1

Date: 2026-07-29  
Status: **CURRENT CHARACTER OBJECT DIRECTION / DISPLAY NAMES REQUIRE HUMAN NAMING REVIEW BEFORE RUNTIME MIGRATION**

> Current21は全員、人物・戦闘・黒耀化・夜明けをつなぐ「光る持ち物」を一つ持つ。
>
> 全員をランタン持ちにせず、光り方そのものを人格にする。

関連:

- `docs/NAMED-OBJECT-CONNECTIONS.md`
- `docs/CHARACTERS.md`
- `docs/character-deep-core-book-v1.md`
- `docs/character-black-youka-rescue-book-v1.md`
- `docs/character-dawn-proof-book-v1.md`
- `src/game/data/characterProductionPlans.ts`
- `src/game/data/reserveCharacterCanon.ts`

---

# 1. Separation rule

```txt
光る持ち物
= Characterを一目で識別する個人object

初期灯具
= battleで最初から使うGameplay equipment

持ち物
= passive item

忘れ物
= rare /暁開きの鍵
```

同じ物が複数roleを兼ねてもよい。
ただし同一objectならlineageへ記録する。

---

# 2. Current21 master table

| Character | 光る持ち物 Working name | 光り方 | Existing item lineage | 主な接続 |
| --- | --- | --- | --- | --- |
| ユイ | **持ち主待ちのランタン** | 中心が呼吸する暖色。持ち主不明の物へ向く | 夜の鉛筆 → 金のコンパス → 誰かの名前札 → 未完成の一行 → 消えない名前 | Stage1 / pickup / クロオリ / 持ち主のない名前 |
| アサ | **名結びの小鋏** | 刃ではなく切った紙端が朝色に光る | 絵はがきカッター → 旅のバッジ → 封のされた手紙 → 暁綴りの紙片 → 暁に結ぶ名 | Stage2 / mark / カスミ / name consent |
| ナギ | **月箱の銀鍵** | 鍵穴へ近づくほど青白い輪が閉じる | 月のしおり → 月明かりのしおり → 小さな銀の鍵 → 封月のしおり → 夜をしまう箱 | Stage3 / seal / カナメ / 閉じた朝箱 |
| ミチル | **帰り針のコンパス** | 正解を指すのでなく複数の薄い方向線を出す | 街灯の輪 → 外れた地図ピン → 折れたコンパス針 → 星図の道糸 → 帰り道の星 | Stage4 / reroute / トキ / 帰路のない夜 |
| トモリ | **継火の修理ランプ** | 直した継ぎ目だけ色の違う点線光になる | 黒インクの小瓶 → 白い余白 → 切れた灯芯 → ほころび灯し → 夜を直す灯 | Stage5 / repair / ツムギ / scar |
| セン | **白線のチョーク灯** | 引いた線が少し遅れて灯り、途中で枝分かれできる | チョークの線 → 小さな黒板消し → 消された一文 → 教室の道筋 → 消えない一文 | Stage6 / teach / シロ / alternate answer |
| リツ | **半灯りの飴缶** | 二つの小灯へ割れ、片方が他者側へ残る | 半分の飴 → 半分の包み紙 → 残った片割れ → 包み紙の火 → 残した半分 | Stage7 / distribute / コヨリ / burden split |
| コヨリ | **呼び名の紙縒り札** | 呼ばれた名の数だけ小さな補助灯が結ばれる | 小さな名札 → 呼び名の紙縒り → 書きかけの名前 → 呼び名の紙縒り → 一番消えない名 | Stage8 / helper / リツ・セン / agency |
| ゲン | **古針の駅灯** | 古い針と今の足元を別色で照らす | 古いコンパス → 駅前の道火 → 錆びた針箱 → 駅前の道火 → 古い道の朝 | Stage9 / old route / ミチル・トキ / recalibration |
| ハナ | **花脈の保管箱** | 押し花の花脈だけが脈打つように淡く灯る | 押し花のしおり → 箱底の花 → 乾いた花びら → 箱底の花 → 枯れない頁 | Stage10 / preserve / ツムギ・シロ / living change |
| ユウビ | **返事待ちの郵便灯** | 投函時でなく受取可能な時に赤い灯が点く | 未配達の封筒 → 古い消印 → 開かない返信 → 遅れて届く火 → 届かなかった返事 | Stage11 / delay / トバリ・カスミ / recipient timing |
| マドカ | **見送り窓の観測レンズ** | 見えた物すべてでなく「伝えるべき差」だけ縁取る | 窓際の紙飛行機 → 曇った窓紙 → 見ていた切れ端 → 見ていた紙翼 → 気づいていた朝 | Stage12 / reveal / レン・ネム / witness action |
| シロ | **未分類の白栞灯** | 未分類の頁へ白い余白光を残し、答えを強制しない | 白いしおり → 未分類の頁 → 読めない一頁 → 未分類の頁 → 読めない頁の灯 | Stage13 / unknown / セン・ツムギ / preserve uncertainty |
| トバリ | **往復穴の改札鋏** | 開いた側と帰る側の二つの切符穴が交互に灯る | 改札ばさみ → 古い切符 → 片道ではない切符 → 改札のひかり → 片道ではない切符 | Stage14 / gate / ユウビ・ナギ / return window |
| ネム | **夢頁の水面日記** | 頁上の文字ではなく水面のような余白が青紫に揺れる | 夢日記 → 眠り頁 → 夢で見た地図 → 眠り頁 → 夢で見た朝 | Stage15 / forecast / トキ・マドカ / dream not command |
| クロオリ | **折り目だけ光る黒紙** | 面は黒いまま、開く可能性のある折り線だけ紫に光る | 黒い折り紙 → 四つ折りの影 → 開かない折り目 → 四つ折りの影 → 開かれる黒紙 | Stage16 / hold / ユイ・ユウビ / opening consent |
| カナメ | **受け灯の腕帯** | 攻撃を受けるたび本人だけでなく守った相手側にも一灯残る | 影の折り目 → 隠し火 → 守りすぎた影 → 隠し火 → 朝まで残った影 | Stage16/3 / intercept / ナギ・リツ / shared burden |
| カスミ | **消し跡の白灯** | 隠した面ではなく、戻せる痕跡だけ薄く残す | 消しゴムのかけら → 薄れ名 → 消せない一文字 → 薄れ名 → 残された一文字 | Stage17/2 / conceal / アサ・ユウビ / chosen visibility |
| トキ | **星目盛りの夜定規** | 数値線の外側に測定不能を示す一つの遊び目盛りが光る | 夜読みの定規 → 角度の火 → 割れた角度線 → 角度の火 → 測れない夜明け | Stage18/4 / measure / ミチル・レン / provisional value |
| ツムギ | **余白を縫う糸巻き** | 縫った線と残した余白の両方を細い金線で示す | 空白のカード → 余白の継ぎ目 → 黒い余白 → 余白の継ぎ目 → 続きを描く朝 | Stage19/5 / incomplete / トモリ・ハナ・シロ / chosen finish |
| レン | **片焦点のレンズ灯** | 片レンズが差分へ焦点を合わせ、もう片方が全体を残す | レンズのしるし → **片曇りのレンズ布（Working）** → **見落とされた余白片（Working）** → 硝子の道筋 → 見落とさない朝 | Stage12/18 / delta / マドカ・トキ / meaningful difference |

---

# 3. Same-name lineage decisions

次は同名衝突ではなく、**同じobjectがroleを変えるlineage**として扱うCurrent direction。

| Character | Repeated name | Meaning |
| --- | --- | --- |
| コヨリ | 呼び名の紙縒り | passive時は結ぶ仕組み、灯継ぎ後は補助灯networkとして同じ物が成長 |
| ゲン | 駅前の道火 | 持ち歩く小火が安全地帯を作れる段階へ成長 |
| ハナ | 箱底の花 | 保管物が戦闘fieldへ花脈を広げる段階へ成長 |
| シロ | 未分類の頁 | 保留するpassiveから、未分類を力へ変える灯継ぎへ成長 |
| トバリ | 片道ではない切符 | rare itemが暁開きで完全な往復権へ変わる |
| ネム | 眠り頁 | passiveの一頁が、予測を書き換える灯継ぎの媒体になる |
| カナメ | 隠し火 | 自分だけで抱える火から、仲間へ分ける火へ意味が変わる |
| カスミ | 薄れ名 | 隠すための薄れから、本人が戻せる可逆的な薄れへ変わる |
| トキ | 角度の火 | 最適角度だけを示す火から、測定外も照らす火へ変わる |
| ツムギ | 余白の継ぎ目 | 未完を残す印から、完成と続きを共存させる継ぎ目へ変わる |

Runtime/UIでは同名categoryを識別できるsubtitleまたはphase labelが必要。
名前自体を必ず変えるという意味ではない。

---

# 4. Black-youka visual connection

黒耀化では新しい無関係な武器を突然持たせない。
光る持ち物の長所が一方向へ極端化する。

例:

- ユイ: 持ち主不明でも全て強制回収する光
- アサ: 名札を本人の許可なく固定する切断線
- ナギ: 全ての鍵穴を閉じる月輪
- ミチル: 一つの正解方向以外を消す針
- トモリ: 古い傷まで消して固める修理光
- カナメ: 全ての攻撃を一人へ集める腕帯
- カスミ: 戻す痕跡まで消す白灯
- トキ: 測定不能を暗闇として切り捨てる定規
- ツムギ: 終了を拒否して永遠に縫い続ける糸
- レン: 一点の差だけを拡大し全体を失うレンズ

---

# 5. Dawn Square connection

100%報酬 `全灯の朝` では、この21objectが夜明け前の広場へ並ぶ。

配置は人物順の展示棚ではなく、関係ごとの小さなsceneにする。

```txt
持ち主待ちのランタン
↔ 折り目だけ光る黒紙

月箱の銀鍵
↔ 受け灯の腕帯
↔ 往復穴の改札鋏

帰り針のコンパス
↔ 古針の駅灯
↔ 星目盛りの夜定規
↔ 片焦点のレンズ灯

継火の修理ランプ
↔ 花脈の保管箱
↔ 未分類の白栞灯
↔ 余白を縫う糸巻き
```

Playerは歩いて眺め、各objectへ触れると短い一文と関連星図が灯る。
長文読了は100%条件にしない。

---

# 6. Coverage and gaps

## Covered as design direction

- Current21 luminous possession: 21/21
- Current20 production item lineage: 20/20
- Reserve Ren starter/art lineage: present
- Black-youka connection direction: 21/21
- Dawn proof connection direction: 21/21

## Still incomplete

- Ren passive / rare exact Human naming review
- runtime stable IDs for luminous possessions
- visual asset production / human approval
- Keeper Record UI 21-person migration
- Lost Item Record full launch count
- inventory/evolution data implementation for non-Core5
- Shadow runtime display-name migration

本書はDesign Currentでありruntime completion証拠ではない。

---

# 7. 一文

> **光る持ち物はキャラの飾りではなく、その人の長所が戦闘で役立ち、黒耀化で歪み、関係によって戻り、夜明け後に少し違う光り方をするための中心object。**
