# Unity U34 Stage1 RC Blocker Register

| id | severity | reason | evidence | unblock condition | target phase | risk if ignored |
| --- | --- | --- | --- | --- | --- | --- |
| rc-block-mobile-metrics | P0 | mobile FPS / memory / thermal / GC / draw call NOT_MEASURED | U35 verdict / not measured JSON | 実機metrics取得 | U37 | deviceで破綻する可能性 |
| rc-block-touch | P0 | touch responsiveness実機未測定 | U35 verdict | 実機touch確認 | U37 | 操作感がRC基準を満たさない |
| rc-block-audio-latency | P0 | audio latency実機未測定 | U35 verdict | device audio確認 | U39 | feedbackが遅れる |
| rc-block-haptic | P1 | haptic実機未測定 | U31/U35 | device haptic確認 | U39 | 過剰/不足に気づけない |
| rc-block-final-assets | P0 | final production asset replacement未完 | U36 asset re-evaluation | final assets approved | U40 | candidate artをfinal扱いする |
| rc-block-final-se | P0 | final SE / AudioMixer未確定 | U28 draft SE | final SE pass | U39 | 音割れ/音量/世界観risk |
| rc-block-balance | P0 | 本番balance未確定 | U33 hardening verdict | device-informed final tuning | U37 | clear率/難度が不明 |
| rc-block-economy | P1 | reward economy / unlock economy draft | U27/U33 | economy hardening | U41 | 進行報酬が崩れる |
| rc-block-asset-ready | P0 | assetReplacementReady=false | U36 re-evaluation | assetReplacementReady再判定 | U40 | asset boundaryがRC基準未達 |
| rc-block-approval | P0 | productionApproved=false | U30 gate | production approval re-check | U38 | RCをproduction承認と混同する |
| rc-block-mobile-ready | P0 | mobileMetricsReady=false | U35 verdict | mobileMetricsReady true criteria達成 | U37 | mobile品質保証なし |
