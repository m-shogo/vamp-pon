# Unity U1 Current Handoff 2026-06-30

目的: Web/Phaser版の最新状態を、Unity U1開始時の判断・参照元として固定する。

---

## 結論

Unity移行は開始してよい。

ただし、いきなり全移植ではなく、既存docsの方針どおり **U1: Unity project setup + 30〜60秒比較デモの土台** から開始する。

現時点では Unity project 本体 (`unity/VampPonUnity/`) はまだ作られていない前提で扱う。まずUnity Hubで利用可能なUnity 6 LTS patchを確認し、そのEditorで `unity/VampPonUnity/` を作成する。

---

## 最新Web baseline

2026-06-30時点の最新baseline:

```txt
HEAD: e5a3f44ff7d61239f0599325bc8added44c4b655
message: Stageと報酬UIをFINAL寄りに調整
```

このcommit以降をUnity U1の画面参照基準にする。

重要: 2026-06-28作成のUnity U0資料は有効だが、非Battle UIはその後さらにFINAL寄りに更新されている。U1では必ずこのハンドオフと `docs/final-screen-comparison-review-2026-06-29.md` を併読する。

---

## 追加された最新資料

U1開始前に、次の資料も読む。

| Document | 用途 |
| --- | --- |
| `docs/unity-current-doc-index-2026-06-30.md` | Unity移行docsの最新優先順位。最初に読む入口。 |
| `docs/unity-u1-implementation-brief.md` | U1で作るもの、作らないもの、最小script/scene/asset方針。 |
| `docs/unity-u1-agent-prompt.md` | Claude Code / Codex / 作業エージェントへ渡すU1開始用プロンプト。 |

---

## 既存Unity移行土台の状態

| Document | Status | U1での扱い |
| --- | --- | --- |
| `docs/unity-migration-prep.md` | 有効 | 30〜60秒Vertical Sliceで比較する方針として使用 |
| `docs/unity-u0-project-setup-plan.md` | 有効 | Unity project配置、gitignore、最小Scene構成の正本として使用 |
| `docs/unity-implementation-roadmap.md` | 有効 | U1〜U9のPR/タスク分割として使用 |
| `docs/unity-asset-import-map.md` | 有効 | 持ち込み素材とretired素材の判定に使用 |
| `docs/unity-data-schema-map.md` | 有効 | ScriptableObject化の初期方針として使用 |
| `docs/final-screen-comparison-review-2026-06-29.md` | 最新UI基準 | TOP/StageSelect/LevelUp/Result/Collection/Cutin/Battle HUDの見た目基準として使用 |
| `docs/181-current-production-canon.md` | 最新canon入口 | キャラ・敵・アイテム・ステージ・Unity Handoff fieldの正本入口として使用 |

---

## 古くなっている/注意が必要な前提

### 1. 「Unityプロジェクトはまだ作らない」はU0時点の前提

`docs/unity-u0-project-setup-plan.md` では、U0の結論として「Unityプロジェクトはまだ作成しない」としている。
これはU0時点の正しい判断。

現在は、U0資料とFINAL寄せUI確認が揃ったため、次はU1へ進んでよい。

### 2. U0後にWeb UIがさらに更新されている

U0資料の画面方針は大枠有効。
ただし、TOP/StageSelect/Result/Collection/LevelUp/Cutin/Battle HUDの参照は `docs/final-screen-comparison-review-2026-06-29.md` を優先する。

### 3. Asset FactoryのUnity Handoff exportはあるが、Unity import自動化はまだない

`tools/asset-factory/src/storage.ts` に `buildUnityHandoffExport()` がある。
これはapproved素材のmanifestをUnityへ渡すJSON出力として使える。

ただし、Unity側でJSONを読み込み、自動import設定やScriptableObject生成まで行う仕組みはまだ作られていない。U1では自動化せず、まず手動import + 小さいPrefabでよい。

---

## U1で作るもの

配置:

```txt
unity/VampPonUnity/
```

最小管理対象:

```txt
unity/VampPonUnity/Assets/
unity/VampPonUnity/Packages/
unity/VampPonUnity/ProjectSettings/
```

最初のScene:

```txt
Boot.unity
Stage1.unity
```

U1の完了条件:

- Unity Editorで縦390x844相当のGame Viewが再生できる
- Boot -> Stage1へ遷移できる
- SafeAreaCanvasがある
- dark paper背景がある
- Yui placeholderが表示される
- Ombu placeholderが表示される
- Lantern Light2Dまたは代替glowが見える
- EXP fragment placeholderを1つ吸い込みカーブで動かせる
- `Library/`, `Logs/`, `UserSettings/`, `.sln`, `.csproj` がgitに出ない

---

## U1で持ち込む素材

| 用途 | Web側path | Unity側予定 |
| --- | --- | --- |
| ユイ | `public/assets/prototypes/sprite-sheets/core5-original-frames/yui/` | `Assets/_Project/Art/Characters/Yui/` |
| Stage1背景 | `public/assets/prototypes/backgrounds/` | `Assets/_Project/Art/Backgrounds/` |
| オンブ/オンブロ候補 | `public/assets/prototypes/sprite-sheets/enemies-original/` | `Assets/_Project/Art/Enemies/` |
| 武器icon最小 | `public/assets/prototypes/sprite-sheets/weapon/` | `Assets/_Project/Art/UI/Icons/Weapons/` |
| パッシブicon最小 | `public/assets/prototypes/sprite-sheets/passive/` | `Assets/_Project/Art/UI/Icons/Passives/` |
| レアicon最小 | `public/assets/prototypes/sprite-sheets/rare/` | `Assets/_Project/Art/UI/Icons/Rares/` |

禁止:

- `public/assets/sprites/` はretiredなので持ち込まない
- 生成参照画像をそのままruntime背景/UIとして貼らない
- 文字入り生成画像をUIとして使わない
- U1で20キャラ/48敵/20ステージを全部入れようとしない

---

## U1でデータ化するもの

最初は全部をScriptableObject化しない。
以下だけ作る。

1. `GameFeelConfig`
2. `StageDefinition`
3. `EnemyDefinition`
4. `WeaponDefinition`

注意:

- runtime IDはWeb互換のsnake_caseを維持
- 表示名は日本語TextMeshPro
- `dawn_ticket` はQA/復帰用。通常LvUp候補へ混ぜない
- `role === awakening_material` 相当だけ通常候補に出す

---

## 判定

現状のWeb版とUnity移行土台は、大枠で噛み合っている。

ただし、移行資料だけを読んで作業すると6/30のFINAL寄せUIを取りこぼす可能性があるため、この文書をU1の入口として扱う。

次に進むべき作業は **Unity U1 project setup**。
