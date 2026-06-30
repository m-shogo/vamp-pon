# Unity Current Doc Index 2026-06-30

目的: Unity移行時に読む資料の優先順位を固定する。

---

## 最優先で読む資料

1. `docs/unity-u1-current-handoff-2026-06-30.md`
   - 2026-06-30時点の最新入口。
   - U0からU1へ進む判断、最新Web baseline、U1範囲、禁止事項を固定する。

2. `docs/final-screen-comparison-review-2026-06-29.md`
   - TOP / StageSelect / Result / Collection / LevelUp / Cutin / Battle HUD の最新UI基準。
   - U0資料より後のFINAL寄せ内容を含むため、Unity画面参照では優先する。

3. `docs/unity-u0-project-setup-plan.md`
   - Unity project配置、git管理、最初のScene構成、Safe Area、入力方式の土台。
   - 「Unityプロジェクトはまだ作成しない」はU0時点の記録。現在はU1へ進んでよい。

4. `docs/unity-implementation-roadmap.md`
   - U1〜U9の段階移行ロードマップ。
   - 全移植ではなく、technical spikeから比較する原則を守る。

5. `docs/unity-asset-import-map.md`
   - Unityへ持ち込む素材、保留素材、retired素材の判断表。
   - `public/assets/sprites/` を持ち込まないことを確認する。

6. `docs/unity-data-schema-map.md`
   - TypeScript dataをUnity ScriptableObjectへ移す方針。
   - `dawn_ticket` と `awakening_material` の抽選ゲートを守る。

7. `docs/181-current-production-canon.md`
   - 最新canon入口。
   - キャラ、敵、ステージ、アイテム、Unity Handoff fieldsの正本。

---

## 補助資料

- `docs/web-to-unity-system-map.md`
  - Web実装とUnity実装候補の対応表。

- `docs/phaser-to-unity-data-map.md`
  - Phaser/TypeScript側データをUnityに移す時の補助表。

- `docs/unity-data-conversion-pipeline.md`
  - 将来のデータ変換自動化案。
  - U1では自動化しない。

- `docs/unity-mobile-performance-budget.md`
  - Mobile向け性能予算。

- `docs/unity-game-feel-cookbook.md`
  - hit stop / particle / camera / EXP吸引などの気持ちよさ方針。

---

## 現在の判断

Unity移行資料は最新化済みとして扱う。

ただし、Unity本体はまだ作成していない前提で、次は `unity/VampPonUnity/` にUnity 6 LTS 2D URP projectを作る。

最初の目的は、完成移植ではなく **U1 technical spike**。

---

## 作業順

1. Unity HubでUnity 6 LTS patchを確認する。
2. `unity/VampPonUnity/` に2D URP projectを作る。
3. `Library/`, `Logs/`, `UserSettings/`, `.sln`, `.csproj` がgit管理外であることを確認する。
4. Boot / Stage1 sceneを作る。
5. 390x844縦画面、SafeAreaCanvas、dark paper背景を作る。
6. Yui placeholder、Ombu placeholder、lantern glow、EXP fragment吸引placeholderを入れる。
7. ここで初回U1 commitにする。

---

## U1でやらないこと

- Web/Phaser版の全移植
- 全キャラ/全敵/全ステージの移植
- Save / Collection / Achievement完全実装
- Addressables導入
- 課金/広告/ストア対応
- 3D化
- UIの完全再現
- Asset Factory exportのUnity自動import化

---

## 合格ライン

U1は、Unityでこのゲームを作る価値があるかを見る最初の土台。

合格条件:

- Editor再生できる
- 390x844で破綻しない
- Unity project生成物がgitに混ざらない
- ランタン光と暗い紙背景で世界観の入口が見える
- Yui / Ombu / EXP吸引placeholderでBattle feel検証へ進める

U1が通ったらU2へ進む。
