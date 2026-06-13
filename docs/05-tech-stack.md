# 技術方針

## 結論

最初は **Vite + TypeScript + Phaser** を第一候補にする。

理由:

- ブラウザで遊べる
- 個人開発で始めやすい
- 2Dゲームの当たり判定・描画・シーン管理を任せられる
- React単体よりゲーム本体を作りやすい
- 将来的にUIだけReactへ分ける余地がある

## 推奨構成

```txt
vamp-pon/
  public/
    assets/
  src/
    main.ts
    game/
      scenes/
        BootScene.ts
        MainScene.ts
        ResultScene.ts
      entities/
        Player.ts
        Enemy.ts
        Projectile.ts
      systems/
        CombatSystem.ts
        EnemySpawnSystem.ts
        FiveFrontSystem.ts
        LevelUpSystem.ts
      data/
        enemies.ts
        upgrades.ts
        waves.ts
      ui/
        FrontStatusView.ts
  docs/
  package.json
  index.html
  tsconfig.json
  vite.config.ts
```

## Phaserを使う理由

### 良い点

- ゲームループを自前で全部書かなくてよい
- スプライト・衝突判定・入力処理が揃っている
- 2Dゲームとの相性が良い
- Vite + TypeScript と組み合わせやすい

### 注意点

- Reactの思想とは違う
- 状態管理を雑にすると壊れやすい
- DOM UIとCanvas UIを混ぜると複雑化しやすい

## React単体で作る場合の問題

Reactだけでも簡単なゲームは作れる。

ただし、Vamp Pon のように以下が必要になると厳しくなる。

- 敵が多い
- 弾が多い
- 毎フレーム更新
- 当たり判定
- 自動攻撃
- 敵の移動
- エフェクト

ReactはUIには強いが、ゲームループ本体には向かない。

## Reactを使うならどこか

本体はPhaser。

Reactを使うなら、以下の外側UIに限定する。

- タイトル画面
- 設定画面
- 図鑑
- リザルト詳細
- 開発用デバッグパネル

MVPではReactを入れない方がよい。

## 状態管理方針

MVPでは状態管理ライブラリを入れない。

まずはTypeScriptのクラス・プレーンオブジェクトで十分。

例:

- `PlayerState`
- `EnemyState`
- `FrontState`
- `RunState`

グローバル状態が増えたら、後から整理する。

## テスト方針

最初から重いテストは不要。

ただし、ロジックは分離する。

テストしやすくしたいもの:

- 5戦線判定
- 危険度計算
- 敵ウェーブ生成
- レベルアップ候補抽選

## 最初に入れるnpm scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "typecheck": "tsc --noEmit"
  }
}
```

## 実装順

1. Vite + TypeScript + Phaser 起動
2. 黒背景にプレイヤー表示
3. 移動
4. 敵スポーン
5. 自動攻撃
6. HP/被弾
7. 5戦線UI
8. 危険度計算
9. レベルアップ仮UI
10. リザルト

## やらない構成

### Next.jsから始める

ゲーム本体に対して重い。

将来的に紹介サイトやログ閲覧UIを作るなら検討。

### React + Canvas自作

できるが、当たり判定やゲームループを自前実装しがちで遠回り。

### Unity

Web公開や個人のフロントエンド作業導線と比べると重い。

### いきなりスマホ最適化

操作設計が変わるため後回し。

## 判断基準

技術選定で迷ったら、以下を優先する。

1. すぐ動く
2. 小さく作れる
3. ブラウザで見られる
4. AIエージェントが編集しやすい
5. ゲームの芯の検証を邪魔しない
