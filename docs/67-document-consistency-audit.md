# ドキュメント整合性監査

## 目的

Vamp Pon の資料が増えたため、古い方針と新しい方針の矛盾を整理する。

この資料では、現時点の正本・矛盾・注意点・今後の更新対象を明確にする。

---

# 1. 現時点の正本

最優先で従う資料。

```txt
README.md
docs/47-mvp-freeze-list.md
docs/61-gdd-executive-summary.md
docs/52-gdd-index.md
docs/65-go-no-go-checklist.md
```

実装時に特に見る資料。

```txt
docs/54-implementation-start-checklist.md
docs/55-prototype-1-task-breakdown.md
docs/63-prototype-1-issue-template.md
docs/66-first-pr-plan.md
```

---

# 2. 主要方針の最新状態

## プレイ時間

最新:

```txt
MVP標準は8分
```

過去に10分案あり。

扱い:

```txt
10分は将来のfullモード候補
MVPでは8分を優先
```

## プラットフォーム

最新:

```txt
Webベース
スマホブラウザ検証
Vite + TypeScript + Phaser
```

扱い:

```txt
アプリ化は後
PWA/CapacitorはMVP後
```

## デザイン

最新:

```txt
デザインは別途詰める
仮素材でゲーム性を検証
仮素材で完成度評価しない
```

## キャラ

最新:

```txt
MVPはユイのみ
ミチルはMVP後
```

## 題材

最新:

```txt
夜 / 記憶 / 忘れ物 / 地図帳 / 黒インク / 朝
```

過去検討:

```txt
妖怪
星座
三国志
歴史/国/文明
```

扱い:

```txt
妖怪は不採用
三国志は不採用
星座はサブ要素なら可能性ありだがMVP主軸ではない
```

---

# 3. 矛盾しやすい点

## 10分 vs 8分

矛盾:

```txt
過去資料では10分サバイバル前提の記述がある
```

現在判断:

```txt
スマホMVPは8分
10分はfullモード候補
```

対応:

```txt
新規実装は8分で作る
古い10分記述は過去経緯として残す
```

## キャラ2人 vs ユイのみ

矛盾:

```txt
過去資料ではユイ/ミチルの2人MVP案がある
```

現在判断:

```txt
MVPはユイのみ
ミチルはMVP後
```

対応:

```txt
Prototype 1〜3でミチルを作らない
```

## 仕様追加候補 vs MVP凍結

矛盾:

```txt
過去資料に追加武器/追加必殺技/追加キャラ候補がある
```

現在判断:

```txt
MVP凍結リストを優先
```

対応:

```txt
追加案はMVP後リスト扱い
```

## デザイン保留 vs Design Brief

矛盾ではない。

整理:

```txt
Design Briefはデザインを決める資料ではなく、デザイン検討時の制約資料
```

---

# 4. 古い資料の扱い

## 残す理由

```txt
判断経緯が分かる
後で戻る時の参考になる
なぜ不採用にしたか分かる
```

## 注意

古い資料に書いてあるからといって、現在のMVPには入れない。

最新判断は以下を優先。

```txt
docs/47-mvp-freeze-list.md
docs/61-gdd-executive-summary.md
```

---

# 5. 実装時の矛盾防止ルール

## ルール1

実装前に必ず読む。

```txt
docs/47-mvp-freeze-list.md
docs/55-prototype-1-task-breakdown.md
docs/66-first-pr-plan.md
```

## ルール2

Prototype 1で以下を入れない。

```txt
武器5種
進化
必殺技
本格デザイン
図鑑
永続強化
```

## ルール3

仕様変更したら、正本を更新する。

```txt
docs/47-mvp-freeze-list.md
docs/61-gdd-executive-summary.md
README.md
```

---

# 6. 整合性チェック表

| 項目 | 最新判断 | 状態 |
|---|---|---|
| MVP時間 | 8分 | OK |
| 技術 | Vite + TS + Phaser | OK |
| 初期プラットフォーム | Web/スマホブラウザ | OK |
| アプリ化 | MVP後 | OK |
| MVPキャラ | ユイのみ | OK |
| ミチル | MVP後 | OK |
| デザイン | 別途/仮素材検証 | OK |
| 題材 | 夜/記憶/忘れ物 | OK |
| 三国志 | 不採用 | OK |
| 妖怪 | 不採用 | OK |
| 星座 | サブ候補/保留 | OK |
| Prototype 1 | 1分操作感 | OK |
| 本格実装 | Prototype検証後 | OK |

---

# 7. 今後の監査タイミング

以下のタイミングで再監査する。

```txt
Prototype 1完了後
Prototype 2完了後
Prototype 3完了後
デザイン本格化前
アプリ化検討前
```

## 監査で見ること

```txt
MVPスコープが増えていないか
スマホ前提が崩れていないか
仮素材を完成度評価していないか
資料と実装がズレていないか
```

---

# 8. 結論

現時点の資料は、細部に過去案が残っているが、最新方針はかなり明確。

実装判断では以下を正本にする。

```txt
MVPはユイのみ
標準8分
Web + TypeScript + Phaser
スマホ縦持ち
仮素材でPrototype検証
Prototype 1は1分操作感のみ
```

この方針から外れたら、一度止める。
