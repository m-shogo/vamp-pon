# Unity Repo Layout and LFS Guide

Unityへ進む時に、repoを壊さないための配置・Git・LFS方針。

Unity projectはファイル数が多く、LibraryやTempなど巨大な生成物も出る。何も決めずに入れると、repoが重くなり、Phaser側の作業も邪魔する。

## Core Rule

Unity projectを入れる前に、必ず配置とGit方針を決める。

いきなりUnity project丸ごとcommitしない。

## Recommended Options

### Option A: Separate Unity Repo

```txt
vamp-pon        = Phaser / docs / source of truth
vamp-pon-unity  = Unity demo project
```

Pros:

- Phaser repoを重くしない
- Unity生成物の影響が少ない
- Git LFSやUnity CIを別管理できる

Cons:

- docs/assets/dataの同期が必要
- repoが2つになる

Best if:

- Unity本格移行がまだ確定していない
- 30秒デモだけ作る
- Phaser作業を止めたくない

### Option B: Monorepo With Unity Subfolder

```txt
vamp-pon/
  src/
  public/
  docs/
  unity/
    LanternLedgerUnityDemo/
      Assets/
      Packages/
      ProjectSettings/
```

Pros:

- docsとUnity demoが同じrepoにある
- Phaserからの移行差分が追いやすい
- AI agentが参照しやすい

Cons:

- repoが重くなりやすい
- .gitignore/LFS設定を失敗すると危険
- Phaser PRとUnity PRが混ざりやすい

Best if:

- Unity移行がかなり濃厚
- Unity demoもこのrepoで管理したい
- Git LFSをきちんと管理できる

### Recommendation

最初の30秒Unity demoは、原則 **Option A: separate Unity repo** が安全。

ただし、このrepoにUnity関連docsとexport checklistを残す。

Unity本格移行が決まったら、Option BまたはUnity専用repoへ移行する。

## Unity Files To Commit

Commit:

```txt
Assets/
Packages/
ProjectSettings/
UserSettings? usually no
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
Assets/**/*.png if runtime asset
Assets/**/*.mat
Assets/**/*.controller
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
.vs/
.idea/
.DS_Store
*.csproj
*.sln
```

## Unity .gitignore Draft

If Unity project is added, use a Unity-specific `.gitignore`.

```gitignore
[Ll]ibrary/
[Tt]emp/
[Oo]bj/
[Bb]uild/
[Bb]uilds/
[Ll]ogs/
[Uu]ser[Ss]ettings/
[Mm]emoryCaptures/

*.csproj
*.sln
*.suo
*.tmp
*.user
*.userprefs
*.pidb
*.booproj
*.svd
*.pdb
*.mdb
*.opendb
*.VC.db

.DS_Store
Thumbs.db
.vs/
.idea/
```

## Git LFS Policy

Use Git LFS for large binary assets if Unity project enters repo.

Likely LFS candidates:

```txt
*.png
*.psd
*.aseprite
*.wav
*.mp3
*.ogg
*.fbx
*.blend
*.mp4
*.mov
*.unitypackage
```

But be careful:

- small PNG icons do not always need LFS
- design target screenshots may stay in docs but can bloat repo
- do not add huge generated concepts as runtime assets

Example `.gitattributes` candidate:

```gitattributes
*.png filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
*.aseprite filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.ogg filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.fbx filter=lfs diff=lfs merge=lfs -text
*.blend filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
```

Before adding LFS, confirm hosting/storage limits.

## Asset Import Rules

Unity runtime should import only clean assets.

Do not import:

- full AI UI screenshots
- images with baked text
- duplicate design concepts
- unused prototypes
- 4K concept art

Import:

- clean Yui sprite layer
- clean enemy sprites
- UI frame pieces
- icons
- effect textures
- background pieces needed for demo

## Folder Boundary

If Unity project is inside this repo:

```txt
unity/LanternLedgerUnityDemo/
```

Do not place Unity files directly under repo root.

Do not mix Unity runtime assets with Phaser `public/assets` unless explicitly exporting/importing.

## PR Rules For Unity Project

### Good PRs

```txt
PR U1: Unity project skeleton only
PR U2: BattleDemo scene + placeholders
PR U3: Object pooling + enemy/EXP demo
PR U4: UI prefabs
```

### Bad PRs

```txt
Unity project + all art + all data + all save + ads + build settings in one PR
```

## Required Before First Unity Commit

Checklist:

- [ ] Decide separate repo or subfolder
- [ ] Add Unity .gitignore
- [ ] Decide Git LFS policy
- [ ] Add README for Unity project
- [ ] Confirm no Library/Temp committed
- [ ] Confirm no giant concept screenshots committed as runtime assets
- [ ] Confirm TextMeshPro text will be runtime text

## If Using Separate Repo

Keep this repo as source of truth for:

- design docs
- Phaser implementation
- data map
- asset pipeline
- Unity runbook

Create a handoff document listing:

```txt
Phaser repo commit SHA
Design target paths
Runtime asset candidates
Data files to port
Unity repo commit SHA
Open questions
```

## Final Rule

Unity project structure must make the next PR easier, not heavier.

If Unity files make Phaser development harder, keep Unity separate until migration is proven.
