# ユイ visual direction

Stage 1 のユイは、スマホ縦画面で「小さいが読める主人公」として成立させる。
最終本命ではなく、generated-draft をゲーム内で検証しながら hand-final へ寄せる。

## 固定要素

- サイズは 32〜36px 前後。
- 小さいフード。
- 古紙色の服。
- 小さいランタン。
- 1px 縁取り。
- 黒インク影、紙片、弾、ドロップと色が被りすぎない。
- 背景上で読めるシルエット。
- 中心 `hitCore` が邪魔に見えない。
- 被弾芯が直感的に理解できる。
- 横/斜め移動でも姿勢が崩れない。

## 必要スプライト

| id | path | 状態 |
| --- | --- | --- |
| `yui_idle` | `public/assets/sprites/player/yui_idle_32.png` | generated-draft |
| `yui_move` | `public/assets/sprites/player/yui_move_32.png` | generated-draft |
| `yui_hurt` | `public/assets/sprites/player/yui_hurt_32.png` | generated-draft |
| `yui_ultimate` | `public/assets/sprites/player/yui_ultimate_32.png` | generated-draft |

## 最低アニメ案

- idle: 2フレーム。フードと服はほぼ固定、ランタンだけ小さく揺らす。
- move: 4フレーム。足元と服の裾で移動を示す。
- hurt: 1〜2フレーム。赤くしすぎず、紙片の跳ねで反応を示す。
- ultimate: 2〜4フレーム。ランタンと朝色の紙線を強める。

## Aseprite source 方針

- source は `assets/source/aseprite/yui_*.aseprite` に置く。
- export 先は `assetManifest` の path と一致させる。
- hand-final 化しても texture id は変えない。

## 次の手仕上げポイント

1. 顔とフードの読みやすさ。
2. ランタンと `hitCore` の距離感。
3. move の足運びと服のシルエット。
4. hurt/ultimate の情報量を増やしすぎないこと。
