# ヨルノシルベ1 Combat Item Selection Source v1

## Status / Authority

- Scope: Title1 Combat Item **18 family**
- Source: `src/game/data/combatItemSelectionSource.ts`
- Authority: **CONTENT_SOURCE_ONLY** for the new ten candidates
- Existing `passives.ts` Current8 is preserved as runtime truth.
- Selected10 does not mean implemented, owned, balanced, or production-ready.
- Candidate selection must not auto-promote Unity/Web runtime inventory.

## Why 18

The current runtime has only **Current8** passive items. Character production data already has 21 character-linked passive-item names, but promoting all 21 at once would create duplicate stat roles, tutorial overload, and a large runtime/save migration surface.

Title1 therefore uses:

- **Current8** — existing runtime passives kept intact
- **Selected10** — content-only candidates chosen for gameplay roles the Current8 does not express well

Total: **18 family**.

The target is not “more items = better.” The extra ten are selected because they add route, Status recovery, observation, support, Build Comfort, dream tempo, and DARK tradeoff decisions instead of just another Might/XP/Cooldown percentage.

## Current8 boundary

Current8 stays exactly as it is today:

- 金のコンパス — pickup
- 旅のバッジ — power
- 月明かりのしおり — growth
- あったか靴 — mobility
- 白い余白 — tempo
- 押し花 — power
- 外れた地図ピン — growth
- 小さな目覚まし時計 — tempo

The selection source classifies their broad effect axis only. It does not retune their runtime values.

## Selected10

### セン — 小さな黒板消し

Axis: Status Guard.

ERASED / SEALEDでBuildが崩れた時に、一段だけ戻れる余地を作る。万能cleanseにはしない。直接damageは増えない。

### リツ — 半分の包み紙

Axis: Support.

pickup由来の小回復や短buffを低倍率で分ける。「分ける」を火力コピーにしない。BURN / SOAKでtempoを失ったrunの立て直し候補。

### コヨリ — 呼び名の紙縒り

Axis: Support.

MARKED / ILLUMINATEDを補助灯やrelation assistのtarget情報として使う。主火力のコピーではなく、情報を利用する補助役にする。

### ゲン — 駅前の道火

Axis: Route.

ROOTED / CHILL / FREEZE pressureへ、速度盛りだけではなく「戻れる場所を先に作る」回答を与える。完全拘束無効は禁止。

### ハナ — 箱底の花

Axis: Status Guard / trap sustain.

自分が移動低下を受けた時、次のtrap/supportの持続を少し伸ばす。遅い状況をただの失敗にせず、保存・設置の強さへ変える。

### ユウビ — 古い消印

Axis: Tempo.

DROWSY / SLEEP後に、止められていた次の自動発動一回を「遅れて届ける」。Statusそのものを無効化しない。

### マドカ — 曇った窓紙

Axis: Observation.

ECLIPSED / DISORIENTED中に、危険敵一体と安全方向一つだけを短く示す。自動回避や大量outlineにはしない。

### シロ — 未分類の頁

Axis: **Build Comfort**.

LevelUp候補一枠を次回へ保留する。ERASED / SEALED後に同じstackを積み直す以外の方向転換を助ける。即powerを得ないtradeoffを残す。

### ネム — 眠り頁

Axis: Dream Control.

DROWSY / SLEEPを消すのではなく、解除後の短いtempo回復へ変える。「眠らないこと」だけを正解にしない。

### クロオリ — 四つ折りの影

Axis: DARK Risk.

ECLIPSED中の安全性と、pickup/route情報量をtradeoffにする。解除後にはEXPOSED回答windowを作る。DARKを悪属性や単純な高火力枠へしない。

## Status fail-forward coverage

ItemだけですべてのStatusを無効化する設計にはしない。

ただしPlayerが操作感を失いやすい以下には、Selected10のどこかから明確な回答を持たせる:

- ROOTED
- CHILL
- FREEZE
- DROWSY
- SLEEP
- ECLIPSED
- ERASED
- SEALED
- DISORIENTED

回答は resistance % だけではなく、route、予約発動、観察、保留、設置物、relation supportへ分散する。

## Anti-autopick rule

Selected10は全てtradeoffを持つ。

禁止:

- 取るだけで全damageが常時増えるCandidateばかりにする
- Status完全無効
- Boss gimmick削除
- 永久safe zone
- 自動回避
- 無限reroll / 無限保留
- DARKの欠点だけ消す

Item選択で「そのrunをどう遊ぶか」が変わることを優先する。

## Mobile readability

mobileでは効果を説明するために画面を汚さない。

- safe zoneは足元の小円
- helper targetは細線一本
- observationは敵一体 + 方向一つ
- delayed actionは消印一個
- cleanseは白い粉の短い一往復
- DARK tradeoffはHUD暗転ではなく足元の折り影

常時full-screen filter、大量arrow、長いfloating textは避ける。

## Runtime boundary

Selected10をruntimeへ接続するには別途:

1. PassiveDefinition / Unity ScriptableObject schema決定
2. numerical tuning
3. save migration
4. level-up offer rules
5. duplicate-item handling
6. Status runtime hook
7. icon / pickup / inventory art
8. mobile screenshot QA
9. playtest

が必要。

`runtimeAutoPromotionAllowed = false`。

18 familyというContent Masterは、live runtime inventoryそのものではない。
