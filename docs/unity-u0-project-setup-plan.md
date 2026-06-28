# Unity Phase U0 プロジェクト準備方針

作成日: 2026-06-28
対象: Web版 Vamp Pon → Unity版 Stage1 Vertical Slice

---

## 1. U0の結論

Unityプロジェクトはまだ作成しない。

U0では、Web版をUnity移行前基準として凍結し、Unity空プロジェクト作成前に必要な判断を固める。実際のUnityプロジェクト生成はPhase U1で行い、Unity Hub上で利用できる正確なEditor patchを確認してから `unity/VampPonUnity/` に作成する。

今回Web側のBattle / UI / LevelUp / Cutin / Result / Collection は変更しない。

---

## 2. Unity version候補

候補: Unity 6 LTS系。

理由:

- Stage1 Vertical Sliceの対象がモバイル2Dであり、長期サポート版を基準にしたい
- New Input System、2D Renderer、uGUI/TextMeshProを安定して使える
- 以後のiOS / Android実機検証まで同じEditor系列で進めやすい

決定方法:

- U1開始時にUnity Hubでインストール済み、またはインストール可能なUnity 6 LTSのpatchを確認する
- 作成後は `unity/VampPonUnity/ProjectSettings/ProjectVersion.txt` を正とする
- patch差異で生成差分が出るため、プロジェクト作成後はEditor versionを不用意に上げない

---

## 3. Render Pipeline判断

採用: 2D URP。

理由:

- 将来の黒インク、暖色ランタン、低HP edge pulseなどをUnity側VFXへ移す余地がある
- 2D Rendererを使えばSprite / Particle / UIの表現を段階的に整えやすい
- Unity版ではWebのPhaser描画を移植せず、Unityの2D表現へ置き換える方針に合う

制約:

- U1ではカスタムRender FeatureやShaderを作らない
- U2/U3の戦闘再現が優先で、URP表現の作り込みはU5まで深追いしない
- 2D URPテンプレート作成で問題が出る場合だけ、U1開始前にBuilt-inへ戻す判断をする

---

## 4. Unityプロジェクト配置

配置先:

```text
unity/VampPonUnity/
```

理由:

- 既存Web実装と同じGit repo内で、仕様・素材・実装の対応を追いやすい
- repo直下にUnityの `Assets/` や `ProjectSettings/` を置くとWeb側の `assets/` と混ざりやすい
- Unity生成物を `unity/**` の `.gitignore` で安全に除外しやすい

管理対象:

```text
unity/VampPonUnity/Assets/
unity/VampPonUnity/Packages/
unity/VampPonUnity/ProjectSettings/
```

管理しない:

```text
unity/VampPonUnity/Library/
unity/VampPonUnity/Temp/
unity/VampPonUnity/Obj/
unity/VampPonUnity/Build/
unity/VampPonUnity/Builds/
unity/VampPonUnity/Logs/
unity/VampPonUnity/UserSettings/
```

---

## 5. Unity用Git管理方針

`.gitignore` はPhase U0で先に追加する。

方針:

- Unity生成物はcommitしない
- `ProjectSettings/Packages/Assets/` のみ必要に応じて管理する
- `.meta` はUnityプロジェクト作成後に必ず管理する
- 大きなバイナリ素材を入れる前に、持ち込み対象を `docs/unity-asset-import-map.md` と照合する
- `public/assets/sprites/` はretiredのため参照もコピーもしない

U1で確認すること:

- 空プロジェクト作成直後に `git status --short` で生成物が混ざっていないこと
- `Library/`, `Logs/`, `UserSettings/` が出てもgit管理対象にならないこと
- `.meta` が必要なAssets配下だけに出ていること

---

## 6. Assets/ 初期フォルダ構成

Unity作成後の初期構成:

```text
unity/VampPonUnity/Assets/
  _Project/
    Art/
      Characters/
        Yui/
      Enemies/
      Backgrounds/
      UI/
        Icons/
          Weapons/
          Passives/
          Rares/
        Hud/
    Audio/
      Bgm/
      Se/
    Data/
      Config/
      Stages/
      Enemies/
      Weapons/
      Passives/
      Rares/
      Evolutions/
    Prefabs/
      Player/
      Enemies/
      Pickups/
      UI/
      Systems/
    Scenes/
      Boot/
      Stage1/
      Result/
      StageSelect/
    Scripts/
      Core/
      Runtime/
      Input/
      Player/
      Enemies/
      Weapons/
      Pickups/
      LevelUp/
      UI/
      Data/
      Save/
      Debug/
    Settings/
    Tests/
      EditMode/
      PlayMode/
```

初期は空フォルダだけを大量に作らない。Unityは空フォルダも `.meta` を作るため、U1ではBoot / Stage1 / Scripts / Data / Settingsなど必要最小限から開始する。

---

## 7. Web資産の持ち込み方針

原則:

- Webの実装コードは移植対象ではなく、仕様参照として扱う
- PNG素材はUnity配下へコピーしてからimport設定を行う
- UnityからWebの `public/` を直接参照しない
- AI画像のfinal PNGを1枚絵として貼らない

U1/U2で最初に持ち込む候補:

| 用途 | Web側参照元 | Unity側予定 |
|---|---|---|
| ユイ | `public/assets/prototypes/sprite-sheets/core5-original-frames/yui/` | `Assets/_Project/Art/Characters/Yui/` |
| Stage1背景 | `public/assets/prototypes/backgrounds/` | `Assets/_Project/Art/Backgrounds/` |
| 敵 | `public/assets/prototypes/sprite-sheets/enemies-original/` | `Assets/_Project/Art/Enemies/` |
| 武器icon | `public/assets/prototypes/sprite-sheets/weapon/` | `Assets/_Project/Art/UI/Icons/Weapons/` |
| passive icon | `public/assets/prototypes/sprite-sheets/passive/` | `Assets/_Project/Art/UI/Icons/Passives/` |
| rare icon | `public/assets/prototypes/sprite-sheets/rare/` | `Assets/_Project/Art/UI/Icons/Rares/` |

retired:

- `public/assets/sprites/` は持ち込まない
- 旧pixel生成ルール由来の生成物は採用判断なしに増やさない

---

## 8. ScriptableObject化の最初の対象

最初に作る対象:

1. `GameFeelConfig`
2. `StageDefinition`
3. `EnemyDefinition`
4. `WeaponDefinition`

理由:

- U2/U3でStage1最低戦闘を作る時に、Web値との対応が崩れにくい
- `GameFeelConfig.ts` の数値をC#コードへ直書きしないで済む
- 敵、武器、XP、LvUpの責務分離に入りやすい

U3以降:

- `PassiveDefinition`
- `RareItemDefinition`
- `EvolutionDefinition`

注意:

- `dawn_ticket` は `survival_revival` としてQA限定にする
- `role === 'awakening_material'` 相当の通常候補ゲートはUnity側でも維持する
- 通常runへ `dawn_ticket` を混ぜる調整はU0/U1では行わない

---

## 9. 最初のScene構成

最小構成:

```text
Boot.unity
Stage1.unity
```

`Boot.unity`:

- 初期設定読み込み
- Debug / QAフラグの受け口
- Stage1へ遷移

`Stage1.unity`:

- `GameManager`
- `RunController`
- `MainCamera`
- `StageRoot`
- `PlayerRoot`
- `EnemyRoot`
- `PickupRoot`
- `ProjectileRoot`
- `PoolRoot`
- `SafeAreaCanvas`
- `HudRoot`
- `OverlayRoot`

Result / StageSelectはU4以降に最低導線として追加する。U1では空Sceneの縦画面起動を優先する。

---

## 10. 390x844縦画面基盤

基準:

- Portrait固定
- UI参照解像度: 390 x 844
- Safe Area内にHUD、下部入力、カードUIを配置する
- gameplay worldは画面端まで表示してよいが、重要UIはSafe Area内に収める

Unity設定方針:

- `Canvas Scaler`: Scale With Screen Size
- `Reference Resolution`: 390 x 844
- `Screen Match Mode`: Match Width Or Height
- `Match`: 0.5を初期値にする
- `MainCamera`: Orthographic
- gameplay表示範囲はU2でプレイヤー、敵、XPの見え方を見て調整する

確認対象:

- 390 x 844
- iPhone系のnotchあり縦画面
- Android系の縦長画面
- Editor Game ViewのFree Aspectではなく固定解像度

---

## 11. Safe Area対応方針

方針:

- `SafeAreaFitter` 相当の小さなUIコンポーネントを作る
- HUD / overlay / bottom inputはSafe Area内へ収める
- 背景や敵、XPなどのgameplay表示はSafe Area外まで伸びてもよい
- LvUpカード、Result、Cutin相当の読み物UIはSafe Areaを強く守る

U1での完了条件:

- Safe Area内にHUD placeholderが収まる
- 下部virtual stick placeholderが端に寄りすぎない
- 390x844で上下のUIが欠けない

---

## 12. 入力方式

採用: New Input System。

理由:

- iOS / Androidのタッチ入力へ進めやすい
- バーチャルスティックを早期に検証できる
- Editorではkeyboard fallbackを用意し、手元確認を軽くする

方針:

- U1で `com.unity.inputsystem` を入れる
- 左下virtual stickを最小実装する
- Editor用にWASD / arrow key fallbackを持たせる
- 旧Input Manager依存は増やさない

---

## 13. U1開始条件

U1で実施する前に確認する:

- Unity HubでUnity 6 LTS系Editorの正確なpatchを確認
- 2D URP templateが作成できる
- `unity/VampPonUnity/` に空プロジェクトを作る
- 作成直後に不要生成物がgit管理対象になっていない
- `Boot.unity` / `Stage1.unity` を最小Sceneとして保存する
- 390x844 Game Viewで起動確認する

---

## 14. 今回作らないもの

- Web版Battle / UI / LevelUp / Cutin / Result / Collection の追加改善
- Unityの戦闘実装
- Unityのアセット大量import
- ScriptableObject実体の大量作成
- Addressables
- BGM / SE本格実装
- dawn_ticket通常run出現
- XPカーブ、敵HP、武器、候補生成の変更

---

## 15. Phase U1の最初のタスク

1. Unity HubでEditor patch確認
2. `unity/VampPonUnity/` に2D URP空プロジェクト作成
3. 生成物のgit対象確認
4. `Assets/_Project/` 最小フォルダ作成
5. Boot / Stage1 Scene作成
6. Portrait固定、Canvas 390x844、Safe Area placeholder
7. New Input System導入とvirtual stick placeholder
8. 起動確認後に小さくcommit
