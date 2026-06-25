# Asset Quality Gate

Vamp Pon / Lantern Ledger の画像素材が、ゲーム実装・Unity移行・量産で破綻しないための検査ルール。

この文書は、AI生成物を採用する前のチェックリストとして使う。

## Core Principle

画像として綺麗でも、ゲーム素材として使えなければ不採用。

採用基準は以下。

```txt
Readable
Consistent
Exportable
Playable
Reusable
```

## Global Image Gate

| Check | Pass Condition |
|---|---|
| format | PNG |
| alpha | RGBA / 透明あり |
| background | 完全透明または用途に合う背景 |
| fringe | 白フリンジなし |
| checkerboard | 市松模様なし |
| text | 文字焼き込みなし |
| border | 不要な枠なし |
| naming | stable kebab-case |
| source | 原本と出力を分ける |

## Sprite Sheet Gate

| Check | Pass Condition |
|---|---|
| cell size | 180x180 unless explicitly changed |
| layout | 8 columns x 6 rows |
| total cells | 48 |
| edge contact | none |
| alpha bounds | 全セル内に収まる |
| center | キャラ中心が大きくズレない |
| scale | 身長 / 幅が大きく変わらない |
| palette | フレームごとに色がブレない |
| shadow | 接地影が暴れない |

## Character Gate

### Identity

- 顔が同じキャラに見える。
- 髪型が変わらない。
- 身長が変わらない。
- 服の基本形が変わらない。
- 小物が消えない。

### Anchor Stability

| Anchor | Check |
|---|---|
| head_center | フレーム間で大きく飛ばない |
| eye_left / eye_right | 表情差分以外で位置が変わりすぎない |
| hand_right | 右手持ち物の位置が安定 |
| hand_left | 左手が不自然に消えない |
| waist_left | バッグ位置が安定 |
| foot_left / foot_right | 歩きで接地感がある |
| shadow_center | 接地影がキャラと一致 |

### Direction Rule

キャラの左右は、画面上の左右ではなく**本人基準**で管理する。

ユイの場合:

- ランタンは本人の右手。
- バッグは本人の左腰。
- 左向きでもランタンを完全に消さない。
- 反転だけで済ませる場合、設定上の左右が崩れるのでmanifestに明記する。

## Enemy Gate

| Check | Pass Condition |
|---|---|
| silhouette | 32〜64pxで分かる |
| role | 行動型が明確 |
| motif | 忘れ物 / 場所 / 感情と結びつく |
| stage fit | 出るステージが説明できる |
| readable | 背景上で読める |
| not horror | 怖すぎない |
| reuse | オンブ / オンブロ素体から外れすぎない |
| behavior | 他敵と違うゲーム上の役割がある |

## Weapon Gate

| Check | Pass Condition |
|---|---|
| icon | 32pxでも読める |
| effect | 1行で説明できる |
| trajectory | 軌道タイプが定義済み |
| evolution | 進化 / 合体理由が世界観で説明できる |
| readability | 攻撃エフェクトが敵やEXPを隠しすぎない |
| sound hint | SE方向が想像できる |

## Item Gate

| Check | Pass Condition |
|---|---|
| icon | 小さくてもモチーフが分かる |
| description | 390x844で読める短さ |
| stat | 効果が明確 |
| rarity | レア感をUI側で制御できる |
| duplicate | 既存アイテムと効果が被りすぎない |

## Background Gate

| Check | Pass Condition |
|---|---|
| player readability | プレイヤーが沈まない |
| enemy readability | オンブが背景に溶けない |
| EXP readability | 欠片が見える |
| HUD readability | 上部UIが読める |
| contrast | 戦闘領域がうるさくない |
| mood | 夜 / 紙 / 記憶 / 黒インクに合う |
| crop | 390x844で成立 |

## Cutin Gate

| Check | Pass Condition |
|---|---|
| size | 1440x360 or explicitly documented |
| background | transparent |
| text | no text baked in |
| character | 同一キャラに見える |
| hand item | ランタン / 固定小物が正しい |
| fringe | no white fringe |
| direction | 横長演出として使える |

## Unity Export Gate

| Check | Pass Condition |
|---|---|
| manifest | exists |
| id | stable kebab-case |
| sprite path | valid |
| cell data | specified |
| anchor data | specified when needed |
| prefab hint | specified |
| scale hint | specified |
| pivot | documented |

## Naming Rules

```txt
character: char_yui_sheet_180x180_8x6.png
enemy: enemy_ombu_umbrella_shield_sheet.png
weapon: weapon_black_ink_bottle_icon_128.png
item: item_warm_shoes_icon_128.png
background: bg_stage1_forgotten_street_390x844.png
cutin: cutin_yui_kokuyou_1440x360.png
fx: fx_ink_burst_soft.png
```

## Review Score

採用判定は5項目で見る。

| Score | Meaning |
|---|---|
| 5 | そのまま採用 |
| 4 | 軽微修正で採用 |
| 3 | 仮素材として使用 |
| 2 | 方向性だけ採用 |
| 1 | 不採用 |

### Criteria

- Game readability。
- Character / motif consistency。
- Export readiness。
- World fit。
- Production reuse。

## Common Failures

- AI生成で小物が消える。
- 背景付きで出てくる。
- 目が可愛すぎて敵が弱く見える。
- 黒曜化がただの悪魔化になる。
- ドット化で顔だけ潰れる。
- アイコンに文字が入る。
- レア枠を画像に焼き込む。
- ボスが世界観から浮く。
- 1枚だけ良くて量産できない。

## Human Review Rule

自動検査で通っても、最後は以下を人間が見る。

```txt
この素材はStage1をもっと楽しくするか？
この素材はVamp Ponらしいか？
この素材はUnityへ持っていけるか？
```

3つ全部Yesなら採用候補。