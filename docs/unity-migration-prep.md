# Unity Migration Prep Guide

Vamp Pon / Lantern Ledger を Unity へ移行する前の準備メモ。

この文書の目的は、Phaser実装を捨てることではなく、Phaserで固めた画面品質・仕様・演出目標をUnityへスムーズに渡すこと。

## 現時点の方針

Unityは逃げ先ではなく比較対象。

1. Phaserで画面品質の正解を作る。
2. PhaserでResult / LevelUp / StageSelect / Battle HUDの方向性を確認する。
3. Unityで30秒〜60秒のVertical Sliceを作る。
4. Unityが明確に勝つなら移行する。
5. Unityが勝たないならPhaserを磨き切る。

## まだUnityへ全移行しない理由

- 仕様がまだ増え続けている。
- UIの正解をPhaser上で作っている途中。
- Unityへ行っても、正解画面がなければ同じ迷いが発生する。
- いきなり全移行すると、ゲームロジック・UI・演出・素材管理を同時に抱えて重くなる。

## Unity前にPhaserで確認すべき合格ライン

### TOP

- 起動直後に世界観が伝わる。
- 主CTAが押したく見える。
- ただのWebメニューに見えない。

### StageSelect

- 地図帳から夜路を選ぶ感じがある。
- 難易度差が文字だけではなく、紙の痛み・黒インク量・灯りで分かる。

### Battle

- ユイ / 敵 / EXP / HUD が読める。
- 撃破と吸引が気持ちいい。
- 背景が戦闘視認性を邪魔しない。

### LevelUp

- 3択カードが選びたく見える。
- Rareが特別だが下品に光らない。
- 説明文が390x844で読める。

### Result

- 精算表ではなく、記憶ページに見える。
- 成長へ進む導線が押したく見える。

### Collection

- データベースではなく、忘れ物帳 / 星図 / 記録帳に見える。

### 黒曜化

- 危険だが主人公に見える。
- 赤目悪魔化ではない。
- 黒インクに侵食されても暖色ランタンcoreが残る。

## Unityで最初に作るもの

全移行ではなく、30秒〜60秒のVertical Sliceだけを作る。

### 必須シーン

1. Title
2. Stage Start
3. Battle 30秒
4. 敵撃破
5. EXP吸引
6. LevelUp 3択
7. Ultimate / 黒曜化
8. Result Clear

### やらないこと

- 全ステージ移植
- 全キャラ移植
- 図鑑/実績の完全実装
- 永続強化の完全実装
- 課金/広告/ストア対応
- オンライン機能
- 大量3Dモデル制作
- 本番Unityプロジェクトとして作り込みすぎること

## Unityデモで判断すること

UnityがPhaserより明確に良くなるかを見る。

- 戦闘中の気持ちよさ
- ランタン光の表現
- 黒インクの表現
- EXP吸引の気持ちよさ
- カメラ揺れ / hit stop / particleの気持ちよさ
- UIの押し心地
- スマホで重すぎないか
- 今後量産できそうか

## Unityへ進むべき条件

- Battleの気持ちよさがPhaserより明確に上。
- 黒インク / ランタン / EXP吸引がかなり良い。
- UIの手触りが出る。
- スマホで重すぎない。
- 作業スピードが許容範囲。
- キャラ / 敵 / 演出の量産が見える。

## Phaser継続すべき条件

- Unityでも見た目が大して変わらない。
- 作業コストが重すぎる。
- UI実装がPhaserより遅い。
- スマホ負荷が高い。
- 素材量産が詰まる。
- 30秒デモでも完成感が出ない。

## Unityプロジェクト推奨設定

- Unity 6 LTS以降
- 2D URP
- Mobile Portrait
- Reference Resolution: 390 x 844
- Canvas Scaler: Scale With Screen Size
- TextMeshPro使用
- 2D Lights使用
- Particle System使用
- Cinemachine Camera Shake使用

## Unity画面比率

- 基準: 390x844
- 縦画面固定
- Safe Area対応
- iPhone / Android想定

## Unity Folder Structure Draft

```txt
Assets/
  _Project/
    Art/
      Characters/
      Enemies/
      UI/
      Backgrounds/
      Effects/
      Cutins/
    Audio/
      BGM/
      SE/
    Data/
      ScriptableObjects/
        Characters/
        Weapons/
        Passives/
        Stages/
        Achievements/
        Collection/
    Prefabs/
      Player/
      Enemies/
      Projectiles/
      Pickups/
      UI/
      Effects/
    Scenes/
      Boot.unity
      Title.unity
      BattleDemo.unity
      Result.unity
    Scripts/
      Core/
      Runtime/
      Player/
      Enemy/
      Combat/
      Weapons/
      Pickups/
      UI/
      Effects/
      Data/
      Save/
      Debug/
    Settings/
      URP/
      Input/
```

## PhaserからUnityへ渡すもの

### 仕様

- weapon definitions
- passive definitions
- rare item definitions
- evolution / fusion rules
- stage definitions
- enemy definitions
- achievement definitions
- collection sections
- game feel config
- UI labels
- story / world docs

### Assets

- Yui sprites
- enemy sprites
- item icons
- cutin images
- background prototypes
- design target images
- implementation target images
- audio SE/BGM if any

## 最初のUnity成果物

- Unity Editorで再生できる。
- 30秒のdemo flowが見える。
- Title → BattleDemo → LevelUp → 黒曜化/Ultimate → Result Clear が通る。
- buildは後回しでよい。
- 実装したPrefab一覧を報告する。
- Phaserから移行すべき残り仕様をリスト化する。
