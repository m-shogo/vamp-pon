# Unity Pro Preflight Review 2026-06-30

目的: Unity移行前の資料・方針・ロードマップを、制作会社 / Unity経験者目線でレビューし、U1開始前後に潰すべき点を固定する。

---

## Verdict

現状は **U1 technical spikeを開始してよい**。

ただし、production移行としてはまだ完璧ではない。

```txt
Docs / direction: strong enough for U1
Production readiness: not yet
Main remaining risk: implementation proof, device proof, asset proof, performance proof
```

プロ目線では、資料はかなり整理されている。
一方で、本当に見るべきなのはU1〜U3の実物。

---

## What is already strong

### 1. Scope control

U1で全移植しない方針は正しい。

- U1 = project skeleton / responsive / safe area / placeholders
- U2 = minimum battle feel
- U3 = juice / VFX proof
- U7 = migration decision gate

これは制作会社目線でも安全。

### 2. Repo boundary

`unity/VampPonUnity/` に閉じる方針はよい。

- repo root直下にUnity filesを置かない
- `Library/`, `Logs/`, `UserSettings/`, `.sln`, `.csproj` をcommitしない
- `.gitattributes` でUnity YAML/text assetとbinary assetを整理済み

### 3. Responsive correction

390x844固定ではなく、各端末の画面サイズ / aspect / Safe Areaへ合わせる方針に直したのは正しい。

### 4. Asset policy

本番Unity素材をWeb素材の使い回し前提にしない判断は正しい。

```txt
AI生成 -> candidate -> QA -> approved -> Unity import -> in-game QA
```

この流れはproduction向き。

### 5. Stop condition

Unityが弱ければ止める判断を残しているのはよい。

---

## What a Unity pro will still ask

### 1. Which exact Unity version?

U1前にUnity Hubで実際のEditor patchを確認する必要がある。

Required output:

```txt
Unity Editor: 6000.x.xf1 LTS
ProjectSettings/ProjectVersion.txt committed
```

途中でEditor patchを上げない。

### 2. Is the app truly responsive?

390x844だけでは不足。

U1で最低限見る:

```txt
390x844 reference
375x812 iPhone small notch-like
393x852 Android common portrait
430x932 iPhone large portrait
360x800 Android narrow portrait
412x915 Android tall portrait
```

### 3. What is the actual camera strategy?

U1は完成でなくてよいが、U2までに決める。

- orthographic sizeを端末aspectでどう調整するか
- gameplay boundsをどう扱うか
- enemy spawn outside screenをどうするか
- background cover / crop / tile / parallaxをどう扱うか

### 4. What gets pooled?

U2〜U3で必須。

Pool candidates:

- enemies
- projectiles
- EXP fragments
- hit sparks
- ink particles
- damage numbers if used
- collect VFX

Unity公式も、頻繁に生成/破棄するobjectはpoolingでCPU負荷やGC overheadを減らせるとしている。

### 5. Where is data validation?

ScriptableObject化後に壊れやすいのはデータ。

U8前に必要:

- duplicate runtime ID check
- missing sprite check
- missing displayName check
- invalid evolution requirement check
- `dawn_ticket` normal candidate ban check
- `awakening_material` gate check

### 6. What is the import preset strategy?

Unity用素材を作り直すなら、import presetが必要。

U3〜U8で決める:

- character sprite import preset
- enemy sprite import preset
- UI icon import preset
- VFX texture import preset
- background import preset
- compression / filter / mipmap / PPU / atlas policy

### 7. What is the performance budget?

U1では仮でよい。
U3以降は数値化が必要。

Example budget to decide later:

- target FPS: 60
- max enemies on screen
- max projectiles
- max EXP fragments
- max particles
- max texture memory
- target build size
- maximum GC alloc per frame target

### 8. What is the UI prefab system?

U4で必要。

- PaperCard prefab
- PaperButton prefab
- IconFrame prefab
- ModalBase prefab
- SafeAreaPanel prefab
- HUDRoot prefab
- Gauge prefab

文字入り画像は禁止。
UIは部品化する。

### 9. What is the font strategy?

TextMeshProは正しい。
ただしproductionでは以下を決める。

- commercial-use Japanese font
- TMP font asset generation settings
- fallback font
- small text minimum size
- outline/shadow style

### 10. What is the mobile device test path?

U14まで待たず、U3あたりで最低1回は実機相当確認したい。

- iPhone系
- Android縦長
- notch / home indicator
- touch input
- thermal / battery rough check

---

## Pro advice by timing

### Before U1

Must:

- Unity HubのEditor patch確認
- responsive policyを読む
- `git status --short` baseline確認

Nice:

- Game Viewに複数スマホ解像度を追加する
- U1報告テンプレを守る

### During U1

Do:

- small commit only
- no mass asset import
- no Addressables
- no full battle
- no Web src changes
- no generated Unity junk commit

Check:

- Boot -> Stage1
- SafeAreaCanvas
- background cover
- placeholder readability
- git status

### Before U2

Decide:

- movement/input minimal strategy
- camera aspect strategy draft
- enemy spawn root / pool root / pickup root
- first pooling boundary

### Before U3

Decide:

- VFX cap
- particle texture source rules
- object pooling implementation
- hit stop / camera impulse / collect burst priority

### Before U4

Decide:

- UI prefab naming
- TMP font fallback
- paper UI parts
- button states
- safe area modal behavior

### Before U8

Decide:

- asmdef structure
- ScriptableObject validation
- import presets
- atlas policy
- LFS or no LFS
- tests / CI strategy

---

## Risk review

| Risk | Current state | Pro judgement |
| --- | --- | --- |
| Scope creep | Controlled | Good |
| Repo pollution | Mostly controlled | Good, must verify after Unity creation |
| Responsive screen | Corrected | Good, must implement |
| Asset reuse | Corrected | Good |
| Unity Editor version | Not confirmed | Must confirm locally |
| Actual game feel | Not proven | U2/U3 required |
| Performance | Not proven | U3+ required |
| UI production quality | Not proven | U4 required |
| Data safety | Planned | U8 validation needed |
| Real device behavior | Not proven | U3/U14 checks required |

---

## Pro verdict

制作会社 / Unity pro が見ても、方針資料としてはかなり良い。

ただし、以下の言い方が正確。

```txt
Unity移行の準備資料としては十分に良い。
U1を開始してよい。
production readyではまだない。
U1〜U3の実物検証で、Unityに本格移行する価値を証明する必要がある。
```

---

## Final recommendation

次は迷わずU1開始。

ただし、U1の目的は「移植」ではなく「証明」。

```txt
1. Unity projectが安全にrepo内で動く
2. 各スマホ画面にresponsive対応できる
3. ランタン光 / 暗い紙背景 / Yui / Ombu / EXP吸引が見える
4. Gitが汚れない
```

ここまで通ったらU2へ進む。

U2/U3で気持ちよくならなければ、そこで止める判断をする。
