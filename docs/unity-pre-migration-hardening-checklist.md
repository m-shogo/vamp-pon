# Unity Pre-Migration Hardening Checklist

目的: Unity U1開始後に困らないよう、移行前に詰めるべき判断・禁止事項・確認手順を固定する。

---

## 結論

U1開始前に詰めるべきことは、ゲーム仕様の追加ではなく **後から直すと高くつく前提**。

特に以下を固める。

1. Editor / package / render pipeline
2. repo配置 / git除外 / binary管理
3. 390x844 / Safe Area / camera / PPU
4. importする素材の範囲
5. runtime ID / data責務
6. U1で作らないもの
7. U1合格基準と撤退基準

---

## 1. Unity環境

U1開始前に確認する。

- [ ] Unity Hubで利用可能なUnity 6 LTS patchを確認する
- [ ] `ProjectSettings/ProjectVersion.txt` を作成後の正とする
- [ ] 2D URPで作成する
- [ ] 2D URP templateが崩れる場合のみBuilt-in fallbackを検討する
- [ ] U1ではcustom render feature / shaderを書かない
- [ ] TextMeshProを使う
- [ ] New Input Systemを使う

決めないまま始めないこと:

- Editor patchを途中で上げる
- URP/Built-inを途中で何度も変える
- いきなりAddressablesを入れる

---

## 2. repo / git

現行決定:

```txt
unity/VampPonUnity/
```

- [ ] Unity projectをrepo root直下に置かない
- [ ] `Library/`, `Temp/`, `Obj/`, `Build/`, `Builds/`, `Logs/`, `UserSettings/` をcommitしない
- [ ] `.sln`, `.csproj` をcommitしない
- [ ] `.meta` はAssets配下で必ずcommitする
- [ ] `.gitattributes` のUnity YAML/binary方針を維持する
- [ ] U1ではLFSを新規有効化しない

U1後に必ず確認:

```txt
git status --short
```

生成物が混ざっていたら、先にgit管理方針を直してから続行する。

---

## 3. Unity project structure

U1最小構成:

```txt
unity/VampPonUnity/Assets/_Project/
  Art/
  Data/
  Prefabs/
  Scenes/
  Scripts/
  Settings/
```

最初から空フォルダを大量に作らない。
Unityは空フォルダにも `.meta` を作るため、U1では必要最小限にする。

---

## 4. screen / camera / Safe Area

固定:

```txt
Reference Resolution: 390 x 844
Orientation: Portrait
Canvas Scaler: Scale With Screen Size
MainCamera: Orthographic
```

U1で確認:

- [ ] Editor Game Viewで390x844相当を作る
- [ ] Free Aspectだけで確認しない
- [ ] SafeAreaCanvasを作る
- [ ] HUD placeholderがSafe Area内に収まる
- [ ] 背景や敵はSafe Area外に出てもよいが、読ませるUIはSafe Area内に収める
- [ ] Cutin / LevelUp / Result相当の将来UIはSafe Area重視とする

未決で残さないこと:

- Canvas基準解像度
- portrait固定かどうか
- virtual stickの下端余白
- 必殺/黒耀ボタンの右下safe area

---

## 5. PPU / sprite import

初期値:

```txt
PPU: 180 provisional
Filter Mode: Point or Bilinear comparison
Generate Mip Maps: false
Alpha Is Transparency: true
```

U1ではPPUを確定しすぎない。
Yui / Ombu / background / EXP fragmentの見え方を見て、U2で微調整する。

ただし、以下は先に決める。

- [ ] 180px原本を基準にimportする
- [ ] 32px/64px縮小版をruntime sourceとして増やさない
- [ ] Unity側表示サイズで調整する
- [ ] 白フリンジが出たらimport設定と素材を確認する

---

## 6. asset import範囲

U1で持ち込んでよいもの:

- Yui frame subset
- Ombu / Omburo sample
- Stage1 background 1枚
- EXP fragment placeholder用素材またはUnity primitive
- 最小icon数点

U1で持ち込まないもの:

- 全Core5キャラ
- 全48敵
- 全20ステージ
- 全武器/全パッシブ/全レア
- Cutin全部
- 図鑑/灯録素材全部
- `public/assets/sprites/`
- 生成参照画像そのもの
- 文字入り画像

---

## 7. data / runtime ID

U1で作るデータ型:

- `GameFeelConfig`
- `StageDefinition`
- `EnemyDefinition`
- `WeaponDefinition`

U1でやらないデータ:

- Save互換
- Collection全移植
- Achievement全移植
- Character 20人分SO
- Enemy 48体SO
- 全evolution/fusion/awakening SO

守ること:

- runtime IDはsnake_case維持
- 表示名は日本語TextMeshPro
- `dawn_ticket` はQA/復帰用で通常LvUp候補へ混ぜない
- `awakening_material` 相当だけ通常候補に出す

---

## 8. gameplay scope freeze

U1 gameplayは次だけ。

- Yui placeholderが見える
- Ombu placeholderが見える
- lantern glowが見える
- EXP fragmentが吸い込まれる
- minimal HUDがSafe Area内に出る

U1でやらない:

- 8分run
- level up full UI
- weapon inventory full system
- kokuyou full activation
- save/progression
- stage select
- result
- collection
- balance tuning

---

## 9. UI / visual reference

Unity U1の見た目は完成再現ではない。
ただし、方向性は以下を参照する。

- `docs/final-screen-comparison-review-2026-06-29.md`
- `docs/design-targets/final/`
- `docs/design-targets/review-screenshots/2026-06-29-final/`

守ること:

- 生成画像をそのまま貼らない
- 文字入り画像を使わない
- 紙UIはPrefab化前提で考える
- TOP/StageSelect/Result/Collectionの完成再現はU1ではしない

---

## 10. input

U1では入力を軽く作る。

- New Input System
- Editor keyboard fallback
- touch/virtual stick placeholder

U1で深追いしない:

- 複雑なgamepad対応
- gesture設計
- full mobile touch polish
- haptic

ただし、左下virtual stickと右下buttonのsafe area位置だけは早めに見る。

---

## 11. performance / pooling

U1では性能最適化をやりすぎない。

ただし、将来困らないために次を守る。

- Particle大量生成はしない
- EXP fragmentは将来poolできる構造にする
- enemy / projectile / pickup rootを分ける
- Updateで不要なFindをしない
- object数をU1から無制限に増やさない

U2以降:

- enemy spawn
- auto attack
- damage/death
- pooled ink burst
- pooled EXP fragments

---

## 12. font / Japanese text

U1ではTextMeshProを使う。

ただし、フォント最終決定はU1でやらない。

先に決めること:

- 日本語表示が化けないこと
- 390x844で小さい文字が読めること
- 文字を画像に焼かないこと

後で決めること:

- 商用利用フォント
- UI全体のfont asset strategy
- fallback font

---

## 13. audio

U1では音なしでもよい。

ただし、将来入れやすいようにrootだけ意識する。

- `Audio/Se/`
- `Audio/Bgm/`
- collect SE placeholderをU2以降で検討

U1でBGM/SE作り込みはしない。

---

## 14. QA / acceptance

U1完了時の最低報告:

- [ ] Unity Editor version
- [ ] project path
- [ ] 作成scene
- [ ] Game View 390x844確認
- [ ] Boot -> Stage1遷移
- [ ] SafeAreaCanvas確認
- [ ] Yui / Ombu / lantern / EXP吸引確認
- [ ] `git status --short`
- [ ] U2でやること
- [ ] U1であえてやらなかったこと

---

## 15. migration stop condition

Unity作業を止める条件:

- U1でrepoが汚れすぎる
- 390x844の視認性がWebより悪いまま改善余地が薄い
- lantern / ink / EXP吸引のUnity優位が見えない
- UIがgeneric Unity UIに寄る
- asset importが想定より重い
- Web側作業を邪魔し始める

止める場合は失敗ではない。
Web/Phaser継続判断として扱う。

---

## Pre-Migration final answer

U1前に最低限詰めるべきものはこの文書で完了。

次にやることは、`docs/unity-u1-agent-prompt.md` を使って `unity/VampPonUnity/` の最小Unity projectを作ること。
