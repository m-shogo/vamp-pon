# Unity U34 Stage1 Next Action Matrix

| action id | title | target phase | reason | blocker/caution addressed | expected outcome | risk | priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| u37 | final mobile tuning after device metrics | U37 | mobileMetricsReady=false | rc-block-mobile-metrics / touch / thermal | device-informed tuning | device availability | P0 |
| u38 | production approval re-check | U38 | productionApproved=false | rc-block-approval | updated gate result | unresolved blockers | P0 |
| u39 | final SE / AudioMixer pass | U39 | final SE未確定 | rc-block-final-se / audio latency | audio approval candidate | clipping / latency | P0 |
| u40 | final production asset replacement pass | U40 | assetReplacementReady=false | rc-block-final-assets | assetReplacementReady re-check | visual regressions | P0 |
| u41 | economy / reward hardening | U41 | reward economy draft | rc-block-economy | economy approval candidate | progression imbalance | P1 |
| u42 | release notes / known issues pass | U42 | known issues not final | release notes | RC known issues ready | stale docs | P1 |
