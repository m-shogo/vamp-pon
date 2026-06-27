# Vamp Pon

Vamp Pon は正式販売タイトルではなく、開発コード名です。

Vamp Pon は、スマホ縦持ち向けのサバイバルローグライトです。

---

## 一言コンセプト

```txt
影を払い、記憶を拾い、朝まで残る。
```

夜にあふれる影を払い、消えかけた記憶を朝までに取り戻す、縦持ちサバイバルローグライトです。

---

## 最新の正本入口

最新のキャラ量産・アイテム・A-Z灯紋・UI用語は、まずここを読む。

```txt
docs/181-current-production-canon.md
```

重要な現行資料:

```txt
docs/180-unified-character-canon.md
docs/design/world-labels.md
docs/design/item-and-character-production-canon.md
docs/design/character-production-plans.md
docs/design/emblem-canon.md
docs/design/az-emblem-canon.md
docs/prompts/az-emblem-asset-prompts.md
```

---

## 現在の状態

**MVP v0.1 — playable（generated素材）**

ユイで8分のサバイバルが一通り遊べます。
主要素材は generated PNG に移行済み。ユイ4ポーズ（`yui_idle` / `yui_move` / `yui_hurt` / `yui_ultimate`）は v4·42 prototype と参照絵を基準にした 42px ネイティブ Aseprite hand-final candidate です。

設計面では、Core5と20キャラの正本データ、アイテム量産設計、黒耀化副題、Core5灯合わせ、A-Z灯紋まで追加済みです。ただし、すべてが runtime UI / weapons / passives / rareItems / evolutions に反映済みという意味ではありません。

---

## 実装済み

```txt
移動（仮想スティック / WASD・矢印）
自動攻撃
記憶片の吸引・回収
3択レベルアップ（強化 / 新規 / 回復）
灯具5種（射出 / 反射 / オービット / 地面DoT / 拡散）
持ち物5種相当（回収 / 灯力 / 成長 / 足取り / 手数）
敵6種 + 8分ウェーブ（3:00 / 5:00 / 7:00 にエリート）
記憶包み（進化 > 強化 > 通貨）
進化2種
暁灯「消えない名前」
HUD / ポーズ / クリア / ゲームオーバー / 旅の記録
ロジックのユニットテスト（vitest）
```

---

## 現行の用語

```txt
灯技 / 継灯 / 暁灯
黒耀化 / 煤返り / 黒耀瓶
灯具 / 持ち物 / 忘れ物 / 落とし物 / 記憶片
灯継ぎ / 暁開き / 灯合わせ
灯録 / 記憶のしるし / 旅の記録 / 夜明け
灯紋具 / 灯紋 / 無紋 / 暁紋 / 黒紋 / 双灯紋 / A-Z灯紋
```

---

## 次にやる

計測と素材制作ラインの土台は実装済み（プレイログ自動出力・debug表示・assetManifest検証・Aseprite export導線）。
次は **詰めた正本を runtime data と UI 表示へ反映する段階**。

```txt
1. Core5分の不足している灯具 / 持ち物 / 忘れ物 / 灯継ぎ / 暁開きを既存データへ追加する
2. HUD / レベルアップ / 灯録 / 旅の記録の旧用語を WORLD_TERMS 参照へ寄せる
3. キャラ選択は Core5 のみ段階導入する
4. A-Z灯紋は灯録・旅人の記録・キャラ選択へ normal 相から表示する
5. season_seed / future_seed / shadow5 はデータだけ保持し、選択画面には出さない
6. 42pxネイティブ版ユイの後半密度・実機視認性確認を継続する
```

参照: ハンドファイナル手順は [docs/yui-aseprite-hand-final-plan.md](docs/yui-aseprite-hand-final-plan.md)、32px高密度化案は [docs/yui-32px-redesign-notes.md](docs/yui-32px-redesign-notes.md)、見た目サイズ(42px前後)案は [docs/yui-42px-visual-size-test.md](docs/yui-42px-visual-size-test.md)。

調整の指標→数値マップは [docs/balance-log.md](docs/balance-log.md) の「序盤（0:00〜3:00）調整ガイド」を参照。

- ゲーム終了時にコンソールへ `[vamp-pon playlog] {...}` を1行JSONで出力（リザルト画面にも主要計測値）。
- プレイログ様式・チェックリストは [docs/balance-log.md](docs/balance-log.md) を参照。

---

## 開発・起動

```sh
pnpm install      # 依存インストール
pnpm dev          # 開発サーバ（http://localhost:5173）
pnpm build        # 型チェック + 本番ビルド
pnpm test         # ロジックのユニットテスト（vitest）
pnpm aseprite:check       # Aseprite stable v1.3.17.x のCLI確認
pnpm aseprite:export:yui  # ユイ4ポーズのsourceがあればPNGへexport
```

- スマホ縦持ち（390×844 論理解像度）を想定。
- 操作: 画面左半分ドラッグの仮想スティック / PCは WASD・矢印キー。暁灯は画面右半分タップ。
- `?debug=true` を付けるとデバッグ表示（経過秒・敵数・HP・XPなど）。
- `?scene=yui-gallery` でユイ4ポーズ、1x/3x、hitCore/debug円相当を確認（42pxネイティブHF候補）。
- `?scene=yui-redesign42` で42pxネイティブ本番候補と 40/44 の戻し候補を比較。
- `?scene=combat-mock&density=late` で8分後半相当の視認性入口を確認。

実装の構成は [docs/98-target-code-architecture.md](docs/98-target-code-architecture.md)、データ契約は [docs/81-data-contract.md](docs/81-data-contract.md) を参照。

---

## 技術方針

```txt
Web ベース
Vite + TypeScript
スマホブラウザで縦持ち検証
PWA / Capacitor / アプリ化は後
```

---

## MVPの最重要問い

```txt
仮素材でも、ユイで8分遊んで、もう一度遊びたいか？
```

この問いにYESを出すまで、キャラ・ステージ・本格デザイン・アプリ化を広げすぎません。
ただし、キャラ量産の正本データとA-Z灯紋の設計は将来拡張のため保持します。

---

## 採用ビジュアル方向

```txt
紙片・絵本風ドット
夜の街
黒インクの影
小さなランタン
光る記憶片
紙カードUI
A-Z灯紋
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

企画・仕様の入口は [docs/181-current-production-canon.md](docs/181-current-production-canon.md)。

> ⚠️ 注意: `docs/` には MVP 実装より前に書かれた **Pre-MVP（Prototype 1 段階）資料** が多数含まれます。
> 「Prototype 1 では◯◯を作らない」「1分の核だけ作る」といった記述は、当時のスコープを指す歴史的経緯です。
> 古い資料と矛盾した時は `docs/181-current-production-canon.md` と `src/game/data/*` を正とします。

現在の実装に直接効く主な資料:

```txt
docs/181-current-production-canon.md      最新の正本入口
docs/180-unified-character-canon.md       キャラ正本
docs/design/world-labels.md               用語正本
docs/design/character-production-plans.md 20キャラ量産表
docs/design/emblem-canon.md               A-Z灯紋詳細
docs/81-data-contract.md                  データ契約
docs/82-balance-target-matrix-...         バランス目標
docs/98-target-code-architecture.md       コード構成
docs/44-core-loop-and-player-...          8分タイムライン
docs/balance-log.md                       調整ログ
```

---

## 注意

パスワード、認証コード、秘密鍵、トークンなどの機密情報はリポジトリに保存しないでください。

外部素材を使う場合は、必ず `docs/asset-license-log.md` に出所とライセンスを記録します。
