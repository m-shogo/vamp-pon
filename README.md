# Vamp Pon

Vamp Pon は、スマホ縦持ち向けのサバイバルローグライト企画です。

現在は **MVP v0.1 実装済み（仮素材・プレイ可能）** の状態です。

ユイで8分のサバイバルが一通り遊べます（移動・自動攻撃・欠片回収・3択レベルアップ・武器5/パッシブ5・8分ウェーブ・記憶カプセル・進化2・必殺技・リザルト）。見た目はPhaser図形の仮実装です。

---

## 一言コンセプト

```txt
影を払い、記憶を拾い、朝まで残る。
```

夜にあふれる影を払い、消えかけた記憶を朝までに取り戻す、縦持ちサバイバルローグライトです。

---

## 開発・起動

```sh
pnpm install      # 依存インストール
pnpm dev          # 開発サーバ（http://localhost:5173）
pnpm build        # 型チェック + 本番ビルド
pnpm test         # ロジックのユニットテスト（vitest）
```

- スマホ縦持ち（390×844 論理解像度）を想定。
- 操作: 画面左半分ドラッグの仮想スティック / PCは WASD・矢印キー。必殺技は画面右半分タップ。
- `?debug=true` を付けるとデバッグ表示（経過秒・敵数・HP・XPなど）。

実装の構成は [docs/98-target-code-architecture.md](docs/98-target-code-architecture.md)、データ契約は [docs/81-data-contract.md](docs/81-data-contract.md) を参照。

---

## 現在の方針

```txt
Webベース
Vite + TypeScript + Phaser
スマホブラウザで縦持ち検証
Prototype 1では1分の核だけ作る
面白さが見えたらPrototype 2/3へ進む
PWA/Capacitor/アプリ化は後
```

---

## MVPの最重要問い

```txt
仮素材でも、ユイで8分遊んで、もう一度遊びたいか？
```

この問いにYESを出すまで、キャラ・ステージ・本格デザイン・アプリ化を広げません。

---

## いま作るもの

Prototype 1では、これだけ作ります。

```txt
移動
自動攻撃
欠片回収
初レベルアップ
```

具体的には:

```txt
ユイ
インクの影
夜の鉛筆
記憶の欠片
XP / Lv2
簡易HUD
被弾最小
debug
```

---

## いま作らないもの

```txt
武器5種
パッシブ5種
記憶カプセル
進化
必殺技
ミチル
Stage 2以降
ボス
本格デザイン
PWA/Capacitor
ストア対応
```

これらはFuture LayerまたはPrototype 2以降です。

---

## GDD入口

資料の入口は以下です。

```txt
docs/52-gdd-index.md
```

Prototype 1実装前に読む資料:

```txt
docs/77-prototype-1-documentation-signoff.md
docs/83-spec-signoff.md
docs/95-prototype-1-implementation-brief.md
docs/96-final-preflight-checklist.md
```

ビジュアル方向:

```txt
docs/88-adopted-visual-direction.md
docs/89-prototype-1-visual-guardrail.md
docs/91-minimum-asset-spec.md
docs/92-prototype-1-asset-checklist.md
```

進行/破綻防止:

```txt
docs/86-future-layer-governance.md
docs/93-deferred-detail-backlog.md
docs/94-next-required-work-roadmap.md
```

---

## 採用ビジュアル方向

```txt
紙片・絵本風ドット
夜の街
黒インクの影
小さなランタン
光る記憶の欠片
紙カードUI
やさしい不穏さ
```

重要:

```txt
コンセプトは濃く。
実装は見やすく軽く。
```

---

## Prototype 1 Go条件

```txt
3秒以内に動かし方が分かる
最初の敵を10秒以内に倒せる
30秒以内に欠片回収の意味が分かる
60秒以内にLv2になる
スマホで操作が不快ではない
```

---

## 注意

パスワード、認証コード、秘密鍵、トークンなどの機密情報はリポジトリに保存しないでください。

外部素材を使う場合は、必ず `docs/asset-license-log.md` に出所とライセンスを記録します。
