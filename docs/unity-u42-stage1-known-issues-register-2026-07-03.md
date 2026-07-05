# Unity U42 Stage1 Known Issues Register

| id | severity | category | status | evidence | impact | workaround | owner/future phase | unblock condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| u42-ki-mobile-fps | P0 | mobile metrics | NOT_MEASURED | U35 verdict | 実機でframe pacingが破綻する可能性 | Editor evidenceは参考のみ | U37 | 実機FPSを取得しbudget内を確認 |
| u42-ki-memory | P0 | mobile metrics | NOT_MEASURED | U35 verdict | memory pressure / crash risk不明 | sustained runでログ取得 | U37 | memory / peak memoryを記録 |
| u42-ki-thermal | P0 | mobile metrics | NOT_MEASURED | U35 verdict | sustained playで熱劣化する可能性 | 短時間previewに限定 | U37 | thermal / battery trendを記録 |
| u42-ki-gc | P0 | performance | NOT_MEASURED | U35 verdict | stutter原因が残る | profiler passまでcaution | U37 | GC allocationを測定 |
| u42-ki-draw-calls | P0 | performance | NOT_MEASURED | U35 / U36 | atlas効果の実機確認がない | U36 atlas証跡を参照 | U37 | draw calls / batchesを測定 |
| u42-ki-audio-latency | P1 | audio | NOT_MEASURED | U39 verdict | feedbackが遅れて操作感を損なう可能性 | SEはfinal-candidate扱い | Audio device pass | 実機latencyを確認 |
| u42-ki-haptic-device | P1 | haptic | NOT_MEASURED | U35 / U39 verdict | 強すぎる/弱すぎる/鳴らない可能性 | hapticをapproval扱いしない | Haptic device pass | iOS / Android実機で確認 |
| u42-ki-audiomixer-final | P1 | audio | OPEN | U39 verdict | volume balance / routingがfinalではない | routing draftとして扱う | AudioMixer final | Unity .mixer assetとdevice mix review |
| u42-ki-speaker-clipping | P1 | audio | NOT_MEASURED | U39 risk map | 端末speakerで音割れする可能性 | Kokuyou / Evolutionを重点確認 | Audio device pass | speaker clipping確認 |
| u42-ki-production-balance | P1 | balance | OPEN | U33 verdict | clear rate / difficultyが本番確定でない | U33 hardening candidateとして扱う | U37 | device metrics後のtuning |
| u42-ki-production-economy | P1 | economy | OPEN | U41 verdict | reward値が本番経済確定でない | RC candidateとして扱う | U38 / later economy review | retention / retry dataで再判定 |
| u42-ki-cloud-save | P2 | save | NOT_APPLICABLE | U27 / U41 | 複数端末同期はない | local save previewとして扱う | Product decision | 導入判断が必要な場合のみ設計 |
| u42-ki-addressables | P2 | asset loading | NOT_APPLICABLE | U40 | runtime loading拡張は未導入 | direct asset / registry boundaryで運用 | Product decision | 導入判断が必要な場合のみ設計 |
| u42-ki-stage2-placeholder | P2 | content | OPEN | U27 / U41 | Stage2 unlock後に本体がない | placeholder文言で明示 | Stage2 phase | Stage2 scope決定 |
| u42-ki-final-approval | P0 | release gate | BLOCKED | U34 / U30 | RC / production承認と混同する危険 | productionApproved=falseを明記 | U38 | blocker register再判定 |
