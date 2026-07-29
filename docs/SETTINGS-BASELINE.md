# ヨルノシルベ Settings Baseline

Date: 2026-07-29  
Status: **CURRENT BASELINE / WEB AND UNITY RUNTIME CONNECTED / DEVICE EVIDENCE OPEN**

> 目的: 設定画面を後付けの寄せ集めにせず、release前に最低限必要なPlayer preferenceだけをCurrentとして固定する。
>
> このBaselineだけでU49 audio/haptic ready、accessibility ready、device verifiedとは扱わない。

Sources:

- `src/game/data/settingsBaseline.ts`
- `src/game/data/worldTerms.ts`
- `docs/ACCESSIBILITY-BASELINE.md`
- `docs/AUDIO-HAPTIC-DIRECTION.md`
- `docs/MOBILE-CONTROL-EXPERIENCE.md`

---

# 1. Required settings

Current release-minimumは4項目だけ。

| ID | Player label | Kind |
| --- | --- | --- |
| `bgmVolume` | BGM | 0..1 range |
| `seVolume` | SE | 0..1 range |
| `hapticsEnabled` | 振動 | toggle |
| `reducedMotion` | 演出を控えめに | toggle |

設定項目を増やすこと自体を品質としない。

---

# 2. BGM / SE

値は0..1のmaster multiplier。

```txt
0 = mute
1 = authored mix level
```

`1`はdevice最大音量や測定済みloudnessを意味しない。
既存の各SE/BGM authored volumeへ乗算する。

BGMとSEは分離する。
Master volumeを追加するなら後でよい。

---

# 3. Haptic

Player label:

```txt
振動
```

Rules:

- unsupported deviceではsafe no-op
- OFFならgameplay hapticを鳴らさない
- OFFでもLevelUp / damage / rare / 黒耀化 / Dawn等のcritical stateが視覚または音で分かる
- setting toggleの変更自体に強いhapticを要求しない

U49 device evidenceが揃う前に`hapticReady=true`へ上げない。

---

# 4. Reduced motion

Player label:

```txt
演出を控えめに
```

Internal concept:

```txt
reducedMotion
```

ONで弱める/置換する:

- camera shake
- large zoom
- long travel animation
- lantern pulse
- ink spread
- repeated/high contrast flash

置換例:

```txt
lantern pulse → static halo
ink spread → final shape + short fade
large zoom → smaller/shorter scale transition
```

絶対条件:

> motionを減らしても、操作可能になる時刻を遅くしない。

Reward hierarchyやstate changeはstatic light / icon / text / optional soundで残す。

---

# 5. Defaults

Definition default:

```txt
BGM = 1.0
SE = 1.0
振動 = ON
演出を控えめに = OFF
```

Platformのreduced-motion preferenceを安全に取得できる場合、初回default候補へ反映してよい。
一度Playerが明示変更した後はPlayer overrideを優先する。

Exact authored mixやdevice loudnessはplaytest/evidenceで調整する。

---

# 6. Persistence

全4項目:

```txt
persistence = APP_PREFERENCE
resetWithGameplayProgress = false
```

Gameplay save reset、永続強化respec、Collection migrationと分離する。

Playerがゲーム進捗を初期化しても、音量/振動/accessibility preferenceを勝手に消さない。

Versioned preference schemaを使う。
Unknown future fieldを理由に全設定を破棄しない。

---

# 7. Runtime ownership

UIは設定値を直接各systemへばら撒かない。

Desired:

```txt
Settings UI
→ AppPreference owner / Settings service
→ Audio owner
→ Haptic owner
→ Motion/visual owner
```

同じsettingをTopScene、Pause、BattleControllerが別々に保存しない。

Unityでは既存runtime ownership contractを優先する。
Web referenceも同じsemantic IDを使う。

---

# 8. Settings screen layout

Primary purpose:

> 今の体験を自分の端末に合わせる。

Recommended order:

```txt
設定

音
BGM           [slider]
SE            [slider]

操作・演出
振動          [toggle]
演出を控えめに [toggle]

[戻る]
```

One screenで足りる。
Tabを増やさない。

Touch targetは44x44pt相当以上を目標。
Toggle stateはcolorだけで表現しない。

---

# 9. Not in baseline

現時点で無理に作らない:

- language selector
- account
- cloud sync toggle
- push notification
- daily reminder
- analytics consent UI without analytics implementation
- quality preset without measured need
- left/right-handed mode before physical-device evidence
- text-size selector without layout support
- difficulty selectorをSettingsへ混ぜる
- gameplay progress resetを目立つ通常settingとして置く

必要性/evidenceが出た時に追加する。

---

# 10. Optional secondary action

High-value candidate:

```txt
操作ガイドをもう一度見る
```

既存onboarding reset機構を安全にUI化できるなら追加可能。
ただしrelease-minimum 4設定には数えない。

---

# 11. Accessibility acceptance

Settings実装後も確認する:

1. BGM=0でもstateが分かる
2. SE=0でもstateが分かる
3. Haptic OFFでもstateが分かる
4. Reduced Motion ONでも操作開始が遅れない
5. settings persistenceが再起動後も残る
6. gameplay resetでsettingsが消えない
7. unsupported hapticでexceptionにならない
8. Compact/Standard/Largeでlabelが欠けない

---

# 12. Readiness boundary

Definition/Settings UI実装だけでは以下をtrueにしない:

- audioReady
- audioLatencyMeasured
- hapticReady
- hapticMeasured
- physicalDeviceReady
- devicePlayableReady
- productionApproved

U49 evidenceは別に必要。

---

# 13. One sentence

> **SettingsはBGM・SE・振動・演出を控えめにの4つから始め、進捗saveと分離し、音やmotionを切ってもゲームの意味が消えないようにする。**

---

# 14. Runtime implementation record

2026-07-29 first implementation milestone:

| Runtime | Preference owner | Persistence | Consumers |
| --- | --- | --- | --- |
| Web | `AppPreferenceOwner` | versioned local APP_PREFERENCE | SettingsScene / AudioManager / haptic / reduced-motion feedback |
| Unity | `AppPreferenceService` | versioned PlayerPrefs APP_PREFERENCE | SettingsView / U49 audio-haptic owner / runtime feedback |

Both owners expose exactly the four baseline preferences. Settings UI sends updates to the
owner; it does not own gameplay save or battle behavior.

The Unity gameplay snapshot still contains the older `GameSettingsSave` DTO for backward
compatibility. It is not the active Settings UI or U49 preference source, and gameplay reset
does not clear `AppPreferenceService`.

Verified locally:

```txt
Web persistence tests       = passed
Web unsupported haptic      = safe no-op test passed
Web Compact/Standard/Large  = visually reviewed
Web preference re-entry     = visually retained
Unity batch compilation     = passed
Unity U49 editor routing    = passed (Editor haptic no-op)
```

Not verified:

```txt
physical-device volume behavior
physical-device haptic behavior
audio latency
haptic measurement
foreground/background device recovery
```
