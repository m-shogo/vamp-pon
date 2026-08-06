# Loading Seasonal v1

## Runtime flow

```txt
LoadingSeasonalView
  -> TopLivingNightView
    -> StageSelect / Collection
```

The loading view owns the first visible frame of the normal startup path. It selects one of four art slots, prevents the same slot from repeating across consecutive launches, keeps the screen visible for a minimum readable interval, then fades into the TOP scene.

`VAMPPON_AI_SIMULATOR_SMOKE` remains isolated: the existing canonical simulator evidence path does not create Loading or TOP.

## Four seasonal slots

The intended final sources are:

1. Spring — `桜灯る夜、記憶を辿る仲間たち.png`
2. Summer — `湖畔に灯る夏の星祭り.png`
3. Autumn — `紅葉舞う黄昏の森駅.png`
4. Winter — `雪灯りの町を舞う記憶の紙飛行機.png`

Those four generated binaries are not yet committed to this repository. To finish the runtime wiring without pretending otherwise, the manifest currently maps each slot to one of the four existing TOP key-art candidates as an explicit temporary fallback.

Replacing the fallback requires only:

- committing the approved seasonal PNGs,
- changing each manifest `sourcePath`, `width`, `height`, and `sha256`,
- optionally running `node --experimental-strip-types scripts/quality/report-loading-source-provenance.ts` to print the current binary metadata,
- running the loading/TOP Unity verification.

No runtime C# change should be required.

## Runtime behavior

- four-slot random rotation,
- last selected index stored in `PlayerPrefs`,
- a random result equal to the previous index advances to the next slot,
- editor capture override via `-vampPonLoadingArt=0..3`,
- editor capture hold via the Loading Seasonal menu,
- minimum visible duration: 1.35 seconds,
- 0.28-second fade into TOP,
- cover-style artwork crop through `AspectRatioFitter.EnvelopeParent`,
- built player loads compressed textures from `Resources/LoadingSeasonal`,
- editor reads the source art directly from the repository,
- textures are released when Loading is dismissed.

## Verification

Git-side verification:

```bash
node --experimental-strip-types scripts/quality/check-loading-top-runtime.ts
```

Local Unity 6000.5.1f1 verification on the PR worktree:

```bash
cd /Users/m-shogo/Developer/personal/vamp-pon

git fetch origin agent/top-living-night-key-art-v1

git show \
  origin/agent/top-living-night-key-art-v1:scripts/unity/run-loading-top-pr78-bootstrap.sh \
  | bash
```

The bootstrap runs real Unity compilation, stages all four compressed loading textures, checks the Loading -> TOP flow contract and non-repeating selector, writes evidence, commits it, and pushes it back to PR #78.

## Approval boundary

```txt
runtimeFlowImplemented=true
seasonalBinariesCommitted=false
runtimeCaptureComplete=false
humanVisualReviewComplete=false
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

The fallback art is implementation evidence, not final visual approval.
