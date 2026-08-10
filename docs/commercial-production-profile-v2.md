# ヨルノシルベ — Commercial Production Profile v2

Date: 2026-08-10  
Status: **CURRENT COMMERCIAL PRODUCTION DIRECTION — ART / SKU NOT APPROVED**

Machine authority: `src/game/data/commercialProductionProfile.ts`

Related authorities:
- `src/game/data/characterCommercialIdentity.ts` — Character / Star Beast / Named Object / relation commercial identity
- `src/game/data/toumonSimpleSigilCanon.ts` — 21人の1色灯紋
- `docs/design/ip-symbol-merch-system-v1.md` — IP全体のStation / Ticket / Pattern / Collection設計
- `docs/design/toumon-simple-sigil-canon-v2.md` — 灯紋simple-sigil規則

## 目的

「何のグッズを作るか」を商品化直前にゼロから考えない。

Current21全員について、Character絵がなくても次の入口から商品展開を組める状態にする。

1. `oneColorSymbol` — 灯紋
2. `repeatPattern` — 顔なし総柄
3. `plushReadability` — 星獣ぬい / mascot
4. `embroiderySafe` — 刺繍・織り・刻印
5. `smallScaleReadability` — 16px / pin / tag / UI
6. `namedObjectReplica` — paper → charm → miniature → replica
7. `pairGoodsPartnerIds` / `pairGoodsGrammar` — 関係性商品
8. `displayGoodsHook` — 飾るための商品
9. `carryGoodsHook` — 持ち歩くための商品
10. `seasonalVariantRules` — 季節差分で変えてよい/いけないもの
11. `commercialNoGo` — 売上都合で壊してはいけないCharacter/Canon

## Hard boundary

このProfileは**商品化承認ではない**。

全21人で現在:
- `Toumon masterVectorStatus = NOT_YET_DRAWN`
- `embroiderySafe.productionApproved = false`
- `smallScaleReadability.productionApproved = false`
- `productionArtworkReady = false`
- `realSkuApproved = false`

画像生成も不要。まず意味・形の文法・商品展開経路だけを固定する。

## Current21 quick matrix

| Character | Pattern | Star Beast / plush read | Pair lane | Display / carry anchor |
| --- | --- | --- | --- | --- |
| ユイ | ROUTE + TOUMON | 子獅子 / 短い鬣 | アサ / クロオリ / トモリ | 返却待ちslot / return-tag |
| アサ | OBJECT + DAWN | 若い雄羊 / 小ぶり角 | ユイ / カスミ | name-tag rail / tag wallet |
| ナギ | OBJECT + ROUTE | 小蟹 / 低い横幅 | カナメ / トバリ | archive shelf / key sleeve |
| ミチル | ROUTE + DAWN | 小熊 / 探索姿勢 | トキ / ゲン | route-map stand / map pocket |
| トモリ | OBJECT + TOUMON | 若獅子 / 煤けた成熟差 | ツムギ / ユイ | repair bench / tool-tag pouch |
| セン | ROUTE + OBJECT | 小烏 / 首傾げ | コヨリ / シロ | branching board / pen sleeve |
| リツ | TOUMON + BEAST | 大きい猟犬 | コヨリ / カナメ | two-slot stand / split case |
| コヨリ | TOUMON + OBJECT | 小さい猟犬 | リツ / セン | helper rail / mini organizer |
| ゲン | ROUTE + OBJECT | 大熊 / 安定重心 | ミチル / トキ | weathered shelf / map cover |
| ハナ | OBJECT + BEAST | ふっくら白鳥 | ツムギ / シロ | archive tray / flower-vein pouch |
| ユウビ | ROUTE + OBJECT | 小鳩 / 短い歩幅 | トバリ / カスミ / クロオリ | pending-mail rack / letter case |
| マドカ | ROUTE + DAWN | 小鷲 / 観測姿勢 | レン / ネム | window stand / transparent sleeve |
| シロ | OBJECT + TOUMON | 山猫 / 耳先 | ハナ / セン / ツムギ | unclassified board / bookmark sleeve |
| トバリ | ROUTE + OBJECT | 大きな番犬 | ユウビ / ナギ | platform gate / pass case |
| ネム | DAWN + BEAST | 小イルカ / 丸い背 | トキ / マドカ | water-page stand / diary cover |
| クロオリ | OBJECT + TOUMON | 黒紙カメレオン | ユイ / ユウビ | sealed archive / folding case |
| カナメ | TOUMON + BEAST | 大きな灰狼 | ナギ / リツ | handoff rail / arm-band strap |
| カスミ | OBJECT + DAWN | 淡い小狐 | アサ / ユウビ | reversible frame / layered sleeve |
| トキ | ROUTE + TOUMON | 細身の鶴 | ミチル / ネム / ゲン / レン | calibration board / ruler sleeve |
| ツムギ | OBJECT + TOUMON | 白灰の野兎 | トモリ / シロ / ハナ | unfinished textile board / craft case |
| レン | ROUTE + TOUMON | 小さな観察犬 | マドカ / トキ | **Reserve candidate only** |

## 1色シンボル / embroidery

灯紋はCharacterごとの商品logoを増やすための飾りではない。

- 1 inkで成立
- uniform strokeを基本
- 刺繍都合で線を追加しない
- Characterの体格を線幅へ変換しない
- premium商品でもgeometryを豪華版へ変えない
- 16px識別を装飾ではなく`main stroke / gap / node`で解決

特にハナ/カナメ:
- ハナの丸い身体を太い/丸い灯紋へ変換しない
- カナメの大柄さを太線/XXL記号へ変換しない

## Star Beast plush line

星獣はCharacterのmini-meではない。

全Profileで最低:
- species/individual silhouette
- recognition hook
- 3 pose以上
- avoid set 3項目以上
- Character灯紋は足裏/tag/package程度

を持つ。

Yui/TomoriのLeo、Ritsu/KoyoriのCanes Venaticiは、同系統でも**別個体のread**を崩さない。

## Repeat Pattern

Pattern familyは `ROUTE / TOUMON_FRAGMENT / OBJECT_TRACE / STAR_BEAST_TRACE / DAWN`。

1 Characterにつきprimary + secondaryを固定するが、顔・Named Objectそのもの・星獣の顔を敷き詰める方式には戻さない。

商品例:
- lining
- scarf / handkerchief
- pouch
- notebook endpaper
- textile tag
- phone case
- wrapping paper
- collector box interior

## Pair goods

`pairGoodsPartnerIds` は恋愛ランキングではない。

各pairは、顔2つを並べるだけでなく灯紋の:
- shared gap
- shared node
- spacing
- handoff
- offset

のどれかで関係性を読む。

siblings / buddy / mentor / ideological mirror / trust / romanceを同じheart文法へ潰さない。

## Display / Carry

グッズ購入後の次商品も世界設定へ接続する。

Display:
- 夜の駅ホーム
- archive tray
- route-map stand
- unclassified page board
- repair bench
- calibration board

Carry:
- ticket/card case
- Toumon tag strap
- Star Beast pouch
- Named Object mini pocket
- collection mini-book

普通の推し活用品へlogoを貼っただけにしない。

## Seasonal invariants

変えてよい:
- material
- background
- Theme HEX balance
- season scene
- packaging
- Star Beast pose
- ribbon/tag

変えてはいけない:
- Toumon master geometry
- Character body identity
- relationship type
- Named Object ownership/truth
- Star Beast species/identity

## 「夜の記録帳」への接続

Commercial Production Profileは最終的に次を`夜の記録帳`へ戻せる構造にする。

- PEOPLE — Character / Toumon
- STAR BEAST — mascot
- OBJECT — Named Object / replica history
- ROUTE — station / ticket
- RELATION — pair goods / shared scene
- DAWN — seasonal / cleared-scene proof

Collection completeをTrue Ending条件へしない。

## Reserve — Ren

レンはCurrent21理解には含むがofficial reserve。

- `launchEligible=false`
- Current20 trading/blind lineへ自動混入禁止
- seasonal releaseで境界迂回禁止
- goods人気をPlayable / Canon昇格根拠にしない

設定を持つことと商品を発売することは別。
