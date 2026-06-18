# ユイ96セル QAシーン

## 起動

```txt
?scene=yui96-qa
```

直接ページを指定する場合:

```txt
?scene=yui96-qa&page=0
?scene=yui96-qa&page=1
?scene=yui96-qa&page=2
?scene=yui96-qa&page=3
```

ページ構成:

1. 基本48セルの1〜24
2. 基本48セルの25〜48
3. 表情・暴走48セルの1〜24
4. 表情・暴走48セルの25〜48

## 操作

- 画面下の左右ボタン、またはキーボード左右キーでページ移動
- セルをタップすると300px表示とゲーム想定76px表示を同時確認
- 追加48セルのページでは、読込ボタンを押すまで追加spritesheetを取得しない
- スペースキーでも追加spritesheetを読み込める

## 確認基準

- 顔、髪、フード、頭身、配色が全セルで同じユイに見える
- ランタンは本人の右手
- バッグ紐は本人の右肩から左腰
- バッグ本体は本人の左腰
- 左向きでは奥側のランタンを完全に消さない
- walk A/B、cast/attack、hurt/recoilが別動作に見える
- 問題は `R行C列` で記録し、問題セルだけ直接修正する

## 遅延ロード確認

追加48セルは通常起動時には読み込まない。
QA画面の追加ページでボタンを押した時だけ、次の1枚を取得する。

```txt
assets/prototypes/sprite-sheets/yui-expression-rage-original/yui-expression-rage-48-v1.png
```

画面にはResource Timing上の取得回数とロード時間を表示する。
同一Sceneで複数回取得されないことを確認する。

## 自動検証

```bash
pnpm assets:verify
pnpm test
pnpm build
```
