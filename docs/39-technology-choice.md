# 技術選定: 作りやすさ優先の判断

## 結論

Vamp Pon を作りやすさ優先で進めるなら、最初は以下が最適。

```txt
Vite + TypeScript + Phaser
```

まずは Web ゲームとして作る。

その後、必要に応じて以下へ進める。

```txt
スマホブラウザ対応
PWA化
Capacitorでアプリ化
必要なら後で Unity / Godot へ移植
```

## なぜ Web + TypeScript + Phaser か

### 1. 実装しやすい

このプロジェクトは、まだデザインを保留しながら、ゲームロジックを詰めていく段階。

TypeScript なら、以下がやりやすい。

```txt
型定義
データ駆動
武器/敵/ウェーブの調整
GitHub上での差分管理
レビュー
小さな修正の連続
```

Unity/Godot はゲーム制作には強いが、エディタ操作・シーン設定・アセット管理が絡むため、チャットから継続実装するには少し重い。

### 2. ユーザーが確認しやすい

Webなら、まずブラウザで確認できる。

```txt
pnpm dev
スマホブラウザでアクセス
縦持ち確認
操作感確認
```

アプリストア申請やネイティブビルドの前に、ゲームとして面白いか確認できる。

### 3. 仕様変更に強い

Vamp Pon はまだ以下が動く可能性がある。

```txt
1プレイ時間
敵密度
必殺技
レベルアップ仕様
記憶カプセル
裏ストーリー断片
縦持ち/横持ち
```

この段階で Unity やネイティブアプリに寄せすぎると、変更コストが上がる。

### 4. デザイン保留と相性が良い

今はデザインが重要なので保留。

Web + Phaser なら、仮素材でロジックだけ作れる。

```txt
円
四角
線
仮アイコン
単色背景
```

で操作感・敵密度・レベルアップ・進化・必殺技を先に検証できる。

## 候補比較

| 技術 | 作りやすさ | スマホ確認 | アプリ化 | 調整の速さ | コメント |
|---|---:|---:|---:|---:|---|
| Vite + TypeScript + Phaser | A | A | B | A | 最初の本命 |
| Next.js + Canvas | B | A | B | B | ゲームループ実装がやや手作り |
| PixiJS | B+ | A | B | A | 描画は強いがゲーム機能は自前寄り |
| Unity | B | A | A | C | 完成アプリには強いが初速が重い |
| Godot | B | A | A- | B | 軽いがツール操作依存が増える |
| React Native | C | A | A | C | この手のゲームには向きにくい |
| Flutter | C+ | A | A | C | UIアプリ向き、弾幕/大量敵は工夫が必要 |

## Phaserを選ぶ理由

Phaser は 2D ゲーム向けで、以下を持っている。

```txt
ゲームループ
シーン管理
入力
スプライト
物理/当たり判定
カメラ
タイマー
簡単なエフェクト
```

Vamp Pon に必要なものと相性が良い。

```txt
自動攻撃
大量敵
弾
経験値/欠片
レベルアップ画面
シーン遷移
スマホ入力
```

## Webで作る場合の完成ルート

### Route 1: Webプロトタイプ

```txt
Vite + TypeScript + Phaser
pnpm dev
スマホブラウザで確認
```

目的:

```txt
ゲーム性検証
操作感確認
敵密度調整
1プレイ時間確認
```

### Route 2: PWA

```txt
ホーム画面に追加
全画面表示
ローカル保存
```

目的:

```txt
アプリっぽく触る
ストア申請なしで配布/確認
```

### Route 3: Capacitor

```txt
WebゲームをiOS/Androidアプリの箱に入れる
```

目的:

```txt
アプリ化の初期検証
端末機能/ストア提出の可能性確認
```

### Route 4: Unity/Godot移植

ゲームが面白いと分かった後で検討。

目的:

```txt
本格アプリ化
パフォーマンス向上
ストア向け品質
```

## 最初からUnityにしない理由

Unityは悪くない。

ただし、今の段階では以下が重い。

```txt
エディタ操作前提
Prefab/Scene管理
Git差分が見づらい場面がある
チャットでの修正指示がやや間接的
プロトタイプの仕様変更が重い
```

ゲーム性が固まってからなら強い。

今はまだ早い。

## 最初からReact Native/Flutterにしない理由

Vamp Pon は UI アプリではなく、2Dアクションゲーム。

React Native/Flutter でも作れなくはないが、以下が重い。

```txt
ゲームループ
大量オブジェクト
当たり判定
弾処理
敵スポーン
パフォーマンス調整
```

この用途では、ゲームエンジン寄りの Phaser の方が素直。

## MVP推奨スタック

```txt
Runtime: Web
Language: TypeScript
Bundler: Vite
Game Engine: Phaser
Package Manager: pnpm
Storage: localStorage
Data: TypeScript object first, JSON compatible
Test: Vitest
Deploy preview: Vercel / GitHub Pages / Cloudflare Pages など後で判断
```

## 初期ディレクトリ案

```txt
src/
  main.ts
  game/
    scenes/
      BootScene.ts
      MainScene.ts
      ResultScene.ts
    systems/
      MovementSystem.ts
      EnemySpawnSystem.ts
      EnemyAISystem.ts
      WeaponSystem.ts
      ProjectileSystem.ts
      XpSystem.ts
      LevelUpSystem.ts
      EvolutionSystem.ts
      UltimateSystem.ts
      SaveSystem.ts
      ResultSystem.ts
    data/
      characters.ts
      weapons.ts
      passives.ts
      enemies.ts
      waves.ts
      evolutions.ts
      achievements.ts
      codex.ts
      powerups.ts
    domain/
      types.ts
      constants.ts
      balance.ts
    ui/
      levelUp.ts
      capsule.ts
      result.ts
```

## 最初に作るべきプロトタイプ

デザインを保留するので、仮素材でよい。

### Prototype 1

```txt
縦持ち固定
ユイだけ
インクの影だけ
夜の鉛筆だけ
欠片ドロップ
レベルアップ1回
```

完了条件:

```txt
スマホブラウザで1分遊べる
```

### Prototype 2

```txt
武器5種
パッシブ5種
3択レベルアップ
敵3種
3分カプセル
```

完了条件:

```txt
3〜5分遊んでビルド差が出る
```

### Prototype 3

```txt
8分 or 10分ウェーブ
敵5種
強敵
記憶カプセル
進化1〜2種
必殺技1種
リザルト
```

完了条件:

```txt
MVPとして評価できる
```

## 技術選定の最終判断

現時点ではこれ。

```txt
Vite + TypeScript + Phaser で進める
```

理由:

```txt
作りやすい
確認しやすい
仕様変更に強い
Webでもアプリ化でも逃げ道がある
デザイン保留と相性が良い
```

## 注意点

Webで作るなら、スマホ性能は最初から意識する。

```txt
敵数上限
欠片上限
弾数上限
オブジェクトプール
画面停止を短く
localStorage保存
非アクティブ時ポーズ
```

これを最初から設計に入れる。

## 結論

君が言う通り、Webでも良い。

むしろ今は Web が一番良い。

```txt
まずWebで作る
スマホブラウザで縦持ち確認
面白ければPWA/Capacitor
必要になったらUnity/Godot移植
```

これが一番無駄が少ない。
