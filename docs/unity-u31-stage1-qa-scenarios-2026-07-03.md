# Unity U31 Stage1 QA Scenarios

All scenarios are written for mobile QA and Editor 390x844 fallback. Editor evidence does not replace real device performance or haptic measurement.

| Scenario | Expected behavior | Pass criteria | Caution criteria | Fail criteria | Evidence | Tuning note |
| --- | --- | --- | --- | --- | --- | --- |
| StageSelectからStage1開始 | Stage1 starts from StageSelect without confusing state. | Start button/state are readable. | Previous result stamp needs clearer hierarchy. | Start cannot be reached. | `01-stageselect-before-run-qa.png` | No tuning. |
| first 30 seconds | Opening has enemies, pickups, and readable HUD. | Empty moments are reduced and player is safe. | Editor-only feel. | Opening feels empty or lethal. | `03-first-30-seconds-qa.png` | Opening interval and cap lightly tuned. |
| first LevelUp | First LevelUp appears around the intended early window. | U26 target remains 30 seconds. | Distribution needs device run data. | First LevelUp cannot be reached. | `04-first-levelup-qa.png` | No target change. |
| weapon / passive選択 | Three choices are visible and selectable. | Choice text is readable at 390x844. | Final wording or icon art pending. | Choice cannot be read. | `04-first-levelup-qa.png` | No tuning. |
| XP pickup feel | XP route is legible and collection feels reachable. | Pickup radius supports early collection. | Device touch feel unmeasured. | Pickups are too hard to collect. | `03-first-30-seconds-qa.png` | Pickup radius 1.65 to 1.75. |
| heal pickup feel | Heal pickup remains a useful safety draft. | Heal does not dominate. | Drop rate remains draft. | Heal breaks risk/reward. | `03-first-30-seconds-qa.png` | No tuning. |
| enemy hit / defeat feel | Basic attack gives visible feedback. | Cooldown feels less sparse. | Final effect/audio pending. | Hit feedback is unreadable. | `05-mid-wave-qa.png` | Cooldown 950ms to 900ms. |
| player damage | Damage is visible but not punishing in opening. | Opening safety remains. | Device touch feel unknown. | Player dies unfairly. | `05-mid-wave-qa.png` | No damage tuning. |
| rare pickup or rare candidate | Rare candidate can be QA observed. | Rare proof exists. | Chance and reward remain draft. | Rare path impossible. | `06-rare-qa.png` | No tuning. |
| evolution condition / evolution演出 | Evolution can be reached in QA flow. | Reachability proof exists. | Final art/effect pending. | Evolution path blocked. | `07-evolution-qa.png` | No timing tuning. |
| Kokuyou ready / activation / active / ending | Kokuyou moments can be QA observed. | Ready and active evidence exists. | Device feel/haptic unmeasured. | State cannot be reached. | `08-kokuyou-qa.png` | No timing tuning. |
| clear flow | Clear result appears cleanly. | Result transition proof exists. | Reward economy draft. | Result cannot be reached. | `09-result-clear-qa.png` | No tuning. |
| defeat flow | Defeat still gives coherent draft reward. | Participation reward path exists. | Needs human run coverage. | Defeat breaks state. | `09-result-clear-qa.png` | No tuning. |
| Result reward / unlock | Reward and unlock are readable. | Unlock proof exists. | Economy not final. | Reward is duplicated or unreadable. | `10-result-reward-unlock-qa.png` | No tuning. |
| StageSelect progress reflection | Clear progress appears after result. | Progress reflection proof exists. | Final map polish pending. | Progress not reflected. | `11-stageselect-after-clear-qa.png` | No tuning. |
| Retry | Retry returns to a playable state. | Retry proof exists. | Device restart coverage pending. | Retry corrupts state. | `12-retry-qa.png` | No tuning. |
| save persistence after restart | Progress survives restart. | Device or PlayMode restart proof exists. | Editor-only repository proof. | Save loss or crash. | `stage1-not-measured-list.json` | NOT_MEASURED in U31. |
| audio連打確認 | Repeated sounds do not collapse. | Cooldown/cap logic prevents spam. | Final clips and latency unmeasured. | Missing clips crash or sound overwhelms. | `stage1-measurement-summary.json` | No volume tuning. |
| haptic event確認 | Haptic routes safely. | Editor no-op is safe. | Device vibration unmeasured. | Haptic route crashes. | `stage1-not-measured-list.json` | NOT_MEASURED in U31. |
| 390x844 readability | HUD and panels are readable. | Text does not overlap in QA shots. | Device safe area unmeasured. | Text overlaps or controls are hidden. | `screenshots/` | No UI redesign. |
