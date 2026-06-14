# Vamp Pon

Vamp Pon は、スマホ縦持ち向けのサバイバルローグライトです。

---

## 一言コンセプト

```txt
影を払い、記憶を拾い、朝まで残る。
```

夜にあふれる影を払い、消えかけた記憶を朝までに取り戻す、縦持ちサバイバルローグライトです。

---

## 現在の状態

**MVP v0.1 — playable（generated素材）**

ユイで8分のサバイバルが一通り遊べます。
主要素材は generated PNG に移行済みですが、ユイ4ポーズはまだ generated-draft で、Aseprite hand-final 前です。

---

## 実装済み

```txt
移動（仮想スティック / WASD・矢印）
自動攻撃
記憶の欠片の吸引・回収
3択レベルアップ（強化 / 新規 / 回復）
武器5種（射出 / 反射 / オービット / 地面DoT / 拡散）
パッシブ5種（吸引 / 攻撃 / 経験値 / 移動 / CT）
敵6種 + 8分ウェーブ（3:00 / 5:00 / 7:00 にエリート）
記憶カプセル（進化 > 強化 > 通貨）
進化2種
必殺技「消えない名前」
HUD / ポーズ / クリア / ゲームオーバー / リザルト
ロジックのユニットテスト（vitest）
```

---

## 次にやる

計測と素材制作ラインの土台は実装済み（プレイログ自動出力・debug表示・assetManifest検証・Aseprite export導線）。
次は **ユイ hand-final 入口と後半密度の視認性確認** を詰める段階。

```txt
1. Aseprite stable v1.3.17.1 で yui_idle を hand-final 候補にする
2. /?scene=yui-gallery で 1x / 4x / 背景上 / hitCore 位置を確認する
3. yui_move → yui_hurt → yui_ultimate の順で source を作る
4. /?scene=combat-mock&density=late で後半密度の視認性を確認する
5. 実機/実ブラウザでプレイログを docs/balance-log.md へ貼る
```

調整の指標→数値マップは [docs/balance-log.md](docs/balance-log.md) の「序盤（0:00〜3:00）調整ガイド」を参照。

- ゲーム終了時にコンソールへ `[vamp-pon playlog] {...}` を1行JSONで出力（リザルト画面にも主要計測値）。
- プレイログ様式・チェックリストは [docs/balance-log.md](docs/balance-log.md) を参照。
- まだ **新キャラ / 新ステージ / 新武器 / PWA化は入れない**（ユイとStage 1を詰めてから進める）。

---

## 開発・起動

```sh
pnpm install      # 依存インストール
pnpm dev          # 開発サーバ（http://localhost:5173）
pnpm build        # 型チェック + 本番ビルド
pnpm test         # ロジックのユニットテスト（vitest）
pnpm aseprite:check       # Aseprite stable v1.3.17.1 のCLI確認
pnpm aseprite:export:yui  # ユイ4ポーズのsourceがあればPNGへexport
```

- スマホ縦持ち（390×844 論理解像度）を想定。
- 操作: 画面左半分ドラッグの仮想スティック / PCは WASD・矢印キー。必殺技は画面右半分タップ。
- `?debug=true` を付けるとデバッグ表示（経過秒・敵数・HP・XPなど）。
- `?scene=yui-gallery` でユイ4ポーズ、1x/4x、hitCore/debug円相当を確認。
- `?scene=combat-mock&density=late` で8分後半相当の視認性入口を確認。

実装の構成は [docs/98-target-code-architecture.md](docs/98-target-code-architecture.md)、データ契約は [docs/81-data-contract.md](docs/81-data-contract.md) を参照。

---

## 技術方針

```txt
Web ベース
Vite + TypeScript + Phaser
スマホブラウザで縦持ち検証
PWA / Capacitor / アプリ化は後
```

---

## MVPの最重要問い

```txt
仮素材でも、ユイで8分遊んで、もう一度遊びたいか？
```

この問いにYESを出すまで、キャラ・ステージ・本格デザイン・アプリ化を広げません。

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

詳細は [docs/88-adopted-visual-direction.md](docs/88-adopted-visual-direction.md)。

---

## 資料（docs/）

企画・仕様の入口は [docs/52-gdd-index.md](docs/52-gdd-index.md)。

> ⚠️ 注意: `docs/` には MVP 実装より前に書かれた **Pre-MVP（Prototype 1 段階）資料** が多数含まれます。
> 「Prototype 1 では◯◯を作らない」「1分の核だけ作る」といった記述は、当時のスコープを指す**歴史的経緯**であり、現在の実装状態（上記「実装済み」）とは異なります。
> 実装の現状は本 README と `src/` を正とし、`docs/` は設計意図・データ契約・世界観の参照として読んでください。

現在の実装に直接効く主な資料:

```txt
docs/81-data-contract.md            データ契約
docs/82-balance-target-matrix-...   バランス目標
docs/98-target-code-architecture.md コード構成
docs/44-core-loop-and-player-...    8分タイムライン
docs/balance-log.md                 調整ログ
```

---

## 注意

パスワード、認証コード、秘密鍵、トークンなどの機密情報はリポジトリに保存しないでください。

外部素材を使う場合は、必ず `docs/asset-license-log.md` に出所とライセンスを記録します。
