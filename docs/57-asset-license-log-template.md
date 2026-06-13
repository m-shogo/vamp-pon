# Asset License Log Template

## 目的

Vamp Pon で使用する素材の出所とライセンスを記録する。

ゲーム制作では、素材のライセンス管理を後回しにすると公開時に破綻する。

MVPの仮素材でも、外部素材を使うなら必ず記録する。

---

# 記録対象

```txt
画像
アイコン
フォント
SE
BGM
動画
エフェクト素材
AI生成素材
参考素材
```

## 記録しなくてよいもの

```txt
自分で作った単純図形
Phaserで描画した円/四角/線
完全に自作したテキスト
```

ただし、本素材化するなら記録する。

---

# 素材ログ項目

| 項目 | 内容 |
|---|---|
| assetId | 管理ID |
| filePath | repo内パス |
| type | image / se / bgm / font / other |
| usage | 使用箇所 |
| source | 入手元 |
| license | ライセンス |
| author | 作者 |
| modified | 加工有無 |
| creditRequired | クレジット必要か |
| commercialUse | 商用利用可否 |
| redistribution | 再配布可否 |
| note | 補足 |

---

# ログ雛形

| assetId | filePath | type | usage | source | license | author | modified | creditRequired | commercialUse | redistribution | note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| se_pickup_fragment_001 | assets/audio/se_pickup_fragment.wav | se | 欠片取得 | TBD | TBD | TBD | no | TBD | TBD | TBD | 仮 |

---

# AI生成素材を使う場合

AI生成素材も記録する。

## 記録項目

```txt
生成ツール
生成日
プロンプト
利用規約確認日
商用利用可否
加工有無
元画像/参照画像の有無
```

## AI生成ログ雛形

```txt
assetId:
filePath:
type:
usage:
generationTool:
generatedAt:
promptSummary:
referencedInputs:
termsCheckedAt:
commercialUse:
modified:
note:
```

## 注意

第三者の著作物・既存キャラ・商標に寄せた生成物は避ける。

Vamp Pon では、既存IPに似せない。

---

# フォント注意

フォントは特に注意。

```txt
Web埋め込み可否
アプリ埋め込み可否
商用利用可否
再配布可否
ライセンス表記
```

不明なフォントは使わない。

MVPではシステムフォントでよい。

---

# SE/BGM注意

無料素材でも条件がある。

確認すること。

```txt
商用利用可
加工可
クレジット必要/不要
ゲーム組み込み可
再配布形式に問題ないか
```

BGM/SEは、素材サイト名だけでなく個別素材ページを記録する。

---

# 仮素材ルール

MVPでは仮素材を使ってよい。

ただし、仮素材は以下を守る。

```txt
公開版に混ぜない
仮素材と本素材のパスを分ける
ライセンス不明素材を使わない
```

推奨パス:

```txt
assets/temp/
assets/production/
```

---

# 公開前チェック

公開前に必ず確認。

```txt
[ ] すべての外部素材がログにある
[ ] ライセンス不明素材がない
[ ] 商用利用不可素材がない
[ ] クレジット必要素材の表記がある
[ ] フォントの利用条件を確認した
[ ] AI生成素材の利用条件を確認した
[ ] 既存IPに似せた素材がない
```

## 最重要

```txt
出所が分からない素材は使わない。
```

これはゲーム公開時のリスクを減らすために必須。
