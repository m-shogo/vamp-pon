# Unity Editor Version Lock 2026-06-30

目的: Unity U1以降で使うEditor version / Render Pipeline / local pathを固定し、Codex / Claude Code / 作業者が迷わないようにする。

---

## Current Locked Editor

```txt
Unity Editor: 6000.5.1f1
Unity family: Unity 6.5
Architecture: Apple Silicon
Install path: /Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app
Project path: /Users/m-shogo/Developer/personal/vamp-pon/unity/VampPonUnity
```

このEditorをU1.1以降の基準にする。

---

## ProjectVersion rule

現在のUnity projectは、CodexのU1 skeleton作成時点で `6000.3.18f1` 仮値を持っている可能性がある。

U1.1でUnity Editor 6000.5.1f1を使ってprojectを開いたら、`ProjectSettings/ProjectVersion.txt` は実Editor versionに合わせる。

Expected:

```txt
m_EditorVersion: 6000.5.1f1
```

`m_EditorVersionWithRevision` はUnity Editorが正規化する値に従う。

---

## Render Pipeline rule

Built-in Render Pipelineは使わない。

```txt
Vamp Pon Unity版 = Unity 6.5.1f1 + 2D URP
Built-in Render Pipeline = 禁止
HDRP = 禁止
```

U1.1でやること:

- URP Renderer AssetをEditorで正式生成する
- 2D Renderer DataをEditorで正式生成する
- GraphicsSettingsへURP設定を割り当てる
- QualitySettingsへURP設定を割り当てる
- Built-in material / shader前提の設定を増やさない

---

## U1.1 verification rule

Unity Editor 6000.5.1f1 が存在する前提で、次を確認する。

- project opens in Unity Editor
- Package Manager resolves dependencies
- Console compile error is zero
- TextMeshPro initial import is handled if needed
- Boot scene opens and saves
- Stage1 scene opens and saves
- Boot -> Stage1 can play
- SafeAreaCanvas exists and important UI is inside Safe Area
- responsive Game View checks pass

Required Game View profiles:

```txt
390x844 reference
375x812 iPhone small notch-like
393x852 Android common portrait
430x932 iPhone large portrait
360x800 Android narrow portrait
412x915 Android tall portrait
```

---

## Git rule

Do not commit generated Unity junk:

```txt
Library/
Temp/
Obj/
Build/
Builds/
Logs/
UserSettings/
*.sln
*.csproj
```

Commit `.meta` files under Assets when created by Unity.

---

## If the Editor is not found

If `/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app` is not found, stop.

Do not guess another version.
Do not edit `ProjectVersion.txt` by hand.
Do not normalize scenes without Unity Editor.

Report the missing path and required next action.

---

## Final wording

Use this wording going forward:

```txt
Unity 6.5.1f1 / Apple Silicon / 2D URP fixed for U1.1
```
