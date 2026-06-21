# Pixel Art Quality Gate

この文書は、Vamp Pon のドット絵素材を `final-candidate` / `hand-final candidate` と呼んでよいかを判定するための品質ゲート。

目的は、**仕様は満たすがダサい素材**を通さないこと。

---

## 1. 判定ステータス

| status | 意味 |
| --- | --- |
| `reference` | 方向性確認用。完成素材ではない |
| `temporary` | 仮素材。実装確認には使えるが品質は弱い |
| `remake` | 作り直し対象 |
| `candidate` | 方向性は良いが、最終確認前 |
| `final-candidate` | 1x / 4x / 実背景 / combat-mock を通った本命候補 |
| `hand-final candidate` | Aseprite source から export され、手仕上げレビュー済みの本命候補 |

`candidate` と `final-candidate` は分ける。
微妙な素材を `final-candidate` にしない。

---

## 2. 5段階評価

素材ごとに以下を 1〜5 で評価する。

| 項目 | 5 | 3 | 1 |
| --- | --- | --- | --- |
| 1x可読性 | 一瞬で読める | 何とか読める | 何か分からない |
| reference一致 | 方向性が近い | 要素だけ近い | ほぼ別物 |
| 魅力 | 使いたい | 悪くない | ダサい |
| ゲーム中視認性 | 実戦で見やすい | 条件次第 | 埋もれる |
| 背景との分離 | 明確に分離 | 少し混ざる | 見失う |
| 同一画風 | 他素材と統一 | 少し浮く | 別ゲーム |
| final候補の自信 | 迷わず候補 | 保留 | 不採用 |

**3以下が1つでもある素材は final-candidate にしない。**

---

## 3. 必須レビュー画面

可能な限り以下で見る。

- 1x実寸
- 4x拡大
- 夜背景上
- pickup / 敵 / 弾 / hitCore の近接配置
- `/?scene=yui-gallery`
- `/?scene=asset-status`
- `/?scene=combat-mock&density=late`

---

## 4. 採用禁止条件

以下のどれかに該当したら `final-candidate` にしない。

- 1xで読めない
- referenceから離れている
- かわいくない / 魅力が弱い
- 敵や背景と混ざる
- ランタン、記憶の欠片、hitCoreが誤認される
- poseごとに別人に見える
- 背景が主張しすぎる
- 黒いだけの敵になっている
- AI画像の縮小だけでゲーム用調整がない
- Luaの図形生成だけで絵として弱い

---

## 5. 作業報告テンプレート

```md
## Pixel Art Quality Gate

対象:

### Referenceとの差分
- ...

### 現状の問題
- ...

### 評価
| 項目 | 点 | メモ |
| --- | ---: | --- |
| 1x可読性 |  |  |
| reference一致 |  |  |
| 魅力 |  |  |
| ゲーム中視認性 |  |  |
| 背景との分離 |  |  |
| 同一画風 |  |  |
| final候補の自信 |  |  |

### 判定
- status:
- 理由:

### 次の一手
- ...
```
