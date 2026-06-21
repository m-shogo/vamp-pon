# Final Preflight Checklist

## 目的

Prototype 1実装へ入る直前に、破綻要因が残っていないか確認する。

このチェックが通ったら、資料追加ではなく実装へ進む。

---

# 1. Scope Check

```txt
[ ] Prototype 1は1分の核だけである
[ ] ユイのみである
[ ] インクの影のみである
[ ] 夜の鉛筆のみである
[ ] 欠片/XP/Lv2のみである
[ ] 必殺技を入れない
[ ] カプセルを入れない
[ ] 進化を入れない
[ ] 武器5種を入れない
[ ] パッシブ5種を入れない
```

---

# 2. Docs Check

```txt
[ ] docs/77-prototype-1-documentation-signoff.md を読んだ
[ ] docs/83-spec-signoff.md を読んだ
[ ] docs/95-prototype-1-implementation-brief.md を読んだ
[ ] docs/91-minimum-asset-spec.md を読んだ
[ ] docs/96-final-preflight-checklist.md を読んだ
```

---

# 3. Repo Check

```txt
[ ] package.jsonを確認した
[ ] src/main.tsを確認した
[ ] src/styles.cssを確認した
[ ] src/game配下を確認した
[ ] 既に入っている実装がPrototype 1を邪魔していない
[ ] 古い10分/ミチル/Stage 2以降の実装が混ざっていない
```

---

# 4. Visual Check

```txt
[ ] 採用方向は紙片・絵本風ドット
[ ] Prototype 1では本格素材を作らない
[ ] Phaser図形でも実装可能
[ ] 背景は薄くする
[ ] 敵は黒影+白目で見える
[ ] 欠片は一番目立つ小物
[ ] UIは読めることを優先
```

---

# 5. Technical Check

```txt
[ ] Vite + TypeScript + Phaser
[ ] 390x844論理解像度
[ ] スマホ縦持ち
[ ] PC開発用キーボード入力あり
[ ] 仮想スティックあり
[ ] 自動攻撃あり
[ ] playing状態のみ時間加算
```

---

# 6. Runtime Check

```txt
[ ] 敵は画面外40〜80pxから出る
[ ] プレイヤー120px以内にスポーンしない
[ ] 被弾後0.6秒無敵
[ ] 欠片は70px以内で吸引
[ ] 18px以内で取得
[ ] Lv2到達時はゲーム停止
```

---

# 7. Acceptance Check

Prototype 1完了時に確認する。

```txt
[ ] 3秒以内に動かし方が分かる
[ ] 最初の敵を10秒以内に倒せる
[ ] 30秒以内に欠片回収の意味が分かる
[ ] 60秒以内にLv2になる
[ ] スマホで操作が不快ではない
```

---

# 8. Output Check

Prototype 1完了後に必ず作る。

```txt
[ ] Playtest Report
[ ] Balance Log更新
[ ] Go/No-Go判定
[ ] 改善Issue
```

---

# 9. Stop Conditions

以下に当てはまったら、先に進まない。

```txt
[ ] Prototype 1なのに仕様が増えている
[ ] スマホで確認していない
[ ] 背景が邪魔している
[ ] 欠片が見えない
[ ] 敵が見えない
[ ] Lv2までが遅い
[ ] 何を検証しているか曖昧
```

---

# 10. Final Go

すべて問題なければ:

```txt
GO: Prototype 1 Implementation
```

次にやること:

```txt
1. repo棚卸し
2. P1-00/P1-01 実装
3. 小さいPR
4. スマホ確認
```

---

# 最重要

ここまで来たら、資料追加で安心しない。

```txt
実装して触る。
```

Prototype 1は、文書の正しさではなく手触りを確認するためにある。
