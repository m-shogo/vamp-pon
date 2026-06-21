# Agent Implementation Prompt

## 目的

Codex / Claude / Fable / Cursor などの実装エージェントへ渡すための、Prototype 1実装プロンプト。

---

# Prompt

```txt
/Users/m-shogo/Developer/personal/vamp-pon
https://github.com/m-shogo/vamp-pon.git
のみを対象にしてください。

Vamp Pon の Prototype 1 を実装してください。

重要: 完成版を作らないでください。Prototype 1は「1分の核」を検証するための実装です。

目的:
スマホ縦持ちで、ユイを動かし、黒インクの影を夜の鉛筆で払い、記憶の欠片を拾い、60秒以内にLv2へ到達できるようにする。

作るもの:
- Vite + TypeScript + Phaser 起動
- 390x844 縦持ちキャンバス
- ユイ仮表示
- PC用キーボード移動
- スマホ用仮想スティック移動
- インクの影スポーン
- インクの影がプレイヤーを追跡
- 夜の鉛筆の自動攻撃
- 弾と敵の衝突
- 敵死亡
- 記憶の欠片ドロップ
- 欠片吸引/取得
- XP加算
- Lv2到達
- 簡易HUD
- 被弾/HP減少
- HP0でgameOver
- debug表示

絶対に作らないもの:
- 武器5種
- パッシブ5種
- 3択正式版
- 記憶カプセル
- 進化
- 必殺技
- ミチル
- Stage 2以降
- ボス
- 本格デザイン
- PWA/Capacitor

必ず読む資料:
- README.md
- docs/95-prototype-1-implementation-brief.md
- docs/96-final-preflight-checklist.md
- docs/79-prototype-spec-lock.md
- docs/80-runtime-rules-and-collision-spec.md
- docs/91-minimum-asset-spec.md
- docs/98-target-code-architecture.md

技術:
- Vite
- TypeScript
- Phaser
- pnpm

package.jsonにはすでに scripts がある想定:
- pnpm dev
- pnpm build
- pnpm test

目標フォルダ構成:
src/
  main.ts
  styles.css
  game/
    scenes/
      MainScene.ts
    domain/
      constants.ts
      types.ts
    data/
      prototype1.ts
    systems/
      input.ts
      movement.ts
      enemies.ts
      weapons.ts
      pickups.ts
      xp.ts
      hud.ts
    utils/
      math.ts
      viewport.ts

Prototype 1数値:
- Player HP: 100
- Player moveSpeed: 100
- Ink Shadow HP: 18
- Ink Shadow speed: 55
- Ink Shadow contactDamage: 8
- Ink Shadow xpDrop: 1
- Night Pencil damage: 12
- Night Pencil cooldown: 1.25s
- Night Pencil projectileSpeed: 260px/s
- Memory Fragment collectRadius: 18px
- Memory Fragment magnetRange: 70px
- Memory Fragment magnetSpeed: 160px/s
- XP to Lv2: 8
- Enemy spawn interval: 1.2s
- Enemy maxAlive: 18
- Hit invulnerability: 0.6s

見た目:
- 本格画像は不要
- Phaser図形で仮実装してよい
- 紙片・絵本風ドットの方向を壊さない
- 背景は暗い紙風
- ユイはランタンの暖色で見える
- 敵は黒インク影 + 白い目
- 欠片は金色に光る小さな紙片/星

受け入れ条件:
- pnpm install が通る
- pnpm dev が起動する
- pnpm build が通る
- 390x844相当で表示される
- キーボードでユイを動かせる
- スマホの仮想スティックでユイを動かせる
- インクの影が湧く
- 夜の鉛筆が自動攻撃する
- 最初の敵を10秒以内に倒せる
- 欠片が出る
- 欠片を拾える
- 60秒以内にLv2になる
- 被弾でHPが減る
- HP0でgameOverになる
- debugで elapsedSec/enemyCount/pickupCount/projectileCount/playerHp/playerLv/xp が見える

実装後に報告してください:
- 変更ファイル
- 実行したコマンド
- pnpm build 結果
- 未実装/未確認
- 次に確認すべきこと

注意:
良いアイデアでもPrototype 1に不要なら入れないでください。
小さく作り、触って判断できる状態を優先してください。
```

---

# 使い方

このプロンプトを実装エージェントへ渡す。

実装後は、必ず以下を確認する。

```txt
pnpm build
スマホ縦持ち表示
60秒以内Lv2
```
