# App Production Roadmap

Vamp Pon / Lantern Ledger を「Web版の完成度向上」から「Unity移行」「Androidテスト」「ストア準備」まで進めるための実行ロードマップ。

この文書は、作業が横に広がりすぎないように、今やるべき順番と合格ラインを固定するためのもの。

## 基本方針

1. Web版で遊べる完成度を上げる。
2. 全画面 / 全機能を仕様書化する。
3. キャラ / 敵 / 武器 / ステージのデータ表を作る。
4. Unity移行用の設計書を作る。
5. Unityで最小バトルを再現する。
6. Web版の良い演出をUnityへ移植する。
7. Android実機でテストする。
8. ストア準備をする。

## 重要な判断

Unityへ急がない。

Web版で「面白さの正解」「画面の正解」「演出の正解」を作ってからUnityへ渡す。Unityは作り直し先ではなく、スマホアプリとして強くするための移植先。

## Phase 1: Web版で遊べる完成度を上げる

### 目的

Stage1を、スマホ縦画面で最後まで遊べる状態にする。

### 優先順

1. TOP → StageSelect → Battle → LevelUp → Result → Growth のループを途切れさせない。
2. 敵を倒す気持ちよさを上げる。
3. EXP吸引、レベルアップ、進化、黒曜化の演出を強くする。
4. 負けても成長できる導線を入れる。
5. 390x844で文字・ボタン・HUDが読めるようにする。

### 合格ライン

- 1回のプレイが成立する。
- 最初の30秒で敵を倒す気持ちよさがある。
- LvUpカードが読みやすい。
- Resultで「もう1回」「強化」が押したくなる。
- Stage1 Easyは初心者でも突破できる。

### まだ増やさないもの

- キャラ大量追加。
- ステージ大量追加。
- 素材だけの大量生成。
- 課金 / 広告。
- Unity本実装。

## Phase 2: 全画面 / 全機能を仕様書化する

### 目的

Web版の正解を、Unityでも迷わず再現できるようにする。

### 対象画面

| 画面 | 仕様化すること |
|---|---|
| TOP | 主CTA、世界観、導線、背景演出 |
| StageSelect | ステージカード、難易度、報酬、解放条件 |
| Battle | HUD、入力、敵、攻撃、EXP、黒曜化、Pause |
| LevelUp | 3択、所持枠、入替、Rare、進化 |
| Result | 報酬、成長導線、記録、再挑戦 |
| Growth | 永続強化、通貨、リセット可否 |
| Collection | 図鑑、new表示、解放条件 |
| Settings | 音量、操作、データ、クレジット |

### 合格ライン

- 画面ごとの目的が1文で説明できる。
- 主要ボタンの押下先が決まっている。
- 保存される値が決まっている。
- Unityに渡しても解釈がブレない。

## Phase 3: データ表を作る

### 目的

コードに埋め込まれた仕様を、表として管理できる状態にする。

### 対象

- Character
- Enemy
- Weapon
- Passive
- Rare Item
- Evolution / Fusion
- Stage
- Wave
- Achievement
- Collection Record
- Permanent Growth

### 合格ライン

- `id` が安定している。
- 表示名と内部IDが分かれている。
- 画像パスが追える。
- Unity ScriptableObjectへ変換できる。
- まずStage1 MVP分だけでも成立する。

## Phase 4: Unity移行用設計書を作る

### 目的

Unityで迷わず最小デモを作れるようにする。

### 決めること

- Unity version
- URP / 2D Renderer
- Reference Resolution: 390x844
- Safe Area
- Folder Structure
- ScriptableObject構造
- Prefab構造
- Scene構成
- Input方式
- Save方式
- Asset命名規則

### 合格ライン

- 30秒デモに必要なScene / Prefab / Dataが列挙されている。
- Web版からUnityへ移すもの、移さないものが分かれている。
- 本移行ではなく、検証デモとして切れる。

## Phase 5: Unityで最小バトルを再現

### 目的

Unityの方がゲームフィールを上げられるか検証する。

### 最小デモ内容

1. Yuiが移動できる。
2. Ombuが湧く。
3. 自動攻撃で倒せる。
4. EXPが落ちる。
5. EXPが吸引される。
6. LvUp 3択が出る。
7. 黒曜化 / Ultimateを1回出せる。
8. Resultへ遷移する。

### 合格ライン

- Web版より光、インク、吸引、ヒット感が良い。
- 実機で重くない。
- 量産できそうなPrefab構造になっている。

## Phase 6: Web版の良い演出をUnityへ移植

### 優先する演出

1. 敵撃破のInk Burst。
2. EXP吸引のTrail。
3. LevelUpカードの紙演出。
4. 黒曜化の画面端インク。
5. Ultimate Cutin。
6. Resultの朝焼け演出。

### 合格ライン

- Unity移植後もWeb版の世界観が薄まらない。
- 派手だが視認性を壊さない。
- 390x844で読める。

## Phase 7: Androidテスト

### 目的

スマホ実機で「遊べる」「読める」「重くない」を確認する。

### 確認項目

- 起動時間。
- 30fps / 60fps。
- 発熱。
- バッテリー消費。
- タッチ操作。
- Safe Area。
- 文字サイズ。
- 音量。
- 戻るボタン。
- 中断 / 復帰。

### 合格ライン

- Stage1を最後まで遊べる。
- フレーム落ちで攻撃・回避が不快にならない。
- UI誤タップが少ない。

## Phase 8: ストア準備

### 目的

Android beta / closed testへ進める素材と説明を揃える。

### 必要物

- App icon
- Feature graphic
- Screenshots
- Short description
- Full description
- Privacy Policy
- Terms
- Contact
- Age rating
- Store video
- Build versioning
- Crash reporting

### 合格ライン

- 初見で世界観と遊び方が分かる。
- ストア審査に必要な説明が揃う。
- まずAndroidでテスト配布できる。

## 迷った時の優先順位

```txt
1. Stage1が楽しいか
2. 30秒で気持ちいいか
3. 文字が読めるか
4. もう1回押したくなるか
5. Unityへ渡せる形になっているか
```

## やらない判断

次のものは、Stage1の完成度が上がるまで後回し。

- 全キャラ完成。
- 全ステージ完成。
- 大量3D生成。
- ストア課金。
- 広告SDK。
- オンラインランキング。
- Unity本移行の巨大PR。

## 現時点の結論

的外れではない。

ただし今後は、素材・設定・世界観を増やすよりも、Stage1の手触り、画面ループ、仕様表、Unity移行データに寄せる。