# 134. 夜明け図鑑ビジュアルアセット計画

目的: `CollectionScene` を「クリアチェッカー」ではなく、ゲーム内資料館として見せる。

対象は図鑑・世界観・キャラ・記録だけ。メイン戦闘、敵挙動、武器挙動、バランスには触らない。

---

## 1. 目標の見え方

`夜明け図鑑` は、ただの達成一覧ではなく、以下の5章を持つ資料館にする。

```txt
夜明け図鑑
  ├ 夜明け星図     条件達成が絵札として灯る
  ├ カゲモノ図鑑   出会った影の観察記録
  ├ 忘れ物絵札     小物から持ち主の記憶を読む
  ├ 灯し手の記録   キャラの灯名・黒耀・朝明・欠け
  └ 言葉の記録     名言/語句/キャラ返信を見返す
```

---

## 2. アセット格納先

推奨パス:

```txt
public/assets/prototypes/collection-atlas/
  tabs/
  cards/
  motifs/
  backdrops/
```

最初はPNG素材なしでも Phaser 図形だけで表示する。
画像が入ったら段階的に差し替える。

### 現在の接続状態

- `collectionAtlasAssetsLoader.ts` の preload はデフォルトOFF
- `CollectionAtlasBackdropRenderer.ts` はtextureが存在する場合だけ画像を描画
- 未配置・未ロード時は `collectionAtlasAtmosphere.ts` の図形へフォールバック
- `CollectionScene` は `collectionAtlasSceneHooks.ts` 経由で上記を呼ぶ
- 実装上のベースパスは `assets/prototypes/collection-atlas/` で、この文書の `public/` 配下と一致する

そのため、PNGを一枚も置かない状態でも図鑑は落ちない。画像を有効化するときは、配置確認後にpreloadの `enabled` を明示的に切り替える。

---

## 3. 共通画像仕様

### タブ背景/章背景

```txt
サイズ: 320×420px
形式: PNG RGBA
背景: 透過または暗色ベース
文字: なし
ロゴ: なし
枠: なし
用途: 図鑑タブごとの薄い背景レイヤー
```

### ミニカードアイコン

```txt
サイズ: 96×96px
形式: PNG RGBA
背景: 透過
文字: なし
1アイテム1枚
見た目: 絵本風ドット、読みやすいシルエット
```

### 詳細カード挿絵

```txt
サイズ: 240×160px
形式: PNG RGBA
背景: 透過
文字: なし
用途: 詳細パネル上部または横の装飾
```

---

## 4. タブ別ビジュアル方針

### 4.1 夜明け星図

見た目:
- 星座
- 糸のような接続線
- 小さな絵札が灯る
- 暗い夜に金色の点が増えていく

必要素材:

```txt
tabs/dawn-atlas-backdrop.png
motifs/star-node.png
motifs/locked-star-node.png
motifs/revealed-card-node.png
motifs/completed-card-node.png
```

生成プロンプト方向:

```txt
dark storybook pixel art star map background, small golden constellation nodes, thin hand-drawn lines, warm lantern glow, transparent edges, no text, no logo, cozy dark fantasy, readable mobile UI background
```

---

### 4.2 カゲモノ図鑑

見た目:
- 影の標本帳
- 黒インクの丸いにじみ
- 怖すぎない、かわいい影の輪郭
- 観察メモではなく絵札っぽい

必要素材:

```txt
tabs/bestiary-backdrop.png
motifs/shadow-card-empty.png
motifs/shadow-card-seen.png
motifs/shadow-ink-stain.png
```

生成プロンプト方向:

```txt
storybook pixel art shadow bestiary page, soft black ink blobs, cute mysterious silhouettes, dark navy paper texture, warm gold dust, no text, no logo, transparent edges, mobile game collection screen
```

---

### 4.3 忘れ物絵札

見た目:
- 小物のカードコレクション
- 荷札、地図片、ランタン硝子、糸、灯貨、鍵
- 物そのものより「持ち主の気配」が主役

必要素材:

```txt
tabs/lost-items-backdrop.png
cards/lost-small-bag-tag.png
cards/lost-folded-map-corner.png
cards/lost-cold-lantern-glass.png
cards/lost-red-thread-knot.png
cards/lost-dull-light-coin.png
cards/lost-rusted-room-key.png
```

生成プロンプト方向:

```txt
storybook pixel art lost item card, small forgotten object, warm lantern highlight, soft paper texture, transparent background, no text, no logo, cozy melancholic fantasy, readable silhouette, 96x96 icon
```

個別メモ:

```txt
名前の消えた荷札: 小さな布タグ、消えた名前、かばんの紐
折れた地図の角: 折れ目のある地図片、点線、星印
冷めたランタン硝子: 小さな硝子片、内側に薄い暖色
ほどけない赤い糸: ほどけない結び目、赤い糸、少し光る
くすんだ灯貨: 古い硬貨、中央に小さな灯の刻印
錆びた部屋の鍵: 小さな錆び鍵、丸い持ち手
```

---

### 4.4 灯し手の記録

見た目:
- キャラカード
- 顔グラそのものより、光のモチーフと紋章
- 灯名/黒耀/朝明をカード化

必要素材:

```txt
tabs/keeper-records-backdrop.png
cards/keeper-yui-emblem.png
cards/keeper-asa-emblem.png
cards/keeper-nagi-emblem.png
cards/keeper-michiru-emblem.png
cards/keeper-tomori-emblem.png
```

生成プロンプト方向:

```txt
storybook pixel art character emblem card, small symbolic light motif, dark navy paper, warm gold rim, no text, no logo, transparent background, cozy dark fantasy mobile game UI
```

個別メモ:

```txt
ユイ: 小さなランタン、丸い暖色光
アサ: 朝焼けの火花、斜めの光
ナギ: 星図の針、方位磁針
ミチル: 水面の反射光、波紋
トモリ: 縫い目の灯り、針と糸
```

---

### 4.5 言葉の記録

見た目:
- 古い紙片、しおり、余白
- 原文と訳が並ぶ感じ
- 本のページだが堅くしすぎない

必要素材:

```txt
tabs/word-records-backdrop.png
motifs/quote-paper-slip.png
motifs/source-bookmark.png
motifs/reply-lantern-mark.png
```

生成プロンプト方向:

```txt
storybook pixel art paper slips and bookmark, quiet literary archive, dark navy background, warm candle glow, no text, no logo, transparent edges, cozy melancholic fantasy UI
```

---

## 5. 実装順

1. 現在のPhaser図形版を維持する
2. `preload` へ任意画像を追加する
3. 画像が存在する場合だけ表示、無ければ図形フォールバック
4. まず背景1枚ずつ差し替える
5. 次に忘れ物絵札6枚
6. 最後に灯し手エンブレム5枚

---

## 6. 禁止事項

- メイン戦闘に影響する実装を混ぜない
- 画像が無いと落ちる実装にしない
- 図鑑内に長文を詰め込みすぎない
- 文字入り画像を使わない
- ロゴ入り画像を使わない
- 既存の著作物風に寄せすぎない

---

## 7. 次の実装候補

```txt
src/game/data/collectionAtlasAssets.ts
```

役割:
- タブID → 背景画像キー
- 忘れ物ID → アイコン画像キー
- 灯し手ID → エンブレム画像キー
- 画像未ロード時のfallback motif

これを入れると、画像が揃った段階で安全に差し替えできる。
