# Pre-Implementation Repo Inventory

## 目的

Prototype 1 実装に入る前に、repoの現状を棚卸しする。

資料作成中に一部実装土台が入り始めているため、実装前に以下を確認する。

```txt
何が既にあるか
Prototype 1に使えるか
邪魔なものがないか
古いREADME/仕様と矛盾していないか
```

---

# 1. 棚卸し対象

## ルート

```txt
README.md
package.json
tsconfig.json
vite.config.ts
index.html
```

## src

```txt
src/main.ts
src/styles.css
src/game/
```

## docs

```txt
docs/47-mvp-freeze-list.md
docs/55-prototype-1-task-breakdown.md
docs/66-first-pr-plan.md
docs/68-production-readiness-score.md
docs/69-next-action-board.md
```

---

# 2. package.json確認

## 見ること

```txt
name が vamp-pon か
scripts が dev/build/test を持つか
dependencies に phaser/vite があるか
devDependencies に typescript/vitest があるか
```

## Prototype 1に必要

```txt
pnpm install
pnpm dev
pnpm build
```

## 注意

`latest` 指定は初速には楽だが、将来固定する。

Prototype 1が動いたら、lockfile込みでバージョンを安定させる。

---

# 3. srcの棚卸し

## 既存実装がある場合の扱い

```txt
Prototype 1に使える → 残す
Prototype 1に不要だが害がない → 残してもよい
Prototype 1の検証を邪魔する → 削除/隔離
```

## 危険な状態

```txt
Prototype 1前に武器5種の複雑処理が入っている
進化/必殺技/カプセルが動き始めている
MainSceneが巨大化している
```

この場合は、Prototype 1へ戻す。

---

# 4. docsの棚卸し

## 正本確認

実装前に必ず読む。

```txt
README.md
docs/47-mvp-freeze-list.md
docs/61-gdd-executive-summary.md
docs/55-prototype-1-task-breakdown.md
docs/66-first-pr-plan.md
docs/69-next-action-board.md
```

## 最新方針

```txt
MVPはユイのみ
Prototype 1は1分操作感のみ
標準はスマホ縦持ち
Web + TypeScript + Phaser
本格デザインなし
```

---

# 5. 実装前コマンド

ローカルで確認する。

```bash
cd /Users/m-shogo/Developer/personal/vamp-pon
pnpm install
pnpm dev
pnpm build
pnpm test
```

## 期待

```txt
pnpm install が通る
pnpm dev で画面が出る
pnpm build が通る
pnpm test はテスト未整備なら後回し可
```

---

# 6. 棚卸し結果テンプレ

```md
# Repo Inventory Result

## Date


## Commit


## package.json

- [ ] OK
- メモ:

## src

- [ ] OK
- 既存実装:
- Prototype 1に使う:
- 隔離/削除する:

## docs

- [ ] OK
- 矛盾:
- 更新必要:

## Commands

- [ ] pnpm install
- [ ] pnpm dev
- [ ] pnpm build
- [ ] pnpm test

## Decision

GO / HOLD / NO-GO

## Next


```

---

# 7. Go条件

```txt
[ ] READMEが現在方針に合っている
[ ] Prototype 1の目的が明確
[ ] package.jsonで起動準備がある
[ ] srcに邪魔な実装がない
[ ] docs正本が矛盾していない
```

---

# 8. No-Go条件

```txt
[ ] 依存関係が壊れている
[ ] 起動できない原因が不明
[ ] Prototype 1スコープ外の実装が混ざりすぎている
[ ] docsの正本が矛盾している
```

No-Goなら実装に入らず、棚卸し修正を先にする。

---

# 最重要

実装前に見るべきものは「作りたいもの」ではなく、これ。

```txt
Prototype 1の検証を邪魔するものがないか。
```

邪魔なものは、良いアイデアでも後回しにする。
