# ヨルノシルベ Character × Story × Gameplay Payoff Matrix v1

Date: 2026-07-29  
Status: **CURRENT CROSS-DOMAIN DESIGN MAP / EXACT VALUES & RUNTIME IMPLEMENTATION NOT CLAIMED**

> 目的: Character設定・Relation・黒耀化・Enemy・Clear Getter・Dawn Proofが別々の資料で孤立しないよう、「この設定を入れるとGameplayの何が変わり、終盤で何を回収できるか」をCurrent21全員について一枚で確認する。

---

# 1. Cross-domain matrix

| Character | Core verb | Relation pressure | 黒耀化 wrong arrival | Gameplay payoff direction | Enemy / encounter motif | 夜明け星図 condition seed | Dawn proof |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ユイ | 戻す /拾う | アサ /クロオリ /トモリ | 全部強制回収 | selective pickup / hold / ally-confirm | 紙片 /鈴 /持ち主不明 | 保留対象を残してClear /特定Supportと回収率条件 | 拾う前にowner確認 |
| アサ | 名付ける /mark | ユイ /カスミ | 全員を名前で固定 | consent mark / target definition | 名札 /消印 /label decoy | 未確定markを残してClear /カスミSupport | 「なんて呼べばいい？」 |
| ナギ | 閉じる /seal | カナメ /トバリ | 選択肢まで封印 | targeted seal / reopen trigger | 鍵穴 /箱 /lane close | 出口を残したままhazard seal | 閉める前に確認 |
| ミチル | 歩く /route | トキ /ゲン | routeを一本へ固定 | dynamic reroute / path buff | 切符 /方位 /地図 | run中route switch一定回数 /No fixed-route | 地図へ二本の線 |
| トモリ | 直す /repair | ツムギ /ユイ | 傷跡まで消して元通り | repair vs scar trait | 糸 /ボタン /マッチ | scar traitを残して進化 / repair build Clear | 古い修理跡を残す |
| セン | 教える /guide | コヨリ /シロ | 正答routeを強制 | advisory guide / off-line bonus | 白線 /定規 /黒板 | guide外行動を含めてClear | 相手に「次は？」 |
| リツ | 分ける /guard | コヨリ /カナメ | 全riskを自己負担 | distributed guard / shared damage | リボン /墨腕 | partyへrisk分配してNo-down | 一つ任せる |
| コヨリ | 繋ぐ /tether | リツ /セン | 離れる自由を奪う | voluntary tether / distance bonus | 鈴 /リボン /名札 | tether解除を使ってClear | 「あとでね」で別行動 |
| ゲン | 覚える /old route | ミチル /トキ | 過去routeを現在へ上書き | historical overlay / route memory | 古梟 /方位 /旧道 | old/new route両方を使う | 「今はそっちか」 |
| ハナ | 保存する | ツムギ /シロ | 変化までfreeze | preserve/release resource | 押花 /古写真 | 保存slotを解放して進化 | 花を花瓶へ置く |
| ユウビ | 届ける | トバリ /カスミ /クロオリ | 拒否されても即配送 | hold / return / timed delivery | 封筒 /消印 /改札 | hold delivery成功 / delayed assist | 封筒を一度戻す |
| マドカ | 見る /伝える | レン /ネム /トキ | 全部見て動けない | priority warning / forecast | 窓 /レンズ /古写真 | uncertain warningから回避成功 | 「たぶん。でも言っとく」 |
| シロ | 分類 /保存 | ツムギ /セン /ハナ | 未分類を許さない | provisional tag / unknown bonus | しおり /余白 /消し跡 | unknown tagを残してClear | 未分類箱へ戻す |
| トバリ | 門を守る /return | ユウビ /ナギ | 誰も出さない | controlled gate / return anchor | 切符 /改札 /route | gate reopenを使ってClear | 帰還を管理せず待つ |
| ネム | 夢を見る /持ち帰る | トキ /マドカ | 誰も起こさない | dream overlay / clue carry | 羊夢 /青灰 /夢波 | dream fieldから自力離脱 | 自分から起きる |
| クロオリ | 預かる /fold | ユイ /ユウビ | 永遠に開かない | timed seal / owner-confirm reopen | 烏紙 /黒折 /封 | sealed itemを適切にreopen | 本人へ開封判断を返す |
| カナメ | 盾になる | ナギ /リツ | 全部自分が受ける | rotating guard / shared intercept | 狼火 /墨腕 | interceptをAllyへ受け渡す | 「頼む」と渡す |
| カスミ | 隠す /conceal | アサ /ユウビ | 痕跡まで全部消す | selective privacy / visibility levels | 消し跡 /霞 /レンズ | private stateを解除してClear | 消す前に本人へ聞く |
| トキ | 測る | ミチル /ネム /レン /ゲン | 最適値へ固定 | adaptive timing / measurement update | 定規 /迷針 /角度 | perfect windowを意図的に外してClear | 値へ「暫定」 |
| ツムギ | 続きを残す /stitch | トモリ /シロ /ハナ | 終了を拒否 | finish/open-slot duality | 糸 /余白 /継ぎ目 | unfinished stackを完成へ変換 | 最後の一針＋新しい白紙 |
| レン | 差を見る | マドカ /トキ | 一点へ過集中 | delta detection / party weakpoint | レンズ /古写真 /variant | 差分を共有してboss phase突破 | 理由不明でも先に共有 |

---

# 2. 「設定を入れる意味」チェック

新しいCharacter案 / 関係案を入れる時、このmatrixのどこにも返らないなら優先度を下げる。

最低でも2つへ返す:

```txt
Character voice
Relation
Combat verb
Support / Pair
Enemy counter
黒耀化
Clear Getter
Dawn proof
Main / Character Mystery
```

例:

```txt
「トモリは古い修理跡を見分ける」
↓
Character: repair identity
Relation: ユイのランタン
Mystery: 別時代の物の継承
Gameplay: scar trait
Enemy: 糸 /継ぎ目
Dawn: 修理跡を消さない
```

5方向へ返るので高価値。

一方:

```txt
「実はトモリは特殊な王家の血筋」
```

は現状のCoreへほぼ返らず、交換可能な秘密を増やすだけなので低価値。

---

# 3. Clear Getter / 夜明け星図への接続

Character storyを読むこと自体をunlock条件にしない。

良い条件:

- そのCharacterらしい別playを試す
- Support組み合わせを変える
- 黒耀化を使う /使わない
- 黒耀化から安全に戻る
- Pair Traitを成立させる
- enemy mechanicへ別解で対処

悪い条件:

- 灯録を100%読む
- 会話を全部開く
- profileを閲覧する
- 好感度アイテムを大量投入

Characterの成長を**Gameplayの違う遊び方**として夜明け星図へ返す。

---

# 4. EnemyをCharacter専用にしすぎない

matrixのEnemy motifは「その人の心から生まれた専用敵」ではない。

同じ敵でもrunによって意味が変わる。

例:

### 名札系

- アサ: 名前を付けること
- カスミ: 名前を隠すこと
- ユウビ: 宛名をどう扱うか
- ユイ: owner確認

### Route系

- ミチル: 道を選ぶ
- トキ: 危険度を測る
- ゲン: 過去の道
- トバリ: 帰路を残す

この横断性により、enemy asset数を無限に増やさずstory depthを増やせる。

---

# 5. 黒耀化 masteryとBuild diversity

成長後の黒耀化は単純な`デメリット軽減版`にしない。

```txt
未熟な黒耀化:
強い
+ 一択
+ 周囲のchoiceを消す

mastery:
強さの核は残る
+ target / timing / routeを選べる
+ Supportと組み合わせられる
```

これによりCharacter growthがbuild diversityへ直接返る。

---

# 6. Production priority

## Priority A — Main Story prototypeで先に証明

- ユイ
- アサ
- ナギ
- ミチル
- トモリ
- クロオリ

最低限:

- 1 recurring daily behavior
- 1 combat verb
- 1 relation friction
- 1 black-youka pressure
- 1 dawn proof

を持つ。

## Priority B — Major rotating

- カナメ
- カスミ
- トキ
- ツムギ
- リツ
- コヨリ
- ネム

Main stageへ短く差し込みつつ、character run / Supportで深掘り。

## Priority C — Supporting / Optional

- セン
- ゲン
- ハナ
- ユウビ
- マドカ
- シロ
- トバリ
- レン

Gameplay identityは作るが、Main Story cutscene量は抑える。

---

# 7. 一文

> **Character設定は「面白いプロフィール」だけで採用せず、戦い方・仲間との摩擦・敵の読み方・黒耀化・達成条件・夜明け後の小さな変化へ何本返せるかで強さを見る。**
