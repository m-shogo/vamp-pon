# Aseprite Assistant: Yui 52px V2a Hand-finish

status: **prototype/review assistant**  
date: 2026-06-15  
対象: `assets/source/prototypes/yui_idle_52_v2a.aseprite`

## 目的

Yui 52px V2a の GUI 手仕上げで、人間が markdown の座標を読みながら探す負担を減らす。

この assistant は Aseprite 上に一時的なガイドレイヤーを追加し、以下の修正箇所を色付き枠で示す。

- hood 幅 / top sheen
- 首影
- 手の指 / handle握り影
- 袖の明暗
- 目の clean dot / 下まぶた
- 前髪3クラスタ
- ランタンリム / glow削り
- 左肩・フード端リム
- hitCore中心にglowを寄せない確認点

## 使い方

```sh
pnpm aseprite:yui:hf-assist
```

このコマンドは Aseprite を開き、`scripts/aseprite/yui-52-v2a-handfinish-assistant.lua` を実行する。

Aseprite が見つからない場合は:

```sh
ASEPRITE_BIN="/Applications/Aseprite.app/Contents/MacOS/aseprite" pnpm aseprite:yui:hf-assist
```

Steam版の候補パスは `pnpm aseprite:check` で確認する。

## Aseprite内でやること

1. assistant 実行後、まず **File > Save As** で複製する。

   ```txt
   assets/source/prototypes/yui_idle_52_v2a_hf.aseprite
   ```

2. `HF_GUIDE_DO_NOT_EXPORT` レイヤーを見ながら、下の順で手仕上げする。

   1. hood幅 / top sheen
   2. 首影 / 指 / 袖陰影
   3. 目 / 下まぶた / 前髪3クラスタ
   4. ランタン / glow / リム

3. PNG export 前に **`HF_GUIDE_DO_NOT_EXPORT` を非表示または削除**する。

   ```txt
   public/assets/prototypes/yui_idle_52_v2a_hf.png
   ```

4. before/after は以下へ記録する。

   ```txt
   docs/reviews/design-team/yui-52px-v2a-before-after-template.md
   ```

## これは何ではないか

この assistant は **hand-final 自動生成ツールではない**。

- guide layer を追加しただけでは GUI手仕上げ証跡にならない
- Lua/script 実行だけでは production-candidate にしない
- production sprite / production source / gameplay定数は触らない
- exportしたPNGを production path に置かない

## 判定ルール

production-candidate に進めるのは、次の条件を全部満たしたときだけ。

- Aseprite GUIで実際に1px手修正した
- before/afterテンプレートに証跡がある
- 80点rubricを再通過
- final自信が4以上
- mascot silhouette / merchandise potential が4以上
- 1x / 6x / 夜背景 / 欠片近接 / hitCore中心確認を通過
- production touched = no

## 関連

- `docs/reviews/design-team/yui-52px-v2a-human-aseprite-guide.md`
- `docs/reviews/design-team/yui-52px-v2a-gui-handfinish-handoff.md`
- `docs/reviews/design-team/yui-52px-v2a-before-after-template.md`
- `scripts/aseprite/yui-52-v2a-handfinish-assistant.lua`
