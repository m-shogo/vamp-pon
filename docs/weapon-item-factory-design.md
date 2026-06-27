# Weapon / Item Factory Design

Vamp Pon / Lantern Ledger の武器・パッシブ・レアアイテムを、破綻させずに量産するための設計書。

敵Factoryと同じく、1個ずつ思いつきで増やさない。**形 / 軌道 / 効果 / モチーフ / 進化先 / UIアイコン**を分け、Web版・Unity版・図鑑・グッズ化へ使い回せる形にする。

## Core Rule

武器とアイテムは、世界観の言葉で説明できるものだけ採用する。

```txt
夜
記憶
忘れ物
紙
ランタン
街灯
黒インク
星
朝
小さな道具
```

SF武器、銃、派手すぎる魔法陣、一般的すぎる剣は避ける。

## Weapon Formula

```txt
Weapon = Motif + Trajectory + Timing + GrowthPattern + EvolutionPair + VisualRule
```

Example:

```txt
motif: black ink bottle
trajectory: puddle area
timing: slow periodic
growth: wider / more pools
evolutionPair: lamp-post-ring
visual: black edge + warm center
= 黒インク小瓶
```

## Weapon Motif Families

| Family | Examples | World Fit |
|---|---|---|
| lantern | 北極星のランタン / 小灯り / 灯芯 | 主人公性 |
| paper | 夜の鉛筆 / 紙飛行機 / しおり刃 | 記憶帳 |
| ink | 黒インク小瓶 / 墨だまり / インク線 | 黒曜化 |
| street | 街灯の輪 / 標識 / 鍵束 | 夜道 |
| star | 星屑 / 星図 / 北極星 | 希望 / 道しるべ |
| sound | 鈴 / オルゴール / 小さな鐘 | 敵呼び / 浄化 |
| time | 懐中時計 / 針 / 夜明け時計 | 速度 / cooldown |

## Trajectory Types

| id | 説明 | 向く武器 |
|---|---|---|
| straight | 直線に飛ぶ | 夜の鉛筆 / 鍵 |
| orbit | プレイヤー周囲を回る | 街灯の輪 / 鈴 |
| homing | 敵へゆるく誘導 | 紙飛行機 / 星屑 |
| area | 地面に残る | 黒インク小瓶 / 水たまり |
| burst | 近距離で弾ける | マッチ / ランタン閃光 |
| beam | 短い線で切る | 星図の鉛筆 |
| chain | 敵から敵へ移る | 鍵束 / 星の糸 |
| cone | 前方扇形 | 傘灯り / ランタン照射 |
| pulse | 周囲へ波 | 鈴 / 時計 |

## Weapon Roster Draft

| id | 表示名 | Motif | Trajectory | 役割 | 進化 / 合体 |
|---|---|---|---|---|---|
| north-star-lantern | 北極星のランタン | lantern / star | cone / pulse | 初期安定 | yui-kokuyou-lantern |
| night-pencil | 夜の鉛筆 | paper / pencil | straight | 低CD直線 | star-map-pencil |
| paper-plane | 紙飛行機 | paper | homing | 初心者向け誘導 | thousand-paper-planes |
| black-ink-bottle | 黒インク小瓶 | ink | area | 範囲制圧 | ink-lamp-ring |
| lamp-post-ring | 街灯の輪 | street / light | orbit | 接近拒否 | ink-lamp-ring |
| key-bundle | 星鍵の束 | key / star | chain | 連鎖 | constellation-keys |
| tiny-bell | 小さな鈴 | sound | pulse | 近距離波 | memory-bell |
| match-light | 消えかけマッチ | fire / item | burst | 緊急範囲 | dawn-match |
| bookmark-blade | しおり刃 | paper | straight / return | 往復攻撃 | folded-bookmark |
| clock-hand | 夜明け時計の針 | time | orbit / slow | 時間干渉 | dawn-clock |

## Evolution / Fusion Philosophy

進化は「強くなった」だけではなく、**意味が変わる**。

```txt
小さな道具
↓
記憶を取り戻す
↓
光と黒インクが混ざる
↓
危険だが美しい形になる
```

### Fusion Examples

| Source A | Source B | Result | Visual |
|---|---|---|---|
| black-ink-bottle | lamp-post-ring | 黒街灯の輪 | 黒い輪の中心に暖色core |
| night-pencil | star fragment passive | 星図の鉛筆 | 線が星座になる |
| paper-plane | bookmark passive | 千羽紙飛行機 | 紙が群れで飛ぶ |
| tiny-bell | memory-coin passive | 記憶の鈴 | 鈴音で欠片を呼ぶ |
| clock-hand | dawn-ticket rare | 夜明け時計 | 一定周期で敵を鈍らせる |

## Item Formula

```txt
Item = SmallObject + StatEffect + RiskOrComfort + UIIconRule
```

## Passive Item Roster Draft

| id | 表示名 | Motif | 効果 | 説明方針 |
|---|---|---|---|---|
| warm-shoes | あたたかい靴 | shoe | MoveSpeed | 迷わず歩ける |
| bigger-lantern-core | 大きな灯芯 | lantern | PickupRange | 欠片が寄ってくる |
| paper-armor | 紙の守り | paper | MaxHP | 破れても守る |
| quiet-clock | 静かな時計 | clock | CooldownReduction | 夜の間隔が短くなる |
| memory-coin | 記憶の小銭 | coin | RewardBonus | 帰り道に残る |
| soft-scarf | やわらかいマフラー | cloth | DamageReduce | 触れた痛みを和らげる |
| ink-cap | インク止めの栓 | bottle cap | KokuyouControl | 黒曜化後の疲労軽減 |
| old-map | 古い地図 | map | StageReward | 遠回りほど拾える |

## Rare Item Roster Draft

| id | 表示名 | 役割 | 効果 | リスク |
|---|---|---|---|---|
| dawn-ticket | 夜明けの切符 | 復帰 | 一度だけ復帰 | なし / 低 |
| cracked-map | ひび割れた地図 | 報酬 | 報酬増加 | 被タッチ値増加 |
| keeper-bell | 管理人の鈴 | 群れ制御 | 中ボス後に欠片追加 | なし |
| black-thread | 黒いしおり紐 | 黒曜寄り | 黒曜ゲージ増加 | 疲労増加 |
| unopened-letter | 未開封の手紙 | 選択 | 次LvUpでRare率上昇 | それまで選択肢-1 |
| small-umbrella | 小さな傘 | 防御 | 一度だけ突進を防ぐ | 破れる |

### Rare Item Role Taxonomy

runtime のレアアイテムは、効果が混ざらないように `role` で分類する。

| role | 用途 | runtime方針 |
|---|---|---|
| `awakening_material` | 武器Lv最大 + レアアイテムで覚醒武器へ変える素材 | 既存の `name_tag` / `cracked_lens` / `sealed_letter` / `wind_mark`。取得後、条件達成で消費される |
| `survival_revival` | 復帰/救済/朝方向のレア | `dawn-ticket` 候補。復帰タイミング、消費条件、UI演出が固まるまでruntime追加しない |

`name_tag` は `awakening_material` として扱う。
`dawn-ticket` は `survival_revival` 候補として扱い、覚醒素材に混ぜない。
復帰レアはゲームロジックへの影響が大きいため、画像だけ先にruntimeへ入れない。

## Icon Production Rules

### Master Size

```txt
1024px master
↓
256px clean icon
↓
128px UI icon
↓
64px inventory icon
↓
32px HUD fallback
```

### Composition

- 中央に1モチーフ。
- 形は小さくしても読める。
- 背景は透明。
- 影は短く薄い。
- 外枠はUI側で付ける。アイコン画像にレア枠を焼き込まない。
- 暖色glowは使いすぎない。
- 黒インク版は別レイヤー / 別variantで持つ。

## Rarity Visual Rules

| Rarity | Visual |
|---|---|
| normal | paper beige frame |
| good | warm amber pin light |
| rare | lantern core + subtle seal |
| evolved | black ink edge + warm center |
| kokuyou | ink invasion + controlled amber |

星の数や過度な虹色は使わない。

## Asset Factory Output

```txt
exports/items/{item_id}/
  {item_id}_master_1024.png
  {item_id}_icon_256.png
  {item_id}_icon_128.png
  {item_id}_icon_64.png
  {item_id}_icon_32.png
  {item_id}_manifest.json

exports/weapons/{weapon_id}/
  {weapon_id}_master_1024.png
  {weapon_id}_icon_256.png
  {weapon_id}_projectile.png
  {weapon_id}_effect_preview.png
  {weapon_id}_manifest.json
  {weapon_id}_unity.json
```

## Manifest Draft

```json
{
  "id": "black-ink-bottle",
  "displayName": "黒インク小瓶",
  "category": "weapon",
  "motif": ["ink", "bottle"],
  "trajectory": "area",
  "maxLevel": 5,
  "icon": "black-ink-bottle_icon_128.png",
  "evolutionPairIds": ["lamp-post-ring"],
  "evolvedWeaponId": "ink-lamp-ring",
  "unityPrefabHint": "WeaponInkBottle"
}
```

## Balance Rules

- 序盤武器はすぐ気持ちよくする。
- Lv5まで寂しくしない。
- 進化後は数値だけでなく、見た目・音・揺れを変える。
- Rareは強すぎより「選びたくなる変化」にする。
- アイテムは説明文を短くする。
- 1画面に長文を出さない。

## Anti-Patterns

- アイコンに文字を入れる。
- 汎用ファンタジー武器に寄せる。
- レア枠を虹色や過剰発光にする。
- 武器名だけ凝って効果が普通。
- 効果だけ強くて絵が記憶に残らない。
- 合体先が世界観で説明できない。

## First Implementation Priority

1. 北極星のランタン。
2. 夜の鉛筆。
3. 黒インク小瓶。
4. 街灯の輪。
5. 黒街灯の輪。
6. あたたかい靴。
7. 大きな灯芯。
8. 夜明けの切符。

まずStage1で「拾う / 選ぶ / 進化する」が気持ちいい状態を作る。
