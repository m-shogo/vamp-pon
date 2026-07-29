# ヨルノシルベ Codex Implementation Handoff

Date: 2026-07-29  
Status: **FIRST IMPLEMENTATION MILESTONE CONNECTED / U49 DEVICE EVIDENCE STILL BLOCKED**

Repository scope:

```txt
/Users/m-shogo/Developer/personal/vamp-pon
https://github.com/m-shogo/vamp-pon.git
```

Only this repository may be modified.

Target branch at handoff:

```txt
integration/u49-pr75-integrity-20260727
```

PR:

```txt
#76 Draft
```

---

# 1. Read first

Codex must read in this order before editing:

```txt
docs/CANON.md
docs/game-core-book-v1.md
docs/181-current-production-canon.md
docs/PLAYER-FACING-TERMINOLOGY.md
docs/SETTINGS-BASELINE.md
docs/meta-currency-display-migration-foundation-2026-07-29.md
docs/named-object-runtime-foundation-2026-07-29.md
docs/design-targets/generated/codex-implementation-freeze-v1.json
```

For player-facing economy wording, the 2026-07-29 split overrides the older combined `Currency / fragment = 記憶片` wording in production-history docs:

```txt
run pickup = 記憶片
persistent wallet Current display = 黒曜片
灯貨 = candidate, not Current
```

---

# 2. Non-negotiable product rules

Main loop remains:

```txt
戦う
→ 強くなる
→ buildする
→ Character / Support / 黒耀化 / Stage条件を変える
→ Clear Getter
→ gameplay unlock / meta growth
→ もう一度
```

Story/lore is depth and consequence, not a reading gate for power.

Do not turn this pass into a lore expansion project.

Correct visible term:

```txt
黒耀化
```

`黒曜化` is Legacy/search compatibility only.

Enemy defeat player verb:

```txt
ほどく
```

Game Over is not canonical literal death.

---

# 3. Player-facing copy lock

Use:

```txt
work title          = ヨルノシルベ
Start               = 夜へ出る
Stage select        = 夜の地図
Collection          = 灯録
Growth              = 旅支度
Settings            = 設定
Weapon              = 灯具
Initial weapon      = 最初の灯具
Run pickup          = 記憶片
Persistent wallet   = shared formatter Current label
Kokuyou             = 黒耀化
No-Kokuyou bonus    = 黒耀化なし
Clear               = 夜明け
Defeat title        = 夜に飲まれた
Rewards             = 持ち帰り
New Records         = 新しい記録
Elite               = 強敵
Defeated enemies    = ほどいた影
```

Known active production migration targets:

```txt
VAMP PON
忘れ物帳
黒曜研究所
黒曜なし
EXPを拾ってレベルアップ
Rewards
New Records
Elite
```

Do not repository-wide replace them. Search active runtime/reference surfaces and patch only current production copy.

---

# 4. Currency implementation

Persistent wallet Current display remains:

```txt
黒曜片
```

Candidate:

```txt
灯貨
```

Human approval:

```txt
false
```

Never rename the wallet to `灯貨` in this implementation pass.

Stable fields/IDs remain unchanged:

```txt
PlayerProfile.currency
PlayerProfile.totalCurrencyEarned
NightBoardReward.type:light_coin
UpgradeId:currencyGain
```

Before any manual currency-display edits:

```sh
pnpm currency-display:codemod:check
```

Expected coherent pre-write state is normally `PENDING`.

Apply:

```sh
pnpm currency-display:codemod:write
pnpm currency-display:codemod:check
```

After successful write:

```txt
wallet formatter coverage = 11/11
```

The codemod must be used instead of manually editing only some of its protected surfaces.

If state is `PARTIAL` or `INVALID`, stop the currency write path, inspect drift, repair coherently, then re-run check.

---

# 5. First-run copy implementation

Required active copy:

```txt
指を置いて、そのまま動かす
攻撃は自動。
記憶片を拾ってレベルアップ。
```

Fail-forward copy must be assembled from player copy + shared currency formatter:

```txt
朝まで残れなくても、{Current persistent wallet name}は持ち帰れる。
```

Do not use `EXPを拾ってレベルアップ` when the pickup is visibly `記憶片`.

Do not explain the entire world, Bond, rarity, slot rules or mystery in First Run.

---

# 6. Result copy implementation

Current production headings:

```txt
夜明け
夜に飲まれた
持ち帰り
新しい記録
強敵
ほどいた影
黒耀化なし
```

On failed run, supporting copy may use:

```txt
この読み方では、朝まで残れなかった。
```

Internal telemetry names such as `kills`, `elitesKilled`, `currencyEarned` remain unchanged.

---

# 7. Settings implementation baseline

Implement exactly these release-minimum preferences first:

```txt
bgmVolume       = BGM / range 0..1 / default 1
seVolume        = SE / range 0..1 / default 1
hapticsEnabled  = 振動 / toggle / default true
reducedMotion   = 演出を控えめに / toggle / default false
```

Persistence:

```txt
APP_PREFERENCE
resetWithGameplayProgress = false
```

Do not store the same preference independently in multiple Scenes/controllers.

Desired ownership:

```txt
Settings UI
→ one preference owner/service
→ Audio owner
→ Haptic owner
→ visual/motion owner
```

Volume is a multiplier over authored mix.

Reduced Motion should weaken:

- camera shake
- large zoom
- long travel motion
- lantern pulse
- ink spread
- repeated/high-contrast flash

It must not delay when controls become available.

Do not add fake settings for services that do not exist yet.

---

# 8. Web / Unity boundary

The repository contains Web reference/runtime sources and production Unity runtime.

Do not assume one automatically updates the other.

For each implemented semantic change:

1. identify current source authority
2. identify active Web reference consumer if relevant
3. identify production Unity consumer
4. avoid duplicate ownership
5. keep IDs/save contracts stable
6. add/adjust tests/checkers
7. gather evidence separately

Unity runtime ownership contract remains authoritative for navigation/save/battle ownership.

Do not move battle/save responsibility into UI code.

---

# 9. Settings and copy do not change readiness

Even after code is implemented, do not automatically set:

```txt
physicalDeviceReady=true
devicePlayableReady=true
audioReady=true
audioLatencyMeasured=true
hapticReady=true
hapticMeasured=true
mobileMetricsReady=true
rcReady=true
productionApproved=true
```

U49 remains blocked until physical-device evidence is complete.

---

# 10. Named-object / Collection boundary

Keep existing foundation intact:

```txt
Current21 lineages = 21
named objects = 126
Core5 current keeper UI = 5
Stage1 historical Clear Getter cells = 25 preserved
active future Stage1 nodes = 22
Legacy archive-only = 3
Collection save v2 = draft / not production-connected
global constellation = Definition / no production UI
全灯の朝 = fail-closed / denominator not frozen
```

Do not combine this copy/settings pass with:

- 21-character Keeper asset expansion
- production Collection save-v2 migration
- full constellation UI
- 全灯の朝 production scene
- launch denominator freeze

unless the current task explicitly advances to those phases after all earlier acceptance checks pass.

---

# 11. Human decisions Codex must not invent

Keep OPEN:

- final persistent wallet name
- Main Mystery final answer
- exact romance locks
- exact historical years
- sequel structure
- Boss46–48 exact Stage assignment where still open
- exact Stage waves/tuning
- launch-v1 100% required IDs
- Stage number presentation (`Stage 1` / `第1夜` etc.)
- Shop launch scope

Candidate must remain candidate until Human decision.

---

# 12. Required execution sequence

At task start:

```sh
cd /Users/m-shogo/Developer/personal/vamp-pon
git status --short
git branch --show-current
git rev-parse HEAD
git rev-parse origin/integration/u49-pr75-integrity-20260727 2>/dev/null || true
```

Do not discard unrelated changes.
If worktree is dirty, classify changes before editing.

Then run:

```sh
node --experimental-strip-types scripts/quality/check-player-facing-implementation-foundation.ts
pnpm currency-display:codemod:check
pnpm implementation:preflight:check
pnpm test
pnpm build
```

If a command fails because of actual repository code, investigate and fix before layering further implementation.
If external CI/platform infrastructure is broken, record that separately; do not call code green without local evidence.

Then implement in this order:

```txt
A. currency formatter 11/11
B. player-facing title/navigation/First Run/Result copy
C. settings preference owner + settings UI
D. Web/Unity semantic parity where each is active
E. tests/checkers
F. build/runtime smoke
G. visual review
H. docs/evidence/PR sync
```

After implementation run at minimum:

```sh
node --experimental-strip-types scripts/quality/check-player-facing-implementation-foundation.ts
pnpm currency-display:codemod:check
pnpm implementation:preflight:check
pnpm test
pnpm build
```

Also run relevant Unity checkers for files actually changed.

---

# 13. Visual acceptance

At minimum verify active screens at 390x844 reference scale and existing Compact/Standard/Large policy where applicable:

- TOP title/nav
- StageSelect / 旅支度
- Result clear
- Result fail
- First Run guidance
- Settings
- 灯録 entry/navigation if touched

Check:

- no text/ornament collision
- no English-only core heading remains
- 黒耀化 spelling
- 記憶片 vs persistent wallet distinction
- currency values still correct
- settings labels fit
- Reduced Motion does not break interaction timing

Do not claim visual approval from static compilation alone.

---

# 14. Git / PR completion

Commit in coherent units.
Do not rewrite history just to make commit count pretty.
Push the existing branch.
Keep PR #76 Draft unless all existing readiness gates independently justify changing it.

Final report must include:

```txt
start HEAD
end HEAD
branch
origin branch SHA
worktree status
commits created
files changed
commands executed and exact result
currency formatter coverage
legacy player-copy targets remaining
settings implementation status
Web/Unity scope actually changed
visual evidence status
U49 readiness unchanged/changed with evidence
known remaining debt
```

Never write `完璧` if current-head tests/build/device/visual gates are missing.

---

# 15. Definition of this implementation milestone

This milestone is complete when:

1. current-head preflight/tests/build pass locally or a concrete code failure is fixed and re-run
2. currency formatter is coherently 11/11
3. active product title is ヨルノシルベ
4. known active legacy copy targets are removed from production surfaces or explicitly justified
5. First Run uses 記憶片 and fail-forward copy
6. Result uses Current Japanese headings and 黒耀化 wording
7. Settings has one persisted owner and the four baseline preferences
8. gameplay save/reset does not erase app preferences
9. Web/Unity ownership is not duplicated
10. docs/checkers/evidence match actual implementation
11. no readiness flag is promoted without its own evidence

This is the **first implementation milestone after design freeze**, not final release approval.

---

# 16. 2026-07-29 implementation result

The frozen handoff was connected to the active Web reference and Unity production runtime.

```txt
currency formatter      = 11/11
active title             = ヨルノシルベ
Collection               = 灯録
Growth                   = 旅支度
First Run                = Current copy + shared wallet formatter
Result                   = Current Japanese copy
Settings                 = four APP_PREFERENCE values / one owner per runtime
Web tests                = 538 passed
Web production build     = passed
Unity batch compilation  = passed
Web visual QA            = TOP / 夜の地図 / 旅支度 / 灯録 / First Run /
                           Result clear / Result fail / Settings
Settings responsive QA   = Compact / Standard / Large
```

Web Settings uses `AppPreferenceOwner`; Unity uses `AppPreferenceService`. Both own the same
four semantic preferences and remain separate from gameplay progress reset. The old Unity
`GameSettingsSave` DTO remains only for save compatibility; active Settings UI and U49
feedback routing no longer use it as their preference owner.

Machine-readable visual review:

```txt
docs/design-targets/generated/codex-first-implementation-milestone-2026-07-29/visual-review.json
```

The Web visual pass also found and repaired two reachability/copy gaps:

- StageSelect no longer adds `play=1` to ordinary starts, so First Run guidance is reachable.
- the active Collection heading and StageSelect footer now use `灯録`; Growth navigation uses `旅支度`.

This result does not provide physical-device observations. The following remain unchanged:

```txt
U49 = BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE
physicalDeviceReady = false
devicePlayableReady = false
audioReady = false
audioLatencyMeasured = false
hapticReady = false
hapticMeasured = false
mobileMetricsReady = false
rcReady = false
productionApproved = false
```

---

# 17. 2026-07-29 current-head Simulator / preflight verification

The stale U47 source fingerprint was resolved by a fresh build and capture, not by
relabelling historical evidence or weakening the checker.

```txt
source/capture HEAD       = 904e2d5918e195acdca8e5a1904dc0b4cc0503da
Unity                     = 6000.5.1f1
iOS Simulator profile     = iPhone 17 Pro / iOS 26.5
canonical captures        = 23 / 23
semantic routes           = 11
source fingerprint        = e968269acf0d6d301dc37d4d0e33a0237191f1229c93ed02ec7de35e2a738df3
missing/unexpected/stale  = 0 / 0 / 0
duplicate evidence       = 0
U47 manifest check        = PASS
visual review             = PASS_CANONICAL_U47_SCOPE
implementation preflight = PASS
Web tests                 = 88 files / 538 tests PASS
Web production build      = PASS
Unity batch compilation   = PASS
U49 Editor routing        = PASS
```

The current StageSelect Settings entry and failed-Result terminology are intentional
differences from the previous U47 contact sheets. No clipping, overlap, missing glyph,
broken background, missing asset, or Result composition regression was observed in the
canonical 23 captures. Settings content and First Run are not members of that catalog;
their current-head Unity visual coverage therefore remains open and is not inferred from
the StageSelect or gameplay captures.

GitHub Actions runs for source HEAD `904e2d5918e195acdca8e5a1904dc0b4cc0503da`
did not start jobs:

```txt
Stage1 Quality run = 30434983311 / failure / steps executed false
CI run             = 30434983314 / failure / steps executed false
GitHub annotation  = recent account payments failed or spending limit must be increased
```

This is an external billing/spending-limit blocker reported by GitHub, not evidence of
a code failure or a successful workflow run. No repository workflow change was made.

Simulator and Editor results do not change the U49 boundary:

```txt
U49 = BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE
physicalDeviceReady = false
devicePlayableReady = false
audioReady = false
audioLatencyMeasured = false
hapticReady = false
hapticMeasured = false
mobileMetricsReady = false
rcReady = false
productionApproved = false
```
