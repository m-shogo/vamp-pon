# U48 Production Asset 人間承認ガイド

この一覧は候補選択用です。AI推奨は承認ではなく、production接続も行っていません。

## 返答形式

以下の各行で `asset-group: A〜D` を選択してください。

```text
player-yui: C
enemy-onbu: C
stage1-background: C
pickup-exp: B
pickup-healing: D
common-projectile: C
hit-effect: B
enemy-death-effect: D
movement-trail: C
ground-area-black-ink-bottle: C
ground-area-streetlamp-ring: D
ground-area-dawn-ink-lamp: D
kokuyou-charging: B
kokuyou-ready: B
kokuyou-active: B
kokuyou-recovery: B
hud-hp-frame: B
hud-inventory-passive-slot: C
hud-inventory-weapon-slot: C
hud-kokuyou-gauge-frame: D
hud-rare-slot: D
hud-timer-frame: B
hud-top-status-frame: B
levelup-card-background: D
levelup-decline-button: B
levelup-description-area: B
levelup-icon-frame: B
levelup-selection-feedback: C
levelup-title-area: D
replacement-cancel-button: B
replacement-confirm-button: B
replacement-incoming-candidate-panel: D
replacement-modal-background: D
replacement-owned-slot-row: C
replacement-selected-slot-state: C
result-evolution-awakening-row: C
result-inventory-row: C
result-main-panel: D
result-retry-button: B
result-return-button: B
result-summary-header: D
stage-select-locked-unlocked-state: D
stage-select-metadata-row: D
stage-select-primary-button: B
stage-select-stage-card: D
stage-select-title-frame: D
```

## 全候補ID

### player-yui

AI推奨: C (`player-yui-c-lantern-bag`)

- A: `player-yui-a-runtime-baseline`
- B: `player-yui-b-silhouette`
- C: `player-yui-c-lantern-bag`
- D: `player-yui-d-paper-ink`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### enemy-onbu

AI推奨: C (`enemy-onbu-c-sprout-mist`)

- A: `enemy-onbu-a-runtime-baseline`
- B: `enemy-onbu-b-silhouette`
- C: `enemy-onbu-c-sprout-mist`
- D: `enemy-onbu-d-ink-death`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### stage1-background

AI推奨: C (`stage1-background-c-night-street`)

- A: `stage1-background-a-procedural-baseline`
- B: `stage1-background-b-paper-map`
- C: `stage1-background-c-night-street`
- D: `stage1-background-d-balanced`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### pickup-exp

AI推奨: B (`exp-pickup-b-paper-fragment`)

- A: `exp-pickup-a-runtime-baseline`
- B: `exp-pickup-b-paper-fragment`
- C: `exp-pickup-c-small-crystal`
- D: `exp-pickup-d-ink-light-hybrid`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### pickup-healing

AI推奨: D (`healing-pickup-d-restorative-bottle`)

- A: `healing-pickup-a-dawn-drop`
- B: `healing-pickup-b-bandaged-paper-charm`
- C: `healing-pickup-c-warm-lantern-dew`
- D: `healing-pickup-d-restorative-bottle`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### common-projectile

AI推奨: C (`common-projectile-c-paper-streak`)

- A: `common-projectile-a-lantern-spark`
- B: `common-projectile-b-pencil-slash`
- C: `common-projectile-c-paper-streak`
- D: `common-projectile-d-ink-line`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### hit-effect

AI推奨: B (`hit-effect-b-paper-nick`)

- A: `hit-effect-a-runtime-baseline`
- B: `hit-effect-b-paper-nick`
- C: `hit-effect-c-ink-pinprick`
- D: `hit-effect-d-lantern-cross`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### enemy-death-effect

AI推奨: D (`enemy-death-effect-d-paper-ink-burst`)

- A: `enemy-death-effect-a-runtime-baseline`
- B: `enemy-death-effect-b-paper-scatter`
- C: `enemy-death-effect-c-ink-dissolve`
- D: `enemy-death-effect-d-paper-ink-burst`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### movement-trail

AI推奨: C (`movement-trail-c-paper-flecks`)

- A: `movement-trail-a-runtime-baseline`
- B: `movement-trail-b-pencil-dust`
- C: `movement-trail-c-paper-flecks`
- D: `movement-trail-d-lantern-motes`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### ground-area-black-ink-bottle

AI推奨: C (`ground-area-black-ink-bottle-c-breathing-ink-edge`)

- A: `ground-area-black-ink-bottle-a-runtime-baseline`
- B: `ground-area-black-ink-bottle-b-irregular-ink-blot`
- C: `ground-area-black-ink-bottle-c-breathing-ink-edge`
- D: `ground-area-black-ink-bottle-d-paper-absorption-bottle`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### ground-area-streetlamp-ring

AI推奨: D (`ground-area-streetlamp-ring-d-ink-shadow-warm-light`)

- A: `ground-area-streetlamp-ring-a-runtime-baseline`
- B: `ground-area-streetlamp-ring-b-defined-lantern-ring`
- C: `ground-area-streetlamp-ring-c-broken-paper-light`
- D: `ground-area-streetlamp-ring-d-ink-shadow-warm-light`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### ground-area-dawn-ink-lamp

AI推奨: D (`ground-area-dawn-ink-lamp-d-lamp-wide-dawn-ring`)

- A: `ground-area-dawn-ink-lamp-a-runtime-baseline`
- B: `ground-area-dawn-ink-lamp-b-dual-layer-ink-light`
- C: `ground-area-dawn-ink-lamp-c-dawn-paper-rays`
- D: `ground-area-dawn-ink-lamp-d-lamp-wide-dawn-ring`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### kokuyou-charging

AI推奨: B (`kokuyou-charging-b-small-ink-wisps`)

- A: `kokuyou-charging-a-runtime-baseline`
- B: `kokuyou-charging-b-small-ink-wisps`
- C: `kokuyou-charging-c-lantern-shadow-flicker`
- D: `kokuyou-charging-d-paper-edge-corruption`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### kokuyou-ready

AI推奨: B (`kokuyou-ready-b-complete-dark-ring`)

- A: `kokuyou-ready-a-runtime-baseline`
- B: `kokuyou-ready-b-complete-dark-ring`
- C: `kokuyou-ready-c-restrained-black-flame-crown`
- D: `kokuyou-ready-d-lantern-inversion-pulse`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### kokuyou-active

AI推奨: B (`kokuyou-active-b-controlled-black-flame`)

- A: `kokuyou-active-a-runtime-baseline`
- B: `kokuyou-active-b-controlled-black-flame`
- C: `kokuyou-active-c-ink-fracture-aura`
- D: `kokuyou-active-d-lantern-eclipse-paper-distortion`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### kokuyou-recovery

AI推奨: B (`kokuyou-recovery-b-fading-soot`)

- A: `kokuyou-recovery-a-runtime-baseline`
- B: `kokuyou-recovery-b-fading-soot`
- C: `kokuyou-recovery-c-dragging-ink-shadow`
- D: `kokuyou-recovery-d-dim-lantern-paper-ash`

主な残リスク: 人間による実runtime表示、動き、実機可読性の最終確認が必要。

### hud-hp-frame

AI推奨: B (`hud-hp-frame-b-readability`)

- A: `hud-hp-frame-a-runtime-baseline`
- B: `hud-hp-frame-b-readability`
- C: `hud-hp-frame-c-paper-ink`
- D: `hud-hp-frame-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, low-hp。

### hud-inventory-passive-slot

AI推奨: C (`hud-inventory-passive-slot-c-paper-ink`)

- A: `hud-inventory-passive-slot-a-runtime-baseline`
- B: `hud-inventory-passive-slot-b-readability`
- C: `hud-inventory-passive-slot-c-paper-ink`
- D: `hud-inventory-passive-slot-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, occupied, selected, disabled。

### hud-inventory-weapon-slot

AI推奨: C (`hud-inventory-weapon-slot-c-paper-ink`)

- A: `hud-inventory-weapon-slot-a-runtime-baseline`
- B: `hud-inventory-weapon-slot-b-readability`
- C: `hud-inventory-weapon-slot-c-paper-ink`
- D: `hud-inventory-weapon-slot-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, occupied, selected, disabled。

### hud-kokuyou-gauge-frame

AI推奨: D (`hud-kokuyou-gauge-frame-d-production-balanced`)

- A: `hud-kokuyou-gauge-frame-a-runtime-baseline`
- B: `hud-kokuyou-gauge-frame-b-readability`
- C: `hud-kokuyou-gauge-frame-c-paper-ink`
- D: `hud-kokuyou-gauge-frame-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: charging, ready, active, recovery。

### hud-rare-slot

AI推奨: D (`hud-rare-slot-d-production-balanced`)

- A: `hud-rare-slot-a-runtime-baseline`
- B: `hud-rare-slot-b-readability`
- C: `hud-rare-slot-c-paper-ink`
- D: `hud-rare-slot-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, occupied, selected, disabled。

### hud-timer-frame

AI推奨: B (`hud-timer-frame-b-readability`)

- A: `hud-timer-frame-a-runtime-baseline`
- B: `hud-timer-frame-b-readability`
- C: `hud-timer-frame-c-paper-ink`
- D: `hud-timer-frame-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default。

### hud-top-status-frame

AI推奨: B (`hud-top-status-frame-b-readability`)

- A: `hud-top-status-frame-a-runtime-baseline`
- B: `hud-top-status-frame-b-readability`
- C: `hud-top-status-frame-c-paper-ink`
- D: `hud-top-status-frame-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default。

### levelup-card-background

AI推奨: D (`levelup-card-background-d-production-balanced`)

- A: `levelup-card-background-a-runtime-baseline`
- B: `levelup-card-background-b-readability`
- C: `levelup-card-background-c-paper-ink`
- D: `levelup-card-background-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected, disabled。

### levelup-decline-button

AI推奨: B (`levelup-decline-button-b-readability`)

- A: `levelup-decline-button-a-runtime-baseline`
- B: `levelup-decline-button-b-readability`
- C: `levelup-decline-button-c-paper-ink`
- D: `levelup-decline-button-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, pressed, disabled。

### levelup-description-area

AI推奨: B (`levelup-description-area-b-readability`)

- A: `levelup-description-area-a-runtime-baseline`
- B: `levelup-description-area-b-readability`
- C: `levelup-description-area-c-paper-ink`
- D: `levelup-description-area-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected, disabled。

### levelup-icon-frame

AI推奨: B (`levelup-icon-frame-b-readability`)

- A: `levelup-icon-frame-a-runtime-baseline`
- B: `levelup-icon-frame-b-readability`
- C: `levelup-icon-frame-c-paper-ink`
- D: `levelup-icon-frame-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected, disabled。

### levelup-selection-feedback

AI推奨: C (`levelup-selection-feedback-c-paper-ink`)

- A: `levelup-selection-feedback-a-runtime-baseline`
- B: `levelup-selection-feedback-b-readability`
- C: `levelup-selection-feedback-c-paper-ink`
- D: `levelup-selection-feedback-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected, disabled。

### levelup-title-area

AI推奨: D (`levelup-title-area-d-production-balanced`)

- A: `levelup-title-area-a-runtime-baseline`
- B: `levelup-title-area-b-readability`
- C: `levelup-title-area-c-paper-ink`
- D: `levelup-title-area-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected, disabled。

### replacement-cancel-button

AI推奨: B (`replacement-cancel-button-b-readability`)

- A: `replacement-cancel-button-a-runtime-baseline`
- B: `replacement-cancel-button-b-readability`
- C: `replacement-cancel-button-c-paper-ink`
- D: `replacement-cancel-button-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, pressed, disabled。

### replacement-confirm-button

AI推奨: B (`replacement-confirm-button-b-readability`)

- A: `replacement-confirm-button-a-runtime-baseline`
- B: `replacement-confirm-button-b-readability`
- C: `replacement-confirm-button-c-paper-ink`
- D: `replacement-confirm-button-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, pressed, disabled。

### replacement-incoming-candidate-panel

AI推奨: D (`replacement-incoming-candidate-panel-d-production-balanced`)

- A: `replacement-incoming-candidate-panel-a-runtime-baseline`
- B: `replacement-incoming-candidate-panel-b-readability`
- C: `replacement-incoming-candidate-panel-c-paper-ink`
- D: `replacement-incoming-candidate-panel-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected, disabled。

### replacement-modal-background

AI推奨: D (`replacement-modal-background-d-production-balanced`)

- A: `replacement-modal-background-a-runtime-baseline`
- B: `replacement-modal-background-b-readability`
- C: `replacement-modal-background-c-paper-ink`
- D: `replacement-modal-background-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default。

### replacement-owned-slot-row

AI推奨: C (`replacement-owned-slot-row-c-paper-ink`)

- A: `replacement-owned-slot-row-a-runtime-baseline`
- B: `replacement-owned-slot-row-b-readability`
- C: `replacement-owned-slot-row-c-paper-ink`
- D: `replacement-owned-slot-row-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected, disabled。

### replacement-selected-slot-state

AI推奨: C (`replacement-selected-slot-state-c-paper-ink`)

- A: `replacement-selected-slot-state-a-runtime-baseline`
- B: `replacement-selected-slot-state-b-readability`
- C: `replacement-selected-slot-state-c-paper-ink`
- D: `replacement-selected-slot-state-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected, disabled。

### result-evolution-awakening-row

AI推奨: C (`result-evolution-awakening-row-c-paper-ink`)

- A: `result-evolution-awakening-row-a-runtime-baseline`
- B: `result-evolution-awakening-row-b-readability`
- C: `result-evolution-awakening-row-c-paper-ink`
- D: `result-evolution-awakening-row-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, empty。

### result-inventory-row

AI推奨: C (`result-inventory-row-c-paper-ink`)

- A: `result-inventory-row-a-runtime-baseline`
- B: `result-inventory-row-b-readability`
- C: `result-inventory-row-c-paper-ink`
- D: `result-inventory-row-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, empty。

### result-main-panel

AI推奨: D (`result-main-panel-d-production-balanced`)

- A: `result-main-panel-a-runtime-baseline`
- B: `result-main-panel-b-readability`
- C: `result-main-panel-c-paper-ink`
- D: `result-main-panel-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: clear, failed。

### result-retry-button

AI推奨: B (`result-retry-button-b-readability`)

- A: `result-retry-button-a-runtime-baseline`
- B: `result-retry-button-b-readability`
- C: `result-retry-button-c-paper-ink`
- D: `result-retry-button-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, pressed, disabled。

### result-return-button

AI推奨: B (`result-return-button-b-readability`)

- A: `result-return-button-a-runtime-baseline`
- B: `result-return-button-b-readability`
- C: `result-return-button-c-paper-ink`
- D: `result-return-button-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, pressed, disabled。

### result-summary-header

AI推奨: D (`result-summary-header-d-production-balanced`)

- A: `result-summary-header-a-runtime-baseline`
- B: `result-summary-header-b-readability`
- C: `result-summary-header-c-paper-ink`
- D: `result-summary-header-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: clear, failed。

### stage-select-locked-unlocked-state

AI推奨: D (`stage-select-locked-unlocked-state-d-production-balanced`)

- A: `stage-select-locked-unlocked-state-a-runtime-baseline`
- B: `stage-select-locked-unlocked-state-b-readability`
- C: `stage-select-locked-unlocked-state-c-paper-ink`
- D: `stage-select-locked-unlocked-state-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: locked, unlocked。

### stage-select-metadata-row

AI推奨: D (`stage-select-metadata-row-d-production-balanced`)

- A: `stage-select-metadata-row-a-runtime-baseline`
- B: `stage-select-metadata-row-b-readability`
- C: `stage-select-metadata-row-c-paper-ink`
- D: `stage-select-metadata-row-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, disabled。

### stage-select-primary-button

AI推奨: B (`stage-select-primary-button-b-readability`)

- A: `stage-select-primary-button-a-runtime-baseline`
- B: `stage-select-primary-button-b-readability`
- C: `stage-select-primary-button-c-paper-ink`
- D: `stage-select-primary-button-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, pressed, disabled。

### stage-select-stage-card

AI推奨: D (`stage-select-stage-card-d-production-balanced`)

- A: `stage-select-stage-card-a-runtime-baseline`
- B: `stage-select-stage-card-b-readability`
- C: `stage-select-stage-card-c-paper-ink`
- D: `stage-select-stage-card-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: locked, unlocked, completed, selected。

### stage-select-title-frame

AI推奨: D (`stage-select-title-frame-d-production-balanced`)

- A: `stage-select-title-frame-a-runtime-baseline`
- B: `stage-select-title-frame-b-readability`
- C: `stage-select-title-frame-c-paper-ink`
- D: `stage-select-title-frame-d-production-balanced`

主な残リスク: 人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: default, selected。

