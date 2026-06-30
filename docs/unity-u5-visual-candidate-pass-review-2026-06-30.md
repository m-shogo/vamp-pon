# Unity U5.0 Visual Asset Candidate Pass Review 2026-06-30

## Summary

U5.0は、Codex画像生成を使ったsmall batchの実アセット候補をgreenback透過処理し、Unity runtimeへ最小統合したvisual proof。

完成素材化、全キャラ展開、sprite sheet量産、full-screen art制作、完成UI画像貼り付けは行っていない。

## Environment

- Unity Editor version: `6000.5.1f1`
- ProjectVersion.txt: `6000.5.1f1`
- Render Pipeline: `U1UniversalRenderPipelineAsset` / 2D URP維持
- Project path: `unity/VampPonUnity/`

## Generated Small Batch

Codex画像生成を使った範囲:

- Yui Unity battle candidate: `u5-yui-battle-candidate-greenback.png`
- Ombu Unity battle candidate: `u5-ombu-battle-candidate-greenback.png`
- EXP fragment: `u5-exp-fragment-greenback.png`
- Lantern spark: `u5-lantern-spark-greenback.png`
- Ink burst: `u5-ink-burst-greenback.png`
- Collect trail source: `u5-collect-trail-greenback.png`
- Paper panel texture: `u5-paper-panel-greenback.png`
- Icon frame ornament: `u5-icon-frame-greenback.png`

Greenback source:

```txt
docs/design-targets/generated/unity-u5/greenback/
```

Alpha output:

```txt
docs/design-targets/generated/unity-u5/alpha/
```

Unity runtime import:

```txt
unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/
```

## Greenback To Alpha

既存toolのみ使用:

```sh
pnpm greenback:alpha --dir docs/design-targets/generated/unity-u5/greenback --out-dir docs/design-targets/generated/unity-u5/alpha --json
```

QA summary:

- real alpha channel: OK
- green spill remaining pixels: 8点すべて `0`
- edge touches: 8点すべて `false`
- no text / no watermark: 目視OK
- 180x180相当の余白: runtimeではPPU調整前提。sourceは余白あり、edge touchなし

Detailed JSON:

```txt
docs/design-targets/generated/unity-u5/u5-alpha-report.json
```

Contact sheet:

```txt
docs/design-targets/generated/unity-u5/u5-alpha-contact.png
```

## Unity Integration

Yui candidate:

- `U5VisualAssetLibrary.LoadBattleSprite("u5-yui-battle-candidate")`
- `YuiPlaceholder` のprocedural sprite fallback付きで差し替え
- single-frame runtime candidateのみ。48枚sprite sheetではない

Ombu candidate:

- `U5VisualAssetLibrary.LoadBattleSprite("u5-ombu-battle-candidate")`
- enemy pool生成時のspriteとして使用
- single-frame runtime candidateのみ

VFX source:

- EXP fragment: pickup sprite
- Lantern spark: projectile / hit / lantern pulse source
- Ink burst: death burst source
- Collect trail: EXP吸引trail source
- Pool境界はU3のVFX pool / maxActiveVfxを維持

UI material:

- Paper panel texture: `PaperCard` / `PaperButton` の背景spriteとして最小適用
- Icon frame ornament: `IconFrame` 背景spriteとして最小適用
- U4 procedural UI構造は維持
- 完成UI画像の貼り付けは行っていない

U2BattleController separation:

- UI部品生成は入れていない
- U4LevelUpDemoController / U4LevelUpOverlay の分離は維持
- Battle側はLevelUp通知hookとbattle/VFX sprite参照のみ

## Verification

Unity batchmodeでU5検証を実行。

```txt
AssetsLoaded: yui=True, ombu=True, exp=True, spark=True, ink=True, trail=True, paper=True, iconFrame=True
RuntimeSprites: yui=u5-yui-battle-candidate, firstOmbu=u5-ombu-battle-candidate
Movement: moved=True
Battle: spawned=7, fired=11, defeated=3, droppedExp=3, collectedExp=3
Feel: hitStop=10, cameraImpulse=3, lanternPulse=14, deathBurst=3, collectTrail=3
VFX: active=0, peak=10, played=38, dropped=0, maxActiveCap=18
LevelUpOverlay: activeBeforeRestore=True
TimeScale: beforeRestore=0, paused=True
```

検証後は `U4TimeScaleGuard.ForceRestore()` で復帰確認済み。

Console:

- compile error: なし
- runtime error / exception: なし
- warning CS: なし

## Resolution Check

```txt
390x844: canvas=True, safeHud=True, backgroundCover=True
360x800: canvas=True, safeHud=True, backgroundCover=True
430x932: canvas=True, safeHud=True, backgroundCover=True
```

Screenshots:

```txt
docs/design-targets/generated/unity-u5/u5-battle-390x844.png
docs/design-targets/generated/unity-u5/u5-battle-360x800.png
docs/design-targets/generated/unity-u5/u5-battle-430x932.png
docs/design-targets/generated/unity-u5/u5-levelup-390x844.png
docs/design-targets/generated/unity-u5/u5-vfx-proof-390x844.png
```

## LevelUp UI

- U4 overlayは表示できる
- Time.timeScale pause / restoreは確認済み
- PaperCard / PaperButton / IconFrameに素材を足しても構造は崩れていない
- 一部カード説明文の縦詰まりは残る。U5の素材統合で悪化した致命破綻ではないが、U6前に調整候補

## Runtime Included / Not Included

Runtimeに入れたもの:

- Yui single-frame battle candidate
- Ombu single-frame battle candidate
- EXP fragment
- Lantern spark
- Ink burst
- Collect trail source
- Paper panel texture
- Icon frame ornament

Runtimeに入れていないもの:

- full 48-frame sprite sheet
- all characters / all enemies
- full-screen 黒耀化 art
- full-screen ultimate art
- completed UI screenshot images
- text-baked runtime images
- Addressables / production asset approval flow

## Notes

- 壊れた静的TMP SDF assetはUnity終了時に例外を出していたため、Resources/Fonts側のSDF assetを外し、`ZenMaruGothic-Medium.ttf` からruntime TMP FontAssetを作るfallbackへ変更した。
- `public/assets/sprites/` は使用していない。
- `.venv`, `tmp`, `Library`, `Logs`, `UserSettings`, `.sln`, `.csproj` はcommit対象にしていない。

## Remaining Concerns

- Yui / Ombuはsingle-frame candidate止まり。
- VFX sourceは初回候補のみで、direction / animation variationは未着手。
- UI materialは最小適用のみ。Nine-slice最適化や部品別texture設計は未実施。
- LevelUpカード本文の縦詰まりはU6前に改善余地あり。
- 実機確認は未実施。
- AI生成素材はcandidate扱いであり、production approvedではない。

## Next

U5.1またはU6でやること:

- Yui / Ombu候補の採否レビューと、必要ならsingle-frameの再生成またはdirect edit
- Yui basic movement用の小さなturnaround / 4方向候補検討
- Ombuの小さなanimation候補検討
- VFX sourceの粒度とPPU / scaleの調整
- PaperCard / PaperButton / IconFrameのsliced texture化
- LevelUpカード本文の縦余白調整
- 実機またはdevice simulatorでSafe Area確認

## Git

- commit hash: final completion reportに記載
- `git status --short`: final completion reportに記載
