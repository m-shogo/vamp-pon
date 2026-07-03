# Unity U34 Stage1 RC Caution Register

| id | risk | current mitigation | next action | target phase |
| --- | --- | --- | --- | --- |
| rc-caution-atlas-device | Sprite Atlas production packingは完了したが実機performance未確認 | U36 atlas evidence / checker | draw calls / batches測定 | U37 |
| rc-caution-draft-se | draft SEは入っているが本番音源ではない | U28 routing / U29 audio budget | final SE / AudioMixer pass | U39 |
| rc-caution-climax-reach | Kokuyou / Rare / Evolution reachabilityはEditor hardening済みだが実機未確認 | U33 verdict | device run distribution確認 | U37 |
| rc-caution-save | save persistenceはEditor evidence中心 | U27 save proof | restart persistence実機確認 | U37 |
| rc-caution-cloud-save | Cloud Save未導入 | local save proof | product requirement判断 | U38 |
| rc-caution-addressables | Addressables未導入 | direct asset / Resource candidates | asset loading方針再確認 | U38 |
| rc-caution-economy | economy draft | U27 reward draft明記 | economy hardening | U41 |
| rc-caution-stage2 | Stage2 placeholder unlock | placeholder明記 | known issuesへ記録 | U42 |
| rc-caution-thermal | mobile thermal未測定 | U29 budget | sustained device play | U37 |
| rc-caution-audio-voices | audio voice capは設計済みだが端末スピーカー確認未実施 | U29 cap 8 | audio stress実機確認 | U39 |
