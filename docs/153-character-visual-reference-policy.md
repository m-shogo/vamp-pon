# キャラクター画像依頼の正本

## 結論

キャラクター画像を依頼するときは、文章だけで説明しない。該当キャラクターの次の2画像を実際に開き、両方を入力画像として渡す。

```txt
assets/reference/character-master/core5/<character>-character-master-v1.png
public/assets/prototypes/sprite-sheets/core5-original/<character>-sprite-sheet-v1.png
```

ユイの場合:

```txt
assets/reference/character-master/core5/yui-character-master-v1.png
public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png
```

## 2枚の役割

- `character-master`: 人物、顔、髪、衣装、持ち物、雰囲気を理解するための原案。
- `core5-original`: 現在のスプライト品質、頭身、ポーズ展開、ゲームでの見え方を比較する最低基準。

新規制作では完全なトレースを要求しない。キャラクターの同一人物性だけを維持し、より良くなる部分は自由に再設計してよい。

## 採否

次の順番で比較する。

1. 現行2画像より魅力が上がっているか。
2. 同じ人物として見えるか。
3. 顔、髪、服、固有の持ち物、足の向きがゲーム表示で読めるか。
4. ポーズが自然で、動作の意味が分かるか。
5. Vamp Ponの世界観に合うか。
6. 画像サイズ、セル配置、透過、端接触などの納品仕様を満たすか。

寸法、RGBA、48セルが正しくても、原案より魅力が落ちた画像は不採用。

## 禁止

- テキスト説明だけで制作を開始する。
- 古いドット生成ルールや固定パレットを自動適用する。
- 機械的な図形で人物を組み立てる。
- 現行画像との横並び比較をせず「完成」と判断する。
- 技術検証の合格を、見た目の合格と取り違える。
- `public/assets/sprites/` を再作成する。

## ユイの最低限の識別点

- 青系のフードまたはフード付き上着
- 赤茶〜暖色暗色の髪
- 生成り・古紙色を含む服
- 小さなランタン
- 優しさ、静かな芯、小さな希望

これ以外の造形は、魅力が上がるなら自由に変更してよい。
