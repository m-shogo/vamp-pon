# ユイ96セル QAシーン

## 一覧確認の起動

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

## Runtime遷移確認の起動

```txt
?scene=yui-rage-cycle
```

実際の `resolveYuiVisualFrame` を使い、以下を自動再生する。

- 通常待機
- 暴走ゲージ25 / 50 / 75%
- 発動可能時の震え
- うずくまり
- 変身ピーク
- 暴走待機A/B
- front / left / right / backの暴走移動
- 暴走中の被弾
- 崩落
- ゲージ切れ
- 終了後の疲労
- 通常状態への復帰

左右キーまたは画面ボタンで1段階ずつ確認できる。
スペースキーまたは停止ボタンで自動再生を止める。

## カットイン確認の起動

```txt
?scene=cutin-qa
```

通常必殺と暴走カットインを個別に再生できる。
画面には、production画像・追加48sheet・通常必殺frame・idle・図形fallbackのうち、現在どれが使われているかを表示する。

予定されているproduction画像:

```txt
public/assets/prototypes/cutins/yui-ultimate-780x360-rgba.png
public/assets/prototypes/cutins/yui-berserk-780x360-rgba.png
```

現時点では上記2枚は未納のため、既存ユイframeによるfallbackを使用する。
画像納品後は `yui_cutin_ultimate` と `yui_cutin_berserk` のtexture keyで登録すれば、演出コードを変更せずproduction画像へ切り替わる。

## 一覧画面の操作

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
- 変身開始から疲労、通常復帰までが自然につながる
- カットインが敵や弾を長時間隠さない
- 通常必殺と暴走カットインの色・意味が混ざらない
- 問題は `R行C列` で記録し、問題セルだけ直接修正する

## 遅延ロード確認

追加48セルは通常起動時には読み込まない。
一覧QA画面の追加ページでボタンを押した時だけ、次の1枚を取得する。

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
