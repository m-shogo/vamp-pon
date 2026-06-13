# Production Readiness Score

## 目的

Vamp Pon が「実装に進める状態か」を点数化する。

このスコアは完成度ではなく、制作準備度を測る。

---

# 1. スコアの定義

この資料では、スコアを3種類に分ける。

```txt
Prototype 1 Documentation Readiness
MVP Full Production Readiness
Commercial Release Readiness
```

混同しないこと。

---

# 2. 現在スコア

## Prototype 1 Documentation Readiness

```txt
100 / 100
```

意味:

```txt
Prototype 1を安全に開始できる資料は揃っている。
```

対象:

```txt
1分操作感
スマホ縦持ち
ユイのみ
インクの影のみ
夜の鉛筆のみ
欠片/XP/Lv2のみ
仮素材
```

## MVP Full Production Readiness

```txt
80 / 100
```

意味:

```txt
MVP全体の資料はかなり揃っているが、Prototype 1〜3の実測がまだない。
```

不足:

```txt
実機検証
実プレイバランス
8分体験の実測
進化/必殺技の実装後評価
```

## Commercial Release Readiness

```txt
40 / 100
```

意味:

```txt
商用公開やストア提出はまだ対象外。
```

不足:

```txt
ストア要件
プライバシーポリシー
問い合わせ導線
クラッシュログ
分析イベント
アプリ署名
素材本番ライセンス確認
```

---

# 3. 評価基準

## Prototype 1 Documentation Readiness

100点満点。

```txt
90点以上: Prototype 1実装へ進んでよい
80〜89点: 重要資料は揃っているが、一部補強推奨
70〜79点: 実装は可能だが手戻りリスクあり
69点以下: まだ資料不足
```

現在:

```txt
100 / 100
```

---

# 4. Prototype 1資料の到達状況

| 項目 | 状態 |
|---|---|
| ワンシート企画書 | OK |
| GDD概要版 | OK |
| GDDインデックス | OK |
| MVP凍結リスト | OK |
| 8分体験タイムライン | OK |
| スマホ入力仕様 | OK |
| Prototype 1タスク分解 | OK |
| Prototype 1 Issueテンプレート | OK |
| First PR Plan | OK |
| Go/No-Go判定表 | OK |
| QAチェックリスト | OK |
| PRレビュー表 | OK |
| 改善Issueテンプレート | OK |
| Playtest Reportテンプレート | OK |
| Balance Log実ファイル | OK |
| Asset License Log実ファイル | OK |
| repo棚卸し手順 | OK |
| Branch/PR/Issue運用 | OK |
| Gap Closure | OK |

---

# 5. Go判定

## Prototype 1

```txt
GO
```

理由:

```txt
目的が明確
スコープが小さい
デザイン未確定でも進められる
タスク分解済み
Issue/PR/QA/Go-NoGo/ログの運用がある
```

## Prototype 2

```txt
NO-GO
```

理由:

```txt
Prototype 1の検証結果がまだない
```

## Prototype 3

```txt
NO-GO
```

理由:

```txt
Prototype 1/2の検証結果がまだない
```

## デザイン本格化

```txt
NO-GO
```

理由:

```txt
仮素材で遊びの核が証明されていない
```

## アプリ化

```txt
NO-GO
```

理由:

```txt
Webプロトタイプの核が未検証
```

---

# 6. Prototype 1実装時の制限

Prototype 1に進む場合、以下を守る。

```txt
1分操作感のみ
ユイのみ
インクの影のみ
夜の鉛筆のみ
欠片/XP/Lv2のみ
本格デザインなし
進化なし
必殺技なし
記憶カプセルなし
武器5種なし
パッシブ5種なし
```

---

# 7. 100%になっても残るもの

100%は、資料で埋められる範囲の話。

以下は資料ではなく、実装と検証でしか埋まらない。

```txt
移動が本当に気持ちいいか
欠片回収が気持ちいいか
夜の鉛筆が爽快か
スマホで見えるか
実機で重くないか
1分以内に面白さが出るか
```

---

# 8. 結論

資料フェーズは、Prototype 1開始に必要なラインを満たした。

```txt
Prototype 1 Documentation Readiness: 100 / 100
```

次に進むべきは資料追加ではなく、以下。

```txt
repo棚卸し
Prototype 1 Issue作成
First PR作成
1分の核を実装
スマホ縦持ちで検証
```

最重要:

```txt
ここから先は、文書ではなく手触りで判断する。
```
