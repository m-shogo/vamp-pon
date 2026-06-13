# Future Layer Governance

## 目的

Stage 2〜5、ボス、追加キャラ、追加武器などの将来案が、MVP実装へ流れ込んで破綻することを防ぐ。

Vamp Ponでは、将来案を捨てない。

ただし、今作るものとは厳密に分ける。

---

# 1. Layer定義

## Layer 0: Prototype 1

```txt
1分操作感
ユイ
インクの影
夜の鉛筆
欠片
XP/Lv2
```

現在の実装対象。

## Layer 1: Prototype 2

```txt
3〜5分成長感
武器5種
パッシブ5種
3択
敵3種
```

Prototype 1 Go後。

## Layer 2: Prototype 3 / MVP Stage 1

```txt
8分MVP
Stage 1
記憶カプセル
進化1〜2種
必殺技
リザルト
```

Prototype 2 Go後。

## Layer 3: Stage Expansion

```txt
Stage 2〜5
ステージ解放
ステージ別敵傾向
ステージ別ボス
```

MVP Stage 1 Go後。

## Layer 4: Meta/Retention

```txt
永続強化完全版
詳細図鑑
実績拡張
長期目標
```

Stage 1の核が面白いと確認後。

## Layer 5: Productization

```txt
PWA
Capacitor
ストア対応
分析
クラッシュログ
利用規約/プライバシーポリシー
```

Webプロトタイプが成立した後。

---

# 2. 現在の許可Layer

```txt
Current Allowed Layer: Layer 0 only
```

つまり、今作ってよいのはPrototype 1だけ。

---

# 3. Future Layerの扱い

## やってよい

```txt
将来案としてdocsに隔離する
MVP後のGo条件を書く
実装条件を書く
破綻リスクを書く
```

## やってはいけない

```txt
Prototype 1の実装に混ぜる
Prototype 1のIssueに混ぜる
Prototype 1 PRに入れる
MVP必須に昇格させる
```

---

# 4. Future案の昇格ルール

Future案を実装対象に昇格するには、以下が必要。

```txt
1. 現在LayerのGo判定
2. Playtest Report
3. Balance Log
4. No-Goリスクの解消
5. MVP凍結リスト更新
6. GDD概要版更新
```

## 例: Stage 2へ進む条件

```txt
Stage 1 MVPが仮素材でも面白い
8分が退屈ではない
記憶カプセルが嬉しい
進化が機能している
スマホで重くない
```

---

# 5. Future案のラベル

資料内では以下を明記する。

```txt
MVP
Prototype
Future Layer
Post-MVP
Productization
```

曖昧な言葉は禁止。

NG:

```txt
そのうち入れる
できれば入れる
多分必要
```

OK:

```txt
Future Layer: Stage Expansion
Post-MVP: Stage 2以降
Productization: アプリ化以降
```

---

# 6. Stage 2〜5の扱い

```txt
Stage 2〜5はFuture Layer
MVPには入れない
Prototype 1〜3にも入れない
```

Stage 2〜5の資料は、方向性として残す。

実装はStage 1 MVPのGo後。

---

# 7. Bossの扱い

```txt
Stage 1: 黒ラベルの影のみ
Stage 2以降: 本格ボス候補
Stage 5: 最終ボス候補
```

本格ボスはMVP後。

Prototype 3では作らない。

---

# 8. 追加キャラの扱い

```txt
ユイ: MVP
ミチル: Post-MVP
3人目以降: Future Layer
```

ミチルは良い案でも、Prototype 1〜3には入れない。

---

# 9. 追加武器/パッシブの扱い

```txt
MVP武器: 5種
MVPパッシブ: 5種
追加武器: Post-MVP
追加パッシブ: Post-MVP
```

Prototype 2までは5種を磨く。

---

# 10. Escalation Checklist

Future案を今入れたくなったら、以下に答える。

```txt
[ ] Prototype 1の目的に必要か？
[ ] なくても検証できるか？
[ ] 入れると原因分析が難しくならないか？
[ ] スマホ操作が増えないか？
[ ] データ駆動で表現できるか？
[ ] 今入れないと本当に困るか？
```

1つでも怪しいならFuture Layerに戻す。

---

# 11. 最重要

将来案は、今作る理由にはならない。

```txt
Future Layerは保管庫。
MVP Scopeは実装対象。
```

この2つを混ぜない。
