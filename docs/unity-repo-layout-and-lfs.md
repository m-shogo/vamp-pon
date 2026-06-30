# Unity Repo Layout and Git Asset Guide

Unityへ進む時に、repoを壊さないための配置・Git・バイナリ管理方針。

この文書は 2026-06-30 時点のU1方針へ更新済み。

---

## Core Rule

Unity projectを入れる前に、必ず配置とGit方針を決める。

いきなりUnity project丸ごとcommitしない。

---

## Current Decision

U1では、このrepo内のサブフォルダへUnity projectを置く。

```txt
vamp-pon/
  src/
  public/
  docs/
  unity/
    VampPonUnity/
      Assets/
      Packages/
      ProjectSettings/
```

理由:

- Web版のdocs/assets/dataと対応を追いやすい
- U1は小さいtechnical spikeなので、別repo同期コストを増やさない
- `.gitignore` と `.gitattributes` を先に整備済み
- Unityが勝たなかった場合も、`unity/VampPonUnity/` を閉じれば撤退しやすい

注意:

- Unity本格化後、repo肥大化やLFS運用が重くなった場合はUnity専用repo分離を再検討する
- U1では大量素材を持ち込まない
- U1ではAddressablesやCIはまだ入れない

---

## Unity Files To Commit

Commit:

```txt
unity/VampPonUnity/Assets/
unity/VampPonUnity/Packages/
unity/VampPonUnity/ProjectSettings/
```

Usually commit:

```txt
Packages/manifest.json
Packages/packages-lock.json
ProjectSettings/*.asset
Assets/**/*.cs
Assets/**/*.prefab
Assets/**/*.unity
Assets/**/*.asset
Assets/**/*.mat
Assets/**/*.controller
Assets/**/*.meta
Assets/**/*.png if runtime asset and small enough
```

Do not commit:

```txt
Library/
Temp/
Obj/
Build/
Builds/
Logs/
MemoryCaptures/
UserSettings/
.vs/
.idea/
.DS_Store
*.csproj
*.sln
```

---

## Existing .gitignore Policy

Repo root `.gitignore` already excludes Unity generated files under `unity/**`.

Important excluded examples:

```gitignore
unity/**/[Ll]ibrary/
unity/**/[Tt]emp/
unity/**/[Oo]bj/
unity/**/[Bb]uild/
unity/**/[Bb]uilds/
unity/**/[Ll]ogs/
unity/**/[Uu]ser[Ss]ettings/
unity/**/*.csproj
unity/**/*.sln
unity/**/.vs/
```

U1 after project creation:

```txt
git status --short
```

must not show generated folders/files above.

---

## .gitattributes Policy

Repo root `.gitattributes` is intentionally conservative.

Current policy:

- Unity YAML/text assets use LF normalization
- image/audio/model/font files are marked binary
- Git LFS is not enabled yet

Reason:

- U1 should stay small
- enabling LFS before confirming hosting/storage/workflow can create friction
- small runtime PNGs can stay as normal git binaries for now

If Unity production becomes the primary path, revisit LFS before importing large assets.

---

## Git LFS Policy

U1:

```txt
Do not enable new LFS rules yet.
```

Reconsider LFS only when one of these happens:

- large PSD / Aseprite masters enter Unity runtime workflow
- large audio files enter repo
- generated screenshots/concepts start bloating history
- mobile build assets become too large for normal git workflow
- Unity project becomes the production source, not just spike

Likely future LFS candidates:

```txt
*.psd
*.aseprite
*.wav
*.mp3
*.ogg
*.fbx
*.blend
*.mp4
*.mov
large *.png only if needed
```

Before adding LFS, confirm hosting/storage limits and team workflow.

---

## Asset Import Rules

Unity runtime should import only clean assets.

Do not import:

- full AI UI screenshots
- images with baked text
- duplicate design concepts
- unused prototypes
- 4K concept art
- old `public/assets/sprites/`

Import:

- clean Yui sprite layer/frame subset
- clean enemy sample sprites
- UI frame pieces if needed
- icons needed for U1/U2
- effect textures needed for U1/U2
- one background piece needed for demo

---

## Folder Boundary

Unity project path:

```txt
unity/VampPonUnity/
```

Do not place Unity files directly under repo root.

Do not mix Unity runtime assets with Phaser `public/assets` unless explicitly copying/importing.

Unity must not directly reference Web `public/` at runtime.

---

## PR / Commit Rules For Unity Project

Good small commits:

```txt
U1: Unity project skeleton only
U1: Boot/Stage1 scene placeholders
U1: SafeArea + 390x844 setup
U1: Yui/Ombu/EXP placeholder demo
U2: movement + enemy spawn
U2: damage/death + pooling
```

Bad commits:

```txt
Unity project + all assets + all systems at once
Unity setup mixed with Phaser UI changes
Large generated screenshots added without review
Library/ or Logs/ committed
public/assets/sprites/ copied into Unity
```

---

## Exit / Rollback Plan

U1 should be reversible.

If Unity is not better, remove or stop updating:

```txt
unity/VampPonUnity/
```

Keep docs as research record.

No Web/Phaser runtime source should be blocked by U1.
